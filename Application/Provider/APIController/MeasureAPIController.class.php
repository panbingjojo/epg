<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [健康检测]相关的API封装
// +----------------------------------------------------------------------
// | [使用者]：第三方合作者
// | [目的]：避免第三方直接访问我方cws。
// | [功能]：关于健康检测的系列接口跳转实现。相当于中间代理，与cws直接交互，下发从cws
// | 请求到的数据给第三方。
// | [注意]：
// |    1. 其中的参数请勿随意变更，如需请按实际情况。
// |    2. 除登录鉴权接口auth，其它所有接口都需要传递head，以进行session等头部检验。
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/2 9:26
// +----------------------------------------------------------------------


namespace Provider\APIController;


use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\DeviceCheckApi;
use Provider\Model\Common\MyUtil;
use Provider\Model\Common\ServerAPI\MeasureApi;
use Provider\Model\Constants\Type;

class MeasureAPIController extends AbsBaseAPIController
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
            case "bindDeviceIdAction":
                if (self::c_func_is_null_empty($args->json->dev_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"dev_id\" is empty!");
                    return self::c_func_new_def_model(false, '"dev_id" 不能为空！');
                }
                break;
            case "fetchMeasureDataAction":
            case "getUnarchivedListAction":
                /*-TODO 使用"/cws/api/measure/"接口的话需要如下校验！
                if (self::c_func_is_null_empty($args->json->dev_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"dev_id\" is empty!");
                    return self::c_func_new_def_model(false, '"dev_id" 不能为空！');
                }
                if (self::c_func_is_null_empty($args->json->begin_dt)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"begin_dt\" is empty!");
                    return self::c_func_new_def_model(false, '"begin_dt" 不能为空！');
                }
                if (self::c_func_is_null_empty($args->json->end_dt)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"end_dt\" is empty!");
                    return self::c_func_new_def_model(false, '"end_dt" 不能为空！');
                }*/
                // 使用P10010接口查询，仅校验分页参数
                if ($args->json->page <= 0 || $args->json->page_size <= 0) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"page or page_size\" is empty or invalid!");
                    return self::c_func_new_def_model(false, ($args->json->page <= 0 ? '"page"必须大于0！' : '"page_size"必须大于0！'));
                }
                break;
            case "getArchivedListAction":
                if ($args->json->page <= 0 || $args->json->page_size <= 0) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"page or page_size\" is empty or invalid!");
                    return self::c_func_new_def_model(false, ($args->json->page <= 0 ? '"page"必须大于0！' : '"page_size"必须大于0！'));
                }
                break;
            case "archiveAction":
                if (self::c_func_is_null_empty($args->json->member_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"member_id\" is empty!");
                    return self::c_func_new_def_model(false, '"member_id" 不能为空！');
                }
                if (self::c_func_is_null_empty($args->json->measure_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"measure_id\" is empty!");
                    return self::c_func_new_def_model(false, '"measure_id" 不能为空！');
                }
                if (self::c_func_is_null_empty($args->json->paper_type) || ($isDisallowType = !in_array($args->json->paper_type, Type::MEASURE_TYPES))) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"paper_type\" is empty or invalid!");
                    return self::c_func_new_def_model(false, '"paper_type" ' . (isset($isDisallowType) && $isDisallowType ? '不在允许范围内！' : '不能为空！'));
                }
                if (($data_len = strlen($args->json->data)) === 0 || $data_len > 10000) {
                    LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> [archive failed!]: param "data" is empty or invalid!');
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"data\" is empty or invalid!");
                    return self::c_func_new_def_model(false, '"data" ' . ($data_len === 0 ? '不能为空！' : '长度不能大于10000！'));
                }
                break;
            case "deleteArchivedAction":
                if (self::c_func_is_null_empty($args->json->member_id)) {
                    LogUtils::error("[$func_flag]--->[verify failed!]: param \"member_id\" is empty!");
                    return self::c_func_new_def_model(false, '"member_id" 不能为空！');
                }
                break;
        }
    }

    /**
     * 接口：获取用户绑定设备的mac地址。
     * 说明：获取当前用户绑定过的检测设备号。供第三方在需要获取已绑定的历史设备号时，调用该接口。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{}"//空json字符串即可。
     * }
     */
    public function queryBindDeviceIdAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $deviceId = DeviceCheckApi::getBindDeviceId($args->head);
        $result = array(
            "result" => 0,
            "device_id" => $deviceId
        );

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：用户绑定设备。
     * 说明：为当前用户绑定检测设备号。供第三方在需要与用户绑定设备号时，调用该接口。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"dev_id\":\"健康检测拉雅仪IMEI号\",
     *   }"
     * }
     */
    public function bindDeviceIdAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        $result = DeviceCheckApi::bindDeviceId($args->json->dev_id, $args->head);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $ret = array(
            'result' => $result->result,
            'msg' => $result->result == 0 ? '绑定成功' : ($result->result == -101 ? '设备地址不正确' : ($result->result == -1 ? 'session校验失败' : '绑定失败，其它原因')),
        );

        $this->ajaxReturn($ret);
    }

    /**
     * 接口：获取测量数据
     * 说明：获取当前绑定的拉雅仪设备上传后的测量数据列表。供第三方在测量完数据后，轮询调用该接口。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"page\":页码，整数1开始,
     *       \"page_size\":每页条数，整数1开始,
     *   }"
     * }
     */
    public function fetchMeasureDataAction()
    {
        $args = $this->c_func_get_args(__CLASS__, __FUNCTION__);
        if (($ret = $this->c_func_check_args($args, __FUNCTION__)) && !$ret->success) {
            $this->ajaxReturn($ret->data);
            return;
        }

        /*-TODO 使用"/cws/api/measure/"接口的话需要如下校验！
        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $client_id = $thirdAppInfo->measure->app_id;
        $key = md5($thirdAppInfo->measure->app_key);
        $dev_id = $args->json->dev_id;
        $begin_dt = $args->json->begin_dt;
        $end_dt = $args->json->end_dt;
        $sign = md5("client_id=$client_id,key=$key,dev_id=$dev_id,begin_dt=$begin_dt,end_dt=$end_dt");

        $json = array(
            "client_id" => $client_id,
            "key" => $key,
            "dev_id" => $dev_id,
            "begin_dt" => $begin_dt,
            "end_dt" => $end_dt,
            "sign" => $sign
        );

        $result = MeasureApi::getUnarchivedList(json_decode(json_encode($json)));*/

        // 使用P10010接口查询
        $result = MeasureApi::getUnarchivedListV2($args->head, $args->json->page, $args->json->page_size);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：获取未归档的检测数据 - 列表
     * 说明：获取指定用户尚未归档的健康检测数据列表。
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

        /*-TODO 使用"/cws/api/measure/"接口的话需要如下校验！
        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $client_id = $thirdAppInfo->measure->app_id;
        $key = md5($thirdAppInfo->measure->app_key);
        $dev_id = $args->json->dev_id;
        $begin_dt = $args->json->begin_dt;
        $end_dt = $args->json->end_dt;
        $sign = md5("client_id=$client_id,key=$key,dev_id=$dev_id,begin_dt=$begin_dt,end_dt=$end_dt");

        $json = array(
            "client_id" => $client_id,
            "key" => $key,
            "dev_id" => $dev_id,
            "begin_dt" => $begin_dt,
            "end_dt" => $end_dt,
            "sign" => $sign
        );

        $result = MeasureApi::getUnarchivedList(json_decode(json_encode($json)));*/

        // 使用P10010接口查询
        $result = MeasureApi::getUnarchivedListV2($args->head, $args->json->page, $args->json->page_size);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：获取已归档的检测数据列表
     * 说明：获取指定用户已归档的健康检测数据列表。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"page\":页码，整数1开始,
     *       \"page_size\":每页条数，整数1开始,
     *       \"member_id\":\"归档的成员id\",
     *       \"paper_type\":检测数据类型,
     *       \"sort\": 返回数据排序类型 int（0正序 1降序，默认为1）（可选）
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

        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $client_id = $thirdAppInfo->measure->app_id;
        $key = md5($thirdAppInfo->measure->app_key);
        $member_id = $args->json->member_id;
        $paper_type = $args->json->paper_type;
        $page = $args->json->page;
        $page_size = $args->json->page_size;
        $sort = $args->json->sort;

        $result = MeasureApi::getArchivedList($client_id, $key, $args->head->lm_userId, $member_id, $paper_type, $page, $page_size, $sort);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：归档某条检测数据
     * 说明：进行归档操作。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"member_id\":\"归档的成员id\",
     *       \"paper_type\":检测数据类型，整型,
     *       \"measure_id\": \"检测记录id\",
     *       \"data\": \"归档的检测json数据字符串\",
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

        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $client_id = $thirdAppInfo->measure->app_id;
        $key = md5($thirdAppInfo->measure->app_key);
        $member_id = $args->json->member_id;
        $paper_type = $args->json->paper_type;
        $measure_id = $args->json->measure_id;
        $data = $args->json->data;

        $result = MeasureApi::archive($client_id, $key, $args->head->lm_userId, $member_id, $data, $paper_type, $measure_id);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }


    /**
     * 接口：删除某条已归档检测数据
     * 说明：删除归档记录操作。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"member_id\":\"归档的成员id\",
     *       \"measure_id\":\"检测记录id\",
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

        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $client_id = $thirdAppInfo->measure->app_id;
        $key = md5($thirdAppInfo->measure->app_key);
        $member_id = $args->json->member_id;
        $measure_id = $args->json->measure_id;
        $paper_type = $args->json->paper_type;

        $result = MeasureApi::deleteArchived($client_id, $key, $args->head->lm_userId, $member_id, $measure_id);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

    /**
     * 接口：删除某条未归档检测数据
     * 说明：删除未归档记录操作。
     * 调用：第三方以post请求该接口，参数为json。
     * 参数：
     * {
     *   "head":"{...}",
     *   "json":"{
     *       \"type\":1,//使用平台 0-测试服，1或不传-正式服（可选）
     *       \"measure_id\":\"检测记录id\",
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

        $thirdAppInfo = MyUtil::getThirdAppInfo();
        $client_id = $thirdAppInfo->measure->app_id;
        $key = md5($thirdAppInfo->measure->app_key);
        $measure_id = $args->json->measure_id;
        $sign = md5("client_id=$client_id,key=$key,measure_id=$measure_id");

        $json = array(
            "client_id" => $client_id,
            "key" => $key,
            "measure_id" => $measure_id,
            "sign" => $sign
        );
        $result = MeasureApi::deleteUnarchived(json_decode(json_encode($json)));

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . json_encode($result));

        $this->ajaxReturn($result);
    }

}