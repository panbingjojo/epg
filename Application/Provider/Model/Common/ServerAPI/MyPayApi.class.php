<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [订购] 模块API：提供给第三方
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/5/15 18:30
// +----------------------------------------------------------------------


namespace Provider\Model\Common\ServerAPI;

use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;
use Provider\Model\Common\MyHttpManager;
use Provider\Model\Common\MyUtil;

class MyPayApi
{
    /**
     * 第三方订购回调通知我方。
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param $json //请求参数json。例如：四川广电510094，调用接口所需的参数。
     * @return mixed|\stdClass
     */
    public static function doCallback($head, $json)
    {
        $lmcid = MasterManager::getCarrierId();

        $retObj = new \stdClass();
        $retObj->code = -1;
        $retObj->msg = "Sorry! Now it doesn't support for the area [$lmcid].";

        switch ($lmcid) {
            case CARRIER_ID_SICHUANGD:
                self::payCallback510094($head, $json, $retObj);
                break;
            default:
                break;
        }

        LogUtils::info("[" . __FILE__ . "][" . __FUNCTION__ . "] ---> [$lmcid][result]: " . json_encode($retObj));

        return $retObj;
    }

    // 四川广电订购成功回调
    private static function payCallback510094($head, $json, $retObjClass)
    {
        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $vipPackIdMap = json_decode(json_encode($thirdAppInfo->vip_pack_id_map), true);
        $payPackageType = $vipPackIdMap[$json->vip_pack_id]; //通过四川广电EPG（第三方君吉实现）传来的订购vip套餐id做映射支付套餐类型，以上报cws

        // 校验客户端传递的开始时间格式，须遵循："yyyy-MM-dd HH:mm:ss"或"yyyy/MM/dd HH:mm:ss"
        $DT_REG_EXPR = "/^([12]\d\d\d)([-|\/])(0?[1-9]|1[0-2])([-|\/])(0?[1-9]|[12]\d|3[0-1]) ([0-1]\d|2[0-4]):([0-5]\d)(:[0-5]\d)?$/";
        if (preg_match($DT_REG_EXPR, $json->start_date, $matches)) {
            LogUtils::info("[" . __FILE__ . "][" . __FUNCTION__ . "] \"start_date($json->start_date)\" is a valid date_time string(within \"yyyy-MM-dd HH:mm:ss or yyyy/MM/dd HH:mm:ss\")" . json_encode($matches));
            $startDT = $json->start_date; //客户端传递start_date格式规范
        } else {
            $startDT = time(); //客户端传递start_date格式不规范，以当前服务器时间作为start_date
            LogUtils::info("[" . __FILE__ . "][" . __FUNCTION__ . "] \"start_date($json->start_date)\" is an invalid date_time string(beyond \"yyyy-MM-dd HH:mm:ss\" or \"yyyy/MM/dd HH:mm:ss\")! Using now($startDT)...");
        }
        switch ($payPackageType) {
            case 1://电视门诊（单次）
            case 2://电视门诊（包月）
                $expireDT = date("Y-m-d H:m:s", strtotime("+1months", strtotime($startDT)));
                break;
            case 3://电视门诊（包半年）
                $expireDT = date("Y-m-d H:m:s", strtotime("+6months", strtotime($startDT)));
                break;
            case 4://电视门诊（包年）
                $expireDT = date("Y-m-d H:m:s", strtotime("+1years", strtotime($startDT)));
                break;
            default://兼容保护，默认有效期1个月
                $expireDT = date("Y-m-d H:m:s", strtotime("+1months", strtotime($startDT)));
                break;
        }

        $data = array(
            // 会话参数
            'lmUserId' => $head->lm_userId,
            'lmSessionId' => $head->lm_sessionId,
            'lmLoginId' => $head->lm_loginId,

            // 其它参数
            'payPackageType' => $payPackageType,            //支付套餐类型（1、电视门诊（单次）   2、电视门诊（5次）（包月） 3、高血压管理包（包年） 4、糖尿病管理基础包（包年） 5、糖尿病管理增值包（包年） 6、健康管理包（包年））
            'orderId' => $json->order_id,                   //订单号
            'productId' => $json->vip_pack_id,               //产品ID
            'accountId' => $json->account_id,               //用户账号（机顶盒号）
            'startDate' => $json->start_date,               //开始时间
            'expireDate' => $expireDT,                      //过期时间
            'extraParam' => $json->extra_param, //扩展参数 （局方真正返回的订购详细参数可以组装成json，通过这个参数返回）
        );

        $result = MyHttpManager::httpRequest(MyHttpManager::M_POST, ORDER_CALL_BACK_URL, $data);

        LogUtils::info("[" . __FILE__ . "][" . __FUNCTION__ . "] ---> [input_param]: " . json_encode($data));
        LogUtils::info("[" . __FILE__ . "][" . __FUNCTION__ . "] ---> [result]: " . $result);

        $retObjClass->code = $result == "ok" ? 0 : -1;
        $retObjClass->msg = $result == "ok" ? "success" : "failed[$result]";
        return $retObjClass;
    }
}