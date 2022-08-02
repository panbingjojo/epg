<?php

namespace Home\Model\Order;

use Home\Model\Entry\MasterManager;

class Pay650094 extends PayAbstract
{

    public function authentication($param = null)
    {

    }

    public function buildVerifyUserUrl($param = null)
    {

    }

    public function buildPayUrl($payInfo = null)
    {

    }

    public function buildUnPayUrl($payInfo = null)
    {

    }

    public function directToPay($orderInfo = null)
    {

    }

    public function payCallback($payResultInfo = null)
    {

    }

    public function unPayCallback($unPayResultInfo = null)
    {

    }

    /**
     * @Brief:此函数用于构建用户信息
     */
    public function buildUserInfo()
    {
        $info = array(
            'accountId' => MasterManager::getAccountId(),
            'userId' => MasterManager::getUserId(),
            'lmcid' => CARRIER_ID,
            'platfromType' => MasterManager::getPlatformType(),

            "providerId" => VENDORC_CODE,
        );

        return $info;
    }
}