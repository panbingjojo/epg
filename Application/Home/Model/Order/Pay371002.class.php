<?php

namespace Home\Model\Order;


use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;


class Pay371002 extends PayAbstract
{

    /**
     * 用户到局方鉴权，使用cws的接口
     * @param: $isVip 在我方是否是vip
     * @return mixed -1,表示其他错误，9303 表示未订购 9304表示已订购
     */
    public function authentication($isVip = null)
    {
        return 1; // 海看使用前端鉴权的方法
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
     * 进入订购界面前，特殊处理并将需要渲染的参数返回
     * @return mixed
     */
    public function payShow()
    {
        // TODO: Implement payShow() method.
    }

    /**
     * 构建订购参数
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayInfo($payInfo = null)
    {
        // 创建支付订单
        $ret = array();

       /* $authResult = MasterManager::isVIPUser();
        if ($authResult == 1) {
            $ret['result'] = $authResult == "0" ? "9304" : $authResult; // 0 跟返回订购地址冲突，所以改成9304。表示已经订购
            $ret['message'] = "用户已经订购!";
            LogUtils::info("Pay371002::buildPayUrl() ---> 用户已经订购：" . $authResult);
            //鉴权成功，表示用户是订购过的
            $isVip = UserManager::isVip(MasterManager::getUserId());     //判断用户是否是我方VIP用户
            if (!$isVip) {
                if (UserManager::regVip(MasterManager::getUserId()) == 1) {
                    $isVip = 1;
                    //缓存用户信息
                    SessionManager::setUserSession(SessionManager::$S_IS_VIP_USER, $isVip);
                }
            }
            return json_encode($ret);
        }*/

        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("Pay371002::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;
        $payInfo->returnPageName = "";
        $payInfo->videoInfo = "";
        $payInfo->lmreason = "0";

        // 创建订购地址
        $payUrl = $this->_buildPayUrl($payInfo);

        $ret['result'] = 0;
        $ret['payUrl'] = $payUrl;

        LogUtils::info("Pay371002::buildPayUrl() ---> result：" . json_encode($ret));
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
        $ContentID = CONTENT_CODE;
        $info = "userID=" . $userAccount;
        $info = $info . "$" . "productID=" . $productID;
        $info = $info . "$" . "ContentID=" . $ContentID;
        $info = $info . "$" . "notifyUrl=" . "";

        LogUtils::info("Pay371002::buildPayUrl() --->Crypt3DES before info ：" . $info);
        $info = Crypt3DES::encode($info, KEY);
        LogUtils::info("Pay371002::buildPayUrl() --->Crypt3DES after info ：" . $info);

        // 构建返回地址
        $returnUrl = $this->_buildPayCallbackUrl($payInfo);

        // 组装订购地址
        $pram = array(
            "transactionID" => $payInfo->tradeNo,
            "SPID" => SPID,
            "isFromAPK" => 1,
            "returnUrl" => urlencode(urlencode(mb_convert_encoding($returnUrl, 'utf-8', 'gbk'))),
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
        LogUtils::info("Pay371002::buildPayUrl() ---> payUrl：" . $payUrl);
        return $payUrl;
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl()
    {
        $payUrl = "";
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->lmreason = 2;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay371002::buildDirectPayUrl ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->packetType = 0;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay371002::buildDirectPayUrl pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($orderInfo);
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);

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
        LogUtils::info(" payCallback Pay371002 ---> payCallback");

        if ($payResultInfo == null) {
            //从session中取出之前已经缓存了的我方的订购参数
            $param = json_decode(SessionManager::getUserSession(SessionManager::$S_PAY_CALLBACK_PARAM));
            LogUtils::info(" payCallback Pay371002 ---> payCallback===>param session: " . SessionManager::getUserSession(SessionManager::$S_PAY_CALLBACK_PARAM));
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

        //局方回调时，传回参数不全，对回调地址进行二次编码，对返回内容进行解析
        if (empty($payResultInfo->tradeNo)) {
            $payResultInfo->tradeNo = $payResultInfo->transactionID;
            $payResultInfo->userId = isset($_REQUEST['userId']) ? $_REQUEST['userId'] : "";
            $data = explode("&", $payResultInfo->userId);
            $num = count($data);
            for ($i = 0; $i < $num; $i++) {
                if ($i == 0) {
                    $payResultInfo->userId = $data[$i];
                    continue;
                }

                $tmp = explode("=", $data[$i]);
                switch ($tmp[0]) {
                    case "tradeNo":
                        $payResultInfo->tradeNo = $tmp[1];
                        break;
                    case "lmreason":
                        $payResultInfo->lmreason = $tmp[1];
                        break;
                    case "lmcid":
                        $payResultInfo->lmcid = $tmp[1];
                        break;
                    case "returnPageName":
                        $payResultInfo->returnPageName = $tmp[1];
                        break;
                    case "isPlaying":
                        $payResultInfo->isPlaying = $tmp[1];
                        break;
                    case "packetType":
                        $payResultInfo->packetType = $tmp[1];
                        break;
                    case "videoInfo":
                        $payResultInfo->videoInfo = $tmp[1];
                        break;
                }
            }
        }
        LogUtils::info(" payCallback Pay371002 ---> payResult: " . json_encode($payResultInfo));
        $isVip = 0;
        if ($payResultInfo->result === 0 || $payResultInfo->result == '0') {
            $isVip = 1;
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult($isVip);
            // 用户是否是VIP，更新到session中
            MasterManager::setVIPUser($isVip);
            MasterManager::setUserIsVip($isVip);
            // 订购成功，上报订购结果
            $payResultInfo->orderSuccess = "1";
            // 上报结果到CWS
            $this->_uploadPayResult($payResultInfo);
        } else if ($payResultInfo->result === 2 || $payResultInfo->result == '2') {
            $objDst = IntentManager::createIntent("authOrder");
            IntentManager::jump($objDst);
            return;
        } else {
            $payResultInfo->orderSuccess = "-1";
        }

        if (($payResultInfo->lmreason != null && ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1))) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            LogUtils::info("payCallbackPay371002::payCallback() url:" . $intentUrl);
            $objDst = IntentManager::createIntent("authOrder");
            IntentManager::jump($objDst,$intent);
            //header("Location:" . $intentUrl);
            return;
        }

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = SessionManager::getUserSession(SessionManager::$S_PLAY_PARAM) ? SessionManager::getUserSession(SessionManager::$S_PLAY_PARAM) : null;
        }

        //显示订购结果页面，该界面显示的是局方的订购结果（不包括订购成功后上报到我方服务器，是否在我方服务器上变成了vip）
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $payResultInfo->orderSuccess);
        $showOrderResultObj->setParam("returnPageName", $payResultInfo->returnPageName);  // 增加一个返回页面名称

