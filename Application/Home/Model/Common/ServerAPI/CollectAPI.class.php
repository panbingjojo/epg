<?php

/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  |  收藏功能相关
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2017/12/1 9:37                                                |
  +----------------------------------------------------------------------+ 
 */
namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\HttpManager;
use Think\Exception;

class CollectAPI
{

    public static $CANCEL_COLLECT = 1; //取消收藏
    public static $CONFIRM_COLLECT = 0;//收藏

    /**
     * 获取收藏列表
     */
    public static function getCollectList()
    {

        $json = array();

        $httpManager = new HttpManager(HttpManager::PACK_ID_COLLECT_LIST);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

    /**
     * 收藏与取消收藏视频
     * @param $sourceID
     * @param $type
     * @return mixed
     * @throws Exception
     */
    public static function setCollectStatus($sourceID, $type ,$itemType =null)
    {
        // $itemType 不为空则收藏 健康自测题，否则收藏视频
        if($itemType != null){
            $json = array(
                'item_id' => $sourceID,
                'type' => $type, //0-收藏 1-取消收藏
                'item_type' => $itemType,
            );
        }else{
            $json = array(
                "source_id" => $sourceID,
                "type" => $type
            );
        }

        $httpManager = new HttpManager(HttpManager::PACK_ID_COLLECT_STORE);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取收藏列表
     * @param $item_type 收藏对象类型（1视频 2视频专辑 3医生 4专家）
     * @return mixed
     */
    public static function getCollectListNew($item_type,$parent_model_type = null)
    {

        $json = array(
            "item_type"=>$item_type,
            "parent_model_type"=>$parent_model_type
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_COLLECT_LIST);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

    /**
     * 视频/专辑的收藏和取消收藏
     * @param $type 类型（0收藏 1取消收藏）
     * @param $item_type 收藏对象类型（1视频 2视频专辑 3医生 4专家）
     * @param $item_id 收藏对象id
     * @return mixed
     */
    public static function setCollectStatusNew($type, $item_type, $item_id)
    {
        $json = array(
            "type" => $type,
            "item_type" => $item_type,
            "item_id" => $item_id,
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_COLLECT_STORE);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

}