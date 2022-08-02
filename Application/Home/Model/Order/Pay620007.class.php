<?php

namespace Home\Model\Order;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\ServerAPI\VideoAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;

class Pay620007 extends PayAbstract
{

    private static $S_FLAG_HOME_ORDER = "首页订购";
    private static $S_FLAG_INQUIRY_ORDER = "VIP问诊订购";
    private static $S_ORDER_PRODUCT_NAME = "智慧健康";
    private static $S_ORDER_PRODUCT_PRICE = 2000;
    /**
     * 用户到局方鉴权，使用cws的接口
     * @param object $isVip 在我方是否是vip
     * @return mixed
     */
    /* public function authentication($isVip = null)
     {
         $userTypeAuth = -1;
         $epgInfoMap = MasterManager::getEPGInfoMap();
         $authResult = PayAPI::userTypeVerifyForGansuYd($epgInfoMap['accountId'], $epgInfoMap['deviceId']);
         //$authResult = PayAPI::userTypeVerifyForGansuYdV2($epgInfoMap['accountId'], $epgInfoMap['deviceId']);
         if (isset($authResult)) {
             $authResultJson = json_decode($authResult, true);
             if ($authResultJson['result'] == 0 || $authResultJson['is_verify'] == 1) {
                 //在局方是vip
                 $userTypeAuth = 1;
             }
         }

         return $userTypeAuth;
     }*/

    public function authentication($userInfo = null)
    {
        if ($userInfo == null) {
            $apkInfo = MasterManager::getApkInfo();
            if(gettype($apkInfo) == 'string'){
                $apkInfo = json_decode($apkInfo);
            }
            $userInfo['accountIdentity'] = $apkInfo->accountIdentity;
            $userInfo['stbid'] = $apkInfo->stbid;

            $epgInfoMap = MasterManager::getEPGInfoMap();
            $userInfo['token'] = $epgInfoMap['token'];
        }

        $accountIdentity = $userInfo['accountIdentity'];
        $pri = substr($accountIdentity, 0,2);
        if ($pri == "86") {
            $accountIdentity = substr($accountIdentity, 2);
            $userInfo['accountIdentity'] = $accountIdentity;
        }

        LogUtils::info("_authentication---> " .json_encode($userInfo));
        return $this->_authentication($userInfo);
    }

    public function _authentication($userInfo)
    {
        $userTypeAuth = 0;

        $params=array(
            "body" => array(
                "idValue" => $userInfo['accountIdentity'],
                "deviceId" => $userInfo['stbid'],
                "productIds" => PRODUCT_ID,//"158020181212000037",
                "contentId" => CONTENT_ID,//"4005456929",
            ),

            "header" => array(
                "msgid" => MSGID,//"61237890345",
                "systemtime" => date("YmdHis"),
                "version" => "1.0",
                "sourceid" => "580001",
                "access_token" => $userInfo['token'],
            ),
        );
        $authResult = $this->asyncPost(ORDER_VERIFY_USER_URL, $params, __FUNCTION__);
        if ($authResult->header->resultcode == "1000" && $authResult->body->isVerified == 1) {
            //在局方是vip
            $userTypeAuth = 1;
        }

        return $userTypeAuth;
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
     * 构建订购参数--百事通计费接口
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayInfo_bst($payInfo = null)
    {
        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark, null, $payInfo->payType);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay620007::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        //获取订单成功
        $payInfo->tradeNo = $orderInfo->order_id;
        //获取计费策略id
        $epgInfoMap = MasterManager::getEPGInfoMap();

        //创建订购参数
        $payInfo->returnUrl = $this->_buildPayCallbackUrl($payInfo);  //构建返回地址
        $payInfo->accountIdentity = $epgInfoMap['accountId'];  //支付账号
        $payInfo->deviceId = $epgInfoMap['deviceId'];           //32位设备id

        $ret['result'] = 0;
        $ret['payInfo'] = $payInfo;

        return json_encode($ret);
    }

