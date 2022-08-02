<?php

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、现网（本地浏览器环境）
 * 3、测试服30.100
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1: // 现网（用户环境）
        define('PUBLIC_NETWORK_ADDRESS', 'http://111.26.158.208');  // 公网地址
        define('PRIVATE_NETWORK_ADDRESS', 'http://127.0.0.1');      // 内网地址
        define('CWS_SERVER_PORT', ':10000');                        // CWS服务端口
        define('FILE_SERVER_PORT', ':10001');                       // 文件资源服务端口
        define('TELEPHONE_INQUIRY_PORT', ':10010');                 // 落地电话问诊服务端口

        define('SERVER_HOST', PRIVATE_NETWORK_ADDRESS . CWS_SERVER_PORT);                // cws服务器主机地址 -- 内网使用
        define('PUBLIC_SERVER_HOST', PUBLIC_NETWORK_ADDRESS . CWS_SERVER_PORT);          // cws服务器主机地址 -- 公网使用

        define('RESOURCES_URL', PUBLIC_NETWORK_ADDRESS . FILE_SERVER_PORT . '/fs');      // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', SERVER_HOST . "/cws/pay/jilingd/callback/yd_index.php");

        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 2: // 现网（本地浏览器环境）
        define('PUBLIC_NETWORK_ADDRESS', 'http://111.26.158.208');  // 公网地址
        define('PRIVATE_NETWORK_ADDRESS', 'http://111.26.158.208'); // 内网地址
        define('CWS_SERVER_PORT', ':10000');                        // CWS服务端口
        define('FILE_SERVER_PORT', ':10001');                       // 文件资源服务端口
        define('TELEPHONE_INQUIRY_PORT', ':10010');                 // 落地电话问诊服务端口

        define('SERVER_HOST', PRIVATE_NETWORK_ADDRESS . CWS_SERVER_PORT);                // cws服务器主机地址 -- 内网使用
        define('PUBLIC_SERVER_HOST', PUBLIC_NETWORK_ADDRESS . CWS_SERVER_PORT);          // cws服务器主机地址 -- 公网使用

        define('RESOURCES_URL', PUBLIC_NETWORK_ADDRESS . FILE_SERVER_PORT . '/fs');      // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', SERVER_HOST . "/cws/pay/jilingd/callback/yd_index.php");
        
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 3: // 测试服30.100
        define('PUBLIC_NETWORK_ADDRESS', 'http://test-healthiptv.langma.cn');           // 公网地址
        define('PRIVATE_NETWORK_ADDRESS', 'http://222.85.144.70');                       // 内网地址
        define('CWS_SERVER_PORT', ':8100');                                              // CWS服务端口
        define('FILE_SERVER_PORT', ':8091');                                             // 文件资源服务端口
        define('TELEPHONE_INQUIRY_PORT', ':40000');                                      // 落地电话问诊服务端口

        define('SERVER_HOST', PRIVATE_NETWORK_ADDRESS . CWS_SERVER_PORT);                // cws服务器主机地址 -- 内网使用
        define('PUBLIC_SERVER_HOST', PUBLIC_NETWORK_ADDRESS . CWS_SERVER_PORT);          // cws服务器主机地址 -- 公网使用

        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

        define('RESOURCES_URL', PUBLIC_NETWORK_ADDRESS . FILE_SERVER_PORT);              // 文件服务器访问地址

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;

}

define('SERVER_URL', SERVER_HOST . "/cws/index.php?");                           // cws服务器访问地址
define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");
define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query.php");
define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query_check.php");
define('REPORT_ORDER_STATUS_URL', SERVER_HOST . "/cws/report/query_report.php");

define('CWS_39NET_URL', SERVER_HOST . "/cws/39net/index.php");                   // cws-39net模块

// 问诊模块
define("CWS_EXPERT_URL", SERVER_HOST . "/cws/39hospital/index.php");             // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_HLWYY_URL", SERVER_HOST . "/cws/hlwyy/index.php");                   // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_EXPERT_URL_OUT", PUBLIC_SERVER_HOST . "/cws/39hospital/index.php");  // 大专家外网地址（用于前端拉取数据）
define("CWS_HLWYY_URL_OUT", PUBLIC_SERVER_HOST  . "/cws/hlwyy/index.php");       // 互联网医院外网地址（用于前端拉取数据）
define('CWS_WXSERVER_URL', PUBLIC_SERVER_HOST . "/cws/wxserver");                // cws-微信模块

define('SERVER_CONTROL_UNIT', PRIVATE_NETWORK_ADDRESS . TELEPHONE_INQUIRY_PORT); // 落地电话控制中心地址

// Redis模块
define('REDIS_LOCAL_IP', "127.0.0.1");                                         // redis本地服务器ip
define('REDIS_LOCAL_PORT', "6379");                                            // redis本地服务器端口

