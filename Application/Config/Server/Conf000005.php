<?php

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示内网测试服
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1: // 现网（用户环境）
        define('SERVER_HOST_ADDRESS', "http://123.59.206.200");                                 // cws服务器主机地址+协议
        define('SERVER_HOST', SERVER_HOST_ADDRESS . ":10002");                                  // cws服务器主机地址
        define('RESOURCES_URL', SERVER_HOST_ADDRESS . ":10013");                                // 文件服务器访问地址

        define('SERVER_CONTROL_UNIT', "http://123.59.206.196:10026");                           //落地电话控制中心地址

        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');                 // 图文问诊地址

        define('APP_ROOT_PATH', SERVER_HOST . "/epg-lws-for-apk-000005");                       // 应用入口地址,只有提供给外部链接才使用
        break;

    case 2: // 测试服30.100
        define('SERVER_HOST_ADDRESS', "http://test-healthiptv.langma.cn");                       // cws服务器主机地址+协议
        define('SERVER_HOST', SERVER_HOST_ADDRESS . ":8100");                                    // cws服务器主机地址
        define('RESOURCES_URL', SERVER_HOST_ADDRESS . ":8091");                                  // 文件服务器访问地址

        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');             // 图文问诊地址
        break;
}

/*************************  cws服务器模块 ************************/
define('SERVER_URL', SERVER_HOST . "/cws/index.php?");                                      // cws服务器访问地址
define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");                     // 订购上报地址
define('CWS_39NET_URL', SERVER_HOST .  "/cws/39net/index.php");                             // cws-39net模块

//设备平台
define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
/*************************  问诊模块 ************************/
define("CWS_EXPERT_URL", SERVER_HOST . "/cws/39hospital/index.php");           // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_HLWYY_URL", SERVER_HOST . "/cws/hlwyy/index.php");                 // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_EXPERT_URL_OUT", SERVER_HOST . "/cws/39hospital/index.php");       // 大专家外网地址（用于前端拉取数据）
define("CWS_HLWYY_URL_OUT", SERVER_HOST . "/cws/hlwyy/index.php");             // 互联网医院外网地址（用于前端拉取数据）
define('CWS_WXSERVER_URL', SERVER_HOST . "/cws/wxserver");                     // cws-微信模块

// Redis模块
define('REDIS_LOCAL_IP', "127.0.0.1");                                                  // redis本地服务器ip
define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口
