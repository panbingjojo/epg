<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;

class InitAction520092 implements InitAction
{

    public function getEPGInfoMap()
    {
        $initParams = array(
            "returnUrl" => "",
            "backUrl" => "",
        );

        return URLUtils::parseURLInfo($initParams);
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        $infoValue = isset($_GET['epg_info']) ? $_GET['epg_info'] : null;
        if (!empty($infoValue)) {
            $infoValue = str_replace('&', "&amp;", $infoValue);
            // 6、解析xml字符串信息
            $xmlStr = "<?xml version='1.0'?><document>" . $infoValue . "</document>";
            $xmlJsonObj = simplexml_load_string($xmlStr);
            $xmlJsonStr = json_encode($xmlJsonObj);
            $xmlObj = json_decode($xmlJsonStr);
            $epgInfoMap = $this->getInfoByXMLSelf($xmlObj);
            LogUtils::info("task epgInfoMap:".json_encode($epgInfoMap));

            MasterManager::setAccountId( $epgInfoMap["userId"]);
            MasterManager::setIPTVPortalUrl($epgInfoMap['returnUrl']);
        }else{
            $epgInfoMap['returnUrl'] = empty($_GET["returnUrl"])?$_GET["backUrl"]:$_GET["returnUrl"];
            //if(empty($_GET["backUrl"]) && empty($epgInfoMap['platform'])){
            //    $epgInfoMap['platform'] = "20";
            //}
            MasterManager::setIPTVPortalUrl($epgInfoMap['returnUrl']);
        }
        $epgInfoMap['edition'] = $_GET["edition"];
        $epgInfoMap['platform'] = $_GET["platform"];
        $fromLaunch = (isset($_GET["platform"]) && $_GET["platform"] == 20) ? 1 : 0;
        MasterManager::setCookieFromLaunch($fromLaunch);
        return $epgInfoMap;
    }

    private function getInfoByXMLSelf($xmlObj)
    {
        $epgInfoMap["userId"] = $xmlObj->oss_user_id;
        $epgInfoMap["server_ip"] = $xmlObj->server_ip;
        $epgInfoMap["userToken"] = $xmlObj->userToken;
        $epgInfoMap["group_name"] = $xmlObj->group_name;
        $epgInfoMap["group_path"] = $xmlObj->group_path;
        $epgInfoMap["userIP"] = get_client_ip();
        $epgInfoMap["stbId"] = ($xmlObj->stbId != null && !empty($xmlObj->stbId)) ? $xmlObj->stbId : "";
        $epgInfoMap["partner"] = $xmlObj->partner;
        $epgInfoMap["stbType"] = $xmlObj->stbType;
        $epgInfoMap["areaCode"] = $xmlObj->areaCode;
        $epgInfoMap["page_url"] = urldecode($xmlObj->page_url);
        $epgInfoMap["returnUrl"] = urldecode($xmlObj->return_url);
        $epgInfoMap["VAStoEPG"] = urldecode($xmlObj->page_url);

        return $epgInfoMap;
    }
}