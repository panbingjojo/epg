<?php

namespace Home\Model\Order;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\AlbumAPI;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Video\VideoManager;

class Pay220001 extends PayAbstract
{

    // 订购支付相关服务器地址
    // const ORDER_SERVER_ADDRESS = "http://111.26.158.122:8008/orders"; // 测试环境
    const ORDER_SERVER_ADDRESS = "http://100.83.3.30:8008/orders";
    // 账户状态查询服务器地址
    // const PHONE_ORDER_SERVER_ADDRESS = "http://111.26.158.122:8008/phoneOrders"; // 测试环境
    const PHONE_ORDER_SERVER_ADDRESS = "http://100.83.3.30:8008/phoneOrders"; // 现网环境
    // 鉴权地址
    // const AUTH_SERVER_ADDRESS = "http://111.26.158.122:8088/auth/serviceAuth"; // 测试环境
    const AUTH_SERVER_ADDRESS = "http://100.83.3.30:8088/auth/serviceAuth"; // 现网环境
    // 查询黑名单状态地址
    // const CHECK_BLACKLIST_USER_ADDRESS = "http://100.83.3.29:9080/valuedas/api/1.0/whiteblack/checkblack"; // 测试环境
    const CHECK_BLACKLIST_USER_ADDRESS = "http://100.83.3.25:8188/valuedas/api/1.0/whiteblack/checkblack";
    // 广电分配产品ID
    const PRODUCT_ID = "1100000481";
    // 广电大包订购产品ID
    const PRODUCT_COMMON_ID = "1100011741";
    // 广电分配产品名称
    const PRODUCT_NAME = "电视家庭医生";
    // 广电分配SP编码
    const SP_ID = "102";
    // 账号支付类型
    const PHONE_PAY_TYPE = "9";
    // 账号支付备注
    const PHONE_PAY_REMARK = "39健康账号支付";

