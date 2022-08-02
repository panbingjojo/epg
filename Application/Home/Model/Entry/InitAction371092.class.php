<?php

namespace Home\Model\Entry;

class InitAction371092 implements InitAction {

    /**
     * 解析跳转得链接参数
     *  IPTVNumber=T0053&
        hkMac=11:22:33:44:55:66:77:88&
        hkIp=150.123.23.4&
        hkUserToken=ASFrst7826tgdyh87ehdyhfy67ehsu72&
        STBUserToken=ASdbyuhje76354562hdyhifjyrgs87dy&
        backurl=http://132.123.22.12:8900/page/info.html
     * @return array|mixed
     */
    public function getEPGInfoMap()
    {
        return array(
            "userAccount" => $_GET['IPTVNumber'],        // 盒子账号
            "macAddress" => $_GET['hkMac'],              // 盒子Mac地址
            "userToken"  => $_GET['hkUserToken'],        // 海看用户Token
            "stbUserToken"  => $_GET['STBUserToken'],    // 运营商用户Token
            "hkUserAreaID "  => $_GET['hkUserAreaID'],  // 海看区域码
            "STBUserAreaID "  => $_GET['STBUserAreaID'],// 运营商区域码
            "backUrl"  => $_GET['backurl'],              // 局方大厅返回地址
        );
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        $userAccount = $epgInfoMap['userAccount'];
        MasterManager::setAccountId($userAccount);
        MasterManager::setIPTVPortalUrl($epgInfoMap['backUrl']);

        // 更新areaCode和subAreaCode
        $stbAreaId = $_GET['STBUserAreaID'];
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