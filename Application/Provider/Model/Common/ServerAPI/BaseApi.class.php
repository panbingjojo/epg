<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [提供给第三方使用的通用底层接口]：
// |    1. 非通用，即与具体业务模块耦合度大的建议不要放在该BaseApi里，该模块内封装
// | 的系列接口均为通用、复用的。所以业务相关的建议直接写在具体的业务模块里即可！！！
// |
// |    2. cws层提供的，复用各种类型，谨慎修改！！！
// | [../Application/Config/Server/Conf{$地区ID}.php地区应用时切记配置如下]：
//   // *************** 提供给第三方接口使用cws/other接口 [START] ***************//
//   define('CWS_URL_WX_SERVER', "http://test-healthiptv.langma.cn:8100/cws/wxserver"); //wxserver微信小程序模块cws
//   define('CWS_URL_WX_SERVER_ENTRY', "http://test-healthiptv.langma.cn:8100/cws/wxserver/index.php?"); //wxserver微信小程序模块cws入口地址
//   define("CWS_URL_COMMON_CLOUD_PUSH", "http://test-healthiptv.langma.cn:8100/cws/api/cloud/push.php"); //通用接口：存储数据到云端
//   define("CWS_URL_COMMON_CLOUD_PULL", "http://test-healthiptv.langma.cn:8100/cws/api/cloud/pull.php"); //通用接口：从云端拉取数据
//   define("CWS_URL_COMMON_CLOUD_DELETE", "http://test-healthiptv.langma.cn:8100/cws/api/cloud/delete.php"); //通用接口：删除云端数据
//   define("CWS_URL_3RD_MEASURE_QUERY", "http://test-healthiptv.langma.cn:8100/cws/api/measure/query.php"); //提供第三方"健康检测"接口：获取健康检测未归档原始数据
//   define("CWS_URL_3RD_MEASURE_DELETE", "http://test-healthiptv.langma.cn:8100/cws/api/measure/query.php"); //提供第三方"健康检测"接口：删除检测数据
//   // *************** 提供给第三方接口使用cws/other接口 [END] ***************//
// |    注意，其中"ip:port"根据部署服务器配置！
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/04/2 17:29
// +----------------------------------------------------------------------

namespace Provider\Model\Common\ServerAPI;


use Home\Model\Common\LogUtils;
use Provider\Model\Common\MyHttpManager;

/**
 * Class BaseApi 通用CURD操作接口基类API封装
 * @package Provider\Model\Common\ServerAPI
 */
