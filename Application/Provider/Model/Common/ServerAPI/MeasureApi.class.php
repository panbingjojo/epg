<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [设备检查 -> 健康检测] 模块API：提供给第三方
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/2 18:11
// +----------------------------------------------------------------------


namespace Provider\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Provider\Model\Common\MyHttpManager;
use Provider\Model\Common\MyUtil;
use Provider\Model\Constants\Type;

class MeasureApi
{
    private static $TB_TYPE_DATA_MAP = Type::DT_MEASURE_TYPE_MEASUREID_MAP;         //检测type与检测id的映射关系表
    private static $TB_ARCHIVE_DATA_MAP = Type::DT_MEASURE_ARCHIVE_DATA_MAP;        //归档成员与检测id的映射关系表

    /**
     * 归档一条检测记录。
     * <pre>
     * ======================存储设计======================
     * 1. 使用到的接口：
     *      存储数据到云端："/cws/api/cloud/push.php"
     *      删除检测数据："/cws/api/measure/delete.php"
     * 2. 流程：
     *      2.1 准备2张表。一张存放"检测type-检测id"映射，一张存放"成员id-检测id"映射，通过"检测id"关联起来。
     *      2.2 根据measure_id查询tb_archive_data_map表，是否已经归档过。若未曾归档，继续2.3。否则，结束。
     *      2.3 向tb_type_data_map表存放"检测type-检测id"映射关系
     *      2.4 若2.3操作成功，则向tb_archive_data_map表存放"归档成员-检测id"映射关系。否则，结束。
     *      2.5 若2.4操作成功，则删除检测记录未归档数据。否则，结束。
     *      2.6 结束。
     * 3. 注意：声明的tb_xxx即data_type，cws通用接口用于标识不同模块的，取值范围区间：[1, 100]
     * </pre>
     *
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param string $user_id //登录的用户id
     * @param string $member_id //归档到的家庭成员id
     * @param string $data //要存储的数据
     * @param int $paper_type //检测类型（1-血糖 2-胆固醇 3-甘油三脂 4-尿酸）
     * @param string $measure_id //要存储的检测记录id，必须有效
     * @return mixed {"code":0,"msg":"success"}
     */
    public static function archive($client_id, $key, $user_id, $member_id, $data, $paper_type, $measure_id)
    {
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][args]: ' . json_encode(func_get_args()));

        $ret = new \stdClass();
        $ret->code = 0;
        $ret->msg = 'success';

        // 1. 查询是否已经归档过了，如果没有，则归档存储。否则，结束。
        $archivedObj = self::c_func_get_archived_data_item($client_id, $key, $user_id, $member_id, $measure_id, 1);
        if ($archivedObj != null && is_object($archivedObj)) {
            // 存在。表示已经归档过了，结束。
            $ret->code = -1;
            $ret->msg = 'failed! already archived yet.';
        } else {
            // 不存在！表示尚未归档在push接口过。
            // 2. 向tb_type_data_map表存放"检测type-检测id"映射关系
            $r1 = (new BaseApi())->pushCloud($client_id, $key, self::$TB_TYPE_DATA_MAP, $measure_id, $user_id, $member_id, $paper_type);
            LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-save->tb_type_measureid_map][result]: ' . json_encode($r1));

            // 如果表tb_type_data_map存储成功，则继续向表tb_archive_data存储具体的数据信息
            if (!is_null($r1) && is_object($r1) && $r1->code == 0) {

                // 2.向tb_archive_data_map表存放"归档成员-检测id"映射关系
                $r2 = (new BaseApi())->pushCloud($client_id, $key, self::$TB_ARCHIVE_DATA_MAP, $data, $user_id, $member_id, $measure_id);
                LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-save->tb_archive_data_map][result]: ' . json_encode($r1));

