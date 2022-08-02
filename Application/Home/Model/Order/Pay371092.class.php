<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/8/2
 * Time: 下午5:36
 */

namespace Home\Model\Order;
use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SoapManager;
use Home\Model\Common\TextUtils;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;

class Pay371092 extends PayAbstract
{

    /**
     * 用户到局方鉴权，使用cws的接口
     * @param: $isVip 在我方是否是vip
     * @return mixed -1,表示其他错误，9303 表示未订购 9304表示已订购
     */
    public function authentication($isVip = null)
    {
        /*$userTypeAuth = -1;
        $accountTpye = 1;
        $authResult = PayAPI::authenticationFor371092(MasterManager::getAccountId(), $accountTpye, MasterManager::getUserToken());
        if ($authResult) {
            $authResultJson = json_decode($authResult, true);
            $userTypeAuth = $authResultJson['result'];
        }
        return $userTypeAuth;*/

        /*
        $isAuthVip = 0;

        foreach (CONTENT_ID_CONFIG as $key => $value){ // 需要遍历四个内容ID，才能确定当前用户的身份信息
            $isAuthVip = $this->performAuthIdentity($value);
            if($isAuthVip == 1) {
                LogUtils::info("pay371092::authentication() ---> packetType：" . $key . ",contentId：" . $value);
                MasterManager::setOrderPacketType($key); // 设置当前订购的套餐类型
                break; // 退出当前循环
            }
        }*/
        //不鉴权。
        /*if(USE_SERVER == 3)
               return 1;
        $productPacketType = "0"; // 大包产品类型标识
        return $this->performAuthIdentity(CONTENT_ID_CONFIG[$productPacketType]);*/
        return 1;
    }

    /**
     * 根据当前内容鉴权当前用户的身份
     *
     * @param: $contentId 鉴权的内容Id
     * @return int 0 -- 当前内容未订购； 1 -- 当前内容已订购
     */
    public function performAuthIdentity($contentId)
    {
        $isVipWithContent = 0;
        $transactionID = SPID . date("YmdHis") . mt_rand(100000000, 999999999) . mt_rand(100000000, 999999999);
        $contentType = 0;
        $requestParam = array(
            "serviceAuthReq" => array("transactionID" => $transactionID, // 事务编号
                "spID" => SPID, // 应用商唯一标识
                "userID" => MasterManager::getAccountId(), // IPTV用户编号
                "userToken" => MasterManager::getUserToken(), // 临时身份证明
                "productID" => "", // 产品编号
                "serverID" => "", // 服务编号
                "contentID" => $contentId, // 内容编号
                "contentType" => $contentType, // vod(普通节目)
                "timeStamp" => Utils::getMillisecond(), // 时间戳,单位毫秒
                "ip" => "", // IP地址
                "mac" => "", // 机顶盒Mac地址),
            ),
        );

        LogUtils::info("pay371092::performAuthIdentity() ---> requestParam：" . json_encode($requestParam));

        $userAuthFunc = "serviceAuth";
        $authResult = SoapManager::request(USER_AUTH_URL, $userAuthFunc, $requestParam);
        if ($authResult == null) {
            LogUtils::info("pay371092::performAuthIdentity() ---> authResult is null");
        } else {
            LogUtils::info("pay371092::performAuthIdentity() ---> authResult：" . json_encode($authResult));
        }

        $userTypeAuth = $authResult->serviceAuthReturn->result;
        LogUtils::info("pay371092::performAuthIdentity() ---> userTypeAuth：" . $userTypeAuth);
        if ($userTypeAuth == "9304" || $userTypeAuth == "0" || $userTypeAuth == "9383" || $userTypeAuth == "9648") {
            //鉴权成功，表示用户是订购过的
            $isVipWithContent = 1;
        } else if ($userTypeAuth == "9303") {
            //其他鉴权失败，不取消vip
            $isVipWithContent = 0;
        }

        return $isVipWithContent;
    }

    /**
     * 构建到局方用户验证地址
     * @param $param
     * @return mixed
     */
    public function buildVerifyUserUrl($param = null)
    {
        // TODO: Implement buildVerifyUserUrl() method.
    }

