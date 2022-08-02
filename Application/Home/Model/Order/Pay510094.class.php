<?php

namespace Home\Model\Order;


use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;
use Home\Model\Page\PageManager;
use Home\Model\Video\VideoManager;

class Pay510094 extends PayAbstract
{
    /**
     * 到局方鉴权，只有包月产品才能鉴权。
     * @param
     * @return mixed
     * @throws \Think\Exception
     */
    public function authentication($param = null)
    {
        if (LOCATION_TEST) {
            return 1;//如果是本地测试，直接鉴权为vip用户
        }

        $isVip = 0;
        $epgInfoMap = MasterManager::getEPGInfoMap();
        //查询地址
        $selectUrl = USER_ORDER_QUERY . "?";
        $infoParma = array();
        $infoParma["USER_ID"] = $epgInfoMap["userId"];
        $videoInfos = VideoManager::getRecommennd(MasterManager::getUserId(), 0);
        $ftp_url = $videoInfos->data[0]->ftp_url;
        if (strpos($ftp_url, "{") !== false) {
            $ftp_url = json_decode($ftp_url, true);
            if ($ftp_url['gq_ftp_url']) {
                $ftp_url = $ftp_url['gq_ftp_url'];
            }
        }
        $infoParma["ContentCode"] = $ftp_url;
        $infoParma["ProductBillingCode"] = productID_25 . ',' . productID_200 . ',' . productID_half_year_158 . ',' . productID_quarter_79;
        $infoParma["Time_Stamp"] = date("YmdHis", time());
        $infoParma["TOKEN"] = md5($infoParma["USER_ID"] . $infoParma["ContentCode"] . $infoParma["Time_Stamp"]);
        $infoParma["ContentName"] = urlencode(urlencode($videoInfos->data[0]->title));
        $infoParma["PicUrl"] = RESOURCES_URL . $videoInfos->data[0]->image_url;

        $selectUrl = $selectUrl . http_build_query($infoParma);
        LogUtils::info("userAuth request =>: " . $selectUrl);
        $respond = HttpManager::httpRequest("GET", $selectUrl, "");
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth respond:" . $respond);
        $respond = json_decode($respond, true);
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth RST_CODE:" . $respond["RST_CODE"]);
        if ($respond["RST_CODE"] == "0" || $respond["RST_CODE"] == "2") {
            $isVip = 1;
        } else if ($respond["RST_CODE"] == "1") {
            $epgInfoMap['productUrl'] = $respond["productUrl"];
            LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth productUrl:" . $epgInfoMap['productUrl']);
            MasterManager::setEPGInfoMap($epgInfoMap);
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
     * 构建自动上报订购地址
     * @param null $orderInfo
     * @return mixed
     */
    public function buildAutoPayUrl($orderInfo = null)
    {
        $userOrderUrl = null;
        $userId = MasterManager::getUserId();
        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("user [" . $userId . "]===orderItem is empty");
            return $userOrderUrl;
        }

        $vipId = $orderItems[0]->vip_id;

        $orderNoJson = OrderManager::createPayTradeNo($vipId, 220, "login"); // 向CWS获取订单号
        LogUtils::info("user [" . $userId . "] request transactionID --> result:" . $orderNoJson->order_id);
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->isPlaying = 0;
            $orderInfo->lmreason = 0;
            $orderInfo->TradeNo = $orderNoJson->order_id;
            $orderInfo->returnUrl = null;
        }
        if ($orderNoJson->result == "0") {
            // 获取订单号成功，去生成局方的订购url
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $orderInfo->productUrl = $epgInfoMap['productUrl'];
            $userOrderUrl = $this->_buildPayUrl($orderInfo);
            if ($userOrderUrl == null) {
                // 出错后，返回当前页面
                LogUtils::error("request pay url failed!!!");
            }
        }
        return $userOrderUrl;
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        LogUtils::info("Pay[630092] --> direct go pay!!!");

        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['isSinglePayItem']) ? $_GET['isSinglePayItem'] : 1;
            $orderInfo->returnUrl = isset($_GET['returnUrl']) ? $_GET['returnUrl'] : "";
        }
        $orderInfo->orderType = 1;
        $orderInfo->lmreason = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);

        if (count($orderItems) <= 0) {
            LogUtils::error("=====>no orderItem!");
        } else {
            $vipId = $orderItems[0]->vip_id;
            // 向CWS获取订单号
            $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
            LogUtils::info("user [ . $userId . ] [.$orderInfo->isSinglePayItem.]request transactionID --> result:" . $orderNoJson);
            if ($orderNoJson->result == 0) {
                // 获取订单号成功，去生成局方的订购url
                $orderInfo->TradeNo = $orderNoJson->order_id;
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $orderInfo->productUrl = $epgInfoMap['productUrl'];
                $payUrl = $this->_buildPayUrl($orderInfo);
            }
        }
        if (empty($payUrl)) {
            IntentManager::back();
            exit();
        }
        header('Location:' . $payUrl);
        exit();
    }

    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {
        LogUtils::info("payCallback[630092] ---> _GET: " . json_encode($_GET));

        $info = $_GET['info'];
        $RST = $_GET['RST'];

        $info = json_decode($info, true);
        $userId = $info['userId'];
        $isPlaying = isset($info['isPlaying']) ? $info['isPlaying'] : 0;// 是否为正在播放引起的订购
        $lmcid = isset($info['lmcid']) ? $info['lmcid'] : '';
        $lmreason = isset($info['lmreason']) ? $info['lmreason'] : '';
        $TradeNo = isset($info['TradeNo']) ? $info['TradeNo'] : '';
        $returnUrl = isset($info['returnUrl']) ? $info['returnUrl'] : '';

        $RST = simplexml_load_string($RST);
        $RST = json_encode($RST);
        $RST = json_decode($RST, true);
        $RST['TradeNo'] = $TradeNo;
        $RST['reason'] = $lmreason;
        $RST['ValidStart'] = str_replace('T', ' ', $RST['ValidStart']);
        $RST['ValidEnd'] = str_replace('T', ' ', $RST['ValidEnd']);
        $RST['UnOrderTime'] = str_replace('T', ' ', $RST['UnOrderTime']);
        $RST['carrierId'] = $lmcid;

        $arr = array(
            "jumpType" => 1,
            "jumpUrl" => ""
        );

        // 上报订购结果
        PayAPI::postPayResultEx($RST);

        // 判断用户是否是VIP，更新到session中
        $isVip = UserManager::isVip($userId);

        if ($RST['RST_CODE'] == "0" || $RST['RST_CODE'] == "2") {
            MasterManager::setUserIsVip(1);
            MasterManager::setOrderResult(1);
            LogUtils::info("payCallback[630092] pay success!!!!!!!!");
        } else {
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(0);
        }

        if (($RST['RST_CODE'] == "0" || $RST['RST_CODE'] == "2") && $isPlaying == "1") {
            $basePagePath = PageManager::getBasePagePath("player");
            $goPlayUrl = $basePagePath . "/userId/" . $userId . "/isPlaying/" . $isPlaying . "?returnUrl=" . $returnUrl;
            LogUtils::info("payCallback[630092] will go page =>: " . $goPlayUrl);
            $arr["jumpUrl"] = $goPlayUrl;
            $arr["jumpType"] = 2;
        } else {
            //去掉returnUrl的头部信息
            $headstr = substr($returnUrl, 0, 10);
            if ($headstr == "/index.php") {
                $returnUrl = substr($returnUrl, 10);
            }
            LogUtils::info("payCallback[630092] will go page =>: " . $returnUrl);
            $arr["jumpUrl"] = $returnUrl;
        }
        $jumpType = $arr["jumpType"];
        $jumpUrl = $arr["jumpUrl"];
        LogUtils::info("payCallback[630092] ---> jumpUrl: " . $jumpUrl . "---->jumpType" . $jumpType);

        if ($jumpType == 1) {
            //  $this->redirect($jumpUrl);
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
    public function unPayCallback($unPayResultInfo = null)
    {
    }

    /**
     * @param $orderInfo
     * @return string
     */
    private function _buildPayUrl($orderInfo)
    {
        $userId = MasterManager::getUserId();
        //得到缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("user[" . $userId . "] _buildPayUrl===>" . json_encode($epgInfoMap));
        if ($orderInfo->productUrl == null) {
            return null;
        }
        $carrierId = MasterManager::getCarrierId();
        if (strpos($orderInfo->productUrl, "?") !== false) {
            $userOrderUrl = $orderInfo->productUrl . "&";
        } else {
            $userOrderUrl = $orderInfo->productUrl . "?";
        }
        //构造BACK_URL，只能有一个参数
        $orderCallback = PageManager::getBasePagePath("orderCallback");
        $infoParma = array();
        $infoParma["userId"] = $userId;
        $infoParma["lmcid"] = $carrierId;
        $infoParma["lmreason"] = $orderInfo->lmreason;
        $infoParma["isPlaying"] = $orderInfo->isPlaying;
        $infoParma["TradeNo"] = $orderInfo->TradeNo;
        $infoParma["returnUrl"] = $orderInfo->returnUrl;
        $backUrl = "http://" . $_SERVER['HTTP_HOST'] . $orderCallback . "?info=";
        $userOrderUrl = $userOrderUrl . "BACK_URL=" . $backUrl . rawurlencode(json_encode($infoParma));
        LogUtils::info("user[" . $userId . "] _buildPayUrl UserOrderUrl===>" . $userOrderUrl);
        return $userOrderUrl;
    }

    /**
     * 构建用户信息
     * @return mixed
     */
    public function buildUserInfo()
    {
        // 获取EPG信息
        $epgInfoMap = MasterManager::getEPGInfoMap();

        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'areaCode' => MasterManager::getAreaCode(),
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'productUrl' => $epgInfoMap['productUrl'],
        );

        return $info;
    }

    /**
     * 通过web浏览器进行订购
     * @param $userInfo
     * @return mixed
     */
    public function webPagePay($userInfo)
    {
        $payUrl = null;
        $userId = MasterManager::getUserId();

        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 220;
        $orderInfo->remark = "login";
        $orderInfo->returnUrl = null;
        $orderInfo->isPlaying = 0;
        $orderInfo->lmreason = 1;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("user [" . $userId . "]===orderItem is empty");
            return $payUrl;
        }

        $vipId = $orderItems[0]->vip_id;

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("user [" . $userId . "] request transactionID --> result:" . $orderNoJson->order_id);
        if ($orderNoJson->result == "0") {
            // 获取订单号成功，去生成局方的订购url
            $orderInfo->TradeNo = $orderNoJson->order_id;
            $orderInfo->productUrl = $userInfo->productUrl;
            $payUrl = $this->_buildPayUrl($orderInfo);
            if ($payUrl == null) {
                // 出错后，返回当前页面
                LogUtils::error("request pay url failed!!!");
            }
        }
        LogUtils::info("webPagePay PayUrl" . $payUrl);

        header("Location:" . $payUrl);
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl()
    {
        return null;
    }
}