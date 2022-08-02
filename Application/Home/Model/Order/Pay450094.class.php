<?php
/**
 * Created by longmaster
 * @Brief: 主要处理广西广电EPG的计费相关流程
 */

namespace Home\Model\Order;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Page\PageManager;
use Home\Model\User\UserManager;
use Think\Exception;

class Pay450094 extends PayAbstract
{

    /**
     * 用户到局方鉴权,鉴权规则：以我方的vip状态为准
     * @param $param
     * @return int 1：vip，0：普通用户
     */
    public function authentication($param = null)
    {
        $isVip = 0;

        if (LOCATION_TEST) {
            return 1; //如果是本地测试，直接鉴权为vip用户
        }
        $vipInfo = UserManager::queryVipInfo(MasterManager::getUserId());  //校验用户是否为vip
        LogUtils::info("userAuth-->" . $vipInfo->result);

        if ($vipInfo->result == 0) {
            $isVip = 1;
        }
        LogUtils::info("--->userVipStatus=" . $isVip);
        return $isVip;
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
     * 我方订购页构建到局方的订购地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {
        //向广西广电服务器请求订购地址返回值，通过response中orderUrl返回的地址，重定向到局方订购界面
        LogUtils::info("direct go pay!!!");

        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );

        $userId = MasterManager::getUserId();

        $orderReason = $payInfo["orderReason"];
        $remark = $payInfo["orderReason"];
        $isPlaying = $payInfo["isPlaying"];
        $productId = $payInfo["productId"];//1包月，3包年
        $vipId = $payInfo["vipId"];//订单id
        $returnPageName = $payInfo["returnPageName"];//订单id
        $isPackYear = false;//是否为包年用户
        $lmreason = 0;
        $orderType = 1;

        if ($productId == 1) {
            $isPackYear = true;
        }
        LogUtils::info("xml-->isPackYear=" . $productId);
        $jumpUrl = "";

        if (empty($vipId)) {
            $orderItems = OrderManager::getOrderItem($userId);//获取cws配置的订购信息
            if (count($orderItems) <= 0) {
                LogUtils::error("=====>no orderItem!");
                return $jumpUrl;
            } else {
                $vipId = $orderItems[0]->vip_id;
            }
        }

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("user [ . $userId . ]request transactionID --> result:" . json_encode($orderNoJson));
        if ($orderNoJson->result == 0) {

            $callBackUrl = self::getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, false);//生成回调地址
            $asyncCallBackUrl = self::getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, true);//生成回调地址

