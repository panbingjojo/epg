<?php


namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\HttpManager;
use Home\Model\Entry\MasterManager;

class GuaHaoAPI
{

    /**
     * 获取预约挂号地区列表
     * @return mixed
     */
    public static function getAppointmentAreaList()
    {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_AREA_LIST);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取预约挂号医院列表
     * @return mixed
     */
    public static function getAppointmentHospitalList($areaId)
    {
        $json = array(
            "current_page" => 1,
            "page_size" => PHP_INT_MAX,
        );
        if (isset($areaId) && !empty($areaId)) {
            $json['area_id'] = $areaId;
        }
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_HOSPITAL_LIST);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }
    /**
     * 获取预约挂号(全部)医院列表
     * @return mixed
     */
    public static function getAppointmentHospitalListStatic()
    {

        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_HOSPITAL_LIST_STATIC);
        return $httpManager->requestPost(null);

    }

    /**
     * 获取医院主页数据
     * @param $hospital_id
     * @param $is_province
     * @param $typeId
     * @return mixed
     * @throws \Think\Exception
     */
    public static function getHospital($hospital_id, $is_province, $typeId = 1)
    {
        $json = array(
            "hospital_id" => $hospital_id,
            "is_province" => $is_province,
            "user_id" => self::getExchangedGJKUID(),
            "type_id" => $typeId
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_HOSPITAL);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取医生列表
     * @param $hospital_id
     * @param $dept_id
     * @param $date
     * @return mixed
     * @throws \Think\Exception
     */
    public static function getDoctors($hospital_id, $dept_id, $date)
    {
        $json = array(
            "hospital_id" => $hospital_id,
            "dept_id" => $dept_id,
            "user_id" => self::getExchangedGJKUID(),
            "date" => $date,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_DOCTORS);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取医生详情
     * @param $hospital_id
     * @param $department_id
     * @param $doctor_id
     * @param $date
     * @param $on_line
     * @param $name
     * @return mixed
     * @throws \Think\Exception
     */
    public static function getDoctorDetail($hospital_id, $department_id, $doctor_id, $date, $on_line, $name)
    {
        $json = array(
            "user_id" => self::getExchangedGJKUID(),
            "hospital_id" => $hospital_id,
            "department_id" => $department_id,
            "doctor_id" => $doctor_id,
            "date" => $date,
            "on_line" => $on_line,
            "name" => $name,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_DOCTOR_DETAIL);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取就诊websocket等相关信息
     * @param $is_online
     * @param $expert_key
     * @param $user_id
     * @param $num
     * @return mixed
     */
    public static function getAppointInfo($is_online, $expert_key, $user_id, $num)
    {
        $json = array(
            "is_online" => $is_online,
            "expert_key" => $expert_key,
            "user_id" => $user_id,
            "num" => $num,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_APPOINT_INFO);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取就诊二维码
     * @param $user_id
     * @param $expert_key
     * @param $num
     * @param $session_id
     * @return mixed
     */
    public static function getAppointQRCode($user_id, $expert_key, $num, $session_id)
    {
        $json = array(
            "user_id" => $user_id,
            "expert_key" => $expert_key,
            "num" => $num,
            "session_id" => $session_id,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_APPOINT_QRCODE);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取就诊填写页面信息
     * @param $user_id
     * @param $expert_key
     * @param $num
     * @param $is_online
     * @return mixed
     */
    public static function getAppointInputInfo($user_id, $expert_key, $num, $is_online)
    {
        $json = array(
            "user_id" => $user_id,
            "expert_key" => $expert_key,
            "num" => $num,
            "is_online" => $is_online,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_APPOINT_INPUT_INFO);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取就诊人列表
     * @return mixed
     * @throws \Think\Exception
     */
    public static function getPatientList()
    {
        $json = array(
            "user_id" => self::getExchangedGJKUID(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_PATIENT_LIST);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 操作就诊人
     * @param $paramArray
     * @return mixed
     * @throws \Think\Exception
     */
    public static function postOperatePatient($paramArray)
    {
        $json = $paramArray;
        $json['user_id'] = self::getExchangedGJKUID();
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_POST_OPERATE_PATIENT);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取省市区
     * @param $paramArray
     * @return mixed
     * @throws \Think\Exception
     */
    public static function getArea($paramArray)
    {
        $json = $paramArray;
        $json['user_id'] = self::getExchangedGJKUID();
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_AREA);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 挂号下订单
     * @param $paramArray
     * @return mixed
     */
    public static function postAppointDoOrder($paramArray)
    {
        $json = $paramArray;
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_POST_APPOINT_DO_ORDER);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取挂号记录
     * @return mixed
     * @throws \Think\Exception
     */
    public static function getAppointRecords()
    {
        $json = array(
            "user_id" => self::getExchangedGJKUID(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_APPOINT_RECORDS);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取挂号记录详情
     * @param $order_id
     * @return mixed
     * @throws \Think\Exception
     */
    public static function getAppointRecordDetail($order_id)
    {
        $json = array(
            "user_id" => self::getExchangedGJKUID(),
            "order_id" => $order_id,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_APPOINT_RECORD_DETAIL);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 取消订单
     * @param $order_id
     * @return mixed
     * @throws \Think\Exception
     */
    public static function postAppointCancelOrder($order_id)
    {
        $json = array(
            "user_id" => self::getExchangedGJKUID(),
            "order_id" => $order_id,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_POST_APPOINT_CANCEL_ORDER);
        $result = $httpManager->requestGuaHaoPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取贵健康userId
     * @return mixed|null
     * @throws \Think\Exception
     */
    public static function getExchangedGJKUID()
    {
        $gjkUID = MasterManager::getGJKUID();
        if (isset($gjkUID)) {
            return $gjkUID;
        }

        $json = array(
            "iptv_id" => MasterManager::getUserId(),
            "carrier_id" => MasterManager::getCarrierId(),
            "area_code" => MasterManager::getAreaCode()
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_GET_GJKUID);
        $result = $httpManager->requestGuaHaoPost($json);
        $result = json_decode($result, true);

        if ($result['code'] == 0) {
            MasterManager::setGJKUID($result['userId']);
            return $result['userId'];
        } else {
            return null;
        }
    }

}