                if (!is_null($r2) && is_object($r2) && $r2->code == 0) {
                    $thirdAppInfo = MyUtil::getThirdAppInfo();
                    $api_clientId = $thirdAppInfo->measure->app_id;
                    $api_key = md5($thirdAppInfo->measure->app_key);
                    $api_sign = md5("client_id=$api_clientId,key=$api_key,measure_id=$measure_id");
                    $delJson = array(
                        'client_id' => $api_clientId,
                        'key' => $api_key,
                        'sign' => $api_sign,
                        'measure_id' => $measure_id,
                    );

                    // 记录日志
                    LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '] ---> archive.delete this unarchived[input_param]: ' . json_encode($delJson));
                    $retDel = self::deleteUnarchived(json_decode(json_encode($delJson)));//在归档成功后调用删除，不需要判断是否删除成功，因为该接口重点是归档
                    LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '] ---> archive.delete this unarchived[result]: ' . json_encode($retDel));
                } else {
                    $ret->code = -1;
                    $ret->msg = 'failed! [-1002]';
                    LogUtils::error('[' . __FILE__ . '][' . __FUNCTION__ . '][db-save->tb_type_measureid_map][push failed]: ' . json_encode($r1));
                }
            } else {
                $ret->code = -1;
                $ret->msg = 'failed! [-1001]';
                LogUtils::error('[' . __FILE__ . '][' . __FUNCTION__ . '][db-save->tb_type_measureid_map]: push failed!');
            }
        }

        return $ret;
    }

    /**
     * 删除指定用户下指定家庭成员指定检测类型等复合条件下已归档的检测记录
     * <pre>
     * ======================设解绑计======================
     * 1. 使用到的接口：
     *      从云端取数据："/cws/api/cloud/pull.php"
     *      从云端取数据："/cws/api/cloud/delete.php"
     * 2. 流程：
     *      2.1 根据measure_id在tb_archive_data_map这个"归档成员-检测id"表查询是否存在归档数据映射关系。
     *      2.2 若2.1成功，则继续2.3。否则，结束。
     *      2.3 从表tb_type_data_map中先移除归档时记录的"检测type-检测id"映射关系。若成功，则继续2.4。否则，结束。
     *      2.4 从表tb_archive_data_map中移除"归档成员-检测id"中存储的归档数据（json串）。
     *      2.5 结束。
     * 3. 注意：声明的tb_xxx即data_type，cws通用接口用于标识不同模块的，取值范围区间：[1, 100]
     * </pre>
     *
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param string $user_id //登录的用户id
     * @param string $member_id //归档到的家庭成员id
     * @param string $measure_id //检测记录id
     * @param string archive_dt //存储时间（格式：2019-04-02 12:00:00）
     * @return mixed {"code":0,"msg":"success"}
     */
    public static function deleteArchived($client_id, $key, $user_id, $member_id, $measure_id)
    {
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][args]: ' . json_encode(func_get_args()));

        $ret = new \stdClass();
        $ret->code = 0;
        $ret->msg = 'success';

        // 1. 查询是否存在该条数据
        $delObj = self::c_func_get_archived_data_item($client_id, $key, $user_id, $member_id, $measure_id, 1);
        if ($delObj == null) {
            // 不存在！
            $ret->code = -1;
            $ret->msg = "delete failed! measure_id '$measure_id' is not exist.";
        } else {
            // 存在，删除相关的记录
            $r1 = self::c_func_delete_type_data_map($client_id, $key, $user_id, $member_id, $measure_id, $delObj->archive_dt);
            if ($r1 == null || !is_object($r1) || $r1->code != 0) {
                $ret->code = -1;
                $ret->msg = 'delete failed! [-1001]';
            } else {
                $r2 = self::c_func_delete_archive_data_map($client_id, $key, $user_id, $member_id, $measure_id, $delObj->archive_dt);
                if ($r2 == null || !is_object($r2) || $r2->code != 0) {
                    $ret->code = -1;
                    $ret->msg = 'delete failed! [-1002]';
                }
            }
        }

        return $ret;
    }

    /**
     * 拉取指定登录用户下指定成员的归档数据列表
     *
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param string $user_id //登录的用户id
     * @param string $member_id //归档到的家庭成员id
     * @param int $paper_type //指定检测类型（1-血糖 2-胆固醇 3-甘油三脂 4-尿酸）
     * @param int $page_idx //当前分页的索引号，从1开始
     * @param int $page_count //当前页数量，最大不超过200
     * @param int $sort //返回数据排序类型 int（0正序 1降序，默认为1）
     * @return mixed
     */
    public static function getArchivedList($client_id, $key, $user_id, $member_id, $paper_type = -1, $page_idx = 1, $page_count = 10, $sort = 1)
    {
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][args]: ' . json_encode(func_get_args()));

        $ret = new \stdClass();
        $ret->code = -1;
        $ret->msg = 'failed';

        //检验是否在指定允许检测类型范围内，否则不指定第3个主键关联
        if (!in_array($paper_type, Type::MEASURE_TYPES)) {
            //拉取所有类型检测数据
            $result = (new BaseApi())->pullCloud($client_id, $key, self::$TB_ARCHIVE_DATA_MAP, $user_id, $member_id, null, $page_idx, $page_count, $sort);
            LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-get->tb_archive_data_map][result]: ' . json_encode($result));
            /*-{
                "code": 0,
                "msg": "success",
                "list": [
                    {
                    "data_type": "13",//表示数据表tb_archive_data_map
                    "primary_key": "uid-1",//在tb_archive_data_map表示"user_id"
                    "secondary_key": "member-id-1",//在tb_archive_data_map中表示"member_id"
                    "third_key": "1", //在tb_type_data_map表示"measure_id"
                    "data": "measuire-id-3",//在tb_type_data_map表示"归档的json数据串"
                    "cloud_dt": "2019-05-08 10:52:22"//归档服务器记录的时间（即push时刻）
                    }
                ],
                "total_count": 1
            }*/
            if (!is_null($result) && is_object($result) && is_array($result->list)) {
                $ret->code = 0;
                $ret->msg = 'success';
                $ret->page = $page_idx;
                $ret->page_size = $page_count;
                $ret->total_count = $result->total_count;
                $ret->list = [];

                // 注意：数据处理，把我方内部定义的类似"primary_key、secondary_key、third_key、cloud_dt"这种key再次转换成，
                // 变成具体的指定类型，以提供给第三方
                foreach ($result->list as $item) {
                    $copy = new \stdClass();
                    $copy->user_id = $item->primary_key;//primary_key: user_id
                    $copy->member_id = $item->secondary_key;//primary_key: member_id
                    $copy->measure_id = $item->third_key;//third_key: measure_id
                    $copy->paper_type = "";//TODO tb_archive_data_map设计表中没有paper_type字段存储
                    $copy->data = $item->data;//检测数值
                    $copy->archive_dt = $item->cloud_dt;//归档服务器记录的时间（即push时刻）

                    $ret->list[] = $copy;//添加到新数组
                }
            } else {
                $ret->code = -1;
                $ret->msg = 'failed![-1001]';
            }
        } else {
            //拉取指定类型检测数据
            //1.根据"user_id+member_id+type"拉取指定measure_id，操作表tb_type_data_map
            $r1 = (new BaseApi())->pullCloud($client_id, $key, self::$TB_TYPE_DATA_MAP, $user_id, $member_id, $paper_type, $page_idx, $page_count, $sort);
            LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-get->tb_type_data_map][result]: ' . json_encode($r1));
            if (!is_null($r1) && is_object($r1) && $r1->code == 0) {
                $ret->code = 0;
                $ret->msg = 'success';
                $ret->page = $page_idx;
                $ret->page_size = $page_count;
                $ret->total_count = $r1->total_count;
                $ret->list = [];

                // 注意：数据处理，把我方内部定义的类似"primary_key、secondary_key、third_key、cloud_dt"这种key再次转换成，
                // 变成具体的检测类型-检测id
                /*-{
                    "code": 0,
                    "msg": "success",
                    "list": [
                        {
                            "data_type": "12",//表示数据表tb_type_data_map
                            "primary_key": "uid-1",//在tb_type_data_map表示"user_id"
                            "secondary_key": "member-id-1",//在tb_type_data_map中表示"member_id"
                            "third_key": "1", //在tb_type_data_map表示"paper_type"
                            "data": "measuire-id-3",//在tb_type_data_map表示"measure_id"
                            "cloud_dt": "2019-05-08 10:52:22"
                        }
                    ]
                }*/

                //-->得到指定的"measure_id"集合
                $specified_measure_ids = [];
                foreach ($r1->list as $item) $specified_measure_ids[] = $item->data;

                //-->通过measure_id查询具体的检测数据
                foreach ($specified_measure_ids as $sm_id) {
                    $item = self::c_func_get_archived_data_item($client_id, $key, $user_id, $member_id, $sm_id, $sort);
                    if ($item != null) {
                        $copy = new \stdClass();
                        $copy->user_id = $item->user_id;
                        $copy->member_id = $item->member_id;
                        $copy->paper_type = $paper_type;
                        $copy->measure_id = $item->measure_id;
                        $copy->data = $item->data;//检测数值: measure-json串
                        $copy->archive_dt = $item->archive_dt;//归档服务器记录的时间（即push时刻）

                        $ret->list[] = $copy;
                    }
                }

            } else {
                $ret->code = -1;
                $ret->code = 'failed![-1001]';
            }
        }

        return $ret;
    }

    /**
     * 拉取所有未归档的检测记录（说明：使用"/cws/api/measure/"接口）
     *
     * 请求参数：
     *      client_id：10005，类型 int
     *      key：BuClta5T（md5加密后传输），类型 string
     *      dev_id：设备id，类型 string
     *      begin_dt：开始时间（格式：2019-01-01 00:00:00），类型 string
     *      end_dt：结束时间（格式：2019-01-01 00:00:00），类型 string
     *      sign：签名字符串，类型 string
     *
     * 签名字符串生成方法：
     *      1、拼接源字符串：
     *          client_id=10005,key=md5("BuClta5T"),dev_id=2018021812358952,begin_dt=2019-01-01 00:00:00,end_dt=2019-01-02 00:00:00
     *      2、将拼接的字符串使用md5加密
     *
     * @param $paramJson //GET请求参数封装在该json对象
     * @return mixed
     */
    public static function getUnarchivedList($paramJson)
    {
        $paramsStr = '';
        if ($paramJson != null && is_object($paramJson)) {
            foreach ($paramJson as $key => $value) {
                $paramsStr .= $key . '=' . $value . '&';
            }
            $paramsStr = substr($paramsStr, 0, strlen($paramsStr) - 1);
        } else {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> "paramJson" is not a JsonObject! [$paramJson]=' . json_encode($paramJson));
        }

        $url = CWS_URL_3RD_MEASURE_QUERY . '?' . $paramsStr;
        $result = MyHttpManager::httpRequest(MyHttpManager::M_GET, $url);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> url[GET]: ' . $url);
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);

        return json_decode($result);
    }

    /**
     * 查询未归档检测记录列表（说明：使用P-10010接口）
     *
     * @param $head //头信息json。例如：四川广电510094，每次接口转发服务器都会生成一个session，故不能用本地session取值。
     * @param int $page //页号，从1开始
     * @param int $page_size //每页返回条数，从1开始
     * @return array|mixed result[0:成功, -1:session校验失败, -2:失败, -999:请求失败]
     */
    public static function getUnarchivedListV2($head, $page = 1, $page_size = 10)
    {
        $ret = new \stdClass();
        $ret->code = 0;
        $ret->msg = 'success';

        $http = new HttpManager(HttpManager::PACK_ID_HEALTH_CHECK_QUERY_NOT_ARCHIVE_RECORD);
        $http->setUserId($head->lm_userId);
        $http->setSessionId($head->lm_sessionId);
        $http->setLoginId($head->lm_loginId);
        $json = array(
            "dev_mac_addr" => "",//无效，后台还是先通过user_id查询对应绑定的设备号
            "current_page" => $page,
            "page_num" => $page_size,
        );
        $result = json_decode($http->requestPost($json));

        LogUtils::info("[" . __CLASS__ . "][" . __FUNCTION__ . "] ---> [P10010][input_param]: " . json_encode($json));
        LogUtils::info("[" . __CLASS__ . "][" . __FUNCTION__ . "] ---> [P10010][result]: " . json_encode($result));

        if ($result != null && is_object($result) && $result->result == 0) {
            $ret->code = $result->result;
            $ret->msg = 'success';
            $ret->page = $page;
            $ret->page_size = $page_size;
            $ret->total_count = $result->count;
            $ret->list = [];

            // 转换数据格式给第三方
            foreach ($result->list as $item) {
                $convertObj = new \stdClass();
                $convertObj->measure_id = $item->measure_id;
                $convertObj->dev_id = $item->dev_mac_addr;
                $convertObj->type = intval($item->extra_data1);
                $convertObj->data = $item->extra_data2;
                $convertObj->measure_dt = $item->measure_dt;
                $ret->list[] = $convertObj;
            }
        } else {
            $ret->code = $result->result;
            $ret->msg = $result->result == -201 ? 'You never bind device id yet!' : 'failed!';
        }

        return $ret;
    }

    /**
     * 删除检测数据，即未归档数据
     *
     * 请求参数：
     *      client_id：10005，类型 int
     *      key：BuClta5T（md5加密后传输），类型 string
     *      measure_id：测量id，类型 string
     *      sign：签名字符串，类型 string
     *
     * 签名字符串生成方法：
     *      1、拼接源字符串：
     *          client_id=10005,key=md5("BuClta5T"),measure_id=12321324565656
     *      2、将拼接的字符串使用md5加密
     *
     * @param $paramJson //GET请求参数封装在该json对象
     * @return mixed
     */
    public static function deleteUnarchived($paramJson)
    {
        $paramsStr = '';
        if ($paramJson != null && is_object($paramJson)) {
            foreach ($paramJson as $key => $value) {
                $paramsStr .= $key . '=' . $value . '&';
            }
            $paramsStr = substr($paramsStr, 0, strlen($paramsStr) - 1);
        } else {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> "paramJson" is not a JsonObject! [$paramJson]=' . json_encode($paramJson));
        }

        $url = CWS_URL_3RD_MEASURE_DELETE . '?' . $paramsStr;
        $result = MyHttpManager::httpRequest(MyHttpManager::M_GET, $url);

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> url[GET]: ' . $url);
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> result: ' . $result);

        return json_decode($result); // {"code":0,"msg":"success"}
    }

    /**
     * 根据measure_id查询归档在某成员id下的那条详情数据
     *
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param string $user_id //登录的用户id
     * @param string $member_id //归档到的家庭成员id
     * @param string $measure_id //检测记录id
     * @param int $sort //返回数据排序类型 int（0正序 1降序，默认为1）
     * @return \stdClass|null
     */
    private static function c_func_get_archived_data_item($client_id, $key, $user_id, $member_id, $measure_id, $sort)
    {
        $result = (new BaseApi())->pullCloud($client_id, $key, self::$TB_ARCHIVE_DATA_MAP, $user_id, $member_id, $measure_id, 1, 1, $sort);
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-get->tb_archive_data_map][result]: ' . json_encode($result));
        /*{
            "code": 0,
            "msg": "success",
            "list": [
                {
                    "data_type": "12", //表示数据表tb_type_data_map
                    "primary_key": "12345", //在表tb_type_data_map表示user_id
                    "secondary_key": "1101", //在表tb_type_data_map表示member_id
                    "third_key": "1", //在表tb_type_data_map表示measure_id
                    "data": "test data1222", //在表tb_type_data_map表示检测数值: 具体的measure-json串
                    "cloud_dt": "2019-04-02 21:54:43" //归档服务器记录的时间（即push时刻）
                }
            ],
            "total_count": 1
        }*/

        $copy = null;
        if (!is_null($result) && is_object($result) && is_array($result->list) && count($result->list) > 0) {
            // 数据处理，把我方内部定义的类似"primary_key、secondary_key、third_key、cloud_dt"这种key再次转换成，
            // 变成具体的指定类型，以提供给第三方
            $item = $result->list[0];

            $copy = new \stdClass();
            $copy->user_id = $item->primary_key;//primary_key: user_id
            $copy->member_id = $item->secondary_key;//primary_key: member_id
            $copy->measure_id = $item->third_key;//third_key: measure_id
            $copy->data = $item->data;//检测数值: 具体的measure-json串
            $copy->archive_dt = $item->cloud_dt;//归档服务器记录的时间（即push时刻）
        }
        return $copy;
    }

    /**
     * 从检测type-检测id关系映射表"tb_type_data_map"中根据"归档日期"解除关系。
     *
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param string $user_id //登录的用户id
     * @param string $member_id //归档到的家庭成员id
     * @param string $measure_id //检测记录id
     * @param string $archive_dt //归档日期
     * @return mixed {"code":0,"msg":"success"}
     */
    private static function c_func_delete_type_data_map($client_id, $key, $user_id, $member_id, $measure_id, $archive_dt)
    {
        $result = (new BaseApi())->deleteCloud($client_id, $key, self::$TB_TYPE_DATA_MAP, $user_id, $member_id, null, $archive_dt);
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-delete->tb_type_data_map][result]: ' . json_encode($result));
        return $result;
    }

    /**
     * 从归档成员-检测id映射表"tb_archive_data_map"中根据"measure_id"删除记录。
     *
     * @param int $client_id //客户端id，10005
     * @param string $key //BuClta5T（客户端需要md5加密后传输）
     * @param string $user_id //登录的用户id
     * @param string $member_id //归档到的家庭成员id
     * @param string $measure_id //检测记录id
     * @param string $archive_dt //归档日期
     * @return mixed {"code":0,"msg":"success"}
     */
    private static function c_func_delete_archive_data_map($client_id, $key, $user_id, $member_id, $measure_id, $archive_dt)
    {
        $result = (new BaseApi())->deleteCloud($client_id, $key, self::$TB_ARCHIVE_DATA_MAP, $user_id, $member_id, $measure_id, $archive_dt);
        LogUtils::info('[' . __FILE__ . '][' . __FUNCTION__ . '][db-delete->tb_archive_data_map][result]: ' . json_encode($result));
        return $result;
    }
}