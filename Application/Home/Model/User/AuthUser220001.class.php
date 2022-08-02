<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\Pay220001;
use Think\Exception;

class AuthUser220001 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        // $this->_setEPGParams();
        // 查询用户在局方是否黑名单用户
        $orderManager = new Pay220001();
        try {
            // 查询用户在局方是否黑名单用户
            if ($orderManager->checkUserInBlacklist()) {
                MasterManager::setOrderBlacklistUserState(1);
            } else {
                MasterManager::setOrderBlacklistUserState(0);
            }
        } catch (Exception $e) {
            LogUtils::error("setOrderBlacklistUserState error");
        }
        return $this->getCommonAJAXResult();
    }

    /**
     * 辽宁电信应用业务参数保存
     */
    /*private function _setEPGParams()
    {
        LogUtils::info("_setEPGParams: " . json_encode($_POST));
    }*/

}