<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;

class AuthUser410092 extends BaseAuthUser
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

        MasterManager::setSTBModel($_POST['stbModel']); // 设备型号
        MasterManager::setSTBMac($_POST['stbMac']); // 设备ID(Mac地址)
        MasterManager::setSTBId($_POST['stbId']);  // 设备ID(序列号)
        MasterManager::setEpgDomain($_POST['epgDomain']); // 域名
    }

}