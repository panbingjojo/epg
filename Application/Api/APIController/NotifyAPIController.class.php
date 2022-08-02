<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Brief: 此接口用于提供外部给外调通知使用
 * Date: 2019/11/19
 * Time: 18:34
 */

namespace Api\APIController;

use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\GameAPI;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\Pay04630092;

class NotifyAPIController
{
    /**
     * @Brief:此函数用于访问鉴权接口
     */
    public function notifyPayAction()
    {

        $paramJson = json_encode($_REQUEST);
        LogUtils::info("notifyPay ---> param: " . $paramJson);
        $paramJson = json_decode($paramJson);
        $lmcid = $paramJson->lmcid;
        if (empty($lmcid)) {
            $lmcid = CARRIER_ID;
        }
        switch ($lmcid) {
            case CARRIER_ID_JIANGSUDX_OTT:
                $this->notifyPayAction320005($paramJson, $lmcid);
                break;
            case CARRIER_ID_SHANXIDX:
                $this->notifyPayAction610092($paramJson, $lmcid);
                break;
            case CARRIER_ID_HUBEIDX:
                $this->notifyPayAction420092(json_decode($_REQUEST['userInfo']), $lmcid);
                break;
            case CARRIER_ID_GUANGDONGGD_NEW:
                break;
            case CARRIER_ID_GUANGDONGGD:
                break;
            default:
                $this->notifyPayAction650092($paramJson, $lmcid);
                break;
        }
        //$request = json_encode(array("tradeInfo" => "iVb4xkparS3gWky7niKicfMWqF+yWGSCGMUTGMjfLnQrNHGJEopi1kwfTzJduKUEgIXGyAySvW/OxXKWmUqGxhOJ+2jr6ABZ7J6SyhVSO0Ii0SW1lyxNAIzY9nZ2XRjZt3BtmonbGiNzUhxQw3KBbO6RZIiY+imOGgqYPYyUp7MTjYQH9kvNXmy5N+aP9hCz"));

    }

    public function notifyPayAction610092($paramJson, $lmcid)
    {
        $tradeInfo2 = $paramJson->info;
        $tradeInfo = json_decode($tradeInfo2);
        if (!$tradeInfo) {
            LogUtils::info("notifyPay --->tradeInfo param is null");
            echo "failed";
            exit(0);
        }

        $params = array(
            "result" => "0",
            "offerId" => $tradeInfo->offerId,
            "orderEffDate" => $tradeInfo->orderEffDate,
            "orderExpDate" => $tradeInfo->orderExpDate,
            "isAutoRenew" => $tradeInfo->isAutoRenew,
            "prodId" => $tradeInfo->prodId,
            "prodName" => $tradeInfo->prodName,
            "opType" => $tradeInfo->opType,
            "accNbr" => $tradeInfo->accNbr,
            "transactionID" => $tradeInfo->transactionID,
            "itvCode" => $tradeInfo->itvCode
        );
        LogUtils::info("notifyPay ---> post tradeInfo: " . json_encode($params));
        if (empty($lmcid)) {
            LogUtils::info("notifyPay ---> carrierId is empty ");
        }

        MasterManager::setPlatformType("hd");
        $result = HttpManager::httpRequest("post", ORDER_CALLBACK, $params);//上报订购结果
        LogUtils::info("notifyPay ---> response success!!! result>>> " . $result);
        echo $result;

    }

    public function notifyPayAction650092($paramJson, $lmcid)
    {
        $tradeInfo = $paramJson->tradeInfo;
        if (!$tradeInfo) {
            LogUtils::info("notifyPay --->tradeInfo param is null");
            echo "failed";
            exit(0);
        }

        $decodeStr = Crypt3DES::decodeCBC($tradeInfo, Encrypt_3DES, "01234567");
        // 解密出来：orderId=133931448#itv#testiptv255#83000001#20191230153918|beginDate=2019-12-30 15:39:18|endDate=2020-01-30 15:39:18|validDays=30|autoRenew=1
        LogUtils::info("notifyPay --->tradeInfo: " . $decodeStr);
        $arr1 = explode('#', $decodeStr);
        $orderId = explode('=', $arr1[0]);
        $orderChannel = $arr1[1];
        $accountId = $arr1[2];

        $arr2 = explode('|', $arr1[4]);
        $beginDate = explode('=', $arr2[1]);
        $endDate = explode('=', $arr2[2]);
        $validDays = explode('=', $arr2[3]);
        $autoRenew = explode('=', $arr2[4]);

        $params = array(
            'user_account' => $accountId,
            'order_channel' => $orderChannel,
            'order_id' => $orderId[1],
//            'product_id' => $arr1[3],
            'order_dt' => $arr2[0] . "#" . $arr1[3],
            'begin_dt' => $beginDate[1],
            'end_dt' => $endDate[1],
            'valid_days' => $validDays[1],
            'auto_renew' => $autoRenew[1],
        );

        LogUtils::info("notifyPay ---> post tradeInfo: " . json_encode($params));
        if (empty($lmcid)) {
            LogUtils::info("notifyPay ---> carrierId is empty ");
        }

        MasterManager::setPlatformType("hd");
        $httpManager = new HttpManager(HttpManager::PACK_ID_REPORT_OUT_PAY_RESULT);
        $result = $httpManager->requestPost($params);

        LogUtils::info("notifyPay ---> response success!!! result>>> " . $result);
        echo "success";
    }

