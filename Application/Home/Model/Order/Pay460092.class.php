<?php
/**
 * Created by longmaster
 * @Brief: 主要处理海南电信EPG的计费相关流程
 */

namespace Home\Model\Order;


use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Page\PageManager;

class Pay460092 extends PayAbstract
{

    /**
     * 用户到局方鉴权
     * @param $param
     * @return mixed
     */
    public function authentication($param = null){
        if (LOCATION_TEST) {
            return 1;//如果是本地测试，直接鉴权为vip用户
        }

        $isVip = 0;

        // 鉴权参数
        $param = array();
        $param['iptv'] = MasterManager::getAccountId();
        $param['channelId'] = CHANNEL_ID_V1;
        $param['productId'] = PRODUCT_ID_V1;
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth param:" . json_encode($param));

        $authUrl = USER_ORDER_QUERY_V1 . "?iptv=" . $param['iptv'] . "&channelId=" . $param['channelId'] . "&productId=" . $param['productId'];
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth authUrl:" . $authUrl);

        $respond = HttpManager::httpRequest("GET", $authUrl, "");
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth respond:" . $respond);

        // 判断是否vip
        $respond = json_decode($respond);
        if ($respond->code == 1 || $respond->code == 100 || $respond->code == 102 || $respond->code == 104) {
            $isVip = 1;
        }

        return $isVip;
    }

    /**
     * 构建到局方用户验证地址
     * @param $param
     * @return mixed
     */
    public function buildVerifyUserUrl($param = null){}

    /**
     * 我方订购页构建到局方的订购地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null){
        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );

        if ($payInfo == null || $payInfo == "" || !is_object($payInfo)) {
            LogUtils::error("buildPayUrlV1， 参数错误");
            return $ret;
        }
        $payInfo->orderType = 1;
        $payInfo->vipId = $payInfo->vip_id;
        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark, "", $payInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 创建失败
            $ret['result'] = $tradeInfo->result;
            return $ret;
        }
        $payInfo->tradeId = $tradeInfo->order_id;
        $payInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap =  MasterManager::getEPGInfoMap();

        // 通过缓存得到用户账号和token
        $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);

        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->adContentId = $epgInfoMap['adContentId'];
        $userInfo->adContentName = $epgInfoMap['adContentName'];
        $userInfo->recSourceId = $epgInfoMap['recSourceId'];
        $userInfo->stbId = $epgInfoMap['stbId'];

        $payUrl = $this->_buildPayUrl($userInfo, $payInfo);

        $ret['result'] = 0;
        $ret['payUrl'] = $payUrl;

        return json_encode($ret);
    }

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildUnPayUrl($payInfo = null){}

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null){
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
            LogUtils::error("Pay460092::directToPay() ---> orderItems is empty");
            IntentManager::back();
            exit();
        }
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;



        // 创建支付订单（办事处测试账号：3000003，针对账号单独测试时，如果后端是vip，则生成订单号会失败）
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 生成订购单号失败
            LogUtils::info("Pay460092::directToPay() ---> 拉取订单失败:" . $tradeInfo->result);
            IntentManager::back();
            exit();
        }

        // 鉴权失败说明用户可订购， 构建订购地址
        $orderInfo->tradeId = $tradeInfo->order_id;
        $orderInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap =  MasterManager::getEPGInfoMap();
        LogUtils::info("Pay460092::buildPayUrl() ---> epgInfoMap: " . json_encode($epgInfoMap));

        // 通过缓存得到用户账号和token
        $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);

        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->adContentId = $epgInfoMap['adContentId'];
        $userInfo->adContentName = $epgInfoMap['adContentName'];
        $userInfo->recSourceId = $epgInfoMap['recSourceId'];
        $userInfo->stbId = $epgInfoMap['stbId'];

        $payUrl = $this->_buildPayUrl($userInfo, $orderInfo);

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
    public function payCallback($payResultInfo = null){
        LogUtils::info("payCallbackV1 ---> _GET: " . json_encode($_GET));

        if ($_GET['result'] == 'SUCCESS') {  // 判断订购是否成功
            MasterManager::setUserIsVip(1);
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(1);
        }

        // 聚精彩内计费返回
        $userId = $_GET['userId'];
        $returnUrl = $_GET['returnUrl'];
        $isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;// 是否为正在播放引起的订购
        $lmReason = isset($_GET['lmreason']) ? $_GET['lmreason'] : 0;

        $arr = array(
            "jumpType" => 1,
            "jumpUrl" => ""
        );

        if ($lmReason == 2 || $lmReason == 1) {
            LogUtils::info("Pay460092::payCallback460092() ---> lmreason:" . $lmReason);
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
            $basePagePath = PageManager::getBasePagePath("player");
            $goPlayUrl = $basePagePath . "/userId/" . $userId . "/isPlaying/" . $isPlaying . "?returnUrl=" . $returnUrl;
            LogUtils::info("payCallback will go page =>: " . $goPlayUrl);
            $arr["jumpUrl"] = $goPlayUrl;
            $arr["jumpType"] = 2;
        } else {
            //去掉returnUrl的头部信息
            $headstr = substr($returnUrl, 0, 10);
            if ($headstr == "/index.php") {
                $returnUrl = substr($returnUrl, 10);
            }
            LogUtils::info("payCallback will go page =>: " . $returnUrl);
            $arr["jumpUrl"] = $returnUrl;
        }
        $jumpType = $arr["jumpType"];
        $jumpUrl = $arr["jumpUrl"];
        LogUtils::info("payCallback ---> jumpUrl: " . $jumpUrl . "---->jumpType" . $jumpType);

        if ($jumpType == 1) {
            IntentManager::back();
        } else {
            header('Location:' . $jumpUrl);
        }
        exit();
    }

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     */
    public function unPayCallback($unPayResultInfo = null){}


