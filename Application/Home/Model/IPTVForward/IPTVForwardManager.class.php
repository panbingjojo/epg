<?php


namespace Home\Model\IPTVForward;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;
use Think\Exception;

class IPTVForwardManager
{
    /////////////////////// 函数名 ///////////////////////////
    const FUNC_GET_QRCODE = "getQRCode"; // 获取二维码
    const FUNC_QUERY_DATA = "queryData"; // 查询数据
    const FUNC_GET_QR_CODE_IMG = "getQRCodeImg"; // 获取数据上报二维码
    const FUNC_QUERY_SCAN_STATUS = "queryScanStatus"; // 查询是否扫描二维码状态
    const FUNC_QUERY_LOGIN_STATUS = "queryLoginStatus"; // 查询是否扫描二维码登录成功状态

    //key映射表
    private static $KeyMap = array(
        "getQRCode" => "getQRCode",
        "queryData" => "queryData",
        "getQRCodeImg" => "getQRCodeImg",
        "queryScanStatus" => "queryScanStatus",
        "queryLoginStatus" => "queryLoginStatus",
    );

    /**
     * 校验key是否存在
     * @param $key
     * @return bool
     */
    private static function verifyKey($key)
    {
        return array_key_exists($key, self::$KeyMap);
    }

    /**
     * @brief 向cws-IPTVForward服务器请求数据
     * @param: $key 方法名
     * @param: $param 参数字段，使用数组结构或json结构
     * @return mixed|null
     * @throws Exception
     */
    public static function queryIPTVForward($key, $param)
    {
        if (self::verifyKey($key) === false) {
            throw new Exception("illegal key:" . $key);
        }

        $result = null;

        $requestURL = '';
        switch ($key) {
            case self::FUNC_GET_QRCODE:
            case self::FUNC_QUERY_DATA:
            case self::FUNC_GET_QR_CODE_IMG:
            case self::FUNC_QUERY_SCAN_STATUS:
            case self::FUNC_QUERY_LOGIN_STATUS:
                $requestURL = self::buildHttpUrl($key, $param);
                break;
            default:
                LogUtils::error("function[.$key.] not support!");
                break;
        }
        LogUtils::error("function[.$key.] url: " . $requestURL);
        $result = self::queryData($requestURL);
        return $result;
    }


    /**
     * @brief 构建http get 请求的url
     * @param $key 请求头部的关键字函数名
     * @param $param 请求json字段的内容
     * @return string 返回具体的url
     */
    private static function buildHttpUrl($key, $param) {
        $url = SERVER_IPTVFORWARD_CWS . self::getHttpHead($key) . self::getHttpJson($param);
        return $url;
    }

    /**
     * @brief 生成head字段的内容
     * @param $key 请求头部的关键字函数名
     * @return string 返回head字段格式，如 head={'func':"xxxx", 'carrierId':xxxxxx}
     */
    private static function getHttpHead($key) {
        $arr = array(
            'func' => $key,
            'carrierId'=> MasterManager::getCarrierId(),
        );

        $headParam = "?head=" . json_encode($arr);
        return $headParam;
    }

    /**
     * @brief 生成json字段的内容
     * @param $param json字段内的参数
     * @return string 返回json字段的格式，如 json={'userId':xxxxxx, 'doctorId':xxxxxx}
     */
    private static function getHttpJson($param) {

        if (is_array($param)) {
            $param = json_encode($param);
        }

        if ($param == null) {
            $param = "{}";
        }

        $jsonParam = "&json=" . $param;
        return $jsonParam;
    }

    /**
     * @brief 向服务器获取数据
     * @param: $url 请求url
     * @return mixed
     */
    public static function queryData($url)
    {
        LogUtils::info("query getUserId url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }
}