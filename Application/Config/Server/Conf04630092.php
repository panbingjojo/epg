<?php
/**
 * Created by longmaster
 * Brief: 青海电信EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服 （北京测试服）
 * 3、表示内网测试服
 * 4、VPN走正式服 (在公司访问正式服)
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_ENTRY_ADDR', "http://223.221.36.146:10000");  //现网 - cws服务器访问地址
        define('SERVER_URL', "http://127.0.0.1:10000/cws-game/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://223.221.36.146:10002/fs"); //现网 - 文件服务器访问地址
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws-game/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws-game/report/query_check.php");
        define('ORDER_CALL_BACK_URL', "http://127.0.0.1:10000/cws-game/pay/qinghaidx/callback/game-index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws-game/report/index.php"); // 现网 - 上报订购信息
        define('SERVER_CONTROL_UNIT', "http://223.221.36.146:10015"); //落地电话控制中心地址

        // Redis
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 2:
        // 现网进入3983
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?");
        define('RESOURCES_URL', "http://223.221.36.146:10014");
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/qinghaidx/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");

        // Redis
        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 3:
        // 本地内网测试服
        define('SERVER_ENTRY_ADDR', "http://10.254.30.100:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://test-healthiptv-fs.langma.cn:8091/");
        define('QUERY_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query_check.php");
        define('ORDER_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/qinghaidx/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");

        // Redis
        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 4:
        // VPN 走正式服
        define('SERVER_ENTRY_ADDR', "http://223.221.36.146:10000"); // 提供给APK插件使用
        define('SERVER_URL', "http://223.221.36.146:10000/cws-game/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://223.221.36.146:10002/fs"); //现网 - 文件服务器访问地址
        define('QUERY_REPORT_USER_INFO_URL', "http://223.221.36.146:10000/cws-game/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://223.221.36.146:10000/cws-game/report/query_check.php");
        define('ORDER_CALL_BACK_URL', "http://223.221.36.146:10000/cws-game/pay/qinghaidx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://223.221.36.146:10000/cws-game/report/index.php"); // 现网 - 上报订购信息


        // Redis
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}
