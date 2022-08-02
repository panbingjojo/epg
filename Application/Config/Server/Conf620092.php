<?php
/**
 * Created by longmaster.
 * Date: 2018-09-03
 * Time: 09:39
 * Brief: 此文件（或类）用于存放lws、cws、fs等服务器相关地址
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服
 * 3、表示内网测试服
 * 4、VPN走正式服
 */
define("USE_SERVER", 5);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_URL', "http://127.0.0.1:10003/cws/index.php?");  //现网 - cws服务器访问地址
        if($_SERVER['HTTP_HOST'] == '118.180.22.57:10297'){
            define('RESOURCES_URL', "http://118.180.22.57:10297/fs"); //现网 - 文件服务器访问地址
        }else{
            define('RESOURCES_URL', "http://123.59.206.200:10042/fs"); //现网 - 文件服务器访问地址
        }
        define('ORDER_CALL_BACK_URL', "http://127.0.0.1:10003/cws/pay/order/callback/jiangsudx_com/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10003/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10003/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10003/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://127.0.0.1:10003/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://127.0.0.1:10003/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://118.180.22.57:10297/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://127.0.0.1:10003/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://118.180.22.57:10297/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://127.0.0.1:10003/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://118.180.22.57:10297/cws/wxserver"); // cws-wxserver模块  -- 页面
        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:11000"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10003/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 2:
        // 现网进入3983
        break;
    case 3:
        // 本地内网测试服
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?");
        define('RESOURCES_URL', "http://test-healthiptv-fs.langma.cn:8091/");
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/order/callback/jiangsudx_com/index.phpp");
        define('REPORT_ORDER_INFO_URL', "http://180.100.134.116:10014/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://180.100.134.116:10014/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://180.100.134.116:10014/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://180.100.134.116:10014/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://10.254.30.100:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://10.254.30.100:8100/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://10.254.30.100:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://10.254.30.100:8100/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://10.254.30.100:8100/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://10.254.30.100:8100/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://10.254.30.100:8100/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 4:
        // VPN 走正式服
        define('SERVER_URL', "http://118.180.22.57:10297/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://118.180.22.57:10297/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://118.180.22.57:10297/cws/pay/order/callback/jiangsudx_com/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://118.180.22.57:10297/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://118.180.22.57:10297/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://118.180.22.57:10297/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://118.180.22.57:10297/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://118.180.22.57:10297/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://118.180.22.57:10297/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://118.180.22.57:10297/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://118.180.22.57:10297/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://118.180.22.57:10297/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://118.180.22.57:10297/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://118.180.22.57:10310"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://118.180.22.57:10297/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 5:
        //  走新搭正式服-不走VPN 需同步
        define('SERVER_URL', "http://123.59.206.199:50007/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://healthiptv.langma.cn:10013"); //现网 - 文件服务器访问地址

        define('ORDER_CALL_BACK_URL', "http://123.59.206.199:50007/cws/pay/order/callback/jiangsudx_com/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.199:50007/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://123.59.206.199:50007/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://123.59.206.199:50007/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://123.59.206.199:50007/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://123.59.206.199:50007/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://123.59.206.199:50007/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://123.59.206.199:50007/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://123.59.206.199:50007/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://123.59.206.199:50007/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://123.59.206.199:50007/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://118.180.22.57:10310"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://123.59.206.199:50007/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}