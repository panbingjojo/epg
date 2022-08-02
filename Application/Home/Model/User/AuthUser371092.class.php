<?php

namespace Home\Model\User;

use Home\Model\Activity\ActivityManager;


class AuthUser371092 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        // $this->_setEPGParams();
        // 设置查询用户的续订状态
        // MasterManager::setAutoOrderFlag("0");
        $result = $this->getCommonAJAXResult();
        $activityInfo = ActivityManager::getActivityInfo();
        $result["activityId"] = $activityInfo['activity_id'];;
        $result["activityName"] = $activityInfo['unique_name'];
        return $result;
    }

    /**
     * 鉴权方法，由前端鉴权
     *
     * @return mixed 1 -- 鉴权为VIP，0 -- 鉴权为普通用户
     */
    public function checkVIPState()
    {
        return $_REQUEST['vipState'];
    }

}