    /**
     * 现网--未来电视-易视腾计费接口
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayInfo($payInfo = null)
    {
        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] : buildPayInfo!');

        // 返回参数
        $ret = array(
            'result' => -1,
            'msg' => 'Failed',
            'payInfo' => array(),
        );

        // 得到input参数
        $lmuid = $payInfo['lmuid'];
        $lmVipId = $payInfo['lmVipId'];
        $lmVipType = $payInfo['lmVipType'];
        $lmOrderReason = $payInfo['lmOrderReason'];
        $lmRemark = $payInfo['lmRemark'];

        // 向cws请求创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($lmVipId, $lmOrderReason, $lmRemark);
        if (is_object($orderInfo) && $orderInfo->result == 0) {
            // 获取订单成功
            $payInfo['lmOrderId'] = $orderInfo->order_id;//获取到order_id

            // sdk订购接口所需参数（contentName/productId/spToken/payPhone）
            $payInfo['contentName'] = CONTENT_NAME;
            $payInfo['productId'] = PRODUCT_ID;
            $payInfo['productType'] = PRODUCT_TYPE;
            $payInfo['payPhone'] = PAY_PHONE;
            $payInfo['contentId'] = CONTENT_ID;
            $payInfo['timestamp'] = date("YmdHis");

            $ret['result'] = 0;
            $ret['payInfo'] = $payInfo;
            $ret['msg'] = 'Success';
        } else {
            // 获取订单失败
            $ret['result'] = $orderInfo->result;
            LogUtils::error('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] >>> 向cws获取支付订单失败: ' . $ret['result']);
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
        // TODO: Implement buildUnPayUrl() method.
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string|array
     */
    public function buildDirectPayUrl() {
        $payInfo = [];
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
            LogUtils::error("Pay620007::buildDirectPayUrl ---> pay orderItem is empty");
            return $payInfo;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay620007::buildDirectPayUrl pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;
            //$payInfo["payUrl"] = $this->_buildPayUrl($orderInfo);

            $contentId = "4005456929";
            $contentName = "感冒并发肺炎会致命";
            // 获取视频信息，使用第一条
            $videoInfo = $this->queryVideoInfo();
            if ($videoInfo) {
                $videoUrl = $videoInfo->ftp_url;
                $videoObj = json_decode($videoUrl);
                $contentId = $videoObj->gq_ftp_url;
                $contentName = $videoInfo->title;

                LogUtils::info("_buildPayUrl, contentId = $contentId, contentName = $contentName");
            }

            $apkInfo = MasterManager::getApkInfo();
            if(gettype($apkInfo) == 'string'){
                $apkInfo = json_decode($apkInfo);
            }
            $payInfo["stbid"] = $apkInfo->stbid;
            $payInfo["userId"] = $apkInfo->userId;
            $payInfo["accountIdentity"] = MasterManager::getAccountId();

            // 其中sign MD5(contentId+productId+spId)
            $signStr = $contentId . PRODUCT_ID . SP_ID;
            $sign = md5($signStr);
            // 组装订购链接
            //http://gsydepgpay.bestv.com.cn/epg-pay/pay_selection.html?contentId=4005456929&contentName=%E6%84%9F%E5%86%92%E5%B9%B6%E5%8F%91%E8%82%BA%E7%82%8E%E4%BC%9A%E8%87%B4%E5%91%BD
            //&spId=GSYD_926252&productID=158020181212000037&sign=8592f3296b05c406a9d5004be0393d96
            //&stbId=005801FF0001090003C360D21CAD696B&userId=0106941558320323199&telephone=13830499326&backUrl=cpOrderResult.jsp

            //$params = "contentId=" . $contentId . "&contentName=$contentName" . "&spId=" . SP_ID."&productID=".PRODUCT_ID
            //."&sign=".$sign."&stbId=".$payInfo["stbid"]."&userId=".$payInfo["userId"]."&telephone=".$payInfo["accountIdentity"]
            //."&backUrl=cpOrderResult.jsp";

            //$payUrl = "http://gsydepgpay.bestv.com.cn/epg-pay/pay_selection.html?" . $params;

            $params = "contentId=" . $contentId . "&contentName=$contentName" . "&spId=" . SP_ID."&productIds=".PRODUCT_ID
                ."&sign=".$sign."&stbId=".$payInfo["stbid"]."&userId=".$payInfo["userId"]."&telephone=".$payInfo["accountIdentity"]
                ."&backUrl=cpOrderResult.jsp&version=v2";

            //$payUrl = "http://gsydepgpay.bestv.com.cn/epg-pay/epgpay_productlists_selection.html?" . $params;


            $payUrl = $this->_buildPayUrl();
            $payInfo["payUrl"] = $payUrl;
            $payInfo["tradeNo"] = $orderInfo->tradeNo;
            //$payInfo["StbId"] = $payInfo["stbid"];
            //$payInfo["UserId"] = $payInfo["userId"];
            //$payInfo["AccountId"] = $payInfo["accountIdentity"];
            LogUtils::info("_buildPayUrl: $payUrl");
        }
        LogUtils::info("buildDirectPayUrl pay payInfo: " . json_encode($payInfo));

