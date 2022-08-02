<?php

namespace Home\Model\Order;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class Pay09000001 extends PayAbstract
{

    /**
     * 用户到局方鉴权，使用cws的接口
     */
    public function authentication($userInfo = null)
    {
        //TODO 先限免（默认注册）。暂未开启计费对接，暂停！！！（Added by listen on 2020-10-22）
//        return true;

        $ret = MasterManager::getUserTypeAuth()==0?false:true;
        return $ret;
    }

    /**
     * 构建订购参数
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayInfo($payInfo = null)
    {
        $payInfo["productId"]=PRODUCT_ID;
        $payInfo["contentId"]=CONTENT_ID;
        $ret['result'] = 0;
        $ret['payInfo'] = $payInfo;
        $ret['authType'] = MasterManager::getAuthType();

        return json_encode($ret);
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

    /**
     * 订购结果会回调
     * @param: null $payResultInfo
     */
    public function uploadPayResult($payResultInfo = null){
        $result = -1;

        $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());
        // 创建支付订单
        if(empty($orderItems)){
            LogUtils::info("pay09000001::buildPayUrl() ---> 产品列表为空：" );
            return json_encode(array("result" => $result));
        }
        $orderInfo = OrderManager::createPayTradeNo( $orderItems[0]->vip_id, 100, "自主订购",$payResultInfo->contentId);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay09000001::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return json_encode(array("result" => $result));
        }
        // 获取订单成功
        $payResultInfo->tradeNo = $orderInfo->order_id;

        $isUploadResult = $this->_uploadPayResult($payResultInfo);
        LogUtils::info("uploadPayResult --->isUploadResult : " . $isUploadResult);
        if ($isUploadResult) {
            $result = 0;
            MasterManager::setVIPUser(1); // 当前用户设置VIP
        }

        return json_encode(array("result" => $result));
    }
    
    /**
     * 上报订购结果,只上报订购成功
     * @param $payResultInfo
     * @return 上报结果
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $url = ORDER_CALL_BACK_URL .
            "?accountId=" . $payResultInfo->accountId.
            "&tradeNo=" . $payResultInfo->tradeNo .
            "&productId=" . PRODUCT_ID;

        LogUtils::info("postPayResultEx --->url : " . $url);
        $uploadPayResult = HttpManager::httpRequest("GET", $url, null);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
    }


    public function buildVerifyUserUrl($param = null)
    {

    }

    public function payShow()
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

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
    }
}