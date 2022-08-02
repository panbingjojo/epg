<?php

namespace Home\Model\Order;


use Home\Common\Tools\Crypt3DES;
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Page\PageManager;

class Pay12650092 extends PayAbstract
{
    /**
     * 到局方鉴权，只有包月产品才能鉴权。
     * 增加：1、鉴权加密串中加freeDay=1字段
     * 2、免费看鉴权返回参数中，ordered参数会返回-1，这种情况要放行，不要弹订购
     * @param null $param
     * @return int|mixed
     */

    public function authentication($param = null)
    {
        $isVip = 0;
        MasterManager::setFreeExperience(0); // 初始化标志位，--- 没有免费体验

        if (LOCATION_TEST) {
            return 1;//如果是本地测试，直接鉴权为vip用户
        }

        $waitEncodeArr = array(
            "itvAccount" => MasterManager::getAccountId(),
            "productId" => productID_10. ','.productID_365. ','.productID_1. ','.productID_7,
            "contentId" => "",
            "freeDay" => 1
        );

        $orderInfo = $this->getEncodeCBCStrWithArr($waitEncodeArr);

        $queryArr = array(
            "providerId" => VENDORC_CODE,
            "orderInfo" => $orderInfo
        );

        $authUrl = USER_ORDER_AUTH . http_build_query($queryArr);

        LogUtils::info("Pay12650092::authUrl --->:" . $authUrl);
        $res = HttpManager::httpRequest("GET", $authUrl, "");
        LogUtils::info("Pay12650092::authentication ---> authResult:" . $res);
        $resArr = json_decode($res, true);
        if (isset($resArr["respCode"])) {
            if ($resArr["respCode"] === 0 || $resArr["respCode"] === "0") {
                if ($resArr["ordered"] === 1 || $resArr["ordered"] === "1") {
                    $isVip = 1;
                } else if ($resArr["ordered"] == -1) {
                    // 免费体验，当作使用vip权益
                    MasterManager::setFreeExperience(1);
                    LogUtils::info("Pay12650092::authentication ---> is free experience!!!");
                }
            }
        }
        LogUtils::info("Pay12650092::authentication ---> isVip:" . $isVip);
        return $isVip;
    }

    /**
     * 构建到局方用户验证地址
     * @param $param
     * @return mixed
     */
    public function buildVerifyUserUrl($param = null)
    {
    }

