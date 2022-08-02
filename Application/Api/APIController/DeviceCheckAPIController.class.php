<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [设备检查 -> 健康检测] 查询模块交互API
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/01/17 16:50
// +----------------------------------------------------------------------


namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\DeviceCheckApi;
use Home\Model\Entry\MasterManager;

class DeviceCheckAPIController extends BaseController
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
     * 获取用户绑定设备的mac地址。
     * e.g. {"result":0,"device_id":"accf23edb724"}
     */
    public function getBindDeviceIDAction()
    {
        $deviceId = DeviceCheckApi::getBindDeviceId();
        $result = array(
            "result" => 0,
            "device_id" => $deviceId
        );
        $this->ajaxReturn($result);
    }

    /**
     * 用户绑定设备
     */
    public function bindDeviceIdAction()
    {
        $deviceId = isset($_REQUEST['deviceId']) ? $_REQUEST['deviceId'] : '';
        $result = DeviceCheckApi::bindDeviceId($deviceId);
        $this->ajaxReturn($result);
    }

    /**
     * 设置推送id，用于健康检测监听server向client推送数据。
     */
    public function setPushIdAction()
    {
        $pushId = MasterManager::getUserId();
        $result = DeviceCheckApi::setPushId($pushId);
        $this->ajaxReturn($result);
    }

    /**
     * 归档一条健康检测记录
     */
    public function archiveInspectRecordAction()
    {
        $memberId = isset($_REQUEST['member_id']) ? $_REQUEST['member_id'] : '';
        $measureId = isset($_REQUEST['measure_id']) ? $_REQUEST['measure_id'] : '';
        $repastId = isset($_REQUEST['repast_id']) ? $_REQUEST['repast_id'] : '';
        $timeBucketId = isset($_REQUEST['timebucket_id']) ? $_REQUEST['timebucket_id'] : '';
        $paperType = isset($_REQUEST['paper_type']) ? $_REQUEST['paper_type'] : '';
        $envTemperature = isset($_REQUEST['env_temperature']) ? $_REQUEST['env_temperature'] : '';
        $measureData = isset($_REQUEST['measure_data']) ? $_REQUEST['measure_data'] : '';
        $measureDT = isset($_REQUEST['measure_dt']) ? $_REQUEST['measure_dt'] : '';

        $result = DeviceCheckApi::archiveInspectRecord(
            $memberId, $measureId, $repastId, $timeBucketId,
            $paperType, $envTemperature, $measureData, $measureDT);
        $this->ajaxReturn($result);
    }

    /** 新疆迪阿尼性能 -- 上报数据到天翼云 */
    public function reportDataAction()
    {
        $params = array(
            "code" => $_REQUEST['code'],
            "member_id" => $_REQUEST['member_id'],
            "measure_id" => $_REQUEST['measure_id'],
            "repast_id" => $_REQUEST['repast_id'],
            "timebucket_id" => $_REQUEST['bucket_id'],
            "paper_type" => $_REQUEST['paper_type'],
            "env_temperature" => $_REQUEST['env_temperature'],
            "measure_data" => $_REQUEST['measure_data'],
            "measure_dt" => $_REQUEST['measure_dt'],
        );
        $http = new HttpManager(HttpManager::PACK_ID_UPLOAD_CLOUD_DATA);
        $result = json_decode($http->requestPost($params));

        LogUtils::info("DeviceCheck--reportData--result--".json_encode($result));

        $this->ajaxReturn($result);
    }

    /** 新疆迪阿尼性能 -- 上报数据到天翼云 */
    public function reportBatDataAction()
    {
        $params = $_REQUEST['list'];
        $params = json_decode($params,true);
        $http = new HttpManager(HttpManager::PACK_ID_UPLOAD_CLOUD_DATA);
        $result = json_decode($http->requestPost($params));

        LogUtils::info("DeviceCheck--reporBattData--result--".json_encode($result));

        $this->ajaxReturn($result);
    }


    /**
     * 查询所有未归档检测记录列表
     */
    public function getAllUnarchivedRecordListAction()
    {
        $deviceId = isset($_REQUEST['deviceId']) ? $_REQUEST['deviceId'] : DeviceCheckApi::getBindDeviceId();
        $currentPage = isset($_REQUEST['currentPage']) && !empty($_REQUEST['currentPage']) ? $_REQUEST['currentPage'] : 1;
        $pageNum = isset($_REQUEST['pageNum']) && !empty($_REQUEST['pageNum']) ? $_REQUEST['pageNum'] : 6;
        $result = DeviceCheckApi::queryAllUnarchivedRecordList($deviceId, $currentPage, $pageNum);
        $this->ajaxReturn($result);
    }

    /**
     * 查询家庭成员检测记录列表
     */
    public function getMemberArchivedRecordListAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $paperType = isset($_REQUEST['paperType']) ? $_REQUEST['paperType'] : '0';//0：默认查询全部
        $startDT = isset($_REQUEST['startDT']) ? $_REQUEST['startDT'] : '';
        $endDT = isset($_REQUEST['endDT']) ? $_REQUEST['endDT'] : '';
        $currentPage = isset($_REQUEST['currentPage']) && !empty($_REQUEST['currentPage']) ? $_REQUEST['currentPage'] : 1;
        $pageNum = isset($_REQUEST['pageNum']) && !empty($_REQUEST['pageNum']) ? $_REQUEST['pageNum'] : 6;
        $result = DeviceCheckApi::queryMemberInspectRecord($memberId, $paperType, $startDT, $endDT, $currentPage, $pageNum);
        $this->ajaxReturn($result);
    }

    /**
     * 删除一条检测记录
     */
    public function deleteInspectRecordAction()
    {
        $measureId = isset($_REQUEST['measureId']) ? $_REQUEST['measureId'] : '';
        $result = DeviceCheckApi::deleteNotArchiveRecord($measureId);
        $this->ajaxReturn($result);
    }

    /**
     * 查询最新的检测数据（使用场景例如：新疆电信EPG）
     */
    public function getLatestMeasureDataAction()
    {
        $result = DeviceCheckApi::queryLatestMeasureData();
        $this->ajaxReturn($result);
    }

    /**
     * 二维码拉取
     */
    public function getBloodCodeAction()
    {
        $QRCodeType = isset($_REQUEST['QRCodeType']) ? $_REQUEST['QRCodeType'] : '';
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';

        $snCode = isset($_REQUEST['snCode']) ? $_REQUEST['snCode'] : '';
        $deviceName = isset($_REQUEST['deviceName']) ? $_REQUEST['deviceName'] : '';
        $deviceModel = isset($_REQUEST['deviceModel']) ? $_REQUEST['deviceModel'] : '';

        $result = DeviceCheckApi::getBloodCode($QRCodeType, $memberId,$snCode,$deviceName,$deviceModel);
        $this->ajaxReturn($result);
    }

    /**
     * 二维码状态
     */
    public function getBloodCodeStatusAction()
    {
        $scene = isset($_REQUEST['scene']) ? $_REQUEST['scene'] : '';
        $result = DeviceCheckApi::getBloodCodeStatus($scene);
        $this->ajaxReturn($result);
    }

    /**
     * 血压设备绑定
     */
    public function bindBloodDeviceAction()
    {
        $devsn = isset($_REQUEST['devsn']) ? $_REQUEST['devsn'] : '';
        $mobile = isset($_REQUEST['mobile']) ? $_REQUEST['mobile'] : '';
        $paper_type = isset($_REQUEST['paper_type']) ? $_REQUEST['paper_type'] : 0;
        $result = DeviceCheckApi::bindBloodDevice($devsn, $mobile, $paper_type);
        $this->ajaxReturn($result);
    }

    /**
     * 查询绑定的手环成员
     */
    public function queryRememberWristAction()
    {
        $result = DeviceCheckApi::queryRememberWrist();
        $this->ajaxReturn($result);
    }


    /**
     * 查询最新的检测记录
     */
    public function getlastTestMeasureRecordAction()
    {
        $data_type = isset($_REQUEST['data_type']) ? $_REQUEST['data_type'] : 1;
        $timestamp = isset($_REQUEST['timestamp']) ? $_REQUEST['timestamp'] : 1;
        $result = DeviceCheckApi::getlastTestMeasureRecord($data_type, $timestamp);
        $this->ajaxReturn($result);
    }

    /**
     * 查询最新的检测记录
     */
    public function queryBloodDeviceAction()
    {
        $bind_type = isset($_REQUEST['bind_type']) ? $_REQUEST['bind_type'] : 0;
        $paper_type = isset($_REQUEST['paper_type']) ? $_REQUEST['paper_type'] : 0;
        $result = DeviceCheckApi::queryBloodDevice($bind_type, $paper_type);
        $this->ajaxReturn($result);
    }

    /**
     * 更换绑定成员
     */
    public function replaceMemberAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $oldMemberId = isset($_REQUEST['oldMemberId']) ? $_REQUEST['oldMemberId'] : '';
        $deviceId = isset($_REQUEST['deviceId']) ? $_REQUEST['deviceId'] : '';
        $result = DeviceCheckApi::replaceMember($memberId, $oldMemberId, $deviceId);
        $this->ajaxReturn($result);
    }

    /**
     * 手环解绑
     */
    public function removeMemberAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $device_id = isset($_REQUEST['device_id']) ? $_REQUEST['device_id'] : '';
        $result = DeviceCheckApi::removeMember($memberId, $device_id);
        $this->ajaxReturn($result);
    }

    /**
     * 获取最新更新数据
     */
    public function getMemberRecentDataAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $result = DeviceCheckApi::getMemberRecentData($memberId);
        $this->ajaxReturn($result);
    }

    /**
     * 设置目标步数
     */
    public function setGoalStepAction()
    {
        $memberId = isset($_REQUEST['member_id']) ? $_REQUEST['member_id'] : '';
        $device_id = isset($_REQUEST['device_id']) ? $_REQUEST['device_id'] : '';
        $target_steps = isset($_REQUEST['target_steps']) ? $_REQUEST['target_steps'] : '';
        $result = DeviceCheckApi::setGoalStep($memberId, $device_id, $target_steps);
        $this->ajaxReturn($result);
    }

    /**
     * 获取步数列表
     */
    public function getStepListAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $device_id = isset($_REQUEST['device_id']) ? $_REQUEST['device_id'] : '';
        $result = DeviceCheckApi::getStepList($memberId, $device_id);
        $this->ajaxReturn($result);
    }

    /**
     * 获心率列表
     */
    public function getHeartRateListAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $result = DeviceCheckApi::getHeartRateList($memberId);
        $this->ajaxReturn($result);
    }

    /**
     * 获取步数列表
     */
    public function getSportListAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $exercise_type = isset($_REQUEST['exercise_type']) ? $_REQUEST['exercise_type'] : '';
        $result = DeviceCheckApi::getSportList($memberId, $exercise_type);
        $this->ajaxReturn($result);
    }

    /**
     * 获取运动类型
     */
    public function getExerciseTypeListAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $result = DeviceCheckApi::getExerciseTypeList($memberId);
        $this->ajaxReturn($result);
    }

    /**
     * 获取运动详情
     */
    public function getSportDetailAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $measure_id = isset($_REQUEST['measure_id']) ? $_REQUEST['measure_id'] : '';
        $exercise_type = isset($_REQUEST['exercise_type']) ? $_REQUEST['exercise_type'] : '';
        $result = DeviceCheckApi::getSportDetail($memberId, $measure_id, $exercise_type);
        $this->ajaxReturn($result);
    }

    /**
     * 获取睡眠详情
     */
    public function getSleepDetailAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $measure_id = isset($_REQUEST['measure_id']) ? $_REQUEST['measure_id'] : '';
        $result = DeviceCheckApi::getSleepDetail($memberId, $measure_id);
        $this->ajaxReturn($result);
    }


    /**
     * 获取心率详情
     */
    public function getHeartRateDetailAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $dt = isset($_REQUEST['dt']) ? $_REQUEST['dt'] : '';
        $result = DeviceCheckApi::getHeartRateDetail($memberId, $dt);
        $this->ajaxReturn($result);
    }

    /**
     * 获取运动心率详情
     */
    public function getHeartRateSportAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $start_dt = isset($_REQUEST['start_dt']) ? $_REQUEST['start_dt'] : '';
        $end_dt = isset($_REQUEST['end_dt']) ? $_REQUEST['end_dt'] : '';
        $result = DeviceCheckApi::getHeartRateSport($memberId, $start_dt,$end_dt);
        $this->ajaxReturn($result);
    }

    /**
     * 获取步数详情
     */
    public function getStepDetailAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $dt = isset($_REQUEST['dt']) ? $_REQUEST['dt'] : '';
        $result = DeviceCheckApi::getStepDetail($memberId, $dt);
        $this->ajaxReturn($result);
    }

    /**
     * 获取睡眠数据列表
     */
    public function getSleepListAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $result = DeviceCheckApi::getSleepList($memberId);
        $this->ajaxReturn($result);
    }

}