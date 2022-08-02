<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\LoginToSP\LoginToSPManager;

class InitListener410092 implements OnApplicationInitListener{

    public function onApplicationInit()
    {
        if (MasterManager::getLoginToSP() == 1) {
            $loginUrl = LoginToSPManager::LoginToSP();
            LogUtils::info("should login to platform");
            header("Location:" . $loginUrl);
            exit();
        }
    }
}