<?php
/**
 * Created by PhpStorm.
 * User: chenzhongyi
 * Date: 2019/8/20
 * Time: 下午5:36
 */

namespace Home\Model\Order;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;

class Pay440094 extends PayAbstract
{
    const isNewPay = true;//设置新老订购页面切换

    /**
     * 到局方鉴权，只有包月产品才能鉴权。
     * @param $productInfo 鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authentication($payInfo = null)
    {
        $isSuccess = false;

        if(empty($payInfo)){
            $payInfo = new \stdClass();
            $payInfo->authUrl = USER_ORDER_URL . QUERY_ORDER_FUNC;//鉴权地址
            $payInfo->providerId = providerId;
            $EPGInfoMap = MasterManager::getEPGInfoMap();
            if(CARRIER_ID == CARRIER_ID_GUANGDONGGD_NEW){
                $payInfo->devNo = $EPGInfoMap["client"];
            }else{
                $payInfo->devNo = $EPGInfoMap["cardId"];
            }
            $payInfo->productId = productId_month;
            $payInfo->timeStamp = date("YmdHis");
            $payInfo->key = key;
            $text = "devNo=" . $payInfo->devNo . "&providerId=" . $payInfo->providerId . "&productId=" . $payInfo->productId . "&timeStamp=" . $payInfo->timeStamp . "&key=" . $payInfo->key;
            LogUtils::info("_buildPayUrl authentication ---> sign text : " . $text);
            $payInfo->sign = strtoupper(md5($text));
        }

        //鉴权参数
        $data = array(
            "providerId" => $payInfo->providerId,
            "devNo" =>       $payInfo->devNo,
            "productId" => $payInfo->productId,
            "timeStamp" => $payInfo->timeStamp,
            "sign" =>       $payInfo->sign,
        );
        $url =$payInfo->authUrl ;
        LogUtils::info("pay440094 ---> authentication url : " . $url);
        LogUtils::info("pay440094 ---> authentication 参数 : " .json_encode($data));
        $resultData = HttpManager::httpRequest("POST", $url, $data);
        LogUtils::info("pay440094 ---> authentication result : " . $resultData);
        if($resultData === 0 || $resultData === "0"){
            $isSuccess = true;
            return $isSuccess;
        }

        //对25元包月用户进行鉴权
        if($payInfo->productId == "1200002"){
            $text = "devNo=" . $payInfo->devNo . "&providerId=" . $payInfo->providerId . "&productId=" . "1200001" . "&timeStamp=" . $payInfo->timeStamp . "&key=" . $payInfo->key;
            LogUtils::info("_buildPayUrl ---> sign text : " . $text);
            $payInfo->sign = strtoupper(md5($text));

            $data = array(
                "providerId" => "120",
                "devNo" => $payInfo->devNo,
                "productId" => "1200001",
                "timeStamp" => $payInfo->timeStamp,
                "sign" =>       $payInfo->sign,
            );
            $url =$payInfo->authUrl ;
            LogUtils::info("pay440094 ---> authentication 2 url : " . $url);
            LogUtils::info("pay440094 ---> authentication 2 参数 : " .json_encode($data));
            $resultData = HttpManager::httpRequest("POST", $url, $data);
            LogUtils::info("pay440094 ---> authentication 2 result : " . $resultData);

            if($resultData === 0 || $resultData === "0"){
                $isSuccess = true;
            }
        }
        return $isSuccess;
    }

    /**
     * 到局方鉴权，只有包月产品才能鉴权。
     * @param $productInfo 鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authenticationUHealth($payInfo = null)
    {
        $isSuccess = false;
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $url =$payInfo->authUrl . "&orderNo=" . uniqid() . "&devno=" . $epgInfoMap['cardId'] ;
        LogUtils::info("pay440094 ---> authenticationUHealth url : " . $url);
        $resultData = HttpManager::httpRequest("GET", $url, null);
        LogUtils::info("pay440094 ---> authenticationUHealth result : " . $resultData);
        $resultData = json_decode($resultData, true);
        if ($resultData['resultCode'] == 0 && $resultData['ismember']) {
            $isSuccess = true;
        }
        return $isSuccess;
    }

    /**
     * 构建到局方用户验证地址
     * @param null $returnUrl
     * @return mixed
     */
    public function buildVerifyUserUrl($returnUrl = null)
    {
        // TODO: Implement buildVerifyUserUrl() method.
        return;
    }

