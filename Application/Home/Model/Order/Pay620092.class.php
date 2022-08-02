<?php
/**
 * Created by longmaster
 * @Brief: 主要处理湖北电信EPG的计费相关流程
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
use Home\Model\User\UserManager;


class Pay620092 extends PayAbstract
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
        $userToken = $epgInfoMap["userToken"];

        // 查询订单详细
        $respond = $this->queryUserOrderDetail($userAccount, $userToken);

        $timestamp = Date('Ymdhms'); // 20171130121108

        if ($respond[1][0] == 0) {
            $result = json_decode($respond[2][1]);
            $count = count($result);
            for ($i = 0; $i < $count; $i++) {
                $expiredTime = $result[$i]->expiredTime;
                $productID = $result[$i]->productID;
                if ($productID == PRODUCT_ID_18) {
                    // 判断失效时间
                    if (strcmp($expiredTime, $timestamp) >= 0) {
                        $isVip = 1;
                        break;
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
        $productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
        $productInfo->price = 2000;                     // 价格
        $productInfo->PurchaseType = 1;                 // 包月自动续费
        $payInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();

        // 通过缓存得到用户账号和token
        $userAccount = MasterManager::getAccountId();
        $userToken = $epgInfoMap["userToken"];

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
        return "";
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->isJointActivity = isset($_GET['isJointActivity']) ? $_GET['isJointActivity'] : 0; // 是否联合活动发起订购
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->contentId = isset($_GET['contentId']) ? $_GET['contentId'] : null;
            $orderInfo->isIFramePay = isset($_GET['isIFramePay']) ? $_GET['isIFramePay'] : 0;
            $orderInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['singlePayItem']) ? $_GET['singlePayItem'] : 1;
            $orderInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
            $orderInfo->orderType = 1;
        }

        // 得到视频ID作为contentID
        $videoInfo = $orderInfo->videoInfo == null || empty($orderInfo->videoInfo) ?
            MasterManager::getPlayParams() : json_decode($orderInfo->videoInfo, true);
        $orderInfo->contentId = $videoInfo['videoUrl'];

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay620092::directToPay() ---> orderItems is empty");
            IntentManager::back();
            exit();
        }
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 生成订购单号失败
            LogUtils::info("Pay620092::directToPay() ---> 拉取订单失败:" . $tradeInfo->result);
            IntentManager::back();
            exit();
        }

        // 鉴权失败说明用户可订购， 构建订购地址
        $orderInfo->tradeId = $tradeInfo->order_id;

        // 订购的产品信息
        $productInfo = new \stdClass();
        $productInfo->productNo = productID_18;       // 产品编号
        $productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
        $productInfo->price = 2000;                     // 价格
        $productInfo->PurchaseType = 1;                 // 包月自动续费
        $orderInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("Pay620092::buildPayUrl() ---> epgInfoMap: " . json_encode($epgInfoMap));

        // 通过缓存得到用户账号和token
        $userAccount = MasterManager::getAccountId();
        $userToken = $epgInfoMap["userToken"];

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
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {
        // TODO: Implement payCallback() method.
        if ($payResultInfo == null) {
            LogUtils::info("Pay620092::payCallback ---> _GET: " . json_encode($_GET));
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = $_GET['userId'];
            $payResultInfo->tradeNo = $_GET['tradeNo'];
            $payResultInfo->lmreason = $_GET['lmreason'];
            $payResultInfo->returnPageName = isset($_GET['returnPageName']) && $_GET['returnPageName'] != null
                ? $_GET['returnPageName'] : "";
            $payResultInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $payResultInfo->isIFramePay = isset($_GET['isIFramePay']) ? $_GET['isIFramePay'] : 0;
            $payResultInfo->videoInfo = isset($_GET['videoInfo']) && $_GET['videoInfo'] != ""
                ? urldecode($_GET['videoInfo']) : null;
        }

        // 上报订购信息
        $this->_uploadPayResult();

        // 判断用户是否是VIP，更新到session中
        $isVip = UserManager::isVip($payResultInfo->userId);
        // 如果是播放订购成功回来，则过去继续数据&& ($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        if ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1 || ($payResultInfo->isIFramePay == 1)) {
            LogUtils::info("Pay620092::payCallback620092() ---> lmreason:" . $payResultInfo->lmreason);
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            header('Location:' . $returnUrl);
            return;
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
        LogUtils::info("Pay620092::makeTransactionID() ---> transactionId:" . $transactionId);
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

        // 平台信息
        $platformType = MasterManager::getPlatformType();
        $faceType = $platformType == "hd" ? 5 : 6;
        $epgDefinition = $platformType == "hd" ? "1" : "0"; // 高清标识，1:高清 0：标清

        // 组装回调地址
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeId,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId == null? MasterManager::getCarrierId() : $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "isIFramePay" => $payInfo->isIFramePay,        // 是否通过iframe加载订购页面(0--不是, 1--是)
            "videoInfo" => $payInfo->videoInfo,
            "userAccount" => $userAccount,
            "userToken" => $userToken
        );

        $payCallbackUrl = $this->_buildPayCallbackUrl($param);

        // 如果没有得到contentId，暂时由控制器自动获取
        if ($payInfo->contentId == null || empty($payInfo->contentId)) {
            $payInfo->contentId = $this->queryVideoContentId();
        }

        // 组合INFO参数并加密
        $infoParam = array();
        $infoParam["userID"] = $userAccount;                            // 用户账号
        $infoParam["userToken"] = $userToken;                           // 用户Token
        $infoParam["authType"] = 1;                                     // 1 内容ID计费 2：product（服务）
        $infoParam["optFlag"] = "EPG";                                  // 所属类型
        $infoParam["timeStamp"] = date("YmdHis", time());
        $infoParam["productID"] = $productInfo->productId;               // 产品编号
        $infoParam["price"] = $productInfo->price;                      // 价格
        $infoParam["PurchaseType"] = $productInfo->PurchaseType;        // 按月支付--自动续付
        $infoParam["contentID"] = $payInfo->contentId;
        LogUtils::info("Pay620092::_buildPayUrl() ---> infoParam: " . json_encode($infoParam));

        // 加密
        $infoCan = $this->_encryptPayInfo($infoParam);

        // payParam封装请求参数
        $payParam = array();
        $payParam["transactionID"] = rawurlencode($payInfo->tradeId);
        $payParam["SPID"] = rawurlencode(SPID);
        // 根据所选择的商品类型 -- 订购用途说明
        $payParam["orderDescription"] = $productInfo->productId == PRODUCT_ID_18 ?
            rawurlencode(mb_convert_encoding("整包订购，自动续包月", 'GBK', 'utf-8')) : rawurlencode(mb_convert_encoding("订购即生效，有效期内可无限次使用", 'GBK', 'utf-8'));
        $payParam["isAllowPointOrder"] = 0;                //是否允许积分订购
        $payParam["adContentId"] = rawurlencode($adContentId);        // 广告内容编码
        $payParam["adContentName"] = rawurlencode($adContentName);    // 广告内容名称
        $payParam["cdrtype"] = 1;                                                   // 订购来源
        $payParam["recSourceId"] = rawurlencode($recSourceId);        // 推荐入口来源编码
        $payParam["stbID"] = rawurlencode($stbId);                    // 设备Id
        $payParam["faceType"] = $faceType;                      // 分辨率
        $payParam["epgDefinition"] = $epgDefinition;           // 高清标识，1:高清 0：标清
        $payParam["INFO"] = $infoCan;                                               // 产品详细
        $payParam["returnUrl"] = rawurlencode(mb_convert_encoding($payCallbackUrl, 'GBK', 'utf-8'));

        // 测试订购地址用
        if( false && $userAccount == 'itv093118454714'){
            // 局方订购地址-测试用
            $payUrl = USER_ORDER_URL_CESI . "?"; // 统一鉴权接口
        }else{
            // 局方订购地址
            $payUrl = USER_ORDER_URL . "?"; // 统一鉴权接口
        };

        foreach ($payParam as $key => $val) {
            $payUrl .= $key . "=" . $val . "&";
        }
        $payUrl = substr($payUrl, 0, -1);

        LogUtils::info("Pay620092::_buildPayUrl() ---> payUrl: " . $payUrl);
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
        $intent->setParam("isIFramePay", $param['isIFramePay']);
        $intent->setParam("tradeNo", $param['tradeNo']);
        $intent->setParam("returnPageName", $param['returnPageName']);
        $intent->setParam("videoInfo", urlencode($param['videoInfo']));
        $intent->setParam("userAccount", $param['userAccount']);
        $intent->setParam("userToken", $param['userToken']);

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        LogUtils::info("Pay620092::_buildPayCallbackUrl()  payBackUrl: " . $url);
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
                "transactionID" => $_GET['transactionID'],
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

        LogUtils::info("Pay620092::_uploadPayResult() ---> payResultInfo: " . json_encode($payResultInfo));

        if (!isset($payResultInfo['transactionID'])) {
            LogUtils::error("Pay620092::_uploadPayResult() ---> cannot find transactionID!!!!!!!");
            return 0;
        }

        // 判断订购是否成功
        if ($payResultInfo['result'] == 0 || $payResultInfo['result'] == 9304) {
            MasterManager::setUserIsVip(1);
            MasterManager::setOrderResult(1);
        } else {
            MasterManager::setOrderResult(0);
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
        LogUtils::info("Pay620092::authentication url --->: " . $selectUrl);
        $respond = HttpManager::httpRequest("GET", $selectUrl, "");
        LogUtils::info("Pay620092::authentication ---> authResult:" . $respond);
        $respond = rawurldecode($respond);
        $respond = explode("&", $respond);

        foreach ($respond as $key => $val) {
            $val = explode("=", $val);
            $respond[$key] = $val;
        }
        return $respond;
    }

    /**
     * @Brief:此函数用于根据用户的来源查询contentId
     *         如果用户是从专辑推荐位过来，就取专辑的视频；
     *         如果用户从其它推荐位过来，就取首页轮播的视频；
     * @return string : contentId内容id
     */
    private function queryVideoContentId()
    {
        $userFrom = MasterManager::getUserFromType();
        $lmSubId = MasterManager::getSubId();
        $platformType = MasterManager::getPlatformType();  //平台类型

        if ($userFrom == 1 && $lmSubId != null) {
            // 来自于专辑推荐位
            $contentId = AlbumAPI::getRandomContentIdByAlbum($platformType, $lmSubId);
            LogUtils::info("get content id [$contentId] from $lmSubId");
        } else {
            // 来自非专辑---就取首页轮播上的视频
            $contentId = MainHomeManager::getRandomContentIdByPollVideo();
            LogUtils::info("get content id [$contentId] poll video");
        }

        return $contentId;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo() {
        // 得到一个视频ID作为contentId
        $contentId = $this->queryVideoContentId();

        // 通过缓存得到用户账号和token
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = MasterManager::getAccountId();
        $userToken = $epgInfoMap["userToken"];
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
            "contentId" => $contentId,

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
        $orderInfo->isIFramePay = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->lmreason = 1;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay620092::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay620092::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_18;       // 产品编号
            $productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
            $productInfo->price = 2000;                     // 价格
            $productInfo->PurchaseType = 1;                 // 包月自动续费

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
        $payUrl = "";

        // 得到用户信息
        $info = $this->buildUserInfo();
        $userInfo = new \stdClass();
        $userInfo->accountId = $info["accountId"];
        $userInfo->userToken = $info["userToken"];
        $userInfo->adContentId = $info["adContentId"];
        $userInfo->adContentName = $info["adContentName"];
        $userInfo->recSourceId = $info["recSourceId"];
        $userInfo->stbId = $info["stbId"];

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
            LogUtils::error("Pay620092::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay620092::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_18;         // 产品编号
            $productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
            $productInfo->price = 2000;                     // 价格
            $productInfo->PurchaseType = 1;                 // 包月自动续费

            $orderInfo->tradeId = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);
        // 跟上我方的订单号：
        if (!empty($payUrl)) {
            $payUrl = $payUrl . "&lmTradeNo=" . $tradeInfo->order_id;
        }
        return $payUrl;
    }
}