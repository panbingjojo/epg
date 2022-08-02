<?php
/**
 * Breif: 预约挂号控制器类，用于实现预约挂号的业务处理
 * Created by PhpStorm.
 * User: czy
 * Date: 2018-5-14
 * Time: 13:35
 */

namespace Home\Controller;


use Home\Model\Common\HttpManager;
use Home\Model\Common\ServerAPI\GuaHaoAPI;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;
use Home\Model\User\FirstManager;
use Home\Model\User\UserManager;

class AppointmentRegisterController extends BaseController {
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config() {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    public function appointmentUI() {
        $this->initCommonRender();
        // 获取预约挂号全部医院列表
        $hospList = GuaHaoAPI::getAppointmentHospitalListStatic();
        $this->assign("hospList", $hospList);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 预约挂号主界面
     */
    public function indexV1UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 获取预约挂号地区列表
        $areaList = GuaHaoAPI::getAppointmentAreaList();

        // 获取默认预约挂号医院列表
        $areaId = isset($_GET['areaId']) ? $_GET['areaId'] : "";
        $hospitalList = GuaHaoAPI::getAppointmentHospitalList($areaId);

        // 获取预约挂号全部医院列表
        $hospList = GuaHaoAPI::getAppointmentHospitalListStatic();
        //获取vip信息
        $vipInfo = UserManager::getVipInfo();

        $firstHandle = FirstManager::getFHandle(FirstManager::$F_APPOINTMENT);
        $this->assign("firstHandle", $firstHandle);
        $this->assign("vipInfo", $vipInfo);
        $this->assign('areaList', $areaList);
        $this->assign('hospitalList', $hospitalList);
        $this->assign("guahaoUrl", SERVER_GUAHAO);

        // 焦点
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $this->assign("focusIndex", $focusIndex);
        $scrollTop = isset($_GET['scrollTop']) ? $_GET['scrollTop'] : 0;
        $this->assign("scrollTop", $scrollTop);
        $page = isset($_GET['page']) ? $_GET['page'] : 1;
        $this->assign("page", $page);
        $region = isset($_GET['region']) ? $_GET['region'] : -1;
        $this->assign("region", $region);
        $this->assign("areaId", $areaId);
        $this->assign("hospList", $hospList);
        $this->assign("lmp", MasterManager::getEnterPosition());

        $isExitApp = parent::getFilter('isExitApp', "0"); // 从局方推荐位进入，然后退回局方
        $this->assign('isExitApp', $isExitApp);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 预约挂号界面
     */
    public function indexV2UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("pageCurrent", parent::getFilter("pageCurrent"));
        $this->assign("lastFocusId", parent::getFilter("lastFocusId"));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 预约挂号界面
     */
    public function introduceV2UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("pageCurrent", parent::getFilter("pageCurrent"));
        $this->assign("lastFocusId", parent::getFilter("lastFocusId"));
        $this->assign("index", parent::getFilter("index"));
        $this->assign("focusId", parent::getFilter("focusId"));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 区域选择界面
     */
    public function areaListV1UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("areasData", $this->getAppointmentHospitalAreas());
        $this->assign("guaHaoUrl", GUA_HAO_URL);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 医院详情界面
     */
    public function detailV1UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("guaHaoUrl", GUA_HAO_URL);

        $this->assign("hoslName", parent::getFilter("hoslName"));
        $this->assign("isProvince", parent::getFilter("isProvince"));
        $this->assign("address", parent::getFilter("address"));
        $this->assign("hoslId", parent::getFilter("hoslId"));
        $this->assign("pageCurrent", parent::getFilter("pageCurrent"));
        $this->assign("lastFocusId", parent::getFilter("lastFocusId"));
        $this->assign("areaId", parent::getFilter("areaId"));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 医院详情界面
     */
    public function detailV2UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("index", parent::getFilter("index"));
        $this->assign("pageCurrent", parent::getFilter("pageCurrent"));
        $this->assign("lastFocusId", parent::getFilter("lastFocusId"));
        $this->assign("focusId", parent::getFilter("focusId"));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 科室列表界面
     */
    public function subjectV2UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("index", parent::getFilter("index"));
        $this->assign("pageCurrent", parent::getFilter("pageCurrent"));
        $this->assign("lastFocusId", parent::getFilter("lastFocusId"));
        $this->assign("focusId", parent::getFilter("focusId"));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 医生表界面
     */
    public function doctorV2UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("index", parent::getFilter("index"));
        $this->assign("pageCurrent", parent::getFilter("pageCurrent"));
        $this->assign("lastFocusId", parent::getFilter("lastFocusId"));
        $this->assign("focusId", parent::getFilter("focusId"));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 挂号记录列表界面
     */
    public function recordV1UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $recordList = json_encode(array("list" => $this->getRecordListInfo()));

        $this->assign("guaHaoUrl", GUA_HAO_URL);
        $this->assign("recordListInfos", $recordList);
        $this->assign("pageCurrent", parent::getFilter("pageCurrent"));
        $this->assign("lastFocusId", parent::getFilter("lastFocusId"));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 挂号记录详情界面
     */
    public function recordDetailV1UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $orderId = parent::getFilter("order_id");

        $this->assign("guaHaoUrl", GUA_HAO_URL);
        $this->assign("orderId", $orderId);
        $this->assign("recordDetailInfo", $this->getRecordDetailInfo($orderId));
        $this->assign("pageCurrent", parent::getFilter("pageCurrent"));
        $this->assign("lastFocusId", parent::getFilter("lastFocusId"));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 更多挂号记录界面
     */
    public function moreRecordV1UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("guaHaoUrl", GUA_HAO_URL);
        $this->assign("moreRecordUrl", parent::getFilter("moreRecordUrl"));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 获取预约挂号开通的地区列表
     */
    public function getAppointmentHospitalAreas() {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_AREA_LIST);
        $resultData = $httpManager->requestPost($json);
        return $resultData;
    }

    /**
     * 根据地区id获取医院信息
     */
    public function getHospitalListInfo($areaId) {
        $hospitalList = "";
        $json = array(
            "current_page" => 1,
            "page_size" => 10000,
        );
        //有区域id才传，没有区域ID就不传
        if (isset($areaId)) {
            $json["area_id"] = $areaId;
        }
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_HOSPITAL_LIST);
        $resultData = $httpManager->requestPost($json);
        $resultData = str_replace(array("\\r\\n", "\\r", "\\n"), "", $resultData);
        $dataJson = json_decode($resultData);
        if (($dataJson->result == 0) && (isset($dataJson->list)) && (sizeof($dataJson->list) > 0)) {
            $hospitalList = $dataJson->list;
        }
        return $hospitalList;
    }

