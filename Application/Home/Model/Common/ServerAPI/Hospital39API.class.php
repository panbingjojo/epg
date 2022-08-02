<?php
/**
 * Created by PhpStorm.
 * User: czy
 * Date: 2019/2/15
 * Time: 18:16
 */

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;

class Hospital39API
{
    /**
     * 39互联网模块，获取首页视频地址
     */
    static function getHomeVideo()
    {
        $json = array(
        );

        $http = new HttpManager(HttpManager::PACK_ID_39_HOSPITAL_HOME_GET_VIDEO);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * 39互联网模块，获取顶级专家信息
     */
    static function getTopExpertInfo()
    {
        $json = array(
            'page_num'=> '100',
            'current_page'=> '1',
        );

        $http = new HttpManager(HttpManager::PACK_ID_39_HOSPITAL_HOME_GET_TOP_EXPERT_INFO);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * 39互联网模块，获取患者案例
     */
    static function getCase()
    {
        $json = array(
            'page_num'=> '100',
            'current_page'=> '1',
        );

        $http = new HttpManager(HttpManager::PACK_ID_39_HOSPITAL_HOME_GET_CASE);
        $result = $http->requestPost($json);

        return $result;
    }

}