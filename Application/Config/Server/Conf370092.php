<?php
/**
 * Created by longmaster
 * Brief: 山东电信EPG
 */


/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服
 * 3、表示内网测试服
 * 4、表示外网测试服
 * 5、表示山东广电服务器
 */

define("USE_SERVER", 1);    //发布上线确保该值为1
switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_ENTRY_ADDR', "http://sddx.39health.visionall.cn:10000"); // 提供给APK插件使用
        define('SERVER_URL', "http://192.168.0.80:10000/cws/index.php?");  // cws服务器访问地址
        define('RESOURCES_URL', "http://sddx.39health.visionall.cn:10002"); // 文件服务器访问地址
        define('REPORT_ORDER_INFO_URL', "http://192.168.0.80:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://192.168.0.80:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://192.168.0.80:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://192.168.0.80:10000/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://192.168.0.80:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://sddx.39health.visionall.cn:10000/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://192.168.0.80:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://sddx.39health.visionall.cn:10000/cws/39hospital/index.php");//大专家头像外网地址
        define('ORDER_CALL_BACK_URL', SERVER_ENTRY_ADDR . "/cws/pay/shandongdx/callback/web_index.php");  //现网 - 订购通知回调地址
        define('SERVER_CONTROL_UNIT', "http://192.168.0.80:10008"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10000/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

        // redis
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 2:
        // 现网进入3983
        define('SERVER_ENTRY_ADDR', "http://sddx.39health.visionall.cn:10000"); // 提供给APK插件使用
        define('SERVER_URL', "http://192.168.0.80:10000/cws/index.php?");  // cws服务器访问地址
        define('RESOURCES_URL', "http://sddx.39health.visionall.cn:10002"); // 文件服务器访问地址
        define('REPORT_ORDER_INFO_URL', "http://192.168.0.80:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://192.168.0.80:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://192.168.0.80:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://192.168.0.80:10000/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://sddx.39health.visionall.cn:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://sddx.39health.visionall.cn:10000/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://sddx.39health.visionall.cn:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://sddx.39health.visionall.cn:10000/cws/39hospital/index.php");//大专家头像外网地址
        define('ORDER_CALL_BACK_URL', SERVER_ENTRY_ADDR . "/cws/pay/shandongdx/callback/index.php");  //现网 - 订购通知回调地址
        define('SERVER_CONTROL_UNIT', "http://sddx.39health.visionall.cn:10008"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // redis
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 3:
        // 本地内网测试服
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.254.30.100:8100/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://10.254.30.100:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://10.254.30.100:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块
        define('ORDER_CALL_BACK_URL', SERVER_ENTRY_ADDR . "/cws/pay/shandongdx/callback/index.php");  //现网 - 订购通知回调地址
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://10.254.30.100:8100/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // redis
//        define('REDIS_LOCAL_IP', "10.254.30.100");
//        define('REDIS_LOCAL_PORT', "6379");
        break;

    case 4:
        // 本地外网测试
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.85.144.70:8100/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php"); // 大专家头像外网地址
        define('ORDER_CALL_BACK_URL', SERVER_ENTRY_ADDR . "/cws/pay/shandongdx/callback/index.php");  //现网 - 订购通知回调地址
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://223.221.36.146:10000/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // redis
        define('REDIS_LOCAL_IP', "10.254.30.100");
        define('REDIS_LOCAL_PORT', "6379");
        break;

    case 5:
        // 现网（广电服务器）
        define('SERVER_ENTRY_ADDR', "http://sddx.39health.visionall.cn:10000"); // 提供给APK插件使用
        define('SERVER_URL', "http://127.0.0.1:10000/cws/index.php?");  // cws服务器访问地址
        define('RESOURCES_URL', "http://sddx.39health.visionall.cn:10002"); // 文件服务器访问地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://127.0.0.1:10000/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://127.0.0.1:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://sddx.39health.visionall.cn:10000/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://127.0.0.1:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://sddx.39health.visionall.cn:10000/cws/39hospital/index.php");//大专家头像外网地址
        define('ORDER_CALL_BACK_URL', "http://127.0.0.1:10000/cws/pay/shandongdx/callback/web_index.php");  //现网 - 订购通知回调地址
        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:10009"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://223.221.36.146:10000/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}

