<?php

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\ControlUnitAPI;
use Home\Model\Common\ServerAPI\DoctorP2PAPI;
use Home\Model\Common\ServerAPI\DoctorP2PRecordAPI;
use Home\Model\Common\ServerAPI\InquiryAPI;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Common\ServerAPI\WXInquiry;
use Home\Model\DoctorP2P\DoctorP2PManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Inquiry\InquiryManager;
use Think\Exception;


class DoctorAPIController extends BaseController
{

    // 互联网医院分配应用标识 -- 新疆本地化
    const XINJIANG_LOCAL_APP_ID = 10018;
    // 互联网医院分配应用标识 -- 通用
    const COMMON_APP_ID = 10004;


    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /**
     * 获取医院列表
     * @throws \Think\Exception
     */
    public function getHospitalListAction()
    {
        $hospId = isset($_REQUEST['hospId']) ? $_REQUEST['hospId'] : "";   //默认拉取全部
        $param = array(
            'hospId' => $hospId,
        );
        $res = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_HOSPITAL_INFO, $param);
        $this->ajaxReturn($res, "EVAL");
    }

    /**
     * 通过医院ID来拉取医生列表
     */
    public function getDoctorListByHospIdAction()
    {
        $userId = MasterManager::getUserId();
        $deptId = isset($_REQUEST['deptId']) ? $_REQUEST['deptId'] : "0";   //默认拉取全部
        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : "1";
        $pageSize = isset($_REQUEST['pageSize']) ? $_REQUEST['pageSize'] : "4";
        $isTestUser = MasterManager::getIsTestUser(); // 白名单测试用户  0、正常用户  1、是测试用户
        $hospId = isset($_REQUEST['hospId']) ? $_REQUEST['hospId'] : ""; //互联网医院的id

        $param = array(
            'deptId' => $deptId,
            'iptvUserId' => $userId,
            'isTest' => $isTestUser,
            'page' => $page,
            'pageSize' => $pageSize,
            "hospId" => $hospId
        );
        $result = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_DOCTOR_LIST_BY_HOSP_ID, $param);
        LogUtils::info("getDoctorListByHospIdAction ===>: " . $result);

        // 微信图文：离线的地区
        $imOffLine = [CARRIER_ID_GUANGDONGGD, CARRIER_ID_GUANGDONGGD_NEW];
        if (in_array(CARRIER_ID, $imOffLine)) {
            // 遍历所有医生信息，把is_im_inquiry改为0
            $dataObj = json_decode($result);
            $doctorList = $dataObj->list;
            foreach ($doctorList as &$item) {
                $item->is_im_inquiry = 0;
            }

            $dataObj->list = $doctorList;
            $result = json_encode($dataObj);
        }

        $ret = array(
            'result' => json_decode($result),
        );
        $this->ajaxReturn($ret);
    }

    /**
     * 视频问诊 - 获取医生列表
     * @throws \Think\Exception
     */
    public function getDoctorListAction()
    {
        $userId = isset($_REQUEST['userId']) ? $_REQUEST['userId'] : MasterManager::getUserId();
        $deptId = isset($_REQUEST['deptId']) ? $_REQUEST['deptId'] : "0";   //默认拉取全部
        $deptIndex = isset($_REQUEST['deptIndex']) ? $_REQUEST['deptIndex'] : "0";   //默认拉取全部
        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : "1";
        $pageSize = isset($_REQUEST['pageSize']) ? $_REQUEST['pageSize'] : "4";

        $isTestUser = MasterManager::getIsTestUser(); // 白名单测试用户  0、正常用户  1、是测试用户

        $param = array('deptId' => $deptId, "deptIndex" => $deptIndex, 'iptvUserId' => $userId, 'isTest' => $isTestUser, 'page' => $page, 'pageSize' => $pageSize,"area_code" => MasterManager::getAreaCode());

        if (isset($_REQUEST['inquiryType'])) {
            $param['inquery_type'] = $_REQUEST['inquiryType'];
        }

        if (CARRIER_ID == CARRIER_ID_HENANDX) { // 河南电信需要跟据用户所在市筛选医生，并将筛选出来的医生优先排序
            // 定义EPG平台的地区编码与互联网医院对应的编码
            $cityCodeMap = array(
                "0370" => "411400", // 商丘
                "0371" => "410100", // 郑州
                "0372" => "410500", // 安阳
                "0373" => "410700", // 新乡
                "0374" => "411000", // 许昌
                "0375" => "410400", // 平顶山
                "0376" => "411500", // 信阳
                "0377" => "411300", // 南阳
                "0378" => "410200", // 开封
                "0379" => "410300", // 洛阳
                "0390" => "419000", // 济源
                "0391" => "410800", // 焦作
                "0392" => "410600", // 鹤壁
                "0393" => "410900", // 濮阳
                "0394" => "411600", // 周口
                "0395" => "411100", // 漯河
                "0396" => "411700", // 驻马店
                "0398" => "411200", // 三门峡
            );
            $param['provinceId'] = "410000";
            $param['cityId'] = $cityCodeMap[MasterManager::getAreaCode()];
            $param['areaId'] = "";
        }

        if (CARRIER_ID == CARRIER_ID_SHANDONGDX_HAIKAN || CARRIER_ID == CARRIER_ID_HAIKAN_APK) {
            $showLocalHospitalAreas = ['13402','13406','13408']; // 13402 - 陵城 13406 - 乐陵 13408 - 宁津
            /*$localHospitalAreaMap = array(
                '13402' => '371403', // 医院信息表里面入库时填入的是371403，实际该字段应该是371421
                '13406' => '371481',
                '13408' => '371422'
            );*/
            $subAreaCode = MasterManager::getSubAreaCode();
            if (!empty($subAreaCode) && in_array($subAreaCode,$showLocalHospitalAreas)) {
                $param['provinceId'] = "370000";
                $param['cityId'] = "371400";
                $param['areaId'] = "371422";
            }
        }

        $result = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_DOCTOR_LIST, $param);

        // 微信图文：离线的地区
        $imOffLine = [CARRIER_ID_GUANGDONGGD, CARRIER_ID_GUANGDONGGD_NEW,CARRIER_ID_SHANDONGDX];
        if (in_array(CARRIER_ID, $imOffLine)) {
            // 遍历所有医生信息，把is_im_inquiry改为0
            $dataObj = json_decode($result);
            $doctorList = $dataObj->list;
            foreach ($doctorList as &$item) {
                $item->is_im_inquiry = 0;
            }

            $dataObj->list = $doctorList;
            $result = json_encode($dataObj);
        }

        $ret = array(
            'result' => json_decode($result),
        );
        $this->ajaxReturn($ret);
    }

    /**
     * 获取互联网医院咨询医生
     * @throws \Think\Exception
     */
    public function getAdvisoryDoctorAction()
    {
        $phoneNum = isset($_REQUEST['phone_num']) ? $_REQUEST['phone_num'] : "";
        $iptvUserId = isset($_REQUEST['iptv_user_id']) ? $_REQUEST['iptv_user_id'] : "";

        $param = [
            'phoneNum' => $phoneNum,
            'iptvUserId' => $iptvUserId,
            "area_code" => MasterManager::getAreaCode(),
        ];
        $result = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_ADVISORY_DOCTOR, $param);
        $ret = array(
            'data' => json_decode($result),
        );
        $this->ajaxReturn($ret);
    }

    /**
     * 视频问诊 - 获取医生状态
     * @throws \Think\Exception
     */
    public function getDoctorStatusAction()
    {
        $doctorId = isset($_REQUEST['doctor_id']) ? $_REQUEST['doctor_id'] : "";
        $param = [
            'doctorId' => $doctorId,
            "area_code" => MasterManager::getAreaCode(),
        ];
        $result = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_DOCTOR_ONLINE_STATE, $param);
        LogUtils::info("DoctorAPIController::getDoctorStatusAction --> result: " . $result);
        $ret = json_encode(array(
            'data' => json_decode($result),
        ));
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 获取医生详细信息
     * @throws \Think\Exception
     */
    function getDoctorDetailAction()
    {
        $doctorId = isset($_REQUEST['doctor_id']) ? $_REQUEST['doctor_id'] : "140271";
        $result = DoctorP2PRecordAPI::getDoctorDetail($doctorId);
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 获取问诊记录api-->提供给页面调用
     * @throws \Think\Exception
     */
    function getInquiryRecordDetailAction()
    {
        $memberID = isset($_REQUEST["member_id"]) ? $_REQUEST["member_id"] : "";
        $pageCurrent = isset($_REQUEST["page_current"]) ? $_REQUEST["page_current"] : "";
        $res = DoctorP2PRecordAPI::getInquiryRecord($memberID, $pageCurrent, 1);
        $this->ajaxReturn($res, 'EVAL');
    }
//    获取是否问诊
    function getInquiryTimesAction()
    {
        $memberID = isset($_REQUEST["member_id"]) ? $_REQUEST["member_id"] : "";
        $pageCurrent = isset($_REQUEST["page_current"]) ? $_REQUEST["page_current"] : "";
        $res = DoctorP2PRecordAPI::getInquiryTimes($memberID, $pageCurrent, 1);
        $arr = array(
            "res123" => $res,
        );
        $ret = json_encode($arr);
        $this->ajaxReturn($ret, 'EVAL');
    }

    //    获取是否问诊
    function getInquiryTimesNewAction()
    {
        $durationFlag = isset($_REQUEST["duration_flag"]) ? $_REQUEST["duration_flag"] : "";
        $res = DoctorP2PRecordAPI::getInquiryTimesNew($durationFlag);
        $this->ajaxReturn($res, 'EVAL');
    }

    /**
     * 分页获取未归档问诊记录api-->提供给页面调用
     * @throws \Think\Exception
     */
    function getNotArchivePageRecordAction()
    {
        $pageCurrent = isset($_REQUEST["page_current"]) ? $_REQUEST["page_current"] : "";
        $pageNum = isset($_REQUEST["page_num"]) ? $_REQUEST["page_num"] : "";
        $res = DoctorP2PRecordAPI::getInquiryRecord("-1", $pageCurrent, $pageNum);
        $this->ajaxReturn($res, 'EVAL');
    }

    /**
     * 获取所有问诊记录
     */
    function getAllInquiryRecordAction()
    {
        $currentPage = isset($_REQUEST["currentPage"]) ? $_REQUEST["currentPage"] : "1";
        $pageNum = isset($_REQUEST["pageNum"]) ? $_REQUEST["pageNum"] : "1";
        $memberID = isset($_REQUEST["memberID"]) ? $_REQUEST["memberID"] : "0";
        $result = DoctorP2PRecordAPI::getAllRecordInfo($currentPage, $pageNum, $memberID);
        $ret = json_encode($result);
        $this->ajaxReturn($ret);
    }

    /**
     * 删除家庭成员对应的问诊记录信息
     */
    function deleteInquiryAction()
    {
        $userId = isset($_REQUEST["userId"]) ? $_REQUEST["userId"] : "1";
        $memberId = isset($_REQUEST["memberId"]) ? $_REQUEST["memberId"] : "1";
        $inquiryId = isset($_REQUEST["inquiryId"]) ? $_REQUEST["inquiryId"] : "1";
        $result = DoctorP2PRecordAPI::deleteRecord($userId, $memberId, $inquiryId);
        $ret = json_encode($result);
        $this->ajaxReturn($ret);
    }

    /**
     * 上传问诊评分api-->提供给页面调用
     * @throws \Think\Exception
     */
    function setDoctorScoreAction()
    {
        $userId = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : "";
        $inquiryId = isset($_REQUEST['inquiry_id']) ? $_REQUEST['inquiry_id'] : "";
        $score = isset($_REQUEST['score']) ? $_REQUEST['score'] : "";
        $param = [
            'userId' => $userId,
            'inquiryId' => $inquiryId,
            'score' => $score,
            'content' => "医生非常耐心，我得到了满意的答案",
        ];
        $result = InquiryManager::queryHLWYY(InquiryManager::FUNC_POST_DOCTOR_INQUIRY_COMMENT, $param);
        LogUtils::info("DoctorAPIController::setDoctorScore --> result: " . $result);
        $this->ajaxReturn($result,"EVAL");
    }

    /**
     * 视频问诊 - 构建问诊参数
     */
    public function buildInquiryParamAction()
    {
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
        if(CARRIER_ID == CARRIER_ID_XINJIANGDX) {
            $isLocalInquiry = MasterManager::getLocalInquiry();
            if($isLocalInquiry == 1){
                $APP_NAME .= ".local";
                $APP_CLASS_NAME = "com.longmaster.iptv.healthplugin.router.xjlocal.ProxyActivity";
            }
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
                        "module_name" => "$moduleName"
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
     * 设置待归档记录api-->提供给页面调用
     */
    function setArchiveRecordAction()
    {
        $memberID = isset($_REQUEST["member_id"]) ? $_REQUEST["member_id"] : "";
        $inquiryID = isset($_REQUEST["inquiry_id"]) ? $_REQUEST["inquiry_id"] : "";
        $result = DoctorP2PRecordAPI::archiveRecordToMember($memberID, $inquiryID);
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 获取免费问诊次数
     */
    function getFreeInquiryTimesAction()
    {
        $result = DoctorP2PRecordAPI::getFreeInquiryTimes();
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /*
    * 获取医生科室信息
    * @throws \Think\Exception
    */
    function getDepartmentAction()
    {
        $res = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_DEPARTMENT_LIST, "");
        $this->ajaxReturn($res, "EVAL");
    }

    /**
     * 获取助理医生信息
     * @throws \Think\Exception
     */
    public function getAssistantDoctorAction()
    {
        $isTestUser = MasterManager::getIsTestUser(); // 白名单测试用户  0、正常用户  1、是测试用户
        $param = array(
            'iptvUserId' => MasterManager::getUserId(),
            'isTest' => $isTestUser,
            "area_code" => MasterManager::getAreaCode(),
        );
        $result = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_ASSISTANT_DOCTOR, $param);
        $this->ajaxReturn($result, 'EVAL');
    }

    /*
     * 校验黑名单
     */
    function isInquiryBlacklistAction()
    {
        $result = UserAPI::isBlacklistUser("2");
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 校验电话号码
     */
    function verifyPhoneNumberAction()
    {
        $phone = isset($_REQUEST['phone']) ? $_REQUEST['phone'] : "";
        $sendSms = isset($_REQUEST['send_sms']) ? $_REQUEST['send_sms'] : "0";
        $result = InquiryAPI::verifyPhoneNumber($phone, $sendSms);
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 校验电话号码
     */
    function verifyTelCodeAction()
    {
        $phone = isset($_REQUEST['phone']) ? $_REQUEST['phone'] : "";
        $smdCode = isset($_REQUEST['sms_code']) ? $_REQUEST['sms_code'] : "0";
        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : "7";
        $result = UserAPI::verifyUserCode($phone, $smdCode, $type);
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /*
     * 添加问诊记录
     * */
    function addMemberInquiryRecordAction()
    {
        $userId = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : "0";
        $phone = isset($_REQUEST['phone']) ? $_REQUEST['phone'] : "0";
        $hospital = isset($_REQUEST['hospital']) ? $_REQUEST['hospital'] : "39互联网医院";
        $doctorId = isset($_REQUEST['doc_id']) ? $_REQUEST['doc_id'] : "0";
        $doctorName = isset($_REQUEST['doc_name']) ? $_REQUEST['doc_name'] : "0";
        $doctorImageUrl = isset($_REQUEST['doc_image_url']) ? $_REQUEST['doc_image_url'] : "0";
        $netHospUserId = isset($_REQUEST['net_hosp_user_id']) ? $_REQUEST['net_hosp_user_id'] : "0";
        $inquiryId = isset($_REQUEST['inquiry_id']) ? $_REQUEST['inquiry_id'] : "0";
        $memberId = isset($_REQUEST['member_id']) ? $_REQUEST['member_id'] : "0";
        $memberName = isset($_REQUEST['member_name']) ? $_REQUEST['member_name'] : "0";
        $inquiryType = isset($_REQUEST['inquiry_type']) ? $_REQUEST['inquiry_type'] : "0";
        $entryType = isset($_REQUEST['entry_type']) ? $_REQUEST['entry_type'] : "";
        $deptId = isset($_REQUEST['dept_id']) ? $_REQUEST['dept_id'] : "0";
        $waitTime = isset($_REQUEST['wait_time']) ? $_REQUEST['wait_time'] : "";
        $callResult = isset($_REQUEST['call_result']) ? $_REQUEST['call_result'] : "0";
        $netHospInquiryId = isset($_REQUEST['net_hosp_inquiry_id']) ? $_REQUEST['net_hosp_inquiry_id'] : "0";

        $result = InquiryAPI::addMemberInquiryRecord($doctorId, $doctorName, $doctorImageUrl, $netHospUserId, $inquiryId,
            $userId, $memberId, $memberName, $inquiryType, $entryType, $deptId, $phone, $waitTime, $callResult, $netHospInquiryId, $hospital);
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /************微信问诊************/
    /**
     * 获取医生微信问诊二维码
     * @throws \Think\Exception
     */
    public function getInquiryQRCodeAction()
    {
        $doctorId = isset($_REQUEST['doctor_id']) ? $_REQUEST['doctor_id'] : "0";
        $result = WXInquiry::getInquiryQRCode($doctorId);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 获取医生微信问诊二维码状态
     * @throws \Think\Exception
     */
    public function getInquiryStatusAction()
    {
        $scene = isset($_REQUEST['scene']) ? $_REQUEST['scene'] : "0";
        $result = WXInquiry::getInquiryStatus($scene);
        $this->ajaxReturn($result, 'EVAL');
    }


    /**************问诊操作************/
    /**
     * 开始问诊
     */
    function startInquiryAction()
    {
        $platformName = "";
        if (defined("INQUIRY_AREA_CODE_MAP")) {
            $array = eval(INQUIRY_AREA_CODE_MAP);
            $platformName = $array[CARRIER_ID];
            LogUtils::debug("startInquiryAction:  ---> $platformName");
        } else {
            LogUtils::debug("INQUIRY_AREA_CODE_MAP  undefined");
            $platformName = "IPTV EPG:" . CARRIER_ID;
        }

        $userId = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : "0";
        $phone = isset($_REQUEST['phone']) ? $_REQUEST['phone'] : "0";
        $isVip = isset($_REQUEST['is_vip']) ? $_REQUEST['is_vip'] : "0";
        $doctorId = isset($_REQUEST['doc_id']) ? $_REQUEST['doc_id'] : "0";
        $userName = isset($_REQUEST['user_name']) ? $_REQUEST['user_name'] : "0";
        $area = isset($_REQUEST['area']) ? $_REQUEST['area'] : "0";
        $inquiryID = isset($_REQUEST['inquiry_id']) ? $_REQUEST['inquiry_id'] : "0";
        $entry = isset($_REQUEST['entry']) ? $_REQUEST['entry'] : "";
        $age = isset($_REQUEST['age']) ? $_REQUEST['age'] : "0";
        $gender = isset($_REQUEST['gender']) ? $_REQUEST['gender'] : "0";

        MasterManager::setP2PPhone($phone);

        $result = ControlUnitAPI::startInquiry($userId, $phone, $isVip, $doctorId, $userName, $area, $platformName, $inquiryID, $entry, $age, $gender);
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');


    }

    /**
     * 结束始问诊
     */
    function finishInquiryAction()
    {
        $userId = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : "0";
        $phone = isset($_REQUEST['phone']) ? $_REQUEST['phone'] : "0";

        $result = ControlUnitAPI::finishInquiry($userId, $phone);
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 查询问诊信息
     */
    function queryInquiryInfoAction()
    {
        $userId = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : "0";
        $phone = isset($_REQUEST['phone']) ? $_REQUEST['phone'] : "0";

        $result = ControlUnitAPI::queryInquiryInfo($userId, $phone);
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 删除单条问诊记录（不论是否归档）注意：目前这个接口只传一个参数
     */
    function deleteInquiryRecordAction()
    {
        $inquiryId = isset($_REQUEST['inquiryId']) ? $_REQUEST['inquiryId'] : "0";

        $result = DoctorP2PRecordAPI::deleteInquiryRecord($inquiryId);
        $ret = json_encode($result);
        $this->ajaxReturn($ret, 'EVAL');
    }

    /**
     * 获取图文问诊二维码
     * @throws \Think\Exception
     */
    public function getTeletextQrcodeAction()
    {
        $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : "";

        if(CARRIER_ID == CARRIER_ID_XINJIANGDX && MasterManager::getLocalInquiry() == 1){
            // 新疆本地化医生图文问诊需要添加应用标识
            $url .= "?app_id=" . self::XINJIANG_LOCAL_APP_ID;
        }else {
            // 统一微信图文问诊和EPG中免费问诊次数的逻辑（屏蔽微信图文问诊中免费微信视频问诊功能添加）
            $url .= "?app_id=" . self::COMMON_APP_ID;
        }

        $param = array('url' => $url);

        $result = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_TELETEXT_QRCODE, $param);

        $ret = array(
            'result' => json_decode($result),
        );
        $this->ajaxReturn($ret);
    }

    /**
     * 存取问诊校验过的电话
     */
    public function pushPhoneListAction() {
        $phone = $_REQUEST['phoneNumber'];
        // TODO 暂时不做前端参数传递校验
        $result = DoctorP2PAPI::pushPhoneList($phone);
        // 返回前端存取结果
        $this->ajaxReturn($result,"EVAL");
    }

    /**
     * 获取问诊校验过的电话列表
     */
    public function getPhoneListAction() {
        $result = DoctorP2PAPI::getPhoneList();
        // 返回前端存取结果
        $this->ajaxReturn($result,"EVAL");
    }

    /**
     * 获取插件apk相关信息参数
     */
    public function getAppInfoAction(){
        // 插件apk包名
        $appPackageName = PLUGIN_VIDEO_APP_NAME;
        if (CARRIER_ID == CARRIER_ID_XINJIANGDX && MasterManager::getLocalInquiry() == 1) {
            $appPackageName .= '.local';
        }
        // 检测apk版本信息
        $appVersionData = DoctorP2PAPI::getPluginVersionInfo($appPackageName);
        // 插件apk是否需要到商城安装
        $isInstallByAppMarket = defined('PLUGIN_VIDEO_DOWNLOAD_URL') ? 0 : 1;
        // 构建apk信息对象
        $appInfo = array(
            "appPackageName" => $appPackageName,
            "isInstallByAppMarket" => $isInstallByAppMarket,
            "appVersionData" => $appVersionData,
            "appVersionName" => APP_VERSION_NAME,
        );
        // 插件apk存放服务器的地址
        if ($isInstallByAppMarket == 0) {
            $appInfo['downloadUrl'] = PLUGIN_VIDEO_DOWNLOAD_URL;
        } else {
            $appInfo['appMarketIntent'] = DoctorP2PManager::getAppMarketIntentParam();
        }
        $this->ajaxReturn(json_encode($appInfo),'EVAL');
    }
}
