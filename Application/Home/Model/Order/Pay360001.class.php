<?php

namespace Home\Model\Order;


use Home\Model\Common\LogUtils;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;

class Pay360001 extends PayAbstract
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
     */
    public function buildPayInfo($payInfo = null)
    {
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
     */
    public function directToPay($orderInfo = null)
    {
        return;
    }

    /**
     * 订购回调接口
     * @param null $payResultInfo
     * @return mixed
     */
    public function payCallback($payResultInfo = null)
    {
        if ($payResultInfo == null) {
            $payResultInfo = new \stdClass();
            $payResultInfo->isOrder = $_GET['isOrder'];
        }
        LogUtils::info(" payCallback 360001 ---> payResult: " . json_encode($payResultInfo));

        //默认订购失败
        $isVip = 0;
        $msg = "订购失败";
        if(isset($payResultInfo->isOrder)){
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

        //显示订购结果页面
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $isVip);
        $showOrderResultObj->setParam("msg", $msg);

        $intent = IntentManager::createIntent($payResultInfo->returnPageName);
        IntentManager::jump($showOrderResultObj, $intent, IntentManager::$INTENT_FLAG_DEFAULT);
    }

    /**
     * 订购结果显示界面前，特殊处理并将需要渲染的参数返回
     * @param null $payController
     * @return array
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
     */
    public function unPayCallback($unPayResultInfo = null)
    {
        return;
    }

    /**
     * 构建订购返回地址
     * @param null $payInfo
     * @return string
     */
    private function _buildPayCallbackUrl($payInfo = null)
    {
        $intent = IntentManager::createIntent("payCallback");
        MasterManager::setPayCallbackParams(json_encode($payInfo));

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            if(MasterManager::isRunOnPC()){
                $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
            } else {
                $url = APP_ROOT_PATH . $url;                      // 回调地址需要加上全局路径
            }
        }
        return $url;
    }

    /**
     * 生成订购参数,附加到$payInfo中
     * @param $payInfo
     * @return mixed
     */
    private function _buildPayInfo($payInfo)
    {
        //拉取订购项
        $userId = MasterManager::getUserId();
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("pay360001Action::buildAutoPayUrl ---> orderItem is empty");
        }

        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($orderItems[0]->vip_id, 0, "视频问诊");
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;
        $payInfo->returnUrl = $this->_buildPayCallbackUrl($payInfo);  //构建返回地址
        return $payInfo;
    }

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
    }
}