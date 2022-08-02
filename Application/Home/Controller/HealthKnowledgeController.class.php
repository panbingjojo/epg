<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [健康知识]-控制器
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/11/30 14:30
// +----------------------------------------------------------------------

namespace Home\Controller;

use Home\Model\Common\HealthKnowledgeManager;

class HealthKnowledgeController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array(
            "knowledgeListV1UI" => "HealthKnowledge/V1/KnowledgeCategory",
            "knowledgeDetailsV1UI" => "HealthKnowledge/V1/KnowledgeDetails",
        );
    }

    public function knowledgeListV1UI()
    {
        // 统计访问记录
//        StatManager::uploadAccessModule();

        // 初始化通用渲染
        $this->initCommonRender();

        // 解析传递参数
        $currentClassId = isset($_REQUEST['currentClassId']) && !empty($_REQUEST['currentClassId']) ? $_REQUEST['currentClassId'] : -1; // -1：默认全部分类
        $currentPage = isset($_REQUEST['currentPage']) && !empty($_REQUEST['currentPage']) ? $_REQUEST['currentPage'] : 1; //当前页码（number类型）
        $focusIndex = isset($_REQUEST['focusIndex']) ? $_REQUEST['focusIndex'] : ''; //默认焦点按钮id

        // 拉取 [健康知识列表]-首页-导航分类信息
        $navClassInfoArray = HealthKnowledgeManager::loadHomeNavigationInfo();

        $this->assign('navClassDataList', json_encode($navClassInfoArray)); // 导航栏分类信息（数组）
        $this->assign('currentClassId', $currentClassId); // 当前选中的 [健康知识-分类id]
        $this->assign('currentPage', $currentPage);
        $this->assign('focusIndex', $focusIndex);

        $this->displayEx(__FUNCTION__);
    }

    public function knowledgeDetailsV1UI()
    {
        // 统计访问记录
//        StatManager::uploadAccessModule();

        // 初始化通用渲染
        $this->initCommonRender();

        // 解析传递参数
        $knowledgeId = isset($_REQUEST['knowledgeId']) ? $_REQUEST['knowledgeId'] : -1; // -1：默认全部分类

        // 拉取 [健康知识列] 详情数据
        $knowledgeInfoObj = HealthKnowledgeManager::getDetailInfo($knowledgeId);
        $knowledgeInfoList = $knowledgeInfoObj->list;

        $this->assign('knowledgeId', $knowledgeId); // 健康知识id
        $this->assign('knowledgeInfo', json_encode($knowledgeInfoObj)); // [健康知识]详情数据（对象）
        $this->assign('knowledgeInfoList', json_encode($knowledgeInfoList)); // [健康知识]详情数据（数组）

        $this->displayEx(__FUNCTION__);
    }
}