    public function notifyPayAction420092($paramJson, $lmcid)
    {
        $result = array("result"=> -1, "message"=> "param is null");
        $tradeInfo = $paramJson->orderId;
        if (!$tradeInfo) {
            LogUtils::info("notifyPay --->tradeInfo param is null");
            echo json_encode($result);
            exit(0);
        }

        LogUtils::info("notifyPay --->tradeInfo: " . $tradeInfo);

        $params = array(
            'user_account' => $paramJson->accountId,
            'order_channel' => "",
            'order_id' => $paramJson->orderId,
            'order_dt' => date("Y-m-d H:i:s"),
            'begin_dt' => date("Y-m-d H:i:s"),
            'end_dt' => date("Y-m-d H:i:s",strtotime ( '+1 month' )),
            'valid_days' => '30',
            'auto_renew' => 1,
            'vip_id' => 7, //25元
        );

        LogUtils::info("notifyPay ---> post tradeInfo: " . json_encode($params));
        if (empty($lmcid)) {
            LogUtils::info("notifyPay ---> carrierId is empty ");
        }

        MasterManager::setPlatformType("hd");
        $httpManager = new HttpManager(HttpManager::PACK_ID_REPORT_OUT_PAY_RESULT);
        $respost = $httpManager->requestPost($params);
        LogUtils::info("notifyPay ---> response success!!! result>>> " . $respost);
        $respost = json_decode($respost);
        if($respost->result == 0){
            $result['result'] = 0;
            $result['message'] = "success";
        }else{
            $result['result'] = -1;
            $result['message'] = "order synchronization failed";
        }

        echo json_encode($result);
    }

    public function notifyPayAction320005($paramJson, $lmcid)
    {
        $result = array("result"=> -1, "message"=> "param is null","timestamp"=>$this->getUnixTimestamp());
        $tradeInfo = $paramJson->transactionid;
        $accountId = $paramJson->accountid;

        if (!$tradeInfo) {
            LogUtils::info("notifyPay --->tradeInfo param is null");
            echo json_encode($result);
            exit(0);
        }

        if (!$accountId) {
            LogUtils::info("notifyPay --->accountId param is null");
            echo json_encode($result);
            exit(0);
        }

        LogUtils::info("notifyPay --->tradeInfo: " . $tradeInfo . ",accountId: " . $accountId);

        $checkSignResult = $this->checkSign320005($paramJson);

        if(!$checkSignResult){
            LogUtils::info("notifyPay --->Failed to verify the signature");
            $result['result'] = -2;
            $result['message'] = "Failed to verify the signature";
            echo json_encode($result);
            exit(0);
        }

        //判断退订还是续订类型
        if($paramJson->ordertype == 1){
            $packId = HttpManager::PACK_ID_REPORT_OUT_PAY_RESULT_JIANGSU_DX_OTT;
            //将局方传过来的续费开始和结束时间由13位时间戳转换成日期格式。
            $beginDt = date("Y-m-d H:i:s",floatval($paramJson->effectivetime) / 1000);
            $endDt = date("Y-m-d H:i:s",floatval($paramJson->expiretime) / 1000);
        }else if($paramJson->ordertype == 2){
            $packId = HttpManager::PACK_ID_REPORT_OUT_UNSUBSCRIBE_RESULT_JIANGSU_DX_OTT;
            //将局方传过来的续费开始和结束时间由CST时间(Wed Jan 19 10:40:45 CST 2022)转换成日期格式。
            $beginDt = date("Y-m-d H:i:s",strtotime($paramJson->effectivetime . " -14 hours"));
            $endDt = date("Y-m-d H:i:s",strtotime($paramJson->expiretime . " -14 hours"));
        }else{
            LogUtils::info("notifyPay --->Unknown orderType:" . $paramJson->ordertype);
            $result['result'] = -3;
            $result['message'] = "Unknown orderType:" . $paramJson->ordertype;
            echo json_encode($result);
            exit(0);
        }

        $params = array(
            'user_account' => $paramJson->accountid,
            'order_channel' => "",
            'order_id' => $paramJson->transactionid,
            'order_dt' => date("Y-m-d H:i:s"),
            'begin_dt' => $beginDt,
            'end_dt' => $endDt,
            'valid_days' => '30',
            'auto_renew' => 0,//不用自动续订，用户续订由局方处理，每次续订成功会回调我方接口，相当于单次订购。
            'vip_id' => 102, //套餐价格25元
            'order_type' => $paramJson->ordertype //1：续订，2：退订
        );

        LogUtils::info("notifyPay ---> post tradeInfo: " . json_encode($params));
        if (empty($lmcid)) {
            LogUtils::info("notifyPay ---> carrierId is empty ");
        }

        MasterManager::setPlatformType("hd");

        $httpManager = new HttpManager($packId);
        $respost = $httpManager->requestPost($params);
        LogUtils::info("notifyPay ---> response success!!! result>>> " . $respost);
        $respost = json_decode($respost);
        if($respost->result == 0){
            $result['result'] = 0;
            $result['message'] = "success";
        }else{
            $result['result'] = -1;
            $result['message'] = "order synchronization failed";
        }

        echo json_encode($result);
    }

