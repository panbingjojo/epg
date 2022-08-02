<?php

namespace Home\Model\Order;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\TextUtils;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;

class Pay000006 extends PayAbstract
{
    /**
     * 到局方鉴权，只有包月产品才能鉴权。（可以鉴权其他CP的产品，需要传递产品信息）
     * @param $productInfo 鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authentication($productInfo = null)
    {
        LogUtils::info("Pay000006 --> user authentication productInfo:" . json_encode($productInfo));

        if ($productInfo == null || empty($productInfo) || !is_array($productInfo)) {
            // 默认使用我方的包月产品进行鉴权
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = PRODUCT_ID;
            $productInfo['serviceId'] = SERVICE_ID;
            $productInfo['contentId'] = CONTENT_ID;
        }

        // 鉴权地址
        $authorizationUrl = ORDER_AUTHORIZATION_URL;

        // userToken
        $userToken = MasterManager::getUserToken();

        //鉴权参数
        $info = array(
            "spId" => $productInfo['spId'],
            "carrierId" => MasterManager::getAreaCode(),
            "userId" => MasterManager::getAccountId(),
            "UserToken" => $userToken,
            "productId" => $productInfo['productId'],
            "serviceId" => $productInfo['serviceId'],
            "contentId" => $productInfo['contentId'],
            "timeStamp" => "" . time(),
        );

        LogUtils::info("Pay000006 --> user authentication param:" . json_encode($info));

        // post到局方鉴权，同步返回数据
        /*
         * curl http://202.99.114.14:35820/ACS/vas/authorization -X POST -d '{"spId":"96596","carrierId":"209","userId":"CB41018120404706_209","UserToken":"xxxxx","productId":"sjjklx","serviceId":"sjjkby015","contentId":"sjjklinux","timeStamp":"1603950721"}' --header "Content-Type: application/json"
         */
        $result = HttpManager::httpRequest("POST", $authorizationUrl, json_encode($info));

        LogUtils::info("Pay000006 --> user authentication result:  " . $result);

