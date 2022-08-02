<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/3/20
 * Time: 下午7:40
 */

namespace Home\Model\Epidemic;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;
use Think\Exception;

class EpidemicManager
{
    /////////////////////// 函数名 ///////////////////////////
    // 新型冠状病毒 -- 相关接口
    const FUNC_GET_EPIDEMIC_DETAILS = "getEpidemicDetails"; // 获取疫情详情
    const FUNC_GET_EPIDEMIC_DETAILS_BY_DATE = "getEpidemicDataByDate"; // 获取疫情详情
    const FUNC_GET_EPIDEMIC_STATISTICS = "getEpidemicStatistics"; // 获取疫情数据统计
    const FUNC_GET_EPIDEMIC_REAL_SOWING = "getEpidemicRealSowing"; // 获取疫情实播

    const FUNC_GET_EPIDEMIC_SAME_TRIP = "getEpidemicSameTrip"; // 获取疫情同程数据
    const FUNC_GET_EPIDEMIC_DISTRICT_AREA = "getEpidemicDistrict"; // 获取疫情小区
    const FUNC_GET_ISOLATED_AREA = "getIsolatedArea"; // 获取疫情隔离地区
    const FUNC_GET_DETAIL_DATA = 'getProvinceDetails';
    const FUNC_GET_DETAIL_DATA_TIME = 'getProvinceDetailsByDate';

    //key映射表
    private static $KeyMap = array(
        "getEpidemicDetails" => "getEpidemicDetails",
        "getEpidemicDataByDate"=>"getEpidemicDataByDate",
        "getEpidemicStatistics" => "getEpidemicStatistics",
        "getEpidemicRealSowing" => "getEpidemicRealSowing",
        "getEpidemicSameTrip" => "getEpidemicSameTrip",
        "getEpidemicDistrict" => "getEpidemicDistrict",
        "getIsolatedArea" => "getIsolatedArea",
        "getProvinceDetails"=>"getProvinceDetails",
        "getProvinceDetailsByDate"=>'getProvinceDetailsByDate'
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
     * @brief 向cws-hlwyy服务器请求数据
     * @param $key 方法名
     * @param $param 参数字段，使用数组结构或json结构
     * @return mixed|null
     * @throws Exception
     */
    public static function queryHLWYY($key, $param)
    {
        if (self::verifyKey($key) === false) {
            throw new Exception("illegal key:" . $key);
        }

        $result = null;
        $rootUrl = CWS_HLWYY_URL;

        switch ($key) {
            case self::FUNC_GET_EPIDEMIC_DETAILS:
                $url = self::buildHttpUrl($rootUrl, $key, $param);
                break;
            case self::FUNC_GET_EPIDEMIC_DETAILS_BY_DATE:
                $url = self::buildHttpUrl($rootUrl, $key, $param);
                break;

            case self::FUNC_GET_EPIDEMIC_STATISTICS:
                $url = self::buildHttpUrl($rootUrl, $key, $param);
                break;

            case self::FUNC_GET_EPIDEMIC_REAL_SOWING:
                $url = self::buildHttpUrl($rootUrl, $key, $param);
                break;
            case self::FUNC_GET_DETAIL_DATA:
                $url = self::buildHttpUrl($rootUrl, $key, $param);
                break;
            case self::FUNC_GET_DETAIL_DATA_TIME:
                $url = self::buildHttpUrl($rootUrl, $key, $param);
                break;
            default:
                LogUtils::error("function[.$key.] not support!");
                break;
        }
        LogUtils::error("function[.$key.] url: " . $url);
        $result = self::queryData($url);
        return $result;
    }


    /**
     * @brief 向cws-39net服务器请求数据
     * @param $key 方法名
     * @param $param 参数字段，使用数组结构或json结构
     * @return mixed|null
     * @throws Exception
     */
    public static function query39Net($key, $param)
    {
        if (self::verifyKey($key) === false) {
            throw new Exception("illegal key:" . $key);
        }

        $result = null;
        $rootUrl = CWS_39NET_URL;

        switch ($key) {
            case self::FUNC_GET_EPIDEMIC_SAME_TRIP:
                // http://10.254.30.100:8100/cws/39net/index.php?head={"func":"getInquirySameTrip"}&json={"date":"2020-01-26","type":5,"no":"1","area":"","pageindex":1,"pagesize":10}
                $url = self::buildHttpUrl($rootUrl, $key, $param);
                break;

            case self::FUNC_GET_EPIDEMIC_DISTRICT_AREA:
                $url = self::buildHttpUrl($rootUrl, $key, $param);
                break;
            case self::FUNC_GET_ISOLATED_AREA:
                $url = self::buildHttpUrl($rootUrl, $key, $param);
                break;
            default:
                LogUtils::error("function[.$key.] not support!");
                break;
        }
        LogUtils::error("function[.$key.] url: " . $url);
        $result = self::queryData($url);
        return $result;
    }

    /**
     * @brief 构建http get 请求的url
     * @param $key 请求头部的关键字函数名
     * @param $param 请求json字段的内容
     * @return string 返回具体的url
     */
    private static function buildHttpUrl($rootUrl, $key, $param)
    {

        $url = $rootUrl . self::getHttpHead($key) . self::getHttpJson($param);
        return $url;
    }

    /**
     * @brief 生成head字段的内容
     * @param $key 请求头部的关键字函数名
     * @return string 返回head字段格式，如 head={'func':"xxxx", 'carrierId':xxxxxx}
     */
    private static function getHttpHead($key)
    {
        $arr = array(
            'func' => $key,
            'carrierId' => MasterManager::getCarrierId(),
        );

        $headParam = "?head=" . json_encode($arr);
        return $headParam;
    }

    /**
     * @brief 生成json字段的内容
     * @param $param json字段内的参数
     * @return string 返回json字段的格式，如 json={'userId':xxxxxx, 'doctorId':xxxxxx}
     */
    private static function getHttpJson($param)
    {

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
     * @param $url 请求url
     * @return mixed
     */
    public static function queryData($url)
    {
        LogUtils::info("query getUserId url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }
}