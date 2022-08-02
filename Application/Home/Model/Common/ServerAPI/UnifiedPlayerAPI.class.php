<?php
/**
 * 此API接口统一播放器，获取局方保存的视频收藏、播放记录等
 * Date: 2019-11-15
 * Time: 15:10
 */

namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class UnifiedPlayerAPI
{
    /**
     * 播放记录保存。暂时不用，统一播放器会自动上报播放记录（青海地区）
     * @param $contentCode 内容code
     * @return mixed
     */
    public static function savePlayRecord($contentCode)
    {
        $url = UNIFIED_PLAYER_REQUEST_URL . 'playRecord/saveRecord?episode=1&playDuration=0';
        $url .= '&itvName=' . MasterManager::getAccountId();
        $url .= '&parentContentCode=' . $contentCode;
        $url .= '&contentCode=' . $contentCode;
        LogUtils::info("savePlayRecord url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * 播放记录获取（青海地区）
     * @param $pageNumber
     * @param $pageSize
     * @return mixed
     */
    public static function getPlayRecords($pageNumber, $pageSize)
    {
        $url = UNIFIED_PLAYER_REQUEST_URL . 'playRecord/getRecordsBySP?beginTime=&endTime=&platform=';
        $url .= '&itvName=' . MasterManager::getAccountId();
        $url .= '&pageNumber=' . $pageNumber;
        $url .= '&pageSize=' . $pageSize;
        $url .= '&spID=' . SPID;
        LogUtils::info("getPlayRecords url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * 播放记录删除（青海地区）
     * @param $contentCodes 内容code，多个逗号分隔
     * @return mixed
     */
    public static function deletePlayRecords($contentCodes)
    {
        $url = UNIFIED_PLAYER_REQUEST_URL . 'playRecord/deleteRecords?';
        $url .= 'itvName=' . MasterManager::getAccountId();
        $url .= '&contentCodes=' . $contentCodes;
        LogUtils::info("deletePlayRecords url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * 新增收藏（青海地区）
     * @param $contentCode 内容code
     * @return mixed
     */
    public static function addCollection($contentCode)
    {
        $url = UNIFIED_PLAYER_REQUEST_URL . 'collection/add?';
        $url .= 'itvName=' . MasterManager::getAccountId();
        $url .= '&contentCode=' . $contentCode;
        LogUtils::info("addCollection url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * 获取收藏列表（青海地区）
     * @param $pageNumber
     * @param $pageSize
     * @return mixed
     */
    public static function getCollections($pageNumber, $pageSize)
    {
        $url = UNIFIED_PLAYER_REQUEST_URL . 'collection/listbySP?beginTime=&endTime=&platform=';
        $url .= '&itvName=' . MasterManager::getAccountId();
        $url .= '&pageNumber=' . $pageNumber;
        $url .= '&pageSize=' . $pageSize;
        $url .= '&spID=' . SPID;
        LogUtils::info("getCollections url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * 删除收藏（青海地区）
     * @param $contentCodes 内容code，多个逗号分隔
     * @return mixed
     */
    public static function deleteCollections($contentCodes)
    {
        $url = UNIFIED_PLAYER_REQUEST_URL . 'collection/del?';
        $url .= 'itvName=' . MasterManager::getAccountId();
        $url .= '&contentCodes=' . $contentCodes;
        LogUtils::info("deleteCollections url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * 查询收藏状态（青海地区）
     * @param $contentCode 内容code
     * @return mixed
     */
    public static function queryCollectionStatus($contentCode)
    {
        $url = UNIFIED_PLAYER_REQUEST_URL . 'collection/status?';
        $url .= 'itvName=' . MasterManager::getAccountId();
        $url .= '&contentCode=' . $contentCode;
        LogUtils::info("queryCollectionStatus url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }
}