        return json_decode($result);
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
     * @param null $payInfo
     * @return false|mixed|string
     * @throws \Think\Exception
     */
    public function buildPayInfo($payInfo = null)
    {
        LogUtils::info("payInfo:".json_encode($payInfo));
        $userInfo = new \stdClass();
        $userInfo->spId = SPID;
        $userInfo->productId = PRODUCT_ID;
        $userInfo->serviceId = SERVICE_ID;
        $userInfo->contentId = CONTENT_ID;
        $userInfo->orderType = isset($_GET['orderType']) ? $_GET['orderType'] : 1;
        $userId = MasterManager::getUserId();
        $payUrl = $this->buildUrlAndPay($userId, $userInfo, $payInfo);

        LogUtils::info("Pay000006::payInfo：" . json_encode($payInfo));
        $ret['result'] = !empty($payUrl) ? 0 : -1;
        $ret['payUrl'] = $payUrl;

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
        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->contentId = isset($_GET['contentId']) ? $_GET['contentId'] : null;
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->isIFramePay = isset($_GET['isIFramePay']) ? $_GET['isIFramePay'] : 0;
            $orderInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['singlePayItem']) ? $_GET['singlePayItem'] : 1;
            $orderInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
        }

        $orderInfo->lmreason = 0;

        // 清除cookie里订购结果记录, 目前联合活动才会使用该订购结果
        MasterManager::setOrderResult(0);

        $userInfo = new \stdClass();
        $userInfo->spId = SPID;
        $userInfo->productId = PRODUCT_ID;
        $userInfo->serviceId = SERVICE_ID;
        $userInfo->contentId = CONTENT_ID;
        $userInfo->orderType = isset($_GET['orderType']) ? $_GET['orderType'] : 1;

        $payUrl = $this->buildUrlAndPay($userId, $userInfo, $orderInfo);
        if (!empty($payUrl)) {
            header("Location:" . $payUrl);
        } else {
            IntentManager::back();
        }
        return;
    }

    public function buildUrlAndPay($userId, $userInfo, $orderInfo)
    {
        //拉取订购项

        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderInfo->vip_id;

        $productInfo['spId'] = $userInfo->spId;
        $productInfo['productId'] = $userInfo->productId;
        $productInfo['serviceId'] = $userInfo->serviceId;
        $productInfo['contentId'] = $userInfo->contentId;

        $authInfo = $this->authentication($productInfo);
        if ($authInfo->result === 10020001) {
            //鉴权失败，保存鉴权返回的订购信息项。
            MasterManager::setOrderItems($authInfo);
            $authProductInfo = $authInfo->productList[0];
            LogUtils::info("Pay000006::buildUrlAndPay authProductInfo: " . json_encode($authProductInfo));

            // 创建订单号
            $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
                $orderInfo->remark, $orderInfo->contentId, $userInfo->orderType);
            if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
                LogUtils::info("Pay000006::buildUrlAndPay() ---> 拉取订单失败:" . $tradeInfo->result);
                return null;
            }
            $orderInfo->tradeNo = $tradeInfo->order_id;

            //生成订购地址
            $payInfo = new \stdClass();
            $payInfo->userId = MasterManager::getUserId();
            $payInfo->carrierId = MasterManager::getCarrierId();
            $payInfo->vip_id = $orderInfo->vipId;                  // 后台配置的vip_id
            $payInfo->product_id = $authProductInfo->productId;          // 产品ID
            $payInfo->isPlaying = $orderInfo->isPlaying;            // 是否正在播放，后续可以改为直接传递播放的视频信息
            $payInfo->isIFramePay = 1;                              // 联通APK，使用 iframe 才能正常发生订购
            $payInfo->orderReason = $orderInfo->orderReason;        // 订购原因
            $payInfo->remark = $orderInfo->remark;                  // 订购标记
            $payInfo->returnPageName = $orderInfo->returnPageName;  // 返回页面名称，也可能定义为返回页面的Intent对象
            $payInfo->videoInfo = $orderInfo->videoInfo;            // 正在播放时的视频信息。
            $payInfo->tradeNo = $tradeInfo->order_id;               // 订单号
            $payInfo->lmreason = $tradeInfo->lmreason;

            $payUrl = $this->_buildPayUrl($payInfo, $authProductInfo);
            return $payUrl;
        } else if ($authInfo != null && $authInfo->result == 0) {
            // 在局方已经是VIP
            $isVip = UserManager::isVip($userId);
            if (!$isVip) {
                if (UserManager::regVip($userId) == 1) {
                    LogUtils::info("Pay000006::buildUrlAndPay() ---> regVip  success!");
                    $isVip = 1;
                }
                LogUtils::info("Pay000006::buildUrlAndPay() --->regVip failed!");
            }
            MasterManager::setUserIsVip($isVip);

            IntentManager::back();
        } else {
            LogUtils::info("Pay000006::buildUrlAndPay() ---> user exception[result = $authInfo->result]");
        }

        return null;
    }

    /**
     * 生成订购地址，此订购地址会显示局方的订购页面
     * @param null $payInfo
     * @param $productInfo
     * @return bool|string
     */
    private function _buildPayUrl($payInfo, $productInfo)
    {
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeNo,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "videoInfo" => $payInfo->videoInfo,
            "isIFramePay" => $payInfo->isIFramePay,
        );
        $callbackUrl = $this->_buildPayCallbackUrl($param);  //构建返回地址

        // 获取EPG信息
        $accountId = MasterManager::getAccountId();
        $userToken = MasterManager::getUserToken();

        LogUtils::info("Pay000006::buildUrlAndPay productInfo: " . json_encode($productInfo));
        // 组装订购参数
        $orderInfo = array(
            "SPID" => $productInfo->spId,
            "UserID" => $accountId,
            "UserToken" => $userToken,
            "ServiceID" => $productInfo->serviceId,
            "ContentID" => $productInfo->contentID,
            "ProductID" => $productInfo->productId,
            "Action" => '1',
            "OrderMode" => '1',
            "ContinueType" => '1',
            //"NeedRewardPoints" => '0',
            "Lang" => "zh",
            "ReturnURL" => rawurlencode($callbackUrl),
        );
        $payUrl = ORDER_SERVICE_ORDER_URL;
        foreach ($orderInfo as $key => $value) {
            if (strpos($payUrl, '?') === false) {
                $payUrl = $payUrl . '?' . $key . "=" . $value;
            } else {
                $payUrl = $payUrl . '&' . $key . "=" . $value;
            }
        }

        LogUtils::info("---> _buildPayUrl: $payUrl");
        return $payUrl;
    }

    /**
     * 订购回调接口
     * @param null $payResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {
        LogUtils::info("payCallback000006 ---> REQUEST_payResult:" . json_encode($_REQUEST));
        if ($payResultInfo == null) {
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = $_GET['userId'];
            $payResultInfo->tradeNo = $_GET['tradeNo'];
            $payResultInfo->lmreason = $_GET['lmreason'];
            $payResultInfo->isIFramePay = isset($_GET['isIFramePay']) ? $_GET['isIFramePay'] : 0;
            $payResultInfo->returnPageName = isset($_GET['returnPageName']) && $_GET['returnPageName'] != null
                ? $_GET['returnPageName'] : "";
            $payResultInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $payResultInfo->videoInfo = isset($_GET['videoInfo']) && $_GET['videoInfo'] != ""
                ? rawurldecode($_GET['videoInfo']) : null;

            $payResultInfo->result = isset($_GET['Result']) ? $_GET['Result'] : null;
            $payResultInfo->isJiFen = $_GET['isJiFen'] ? $_GET['isJiFen'] : 0;

        }

        $isVip = 0;
        if ($payResultInfo->result != null && $payResultInfo->result != '001') {
            // 上报订购结果
            $this->_uploadPayResult();
            // 判断用户是否是VIP，更新到session中
            $isVip = UserManager::isVip($payResultInfo->userId);
            MasterManager::setUserIsVip($isVip);
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult($isVip);
        }


        // 如果是播放订购成功回来，则过去继续数据&& ($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "" && $payResultInfo->videoInfo != "&") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        if ($payResultInfo->isIFramePay == 1) {
            //生成订购结果显示界面
            $showOrderResultObj = IntentManager::createIntent("payShowResult");
            $showOrderResultObj->setParam("isSuccess", $isVip);

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
        } else if ($isVip == 1 && $videoInfo != null) {
            // 继续播放
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        } else {
            IntentManager::back($payResultInfo->returnPageName);
        }
        exit();
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
        $intent->setParam("isIFramePay", $param['isIFramePay']);
        $intent->setParam("videoInfo", rawurlencode($param['videoInfo']));

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        return $url;
    }

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
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
        $orderInfo->userId = MasterManager::getUserId();
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->lmreason = 2;
        $orderInfo->contentId = CONTENT_ID;
        $orderInfo->orderReason = 111;
        $orderType = 1;

        LogUtils::info("Pay000006::buildDirectPayUrl() ");
        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay000006::buildDirectPayUrl() ---> orderItems is empty");
            return $payUrl;
        }

        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        $productInfo['spId'] = SPID;
        $productInfo['productId'] = PRODUCT_ID;
        $productInfo['serviceId'] = SERVICE_ID;
        $productInfo['contentId'] = CONTENT_ID;


        $authInfo = $this->authentication($productInfo);
        LogUtils::info("Pay000006::buildDirectPayUrl() ---> authentication result: " . $authInfo);
        if ($authInfo->result === 10020001) {
            //鉴权失败，保存鉴权返回的订购信息项。
            MasterManager::setOrderItems($authInfo);
            if (MasterManager::getAreaCode() == '201') {
                if (count($authInfo->productList) > 1) {
                    $authProductInfo = $authInfo->productList[1];
                } else {
                    $authProductInfo = $authInfo->productList[0];
                }
            } else {
                $authProductInfo = $authInfo->productList[0];
            }


            // 创建订单号
            $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
                $orderInfo->remark, $authProductInfo->contentID, $orderType);
            if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
                LogUtils::info("Pay000006::buildDirectPayUrl() ---> 拉取订单失败:" . $tradeInfo->result);
                return $payUrl;
            }
            $orderInfo->tradeNo = $tradeInfo->order_id;

            //生成订购地址
            $payInfo = new \stdClass();
            $payInfo->userId = MasterManager::getUserId();
            $payInfo->carrierId = MasterManager::getCarrierId();
            $payInfo->vip_id = $orderInfo->vipId;                  // 后台配置的vip_id
            $payInfo->product_id = $authProductInfo->productId;          // 产品ID
            $payInfo->isPlaying = $orderInfo->isPlaying;            // 是否正在播放，后续可以改为直接传递播放的视频信息
            $payInfo->orderReason = $orderInfo->orderReason;        // 订购原因
            $payInfo->remark = $orderInfo->remark;                  // 订购标记
            $payInfo->returnPageName = $orderInfo->returnPageName;  // 返回页面名称，也可能定义为返回页面的Intent对象
            $payInfo->videoInfo = $orderInfo->videoInfo;            // 正在播放时的视频信息。
            $payInfo->tradeNo = $orderInfo->tradeNo;               // 订单号
            $payInfo->lmreason = $orderInfo->lmreason;

            $payUrl = $this->_buildPayUrl($payInfo, $authProductInfo);
            // 增加订单号方便解析
            $payUrl = $payUrl . "&lmTradeNo=" . $orderInfo->tradeNo;
        } else if ($authInfo->result == 0) {
            // 在局方已经是VIP
            LogUtils::info("Pay000006::buildDirectPayUrl() ---> auth result = 0");
        } else {
            LogUtils::info("Pay000006::buildDirectPayUrl() ---> user exception");
        }

        if(!empty($payUrl)){
            PayAPI::addUserPayUrl(urlencode($payUrl),$payInfo->tradeNo,1);
        }
        
        return $payUrl;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
        // 获取EPG信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userToken = MasterManager::getUserToken() ? MasterManager::getUserToken() : $epgInfoMap['UserToken'];
        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'areaCode' => MasterManager::getAreaCode(),
            'subAreaCode' => MasterManager::getSubAreaCode(),
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platfromType' => MasterManager::getPlatformType(),
            'platformTypeExt' => MasterManager::getPlatformTypeExt(),
            'userToken' => $userToken,
            'isUnicomActivity' => 0,

            'spId' => SPID,
            'serviceId' => SERVICE_ID,
            'contentId' => CONTENT_ID,
            'productId' => PRODUCT_ID,
        );
        return $info;
    }

    /**
     * 上报订购结果
     * @param $payResultInfo
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        $userId = isset($_GET['userId']) ? $_GET['userId'] : MasterManager::getUserId();
        if ($payResultInfo == null) {
            // 处理并上报支付结果
            $payResultInfo = array(
                'TradeNo' => $_GET['tradeNo'],
                'reason' => $_GET['lmreason'],
                'transactionID' => $_GET['transactionID'],
                'Result' => $_GET['Result'],
                'OutResult' => $_GET['OutResult'],
                'Description' => $_GET['Description'],
                'UserID' => $_GET['UserID'],
                'UserToken' => $_GET['UserToken'],
                'ContentID' => $_GET['ContentID'],
                'ServiceID' => $_GET['ServiceID'],
                'ProductID' => $_GET['ProductID'],
                'ProductName' => $_GET['ProductName'],
                'PurchaseType' => $_GET['PurchaseType'],
                'Fee' => $_GET['Fee'],
                'SPID' => $_GET['SPID'],
                'TransactionID' => $_GET['TransactionID'],
                'ExpiredTime' => $_GET['ExpiredTime'],
                'OrderMode' => $_GET['OrderMode'],
                'SerStartTime' => $_GET['SerStartTime'],
                'SerEndTime' => $_GET['SerEndTime'],
                'PayValidLen' => $_GET['PayValidLen'],
                'AvailableIPTVRewardPoints' => isset($_GET['AvailableIPTVRewardPoints']) ? $_GET['AvailableIPTVRewardPoints'] : "",
                'AvailableTeleRewardPoints' => isset($_GET['AvailableTeleRewardPoints']) ? $_GET['AvailableTeleRewardPoints'] : "",
                'AvailableTVVASRewardPoints' => isset($_GET['AvailableTVVASRewardPoints']) ? $_GET['AvailableTVVASRewardPoints'] : "",
                'TradesSerialNum' => $_GET['TradesSerialNum'],
                'ActualPayAmount' => $_GET['ActualPayAmount'],
                'carrierId' => isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID,
            );
        }

        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));

        PayAPI::postPayResultEx($payResultInfo);
    }

    public function vipUserUnRegister()
    {
        $unRegUrl = ORDER_SERVICE_CANCEL_ORDER_URL;
        // 天津专用入口的计费
        $productId = PRODUCT_ID. "@" . MasterManager::getAreaCode();
        $serviceId = SERVICE_ID;
        $contentId = CONTENT_ID;

        // 获取用户的省份ID
        $provinceInfo = Utils::getUserProvince(MasterManager::getAreaCode());
        $unRegInfo = array();
        $unRegInfo['serviceId'] = MasterManager::getAccountId();
        $unRegInfo['userProvince'] = $provinceInfo[0];//"13";
        $unRegInfo['productId'] = $productId;
        $unRegInfo['action'] = "2";
        $unRegInfo['outSource'] = "1";


        // 构建查询用户消费记录的参数
        $info = array(
            "serviceId" => MasterManager::getAccountId(),
            "userProvince" => $provinceInfo[0],
            "contentId" => $contentId,
            "productId" => $productId,
            "action" => $unRegInfo['action'],
            //"orderMode" => '1',
            //"continueType" => '1',
            "outSource" => $unRegInfo['outSource'],
        );

        //sha256(<private key>+< serviceId>+<userProvince>+< contentId >+< productId >+< action >+< orderMode >+< continueType >+< outSource >+<timestamp>)+<timestamp>

        $timeFormat = date('YmdHis'); // timestamp是14
        $data = SHA256_SECRET_KEY;
        $option = array("serviceId", "userProvince", "productId", "action", "outSource");
        foreach ($info as $key => $value) {
            if (in_array($key, $option)) {
                $data .= $value;
            }
        }
        // 再加上时间
        $data .= $timeFormat;
        LogUtils::info("vipUserUnRegister--> SHA256_SECRET_KEY info:".json_encode($info));
        LogUtils::info("vipUserUnRegister--> SHA256_SECRET_KEY data:".$data);
        // 对data进行加密，然后再追加上时间
        $sha256Signature = hash('sha256', $data, false);
        LogUtils::info("vipUserUnRegister--> SHA256_SECRET_KEY sha256Signature:".$sha256Signature);
        $sha256Signature .= $timeFormat;
        $unRegInfo['signature'] = $sha256Signature;
        LogUtils::info("vipUserUnRegister--> unRegUrl:".$unRegUrl);
        LogUtils::info("vipUserUnRegister--> unRegInfo:".json_encode($unRegInfo));
        $result = HttpManager::httpRequest("POST", $unRegUrl, json_encode($unRegInfo));

        // 上报退订结果给cws，把用户业务帐号增加进去一起上传
        $cancelData = json_decode($result, true);
        if($cancelData['result'] == '0'){
            MasterManager::setUserIsVip(0);
        }
        $cancelData['UserID'] = MasterManager::getAccountId();
        PayAPI::postCancelOrderResultBy0000051($cancelData);

        LogUtils::info("vipUserUnRegister--> result: ".$result);
        return $result;
    }
}