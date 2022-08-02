<?php

namespace Home\Model\Order;


use Home\Model\Common\CookieManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\AlbumAPI;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Video\VideoManager;

class Pay440001 extends PayAbstract
{
    /**
     * @param String $isVip 在我方是否是vip
     * @return mixed
     */
    public function authentication($isVip = null)
    {
        return $isVip;
    }

    /**
     * 构建到局方用户验证地址
     * @param null $returnUrl
     * @return mixed
     */
    public function buildVerifyUserUrl($returnUrl = null)
    {
        return;
    }

    /**
     * 进入订购界面前，特殊处理并将需要渲染的参数返回
     */
    public function payShow()
    {
        return;
    }

    /**
     * 构建到局方的订购参数
     * @param null $payInfo
     * @return false|mixed|string
     * @throws \Think\Exception
     */
    public function buildPayInfo($payInfo = null)
    {
        LogUtils::info("payInfo:".json_encode($payInfo));
        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay440001::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return $ret;
        }
        //获取订单成功
        $payInfo->tranid = $orderInfo->order_id;
        $payInfo->tradeNo = $orderInfo->order_id;
        
        //创建订购参数
        $payInfo = $this->_buildPayInfo($payInfo);
        LogUtils::info("pay440001::payInfo：" . json_encode($payInfo));
        $ret['result'] = 0;
        $ret['payInfo'] = $payInfo;

