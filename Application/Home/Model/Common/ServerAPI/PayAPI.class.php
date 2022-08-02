<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/2
 * Time: 15:42
 */

namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

/**
 * Class PayAPI
 * 支付相关的接口
 *
 * @package Home\Model\ServerAPI
 */
class PayAPI
{
    /**
     * 获取订单号
     * @param $userId
     * @return mixed
     */
    static public function getLastOrder($userId)
    {
        $json = array();

        $http = new HttpManager(HttpManager::PACK_ID_LASTORDER);
        $http->setUserId($userId);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
     * 上传订购结果
     *
     * @param $userId
     * @param $unionPay 0否 1是（1，购买的是大包）
     * @param $orderInfo //包含如下信息
     *          'transactionID', 'result', 'description', 'purchaseType', 'expiredTime', 'subscriptionExtend', 'subscriptionID', 'productId', 'abstract'
     * @return mixed
     */
    static public function postPayResult($userId, $unionPay = 0)
    {
        LogUtils::info("sync user[$userId]=============> go postPayResult### " . json_encode($_REQUEST));

        if (!isset($_GET['transactionID'])) {
            LogUtils::error("cannot find transactionID!!!!!!!");
            return 0;
        }

        $description = rawurldecode(mb_convert_encoding($_GET['description'], 'utf-8', 'GBK'));
        // 处理并上报支付结果
        $orderInfo = array(
            'transactionID' => $_GET['transactionID'],
            'result' => $_GET['result'],
            'purchaseType' => $_GET['purchaseType'],
            'expiredTime' => $_GET['expiredTime'],
            'subscriptionExtend' => $_GET['subscriptionExtend'],
            'subscriptionID' => $_GET['subscriptionID'],
            'productId' => $_GET['productId'],
            'description' => $description,
            'abstract' => $_GET['abstract'],
            'reason' => $_GET['lmreason'],
            'unionPay'=> $unionPay,  // unionPay 0否 1是（1，购买的是大包）
            'carrierId' => CARRIER_ID,
        );

        if(isset($_GET['result'])){
            // 判断订购是否成功
            if ($orderInfo['result'] == 0) {
                MasterManager::setUserIsVip(1);
                LogUtils::info("set user[" . $userId . "] vip>>>>>> result:" . $orderInfo['result']);

                // 把订购是否成功的结果写入cookie，供页面使用
                MasterManager::setOrderResult(1);

            } else if ($orderInfo['result'] == 9304) {
                MasterManager::setUserIsVip(1);
                LogUtils::info("set user[" . $userId . "] vip>>>>>> result:" . $orderInfo['result']);
                MasterManager::setOrderResult(1);
            }
        }

        $str = $orderInfo['transactionID'] . "$" . $orderInfo['result'] . "$" . $orderInfo['purchaseType'] . "$" . $orderInfo['expiredTime'] . "$" . $orderInfo['subscriptionExtend'] . "$" . $orderInfo['subscriptionID'] . "$" . $orderInfo['description'] . "$" . MD5;
        LogUtils::info("post user[" . $userId . "] order result>>>>>>:" . $str);

        $abstract = md5($str);

        //去请求cws-pay系统
        $url = ORDER_CALLBACK;
        LogUtils::info("#############post user[" . $userId . "] order to cws url>>>>>>:" . $url);
        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $orderInfo,
        );

        $http = curl_init($url);
        curl_setopt_array($http, $options);
        $result = curl_exec($http);
        curl_close($http);
        LogUtils::info("#############post user[" . $userId . "] order to cws result>>>>>>:" . $result);
        return $result;
    }

    /**
     * 上报订购结果
     * @param $payResultInfo
     * @return mixed
     */
    static public function postPayResultEx($payResultInfo)
    {
        //去请求cws-pay系统
        $url = ORDER_CALL_BACK_URL;
        LogUtils::info("postPayResultEx --->url : " . $url);
        LogUtils::info("postPayResultEx --->param : " . json_encode($payResultInfo));
        $result = HttpManager::httpRequest("post", $url, $payResultInfo);

        LogUtils::info("postPayResultEx ---> result : " . json_encode($result));
        return $result;
    }

    /**
     * 上传退订结果
     * @param $userId
     * @param $orderInfo
     * @return mixed
     */
    static public function postUnsubscribeVipResultBy000051($userId, $orderInfo)
    {
        // 去请求cws-pay系统 退订
        $url = UNSUBSCRIBE_VIP_CALL_BACK_URL;

        $result = HttpManager::httpRequest("post", $url, $orderInfo);

        LogUtils::info("postUnsubscribeVipResultBy000051 ---> result : " . $result);
        return $result;
    }

