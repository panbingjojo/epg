<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2020/1/7
 * Time: 17:43
 */

namespace Home\Model\Common\ServerAPI;

use Home\Model\Activity\ActivityConstant;
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;

class CommunityHospitalAPI
{

    /**
     * 添加签约成员
     * @param $memberName //成员名称
     * @param $idCard //身份证号
     * @param $phoneNum //电话号码
     * @return mixed
     */
    public static function addUserInfo($memberName, $idCard, $phoneNum)
    {
        $json = array(
            "op_type" => 0,
            "member_id" => 0,
            "member_name" => $memberName,
            "idcard" => $idCard,
            "phone_num" => $phoneNum,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ADD_USER_INFO);
        $result = $httpManager->requestPost($json);
        LogUtils::info("addUserInfo ---> : " . $result);
        return $result;
    }

    /**
     * 查询签约成员
     */
    public static function queryUserList()
    {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_QUERY_USER_LIST);
        $result = $httpManager->requestPost($json);
        LogUtils::info("queryUserList ---> : " . $result);
        return $result;
    }


    /**
     * 添加血压值
     * @param $memberId //成员id
     * @param $highPressure //高压值
     * @param $lowPressure //低压值
     * @return mixed
     */
    public static function addBloodPressure($memberId, $highPressure, $lowPressure)
    {
        $json = array(
            "member_id" => $memberId,
            "high_pressure" => $highPressure,
            "low_pressure" => $lowPressure,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ADD_BLOOD_PRESSURE);
        $result = $httpManager->requestPost($json);
        LogUtils::info("addBloodPressure ---> : " . $result);
        return $result;
    }

    /**
     * 查询血压值
     * @param $memberId //成员id
     * @param $beginDt //起始时间
     * @param $endDt //结束时间
     * @return mixed
     */
    public static function queryBloodPressure($memberId, $beginDt, $endDt)
    {
        $json = array(
            "member_id" => $memberId,
            "begin_dt" => $beginDt,
            "end_dt" => $endDt,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_QUERY_BLOOD_PRESSURE);
        $result = $httpManager->requestPost($json);
        LogUtils::info("queryBloodPressure ---> : " . $result);
        return $result;
    }

}