        return json_encode($ret);
    }

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildUnPayUrl($payInfo = null)
    {
        return;
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function directToPay($orderInfo = null)
    {
        return;
    }

    /**
     * 订购回调接口
     * @param null $payResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {
        $isVip = 0;
        LogUtils::info("payCallback 440001 ---> REQUEST_payResult:" . json_encode($_REQUEST));
        if ($payResultInfo == null) {
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->TradeNo = $_GET['tradeNo'];
            $payResultInfo->lmreason = $_GET['lmreason'];
            $payResultInfo->returnPageName = $_GET['returnPageName'];
            $payResultInfo->isPlaying = $_GET['isPlaying'];
            $payResultInfo->videoInfo = $_GET['videoInfo'];

            $payResultInfo->tranid = $_GET['tranid'];
            $payResultInfo->orderId = $_GET['orderId'];
            $payResultInfo->productId = $_GET['productId'];
            $payResultInfo->productName = $_GET['productName'];
            $payResultInfo->commit = $_GET['commit'];
            $payResultInfo->payType = $_GET['payType'];
            $payResultInfo->amount = $_GET['amount'];
            $payResultInfo->contentId = $_GET['contentId'];
            $payResultInfo->autoSub = $_GET['autoSub'];
            $payResultInfo->validTime = $_GET['validTime'];
            $payResultInfo->expireTime = $_GET['expireTime'];
            $payResultInfo->result = $_GET['payResult'];
            $payResultInfo->message = $payResultInfo->result == "0" ? "订购成功" : "订购失败";
        }

        LogUtils::info("payCallback 440001 ---> payResultInfo: " . json_encode($payResultInfo));

        $this->_uploadPayResult($payResultInfo);

        if ($payResultInfo->result === 0 || $payResultInfo->result == '0') {
            // 把订购是否成功的结果写入cookie，供页面使用
            CookieManager::setCookie(CookieManager::$C_ORDER_RESULT, 1);

            // 用户是否是VIP，更新到session中
            SessionManager::setUserSession(SessionManager::$S_IS_VIP_USER, 1);
            $isVip = 1;
        }

        // 如果是播放订购成功回来，则过去继续数据&& ($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "" && $payResultInfo->videoInfo != "&") {
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
            //$objDst = IntentManager::createIntent("authOrder");
            //IntentManager::jump($objDst,$objPlayer);
        } else {
            IntentManager::back($payResultInfo->returnPageName);
            //$objDst = IntentManager::createIntent("authOrder");
            //IntentManager::jump($objDst);
        }
        exit();
    }

    /**
     * 订购结果显示界面前，特殊处理并将需要渲染的参数返回
     */
    public function payShowResult($payController = null)
    {
        return array(
            "isSuccess" => $_GET["isSuccess"],
            "msg" => $_GET["msg"]
        );
    }

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function unPayCallback($unPayResultInfo = null)
    {
        return;
    }

    /**
     * 构建订购返回地址
     * @param null $payInfo
     * @return string
     * @throws \Think\Exception
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
        $intent->setParam("videoInfo", rawurlencode($payInfo->videoInfo) );
        MasterManager::setPayCallbackParams(json_encode($payInfo));

        $url = IntentManager::intentToURLV2($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            /*
            if (MasterManager::isRunOnPC()) {
                $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
            } else {
                $url = APP_ROOT_PATH . $url;                      // 回调地址需要加上全局路径
            }
            */
            //$url = APP_ROOT_PATH . $url;                      // 回调地址需要加上全局路径
            $url = SERVER_HOST . $url;
        }

        // 截取，避免重复，找不到目录
        $srcUrl = "http://183.234.214.54:10013/epg-lws-for-apk-440001/epg-lws-for-apk-440001";
        $destUrl = "http://183.234.214.54:10013/epg-lws-for-apk-440001";
        $url = str_replace($srcUrl, $destUrl, $url);
        return $url;
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
            $videoInfos = VideoManager::getRecommennd(MasterManager::getUserId(), 0);
            $contentId = json_decode($videoInfos->data[0]->ftp_url)->gq_ftp_url;
            LogUtils::info("get content id [$contentId] poll video");
        }

        return $contentId;
    }

    /**
     * 构建订购返回地址
     * @param null $param
     * @return string
     */
    private function _buildUnPayCallbackUrl($param = null)
    {
        return;
    }


    /**
     *  获取当前时间毫秒
     * @return float
     */
    private function msectime()
    {
        list($msec, $sec) = explode(' ', microtime());
        $msectime = (float)sprintf('%.0f', (floatval($msec) + floatval($sec)) * 1000);
        return $msectime;
    }

    /**
     * 生成订购参数,附加到$payInfo中
     * @param $payInfo
     * @return mixed
     * @throws \Think\Exception
     */
    private function _buildPayInfo($payInfo)
    {
        $payInfo->backUrl = $this->_buildPayCallbackUrl($payInfo);  //构建返回地址
        $payInfo->unsubNotifyUrl = UNSUB_NOTIFY_URL; // 退订通知地址
        $payInfo->notifyUrl = NOTIFY_URL; // 支付通知地址
        // 从conf440001中读取全局变量
        $payInfo->appid = APP_ID_FOR_NAN_CHUAN;
        $payInfo->appkey = APP_KEY_FOR_NAN_CHUAN;
        $payInfo->productId = PRODUCT_ID;
        $payInfo->productName = PRODUCT_NAME;
        $payInfo->orderUrl = PAY_ORDER_URL;
        $payInfo->timestamp = date("YmdHis");
        $payInfo->commit = "0=prod.10086000026974|1=prod.10086000026974|2=prod.10086000012231";
        $payInfo->autoSub = '1'; //仅话费支付需要（0：非自动续订；1：自动续订），默认1自动续订
        $payInfo->validTime = date('YmdHis');
        $payInfo->expireTime = date('YmdHis', strtotime("+1 month"));
        $payInfo->orderType= '1';


        if(MasterManager::getEnterFromYsten() == "1"){
            //易视腾融合包产品
            $payInfo->appid = APP_ID_FOR_YST;
            $payInfo->appkey = APP_KEY_FOR_YST;
            $payInfo->productId = PRODUCT_ID_FOR_YST;
            $payInfo->autoSub = '1'; //仅话费支付需要（0：非自动续订；1：自动续订），默认1自动续订
            $payInfo->orderType= '4'; //线上推广产品
        }elseif ($payInfo->amount == 27000){
            //包年产品
            $payInfo->productId = PRODUCT_ID_YEAR;
            $payInfo->commit = MOBILE_COMMIT_YEAR;
            $payInfo->contentName='39健康包年';
            $payInfo->autoSub = '0';
            $payInfo->orderType= '2';
            $payInfo->expireTime = date('YmdHis', strtotime("+1 year"));
        }

        // 如果没有得到contentId，暂时由控制器自动获取
        if ($payInfo->contentId == null || empty($payInfo->contentId)) {
            $payInfo->contentId = $this->queryVideoContentId();
        }


        $signStr = $payInfo->appkey . $payInfo->appid . $payInfo->timestamp . $payInfo->tranid . $payInfo->userId . $payInfo->productId . $payInfo->amount;
        $payInfo->sign = md5($signStr); // 请求签名
        return $payInfo;
    }

    /**
     * 上报订购结果
     * @param $payResultInfo
     * @return boolean 上报结果
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        $payResultInfo = array(
            'TradeNo' => $payResultInfo->TradeNo,
            'reason' => $payResultInfo->lmreason,
            'tranid' => $payResultInfo->tranid,
            'orderId' => $payResultInfo->orderId,
            'productId' => $payResultInfo->productId,
            'productName' => $payResultInfo->productName,
            'commit' => $payResultInfo->commit,
            'payType' => $payResultInfo->payType,
            'amount' => $payResultInfo->amount,
            'contentId' => $payResultInfo->contentId,
            'autoSub' => $payResultInfo->autoSub,
            'validTime' => $payResultInfo->validTime,
            'expireTime' => $payResultInfo->expireTime,
            'result' => $payResultInfo->result,
            'message' => $payResultInfo->message
        );

        $payResultInfo['carrierId'] = isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID;
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $uploadPayResult = PayAPI::postPayResultEx($payResultInfo);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
    }

    /**
     * 上报退订结果
     * @param null $unPayResultInfo
     */
    private function _uploadUnPayResult($unPayResultInfo = null)
    {
        return;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
        $epgInfoMap = SessionManager::getUserSession(SessionManager::$S_EPG_INFO_MAP);
        $userAccount = MasterManager::getAccountId();
        $info = array(
            'accountId' => $userAccount,
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platformType' => MasterManager::getPlatformType(),

            'devNo' => $epgInfoMap["devNo"],
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

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay440004::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        $orderInfo->devNo = $userInfo->devNo;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark); // 向CWS获取订单号
        LogUtils::info("Pay440004::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tranid = $orderInfo->order_id;
            $orderInfo->tradeNo = $tradeInfo->order_id;
            //创建订购参数
            $payInfo = $this->_buildPayInfo($orderInfo);

            LogUtils::info("Pay440004::webPagePay buildPayInfo --->: " . json_encode($payInfo));

            $intent = IntentManager::createIntent("directPay");
            $intent->setParam("orderParam", rawurlencode(json_encode($payInfo)));
            $goUrl = IntentManager::intentToURL($intent);
            header('Location:' . $goUrl);
        }
        return 0;
    }

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
    }
}