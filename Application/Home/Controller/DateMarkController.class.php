<?php
// 本类由系统自动生成，仅供测试用途
namespace Home\Controller;

use Home\Model\Activity\ActivityManager;
use Home\Model\Common\ServerAPI\DateMarkAPI;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class DateMarkController extends BaseController
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
     * 当前活动控制器构造函数，初始化一些必要参数
     */
    public function __construct()
    {
        parent::__construct();
        $this->initParams();
    }

    /**
     * 构造函数中初始化默认参数
     */
    protected function initParams()
    {
        $this->initCommonRender();  // 初始化公共渲染

        $start_dt = date('Y-m-d', strtotime('-8 days'));
        $end_dt = date("Y-m-d");
        $infoMark = DateMarkAPI::queryMark($start_dt, $end_dt);
        foreach ($infoMark as $k => $v) {
            $markInfo[$k] = $v;
        }
        $this->assign("markInfo", json_encode($markInfo));
    }

    /**
     * 签到首页 视图1
     */
    public function indexV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 签到抽奖页 视图1
     */
    public function lotteryV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());
        // 通过活动标识ActivityDateMarkAlone拉取活动id
        $activityId = ActivityManager::getOnceActivityId('ActivityDateMarkAlone');
        $allUserPrizeList = ActivityManager::getAllUserPrizeList();
        $message = json_decode(DateMarkAPI::activityInfo($activityId));
        $prizeList = DateMarkAPI::queryPrize($activityId);
        foreach ($message as $k => $v) {
            $activityInfo[$k] = $v;
        }
        $this->assign("allUserPrizeList", json_encode($allUserPrizeList));
        $this->assign("activityInfo", json_encode($activityInfo));
        $this->assign("prizeList", json_encode($prizeList));
        $this->assign("activityId", $activityId);
        $this->displayEx(__FUNCTION__);
    }

}