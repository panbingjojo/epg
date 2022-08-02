<?php

namespace Home\Model\Order;

use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\GameAPI;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;
use Home\Model\Page\PageManager;
use Home\Model\Video\VideoManager;

class Pay04630092 extends PayAbstract
{
    /**
     * 到局方鉴权，只有包月产品才能鉴权。
     * @param
     * @return mixed
     */
    public function authentication($type = 0)
    {
        $isVip = 0;
        MasterManager::setFreeExperience(0); // 初始化标志位，--- 没有免费体验

        if (LOCATION_TEST) {
            return 1;//如果是本地测试，直接鉴权为vip用户
        }

        $videoInfo = new \stdClass();
        $videoInfo->videoUrl = "Program1209621";//局方绑定了5,10,20,59,99,189的产品
        $videoInfo->title = "乐宝棋牌简介";
        $videoInfo->imageUrl = "http://" . $_SERVER['HTTP_HOST']."/Public/img/hd/Pay/V04630092/img_order_cover.png";
        if($type == 2){
            $videoInfo->productList = productID_5. ','.productID_10;
        }else{
            $videoInfo->productList = productID_20 ;//. ',' . productID_59. ',' . productID_99 . ',' . productID_189
        }
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth imageUrl:" . $videoInfo->imageUrl);

        return $this->externalAuth(MasterManager::getAccountId(),$videoInfo);
    }

