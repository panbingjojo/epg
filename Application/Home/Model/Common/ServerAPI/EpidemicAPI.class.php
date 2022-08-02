<?php
/**
 * Created by PhpStorm.
 * Brief: 疫情数据接口
 */

namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\LogUtils;
use Home\Model\Common\RedisManager;
use Home\Model\Epidemic\EpidemicManager;
use Org\Util\Date;

class EpidemicAPI
{
    public static function getEpidemicDetails()
    {
        $arr = array(
        );

        $key = RedisManager::buildKey(RedisManager::$REDIS_ACCESS_EPIDEMIC_DETAILS);
        $res = RedisManager::getPageConfig($key);
        if (!$res || CARRIER_ID === '450001') {
            LogUtils::info('getEpidemicDetails------interface----'. $res);
            $res = EpidemicManager::queryHLWYY(EpidemicManager::FUNC_GET_EPIDEMIC_DETAILS, json_encode($arr));
            RedisManager::setPageConfig($key, $res);
        }

        LogUtils::info('getEpidemicDetails------'. $res);
        return $res;
    }

    public static function getEpidemicDetailsByDate()
    {
        $arr = array(
            'date'=>\date('Y-m-d',strtotime('-1 day'))
        );

        $res = EpidemicManager::queryHLWYY(EpidemicManager::FUNC_GET_EPIDEMIC_DETAILS_BY_DATE, json_encode($arr));

        LogUtils::info('getEpidemicDetails------'. $res);
        return $res;
    }

    public static function getEpidemicStatistics()
    {
        $arr = array(
        );
        $key = RedisManager::buildKey(RedisManager::$REDIS_ACCESS_EPIDEMIC_STATISTICS);
        $res = RedisManager::getPageConfig($key);
        if (!$res) {
            $res = EpidemicManager::queryHLWYY(EpidemicManager::FUNC_GET_EPIDEMIC_STATISTICS, json_encode($arr));
            RedisManager::setPageConfig($key, $res);
        }

        return $res;
    }

    public static function getEpidemicRealSowing($page = 1, $pageSize = 10)
    {
        $arr = array(
            "page" => $page,
            "pageSize" => $pageSize
        );
        $key = RedisManager::buildKey(RedisManager::$REDIS_ACCESS_EPIDEMIC_REAL_SOWING);
        $res = RedisManager::getPageConfig($key);
        if (!$res) {
            $res = EpidemicManager::queryHLWYY(EpidemicManager::FUNC_GET_EPIDEMIC_REAL_SOWING, json_encode($arr));
            RedisManager::setPageConfig($key, $res);
        }

        return $res;
    }

    public static function getEpidemicSameTrip($date, $type, $no, $area, $page, $pageSize) {
        $arr = array(
            "date" => $date,
            "type" => $type,
            "no" => $no,
            "area" => $area,
            "pageindex" => $page,
            "pagesize" => $pageSize
        );

        $res = EpidemicManager::query39Net(EpidemicManager::FUNC_GET_EPIDEMIC_SAME_TRIP, json_encode($arr));

        return $res;
    }

    public static function getEpidemicDistrictArea($province, $city, $district) {
        $arr = array(
            "province" => $province,
            "city" => $city,
            "district" => $district,
        );

        $res = EpidemicManager::query39Net(EpidemicManager::FUNC_GET_EPIDEMIC_DISTRICT_AREA, json_encode($arr));

        return $res;
    }
    public static function getIsolatedArea($fromCity, $toCity)
    {
        $arr = array(
            "fromCity" => $fromCity,
            "toCity" => $toCity,
        );
        $res = EpidemicManager::query39Net(EpidemicManager::FUNC_GET_ISOLATED_AREA, json_encode($arr));
        return $res;
    }
}