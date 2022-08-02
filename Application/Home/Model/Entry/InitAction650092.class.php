<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;

class InitAction650092 implements InitAction{

    public function getEPGInfoMap()
    {
        // 获取初始化参数
        $initParams = array(
            "local_inquiry" => null,
            "epg_info" => null,
            "vis_back_url" => null,
            "fromPage" => null,
        );
        $initInfo = URLUtils::parseURLInfo($initParams);
        LogUtils::info("====> initInfo: " . json_encode($initInfo));
        LogUtils::info("====> client _SERVER INFO: " . json_encode($_SERVER));
        if (empty($initInfo['epg_info'])) {
            //用于测试
            // epg_info = "vis_back_url=http%3A%2F%2F202.100.183.2%3A8002%2Fepg%2Findex.jsp%3FlastActiveId%3Da_TVOD_9%26lastCategoryId%3Da_TVOD%26lastContent%3DTVOD_div&epg_info=%3Cserver_ip%3E120.70.233.69%3C%2Fserver_ip%3E%3Cgroup_name%3E%3C%2Fgroup_name%3E%3Cgroup_path%3E%3C%2Fgroup_path%3E%3Coss_user_id%3Etestiptv2557%3C%2Foss_user_id%3E%3Cpage_url%3Ehttp%3A%2F%2F202.100.183.2%3A8002%2Fepg%2Findex.jsp%3C%2Fpage_url%3E%3Cpartner%3EHUAWEI%3C%2Fpartner%3E";
            throw new \Exception("INFO参数为空！");
        }
        MasterManager::setEPGInfo($initInfo['epg_info']);

        // 解析xml参数
        $epgInfoXML = $initInfo['epg_info'] ? "<root>" . $_REQUEST['epg_info'] . "</root>" : null;
        $xmlStr = <<<xml
$epgInfoXML
xml;
        LogUtils::info("---->xmlStr=" . $xmlStr);
        $xmlObj = simplexml_load_string($xmlStr);
        $xmlJson = json_encode($xmlObj);
        LogUtils::info("---->xmlJson=" . $xmlJson);
        $xmlArr = json_decode($xmlJson, true);

        // 账号
        $userAccountId = $xmlArr["oss_user_id"];
        MasterManager::setAccountId($userAccountId);

        // 地区编码
        $accountPrefix = substr($userAccountId, 0, 1);
        $start_with_zero = "0";
        $start_with_nine = "0";
        switch ($accountPrefix) {
            case $start_with_zero:
                $areaCode = substr($userAccountId, 0, 4);
                break;
            case $start_with_nine:
                $tempAC = substr($userAccountId, 0, 3);
                $areaCode = $start_with_zero . $tempAC;
                break;
            default:
                $areaCode = "";
                break;
        }
        MasterManager::setAreaCode($areaCode);

        // 返回链接
        if ($initInfo['vis_back_url']) {
            MasterManager::setIPTVPortalUrl($initInfo['vis_back_url']);
        } else {
            $backUrl = $xmlArr["page_url"] . "?vas_info=%3Cvas_action%3Eback%3C%2Fvas_action%3E";
            LogUtils::info("---->backUrl =" . $backUrl);
            MasterManager::setIPTVPortalUrl($backUrl);
        }

        // 入口标识
        if (!$initInfo['fromPage']) {
            MasterManager::setFromPage($initInfo['fromPage']);
        }

        // 是否使用本地互联网医疗平台
        MasterManager::setLocalInquiry(0);
        if (!empty($initInfo['local_inquiry'])) {
            MasterManager::setLocalInquiry($initInfo['local_inquiry']);
            LogUtils::info('local_inquiry = '.MasterManager::getLocalInquiry());
        }

        return array();
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        return $epgInfoMap;
    }
}