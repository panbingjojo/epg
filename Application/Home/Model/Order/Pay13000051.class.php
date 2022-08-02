<?php
/**
 * Created by Longmaster
 * Brief: 中国联通计费模块
 */

namespace Home\Model\Order;


use Api\APIController\DebugAPIController;
use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;
use Org\Util\Date;

class Pay13000051 extends PayAbstract
{

    /**
     * 到局方鉴权，只有包月产品才能鉴权。（可以鉴权其他CP的产品，需要传递产品信息）
     * @param $productInfo 鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authentication($productInfo = null)
    {
        LogUtils::info("Pay13000051 --> user authentication productInfo:" . json_encode($productInfo));
        // TODO: Implement authentication() method.
        if ($productInfo == null || empty($productInfo) || !is_array($productInfo)) {
            // 默认使用我方的包月产品进行鉴权
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = PRODUCT_ID . "@" . MasterManager::getAreaCode();
            $productInfo['serviceId'] = SERVICE_ID;
            $productInfo['contentId'] = CONTENT_ID;
        }

        // 鉴权地址
        $authorizationUrl = ORDER_AUTHORIZATION_URL;

        // userToken
        $userToken = MasterManager::getUserToken();

        //鉴权参数
        $info = array(
            "spId" => $productInfo['spId'],
            "carrierId" => MasterManager::getAreaCode(),
            "userId" => MasterManager::getAccountId(),
            "UserToken" => $userToken,
            "productId" => $productInfo['productId'],
            "serviceId" => $productInfo['serviceId'],
            "contentId" => $productInfo['contentId'],
            "timeStamp" => "" . time(),
        );

        LogUtils::info("Pay13000051 --> user authentication param:" . json_encode($info));

        // post到局方鉴权，同步返回数据
        $result = HttpManager::httpRequest("POST", $authorizationUrl, json_encode($info));

        LogUtils::info("Pay13000051 --> user authentication result:  " . $result);

        return json_decode($result);
    }

    /**
     * 构建到局方用户验证地址
     * @param null $returnUrl
     * @return mixed
     */
    public function buildVerifyUserUrl($returnUrl = null)
    {
        // TODO: Implement buildVerifyUserUrl() method.
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $url = ORDER_VERIFY_USER_URL . "?";
        $data = array(
            "SPID" => SPID,
            "CarrierID" => $epgInfoMap['carrierId'],
            "UserID" => $epgInfoMap['UserID'],
            "IP" => Utils::getClientIp(),
            "ReturnURL" => $returnUrl,
            "ReturnInfo" => "",
            "ModelID" => MasterManager::getSTBVersion(),
        );

        foreach ($data as $key => $val) {
            $url .= $key . "=" . $val . "&";
        }
        $url = substr($url, 0, -1);
        LogUtils::info("buildVerifyUserUrl:  " . $url);
        return $url;
    }

