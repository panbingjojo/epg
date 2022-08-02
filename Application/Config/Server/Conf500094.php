<?php
/**
 * Created by longmaster
 * Brief: 重庆电信EPG
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
        define('SERVER_URL', "http://172.0.31.178:10000/cws/index.php?");  // 现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://172.23.51.104:10001/fs");       // 现网 - 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://172.0.31.178:10000/cws/pay/chongqingdx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://172.0.31.178:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://172.0.31.178:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://172.0.31.178:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://172.0.31.178:10000/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://172.0.31.178:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://172.0.31.178:10000/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://172.0.31.178:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://172.0.31.178:10000/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://172.0.31.178:10000/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://172.0.31.178:10000/cws/wxserver"); // cws-wxserver模块  -- 页面
        define('SERVER_CONTROL_UNIT', "http://172.0.31.178:10002"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://172.0.31.178:10000/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

        // redis
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 2:
        // 现网进入3983 使用现网数据
        define('SERVER_URL', "http://127.0.0.1:10000/cws/index.php?");  // 现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://172.23.51.104:10001/fs");       // 现网 - 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://127.0.0.1:10000/cws/pay/chongqingdx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://127.0.0.1:10000/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://127.0.0.1:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://172.23.51.104:10000/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://127.0.0.1:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://172.23.51.104:10000/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://127.0.0.1:10000/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://172.23.51.104:10000/cws/wxserver"); // cws-wxserver模块  -- 页面
        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:10002"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10000/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

//        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 3:
        // 本地内网测试服
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://10.254.30.100:8091/");
        define('ORDER_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/chongqingdx/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.254.30.100:8100/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 4:
        // 公司读取北京服务器的数据
        define('SERVER_URL', "http://123.59.206.199:50014/cws/index.php?");
        define('RESOURCES_URL', "http://healthiptv-fs.langma.cn");
        define('ORDER_CALL_BACK_URL', "http://123.59.206.199:50014/cws/pay/chongqingdx/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.199:50014/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://123.59.206.199:50014/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://123.59.206.199:50014/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://123.59.206.199:50014/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://123.59.206.199:50014/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://123.59.206.199:50014/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://123.59.206.199:50014/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://123.59.206.199:50014/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://123.59.206.199:50014/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://123.59.206.199:50014/cws/wxserver"); // cws-wxserver模块  -- 页面
        define('SERVER_CONTROL_UNIT', "http://123.59.206.196:10026");                  // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10000/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}