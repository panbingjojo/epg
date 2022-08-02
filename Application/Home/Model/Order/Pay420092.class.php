<?php
/**
 * Created by longmaster
 * @Brief: 主要处理湖北电信EPG的计费相关流程
 */

namespace Home\Model\Order;


use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\TextUtils;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;


class Pay420092 extends PayAbstract
{
    /**
     * 用户到局方鉴权
     * @param $param
     * @return mixed
     */
    public function authentication($param = null)
    {
        // TODO: Implement authentication() method.
        $isVip = 0;

        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = MasterManager::getAccountId();
        $userToken = $epgInfoMap["userToken"];

        /*
        // 查询订单详细
        $respond = $this->queryUserOrderDetail($userAccount, $userToken);

        $timestamp = Date('Ymdhms'); // 20171130121108

        if ($respond[1][0] == 0) {
            $result = json_decode($respond[2][1]);
            $count = count($result);
            for ($i = 0; $i < $count; $i++) {
                $expiredTime = $result[$i]->expiredTime;
                $productID = $result[$i]->productID;
                if ($productID == PRODUCT_ID_18 || $productID == PRODUCT_ID) {
                    // 判断失效时间
                    if (strcmp($expiredTime, $timestamp) >= 0) {
                        $isVip = 1;
                        break;
                    }
                }
            }
        }
        if(MasterManager::getAccountId()=="hbgd3" || MasterManager::getAccountId()=="hwhbgd3"){
            $isVip = $this->performAuthIdentity();
        }
        */
        if (!MasterManager::getIsTestUser()){
            $isVip = $this->performAuthIdentity(PRODUCT_ID_JK_18);
            if($isVip == 0){
                $isVip = $this->performAuthIdentity(PRODUCT_ID_CX_25);
                if($isVip == 0){
                    $isVip = $this->performAuthIdentity(PRODUCT_ID_DAY_30);
                    if($isVip == 0){
                        $isVip = $this->performAuthIdentity(PRODUCT_ID_AFM);
                    }
                }
            }
        }
        LogUtils::info("Pay420092::performAuthIdentity() ---> isVip：" . $isVip);
        return $isVip;
    }

