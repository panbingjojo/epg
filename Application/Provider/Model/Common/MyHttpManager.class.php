<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// + HTTP 请求管理类：
// +----------------------------------------------------------------------
// + 主要应用在提供给第三方使用的接口的场景下
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/1 18:43
// +----------------------------------------------------------------------

namespace Provider\Model\Common;

use Home\Model\Common\LogUtils;
use Home\Model\Common\Utils;


class MyHttpManager
{
    // 请求method
    const M_GET = "GET";
    const M_POST = "POST";

    // 健康检查，约定命名为：PACK_ID_HEALTH_CHECK_{XXX}
    const PACK_ID_HEALTH_CHECK_GET_BIND_MAC_ADDR = "10001";                     // 获取用户绑定设备的mac地址
    const PACK_ID_HEALTH_CHECK_BIND_DEVICE_ID = "10002";                        // 用户绑定设备
    const PACK_ID_HEALTH_CHECK_SET_PUSH_MSG = "10003";                          // 设置消息推送信息
    const PACK_ID_HEALTH_CHECK_GET_DIFF_MOMENT_CONFIG = "10004";                // 拉取时段和就餐状态配置
    const PACK_ID_HEALTH_CHECK_ARCHIVE_INSPECT_RECORD = "10008";                // 归档数据
    const PACK_ID_HEALTH_CHECK_QUERY_MEMBER_INSPECT_RECORD = "10009";           // 查询家庭成员检测记录
    const PACK_ID_HEALTH_CHECK_QUERY_NOT_ARCHIVE_RECORD = "10010";              // 查询未归档数据
    const PACK_ID_HEALTH_CHECK_DELETE_NOT_ARCHIVE_RECORD = "10011";             // 删除未归档数据
    const PACK_ID_HEALTH_CHECK_QUERY_MEMBERS_WITH_INSPECT_RECORD = "10012";     // 查询有检测记录的家庭成员
    const PACK_ID_HEALTH_CHECK_QUERY_LATEST_MEASURE_RECORD = "10013";           // 查询最新的检测数据（新疆电信EPG）

    // 包头
    private $mPackId;            // 包Id

    // 构造函数
    function __construct($packId)
    {
        $this->mPackId = $packId;
    }

    /**
     * 设置访问接口Id
     * @param $packId
     */
    public function setPackId($packId)
    {
        $this->mPackId = $packId;
    }

    /**
     * Post 请求数据
     * @param $requestData //请求参数
     * @param $serverUrl //请求地址url
     * @return mixed
     */
    public function requestPost($requestData, $serverUrl = null)
    {
        $result = "";
        $beginTime = Utils::getMillisecond();
        $serverUrl = $serverUrl == null ? SERVER_URL : $serverUrl;

        //组装Post 数据
        $postData = array('head' => json_encode($this->packageHeader()), 'json' => json_encode($requestData));

        //设置选项
        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
        );

        //记录日志
        LogUtils::info("[MyHttpManager][requestPost] ---> [URL]: " . $serverUrl . 'head=' . json_encode($this->packageHeader()) . '&json=' . json_encode($requestData));

        //请求数据
        $http = curl_init($serverUrl);
        curl_setopt_array($http, $options);
        try {
            $result = curl_exec($http);
        } finally {
            curl_close($http);
        }

        $costTime = Utils::getMillisecond() - $beginTime;

        //记录日志
        LogUtils::info("[MyHttpManager][requestPost] costTime[.$costTime.ms][P$this->mPackId] ---> [URL-RESULT]: $result");

        return $result;
    }

    /**
     * 全局的数据请求接口，不需要封装包头，直接请求对应的url。
     * @param $method //method: GET/POST
     * @param $url //请求serverUrl
     * @param $data //请求参数：仅当$method为post有有效。若$method为get，则$data可以为null或者不提供
     * @param bool $printLog //是否打印日志。默认打印：true
     * @return mixed
     */
    public static function httpRequest($method, $url, $data = null, $printLog = true)
    {
        $beginTime = Utils::getMillisecond();
        $result = "";
        if (strtoupper($method) === "GET") {
            $header = array();
            $http = curl_init();
            curl_setopt($http, CURLOPT_URL, $url);
            curl_setopt($http, CURLOPT_HTTPHEADER, $header);
            curl_setopt($http, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($http, CURLOPT_BINARYTRANSFER, true);
            curl_setopt($http, CURLOPT_HEADER, 0);
            curl_setopt($http, CURLOPT_SSL_VERIFYPEER, false);//去掉http的ssl证书验证
            try {
                $result = curl_exec($http);
            } finally {
                curl_close($http);
            }
        } else if (strtoupper($method) === "POST") {
            //设置选项
            $options = array(
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HEADER => false,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $data,
            );

            //请求数据
            $http = curl_init($url);
            curl_setopt_array($http, $options);
            curl_setopt($http, CURLOPT_SSL_VERIFYPEER, false);//去掉http的ssl证书验证
            try {
                $result = curl_exec($http);
            } finally {
                curl_close($http);
            }
        }
        $costTime = Utils::getMillisecond() - $beginTime;
        if ($printLog) {
            LogUtils::info("[MyHttpManager][requestPost] costTime[.$costTime.ms] ---> [URL-RESULT]: $result");
        }
        return $result;
    }

    /**
     * 全局的数据请求接口，需要传入http头部信息。
     * @param $method //method: GET/POST
     * @param $url //请求serverUrl
     * @param $header //头部信息，数组
     * @param $data //请求参数，数组
     * @return mixed
     */
    public static function httpRequestByHeader($method, $url, $header, $data = null)
    {
        $beginTime = Utils::getMillisecond();
        $result = "";
        if (strtoupper($method) === "GET") {
            $http = curl_init();
            curl_setopt($http, CURLOPT_URL, $url);
            curl_setopt($http, CURLOPT_HTTPHEADER, $header);
            curl_setopt($http, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($http, CURLOPT_BINARYTRANSFER, true);
            curl_setopt($http, CURLOPT_HEADER, 0);
            curl_setopt($http, CURLOPT_SSL_VERIFYPEER, false);//去掉http的ssl证书验证
            try {
                $result = curl_exec($http);
            } finally {
                curl_close($http);
            }
        } else if (strtoupper($method) === "POST") {
            //设置选项
            $options = array(
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HEADER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $data,
            );

            //请求数据
            $http = curl_init($url);
            curl_setopt_array($http, $options);
            curl_setopt($http, CURLOPT_HTTPHEADER, $header);
            curl_setopt($http, CURLOPT_SSL_VERIFYPEER, false);//去掉http的ssl证书验证
            try {
                $result = curl_exec($http);
            } finally {
                curl_close($http);
            }
        }

        //记录日志
        $costTime = Utils::getMillisecond() - $beginTime;
        LogUtils::info("[MyHttpManager][httpRequestByHeader] costTime[.$costTime.ms] ---> [URL-RESULT]: $result");
        return $result;
    }

    /**
     * 封装访问包头
     * @return array 返回包头
     */
    public function packageHeader()
    {
        return array(
            "pack_id" => $this->mPackId,
        );
    }
}