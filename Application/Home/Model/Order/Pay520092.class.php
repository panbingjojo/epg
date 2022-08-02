<?php
/**
 * Created by PhpStorm.
 * User: CAIJUN
 * Date: 2019/8/20
 * Time: 下午5:36
 */

namespace Home\Model\Order;

use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Inquiry\InquiryManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Page\PageManager;
use Home\Model\User\UserManager;

/**
 * 贵州电信EPG订购
 * Class Pay520092
 * @package Home\Model\Order
 */
class Pay520092 extends PayAbstract
{
    //获得指定模块入口
    public function getFixedModulePosition(){
        $position = array(57,58,59,60,361);
        return $position;
    }
    /**
     * 订购鉴权
     * @param null $payInfo
     * @return mixed
     * @internal param 鉴权的产品信息 $productInfo ，如果产品信息为空，则直接鉴权我方包月产品
     */
    public function authentication($payInfo = null)
    {
        $isSuccess = 0;

        if ($payInfo == null) {
            // 鉴权包月产品
            $isSuccess = $this->_authentication(null);
            if (!$isSuccess) {
                // 鉴权半年包
                $payInfo1 = new \stdClass();
                $payInfo1->ProductID = PRODUCT_ID_THIRD_48;
                $isSuccess = $this->_authentication($payInfo1);
            }
            if(!$isSuccess) {
                // 鉴权一年包
                $payInfo2 = new \stdClass();
                $payInfo2->ProductID = PRODUCT_ID_THIRD_96;
                $isSuccess = $this->_authentication($payInfo2);
            }
        } else {
            $isSuccess = $this->_authentication($payInfo);
        }

        //新老鉴权接口共用
        if($isSuccess == 0){
            $isSuccess = $this->authentication_new($payInfo);
        }
        LogUtils::info("Pay520092 ---> authentication isSuccess : " . $isSuccess);
        return $isSuccess;
    }

    /**
     * 联合活动使用的用户验证
     * @param null $userId
     * @return int
     * @throws \Think\Exception
     */
    public function jointActivityAuthUserInfo($userId = null)
    {
        return 0;
    }


