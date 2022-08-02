<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/8/2
 * Time: 下午5:36
 */

namespace Home\Model\Order;


use Api\APIController\DebugAPIController;
use Home\Model\Activity\ActivityManager;
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

class Pay000051 extends PayAbstract
{

    //返回山西联通线下大包
    public function getShanXiOfflinePosition(){
        $position = array(333,334,335,336,337,338,339,341,342,343,344,345,346,347,348,349,350,351,352,
            353,354,358,359,360,361,362,364,383,384,385,386,387,388,368,369,370,371,372,373,374,375,
            376,377,378,380,381,382,137,153,121,48,87,182);
        return $position;
    }

    public function getSmallBagPosition(){
        $position = array(89,389,391,399);
        return $position;
    }
    /**
     * 到局方鉴权，只有包月产品才能鉴权。（可以鉴权其他CP的产品，需要传递产品信息）
     * @param $productInfo 鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authentication($productInfo = null)
    {
        LogUtils::info("Pay000051 --> user authentication productInfo:" . json_encode($productInfo));
        // TODO: Implement authentication() method.
        if ($productInfo == null || empty($productInfo) || !is_array($productInfo)) {
            // 默认使用我方的包月产品进行鉴权
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = PRODUCT_ID;
            $productInfo['serviceId'] = SERVICE_ID;
            $productInfo['contentId'] = CONTENT_ID;
        }

        // 天津专用入口的计费
        if (Utils::isTianJinSpecialEntry() == 1) {
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = PRODUCT_ID_TJ;
            $productInfo['serviceId'] = SERVICE_ID_TJ;
            $productInfo['contentId'] = CONTENT_ID_TJ;
        }

        if(MasterManager::getAreaCode() == '207' && in_array(MasterManager::getEnterPosition(), $this->getShanXiOfflinePosition())){
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
        if (MasterManager::getAreaCode() == "207" && ($productInfo['contentId'] == "sxgdyseby" || $productInfo['contentId'] == "sxgdysrhyb")) {
            $info['contentId'] = "";
        } else if (MasterManager::getAreaCode() == "216" && $productInfo['contentId'] == "yllddjdt0") {
            $info['contentId'] = "";
        }

        LogUtils::info("Pay000051 --> user authentication param:" . json_encode($info));

        // post到局方鉴权，同步返回数据
        /*
         * curl http://202.99.114.14:35820/ACS/vas/authorization -X POST -d '{"spId":"96596","carrierId":"209","userId":"CB41018120404706_209","UserToken":"xxxxx","productId":"sjjklx","serviceId":"sjjkby015","contentId":"sjjklinux","timeStamp":"1603950721"}' --header "Content-Type: application/json"
         */
        $result = HttpManager::httpRequest("POST", $authorizationUrl, json_encode($info));

        LogUtils::info("Pay000051 --> user authentication result:  " . $result);

        return json_decode($result);
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

        LogUtils::info("Pay000051 --> user authenticationTJ param:" . json_encode($info));

        // post到局方鉴权，同步返回数据
        $result = HttpManager::httpRequest("POST", $authorizationUrl, json_encode($info));

        LogUtils::info("Pay000051 --> user authenticationTJ result:  " . $result);

