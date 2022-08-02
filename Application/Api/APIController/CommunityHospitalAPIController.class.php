<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2020/1/7
 * Time: 17:32
 */

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\CommunityHospitalAPI;


class CommunityHospitalAPIController extends BaseController
{
    /**
     * 增加签约用户信息
     * @return mixed
     */
    public function addUserInfoAction()
    {
        $memberName = isset($_REQUEST["memberName"]) ? $_REQUEST["memberName"] : "";
        $idCard = isset($_REQUEST["idCard"]) ? $_REQUEST["idCard"] : "";
        $phoneNum = isset($_REQUEST['phoneNum']) ? $_REQUEST['phoneNum'] : "";
        $result = CommunityHospitalAPI::addUserInfo($memberName, $idCard, $phoneNum);
        $this->ajaxReturn($result);
    }

    /**
     * 查询签约成员
     * @return mixed
     */
    public function queryUserListAction()
    {
        $result = CommunityHospitalAPI::queryUserList();
        $this->ajaxReturn($result,"EVAL");
    }

    /**
     * 添加血压值
     * @return mixed
     */
    public function addBloodPressureAction()
    {
        $memberId = isset($_REQUEST["memberId"]) ? $_REQUEST["memberId"] : 0;
        $highPressure = isset($_REQUEST["highPressure"]) ? $_REQUEST["highPressure"] : 0;
        $lowPressure = isset($_REQUEST['lowPressure']) ? $_REQUEST['lowPressure'] : 0;
        $result = CommunityHospitalAPI::addBloodPressure($memberId, $highPressure, $lowPressure);
        $this->ajaxReturn($result,"EVAL");
    }

    /**
     * 查询血压值
     * @return mixed
     */
    public function queryBloodPressureAction()
    {
        $memberId = isset($_REQUEST["memberId"]) ? $_REQUEST["memberId"] : 0;
        $beginDt = isset($_REQUEST["beginDt"]) ? $_REQUEST["beginDt"] : "";
        $endDt = isset($_REQUEST['endDt']) ? $_REQUEST['endDt'] : "";
        $result = CommunityHospitalAPI::queryBloodPressure($memberId, $beginDt, $endDt);
        $this->ajaxReturn($result,"EVAL");
    }

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        // TODO: Implement config() method.
    }
}