        return $payInfo;
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string|array
     */
    public function webPagePay($userInfo) {
        $payInfo = [];
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
            LogUtils::error("Pay620007::webPagePay ---> pay orderItem is empty");
            return $payInfo;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay620007::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            $orderInfo->tradeNo = $tradeInfo->order_id;

            $contentId = PRODUCT_ID;
            $contentName = "智慧健康";

            // 其中sign MD5(contentId+productId+spId)
            $signStr = $contentId . PRODUCT_ID . SP_ID;
            $sign = md5($signStr);
            // 组装订购链接
            // "http://gsydepgpay.bestv.com.cn/epg-pay/cpOrderEntry.jsp?productID=158020181212000037&productName=智慧健康
            // &productPrice=2000&contentID=158020181212000037&contentName=智慧健康&categoryCode=&spID=GSYD_926252_01
            //&sign=9e6a04228dd325a3fdb9b2213263fc2d";

            //$payUrl = "http://gsydepgpay.bestv.com.cn/epg-pay/cpOrderEntry.jsp?" . $params;

            $params = "productID=" . PRODUCT_ID . "&productName=$contentName" . "&productPrice=2000"
                ."&contentID=".$contentId."&contentName=".$contentName."&categoryCode=&spID=".SP_ID
                ."&sign=".$sign;

            $payUrl = "http://gsydepgpay.bestv.com.cn/epg-pay/cpOrderEntry.jsp?" . $params;

            MasterManager::setUserOrderId($orderInfo->tradeNo);
            LogUtils::info("_buildPayUrl: $payUrl");
        }