    /**
     * 我方订购页构建到局方的订购地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {
        // 创建支付订单
        $ret = array();

        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay371092::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;
        $payInfo->returnPageName = "";
        $payInfo->videoInfo = "";
        $payInfo->lmreason = "0";

        $payUrl = $this->_buildPayUrl($payInfo);

        $ret['result'] = 0;
        $ret['payUrl'] = $payUrl;

        LogUtils::info("pay371092::buildPayUrl() ---> result：" . json_encode($ret));
        return json_encode($ret);
    }

    /**
     * 此函数用于内部构建订购链接
     * @param $payInfo
     * @return string
     */
    public function _buildPayUrl($payInfo)
    {

        $userAccount = MasterManager::getAccountId();
        // $productID = PRODUCT_ID;
        $productID = PRODUCT_ID;
        // $ContentID = CONTENT_ID_CONFIG[$payInfo->packetType];
        $info = "userID=" . $userAccount;
        $info = $info . "$" . "productID=" . $productID;
        $info = $info . "$" . "ContentID=" . CONTENT_CODE;
        $info = $info . "$" . "notifyUrl=" . "";

        LogUtils::info("pay371092::buildPayUrl() --->Crypt3DES before info ：" . $info);
        $info = Crypt3DES::encode($info, KEY);
        LogUtils::info("pay371092::buildPayUrl() --->Crypt3DES after info ：" . $info);

        // 构建返回地址
        $returnUrl = $this->_buildPayCallbackUrl($payInfo);

        // 组装订购地址
        $pram = array(
            "transactionID" => $payInfo->tradeNo,
            "SPID" => SPID,
            "isFromAPK" => 1,
            "returnUrl" => urlencode(mb_convert_encoding($returnUrl, 'utf-8', 'gbk')),
            "INFO" => urlencode(mb_convert_encoding($info, 'utf-8', 'gbk')),
        );
        $payUrl = USER_ORDER_URL;
        foreach ($pram as $key => $value) {
            if (strpos($payUrl, '?') === false) {
                $payUrl = $payUrl . '?' . $key . "=" . $value;
            } else {
                $payUrl = $payUrl . '&' . $key . "=" . $value;
            }
        }
        LogUtils::info("pay371092::buildPayUrl() ---> payUrl：" . $payUrl);
        return $payUrl;
    }

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildUnPayUrl($payInfo = null)
    {
        // TODO: Implement buildUnPayUrl() method.
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
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     */
    public function payCallback($payResultInfo = null)
    {
        if ($payResultInfo == null) {
            //从session中取出之前已经缓存了的我方的订购参数
            $param = json_decode(MasterManager::getPayCallbackParams());
            LogUtils::info(" payCallback V371092 ---> payCallback===>param session: " . MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->isPlaying = $param->isPlaying;
            //得到局方返回的订购参数

            $payResultInfo->transactionID = isset($_REQUEST['transactionID']) ? $_REQUEST['transactionID'] : "";
            $payResultInfo->result = isset($_REQUEST['result']) ? $_REQUEST['result'] : -1;
            $payResultInfo->description = isset($_REQUEST['description']) ? $_REQUEST['description'] : "";
            $payResultInfo->purchaseType = isset($_REQUEST['purchaseType']) ? $_REQUEST['purchaseType'] : "";
            $payResultInfo->expiredTime = isset($_REQUEST['expiredTime']) ? $_REQUEST['expiredTime'] : "";
            $payResultInfo->subscriptionExtend = isset($_REQUEST['subscriptionExtend']) ? $_REQUEST['subscriptionExtend'] : "";
            $payResultInfo->subscriptionID = isset($_REQUEST['subscriptionID']) ? $_REQUEST['subscriptionID'] : "";
        }
        LogUtils::info(" payCallback 370002 ---> payResult: " . json_encode($payResultInfo));

        $isVip = 0;
        if ($payResultInfo->result === 0 || $payResultInfo->result == '0') {
            $isVip = 1;
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult($isVip);
            // 用户是否是VIP，更新到session中
            MasterManager::setUserIsVip($isVip);
            // 订购成功，上报订购结果
            $payResultInfo->orderSuccess = "1";
            // 上报结果到CWS
            $this->_uploadPayResult($payResultInfo);
        } else {
            $payResultInfo->orderSuccess = "-1";
        }

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        if (($payResultInfo->lmreason != null && ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1))) {
            $objSrc = IntentManager::createIntent("wait");
        }

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
            LogUtils::info(" payCallback V371092 ---> player: ");
            $objSrc = IntentManager::createIntent();
            $objSrc->setPageName("player");
            $objSrc->setParam("userId", $payResultInfo->userId);
            $objSrc->setParam("isPlaying", $payResultInfo->isPlaying);
            $objSrc->setParam("videoInfo", json_encode($videoInfo));
        }  else {
            $objSrc = IntentManager::createIntent("payShowResult");
            $objSrc->setParam("isSuccess", $payResultInfo->orderSuccess);
            $objSrc->setParam("returnPageName", $payResultInfo->returnPageName);  // 增加一个返回页面名称
        }

        $objDst = IntentManager::createIntent("authOrder");
        IntentManager::jump($objDst,$objSrc);
        return;
    }

