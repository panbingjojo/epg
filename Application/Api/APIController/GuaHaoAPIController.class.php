<?php

namespace Api\APIController;



use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\GuaHaoAPI;

class GuaHaoAPIController extends BaseController
{
    public function config()
    {
    }

    /**
     * 获取预约挂号地区列表
     */
    public function getAppointmentAreaListAction()
    {
        $resultData = GuaHaoAPI::getAppointmentAreaList();
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 获取预约挂号医院列表
     */
    public function getAppointmentHospitalListAction($areaId)
    {
        $resultData = GuaHaoAPI::getAppointmentHospitalList($areaId);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 获取医生列表
     * @param $hospital_id
     * @param $dept_id
     * @param $date
     */
    public function getDoctorsAction($hospital_id, $dept_id, $date)
    {
        $resultData = GuaHaoAPI::getDoctors($hospital_id, $dept_id, $date);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 获取医生详情
     * @param $hospital_id
     * @param $department_id
     * @param $doctor_id
     * @param $date
     * @param $on_line
     * @param $name
     */
    public function getDoctorDetailAction($hospital_id, $department_id, $doctor_id, $date, $on_line, $name)
    {
        $resultData = GuaHaoAPI::getDoctorDetail($hospital_id, $department_id, $doctor_id, $date, $on_line, $name);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 获取就诊二维码
     * @param $user_id
     * @param $expert_key
     * @param $num
     * @param $session_id
     */
    public function getAppointQRCodeAction($user_id, $expert_key, $num, $session_id)
    {
        $resultData = GuaHaoAPI::getAppointQRCode($user_id, $expert_key, $num, $session_id);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 操作就诊人
     */
    public function postOperatePatientAction()
    {
        $paramArray = I('post.');
        $resultData = GuaHaoAPI::postOperatePatient($paramArray);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 获取省市区
     */
    public function getAreaAction()
    {
        $paramArray = I('post.');
        $resultData = GuaHaoAPI::getArea($paramArray);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 挂号下订单
     */
    public function postAppointDoOrderAction()
    {
        $paramArray = I('post.');
        $resultData = GuaHaoAPI::postAppointDoOrder($paramArray);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 取消订单
     */
    public function postAppointCancelOrderAction()
    {
        $paramArray = I('post.');
        $resultData = GuaHaoAPI::postAppointCancelOrder($paramArray['order_id']);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 获取挂号记录详情
     */
    public function getAppointRecordDetailAction()
    {
        $paramArray = I('post.');
        $resultData = GuaHaoAPI::getAppointRecordDetail($paramArray['order_id']);
        $this->ajaxReturn(json_encode($resultData));
    }
}