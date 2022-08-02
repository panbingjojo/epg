<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// + 工具类方
// +----------------------------------------------------------------------
// + 主要应用在提供给第三方使用的接口时，某些通用方法调用。
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/1 18:43
// +----------------------------------------------------------------------

namespace Provider\Model\Common;


use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class MyUtil
{
    // 自定义响应码表示
    const ret_success = 0, ret_failed = -1;

    /**
     * 统一校验参数head的合法性
     *
     * @param $head //客户端传递的head参数，json对象格式
     * @return array
     */
    public static function verifyParamsHead($head)
    {
        if (is_null($head) || !is_object($head)) {
            return self::newVerifyModel(self::ret_failed, 'head参数格式不合法！');
        }

        // 非空判断
        if (self::isNullOrEmpty($head->lm_userId)) {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_userId" is empty!');
            return self::newVerifyModel(self::ret_failed, '"lm_userId" 不能为空！');
        }
        if (self::isNullOrEmpty($head->lm_sessionId)) {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_sessionId" is empty!');
            return self::newVerifyModel(self::ret_failed, '"lm_sessionId" 不能为空！');
        }
        if (self::isNullOrEmpty($head->lm_loginId)) {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_loginId" is empty!');
            return self::newVerifyModel(self::ret_failed, '"lm_loginId" 不能为空！');
        }

        // 有效性判断
//        if (MasterManager::getUserId() != $head->lm_userId) {
//            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_userId" is invalid!' . MasterManager::getUserId() . ',userid:' . $head->lm_userId);
//            return self::newVerifyModel(self::ret_failed, '无效的"lm_userId"！');
//        }
//        if (MasterManager::getCwsSessionId() != $head->lm_sessionId) {
//            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_sessionId" is invalid!');
//            return self::newVerifyModel(self::ret_failed, '无效的"lm_sessionId"！');
//        }
//        if (MasterManager::getLoginId() != $head->lm_loginId) {
//            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [verifyHeadParams failed!]: param "lm_loginId" is invalid!');
//            return self::newVerifyModel(self::ret_failed, '无效的"lm_loginId"！');
//        }

        return self::newVerifyModel(self::ret_success, 'head校验成功');
    }

    /**
     * 统一判断是否为null或者空内容
     * @param $var //校验内容
     * @return bool
     */
    public static function isNullOrEmpty($var)
    {
        if (is_null($var)) return true;
        if ($var === '') return true;
        return false;
    }

    /**
     * 生成一个统一的返回校验实体array，用于校验参数
     *
     * @param $code //状态码
     * @param $msg //消息说明
     * @return array
     */
    private static function newVerifyModel($code, $msg)
    {
        return array(
            'code' => $code,
            'msg' => $msg,
        );
    }

    /**
     * 功能：统一接收来自客户端请求传递而来由我方（贵阳朗玛）制定规范的header，并以关联数组保存返回。
     * 说明：第三方调用我方的接口时，传递而来的header头信息。
     * 规范：约定由我方（贵阳朗玛）提供的接口所需header信息的话，head-name以"lm-"开头。
     * 例如：
     *      lm-appkey:a7vB98C
     *      lm-type:0/1(0-测试服 1-正式服)
     * @return array
     */
    public static function getCustomHttpHeaders()
    {
        $headers = array();

        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 7) == 'HTTP_LM') { //e.g. 过滤我方lws(贵阳朗玛)对外规定的以"lm-"开头的head，例如：lm-appkey/lm-type
                $lmHeadName = substr($name, 8);
                $lmHeadName = str_replace('_', '-', $lmHeadName);
                $lmHeadName = strtolower($lmHeadName);
                $headers[$lmHeadName] = $value;//e.g. 直接以39互联网医生规定的head-name原串返回，例如：appkey/type
            }
        }

        return $headers;
    }

    /**
     * 获取当前carrierId地区配置的提供给第三方使用互联网医院接口的一些信息，以对象返回。
     * 例如：
     *      {
     *          "client_key": "7mMAHy9m",
     *          "hlwyy": {
     *              "app_id":"xxx",
     *              "app_key":"yyy",
     *          },
     *          "measure": {
     *              "app_id":"xxx",
     *              "app_key":"yyy",
     *          },
     *          ...
     *      }
     * @return mixed json对象
     */
    public static function getThirdAppInfo()
    {
        $thirdAppInfo = array();
        $lmcid = MasterManager::getCarrierId();
        $apiClientInfo = C('API_CLIENT_INFO');
        if (isset($apiClientInfo[$lmcid])) {
            $thirdAppInfo = $apiClientInfo[$lmcid]; //is array
        }
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [thirdAppInfo][' . $lmcid . ']: ' . json_encode($thirdAppInfo));
        return json_decode(json_encode($thirdAppInfo));//转换成一个对象，方便使用
    }

}