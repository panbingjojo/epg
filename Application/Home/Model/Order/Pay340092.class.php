<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/8/23
 * Time: 下午3:02
 */

namespace Home\Model\Order;


use Home\Common\Tools\AesTool;
use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;

class Pay340092 extends PayAbstract
{
    /**
     * 用户到局方鉴权
     * @param $param
     * @return mixed
     */
    public function authentication($param = null)
    {
        // TODO: Implement authentication() method.
        $isVip = 0;     // 是不是vip，初始化为0 表示不是vip

        // 方便于调试，后续会删掉, 在测试服上，鉴权会失败
        if (LOCATION_TEST == 1) {
            return 0;
        }

        //创建鉴权参数
        $payInfo = new \stdClass();
        $payInfo->orderId = "";
        $payInfo->userAccount = MasterManager::getAccountId();
        $payInfo->productId = PRODUCT_ID;
        $payInfo->price = PRODUCT_PRICE;

        // 对订购信息进行加密
        $orderInfo = $this->_buildOrderInfo($payInfo);

        // 构建鉴权地址
        $authenticationUrl = USER_ORDER_URL . "has_order?"
            . "providerId=" . "lm"
            . "&orderInfo=" . rawurlencode($orderInfo);

        LogUtils::info("Pay340092::authentication() ---> authenticationUrl: " . $authenticationUrl);

        $result = HttpManager::httpRequest("GET", $authenticationUrl, "");
        LogUtils::info("Pay340092::authentication() ---> authentication result: " . $result);
        $result = $result != null && $result != "" ? json_decode($result) : "";
        if (!empty($result) && $result->respCode == 0) {
            if ($result->ordered == 1) { // 已订购
                // 已经定购--{"respCode":0,"validDays":30,"ordered":1,"respMsg":"OK","autoRenew":1,"endDate":"2018-04-15 23:59:59","beginDate":"2018-03-16 11:42:08","orderId":"2018031648991001"}
                // 没有定购--{"respCode":0,"ordered":0,"respMsg":"OK"}
                // 是否还在有效期内
                $endDate = $result->endDate;
                if ($endDate == "" || $endDate == null) {
                    // 订购有效期的结束时间，如果为空，则表明订购新增且未通知成功。---认为是VIP状态
                    $isVip = 1;
                } else {
                    $today = date("Y-m-d h:i:s");
                    if (strcmp($endDate, $today) >= 0) {
                        $isVip = 1;
                    }
                }
            }
        }
        LogUtils::info("Pay340092::authentication() ---> authentication  isVip: " . $isVip);
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
    }