    public function performAuthIdentity($productID)
    {
        $isVipWithContent = 0;
        $transactionID = SPID . date("YmdHis") . mt_rand(100000000, 999999999) . mt_rand(100000000, 999999999);

        if(substr(MasterManager::getAccountId(),0,2) == "hw" || substr(MasterManager::getAccountId(),0,2) == "HW"){
            $wsdlUrl = "http://127.0.0.1:10001/Public/ThirdParty/wsdl/420092/HWVASService.wsdl";
            $userAuthFunc = "serviceAuth";
            $requestParam = array(
                "ServiceAuthReq" => array(
                    "transactionID" => $transactionID, // 事务编号
                    "SPID" => SPID_NEW, // 应用商唯一标识
                    "userID" => MasterManager::getAccountId(), // IPTV用户编号
                    "userToken" => MasterManager::getUserToken(), // 临时身份证明
                    "productID" => $productID, // 产品编号
                    "serviceID" => $productID == PRODUCT_ID_AFM?SERVICE_ID_AFM:SERVICE_ID_HW, // 服务编号
                    "contentID" => $productID == PRODUCT_ID_AFM?CONTENT_ID_AFM:CONTENT_ID, // 内容编号
                    "timeStamp" => Utils::getMillisecond(), // 时间戳,单位毫秒
                    "IP" => "", // IP地址
                    "MAC" => "", // 机顶盒Mac地址),
                ),
            );
        }else{
            $wsdlUrl = "http://127.0.0.1:10001/Public/ThirdParty/wsdl/420092/ZTE353VA.0.wsdl";
            $userAuthFunc = "ServiceAuth";
            $requestParam = array(
                "ServiceAuth"=> array(
                    "ServiceAuthIn"=> array(
                        "SPID" => SPID_NEW, // 应用商唯一标识
                        "UserID" => MasterManager::getAccountId(), // IPTV用户编号
                        "UserToken" => MasterManager::getUserToken(), // 临时身份证明
                        "ProductID" => $productID, // 产品编号
                        "ServiceID" => $productID == PRODUCT_ID_AFM?SERVICE_ID_AFM:SERVICE_ID_ZX, // 服务编号
                        "ContentID" => $productID == PRODUCT_ID_AFM?CONTENT_ID_AFM:CONTENT_ID, // 内容编号
                        "TimeStamp" => Utils::getMillisecond(), // 时间戳,单位毫秒
                        "IP" => "", // IP地址
                        "MAC" => "", // 机顶盒Mac地址),
                        "TransactionID" => $transactionID, // 事务编号
                    ),
                ),
            );
        }
        LogUtils::info("Pay420092::performAuthIdentity() ---> requestParam：" . json_encode($requestParam));

        $authResult = $this->requestSoap($wsdlUrl, $userAuthFunc, $requestParam);
        if ($authResult == null) {
            LogUtils::info("Pay420092::performAuthIdentity() ---> authResult is null");
        }else {
            LogUtils::info("Pay420092::performAuthIdentity() ---> authResult：" . json_encode($authResult));
        }

        if(substr(MasterManager::getAccountId(),0,2) == "hw" || substr(MasterManager::getAccountId(),0,2) == "HW"){
            $userTypeAuth = $authResult;
        }else{
            $userTypeAuth = $authResult->ServiceAuthReturn->Result;
        }

        LogUtils::info("Pay420092::performAuthIdentity() ---> userTypeAuth：" . $userTypeAuth);
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
     * 订购关系鉴权并上报数据
     * @param $param
     * @return mixed
     */
    public function PayAuthentication($tradeNo = null)
    {
        $isVip = $this->authentication();
        LogUtils::info("task::tradeNo: " . $tradeNo."---isVip:".$isVip);
        if($isVip){
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getAccountId();
            $payResultInfo->tradeNo = $tradeNo;
            $payResultInfo->lmreason = 0;
            $payResultInfo->returnPageName = "";
            $payResultInfo->isPlaying = 0;
            $payResultInfo->isIFramePay =  0;
            $payResultInfo->videoInfo = "";

            $this->_uploadPayResult();
        }
        return $isVip;
    }

    /**
     * 构建到局方用户验证地址
     * @param $param
     * @return mixed
     */
    public function buildVerifyUserUrl($param = null)
    {
        // TODO: Implement buildVerifyUserUrl() method.
        return "";
    }

    /**
     * 我方订购页构建到局方的订购地址
     * @param null $payInfo
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
            return json_encode($ret);
        }
        $payInfo->orderType = 1;

        $payInfo->vipId = $payInfo->vip_id;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem();
        if (count($orderItems) > 0 && $payInfo->price != '3900') {
            $num = count($orderItems);
            for($i=0;$i<$num;$i++){
                if(PRODUCT_ID == PRODUCT_ID_JK_18 && $orderItems[$i]->price == 1800){
                    $payInfo->vipId = $orderItems[$i]->vip_id;
                }
                if(PRODUCT_ID == PRODUCT_ID_CX_25 && $orderItems[$i]->price == 2500){
                    $payInfo->vipId = $orderItems[$i]->vip_id;
                }
                if(PRODUCT_ID == PRODUCT_ID_DAY_30 && $orderItems[$i]->price == 3000){
                    $payInfo->vipId = $orderItems[$i]->vip_id;
                }
            }
        }

        if(empty($payInfo->orderReason)){
            $payInfo->orderReason = 102;
        }

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($payInfo->vipId, $payInfo->orderReason, $payInfo->remark, "", $payInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 创建失败
            LogUtils::error("createPayTradeNo 创建订单失败:".json_encode($tradeInfo));
            $ret['result'] = $tradeInfo->result;
            return json_encode($ret);
        }
        // 鉴权失败说明用户可订购， 构建订购地址
        $payInfo->tradeId = $tradeInfo->order_id;

        // 订购的产品信息
        $productInfo = new \stdClass();
        $productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
        $productInfo->price = 1800;                     // 价格
        $productInfo->PurchaseType = 0;                 // 包月自动续费
        $payInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();

        // 通过缓存得到用户账号和token
        $userAccount = MasterManager::getAccountId();
        $userToken = $epgInfoMap["userToken"];

        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->adContentId = $epgInfoMap['adContentId'];
        $userInfo->adContentName = $epgInfoMap['adContentName'];
        $userInfo->recSourceId = $epgInfoMap['recSourceId'];
        $userInfo->stbId = $epgInfoMap['stbId'];

        //$payUrl = $this->_buildPayUrl($userInfo, $payInfo, $productInfo);
        $payUrl = $this->_buildPayUrl_New($userInfo, $payInfo, $productInfo);

        $ret['result'] = 0;
        $ret['payUrl'] = $payUrl;

        return json_encode($ret);
    }

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildUnPayUrl($payInfo = null)
    {
        // TODO: Implement buildUnPayUrl() method.
        return "";
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->isJointActivity = isset($_GET['isJointActivity']) ? $_GET['isJointActivity'] : 0; // 是否联合活动发起订购
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->isIFramePay = isset($_GET['isIFramePay']) ? $_GET['isIFramePay'] : 0;
            $orderInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['singlePayItem']) ? $_GET['singlePayItem'] : 1;
            $orderInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
            $orderInfo->orderType = 1;
        }

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) > 0) {
            $num = count($orderItems);
            for($i=0;$i<$num;$i++){
                if(PRODUCT_ID == PRODUCT_ID_JK_18 && $orderItems[$i]->price == 1800){
                    $orderInfo->vipId = $orderItems[$i]->vip_id;
                }
                if(PRODUCT_ID == PRODUCT_ID_CX_25 && $orderItems[$i]->price == 2500){
                    $orderInfo->vipId = $orderItems[$i]->vip_id;
                }
                if(PRODUCT_ID == PRODUCT_ID_DAY_30 && $orderItems[$i]->price == 3000){
                    $orderInfo->vipId = $orderItems[$i]->vip_id;
                }
            }
        }else{
            LogUtils::error("Pay420092::directToPay() ---> orderItems is empty");
            IntentManager::back();
            exit();
        }
        // 直接订购，使用第一个订购项（包月订购项）。

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 生成订购单号失败
            LogUtils::info("Pay420092::directToPay() ---> 拉取订单失败:" . $tradeInfo->result);
            IntentManager::back();
            exit();
        }

        // 鉴权失败说明用户可订购， 构建订购地址
        $orderInfo->tradeId = $tradeInfo->order_id;

        // 订购的产品信息
        $productInfo = new \stdClass();
        $productInfo->productNo = productID_18;       // 产品编号
        $productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
        $productInfo->price = 1800;                     // 价格
        $productInfo->PurchaseType = 0;                 // 包月自动续费
        $orderInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("Pay420092::buildPayUrl() ---> epgInfoMap: " . json_encode($epgInfoMap));

        // 通过缓存得到用户账号和token
        $userAccount = MasterManager::getAccountId();
        $userToken = $epgInfoMap["userToken"];

        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->adContentId = $epgInfoMap['adContentId'];
        $userInfo->adContentName = $epgInfoMap['adContentName'];
        $userInfo->recSourceId = $epgInfoMap['recSourceId'];
        $userInfo->stbId = $epgInfoMap['stbId'];
        $userInfo->IP = $epgInfoMap['userIP'];

        //$payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        $payUrl = $this->_buildPayUrl_New($userInfo, $orderInfo, $productInfo);
        if ($payUrl != null && $payUrl != "")
            header("Location:" . $payUrl);
        else {
            IntentManager::back();
        }
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
            LogUtils::info("Pay420092::payCallback ---> _GETPay420092::payCallback ---> _GET: " . json_encode($_GET));
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = $_GET['userId'];
            $payResultInfo->tradeNo = $_GET['tradeNo'];
            $payResultInfo->lmreason = $_GET['lmreason'];
            $payResultInfo->returnPageName = isset($_GET['returnPageName']) && $_GET['returnPageName'] != null
                ? $_GET['returnPageName'] : "";
            $payResultInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $payResultInfo->isIFramePay = isset($_GET['isIFramePay']) ? $_GET['isIFramePay'] : 0;
            $payResultInfo->videoInfo = isset($_GET['videoInfo']) && $_GET['videoInfo'] != ""
                ? urldecode($_GET['videoInfo']) : null;
        }

        if(empty(MasterManager::getAccountId())){
            MasterManager::setAccountId($_GET['userAccount']);
        }
        if(empty(MasterManager::getUserToken())){
            MasterManager::setUserToken($_GET['userToken']);
        }
        LogUtils::info("payCallback userAccount:".MasterManager::getAccountId()."-".$_GET['userAccount']);
        LogUtils::info("payCallback userToken:".MasterManager::getUserToken()."-".$_GET['userToken']);
        // 上报订购信息
        $this->_uploadPayResult();

        // 判断用户是否是VIP，更新到session中
        $isVip = UserManager::isVip($payResultInfo->userId);
        // 如果是播放订购成功回来，则过去继续数据&& ($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        if ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1 || ($payResultInfo->isIFramePay == 1)) {
            LogUtils::info("Pay420092::payCallback420092() ---> lmreason:" . $payResultInfo->lmreason);
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            header('Location:' . $returnUrl);
            return;
        }

        if ($isVip == 1 && $videoInfo != null) {
            // 继续播放
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        } else {
            IntentManager::back($payResultInfo->returnPageName);
        }
        exit();
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
     * 请求事务编号（sp编码(8位)+时间戳(yyyyMMddHHmmss 14位)+序号（18位自增））
     * @param $spId
     * @return string
     */
    private function _makeTransactionID($spId)
    {
        $timestamp = Date('Ymdhms'); // 20171130121108

        list($t1, $t2) = explode(' ', microtime());
        $millisecond = (float)sprintf('%.0f', (floatval($t1) + floatval($t2)) * 1000);

        $seq = $millisecond . rand(10000, 99999); // 151204603762814235
        $transactionId = $spId . $timestamp . $seq;
        LogUtils::info("Pay420092::makeTransactionID() ---> transactionId:" . $transactionId);
        return $transactionId;
    }


    /**
     * 新生成订购信息
     * @param $userInfo
     * @param $payInfo
     * @param $productInfo
     * @return bool|string
     */
    private function _buildPayUrl_New($userInfo, $payInfo, $productInfo)
    {
        $userAccount = $userInfo->accountId;
        $userToken = $userInfo->userToken;
        $stbId = $userInfo->stbId;

        // 平台信息
        $platformType = MasterManager::getPlatformType();
        $epgDefinition = $platformType == "hd" ? "1" : "0"; // 高清标识，1:高清 0：标清

        // 组装回调地址
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeId,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId == null? MasterManager::getCarrierId() : $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "isIFramePay" => $payInfo->isIFramePay,        // 是否通过iframe加载订购页面(0--不是, 1--是)
            "videoInfo" => $payInfo->videoInfo,
            "userAccount" => $userAccount,
            "userToken" => $userToken
        );

        $payCallbackUrl = $this->_buildPayCallbackUrl($param);

        // payParam封装请求参数
        $Order = array();
        $Order["SPID"] = rawurlencode(SPID_NEW);
        $Order["UserID"] = rawurlencode($userAccount);
        $Order["UserToken"] = rawurlencode($userToken);
        LogUtils::info("Pay420092::price:".$payInfo->price);
        if($payInfo->price == '3900'){
            $Order["ProductID"] = rawurlencode(PRODUCT_ID_AFM);
            $Order["ServiceID"] = rawurlencode(SERVICE_ID_AFM);
            $Order["ContentID"] = rawurlencode(CONTENT_ID_AFM);
            $Order["ContentType"] = substr($userAccount, 0, 2)=="hw"?rawurlencode(CONTENT_TYPE_HW):rawurlencode(CONTENT_TYPE_ZX);
            $Order["ContentName"] = rawurlencode(mb_convert_encoding(CONTENT_NAME_AFM,'GBK', 'utf-8'));
        }else{
            $Order["ProductID"] = rawurlencode(PRODUCT_ID);
            $Order["ServiceID"] = substr($userAccount, 0, 2)=="hw"?rawurlencode(SERVICE_ID_HW):rawurlencode(SERVICE_ID_ZX);
            $Order["ContentID"] = rawurlencode(CONTENT_ID);
            $Order["ContentType"] = substr($userAccount, 0, 2)=="hw"?rawurlencode(CONTENT_TYPE_HW):rawurlencode(CONTENT_TYPE_ZX);
            $Order["ContentName"] = rawurlencode(mb_convert_encoding(CONTENT_NAME,'GBK', 'utf-8'));
        }
       $Order["CategoryID"] = rawurlencode("");

        $OrderURL = NULL;
        foreach ($Order as $key => $val) {
            $OrderURL .= $key . "=" . $val . "&";
        }
        $OrderURL = substr($OrderURL, 0, -1);
        LogUtils::info("Pay420092::OrderURL:".$OrderURL);

        $payParam  = array();
        // 根据所选择的商品类型 -- 订购用途说明
        $payParam["OrderURL"] = rawurlencode($OrderURL);
        $payParam["OrdersuccessURL"] = rawurlencode(mb_convert_encoding($payCallbackUrl, 'GBK', 'utf-8'));
        $payParam["CancelorderURL"] = rawurlencode(mb_convert_encoding($payCallbackUrl, 'GBK', 'utf-8'));
        $payParam["DeviceID"] = rawurlencode($stbId);
        $payParam["IP"] = rawurlencode($userInfo->IP);
        $payParam["Definition"] = $epgDefinition;
        $payParam["Android"] = 0;
        $payParam["PayType"] = 0;

        // 局方订购地址
        $payUrl = USER_ORDER_URL_NEW . "?"; // 统一鉴权接口
        foreach ($payParam as $key => $val) {
            $payUrl .= $key . "=" . $val . "&";
        }
        $payUrl = substr($payUrl, 0, -1);

        LogUtils::info("Pay420092::_buildPayUrl_New() ---> payUrl: " . $payUrl);
        return $payUrl;
    }