        $url = IntentManager::intentToURL($showOrderResultObj);
        LogUtils::info(" payCallbackPay371002 ---> showOrderResult url: " . $url);

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
            LogUtils::info(" payCallbackPay371002 ---> player: ");
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            $objDst = IntentManager::createIntent("authOrder");
            IntentManager::jump($objDst,$objPlayer);
        } else {
            LogUtils::info(" payCallbackPay371002 ---> not player: ");
            $objDst = IntentManager::createIntent("authOrder");
            IntentManager::jump($objDst);
        }
    }

    /**
     * 上报订购结果,只上报订购成功
     * @param $payResultInfo
     * @return bool 上报结果是否成功
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
            "packType" => $payResultInfo->packType,
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
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     */
    public function unPayCallback($unPayResultInfo = null)
    {
        // TODO: Implement unPayCallback() method.
    }

    /**
     * 订购结果显示界面，特殊处理
     * @param object payController|null
     * @return mixed
     */
    public function payShowResult($payController = null)
    {
        return $_GET;
    }

    /**
     * 构建订购返回地址
     * @param null $payInfo
     * @return string
     */
    private function _buildPayCallbackUrl($payInfo = null)
    {
        $intent = IntentManager::createIntent("payCallback");
        $intent->setParam("userId", MasterManager::getUserId());
        $intent->setParam("tradeNo", $payInfo->tradeNo);
        $intent->setParam("lmreason", $payInfo->lmreason != null ? $payInfo->lmreason : 0);
        $intent->setParam("lmcid", MasterManager::getCarrierId());
        $intent->setParam("returnPageName", $payInfo->returnPageName);
        $intent->setParam("isPlaying", $payInfo->isPlaying);
        $intent->setParam("videoInfo", rawurlencode($payInfo->videoInfo));

        LogUtils::info("_buildPayCallbackUrl ---> payInfo: " . json_encode($payInfo));

        SessionManager::setUserSession(SessionManager::$S_PAY_CALLBACK_PARAM, json_encode($payInfo));

        LogUtils::info("_buildPayCallbackUrl ---> payInfo session: " . SessionManager::getUserSession(SessionManager::$S_PAY_CALLBACK_PARAM));

        $url = IntentManager::intentToURL($intent);
        /*
        if ($payInfo->lmreason == 1) {
            if (!TextUtils::isBeginHead($url, "http://")) {
                if (defined(APP_ROOT_PATH)) {
                    $url = APP_ROOT_PATH . $url;                       // 回调地址需要加上全局路径
                } else {
                    $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
                }
            }
        } else {
            $url = "http://140.249.20.45:10021" . $url;
        }*/
        $url = "http://" . $_SERVER['HTTP_HOST'] . $url;
        LogUtils::info("_buildPayCallbackUrl ---> url: " . $url);
        return $url;
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
            LogUtils::error("Pay371002::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->packetType = 0;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay371002::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
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

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
    }
}