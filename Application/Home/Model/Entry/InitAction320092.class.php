<?php

namespace Home\Model\Entry;

use Exception;
use Home\Model\Common\LogUtils;

class InitAction320092 extends InitActionTelecom {

    protected function getDecodeIPTVPortalUrl($backUrl)
    {
        if (isset($_GET["zhiJiaBackUrl"]) && !empty($_GET["zhiJiaBackUrl"])) {
            $backUrl = $_GET["zhiJiaBackUrl"];
        }
        return urldecode($backUrl);
    }

    protected function getInfoStrWithSPCodeTag($backUrl)
    {
        return urldecode($this->infoValue . "<SPID>spaj0128</SPID>");
    }

    protected function handelAreaSpecial($epgInfoMap)
    {
        $indexStart = 0;
        $areaCodeStrLength = 3;
        $notNanJinAreaStrLength = 4;
        // 先提取前3个字符，看是否为南京：025
        $areaCode = substr($epgInfoMap['userAccount'], $indexStart, $areaCodeStrLength);
        if ($areaCode != NANJING) {
            $areaCode = substr($epgInfoMap['userAccount'], $indexStart, $notNanJinAreaStrLength);
        }

        if (!preg_match("/^[0-9]*$/", $areaCode)) {
            $areaCode = "";
        }
        LogUtils::info("=====> get areaCode[ $areaCode ] from account= {$epgInfoMap['userAccount']}");
        MasterManager::setAreaCode($areaCode); //设置区域码
    }

    protected function checkParams($key, $spId)
    {
        $spidList =[SPID, "spaj0128", "99999999"];
        if (!$key || ($spId && !in_array($spId, $spidList))) {
            throw new Exception("非法INFO参数访问！");
        }
    }
}