    private function _authentication($payInfo = null){
        $isSuccess = 0;
        //鉴权参数
        $data = array(
            "CSPID" => SPID,
            "UserID" => MasterManager::getAccountId(),
            "ContentID" => CONTENT_ID,
            "ServiceID" => "",
            "ProductID" => $payInfo != null ? $payInfo->ProductID : PRODUCT_ID_ITV,
        );

        ksort($data);                                                   // 升序排列
        $jsonData = json_encode($data,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $userToken = strtolower(md5(strtolower(md5(ORDER_KEY . strtolower(md5($jsonData))))));
        $data['Token'] = $userToken;

//        $userToken = strtolower(md5(strtolower(md5(ORDER_KEY . strtolower(md5(json_encode($data)))))));
//        $data['Token'] = $userToken;
        LogUtils::info("Pay520092 ---> _authentication result data: " . json_encode($data));
        $resultData = HttpManager::httpRequest("POST", AUTH_URL, json_encode($data));
        LogUtils::info("Pay520092 ---> _authentication result : " . $resultData);
        $resultObj = json_decode($resultData);
        if ($resultObj->Result != 1) {
            $isSuccess = 1;
        }
        LogUtils::info("Pay520092 ---> _authentication isSuccess : " . $isSuccess);
        return $isSuccess;
    }


    private function authentication_new($payInfo = null){
        $isVip = 0;
        //鉴权参数
        $contentId = CONTENT_DP_ID;
        if(in_array(MasterManager::getEnterPosition(), $this->getFixedModulePosition()) || $_POST['isV3'] == 1){
            $contentId = CONTENT_DP_ID_ZONE;
        }

        $waitEncodeArr = array(
            "itvAccount" => MasterManager::getAccountId(),
            "contentId" => $contentId,
            "contentName" => "",
            "seriesCode" => ""
        );

        $orderInfo = $this->getEncodeCBCStrWithArr($waitEncodeArr);

        $queryArr = array(
            "providerId" => VENDORC_CODE,
            "orderInfo" => $orderInfo
        );

        $authUrl = NEW_AUTH_URL . http_build_query($queryArr);

        LogUtils::info("Pay520092::authUrl --->:" . $authUrl);
        $res = HttpManager::httpRequest("GET", $authUrl, "");
        LogUtils::info("Pay520092::authentication_new ---> authResult:" . $res);
        $resArr = json_decode($res, true);
        if (isset($resArr["respCode"])) {
            if ($resArr["respCode"] === 0 || $resArr["respCode"] === "0") {
                if ($resArr["ordered"] === 1 || $resArr["ordered"] === "1") {
                    $isVip = 1;
                } else if ($resArr["ordered"] == -1) {
                    // 免费体验，当作使用vip权益
                    MasterManager::setFreeExperience(1);
                    LogUtils::info("Pay520092::authentication_new ---> is free experience!!!");
                }
            }
        }
        LogUtils::info("Pay520092::authentication_new ---> isVip:" . $isVip);
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $epgInfoMap['askPriceUrl']=$resArr['askPriceUrl'];
        MasterManager::setEPGInfoMap($epgInfoMap);
        return $isVip;
    }

    /**
     * 通过待加密的字符串获取加密字符串ss
     * @param $queryArr  加密数组   array("providerId" => 123,"orderInfo" => 456);
     * @return string
     */
    private function getEncodeCBCStrWithArr($queryArr)
    {
        $ret = "";
        if (!is_array($queryArr)) {
            return $ret;
        }

        foreach ($queryArr as $key => $value) {
            $prefixStr = "";
            if ($value != end($queryArr)) {
                $prefixStr = $key . "=" . $value . "|";
            } else {
                $prefixStr = $key . "=" . $value;
            }
            $ret .= $prefixStr;
        }
        LogUtils::info("getEncodeCBCStrWithArr ret=" . $ret);
        $orderInfo = Crypt3DES::encodeCBC($ret, Encrypt_3DES, "01234567");
        LogUtils::info("getEncodeCBCStrWithArr=" . $orderInfo);
        return $orderInfo;
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
     * 构建到局方的订购参数
     * @param $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {
        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );
        $payInfo->orderType = 1;
        $payInfo->lmreason = 0;
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("epgInfoMap:".json_encode($epgInfoMap));

        $result = OrderManager::getInstance()->authentication(null);
        if ($result) {
            //鉴权成功，表示用户是订购过的
            if (UserManager::regVip(MasterManager::getUserId()) == 1) {
                MasterManager::setUserIsVip(1);
            }
        } else {
            $ret['result'] = 0;
            $ret['payUrl'] = $this->buildPayUrl_New($payInfo);
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
        $ret = array(
            'result' => -1,
            'Message' => "退订失败",
            'data' => ""
        );
        $result = OrderManager::getInstance()->authentication(null);
        if ($result) {
            $payInfo->tradeNo = "";
            $payInfo->lmreason = 1;
            $result = $this->_buildPayUrl($payInfo, 2);
            if ($result != null) {
                $ret['result'] = $result->Result;
                $ret['Message'] = $result->Message;
                $ret['data'] = $result->Data;
            }
        } else {
            $ret['result'] = -2;
            $ret['Message'] = "未订购续包月产品，不能退订";
        }

        return json_encode($ret);
    }

    /**
     * 构建自动上报订购地址
     * @param null $orderInfo
     * @return mixed
     */
    public function buildAutoPayUrl($orderInfo = null)
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
        $payInfo = new \stdClass();
        $payInfo->userId = MasterManager::getUserId();
        $payInfo->carrierId = MasterManager::getCarrierId();
        $payInfo->vip_id = "0";
        $payInfo->vip_type = "2";              // 后台配置的vip_type,用户判断是单次还是包月
        $payInfo->price = "	3000";                    // 价格（单位分）
        $payInfo->product_id = "39JK_ITV";          // 产品ID
        $payInfo->isPlaying = "0";            // 是否正在播放，后续可以改为直接传递播放的视频信息
        $payInfo->orderReason = "102";        // 订购原因
        $payInfo->remark = "payInfo";                  // 订购标记
        $payInfo->returnPageName = "";  // 返回页面名称，也可能定义为返回页面的Intent对象
        $payInfo->videoInfo = "undefined";

        $payUrl = $this->buildPayUrl_New($payInfo);
        header("Location:" . $payUrl);
        return;
    }

    /**
     * 订购回调结果
     * @param null $payResultInfo
     * @return mixed
     */
    public function payCallback($payResultInfo = null)
    {
        // TODO: Implement payCallback() method.
        if ($payResultInfo == null) {
            //从session中取出之前已经缓存了的我方的订购参数
            $param = json_decode(MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->returnPageName = $param->returnPageName;
            $payResultInfo->isPlaying = $param->isPlaying;
            $payResultInfo->videoInfo = $param->videoInfo;
            $payResultInfo->productId = $param->productId;
            // 得到局方返回的订购参数
            $payResultInfo->Result = isset($_GET['Result'])?$_GET['Result']:$_GET['payStatus'];
            $payResultInfo->Action =  $_GET['Action'];
            $payResultInfo->ContentID = $_GET['ContentID'];
            $payResultInfo->OrderContinue = $_GET['OrderContinue'];
            $payResultInfo->PayType = $_GET['PayType'];
            $payResultInfo->ProductID = $_GET['ProductID'];
            $payResultInfo->SPID = $_GET['SPID'];
            $payResultInfo->ServiceID = $_GET['ServiceID'];
            $payResultInfo->UserID = $_GET['UserID'];
            $payResultInfo->Token = $_GET['Token'];
            $payResultInfo->Secret = $_GET['Secret'];
            $payResultInfo->ClassifyID = $_GET['ClassifyID'];
            $payResultInfo->ChannelID = $_GET['ChannelID'];
            $payResultInfo->ProductName = $_GET['ProductName'];
            $payResultInfo->Intro = $_GET['Intro'];
            $payResultInfo->Fee = $_GET['Fee'];
            $payResultInfo->Score = $_GET['Score'];
            $payResultInfo->ExpiryDate = $_GET['ExpiryDate'];
            $payResultInfo->BeginTime = $_GET['BeginTime'];
            $payResultInfo->ExpiredTime = $_GET['ExpiredTime'];
            $payResultInfo->TransactionID = $_GET['TransactionID'];
            $payResultInfo->payAction = $_GET['payAction'];

        }
        LogUtils::info(" payCallback 520092 ---> payResult: " . json_encode($payResultInfo));

        // 判断用户是否是VIP，更新到session中
        if($payResultInfo->Result == "1"){
            $isVip = 1;
            if(empty($payResultInfo->tradeNo)){
                $payResultInfo->tradeNo=$payResultInfo->ServiceID;
            }
            if(empty($payResultInfo->userId)){
                $payResultInfo->userId=$payResultInfo->UserID;
            }
            $this->_uploadPayResult($payResultInfo);
        }else{
            $isVip = UserManager::isVip($payResultInfo->userId);
        }
        MasterManager::setUserIsVip($isVip);

        if(isset($_GET['isV3']) && $_GET['isV3'] == 1){
            if($payResultInfo->Result == "1" && isset($_GET['videoInfo']) && !empty('videoInfo')){
                $intentUrl = "http://10.255.12.54:10002/langma/player/index.html?videoInfo=".$_GET['videoInfo']."&returnUrl=".urlencode($_GET['returnUrl'])."&boxId=".$_GET['boxId'];
            }else{
                $intentUrl = "http://10.255.12.54:10002/langma/home/index.html?boxId=".$_GET['boxId'];
            }
            header("Location:" . $intentUrl);
            return;
        }


        if ($payResultInfo->payAction != 2) {
            if ($isVip == 1) {
                // 把订购是否成功的结果写入cookie，供页面使用
                MasterManager::setOrderResult(1);
            } else {
                // 把订购是否成功的结果写入cookie，供页面使用
                MasterManager::setOrderResult(0);
            }

            // 查询用户的VIP身份，
            $vipInfo = UserManager::queryVipInfo($payResultInfo->userId);
            if ($vipInfo->result == 0 && ($vipInfo->auto_order == 1
                    || $vipInfo->last_order_trade_no == null
                    || $vipInfo->last_order_trade_no == "")) {
                MasterManager::setAutoOrderFlag("1");  // 续包月用户
            } else {
                MasterManager::setAutoOrderFlag("0");  // 不是续包月用户
            }

            // 如果是播放订购成功回来，去继续播放($isVip == 1)
            $videoInfo = null;
            if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "" && $payResultInfo->videoInfo != "undefined" ) {
                $videoInfo = $payResultInfo->videoInfo;
            } else if ($payResultInfo->isPlaying == 1) {
                $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
            }
        }

        if ($payResultInfo->lmreason != null && (($payResultInfo->lmreason == 2) || ($payResultInfo->lmreason == 1))){
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            LogUtils::info("Pay520092::payCallback() url:". $intentUrl);
            header("Location:" . $intentUrl);
            return;
        }

        //生成订购结果显示界面
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $payResultInfo->Result == "1" ?  true : false);
        $showOrderResultObj->setParam("payAction", $payResultInfo->payAction);
        $showOrderResultObj->setParam("orderId", $payResultInfo->tradeNo);
        LogUtils::info("orderId ---> payResultInfo : " . $payResultInfo->TransactionID);

        if ( $isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null && $videoInfo != "undefined" ) {
            // 继续播放
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $videoInfo["videoUrl"] = rawurlencode($videoInfo["videoUrl"]);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($showOrderResultObj, $objPlayer);

        } else {
            $intent = IntentManager::createIntent($payResultInfo->returnPageName);

            if ($payResultInfo->Result != "1") {
                LogUtils::info(" payCallback 520092 ---> 1 payResultInfo->Result : " . $payResultInfo->Result);
                if (empty($payResultInfo->returnPageName)) {
                    IntentManager::back("");
                } else {
                    // 失败直接返回，不走结果显示页面
                    LogUtils::info(" payCallback 520092 ---> returnPageName: " . $payResultInfo->returnPageName);
                    IntentManager::jump($intent, null, IntentManager::$INTENT_FLAG_NOT_STACK);
                }
            } else {
                LogUtils::info(" payCallback 520092 ---> 2 payResultInfo->Result: " . $payResultInfo->Result);
                IntentManager::jump($showOrderResultObj, $intent, IntentManager::$INTENT_FLAG_DEFAULT);
            }
        }
    }

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function unPayCallback($unPayResultInfo = null)
    {
        return;
    }

