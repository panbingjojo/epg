<?php


namespace Activity\Controller;

use Home\Controller\BaseController;
use Home\Model\Activity\ActivityConstant;
use Home\Model\Entry\MasterManager;

class ActivityProxyController extends BaseController {

    protected $isOrderBack = 0;                 // 是否为订购返回（1--是订购返回， 0--不是订购返回）
    protected $inner = 1;                       // inner = 1,表示应用内跳转，inner = 0,表示应用外进来
    protected $activityName = "";               // 活动标识名称（例如：ActivityMidAutumn20180815）
    protected $activityFsImg = "";               // 活动图片fs

    private $displayPagePath = '';

    public function config()
    {
        return array(
            "indexUI" =>  $this->displayPagePath . "/index"
        );
    }

    public function indexUI(){
        $this->_getRouteParams();
        $this->_assignParams();
        // 渲染页面
        $this->displayEx(__FUNCTION__);
    }

    /** 获取路由跳转参数 */
    private function _getRouteParams(){
        $this->isOrderBack = parent::requestFilter('isOrderBack', $this->isOrderBack);
        $this->inner = parent::requestFilter('inner', $this->inner,false);
        $this->activityName = parent::requestFilter('activityName', MasterManager::getSubId());

        $this->displayPagePath = ActivityConstant::getNewActivityFolder($this->activityName);
    }

    /** 分配参数到前端 */
    private function _assignParams(){
        $this->assign('isOrderBack', $this->isOrderBack);                // 是否订购返回
        $this->assign('carrierId', CARRIER_ID);                    // 当前地区
        $this->assign('platformType', MasterManager::getPlatformType()); // 平台类型 -- 区分高标清
        $this->assign('userAccount', MasterManager::getAccountId());     // 用户账号
        $this->assign("inner", $this->inner);                            // 是否应用内部跳转，区分局方大厅推荐位直接跳转活动
        $this->assign("activityName", $this->activityName);              // 活动别名
        $this->activityFsImg = RESOURCES_URL . '/activityImg/' . $this->activityName . '/';
        $this->assign("activityFsImg", $this->activityFsImg);            // 活动图片路径
        $this->assign("fromLaunch", MasterManager::getCookieFromLaunch());
        $this->assign("isVip", MasterManager::getUserIsVip());
        $this->assign("userId", MasterManager::getUserId());
    }
}