            if(MasterManager::getSTBId() == "34410002066" || $vipId == 5){

                $result = PayAPI::addPayperBuyNum($orderNoJson->order_id,0,1,0,0);
                LogUtils::info("PayAPI::addPayperBuyNum result:" . json_encode($result));
                $callBackUrl=$callBackUrl."&isbuy=1";
                $asyncCallBackUrl=$asyncCallBackUrl."&isbuy=1";

                $orderUrl = self::getSinglePayUrl_Num($callBackUrl, $asyncCallBackUrl); // 获取订单号成功，去生成局方的订购url
            }elseif ($isPackYear) {
                $orderUrl = self::getPromotionProductOrderUrl($callBackUrl, $asyncCallBackUrl); // 获取订单号成功，去生成局方的订购url
            } else {
                $toDay = date('Y-m-d');
                if ($toDay >= "2021-02-01" && $toDay <= "2021-03-31") {
                    //2021新春福气包
                    $orderUrl = self::getPromotionProductOrderUrl($callBackUrl, $asyncCallBackUrl,"2021新春福气包");
                }else{
                    $orderUrl = self::getProductOrderUrl($callBackUrl, $asyncCallBackUrl); // 获取订单号成功，去生成局方的订购url
                }
            }
            $jumpUrl = $orderUrl;  // 当$directPay = 1，直接跳入局方的订购页
            $ret["result"] = 0;
            $ret["payUrl"] = $jumpUrl;
        } else {
            LogUtils::error("request pay failed!!!=" . $orderNoJson->result);
        }
        return json_encode($ret);
    }

    /**
     * 活动我方订购页构建到局方的活动订购地址
     * @param null $payInfo
     * @return mixed
     */
    public function activitybuildPayUrl($payInfo = null)
    {
        //向广西广电服务器请求订购地址返回值，通过response中orderUrl返回的地址，重定向到局方订购界面
        LogUtils::info("activitybuildPayUrl direct go pay!!!");

        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );


        $userId = MasterManager::getUserId();

        $position = "act_cp";
        $cpName = "39jk";
        $deviceId =MasterManager::getSTBId();
        $areaCode =MasterManager::getAreaCode();

        $orderReason = $payInfo["orderReason"];
        $remark = $payInfo["orderReason"];
        $isPlaying = $payInfo["isPlaying"];
        $productId = $payInfo["productId"];//5活动
        $vipId = $payInfo["vipId"];//订单id
        $returnPageName = $payInfo["returnPageName"];
        $lmreason = 0;
        $orderType = 1;

        LogUtils::info("xml-->isPackYear=" . $productId);
        $jumpUrl = "";

        if (empty($vipId)) {
            $orderItems = OrderManager::getOrderItem($userId);//获取cws配置的订购信息
            if (count($orderItems) <= 0) {
                LogUtils::error("=====>no orderItem!");
                return $jumpUrl;
            } else {
                $vipId = $orderItems[0]->vip_id;
            }
        }

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("user [ . $userId . ]request transactionID --> result:" . json_encode($orderNoJson));
        if ($orderNoJson->result == 0) {

            $callBackUrl = self::getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, false);//生成回调地址
            $orderUrl = "http://10.0.4.16:8307/activity/act_summer_carnival/cp_jump.do?"
                ."position=" .$position
                ."&user_id=". MasterManager::getAccountId()
                ."&device_id=".$deviceId
                ."&area_code=".$areaCode
                ."&return_url=".$callBackUrl
                ."&cp_name=".$cpName;
            $jumpUrl = $orderUrl;
            $ret["result"] = 0;
            $ret["payUrl"] = $jumpUrl;
            LogUtils::info("xml-->jumpUrl=" . $jumpUrl);
        } else {
            LogUtils::error("request pay failed!!!=" . $orderNoJson->result);
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

    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        // 向广西广电服务器请求订购地址返回值，通过response中orderUrl返回的地址，重定向到局方订购界面
        LogUtils::info("Pay[450094] --> direct go pay!!!");

        $userId = MasterManager::getUserId();
        $returnUrl = isset($_GET['returnUrl']) ? $_GET['returnUrl'] : "";
        $orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
        $remark = isset($_GET['remark']) ? $_GET['remark'] : null;
        $isSinglePayItem = isset($_GET['isSinglePayItem']) ? $_GET['isSinglePayItem'] : 1;
        $isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
        $productId = isset($_GET["productId"]) ? $_GET["productId"] : "";//1包月，3包年
        $vipId = isset($_GET["vipId"]) ? $_GET["vipId"] : ""; // 订单id
        $isPackYear = false;//是否为包年用户
        $lmreason = 0;
        $orderType = 1;

        if ($productId == 1) {
            $isPackYear = true;
        }
        LogUtils::info("Pay[450094] --> isPackYear=" . $productId);

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);

        if (count($orderItems) <= 0) {
            LogUtils::error("=====>no orderItem!");
        } else {
            $vipId = $orderItems[0]->vip_id;
            // 向CWS获取订单号
            $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark, null, $orderType);
            LogUtils::info("user [ . $userId . ] [.$isSinglePayItem.]request transactionID --> result:" . json_encode($orderNoJson));
            if ($orderNoJson->result == 0) {
                // 获取订单号成功，去生成局方的订购url
                $callBackUrl = self::getOurOrderCallback($returnUrl, $lmreason, $isPlaying, $orderNoJson->order_id, false);//生成回调地址
                $asyncCallBackUrl = self::getOurOrderCallback($returnUrl, $lmreason, $isPlaying, $orderNoJson->order_id, true);//生成回调地址

                if ($isPackYear) {
                    $userOrderUrl = self::getPromotionProductOrderUrl($callBackUrl, $asyncCallBackUrl); // 获取订单号成功，去生成局方的订购url
                } else {
                    $userOrderUrl = self::getProductOrderUrl($callBackUrl, $asyncCallBackUrl); // 获取订单号成功，去生成局方的订购url
                }
                if ($userOrderUrl != null) {
                    // TODO 按需要实现
                    // 生成上报的url
                    //$postOrderUrl = $this->buildEPGOrderInfo(productID_18, null, $orderNoJson->order_id, 0, $isSinglePayItem, $isPlaying);
                    //得到缓存信息
                    //OrderManager::uploadOrderInfo($userId, $postOrderUrl, 1);
                    // 当$directPay = 1，直接跳入局方的订购页
                    LogUtils::info(" ===> user[ . $userId . ] direct go epg pay page");
                }
            }
        }
        if (empty($userOrderUrl)) {
            IntentManager::back();
            exit();
        }
        header('Location:' . $userOrderUrl);
        exit();
    }


    /**
     * 获取单次点播订购地址
     * @param array $videoInfo 计费需要用到的视频信息
     * @return array
     */
    public function getSinglePayUrl(array $videoInfo)
    {
        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );

        $videoId = $videoInfo["videoId"];
        $videoName = $videoInfo["videoName"];
        $amount = $videoInfo["videoAmount"] / 100;
        $validDuration = $videoInfo["validDuration"];
        $returnPageName = $videoInfo["returnPageName"];
        $sourceId = $videoInfo["sourceId"];
        $callBackUrl = self::getOurOrderCallback($returnPageName, "单片订购", 1, "", false, $sourceId);//生成回调地址
        $asyncCallBackUrl = self::getOurOrderCallback($returnPageName, "单片订购", 1, "", true, $sourceId);//生成回调地址

        $orderData = array(
            "method" => "countingOrder",
            "userId" => MasterManager::getAccountId(),
            "stbId" => MasterManager::getSTBId(),
            "areaCode" => MasterManager::getAreaCode(),
            "productId" => PRODUCT_ID_SINGLE,
            "videoId" => $videoId,
            "videoName" => $videoName,
            "cpId" => CP_ID,
            "amount" => $amount,
            "isHD" => "720P",
            "partner" => PRODUCT_PARTNER,
            "callbackUrl" => $callBackUrl,
            "noticeUrl" => $asyncCallBackUrl,
            "appIndexUrl" => APP_INDEX_URL,
            "timeFeeDate" => $validDuration //授权时长，单位：小时
        );

        $orderDataArr = self::getMD5Arr($orderData);
        self::printGetUrl($orderDataArr, true);
        LogUtils::info("xmlUrl-->getSinglePayUrl" . json_encode($orderDataArr));
        $orderXmlStr = self::getHttpPostData(USER_PROMOTION_SERVICE, $orderDataArr);

        $xmlStr = <<<xml
