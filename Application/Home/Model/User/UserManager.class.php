<?php

namespace Home\Model\User;

use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;

/**
 * 用户信息管理
 *
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/14
 * Time: 17:14
 */
class UserManager
{
    public static $userId;

    /**
     * 一键判断和缓存当前登录用户是否限制功能
     * @param $isVip //是否为vip（1是 0不是）
     * @param $vipInfo //查找的已订购vip信息。若为空无效，表示没有限制（因为无法兼容到极端情况了~~）
     * @author Songhui on 2019-12-26
     */
    public static function judgeAndCacheUserLimitInfo($isVip, $vipInfo)
    {
        $userLimitInfo = self::queryUserLimitFunc($isVip, $vipInfo);
        MasterManager::setUserFuncLimit($userLimitInfo);
    }

    /**
     * 获取当前登录用户的功能限制。
     * <pre>
     *  - 说明：当用户订购不同套餐，可能享有不同的功能，则仅处理返回被限制掉的功能。若无限制，返回限制列表为空。前端处理的时候
     * 必须和后端定义功能类型Constants.php->FUNC_XXX一致才可准确判断！
     *  - 使用：必须在启动载用户信息（包含：订购信息）时查找获取，并将最新结果缓存session，以便前端控制。
     * </pre>
     * @param $isVip //是否为vip（1是 0不是）
     * @param $vipInfo //查找的已订购vip信息。若为空无效，表示没有限制（因为无法兼容到极端情况了~~）
     * @return \stdClass
     * @author Songhui on 2019-12-26
     */
    public static function queryUserLimitFunc($isVip, $vipInfo)
    {
        $limit = new \stdClass();
        $limit->isVip = $isVip;
        $limit->desc = "当前用户，无功能限制";
        $limit->price = -1; //价格，当无限制时（享有全部功能），该值为-1
        $limit->allowLimit = 0; //限制功能开关（1-开启 0-关闭）
        $limit->limitFuncIDs = []; //限制的功能编号列表（若为空，表示无限制，即享有全部功能）

        // 校验一、订购的vip信息，仅vip用户查找传递有效
        if (!isset($vipInfo) || !is_object($vipInfo) || $vipInfo->result != 0) {
            LogUtils::error("getUserLimitFunc: 失败(默认：享有全部功能)！查询vip信息无效。" . json_encode($vipInfo));
            return $limit;
        }

        // 对应接口P-17029返回结构，例如：{"vip_id":"36","carrier_id":"630001","goods_type":"1","goods_name":"健康尊享包","price":"2900","discount":"1","expire":"30","vip_type":"2","img_url":"","description":"","insert_dt":"2019-05-20 16:10:14"}
        $vipCfg = $vipInfo->vip_cfg;
        if (!isset($vipCfg) || !is_object($vipCfg)) {
            LogUtils::warn("getUserLimitFunc: 失败(默认：享有全部功能)！查询vip信息但未找到订购何种套餐。" . json_encode($vipInfo));
            return $limit;
        }

        // 校验二、当前地区平台是否有定义“套餐-功能限制”：获取可订购VIP套餐及其对应的功能限制列表
        $payPackages = defined("PAY_PACKAGES") ? eval(PAY_PACKAGES) : null;
        if (null == $payPackages || !is_array($payPackages) || count($payPackages) == 0) {
            LogUtils::warn("getUserLimitFunc: 失败(默认：享有全部功能)！当前平台未定义套餐-功能限制哦。" . json_encode($payPackages));
            return $limit;
        }

        LogUtils::info("getUserLimitFunc: 成功！查询vip信息-订购何种套餐<1>：" . json_encode($vipInfo) . "\n套餐-功能限制定义<2>：" . json_encode($payPackages));

        $paidPrice = $vipCfg->price;
        $matchedPkg = $payPackages[$paidPrice];
        if (isset($matchedPkg) && is_array($matchedPkg["limitFuncIDs"]) && count($matchedPkg["limitFuncIDs"]) > 0) {
            $limit->price = $matchedPkg["price"];
            $limit->allowLimit = $matchedPkg["allowLimit"];
            $limit->limitFuncIDs = $matchedPkg["limitFuncIDs"];
            $limit->desc = $matchedPkg["desc"];
        }

        LogUtils::info("getUserLimitFunc: 成功！返回功能限制信息：" . json_encode($limit));
        return $limit;
    }

