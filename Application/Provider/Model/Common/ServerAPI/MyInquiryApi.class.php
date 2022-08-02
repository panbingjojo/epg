<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [视频问诊] 模块API：提供给第三方
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/9 09:47
// +----------------------------------------------------------------------


namespace Provider\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\DoctorP2PRecordAPI;
use Home\Model\Entry\MasterManager;
use Provider\Model\Common\MyHttpManager;
use Provider\Model\Common\MyUtil;
use Provider\Model\Constants\Type;

class MyInquiryApi
{
    //************************ 互联网医院模块相关[START] ************************//
    //
    // 互联网api-url：测试服与正式服
    const HLWYY_URL_TEST = 'https://test-apis.hlwyy.cn/';
    const HLWYY_URL_RELEASE = 'https://apis.hlwyy.cn/';

    private static $TB_ARCHIVE_DATA_MAP = Type::DT_INQUIRY_ARCHIVE_DATA_MAP;        //归档成员与问诊id的映射关系表

    /**
     * 判断使用正式服还是测试地址
     *
     * @param $type //使用哪个服务器地址，0-测试服，1或者不填默认正式服
     * @param $apiUrl //具体的接口地址，例如："/dept"
     * @return string
     */
    private static function getCurlUrl($type, $apiUrl)
    {
        return ($type == 0 ? self::HLWYY_URL_TEST : self::HLWYY_URL_RELEASE) . $apiUrl;
    }

    /**
     * 组装原始的header参数
     *
     * @param $type //使用哪个服务器地址，0-测试服，1或者不填默认正式服
     * @return array
     */
    private static function getCurlHeaders($type)
    {
        $appInfo = MyUtil::getThirdAppInfo();
        return array(
            'appid' => $appInfo->hlwyy->app_id,
            'appkey' => $type == 0 ? $appInfo->hlwyy->app_key_test : $appInfo->hlwyy->app_key_release,
        );
    }

    /**
     * 获取互联网医院的科室列表
     * @param int $type //请求类型（0-测试服，1或者不填默认正式服）
     * @return mixed
     */
    public static function getHlwyyDeptList($type = 1)
    {
        $curlUrl = self::getCurlUrl($type, '/dept');
        $curlHeader = BaseApi::convertToCurlHeader(self::getCurlHeaders($type));
        $result = MyHttpManager::httpRequestByHeader(MyHttpManager::M_GET, $curlUrl, $curlHeader);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> url[GET]: ' . $curlUrl . ' header: ' . json_encode($curlHeader));
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);

