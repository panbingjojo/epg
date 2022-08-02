<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/2/13
 * Time: 14:01
 */

namespace Home\Model\Common\ServerAPI;

use Home\Model\ControlUnit\ControlUnitManager;
use Home\Model\Entry\MasterManager;

class ControlUnitAPI
{
    /**
     * 发起问诊
     * @param $userID 用户ID
     * @param $phone 电话
     * @param $isVip 是否为vip
     * @param $docID 医生ID
     * @param $userName 用户名
     * @param $areaCode 地区码
     * @param $platformName 平台名称
     * @param $inquiryID 问诊ID，转诊时用
     * @param $entry 入口
     * @param $age 年龄
     * @param $gender 性别
     * @return mixed
     * @throws \Think\Exception
     */
    public static function startInquiry($userID, $phone, $isVip, $docID, $userName, $areaCode, $platformName, $inquiryID, $entry, $age, $gender)
    {
        $arr = array(
            "userid" => $userID,
            "phone" => $phone,
            "isvip" => $isVip,
            "docid" => $docID,
            "username" => $userName,
            "platformname" => $platformName,
            "inquiryid" => $inquiryID,
            "entry" => $entry,
            "age" => $age,
            "gender" => $gender,
            "areacode" => $areaCode,
            "carrierid" => MasterManager::getCarrierId()
        );
        $res = ControlUnitManager::queryControlUnit(ControlUnitManager::FUNC_START_PHONE_INQUIRY, json_encode($arr));
        return json_decode($res, true);
    }

    /**
     * 结束问诊
     * @param $userID 用户ID
     * @param $phone 电话
     * @return mixed
     * @throws \Think\Exception
     */
    public static function finishInquiry($userID, $phone)
    {
        $arr = array(
            "userid" => $userID,
            "phone" => $phone
        );
        $res = ControlUnitManager::queryControlUnit(ControlUnitManager::FUNC_FINISH_PHONE_INQUIRY, json_encode($arr));
        return json_decode($res, true);
    }

    /**
     * 查询问诊状态信息
     * @param $userID 用户ID
     * @param $phone 电话
     * @return mixed
     * @throws \Think\Exception
     */
    public static function queryInquiryInfo($userID, $phone)
    {
        $arr = array(
            "userid" => $userID,
            "phone" => $phone
        );
        $res = ControlUnitManager::queryControlUnit(ControlUnitManager::FUNC_QUERY_INQUIRY_INFO, json_encode($arr));
        return json_decode($res, true);
    }
}