    /**
     * 我方订购页构建到局方的订购地址
     * 说明：由于要使用post方式提交到局方的订购界面，使用了html的表单提交，所以这里返回了局方post需要使用的参数，
     *       而不是完整的url订购地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {

        $userId = MasterManager::getUserId();

        $orderReason = $payInfo["orderReason"];
        $remark = $payInfo["remark"];
        $isPlaying = $payInfo["isPlaying"];
        $productId = $payInfo["productId"];//1包月，3包年
        $vipId = $payInfo["vipId"];//订单id
        $returnPageName = $payInfo["returnPageName"];//订单id
        $lmreason = 0;
        $orderType = 1;

        $retArr = array(
            "result" => -1,
            "orderUrl" => USER_ORDER_QUERY,
            "providerId" => VENDORC_CODE,
            "orderInfo" => "",
            "returnUrl" => "",
            "notifyUrl" => ""
        );


        if (empty($vipId)) {
            $orderItems = OrderManager::getOrderItem($userId);//获取cws配置的订购信息
            if (count($orderItems) <= 0) {
                LogUtils::error("=====>no orderItem!");
                return $retArr;
            } else {
                $vipId = $orderItems[0]->vip_id;
            }
        }

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("user [ . $userId . ]request transactionID --> result:" . json_encode($orderNoJson));
        if ($orderNoJson->result == 0) {

            $callBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, false);//生成回调地址
            $asyncCallBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, true);//生成回调地址
            $retArr["returnUrl"] = $callBackUrl;
            $retArr["notifyUrl"] = $asyncCallBackUrl;
//           if ($vipId == "111") {
            //天天健身，只有20元包月一种资费，直接固定。
            $productID = productID_10;
            $productPrice = PRODUCT_PRICE_7;
//            }

            $waitEncodeArr = array(
                "orderId" => $orderNoJson->order_id,
                "itvAccount" => MasterManager::getAccountId(),
                "productId" => $productID,
                "price" => $productPrice
            );
            $retArr["orderInfo"] = urlencode($this->getEncodeCBCStrWithArr($waitEncodeArr));
            $retArr["result"] = 0;
        } else {
            LogUtils::error("request pay failed!!!=" . $orderNoJson->result);
        }
        LogUtils::info("buildPayUrl=" . json_encode($retArr));
        return json_encode($retArr);

    }

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildUnPayUrl($payInfo = null)
    {
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        $userId = MasterManager::getUserId();

        $orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
        $remark = isset($_GET['remark']) ? $_GET['remark'] : null;;
        $isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
        $returnPageName = isset($_GET['returnUrl']) ? $_GET['returnUrl'] : "";
        $lmreason = 0;
        $orderType = 1;

        $retArr = array(
            "result" => -1,
            "orderUrl" => USER_ORDER_QUERY,
            "providerId" => VENDORC_CODE,
            "orderInfo" => "",
            "returnUrl" => "",
            "notifyUrl" => ""
        );

        $orderItems = OrderManager::getOrderItem($userId);//获取cws配置的订购信息
        if (count($orderItems) <= 0) {
            LogUtils::error("buildAutoPayUrl=====>no orderItem!");
            return $retArr;
        } else {
            $vipId = $orderItems[0]->vip_id;
        }

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("buildAutoPayUrl transactionID --> result:" . json_encode($orderNoJson));
        if ($orderNoJson->result == 0) {

            $callBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, false);//生成回调地址
            $asyncCallBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, true);//生成回调地址
            $retArr["returnUrl"] = $callBackUrl;
            $retArr["notifyUrl"] = $asyncCallBackUrl;
            $waitEncodeArr = array(
                "orderId" => $orderNoJson->order_id,
                "itvAccount" => MasterManager::getAccountId(),
                "productId" => productID_10,
                "price" => PRODUCT_PRICE
            );
            $retArr["orderInfo"] = urlencode($this->getEncodeCBCStrWithArr($waitEncodeArr));
            $retArr["result"] = 0;
        } else {
            LogUtils::error("buildAutoPayUrl pay failed!!!=" . $orderNoJson->result);
            IntentManager::back();
        }
        LogUtils::info("buildAutoPayUrl=" . json_encode($retArr));

        $orderParam = array(
            "providerId" => $retArr["providerId"],
            "orderInfo" => $retArr["orderInfo"],
            "orderUrl" => urlencode($retArr["orderUrl"]),
            "returnUrl" => urlencode($retArr["returnUrl"]),
            "notifyUrl" => urlencode($retArr["notifyUrl"]),
        );

        $intent = IntentManager::createIntent("directPay");
        $intent->setParam("orderParam", rawurlencode(json_encode($orderParam)));

        $payAutoUrl = IntentManager::intentToURL($intent);
        $postPayUrl = "";
        if (!TextUtils::isBeginHead($payAutoUrl, "http://")) {
            $postPayUrl = "http://" . $_SERVER['HTTP_HOST'] . $payAutoUrl;  // 回调地址需要加上全局路径
        }
        LogUtils::info("payAutoUrl=" . $postPayUrl);
        header('Location:' . $postPayUrl);
        exit();
    }

    /**
     * @param null $payResultInfo
     * @return mixed|void
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {
        //解析局方回调的参数
        LogUtils::info("payCallback ---> _GET: " . json_encode($_REQUEST));
        $tradeInfo = $_REQUEST["tradeInfo"];
        LogUtils::info("payCallback --->tradeInfo:" . json_encode($tradeInfo));
        $decodeStr = Crypt3DES::decodeCBC($tradeInfo, Encrypt_3DES, "01234567");
        LogUtils::info("payCallback --->decodeStr:" . $decodeStr);
        $decodeArr = explode("|", $decodeStr);
        $finalDecodeArr = array();
        foreach ($decodeArr as $val) {
            $tempArr = explode("=", $val);
            $finalDecodeArr[$tempArr[0]] = $tempArr[1];
        }
        //解析我们自己的参数
        $userId = $_GET['userId'];
        $isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;// 是否为正在播放引起的订购
        $lmreason = isset($_GET['lmreason']) ? $_GET['lmreason'] : 0;
        $videoInfo = $_GET['videoInfo'];
        $returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : null;

        if ($finalDecodeArr["beginDate"] < $finalDecodeArr["endDate"]) {  // 判断订购是否成功
            MasterManager::setUserIsVip(1);
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(1);
            $result = 0;
        } else {
            MasterManager::setOrderResult(0);
            $result = -1;
        }


        $orderInfo = array(
            "TradeNo" => $_GET['transactionID'],
            "reason" => $_GET['lmreason'],
            "orderId" => $finalDecodeArr["orderId"],
            "beginDate" => $finalDecodeArr["beginDate"],
            "endDate" => $finalDecodeArr["endDate"],
            "validDays" => $finalDecodeArr["validDays"],
            "autoRenew" => $finalDecodeArr["autoRenew"],
            'carrierId' => isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID,
            'result' => $result,
        );

        LogUtils::info("callback12650092UI --->orderInfo:" . json_encode($orderInfo));

        HttpManager::httpRequest("post", ORDER_CALLBACK, $orderInfo);//上报订购结果

        if ($lmreason == 1 || $lmreason == 2) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
                header('Location:' . $returnUrl);
            }
        } else {
            LogUtils::info("Pay12650092::payCallback() ---> jump " . $returnPageName);
            if (empty($returnPageName)) {
                $returnPageName = "";
            }

            // 如果是活动时间，就跳转活动
//            if (MasterManager::getUserIsVip() == 1) {
//                // 如果是在时间段时，就进行调转
//                $duration = ["20191101", "20201001"];
//                $nowT = Date('Ymd');
//                if ($nowT > $duration[0] && $nowT < $duration[1]) {
//                    $intent = IntentManager::createIntent("activity");
//                    $intent->setParam("userId", MasterManager::getUserId());
//                    $intent->setParam("activityName", "ActivityDemolitionExpress20191022");
//                    $intent->setParam("inner", 1);
//                    $intentUrl = IntentManager::intentToURL($intent);
//                    if (!TextUtils::isBeginHead($intentUrl, "http://")) {
//                        $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
//                        header('Location:' . $returnUrl);
//                        return;
//                    }
//                }
//            }
            IntentManager::back($returnPageName);
        }
    }

    /**
     * 说明：程序执行完后必须打印输出“success”（不包含引号）。如果供应商反馈给iTV增值业务平台的字符
     * 不是success这7个字符，iTV增值业务平台会不断重发通知，通知的次数不超过6次，6次通知的间隔频率是：
     * 0m（1分钟之内）,10m,1h,2h,6h,24h。
     * @throws \Think\Exception
     */
    public function asyncPayCallback()
    {
        LogUtils::info("asyncPayCallback ---> _GET: " . json_encode($_REQUEST));
        $tradeInfo = $_REQUEST["tradeInfo"];
        LogUtils::info("asyncPayCallback --->tradeInfo:" . json_encode($tradeInfo));
        $decodeStr = Crypt3DES::decodeCBC($tradeInfo, Encrypt_3DES, "01234567");
        LogUtils::info("asyncPayCallback --->decodeStr:" . $decodeStr);
        $decodeArr = explode("|", $decodeStr);
        $finalDecodeArr = array();
        foreach ($decodeArr as $val) {
            $tempArr = explode("=", $val);
            $finalDecodeArr[$tempArr[0]] = $tempArr[1];
        }

        if ($finalDecodeArr["beginDate"] < $finalDecodeArr["endDate"]) {  // 判断订购是否成功
            $result = 0;
            MasterManager::setUserIsVip(1);
        } else {
            $result = -1;
            MasterManager::setUserIsVip(0);
        }

        $orderInfo = array(
            "TradeNo" => $_GET['transactionID'],
            "reason" => $_GET['lmreason'],
            "orderId" => $finalDecodeArr["orderId"],
            "beginDate" => $finalDecodeArr["beginDate"],
            "endDate" => $finalDecodeArr["endDate"],
            "validDays" => $finalDecodeArr["validDays"],
            "autoRenew" => $finalDecodeArr["autoRenew"],
            "carrierId" => CARRIER_ID,
            "result" => $result,
        );
        LogUtils::info("asyncPayCallback --->orderInfo:" . json_encode($orderInfo));
        HttpManager::httpRequest("post", ORDER_CALLBACK, $orderInfo);//上报订购结果

        echo "success";
    }

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     */
    public function unPayCallback($unPayResultInfo = null)
    {
    }

