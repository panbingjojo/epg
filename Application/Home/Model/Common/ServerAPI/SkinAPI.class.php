<?php

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Common\RedisManager;

/**
 * 皮肤管理
 * Class SkinAPI
 * @package Home\Model\Common\ServerAPI
 */
class SkinAPI
{
    /**
     * 获取自定义皮肤列表
     * @return mixed
     */
    public static function getSkinList()
    {
        $key = RedisManager::buildKey(RedisManager::$REDIS_CUSTOMIZE_SKIN);
        $result = RedisManager::getPageConfig($key);
        if (!$result) {
            $json = array();
            $httpManager = new HttpManager(HttpManager::PACK_ID_GET_SKIN_LIST);
            $result = $httpManager->requestPost($json);
            RedisManager::setPageConfig($key,$result);
        }

        return json_decode($result);
    }

    /**
     * 兑换自定义皮肤
     * @param $skin_id
     * @return mixed
     */
    public static function exchangeSkin($skin_id)
    {
        $json = array(
            skin_id=>$skin_id
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_EXCHANGE_SKIN);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 使用自定义皮肤
     * @param $skin_id 传-1表示停用已使用的皮肤，代表用户目前没有使用自定义皮肤，使用的是默认皮肤
     * @return mixed
     */
    public static function useSkin($skin_id)
    {
        $json = array(
            skin_id=>$skin_id
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_USE_SKIN);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

}