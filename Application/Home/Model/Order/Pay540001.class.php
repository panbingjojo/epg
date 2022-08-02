<?php

namespace Home\Model\Order;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;

class Pay540001 extends PayAbstract
{

    /**
     * 用户到局方鉴权，使用cws的接口
     */
    public function authentication($userInfo = null)
    {

        $ret = false;
        // 用户信息从 apkInfo中取
        $apkInfo = MasterManager::getApkInfo();
        if(gettype($apkInfo) == 'string'){
            $apkInfo = json_decode($apkInfo);
        }
        $productInfo = new \stdClass();
        $productInfo->userId = $apkInfo->loginAccount;
        $productInfo->token = MasterManager::getUserToken();
        $productInfo->terminalId = $apkInfo->snNum;
        $productInfo->copyrightId = "698057";
        $productInfo->contentId = CONTENT_ID;
        $productInfo->subContentId = "";
        $productInfo->systemId = "0";
        $productInfo->consumeLocal = "26";      // 可能apkInfo中会有
        $productInfo->consumeScene = "01";
        $productInfo->consumeBehaviour = "02";
        $productInfo->path = "";
        $productInfo->preview = "0";
        $productInfo->channelId = CHANNEL_ID;
        $productInfo->productId = "";           // 鉴权所有产品

        $result = $this->scspProxyAuthorize($productInfo);
        if (!empty($result)) {
            $xmlObj = simplexml_load_string($result);
            if ((string)$xmlObj->body->authorize['result'] == '0') {
                $authorizationNum = (string)$xmlObj->body->authorize['authorizationNum'];
                $productCode = (string)$xmlObj->body->authorize['productCode'];
                $apkInfo = MasterManager::getApkInfo();
                if(gettype($apkInfo) == 'string'){
                    $apkInfo = json_decode($apkInfo);
                }
                $apkInfo->authorizationNum = $authorizationNum;
                $apkInfo->productCode = $productCode;
                // TODO  后续需要添加解析用户所属的包月套餐类型。
                $ret = true;
            }
        }
        return $ret;
    }

    /**
     * 鉴权返回产品列表信息
     * @param null $userInfo
     * @return \stdClass
     */
    public function authenticationEx($userInfo = null)
    {
        // 用户信息从 apkInfo中取
        $apkInfo = MasterManager::getApkInfo();
        if(gettype($apkInfo) == 'string'){
            $apkInfo = json_decode($apkInfo);
        }
        $productInfo = new \stdClass();
        $productInfo->userId = $apkInfo->loginAccount;
        $productInfo->token = MasterManager::getUserToken();
        $productInfo->terminalId = $apkInfo->snNum;
        $productInfo->copyrightId = "698057";
        $productInfo->contentId = CONTENT_ID;
        $productInfo->subContentId = "";
        $productInfo->systemId = "0";
        $productInfo->consumeLocal = "26";      // 可能apkInfo中会有
        $productInfo->consumeScene = "01";
        $productInfo->consumeBehaviour = "02";
        $productInfo->path = "";
        $productInfo->preview = "0";
        $productInfo->channelId = CHANNEL_ID;
        $productInfo->productId = "";           // 鉴权所有产品

        $authInfo = new \stdClass();
        $authInfo->result = -1;
        $result = $this->scspProxyAuthorize($productInfo);
        if (!empty($result)) {
            $xmlObj = simplexml_load_string($result);
            $authInfo->result = (string)$xmlObj->body->authorize['result'];
            $authInfo->resultDesc = (string)$xmlObj->body->authorize['resultDesc'];
            $authInfo->authorizationNum = (string)$xmlObj->body->authorize['authorizationNum'];
            $authInfo->productCode = (string)$xmlObj->body->authorize['productCode'];
            $authInfo->accountIdentifyPhone = (string)$xmlObj->body->authorize['accountIdentifyPhone'];
            $authInfo->noproductInfo = (string)$xmlObj->body->authorize['noproductInfo'];
            $authInfo->accountIdentifyNonMobile = (string)$xmlObj->body->authorize['accountIdentifyNonMobile'];
            $authInfo->accountIdentify = (string)$xmlObj->body->authorize['accountIdentify'];

            if (($authInfo->result == '1' || $authInfo->result == '20')
                && $xmlObj->body->authorize->productToOrderList->Product) {
                $authInfo->productInfos = array();
                foreach ($xmlObj->body->authorize->productToOrderList->Product as $product) {
                    $authProductInfo = new \stdClass();
                    $authProductInfo->productCode = (string)$product['productCode'];
                    $authProductInfo->productInfo = (string)$product['productInfo'];
                    $authProductInfo->orderContentId = (string)$product['orderContentId'];
                    $authProductInfo->productPrice = (string)$product['productPrice'];
                    $authProductInfo->unit = (string)$product['unit'];
                    $authProductInfo->cycle = (string)$product['cycle'];
                    $authProductInfo->validstarttime = (string)$product['validstarttime'];
                    $authProductInfo->validendtime = (string)$product['validendtime'];
                    $authProductInfo->price = (string)$product['price'];
                    $authProductInfo->displayPrority = (string)$product['displayPrority'];
                    $authProductInfo->paymentType = (string)$product['paymentType'];
                    $authProductInfo->isSalesStrategy = (string)$product['isSalesStrategy'];
                    $authProductInfo->combineProduct = (string)$product['combineProduct'];
                    array_push($authInfo->productInfos, $authProductInfo);
                }
                // TODO  后续需要添加解析用户所属的包月套餐类型。
            }
        }
        return $authInfo;
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
        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay540001::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;
        //获取计费策略id
        $epgInfoMap = MasterManager::getEPGInfoMap();

        //创建订购参数
        $payInfo->returnUrl = $this->_buildPayCallbackUrl($payInfo);  //构建返回地址
        $payInfo->accountIdentity = $epgInfoMap['accountId'];  //支付账号
        $payInfo->deviceId = $epgInfoMap['deviceId'];           //32位设备id

        $ret['result'] = 0;
        $ret['payInfo'] = $payInfo;

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
    }

