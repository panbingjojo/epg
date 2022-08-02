<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2018/9/11 16:49                                               |
 * +----------------------------------------------------------------------+
 */

namespace Home\Model\Order;


use Home\Common\Tools\Crypt3DES;
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Page\PageManager;

class Pay610092 extends PayAbstract
{

    /**
     * 用户到局方鉴权
     * @param $param
     * @return mixed
     */
    public function authentication($param = null)
    {
        if(MasterManager::getAccountId() == "29056250374" ||
            MasterManager::getAccountId() == "29069415760" ||
            MasterManager::getAccountId() == "29017342523"
            ){
            return $this->authentication_new();
        }

        return 0;
    }

    public function authentication_new(){
        $isVip = 0;
        $TcpCont = new \stdClass();
        $ReqTime = date('YmdHis');
        $TcpCont->TransactionID = CHANNEL_ID.$ReqTime.rand(100,999).rand(10000000,99999999);
        $TcpCont->ReqTime = $ReqTime;
        $TcpCont->ServiceCode = "itv.order.useAuthor";
        $TcpCont->SrcSysID = CHANNEL_ID;
        $TcpCont->SrcSysSign = md5(CHANNEL_ID.$ReqTime.CHANNEL_KEY);
        $TcpCont->DstSysID = "108";

        $SvcCont = new \stdClass();
        //$SvcCont->PROD_ID = PRODUCT_ID_P8."|".PRODUCT_ID_P9."|".PRODUCT_ID_P10."|".PRODUCT_ID_P11."|".PRODUCT_ID_P12;
        $SvcCont->PROD_ID = PRODUCT_ID_TEST;
        $SvcCont->SYSTEM_CD = CHANNEL_ID;
        $SvcCont->ACC_NBR = MasterManager::getAccountId();

        $dataInfo = new \stdClass();
        $dataInfo->TcpCont = $TcpCont;
        $dataInfo->SvcCont = $SvcCont;

        LogUtils::info("authentication_new url:" . USER_ORDER_AUTH);
        LogUtils::info("authentication_new dataInfo:" . json_encode($dataInfo));
        $result = PayAPI::httpJsonPost(USER_ORDER_AUTH,json_encode($dataInfo));
        LogUtils::info("authentication_new result:" . $result);
        $result = json_decode($result);
        if($result->TcpCont->RspCode == "0"){
            $isVip = 1;
        }
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
        LogUtils::error("buildPayUrl=====>payInfo: " . json_encode($payInfo));
        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );

        if ($payInfo == null || $payInfo == "" || !is_object($payInfo)) {
            LogUtils::error("buildPayUrl， 参数错误");
            return $ret;
        }
        $payInfo->orderType = 1;

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark, "", $payInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 创建失败
            $ret['result'] = $tradeInfo->result;
            LogUtils::error("buildPayUrl， 获取订单号失败($tradeInfo->result)");
            return $ret;
        }
        // 鉴权失败说明用户可订购， 构建订购地址
        $payInfo->tradeId = $tradeInfo->order_id;

        // 订购的产品信息
        $productInfo = new \stdClass();
        $productInfo->productNo = productID_15;       // 产品编号
        $productInfo->productId = PRODUCT_ID_25;        // 使用包月产品
        $productInfo->price = 2500;                     // 价格
        $productInfo->PurchaseType = 0;                 // 包月自动续费
        $payInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("Pay610092::buildPayUrl() ---> epgInfoMap: " . json_encode($epgInfoMap));

        // 通过缓存得到用户账号和token
        $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);

        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->adContentId = $epgInfoMap['adContentId'];
        $userInfo->adContentName = $epgInfoMap['adContentName'];
        $userInfo->recSourceId = $epgInfoMap['recSourceId'];
        $userInfo->stbId = $epgInfoMap['stbId'];

        $payUrl = $this->_buildPayUrl($userInfo, $payInfo, $productInfo);

        $ret['result'] = 0;
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
        // TODO: Implement buildUnPayUrl() method.
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        LogUtils::info("Pay610092 --> direct go pay!!!");
        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->isJointActivity = isset($_GET['isJointActivity']) ? $_GET['isJointActivity'] : 0; // 是否联合活动发起订购
            $orderInfo->contentId = isset($_GET['contentId']) ? $_GET['contentId'] : "99100000012020032714561207421305";
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['singlePayItem']) ? $_GET['singlePayItem'] : 1;
            $orderInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
            $orderInfo->orderType = 1;
            $orderInfo->userId = $userId;
        }

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay610092::directToPay() ---> orderItems is empty");
            IntentManager::back();
            exit();
        }
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 生成订购单号失败
            LogUtils::info("Pay610092::directToPay() ---> 拉取订单失败:" . $tradeInfo->result);
            IntentManager::back();
            exit();
        }
        // 鉴权失败说明用户可订购， 构建订购地址
        $orderInfo->tradeId = $tradeInfo->order_id;

        // 订购的产品信息
        $productInfo = new \stdClass();
