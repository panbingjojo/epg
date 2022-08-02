<?php

namespace Home\Model\Order;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;
use Think\Exception;

class Pay10220095 extends PayAbstract
{

    // 本类日志打印（customized function log)
    private static function c_func_log($tag1, $tag2, $msg, $error_level = false)
    {
        if ($error_level == true) {
            LogUtils::error("[$tag1][$tag2] $msg");
        } else {
            LogUtils::info("[$tag1][$tag2] $msg");
        }
    }

    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed|void
     * @throws Exception
     */
    public function payCallback($payResultInfo = null)
    {
    }

    /**
     * 构建订购返回地址
     * @param array $param //参数数组（关联数组）
     * @param array $extras //额外参数（也是关联数组），可选
     * @return string
     */
    private function _buildPayCallbackUrl($param, $extras = null)
    {

    }

    /**
     * 上报订购成功结果。
     * <pre>备注说明：
     *      由前端调用。因为吉林广电订购成功局方不在backurl里透传其它订购信息（仅有result=success|failed|back），
     * 故需要在payResult.html通过js去查询，再通过ajax调用此方法进行上报到后台cws。
     * </pre>
     * @param $uploadPayInfo //上报订购的所有信息
     * @return false|string
     * @throws Exception
     */
    public function uploadPayResult($uploadPayInfo)
    {
        self::c_func_log(__FILE__, __FUNCTION__, "---> [上报订购][uploadPayInfo]: " . json_encode($uploadPayInfo));

        if ($uploadPayInfo == null) {
            return json_encode(['result' => -1, 'msg' => 'failed upload! argument is null.']);
        }

        $postJson = array(
            // 在我方（朗玛）生成的信息（lmXXX-longmaster缩写，表示朗玛方参数）
            'lmTradeNo' => $uploadPayInfo->lmTradeNo,                //朗玛：我方生成的订单号

            // 局方订购成功得到的订单信息（oYYY-other缩写，表示其他第三方参数）
            'oContentName' => $uploadPayInfo->oContentName,         //局方：套餐名称
            'oPayTime' => $uploadPayInfo->oPayTime,                 //局方：支付时间，例如“2019-05-27 15:15:26”
            'oEndTime' => $uploadPayInfo->oEndTime,                 //局方：结束时间，例如“2019-05-28 23:59:00”
            'oRenew' => $uploadPayInfo->oRenew,                     //局方：续订状态: 0-单月 1-连续包月 2-连续包月（已经取消续订）
            'oPrice' => $uploadPayInfo->oPrice,                     //局方：价格（分）
            'oPayType' => $uploadPayInfo->oPayType,                 ////局方：支付类型 1:移动话费2:联通话费3:电信话费4:支付宝5:微信6:未知7:宽带支付8:零元支付
            'reason' => $uploadPayInfo->lmreason,
        );

        // 执行上报订购结果
        $uploadPayResult = PayAPI::postPayResultEx($postJson);
        self::c_func_log(__FILE__, __FUNCTION__, "---> [上报订购][input_params]: " . json_encode($postJson));
        self::c_func_log(__FILE__, __FUNCTION__, "---> [上报订购][result]: " . $uploadPayResult);

        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult(1);

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($uploadPayInfo->lmIsPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }
        self::c_func_log(__FILE__, __FUNCTION__, ">>> videoInfo: " . $videoInfo);

        $isVip = UserManager::isVip($uploadPayInfo->lmuid);
        MasterManager::setUserIsVip(1);
        if ($isVip == 1 && $uploadPayInfo->lmIsPlaying == 1 && $videoInfo != null && $videoInfo != "") {
            // 继续播放
            self::c_func_log(__FILE__, __FUNCTION__, ">>> jump player!");
            $objPlayer = IntentManager::createIntent("player");
            $objPlayer->setParam("userId", $uploadPayInfo->lmuid);
            $objPlayer->setParam("isPlaying", $uploadPayInfo->lmIsPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        } else if ($uploadPayInfo->lmReturnPageName != "") {
            self::c_func_log(__FILE__, __FUNCTION__, ">>> jump returnPageName: $uploadPayInfo->lmReturnPageName");
            $objReturn = IntentManager::createIntent($uploadPayInfo->lmReturnPageName);
            IntentManager::jump($objReturn);
        }

        // 查询并设置续包月标志
        self::queryAndSetAutoOrderFlag();

        return json_encode(['result' => 0, 'msg' => 'success upload!']);
    }

    /**
     * 构建订购回调通知地址，一般用于来自前端请求。
     * @param $payInfoObj //订购参数对象
     * @return mixed
     */
    public function buildPayCallbackUrl($payInfoObj)
    {

    }

    /**
     * 查询当前用户是否为续包月用户，并把标志写入session，并返回是否为续包月用户标志。
     * @param null $lmUserId //我方（朗玛的userId）
     * @return bool true-续包月用户 false-非续包月用户
     * @throws Exception
     */
    public static function queryAndSetAutoOrderFlag($lmUserId = null)
    {
        $lmuid = $lmUserId != null && $lmUserId != "" ? $lmUserId : MasterManager::getUserId();
        $vipInfo = UserManager::queryVipInfo($lmuid); //查询vip信息
        $isRenew = $vipInfo->result == 0 && ($vipInfo->auto_order == 1 || $vipInfo->last_order_trade_no == null || $vipInfo->last_order_trade_no == "");
        MasterManager::setAutoOrderFlag($isRenew ? "1" : "0");
        self::c_func_log(__FILE__, __FUNCTION__, "---> 订购成功[订单号=$vipInfo->last_order_trade_no]且为续包月用户[$lmuid]：" . ($isRenew ? "[是]" : "[否]"));
        return $isRenew;
    }

    /**
     * 到局方鉴权，只有包月产品才能鉴权。（可以鉴权其他CP的产品，需要传递产品信息）
     * @param $productInfo //鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authentication($productInfo = null)
    {
        $isVIP = 0;
        $authResult = $this->getAuthResult();
        if ($authResult["result"] == 0) {
            $expiredDate = $authResult["expiredTime"];
            $currentDate = date("Y-m-d H:i:s", time());
            LogUtils::info("currentDate = " . $currentDate . ";expiredDate = " . $expiredDate);
            $currentTime = strtotime($currentDate);
            $expiredTime = strtotime($expiredDate);
            LogUtils::info("currentTime = " . $currentTime . ";expiredTime = " . $expiredTime);
            if ($expiredTime > $currentTime) {
                $isVIP = 1;
            }
        }
        return $isVIP;
    }

    public function getAuthResult(){
        $authUrl = SERVICE_AUTH . "?productId=" . PRODUCT_ID . "&userId=" . MasterManager::getAccountId() . "&chargesType=1";
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth authURL:" . $authUrl);
        $respond = HttpManager::httpRequest("GET", $authUrl, "");
        LogUtils::info(">>>>>>>>>>>>>>>>>>>> userAuth respond:" . $respond);
        $respond = json_decode($respond, true);
        return $respond[PRODUCT_ID];
    }

    /**
     * 构建到局方的订购地址所需的参数。
     *
     * 注意：[吉林广电]该方法没有直接生成局方订购地址，只是准备相关参数。订购通过前端js调用小沃sdk进行订购。
     *
     * @param $payInfoObj
     * @return mixed
     */
    public function buildPayUrl($payInfoObj = null)
    {
        // TODO: Implement buildPayUrl() method.
    }

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfoObj
     * @return mixed
     */
    public function buildUnPayUrl($payInfoObj = null)
    {
        // TODO: Implement buildUnPayUrl() method.
    }

    /**
     * 构建到局方用户验证地址
     * @param null $returnUrl
     * @return mixed
     */
    public function buildVerifyUserUrl($returnUrl = null)
    {
        // TODO: Implement buildVerifyUserUrl() method.
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl()
    {

    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        // TODO: Implement directToPay() method.
    }

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     */
    public function unPayCallback($unPayResultInfo = null)
    {
        // TODO: Implement unPayCallback() method.
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
        $userAccount = MasterManager::getAccountId();

        $info = array(
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platfromType' => MasterManager::getPlatformType(),
            'platformTypeExt' => MasterManager::getPlatformTypeExt(),
            'accountId' => $userAccount,
            "stbId" => MasterManager::getSTBId(),
            "areaCode" => MasterManager::getAreaCode(),
            "productId" => PRODUCT_ID,
        );

        return $info;
    }

    public function interfacePay($userInfo)
    {
        $payResult = array(
            'result' => -1,
            'message' => "订购失败"
        );

        $orderInfo = new \stdClass();
        $orderInfo->userId = MasterManager::getUserId();
        $orderInfo->orderReason = 220;
        $orderInfo->remark = "login";
        $orderInfo->orderType = 0;
        $orderInfo->lmreason = 1;

        $beginTime = date('Y-m-d h:i:s', time());
        //拉取订购项
        $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("interfacePay::getOrderItem() ---> orderItems is empty");
            $payResult['message'] = "获取订购项失败";
            return json_encode($payResult, JSON_UNESCAPED_UNICODE);
        }
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->price = $orderItems[0]->price;
        $orderInfo->goodsName = $orderItems[0]->goods_name;

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 生成订购单号失败
            LogUtils::info("interfacePay::createPayTradeNo() ---> 拉取订单失败:" . $tradeInfo->result);
            $payResult['message'] = "生成订单号失败";
            return json_encode($payResult, JSON_UNESCAPED_UNICODE);
        }

        // 调用下单接口
        $serviceOrderURL = USER_ORDER_URL . "/orders/service_order?spId=" . SP_ID . "&productId=" . PRODUCT_ID . "&userId=" . $userInfo->accountId
            . "&chargesType=1&areaId=" . AREA_ID . "&customerRenew=1&cycleType=1&fee=" . $orderInfo->price;
        LogUtils::info("interfacePay --> user serviceOrder url:  " . $serviceOrderURL);
        $serviceInfo = HttpManager::httpRequest("GET", $serviceOrderURL, "");
        LogUtils::info("interfacePay --> user serviceOrder result:  " . $serviceInfo);
        $serviceInfoJson = json_decode($serviceInfo);

        // 调用支付接口
        $payBillURL = USER_ORDER_URL . "/orders/payBill/" . $serviceInfoJson->orderId . "?payType=4";
        LogUtils::info("interfacePay --> user payBillURL url:  " . $payBillURL);
        $payBillResult = HttpManager::httpRequest("GET", $payBillURL, "");
        LogUtils::info("interfacePay --> user payBillURL result:  " . $payBillResult);


        // 再次鉴权，得到此次订单的过期时间
        $doAuthURL = SERVICE_AUTH . "?productId=" . PRODUCT_ID . "&userId=" . $userInfo->accountId . "&chargesType=1";
        LogUtils::info("interfacePay --> user serviceAuth url:  " . $doAuthURL);
        $AuthResult = HttpManager::httpRequest("GET", $doAuthURL, "");
        LogUtils::info("interfacePay --> user serviceAuth result:  " . $AuthResult);
        $AuthResultArr = json_decode($AuthResult, true);
        $resultArr = $AuthResultArr["1100000481"];
        $postJson = array(
            'result' => $resultArr['result'],
            // 在我方（朗玛）生成的信息（lmXXX-longmaster缩写，表示朗玛方参数）
            'lmTradeNo' => $tradeInfo->order_id,                //朗玛：我方生成的订单号

            // 局方订购成功得到的订单信息（oYYY-other缩写，表示其他第三方参数）
            'oContentName' => $orderInfo->goodsName,         //局方：套餐名称
            'oPayTime' => $beginTime,                 //局方：支付时间，例如“2019-05-27 15:15:26”
            'oEndTime' => $resultArr["expiredTime"],                 //局方：结束时间，例如“2019-05-28 23:59:00”
            'oRenew' => 1,                     //局方：续订状态: 0-单月 1-连续包月 2-连续包月（已经取消续订）
            'oPrice' => $orderInfo->price,                     //局方：价格（分）
            'oPayType' => 4,                 ////局方：支付类型 1:移动话费2:联通话费3:电信话费4:支付宝5:微信6:未知7:宽带支付8:零元支付
            'reason' => $orderInfo->lmreason,
        );

        // 执行上报订购结果
        $uploadPayResult = PayAPI::postPayResultEx($postJson);

        LogUtils::info("postPayResultEx ---> $uploadPayResult");

        $payResult['result'] = 0;
        $payResult['message'] = "订购成功";
        LogUtils::info("payResult ---> " . json_encode($payResult));
        return json_encode($payResult, JSON_UNESCAPED_UNICODE);
    }

