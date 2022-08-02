<?php

namespace Home\Model\Order;


use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;

class Pay370002 extends PayAbstract
{

    /**
     * 用户到局方鉴权，使用cws的接口
     * @param: $isVip 在我方是否是vip
     * @return mixed -1,表示其他错误，9303 表示未订购 9304表示已订购
     */
    public function authentication($isVip = null)
    {
        /*$userTypeAuth = -1;
        $accountTpye = 1;
        $authResult = PayAPI::authenticationFor370002(MasterManager::getAccountId(), $accountTpye, MasterManager::getUserToken());
        if ($authResult) {
            $authResultJson = json_decode($authResult, true);
            //if ($authResultJson['result'] == "9303" || $authResultJson['result'] == "9304") {
            $userTypeAuth = $authResultJson['result'];
            // }
        }
        return $userTypeAuth;*/
        $productPacketType = "0";  // 大包产品类型标识
        $isVip = $this->performAuthIdentity(CONTENT_ID_CONFIG[$productPacketType]);
        if(!$isVip){
            //对新产品进行鉴权
            $productPacketType = "4";
            $isVip = $this->performAuthIdentity(CONTENT_ID_CONFIG[$productPacketType]);
        }
        return $isVip;
    }

    /**
     * 根据当前内容鉴权当前用户的身份
     *
     * @param: $contentId 鉴权的内容Id
     * @return int 0 -- 当前内容未订购； 1 -- 当前内容已订购
     */
    public function performAuthIdentity($contentId)
    {
        $isVipWithContent = 0;
        $transactionID = SPID . date("YmdHis") . mt_rand(100000000, 999999999) . mt_rand(100000000, 999999999);
        $contentType = 0;

        $requestParam = array(
            "serviceAuth"=> array(
                "serviceAuthReq" => array("transactionID" => $transactionID, // 事务编号
                    "spID" => SPID, // 应用商唯一标识
                    "userID" => MasterManager::getAccountId(), // IPTV用户编号
                    "userToken" => MasterManager::getUserToken(), // 临时身份证明
                    "productID" => "", // 产品编号
                    "serverID" => "", // 服务编号
                    "contentID" => $contentId, // 内容编号
                    "contentType" => $contentType, // vod(普通节目)
                    "timeStamp" => Utils::getMillisecond(), // 时间戳,单位毫秒
                    "ip" => "", // IP地址
                    "mac" => "", // 机顶盒Mac地址),
                ),
            ),
        );

        LogUtils::info("pay370092::performAuthIdentity() ---> requestParam：" . json_encode($requestParam));

        $userAuthFunc = "serviceAuth";
        //$authResult = SoapManager::request(USER_AUTH_URL, $userAuthFunc, $requestParam);
        $authResult = $this->requestSoap(USER_AUTH_URL, $userAuthFunc, $requestParam);
        if ($authResult == null) {
            LogUtils::info("pay370092::performAuthIdentity() ---> authResult is null");
        } else {
            LogUtils::info("pay370092::performAuthIdentity() ---> authResult：" . json_encode($authResult));
        }

        $userTypeAuth = $authResult->serviceAuthReturn->result;
        LogUtils::info("pay370092::performAuthIdentity() ---> userTypeAuth：" . $userTypeAuth);
        if ($userTypeAuth == "9304" || $userTypeAuth == "0" || $userTypeAuth == "9383" || $userTypeAuth == "9648") {
            //鉴权成功，表示用户是订购过的
            $isVipWithContent = 1;
        } else if ($userTypeAuth == "9303") {
            //其他鉴权失败，不取消vip
            $isVipWithContent = 0;
        }

        return $isVipWithContent;
    }

    /**
     * 构建到局方用户验证地址
     * @param $param
     * @return mixed
     */
    public function buildVerifyUserUrl($param = null)
    {
        // TODO: Implement buildVerifyUserUrl() method.
    }

    /**
     * 进入订购界面前，特殊处理并将需要渲染的参数返回
     * @return mixed
     */
    public function payShow()
    {
        // TODO: Implement payShow() method.
    }

