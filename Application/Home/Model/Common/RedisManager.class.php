<?php
/**
 * Redis管理类
 */

namespace Home\Model\Common;

use Home\Model\Entry\MasterManager;
use Redis;

class RedisManager
{
    public static $REDIS_HOME_CONFIG = "redis_home"; // 首页及栏目页
    public static $REDIS_HOLD_CONFIG = "redis_hold"; // 退出挽留页
    public static $REDIS_HOME_CONFIG_V13 = "redis_home_config_v13"; // 首页模式V13配置
    public static $REDIS_HOME_PAGE_CONFIG = "redis_home_page"; // 首页及栏目页
    public static $REDIS_NAV_RECOMMEND_CONFIG = "redis_nav_recommend"; // 首页解析后视频播放的数据
    public static $REDIS_ACCESS_MODULE = "redis_access_module"; // 用户访问记录

    public static $REDIS_VIDEO_CLASSIFY = "redis_video_classify"; // 视频分类
    public static $REDIS_CUSTOMIZE_SKIN = "redis_customize_skin"; // 自定义皮肤

    public static $REDIS_EPG_THEME_PICTURE = "redis_epg_theme_picture"; // 主题图片
    public static $REDIS_ORDER_PAGE_RULE = "redis_order_page_rule"; // 订购页规则

    public static $REDIS_ACCESS_EPIDEMIC_DETAILS = "redis_access_epidemic_details"; // 获取疫情详情
    public static $REDIS_ACCESS_EPIDEMIC_STATISTICS = "redis_access_epidemic_stat"; // 获取疫情数据统计
    public static $REDIS_ACCESS_EPIDEMIC_REAL_SOWING = "redis_access_epidemic_real_sowing"; // 获取疫情实播

    public static $REDIS_HEALTH_DEVICE_BASE = "redis_health_device_base"; // 健康检测- 卡通前置配置
    public static $REDIS_HEALTH_DEVICE_LIST = "redis_health_device_list"; // 健康检测- 具体设备列表信息
    public static $REDIS_HEALTH_DEVICE_INTRO = "redis_health_device_intro"; // 健康检测- 检测设备说明

    /**
     * @brief: 生成redis的字段key --- 带有areaCode
     * @param $info
     * @return string
     */
    public static function buildKeyByAreaCode($info) {
        $key = $info ."_" . MasterManager::getCarrierId() . "_" . MasterManager::getAreaCode();
        return $key;
    }

    /**
     * @brief: 生成redis的字段key --- 不带有areaCode
     * @param $info
     * @return string
     */
    public static function buildKey($info) {
        $key = $info ."_" . MasterManager::getCarrierId();
        return $key;
    }