    /**
     * 判断用户是否是测试用户
     * @param $userId
     * @return bool 0、不是测试用户  1、是测试用户
     */
    public static function isTest($userId)
    {
        $result = UserAPI::isTestUser($userId);
        if ($result->result == 1) {
            return 1;
        }
        return 0;
    }

    /**
     * 判断用户是否是VIP用户
     * @param $userId
     * @return bool 0、不是vip 1、是vip
     */
    public static function isVip($userId)
    {
        $result = UserAPI::verifyVIP($userId);
        $resultJson = json_decode($result);
        // 返回result值含义 -->
        // 0: vip会员、-1:用户user_id与session_id校验失败、-2：服务器执行sql异常、-101：不是会员
        if ($resultJson->result == 0) {
            return 1;
        }
        return 0;
    }

    /**
     * 注册用户VIP身份
     * @param $userId
     * @return int
     */
    public static function regVip($userId)
    {
        $result = PayAPI::regVip($userId);
        if ($result->result == 0) {
            return 1;
        }
        return 0;
    }

    /**
     * 注销用户VIP身份
     * @param $userId
     * @return int
     */
    public static function unRegVip($userId)
    {
        $result = PayAPI::unRegVip($userId);
        if ($result->result == 0) {
            return 1;
        }
        return 0;
    }

    public static function queryVipInfo($userId){
        $result = UserAPI::queryVipInfo($userId);
        return $result;
    }

    /**
     * @Brief:此函数用于绑定手机号码或宽带账号
     * @param: $phoneNumber 用户手机号码
     * @return: $result 绑定结果
     */
    public static function bindUserAccount($phoneNumber)
    {
        $result = UserAPI::bindUserAccount($phoneNumber);
        LogUtils::info("bind user phone [$phoneNumber] result--->". $result);
    }

    /**
     * @Brief:此函数用于查询绑定的手机号码或宽带账号
     * @return: $result 查询绑定结果
     */
    public static function queryBindUserAccount()
    {
        $result = UserAPI::queryBindUserAccount();
        LogUtils::info("query bind user result--->". $result);
    }

    /**
     * 上传用户信息
     * @param $userId
     * @param $info
     */
    public static function uploadUserInfo($userId, $info) {
        $stbId = MasterManager::getSTBId() ? MasterManager::getSTBId() : "";
        $stbType = MasterManager::getSTBModel() ? MasterManager::getSTBModel() : "";
        $xrw = MasterManager::getXRequestedWith();
        $epgInfoMap = MasterManager::getEPGInfoMap();

        $postInfo = array(
            "isUnicomActivity" => $info["isUnicomActivity"],
            "header" => $info['header'],
            "userInfo" => $info['userInfo'],
            "stbId" => $stbId,
            "stbType" => $stbType,
            "ua" => MasterManager::getUserAgentInfo(),
            "xrw" => $xrw ? $xrw : "", // x-requested-with
            "epgDomain" => isset($info['epgDomain']) ? $info['epgDomain'] : "",

            //
            "UserID" => MasterManager::getAccountId(),
            "UserToken" => MasterManager::getUserToken(),
            "UserGroupNMB" => $epgInfoMap["UserGroupNMB"],
            "STBID" => $epgInfoMap["STBID"],
            "EpgGroupID" => $epgInfoMap["EpgGroupID"],
            "STBType" => $epgInfoMap["STBType"],
            "TerminalType" => $epgInfoMap["TerminalType"],
            "AreaNode" => $epgInfoMap["AreaNode"],
            "IP" => $epgInfoMap["IP"],
            "MAC" => $epgInfoMap["MAC"],
            "CountyID" => $epgInfoMap["CountyID"],
        );

        $carrierId = MasterManager::getCarrierId();
        $epgInfoMap = MasterManager::getEPGInfoMap();//得到缓存信息
        $userIp = $epgInfoMap['userIP'];
        if (empty($userIp)) {
            $userIp = Utils::getUserIPFromDomain(null);
            LogUtils::info("getUserIPFromDomain: " . $userIp);
        }

        //上报地址
        $orderType = 0;
        if ($info["isUnicomActivity"] == 1) {
            $orderType = $info['userInfo']['orderType'];
        }

        $data = array(
            'user_account' => MasterManager::getAccountId(),
            'user_id' => $userId,
            'carrier_id' => $carrierId,
            'ip' => $userIp,
            'platform_type' => MasterManager::getPlatformType() == STB_TYPE_HD ? SL_TYPE_HD : SL_TYPE_SD,
            'order_type' => $orderType,
            'order_info' => OrderManager::encrypt(json_encode($postInfo)),
        );

        $url = REPORT_ORDER_INFO_URL;
        LogUtils::info("UserManager::uploadOrder ---> reportUrl: " . $url);
        LogUtils::info("UserManager::uploadOrder ---> data: " . json_encode($data));
        $result = HttpManager::httpRequest("post", $url, $data);
        LogUtils::info("UserManager::uploadOrder ---> result: " . $result);
    }

