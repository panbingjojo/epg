<?php

namespace Home\Model\ControlUnit;

use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\InquiryAPI;
use Home\Model\Entry\MasterManager;
use Think\Exception;
/**
 * 该管理类用于对访问落地电话控制中心的接口类进行管理
 * Date: 2019-02-13
 * Time: 15:11
 */
class ControlUnitManager
{
    /////////////////////// 函数名 ///////////////////////////
    const FUNC_START_PHONE_INQUIRY = "start_phone_inquiry"; // 发起问诊呼叫
    const FUNC_FINISH_PHONE_INQUIRY = "finish_phone_inquiry"; // 结束问诊呼叫
    const FUNC_QUERY_INQUIRY_INFO = "query_inquiry_info"; // 获取互联网医院科室列表

    //key映射表
    private static $KeyMap = array(
        "start_phone_inquiry" => "start_phone_inquiry",
        "finish_phone_inquiry" => "finish_phone_inquiry",
        "query_inquiry_info" => "query_inquiry_info",
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
    public static function queryControlUnit($key, $param)
    {
        if (self::verifyKey($key) === false) {
            throw new Exception("illegal key:" . $key);
        }

        $result = null;

        switch ($key) {
            case self::FUNC_START_PHONE_INQUIRY:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::startInquiry($url);
                break;

            case self::FUNC_FINISH_PHONE_INQUIRY:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::finishInquiry($url);
                break;

            case self::FUNC_QUERY_INQUIRY_INFO:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::queryInquiryInfo($url);
                break;

            default:
                LogUtils::error("function[.$key.] not support!");
        }

        return $result;
    }

    /**
     * @brief 构建http get 请求的url
     * @param $key 请求头部的关键字函数名
     * @param $param 请求json字段的内容
     * @return string 返回具体的url
     */
    private static function buildHttpUrl($key, $param) {
        $url = SERVER_CONTROL_UNIT . self::getHttpFunc($key) . self::getHttpJson($param);

        return $url;
    }

    /**
     * @brief 生成Func字段的内容
     * @param $key 请求头部的关键字函数名
     * @return string 返回Func字段格式，
     */
    private static function getHttpFunc($key) {

        $headParam = '/' . $key;
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

        $jsonParam = "?json=" . $param;
        return $jsonParam;
    }
}