        return json_decode($result);
    }

    /**
     * 获取互联网医院的医生列表
     * @param null $type //请求类型（0-测试服，1或者不填默认正式服）
     * @param string $deptId //指定科室
     * @param int $isTest //是否拉取测试医生（0-不拉取 1-拉取）
     * @param int $page //页码，从1开始
     * @param int $pageSize //每页条数，从1开始
     * @return mixed
     */
    public static function getHlwyyDoctorList($type, $deptId, $isTest, $page = 1, $pageSize = 10)
    {
        $json = array(
            'dept_id' => $deptId,
            'page' => $page,
            'page_size' => $pageSize,
            'is_test' => $isTest == 1 ? 1 : 0,
            'carrier_id' => MasterManager::getCarrierId(),//不需要第三方传递，从当前epg-lws环境中获取
        );
        $curlUrl = BaseApi::jointGetParams($json, self::getCurlUrl($type, 'doctors'));
        $curlHeader = BaseApi::convertToCurlHeader(self::getCurlHeaders($type));
        $result = MyHttpManager::httpRequestByHeader(MyHttpManager::M_GET, $curlUrl, $curlHeader);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> url[GET]: ' . $curlUrl . ' header: ' . json_encode($curlHeader));
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);

        return json_decode($result);
    }

    /**
     * 获取互联网医院的医生列表
     * @param null $type //请求类型（0-测试服，1或者不填默认正式服）
     * @param string $deptId //指定科室
     * @param int $isTest //是否拉取测试医生（0-不拉取 1-拉取）
     * @param int $page //页码，从1开始
     * @param int $pageSize //每页条数，从1开始
     * @return mixed
     */
    public static function getHlwyyOnlineDoctorList($type, $deptId, $isTest, $page = 1, $pageSize = 10)
    {
        $json = array(
            'dept_id' => $deptId,
            'page' => $page,
            'page_size' => $pageSize,
            'is_test' => $isTest == 1 ? 1 : 0,
            'carrier_id' => MasterManager::getCarrierId(),//不需要第三方传递，从当前epg-lws环境中获取
        );
        $curlUrl = BaseApi::jointGetParams($json, self::getCurlUrl($type, '/doctors/online'));
        $curlHeader = BaseApi::convertToCurlHeader(self::getCurlHeaders($type));
        $result = MyHttpManager::httpRequestByHeader(MyHttpManager::M_GET, $curlUrl, $curlHeader);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> url[GET]: ' . $curlUrl . ' header: ' . json_encode($curlHeader));
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);

        return json_decode($result);
    }

    /**
     *  通过tagId获取医生列表
     * @param null $type //请求类型（0-测试服，1或者不填默认正式服）
     * @param string $tagId // 医生tagid
     * @param int $isTest //是否拉取测试医生（0-不拉取 1-拉取）
     * @param int $page //页码，从1开始
     * @param int $pageSize //每页条数，从1开始
     * @return mixed
     */
    public static function getHlwyyDoctorListByTagId($type, $tagId, $isTest, $page = 1, $pageSize = 10)
    {
        // 例如：https://apis.hlwyy.cn/tag/doctors?tag_id=123&page_size=100&page=1

        $json = array(
            'tag_id' => $tagId,
            'page' => $page,
            'page_size' => $pageSize,
            'is_test' => $isTest == 1 ? 1 : 0,
            'carrier_id' => MasterManager::getCarrierId(),//不需要第三方传递，从当前epg-lws环境中获取
        );
        $curlUrl = BaseApi::jointGetParams($json, self::getCurlUrl($type, 'tag/doctors'));
        $curlHeader = BaseApi::convertToCurlHeader(self::getCurlHeaders($type));
        $result = MyHttpManager::httpRequestByHeader(MyHttpManager::M_GET, $curlUrl, $curlHeader);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> url[GET]: ' . $curlUrl . ' header: ' . json_encode($curlHeader));
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);

        return json_decode($result);
    }

    /**
     * 获取互联网医院的医生详情
     * @param null $type //请求类型（0-测试服，1或者不填默认正式服）
     * @param $doctorId //指定医生id
     * @return mixed
     */
    public static function getHlwyyDoctorDetail($type, $doctorId)
    {
        $curlUrl = self::getCurlUrl($type, '/doctors') . '/' . $doctorId;
        $curlHeader = BaseApi::convertToCurlHeader(self::getCurlHeaders($type));
        $result = MyHttpManager::httpRequestByHeader(MyHttpManager::M_GET, $curlUrl, $curlHeader);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> url[GET]: ' . $curlUrl . ' header: ' . json_encode($curlHeader));
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);

        return json_decode($result);
    }

    /**
     * 获取互联网医院的当前相对空闲的助理医师
     * @param null $type //请求类型（0-测试服，1或者不填默认正式服）
     * @param string $userId //用户id，没有可填空
     * @param int $areaCode //区域代码，没有不填
     * @param int $isTest //是否拉取测试医生（0-不拉取 1-拉取）
     * @return mixed
     */
    public static function getHlwyyFreeAssistantDr($type, $userId, $areaCode, $isTest)
    {
        $json = array(
            'user_id' => $userId,
            'is_test' => $isTest == 1 ? 1 : 0,
            'area_code' => $areaCode,
            'carrier_id' => MasterManager::getCarrierId(),//不需要第三方传递，从当前epg-lws环境中获取
        );

        $curlUrl = BaseApi::jointGetParams($json, self::getCurlUrl($type, '/doctors/asst/free'));
        $curlHeader = BaseApi::convertToCurlHeader(self::getCurlHeaders($type));
        $result = MyHttpManager::httpRequestByHeader(MyHttpManager::M_GET, $curlUrl, $curlHeader);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> url[GET]: ' . $curlUrl . ' header: ' . json_encode($curlHeader));
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);

        return json_decode($result);
    }

    /**
     * 通过问诊id和39互联网端记录和用户id向39互联网医院查询具体的问诊记录详情数据。
     *
     * @param null $type //请求类型（0-测试服，1或者不填默认正式服）
     * @param string $inquiry_id //问诊记录id
     * @param string $nethosp_user_id //39互联网医院的用户id
     * @return mixed //{"code":"0","message":"获取成功！","info":{}}
     */
    public static function getHlwyyInquiryDetail($type, $inquiry_id, $nethosp_user_id)
    {
        $json = array(
            'user_id' => $nethosp_user_id,//此参数为问诊websocket绑定时，通过ws_bind_response消息传下，是问诊接续服务器分配的用户id
            'carrier_id' => MasterManager::getCarrierId(),//不需要第三方传递，从当前epg-lws环境中获取
        );

        $curlUrl = BaseApi::jointGetParams($json, self::getCurlUrl($type, "/inquiry/$inquiry_id/record"));
        $curlHeader = BaseApi::convertToCurlHeader(self::getCurlHeaders($type));
        $result = MyHttpManager::httpRequestByHeader(MyHttpManager::M_GET, $curlUrl, $curlHeader);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> url[GET]: ' . $curlUrl . ' header: ' . json_encode($curlHeader));
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);

        return json_decode($result);
    }

    /**
     * 请求转换医生头像地址url
     *
     * @param string $doctor_id //医生id
     * @param string $avatar_url //医生头像，未转换的地址
     * @return mixed //成功-直接返回图片流。失败-返回json内容{"code":"-1","message":""}
     */
    public static function getHlwyyDoctorAvatarUrl($doctor_id, $avatar_url)
    {
        if (MyUtil::isNullOrEmpty($avatar_url)) {
            return json_encode(array(
                'code' => -1,
                'msg' => '"avatar_url" is invalid',
            ));
        } else {
            $header = array("Content-Type:image/jpeg");
            $http = curl_init();
            curl_setopt($http, CURLOPT_URL, $avatar_url);
            curl_setopt($http, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($http, CURLOPT_HEADER, 0);
            curl_setopt($http, CURLOPT_HTTPHEADER, $header);
            try {
                $result = curl_exec($http);
            } finally {
                curl_close($http);
            }
            return $result;
        }
    }

    //
    //************************ 互联网医院模块相关[END] ************************//
    //************************ 其他问诊模块相关[START] ************************//
    //

    /**
     * 获取指定医生问诊二维码接口
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param string $doctor_id //医生ID
     * @return mixed
     * <pre>返回示例：
     *      {
     *          "code": 0,
     *          "message": "success",
     *          "scene": "102340_1556527689_510094_0",
     *          "url": "/Runtime/qrcode/20190429/102340_1556527689_510094_0.jpg"
     *      }
     * </pre>
     */
    public static function getInquiryQRCode($head, $doctor_id)
    {
        $data = array(
            'head' => json_encode(array('func' => 'getInquiryQRCode')),
            'json' => json_encode(array(
                'user_id' => $head->lm_userId,
                'session_id' => $head->lm_sessionId,
                'login_id' => $head->lm_loginId,
                'carrier_id' => MasterManager::getCarrierId(),
                'doctor_id' => $doctor_id,
                "entry_flag" => "微信小程序问诊",
            )),
        );

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [input_param]: ' . json_encode($data));

        $result = MyHttpManager::httpRequest(MyHttpManager::M_POST, CWS_URL_WX_SERVER_ENTRY, $data);
        $retObj = json_decode($result);
        if (is_null($retObj)) {
            $retObj = new \stdClass();
            $retObj->code = -1;
            $retObj->message = 'failed, null object!';
            $retObj->scene = '';
            $retObj->url = '';
        } else {
            if (!empty($retObj->url)) $retObj->url = CWS_URL_WX_SERVER . $retObj->url;
        }

        return $retObj;
    }

    /**
     * 获取指定二维码当前的问诊状态
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param $scene //微信小程序码唯一标识
     * @return mixed
     * <pre>返回示例：
     *      {
     *          "code": 0,
     *          "message": "success",
     *          "scene": "102340_1556527689_510094_0",
     *          "state": "0"
     *      }
     * </pre>
     */
    public static function getInquiryQRCodeStatus($head, $scene)
    {
        $data = array(
            'head' => json_encode(array('func' => 'getInquiryStatus')),
            'json' => json_encode(array(
                'user_id' => $head->lm_userId,
                'session_id' => $head->lm_sessionId,
                'login_id' => $head->lm_loginId,
                'carrier_id' => MasterManager::getCarrierId(),
                'scene' => $scene,
            )),
        );

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [input_param]: ' . json_encode($data));

        $result = MyHttpManager::httpRequest(MyHttpManager::M_POST, CWS_URL_WX_SERVER_ENTRY, $data);
        $retObj = json_decode($result);
        if (is_null($retObj)) {
            $retObj = new \stdClass();
            $retObj->code = -1;
            $retObj->message = '请求失败，请检查服务器！';
        }

        return $retObj;
    }

    /**
     * 查询指定用户剩余可问诊次数。
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param $json //请求参数json。例如：四川广电510094，调用接口所需的参数。
     * @return mixed|\stdClass
     */
    public static function getInquiryTimes($head, $json)
    {
        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $client_id = $thirdAppInfo->measure->app_id;
        $key = md5($thirdAppInfo->measure->app_key);
        $data = array(
            'client_id' => $client_id,
            'key' => $key,
            'user_id' => $head->lm_userId,
            'session_id' => $head->lm_sessionId,
        );

        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [input_param]: ' . json_encode($data));

        $result = MyHttpManager::httpRequest(MyHttpManager::M_POST, CWS_URL_3RD_INQUIRY_TIMES, $data);
        $retObj = json_decode($result);
        if ($retObj == null || is_null($retObj)) {
            $retObj = new \stdClass();
            $retObj->code = -1;
            $retObj->message = '请求失败，请检查服务器！';
        }

        return $retObj;
    }

    /**
     * 拉取"已归档"问诊记录列表。
     *
     * @param null $type //请求类型（0-测试服，1或者不填默认正式服）
     * @param $member_id //指定家庭成员id
     * @param int $page //页号，从1开始
     * @param int $page_size //每页返回条数，从1开始
     * @return \stdClass {"code":0,"msg":"success","count":0,"list":[]}
     */
    public static function getInquiryArchivedList($type, $member_id, $page, $page_size)
    {
        // 0. 定义返回
        $ret = new \stdClass();
        $ret->code = 0;
        $ret->msg = 'success';
        $ret->count = 0;
        $ret->list = array();

        // 1. 先去cws拉取问诊记录信息
        $retRecordInfosTemp = DoctorP2PRecordAPI::getAllRecordInfo($page, $page_size, $member_id);//查询已归档
        $retRecordInfos = json_decode(json_encode($retRecordInfosTemp));//{"result":0,"count":4,"list":[{},{},…]}

        LogUtils::info("[" . __CLASS__ . "][" . __FUNCTION__ . "][DoctorP2PRecordAPI::getAllRecordInfo][page=$page,page_size=$page_size,member_id=$member_id] ---> result: " . json_encode($retRecordInfos));

        //TODO debug test--start ********************************//
//        if ($type == 0) { //TODO 目前提供给第三方前期调试与测试时，拉取列表数据时的静态数据。正式发布测试，需要去掉！！！
//            $testList = array();
//            for ($i = 0; $i < $page_size; $i++) {
//                $testList[] = json_decode(json_encode(array(
//                        'inquiry_id' => '1551089971359236',
//                        'nethosp_user_id' => '1551088146744952',
//                    ))
//                );
//            }
//            $retRecordInfos = new \stdClass();
//            $retRecordInfos->result = 0;
//            $retRecordInfos->list = $testList;
//            $retRecordInfos->count = count($retRecordInfos->list);
//        }
        //TODO debug test--end ********************************//

        // 2. 再去39互联网医院拉取具体的问诊记录详情，并整合每条详情到retClass一并返回
        self::jointWith39InquiryRecord($ret, $type, $retRecordInfos, $page, $page_size);

        return $ret;
    }

    /**
     * 拉取"已归档"问诊记录列表。
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param null $type //请求类型（0-测试服，1或者不填默认正式服）
     * @param $member_id //指定家庭成员id
     * @param int $page //页号，从1开始
     * @param int $page_size //每页返回条数，从1开始
     * @param int $sort //返回数据排序类型 int（0正序 1降序，默认为1）
     * @return \stdClass {"code":0,"msg":"success","total_count":0,"list":[]}
     */
    public static function getInquiryArchivedListV2($head, $type, $client_id, $key,
                                                    $member_id, $page = 1, $page_size = 1, $sort = 1)
    {
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][args]: ' . json_encode(func_get_args()));

        // 0. 定义返回
        $ret = new \stdClass();
        $ret->code = -1;
        $ret->msg = 'failed';


        // 1.根据"user_id+member_id"拉取指定measure_id，操作表tb_archive_data_map。
        $result = (new BaseApi())->pullCloud($client_id, $key, self::$TB_ARCHIVE_DATA_MAP, $head->lm_userId, $member_id, null, $page, $page_size, $sort);
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-get->tb_archive_data_map][result]: ' . json_encode($result));
        if (!is_null($result) && is_object($result) && $result->code == 0) {
            $ret->code = 0;
            $ret->msg = 'success';
            $ret->page = $page;
            $ret->page_size = $page_size;
            $ret->total_count = $result->total_count;
            $ret->list = [];
            foreach ($result->list as $item) {
                //TODO archive() urlencode了，因为"\""诸如字符串内部转义存储数据库会被去掉，所以对应url解码
                $ret->list[] = json_decode(urldecode($item->data));//检测数值: 具体的inquiry-json串
            }
        }

        LogUtils::info("[" . __CLASS__ . "][" . __FUNCTION__ . "][result]: " . json_encode($ret));

        return $ret;
    }

    /**
     * 拉取"未归档"问诊记录列表。
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param null $type //请求类型（0-测试服，1或者不填默认正式服）
     * @param int $page //页号，从1开始
     * @param int $page_size //每页返回条数，从1开始
     * @return \stdClass {"code":0,"msg":"success","count":0,"list":[]}
     */
    public static function getInquiryUnarchivedList($head, $type, $page = 1, $page_size = 1)
    {
        // 0. 定义返回
        $ret = new \stdClass();
        $ret->code = -1;
        $ret->msg = 'failed';

        // 1. 先去cws拉取问诊记录信息
        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_QUERY_NO_ACHIVE_INQUIRY_RECORD);//查询"未归档"
        $http->setUserId($head->lm_userId);
        $http->setSessionId($head->lm_sessionId);
        $http->setLoginId($head->lm_loginId);
        $json = array(
            "current_page" => $page,
            "page_num" => $page_size,
        );
        $retRecordInfos = json_decode($http->requestPost($json));

        LogUtils::info("[" . __CLASS__ . "][" . __FUNCTION__ . "][queryNoArchiveInquiryRecord][page=$page,page_size=$page_size] ---> result: " . json_encode($retRecordInfos));

        //TODO debug test--start ********************************//
