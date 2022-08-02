<?php

namespace Home\Model\User;

class AuthUser450004 extends BaseAuthUser
{
    public function auth()
    {
        return $this->getCommonAJAXResult();
    }

    public function checkVIPState()
    {
        $postIsVip =  $_REQUEST['vipState'] ? $_REQUEST['vipState'] : -1;
        $isVip = 0;
        if($postIsVip === 0 || $postIsVip === "0"){
            $isVip = 1;
        }
        return $isVip;
    }
}