class BaseApi
{
    /**
     * 存储数据
     *
     * @param int $client_id //客户端id，10005，类型 int
     * @param string $key //BuClta5T（md5加密后传输），类型 string
     * @param int $data_type //数据类型，类型 int（可自定义，范围：0~100）
     * @param string $data //要存储的数据，类型 string（最大长度10000）
     * @param string|null $primary_key //第一主键，类型 string（最大长度100，不允许为空字符串或null）
     * @param string|null $secondary_key //第二主键，类型 string（最大长度100，为空字符串或null时，当成空字符串处理）
     * @param string|null $third_key //第三主键，类型 string（最大长度100，为空字符串或null时，当成空字符串处理）
     * @return mixed {"code":0,"msg":"success"}
     */
    public final function pushCloud($client_id, $key, $data_type, $data,
                                    $primary_key, $secondary_key, $third_key)
    {
        $json = array(
            'client_id' => $client_id,
            'key' => $key,
            'data_type' => $data_type,
            'data' => $data,
            'primary_key' => $primary_key,
            'secondary_key' => is_null($secondary_key) || $secondary_key === '' ? null : $secondary_key,
            'third_key' => is_null($third_key) || $third_key === '' ? null : $third_key,
        );

        $result = MyHttpManager::httpRequest(MyHttpManager::M_POST, CWS_URL_COMMON_CLOUD_PUSH, $json);

        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] --->[input_param] : ' . json_encode($json));
        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] --->[result] : ' . $result);

        return json_decode($result);
    }

    /**
     * 拉取数据
     *
     * @param int $client_id //客户端id，10005，类型 int
     * @param string $key //BuClta5T（md5加密后传输），类型 string
     * @param int $data_type //数据类型，类型 int（可自定义，范围：0~100）
     * @param string $primary_key //第一主键，类型 string（最大长度100，不允许为空字符串或null）
     * @param string|null $secondary_key //第二主键，类型 string（最大长度100，为空字符串或null时，不生效）
     * @param string|null $third_key //第三主键，类型 string（最大长度100，为空字符串或null时，不生效）
     * @param int $page_idx //当前页索引，类型 int（从1开始）
     * @param int $page_count //当前页数量，类型 int（最大数量200）
     * @param int $order_rule //按push的时间排序规则，类型 int（0正序 1降序，默认为1）
     * @return mixed {"code":0,"msg":"success",total_count:10,list[]}
     */
    public final function pullCloud($client_id, $key, $data_type,
                                    $primary_key, $secondary_key = null, $third_key = null,
                                    $page_idx = 1, $page_count = 10, $order_rule = 1)
    {
        // 底层加强可枚举参数校验，若不在范围内，则使用默认值
        $order_rule = in_array($order_rule, [0, 1]) ? $order_rule : 1;

        $json = array(
            'client_id' => $client_id,
            'key' => $key,
            'data_type' => $data_type,
            'primary_key' => $primary_key,
            'secondary_key' => is_null($secondary_key) || $secondary_key === '' ? null : $secondary_key,
            'third_key' => is_null($third_key) || $third_key === '' ? null : $third_key,
            'order_rule' => $order_rule,
            'page_idx' => $page_idx,
            'page_count' => $page_count,
        );

        $result = MyHttpManager::httpRequest(MyHttpManager::M_POST, CWS_URL_COMMON_CLOUD_PULL, $json);

        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] --->[input_param] : ' . json_encode($json));
        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] --->[result] : ' . $result);

        return json_decode($result);
    }

    /**
     * 删除数据
     *
     * @param int $client_id //客户端id，10005，类型 int
     * @param string $key //BuClta5T（md5加密后传输），类型 string
     * @param int $data_type //数据类型，类型 int（可自定义，范围：0~100）
     * @param string|null $primary_key //第一主键，类型 string（最大长度100，为空字符串或null时，删除指定data_type的全部数据）
     * @param string|null $secondary_key //第二主键，类型 string（最大长度100，为空字符串或null时，删除指定data_type、primary_key的全部数据）
     * @param string|null $third_key //第三主键，类型 string（最大长度100，为空字符串或null时，删除指定data_type、primary_key、secondary_key的全部数据）
     * @param string $cloud_dt //存储时间(即push数据时记录的dt)，类型 string（格式：2019-04-02 12:00:00）
     * @return mixed {"code":0,"msg":"success"}
     */
    public final function deleteCloud($client_id, $key, $data_type,
                                      $primary_key, $secondary_key, $third_key,
                                      $cloud_dt = null)
    {
        $json = array(
            'client_id' => $client_id,
            'key' => $key,
            'data_type' => $data_type,
            'primary_key' => $primary_key,
            'secondary_key' => is_null($secondary_key) || $secondary_key === '' ? null : $secondary_key,
            'third_key' => is_null($third_key) || $third_key === '' ? null : $third_key,
            'cloud_dt' => $cloud_dt,
        );

        $result = MyHttpManager::httpRequest(MyHttpManager::M_POST, CWS_URL_COMMON_CLOUD_DELETE, $json);

        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] --->[input_param] : ' . json_encode($json));
        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] --->[result] : ' . $result);

        return json_decode($result);
    }

    /**
     * 更新数据
     *
     * 谨慎调用：由于现在cws没有提供update接口，故先使用delete->再push替换作为更新。避免某些参数（primary_key、secondary_key、third_key）
     * 等某一个为空或null时，删除的范围扩大了。
     *
     * @param int $client_id //客户端id，10005，类型 int
     * @param string $key //BuClta5T（md5加密后传输），类型 string
     * @param int $data_type //数据类型，类型 int（可自定义，范围：0~100）
     * @param string $data //要存储的数据，类型 string（最大长度10000）
     * @param string|null $primary_key //第一主键，类型 string（最大长度100，为空字符串或null时，删除指定data_type的全部数据）
     * @param string|null $secondary_key //第二主键，类型 string（最大长度100，为空字符串或null时，删除指定data_type、primary_key的全部数据）
     * @param string|null $third_key //第三主键，类型 string（最大长度100，为空字符串或null时，删除指定data_type、primary_key、secondary_key的全部数据）
     * @param string|null $cloud_dt //存储时间(即push数据时记录的dt)，类型 string（格式：2019-04-02 12:00:00）
     * @return mixed {"code":0,"msg":"success"}
     */
    public final function updateCloud($client_id, $key, $data_type, $data,
                                      $primary_key, $secondary_key, $third_key,
                                      $cloud_dt = null)
    {
        // 1. delete
        $retDelete = $this->deleteCloud($client_id, $key, $data_type, $primary_key, $secondary_key, $third_key, $cloud_dt);
        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '][delete old] --->[result] : ' . json_encode($retDelete));

        if ($retDelete->code == 0) {
            // 2. push
            $retPush = $this->pushCloud($client_id, $key, $data_type, $data, $primary_key, $secondary_key, $third_key);
            LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '][push new] --->[result] : ' . json_encode($retPush));
        } else {
            $retPush = null;
        }

        $isUpdated = !is_null($retPush) && $retPush != '' && $retPush->code == 0;
        $result = array(
            'code' => $isUpdated ? $retPush->code : -1,
            'data' => $data,
            'msg' => $isUpdated ? 'update success' : 'update failed',
        );
        return $result;
    }

    /**
     * 根据参数的json对象，拼接成GET请求所需的通过"&"连接的格式。例如：k1=v1&k2=v2&...
     *
     * @param $paramJson //请求参数json对象或者关联数组。如果没有传递null或者空。
     * @param $domainUrl //如果提供有效domainUrl，则将其与参数直接组装成完整的请求url。例如：http://abc/yyy/func.php?k1=v1&k2=v2&...
     * @return string
     */
    public static function jointGetParams($paramJson, $domainUrl = null)
    {
        $jointKVStr = '';
        if ($paramJson != null && (is_object($paramJson) || is_array($paramJson))) {
            foreach ($paramJson as $key => $value) {
                $jointKVStr .= $key . '=' . $value . '&';
            }
            $jointKVStr = substr($jointKVStr, 0, strlen($jointKVStr) - 1);
        } else {
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> "paramJson" is not a JsonObject! [$paramJson]=' . json_encode($paramJson));
        }


        $httpUrl = '';
        if (is_string($domainUrl) && strlen($domainUrl) > 0) {
            $httpUrl = $domainUrl . (strlen($jointKVStr) > 0 ? '?' . $jointKVStr : '');
        }

        // 记录日志
        LogUtils::info('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> url[GET]: ' . $httpUrl);

        return $httpUrl;
    }

    /**
     * 转换为curl请求header所需的array格式，以array返回。
     *
     * @param array $header //http请求头，关联数组
     * @return array
     */
    public static function convertToCurlHeader(array $header = null)
    {
        $curlHeader = array();
        if ($header != null && is_array($header)) {
            foreach ($header as $key => $value) {
                $curlHeader[] = "$key:$value";
            }
        }
        return $curlHeader;
    }
}
