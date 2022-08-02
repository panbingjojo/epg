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
use Home\Model\Video\VideoManager;

class Pay10000051 extends PayAbstract
{

    //返回山西联通线下大包
    public function getPosition(){
        $position = array(177,47,175,135,136,139,140,137,138,92,95,96,217,132,156,50,54,153,61,62,90,52,51,69,126,121,88,
            159,158,152,157,151,144,145,146,174,59,169,172,168,167,170,171,48,179,55,58,122,46,133,117,118,87,182,185,183,
            123,124,125,101,102,150,181,93,107,149,112,115,111,113,49,120,116,114,103,68,94,60,173,119,180,141,57,56,186,
            97,100,65,148,67,147,178,63,143,154,155,176,53,64,131,127,130,129,128,134,70,184,71,105,100,98,142,106,91,160,
            218,31,32,33,34,35,36,37,40,219,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,
            269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,285,286,287,288,289,292,293,294,295,296,297,298,299,
            300,301,309,310,311,312,313,314,315,316,318,319,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,
            340,341,342,343,344,345);
        return $position;
    }

    //天津小包计费入口
    public function getSmallBagPosition(){
        $position = array(266,290);
        return $position;
    }
    /**
     * 到局方鉴权，只有包月产品才能鉴权。（可以鉴权其他CP的产品，需要传递产品信息）
     * @param $productInfo 鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authentication($productInfo = null)
    {
        LogUtils::info("Pay10000051 --> user authentication productInfo:" . json_encode($productInfo));
        // TODO: Implement authentication() method.
        if ($productInfo == null || empty($productInfo) || !is_array($productInfo)) {
            // 默认使用我方的包月产品进行鉴权
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = PRODUCT_ID . "@" . MasterManager::getAreaCode();
            $productInfo['serviceId'] = SERVICE_ID;
            $productInfo['contentId'] = CONTENT_ID;
        }

        if(MasterManager::getAreaCode() == '207' && in_array(MasterManager::getEnterPosition(), $this->getPosition())){
            $productInfo['spId'] = SHANXI_SPID;
            $productInfo['productId'] = PRODUCT_SHANXI_ID;
            $productInfo['serviceId'] = SERVICE_SHANXI_ID;
            $productInfo['contentId'] = CONTENT_SHANXI_ID;
        }

        if(MasterManager::getAreaCode() == '201' && in_array(MasterManager::getEnterPosition(), $this->getSmallBagPosition())){
            $productInfo['productId'] = PRODUCT_ID_SMALL_BAG;
            $productInfo['serviceId'] = SERVICE_ID_SMALL_BAG;
            $productInfo['contentId'] = CONTENT_ID_SMALL_BAG;
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

        LogUtils::info("Pay10000051 --> user authentication param:" . json_encode($info));

        // post到局方鉴权，同步返回数据
        $result = HttpManager::httpRequest("POST", $authorizationUrl, json_encode($info));

        LogUtils::info("Pay10000051 --> user authentication result:  " . $result);

        return json_decode($result);
    }

    /**
     * 查询童锁的开启状态
     * @param $loginAccount
     * @param $productId
     * @return mixed
     */
    public function querySafeLockStatus($loginAccount, $productId)
    {
        $ret = 0;
        $header = array(
            'Content-type: application/json',
        );
        $time = date("YmdHis", time());
        $sign = APP_KEY . $time;
        $account = $this->_interceptAccount($loginAccount);
        $param = array(
            "productId" => $productId,
            "loginAccount" => $account,
            "appId" => APP_ID,
            "time" => $time,
            "sign" => strtolower(md5($sign)),
        );

        LogUtils::info("querySafeLockStatus ---> $param: " . json_encode($param));
        $result = HttpManager::httpRequestByHeader("POST", PAY_LOCK_QUERY_URL, $header, json_encode($param));
        LogUtils::info("querySafeLockStatus ---> result: " . $result);
        if (!empty($result)) {
            $resultObj = json_decode($result);
            $ret = $resultObj->returncode;
        }

        return $ret;
    }

