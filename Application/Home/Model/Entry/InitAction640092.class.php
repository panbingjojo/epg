<?php

namespace Home\Model\Entry;

class InitAction640092 extends InitActionTelecom {

    //    获取EPG信息
    protected function getEPGInfo() {
        $infoValue = isset($_GET['INFO']) ? $_GET['INFO'] : null;
        if ($_GET["amp;returnurl"] || $_GET["returnurl"]) {
            $infoValue = $infoValue . "returnurl=" . $_GET["amp;returnurl"];
        }
        return $infoValue;
    }

    protected function getDecodeEPGInfo($infoValue) {
        return $infoValue;
    }

    protected function getInfoStrWithSPCodeTag($backUrl) {
        if (MasterManager::getSubId() != 2) {
            if (strpos($backUrl, "SPToAmsEducation") || strpos($backUrl, "SPToAmsHigh")) {
                return urldecode($this->infoValue . "<SPID>spaj0080</SPID>");
            }
        }
        return urldecode($this->infoValue);
    }

    protected function handelAreaSpecial($epgInfoMap) {
        $back_epg_url = urldecode($epgInfoMap["back_epg_url"]);
        if (strpos($back_epg_url, "Launcher")) {
            MasterManager::setIPTVPortalUrl($back_epg_url);
        }

        $accountPrefix = substr($epgInfoMap['userAccount'], 0, 3);
        $areaCode = "";
        if (strtolower($accountPrefix) == "itv" || strtolower($accountPrefix) == "tvh") {
            $areaCode = substr($epgInfoMap['userAccount'], 3, 4);
        }
        MasterManager::setAreaCode($areaCode);
    }
}