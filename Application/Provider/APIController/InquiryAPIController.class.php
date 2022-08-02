<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [视频问诊]模块相关的API封装
// +----------------------------------------------------------------------
// | [使用者]：第三方合作者
// | [目的]：避免第三方直接访问我方cws。
// | [功能]：关于[视频问诊]的系列接口跳转实现。相当于中间代理，与cws直接交互，下发从cws
// | 请求到的数据给第三方。
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/2 9:26
// +----------------------------------------------------------------------


namespace Provider\APIController;


use Home\Model\Common\LogUtils;

use Home\Model\Common\ServerAPI\WXInquiry;
use Home\Model\Entry\MasterManager;
use Home\Model\Inquiry\InquiryManager;
use Provider\Model\Cache\CacheManager;
use Provider\Model\Common\MyUtil;
use Provider\Model\Common\ServerAPI\MyInquiryApi;

class InquiryAPIController extends AbsBaseAPIController
{

    /**
     * 校验，子类根据自己的规则写不同的判断逻辑
     *
     * @param $args //json对象参数
     * @param $func_flag //待校验唯一标识
     * @return array //校验参数通过/失败的array封装。结构如下: array('code' => $code, 'msg' => $msg)
     */
    protected function validate_rule($args, $func_flag)
    {
        switch ($func_flag) {
            case "getHlwyyDoctorListAction":
                if ($args->json->page <= 0 || $args->json->page_size <= 0) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"page or page_size\" is empty or invalid!");
                    return self::c_func_new_def_model(false, ($args->json->page <= 0 ? '"page"必须大于0！' : '"page_size"必须大于0！'));
                }
                break;
            case "getHlwyyDoctorDetailAction":
                if (self::c_func_is_null_empty($args->json->doctor_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"doctor_id\" is empty!");
                    return self::c_func_new_def_model(false, '"doctor_id" 不能为空！');
                }
                break;
            case "getInquiryQRCodeAction":
                if (self::c_func_is_null_empty($args->json->doctor_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"doctor_id\" is empty!");
                    return self::c_func_new_def_model(false, '"doctor_id" 不能为空！');
                }
                break;
            case "getInquiryQRCodeStatusAction":
                if (self::c_func_is_null_empty($args->json->scene)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"scene\" is empty!");
                    return self::c_func_new_def_model(false, '"scene" 不能为空！');
                }
                break;
            case "getArchivedListAction":
                if (self::c_func_is_null_empty($args->json->member_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"member_id\" is empty!");
                    return self::c_func_new_def_model(false, '"member_id" 不能为空！');
                }
                if ($args->json->page <= 0 || $args->json->page_size <= 0) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"page or page_size\" is empty or invalid!");
                    return self::c_func_new_def_model(false, ($args->json->page <= 0 ? '"page"必须大于0！' : '"page_size"必须大于0！'));
                }
                break;
            case "getUnarchivedListAction":
                if ($args->json->page <= 0 || $args->json->page_size <= 0) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"page or page_size\" is empty or invalid!");
                    return self::c_func_new_def_model(false, ($args->json->page <= 0 ? '"page"必须大于0！' : '"page_size"必须大于0！'));
                }
                break;
            case "getInquiryRecordItemAction":
                if (self::c_func_is_null_empty($args->json->inquiry_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"inquiry_id\" is empty!");
                    return self::c_func_new_def_model(false, '"inquiry_id" 不能为空！');
                }
                if (self::c_func_is_null_empty($args->json->nethosp_user_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"nethosp_user_id\" is empty!");
                    return self::c_func_new_def_model(false, '"nethosp_user_id" 不能为空！');
                }
                break;
            case "archiveAction":
            case "deleteArchivedAction":
                if (self::c_func_is_null_empty($args->json->member_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"member_id\" is empty!");
                    return self::c_func_new_def_model(false, '"member_id" 不能为空！');
                }
                if (self::c_func_is_null_empty($args->json->inquiry_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"inquiry_id\" is empty!");
                    return self::c_func_new_def_model(false, '"inquiry_id" 不能为空！');
                }
                if ($func_flag == "archiveAction") {
                    if (self::c_func_is_null_empty($args->json->nethosp_user_id)) {
                        LogUtils::error("[$func_flag]--->[verify failed!]: param \"nethosp_user_id\" is empty!");
                        return self::c_func_new_def_model(false, '"nethosp_user_id" 不能为空！');
                    }
                }
                break;
        }
    }

    //************************ 互联网医院模块相关[START] ************************//
    //

    /**
     * 接口：获取互联网医院的科室列表。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *   }"
     * }
     */
    public function getHlwyyDeptListAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        // getDataByRedis/cacheDataToRedis
        $redisKey = "redis_hospital_dept_{$args->json->type}_" . CARRIER_ID;
        $cacheManager = CacheManager::getInstance();
        $resultJson = $cacheManager->query($redisKey);
        if ($resultJson) { // 查询得到值
            $result = json_decode($resultJson);
            LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> resultByRedis: ' . json_encode($result));
        } else {
            $result = MyInquiryApi::getHlwyyDeptList($args->json->type);
            // $result = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_DEPARTMENT_LIST, "");
            if ($result != null && $result->list != null) { // 手动构建全部科室返回
                $allDept = new \stdClass();
                $allDept->dept_id = "全部科室";
                $allDept->dept_name = "全部科室";
                $allDept->dept_intro = "";
                $allDept->doc_count = 1;
                array_unshift($result->list, $allDept);
            }
            $resultJson = json_encode($result);
            LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $resultJson);
            // 保存值
            $expireTime = 60 * 60 * 24; // 保存24H
            $cacheManager->save($redisKey, $resultJson, $expireTime);
        }

        // $this->ajaxReturn($result,"EVAL");
        $this->ajaxReturn($result);
    }

    /**
     * 接口：获取互联网医院的医生列表。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"is_test\":1,//是否拉取测试医生 0-不拉取 1-拉取\",
     *       \"dept_id\":\"科室id\",
     *       \"page\":页码，整数1开始,
     *       \"page_size\":每页条数，整数1开始,
     *   }"
     * }
     */
    public function getHlwyyDoctorListAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        // 判断是否通过tagId来获取医生列表
        if ($args->json->is_tag_id == 1) {
            $result = MyInquiryApi::getHlwyyDoctorListByTagId($args->json->type, $args->json->dept_id, $args->json->is_test, $args->json->page, $args->json->page_size);
        } else if ($args->json->dept_id == "全部科室") { // 获取全部科室在线医生
            $result = MyInquiryApi::getHlwyyOnlineDoctorList($args->json->type, "", $args->json->is_test, $args->json->page, $args->json->page_size);
        } else {
            $result = MyInquiryApi::getHlwyyDoctorList($args->json->type, $args->json->dept_id, $args->json->is_test, $args->json->page, $args->json->page_size);
        }

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：获取互联网医院的医生详情。
     * 调用：第三方以post请求该接口，参数为json。
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"doctor_id\":\"医生id\"
     *   }"
     * }
     */
    public function getHlwyyDoctorDetailAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $result = MyInquiryApi::getHlwyyDoctorDetail($args->json->type, $args->json->doctor_id);

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：获取互联网医院的当前相对空闲的助理医师。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"is_test\":1,//是否拉取测试医生 0-不拉取 1-拉取\",
     *       \"area_code\":区域码id，整型（可选）
     *   }"
     * }
     */
    public function getHlwyyFreeAssistantDrAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $result = MyInquiryApi::getHlwyyFreeAssistantDr($args->json->type, $args->json->user_id, $args->json->area_code, $args->json->is_test);

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：获取互联网医院的医生头像地址，传递医生id和原始头像地址后转换。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"doctor_id\":\"医生id\",
     *       \"avatar_url\":\"医生头像url\",
     *   }"
     * }
     */
    public function getHlwyyDoctorAvatarUrlAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $result = MyInquiryApi::getHlwyyDoctorAvatarUrl($args->json->doctor_id, $args->json->avatar_url);

        echo $result;
    }

    //
    //************************ 互联网医院模块相关[END] ************************//
    //************************ 其他问诊模块相关[START] ************************//
    //

    /**
     * 接口：获取问诊二维码
     * 说明：获取视频问诊小程序码。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"doctor_id\":\"医生id\",
     *   }"
     * }
     */
    public function getInquiryQRCodeAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

