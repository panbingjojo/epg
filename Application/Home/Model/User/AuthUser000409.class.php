<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;

class AuthUser000409 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        // $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    /**
     * 应用业务参数保存
     */
   /* private function _setEPGParams()
    {
        LogUtils::info("_setEPGParams: " . json_encode($_POST));
    }*/

    /**
     * 校验用户身份
     * @return int 1 默认用户VIP身份
     */
    public function checkVIPState()
    {
        return 1;
    }

    /**
     * 上报用户信息
     * @param String $userId 用户标识
     * @return int 0 默认用户不上报身份信息
     */
    public function isReportUserInfo($userId)
    {
        return 0;
    }

}