<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;

class AuthUser07430091 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    /** 保存设备相关参数 */
    private function _setEPGParams()
    {
        LogUtils::info("_setEPGParams ===> SERVER_INFOS:" . json_encode($_SERVER));
        LogUtils::info("_setEPGParams ===> REQUEST_INFOS:" . json_encode($_REQUEST));

        // 获取前端请求传递信息
        $requestKeys = array(
            "userId" => "",
            "extrasInfo" => "",
            "stbId" => "",
            "stbMac" => "",
            "stbModel" => "",
            "epgDomain" => "",
            "userToken" => "",
        );
        $epgInfoMap = URLUtils::parseURLInfo($requestKeys, URLUtils::COMMON_REQUEST_TYPE);
        // 加工与缓存数据
        $epgInfoMap['userIP'] = get_client_ip();
        if (!empty($epgInfoMap['extrasInfo'])) {
            // 芒果TV盒子前端js获取到的系统信息
            $sysInfo = json_decode($epgInfoMap['extrasInfo']);
            if (null != $sysInfo && is_object($sysInfo)) {
                $epgInfoMap['userId'] = $sysInfo->userId;                   //读取用户id，未登录时值为空
                $epgInfoMap['userName'] = $sysInfo->userName;               //读取用户名，未登录时值为空
                $epgInfoMap['userToken'] = $sysInfo->userToken;             //读取用户token，未登录时值为空
                $epgInfoMap['bindPhone'] = $sysInfo->bindPhone;             //读取用户统一账号（别名）
                $epgInfoMap['areaId'] = substr($sysInfo->userId,0,4);//$sysInfo->areaId;                   //读取区域代码（电话区号）
                //$epgInfoMap["areaCode"] = substr($sysInfo->userId,0,4);
                $epgInfoMap['groupId'] = $sysInfo->groupId;                 //读取分组ID：0普通家庭用户，1酒店用户
                $epgInfoMap['deviceMac'] = $sysInfo->deviceMac;             //读取系统MAC（默认为有线网MAC）
                $epgInfoMap['terminalType'] = $sysInfo->terminalType;       //终端类型版本
                $epgInfoMap['stbid'] = $sysInfo->stbid;                     //读取机顶盒序列号（用于区分机顶盒）
                $epgInfoMap['ip'] = $sysInfo->ip;                           //读取盒子IP
                $epgInfoMap['model'] = $sysInfo->model;                     //设备型号
                $epgInfoMap['manufacturers'] = $sysInfo->manufacturers;     //制造商
                $epgInfoMap['systemVersion'] = $sysInfo->systemVersion;     //系统版本
                $epgInfoMap['cmccUserId'] = $sysInfo->cmccUserId;           //移动框架登录用户ID
                $epgInfoMap['cmccToken'] = $sysInfo->cmccToken;             //移动框架盒子登录后token
                $epgInfoMap['cmccAccountId'] = $sysInfo->cmccAccountId;     //移动框架计费标识
                $epgInfoMap['cmccCityCode'] = $sysInfo->cmccCityCode;       //移动框架机顶盒城市编码（消费地域）
                $epgInfoMap['cmccCopyrightId'] = $sysInfo->cmccCopyrightId; //移动框架版权所有
                $epgInfoMap['appVersion'] = $sysInfo->appVersion;          

                // 整合部分
                if (!$epgInfoMap['stbId'] && $epgInfoMap['stbid']) $epgInfoMap['stbId'] = $epgInfoMap['stbid'];
                if (!$epgInfoMap['stbModel'] && $epgInfoMap['model']) $epgInfoMap['stbModel'] = $epgInfoMap['model'];
                if (!$epgInfoMap['stbMac'] && $epgInfoMap['deviceMac']) $epgInfoMap['stbMac'] = $epgInfoMap['deviceMac'];
            }
        } else if (!$epgInfoMap['userId']) {
            $epgInfoMap['userId'] = 'lmtest-mangotv-user1'; // 未发现，提供一个测试用户id
            LogUtils::debug('[MangoTV] EPGInfo.init: No valid user_id given so use one default to login...');
        }

        // 设置/记录全局参数
        MasterManager::setSTBId($epgInfoMap['stbId']);
        MasterManager::setSTBMac($epgInfoMap['stbMac']);
        MasterManager::setSTBModel($epgInfoMap['stbModel']);

        MasterManager::setAccountId($epgInfoMap['userId']);
        MasterManager::setAreaCode(isset($epgInfoMap['areaId']) ? $epgInfoMap['areaId'] : '');
        MasterManager::setUserToken($epgInfoMap['userToken']);
        MasterManager::setIPTVPortalUrl($epgInfoMap['epgDomain']);

        // 直接缓存获取到的所有EPG参数信息
        MasterManager::setEPGInfoMap($epgInfoMap);
    }

}