    /**
     * 生成订购信息
     * @param $userInfo
     * @param $payInfo
     * @param $productInfo
     * @return bool|string
     */
    private function _buildPayUrl($userInfo, $payInfo, $productInfo)
    {
        $userAccount = $userInfo->accountId;
        $userToken = $userInfo->userToken;
        $adContentId = $userInfo->adContentId;
        $adContentName = $userInfo->adContentName;
        $recSourceId = $userInfo->recSourceId;
        $stbId = $userInfo->stbId;

        // 平台信息
        $platformType = MasterManager::getPlatformType();
        $faceType = $platformType == "hd" ? 5 : 6;
        $epgDefinition = $platformType == "hd" ? "1" : "0"; // 高清标识，1:高清 0：标清

        // 组装回调地址
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeId,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId == null? MasterManager::getCarrierId() : $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "isIFramePay" => $payInfo->isIFramePay,        // 是否通过iframe加载订购页面(0--不是, 1--是)
            "videoInfo" => $payInfo->videoInfo,
            "userAccount" => $userAccount,
            "userToken" => $userToken
        );

        $payCallbackUrl = $this->_buildPayCallbackUrl($param);

        // 组合INFO参数并加密
        $infoParam = array();
        $infoParam["userID"] = $userAccount;                            // 用户账号
        $infoParam["userToken"] = $userToken;                           // 用户Token
        $infoParam["authType"] = 2;                                     // 1 内容ID计费 2：product（服务）
        $infoParam["optFlag"] = "EPG";                                  // 所属类型
        $infoParam["timeStamp"] = date("YmdHis", time());
        $infoParam["productID"] = $productInfo->productId;               // 产品编号
        $infoParam["price"] = $productInfo->price;                      // 价格
        $infoParam["PurchaseType"] = $productInfo->PurchaseType;        // 按月支付--自动续付
        LogUtils::info("Pay420092::_buildPayUrl() ---> infoParam: " . json_encode($infoParam));

