<?php

namespace Home\Model\Order;

use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Page\PageManager;

class Pay450092 extends PayAbstract
{
    /**
     * 用户到局方鉴权
     * @param $param
     * @param string $productId
     * @return mixed
     */
    public function authentication($param = null,$productId = PRODUCT_ID_18)
    {
        if (LOCATION_TEST) {
            return 1;//如果是本地测试，直接鉴权为vip用户
        }

        $isVip = 0;
        $spId = isset($param['SPID']) ? $param['SPID'] : SPID_SMALL;
        $desKey = ($spId == SPID_SMALL) ? KEY_3DES : KEY_3DES_LARGE;
        $transId = $this->makeTransactionID($spId);

        //查询地址
        $selectUrl = USER_ORDER_QUERY . "?";
        $param = array();
        //事务编号和SPID号
        $param["transactionID"] = $transId;
        $param["SPID"] = $spId;
        //获取INFO参数
        $infoParam = array();
        $infoParam["userID"] = MasterManager::getAccountId();
        $infoParam["userToken"] = MasterManager::getUserToken();
        $infoParam["timeStamp"] = date("YmdHis", time());
        //所属类型
        $infoParam["optFlag"] = "VAS";
        $infoParam["orderTransactionID"] = "";
        $infoStr = "";
        foreach ($infoParam as $k => $v) {
            $infoStr .= $k . "=" . $v . "$";
        }
        $infoStr = substr($infoStr, 0, -1);
        //进行3des加密 base64加密
        $infoCan = Crypt3DES::encode($infoStr, $desKey);
        $infoCan = mb_convert_encoding($infoCan, 'GBK', 'utf-8');          // GBK编码 url编码
        $infoCan = rawurlencode($infoCan);

        $param["INFO"] = $infoCan;
        foreach ($param as $key => $val) {
            $selectUrl .= $key . "=" . $val . "&";
        }
        $selectUrl = substr($selectUrl, 0, -1);
        $respond = HttpManager::httpRequest("GET", $selectUrl, "");
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth url:" . $selectUrl);
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth respond:" . $respond);
        $respond = rawurldecode($respond);
        $respond = explode("&", $respond);

        foreach ($respond as $key => $val) {
            $val = explode("=", $val);
            $respond[$key] = $val;
        }

        $timestamp = Date('Ymdhms'); // 20171130121108

        if ($respond[1][0] == 0) {
            $result = json_decode($respond[2][1]);
            $count = count($result);
            for ($i = 0; $i < $count; $i++) {
                $expiredTime = $result[$i]->expiredTime;
                $productID = $result[$i]->productID;
                if ($productID == $productId
                    || $productID == PRODUCT_ID_OFFLINE
                    || $productID == PRODUCT_ID_OFFLINE_JIFEN
                    || $productID == PRODUCT_ID_LIFE_GX_OFF
                    || $productID == PRODUCT_ID_ENTERTAINING) {
                    // 判断失效时间
                    if (strcmp($expiredTime, $timestamp) >= 0) {
                        $isVip = 1;
                        break;
                    }
                }

                // 判断是否为线下生活包
                if ($spId == SPID_LARGE) {
                    if ($productID == PRODUCT_ID_25
                        || $productID == PRODUCT_ID_68
                        || $productID == PRODUCT_ID_120
                        || $productID == PRODUCT_ID_OFFLINE
                        || $productID == PRODUCT_ID_OFFLINE_JIFEN
                        || $productID == PRODUCT_ID_LIFE_GX_OFF
                        || $productID == PRODUCT_ID_ENTERTAINING) {
                        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth respond is offline order!");
                        // 线下生活包
                        if (strcmp($expiredTime, $timestamp) >= 0) {
                            $isVip = 1;
                            break;
                        }
                    }
                }
            }
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
    }

    /**
     * 我方订购页构建到局方的订购地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {
        LogUtils::error("buildPayUrl=====>payInf=" . json_encode($payInfo));

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
            return $ret;
        }
        // 鉴权失败说明用户可订购， 构建订购地址
        $payInfo->tradeId = $tradeInfo->order_id;

        // 订购的产品信息
        $productInfo = new \stdClass();
        //$productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
        $productInfo->productId = PRODUCT_ID_LIFE;        // 使用包月产品
        $productInfo->price = 1800;                     // 价格
        $productInfo->PurchaseType = 0;                 // 包月自动续费
        $payInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();

        // 通过缓存得到用户账号和token
        $userAccount = MasterManager::getAccountId();
        $userToken = MasterManager::getUserToken();

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
        $epgDefinition = $platformType == "hd" ? "1" : "2"; // 高清标识，1:高清 2：标清

        // 组装回调地址
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeId,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId == null? MasterManager::getCarrierId() : $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            // "videoInfo" => $payInfo->videoInfo,
            "userAccount" => $userAccount,
            "userToken" => $userToken
        );

        $payCallbackUrl = $this->_buildPayCallbackUrl($param);

        // 组合INFO参数并加密
        $infoParam = array();
        $infoParam["userID"] = $userAccount;                            // 用户账号
        $infoParam["userToken"] = $userToken;                           // 用户Token
        $infoParam["authType"] = 1;                                     // 1 内容ID计费 2：product（服务）
        $infoParam["contentID"] = CONTENT_ID;
        $infoParam["serviceID"] = SERVICE_ID_SINGLE;
        $infoParam["optFlag"] = "VAS";//所属类型
        $infoParam["timeStamp"] = date("YmdHis", time());
        $infoParam["productID"] = $productInfo->productId;               // 产品编号
        $infoParam["price"] = $productInfo->price;                      // 价格
        $infoParam["PurchaseType"] = $productInfo->PurchaseType;        // 按月支付--自动续付
        LogUtils::info("Pay450092::_buildPayUrl() ---> infoParam: " . json_encode($infoParam));

        // 加密
        $infoCan = $this->_encryptPayInfo($infoParam);

        // 服务鉴权的：
        //INFO = "userID=" + userID + "$userToken=" + userToken
        //    + "$authType=2$$serviceID=" + serviceID+ "$"
        //    + "$timeStamp=" + timeStamp + "$";
        //
        //
        //内容鉴权的：
        //	INFO = "userID=" + userID + "$userToken=" + userToken
        //        + "$authType=1$contentID=" + contentID+ "$$"
        //        + "$timeStamp=" + timeStamp + "$";

        // payParam封装请求参数
        $payParam = array();
        $payParam["transactionID"] = rawurlencode($payInfo->tradeId);
        $payParam["SPID"] = rawurlencode(SPID_LARGE);
        // 根据所选择的商品类型 -- 订购用途说明
        $payParam["orderDescription"] = rawurlencode(mb_convert_encoding("包月续订，按自然月计费，订购日的当月按实际天数计费。", 'GBK', 'utf-8'));
        $payParam["isAllowPointOrder"] = 1;                //是否允许积分订购
        $payParam["adContentId"] = rawurlencode($adContentId);        // 广告内容编码
        $payParam["adContentName"] = rawurlencode($adContentName);    // 广告内容名称
        $payParam["cdrtype"] = 1;                                                   // 订购来源
        $payParam["recSourceId"] = rawurlencode($recSourceId);        // 推荐入口来源编码
        $payParam["stbID"] = rawurlencode($stbId);                    // 设备Id
        $payParam["faceType"] = $faceType;                      // 分辨率
        $payParam["epgDefinition"] = $epgDefinition;           // 高清标识，1:高清 2：标清
        $payParam["INFO"] = $infoCan;                                               // 产品详细
        $payParam["returnUrl"] = rawurlencode(mb_convert_encoding($payCallbackUrl, 'GBK', 'utf-8'));

        // 局方订购地址
        $userOrderUrl = USER_ORDER_URL . "?"; // 统一鉴权接口
        foreach ($payParam as $key => $val) {
            $userOrderUrl .= $key . "=" . $val . "&";
        }
        $payUrl = substr($userOrderUrl, 0, -1);

        LogUtils::info("Pay450092::_buildPayUrl() ---> payUrl: " . $payUrl);
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
        //$intent->setParam("returnPageName", $param['returnPageName']);
        // $intent->setParam("videoInfo", urlencode($param['videoInfo']));
        //$intent->setParam("userAccount", $param['userAccount']);
        //$intent->setParam("userToken", $param['userToken']);

        $url = IntentManager::intentToURLV1($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        LogUtils::info("Pay450092::_buildPayCallbackUrl()  payBackUrl" . $url);
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
        $key = KEY_3DES_LARGE;                                        // "SP0000011234567890123456";
        $infoCan = Crypt3DES::encode($infoStr, $key);
        $infoCan = mb_convert_encoding($infoCan, 'GBK', 'utf-8');          // GBK编码 url编码
        $infoCan = rawurlencode($infoCan);
        return $infoCan;
    }

    /**
     * 对订购参数进行加密（小包使用）
     * @param $infoParam
     * @return string
     */
    private function _encryptPayInfoSmall($infoParam)
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
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        LogUtils::info("direct go pay!!!");

        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->userId = $userId;
            $orderInfo->isJointActivity = isset($_GET['isJointActivity']) ? $_GET['isJointActivity'] : 0; // 是否联合活动发起订购
            $orderInfo->contentId = isset($_GET['contentId']) ? $_GET['contentId'] : null;
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['singlePayItem']) ? $_GET['singlePayItem'] : 1;
            $orderInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
            $orderInfo->orderType = 1;
        }

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay450092::directToPay() ---> orderItems is empty");
            IntentManager::back();
            exit();
        }
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 生成订购单号失败
            LogUtils::info("Pay450092::directToPay() ---> 拉取订单失败:" . $tradeInfo->result);
            IntentManager::back();
            exit();
        }

        // 鉴权失败说明用户可订购， 构建订购地址
        $orderInfo->tradeId = $tradeInfo->order_id;

        // 订购的产品信息
        $productInfo = new \stdClass();
        //$productInfo->productNo = productID_18;       // 产品编号
        //$productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
        $productInfo->productId = PRODUCT_ID_LIFE;        // 使用包月产品
        $productInfo->price = 2500;                     // 价格
        $productInfo->PurchaseType = 0;                 // 包月自动续费
        $orderInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("Pay450092::buildPayUrl() ---> epgInfoMap: " . json_encode($epgInfoMap));

        // 通过缓存得到用户账号和token
        $userAccount = MasterManager::getAccountId();
        $userToken = MasterManager::getUserToken();

        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->adContentId = $epgInfoMap['adContentId'];
        $userInfo->adContentName = $epgInfoMap['adContentName'];
        $userInfo->recSourceId = $epgInfoMap['recSourceId'];
        $userInfo->stbId = $epgInfoMap['stbId'];

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
     */
    public function payCallback($payResultInfo = null)
    {
        LogUtils::info("payCallback450092 ---> _GET: " . json_encode($_GET));
        $data = $_GET['data'];

        //加载xml数据
        $xmlInfo = "<?xml version='1.0'?><document>" . $data . "</document>";
        $xmlObj = simplexml_load_string($xmlInfo);
        $xmlJsonObj = json_encode($xmlObj);
        $xmlData = json_decode($xmlJsonObj, true);

        $userId = isset($xmlData['userId']) ? $xmlData['userId']: MasterManager::getUserId();
        $returnPageName = isset($xmlData['returnPageName']) && $xmlData['returnPageName'] != null;
        $isPlaying = isset($xmlData['isPlaying']) ? $xmlData['isPlaying'] : 0;// 是否为正在播放引起的订购
        $lmReason = isset($xmlData['lmreason']) ? $xmlData['lmreason'] : 0;

        PayAPI::postPayResult($userId);

        if ($lmReason == 2 || $lmReason == 1) {
            LogUtils::info("Pay450092::payCallback450092() ---> lmreason:" . $lmReason);
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
            LogUtils::info("Pay450092::payCallback() ---> jump player!");
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $userId);
            $objPlayer->setParam("isPlaying", $isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        } else {
            LogUtils::info("Pay450092::payCallback() ---> jump returnPageName: " . $returnPageName);
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
    }

    // 请求事务编号（sp编码(8位)+时间戳(yyyyMMddHHmmss 14位)+序号（18位自增））
    private function makeTransactionID($spId)
    {
        $timestamp = Date('Ymdhms'); // 20171130121108

        list($t1, $t2) = explode(' ', microtime());
        $millisecond = (float)sprintf('%.0f', (floatval($t1) + floatval($t2)) * 1000);

        $seq = $millisecond . rand(10000, 99999); // 151204603762814235
        $transactionId = $spId . $timestamp . $seq;
        LogUtils::info("user >>>>>>>>>>>>makeTransactionID transactionId = " . $transactionId);
        return $transactionId;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo() {
        // 通过缓存得到用户账号和token
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = MasterManager::getAccountId();
        $userToken = MasterManager::getUserToken();
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
            LogUtils::error("Pay450092::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay450092::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_18;       // 产品编号
            //$productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
            $productInfo->productId = PRODUCT_ID_LIFE;        // 使用包月产品
            $productInfo->price = 2500;                     // 价格
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
        // 得到用户信息
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
            LogUtils::error("Pay450092::buildDirectPayUrl ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay450092::buildDirectPayUrl pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_18;       // 产品编号
            $productInfo->productId = PRODUCT_ID_LIFE;        // 使用包月产品
            //$productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
            $productInfo->price = 2500;                     // 价格
            $productInfo->PurchaseType = 0;                 // 包月自动续费

            $orderInfo->tradeId = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);
        // 跟上我方的订单号：
        if (!empty($payUrl)) {
            $payUrl = $payUrl . "&lmTradeNo=" . $tradeInfo->order_id;
        }
        PayAPI::addUserPayUrl(urlencode($payUrl),$tradeInfo->order_id,1);
        return $payUrl;
    }

    public function buildPointExchangeUrl($orderInfo = null) {
        $userId = MasterManager::getUserId();
        // 构建我方的应用订购信息
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->userId = $userId;
            $orderInfo->orderReason = 232;
            $orderInfo->remark = "login-jifen";
            $orderInfo->lmreason = 2;
        }

        $orderType = 1;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay450092::buildPointExchangeUrl() ---> orderItems is empty");
        }

        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[1]->vip_id;

        // 创建订单号
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
            $orderInfo->remark, $orderInfo->contentId, $orderType);
        if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
            LogUtils::info("Pay450092::buildPointExchangeUrl() ---> 拉取订单失败:" . $tradeInfo->result);
            return null;
        }
        $orderInfo->tradeNo = $tradeInfo->order_id;

        $param = array(
            "userId" => $orderInfo->userId,
            "tradeNo" => $orderInfo->tradeNo,
            "lmreason" => $orderInfo->lmreason != null ? $orderInfo->lmreason : 0,
            "lmcid" => CARRIER_ID,
            "isJiFen" => 1
        );
        LogUtils::info("Pay450092::buildPointExchangeUrl() ---> _buildPointExchangeUrl" );
        $url = $this->_buildPointExchangeUrl($param);

        PayAPI::addUserPayUrl(urlencode($url),$tradeInfo->order_id,2);
        return $url;
    }

    public function _buildPointExchangeUrl($param=null) {
        if ($param == null) {
            $param = array(
                "returnPageName" => "wait",
                "Result" => 'back',
            );
        }

        $pointExchangeUrl = null;

        $callbackUrl = $this->_buildPayCallbackUrl($param);

        // 组合INFO参数并加密
        $infoParam = array();
        $infoParam["userID"] = MasterManager::getAccountId();           // 用户账号
        $infoParam["userToken"] = MasterManager::getUserToken();        // 用户Token
        $infoParam["authType"] = 1;                                     // 1 内容ID计费 2：product（服务）
        $infoParam["contentID"] = "content0000000000000000000007895";
        $infoParam["serviceID"] = "";
        $infoParam["optFlag"] = "EDUCATION";//所属类型
        $infoParam["timeStamp"] = date("YmdHis", time());
        $infoParam["productID"] = "productIDa9j00000000000000001493";   // 产品编号
        $infoParam["notifyUrl"] = "http://113.12.94.35:6002/sp_order/notify";   // 产品编号
        LogUtils::info("Pay450092::_buildPayUrl() ---> infoParam: " . json_encode($infoParam));
        // 加密
        $infoCan = $this->_encryptPayInfoSmall($infoParam);
        $stbId = MasterManager::getSTBId();
        if (empty($stbId)) {
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $stbId = $epgInfoMap['stbId'];
        }

        // payParam封装请求参数
        // 平台信息
        $platformType = MasterManager::getPlatformType();
        $faceType = $platformType == "hd" ? 5 : 6;


        $payParam = array();
        $payParam["transactionID"] = rawurlencode($param['tradeNo']);//$param->tradeNo
        $payParam["SPID"] = rawurlencode(SPID_SMALL);
        $payParam["cdrtype"] = 0;                                     // 订购来源
        $payParam["recSourceId"] = "";        // 推荐入口来源编码
        $payParam["stbID"] = rawurlencode($stbId);                    // 设备Id
        $payParam["faceType"] = $faceType;                      // 分辨率
        $payParam["INFO"] = $infoCan;                                               // 产品详细
        $payParam["returnUrl"] = rawurlencode(mb_convert_encoding($callbackUrl, 'GBK', 'utf-8'));

        // 局方订购地址
        $userOrderUrl = "http://222.217.76.1:8296/UserOrder";
        $userOrderUrl = $userOrderUrl . "?"; // 统一鉴权接口
        foreach ($payParam as $key => $val) {
            $userOrderUrl .= $key . "=" . $val . "&";
        }
        $pointExchangeUrl = substr($userOrderUrl, 0, -1);

        LogUtils::info("############pointExchangeUrl: $pointExchangeUrl");
        return $pointExchangeUrl;
    }
}