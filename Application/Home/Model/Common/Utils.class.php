<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/11
 * Time: 12:22
 */

namespace Home\Model\Common;

use Home\Model\Activity\JointActivityEntryManager;
use Home\Model\Activity\JointActivitySPInfoManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Resource\R000051\ConstString000051;
use Redis;

class Utils
{
    /**
     * 获取真实的客户端IP
     * @return array|false|string
     */
    public static function getClientIp()
    {
        if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown"))
            $ip = getenv("HTTP_CLIENT_IP");
        else if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown"))
            $ip = getenv("HTTP_X_FORWARDED_FOR");
        else if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown"))
            $ip = getenv("REMOTE_ADDR");
        else if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown"))
            $ip = $_SERVER['REMOTE_ADDR'];
        else
            $ip = "unknown";
        return ($ip);
    }

    /**
     * @brief: 根据区域id来判断使用平台类型,如果没有特殊要求的，就取deault的值。
     * @param $carrierId
     * @return int
     */
    public static function getPlatFormType($carrierId)
    {
        $platType = 0;
        switch ($carrierId) {
            case CARRIER_ID_JIANGSUDX:
                $platType = Utils::getPlatFormType320092();
                break;

            case CARRIER_ID_ANHUIDX:
                $platType = Utils::getPlatFormType340092();
                break;

            case CARRIER_ID_CHINAUNICOM:
            case CARRIER_ID_NINGXIAGD:
                $platType = Utils::getPlatFormType000051();
                break;

            case CARRIER_ID_GANSUYD:
                $platType = Utils::getPlatFormType620007();
                break;
            default:
                $platType = (MasterManager::getPlatformType() == STB_TYPE_HD) ? SL_TYPE_HD : SL_TYPE_SD;
        }
        return $platType;
    }

    /**
     * @return int 返回平台类型
     */
    private static function getPlatFormType320092()
    {
        $platFormType = MasterManager::getPlatformTypeExt();

        $type = substr($platFormType, 3); // hd-或sd- 后面的内容(hd-100 得出 100)
        if (is_numeric($type)) {
            return $type;
        } else {
            // 兼容老版本
            $platFormType = strtolower($platFormType);
            switch ($platFormType) {
                case "sd": // 普通标清
                    $type = 0;
                    break;

                case "hd": // 普通高清
                    $type = 1;
                    break;

                case "hd-epg50": // EPG5.0+（4K）
                    $type = 3;
                    break;

                case "hd-bestv": // 百视通高清
                    $type = 4;
                    break;

                case "sd-bestv": // 百视通标清
                    $type = 5;
                    break;

                case "hd-st": // 省台高清
                    $type = 6;
                    break;

                case "sd-st": // 省台标清
                    $type = 7;
                    break;

                case "hd-stzn":
                    $type = 8;
                    break;

                default:
                    $type = 0;
            }

            return $type;
        }

    }

    /**
     * @return int 返回平台类型
     */
    private static function getPlatFormType340092()
    {
        $platFormType = MasterManager::getPlatformTypeExt();

        $type = substr($platFormType, 3); // hd-或sd- 后面的内容(hd-100 得出 100)
        if (is_numeric($type)) {
            return $type;
        } else {
            // 兼容老版本
            $platFormType = strtolower($platFormType);
            switch ($platFormType) {
                case "sd": // 普通标清
                    $type = 0;
                    break;

                case "hd": // 普通高清
                    $type = 1;
                    break;

                case "hd-classics": // 经典版
                    $type = 3;
                    break;

                case "hd-fashion": // 时尚版
                    $type = 4;
                    break;

                default:
                    $type = 0;
            }
            return $type;
        }
    }

    /**
     * @return int 返回平台类型
     */
    private static function getPlatFormType000051()
    {
        $platFormType = MasterManager::getPlatformTypeExt();

        $type = substr($platFormType, 3); // hd-或sd- 后面的内容(hd-100 得出 100)
        if (is_numeric($type)) {
            return $type;
        } else {
            // 兼容老版本
            $platFormType = strtolower($platFormType);
            switch ($platFormType) {
                case "sd": // 普通标清
                    $type = 0;
                    break;

                case "hd": // 普通高清
                    $type = 1;
                    break;

                case "hd-3": // 独立标清入口
                    $type = 3;
                    break;

                case "hd-4": // 独立高清入口
                    $type = 4;
                    break;

                default:
                    $type = 0;
            }
            return $type;
        }
    }

