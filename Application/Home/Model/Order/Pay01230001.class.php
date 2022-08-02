<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 01230001：[黑龙江移动]
// +----------------------------------------------------------------------
// | 功能说明：此类用于计费订购等流程
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/01/28 16:16
// +----------------------------------------------------------------------

namespace Home\Model\Order;


use Home\Model\Common\CookieManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\User\UserManager;

class Pay01230001 extends PayAbstract
{

    /**
     * @param $payInfo //鉴权的产品信息，如果产品信息为空，则之间鉴权我方包月产品
     * @return mixed //1-vip 0-非vip
     */
    public function authentication($payInfo = null)
    {
        // 注：在启动Splash时会调用易视腾SDK鉴权，由Android端返回结果解析，并保存到Session中。故，黑龙江的局方鉴权结果直接从缓存Session中取出。
        $result = MasterManager::getUserTypeAuth();
        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] ---> getUserTypeAuth() result: ' . $result);
        $isVip = $result == 1 ? IS_VIP : NOT_VIP;
        return $isVip;
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
    public function buildPayInfo($payInfo = null)
    {
        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] : buildPayInfo!');

        // 返回参数
        $ret = array(
            'result' => RET_FAIL,
            'msg' => 'Failed',
            'payInfo' => array(),
        );

        // 得到input参数
        $lmuid = $payInfo['lmuid'];
        $lmVipId = $payInfo['lmVipId'];
        $lmVipType = $payInfo['lmVipType'];
        $lmOrderReason = $payInfo['lmOrderReason'];
        $lmRemark = $payInfo['lmRemark'];

        // 如果传递的VIP套餐id为空，则先向cws请求得到配置的VIP套餐
        if (empty($lmVipId)) {
            $orderItems = OrderManager::getOrderItems($lmuid);
            if (count($orderItems) <= 0) {
                LogUtils::error('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] : No Order-Items Configured!!!');
                $ret['result'] = -1;
                $ret['msg'] = 'Trying to fetch vip configs failed!';
                return $ret;
            } else {
                $lmVipId = $orderItems[0]->vip_id;
            }
        }

