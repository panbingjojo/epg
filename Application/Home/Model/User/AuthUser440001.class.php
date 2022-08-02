<?php

namespace Home\Model\User;

use Home\Model\Common\CookieManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class AuthUser440001 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    private function _setEPGParams()
    {

        $accountId = $_POST['accountId'] ? $_POST['accountId'] : null;
        $deviceInfo = $_POST['deviceInfoForGuangDongYD'] ? $_POST['deviceInfoForGuangDongYD'] : '';
        if ($accountId && $deviceInfo) {
            MasterManager::setAccountId($accountId);
            // CookieManager::setCookie(CookieManager::$C_EPG_INFO_MAP, $_POST['accountId']);
            MasterManager::setAreaCode(substr($accountId, 0, 3));
            // 原程序未发现使用的地方，暂时先注释
            // MasterManager::setGuangDongYDDeviceInfo($deviceInfo);
        }
        LogUtils::info("_setEPGParams：" . json_encode($_POST));
    }

    public function checkVIPState()
    {
        $accountId = MasterManager::getAccountId();
        if($accountId == "zte0209"){
            return 1;
        }
        return $_REQUEST['vipState']; // 根据前端鉴权结果
    }
}