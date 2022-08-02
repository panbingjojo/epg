<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [健康检测-归档]-控制器
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/01/18 10:22
// +----------------------------------------------------------------------

namespace Home\Controller;


use Home\Model\Activity\ActivityManager;
use Home\Model\Common\ServerAPI\DeviceCheckApi;
use Home\Model\Common\ServerAPI\FamilyAPI;
use Home\Model\Common\ServerAPI\MeasureAPI;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class DataArchivingController extends BaseController {

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config() {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    public function recordListV1UI() {
        $this->initCommonRender();

        // 解析传递参数
        $focusMemberId = isset($_REQUEST['focusMemberId']) ? $_REQUEST['focusMemberId'] : '';//点击列表项家庭成员进入检测记录详情，记录其memberId，用于返回焦点保持

        // 查询有已归档检测记录的家庭成员列表
        $membersWithRecord = DeviceCheckApi::queryMembersWithRecord();

        // 查询所有未归档条数
        $deviceId = DeviceCheckApi::getBindDeviceId();
        $allUnarchivedRecords = DeviceCheckApi::queryAllUnarchivedRecordList($deviceId, 1, 1);
        $unarchivedCount = 0;//所有未归档数目
        if (null != $allUnarchivedRecords && $allUnarchivedRecords->result == 0) {
            $unarchivedCount = is_numeric($allUnarchivedRecords->count) ? $allUnarchivedRecords->count : 0;
        }

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("memberList", json_encode($membersWithRecord));
        $this->assign("unarchivedCount", $unarchivedCount);
        $this->assign("focusMemberId", $focusMemberId);

        $this->displayEx(__FUNCTION__);
    }

    public function recordDetailV1UI() {
        $this->initCommonRender();

        // 解析传递参数
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $memberName = isset($_REQUEST['memberName']) ? $_REQUEST['memberName'] : '';
        $memberImageId = isset($_REQUEST['memberImageId']) ? $_REQUEST['memberImageId'] : '';
        $memberGender = isset($_REQUEST['memberGender']) ? $_REQUEST['memberGender'] : '0';

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("memberId", $memberId);
        $this->assign("memberName", $memberName);
        $this->assign("memberImageId", $memberImageId);
        $this->assign("memberGender", $memberGender);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 监听到设备上传测量数据后，立即进入单条显示及归档该检测记录
     */
    public function archivedV1UI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();
        $this->initArchiveCommonRender();

        // 解析传递参数
        $recordDataListStr = isset($_REQUEST['recordDataList']) ? $_REQUEST['recordDataList'] : '';
        $recordDataList = json_decode($recordDataListStr);

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign('recordDataList', json_encode($recordDataList)); //检测步骤页面监听到设备的测量数据，一般为1条！

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 所有未归档检测记录列表
     */
    public function archivingListV1UI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();
        $this->initArchiveCommonRender();
        $channel = isset($_REQUEST['channel']) ? $_REQUEST['channel'] : 1;

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign('recordDataList', json_encode(array()));
        $this->assign('channel', $channel);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 解析与传递通用参数
     */
    private function initSelfCommonRender() {
        // 解析传递参数
        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 1; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $currentPage = isset($_REQUEST['currentPage']) && !empty($_REQUEST['currentPage']) ? $_REQUEST['currentPage'] : 1; //当前页码（number类型）
        $pageItemIndex = isset($_REQUEST['pageItemIndex']) && !empty($_REQUEST['pageItemIndex']) ? $_REQUEST['pageItemIndex'] : 1; //默认跳转页中第几条（number类型）
        $actionType = isset($_REQUEST['actionType']) && !empty($_REQUEST['actionType']) ? $_REQUEST['actionType'] : ""; //1表示从新增家庭成员页面返回

        $this->assign('type', $type);
        $this->assign('currentPage', $currentPage);
        $this->assign('pageItemIndex', $pageItemIndex);
        $this->assign('actionType', $actionType);
    }

    /**
     * 解析与传递检测到测量数据进入单条归档页面和所有未归档记录列表能用参数
     */
    private function initArchiveCommonRender() {
        // 拉取用户已添加的家庭成员
        $addedMemberList = array();
        $webMemberList = FamilyAPI::queryMember();
        if (null != $webMemberList && $webMemberList['result'] == 0 && count($webMemberList['list']) > 0) {
            $addedMemberList = $webMemberList['list'];
        }

        // 拉取时段和就餐状态
        $momentData = null;
        $webMomentConfig = DeviceCheckApi::getDiffMomentConfig();
        if (null != $webMomentConfig && $webMomentConfig->result == 0) {
            $momentData = $webMomentConfig->data;
        }

        $this->assign('addedMemberList', json_encode($addedMemberList));
        $this->assign('momentData', json_encode($momentData));
        $this->assign('bindDeviceId', DeviceCheckApi::getBindDeviceId()); //获取当前用户最近已绑定的y设备号
    }

    public function archivingListV10UI() {
        $this->initCommonRender();

        // 拉取用户已添加的家庭成员
        $addedMemberList = array();
        $webMemberList = FamilyAPI::queryMember();
        if (null != $webMemberList && $webMemberList['result'] == 0 && count($webMemberList['list']) > 0) {
            $addedMemberList = $webMemberList['list'];
        }
        // 拉取时段和就餐状态
        $momentData = null;
        $webMomentConfig = MeasureAPI::getDiffMomentConfig();
        if (null != $webMomentConfig && $webMomentConfig->result == 0) {
            $momentData = $webMomentConfig->data;
        }

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 查询未归档检测记录列表
        if ($_GET['enter_type'] == 2) {
            $recordList = MeasureAPI::queryAllUnarchivedRecordList(MasterManager::getLYDeviceId(), 1, PHP_INT_MAX);
            $this->assign("recordList", $recordList);
        }

        // 查询localStorage得值
        $storeData = ActivityManager::queryStoreData("EPG-LWS-HEALTHTEST-LOCALSTORAGE-" . MasterManager::getCarrierId() . "-" . MasterManager::getUserId());
        $storeData = json_decode($storeData);
        if ($storeData->result == 0) {
            $this->assign("localStorageData", $storeData->val);
        }

        // 焦点保持（在此页面跳转到添加家庭成员，返回的时候用到）
        $this->assign("curIndexInFiveItem", isset($_GET['curIndexInFiveItem']) ? $_GET['curIndexInFiveItem'] : -1);
        $this->assign("moveNum", isset($_GET['moveNum']) ? $_GET['moveNum'] : -1);
        $this->assign("member_focus_index", isset($_GET['member_focus_index']) ? $_GET['member_focus_index'] : -1);

        $this->assign("measure_data", json_decode($_GET['measure_data']));
        $this->assign("enter_type", json_decode($_GET['enter_type'])); // 进入页面类型，1-检测进入 2-未归档进入
        $this->assign('addedMemberList', $addedMemberList);
        $this->assign('momentData', $momentData);

        $this->displayEx(__FUNCTION__);
    }

    public function recordListV10UI() {
        $this->initCommonRender();

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 查询有检测记录的家庭成员
        $memberList = MeasureAPI::queryMembersWithRecord();
        // 查询未归档检测记录列表
        $recordList = MeasureAPI::queryAllUnarchivedRecordList(MasterManager::getLYDeviceId(), 1, PHP_INT_MAX);

        // 焦点
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $this->assign("focusIndex", $focusIndex);
        // 当前页号
        $page = isset($_GET['page']) ? $_GET['page'] : -1;
        $this->assign("page", $page);

        $this->assign("memberList", $memberList);
        $this->assign("recordList", $recordList);

        $this->displayEx(__FUNCTION__);
    }


    public function testTypeUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $focusId = parent::requestFilter('focusId');
        $keepFocusId = parent::requestFilter('keepFocusId', 'tab-0');
        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 查询该成员血糖检测记录详情
        $recordDetail = MeasureAPI::queryMemberInspectRecord($member_id, 1, "", "", 1, PHP_INT_MAX);
        // 拉取时段和就餐状态
        $momentData = null;
        $webMomentConfig = MeasureAPI::getDiffMomentConfig();
        if (null != $webMomentConfig && $webMomentConfig->result == 0) {
            $momentData = $webMomentConfig->data;
        }
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign("recordDetail", $recordDetail);
        $this->assign('momentData', $momentData);
        $this->assign('focusId', $focusId);
        $this->assign('keepFocusId', $keepFocusId);
        $this->assign('page', $page);

        $this->displayEx(__FUNCTION__);
    }


    public function testListUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $testType = $_GET['testType'];
        $focusId = parent::requestFilter('focusId');
        $keepFocusId = parent::requestFilter('keepFocusId', 'tab-0');
        $unusualItems = parent::requestFilter('unusualItems', '');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 查询该成员血糖检测记录详情
        $recordDetail = MeasureAPI::queryMemberInspectRecord($member_id, 1, "", "", 1, PHP_INT_MAX);
        // 拉取时段和就餐状态
        $momentData = null;
        $webMomentConfig = MeasureAPI::getDiffMomentConfig();
        if (null != $webMomentConfig && $webMomentConfig->result == 0) {
            $momentData = $webMomentConfig->data;
        }
        $page = parent::requestFilter('page', 0);
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign("recordDetail", $recordDetail);
        $this->assign('momentData', $momentData);
        $this->assign('focusId', $focusId);
        $this->assign('testType', $testType);
        $this->assign('keepFocusId', $keepFocusId);
        $this->assign('page', $page);
        $this->assign('unusualItems', $unusualItems);
        $this->assign('cwsInquirySeverUrl', CWS_HLWYY_URL_OUT);

        $this->displayEx(__FUNCTION__);
    }


    public function weightListUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $testType = $_GET['testType'];
        $focusId = parent::requestFilter('focusId');
        $keepFocusId = parent::requestFilter('keepFocusId', 'detail-0');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 查询该成员血糖检测记录详情
        $recordDetail = MeasureAPI::queryMemberInspectRecord($member_id, 1, "", "", 1, PHP_INT_MAX);
        // 拉取时段和就餐状态
        $momentData = null;
        $webMomentConfig = MeasureAPI::getDiffMomentConfig();
        if (null != $webMomentConfig && $webMomentConfig->result == 0) {
            $momentData = $webMomentConfig->data;
        }
        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign("recordDetail", $recordDetail);
        $this->assign('momentData', $momentData);
        $this->assign('focusId', $focusId);
        $this->assign('testType', $testType);
        $this->assign('keepFocusId', $keepFocusId);
        $this->assign('page', $page);
        $this->assign('cwsInquirySeverUrl', CWS_HLWYY_URL_OUT);

        $this->displayEx(__FUNCTION__);
    }


    public function weightDetailUI() {
        $this->initCommonRender();

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $measureId = $_GET['measureId'];
        $resistance = $_GET['resistance'];
        $testType = $_GET['testType'];
        $focusId = parent::requestFilter('focusId');
        $keepFocusId = parent::requestFilter('keepFocusId', 'write-data');
        $scroll = isset($_REQUEST['scroll']) ? $_REQUEST['scroll'] : 0;
        $weight = isset($_REQUEST['weight']) ? $_REQUEST['weight'] : 0;

        $time = isset($_REQUEST['time']) ? $_REQUEST['time'] : "";
        $fat = isset($_REQUEST['fat']) ? $_REQUEST['fat'] : '暂无数据';

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 查询该成员血糖检测记录详情
        $recordDetail = MeasureAPI::queryMemberInspectRecord($member_id, 1, "", "", 1, PHP_INT_MAX);
        // 拉取时段和就餐状态
        $momentData = null;
        $webMomentConfig = MeasureAPI::getDiffMomentConfig();
        if (null != $webMomentConfig && $webMomentConfig->result == 0) {
            $momentData = $webMomentConfig->data;
        }
        $height = parent::requestFilter('height','0');
        $age = parent::requestFilter('age', '0');
        $sex = parent::requestFilter('sex', '1');
        $id = parent::requestFilter('id', '');

        $this->assign("height", $height);
        $this->assign("age", $age);
        $this->assign("sex", $sex);
        $this->assign("id", $id);

        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign("recordDetail", $recordDetail);
        $this->assign('momentData', $momentData);
        $this->assign('keepFocusId', $keepFocusId);
        $this->assign('testType', $testType);
        $this->assign('scroll', $scroll);
        $this->assign('time', $time);
        $this->assign('fat', $fat);
        $this->assign('resistance', $resistance);
        $this->assign('weight', $weight);
        $this->assign('measureId', $measureId);
        $this->assign('focusId', $focusId);


        $this->displayEx(__FUNCTION__);
    }

    public function weightIntroduceUI() {
        $this->initCommonRender();
        $measureId = $_GET['measureId'];
        $fatType = $_GET['fatType'];
        $resistance = $_GET['resistance'];
        $member_id = $_GET['member_id'];
        $weight = isset($_REQUEST['weight']) ? $_REQUEST['weight'] : 0;
        $this->assign("member_id", $member_id);
        $this->assign('measureId', $measureId);
        $this->assign('weight', $weight);
        $this->assign('resistance', $resistance);
        $this->assign('fatType', $fatType);

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->displayEx(__FUNCTION__);
    }


    public function recordDetailV10UI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $focusId = parent::requestFilter('focusId');
        $keepFocusId = parent::requestFilter('keepFocusId', 'tab-0');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 查询该成员血糖检测记录详情
        $recordDetail = MeasureAPI::queryMemberInspectRecord($member_id, 1, "", "", 1, PHP_INT_MAX);
        // 拉取时段和就餐状态
        $momentData = null;
        $webMomentConfig = MeasureAPI::getDiffMomentConfig();
        if (null != $webMomentConfig && $webMomentConfig->result == 0) {
            $momentData = $webMomentConfig->data;
        }
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign("recordDetail", $recordDetail);
        $this->assign('momentData', $momentData);
        $this->assign('focusId', $focusId);
        $this->assign('keepFocusId', $keepFocusId);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 新疆电信 -- 上报数据到天翼云
     */
    public function reportDataUI() {
        // 1、获取应用通用数据
        $commonData = $this->initCommonRender();
        // 2、上报用户访问路径
        $userId = $commonData['userId'];
        StatManager::uploadAccessModule($userId);
        // 3、获取列表传递的数据，提供页面展示以及业务逻辑使用
        // 3.1、获取上报通用参数，类型、头像、名字、ID
        $measureId = $_GET['measureId'];
        $memberId = $_GET['member_id'];
        $memberImgId = $_GET['member_image_id'];
        $memberName = $_GET['member_name'];
        $measureType = $_GET['measureType'];

        // 3.2、根据检测类型获取相关数据
        $measureData = json_decode($_GET['measureData'], true);

        // 4、渲染前端数据
        $this->assign("measureType", $measureType);
        $this->assign("measureId", $measureId);
        $this->assign("memberImgId", $memberImgId);
        $this->assign("memberId", $memberId);
        $this->assign("memberName", $memberName);
        $this->assign("measureData", $measureData);
        // 5、渲染页面
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 新疆电信 -- 批量上报数据到天翼云
     */
    public function reportDataBatUI() {
        // 1、获取应用通用数据
        $commonData = $this->initCommonRender();
        // 2、上报用户访问路径
        $userId = $commonData['userId'];
        StatManager::uploadAccessModule($userId);
        // 3、获取列表传递的数据，提供页面展示以及业务逻辑使用
        // 3.1、获取上报通用参数，类型、头像、名字、ID
        $memberId = $_GET['member_id'];
        $memberImgId = $_GET['member_image_id'];
        $memberName = $_GET['member_name'];
        $measureType = $_GET['measureType'];
        $testType = $_GET['test_type'];

        // 拉取时段和就餐状态
        $momentData = null;
        $webMomentConfig = MeasureAPI::getDiffMomentConfig();
        if (null != $webMomentConfig && $webMomentConfig->result == 0) {
            $momentData = $webMomentConfig->data;
        }

        // 4、渲染前端数据
        $this->assign("measureType", $measureType);
        $this->assign("memberImgId", $memberImgId);
        $this->assign("memberId", $memberId);
        $this->assign("memberName", $memberName);
        $this->assign("testType", $testType);
        $this->assign("momentData", $momentData);
        // 5、渲染页面
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 手环列表月面
     */
    public function wristListUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $testType = $_GET['testType'];
        $focusId = parent::requestFilter('focusId');
        $keepFocusId = parent::requestFilter('keepFocusId', 'tab-0');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('testType', $testType);
        $this->assign('keepFocusId', $keepFocusId);
        $this->assign('page', $page);
        $webMember = FamilyAPI::queryMember();
        $this->assign("memberInfo", json_encode($webMember));

        $this->displayEx(__FUNCTION__);
    }

    public function stepCountListUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $focusId = parent::requestFilter('focusId');
        $device_id = $_GET['device_id'];

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $scrollTop = isset($_REQUEST['scrollTop']) ? $_REQUEST['scrollTop'] : 0; // 滚动距离
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('page', $page);
        $this->assign('device_id', $device_id);
        $this->displayEx(__FUNCTION__);
    }

    public function stepCountDetailUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $focusId = parent::requestFilter('focusId');
        $device_id = $_GET['device_id'];

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $dt = isset($_REQUEST['dt']) ? $_REQUEST['dt'] : ""; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('dt', $dt);
        $this->assign('device_id', $device_id);
        $this->displayEx(__FUNCTION__);
    }

    public function heartRateListUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $focusId = parent::requestFilter('focusId');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $scrollTop = isset($_REQUEST['scrollTop']) ? $_REQUEST['scrollTop'] : 0; // 滚动距离
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('scrollTop', $scrollTop);
        $this->displayEx(__FUNCTION__);

    }

    public function sleepListUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $focusId = parent::requestFilter('focusId');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $scrollTop = isset($_REQUEST['scrollTop']) ? $_REQUEST['scrollTop'] : 0; // 滚动距离
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('scrollTop', $scrollTop);
        $this->displayEx(__FUNCTION__);
    }

    public function sleepDetailUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $focusId = parent::requestFilter('focusId');
        $measure_id = isset($_GET['measure_id']) ? $_GET['measure_id'] : "";

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('measure_id', $measure_id);
        $this->assign('page', $page);
        $this->displayEx(__FUNCTION__);
    }

    public function heartRateDetailUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $focusId = parent::requestFilter('focusId');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $dt = isset($_REQUEST['dt']) ? $_REQUEST['dt'] : ""; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('dt', $dt);
        $this->displayEx(__FUNCTION__);
    }

    public function heartRateSportUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $focusId = parent::requestFilter('focusId');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $start_dt = isset($_REQUEST['start_dt']) ? $_REQUEST['start_dt'] : ""; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $end_dt = isset($_REQUEST['end_dt']) ? $_REQUEST['end_dt'] : ""; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('start_dt', $start_dt);
        $this->assign('end_dt', $end_dt);
        $this->displayEx(__FUNCTION__);
    }

    public function sportDetailUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $curTab = isset($_GET['curTab']) ? $_GET['curTab'] : "";
        $measure_id = isset($_GET['measure_id']) ? $_GET['measure_id'] : "";
        $exercise_type = isset($_GET['exercise_type']) ? $_GET['exercise_type'] : "";
        $focusId = parent::requestFilter('focusId');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $scrollTop = isset($_REQUEST['scrollTop']) ? $_REQUEST['scrollTop'] : 0; // 滚动距离
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('curTab', $curTab);
        $this->assign('scrollTop', $scrollTop);
        $this->assign('measure_id', $measure_id);
        $this->assign('exercise_type', $exercise_type);
        $this->displayEx(__FUNCTION__);
    }

    public function sportEqDetailUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $curTab = isset($_GET['curTab']) ? $_GET['curTab'] : "";
        $measure_id = isset($_GET['measure_id']) ? $_GET['measure_id'] : "";
        $exercise_type = isset($_GET['exercise_type']) ? $_GET['exercise_type'] : "";
        $focusId = parent::requestFilter('focusId');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $scrollTop = isset($_REQUEST['scrollTop']) ? $_REQUEST['scrollTop'] : 0; // 滚动距离
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('curTab', $curTab);
        $this->assign('scrollTop', $scrollTop);
        $this->assign('measure_id', $measure_id);
        $this->assign('exercise_type', $exercise_type);
        $this->displayEx(__FUNCTION__);
    }

    public function sportListUI() {
        $this->initCommonRender();

        $member_id = $_GET['member_id'];
        $member_image_id = $_GET['member_image_id'];
        $member_name = $_GET['member_name'];
        $member_gender = $_GET['member_gender'];
        $curTab = isset($_GET['curTab']) ? $_GET['curTab'] : "";
        $exercise_type = isset($_GET['exercise_type']) ? $_GET['exercise_type'] : -1;
        $focusId = parent::requestFilter('focusId');

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 0; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $scrollTop = isset($_REQUEST['scrollTop']) ? $_REQUEST['scrollTop'] : 0; // 滚动距离
        $this->assign("member_id", $member_id);
        $this->assign("member_image_id", $member_image_id);
        $this->assign("member_name", $member_name);
        $this->assign("member_gender", $member_gender);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('curTab', $curTab);
        $this->assign('scrollTop', $scrollTop);
        $this->assign('exercise_type', $exercise_type);
        $this->displayEx(__FUNCTION__);
    }

    public function archivingListV13UI() {
        $this->initCommonRender();
        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());
        // 拉取用户已添加的家庭成员
        $addedMemberList = array();
        $webMemberList = FamilyAPI::queryMember();
        if (null != $webMemberList && $webMemberList['result'] == 0 && count($webMemberList['list']) > 0) {
            $addedMemberList = $webMemberList['list'];
        }
        // 拉取时段和就餐状态
        $momentData = null;
        $webMomentConfig = MeasureAPI::getDiffMomentConfig();
        if (null != $webMomentConfig && $webMomentConfig->result == 0) {
            $momentData = $webMomentConfig->data;
        }
        // 是否显示问医记录tab，默认是健康检测tab
        $showAskDoctorTab = isset($_GET['showAskDoctorTab']) ? $_GET['showAskDoctorTab'] : 0;

        $focusId = parent::requestFilter('focusId');
        $page = parent::requestFilter('page', 1);
        $comeFrom = parent::requestFilter('comeFrom', '');
        $isFromAskDoctorDetailPageBack = parent::requestFilter('isFromAskDoctorDetailPageBack');

        $this->assign('showAskDoctorTab', $showAskDoctorTab);
        $this->assign('addedMemberList', $addedMemberList);
        $this->assign('momentData', $momentData);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('comeFrom', $comeFrom);
        $this->assign('isFromAskDoctorDetailPageBack', $isFromAskDoctorDetailPageBack);

        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);

        $this->displayEx(__FUNCTION__);
    }
}