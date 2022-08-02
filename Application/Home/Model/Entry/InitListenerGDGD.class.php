<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;

class InitListenerGDGD implements OnApplicationInitListener {



    // 局方指定跳转新版大厅地址
    const HALL_URL = 'http://172.31.135.93:9093/health/login.html';

    public function onApplicationInit()
    {
        // 1、获取入口链接标识
        $urlFlag = MasterManager::getEnterPosition();
        LogUtils::info("urlFlag = $urlFlag");
        $routeHallFlagList440004 = array(1, 2); // 1 - 固定跳转链接 （网关版本）
        $routeHallFlagList440094 = array(7, 8); // 7 - 固定跳转链接
        // 网关版本路由局方大厅链接条件
        $isRoute440004 = CARRIER_ID == CARRIER_ID_GUANGDONGGD_NEW && in_array($urlFlag, $routeHallFlagList440004);
        // 高清版本局方大厅链接条件
        $isRoute440094 = CARRIER_ID == CARRIER_ID_GUANGDONGGD && in_array($urlFlag, $routeHallFlagList440094);
        // 2、判断如果为指定链接标识，则跳转指定链接
        if ($isRoute440004 || $isRoute440094) {
            header("Location:" . self::HALL_URL);
            // 并且退出应用程序
            exit();
        }
    }
}