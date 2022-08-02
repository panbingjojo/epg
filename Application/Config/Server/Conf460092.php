<?php
/**
 * Created by longmaster
 * Brief: 海南电信EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服
 * 3、表示内网测试服
 * 4、本地外网测试服
 * 5、本地VPN
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_URL', "http://127.0.0.1:10000/cws/index.php?");  //现网 - cws服务器访问地址
        if($_SERVER['HTTP_HOST'] == '10.255.6.22:10302'){
            define('RESOURCES_URL', "http://10.255.6.22:10302/fs"); //现网 - 文件服务器访问地址
        }else{
            define('RESOURCES_URL', "http://202.100.207.161:10202/fs"); //现网 - 文件服务器访问地址
        }
        define('ORDER_CALLBACK', "http://127.0.0.1:10000/cws/pay/order/callback/jiangsudx_com/index.php");  //现网 - 聚精彩订购通知回调地址
        define('ORDER_CALL_BACK_URL', "http://127.0.0.1:10000/cws/pay/hainandx/callback/index.php");  //现网 - 省内计费通知回调地址
        define('ORDER_CALL_BACK_URL_V1', "http://127.0.0.1:10000/cws/pay/hainandx/callback/index_v2.php");  //现网 - 省内计费通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://127.0.0.1:10000/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://127.0.0.1:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://10.255.6.22:10301/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://127.0.0.1:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://10.255.6.22:10301/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://127.0.0.1:10000/cws/wxserver"); // cws-wxserver模块 --- lws
        define('CWS_WXSERVER_URL_OUT', "http://10.255.6.22:10301/cws/wxserver"); // cws-wxserver模块 --- 页面
        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:11000"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10000/cws/39net/index.php"); // cws-39net模块

        // 设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

        // Redis配置
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 2:
        // 现网进入3983 使用现网数据
        define('SERVER_URL', "http://202.100.207.161:10201/cws/index.php?");  //现网 - cws服务器访问地址
        if($_SERVER['HTTP_HOST'] == '10.255.6.22:10302'){
            define('RESOURCES_URL', "http://10.255.6.22:10302/fs"); //现网 - 文件服务器访问地址
        }else{
            define('RESOURCES_URL', "http://202.100.207.161:10202/fs"); //现网 - 文件服务器访问地址
        }
        define('ORDER_CALLBACK', "http://127.0.0.1:10000/cws/pay/order/callback/jiangsudx_com/index.php");  //现网 - 聚精彩订购通知回调地址
        define('ORDER_CALL_BACK_URL', "http://127.0.0.1:10000/cws/pay/hainandx/callback/index.php");  //现网 - 省内计费通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws/report/index.php"); // 现网 - 上报订购信息 define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://127.0.0.1:10000/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://127.0.0.1:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://202.100.207.161:10000/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://127.0.0.1:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://202.100.207.161:10000/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://127.0.0.1:10000/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://202.100.207.161:10000/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:11000"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10000/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 3:
        // 本地内网测试服
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://10.254.30.100:8091/");
        define('ORDER_CALLBACK', "http://10.254.30.100:8100/cws/pay/order/callback/jiangsudx_com/index.php"); // 聚精彩订购通知回调地址
        define('ORDER_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/hainandx/callback/index.php");  //现网 - 省内计费通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.254.30.100:8100/cws/report/query_report.php");

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
        // 本地外网测试服
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?");
        define('RESOURCES_URL', "http://222.85.144.70:8091/");
        define('ORDER_CALLBACK', "http://222.85.144.70:8100/cws/pay/order/callback/jiangsudx_com/index.php"); // 聚精彩订购通知回调地址
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/hainandx/callback/index.php");  //现网 - 省内计费通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.85.144.70:8100/cws/report/query_report.php");

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

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 5:
        // 本地VPN
        define('SERVER_URL', "http://123.59.206.199:50019/cws/index.php?");
        define('RESOURCES_URL', "http://healthiptv-fs.langma.cn");
        define('ORDER_CALLBACK', "http://123.59.206.199:50019/cws/pay/order/callback/jiangsudx_com/index.php"); // 聚精彩订购通知回调地址
        define('ORDER_CALL_BACK_URL', "http://123.59.206.199:50019/cws/pay/hainandx/callback/index.php");  //现网 - 省内计费通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.199:50019/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://123.59.206.199:50019/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://123.59.206.199:50019/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://123.59.206.199:50019/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://123.59.206.199:50019/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://123.59.206.199:50019/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://123.59.206.199:50019/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://123.59.206.199:50019/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://123.59.206.199:50019/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://123.59.206.199:50019/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://123.59.206.196:10026"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://123.59.206.199:50019/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

        // Redis配置
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}