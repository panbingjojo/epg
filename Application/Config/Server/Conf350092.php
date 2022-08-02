<?php
/**
 * Created by longmaster.
 * Date: 2019-03-27
 * Time: 14:43
 * Brief: 此文件（或类）用于记录福建电信EPG的服务器配置参数
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服 （北京测试服）
 * 3、表示内网测试服
 * 4、VPN走正式服
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_URL', "http://127.0.0.1:10000/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://59.56.75.241:10001/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALLBACK', "http://127.0.0.1:10000/cws/pay/order/callback/jiangsudx_com/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 2:
        // 现网进入3983
        define('SERVER_URL', "http://127.0.0.1:10000/cws/index.php?");
        define('RESOURCES_URL', "http://59.56.75.241:10001/fs");
        define('ORDER_CALLBACK', "http://127.0.0.1:10000/cws/pay/order/callback/jiangsudx_com/index.php");
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws/report/index.php");
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 3:
        // 本地内网测试服
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://test-healthiptv-fs.langma.cn:8091/");
        define('ORDER_CALLBACK', "http://10.254.30.100:8100/cws/pay/order/callback/jiangsudx_com/index.php");
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 4:
        // VPN 走正式服
        define('SERVER_URL', "http://59.56.75.241:10000/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://59.56.75.241:10001/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALLBACK', "http://59.56.75.241:10000/cws/pay/order/callback/jiangsudx_com/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://59.56.75.241:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
}