    /**
     * 验证签名
     * @param $paramJson
     * @return bool
     *
     */
    private function checkSign320005($paramJson){
        if(is_object($paramJson)){
            $paramJson =  json_decode( json_encode( $paramJson),true);
        }
//        $text = "accountid=" . $paramJson['accountid'] . "|" .
//                "effectivetime=" . $paramJson['effectivetime'] . "|" .
//                "expiretime=" . $paramJson['expiretime'] . "|" .
//                "ordertype=" . $paramJson['ordertype'] . "|" .
//                "paychannel=" . $paramJson['paychannel'] . "|" .
//                "productid=" . $paramJson['productid'] . "|" .
//                "spid=" . $paramJson['spid'] . "|" .
//                "timestamp=" . $paramJson['timestamp'] . "|" .
//                "transactionid=" . $paramJson['transactionid'] . "|" .
//                SECRET_KEY;
        //按键名升序排序
        ksort($paramJson);
        $text = "";
        //将文档中除了sign字段之外的值和SECRET_KEY拼接，计算签名。（lmcid是提供接口时自带的参数，需排除）
        foreach ($paramJson as $key => $value){
            if($key != 'sign' && $key != 'lmcid'){
                $text = $text . $key . "=" . $value . "|";
            }
        }
        $text = $text . SECRET_KEY;
        $sign = md5($text);//e36ff4716035732eeec2263ea073e6ad
        LogUtils::info("checkSign320005 ---> signText:" . $text);
        LogUtils::info("checkSign320005 ---> requestSign:" . $paramJson['sign'] . ",beCalculatedSign:" . $sign);
        return $sign == $paramJson['sign'];
    }

    /**
     * 获取当前时间戳（13位）
     * @return float
     */
    private function getUnixTimestamp(){
        list($s1, $s2) = explode(' ', microtime());
        return (float)sprintf('%.0f',(floatval($s1) + floatval($s2)) * 1000);
    }

    /**
     * 13位时间戳(毫秒)转日期格式，精确到秒
     * @param $time
     */
    private function getMicroTimeFormat($time){
        $date = date("Y-m-d H:i:s",$time / 1000);
        return $date;
    }

