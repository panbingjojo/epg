<?php

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\MeasureAPI;
use Home\Model\Entry\MasterManager;

class MeasureAPIController extends BaseController
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
     * 绑定健康检测仪
     */
    public function bindDeviceAction()
    {
        $dev_mac_addr = $_REQUEST['dev_mac_addr'];
        $resultData = MeasureAPI::bindDevice($dev_mac_addr);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 设置推送id
     */
    public function setPushIdAction()
    {
        $ret = json_encode(array(
            "result" => -1,
            "msg" => "无法获取推送id"
        ));
        $pushId = MasterManager::getUserId();
        if (!isset($pushId)) {
            $this->ajaxReturn($ret);
        } else {
            $resultData = MeasureAPI::setPushId($pushId);
            $this->ajaxReturn(json_encode($resultData));
        }
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

        $result = MeasureAPI::archiveInspectRecord(
            $memberId, $measureId, $repastId, $timeBucketId,
            $paperType, $envTemperature, $measureData, $measureDT);
        $this->ajaxReturn($result);
    }

    /**
     * 删除一条检测记录
     */
    public function deleteInspectRecordAction()
    {
        $measureId = isset($_REQUEST['measureId']) ? $_REQUEST['measureId'] : '';
        $result = MeasureAPI::deleteNotArchiveRecord($measureId);
        $this->ajaxReturn($result);
    }

    /**
     * 查询家庭成员检测记录
     */
    public function queryMemberInspectRecordAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $paperType = isset($_REQUEST['paperType']) ? $_REQUEST['paperType'] : '';
        $result = MeasureAPI::queryMemberInspectRecord($memberId, $paperType, "", "", 1, PHP_INT_MAX);
        $this->ajaxReturn($result);
    }

    /**
     * 查询最新的检测记录（轮询）
     */
    public function queryLatestMeasureRecordAction()
    {
        $result = MeasureAPI::queryLatestMeasureRecord();
        $this->ajaxReturn($result);
    }

    /**
     * 查询未归档检测记录列表
     */
    public function queryUnarchivedRecordListAction()
    {
        $pageCurrent = isset($_REQUEST['page_current']) ? $_REQUEST['page_current'] : '';
        $pageNum = isset($_REQUEST['page_num']) ? $_REQUEST['page_num'] : '';

        $bindDeviceId = MasterManager::getLYDeviceId();
        $result = MeasureAPI::queryAllUnarchivedRecordList($bindDeviceId, $pageCurrent, $pageNum);
        $this->ajaxReturn($result);
    }

    /**
     * 删除一条已归档记录
     */
    public function deleteArchiveRecordAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $measureId = isset($_REQUEST['measureId']) ? $_REQUEST['measureId'] : '';
        $deviceType = isset($_REQUEST['deviceType']) ? $_REQUEST['deviceType'] : '';
        $result = MeasureAPI::deleteArchiveRecord($memberId, $measureId, $deviceType);
        $this->ajaxReturn($result);
    }

    /**
     * 获取已归档体脂数据
     */
    public function getBodyFatAction()
    {
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $measureId = isset($_REQUEST['measureId']) ? $_REQUEST['measureId'] : '';
        $deviceType = isset($_REQUEST['deviceType']) ? $_REQUEST['deviceType'] : '';
        $weight = isset($_REQUEST['weight']) ? $_REQUEST['weight'] : '';
        $resistance = isset($_REQUEST['resistance']) ? $_REQUEST['resistance'] : '';
        $result = MeasureAPI::getBodyFat($memberId, $measureId, $deviceType,$weight,$resistance);
        $this->ajaxReturn($result);
    }

    /**
     *查询未归档疾病问医及检测记录条数
     */
    public function queryRecordCntAction(){
        $result = MeasureAPI::queryRecordCnt();
        $this->ajaxReturn($result);
    }

    /**
     *改变记录数据为已读状态
     */
    public function updateReadStatusAction(){
        $memberId = isset($_REQUEST['memberId']) ? $_REQUEST['memberId'] : '';
        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : '';
        $paperType= isset($_REQUEST['paperType']) ? $_REQUEST['paperType'] : '';

        $result = MeasureAPI::updateReadStatus($memberId, $type, $paperType);
        $this->ajaxReturn($result);
    }
}