    /**
     * 到局方鉴权，只有包月产品才能鉴权。（可以鉴权其他CP的产品，需要传递产品信息）
     * 天津地区要鉴权两次：先通过authentication进行鉴权，再通过authenticationTJ
     */
    public function authenticationTJ()
    {
        // 默认使用我方的包月产品进行鉴权
        $productInfo = array();
        $productInfo['spId'] = SPID;
        $productInfo['productId'] = PRODUCT_ID_TJ;
        $productInfo['serviceId'] = SERVICE_ID_TJ;
        $productInfo['contentId'] = CONTENT_ID_TJ;

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

        LogUtils::info("Pay10000051 --> user authenticationTJ param:" . json_encode($info));

        // post到局方鉴权，同步返回数据
        $result = HttpManager::httpRequest("POST", $authorizationUrl, json_encode($info));

        LogUtils::info("Pay10000051 --> user authenticationTJ result:  " . $result);

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
            if ($payInfo->product_id == PRODUCT_ID_15) {
                $productInfo = $authInfo->productList[0];
            } else {
                $productInfo = $authInfo->productList[1];
                if ($productInfo == "") {
                    $productInfo = $authInfo->productList[0];
                }
            }

            if(MasterManager::getAreaCode() == '201'){
                $productList = $authInfo->productList;
                for($i=0;$i<count($productList);$i++){
                    if(in_array(MasterManager::getEnterPosition(), $this->getSmallBagPosition()) && $productList[$i]->productId == PRODUCT_ID_SMALL_BAG){
                        $productInfo = $productList[$i];
                        break;
                    }else{
                        $productInfo = $productList[$i];
                    }
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

        if(MasterManager::getAreaCode() == '207' && in_array(MasterManager::getEnterPosition(), $this->getPosition())){
            $userInfo->spId = SHANXI_SPID;
            $userInfo->productId = PRODUCT_SHANXI_ID;
            $userInfo->serviceId = SERVICE_SHANXI_ID;
            $userInfo->contentId = CONTENT_SHANXI_ID;
        }
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
        LogUtils::info(" payCallback 10000051 ---> payResult: " . json_encode($payResultInfo));

        // 添加局方数据上报的行为，如果成功的话操作结果上报1，否则上报失败的错误码
        $operateResult = $payResultInfo->result == 0 ? 1 : $payResultInfo->result;
        DebugAPIController::sendUserBehaviour000051(DebugAPIController::CHINAUNICOM_REPORT_DATA_TYPE["order"],$operateResult);

        // 积分兑换“健康魔方”，取消订购或订购失败，返回到积分兑换页面(天津)
        /*
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

                    LogUtils::info("Pay10000051::payCallback() ---> 积分商城returnUrl：" . $jumpUrl);
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
            LogUtils::info("Pay10000051::payCallback() url:". $intentUrl);
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
            LogUtils::info("Pay01000051::payCallback() ---> jump returnPageName: " . $payResultInfo->returnPageName);
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

        /*
        $authInfo = $this->authentication();
        $authVip = $authInfo && $authInfo->result == 0;
        if($authVip){
            if($payResultInfo['Result'] != 0){
                LogUtils::error("Pay::authentication 订购结果与鉴权结果不符!"."订购结果：".$payResultInfo['Result']."鉴权结果：1");
                $payResultInfo['Result'] = 0;
            }
        }else{
            if($payResultInfo['Result'] == 0){
                LogUtils::error("Pay::authentication 鉴权结果与订购结果不符!"."订购结果：0"."鉴权结果：0");
                $payResultInfo['Result'] = -1;
            }
        }
        */
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
            LogUtils::error("Pay10000051::buildUrlAndPay() ---> orderItems is empty");
            return;
        }

        $this->dataReport();
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;
        if(MasterManager::getAreaCode() == '201' && in_array(MasterManager::getEnterPosition(), $this->getSmallBagPosition())){
            LogUtils::error("Pay10000051::orderItems ---> ".json_encode($orderItems));
            $orderInfo->vipId = $orderItems[1]->vip_id;
        }

        $productInfo['spId'] = $userInfo->spId;
        $productInfo['productId'] = $userInfo->productId;
        $productInfo['serviceId'] = $userInfo->serviceId;
        $productInfo['contentId'] = $userInfo->contentId;

        $authInfo = $this->authentication($productInfo);
        LogUtils::info("Pay10000051::buildUrlAndPay() ---> authentication result: " . $authInfo->result);
        if ($authInfo->result === 10020001) {
            //鉴权失败，保存鉴权返回的订购信息项。
            SessionManager::setUserSession(SessionManager::$S_ORDER_ITEM, $authInfo);
            $authProductInfo = $authInfo->productList[0];
            // 创建订单号

            if(MasterManager::getAreaCode() == '201'){
                LogUtils::info("Pay10000051---> authentication productList: " . json_encode($authInfo->productList));
                $productList = $authInfo->productList;
                for($i=0;$i<count($productList);$i++){
                    if(in_array(MasterManager::getEnterPosition(), $this->getSmallBagPosition()) && $productList[$i]->productId == PRODUCT_ID_SMALL_BAG){
                        $authProductInfo = $productList[$i];
                        break;
                    }else{
                        $authProductInfo = $productList[$i];
                    }
                }
            }

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
                    LogUtils::info("Pay10000051::buildUrlAndPay() ---> regVip  success!");
                    $isVip = 1;
                }
                LogUtils::info("Pay10000051::buildUrlAndPay() --->regVip failed!");
            }
            SessionManager::setUserSession(SessionManager::$S_IS_VIP_USER, $isVip);

            IntentManager::back();
        } else {
            LogUtils::info("Pay10000051::buildUrlAndPay() ---> user exception");
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
        LogUtils::info("Pay10000051::buildDirectPayUrl() --->  userInfo: " . json_encode($userInfo));
        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay10000051::buildDirectPayUrl() ---> orderItems is empty");
            return $payUrl;
        }