//        if ($type == 0) { //TODO 目前提供给第三方前期调试与测试时，拉取列表数据时的静态数据。正式发布测试，需要去掉！！！
//            $testList = array();
//            for ($i = 0; $i < $page_size; $i++) {
//                $testList[] = json_decode(json_encode(array(
//                        'inquiry_id' => '1551089971359236',
//                        'nethosp_user_id' => '1551088146744952',
//                    ))
//                );
//            }
//            $retRecordInfos = new \stdClass();
//            $retRecordInfos->result = 0;
//            $retRecordInfos->list = $testList;
//            $retRecordInfos->count = count($retRecordInfos->list);
//        }
        //TODO debug test--end ********************************//

        // 2. 再去39互联网医院拉取具体的问诊记录详情，并整合每条详情到retClass一并返回
        self::jointWith39InquiryRecord($ret, $type, $retRecordInfos, $page, $page_size);

        return $ret;
    }

    /**
     * 把"归档/未归档"数据列表的每条数据中，"39问诊记录详情与我方cws存储的问诊记录信息"整合到一个对象里。
     * @param $ret //返回的消息实体对象
     * @param $type //类型（0-测试服 1-正式服）
     * @param $retRecordInfos //未归档或已归档的问诊记录返回。必须是对象！
     * @param int $page //页号，从1开始
     * @param int $page_size //每页返回条数，从1开始
     */
    private static function jointWith39InquiryRecord(&$ret, $type, $retRecordInfos, $page = 1, $page_size = 1)
    {
        // >>> 必须是有效的返回数据才处理 <<< //
        if ($retRecordInfos != null && is_object($retRecordInfos)
            && $retRecordInfos->result == 0 && is_array($retRecordInfos->list)) {
            $ret->code = 0;
            $ret->msg = 'success';
            $ret->page = $page;
            $ret->page_size = $page_size;
            $ret->total_count = $retRecordInfos->count;
            $ret->list = [];

            // 依次向39互联网医院请求问诊记录详情
            $recordList = $retRecordInfos->list;
            $len = count($recordList);
            $i = $len > 0 ? 0 : -1;
            while ($i >= 0 && $i < $len) {
                $record = $recordList[$i];

                $inquiry39Info = self::getHlwyyInquiryDetail($type, $record->inquiry_id, $record->nethosp_user_id); //$record: is_object
                if (!is_null($inquiry39Info) && is_object($inquiry39Info) && !is_null($inquiry39Info->info)
                    && $inquiry39Info->code == 0 && is_object($inquiry39Info->info)) { //$inquiry39Info['info']: is_object
                    $inquiry39Detail = $inquiry39Info->info;
                } else {
                    $inquiry39Detail = null;
                }

                $ret->list[] = $inquiry39Detail; //整合cws方存储的问诊记录和39互联网医院的问诊记录详情到一个对象
                $i++;
            }
        } else {
            $ret->code = -1;
            $ret->msg = 'get inquiry records failed![' . (is_object($retRecordInfos) ? $retRecordInfos->result : gettype($retRecordInfos)) . ']';
        }
    }

    /**
     * 归档某条问诊记录到指定家庭成员下
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param $member_id //家庭成员id
     * @param $inquiry_id //待归档的问诊记录id
     * @return \stdClass
     */
    public static function archive($head, $member_id, $inquiry_id)
    {
        $ret = new \stdClass();
        $ret->code = 0;
        $ret->msg = 'success';

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_SET_ACHIVE_INQUIRY_RECORD);
        $http->setUserId($head->lm_userId);
        $http->setSessionId($head->lm_sessionId);
        $http->setLoginId($head->lm_loginId);
        $json = array(
            "member_id" => $member_id,
            "inquiry_id" => $inquiry_id
        );
        $result = json_decode($http->requestPost($json));

        LogUtils::info("[" . __CLASS__ . "][" . __FUNCTION__ . "] ---> [P19019][input_param]: " . json_encode($json));
        LogUtils::info("[" . __CLASS__ . "][" . __FUNCTION__ . "] ---> [P19019][result]: " . json_encode($result));

        if (!is_object($result) || $result->result != 0) {
            $ret->code = $result->result;
            $ret->msg = 'failed';
        }

        return $ret;
    }

    /**
     * 归档某条问诊记录到指定家庭成员下
     * <pre>
     * ======================存储设计======================
     * 1. 使用到的接口：
     *      存储数据到云端："/cws/api/cloud/push.php"
     *      删除未归档：P19019传member为1（只要不为-1即可）改变未归档状态
     * 2. 流程：
     *      2.1 准备1张表tb_archive_data_map。存放"第三方成员id与问诊详情json串"映射。
     *      2.2 根据inquiry_id查询tb_archive_data_map表，是否已经归档过。若未曾归档，继续2.3。否则，结束。
     *      2.4 通过inquiry_id向39互联网查询详情。
     *      2.5 将2.4问诊详情结果存储表tb_archive_data_map中。
     *      2.5 结束。若2.5成功，提示成功。否则，提示失败。
     * 3. 注意：声明的tb_xxx即data_type，cws通用接口用于标识不同模块的，取值范围区间：[1, 100]
     * </pre>
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param string $member_id //家庭成员id
     * @param string $inquiry_id //待归档的问诊记录id
     * @param string $nethosp_user_id //互联网医院关诊时生成的id
     * @param int $type //请求类型（0-测试服，1或者不填默认正式服）
     * @return \stdClass
     */
    public static function archiveV2($head, $client_id, $key,
                                     $member_id, $inquiry_id, $nethosp_user_id, $type = 1)
    {
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][args]: ' . json_encode(func_get_args()));

        $ret = new \stdClass();
        $ret->code = 0;
        $ret->msg = 'success';

        // 1. 查询是否已经归档过了，如果没有，则归档存储。否则，结束。
        $archivedObj = self::c_func_get_archived_data_item($client_id, $key, $head->lm_userId, $member_id, $inquiry_id, 1);
        if ($archivedObj != null && is_object($archivedObj)) {
            // 存在。表示已经归档过了，结束。
            $ret->code = -1;
            $ret->msg = 'failed! already archived yet.';
        } else {
            // 不存在！表示尚未归档在push接口过。
            // 2. 向tb_archive_data_map表存放"归档成员-inquiryid"映射关系
            //-->2.1 根据"inquiry_id"和"nethosp_user_id"先拉取问诊记录参数详情
            $r1 = self::getHlwyyInquiryDetail($type, $inquiry_id, $nethosp_user_id);
            if ($r1 == null || is_null($r1) || !is_object($r1) || is_null($r1->info)
                || $r1->code != 0 || !is_object($r1->info)) {
                $ret->code = -1;
                $ret->msg = 'failed. [-1001]';
            } else {
                // 查询到问诊记录
                $inquiryDetailObj = $r1->info;
                $saveData = urlencode(json_encode($inquiryDetailObj, JSON_UNESCAPED_UNICODE));//TODO urlencode()? 因为"\""诸如字符串内部转义存储数据库会被去掉
                $r2 = (new BaseApi())->pushCloud($client_id, $key, self::$TB_ARCHIVE_DATA_MAP, $saveData, $head->lm_userId, $member_id, $inquiry_id);
                LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-save->tb_archive_data_map][result]: ' . json_encode($r1));

                if (!is_null($r2) && is_object($r2) && $r2->code == 0) {
                    $rmResult = self::c_func_delete_unarchived_data($head->lm_userId, $head->lm_sessionId, $head->lm_loginId, $inquiry_id);
                    LogUtils::info('[' . __FILE__ . '][c_func_delete_unarchived_data]-->result:' . json_encode($rmResult));
                } else {
                    $ret->code = -1;
                    $ret->msg = 'failed. [-1002]';
                }
            }
        }

        return $ret;
    }

    /**
     * 删除"已归档在某成员下"的指定某条问诊记录。
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param $inquiry_id //问诊记录id
     * @param $member_id //家庭成员id
     * @return \stdClass
     */
    public static function deleteArchivedRecord($head, $inquiry_id, $member_id)
    {
        $ret = new \stdClass();
        $ret->code = 0;
        $ret->msg = 'success';

        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_DELETE_MEMBER_INQUIRY_RECORD);
        $http->setUserId($head->lm_userId);
        $http->setSessionId($head->lm_sessionId);
        $http->setLoginId($head->lm_loginId);
        $json = array(
            "user_id" => $head->lm_userId,
            "member_id" => $member_id,
            "inquiry_id" => $inquiry_id,
        );
        $result = json_decode($http->requestPost($json));

        LogUtils::info("[" . __CLASS__ . "][" . __FUNCTION__ . "] ---> [P19005][input_param]: " . json_encode($json));
        LogUtils::info("[" . __CLASS__ . "][" . __FUNCTION__ . "] ---> [P19005][result]: " . json_encode($result));

        if ($result != null && is_object($result)) {
            $ret->code = $result->result; //0:删除成功、-2：服务器异常、-101：删除失败
            $ret->msg = $result->result == 0 ? 'success' : 'failed';
        } else {
            $ret->code = -1;
            $ret->msg = 'failed![' . gettype($result) . ']';
        }

        return $ret;
    }

    /**
     * 删除"已归档在某成员下"的指定某条问诊记录。
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param string $member_id //家庭成员id
     * @param string $inquiry_id //问诊记录id
     * @param int $type //请求类型（0-测试服，1或者不填默认正式服）
     * @return \stdClass
     */
    public static function deleteArchivedRecordV2($head, $client_id, $key, $member_id, $inquiry_id, $type = 1)
    {
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][args]: ' . json_encode(func_get_args()));

        $ret = new \stdClass();
        $ret->code = 0;
        $ret->msg = 'success';

        // 1. 查询是否存在该条数据
        $delObj = self::c_func_get_archived_data_item($client_id, $key, $head->lm_userId, $member_id, $inquiry_id, 1);
        if ($delObj == null) {
            // 不存在！
            $ret->code = -1;
            $ret->msg = "delete failed! inquiry_id '$inquiry_id' is not exist.";
        } else {
            // 存在，删除相关的记录
            $r2 = self::c_func_delete_archive_data_map($client_id, $key, $head->lm_userId, $member_id, $inquiry_id, null);
            if ($r2 == null || !is_object($r2) || $r2->code != 0) {
                $ret->code = -1;
                $ret->msg = 'delete failed! [-1002]';
            }
        }

        return $ret;
    }

    /**
     * 删除未归档数据
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param $inquiry_id //问诊记录id
     * @return mixed {"code":0,"msg":"success"}
     */
    public static function deleteUnarchived($head, $inquiry_id)
    {
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][args]: ' . json_encode(func_get_args()));

        $result = self::c_func_delete_unarchived_data($head->lm_userId, $head->lm_sessionId, $head->lm_loginId, $inquiry_id);

        $ret = new \stdClass();
        $ret->code = $result->code;
        $ret->msg = $result->code == 0 ? 'success' : 'delete unarchived failed!';

        return $ret;
    }

    /**
     * 根据inquiry_id查询归档在某成员id下的那条详情数据
     *
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param string $user_id //登录的用户id
     * @param string $member_id //归档到的家庭成员id
     * @param string $inquiry_id //问诊记录id
     * @param int $sort //返回数据排序类型 int（0正序 1降序，默认为1）
     * @return \stdClass|null
     */
    private static function c_func_get_archived_data_item($client_id, $key, $user_id, $member_id, $inquiry_id, $sort)
    {
        $result = (new BaseApi())->pullCloud($client_id, $key, self::$TB_ARCHIVE_DATA_MAP, $user_id, $member_id, $inquiry_id, 1, 1, $sort);
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-get->tb_archive_data_map][result]: ' . json_encode($result));
        /*{
            "code": 0,
            "msg": "success",
            "list": [
                {
                    "data_type": "12", //表示数据表tb_type_data_map
                    "primary_key": "12345", //在表tb_type_data_map表示user_id
                    "secondary_key": "1101", //在表tb_type_data_map表示member_id
                    "third_key": "565511231231_1", //在表tb_type_data_map表示inquiry_id
                    "data": "{xxxx}", //在表tb_type_data_map表示检测数值: 具体的inquiry-json串
                    "cloud_dt": "2019-04-02 21:54:43" //归档服务器记录的时间（即push时刻）
                }
            ],
            "total_count": 1
        }*/

        $archived_data = null;
        if (!is_null($result) && is_object($result) && $result->code == 0
            && is_array($result->list) && count($result->list) > 0) {
            // 数据处理，把我方内部定义的类似"primary_key、secondary_key、third_key、cloud_dt"这种key再次转换成，
            // 变成具体的指定类型，以提供给第三方
            //TODO archive() urlencode了，因为"\""诸如字符串内部转义存储数据库会被去掉，所以对应url解码
            $archived_data = json_decode(urldecode($result->list[0]->data));//检测数值: 具体的inquiry-json串
        }
        return $archived_data;
    }

    /**
     * 由于第三方member_id与我方不同，不能直接用我方归档，采用push接口存储，之后需要变更未归档状态，继续使用P19019接口传member_id
     * 不为-1即可，这里使用1。
     *
     * @param $user_id
     * @param $session_id
     * @param $login_id
     * @param $inquiry_id
     * @return mixed {"code":0,"msg":"success"}
     */
    private static function c_func_delete_unarchived_data($user_id, $session_id, $login_id, $inquiry_id)
    {
        $http = new HttpManager(HttpManager::PACK_ID_INQUIRY_SET_ACHIVE_INQUIRY_RECORD);
        $http->setUserId($user_id);
        $http->setSessionId($session_id);
        $http->setLoginId($login_id);
        $json = array(
            "member_id" => 1,//使用1改变未归档状态
            "inquiry_id" => $inquiry_id
        );
        $result = json_decode($http->requestPost($json));

        LogUtils::info("[" . __FILE__ . "][" . __FUNCTION__ . "] ---> [P19019][input_param]: " . json_encode($json));
        LogUtils::info("[" . __FILE__ . "][" . __FUNCTION__ . "] ---> [P19019][result]: " . json_encode($result));

        $ret = new \stdClass();
        $ret->code = -1;
        $ret->msg = 'fail';

        if (!is_null($result) && is_object($result)) {
            $ret->code = $result->result;
            $ret->msg = $result->result == 0 ? 'success' : 'fail';
        }
        return $ret;
    }

    /**
     * 从归档成员-检测id映射表"tb_archive_data_map"中根据"inquiry_id"删除记录。
     *
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param string $user_id //登录的用户id
     * @param string $member_id //归档到的家庭成员id
     * @param string $inquiry_id //问诊记录id
     * @param string $archive_dt //归档日期
     * @return mixed {"code":0,"msg":"success"}
     */
    private static function c_func_delete_archive_data_map($client_id, $key,
                                                           $user_id, $member_id, $inquiry_id, $archive_dt)
    {
        $result = (new BaseApi())->deleteCloud($client_id, $key, self::$TB_ARCHIVE_DATA_MAP, $user_id, $member_id, $inquiry_id, $archive_dt);
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-delete->tb_archive_data_map][result]: ' . json_encode($result));
        return $result;
    }

    //
    //************************ 其他问诊模块相关[END] ************************//

}