    //青海电信--游戏类产品鉴权
    public function authAction(){
        $mac = isset($_REQUEST['mac'])?$_REQUEST['mac']:"";
        LogUtils::info("authAction ---> mac:" . $mac);

        $mac = str_replace(':','',$mac,$count);
        LogUtils::info("authAction ---> mac:" . $mac);

        $result = array("isVip"=> 0, "message"=> "");
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {

            $loginInfo = GameAPI::getMacLoginInfo($mac);
            LogUtils::info("authAction ---> loginInfo:" . json_encode($loginInfo));
            LogUtils::info("authAction ---> user_account:" . $loginInfo->result->user_account);
            if(empty(MasterManager::getAccountId())){
                MasterManager::setAccountId($loginInfo->result->user_account);
            }

            MasterManager::setUserId($loginInfo->result->user_id);
            MasterManager::setLoginId($loginInfo->result->login_id);
            MasterManager::setCwsSessionId($loginInfo->result->session_id);

            $orderInstance = new Pay04630092();
            $videoInfo = new \stdClass();
            $videoInfo->videoUrl = "Program1209621";
            $videoInfo->title = "乐宝棋牌简介";
            $videoInfo->imageUrl = "http://" . $_SERVER['HTTP_HOST']."/Public/img/hd/Pay/V04630092/img_order_cover.png";
            $videoInfo->productList = productID_20 ;//. ','.productID_5. ','.productID_10 .','. productID_59. ',' . productID_99 . ',' . productID_189
            LogUtils::info("authAction ---> AccountId:" . MasterManager::getAccountId());
            $isVip = $orderInstance->externalAuth(MasterManager::getAccountId(),$videoInfo);
            MasterManager::setUserIsVip($isVip);

            $epgInfoMap = MasterManager::getEPGInfoMap();
            LogUtils::info("authAction ---> productUrl:" . urlencode($epgInfoMap['productUrl']));
            GameAPI::modifyMacLoginInfo($loginInfo->data->login_id,"",$isVip,urlencode($epgInfoMap['productUrl']),-1,0);


            if($loginInfo->result == 0){
                $authResult = $loginInfo->data;
                $result['isVip'] = $isVip;
                $result['message'] = $isVip == 1 ? "user is vip" : "user is not vip";
                $result['loginId'] = $authResult->login_id;
                $result['userId'] = $authResult->user_id;
                $result['sessionId'] = $authResult->session_id;
                $result['isTestUser'] = isset($authResult->isTestUser)?$authResult->isTestUser:0;
                LogUtils::info("authAction ---> *****:" . json_encode($result));
                $result['nickName'] = $loginInfo->nickName;
                $result['headPortrait'] = $loginInfo->headUrl;
                LogUtils::info("authAction ---> *****:" . json_encode($result));
            }else{
                $result['isVip'] = -1;
                $result['message'] = empty(MasterManager::getAccountId())?"Account Acquisition Failed!":"Login Failed!";
            }
        }
        LogUtils::info("authAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--游戏类产品跳转
    public function gameJumpAction(){
        $mac = isset($_REQUEST['mac'])?$_REQUEST['mac']:"";
        $gameId = isset($_REQUEST['gameId'])?$_REQUEST['gameId']:"";
        LogUtils::info("gameJumpAction ---> mac:" . $mac);
        LogUtils::info("gameJumpAction ---> gameId:" . $gameId);

        $mac = str_replace(':','',$mac,$count);
        LogUtils::info("authAction ---> mac:" . $mac);

        $result = array("result"=> -1, "message"=> "");
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {

            if(empty($mac)){
                $result['result'] = -1;
                $result['message'] = 'mac is null';
            }else if(empty($gameId)){
                $result['result'] = -1;
                $result['message'] = 'gameId is null';
            }else{
                $res = GameAPI::setMacJumpInfo($mac,$gameId);
                $result['result'] = 0;
                $result['message'] = 'success';
            }
        }
        echo json_encode($result);
    }

    //青海电信--游戏类产品跳转
    public function getGameJumpAction(){
        $result = array("result"=> -1, "message"=> "");
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $res = GameAPI::getMacJumpInfo(MasterManager::getSTBMac());
            $result = $res;
        }
        LogUtils::info("getGameJumpAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--游戏类产品订购申请
    public function orderApplyAction(){
        $userId = isset($_REQUEST['userId'])?$_REQUEST['userId']:"";
        $loginId = isset($_REQUEST['loginId'])?$_REQUEST['loginId']:"";
        $sessionId = isset($_REQUEST['sessionId'])?$_REQUEST['sessionId']:"";
        $ChannelId = isset($_REQUEST['ChannelId'])?$_REQUEST['ChannelId']:"";
        $OrderType = isset($_REQUEST['OrderType'])?$_REQUEST['OrderType']:"";
        LogUtils::info("orderApplyAction ---> _REQUEST:" . json_encode($_REQUEST));
        $result = array("result"=> -1, "message"=> "");
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            if(MasterManager::getUserIsVip()){
                $result['result'] = 1;
                $result['message'] = "你已经是VIP，不需重复申请";
            }else{
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $res = GameAPI::modifyMacLoginInfo($loginId,$ChannelId,MasterManager::getUserIsVip(),urlencode($epgInfoMap['productUrl']),1,$OrderType);
                LogUtils::info("orderApplyAction ---> res:" . json_encode($res));
                if($res->result){
                    $result = array("result"=> 0, "message"=> "success");
                }
            }
        }
        LogUtils::info("orderApplyAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--游戏类产品订购跳转
    public function getOrderJumpAction(){
        $result = array("result"=> -1, "message"=> "");
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $res = GameAPI::getMacLoginInfo(MasterManager::getSTBMac());
            LogUtils::info("getGameJumpAction ---> res:" . json_encode($res));
            if($res->result->order_state == 1){
                GameAPI::modifyMacLoginInfo($res->result->login_id,"",-1,"",2,-1);
                $result['result'] = 0;
                $result['message'] = "success";
            }
            if($res->result->order_state == 2){
                GameAPI::modifyMacLoginInfo($res->result->login_id,"",-1,"",3,-1);
                $result['result'] = 1;
                $result['gameId'] = $res->result->channel_id;
                $result['message'] = "jump apk";
            }
        }
        LogUtils::info("getGameJumpAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--游戏类产品订购跳转
    public function scoreSyncAction(){
        $mac = isset($_REQUEST['mac'])?$_REQUEST['mac']:"";
        $gemeId = isset($_REQUEST['gemeId'])?$_REQUEST['gemeId']:"";
        $userId = isset($_REQUEST['userId'])?$_REQUEST['userId']:"";
        $score = isset($_REQUEST['score'])?$_REQUEST['score']:"";
        LogUtils::info("scoreSyncAction ---> REQUEST:" . json_encode($_REQUEST));

        $mac = str_replace(':','',$mac,$count);

        $result = array("result"=> -1, "message"=> "");
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result['result'] = 0;
            $result['message'] = "success";
            GameAPI::gameScreReport($mac,$gemeId,$userId,$score);
        }
        LogUtils::info("scoreSyncAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--获取金币游戏数据
    public function getGoldCoinDataAction(){
        LogUtils::info("getGoldCoinDataAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array("result"=> -1, "message"=> "");
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $url = GOLD_COIN_QUERY_INTERFACE."userId=".MasterManager::getUserId();//MasterManager::getAccountId();
            LogUtils::info("getGoldCoinDataAction ---> url:" . $url);
            $res = HttpManager::httpRequestByHeader("GET",$url,"","");
            $res = json_decode($res);
            if($res->code != 1){
                //$card = GameAPI::getUserExpireGameCards();
                $res->code = 1;
                $data = new \stdClass();
                $data->headUrl = "";
                $data->beans = 0;
                $data->wangCards = 0;//$card->data->notExCards;
                $data->nickname = "";
                $res->data = $data;
            }
            $result['result'] = 0;
            $result['message'] = "success";
            $result['goldData'] = $res;
            $result['experData'] = GameAPI::getExperGradeInfo();
        }
        LogUtils::info("getGoldCoinDataAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--获取用户排行数据
    public function getExperRankDataAction(){
        $type = isset($_REQUEST['type'])?$_REQUEST['type']:0;
        LogUtils::info("getExperRankDataAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array("result"=> -1);
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result['result'] = 0;
            $result['data'] = GameAPI::getExperRankData($type);
        }
        LogUtils::info("getExperRankDataAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--获取金币游戏数据
    public function modifyHandNickNameAction(){
        $type = isset($_REQUEST['type'])?$_REQUEST['type']:"0";
        LogUtils::info("modifyHandNickNameAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array("result"=> -1);
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result['result'] = 0;
            $result['data'] = GameAPI::modifyHandNickNameInfo($type);
        }
        LogUtils::info("modifyHandNickNameAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--游戏安装上报
    public function gameInstallReportAction(){
        $gameId = isset($_REQUEST['gameId'])?$_REQUEST['gameId']:"0";
        $action = isset($_REQUEST['action'])?$_REQUEST['action']:1;
        LogUtils::info("gameInstallReportAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array("result"=> -1);
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result['result'] = 0;
            $result['data'] = GameAPI::gameInstallReport($gameId,$action);
        }
        LogUtils::info("gameInstallReportAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--获得安装游戏数据
    public function getGameInstallInfoAction(){
        $mac = isset($_REQUEST['mac'])?$_REQUEST['mac']:"0";

        $mac = str_replace(':','',$mac,$count);
        LogUtils::info("getGameInstallInfoAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = GameAPI::getGameInstallInfo($mac);
        if(empty($result)){
            $result['result'] = -1;
        }
        LogUtils::info("getGameInstallInfoAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--游戏签到
    public function gameSignInAction(){
        $type = isset($_REQUEST['type'])?$_REQUEST['type']:0;
        $day = isset($_REQUEST['day'])?$_REQUEST['day']:1;
        $diamond = isset($_REQUEST['diamond'])?$_REQUEST['diamond']:0;

        LogUtils::info("gameSignInAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result = GameAPI::gameSignInInfo($type,$day,$diamond);
            if(empty($result)){
                $result['result'] = -1;
            }
        }
        LogUtils::info("gameSignInAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--游戏签到
    public function getGameCodeDetailsAction(){
        $gameId = isset($_REQUEST['gameId'])?$_REQUEST['gameId']:1;

        LogUtils::info("getGameCodeDetailsAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result = GameAPI::getGameCodeDetails($gameId);
            if(empty($result)){
                $result['result'] = -1;
            }
        }
        LogUtils::info("getGameCodeDetailsAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--获得游戏头像数据
    public function getGameHandDataAction(){

        LogUtils::info("getGameHandDataAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result = GameAPI::getGameHandData();
            if(empty($result)){
                $result['result'] = -1;
            }
        }
        LogUtils::info("getGameHandDataAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--游戏签到
    public function gameDiamondConVertHandAction(){
        $handId= isset($_REQUEST['handId'])?$_REQUEST['handId']:0;

        LogUtils::info("gameDiamondConVertHandAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result = GameAPI::gameDiamondConVertHand($handId);
            if(empty($result)){
                $result['result'] = -1;
            }
        }
        LogUtils::info("gameDiamondConVertHandAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    public function gameVersionUploadAction(){
        $mac= isset($_REQUEST['mac'])?$_REQUEST['mac']:"";
        $gameId= isset($_REQUEST['gameId'])?$_REQUEST['gameId']:"";
        $version= isset($_REQUEST['version'])?$_REQUEST['version']:"";

        LogUtils::info("gameVersionUploadAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result = GameAPI::gameVersionUpgrade(1,$mac,$gameId,$version);
            if(empty($result)){
                $result['result'] = 0;
            }
        }
        LogUtils::info("gameVersionUploadAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    public function gameVersionVerifAction(){
        $mac= MasterManager::getSTBMac();
        $gameId= isset($_REQUEST['gameId'])?$_REQUEST['gameId']:"";

        LogUtils::info("gameVersionVerifAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result = GameAPI::gameVersionUpgrade(2,$mac,$gameId,"");
            if(empty($result)){
                $result['result'] = -1;
            }
        }
        LogUtils::info("gameVersionVerifAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    public function getGameHandQRCodeAction(){
        LogUtils::info("getGameHandQRCodeAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result = GameAPI::getGameHandQRCode();
            if(empty($result)){
                $result['result'] = -1;
            }
        }
        LogUtils::info("getGameHandQRCodeAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    //青海电信--获得安装游戏数据
    public function gameHandImgUploadAction(){
        $userId = isset($_REQUEST['userId'])?$_REQUEST['userId']:0;
        $nickName = isset($_REQUEST['nickName'])?$_REQUEST['nickName']:0;
        $handUrl = isset($_REQUEST['handUrl'])?$_REQUEST['handUrl']:0;

        LogUtils::info("gameHandImgUploadAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result = GameAPI::gameHandImgUpload($userId,$nickName,$handUrl);
            if(empty($result)){
                $result['result'] = -1;
            }
        }
        LogUtils::info("gameHandImgUploadAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    public function getAllGameInfoAction(){
        LogUtils::info("getAllGameInfoAction ---> REQUEST:" . json_encode($_REQUEST));
        $result = array();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result = GameAPI::getAllGameInfo();
            if(empty($result)){
                $result['result'] = -1;
            }
        }
        LogUtils::info("getAllGameInfoAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }

    public function qrCodeStateRevAction(){
        LogUtils::info("qrCodeStateRevAction ---> REQUEST:" . json_encode($_REQUEST));
        $type = isset($_REQUEST['type'])?$_REQUEST['type']:0;
        $qrid = isset($_REQUEST['qrid'])?$_REQUEST['qrid']:0;
        $result = array();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX_GAME) {
            $result = GameAPI::userGameQrCodeStateRev($type,$qrid);
            if(empty($result)){
                $result['result'] = -1;
            }
        }
        LogUtils::info("getAllGameInfoAction ---> result:" . json_encode($result));
        echo json_encode($result);
    }
}