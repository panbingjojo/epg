<?php

/**
 * 健康检测
 */

namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\HttpManager;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;

class MeasureAPI
{
    const ERROR_REQ = -999; //请求失败错误码

    /**
     * 绑定健康检测仪
     */
    public static function bindDevice($deviceMac)
    {
        $json = array(
            "dev_mac_addr" => $deviceMac,
        );
        // 保存拉雅设备id
        MasterManager::setLYDeviceId($deviceMac);

        $httpManager = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_BIND_DEVICE_ID);
        $result = $httpManager->requestPost($json);
        return json_decode($result);
    }

    /**
     * 设置推送id
     */
    public static function setPushId($pushId)
    {
        $json = array(
            "push_id" => $pushId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_SET_PUSH_MSG);
        $result = $httpManager->requestPost($json);
        return json_decode($result);
    }

    /**
     * 拉取时段和就餐状态配置
     *
     * @return mixed
     */
    public static function getDiffMomentConfig()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_GET_DIFF_MOMENT_CONFIG);
        $result = $http->requestPost($json);
        return json_decode($result);
    }

    /**
     * 归档检测记录
     * @param string $memberId //家庭成员id
     * @param string $measureId //测量数据id
     * @param string $repastId //检测状态id
     * @param string $timeBucketId //检测时间段
     * @param int $paperType //测量试纸类型（1-血糖 2-胆固醇 3-甘油三脂 4-尿酸）
     * @param string $envTemperature //测量时的环境温度
     * @param string $measureData //测量数据值
     * @param string $measureDT //测量时间 (数据类型：datatime，例如 "2017-02-13 13:51:12")
     * @return array|mixed result[0:成功, -1:session校验失败, -2:失败, -999:请求失败]
     */
    public static function archiveInspectRecord($memberId, $measureId, $repastId, $timeBucketId,
                                                $paperType, $envTemperature, $measureData, $measureDT)
    {
        $json = array(
            "member_id" => $memberId,
            "measure_id" => $measureId,
            "repast_id" => $repastId,
            "timebucket_id" => $timeBucketId,
            "paper_type" => $paperType,
            "env_temperature" => $envTemperature,
            "measure_data" => $measureData,
            "measure_dt" => $measureDT,
        );
        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_ARCHIVE_INSPECT_RECORD);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    /**
     * 删除未归档记录
     *
     * @param string $measureId //测量id
     * @return mixed result[0:成功，-999:请求失败]
     */
    public static function deleteNotArchiveRecord($measureId)
    {
        $json = array(
            "measure_id" => $measureId,
        );


        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_DELETE_NOT_ARCHIVE_RECORD);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    /**
     * 查询有检测记录的家庭成员
     *
     * @return mixed
     */
    public static function queryMembersWithRecord()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_QUERY_MEMBERS_WITH_INSPECT_RECORD);
        $result = $http->requestPost($json);
        return json_decode($result);
    }

    /**
     * 查询家庭成员检测记录
     *
     * @param string $memberId //家庭成员id
     * @param int $paperType //测量试纸类型（1-血糖 2-胆固醇 3-甘油三脂 4-尿酸）0：默认查询全部
     * @param string $startDT //开始时间 (数据类型：datatime，例如 "2017-02-13 13:51:12")
     * @param string $endDT //结束时间 (数据类型：datatime，例如 "2017-02-13 13:51:12")
     * @param int $currentPage //当前页
     * @param int $pageNum //每页条数
     * @return array|mixed result[0:成功, -1:session校验失败, -2:失败, -999:请求失败]
     */
    public static function queryMemberInspectRecord($memberId, $paperType = 0, $startDT = "", $endDT = "", $currentPage = 1, $pageNum = 6)
    {
        $json = array(
            "member_id" => $memberId,
            "paper_type" => $paperType,
            "start_dt" => $startDT,
            "end_dt" => $endDT,
            "current_page" => $currentPage,
            "page_num" => $pageNum,
        );


        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_QUERY_MEMBER_INSPECT_RECORD);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
     * 查询未归档检测记录列表
     *
     * @param string $bindDeviceId //绑定的唯一设备id
     * @param int $currentPage //当前页
     * @param int $pageNum //每页条数
     * @return array|mixed result[0:成功, -1:session校验失败, -2:失败, -999:请求失败]
     */
    public static function queryAllUnarchivedRecordList($bindDeviceId, $currentPage, $pageNum = 6)
    {
        $json = array(
            "dev_mac_addr" => $bindDeviceId,
            "current_page" => $currentPage,
            "page_num" => $pageNum,
        );


        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_QUERY_NOT_ARCHIVE_RECORD);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
     * 查询最新的检测记录（轮询）
     * @return mixed
     */
    public static function queryLatestMeasureRecord()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_QUERY_LATEST_MEASURE_RECORD);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
     * 删除已归档数据
     * @param $memberId
     * @param $measureId
     *  * @param $deviceType
     * @return array|mixed
     */
    public static function deleteArchiveRecord($memberId, $measureId, $deviceType)
    {
        $json = array(
            "member_id" => $memberId,
            "measure_id" => $measureId,
            "paper_type" => $deviceType,
        );


        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_DELETE_ARCHIVE_RECORD);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }


    /**
     * 获取已归档体脂数据
     * @param $memberId
     * @param $measureId
     *  * @param $deviceType
     * @param $weight
     * @return array|mixed
     * @param $resistance
     */
    public static function getBodyFat($memberId, $measureId, $deviceType,$weight,$resistance)
    {

        $json = array(
            "member_id" => $memberId,
            "measure_id" => $measureId,
            "paper_type" => $deviceType,
            "weight" => $weight,
            "resistance" =>$resistance
        );

        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_GET_BODY_FAT);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    /**
     *查询未归档疾病问医及检测记录条数
     * @return mixed
     */
    public static function queryRecordCnt(){
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_QUERY_RECORD_COUNT);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
     * 修改检测信息已读状态
     * @param $memberId
     * @param $type
     * @param $paperType
     * @return object
     */
    public static function updateReadStatus($memberId, $type, $paperType){
        $json = array(
            "member_id" => $memberId,
            "type" => $type,
            "paper_type" => $paperType,
        );

        $http = new HttpManager(HttpManager::PACK_ID_UPDATE_READ_STATUS);
        $result = $http->requestPost($json);

        return json_decode($result);
    }
}