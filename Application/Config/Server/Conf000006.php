<?php

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示内网测试服
 */
define("USE_SERVER",1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_HOST', "http://202.99.114.152:30207");                                       // cws服务器主机地址
        define('SERVER_URL', "http://202.99.114.152:30207/cws/index.php?");                            // cws服务器访问地址
        define('RESOURCES_URL', "http://202.99.114.152:30218");                                     // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://202.99.114.152:30207/cws/pay/chinaunicom/callback/apk_slh_index.php"); // 购结果上传到CWS
        define('CANCEL_VIP_CALL_BACK_URL', "http://202.99.114.152:30207/cws/pay/chinaunicom/callback/web_unsub2_index.php"); // 退订上报结果（新的退订接口）
        define('REPORT_ORDER_INFO_URL', "http://202.99.114.152:30207/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://202.99.114.152:30207/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://202.99.114.152:30207/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://202.99.114.152:30207/cws/report/query_report.php");

        // Redis模块
//        define('REDIS_LOCAL_IP', "127.0.0.1");                                                      // redis本地服务器ip
//        define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口
//        define('APP_ROOT_PATH', "http://202.99.114.152:30207/epg-lws-for-apk");
        break;

    case 2:
        // 本地内网测试服
        define('SERVER_HOST', "http://test-healthiptv.langma.cn:8100");                         // cws服务器主机地址
        define('SERVER_URL', SERVER_HOST . "/cws/index.php?");                                  // cws服务器访问地址
        define('RESOURCES_URL', "http://test-healthiptv.langma.cn:8091");                       // 文件服务器访问地址
        define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/pay/order/order.php");              // 订购上报地址
        define('ORDER_CALL_BACK_URL', SERVER_HOST . "/cws/pay/chinaunicom/callback/apk_slh_index.php"); // 购结果上传到CWS
        // Redis模块
        define('REDIS_LOCAL_IP', "127.0.0.1");                                                  // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");
        break;
}

