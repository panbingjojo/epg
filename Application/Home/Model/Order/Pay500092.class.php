<?php
/**
 * Created by longmaster
 * @Brief: 主要处理重庆电信EPG的计费相关流程
 */

namespace Home\Model\Order;


use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\AlbumAPI;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\MainHome\MainHomeManager;
use Home\Model\User\UserManager;


class Pay500092 extends PayAbstract
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
        $isVip = MasterManager::getUserIsVip();
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
            return $ret;
        }
        $payInfo->orderType = 1;
        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($payInfo->vip_id, $payInfo->orderReason, $payInfo->remark, "", $payInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 创建失败
            $ret['result'] = $tradeInfo->result;
            return $ret;
        }
        // 鉴权失败说明用户可订购， 构建订购地址
        $payInfo->tradeId = $tradeInfo->order_id;
        $payInfo->userId = MasterManager::getUserId();
        // 订购的产品信息
        $productInfo = new \stdClass();
        switch ($payInfo->product_id)
        {
            case 1:
                $productInfo->productID = productID_OneMonth;        // 单包月
                $productInfo->PurchaseType = 2;
                break;

            case 2:
                $productInfo->productID = productID_ContMonth;        // 连续包月
                $productInfo->PurchaseType = 0;
                break;

            case 3:
                $productInfo->productID = productID_QuarPack;        // 包季度
                $productInfo->PurchaseType = 2;
                break;

            case 4:
                $productInfo->productID = productID_YearPack;        // 包年
                $productInfo->PurchaseType = 2;
                break;
            default:
                $payInfo->product_id = 2;
                $productInfo->productID = productID_ContMonth;        // 连续包月
                $productInfo->PurchaseType = 0;
        }

        $productInfo->MonthType = $payInfo->product_id;
        $EPGInfoMap = MasterManager::getEPGInfoMap();
        $productInfo->partner = $EPGInfoMap['partner'];
        $productInfo->serverPath = $EPGInfoMap['serverPath'];
        $productInfo->spID = SPID;
        $productInfo->passwordCryptKey = SP_KEY;
        $payInfo->lmreason = 0;

        // 用户信息
        $userInfo = new \stdClass();
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        LogUtils::info("Pay500092::buildPayUrl() ---> epgInfoMap: " . json_encode($epgInfoMap));

        // 通过缓存得到用户账号和token
        $userAccount = $epgInfoMap["userId"];
        $userToken = $epgInfoMap["userToken"];

        $userInfo->accountId = $userAccount;
        $userInfo->userToken = $userToken;
        $userInfo->stbId = $epgInfoMap['stbId'];

        $payUrl = $this->_buildPayUrl($userInfo, $payInfo, $productInfo);

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
        // TODO: Implement directToPay() method.
        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->userId = $userId;
            $orderInfo->isJointActivity = isset($_GET['isJointActivity']) ? $_GET['isJointActivity'] : 0; // 是否联合活动发起订购
            $orderInfo->contentId = isset($_GET['contentId']) ? $_GET['contentId'] : null;
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['singlePayItem']) ? $_GET['singlePayItem'] : 1;
            $orderInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
            $orderInfo->orderType = 1;
        }

        // 得到视频ID作为contentID
        $videoInfo = $orderInfo->videoInfo == null || empty($orderInfo->videoInfo) ?
            MasterManager::getPlayParams() : json_decode($orderInfo->videoInfo, true);
        $orderInfo->contentId = $videoInfo['videoUrl'];

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay500092::directToPay() ---> orderItems is empty");
            IntentManager::back();
            exit();
        }
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 生成订购单号失败
            LogUtils::info("Pay500092::directToPay() ---> 拉取订单失败:" . $tradeInfo->result);
            IntentManager::back();
            exit();
        }
        // 鉴权失败说明用户可订购， 构建订购地址
        $orderInfo->tradeId = $tradeInfo->order_id;

        // 订购的产品信息
        $productInfo = new \stdClass();
        $productInfo->productNo = productID_18;       // 产品编号
        $productInfo->productId = productID_ContMonth;        // 使用包月产品
        $productInfo->price = 1800;                     // 价格
        $productInfo->PurchaseType = 0;                 // 包月自动续费
        $orderInfo->lmreason = 0;
        $productInfo->MonthType = 2;


        $param = array(
            "userId" => $userId,
            "tradeNo" => $orderInfo->tradeId,
            "lmreason" => $orderInfo->lmreason != null ? $orderInfo->lmreason : 0,
            "lmcid" => $orderInfo->carrierId == null? MasterManager::getCarrierId() : $orderInfo->carrierId,
            "returnPageName" => $orderInfo->returnPageName,
            "isPlaying" => $orderInfo->isPlaying,
            "videoInfo" => $videoInfo,
            "MonthType" => $productInfo->MonthType,
        );

        $payCallbackUrl = $this->_buildPayCallbackUrl($param);

        // payParam封装请求参数
        $payParam = array();
        $payParam["productFlag"] = rawurlencode('rhb');
        $payParam["purposePath"] = rawurlencode('subscribe.html?index=4');
        $payParam["returnurl"] = rawurlencode(mb_convert_encoding($payCallbackUrl, 'GBK', 'utf-8'));

        $payUrl = USER_ORDER_URL; // 统一鉴权接口
        foreach ($payParam as $key => $val) {
            $payUrl .= $key . "=" . $val . "&";
        }

        LogUtils::info("Pay500092::directToPay() ---> payUrl:" . $payUrl);

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
        if ($payResultInfo == null) {
            LogUtils::info("Pay500092::payCallback ---> _GET: " . json_encode($_GET));
            $payResultInfo = new \stdClass();
            $payResultInfo->userId = $_GET['userId'];
            $payResultInfo->tradeNo = $_GET['tradeNo'];
            $payResultInfo->lmreason = $_GET['lmreason'];
            $payResultInfo->returnPageName = isset($_GET['returnPageName']) && $_GET['returnPageName'] != null
                ? $_GET['returnPageName'] : "";
            $payResultInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $payResultInfo->videoInfo = isset($_GET['videoInfo']) && $_GET['videoInfo'] != ""
                ? urldecode($_GET['videoInfo']) : null;
            $payResultInfo->MonthType = isset($_GET['MonthType']) ? $_GET['MonthType'] : 0;
            LogUtils::info("Pay500092::payCallback ---> payResultInfo: " . json_encode($payResultInfo));
        }

        $RST['carrierId'] = MasterManager::getCarrierId();
        $RST['TradeNo'] = $payResultInfo->tradeNo;
        $RST['transactionID'] =  isset($_GET['transactionID']) ? $_GET['transactionID'] : "";
        $RST['reason'] = $payResultInfo->lmreason;
        $RST['ValidStart'] = date('Y-m-d h:i:s', time());
        $RST['result'] = isset($_GET['result']) ? $_GET['result'] : -1;
        $RST['PayType'] = "1";

        $RST['orderInfo'] = $_GET['orderInfo'];
        $RST['productId'] = $_GET['productId'];
        $RST['productInfo'] = $_GET['productInfo'];
        if($RST['orderInfo'] == '1' && $RST['productId'] == 'pka10000000000000000070'){
            $RST['result'] = 0;
        }

        if($RST['result'] == 0 || $RST['result'] == 9304){
            switch ($payResultInfo->MonthType)
            {
                case 1:
                    $RST['ValidEnd'] = date('Y-m-d H:i:s',strtotime('+1 month'));
                    $RST['UnOrderTime'] = date('Y-m-d H:i:s',strtotime('+1 month'));
                    break;

                case 2:
                    $RST['ValidEnd'] = "2099-01-01";
                    $RST['UnOrderTime'] = "2099-01-01";
                    break;

                case 3:
                    $RST['ValidEnd'] = date('Y-m-d H:i:s',strtotime('+3 month'));
                    $RST['UnOrderTime'] = date('Y-m-d H:i:s',strtotime('+3 month'));
                    break;

                case 4:
                    $RST['ValidEnd'] = date('Y-m-d H:i:s',strtotime('+1 year'));
                    $RST['UnOrderTime'] = date('Y-m-d H:i:s',strtotime('+1 year'));
                    break;

                default:
                    $RST['ValidEnd'] = "2099-01-01";
                    $RST['UnOrderTime'] = "2099-01-01";
                    break;
            }
        } else {
            $RST['ValidEnd'] = date('Y-m-d h:i:s', time());
            $RST['UnOrderTime'] = date('Y-m-d h:i:s', time());
        }


        // 上报订购信息
        PayAPI::postPayResultEx($RST);
        LogUtils::info("payCallback RST:".json_encode($RST));

        if ($RST['result'] == 0 || $RST['result'] == 9304) {
            MasterManager::setUserIsVip(1);
            MasterManager::setOrderResult(1);
            LogUtils::info("payCallback[500092] pay success!!!!!!!!");
        } else {
            // 把订购是否成功的结果写入cookie，供页面使用
            MasterManager::setOrderResult(0);
        }

        if (($payResultInfo->lmreason != null && ($payResultInfo->lmreason == 2 || $payResultInfo->lmreason == 1))
            || ($payResultInfo->isIFramePay == 1)) {
            $intent = IntentManager::createIntent("wait");
            $intentUrl = IntentManager::intentToURL($intent);
            if (!TextUtils::isBeginHead($intentUrl, "http://")) {
                $intentUrl = "http://" . $_SERVER['HTTP_HOST'] . $intentUrl;  // 回调地址需要加上全局路径
            }
            LogUtils::info("Pay500092::payCallback() url:". $intentUrl);
            header("Location:" . $intentUrl);
            return;
        }

        // 判断用户是否是VIP，更新到session中
        $isVip = UserManager::isVip($payResultInfo->userId);
        // 如果是播放订购成功回来，则过去继续数据&& ($isVip == 1)
        $videoInfo = null;
        if ($payResultInfo->videoInfo != null && $payResultInfo->videoInfo != "") {
            $videoInfo = $payResultInfo->videoInfo;
        } else if ($payResultInfo->isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
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
        LogUtils::info("Pay500092::makeTransactionID() ---> transactionId:" . $transactionId);
        return $transactionId;
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
        $stbId = $userInfo->stbId;

        // 平台信息
        $platformType = MasterManager::getPlatformType();
        $faceType = $platformType == "hd" ? 5 : 6;

        // 组装回调地址
        $param = array(
            "userId" => $payInfo->userId,
            "tradeNo" => $payInfo->tradeId,
            "lmreason" => $payInfo->lmreason != null ? $payInfo->lmreason : 0,
            "lmcid" => $payInfo->carrierId == null? MasterManager::getCarrierId() : $payInfo->carrierId,
            "returnPageName" => $payInfo->returnPageName,
            "isPlaying" => $payInfo->isPlaying,
            "videoInfo" => $payInfo->videoInfo,
            "MonthType" => $productInfo->MonthType,
        );
        LogUtils::info("Pay500092::buildPayUrl() ---> payInfo: " . json_encode($payInfo));
        LogUtils::info("Pay500092::buildPayUrl() ---> param: " . json_encode($param));
        $payCallbackUrl = $this->_buildPayCallbackUrl($param);

        // payParam封装请求参数
        $payParam = array();
        $payParam["spID"] = rawurlencode(SPID);
        $payParam["passwordCryptKey"] = rawurlencode(SP_KEY);
        $payParam["productID"] = $productInfo->productID;                //是否允许积分订购
        $payParam["PurchaseType"] = $productInfo->PurchaseType;                //是否允许积分订购
        $payParam["partner"] = $productInfo->partner;
        $payParam["returnurl"] = rawurlencode(mb_convert_encoding($payCallbackUrl, 'GBK', 'utf-8'));

        // 局方订购地址
        $payUrl = $productInfo->serverPath . "service/OrderInfo.jsp?"; // 统一鉴权接口
        foreach ($payParam as $key => $val) {
            $payUrl .= $key . "=" . $val . "&";
        }
        $payUrl = substr($payUrl, 0, -1);

        //融合包订购新地址拼接
        $payUrl = $productInfo->serverPath . "landing.jsp?productFlag=rhb&purposePath=subscribe.html%3Findex%3D4&returnurl=".$payParam["returnurl"];

        LogUtils::info("Pay500092::_buildPayUrl() ---> payUrl: " . $payUrl);
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
        $intent->setParam("tradeNo", $param['tradeNo']);
        $intent->setParam("returnPageName", $param['returnPageName']);
        $intent->setParam("videoInfo", urlencode($param['videoInfo']));
        $intent->setParam("MonthType", $param['MonthType']);

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        LogUtils::info("Pay500092::_buildPayCallbackUrl()  payBackUrl" . $url);
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
                "transactionID" => $_GET['transactionID'],
                "description" => rawurldecode(mb_convert_encoding($_GET['description'], 'utf-8', 'GBK')),
                'result' => $_GET['result'],
                'purchaseType' => $_GET['purchaseType'],
                'expiredTime' => $_GET['expiredTime'],
                'subscriptionExtend' => $_GET['subscriptionExtend'],
                'subscriptionID' => $_GET['subscriptionID'],
                'productId' => $_GET['productId'],
                'abstract' => $_GET['abstract'],
                'reason' => $_GET['lmreason'],
                'carrierId' => isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID,
            );
        }

        $userAccount = $_GET['userAccount'];
        $userToken = $_GET['userToken'];

        // unionPay 0、非大包购买 1、购买的是大包
        $unionPay = $this->checkUserOrderType($userAccount, $userToken);
        $payResultInfo['unionPay'] = $unionPay;
        LogUtils::info("Pay500092::_uploadPayResult() ---> payResultInfo: " . json_encode($payResultInfo));

        if (!isset($payResultInfo['transactionID'])) {
            LogUtils::error("Pay500092::_uploadPayResult() ---> cannot find transactionID!!!!!!!");
            return 0;
        }

        // 判断订购是否成功
        if ($payResultInfo['result'] == 0 || $payResultInfo['result'] == 9304) {
            MasterManager::setUserIsVip(1);
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
        $selectUrl = USER_ORDER_QUERY . "OrderQuery?";
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
        $respond = HttpManager::httpRequest("GET", $selectUrl, "");
        LogUtils::info("Pay500092::authentication ---> authResult:" . $respond);
        $respond = rawurldecode($respond);
        $respond = explode("&", $respond);

        foreach ($respond as $key => $val) {
            $val = explode("=", $val);
            $respond[$key] = $val;
        }
        return $respond;
    }

    /**
     * @Brief:此函数用于根据用户的来源查询contentId
     *         如果用户是从专辑推荐位过来，就取专辑的视频；
     *         如果用户从其它推荐位过来，就取首页轮播的视频；
     * @return string : contentId内容id
     */
    private function queryVideoContentId()
    {
        $userFrom = MasterManager::getUserFromType();
        $lmSubId = MasterManager::getSubId();
        $platformType = MasterManager::getPlatformType();  //平台类型

        if ($userFrom == 1 && $lmSubId != null) {
            // 来自于专辑推荐位
            $contentId = AlbumAPI::getRandomContentIdByAlbum($platformType, $lmSubId);
            LogUtils::info("get content id [$contentId] from $lmSubId");
        } else {
            // 来自非专辑---就取首页轮播上的视频
            $contentId = MainHomeManager::getRandomContentIdByPollVideo();
            LogUtils::info("get content id [$contentId] poll video");
        }

        return $contentId;
    }

    /**
     * @Brief:此函数用于订购完成后，再向epg校验用户订购的类型（大包、小包）
     * @param $userAccount 用户业务帐号
     * @param $userToken 用户有效token
     * @return int : $unionPay 0否 1是（1，购买的是大包）
     */
    private function checkUserOrderType($userAccount, $userToken)
    {
        $unionPay = 0;
        $respond = $this->queryUserOrderDetail($userAccount, $userToken);
        $timestamp = Date('Ymdhms'); // 20171130121108

        if ($respond[1][0] == 0) {
            $result = json_decode($respond[2][1]);
            $count = count($result);
            for ($i = 0; $i < $count; $i++) {
                $expiredTime = $result[$i]->expiredTime;
                $productID = $result[$i]->productID;
                LogUtils::info(">>>>>>>>>>>>>>>>>>>> checkUserOrderType respond productID:" . $productID);
                if ($productID == PRODUCT_ID_27 || $productID == PRODUCT_ID_30) {
                    // 判断失效时间
                    if (strcmp($expiredTime, $timestamp) >= 0) {
                        $unionPay = 1;
                        break;
                    }
                }
            }
        }
        return $unionPay;
    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo() {
        // 得到一个视频ID作为contentId

        $EPGInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = $EPGInfoMap['userId'];
        $userToken = $EPGInfoMap['userToken'];
        $GroupId = $EPGInfoMap['GroupId'];
        $stbId = $EPGInfoMap['stbId'];
        $userIP = $EPGInfoMap['userIP'];
        $userMAC = $EPGInfoMap['userMAC'];
        $partner = $EPGInfoMap['partner'];
        $serverPath = $EPGInfoMap['serverPath'];

        $info = array(
            'accountId' => $userAccount,
            'userToken' => $userToken,
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platformType' => MasterManager::getPlatformType(),
            'userIP' => $userIP,
            'partner' => $partner,
            'serverPath' => $serverPath,
            'stbId' => $stbId,
            'GroupId' => $GroupId,
            'userMAC' => $userMAC,
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
        $orderInfo->isSinglePayItem = 1;
        $orderInfo->contentId = $userInfo->contentId;
        $orderInfo->lmreason = 1;
        $orderInfo->orderType = 0;

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            LogUtils::error("Pay500092::webPagePay ---> pay orderItem is empty");
            return $payUrl;
        }

        // 去第一个，默认包月对象
        $orderInfo->vipId = $orderItems[0]->vip_id;

        // 创建订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType); // 向CWS获取订单号
        LogUtils::info("Pay500092::webPagePay pay ---> tradeInfo: " . json_encode($tradeInfo));
        if ($tradeInfo->result == 0) {
            // 订购的产品信息
            $productInfo = new \stdClass();
            $productInfo->productNo = productID_18;       // 产品编号
            $productInfo->productId = PRODUCT_ID_18;        // 使用包月产品
            $productInfo->price = 1800;                     // 价格
            $productInfo->PurchaseType = 0;                 // 包月自动续费

            $orderInfo->tradeId = $tradeInfo->order_id;
            $payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        }
        LogUtils::info("webPagePay pay PayUrl: " . $payUrl);

        header("Location:" . $payUrl);
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl() {
        // 得到用户信息
        $info = $this->buildUserInfo();
        $userInfo = new \stdClass();
        $userInfo->accountId = $info["accountId"];
        $userInfo->userToken = $info["userToken"];
        $userInfo->partner = $info["partner"];
        $userInfo->serverPath = $info["serverPath"];
        $userInfo->stbId = $info["stbId"];

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
        $orderInfo->lmreason = 2;
        $orderInfo->orderType = 0;
        $orderInfo->videoInfo = "";

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay500092::buildDirectPayUrl() ---> orderItems is empty");
            return $payUrl;
        }
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[1]->vip_id;

        // 创建支付订单
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark, "", $orderInfo->orderType);
        if ($tradeInfo->result != 0) {
            // 生成订购单号失败
            LogUtils::info("Pay500092::buildDirectPayUrl() ---> 拉取订单失败:" . $tradeInfo->result);
            return $payUrl;
        }
        // 鉴权失败说明用户可订购， 构建订购地址
        $orderInfo->tradeId = $tradeInfo->order_id;

        // 订购的产品信息
        $productInfo = new \stdClass();
        $productInfo->productID = productID_ContMonth;        // 连续包月
        $productInfo->PurchaseType = 0;
        $productInfo->MonthType = 2;
        $productInfo->partner = $info['partner'];
        $productInfo->serverPath = $info['serverPath'];
        $productInfo->spID = SPID;
        $productInfo->passwordCryptKey = SP_KEY;

        $orderInfo->product_id = 2;
        $payUrl = $this->_buildPayUrl($userInfo, $orderInfo, $productInfo);
        // 跟上我方的订单号：
        LogUtils::info("Pay500092::buildDirectPayUrl() ---> payUrl:" . $payUrl);
        if (!empty($payUrl)) {
            $payUrl = $payUrl . "&lmTradeNo=" . $tradeInfo->order_id;
        }
        return $payUrl;
    }
}