    /**
     * 进入订购界面前，特殊处理并将需要渲染的参数返回
     * -- 此处返回局方设置的产品信息
     */
    public function payShow()
    {
        $extraData = array(
            "qrCodeCommonUrl" => ORDER_SERVER_URL . '/orders',
        );
        return json_encode($extraData);
    }

    public function serviceOrder($customerRenew, $cycleType, $fee)
    {
        $serviceOrderParams = "?spId=" . SP_ID . "&productId=" . PRODUCT_ID . "&userId=" . MasterManager::getAccountId() .
            "&chargesType=1&areaId=" . AREA_ID . "&customerRenew=" . $customerRenew . "&cycleType=" . $cycleType . "&fee=" . $fee;
        $serviceOrderURL = SERVICE_ORDER_URL . $serviceOrderParams;
        LogUtils::info("Pay10220095::serviceOrder,serviceOrderURL = $serviceOrderURL");
        $result = HttpManager::httpRequest("GET", $serviceOrderURL, null);
        LogUtils::info("Pay10220095::serviceOrder,result = $result");
        return $result;
    }

    public function getCheckCode($userPhone, $userAccount)
    {
        $getCheckCodeURL = GET_CHECK_CODE_URL . '/' . $userPhone . '/' . $userAccount;
        LogUtils::info("Pay10220095::getCheckCode,getCheckCodeURL = $getCheckCodeURL");
        $result = HttpManager::httpRequest("GET", $getCheckCodeURL, null);
        LogUtils::info("Pay10220095::getCheckCode,result = $result");
        return $result;
    }