    /**
     * 构建订购参数
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayInfo($payInfo = null)
    {
        // 创建支付订单
        $ret = array();

        $authResult = $this->authentication();
        if ($authResult == 1) {
            $ret['result'] = $authResult == "0" ? "9304" : $authResult; // 0 跟返回订购地址冲突，所以改成9304。表示已经订购
            $ret['message'] = "用户已经订购!";
            LogUtils::info("pay370002::buildPayUrl() ---> 用户已经订购：" . $authResult);
            //鉴权成功，表示用户是订购过的
            $isVip = UserManager::isVip(MasterManager::getUserId());     //判断用户是否是我方VIP用户
            if (!$isVip) {
                if (UserManager::regVip(MasterManager::getUserId()) == 1) {
                    $isVip = 1;
                    //缓存用户信息
                    SessionManager::setUserSession(SessionManager::$S_IS_VIP_USER, $isVip);
                }
            }
            return json_encode($ret);
        }

        if($payInfo->vip_id == "undefined"){
            $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());
            if (count($orderItems) <= 0) {
                $ret['result'] = -1;
                $ret['message'] = "拉取订购配置失败";
                return json_encode($ret);
            }
            $payInfo->vip_id = $orderItems[0]->vip_id;
            $payInfo->orderReason =102;
        }

        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay370002::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;
        $payInfo->returnPageName = "";
        $payInfo->videoInfo = "";
        $payInfo->lmreason = "0";

        // 创建订购地址
        $payUrl = $this->_buildPayUrl($payInfo);

        $ret['result'] = 0;
        $ret['payUrl'] = $payUrl;

        LogUtils::info("pay370002::buildPayUrl() ---> result：" . json_encode($ret));
        return json_encode($ret);
    }

    /**
     * 此函数用于内部构建订购链接
     * @param $payInfo
     * @return string
     */
    public function _buildPayUrl($payInfo)
    {

        $userAoccunt = MasterManager::getAccountId();
        // $productID = PRODUCT_ID;
        $productID = PRODUCT_ID;
        $payInfo->packetType = '4';//先走独立包
        $ContentID = CONTENT_ID_CONFIG[$payInfo->packetType];
        $info = "userID=" . $userAoccunt;
        $info = $info . "$" . "productID=" . $productID;
        $info = $info . "$" . "ContentID=" . $ContentID;
        $info = $info . "$" . "notifyUrl=" . "";

        LogUtils::info("pay370002::buildPayUrl() --->Crypt3DES before info ：" . $info);
        $info = Crypt3DES::encode($info, KEY);
        LogUtils::info("pay370002::buildPayUrl() --->Crypt3DES after info ：" . $info);

        // 构建返回地址
        $returnUrl = $this->_buildPayCallbackUrl($payInfo);

        // 组装订购地址
        $pram = array(
            "transactionID" => $payInfo->tradeNo,
            "SPID" => SPID,
            "isFromAPK" => 1,
            "returnUrl" => urlencode(urlencode(mb_convert_encoding($returnUrl, 'utf-8', 'gbk'))),
            "INFO" => urlencode(mb_convert_encoding($info, 'utf-8', 'gbk')),
        );
        $payUrl = USER_ORDER_URL;
        foreach ($pram as $key => $value) {
            if (strpos($payUrl, '?') === false) {
                $payUrl = $payUrl . '?' . $key . "=" . $value;
            } else {
                $payUrl = $payUrl . '&' . $key . "=" . $value;
            }
        }
        LogUtils::info("pay370002::buildPayUrl() ---> payUrl：" . $payUrl);
        return $payUrl;
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl()
    {
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
            LogUtils::error("Pay370002::buildDirectPayUrl ---> pay orderItem is empty");
            return $payUrl;
        }

        $i=1;
        while($i<=3)
        {
            $isvip = $this->performAuthIdentity(CONTENT_ID_CONFIG[$i]);
            if($isvip){
                LogUtils::error("Pay370002::buildDirectPayUrl ---> pay orderItem is vip:".CONTENT_ID_CONFIG[$i]);
                return $payUrl;
            }
            $i++;
        }


        // 去第一个，默认包月对象
        //$orderInfo->vipId = $orderItems[0]->vip_id;
        //$orderInfo->packetType=0;
        $randid = rand(0,9);
        if($randid < 4){
            $orderInfo->vipId = $orderItems[0]->vip_id;
            $orderInfo->packetType=0;
        }elseif($randid >= 4 && $randid <=5){
            $orderInfo->vipId = $orderItems[2]->vip_id;
            $orderInfo->packetType=1;
        }elseif($randid >= 6 && $randid <=7){
            $orderInfo->vipId = $orderItems[3]->vip_id;
            $orderInfo->packetType=2;
        }else{
            $orderInfo->vipId = $orderItems[1]->vip_id;
            $orderInfo->packetType=3;
        }

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay370002::buildDirectPayUrl pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($orderInfo);
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);

