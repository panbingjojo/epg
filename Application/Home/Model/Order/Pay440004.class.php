<?php
/**
 * Created by PhpStorm.
 * User: czy
 * Date: 2018/8/2
 * Time: 下午5:36
 */

namespace Home\Model\Order;


use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\AreaManager;
use Home\Model\User\UserManager;
use Think\Log;

class Pay440004 extends PayAbstract
{
    const isNewPay = true;//设置新老订购页面切换

    /**
     * @param $productInfo 广东广电的鉴权放在js中
     * @param $isVip 在我方是否是vip
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
            "devNo" => $payInfo->devNo,
            "productId" => $payInfo->productId,
            "timeStamp" => $payInfo->timeStamp,
            "sign" =>       $payInfo->sign,
        );
        $url =$payInfo->authUrl ;
        LogUtils::info("pay440004 ---> authentication url : " . $url);
        LogUtils::info("pay440004 ---> authentication 参数 : " .json_encode($data));
        $resultData = HttpManager::httpRequest("POST", $url, $data);
        LogUtils::info("pay440004 ---> authentication result : " . $resultData);
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
            LogUtils::info("pay440004 ---> authentication 2 url : " . $url);
            LogUtils::info("pay440004 ---> authentication 2 参数 : " .json_encode($data));
            $resultData = HttpManager::httpRequest("POST", $url, $data);
            LogUtils::info("pay440004 ---> authentication 2 result : " . $resultData);

            if($resultData === 0 || $resultData === "0"){
                $isSuccess = true;
            }
        }
        LogUtils::info("pay440004 ---> authentication url : " . $url);
        return $isSuccess;
    }

    /**
     * 构建到局方用户验证地址
     * @param null $returnUrl
     * @return mixed
     */
    public function buildVerifyUserUrl($returnUrl = null)
    {
        return;
    }

    /**
     * 进入订购界面前，特殊处理并将需要渲染的参数返回
     */
    public function payShow()
    {
        return;
    }

    /**
     * 构建到局方的订购参数
     * @param $payInfo
     * @return mixed
     */
    public function buildPayInfo($payInfo = null)
    {
        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay440004::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return $ret;
        }
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;

        $epgInfoMap = MasterManager::getEPGInfoMap();
        $payInfo->devNo = $epgInfoMap["client"];
        $payInfo->caRegionCode = $epgInfoMap["caRegionCode"];

