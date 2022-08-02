<?php

namespace Home\Model\Order;

use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;
use Home\Model\Page\PageManager;
use Home\Model\Video\VideoManager;

class Pay07430093 extends PayAbstract
{
    /**
     * 到局方鉴权，只有包月产品才能鉴权。
     * @param
     * @return mixed
     */
    public function authentication($param = null)
    {
        $isVip = 0;
        MasterManager::setFreeExperience(0); // 初始化标志位，--- 没有免费体验

        if (LOCATION_TEST) {
            return 1;//如果是本地测试，直接鉴权为vip用户
        }

        $epgInfoMap = MasterManager::getEPGInfoMap();
        $videoInfos = VideoManager::getRecommennd(MasterManager::getUserId(), 0);

        $videoInfo = new \stdClass();
        $videoInfo->videoUrl = json_decode($videoInfos->data[0]->ftp_url)->gq_ftp_url;
        $videoInfo->title = $videoInfos->data[0]->title;
        $videoInfo->imageUrl = $videoInfos->data[0]->image_url;

        $respond = $this->queryUserOrderDetail(MasterManager::getAccountId(), $videoInfo);
        $respond = json_decode($respond, true);
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth RST_CODE:" . $respond["Result"]);
        if ($respond["Result"] == "0") {
            $isVip = 1;
        } else if ($respond["Result"] == "1") {
            $epgInfoMap['Data'] = $respond["Data"];
            MasterManager::setEPGInfoMap($epgInfoMap);
        }

        return $isVip;
    }

    public function authenticationEx($videoInfo)
    {
        $isVip = 0;

        $respond = $this->queryUserOrderDetail(MasterManager::getAccountId(), $videoInfo);
        $respond = json_decode($respond, true);
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth RST_CODE:" . $respond["RST_CODE"]);
        if ($respond["RST_CODE"] == "0" || $respond["RST_CODE"] == "2") {
            $isVip = 1;
        }

        return $isVip;
    }

    /**
     * 查询用户订单详情
     * @param string $userAccount 用户业务帐号
     * @param object $videoInfo 鉴权视频信息
     * @return  String
     */
    private function queryUserOrderDetail($userAccount, $videoInfo)
    {
        //查询地址 ContentUnicomAuth.action内容鉴权
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $selectUrl = USER_ORDER_QUERY . "ContentUnicomAuth.action?";
        $infoParam = array();

        if(strpos($videoInfo->videoUrl,'|')!==false){
            $videoArr = explode('|',$videoInfo->videoUrl);
            $videoUrl = $videoArr[0];
        }else {
            $videoUrl = $videoInfo->videoUrl;
        }

        //芒果健康固定收费VIP视频原始ID：D00000001202005061715390067788851
        $infoParam["userid"] = $userAccount;
        $infoParam["contentcode"] = "VRS348084";//$MediaIDCOMPARISON[$videoUrl];
        $infoParam["usertoken"] = MasterManager::getUserToken();
        $infoParam["mac"] = MasterManager::getSTBMac();
        $infoParam["version"] = $epgInfoMap['appVersion'];//'YYS.'.$epgInfoMap["systemVersion"];
        $infoParam["fromsource"] = "v5";

        //使用http_build_query，@符合会转换为%40，单独拼接
        $selectUrl = $selectUrl . "userid=".$infoParam["userid"]
            ."&contentcode=".$infoParam["contentcode"]
            ."&usertoken=".$infoParam["usertoken"]
            ."&mac=".$infoParam["mac"]
            ."&version=".$infoParam["version"]
            ."&fromsource=".$infoParam["fromsource"];

        LogUtils::info("userAuth request =>: " . $selectUrl);
        $respond = HttpManager::httpRequest("GET", $selectUrl, "");
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth respond:" . $respond);
        return $respond;
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
        // TODO: Implement buildPayUrl() method.
        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );

        if ($payInfo == null || $payInfo == "" || !is_object($payInfo)) {
            LogUtils::error("buildPayUrl， 参数错误");
            return $ret;
        }

        $payInfo->lmreason = 0;
        $orderType = 1;

        $Result = $this->authentication();
        if($Result == 0){
            // 创建支付订单
            $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark, null, $orderType);
            if ($orderInfo->result != 0) {
                // 创建失败
                $ret['result'] = $orderInfo->result;
                return $ret;
            }

            //鉴权失败说明用户可订购， 构建订购地址
            $payInfo->tradeNo = $orderInfo->order_id;
            $payUrl = $this->_buildPayUrl($payInfo);