        // 向cws请求创建支付订单
        $orderInfo = OrderManager::createPayTradeNo($lmVipId, $lmOrderReason, $lmRemark);
        if (is_object($orderInfo) && $orderInfo->result == 0) {
            // 获取订单成功
            $payInfo['lmOrderId'] = $orderInfo->order_id;//获取到order_id

            // sdk订购接口所需参数（contentName/productId/spToken/payPhone）
            $payInfo['contentName'] = CONTENT_NAME;
            $payInfo['productId'] = PRODUCT_ID;
            $payInfo['spToken'] = SP_TOKEN;
            $payInfo['payPhone'] = PAY_PHONE;

            $payInfo = self::_bindExtrasPayInfo($payInfo);//创建订购参数
            $ret['result'] = 0;
            $ret['payInfo'] = $payInfo;
            $ret['msg'] = 'Success';
            LogUtils::info('PayInfo:'.implode($payInfo));
        } else {
            // 获取订单失败
            $ret['result'] = $orderInfo->result;
            $ret['msg'] = !empty(get_cws_error_msg($orderInfo->result)) ? get_cws_error_msg($orderInfo->result) : "生成订单号失败" . ($orderInfo->result == -1 ? "(已是VIP用户)" : "");
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
        return;
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
     * 生成调用我方订购回调（同步）的地址 - 我方调用
     * @param null $payResultInfo
     * @return mixed
     */
    public function buildPayCallbackUrl($payResultInfo = null)
    {
        // 参数信息
        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] ---> 构建我方订购回调通知地址（同步）>>> [所有参数_REQUEST]: ' . json_encode($_REQUEST));

        $payResultInfo = array(
            // 这些参数为订购前到订购后，透传字段：
            //      1.我方相关参数 "lmuid/lmcid/lmOrderId/lmOrderReason/lmVipId/lmVipType/lmRemark/lmBackPage/"
            //      2.产品包信息 "productId/price/payPrice/renewStatus/payType"
            'lmuid' => $this->requestFilter('lmuid', MasterManager::getUserId(), false),
            'lmcid' => $this->requestFilter('lmcid', MasterManager::getCarrierId(), false),
            'lmOrderId' => $this->requestFilter('lmOrderId', '', false),//我方生成的订单id
            'lmOrderReason' => $this->requestFilter('lmOrderReason', '', false),
            'lmVipId' => $this->requestFilter('lmVipId', '', false),
            'lmVipType' => $this->requestFilter('lmVipType', '', false),
            'lmRemark' => $this->requestFilter('lmRemark', '', false),
            'lmBackPage' => $this->requestFilter('lmBackPage', '', false),
            'lmRefreshOnly' => $this->requestFilter('lmRefreshOnly', 0, false),//由前端透传控制：订购成功是否仅仅刷新当前页（当且仅当为1时），或者默认lmBackPage返回！
            'payResultFlag' => $this->requestFilter('payResultFlag', -1, false),//特别注意：局方订购成功结果标志（1-成功，0或其它-失败）：在pay.js中根据sdk计费同步结果创建并写入该变量，用于该类识别此次订购成功与否！！
            // 产品包信息
            'productId' => $this->requestFilter("productId", PRODUCT_ID),//产品包ID
            'price' => $this->requestFilter("price", PAY_PRICE),//产品包原价
            'payPrice' => $this->requestFilter("payPrice", PAY_PRICE),//产品包实际支付价格（分）
            'renewStatus' => $this->requestFilter("renewStatus", 1),//续订状态：0:不续订；1:续订
            'payType' => $this->requestFilter("payType", ""),//支付方式
        );

        // 封装回调通知的目标地址url并返回
        $intent = IntentManager::createIntent('payCallback');
        foreach ($payResultInfo as $key => $value) {
            $intent->setParam($key, $value);
        }

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, 'http://')) {
            $url = 'http://' . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }

        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] ---> 构建我方订购回调通知地址（同步）>>> [生成的url地址]: ' . $url);

        return $url;
    }

    /**
     * 直接到局方订购
     * @param null $orderInfo
     * @return mixed
     */
    public function directToPay($orderInfo = null)
    {
        return;
    }

    /**
     * 订购回调接口（同步）- 我方调用
     * @param null $payResultInfo
     * @throws \Think\Exception
     */
    public function payCallback($payResultInfo = null)
    {
        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] ---> 订购回调结果（同步）获取参数 >>> [所有参数_REQUEST]: ' . json_encode($_REQUEST));

        if ($payResultInfo == null) {
            // 这些参数为订购前到订购后，透传字段：
            //      1.我方相关参数 "lmuid/lmcid/lmOrderId/lmOrderReason/lmVipId/lmVipType/lmRemark/lmBackPage/"
            //      2.产品包信息 "productId/price/payPrice/renewStatus/payType"
            $payResultInfo = new \stdClass();
            $payResultInfo->lmuid = $this->requestFilter('lmuid', MasterManager::getUserId(), false);
            $payResultInfo->lmOrderId = $this->requestFilter('lmOrderId', '', false);//我方生成的订单id
            $payResultInfo->lmOrderReason = $this->requestFilter('lmOrderReason', '', false);
            $payResultInfo->lmVipId = $this->requestFilter('lmVipId', '', false);
            $payResultInfo->lmVipType = $this->requestFilter('lmVipType', '', false);
            $payResultInfo->lmRemark = $this->requestFilter('lmRemark', '', false);
            $payResultInfo->lmBackPage = $this->requestFilter('lmBackPage', '', false);
            $payResultInfo->lmRefreshOnly = $this->requestFilter('lmRefreshOnly', 0, false); //由前端透传控制：订购成功是否仅仅刷新当前页（当且仅当为1时），或者默认lmBackPage返回！
            $payResultInfo->payResultFlag = $this->requestFilter('payResultFlag', -1, false);//特别注意：局方订购成功结果标志（1-成功，0或其它-失败）：在pay.js中根据sdk计费同步结果创建并写入该变量，用于该类识别此次订购成功与否！！
            // 产品包信息
            $payResultInfo->productId = $this->requestFilter("productId", PRODUCT_ID);//产品包ID
            $payResultInfo->price = $this->requestFilter("price", PAY_PRICE);//产品包原价
            $payResultInfo->payPrice = $this->requestFilter("payPrice", PAY_PRICE);//产品包实际支付价格（分）
            $payResultInfo->renewStatus = $this->requestFilter("renewStatus", 1);//续订状态：0:不续订；1:续订
            $payResultInfo->payType = $this->requestFilter("payType", "");//支付方式
        }

        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] --->订购回调结果（同步）获取参数 : ' . json_encode($payResultInfo));

        $isVip = null;
        if ($payResultInfo->payResultFlag == 1) {
            // 到我方注册成为vip，不关心注册是否成功
            UserManager::regVip(MasterManager::getUserId());
            $isVip = 1;
            MasterManager::setOrderResult(1); //把订购是否成功的结果写入cookie，供页面使用
        } else {
            $isVip = 0;
            MasterManager::setOrderResult(0); //把订购是否成功的结果写入cookie，供页面使用
        }

        // 向我方cws上报订购结果（注意：我们定义与局方异步通知asyncPayCallback携带的参数保持一致！）
        $uploadPayResultInfo = self::reform_payback_result_param(
            $payResultInfo->lmOrderId,
            $payResultInfo->productId,
            $payResultInfo->price,
            $payResultInfo->payPrice,
            $payResultInfo->renewStatus,
            $payResultInfo->payType
        );

        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] ---> 上报订购回调结果（同步） : ' . json_encode($uploadPayResultInfo));

        if (!empty($uploadPayResultInfo['lmOrderId'])) {
            self::uploadPayResultToCWS($uploadPayResultInfo);
        } else {
            LogUtils::error('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] ---> 拒绝上报订购回调结果（同步） : orderId 为空！！！');
        }

        // 判断用户是否是VIP，更新到session中
        MasterManager::setVIPUser($isVip);

        // 判断说明：
        //    由于产品需求调整，在某些外部模块点击订购（例如：在线问医，免费次数用完弹窗提示，点击确认按键触发情景），不跳转到我们统一的展示订购页（即首次确认页）了，
        // 而是直接调起局方订购页（或SDK订购界面）。如此缺省中间的统一展示页及其内部封装好的各个前后环节逻辑，就不得不进行调整。
        //    简单调整后，当订购成功（亦即是走到当前回调通知方法）时，我们需要先通过“前端一开始透传的是否刷新当前页标志”来判断。若为1（表示从某些外部模块触发）时，则
        // 认为是在非统一展示订购页触发的，完成后立即刷新当前页即可。否则，默认根据lmBackPage返回指定上一页。
        if ($payResultInfo->lmRefreshOnly == 1) {
            $reloadUrl = $_SERVER['HTTP_REFERER'];
            LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] ---> 上报订购回调结果（同步） : 外部模块直接订购，直接刷新当前页... ReloadURL=' . $reloadUrl);
            header("location: $reloadUrl");
        } else {
            LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] ---> 上报订购回调结果（同步） : 统一确认订购页入口订购，返回指定上一页... BackPageName=' . $payResultInfo->lmBackPage);
            IntentManager::back($payResultInfo->lmBackPage);
        }
    }

    /**
     * 订购回调结果（异步）- 局方调用（只有成功才会通知！） TODO 新易腾计费接口，目前无异步通知（已问过），暂时忽略该asyncPayCallback旧方法
     * @param null $payResultInfo
     */
    public function asyncPayCallback($payResultInfo = null)
    {
        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] ---> 局方订购回调通知地址（异步）>>> [_GET参数]: ' . json_encode($_GET));
        echo "ok";//局方计费要求回应"ok"，切勿不回或者回复其它！！！
    }

    /**
     * 统一重组封装来自局方订购回调通知携带的所有参数到一个array中(8个元素)。因为我方收到订购回调通知后，需要上报订购结果信息到我方cws上。
     * 由于会有2个回调通知（同步和异步），每次收到成功订购的通知后，我们都会到本地cws上报这些订购结果参数信息。所以，固定统一封装这些参数
     * 以保持后台cws读取一致性！
     *
     * <pre>注：
     *      同步通知：Android计费SDK通知，由于易视腾计费SDK订购成功后也只会有order_id参数，没有其它的诸如"gameId, extStr等"，所以
     * 这种情况我们需要手动构造，因为这些参数我们都是知道的，通过我们申请的计费项参数就可以查看到。
     *      异步通知：直接由局方通知，例如：http://notifyUrl?gameId=001&orderId=100000000000&billingIndex=000000001&billingFee=1000&billingPrice=1000&billingCount=1&extStr=customString&sign=3d341b6edc433f48411ff508c9fc3d2c
     * </pre>
     *
     * @param $lmOrderId //我方生成的唯一订单id
     * @param $productId //产品包ID
     * @param $price //产品包原价（分）
     * @param $payPrice //产品包实际支付价格（分）
     * @param $renewStatus //续订状态：0:不续订；1:续订
     * @param $payType //支付方式
     * @return array
     */
    private static function reform_payback_result_param($lmOrderId, $productId, $price, $payPrice, $renewStatus, $payType)
    {
        $payResultInfo = array(
            // 我方相关参数
            'lmOrderId' => $lmOrderId,          //我方生成的唯一订单id
            // 产品包相关信息
            'productId' => $productId,          //产品包ID
            'price' => $price,                  //产品包原价（分）
            'payPrice' => $payPrice,            //产品包实际支付价格（分）
            'renewStatus' => $renewStatus,      //续订状态：0:不续订；1:续订
            'payType' => $payType,              //支付方式
        );
        return $payResultInfo;
    }

    /**
     * 退订回调结果
     * @param null $unPayResultInfo
     * @return mixed
     */
    public function unPayCallback($unPayResultInfo = null)
    {
        return;
    }

    /**
     * 生成订购参数，并附加到原始参数 $payInfo 中！
     *
     * @param null $payInfo
     * @return bool|string
     */
    private static function _bindExtrasPayInfo($payInfo)
    {
        $payInfo['timestamp'] = date("YmdHis");
        return $payInfo;
    }

    /**
     * 上报订购结果到cws-pay系统
     * @param array $payResultInfo
     */
    private static function uploadPayResultToCWS(array $payResultInfo)
    {
        $uploadInfo = [];
        foreach ($payResultInfo as $key => $value) { // 局方的订购回调信息
            $uploadInfo[$key] = $value;
        }
        PayAPI::postPayResultEx($uploadInfo);
    }

    public function buildPayUrl($payInfo = null)
    {
        return $this->buildPayInfo($payInfo);
    }

    /**
     * 对 [request] 参数进行特殊字符过滤，防止js跨站攻击
     * @param $str
     * @param $defaultStr (请求参数不存在时的默认值)
     * @param $isFilter (true对请求的参数过滤，false:不过滤)
     * @return string
     */
    public function requestFilter($str, $defaultStr = "", $isFilter = true)
    {
        if (!$isFilter) {
            return isset($_REQUEST[$str]) ? $_REQUEST[$str] : $defaultStr;
        }
        return isset($_REQUEST[$str]) ? htmlspecialchars($_REQUEST[$str]) : $defaultStr;
    }
}
