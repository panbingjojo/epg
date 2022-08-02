<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/2
 * Time: 17:15
 */

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;

/**
 * Class StatAPI
 * 数据统计模块
 * @package Home\Model\ServerAPI
 */
class StatAPI
{
    /**
     * 上报模块访问数据
     * @param $data
     */
    public static function postAccessModule($data)
    {
        $http = new HttpManager(HttpManager::PACK_ID_REPORT_ACCESS_MODULE);
        $result = $http->requestPost($data);

        return json_decode($result);
    }

    /**
     * @param $userId
     * @param $playInfo
     * @param $entryType 0搜索页面 1首页推荐 2健康视频首页推荐 3视频栏目 4视频专题 5收藏 6退出挽留 7片尾推荐
     * @param $type 视频分类（栏目）
     * @param $isVip
     * @return mixed
     */
    public static function postPlayVideoStart($userId, $isVip, $playInfo)
    {
        // entry_type：0搜索页面 1首页推荐 2健康视频首页推荐 3视频栏目 4视频专题 5收藏 6退出挽留 7片尾推荐
        $json = array(
            "user_account" => MasterManager::getAccountId(),
            "type" => $playInfo["type"],
            "entry_type" => $playInfo["entryType"],
            "is_vip" => $isVip ? 1 : 0,
            "source_id" => $playInfo["sourceId"],
            "title" => $playInfo["title"],
            "search_condition" => $playInfo["searchCondition"],
            "start_dt" =>$playInfo["beginTime"],
        );
        //{"user_account":"test123","source_id":"623","title":"全身减肥运动基础版","type":"4","entry_type":"1","auto_play":"1","search_condition":"健康","start_dt":"2017-10-23 10:01:01"}
        $http = new HttpManager(HttpManager::PACK_ID_REPORT_BEGIN_PLAY_VEDIO);
        $return = $http->requestPost($json);
        return $return;
    }

    /**
     * 上报播放结束
     * @param $userId
     * @param $playInfo
     * @return mixed
     */
    public static function postPlayVideoFinish($userId, $playInfo)
    {
        // 计算时间差
        $beginTime = $playInfo['beginTime'];
        $endTime = date("Y-m-d H:i:s", time());
        $duration = strtotime($endTime) - strtotime($beginTime);

        $json = array(
            "user_account" => MasterManager::getAccountId(),
            "source_id" => $playInfo["sourceId"],
            "play_id" => $playInfo["playId"],
            "play_duration" => $duration,
            "is_order_vip" => $playInfo['isVip'],
            "end_dt" => $endTime,
        );

        $http = new HttpManager(HttpManager::PACK_ID_REPORT_END_PLAY_VIDEO);
        $result = $http->requestPost($json);

        return $result;
    }
}