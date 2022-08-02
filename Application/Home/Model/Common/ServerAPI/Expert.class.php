<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * | 大专家相关请求
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2018/4/2 10:43                                               |
 * +----------------------------------------------------------------------+
 */

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class Expert
{
    const FUNC_GET_DEPARTMENT_LIST = "getDepartmentList";//获取部门列表
    const FUNC_GET_DOCTORS_LIST = "getDoctorsList";//获取医生列表
    const FUNC_GET_INQUIRY_LIST = "getDoctorInquiryList";//获取约诊记录列表
    const FUNC_GET_MATERIAL_INFO = "getMaterialInfo";//获取辅助资料
    const FUNC_GET_PATIENT_INFO = "getPatientInfo";//获取医生建议
    const FUNC_GET_QR_CODE = "getQRCode";//获取二维码信息
    const FUNC_GET_APPOINTMENT_INFO = "getAppointmentInfo";//获取订购信息


    /**
     * 获取科室信息
     */
    public static function getDepartment()
    {
        $url = self::buildHttpUrl(self::FUNC_GET_DEPARTMENT_LIST);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * * 获取大专家列表信息
     * @param $departmentID 部门id，若为空，拉取全部医生
     * @param $limitBegin
     * @param $limitNum
     * @return mixed
     */
    public static function getExpertList($departmentID, $limitBegin, $limitNum)
    {
        $jsonArr = array(
            "begin_dt" => "",
            "end_dt" => "",
            "clinic_id" => "",
            "department_id" => $departmentID,
            "limit_begin" => $limitBegin,
            "limit_num" => $limitNum,
            "group_type" => 1
        );
        $url = self::buildHttpUrl(self::FUNC_GET_DOCTORS_LIST, $jsonArr);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * 获取专家详细信息
     * @param $clinicID 门诊id
     * @return mixed
     */
    public static function getExpertDetail($clinicID)
    {
        $jsonArr = array(
            "begin_dt" => "",
            "end_dt" => "",
            "clinic_id" => $clinicID,
            "department_id" => "",
            "limit_begin" => "",
            "limit_num" => "",
            "group_type" => 1
        );
        $url = self::buildHttpUrl(self::FUNC_GET_DOCTORS_LIST, $jsonArr);
        return HttpManager::httpRequest("GET", $url, null);
    }


    /**
     * 获取预约信息
     * @param $timestamp 拉取医生列表返回来的二维码时间搓
     * @return mixed
     */
    public static function getAppointmentInfo($timestamp)
    {
        $jsonArr = array(
            "timestamp" => $timestamp,
            "data_type" => 1
        );
        $url = self::buildHttpUrl(self::FUNC_GET_APPOINTMENT_INFO, $jsonArr);
        return HttpManager::httpRequest("GET", $url, null);
    }


    /**
     * @param $qrCodeType 1:支付订单,2:上传材料,3:立即预约
     * @param $appointmentID 已经预约的id
     * @param $clinicID    门诊id
     * @return mixed
     */
    public static function getQrCode($qrCodeType, $appointmentID, $clinicID)
    {
//        {"account_id":"100001","qrcode_content":{"appointment_id":"15453"},"qrcode_type":1}
        $jsonArr = array(
            "qrcode_type" => $qrCodeType,
            "qrcode_content" => array(
                "appointment_id" => $appointmentID,
                "clinic_id" => $clinicID,
            )
        );
        $url = self::buildHttpUrl(self::FUNC_GET_QR_CODE, $jsonArr);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * 获取医生建议信息
     * @param $appointmentID 预约的id
     * @return mixed
     */
    public static function getPatient($appointmentID)
    {
        $jsonArr = array(
            "appointment_id" => $appointmentID
        );
        $url = self::buildHttpUrl(self::FUNC_GET_PATIENT_INFO, $jsonArr);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * 获取辅助资料信息
     * @param $appointmentID 预约id
     * @return mixed
     */
    public static function getMaterialList($appointmentID)
    {
        $jsonArr = array(
            "appointment_id" => $appointmentID
        );
        $url = self::buildHttpUrl(self::FUNC_GET_MATERIAL_INFO, $jsonArr);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * 约诊记录列表
     * @param $appointmentID 预约挂号id，如果为空，返回全部信息，若存在，返回指定的预约id信息
     * @param $clinicID 门诊ID，不为空则返回指定门诊信息
     * @param $limitBegin   对应mysql中的limit开始值
     * @param $limitNum     对应mysql中的limit结束值
     * @return mixed
     */
    public static function getInquiryRecordList($appointmentID, $clinicID, $limitBegin, $limitNum = "")
    {

        $jsonArr = array(
            "appointment_id" => $appointmentID,
            "clinic_id" => $clinicID,
            "end_dt" => "",
            "begin_dt" => "",
            "limit_begin" => $limitBegin,
            "limit_num" => $limitNum
        );
        $url = self::buildHttpUrl(self::FUNC_GET_INQUIRY_LIST, $jsonArr);
        return HttpManager::httpRequest("GET", $url, null);
    }


    /**
     * 大专家医生不在线时，上报用户数据
     * @param $userAccount
     * @param $userPhone
     * @param $isVip
     * @return mixed
     */
    public static function postUserTel($userAccount, $userPhone, $isVip)
    {

        $json = array(
            "user_account" => $userAccount,
            "user_phone" => $userPhone,
            "is_vip" => ($isVip ? 1 : 0)
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_EXPERT_UPLOAD_PHONE);
        $result = $httpManager->requestPost($json);
        return $result;
    }


    /**
     * @param $reqFunc
     * @param array $jsonArr
     * @return string
     */
    private static function buildHttpUrl($reqFunc, array $jsonArr = array())
    {
        //注意:areaCode值为null时，拉取不到折扣价格的
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_XINJIANGDX:
                $areaCode = "";
                break;
            case CARRIER_ID_GUIZHOUGD:
                $areaCode = "";
                break;
            default:
                $areaCode = MasterManager::getAreaCode();
                break;
        }

        $arr = array(
            'func' => $reqFunc,
            'carrierId' => MasterManager::getCarrierId(),
            "areaCode" => $areaCode,
        );

        $headParam = "?head=" . json_encode($arr);

//        $isTest = 1;//开发时使用： $isTest = 1
        $isTest = MasterManager::getIsTestUser();
        $commonJsonArr = array(
//            "account_id" => "1000001",//开发时使用："account_id" => MasterManager::getUserId()
            "account_id" => MasterManager::getUserId(),//开发时使用："account_id" => MasterManager::getUserId()
            "isTest" => $isTest
        );

        $jsonParam = "&json=" . json_encode(array_merge($jsonArr, $commonJsonArr));

        $queryUrl = CWS_EXPERT_URL . $headParam . $jsonParam;
        LogUtils::info("expert-reqUrl=" . $queryUrl);
        return $queryUrl;
    }

    static public function appointmentInterface($functionid, $phone,$HospitalId, $data)
    {
        //$url= SERVER_ENTRY_ADDR."/cws/jiukang/index.php";
        $url= "http://223.221.36.146:10000/cws/jiukang/index.php";
        $json = array(
            "functionid" => $functionid,
            "phone" => $phone,
            "HospitalId" => $HospitalId,
            "data" => $data,
        );
        if($functionid == "16010"){
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $json['docInfo'] = urldecode($epgInfoMap['docInfo']);
            LogUtils::info("appointmentInterface docInfo:".json_encode($json));
            //$json['docInfo'] = urldecode($_COOKIE['docInfo2']);
            //LogUtils::info("appointmentInterface docInfo:".json_encode($_COOKIE['docInfo']));
        }

        $head = array(
            "user_id" => MasterManager::getUserId(),
            "carrier_id" => CARRIER_ID,
        );
        $url=$url."?head=".urlencode(json_encode($head))."&json=". urlencode(json_encode($json));
        LogUtils::info("appointmentInterface url:" . $url);
        $result = HttpManager::httpRequest("get", $url, $json);
        //$http = new HttpManager(HttpManager::PACK_ID_APPOINTMENT_INTERFACE);
        //$result = $http->requestPost($json);
        return json_decode($result);
    }

    /**
     * 获取手机问诊二维码
     * @return mixed
     */
    public static function getInquiryQrCode($inquirytype)
    {
        $json = array(
            "user_account" => MasterManager::getAccountId(),
            "inquiry_type" => $inquirytype
        );
        $http = new HttpManager(HttpManager::PACK_ID_GET_INQUIRY_QR_CODE);
        $result = $http->requestPost($json);
        return $result;
    }
}