<?php

namespace Home\Model\User;

class AuthUser10000006 extends BaseAuthUser
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

        return $authVip;
    }
}