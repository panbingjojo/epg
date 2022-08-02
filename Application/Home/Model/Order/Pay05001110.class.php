<?php

namespace Home\Model\Order;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class Pay05001110 extends PayAbstract{

    public function authentication($param = null)
    {

    }

    public function buildVerifyUserUrl($param = null)
    {

    }

    public function payShow()
    {

    }

    public function buildPayInfo($payInfo = null)
    {

    }

    public function buildUnPayUrl($payInfo = null)
    {

    }

    public function directToPay($orderInfo = null)
    {

    }

    public function payCallback($payResultInfo = null)
    {

    }

    public function unPayCallback($unPayResultInfo = null)
    {

    }

    public function payShowResult($payController = null)
    {

    }

    public function uploadPayResult($payResultInfo = null){
        $result = -1;

        $payResultInfo->accountId = MasterManager::getAccountId();

        $isUploadResult = $this->_uploadPayResult($payResultInfo);
        LogUtils::info("uploadPayResult --->isUploadResult : " . $isUploadResult);
        if ($isUploadResult) {
            $result = 0;
            MasterManager::setVIPUser(1); // 当前用户设置VIP
        }

        return json_encode(array("result" => $result));
    }

    private function _uploadPayResult($payResultInfo = null)
    {
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $url = ORDER_CALL_BACK_URL .
            "?accountId=" . $payResultInfo->accountId.
            "&tradeNo=" . $payResultInfo->tradeNo .
            "&productId=" . CONTENTID;

        LogUtils::info("postPayResultEx --->url : " . $url);
        $uploadPayResult = HttpManager::httpRequest("GET", $url, null);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
    }

    public function buildPayUrl($payInfo = null)
    {
        $ret = array();
        $payInfo = new \stdClass();
        $orderItems = OrderManager::getOrderItem();
        $payInfo->vip_id = $orderItems[0]->vip_id;
        $payInfo->orderReason=102;
        $payInfo->remark = "";

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark);
        if ($tradeInfo->result != 0) {
            // 创建失败
            LogUtils::error("createPayTradeNo 创建订单失败:".json_encode($tradeInfo));
            $ret['result'] = $tradeInfo->result;
            $ret['lmOrderId'] = "";
            return json_encode($ret);
        }
        $ret['result'] = 0;
        $ret['lmOrderId']= $tradeInfo->order_id;
        return json_encode($ret);
    }

    public function getProductInfo(){
        $result = new \stdClass();
        $result->contentId = CONTENTID;
        $result->productId = CONTENTID;
        $result->spToken = "";
        return json_encode($result);
    }
}