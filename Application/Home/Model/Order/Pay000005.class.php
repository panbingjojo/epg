<?php

namespace Home\Model\Order;


use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;

class Pay000005 extends PayAbstract
{
    /**
     * @param object $isVip 在我方是否是vip
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
        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay000005::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return $ret;
        }
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;

        //创建订购参数
        $payInfo = $this->_buildPayInfo($payInfo);

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
        if ($payResultInfo == null) {
            //从session中取出之前已经缓存了的我方的订购参数
            $param = json_decode(MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->returnPageName = $param->returnPageName;
            $payResultInfo->isPlaying = $param->isPlaying;
            $payResultInfo->videoInfo = $param->videoInfo;
            $payResultInfo->isOrder = $_GET['isOrder'];
        }
        LogUtils::info(" payCallback 000005 ---> payResult: " . json_encode($payResultInfo));

        //默认订购失败
        $isVip = 0;
        $msg = "订购失败（查询超时）";
        if(isset($payResultInfo->isOrder)){
            //页面已经查询过订单（跑在android上）
            if($payResultInfo->isOrder == "1"){
                //订购成功
                $isVip = 1;
                $msg = "订购成功";
            }
        }

        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult($isVip);

        // 用户是否是VIP，更新到session中
        MasterManager::setVIPUser($isVip);

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        //显示订购结果页面
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $isVip);
        $showOrderResultObj->setParam("msg", $msg);

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($showOrderResultObj, $objPlayer, IntentManager::$INTENT_FLAG_DEFAULT);
        } else {
            $intent = IntentManager::createIntent($payResultInfo->returnPageName);
            IntentManager::jump($showOrderResultObj, $intent, IntentManager::$INTENT_FLAG_DEFAULT);
        }

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
        $intent->setParam("videoInfo", rawurlencode($payInfo->videoInfo));
        MasterManager::setPayCallbackParams(json_encode($payInfo));

        $url = IntentManager::intentToURL($intent);
        /*
        if (!TextUtils::isBeginHead($url, "http://")) {
            if(MasterManager::isRunOnPC()){
                $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
            } else {
                $url = APP_ROOT_PATH . $url;                      // 回调地址需要加上全局路径
            }
        }
        */

        $url = SERVER_HOST . $url;
        return $url;
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
     * 生成订购参数,附加到$payInfo中
     * @param $payInfo
     * @return mixed
     * @throws \Think\Exception
     */
    private function _buildPayInfo($payInfo)
    {
        $payInfo->returnUrl = $this->_buildPayCallbackUrl($payInfo);  //构建返回地址
        $payInfo->unsubNotifyUrl = UNSUB_NOTIFY_URL; // 退订通知地址
        $payInfo->notifyUrl = NOTIFY_URL; // 支付通知地址
        return $payInfo;
    }

    /**
     * 上报订购结果
     * @param $payResultInfo
     * @return 上报结果
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        $payResultInfo = array(
            'TradeNo' => $payResultInfo->tradeNo,
            'reason' => $payResultInfo->lmreason,
            'transactionID' => $payResultInfo->orderId,
            'Result' => $payResultInfo->result,
            'Description' => $payResultInfo->message,
            'UserID' => $payResultInfo->userId,
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
    public function buildUserInfo() {
        $epgInfoMap = MasterManager::getEPGInfoMap();
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
        LogUtils::info("Pay440004::webPagePay pay ---> tradeInfo: " . $tradeInfo);
        if ($tradeInfo->result == 0) {
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