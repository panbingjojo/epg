<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 调试测试控制器
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/9/14 16:52
// +----------------------------------------------------------------------


namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\DebugAPI;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\Pay10000051;
use Redis;
use Think\Exception;

class DebugAPIController extends BaseController
{

    const CHINAUNICOM_REPORT_DATA_TYPE = array(
        "order" => "1", // 订购
        "enter" => "3", // 登录/进入应用
        "exit" => "4",  // 退出应用
        "route" => "6", // 浏览内容
        "player" => "7", // 播放内容
        "TVHelper" => "100" // tv助手
    );

    const REPORT_ACTION_DB_INDEX = 2;

    public function config()
    {
        return array();
    }

    /**
     * 获取测试启动apk需要的参数
     */
    public function getTestAPKInfoAction()
    {
        $result = DebugAPI::getTestAPKInfo();
        $this->ajaxReturn($result);
    }

    /**
     * 获取测试入口集的数据
     */
    public function getTestEntrySetDataAction()
    {
        $data = SystemAPI::getTestEntrySet();
        $this->ajaxReturn($data);
    }

    /**
     * 上报数据到局方（中国联通EPG） --- 目前
     */
    public function sendUserBehaviourWebAction()
    {
        $result = false;
        $type = $_REQUEST['type']; // 数据上报类型
        switch ($type) {
            case self::CHINAUNICOM_REPORT_DATA_TYPE["exit"]: // 退出产品应用时直接上报
                $result = self::sendUserBehaviour000051($type);
                break;
            case self::CHINAUNICOM_REPORT_DATA_TYPE["player"]: // 目前表示播放器类型
                $operateResult = $_REQUEST['operateResult'];
                $stayTime = $_REQUEST['stayTime'];
                $result = self::sendUserBehaviour000051($type, $operateResult, $stayTime);
                break;
            case self::CHINAUNICOM_REPORT_DATA_TYPE['TVHelper']:
                self::reportTVHelperInfo();
                break;
        }
        $this->ajaxReturn($result, 'EVAL');
    }

    public static function reportTVHelperInfo()
    {
        if (IS_REDIS_CACHE_LOG == 1 && defined("REDIS_LOCAL_IP")) {
            // 1、获取必要的参数账号、省份、版本号
            $account = $_POST['account'];
            $areaCode = $_POST['areaCode'];
            $version = $_POST['version'];
            // 2、构建redis的key值，report_2020_44
            $timeStamp = time();
            $reportYear = date('Y', $timeStamp);
            $reportWeek = date('W', $timeStamp);
            $redisKey = "report_{$reportYear}_{$reportWeek}";
            // 3、连接redis
            $redis = new Redis();
            $redis->connect(REDIS_LOCAL_IP, REDIS_LOCAL_PORT);
            $redis->auth(REDIS_AUTH_PASSWORD);
            $redis->select(self::REPORT_ACTION_DB_INDEX);
            // 4、完成数据存入操作
            $redisValue = "$account,$areaCode,$version";
            $redis->sAdd($redisKey, $redisValue);
            if (!$redis->exists($redis)) {  // redis判断键是否存在，存在则直接存入数据，否则设置redis过期时间
                $redis->expireAt($redisKey, strtotime("+1 week 1 days"));
            }
        }
    }

    /**
     * 上报数据到局方（中国联通EPG） --- 供控制器操作
     * @param: $type 1：订购；2：登录(登录CP首页)；3：启动(启动具体产品)；4：关闭(退出具体产品)；5：退出(退出CP首页)；
     * @return bool|false|int|mixed|string
     */
    public static function sendUserBehaviourAction($type)
    {
        $result = "";
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_NINGXIAGD:
                $result = DebugAPIController::_sendUserBehaviour640094();
                break;
            case CARRIER_ID_GUANGXIDX:
                $result = DebugAPIController::_sendUserBehaviour450092($type);
                break;
        }