        header("Location:" . $payUrl);
    }


    private function _buildPayUrl() {
        $contentId = "158020181212000037";
        $contentName = "智慧健康";
        // 获取视频信息，使用第一条
        $videoInfo = $this->queryVideoInfo();
        if ($videoInfo) {
            $videoUrl = $videoInfo->ftp_url;
            $videoObj = json_decode($videoUrl);
            $contentId = $videoObj->gq_ftp_url;
            $contentName = $videoInfo->title;

            LogUtils::info("_buildPayUrl, contentId = $contentId, contentName = $contentName");
        }
        // http://gsydepgpay.bestv.com.cn/epg-pay/cpOrderEntry.jsp?productID=158020181212000037&productName=智慧健康
        //      &productPrice=2000&contentID=4005456929&contentName=感冒并发肺炎会致命&categoryCode=&spID=GSYD_926252
        //      &sign=8592f3296b05c406a9d5004be0393d96

        // 组装订购链接
        $params = "productID=" . PRODUCT_ID ."&productName=智慧健康" ."&productPrice=2000"
                  . "&contentID=$contentId" . "&contentName=$contentName" . "&categoryCode=&spID=" . SP_ID;
        // 其中sign MD5(contentId+productId+spId)
        $signStr = $contentId . PRODUCT_ID . SP_ID;
        $sign = md5($signStr);

        $payUrl = ORDER_SERVICE_ORDER_URL . $params ."&sign=". $sign;

        LogUtils::info("_buildPayUrl: $payUrl");
        return $payUrl;
    }

    /**
     * @Brief:此函数用于根据用户的来源查询contentId
     *         如果用户是从专辑推荐位过来，就取专辑的视频；
     *         如果用户从其它推荐位过来，就取首页轮播的视频；
     * @return string : contentId内容id
     */
    public static function queryVideoInfo()
    {
        // 获取视频信息，使用第一条
        $item = "";
        $videoInfo = VideoAPI::getVideoRecommend(MasterManager::getUserId());
        $videoInfo = json_decode($videoInfo);
        if ($videoInfo->result == 0) {
            $item = $videoInfo->data[0];
        }
        return $item;
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

    public function handlePayResult($resultJsonStr)
    {

        $payResult = array(
            'orderSuccess' => -1, // 是否订购成功
            'desc' => ''
        );

        $orderParams = json_decode(MasterManager::getPayCallbackParams());

        $userId = MasterManager::getUserId();

        $uploadResultParams = new \stdClass();
        $uploadResultParams->userId = $userId;
        $uploadResultParams->tradeNo = $orderParams->tradeNo;
        $uploadResultParams->lmreason = $orderParams->lmreason;
        $uploadResultParams->returnPageName = $orderParams->returnPageName;
        $uploadResultParams->isPlaying = $orderParams->isPlaying;
        $uploadResultParams->videoInfo = $orderParams->videoInfo;
        $uploadResultParams->order_count = $orderParams->order_count;

        $result = json_decode($resultJsonStr);
        $uploadResultParams->result = $result->result;
        $uploadResultParams->order_time = $result->order_time;
        $uploadResultParams->order_number = $result->order_number;
        $uploadResultParams->valid_from = $result->valid_from;
        $uploadResultParams->valid_to = $result->valid_to;
        $uploadResultParams->result_code = $result->result_code;
        // 支付结果描述处理换行
        $resultDesc = str_replace(array("\r\n", "\r", "\n"), "", $result->result_desp);
        $uploadResultParams->result_desp = $resultDesc;
        $uploadResultParams->charge_type = $result->charge_type;

        // 上报结果数据
        if (($uploadResultParams->result === 0 || $uploadResultParams->result == '0') &&
            ($uploadResultParams->result_code === 1000 || $uploadResultParams->result_code == '1000')) {
            // 订购成功，上报订购结果
            $payResult['orderSuccess'] = "1";
            $this->_uploadPayResult($uploadResultParams);
        } else {
            $payResult['desc'] = $uploadResultParams->result_desp;
        }

        $isVip = UserManager::isVip($userId);  // 判断用户是否是VIP
        MasterManager::setOrderResult($isVip); // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setVIPUser($isVip);     // 用户是否是VIP，更新到session中

        if ($uploadResultParams->isPlaying == 1) { // 判断播放器跳转
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
            if ($isVip == 1 && $videoInfo != null) {
                // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
                LogUtils::info(" payCallback 620007 ---> player: ");
                $objPlayer = IntentManager::createIntent();
                $objPlayer->setPageName("player");
                $objPlayer->setParam("userId", $uploadResultParams->userId);
                $objPlayer->setParam("isPlaying", $uploadResultParams->isPlaying);
                $objPlayer->setParam("videoInfo", json_encode($videoInfo));
                IntentManager::jump($objPlayer);
            }
        }

        return $payResult;
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
            LogUtils::info(" payCallback 620007 ---> payCallback===>param session: " . MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->returnPageName = $param->returnPageName;
            $payResultInfo->isPlaying = $param->isPlaying;
            $payResultInfo->videoInfo = $param->videoInfo;
            $payResultInfo->order_count = $param->order_count;
            //得到局方返回的订购参数
            $resultDataJson = json_decode($_GET['resultDataJson'], true);
            $payResultInfo->result = $resultDataJson['result'];
            $payResultInfo->order_time = $resultDataJson['order_time'];
            $payResultInfo->order_number = $resultDataJson['order_number'];
            $payResultInfo->valid_from = $resultDataJson['valid_from'];
            $payResultInfo->valid_to = $resultDataJson['valid_to'];
            $payResultInfo->result_code = $resultDataJson['result_code'];
            $payResultInfo->result_desp = $resultDataJson['result_desp'];
            $payResultInfo->result_desp = str_replace(array("\r\n", "\r", "\n"), "", $payResultInfo->result_desp);
            $payResultInfo->charge_type = $resultDataJson['charge_type'];
        }
        LogUtils::info(" payCallback 620007 ---> payResult: " . json_encode($payResultInfo));

        if (($payResultInfo->result === 0 || $payResultInfo->result == '0') && ($payResultInfo->result_code === 1000 || $payResultInfo->result_code == '1000')) {
            // 订购成功增加特定活动活动次数
            /*  办事处要求调整活动规则，不增加次数
            $currDt = date('Y-m-d');
            if($currDt >= '2020-11-01' && $currDt <= '2020-11-11'){
                $json = array(
                    "activity_id" => "ActivityLuckyWheel20201015",
                );
                $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_ADD_USER_LOTTERY_TIMES);
                $result = $httpManager->requestPost($json);
                LogUtils::info("add ActivityLuckyWheel20201015 times result: " .json_encode($result));
            }*/

            // 订购成功，上报订购结果
            $payResultInfo->orderSuccess = "1";
            /*$uploadPayResult =*/
            $this->_uploadPayResult($payResultInfo);
        } else {
            $payResultInfo->orderSuccess = "-1";
        }

        // 判断用户是否是VIP
        $isVip = UserManager::isVip($payResultInfo->userId);

        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult($isVip);
        // 用户是否是VIP，更新到session中
        MasterManager::setVIPUser($isVip);

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        //显示订购结果页面，该界面显示的是局方的订购结果（不包括订购成功后上报到我方服务器，是否在我方服务器上变成了vip）
        $showOrderResultObj = IntentManager::createIntent("payShowResult");
        $showOrderResultObj->setParam("isSuccess", $payResultInfo->orderSuccess);
        $showOrderResultObj->setParam("message", $payResultInfo->result_desp);
        $showOrderResultObj->setParam("returnPageName", $payResultInfo->returnPageName);  // 增加一个返回页面名称

        $url = IntentManager::intentToURL($showOrderResultObj);
        LogUtils::info(" payCallback 620007 ---> showOrderResult url: " . $url);

        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
            LogUtils::info(" payCallback 620007 ---> player: ");
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($showOrderResultObj, $objPlayer, IntentManager::$INTENT_FLAG_DEFAULT);
        } else {
            //$intent = IntentManager::createIntent($payResultInfo->returnPageName); // 因为返回页面有可能为空，不能创建。将页面名称传递到显示结果页返回 // delete by caijun 2019-03-06
            //IntentManager::jump($showOrderResultObj, $intent, IntentManager::$INTENT_FLAG_DEFAULT); // delete by caijun 2019-03-06
            LogUtils::info(" payCallback 620007 ---> not player: ");
            //IntentManager::jump($showOrderResultObj, null, IntentManager::$INTENT_FLAG_NOT_STACK);
            header('Location:' . $url);
        }
    }

    /**
     * @Brief:此函数用于订购的相关操作
     * @param: $orderId 订购ID
     * @param: $orderType 订购类型
     * @return: $data 结果值
     */
    public function OrderForGansuYd($orderId, $orderType)
    {
        //获取计费策略id
        $epgInfoMap = MasterManager::getEPGInfoMap();

        $userAccount = $epgInfoMap['accountId'];  //支付账号
        $macAddr = $epgInfoMap['deviceId'];           //32位设备id
        $data = PayAPI::OrderForGansuYd($orderId, $userAccount, $macAddr, $orderType);
        return $data;
    }

    /**
     * @Brief:此函数用于订购的相关操作
     * @param: $orderId 订购ID
     * @param: $orderMonth 订购类型
     * @return: $data 结果值
     */
    public function queryCodeImage($orderId, $orderMonth)
    {
        //获取计费策略id
        $epgInfoMap = MasterManager::getEPGInfoMap();

        $userAccount = $epgInfoMap['accountId'];  //支付账号
        $macAddr = $epgInfoMap['deviceId'];           //32位设备id
        $data = PayAPI::queryCodeImage($orderId, $userAccount, $macAddr, $orderMonth);
        return $data;
    }

    /**
     * @Brief:此函数用于订购的相关操作
     * @param: $orderId 订购ID
     * @param: $orderMonth 订购类型
     * @return: $data 结果值
     */
    public function payByExchangePoint($orderId, $orderMonth)
    {
        //获取计费策略id
        $epgInfoMap = SessionManager::getUserSession(SessionManager::$S_EPG_INFO_MAP);

        $userAccount = $epgInfoMap['accountId'];  //支付账号
        $macAddr = $epgInfoMap['deviceId'];           //32位设备id
        $data = PayAPI::payByExchangePoint($orderId, $userAccount, $macAddr, $orderMonth);
        return $this->handlePayResult($data);
    }

    /**
     * @Brief:此函数用于订购的相关操作
     * @param: $orderId 订购ID
     * @param: $orderType 订购类型
     * @return: $data 结果值
     */
    public function payByPhone($orderId)
    {
        //获取计费策略id
        $epgInfoMap = SessionManager::getUserSession(SessionManager::$S_EPG_INFO_MAP);

        $userAccount = $epgInfoMap['accountId'];  //支付账号
        $macAddr = $epgInfoMap['deviceId'];           //32位设备id
        $data = PayAPI::payByPhone($orderId, $userAccount, $macAddr);
        return $this->handlePayResult($data);
    }

    /**
     * @Brief:此函数用于订购的相关操作
     * @param: $orderId 订购ID
     * @param: $orderType 订购类型
     * @return: $data 结果值
     */
    public function cancelVIP($userAccount = null)
    {
        $userAccount = $userAccount == null ? MasterManager::getAccountId() : $userAccount;
        //获取计费策略id
        $data = PayAPI::cancelVIP($userAccount);
        return $data;
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
            "?TradeNo=" . $payResultInfo->tradeNo .
            "&orderNumber=" . $payResultInfo->order_number .
            "&orderTime=" . $payResultInfo->order_time .
            "&validFrom=" . $payResultInfo->valid_from .
            "&validTo=" . $payResultInfo->valid_to .
            "&chargeType=" . $payResultInfo->charge_type;
        LogUtils::info("postPayResultEx --->url : " . $url);
        $uploadPayResult = HttpManager::httpRequest("GET", $url, null);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
    }

    public function uploadPayResult($payResultInfo = null)
    {
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $url = ORDER_CALL_BACK_URL .
            "?TradeNo=" . $payResultInfo->tradeNo .
            "&orderNumber=" . '1'.
            "&orderTime=" . date('Y-m-d H:i:s') .
            "&validFrom=" . date('Y-m-d H:i:s') .
            "&validTo=" . date("Y-m-d H:i:s", strtotime("+1 months")) .
            "&chargeType=" . $payResultInfo->orderType;
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
     * @param payController|null $
     * @return mixed
     */
    public function payShowResult($payController = null)
    {
        return $_GET;
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

        LogUtils::info("_buildPayCallbackUrl ---> payInfo session: " . MasterManager::getPayCallbackParams());

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            LogUtils::info("_buildPayCallbackUrl ---> isRunOnPC: " . (string)(MasterManager::isRunOnPC()));
            if (defined(APP_ROOT_PATH)) {
                $url = APP_ROOT_PATH . $url;                       // 回调地址需要加上全局路径
            } else {
                $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
            }
        }
        LogUtils::info("_buildPayCallbackUrl ---> url: " . $url);
        return $url;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
        $apkInfo = MasterManager::getApkInfo();
        if(gettype($apkInfo) == 'string'){
            $apkInfo = json_decode($apkInfo);
        }
        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'userId' => MasterManager::getUserId(),
            'platformType' => MasterManager::getPlatformType(),
            "lmcid" => MasterManager::getCarrierId(),

            "stbid" => MasterManager::getSTBId(),
            "gsUserId" => $apkInfo->userId,
            "userToken" => MasterManager::getUserToken()
        );

        return $info;
    }

    public function interfacePay($userInfo)
    {
        $payResult = array(
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

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("pay620007Action::buildAutoPayUrl ---> orderItem is empty");
            return json_encode($payResult);
        }

        // 去第一个，默认包月对象
        $orderInfo->vip_id = $orderItems[0]->vip_id;

        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($orderInfo->vip_id, $orderInfo->orderReason, $orderInfo->remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("pay620007Action::buildPayUrl() ---> 获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        //获取订单成功
        $tradeNo = $orderInfo->order_id;

        // 生成订购url
        //设置请求参数
        /*
         * {"order_id":"20181119123987676XXX","user_account":"13512701582","mac_addr":"34:c3:d2:a8:99:cc","order_type:"0"}
         */
        $json = array(
            "order_id" => $tradeNo,
            "user_account" => $userInfo->user_account,
            "mac_addr" => $userInfo->mac_addr,
            "order_type" => 0, // 订购类型（0订购 1退订）
        );

        $http = new HttpManager(HttpManager::PACK_ID_USER_ORDER_FOR_GANSUYD);
        $payResult = $http->requestPost($json);

        /*
         * {"result":"0","order_id":"20181119123987676XXX","order_time":"2018-12-19 12:00:00",
         * "order_number":"058820181119123XXXXXX","valid_from":"2018-11-19 12:00:00",
         * "valid_to":"2018-12-19 12:00:00","charge_type":"2","result_code":"1000","result_desp":"操作成功"}
         */
        LogUtils::error("pay620007Action:" . $payResult);
        return $payResult;
    }

    public function signParams($paramsArray)
    {
        // 遍历数组获取值,请求参数添加间隔字符串
        // $spSecretCode = "GSYD_926252";
        $spSecretCode = "GSYD_GZLM_926252";
        $signStr = "";
        foreach ($paramsArray as $key => $value) {
            $signStr .= $value . "|";
        }
        $signStr .= $spSecretCode;
        // 字符串转大写字母
        $upperSignStr = strtoupper($signStr);
        // 字符串进行url编码
        $encodeStr = urlencode($upperSignStr);
        // md5加密并返回
        return md5($encodeStr);
    }

    private function asyncPost($url, $postData, $logFlag)
    {
        $header = array(
            'Content-type: application/json;charset=utf-8',
        );

        LogUtils::info("Pay620007 " . $logFlag . " ---> request:" . $url . " --->header:" . json_encode($header));
        LogUtils::info("Pay620007 " . $logFlag . " ---> request:" . $url . " --->param:" . json_encode($postData));
        $result = HttpManager::httpRequestByHeader("POST", $url, $header, json_encode($postData));
        LogUtils::info("Pay620007::" . $logFlag . " ---> result:" . $result);

        return json_decode($result);
    }

    public static function createPayData($contentId,$contentName){
        $isDirectOrder = $contentName == self::$S_FLAG_HOME_ORDER || $contentName == self::$S_FLAG_INQUIRY_ORDER;
        $orderContentId = $isDirectOrder ? PRODUCT_ID : $contentId;
        $orderContentName = $isDirectOrder ? self::$S_ORDER_PRODUCT_NAME : $contentName;
        $payData = array(
            "productID" => PRODUCT_ID,
            "productName" => self::$S_ORDER_PRODUCT_NAME,
            "productPrice" => self::$S_ORDER_PRODUCT_PRICE,
            "contentID" => $orderContentId,
            "contentName" => $orderContentName,
            "spID" => SP_ID,
            "categoryCode" => "",
        );
        // 其中sign MD5(contentId+productId+spId)
        $signStr = $orderContentId . PRODUCT_ID . SP_ID;
        $payData['sign'] = md5($signStr);

        return $payData;
    }


    public static function asyncUserStatus($isVideoPlaying){

        $result = array(
            "result" => -1
        );

        // 订购成功，当前用户为VIP
        $isVip = 1;

        MasterManager::setOrderResult($isVip); // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setVIPUser($isVip);     // 用户是否是VIP，更新到session中

        $apkInfo = MasterManager::getApkInfo();
        if(gettype($apkInfo) == 'string'){
            $apkInfo = json_decode($apkInfo);
        }
        $stbid = $apkInfo->stbid;
        $data = array(
            'CPID' => SP_ID,
            'userID' => MasterManager::getAccountId(),
            'stbId' => $stbid,
            'contentID' => CONTENT_ID,
            'productID' => PRODUCT_ID,
            'purchaseTime' => 0,
            'validTime' => date("YmdHis"),
            'expiredTime' => "2099-01-01",
            'price' => 2000,
            'orderValid' => 0,
            'unsubscribeTime' => "2099-01-01",
            'payDitch' => "LM",
            'autoContinue' => "1",
            'transactionID' => MasterManager::getUserOrderId(),
            'result' => 0,
        );

        $url = "http://healthiptv.langma.cn/cws/pay/gansuyd/callback/cp_index.php";
        LogUtils::info("OrderManager::uploadOrderdata ---> reportUrl: " . $url);
        LogUtils::info("OrderManager::uploadOrderdata ---> data: " . json_encode($data));
        HttpManager::httpRequest("post", $url, $data);

        if ($isVideoPlaying == 1) { // 判断播放器跳转
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
            if ($videoInfo != null) {
                // 订购成功，且有播放视频信息，那么将播放器压入Intent栈
                LogUtils::info(" payCallback 620007 ---> player: ");
                $objPlayer = IntentManager::createIntent();
                $objPlayer->setPageName("player");
                $objPlayer->setParam("isPlaying", $isVideoPlaying);
                $objPlayer->setParam("videoInfo", json_encode($videoInfo));
                IntentManager::jump($objPlayer);
            }
        }

        return $result;
    }

    public function buildPayUrl($payInfo = null)
    {
        if(MasterManager::getEnterFromYsten() == '1'){
            return $this->buildPayInfo($payInfo);
        }else{
            return $this->buildPayInfo_bst($payInfo);
        }
    }
}