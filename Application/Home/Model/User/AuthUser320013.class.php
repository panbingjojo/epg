<?php

namespace Home\Model\User;

class AuthUser320013 extends BaseAuthUser
{
    public function auth()
    {
        return $this->getCommonAJAXResult();
    }

    public function checkVIPState()
    {
        $this->isSyncVipState = 0;
        return 0; // 依据cws的接口返回状态为准
    }
}