<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |主要用于apk版本更新
 *  由于apk2.0的主要功能都在网页端，并且客户端出现影响功能的bug才需要更新，
 * 所以必须需要用户更新以后才能使用
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2019/7/12 14:09                                               |
 * +----------------------------------------------------------------------+
 */

namespace Home\Model\Common;


use Home\Model\Common\ServerAPI\VersionAPI;
use Home\Model\Entry\MasterManager;

class VersionManager
{
    /**
     * 获取版本更新数据
     * @return string
     */
    public static function getVersion()
    {

        $retArr = array(
            "result" => -1, //不需要版本更新
            "data" => ""
        );
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_GUANGXIGD:
                if (MasterManager::getSTBVersion() > 20000) {
                    $versionArr = VersionAPI::getVersionInfo();
                    if ($versionArr["result"] == "-101" || $versionArr["result"] == "-102") {
                        $retArr["result"] = 0;
                        $retArr["data"] = $versionArr;
                    }
                    LogUtils::info("start update apk and retVersion=" . json_encode($retArr));
                }
                break;
            case CARRIER_ID_NEIMENGGU_DX:
                $versionArr = Version::getVersionInfo();
                if ($versionArr["result"] == "-101" || $versionArr["result"] == "-102") {
                    $retArr["result"] = 0;
                    $retArr["data"] = $versionArr;
                }
                LogUtils::info("start update apk and retVersion=" . json_encode($retArr));
                break;
        }
        return json_encode($retArr);
    }
}