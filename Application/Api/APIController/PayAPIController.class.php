<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/8/7
 * Time: 下午4:05
 */

namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\DoctorP2PRecordAPI;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SystemManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Order\OrderManager;
use Home\Model\Order\Pay000006;
use Home\Model\Order\Pay000051;
use Home\Model\Order\Pay05001110;
use Home\Model\Order\Pay10000051;
use Home\Model\Order\Pay10220095;
use Home\Model\Order\Pay11000051;
use Home\Model\Order\Pay13000051;
use Home\Model\Order\Pay220001;
use Home\Model\Order\Pay370092;
use Home\Model\Order\Pay430002;
use Home\Model\Order\Pay620007;
use Home\Model\Page\PageManager;
use Home\Model\User\UserManager;

class PayAPIController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return void 返回页面配置数组
     */
    public function config()
    {
        // TODO: Implement config() method.
    }

    /**
     * 构建订购回调返回地址，由前端页面调用
     */
    public function buildPayCallbackUrlAction()
    {
        $payInfo = null;
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_JILINGD:
            case CARRIER_ID_JILINGD_MOFANG:
                $payInfo = new \stdClass();
                $payInfo->lmuid = MasterManager::getUserId();
                $payInfo->lmcid = MasterManager::getCarrierId();
                $payInfo->lmVipId = $_REQUEST["lmVipId"];                       //管理后台配置的套餐生成的id，用于我方标识
                $payInfo->lmVipType = $_REQUEST["lmVipType"];                   //管理后台配置的套餐类型（单次1/包月2），用于我方标识
                $payInfo->lmTradeNo = $_REQUEST["lmTradeNo"];                   //在我方生成的订单号
                $payInfo->lmReason = $_REQUEST["lmReason"];                     //订购理由
                $payInfo->lmRemark = $_REQUEST["lmRemark"];                     //备注
                $payInfo->lmIsPlaying = $_REQUEST["lmIsPlaying"];               //是否正在播放
                $payInfo->lmVideoInfo = $_REQUEST["lmVideoInfo"];               //正在播放的视频信息
                $payInfo->lmReturnPageName = $_REQUEST["lmReturnPageName"];
                break;
            default:
                break;
        }

        // 构建订购回调通知地址并返回
        $data = OrderManager::getInstance()->buildPayCallbackUrl($payInfo);

        $this->ajaxReturn($data, "EVAL");
    }


    /**
     * 上报订购成功的订购信息到cws后台，由前端页面调用
     */
    public function uploadPayResultAction()
    {
        $uploadPayInfo = null;
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_JILINGD:
            case CARRIER_ID_JILINGD_MOFANG:
            case CARRIER_ID_JILINGDDX:
                $uploadPayInfo = $this->_getUploadData4JL();
                $uploadPayInfo->oPayTime = $_REQUEST["payTime"];                      //局方：支付时间
                $uploadPayInfo->oEndTime = $_REQUEST["endTime"];                      //局方：结束时间
                break;
            case CARRIER_ID_JILINGDDX_MOFANG:
                $uploadPayInfo = $this->_getUploadData4JL();
                $orderInstance = new Pay10220095();
                $authResult = $orderInstance->getAuthResult();
                if ($authResult["result"] == 0) {
                    $uploadPayInfo->oPayTime = date("Y-m-d H:i:s", time());
                    $uploadPayInfo->oEndTime = $authResult['expiredTime'];
                } else {
                    $uploadPayInfo->oPayTime = date("Y-m-d H:i:s", time());
                    $uploadPayInfo->oEndTime = "";
                }
                break;
            case CARRIER_ID_HUNANYX:
            case CARRIER_ID_HUNANDX:
            case CARRIER_ID_ZHEJIANG_HUASHU:
                $uploadPayInfo = new \stdClass();
                $uploadPayInfo->lmuid = MasterManager::getUserId();
                $uploadPayInfo->lmcid = MasterManager::getCarrierId();
                $uploadPayInfo->lmTradeNo = $_REQUEST["tradeNo"]; //在我方生成的订单号
                $uploadPayInfo->isPlaying = $_REQUEST["isPlaying"]; //在我方生成的订单号
                $uploadPayInfo->lmReason = $_REQUEST["orderReason"]; //在我方生成的订单号
                break;
            case CARRIER_ID_SHANXIDX:
            case CARRIER_ID_NEIMENGGU_DX:
                $uploadPayInfo = new \stdClass();
                $uploadPayInfo->lmuid = MasterManager::getUserId();
                $uploadPayInfo->lmcid = MasterManager::getCarrierId();
                $uploadPayInfo->TradeNo = $_REQUEST["tradeNo"]; //在我方生成的订单号
                $uploadPayInfo->isPlaying = $_REQUEST["isPlaying"]; //在我方生成的订单号
                $uploadPayInfo->lmreason = $_REQUEST["lmreason"]; //在我方生成的订单号
                $uploadPayInfo->orderType = $_REQUEST["orderType"]; //订购类型
                break;
            case CARRIER_ID_GANSUYD:
            case CARRIER_ID_WEILAITV_TOUCH_DEVICE:
                $uploadPayInfo = new \stdClass();
                $uploadPayInfo->lmuid = MasterManager::getUserId();
                $uploadPayInfo->lmcid = MasterManager::getCarrierId();
                $uploadPayInfo->tradeNo = $_REQUEST["lmOrderId"]; //在我方生成的订单号
                $uploadPayInfo->orderType = $_REQUEST["lmVipType"];
                break;
            case CARRIER_ID_GUANGXI_YD:
            case CARRIER_ID_GUANGXI_YD_YIBAN:
            case CARRIER_ID_YB_HEALTH_UNIFIED:
                $uploadPayInfo = new \stdClass();
                $uploadPayInfo->lmuid = MasterManager::getUserId();
                $uploadPayInfo->lmcid = MasterManager::getCarrierId();
                $uploadPayInfo->accountId = MasterManager::getAccountId();
                $uploadPayInfo->isSuccess = $_POST["isSuccess"] ? $_POST["isSuccess"] : "";
                $uploadPayInfo->contentId = $_POST["contentId"] ? $_POST["contentId"] : "";
                $uploadPayInfo->vip_id = $_POST["vip_id"] ? $_POST["vip_id"] : "";
                break;
            case CARRIER_ID_JIANGSUDX_OTT:
                $uploadPayInfo = new \stdClass();
                $uploadPayInfo->lmuid = MasterManager::getUserId();
                $uploadPayInfo->lmcid = MasterManager::getCarrierId();
                $uploadPayInfo->accountId = MasterManager::getAccountId();
                $uploadPayInfo->result = $_POST["result"] ? $_POST["result"] : "";
                $uploadPayInfo->transactionid = $_POST["tradeNo"] ? $_POST["tradeNo"] : "";
                $uploadPayInfo->msg = $_POST["msg"] ? $_POST["msg"] : "";
                $uploadPayInfo->timestamp = $_POST["timestamp"] ? $_POST["timestamp"] : "";
                break;
            default:
                break;
        }

        // 构建订购回调通知地址并返回
        $data = OrderManager::getInstance()->uploadPayResult($uploadPayInfo);

        $this->ajaxReturn($data, "EVAL");
    }

    private function _getUploadData4JL()
    {
        $uploadPayInfo = new \stdClass();
        // lmXXX: longmasterXXX，表示朗玛39方的参数
        $uploadPayInfo->lmuid = MasterManager::getUserId();
        $uploadPayInfo->lmcid = CARRIER_ID;
        $uploadPayInfo->lmVipId = $_REQUEST["lmVipId"];                       //管理后台配置的套餐生成的id，用于我方标识
        $uploadPayInfo->lmVipType = $_REQUEST["lmVipType"];                   //管理后台配置的套餐类型（单次1/包月2），用于我方标识
        $uploadPayInfo->lmTradeNo = $_REQUEST["lmTradeNo"];                   //在我方生成的订单号
        $uploadPayInfo->lmreason = $_REQUEST["lmReason"];                     //订购理由
        $uploadPayInfo->lmRemark = $_REQUEST["lmRemark"];                     //备注
        $uploadPayInfo->lmIsPlaying = $_REQUEST["lmIsPlaying"];               //是否正在播放
        $uploadPayInfo->lmVideoInfo = $_REQUEST["lmVideoInfo"];               //正在播放的视频信息
        $uploadPayInfo->lmReturnPageName = $_REQUEST["lmReturnPageName"];
        // oXXX: otherXXX，表示其他第三方的参数
        $uploadPayInfo->oContentName = $_REQUEST["contentName"];              //局方：套餐名称 (命名oXXX otherXXX)
        $uploadPayInfo->oRenew = $_REQUEST["renew"];                          //局方：续订状态: 0-单月 1-连续包月 2-连续包月（已经取消续订）
        $uploadPayInfo->oPrice = $_REQUEST["price"];                          //局方：价格（分）
        $uploadPayInfo->oPayType = $_REQUEST["payType"];                      //局方：支付类型 1:移动话费2:联通话费3:电信话费4:支付宝5:微信6:未知7:宽带支付8:零元支付
        return $uploadPayInfo;
    }

    /**
     * 构建订购地址
     */
    public function buildPayUrlAction()
    {
        LogUtils::info("[PayAPIController.class.php ]::buildPayUrlAction() --->：");
        $payInfo = "";
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_NINGXIAGD: // 中国联通EPG
            case CARRIER_ID_CHINAUNICOM: // 中国联通EPG
            case CARRIER_ID_JIANGSUDX:   //江苏电信EPG，江苏电信目前都不走我方订购页记进行订购
            case CARRIER_ID_GUANGDONGGD:  //广州广电epg，其实是获取订购的参数，然后在页面上使用post请求
            case CARRIER_ID_GUANGDONGGD_NEW:  //广州广电epg，其实是获取订购的参数，然后在页面上使用post请求
            case CARRIER_ID_FUJIANDX:       // 福建电信EPG
            case CARRIER_ID_HUBEIDX:       // 湖北电信EPG
            case CARRIER_ID_HAINANDX:       // 海南电信EPG
            case CARRIER_ID_NINGXIADX:      // 宁夏电信EPG
            case CARRIER_ID_NINGXIADX_MOFANG:      // 宁夏电信EPG
            case CARRIER_ID_SHANXIDX:      // 陕西电信EPG
            case CARRIER_ID_GUANGXIDX:      // 广西电信EPG
            case CARRIER_ID_JIANGXIDX:      // 江西电信EPG
            case CARRIER_ID_HENANDX:        // 河南电信EPG
                $payInfo = $this->createCommonPayInfo();
                $payInfo->devNo = $_POST['devNo'];                  // 智能卡号
                $payInfo->isIFramePay = $_POST['isIFramePay'];    // 是否为iframe加载计费页 (0--不是，1--是)
                break;
            case CARRIER_ID_GUANGXIGD:
            case CARRIER_ID_XINJIANGDX:
            case CARRIER_ID_XINJIANGDX_TTJS:
                $payInfo = array(
                    "vipId" => $_POST['vip_id'],
                    "vipType" => $_POST['vip_type'],
                    "productId" => $_POST['product_id'],
                    "isPlaying" => $_POST['isPlaying'],
                    "orderReason" => $_POST['orderReason'],
                    "remark" => $_POST['remark'],
                    "returnPageName" => $_POST['returnPageName'],
                );
                if (MasterManager::getCarrierId() == CARRIER_ID_GUANGXIGD) {
                    $toDay = date('Y-m-d');
                    if ($toDay >= "2020-07-25" && $toDay < "2020-08-24") {
                        $data = OrderManager::getInstance()->activitybuildPayUrl($payInfo);
                        $this->ajaxReturn($data, "EVAL");
                        return;
                    }
                }
                break;
            case CARRIER_ID_GUIZHOUGD: //贵州广电没有什么特殊参数
            case CARRIER_ID_SHANDONGDX: // 山东电信
            case CARRIER_ID_SHANDONGDX_APK: // 山东电信
            case CARRIER_ID_HAIKAN_APK: // 山东电信
                $payInfo = $this->createCommonPayInfo();
                $payInfo->price = $_POST['price'];                    // 价格
                $payInfo->packetType = $_POST["packetType"];              // 产品标识
                break;
            case CARRIER_ID_CHINAUNICOM_MEETLIFE: //遇见生活
            case CARRIER_ID_MANGOTV_LT: //湖南联通芒果TV
            case CARRIER_ID_CHONGQINGDX: //重庆电信EPG
            case CARRIER_ID_GUIZHOUDX:
            case CARRIER_ID_SHANDONGDX_HAIKAN:
            case CARRIER_ID_JIANGSUDX_YUEME:
            case CARRIER_ID_GUANGXIGD_APK:
            case CARRIER_ID_GUANGXI_YD:
            case CARRIER_ID_ZHEJIANG_HUASHU:
            case CARRIER_ID_JIANGXIYD:
            case CARRIER_ID_ANHUIYD_YIBAN:
                $payInfo = $this->createCommonPayInfo();
                break;
            case CARRIER_ID_HUNANDX:
            case CARRIER_ID_CHINAUNICOM_APK:
            case CARRIER_ID_CHINAUNICOM_MOFANG_APK:
                $payInfo = new \stdClass();
                $payInfo->userId = MasterManager::getUserId();
                $payInfo->carrierId = MasterManager::getCarrierId();
                $payInfo->vip_id = $_POST['vip_id'];                  // 后台配置的vip_id
                $payInfo->vip_type = $_POST['vip_type'];              // 后台配置的vip_type,用户判断是单次还是包月
                $payInfo->price = $_POST['price'];                    // 价格
                $payInfo->isPlaying = $_POST['isPlaying'];            // 是否正在播放，后续可以改为直接传递播放的视频信息
                $payInfo->orderReason = $_POST['orderReason'];        // 订购原因
                $payInfo->remark = $_POST['remark'];                  // 订购标记
                break;
            case CARRIER_ID_NEIMENGGU_DX:
            case CARRIER_ID_GUANGDONGYD:
            case CARRIER_ID_CHINAUNICOM_OTT:
                $payInfo = $this->createCommonPayInfo();
                $payInfo->contentId = isset($_POST['contentId']) ? $_POST['contentId'] : null;
                $payInfo->selectedProductNum = $_POST['selectedProductNum'];  // 选择的产品，有两个产品
                $payInfo->description = $_POST["description"];          // 产品标识
                $payInfo->amount = $_POST['amount'];                    // 订购价格
                $payInfo->userId = isset($_POST['userId']) ? $_POST['userId'] : MasterManager::getAccountId();
                $payInfo->orderType = 1;                                 // 1：按时段订购 2：按次订购
                break;
            //case CARRIER_ID_GANSUYD:
            //    $payInfo = $this->createCommonPayInfo();
            //    $payInfo->payType = $_POST['pay_type'];               // 订购类型
            //    break;
            case CARRIER_ID_HUNANYX:
                $payInfo = $this->createCommonPayInfo();
                $payInfo->productNo = $_POST["productNo"];
                $payInfo->productCode = $_POST["productCode"];
                $payInfo->productName = $_POST["productName"];
                break;
            case CARRIER_ID_GANSUYD:
            case CARRIER_ID_NINGXIA_YD:
            case CARRIER_ID_HEILONGJIANG_YD:
                $payInfo = array(
                    'lmuid' => MasterManager::getUserId(),
                    'lmcid' => MasterManager::getCarrierId(),
                    'lmVipId' => $_POST['lmVipId'],                     // 后台配置的vip_id
                    'lmVipType' => $_POST['lmVipType'],                 // 后台配置的vip_type,用户判断是单次还是包月
                    'lmOrderReason' => $_POST['lmOrderReason'],         // 订购原因
                    'lmRemark' => $_POST['lmRemark'],                   // 订购备注标记
                );
                break;
            case CARRIER_ID_JIANGSUDX_OTT:
            case CARRIER_ID_GUANGXI_YD_YIBAN:
            case CARRIER_ID_YB_HEALTH_UNIFIED:
                $payInfo = array();
                break;
            default:
                break;
        }
        // 构建订购地址（或者订购参数）并返回
        $data = OrderManager::getInstance()->buildPayUrl($payInfo);

        $this->ajaxReturn($data, "EVAL");
    }

    /**
     * 创建公用信息实体类
     *
     * @return \stdClass 信息实体类
     */
    private function createCommonPayInfo()
    {
        $payInfo = new \stdClass();
        $payInfo->userId = MasterManager::getUserId();
        $payInfo->carrierId = MasterManager::getCarrierId();
        $payInfo->vip_id = $_POST['vip_id'];                  // 后台配置的vip_id
        $payInfo->vip_type = $_POST['vip_type'];              // 后台配置的vip_type,用户判断是单次还是包月
        $payInfo->price = $_POST['price'];                    // 价格（单位分）
        $payInfo->product_id = $_POST['product_id'];          // 产品ID
        $payInfo->isPlaying = $_POST['isPlaying'];            // 是否正在播放，后续可以改为直接传递播放的视频信息
        $payInfo->orderReason = $_POST['orderReason'];        // 订购原因
        $payInfo->remark = $_POST['remark'];                  // 订购标记
        $payInfo->returnPageName = $_POST['returnPageName'];  // 返回页面名称，也可能定义为返回页面的Intent对象
        $payInfo->videoInfo = $_POST['videoInfo'];
        return $payInfo;
    }

    /**
     * 构建订购地址
     */
    public function buildPayUrlExAction()
    {

        $vipId = isset($_POST['vip_id']) ? $_POST['vip_id'] : '17';
        $vipType = isset($_POST['vip_type']) ? $_POST['vip_type'] : '';
        $productId = isset($_POST['product_id']) ? $_POST['product_id'] : 1;        // 订购项的编号（1 -- 第一个订购项， 2 -- 第二个订购项）
        $contentId = isset($_POST['contentId']) ? $_POST['contentId'] : '';        // 订购项的编号（1 -- 第一个订购项， 2 -- 第二个订购项）
        $userId = isset($_POST['userId']) ? $_POST['userId'] : MasterManager::getAccountId();        // 订购项的编号（1 -- 第一个订购项， 2 -- 第二个订购项）
        $isPlaying = isset($_POST['isPlaying']) ? $_POST['isPlaying'] : "0";        // 订购项的编号（1 -- 第一个订购项， 2 -- 第二个订购项）
        $orderReason = isset($_POST['orderReason']) ? $_POST['orderReason'] : '100';
        $remark = isset($_POST['remark']) ? $_POST['remark'] : '';
        $price = isset($_POST['price']) ? $_POST['price'] : 0;
        $videoInfo = isset($_POST['videoInfo']) && $_POST['videoInfo'] != "\"\"" ? $_POST['videoInfo'] : "";

        $payInfo = $payInfo = new \stdClass();
        $payInfo->vipId = $vipId;
        $payInfo->vipType = $vipType;
        $payInfo->productId = $productId;          // 产品ID
        $payInfo->contentId = $contentId;
        $payInfo->userId = $userId;
        $payInfo->isPlaying = $isPlaying;
        $payInfo->orderReason = $orderReason;        // 订购原因
        $payInfo->remark = $remark;
        $payInfo->price = $price;
        $payInfo->videoInfo = $videoInfo;

        $payResult = OrderManager::getInstance()->buildPayUrlEx($payInfo);

        $this->ajaxReturn($payResult, "EVAL");
    }

    /**
     * 构建退订地址
     */
    public function buildUnPayUrlAction()
    {
        $payInfo = "";
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_CHINAUNICOM:
                // 中国联通EPG
                $payInfo = new \stdClass();
                $payInfo->userId = MasterManager::getUserId();
                $payInfo->carrierId = MasterManager::getCarrierId();
                $payInfo->vip_id = $_POST['vip_id'];                  // 后台配置的vip_id
                $payInfo->product_id = $_POST['product_id'];          // 产品ID
                $payInfo->orderReason = $_POST['orderReason'];        // 订购原因
                $payInfo->remark = $_POST['remark'];                  // 订购标记
                $payInfo->returnPageName = $_POST['returnPageName'];  // 返回页面名称，也可能定义为返回页面的Intent对象
                break;
            case CARRIER_ID_NINGXIAGD:
                // 中国联通EPG
                $payInfo = new \stdClass();
                $payInfo->userId = MasterManager::getUserId();
                $payInfo->carrierId = MasterManager::getCarrierId();
                $payInfo->vip_id = $_POST['vip_id'];                  // 后台配置的vip_id
                $payInfo->product_id = $_POST['product_id'];          // 产品ID
                $payInfo->orderReason = $_POST['orderReason'];        // 订购原因
                $payInfo->remark = $_POST['remark'];                  // 订购标记
                $payInfo->returnPageName = $_POST['returnPageName'];  // 返回页面名称，也可能定义为返回页面的Intent对象
                break;
            case CARRIER_ID_GUIZHOUDX:
                $payInfo = $this->createCommonPayInfo();
                break;
            default:
                break;
        }

        // 构建订购地址并返回
        $data = OrderManager::getInstance()->buildUnPayUrl($payInfo);

        $this->ajaxReturn($data, "EVAL");
    }

    /**
     * 山东联通
     * 订购完成后，上报订购结果到服务器
     * @throws \Think\Exception
     */
    public function uploadOrderResult370093Action()
    {
        $userId = $_POST['userId'];
        $customerId = $_POST['customerId'];

        $orderInfo = array(
            'userId' => $userId,
            'customerId' => $customerId,
            'tradeNo' => $_POST['tradeNo'],
            'result' => $_POST['result'],
            'errCode' => $_POST['errCode'],
            'orderId' => $_POST['orderId'],
            'productId' => $_POST['productId'],
            'productIdThird' => $_POST['productIdThird'],
            'productName' => $_POST['productName'],
            'contentId' => $_POST['contentId'],
            'contentName' => $_POST['contentName'],
            'price' => $_POST['price'],
            'status' => $_POST['status'],
            'payTime' => $_POST['payTime'],
            'endTime' => $_POST['endTime'],
            'payType' => $_POST['payType'],
            'renew' => $_POST['renew'],
        );

        LogUtils::info("uploadOrderResult370093Action ---> orderInfo : "
            . "|" . $orderInfo['userId']
            . "|" . $orderInfo['usecustomerIdrId']
            . "|" . $orderInfo['tradeNo']
            . "|" . $orderInfo['result']
            . "|" . $orderInfo['errCode']
            . "|" . $orderInfo['orderId']
            . "|" . $orderInfo['productId']
            . "|" . $orderInfo['productIdThird']
            . "|" . $orderInfo['productName']
            . "|" . $orderInfo['contentId']
            . "|" . $orderInfo['contentName']
            . "|" . $orderInfo['price']
            . "|" . $orderInfo['status']
            . "|" . $orderInfo['payTime']
            . "|" . $orderInfo['endTime']
            . "|" . $orderInfo['payType']
            . "|" . $orderInfo['renew']
        );

        $result = PayAPI::postPayResultBy370093($userId, $orderInfo);

        //查询一下VIP状态，缓存到Session中
        $isVip = UserManager::isVip($userId);
        MasterManager::setUserIsVip($isVip);

        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 页面获取订单号
     */
    public function getOrderTradeNoAction()
    {
        $orderItemId = isset($_REQUEST['orderItemId']) ? $_REQUEST['orderItemId'] : '';
        $orderReason = isset($_REQUEST['orderReason']) && $_REQUEST['orderReason'] != '' ? $_REQUEST['orderReason'] : 100;
        $orderRemark = isset($_REQUEST['orderRemark']) && $_REQUEST['orderRemark'] != '' ? $_REQUEST['orderRemark'] : 'PayPage';
        $orderType = isset($_REQUEST['orderType']) && $_REQUEST['orderType'] != '' ? $_REQUEST['orderType'] : 1;

        $result = OrderManager::createPayTradeNo($orderItemId, $orderReason, $orderRemark, null, $orderType);
        $ret = json_encode(array(
            'result' => $result->result,
            'tradeNo' => $result->order_id,
        ));
        MasterManager::setUserOrderId($result->order_id);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 页面获取支付结果
     */
    public function getOrderPayResultAction()
    {
        //获取参是
        $userId = isset($_REQUEST['userId']) ? $_REQUEST['userId'] : '';
        $orderId = isset($_REQUEST['order_id']) ? $_REQUEST['order_id'] : '';
        $result = PayAPI::queryOrderPayResult($userId, $orderId);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 构建订购地址并返回
     */
    public function getOrderUrlAction()
    {
        // 默认空订购参数数组
        $paramArr = array(
            "returnUrl" => "",
            "orderReason" => "100",
            "remark" => "",
            "isSinglePayItem" => 0, //显示计费个数 0--显示全部  1--显示单个
            "isPlaying" => 0, //1视频播放过程中订购，0：非视频播放过程中
        );

        // 根据不同地区构建订购地址参数获取
        $paramArrTemp = null;
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_CHINAUNICOM:
                $paramArrTemp = $this->parseOrderUrlParam000051();
                break;
            case CARRIER_ID_NINGXIAGD:
                $paramArrTemp = $this->parseOrderUrlParam000051();
                break;
            case CARRIER_ID_GUANGXIDX:
                $paramArrTemp = $this->parseOrderUrlParam450092();
                break;
            case CARRIER_ID_GUANGXIGD:
                $paramArrTemp = $this->parseOrderUrlParam450094();
                break;
            case CARRIER_ID_NINGXIADX:
                $paramArrTemp = $this->parseOrderUrlParam640092();
                break;
            default:
                $paramArrTemp = null;
                break;
        }

        // 构建订购地址并返回
        if (!empty($paramArrTemp)) {
            $paramArr = $paramArrTemp;
        }
        $data = OrderManager::getInstance()->buildPayUrl($paramArr);
        $this->ajaxReturn($data, "EVAL");
    }

    // 中国联通-订购参数解析
    public function parseOrderUrlParam000051()
    {
        $userId = MasterManager::getUserId();
        $carrierId = MasterManager::getCarrierId();
        $returnUrl = $_POST['returnUrl'];
        $vipId = $_POST['vip_id'];
        $productId = $_POST['product_id']; // 商品编号
        $isPlaying = isset($_POST['isPlaying']) ? $_POST['isPlaying'] : 0;
        $orderReason = $_POST['orderReason'];
        $remark = $_POST['remark'];
        $returnPageName = $_POST['returnPageName'];

        // 向CWS获取订单号
        $orderNoJson = OrderManager::createPayTradeNo($vipId, $orderReason, $remark);
        LogUtils::info("user [$userId] request transactionID --> result:" . json_encode($orderNoJson));
        if ($orderNoJson->result != 0) {
            echo json_encode(array(
                'result' => $orderNoJson->result,
                'orderUrl' => ""
            ));
            exit();
        }

        //先到局方鉴权
        $authJson = OrderManager::getInstance()->authentication();
        $authResult = json_decode($authJson);

        LogUtils::info("PayController ---> getOrderUrl[000051] authResult:" . $authJson);

        if ($authResult->result == 10020001) {
            //鉴权失败，保存鉴权返回的订购信息项。
            MasterManager::setOrderItems($authResult);

            $orderCallback = PageManager::getBasePagePath('orderCallback');

            if (TextUtils::isBeginHead($orderCallback, "http://")) {
                $backUrl = $orderCallback
                    . "?userId=" . MasterManager::getUserId()
                    . "&tradeNo=" . $orderNoJson->order_id
                    . "&lmreason=0"
                    . "&lmcid=" . $carrierId
                    . "&isPlaying=" . $isPlaying
                    . "&returnPageName=" . $returnPageName
                    . "&returnUrl=" . rawurlencode(mb_convert_encoding($returnUrl, 'GBK', 'utf-8'));

            } else {
                $backUrl = "http://" . $_SERVER['HTTP_HOST'] . $orderCallback
                    . "?userId=" . MasterManager::getUserId()
                    . "&tradeNo=" . $orderNoJson->order_id
                    . "&lmreason=0"
                    . "&lmcid=" . $carrierId
                    . "&isPlaying=" . $isPlaying
                    . "&returnPageName=" . $returnPageName
                    . "&returnUrl=" . rawurlencode(mb_convert_encoding($returnUrl, 'GBK', 'utf-8'));
            }

            $epgInfoMap = MasterManager::getEPGInfoMap();
            $orderUrl = ORDER_SERVICE_ORDER_URL . "?";

            // 根据页面上的计费选项类型，来提取对应的计费参数
            if ($productId == PRODUCT_ID_15) {
                $productList = $authResult->productList[0];
            } else {
                $productList = $authResult->productList[1];
            }

            $contentID = $productList->contentID;
            $productId = $productList->productId;
            $orderInfo = array(
                "SPID" => SPID,
                "UserID" => $epgInfoMap['UserID'],
                "UserToken" => $epgInfoMap['UserToken'],
                "ServiceID" => SERVICE_ID,
                "ContentID" => $contentID,
                "ProductID" => $productId,
                "Action" => '1',
                "OrderMode" => '1',
                "ReturnURL" => rawurlencode($backUrl),
                "ContinueType" => '1',
                //"NeedRewardPoints" => '0',
                "Lang" => "zh",
            );
            foreach ($orderInfo as $key => $val) {
                $orderUrl .= $key . "=" . $val . "&";
            }
            $orderUrl = substr($orderUrl, 0, -1);
        } else {
            $orderUrl = "";     //订购地址置空
        }

        LogUtils::info("PayController ---> getOrderUrl[000051] orderUrl:" . $orderUrl);

        echo json_encode(array(
            'result' => $authResult->result,
            'orderUrl' => $orderUrl
        ));
    }

    // 广西电信-订购参数解析
    private function parseOrderUrlParam450092()
    {
        $returnUrl = isset($_POST['returnUrl']) ? $_POST['returnUrl'] : '';
        $orderReason = isset($_POST['orderReason']) ? $_POST['orderReason'] : '100';
        $remark = isset($_POST['remark']) ? $_POST['remark'] : '';
        $isPlaying = isset($_POST['isPlaying']) ? $_POST['isPlaying'] : 0;
        $isSinglePayItem = isset($_POST['isSinglePayItem']) ? $_POST['isSinglePayItem'] : 0;
        return array(
            "returnUrl" => $returnUrl,
            "orderReason" => $orderReason,
            "remark" => $remark,
            "isPlaying" => $isPlaying,
            "isSinglePayItem" => $isSinglePayItem,
        );
    }

    // 广西广电-订购参数解析
    private function parseOrderUrlParam450094()
    {
        $returnUrl = isset($_POST['returnUrl']) ? $_POST['returnUrl'] : '';
        $isPlaying = isset($_POST['isPlaying']) ? $_POST['isPlaying'] : 0;
        $orderReason = isset($_POST['orderReason']) ? $_POST['orderReason'] : '100';
        $remark = isset($_POST['remark']) ? $_POST['remark'] : '';
        $vipId = isset($_POST['vip_id']) ? $_POST['vip_id'] : '';
        $productId = isset($_POST['product_id']) ? $_POST['product_id'] : ''; // 商品编号
        return array(
            "returnUrl" => $returnUrl,
            "orderReason" => $orderReason,
            "remark" => $remark,
            "isPlaying" => $isPlaying,
            "vipId" => $vipId,
            "productId" => $productId
        );
    }

    // 宁夏电信-订购参数解析
    private function parseOrderUrlParam640092()
    {
        $returnUrl = isset($_POST['returnUrl']) ? $_POST['returnUrl'] : '';
        $orderReason = isset($_POST['orderReason']) ? $_POST['orderReason'] : '100';
        $remark = isset($_POST['remark']) ? $_POST['remark'] : '';
        $isPlaying = isset($_POST['isPlaying']) ? $_POST['isPlaying'] : 0;
        $isSinglePayItem = isset($_POST['isSinglePayItem']) ? $_POST['isSinglePayItem'] : 0;
        return array(
            "returnUrl" => $returnUrl,
            "orderReason" => $orderReason,
            "remark" => $remark,
            "isPlaying" => $isPlaying,
            "isSinglePayItem" => $isSinglePayItem,
        );
    }

    /**
     * 广西广电
     * 页面获取单片支付url
     */
    public function getSinglePayUrlAction()
    {
        $videoInfo = isset($_REQUEST['videoInfo']) ? $_REQUEST['videoInfo'] : '';
        $videoInfo = json_decode($videoInfo, true);

        $paramJson = $videoInfo["paramJson"];
        MasterManager::setPlayParams($paramJson);

        // 构建订购地址并返回
        $result = OrderManager::getInstance()->getSinglePayUrl($videoInfo);
        $ret = json_encode(array(
            'result' => $result['result'],
            'payUrl' => $result['payUrl'],
        ));
        $this->ajaxReturn($ret, "EVAL");
    }

    /**
     * @Brief 中国联通EPG，通过接口直接进行订购，不再经过局方的计费页
     * @param ： $orderReason 订购来源（100 开通vip  101 活动购买 102播放视频购买 103视频问诊购买 104问诊记录购买 105健康检测记录购买 106续费vip）
     * @param ： $remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
     * return: $payResult返回支付结果
     * @throws \Think\Exception
     */

    public function buildPayUrlAndPayAction()
    {
        $payResult = array(
            'result' => -1,
            'message' => "order failed"
        );
        $orderReason = isset($_POST['orderReason']) ? $_POST['orderReason'] : '100';
        $remark = isset($_POST['remark']) ? $_POST['remark'] : 'userOrder';
        $productId = isset($_POST['product_id']) ? $_POST['product_id'] : 1;        // 订购项的编号（1 -- 第一个订购项， 2 -- 第二个订购项）
        $contentId = isset($_POST['content_id']) ? $_POST['content_id'] : null;
        //拉取订购项
        $orderItems = OrderManager::getOrderItem(MasterManager::getUserId());
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("PayApi::userOrderAction() ---> orderItems is empty");
            $payResult['message'] = "orderItems is empty";
            $this->ajaxReturn(json_encode($payResult), "EVAL");
        } else {
            // 直接订购，使用第一个订购项（包月订购项）。
            $vipId = $orderItems[0]->vip_id;

            //先到局方鉴权
            $authPayInfo = null;
            if ($contentId != null && !empty($contentId)) {
                // 根据contentId 鉴权不同的产品
                $authPayInfo['spId'] = SPID;
                $authPayInfo['productId'] = "";
                $authPayInfo['serviceId'] = "";
                $authPayInfo['contentId'] = $contentId;
            }
            $instance = OrderManager::getInstance();
            $authInfo = $instance->authentication($authPayInfo);

            if ($authInfo->result == 10020001) {

                // 创建支付订单
                $orderInfo = OrderManager::createPayTradeNo($vipId, $orderReason, $remark);
                if ($orderInfo->result != 0) {
                    // 创建失败
                    $payResult['message'] = "query pay trade no failed";
                    $this->ajaxReturn(json_encode($payResult), "EVAL");
                } else {
                    // 根据页面上的计费选项类型，来提取对应的计费参数
                    if ($productId == PRODUCT_ID_15) {
                        $productInfo = $authInfo->productList[0];
                    } else {
                        $productInfo = $authInfo->productList[1];
                        // 如果没有2个计费项，就使用第一个
                        if (empty($productInfo)) {
                            LogUtils::info("---> no product2 , choice product1 ");
                            $productInfo = $authInfo->productList[0];
                        }
                    }

                    // 生成订购url，并直接订购
                    $epgInfoMap = MasterManager::getEPGInfoMap();
                    $accountId = $epgInfoMap['UserID'];
                    $userToken = $epgInfoMap['UserToken'];
                    $result = $instance->buildOderUrlAndPay($accountId, $userToken, $orderInfo->order_id, $productInfo);
                    $result = json_decode($result);
                    if ($result != "" && $result != null) {
                        $payResult['result'] = $result->result;
                    }

                    LogUtils::info("--->user order result: " . $result->result);

                    // 处理订购结果,订购成功或已经订购
                    if ($result->result == 0 || $result->result == 10030003) {
                        LogUtils::info("--->user order success result: " . $result->result);
                        MasterManager::setUserIsVip(1);
                        // 把订购是否成功的结果写入cookie，供页面使用
                        MasterManager::setOrderResult(1);
                    }
                    $result->TradeNo = $result->orderId != "" ? $result->orderId : $orderInfo->order_id;
                    $result->reason = 1;

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
                    LogUtils::info("buildPayUrlAndPayAction url --->: $url");
                    LogUtils::info("buildPayUrlAndPayAction postParams ---> : " . json_encode($result));
                    LogUtils::info("buildPayUrlAndPayAction postPayResult ---> result : " . $postResult);
                }
            } else {
                $payResult["result"] = $authInfo->result;
            }

            $this->ajaxReturn(json_encode($payResult), "EVAL");
        }
    }

    /**
     * 订购（外部使用）
     */
    public function pay000051Action()
    {
        $payResult = array(
            'result' => -1,
            'message' => "订购失败"
        );

        // 判断订购ID是否存在
        if ($_GET['orderId'] == "" || $_GET['orderId'] == null) {
            $payResult['message'] = '订单ID为空';
            LogUtils::error("pay000051Action:" . json_encode($payResult));
            echo json_encode($payResult);
            return;
        }

        // 校验sign签名是否正确
        if (!$this->verifySignValid()) {
            $payResult['message'] = '签名sign校验失败';
            LogUtils::error("pay000051Action:" . json_encode($payResult));
            echo json_encode($payResult);
            return;
        }

        $orderId = $_GET['orderId'];
        $accountId = $_GET['accountId'];
        $userToken = $_GET['userToken'];
        $productInfo['serviceId'] = $_GET['serviceId'];
        $productInfo['contentId'] = $_GET['contentId'];
        $productInfo['productId'] = $_GET['productId'];

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
            $result->reason = 0;

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
        echo json_encode($payResult);
    }

    /**
     * @Brief:此函数用于判断签名是否正确
     */
    private function verifySignValid()
    {
        $paramInfo = $_GET;

        // 加密前的key串
        $strKey = "";
        $sign = "";
        foreach ($paramInfo as $key => $value) {
            if ($key != 'sign') {
                $strKey .= $key . '=' . $value . '&';
            } else {
                $sign = $value; // 这个签名是系统传过来的
            }
        }
        // 去掉最后一个&符号
        $strKey = substr($strKey, 0, strlen($strKey) - 1);

        // md5校验
        $sign1 = md5($strKey);
        $sign2 = md5(SELF_MD5 . $sign1 . SELF_MD5);

        return $sign2 == $sign ? true : false;
    }

    /**
     * @Brief:此函数用于访问订购功能
     */
    public function PayAction()
    {
        LogUtils::info("####============> info: " . json_encode($_REQUEST));
        $pageType = isset($_REQUEST['pageType']) ? $_REQUEST['pageType'] : 0;  // 0--表示启动网页操作， 1--直接调用接口
        $header = json_decode($_REQUEST['header']);
        $userInfo = json_decode($_REQUEST['userInfo']);

        if (empty($header) || empty($userInfo)) {
            LogUtils::info("===================> info is empty!!!!!!!");
            exit(0);
        }

        $lmcid = $userInfo->lmcid ? $userInfo->lmcid : CARRIER_ID;
        if (empty($lmcid)) {
            exit(0);
        }

        // 设置用户session信息
        SystemManager::setPackageHeader($header);
        MasterManager::setAreaCode($userInfo->areaCode);
        MasterManager::setAccountId($userInfo->accountId);
        MasterManager::setUserToken($userInfo->userToken);
        MasterManager::setPlatformType($userInfo->platformType);
        MasterManager::setSTBId($userInfo->stbId);
        MasterManager::setCarrierId($lmcid);
        MasterManager::setUserId($userInfo->userId);

        $instance = OrderManager::getInstance($lmcid);
        if ($pageType == 1) {
            // 直接调用http请求接口
            echo $instance->interfacePay($userInfo);
        } else {
            // 使用header()方法进行页面跳转
            $instance->webPagePay($userInfo);
        }
    }

    /**
     * 获取支付锁设置地址。
     */
    public function getPayLockSetUrlAction()
    {
        $ret = array(
            'result' => -1,
            'url' => ""
        );
        $url = "";
        $openFlag = isset($_REQUEST['flag']) ? $_REQUEST['flag'] : '';   // 开启还是关闭
        $focusIndex = isset($_REQUEST['focusIndex']) ? $_REQUEST['focusIndex'] : '';    // 焦点ID
        $returnPageName = isset($_REQUEST['returnPageName']) ? $_REQUEST['returnPageName'] : '';    // 焦点ID

        if (empty($returnPageName)) {
            $returnPageName = "home";
        }
        $intent = IntentManager::createIntent($returnPageName);
        $intent->setParam("focusIndex", $focusIndex);
        $returnUrl = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($returnUrl, "http://")) {
            $returnUrl = "http://" . $_SERVER['HTTP_HOST'] . $returnUrl;  // 回调地址需要加上全局路径
        }
        if ($openFlag != "") {
            if ($openFlag == 1) {
                // 打开锁
                $url = PAY_LOCK_OPEN_URL;
            } else if ($openFlag == 0) {
                // 关闭锁
                $url = PAY_LOCK_CLOSE_URL;
            }
            $account = MasterManager::getAccountId();
            if (substr_compare($account, "_204", -strlen("_204")) === 0) {
                $account = substr($account, 0, strlen($account) - strlen("_204"));
            }
            $url = $url . "?userID=" . $account;
            $url = $url . "&productid=" . PRODUCT_ID . "@" . MasterManager::getAreaCode();
            $url = $url . "&originID=tvcenter";
            $url = $url . "&returnUrl=" . rawurlencode($returnUrl);

            $ret['result'] = 0;
            $ret['url'] = $url;
        }

        $this->ajaxReturn(json_encode($ret), "EVAL");
    }

    /**
     * @brief: 构建让页面使用的订购url
     */
    public function buildDirectPayUrlForPageAction()
    {
        $ret = array(
            "result" => -1,
        );

        $payUrl = OrderManager::getInstance()->buildDirectPayUrl();
        if ($payUrl) {
            $ret['result'] = 0;
            $ret['payUrl'] = $payUrl;
        }

        LogUtils::info("buildDirectPayUrlForPageAction return data:" . json_encode($ret));
        $this->ajaxReturn(json_encode($ret), "EVAL");
    }

    /**
     * @brief: 计费数据鉴权接口
     */
    public function payDataAuthenticationAction()
    {
        $ret = array(
            "result" => -1,
        );
        $orderId = isset($_REQUEST['orderId']) ? $_REQUEST['orderId'] : '';
        $isVip = OrderManager::getInstance()->PayAuthentication($orderId);
        $ret = array(
            "result" => 0,
            "isVIP" => $isVip,
        );

        LogUtils::info("PayAuthentication return data:" . json_encode($ret));
        $this->ajaxReturn(json_encode($ret), "EVAL");
    }

    public function reportOrderInfoAction()
    {
        $orderId = isset($_REQUEST['orderId']) ? $_REQUEST['orderId'] : '';
        $status = isset($_REQUEST['status']) ? $_REQUEST['status'] : '';
        $msg = isset($_REQUEST['msg']) ? $_REQUEST['msg'] : '';

        $result = UserManager::reportOrderInfo($orderId, $status, $msg);

        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    /**
     * 得到支付回调地址
     */
    public function buildDirectPayReturnUrlAction()
    {
        $ret = array(
            "result" => -1,
        );
        $instance = OrderManager::getInstance();
        if ($instance != null) {
            $returnUrl = $instance->buildDirectPayReturnUrl();
            if (!empty($returnUrl)) {
                $ret['result'] = 0;
                $ret['returnUrl'] = $returnUrl;
            }
        }
        LogUtils::info("buildDirectPayReturnUrlAction return data:" . json_encode($ret));
        $this->ajaxReturn(json_encode($ret), "EVAL");
    }

    /**
     * @brief: 构建让页面使用的兑换积分url
     */
    public function buildDirectPointExchangeUrlAction()
    {
        $ret = array(
            "result" => -1,
        );

        $url = OrderManager::getInstance()->buildPointExchangeUrl();
        if ($url) {
            $ret['result'] = 0;
            $ret['exchangeUrl'] = $url;

            if (MasterManager::getCarrierId() == CARRIER_ID_CHINAUNICOM) {
                $accountId = MasterManager::getAccountId();
                // 判断能读到业务帐号后面的内容
                $idx = strripos($accountId, '_');
                if ($idx && ($idx > 0)) {
                    $accountId = substr($accountId, 0, $idx);
                }
                $ret['accountId'] = $accountId;
            }
        }

        LogUtils::info("buildDirectPointExchangeUrlAction return data:" . json_encode($ret));
        $this->ajaxReturn(json_encode($ret), "EVAL");
    }

    /**
     * @brief: 构建让页面使用的兑换积分url
     */
    public function upLoadJifenStatusAction()
    {
        $ret = array(
            "result" => -1,
        );

        $status = isset($_REQUEST['status']) ? $_REQUEST['status'] : 1;
        MasterManager::setJifenStatus($status);
        $ret['result'] = 0;
        LogUtils::info("upLoadJifenStatusAction 积分状态设置成功");
        $this->ajaxReturn(json_encode($ret), "EVAL");
    }

    /**
     * @brief: 山东电信，针对当前的产品包进行鉴权，小包鉴权业务
     */
    public function authPacketTypeAction()
    {
        $result = array(
            "resultCode" => -1,
            "resultMsg" => "鉴权失败，当前产品包未订购"
        );

        $packetType = $_REQUEST["packetType"];
        $orderPackets = json_decode(MasterManager::getOrderPacketType());
        if (!isset($packetType) || $packetType == "") {
            $result["resultMsg"] = "packetType未传值";
        } else if (in_array($packetType, $orderPackets)) { // 缓存优化，判断当前已订购的包是否包含查询的产品包
            $result["resultCode"] = 0;
            $result["resultMsg"] = "鉴权成功";
        } else { // 接口查询
            $orderModel = new Pay370092();
            $isAuthVip = $orderModel->performAuthIdentity(CONTENT_ID_CONFIG[$packetType]);
            if ($isAuthVip == 1) {
                // 添加到缓存中并返回
                array_push($orderPackets, $packetType);
                MasterManager::setOrderPacketType(json_encode($orderPackets));
                $result["resultCode"] = 0;
                $result["resultMsg"] = "鉴权成功";
            }
        }
        $this->ajaxReturn($result);
    }

    //甘肃移动
    public function gsUserAuthenticationAction()
    {
        $userInfo = null;
        $result = 0;
        LogUtils::info("gsUserAuthenticationAction param:" . json_encode($_REQUEST));
        $fromPlat = isset($_REQUEST['fromPlat']) ? $_REQUEST['fromPlat'] : '';
        if ($fromPlat == 1) {
            $orderId = MasterManager::getUserOrderId();
            $userInfo["accountIdentity"] = $_REQUEST['accountId'];
            $userInfo["stbid"] = $_REQUEST['stbId'];
            $userInfo["token"] = $_REQUEST['userToken'];
            MasterManager::setAccountId($_REQUEST['accountId']);
            $stbid = $_REQUEST['stbId'];
        } else {
            $orderId = isset($_REQUEST['orderId']) ? $_REQUEST['orderId'] : '';
            //上报地址
            $apkInfo = MasterManager::getApkInfo();
            if (gettype($apkInfo) == 'string') {
                $apkInfo = json_decode($apkInfo);
            }
            $stbid = $apkInfo->stbid;
        }

        $result = OrderManager::getInstance()->authentication($userInfo);
        LogUtils::info("getUserAuthentication return VIP:" . $result);
        if ($result == 1) {
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
                'transactionID' => $orderId,
                'result' => 0,
            );

            $url = "http://healthiptv.langma.cn/cws/pay/gansuyd/callback/cp_index.php";
            LogUtils::info("OrderManager::uploadOrderdata ---> reportUrl: " . $url);
            LogUtils::info("OrderManager::uploadOrderdata ---> data: " . json_encode($data));
            HttpManager::httpRequest("post", $url, $data);
        }

        $ret = array(
            "result" => $result,
        );
        $this->ajaxReturn(json_encode($ret), 'EVAL');
    }

    //广东广东鉴权
    public function getUserAuthenticationAction()
    {
        if (MasterManager::getCarrierId() == CARRIER_ID_GANSUYD) {
            return $this->gsUserAuthenticationAction();
        }
        $orderId = isset($_REQUEST['orderId']) ? $_REQUEST['orderId'] : '';
        $payInfo = new \stdClass();
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $payInfo->authUrl = USER_ORDER_URL . QUERY_ORDER_FUNC;//鉴权地址
        $payInfo->providerId = providerId;
        if (MasterManager::getCarrierId() == CARRIER_ID_GUANGDONGGD) {
            $payInfo->devNo = $epgInfoMap["cardId"];
            $payInfo->productId = productId_month;
        } else {
            $payInfo->devNo = $epgInfoMap["client"];
            $payInfo->productId = check_productId_month;
        }

        $payInfo->timeStamp = date("YmdHis");
        $payInfo->key = key;
        $text = "devNo=" . $payInfo->devNo . "&providerId=" . $payInfo->providerId . "&productId=" . $payInfo->productId . "&timeStamp=" . $payInfo->timeStamp . "&key=" . $payInfo->key;
        LogUtils::info("getUserAuthenticationAction ---> sign text : " . $text);
        $payInfo->sign = strtoupper(md5($text));
        $authresult = OrderManager::getInstance()->authentication($payInfo);

        if ($authresult) {
            LogUtils::info("task::getUserAuthentication return VIP:1");
            $param = json_decode(MasterManager::getPayCallbackParams());
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = MasterManager::getUserId();
            $payResultInfo->tradeNo = $param->tradeNo;
            $payResultInfo->lmreason = $param->lmreason;
            $payResultInfo->returnPageName = $param->returnPageName;
            $payResultInfo->isPlaying = $param->isPlaying;
            $payResultInfo->videoInfo = $param->videoInfo;
            //得到局方返回的订购参数
            $payResultInfo->result = 0;
            $payResultInfo->message = "鉴权是会员";
            $payResultInfo->spOrderId = $orderId; //我方订单号
            $payResultInfo->orderId = ""; //局方订单号
            //上报地址
            LogUtils::info("task::vip upload payResult: " . json_encode($payResultInfo));

            $result = $this->_uploadPayResult($payResultInfo);
            LogUtils::info("task::vip upload result: " . $result);
        } else {
            LogUtils::info("task::getUserAuthentication return VIP:0");
        }

        $ret = array(
            "result" => 0,
            "isVIP" => $result,
        );
        $this->ajaxReturn(json_encode($ret), 'EVAL');

    }

    /**
     * 上报订购结果
     * @param $payResultInfo
     * @return 上报结果
     */
    private function _uploadPayResult($payResultInfo = null)
    {
        $payResultInfo = array(
            'TradeNo' => $payResultInfo->tradeNo,
            'reason' => $payResultInfo->lmreason,
            'transactionID' => $payResultInfo->orderId,
            'Result' => $payResultInfo->result,
            'Description' => $payResultInfo->message,
            'UserID' => $payResultInfo->userId,
        );
        $payResultInfo['carrierId'] = isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID;
        LogUtils::info("_uploadPayResult ---> payResultInfo : " . json_encode($payResultInfo));
        $uploadPayResult = PayAPI::postPayResultEx($payResultInfo);
        return (isset($uploadPayResult) && !empty($uploadPayResult)) ? true : false;
    }

    /**
     * @brief: 湖南联通芒果TV，获取302跳转地址
     */
    public function getJumpUrlAddressAction()
    {
        $result = array(
            "result" => -1,
            "url" => ""
        );
        $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : '';
        LogUtils::info("getJumpUrlAddressAction ---> url : " . $url);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);  //是否抓取跳转后的页面
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 跳过证书检查
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); // 不从证书中检查SSL加密算法是否存在
        $res = curl_exec($ch);
        $info = curl_getinfo($ch);
        $retURL = $info['url'];   // 跳转后的 URL 信息
        curl_close($ch);

        $result['result'] = 0;
        $result['url'] = $retURL;
        LogUtils::info("getJumpUrlAddressAction ---> retURL : " . $retURL);
        $this->ajaxReturn($result);
    }

    //湖南联通芒果TV鉴权上报数据
    public function HuNanMGAuthenticationAction()
    {
        $orderId = isset($_REQUEST['orderId']) ? $_REQUEST['orderId'] : '';
        $authresult = OrderManager::getInstance()->authentication();
        LogUtils::info("task::HuNanMGAuthenticationAction return VIP:" . $authresult);
        if ($authresult == 1) {
            $RST = $_GET['RST'];
            $RST = json_decode($RST, true);
            $RST['TradeNo'] = $orderId;
            $RST['reason'] = 2;
            $RST['ValidStart'] = date('Y-m-d h:i:s', time());
            $RST['RST_CODE'] = 0;
            $RST['PayType'] = "1";
            if ($RST['RST_CODE'] == 0) {
                $RST['ValidEnd'] = "2099-01-01";
                $RST['UnOrderTime'] = "2099-01-01";
            } else {
                $RST['ValidEnd'] = date('Y-m-d h:i:s', time());
                $RST['UnOrderTime'] = date('Y-m-d h:i:s', time());
            }
            $RST['carrierId'] = "07430093";

            $arr = array(
                "jumpType" => 1,
                "jumpUrl" => ""
            );

            // 上报订购结果
            $result = PayAPI::postPayResultEx($RST);
            LogUtils::info("task::vip upload result: " . $result);
        }

        $ret = array(
            "result" => 0,
            "isVIP" => $authresult,
        );
        $this->ajaxReturn(json_encode($ret), 'EVAL');
    }

    //广西广电获取购买次数
    public function getBuyNumAction()
    {
        $buy_type = isset($_REQUEST['buy_type']) ? $_REQUEST['buy_type'] : '';
        $result = PayAPI::getBuyNum($buy_type);
        $ret = array(
            "result" => $result->result,
            "buy_num" => $result->buy_num,
        );
        $this->ajaxReturn(json_encode($ret), 'EVAL');
    }

    //广西电信获取订购url
    public function getUserPayUrlAction()
    {
        $order_type = isset($_REQUEST['order_type']) ? $_REQUEST['order_type'] : '';
        $result = PayAPI::getUserPayUrl($order_type);
        $ret = array(
            "result" => empty($result->url) ? -1 : $result->result,
            "order_id" => $result->order_id,
            "order_type" => $result->order_type,
            "url" => $result->url,
        );
        $this->ajaxReturn(json_encode($ret), 'EVAL');
    }

    //广东广电回调地址
    public function notifyPayAction()
    {
        $ret = OrderManager::getInstance()->payNotifyback();
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 构建鉴权参数。例如：前端请求当前地区的鉴权参数，然后去前端或者请求Android端sdk进行鉴权操作。
     */
    public function getUserTypeAuthParamsAction()
    {
        $ret = array(
            // sdk鉴权参数（contentId/productId/spToken）
            "contentId" => CONTENT_ID,
            "productId" => PRODUCT_ID,
            "productType" => PRODUCT_TYPE,
            // sdk订购接口所需参数（contentName/productId/spToken/payPhone）
            "contentName" => CONTENT_NAME,
            "payPhone" => PAY_PHONE,
            "authType" => MasterManager::getAuthType(),
        );

        /**
         * 广西移动APK，鉴权是需传入三个产品ID（39健康产品包、医疗养老融合包、全站包）
         */
        if(CARRIER_ID == CARRIER_ID_GUANGXI_YD){
            //暂不需要传医养融合包
            $ret['productId'] = PRODUCT_ID;
        }

        //鉴权时需要传入当月问诊已使用次数的地区 [未来电视怡伴健康统一接口版本]
        $hasUseCountCarriers = [CARRIER_ID_YB_HEALTH_UNIFIED /* 未来电视统一接口 */];
        if (in_array(CARRIER_ID, $hasUseCountCarriers)) {
            $totalCount = 0;
            $remainCount = 0;
            $result = DoctorP2PRecordAPI::getFreeInquiryTimes();
            LogUtils::info("PayAPIController getUserTypeAuthParamsAction result is " . json_encode($result));
            if ($result['result'] == 0) {
                $totalCount = $result['total_count'];
                $remainCount = $result['remain_count'];
            }
            $ret['totalCount'] = $totalCount;
            $ret['remainCount'] = $remainCount;
        }

        $this->ajaxReturn(json_encode($ret), 'EVAL');
    }

    /**
     * 预订单操作
     */
    public function serviceOrderAction()
    {
        if (CARRIER_ID == CARRIER_ID_JILIN_YD) {
            $orderManager = new Pay220001();
            if (!$orderManager->checkUserInBlacklist()) {
                $result = $orderManager->serviceOrder($_POST);
                $this->ajaxReturn($result, 'EVAL');
            } else {
                $ret['code'] = '-3';
                $ret['message'] = "创建订单失败";
                $this->ajaxReturn(json_encode($ret), 'EVAL');
            }
        }

        if (CARRIER_ID == CARRIER_ID_JILINGDDX_MOFANG) { // 吉林电信魔方
            $orderInstance = new Pay10220095();
            $customerRenew = $_REQUEST['customerRenew'];
            $cycleType = $_REQUEST['cycleType'];
            $fee = $_REQUEST['fee'];
            $result = $orderInstance->serviceOrder($customerRenew, $cycleType, $fee);
            $this->ajaxReturn(json_encode($result), 'EVAL');
        }
    }

    /**
     * 查询订单状态
     */
    public function queryOrderStatusAction()
    {
        if (CARRIER_ID == CARRIER_ID_JILIN_YD || CARRIER_ID == CARRIER_ID_JILINGDDX_MOFANG) {
            $orderId = $_REQUEST['orderId'];
            $orderManager =OrderManager::getInstance();
            $result = $orderManager->queryOrderStatus($orderId);
            $this->ajaxReturn($result, 'EVAL');
        }
    }


    /**
     * 检测当前用户状态
     */
    public function queryUserStatusAction()
    {
        $orderManager = new Pay220001();
        $result = $orderManager->queryUserBalance();
        $this->ajaxReturn($result, 'EVAL');
    }

    public function isBlackListUserAction()
    {
        $orderManager = new Pay220001();
        $result = $orderManager->isBlackListUser();
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 直接支付
     */
    public function payDirectAction()
    {
        if (CARRIER_ID == CARRIER_ID_JILIN_YD) {
            $orderManager = new Pay220001();
            $result = $orderManager->payByPhone($_REQUEST);
            $this->ajaxReturn($result, 'EVAL');
        }
    }

    /**
     * 上传订购信息参数
     */
    public function insertOrderInfoAction()
    {
        if (CARRIER_ID == CARRIER_ID_JILIN_YD) {
            $orderManager = new Pay220001();
            $orderInfo = array();
            $orderInfo['payType'] = $_REQUEST['payType'];
            $orderInfo['payTime'] = $_REQUEST['payTime'];
            $result = $orderManager->insertOrderInfo($orderInfo);
            $this->ajaxReturn($result, 'EVAL');
        }
    }

    /**
     * 构建支付参数信息 -- 目前只用于甘肃移动地址，用于底层跳转支付页面
     */
    public function getPayDataAction()
    {
        $contentId = $_REQUEST["contentId"];
        $contentName = $_REQUEST["orderRemark"];
        $payData = Pay620007::createPayData($contentId, $contentName);
        LogUtils::info("PayAPIController getPayDataAction payData is " . json_encode($payData));
        $this->ajaxReturn(json_encode($payData), "EVAL");
    }

    /**
     * 同步用户状态信息 -- 目前只用于甘肃移动地址，同步LWS用户状态信息
     */
    public function asyncUserStatusAction()
    {
        $isVideoPlaying = $_REQUEST["isVideoPlaying"];
        $result = Pay620007::asyncUserStatus($isVideoPlaying);

        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    //青海移动APK鉴权
    public function AuthenticationAction()
    {
        $result = OrderManager::getInstance()->authentication();
        $ret = array(
            "result" => 0,
            "isVIP" => $result,
        );
        $this->ajaxReturn(json_encode($ret), 'EVAL');
    }


    /**
     * 青海移动- 下单接口
     */
    public function ADVPayAction()
    {
        $ret = array();
        $orderReason = $_REQUEST['orderReason'];
        $remark = $_REQUEST['remark'];
        $accountIdentify = $_REQUEST['accountIdentify'];
        $payType = isset($_REQUEST['paymentType']) ? $_REQUEST['paymentType'] : '16';
        $orderItem = json_decode($_REQUEST['orderItem']);
        $productInfo = json_decode($_REQUEST['productInfo']);

        LogUtils::info("ADVPayAction() ---> paymentType：" . $payType);

        // 创建订单，
        // 创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($orderItem->vip_id, $orderReason, $remark);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['result'] = $orderInfo->result;
            $ret['resultDesc'] = "创建订单失败";
            LogUtils::info(" ADVPayAction() ---> 获取订单失败：" . $ret['result']);
        } else {
            $seqId = $orderInfo->order_id;
            $apkInfo = MasterManager::getApkInfo();
            if (gettype($apkInfo) == 'string') {
                $apkInfo = json_decode($apkInfo);
            }
            $consumeLocal = $apkInfo->epgProvince;
            $areaCode = $apkInfo->areaCode;
            $appName = 'com.longmaster.iptv.health.qinghaiyd';
            if ($consumeLocal == '26') {
                $appName = $areaCode == 'bestv' ? 'com.longmaster.iptv.health.xizangyd.bestv' : 'com.longmaster.iptv.health.xizangyd.weilaitv';
            }

            if ($consumeLocal == '30') {
                $appName = "com.longmaster.iptv.health.ningxiayd";
            }

            $payInfo = new \stdClass();
            $payInfo->seqId = $seqId;
            $payInfo->userId = $apkInfo->loginAccount;
            $payInfo->token = MasterManager::getUserToken();
            $payInfo->accountIdentify = $accountIdentify;
            $payInfo->terminalId = $apkInfo->snNum;
            $payInfo->appName = $appName;   //TODO 局方按时不用
            $payInfo->productCode = $productInfo->productCode;
            $payInfo->contentId = CONTENT_ID;  //TODO 也可以用鉴权返回的产品内容ID，是一样的
            $payInfo->copyRightContentId = COPYRIGHT_ID;
            $payInfo->consumeLocal = $consumeLocal;   // 青海移动
            $payInfo->consumeScene = "01";
            $payInfo->consumeBehaviour = "02";
            $payInfo->channelId = CHANNEL_ID;
            $payInfo->path = "";
            $payInfo->payType = $payType;    //TODO 目前只有话费支付，写死，后续支出第三方支付还需要调整
            $payInfo->subType = "03";
            if ($productInfo->isSalesStrategy == "1") {
                $salesStrategys = $productInfo->salesStrategys;
                $salesStrategy = $salesStrategys[0];
                $payInfo->saleTransID = $salesStrategy->saleTransID;
                $payInfo->amount = $salesStrategy->firstPayAmount;
            } else {
                $payInfo->saleTransID = "";
                $payInfo->amount = $productInfo->price;
            }
            $intance = OrderManager::getInstance();
            $ret = $intance->scspProxyADVPay($payInfo);
            $ret->seqId = $seqId;   // 增加订单号
            LogUtils::info(" ADVPayAction() ---> 下单结果：" . json_encode($ret));
        }
        $this->ajaxReturn($ret);
    }

    /**
     * SDK订购结果查询接口
     */
    public function ADVPayResultAction()
    {
        $ret = array();
        $externalSeqNum = $_REQUEST['externalSeqNum'];
        $payNum = $_REQUEST['payNum'];
        $apkInfo = MasterManager::getApkInfo();
        if (gettype($apkInfo) == 'string') {
            $apkInfo = json_decode($apkInfo);
        }
        $consumeLocal = $apkInfo->epgProvince;
        $areaCode = $apkInfo->areaCode;
        $appName = 'com.longmaster.iptv.health.qinghaiyd';
        if ($consumeLocal == '26') {
            $appName = $areaCode == 'bestv' ? 'com.longmaster.iptv.health.xizangyd.bestv' : 'com.longmaster.iptv.health.xizangyd.weilaitv';
        }

        if ($consumeLocal == '30') {
            $appName = "com.longmaster.iptv.health.ningxiayd";
        }

        $queryInfo = new \stdClass();
        $queryInfo->terminalId = $apkInfo->snNum;
        $queryInfo->appName = $appName;
        $queryInfo->userId = $apkInfo->loginAccount;
        $queryInfo->token = MasterManager::getUserToken();
        $queryInfo->externalSeqNum = $externalSeqNum;
        $queryInfo->payNum = $payNum;
        $queryInfo->param = "";
        $intance = OrderManager::getInstance();
        $ret = $intance->scspProxyADVPayResult($queryInfo);

        $this->ajaxReturn($ret);
    }

    /**
     * SDK订购结果查询接口
     */
    public function ADVPayResult2Action()
    {
        $ret = array();
        $externalSeqNum = $_REQUEST['externalSeqNum'];
        $payNum = $_REQUEST['payNum'];
        $apkInfo = MasterManager::getApkInfo();
        if (gettype($apkInfo) == 'string') {
            $apkInfo = json_decode($apkInfo);
        }
        MasterManager::setOrderItem($_REQUEST['orderItem']);
        MasterManager::setProductInfo($_REQUEST['productInfo']);
        MasterManager::setPayParamInfo($_REQUEST['payParamInfo']);
        MasterManager::setPayType($_REQUEST['payType']);
        $consumeLocal = $apkInfo->epgProvince;
        $areaCode = $apkInfo->areaCode;
        $appName = '';
        if ($consumeLocal == '26') {
            $appName = $areaCode == 'bestv' ? 'com.longmaster.iptv.health.xizangyd.bestv' : 'com.longmaster.iptv.health.xizangyd.weilaitv';
        }

        $queryInfo = new \stdClass();
        $queryInfo->terminalId = $apkInfo->snNum;
        $queryInfo->appName = $appName;
        $queryInfo->userId = $apkInfo->loginAccount;
        $queryInfo->token = MasterManager::getUserToken();
        $queryInfo->externalSeqNum = $externalSeqNum;
        $queryInfo->payNum = $payNum;
        $queryInfo->param = "";
        $instance = OrderManager::getInstance();

        MasterManager::setQueryInfo(json_encode($queryInfo));
        $ret = $instance->scspProxyADVPayResult();
        MasterManager::setLoopPayResult(1);

        $this->ajaxReturn($ret);
    }


    public function isLoopPayResultAction()
    {
        $ret = array(
            "result" => -1
        );

        if (MasterManager::getLoopPayResult() == 1) {
            $ret = array(
                "result" => 1
            );
        }

        $this->ajaxReturn(json_encode($ret), "EVAL");
    }


    /**
     * 甘肃移动查询VIP信息
     */
    public function queryVipInfoAction()
    {
        $isVip = false;
        $vipInfo = UserManager::queryVipInfo(MasterManager::getUserId());  //校验用户是否为vip
        LogUtils::info("userAuth-->" . $vipInfo->result);

        if ($vipInfo->result == 0) {
            $isVip = true;
            MasterManager::setVIPUser(1);
        }
        LogUtils::info("--->userVipStatus=" . $isVip);
        $data = array(
            "result" => 0,
            "isVIP" => $isVip,
        );
        return $this->ajaxReturn($data);
    }

    /**
     * 甘肃移动订购/退订接口
     */
    public function OrderForGansuYdAction()
    {
        $orderId = $_REQUEST['orderId'];
        $orderType = $_REQUEST['orderType'];

        // 构建订购地址（或者订购参数）并返回
        $data = OrderManager::getInstance()->OrderForGansuYd($orderId, $orderType);

        $this->ajaxReturn($data);
    }

    /**
     * 支付接口
     */
    public function ADVOrderAction()
    {
        $apkInfo = json_decode($_REQUEST['apkInfo']);
        $orderItem = json_decode($_REQUEST['orderItem']);
        $productInfo = json_decode($_REQUEST['productInfo']);
        $payParamInfo = json_decode($_REQUEST['payParamInfo']);
        $payType = isset($_REQUEST['payType']) ? $_REQUEST['payType'] : '16';

        if ($apkInfo == null || $apkInfo->loginAccount == null) {
            $apkInfo = MasterManager::getApkInfo();
            if (gettype($apkInfo) == 'string') {
                $apkInfo = json_decode($apkInfo);
            }
        }
        LogUtils::info("ADVOrderAction ---> payParamInfo:" . json_encode($payParamInfo));

        $consumeLocal = $apkInfo->epgProvince;

        $payInfo = new \stdClass();
        $payInfo->seqId = $payParamInfo->seqId;
        $payInfo->userId = $apkInfo->loginAccount;
        $payInfo->token = MasterManager::getUserToken();
        $payInfo->accountIdentify = $payParamInfo->payParam->PayNum;
        $payInfo->terminalId = $apkInfo->snNum;
        $payInfo->copyRightId = $payParamInfo->payParam->PayInfo->CooperateCode;
        $payInfo->systemId = "0";
        $payInfo->productCode = $payParamInfo->payParam->PayInfo->ProductCode;
        $payInfo->contentId = $payParamInfo->payParam->PayInfo->ContentCode;
        $payInfo->copyRightContentId = "";
        $payInfo->consumeLocal = $consumeLocal;
        $payInfo->consumeScene = "01";
        $payInfo->consumeBehaviour = "02";
        $payInfo->channelId = $payParamInfo->payParam->PayInfo->ChannelCode;
        $payInfo->path = "";
        $payInfo->payType = $payType;
        $payInfo->subType = "03";
        $payInfo->orderTimes = "";
        $payInfo->thirdTransID = $payParamInfo->externalSeqNum;
        $payInfo->saleTransID = "";
        $intance = OrderManager::getInstance();
        LogUtils::info("ADVOrderAction ---> payInfo:" . json_encode($payInfo));
        $result = $intance->scspProxyOrderResult($payInfo);
        // 判断订购成功的话，上报订购结果
        LogUtils::info("ADVOrderAction ---> result:" . json_encode($result));
        if ($result && $result->result == '0') {
            // 上报订购结果给cws
            $payResult = new \stdClass();
            $payResult->userId = $apkInfo->loginAccount;                            // 用户ID (业务账号）
            $payResult->token = MasterManager::getUserToken();                    // 用户Token
            $payResult->terminalId = $apkInfo->snNum;                            // 机顶盒标识（stbId)
            $payResult->copyrightId = $payParamInfo->payParam->PayInfo->CooperateCode;         // 牌照方标识
            $payResult->contentId = $payParamInfo->payParam->PayInfo->ContentCode;            // 内容ID
            $payResult->subContentId = "";        // 咪咕子内容标识（暂不用，为空）
            $payResult->systemId = "0";            // 客户端类型
            $payResult->consumeLocal = $consumeLocal;            // 消费省份编码
            $payResult->consumeScene = "01";    // 消费场景
            $payResult->consumeBehaviour = "02";        // 消费行为
            $payResult->path = "";                    // 导航路径
            $payResult->preview = "";                // 试看标识
            $payResult->channelId = $payParamInfo->payParam->PayInfo->ChannelCode;                // 渠道ID
            $payResult->productCode = $payParamInfo->payParam->PayInfo->ProductCode;        // 产品ID
            $payResult->productInfo = $productInfo->productInfo;                            // 产品信息
            $payResult->orderContentId = $productInfo->orderContentId;            // 订购内容标识
            $payResult->productPrice = $productInfo->productPrice;    // 产品描述
            $payResult->unit = $productInfo->unit;                // 单位（1.天、2.连续包月、3.单月、4.年、5.季、6.固定时长、7.按次）
            $payResult->cycle = $productInfo->cycle;                    // 周期
            $payResult->validstarttime = $productInfo->validstarttime;            // 开始时间
            $payResult->validendtime = $productInfo->validendtime;            // 结束时间
            $payResult->price = $productInfo->price;                    // 价格
            $payResult->bpPrice = "";                // 积分价格
            $payResult->displayPrority = $productInfo->displayPrority;         // 显示优先级
            $payResult->paymentType = $productInfo->paymentType;            // 支付方式
            $payResult->isSalesStrategy = $productInfo->isSalesStrategy;            // 是否包含营销批价
            $payResult->combineProduct = $productInfo->combineProduct;            // 产品属性
            $payResult->seqId = $payParamInfo->seqId;                // 订单号
            $payResult->accountIdentify = $payParamInfo->payParam->PayNum;            // 计费标识
            $payResult->payType = $payType;                    // 支付类型
            $payResult->subType = "03";                // 子支付类型
            $payResult->externalSeqNum = $payParamInfo->externalSeqNum;            // 支付流水号
            $payResult->payParam = json_encode($payParamInfo->payParam);        // 支付参数
            $payResult->authorizationNum = $result->authorizationNum;    // 鉴权序号（可能后续会有用）
            $payResult->orderSeq = $result->orderSeq;            // 订购序列号
            LogUtils::info("ADVOrderAction postPayResultEx ---> payResult:" . json_encode($payResult));
            PayAPI::postPayResultEx($payResult);  // 上报订购结果

            // 判断用户是否是VIP
            $isVip = UserManager::isVip(MasterManager::getUserId());

            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult($isVip);

            // 订购成功与否，把用户限制功能配置信息全局更新！！！
            UserManager::judgeAndCacheUserLimitInfoWith($isVip, $payResult->price, $orderItem);

            // 用户是否是VIP，更新到session中
            MasterManager::setVIPUser($isVip);
        }
        $this->ajaxReturn($result);
    }

    //青海移动订购数据上报
    public function upLoadAuthenticationAction()
    {
        $apkInfo = json_decode($_REQUEST['apkInfo']);
        $orderItem = json_decode($_REQUEST['orderItem']);
        $productInfo = json_decode($_REQUEST['productInfo']);
        $payParamInfo = json_decode($_REQUEST['payParamInfo']);
        $payType = isset($_REQUEST['payType']) ? $_REQUEST['payType'] : '16';

        if ($apkInfo == null || $apkInfo->loginAccount == null) {
            $apkInfo = MasterManager::getApkInfo();
            if (gettype($apkInfo) == 'string') {
                $apkInfo = json_decode($apkInfo);
            }
        }
        LogUtils::info("upLoadAuthenticationAction ---> payParamInfo:" . json_encode($payParamInfo));
        $consumeLocal = $apkInfo->epgProvince;

        $result = OrderManager::getInstance()->authentication();
        // 判断订购成功的话，上报订购结果
        LogUtils::info("upLoadAuthenticationAction ---> result:" . json_encode($result));
        if ($result) {
            // 上报订购结果给cws
            $payResult = new \stdClass();
            $payResult->userId = $apkInfo->loginAccount;                            // 用户ID (业务账号）
            $payResult->token = MasterManager::getUserToken();                    // 用户Token
            $payResult->terminalId = $apkInfo->snNum;                            // 机顶盒标识（stbId)
            $payResult->copyrightId = $payParamInfo->payParam->PayInfo->CooperateCode;         // 牌照方标识
            $payResult->contentId = $payParamInfo->payParam->PayInfo->ContentCode;            // 内容ID
            $payResult->subContentId = "";        // 咪咕子内容标识（暂不用，为空）
            $payResult->systemId = "0";            // 客户端类型
            $payResult->consumeLocal = $consumeLocal;            // 消费省份编码
            $payResult->consumeScene = "01";    // 消费场景
            $payResult->consumeBehaviour = "02";        // 消费行为
            $payResult->path = "";                    // 导航路径
            $payResult->preview = "";                // 试看标识
            $payResult->channelId = $payParamInfo->payParam->PayInfo->ChannelCode;                // 渠道ID
            $payResult->productCode = $payParamInfo->payParam->PayInfo->ProductCode;        // 产品ID
            $payResult->productInfo = $productInfo->productInfo;                            // 产品信息
            $payResult->orderContentId = $productInfo->orderContentId;            // 订购内容标识
            $payResult->productPrice = $productInfo->productPrice;    // 产品描述
            $payResult->unit = $productInfo->unit;                // 单位（1.天、2.连续包月、3.单月、4.年、5.季、6.固定时长、7.按次）
            $payResult->cycle = $productInfo->cycle;                    // 周期
            $payResult->validstarttime = $productInfo->validstarttime;            // 开始时间
            $payResult->validendtime = $productInfo->validendtime;            // 结束时间
            $payResult->price = $productInfo->price;                    // 价格
            $payResult->bpPrice = "";                // 积分价格
            $payResult->displayPrority = $productInfo->displayPrority;         // 显示优先级
            $payResult->paymentType = $productInfo->paymentType;            // 支付方式
            $payResult->isSalesStrategy = $productInfo->isSalesStrategy;            // 是否包含营销批价
            $payResult->combineProduct = $productInfo->combineProduct;            // 产品属性
            $payResult->seqId = $payParamInfo->seqId;                // 订单号
            $payResult->accountIdentify = $payParamInfo->payParam->PayNum;            // 计费标识
            $payResult->payType = $payType;                    // 支付类型
            $payResult->subType = "03";                // 子支付类型
            $payResult->externalSeqNum = $payParamInfo->externalSeqNum;            // 支付流水号
            $payResult->payParam = json_encode($payParamInfo->payParam);        // 支付参数
            $payResult->authorizationNum = $payParamInfo->seqId;//$result->authorizationNum;    // 鉴权序号（可能后续会有用）
            $payResult->orderSeq = $payParamInfo->seqId;///$result->orderSeq;            // 订购序列号
            LogUtils::info("upLoadAuthenticationAction postPayResultEx ---> payResult:" . json_encode($payResult));
            PayAPI::postPayResultEx($payResult);  // 上报订购结果

            // 判断用户是否是VIP
            $isVip = UserManager::isVip(MasterManager::getUserId());

            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult($isVip);

            // 订购成功与否，把用户限制功能配置信息全局更新！！！
            UserManager::judgeAndCacheUserLimitInfoWith($isVip, $payResult->price, $orderItem);

            // 用户是否是VIP，更新到session中
            MasterManager::setVIPUser($isVip);
        }
        $this->ajaxReturn($result);
    }

    /**
     * 安徽移动怡伴成功回调。
     * @throws \Think\Exception
     */
    public function payCallBackJSAction()
    {
        $ret = orderManager::getInstance()->payCallback();
        $this->ajaxReturn($ret);
    }

    /**
     * 获取订购回调通知（同步）地址
     */
    public function getPayCallbackUrlAction()
    {
        LogUtils::info("getPayCallbackUrlAction ---> indexUI url : " . 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
        $carrierId = isset($_REQUEST['lmcid']) ? $_REQUEST['lmcid'] : CARRIER_ID;
        $url = OrderManager::getInstance($carrierId)->buildPayCallbackUrl();
        $ret = array(
            'result' => empty($url) ? -1 : 0,
            'lmcid' => $carrierId,
            'pay_callback_url' => $url,
        );
        $this->ajaxReturn(json_encode($ret), 'EVAL');
    }

    /**
     * 吉林电信(魔方)获取用户手机号短信验证码
     */
    public function getCheckCodeAction()
    {
        if (CARRIER_ID == CARRIER_ID_JILINGDDX_MOFANG) {
            $orderInstance = new Pay10220095();
            $userPhone = $_REQUEST['userPhone'];
            $userAccount = MasterManager::getAccountId();
            $result = $orderInstance->getCheckCode($userPhone, $userAccount);
            $this->ajaxReturn(json_encode($result), 'EVAL');
        }
    }

    /**
     * 吉林电信(魔方)通过手机号进行支付
     */
    public function payByPhoneAction()
    {
        if (CARRIER_ID == CARRIER_ID_JILINGDDX_MOFANG) {
            $orderInstance = new Pay10220095();
            $orderId = $_REQUEST['orderId'];
            $payType = $_REQUEST['payType'];
            $checkCode = $_REQUEST['checkCode'];
            $userPhone = $_REQUEST['userPhone'];
            $result = $orderInstance->payByPhone($orderId, $payType, $userPhone, $checkCode);
            $this->ajaxReturn(json_encode($result), 'EVAL');
        }
    }

    /**
     * 吉林电信(魔方)通过账单进行支付
     */
    public function payByBillAction()
    {
        if (CARRIER_ID == CARRIER_ID_JILINGDDX_MOFANG) {
            $orderInstance = new Pay10220095();
            $orderId = $_REQUEST['orderId'];
            $payType = $_REQUEST['payType'];
            $result = $orderInstance->payByBill($orderId, $payType);
            $this->ajaxReturn(json_encode($result), 'EVAL');
        }
    }

    /**
     * 湖南电信提供给局方调用接口
     */
    public function qryRecommendProductInfoAction(){
        try{
            $orderManager = new Pay430002();
            $orderInfo = array();
            $orderInfo['userId'] = $_REQUEST['userId'];
            $orderInfo['usertoken'] = $_REQUEST['usertoken'];
            $orderInfo['assetId'] = $_REQUEST['assetId'];
            $result = $orderManager->getProductInfo($orderInfo);
            $this->ajaxReturn($result, 'JSON');
        }catch (Exception $e){
            LogUtils::info("qryRecommendProductInfoAction error, ,error=" . $e);
        }

    }

      /**
     * 吉林联通提供给局方调用接口
     */
    public function preCreateAction(){
        try{
            $url = $_REQUEST['url'];
            $orderInfo = array();
            $orderInfo['UserId'] = $_REQUEST['UserId'];
            $orderInfo['productId'] = $_REQUEST['productId'];
            $orderInfo['contentId'] = $_REQUEST['contentId'];
            $orderInfo['contentName'] = $_REQUEST['contentName'];//rawurlencode(mb_convert_encoding($_REQUEST['contentName'], 'GBK', 'utf-8'));;
            $orderInfo['ColumnId'] = $_REQUEST['ColumnId'];
            $orderInfo['areaCode'] = $_REQUEST['areaCode'];
            $orderInfo['platform'] = $_REQUEST['platform'];
            LogUtils::info("task preCreateAction url=" . $url);
            LogUtils::info("task preCreateAction orderInfo=" . json_encode($orderInfo));
            //$result = $this->httpPost($url,json_encode($orderInfo));
            $result = PayAPI::httpJsonPost($url,json_encode($orderInfo));
            $this->ajaxReturn(json_decode($result), 'JSON');
        }catch (Exception $e){
            LogUtils::info("preCreateAction error, ,error=" . $e);
        }
    }

    public function orderProductAction(){
        try{
            $url = $_REQUEST['url'];
            $orderInfo = array();
            $orderInfo['orderId'] = $_REQUEST['orderId'];
            $orderInfo['customerId'] = $_REQUEST['customerId'];
            $orderInfo['productId'] = $_REQUEST['productId'];
            $orderInfo['price'] = $_REQUEST['price'];
            $orderInfo['redirectUrl'] = urlencode($_REQUEST['redirectUrl']);
            $orderInfo['contentId'] = $_REQUEST['contentId'];
            $orderInfo['contentName'] = $_REQUEST['contentName'];//rawurlencode(mb_convert_encoding($_REQUEST['contentName'], 'GBK', 'utf-8'));
            $orderInfo['carrierId'] = $_REQUEST['carrierId'];

            LogUtils::info("task orderProductAction url=" . $url);
            LogUtils::info("task orderProductAction orderInfo=" . json_encode($orderInfo));
            //$result = $this->httpPost($url,json_encode($orderInfo));
            $result = PayAPI::httpJsonPost($url,json_encode($orderInfo));
            $result = json_decode($result);
            if($result->resultCode == '1'){
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $payInfo = array();
                $payInfo['PayUrl'] = urlencode($result->data);
                $payInfo['succCallbackUrl'] = $epgInfoMap['succCallbackUrl'];
                $payInfo['failCallbackUrl'] = $epgInfoMap['failCallbackUrl'];
                PayAPI::addUserPayUrl(json_encode($payInfo),$orderInfo['orderId'],1);
            }
            $this->ajaxReturn($result, 'JSON');
        }catch (Exception $e){
            LogUtils::info("preCreateAction error, ,error=" . $e);
        }
    }

    /**
     * @Brief:此函数用于产品取消续订接口
     */
    public function cancelOrderProductAction() {
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_CHINAUNICOM: // 中国联通EPG
                $orderInstance = new Pay000051();
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG: // 中国联通EPG
                $orderInstance = new Pay10000051();
                break;
            case CARRIER_ID_CHINAUNICOM_MEETLIFE: // 中国联通EPG
                $orderInstance = new Pay13000051();
                break;
            case CARRIER_ID_LDLEGEND: // 中国联通EPG
                $orderInstance = new Pay11000051();
                break;
            case CARRIER_ID_CHINAUNICOM_APK: // 中国联通-食乐汇APK
                $orderInstance = new Pay000006();
                break;
        }

        $result = $orderInstance->vipUserUnRegister();
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 获取产品信息
     */
    public function getProductInfoAction(){
        if (CARRIER_ID == CARRIER_ID_JILINGDDX_MOFANG) {
            $orderInstance = new Pay10220095();
            $result = $orderInstance->getProductInfo();
            $this->ajaxReturn($result,"EVAL");
        }
        if (CARRIER_ID == CARRIER_ID_WEILAITV_TOUCH_DEVICE) {
            $orderInstance = new Pay05001110();
            $result = $orderInstance->getProductInfo();
            LogUtils::info("getProductInfoAction result:".$result);
            $this->ajaxReturn($result,"EVAL");
        }
    }

    /**
     * 悦me获取权益码兑换二维码
     */
    public function getQrDataAction(){
        $url = QR_PATH;
        $orderInfo = array();
        $orderInfo['carrierId'] = CARRIER_ID;
        $orderInfo['userId'] = MasterManager::getUserId();
        $orderInfo['type'] = "10004";//10001-小程序问诊，10002-家庭档案，10003-健康检测，小程序权益兑换 -10004
        $payload = new \stdClass();
        $payload->carrierId = CARRIER_ID;
        $payload->userId = MasterManager::getUserId();
        $payload->QRCodeType = 1;
        $payload->serviceId = SERVICEID;
        $payload->channelId = CHANNELID;
        $orderInfo['payload'] = $payload;
        LogUtils::info("getQrDataAction orderInfo:".json_encode($orderInfo));
        $result = PayAPI::httpJsonPost($url,json_encode($orderInfo));
        LogUtils::info("getQrDataAction result:".$result);
        $this->ajaxReturn($result,"EVAL");
    }

    /**
     * 悦me权益账号鉴权
     */
    public function equityAuthAction(){
        $url = QYZX_URL.AUTH_PATH;
        $data = array();
        $data['carrierId'] = CARRIER_ID;
        $data['userId'] = MasterManager::getUserId();
        $data['iptvAccount'] = "";
        $data['phone'] = MasterManager::getAccountId();
        $data['bindIPTVAccountDate'] = "";
        LogUtils::info("equityAuthAction data:".json_encode($data));
        $result = PayAPI::httpJsonPost($url,json_encode($data));
        LogUtils::info("equityAuthAction result:".$result);
        $this->ajaxReturn($result,"EVAL");
    }

    /**
     * 悦me获得权益码数据
     */
    public function getEquityDataAction(){
        $url = QYZX_URL.CHENK_PATH;
        $data = array();
        $data['exchangeCode'] = $_REQUEST['code'];
        $data['userId'] = MasterManager::getUserId();
        LogUtils::info("CHENK_PATH data:".json_encode($data));
        $result = PayAPI::httpJsonPost($url,json_encode($data));
        LogUtils::info("CHENK_PATH result:".$result);
        $result_tmp = json_decode($result);
        if($result_tmp->code <> 0){
            $this->ajaxReturn($result,"EVAL");
            return;
        }

        $url = QYZX_URL.EQUITY_PATH;
        $data = array();
        $data['exchangeCode'] = $_REQUEST['code'];
        $data['serviceId'] = SERVICEID;
        $data['channelId'] = CHANNELID;
        LogUtils::info("getEquityDataAction data:".json_encode($data));
        $result = PayAPI::httpJsonPost($url,json_encode($data));
        LogUtils::info("getEquityDataAction result:".$result);
        $this->ajaxReturn($result,"EVAL");
    }

    /**
     * 悦me权益码兑换
     */
    public function exchangeCodeAction(){
        $url = QYZX_URL.CHENK_PATH;
        $data = array();
        $data['exchangeCode'] = $_REQUEST['code'];
        $data['userId'] = MasterManager::getUserId();
        LogUtils::info("chenk exchangeCode data:".json_encode($data));
        $result = PayAPI::httpJsonPost($url,json_encode($data));
        LogUtils::info("chenk exchangeCode result:".$result);
        $result_tmp = json_decode($result);
        if($result_tmp->code <> 0){
            $this->ajaxReturn($result,"EVAL");
            return;
        }

        $url = QYZX_URL.EQUITY_PATH;
        $data = array();
        $data['exchangeCode'] = $_REQUEST['code'];
        $data['serviceId'] = SERVICEID;
        $data['channelId'] = CHANNELID;
        LogUtils::info("get exchangeCode data:".json_encode($data));
        $equityData = PayAPI::httpJsonPost($url,json_encode($data));
        LogUtils::info("get exchangeCode result:".$equityData);
        $equityData = json_decode($equityData);
        $expireDay = 0;
        $expireDayUnit = 0;
        if($equityData->code == 0){
            $expireDay = $equityData->data->expireDay;
            $expireDayUnit = $equityData->data->expireDayUnit;
        }

        $url = QYZX_URL.EXCHANGE_PATH;
        $data = array();
        $data['carrierId'] = CARRIER_ID;
        $data['exchangeCode'] = $_REQUEST['code'];
        $data['expireDay'] = $expireDay;
        $data['expireDayUnit'] = $expireDayUnit;
        $data['serviceId'] = SERVICEID;
        $data['userId'] = MasterManager::getUserId();
        LogUtils::info("exchangeCode data:".json_encode($data));
        $result = PayAPI::httpJsonPost($url,json_encode($data));
        LogUtils::info("exchangeCode result:".$result);
        $result_tmp = json_decode($result);
        if($result_tmp->code == 0){
            $uploadData = array();
            $uploadData['userId'] = MasterManager::getUserId();
            $uploadData['carrierId'] = CARRIER_ID;
            $uploadData['isVip'] = 1;
            LogUtils::info("exchangeCodeAction uploadData:".json_encode($uploadData));
            $uploadRes = PayAPI::httpJsonPost(UPLOAD_PATH,json_encode($uploadData));
            LogUtils::info("exchangeCodeAction uploadRes:".$uploadRes);
        }
        $this->ajaxReturn($result,"EVAL");
    }
}