    /**
     * 生成订购信息
     * @param $userInfo
     * @param $payInfo
     * @return bool|string
     */
    private function _buildPayUrl($userInfo, $payInfo)
    {
        $userAccount = $userInfo->accountId;
        $userToken = $userInfo->userToken;

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

        $payCallbackUrl = $this->_buildPayCallbackUrlV1($param);

        // payParam封装请求参数
        $payParam = array();
        // 调起支付页面样例地址：http://10.255.53.244:8002/hainan_payEPG?channelId=39JK001&productId=productIDa30000000915&returnUrl=http://www.baidu.com&buyNumber=1&notifyParams=
        $payParam['channelId'] = CHANNEL_ID_V1;
        $payParam['productId'] = PRODUCT_ID_V1;
        $payParam['returnUrl'] = rawurlencode(mb_convert_encoding($payCallbackUrl, 'GBK', 'utf-8'));
        $payParam['buyNumber'] = 1;
        if (MasterManager::getPlatformType() == 'sd') {
            $payParam['clarity'] = 'SD';
        } else {
            $payParam['clarity'] = 'HD';
        }
        $payParam['notifyParams'] =
            'transactionID_' . rawurlencode(Crypt3DES::encodeCBC($payInfo->tradeId, KEY_3DES_V1, "01234567"))
            . '%26carrierId_' . rawurlencode(Crypt3DES::encodeCBC(MasterManager::getCarrierId(), KEY_3DES_V1, "01234567"))
            . '%26reason_' . rawurlencode(Crypt3DES::encodeCBC("0", KEY_3DES_V1, "01234567"));

        // 局方订购地址
        $userOrderUrl = USER_ORDER_URL_V1 . "?"; // 统一鉴权接口
        foreach ($payParam as $key => $val) {
            $userOrderUrl .= $key . "=" . $val . "&";
        }
        $payUrl = substr($userOrderUrl, 0, -1);

        LogUtils::info("Pay460092::_buildPayUrl() ---> payUrl: " . $payUrl);
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
        LogUtils::info("Pay460092::_buildPayCallbackUrl()  payBackUrl" . $url);
        return $url;
    }

