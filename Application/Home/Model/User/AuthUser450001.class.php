<?php

namespace Home\Model\User;

class AuthUser450001 extends BaseAuthUser
{
    public function auth()
    {
        return $this->getCommonAJAXResult();
    }

    public function checkVIPState()
    {
        return $_REQUEST['vipState'] ? $_REQUEST['vipState'] : 0; // 根据前端鉴权结果
    }
}