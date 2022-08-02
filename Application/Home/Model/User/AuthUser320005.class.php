<?php

namespace Home\Model\User;

use Home\Model\Entry\MasterManager;

class AuthUser320005 extends BaseAuthUser
{
    public function auth()
    {
        $this->isSyncVipState = 0;
        return $this->getCommonAJAXResult();
    }

}