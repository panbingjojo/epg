<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [设备检查 -> 健康检测] 模块API
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/01/17 16:50
// +----------------------------------------------------------------------


namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;

class DeviceCheckApi
{

    const ERROR_REQ = -999; //请求失败错误码

    /**
     * 获取用户绑定设备的唯一地址id。e.g. {"result":0,"dev_mac_addr":"accf23edb724"}
     *
     * @param null $packHeader
     * @return string 返回唯一id客串，例如："accf23edb724"
     */
    public static function getBindDeviceId($packHeader = null)
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_GET_BIND_MAC_ADDR);
        if ($packHeader != null) {
            $http->setUserId($packHeader->lm_userId);
            $http->setSessionId($packHeader->lm_sessionId);
            $http->setLoginId($packHeader->lm_loginId);
        }
        $result = json_decode($http->requestPost($json), true);

        // 数据加强处理
        if (null == $result) {
            $result = array(
                'result' => -1,
                'dev_mac_addr' => ''
            );
        }
        $deviceId = $result["dev_mac_addr"];
        return $deviceId;
    }

    /**
     * 用户绑定设备
     *
     * @param string $macAddr //要绑定的设备mac地址字符串。例如：accf23edb724
     * @param null $packHeader
     * @return array|mixed result[0:成功，-101:设备地址不正确，-1:session校验失败，-999:请求失败]
     */
    public static function bindDeviceId($macAddr = "", $packHeader = null)
    {
        $json = array(
            'dev_mac_addr' => $macAddr
        );


        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_BIND_DEVICE_ID);
        if ($packHeader != null) {
            $http->setUserId($packHeader->lm_userId);
            $http->setSessionId($packHeader->lm_sessionId);
            $http->setLoginId($packHeader->lm_loginId);
        }

        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ // 请求失败
            );
        }

        return $result;
    }

    /**
     * 设置消息推送id，用于健康检测监听server向client推送数据。
     *
     * @param string $pushId //推送id字符串，该id用于服务器向用户推送数据的id号
     * @param null $packHeader
     * @return array|mixed result[0:设置成功, -1:session校验失败, -2:失败, -100参数错误, -999:请求失败]
     */
    public static function setPushId($pushId = "", $packHeader = null)
    {
        $json = array(
            "push_id" => $pushId
        );

        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_SET_PUSH_MSG);
        if ($packHeader != null) {
            $http->setUserId($packHeader->lm_userId);
            $http->setSessionId($packHeader->lm_sessionId);
            $http->setLoginId($packHeader->lm_loginId);
        }
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ // 请求失败
            );
        }

        return $result;
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
        $result = json_decode($http->requestPost($json));

        if (null != $result && $result->result == 0 && is_array($result->list)) {
            $memberList = $result->list;
        } else {
            $memberList = array();
        }

        return $memberList;
    }

    /**
     * 查询最新的检测数据（使用场景例如：新疆电信EPG）。
     * <pre>
     *      注意：调用该接口会返回时间最新（例如：时间栈顶元素）的检测数据，同时把所有其它非历史栈顶的检测数据状态变更了，
     * 以防止下次还能拉到。
     *      故，为避免首次调用该接口时会拉取到历史的数据时，前端应该取服务器时间来和检测数据的时间做判断对比！（请根据
     * 实际需求！）
     * </pre>
     *
     * <pre>返回示例：
     *  {
     *      "result":0,
     *      "data":[{
     *          "dev_mac_addr":"865473037826941",
     *          "dev_status":"-1"
     *          "measure_id": "201901181025051529164820918",
     *          "extra_data1":1, //paper_type
     *          "extra_data2":12.16,//measure_data
     *          "measure_dt":"2017-07-02 12:00:00"
     *      }]
     *  }
     * </pre>
     *
     * @return mixed result[0:成功，-999:请求失败，其他：失败]
     */
    public static function queryLatestMeasureData()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_QUERY_LATEST_MEASURE_RECORD);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function getBloodCodeStatus($scene)
    {
        $json = array(
            "scene" => $scene,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GET_BLOOD_CODE_STATUS);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    //绑定血压设备
    public static function bindBloodDevice($devsn, $mobile, $paper_type)
    {
        $json = array(
            "devsn" => $devsn,
            "mobile" => $mobile,
            "paper_type" => $paper_type
        );
        $http = new HttpManager(HttpManager::PACK_GET_BIND_BLOOD_DEVICE);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }


    //查询绑定的手环成员
    public static function queryRememberWrist()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_QUERY_REMEMBER_WRIST);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function getlastTestMeasureRecord($data_type, $timestamp)
    {
        $json = array(
            "data_type" => $data_type,
            "timestamp" => $timestamp
        );
        $http = new HttpManager(HttpManager::PACK_GET_LAST_TEST_MEASURE_RECORD);
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
     * 查询設備號
     *
     * @return mixed
     * @return $paper_type
     */
    public static function queryBloodDevice($bind_type, $paper_type)
    {
        $json = array(
            "bind_type" => $bind_type,
            "paper_type" => $paper_type
        );
        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_GET_BIND_MAC_ADDR);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function getBloodCode($QRCodeType, $memberId,$snCode,$deviceName,$deviceModel)
    {
        $json = array(
            "QRCodeType" => $QRCodeType,
            "member_id" => $memberId,
            'snCode'=>$snCode,
            'deviceName'=>$deviceName,
            'deviceModel'=>$deviceModel
        );
        $http = new HttpManager(HttpManager::PACK_ID_GET_BLOOD_CODE);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function replaceMember($memberId, $oldMemberId, $deviceId)
    {
        $json = array(
            "member_id" => $memberId,
            "old_member_id" => $oldMemberId,
            "device_id" => $deviceId
        );
        $http = new HttpManager(HttpManager::PACK_REPLACE_MEMBER_WRIST);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function removeMember($memberId, $device_id)
    {
        $json = array(
            "member_id" => $memberId,
            "device_id" => $device_id,
        );
        $http = new HttpManager(HttpManager::PACK_REMOVE_MEMBER_WRIST);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function getMemberRecentData($memberId)
    {
        $json = array(
            "member_id" => $memberId,
        );
        $http = new HttpManager(HttpManager::PACK_GET_RECENT_DATA);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function setGoalStep($memberId, $device_id, $target_steps)
    {
        $json = array(
            "member_id" => $memberId,
            "device_id" => $device_id,
            "target_steps" => $target_steps,
        );
        $http = new HttpManager(HttpManager::PACK_SET_GOAL_STEP_WRIST);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function getStepList($memberId, $device_id)
    {
        $json = array(
            "member_id" => $memberId,
            "device_id" => $device_id,
        );
        $http = new HttpManager(HttpManager::PACK_GET_STEP_LIST_WRIST);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function getHeartRateList($memberId)
    {
        $json = array(
            "member_id" => $memberId,
        );
        $http = new HttpManager(HttpManager::PACK_GET_HEART_RATE_LIST);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function getSportList($memberId, $exercise_type)
    {
        $json = array(
            "member_id" => $memberId,
            "exercise_type" => $exercise_type,
        );
        $http = new HttpManager(HttpManager::PACK_GET_SPORT_LIST);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function getExerciseTypeList($memberId)
    {
        $json = array(
            "member_id" => $memberId,
        );
        $http = new HttpManager(HttpManager::PACK_GET_EXERCISE_TYPE_LIST);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }

    public static function getSleepList($memberId)
    {
        $json = array(
            "member_id" => $memberId,
        );
        $http = new HttpManager(HttpManager::PACK_GET_SLEEP_LIST);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }


    public static function getSportDetail($memberId, $measure_id, $exercise_type)
    {
        $json = array(
            "member_id" => $memberId,
            "measure_id" => $measure_id,
            "exercise_type" => $exercise_type,
        );
        $http = new HttpManager(HttpManager::PACK_GET_SPORT_DETAIL);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }
    public static function getSleepDetail($memberId, $measure_id)
    {
        $json = array(
            "member_id" => $memberId,
            "measure_id" => $measure_id,
        );
        $http = new HttpManager(HttpManager::PACK_GET_SLEEP_DETAIL);
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
     * 获取心率详情
     */
    public static function getHeartRateDetail($memberId, $dt)
    {
        $json = array(
            "member_id" => $memberId,
            "dt" => $dt,
        );
        $http = new HttpManager(HttpManager::PACK_GET_HEART_RATE_DETAIL);
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
     * 获取心率详情
     */
    public static function getStepDetail($memberId, $dt)
    {
        $json = array(
            "member_id" => $memberId,
            "insert_dt" => $dt,
        );
        $http = new HttpManager(HttpManager::PACK_GET_STEP_DETAIL);
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
     * 获取心率详情
     */
    public static function getHeartRateSport($memberId, $start_dt,$end_dt)
    {
        $json = array(
            "member_id" => $memberId,
            "start_dt" => $start_dt,
            "end_dt" => $end_dt,
        );
        $http = new HttpManager(HttpManager::PACK_GET_HEART_RATE_SPORT);
        $result = json_decode($http->requestPost($json));

        // 数据加强处理
        if (null == $result) {
            $result = array(
                "result" => self::ERROR_REQ
            );
        }
        return $result;
    }
}