<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |新疆电信epg
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2018/12/20 13:59                                               |
 * +----------------------------------------------------------------------+
 */

define("USE_SERVER", 3);    //发布上线确保该值为1
define("LOCAL_HOST", "http://127.0.0.1"); // 本机IP
switch (USE_SERVER) {
    case 1:
        // 服务器IP地址 -- 用于盒子端访问
        define('SERVER_IP', "http://healthy.hunancatv.com");
        // 服务应用入口 -- LWS端通过服务器回环地址访问CWS
        define('SERVER_HOST', LOCAL_HOST . ":12000");
        // 服务应用入口 -- 盒子端通过公网访问服务器端CWS
        define('SERVER_HOST_OUT', SERVER_IP . ":12000");
        // 文件服务入口 -- 盒子端通过公网访问服务器
        define('RESOURCES_URL', SERVER_IP . ":12001/fs/");

        // 落地电话控制中心地址
        define('SERVER_CONTROL_UNIT', "http://123.59.206.196:10026");
        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'https://m.guijk.com/askdoctor/detail/');

        break;
    case 2:
        // 服务器IP地址 -- 用于盒子端访问
        define('SERVER_IP', "http://222.85.144.70");
        // 服务应用入口 -- LWS端通过服务器回环地址访问CWS
        define('SERVER_HOST', LOCAL_HOST . ":8100");
        // 服务应用入口 -- 盒子端通过公网访问服务器端CWS
        define('SERVER_HOST_OUT', SERVER_IP . ":12000");
        // 文件服务入口 -- 盒子端通过公网访问服务器
        define('RESOURCES_URL', SERVER_IP . ":8091/");

        // IPTV中转代理接口
        define('SERVER_IPTVFORWARD_CWS', SERVER_HOST . "/cws/IPTVForward/index.php");
        define('SERVER_IPTVFORWARD_CWS_FS', SERVER_HOST . "/cws/IPTVForward/");

        //落地电话控制中心地址
        define('SERVER_CONTROL_UNIT', LOCAL_HOST . ":40000");
        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'https://test-m.guijk.com/askdoctor/detail/');

        break;
    case 3:
        // 服务器IP地址 -- 用于盒子端访问
        define('SERVER_IP', "http://119.44.0.129");
        // 服务应用入口 -- LWS端通过服务器回环地址访问CWS
        define('SERVER_HOST', SERVER_IP . ":12000");
        // 服务应用入口 -- 盒子端通过公网访问服务器端CWS
        define('SERVER_HOST_OUT', SERVER_IP . ":12000");
        // 文件服务入口 -- 盒子端通过公网访问服务器
        define('RESOURCES_URL', SERVER_IP . ":12001/fs/");

        //落地电话控制中心地址
        define('SERVER_CONTROL_UNIT', "http://123.59.206.196:10026");
        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'https://m.guijk.com/askdoctor/detail/');

        break;
}

/*************************  cws服务器模块 ************************/
define('SERVER_URL', SERVER_HOST . "/cws/index.php?");

define('CWS_39NET_URL', SERVER_HOST . "/cws/39net/index.php"); // cws-39net模块

define('ORDER_CALLBACK', SERVER_HOST . "/cws/pay/hunanyouxian/callback/index.php");
define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");
define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query.php");
define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query_check.php");

/*************************  问诊模块 ************************/

define("CWS_EXPERT_URL", SERVER_HOST . "/cws/39hospital/index.php");         // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_HLWYY_URL", SERVER_HOST . "/cws/hlwyy/index.php");               // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define('CWS_WXSERVER_URL', SERVER_HOST . "/cws/wxserver");                   // cws-微信模块

define("CWS_EXPERT_URL_OUT", SERVER_HOST_OUT . "/cws/39hospital/index.php"); // 大专家外网地址（用于前端拉取数据）
define("CWS_HLWYY_URL_OUT", SERVER_HOST_OUT . "/cws/hlwyy/index.php");       // 互联网医院外网地址（用于前端拉取数据）

/*************************  Redis模块 ************************/
define('REDIS_LOCAL_IP', "127.0.0.1");
define('REDIS_LOCAL_PORT', "6379");

//设备平台
define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');