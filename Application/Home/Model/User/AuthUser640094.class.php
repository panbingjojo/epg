<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;

class AuthUser640094 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        // $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    /** 鉴权用户身份，用户的鉴权逻辑在局方，直接返回默认值 */
    public function checkVIPState()
    {
        return 0;
    }

    /**
     * 是否上报用户信息，加快用户进入应用的时间，直接返回结果
     * @param String $userId 用户标识
     * @return int 是否上报成功
     */
    public function isReportUserInfo($userId)
    {
        return 0;
    }

}