        return json_decode($result);
    }

    /**
     * 到局方鉴权，判断是否为积分订购过来的
     * @param $productInfo 鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed
     */
    public function authenticationJiFen($productInfo = null)
    {
        LogUtils::info("Pay000051 --> user authentication productInfo:" . json_encode($productInfo));
        // TODO: Implement authentication() method.
        if ($productInfo == null || empty($productInfo) || !is_array($productInfo)) {
            // 默认使用我方的包月产品进行鉴权
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = PRODUCT_ID;
            $productInfo['serviceId'] = SERVICE_ID;
            $productInfo['contentId'] = CONTENT_ID;
        }

        // 天津专用入口的计费
        if (Utils::isTianJinSpecialEntry() == 1) {
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = PRODUCT_ID_TJ;
            $productInfo['serviceId'] = SERVICE_ID_TJ;
            $productInfo['contentId'] = CONTENT_ID_TJ;
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

        LogUtils::info("Pay000051 --> user authentication param:" . json_encode($info));

        // post到局方鉴权，同步返回数据
        $result = HttpManager::httpRequest("POST", $authorizationUrl, json_encode($info));

        LogUtils::info("Pay000051 --> user authentication result:  " . $result);

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
            if (Utils::isTianJinSpecialEntry() == 1) {
                $productInfo = $authInfo->productList[0];
            } else if (MasterManager::getAreaCode() == '201') {
                if (count($authInfo->productList) > 1) {
                    $productInfo = $authInfo->productList[1];
                } else {
                    $productInfo = $authInfo->productList[0];
                }
            } else if ($payInfo->product_id == PRODUCT_ID_15) {
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
     * 构建到局方的订购地址, 返回统一鉴权地址
     * @param null $payInfo
     * @return mixed|void
     */
    public function buildPayUrlEx($payInfo = null)
    {
        // TODO: Implement buildPayUrl() method.
        $ret = array(
            'result' => -1,
            'payUrl' => ""
        );
        if ($payInfo == null || $payInfo == "" || !is_object($payInfo)) {
            LogUtils::error("buildPayUrlEx， 参数错误");
            return $ret;
        }
        $payInfo->lmreason = 0;
        $payInfo->orderType = 1;
        $productInfo = null;

        /**
         * 如果不是39健康应用，则要提取出其它家的产品信息
         */
        if ($payInfo->contentId && $payInfo->contentId != CONTENT_ID) {
            // 替其它sp厂商进行鉴权 ，使用contentId来关联
            $spInfo = Utils::getOrderInfo000051($payInfo->contentId);
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = $spInfo['productId'];
            $productInfo['serviceId'] = $spInfo['serviceId'];
            $productInfo['contentId'] = $spInfo['contentId'];
        }

        // 产品鉴权
        $authInfo = $this->authentication($productInfo);
        if ($authInfo->result == 10020001) {
            // 得到产品信息
            if (Utils::isTianJinSpecialEntry() == 1) {
                $productInfo = $authInfo->productList[0];
            } else if (MasterManager::getAreaCode() == '201') {
                if (count($authInfo->productList) > 1) {
                    $productInfo = $authInfo->productList[1];
                } else {
                    $productInfo = $authInfo->productList[0];
                }
            } else if ($payInfo->productId == PRODUCT_ID_15) {
                $productInfo = $authInfo->productList[0];
            } else {
                $productInfo = $authInfo->productList[1];
            }
        }

        $payUrl = $this->buildUnifiedAuthUrl($payInfo, $productInfo, "");

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
        $ret = array(
            'result' => -1,
            'unPayUrl' => ""
        );

        if ($payInfo == null || $payInfo == "" || !is_object($payInfo)) {
            LogUtils::error("buildUnPayUrl， 参数错误");
            return $ret;
        }

        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => "",
            "lmreason" => "0",
            "lmcid" => MasterManager::getCarrierId(),
            "returnPageName" => $payInfo->returnPageName,
        );
        $callbackUrl = $this->_buildUnPayCallbackUrl($param);  //构建返回地址

        //先到局方鉴权
        $authInfo = $this->authentication();
        LogUtils::info("Pay000051::buildUnPayUrl() --->  authResult:" . json_encode($authInfo));

        if ($authInfo->result == 0) {
            // 用户是vip
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $unPayUrl = ORDER_SERVICE_ORDER_URL . "?";

            // 根据页面上的计费选项类型，来提取对应的计费参数
            if (Utils::isTianJinSpecialEntry() == 1) {
                $productInfo = $authInfo->productList[0];
            } else if (MasterManager::getAreaCode() == '201') {
                if (count($authInfo->productList) > 1) {
                    $productInfo = $authInfo->productList[1];
                } else {
                    $productInfo = $authInfo->productList[0];
                }
            } else if ($payInfo->productId == PRODUCT_ID_15) {
                $productInfo = $authInfo->productList[0];
            } else {
                $productInfo = $authInfo->productList[1];
            }

            $contentID = $productInfo == null || $productInfo->contentID == null || $productInfo->contentID == "" ? CONTENT_ID : $productInfo->contentID;
            $productId = $productInfo == null || $productInfo->productId == null || $productInfo->productId == "" ? PRODUCT_ID . "@" . MasterManager::getAreaCode() : $productInfo->productId;
            // userToken
            $userToken = $epgInfoMap['UserToken'] ? $epgInfoMap['UserToken'] : "";
            $orderInfo = array(
                "SPID" => SPID,
                "UserID" => MasterManager::getAccountId(),
                "UserToken" => $userToken,
                "ServiceID" => SERVICE_ID,
                "ContentID" => $contentID,
                "ProductID" => $productId,
                "Action" => '2',   // 退订
                "OrderMode" => '1',
                "ReturnURL" => rawurlencode($callbackUrl),
                "ContinueType" => '1',
                //"NeedRewardPoints" => '0',
                "Lang" => "zh",
            );
            foreach ($orderInfo as $key => $val) {
                $unPayUrl .= $key . "=" . $val . "&";
            }
            $unPayUrl = substr($unPayUrl, 0, -1);

            LogUtils::info("Pay000051::buildUnPayUrl() ---> unPayUrl:" . $unPayUrl);
            $ret['result'] = 0;
            $ret['unPayUrl'] = $unPayUrl;
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
            $orderInfo->isIFramePay = isset($_GET['isIFramePay']) ? $_GET['isIFramePay'] : 0;
            $orderInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['singlePayItem']) ? $_GET['singlePayItem'] : 1;
            $orderInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
        }

        $orderInfo->lmreason = 0;

        // 清除cookie里订购结果记录, 目前联合活动才会使用该订购结果
        MasterManager::setOrderResult(0);

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
        $userInfo->productId = PRODUCT_ID;
        $userInfo->serviceId = SERVICE_ID;
        $userInfo->contentId = CONTENT_ID;
        $userInfo->orderType = isset($_GET['orderType']) ? $_GET['orderType'] : 1;

        // 鉴权订购产品
        if ($orderInfo->isJointActivity) {
            // 记录下已经是vip的sp厂商，用于生成答题次数
            $spInfo = Utils::getOrderInfo000051($orderInfo->contentId);
            $userInfo->spId = SPID;
            $userInfo->productId = $spInfo['productId'];;
            $userInfo->serviceId = $spInfo['serviceId'];
            $userInfo->contentId = $spInfo['contentId'];

            //联合活动修改订购原因
            $orderInfo->orderReason = ($orderInfo->contentId == CONTENT_ID) ? 111 : 112;
            $userInfo->orderType = ($orderInfo->contentId == CONTENT_ID) ? 1 : 2;

            // 记录订购哪家商品到cookie
            //MasterManager::setOrderContentId($orderInfo->contentId);
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
            $payResultInfo->isIFramePay = isset($_GET['isIFramePay']) ? $_GET['isIFramePay'] : 0;
            $payResultInfo->returnPageName = isset($_GET['returnPageName']) && $_GET['returnPageName'] != null
                ? $_GET['returnPageName'] : "";
            $payResultInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $payResultInfo->videoInfo = isset($_GET['videoInfo']) && $_GET['videoInfo'] != ""
                ? rawurldecode($_GET['videoInfo']) : null;

            $payResultInfo->result = isset($_GET['Result']) ? $_GET['Result'] : null;
            $payResultInfo->isJiFen = $_GET['isJiFen'] ? $_GET['isJiFen'] : 0;

        }
        LogUtils::info(" payCallback 000051 ---> payResult: " . json_encode($payResultInfo));

        if (!ActivityManager::isJointActivity()) {
            $result = $this->authentication();
            LogUtils::info(" payCallback000051 ---> authentication result: " . $result->result);
            if ($result->result != 0 && $payResultInfo->result == 0) {
                $payResultInfo->result = -100;
            }
        }
        // 添加局方数据上报的行为，如果成功的话操作结果上报1，否则上报失败的错误码
        $operateResult = $payResultInfo->result == 0 ? 1 : $payResultInfo->result;
        DebugAPIController::sendUserBehaviour000051(DebugAPIController::CHINAUNICOM_REPORT_DATA_TYPE["order"], $operateResult);

        /*
        // 表示积分兑换回来
        if ($payResultInfo->isJiFen != 1 && $payResultInfo->result != 0) {
            // 积分兑换“家康小卫士”，取消订购或订购失败，返回到积分兑换页面(天津、河南、山西、内蒙、黑龙江)
            //拉取订购项
            $orderInfo = new \stdClass();
            $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());
            if (count($orderItems) <= 0) {
                //TODO 错误处理
                LogUtils::error("Pay000051::payCallback() ---> orderItems is empty");
            }

            // 直接订购，使用第一个订购项（包月订购项）。
            $orderInfo->vipId = $orderItems[0]->vip_id;
            LogUtils::error("Pay000051::payCallback() ---> 用户订购失败,进行积分兑换");
            // 创建订单号
            $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, 230,
                "订购返回跳积分", CONTENT_ID, 1);
            if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
                LogUtils::info("Pay000051::payCallback() ---> 拉取订单失败:" . $tradeInfo->result);
                return;
            }
            $orderInfo->tradeNo = $tradeInfo->order_id;

            $param = array(
                "userId" => MasterManager::getUserId(),
                "tradeNo" => $orderInfo->tradeNo,
                "lmreason" => 0,
                "returnPageName" => $payResultInfo->returnPageName,
                "isJiFen" => 1,
                "isPlaying" => $payResultInfo->isPlaying,
            );

            $jumpUrl = $this->_buildPointExchangeUrl($param);
            if ($jumpUrl) {
                LogUtils::info("Pay000051::payCallback() ---> 积分商城jumpUrl：" . $jumpUrl);
                header("Location:" . $jumpUrl);
                return;
            }
        } else {
            LogUtils::info("Pay000051::payCallback() ---> 订购返回");
        }
        */


        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult($payResultInfo->result == 0 ? 1 : 0);

        $isVip = 0;
        if ($payResultInfo->result != null && $payResultInfo->result != '001') {
            // 上报订购结果
            $this->_uploadPayResult();

            // 判断用户是否是VIP，更新到session中
            $isVip = UserManager::isVip($payResultInfo->userId);
            MasterManager::setUserIsVip($isVip);


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

        if (($payResultInfo->lmreason != null && $payResultInfo->lmreason == 2)
            || ($payResultInfo->isIFramePay == 1)) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            LogUtils::info("Pay000051::payCallback() url:" . $intentUrl);
            header("Location:" . $intentUrl);
            return;
        }

        // 如果是播放订购成功回来，则过去继续数据&& ($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }

        LogUtils::info("Pay000051::payCallback() ---> videoInfo:" . $videoInfo);
        if ($isVip == 1 && $payResultInfo->isPlaying == 1 && $videoInfo != null) {
            // 继续播放
            LogUtils::info("Pay000051::payCallback() ---> jump player!");
            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        } else {
            LogUtils::info("Pay000051::payCallback() ---> jump returnPageName: " . $payResultInfo->returnPageName);
            IntentManager::back($payResultInfo->returnPageName);
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
        // TODO: Implement unPayCallback() method.
        LogUtils::info("############unPayCallback[000051] ---> _GET: " . json_encode($_GET));
        if ($unPayResultInfo == null) {
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = $_GET['userId'];
            $payResultInfo->tradeNo = $_GET['tradeNo'];
            $payResultInfo->lmreason = $_GET['lmreason'];
            $payResultInfo->returnPageName = isset($_GET['returnPageName']) && $_GET['returnPageName'] != null
                ? $_GET['returnPageName'] : "";

            $payResultInfo->result = $_GET['Result'];
        }

        // 上报退订结果
        $this->_uploadUnPayResult();

        //查询一下VIP状态，缓存到Session中
        $isVip = UserManager::isVip(MasterManager::getUserId());
        MasterManager::setUserIsVip($isVip);

        $vipInfo = UserManager::queryVipInfo(MasterManager::getUserId());                  //查询vip信息
        if ($vipInfo->result == 0 && ($vipInfo->auto_order == 1 || $vipInfo->last_order_trade_no == null || $vipInfo->last_order_trade_no == "")) {
            MasterManager::setAutoOrderFlag("1");
        } else {
            MasterManager::setAutoOrderFlag("0");
        }

        //IntentManager::back();
        $unsubscribeResult = IntentManager::createIntent("unsubscribeResult");
        $unsubscribeResult->setParam("returnPageName", $_GET['returnPageName']);
        IntentManager::jump($unsubscribeResult);
    }

    /**
     * 联合活动使用的用户验证
     * @param null $userId
     * @return int
     * @throws \Think\Exception
     */
    public function jointActivityAuthUserInfo($userId = null)
    {
        $userId = $userId == null ? MasterManager::getUserId() : $userId;
        $isTestUser = UserManager::isTest($userId);                     //判断用户是否是白名单用户
        $isVip = UserManager::isVip($userId);                           //判断用户是否是我方VIP用户

        if (!$isTestUser) {
            //不是白名单用户，去局方鉴权
            $authInfo = $this->authentication();
            if ($authInfo != null && $authInfo->result == 0) {
                //鉴权成功，表示用户是订购过的
                if (!$isVip) {
                    if (UserManager::regVip($userId) == 1)
                        $isVip = 1;
                }
            } else if ($authInfo != null && $authInfo->result == 0) {
                //其他鉴权失败，不取消vip
                if ($isVip) {
                    UserManager::unRegVip($userId);
                    $isVip = 0;

                }
            } else {
                $isVip = 0;
            }
        }

        $spOrderMap[CONTENT_ID] = $isVip;

        //缓存用户信息
        MasterManager::setIsTestUser($isTestUser);
        MasterManager::setUserIsVip($isVip);

        // 替其它sp厂商进行鉴权 ，使用contentId来关联
        $spInfo = Utils::getOrderInfo000051(null); // 记录下已经是vip的sp厂商，用于生成答题次数
        foreach ($spInfo as $key => $info) {
            if ($key != CONTENT_ID) {  // 我们自己的不在这里校验，因为在上面已经校验了
                $productInfo['spId'] = SPID;
                $productInfo['productId'] = $info['productId'];
                $productInfo['serviceId'] = $info['serviceId'];
                $productInfo['contentId'] = $info['contentId'];
                $authInfo = $this->authentication($productInfo);
                if(empty($productInfo['contentId'])){
                    $productInfo['contentId'] = $key;
                }
                if ($authInfo->result == 0) {
                    LogUtils::info("jointActivityAuthUserInfo ----> " . $productInfo['serviceId'] . " : user is vip in epg");
                    $spOrderMap[$productInfo['contentId']] = 1;
                } else {
                    $spOrderMap[$productInfo['contentId']] = 0;
                }
            }
        }

        LogUtils::info("jointActivityAuthUserInfo ---->  sp auth is ===> " . json_encode($spOrderMap));
        // 保存到session
        MasterManager::setActivityOrderSPMap($spOrderMap);

        return 0;
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
        $intent->setParam("isIFramePay", $param['isIFramePay']);
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
     * 构建订购返回地址
     * @param null $param
     * @return string
     */
    private function _buildUnPayCallbackUrl($param = null)
    {
        $intent = IntentManager::createIntent("unPayCallback");
        $intent->setParam("userId", $param['userId']);
        $intent->setParam("tradeNo", "");
        $intent->setParam("lmreason", "0");
        $intent->setParam("lmcid", $param['lmcid']);
        $intent->setParam("returnPageName", $param['returnPageName']);

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
            "isIFramePay" => $payInfo->isIFramePay,
        );
        $callbackUrl = $this->_buildPayCallbackUrl($param);  //构建返回地址

        // 获取EPG信息
        $accountId = MasterManager::getAccountId();
        $userToken = MasterManager::getUserToken();

        //if(MasterManager::getAreaCode() == "207" && ($productInfo->contentID == "sxgdyseby" || $productInfo->contentID == "sxgdysrhyb")){
        //    $productInfo->contentID== "";
        //}

        if(MasterManager::getAreaCode() == '207' && in_array(MasterManager::getEnterPosition(), $this->getShanXiOfflinePosition())){
            $productInfo->spId = SHANXI_SPID;
            $productInfo->productId = PRODUCT_SHANXI_ID;
            $productInfo->serviceId = SERVICE_SHANXI_ID;
            $productInfo->contentId = CONTENT_SHANXI_ID;
        }else{
            $productInfo->spId = SPID;
        }

        LogUtils::info("Pay000051::buildUrlAndPay productInfo: " . json_encode($productInfo));
        // 组装订购参数
        $orderInfo = array(
            "SPID" => $productInfo->spId,
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

        // 是否需要走童锁
        if (MasterManager::isShowPayLock() == 1) {
            if (MasterManager::getAreaCode() == '204') {
                $productId = PRODUCT_ID . "@" . MasterManager::getAreaCode();
                $lockStatus = $this->querySafeLockStatus(MasterManager::getAccountId(), $productId);
                if ($lockStatus == 1) {
                    //河南省 先调用童锁校验地址
                    $orderParam = new \stdClass();
                    $orderParam->userId = $payInfo->userId;
                    $orderParam->vipId = $payInfo->vip_id;
                    $orderParam->vipType = $payInfo->vip_type;
                    $orderParam->isPlaying = $payInfo->isPlaying;
                    $orderParam->isIFramePay = $payInfo->isIFramePay;
                    $orderParam->videoInfo = $payInfo->videoInfo;
                    $orderParam->price = $productInfo->price;
                    $orderParam->orderReason = $payInfo->orderReason;
                    $orderParam->remark = $payInfo->remark;
                    $orderParam->productId = $productInfo->productId;
                    $orderParam->contentId = $productInfo->contentID;
                    $orderParam->serviceId = $productInfo->serviceId;
                    $orderParam->payUrl = $payUrl;
                    $verifyUrl = $this->buildPayLockVerifyUrl($orderParam);
                    $payUrl = $verifyUrl;
                }
            }
        }

        LogUtils::info("---> _buildPayUrl: $payUrl");
        return $payUrl;
    }

    /**
     * 河南省份需要校验童锁
     * @param $orderParam
     * @return bool|string
     */
    public function buildPayLockVerifyUrl($orderParam)
    {
        // 组装童锁回调地址
        $intent = IntentManager::createIntent("payLockVerifyResult");
        $intent->setParam("orderParam", urlencode(json_encode($orderParam)));
        $returnUrl = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($returnUrl, "http://")) {
            $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $returnUrl;  // 回调地址需要加上全局路径
        }
        $time = date('YmdHis', time());

        //提供给局方注册童锁的是该产品ID
        $productId = PRODUCT_ID . "@" . MasterManager::getAreaCode();

        $account = $this->_interceptAccount(MasterManager::getAccountId());
        $verifyUrl = PAY_LOCK_VERIFY_URL;
        $verifyUrl = $verifyUrl . "?userid=" . $account;
        $verifyUrl = $verifyUrl . "&appId=" . APP_ID;
        $verifyUrl = $verifyUrl . "&time=" . $time;
        $verifyUrl = $verifyUrl . "&sign=" . strtolower(md5(APP_KEY . $time));
        $verifyUrl = $verifyUrl . "&productPrice=" . $orderParam->price;
        $verifyUrl = $verifyUrl . "&productId=" . $productId;
        $verifyUrl = $verifyUrl . "&returnUrl=" . rawurlencode($returnUrl);

        return $verifyUrl;
    }

    /**
     * 构建统一认地址
     * @param $payInfo
     * @param $productInfo
     * @param $returnPageName
     * @return string
     */
    public function buildUnifiedAuthUrl($payInfo, $productInfo, $returnPageName)
    {
        $account = $this->_interceptAccount(MasterManager::getAccountId());
        $time = time();
        $authNo = $time . rand(10000, 99999);
        $token = md5(PAY_AUTH_KEY . $authNo);

        if ($payInfo->isPlaying == 1 && empty($payInfo->videoInfo)) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : "";
            $payInfo->videoInfo = json_encode($videoInfo);
        }

        // 订购参数
        $orderParam = new \stdClass();
        $orderParam->userId = $payInfo->userId;
        $orderParam->vipId = $payInfo->vipId;
        $orderParam->vipType = $payInfo->vipType;
        $orderParam->isPlaying = $payInfo->isPlaying;
        $orderParam->isIFramePay = $payInfo->isIFramePay;
        $orderParam->videoInfo = $payInfo->videoInfo;
        $orderParam->price = $productInfo->price;
        $orderParam->orderReason = $payInfo->orderReason;
        $orderParam->remark = $payInfo->remark;
        $orderParam->productId = $productInfo->productId;
        $orderParam->contentId = $productInfo->contentID;
        $orderParam->serviceId = $productInfo->serviceId;
        $orderParam->orderType = $payInfo->orderType;
        $orderParam->lmreason = $payInfo->lmreason;
        $orderParam->accountId = MasterManager::getAccountId();
        $orderParam->userToken = MasterManager::getUserToken();

        // 创建统一鉴权成功回调地址
        $intent = IntentManager::createIntent("payUnifiedAuthResult");
        $intent->setParam("returnPageName", $returnPageName);
        $intent->setParam("flag", "confirm");
        $intent->setParam("orderParam", urlencode(json_encode($orderParam)));
        $confirmUrl = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($confirmUrl, "http://")) {
            $confirmUrl = "http://" . $_SERVER['HTTP_HOST'] . $confirmUrl;  // 回调地址需要加上全局路径
        }

        // 创建统一鉴权失败回调地址
        $intent = IntentManager::createIntent("payUnifiedAuthResult");
        $intent->setParam("returnPageName", $returnPageName);
        $intent->setParam("flag", "cancel");
        $intent->setParam("orderParam", urlencode(json_encode($orderParam)));
        $cancelUrl = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($cancelUrl, "http://")) {
            $cancelUrl = "http://" . $_SERVER['HTTP_HOST'] . $cancelUrl;  // 回调地址需要加上全局路径
        }

        // 组装认证参数
        $authParam = array(
            "productId" => $productInfo->productId,
            "productName" => Utils::escape($productInfo->productName),
            "productPrice" => $productInfo->price / 100,
            "productType" => empty($productInfo->cycleUnit) ? 0 : $productInfo->cycleUnit,
            "account" => $account,
            "confirmAddress" => rawurlencode($confirmUrl),
            "cancelAddress" => rawurlencode($cancelUrl),
            "clientId" => SPID,
            "authNo" => $authNo,
            "token" => $token,
        );

        // 拼接统一鉴权地址
        $unifiedAuthUrl = MasterManager::getPlatformType() == STB_TYPE_HD ? PAY_AUTH_HD_URL : PAY_AUTH_SD_URL;
        $unifiedAuthUrl = $unifiedAuthUrl . "?product_id=" . $authParam['productId'];
        $unifiedAuthUrl = $unifiedAuthUrl . "&product_name=" . $authParam['productName'];
        $unifiedAuthUrl = $unifiedAuthUrl . "&product_price=" . $authParam['productPrice'];
        $unifiedAuthUrl = $unifiedAuthUrl . "&product_type=" . $authParam['productType'];
        $unifiedAuthUrl = $unifiedAuthUrl . "&account_id=" . $authParam['account'];
        $unifiedAuthUrl = $unifiedAuthUrl . "&confirm_address=" . $authParam['confirmAddress'];
        $unifiedAuthUrl = $unifiedAuthUrl . "&cancel_address=" . $authParam['cancelAddress'];
        $unifiedAuthUrl = $unifiedAuthUrl . "&client_id=" . $authParam['clientId'];
        $unifiedAuthUrl = $unifiedAuthUrl . "&auth_no=" . $authParam['authNo'];
        $unifiedAuthUrl = $unifiedAuthUrl . "&token=" . $authParam['token'];

        return $unifiedAuthUrl;
    }

    /**
     * 生成订购地址，此订购地址不显示局方的订购页面，直接http请求
     * @param $accountId 业务帐号
     * @param $userToken 用户token
     * @param $tradeNo 订单号
     * @param $productInfo 鉴权得到的产品信息
     * @return bool|string
     */
    public function buildOderUrlAndPay($accountId, $userToken, $tradeNo, $productInfo)
    {
        // 请求头部
        $header = array(
            'CLIENT-IP:192.168.108.196',
            'X-FORWARDED-FOR:192.168.108.196'
        );

        // 组装订购参数
        $orderInfo = array(
            "spId" => SPID,
            "userId" => $accountId,
            "userToken" => $userToken,
            "externalTransactionId" => $tradeNo,
            "serviceId" => $productInfo->serviceId,
            "contentId" => $productInfo->contentId,
            "productId" => $productInfo->productId,
            "action" => '1',
            "orderMode" => '1',
            "continueType" => '1',
            "lang" => "zh"
        );
        $payUrl = ORDER_DIRECT_PAY_URL;
        LogUtils::info("Pay000051 --> user buildOderUrlAndPay payUrl:" . $payUrl);
        LogUtils::info("Pay000051 --> user buildOderUrlAndPay param:" . json_encode($orderInfo));
        // post到局方鉴权，同步返回数据
        $result = HttpManager::httpRequestByHeader("POST", $payUrl, $header, json_encode($orderInfo));
        LogUtils::info("Pay000051 --> user buildOderUrlAndPay result:  " . $result);

        return $result;
    }


    /**
     * 生成订购地址，此订购地址不显示局方的订购页面，直接http请求
     * @param $orderParam
     * @return bool|string
     */
    public function buildOderUrlAndPayEx($orderParam)
    {
        // 请求头部
        $header = array(
            'CLIENT-IP:192.168.108.196',
            'X-FORWARDED-FOR:192.168.108.196'
        );

        // 生产订单
        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($orderParam->vipId, $orderParam->orderReason, $orderParam->remark, null, $orderParam->orderType);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            return false;
        }
        // 鉴权失败说明用户可订购， 构建订购地址
        $orderParam->tradeNo = $orderInfo->order_id;

        // 组装订购参数
        $orderInfo = array(
            "spId" => SPID,
            "userId" => $orderParam->accountId,
            "userToken" => $orderParam->userToken,
            "externalTransactionId" => $orderParam->tradeNo,
            "serviceId" => $orderParam->serviceId,
            "contentId" => $orderParam->contentId,
            "productId" => $orderParam->productId,
            "action" => '1',
            "orderMode" => '1',
            "continueType" => $orderParam->vipType == 2 ? '1' : '0',
            "lang" => "zh",
            "unifyToken" => $orderParam->unifyToken,
            "authNo" => $orderParam->authNo,
        );
        $payUrl = ORDER_DIRECT_PAY_URL;
        LogUtils::info("Pay000051 --> user buildOderUrlAndPayEx payUrl:" . $payUrl);
        LogUtils::info("Pay000051 --> user buildOderUrlAndPayEx param:" . json_encode($orderInfo));
        // post到局方鉴权，同步返回数据
        $result = HttpManager::httpRequestByHeader("POST", $payUrl, $header, json_encode($orderInfo));
        LogUtils::info("Pay000051 --> user buildOderUrlAndPayEx result:  " . $result);
        $payResult = $this->_uploadPayResultEx($orderParam, $result);
        return $payResult;
    }

    private function _uploadPayResultEx($orderParam, $payResult)
    {
        $retPayResult = array(
            'result' => -1,
            'message' => "订购失败"
        );

        $result = json_decode($payResult);
        if (!empty($result)) {
            $retPayResult['result'] = $result->result;
            LogUtils::info("_uploadPayResultEx --->user order result: " . $result->result);
            // 处理订购结果,订购成功或已经订购
            if ($result->result == 0 || $result->result == 10030003) {
                LogUtils::info("_uploadPayResultEx --->user order success result: " . $result->result);
                MasterManager::setUserIsVip(1);
                // 把订购是否成功的结果写入cookie，供页面使用
                MasterManager::setOrderResult(1);
            }
            $result->TradeNo = $result->orderId != "" ? $result->orderId : $orderParam->tradeNo;
            $result->reason = $orderParam->lmreason;

            // 解析局方返回码
            if (defined("RESULT_CODE")) {
                $array = eval(RESULT_CODE);
                // 如果找到返回码对应的描述，就使用描述；如果找不到，就把返回码返回
                if (array_key_exists($result->result, $array)) {
                    $retPayResult['message'] = $array[$result->result];
                    $result->description = $array[$result->result];
                } else {
                    $retPayResult['message'] = $result->result;
                }
            }

            //去请求cws-pay系统
            $url = ORDER_CALL_BACK_URL_EX;

            $postResult = HttpManager::httpRequest("post", $url, $result);
            LogUtils::info("_uploadPayResultEx url --->: $url");
            LogUtils::info("_uploadPayResultEx postParams ---> : " . json_encode($result));
            LogUtils::info("_uploadPayResultEx postPayResult ---> result : " . $postResult);
        }
        return $retPayResult;
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
                'transactionID' => $_GET['transactionID'],
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
     * 上报退订结果
     * @param null $unPayResultInfo
     */
    private function _uploadUnPayResult($unPayResultInfo = null)
    {
        $userId = isset($_GET['userId']) ? $_GET['userId'] : MasterManager::getUserId();
        if ($unPayResultInfo == null) {
            // 处理并上报支付结果
            $unPayResultInfo = array(
                'TradeNo' => $_GET['tradeNo'],
                'reason' => $_GET['lmreason'],
                'transactionID' => $_GET['transactionID'],
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
                'AvailableIPTVRewardPoints' => $_GET['AvailableIPTVRewardPoints'],
                'AvailableTeleRewardPoints' => $_GET['AvailableTeleRewardPoints'],
                'AvailableTVVASRewardPoints' => $_GET['AvailableTVVASRewardPoints'],
                //'TradesSerialNum' => $_GET['TradesSerialNum'],
                //'ActualPayAmount' => $_GET['ActualPayAmount'],
                'Action' => $_GET['Action'],
            );
        }

        LogUtils::info("_uploadUnPayResult ---> unPayResultInfo : " . json_encode($unPayResultInfo));

        PayAPI::postUnsubscribeVipResultBy000051($userId, $unPayResultInfo);
    }

    /**
     * 截取账号，将账号的后缀取消 如"_204"
     * @param $account
     * @return bool|string
     */
    private function _interceptAccount($account)
    {
        $arecCodeTail = "_" . MasterManager::getAreaCode();
        if (substr_compare($account, $arecCodeTail, -strlen($arecCodeTail)) === 0) {
            $account = substr($account, 0, strlen($account) - strlen($arecCodeTail));
        }
        return $account;
    }

    /**
     * @Brief:此函数用于新的订购信息
     * @param $orderReason
     * @param $remark
     * @param $productId
     * @return null | $payParam
     */
    public function buildNewPayUrl($orderReason, $remark, $productId = 1)
    {
        //拉取订购项
        $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());
        if (count($orderItems) <= 0) {
            return null;
        } else {
            $this->dataReport();
            // 直接订购，使用第一个订购项（包月订购项）。
            $vipId = $orderItems[0]->vip_id;

            //先到局方鉴权
            $authInfo = $this->authentication();
            if ($authInfo->result == 10020001) {
                // 创建支付订单
                $orderInfo = OrderManager::createPayTradeNo($vipId, $orderReason, $remark);
                if ($orderInfo->result != 0) {
                    // 创建失败
                    return null;
                } else {
                    // 根据页面上的计费选项类型，来提取对应的计费参数
                    if (Utils::isTianJinSpecialEntry() == 1) {
                        $productInfo = $authInfo->productList[0];
                    } else if (MasterManager::getAreaCode() == '201') {
                        if (count($authInfo->productList) > 1) {
                            $productInfo = $authInfo->productList[1];
                        } else {
                            $productInfo = $authInfo->productList[0];
                        }
                    } else if ($productId == PRODUCT_ID_15) {
                        $productInfo = $authInfo->productList[0];
                    } else {
                        $productInfo = $authInfo->productList[1];
                    }
                    // 生成新订购参数
                    // 获取EPG信息
                    $epgInfoMap = MasterManager::getEPGInfoMap();

                    $paramInfo = array(
                        "accountId" => $epgInfoMap['UserID'],
                        "userToken" => $epgInfoMap['UserToken'],
                        "orderId" => $orderInfo->order_id,
                        "serviceId" => $productInfo->serviceId,
                        "contentId" => $productInfo->contentID,
                        "productId" => $productInfo->productId,
                    );

                    $payUrl = APP_ROOT_PATH . '/index.php/Api/Pay/pay000051';
                    foreach ($paramInfo as $key => $value) {
                        if (strpos($payUrl, '?') === false) {
                            $payUrl = $payUrl . '?' . $key . "=" . $value;
                        } else {
                            $payUrl = $payUrl . '&' . $key . "=" . $value;
                        }
                    }

                    LogUtils::info("---> buildNewPayUrl :" . $payUrl);
                    return $payUrl;
                }
            } else {
                return null;
            }
        }
    }


    /**
     * @Brief:此函数用于判断是否直接去局方订购（走局方的订购页）
     * @return: true--去局方订购页,false--去39健康订购页
     */
    public function isDirectToPay()
    {
        $areaCode = MasterManager::getAreaCode();
        $subAreaCode = MasterManager::getSubAreaCode();

        if (MasterManager::getAccountId() == "jdhyanfa016_216") {
            return true;
        }

        $result = PayAPI::queryUserPayPageShowRuleEx($areaCode, $subAreaCode);
        $result = json_decode($result);
        if ($result->result == 0) {
            $data = $result->data;
            /**
             * page_type：计费页类型（0:局方统一计费页 1:39健康计费页）
             * identify_flag：是否到局方统一认证，page_type为1时有意义（1是 0否）
             * cfg_data：页面配置数据（page_type=0时，cfg_data应为空数组；
             * page_type=1时，数组的第1个对象是第1次确认页的配置信息，第2个是第2次确认页的配置信息）
             * vcode：是否有验证码（0否 1是）
             * focus_pos：默认焦点位置（0确认按钮 1取消按钮 2验证码输入框）
             */
            $pageType = $data->page_type;
            if ($pageType == 0) {
                return true;
            } else {
                $configData = $data->cfg_data;
                MasterManager::setPayPageConfig($configData);
                MasterManager::setPayUnifyAuth($data->identify_flag);

                return false;
            }
        } else {
            // 默认是去局方订购页
            return true;
        }
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
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
            'platformTypeExt' => MasterManager::getPlatformTypeExt(),
            'userToken' => $userToken,
            'isUnicomActivity' => 0,

            'spId' => SPID,
            'serviceId' => SERVICE_ID,
            'contentId' => CONTENT_ID,
            'productId' => PRODUCT_ID,
        );

        // 联合活动的特殊处理
        if ((MasterManager::getUserFromType() == 2
                || MasterManager::getUserFromType() == 3)
            && Utils::isJointActivity(MasterManager::getAreaCode(), MasterManager::getSubId())) {
            $isUnicomActivity = 1;
            $activityName = MasterManager::getSubId();
            $info['isUnicomActivity'] = $isUnicomActivity;
            $info['activityName'] = $activityName;

            // 如果是联合活动，则要判断上报哪家的应用
            // 向服务器拉取需要上报哪家的订购信息
            $spOrderMap = SessionManager::getUserSession(SessionManager::$S_ACTIVITY_ORDER_SP_MAP);

            $spInfo = Utils::queryPostSpOrderInfo(MasterManager::getUserId());
            $contentId = $spInfo['contentId'];
            $orderType = $spInfo['orderType'];
            if (($spOrderMap[$contentId] == 1) && ($contentId != CONTENT_ID)) {
                LogUtils::info(">>>> queryPostSpOrderInfo: user has ordered $contentId, so will go post " . CONTENT_ID);
                // 如果这个用户其它家的了，就默认订购我们的
                $contentId = CONTENT_ID;
            }

            // 如果是我们的产品（39健康），orderType类型改为0
            if ($orderType == 1) {
                $orderType = 0;
            }

            $info['contentId'] = $contentId;
            $info['orderType'] = $orderType;
        }

        return $info;
    }

    /**
     * @Brief:此函数为服务器订购接口
     * @param: isAuth == 1时，表示要进行统一认证
     */
    public function interfacePay($userInfo)
    {
        $this->interfacePayAuth($userInfo);
//        if ($userInfo->isAuth == 1) {
//            $this->interfacePayAuth($userInfo);
//        } else {
//            $this->interfacePayNoAuth($userInfo);
//        }
    }

    /**
     * @Brief:带认证的服务器订购接口
     */
    public function interfacePayAuth($userInfo)
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

        $productInfo['serviceId'] = $userInfo->serviceId;
        $productInfo['contentId'] = $userInfo->contentId;
        $productInfo['productId'] = $userInfo->productId;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("interfacePay::buildUrlAndPay() ---> orderItems is empty");
            return json_encode($payResult);
        }

        $this->dataReport();
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->vipType = $orderItems[0]->vip_type == 2 ? '1' : '0';

        // 产品鉴权
        $authInfo = $this->authentication($productInfo);
        if ($authInfo->result == 10020001) {
            // 得到产品信息
            if (Utils::isTianJinSpecialEntry() == 1) {
                $productInfo = $authInfo->productList[0];
            } else if (MasterManager::getAreaCode() == '201') {
                if (count($authInfo->productList) > 1) {
                    $productInfo = $authInfo->productList[1];
                } else {
                    $productInfo = $authInfo->productList[0];
                }
            } else {
                $productInfo = $authInfo->productList[0];
            }

            $orderInfo->price = $productInfo->price;
            $payUrl = $this->buildUnifiedAuthUrl($orderInfo, $productInfo, "");
            header("Location:" . $payUrl);
        }
    }

    /**
     * @Brief:不用认证的服务器订购接口
     */
    public function interfacePayNoAuth($userInfo)
    {
        $payResult = array(
            'result' => -1,
            'message' => "订购失败"
        );
        $orderInfo = "";
        $accountId = MasterManager::getAccountId();
        $userToken = MasterManager::getUserToken();
        $productInfo['serviceId'] = $userInfo->serviceId;
        $productInfo['contentId'] = $userInfo->contentId;
        $productInfo['productId'] = $userInfo->productId;

        $userInfo->orderType = 0;
        $userInfo->lmreason = 1;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay000051::buildUrlAndPay() ---> orderItems is empty");
            return json_encode($payResult);
        }
        $this->dataReport();
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单号
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
            $orderInfo->remark, $orderInfo->contentId, $userInfo->orderType);
        if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
            LogUtils::info("Pay000051::buildUrlAndPay() ---> 拉取订单失败:" . $tradeInfo->result);
            return json_encode($payResult);
        }
        $orderId = $tradeInfo->order_id;

        //先到局方鉴权
        $instance = OrderManager::getInstance(CARRIER_ID_CHINAUNICOM);

        // 生成订购url，并直接订购
        $result = $instance->buildOderUrlAndPay($accountId, $userToken, $orderId, json_decode(json_encode($productInfo)));
        $result = json_decode($result);
        if ($result != "" && $result != null) {
            $payResult['result'] = $result->result;

            LogUtils::info("--->pay000051Action: user order result: " . $result->result);

            // 处理订购结果,订购成功或已经订购
            if ($result->result == 0 || $result->result == 10030003) {
                LogUtils::info("--->pay000051Action: user order success result: " . $result->result);
            }
            $result->TradeNo = $result->orderId != "" ? $result->orderId : $orderId;
            $result->reason = $userInfo->lmreason;

            // 解析局方返回码
            if (defined("RESULT_CODE")) {
                $array = eval(RESULT_CODE);
                // 如果找到返回码对应的描述，就使用描述；如果找不到，就把返回码返回
                if (array_key_exists($payResult["result"], $array)) {
                    $payResult['message'] = $array[$payResult["result"]];
                    $result->description = $payResult['message'];
                } else {
                    $payResult['message'] = $payResult["result"];
                }
            }

            //去请求cws-pay系统
            $url = ORDER_CALL_BACK_URL_EX;

            $postResult = HttpManager::httpRequest("post", $url, $result);
            LogUtils::info("pay000051Action url --->: $url");
            LogUtils::info("pay000051Action postParams ---> : " . json_encode($result));
            LogUtils::info("pay000051Action postPayResult ---> result : " . $postResult);
        }

        LogUtils::error("pay000051Action:" . json_encode($payResult));
        return json_encode($payResult);
    }

    public function webPagePay($userInfo)
    {
        $userId = MasterManager::getUserId();
        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = MasterManager::getUserId();
        $orderInfo->orderReason = 220;
        $orderInfo->remark = "login";
        $orderInfo->isPlaying = 0;
        $orderInfo->isIFramePay = 0;
        $orderInfo->lmreason = 1;
        $userInfo->orderType = 0;

        // 如果是联合活动，要特殊处理
        if ($userInfo->isUnicomActivity == 1) {
            $orderInfo->orderReason = ($orderInfo->contentId == CONTENT_ID) ? 111 : 112;
        }
        if ($userInfo->contentId != CONTENT_ID && !empty($userInfo->contentId)
            && $userInfo->contentId != null) {
            // 记录下已经是vip的sp厂商，用于生成答题次数
            MasterManager::setPlatformTypeExt($userInfo->platformTypeExt);
            MasterManager::setSubId($userInfo->activityName);
            $spInfo = Utils::getOrderInfo000051($userInfo->contentId);
            $userInfo->productId = $spInfo['productId'];
            $userInfo->serviceId = $spInfo['serviceId'];
            $userInfo->contentId = $spInfo['contentId'];
            //联合活动修改订购原因
            $orderInfo->contentId = $spInfo['contentId'];
        } else {
            $orderInfo->contentId = CONTENT_ID;
        }

        $this->buildUrlAndPay($userId, $userInfo, $orderInfo);
        return;
    }

    public function buildUrlAndPay($userId, $userInfo, $orderInfo)
    {
        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay000051::buildUrlAndPay() ---> orderItems is empty");
            return;
        }

        $this->dataReport();
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        if(MasterManager::getAreaCode() == '201' && in_array(MasterManager::getEnterPosition(), $this->getSmallBagPosition())){
            LogUtils::error("Pay000051::orderItems ---> ".json_encode($orderItems));
            $orderInfo->vipId = $orderItems[2]->vip_id;
        }

        $productInfo['spId'] = $userInfo->spId;
        $productInfo['productId'] = $userInfo->productId;
        $productInfo['serviceId'] = $userInfo->serviceId;
        $productInfo['contentId'] = $userInfo->contentId;

        $authInfo = $this->authentication($productInfo);
        LogUtils::info("Pay000051::buildUrlAndPay() ---> authentication result: " . json_encode($authInfo));
        if($orderInfo->isJointActivity === '1' && $orderInfo->contentId === 'akys' && $authInfo->result === 10020003){
            //爱看影视 产品存在问题，鉴权返回10020003
            $authInfo->result = 10020001;
        }
        if ($authInfo->result === 10020001) {
            //鉴权失败，保存鉴权返回的订购信息项。
            MasterManager::setOrderItems($authInfo);

            if (Utils::isTianJinSpecialEntry() == 1) {
                $authProductInfo = $authInfo->productList[0];
            } else if (MasterManager::getAreaCode() == '201') {
                if (count($authInfo->productList) > 1) {
                    $authProductInfo = $authInfo->productList[1];
                } else {
                    $authProductInfo = $authInfo->productList[0];
                }
            } else {
                $authProductInfo = $authInfo->productList[0];
            }

            //联合活动 爱看影视 产品存在问题，鉴权返回10020003
            if($orderInfo->isJointActivity === '1' && $orderInfo->contentId === 'akys' && empty($authProductInfo)){
                $spInfo = Utils::getOrderInfo000051($orderInfo->contentId);
                $authProductInfo->spId = SPID;
                $authProductInfo->serviceId = $spInfo['serviceId'];
                $authProductInfo->contentID = $spInfo['contentId'];
                $authProductInfo->productId = $spInfo['productId'];
            }

            if(MasterManager::getAreaCode() == '201'){
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

            LogUtils::info("Pay000051::buildUrlAndPay authProductInfo: " . json_encode($authProductInfo));
            // 对联合活动（沃家音乐）进行适配 --- JointActivityApril20210318 活动结束可以删除
            if ($userInfo->productId == "xwjyyby020@207") {
                $authProductInfo->productId = $userInfo->productId;
            }

            // 创建订单号
            $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
                $orderInfo->remark, $orderInfo->contentId, $userInfo->orderType);
            if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
                LogUtils::info("Pay000051::buildUrlAndPay() ---> 拉取订单失败:" . $tradeInfo->result);
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
            $payInfo->isIFramePay = $orderInfo->isIFramePay;        // 是否通过iframe加载订购页面(0--不是, 1--是)
            $payInfo->orderReason = $orderInfo->orderReason;        // 订购原因
            $payInfo->remark = $orderInfo->remark;                  // 订购标记
            $payInfo->returnPageName = $orderInfo->returnPageName;  // 返回页面名称，也可能定义为返回页面的Intent对象
            $payInfo->videoInfo = $orderInfo->videoInfo;            // 正在播放时的视频信息。
            $payInfo->tradeNo = $tradeInfo->order_id;               // 订单号
            $payInfo->lmreason = $tradeInfo->lmreason;

            $payUrl = $this->_buildPayUrl($payInfo, $authProductInfo);
            header("Location:" . $payUrl);
        } else if ($authInfo != null && $authInfo->result == 0) {
            // 在局方已经是VIP
            $isVip = UserManager::isVip($userId);
            if (!$isVip) {
                if (UserManager::regVip($userId) == 1) {
                    LogUtils::info("Pay000051::buildUrlAndPay() ---> regVip  success!");
                    $isVip = 1;
                }
                LogUtils::info("Pay000051::buildUrlAndPay() --->regVip failed!");
            }
            MasterManager::setUserIsVip($isVip);

            IntentManager::back();
        } else {
            LogUtils::info("Pay000051::buildUrlAndPay() ---> user exception");
            IntentManager::back();
        }
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
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl()
    {
        $payUrl = "";
        $userId = MasterManager::getUserId();
        // 构建我方的应用订购信息
        $orderInfo = new \stdClass();
        $orderInfo->userId = MasterManager::getUserId();
        $orderInfo->orderReason = 221;
        $orderInfo->remark = "login";
        $orderInfo->lmreason = 2;
        $orderInfo->contentId = CONTENT_ID;
        $orderInfo->orderReason = 111;
        $orderType = 1;

        LogUtils::info("Pay000051::buildDirectPayUrl() ");
        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay000051::buildDirectPayUrl() ---> orderItems is empty");
            return $payUrl;
        }

        //时间在2021-11-08--15
        if (MasterManager::getAreaCode() == '204' && false) {
            //河南办事处要求周一到周五-8点到18关闭该接口订购，周末放开
            $hour=date( "H");
            if($hour>=8 && $hour<18){
                $w=date('w');
                if($w>=1 && $w<=5){
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

        $productInfo['spId'] = SPID;
        $productInfo['productId'] = PRODUCT_ID;
        $productInfo['serviceId'] = SERVICE_ID;
        $productInfo['contentId'] = CONTENT_ID;

        // 联合活动的特殊处理
        /*
        if ((MasterManager::getUserFromType() == 2
                || MasterManager::getUserFromType() == 3)
            && Utils::isJointActivity(MasterManager::getAreaCode(), MasterManager::getSubId())) {
            $spInfo = Utils::queryPostSpOrderInfo(MasterManager::getUserId());
            // 替其它sp厂商进行鉴权 ，使用contentId来关联
            $spInfo = Utils::getOrderInfo000051($spInfo['contentId']);
            $productInfo['spId'] = SPID;
            $productInfo['productId'] = $spInfo['productId'];
            $productInfo['serviceId'] = $spInfo['serviceId'];
            $productInfo['contentId'] = $spInfo['contentId'];
        }
        */

        $authInfo = $this->authentication($productInfo);
        LogUtils::info("Pay000051::buildDirectPayUrl() ---> authentication result: " . $authInfo);
        if ($authInfo->result === 10020001) {
            //鉴权失败，保存鉴权返回的订购信息项。
            MasterManager::setOrderItems($authInfo);

            if (Utils::isTianJinSpecialEntry() == 1) {
                $authProductInfo = $authInfo->productList[0];
            } else if (MasterManager::getAreaCode() == '201') {
                if (count($authInfo->productList) > 1) {
                    $authProductInfo = $authInfo->productList[1];
                } else {
                    $authProductInfo = $authInfo->productList[0];
                }
            } else {
                $authProductInfo = $authInfo->productList[0];
            }

            if(MasterManager::getAreaCode() == '201'){
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

            LogUtils::info("Pay000051::buildDirectPayUrl authProductInfo: " . json_encode($authProductInfo));

            if(MasterManager::getAreaCode() == '201' && in_array(MasterManager::getEnterPosition(), $this->getSmallBagPosition())){
                $orderInfo->vipId = $orderItems[2]->vip_id;
            }

            // 创建订单号
            $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
                $orderInfo->remark, $authProductInfo->contentID, $orderType);
            if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
                LogUtils::info("Pay000051::buildDirectPayUrl() ---> 拉取订单失败:" . $tradeInfo->result);
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
            $payInfo->tradeNo = $orderInfo->tradeNo;               // 订单号
            $payInfo->lmreason = $orderInfo->lmreason;

            $payUrl = $this->_buildPayUrl($payInfo, $authProductInfo);
            // 增加订单号方便解析
            $payUrl = $payUrl . "&lmTradeNo=" . $orderInfo->tradeNo;
        } else if ($authInfo->result == 0) {
            // 在局方已经是VIP
            LogUtils::info("Pay000051::buildDirectPayUrl() ---> auth result = 0");
        } else {
            LogUtils::info("Pay000051::buildDirectPayUrl() ---> user exception");
        }

        $areaCode = array(201,204,208,209,216,217);
        if((in_array(MasterManager::getAreaCode(), $areaCode)) && !empty($payUrl)){
            PayAPI::addUserPayUrl(urlencode($payUrl),$payInfo->tradeNo,1);
        }

        return $payUrl;
    }

    public function _buildPointExchangeUrl($param = null)
    {
        if ($param == null) {
            $param = array(
                "returnPageName" => "wait",
                "Result" => 'back',
            );
        }

        // 地区与积分商品编码
        $areaCode = MasterManager::getAreaCode();
        $pList = array(
            "201" => "V321300000034", // 天津
            "204" => "V327600000069", // 河南
            "207" => "V321900000230", // 山西
            "208" => "V321000000063", // 内蒙
            "211" => "V329700000092", // 黑龙江
            "217" => "V327100000047", // 湖北
        );
        LogUtils::info("Pay000051::_buildPointExchangeUrl areaCode:" . $areaCode);
        $pointExchangeUrl = null;

        if (!in_array($areaCode, array_keys($pList))) {
            return $pointExchangeUrl;
        }

        $callbackUrl = $this->_buildPayCallbackUrl($param);
        $callbackUrl = urlencode($callbackUrl);
        $proId = $pList[$areaCode];
        $userAccountId = $this->getUserAccountId();
        $pointExchangeUrl = "http://202.99.114.14:15081/integralExchange/recommend.html?userId=" . $userAccountId . "&carrierid=" . $areaCode . "&specialareatype=2&goodsid=" . $proId . "&returnurl=" . $callbackUrl;

        LogUtils::info("############pointExchangeUrl: $pointExchangeUrl");
        return $pointExchangeUrl;
    }

    public function buildPointExchangeUrl($orderInfo = null)
    {
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
            LogUtils::error("Pay000051::buildPointExchangeUrl() ---> orderItems is empty");
        }

        $this->dataReport();
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单号
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason,
            $orderInfo->remark, $orderInfo->contentId, $orderType);
        if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
            LogUtils::info("Pay000051::buildPointExchangeUrl() ---> 拉取订单失败:" . $tradeInfo->result);
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
        LogUtils::info("Pay000051::buildPointExchangeUrl() ---> _buildPointExchangeUrl");
        $url = $this->_buildPointExchangeUrl($param);
        return $url;
    }

    /**
     * @Brief:此函数用于获取用户的业务帐号（是去_xxx区域码的）
     *          如：053222222_216 ----> 053222222
     * @return: $accountId  没有区域码的业务帐号
     */
    private static function getUserAccountId()
    {
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

        if (MasterManager::getAreaCode() == '201') {
            $productId = PRODUCT_ID_TJ;
            $serviceId = SERVICE_ID_TJ;
            $contentId = CONTENT_ID_TJ;
        }

        if (MasterManager::getAreaCode() == '207' && in_array(MasterManager::getEnterPosition(), $this->getShanXiOfflinePosition())) {
            $productId = PRODUCT_SHANXI_ID;
            $serviceId = SERVICE_SHANXI_ID;
            $contentId = CONTENT_SHANXI_ID;
        }

        if(MasterManager::getAreaCode() == '201' && in_array(MasterManager::getEnterPosition(), $this->getSmallBagPosition())){
            $productId = PRODUCT_ID_SMALL_BAG;
            $serviceId = SERVICE_ID_SMALL_BAG;
            $contentId = CONTENT_ID_SMALL_BAG;
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