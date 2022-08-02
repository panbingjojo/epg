<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV  存储api                                                            |
  +----------------------------------------------------------------------+ 
  | 此接口主要用于规范保存到cws的数据库中的值唯一性。
  | 使用时，请注意key值的设置
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2018/3/13 14:43                                                |
  +----------------------------------------------------------------------+ 
 */


namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;

class StoreAPI
{
    public static $key_first = "key_first_2019_03_10"; // 存储第一次使用apk相关信息
    public static $DATA_NOVICE_GUIDE = "novice_guide"; // 新手引导是否显示记录

    //key映射表,主要用于校验是否存在。此值必须唯一。
    private static $sMap = array(
        "key_first_2019_03_10" => "key_first_2019_03_10"
    );

    /**
     * 存储客户端数据
     * @param $key
     * @param $data
     * @param int $expireTime
     * @return mixed
     */
    public static function insertData($key, $data, $expireTime = -1)
    {
        self::verifyKey($key);
        $jsonArr = array(
            "key" => $key,
            "val" => $data,
            "save_days" => $expireTime
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_SAVE_STORE_DATA);
        $res = $httpManager->requestPost($jsonArr);
        return $res;
    }

    /**
     * 存储客户端数据
     * @param $key
     * @param $data
     * @param int $expireTime
     * @return mixed
     */
    public static function saveStoreData($key, $data, $expireTime = -1)
    {
        $jsonArr = array(
            "key" => $key,
            "val" => $data,
            "save_days" => $expireTime
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_SAVE_STORE_DATA);
        $res = $httpManager->requestPost($jsonArr);
        return $res;
    }

    /**
     * 根据key值保存客户端的数据
     * @param $key
     * @return mixed
     */
    public static function queryStoreData($key)
    {
        $jsonArr = array(
            "key" => $key,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_QUERY_STORE_DATA);
        $res = $httpManager->requestPost($jsonArr);
        return $res;
    }

    /**
     * 根据key值后去专辑模板数据
     * @param $key
     * @return mixed
     */
    public static function queryTemplate($key)
    {
        $jsonArr = array(
            "template_id" => $key,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_TEMPLATE_ALBUM);
        $res = $httpManager->requestPost($jsonArr);
        return $res;
    }

    /**
     * 根据key值保存客户端的数据
     * @param $key
     * @return mixed
     */
    public static function queryData($key)
    {
        self::verifyKey($key);
        $jsonArr = array(
            "key" => $key,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_QUERY_STORE_DATA);
        $res = $httpManager->requestPost($jsonArr);
        return $res;
    }

    /**
     * 校验key是否存在
     * @param $key
     */
    private static function verifyKey($key)
    {
        if (!array_key_exists($key, self::$sMap)) {
            throw new Exception("StoreAPI::illegal key");
        }
    }

}