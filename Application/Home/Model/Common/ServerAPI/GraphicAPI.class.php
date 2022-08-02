<?php
/**
 * Created by RenJiaFen.
 * Desc: 图文相关API
 * Date: 2019/9/26
 * Time: 17:23
 */

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;

class GraphicAPI
{

    /**
     * 获取图文栏目列表
     *
     * @return mixed
     */
    public static function getColumnList(){
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_GRAPHIC_COLUMN_LIST);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 获取图文列表
     *
     * @param $currentPage
     * @param $pageNum
     * @param $classId
     *
     * @return mixed
     */
    public static function getGraphicList($currentPage,$pageNum,$classId){
        $json = array(
            "current_page"=>$currentPage,
            "page_num"=>$pageNum,
            "class_id"=>$classId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GRAPHIC_LIST);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }
}