    /**
     * @return int 返回平台类型
     */
    private static function getPlatFormType620007()
    {
        $platFormType = MasterManager::getPlatformTypeExt();

        $type = substr($platFormType, 3); // hd-或sd- 后面的内容(hd-100 得出 100)
        if (is_numeric($type)) {
            return $type;
        } else {
            // 兼容老版本
            $platFormType = strtolower($platFormType);
            switch ($platFormType) {
                case "sd": // 普通标清
                    $type = 0;
                    break;

                case "hd": // 普通高清
                    $type = 1;
                    break;

                case "hd-3": // 百事通高清入口
                    $type = 3;
                    break;

                case "hd-4": // 未来电视高清入口
                    $type = 4;
                    break;

                default:
                    $type = 0;
            }
            return $type;
        }
    }

    /**
     * @Brief:此函数用于判断用户是否为 独立入口用户
     * @return: $type （1--是独立入口, 0--不是独立入口）
     */
    public static function isIndependenceEntry()
    {
        $type = 0;
        switch (CARRIER_ID) {
            case CARRIER_ID_CHINAUNICOM:
                $platFormType = MasterManager::getPlatformTypeExt();
                $suffix = substr($platFormType, 3); // hd-或sd- 后面的内容(hd-3 得出 3)
                if ($suffix == 3 || $suffix == 4) {
                    $type = 1;
                }
                break;

            default:
                $type = 0;
        }

        return $type;
    }

    /**
     * @Brief:此函数用于判断用户是否为 演示视频问诊进入
     * @return: $type （1--是专用入口, 0--不是专用入口）
     */
    public static function isDemoInquiryEntry()
    {
      return $_GET['s_demo_id'];

    }

    /**
     * @Brief:此函数用于判断用户是否为天津专用入口用户
     * @return: $type （1--是专用入口, 0--不是专用入口）
     */
    public static function isTianJinSpecialEntry () {
        $type = 0;
        $platFormType = MasterManager::getPlatformTypeExt();
        $suffix = substr($platFormType, 3); // hd-或sd- 后面的内容(hd-5 得出 5)
        if ($suffix == 5 || $suffix == 6) {
            $type = 1;
        }

        return $type;
    }

    // 毫秒级时间戳
    public static function getMillisecond()
    {
        list($t1, $t2) = explode(' ', microtime());
        return (float)sprintf('%.0f', (floatval($t1) + floatval($t2)) * 1000);
    }

    /**
     * @Brief:此函数根据$contentId来获取相应的sp信息，如果参数$contentId为null，则返回所有数据
     * @param: $contentId sp厂商内容编号
     * @return: $info sp信息
     */
    public static function getOrderInfo000051($contentId)
    {
        $subId = MasterManager::getSubId();
        $platformTypeExt = MasterManager::getPlatformTypeExt();
        LogUtils::error("getOrderInfo000051 subId: " . $subId);
        $info = JointActivitySPInfoManager::getSPInfoJointActivity($subId, $platformTypeExt);

        if ($contentId != null) {
            return $info[$contentId];
        }

        return $info;
    }

    /**
     * @Brief:此函数用于向服务器查询应该上报哪家的订购信息
     * @param: user_id=1&key=934b4ac3df2217d41daa9e8e94cec078
     * @return: 返回值：sp厂商的contentId
     * 说明：
     * 1    39健康：sjjklinux
     * 2    玩具秀：jrwjx
     * 3    天天电竞：ttdjhd
     * 4    乐享音乐：drlxyy
     * key是死的
     */
    public static function queryPostSpOrderInfo($userId)
    {
        $areaCode = MasterManager::getAreaCode();
        $url = QUERY_REPORT_ORDER_INFO_URL . "?user_id=$userId&area_code=$areaCode&key=934b4ac3df2217d41daa9e8e94cec078";
        $result = HttpManager::httpRequest("get", $url, null);
        LogUtils::debug("queryPostSpOrderInfo url: " . $url);
        LogUtils::debug("queryPostSpOrderInfo result: " . $result);
        $result = json_decode($result); // {"order_type":1}
        $orderType = $result->order_type;
        $contentId = $result->content_id;
        $spInfoList = MasterManager::getActivityOrderSPMap();
        if (!isset($spInfoList[$contentId])) {
            $orderType = 1;
            $contentId = "sjjklinux";
        }

        return array('contentId' => $contentId, 'orderType' => $orderType);
    }