        // 加密
        $infoCan = $this->_encryptPayInfo($infoParam);

        // payParam封装请求参数
        $payParam = array();
        $payParam["transactionID"] = rawurlencode($payInfo->tradeId);
        $payParam["SPID"] = rawurlencode(SPID);
        // 根据所选择的商品类型 -- 订购用途说明
        $payParam["orderDescription"] = $productInfo->productId == PRODUCT_ID_18 ?
            rawurlencode(mb_convert_encoding("整包订购，自动续包月", 'GBK', 'utf-8')) : rawurlencode(mb_convert_encoding("订购即生效，有效期内可无限次使用", 'GBK', 'utf-8'));
        $payParam["isAllowPointOrder"] = 0;                //是否允许积分订购
        $payParam["adContentId"] = rawurlencode($adContentId);        // 广告内容编码
        $payParam["adContentName"] = rawurlencode($adContentName);    // 广告内容名称
        $payParam["cdrtype"] = 1;                                                   // 订购来源
        $payParam["recSourceId"] = rawurlencode($recSourceId);        // 推荐入口来源编码
        $payParam["stbID"] = rawurlencode($stbId);                    // 设备Id
        $payParam["faceType"] = $faceType;                      // 分辨率
        $payParam["epgDefinition"] = $epgDefinition;           // 高清标识，1:高清 0：标清
        $payParam["INFO"] = $infoCan;                                               // 产品详细
        $payParam["returnUrl"] = rawurlencode(mb_convert_encoding($payCallbackUrl, 'GBK', 'utf-8'));