    /**
     * @brief: 判断redis是否正常工作
     * @return bool
     */
    public static function redisIsWorking() {
        if (defined("IS_REDIS_CACHE_DATA") && (IS_REDIS_CACHE_DATA == 1) && defined("REDIS_LOCAL_IP")) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 设置配置信息
     * @param $key
     * @param: $dataStr 配置内容JSON对象
     * @param int $expireTime redis中键值过期时间
     */
    public static function setPageConfig($key, $dataStr,$expireTime=REDIS_EXPIRE_TIME)
    {
        if (!self::redisIsWorking()) {
            return;
        }

        try {
            $redis = new Redis();
            $isSuccess = $redis->connect(REDIS_LOCAL_IP, REDIS_LOCAL_PORT);
            $isAuth = $redis->auth(REDIS_AUTH_PASSWORD);
            if ($isSuccess && $isAuth) {
                $isWriteSuccess = $redis->setex($key, $expireTime, $dataStr);
                $redis->close();
            } else {
                LogUtils::info("connect Redis failed!");
            }
        } catch (\RedisException  $e) {
            $ip = REDIS_LOCAL_IP;
            $port = REDIS_LOCAL_PORT;
            LogUtils::info("RedisException::operator redis failed[$ip:$port]!!!: " . $e->getMessage());
            return;
        }
    }

    /**
     * 获取配置信息
     * @param $key
     * @return bool|string
     */
    public static function getPageConfig($key)
    {
        $data = "";
        if (!self::redisIsWorking()) {
            return $data;
        }

        try {
            $redis = new Redis();
            $isSuccess = $redis->connect(REDIS_LOCAL_IP, REDIS_LOCAL_PORT);
            $isAuth = $redis->auth(REDIS_AUTH_PASSWORD);
            if ($isSuccess && $isAuth) {
                $data = $redis->get($key);
                $redis->close();
            } else {
                LogUtils::info("connect Redis failed!");
            }
            return $data;
        } catch (\RedisException $e) {
            $ip = REDIS_LOCAL_IP;
            $port = REDIS_LOCAL_PORT;
            LogUtils::info("RedisException::operator redis failed[$ip:$port]!!!: " . $e->getMessage());
            return $data;
        }
    }


    /**
     * 设置配置信息
     * @param $key
     * @param $dataStr： 数组形式
     */
    public static function pushPageConfig($key, $dataStr)
    {
        if (!self::redisIsWorking()) {
            return ;
        }

        try {
            $redis = new Redis();
            $isSuccess = $redis->connect(REDIS_LOCAL_IP, REDIS_LOCAL_PORT);
            $isAuth = $redis->auth(REDIS_AUTH_PASSWORD);
            if ($isSuccess && $isAuth) {
                $isWriteSuccess = $redis->rPush($key, json_encode($dataStr));
                $redis->close();
            } else {
                LogUtils::info("connect Redis failed!");
            }
        } catch (\RedisException  $e) {
            $ip = REDIS_LOCAL_IP;
            $port = REDIS_LOCAL_PORT;
            LogUtils::info("RedisException::operator redis failed[$ip:$port]!!!: " . $e->getMessage());
            return;
        }
    }

    /**
     * @brief: 获取配置信息
     * @param $key
     * @param $count： pop个数
     * @return string
     */
    public static function popPageConfig($key, $count)
    {
        $dataList = [];
        if (!self::redisIsWorking()) {
            return $dataList;
        }

        try {
            $redis = new Redis();
            $isSuccess = $redis->connect(REDIS_LOCAL_IP, REDIS_LOCAL_PORT);
            $isAuth = $redis->auth(REDIS_AUTH_PASSWORD);
            if ($isSuccess && $isAuth) {
                for ($i = 0; $i < $count; $i++) {
                    $item = $redis->lPop($key);
                    if (empty($item)) {
                        break;
                    }
                    $dataList[$i] = json_decode($item);
                }
                $redis->close();
            } else {
                LogUtils::info("connect Redis failed!");
            }
        } catch (\RedisException  $e) {
            $ip = REDIS_LOCAL_IP;
            $port = REDIS_LOCAL_PORT;
            LogUtils::info("RedisException::operator redis failed[$ip:$port]!!!: " . $e->getMessage());
            return "";
        }

        return $dataList;
    }

    /**
     * 获取保存字段的个数 ，就是判断数组的长度
     * @param $key
     * @return int
     */
    public static function checkPushLen($key) {
        $count = 0;

        if (!self::redisIsWorking()) {
            return $count;
        }

        try {
            $redis = new Redis();
            $isSuccess = $redis->connect(REDIS_LOCAL_IP, REDIS_LOCAL_PORT);
            $isAuth = $redis->auth(REDIS_AUTH_PASSWORD);
            if ($isSuccess && $isAuth) {
                $count = $redis->lLen($key);
                $redis->close();
            } else {
                LogUtils::info("connect Redis failed!");
            }
        } catch (\RedisException  $e) {
            $ip = REDIS_LOCAL_IP;
            $port = REDIS_LOCAL_PORT;
            LogUtils::info("RedisException::operator redis failed[$ip:$port]!!!: " . $e->getMessage());
            return $count;
        }

        return $count;
    }

}