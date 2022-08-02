<?php

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\DateMarkAPI;

class DateMarkAPIController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /**
     * 用户执行签到
     */
    function addMarkAction()
    {
        $result = DateMarkAPI::addMark();
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     * 查询用户签到信息
     */
    function queryMarkAction()
    {
        $start_dt = $_REQUEST["startTime"];
        $end_dt = $_REQUEST["endTime"];

        $result = DateMarkAPI::queryMark($start_dt, $end_dt);
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }
}