    /**
     * 我方订购页构建到局方的订购地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildPayUrl($payInfo = null)
    {
        // TODO: Implement buildPayUrl() method.
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
        LogUtils::info("Pay340092::directToPay ---> start");
        $userId = MasterManager::getUserId();
        if ($orderInfo == null) {
            $orderInfo = new \stdClass();
            $orderInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $orderInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $orderInfo->remark = isset($_GET['remark']) ? $_GET['remark'] : null;
            $orderInfo->orderReason = isset($_GET['orderReason']) ? $_GET['orderReason'] : 102;
            $orderInfo->isSinglePayItem = isset($_GET['singlePayItem']) ? $_GET['singlePayItem'] : 1;
            $orderInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
            $orderInfo->userId = $userId;
            $orderInfo->carrierId = MasterManager::getCarrierId();
        }

        //拉取订购项
        $orderItems = OrderManager::getOrderItem($userId);
        if (count($orderItems) <= 0) {
            //TODO 错误处理
            LogUtils::error("Pay340092::directToPay() ---> orderItems is empty");
            IntentManager::back();
            exit();
        }
        // 直接订购，使用第一个订购项（包月订购项）。
        $orderInfo->vipId = $orderItems[0]->vip_id;
        $orderInfo->productId = PRODUCT_ID;


        // 创建订单号
        $tradeInfo = OrderManager::createPayTradeNo($orderInfo->vipId, $orderInfo->orderReason, $orderInfo->remark);
        if ($tradeInfo->result != 0 || $tradeInfo->order_id == null || $tradeInfo->order_id == "") {
            LogUtils::info("Pay340092::directToPay() ---> 拉取订单失败:" . $tradeInfo->result);
            IntentManager::back();
        }
        $orderInfo->tradeNo = $tradeInfo->order_id;

        $orderInfo->lmreason = 1;
        $payUrl = $this->_buildPayUrl($orderInfo);

        $orderInfo->lmreason = 0;
        $postPayUrl = $this->_buildPayUrl($orderInfo);
        if (!TextUtils::isBeginHead($postPayUrl, "http://")) {
            $postPayUrl = "http://" . $_SERVER['HTTP_HOST'] . $postPayUrl;  // 回调地址需要加上全局路径
        }
        OrderManager::uploadOrderInfo(MasterManager::getUserId(), $postPayUrl, 1);

        if (empty($payUrl)) {
            IntentManager::back();
            exit();
        }
        header('Location:' . $payUrl);
        exit();
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
        $orderSuccess = false;  // 订购结果

        // 得到缓存的播放视频信息
        $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;

        // 清空播放缓存信息
        MasterManager::setPlayParams(null);

        if ($payResultInfo == null) {
            $payResultInfo = new \stdClass();
            $payResultInfo->provideId = $_GET['providerId'];
            $payResultInfo->userId = isset($_GET['userId']) ? $_GET['userId'] : MasterManager::getUserId();
            $payResultInfo->errorInfo = $_GET['errorInfo'] ? $_GET['errorInfo'] : null;
            $payResultInfo->tradeInfo = $_GET['tradeInfo'] ? $_GET['tradeInfo'] : null;
            $payResultInfo->isPlaying = isset($_GET['isPlaying']) ? $_GET['isPlaying'] : 0;
            $payResultInfo->returnPageName = isset($_GET['returnPageName']) ? $_GET['returnPageName'] : "";
            $payResultInfo->videoInfo = isset($_GET['videoInfo']) ? $_GET['videoInfo'] : "";
            $payResultInfo->tradeNo = isset($_GET['tradeNo']) ? $_GET['tradeNo'] : "";
            $payResultInfo->lmreason = isset($_GET['lmreason']) ? $_GET['lmreason'] : "";
            $payResultInfo->carrierId = isset($_GET['lmcid']) ? $_GET['lmcid'] : MasterManager::getCarrierId();
        }
        LogUtils::info("Pay340092::payCallback() ---> payResultInfo:" . $payResultInfo);

        if ($payResultInfo->errorInfo == null && $payResultInfo->tradeInfo == null) {
            // 如果中途退出。返回上一页
            IntentManager::back();
            exit();
        }
        if ($payResultInfo->provideId == PROVIDER_ID && $payResultInfo->tradeInfo != null) {
            $tradeInfo = Crypt3DES::decode340092($payResultInfo->tradeInfo, KEY_3DES);
            LogUtils::info("Pay340092::payCallback() ---> tradeInfo:" . $tradeInfo);

            // 转化订单信息字符串为数组，上报结果
            $tradeInfoTemp = explode('|', $tradeInfo);
            $tradeInfoArray = array();
            foreach ($tradeInfoTemp as $key => $value) {
                $item = explode('=', $value);
                $tradeInfoArray[$item[0]] = $item[1];
            }
            $tradeInfoArray['result'] = 0;
            $tradeInfoArray['reason'] = $payResultInfo->lmreason;
            $tradeInfoArray['carrierId'] = isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID;
            LogUtils::info("Pay340092::payCallback() ---> upload payResultInfo:" . json_encode($tradeInfoArray));
            PayAPI::postPayResultEx($tradeInfoArray);

            $orderSuccess = true;
        } else if ($payResultInfo->errorInfo != null) {
            // 订购返回错误信息，有可能是已经订购
            LogUtils::info("Pay340092::payCallback() ---> errorInfo:" . $payResultInfo->errorInfo);
            $errorInfoArray = json_decode($payResultInfo->errorInfo, true);
            if ($errorInfoArray['respCode'] == 1021) {
                // respCode==1021 表示用户在局方已经订购过。
                UserManager::regVip($payResultInfo->userId); // 我们平台注册vip
                MasterManager::setUserIsVip(1);; // 缓存到缓存中。
                MasterManager::setOrderResult(1); // 表示订购成功，用来通知页面
                // 增加属性用于上报结果
                $errorInfoArray['result'] = 0;
                $errorInfoArray['reason'] = $payResultInfo->lmreason;
                $orderSuccess = true;
            } else {
                MasterManager::setOrderResult(0); // 表示订购失败，用来通知页面
                $orderSuccess = false;
            }
            $tradeInfoArray['carrierId'] = isset($_GET['lmcid']) ? $_GET['lmcid'] : CARRIER_ID;
            PayAPI::postPayResultEx($errorInfoArray);
        }

        echo "success"; // 打印这个给TV增值业务平台
        if ($orderSuccess) {
            MasterManager::setUserIsVip(1);;
            MasterManager::setOrderResult(1); // 表示订购成功
        } else {
            MasterManager::setUserIsVip(0);
            MasterManager::setOrderResult(0); // 表示订购成功
        }

        LogUtils::info("Pay340092::payCallback() ---> orderSuccess:" . $orderSuccess);
        if ($orderSuccess && ($payResultInfo->isPlaying == 1)) {
            // 如果是播放视频 订购成功，直接进入播放器播放视频

            $objPlayer = IntentManager::createIntent();
            $objPlayer->setPageName("player");
            $objPlayer->setParam("userId", $payResultInfo->userId);
            $objPlayer->setParam("isPlaying", $payResultInfo->isPlaying);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));

            IntentManager::jump($objPlayer);
        } else {
            //返回上一页
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
     * @Brief:此函数用于向用户中心获取EPG用户的手机号码
     * @param $userAccount
     * @param $uniqueCode
     * @return int|string : $userPhone 用户绑定的手机号码
     */
    public function getUserPhoneNumberFromEPG($userAccount, $uniqueCode)
    {
        // 方便于调试，后续会删掉
        if (LOCATION_TEST == 1) {
            return "";
        }

        /**
         *
         * 请求param的数据结构
         * {
         * "cols":
         * [
         * "activityPhone"
         * ],
         * "itvaccount ": 'test',
         * "uniqueCode": "1488345218583a1234"
         * }
         */
        $userPhone = ""; // 用户电话号码
        $param = array(
            "cols" => ["activityPhone"],
            "itvaccount" => $userAccount,
            "uniqueCode" => $uniqueCode
        );
        LogUtils::info("Pay340092::getUserPhoneNumberFromEPG() --->  param: " . json_encode($param));

        // MD5加密
        $map = array("params" => json_encode($param));
        $signData = $this->_getMD5Sign($map, EPG_SIGN_KEY);
        $param['sign'] = $signData;

        // AES CBC加密
        $AesEncodeData = AesTool::encryptCBCModel(json_encode($param), KEY_AES, ENCRYPT_IV);

        $decodeData = AesTool::decryptCBCModel($AesEncodeData, KEY_AES, ENCRYPT_IV); // 解码
        LogUtils::info("Pay340092::getUserPhoneNumberFromEPG() --->  decode postData: " . $decodeData);

        $postData = "params=" . $AesEncodeData;


        LogUtils::info("Pay340092::getUserPhoneNumberFromEPG() ---> request url: " . QUERY_EPG_USER_TELEPHONE_URL .
            " ---> postData: " . $postData);

        $result = HttpManager::httpRequest("post", QUERY_EPG_USER_TELEPHONE_URL, $postData);

        LogUtils::info("Pay340092::getUserPhoneNumberFromEPG() ---> query result: " . $result);

        // 解析请求所得到的数据
        /**
         * {"msg":"成功","resultCode":20000000,"content":{"total":1,"items":[{"activityPhone":"{\"13692218270\":\"{}\",
         * \"13343215555\":\"{}\",\"13312345555\":\"{}\",\"13655551236\":\"{}\",\"13512345555\":\"{}\",\"13555555557\":\"{}\",
         * \"13555555555\":\"{}\",\"13566666666\":\"{}\",\"1355555555\":\"{}\",\"13588888888\":\"{}\",\"12345678901\":\"{}\",
         * \"00000000000\":\"{}\",\"13301584734\":\"{}\",\"15375223690\":\"{}\",\"13228232183\":\"{}\",\"13228232188\":\"{}\",
         * \"13228232187\":\"{}\",\"15305513920\":\"{}\",\"15375352747\":\"{}\",\"18358196136\":\"{}\",\"13739277182\":\"{}\",
         * \"17705141333\":\"{}\",\"18055130405\":\"{}\",\"13714566106\":\"{}\",\"18664988605\":\"{}\",\"13333333333\":\"{}\",
         * \"18900520852\":\"{}\",\"18156998221\":\"{}\",\"13155281663\":\"{}\",\"13305612017\":\"{}\",\"13966156548\":\"{}\",
         * \"13305612710\":\"{}\",\"13810981695\":\"{}\",\"19956832552\":\"{}\",\"18656456605\":\"{}\",\"17755156386\":\"{}\",
         * \"15055172420\":\"{}\",\"18056094910\":\"{}\"}","itvaccount":"pwg253"}]}}
         */
        $result = json_decode($result);
        if ($result->resultCode == 20000000) {
            LogUtils::info("Pay340092::getUserPhoneNumberFromEPG() ---> start parse phone number! ");
            $content = $result->content;
            $items = $content->items;
            $item = $items[0];
            $activityPhone = $item->activityPhone;

            LogUtils::info("Pay340092::getUserPhoneNumberFromEPG() ---> activityPhone: " . $activityPhone);

            $phoneArray = json_decode($activityPhone, true); // 转成数据，再提提取key
            // 第一个电话号码是最新绑定的，所以目前我们只取第一个号码，如果有需要，再获取其它的
            foreach ($phoneArray as $key => $value) {
                $userPhone = $key;
                break;
            }
        }

        LogUtils::info("Pay340092::getUserPhoneNumberFromEPG() ---> userPhone: " . $userPhone);
        return $userPhone;
    }