    /**
     * 构建订购返回地址
     * @param null $param
     * @return string
     */
    private function _buildPayCallbackUrl($param = null)
    {
        $intent = IntentManager::createIntent("payCallback");
        MasterManager::setPayCallbackParams(json_encode($param));

        $url = IntentManager::intentToURL($intent);

        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        return $url;
    }

    /**
     * 构建订购返回地址
     * @param null $param
     * @return string
     */
    private function _buildUnPayCallbackUrl($param = null)
    {
        $intent = IntentManager::createIntent("unPayCallback");
        MasterManager::setPayCallbackParams(json_encode($param));

        $url = IntentManager::intentToURL($intent);

        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        return $url;
    }

    /**
     * 生成订购/退订地址，此订购地址会显示局方的订购页面
     * @param null $payInfo
     * @param int $payAction
     * @return bool|string
     * @internal param $productInfo
     */
    private function _buildPayUrl($payInfo, $payAction = 1)
    {
        $payUrl = "";
        $param = array(
            "payAction" => $payAction,
            "productId" => $payInfo->product_id,
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeNo,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => CARRIER_ID,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "videoInfo" => $payInfo->videoInfo,
        );
        $callbackUrl = $this->_buildPayCallbackUrl($param);  //构建返回地址
        $data = array(
            "Action" => $payAction,                                             // 开通/关停动作  1、订购 2、退订
            "ContentID" => CONTENT_ID . "",                                     // 内容编号
            "OrderContinue" => $payInfo->vip_type == 2 ? 1 : 0,                 // 自动续定标志 0、不自动续订 1、自动续订
            "PayType" => $payInfo->vip_type == 2 ? 1 : 2,                       // 支付类型 1、ITV账单支付 2、第三方支付 3、积分订购
            "ProductID" => $payInfo->product_id,                                // 产品编号
            "ReturnURL" => "".rawurlencode($callbackUrl),                          // 返回页面地址
            "CSPID" => SPID,                                                     // 商户号
//            "SPID" => SPID,                                                     // 商户号
            "ServiceID" =>  $payInfo->tradeNo,                                  // 订单号
            "UserID" => MasterManager::getAccountId(),                          // ITV账号
        );
        ksort($data);                                                   // 升序排列
        $jsonData = json_encode($data,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $userToken = strtolower(md5(strtolower(md5(ORDER_KEY . strtolower(md5($jsonData))))));
        $data['Token'] = $userToken;

        $resultData = HttpManager::httpRequest("POST", ORDER_URL, json_encode($data));
        LogUtils::info("Pay520092 ---> directToPay result : " . $resultData);
        $resultObj = json_decode($resultData);
        if ($payAction == 2) {
            //退订时，直接得到结果
            return $resultObj;
        } else {
            if ($resultObj->Result == 1) {
                $payUrl = $resultObj->Data;
            }
        }
        return $payUrl;
    }

    /**
     * 上报订购结果
     * @param $payResultInfo
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        $payResultInfo = array(
            'Result' => $payResultInfo->Result,
            'ServiceID' => $payResultInfo->tradeNo,//订单号
            'gzgdTradeNo' => $payResultInfo->gzgdTradeNo,
            'reason' => $payResultInfo->lmreason,
            'UserID' => $payResultInfo->userId,
            'carrierId' => MasterManager::getCarrierId(),
            "CancelTime"=>"",
            "BeginTime"=>$payResultInfo->BeginTime,
            "ExpiredTime"=>$payResultInfo->ExpiredTime,
            "OrderContinue"=>$payResultInfo->OrderContinue,//是否自动续订
            "PayType"=>$payResultInfo->PayType,//是否自动续订
        );

        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));

        PayAPI::postPayResultEx($payResultInfo);
    }

    /**
     * 上报退订结果
     * @param null $unPayResultInfo
     */
    private function _uploadUnPayResult($unPayResultInfo = null)
    {
        return;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo() {
        $userAccount = MasterManager::getAccountId();        // 业务帐号
        $epgInfoMap = MasterManager::getEPGInfoMap();

        $info = array(
            'accountId' => $userAccount,
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platformType' => MasterManager::getPlatformType(),
            'userToken' => MasterManager::getUserToken(),

            "CSPID" => SPID,
            "ContentID" => CONTENT_ID,
            "ProductID" => PRODUCT_ID_ITV,

            "UserGroupNMB" => $epgInfoMap["UserGroupNMB"],
            "STBID" => $epgInfoMap["STBID"],
            "EpgGroupID" => $epgInfoMap["EpgGroupID"],
            "STBType" => $epgInfoMap["STBType"],
            "TerminalType" => $epgInfoMap["TerminalType"],
            "AreaNode" => $epgInfoMap["AreaNode"],
            "IP" => $epgInfoMap["IP"],
            "MAC" => $epgInfoMap["MAC"],
            "CountyID" => $epgInfoMap["CountyID"],
        );

        return $info;
    }

    /**
     * 通过web浏览器进行订购
     * @param null $userInfo
     * @return mixed
     */
    public function webPagePay($userInfo) {
        $ret = array(
            'result' => -1,
            'message' => "订购失败"
        );

        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 220;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->product_id = PRODUCT_ID_ITV; // 产品ID - 连续包月
        $orderInfo->vip_type = 1; // 支付类型 1、ITV账单支付 2、第三方支付 3、积分订购
        $orderInfo->vip_type = 1; // 自动续定标志 0、不自动续订 1、自动续订
        $orderInfo->lmreason = 1;
        $orderInfo->orderType = 0;

        $result = OrderManager::getInstance()->authentication(null);
        if ($result) {
            //鉴权成功，表示用户是订购过的
            LogUtils::error("webPagePay::authentication ---> user had order!!!!");
            return json_encode($ret);
        }

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("webPagePay::webPagePay ---> pay orderItem is empty");
            return json_encode($ret);
        }

        $orderInfo->vipId = $orderItems[0]->vip_id;
        for ($index=0; $index < count($orderItems); $index++) {
            if ($orderItems[$index]->vip_type == 2) {
                // 包月订购项
                $orderInfo->vipId = $orderItems[$index]->vip_id;
                break;
            }
        }

        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            LogUtils::info("webPagePay::createPayTradeNo() ---> 获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        $orderInfo->tradeNo = $tradeInfo->order_id;
        $payUrl = $this->_buildPayUrl($orderInfo);
        if (empty($payUrl)) {
            // 创建失败
            LogUtils::info("webPagePay::_buildPayUrl() ---> 获取订单url失败：");
            $ret['message'] = "获取订单url失败";
            return json_encode($ret);
        }
        header("Location:" . $payUrl);
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl() {
        $payUrl = "";
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->product_id = PRODUCT_ID_ITV; // 产品ID - 连续包月
        $orderInfo->vip_type = 1; // 支付类型 1、ITV账单支付 2、第三方支付 3、积分订购
        $orderInfo->vip_type = 1; // 自动续定标志 0、不自动续订 1、自动续订
        $orderInfo->lmreason = 2;
        $orderInfo->orderType = 0;

        $result = OrderManager::getInstance()->authentication(null);
        if ($result) {
            //鉴权成功，表示用户是订购过的
            LogUtils::error("Pay520092::buildDirectPayUrl  ---> authentication user had order!!!!");
            return $payUrl;
        }

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay520092::buildDirectPayUrl ---> getOrderItem pay orderItem is empty");
            return $payUrl;
        }
        $orderInfo->vipId = $orderItems[0]->vip_id;
        for ($index=0; $index < count($orderItems); $index++) {
            if ($orderItems[$index]->vip_type == 2) {
                $orderInfo->vipId = $orderItems[$index]->vip_id;
                break;
            }
        }
        /*
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 创建失败
            LogUtils::info("Pay520092::buildDirectPayUrl ---> createPayTradeNo 获取订单失败：" . $tradeInfo->result);
            return $payUrl;
        }
        $orderInfo->tradeNo = $tradeInfo->order_id;
        $payUrl = $this->_buildPayUrl($orderInfo);
        */
        $payUrl = $this->buildPayUrl_New($orderInfo);
        if (empty($payUrl)) {
            // 创建失败
            LogUtils::info("Pay520092::buildDirectPayUrl  ---> _buildPayUrl() 获取订单url失败：");
            return $payUrl;
        }
        //$payUrl = $payUrl . "&lmTradeNo=". $orderInfo->tradeNo;
        return $payUrl;
    }

    /**
     * 我方订购页构建到局方的订购地址
     * 说明：由于要使用post方式提交到局方的订购界面，使用了html的表单提交，所以这里返回了局方post需要使用的参数，
     *       而不是完整的url订购地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayUrl_New($payInfo = null)
    {
        $userId = MasterManager::getUserId();

        $orderReason = isset($payInfo->orderReason) ? $payInfo->orderReason : 102;
        $remark = isset($payInfo->remark) ? $payInfo->remark : null;
        $isPlaying = isset($payInfo->isPlaying) ? $payInfo->isPlaying : 0;
        $returnPageName = isset($payInfo->returnPageName) ? $payInfo->returnPageName : "";
        $lmreason = 0;
        $orderType = 1;

        $epgInfoMap=MasterManager::getEPGInfoMap();
        $retArr = array(
            "result" => -1,
            "orderUrl" => $epgInfoMap['askPriceUrl'],
            "providerId" => VENDORC_CODE,
            "outerChainFlag"=>"1",
            "orderInfo" => "",
            "returnUrl" => "",
            "notifyUrl" => ""
        );

        if(empty($retArr["orderUrl"])){return null;}

        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay520092::buildPayUrl_New ---> getOrderItem pay orderItem is empty");
        }

        $vipId = $payInfo->vip_id;
        if($vipId == $orderItems[0]->vip_id){
            $productId = PRODUCT_ID_ITV;
        }elseif ($vipId == $orderItems[1]->vip_id){
            $productId = PRODUCT_ID_THIRD_48;
        }elseif ($vipId == $orderItems[2]->vip_id){
            $productId = PRODUCT_ID_THIRD_96;
        }else{
            $vipId =  $orderItems[0]->vip_id;
            $productId = PRODUCT_ID_ITV;
        }

        if($vipId == 5 && $orderReason == 221){$vipId = 7;}

        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark, null, $orderType);  // 向CWS获取订单号
        LogUtils::info("buildPayUrl_New transactionID --> result:" . json_encode($orderNoJson));
        if ($orderNoJson->result == 0) {

            $callBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, false,$payInfo);//生成回调地址
            $asyncCallBackUrl = $this->getOurOrderCallback($returnPageName, $lmreason, $isPlaying, $orderNoJson->order_id, true,$payInfo);//生成回调地址
            $retArr["returnUrl"] = $callBackUrl;
            $retArr["notifyUrl"] = $asyncCallBackUrl;

            if(in_array(MasterManager::getEnterPosition(), $this->getFixedModulePosition())){
                $payInfo->isV3 = 1;
            }

            $waitEncodeArr = array(
                "itvAccount" => MasterManager::getAccountId(),
                "contentId" => isset($payInfo->isV3)&&$payInfo->isV3 ==1?CONTENT_DP_ID_ZONE:CONTENT_DP_ID,
                "contentName" => isset($payInfo->isV3)&&$payInfo->isV3 ==1?CONTENT_DP_NAME_ZONE:"三九健康垫片"
            );
            LogUtils::info("buildPayUrl_New waitEncodeArr=" . json_encode($waitEncodeArr));
            $retArr["orderInfo"] = urlencode($this->getEncodeCBCStrWithArr($waitEncodeArr));
            $retArr["result"] = 0;
        } else {
            LogUtils::error("buildPayUrl_New pay failed!!!=" . $orderNoJson->result);
            IntentManager::back();
        }
        LogUtils::info("buildAutoPayUrl=" . json_encode($retArr));

        $orderParam = array(
            "providerId" => $retArr["providerId"],
            "orderInfo" => $retArr["orderInfo"],
            "orderUrl" => urlencode($retArr["orderUrl"]),
            "returnUrl" => urlencode($retArr["returnUrl"]),
            "notifyUrl" => urlencode($retArr["notifyUrl"]),
        );

        LogUtils::info("buildAutoPayUrl=" . json_encode($orderParam));
        $intent = IntentManager::createIntent("directPay");
        $intent->setParam("orderParam", rawurlencode(json_encode($orderParam)));

        $payAutoUrl = IntentManager::intentToURL($intent);
        $postPayUrl = "";
        if (!TextUtils::isBeginHead($payAutoUrl, "http://")) {
            $postPayUrl = "http://" . $_SERVER['HTTP_HOST'] . $payAutoUrl;  // 回调地址需要加上全局路径
        }else{
            $postPayUrl = $payAutoUrl;
        }
        LogUtils::info("payAutoUrl=" . $postPayUrl);
        //header('Location:' . $postPayUrl);
        if($orderReason == 221){
            PayAPI::addUserPayUrl(urlencode($postPayUrl),$orderNoJson->order_id,1);
            $postPayUrl = $postPayUrl. "&lmTradeNo=". $orderNoJson->order_id;
        }
        return $postPayUrl;
    }

    /**
     * 获取局方订购回调地址
     * @param $returnPageName
     * @param $reason 0--正常订购，1--人工订购
     * @param int $isPlaying 1视频播放过程中订购，0：非视频播放过程中
     * @param $orderId
     * @param bool $isAsync 是否获取异步回调地址
     * @return string
     */
    private function getOurOrderCallback($returnPageName, $reason, $isPlaying = 0, $orderId, $isAsync = false,$payInfo)
    {
        $param = array(
            "userId" => MasterManager::getUserId(),
            "tradeNo" => $orderId,
            "lmreason" => $reason,
            "lmcid" => CARRIER_ID_GUIZHOUDX,
            "returnPageName" => $returnPageName,
            "isPlaying" => $isPlaying,
            "videoInfo" => "",
        );
        MasterManager::setPayCallbackParams(json_encode($param));

        $userId = MasterManager::getUserId();
        $fromPage = MasterManager::getFromPage();
        $isPlayingStr = "&isPlaying=" . $isPlaying;

        if ($isAsync) {
            $orderCallback = PageManager::getBasePagePath('asyncOrderCallback');
        } else {
            $orderCallback = PageManager::getBasePagePath('orderCallback');
        }

        if (TextUtils::isBeginHead($orderCallback, "http://")) {
            $backUrl = $orderCallback . "/";
        } else {
            $backUrl = "http://" . $_SERVER['HTTP_HOST'] . $orderCallback . "/";
        }
        $urlParam = "?userId=" . $userId
            . "&lmcid=" . CARRIER_ID_GUIZHOUDX
            . "&lmreason=" . $reason
            . "&transactionID=" . $orderId
            . $isPlayingStr
            . "&returnPageName=" . $returnPageName
            . "&fromPage=" . $fromPage
            . "&videoInfo=" . $payInfo->videoInfo
            . "&isV3=" . $payInfo->isV3
            . "&returnUrl=" . urlencode($payInfo->returnUrl)
            . "&boxId=" . $payInfo->boxId;
        if (!strpos($backUrl, "index.php")) {
            $backUrl .= "index.php";
        }
        $backUrl = $backUrl . $urlParam;
        /*
        if ($isAsync) {
            // 如果是异步通知接口，需要把公网的IP改为内网IP，避免平台方服务器无法通知过来
            $srcUrl = "http://120.70.237.86:10001/index.php";
            $destUrl = "http://172.21.33.1:10001/index.php";
            $backUrl = str_replace($srcUrl, $destUrl, $backUrl);
        }
        */
        LogUtils::info("getOurOrderCallback= videoInfo:" . $payInfo->videoInfo);
        LogUtils::info("getOurOrderCallback=" . $backUrl);
        return $backUrl;
    }

    /**
     * 说明：程序执行完后必须打印输出“success”（不包含引号）。如果供应商反馈给iTV增值业务平台的字符
     * 不是success这7个字符，iTV增值业务平台会不断重发通知，通知的次数不超过6次，6次通知的间隔频率是：
     * 0m（1分钟之内）,10m,1h,2h,6h,24h。
     * @throws \Think\Exception
     */
    public function asyncPayCallback()
    {
        LogUtils::info("asyncPayCallback ---> _GET: " . json_encode($_REQUEST));
        $tradeInfo = $_REQUEST["tradeInfo"];
        LogUtils::info("asyncPayCallback --->tradeInfo:" . json_encode($tradeInfo));
        $decodeStr = Crypt3DES::decodeCBC($tradeInfo, Encrypt_3DES, "01234567");
        LogUtils::info("asyncPayCallback --->decodeStr:" . $decodeStr);
        $decodeArr = explode("|", $decodeStr);
        $finalDecodeArr = array();
        foreach ($decodeArr as $val) {
            $tempArr = explode("=", $val);
            $finalDecodeArr[$tempArr[0]] = $tempArr[1];
        }
        if ($finalDecodeArr["beginDate"] < $finalDecodeArr["endDate"]) {  // 判断订购是否成功
            $result = 0;
            MasterManager::setUserIsVip(1);
        } else {
            $result = -1;
            MasterManager::setUserIsVip(0);
        }

        $orderInfo = array(
            "TradeNo" => $_GET['transactionID'],
            "reason" => $_GET['lmreason'],
            "orderId" => $finalDecodeArr["orderId"],
            "beginDate" => $finalDecodeArr["beginDate"],
            "endDate" => $finalDecodeArr["endDate"],
            "validDays" => $finalDecodeArr["validDays"],
            "autoRenew" => $finalDecodeArr["autoRenew"],
            "carrierId" => CARRIER_ID,
            "result" => $result,
        );

        LogUtils::info("asyncPayCallback --->orderInfo:" . json_encode($orderInfo));
        HttpManager::httpRequest("post", ORDER_CALLBACK, $orderInfo);//上报订购结果

        echo "success";
    }

    public function payCallback_New($payResultInfo = null)
    {
        //解析局方回调的参数
        LogUtils::info("payCallback_New ---> _GET: " . json_encode($_REQUEST));
        $tradeInfo = $_REQUEST["tradeInfo"];
        LogUtils::info("payCallback_New --->tradeInfo:" . json_encode($tradeInfo));
        $decodeStr = Crypt3DES::decodeCBC($tradeInfo, Encrypt_3DES, "01234567");
        LogUtils::info("payCallback_New --->decodeStr:" . $decodeStr);
        $decodeArr = explode("|", $decodeStr);
        $finalDecodeArr = array();
        foreach ($decodeArr as $val) {
            $tempArr = explode("=", $val);
            $finalDecodeArr[$tempArr[0]] = $tempArr[1];
        }
        //解析我们自己的参数
        $userId = $_GET['userId'];
        $isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;// 是否为正在播放引起的订购
        $lmreason = isset($_GET['lmreason']) ? $_GET['lmreason'] : 0;
        $videoInfo = $_GET['videoInfo'];
        $returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : null;

        if ($finalDecodeArr["beginDate"] < $finalDecodeArr["endDate"]) {  // 判断订购是否成功
            MasterManager::setUserIsVip(1);
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(1);
            $result = 0;
        } else {
            MasterManager::setOrderResult(0);
            $result = -1;
        }

        $orderInfo = array(
            "TradeNo" => $_GET['transactionID'],
            "reason" => $_GET['lmreason'],
            "orderId" => $finalDecodeArr["orderId"],
            "beginDate" => $finalDecodeArr["beginDate"],
            "endDate" => $finalDecodeArr["endDate"],
            "validDays" => $finalDecodeArr["validDays"],
            "autoRenew" => $finalDecodeArr["autoRenew"],
            "carrierId" => isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID,
            "result" => $result,
        );

        LogUtils::info("payCallback_New --->orderInfo:" . json_encode($orderInfo));

        HttpManager::httpRequest("post", ORDER_CALLBACK, $orderInfo);//上报订购结果



        if ($lmreason == 1 || $lmreason == 2) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
                header('Location:' . $returnUrl);
            }
        } else {
            LogUtils::info("payCallback_New::payCallback() ---> jump " . $returnPageName);
            if (empty($returnPageName)) {
                $returnPageName = "";
            }

            // 如果是活动时间，就跳转活动
            if (MasterManager::getUserIsVip() == 1) {
                // 如果是在时间段时，就进行调转
                $duration = ["20191101", "20201001"];
                $nowT = Date('Ymd');
                if ($nowT > $duration[0] && $nowT < $duration[1]) {
                    $intent = IntentManager::createIntent("activity");
                    $intent->setParam("userId", MasterManager::getUserId());
                    $intent->setParam("activityName", "ActivityDemolitionExpress20191022");
                    $intent->setParam("inner", 1);
                    $intentUrl = IntentManager::intentToURL($intent);
                    if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                        $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
                        header('Location:' . $returnUrl);
                        return;
                    }
                }
            }
            IntentManager::back($returnPageName);
        }
    }

    //该接口主要用于专区建设
    public function buildZonePayUrl($boxId) {
        $payUrl = "";
        $userId = MasterManager::getUserId();

        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = $userId;
        $orderInfo->orderReason = 102;
        $orderInfo->remark = "login";
        $orderInfo->returnPageName = "";
        $orderInfo->isPlaying = 0;
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->product_id = CONTENT_DP_ID_ZONE; // 产品ID - 连续包月
        $orderInfo->vip_type = 1; // 支付类型 1、ITV账单支付 2、第三方支付 3、积分订购
        $orderInfo->vip_type = 1; // 自动续定标志 0、不自动续订 1、自动续订
        $orderInfo->lmreason = 2;
        $orderInfo->orderType = 0;

        $result = OrderManager::getInstance()->authentication(null);
        if ($result) {
            //鉴权成功，表示用户是订购过的
            LogUtils::error("Pay520092::buildDirectPayUrl  ---> authentication user had order!!!!");
            return $payUrl;
        }

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay520092::buildDirectPayUrl ---> getOrderItem pay orderItem is empty");
            return $payUrl;
        }
        $orderInfo->vipId = $orderItems[0]->vip_id;
        for ($index=0; $index < count($orderItems); $index++) {
            if ($orderItems[$index]->vip_type == 2) {
                $orderInfo->vipId = $orderItems[$index]->vip_id;
                break;
            }
        }
        $orderInfo->isV3 = 1;
        $orderInfo->videoInfo = $_POST['videoInfo'];
        $orderInfo->boxId = isset($_POST['boxId']) && !empty($_POST['boxId'])?$_POST['boxId']:$boxId;
        $orderInfo->returnUrl = $_POST['returnUrl'];

        $payUrl = $this->buildPayUrl_New($orderInfo);
        if (empty($payUrl)) {
            LogUtils::info("Pay520092::buildZonePayUrl  ---> _buildPayUrl() 获取订单url失败：");
            return $payUrl;
        }

        return $payUrl;
    }
}