<?php

namespace Home\Model\Order;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;

class Pay320013 extends PayAbstract
{

    /**
     * 用户到局方鉴权，使用cws的接口
     * @param null $userInfo
     */
    public function authentication($userInfo = null)
    {

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
     * 进入订购界面前，特殊处理并将需要渲染的参数返回
     * @return mixed
     */
    public function payShow()
    {

    }

    /**
     * 构建订购参数
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayInfo($payInfo = null)
    {
        // 创建支付订单
        $orderInfo = PayAPI::getTradeInfo($payInfo->vip_id);
        return json_encode($orderInfo);
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

    }

    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     */
    public function payCallback($payResultInfo = null)
    {
       //if ($payResultInfo == null) {
            //从session中取出之前已经缓存了的我方的订购参数
            $param = json_decode(MasterManager::getPayCallbackParams());
            LogUtils::info(" payCallback 320013 ---> payCallback===>param session: " . MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->returnPageName = $param->returnPageName;
            $payResultInfo->isPlaying = $param->isPlaying;
            //得到局方返回的订购参数
            $payResultInfo->action = $_GET['action'];
        //}
        LogUtils::info(" payCallback 320013 ---> payResult: " . json_encode($payResultInfo));
        if ($payResultInfo->action == 'cancel') { // 直接返回上一级页面
            $payResultInfo->orderSuccess = "-1";
            IntentManager::back();
            return;
        }
        $isVip = 0;
        if ($payResultInfo->action == 'success') {
            // 订购成功，上报订购结果
            $payResultInfo->orderSuccess = "1";
            $isVip = 1;
            $this->_uploadPayResult($payResultInfo);
        } else {
            $payResultInfo->orderSuccess = "-1";
        }

        // 用户是否是VIP，更新到session中
        MasterManager::setVIPUser($isVip);

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->isPlaying == 1) {

        }

        //显示订购结果页面，该界面显示的是局方的订购结果（不包括订购成功后上报到我方服务器，是否在我方服务器上变成了vip）
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $payResultInfo->orderSuccess);
        $showOrderResultObj->setParam("returnPageName", $payResultInfo->returnPageName);  // 增加一个返回页面名称

        $url = IntentManager::intentToURL($showOrderResultObj);
        LogUtils::info(" payCallback 320013 ---> showOrderResult url: " . $url);

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
            LogUtils::info(" payCallback 320013 ---> player: ");
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($showOrderResultObj, $objPlayer, IntentManager::$INTENT_FLAG_DEFAULT);
        } else {
            LogUtils::info(" payCallback 320013 ---> not player: ");
            header('Location:' . $url);
        }
    }

    public function uploadPayResult($payResultInfo){
        $result = -1;
        $isUploadResult = $this->_uploadPayResult($payResultInfo);
        if ($isUploadResult) $result = 0;
        MasterManager::setVIPUser(1); // 当前用户设置VIP
        $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        if ($payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
            LogUtils::info(" payCallback 320013 ---> player: ");
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        }
        return json_encode(array("result" => $result));
    }

    /**
     * 上报订购结果,只上报订购成功
     * @param $payResultInfo
     * @return bool
     */
    private function _uploadPayResult($payResultInfo)
    {
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $requestData = array(
            "tradeNo" => $payResultInfo->lmTradeNo,
            "accountId" => MasterManager::getAccountId(),
            "orderSuccess" => 0,
            "reason" => $payResultInfo->lmReason
        );
        $uploadPayResult = HttpManager::httpRequest("POST", ORDER_CALLBACK, $requestData);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
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
     * 订购结果显示界面，特殊处理
     * @param: payController|null $
     * @return mixed
     */
    public function payShowResult($payController = null)
    {
        return $_GET;
    }

    /**
     * 构建订购返回地址
     * @param: null $param
     * @return string
     */
    private function _buildPayCallbackUrl($payInfo = null)
    {
        $intent = IntentManager::createIntent("payCallback");
        $intent->setParam("tradeNo", $payInfo->tradeNo);
        /*$intent->setParam("userId", MasterManager::getUserId());
        $intent->setParam("lmreason", $payInfo->orderReason != null ? $payInfo->orderReason : 0);
        $intent->setParam("lmcid", MasterManager::getCarrierId());
        $intent->setParam("returnPageName", $payInfo->returnPageName);
        $intent->setParam("isPlaying", $payInfo->isPlaying);*/

        LogUtils::info("_buildPayCallbackUrl ---> payInfo: " . json_encode($payInfo));

        MasterManager::setPayCallbackParams(json_encode($payInfo));

        LogUtils::info("_buildPayCallbackUrl ---> payInfo session: " . MasterManager::getPayCallbackParams());

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            LogUtils::info("_buildPayCallbackUrl ---> isRunOnPC: " . (string)(MasterManager::isRunOnPC()));
            if (defined(APP_ROOT_PATH)) {
                $url = APP_ROOT_PATH . $url;                       // 回调地址需要加上全局路径
            } else {
                $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
            }
        }
        LogUtils::info("_buildPayCallbackUrl ---> url: " . $url);
        return $url;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
        //获取计费策略id
        $epgInfoMap = MasterManager::getEPGInfoMap();
        //创建订购参数
        $accountIdentity = $epgInfoMap['accountId'];  //支付账号
        $deviceId = $epgInfoMap['deviceId'];           //32位设备id

        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'userId' => MasterManager::getUserId(),
            'platformType' => MasterManager::getPlatformType(),
            "lmcid" => MasterManager::getCarrierId(),

            "user_account" => $accountIdentity,
            "mac_addr" => $deviceId,
        );

        return $info;
    }

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
    }
}