$orderXmlStr 
xml;
        LogUtils::info("xmlUrl-->" . USER_PROMOTION_SERVICE);
        LogUtils::info("---->xmlStr=" . $xmlStr);
        $xmlObj = simplexml_load_string($xmlStr);
        $xmlJson = json_encode($xmlObj);
        LogUtils::info("---->xmlJson=" . $xmlJson);
        $xmlArr = json_decode($xmlJson, true);
        $retCode = trim($xmlArr["response"]["resultCode"]);

        if (strtoupper($retCode) == "SUCCESS") {
            $ret["payUrl"] = $xmlArr["response"]["orderUrl"];
            $ret["result"] = 0;

        } else {
            LogUtils::info("--->getOrderUrlFail retCode=" . $retCode);
        }
        return $ret;
    }

    /**
     * @param null $payResultInfo
     * @return mixed|void
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {
        LogUtils::info("callback450094UI ---> _GET: " . json_encode($_GET));
        LogUtils::info("callback450094UI ---> _POST: " . json_encode($_POST));

        $userId = $_GET['userId'];
        $isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;// 是否为正在播放引起的订购
        $returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
        $productId = $_GET["productId"];//订购类型
        $sourceId = $_GET["sourceId"];//视频源id
        $isSingleOrder = $productId == PRODUCT_ID_SINGLE;//是否是单片订购

        $orderInfo = array(
            "transactionID" => $_GET['transactionID'],
            "reason" => $_GET['lmreason'],
            "retCode" => $_GET["retCode"],//SUCCESS表示订购成功，其他为失败
            "retMsg" => $_GET["retMsg"],//失败时返回错误消息
            "orderId" => $_GET["orderId"],//订单ID
            "handleTime" => $_GET["handleTime"],//处理时间，格式yyyy-MM-dd hh:mm:ss
            "totalFee" => $_GET["totalFee"],//交易金额，保留两位小数
            "partner" => $_GET["partner"],//商户ID，广西广电网络提供
            "stbId" => $_GET["stbId"],//机顶盒号
            "productId" => $_GET["productId"],//产品ID
            "productName" => $_GET["productName"],//产品名称
            "sign" => $_GET["sign"],//MD5加密字符串,暂时未定义
            'carrierId' => isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID,
            'isbuy' => isset($_GET['isbuy']) ? $_GET['isbuy'] : 0,
        );

        LogUtils::info("callback450094UI --->orderInfo:" . json_encode($orderInfo));

        HttpManager::httpRequest("post", ORDER_CALLBACK, $orderInfo);//上报订购结果

        if ($_REQUEST["retCode"] == "SUCCESS" && !$isSingleOrder) {  // 判断订购是否成功,并且不是单片订购，设置为vip
            MasterManager::setUserIsVip(1);;//如果订购成功，将用户状态变为vip
            if($orderInfo["isbuy"] == 1){
                LogUtils::info("payCallback orderId:" . $orderInfo['orderId']);
                $result = PayAPI::addPayperBuyNum($orderInfo['orderId'],0,1,1,1);
                LogUtils::info("payCallback result:" . json_encode($result));
            }
        }

        LogUtils::info("Pay450094::payCallback() ---> jump " . $returnPageName);

        if ($_REQUEST["retCode"] == "SUCCESS" && $isSingleOrder) {
            $this->notifySingleOrderSuccess($sourceId, $_GET['transactionID'], $_GET["totalFee"]);
        }

        if ($orderInfo["reason"] == 1 || $orderInfo["reason"] == 2) {
            LogUtils::info("Pay450094::payCallback() ---> lmreason:" . $orderInfo["reason"]);
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            $objDst = IntentManager::createIntent("authOrder");
            IntentManager::jump($objDst,$intent);
            //header('Location:' . $returnUrl);
            return;
        }

        if ($isSingleOrder) {
            if ($_REQUEST["retCode"] == "SUCCESS") {
                $videoInfo = MasterManager::getPlayParams();
                LogUtils::info("Pay450094::payCallback()isSingleOrder---> jump player!");
                $objPlayer = IntentManager::createIntent();
                $objPlayer->setPageName("introVideo-single");
                $objPlayer->setParam("userId", $userId);
                $objPlayer->setParam("inner", 1);
                $objPlayer->setParam("videoInfo", json_encode($videoInfo));
                $objDst = IntentManager::createIntent("authOrder");
                IntentManager::jump($objDst,$objPlayer);
                //IntentManager::jump($objPlayer);
            } else {
                LogUtils::info("Pay450094::payCallback()isSingleOrder--->: " . $returnPageName);
                //IntentManager::back("");
                $objDst = IntentManager::createIntent("authOrder");
                IntentManager::jump($objDst);
            }
        } else {
            LogUtils::info("Pay450094::payCallback() ---> jump returnPageName: " . $returnPageName);
            $objDst = IntentManager::createIntent("authOrder");
            IntentManager::jump($objDst);
            //IntentManager::back($returnPageName);
        }
    }

    /**
     * 单片订购成功后，通知cws
     * @param $sourceId
     * @param $orderId
     * @param $fee
     * @return mixed
     */
    private function notifySingleOrderSuccess($sourceId, $orderId, $fee)
    {
        $json = array(
            "source_id" => $sourceId,
            "order_id" => $orderId,
            "fee" => $fee
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_INTROVIDEO_NOTIFY);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }


    public function asyncPayCallback()
    {
        LogUtils::info("asyncPayCallback ---> _GET: " . json_encode($_GET));
        LogUtils::info("asyncPayCallback ---> _POST: " . json_encode($_POST));
        $productId = $_GET["productId"];//订购类型
        $sourceId = $_GET["sourceId"];//视频源id
        $isSingleOrder = $productId == PRODUCT_ID_SINGLE;//是否是单片订购
        $orderInfo = array(
            "transactionID" => $_GET['transactionID'],
            "reason" => $_GET['lmreason'],
            "retCode" => $_GET["retCode"]==""?$_POST["retCode"]:"",//SUCCESS表示订购成功，其他为失败
            "retMsg" => $_GET["retMsg"],//失败时返回错误消息
            "orderId" => $_GET["orderId"],//订单ID
            "handleTime" => $_GET["handleTime"],//处理时间，格式yyyy-MM-dd hh:mm:ss
            "totalFee" => $_GET["totalFee"],//交易金额，保留两位小数
            "partner" => $_GET["partner"],//商户ID，广西广电网络提供
            "stbId" => $_GET["stbId"],//机顶盒号
            "productId" => $_GET["productId"],//产品ID
            "productName" => $_GET["productName"],//产品名称
            "sign" => $_GET["sign"],//MD5加密字符串,暂时未定义
            'isbuy' => isset($_GET['isbuy']) ? $_GET['isbuy'] : 0,
        );
        LogUtils::info("asyncPayCallback --->orderInfo:" . json_encode($orderInfo));
        HttpManager::httpRequest("post", ORDER_CALLBACK, $orderInfo);//上报订购结果

        if ($_REQUEST["retCode"] == "SUCCESS" && $isSingleOrder) {
            $this->notifySingleOrderSuccess($sourceId, $_GET['transactionID'], $_GET["totalFee"]);//上报单片订购结果
        }

        if ($_REQUEST["retCode"] == "SUCCESS" && !$isSingleOrder) {  // 判断订购是否成功
            MasterManager::setUserIsVip(1);
        }

        if($_REQUEST["retCode"] == "SUCCESS" && $orderInfo["isbuy"] == 1){
            LogUtils::info("asyncPayCallback orderId:" . $orderInfo['orderId']);
            $result = PayAPI::addPayperBuyNum($orderInfo['orderId'],0,1,1,1);
            LogUtils::info("asyncPayCallback result:" . json_encode($result));
        }
        echo "success";
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
     * 获取局方订购回调地址
     * @param $returnPageName
     * @param $reason 0--正常订购，1--人工订购
     * @param int $isPlaying 1视频播放过程中订购，0：非视频播放过程中
     * @param $orderId
     * @param bool $isAsync 是否获取异步回调地址
     * @param string $sourceId 视频id，主要用于单次订购
     * @return string
     */
    private static function getOurOrderCallback($returnPageName, $reason, $isPlaying = 0, $orderId, $isAsync = false, $sourceId = "")
    {
        $userId = MasterManager::getUserId();
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
            . "&lmcid=" . CARRIER_ID_GUANGXIGD
            . "&lmreason=" . $reason
            . "&transactionID=" . $orderId
            . $isPlayingStr
            . "&returnPageName=" . $returnPageName . "&sourceId=" . $sourceId;
        $backUrl = $backUrl . $urlParam;
        LogUtils::info("getOurOrderCallback=" . $backUrl);
        return $backUrl;
    }

    private static function queryProductInfoArr()
    {

        $orderData = array(
            "method" => "queryProdInfo",
            "stbId" => MasterManager::getSTBId(),
            "productId" => PRODUCT_ID_MON,
            "partner" => PRODUCT_PARTNER,
        );

        $md5OrderDataArr = self::getMD5Arr($orderData);
        self::printGetUrl($md5OrderDataArr, false);
        LogUtils::info("xmlUrl-->QueryData" . json_encode($md5OrderDataArr));
        $queryResXmlStr = self::getHttpPostData(USER_ORDER_QUERY, $md5OrderDataArr);

        $xmlStr = <<<xml
$queryResXmlStr 
xml;
        LogUtils::info("xmlUrl-->" . USER_ORDER_QUERY);
        LogUtils::info("---->xmlStr=" . $xmlStr);
        $xmlObj = simplexml_load_string($xmlStr);
        $xmlJson = json_encode($xmlObj);
        LogUtils::info("---->xmlJson=" . $xmlJson);
        $xmlArr = json_decode($xmlJson, true);
        return $xmlArr;
    }

    /**
     * @param $callBackUrl
     * @param $asyncCallBackUrl
     * @return string
     */
    private static function getProductOrderUrl($callBackUrl, $asyncCallBackUrl)
    {
        $queryXmlArr = self::queryProductInfoArr();
        $tariffId = "";
        $prodId = $queryXmlArr["response"]["prodInfos"]["prodDto"]["prodId"];
        $prodName = $queryXmlArr["response"]["prodInfos"]["prodDto"]["prodName"];
        $tariffDtoArr = $queryXmlArr["response"]["prodInfos"]["prodDto"]["tariffs"]["tariffDto"];
        if (is_array($tariffDtoArr)) {
            if (count($tariffDtoArr) == count($tariffDtoArr, 1)) {
                if ($tariffDtoArr["billingType"] == "11" || $tariffDtoArr["billingType"] == 11) {
                    $tariffId = $tariffDtoArr["tariffId"];
                } else {
                    $tariffId = $tariffDtoArr["tariffId"];
                    LogUtils::info("getProductOrderUrl-->parser tariffId err");
                }
            } else {
                foreach ($tariffDtoArr as $key => $value) {
                    if ($value["billingType"] == "11" || $value["billingType"] == 11) {
                        $tariffId = $value["tariffId"];
                        break;
                    } else {
                        $tariffId = $value["tariffId"];
                    }
                }
            }
        } else {
            $tariffId = $queryXmlArr["response"]["prodInfos"]["prodDto"]["tariffs"]["tariffDto"]["tariffId"];
        }

        $orderData = array(
            "method" => "prodOrder",
            "productId" => $prodId,
            "productName" => $prodName,
            "tariffId" => $tariffId,
            "qty" => PRODUCT_QTY,
            "userId" => MasterManager::getAccountId(),
            "stbId" => MasterManager::getSTBId(),
            "productDesc" => "测试产品",
            "areaCode" => MasterManager::getAreaCode(),
            "callbackUrl" => $callBackUrl,
            "noticeUrl" => $asyncCallBackUrl,
            "appIndexUrl" => APP_INDEX_URL,
            "unitPrice" => PRODUCT_UNIT_PRICE,
            "isHD" => "720P",
            "partner" => PRODUCT_PARTNER,
        );

        $orderDataArr = self::getMD5Arr($orderData);
        self::printGetUrl($orderDataArr, false);
        LogUtils::info("xmlUrl-->QueryData" . json_encode($orderDataArr));
        $orderXmlStr = self::getHttpPostData(USER_ORDER_QUERY, $orderDataArr);

        $xmlStr = <<<xml
$orderXmlStr 
xml;
        LogUtils::info("xmlUrl-->" . USER_ORDER_QUERY);
        LogUtils::info("---->xmlStr=" . $xmlStr);
        $xmlObj = simplexml_load_string($xmlStr);
        $xmlJson = json_encode($xmlObj);
        LogUtils::info("---->xmlJson=" . $xmlJson);
        $xmlArr = json_decode($xmlJson, true);
        $retCode = trim($xmlArr["response"]["resultCode"]);

        $retUrl = "";

        if (strtoupper($retCode) == "SUCCESS") {
            $retUrl = $xmlArr["response"]["orderUrl"];
        } else {
            LogUtils::info("--->getOrderUrlFail retCode=" . $retCode);
        }
        return $retUrl;
    }


    /**
     * 查询促销产品信息的订购
     * @param $callBackUrl
     * @param $asyncCallBackUrl
     * @return string
     */
    private static function getPromotionProductOrderUrl($callBackUrl, $asyncCallBackUrl,$ActivityName = null)
    {

        $retUrl = "";//返回的订购地址

        $queryPromotionInfoArr = self::queryPromotionInfo();
        if ($queryPromotionInfoArr["response"]["retCode"] == "SUCCESS") {
            if (is_array($queryPromotionInfoArr["response"]["prodInfos"]["prodDto"])) {

                $prodId = $queryPromotionInfoArr["response"]["prodInfos"]["prodDto"][3]["prodId"];
                $prodName = $queryPromotionInfoArr["response"]["prodInfos"]["prodDto"][3]["prodName"];
                $promotionArr = explode("|", $queryPromotionInfoArr["response"][3]["prodInfos"]["prodDto"]["spId"]);
                $promotionId = null;
                if(empty($ActivityName)){
                    $promotionId = $promotionArr[0];
                }else{
                    $promotionNameArr = explode("|", $queryPromotionInfoArr["response"]["prodInfos"]["prodDto"][3]["spName"]);
                    $i = 0;
                    while ($i < sizeof($promotionNameArr)){
                            if(strpos($promotionNameArr[$i],$ActivityName) !== false){
                                $promotionId = $promotionArr[$i];
                                LogUtils::info("queryPromotionInfo::get promotionId:".$promotionId);
                                break;
                            }
                        $i++;
                    }
                    if(empty($promotionId) && !empty($ActivityName)){
                        LogUtils::info("queryPromotionInfo::get promotionId is NULL");
                        $promotionId = $promotionArr[4];
                    }
                }
                $tariffId = $queryPromotionInfoArr["response"]["prodInfos"]["prodDto"][3]["tariffs"]["tariffDto"]["tariffId"];

                $queryPromotionDetailsInfoArr = self::queryPromotionDetailsInfo($promotionId, $prodId);
                if ($queryPromotionDetailsInfoArr["response"]["retCode"] == "SUCCESS") {
                    $promotionDtoArr = $queryPromotionDetailsInfoArr["response"]["prodInfos"]["PromotionDto"];
                    $promotionId = $promotionDtoArr["promotionId"];
                    $ptitle = $promotionDtoArr["pTitle"];
                    $amount = $promotionDtoArr["promotionPrice"];
                    $retUrl = self::queryPromotionOrderUrl($prodId, $prodName, $promotionId, $ptitle, $tariffId, $amount, $callBackUrl, $asyncCallBackUrl);
                } else {
                    LogUtils::info("xml-->queryPromotionDetailsInfo=" . $queryPromotionDetailsInfoArr["response"]["retCode"]);
                }
            } else {
                LogUtils::info("xml-->queryPromotionDetailsInfo parse err");
            }


        } else {
            LogUtils::info("xml-->queryPromotionInfoErr=" . $queryPromotionInfoArr["response"]["retCode"]);
        }

        return $retUrl;
    }


    /**
     * 查询促销信息（ 获取促销产品订购地址需要使用）
     * @return mixed 返回查询结果
     */
    private static function queryPromotionInfo()
    {
        $queryPromotionData = array(
            "method" => "queryPromotionInfo",
            "stbId" => MasterManager::getSTBId(),
            "productId" => PRODUCT_ID_MON,
            "partner" => PRODUCT_PARTNER,
        );
        $md5OrderDataArr = self::getMD5Arr($queryPromotionData);
        self::printGetUrl($md5OrderDataArr, true);
        LogUtils::info("xmlUrl-->queryPromotionInfo" . json_encode($md5OrderDataArr));
        $queryResXmlStr = self::getHttpPostData(USER_PROMOTION_SERVICE, $md5OrderDataArr);
        $xmlStr = <<<xml
$queryResXmlStr 
xml;
        LogUtils::info("xmlUrl-->" . USER_PROMOTION_SERVICE);
        LogUtils::info("---->xmlStr=" . $xmlStr);
        $xmlObj = simplexml_load_string($xmlStr);
        $xmlJson = json_encode($xmlObj);
        LogUtils::info("---->xmlJson=" . $xmlJson);
        $queryXmlArr = json_decode($xmlJson, true);
        return $queryXmlArr;
    }

    /**
     *
     * * 查询促销详细信息（ 获取促销产品订购地址需要使用）
     * @param $promotionId 促销产品Id
     * @param $prodId 产品id
     * @return mixed
     */
    private static function queryPromotionDetailsInfo($promotionId, $prodId)
    {
        $queryOrderData = array(
            "method" => "queryPromotionDetailsInfo",
            "userId" => MasterManager::getAccountId(),
            "productId" => $prodId,
            "partner" => PRODUCT_PARTNER,
            "promotionId" => $promotionId,
        );

        $md5OrderDataArr = self::getMD5Arr($queryOrderData);
        self::printGetUrl($md5OrderDataArr, true);
        LogUtils::info("xmlUrl-->queryPromotionDetailsInfo" . json_encode($md5OrderDataArr));
        $queryResXmlStr = self::getHttpPostData(USER_PROMOTION_SERVICE, $md5OrderDataArr);
        $xmlStr = <<<xml
$queryResXmlStr 
xml;
        LogUtils::info("xmlUrl-->" . USER_PROMOTION_SERVICE);
        LogUtils::info("---->xmlStr=" . $xmlStr);
        $xmlObj = simplexml_load_string($xmlStr);
        $xmlJson = json_encode($xmlObj);
        LogUtils::info("---->xmlJson=" . $xmlJson);
        $queryXmlArr = json_decode($xmlJson, true);
        return $queryXmlArr;
    }

    /**
     * 获取促销产品订购地址（包年产品）
     * @param $prodId
     * @param $prodName
     * @param $promotionId
     * @param $ptitle
     * @param $tariffId
     * @param $callBackUrl
     * @param $asyncCallBackUrl
     * @return string
     */
    private static function queryPromotionOrderUrl($prodId, $prodName, $promotionId, $ptitle, $tariffId, $amount, $callBackUrl, $asyncCallBackUrl)
    {

        $retUrl = "";
        $orderData = array(
            "method" => "promotionOrder",
            "userId" => MasterManager::getAccountId(),
            "stbId" => MasterManager::getSTBId(),
            "areaCode" => MasterManager::getAreaCode(),
            "isHD" => "720P",
            "productId" => $prodId,
            "productName" => $prodName,
            "promotionId" => $promotionId,
            "ptitle" => $ptitle,
            "amount" => $amount,
            "tariffId" => $tariffId,
            "partner" => PRODUCT_PARTNER,
            "callbackUrl" => $callBackUrl,
            "noticeUrl" => $asyncCallBackUrl,
            "appIndexUrl" => APP_INDEX_URL,
        );

        $orderDataArr = self::getMD5Arr($orderData);
        self::printGetUrl($orderDataArr, true);
        LogUtils::info("xmlUrl-->getPromotionOrderUrl" . json_encode($orderDataArr));
        $orderXmlStr = self::getHttpPostData(USER_PROMOTION_SERVICE, $orderDataArr);

        $xmlStr = <<<xml
$orderXmlStr 
xml;
        LogUtils::info("xmlUrl-->" . USER_PROMOTION_SERVICE);
        LogUtils::info("---->xmlStr=" . $xmlStr);
        $xmlObj = simplexml_load_string($xmlStr);
        $xmlJson = json_encode($xmlObj);
        LogUtils::info("---->xmlJson=" . $xmlJson);
        $xmlArr = json_decode($xmlJson, true);
        $retCode = trim($xmlArr["response"]["resultCode"]);

        if (strtoupper($retCode) == "SUCCESS") {
            $retUrl = $xmlArr["response"]["orderUrl"];
        } else {
            LogUtils::info("--->getOrderUrlFail retCode=" . $retCode);
        }
        return $retUrl;

    }

    /**
     * 根据局方的要求获取加密串
     * @param array $orderDataArr
     * @return array
     */
    private static function getMD5Arr(array $orderDataArr)
    {
        ksort($orderDataArr);
        $waitMD5Str = "";
        $i = 0;
        $count = count($orderDataArr);
        foreach ($orderDataArr as $key => $val) {
            $i++;
            if ($i == $count) {
                $waitMD5Str .= $key . "=" . $val . APP_KEY;
            } else {
                $waitMD5Str .= $key . "=" . $val . "&";
            }
        }
        $orderDataArr["sign"] = md5($waitMD5Str);

        LogUtils::info("getMD5Arr-->" . json_encode($orderDataArr));
        return $orderDataArr;
    }


    public static function getHttpPostData($url, $data)
    {
        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_TIMEOUT => 20
        );

        $http = curl_init($url);
        curl_setopt_array($http, $options);
        $result = curl_exec($http);
        if ($errNo = curl_errno($http)) {
            LogUtils::info("xml->rspHead::error--->" . curl_error($http));
        }
        LogUtils::info("xml->rspHead:" . json_encode(curl_getinfo($http)));
        curl_close($http);

        return $result;
    }

    private static function printGetUrl($md5OrderDataArr, $isPromotion = false)
    {
        $getUrlParam = "";
        $j = 0;
        $countUrl = count($md5OrderDataArr);
        foreach ($md5OrderDataArr as $key => $val) {
            $j++;
            if ($j == $countUrl) {
                if ($key == "callbackUrl" || $key == "noticeUrl" || $key == "appIndexUrl") {
                    $getUrlParam .= $key . "=" . urlencode($val);
                } else {
                    $getUrlParam .= $key . "=" . $val;
                }

            } else {
                if ($key == "callbackUrl" || $key == "noticeUrl" || $key == "appIndexUrl") {
                    $getUrlParam .= $key . "=" . urlencode($val) . "&";
                } else {
                    $getUrlParam .= $key . "=" . $val . "&";
                }

            }
        }
        if ($isPromotion) {
            $getUrl = USER_PROMOTION_SERVICE . "?" . $getUrlParam;
            LogUtils::info("xml-->getUrlPromotion=" . $getUrl);
        } else {
            $getUrl = USER_ORDER_QUERY . "?" . $getUrlParam;
            LogUtils::info("xml-->getUrl=" . $getUrl);
        }

    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
        $userAccount = MasterManager::getAccountId();

        $info = array(
            'accountId' => $userAccount,
            "stbId" => MasterManager::getSTBId(),
            "areaCode" => MasterManager::getAreaCode(),
            'lmcid' => CARRIER_ID,
            'userId' => MasterManager::getUserId(),
        );

        return $info;
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
        $orderReason = 220;
        $remark = "login";
        $isPlaying = 0;
        $returnPageName = "";
        $lmreason = 1;
        $orderType = 0;

        $orderItems = OrderManager::getOrderItem($userId);  //拉取订购项
        if (count($orderItems) <= 0) {
            LogUtils::error("webPagePay::orderItem is empty");
            return;
        }
        $vipId = $orderItems[0]->vip_id;

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("webPagePay::orderNoJson:" . json_encode($orderNoJson));
        if ($orderNoJson->result == 0) {
            $callBackUrl = self::getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, false);//生成回调地址
            $asyncCallBackUrl = self::getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, true);//生成回调地址
            $payUrl = self::getProductOrderUrl($callBackUrl, $asyncCallBackUrl); // 生成包月订购地址
        } else {
            LogUtils::error("webPagePay::req order fail!!!=" . $orderNoJson->result);
        }

        LogUtils::info("webPagePay pay PayUrl: " . $payUrl);

        if (empty($payUrl)) {
            echo "<body><div id=\"lm-msg\">获取订购地址为空</div></body>";
            exit(0);
        } else {
            header("Location:" . $payUrl);
        }
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl() {
        $payUrl = "";
        $userId = MasterManager::getUserId();
        $orderReason = 221;
        $remark = "login";
        $isPlaying = 0;
        $returnPageName = "";
        $lmreason = 2;
        $orderType = 0;

        $orderItems = OrderManager::getOrderItem($userId);  //拉取订购项
        if (count($orderItems) <= 0) {
            LogUtils::error("buildDirectPayUrl::orderItem is empty");
            return $payUrl;
        }
        $vipId = $orderItems[0]->vip_id;

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("buildDirectPayUrl::orderNoJson:" . json_encode($orderNoJson));
        if ($orderNoJson->result == 0) {
            $callBackUrl = self::getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, false);//生成回调地址
            $asyncCallBackUrl = self::getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, true);//生成回调地址
            $payUrl = self::getProductOrderUrl($callBackUrl, $asyncCallBackUrl); // 生成包月订购地址
        } else {
            LogUtils::error("buildDirectPayUrl::req order fail!!!=" . $orderNoJson->result);
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);
        // 跟上我方的订单号：
        if (!empty($payUrl)) {
            $payUrl = $payUrl . "&lmTradeNo=" . $orderNoJson->order_id;
        }
        return $payUrl;
    }

    /**
     * 单次计费，主要用于视频问诊，计费成功后，会增加一次问诊次数
     * @param $callBackUrl
     * @param $asyncCallBackUrl
     * @return string
     */
    private static function getSinglePayUrl_Num($callBackUrl, $asyncCallBackUrl)
    {
        $ret = "";

        $orderData = array(
            "method" => "consumeOrder",
            "stbId" => MasterManager::getSTBId(),
            "userId" => MasterManager::getAccountId(),
            "areaCode" => MasterManager::getAreaCode(),
            "productId" => PRODUCT_ID_THREE,
            "amount" => PRODUCT_UNIT_THREE_PRICE,
            "partner" => PRODUCT_PARTNER,
            "productName" => PRODUCT_THREE_NAME,
            "sprId" => SPR_ID,
            "isHD" => "720P",
            "callbackUrl" => $callBackUrl,
            "noticeUrl" => $asyncCallBackUrl,
            "appIndexUrl" => APP_INDEX_URL,
        );

        $orderDataArr = self::getMD5Arr($orderData);
        self::printGetUrl($orderDataArr);
        LogUtils::info("xmlUrl-->getSinglePayUrl_Num" . json_encode($orderData));
        LogUtils::info("xmlUrl-->getSinglePayUrl_Num" . json_encode($orderDataArr));
        $orderXmlStr = self::getHttpPostData(USER_ORDER_QUERY, $orderDataArr);
        LogUtils::info("orderXmlStr-->" . json_encode($orderXmlStr));

        $xmlStr = <<<xml
$orderXmlStr 
xml;
        LogUtils::info("xmlUrl-->" . PRODUCT_ID_THREE);
        LogUtils::info("---->xmlStr=" . $xmlStr);
        $xmlObj = simplexml_load_string($xmlStr);
        $xmlJson = json_encode($xmlObj);
        LogUtils::info("---->xmlJson=" . $xmlJson);
        $xmlArr = json_decode($xmlJson, true);
        $retCode = trim($xmlArr["response"]["resultCode"]);

        if (strtoupper($retCode) == "SUCCESS") {
            $ret = $xmlArr["response"]["orderUrl"];
        } else {
            LogUtils::info("--->getOrderUrlFail retCode=" . $retCode);
        }

        return $ret;
    }
}