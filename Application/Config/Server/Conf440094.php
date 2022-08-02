<?php
/**
 * Created by longmaster
 * Brief: 广东广电EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示北京正式服
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_URL', "http://127.0.0.1:10000/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://172.31.134.185:10004/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://127.0.0.1:10000/cws/pay/guangdonggd/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://127.0.0.1:10000/cws/report/query_report.php");

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10000/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        define('APP_ROOT_PATH', "http://172.31.134.185:10001");            //  应用入口地址

        break;

    case 2:
        // 北京正式服
        define('SERVER_URL', "http://203.132.32.92:10000/cws/index.php?");
        define('RESOURCES_URL', "http://203.132.32.92:10004/fs");
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/guangdonggd/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");// 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.85.144.70:8100/cws/report/query_report.php");

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

//        define('CWS_HLWYY_URL', "http://10.254.30.100:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
//        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 3:
        // 本地测试服
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?");
        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/guangdonggd/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");// 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.85.144.70:8100/cws/report/query_report.php");

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

//        define('CWS_HLWYY_URL', "http://10.254.30.100:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
//        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}