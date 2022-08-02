<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [健康知识] 模块API数据中间层处理。
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/11/26 14:54
// +----------------------------------------------------------------------


namespace Home\Model\Common;


use Home\Model\Common\ServerAPI\HealthKnowledgeApi;

class HealthKnowledgeManager
{
    /**
     * 拉取 [健康知识] 的全部分类信息
     * @return array 返回分类列表数组
     */
    public static function getClassifyInfo()
    {
        $classInfoObj = HealthKnowledgeApi::getClassifyInfo();
        if (is_object($classInfoObj) && is_array($classInfoObj->list)) {
            $result = $classInfoObj->list;
        } else {
            $result = array();
        }

        return $result;
    }

    /**
     * 拉取 [健康知识] 分类下的健康知识
     * @param $classId //分类id。-1：表示拉取所有 [健康知识]
     * @param $currentPage //当前页码，从1开始
     * @param $pageNum //拉取数据条数，大于0的整数
     * @return mixed
     */
    public static function getListByClassId($classId, $currentPage, $pageNum)
    {
        $result = HealthKnowledgeApi::getListByClassId($classId, $currentPage, $pageNum);
        return $result;
    }

    /**
     * 拉取 [健康知识] 详细信息
     * @param $knowledgeId //知识id
     * @return mixed
     */
    public static function getDetailInfo($knowledgeId)
    {
        $result = HealthKnowledgeApi::getDetailInfo($knowledgeId);
        if ($result->result != 0 || !is_array($result->list)) {
            $result->list = array();
        }
        return $result;
    }

    /**
     * 加载 [健康知识 - 首页] 栏目导航所有数据
     * @return array 返回分类列表数组
     */
    public static function loadHomeNavigationInfo()
    {
        // 加载 [健康知识] 栏目配置信息
        $navColumnsConfig = SystemManager::getColumnsConfigInfo(SYS_M_TYPE_HEALTH_KNOWLEDGE);

        // 最终 [健康知识] 首页导航分类数据
        $navClassDataArray = array();
        if (is_object($navColumnsConfig) && is_array($navColumnsConfig->list)) {
            // 数据加工处理
            foreach ($navColumnsConfig->list as $navItemObj) {
                // 把img_url字符串转换为对象结构
                $navItemObj->img_url = is_object($navItemObj->img_url) ? $navItemObj->img_url : json_decode($navItemObj->img_url);
            }

            $navClassDataArray = $navColumnsConfig->list;
        }

        return $navClassDataArray;
    }

}