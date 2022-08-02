<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;

class AuthUser500092 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        // $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    /** 鉴权当前用户身份 -- 重庆电信由前端鉴权 */
    public function checkVIPState()
    {
        return isset($_REQUEST['vipState']) ? $_REQUEST['vipState'] : 0;
    }

}