    /**
     * 获取挂号记录列表
     * @return string
     */
    public function getRecordListInfo() {
        $recordList = "";
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_RECORD_LIST);
        $resultData = $httpManager->requestPost($json);
        $resultData = str_replace(array("\\r\\n", "\\r", "\\n"), "", $resultData);
        $dataJson = json_decode($resultData);
        if (($dataJson->result == 0) && (isset($dataJson->data)) && (sizeof($dataJson->data) > 0)) {
            $recordList = $dataJson->data;
        }
        return $recordList;
    }

    /**
     * 获取某条挂号记录详情
     * @return string
     */
    public function getRecordDetailInfo($orderId) {
        $recordDetailInfo = "";
        $json = array(
            "order_id" => $orderId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HOSPITAL_APPOINTMENT_RECORD_DETAIL);
        $resultData = $httpManager->requestPost($json);
        $resultData = str_replace(array("\\r\\n", "\\r", "\\n"), "", $resultData);
        $dataJson = json_decode($resultData);
        if (($dataJson->result == 0) && (isset($dataJson->data->order)) && (sizeof($dataJson->data->order) > 0)) {
            $recordDetailInfo = $dataJson->data->order;
        }
        return $recordDetailInfo;
    }

    /** ---------------------------------预约挂号（新）--------------------------------- */

    public function hospitalDetailV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        /*$this->assign("hosl_name", $_GET['hosl_name']);
        $this->assign("hosl_pic", SERVER_GUAHAO_CWS_FS . $_GET['hosl_pic']);
        $this->assign("address", $_GET['address']);
        $this->assign("hospital_profile", $_GET['hospital_profile']);*/

        // 获取医院主页数据
        $hospital_info = GuaHaoAPI::getHospital($_GET['hospital_id'], $_GET['is_province']);
        $this->assign('hospital_info', $hospital_info);

        $this->displayEx(__FUNCTION__);
    }

    public function departmentV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $hospital_id = $_GET['hospital_id'];
        $is_province = $_GET['is_province'];
        // 获取医院主页数据
        $hospital_info = GuaHaoAPI::getHospital($hospital_id, $is_province);

        $this->assign('hospital_info', $hospital_info);
        $this->assign("hospital_id", $hospital_id);
        $this->assign("is_province", $is_province);

        // 焦点
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $leftMenuId = isset($_GET['leftMenuId']) ? $_GET['leftMenuId'] : "";
        $leftMenuPage = isset($_GET['leftMenuPage']) ? $_GET['leftMenuPage'] : "";
        $rightMenuPage = isset($_GET['rightMenuPage']) ? $_GET['rightMenuPage'] : "";
        $currentSecondMenuPos = isset($_GET['currentSecondMenuPos']) ? $_GET['currentSecondMenuPos'] : "";
        $this->assign("focusIndex", $focusIndex);
        $this->assign("leftMenuId", $leftMenuId);
        $this->assign("leftMenuPage", $leftMenuPage);
        $this->assign("rightMenuPage", $rightMenuPage);
        $this->assign("currentSecondMenuPos", $currentSecondMenuPos);

        $this->displayEx(__FUNCTION__);
    }

    public function doctorListV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 获取医生列表
        $hospital_id = $_GET['hospital_id'];
        $dept_id = $_GET['dept_id'];
        $shift_limit = $_GET['shift_limit'];
        $curSelectedDate = isset($_GET['curSelectedDate']) ? $_GET['curSelectedDate'] : date('Y-m-d');
        $doc_list = GuaHaoAPI::getDoctors($hospital_id, $dept_id, $curSelectedDate);

        $this->assign("doc_list", $doc_list);
        $this->assign("hospital_id", $hospital_id);
        $this->assign("dept_id", $dept_id);
        $this->assign("tips", $_GET['tips']);

        // 焦点
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $curTimeSelectedId = isset($_GET['curTimeSelectedId']) ? $_GET['curTimeSelectedId'] : "";
        $this->assign("focusIndex", $focusIndex);
        $this->assign("curTimeSelectedId", $curTimeSelectedId);
        $this->assign("curSelectedDate", $curSelectedDate);
        $scrollTop = isset($_GET['scrollTop']) ? $_GET['scrollTop'] : 0;
        $this->assign("scrollTop", $scrollTop);
        $page = isset($_GET['page']) ? $_GET['page'] : 0;
        $this->assign("page", $page);
        $date_index = isset($_GET['date_index']) ? $_GET['date_index'] : 0;
        $this->assign("date_index", $date_index);

        $this->displayEx(__FUNCTION__);
    }

    public function appointmentTimeV10UI() {   // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $hospital_id = $_GET['hospital_id'];
        $department_id = $_GET['department_id'];
        $doctor_id = $_GET['doctor_id'];
        $date = $_GET['date'];
        $on_line = $_GET['on_line'];
        $date_index = $_GET['date_index'];
        $expert = $_GET['expert'];
        $name = $_GET['name'];

        // 获取医生详情
        $detail = GuaHaoAPI::getDoctorDetail($hospital_id, $department_id, $doctor_id, $date, $on_line, $name);
        $this->assign("detail", $detail);
        $this->assign("hospital_id", $hospital_id);
        $this->assign("department_id", $department_id);
        $this->assign("doctor_id", $doctor_id);
        $this->assign("date", $date);
        $this->assign("on_line", $on_line);
        $this->assign("date_index", $date_index);
        $this->assign("name", $name);

        // 焦点
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $this->assign("focusIndex", $focusIndex);
        $page = isset($_GET['page']) ? $_GET['page'] : 0;
        $this->assign("page", $page);

        $this->displayEx(__FUNCTION__);
    }

    public function doctorDetailV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $hospital_id = $_GET['hospital_id'];
        $department_id = $_GET['department_id'];
        $doctor_id = $_GET['doctor_id'];
        $date = $_GET['date'];
        $on_line = $_GET['on_line'];
        $name = $_GET['name'];

        // 获取医生详情
        $detail = GuaHaoAPI::getDoctorDetail($hospital_id, $department_id, $doctor_id, $date, $on_line, $name);

        $this->assign("detail", $detail);

        $this->displayEx(__FUNCTION__);
    }

    public function reservationAddV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 获取就诊填写页面信息
        $input_info = GuaHaoAPI::getAppointInputInfo($_GET['user_id'], $_GET['expert_key'], $_GET['num'], $_GET['is_online']);
        $input_info['num'] = json_decode($_GET['num']);

        $this->assign("input_info", $input_info);
        $this->assign("user_id", $_GET['user_id']);
        $this->assign("expert_key", $_GET['expert_key']);
        $this->assign("num", $_GET['num']);
        $this->assign("is_online", $_GET['is_online']);
        $this->assign("patient_info", json_decode($_GET['patient_info']));

        // 表示从二维码跳入
        $this->assign("from_qrcode_page", $_GET['from_qrcode_page']);

        // 焦点
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $this->assign("focusIndex", $focusIndex);
        $scrollTop = isset($_GET['scrollTop']) ? $_GET['scrollTop'] : 0;
        $this->assign("scrollTop", $scrollTop);

        $this->displayEx(__FUNCTION__);
    }

    public function patientSelectionV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 获取就诊人列表
        $patient_list = GuaHaoAPI::getPatientList();

        $this->assign("patient_list", $patient_list);
        $this->assign("user_id", $_GET['user_id']);
        $this->assign("expert_key", $_GET['expert_key']);
        $this->assign("num", $_GET['num']);
        $this->assign("is_online", $_GET['is_online']);

        // 焦点
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $this->assign("focusIndex", $focusIndex);
        $page = isset($_GET['page']) ? $_GET['page'] : 0;
        $this->assign("page", $page);

        $this->displayEx(__FUNCTION__);
    }

    public function patientEditorV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 1-新增 2-编辑
        $this->assign("type", $_GET['type']);
        // 编辑情况，把就诊人信息传递到编辑页面
        $this->assign("patient_info", json_decode($_GET['patient_info']));
        $this->assign("user_id", $_GET['user_id']);
        $this->assign("expert_key", $_GET['expert_key']);
        $this->assign("num", $_GET['num']);
        $this->assign("is_online", $_GET['is_online']);

        $this->displayEx(__FUNCTION__);
    }

    public function reservationRuleV10UI() {
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }

    public function paymentOrderV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 获取挂号记录详情
        $detail = GuaHaoAPI::getAppointRecordDetail($_GET['order_id']);
        $this->assign("detail", $detail);
        $this->assign("orderId", $_GET['order_id']);

        $this->displayEx(__FUNCTION__);
    }

    public function phoneCodeV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 获取就诊websocket等相关信息
        $appoint_info = GuaHaoAPI::getAppointInfo($_GET['is_online'], $_GET['expert_key'], $_GET['user_id'], $_GET['num']);

        $this->assign("appoint_info", $appoint_info);
        $this->assign("is_online", $_GET['is_online']);
        $this->assign("expert_key", $_GET['expert_key']);
        $this->assign("user_id", $_GET['user_id']);
        $this->assign("num", $_GET['num']);

        $this->displayEx(__FUNCTION__);
    }

    public function guideV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("session_id", $_GET['session_id']);
        $this->assign("wsserver", $_GET['wsserver']);
        $this->assign("QRCodeUrl", $_GET['QRCodeUrl']);

        $this->displayEx(__FUNCTION__);
    }

    public function registeredRecordV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        // 获取医院主页数据
        $hospital_info = GuaHaoAPI::getHospital('', '1', 1);

        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign('hospital_info', json_encode($hospital_info));

        // 获取挂号记录
        $records = GuaHaoAPI::getAppointRecords();
        $this->assign("records", $records);

        // 焦点
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $this->assign("focusIndex", $focusIndex);
        $scrollTop = isset($_GET['scrollTop']) ? $_GET['scrollTop'] : 0;
        $this->assign("scrollTop", $scrollTop);
        $page = isset($_GET['page']) ? $_GET['page'] : 0;
        $this->assign("page", $page);

        // 是否从主页跳入
        $isFromMyFamilyPage = isset($_GET['isFromMyFamilyPage']) ? $_GET['isFromMyFamilyPage'] : "";
        $this->assign("isFromMyFamilyPage", $isFromMyFamilyPage);

        $this->displayEx(__FUNCTION__);
    }

    public function registrationDetailsV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 获取挂号记录详情
        $detail = GuaHaoAPI::getAppointRecordDetail($_GET['order_id']);
        $this->assign("detail", $detail);
        $this->assign("orderId", $_GET['order_id']);

        // 挂号记录页面焦点
        $lastFocusIndex = isset($_GET['lastFocusIndex']) ? $_GET['lastFocusIndex'] : "";
        $this->assign("lastFocusIndex", $lastFocusIndex);
        $page = isset($_GET['page']) ? $_GET['page'] : 0;
        $this->assign("page", $page);

        $this->displayEx(__FUNCTION__);
    }

    public function createCodeV10UI() {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $hospital_id = $_GET['hospital_id'];
        $is_province = $_GET['is_province'];
        // 获取医院主页数据
        $hospital_info = GuaHaoAPI::getHospital($hospital_id, $is_province, 2);

        $this->assign('hospital_info', $hospital_info);
        $this->assign("hospital_id", $hospital_id);
        $this->assign("is_province", $is_province);

        $this->displayEx(__FUNCTION__);
    }


    /**
     * 静态预约挂号
     */
    public function moreHospitalStaticV1UI() {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $moreHospitalUrl = isset($_REQUEST['moreHospitalUrl']) ? $_REQUEST['moreHospitalUrl'] : '';
        $this->assign('moreHospitalUrl', $moreHospitalUrl);
        $this->displayEx(__FUNCTION__);
    }

    public function doctorDetailStaticV1UI() {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $doctorIndex = isset($_REQUEST['doctorIndex']) ? $_REQUEST['doctorIndex'] : "";
        $this->assign("doctorIndex", $doctorIndex);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 预约挂号控制器入口
     */
    public function indexStaticV1UI() {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $isExitApp = parent::getFilter('isExitApp', "0"); // 从局方推荐位进入，然后退回局方
        $this->assign('isExitApp', $isExitApp);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 医院详情控制器入口
     */
    public function areaListStaticV1UI() {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }

    public function doctorStaticV1UI() {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }

    /************************ 新疆医院挂号相关 **********************************/

    /**新疆预约挂号*/
    public function indexV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $backIndex = parent::getFilter('backIndex', '0');
        $this->assign("backIndex", $backIndex);

        $hosId = parent::getFilter('hosId', '');
        $this->assign("hosId", $hosId);

        $this->displayEx(__FUNCTION__);
    }

    /**新疆预约挂号信息*/
    public function indexHospitalV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $hospitalId = parent::getFilter('HospitalId', '');
        $this->assign("hospitalId", $hospitalId);

        $backDepIndex = parent::getFilter('backDepIndex', '');
        $this->assign("backDepIndex", $backDepIndex);

        $docBtnId = parent::getFilter('docBtnId', '');
        $this->assign("docBtnId", $docBtnId);

        $openDepId = parent::getFilter('openDepId', 'dep-0-0');
        $this->assign("openDepId", $openDepId);

        $this->displayEx(__FUNCTION__);
    }

    /**新疆挂号医院详情*/
    public function indexHospitalIntroV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $hospitalId = parent::getFilter('HospitalId', '');
        $this->assign("hospitalId", $hospitalId);

        $this->displayEx(__FUNCTION__);
    }

    /**新疆挂号医生信息*/
    public function indexOrderDoctorV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $hospitalId = parent::getFilter('HospitalId', '');
        $depId = parent::getFilter('DepId', '');
        $docId = parent::getFilter('DocID', '');
        $hospitalName = parent::getFilter('HospitalName', '');
        $depName = parent::getFilter('DepName', '');


        $this->assign("hospitalId", $hospitalId);
        $this->assign("depId", $depId);
        $this->assign("docId", $docId);
        $this->assign("hospitalName", $hospitalName);
        $this->assign("depName", $depName);

        $backId = parent::getFilter('backId', '');
        $this->assign("backId", $backId);

        $this->displayEx(__FUNCTION__);
    }

    /**新疆添加订单*/
    public function indexAddOrderV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $hospitalName = parent::getFilter('HospitalName', '');
        $docName = parent::getFilter('DoctorName', '');
        $doceTime = parent::getFilter('Time', '');

        $this->assign("hospitalName", $hospitalName);
        $this->assign("docName", $docName);
        $this->assign("docTime", $doceTime);

        $this->displayEx(__FUNCTION__);
    }

    /**新疆选择预约挂号人*/
    public function indexChoosePeopleV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $isManage = parent::getFilter('manage', '0');
        $this->assign("isManage", $isManage);

        $backIndex = parent::getFilter('backIndex', '0');
        $this->assign("backIndex", $backIndex);

        $isAdd = parent::getFilter('isAdd', '');
        $this->assign("isAdd", $isAdd);

        $this->displayEx(__FUNCTION__);
    }

    /**新疆添加/编辑就诊人信息*/
    public function indexPeopleInfoV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $edit = parent::getFilter('edit', '');
        $this->assign("edit", $edit);


        $this->displayEx(__FUNCTION__);
    }

    /**新疆最后填写信息,提交*/
    public function indexFinalAddInfoV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());


        $this->displayEx(__FUNCTION__);
    }

    /**新疆预约成功*/
    public function indexOrderSuccessV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());


        $this->displayEx(__FUNCTION__);
    }

    /**新疆订单列表*/
    public function indexOrderListV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $backIndex = parent::getFilter('backIndex', '0');
        $this->assign("backIndex", $backIndex);


        $this->displayEx(__FUNCTION__);
    }

    /**新疆取消订单*/
    public function indexCancelOrderV8UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $info = parent::getFilter('info', '');
        $this->assign("info", $info);


        $this->displayEx(__FUNCTION__);
    }


    /************************ 青海医院挂号相关 **********************************/
    /**青海预约挂号*/
    public function indexV21UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $backIndex = parent::getFilter('backIndex', '0');
        $this->assign("backIndex", $backIndex);

        $hosId = parent::getFilter('hosId', '');
        $this->assign("hosId", $hosId);

        $depCode = parent::getFilter('depCode', '');
        $this->assign("depCode", $depCode);

        $backDepIndex = parent::getFilter('backDepIndex','');
        $this->assign('backDepIndex',$backDepIndex);
        $depBackIndex = parent::getFilter('depBackIndex','');
        $this->assign('depBackIndex',$depBackIndex);
        $this->displayEx(__FUNCTION__);
    }

    /**青海挂号医生信息*/
    public function indexOrderDoctorV21UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $docName = parent::getFilter('DocName','');
        $hospitalName = parent::getFilter('HospitalName', '');
        $depName = parent::getFilter('DepName', '');
        $title = parent::getFilter('title', '');
        $code = parent::getFilter('code','');
        $docNum = parent::getFilter('DocNum','');
        $title1 = parent::getFilter('title1','');

        $this->assign('docName', $docName);
        $this->assign("hospitalName", $hospitalName);
        $this->assign("depName", $depName);
        $this->assign('title',$title);
        $this->assign('code',$code);
        $this->assign('docNum',$docNum);
        $this->assign('title1',$title1);
        $backId = parent::getFilter('backId', '');
        $this->assign("backId", $backId);

        $this->displayEx(__FUNCTION__);
    }

    /**青海挂号医院详情*/
    public function indexHospitalIntroV21UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->displayEx(__FUNCTION__);
    }

    /**青海添加订单*/
    public function indexAddOrderV21UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $doctorName = parent::getFilter('DoctorName','');
        $hospitalName = parent::getFilter('HospitalName','');
        $time = parent::getFilter('Time','');
        $depName = parent::getFilter('DepName','');
        $startTime = parent::getFilter('StartTime','');
        $endTime = parent::getFilter('EndTime','');
        $dateTime = parent::getFilter('DateTime','');
        $title1 = parent::getFilter('title1','');
        $cost = parent::getFilter('cost','');
        $id_sch = parent::getFilter('id_sch','');
        $tickId = parent::getFilter('tickId','');
        $docNum = parent::getFilter('docNum','');
        $depCode = parent::getFilter('depCode','');

        $this->assign('docName',$doctorName);
        $this->assign('hospitalName',$hospitalName);
        $this->assign('Time',$time);
        $this->assign('depName',$depName);
        $this->assign('appointment_start',$startTime);
        $this->assign('appointment_end',$endTime);
        $this->assign('dateTime',$dateTime);
        $this->assign('title1',$title1);
        $this->assign('cost',$cost);
        $this->assign('id_sch',$id_sch);
        $this->assign('tickId',$tickId);
        $this->assign('docNum',$docNum);
        $this->assign('depCode',$depCode);

        $this->displayEx(__FUNCTION__);
    }

    /**青海选择预约挂号人*/
    public function indexChoosePeopleV21UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $isManage = parent::getFilter('manage', '0');
        $this->assign("isManage", $isManage);
        $backIndex = parent::getFilter('backIndex', '0');
        $this->assign("backIndex", $backIndex);

        $isAdd = parent::getFilter('isAdd', '');
        $this->assign("isAdd", $isAdd);


        $this->displayEx(__FUNCTION__);
    }

    /**青海第二步支付界面/提交*/
    public function indexFinalAddInfoV21UI() {
        $this->initCommonRender();  // 初始化通用渲染

        StatManager::uploadAccessModule(MasterManager::getUserId());
        $doctorName = parent::getFilter('DoctorName','');
        $hospitalName = parent::getFilter('HospitalName','');
        $depName = parent::getFilter('DepName','');
        $startTime = parent::getFilter('StartTime','');
        $endTime = parent::getFilter('EndTime','');
        $dateTime = parent::getFilter('DateTime','');
        $title1 = parent::getFilter('title1','');
        $patient = parent::getFilter('patient','');
        $cost = parent::getFilter('cost','');
        $id_sch = parent::getFilter('id_sch','');
        $tickId = parent::getFilter('tickId','');
        $patientId = parent::getFilter('patientId','');
        $docNum = parent::getFilter('docNum','');
        $depCode = parent::getFilter('depCode','');

        $this->assign('docName',$doctorName);
        $this->assign('hospitalName',$hospitalName);
        $this->assign('depName',$depName);
        $this->assign('appointment_start',$startTime);
        $this->assign('appointment_end',$endTime);
        $this->assign('dateTime',$dateTime);
        $this->assign('title1',$title1);
        $this->assign('patient',$patient);
        $this->assign('cost',$cost);
        $this->assign('id_sch',$id_sch);
        $this->assign('tickId',$tickId);
        $this->assign('patientId',$patientId);
        $this->assign('docNum',$docNum);
        $this->assign('depCode',$depCode);

        $this->displayEx(__FUNCTION__);
    }

    /**青海订单详情*/
    public function indexOrderDetailsV21UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $doctorName = parent::getFilter('doctorName','');
        $depName = parent::getFilter('depName','');
        $startTime = parent::getFilter('startTime','');
        $endTime = parent::getFilter('endTime','');
        $dateTime = parent::getFilter('dateTime','');
        $title1 = parent::getFilter('title1','');
        $name = parent::getFilter('name','');
        $card = parent::getFilter('card','');
        $sex = parent::getFilter('sex','');
        $num = parent::getFilter('num','');
        $payWay = parent::getFilter('payWay','');
        $payMoney = parent::getFilter('payMoney','');
        $payNum = parent::getFilter('payNum','');
        $payTime = parent::getFilter('payTime','');
        $isOrderList = parent::getFilter('isOrderList','');
        $status = parent::getFilter('status','');
        $id_apt = parent::getFilter('id_apt','');

        $this->assign('docName',$doctorName);
        $this->assign('depName',$depName);
        $this->assign('appointment_start',$startTime);
        $this->assign('appointment_end',$endTime);
        $this->assign('dateTime',$dateTime);
        $this->assign('title1',$title1);
        $this->assign('name',$name);
        $this->assign('card',$card);
        $this->assign('sex',$sex);
        $this->assign('num',$num);
        $this->assign('payWay',$payWay);
        $this->assign('payMoney',$payMoney);
        $this->assign('payNum',$payNum);
        $this->assign('payTime',$payTime);
        $this->assign('isOrderList',$isOrderList);
        $this->assign('status',$status);
        $this->assign('id_apt',$id_apt);

        $this->displayEx(__FUNCTION__);
    }

    /**青海订单列表*/
    public function indexOrderListV21UI() {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $backIndex = parent::getFilter('backIndex', '0');
        $this->assign("backIndex", $backIndex);

        $this->displayEx(__FUNCTION__);
    }
}
