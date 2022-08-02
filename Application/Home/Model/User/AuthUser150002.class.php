<?php

namespace Home\Model\User;

class AuthUser150002 extends BaseAuthUser
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