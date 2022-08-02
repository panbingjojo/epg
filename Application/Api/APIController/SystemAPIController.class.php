<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/5/16
 * Time: 11:18
 */

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\System\SystemManager;
use Home\Model\User\UserManager;

class SystemAPIController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        // TODO: Implement config() method.
    }

    /**
     * 获取数据内容段
     */
    public function getSpecialCodeFragmentAction()
    {
        $ret = array(
            "result" => -1,
        );

        // 条件：当首次进入查询成功后，后续操作才再次查询状态
        if (MasterManager::isReportUserInfo() == 1) {
            $result = UserManager::queryReportUserInfo(2);

            // 中国联通EPG，如果处理积分，就不处理帐单
            $isJifen = MasterManager::getJifenStatus();
            $areaCode = MasterManager::getAreaCode();
            $pList = [];//201,204,207,208,211
            if(CARRIER_ID == CARRIER_ID_GUANGXIDX){
                $isJifen = 0;//局方关闭积分兑换接口
            }
            if (((CARRIER_ID == CARRIER_ID_CHINAUNICOM && in_array($areaCode,$pList)) || CARRIER_ID == CARRIER_ID_CHINAUNICOM_MOFANG || CARRIER_ID == CARRIER_ID_GUANGXIDX) && $isJifen) {
                if (!empty($result) && $result->result == 0 && $result->jifen == 1) {
                    LogUtils::info("SystemAPIController::jifen ---> " . $result->jifen);
                    $instance = SystemManager::getInstance();
                    if ($instance) {
                        $ret['result'] = 0;
                        $ret['code'] = $instance->getPointExchangeCodeFragment();
                    }
                    LogUtils::info("SystemAPIController::getPointExchangeCodeFragmentAction --->jifen result:" . $ret['result']);
                    $this->ajaxReturn(json_encode($ret), "EVAL");
                    return;
                }
            }

            if (!empty($result) && $result->result == 0) {
                LogUtils::info("SystemAPIController::getSpecialCodeFragmentAction ---> start");
                $instance = SystemManager::getInstance();
                if ($instance) {
                    $ret['result'] = 0;
                    $ret['code'] = $instance->getSpecialCodeFragment();
                    if($ret['code'] == "wait"){
                        $ret['result'] = 1;
                    }
                }
            }
        }
        LogUtils::info("SystemAPIController::getSpecialCodeFragmentAction ---> result:" . $ret['result']);
        $this->ajaxReturn(json_encode($ret), "EVAL");
    }

    /**
     * 获取校验码
     */
    public function getVerifyCodeAction()
    {
        $result = "";
        switch (CARRIER_ID) {
            case CARRIER_ID_JIANGSUDX:
                $result = $this->getVerifyCode320092();
                break;
            case CARRIER_ID_JILINGD:
            case CARRIER_ID_JILINGD_MOFANG:
                $result = $this->getVerifyCode220094();
                break;
            case CARRIER_ID_HUBEIDX:
                $result = $this->getVerifyCode420092();
                break;
            case CARRIER_ID_GUIZHOUDX:
                $result = $this->getVerifyCode520092();
                break;
            case CARRIER_ID_GANSUDX:
                $result = $this->getVerifyCode620092();
                break;
        }

        LogUtils::info("getVerifyCodeAction --> result: " . json_encode($result));
        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    public static function getVerifyCode320092() {
        $result = json_decode(array(
            "errCode" => -1,
            "msg" => "参数不正确",
        ));

        $url = "http://123.59.206.196/cws/api/inner/pic_recog.php";

        $pic = $_REQUEST['pic'];
        $type = $_REQUEST['type'];
        if ($pic != null && !empty($pic) && $type != null && !empty($type)) {
            // 都不等于空
            $data = array(
                "carrier_id" => MasterManager::getCarrierId(),
                "type" => $type,
                "pri_id" => "x_ys4_x2_001",//"s_ys4_x2_001", // 识别算法
                "pic" => $pic,
            );

            $result = HttpManager::httpRequest("post", $url, json_encode($data));


            LogUtils::info("getVerifyCode320092 --> pic:".$pic."result:".json_encode($result));
            try {
                $pic = str_replace(' ', "+", $pic);
                if(is_object($result)){
                    SystemAPIController::base64_image_content($pic,'/data/Runtime/disimg/',$result['v_code']);
                }else{
                    $result = json_decode($result, true);
                    SystemAPIController::base64_image_content($pic,'/data/Runtime/disimg/',$result['v_code']);
                }
            } catch (HttpException $e) {
                LogUtils::info("getVerifyCode320092 --> result 1: " . $e);
            } catch (Exception $e) {
                LogUtils::info("getVerifyCode320092 --> result 2: " . $e);
            } finally {
                LogUtils::info("getVerifyCode320092 --> result 3: ");
            }
        }

        return $result;
    }

    /**
     * [将Base64图片转换为本地图片并保存]
     * @param  [Base64] $base64_image_content [要保存的Base64]
     * @param  [目录] $path [要保存的路径]
     */
    public static function base64_image_content($base64_image_content,$path,$imgname){
        //匹配出图片的格式
        if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image_content, $result)){
            $type = $result[2];
            $new_file = $path."/".date('Ymd',time())."/";
            if(!file_exists($new_file)){
                //检查是否有该文件夹，如果没有就创建，并给予最高权限
                mkdir($new_file, 0700);
            }
            $new_file = $new_file.$imgname.".{$type}";
            if (file_put_contents($new_file, base64_decode(str_replace($result[1], '', $base64_image_content)))){
                return '/'.$new_file;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    public static function getVerifyCode220094() {
        $result = json_decode(array(
            "errCode" => -1,
            "msg" => "参数不正确",
        ));

        $url = "http://123.59.206.196/cws/api/inner/pic_recog.php";

        $pic = $_REQUEST['pic'];
        $type = $_REQUEST['type'];
        if ($pic != null && !empty($pic) && $type != null && !empty($type)) {
            // 都不等于空
            $data = array(
                "carrier_id" => MasterManager::getCarrierId(),
                "type" => $type,
                "pri_id" => "dn", // 识别算法
                "pic" => $pic,
            );
//            $url = $url . "data=" . json_encode($data);
//            LogUtils::info("getVerifyCodeAction --> url: $url");
            $result = HttpManager::httpRequest("post", $url, json_encode($data));
        }

        return $result;
    }

    public static function getVerifyCode620092() {
        $result = json_decode(array(
            "errCode" => -1,
            "msg" => "参数不正确",
        ));

        $url = "http://123.59.206.196/cws/api/inner/pic_recog.php";

        $pic = $_REQUEST['pic'];
        $type = $_REQUEST['type'];
        if ($pic != null && !empty($pic) && $type != null && !empty($type)) {
            // 都不等于空
            $data = array(
                "carrier_id" => MasterManager::getCarrierId(),
                "type" => $type,
                "pri_id" => "dn", // 识别算法
                "pic" => $pic,
            );

            $result = HttpManager::httpRequest("post", $url, json_encode($data));
        }

        return $result;
    }


    public static function getVerifyCode520092() {
        $result = json_decode(array(
            "errCode" => -1,
            "msg" => "参数不正确",
        ));

        $url = "http://192.168.8.80:10002/cws/api/inner/pic_recog.php";

        $pic = $_REQUEST['pic'];
        $type = $_REQUEST['type'];

        LogUtils::info("task::img pic:".$pic);
        $image_info = getimagesize($pic);
        $image_data = file_get_contents($pic);
        $base64_image = 'data:' . $image_info['mime'] . ';base64,' .(base64_encode($image_data));
        LogUtils::info("task::img base64:".$base64_image);

        if ($pic != null && !empty($pic) && $type != null && !empty($type)) {
            // 都不等于空
            $data = array(
                "carrier_id" => MasterManager::getCarrierId(),
                "type" => $type,
                "pri_id" => "x_js1_x1_009", // 识别算法
                "pic" => $base64_image,
            );

            $result = HttpManager::httpRequest("post", $url, json_encode($data));
        }
        LogUtils::info("task::img result:".json_encode($result));
        return $result;
    }
    /**
     * 通过图片地址，下载图片并得到base64数据
     * @return mixed
     */
    public static function getVerifyCode420092() {
        $result = json_decode(array(
            "errCode" => -1,
            "msg" => "参数不正确",
        ));

        $url = "http://123.59.206.196/cws/api/inner/pic_recog.php";

        $picUrl = $_REQUEST['pic'];
        $type = $_REQUEST['type'];
        LogUtils::info("task::img url:".$picUrl);

        $image_info = getimagesize($picUrl);
        $image_data = file_get_contents($picUrl);
        $base64_image = 'data:' . $image_info['mime'] . ';base64,' .chunk_split(base64_encode($image_data));
        LogUtils::info("task::img base64:".$base64_image);
        if ($base64_image != null && !empty($base64_image) && $type != null && !empty($type)) {
            // 都不等于空
            $data = array(
                "carrier_id" => MasterManager::getCarrierId(),
                "type" => $type,
                "pri_id" => "dn", // 识别算法
                "pic" => $base64_image,
            );
            $result = HttpManager::httpRequest("post", $url, json_encode($data));
        }

        return $result;
    }
    /**
     * 通过图片地址，下载图片并得到base64数据
     * @return mixed
     */
    public static function getVerifyCode220094Ex() {
        $result = json_decode(array(
            "errCode" => -1,
            "msg" => "参数不正确",
        ));

        $url = "http://123.59.206.196/cws/api/inner/pic_recog.php";

        $picUrl = $_REQUEST['picUrl'];
//        $picUrl = "http://" . $_SERVER['HTTP_HOST'] ."/Public/img/verifyCode.jpg";
        $type = $_REQUEST['type'];
        $image_info = getimagesize($picUrl);

        $image_data = file_get_contents($picUrl);

        $base64_image = 'data:' . $image_info['mime'] . ';base64,' .chunk_split(base64_encode($image_data));

        if ($base64_image != null && !empty($base64_image) && $type != null && !empty($type)) {
            // 都不等于空
            $data = array(
                "carrier_id" => MasterManager::getCarrierId(),
                "type" => $type,
                "pri_id" => "dn", // 识别算法
                "pic" => $base64_image,
            );
//            $url = $url . "data=" . json_encode($data);
//            LogUtils::info("getVerifyCodeAction --> url: $url");
            $result = HttpManager::httpRequest("post", $url, json_encode($data));
        }

        return $result;
    }

    /**
     * @Brief:此函数用于获取全国行政省市区
     */
    public function queryChineseDistrictAction()
    {
        $proId = $_REQUEST['proId'];
        $result = SystemAPI::queryChineseDistrict($proId);
        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    /**
     * @Brief:山东电信数据上报探针接口
     * @param $action String 行为轨迹标识
     * @param $contentId String 行为轨迹携带参数
     */
    public function clickContentInfoAction($action,$contentId)
    {
        // 发起http请求
        $result = SystemAPI::clickContentInfo($_REQUEST['action'], $_REQUEST['contentId']);

        $ajax_return = array();

        $result = json_decode($result);
        if ($result->result == "0") {
            // LogUtils::info("$transactionID clickContentInfo success!");
            $ajax_return['result'] = 0;
            $this->ajaxReturn(json_encode($ajax_return), "EVAL");
        } else {
            // LogUtils::info("$transactionID clickContentInfo fail! description is {$result->description}");
            $ajax_return['result'] = -1;
            $this->ajaxReturn(json_encode($ajax_return), "EVAL");
        }
    }

    /**
     * 解析页面上的xml字符串，并以json格式返回
     */
    function parseXMLToJSONAction() {
        // 获取XML格式数据
        $xmlData = $_REQUEST['xmlData'];
        LogUtils::info("parseXMLToJSONAction xmlData: $xmlData");

        $ret = array(
            "result" => -1,
        );

        if (CARRIER_ID == CARRIER_ID_JILINGD ||
            CARRIER_ID == CARRIER_ID_JILINGD_MOFANG) {
            $xml = simplexml_load_string($xmlData);

            $webUrlIp = (string) $xml->webUrlIp;
            $flag = (string) $xml->flag;

            $ret['result'] = 0;
            $ret['flag'] = $flag;
            $ret['webUrlIp'] = $webUrlIp;
        }

        $this->ajaxReturn(json_encode($ret), "EVAL");
    }


    //盒子端鉴权
    function boxBillAuthResAction() {
        $orderInfo = SystemAPI::sendBillAuthRes("","","","","","0");
        $accountId = MasterManager::getAccountId();
        $orderId = $orderInfo->result->order_id;
        $payDt = $orderInfo->result->pay_dt;
        $payState = $orderInfo->result->pay_state;
        $isvip = $_REQUEST['isvip'];
        $result = SystemAPI::sendBillAuthRes($accountId,$orderId,$payDt,$payState,$isvip,"1");
        LogUtils::info("boxBillAuthResAction result:".json_encode($result));
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    function sendBillAuthResAction() {
        $accountId = $_REQUEST['accountId'];
        $orderId = $_REQUEST['orderId'];
        $payDt = $_REQUEST['payDt'];
        $payState = $_REQUEST['payState'];
        $isvip = $_REQUEST['isvip'];
        $result = SystemAPI::sendBillAuthRes($accountId,$orderId,$payDt,$payState,$isvip,"1");
        LogUtils::info("sendBillAuthResAction result:".json_encode($result));
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }
}