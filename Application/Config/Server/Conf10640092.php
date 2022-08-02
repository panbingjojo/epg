<?php
/**
 * Created by longmaster
 * Brief: 宁夏电信EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示内网测试服
 * 3、本地外网测试服
 * 4、VPN走正式服
 */
define("USE_SERVER",1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_URL', "http://192.168.121.136:10000/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://124.224.242.242:10401/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALLBACK', "http://192.168.121.136:10000/cws/pay/ningxiadx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://192.168.121.136:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://192.168.121.136:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://192.168.121.136:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://192.168.121.136:10000/cws/report/query_report.php");

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 2:
        // 本地内网测试服
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://10.254.30.100:8091/");
        define('ORDER_CALLBACK', "http://10.254.30.100:8100/cws/pay/ningxiadx/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.254.30.100:8100/cws/report/query_report.php");

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis
        //define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        //define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 3:
        // 本地外网测试服
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?");
        define('RESOURCES_URL', "http://222.85.144.70:8091/");
        define('ORDER_CALLBACK', "http://222.85.144.70:8100/cws/pay/ningxiadx/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.85.144.70:8100/cws/report/query_report.php");

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis
        //define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        //define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 4:
        // VPN 走正式服
        define('SERVER_URL', "http://123.59.206.196:20021/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://123.59.206.196:20003/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALLBACK', "http://123.59.206.196:20021/cws/pay/ningxiadx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.196:20021/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://123.59.206.196:20021/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://123.59.206.196:20021/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://123.59.206.196:20021/cws/report/query_report.php");

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');


        // Redis
        //define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        //define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}
