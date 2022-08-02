<?php

namespace Home\Controller;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Common\TextUtils;
use Home\Model\Common\Utils;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Order\OrderManager;
use Home\Model\Order\PayRule;
use Home\Model\Resource\ResManager;
use Home\Model\Stats\StatManager;


class PayController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        // 判断是否是广东移动APK，且从融合包入口进入，如果是的话，需要修改路由，显示融合包计费页面
        if(CARRIER_ID == CARRIER_ID_GUANGDONGYD && MasterManager::getEnterFromYsten() == "1"){
            $pageConf = DisplayManager::getDisplayPage(__FILE__, array(
                MasterManager::getAreaCode()
            ));
            $pageConf['indexV1UI'] = "Pay/V" . CARRIER_ID . "/PayYsten";
            return $pageConf;
        }
        return DisplayManager::getDisplayPage(__FILE__, array(
            MasterManager::getAreaCode()
        ));
    }

    /**
     * 用户订购入口地址
     * 用例：所有地区
     */
    public function indexV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        $isJoint = parent::getFilter('isJointActivity', 0);

        LogUtils::info("[test] ---> MasterManager::getUserIsVip() : " .MasterManager::getUserIsVip()." isJoint:".$isJoint);
        if (MasterManager::getUserIsVip() && $isJoint != 1 && CARRIER_ID !== CARRIER_ID_QINGHAIDX_GAME) {
                // 如果用户已经是VIP，就直接返回
            if (MasterManager::getCarrierId() == '10220094') {
                $this->assign("isSuccess", "2");
                $this->display('Pay/V10220094/payResult');
            } else if (MasterManager::getCarrierId() == '440004') {
                $this->assign("isSuccess", "1");
                $this->display('Pay/V440004/payResult');
            } else {
                IntentManager::back();
            }
            return;
        }
        
        // 检测是否订购黑名单用户
        if(MasterManager::isOrderBlacklistUser() == 1) {
            LogUtils::debug("orderLimit,route other page... ...");
            $this->display("Pay/Common/orderLimit");
            return;
        }

        if (1 == MasterManager::isForbiddenOrder()) {
            // "您已受限订购该业务，暂时不能订购"
            $this->display('System/ForbidOrder');
            return;
        }
        $userId = parent::getFilter('userId', MasterManager::getUserId());

        $isPlaying = parent::getFilter('isPlaying', 0);
        $isIFramePay = parent::getFilter('isIFramePay', 0);
        if ($isPlaying == 1 && isset($_REQUEST["videoInfo"])) {
            $videoInfoArr = json_decode($_REQUEST["videoInfo"], true);
            MasterManager::setPlayParams($videoInfoArr);
        }

        // 清除cookie里订购结果记录, 目前活动才会使用该订购结果
        MasterManager::setOrderResult(0);

        //统计 - 上报页面访问
        StatManager::uploadAccessModule($userId);

        // 上报用户进入订购入的状态
        UserAPI::setUserStatus(1, 1);

        $areaCode = MasterManager::getAreaCode();
        $subAreaCode = MasterManager::getSubAreaCode();
        $orderPageRule = OrderManager::showPayPageRule($areaCode, $subAreaCode);
        if ($orderPageRule) {
            $this->assign("showRule", $orderPageRule);
        }

        if (OrderManager::isDirectPay($orderPageRule)) {
            // 直接进入局方订购页
            OrderManager::getInstance()->directToPay();
        } else {
            // 进入我方订购页
            $contentId = isset($_GET['contentId']) ? $_GET['contentId'] : null;
            $productId = defined("PRODUCT_ID") ? PRODUCT_ID : null; //计费套餐id

            // 是否为正在播放引起的订购
            $isPlaying = parent::getFilter('isPlaying', 0);
            if ($isPlaying == 1) {
                // 正在播放的视频信息
                $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : "";
            } else {
                $videoInfo = "";
            }

            // reason：订购来源（100 开通vip  101 活动购买 102播放视频购买 103视频问诊购买 104问诊记录购买 105健康检测记录购买 106续费vip）
            $orderReason = parent::getFilter('orderReason', 102);
            // remark：备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
            $remark = parent::getFilter('remark', null);
            // 返回页面名称
            $returnPageName = parent::getFilter('returnPageName');

            // 用于说明是否全部显示计费项，0 -- 表示全部显示，1 -- 只显示一个
            $isSinglePayItem = parent::getFilter('singlePayItem', 1);
            if (CARRIER_ID == CARRIER_ID_JIANGSUDX) {
                // 江苏电信EPG，要求放出所有计费项
                $isSinglePayItem = 0;
            }

            // 下面是在订购页停留的规则
            // $showRule = MasterManager::getPayPageRule();
            // $showRule = $showRule != null ? $showRule : "{}";

            $orderItems = OrderManager::getOrderItem($userId);

            // 订购说明
            $orderDesc = ResManager::getConstStringByAreaCode(null, "GLOBAL_TIP_ORDER_DESC");
            // 山东电信小包计费时，需要使用产品标识使用哪种产品，目前小包有三个产品包，对应有三个产品ID
            $packetType = parent::getFilter("packetType",0);
            $this->assign("packetType", $packetType);

            //渲染页面参数
            $this->assign("orderDescText", $orderDesc); // 自定义订购页面的底部说明文字
            $this->assign('orderItems', json_encode($orderItems));
            if(CARRIER_ID_GUANGDONGYD == CARRIER_ID) {
                $isEnterFromYsten = MasterManager::getEnterFromYsten();
                $this->assign("isEnterFromYsten", $isEnterFromYsten);
                if($isEnterFromYsten == '1'){
                    $productId = PRODUCT_ID_FOR_YST;
                }
            }
            $this->assign("isPlaying", $isPlaying);
            $this->assign("isSinglePayItem", $isSinglePayItem);
            $this->assign("orderReason", $orderReason);
            $this->assign("remark", $remark);
            $this->assign("returnPageName", $returnPageName);
            $this->assign("videoInfo", json_encode($videoInfo));
            // $this->assign("showRule", $showRule);
            $this->assign("contentId", $contentId);
            $this->assign("productId", $productId); //传递计费套餐id，用于前端鉴权。例如：吉林广电
            $this->assign("isIFramePay", $isIFramePay); //是否通过iframe加载订购页面

            if(CARRIER_ID == CARRIER_ID_JILIN_YD || CARRIER_ID == CARRIER_ID_JILINGDDX_MOFANG){
                $extraData = OrderManager::getInstance(MasterManager::getCarrierId())->payShow();
                if (isset($extraData) && !empty($extraData)) {
                    $this->assign("extraData", $extraData);
                }
            }

            // 移动平台使用咪咕sdk鉴权计费，需要调用接口获取产品相关信息配置
            if (in_array(MasterManager::getCarrierId(), [CARRIER_ID_QINGHAI_YD, CARRIER_ID_XIZANG_YD])) {
                $apkInfo = MasterManager::getApkInfo() ? MasterManager::getApkInfo() : new \stdClass();
                $authProductInfo = OrderManager::getInstance(MasterManager::getCarrierId())->authenticationEx();
                if (isset($authProductInfo) && !empty($authProductInfo)) {
                    $this->assign("authProductInfo", json_encode($authProductInfo));
                }
                $this->assign('apkInfo', $apkInfo);

                // 产品包配置信息，透传前端使用
                $payPackages = defined("PAY_PACKAGES") ? eval(PAY_PACKAGES) : [];
                $this->assign('payPackages', json_encode($payPackages));
            }

            // 获取inner参数 (0 -- 从局方的推荐位点击直接进入应用的具体模块；1 -- 应用内部其他推荐位点击进入)
            $inner = isset($_GET['inner']) ? $_GET['inner'] : 1;
            LogUtils::info("playerController::inner-->" . $inner . " Get inner-->" . $_GET['inner']);
            $this->assign('inner', $inner);

            if (CARRIER_ID == CARRIER_ID_GUIZHOUGD) {
                $html = "Pay/V520094/index";
                $this->display($html);
            }else if (CARRIER_ID == CARRIER_ID_JILINGD_MOFANG) {
                $html = "Pay/V10220094/index";
                $this->display($html);
            }else {
                $this->displayEx(__FUNCTION__);
            }
        }
        exit();
    }

    protected function getDisplayPageArray($config, $modelName)
    {
        $carrierId = empty(MasterManager::getCarrierId()) ? CARRIER_ID : MasterManager::getCarrierId();
        switch ($carrierId) {
            case CARRIER_ID_CHINAUNICOM:
                $areaCode = MasterManager::getAreaCode();
                if ($areaCode == "211") {
                    return array(
                        "searchOrderUI" => "Pay/V000051/V13/searchOrder",
                        "tempPayPageUI" => "Pay/V000051/V7/Index30Day",
                        "indexV1UI" => "Pay/V000051/V4/index",
                        "orderVipUI" => "Pay/V000051/OrderVip",
                        "hadOrderVipUI" => "Pay/V000051/HadOrderVip",
                        "unsubscribeVipUI" => "Pay/V000051/UnsubscribeVip",
                        "secondUnsubscribeVipUI" => "Pay/V000051/SecondUnsubscribe",
                        "unsubscribeResultUI" => "Pay/V000051/UnsubscribeResult",
                        "queryOrderProductListUI" => "Pay/V000051/QueryOrderProductList",
                        "payShowResultUI" => "Pay/V000051/V7/PayResult",
                    );
                } else if ($areaCode == "217") {
                    return array(
                        "searchOrderUI" => "Pay/V000051/V13/searchOrder",
                        "tempPayPageUI" => "Pay/V000051/V7/IndexTwo",
                        "indexV1UI" => "Pay/V000051/V5/index",
                        "orderVipUI" => "Pay/V000051/OrderVip",
                        "hadOrderVipUI" => "Pay/V000051/HadOrderVip",
                        "unsubscribeVipUI" => "Pay/V000051/UnsubscribeVip",
                        "secondUnsubscribeVipUI" => "Pay/V000051/SecondUnsubscribe",
                        "unsubscribeResultUI" => "Pay/V000051/UnsubscribeResult",
                        "queryOrderProductListUI" => "Pay/V000051/QueryOrderProductList",
                        "payShowResultUI" => "Pay/V000051/V7/PayResult",
                    );
                } else {
                    return parent::getDisplayPageArray($config, $modelName);
                }
                break;
            default:
                return parent::getDisplayPageArray($config, $modelName);
                break;
        }
    }

    /**
     * 需要通过post方式来调用局方订购页的，生成该地址来跳转进入局方页。
     * 用例：安徽电信EPG, 广东广电epg等
     */
    public function directPayUI()
    {
        $orderParam = parent::getFilter('orderParam', "", false);

        LogUtils::info("PayController::directPayUI() ---> " . $orderParam);

        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $orderParam = json_decode(rawurldecode($orderParam), true);

        $this->assign($orderParam);

        if(CARRIER_ID == CARRIER_ID_GUIZHOUDX){
            $this->assign('orderUrl',$orderParam['orderUrl']);
            $this->assign('providerId',$orderParam['providerId']);
            $this->assign('orderInfo',$orderParam['orderInfo']);
            $this->assign('returnUrl',$orderParam['returnUrl']);
            LogUtils::info("PayController::orderParam() ---> " . json_encode($orderParam));
        }
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 非VIP进入订购页
     * 用例：中国联通epg
     */
    public function orderVipUI()
    {
        $userId = parent::getFilter('userId');                      //用户id
        $isVip = parent::getFilter('isVip');
        $platformType = MasterManager::getPlatformType();
        $size = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;

        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        //渲染页面参数
        $this->assign('size', $size);
        $this->assign('time', time());
        $this->assign('platformType', $platformType);
        $this->assign('userId', $userId);
        $this->assign('isVip', $isVip);
        $this->assign('returnPageName', $_GET['returnPageName']);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * @Brief:此函数用于显示说明用户已经订购
     */
    public function hadOrderVipUI()
    {
        $userId = parent::getFilter('userId');                      //用户id
        $isVip = parent::getFilter('isVip');
        $platformType = MasterManager::getPlatformType();
        $size = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;

        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        //渲染页面参数
        $this->assign('size', $size);
        $this->assign('time', time());
        $this->assign('platformType', $platformType);
        $this->assign('userId', $userId);
        $this->assign('isVip', $isVip);
        $this->assign('returnPageName', $_GET['returnPageName']);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * VIP 进入退订页
     * 用例：中国联通EPG
     */
    public function unsubscribeVipUI()
    {
        $userId = parent::getFilter('userId');                      //用户id
        $platformType = MasterManager::getPlatformType();
        $size = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;

        $type = MasterManager::getPlatformTypeExt();
        if ($type == "hd_android") {
            $activeWidth = parent::getFilter('activeWidth');
            $activeHeight = parent::getFilter('activeHeight');
            $this->assign('activeWidth', $activeWidth);
            $this->assign('activeHeight', $activeHeight);
            $this->assign('isAndroid', 1);
        } else {
            $this->assign('isAndroid', 0);
            $this->assign('activeHeight', "");
        }

        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        //渲染页面参数
        $this->assign('size', $size);
        $this->assign('time', time());
        $this->assign('platformType', $platformType);
        $this->assign('userId', $userId);
        $this->assign('returnPageName', parent::getFilter('returnPageName'));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * VIP 进入二次确定退订页
     * 用例：中国联通EPG
     */
    public function secondUnsubscribeVipUI()
    {
        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $userId = $_GET['userId'];                      //用户id
        $platformType = MasterManager::getPlatformType();
        $size = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;

        $type = MasterManager::getPlatformTypeExt();
        if ($type == "hd_android") {
            $activeWidth = parent::getFilter('activeWidth');
            $activeHeight = parent::getFilter('activeHeight');
            if ($activeHeight == 1080 || $activeHeight == "1080P") {
                $this->assign('activeHeight', "1080");
            } else {
                $this->assign('activeHeight', "");
            }
            $this->assign('activeWidth', $activeWidth);
            $this->assign('isAndroid', 1);
        } else {
            $this->assign('isAndroid', 0);
            $this->assign('activeHeight', "");
        }

        //渲染页面参数
        $this->assign('size', $size);
        $this->assign('time', time());
        $this->assign('platformType', $platformType);
        $this->assign('userId', $userId);
        $this->assign('carrierId', MasterManager::getCarrierId());
        $this->assign('returnPageName', parent::getFilter('returnPageName'));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 退订结果页
     * 用例：中国联通EPG
     */
    public function unsubscribeResultUI()
    {
        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $userId = parent::getFilter('userId'); //用户id
        $platformType = MasterManager::getPlatformType();
        $size = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;

        $type = MasterManager::getPlatformTypeExt();
        if ($type == "hd_android") {
            $activeWidth = parent::getFilter('activeWidth');
            $activeHeight = parent::getFilter('activeHeight');
            if ($activeHeight == 1080 || $activeHeight == "1080P") {
                $this->assign('activeHeight', "1080");
            } else {
                $this->assign('activeHeight', "");
            }
            $this->assign('activeWidth', $activeWidth);
            $this->assign('isAndroid', 1);
        } else {
            $this->assign('isAndroid', 0);
            $this->assign('activeHeight', "");
        }

        //渲染页面参数
        $this->assign('size', $size);
        $this->assign('time', time());
        $this->assign('platformType', $platformType);
        $this->assign('userId', $userId);
        $this->assign('carrierId', MasterManager::getCarrierId());
        $this->assign('returnPageName', parent::getFilter('returnPageName'));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 订购结果显示界面
     * 用例：中国联通EPG
     */
    public function payShowResultUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $orderParam = isset($_REQUEST['orderParam']) ? $_REQUEST['orderParam'] : "";
        if (MasterManager::getCarrierId() == CARRIER_ID_JILINGD) {
            if (is_object(json_decode($orderParam))) $orderParam = json_encode(json_decode($orderParam));
            else if (is_array(json_decode($orderParam, true))) $orderParam = json_encode(json_decode($orderParam, true));
        }

        $this->assign("isSuccess", parent::getFilter("isSuccess"));
        $this->assign("payAction", parent::getFilter("payAction", "1"));
        $this->assign("payResult", isset($_REQUEST['payResult']) ? $_REQUEST['payResult'] : "");
        $this->assign("orderParam", $orderParam);
        $this->assign("orderId", isset($_REQUEST['orderId']) ? $_REQUEST['orderId'] : "");
        $this->assign("productId", defined("PRODUCT_ID") ? PRODUCT_ID : ""); // 传递计费套餐id，用于前端鉴权。例如：吉林广电

        LogUtils::info("payResultUI ---> assign orderParam : " . $orderParam);
        LogUtils::info("payResultUI ---> _REQUEST : " . json_encode($_REQUEST));
        LogUtils::info("payResultUI ---> indexUI url : " . 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 订购信息显示页
     */
    public function payInfoUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 获取订购项
        $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());

        $vipInfo = UserAPI::queryVipInfo(MasterManager::getUserId());

        $productId = defined("PRODUCT_ID") ? PRODUCT_ID : null; //计费套餐id

        $this->assign("vipInfo", json_encode($vipInfo));
        $this->assign("orderItems", json_encode($orderItems));
        $this->assign("productId", $productId);


        $this->displayEx(__FUNCTION__);
    }

    /**
     * @Brief:此函数用于进行展示已经订购的商品
     */
    public function queryOrderProductListUI()
    {
        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $platformType = MasterManager::getPlatformType();
        $size = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;
        $this->assign('size', $size);
        $this->assign('time', time());
        $this->assign('platformType', $platformType);
        $this->assign("commonImgsView", COMMON_IMGS_VIEW);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * @Brief:此函数用于进行展示已经订购的商品
     */
    public function submitPhoneUI()
    {
        $payBackUrl = isset($_REQUEST['payBackUrl']) ? $_REQUEST['payBackUrl'] : "";
        $orderId = isset($_REQUEST['orderId']) ? $_REQUEST['orderId'] : "";
        $platformType = MasterManager::getPlatformType();
        $size = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;
        $this->assign('size', $size);
        $this->assign('payBackUrl', $payBackUrl);
        $this->assign('orderId', $orderId);
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 订购结果回调页
     * 用例：所有地区，
     */
    public function payCallbackUI()
    {
        LogUtils::info("payCallbackUI ---> indexUI url : " . 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
        $carrierId = parent::getFilter('lmcid', CARRIER_ID);
        OrderManager::getInstance($carrierId)->payCallback();
    }

    /**
     * 订购结果异步回调页
     * 用例：所有地区，
     */
    public function asyncCallBackUI()
    {
        LogUtils::info("asyncCallBackUI ---> indexUI url : " . 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
        $carrierId = parent::getFilter('lmcid', CARRIER_ID);
        OrderManager::getInstance($carrierId)->asyncPayCallback();
    }

    /**
     * 退订结果回调页
     * 用例：中国联通EPG
     */
    public function unPayCallbackUI()
    {
        OrderManager::getInstance()->unPayCallback();
    }

    /**
     * @Brief:此函数用于中国联通EPG--贵州地区联合活动计费入口
     * @param: $contentId sp的内容id
     * @param: $returnUrl 返回url
     */
    public function jointActivityPayEntryUI()
    {
        $orderInfo = new \stdClass();
        $orderInfo->isJointActivity = parent::getFilter('isJointActivity', 0); // 是否联合活动发起订购
        $orderInfo->contentId = parent::getFilter('contentId', CONTENT_ID);
        $orderInfo->isPlaying = parent::getFilter('isPlaying', 0);
        $orderInfo->videoInfo = parent::getFilter('videoInfo');
        $orderInfo->remark = parent::getFilter('remark', null);
        $orderInfo->orderReason = ($orderInfo->contentId == CONTENT_ID) ? 111 : 112;
        $orderInfo->isSinglePayItem = parent::getFilter('singlePayItem', 0);
        $orderInfo->returnPageName = parent::getFilter('returnPageName');
        OrderManager::getInstance()->directToPay($orderInfo);
    }

    /**
     * 查询及退订
     */
    public function searchOrderUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        $platformType = MasterManager::getPlatformType();
        $size = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;
        $this->assign('size', $size);
        $this->assign('time', time());
        $this->assign('platformType', $platformType);
        $this->assign("commonImgsView", COMMON_IMGS_VIEW);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * @Brief:此函数用于中国联通（湖北、黑龙江地区）的临时计费页，当用户在计费页上选择计费项后，就直接跳转到局方的计费页
     */
    public function tempPayPageUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        $orderParam = parent::getFilter('orderParam', "", false);

        //拉取订购项
        $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("PayController::tempPayPageUI ---> orderItems is empty");
            IntentManager::back();
            exit();
        }

        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        LogUtils::info("PayController::tempPayPageUI() ---> " . $orderParam);

        $orderParam = json_decode(rawurldecode($orderParam), true);

        $this->assign($orderParam);
        $this->assign("orderItems", json_encode($orderItems));
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 童锁支付回调页
     */
    public function payLockVerifyResultUI()
    {
        // 童锁校验回调页
        $orderParam = parent::getFilter('orderParam', "", false);
        $flag = parent::getFilter('flag', "", false);
        $orderParam = json_decode($orderParam);


        if ($flag == "success") {
            if (!empty($orderParam->payUrl)) {
                header("location:" . $orderParam->payUrl);
                return;
            }

            $instance = OrderManager::getInstance();
            $payResult = $instance->buildOderUrlAndPayEx($orderParam);

            //跳转到结果显示页
            $intent = IntentManager::createIntent("payShowResult");
            $intent->setParam("payResult", json_encode($payResult));
            $intent->setParam("orderParam", json_encode($orderParam));
            $url = IntentManager::intentToURL($intent);
            header("location:" . $url);
        } else {
            IntentManager::back($orderParam->returnPageName);
        }
    }

    /**
     * 统一认证回调地址也
     */
    public function payUnifiedAuthResultUI()
    {
        $productId = parent::getFilter('product_id', "", false);
        $productName = parent::getFilter('product_name', "", false);
        $productPrice = parent::getFilter('product_price', "", false);
        $productType = parent::getFilter('product_type', "", false);
        $accountId = parent::getFilter('account_id', "", false);
        $callbackAddress = parent::getFilter('callback_address', "", false);
        $clientId = parent::getFilter('client_id', "", false);
        $authNo = parent::getFilter('auth_no', "", false);
        $token = parent::getFilter('token', "", false);

        $returnPageName = parent::getFilter('returnPageName', "", false);
        $flag = parent::getFilter('flag', "", false);
        $orderParam = parent::getFilter('orderParam', "", false);

        $orderParam = json_decode($orderParam);
        $orderParam->authNo = $authNo;
        $orderParam->unifyToken = $token;
        $orderParam->returnPageName = $returnPageName;

        if ($flag == "confirm") {
            $instance = OrderManager::getInstance();     // 获取订购对象
            // 判断河南童锁是否进入
            if (MasterManager::isShowPayLock() == 1) {
                if (MasterManager::getAreaCode() == '204') {
                    $productIdEx = PRODUCT_ID . "@" . MasterManager::getAreaCode();
                    $lockStatus = $instance->querySafeLockStatus(MasterManager::getAccountId(), $productIdEx);
                    if ($lockStatus == 1) {
                        //河南省 先调用童锁校验地址
                        $productInfo = new \stdClass();
                        $productInfo->price = $productPrice;
                        $verifyUrl = $instance->buildPayLockVerifyUrl($orderParam);
                        header("location:" . $verifyUrl);
                        return;
                    }
                }
            }
            // 构建地址并订购
            $instance = OrderManager::getInstance();
            $payResult = $instance->buildOderUrlAndPayEx($orderParam);

            //跳转到结果显示页
            $intent = IntentManager::createIntent("payShowResult");
            $intent->setParam("payResult", json_encode($payResult));
            $intent->setParam("orderParam", json_encode($orderParam));
            $url = IntentManager::intentToURL($intent);
            header("location:" . $url);
        } else {
            IntentManager::back($returnPageName);
        }
    }

    /**
     * 食乐汇EPG,启生魔方EPG促订的时候需要使用订购页的截图页面
     */
    public function fakeOrderV1UI(){
        // 渲染通用参数
        $render = $this->initCommonRender();
        $orderManager = OrderManager::getInstance(CARRIER_ID);
        $orderPageUrl = $orderManager->buildDirectPayUrl();
        LogUtils::info('orderPageUrl --' . $orderPageUrl);
        $requestData = array(
            "userId" => $render['userId'],
            "resourceUrl" => RESOURCES_URL,
            "covertUrl" => $orderPageUrl,
        );
        $requestUrl = "http://127.0.0.1:30203/covert";
        $covertResult = HttpManager::httpRequest("POST", $requestUrl, json_encode($requestData));
        LogUtils::info('coverResult --' . $covertResult);
        $result = json_decode($covertResult);
        $this->assign('orderImagePath', $result->imageUrl);

        $this->displayEx(__FUNCTION__);
    }
}