<?php
/**
 * Created by PhpStorm.
 * User: chenzhongyi
 * Date: 2019/8/20
 * Time: 下午5:36
 */

namespace Home\Model\Order;


use Home\Model\Common\CookieManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;

class Pay520094 extends PayAbstract
{

    /**
     * 贵州广电是通过js验证的，所以不使用
     * @param $productInfo 鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authentication($payInfo = null)
    {
        return;
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
     * 构建到局方的订购参数
     * @param $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {
        // 创建支付订单
        $orderType = 1;
        $payInfo->lmreason = 0;
        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark, null, $orderType);
        $orderInfo->result = 0;
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            LogUtils::info("pay520094::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
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
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {

        // TODO: Implement payCallback() method.
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
            //得到局方返回的订购参数
            $payResultInfo->result = $_GET['result'];
            $payResultInfo->gzgdTradeNo = $_GET['gzgdTradeNo']; //局方订单号

        }
        LogUtils::info(" payCallback 520094 ---> payResult: " . json_encode($payResultInfo));

        $isVip = null;
        if ($payResultInfo->result === "0") {
            //到我方注册成为vip,不关心注册是否成功，
//            UserManager::regVip(MasterManager::getUserId());
            $isVip = 1;
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(1);
        } else {
            $isVip = 0;
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(0);
        }

        // 上报订购结果
        $this->_uploadPayResult($payResultInfo);

        // 判断用户是否是VIP，更新到session中
        MasterManager::setUserIsVip($isVip);

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }


        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null && $payResultInfo->lmreason == 0) {
            // 继续播放
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            //IntentManager::jump($objPlayer);
            $objDst = IntentManager::createIntent("authOrder");
            IntentManager::jump($objDst,$objPlayer);
        } else if ($payResultInfo->lmreason == 1 || $payResultInfo->lmreason == 2) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            $objDst = IntentManager::createIntent("authOrder");
            IntentManager::jump($objDst,$intent);
            //header('Location:' . $returnUrl);
        } else {
            $objDst = IntentManager::createIntent("authOrder");
            IntentManager::jump($objDst);
            //IntentManager::back($payResultInfo->returnPageName);
        }
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
     * @param null $param
     * @return string
     */
    private function _buildPayCallbackUrl($param = null)
    {
        $intent = IntentManager::createIntent("payCallback");
        $intent->setParam("userId", $param['userId']);
        $intent->setParam("tradeNo", $param['tradeNo']);
        $intent->setParam("lmreason", $param['lmreason']);
        $intent->setParam("lmcid", $param['lmcid']);
        $intent->setParam("returnPageName", $param['returnPageName']);
        $intent->setParam("isPlaying", $param['isPlaying']);
        $intent->setParam("videoInfo", rawurlencode($param['videoInfo']));
        MasterManager::setPayCallbackParams(json_encode($param));

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
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
     * @param null $payInfo
     * @param $productInfo
     * @return bool|string
     */
    private function _buildPayInfo($payInfo)
    {
        $param = array(
            "userId" => MasterManager::getUserId(),
            "tradeNo" => $payInfo->tradeNo,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => MasterManager::getCarrierId(),
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "videoInfo" => $payInfo->videoInfo,
            "price" => $payInfo->price
        );
        $payInfo->returnUrl = urlencode($this->_buildPayCallbackUrl($param));  //构建返回地址
        $payInfo->timeStamp = date("YmdHis");
        return $payInfo;
    }

    /**
     * 上报订购结果
     * @param $payResultInfo
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        $payResultInfo = array(
            'Result' => $payResultInfo->result,
            'TradeNo' => $payResultInfo->tradeNo,
            'gzgdTradeNo' => $payResultInfo->gzgdTradeNo,
            'reason' => $payResultInfo->lmreason,
            'UserID' => $payResultInfo->userId,
            'carrierId' => MasterManager::getCarrierId(),
        );

        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));

        PayAPI::postPayResultEx($payResultInfo);
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
        $userAccount = MasterManager::getAccountId();

        $info = array(
            'accountId' => $userAccount,
            "stbId" => MasterManager::getSTBId(),
            "areaCode" => MasterManager::getAreaCode(),
            'lmcid' => CARRIER_ID,
            'platformType' => MasterManager::getPlatformType(),
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
        $orderInfo->carrierId = MasterManager::getCarrierId();
        $orderInfo->orderReason = 220;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->lmreason = 1;
        $orderType = 0;


        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay520094::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->vipType = $orderItems[0]->vip_type;
        $orderInfo->price = $orderItems[0]->price;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, null, $orderType); // 向CWS获取订单号
        LogUtils::info("Pay520094::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            //创建订购参数
            $payInfo = $this->_buildPayInfo($orderInfo);

            LogUtils::info("Pay520094::webPagePay buildPayInfo --->: " . json_encode($payInfo));

            $intent = IntentManager::createIntent("directPay");
            $intent->setParam("orderParam", rawurlencode(json_encode($payInfo)));
            $goUrl = IntentManager::intentToURL($intent);
            header('Location:' . $goUrl);
        }
        return 0;
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl() {
        $payUrl = "";
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->carrierId = MasterManager::getCarrierId();
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->lmreason = 2;
        $orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay520094::buildDirectPayUrl ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->vipType = $orderItems[0]->vip_type;
        $orderInfo->price = $orderItems[0]->price;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, null, $orderType); // 向CWS获取订单号
        LogUtils::info("Pay520094::buildDirectPayUrl pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            //创建订购参数
            $payInfo = $this->_buildPayInfo($orderInfo);

            LogUtils::info("Pay520094::buildDirectPayUrl buildPayInfo --->: " . json_encode($payInfo));

            $intent = IntentManager::createIntent("directPay");
            $intent->setParam("orderParam", rawurlencode(json_encode($payInfo)));
            $payUrl = IntentManager::intentToURL($intent);
        }
        return $payUrl;
    }

    /**
     * 构建支付回调地址
     * @return string
     */
    public function buildDirectPayReturnUrl() {
        $returnUrl = "";
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->carrierId = MasterManager::getCarrierId();
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->lmreason = 2;
        $orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay520094::buildDirectPayReturnUrl ---> pay orderItem is empty");
            return $returnUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->vipType = $orderItems[0]->vip_type;
        $orderInfo->price = $orderItems[0]->price;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, null, $orderType); // 向CWS获取订单号
        LogUtils::info("Pay520094::buildDirectPayReturnUrl pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            //创建订购参数
            $payInfo = $this->_buildPayInfo($orderInfo);
            $returnUrl = $payInfo->returnUrl;
        }
        $MacId = MasterManager::getSTBMac();
        LogUtils::info("task::MacId:" . $MacId);
        $returnUrl = $returnUrl.'|'.$MacId;
        return $returnUrl;
    }
}