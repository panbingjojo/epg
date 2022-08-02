<?php

namespace Home\Model\Entry;

use Home\Model\Common\URLUtils;

class InitAction520094 implements InitAction
{

    public function getEPGInfoMap()
    {
        $initParams = array(
            "returnUrl" => "",
            "fromLaunch" => 0
        );

        return URLUtils::parseURLInfo($initParams);
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        MasterManager::setIPTVPortalUrl($epgInfoMap['returnUrl']);
        MasterManager::setCookieFromLaunch($epgInfoMap['fromLaunch']);
        return $epgInfoMap;
    }
}