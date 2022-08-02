<?php

namespace Home\Model\Order;


use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Entry\MasterManager;

class Pay09340001 extends PayAbstract
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

        if ($payInfo == null) {
            $ret['result'] = -1;
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
        // 订购成功，回调
        $isVip = 1;

        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult($isVip);

        // 用户是否是VIP，更新到session中
        MasterManager::setVIPUser($isVip);

        $uploadInfo = array(
            "tradeNo" => $payResultInfo ? $payResultInfo : '',
            "accountId" => MasterManager::getAccountId(),
        );

        // 打印信息获取orderId
        LogUtils::info("Pay09340001，payCallBack orderId >> " . $payResultInfo);

        // 发起Http请求通知CWS
        return PayAPI::postPayResultEx($uploadInfo);;
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
            LogUtils::error("Pay09340001Action::_buildPayInfo ---> orderItem is empty");
            return null;
        }else {
            // 创建支付订单
            $orderInfo = OrderManager::createPayTradeNo($orderItems[0]->vip_id, 103, "视频问诊");
            //获取订单成功
            if ($payInfo == null) {
                $payInfo = new \stdClass();
            }

            $payInfo->tradeNo = $orderInfo->order_id;
            $payInfo->orderReason = 103;
            $payInfo->payParam = MasterManager::getAnhuiAuthCallbackParam();
            return $payInfo;
        }
    }

    /**
     * 订购结果会回调
     * @param: null $payResultInfo
     */
    public function uploadPayResult($payResultInfo = null){
        $result = -1;

        $isUploadResult = $this->_uploadPayResult($payResultInfo);
        LogUtils::info('isUploadResult = '.$isUploadResult);
        if ($isUploadResult) $result = 0;
        MasterManager::setVIPUser(1); // 当前用户设置VIP
        return json_encode(array("result" => $result));
    }


    /**
     * 上报订购结果
     * @param $payResultInfo
     * @return 上报结果
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        $payResultInfo = array(
            'tradeNo' => $payResultInfo->lmTradeNo,
            'userId' => $payResultInfo->lmuid,
            'accountId' => $payResultInfo->lmAccountId,
            'carrierId' => $payResultInfo->lmcid,
            'orderReason' => $payResultInfo->lmReason,
        );
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $uploadPayResult = PayAPI::postPayResultEx($payResultInfo);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
    }

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
    }
}