    /**
     * 上报订购结果,只上报订购成功
     * @param $payResultInfo
     * @return 上报结果
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $param = array(
            "TradeNo" => $payResultInfo->tradeNo,
            "reason" => $payResultInfo->lmreason,
            "transactionID" => $payResultInfo->transactionID,
            "result" => $payResultInfo->result,
            "description" => $payResultInfo->description,
            "purchaseType" => $payResultInfo->purchaseType,
            "expiredTime" => $payResultInfo->expiredTime,
            "subscriptionExtend" => $payResultInfo->subscriptionExtend,
            "subscriptionID" => $payResultInfo->subscriptionID,
        );
        $url = ORDER_CALL_BACK_URL;
        foreach ($param as $key => $value) {
            if (strpos($url, '?') === false) {
                $url = $url . '?' . $key . "=" . $value;
            } else {
                $url = $url . '&' . $key . "=" . $value;
            }
        }
        LogUtils::info("postPayResultEx --->url : " . $url);
        $uploadPayResult = HttpManager::httpRequest("GET", $url, null);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
    }

    /**
     * 构建订购返回地址
     * @param null $param
     * @return string
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

        LogUtils::info("_buildPayCallbackUrl ---> payInfo: " . json_encode($payInfo));
        MasterManager::setPayCallbackParams(json_encode($payInfo));
        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        LogUtils::info("_buildPayCallbackUrl ---> url: " . $url);
        return $url;
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
     * 通过web浏览器进行订购
     * @param null $userInfo
     * @return mixed
     */
    public function webPagePay($userInfo)
    {
        $payUrl = "";
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 220;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->lmreason = 1;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay371092::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay371092::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($orderInfo);
        }
        LogUtils::info("webPagePay pay PayUrl: " . $payUrl);

        header("Location:" . $payUrl);
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {

        // 通过缓存得到用户账号和token
        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'userToken' => MasterManager::getUserToken(),
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platformType' => MasterManager::getPlatformType(),
        );

        return $info;
    }

    public function buildDirectPayUrl()
    {
        $payUrl = "";
        $userId = MasterManager::getUserId();
        // 构建我方的应用订购信息
        $payInfo = new \stdClass();
        $payInfo->userId = $userId;
        $payInfo->orderReason = 221;
        $payInfo->remark = "login";
        $payInfo->returnPageName = "";
        $payInfo->isPlaying = 0;
        $payInfo->isSinglePayItem = 1;
        $payInfo->lmreason = 2;
        $payInfo->orderType = 0;
        $payInfo->videoInfo = "";

        LogUtils::info("pay371092::buildDirectPayUrl() ");
        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("pay371092::buildDirectPayUrl() ---> orderItems is empty");
            return $payUrl;
        }
        LogUtils::info("pay371092::orderItems：" . json_encode($orderItems));
        LogUtils::info("pay371092::orderItems：" . json_encode($orderItems[0]->vip_id));

        $payInfo->vipId = $orderItems[0]->vip_id;
        LogUtils::info("pay371092::payInfo：" . json_encode($payInfo));

        $orderInfo = OrderManager::createPayTradeNo($payInfo->vipId, $payInfo->orderReason, $payInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay371092::buildDirectPayUrl() ---> 获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;
        $payUrl = $this->_buildPayUrl($payInfo);

        return $payUrl;
    }

}