    /**
     * 构建到局方的订购参数
     * @param $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {
        $payUrl = "";
        // TODO: Implement buildPayUrl() method.
        $ret = array(
            'result' => -1,
        );

        if ($payInfo == null || $payInfo == "" || !is_object($payInfo)) {
            LogUtils::error("buildPayUrl， 参数错误");
            return $ret;
        }
        $payInfo->orderType = 1;

        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark, "", $payInfo->orderType);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            LogUtils::info("Pay440094::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return $ret;
        }
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;
        $payInfo->lmreason = 0;

        // 获取智能卡ID
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $payInfo->devNo = $epgInfoMap["cardId"];
        //创建订购参数
        if(self::isNewPay){
            $payUrl = $this->_buildPayInfo($payInfo,false);
            $ret['result'] = 0;
            $ret['payUrl'] = $payUrl;
        }else{
            $payInfo->caRegionCode = $epgInfoMap["areaCode"];
            $payInfo = $this->_buildPayInfo_old($payInfo,false);
            $ret['result'] = 0;
            $ret['payInfo'] = $payInfo;
        }

        return json_encode($ret);
    }

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildUnPayUrl($payInfo = null)
    {
        // TODO: Implement buildUnPayUrl() method.
        return;
    }

    /**
     * 直接到局方订购  广州广电没有
     * @param null $orderInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function directToPay($orderInfo = null)
    {
        $payInfo = new \stdClass();
        $payInfo->userId = MasterManager::getUserId();
        $payInfo->carrierId = MasterManager::getCarrierId();
        $payInfo->vip_id = "5";                                 // 后台配置的vip_id
        $payInfo->vip_type = "2";              // 后台配置的vip_type,用户判断是单次还是包月
        $payInfo->price = "2500";                    // 价格（单位分）
        $payInfo->orderReason="102";
        $payInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
        $payInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
        $payInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
        $payInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";

        $data = $this->buildPayUrl($payInfo);

        $result = json_decode($data);
        if ($result->result == 0) {
            header("Location:" . $result->payUrl);
        }
        return;
    }

    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {
        if(!self::isNewPay){
            $this->payCallback_old($payResultInfo);
            return;
        }
        LogUtils::info(" payCallback 440094 ---> payResult: " . json_encode($_GET));
        $isVip = 0;
        $payResultInfo = new \stdClass();
        $payResultInfo->action = $_GET['action'];
        $payResultInfo->result = ($payResultInfo->action == "success") ? 0 : -1;
        $payResultInfo->message = $_GET['msg'];
        $payResultInfo->spid = $_GET['spid'];
        $payResultInfo->channelid = $_GET['channelid'];
        $payResultInfo->tradeNo = $_GET['assistdata']; // 我方订单号
        $payResultInfo->serialno = $_GET['serialno'];
        $payResultInfo->agreeid = $_GET['agreeid'];
        $payResultInfo->salescode = $_GET['salescode'];
        $payResultInfo->keyno = $_GET['keyno'];
        $payResultInfo->servid = $_GET['servid'];
        $payResultInfo->orderId = $_GET['orderno'];
        $payResultInfo->salesname = $_GET['salesname'];
        $returnPageName = isset($_GET['returnPageName']) && $_GET['returnPageName'] != null;

        if($payResultInfo->result == -1){
            $payResultInfo->videoInfo = $_GET['videoInfo'];
            $payResultInfo->action = explode("=",explode("?",$payResultInfo->videoInfo)[1])[1];
            $payResultInfo->result = ($payResultInfo->action == "success") ? 0 : -1;;
        }
        LogUtils::info(" payCallback 440004 ---> payResultInfo: " . json_encode($payResultInfo));

        if($this->authentication()){
            if($payResultInfo->result != 0){
                LogUtils::error("Pay::authentication 订购结果与鉴权结果不符!"."订购结果：".$payResultInfo->result."鉴权结果：1");
                $payResultInfo->result = 0;
            }
        }else{
            if($payResultInfo->result == 0){
                LogUtils::error("Pay::authentication 鉴权结果与订购结果不符!"."订购结果：0"."鉴权结果：0");
                $payResultInfo->result = -1;
            }
        }

        if(empty($payResultInfo->result)){
            $payResultInfo->result = -1;
        }

        if($payResultInfo->result === 0){
            MasterManager::setOrderResult(1);
            MasterManager::setUserIsVip(1);
            $isVip = 1;
        } else {
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(0);
        }

        // 上报订购结果
        $this->_uploadPayResult($payResultInfo);

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        if (($payResultInfo->lmreason != null && ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1))) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }

            if ($payResultInfo->lmreason == 1) {
                $srcUrl = "http://172.31.134.185:10001/index.php";
                $destUrl = "http://172.31.134.185:10001/index.php";
                $intentUrl = str_replace($srcUrl, $destUrl, $intentUrl);
            }

            LogUtils::info("payCallback440094::payCallback() url:". $intentUrl);
            header("Location:" . $intentUrl);
            return;
        }

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 继续播放
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        } else {
            LogUtils::info("Pay440094::payCallback() ---> jump returnPageName: " . $returnPageName);
            IntentManager::back($returnPageName);
        }

    }

    public function payNotifyback(){
        $data = file_get_contents('php://input');
        LogUtils::info(" payNotifyback 440094 ---> data: " . json_encode($data));
        LogUtils::info(" payNotifyback 440094 ---> _GET: " . json_encode($_GET));
        LogUtils::info(" payNotifyback 440094 ---> _POST: " . json_encode($_POST));
        $payResultInfo = new \stdClass();
        $payResultInfo->opcode = $_POST['opcode'];//0：表示开通 1：表示退订
        $payResultInfo->cpcode = $_POST['cpcode'];
        $payResultInfo->requestseq = $_POST['requestseq'];
        $payResultInfo->keyno = $_POST['keyno'];
        $payResultInfo->servid = $_POST['servid'];
        $payResultInfo->tradeNo = $_POST['assistdata'];
        $payResultInfo->signdata = $_POST['signdata'];
        LogUtils::info(" payNotifyback 440094 ---> payResultInfo: " . json_encode($payResultInfo));

        if($payResultInfo->opcode == 0){
            $payResultInfo->result =  0;
        }else{
            $payResultInfo->result =  -1;
        }
        $this->_uploadPayResult($payResultInfo);

        $ret = array(
            "code" => "0000",
            "msg" => "",
            "cpcode" => $payResultInfo->cpcode,
            "requestseq" => $payResultInfo->requestseq,
            "signdata" => $payResultInfo->signdata,
        );
        return json_encode($ret);
    }
    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function payCallbackUHealth($payResultInfo = null)
    {
        if ($payResultInfo == null) {
            $param = json_decode(MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();;
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->returnPageName = $param->returnPageName;
            $payResultInfo->isPlaying = $param->isPlaying;
            $payResultInfo->videoInfo = $param->videoInfo;

            $payResultInfo->result = $_GET['resultCode'];
            $payResultInfo->message = $_GET['resultDesc'];
            $payResultInfo->spOrderId = $_GET['orderNo']; //我方订单号
            $payResultInfo->orderId = $_GET['streamNo']; //局方订单号

        }
        LogUtils::info(" payCallback 440094 ---> payResult uhealth: " . json_encode($payResultInfo));

        if($payResultInfo->result === 0){
            MasterManager::setOrderResult(1);
        } else {
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(0);
        }


        // 上报订购结果
        $this->_uploadPayResult($payResultInfo);

        // 判断用户是否是VIP，更新到session中
        if ($payResultInfo->result == 0) {
            $isVip = 1;
        } else {
            $isVip = 0;
        }
        MasterManager::setUserIsVip($isVip);


        // 查询用户的VIP身份，
        $vipInfo = UserManager::queryVipInfo($payResultInfo->userId);
        if ($vipInfo->result == 0 && ($vipInfo->auto_order == 1
                || $vipInfo->last_order_trade_no == null
                || $vipInfo->last_order_trade_no == "")) {
            MasterManager::setAutoOrderFlag("1");  // 续包月用户
        } else {
            MasterManager::setAutoOrderFlag("0");  // 不是续包月用户
        }

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }


        //生成订购结果显示界面
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $payResultInfo->result == "0" ?  true : false);

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 继续播放
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($showOrderResultObj, $objPlayer, IntentManager::$INTENT_FLAG_DEFAULT);
        } else {
            $intent = IntentManager::createIntent($payResultInfo->returnPageName);
            IntentManager::jump($showOrderResultObj, $intent, IntentManager::$INTENT_FLAG_DEFAULT);
        }

    }

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function unPayCallback($unPayResultInfo = null)
    {
        // TODO: Implement unPayCallback() method.
        return;
    }

    /**
     * 联合活动使用的用户验证
     * @param null $userId
     * @return int
     * @throws \Think\Exception
     */
    public function jointActivityAuthUserInfo($userId = null)
    {
        return;
    }

