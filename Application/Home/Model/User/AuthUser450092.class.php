<?php

namespace Home\Model\User;

use Api\APIController\DebugAPIController;
use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\Pay450092;

class AuthUser450092 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        // $this->_setEPGParams();
        $result = $this->getCommonAJAXResult();
        // 1、用户登录行为上报局方接口
        DebugAPIController::sendUserBehaviourAction(2);
        return $result;
    }


    /** 鉴权用户身份，用户进入时先对大包进行鉴权，弱鉴权未成功，再使用小包鉴权，整个过程同步进行 */
    public function checkVIPState()
    {
        // 1、大包鉴权
        $orderManager = new Pay450092();
        $authResult = $orderManager->authentication(array("SPID" => SPID_SMALL), PRODUCT_ID_18);;
        if ($authResult == 0) {
            // 2、大包鉴权未通过，小包鉴权
            $authResult = $orderManager->authentication(array("SPID" => SPID_LARGE), PRODUCT_ID_LIFE);
        }

        if (MasterManager::getEnterPosition() == '145') {
            $authResult = 1;
        }

        return $authResult;
    }

}