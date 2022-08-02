<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 01230001：[黑龙江移动]网络环境配置
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/01/29 17:00
// +----------------------------------------------------------------------

/**
 * USE_SERVER:
 * 1、现网（用户环境）（说明：按未来电视要求，提供域名映射，使用他们的域名）
 * 2、测试（用户环境）（说明：与USE_SERVER=1对应一致！）
 */
define('USE_SERVER', 1);                  //发布上线确保该值为1
define("LOCAL_HOST", "http://127.0.0.1"); // 本机IP
switch (USE_SERVER) {
    case 1:
        // 域名-现网（用户环境）（说明：按未来电视要求，提供域名映射，使用他们的域名）
        define('SERVER_IP_OUT', 'http://123.59.206.200');                 // cws服务器主机地址
        define('SERVER_HOST', SERVER_IP_OUT . ':10002');                                  // cws服务器主机地址
        define('SERVER_HOST_OUT', SERVER_IP_OUT . ':10002');                           // cws服务器主机地址

        define('RESOURCES_URL', SERVER_IP_OUT . ':10013'); // 文件服务器访问地址

        define('SERVER_CONTROL_UNIT', "http://123.59.206.196:10026");                  // 落地电话控制中心地址

        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');        // 图文问诊地址

        define('APP_ROOT_PATH', "http://gylm39jk-hlj.a106.ottcn.com:20005/apk-lws");           // 应用入口地址,只有提供给外部链接才使用
        break;

    case 2:
        // 本地内网测试服
        define('SERVER_IP_OUT', 'http://222.85.144.70');
        define('SERVER_HOST', SERVER_IP_OUT . ':8100');                                    // cws服务器主机地址
        define('SERVER_HOST_OUT', SERVER_IP_OUT . ':8100');                             // cws服务器主机地址
        define('RESOURCES_URL', SERVER_IP_OUT . ':8091');                               // 文件服务器访问地址

        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000");                    // 落地电话控制中心地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');    // 图文问诊地址
        break;
}

/*************************  cws服务器模块 ************************/
define('SERVER_URL', SERVER_HOST . '/cws/index.php?');                                                 // cws服务器访问地址
define('PAY_ORDER_CALLBACK_URL', SERVER_HOST . '/cws/pay/order/callback.php');                         // cws订购信息上报地址
define('CWS_39NET_URL', SERVER_HOST. "/cws/39net/index.php");                                          // cws-39net模块

/*************************  问诊模块 ************************/
define('CWS_HLWYY_URL', SERVER_HOST . '/cws/hlwyy/index.php');                                          // cws-hlwyy模块（直接代理到中心）
define('CWS_HLWYY_URL_OUT', SERVER_HOST . '/cws/hlwyy/index.php');                                      // cws-hlwyy模块（直接代理到中心）
define('CWS_EXPERT_URL', SERVER_HOST_OUT . '/cws/39hospital/index.php');                                    // 大专家内网地址
define('CWS_EXPERT_URL_OUT', SERVER_HOST_OUT . '/cws/39hospital/index.php');                                // 大专家外网地址

//设备平台
define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

/*************************  Redis模块 ************************/
//define('REDIS_LOCAL_IP', '127.0.0.1');                                                                  // redis本地服务器ip
//define('REDIS_LOCAL_PORT', '6379');                                                                     // redis本地服务器端口

