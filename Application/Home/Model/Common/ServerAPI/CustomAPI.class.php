<?php

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Entry\MasterManager;

class Custom
{

    /**
     * 查询用户签到信息
     * @param: start_dt
     * @param: end_dt
     * @return mixed
     */
    public static function queryMark($start_dt, $end_dt)
    {
        $json = array(
            "start_dt" => $start_dt,
            "end_dt" => $end_dt,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_DATE_MARK_INFO);

        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 获取签到获得设置的抽奖信息
     * @return mixed
     */
    public static function activityInfo($activity_Id)
    {
        $json = array(
            "activity_id" => $activity_Id,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_REQUEST);
        $result = $httpManager->requestPost($json);
        return $result;
    }


    /**
     * 执行用户签到
     * @return mixed
     */
    public static function addMark()
    {

        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_USER_DATE_MARK);
        $result = $httpManager->requestPost(null);

        return json_decode($result);
    }

    /**
     * 查询奖品信息
     * @return mixed
     */
    public static function queryPrize()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_PRIZE_CONFIGURATION);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }
}