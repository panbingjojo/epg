<?php

namespace Home\Model\User;

use Home\Model\Entry\MasterManager;

class AuthUser000006 extends BaseAuthUser
{
    public function auth()
    {
        return $this->getCommonAJAXResult();
    }

    public function checkVIPState()
    {
        // 从OrderManager中鉴权是否Vip
        $authInfo = $this->orderManager->authentication();
        $authVip = $authInfo && $authInfo->result == 0;

        // 青海、新疆的apk，先免费使用
        if (MasterManager::getAreaCode() == "230" || MasterManager::getAreaCode() == "228" ) {
            return 1;
        }
        return $authVip;
    }
}