        return $payUrl;
    }

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildUnPayUrl($payInfo = null)
    {
        // TODO: Implement buildUnPayUrl() method.
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        // TODO: Implement directToPay() method.


    }

    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     */
    public function payCallback($payResultInfo = null)
    {
        LogUtils::info(" payCallback 370002 ---> payCallback" );

        if ($payResultInfo == null) {
            //从session中取出之前已经缓存了的我方的订购参数
            $param = json_decode(SessionManager::getUserSession(SessionManager::$S_PAY_CALLBACK_PARAM));
            LogUtils::info(" payCallback 370002 ---> payCallback===>param session: " . SessionManager::getUserSession(SessionManager::$S_PAY_CALLBACK_PARAM));
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->isPlaying = $param->isPlaying;
            $payResultInfo->packetType = $param->packetType;
            //得到局方返回的订购参数

            $payResultInfo->transactionID = isset($_REQUEST['transactionID']) ? $_REQUEST['transactionID'] : "";
            $payResultInfo->result = isset($_REQUEST['result']) ? $_REQUEST['result'] : -1;
            $payResultInfo->description = isset($_REQUEST['description']) ? $_REQUEST['description'] : "";
            $payResultInfo->purchaseType = isset($_REQUEST['purchaseType']) ? $_REQUEST['purchaseType'] : "";
            $payResultInfo->expiredTime = isset($_REQUEST['expiredTime']) ? $_REQUEST['expiredTime'] : "";
            $payResultInfo->subscriptionExtend = isset($_REQUEST['subscriptionExtend']) ? $_REQUEST['subscriptionExtend'] : "";
            $payResultInfo->subscriptionID = isset($_REQUEST['subscriptionID']) ? $_REQUEST['subscriptionID'] : "";
        }

        //局方回调时，传回参数不全，对回调地址进行二次编码，对返回内容进行解析
        if(empty($payResultInfo->tradeNo)){
            $payResultInfo->tradeNo=$payResultInfo->transactionID;
            $payResultInfo->userId=isset($_REQUEST['userId']) ? $_REQUEST['userId'] : "";
            $data=explode("&",$payResultInfo->userId);
            $num = count($data);
            for($i=0;$i<$num;$i++){
                if($i==0){
                    $payResultInfo->userId = $data[$i];
                    continue;
                }

                $tmp = explode("=",$data[$i]);
                switch ($tmp[0])
                {
                    case "tradeNo":
                        $payResultInfo->tradeNo = $tmp[1];
                        break;
                    case "lmreason":
                        $payResultInfo->lmreason = $tmp[1];
                        break;
                    case "lmcid":
                        $payResultInfo->lmcid = $tmp[1];
                        break;
                    case "returnPageName":
                        $payResultInfo->returnPageName = $tmp[1];
                        break;
                    case "isPlaying":
                        $payResultInfo->isPlaying = $tmp[1];
                        break;
                    case "packetType":
                        $payResultInfo->packetType = $tmp[1];
                        break;
                    case "videoInfo":
                        $payResultInfo->videoInfo = $tmp[1];
                        break;
                }
            }
        }
        LogUtils::info(" payCallback 370002 ---> payResult: " . json_encode($payResultInfo));
        $isVip = 0;
        if ($payResultInfo->result === 0 || $payResultInfo->result == '0') {
            if ($payResultInfo->packetType === 0 || $payResultInfo->packetType === '0') { // 订购大包类型
                $isVip = 1;
                // 把订购是否成功的结果写入cookie，供页面使用
                MasterManager::setOrderResult($isVip);
                // 用户是否是VIP，更新到session中
                MasterManager::setVIPUser($isVip);
                $payResultInfo->packType = "0";
            } else {                                                                     // 订购小包类型
                // 获取当前已订购的小包类型
                $orderPackets = json_decode(MasterManager::getOrderPacketType());
                // 添加到缓存中并返回
                array_push($orderPackets, (string)($payResultInfo->packetType));
                MasterManager::setOrderPacketType(json_encode($orderPackets));
                $payResultInfo->packType = "1";
            }
            // 订购成功，上报订购结果
            $payResultInfo->orderSuccess = "1";
            // 上报结果到CWS
            $this->_uploadPayResult($payResultInfo);
        } else if ($payResultInfo->result === 2 || $payResultInfo->result == '2') {
            // $payResultInfo->orderSuccess = "-2";
            IntentManager::back($payResultInfo->returnPageName);
            return;
        } else {
            $payResultInfo->orderSuccess = "-1";
        }

        if (($payResultInfo->lmreason != null && ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1))) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            LogUtils::info("payCallback370002::payCallback() url:" . $intentUrl);
            header("Location:" . $intentUrl);
            return;
        }

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = SessionManager::getUserSession(SessionManager::$S_PLAY_PARAM) ? SessionManager::getUserSession(SessionManager::$S_PLAY_PARAM) : null;
        }

        //显示订购结果页面，该界面显示的是局方的订购结果（不包括订购成功后上报到我方服务器，是否在我方服务器上变成了vip）
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $payResultInfo->orderSuccess);
        $showOrderResultObj->setParam("returnPageName", $payResultInfo->returnPageName);  // 增加一个返回页面名称

        $url = IntentManager::intentToURL($showOrderResultObj);
        LogUtils::info(" payCallback370002 ---> showOrderResult url: " . $url);

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
            LogUtils::info(" payCallback370002 ---> player: ");
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        } else {
            LogUtils::info(" payCallback370002 ---> not player: ");
            header('Location:' . $url);
        }
    }

    /**
     * 上报订购结果,只上报订购成功
     * @param $payResultInfo
     * @return 上报结果
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $param = array(
            "TradeNo" => $payResultInfo->tradeNo,
            "reason" => $payResultInfo->lmreason,
            "transactionID" => $payResultInfo->transactionID,
            "result" => $payResultInfo->result,
            "description" => $payResultInfo->description,
            "purchaseType" => $payResultInfo->purchaseType,
            "expiredTime" => $payResultInfo->expiredTime,
            "subscriptionExtend" => $payResultInfo->subscriptionExtend,
            "subscriptionID" => $payResultInfo->subscriptionID,
            "packType" => $payResultInfo->packType,
        );
        $url = ORDER_CALL_BACK_URL;
        foreach ($param as $key => $value) {
            if (strpos($url, '?') === false) {
                $url = $url . '?' . $key . "=" . $value;
            } else {
                $url = $url . '&' . $key . "=" . $value;
            }
        }
        LogUtils::info("postPayResultEx --->url : " . $url);
        $uploadPayResult = HttpManager::httpRequest("GET", $url, null);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
    }

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     */
    public function unPayCallback($unPayResultInfo = null)
    {
        // TODO: Implement unPayCallback() method.
    }

    /**
     * 订购结果显示界面，特殊处理
     * @param payController|null $
     * @return mixed
     */
    public function payShowResult($payController = null)
    {
        return $_GET;
    }

    /**
     * 构建订购返回地址
     * @param null $payInfo
     * @return string
     */
    private function _buildPayCallbackUrl($payInfo = null)
    {
        $intent = IntentManager::createIntent("payCallback");
        $intent->setParam("userId", MasterManager::getUserId());
        $intent->setParam("tradeNo", $payInfo->tradeNo);
        $intent->setParam("lmreason", $payInfo->lmreason != null ? $payInfo->lmreason : 0);
        $intent->setParam("lmcid", MasterManager::getCarrierId());
        $intent->setParam("returnPageName", $payInfo->returnPageName);
        $intent->setParam("isPlaying", $payInfo->isPlaying);
        $intent->setParam("packetType", $payInfo->packetType);
        $intent->setParam("videoInfo", rawurlencode($payInfo->videoInfo));

        LogUtils::info("_buildPayCallbackUrl ---> payInfo: " . json_encode($payInfo));

        SessionManager::setUserSession(SessionManager::$S_PAY_CALLBACK_PARAM, json_encode($payInfo));

        LogUtils::info("_buildPayCallbackUrl ---> payInfo session: " . SessionManager::getUserSession(SessionManager::$S_PAY_CALLBACK_PARAM));

        $url = IntentManager::intentToURL($intent);
        if ($payInfo->lmreason == 1) {
            if (!TextUtils::isBeginHead($url, "http://")) {
                if (defined(APP_ROOT_PATH)) {
                    $url = APP_ROOT_PATH . $url;                       // 回调地址需要加上全局路径
                } else {
                    $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
                }
            }
        } else {
            $url = "http://sddx.39health.visionall.cn:10018" . $url;
        }
        LogUtils::info("_buildPayCallbackUrl ---> url: " . $url);
        return $url;
    }

    /**
     * 通过web浏览器进行订购
     * @param null $userInfo
     * @return mixed
     */
    public function webPagePay($userInfo)
    {
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
            LogUtils::error("Pay370002::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        $i=1;
        while($i<=3)
        {
            $isvip = $this->performAuthIdentity(CONTENT_ID_CONFIG[$i]);
            if($isvip){
                LogUtils::error("Pay370002::webPagePay ---> pay orderItem is vip:".CONTENT_ID_CONFIG[$i]);
                return $payUrl;
            }
            $i++;
        }

        // 去第一个，默认包月对象
        $randid = rand(0,9);
        if($randid < 4){
            $orderInfo->vipId = $orderItems[0]->vip_id;
            $orderInfo->packetType=0;
        }elseif($randid >= 4 && $randid <=5){
            $orderInfo->vipId = $orderItems[2]->vip_id;
            $orderInfo->packetType=1;
        }elseif($randid >= 6 && $randid <=7){
            $orderInfo->vipId = $orderItems[3]->vip_id;
            $orderInfo->packetType=2;
        }else{
            $orderInfo->vipId = $orderItems[1]->vip_id;
            $orderInfo->packetType=3;
        }


        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay370002::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($orderInfo);
        }
        LogUtils::info("webPagePay pay PayUrl: " . $payUrl);

        header("Location:" . $payUrl);
    }


    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {

        // 通过缓存得到用户账号和token
        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'userToken' => MasterManager::getUserToken(),
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platformType' => MasterManager::getPlatformType(),
        );

        return $info;
    }

    public function requestSoap($wsdl, $function, $params)
    {
        header("content-type:text/html;charset=utf-8");
        LogUtils::info("requestSoap url:" . $wsdl);
        LogUtils::info("requestSoap function:" . $function);

        $result = null; // 提前定义返回结果

        $isTraceLog = 1; // 是否跟踪异常日志
        $encodeType = "UTF-8"; // 编码类型

        try {
            //解决OpenSSL Error问题需要加第二个array参数，具体参考 http://stackoverflow.com/questions/25142227/unable-to-connect-to-wsdl
            $client = new \SoapClient($wsdl
                , array(
                    "stream_context" => stream_context_create(
                        array(
                            'ssl' => array(
                                'verify_peer' => false,
                                'verify_peer_name' => false,
                            )
                        )
                    ),
                    'soap_version' => SOAP_1_1,      //设置soap版本，默认为：SOAP_1_1
                    'trace' => $isTraceLog,                 //跟踪异常
                    'cache_wsdl' => WSDL_CACHE_NONE,    //禁止缓存服务器 wsdl
                    'encoding' => $encodeType
                )
            );
            LogUtils::info("requestSoap params:" . json_encode($params));
            $result = $client->__soapCall($function, $params);
            LogUtils::info("requestSoap result" . json_encode($result));
            return $result;
        } catch (SOAPFault $e) {
            LogUtils::info("soap error, wsdl=" . $wsdl . ", params=" . $params . ",error=" . $e);
            return null;
        }
    }

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
    }
}