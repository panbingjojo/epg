<?php

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\ServerAPI\GuaHaoAPI;

class AppointmentRegisterAPIController extends BaseController
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
     * 获取医院详情
     * @return string
     */
    public function getHospitalDetailInfoAction()
    {
        $json = array(
            "hospital_id" => $_REQUEST["hospital_id"],
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_HOSPITAL_DETIAL);
        $resultData = $httpManager->requestPost($json);
        $resultData = str_replace(array("\\r\\n", "\\r", "\\n"), "", $resultData);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 获取医院详情(后台配置)
     * @return string
     */
    public function getHospitalExpertInfoAction()
    {
        $json = array(
            "hospital_id" => $_REQUEST["hospital_id"],
            "hospital_name" => $_REQUEST["hospital_name"],
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_DOCTOR_LIST_STATIC);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 获取医院列表(后台配置)
     * @return string
     */
    public function getHospitalListInfoAction()
    {
        $resultData = GuaHaoAPI::getAppointmentHospitalListStatic();
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 取消预约
     * @return string
     */
    public function getUnAppointmentAction()
    {
        $json = array(
            "order_id" => $_REQUEST["order_id"],
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_UN_APPOINTMENT);
        $resultData = $httpManager->requestPost($json);
        $resultData = str_replace(array("\\r\\n", "\\r", "\\n"), "", $resultData);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 获取支付二维码
     * @return string
     */
    public function getPayCodeAction()
    {
        $json = array(
            "order_id" => $_POST["order_id"],
            "total_fee" => $_POST["total_fee"],
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_PAY_CODE);
        $resultData = $httpManager->requestPost($json);
        $resultData = str_replace(array("\\r\\n", "\\r", "\\n"), "", $resultData);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 获取支付结果
     * @return string
     */
    public function getQueryPayResultAction()
    {
        $json = array(
            "order_id" => $_POST["order_id"],
            "trade_no" => $_POST["trade_no"],
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_PAY_RESULT);
        $resultData = $httpManager->requestPost($json);
        $resultData = str_replace(array("\\r\\n", "\\r", "\\n"), "", $resultData);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    public function getRecordListInfoAction()
    {
        $timeStamp = isset($_REQUEST["time_stamp"]) ? $_REQUEST["time_stamp"] : "";
        $pageSize = isset($_REQUEST["page_size"]) ? $_REQUEST["page_size"] : "";

        $json = array(
            'time_stamp' => $timeStamp,
            'page_size' => $pageSize,
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_RECORD_LIST);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 获取医院信息
     */

    public function getHospitalInfoAction()
    {

        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_HOSPITAL_INFO);
        $resultData = $httpManager->requestPost("");
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 获取科室信息
     */
    public function getDepartmentInfoAction()
    {
        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_DEPARTMENT_INFO);
        $resultData = $httpManager->requestPost("");
        $this->ajaxReturn($resultData, 'EVAL');
    }

    public function getDepartmentInfo1Action()
    {
        $date = isset($_REQUEST["date"]) ? $_REQUEST['date'] : '';

        $json = array(
            'date' => $date,
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_DEPARTMENTS_INFO);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 获取排班时间医生
     */
    public function getDoctorInfoAction()

    {
        $deptCode = isset($_REQUEST["deptCode"]) ? $_REQUEST["deptCode"] : "";
        $beginDate = isset($_REQUEST["beginDate"]) ? $_REQUEST["beginDate"] : "";
        $endDate = isset($_REQUEST["endDate"]) ? $_REQUEST["endDate"] : "";


        $json = array(
            'deptCode' => $deptCode,
            'beginDate' => $beginDate,
            'endDate' => $endDate,
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_DOCTOR_INFO);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');

    }

    /**
     * 获取排版对应号位
     */
    public function getOrderTimeAction()
    {
        $schIds = isset($_REQUEST["schIds"]) ? $_REQUEST["schIds"] : '';

        $json = array(
            "schIds" => $schIds,
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_ORDERTIME_INFO);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 获取支付方式信息
     */
    public function getMethodPaymentAction()
    {
        $payMethod = isset($_REQUEST["payMethod"]) ? $_REQUEST["payMethod"] : '';
        $name = isset($_REQUEST["name"]) ? $_REQUEST["name"] : '';
        $price = isset($_REQUEST["price"]) ? $_REQUEST["price"] : '';
        $id_sch = isset($_REQUEST["id_sch"]) ? $_REQUEST["id_sch"] : '';
        $tickNo = isset($_REQUEST["tickNo"]) ? $_REQUEST["tickNo"] : '';
        $patientId = isset($_REQUEST["patientId"]) ? $_REQUEST["patientId"] : '';
        $deptCode = isset($_REQUEST["deptCode"]) ? $_REQUEST["deptCode"] : '';
        $doctorCode = isset($_REQUEST["doctorCode"]) ? $_REQUEST["doctorCode"] : '';
        $cost = isset($_REQUEST["cost"]) ? $_REQUEST["cost"] : '';
        $date = isset($_REQUEST["date"]) ? $_REQUEST["date"] : '';
        $type = isset($_REQUEST["type"]) ? $_REQUEST["type"] : '';
        $payWay = isset($_REQUEST["payWay"]) ? $_REQUEST["payWay"] : '';

        $json = array(
            "payMethod" => $payMethod,
            "name" => $name,
            "price" => $price,
            "id_sch" => $id_sch,
            "tickNo" => $tickNo,
            "patientId" => $patientId,
            "deptCode" => $deptCode,
            "doctorCode" =>$doctorCode,
            "cost" => $cost,
            "date" => $date,
            "type" => $type,
            "payWay" => $payWay
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_PAYMENT_INFO);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 获取支付状态信息
     */
    public function getPaymentStatusAction()
    {
        $orderStreamNo = isset($_REQUEST["orderStreamNo"]) ? $_REQUEST["orderStreamNo"] : '';

        $json = array(
            "orderStreamNo" => $orderStreamNo,
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_PAYSTATUS_INFO);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 退款
     */
    public function getRefundAction()
    {
        $payStreamNo = isset($_REQUEST["payStreamNo"]) ? $_REQUEST["payStreamNo"] : '';
        $refundType = isset($_REQUEST["refundType"]) ? $_REQUEST["refundType"] : '';
        $refundAmount = isset($_REQUEST["refundAmount"]) ? $_REQUEST["refundAmount"] : '';

        $json = array(
            "payStreamNo" => $payStreamNo,
            "refundType" => $refundType,
            "refundAmount" => $refundAmount,
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_ORDERSTATUS_INFO);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 获取订单列表
     */
    public function getOrderListAction()
    {
        $patCode = isset($_REQUEST["patCode"]) ? $_REQUEST["patCode"] : '';
        $beginDate = isset($_REQUEST["beginDate"]) ? $_REQUEST["beginDate"] : '';
        $endDate = isset($_REQUEST["endDate"]) ? $_REQUEST["endDate"] : '';

        $json = array(
            "patCode" => $patCode,
            "beginDate" => $beginDate,
            "endDate" => $endDate,
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_CANBACKLIST_INFO);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');
    }

    /**
     * 保存挂号
     */
    public function getSaveRegisteredAction()
    {
        $patientId = isset($_REQUEST["patientId"]) ? $_REQUEST["patientId"] : '';
        $deptCode = isset($_REQUEST["deptCode"]) ? $_REQUEST["deptCode"] : '';
        $doctorCode = isset($_REQUEST["doctorCode"]) ? $_REQUEST["doctorCode"] : '';
        $cost = isset($_REQUEST["cost"]) ? $_REQUEST["cost"] : '';
        $date = isset($_REQUEST["date"]) ? $_REQUEST["date"] : '';
        $type = isset($_REQUEST["type"]) ? $_REQUEST["type"] : '';
        $payWay = isset($_REQUEST["payWay"]) ? $_REQUEST["payWay"] : '';
        $bankNumber = isset($_REQUEST["bankNumber"]) ? $_REQUEST["bankNumber"] : '';
        $bankTradeNo = isset($_REQUEST["bankTradeNo"]) ? $_REQUEST["bankTradeNo"] : '';
        $bankTradeDate = isset($_REQUEST["bankTradeDate"]) ? $_REQUEST["bankTradeDate"] : '';
        $bankTradeTime = isset($_REQUEST["bankTradeTime"]) ? $_REQUEST["bankTradeTime"] : '';
        $orderNo = isset($_REQUEST["orderNo"]) ? $_REQUEST["orderNo"] : '';
        $id_sch = isset($_REQUEST["id_sch"]) ? $_REQUEST["id_sch"] : '';
        $tickNo = isset($_REQUEST["tickNo"]) ? $_REQUEST["tickNo"] : '';
        $patCardNo = isset($_REQUEST["patCardNo"]) ? $_REQUEST["patCardNo"] : '';
        $patHpTp = isset($_REQUEST["patHpTp"]) ? $_REQUEST["patHpTp"] : '';
        $hpPriceData = isset($_REQUEST["hpPriceData"]) ? $_REQUEST["hpPriceData"] : '';
        $patHpNo = isset($_REQUEST["patHpNo"]) ? $_REQUEST["patHpNo"] : '';
        $hpPatInfXml = isset($_REQUEST["hpPatInfXml"]) ? $_REQUEST["hpPatInfXml"] : '';

        $json = array(
            "patientId" => $patientId,
            "deptCode" => $deptCode,
            "doctorCode" => $doctorCode,
            "cost" => $cost,
            "date" => $date,
            "type" => $type,
            "payWay" => $payWay,
            "bankNumber" => $bankNumber,
            "bankTradeNo" => $bankTradeNo,
            "bankTradeDate" => $bankTradeDate,
            "bankTradeTime" => $bankTradeTime,
            "orderNo" => $orderNo,
            "id_sch" => $id_sch,
            "tickNo" => $tickNo,
            "patCardNo" => $patCardNo,
            "patHpTp" => $patHpTp,
            "hpPriceData" => $hpPriceData,
            "patHpNo" => $patHpNo,
            "hpPatInfXml" => $hpPatInfXml,
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_SAVEREGISTERED_INFO);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');
    }
    public function getBackNumAction()
    {
        $money = isset($_REQUEST["money"]) ? $_REQUEST["money"] : '';
        $id_apt = isset($_REQUEST["id_apt"]) ? $_REQUEST["id_apt"] : '';

        $json = array(
            "money" => $money,
            "id_apt" => $id_apt,
        );

        $httpManager = new HttpManager(HttpManager::PACK_GET_QINGHAI_GETBACKNUM_INFO);
        $resultData = $httpManager->requestPost($json);
        $this->ajaxReturn($resultData, 'EVAL');
    }
}

