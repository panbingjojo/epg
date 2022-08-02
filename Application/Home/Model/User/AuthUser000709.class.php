<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;

class AuthUser000709 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        // $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    /**
     * 辽宁电信应用业务参数保存
     */
   /* private function _setEPGParams()
    {
        LogUtils::info("_setEPGParams: " . json_encode($_POST));
    }*/

}