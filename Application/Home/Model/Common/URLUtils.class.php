<?php


namespace Home\Model\Common;

class URLUtils
{

    /** get请求方式 */
    const GET_REQUEST_TYPE = "GET";
    /** post请求方式 */
    const POST_REQUEST_TYPE = "POST";
    /** get/post请求方式 */
    const COMMON_REQUEST_TYPE = "REQUEST";

    /**
     * 对request参数进行特殊字符过滤，防止js跨站攻击
     * @param $str
     * @param $defaultStr (请求参数不存在时的默认值)
     * @param $isFilter (true对请求的参数过滤，false:不过滤)
     * @return string
     */
    public static function requestFilter($str, $defaultStr = "", $isFilter = true)
    {
        if (!$isFilter) {
            return isset($_REQUEST[$str]) ? $_REQUEST[$str] : $defaultStr;
        }
        return isset($_REQUEST[$str]) ? htmlspecialchars($_REQUEST[$str]) : $defaultStr;
    }

    /**
     * 对GET参数进行特殊字符过滤，防止js跨站攻击
     * @param string $str
     * @param $defaultStr (请求参数不存在时的默认值)
     * @param $isFilter (true对请求的参数过滤，false:不过滤)
     * @return mixed|string
     */
    public static function getFilter($str, $defaultStr = "", $isFilter = true)
    {
        if (!$isFilter) {
            return isset($_GET[$str]) ? $_GET[$str] : $defaultStr;
        }
        return isset($_GET[$str]) && !empty($_GET[$str]) ? htmlspecialchars($_GET[$str]) : $defaultStr;
    }

    /**
     * 对POOST参数进行特殊字符过滤，防止js跨站攻击
     * @param $str
     * @param $defaultStr (请求参数不存在时的默认值)
     * @param $isFilter (true对请求的参数过滤，false:不过滤)
     * @return string
     */
    public static function postFilter($str, $defaultStr = "", $isFilter = true)
    {
        if (!$isFilter) {
            return isset($_POST[$str]) ? $_POST[$str] : $defaultStr;
        }
        return isset($_POST[$str]) ? htmlspecialchars($_POST[$str]) : $defaultStr;
    }

    /**
     * 对URL中参数进行解析
     * @param array $urlKeys 需要解析的数组（包含url链接的key值的默认值）
     * @param string $requestType 请求的参数类型
     * @param bool $isFilter (true对请求的参数过滤，false:不过滤)
     * @return array 解析之后的数组结果
     */
    public static function parseURLInfo($urlKeys, $requestType = self::GET_REQUEST_TYPE,$isFilter = false)
    {
        $result = array();
        foreach ($urlKeys as $key => $defaultValue) {
            switch ($requestType) {
                case self::GET_REQUEST_TYPE:
                    $result[$key] = self::getFilter($key, $defaultValue,$isFilter);
                    //河南电信--局方进入链接带amp;解析
                    if(isset($_GET['amp;'.$key]) && !empty($_GET['amp;'.$key])){
                        $result[$key] = $_GET['amp;'.$key];
                    }
                    break;
                case self::POST_REQUEST_TYPE:
                    $result[$key] = self::postFilter($key, $defaultValue,$isFilter);
                    break;
                case self::COMMON_REQUEST_TYPE:
                    $result[$key] = self::requestFilter($key, $defaultValue,$isFilter);
                    break;
            }
        }
        return $result;
    }

}