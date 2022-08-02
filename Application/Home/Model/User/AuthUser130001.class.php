<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class AuthUser130001 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    private function _setEPGParams()
    {
        LogUtils::info("_setEPGParams -> deviceInfo ：" . $_POST['deviceInfo']);

        // {"licence":"301","Password":"HBOTTP","username":"sjjkcszh001","user_token":"Dn2tPDn2tP32OECzb3NTlPYFxewBwY0f",
        //"epg_server":"http://111.63.119.21:33200","refreshTime":"468459"}
        $accountId = $_POST['accountId'] ? $_POST['accountId'] : null;
        $deviceInfo = $_POST['deviceInfo'] ? $_POST['deviceInfo'] : '';
        if ($accountId && $deviceInfo) {
            $deviceInfo = json_decode($deviceInfo);
            MasterManager::setAccountId($accountId);
            MasterManager::setEPGServerURL($deviceInfo->epg_server);
            MasterManager::setUserToken($deviceInfo->user_token);
        }
    }

    public function checkVIPState()
    {
        // 从OrderManager中鉴权是否Vip
        $authInfo = $this->orderManager->authentication();
        $authVip = $authInfo && $authInfo->result == 0;

        return $authVip;
    }
}