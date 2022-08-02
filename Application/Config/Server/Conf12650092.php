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

define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        define('SERVER_ENTRY_ADDR', "http:///127.0.0.1:10000");  //现网 - cws服务器访问地址
        define('SERVER_URL', "http://127.0.0.1:10000/cws/index.php?");
        define('RESOURCES_URL', "http://218.31.231.14:10001/fs/");
        define('ORDER_CALLBACK', "http://127.0.0.1:10000/cws/pay/xinjiangdx-ttjs/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query_check.php");

        // 问诊模块
        define('CWS_HLWYY_URL', "http://127.0.0.1:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://120.70.237.86:10000/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://127.0.0.1:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://120.70.237.86:10000/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://127.0.0.1:10000/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://120.70.237.86:10000/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://120.70.237.86:10000/cws/landphone"); //落地电话控制中心地址

        // IPTV中转代理接口
        define('SERVER_IPTVFORWARD_CWS', "http://127.0.0.1:10000/cws/IPTVForward/index.php");
        define('SERVER_IPTVFORWARD_CWS_FS', "http://120.70.237.86:10000/cws/IPTVForward/");

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10000/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        // Redis
        define('REDIS_LOCAL_IP', "127.0.0.1");
        define('REDIS_LOCAL_PORT', "6379");
        break;
    case 2:
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100");  //现网 - cws服务器访问地址
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?");
        define('RESOURCES_URL', "http://test-healthiptv-fs.langma.cn:8091/");
        define('ORDER_CALLBACK', "http://222.85.144.70:8100/cws/pay/xinjiangdx-ttjs/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");

        // 问诊模块
        define('CWS_HLWYY_URL', "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块

        // IPTV中转代理接口
        define('SERVER_IPTVFORWARD_CWS', "http://222.85.144.70:8100/cws/IPTVForward/index.php");
        define('SERVER_IPTVFORWARD_CWS_FS', "http://222.85.144.70:8100/cws/IPTVForward/");

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

        // Redis
//        define('REDIS_LOCAL_IP', "10.254.30.100");
        define('REDIS_LOCAL_PORT', "6379");
        break;
    case 3: //正式服数据
        define('SERVER_ENTRY_ADDR', "http://218.31.231.14:10000");  //现网 - cws服务器访问地址
        define('SERVER_URL', "http://218.31.231.14:10000/cws/index.php?");
        define('RESOURCES_URL', "http://218.31.231.14:10001/fs/");
        define('ORDER_CALLBACK', "http://218.31.231.14:10000/cws/pay/xinjiangdx-ttjs/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://218.31.231.14:10000/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://218.31.231.14:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://218.31.231.14:10000/cws/report/query_check.php");

        // 问诊模块
        define('CWS_HLWYY_URL', "http://218.31.231.14:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://218.31.231.14:10000/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://218.31.231.14:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://218.31.231.14:10000/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://218.31.231.14:10000/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://218.31.231.14:10000/cws/landphone"); //落地电话控制中心地址

        // IPTV中转代理接口
        define('SERVER_IPTVFORWARD_CWS', "http://218.31.231.14:10000/cws/IPTVForward/index.php");
        define('SERVER_IPTVFORWARD_CWS_FS', "http://218.31.231.14:10000/cws/IPTVForward/");

        // 39健康网
        define('CWS_39NET_URL', "http://218.31.231.14:10000/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');
        // Redis
        define('REDIS_LOCAL_IP', "10.254.30.100");
        define('REDIS_LOCAL_PORT', "6379");
        break;
}