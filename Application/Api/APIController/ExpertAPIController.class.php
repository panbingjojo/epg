<?php

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\DoctorP2PAPI;
use Home\Model\Common\ServerAPI\Expert;
use Home\Model\DoctorP2P\DoctorP2PManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Inquiry\InquiryManager;

class ExpertAPIController extends BaseController
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
     * 视频问诊 - 构建问诊参数
     */
    public function buildInquiryParamAction()
    {
        LogUtils::error("buildInquiryParamAction::" . json_encode($_REQUEST));
        $area = isset($_REQUEST['area']) ? $_REQUEST['area'] : "0";
        $avatarUrlNew = isset($_REQUEST['avatar_url_new']) ? $_REQUEST['avatar_url_new'] : "0";
        $department = isset($_REQUEST['department']) ? $_REQUEST['department'] : "0";
        $doctorId = isset($_REQUEST['doc_id']) ? $_REQUEST['doc_id'] : "0";
        $doctorName = isset($_REQUEST['doc_name']) ? $_REQUEST['doc_name'] : "0";
        $gender = isset($_REQUEST['gender']) ? $_REQUEST['gender'] : "0";   //默认拉取全部
        $goodDisease = isset($_REQUEST['good_disease']) ? $_REQUEST['good_disease'] : "0";
        $hospital = isset($_REQUEST['hospital']) ? $_REQUEST['hospital'] : "0";
        $inquiryNum = isset($_REQUEST['inquiry_num']) ? $_REQUEST['inquiry_num'] : "0";
        $introDesc = isset($_REQUEST['intro_desc']) ? $_REQUEST['intro_desc'] : "0";
        $jobTitle = isset($_REQUEST['job_title']) ? $_REQUEST['job_title'] : "0";
        $onlineState = isset($_REQUEST['online_state']) ? $_REQUEST['online_state'] : "0";
        $realImageUrl = isset($_REQUEST['realImageUrl']) ? $_REQUEST['realImageUrl'] : "0";

        $moduleId = isset($_REQUEST['module_id']) ? $_REQUEST['module_id'] : "0";
        $moduleName = isset($_REQUEST['module_name']) ? $_REQUEST['module_name'] : "0";
        $entryType = isset($_REQUEST['entry_type']) ? $_REQUEST['entry_type'] : "0";
        $isUserPhoneInquiry = isset($_REQUEST['is_user_phone_inquiry']) ? $_REQUEST['is_user_phone_inquiry'] : false;


        $memberId = isset($_REQUEST['member_id']) ? $_REQUEST['member_id'] : "-1";
        $memberName = isset($_REQUEST['member_name']) ? $_REQUEST['member_name'] : "视频问诊";
        $memberAge = isset($_REQUEST['member_age']) ? $_REQUEST['member_age'] : "0";
        $memberGender = isset($_REQUEST['member_gender']) ? $_REQUEST['member_gender'] : "0";

        //大专家参数
        $expertAccountId = isset($_REQUEST['account_id']) ? $_REQUEST['account_id'] : "";
        $expertAppointmentId = isset($_REQUEST['appointment_id']) ? $_REQUEST['appointment_id'] : "";
        $expertBeginDt = isset($_REQUEST['begin_dt']) ? $_REQUEST['begin_dt'] : "";
        $expertClinicHospitalId = isset($_REQUEST['clinic_hospital_id']) ? $_REQUEST['clinic_hospital_id'] : "";
        $expertClinicId = isset($_REQUEST['clinic_id']) ? $_REQUEST['clinic_id'] : "";
        $expertClinicIsPay = isset($_REQUEST['clinic_is_pay']) ? $_REQUEST['clinic_is_pay'] : "";
        $expertClinicIsRefund = isset($_REQUEST['clinic_is_refund']) ? $_REQUEST['clinic_is_refund'] : "";
        $expertClinicSerial = isset($_REQUEST['clinic_serial']) ? $_REQUEST['clinic_serial'] : "";
        $expertClinicState = isset($_REQUEST['clinic_state']) ? $_REQUEST['clinic_state'] : "";
        $expertDepartmentName = isset($_REQUEST['department_name']) ? $_REQUEST['department_name'] : "";
        $expertDoctorAvatar = isset($_REQUEST['doctor_avatar']) ? $_REQUEST['doctor_avatar'] : "";
        $expertDoctorIntroduce = isset($_REQUEST['doctor_introduce']) ? $_REQUEST['doctor_introduce'] : "";
        $expertDoctorLevel = isset($_REQUEST['doctor_level']) ? $_REQUEST['doctor_level'] : "";
        $expertDoctorName = isset($_REQUEST['doctor_name']) ? $_REQUEST['doctor_name'] : "";
        $expertDoctorSkill = isset($_REQUEST['doctor_skill']) ? $_REQUEST['doctor_skill'] : "";
        $expertDoctorUserId = isset($_REQUEST['doctor_user_id']) ? $_REQUEST['doctor_user_id'] : "";
        $expertEndDt = isset($_REQUEST['end_dt']) ? $_REQUEST['end_dt'] : "";
        $expertHospitalAbbr = isset($_REQUEST['hospital_abbr']) ? $_REQUEST['hospital_abbr'] : "";
        $expertHospitalNname = isset($_REQUEST['hospital_name']) ? $_REQUEST['hospital_name'] : "";
        $expertInsertDt = isset($_REQUEST['insert_dt']) ? $_REQUEST['insert_dt'] : "";
        $expertMedicalUrl = isset($_REQUEST['medical_url']) ? $_REQUEST['medical_url'] : "";
        $expertPatientName = isset($_REQUEST['patient_name']) ? $_REQUEST['patient_name'] : "";
        $expertPayDt = isset($_REQUEST['pay_dt']) ? $_REQUEST['pay_dt'] : "";
        $expertPayLinkDt = isset($_REQUEST['pay_link_dt']) ? $_REQUEST['pay_link_dt'] : "";
        $expertPayValue = isset($_REQUEST['pay_value']) ? $_REQUEST['pay_value'] : "";
        $expertPhoneNum = isset($_REQUEST['phone_num']) ? $_REQUEST['phone_num'] : "";
        $expertPrepareState = isset($_REQUEST['prepare_state']) ? $_REQUEST['prepare_state'] : "";
        $expertRealImageUrl = isset($_REQUEST['realImageUrl']) ? $_REQUEST['realImageUrl'] : "";
        $expertUserId = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : "";

        $APP_NAME = PLUGIN_VIDEO_APP_NAME;
        $APP_CLASS_NAME = "com.longmaster.iptv.healthplugin.router.ProxyActivity";
        $isLocalInquiry = MasterManager::getLocalInquiry();
        if (CARRIER_ID == CARRIER_ID_XINJIANGDX && ($isLocalInquiry == 1)) { // 新疆电信本地化处理
            $APP_NAME = PLUGIN_VIDEO_APP_NAME . ".local";
            $APP_CLASS_NAME = "com.longmaster.iptv.healthplugin.router.xjlocal.ProxyActivity";
        }
        if (CARRIER_ID == CARRIER_ID_GUIZHOUGD) {
            // 贵州广电EPG后台没定义常量
            $APP_NAME = 'com.longmaster.iptv.healthplugin.video.guizhougd';
        }

        $APP_ACTION = "com.android.view";

        $isVip = MasterManager::getUserIsVip();

        $userInfoArr = array(
            "name" => "user_info",
            "value" =>
                base64_encode(json_encode(
                    array(
                        "user_id" => MasterManager::getUserId(),
                        "session_id" => MasterManager::getCwsSessionId(),
                        "channel_id" => "000000",
                        "client_type" => CLIENT_TYPE,
                        "client_version" => CLIENT_VERSION,
                        "carrier_id" => MasterManager::getCarrierId(),
                        "platform_type" => MasterManager::getPlatformType(),
                        "login_id" => MasterManager::getLoginId(),
                        "user_account" => MasterManager::getAccountId(),
                        "account_type" => ACCOUNT_TYPE,
                        "area_code" => MasterManager::getAreaCode(),
                        "is_vip" => $isVip,
                        "account_id" => MasterManager::getAccountId(),
                    )
                ))
        );

        $moduleInfoArr = array(
            "name" => "module_info",
            "value" =>
                base64_encode(json_encode(
                    array(
                        "module_id" => $moduleId,
                        "module_name" => "$moduleName",
                        "entry_type" => $entryType,
                        "is_user_phone_inquiry" => $isUserPhoneInquiry,
                    )
                ))
        );

        $serverInfoArr = array(
            "name" => "server_info",
            "value" =>
                base64_encode(json_encode(
                    array(
                        "server_entry_addr" => SERVER_ENTRY_ADDR,
                        "token" => PLUGIN_CONFIG_UPDATE_TOKEN, //更新配置文件的token值，apk对比更新文件
                    )
                ))
        );

        $doctorInfoArr = array(
            "name" => "doctor_info",
            "value" =>
                base64_encode(json_encode(
                    array(
                        "area" => $area,
                        "avatar_url_new" => $avatarUrlNew,
                        "department" => $department,
                        "doc_id" => $doctorId,
                        "doc_name" => $doctorName,
                        "gender" => $gender,
                        "good_disease" => $goodDisease,
                        "hospital" => $hospital,
                        "inquiry_num" => $inquiryNum,
                        "intro_desc" => $introDesc,
                        "job_title" => $jobTitle,
                        "online_state" => $onlineState,
                        "realImageUrl" => $realImageUrl,
                    )
                ))
        );

        $expertInfoArr = array(
            "name" => "expert_info",
            "value" =>
                base64_encode(json_encode(
                    array(
                        "account_id" => $expertAccountId,
                        "appointment_id" => $expertAppointmentId,
                        "begin_dt" => $expertBeginDt,
                        "clinic_hospital_id" => $expertClinicHospitalId,
                        "clinic_id" => $expertClinicId,
                        "clinic_is_pay" => $expertClinicIsPay,
                        "clinic_is_refund" => $expertClinicIsRefund,
                        "clinic_serial" => $expertClinicSerial,
                        "clinic_state" => $expertClinicState,
                        "department_name" => $expertDepartmentName,
                        "doctor_avatar" => $expertDoctorAvatar,
                        "doctor_introduce" => $expertDoctorIntroduce,
                        "doctor_level" => $expertDoctorLevel,
                        "doctor_name" => $expertDoctorName,
                        "doctor_skill" => $expertDoctorSkill,
                        "doctor_user_id" => $expertDoctorUserId,
                        "end_dt" => $expertEndDt,
                        "hospital_abbr" => $expertHospitalAbbr,
                        "hospital_name" => $expertHospitalNname,
                        "insert_dt" => $expertInsertDt,
                        "medical_url" => $expertMedicalUrl,
                        "patient_name" => $expertPatientName,
                        "pay_dt" => $expertPayDt,
                        "pay_link_dt" => $expertPayLinkDt,
                        "pay_value" => $expertPayValue,
                        "phone_num" => $expertPhoneNum,
                        "prepare_state" => $expertPrepareState,
                        "realImageUrl" => $expertRealImageUrl,
                        "user_id" => $expertUserId,
                    )
                ))
        );

        $memberInfoArr = array(
            "name" => "member_info",
            "value" =>
                base64_encode(json_encode(
                    array(
                        "member_id" => $memberId,
                        "member_name" => $memberName,
                        "member_age" => $memberAge,
                        "member_gender" => $memberGender,
                    )
                ))
        );

        // apk插件下载地址
        $downloadPluginUrl = defined('PLUGIN_VIDEO_DOWNLOAD_URL') ? PLUGIN_VIDEO_DOWNLOAD_URL : '';

        $paramInfo = array(
            "intentType" => 0,
            "appName" => $APP_NAME,
            "className" => $APP_CLASS_NAME,
            "action" => $APP_ACTION,
            "extra" => array(
                $userInfoArr,
                $moduleInfoArr,
                $serverInfoArr,
                $doctorInfoArr,
                $memberInfoArr,
                $expertInfoArr,
            )
        );

        $retArr = array(
            'param_info' => json_encode($paramInfo),
        );

        LogUtils::info("buildInquiryParamAction ----> param: " . json_encode($paramInfo));

        $this->ajaxReturn($retArr);

    }

    /**
     * 视频问诊 - 上报视频问诊参数
     */
    public function saveInquiryParamAction()
    {
        $macAddr = isset($_REQUEST['mac_addr']) ? $_REQUEST['mac_addr'] : "";
        $paramInfo = isset($_REQUEST['param_info']) ? $_REQUEST['param_info'] : "0";

        $paramInfo = base64_encode($paramInfo);
        $paramInfo = urlencode($paramInfo);
        $macAddrStr = str_replace(array(':', '-'), array('', ''), $macAddr);  //去掉mac地址带的 ：和 -
        $result = DoctorP2PManager::saveInquiryParam($macAddrStr, $paramInfo);
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 获取医生列表信息
     */
    public function getDoctorListAction()
    {
        $departmentID = isset($_REQUEST["departmentID"]) ? $_REQUEST["departmentID"] : "";
        $limitBegin = isset($_REQUEST["limitBegin"]) ? $_REQUEST["limitBegin"] : "";
        $limitNum = isset($_REQUEST["limitNum"]) ? $_REQUEST["limitNum"] : "";
        $data = Expert::getExpertList($departmentID, $limitBegin, $limitNum);
        $this->ajaxReturn($data, "EVAL");
    }

    /**
     * 获取专家详细信息
     */
    public function getExpertDetailAction()
    {
        $clinicID = isset($_REQUEST["clinicID"]) ? $_REQUEST["clinicID"] : "";
        $data = Expert::getExpertDetail($clinicID);
        $this->ajaxReturn($data, "EVAL");
    }

    /**
     * 获取咨询医生信息
     * @throws \Think\Exception
     */
    public function getAdvisoryDoctorAction()
    {
        $isTest = MasterManager::getIsTestUser();
        $arr = array(
            "phone_num" => "",
            "iptvUserId" => MasterManager::getUserId(),
            "isTest" => $isTest,
            "area_code" => MasterManager::getAreaCode(),
        );
        $res = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_ADVISORY_DOCTOR, json_encode($arr));
        $this->ajaxReturn($res, "EVAL");
    }


    //获取部门信息
    public function getDepartmentApiAction()
    {
        $data = Expert::getDepartment();
        $this->ajaxReturn($data, "EVAL");
    }

    //获取医生列表信息
    public function getDoctorListApiAction()
    {
        $departmentID = $_REQUEST["departmentID"];
        $limitBegin = $_REQUEST["limitBegin"];
        $limitNum = $_REQUEST["limitNum"];
        $data = Expert::getExpertList($departmentID, $limitBegin, $limitNum);
        $this->ajaxReturn($data, "EVAL");
    }

    //获取预约成功的信息
    public function getAppointmentApiAction()
    {
        $timestamp = $_REQUEST["timestamp"];
        $data = Expert::getAppointmentInfo($timestamp);
        $this->ajaxReturn($data, "EVAL");
    }

    //获取二维码信息
    public function getQrCodeApiAction()
    {
        $qrCodeType = $_REQUEST['qrCodeType'];
        $appointmentID = $_REQUEST['appointmentID'];
        $clinicID = $_REQUEST['clinicID'];
        $data = Expert::getQrCode($qrCodeType, $appointmentID, $clinicID);
        $data = str_replace(array("\r\n", "\r", "\n"), "", $data);
        $this->ajaxReturn($data, "EVAL");
    }

    //获取病例资料信息
    public function getMaterialListApiAction()
    {
        $appointmentID = $_REQUEST["appointmentID"];
        $data = Expert::getMaterialList($appointmentID);
        $this->ajaxReturn($data, "EVAL");
    }

    //获取医生建议信息
    public function getPatientApiAction()
    {
        $appointmentID = $_REQUEST["appointmentID"];
        $data = Expert::getPatient($appointmentID);
        $this->ajaxReturn($data, "EVAL");
    }

    //获取约诊记录信息
    public function getInquiryListApiAction()
    {

        $appointmentID = $_REQUEST["appointmentID"];
        $limitBegin = $_REQUEST["limitBegin"];
        $limitNum = $_REQUEST["limitNum"];
        $data = Expert::getInquiryRecordList($appointmentID, "", $limitBegin, $limitNum);
        $this->ajaxReturn($data, "EVAL");
    }


    //获取约诊记录信息
    public function getInquiryFilterListApiAction()
    {

        $returnArr = array(
            "code" => -1,
            "data" => array()
        );

        $appointmentID = $_REQUEST["appointmentID"];
        $limitBegin = $_REQUEST["limitBegin"];
        $limitNum = 10000;
        $data = Expert::getInquiryRecordList($appointmentID, "", $limitBegin, $limitNum);
        $dataArr = json_decode($data, true);
        $code = $dataArr["code"];
        if ($code == 0) {
            $itemDataArr = $dataArr["data"];
            $clinicArr = $this->getClinicArrNum();

            foreach ($itemDataArr as $key => $valArr) {
                $clinicId = trim($valArr["clinic_id"]);
                $payRealVal = (float)$valArr["pay_value"] - (float)$valArr["discount_value"];

                if (!($payRealVal > 0)) {
                    if (in_array($clinicId, $clinicArr)) {

                        if (isset($returnArr["data"]["insert_dt"])) {
                            $currTime = trim($valArr["insert_dt"]);
                            $storeTime = trim($returnArr["data"]["insert_dt"]);
                            if ($storeTime > $currTime) {
                                $returnArr["code"] = 0;
                                $returnArr["data"] = $valArr;
                            }
                        } else {
                            $returnArr["code"] = 0;
                            $returnArr["data"] = $valArr;
                        }

                    }
                }

            }
        } else {
            $returnArr["code"] = $code;
        }

        $this->ajaxReturn(json_encode($returnArr), "EVAL");
    }


    /**
     * 上报专家约诊记录
     */
    public function postUserTelApiAction()
    {
        $userAccount = MasterManager::getAccountId();
        $userPhone = $_REQUEST["user_phone"];
        $isVip = MasterManager::getUserIsVip();
        $res = Expert::postUserTel($userAccount, $userPhone, $isVip);
        $this->ajaxReturn($res, "EVAL");
    }

    private static function getClinicArrNum()
    {
        $baseArr = array(  //呼吸内科
            2028,//王京岚
            2042,//马靖
            1358,//冯玉麟
            1360,//柯会星
            2026,//高金明
        );
        $isTest = cookie("is_test_user");
        if ($isTest == 1) {//测试医生需要配置
            array_push($baseArr, 2359);
        }
        return $baseArr;
    }

    /**
     * 获取时间
     */
    public function getTimeAction()
    {
        $reTime = date("Y-m-d H:i:s", time());
        $this->ajaxReturn($reTime);
    }

    /**
     * 预约挂号接口
     */
    public function appointmentInterfaceAction()
    {
        $functionid = isset($_REQUEST['functionid']) ? $_REQUEST['functionid'] : '';
        $phone = isset($_REQUEST['phone']) ? $_REQUEST['phone'] : '';
        $HospitalId = isset($_REQUEST['HospitalId']) ? $_REQUEST['HospitalId'] : '';
        $data = isset($_REQUEST['data']) ? $_REQUEST['data'] : '';
        $data = json_decode($data);
        $result = Expert::appointmentInterface($functionid, $phone, $HospitalId, $data);
        LogUtils::info("appointmentInterface result:" . json_encode($result));
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     * 获取手机问诊二维码
     */
    public function getInquiryQrCodeAction()
    {
        $inquirytype = isset($_REQUEST["inquirytype"]) ? $_REQUEST["inquirytype"] : "1";
        $data = Expert::getInquiryQrCode($inquirytype);
        $this->ajaxReturn($data, "EVAL");
    }
}