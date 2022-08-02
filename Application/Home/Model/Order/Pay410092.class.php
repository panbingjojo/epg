<?php
/**
 * Created by longmaster
 * @Brief: 主要处理河南电信EPG的计费相关流程
 */

namespace Home\Model\Order;


use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\AlbumAPI;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\MainHome\MainHomeManager;
use Home\Model\Page\PageManager;
use Home\Model\User\UserManager;


class Pay410092 extends PayAbstract
{
    /**
     * 用户到局方鉴权
     * @param $param
     * @return mixed
     */
    public function authentication($param = null)
    {
        // TODO: Implement authentication() method.
        $isVip = 0;

        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = MasterManager::getAccountId();
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);

        // 查询订单详细
        $respond = $this->queryUserOrderDetail($userAccount, $userToken);

        $timestamp = Date('Ymdhms'); // 20171130121108

        if ($respond[1][0] == 0) {
            $result = json_decode($respond[2][1]);
            $count = count($result);
            for ($i = 0; $i < $count; $i++) {
                $expiredTime = $result[$i]->expiredTime;
                $productID = $result[$i]->productID;
                if ($productID == PRODUCT_ID_25) {
                    // 判断失效时间
                    if (strcmp($expiredTime, $timestamp) >= 0) {
                        $isVip = 1;
                        break;
                    }
                }
            }
        }
        if(!$isVip && MasterManager::getIsTestUser()){
            $isVip = $this->authentication_province();
        }

