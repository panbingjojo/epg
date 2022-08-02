<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [健康知识] 模块API
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/11/26 14:54
// +----------------------------------------------------------------------


namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;

class HealthKnowledgeApi
{

    /**
     * 拉取 [健康知识] 的全部分类信息
     */
    public static function getClassifyInfo()
    {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_HEALTH_KNOWLEDGE_CLASSIFY_INFO);
        $result = $httpManager->requestPost($json);
        return json_decode($result);
    }

    /**
     * 拉取分类下的 [健康知识] 列表
     * @param $classId //分类id。-1：表示拉取所有 [健康知识]
     * @param $currentPage //当前页码，从1开始
     * @param $pageNum //拉取数据条数，大于0的整数
     * @return mixed
     */
    public static function getListByClassId($classId, $currentPage, $pageNum)
    {
        $json = array(
            'class_id' => $classId,
            'current_page' => $currentPage,
            'page_num' => $pageNum,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HEALTH_KNOWLEDGE_LIST_BY_CLASSIFY_ID);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * 拉取 [健康知识] 详细信息
     * @param $knowledgeId //知识id
     * @return mixed
     */
    public static function getDetailInfo($knowledgeId)
    {
        $json = array(
            'knowledge_id' => $knowledgeId
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HEALTH_KNOWLEDGE_DETAIL_INFO);
        $result = $httpManager->requestPost($json);
        return json_decode($result);
    }

}