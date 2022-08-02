<?php
/**
 * Created by RJF.
 * User: Administrator
 * Date: 2019/7/10
 * Time: 14:20
 */

namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\StoreAPI;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Common\SystemManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class CommonAPIController extends BaseController
{
    /**
     * 获取海看坑位统计数据
     */
    public function get371092HoleStatAction()
    {
        $routerStack = MasterManager::getRouterStack();



        $result = array(
            "result" => $routerStack,
            "desc" => "获取海看坑位统计数据"
        );

        $this->ajaxReturn(json_encode($result), "EVAL");
    }
    /**
     * 增加停留应用过程中显示订购次数
     */
    public function addShowOrderTimesAction()
    {
        $showOrderTimes = MasterManager::getShowOrderTimes();
        $showOrderTimes += 1;
        MasterManager::setShowOrderTimes($showOrderTimes);

        $result = array(
            "result" => 0,
            "desc" => "显示订购页面增加保存成功"
        );

        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    /**
     * 获取订购配置信息
     */
    public function getOrderConfAction()
    {
        // 获取订购配置信息
        $orderConf = SystemAPI::queryShowPayMethod();

        // 获取是否上报用户信息
        $isReportUserInfo = MasterManager::isReportUserInfo();
        // 获取订购页面显示次数
        $showOrderTimes = MasterManager::getShowOrderTimes();
        // 获取首页进入的时间戳
        $enterAppTime = MasterManager::getEnterAppTime();
        $result = array(
            "orderConf" => $orderConf,
            "isReportUserInfo" => $isReportUserInfo,
            "showOrderTimes" => $showOrderTimes,
            "enterAppTime" => $enterAppTime,
            "showTimeStamp" => time()
        );
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     *  通用数据存储API，以键值对的方式将Key和Value的值后台存放
     */
    public function saveDataAction()
    {
        // 从请求体中解析键值对像中的键和值
        $key = isset($_REQUEST['key']) ? $_REQUEST['key'] : 1;
        $vale = isset($_REQUEST['value']) ? $_REQUEST['value'] : -1;

        // 调用CWS接口保存数据
        $result = StoreAPI::saveStoreData($key, $vale);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     *  通用数据获取API，通过键值获取value值
     */
    public function queryDataAction()
    {
        // 从请求体中解析键值对像中的键和值
        $key = isset($_REQUEST['key']) ? $_REQUEST['key'] : 1;

        // 调用CWS接口保存数据
        $result = StoreAPI::queryStoreData($key);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     *  通用数据获取获取专辑模板，通过模板id获取模板信息
     */
    public function queryAlbumTemplateAction()
    {
        // 从请求体中解析键值对像中的键和值
        $key = isset($_REQUEST['template_id']) ? $_REQUEST['template_id'] : 1;

        // 调用CWS接口保存数据
        $result = StoreAPI::queryTemplate($key);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 推荐位点击事件埋点
     */
    public function statRecommendAction()
    {
        // 1、获取前端传入参数
        $recommendId = isset($_REQUEST['recommendId']) ? $_REQUEST['recommendId'] : '';
        $recommendOrder = isset($_REQUEST['recommendOrder']) ? $_REQUEST['recommendOrder'] : '';
        $remark = "pos";

        // 2、调用方法统计
        $result = StatManager::uploadAccessModule(MasterManager::getUserId(), $recommendOrder, $remark, $recommendId);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     *  增加促订显示次数
     */
    public function addInspireOrderTimesAction()
    {
        MasterManager::addInspireOrderTimes();

        $result = array(
            "result" => 0
        );

        $this->ajaxReturn($result);
    }

    /**
     *  获取促订显示次数
     */
    public function getInspireOrderTimesAction()
    {
        $inspireTimes = MasterManager::getInspireOrderTimes();

        $result = array(
            "inspireTimes" => $inspireTimes,
        );

        $this->ajaxReturn($result);
    }

    /** 首页异步获取跑马灯内容 */
    public function getMarqueeContentAction(){
        $content = SystemManager::getMarqueeText();
        $result = array(
            'result'=>0,
            'content' => $content,
        );
        $this->ajaxReturn(json_encode($result),'EVAL');
    }

    /**
     * 新疆电信清除社区医院进入标识
     */
    public function clearLocalInquiryAction() {
        MasterManager::setLocalInquiry(0);

        $result = array(
            "result" => 0
        );

        $this->ajaxReturn($result);
    }

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        // TODO: Implement config() method.
        return array();
    }
}