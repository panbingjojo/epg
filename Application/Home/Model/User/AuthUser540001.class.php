<?php

namespace Home\Model\User;

class AuthUser540001 extends BaseAuthUser
{
    public function auth()
    {
        return $this->getCommonAJAXResult();
    }
}