<?php
/**
 * Created by longmaster
 * Brief: 重庆电信EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服
 * 3、表示内网测试服
 */
define("USE_SERVER", 3);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_URL', "http://127.0.0.1:10000/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://172.23.51.86:10001/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://127.0.0.1:10000/cws/pay/chongqingdx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://127.0.0.1:10000/cws/report/query_report.php");

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // redis
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 2:
        // 现网进入3983 使用现网数据
        define('SERVER_URL', "http://127.0.0.1:10000/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://172.23.51.86:10001/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://127.0.0.1:10000/cws/pay/chongqingdx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://127.0.0.1:10000/cws/report/query_report.php");

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

//        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 3:
        // 本地内网测试服
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://10.254.30.100:8091/");
        define('ORDER_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/chongqingdx/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.254.30.100:8100/cws/report/query_report.php");

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 4:
        // 公司读取北京服务器的数据
        define('SERVER_URL', "http://123.59.206.199:50017/cws/index.php?");
        define('RESOURCES_URL', "http://123.59.206.199:20003/fs");
        define('ORDER_CALL_BACK_URL', "http://123.59.206.199:50017/cws/pay/chongqingdx/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.199:50017/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://123.59.206.199:50017/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://123.59.206.199:50017/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://123.59.206.199:50017/cws/report/query_report.php");

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}