        //时间在2021-11-08--15
        //--办事处要求临时关闭
        if (MasterManager::getAreaCode() == '204' && false) {
            //河南办事处要求周一到周五-8点到18关闭该接口订购，周末放开
            $w=date('w');
            if($w>=1 && $w<=5){
                $hour=date( "H");
                if($hour>=8 && $hour<18){
                    return $payUrl;
                }
            }

            $accountId = MasterManager::getAccountId();
            if(strpos($accountId,'371') !== false){
                return $payUrl;
            }
        }

        $this->dataReport();
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        if(MasterManager::getAreaCode() == '201' && in_array(MasterManager::getEnterPosition(), $this->getSmallBagPosition())){
            $orderInfo->vipId = $orderItems[1]->vip_id;
        }

        $productInfo['spId'] = $userInfo['spId'];
        $productInfo['productId'] = PRODUCT_ID . "@" . MasterManager::getAreaCode();
        $productInfo['serviceId'] = $userInfo['serviceId'];
        $productInfo['contentId'] = $userInfo['contentId'];

        $authInfo = $this->authentication($productInfo);
        LogUtils::info("Pay10000051::buildDirectPayUrl() ---> authentication result: " . $authInfo);
        if ($authInfo->result === 10020001) {
            //鉴权失败，保存鉴权返回的订购信息项。
            SessionManager::setUserSession(SessionManager::$S_ORDER_ITEM, $authInfo);

            $authProductInfo = $authInfo->productList[0];

            if(MasterManager::getAreaCode() == '201'){
                LogUtils::info("Pay10000051---> authentication productList: " . json_encode($authInfo->productList));
                $productList = $authInfo->productList;
                for($i=0;$i<count($productList);$i++){
                    if(in_array(MasterManager::getEnterPosition(), $this->getSmallBagPosition()) && $productList[$i]->productId == PRODUCT_ID_SMALL_BAG){
                        $authProductInfo = $productList[$i];
                        break;
                    }else{
                        $authProductInfo = $productList[$i];
                    }
                }
            }

            // 创建订单号
            $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
                $orderInfo->remark, $authProductInfo->contentID, $orderType);
            if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
                LogUtils::info("Pay10000051::buildDirectPayUrl() ---> 拉取订单失败:" . $tradeInfo->result);
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
            LogUtils::info("Pay10000051::buildDirectPayUrl() ---> auth result = 0");
        } else {
            LogUtils::info("Pay10000051::buildDirectPayUrl() ---> user exception");
        }
        if(!empty($payUrl)){
            PayAPI::addUserPayUrl(urlencode($payUrl),$orderInfo->tradeNo,1);
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
        LogUtils::info("Pay10000051 --> user authentication productInfo:" . json_encode($productInfo));
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

        LogUtils::info("Pay10000051 --> user authentication param:" . json_encode($info));

        // post到局方鉴权，同步返回数据
        $result = HttpManager::httpRequest("POST", $authorizationUrl, json_encode($info));

        LogUtils::info("Pay10000051 --> user authentication result:  " . $result);

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
            LogUtils::error("Pay10000051::buildPointExchangeUrl() ---> orderItems is empty");
        }

        $this->dataReport();
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单号
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
            $orderInfo->remark, $orderInfo->contentId, $orderType);
        if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
            LogUtils::info("Pay10000051::buildPointExchangeUrl() ---> 拉取订单失败:" . $tradeInfo->result);
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
        LogUtils::info("Pay10000051::buildPointExchangeUrl() ---> _buildPointExchangeUrl" );
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
        LogUtils::info("Pay10000051::_buildPointExchangeUrl areaCode:" . $areaCode);
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

    public function dataReport()
    {
        LogUtils::info("dataReport isReportOperateTrace:".MasterManager::isReportOperateTrace());
        if(!MasterManager::isReportOperateTrace()){
            $videoInfo = VideoManager::getRecommennd(MasterManager::getUserId(), 0);
            $numbers = rand(5,50);
            $videoTitle = $videoInfo->data[0]->title;
            DebugAPIController::sendUserBehaviour000051(DebugAPIController::CHINAUNICOM_REPORT_DATA_TYPE["player"], $videoTitle,$numbers);
        }
    }

    public function vipUserUnRegister()
    {
        $unRegUrl = ORDER_SERVICE_CANCEL_ORDER_URL;
        // 天津专用入口的计费
        $productId = PRODUCT_ID. "@" . MasterManager::getAreaCode();
        $serviceId = SERVICE_ID;
        $contentId = CONTENT_ID;

        if (MasterManager::getAreaCode() == '207' && in_array(MasterManager::getEnterPosition(), $this->getShanXiOfflinePosition())) {
            $productId = PRODUCT_SHANXI_ID;
            $serviceId = SERVICE_SHANXI_ID;
            $contentId = CONTENT_SHANXI_ID;
        }

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