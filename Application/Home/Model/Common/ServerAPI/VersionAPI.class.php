<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * | apk版本更新功能
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2019/7/12 11:14                                               |
 * +----------------------------------------------------------------------+
 */

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Entry\MasterManager;

class VersionAPI
{
    public static function getVersionInfo()
    {
        $reqJson = array(
            "carrier_id" => MasterManager::getCarrierId(),
            "version_num" => MasterManager::getSTBVersion()  //客户端版本
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_VERSION);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }
}