    /*
    * @Brief:获取vip信息
    */
    public static function getVipInfo()
    {
        $result = UserAPI::getVipInfo();
        LogUtils::info("get vip info result--->" . $result);
        return $result;
    }

    /**
     * @brief: 查询是否要上报用户信息，$key参数要进行md5加密
     * @param: $type 查询类型 1--进入应用时查询，2--使用时查询
     * @return mixed
     */
    public static function queryReportUserInfo($type = 1) {
        $carrierId = MasterManager::getCarrierId();
        $key = "";
        switch ($carrierId) {
            case CARRIER_ID_XINJIANGDX:
                $key = "Wu*EA%T9&o8iB#my";
                break;
            case CARRIER_ID_QINGHAIDX:
                $key = "@l8Vbgtan3ygbc4s";
                break;
            case CARRIER_ID_GUIZHOUGD:
                $key = "sqrRVuVkxm9Kk^cL";
                break;
            case CARRIER_ID_GUANGXIGD:
                $key = 'kIOY%MPU$e!7VN1L';
                break;
            case CARRIER_ID_JILINGD:
                $key = '%iBqUzO#yy4qecsi';
                break;
            case CARRIER_ID_CHINAUNICOM:
                $key = 'Kp&n*#yZmQ47z327';
                break;
            case CARRIER_ID_NINGXIAGD:
                $key = 'Kp&n*#yZmQ47z327';
                break;
            case CARRIER_ID_GUANGXIDX:
                $key = 'zelJm^mqtix5XzEw';
                break;
            case CARRIER_ID_GUIZHOUDX:
                $key = 'Cyz2Td4C1yl2AVc9';
                break;
            case CARRIER_ID_NINGXIADX:
                $key = 'h8IqlczHjW2Ye&wA';
                break;
            case CARRIER_ID_HUBEIDX:
                $key = 'WOvE*%dTrO#eoHgz';
                break;
            case CARRIER_ID_HAINANDX:
                $key = 'PDU8ztNIoOef02lr';
                break;
            case CARRIER_ID_HENANDX:
                $key = 'SeWe#wof^1#Zjjmd';
                break;
            case CARRIER_ID_JIANGSUDX:
                $key = '6EmHHL5!Zjj2w1KI';
                break;
            case CARRIER_ID_SHANDONGDX:
                $key = 'Xo0GGLZzTjL6ys$P';
                break;
            case CARRIER_ID_GUANGDONGGD:
                $key = '4VXRCizMmn13mp*M';
                break;
            case CARRIER_ID_CHONGQINGDX:
                $key = 'NYe&RzoGF%%LKB7E';
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG:
                $key = '4yTBy#JOEs^FwebR';
                break;
            case CARRIER_ID_XINJIANGDX_TTJS:
                $key = 'TW6Z8aewR#!zXdnd';
                break;
            case CARRIER_ID_GANSUDX:
                $key = 'OXBEBnbTSy%H99x3';
                break;
            case CARRIER_ID_GUANGDONGGD_NEW:
                $key = "OMqXeeenELFkl6IO";
                break;
            case CARRIER_ID_MANGOTV_LT:
                $key = "qj3JG2g3kooK80wJ";
                break;
            case CARRIER_ID_SHANDONGDX_HAIKAN:
                $key = "M2ZSegNR5hQyASwb";
                break;
            case CARRIER_ID_HUNANDX:
                $key = "KZtI8a49bawEzOg5";
                break;
            case CARRIER_ID_HAIKAN_APK:
                $key = "OlZ8OLOUkE2Xi3A2";
                break;
            case CARRIER_ID_JILIN_YD:
                $key = "Blx24oVHhRcY0lSZ";
                break;
            case CARRIER_ID_SHANDONGDX_APK:
                $key = "nBJnnv7HovON0RT2";
                break;
            case CARRIER_ID_GANSUYD:
                $key = "un!1S1IMoiha5BKl";
                break;
            case CARRIER_ID_LDLEGEND:
                $key = "ya8ykVg4arTRx1SZ";
                break;
            case CARRIER_ID_JILINGD_MOFANG:
                $key = "0bkhVOfDXB8Zfr5D";
                break;
            case CARRIER_ID_GUIZHOUGD_XMT:
                $key = "qq3HS0tyEAZyzJ3B";
                break;
            case CARRIER_ID_JILINGDDX_MOFANG:
                $key = "yQkCDb03aBFnm3pz";
                break;
            case CARRIER_ID_NINGXIA_YD:
                $key = "lmhP9GRCye1OfgqP";
                break;
            case CARRIER_ID_SHANXIDX:
                $key = "twK5nIFNz*wGkXaI";
                break;
            case CARRIER_ID_CHINAUNICOM_APK:
                $key = "ttIctatnd3iqD134";
                break;
            case CARRIER_ID_QINGHAIDX_GAME:
                $key = "Ma7vLrrYnM5bLXmQ";
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG_APK:
                $key = "XVR7Veijzy3okdup";
                break;
        }

        if (empty($key)) {
            LogUtils::error("queryReportUserInfo:: not support this carrier-->" . $carrierId);
            return "";
        }
        $data = array("carrier_id"=>$carrierId, "key"=>md5($key),"user_account"=> MasterManager::getAccountId());
        $param = json_encode($data);

        if ($type == 1) {
            $url = QUERY_REPORT_USER_INFO_URL . "?data=$param";
        } else {
            $url = QUERY_CHECK_REPORT_USER_INFO_URL . "?data=$param";
        }

        LogUtils::info("UserManager::queryReportUserInfo ---> queryUrl: " . $url);
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::info("UserManager::queryReportUserInfo ---> result: " . $result);

        return json_decode($result);
    }