    /**
     * @param object $isVip 在我方是否是vip
     * @return mixed
     */
    public function authentication($isVip = null)
    {
        $result = $this->serviceAuth();
        // 解析鉴权结果判断当前是否VIP
        $authInfo = json_decode($result);
        $productId = self::PRODUCT_ID;
        $productCommonId = self:: PRODUCT_COMMON_ID;
        // 吉林移动新增局方大包鉴权逻辑
        $authResult = $authInfo->$productId;
        $authResultCommon = $authInfo->$productCommonId;
        LogUtils::info("serviceAuth authResult:" . $authResult->result . ", authResultCommon:" . $authResultCommon->result);
        return $authResultCommon->result == 0 || $authResult->result == 0;
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
     * 进入订购界面前，特殊处理并将需要渲染的参数返回
     * -- 此处返回局方设置的产品信息
     */
    public function payShow()
    {
        $productInfo = $this->queryProductInfo(self::PRODUCT_ID);
        $info = MasterManager::getApkInfo();
        if (gettype($info) == 'string') {
            $info = json_decode($info);
        }
        $extraData = array(
            "payCheck" => $info->payCheck,
            "productInfo" => json_decode($productInfo),
        );
        return json_encode($extraData);
    }

    /**
     * 构建到局方的订购参数
     * @param null $payInfo
     * @return false|mixed|string
     * @throws \Think\Exception
     */
    public function buildPayInfo($payInfo = null)
    {
        $ret['result'] = 0;
        $ret['payInfo'] = $payInfo;

        return json_encode($ret);
    }

    /**
     * 我方订购页构建到局方的退订地址
     * @param null $payInfo
     * @return mixed
     */
    public function buildUnPayUrl($payInfo = null)
    {
        return;
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function directToPay($orderInfo = null)
    {
        return;
    }

    /**
     * 订购回调接口
     * @param null $payResultInfo
     * @return mixed
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {

    }

    /**
     * 订购结果显示界面前，特殊处理并将需要渲染的参数返回
     */
    public function payShowResult($payController = null)
    {
        return array(
            "isSuccess" => $_GET["isSuccess"],
            "msg" => $_GET["msg"]
        );
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
     * @param null $payInfo
     * @return string
     * @throws \Think\Exception
     */
    private function _buildPayCallbackUrl($payInfo = null)
    {

        return '';
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
            $videoInfos = VideoManager::getRecommennd(MasterManager::getUserId(), 0);
            $contentId = json_decode($videoInfos->data[0]->ftp_url)->gq_ftp_url;
            LogUtils::info("get content id [$contentId] poll video");
        }

        return $contentId;
    }

    /**
     * 构建订购返回地址
     * @param null $param
     * @return string
     */
    private function _buildUnPayCallbackUrl($param = null)
    {
        return;
    }

    /**
     * 生成订购参数,附加到$payInfo中
     * @param $payInfo
     * @return mixed
     * @throws \Think\Exception
     */
    private function _buildPayInfo($payInfo)
    {

        return array();
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
    public function buildUserInfo()
    {
        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'userToken' => MasterManager::getUserToken(),
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platformType' => MasterManager::getPlatformType(),
        );

        return $info;
    }

    /**
     * 通过web浏览器进行订购
     * @param null $userInfo
     * @return mixed
     */
    public function webPagePay($userInfo)
    {
        return 0;
    }

    /**
     * 查询套餐信息
     * @param string $productIds 产品编号（多个“-”分隔）
     * @return mixed|string 产品套餐信息
     */
    public function queryProductInfo($productIds)
    {
        // 1、构建请求地址
        $url = self::ORDER_SERVER_ADDRESS . "/fees/" . $productIds;
        LogUtils::debug("Pay220001-->getProductInfo-->url-->" . $url);
        // 2、发起请求
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::debug("Pay220001-->getProductInfo-->result-->" . $result);
        return $result;
    }

    private function serviceAuth()
    {
        // 吉林移动新增局方大包鉴权逻辑
        $header = array(
            "productId" => self::PRODUCT_ID . "," . self::PRODUCT_COMMON_ID,    // 产品编号，多个“,“分隔
            "userId" => MasterManager::getAccountId(),       // IPTV账号
            "contentId" => "",    // 内容编号
            "chargesType" => "1,1", // 订购类型（0-单⽚，1-包⽉） // 吉林移动新增局方大包鉴权逻辑
        );
        $url = self::AUTH_SERVER_ADDRESS . $this->jointUrlParams($header);
        LogUtils::debug("Pay220001-->serviceAuth-->url-->" . $url);
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::debug("Pay220001-->serviceAuth-->result-->" . $result);
        return $result;
    }

    /** 检测当前用户是否在订购 true代表是黑名单用户，false代表正常用户 */
    public function checkUserInBlacklist()
    {
        $ret = false;
        $params = array(
            "iptvid" => MasterManager::getAccountId(),
        );
        $url = self::CHECK_BLACKLIST_USER_ADDRESS . $this->jointUrlParams($params);
        // 1、发起Http请求，获取结果
        LogUtils::debug("Pay220001-->checkUserInBlacklist-->url-->" . $url);
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::debug("Pay220001-->checkUserInBlacklist-->result-->" . $result);
        /* 返回示例
         * {
            code: 0, // 响应码（0-成功，其他-失败）
            data: 1, // 账号状态数据（0-黑名单用户，1-正常用户)
            message: "成功", // 响应信息
            }
         * */
        // 2、对结果进行解析
        $resultObj = json_decode($result);
        if ($resultObj->code == 0) {
            $ret = $resultObj->data == 0;
        }
        return $ret;
    }

    /**
     * 预订单接口
     * @param array $orderParams 预订单接口所需参数
     * @return mixed|string 预订单接口返回结果
     */
    public function serviceOrder($orderParams)
    {
        // cws端执行生成订单操作
        $orderInfo = OrderManager::createPayTradeNo($orderParams['vipId'], $orderParams['orderReason'], $orderParams['remark']);
        if ($orderInfo->result != 0) {
            // 创建失败
            $ret['code'] = $orderInfo->result;
            $ret['message'] = "创建订单失败";
            LogUtils::info("Pay220001-->serviceOrder--->获取订单失败：" . $ret['result']);
            return json_encode($ret);
        }
        $orderParams['tradeNo'] = $orderInfo->order_id;
        // 保存后续上传的cws端的参数
        MasterManager::setPayCallbackParams(json_encode($orderParams));
        $apkInfo = MasterManager::getApkInfo();
        if (gettype($apkInfo) == 'string') {
            $apkInfo = json_decode($apkInfo);
        }
        $header = array(
            "spId" => self::SP_ID, // 服务提供商编号（由⼴电分配）
            "productId" => self::PRODUCT_ID, // 产品编号
            "userId" => MasterManager::getAccountId(), // IPTV账号
            // "productName" => self:: PRODUCT_NAME, // 产品名称
            "chargesType" => "1", // 订购类型（0-单⽚，1-套餐）
            "productType" => "0", // 产品类型（0-电影，1-电视剧）
            "areaId" => $apkInfo->areaId, // 区位码
            "cycleType" => $orderParams['cycleType'], // 包时⻓周期类型（1-⽉卡，2-季卡，3-半年卡，4-年卡， 5 -周卡， 6-三⽇卡）
            "customerRenew" => $orderParams['customerRenew'], // 客户续订意愿（0-⾮⾃动续订，1-⾃动续订）
            "fee" => $orderParams['fee'], // 价格（分）
        );
        $url = self::ORDER_SERVER_ADDRESS . "/service_order" . $this->jointUrlParams($header);
        LogUtils::debug("Pay220001-->serviceOrder-->url-->" . $url);
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::debug("Pay220001-->serviceOrder-->result-->" . $result);
        $result = json_decode($result);
        $result->order_id = $orderInfo->order_id;
        $result = json_encode($result);
        return $result;
    }

    /**
     * 查询当前订单相关二维码
     * @param string $payType ⽀付⽅式（1-微信，2-⽀付宝）
     * @param string $orderId 订单编号
     * @return mixed|string 相关支付方式二维码
     */
    public function queryQRCode($payType, $orderId)
    {
        // 1、构建请求地址
        $url = self::ORDER_SERVER_ADDRESS . "/qrCode/" . $payType . "/" . $orderId;
        LogUtils::debug("Pay220001-->queryQRCode-->url-->" . $url);
        // 2、发起请求
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::debug("Pay220001-->queryQRCode-->result-->" . $result);
        return $result;
    }

    /**
     * 查询当前订单的状态
     * @param string $orderId 订单编号
     * @return mixed|string
     *  -- code 响应状态（0-成功，其他-失败）
     *  -- status 订单状态（1-⽀付成功，2-⽀付失败，3-未⽀付，4-超时）
     */
    public function queryOrderStatus($orderId)
    {
        // 1、构建请求地址
        $url = self::ORDER_SERVER_ADDRESS . "/status/" . $orderId;
        LogUtils::debug("Pay220001-->queryOrderStatus-->url-->" . $url);
        // 2、发起请求
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::debug("Pay220001-->queryOrderStatus-->result-->" . $result);
        return $result;
    }

    /**
     * 查询接口是否黑名单用户
     * @return mixed|string
     *  -- code 接⼝返回码（0-正常⽤户，2异常⽤户，6-移动侧未返回任何信息）
     */
    public function isBlackListUser()
    {
        // 1、构建请求地址
        $url = self::PHONE_ORDER_SERVER_ADDRESS . "/iptvAccountQry?IPTVAccount=" . MasterManager::getAccountId();
        LogUtils::debug("Pay220001-->isBlackListUser-->url-->" . $url);
        // 2、发起请求
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::debug("Pay220001-->isBlackListUser-->result-->" . $result);
        return $result;
    }

    /**
     * 查询用户余额
     * @return mixed|string 当前用户信息状态
     */
    public function queryUserBalance()
    {
        // 1、构建请求地址
        $url = self::PHONE_ORDER_SERVER_ADDRESS . "/status?IPTVAccount=" . MasterManager::getAccountId();
        LogUtils::debug("Pay220001-->queryUserBalance-->url-->" . $url);
        // 2、发起请求
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::debug("Pay220001-->queryUserBalance-->result-->" . $result);
        return $result;
    }

    public function payByPhone($payParams)
    {
        // 组装参数
        $param = array(
            "IPTVAccount" => MasterManager::getAccountId(), // IPTV账号
            "orderId" => $payParams['orderId'], // 订单号
            "productId" => self::PRODUCT_ID, // 产品编码
            "productName" => self::PRODUCT_NAME, // 产品名称
            "autoRenew" => $payParams['autoRenew'], // 是否⾃动续订
            "price" => $payParams['price'], // 价格（分）
            "remark" => self::PHONE_PAY_REMARK, // 订单备注
            "payType" => self::PHONE_PAY_TYPE, // ⽀付⽅式（9账号⽀付）
            "orderType" => $payParams['orderType'], //订购类型（1新增订购 2续订）
        );
        $header = array(
            'Content-type: application/json;charset=utf-8',
        );
        $url = self::PHONE_ORDER_SERVER_ADDRESS . "/phonePay";

        LogUtils::info("Pay220001-->payByPhone-->request:" . $url . " --->param:" . json_encode($param));
        $result = HttpManager::httpRequestByHeader("POST", $url, $header, json_encode($param));
        LogUtils::info("Pay220001-->payByPhone-->result" . $result);

        return $result;
    }

    public function insertOrderInfo($orderInfo)
    {
        LogUtils::info("Pay220001-->insertOrderInfo-->orderInfo" . json_encode($orderInfo));

        if ($orderInfo == null) {
            return json_encode(['result' => -1, 'msg' => 'failed upload! argument is null.']);
        }

        $orderParams = json_decode(MasterManager::getPayCallbackParams());
        $authResult = json_decode($this->serviceAuth());
        $productId = self::PRODUCT_ID;
        $authInfo = $authResult->$productId;
        $postJson = array(
            'tradeNo' => $orderParams->tradeNo,                 //朗玛：我方生成的订单号
            'payTime' => $orderInfo['payTime'],                   //局方：支付时间，例如“2019-05-27 15:15:26”
            'endTime' => $authInfo->expiredTime,                //局方：结束时间，例如“2019-05-28 23:59:00”
            'customerRenew' => $orderParams->customerRenew,     //局方：续订状态: 0-单月 1-连续包月 2-连续包月（已经取消续订）
            'fee' => $orderParams->fee,                         //局方：价格（分）
            'payType' => $orderInfo['payType'],                   //局方：支付类型 1:微信二维码 2:支付宝二维码 9:账号支付
            'reason' => $orderParams->orderReason,              //朗玛：订购触发条件
        );

        // 执行上报订购结果
        $uploadPayResult = PayAPI::postPayResultEx($postJson);
        LogUtils::info("Pay220001-->insertOrderInfo-->[上报订购][input_params]" . json_encode($postJson));
        LogUtils::info("Pay220001-->insertOrderInfo-->[上报订购][result]" . $uploadPayResult);

        // 把订购是否成功的结果写入cookie，供页面使用
        MasterManager::setOrderResult(1);

        // 如果是播放订购成功回来，去继续播放($isVip == 1)
        $videoInfo = null;
        if ($orderParams->isRoutePlayer == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        }
        LogUtils::info("Pay220001-->insertOrderInfo-->videoInfo" . $videoInfo);

        // $isVip = UserManager::isVip($orderInfo->userId);
        MasterManager::setVIPUser(1);
        if ($orderParams->isRoutePlayer == 1 && $videoInfo != null && $videoInfo != "") {
            // 继续播放
            LogUtils::info("Pay220001-->insertOrderInfo-->jump player!");
            $objPlayer = IntentManager::createIntent("player");
            $objPlayer->setParam("userId", $orderParams->userId);
            $objPlayer->setParam("isPlaying", $orderParams->isRoutePlayer);
            $objPlayer->setParam("videoInfo", json_encode($videoInfo));
            IntentManager::jump($objPlayer);
        } else if ($orderParams->backPage != "" && $orderParams->orderReason != 221) {
            LogUtils::info("Pay220001-->insertOrderInfo-->jump returnPageName-->" . $orderParams->backPage);
            $objReturn = IntentManager::createIntent($orderParams->backPage);
            IntentManager::jump($objReturn);
        }

        return json_encode(['result' => 0, 'msg' => 'success upload!']);
    }

    /**
     * get请求字符串参数拼接
     * @param array $params 参数数组
     * @return false|string 已经拼接的参数
     */
    private function jointUrlParams($params)
    {
        $urlParams = "?";
        foreach ($params as $key => $value) {
            $urlParams .= $key . "=" . $value . "&";
        }
        return substr($urlParams, 0, -1);
    }

    public function buildPayUrl($payInfo = null)
    {

    }
}