<?php
/**
 * Created by longmaster
 * Brief: 中国联通EPG
 */


/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服
 * 3、表示内网测试服
 * 4、表示外网测试服
 * 5、表示镜像测试服
 * 6、表示云服务器new
 */

define("USE_SERVER", 3);    //发布上线确保该值为1
switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_ENTRY_ADDR', "http://202.99.114.152:30215"); // 提供给APK插件使用
        define('SERVER_URL', "http://172.16.51.2:30215/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://202.99.114.152:30214/fs"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://172.16.51.2:30215/cws/pay/chinaunicom/callback/web_index.php"); // 购结果上传到CWS
        define('ORDER_CALL_BACK_URL_EX', "http://172.16.51.2:30215/cws/pay/chinaunicom/callback/web2_index.php"); // 购结果上传到CWS -- 新订购接口的结果
        define('UNSUBSCRIBE_VIP_CALL_BACK_URL', "http://172.16.51.2:30215/cws/pay/chinaunicom/callback/web_unsub_index.php"); // 退订上报结果（使用订购接口来处理）
        define('CANCEL_VIP_CALL_BACK_URL', "http://172.16.51.2:30215/cws/pay/chinaunicom/callback/web_unsub2_index.php"); // 退订上报结果（新的退订接口）
        define('REPORT_ORDER_INFO_URL', "http://172.16.51.2:30215/cws/report/index.php");
        define('QUERY_REPORT_ORDER_INFO_URL', "http://172.16.51.2:30215/cws/pay/chinaunicom/callback/order_query.php"); // 查询上报哪家的订购url
        define('QUERY_REPORT_USER_INFO_URL', "http://172.16.51.2:30215/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://172.16.51.2:30215/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://172.16.51.2:30215/cws/report/query_report.php");

        // 问诊模块
        define('CWS_HLWYY_URL', "http://172.16.51.2:30215/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://202.99.114.152:30215/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://172.16.51.2:30215/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://202.99.114.152:30215/cws/39hospital/index.php");//大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://172.16.51.2:30215/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://202.99.114.152:30215/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://172.16.51.2:30279"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://172.16.51.2:30215/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 2:
        // 现网进入3983
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/chinaunicom/callback/web_index.php"); // 购结果上传到CWS
        define('ORDER_CALL_BACK_URL_EX', "http://222.85.144.70:8100/cws/pay/chinaunicom/callback/web2_index.php"); // 购结果上传到CWS -- 新订购接口的结果
        define('UNSUBSCRIBE_VIP_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/chinaunicom/callback/web_unsub_index.php"); // 退订上报结果
        define('CANCEL_VIP_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/chinaunicom/callback/web_unsub2_index.php"); // 退订上报结果（新的退订接口）
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");
        define('QUERY_REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/pay/chinaunicom/callback/order_query.php"); // 查询上报哪家的订购url
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.85.144.70:8100/cws/report/query_report.php");

        // 问诊模块
        define('CWS_HLWYY_URL', "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php");//大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis
//        define('REDIS_LOCAL_IP', "10.254.30.100");
        define('REDIS_LOCAL_PORT', "6379");
//        define('APP_ROOT_PATH', "http://202.99.114.152:30213");            //  应用入口地址, 在本机浏览器测试需要注释这行
        break;
    case 3:
        // 本地内网测试服
        define('SERVER_ENTRY_ADDR', "http://202.99.114.152:30215"); // 提供给APK插件使用
        define('SERVER_URL', "http://202.99.114.152:30215/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://202.99.114.152:30214/fs"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/chinaunicom/callback/web_index.php"); // 购结果上传到CWS
        define('ORDER_CALL_BACK_URL_EX', "http://10.254.30.100:8100/cws/pay/chinaunicom/callback/web2_index.php"); // 购结果上传到CWS -- 新订购接口的结果
        define('UNSUBSCRIBE_VIP_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/chinaunicom/callback/web_unsub_index.php"); // 退订上报结果
        define('CANCEL_VIP_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/chinaunicom/callback/web_unsub2_index.php"); // 退订上报结果（新的退订接口）
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('QUERY_REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/pay/chinaunicom/callback/order_query.php"); // 查询上报哪家的订购url
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
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis
//        define('REDIS_LOCAL_IP', "10.254.30.100");
        define('REDIS_LOCAL_PORT', "6379");
        //define('APP_ROOT_PATH', "http://222.85.144.70:40020");            //  应用入口地址
        break;
    case 4:
        // 本地外网测试
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/chinaunicom/callback/web_index.php"); // 购结果上传到CWS
        define('ORDER_CALL_BACK_URL_EX', "http://222.85.144.70:8100/cws/pay/chinaunicom/callback/web2_index.php"); // 购结果上传到CWS -- 新订购接口的结果
        define('UNSUBSCRIBE_VIP_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/chinaunicom/callback/web_unsub_index.php"); // 退订上报结果
        define('CANCEL_VIP_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/chinaunicom/callback/web_unsub2_index.php"); // 退订上报结果（新的退订接口）
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");
        define('QUERY_REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/pay/chinaunicom/callback/order_query.php"); // 查询上报哪家的订购url
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
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis
//        define('REDIS_LOCAL_IP', "10.254.30.100");
        define('REDIS_LOCAL_PORT', "6379");

        //define('APP_ROOT_PATH', "http://222.85.144.70:40020");            //  应用入口地址
        break;
    case 5:
        // 镜像测试服
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/chinaunicom/callback/web_index.php"); // 购结果上传到CWS
        define('ORDER_CALL_BACK_URL_EX', "http://10.254.30.100:8100/cws/pay/chinaunicom/callback/web2_index.php"); // 购结果上传到CWS -- 新订购接口的结果
        define('UNSUBSCRIBE_VIP_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/chinaunicom/callback/web_unsub_index.php"); // 退订上报结果
        define('CANCEL_VIP_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/chinaunicom/callback/web_unsub2_index.php"); // 退订上报结果（新的退订接口）
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('QUERY_REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/pay/chinaunicom/callback/order_query.php"); // 查询上报哪家的订购url
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.85.144.70:8100/cws/report/query_report.php");

        // 问诊模块
        define('CWS_HLWYY_URL', "http://10.254.30.100:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://10.254.30.100:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://10.254.30.100:8100/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://222.85.144.70:8100/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis
        define('REDIS_LOCAL_IP', "10.254.30.100");
        define('REDIS_LOCAL_PORT', "6379");
        define('APP_ROOT_PATH', "http://222.85.144.70:40020");            //  应用入口地址
        break;
}