//        $productInfo->productNo = productID_15;       // 产品编号
        $productInfo->productId = PRODUCT_ID_25;        // 使用包月产品
        $productInfo->price = 2500;                     // 价格
        $productInfo->PurchaseType = 0;                 // 包月自动续费
        $orderInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("Pay610092::buildPayUrl() ---> epgInfoMap: " . json_encode($epgInfoMap));

        // 通过缓存得到用户账号和token
        $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);

        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->adContentId = $epgInfoMap['adContentId'];
        $userInfo->adContentName = $epgInfoMap['adContentName'];
        $userInfo->recSourceId = $epgInfoMap['recSourceId'];
        $userInfo->stbId = $epgInfoMap['stbId'];

        $payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        if ($payUrl != null && $payUrl != "") {
            header("Location:" . $payUrl);
        } else {
            IntentManager::back();
        }
    }

    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     */
    public function payCallback($payResultInfo = null)
    {
        $str = '';
        foreach ($_GET as $k => $v) {
            $str = $str . $k . '=' . $v . '&';
        }
        $str = rtrim($str, '&');
        LogUtils::info("callback610092UI ---> _GET: " . $str);

        $userId = $_GET['userId'];
        $returnPageName = $_GET['returnPageName'];
        $isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;// 是否为正在播放引起的订购
        $lmReason = isset($_GET['lmreason']) ? $_GET['lmreason'] : 0;

        // 把订购是否成功的结果写入cookie，供页面使用
        $result = $_GET['result']; // 订购成功标志 成功-[0 | 9304] 失败-[其它]
        MasterManager::setOrderResult($result == 0 || $result == 9304 ? 1 : 0);

        PayAPI::postPayResult($userId);

        if ($lmReason == 2 || $lmReason == 1) {
            LogUtils::info("Pay610092::payCallback610092() ---> lmreason:" . $lmReason);
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            header('Location:' . $returnUrl);
            return;
        }

        $isVip = MasterManager::getUserIsVip();
        if (($isVip == 1) && ($isPlaying == 1)) {
            LogUtils::info("Pay610092::payCallback() ---> jump player!");
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $userId);
            $objPlayer->setParam("isPlaying", $isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        } else {
            LogUtils::info("Pay610092::payCallback() ---> jump returnPageName: " . $returnPageName);
            IntentManager::back($returnPageName);
        }
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

        // 平台信息
        $platformType = MasterManager::getPlatformType();
        $faceType = $platformType == "hd" ? 5 : 6;

        // 组装回调地址
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeId,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId == null ? MasterManager::getCarrierId() : $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "videoInfo" => $payInfo->videoInfo,
            "userAccount" => $userAccount,
            "userToken" => $userToken
        );
        $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        $this->savePlayerProgress(json_encode($videoInfo));
        $videoUrl = $videoInfo["videoUrl"] ? $videoInfo["videoUrl"] : "99100000012020032714561207421305";
        $payCallbackUrl = $this->_buildPayCallbackUrl($param);

        // 组合INFO参数并加密
        $infoParam = array();
        $infoParam["userID"] = $userAccount;                            // 用户账号
        $infoParam["userToken"] = $userToken;                           // 用户Token
        $infoParam["authType"] = 1;                                     // 1 内容ID计费 2：product（服务）
        $infoParam["serviceID"] = SERVICE_ID_SINGLE;    // 服务Id
        $infoParam["optFlag"] = "EPG";                                  // 所属类型
        $infoParam["contentID"] = $videoUrl;                                  // 所属类型
        $infoParam["timeStamp"] = date("YmdHis", time());
        $infoParam["productID"] = $productInfo->productId;               // 产品编号
//        $infoParam["price"] = $productInfo->price;                      // 价格
        $infoParam["PurchaseType"] = $productInfo->PurchaseType;        // 按月支付--自动续付
        LogUtils::info("Pay610092::_buildPayUrl() ---> infoParam: " . json_encode($infoParam));

        // 加密
        $infoCan = $this->_encryptPayInfo($infoParam);

        // payParam封装请求参数
        $payParam = array();
        $payParam["transactionID"] = rawurlencode($payInfo->tradeId);
        $payParam["SPID"] = rawurlencode(SPID);
        // 根据所选择的商品类型 -- 订购用途说明
//        $payParam["orderDescription"] = rawurlencode(mb_convert_encoding("订购后有效期30天，自动续包月", 'GBK', 'utf-8'));

