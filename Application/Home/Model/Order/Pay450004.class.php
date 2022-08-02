<?php
/**
 * Created by longmaster
 * @Brief: 主要处理广西广电EPG的计费相关流程
 */

namespace Home\Model\Order;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Page\PageManager;
use Home\Model\User\UserManager;
use Think\Exception;

class Pay450004 extends PayAbstract
{

    /**
     * 用户到局方鉴权,鉴权规则：以我方的vip状态为准
     * @param $param
     * @return int 1：vip，0：普通用户
     */
    public function authentication($param = null)
    {
        $isVip = false;

        if (LOCATION_TEST) {
            $isVip = 1;//如果是本地测试，直接鉴权为vip用户
            return $isVip;
        }
        $vipInfo = UserManager::queryVipInfo(MasterManager::getUserId());  //校验用户是否为vip
        LogUtils::info("userAuth-->" . $vipInfo->result);

        if ($vipInfo->result == 0) {
            $isVip = true;
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
    public function buildPayInfo($payInfo = null)
    {
        //向广西广电服务器请求订购地址返回值，通过response中orderUrl返回的地址，重定向到局方订购界面
        LogUtils::info("direct go pay!!!");

        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );

        $userId = MasterManager::getUserId();

        if(is_object($payInfo)) {
            $payInfo = (array)$payInfo;
        }
        LogUtils::info("xml-->payInfo=" . json_encode($payInfo));

        $orderReason = $payInfo["orderReason"];
        $remark = $payInfo["remark"];
        $isPlaying = $payInfo["isPlaying"];
        $lmprice = $payInfo["price"];//价格
        $vipId = $payInfo["vip_id"];//订单id
        $returnPageName = $payInfo["returnPageName"];//订单id

        LogUtils::info("xml-->price=" . $lmprice);
        if (empty($vipId)) {
            LogUtils::info("request vip_id is empty");
            $ret["result"] = -1;
            return json_encode($ret);
        }

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark);  // 向CWS获取订单号
        LogUtils::info("user [ . $userId . ]request transactionID --> result:" . $orderNoJson);
        if ($orderNoJson->result == 0) {
            $callBackUrl = self::getOurOrderCallback($returnPageName, $orderReason, $isPlaying, $orderNoJson->order_id, false, $lmprice);//生成回调地址
            $asyncCallBackUrl = self::getOurOrderCallback($returnPageName, $orderReason, $isPlaying, $orderNoJson->order_id, true, $lmprice);//生成回调地址

            $orderUrl = "";
            switch ($lmprice) {
                case "2000":
                    $orderUrl = self::getProductOrderUrl($callBackUrl, $asyncCallBackUrl, PRODUCT_ID_MON); // 获取订单号成功，去生成局方的订购url
                    break;
                /*case "2500":
                    $orderUrl = self::getProductOrderUrl($callBackUrl, $asyncCallBackUrl, PRODUCT_ID_MON_25); // 获取订单号成功，去生成局方的
                    break;*/
                case "6000":
                case "9600":
                case "16800":
                case "21600":
                    $orderUrl = self::getPromotionProductOrderUrl($callBackUrl, $asyncCallBackUrl, $lmprice); // 获取订单号成功，去生成局方的订购url
                    break;
                case "500":
                    $orderUrl = self::getSinglePayUrl($callBackUrl, $asyncCallBackUrl);
                    break;
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

    }


    /**
     * 单次计费，主要用于视频问诊，计费成功后，会增加一次问诊次数
     * @param $callBackUrl
     * @param $asyncCallBackUrl
     * @return string
     */
    private static function getSinglePayUrl($callBackUrl, $asyncCallBackUrl)
    {
        $ret = "";

        $orderData = array(
            "method" => "consumeOrder",
            "stbId" => MasterManager::getSTBId(),
            "userId" => MasterManager::getAccountId(),
            "areaCode" => MasterManager::getAreaCode(),
            "productId" => PRODUCT_ID_SINGLE,
            "amount" => PRODUCT_UNIT_PRICE,
            "partner" => PRODUCT_PARTNER,
            "productName" => PRODUCT_NAME,
            "sprId" => SPR_ID,
            "isHD" => "720P",
            "callbackUrl" => $callBackUrl,
            "noticeUrl" => $asyncCallBackUrl,
            "appIndexUrl" => APP_INDEX_URL,
        );

        $orderDataArr = self::getMD5Arr($orderData);
        self::printGetUrl($orderDataArr);
        LogUtils::info("xmlUrl-->getSinglePayUrl" . json_encode($orderDataArr));
        $orderXmlStr = self::getHttpPostData(USER_ORDER_QUERY, $orderDataArr);

        $xmlArr = json_decode($orderXmlStr, true);
        $retCode = trim($xmlArr["resultCode"]);

        if (strtoupper($retCode) == "SUCCESS") {
            $ret = $xmlArr["orderUrl"];
            LogUtils::info("::::::::::::::::::::::success" . $ret);
        } else {
            LogUtils::info("--->getSinglePayUrlFail retCode=" . $retCode);
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

        $userId = $_GET['userId'];
        $isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;// 是否为正在播放引起的订购
        $lmprice = $_GET["lmprice"];//订购产品的价格   //todo 需要做跳转判断以及是否通知12349
        $returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
        $productId = $_GET["productId"];//订购类型

        $isSingleOrder = $productId == PRODUCT_ID_SINGLE;//是否是单片订购

        $orderInfo = array(
            "transactionID" => $_GET['transactionID'],
            "reason" => $_GET['lmreason'],
            "retCode" => $_GET["retCode"],//SUCCESS表示订购成功，其他为失败
            "retMsg" => $_GET["retMsg"],//失败时返回错误消息
            "orderId" => $_GET["orderId"],//订单ID
            "handleTime" => $_GET["handleTime"],//处理时间，格式yyyy-MM-dd HH:mm:ss
            "totalFee" => $_GET["totalFee"],//交易金额，保留两位小数
            "partner" => $_GET["partner"],//商户ID，广西广电网络提供
            "stbId" => $_GET["stbId"],//机顶盒号
            "productId" => $_GET["productId"],//产品ID
            "productName" => $_GET["productName"],//产品名称
            "sign" => $_GET["sign"],//MD5加密字符串,暂时未定义
            'carrierId' => isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID,
        );

        LogUtils::info("callback450094UI --->orderInfo:" . json_encode($orderInfo));

        HttpManager::httpRequest("post", ORDER_CALL_BACK_URL, $orderInfo);//上报订购结果

        if ($_REQUEST["retCode"] == "SUCCESS" && !$isSingleOrder) {  // 判断订购是否成功,并且不是单片订购，设置为vip
            MasterManager::setVIPUser(1);//如果订购成功，将用户状态变为vip
        }

        LogUtils::info("Pay450094::payCallback() ---> jump " . $returnPageName);

        $isVip = MasterManager::isVIPUser();

        if ($_REQUEST["retCode"] == "SUCCESS" && $isSingleOrder) {
//            $this->notifySingleOrderSuccess($sourceId, $_GET['transactionID'], $_GET["totalFee"]);
        }

        LogUtils::info("Pay450004::payCallback() ---> jump returnPageName: " . $returnPageName);

        if ($_REQUEST["retCode"] == "SUCCESS") {
            switch ($lmprice) {
                case "2500":    //包含12349套餐
                case "6000":   //包含12349套餐
                case "21600":  //包含12349套餐
                    $orderType = "";
                    if ($lmprice == "2500") {
                        $orderType = 1;  //包月
                    } else if ($lmprice == "6000") {
                        $orderType = 2; //包季
                    } else if ($lmprice == "21600") {
                        $orderType = 3;//包年
                    }

                    $showOrderResultObj = IntentManager::createIntent("payShowResult");
                    $showOrderResultObj->setParam("msgId", $_GET['transactionID']);
                    $showOrderResultObj->setParam("mobile", "");
                    $showOrderResultObj->setParam("deviceId", MasterManager::getSTBId());
                    $showOrderResultObj->setParam("productId", $_GET["productId"]);
                    $showOrderResultObj->setParam("productName", $_GET["productName"]);
                    $showOrderResultObj->setParam("productDesc", "");
                    $showOrderResultObj->setParam("orderType", $orderType);
                    $showOrderResultObj->setParam("orderTime", $_GET["handleTime"]);
                    $objCurr = IntentManager::createIntent();
                    $objCurr->setPageName($returnPageName);
                    IntentManager::jump($showOrderResultObj, $objCurr, IntentManager::$INTENT_FLAG_NOT_STACK);

                    break;
                default:
                    IntentManager::back($returnPageName);
                    break;
            }
        } else {
            IntentManager::back($returnPageName);
        }

    }


    public function asyncPayCallback()
    {
        LogUtils::info("asyncPayCallback ---> _GET: " . json_encode($_REQUEST));
        $productId = $_REQUEST["productId"];//订购类型

        $isSingleOrder = $productId == PRODUCT_ID_SINGLE;//是否是单片订购
        $orderInfo = array(
            "transactionID" => $_REQUEST['transactionID'],
            "reason" => $_REQUEST['lmreason'],
            "retCode" => $_REQUEST["retCode"],//SUCCESS表示订购成功，其他为失败
            "retMsg" => $_REQUEST["retMsg"],//失败时返回错误消息
            "orderId" => $_REQUEST["orderId"],//订单ID
            "handleTime" => $_REQUEST["handleTime"],//处理时间，格式yyyy-MM-dd HH:mm:ss
            "totalFee" => $_REQUEST["totalFee"],//交易金额，保留两位小数
            "partner" => $_REQUEST["partner"],//商户ID，广西广电网络提供
            "stbId" => $_REQUEST["stbId"],//机顶盒号
            "productId" => $_REQUEST["productId"],//产品ID
            "productName" => $_REQUEST["productName"],//产品名称
            "sign" => $_REQUEST["sign"],//MD5加密字符串,暂时未定义

        );
        LogUtils::info("asyncPayCallback --->orderInfo:" . json_encode($orderInfo));
        HttpManager::httpRequest("post", ORDER_CALL_BACK_URL, $orderInfo);//上报订购结果

        if ($_REQUEST["retCode"] == "SUCCESS" && $isSingleOrder) {
//            $this->notifySingleOrderSuccess($sourceId, $_GET['transactionID'], $_GET["totalFee"]);//上报单片订购结果
        }

        if ($_REQUEST["retCode"] == "SUCCESS" && !$isSingleOrder) {  // 判断订购是否成功
            try {
                MasterManager::setVIPUser(1);
            } catch (Exception $e) {
            }
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
     * @param string $lmprice 订购价格
     * @return string
     */
    private static function getOurOrderCallback($returnPageName, $reason, $isPlaying = 0, $orderId, $isAsync = false, $lmprice = "")
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
            . "&lmcid=" . CARRIER_ID_GUANGXIGD_APK
            . "&lmreason=" . $reason
            . "&transactionID=" . $orderId
            . $isPlayingStr
            . "&returnPageName=" . $returnPageName . "&lmprice=" . $lmprice;
        $backUrl = $backUrl . $urlParam;
        LogUtils::info("getOurOrderCallback=" . $backUrl);
        return $backUrl;
    }

    /**
     * 查询包月信息
     * @param $prodId
     * @return mixed
     */
    private static function queryProductInfoArr($prodId)
    {

        $orderData = array(
            "method" => "queryProdInfo",
            "stbId" => MasterManager::getSTBId(),
            "productId" => $prodId,
            "partner" => PRODUCT_PARTNER,
        );

        $md5OrderDataArr = self::getMD5Arr($orderData);
        self::printGetUrl($md5OrderDataArr);
        LogUtils::info("xmlUrl-->QueryData" . json_encode($md5OrderDataArr));
        $queryResXmlStr = self::getHttpPostData(USER_ORDER_QUERY, $md5OrderDataArr);
        $xmlArr = json_decode($queryResXmlStr, true);
        return $xmlArr;
    }

    /**
     * 获取包月产品地址、25元、20元包月
     * @param $callBackUrl
     * @param $asyncCallBackUrl
     * @param $prodId
     * @return string
     */
    private static function getProductOrderUrl($callBackUrl, $asyncCallBackUrl, $prodId)
    {
        $queryXmlArr = self::queryProductInfoArr($prodId);
        $tariffId = "";
        $retCode = $queryXmlArr["retCode"];
        if (strtoupper($retCode) == "SUCCESS") {
            $prodId = $queryXmlArr["prodInfos"][0]["prodId"];
            $prodName = $queryXmlArr["prodInfos"][0]["prodName"];
            $tariffDtoArr = $queryXmlArr["prodInfos"][0]["tariffs"][0];
            $tariffId = $tariffDtoArr["tariffId"];
        } else {
            LogUtils::error("getProductOrderUrl error");
            return "";
        }

        $orderData = array(
            "method" => "prodOrder",
            "productId" => $prodId,
            "productName" => $prodName,
            "tariffId" => $tariffId,
            "qty" => PRODUCT_QTY,
            "userId" => MasterManager::getAccountId(),
            "stbId" => MasterManager::getSTBId(),
            "productDesc" => "广电云智慧医疗",
            "areaCode" => MasterManager::getAreaCode(),
            "callbackUrl" => $callBackUrl,
            "noticeUrl" => $asyncCallBackUrl,
            "appIndexUrl" => APP_INDEX_URL,
            "unitPrice" => PRODUCT_UNIT_PRICE,
            "isHD" => "720P",
            "partner" => PRODUCT_PARTNER,
        );

        $orderDataArr = self::getMD5Arr($orderData);
        self::printGetUrl($orderDataArr);
        LogUtils::info("xmlUrl-->QueryData" . json_encode($orderDataArr));
        $orderXmlStr = self::getHttpPostData(USER_ORDER_QUERY, $orderDataArr);
        $xmlArr = json_decode($orderXmlStr, true);
        $retUrl = "";
        if (strtoupper($xmlArr["resultCode"]) == "SUCCESS") {
            $retUrl = $xmlArr["orderUrl"];
            LogUtils::info("::::::::::::::::::::::success" . $retUrl);
        }
        return $retUrl;
    }


    /**
     * 查询促销产品信息的订购
     * @param $callBackUrl
     * @param $asyncCallBackUrl
     * @param $lmprice
     * @return string
     */
    private static function getPromotionProductOrderUrl($callBackUrl, $asyncCallBackUrl, $lmprice)
    {

        $retUrl = "";//返回的订购地址

        $queryPromotionInfoArr = self::queryPromotionInfo();

        $retCode = strtoupper($queryPromotionInfoArr["retCode"]);

        if ($retCode != "SUCCESS") {
            LogUtils::info("xml-->queryPromotionInfo err!!!!!");
            return $retUrl;
        }


        $tempProdInfosArr = $queryPromotionInfoArr["prodInfos"][0];
        $tempTariffsArr = $tempProdInfosArr["tariffs"][0];

        $tempProdId = $tempProdInfosArr["prodId"];
        $tempProdName = $tempProdInfosArr["prodName"];
        $tempTariffId = $tempTariffsArr["tariffId"];

        $tempSpName = explode("|", $tempProdInfosArr["spName"]);
        $tempSpId = explode("|", $tempProdInfosArr["spId"]);
        $tempSpRemark = explode("|", $tempProdInfosArr["spRemark"]);

        $tempPromotionId = "";//促销产品id-->
        $tempPTitle = "";
        switch ($lmprice) {
            case "6000":
                $index = array_search("广电云智慧医疗养老会员季度包_60元", $tempSpName);
                $tempPTitle = "广电云智慧医疗养老会员季度包_60元";
                $tempPromotionId = $tempSpId[$index];
                break;
            case "9600":
                $index = array_search("广电云智慧医疗会员-96元/年", $tempSpName);
                $tempPTitle = "广电云智慧医疗会员-96元/年";
                $tempPromotionId = $tempSpId[$index];
                break;
            case "16800":
                $index = array_search("广电云智慧医疗会员-168元/两年", $tempSpName);
                $tempPTitle = "广电云智慧医疗会员-168元/两年";
                $tempPromotionId = $tempSpId[$index];
                break;
            case "21600":
                $index = array_search("广电云智慧医疗会员-216元/三年", $tempSpName);
                $tempPTitle = "广电云智慧医疗会员-216元/三年";
                $tempPromotionId = $tempSpId[$index];
                break;
            default:
                LogUtils::info("xml-->queryPromotionInfo err没有相应产品包信息!!!!!");
                return $retUrl;
        }

        //查询促销产品详情--开始
        $queryPromotionDetailArr = self::queryPromotionDetailsInfo($tempPromotionId, $tempProdId);
        if ($queryPromotionDetailArr["retCode"] != "SUCCESS") {
            LogUtils::info("xml-->queryPromotionDetailArr err促销产品详情信息不存在!!!!!");
            return $retUrl;
        }
        $promotionsArr = $queryPromotionDetailArr["promotions"][0];
        $tempPromotionPrice = $promotionsArr["value"];  //todo 价格由于局方boss系统异常，暂时直接写死
        switch ($lmprice) {
            case "6000":
                $tempPromotionPrice = 60;
                break;
            case "9600":
                $tempPromotionPrice = 96;
                break;
            case "16800":
                $tempPromotionPrice = 168;
                break;
            case "21600":
                $tempPromotionPrice = 216;
                break;
        }

        //查询促销产品详情--结束
        $retUrl = self::queryPromotionOrderUrl($tempProdId, $tempProdName, $tempPromotionId, $tempPTitle, $tempTariffId, $tempPromotionPrice, $callBackUrl, $asyncCallBackUrl);

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
        self::printGetUrl($md5OrderDataArr);
        LogUtils::info("xmlUrl-->queryPromotionInfo" . json_encode($md5OrderDataArr));
        $queryResXmlStr = self::getHttpPostData(USER_ORDER_QUERY, $md5OrderDataArr);
        LogUtils::info("---->queryResXmlStr=" . $queryResXmlStr);
        $queryXmlArr = json_decode($queryResXmlStr, true);
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
        self::printGetUrl($md5OrderDataArr);
        LogUtils::info("xmlUrl-->queryPromotionDetailsInfo" . json_encode($md5OrderDataArr));
        $queryResXmlStr = self::getHttpPostData(USER_ORDER_QUERY, $md5OrderDataArr);

        LogUtils::info("---->xmlJson=" . $queryResXmlStr);
        $queryXmlArr = json_decode($queryResXmlStr, true);
        return $queryXmlArr;
    }

    /**
     * 获取促销产品订购地址
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
        self::printGetUrl($orderDataArr);
        LogUtils::info("xmlUrl-->getPromotionOrderUrl" . json_encode($orderDataArr));
        $orderXmlStr = self::getHttpPostData(USER_ORDER_QUERY, $orderDataArr);
        $xmlArr = json_decode($orderXmlStr, true);

        if (strtoupper($xmlArr["resultCode"]) == "SUCCESS") {
            $retUrl = $xmlArr["orderUrl"];
            LogUtils::info("::::::::::::::::::::::success" . $retUrl);
        } else {
            LogUtils::info("--->getOrderUrlFail retCode=" . $xmlArr["resultCode"]);
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
            CURLOPT_HEADER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_TIMEOUT => 20
        );

        $http = curl_init($url);
        curl_setopt_array($http, $options);
        $sContent = curl_exec($http);
        if ($errNo = curl_errno($http)) {
            LogUtils::info("xml->rspHead::error--->" . curl_error($http));
        }

        // 获得响应结果里的：头大小
        $headerSize = curl_getinfo($http, CURLINFO_HEADER_SIZE);
        $headerTotal = strlen($sContent);
        $bodySize = $headerTotal - $headerSize;

        // 根据头大小去获取头信息内容
        $header = substr($sContent, 0, $headerSize);
        $comma_separated = explode("\r\n", $header);
        $arr = array();

        foreach ($comma_separated as $value) {
            if (strpos($value, ':') !== false) {
                $a = explode(":", $value);
                $key = $a[0];
                $v = $a[1];
                $arr[$key] = $v;
            } else {
                array_push($arr, $value);
            }
        }
        $body = substr($sContent, $headerSize, $bodySize);
        LogUtils::info("xml->header::" . json_encode($arr));
        LogUtils::info("xml->body::" . $body);
        curl_close($http);

        return $body;
    }

    private static function printGetUrl($md5OrderDataArr)
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
        $getUrl = USER_ORDER_QUERY . "?" . $getUrlParam;
        LogUtils::info("xml-->getUrl=" . $getUrl);

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

        $orderItems = OrderManager::getOrderItem($userId);  //拉取订购项
        if (count($orderItems) <= 0) {
            LogUtils::error("webPagePay::orderItem is empty");
            return;
        }
        $vipId = $orderItems[0]->vip_id;

        $orderNoJson = OrderManager::createPayTradeNo($vipId, "220", "login");  // 向CWS获取订单号
        LogUtils::info("webPagePay::orderNoJson:" . json_encode($orderNoJson));
        if ($orderNoJson->result == 0) {
            $callBackUrl = self::getOurOrderCallback(null, 0, 0, $orderNoJson->order_id, false);//生成回调地址
            $asyncCallBackUrl = self::getOurOrderCallback(null, 0, 0, $orderNoJson->order_id, true);//生成回调地址
            $payUrl = self::getProductOrderUrl($callBackUrl, $asyncCallBackUrl); // 生成包月订购地址
        } else {
            LogUtils::error("webPagePay::req order fail!!!=" . $orderNoJson->result);
        }

        LogUtils::info("webPagePay pay PayUrl: " . $payUrl);

        header("Location:" . $payUrl);
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
     * 订购结果显示界面，特殊处理
     * @param payController |null $
     * @return mixed
     */
    public function payShowResult($payController = null)
    {
        return $_GET;
    }

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
    }
}