    /**
     * 上报订购的相关信息
     * @param $orderId
     * @param $status
     * @param $msg
     * @return mixed|string
     * @internal param int $type
     */
    public static function reportOrderInfo($orderId, $status, $msg) {
        $carrierId = MasterManager::getCarrierId();
        $key = "";
        switch ($carrierId) {
            case CARRIER_ID_XINJIANGDX:
                $key = "Wu*EA%T9&o8iB#my";
                break;
            case CARRIER_ID_QINGHAIDX:
                $key = "@l8Vbgtan3ygbc4s";
                break;
            case CARRIER_ID_GUIZHOUGD:
                $key = "sqrRVuVkxm9Kk^cL";
                break;
            case CARRIER_ID_GUANGXIGD:
                $key = 'kIOY%MPU$e!7VN1L';
                break;
            case CARRIER_ID_JILINGD:
                $key = '%iBqUzO#yy4qecsi';
                break;
            case CARRIER_ID_CHINAUNICOM:
                $key = 'Kp&n*#yZmQ47z327';
                break;
            case CARRIER_ID_NINGXIAGD:
                $key = 'Kp&n*#yZmQ47z327';
                break;
            case CARRIER_ID_GUANGXIDX:
                $key = 'zelJm^mqtix5XzEw';
                break;
            case CARRIER_ID_GUIZHOUDX:
                $key = 'Cyz2Td4C1yl2AVc9';
                break;
            case CARRIER_ID_NINGXIADX:
                $key = 'h8IqlczHjW2Ye&wA';
                break;
            case CARRIER_ID_HUBEIDX:
                $key = 'WOvE*%dTrO#eoHgz';
                break;
            case CARRIER_ID_HAINANDX:
                $key = 'PDU8ztNIoOef02lr';
                break;
            case CARRIER_ID_HENANDX:
                $key = 'SeWe#wof^1#Zjjmd';
                break;
            case CARRIER_ID_JIANGSUDX:
                $key = '6EmHHL5!Zjj2w1KI';
                break;
            case CARRIER_ID_GUANGDONGGD:
                $key = '4VXRCizMmn13mp*M';
                break;
            case CARRIER_ID_GUANGDONGGD_NEW:
                $key = "OMqXeeenELFkl6IO";
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG:
                $key = '4yTBy#JOEs^FwebR';
                break;
            case CARRIER_ID_JILINGD_MOFANG:
                $key = "0bkhVOfDXB8Zfr5D";
                break;
            case CARRIER_ID_JILIN_YD:
                $key = "Blx24oVHhRcY0lSZ";
                break;
            case CARRIER_ID_GUIZHOUGD_XMT:
                $key = "qq3HS0tyEAZyzJ3B";
                break;
            case CARRIER_ID_JILINGDDX_MOFANG:
                $key = "yQkCDb03aBFnm3pz";
                break;
            case CARRIER_ID_NINGXIA_YD:
                $key = "lmhP9GRCye1OfgqP";
                break;
            case CARRIER_ID_SHANXIDX:
                $key = "twK5nIFNz*wGkXaI";
                break;
            case CARRIER_ID_CHINAUNICOM_APK:
                $key = "ttIctatnd3iqD134";
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG_APK:
                $key = "XVR7Veijzy3okdup";
                break;
        }

        if (empty($key)) {
            LogUtils::error("reportOrderInfo:: not support this carrier-->" . $carrierId);
            return "";
        }

        $data = array(
            "carrier_id" => $carrierId,
            "key" => md5($key),
            "user_account" => MasterManager::getAccountId(),
            "order_id" => $orderId,
            "status" => $status,
            "msg" => urlencode($msg),
        );
        $param = json_encode($data);
        $url = REPORT_ORDER_STATUS_URL . "?data=$param";

        LogUtils::info("UserManager::reportOrderInfo ---> queryUrl: " . $url);
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::info("UserManager::reportOrderInfo ---> result: " . $result);

        return json_decode($result);
    }
    /**
     * 判断收藏状态
     * @param $itemId //判断收藏对象的id
     * @param $itemType //判断收藏对象类型（1 药品 2 疾病 3 症状 4健康自测项目）
     * @param int $currentPage //指定当前查询的页码，默认1页
     * @param int $pageNum //指定当前查询的数据条数，默认10000
     * @return int 收藏状态 0-未收藏 1-已收藏
     */
    public static function getCollectStatus($itemId, $itemType, $currentPage = 1, $pageNum = 10000)
    {
        $result = UserAPI::getCollectList($itemType, $currentPage, $pageNum);
        $ret = json_decode($result);

        if (is_object($ret) && $ret->result == 0 && is_array($ret->list)) {
            foreach ($ret->list as $itemObj) {
                if ($itemObj->item_id == $itemId) {
                    return 1; // 已收藏
                }
            }
        }

        return 0; // 未收藏
    }