    /**
     * 构建自动上报订购地址
     * @param null $orderInfo
     * @return mixed
     */
//    public function buildAutoPayUrl($orderInfo = null)
//    {
//        $payInfo = null;
//        $userId = MasterManager::getUserId();
//        if ($orderInfo == null) {
//            // 构建我方的应用订购信息
//            $orderInfo = new \stdClass();
//            $orderInfo->userId = $userId;
//            $orderInfo->orderReason = 220;
//            $orderInfo->remark = "login";
//            $orderInfo->returnPageName = "";
//            $orderInfo->isPlaying = 0;
//            $orderInfo->isSinglePayItem = 1;
//        }
//
//        //拉取订购项
//        $orderItems = OrderManager::getOrderItem($userId);
//        if (count($orderItems) <= 0) {
//            LogUtils::error("Pay540001::buildAutoPayUrl ---> orderItem is empty");
//            return $payInfo;
//        }
//
//        // 去第一个，默认包月对象
//        $orderInfo->vip_id = $orderItems[0]->vip_id;
//
//        $payInfoParam = $this->buildPayInfo($orderInfo);
//        LogUtils::info("Pay540001:: payInfoParam is $payInfoParam");
//        $payInfoParam = json_decode($payInfoParam);
//        if ($payInfoParam->result != 0) {
//            LogUtils::info("buildPayInfo is failed");
//            return null;
//        }
//
//        $payInfo = $payInfoParam->payInfo;
//
//        // 生成订购url
//        //设置请求参数
//        $json = array(
//            "order_id" => $payInfo->tradeNo,
//            "user_account" => $payInfo->accountIdentity,
//            "mac_addr" => $payInfo->deviceId,
//            "order_type" => 0, // 订购类型（0订购 1退订）
//        );
//        $http = new HttpManager(HttpManager::PACK_ID_USER_ORDER_FOR_GANSUYD);
//        $payUrl = $http->buildPackHttpUrl($json);
//        $payUrl = urlencode($payUrl);
//        return $payUrl;
//    }

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
        if ($payResultInfo == null) {
            //从session中取出之前已经缓存了的我方的订购参数
            $param = json_decode(MasterManager::getPayCallbackParams());
            LogUtils::info(" payCallback 540001 ---> payCallback===>param session: " . MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->returnPageName = $param->returnPageName;
            $payResultInfo->isPlaying = $param->isPlaying;
            $payResultInfo->videoInfo = $param->videoInfo;
            $payResultInfo->order_count = $param->order_count;
            //得到局方返回的订购参数
            $resultDataJson = json_decode($_GET['resultDataJson'], true);
            $payResultInfo->result = $resultDataJson['result'];
            $payResultInfo->order_time = $resultDataJson['order_time'];
            $payResultInfo->order_number = $resultDataJson['order_number'];
            $payResultInfo->valid_from = $resultDataJson['valid_from'];
            $payResultInfo->valid_to = $resultDataJson['valid_to'];
            $payResultInfo->result_code = $resultDataJson['result_code'];
            $payResultInfo->result_desp = $resultDataJson['result_desp'];
            $payResultInfo->result_desp = str_replace(array("\r\n", "\r", "\n"), "", $payResultInfo->result_desp);
            $payResultInfo->charge_type = $resultDataJson['charge_type'];
        }
        LogUtils::info(" payCallback 540001 ---> payResult: " . json_encode($payResultInfo));

        if (($payResultInfo->result === 0 || $payResultInfo->result == '0') && ($payResultInfo->result_code === 1000 || $payResultInfo->result_code == '1000')) {
            // 订购成功，上报订购结果
            $payResultInfo->orderSuccess = "1";
            $uploadPayResult = $this->_uploadPayResult($payResultInfo);
        } else {
            $payResultInfo->orderSuccess = "-1";
        }

        // 判断用户是否是VIP
        $isVip = UserManager::isVip($payResultInfo->userId);

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

        //显示订购结果页面，该界面显示的是局方的订购结果（不包括订购成功后上报到我方服务器，是否在我方服务器上变成了vip）
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $payResultInfo->orderSuccess);
        $showOrderResultObj->setParam("message", $payResultInfo->result_desp);
        $showOrderResultObj->setParam("returnPageName", $payResultInfo->returnPageName);  // 增加一个返回页面名称