        //创建订购参数
        if(self::isNewPay){
            $payUrl = $this->_buildPayInfo($payInfo);
            $ret['result'] = 0;
            $ret['payUrl'] = $payUrl;
        }else{
            $payInfo = $this->_buildPayInfo_old($payInfo);
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
        return;
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function directToPay($orderInfo = null)
    {
        $payInfo = new \stdClass();
        $payInfo->userId = MasterManager::getUserId();
        $payInfo->carrierId = MasterManager::getCarrierId();
        $payInfo->vip_id = 35;                                 // 后台配置的vip_id
        $payInfo->vip_type = 2;              // 后台配置的vip_type,用户判断是单次还是包月
        $payInfo->price = 2500;                    // 价格（单位分）
        $payInfo->orderReason=102;
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
     * 订购回调接口
     * @param null $payResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {
        $assistdata = $_GET['assistdata'];
        if(!self::isNewPay){
            $this->payCallback_old($payResultInfo);
            return;
        }

        LogUtils::info(" payCallback 440004 ---> payResult: " . json_encode($_GET));
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

        // 判断用户是否是VIP
        $isVip = UserManager::isVip($payResultInfo->userId);

        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult($isVip);

        // 用户是否是VIP，更新到session中
        MasterManager::setVIPUser($isVip);

        if (($payResultInfo->lmreason != null && ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1))) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }

            // 去掉一级目录
            if ($payResultInfo->lmreason == 1) {
                $srcUrl = "http://172.31.134.185:10006/epg-lws-for-apk-440004";
                $destUrl = "http://203.132.32.92:10006";
                $intentUrl = str_replace($srcUrl, $destUrl, $intentUrl);
            } else {
                $srcUrl = "http://172.31.134.185:10006/epg-lws-for-apk-440004";
                $destUrl = "http://172.31.134.185:10006:10006";
                $intentUrl = str_replace($srcUrl, $destUrl, $intentUrl);
            }

            LogUtils::info("payCallback440004::payCallback() url:". $intentUrl);
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
            $showOrderResultObj = IntentManager::createIntent("payShowResult");
            $showOrderResultObj->setParam("isSuccess", $payResultInfo->result == 0 ? "1" : "0");

            $intent = IntentManager::createIntent($payResultInfo->returnPageName);
            IntentManager::jump($showOrderResultObj, $intent, IntentManager::$INTENT_FLAG_DEFAULT);

            //LogUtils::info("Pay440004::payCallback() ---> jump returnPageName: " . $returnPageName);
            //IntentManager::back($returnPageName);
        }

    }

    public function payNotifyback(){
        $data = file_get_contents('php://input');
        LogUtils::info(" payNotifyback 440004 ---> data: " . $data);
        LogUtils::info(" payNotifyback 440004 ---> _GET: " . json_encode($_GET));
        LogUtils::info(" payNotifyback 440004 ---> _POST: " . json_encode($_POST));
        $postData=json_decode($data);
        //LogUtils::info(" payNotifyback 440004 ---> opcode: " . $postData['opcode']);
        //LogUtils::info(" payNotifyback 440004 ---> opcode: " . $postData->opcode);
        $payResultInfo = new \stdClass();
        $payResultInfo->opcode = $postData->opcode;//$_POST['opcode'];//0：表示开通 1：表示退订
        $payResultInfo->cpcode = $postData->cpcode;//$_POST['cpcode'];
        $payResultInfo->requestseq = $postData->requestseq;//$_POST['requestseq'];
        $payResultInfo->keyno = $postData->keyno;//$_POST['keyno'];
        $payResultInfo->servid = $postData->servid;//$_POST['servid'];
        $payResultInfo->tradeNo = $postData->assistdata;//$_POST['assistdata'];
        $payResultInfo->signdata = $postData->signdata;//$_POST['signdata'];
        LogUtils::info("payNotifyback 440004 ---> payResultInfo: " . json_encode($payResultInfo));

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
     * 订购回调接口
     * @param null $payResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function payCallbackUHealth($payResultInfo = null)
    {
        if ($payResultInfo == null) {
            //从session中取出之前已经缓存了的我方的订购参数
            $param = json_decode(MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->returnPageName = $param->returnPageName;
            $payResultInfo->isPlaying = $param->isPlaying;
            $payResultInfo->videoInfo = $param->videoInfo;
            //得到局方返回的订购参数
            $payResultInfo->result = $_GET['resultCode'];
            $payResultInfo->message = $_GET['resultDesc'];
            $payResultInfo->spOrderId = $_GET['orderNo']; //我方订单号
            $payResultInfo->orderId = $_GET['streamNo']; //局方订单号
        }
        LogUtils::info(" payCallback 440094 ---> uhealth payResult: " . json_encode($payResultInfo));

        // 上报订购结果,暂时不需要
        $uploadPayResult = $this->_uploadPayResult($payResultInfo);

        // 判断用户是否是VIP
        if ($payResultInfo->result == 0) {
            $isVip = 1;
        } else {
            $isVip = 0;
        }

        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult($isVip);

        // 用户是否是VIP，更新到session中
        MasterManager::setVIPUser($isVip);

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        //显示订购结果页面
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $payResultInfo->result == 0 ? "1" : "0");
        if($payResultInfo->result == 0 && !$uploadPayResult){
            $showOrderResultObj->setParam("msg", "上报结果失败");
        }

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
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
     * 订购结果显示界面前，特殊处理并将需要渲染的参数返回
     */
    public function payShowResult($payController = null)
    {
        return array(
            "isSuccess" => $_GET["isSuccess"],
            "msg" => $_GET["msg"]
        );
    }

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function unPayCallback($unPayResultInfo = null)
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
     * 构建订购返回地址
     * @param null $param
     * @return string
     */
    private function _buildUnPayCallbackUrl($param = null)
    {
        return;
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
        $payInfo->returnUrl = $this->_buildPayCallbackUrl($payInfo);  //构建返回地址
        $payInfo->appkey = appKey;

        $payInfo->vip_type = "2";//目前只有包月的
        if ($payInfo->vip_type == "2") {
            //续包月产品
            $payInfo->productid = productId;
            $payInfo->orderUrl = USER_ORDER_URL . MONTH_ORDER_FUNC; //订购地址
        }
        //计算校验值sign
        $signSrc = "CARegionCode=" . $payInfo->caRegionCode . "&devno=" . $payInfo->devNo . "&orderNo=" . $payInfo->tradeNo . "&productid=" . $payInfo->productid . "&returnUrl=" . urlencode($payInfo->returnUrl) . "&appkey=" . $payInfo->appkey;
        LogUtils::info("_buildPayUrl ---> sign src text : " . $signSrc);
        $payInfo->sign = md5($signSrc);
        LogUtils::info("_buildPayUrl ---> payInfo : " . json_encode($payInfo));

        return $payInfo;
    }

    /**
     * 上报订购结果
     * @param $payResultInfo
     * @return 上报结果
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        $payResultInfo = array(
            'TradeNo' => $payResultInfo->tradeNo,
            'reason' => $payResultInfo->lmreason,
            'transactionID' => $payResultInfo->orderId,
            'Result' => $payResultInfo->result,
            'Description' => $payResultInfo->message,
            'UserID' => $payResultInfo->userId,
        );
        if(empty($payResultInfo['Result'])){
            $payResultInfo['Result'] = -1;
        }
        $payResultInfo['carrierId'] = isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID;
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $uploadPayResult = PayAPI::postPayResultEx($payResultInfo);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
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

            'devNo' => $epgInfoMap["client"],
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
        $orderInfo->lmreason = 1;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay440004::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->price = $orderItems[0]->price;

        $orderInfo->devNo = $userInfo->devNo;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark); // 向CWS获取订单号
        LogUtils::info("Pay440004::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            //创建订购参数
            //$payInfo = $this->_buildPayInfo($orderInfo,true);
            $payInfo = $this->_buildPayInfo_old($orderInfo,true);

            // 变换为公网IP 把172.31.134.185:10017 ---> 203.132.32.92:10017
            $srcUrl = "172.31.134.185";
            $destUrl = "203.132.32.92";

            $payInfo->orderUrl = str_replace($srcUrl, $destUrl, $payInfo->orderUrl);
            $payInfo->returnUrl = str_replace($srcUrl, $destUrl, $payInfo->returnUrl);
            $payInfo->imageUrl = str_replace($srcUrl, $destUrl, $payInfo->imageUrl);

            LogUtils::info("Pay440004::webPagePay buildPayInfo --->: " . json_encode($payInfo));

            $intent = IntentManager::createIntent("directPay");
            $intent->setParam("orderParam", rawurlencode(json_encode($payInfo)));
            $goUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($goUrl, "http://")) {
                $goUrl = "http://" . $_SERVER['HTTP_HOST'] . $goUrl;  // 回调地址需要加上全局路径
            }

            // 变换为公网IP 把172.31.134.185:10017 ---> 203.132.32.92:10017
            $srcUrl = "http://172.31.134.185:10017/index.php/Home/Pay/directPay";
            $destUrl = "http://203.132.32.92:10017/index.php/Home/Pay/directPay";
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
        $orderInfo->lmreason = 2;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay440004::buildDirectPayUrl ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->price = $orderItems[0]->price;
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("epgInfoMap:".json_encode($epgInfoMap));
        $orderInfo->devNo = $epgInfoMap["client"];

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark); // 向CWS获取订单号
        LogUtils::info("Pay440004::buildDirectPayUrl pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            //创建订购参数self::isNewPay
            if(self::isNewPay){
                $payInfo = $this->_buildPayInfo($orderInfo,true);
                LogUtils::info("Pay440004::buildDirectPayUrl buildPayInfo --->: " . json_encode($payInfo));
                $payUrl = $payInfo;
                //使用代理地址
                //$srcUrl = "http://10.205.22.158";
                //$destUrl = "http://172.31.134.185:10017";
                //$payUrl = str_replace($srcUrl, $destUrl, $payInfo);
            }else{
                $payInfo = $this->_buildPayInfo_old($orderInfo,true);
                LogUtils::info("Pay440004::buildDirectPayUrl buildPayInfo --->: " . json_encode($payInfo));
                $intent = IntentManager::createIntent("directPay");
                $intent->setParam("orderParam", rawurlencode(json_encode($payInfo)));
                $goUrl = IntentManager::intentToURL($intent);
                if (!TextUtils::isBeginHead($goUrl, "http://")) {
                    $goUrl = "http://" . $_SERVER['HTTP_HOST'] . $goUrl;  // 回调地址需要加上全局路径
                }
                $payUrl = $goUrl;
            }

            // 变换为公网IP 把172.31.134.185:10006 ---> 203.132.32.92:10006
            //$srcUrl = "http://172.31.134.185:10006/epg-lws-for-apk-440004/epg-lws-for-apk-440004/index.php/Home/Pay/directPay";
            //$destUrl = "http://172.31.134.185:10006/epg-lws-for-apk-440004/index.php/Home/Pay/directPay";
            //$payUrl = str_replace($srcUrl, $destUrl, $goUrl);
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);

        return $payUrl;
    }

    public function buildPayUrl($payInfo = null)
    {
        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark);
        //LogUtils::info("[Pay440004.class.php ]::buildPayUrl() ---> orderInfo："+$orderInfo);
        LogUtils::info("pay440004::buildPayUrl() ---> 获取订单：" . json_encode($orderInfo));
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay440004::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return $ret;
        }
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;

        $epgInfoMap = MasterManager::getEPGInfoMap();
        $payInfo->devNo = $epgInfoMap["client"];
        $payInfo->caRegionCode = $epgInfoMap["caRegionCode"];

        //创建订购参数
        if(self::isNewPay){
            $payInfo = $this->_buildPayInfo($payInfo,false);
            $ret['result'] = 0;
            $ret['payUrl'] = $payInfo;
        }else{
            $payInfo = $this->_buildPayInfo_old($payInfo,false);
            $ret['result'] = 0;
            $ret['payInfo'] = $payInfo;
        }

        return json_encode($ret);
    }

    //老版本计费接口
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
        $payInfo->imageUrl = APP_ROOT_PATH . "/Public/img/hd/Pay/V440004/pay_page_logo.jpg"; // 显示在局方订购页的产品海报
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

        //续包月产品
        $payInfo->productId = productId_month;//订购产品
        $payInfo->orderUrl = urlencode($proxy_url.MONTH_ORDER_FUNC); //订购地址
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
            //从session中取出之前已经缓存了的我方的订购参数
            $param = json_decode(MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->returnPageName = $param->returnPageName;
            $payResultInfo->isPlaying = $param->isPlaying;
            $payResultInfo->videoInfo = $param->videoInfo;
            //得到局方返回的订购参数
            $payResultInfo->result = isset($_GET['result'])?$_GET['result']:-1;
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
        LogUtils::info(" payCallback 440004 ---> payResult: " . json_encode($payResultInfo));
        if($_GET['result'] == "1008"){
            $payResultInfo->result = 0;
        }

        // 上报订购结果,暂时不需要
        $uploadPayResult = $this->_uploadPayResult($payResultInfo);

        // 判断用户是否是VIP
        $isVip = UserManager::isVip($payResultInfo->userId);

        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult($isVip);

        // 用户是否是VIP，更新到session中
        MasterManager::setVIPUser($isVip);

        if (($payResultInfo->lmreason != null && ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1))) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }

            // 去掉一级目录
            if ($payResultInfo->lmreason == 1) {
                $srcUrl = "http://172.31.134.185:10006/epg-lws-for-apk-440004";
                $destUrl = "http://203.132.32.92:10006";
                $intentUrl = str_replace($srcUrl, $destUrl, $intentUrl);
            } else {
                $srcUrl = "http://172.31.134.185:10006/epg-lws-for-apk-440004";
                $destUrl = "http://172.31.134.185:10006:10006";
                $intentUrl = str_replace($srcUrl, $destUrl, $intentUrl);
            }

            LogUtils::info("payCallback440004::payCallback() url:". $intentUrl);
            header("Location:" . $intentUrl);
            return;
        }

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        //显示订购结果页面
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $payResultInfo->result == 0 ? "1" : "0");
        if($payResultInfo->result == 0 && !$uploadPayResult){
            $showOrderResultObj->setParam("msg", "上报结果失败");
        }

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
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
            "keyno" => $epgInfoMap['client'],
            "servid" => $epgInfoMap['account'],
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