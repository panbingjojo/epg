<?php
/**
 * Created by PhpStorm.
 * User: 59253
 * Date: 2017/11/30
 * Time: 17:05
 * @breif:这个控制器将用于活动相关
 */

namespace Activity\Controller;

use Home\Controller\BaseController;
use Home\Model\Activity\ActivityConstant;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Activity\ActivityManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Page\PageManager;
use Home\Model\Stats\StatManager;


class ActivityController extends BaseController {
    private $userId;                //用户id
    private $inner = 1;             //是否从首页跳转过来，决定专辑按返回时回退到epg页面还是首页
    private $activityName = "";     // 活动标识名称
    private $activityId = "";       // 活动标识ID

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config() {
        return array();
    }

    /**
     * 活动入口UI
     * @throws \Think\Exception
     */
    public function indexUI() {
        LogUtils::info("=================> welcome to activity! param: " . json_encode($_GET));

        // 初始化通用渲染
        $this->initCommonRender();
        $this->parseUrlParam();

        // 初始化并渲染活动入口参数
        $this->initActivityCommon();
    }

    /**
     * 解析session、get参数
     * @throws \Think\Exception
     */
    private function parseUrlParam() {
        // 用户id
        $this->userId = parent::getFilter("userId", MasterManager::getUserId());

        // 跳转类型
        $this->inner = parent::getFilter("inner", $this->inner, false);
        // 活动标识
        $this->activityName = parent::getFilter("activityName", MasterManager::getSubId());

        MasterManager::setSubId($this->activityName);
    }

    /**
     * 根据活动名称获取对应的活动信息包
     * @param $activityName
     */
    private function getActivityObjByName($activityName) {
        // 配置跳转 - 优先判断特殊活动独立控制器，然后再判断通用活动控制器
        switch ($activityName) {
            // 抓娃娃
            case ActivityConstant::SUB_ID_ACTIVITY_ZHUAWAWA20171223:
                return IntentManager::createIntent("activity-zhuawawa-home");
            // 中国联通-0元义诊
            case ActivityConstant::SUB_ID_ACTIVITY_CONSULTATION20190320:
                return IntentManager::createIntent("activity-consultation-guide");
            // 广西名医服务基础活动调整（2018-10-17）
            case ActivityConstant::SUB_ID_ACTIVITY_FAMOUS_DOCTOR20181020:
                return IntentManager::createIntent("activity-famous-index");
            // 规则活动 - 默认使用通用活动控制器
            default:
                // 查询配置 Application/Activity/Conf/config.php 中是否已经配置相关活动
                $activityFolder = ActivityConstant::getActivityFolder($this->activityName);
                $pageName = !empty($activityFolder) ? "activity-common-guide" : "activity-common-index";
                return IntentManager::createIntent($pageName);
        }
    }

    /**
     * 设置活动页面参数
     * @param $activityObj
     * @param $countDown
     * @param $description
     * @return mixed
     */
    private function setActivitObjParams($activityObj, $countDown, $description) {
        $activityObj->setParam("userId", $this->userId);
        $activityObj->setParam("inner", $this->inner);
        $activityObj->setParam("activityId", $this->activityId);
        $activityObj->setParam("countDown", $countDown);
        $activityObj->setParam("description", $description);
        $activityObj->setParam("userGroupType", parent::getFilter("userGroupType"));
        return $activityObj;
    }

    /**
     * 跳转到活动页面
     * @param $countDown
     * @param $description
     */
    private function jump2ActivityPage($countDown, $description) {
        $activityObj = $this->getActivityObjByName($this->activityName);
        if (!empty($activityObj)) {
            $activityObj = $this->setActivitObjParams($activityObj, $countDown, $description);
            IntentManager::jump($activityObj);
        } else {
            $goUrl = PageManager::getBasePagePath('home') . "/" . '?userId=' . $this->userId;
            $this->error("您访问的页面正在维护中，我们有更精彩的内容在等着您，稍后将为您跳转过去！", $goUrl, 3);
            header('Location:' . $goUrl);
        }
    }

    /**
     * 初始化活动入口参数
     */
    private function initActivityCommon() {
        $countDown = -1;
        $description = "";
        $this->_checkActivityInfo();
        $this->jump2ActivityPage($countDown, $description);
    }

    /**
     * 检查活动信息
     */
    private function _checkActivityInfo() {
        // 向cws服务器获取活动id，并保存在SessionManager::$S_ACTIVITY_ID
        $this->activityId = $activityId = ActivityManager::getActivityId($this->activityName);
        $goUrl = PageManager::getBasePagePath('home') . "/" . '?userId=' . $this->userId;
        if ($activityId == -1) {
            $this->error("活动" . $this->activityName . "拉取活动ID失败，稍后将为您跳转过去！", $goUrl, 3);
            exit();
        }

        $isTest = MasterManager::getIsTestUser();
        if ($isTest == 1) {
            LogUtils::info("user[$this->userId] 是测试账号");
        } else {
            $activityInfoData = self::getActivityInfo();
            if (isset($activityInfoData->list->start_dt) && isset($activityInfoData->list->end_dt)) {
                $startDt = $activityInfoData->list->start_dt;
                $endDt = $activityInfoData->list->end_dt;
                $status = $activityInfoData->list->status;
                $countDown = $activityInfoData->list->count_down;
                $description = $activityInfoData->list->description;
                $nowTime = intval(time());
                if ($nowTime < strtotime($startDt)) {
                    $this->error("活动" . $activityId . "未开始！", $goUrl, 10);
                    exit();
                }
            }
        }

        // 上报用户访问活动的日志（不管是联合活动还是普通活动）
        StatManager::uploadAccessModule($this->userId, $this->activityName);

        LogUtils::info("user[$this->userId] will go activity[$this->activityName] id :" . $activityId);
    }

    /**
     * 获取活动信息
     * @return mixed
     */
    private static function getActivityInfo() {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_REQUEST);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result);
        return $data;
    }
}