    public function externalAuth($userAccount,$videoInfo) {
        $isVip = 0;


        $selectUrl = USER_ORDER_QUERY . "?";
        $infoParam = array();
        $infoParam["USER_ID"] = $userAccount;

        $infoParam["ContentCode"] = $videoInfo->videoUrl;
        $infoParam["ProductBillingCode"] = $videoInfo->productList;
        $infoParam["Time_Stamp"] = time();//date("YmdHis", time());
        $infoParam["TOKEN"] = md5($userAccount . $infoParam["ContentCode"] . $infoParam["Time_Stamp"]);
        $infoParam["ContentName"] = urlencode(urlencode($videoInfo->title));
        $infoParam["PicUrl"] = $videoInfo->imageUrl;

        $selectUrl = $selectUrl . http_build_query($infoParam);
        LogUtils::info("externalAuth infoParam =>: " . json_encode($infoParam));
        LogUtils::info("externalAuth request =>: " . $selectUrl);
        $respond = HttpManager::httpRequest("GET", $selectUrl, "");
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> externalAuth respond:" . $respond);

        $respond = json_decode($respond, true);
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> externalAuth RST_CODE:" . $respond["RST_CODE"]);
        if ($respond["RST_CODE"] == "0") {
            $desc = $respond['RST_DESC'];
            if ($desc && preg_match("/($desc)/", "免费周期鉴权通过")) {
                MasterManager::setFreeExperience(1);
                LogUtils::info("Pay04630092::externalAuth ---> is free experience!!!");
            } else {
                $isVip = 1;
            }
        }else if ($respond["RST_CODE"] == "1") {
            $epgInfoMap = MasterManager::getEPGInfoMap();
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
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        LogUtils::info("Pay[04630092] --> direct go pay!!!");

        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 233;
            $orderInfo->isSinglePayItem = isset($_GET['isSinglePayItem']) ? $_GET['isSinglePayItem'] : 1;
            $orderInfo->returnUrl = isset($_GET['returnUrl']) ? $_GET['returnUrl'] : "";
        }

        $type = isset($_GET['type']) ? $_GET['type'] : 0;
        // 存取暖春活动需要的参数

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        $orderType = 1;
        $contentId = null;
        if (count($orderItems) <= 0) {
            LogUtils::error("=====>no orderItem!");
        } else {
            if($this->authentication($type)){
                IntentManager::back();
                exit();
            }

            $vipId = $orderItems[0]->vip_id;
            $i = 0;
            while ($i < count($orderItems)){
                if($orderItems[$i]->price == "500" && $type == 2){
                    $vipId = $orderItems[$i]->vip_id;
                    $contentId = "乐卡充值";
                    break;
                }
                if($orderItems[$i]->price == "2000"  && $type != 2){
                    $vipId = $orderItems[$i]->vip_id;
                    break;
                }
                $i++;
            }

            // 向CWS获取订单号
            $orderInfo->lmreason = 0;
            $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderInfo->orderReason, $orderInfo->remark, $contentId, $orderType);
            LogUtils::info("user [ . $userId . ] [.$orderInfo->isSinglePayItem.]request transactionID --> result:" . json_encode($orderNoJson));
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
     */
    public function payCallback($payResultInfo = null)
    {
        LogUtils::info("payCallback[04630092] ---> _GET: " . json_encode($_GET));

        $info = $_GET['info'];
        $RST = $_GET['RST'];

        $info = json_decode($info, true);
        $userId = $info['userId'];
        $isPlaying = isset($info['isPlaying']) ? $info['isPlaying'] : 0;// 是否为正在播放引起的订购
        $lmcid = isset($info['lmcid']) ? $info['lmcid'] : '';
        $lmreason = isset($info['lmreason']) ? $info['lmreason'] : 0;
        $TradeNo = isset($info['TradeNo']) ? $info['TradeNo'] : '';
        $returnUrl = isset($info['returnUrl']) ? $info['returnUrl'] : '';

        $RST = simplexml_load_string($RST);
        $RST = json_encode($RST);
        $RST = json_decode($RST, true);
        LogUtils::info("payCallback[04630092] ---> RST: " . json_encode($RST));
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

        if ($RST['RST_CODE'] == "0" || $RST['RST_CODE'] == "2") {
            if($RST['RST_CODE'] == "2"){
                if($this->authentication(2)){
                    $RST['RST_CODE'] = 0;
                    $RST['PayType'] = 4; // 支付类型：1宽带支付 2翼支付 3支付宝-扫码支付 4微信-扫码支付
                    $RST['ValidStart'] = date("Y-m-d H:i:s", time());;
                    $RST['ValidEnd'] = date("Y-m-d H:i:s", time());;
                    $RST['Price'] = intval(substr($RST['ProdId'],-4));;
                }
            }else{
                MasterManager::setUserIsVip(1);
                MasterManager::setOrderResult(1);
            }
            if($RST['RST_CODE'] == 0){
                $this->gameLeKaAdd($RST['Price'],$RST['ProdId']);
                LogUtils::info("payCallback[04630092] pay success!!!!!!!!");
            }
        } else {
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(0);
        }

        // 上报订购结果
        PayAPI::postPayResultEx($RST);

        if (($RST['RST_CODE'] == "0" || $RST['RST_CODE'] == "2") && $isPlaying == "1" && $lmreason == 0) {
            $basePagePath = PageManager::getBasePagePath("player");
            $goPlayUrl = $basePagePath . "/userId/" . $userId . "/isPlaying/" . $isPlaying . "?returnUrl=" . $returnUrl;
            LogUtils::info("payCallback[04630092] will go page =>: " . $goPlayUrl);
            $arr["jumpUrl"] = $goPlayUrl;
            $arr["jumpType"] = 2;
        } else if ($lmreason == 1 || $lmreason == 2) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            $arr["jumpType"] = 0;
            $arr["jumpUrl"] = $returnUrl;
        } else {
            //去掉returnUrl的头部信息
            $headstr = substr($returnUrl, 0, 10);
            if ($headstr == "/index.php") {
                $returnUrl = substr($returnUrl, 10);
            }
            LogUtils::info("payCallback[04630092] will go page =>: " . $returnUrl);
            $arr["jumpUrl"] = $returnUrl;
        }
        $jumpType = $arr["jumpType"];
        $jumpUrl = $arr["jumpUrl"];
        LogUtils::info("payCallback[04630092] ---> jumpUrl: " . $jumpUrl . "---->jumpType" . $jumpType);

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

    //游戏乐卡添加
    public function gameLeKaAdd($price,$prodId){
        $cards = 0;
        $type = 0;
        $month = 0;
        switch ($prodId) {
            case productID_5:
                $type = 1;
                $month = 3;
                $cards = 20;
                break;
            case productID_10:
                $type = 1;
                $month = 3;
                $cards = 60;
                break;
            case productID_20:
            case productID_59:
            case productID_99:
            case productID_189:
                $type = 2;
                $month = 1;
                $cards = 100;
                break;
        }

        return GameAPI::addUserGameCards($type,$cards,$month);
    }
    /**
     * @param $orderInfo
     * @return string
     */
    private function _buildPayUrl($orderInfo)
    {
        $userId = MasterManager::getUserId();
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
        $infoParam = array();
        $infoParam["userId"] = $userId;
        $infoParam["lmcid"] = $carrierId;
        $infoParam["lmreason"] = $orderInfo->lmreason;
        $infoParam["isPlaying"] = $orderInfo->isPlaying;
        $infoParam["TradeNo"] = $orderInfo->TradeNo;
        $infoParam["returnUrl"] = $orderInfo->returnUrl;
        $backUrl = "http://" . $_SERVER['HTTP_HOST'] . $orderCallback . "?info=";
        $userOrderUrl = $userOrderUrl . "BACK_URL=" . $backUrl . rawurlencode(json_encode($infoParam));
        LogUtils::info("user[" . $userId . "] _buildPayUrl UserOrderUrl===>" . $userOrderUrl);
        return $userOrderUrl;
    }

    /**
     * 构建用户信息
     * @param null $unPayResultInfo
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
            'productUrl' => base64_encode($epgInfoMap['productUrl']),
            'platfromType' => MasterManager::getPlatformType(),
        );

        return $info;
    }

    /**
     * 通过web浏览器进行订购
     * @param null $unPayResultInfo
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
        $orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("user [" . $userId . "]=== pay orderItem is empty");
            return $payUrl;
        }

        $vipId = $orderItems[0]->vip_id;

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderInfo->orderReason, $orderInfo->remark, null, $orderType); // 向CWS获取订单号
        LogUtils::info("user [" . $userId . "] pay request transactionID --> result:" . $orderNoJson->order_id);
        if ($orderNoJson->result == "0") {
            // 获取订单号成功，去生成局方的订购url
            $orderInfo->TradeNo = $orderNoJson->order_id;
            $orderInfo->productUrl = base64_decode($userInfo->productUrl);
            $payUrl = $this->_buildPayUrl($orderInfo);
            if ($payUrl == null) {
                // 出错后，返回当前页面
                LogUtils::error("request pay url failed!!!");
            }
        }
        LogUtils::info("webPagePay pay PayUrl: " . $payUrl);

        header("Location:" . $payUrl);
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl() {
        $payUrl = null;

        $userId = MasterManager::getUserId();

        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->returnUrl = null;
        $orderInfo->isPlaying = 0;
        $orderInfo->lmreason = 2;
        $orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("user [" . $userId . "]=== pay orderItem is empty");
            return $payUrl;
        }

        $vipId = $orderItems[0]->vip_id;

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderInfo->orderReason, $orderInfo->remark, null, $orderType); // 向CWS获取订单号
        LogUtils::info("user [" . $userId . "] pay request transactionID --> result:" . $orderNoJson->order_id);
        if ($orderNoJson->result == "0") {
            // 获取订单号成功，去生成局方的订购url
            $orderInfo->TradeNo = $orderNoJson->order_id;
            // 获取EPG信息
            $epgInfoMap = MasterManager::getEPGInfoMap();

            $orderInfo->productUrl = $epgInfoMap['productUrl'];
            $payUrl = $this->_buildPayUrl($orderInfo);
            if ($payUrl == null) {
                // 出错后，返回当前页面
                LogUtils::error("request pay url failed!!!");
            }
        }

        if(!empty($payUrl)){
            LogUtils::info("addUserPayUrl pay TradeNo: " . $orderInfo->TradeNo);
            PayAPI::addUserPayUrl(urlencode($payUrl),$orderInfo->TradeNo,1);
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);
        return $payUrl;
    }
}