    /**
     * 构建局方订购信息需要的加密订购信息
     * @param $payInfo
     * @return string
     */
    private function _buildOrderInfo($payInfo)
    {
        $strPayInfo = "orderId=" . $payInfo->orderId
            . "|" . "itvAccount=" . $payInfo->userAccount
            . "|" . "productId=" . $payInfo->productId
            . "|" . "price=" . $payInfo->price;

        LogUtils::info("Pay340092::_buildOrderInfo() --->  strPayInfo: " . $strPayInfo);

        $orderInfo = Crypt3DES::encode340092($strPayInfo, KEY_3DES);

        LogUtils::info("Pay340092::_buildOrderInfo() --->  orderInfo: " . $orderInfo);
        return $orderInfo;
    }

    /**
     * @param $orderInfo
     * @return string
     */
    private function _buildPayUrl($orderInfo)
    {
        $payUrl = "";

        $payInfo = new \stdClass();
        $payInfo->orderId = $orderInfo->tradeNo; // 订单号
        $payInfo->userAccount = MasterManager::getAccountId();
        $payInfo->productId = PRODUCT_ID;
        $payInfo->price = PRODUCT_PRICE;

        $orderInfo3Des = $this->_buildOrderInfo($payInfo);

        if ($orderInfo3Des != null) {
            // 生成订购回调地址
            $param = array(
                "userId" => $orderInfo->userId,
                "tradeNo" => $orderInfo->tradeNo,
                "lmreason" => $orderInfo->lmreason != null ? $orderInfo->lmreason : 1,
                "lmcid" => $orderInfo->carrierId,
                "returnPageName" => $orderInfo->returnPageName,
                "isPlaying" => $orderInfo->isPlaying,
                "videoInfo" => $orderInfo->videoInfo,
            );
            $payCallbackUrl = $this->_buildPayCallbackUrl($param);

            $orderParam = array(
                "commonImgsView" => COMMON_IMGS_VIEW,
                "providerId" => PROVIDER_ID,
                "orderInfo" => urlencode($orderInfo3Des),
                "orderUrl" => urlencode(USER_ORDER_URL . "initial_order"),
                "returnUrl" => urlencode($payCallbackUrl),
                "notifyUrl" => urlencode($payCallbackUrl),
            );

            $intent = IntentManager::createIntent("directPay");
            $intent->setParam("orderParam", rawurlencode(json_encode($orderParam)));

            $payUrl = IntentManager::intentToURL($intent);
//            if (!TextUtils::isBeginHead($payUrl, "http://")) {
//                $payUrl = "http://" . $_SERVER['HTTP_HOST'] . $payUrl;  // 回调地址需要加上全局路径
//            }
        }

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
        $intent->setParam("tradeNo", $param['tradeNo']);
        $intent->setParam("lmreason", $param['lmreason']);
        $intent->setParam("lmcid", $param['lmcid']);
        $intent->setParam("returnPageName", $param['returnPageName']);
        $intent->setParam("isPlaying", $param['isPlaying']);

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        return $url;
    }

    /**
     * @Brief:此函数用于对数据进行md5加密
     * @param $map
     * @param $signKey
     * @return string : $paramMD5Encode 加密后并进行大写化的数据
     */
    private function _getMD5Sign($map, $signKey)
    {
        $keys = array_keys($map);
        sort($keys);

        $stringBuilder = $signKey;

        foreach ($keys as $key => $value) {
            $param = $map[$value];
            if (!empty($param)) {
                $stringBuilder = $stringBuilder
                    . $value
                    . $param;
            }
        }

        // md5 编码后转大写
        $paramMD5Encode = strtoupper(md5($stringBuilder));
        return $paramMD5Encode;
    }

    /**
     * @brief: 构建由外部直接调用的订购页url
     * @return null|string
     */
    public function buildDirectPayUrl() {
        return null;
    }
}