    /**
     * 判断是否是联合活动
     */
    public static function isJointActivity($areaCode, $lmSubId)
    {
        $accountId = MasterManager::getAccountId();
        $isJointActivity = JointActivityEntryManager::isJointActivity($areaCode, $lmSubId, $accountId);
        return $isJointActivity;
    }

    /**
     * @Brief:此函数根据用户的areaCode获取省份ID
     */
    public static function getUserProvince($ereaCode)
    {
        $provinceInfo = "";
        if (defined("CHINAUNICOM_AREACODE_MAP")) {
            $array = eval(CHINAUNICOM_AREACODE_MAP);
            $provinceInfo = $array[$ereaCode];
            LogUtils::debug("getUserProvince: areaCode[$ereaCode] ---> provinceId[$provinceInfo[0]]");
        } else {
            LogUtils::debug("CHINAUNICOM_AREACODE_MAP  undefined");
        }

        return $provinceInfo;
    }

    /**
     * @Brief:此函数用于从域名中截取出ip，如http://121.60.16.244:8080/iptvepg  ---> 121.60.16.244
     *          如果传过来就是ip,就直接返回
     * @param: $param 带有IP的参数
     * @return: 用户ip
     */
    public static function getUserIPFromDomain($param)
    {
        if ($param == null || empty($param)) {
            return self::getClientIp();
        }

        if (strpos($param, 'http://') !== false) {
            $str = substr($param, 7, strlen($param));
        } else if (strpos($param, 'https://') !== false) {
            $str = substr($param, 8, strlen($param));
        } else {
            return $param;
        }

        // 判断 ':'冒号的位置，并读取其前面的ip
        $idx = strpos($str, ':');
        $ip = substr($str, 0, $idx);
        return $ip;
    }

    /**
     * @Brief:此函数用于查询能否访问视频问诊功能
     * @param $stdModel 设备型号
     * @return info 1--能访问，0--不能访问
     */
    public static function canAccessInquiry($stdModel)
    {
        $info = array(
            'isAccessInquiry' => 1,
            'message' => "您的机顶盒暂不支持该功能",
            'submit' => "知道了"
        );

        if ($stdModel == null || $stdModel == "") {
            return $info;
        }

        // 如果没有定义禁止访问映射表，则认为可以访问
        if (defined("FORBID_ACCESS_INQUIRY")) {
            $forbidList = eval(FORBID_ACCESS_INQUIRY);
            // 遍历得到禁止访问的映射表
            foreach ($forbidList as $key => $value) {
                if (preg_match("/($value)/", "$stdModel")) {
                    LogUtils::info("[$stdModel] is forbid access inquiry!!!");
                    $info['isAccessInquiry'] = 0;

                    // 提取提示内容
                    if (defined("FORBID_ACCESS_INQUIRY_STRING")) {
                        $message = eval(FORBID_ACCESS_INQUIRY_STRING);
                        $info['message'] = $message['MESSAGE'];
                        $info['submit'] = $message['SUBMIT'];
                    }
                    break;
                }
            }
        }
        return $info;
    }

