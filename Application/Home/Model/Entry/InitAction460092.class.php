<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;

class InitAction460092 extends InitActionTelecom
{

    private $isSetInfo = true;

    protected function getEPGInfo()
    {
        $infoValue = isset($_GET['INFO']) ? $_GET['INFO'] : null;
        if (empty($infoValue)) {
            $this->isSetInfo = false; // 设置其他解析方式
            $infoValue = isset($_GET['epg_info']) ? $_GET['epg_info'] : null;
        }
        return $infoValue;
    }

    protected function getDecodeEPGInfo($infoValue)
    {
        if ($this->isSetInfo) {
            return urldecode($infoValue);
        } else {
            $infoValue = htmlspecialchars_decode(urldecode($infoValue));
        }
        return $infoValue;
    }

    protected function getInfoByXML($xmlObj)
    {
        if ($this->isSetInfo) {
            return parent::getInfoByXML($xmlObj);
        } else {
            return $this->getInfoByXMLSelf($xmlObj);
        }
    }

    private function getInfoByXMLSelf($xmlData)
    {
        $initParams = array(
            "UserID" => null,
            "iptv_flag" => null,
            "backUrl" => null,
            "group" => null,
            "fromLaunch" => null,
        );
        $epgInfoMap = URLUtils::parseURLInfo($initParams);

        $epgInfoMap["server_ip"] = $xmlData->server_ip;
        $epgInfoMap["group_name"] = $xmlData->group_name;
        $epgInfoMap["group_path"] = $xmlData->group_path;
        $epgInfoMap["page_url"] = $xmlData->page_url;
        $epgInfoMap["partner"] = $xmlData->partner;
        $epgInfoMap["productId"] = $xmlData->productId;
        $epgInfoMap["userId"] = empty($epgInfoMap["UserID"]) ? $xmlData->oss_user_id : $epgInfoMap["UserID"];
        $epgInfoMap["userToken"] = "";
        $epgInfoMap["userIP"] = get_client_ip();
        $epgInfoMap["stbId"] = !empty($xmlData->stbId) ? $xmlData->stbId : "";
        $epgInfoMap["areaCode"] = $xmlData->area;
        $epgInfoMap["VAStoEPG"] = $xmlData->page_url;

        return $epgInfoMap;
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        if ($this->isSetInfo) {
            return parent::handleEPGInfoMap($epgInfoMap);
        } else {
            return $this->handleEPGInfoMapSelf($epgInfoMap);
        }
    }

    protected function getInfoStrWithSPCodeTag($backUrl)
    {
        return $this->infoValue . "<SPID>spaj0080</SPID>";
    }

    protected function handelAreaSpecial($epgInfoMap)
    {
        // 对IP进行过滤，如果存在端口，就把端口去掉
        $idx = strpos($epgInfoMap["userIP"], ":");
        if ($idx > 0) {
            LogUtils::info("userIp[".$epgInfoMap["userIP"] ."] is not the normal! client ip: " . get_client_ip());
            $epgInfoMap["userIP"] = get_client_ip();
        }

        // 解析设置区域码
        $areaCode = substr($epgInfoMap['userAccount'], 0, 4);
        LogUtils::info("=====> get areaCode[ $areaCode ] from account= {$epgInfoMap['userAccount']}");
        MasterManager::setAreaCode($areaCode);
    }

    /**
     * 私有的出信息参数解析方式
     * @param array $epgInfoMap URL链接中解析得到的参数
     * @return mixed 处理之后的参数
     */
    private function handleEPGInfoMapSelf($epgInfoMap)
    {
        // 局方要求在返回时，增加info参数信息
        $iptvPortalUrl = isset($epgInfoMap["back_url"]) && !empty($epgInfoMap["back_url"]) ? $epgInfoMap["back_url"] : $epgInfoMap["page_url"];

        MasterManager::setCookieFromLaunch($epgInfoMap['fromLaunch']);
        MasterManager::setAreaCode($epgInfoMap["areaCode"]);
        MasterManager::setIPTVPortalUrl($iptvPortalUrl);
        MasterManager::setAccountId($epgInfoMap['userId']);

        return $epgInfoMap;
    }
}