    /**
     * 获取局方订购回调地址
     * @param $returnPageName
     * @param $reason 0--正常订购，1--人工订购
     * @param int $isPlaying 1视频播放过程中订购，0：非视频播放过程中
     * @param $orderId
     * @param bool $isAsync 是否获取异步回调地址
     * @return string
     */
    private function getOurOrderCallback($returnPageName, $reason, $isPlaying = 0, $orderId, $isAsync = false)
    {
        $userId = MasterManager::getUserId();
        $fromPage = MasterManager::getFromPage();
        $isPlayingStr = "&isPlaying=" . $isPlaying;

        if ($isAsync) {
            $orderCallback = PageManager::getBasePagePath('asyncOrderCallback');
        } else {
            $orderCallback = PageManager::getBasePagePath('orderCallback');
        }

        if (TextUtils::isBeginHead($orderCallback, "http://")) {
            $backUrl = $orderCallback . "/";
        } else {
            $backUrl = "http://" . $_SERVER['HTTP_HOST'] . $orderCallback . "/";
        }
        $urlParam = "?userId=" . $userId
            . "&lmcid=" . CARRIER_ID_XINJIANGDX_TTJS
            . "&lmreason=" . $reason
            . "&transactionID=" . $orderId
            . $isPlayingStr
            . "&returnPageName=" . $returnPageName."&fromPage=" . $fromPage;
        if (!strpos($backUrl, "index.php")) {
            $backUrl .= "index.php";
        }
        $backUrl = $backUrl . $urlParam;
        if ($isAsync) {
            // 如果是异步通知接口，需要把公网的IP改为内网IP，避免平台方服务器无法通知过来
            $srcUrl = "http://120.70.237.86:10001/index.php";
            $destUrl = "http://172.21.33.1:10001/index.php";
            $backUrl = str_replace($srcUrl, $destUrl, $backUrl);
        }
        LogUtils::info("getOurOrderCallback=" . $backUrl);
        return $backUrl;
    }