        $url = IntentManager::intentToURL($showOrderResultObj);
        LogUtils::info(" payCallback 540001 ---> showOrderResult url: " . $url);

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
            LogUtils::info(" payCallback 540001 ---> player: ");
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($showOrderResultObj, $objPlayer, IntentManager::$INTENT_FLAG_DEFAULT);
        } else {
            //$intent = IntentManager::createIntent($payResultInfo->returnPageName); // 因为返回页面有可能为空，不能创建。将页面名称传递到显示结果页返回 // delete by caijun 2019-03-06
            //IntentManager::jump($showOrderResultObj, $intent, IntentManager::$INTENT_FLAG_DEFAULT); // delete by caijun 2019-03-06
            LogUtils::info(" payCallback 540001 ---> not player: ");
            //IntentManager::jump($showOrderResultObj, null, IntentManager::$INTENT_FLAG_NOT_STACK);
            header('Location:' . $url);
        }
    }

    /**
     * @Brief:此函数用于订购的相关操作
     * @param: $orderId 订购ID
     * @param: $orderType 订购类型
     * @return: $data 结果值
     */
    public function OrderForGansuYd($orderId, $orderType)
    {
        //获取计费策略id
        $epgInfoMap = MasterManager::getEPGInfoMap();

        $userAccount = $epgInfoMap['accountId'];  //支付账号
        $macAddr = $epgInfoMap['deviceId'];           //32位设备id
        $data = PayAPI::OrderForGansuYd($orderId, $userAccount, $macAddr, $orderType);
        return $data;
    }

    /**
     * 上报订购结果,只上报订购成功
     * @param $payResultInfo
     * @return 上报结果
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $url = ORDER_CALL_BACK_URL .
            "?TradeNo=" . $payResultInfo->tradeNo .
            "&orderNumber=" . $payResultInfo->order_number .
            "&orderTime=" . $payResultInfo->order_time .
            "&validFrom=" . $payResultInfo->valid_from .
            "&validTo=" . $payResultInfo->valid_to .
            "&chargeType=" . $payResultInfo->charge_type;
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
     * @param null $param
     * @return string
     */
    private function _buildPayCallbackUrl($payInfo = null)
    {
        $intent = IntentManager::createIntent("payCallback");
        $intent->setParam("userId", MasterManager::getUserId());
        $intent->setParam("tradeNo", $payInfo->tradeNo);
        $intent->setParam("lmreason", $payInfo->orderReason != null ? $payInfo->orderReason : 0);
        $intent->setParam("lmcid", MasterManager::getCarrierId());
        $intent->setParam("returnPageName", $payInfo->returnPageName);
        $intent->setParam("isPlaying", $payInfo->isPlaying);
        $intent->setParam("videoInfo", rawurlencode($payInfo->videoInfo));

        LogUtils::info("_buildPayCallbackUrl ---> payInfo: " . json_encode($payInfo));

        MasterManager::setPayCallbackParams(json_encode($payInfo));

        LogUtils::info("_buildPayCallbackUrl ---> payInfo session: " . MasterManager::getPayCallbackParams());

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            LogUtils::info("_buildPayCallbackUrl ---> isRunOnPC: " . (string)(MasterManager::isRunOnPC()));
            if (defined(APP_ROOT_PATH)) {
                $url = APP_ROOT_PATH . $url;                       // 回调地址需要加上全局路径
            } else {
                $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
            }
        }
        LogUtils::info("_buildPayCallbackUrl ---> url: " . $url);
        return $url;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
        //获取计费策略id
        $epgInfoMap = MasterManager::getEPGInfoMap();
        //创建订购参数
        $accountIdentity = $epgInfoMap['accountId'];  //支付账号
        $deviceId = $epgInfoMap['deviceId'];           //32位设备id

        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'userId' => MasterManager::getUserId(),
            'platformType' => MasterManager::getPlatformType(),
            "lmcid" => MasterManager::getCarrierId(),

            "user_account" => $accountIdentity,
            "mac_addr" => $deviceId,
        );

        return $info;
    }

    public function interfacePay($userInfo)
    {
        $payResult = array(
            'result' => -1,
            'message' => "订购失败"
        );
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 220;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isSinglePayItem = 1;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("pay540001Action::buildAutoPayUrl ---> orderItem is empty");
            return json_encode($payResult);
        }

        // 去第一个，默认包月对象
        $orderInfo->vip_id = $orderItems[0]->vip_id;

        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($orderInfo->vip_id, $orderInfo->orderReason, $orderInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay540001Action::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        //获取订单成功
        $tradeNo = $orderInfo->order_id;

        // 生成订购url
        //设置请求参数
        /* {"order_id":"20181119123987676XXX","user_account":"13512701582","mac_addr":"34:c3:d2:a8:99:cc","order_type:"0"} */
        $json = array(
            "order_id" => $tradeNo,
            "user_account" => $userInfo->user_account,
            "mac_addr" => $userInfo->mac_addr,
            "order_type" => 0, // 订购类型（0订购 1退订）
        );

        $http = new HttpManager(HttpManager::PACK_ID_USER_ORDER_FOR_GANSUYD);
        $payResult = $http->requestPost($json);

        /**
         * {"result":"0","order_id":"20181119123987676XXX","order_time":"2018-12-19 12:00:00",
         * "order_number":"058820181119123XXXXXX","valid_from":"2018-11-19 12:00:00",
         * "valid_to":"2018-12-19 12:00:00","charge_type":"2","result_code":"1000","result_desp":"操作成功"}
         */
        LogUtils::error("pay540001Action:" . $payResult);
        return $payResult;
    }


    //SP->局方 订购相关接口封装

    /**
     *  用户登录认证
     */
    public function scspProxyLoginAuth($userInfo)
    {
        $requestXml = '<?xml version="1.0" encoding="UTF-8"?>'
            . '<message module="SCSP" version="1.1">'
            . '	<header action="REQUEST" command="LOGINAUTH"/>'
            . '<body>' . '<loginAuth '
            . 'loginType="' . $userInfo->loginType . '" '
            . 'account="' . $userInfo->account . '" '
            . 'password="' . $userInfo->password . '" '
            . 'stbId="' . $userInfo->stbId . '" '
            . ' /></body></message>';

        $header = array(
            'Content-type: application/xml',
        );

        LogUtils::info("Pay540001::scspProxyLoginAuth ---> request: " . SCSP_PROXY_URL . $requestXml);
        $result = HttpManager::httpRequestByHeader("POST", SCSP_PROXY_URL, $header, $requestXml);
        LogUtils::info("scspProxyADVPay ---> scspProxyLoginAuth:" . $result);
        if ($result) {
            // 更新用户token信息。
            $xml = simplexml_load_string($result);
            if ((string)$xml->body->loginAuth['result'] == '0') {
                MasterManager::setUserToken((string)$xml->body->loginAuth['token']);
            }
        }
        return $result;
    }

    /**
     *  用户鉴权接口
     */
    public function scspProxyAuthorize($productInfo)
    {
        $requestXml = '<?xml version="1.0" encoding="UTF-8"?>'
            . '<message module="SCSP" version="1.1">'
            . '	<header action="REQUEST" command="AUTHORIZE"/>'
            . '<body>' . '<authorize '
            . 'userId="' . $productInfo->userId . '" '
            . 'token="' . $productInfo->token . '" '
            . 'terminalId="' . $productInfo->terminalId . '" '
            . 'copyrighted="' . $productInfo->copyrighted . '" '
            . 'contentId="' . $productInfo->contentId . '" '
            . 'subContentId="' . $productInfo->subContentId . '" '
            . 'systemId="' . $productInfo->systemId . '" '
            . 'consumeLocal="' . $productInfo->consumeLocal . '" '
            . 'consumeScene="' . $productInfo->consumeScene . '" '
            . 'consumeBehaviour="' . $productInfo->consumeBehaviour . '" '
            . 'path="' . $productInfo->path . '" '
            . 'preview="' . $productInfo->preview . '" '
            . 'channelId="' . $productInfo->channelId . '" '
            . 'productId="' . $productInfo->productId . '" '
            . ' /></body></message>';

        $header = array(
            'Content-type: application/xml',
        );
        LogUtils::info("Pay540001::scspProxyAuthorize ---> request: " . SCSP_PROXY_URL . $requestXml);
        $result = HttpManager::httpRequestByHeader("POST", SCSP_PROXY_URL, $header, $requestXml);
        LogUtils::info("Pay540001::scspProxyAuthorize ---> result:" . $result);
        return $result;
    }

    /**
     *  支付下单接口
     */
    public function scspProxyADVPay($payInfo)
    {
        $requestXml = '<?xml version="1.0" encoding="UTF-8"?>'
            . '<message module="SCSP" version="1.1">'
            . '	<header action="REQUEST" command="ADVPAY"/>'
            . '<body>' . '<advPay '
            . 'seqId="' . $payInfo->seqId . '" '
            . 'userId="' . $payInfo->userId . '" '
            . 'token="' . $payInfo->token . '" '
            . 'accountIdentify="' . $payInfo->accountIdentify . '" '
            . 'terminalId="' . $payInfo->terminalId . '" '
            . 'appName="' . $payInfo->appName . '" '
            . 'productCode="' . $payInfo->productCode . '" '
            . 'contentId="' . $payInfo->contentId . '" '
            . 'copyRightContentId="' . $payInfo->copyRightContentId . '" '
            . 'consumeLocal="' . $payInfo->consumeLocal . '" '
            . 'consumeScene="' . $payInfo->consumeScene . '" '
            . 'consumeBehaviour="' . $payInfo->consumeBehaviour . '" '
            . 'channelId="' . $payInfo->channelId . '" '
            . 'path="' . $payInfo->path . '" '
            . 'payType="' . $payInfo->payType . '" '
            . 'subType="' . $payInfo->subType . '" '
            . 'saleTransID="' . $payInfo->saleTransID . '" '
            . 'amount="' . $payInfo->amount . '" '
            . ' /></body></message>';

        $header = array(
            'Content-type: application/xml',
        );

        LogUtils::info("Pay540001::scspProxyADVPay ---> request: " . SCSP_PROXY_URL . $requestXml);
        $result = HttpManager::httpRequestByHeader("POST", SCSP_PROXY_URL, $header, $requestXml);
        LogUtils::info("Pay540001::scspProxyADVPay ---> result:" . $result);
        if ($result) {
            $xml = simplexml_load_string($result);
            $orderResult = new \stdClass();
            $orderResult->result = (string)$xml->body->advPay['result'];
            $orderResult->resultDesc = (string)$xml->body->advPay['resultDesc'];
            $orderResult->externalSeqNum = (string)$xml->body->advPay['externalSeqNum'];
            $orderResult->qrCode = (string)$xml->body->advPay['qrCode'];
            $orderResult->qrCodeImgUrl = (string)$xml->body->advPay['qrCodeImgUrl'];
            $orderResult->qrCodeImg = (string)$xml->body->advPay['qrCodeImg'];
            if ($orderResult->result == '0') {
                $strPayParam = base64_decode((string)$xml->body->advPay['payParam']);
                $xmlPayParam = simplexml_load_string($strPayParam);
                $payParam = new \stdClass();
                $payParam->Ctype = (string)$xmlPayParam->Ctype;
                $payParam->OrderId = (string)$xmlPayParam->OrderId;
                $payParam->PayNum = (string)$xmlPayParam->PayNum;
                $payParam->BizType = (string)$xmlPayParam->BizType;
                $payParam->StbID = (string)$xmlPayParam->StbID;
                $payParam->ChargePolicy = (string)$xmlPayParam->ChargePolicy;
                $payParam->CustomBizExpiryDate = (string)$xmlPayParam->CustomBizExpiryDate;
                $payParam->OperCode = (string)$xmlPayParam->OperCode;
                $payParam->Cpparam = (string)$xml->Cpparam;
                $payParam->ReserveParam = (string)$xml->ReserveParam;
                $payInfo = new \stdClass();
                $payInfo->Index = (string)$xmlPayParam->PayInfos->PayInfo->Index;
                $payInfo->IsMonthly = (string)$xmlPayParam->PayInfos->PayInfo->IsMonthly;
                $payInfo->CustomPeriod = (string)$xmlPayParam->PayInfos->PayInfo->CustomPeriod;
                $payInfo->BillTimes = (string)$xmlPayParam->PayInfos->PayInfo->BillTimes;
                $payInfo->BillInterval = (string)$xmlPayParam->PayInfos->PayInfo->BillInterval;
                $payInfo->CampaignId = (string)$xmlPayParam->PayInfos->PayInfo->CampaignId;
                $payInfo->Fee = (string)$xmlPayParam->PayInfos->PayInfo->Fee;
                $payInfo->SpCode = (string)$xmlPayParam->PayInfos->PayInfo->SpCode;
                $payInfo->ServCode = (string)$xmlPayParam->PayInfos->PayInfo->ServCode;
                $payInfo->ChannelCode = (string)$xmlPayParam->PayInfos->PayInfo->ChannelCode;
                $payInfo->CooperateCode = (string)$xmlPayParam->PayInfos->PayInfo->CooperateCode;
                $payInfo->ProductCode = (string)$xmlPayParam->PayInfos->PayInfo->ProductCode;
                $payInfo->ContentCode = (string)$xmlPayParam->PayInfos->PayInfo->ContentCode;
                $payInfo->PlatForm_Code = (string)$xmlPayParam->PayInfos->PayInfo->PlatForm_Code;
                $payInfo->Cpparam = (string)$xmlPayParam->PayInfos->PayInfo->Cpparam;
                $payInfo->ReserveParam = (string)$xmlPayParam->PayInfos->PayInfo->ReserveParam;
                $payParam->PayInfo = $payInfo;
                $orderResult->payParam = $payParam;
            } else {
                $orderResult->payParam = null;
            }
        }
        return $orderResult;
    }

    /**
     *  下单订购结果查询
     */
    public function scspProxyADVPayResult()
    {
        $queryInfo = json_decode(MasterManager::getQueryInfo());
        LogUtils::info("scspProxyADVPayResult ---> start！");

        $requestXml = '<?xml version="1.0" encoding="UTF-8"?>'
            . '<message module="SCSP" version="1.1">'
            . '	<header action="REQUEST" command="ADVPAYRESULT"/>'
            . '<body>' . '<advPayResult '
            . 'terminalId="' . $queryInfo->terminalId . '" '
            . 'appName="' . $queryInfo->appName . '" '
            . 'userId="' . $queryInfo->userId . '" '
            . 'token="' . $queryInfo->token . '" '
            . 'externalSeqNum="' . $queryInfo->externalSeqNum . '" '
            . 'payNum="' . $queryInfo->payNum . '" '
            . 'param="' . $queryInfo->param . '" '
            . ' /></body></message>';

        $header = array(
            'Content-type: application/xml',
        );
        LogUtils::info("scspProxyADVPayResult ---> " . $requestXml);
        $result = HttpManager::httpRequestByHeader("POST", SCSP_PROXY_URL, $header, $requestXml);
        LogUtils::info("scspProxyADVPayResult ---> result:" . $result);
        if ($result) {
            $xml = simplexml_load_string($result);
            $advPayResult = new \stdClass();
            $advPayResult->result = (string)$xml->body->advPayResult['result'];
            $advPayResult->resultDesc = (string)$xml->body->advPayResult['resultDesc'];
            $advPayResult->payResult = (string)$xml->body->advPayResult['payResult'];
            $advPayResult->successPayMent = (string)$xml->body->advPayResult['successPayMent'];
            $advPayResult->externalSeqNum = (string)$xml->body->advPayResult['externalSeqNum'];

            if($advPayResult->result == '0'){
                switch ($advPayResult->payResult) {
                    case '0':
                        LogUtils::info("scspProxyADVPayResult ---> 支付成功！");
                        MasterManager::setLoopPayResult(0);
                        // 保存订购信息
                        OrderManager::getInstance()->scspProxyOrderSuccess();
                        break;
                    case '1':
                        MasterManager::setLoopPayResult(0);
                        LogUtils::error("scspProxyADVPayResult ---> 支付失败！");
                        break;
                    case '2':
                    case '3': // 继续轮询
                        LogUtils::info("scspProxyADVPayResult ---> 支付处理中，未支付！");
                        break;
                }
            }else {
                MasterManager::setLoopPayResult(0);
                LogUtils::error("scspProxyADVPayResult ---> 查询订购结果失败！");
            }
        }

        return $advPayResult;
    }

    public function scspProxyOrderSuccess(){
        $apkInfo = MasterManager::getApkInfo();
        if(gettype($apkInfo) == 'string'){
            $apkInfo = json_decode($apkInfo);
        }
        $orderItem = MasterManager::getOrderItem();
        if(is_string($orderItem)) $orderItem = json_decode($orderItem);
        $productInfo = MasterManager::getProductInfo();
        if(is_string($productInfo)) $productInfo = json_decode($productInfo);
        $payParamInfo = MasterManager::getPayParamInfo();
        LogUtils::info("ADVOrderAction ---> payParamInfo:" . $payParamInfo);
        if(is_string($payParamInfo)) $payParamInfo = json_decode($payParamInfo);
        $payType = MasterManager::getPayType();

        if ($apkInfo == null || $apkInfo->loginAccount == null) {
            $apkInfo = MasterManager::getApkInfo();
            if(gettype($apkInfo) == 'string'){
                $apkInfo = json_decode($apkInfo);
            }
        }

        $consumeLocal = $apkInfo->epgProvince;

        $payInfo = new \stdClass();
        $payInfo->seqId = $payParamInfo->seqId;
        $payInfo->userId = $apkInfo->loginAccount;
        $payInfo->token = MasterManager::getUserToken();
        $payInfo->accountIdentify = $payParamInfo->payParam->PayNum;
        $payInfo->terminalId = $apkInfo->snNum;
        $payInfo->copyRightId = $payParamInfo->payParam->PayInfo->CooperateCode;
        $payInfo->systemId = "0";
        $payInfo->productCode = $payParamInfo->payParam->PayInfo->ProductCode;
        $payInfo->contentId = $payParamInfo->payParam->PayInfo->ContentCode;
        $payInfo->copyRightContentId = "";
        $payInfo->consumeLocal = $consumeLocal;
        $payInfo->consumeScene = "01";
        $payInfo->consumeBehaviour = "02";
        $payInfo->channelId = $payParamInfo->payParam->PayInfo->ChannelCode;
        $payInfo->path = "";
        $payInfo->payType = $payType;
        $payInfo->subType = "03";
        $payInfo->orderTimes = "";
        $payInfo->thirdTransID = $payParamInfo->externalSeqNum;
        $payInfo->saleTransID = "";
        LogUtils::info("ADVOrderAction ---> payInfo:" . json_encode($payInfo));
        $result = $this->scspProxyOrderResult($payInfo);
        // 判断订购成功的话，上报订购结果
        LogUtils::info("ADVOrderAction ---> result:" . json_encode($result));
        if ($result && $result->result == '0') {
            // 上报订购结果给cws
            $payResult = new \stdClass();
            $payResult->userId = $apkInfo->loginAccount;                            // 用户ID (业务账号）
            $payResult->token = MasterManager::getUserToken();                    // 用户Token
            $payResult->terminalId = $apkInfo->snNum;                            // 机顶盒标识（stbId)
            $payResult->copyrightId = $payParamInfo->payParam->PayInfo->CooperateCode;         // 牌照方标识
            $payResult->contentId = $payParamInfo->payParam->PayInfo->ContentCode;            // 内容ID
            $payResult->subContentId = "";        // 咪咕子内容标识（暂不用，为空）
            $payResult->systemId = "0";            // 客户端类型
            $payResult->consumeLocal = $consumeLocal;            // 消费省份编码
            $payResult->consumeScene = "01";    // 消费场景
            $payResult->consumeBehaviour = "02";        // 消费行为
            $payResult->path = "";                    // 导航路径
            $payResult->preview = "";                // 试看标识
            $payResult->channelId = $payParamInfo->payParam->PayInfo->ChannelCode;                // 渠道ID
            $payResult->productCode = $payParamInfo->payParam->PayInfo->ProductCode;        // 产品ID
            $payResult->productInfo = $productInfo->productInfo;                            // 产品信息
            $payResult->orderContentId = $productInfo->orderContentId;            // 订购内容标识
            $payResult->productPrice = $productInfo->productPrice;    // 产品描述
            $payResult->unit = $productInfo->unit;                // 单位（1.天、2.连续包月、3.单月、4.年、5.季、6.固定时长、7.按次）
            $payResult->cycle = $productInfo->cycle;                    // 周期
            $payResult->validstarttime = $productInfo->validstarttime;            // 开始时间
            $payResult->validendtime = $productInfo->validendtime;            // 结束时间
            $payResult->price = $productInfo->price;                    // 价格
            $payResult->bpPrice = "";                // 积分价格
            $payResult->displayPrority = $productInfo->displayPrority;         // 显示优先级
            $payResult->paymentType = $productInfo->paymentType;            // 支付方式
            $payResult->isSalesStrategy = $productInfo->isSalesStrategy;            // 是否包含营销批价
            $payResult->combineProduct = $productInfo->combineProduct;            // 产品属性
            $payResult->seqId = $payParamInfo->seqId;                // 订单号
            $payResult->accountIdentify = $payParamInfo->payParam->PayNum;            // 计费标识
            $payResult->payType = $payType;                    // 支付类型
            $payResult->subType = "03";                // 子支付类型
            $payResult->externalSeqNum = $payParamInfo->externalSeqNum;            // 支付流水号
            $payResult->payParam = json_encode($payParamInfo->payParam);        // 支付参数
            $payResult->authorizationNum = $result->authorizationNum;    // 鉴权序号（可能后续会有用）
            $payResult->orderSeq = $result->orderSeq;            // 订购序列号
            LogUtils::info("ADVOrderAction postPayResultEx ---> payResult:" . json_encode($payResult));
            PayAPI::postPayResultEx($payResult);  // 上报订购结果

            // 判断用户是否是VIP
            $isVip = UserManager::isVip(MasterManager::getUserId());

            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult($isVip);

            // 订购成功与否，把用户限制功能配置信息全局更新！！！
            UserManager::judgeAndCacheUserLimitInfoWith($isVip, $payResult->price, $orderItem);

            // 用户是否是VIP，更新到session中
            MasterManager::setVIPUser($isVip);
        }
    }

    /**
     *  支付接口
     */
    public function scspProxyOrderResult($payInfo)
    {
        $requestXml = '<?xml version="1.0" encoding="UTF-8"?>'
            . '<message module="SCSP" version="1.1">'
            . '	<header action="REQUEST" command="ORDER"/>'
            . '<body>' . '<order '
            . 'seqId="' . $payInfo->seqId . '" '
            . 'userId="' . $payInfo->userId . '" '
            . 'token="' . $payInfo->token . '" '
            . 'accountIdentify="' . $payInfo->accountIdentify . '" '
            . 'terminalId="' . $payInfo->terminalId . '" '
            . 'copyRightId="' . $payInfo->copyRightId . '" '
            . 'systemId="' . $payInfo->systemId . '" '
            . 'productCode="' . $payInfo->productCode . '" '
            . 'contentId="' . $payInfo->contentId . '" '
            . 'copyRightContentId="' . $payInfo->copyRightContentId . '" '
            . 'consumeLocal="' . $payInfo->consumeLocal . '" '
            . 'consumeScene="' . $payInfo->consumeScene . '" '
            . 'consumeBehaviour="' . $payInfo->consumeBehaviour . '" '
            . 'channelId="' . $payInfo->channelId . '" '
            . 'path="' . $payInfo->path . '" '
            . 'payType="' . $payInfo->payType . '" '
            . 'subType="' . $payInfo->subType . '" '
            . 'orderTimes="' . $payInfo->orderTimes . '" '
            . 'thirdTransID="' . $payInfo->thirdTransID . '" '
            . 'saleTransID="' . $payInfo->saleTransID . '" '
            . ' /></body></message>';

        $header = array(
            'Content-type: application/xml',
        );
        LogUtils::info("scspProxyOrderResult ---> xml:" . $requestXml);
        $orderResult = new \stdClass();
        $orderResult->result = "-1";
        $orderResult->resultDesc = "订购失败";

        $result = HttpManager::httpRequestByHeader("POST", SCSP_PROXY_URL, $header, $requestXml);
        LogUtils::info("scspProxyOrderResult ---> result:" . $result);
        if ($result) {
            $xml = simplexml_load_string($result);
            $orderResult->result = (string)$xml->body->order['result'];
            $orderResult->resultDesc = (string)$xml->body->order['resultDesc'];
            $orderResult->authorizationNum = (string)$xml->body->order['authorizationNum'];
            $orderResult->orderSeq = (string)$xml->body->order['orderSeq'];
        }
        return $orderResult;
    }

    public function buildPayUrl($payInfo = null)
    {

    }
}