    /**
     * 构建订购返回地址
     * @param null $param
     * @return string
     */
    private function _buildPayCallbackUrl($param = null)
    {
        $intent = IntentManager::createIntent("payCallback");
        $intent->setParam("userId", $param['userId']);
        $intent->setParam("tradeNo", $param['tradeNo']);
        $intent->setParam("lmreason", $param['lmreason']);
        $intent->setParam("lmcid", $param['lmcid']);
        $intent->setParam("returnPageName", $param['returnPageName']);
        $intent->setParam("isPlaying", $param['isPlaying']);
        $intent->setParam("videoInfo", rawurlencode($param['videoInfo']));
        MasterManager::setPayCallbackParams(json_encode($param));

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        return $url;
    }

    /**
     * 构建退订订购返回地址
     * @param null $param
     * @return string
     */
    private function _buildUnPayCallbackUrl($param = null)
    {
        return ;
    }

    /**
     * 生成订购参数,附加到$payInfo中
     * @param null $payInfo
     * @param $productInfo
     * @return bool|string
     */
    private function _buildPayInfo($payInfo,$isproxy)
    {
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeNo,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "videoInfo" => $payInfo->videoInfo,
        );
        $returnUrl = urlencode($this->_buildPayCallbackUrl($param));  //构建返回地址