    /**
     * 通过待加密的字符串获取加密字符串ss
     * @param $queryArr  加密数组   array("providerId" => 123,"orderInfo" => 456);
     * @return string
     */
    private function getEncodeCBCStrWithArr($queryArr)
    {
        $ret = "";
        if (!is_array($queryArr)) {
            return $ret;
        }

        foreach ($queryArr as $key => $value) {
            $prefixStr = "";
            if ($value != end($queryArr)) {
                $prefixStr = $key . "=" . $value . "|";
            } else {
                $prefixStr = $key . "=" . $value;
            }
            $ret .= $prefixStr;
        }
        LogUtils::info("getEncodeCBCStrWithArr ret=" . $ret);
        $orderInfo = Crypt3DES::encodeCBC($ret, Encrypt_3DES, "01234567");
        LogUtils::info("getEncodeCBCStrWithArr=" . $orderInfo);
        return $orderInfo;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platfromType' => MasterManager::getPlatformType(),

            "providerId" => VENDORC_CODE,
        );

        return $info;
    }

    public function webPagePay($userInfo)
    {
        $userId = MasterManager::getUserId();
        $orderReason = 220;
        $remark = "login";
        $isPlaying = 0;
        $returnPageName = "";
        $lmreason = 1;
        $orderType = 0;

        $retArr = array(
            "result" => -1,
            "orderUrl" => USER_ORDER_QUERY,
            "providerId" => VENDORC_CODE,
            "orderInfo" => "",
            "returnUrl" => "",
            "notifyUrl" => ""
        );

        $orderItems = OrderManager::getOrderItem($userId);//获取cws配置的订购信息
        if (count($orderItems) <= 0) {
            LogUtils::error("webPagePay=====>no orderItem!");
            return $retArr;
        } else {
            $vipId = $orderItems[0]->vip_id;
        }

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("webPagePay transactionID --> result:" . json_encode($orderNoJson));
        if ($orderNoJson->result == 0) {

            $callBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, false);//生成回调地址
            $asyncCallBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, true);//生成回调地址
            $retArr["returnUrl"] = $callBackUrl;
            $retArr["notifyUrl"] = $asyncCallBackUrl;
            $waitEncodeArr = array(
                "orderId" => $orderNoJson->order_id,
                "itvAccount" => MasterManager::getAccountId(),
                "productId" => productID_10,
                "price" => PRODUCT_PRICE
            );
            $retArr["orderInfo"] = urlencode($this->getEncodeCBCStrWithArr($waitEncodeArr));
            $retArr["result"] = 0;
        } else {
            LogUtils::error("webPagePay pay failed!!!=" . $orderNoJson->result);
        }
        LogUtils::info("webPagePay pay data:" . json_encode($retArr));

        $orderParam = array(
            "providerId" => $retArr["providerId"],
            "orderInfo" => $retArr["orderInfo"],
            "orderUrl" => urlencode($retArr["orderUrl"]),
            "returnUrl" => urlencode($retArr["returnUrl"]),
            "notifyUrl" => urlencode($retArr["notifyUrl"]),
        );

        $intent = IntentManager::createIntent("directPay");
        $intent->setParam("orderParam", rawurlencode(json_encode($orderParam)));

        $intentUrl = IntentManager::intentToURL($intent);
        $payUrl = "";
        if (!TextUtils::isBeginHead($intentUrl, "http://")) {
            $payUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
        }
        LogUtils::info("webPagePay pay PayUrl: " . $payUrl);

        header("Location:" . $payUrl);
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl()
    {
        $userId = MasterManager::getUserId();
        $orderReason = 221;
        $remark = "login";
        $isPlaying = 0;
        $returnPageName = "";
        $lmreason = 2;
        $orderType = 0;

        $retArr = array(
            "result" => -1,
            "orderUrl" => USER_ORDER_QUERY,
            "providerId" => VENDORC_CODE,
            "orderInfo" => "",
            "returnUrl" => "",
            "notifyUrl" => ""
        );

        $orderItems = OrderManager::getOrderItem($userId);//获取cws配置的订购信息
        if (count($orderItems) <= 0) {
            LogUtils::error("buildDirectPayUrl=====>no orderItem!");
            return null;
        } else {
            $vipId = $orderItems[0]->vip_id;
        }

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("buildDirectPayUrl transactionID --> result:" . json_encode($orderNoJson));
        if ($orderNoJson->result == 0) {

            $callBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, false);//生成回调地址
            $asyncCallBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, true);//生成回调地址
            $retArr["returnUrl"] = $callBackUrl;
            $retArr["notifyUrl"] = $asyncCallBackUrl;
            $waitEncodeArr = array(
                "orderId" => $orderNoJson->order_id,
                "itvAccount" => MasterManager::getAccountId(),
                "productId" => productID_10,
                "price" => PRODUCT_PRICE
            );
            $retArr["orderInfo"] = urlencode($this->getEncodeCBCStrWithArr($waitEncodeArr));
            $retArr["result"] = 0;
        } else {
            LogUtils::error("buildDirectPayUrl pay failed!!!=" . $orderNoJson->result);
            return null;
        }
        LogUtils::info("buildDirectPayUrl pay data:" . json_encode($retArr));

        $orderParam = array(
            "providerId" => $retArr["providerId"],
            "orderInfo" => $retArr["orderInfo"],
            "orderUrl" => urlencode($retArr["orderUrl"]),
            "returnUrl" => urlencode($retArr["returnUrl"]),
            "notifyUrl" => urlencode($retArr["notifyUrl"]),
        );

        $intent = IntentManager::createIntent("directPay");
        $intent->setParam("orderParam", rawurlencode(json_encode($orderParam)));

        $intentUrl = IntentManager::intentToURL($intent);
        $payUrl = "";
        if (!TextUtils::isBeginHead($intentUrl, "http://")) {
            $payUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);
