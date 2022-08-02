<?php
/*
  +----------------------------------------------------------------------+
  | IPTV                                                                 |
  +----------------------------------------------------------------------+
  | 首次操作应用相关状态保存
  +----------------------------------------------------------------------+
  | Author: yzq                                                          |
  | Date: 2017/11/30 17:56                                                |
  +----------------------------------------------------------------------+
 */

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\StoreAPI;

class FirstManager
{
    public static $F_HOME = "f_home"; //首页
    public static $F_APPOINTMENT = "f_appointment"; //预约挂号
    public static $F_HEALTH_VIDEO = "f_health_video"; //健康视频
    public static $F_P2P = "f_p2p";           //在线问诊
    public static $F_FAMILY = "f_family";    //我的家
    public static $F_REG = "f_reg";    //注册
    public static $page_healthSelfTest_v1 = "page_healthSelfTest_v1"; //健康自测

    //第一次使用保存的值，默认都是第一次使用
    private static $mInitStoreMap = array(
        "f_home" => true,
        "f_appointment" => true,
        "f_health_video" => true,
        "f_p2p" => true,
        "f_family" => true,
        "f_reg" => true,
        "page_healthSelfTest_v1" => true,
    );

    //key映射表,主要用于校验是否存在。此值必须唯一。
    private static $mKeyMap = array(
        "f_home" => "f_home",
        "f_appointment" => "f_appointment",
        "f_health_video" => "f_health_video",
        "f_p2p" => "f_p2p",
        "f_family" => "f_family",
        "f_reg" => "f_reg",
        "page_healthSelfTest_v1" => "page_healthSelfTest_v1",
    );


    /**
     * 设置第一次访问进入session中
     * @param $firstHandleKey
     * @param bool $isFirst 默认值:不是第一次
     */
    public static function setFHandle($firstHandleKey, $isFirst = false)
    {
        self::verifyKey($firstHandleKey);
        $storeData = StoreAPI::queryData(StoreAPI::$key_first);
        $storeDataArr = json_decode($storeData, true);
        if ($storeDataArr["result"] == "0") {
            $tempVal = $storeDataArr["val"];
            $tempValArr = json_decode($tempVal, true);
            $tempValArr[$firstHandleKey] = $isFirst;
            $ret = StoreAPI::insertData(StoreAPI::$key_first, json_encode($tempValArr));
            LogUtils::info("FirstManager::StoreAPI::insertData::" . $ret);
        } else {
            self::$mInitStoreMap[$firstHandleKey] = $isFirst;
            $ret = StoreAPI::insertData(StoreAPI::$key_first, json_encode(self::$mInitStoreMap));
            LogUtils::info("FirstManager::StoreAPI::insertData::" . $ret);
        }
    }

    /**
     * 获取是否为第一次访问:规则
     * //如果不是第一次注册的用户，就不使用新手指导；如果是第一次注册用户，并且没有使用过新手指导，就使用新手指导
     * @param $firstHandleKey
     * @return bool
     */
    public static function getFHandle($firstHandleKey)
    {
        self::verifyKey($firstHandleKey);
        $storeData = StoreAPI::queryData(StoreAPI::$key_first);
        $storeDataArr = json_decode($storeData, true);
        if ($storeDataArr["result"] == "0") {
            $tempVal = $storeDataArr["val"];
            $tempValArr = json_decode($tempVal, true);
            $retStatus = $tempValArr[$firstHandleKey];
            return $retStatus;
        } else {
            return true;
        }
    }

    /**
     * 校验key是否存在
     * @param $key
     */
    private static function verifyKey($key)
    {
        if (!array_key_exists($key, self::$mKeyMap)) {
            throw new Exception("StoreAPI::illegal key");
        }
    }


}