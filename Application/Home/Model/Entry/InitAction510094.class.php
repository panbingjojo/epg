<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;

class InitAction510094 implements InitAction{

    public function getEPGInfoMap()
    {
        $initParams = array(
            "userId" => "",
            "backUrl" => "",
            "historyLength" => "",
        );
        $epgInfoMap = URLUtils::parseURLInfo($initParams, URLUtils::COMMON_REQUEST_TYPE);
        $epgInfoMap['userIP'] = get_client_ip(); // 由于客户端没有传ip过来，所以只能读取

        LogUtils::info(__FILE__ . '#' . __FUNCTION__ . '()-->[$_SERVER] info: ' . json_encode($_SERVER));
        LogUtils::info(__FILE__ . '#' . __FUNCTION__ . '()-->[$_REQUEST] param: ' . json_encode($_REQUEST));
        return $epgInfoMap;
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        if (empty($epgInfoMap['userId'])) {
            //填写测试信息
            $epgInfoMap['userId'] = "lmtest-sichuangd-epg-default";
        }

        LogUtils::info(__FILE__ . '#' . __FUNCTION__ . '()-->UserId:' . $epgInfoMap['userId']);
        LogUtils::info(__FILE__ . '#' . __FUNCTION__ . '()-->EpgInfoMap:' . json_encode($epgInfoMap));

        //全局缓存所有会话信息
        MasterManager::setSplashHistoryLength($epgInfoMap['historyLength']);

        MasterManager::setAccountId($epgInfoMap['userId']);
        MasterManager::setIPTVPortalUrl($epgInfoMap['backUrl']);

        return $epgInfoMap;
    }
}