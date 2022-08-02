<?php

namespace Home\Model\Order;


use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;
use Think\Exception;

class Pay220094 extends PayAbstract
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
        self::c_func_log(__FILE__, __FUNCTION__, "--->[_REQUEST params]: " . json_encode($_REQUEST));
        self::c_func_log(__FILE__, __FUNCTION__, "--->[args params]: " . json_encode($payResultInfo));

        if ($payResultInfo == null) {
            $payResultInfo = new \stdClass();
            $payResultInfo->lmuid = $_REQUEST['lmuid'];//我们EPG在我方系统里的“用户id”
            $payResultInfo->lmAccountId = $_REQUEST['lmAccountId'];//我们EPG在我方系统里的“用户id”
            $payResultInfo->lmcid = $_REQUEST['lmcid'];//我们EPG在我方系统里的“地区id”
            $payResultInfo->lmTradeNo = $_REQUEST['lmTradeNo'];//我们EPG在我方系统里的“订单号”
            $payResultInfo->lmReason = $_REQUEST['lmReason'];//我们EPG在我方系统里的“订购理由”
            $payResultInfo->lmIsPlaying = isset($_REQUEST['lmIsPlaying']) ? $_REQUEST['lmIsPlaying'] : 0;//我们EPG在我方系统里的“正在播放视频标志”
            $payResultInfo->lmVideoInfo = isset($_REQUEST['lmVideoInfo']) && $_REQUEST['lmVideoInfo'] != "" ? rawurldecode($_REQUEST['lmVideoInfo']) : "";//我们EPG在我方系统里的“正在播放视频信息”
            $payResultInfo->lmReturnPageName = isset($_REQUEST['lmReturnPageName']) && $_REQUEST['lmReturnPageName'] != null ? $_REQUEST['returnPageName'] : "";
            $payResultInfo->successFlag = isset($_REQUEST['successFlag']) ? $_REQUEST['successFlag'] : 0;//模拟在局方订购结果标志：1-成功，0-失败
            $payResultInfo->result = isset($_REQUEST['result']) ? $_REQUEST['result'] : "";//真实来自局方订购回调通知的结果result(result取值有:success|failed|back)
        }

        self::c_func_log(__FILE__, __FUNCTION__, ">>> [吉林广电局方订购页]返回的result取值: " . $payResultInfo->result);
        self::c_func_log(__FILE__, __FUNCTION__, ">>> payResult: " . json_encode($payResultInfo));

        // 从局方订购页返回后，是否订购成功
        $isOrderSuccess = $payResultInfo->result == "success";
        $isVip = UserManager::isVip($payResultInfo->lmuid);
        if ($isOrderSuccess) {
            // 上报订购结果
            // TODO 注意：吉林广电全为js接口，故需要在html页面获取订购信息单独使用ajax上报！！！
            if ($payResultInfo->lmReason == 2 && !empty($payResultInfo->lmAccountId)) {
                // 直接调用接口上报订购结果
                $data = $this->_queryMyorders($payResultInfo->lmAccountId);
                if (!empty($data) && $data->result == 1) {
                    $postData = new \stdClass();
                    $postData->lmTradeNo =  $payResultInfo->lmTradeNo;
                    $postData->oContentName =  $data->contentName;
                    $postData->oPayTime =  $data->payTime;
                    $postData->oEndTime =  $data->endTime;
                    $postData->oRenew =  $data->renew;
                    $postData->oPrice =  $data->price;
                    $postData->oPayType =  $data->payType;
                    $postData->lmreason =  $payResultInfo->lmReason;
                    $this->uploadPayResult($postData);
                    self::c_func_log(__FILE__, __FUNCTION__, ">>> uploadPayResult postData: " . json_encode($postData));
                }else{
                    $firstday = date("Y-m-d H:i:s");
                    $lastday = date("Y-m-d  H:i:s",strtotime("$firstday +1 month "));
                    $postData = new \stdClass();
                    $postData->lmTradeNo =  $payResultInfo->lmTradeNo;
                    $postData->oContentName =  $data->contentName;
                    $postData->oPayTime =  isset($data->payTime)?$data->payTime:$firstday;
                    $postData->oEndTime =  isset($data->payendTimeTime)?$data->endTime:$lastday;//$data->endTime;
                    $postData->oRenew =  isset($data->renew)?$data->renew:1;//$data->renew;
                    $postData->oPrice =  isset($data->price)?$data->price:2500;//$data->price;
                    $postData->oPayType =  isset($data->payType)?$data->payType:7;//$data->payType;

                    $postData->lmreason =  $payResultInfo->lmReason;
                    $this->uploadPayResult($postData);
                    self::c_func_log(__FILE__, __FUNCTION__, ">>> uploadPayResult postData: " . json_encode($postData));
                }
            }
            // 到我方注册成为vip，不关心注册是否成功，
            UserManager::regVip(MasterManager::getUserId());

            // 判断用户是否是VIP，更新到session中
            $isVip = UserManager::isVip($payResultInfo->lmuid);
            MasterManager::setUserIsVip(1);

            // 查询用户的VIP身份并设置续包月标志
            self::queryAndSetAutoOrderFlag();
        }

        if ($payResultInfo->lmReason == 2 && !empty($payResultInfo->lmAccountId)) {
            // TODO lmReason=2 时 直接查询结果 上报订购结果
            $data = $this->_queryMyorders($payResultInfo->lmAccountId);
            if (!empty($data) && $data->result == 1) {
                $postData = new \stdClass();
                $postData->lmTradeNo =  $payResultInfo->lmTradeNo;
                $postData->oContentName =  $data->contentName;
                $postData->oPayTime =  $data->payTime;
                $postData->oEndTime =  $data->endTime;
                $postData->oRenew =  $data->renew;
                $postData->oPrice =  $data->price;
                $postData->oPayType =  $data->payType;
                $postData->lmreason =  $payResultInfo->lmReason;
                $this->uploadPayResult($postData);
                // 到我方注册成为vip，不关心注册是否成功，
                UserManager::regVip(MasterManager::getUserId());

                // 判断用户是否是VIP，更新到session中
                $isVip = UserManager::isVip($payResultInfo->lmuid);
                MasterManager::setUserIsVip(1);

                // 查询用户的VIP身份并设置续包月标志
                self::queryAndSetAutoOrderFlag();
                self::c_func_log(__FILE__, __FUNCTION__, ">>> uploadPayResult postData: " . json_encode($postData));
            }
        }


        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult($isOrderSuccess ? 1 : 0);

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->lmVideoInfo != null && $payResultInfo->lmVideoInfo != "") {
            $videoInfo = $payResultInfo->lmVideoInfo;
        } else if ($payResultInfo->lmIsPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }
        self::c_func_log(__FILE__, __FUNCTION__, ">>> videoInfo: " . $videoInfo);

        if(MasterManager::getAccountId()=="hwcsbs1" || true){
            if ($isVip == 1 && $payResultInfo->lmIsPlaying == 1 && $videoInfo != null && $videoInfo != "") {
                // 继续播放
                self::c_func_log(__FILE__, __FUNCTION__, ">>> jump player!");
                $objSrc = IntentManager::createIntent("player");
                $objSrc->setParam("userId", $payResultInfo->lmuid);
                $objSrc->setParam("isPlaying", $payResultInfo->lmIsPlaying);
                $objSrc->setParam("videoInfo", json_encode($videoInfo));
            } else {
                self::c_func_log(__FILE__, __FUNCTION__, ">>> jump returnPageName: $payResultInfo->lmReturnPageName");
                $objSrc = IntentManager::createIntent($payResultInfo->lmReturnPageName);
            }

            $objDst = IntentManager::createIntent("authOrder");
            $objDst->setParam("isSuccess", $isOrderSuccess);
            $objDst->setParam("orderParam", json_encode($payResultInfo));//当前的订购参数信息
            IntentManager::jump($objDst,$objSrc);
            return;
        }

        // 生成订购结果显示界面
        $objDst = IntentManager::createIntent("payShowResult");
        $objDst->setParam("isSuccess", $isOrderSuccess);
        $objDst->setParam("orderParam", json_encode($payResultInfo));//当前的订购参数信息

        if ($isVip == 1 && $payResultInfo->lmIsPlaying == 1 && $videoInfo != null && $videoInfo != "") {
            // 继续播放
            self::c_func_log(__FILE__, __FUNCTION__, ">>> jump player!");
            $objSrc = IntentManager::createIntent("player");
            $objSrc->setParam("userId", $payResultInfo->lmuid);
            $objSrc->setParam("isPlaying", $payResultInfo->lmIsPlaying);
            $objSrc->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objDst, $objSrc);
        } else {
            self::c_func_log(__FILE__, __FUNCTION__, ">>> jump returnPageName: $payResultInfo->lmReturnPageName");
            $objSrc = IntentManager::createIntent($payResultInfo->lmReturnPageName);
            IntentManager::jump($objDst, $objSrc, IntentManager::$INTENT_FLAG_DEFAULT);
        }
    }

    /**
     * 构建订购返回地址
     * @param array $param //参数数组（关联数组）
     * @param array $extras //额外参数（也是关联数组），可选
     * @return string
     */
    private function _buildPayCallbackUrl($param, $extras = null)
    {
        $intent = IntentManager::createIntent("payCallback");
        if ($param != null && is_array($param)) {
            foreach ($param as $key => $value) {
                $intent->setParam($key, $value);
            }
        }
        if ($extras != null && is_array($extras)) {
            foreach ($extras as $key => $value) {
                $intent->setParam($key, $value);
            }
        }

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        return $url;
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
        // 一些我我方订购参数，用于组织到通知回调地址中。便于回调通知时，判断指定的订单对应的订购结果是成功或者失败。
        $param = array(
            "lmcid" => $payInfoObj->lmcid,
            "lmuid" => $payInfoObj->lmuid,
            "lmAccountId" => MasterManager::getAccountId(),
            "lmTradeNo" => $payInfoObj->lmTradeNo,//我方生成的订单id
            "lmReason" => $payInfoObj->lmReason != null ? $payInfoObj->lmReason : 0,
            "lmReturnPageName" => $payInfoObj->lmReturnPageName,
            "lmRemark" => $payInfoObj->lmRemark,//备注
            "lmIsPlaying" => $payInfoObj->lmIsPlaying,
            "lmVideoInfo" => rawurlencode($payInfoObj->lmVideoInfo),
        );

        $callbackUrl = $this->_buildPayCallbackUrl($param);  //构建返回地址, successFlag 1-成功 0-失败

        self::c_func_log(__FILE__, __FUNCTION__, "---> [buildPayCallbackUrl][input_params]: " . json_encode($param));
        self::c_func_log(__FILE__, __FUNCTION__, "---> [buildPayCallbackUrl][callbackUrl]: " . $callbackUrl);

        return json_encode(array(
            'result' => empty($callbackUrl) || $callbackUrl == "" ? -1 : 0,
            'url' => $callbackUrl
        ));
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
        $isVip = 0;
        $userAccount = MasterManager::getAccountId();
        $data = $this->_queryMyorders($userAccount);
        if (!empty($data) && $data->result == 1) {
            $isVip = 1;
        }
        return $isVip;
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
    public function buildDirectPayUrlEx()
    {
        // TODO: Implement buildDirectPayUrl() method.
        LogUtils::info("Pay220094::buildDirectPayUrl ---> start");
        $payUrl = "";
        $userId = MasterManager::getUserId();
        $accountId = MasterManager::getAccountId();
        $orderReason = 221;
        $lmReason = 2;
        $remark = "login";
        $orderType = 1;
        $isPlaying = 0;

        // 拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay220094::buildDirectPayUrl ---> pay orderItem is empty");
            return $payUrl;
        }
        // 获取订购项
        $orderNoJson = OrderManager::createPayTradeNo( $orderItems[0]->vip_id, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("Pay220094::buildDirectPayUrl ---> user [ . $userId . ]request transactionID --> result:" . $orderNoJson->order_id);
        if ($orderNoJson->result == 0) {
            $param = array(
                "lmcid" => MasterManager::getCarrierId(),
                "lmuid" => $userId,
                "lmAccountId" => $accountId,
                "lmTradeNo" => $orderNoJson->order_id,//我方生成的订单id
                "lmReason" => $lmReason,
                "lmReturnPageName" => "",
                "lmRemark" => $remark,//备注
                "lmIsPlaying" => $isPlaying,
                "lmVideoInfo" => "",
            );
            $succCallbackUrl = $this->_buildPayCallbackUrl($param, array(
                "successFlag" => 1,
                "result" => "success",
            ));  //构建返回地址, successFlag 1-成功 0-失败
            $failCallbackUrl = $this->_buildPayCallbackUrl($param, array(
                "successFlag" => 0,
                "result" => "failed",
            ));  //构建返回地址, successFlag 1-成功 0-失败
            $ordersInfo = $this->_ordersPrecreate($accountId);
            if ($ordersInfo != null && !empty($ordersInfo->orderid)){
                $buyOrderInfo = $this->_buyOrder($ordersInfo);
                if ($buyOrderInfo != null && !empty($buyOrderInfo->orderId)){
                    $webpayInfo = $this->_webpayPay($ordersInfo, $buyOrderInfo, $succCallbackUrl, $failCallbackUrl);
                    $payUrl = $this->_buildWebpayUrl($webpayInfo);
                    // 跟上我方的订单号：
                    if (!empty($payUrl)) {
                        $payUrl = $payUrl . "&lmTradeNo=" . $orderNoJson->order_id;
                    }
                }
            }
        }
        return $payUrl;
    }

    /**
     * @brief: 构建由外部直接调用的订购页参数
     * @return null|string
     */
    public function buildDirectPayUrl()
    {
        // TODO: Implement buildDirectPayUrl() method.
        LogUtils::info("Pay220094::buildDirectPayUrl ---> start");
        $userId = MasterManager::getUserId();
        $accountId = MasterManager::getAccountId();
        $orderReason = 221;
        $lmReason = 2;
        $remark = "login";
        $orderType = 1;
        $isPlaying = 0;

        // 送给页面的参数，这里不再是完整的地址
        $arrayResult = null;

        // 拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay220094::buildDirectPayUrl ---> pay orderItem is empty");
            return $arrayResult;
        }
        // 获取订购项
        $orderNoJson = OrderManager::createPayTradeNo( $orderItems[0]->vip_id, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("Pay220094::buildDirectPayUrl ---> user [ . $userId . ]request transactionID --> result:" . $orderNoJson->order_id);
        if ($orderNoJson->result == 0) {
            $param = array(
                "lmcid" => MasterManager::getCarrierId(),
                "lmuid" => $userId,
                "lmAccountId" => $accountId,
                "lmTradeNo" => $orderNoJson->order_id,//我方生成的订单id
                "lmReason" => $lmReason,
                "lmReturnPageName" => "",
                "lmRemark" => $remark,//备注
                "lmIsPlaying" => $isPlaying,
                "lmVideoInfo" => "",
            );
            $succCallbackUrl = $this->_buildPayCallbackUrl($param, array(
                "successFlag" => 1,
                "result" => "success",
            ));  //构建返回地址, successFlag 1-成功 0-失败
            $failCallbackUrl = $this->_buildPayCallbackUrl($param, array(
                "successFlag" => 0,
                "result" => "failed",
            ));  //构建返回地址, successFlag 1-成功 0-失败
            //$succCallbackUrl = str_replace("&", "&amp;", $succCallbackUrl);
            //$failCallbackUrl = str_replace("&", "&amp;", $failCallbackUrl);

            $epgInfoMap = MasterManager::getEPGInfoMap();
            $epgInfoMap['succCallbackUrl'] = urlencode($succCallbackUrl);
            $epgInfoMap['failCallbackUrl'] = urlencode($failCallbackUrl);
            MasterManager::setEPGInfoMap($epgInfoMap);

            $arrayResult['lmTradeNo'] = $orderNoJson->order_id;
            $arrayResult['accountId'] = $accountId;
            $arrayResult['succCallbackUrl'] = $succCallbackUrl;
            $arrayResult['failCallbackUrl'] = $failCallbackUrl;

            $ordersInfo = $this->_ordersPrecreate($accountId);
            if ($ordersInfo != null && !empty($ordersInfo->orderid)){
                $buyOrderInfo = $this->_buyOrder($ordersInfo);
                if ($buyOrderInfo != null && !empty($buyOrderInfo->orderId)){
                    $arrayResult['ordersInfo'] = $ordersInfo;
                    $arrayResult['buyOrderInfo'] = $buyOrderInfo;
                }
            }
        }
        return $arrayResult;
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

    public function webPagePay($userInfo) {
        $userId = MasterManager::getUserId();
        $orderInfo = new \stdClass();
        $orderInfo->isPlaying = 0;
        $orderInfo->videoInfo = "";
        $orderInfo->remark = "login";
        $orderInfo->orderReason = 220;
        $orderInfo->returnPageName = "";
        $orderInfo->lmreason = 1;
        $orderInfo->productId = $userInfo->productId;

        $intent = IntentManager::createIntent("tempPayPage");
        $intent->setParam("orderParam", rawurlencode(json_encode($orderInfo)));

        $goUrl = IntentManager::intentToURL($intent);
        header('Location:' . $goUrl);
    }

    // 产品鉴权
    private function _authProduct($account){
        $contentId = "unknown";
        $products = "2010000024-2010000023"; // 两个产品包 2010000024 续保月，2010000023 单月
        $userId = $account;
        $authURL = "http://139.215.93.156:9080/valuedas/api/1.0/authorization/auth";
        $authURL = $authURL . "?userId=" . $userId;
        $authURL = $authURL . "&productIds=" . $products;
        $authURL = $authURL . "&$contentId=" . $contentId;

        LogUtils::info("Pay220094::_authProduct() ---> httpRequest url:" . $authURL);
        $result = HttpManager::httpRequest("GET", $authURL, "");
        LogUtils::info("Pay220094::_authProduct() ---> httpRequest result:" . json_encode($result));

        return json_decode($result);
    }

    // 产品鉴权
    private function _ordersPrecreate($account){
        $header = array(
            'Content-type: application/json',
        );
        $param = array(
            "UserId" => $account,
            "productId" => "2010000024",
            "contentId" => "unknown",
            "contentName" => "()",
            "ColumnId" => "",
        );
        $url = "http://139.215.93.156:9080/valuedas/api/1.0/Orders/Precreate";
        LogUtils::info("Pay220094::_ordersPrecreate() ---> httpRequest url:" . $url);
        $result = HttpManager::httpRequestByHeader("POST", $url, $header, json_encode($param));
        LogUtils::info("Pay220094::_ordersPrecreate() ---> httpRequest result:" . json_encode($result));

        return json_decode($result);
    }

    // 产品鉴权
    private function _buyOrder($ordersInfo){
        $header = array(
            'Content-type: application/json',
        );
        $fir = "unknown";
        $pid = "unknown";
        $contentName = urlencode("电视家庭医生(续订)");
        $url = "http://139.215.93.157:12324/api/v1.0/buyOrder";
        $url = $url . "/" . $fir;
        $url = $url . "/" . $pid;
        $url = $url . "/" . $contentName;
        $url = $url . "/" . $ordersInfo->userid;
        $url = $url . "/" . $ordersInfo->productopsid;
        $url = $url . "/unknown/unknown";
        $url = $url . "?cooperatorOrder=". $ordersInfo->orderid;

        LogUtils::info("Pay220094::_buyOrder() ---> httpRequest url:" . $url);
        $result = HttpManager::httpRequestByHeader("POST", $url, $header, "");
        LogUtils::info("Pay220094::_buyOrder() ---> httpRequest result:" . json_encode($result));

        return json_decode($result);
    }

    // 产品鉴权
    private function _webpayPay($ordersInfo, $buyOrderInfo, $succCallbackUrl, $failCallbackUrl){
        $header = array(
            'Content-type: application/xml',
        );
        $version = 5004;
        $channelId = 30163;
        $appId = 117951244;
        $appName = "IPTV";
        $propName = "电视家庭医生(续订)";
        $ua = 'OTHERTVSTORE_JILINTV';
        $succCallbackUrl = str_replace("&", "&amp;", $succCallbackUrl);
        $failCallbackUrl = str_replace("&", "&amp;", $failCallbackUrl);
        LogUtils::info("Pay220094::webpayPay() ---> httpRequest url succCallbackUrl:" . $succCallbackUrl);
        LogUtils::info("Pay220094::webpayPay() ---> httpRequest url failCallbackUrl:" . $failCallbackUrl);

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'
            . '<request>'
            . '<body>'
            . '<Version>' . $version . '</Version>'
            . '<ChannelId>' . $channelId . '</ChannelId>'
            . '<AppId>' . $appId . '</AppId>'
            . '<AppName>' . $appName . '</AppName>'
            . '<PropName>' . $propName . '</PropName>'
            . '<PropPrice>' .  $buyOrderInfo->price . '</PropPrice>'
            . '<ExData>' . $buyOrderInfo->orderId . '</ExData>'
            . '<UA>' . $ua . '</UA>'
            . '<redirecturl>' . $succCallbackUrl . '</redirecturl>'
            . '<failurl>' . $failCallbackUrl . '</failurl>'
            . '<broadbandid>' . $ordersInfo->userid . '</broadbandid>'
            . '<AccessType>url</AccessType>'
            . '<param1>' . $ordersInfo->userid . '</param1>'
            . '<param2>' . $ordersInfo->orderid . '</param2>'
            . '<param3>unknown</param3>'
            . '<param4>unknown</param4>'
            . '<param5>unknown</param5>'
            . '</body></request>';

        $url = "http://27.115.67.141:9031/webpay/pay";
        LogUtils::info("Pay220094::webpayPay() ---> httpRequest url:" . $url);
        LogUtils::info("Pay220094::webpayPay() ---> httpRequest url xml:" . $xml);
        $result = HttpManager::httpRequestByHeader("POST", $url, $header, $xml);
        LogUtils::info("Pay220094::webpayPay() ---> httpRequest result:" . json_encode($result));

        return $result;
    }

    // 产品鉴权
    private function _buildWebpayUrl($webpayInfo){
        $url = "";
        $xml = simplexml_load_string($webpayInfo);

        LogUtils::info("Pay220094::_buildWebpayUrl() ---> httpRequest xml:" . $xml);
        LogUtils::info("Pay220094::_buildWebpayUrl() ---> httpRequest json(xml):" . json_encode($xml));
        $webPayRoot = (string) $xml->webUrlIp;
        $flag = (string) $xml->flag;
        if (!empty($webPayRoot) && !empty($flag)) {
            $url = $webPayRoot . "/pay_options?flag=" . $flag;
        }
        LogUtils::info("Pay220094::_buildWebpayUrl() ---> httpRequest url:" . $url);
        return $url;
    }

    private function _queryMyorders($acoount){
        if (empty($acoount)) {
            return null;
        }
        $url = "http://139.215.93.156:9080/valuedas/api/1.0/Orders/myorders/";
        $url = $url . "/" . $acoount;
        LogUtils::info("Pay220094::_queryMyorders() ---> httpRequest url:" . $url);
        $result = HttpManager::httpRequest("GET", $url, "");
        LogUtils::info("Pay220094::_queryMyorders() ---> httpRequest result:" . json_encode($result));
        if (!empty($result)) {
            $result = json_decode($result);
            $data = $result->list;
            if ($result->result == 1 && $result->count > 0 && count($data) > 0) {
                for ($index = 0; $index < count($data) ;  $index++) {
                    if ($data[$index]->productId == "2010000024") {
                        // 找到订购的产品
                        $time=date("Y-m-d H:i:s");
                        LogUtils::info("Pay220094::_queryMyorders() ---> endTime: " . $data[$index]->endTime);
                        if(strtotime($data[$index]->endTime)-strtotime($time) > 0){                   //对两个时间差进行差运算
                            LogUtils::info("Pay220094::_queryMyorders() ---> data: " . json_encode($data[$index]));
                            return $data[$index];
                        }
                    }
                }
            }
        }
        return null;
    }
}