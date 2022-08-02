<?php

namespace Home\Model\User;

class AuthUser630001 extends BaseAuthUser
{
    public function auth()
    {
        return $this->getCommonAJAXResult();
    }
}