//        $payParam["isAllowPointOrder"] = 1;                //是否允许积分订购
        $payParam["adContentId"] = rawurlencode($adContentId);        // 广告内容编码
        $payParam["adContentName"] = rawurlencode($adContentName);    // 广告内容名称
        $payParam["cdrtype"] = 1;                                                   // 订购来源
        $payParam["recSourceId"] = rawurlencode($recSourceId);        // 推荐入口来源编码
        $payParam["stbID"] = rawurlencode($stbId);                    // 设备Id
        $payParam["faceType"] = $faceType;                      // 分辨率
        $payParam["INFO"] = $infoCan;                                               // 产品详细
        $payParam["returnUrl"] = rawurlencode(mb_convert_encoding($payCallbackUrl, 'GBK', 'utf-8'));

        // 局方订购地址
        $payUrl = USER_ORDER_URL . "?"; // 统一鉴权接口
        foreach ($payParam as $key => $val) {
            $payUrl .= $key . "=" . $val . "&";
        }
        $payUrl = substr($payUrl, 0, -1);

        LogUtils::info("Pay610092::_buildPayUrl() ---> payUrl: " . $payUrl);
        return $payUrl;
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
        LogUtils::info("Pay610092::_buildPayCallbackUrl()  payBackUrl" . $url);
        return $url;
    }


    // 请求事务编号（sp编码(8位)+时间戳(yyyyMMddHHmmss 14位)+序号（18位自增））
    private static function makeTransactionID($spId)
    {
        $timestamp = Date('Ymdhms'); // 20171130121108

        list($t1, $t2) = explode(' ', microtime());
        $millisecond = (float)sprintf('%.0f', (floatval($t1) + floatval($t2)) * 1000);

        $seq = $millisecond . rand(10000, 99999); // 151204603762814235
        $transactionId = $spId . $timestamp . $seq;
        LogUtils::info(">>>>>>>>>>>>makeTransactionID transactionId = " . $transactionId);
        return $transactionId;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
        // 通过缓存得到用户账号和token
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);
        $adContentId = rawurlencode($epgInfoMap["adContentId"]);        // 广告内容编码
        $adContentName = rawurlencode($epgInfoMap["adContentName"]);    // 广告内容名称
        $recSourceId = rawurlencode($epgInfoMap["recSourceId"]);        // 推荐入口来源编码
        $stbId = rawurlencode($epgInfoMap["stbId"]);                    // 设备Id

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
            LogUtils::error("Pay610092::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay610092::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_15;       // 产品编号
            $productInfo->productId = PRODUCT_ID_25;        // 使用包月产品
            $productInfo->price = 2500;                     // 价格
            $productInfo->PurchaseType = 0;                 // 包月自动续费

            $orderInfo->tradeId = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        }
        LogUtils::info("webPagePay pay PayUrl: " . $payUrl);

        header("Location:" . $payUrl);
    }

    /**
     * 保存用户播放进度
     */

    public function savePlayerProgress($videoInfo)
    {
        $key = "EPG-LWS-LATEST-VIDEOINFO-" . MasterManager::getCarrierId() . "-" . MasterManager::getUserId();
        $retStoreData =ActivityManager::saveStoreData($key, $videoInfo);
        return $retStoreData;
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
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->lmreason = 2;
        $orderInfo->orderType = 0;

        // 构建用户信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);
        $adContentId = rawurlencode($epgInfoMap["adContentId"]);        // 广告内容编码
        $adContentName = rawurlencode($epgInfoMap["adContentName"]);    // 广告内容名称
        $recSourceId = rawurlencode($epgInfoMap["recSourceId"]);        // 推荐入口来源编码
        $stbId = rawurlencode($epgInfoMap["stbId"]);                    // 设备Id

        $userInfo = new \stdClass();
        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->adContentId = $adContentId;
        $userInfo->adContentName = $adContentName;
        $userInfo->recSourceId = $recSourceId;
        $userInfo->stbId = $stbId;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay610092::buildDirectPayUrl ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay610092::buildDirectPayUrl pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_15;       // 产品编号
            $productInfo->productId = PRODUCT_ID_25;        // 使用包月产品
            $productInfo->price = 2500;                     // 价格
            $productInfo->PurchaseType = 0;                 // 包月自动续费

            $orderInfo->tradeId = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);
        // 跟上我方的订单号：
        if (!empty($payUrl)) {
            $payUrl = $payUrl . "&lmTradeNo=" . $tradeInfo->order_id;
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $payUrl = $payUrl . "&pwd=";
            if(is_numeric($epgInfoMap['password'])){
                $payUrl = $payUrl. $epgInfoMap['password'];
            }
        }
        return $payUrl;
    }

    /**
     * 订购结果会回调
     * @param: null $payResultInfo
     */
    public function uploadPayResult($payResultInfo = null){
        $result = -1;
        $isUploadResult = $this->_uploadPayResult($payResultInfo);
        if ($isUploadResult) $result = 0;
        MasterManager::setVIPUser(1); // 当前用户设置VIP
        return json_encode(array("result" => $result));
    }

    private function _uploadPayResult($payResultInfo = null)
    {
        $payResultInfo = array(
            'tradeNo' => $payResultInfo->TradeNo,
            'accountId'=>MasterManager::getAccountId(),
            'accNbr' => MasterManager::getAccountId(),
            'itvCode' => '39jk',
            'opType' => 0,//0：订购 1：退订
            'prodId' => PRODUCT_ID_25,
            'prodName' => $payResultInfo->productName,
            'offerId' => $payResultInfo->commit,
            'isAutoRenew' => 'Y',
            'orderEffDate' => date('Y-m-d H:i:s'),
            'orderExpDate' => '2099-01-01',
            'transactionID' => $payResultInfo->TradeNo,
            'orderSuccess' => 0,
        );

        $payResultInfo['carrierId'] = isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID;
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $uploadPayResult = PayAPI::postPayResultEx($payResultInfo);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
    }
}