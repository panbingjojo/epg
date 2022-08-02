<?php

/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  |  全文检索相关
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2017/12/1 9:37                                                |
  +----------------------------------------------------------------------+ 
 */
namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\HttpManager;
use Home\Model\Entry\MasterManager;

class SearchAPI
{

    /**
     * 获取全文搜索数据
     * @param $words
     * @return mixed
     */
    public static function getSearchData($words)
    {

        $json = array(
            "user_account" => MasterManager::getAccountId(),
            "search_condition" => $words,
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_SEARCHVIDEO);
        $result = $httpManager->requestPost($json);

        return json_decode($result);

    }

    //获取热搜视频列表
    public static function getHotSearchVideo()
    {
        $json = array();

        $httpManager = new HttpManager(HttpManager::PACK_ID_HOTSEARCHVIDEO);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 获取热搜关键词
     * @return mixed
     */
    public static function getHotSearchText()
    {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOTSEARCHTEXT);
        $result = $httpManager->requestPost($json);
        return json_decode($result);
    }

}