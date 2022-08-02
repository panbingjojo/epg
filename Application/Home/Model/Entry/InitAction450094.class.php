<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;

class InitAction450094 implements InitAction {

    // 首页二号位置配置
    const POSITION_TWO_CONFIG = "1";

    public function getEPGInfoMap()
    {
        $initParams = array(
            "user_id" => "",
            "area_code" => "",
            "device_id" => ""
        );
        LogUtils::info("====> client _SERVER INFO: " .json_encode($_SERVER));

        return URLUtils::parseURLInfo($initParams);
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        MasterManager::setAccountId($epgInfoMap["user_id"]);
        MasterManager::setAreaCode($epgInfoMap["area_code"]);
        if (!empty($epgInfoMap["device_id"])) {
            MasterManager::setSTBId($epgInfoMap["device_id"]);
        }
        // 局方大厅返回地址
        MasterManager::setIPTVPortalUrl(PORTAL_URL);
        //设置首页二号位置配置为普通推荐位
        MasterManager::setPositionTwoConfig(self::POSITION_TWO_CONFIG);

        return $epgInfoMap;
    }
}