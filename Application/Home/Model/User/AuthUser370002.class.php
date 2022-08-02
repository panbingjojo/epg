<?php

namespace Home\Model\User;

class AuthUser370002 extends BaseAuthUser
{
    public function auth()
    {
        return $this->getCommonAJAXResult();
    }
}