<?php

namespace Home\Model\User;

class AuthUser09340001 extends BaseAuthUser
{
    public function auth()
    {
        return $this->getCommonAJAXResult();
    }

    public function checkVIPState()
    {
        return $_REQUEST['vipState'] ? $_REQUEST['vipState'] : 0; // 根据前端鉴权结果
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