        $result = $this->getOrderId();
        if($result->code=="0000"){
            $payInfo->tradeNo = $result->preorderid;
        }

        $payUrl = USER_ORDER_URL_NEW . "?spid=" . SPID . "&keyno=" .$payInfo->devNo ."&channelid=" .CHANNEL_ID. "&assistdata="
        .$payInfo->tradeNo. "&redirectUrl=" . $returnUrl;

        LogUtils::info("##############payUrl = " .$payUrl);
        return $payUrl;
    }

    /**
     * 生成订购参数,附加到$payInfo中
     * @param null $payInfo
     * @param $productInfo
     * @return bool|string
     */
    private function _buildPayInfoUHealth($payInfo)
    {
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeNo,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "videoInfo" => $payInfo->videoInfo,
        );
        $payInfo->returnUrl = urlencode($this->_buildPayCallbackUrl($param));  //构建返回地址
        $payInfo->appkey = appKey;
        $payInfo->vip_type = "2";//目前只有包月的
        if($payInfo->vip_type == "2"){
            //续包月产品
            $payInfo->productId = productId;
            $payInfo->orderUrl = urlencode(USER_ORDER_URL.MONTH_ORDER_FUNC); //订购地址
        }
        //计算校验值sign
        $signSrc = "CARegionCode=" . $payInfo->caRegionCode . "&devno=" . $payInfo->devNo . "&orderNo=" . $payInfo->tradeNo . "&productid=" . $payInfo->productId . "&returnUrl=" . $payInfo->returnUrl . "&appkey=" . $payInfo->appkey;
        LogUtils::info("_buildPayUrl ---> sign src text uhealth: " . $signSrc);
        $payInfo->sign = md5($signSrc);
        LogUtils::info("_buildPayUrl ---> payInfo uhealth: " . json_encode($payInfo));

        return $payInfo;
    }

    /**
     * 上报订购结果
     * @param $payResultInfo
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        if ($payResultInfo == null) {
            // 处理并上报支付结果
            $payResultInfo = array(
                'TradeNo' => $_GET['tradeNo'],
                'reason' => $_GET['lmreason'],
                'transactionID' => $_GET['orderId'],
                'Result' => $_GET['result'],
                'Description' => $_GET['message'],
                'UserID' => MasterManager::getUserId(),
            );
        } else {
            $payResultInfo = array(
                'TradeNo' => $payResultInfo->tradeNo,
                'reason' => $payResultInfo->lmreason,
                'transactionID' => $payResultInfo->orderId,
                'Result' => $payResultInfo->result,
                'Description' => $payResultInfo->message,
                'UserID' => $payResultInfo->userId,
            );
        }

        if(empty($payResultInfo['Result'])){
            $payResultInfo['Result'] = -1;
        }
        $payResultInfo['carrierId'] = isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID;
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));

        PayAPI::postPayResultEx($payResultInfo);
    }

    /**
     * 上报退订结果
     * @param null $unPayResultInfo
     */
    private function _uploadUnPayResult($unPayResultInfo = null)
    {
        return;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo() {
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = MasterManager::getAccountId();
        $info = array(
            'accountId' => $userAccount,
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platformType' => MasterManager::getPlatformType(),

            'devNo' => $epgInfoMap["cardId"],
        );

        return $info;
    }

    /**
     * 通过web浏览器进行订购
     * @param null $userInfo
     * @return mixed
     */
    public function webPagePay($userInfo) {
        $payUrl = "";
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 220;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->lmreason = 1;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay440094::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->price = $orderItems[0]->price;

        $orderInfo->devNo = $userInfo->devNo;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay440094::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            //创建订购参数
            $payInfo = $this->_buildPayInfo_old($orderInfo,true);

            LogUtils::info("Pay440094::webPagePay buildPayInfo --->: " . json_encode($payInfo));
            // 变换为公网IP 把172.31.134.185:10001 ---> 203.132.32.92:10001
            $srcUrl = "172.31.134.185";
            $destUrl = "203.132.32.92";
            $payInfo->orderUrl = str_replace($srcUrl, $destUrl, $payInfo->orderUrl);
            $returnUrl = str_replace($srcUrl, $destUrl, urldecode($payInfo->returnUrl));
            LogUtils::info("Pay440094::webPagePay returnUrl --->: " . $payInfo->returnUrl);
            $payInfo->returnUrl = urlencode($returnUrl);
            $payInfo->imageUrl = str_replace($srcUrl, $destUrl, $payInfo->imageUrl);

            $intent = IntentManager::createIntent("directPay");
            $intent->setParam("orderParam", rawurlencode(json_encode($payInfo)));
            $goUrl = IntentManager::intentToURL($intent);

            // 变换为公网IP 把172.31.134.185:10006 ---> 203.132.32.92:10006
            $srcUrl = "172.31.134.185";
            $destUrl = "203.132.32.92";
            $goUrl = str_replace($srcUrl, $destUrl, $goUrl);

            LogUtils::info("Pay440004::webPagePay goUrl --->: " . $goUrl);

            header('Location:' . $goUrl);
        }
        return 0;
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl() {

        $payUrl = "";
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->lmreason = 2;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay440094::buildDirectPayUrl() ---> orderItems is empty");
            return $payUrl;
        }
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->price = $orderItems[0]->price;

        // 创建支付订单
        $Info = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($Info->result != 0) {
            LogUtils::info("Pay440094::buildPayUrl() ---> 获取订单失败：" . $Info->result);
            return $payUrl;
        }
        //获取订单成功
        $orderInfo->tradeNo = $Info->order_id;

        // 获取智能卡ID
        //$epgInfoMap = MasterManager::getEPGInfoMap();
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $orderInfo->devNo = $epgInfoMap["cardId"];
        $orderInfo->caRegionCode = $epgInfoMap["areaCode"];
        //创建订购参数self::isNewPay
        if(self::isNewPay){
            $payInfo = $this->_buildPayInfo($orderInfo,true);
            $payUrl=$payInfo;
        }else{
            $payInfo = $this->_buildPayInfo_old($orderInfo,true);
            $intent = IntentManager::createIntent("directPay");
            $intent->setParam("orderParam", rawurlencode(json_encode($payInfo)));
            $payUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($payUrl, "http://")) {
                $payUrl = "http://" . $_SERVER['HTTP_HOST'] . $payUrl;  // 回调地址需要加上全局路径
            }
        }

        return $payUrl;
    }

    //老版本订购页面
    private function _buildPayInfo_old($payInfo,$isproxy)
    {
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeNo,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "videoInfo" => $payInfo->videoInfo,
        );
        $payInfo->returnUrl = urlencode($this->_buildPayCallbackUrl($param));  //构建返回地址
        $payInfo->imageUrl = APP_ROOT_PATH . "/Public/img/hd/Pay/V440094/pay_page_logo.jpg"; // 显示在局方订购页的产品海报
        $payInfo->appId = appId;
        $payInfo->key = key;
        $payInfo->providerId = providerId;
        $payInfo->timeStamp = date("YmdHis");
        $payInfo->vip_type = "2";//目前只有包月的
        if($isproxy){
            $proxy_url = USER_ORDER_PROXY_URL;
        }else{
            $proxy_url = USER_ORDER_URL;
        }
        if($payInfo->vip_type == "2"){
            //续包月产品
            $payInfo->productId = productId_month;//订购产品
            $payInfo->orderUrl = urlencode($proxy_url.MONTH_ORDER_FUNC); //订购地址
        } else {
            //单次产品
            $payInfo->productId = productId_time;//订购产品
            $payInfo->orderUrl = urlencode($proxy_url.TIME_ORDER_FUNC);//订购地址
        }
        $payInfo->authUrl = $proxy_url.QUERY_ORDER_FUNC;//鉴权地址
        //计算校验值sign
        $text = "devNo=". $payInfo->devNo ."&providerId=". $payInfo->providerId ."&productId=" .$payInfo->productId ."&timeStamp=".$payInfo->timeStamp ."&key=" .$payInfo->key;
        LogUtils::info("_buildPayUrl ---> sign text : " . $text);
        $payInfo->sign = strtoupper(md5($text));
        LogUtils::info("_buildPayUrl ---> payInfo : " . json_encode($payInfo));

        return $payInfo;
    }

    public function payCallback_old($payResultInfo = null)
    {
        // TODO: Implement payCallback() method.
        if ($payResultInfo == null) {
            $param = json_decode(MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();;
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->returnPageName = $param->returnPageName;
            $payResultInfo->isPlaying = $param->isPlaying;
            $payResultInfo->videoInfo = $param->videoInfo;

            $payResultInfo->result = $_GET['result'];
            $payResultInfo->message = $_GET['message'];
            $payResultInfo->spOrderId = $_GET['spOrderId']; //我方订单号
            $payResultInfo->orderId = $_GET['orderId']; //局方订单号

        }
        if(empty($payResultInfo->tradeNo)){
            $payResultInfo->tradeNo = $_GET['tradeNo'];
        }
        if($payResultInfo->result == "0" && empty($payResultInfo->tradeNo) && !empty($payResultInfo->orderId)){
            $payResultInfo->tradeNo = $_GET['orderId'];
        }
        LogUtils::info(" payCallback 440094 ---> payResult: " . json_encode($payResultInfo));

        if($_GET['result'] == "1008"){
            $payResultInfo->result = 0;
        }

        if($payResultInfo->result === 0){
            MasterManager::setOrderResult(1);
        } else {
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(0);
        }


        // 上报订购结果
        $this->_uploadPayResult($payResultInfo);

        // 判断用户是否是VIP，更新到session中
        $isVip = UserManager::isVip($payResultInfo->userId);
        MasterManager::setUserIsVip($isVip);


        // 查询用户的VIP身份，
        $vipInfo = UserManager::queryVipInfo($payResultInfo->userId);
        if ($vipInfo->result == 0 && ($vipInfo->auto_order == 1
                || $vipInfo->last_order_trade_no == null
                || $vipInfo->last_order_trade_no == "")) {
            MasterManager::setAutoOrderFlag("1");  // 续包月用户
        } else {
            MasterManager::setAutoOrderFlag("0");  // 不是续包月用户
        }

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        if (($payResultInfo->lmreason != null && ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1))) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }

            if ($payResultInfo->lmreason == 1) {
                $srcUrl = "http://172.31.134.185:10001/index.php";
                $destUrl = "http://172.31.134.185:10001/index.php";
                $intentUrl = str_replace($srcUrl, $destUrl, $intentUrl);
            }

            LogUtils::info("payCallback440094::payCallback() url:". $intentUrl);
            header("Location:" . $intentUrl);
            return;
        }

        //生成订购结果显示界面
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $payResultInfo->result == "0" ?  true : false);

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 继续播放
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($showOrderResultObj, $objPlayer, IntentManager::$INTENT_FLAG_DEFAULT);
        } else {
            $intent = IntentManager::createIntent($payResultInfo->returnPageName);
            IntentManager::jump($showOrderResultObj, $intent, IntentManager::$INTENT_FLAG_DEFAULT);
        }
    }

    public function getOrderId()
    {
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("getOrderId->epgInfoMap:".json_encode($epgInfoMap));

        $requestData = array(
            "cpcode" => CP_CODE,
            "requestseq" => CP_CODE . date("Ymd").mt_rand(1000000000, 9999999999),
            "keyno" => $epgInfoMap['cardId'],
            "servid" => MasterManager::getAccountId(),
            "signdata" => "",
        );
        $signdata = $requestData['cpcode'].'~'.$requestData['requestseq'].'~'.$requestData['keyno'].'~'.$requestData['servid'].'~'.MD5_KEY;
        LogUtils::info("getOrderId->signdata:".$signdata);
        $requestData['signdata'] = strtoupper(md5($signdata));
        LogUtils::info("getOrderId->requestData:".json_encode($requestData));

        $result = $this->http_post_data(USER_GET_ORDER_ID_URL, json_encode($requestData));
        LogUtils::info("getOrderId->result:".$result);
        return json_decode($result);
    }

    public function http_post_data($url, $data) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json; charset=utf-8',
                'Content-Length: ' . strlen($data))
        );
        ob_start();
        curl_exec($ch);
        $return_content = ob_get_contents();
        ob_end_clean();

        //$return_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        return $return_content;
    }
}