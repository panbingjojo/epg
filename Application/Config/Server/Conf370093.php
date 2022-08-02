<?php
/**
 * Created by longmaster
 * Brief: 山东联通WEB-EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服
 * 3、表示内网测试服
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_URL', "http://124.132.254.17:10000/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://124.132.254.17:10001/fs"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://124.132.254.17:10000/cws/pay/shandonglt/callback/web_index.php"); // 购结果上传到CWS
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 2:
        // 现网进入3983
        define('SERVER_URL', "http://test-healthiptv.langma.cn:8100/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://test-healthiptv-fs.langma.cn:8091/"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://test-healthiptv.langma.cn:8100/cws/pay/shandonglt/callback/web_index.php"); // 购结果上传到CWS
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 3:
        // 本地内网测试服
        define('SERVER_URL', "http://test-healthiptv.langma.cn:8100/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://test-healthiptv-fs.langma.cn:8091/"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://test-healthiptv.langma.cn:8100/cws/pay/shandonglt/callback/web_index.php"); // 购结果上传到CWS
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
}
