<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |健康自测相关接口
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2018/11/26 11:12                                               |
 * +----------------------------------------------------------------------+
 */

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;

class HealthSelfTestApi
{
    /**
     * 获取分类列表
     * @param $classId -1:拉取全部
     * @return mixed
     */
    public static function getClassifyList($classId)
    {
        $json = array(
            "class_id" => $classId
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HEALTH_TEST_CLASSIFY_INFO);
        $result = $httpManager->requestPost($json);
        return json_decode($result);
    }

    /**
     * 获取栏目列表
     * @param $classId
     * @param $pageCurrent
     * @param $pageTotal
     * @return mixed
     */
    public static function getTopicList($classId, $pageCurrent, $pageTotal)
    {
        $json = array(
            "class_id" => $classId,
            "current_page" => $pageCurrent,
            "page_num" => $pageTotal,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HEALTH_TEST_TOPIC_LIST_BY_CLASSIFY_ID);
        $result = $httpManager->requestPost($json);
        return json_decode($result);
    }

    /**
     * 获取题目列表
     * @param $topicId
     * @param $themeId
     * @return mixed
     */
    public static function getThemeList($topicId, $themeId)
    {
        $json = array(
            "topic_id" => $topicId,
            "theme_id" => $themeId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HEALTH_TEST_THEME_LIST_BY_TOPIC_ID);
        $result = $httpManager->requestPost($json);
        return json_decode($result);
    }

    /**
     * 获取检测结果
     * @param $topicId
     * @param $score
     * @return mixed
     */
    public static function getHealthResult($topicId, $score)
    {
        $json = array(
            "topic_id" => $topicId,
            "score" => $score,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HEALTH_TEST_RESULT_LIST);
        $result = $httpManager->requestPost($json);
        return json_decode($result);
    }
}