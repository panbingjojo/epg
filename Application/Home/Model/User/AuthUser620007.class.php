<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class AuthUser620007 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    /**
     * 辽宁电信应用业务参数保存
     */
    private function _setEPGParams()
    {
        LogUtils::info("_setEPGParams: " . json_encode($_POST));
        $deviceInfo = isset($_POST['deviceInfo']) && !empty($_POST['deviceInfo']) ? $_POST['deviceInfo'] : null;
        $epgInfoMap = MasterManager::getEPGInfoMap();
        if ($deviceInfo) {
            LogUtils::info("====> deviceInfo: $deviceInfo");
            $deviceInfo = json_decode($deviceInfo);

            $userIp = $deviceInfo->ip_address;
            $userMac = $deviceInfo->mac_address;
            LogUtils::info("====> deviceInfo:userIp = " .$userIp);
            LogUtils::info("====> deviceInfo:userMac = " .$userMac);
            $epgInfoMap['userIP'] = $userIp;
            $epgInfoMap['userMac'] = $userMac;
            MasterManager::setEPGInfoMap($epgInfoMap);
        }
    }

    public function checkVIPState()
    {
        if(MasterManager::getEnterFromYsten() == '1'){
            return isset($_REQUEST['userTypeAuth']) && !empty($_REQUEST['userTypeAuth']) ? $_REQUEST['userTypeAuth'] : 0;
        }else{
            return $this->orderManager->authentication();
        }
    }
}