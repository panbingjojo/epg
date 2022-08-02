<?php
/**
 * Created by PhpStorm.
 * Brief: 疫情数据接口
 */

namespace Provider\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\LogUtils;
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
        return array();
    }

    public function getallheaders()
    {
        foreach ($_SERVER as $name => $value)
        {
            if (substr($name, 0, 5) == 'HTTP_')
            {
                $headers[$name]=$value;
            }
        }
        LogUtils::info("task::".json_encode($headers));
        return $headers;
    }

    public function verifyAppID() {
        //$appId = $_REQUEST["appId"];
        //$carrierId = $_REQUEST["carrierId"];
        $Info = $this->getallheaders();
        LogUtils::info("task::".json_encode($Info));
        $appId = $Info["HTTP_APPID"];
        $carrierId = $Info["HTTP_CARRIERID"];
        // 浙江电信EPG，外部调用接口
        if ($appId == "zjdx" || $carrierId == "330092") {
            return true;
        }

        return false;
    }

    public function getEpidemicDetailsAction()
    {
        if ($this->verifyAppID()) {
            $arr = array(
            );
            $res = EpidemicManager::queryHLWYY(EpidemicManager::FUNC_GET_EPIDEMIC_DETAILS, json_encode($arr));
        } else {
            $res = json_encode(array("result" => -1, "msg" => "appid is error!"));
        }

        $this->ajaxReturn($res, "JSON");
    }

    public function getEpidemicStatisticsAction()
    {
        if ($this->verifyAppID()) {
            $arr = array(
            );
            $res = EpidemicManager::queryHLWYY(EpidemicManager::FUNC_GET_EPIDEMIC_STATISTICS, json_encode($arr));
        } else {
            $res = json_encode(array("result" => -1, "msg" => "appid is error!"));
        }

        $this->ajaxReturn($res, "JSON");
    }

    public function getEpidemicRealSowingAction($page = 1, $pageSize = 10)
    {
        if ($this->verifyAppID()) {
            $page = isset($_REQUEST["page"]) ? $_REQUEST["page"] : 1;
            $pageSize = isset($_REQUEST["pageSize"]) ? $_REQUEST["pageSize"] : 10;

            $arr = array(
                "page" => $page,
                "pageSize" => $pageSize
            );
            $res = EpidemicManager::queryHLWYY(EpidemicManager::FUNC_GET_EPIDEMIC_REAL_SOWING, json_encode($arr));
        } else {
            $res = json_encode(array("result" => -1, "msg" => "appid is error!"));
        }

        $this->ajaxReturn($res, "JSON");
    }

    public function getEpidemicSameTripAction() {
        if ($this->verifyAppID()) {
            $date = isset($_REQUEST["date"]) ? $_REQUEST["date"] : 1;
            $type = isset($_REQUEST["type"]) ? $_REQUEST["type"] : 10;
            $no = isset($_REQUEST["no"]) ? $_REQUEST["no"] : "";
            $area = isset($_REQUEST["area"]) ? $_REQUEST["area"] : "";
            $page = isset($_REQUEST["pageindex"]) ? $_REQUEST["pageindex"] : 1;
            $pageSize = isset($_REQUEST["pagesize"]) ? $_REQUEST["pagesize"] : 10;

            $arr = array(
                "date" => $date,
                "type" => $type,
                "no" => $no,
                "area" => $area,
                "pageindex" => $page,
                "pagesize" => $pageSize
            );

            $res = EpidemicManager::query39Net(EpidemicManager::FUNC_GET_EPIDEMIC_SAME_TRIP, json_encode($arr));
        } else {
            $res = json_encode(array("result" => -1, "msg" => "appid is error!"));
        }

        $this->ajaxReturn($res, "EVAL");
    }

    public function getEpidemicDistrictAreaAction() {
        if ($this->verifyAppID()) {
            $province = isset($_REQUEST["province"]) ? $_REQUEST["province"] : "";
            $city = isset($_REQUEST["city"]) ? $_REQUEST["city"] : "";
            $district = isset($_REQUEST["district"]) ? $_REQUEST["district"] : "";

            $arr = array(
                "province" => $province,
                "city" => $city,
                "district" => $district,
            );

            $res = EpidemicManager::query39Net(EpidemicManager::FUNC_GET_EPIDEMIC_DISTRICT_AREA, json_encode($arr));
        } else {
            $res = json_encode(array("result" => -1, "msg" => "appid is error!"));
        }

        $this->ajaxReturn($res, "EVAL");
    }


}