        return $isVip;
    }

    //河南省电信鉴权接口，原来authentication接口是到江苏基地鉴权
    public function authentication_province($param = null)
    {
        $isVip = 0;

        $waitEncodeArr = array(
            "itvAccount" => MasterManager::getAccountId(),
            "productId" => PRODUCT_ID_25,
            "contentId" => ""
        );

        $orderInfo = $this->getEncodeCBCStrWithArr($waitEncodeArr);

        $queryArr = array(
            "providerId" => VENDORC_CODE,
            "orderInfo" => $orderInfo
        );

        $authUrl = USER_ORDER_AUTH_PROVINCE . http_build_query($queryArr);

        LogUtils::info("Pay410092::authentication_province Url --->:" . $authUrl);
        $res = HttpManager::httpRequest("GET", $authUrl, "");
        LogUtils::info("Pay410092::authentication_province ---> authResult:" . $res);
        $resArr = json_decode($res, true);
        if (isset($resArr["respCode"])) {
            if ($resArr["respCode"] === 0 || $resArr["respCode"] === "0") {
                if ($resArr["ordered"] === 1 || $resArr["ordered"] === "1") {
                    $isVip = 1;
                } else if ($resArr["ordered"] == -1) {
                    LogUtils::info("Pay410092::authentication_province ---> is free experience!!!");
                }
            }
        }
        LogUtils::info("Pay410092::authentication_province ---> isVip:" . $isVip);
        return $isVip;
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
     * 构建到局方用户验证地址
     * @param $param
     * @return mixed
     */
    public function buildVerifyUserUrl($param = null)
    {
        // TODO: Implement buildVerifyUserUrl() method.
        return "";
    }

    /**
     * 我方订购页构建到局方的订购地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {
        // TODO: Implement buildPayUrl() method.
        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );

        //跳转省份接口
        if(MasterManager::getIsTestUser()){
            $orderInfo = json_encode($payInfo);
            $payUrl = $this->buildPayUrl_Province(json_decode($orderInfo,true));
            $ret['result'] = 0;
            $ret['payUrl'] = $payUrl;
            return json_encode($ret);
        }

        if ($payInfo == null || $payInfo == "" || !is_object($payInfo)) {
            LogUtils::error("buildPayUrl， 参数错误");
            return $ret;
        }
        $payInfo->orderType = 1;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay410092::webPagePay ---> pay orderItem is empty");
            return json_encode($ret);
        }

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark, "", $payInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 创建失败
            $ret['result'] = $tradeInfo->result;
            return $ret;
        }
        // 鉴权失败说明用户可订购， 构建订购地址
        $payInfo->tradeId = $tradeInfo->order_id;
        $payInfo->userId = MasterManager::getUserId();
        // 订购的产品信息
        $productInfo = new \stdClass();
        $productInfo->productNo = productID_25;       // 产品编号
        $productInfo->productId = PRODUCT_ID_25;        // 使用包月产品
        $productInfo->price = $orderItems[0]->price;      // 价格
        $productInfo->PurchaseType = 0;                 // 包月自动续费

        $payInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("Pay410092::buildPayUrl() ---> epgInfoMap: " . json_encode($epgInfoMap));

        // 通过缓存得到用户账号和token
        $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);

        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->adContentId = $epgInfoMap['adContentId'];
        $userInfo->adContentName = $epgInfoMap['adContentName'];
        $userInfo->recSourceId = $epgInfoMap['recSourceId'];
        $userInfo->stbId = $epgInfoMap['stbId'];
        $userInfo->areaCode = $epgInfoMap['areaCode'];

        $payUrl = $this->_buildPayUrl($userInfo, $payInfo, $productInfo);

        $ret['result'] = 0;
        $ret['payUrl'] = $payUrl;

        return json_encode($ret);
    }


    //河南省电信订购接口，原来buildPayUrl接口是到江苏基地订购
    public function buildPayUrl_Province($payInfo = null)
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
            "orderUrl" => USER_ORDER_URL_PROVINCE,
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
            // 组装回调地址
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
            $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);
            $param = array(
                "userId" => $userId,
                "tradeNo" => $orderNoJson->order_id,
                "lmreason" => $payInfo['lmreason'] != null ? $payInfo['lmreason'] : 0,
                "lmcid" => MasterManager::getCarrierId(),
                "returnPageName" => $returnPageName,
                "isPlaying" => $isPlaying,
                "videoInfo" => $payInfo['videoInfo'],
                "userAccount" => $userAccount,
                "userToken" => $userToken
            );

            $callBackUrl = $this->_buildPayCallbackUrl($param);

            //$callBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, false);//生成回调地址
            $asyncCallBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, true);//生成回调地址
            $retArr["returnUrl"] = $callBackUrl;
            $retArr["notifyUrl"] = $asyncCallBackUrl;
            $waitEncodeArr = array(
                "orderId" => $orderNoJson->order_id,
                "itvAccount" => MasterManager::getAccountId(),
                "productId" => PRODUCT_ID_PROVINCE,
                "price" => PRODUCT_PRICE_PROVINCE
            );
            $retArr["orderInfo"] = urlencode($this->getEncodeCBCStrWithArr($waitEncodeArr));
            $retArr["result"] = 0;
        } else {
            LogUtils::error("request pay failed!!!=" . $orderNoJson->result);
        }
        LogUtils::info("buildPayUrl_province=" . json_encode($retArr));

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
        if($orderReason == 221){
            PayAPI::addUserPayUrl(urlencode($postPayUrl),$orderNoJson->order_id,1);
            $postPayUrl = $postPayUrl. "&lmTradeNo=". $orderNoJson->order_id;
        }
        LogUtils::info("payAutoUrl=" . $postPayUrl);
        return $postPayUrl;

    }

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
        HttpManager::httpRequest("post", ASYN_ORDER_CALLBACK, $orderInfo);//上报订购结果

        echo "success";
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
            . "&lmcid=" . CARRIER_ID
            . "&lmreason=" . $reason
            . "&transactionID=" . $orderId
            . $isPlayingStr
            . "&returnPageName=" . $returnPageName."&fromPage=" . $fromPage;
        if (!strpos($backUrl, "index.php")) {
            $backUrl .= "index.php";
        }
        $backUrl = $backUrl . $urlParam;
        LogUtils::info("getOurOrderCallback=" . $backUrl);
        return $backUrl;
    }


    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildUnPayUrl($payInfo = null)
    {
        // TODO: Implement buildUnPayUrl() method.
        return "";
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        // TODO: Implement directToPay() method.
        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->userId = $userId;
            $orderInfo->isJointActivity = isset($_GET['isJointActivity']) ? $_GET['isJointActivity'] : 0; // 是否联合活动发起订购
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['singlePayItem']) ? $_GET['singlePayItem'] : 1;
            $orderInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
            $orderInfo->orderType = 1;
        }

        if(MasterManager::getIsTestUser()){
            $orderInfo = json_encode($orderInfo);
            $payUrl = $this->buildPayUrl_Province(json_decode($orderInfo,true));
            header('Location:' . $payUrl);
            return;
        }


        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay410092::directToPay() ---> orderItems is empty");
            IntentManager::back();
            exit();
        }
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;
        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 生成订购单号失败
            LogUtils::info("Pay410092::directToPay() ---> 拉取订单失败:" . $tradeInfo->result);
            IntentManager::back();
            exit();
        }
        // 鉴权失败说明用户可订购， 构建订购地址
        $orderInfo->tradeId = $tradeInfo->order_id;

        // 订购的产品信息
        $productInfo = new \stdClass();
        $productInfo->productNo = productID_25;       // 产品编号
        $productInfo->productId = PRODUCT_ID_25;        // 使用包月产品
        $productInfo->price = $orderItems[0]->price;      // 价格
        $productInfo->PurchaseType = 0;                 // 包月自动续费
        $orderInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("Pay410092::buildPayUrl() ---> epgInfoMap: " . json_encode($epgInfoMap));

        // 通过缓存得到用户账号和token
        $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);

        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->adContentId = $epgInfoMap['adContentId'];
        $userInfo->adContentName = $epgInfoMap['adContentName'];
        $userInfo->recSourceId = $epgInfoMap['recSourceId'];
        $userInfo->stbId = $epgInfoMap['stbId'];
        $userInfo->areaCode = $epgInfoMap['areaCode'];

        $payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        if ($payUrl != null && $payUrl != "")
            header("Location:" . $payUrl);
        else {
            IntentManager::back();
        }
    }

    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {
        if ($payResultInfo == null) {
            LogUtils::info("Pay410092::payCallback ---> _GET: " . json_encode($_GET));
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = $_GET['userId'];
            $payResultInfo->tradeNo = $_GET['tradeNo'];
            $payResultInfo->lmreason = $_GET['lmreason'];
            $payResultInfo->returnPageName = isset($_GET['returnPageName']) && $_GET['returnPageName'] != null
                ? $_GET['returnPageName'] : "";
            $payResultInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $payResultInfo->videoInfo = isset($_GET['videoInfo']) && $_GET['videoInfo'] != ""
                ? urldecode($_GET['videoInfo']) : null;
        }

        // 上报订购信息
        $this->_uploadPayResult();

        if (($payResultInfo->lmreason != null && ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1))
            || ($payResultInfo->isIFramePay == 1)) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            LogUtils::info("Pay410092::payCallback() url:". $intentUrl);
            header("Location:" . $intentUrl);
            return;
        }

        // 判断用户是否是VIP，更新到session中
        $isVip = UserManager::isVip($payResultInfo->userId);
        // 如果是播放订购成功回来，则过去继续数据&& ($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        if ($isVip == 1 && $videoInfo != null) {
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
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     */
    public function unPayCallback($unPayResultInfo = null)
    {
        // TODO: Implement unPayCallback() method.
    }

    /**
     * 请求事务编号（sp编码(8位)+时间戳(yyyyMMddHHmmss 14位)+序号（18位自增））
     * @param $spId
     * @return string
     */
    private function _makeTransactionID($spId)
    {
        $timestamp = Date('Ymdhms'); // 20171130121108

        list($t1, $t2) = explode(' ', microtime());
        $millisecond = (float)sprintf('%.0f', (floatval($t1) + floatval($t2)) * 1000);

        $seq = $millisecond . rand(10000, 99999); // 151204603762814235
        $transactionId = $spId . $timestamp . $seq;
        LogUtils::info("Pay410092::makeTransactionID() ---> transactionId:" . $transactionId);
        return $transactionId;
    }

    /**
     * 生成订购信息
     * @param $userInfo
     * @param $payInfo
     * @param $productInfo
     * @return bool|string
     */
    private function _buildPayUrl($userInfo, $payInfo, $productInfo)
    {
        $userAccount = $userInfo->accountId;
        $userToken = $userInfo->userToken;
        $adContentId = $userInfo->adContentId;
        $adContentName = $userInfo->adContentName;
        $recSourceId = $userInfo->recSourceId;
        $stbId = $userInfo->stbId;
        $areaCode = $userInfo->areaCode;

        // 平台信息
        $platformType = MasterManager::getPlatformType();
        $faceType = $platformType == "hd" ? 5 : 6;

        // 组装回调地址
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeId,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId == null? MasterManager::getCarrierId() : $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "videoInfo" => $payInfo->videoInfo,
            "userAccount" => $userAccount,
            "userToken" => $userToken
        );

        $payCallbackUrl = $this->_buildPayCallbackUrl($param);

        // 组合INFO参数并加密
        $infoParam = array();
        $infoParam["userID"] = $userAccount;                            // 用户账号
        $infoParam["userToken"] = $userToken;                           // 用户Token
        $infoParam["areaId"] = substr($userAccount,1,3);   // 用户地区码
        $infoParam["authType"] = 1;                                     // 1 内容ID计费 2：product（服务）
        $infoParam["serviceID"] = $payInfo->isSinglePayItem == 1 ? SERVICE_ID_SINGLE : SERVICE_ID_GROUP;    // 服务Id
        $infoParam["optFlag"] = "EPG";                                  // 所属类型
        $infoParam["timeStamp"] = date("YmdHis", time());
        $infoParam["productID"] = $productInfo->productId;               // 产品编号
        $infoParam["price"] = $productInfo->price;                      // 价格
        $infoParam["PurchaseType"] = $productInfo->PurchaseType;        // 按月支付--自动续付
        LogUtils::info("Pay410092::_buildPayUrl() ---> infoParam: " . json_encode($infoParam));

        // 加密
        $infoCan = $this->_encryptPayInfo($infoParam);

        // payParam封装请求参数
        $payParam = array();
        $payParam["transactionID"] = rawurlencode($payInfo->tradeId);
        $payParam["SPID"] = rawurlencode(SPID);
        // 根据所选择的商品类型 -- 订购用途说明
        $payParam["orderDescription"] = rawurlencode(mb_convert_encoding("整包订购，自动续包月", 'GBK', 'utf-8'));
        $payParam["isAllowPointOrder"] = 0;                //是否允许积分订购
        $payParam["adContentId"] = rawurlencode($adContentId);        // 广告内容编码
        $payParam["adContentName"] = rawurlencode($adContentName);    // 广告内容名称
        $payParam["cdrtype"] = 1;                                                   // 订购来源
        $payParam["recSourceId"] = rawurlencode($recSourceId);        // 推荐入口来源编码
        $payParam["stbID"] = rawurlencode($stbId);                    // 设备Id
        $payParam["AREACODE"] = $areaCode;                           // areaCode
        $payParam["faceType"] = $faceType;                      // 分辨率
        $payParam["INFO"] = $infoCan;                                               // 产品详细
        $payParam["returnUrl"] = rawurlencode(mb_convert_encoding($payCallbackUrl, 'GBK', 'utf-8'));

        // 局方订购地址
        $payUrl = USER_ORDER_URL . "?"; // 统一鉴权接口
        foreach ($payParam as $key => $val) {
            $payUrl .= $key . "=" . $val . "&";
        }
        $payUrl = substr($payUrl, 0, -1);

        LogUtils::info("Pay410092::_buildPayUrl() ---> payUrl: " . $payUrl);
        return $payUrl;
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
        $intent->setParam("lmreason", $param['lmreason']);
        $intent->setParam("lmcid", $param['lmcid']);
        $intent->setParam("isPlaying", $param['isPlaying']);
        $intent->setParam("tradeNo", $param['tradeNo']);
        $intent->setParam("returnPageName", $param['returnPageName']);
        $intent->setParam("videoInfo", urlencode($param['videoInfo']));
        $intent->setParam("userAccount", $param['userAccount']);
        $intent->setParam("userToken", $param['userToken']);

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        LogUtils::info("Pay410092::_buildPayCallbackUrl()  payBackUrl: " . $url);
        return $url;
    }

    /**
     * 对订购参数进行加密
     * @param $infoParam
     * @return string
     */
    private function _encryptPayInfo($infoParam)
    {
        // 进行3des加密 base64加密
        $infoStr = "";
        foreach ($infoParam as $k => $v) {
            $infoStr .= $k . "=" . $v . "$";
        }
        $infoStr = substr($infoStr, 0, -1);
        $key = KEY_3DES;                                        // "SP0000011234567890123456";
        $infoCan = Crypt3DES::encode($infoStr, $key);
        $infoCan = mb_convert_encoding($infoCan, 'GBK', 'utf-8');          // GBK编码 url编码
        $infoCan = rawurlencode($infoCan);
        return $infoCan;
    }

    /**
     * 上报订购结果
     * @param null $payResultInfo
     * @return int|mixed
     * @throws \Think\Exception
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        if ($payResultInfo == null) {
            $payResultInfo = array(
                "transactionID" => isset($_GET['transactionID'])?$_GET['transactionID']:$_GET['tradeNo'],
                "description" => rawurldecode(mb_convert_encoding($_GET['description'], 'utf-8', 'GBK')),
                'result' => $_GET['result'],
                'purchaseType' => $_GET['purchaseType'],
                'expiredTime' => $_GET['expiredTime'],
                'subscriptionExtend' => $_GET['subscriptionExtend'],
                'subscriptionID' => $_GET['subscriptionID'],
                'productId' => $_GET['productId'],
                'abstract' => $_GET['abstract'],
                'reason' => $_GET['lmreason'],
                'carrierId' => isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID,
            );
        }
        
        LogUtils::info("_uploadPayResult ---> _GET: " . json_encode($_REQUEST));
        $tradeInfo = $_REQUEST["tradeInfo"];
        if(!empty($tradeInfo)){
            LogUtils::info("_uploadPayResult --->tradeInfo:" . json_encode($tradeInfo));
            $decodeStr = Crypt3DES::decodeCBC($tradeInfo, Encrypt_3DES, "01234567");
            LogUtils::info("_uploadPayResult --->decodeStr:" . $decodeStr);
            $decodeArr = explode("|", $decodeStr);
            $finalDecodeArr = array();
            foreach ($decodeArr as $val) {
                $tempArr = explode("=", $val);
                $finalDecodeArr[$tempArr[0]] = $tempArr[1];
            }
            if ($finalDecodeArr["beginDate"] < $finalDecodeArr["endDate"]) {  // 判断订购是否成功
                $payResultInfo['expiredTime'] = $finalDecodeArr['endDate'];
                $payResultInfo['purchaseType'] = 0;
                $payResultInfo['subscriptionExtend'] = $finalDecodeArr['autoRenew'] == 1?0:1;
                $payResultInfo['subscriptionID'] = $finalDecodeArr['orderId']; ;
                $payResultInfo['result'] = 0;
            } else {
                $payResultInfo['result'] = -1;
            }
        }

        LogUtils::info("Pay410092::_uploadPayResult() ---> payResultInfo: " . json_encode($payResultInfo));

        //局方返回9999，本地进行一次鉴权
        if($payResultInfo['result'] == 9999 || $payResultInfo['result'] == "9999"){
            $isvip = $this->authentication();
            LogUtils::info("Pay410092::_uploadPayResult() ---> isvip: " . $isvip);
            if ($isvip == 1){
                $payResultInfo['result'] = 0;
            }
        }

        $isvip = $this->authentication();
        LogUtils::info("Pay410092::_uploadPayResult() ---> isvip: " . $isvip);
        if ($payResultInfo['result'] == 0){
            if($isvip != 1){
                $payResultInfo['result'] = -1;
            }
        }

        if (!isset($payResultInfo['transactionID'])) {
            LogUtils::error("Pay410092::_uploadPayResult() ---> cannot find transactionID!!!!!!!");
            return 0;
        }

        // 判断订购是否成功
        if ($payResultInfo['result'] == 0 || $payResultInfo['result'] == 9304) {
            MasterManager::setUserIsVip(1);
            CookieManager::setCookie(CookieManager::$C_ORDER_RESULT, 1);
        } else {
            CookieManager::setCookie(CookieManager::$C_ORDER_RESULT, 0);
        }

        $result = PayAPI::postPayResultEx($payResultInfo);
        return $result;
    }

    /**
     * 查询用户订单详情
     * @param $userAccount 用户业务帐号
     * @param $userToken 用户token
     * @return  String
     */
    private function queryUserOrderDetail($userAccount, $userToken)
    {
        // 创建事物id
        $transactionId = $this->_makeTransactionID(SPID);

        //查询地址
        $selectUrl = USER_ORDER_QUERY . "?";
        $param = array();
        //事务编号和SPID号
        $param["transactionID"] = $transactionId;
        $param["SPID"] = SPID;
        //获取INFO参数
        $infoParam = array();
        $infoParam["userID"] = $userAccount;
        $infoParam["userToken"] = $userToken;
        $infoParam["timeStamp"] = date("YmdHis", time());
        //所属类型
        $infoParam["optFlag"] = "EPG";
        $infoParam["orderTransactionID"] = "";
        $infoStr = "";
        foreach ($infoParam as $k => $v) {
            $infoStr .= $k . "=" . $v . "$";
        }
        $infoStr = substr($infoStr, 0, -1);
        //进行3des加密 base64加密
        $infoCan = Crypt3DES::encode($infoStr, KEY_3DES);
        $infoCan = mb_convert_encoding($infoCan, 'GBK', 'utf-8');          // GBK编码 url编码
        $infoCan = rawurlencode($infoCan);

        $param["INFO"] = $infoCan;
        foreach ($param as $key => $val) {
            $selectUrl .= $key . "=" . $val . "&";
        }
        $selectUrl = substr($selectUrl, 0, -1);
        $respond = HttpManager::httpRequest("GET", $selectUrl, "");
        LogUtils::info("Pay410092::authentication ---> authUrl:" . $selectUrl);
        LogUtils::info("Pay410092::authentication ---> authResult:" . $respond);
        $respond = rawurldecode($respond);
        $respond = explode("&", $respond);

        foreach ($respond as $key => $val) {
            $val = explode("=", $val);
            $respond[$key] = $val;
        }
        return $respond;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo() {
        // 通过缓存得到用户账号和token
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);
        $adContentId = rawurlencode($epgInfoMap["adContentId"]);        // 广告内容编码
        $adContentName = rawurlencode($epgInfoMap["adContentName"]);    // 广告内容名称
        $recSourceId = rawurlencode($epgInfoMap["recSourceId"]);        // 推荐入口来源编码
        $stbId = rawurlencode($epgInfoMap["stbId"]);                    // 设备Id
        $areaCode = $epgInfoMap["areaCode"];                           // areaCode

        $info = array(
            'accountId' => $userAccount,
            'userToken' => $userToken,
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platformType' => MasterManager::getPlatformType(),

            'adContentId' => $adContentId,
            'adContentName' => $adContentName,
            'recSourceId' => $recSourceId,
            'stbId' => $stbId,
            'areaCode' => $areaCode,
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
            LogUtils::error("Pay410092::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay410092::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_25;       // 产品编号
            $productInfo->productId = PRODUCT_ID_25;        // 使用包月产品
            $productInfo->price = $orderItems[0]->price;      // 价格
            $productInfo->PurchaseType = 0;                 // 包月自动续费

            $orderInfo->tradeId = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        }
        LogUtils::info("webPagePay pay PayUrl: " . $payUrl);

        header("Location:" . $payUrl);
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl() {
        $info = $this->buildUserInfo();
        $userInfo = new \stdClass();
        $userInfo->accountId = $info["accountId"];
        $userInfo->userToken = $info["userToken"];
        $userInfo->adContentId = $info["adContentId"];
        $userInfo->adContentName = $info["adContentName"];
        $userInfo->recSourceId = $info["recSourceId"];
        $userInfo->stbId = $info["stbId"];

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
            LogUtils::error("Pay410092::buildDirectPayUrl ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        //跳转省订购接口
        if(MasterManager::getIsTestUser()){
            $orderInfo = json_encode($orderInfo);
            $payUrl = $this->buildPayUrl_Province(json_decode($orderInfo,true));
            return $payUrl;
        }

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay410092::buildDirectPayUrl pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_25;       // 产品编号
            $productInfo->productId = PRODUCT_ID_25;        // 使用包月产品
            $productInfo->price = $orderItems[0]->price;      // 价格
            $productInfo->PurchaseType = 0;                 // 包月自动续费

            $orderInfo->tradeId = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);
        // 跟上我方的订单号：
        if (!empty($payUrl)) {
            $payUrl = $payUrl . "&lmTradeNo=" . $tradeInfo->order_id;
            PayAPI::addUserPayUrl(urlencode($payUrl),$orderInfo->tradeId,1);
        }
        return $payUrl;
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
}