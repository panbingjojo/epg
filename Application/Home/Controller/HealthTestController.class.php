<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [设备检查-健康检测]-控制器
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/01/17 19:23
// +----------------------------------------------------------------------

namespace Home\Controller;

use Home\Model\Common\ServerAPI\DeviceCheckApi;
use Home\Model\Common\ServerAPI\JKDataServerAPI;
use Home\Model\Common\ServerAPI\FamilyAPI;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class HealthTestController extends BaseController {

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config() {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    public function indexUI()
    {
        $tabIndex = parent::requestFilter("tabIndex", "");
        $this->assign('tabIndex', $tabIndex);
        $this->assign("focusId", $_GET['focusId']);

        $page = isset($_GET['page']) ? $_GET['page'] : 0;
        $this->assign("page", $page);
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }


    public function outIndexUI() {
        $this->assign("focusId", $_GET['focusId']);
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function codeUI() {
        $this->assign("focusId", $_GET['focusId']);
        $this->assign('qrCodeUrl', CWS_EXPERT_URL_OUT);
        $testDevice = parent::requestFilter("testDevice", "");
        $remind = parent::requestFilter("remind", "");
        $deviceType = parent::requestFilter("deviceType", "");
        $deviceModelId = parent::requestFilter("deviceModelId", "");

        $this->assign('testDevice', $testDevice);
        $this->assign('remind', $remind);
        $this->assign('deviceType', $deviceType);
        $this->assign('deviceModelId', $deviceModelId);

        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 博士医生血糖测试二维码页面
     */
    public function doctorCodeUI() {
        $this->assign("focusId", $_GET['focusId']);
        $this->assign("curId", $_GET['curId']);
        $this->initCommonRender();
        $this->initSelfCommonRender();
        //$webMember = FamilyAPI::queryMember();
        //$this->assign("memberInfo", json_encode($webMember));
        // 解析传递参数
        $this->displayEx(__FUNCTION__);
    }

    public function bindWristbandUI() {
        $this->assign("focusId", $_GET['focusId']);
        $this->assign("curId", $_GET['curId']);
        $this->initCommonRender();
        $this->initSelfCommonRender();
        $webMember = FamilyAPI::queryMember();
        $this->assign("memberInfo", json_encode($webMember));
        $this->assign("memberInfo", json_encode($webMember));
        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function introduceUI() {
        $this->assign("focusId", $_GET['focusId']);
        $introId = parent::requestFilter("introId", "");
        $this->assign('introId', $introId);
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function introduceSTUI() {
        $this->assign("focusId", $_GET['focusId']);
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }
    public function introduceBodyFatUI() {
        $this->assign("focusId", $_GET['focusId']);
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function introduceTZUI() {
        $this->assign("focusId", $_GET['focusId']);
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 博士医生操作手册页面
     */
    public function hsDoctorIntroduceUI() {
        $this->assign("focusId", $_GET['focusId']);
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function introduceSHUI() {
        $this->assign("focusId", $_GET['focusId']);
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function stepHSDoctorSHUI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }
    public function stepSHUI()
    {
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function imeiInputV1UI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function waitStepV13UI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 选择的检测类型 1-胆固醇 2-尿酸 3-血糖
        $testType = $_GET['testType'];
        $this->assign('testType', $testType);

        $this->displayEx(__FUNCTION__);
    }


    public function detectionStepV1UI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function XYStepUI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }
    public function bodyFatStepUI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();
        // 解析传递参数
        $this->displayEx(__FUNCTION__);
    }

    public function TZStepUI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function XTStepUI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();

        $stepPic = parent::requestFilter('stepPic','');
        $this->assign('stepPic', $stepPic);
        $deviceName = parent::requestFilter('deviceName','');
        $this->assign('deviceName', $deviceName);

        $testDevice = parent::requestFilter('testDevice','');
        $this->assign('testDevice', $testDevice);

        $remind = parent::requestFilter('remind','');
        $this->assign('remind', $remind);
        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function inputDataV1UI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数
        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 1; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $actionType = isset($_REQUEST['actionType']) && !empty($_REQUEST['actionType']) ? $_REQUEST['actionType'] : ""; //1表示从新增家庭成员页面返回
        $inputFormDataStr = isset($_REQUEST['inputFormData']) && !empty($_REQUEST['inputFormData']) ? $_REQUEST['inputFormData'] : ""; // 当前已输入的表单数据，用于返回数据保持
        $inputFormData = json_decode($inputFormDataStr);

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


        $this->assign('type', $type);
        $this->assign('actionType', $actionType);
        $this->assign('addedMemberList', json_encode($addedMemberList));
        $this->assign('momentData', json_encode($momentData));
        $this->assign('inputFormData', json_encode($inputFormData));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 解析与传递通用参数
     */
    private function initSelfCommonRender() {
        // 解析传递参数
        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 1; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸

        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign('type', $type);
        $this->assign('bindDeviceId', DeviceCheckApi::getBindDeviceId()); // 获取当前用户最近已绑定的设备号
    }

    public function detectionStepV10UI() {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->displayEx(__FUNCTION__);
    }

    public function imeiInputV10UI() {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 拉雅检测仪imei
        $imei_number = isset($_GET['imei_number']) ? $_GET['imei_number'] : "";
        $this->assign("imei_number", $imei_number);
        // 焦点
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $this->assign("focusIndex", $focusIndex);

        // 如果输入过imei号，取session缓存
        if ($imei_number == "") {
            $imei_number = MasterManager::getLYDeviceId();
            if (isset($imei_number) && $imei_number != "") {
                $this->assign("imei_number", $imei_number);
            }
        }

        $this->displayEx(__FUNCTION__);
    }

    public function testIndexV13UI() {
        $this->initCommonRender();

        $this->assign("focusId", $_GET['focusId']);

        $this->displayEx(__FUNCTION__);
    }

    public function testRecordV13UI() {
        $this->initCommonRender();
        $this->displayEx(__FUNCTION__);
    }

    public function testWeightV8UI() {
        $this->assign('bindDeviceId', DeviceCheckApi::getBindDeviceId()); // 获取当前用户最近已绑定的设备号
        $focusId = parent::requestFilter('focusId');
        $this->assign('focusId', $focusId);

        $testDevice = parent::requestFilter("testDevice", "");
        $remind = parent::requestFilter("remind", "");
        $deviceModelId = parent::requestFilter("deviceModelId", "");

        $this->assign('testDevice', $testDevice);
        $this->assign('remind', $remind);
        $this->assign('deviceModelId', $deviceModelId);

        $this->initCommonRender();
        $this->displayEx(__FUNCTION__);
    }

    public function imeiInputV13UI() {
        $this->initCommonRender();

        // 选择的检测类型 1-胆固醇 2-尿酸 3-血糖
        $testType = $_GET['testType'];
        $this->assign('testType', $testType);

        // 如果输入过imei号，取session缓存
        $imei_number = MasterManager::getLYDeviceId();
        if (isset($imei_number) && $imei_number != "") {
            $this->assign("imei_number", $imei_number);
        } else {
            $this->assign("imei_number", "");
        }

        $focusId = parent::requestFilter('focusId');
        $this->assign('focusId', $focusId);

        $this->displayEx(__FUNCTION__);
    }


    public function imeiInputV8UI() {
        $this->initCommonRender();

        // 选择的检测类型 1-胆固醇 2-尿酸 3-血糖
        $testType = $_GET['testType'];
        $this->assign('testType', $testType);


        // 如果输入过imei号，取session缓存
        $imei_number = MasterManager::getLYDeviceId();
        if (isset($imei_number) && $imei_number != "") {
            $deviceType = $_GET['device_type'];
            if (isset($deviceType) && $deviceType !== 'lx')
                $this->assign("imei_number", $imei_number);
        } else {
            $this->assign("imei_number", "");
        }

        $focusId = parent::requestFilter('focusId');
        $this->assign('focusId', $focusId);

        $this->displayEx(__FUNCTION__);
    }
    public function bodyfata20InputV8UI() {
        $this->initCommonRender();

        // 选择的检测类型 1-胆固醇 2-尿酸 3-血糖
        $testType = $_GET['testType'];
        $this->assign('testType', $testType);


        // 如果输入过imei号，取session缓存
        $imei_number = MasterManager::getLYDeviceId();
        if (isset($imei_number) && $imei_number != "") {
            $deviceType = $_GET['device_type'];
            if (isset($deviceType) && $deviceType !== 'lx')
                $this->assign("imei_number", $imei_number);
        } else {
            $this->assign("imei_number", "");
        }

        $focusId = parent::requestFilter('focusId');
        $this->assign('focusId', $focusId);

        $this->displayEx(__FUNCTION__);
    }
    public function inputTestDataV8UI() {
        $this->initCommonRender();
        $this->initSelfCommonRender();

        // 解析传递参数
        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 1; // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
        $actionType = isset($_REQUEST['actionType']) && !empty($_REQUEST['actionType']) ? $_REQUEST['actionType'] : ""; //1表示从新增家庭成员页面返回
        $inputFormDataStr = isset($_REQUEST['inputFormData']) && !empty($_REQUEST['inputFormData']) ? $_REQUEST['inputFormData'] : ""; // 当前已输入的表单数据，用于返回数据保持
        $inputFormData = json_decode($inputFormDataStr);

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

        $this->assign('type', $type);
        $this->assign('actionType', $actionType);
        $this->assign('addedMemberList', json_encode($addedMemberList));
        $this->assign('momentData', json_encode($momentData));
        $this->assign('inputFormData', json_encode($inputFormData));

        $this->displayEx(__FUNCTION__);
    }

    public function inputTestDataV13UI() {
        $this->initCommonRender();

        // 选择的检测类型 1-胆固醇 2-尿酸 3-血糖
        $testType = $_GET['testType'];

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

        // 焦点保持
        $focusId = isset($_GET['focusId']) ? $_GET['focusId'] : "";
        $testMemberIndex = count($addedMemberList) - 1; // 焦点保持时，家庭成员始终是最后一个，因为只有移动到最后一个成员后才能移动焦点到“添加”按钮
        $testTime = isset($_GET['testTime']) ? $_GET['testTime'] : "";
        $testTypeIndex = isset($_GET['testTypeIndex']) ? $_GET['testTypeIndex'] : 0;
        $testValue = isset($_GET['testValue']) ? $_GET['testValue'] : "";
        $testStatusIndex = isset($_GET['testStatusIndex']) ? $_GET['testStatusIndex'] : 0;

        $this->assign('focusId', $focusId);
        $this->assign('testMemberIndex', $testMemberIndex);
        $this->assign('testTime', $testTime);
        $this->assign('testTypeIndex', $testTypeIndex);
        $this->assign('testValue', $testValue);
        $this->assign('testStatusIndex', $testStatusIndex);
        $this->assign('addedMemberList', json_encode($addedMemberList));
        $this->assign('momentData', json_encode($momentData));
        $this->assign('testType', $testType);

        $this->displayEx(__FUNCTION__);
    }

}