    /**
     * 构建到局方的订购地址
     * @param $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {
        // TODO: Implement buildPayUrl() method.
        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );

        if ($payInfo == null || $payInfo == "" || !is_object($payInfo)) {
            LogUtils::error("buildPayUrl， 参数错误");
            return $ret;
        }

        $payInfo->lmreason = 0;
        $orderType = 1;

        // 产品鉴权
        $authInfo = $this->authentication();
        LogUtils::info("authInfo， 参数：".json_encode($authInfo));
        if ($authInfo->result == 10020001) {

            // 创建支付订单
            $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark, null, $orderType);
            if ($orderInfo->result != 0) {
                // 创建失败
                $ret['result'] = $orderInfo->result;
                return $ret;
            }

            // 鉴权失败说明用户可订购， 构建订购地址
            $payInfo->tradeNo = $orderInfo->order_id;

            // 根据页面上的计费选项类型，来提取对应的计费参数
            if ($payInfo->product_id == PRODUCT_ID_20) {
                $productInfo = $authInfo->productList[0];
            } else {
                $productInfo = $authInfo->productList[1];
                if ($productInfo == "") {
                    $productInfo = $authInfo->productList[0];
                }
            }

            $payUrl = $this->_buildPayUrl($payInfo, $productInfo);

            $ret['result'] = 0;
            $ret['payUrl'] = $payUrl;
        }

        return json_encode($ret);
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function directToPay($orderInfo = null)
    {
        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->isJointActivity = isset($_GET['isJointActivity']) ? $_GET['isJointActivity'] : 0; // 是否联合活动发起订购
            $orderInfo->contentId = isset($_GET['contentId']) ? $_GET['contentId'] : null;
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['singlePayItem']) ? $_GET['singlePayItem'] : 1;
            $orderInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
        }

        $orderInfo->lmreason = 0;

        // 清除cookie里订购结果记录, 目前联合活动才会使用该订购结果
        CookieManager::setCookie(CookieManager::$C_ORDER_RESULT, 0);

        // 如果是湖北地区，有两个计费项，要先到自己开发的订购选择页，然后再跳转到局方订购
        if (MasterManager::getAreaCode() == '217') {
            $intent = IntentManager::createIntent("tempPayPage");
            $intent->setParam("orderParam", rawurlencode(json_encode($orderInfo)));

            $goUrl = IntentManager::intentToURL($intent);
            header('Location:' . $goUrl);
            return;
        }

        $userInfo = new \stdClass();
        $userInfo->spId = SPID;
        $userInfo->productId = PRODUCT_ID . "@" . MasterManager::getAreaCode();
        $userInfo->serviceId = SERVICE_ID;
        $userInfo->contentId = CONTENT_ID;
        $userInfo->orderType = isset($_GET['orderType']) ? $_GET['orderType'] : 1;

        $this->buildUrlAndPay($userId, $userInfo, $orderInfo);
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
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = $_GET['userId'];
            $payResultInfo->tradeNo = $_GET['tradeNo'];
            $payResultInfo->lmreason = $_GET['lmreason'];
            $payResultInfo->returnPageName = isset($_GET['returnPageName']) && $_GET['returnPageName'] != null
                ? $_GET['returnPageName'] : "";
            $payResultInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $payResultInfo->videoInfo = isset($_GET['videoInfo']) && $_GET['videoInfo'] != ""
                ? rawurldecode($_GET['videoInfo']) : null;

            $payResultInfo->result = $_GET['Result'];

        }
        LogUtils::info(" payCallback 13000051 ---> payResult: " . json_encode($payResultInfo));

        // 添加局方数据上报的行为，如果成功的话操作结果上报1，否则上报失败的错误码
        $operateResult = $payResultInfo->result == 0 ? 1 : $payResultInfo->result;
        // DebugAPIController::sendUserBehaviour000051(DebugAPIController::CHINAUNICOM_REPORT_DATA_TYPE["order"],$operateResult);

        /*  关闭积分兑换
        // 积分兑换“健康魔方”，取消订购或订购失败，返回到积分兑换页面(天津)
        {
            $areaCode = MasterManager::getAreaCode();
            if ($areaCode == '201') {
                if ($payResultInfo->result == 'back') {
                    LogUtils::info("Pay10000051::payCallback() ---> 积分商城返回");
                    IntentManager::back($payResultInfo->returnPageName);
                    return;
                } else if ($payResultInfo->result != 0) {
                    $param = array(
                        "returnPageName" => $payResultInfo->returnPageName,
                        "Result" => 'back',
                    );
                    $callbackUrl = $this->_buildPayCallbackUrl($param);
                    $callbackUrl = urlencode($callbackUrl);
                    $jumpUrl = '';
                    if ($areaCode == '201') {
                        $jumpUrl = "http://202.99.114.14:15081/integralExchange/recommend.html?userId=" . MasterManager::getAccountId() . "&carrierid=201&specialareatype=2&goodsid=V321300000035&returnurl=" . $callbackUrl;
                    }

                    LogUtils::info("Pay13000051::payCallback() ---> 积分商城returnUrl：" . $jumpUrl);
                    header("Location:" . $jumpUrl);
                    return;
                }
            }
        }
        */

        // 把订购是否成功的结果写入cookie，供页面使用
        CookieManager::setCookie(CookieManager::$C_ORDER_RESULT, $payResultInfo->result == 0 ? 1 : 0);

