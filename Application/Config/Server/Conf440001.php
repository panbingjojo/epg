<?php

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示内网测试服
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1: // 现网（用户环境）
        define('PUBLIC_NETWORK_ADDRESS', 'http://183.234.214.54'); // 公网地址
        define('CWS_SERVER_PORT', ':10013');                       // CWS服务端口
        define('FILE_SERVER_PORT', ':10001');                      // 文件资源服务端口
        define('TELEPHONE_INQUIRY_PORT', ':10006');                // 落地电话问诊服务端口

        define('SERVER_HOST', PUBLIC_NETWORK_ADDRESS . CWS_SERVER_PORT);             // cws服务器主机地址

        define('RESOURCES_URL', PUBLIC_NETWORK_ADDRESS . FILE_SERVER_PORT . "/fs");  // 文件服务器访问地址

        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');      // 图文问诊地址

//         define('APP_ROOT_PATH', SERVER_HOST . "/epg-lws-for-apk-440001");         // LWS访问地址

        break;

    case 2: // 测试服30.100
        //define('PUBLIC_NETWORK_ADDRESS', 'http://222.85.144.70'); // 公网地址
        define('SERVER_HOST_ADDRESS', "http://test-healthiptv.langma.cn");                // cws服务器主机地址
        define('CWS_SERVER_PORT', ':8100');                       // CWS服务端口
        define('FILE_SERVER_PORT', ':8091');                      // 文件资源服务端口
        define('TELEPHONE_INQUIRY_PORT', ':40000');               // 落地电话问诊服务端口

        define('SERVER_HOST', SERVER_HOST_ADDRESS . CWS_SERVER_PORT);              // cws服务器主机地址

        define('RESOURCES_URL', SERVER_HOST_ADDRESS . FILE_SERVER_PORT);           // 文件服务器访问地址

        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');  // 图文问诊地址

        //define('APP_ROOT_PATH', "http://test-healthiptv.langma.cn:40037/00440001-guangdongyd");         // LWS访问地址
        break;
    case 3:
		 // 从公司访问现网数据
        define('PUBLIC_NETWORK_ADDRESS', 'http://10.254.30.102'); // 公网地址
        define('CWS_SERVER_PORT', ':60006');                       // CWS服务端口
        define('FILE_SERVER_PORT', ':60007');                      // 文件资源服务端口
        define('TELEPHONE_INQUIRY_PORT', ':10006');                // 落地电话问诊服务端口

        define('SERVER_HOST', PUBLIC_NETWORK_ADDRESS . CWS_SERVER_PORT);             // cws服务器主机地址

        define('RESOURCES_URL', PUBLIC_NETWORK_ADDRESS . FILE_SERVER_PORT . "/fs");  // 文件服务器访问地址

        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');      // 图文问诊地址

//         define('APP_ROOT_PATH', SERVER_HOST . "/epg-lws-for-apk-440001");         // LWS访问地址

        break;
}


define('SERVER_URL', SERVER_HOST . "/cws/index.php?");                              // cws服务器访问地址

// 问诊模块 -- 服务器访问
define("CWS_EXPERT_URL", SERVER_HOST . "/cws/39hospital/index.php");                // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_HLWYY_URL", SERVER_HOST . "/cws/hlwyy/index.php");                      // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）

// 问诊模块 -- 盒子端访问
define("CWS_EXPERT_URL_OUT", SERVER_HOST . "/cws/39hospital/index.php");            // 大专家外网地址（用于前端拉取数据）
define("CWS_HLWYY_URL_OUT", SERVER_HOST . "/cws/hlwyy/index.php");                  // 互联网医院外网地址（用于前端拉取数据）

define('CWS_WXSERVER_URL', SERVER_HOST . "/cws/wxserver");                          // cws-微信模块

define('SERVER_CONTROL_UNIT', PUBLIC_NETWORK_ADDRESS . TELEPHONE_INQUIRY_PORT);     // 落地电话控制中心地址

// 39健康网
define('CWS_39NET_URL', SERVER_HOST . "/cws/39net/index.php");                      // cws-39net模块

// Redis模块
define('REDIS_LOCAL_IP', "127.0.0.1");                                              // redis本地服务器ip
define('REDIS_LOCAL_PORT', "6379");                                                 // redis本地服务器端口


//设备平台
define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
