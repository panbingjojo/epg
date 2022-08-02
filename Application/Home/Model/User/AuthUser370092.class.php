<?php

namespace Home\Model\User;

use Api\APIController\SystemAPIController;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;

class AuthUser370092 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        // $this->_setEPGParams();
        $commonAJAXResult = $this->getCommonAJAXResult();
        // 上报用户行为轨迹 -- 进入应用
        $enterAction = "1";
        $appContentId = "EPG_GYLM";
        SystemAPI::clickContentInfo($enterAction, $appContentId);
        // 设置查询用户的续订状态
        // MasterManager::setAutoOrderFlag("0");
        return $commonAJAXResult;
    }

}