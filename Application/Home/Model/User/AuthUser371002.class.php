<?php

namespace Home\Model\User;

class AuthUser371002 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        // $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    private function _setEPGParams()
    {

    }

    public function checkVIPState()
    {
        return $_REQUEST['vipState']; // 根据前端鉴权结果
    }
}