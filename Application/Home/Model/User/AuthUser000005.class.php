<?php

namespace Home\Model\User;

class AuthUser000005 extends BaseAuthUser
{
    public function auth()
    {
        return $this->getCommonAJAXResult();
    }

    public function checkVIPState()
    {
        return $_REQUEST['vipState'] ? $_REQUEST['vipState'] : 0;
    }
}