//        $result = MyInquiryApi::getInquiryQRCode($args->head, $args->json->doctor_id);

        // 得到互联网医疗平台的二维码信息
        MasterManager::setUserId($args->head->lm_userId);
        $result = WXInquiry::getInquiryQRCode($args->json->doctor_id);
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);
        $result = json_decode($result);
        $imgUrl = str_replace("https://viapi.hlwyy.cn", "http://123.59.206.200:10002", $result->url);
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> getDoctorHeadImage: ' . $imgUrl);
        $result->url = $imgUrl;
        $result->code = $result->result;
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     * 接口：获取问诊二维码状态
     * 说明：获取视频问诊小程序码。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"scene\":\"标识小程序码的唯一标识符，由接口（getInquiryQRCodeAction）返回\",
     *   }"
     * }
     */
    public function getInquiryQRCodeStatusAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

//        $result = MyInquiryApi::getInquiryQRCodeStatus($args->head, $args->json->scene);
        $result = WXInquiry::getInquiryStatus($args->json->scene);
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);
        $result = json_decode($result, true);
        $result['code'] = $result['result'];
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     * 接口：获取某条问诊记录详情。
     * 说明：第三方接入者调用。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"inquiry_id\":\"待归档的问诊记录id\",
     *       \"nethosp_user_id\":\"问诊记录详情里的互联网用户id，对应问诊详情字段user_id(e.g. 1551088146744952)。注意不是当前用户id(非lm_userId)\",
     *   }"
     * }
     */
    public function getInquiryRecordItemAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $result = MyInquiryApi::getHlwyyInquiryDetail($args->json->type, $args->json->inquiry_id, $args->json->nethosp_user_id);

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：获取"已归档"问诊记录 - 列表。
     * 说明：第三方接入者调用。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"member_id\":\"归档的成员id\",
     *       \"page\":页码，整数1开始,
     *       \"page_size\":每页条数，整数1开始,
     *       \"sort\":返回数据排序类型 int（0正序 1降序，默认为1）（可选）
     *   }"
     * }
     */
    public function getArchivedListAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        /*-TODO 使用P19013接口。由于第三方member_id字符串与朗玛iptv的member_id整整对应不上，只能通过通用数据接口操作。
        $result = MyInquiryApi::getInquiryArchivedList($args->json->type, $args->json->member_id, $args->json->page, $args->json->page_size);
        */

        // TODO 使用"/cws/api/cloud/pull.php"接口查询
        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $client_id = $thirdAppInfo->measure->app_id;
        $key = md5($thirdAppInfo->measure->app_key);
        $member_id = $args->json->member_id;
        $page = $args->json->page;
        $page_size = $args->json->page_size;
        $type = $args->json->type;
        $sort = $args->json->sort;

        $result = MyInquiryApi::getInquiryArchivedListV2($args->head, $type, $client_id, $key, $member_id, $page, $page_size, $sort);


        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }


    /**
     * 接口：获取"未归档"问诊记录 - 列表。
     * 说明：进行归档操作。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"page\":页码，整数1开始,
     *       \"page_size\":每页条数，整数1开始,
     *   }"
     * }
     */
    public function getUnarchivedListAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $result = MyInquiryApi::getInquiryUnarchivedList($args->head, $args->json->type, $args->json->page, $args->json->page_size);

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：归档某条问诊数据
     * 说明：进行归档操作。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"member_id\":\"归档的成员id\",
     *       \"inquiry_id\":\"待归档的问诊记录id\",
     *       \"nethosp_user_id\":\"问诊记录详情里的互联网用户id，对应问诊详情字段user_id(e.g. 1551088146744952)。注意不是当前用户id(lm_userId)\",
     *   }"
     * }
     */
    public function archiveAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        /*-TODO 使用P19019接口。由于第三方member_id字符串与朗玛iptv的member_id整整对应不上，只能通过通用数据接口操作。
        $result = MyInquiryApi::archive($args->head, $args->json->member_id, $args->json->inquiry_id);
        */

        // TODO 使用"/cws/api/cloud/push.php"接口归档 + P19019接口改变未归档状态
        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $client_id = $thirdAppInfo->measure->app_id;
        $key = md5($thirdAppInfo->measure->app_key);
        $member_id = $args->json->member_id;
        $inquiry_id = $args->json->inquiry_id;
        $nethosp_user_id = $args->json->nethosp_user_id;
        $type = $args->json->type;
        $result = MyInquiryApi::archiveV2($args->head, $client_id, $key, $member_id, $inquiry_id, $nethosp_user_id, $type);

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：删除"已归档"问诊记录。
     * 说明：进行归档操作。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"member_id\":\"归档的成员id\",
     *       \"inquiry_id\":\"归档的问诊记录id\",
     *   }"
     * }
     */
    public function deleteArchivedAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        /*-TODO 使用P19005接口。由于第三方member_id字符串与朗玛iptv的member_id整整对应不上，只能通过通用数据接口操作。
        $result = MyInquiryApi::deleteArchivedRecord($args->head, $args->json->inquiry_id, $args->json->member_id);
        */

        // TODO 使用"/cws/api/cloud/delete.php"接口删除归档
        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $client_id = $thirdAppInfo->measure->app_id;
        $key = md5($thirdAppInfo->measure->app_key);
        $member_id = $args->json->member_id;
        $inquiry_id = $args->json->inquiry_id;
        $type = $args->json->type;
        $result = MyInquiryApi::deleteArchivedRecordV2($args->head, $client_id, $key, $member_id, $inquiry_id, $type);

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：删除"未归档"问诊记录。
     * 说明：进行归档操作。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"inquiry_id\":\"归档的问诊记录id\",
     *   }"
     * }
     */
    public function deleteUnarchivedAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $result = MyInquiryApi::deleteUnarchived($args->head, $args->json->inquiry_id);

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：查询剩余问诊次数。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *   }"
     * }
     */
    public function getInquiryTimesAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $result = MyInquiryApi::getInquiryTimes($args->head, $args->json);

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    //
    //************************ 其他问诊模块相关[END] ************************//
}