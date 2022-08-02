<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;

class AuthUser650094 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        // $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }
}