<?php

namespace Home\Model\Inquiry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\InquiryAPI;
use Home\Model\Entry\MasterManager;
use Think\Exception;
/**
 * 该管理类用于对访问cws-hlwyy的HlwyyAPI类进行管理
 * Date: 2018-03-06
 * Time: 15:11
 */
class InquiryManager
{
    /////////////////////// 函数名 ///////////////////////////
    const FUNC_GET_HLWYY_SERVER_API = "getServerApi"; // 获取互联网医院API入口服务器
    const FUNC_GET_USER_ID = "getUserId"; // 获取用户ID
    const FUNC_GET_DEPARTMENT_LIST = "getDepartmentList"; // 获取互联网医院科室列表
    const FUNC_GET_DOCTOR_LIST = "getDoctorsList"; // 获取医生列表
    const FUNC_GET_ASSISTANT_DOCTOR = "getAssistantDoctor"; // 获取助理医生
    const FUNC_GET_ADVISORY_DOCTOR = "getAdvisoryDoctor"; // 获取咨询医生
    const FUNC_GET_DOCTOR_DETAIL_INFO = "getDoctorDetailInfo"; // 获取医生详情
    const FUNC_GET_DOCTOR_ONLINE_STATE = "getDoctorOnlineState"; // 获取医生的在线状态
    const FUNC_GET_DOCTOR_HEAD_IMAGE = "getDoctorHeadImage"; // 获取医生头像信息
    const FUNC_GET_INQUIRY_RECORD_INFO = "getInquiryRecordInfo"; // 获取问诊记录
    const FUNC_POST_DOCTOR_INQUIRY_COMMENT = "postDoctorInquiryComment"; // 上传给医生打分评价
    const FUNC_GET_DOCTOR_VIDEO_LIVE_INFO = "getDoctorVideoLiveInfo"; // 获取直播信息
    const FUNC_GET_HOSPITAL_INFO = "getHospitalInfo"; // 获取医院信息
    const FUNC_GET_DOCTOR_LIST_BY_HOSP_ID = "getDoctorListByHospId"; // 根据医院id获取医生信息
    const FUNC_GET_TELETEXT_QRCODE = "getTeletextQrcode"; // 获取图文问诊二维码

    //key映射表
    private static $KeyMap = array(
        "getServerApi" => "getServerApi",
        "getUserId" => "getUserId",
        "getDepartmentList" => "getDepartmentList",
        "getDoctorsList" => "getDoctorsList",
        "getAssistantDoctor" => "getAssistantDoctor",
        "getDoctorDetailInfo" => "getDoctorDetailInfo",
        "getDoctorOnlineState" => "getDoctorOnlineState",
        "getDoctorHeadImage" => "getDoctorHeadImage",
        "getInquiryRecordInfo" => "getInquiryRecordInfo",
        "postDoctorInquiryComment" => "postDoctorInquiryComment",
        "getDoctorVideoLiveInfo" => "getDoctorVideoLiveInfo",
        "getAdvisoryDoctor" => "getAdvisoryDoctor",
        "getHospitalInfo" => "getHospitalInfo",
        "getDoctorListByHospId" => "getDoctorListByHospId",
        "getTeletextQrcode" => "getTeletextQrcode",
    );

    /**
     * 校验key是否存在
     * @param $key
     * @return bool
     */
    private static function verifyKey($key)
    {
        return array_key_exists($key, self::$KeyMap);
    }

    /**
     * @brief 向cws-hlwyy服务器请求数据
     * @param $key string 方法名
     * @param $param mixed|null 参数字段，使用数组结构或json结构
     * @return mixed|null
     */
    public static function queryHLWYY($key, $param)
    {
        $result = null;
        switch ($key) {
            case self::FUNC_GET_USER_ID:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::getUserId($url);
                break;

            case self::FUNC_GET_DEPARTMENT_LIST:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::getDepartMentList($url);
                break;

            case self::FUNC_GET_DOCTOR_LIST:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::getDoctorsList($url);
                break;

            case self::FUNC_GET_ASSISTANT_DOCTOR:
            case self::FUNC_GET_DOCTOR_DETAIL_INFO:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::getAssistantDoctor($url);
                break;

            case self::FUNC_GET_ADVISORY_DOCTOR:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::getAdvisoryDoctor($url);
                break;

            case self::FUNC_GET_DOCTOR_ONLINE_STATE:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::getDoctorOnlineState($url);
                break;

            case self::FUNC_GET_DOCTOR_HEAD_IMAGE:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::getDoctorHeadImage($url);
                break;

            case self::FUNC_GET_INQUIRY_RECORD_INFO:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::getInquiryRecordInfo($url);
                break;

            case self::FUNC_POST_DOCTOR_INQUIRY_COMMENT:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::setDoctorScore($url);
                break;

            case self::FUNC_GET_HOSPITAL_INFO:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::getHospitalList($url);
                break;

            case self::FUNC_GET_DOCTOR_LIST_BY_HOSP_ID:
            case self::FUNC_GET_TELETEXT_QRCODE:
                $url = self::buildHttpUrl($key, $param);
                $result = InquiryAPI::getDoctorListByHospId($url);
                break;

            default:
                LogUtils::error("function[.$key.] not support!");
                break;
        }

        return $result;
    }

    /**
     * @brief 构建http get 请求的url
     * @param $key string 请求头部的关键字函数名
     * @param $param  请求json字段的内容
     * @return string 返回具体的url
     */
    private static function buildHttpUrl($key, $param) {
        $url = CWS_HLWYY_URL . self::getHttpHead($key) . self::getHttpJson($param);

        return $url;
    }

    /**
     * @brief 生成head字段的内容
     * @param $key 请求头部的关键字函数名
     * @return string 返回head字段格式，如 head={'func':"xxxx", 'carrierId':xxxxxx}
     */
    private static function getHttpHead($key) {
        $arr = array(
            'func' => $key,
            'carrierId'=> MasterManager::getCarrierId(),
        );
        $localInquiry = MasterManager::getLocalInquiry();
        //localInquiry由入口链接传入,INQUIRY_APP_ID,INQUIRY_APP_KEY定义在AndroidServer里面
        if(($localInquiry == 1) && defined("INQUIRY_APP_ID") && defined("INQUIRY_APP_KEY")){
            $arr['appId'] = INQUIRY_APP_ID;
            $arr['appKey'] = INQUIRY_APP_KEY;
        }
        $headParam = "?head=" . json_encode($arr);
        return $headParam;
    }

    /**
     * @brief 生成json字段的内容
     * @param $param json字段内的参数
     * @return string 返回json字段的格式，如 json={'userId':xxxxxx, 'doctorId':xxxxxx}
     */
    private static function getHttpJson($param) {

        if (is_array($param)) {
            $param = json_encode($param);
        }

        if ($param == null) {
            $param = "{}";
        }

        $jsonParam = "&json=" . $param;
        return $jsonParam;
    }
}