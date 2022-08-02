<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |健康自测相关相关页面控制器
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2018/11/29 15:09                                               |
 * +----------------------------------------------------------------------+
 */

namespace Home\Controller;

use Home\Model\Common\ServerAPI\HealthSelfTestApi;
use Home\Model\Common\SystemManager;
use Home\Model\Display\DisplayManager;
use Home\Model\User\FirstManager;
use Home\Model\User\UserManager;

class HealthSelfTestController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    /**
     * 说明：通过其他页面跳转到指定分类时：需要get或post请求参数:columnId
     */
    public function testListV1UI()
    {
        // 统计访问记录
//        StatManager::uploadAccessModule();

        // 初始化通用渲染
        $this->initCommonRender();

        $columnId = isset($_REQUEST["columnId"]) ? $_REQUEST["columnId"] : "";
        $topicId = isset($_REQUEST["topicId"]) ? $_REQUEST["topicId"] : "";
        $focusIndex = isset($_REQUEST['focusIndex']) ? $_REQUEST['focusIndex'] : ''; //默认焦点按钮id
        $currentClassId = isset($_REQUEST['currentClassId']) && !empty($_REQUEST['currentClassId']) ? $_REQUEST['currentClassId'] : -1; // -1：默认全部分类

        $leftNavData = $this->filterData($columnId, $currentClassId);

        $this->assign("columnId", $columnId);
        $this->assign("topicId", $topicId);
        $this->assign("conf", $leftNavData);
        $this->assign('focusIndex', $focusIndex);
        $this->assign('currentClassId', $currentClassId);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 说明：通过其他页面跳转到测试题目时：需要get或post请求参数:topicId
     */
    public function answerV1UI()
    {
        // 统计访问记录
//        StatManager::uploadAccessModule();

        // 初始化通用渲染
        $this->initCommonRender();

        $topicId = $_REQUEST["topicId"] ? $_REQUEST["topicId"] : "";
        $collectStatus = UserManager::getCollectStatus($topicId, 8);
        $firstHandle = FirstManager::getFHandle(FirstManager::$page_healthSelfTest_v1);
        $this->assign("firstHandle", $firstHandle);

        $this->assign("topicId", $topicId);
        $this->assign('collectStatus', $collectStatus); // 收藏状态（1-收藏 0-未收藏）

        $this->displayEx(__FUNCTION__);
    }

    public function testResultsV1UI()
    {
        // 统计访问记录
//        StatManager::uploadAccessModule();

        // 初始化通用渲染
        $this->initCommonRender();

        $topicId = $_REQUEST["topicId"] ? $_REQUEST["topicId"] : "";
        $score = $_REQUEST["score"] ? $_REQUEST["score"] : "0"; // 默认为0分，传空的话P16004拉取不到数据
        $focusPropertyId = $_REQUEST["focusPropertyId"] ? $_REQUEST["focusPropertyId"] : "";

        $collectStatus = UserManager::getCollectStatus($topicId, 4);
        $testResult = HealthSelfTestApi::getHealthResult($topicId, $score);

        $diseaseList = $testResult->data->disease_list;
        $diseaseType = $diseaseList[0]->disease_type;
        $diseaseId = $diseaseList[0]->disease_id;
        $navDataList = SystemManager::getColumnDetailNavigationInfo($diseaseType);

        $this->assign("topicId", json_encode($topicId));
        $this->assign("score", json_encode($score));
        $this->assign("navDataList", json_encode($navDataList));
        $this->assign("diseaseType", $diseaseType);
        $this->assign("diseaseId", $diseaseId);
        $this->assign("focusPropertyId", $focusPropertyId);
        $this->assign("testResult", json_encode($testResult));
        $this->assign('collectStatus', $collectStatus); // 收藏状态（1-收藏 0-未收藏）
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 功能说明：过滤返回数据，拆分为导航栏列表跟其他的配置列表，便于页面做相关处理
     * @param $columnId //记录对应的$currentClassId对应的columnId值，因为页面是通过这个值去定位左面的导航分类的。
     * @param $currentClassId //当前指定跳转的左侧导航分类id
     * @return string
     */
    private function filterData(&$columnId, $currentClassId)
    {
        $navColumnsConfig = SystemManager::getColumnsConfigInfo(SYS_M_TYPE_HEALTH_TEST);
        $retArr = array();
        if ($navColumnsConfig->result == 0) {
            $tempArr = array();
            $titleArr = array();
            $firstMatchColumnId = false;
            foreach ($navColumnsConfig->list as $key => $val) {
                if ($val->link_class_id == -2) {
                    array_push($titleArr, $val);
                } else {
                    array_push($tempArr, $val);
                    if ($firstMatchColumnId == false && $val->link_class_id == $currentClassId) {
                        $columnId = $val->column_id;
                        $firstMatchColumnId = true;//标识已经找到了第一个匹配的导航栏id
                    }
                }
            }
            $retArr["ConfLeftNav"] = $tempArr;
            $retArr["ConfOther"] = $titleArr;
        }
        $retArr["result"] = $navColumnsConfig->result;
        return json_encode($retArr);
    }

}