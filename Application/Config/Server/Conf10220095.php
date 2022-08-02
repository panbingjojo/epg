<?php
/**
 * Created by longmaster
 * Brief: 吉林广电EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服
 * 3、表示内网测试服
 * 4、表示外网测试服
 */
define("USE_SERVER", 2);    // 发布上线确保该值为1
define('LOCAL_IP', "127.0.0.1");       // 本地服务器ip
switch (USE_SERVER) {
    case 1:  // 现网（用户环境）
        define("SERVER_IP", "http://10.128.3.146");   // 现网服务器IP(携带协议http)
        define('SERVER_ENTRY_ADDR', LOCAL_IP . ":10005"); // 应用入口地址
        define('SERVER_ENTRY_ADDR_OUT', SERVER_IP . ":10005"); // 应用入口地址

//        define('RESOURCES_URL', "http://10.128.3.146:10002/fs"); // 文件服务器访问地址
        if($_SERVER['HTTP_HOST'] == '10.128.3.146:10008'){
            define('RESOURCES_URL', "http://10.128.3.146:10002/fs"); //现网 - 文件服务器访问地址
        }else{
            define('RESOURCES_URL', "http://36.49.86.159:10002/fs"); //现网 - 文件服务器访问地址
        }

        define('SERVER_CONTROL_UNIT', "http://10.128.3.146:10014"); //落地电话控制中心地址

        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/'); // 图文问诊地址

        break;

    case 2: // 现网（公司网络环境访问）
        define("SERVER_IP", "http://36.49.86.159");   // 现网服务器IP(携带协议http)

        define('SERVER_ENTRY_ADDR', SERVER_IP . ":10005"); // 应用(CWS),LWS访问入口地址
        define('SERVER_ENTRY_ADDR_OUT', SERVER_IP . ":10005"); //  应用(CWS),盒子端访问入口地址

        define('RESOURCES_URL', "http://36.49.86.159:10002/fs"); // 文件服务器访问地址

        define('SERVER_CONTROL_UNIT', "http://10.128.3.146:10014"); //落地电话控制中心地址

        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/'); // 图文问诊地址

        break;

    case 3: // 本地内网测试服
        define("SERVER_IP", "http://10.254.30.100");   // 内网测试服务器IP(携带协议http)
        define('SERVER_ENTRY_ADDR', LOCAL_IP . ":8100"); // 提供给APK插件使用
        define('SERVER_ENTRY_ADDR_OUT', SERVER_IP . ":8100"); // 应用入口地址

        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址

        break;

    case 4:  // 本地外网测试
        define("SERVER_IP", "http://222.85.144.70");   // 本地外网测试服务器IP(携带协议http)
        define('SERVER_ENTRY_ADDR', SERVER_IP . ":8100"); // 提供给APK插件使用
        define('SERVER_ENTRY_ADDR_OUT', SERVER_IP . ":8100"); // 应用入口地址

        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址

        break;
}

define('SERVER_URL', SERVER_ENTRY_ADDR . "/cws/index.php?"); // cws服务器访问地址

define('ORDER_CALL_BACK_URL', SERVER_ENTRY_ADDR . "/cws/pay/jilingd_dx_mofang_web/callback/index.php"); // 购结果上传到CWS
define('REPORT_ORDER_INFO_URL', SERVER_ENTRY_ADDR . "/cws/report/index.php");
define('QUERY_REPORT_USER_INFO_URL', SERVER_ENTRY_ADDR .  "/cws/report/query.php");
define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_ENTRY_ADDR . "/cws/report/query_check.php");
define('REPORT_ORDER_STATUS_URL', SERVER_ENTRY_ADDR . "/cws/report/query_report.php");

// 问诊模块 -- LWS访问
define('CWS_HLWYY_URL', SERVER_ENTRY_ADDR . "/cws/hlwyy/index.php"); // cws-hlwyy模块
define("CWS_EXPERT_URL", SERVER_ENTRY_ADDR . "/cws/39hospital/index.php");
define('CWS_WXSERVER_URL', SERVER_ENTRY_ADDR . "/cws/wxserver"); // cws-wxserver模块
// 问诊模块 -- 盒子端访问
define("CWS_HLWYY_URL_OUT", SERVER_ENTRY_ADDR_OUT . "/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
define("CWS_EXPERT_URL_OUT", SERVER_ENTRY_ADDR_OUT . "/cws/39hospital/index.php");//大专家头像外网地址
define('CWS_WXSERVER_URL_OUT', SERVER_ENTRY_ADDR_OUT . "/cws/wxserver"); // cws-wxserver模块 -- 页面

define('CWS_39NET_URL', SERVER_ENTRY_ADDR . "/cws/39net/index.php"); // cws-39net模块

// Redis配置
define('REDIS_LOCAL_IP', LOCAL_IP); // redis本地服务器ip
define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口

//设备平台
define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
