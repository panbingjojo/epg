<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/3/20
 * Time: 下午6:53
 */

namespace Home\Model\Common\ServerAPI;




use Home\Model\Common\HttpManager;
use Home\Model\Entry\MasterManager;

class DoctorP2PAPI
{
    public static function uploadInquiryParam($userAccount, $accountType, $paramInfo)
    {
        $json = array(
            "user_account" => $userAccount,
            "account_type" => $accountType,
            "param_info" => $paramInfo
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_UPLOAD_INQUIRY_PARAM);
        $httpManager->setUserId(MasterManager::getUserId());
        $result = $httpManager->requestPost($json);
        return json_decode($result, true);
    }

    /**
     * 存储用户问诊校验过的问诊电话
     * @param $phone String 电话号码
     * @return mixed 0 - 成功 其他 - 失败
     */
    public static function pushPhoneList($phone){
        $param = array(
            "phone" => $phone
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_PUSH_PHONE_LIST);
        return $httpManager->requestPost($param);
    }

    /**
     * 获取用户问诊校验过的电话列表
     * @return mixed 问诊校验过的电话列表
     */
    public static function getPhoneList(){
        $param = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_GET_PHONE_LIST);
        return $httpManager->requestPost($param);
    }

    /**
     * 获取当前盒子用户问诊插件相关信息
     * @param $appPackageName string 问诊插件包名
     * @return mixed 问诊校验过的电话列表
     */
    public static function getPluginVersionInfo($appPackageName){
        $param = array(
            "plugin_name" => $appPackageName,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_QUERY_PLUGIN_VERSION_INFO);
        return json_decode($httpManager->requestPost($param));
    }
}