    public function payByPhone($orderId, $payType, $userPhone, $checkCode)
    {
        $payParams = "?payType=" . $payType . "&phone=" . $userPhone . "&checkCode=" . $checkCode;
        $payByPhoneURL = PAY_BILL_URL . '/' . $orderId . $payParams;
        LogUtils::info("Pay10220095::getCheckCode,payByPhoneURL = $payByPhoneURL");
        $result = HttpManager::httpRequest("GET", $payByPhoneURL, null);
        LogUtils::info("Pay10220095::getCheckCode,result = $result");
        return $result;
    }

    public function payByBill($orderId, $payType)
    {
        $payParams = "?payType=" . $payType;
        $payByBillURL = PAY_BILL_URL . '/' . $orderId . $payParams;
        LogUtils::info("Pay10220095::getCheckCode,payByBillURL = $payByBillURL");
        $result = HttpManager::httpRequest("GET", $payByBillURL, null);
        LogUtils::info("Pay10220095::getCheckCode,result = $result");
        return $result;
    }

    public function queryOrderStatus($orderId){
        $orderStatusURL = ORDER_STATUS_URL . '/' . $orderId;
        LogUtils::info("Pay10220095::getCheckCode,orderStatusURL = $orderStatusURL");
        $result = HttpManager::httpRequest("GET", $orderStatusURL, null);
        LogUtils::info("Pay10220095::getCheckCode,result = $result");
        return $result;
    }

    /**
     * 获取产品信息
     * @return mixed|string
     */
    public function getProductInfo(){
        $userId = MasterManager::getAccountId();
        $productInfoUrl = PRODUCT_INFO_URL . '/' . $userId . '/' . PRODUCT_ID;
        LogUtils::info("Pay10220095::getProductInfo,productInfoUrl = $productInfoUrl");
        $result = HttpManager::httpRequest("GET", $productInfoUrl, null);
        LogUtils::info("Pay10220095::getProductInfo,result = $result");
        return $result;
    }
}