<?php
/**
 * Created by PhpStorm.
 * @brief: 此文件用于向平台进行信息注册的相关操作
 */

namespace Home\Model\LoginToSP;
use Home\Model\Entry\MasterManager;

class LoginToSPManager
{
    /**
     * 保存服务器问诊参数到服务器
     * @param $paramInfo
     * @return mixed
     */
    static public function LoginToSP()
    {
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_HENANDX:
                $result = LoginToSP410092::loginToSP();
                break;

            default:
                break;
        }


        return $result;
    }
}