    /**
     * 一键判断和缓存当前登录用户是否限制功能。注：必须订购成功后方可调用该方法。
     * @param $isVip //是否为vip（1是 0不是）
     * @param $paidPrice //订购成功套餐的价格（分）。该订购成功项价格必须与后台配置的一致哦~
     * @param $cwsOrderItem //订购成功的套餐项对象（从后台拉到，依次从前端透传进来）。以此加强获取更多详情，可能因为外部原因，传递为null。
     * @author Songhui on 2019-12-26
     */
    public static function judgeAndCacheUserLimitInfoWith($isVip, $paidPrice, $cwsOrderItem = null)
    {
        // 复用重载方法，简单构造vip配置信息对象传参
        $vipInfo = new \stdClass();
        $vipInfo->result = 0;//表示成功查询到订购vip用户。因为调用此前，因时序问题可能尚未上报到cws。
        $vipInfo->vip_cfg = new \stdClass();//是一个对象~

        // e.g. {"vip_id":"36","carrier_id":"630001","goods_type":"1","goods_name":"健康尊享包","price":"2900","discount":"1","expire":"30","vip_type":"2","img_url":"","description":"","insert_dt":"2019-05-20 16:10:14"}
        if (isset($cwsOrderItem) && is_object($cwsOrderItem)) {
            // 若外部提供了订购成功后的完整后台配置套餐项，直接使用
            $vipInfo->vip_cfg = $cwsOrderItem;
        } else {
            // 若外部未提供了订购成功后的完整后台配置套餐项，则手动构建一个同等数据结构
            $vipInfo->vip_cfg = json_decode(json_encode(array(
                "price" => $paidPrice,
            )));
        }

        LogUtils::info("judgeAndCacheUserLimitInfoWith: 手动构建vipInfo=" . json_encode($vipInfo));

        self::judgeAndCacheUserLimitInfo($isVip, $vipInfo);
    }

}