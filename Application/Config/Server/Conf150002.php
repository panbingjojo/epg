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

define("USE_SERVER",1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        define('SERVER_HOST_ADDRESS', "http://172.25.128.90");
        define('SERVER_HOST', SERVER_HOST_ADDRESS . ":10000");
        define('PUBLIC_SERVER_HOST', "http://healthy.hunancatv.com:12000");
        define('RESOURCES_URL', SERVER_HOST_ADDRESS . ":10001/fs/");

        // 落地电话控制中心地址
        define('SERVER_CONTROL_UNIT', "http://123.59.206.196:10026");

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'https://m.guijk.com/askdoctor/detail/');
        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 2: //30.100测试服
        define('SERVER_HOST_ADDRESS', "http://222.85.144.70");
        define('SERVER_HOST', SERVER_HOST_ADDRESS . ":8100");         // cws服务器访问地址
        define('PUBLIC_SERVER_HOST', SERVER_HOST_ADDRESS . ":8100");  // cws服务器访问地址
        define('RESOURCES_URL', "http://test-healthiptv-fs.langma.cn:8091/");

        // IPTV中转代理接口
        define('SERVER_IPTVFORWARD_CWS', "http://222.85.144.70:8100/cws/IPTVForward/index.php");
        define('SERVER_IPTVFORWARD_CWS_FS', "http://222.85.144.70:8100/cws/IPTVForward/");

        //落地电话控制中心地址
        define('SERVER_CONTROL_UNIT', SERVER_HOST_ADDRESS . ":40000");
        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'https://test-m.guijk.com/askdoctor/detail/');
        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 3: //北京服务器
        define('SERVER_HOST_ADDRESS', "http://123.59.206.199");
        define('SERVER_HOST', SERVER_HOST_ADDRESS . ":50013");
        define('PUBLIC_SERVER_HOST', SERVER_HOST_ADDRESS . ":50013");
        define('RESOURCES_URL', SERVER_HOST_ADDRESS . ":20003/fs/");

        // IPTV中转代理接口
        define('SERVER_IPTVFORWARD_CWS', "http://222.85.144.70:8100/cws/IPTVForward/index.php");
        define('SERVER_IPTVFORWARD_CWS_FS', "http://222.85.144.70:8100/cws/IPTVForward/");

        //落地电话控制中心地址
        define('SERVER_CONTROL_UNIT', "http://123.59.206.196:10026");
        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'https://m.guijk.com/askdoctor/detail/');
        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        break;
}

/*************************  cws服务器模块 ************************/
define('SERVER_URL', SERVER_HOST . "/cws/index.php?");
define('ORDER_CALLBACK', SERVER_HOST."/cws/pay/hunanyouxian/callback/index.php");
define('REPORT_ORDER_INFO_URL', SERVER_HOST."/cws/report/index.php");
define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST."/cws/report/query.php");
define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST."/cws/report/query_check.php");
define('CWS_39NET_URL', SERVER_HOST."/cws/39net/index.php");                  // cws-39net模块

/*************************  问诊模块 ************************/
define('CWS_HLWYY_URL', SERVER_HOST."/cws/hlwyy/index.php");                  // cws-hlwyy模块
define('SERVER_GUAHAO_CWS_FS', SERVER_HOST . "/cws/guahao/");                 // cws-挂号模块
define("CWS_EXPERT_URL", SERVER_HOST."/cws/39hospital/index.php");            // cws-互联网医院模块
define("CWS_HLWYY_URL_OUT", PUBLIC_SERVER_HOST."/cws/hlwyy/index.php");       // cws-hlwyy模块 外网地址
define("CWS_EXPERT_URL_OUT",PUBLIC_SERVER_HOST."/cws/39hospital/index.php");  // 大专家头像外网地址
define('CWS_WXSERVER_URL', PUBLIC_SERVER_HOST."/cws/wxserver");               // cws-wxserver模块

/*************************  Redis模块 ************************/
// redis本地服务器ip
//define('REDIS_LOCAL_IP', "127.0.0.1");
// redis本地服务器端口
//define('REDIS_LOCAL_PORT', "6379");