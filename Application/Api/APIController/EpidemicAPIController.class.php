<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/5/16
 * Time: 11:18
 */

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\EpidemicAPI;
use Home\Model\Epidemic\EpidemicManager;

class EpidemicAPIController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        // TODO: Implement config() method.
    }

    /**
     * @Brief:此函数用于查询与疫情同程
     */
    public function getEpidemicSameTripAction () {

        $date = $_REQUEST['date'];
        $type = $_REQUEST['type'];
        $no = $_REQUEST['no'];
        $area = $_REQUEST['area'];
        $page = $_REQUEST['page'];
        $pageSize = $_REQUEST['pageSize'];

        $result = EpidemicAPI::getEpidemicSameTrip($date, $type, $no, $area, $page, $pageSize);
        $this->ajaxReturn(json_encode($result), "EVAL");
    }
    /**
     * @Brief:此函数用于查询与疫情需要回家隔离地区
     */
    public function getIsolatedAreaAction () {

        $fromCity = $_REQUEST['fromCity'];
        $toCity = $_REQUEST['toCity'];

        $result = EpidemicAPI::getIsolatedArea($fromCity, $toCity);
        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    /**
     * @Brief:此函数用于查询哪些市、区受疫情影响
     */
    public function getEpidemicDistrictAreaAction () {
        $province = $_REQUEST['province'];
        $city = $_REQUEST['city'];
        $district = $_REQUEST['district'];

        $result = EpidemicAPI::getEpidemicDistrictArea($province, $city, $district);
        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    /**
     * 青海电信改版家庭医生，导航栏涉及疫情专区模块，需要将数据拆成接口使用
     * 获取疫情统计数据
     */
    public function getEpidemicStatisticsAction() {
        $epidemicStats = EpidemicAPI::getEpidemicStatistics();
        $this->ajaxReturn($epidemicStats, "EVAL");
    }

    /**
     * 青海电信改版家庭医生，导航栏涉及疫情专区模块，需要将数据拆成接口使用
     * 获取疫情统计数据详情 -- 国内，国外相关数据
     */
    public function getEpidemicDetailAction() {
        $epidemicDetail = EpidemicAPI::getEpidemicDetails();
        $this->ajaxReturn($epidemicDetail, "EVAL");
    }

    /**
     * 青海电信改版家庭医生，导航栏涉及疫情专区模块，需要将数据拆成接口使用
     * 获取疫情资讯
     */
    public function getEpidemicNewsAction() {
        $epidemicNews = EpidemicAPI::getEpidemicRealSowing($page = 1, $pageSize = 1);;
        $this->ajaxReturn($epidemicNews, "EVAL");

    }

    public function getDetailDataAction(){
        $province = $_REQUEST['province'];
        $arr = array(
            "province" => $province,
        );
        $result = EpidemicManager::queryHLWYY(EpidemicManager::FUNC_GET_DETAIL_DATA, json_encode($arr));
        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    public function getDetailDataByTimeAction(){
        $province = $_REQUEST['province'];
        $date= $_REQUEST['date'];

        $arr = array(
            "province" => $province,
            "date"=> $date
        );
        $result = EpidemicManager::queryHLWYY(EpidemicManager::FUNC_GET_DETAIL_DATA_TIME, json_encode($arr));
        $this->ajaxReturn(json_encode($result), "EVAL");
    }

}