    /**
     * 判断盒子是否支持视频问诊
     * @param $stbModel
     * @return bool
     */
    public static function isAllowAccessInquiry($stbModel) {
        if (defined("ALLOW_ACCESS_INQUIRY")) {
            $allowList = eval(ALLOW_ACCESS_INQUIRY);
            // 遍历得到允许访问的映射表
            foreach ($allowList as $key => $value) {
                if (preg_match("/($value)/", "$stbModel")) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @Brief:此函数用于返回计费说明的配置文字信息
     * return: 计费说明的配置文字信息
     */
    public static function getPayMessage()
    {

        if (MasterManager::getCarrierId() == CARRIER_ID_CHINAUNICOM) {
            return ConstString000051::$RES_ORDER_MESSAGE;
        }

        return "";
    }

    /**
     * @Brief:此函数用于设置子区域编码
     * @param: $accountId 用户业务帐号
     */
    public static function setAreaCode($accountId)
    {
        $subAreaCode = "";

        if (empty($accountId)) {
            return;
        }

        switch (CARRIER_ID) {
            case CARRIER_ID_CHINAUNICOM:
                $subAreaCode = Utils::getAreaCode000051($accountId);
                break;
        }
        LogUtils::info("=====> get subAreaCode[ $subAreaCode ] from account= $accountId");
        MasterManager::setSubAreaCode($subAreaCode);
    }

    /**
     * @Brief:此函数用于从业务帐号里提取出用户的子区域编码
     * @param: $accountId 用户业务帐号
     * @return: 返回用户的子区域编码
     */
    private function getAreaCode000051($accountId)
    {
        $subAreaCode = "";
        $areaCode = MasterManager::getAreaCode();
        // 1、 黑龙江-哈尔滨市
        if ($areaCode == '211') {
            $subAreaCode = substr($accountId, 0, 1);
        } else if ($areaCode == '209') { // 辽宁

            // 读前2位
            $prefix = substr($accountId, 0, 2);

            if ($prefix == "CB" || $prefix == "GQ") {
                $tempFlag = substr($accountId, 2, 1);
                if ($tempFlag == "0") {
                    $subAreaCode = substr($accountId, 2, 4);
                } else {
                    $subAreaCode = "0" . substr($accountId, 2, 3);
                }
            } else if ($prefix == "00") {
                $subAreaCode = substr($accountId, 1, 4);
            } else {
                // 读前1位
                $prefix = substr($accountId, 0, 1);
                if ($prefix == '0') {
                    // 读前面3位
                    $subAreaCode = substr($accountId, 0, 3);
                    if ($subAreaCode != '024') {
                        $subAreaCode = substr($accountId, 0, 4);
                    }
                } else if ($prefix == 'p' || $prefix == 'g') {
                    $subAreaCode = substr($accountId, 1, 4);
                }
            }

            // 对沈阳再作保护
            if ($subAreaCode != '024') {
                $p = substr($subAreaCode, 0, 3);
                if ($p == '024') {
                    $subAreaCode = $p;
                }
            }
        } else if ($areaCode == '204') { // 河南地区
            $subAreaCode = substr($accountId, 0, 3);
        } else {
            $subAreaCode = substr($accountId, 0, 4); // 如：0852133456_201 ===> 0852
        }

        return $subAreaCode;
    }

    /**
     * js escape php 实现
     * @param $string           the sting want to be escaped
     * @param $in_encoding
     * @param $out_encoding
     * @return string
     */
    public static function escape($string, $in_encoding = 'UTF-8',$out_encoding = 'UCS-2') {
        $return = '';
        if (function_exists('mb_get_info')) {
            for($x = 0; $x < mb_strlen ( $string, $in_encoding ); $x ++) {
                $str = mb_substr ( $string, $x, 1, $in_encoding );
                if (strlen ( $str ) > 1) { // 多字节字符
                    $return .= '%u' . strtoupper ( bin2hex ( mb_convert_encoding ( $str, $out_encoding, $in_encoding ) ) );
                } else {
                    $return .= '%' . strtoupper ( bin2hex ( $str ) );
                }
            }
        }
        return $return;
    }

    /**
     * @param $str
     * @return string
     */
    public static function unescape($str)
    {
        $ret = '';
        $len = strlen($str);
        for ($i = 0; $i < $len; $i ++)
        {
            if ($str[$i] == '%' && $str[$i + 1] == 'u')
            {
                $val = hexdec(substr($str, $i + 2, 4));
                if ($val < 0x7f)
                    $ret .= chr($val);
                else
                    if ($val < 0x800)
                        $ret .= chr(0xc0 | ($val >> 6)) .
                            chr(0x80 | ($val & 0x3f));
                    else
                        $ret .= chr(0xe0 | ($val >> 12)) .
                            chr(0x80 | (($val >> 6) & 0x3f)) .
                            chr(0x80 | ($val & 0x3f));
                $i += 5;
            } else
                if ($str[$i] == '%')
                {
                    $ret .= urldecode(substr($str, $i, 3));
                    $i += 2;
                } else
                    $ret .= $str[$i];
        }
        return $ret;
    }

    /**
     * @Brief: 写入数据到Redis
     *
     * @param: $dbIndex 数据库分区
     * @param: $key 保存数据键值
     * @param: $value 保存数据值
     * @return bool|int 写入是否成功
     */
    public static function pushRedis($dbIndex,$key,$value){
        if (IS_REDIS_CACHE_LOG == 1 && defined("REDIS_LOCAL_IP")) {
            // 1、获取Redis所在服务器的IP和端口
            $localIP = REDIS_LOCAL_IP;
            $localPort = REDIS_LOCAL_PORT;

            // 2、连接数据库
            $redis = new Redis();
            $redis->connect($localIP, $localPort);
            $redis->auth(REDIS_AUTH_PASSWORD);

            // 3、选择数据库分区
            $redis->select($dbIndex);

            // 4、写入数据到数据库
            return $redis->rPush($key, $value);
        }

        return false;
    }
}