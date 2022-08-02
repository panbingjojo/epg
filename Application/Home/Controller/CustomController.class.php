<?php
// 本类由系统自动生成，仅供测试用途
namespace Home\Controller;

use Home\Model\Activity\ActivityManager;
use Home\Model\Common\ServerAPI\DateMarkAPI;
use Home\Model\Common\SystemManager;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;

class CustomController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__,array());
    }

    /**
     * 自定义背景首页 视图1
     */
    public function customV1UI()
    {
        // 加载用户自定义皮肤
        SystemManager::loadUserSkin();

        $this->initCommonRender();  // 初始化公共渲染

        // 查询用户的自动更新背景状态
        $state = 0; // 0-未开启 1-开启
        $storeData = ActivityManager::queryStoreData('EPG-LWS-AUTO-UPDATE-BG-' . MasterManager::getCarrierId() . '-' . MasterManager::getUserId());
        $storeData = json_decode($storeData);
        if ($storeData->result == 0) {
            $state = $storeData->val;
        }
        $this->assign("state", $state);

        // 查询用户积分
        $scoreResult = DateMarkAPI::queryMark(date("Y-m-d",time()), date("Y-m-d",time()));
        $totalScore = 0;
        if ($scoreResult->result == 0) {
            $totalScore = $scoreResult->total_score;
        }
        $this->assign("totalScore", $totalScore);

        // 焦点保持
        $page = parent::requestFilter('page', 1);
        $keepFocusId = parent::requestFilter('keepFocusId', 'tab-bg-0');
        $this->assign('page', $page);
        $this->assign('keepFocusId', $keepFocusId);

        $this->displayEx(__FUNCTION__);
    }
}