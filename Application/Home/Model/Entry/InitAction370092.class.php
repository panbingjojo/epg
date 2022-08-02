<?php

namespace Home\Model\Entry;

class InitAction370092 extends InitActionTelecom{
    protected function getEPGInfo()
    {
        return isset($_GET['epg_info']) ? $_GET['epg_info'] : null;
    }

    protected function getDecodeEPGInfo($infoValue)
    {
        return $infoValue;
    }

    protected function getInfoByXML($xmlObj)
    {
        $epgInfoMap["userId"] = $xmlObj->userid;
        $epgInfoMap["userToken"] = $xmlObj->usertoken;
        $epgInfoMap["tokenExpireTime"] = $xmlObj->tokenexpiretime;
        $epgInfoMap["areaCode"] = $xmlObj->areacode;
        $epgInfoMap["backUrl"] = isset($_GET['backurl']) ? $_GET['backurl'] : null;

        return $epgInfoMap;
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        $userAccount = $epgInfoMap["userId"];
        MasterManager::setAccountId($userAccount);
        MasterManager::setIPTVPortalUrl($epgInfoMap["backUrl"]);
        MasterManager::setUserToken($epgInfoMap["userToken"]);
        MasterManager::setEPGHomeURL($epgInfoMap["backUrl"]);

        // 更新areaCode和subAreaCode
        $stbAreaId = $_GET['areaCode'];
        if (!empty($stbAreaId)) {
            if (strlen($stbAreaId) == 3) { // 部分用户会使用T开头的账号，这部分用户的areaCode是从盒子端获取的
                MasterManager::setAreaCode("0" . $stbAreaId);
            } else {
                $areaCode = "0" . substr($userAccount, 0, 3); // 山东地区编码从账号截取，字符串"0" + 账号前三位
                MasterManager::setAreaCode($areaCode);
                // 二级地区使用盒子端获取信息
                MasterManager::setSubAreaCode($stbAreaId);
            }
        }

        return $epgInfoMap;
    }
}