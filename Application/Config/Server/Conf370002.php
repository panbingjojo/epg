<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 山东电信
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/5/17 18:32
// +----------------------------------------------------------------------

/**
 * USE_SERVER:
 * 1、表示现网（内网ip）
 * 2、表示现网（外见ip）
 * 3、表示内网测试服
 * 4、表示现网获取内网测试服数据
 */
define("USE_SERVER", 2);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（内网环境）

        define('PUBLIC_NETWORK_ADDRESS', 'http://sddx.39health.visionall.cn');  // 公网地址
        define('PRIVATE_NETWORK_ADDRESS', 'http://192.168.0.80');                        // 内网地址
        define('CWS_SERVER_PORT', ':10018');                                             // CWS服务端口
        define('FILE_SERVER_PORT', ':10002');                                            // 文件资源服务端口
        define('TELEPHONE_INQUIRY_PORT', ':10008');                                      // 落地电话问诊服务端口

        define('SERVER_HOST', PRIVATE_NETWORK_ADDRESS . CWS_SERVER_PORT);                // cws服务器主机地址 -- 内网使用
        define('PUBLIC_SERVER_HOST', PUBLIC_NETWORK_ADDRESS . CWS_SERVER_PORT);          // cws服务器主机地址 -- 公网使用

        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');
        break;

    case 2: // 现网（外网环境）
        define('PUBLIC_NETWORK_ADDRESS', 'http://sddx.39health.visionall.cn');  // 公网地址
        define('PRIVATE_NETWORK_ADDRESS', 'http://140.249.20.45');                       // 内网地址
        define('CWS_SERVER_PORT', ':10018');                                             // CWS服务端口
        define('FILE_SERVER_PORT', ':10002');                                            // 文件资源服务端口
        define('TELEPHONE_INQUIRY_PORT', ':10008');                                      // 落地电话问诊服务端口

        define('SERVER_HOST', PRIVATE_NETWORK_ADDRESS . CWS_SERVER_PORT);                // cws服务器主机地址 -- 内网使用
        define('PUBLIC_SERVER_HOST', PUBLIC_NETWORK_ADDRESS . CWS_SERVER_PORT);          // cws服务器主机地址 -- 公网使用

        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');          // redis本地服务器端口
        break;

    case 3: // 本地内网测试服
        define('PUBLIC_NETWORK_ADDRESS', 'http://test-healthiptv.langma.cn');           // 公网地址
        define('PRIVATE_NETWORK_ADDRESS', 'http://222.85.144.70');                       // 内网地址
        define('CWS_SERVER_PORT', ':8100');                                              // CWS服务端口
        define('FILE_SERVER_PORT', ':8091');                                             // 文件资源服务端口
        define('TELEPHONE_INQUIRY_PORT', ':40000');                                      // 落地电话问诊服务端口

        define('SERVER_HOST', PRIVATE_NETWORK_ADDRESS . CWS_SERVER_PORT);                // cws服务器主机地址 -- 内网使用
        define('PUBLIC_SERVER_HOST', PUBLIC_NETWORK_ADDRESS . CWS_SERVER_PORT);          // cws服务器主机地址 -- 公网使用

        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');          // 图文问诊地址                                                       // redis本地服务器端口
        break;
}

define('SERVER_URL', SERVER_HOST . "/cws/index.php?");                           // cws服务器访问地址
define('RESOURCES_URL', PUBLIC_NETWORK_ADDRESS . FILE_SERVER_PORT);              // 文件服务器访问地址
define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");
define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query.php");
define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query_check.php");
define('REPORT_ORDER_STATUS_URL', SERVER_HOST . "/cws/report/query_report.php");

define('CWS_39NET_URL', SERVER_HOST . "/cws/39net/index.php");                   // cws-39net模块

// 问诊模块
define("CWS_EXPERT_URL", SERVER_HOST . "/cws/39hospital/index.php");             // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_HLWYY_URL", SERVER_HOST . "/cws/hlwyy/index.php");                   // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_EXPERT_URL_OUT", PUBLIC_SERVER_HOST . "/cws/39hospital/index.php");  // 大专家外网地址（用于前端拉取数据）
define("CWS_HLWYY_URL_OUT", PUBLIC_SERVER_HOST  . "/cws/hlwyy/index.php");   // 互联网医院外网地址（用于前端拉取数据）
define('CWS_WXSERVER_URL', PUBLIC_SERVER_HOST . "/cws/wxserver");            // cws-微信模块

define('SERVER_CONTROL_UNIT', PRIVATE_NETWORK_ADDRESS . TELEPHONE_INQUIRY_PORT); // 落地电话控制中心地址

// Redis模块
define('REDIS_LOCAL_IP', "127.0.0.1");                                                      // redis本地服务器ip
define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口
// 测试服配置地址，需要测试服测试时打开

define('APP_ROOT_PATH', "http://sddx.39health.visionall.cn:10018/epg-lws-for-apk");

//设备平台
define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

