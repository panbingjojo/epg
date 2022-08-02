<?php

namespace Home\Model\Order;


use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;

class Pay001006 extends PayAbstract
{
    /**
     * 到局方鉴权，只有包月产品才能鉴权。（可以鉴权其他CP的产品，需要传递产品信息）
     * @param $productInfo 鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authentication($productInfo = null)
    {
        LogUtils::info("Pay001006 --> user authentication productInfo:" . json_encode($productInfo));
        // TODO: Implement authentication() method.
        if ($productInfo == null || empty($productInfo) || !is_array($productInfo)) {
            // 默认使用我方的包月产品进行鉴权
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = PRODUCT_ID;
        }

        // 鉴权地址
        $authorizationUrl = ORDER_AUTHORIZATION_URL;

        // userToken
        $areaCode = MasterManager::getAreaCode();

        //鉴权参数
        $info = array(
            "carrierId" => $areaCode,
            "userId" => MasterManager::getAccountId() . "_$areaCode",
            "productId" => $productInfo['productId'],
            "timeStamp" => "" . time(),
        );

        LogUtils::info("Pay001006 --> user authentication param:" . json_encode($info));

        // post到局方鉴权，同步返回数据
        /*
         * curl http://202.99.114.28:10000/authorizationForCP -X POST -d '{"carrierId":237,"userId":"11111_237","productId":"ottsjjkby025@237","timeStamp":"1654044847"}' --header "Content-Type: application/json"
         */
        $result = HttpManager::httpRequest("POST", $authorizationUrl, json_encode($info));

        LogUtils::info("Pay001006 --> user authentication result:  " . $result);

        return json_decode($result);
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
            LogUtils::info("Pay001006::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return $ret;
        }
        //获取订单成功
        $payInfo->tranid = $orderInfo->order_id;
        $payInfo->tradeNo = $orderInfo->order_id;
        //创建订购参数
        $payInfo = $this->_buildPayInfo($payInfo);

        LogUtils::info("pay001006::payInfo：" . json_encode($payInfo));
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
        LogUtils::info("payCallback 001006 ---> REQUEST_payResult:" . json_encode($_REQUEST));
        if ($payResultInfo == null) {
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = $_GET['userId'];
            $payResultInfo->lmreason = $_GET['lmreason'];
            $payResultInfo->lmcid = $_GET['lmcid'];
            $payResultInfo->isPlaying = $_GET['isPlaying'];
            $payResultInfo->videoInfo = $_GET['videoInfo'];
        }

        LogUtils::info("payCallback 001006 ---> payResultInfo: " . json_encode($payResultInfo));

        $isVip = UserManager::isVip($payResultInfo->userId);
        LogUtils::info("payCallback 001006 ---> isVip: " . $isVip);
        // 把订购是否成功的结果写入cookie，供页面使用
        CookieManager::setCookie(CookieManager::$C_ORDER_RESULT, $isVip);

        // 用户是否是VIP，更新到session中
        SessionManager::setUserSession(SessionManager::$S_IS_VIP_USER, $isVip);

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
        $intent->setParam("lmreason", $payInfo->orderReason != null ? $payInfo->orderReason : 0);
        $intent->setParam("lmcid", MasterManager::getCarrierId());
        $intent->setParam("returnPageName", $payInfo->returnPageName);
        $intent->setParam("isPlaying", $payInfo->isPlaying);
        $intent->setParam("videoInfo", rawurlencode($payInfo->videoInfo) );
        MasterManager::setPayCallbackParams(json_encode($payInfo));

        $url = IntentManager::intentToURLV2($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = SERVER_HOST . $url;
        }

        // 截取，避免重复，找不到目录
        http://123.59.206.200
        $srcUrl = "http://123.59.206.200:10002/epg-lws-for-apk-001006/epg-lws-for-apk-001006";
        $destUrl = "http://123.59.206.200:10002/epg-lws-for-apk-001006";
        $url = str_replace($srcUrl, $destUrl, $url);
        return $url;
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
        // 从conf001006中读取全局变量
        $payInfo->appId = APP_ID;
        $payInfo->serviceId = SERVICE_ID;
        $payInfo->productId = PRODUCT_ID;
        $payInfo->productName = PRODUCT_NAME;
        $payInfo->contentId = CONTENT_ID;
        $payInfo->timestamp = date("YmdHis");
        $payInfo->autoSub = '0'; //仅话费支付需要（0：非自动续订；1：自动续订），默认1自动续订
        $payInfo->validTime = date('YmdHis');
        $payInfo->expireTime = date('YmdHis', strtotime("+1 month"));
        $payInfo->orderType= '1';

        return $payInfo;
    }

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
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
}