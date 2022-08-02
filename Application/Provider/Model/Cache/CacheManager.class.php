<?php

namespace Provider\Model\Cache;

use Home\Model\Common\LogUtils;
use Redis;

class CacheManager
{
    //创建静态私有的变量保存该类对象
    static private $instance;

    // redis实例对象
    private $mRedis;

    //防止使用new直接创建对象
    private function __construct()
    {
        // 创建Redis实例
        $this->mRedis = new Redis();
    }

    //防止使用clone克隆对象
    private function __clone()
    {
    }

    static public function getInstance()
    {
        //判断$instance是否是Singleton的对象，不是则创建
        if (!self::$instance instanceof self) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * 保存参数
     * @param string $key 保存的键
     * @param string $value 保存的值
     * @param integer $expireTime 键的失效时间
     */
    public function save($key, $value, $expireTime)
    {
        try {
            // 连接数据库
            $isConnected = $this->mRedis->connect(REDIS_LOCAL_IP, REDIS_LOCAL_PORT);
            LogUtils::debug('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> isConnected: ' . $isConnected);
            // 校验数据库
            $isAuth = $this->mRedis->auth(REDIS_AUTH_PASSWORD);
            LogUtils::debug('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> isAuth: ' . $isAuth);
            // 保存数据
            $isSaved = $this->mRedis->setex($key, $expireTime, $value);
            LogUtils::debug('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> isSaved: ' . $key);
            // 关闭数据库连接
            $this->mRedis->close();
        }catch (\RedisException $exception){
            LogUtils::debug('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> exception: ' . $exception);
        }

    }

    /**
     * 查询键值
     * @param string $key 查询的键
     * @return bool|mixed|string 查询的值
     */
    public function query($key)
    {
        // 连接数据库
        $isConnected = $this->mRedis->connect(REDIS_LOCAL_IP, REDIS_LOCAL_PORT);
        LogUtils::debug('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> isConnected: ' . $isConnected);
        // 校验数据库
        $isAuth = $this->mRedis->auth(REDIS_AUTH_PASSWORD);
        LogUtils::debug('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> isAuth: ' . $isAuth);
        // 获取值
        $value = $this->mRedis->get($key);
        // 关闭连接
        $this->mRedis->close();
        // 返回结果
        return $value;
    }
}