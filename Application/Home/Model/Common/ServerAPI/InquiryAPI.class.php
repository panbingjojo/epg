<?php
/**
 * 此API接口用于向cws-hlwyy模块拉取互联网医院的信息以及向cws服务器请求数据
 * Date: 2018-03-06
 * Time: 15:10
 */

namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class InquiryAPI
{
    /**
     * @brief 向服务器获取userId
     * @param $url string 请求url
     * @return mixed
     */
    public static function getUserId($url)
    {
        LogUtils::info("query getUserId url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 向服务器获取互联网医院科室列表
     * @param $url string 请求url
     * @return mixed
     */
    public static function getDepartMentList($url)
    {
        LogUtils::info("query getDepartMentList url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 向服务器获取互联网医院医生列表
     * @param $url string 请求url
     * @return mixed
     */
    public static function getDoctorsList($url)
    {
        LogUtils::info("query getDoctorsList url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 向服务器获取助理医生信息
     * @param $url string 请求url
     * @return mixed
     */
    public static function getAssistantDoctor($url)
    {
        LogUtils::info("query getAssistantDoctor url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 向服务器获取咨询医生信息
     * @param $url string 请求url
     * @return mixed
     */
    public static function getAdvisoryDoctor($url)
    {
        LogUtils::info("query getAdvisoryDoctor url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 向服务器查询医生的在线状态
     * @param $url string 请求url
     * @return mixed
     */
    public static function getDoctorOnlineState($url)
    {
        LogUtils::info("query getDoctorOnlineState url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 向服务器获取医生头像信息
     * @param $url string 请求url
     * @return mixed
     */
    public static function getDoctorHeadImage($url)
    {
        LogUtils::info("query getDoctorHeadImage url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 向服务器查询用户的问诊记录
     * @param $url string 请求url
     * @return mixed
     */
    public static function getInquiryRecordInfo($url)
    {
        LogUtils::info("query getInquiryRecordInfo url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 向服务器推送问诊评分
     * @param $url string 请求url
     * @return mixed
     */
    public static function setDoctorScore($url)
    {
        LogUtils::info("query getInquiryRecordInfo url:" . $url);
        return HttpManager::httpRequest("POST", $url, null);
    }

    /**
     * 电话问诊校验
     * @param $phone   绑定电话
     * @param $sendSms 电话未绑定是否下发短信，1-下发，0-不下发
     * @return mixed
     */
    public static function verifyPhoneNumber($phone, $sendSms){
        $json = array(
            "area_code" => !empty(MasterManager::getAreaCode()) ? MasterManager::getAreaCode() : "" ,
            "sub_area_code" => !empty(MasterManager::getSubAreaCode()) ? MasterManager::getSubAreaCode() : "",
            "dev_mac_addr" => !empty(MasterManager::getAccountId()) ? MasterManager::getAccountId() : "",
            "user_tel" => $phone,
            "send_sms" => $sendSms == 1 ? $sendSms : 0,
        );

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_PHONE_NUMBER_VERIFY);
        $result = $http->requestPost($json);
        return json_decode($result);
    }

    /**
     * @brief 增加或修改家庭成员信息，添加成员时，member_id=0，成功后返回成员ID；
     * @param $memberId 成员ID
     * @param $memberName 成员名字
     * @param $memberAge 成员年龄
     * @param $memberGender 成员性别
     * @param $memberWeight 成员体重
     * @param $memberHeight 成员身高
     * @param $memberImageId 成员头像id
     * @return mixed {"result":0", "member_id":6} result: 0成功 -1 session校验失败 -2 失败 -101 人数达到上限
     *
     */
    static public function addModifyMember($memberId, $memberName, $memberAge, $memberGender, $memberWeight, $memberHeight, $memberImageId)
    {

        $json = array(
            "member_id" => $memberId,
            "member_name" => $memberName,
            "member_age" => $memberAge,
            "member_gender" => $memberGender,
            "member_weight" => $memberWeight,
            "member_height" => $memberHeight,
            "member_image_id" => $memberImageId,
        );

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_ADD_MODIFY_MEMBER);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * @brief 删除家庭成员
     * @param $memberId 成员ID
     * @return mixed result: 0成功 -1 session校验失败 -2 失败
     */
    static public function deleteMember($memberId)
    {

        $json = array(
            "member_id" => $memberId,
        );

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_DELETE_MEMBER);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * @brief 查询家庭成员用户信息
     * @param $memberId 成员ID
     * @return mixed
     */
    static public function queryMember($memberId)
    {

        $json = array(
            "member_id" => $memberId,
        );

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_MEMBER);
        $result = $http->requestPost($json);

        return $result;
    }


    /**
     * @brief 添加家庭成员问诊记录信息
     * @param $doctorId 医生id
     * @param $doctorName 医生名称
     * @param $doctorImageUrl 医生头像URL
     * @param $netHospUserId 用户对应互联网医生的ID
     * @param $inquiryId 问诊id
     * @param $userId 用户ID
     * @param $memberId 成员id
     * @param $memberName 成员名称
     * @param $inquiryType 问诊类型（0--开始，1--结束）
     * @param $entryType 0 首页推荐 1视频问诊功能模块 2退出挽留页 3问诊记录
     * @param $deptId 科室id
     * @param $callbackPhoneNum 呼叫电话
     * @param $waitTime 等待时长
     * @param $callResult 呼叫结果
     * @param $netHospInquiryId 医院问诊ID
     * @param $hospital 医院名称
     * @return mixed
     */
    static public function addMemberInquiryRecord($doctorId, $doctorName, $doctorImageUrl, $netHospUserId, $inquiryId,
                                $userId, $memberId, $memberName, $inquiryType, $entryType, $deptId, $callbackPhoneNum,
                                                  $waitTime, $callResult, $netHospInquiryId, $hospital)
    {
        $isVip = MasterManager::getUserIsVip();
        $json = array(
            "doctor_id" => $doctorId,
            "doctor_name" => $doctorName,
            "doctor_image_url" => $doctorImageUrl,
            "nethosp_user_id" => $netHospUserId,
            "inquiry_id" => $inquiryId,
            "user_id" => $userId,
            "member_id" => $memberId,
            "member_name" => $memberName,
            "inquiry_type" => $inquiryType,
            "entry_type" => $entryType,
            "is_order_vip" => $isVip,
            "dept_id" => $deptId,
            "callback_phone_num" => $callbackPhoneNum,
            "wait_time" => $waitTime,
            "call_result" => $callResult,
            "nethosp_inquiry_id" => $netHospInquiryId,
            "doctor_hosp_name" => $hospital,
        );

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> json_param: ' . json_encode($json));

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_ADD_INQUIRY_RECORD);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * @brief 查询家庭成员问诊记录信息
     * @param $userId 用户ID
     * @param $memberId 成员id 当member_id为-1时，查询全部成员的问诊记录
     * @param $type 查询周期类型 0--一周之内，1--一个月之内，2--三个月之内
     * @param $page 当前第几页
     * @param $count 查询当前页的条数
     * @return mixed result:0表示查询成功、-2 数据库异常、-101表示查询失败（没有数据）  -102 输入参数有误
     */
    static public function queryMemberInquiryRecord($userId, $memberId, $type, $page, $count)
    {
        $json = array(
            "user_id" => $userId,
            "member_id" => $memberId,
            "type" => $type,
            "current_page" => $page,
            "page_num" => $count,
        );

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_MEMBER_INQUIRY_RECORD);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * @brief 删除家庭成员问诊记录信息
     * @param $userId 用户ID
     * @param $memberId 成员id
     * @param $inquiryId 问诊id
     * @return mixed result:0:删除成功、-2：服务器异常、-101：删除失败
     */
    static public function deleteMemberInquiryRecord($userId, $memberId, $inquiryId)
    {
        $json = array(
            "user_id" => $userId,
            "member_id" => $memberId,
            "inquiry_id" => $inquiryId,
        );

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_DELETE_MEMBER_INQUIRY_RECORD);
        $result = $http->requestPost($json);

        return $result;
    }


    /**
     * @brief 查询家庭成员问诊记录（有哪些成员进行问诊）
     * @return mixed {"result":0,"count":3,"list":[{},{},{}]} 0表示查询成功，-2 数据库异常, -101:不是vip，不能看
     * 根据用户user_id，来查询名下的家庭成员视频问诊情况，把参加视频问诊的成员按最近问诊时来排序，并附带最近一条的信息。
     * 联合家庭成员表查询，把成员昵称也一起返回。
     */
    static public function queryHadInquiryMembers()
    {
        $json = array(

        );

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_MEMBER_INFO);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * @brief 查询未归档的问诊记录信息
     * @param $page 当前第几页
     * @param $count 查询当前页的条数
     * @return mixed
     */
    static public function queryNoAchiveInquiryRecord($page, $count)
    {
        $json = array(
            "current_page" => $page,
            "page_num" => $count,
        );

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_NO_ACHIVE_INQUIRY_RECORD);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * @brief 设置归档问诊记录
     * @param $memberId 成员id
     * @param $inquiryId 问诊id
     * @return mixed 0成功，其他 失败
     */
    static public function setAchiveInquiryRecord($memberId, $inquiryId)
    {
        $json = array(
            "member_id" => $memberId,
            "inquiry_id" => $inquiryId,
        );

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_SET_ACHIVE_INQUIRY_RECORD);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * @brief 向服务器发送开始问诊请求
     * @param $url string 请求url
     * @return mixed
     */
    public static function startInquiry($url)
    {
        LogUtils::info("query startInquiry url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 向服务器发送结束问诊请求
     * @param $url string 请求url
     * @return mixed
     */
    public static function finishInquiry($url)
    {
        LogUtils::info("query stopInquiry url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 向服务器查询问诊状态
     * @param $url string 请求url
     * @return mixed
     */
    public static function queryInquiryInfo($url)
    {
        LogUtils::info("query quiryInquiryState url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 获取医院列表
     * @param $url string 请求url
     * @return mixed
     */
    public static function getHospitalList($url)
    {
        LogUtils::info("query getHospitalList url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }

    /**
     * @brief 通过医院ID来获取医生列表
     * @param $url string 请求url
     * @return mixed
     */
    public static function getDoctorListByHospId($url)
    {
        LogUtils::info("query getDoctorListByHospId url:" . $url);
        return HttpManager::httpRequest("GET", $url, null);
    }
}