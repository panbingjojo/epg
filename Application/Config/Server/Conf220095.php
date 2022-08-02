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
 * 5、表示镜像测试服
 */
define("USE_SERVER", 2);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_ENTRY_ADDR', "http://10.128.3.146:10000"); // 提供给APK插件使用
        define('SERVER_URL', "http://10.128.3.146:10000/cws/index.php?"); // cws服务器访问地址
//        define('RESOURCES_URL', "http://10.128.3.146:10002/fs"); // 文件服务器访问地址
        if($_SERVER['HTTP_HOST'] == '10.128.3.146:10001'){
            define('RESOURCES_URL', "http://10.128.3.146:10002/fs"); //现网 - 文件服务器访问地址
        }else{
            define('RESOURCES_URL', "http://36.49.86.159:10002/fs"); //现网 - 文件服务器访问地址
        }
        define('ORDER_CALL_BACK_URL', "http://10.128.3.146:10000/cws/pay/jilingd/callback/dx_index.php"); // 购结果上传到CWS
        define('REPORT_ORDER_INFO_URL', "http://10.128.3.146:10000/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://10.128.3.146:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.128.3.146:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.128.3.146:10000/cws/report/query_report.php");

        // 问诊模块
        define('CWS_HLWYY_URL', "http://10.128.3.146:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://10.128.3.146:10000/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://10.128.3.146:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://10.128.3.146:10000/cws/39hospital/index.php");//大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://10.128.3.146:10000/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://10.128.3.146:10000/cws/wxserver"); // cws-wxserver模块 -- 页面

        define('SERVER_CONTROL_UNIT', "http://10.128.3.146:10014"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://10.128.3.146:10000/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        define('REDIS_LOCAL_IP', "127.0.0.1"); // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 2:
        // 现网进入3983
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://36.49.86.159:10000/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://36.49.86.159:10002/fs"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://36.49.86.159:10000/cws/pay/jilingd/callback/dx_index.php"); // 订购结果上传到CWS
        define('REPORT_ORDER_INFO_URL', "http://36.49.86.159:10000/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://36.49.86.159:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://36.49.86.159:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://36.49.86.159:10000/cws/report/query_report.php");

        // 问诊模块
        define('CWS_HLWYY_URL', "http://36.49.86.159:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://36.49.86.159:10000/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://36.49.86.159:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://36.49.86.159:10000/cws/39hospital/index.php");//大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://36.49.86.159:10000/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://36.49.86.159:10000/cws/wxserver"); // cws-wxserver模块

        // 39健康网
        define('CWS_39NET_URL', "http://36.49.86.159:10000/cws/39net/index.php"); // cws-39net模块

        define('SERVER_CONTROL_UNIT', "http://36.49.86.159:10014"); //落地电话控制中心地址

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
//        define('REDIS_LOCAL_IP', "10.254.30.100"); // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 3:
        // 本地内网测试服
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/jilingd/callback/index.php"); // 订购结果上传到CWS
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.254.30.100:8100/cws/report/query_report.php");

        // 问诊模块
        define('CWS_HLWYY_URL', "http://10.254.30.100:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://10.254.30.100:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块

        // 39健康网
        define('CWS_39NET_URL', "http://10.254.30.100:8100/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 4:
        // 本地外网测试
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/jilingd/callback/index.php"); // 订购结果上传到CWS
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.85.144.70:8100/cws/report/query_report.php");

        // 问诊模块
        define('CWS_HLWYY_URL', "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块

        // 39健康网
        define('CWS_39NET_URL', "http://10.254.30.100:8100/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        define('REDIS_LOCAL_IP', "10.254.30.100"); // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}

