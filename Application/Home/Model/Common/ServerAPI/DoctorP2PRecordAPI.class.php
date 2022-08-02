<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  |                                                                        
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2018/3/15 11:17                                                |
  +----------------------------------------------------------------------+ 
 */


namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Inquiry\InquiryManager;

class DoctorP2PRecordAPI
{
    /**
     * 获取带有问诊记录信息的家庭成员信息
     * @return mixed
     */
    public static function getMemberDataWithInquiry()
    {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_MEMBER_INFO);
        $result = $httpManager->requestPost($json);
        return json_decode($result, true);
    }


    /**
     * 查询未归档的问诊记录
     */
    public static function getNotArchiveRecord($pageCurrent)
    {
        $json = array(
            "current_page" => $pageCurrent,
            "page_num" => 1
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_NO_ACHIVE_INQUIRY_RECORD);
        $result = $httpManager->requestPost($json);
        return json_decode($result, true);
    }

    /**
     *  获取家庭成员问诊信息
     * @param $memberID string 家庭成员ID
     * @param $pageCurrent integer 当前页码
     * @param $pageNum integer 页数
     * @return mixed
     */
    public static function getInquiryRecord($memberID, $pageCurrent, $pageNum)
    {
        $json = array(
            "member_id" => $memberID,
            "current_page" => $pageCurrent,
            "page_num" => isset($pageNum) ? $pageNum : 1
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_RECORD);
        return $httpManager->requestPost($json);
    }
    public static function getInquiryTimes($memberID, $pageCurrent, $pageNum)
    {
        $json = array(
            "member_id" => $memberID,
            "current_page" => $pageCurrent,
            "page_num" => isset($pageNum) ? $pageNum : 1
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_Times);
        $result = $httpManager->requestPost($json);
        return json_decode($result, true);
    }

    public static function getInquiryTimesNew($durationFlag)
    {
        $json = array(
            "duration_flag" => $durationFlag,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_Times);
        return $httpManager->requestPost($json);
    }

    //获取待归档的总条数
    public static function getWaitArchiveCount()
    {
        $json = array(
            "member_id" => -1,
            "current_page" => 1,
            "page_num" => 99999999
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_RECORD);
        $result = $httpManager->requestPost($json);
        $resultArr = json_decode($result, true);
        return $resultArr["count"];
    }


    /**
     * 获取39互联网医院的问诊记录信息
     * @param $inquiryID 问诊记录ID
     * @return mixed
     * @throws \Think\Exception
     */
    public static function get39InquiryRecord($inquiryID, $inquiryUserID)
    {
        $arr = array(
            "inquiryId" => $inquiryID,
            "userId" => $inquiryUserID
        );
        $res = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_INQUIRY_RECORD_INFO, json_encode($arr));
        return json_decode($res, true);
    }

    /**
     * 获取所有家庭成员问诊记录
     * @param $currentPage //当前页面
     * @param $pageNum //每页显示多少数据
     * @param $memberID //家庭成员id
     * @return mixed
     */
    public static function getAllRecordInfo($currentPage, $pageNum, $memberID)
    {

        $json = array(
            "member_id" => $memberID,
            "current_page" => $currentPage,
            "page_num" => $pageNum
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_RECORD);
        $result = $httpManager->requestPost($json);
        return json_decode($result, true);
    }

    /**
     * 删除家庭成员问诊记录
     * @param $userId
     * @param $memberId
     * @param $inquiryId
     * @return mixed
     */
    public static function deleteRecord($userId, $memberId, $inquiryId)
    {
        $json = array(
            "user_id" => $userId,
            "member_id" => $memberId,
            "inquiry_id" => $inquiryId
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_DELETE_MEMBER_INQUIRY_RECORD);
        $result = $httpManager->requestPost($json);
        return json_decode($result, true);
    }

    /**
     * 删除单条问诊记录（不论是否归档）注意：目前这个接口只传一个参数
     * @param $inquiryId
     * @return mixed
     */
    public static function deleteInquiryRecord($inquiryId)
    {
        $json = array(
            "inquiry_id" => $inquiryId
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_DELETE_MEMBER_INQUIRY_RECORD);
        $result = $httpManager->requestPost($json);
        return json_decode($result, true);
    }

    /**
     * 获取医生详细信息
     * @param $docID
     * @return mixed
     * @throws \Think\Exception
     */
    public static function getDoctorDetail($docID)
    {
        $arr = array(
            "doctorId" => $docID,
            "area_code" => MasterManager::getAreaCode(),
        );
        $res = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_DOCTOR_DETAIL_INFO, json_encode($arr));
        return json_decode($res, true);
    }


    /**
     * 将问诊记录归档到指定家庭成员中
     * @param $memberID 家庭成员ID
     * @param $inquiryID 问诊记录ID
     * @return mixed
     */
    public static function archiveRecordToMember($memberID, $inquiryID)
    {
        $json = array(
            "member_id" => $memberID,
            "inquiry_id" => $inquiryID
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_SET_ACHIVE_INQUIRY_RECORD);
        $result = $httpManager->requestPost($json);
        return json_decode($result, true);
    }

    /**
     * @brief 查询可免费问诊的次数
     * @return mixed {"result":0, "remain_count":2, "total_count":3} 0--表示成功, -101--表示没有配
     * 通过carrier_id、user_id来查询得出可以免费问诊次数，判断用户已经使用了几次，还剩下几次。
     */
    public static function getFreeInquiryTimes()
    {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_FREE_TIME);
        $result = $httpManager->requestPost($json);
        return json_decode($result, true);
    }


}