//        $payUrl = "http://120.70.237.86:10001/index.php/Home/Pay/directPay/?orderParam=%7B%22providerId%22%3A%22GYLM%22%2C%22orderInfo%22%3A%22iVb4xkparS00ckQQMrsCZdacAKayTXgjRydtfzAOFjakISL78V0Cbr3tg1axaI5dQlYVBMXPrr%252FRks38%252F4znMhzDseNHCnBMpwJoqqREZHRdezYVeQm1%252FlPZi2xyDbxJ%22%2C%22orderUrl%22%3A%22http%253A%252F%252F202.100.170.235%253A7001%252Fxjitv-api%252Forder%22%2C%22returnUrl%22%3A%22http%253A%252F%252F120.70.237.86%253A10001%252Findex.php%252FHome%252FPay%252FpayCallback%252F%253FuserId%253D635415%2526lmcid%253D12650092%2526lmreason%253D101%2526transactionID%253D201905202135591025291693612%2526isPlaying%253D0%2526returnPageName%253D%22%2C%22notifyUrl%22%3A%22http%253A%252F%252F120.70.237.86%253A10001%252Findex.php%252FHome%252FPay%252FasyncCallBack%252F%253FuserId%253D635415%2526lmcid%253D12650092%2526lmreason%253D101%2526transactionID%253D201905202135591025291693612%2526isPlaying%253D0%2526returnPageName%253D%22%7D";
        return $payUrl;
    }

}