        return $result;
    }

    /**
     * @brief: 中国联通用户行为数据上报
     * @param: $operateType 1：订购；2：登录(登录CP首页)；3：启动(启动具体产品)；4：关闭(退出具体产品)；5：退出(退出CP首页)；6：浏览（产品内浏览）；7：使用(产品内使用的具体内容) ；
     * @param: $operateResult
     *         操作类型=1时需上报：0：订购成功；记录对应错误码：订购失败；
     *         操作类型=7时需上报：产品内的具体内容名称（内容名称长度不超过20）；
     * @param: $stayTime
     *         操作类型=7时需上报，目前表示当前观看视频的时长；
     * @return bool|false|int|string
     */
    public static function sendUserBehaviour000051($operateType, $operateResult = null, $stayTime = null)
    {
        $reportCarriers = [CARRIER_ID_CHINAUNICOM, CARRIER_ID_CHINAUNICOM_MOFANG]; // 目前只上报食乐汇和启生
        if (!in_array(CARRIER_ID, $reportCarriers)) return false;  // 非上报地区，直接返回
        $areaCode = MasterManager::getAreaCode();
        $positionNum = null;

        if (defined("UPLOAD_USER_BEHAVIOUR_POSITION_DATA")) {
            $array = eval(UPLOAD_USER_BEHAVIOUR_POSITION_DATA);
            $positionNum = $array[$areaCode];
            if ($areaCode == '201' || $areaCode == "216") {
                if (Utils::isIndependenceEntry() != 0) {
                    $positionNum = null;
                }
            }
            LogUtils::debug("getUsePositionNum: areaCode[$areaCode] ---> positionNum[$positionNum]");
        } else {
            LogUtils::debug("UPLOAD_USER_BEHAVIOUR_POSITION_DATA  undefined");
        }

        $timeFormat = date('YmdHis'); // timestamp是14
        $platForm = "";
        $epgInfoMap = MasterManager::getEPGInfoMap();
        if (defined("STB_MODEL_TYPE")) {
            $array = eval(STB_MODEL_TYPE);
            $platForm = $array[$epgInfoMap['StbVendor']];
            LogUtils::debug("get plat form is $platForm");
        }
        $tvPlatform = $platForm ? $platForm : 3; // 查询平台类型，如果不在华为和中兴，判断为烽火类型
        if (CARRIER_ID == CARRIER_ID_CHINAUNICOM) {
            // 局方抽查2021年1月份用户订购数据，发现除天津外省份无数据，局方回复是产品id不一致导致数据统计不一致，故修改产品ID
            $reportProductID = 'sjjkby25linux';
            $productId = $areaCode == '201' ? PRODUCT_ID_TJ : $reportProductID . "@" . $areaCode;
        } else { // 启生魔方按正常逻辑上报
            $enterPosition = MasterManager::getEnterPosition();
            $orderManager = new Pay10000051();
            $isSmallPack = in_array($enterPosition, $orderManager->getSmallBagPosition());
            $productId = $isSmallPack ? PRODUCT_ID_SMALL_BAG : PRODUCT_ID . "@" . $areaCode;
        }
        $userAccount = MasterManager::getAccountId(); //  用户的业务账号 举例：IPTV账号_运营商id
        $reportValueArray2 = array(                   // 调用接口上报的数据格式
            "cpId" => CPID, // CP_ID
            "cpKey" => CPID, // 启生魔方上报修改2 $cpKey CP_KEY CP秘钥 合作伙伴唯一标识，食乐汇同CP_ID，健康魔方单独分配
            "stbModel" => MasterManager::getSTBModel() ? MasterManager::getSTBModel() : "", // 盒子终端的型号，通过LMEPG.STBUtil.getSTBModel()方法获取
            "tvPlatform" => $tvPlatform ? $tvPlatform : "", // 平台类型 -- 平台类 1：华为 2：中兴 3：烽火
            "operateType" => $operateType, // 操作类型 按函数注释
            "operateResult" => $operateResult ? $operateResult : "", // 操作结果 按函数注释
            "operateTime" => $timeFormat, // 操作时间 -- 记录当前日志上报的时间戳
            "productId" => $productId, // 产品ID -- 用作计费订购的产品ID
            "positionNum" => $positionNum ? $positionNum : "", // 入口位置编号
            "staytime" => $stayTime ? $stayTime : "",// 页面操作停留时长
        );

        // 进行签名加密
        $originStr = CPID . "$userAccount$areaCode" . OUT_SOURCE . "$timeFormat";
        $sha256Signature = hash('sha256', $originStr, false);
        $sha256Signature .= $timeFormat;

        // 上报用户数据
        $header = array(
            'Content-type: application/json',
        );
        $postData = array(
            "userId" => $userAccount,               // 用户的业务账号
            "carrierId" => $areaCode,               // 运营商ID
            "outSource" => OUT_SOURCE,                    // 调用方标识
            "signature" => $sha256Signature,        // 签名加密
            "cpDataRecords" => array($reportValueArray2), // 上报数据列表
        );
        $jsonEncodeRes = json_encode($postData);
        LogUtils::info("sendUserBehaviour000051 request_params is " . $jsonEncodeRes);
        // 发起http请求
        $result = HttpManager::httpRequestByHeader("POST", USER_BEHAVIOUR_REPORT_URL, $header, $jsonEncodeRes);
        LogUtils::info("sendUserBehaviour000051 result is " . $result);

        if ($operateType == self::CHINAUNICOM_REPORT_DATA_TYPE["player"]) {
            try {
                MasterManager::setReportOperateTrace(1);
            } catch (Exception $e) {
                LogUtils::error("存取用户数据出错，" . $e->getMessage());
            }
        }

        $resObj = json_decode($result);
        $resultByApi = $resObj->result == 0;

        if (CARRIER_ID == CARRIER_ID_CHINAUNICOM || CARRIER_ID == CARRIER_ID_CHINAUNICOM_MOFANG) {
            // 修复问题
            $reportValueArray1 = array(                   // 使用文件上报的数据格式
                MasterManager::getAccountId(), //  用户的业务账号 举例：IPTV账号_运营商id
                $areaCode, //  运营商ID 如：204
                "cpId" => "lmjf", // CP_ID
                "cpKey" => "lmjf", // 启生魔方上报修改2 $cpKey CP_KEY CP秘钥 合作伙伴唯一标识，食乐汇同CP_ID，健康魔方单独分配
                "stbModel" => MasterManager::getSTBModel() ? MasterManager::getSTBModel() : "", // 盒子终端的型号，通过LMEPG.STBUtil.getSTBModel()方法获取
                "tvPlatform" => $tvPlatform ? $tvPlatform : "", // 平台类型 -- 平台类 1：华为 2：中兴 3：烽火
                "operateType" => $operateType, // 操作类型 按函数注释
                "operateResult" => $operateResult ? $operateResult : "", // 操作结果 按函数注释
                "operateTime" => $timeFormat, // 操作时间 -- 记录当前日志上报的时间戳
                "productId" => $productId, // 产品ID -- 用作计费订购的产品ID
                "positionNum" => $positionNum ? $positionNum : "", // 入口位置编号
                "staytime" => $stayTime ? $stayTime : "",// 页面操作停留时长
                null // 备用拓展字段
            );
            $reportValue = implode(',', $reportValueArray1);

            $reportTime = date('YmdH');
            $reportKey = "report_" . $reportTime;
            // 启生魔方上报修改3 $reportKey = "report_" . CARRIER_ID . "_" . $reportTime;
            // LogUtils::debug($reportKey . ">>>" . $reportValue);
            $resultByFile = Utils::pushRedis(2, $reportKey, $reportValue);

            // return $resultByApi && $resultByFile;
            DebugAPI::recordLog($reportValue);
        }

        return $resultByApi;
    }

    /**
     * @brief: 广西电信用户行为数据上报
     * @param: $type 上报类型
     */
    public function _sendUserBehaviour450092($type = 0)
    {
        $records = array(
            "gatherSource" => 4,
            "userId" => MasterManager::getAccountId(),
            "provinceId" => "771",
            "serviceType" => 10,
            "serviceName" => "39健康",
            "definition" => MasterManager::getPlatformType() == 'hd' ? 2 : 1,
            "gathSourceId" => "03200100000000000000000000000004",
            "gathTargetId" => "03200100000000000000000000000004",
            "gathDes" => "",
            "currentTime " => date('YmdHis'),
            "exitTime" => "",
            "userToken" => MasterManager::getUserToken(),
            "stbId" => MasterManager::getSTBId(),
            "stbMAC" => MasterManager::getSTBMac(),
            "userIp" => get_client_ip(),
            "spId" => SPID,
            "contentId" => "",
            "contentName" => "",
            "contentType" => "",
            "productId" => "",
            "actType" => 1,
            "gathTime" => date('YmdHis'),
            "path" => ""
        );

        $sendUrl = SEND_USER_BEHAVIOUR_URL . "?Request=" . urlencode(json_encode($records));
        LogUtils::info("sendUserBehaviourAction--> sendUrl: $sendUrl");
        LogUtils::info("sendUserBehaviourAction--> param: " . json_encode($records));
        $result = HttpManager::httpRequest("GET", $sendUrl, null);
        LogUtils::info("sendUserBehaviourAction--> result: $result");

        // 解析数据
        return $result;
    }


    /**
     * @brief: 宁夏广电用户行为数据上报
     * @return mixed
     */
    public function _sendUserBehaviour640094()
    {
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $records = array(
            "action_type" => "browsing",
            "sys_id" => "M",
            "user_id" => MasterManager::getAccountId(),
            "user_group_id" => $epgInfoMap['userGroup'],
            "epg_group_id" => "2",
            "stb_ip" => $epgInfoMap['userSystemInfo']['IP'],
            "stb_id" => $epgInfoMap['userSystemInfo']['STBID'],
            "stb_type" => $epgInfoMap['userSystemInfo']['STBType'],
            "stb_mac" => $epgInfoMap['userSystemInfo']['MAC'],
            "terminal_type " => date('YmdHis'),
            "log_time" => "",
            "page_id" => MasterManager::getUserToken(),
            "page_name" => MasterManager::getSTBId(),
            "mediacode" => MasterManager::getSTBMac(),
            "medianame" => get_client_ip(),
            "refer_type" => SPID,
            "refer_page_id" => "",
            "refer_page_name" => "",
        );

        $sendUrl = SEND_USER_BEHAVIOUR_URL . "?Request=" . urlencode(json_encode($records));
        LogUtils::info("sendUserBehaviourAction--> sendUrl: $sendUrl");
        LogUtils::info("sendUserBehaviourAction--> param: " . json_encode($records));
        $result = HttpManager::httpRequest("GET", $sendUrl, null);
        LogUtils::info("sendUserBehaviourAction--> result: $result");

        // 解析数据
        return $result;
    }

    /**
     * 获取测试启动apk需要的参数
     */

    public function testPingAction()
    {
        $time1 = $_POST['time1'];
        $time2 = date('Y-m-d H:i:s');
        $time_tatal = $time2;
//        $time3 = Utils::getMillisecond();
//        $time_tatal = (string)$time2 . ":" . (string)$time3;
        LogUtils::info("client time:$time1, server time:$time_tatal");
        $result = array('time1' => $time1, 'time_tatal' => $time_tatal);
        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    public function setDocInfoSessionAction()
    {
        $order = isset($_REQUEST['order']) ? $_REQUEST['order'] : '';
        $docInfo = isset($_REQUEST['docInfo']) ? $_REQUEST['docInfo'] : '';

        LogUtils::info("DocInfoSession order:".$order);
        LogUtils::info("DocInfoSession docInfo:".$docInfo);
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("DocInfoSession gettype epgInfoMap:".gettype($epgInfoMap));
        if(!empty($order)){
            $epgInfoMap['order'] = urlencode($order);
        }
        if(!empty($docInfo)){
            $epgInfoMap['docInfo'] = urlencode($docInfo);
        }
        MasterManager::setEPGInfoMap($epgInfoMap);
        $result = new \stdClass();
        $result->result = 0;
        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    public function getDocInfoSessionAction()
    {
        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : '';
        LogUtils::info("DocInfoSession type:".$type);
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $result = new \stdClass();
        $result->result = 0;
        $result->msg = $epgInfoMap[$type];
        LogUtils::info("DocInfoSession type result:".json_encode($result));
        $this->ajaxReturn(json_encode($result), "EVAL");
    }
}