            $ret['result'] = 0;
            $ret['payUrl'] = $payUrl;
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
        $callbackUrl = $this->_buildPayCallbackUrl($orderInfo);
        $callbackUrl = urlencode($callbackUrl);
        $payArr = array(
            "product_id" => productID_18,
            "video_name" =>"" ,
            "video_id" => "",
            "video_type" => "",
            "source" => "v5",
        );
        $paydata = json_encode($payArr);
        $payUrl = 'http://119.39.13.155:8080/en/jump_order/index.html?product_list='.$paydata.'&exitStr='.$callbackUrl;
        Header("Location:$payUrl");
        exit();

    }

    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     */
    public function payCallback($payResultInfo = null)
    {
        LogUtils::info("payCallback[07430093] ---> _GET: " . json_encode($_GET));

        $info = $_GET;
        //$info = json_decode($info, true);
        $userId = $info['userId'];
        $isPlaying = isset($info['isPlaying']) ? $info['isPlaying'] : 0;// 是否为正在播放引起的订购
        $lmcid = isset($info['lmcid']) ? $info['lmcid'] : '';
        $lmreason = isset($info['lmreason']) ? $info['lmreason'] : 0;
        $TradeNo = isset($info['tradeNo']) ? $info['tradeNo'] : '';
        $returnUrl = isset($info['returnUrl']) ? $info['returnUrl'] : '';

        $Result = $this->authentication();
        $RST = $_GET['RST'];
        $RST = json_decode($RST, true);
        $RST['TradeNo'] = $TradeNo;
        $RST['reason'] = $lmreason;
        $RST['ValidStart'] = date('Y-m-d h:i:s', time());
        $RST['RST_CODE'] = $Result==1?0:1;
        $RST['PayType'] = "1";
        if($RST['RST_CODE'] == 0){
            $RST['ValidEnd'] = "2099-01-01";
            $RST['UnOrderTime'] = "2099-01-01";
        } else {
            $RST['ValidEnd'] = date('Y-m-d h:i:s', time());
            $RST['UnOrderTime'] = date('Y-m-d h:i:s', time());
        }
        $RST['carrierId'] = $lmcid;

        $arr = array(
            "jumpType" => 1,
            "jumpUrl" => ""
        );

        // 上报订购结果
        PayAPI::postPayResultEx($RST);

        if ($RST['RST_CODE'] == "0") {
            MasterManager::setUserIsVip(1);
            MasterManager::setOrderResult(1);
            LogUtils::info("payCallback[07430093] pay success!!!!!!!!");
        } else {
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(0);
        }

        if (($RST['RST_CODE'] == "0") && $isPlaying == "1" && $lmreason == 0) {
            $basePagePath = PageManager::getBasePagePath("player");
            $goPlayUrl = $basePagePath . "/userId/" . $userId . "/isPlaying/" . $isPlaying . "?returnUrl=" . $returnUrl;
            LogUtils::info("payCallback[07430093] will go page =>: " . $goPlayUrl);
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
            LogUtils::info("payCallback[07430093] will go page =>: " . $returnUrl);
            $arr["jumpUrl"] = $returnUrl;
        }
        $jumpType = $arr["jumpType"];
        $jumpUrl = $arr["jumpUrl"];
        LogUtils::info("payCallback[07430093] ---> jumpUrl: " . $jumpUrl . "---->jumpType" . $jumpType);

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
        $callbackUrl = $this->_buildPayCallbackUrl($orderInfo);
        $callbackUrl = urlencode($callbackUrl);
        $payArr = array(
            "product_id" => "446",
            "video_name" =>"" ,
            "video_id" => "",
            "video_type" => "",
            "source" => "v5",
        );
        $paydata = json_encode($payArr);
        $payUrl = 'http://119.39.13.155:8080/en/jump_order/index.html?product_list='.$paydata.'&exitStr='.$callbackUrl;
        LogUtils::info( "] _buildPayUrl payUrl===>" . $payUrl);
        return $payUrl;
    }

    /**
     * 构建订购返回地址
     * @param null $param
     * @return string
     */
    private function _buildPayCallbackUrl($payInfo = null)
    {
        $intent = IntentManager::createIntent("payCallback");
        $intent->setParam("userId", MasterManager::getUserId());
        $intent->setParam("tradeNo", $payInfo->tradeNo);
        $intent->setParam("lmreason", $payInfo->orderReason != null ? $payInfo->orderReason : 0);
        $intent->setParam("lmcid", MasterManager::getCarrierId());
        $intent->setParam("returnPageName", $payInfo->returnPageName);
        $intent->setParam("isPlaying", $payInfo->isPlaying);
        $intent->setParam("videoInfo", rawurlencode($payInfo->videoInfo));

        LogUtils::info("_buildPayCallbackUrl ---> payInfo: " . json_encode($payInfo));
        MasterManager::setPayCallbackParams(json_encode($payInfo));
        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        LogUtils::info("_buildPayCallbackUrl ---> url: " . $url);
        return $url;
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
            'productUrl' => base64_encode($epgInfoMap['productUrl']),
            'platfromType' => MasterManager::getPlatformType(),
        );

        return $info;
    }

    /**
     * 通过web浏览器进行订购
     * @param object $userInfo
     * @return string|null
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
    public function buildDirectPayUrl()
    {
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
            $orderInfo->tradeNo = $orderNoJson->order_id;
            // 获取EPG信息
            $epgInfoMap = MasterManager::getEPGInfoMap();

            $orderInfo->productUrl = $epgInfoMap['productUrl'];
            $payUrl = $this->_buildPayUrl($orderInfo);
            if ($payUrl == null) {
                // 出错后，返回当前页面
                LogUtils::error("request pay url failed!!!");
            }
        }

        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);
//        $payUrl = "http://223.221.8.102:8082/RHBMS/jsp/interface/epg/productList.jsp?USER_ID=hy2486300itv&Scene=0&ContentCode=Program1000949&ContentName=%2525E5%2525BC%2525BA%2525E7%25259B%2525B4%2525E6%252580%2525A7%2525E8%252584%25258A%2525E6%25259F%2525B1%2525E7%252582%25258E%2525E7%25259A%252584%2525E5%25258F%252591%2525E7%252597%252585%2525E5%25258E%25259F%2525E5%25259B%2525A0&ProductBillingCode=310401202500,310402420000,310409915800,310409807900&PicUrl=http://223.221.36.146:10002/fs/imgs/07430093/video/20190505/zsjl0949.png&ServiceIds=1475,1477,1483,1485&BACK_URL=http://223.221.36.146:10001/index.php/Home/Pay/payCallback?info=%7B%22userId%22%3A%222910912%22%2C%22lmcid%22%3A%2207430093%22%2C%22lmReason%22%3Anull%2C%22isPlaying%22%3A0%2C%22TradeNo%22%3A%22201905271751089998522224595%22%2C%22returnUrl%22%3Anull%7D";
        return $payUrl;
    }
}