    /**
     * @Brief:此函数用于上报退订数据上报接口（中国联通新接口）
     * @param: $param退订结果
     * @return: 上报结果
     */
    static public function postCancelOrderResultBy0000051($param) {
        // 去请求cws-pay系统 退订
        $url = CANCEL_VIP_CALL_BACK_URL;

        $result = HttpManager::httpRequest("post", $url, $param);

        LogUtils::info("postCancelOrderResultBy0000051 ---> result : " . $result);
        return $result;
    }

    /**
     * 上传订购结果
     *
     * @param $userId
     * @param $orderInfo //包含如下信息
     *          'transactionID', 'result', 'description', 'purchaseType', 'expiredTime', 'subscriptionExtend', 'subscriptionID', 'productId', 'abstract'
     * @return mixed
     */
    static public function postPayResultBy370093($userId, $orderInfo)
    {
        //去请求cws-pay系统
        $url = ORDER_CALL_BACK_URL;

        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $orderInfo,
        );

        $http = curl_init($url);
        curl_setopt_array($http, $options);
        $result = curl_exec($http);
        curl_close($http);

        return $result;
    }


    /**
     * 上传订购结果
     * @param $userId // 用户id
     * @param $orderInfo //包含如下信息
     *          'result','orderId', 'beginDate', 'endDate', 'validDays', 'autoRenew', 'productId', 'payMoney'
     * @return mixed
     */
    static public function postPayResultBy340092($userId, $orderInfo)
    {
        //去请求cws-pay系统
        $url = ORDER_CALL_BACK_URL;
        LogUtils::info("#############post user[" . $userId . "] order to cws url>>>>>>:" . $url);
        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $orderInfo,
        );

        $http = curl_init($url);
        curl_setopt_array($http, $options);
        $result = curl_exec($http);
        curl_close($http);
        LogUtils::info("#############post user[" . $userId . "] order to cws result>>>>>>:" . $result);
        return $result;
    }

    /**
     *  注册VIP-
     * 客户端与局方校验后注册vip（有效期为24个小时）,短暂的成为VIP
     * @param $userId
     * @return mixed
     */
    static public function regVip($userId)
    {
        $json = array();

        $http = new HttpManager(HttpManager::PACK_ID_REG_VIP);
        $http->setUserId($userId);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
     *  注销VIP
     * @param $userId
     * @return mixed
     */
    static public function unRegVip($userId)
    {
        $json = array();

        $http = new HttpManager(HttpManager::PACK_ID_UN_REG_VIP);
        $http->setUserId($userId);
        $result = $http->requestPost($json);

        return json_decode($result);
    }


    /**
     * 获取订购项
     * @param $userId
     * @return mixed
     */
    static public function getOrderItem($userId)
    {
        $json = array();

        $http = new HttpManager(HttpManager::PACK_ID_VIPTYPE);
        $result = $http->requestPost($json);

        return $result;
    }


    /**
     * 获取订单号
     * @param $orderItemId 订购项ID
     * @param int $orderReason 订购来源（100 开通vip  101 活动购买 102播放视频购买 103视频问诊购买 104问诊记录购买 105健康检测记录购买 106续费vip）
     * @param $remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
     * @param $contentId sp厂商的内容id
     * @param $orderType
     * @return mixed
     * @internal param $vidType
     */
    static public function getOrderNo($orderItemId, $orderReason = 102, $remark = null, $contentId = null, $orderType = 1)
    {
        // reason：订购来源（100 开通vip  101 活动购买 102播放视频购买 103视频问诊购买 104问诊记录购买 105健康检测记录购买 106续费vip）
        $json = array(
            "vip_id" => $orderItemId,
            "reason" => $orderReason,
            "remark" => $remark,
            "content_id" => $contentId,
            "order_type" => $orderType,
        );

        $http = new HttpManager(HttpManager::PACK_ID_GETORDER);
        $result = $http->requestPost($json);

        $tmpResult = json_decode($result);
        if ($tmpResult->result == -13) {
            MasterManager::setIsForbiddenOrder(1);
        } else {
            MasterManager::setIsForbiddenOrder(0);
        }

        return $result;
    }

    /**
     * 查询支付结果
     * @param $userId
     * @param $orderId
     * @return mixed
     */
    static public function queryOrderPayResult($userId, $orderId)
    {
        $json = array(
            "goods_type" => 1,
            "order_id" => $orderId
        );
        $http = new HttpManager(HttpManager::PACK_ID_IS_PAY);
        $http->setUserId($userId);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * @Brief:此函数用于拉取系统订购页规则配置.
     * @param: $areaCode 用户区域编码(比如中国联通山西：207)
     * @param: $subAreaCode 用户子区域编码（比如中国联通山西-太原：0351）
     * @return mixed json格式数据
     */
    public static function queryUserPayPageShowRuleEx($areaCode, $subAreaCode)
    {
        $json = array(
            "area_code" => $areaCode,
            "sub_area_code" => $subAreaCode
        );
        $http = new HttpManager(HttpManager::PACK_ID_ENTRY_PAYPAGE_RULE);
        $result = $http->requestPost($json);

        return $result;
    }

    static public function postPayResultBy630092($userId, $orderInfo)
    {
        //去请求cws-pay系统
        $url = ORDER_CALLBACK;

        $result = HttpManager::httpRequest("post", $url, $orderInfo);

        LogUtils::info("postPayResultBy630092 ---> result : " . $result);
        return $result;
    }

    static public function authenticationFor370092($userAccount,$accountType,$userToken){
        //设置请求参数
        $json = array(
            "user_account" => $userAccount,
            "account_type" => $accountType,
            "user_token" => $userToken,
        );
        $http = new HttpManager(HttpManager::PACK_ID_USER_AUTHENTICATION_FOR_SHANDOGNDX);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
      查询购买数量
     * @param $userId
     * @return mixed
     */
    static public function getBuyNum($buy_type)
    {
        $json = array(
            "user_id" => MasterManager::getUserId(),
            "buy_type" => $buy_type,
        );
        $http = new HttpManager(HttpManager::PACK_ID_QUERY_GUY_NUM);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    查询url
     * @param $userId
     * @return mixed
     */
    static public function getUserPayUrl($order_type)
    {
        $json = array(
            "order_type" => $order_type,
        );
        $http = new HttpManager(HttpManager::PACK_ID_QUERY_PAY_URL);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    添加url
     * @param $userId
     * @return mixed
     */
    static public function addUserPayUrl($url,$order_id,$order_type)
    {
        $json = array(
            "url" => $url,
            "order_id" => $order_id,
            "order_type" => $order_type,
        );
        $http = new HttpManager(HttpManager::PACK_ID_ADD_PAY_URL);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    购买数量更新
     * @param $userId
     * @return mixed
     */
    static public function addPayperBuyNum($order_id,$buy_type,$oper_type,$buy_num,$buy_entry)
    {
        $json = array(
            "order_id" => $order_id,
            "user_id" => MasterManager::getUserId(),
            "buy_type" => $buy_type,
            "oper_type" => $oper_type,
            "buy_num" => $buy_num,
            "buy_entry" => $buy_entry,
        );
        $http = new HttpManager(HttpManager::PACK_ID_ADD_GUY_NUM);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    开机活动校验用户是否是黑名单等
     * @param $userId
     * @return mixed
     */
    static public function getExtActivityVerif()
    {
        $json = array(
            "accountId" => MasterManager::getAccountId(),
        );
        $http = new HttpManager(HttpManager::PACK_ID_EXT_ACTIVITY_VERIF);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    校验用户是否是VIP等
     * @param $userId
     * @return mixed
     */
    static public function getExtVipVerif()
    {
        $json = array(
            "accountId" => MasterManager::getAccountId(),
        );
        $http = new HttpManager(HttpManager::PACK_ID_EXT_VIP_VERIF);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
     * 请求订单,第三方支付下单
     */
    static public function getTradeInfo($vipId)
    {
        //设置请求参数
        $json = array();
        if (isset($vipId)) {
            $json["vip_id"] = $vipId;
        }
        $http = new HttpManager(HttpManager::PACK_ID_USERBUYVIP_REQUEST_GET_ORDER);
        $result = $http->requestPost($json);

        return json_decode($result, false);
    }

    /**
     * 请求订单,第三方支付下单
     */
    static public function httpJsonPost($url, $jsonStr){
        try{
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonStr);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Content-Type: application/json; charset=utf-8',
                    'Content-Length: ' . strlen($jsonStr)
                )
            );
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            return $response;
        }catch (Exception $e){
            LogUtils::info("httpJsonPost error, ,error=" . $e);
        }
    }
}