        // 局方订购地址
        $payUrl = USER_ORDER_URL . "?"; // 统一鉴权接口
        foreach ($payParam as $key => $val) {
            $payUrl .= $key . "=" . $val . "&";
        }
        $payUrl = substr($payUrl, 0, -1);

        LogUtils::info("Pay420092::_buildPayUrl() ---> payUrl: " . $payUrl);
        return $payUrl;
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
        $intent->setParam("lmreason", $param['lmreason']);
        $intent->setParam("lmcid", $param['lmcid']);
        $intent->setParam("isPlaying", $param['isPlaying']);
        $intent->setParam("isIFramePay", $param['isIFramePay']);
        $intent->setParam("tradeNo", $param['tradeNo']);
        $intent->setParam("returnPageName", $param['returnPageName']);
        $intent->setParam("videoInfo", urlencode($param['videoInfo']));
        $intent->setParam("userAccount", $param['userAccount']);
        $intent->setParam("userToken", $param['userToken']);

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        LogUtils::info("Pay420092::_buildPayCallbackUrl()  payBackUrl: " . $url);
        return $url;
    }

    /**
     * 对订购参数进行加密
     * @param $infoParam
     * @return string
     */
    private function _encryptPayInfo($infoParam)
    {
        // 进行3des加密 base64加密
        $infoStr = "";
        foreach ($infoParam as $k => $v) {
            $infoStr .= $k . "=" . $v . "$";
        }
        $infoStr = substr($infoStr, 0, -1);
        $key = KEY_3DES;                                        // "SP0000011234567890123456";
        $infoCan = Crypt3DES::encode($infoStr, $key);
        $infoCan = mb_convert_encoding($infoCan, 'GBK', 'utf-8');          // GBK编码 url编码
        $infoCan = rawurlencode($infoCan);
        return $infoCan;
    }

    /**
     * 上报订购结果
     * @param null $payResultInfo
     * @return int|mixed
     * @throws \Think\Exception
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        if ($payResultInfo == null) {
            $payResultInfo = array(
                "transactionID" => isset($_GET['transactionID']) ? $_GET['transactionID'] : $_GET['tradeNo'],//$_GET['transactionID'],
                "description" => rawurldecode(mb_convert_encoding($_GET['description'], 'utf-8', 'GBK')),
                'result' => $_GET['result'],
                'purchaseType' => $_GET['purchaseType'],
                'expiredTime' => $_GET['expiredTime'],
                'subscriptionExtend' => $_GET['subscriptionExtend'],
                'subscriptionID' => $_GET['subscriptionID'],
                'productId' => $_GET['productId'],
                'abstract' => $_GET['abstract'],
                'reason' => $_GET['lmreason'],
                'PaidType' => isset($_GET['PaidType']) ? $_GET['PaidType'] : -1,
                'PaidAmount' => isset($_GET['PaidAmount']) ? $_GET['PaidAmount'] : -1,
                'ErrorCode' => isset($_GET['ErrorCode']) ? $_GET['ErrorCode'] : -1,
                'ErrorMsg' => isset($_GET['ErrorMsg']) ? $_GET['ErrorMsg'] : "",
                'carrierId' => isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID,
            );
        }

        if($payResultInfo['PaidType'] != -1){
            $payResultInfo['result'] = "0";
        }else{
            $payResultInfo['result'] = $payResultInfo['ErrorCode'];
        }
        if($this->authentication()){
            $payResultInfo['result'] = "0";
        }

        if($payResultInfo['result'] != "0"){
            $regRes=$this->authentication();
            LogUtils::info("paycallBack regRes:".$regRes);
            $payResultInfo['result'] = $regRes == 1?0:-1;
        }

        LogUtils::info("Pay420092::_uploadPayResult() ---> payResultInfo: " . json_encode($payResultInfo));

        if (!isset($payResultInfo['transactionID'])) {
            LogUtils::error("Pay420092::_uploadPayResult() ---> cannot find transactionID!!!!!!!");
            return 0;
        }

        // 判断订购是否成功
        if ($payResultInfo['result'] == 0 || $payResultInfo['result'] == 9304) {
            MasterManager::setUserIsVip(1);
            MasterManager::setOrderResult(1);
        } else {
            MasterManager::setOrderResult(0);
        }

        $result = PayAPI::postPayResultEx($payResultInfo);
        return $result;
    }

    /**
     * 查询用户订单详情
     * @param $userAccount 用户业务帐号
     * @param $userToken 用户token
     * @return  String
     */
    private function queryUserOrderDetail($userAccount, $userToken)
    {
        // 创建事物id
        $transactionId = $this->_makeTransactionID(SPID);

        //查询地址
        $selectUrl = USER_ORDER_QUERY . "?";
        $param = array();
        //事务编号和SPID号
        $param["transactionID"] = $transactionId;
        $param["SPID"] = SPID;
        //获取INFO参数
        $infoParam = array();
        $infoParam["userID"] = $userAccount;
        $infoParam["userToken"] = $userToken;
        $infoParam["timeStamp"] = date("YmdHis", time());
        //所属类型
        $infoParam["optFlag"] = "EPG";
        $infoParam["orderTransactionID"] = "";
        $infoStr = "";
        foreach ($infoParam as $k => $v) {
            $infoStr .= $k . "=" . $v . "$";
        }
        $infoStr = substr($infoStr, 0, -1);
        //进行3des加密 base64加密
        $infoCan = Crypt3DES::encode($infoStr, KEY_3DES);
        $infoCan = mb_convert_encoding($infoCan, 'GBK', 'utf-8');          // GBK编码 url编码
        $infoCan = rawurlencode($infoCan);

        $param["INFO"] = $infoCan;
        foreach ($param as $key => $val) {
            $selectUrl .= $key . "=" . $val . "&";
        }
        $selectUrl = substr($selectUrl, 0, -1);
        LogUtils::info("Pay420092::authentication url --->: " . $selectUrl);
        $respond = HttpManager::httpRequest("GET", $selectUrl, "");
        LogUtils::info("Pay420092::authentication ---> authResult:" . $respond);
        $respond = rawurldecode($respond);
        $respond = explode("&", $respond);

        foreach ($respond as $key => $val) {
            $val = explode("=", $val);
            $respond[$key] = $val;
        }
        return $respond;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo() {
        // 通过缓存得到用户账号和token
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = MasterManager::getAccountId();
        $userToken = $epgInfoMap["userToken"];
        $adContentId = rawurlencode($epgInfoMap["adContentId"]);        // 广告内容编码
        $adContentName = rawurlencode($epgInfoMap["adContentName"]);    // 广告内容名称
        $recSourceId = rawurlencode($epgInfoMap["recSourceId"]);        // 推荐入口来源编码
        $stbId = rawurlencode($epgInfoMap["stbId"]);                    // 设备Id

        $info = array(
            'accountId' => $userAccount,
            'userToken' => $userToken,
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platformType' => MasterManager::getPlatformType(),

            'adContentId' => $adContentId,
            'adContentName' => $adContentName,
            'recSourceId' => $recSourceId,
            'stbId' => $stbId,
        );

        return $info;
    }

    /**
     * 通过web浏览器进行订购
     * @param null $userInfo
     * @return mixed
     */
    public function webPagePay($userInfo) {
        $payUrl = "";
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 220;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isIFramePay = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->lmreason = 1;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) > 0) {
            $num = count($orderItems);
            for($i=0;$i<$num;$i++){
                if(PRODUCT_ID == PRODUCT_ID_JK_18 && $orderItems[$i]->price == 1800){
                    $orderInfo->vipId = $orderItems[$i]->vip_id;
                }
                if(PRODUCT_ID == PRODUCT_ID_CX_25 && $orderItems[$i]->price == 2500){
                    $orderInfo->vipId = $orderItems[$i]->vip_id;
                }
                if(PRODUCT_ID == PRODUCT_ID_DAY_30 && $orderItems[$i]->price == 3000){
                    $orderInfo->vipId = $orderItems[$i]->vip_id;
                }
            }
        }else{
            LogUtils::error("Pay420092::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        //$orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay420092::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_18;       // 产品编号
            $productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
            $productInfo->price = 1800;                     // 价格
            $productInfo->PurchaseType = 0;                 // 包月自动续费

            $orderInfo->tradeId = $tradeInfo->order_id;
            //$payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
            $payUrl = $this->_buildPayUrl_New($userInfo, $orderInfo, $productInfo);
        }
        LogUtils::info("webPagePay pay PayUrl: " . $payUrl);

        header("Location:" . $payUrl);
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl() {
        $payUrl = "";

        // 得到用户信息
        $info = $this->buildUserInfo();
        $userInfo = new \stdClass();
        $userInfo->accountId = $info["accountId"];
        $userInfo->userToken = $info["userToken"];
        $userInfo->adContentId = $info["adContentId"];
        $userInfo->adContentName = $info["adContentName"];
        $userInfo->recSourceId = $info["recSourceId"];
        $userInfo->stbId = $info["stbId"];

        $userId = MasterManager::getUserId();
        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->lmreason = 2;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) > 0) {
            $num = count($orderItems);
            for($i=0;$i<$num;$i++){
                if(PRODUCT_ID == PRODUCT_ID_JK_18 && $orderItems[$i]->price == 1800){
                    $orderInfo->vipId = $orderItems[$i]->vip_id;
                }
                if(PRODUCT_ID == PRODUCT_ID_CX_25 && $orderItems[$i]->price == 2500){
                    $orderInfo->vipId = $orderItems[$i]->vip_id;
                }
                if(PRODUCT_ID == PRODUCT_ID_DAY_30 && $orderItems[$i]->price == 3000){
                    $orderInfo->vipId = $orderItems[$i]->vip_id;
                }
            }
        }else{
            LogUtils::error("Pay420092::buildDirectPayUrl ---> pay orderItem is empty");
            return $payUrl;
        }
        // 去第一个，默认包月对象
        //$orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay420092::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_18;         // 产品编号
            $productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
            $productInfo->price = 1800;                     // 价格
            $productInfo->PurchaseType = 0;                 // 包月自动续费

            $orderInfo->tradeId = $tradeInfo->order_id;
            //$payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
            $payUrl = $this->_buildPayUrl_New($userInfo, $orderInfo, $productInfo);
        }
        LogUtils::info("buildDirectPayUrl pay PayUrl: " . $payUrl);
        // 跟上我方的订单号：
        if (!empty($payUrl)) {
            $payUrl = $payUrl . "&lmTradeNo=" . $tradeInfo->order_id;
            PayAPI::addUserPayUrl(urlencode($payUrl),$orderInfo->tradeId,1);
        }
        return $payUrl;
    }

    public function requestSoap($wsdl, $function, $params)
    {
        header("content-type:text/html;charset=utf-8");
        LogUtils::info("requestSoap url:" . $wsdl);
        LogUtils::info("requestSoap function:" . $function);
        LogUtils::info("requestSoap params:" . $params);
        $result = null; // 提前定义返回结果

        $isTraceLog = 1; // 是否跟踪异常日志
        $encodeType = "UTF-8"; // 编码类型

        try {
            //解决OpenSSL Error问题需要加第二个array参数，具体参考 http://stackoverflow.com/questions/25142227/unable-to-connect-to-wsdl
            $client = new \SoapClient($wsdl
                , array(
                    "stream_context" => stream_context_create(
                        array(
                            'ssl' => array(
                                'verify_peer' => false,
                                'verify_peer_name' => false,
                            )
                        )
                    ),
                    'soap_version' => SOAP_1_1,      //设置soap版本，默认为：SOAP_1_1
                    'trace' => $isTraceLog,                 //跟踪异常
                    'cache_wsdl' => WSDL_CACHE_NONE,    //禁止缓存服务器 wsdl
                    'encoding' => $encodeType
                )
            );

            $result = $client->__soapCall($function, $params);
            LogUtils::info("requestSoap result" . json_encode($result));
            if(substr(MasterManager::getAccountId(),0,2) == "hw" || substr(MasterManager::getAccountId(),0,2) == "HW"){
                if(empty($result)){
                    $result = $client->__getLastResponse();
                    LogUtils::info("requestSoap result" . $result);

                    $pos=stripos($result,"result");
                    $result = substr($result,$pos,200);

                    $pos=stripos($result,"</ns9");
                    $result = substr($result,1,$pos-1);

                    $pos=stripos($result,">");
                    $result = substr($result,$pos+1,20);

                    LogUtils::info("requestSoap substr result" . $result);
                }
            }
            
            return $result;
        } catch (SOAPFault $e) {
            LogUtils::info("soap error, wsdl=" . $wsdl . ", params=" . $params . ",error=" . $e);
            return null;
        }
    }
}