    /**
     * 构建订购返回地址
     * @param null $param
     * @return string
     */
    private function _buildPayCallbackUrlV1($param = null)
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
        LogUtils::info("Pay460092::_buildPayCallbackUrlV1()  payBackUrl" . $url);
        return $url;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo() {
        // 通过缓存得到用户账号和token
        $epgInfoMap =  MasterManager::getEPGInfoMap();
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
            LogUtils::error("Pay460092::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay460092::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));

        if ($tradeInfo->result == 0) {
            $orderInfo->tradeId = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($userInfo, $orderInfo);
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
            LogUtils::error("Pay460092::buildDirectPayUrl ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay460092::buildDirectPayUrl pay ---> tradeInfo: " . json_encode($tradeInfo));

        if ($tradeInfo->result == 0) {
            $orderInfo->tradeId = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($userInfo, $orderInfo);
        }
        LogUtils::info("Pay460092::buildDirectPayUrl pay PayUrl: " . $payUrl);
        // 跟上我方的订单号：
        if (!empty($payUrl)) {
            $payUrl = $payUrl . "&lmTradeNo=" . $tradeInfo->order_id;
        }
       return $payUrl;
    }

    /**
     * 异步通知（这个接口，是发给局方配置的，然后给我们生成个通道ID：39JK001）
     * http://10.255.6.22:10302/index.php/Home/Pay/asyncCallBack
     * @throws \Think\Exception
     */
    public function asyncPayCallback()
    {
        LogUtils::info("asyncPayCallback ---> _GET: " . json_encode($_REQUEST));
        // transactionID的格式为：teEw1sNkmZ32xLL0fCzyog==&carrierId=0yh8Phv\/734=&reason=8GQVqRF59QA=、
        $notifyParams = rawurldecode($_GET['transactionID']);
        $transactionID_encrypt = explode('&', $notifyParams)[0];
        $carrierId_encrypt = explode('=', explode('&', $notifyParams)[1])[1];
        $reason_encrypt = explode('=', explode('&', $notifyParams)[2])[1];
        $orderInfo = array(
            "transactionID" => Crypt3DES::decodeCBC($transactionID_encrypt, KEY_3DES_V1, "01234567"),
            "carrierId" => Crypt3DES::decodeCBC($carrierId_encrypt, KEY_3DES_V1, "01234567"),
            "reason" => Crypt3DES::decodeCBC($reason_encrypt, KEY_3DES_V1, "01234567"),
            "operationType" => Crypt3DES::decodeCBC(rawurldecode($_GET['operationType']), KEY_3DES_V1, "01234567"),
            "startTime" => Crypt3DES::decodeCBC(rawurldecode($_GET['startTime']), KEY_3DES_V1, "01234567"),
            "endTime" => Crypt3DES::decodeCBC(rawurldecode($_GET['endTime']), KEY_3DES_V1, "01234567"),
            "orderId" => Crypt3DES::decodeCBC(rawurldecode($_GET['orderId']), KEY_3DES_V1, "01234567"),
            "contentId" => Crypt3DES::decodeCBC(rawurldecode($_GET['contentId']), KEY_3DES_V1, "01234567"),
            "prodId" => Crypt3DES::decodeCBC(rawurldecode($_GET['prodId']), KEY_3DES_V1, "01234567"),
            "userId" => Crypt3DES::decodeCBC(rawurldecode($_GET['userId']), KEY_3DES_V1, "01234567"),
        );
        LogUtils::info("asyncPayCallback --->orderInfo:" . json_encode($orderInfo));
        $result = HttpManager::httpRequest("post", ORDER_CALL_BACK_URL_V1, $orderInfo);//上报订购结果
        LogUtils::info("asyncPayCallback --->upload order result:" . json_encode($result));
        if ($orderInfo['operationType'] == 'ORDER') {  // 判断订购是否成功
            MasterManager::setUserIsVip(1);
        }
    }
}