        $isVip = 0;
        if ($payResultInfo->result != '001') {

            // 上报订购结果
            $this->_uploadPayResult();

            // 判断用户是否是VIP，更新到session中
            $isVip = UserManager::isVip($payResultInfo->userId);
            SessionManager::setUserSession(SessionManager::$S_IS_VIP_USER, $isVip);


            // 查询用户的VIP身份，
            $vipInfo = UserManager::queryVipInfo($payResultInfo->userId);
            if ($vipInfo->result == 0 && ($vipInfo->auto_order == 1
                    || $vipInfo->last_order_trade_no == null
                    || $vipInfo->last_order_trade_no == "")) {
                MasterManager::setAutoOrderFlag("1");  // 续包月用户
            } else {
                MasterManager::setAutoOrderFlag("0");  // 不是续包月用户
            }
        }

        if ($payResultInfo->lmreason != null && $payResultInfo->lmreason == 2) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            LogUtils::info("Pay13000051::payCallback() url:". $intentUrl);
            header("Location:" . $intentUrl);
            return;
        }

        // 如果是播放订购成功回来，则过去继续数据&& ($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = SessionManager::getUserSession(SessionManager::$S_PLAY_PARAM) ?
                SessionManager::getUserSession(SessionManager::$S_PLAY_PARAM) : null;
        }

        LogUtils::info("Pay10000051::payCallback() ---> videoInfo:" . $videoInfo);
        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 继续播放
            LogUtils::info("Pay10000051::payCallback() ---> jump player!");
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        } else {
            LogUtils::info("Pay01300051::payCallback() ---> jump returnPageName: " . $payResultInfo->returnPageName);
            IntentManager::back($payResultInfo->returnPageName);
        }
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
        if ($param['Result']) {
            $intent->setParam("Result", $param['Result']);
        }
        if ($param['isJiFen']) {
            $intent->setParam("isJiFen", $param['isJiFen']);
        }
        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        return $url;
    }

    /**
     * 生成订购地址，此订购地址会显示局方的订购页面
     * @param null $payInfo
     * @param $productInfo
     * @return bool|string
     */
    private function _buildPayUrl($payInfo, $productInfo)
    {
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeNo,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "videoInfo" => $payInfo->videoInfo,
        );
        $callbackUrl = $this->_buildPayCallbackUrl($param);  //构建返回地址

        // 获取EPG信息
        $accountId = MasterManager::getAccountId();
        $userToken = MasterManager::getUserToken();

        // 组装订购参数
        $orderInfo = array(
            "SPID" => SPID,
            "UserID" => $accountId,
            "UserToken" => $userToken,
            "ServiceID" => $productInfo->serviceId,
            "ContentID" => $productInfo->contentID,
            "ProductID" => $productInfo->productId,
            "Action" => '1',
            "OrderMode" => '1',
            "ContinueType" => '1',
            //"NeedRewardPoints" => '0',
            "Lang" => "zh",
            "ReturnURL" => rawurlencode($callbackUrl),
        );
        $payUrl = ORDER_SERVICE_ORDER_URL;
        foreach ($orderInfo as $key => $value) {
            if (strpos($payUrl, '?') === false) {
                $payUrl = $payUrl . '?' . $key . "=" . $value;
            } else {
                $payUrl = $payUrl . '&' . $key . "=" . $value;
            }
        }

        LogUtils::info("---> _buildPayUrl: $payUrl");
        return $payUrl;
    }

    /**
     * 上报订购结果
     * @param $payResultInfo
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        $userId = isset($_GET['userId']) ? $_GET['userId'] : MasterManager::getUserId();
        if ($payResultInfo == null) {
            // 处理并上报支付结果
            $payResultInfo = array(
                'TradeNo' => $_GET['tradeNo'],
                'reason' => $_GET['lmreason'],
                'transactionID' => $_GET['tradeNo'],
                'Result' => $_GET['Result'],
                'OutResult' => $_GET['OutResult'],
                'Description' => $_GET['Description'],
                'UserID' => $_GET['UserID'],
                'UserToken' => $_GET['UserToken'],
                'ContentID' => $_GET['ContentID'],
                'ServiceID' => $_GET['ServiceID'],
                'ProductID' => $_GET['ProductID'],
                'ProductName' => $_GET['ProductName'],
                'PurchaseType' => $_GET['PurchaseType'],
                'Fee' => $_GET['Fee'],
                'SPID' => $_GET['SPID'],
                'TransactionID' => $_GET['TransactionID'],
                'ExpiredTime' => $_GET['ExpiredTime'],
                'OrderMode' => $_GET['OrderMode'],
                'SerStartTime' => $_GET['SerStartTime'],
                'SerEndTime' => $_GET['SerEndTime'],
                'PayValidLen' => $_GET['PayValidLen'],
                'AvailableIPTVRewardPoints' => isset($_GET['AvailableIPTVRewardPoints']) ? $_GET['AvailableIPTVRewardPoints'] : "",
                'AvailableTeleRewardPoints' => isset($_GET['AvailableTeleRewardPoints']) ? $_GET['AvailableTeleRewardPoints'] : "",
                'AvailableTVVASRewardPoints' => isset($_GET['AvailableTVVASRewardPoints']) ? $_GET['AvailableTVVASRewardPoints'] : "",
                'TradesSerialNum' => $_GET['TradesSerialNum'],
                'ActualPayAmount' => $_GET['ActualPayAmount'],
                'carrierId' => isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID,
            );
        }

        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));

        PayAPI::postPayResultEx($payResultInfo);
    }

    /**
     * 截取账号，将账号的后缀取消 如"_204"
     * @param $account
     * @return bool|string
     */
    private function _interceptAccount($account) {
        $arecCodeTail = "_".MasterManager::getAreaCode();
        if (substr_compare($account, $arecCodeTail, -strlen($arecCodeTail)) === 0) {
            $account = substr($account, 0, strlen($account) - strlen($arecCodeTail));
        }
        return $account;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo() {
        // 获取EPG信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userToken = MasterManager::getUserToken() ? MasterManager::getUserToken() : $epgInfoMap['UserToken'];
        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'areaCode' => MasterManager::getAreaCode(),
            'subAreaCode' => MasterManager::getSubAreaCode(),
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platfromType' => MasterManager::getPlatformType(),
            'platformTypeExt' => SessionManager::getUserSession(SessionManager::$S_PLATFORM_TYPE_EXT),
            'userToken' => $userToken,
            'isUnicomActivity' => 0,

            'spId' => SPID,
            'serviceId' => SERVICE_ID,
            'contentId' => CONTENT_ID,
            'productId' => PRODUCT_ID,
        );

        return $info;
    }

    /**
     * @param $userId
     * @param $userInfo
     * @param $orderInfo
     * @throws \Think\Exception
     */
    public function buildUrlAndPay($userId, $userInfo, $orderInfo)
    {
        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay13000051::buildUrlAndPay() ---> orderItems is empty");
            return;
        }

        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        $productInfo['spId'] = $userInfo->spId;
        $productInfo['productId'] = $userInfo->productId;
        $productInfo['serviceId'] = $userInfo->serviceId;
        $productInfo['contentId'] = $userInfo->contentId;

        $authInfo = $this->authentication($productInfo);
        LogUtils::info("Pay13000051::buildUrlAndPay() ---> authentication result: " . $authInfo);
        if ($authInfo->result === 10020001) {
            //鉴权失败，保存鉴权返回的订购信息项。
            SessionManager::setUserSession(SessionManager::$S_ORDER_ITEM, $authInfo);
            $authProductInfo = $authInfo->productList[0];

            // 创建订单号
            $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
                $orderInfo->remark, $orderInfo->contentId, $userInfo->orderType);
            if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
                LogUtils::info("Pay10000051::buildUrlAndPay() ---> 拉取订单失败:" . $tradeInfo->result);
                return;
            }
            $orderInfo->tradeNo = $tradeInfo->order_id;

            //生成订购地址
            $payInfo = new \stdClass();
            $payInfo->userId = MasterManager::getUserId();
            $payInfo->carrierId = MasterManager::getCarrierId();
            $payInfo->vip_id = $orderInfo->vipId;                  // 后台配置的vip_id
            $payInfo->product_id = $authProductInfo->productId;          // 产品ID
            $payInfo->isPlaying = $orderInfo->isPlaying;            // 是否正在播放，后续可以改为直接传递播放的视频信息
            $payInfo->orderReason = $orderInfo->orderReason;        // 订购原因
            $payInfo->remark = $orderInfo->remark;                  // 订购标记
            $payInfo->returnPageName = $orderInfo->returnPageName;  // 返回页面名称，也可能定义为返回页面的Intent对象
            $payInfo->videoInfo = $orderInfo->videoInfo;            // 正在播放时的视频信息。
            $payInfo->tradeNo = $tradeInfo->order_id;               // 订单号
            $payInfo->lmreason = $tradeInfo->lmreason;

            $payUrl = $this->_buildPayUrl($payInfo, $authProductInfo);
            header("Location:" . $payUrl);
        } else if ($authInfo->result == 0) {
            // 在局方已经是VIP
            $isVip = UserManager::isVip($userId);
            if (!$isVip) {
                if (UserManager::regVip($userId) == 1) {
                    LogUtils::info("Pay13000051::buildUrlAndPay() ---> regVip  success!");
                    $isVip = 1;
                }
                LogUtils::info("Pay13000051::buildUrlAndPay() --->regVip failed!");
            }
            SessionManager::setUserSession(SessionManager::$S_IS_VIP_USER, $isVip);

            IntentManager::back();
        } else {
            LogUtils::info("Pay13000051::buildUrlAndPay() ---> user exception");
        }
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     * @throws \Think\Exception
     */
    public function buildDirectPayUrl() {
        $payUrl = "";
        $userId = MasterManager::getUserId();
        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = MasterManager::getUserId();
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->lmreason = 2;
        $orderInfo->contentId = CONTENT_ID;
        $orderType = 1;

        $userInfo = $this->buildUserInfo();
        LogUtils::info("Pay13000051::buildDirectPayUrl() --->  userInfo: " . json_encode($userInfo));
        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay13000051::buildDirectPayUrl() ---> orderItems is empty");
            return $payUrl;
        }

        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        $productInfo['spId'] = $userInfo['spId'];
        $productInfo['productId'] = PRODUCT_ID . "@" . MasterManager::getAreaCode();
        $productInfo['serviceId'] = $userInfo['serviceId'];
        $productInfo['contentId'] = $userInfo['contentId'];

        $authInfo = $this->authentication($productInfo);
        LogUtils::info("Pay13000051::buildDirectPayUrl() ---> authentication result: " . $authInfo);
        if ($authInfo->result === 10020001) {
            //鉴权失败，保存鉴权返回的订购信息项。
            SessionManager::setUserSession(SessionManager::$S_ORDER_ITEM, $authInfo);

            $authProductInfo = $authInfo->productList[0];

            // 创建订单号
            $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
                $orderInfo->remark, $authProductInfo->contentID, $orderType);
            if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
                LogUtils::info("Pay13000051::buildDirectPayUrl() ---> 拉取订单失败:" . $tradeInfo->result);
                return $payUrl;
            }
            $orderInfo->tradeNo = $tradeInfo->order_id;

            //生成订购地址
            $payInfo = new \stdClass();
            $payInfo->userId = MasterManager::getUserId();
            $payInfo->carrierId = MasterManager::getCarrierId();
            $payInfo->vip_id = $orderInfo->vipId;                  // 后台配置的vip_id
            $payInfo->product_id = $authProductInfo->productId;          // 产品ID
            $payInfo->isPlaying = $orderInfo->isPlaying;            // 是否正在播放，后续可以改为直接传递播放的视频信息
            $payInfo->orderReason = $orderInfo->orderReason;        // 订购原因
            $payInfo->remark = $orderInfo->remark;                  // 订购标记
            $payInfo->returnPageName = $orderInfo->returnPageName;  // 返回页面名称，也可能定义为返回页面的Intent对象
            $payInfo->videoInfo = $orderInfo->videoInfo;            // 正在播放时的视频信息。
            $payInfo->tradeNo =  $orderInfo->tradeNo;               // 订单号
            $payInfo->lmreason = $orderInfo->lmreason;

            $payUrl = $this->_buildPayUrl($payInfo, $authProductInfo);
            // 增加订单号方便解析
            $payUrl = $payUrl . "&lmTradeNo=". $orderInfo->tradeNo;
        } else if ($authInfo->result == 0) {
            // 在局方已经是VIP
            LogUtils::info("Pay13000051::buildDirectPayUrl() ---> auth result = 0");
        } else {
            LogUtils::info("Pay13000051::buildDirectPayUrl() ---> user exception");
        }
        return $payUrl;
    }

    /**
     * 构建订购参数
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayInfo($payInfo = null)
    {
        // TODO: Implement buildPayInfo() method.
    }

    /**
     * 构建自动上报订购地址
     * @param null $orderInfo
     * @return mixed
     */
    public function buildAutoPayUrl($orderInfo = null)
    {
        // TODO: Implement buildAutoPayUrl() method.
    }

    /**
     * 生成调用我方订购回调（同步）的地址
     * @param null $payResultInfo
     * @return mixed
     */
    public function buildPayCallbackUrl($payResultInfo = null)
    {
        // TODO: Implement buildPayCallbackUrl() method.
    }

    /**
     * 订购回调结果（异步）
     * @param null $payResultInfo
     * @return mixed
     */
    public function asyncPayCallback($payResultInfo = null)
    {
        // TODO: Implement asyncPayCallback() method.
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
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     */
    public function unPayCallback($unPayResultInfo = null)
    {
        // TODO: Implement unPayCallback() method.
    }

    /**
     * 到局方鉴权，判断是否为积分订购过来的
     * @param $productInfo 鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authenticationJiFen($productInfo = null)
    {
        LogUtils::info("Pay13000051 --> user authentication productInfo:" . json_encode($productInfo));
        // TODO: Implement authentication() method.
        if ($productInfo == null || empty($productInfo) || !is_array($productInfo)) {
            // 默认使用我方的包月产品进行鉴权
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = PRODUCT_ID;
            $productInfo['serviceId'] = SERVICE_ID;
            $productInfo['contentId'] = CONTENT_ID;
        }

        // 鉴权地址
        $authorizationUrl = ORDER_AUTHORIZATION_URL;

        // userToken
        $userToken = MasterManager::getUserToken();

        //鉴权参数
        $info = array(
            "spId" => $productInfo['spId'],
            "carrierId" => MasterManager::getAreaCode(),
            "userId" => $this->_interceptAccount(MasterManager::getAccountId()),
            "UserToken" => $userToken,
            "productId" => $productInfo['productId'],
            "serviceId" => $productInfo['serviceId'],
            "contentId" => $productInfo['contentId'],
            "timeStamp" => "" . time(),
        );

        LogUtils::info("Pay13000051 --> user authentication param:" . json_encode($info));

        // post到局方鉴权，同步返回数据
        $result = HttpManager::httpRequest("POST", $authorizationUrl, json_encode($info));

        LogUtils::info("Pay13000051 --> user authentication result:  " . $result);

        return json_decode($result);
    }

    public function buildPointExchangeUrl($orderInfo = null) {
        $userId = MasterManager::getUserId();
        // 构建我方的应用订购信息
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->userId = $userId;
            $orderInfo->orderReason = 232;
            $orderInfo->remark = "login-jifen";
            $orderInfo->lmreason = 2;
            $orderInfo->contentId = CONTENT_ID;
        }

        $orderType = 1;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay13000051::buildPointExchangeUrl() ---> orderItems is empty");
        }

        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单号
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
            $orderInfo->remark, $orderInfo->contentId, $orderType);
        if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
            LogUtils::info("Pay13000051::buildPointExchangeUrl() ---> 拉取订单失败:" . $tradeInfo->result);
            return null;
        }
        $orderInfo->tradeNo = $tradeInfo->order_id;

        $param = array(
            "userId" => $orderInfo->userId,
            "tradeNo" => $orderInfo->tradeNo,
            "lmreason" => $orderInfo->lmreason != null ? $orderInfo->lmreason : 0,
            "lmcid" => CARRIER_ID,
            "isJiFen" => 1
        );
        LogUtils::info("Pay13000051::buildPointExchangeUrl() ---> _buildPointExchangeUrl" );
        $url = $this->_buildPointExchangeUrl($param);
        return $url;
    }

    public function _buildPointExchangeUrl($param=null) {
        if ($param == null) {
            $param = array(
                "returnPageName" => "wait",
                "Result" => 'back',
            );
        }

        // 地区与积分商品编码
        $areaCode = MasterManager::getAreaCode();
        $pList = array(
            "201"=>"V321300000035", // 天津
        );
        LogUtils::info("Pay13000051::_buildPointExchangeUrl areaCode:" . $areaCode);
        $pointExchangeUrl = null;

        if (!in_array($areaCode, array_keys($pList))) {
            return $pointExchangeUrl;
        }

        $callbackUrl = $this->_buildPayCallbackUrl($param);
        $callbackUrl = urlencode($callbackUrl);
        $proId = $pList[$areaCode];
        $userAccountId = $this->getUserAccountId();
        $pointExchangeUrl = "http://202.99.114.14:15081/integralExchange/recommend.html?userId=" .$userAccountId . "&carrierid=" . $areaCode . "&specialareatype=2&goodsid=". $proId ."&returnurl=" . $callbackUrl;
        LogUtils::info("############pointExchangeUrl: $pointExchangeUrl");
        return $pointExchangeUrl;
    }

    /**
     * @Brief:此函数用于获取用户的业务帐号（是去_xxx区域码的）
     *          如：053222222_216 ----> 053222222
     * @return: $accountId  没有区域码的业务帐号
     */
    private static function getUserAccountId() {
        $accountId = MasterManager::getAccountId();
        // 判断能读到业务帐号后面的内容
        $idx = strripos($accountId, '_');
        if ($idx && ($idx > 0)) {
            $accountId = substr($accountId, 0, $idx);
        }

        return $accountId;
    }

    public function vipUserUnRegister()
    {
        $unRegUrl = ORDER_SERVICE_CANCEL_ORDER_URL;
        // 天津专用入口的计费
        $productId = PRODUCT_ID. "@" . MasterManager::getAreaCode();
        $serviceId = SERVICE_ID;
        $contentId = CONTENT_ID;

        // 获取用户的省份ID
        $provinceInfo = Utils::getUserProvince(MasterManager::getAreaCode());
        $unRegInfo = array();
        $unRegInfo['serviceId'] = MasterManager::getAccountId();
        $unRegInfo['userProvince'] = $provinceInfo[0];//"13";
        $unRegInfo['productId'] = $productId;
        $unRegInfo['action'] = "2";
        $unRegInfo['outSource'] = "1";


        // 构建查询用户消费记录的参数
        $info = array(
            "serviceId" => MasterManager::getAccountId(),
            "userProvince" => $provinceInfo[0],
            "contentId" => $contentId,
            "productId" => $productId,
            "action" => $unRegInfo['action'],
            //"orderMode" => '1',
            //"continueType" => '1',
            "outSource" => $unRegInfo['outSource'],
        );

        //sha256(<private key>+< serviceId>+<userProvince>+< contentId >+< productId >+< action >+< orderMode >+< continueType >+< outSource >+<timestamp>)+<timestamp>

        $timeFormat = date('YmdHis'); // timestamp是14
        $data = SHA256_SECRET_KEY;
        $option = array("serviceId", "userProvince", "productId", "action", "outSource");
        foreach ($info as $key => $value) {
            if (in_array($key, $option)) {
                $data .= $value;
            }
        }
        // 再加上时间
        $data .= $timeFormat;
        LogUtils::info("vipUserUnRegister--> SHA256_SECRET_KEY info:".json_encode($info));
        LogUtils::info("vipUserUnRegister--> SHA256_SECRET_KEY data:".$data);
        // 对data进行加密，然后再追加上时间
        $sha256Signature = hash('sha256', $data, false);
        LogUtils::info("vipUserUnRegister--> SHA256_SECRET_KEY sha256Signature:".$sha256Signature);
        $sha256Signature .= $timeFormat;
        $unRegInfo['signature'] = $sha256Signature;
        LogUtils::info("vipUserUnRegister--> unRegUrl:".$unRegUrl);
        LogUtils::info("vipUserUnRegister--> unRegInfo:".json_encode($unRegInfo));
        $result = HttpManager::httpRequest("POST", $unRegUrl, json_encode($unRegInfo));

        // 上报退订结果给cws，把用户业务帐号增加进去一起上传
        $cancelData = json_decode($result, true);
        if($cancelData['result'] == '0'){
            MasterManager::setUserIsVip(0);
        }
        $cancelData['UserID'] = MasterManager::getAccountId();
        PayAPI::postCancelOrderResultBy0000051($cancelData);

        LogUtils::info("vipUserUnRegister--> result: ".$result);
        return $result;
    }
}