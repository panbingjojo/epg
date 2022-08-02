<?php
    /**
 * Created by longmaster
 * Brief: 广西广电EPG
 */

/**
 * USE_SERVER:
 * 1、北京正式服数据--》广西广电的正式服数据有此服务器导入数据过去
 * 2、广西广电测试服内网---》用于局方上线前测试使用
 * 3、30.100测试服--》主要用于本地调试页面效果
 * 4、公司电脑访问正式服数据（在调整splash.js）
 */
define("USE_SERVER", 4);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        define('SERVER_URL', "http://10.0.4.170:39001/cws/index.php?");
        if($_SERVER['HTTP_HOST'] == '10.0.4.170:39002'){
            define('RESOURCES_URL', "http://10.0.4.170:39002/fs/"); //现网 - 文件服务器访问地址
        }else{
            define('RESOURCES_URL', "http://219.232.89.73:39002/fs/"); //现网 - 文件服务器访问地址
        }
        define('ORDER_CALLBACK', "http://10.0.4.170:39001/cws/pay/guangxigd/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://10.0.4.170:39001/cws/report/index.php");
        define('APP_INDEX_URL', "http://10.0.4.170:39002");
        define("PORTAL_URL", "http://10.1.15.43/nn_cms/nn_cms_view/gxcatv20/go_idc_v2.1.php?page=linux_home_hd");//局方入口
        define('QUERY_REPORT_USER_INFO_URL', "http://10.0.4.170:39001/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.0.4.170:39001/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.0.4.170:39001/cws/report/query_report.php");

        // 问诊模块
        define("CWS_EXPERT_URL", "http://10.0.4.170:39001/cws/39hospital/index.php");                        // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", "http://10.0.4.170:39001/cws/39hospital/index.php");       // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL", "http://10.0.4.170:39001/cws/hlwyy/index.php");                              // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://10.0.4.170:39001/cws/hlwyy/index.php");             // 互联网医院外网地址（用于前端拉取数据）
        define('CWS_WXSERVER_URL', "http://10.0.4.170:39001/cws/wxserver");                       // cws-微信模块
        define('SERVER_CONTROL_UNIT', "http://10.0.4.170:39001/cws/landphone"); //落地电话控制中心地址

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        // 39健康网
        define('CWS_39NET_URL', "http://10.0.4.170:39001/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis模块
        define('REDIS_LOCAL_IP', "127.0.0.1");                                                      // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口
        break;

    case 2:
        define('SERVER_URL', "http://123.59.206.199:20009/cws/index.php?");
        define('RESOURCES_URL', "http://123.59.206.199:10002/");
        define('ORDER_CALLBACK', "http://123.59.206.199:20009/cws/pay/guangxigd/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.199:20009/cws/report/index.php");
        define('APP_INDEX_URL', "http://192.168.200.100");
        define("PORTAL_URL", "http://10.1.15.43/nn_cms/nn_cms_view/gxcatv20/go_idc_v2.1.php?page=linux_home_hd");//局方入口地址
        define('QUERY_REPORT_USER_INFO_URL', "http://123.59.206.199:20009/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://123.59.206.199:20009/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://123.59.206.199:20009/cws/report/query_report.php");

        // 问诊模块
        define("CWS_EXPERT_URL", "http://123.59.206.199:20009/cws/39hospital/index.php");                        // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", "http://123.59.206.199:200091/cws/39hospital/index.php");       // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL", "http://123.59.206.199:20009/cws/hlwyy/index.php");                              // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://123.59.206.199:20009/cws/hlwyy/index.php");             // 互联网医院外网地址（用于前端拉取数据）
        define('CWS_WXSERVER_URL', "http://123.59.206.199:20009/cws/wxserver");                       // cws-微信模块
        define('SERVER_CONTROL_UNIT', "http://123.59.206.199:20009/cws/landphone"); //落地电话控制中心地址

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        // 39健康网
        define('CWS_39NET_URL', "http://123.59.206.199:20009/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis模块
        define('REDIS_LOCAL_IP', "127.0.0.1");                                                      // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口
        break;

    case 3:
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?");
        define('RESOURCES_URL', "http://test-healthiptv-fs.langma.cn:8091/");
        define('ORDER_CALLBACK', "http://222.85.144.70:8100/cws/pay/guangxigd/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://180.100.134.116:10014/cws/report/index.php");
        define('APP_INDEX_URL', "http://192.168.200.100");
        define("PORTAL_URL", "http://10.1.15.43/nn_cms/nn_cms_view/gxcatv20/go_idc_v2.1.php?page=linux_home_hd");//局方入口地址
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws//report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws//report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.85.144.70:8100/cws/report/query_report.php");

        // 问诊模块
        define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");                        // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php");       // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL", "http://222.85.144.70:8100/cws/hlwyy/index.php");                              // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php");             // 互联网医院外网地址（用于前端拉取数据）
        define('CWS_WXSERVER_URL', "http://222.85.144.70:8100/cws/wxserver");                       // cws-微信模块
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis模块
        define('REDIS_LOCAL_IP', "10.254.30.100");                                                      // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口
        break;

    case 4: // 公司访问正式服数据
        define('SERVER_URL', "http://219.232.89.73:39001/cws/index.php?");
        define('RESOURCES_URL', "http://219.232.89.73:39002/fs/");
        define('ORDER_CALLBACK', "http://219.232.89.73:39001/cws/pay/guangxigd/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://219.232.89.73:39001/cws/report/index.php");
        define('APP_INDEX_URL', "http://219.232.89.73:39002");
        define("PORTAL_URL", "http://10.1.15.43/nn_cms/nn_cms_view/gxcatv20/go_idc_v2.1.php?page=linux_home_hd");//局方入口
        define('QUERY_REPORT_USER_INFO_URL', "http://219.232.89.73:39001/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://219.232.89.73:39001/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://219.232.89.73:39001/cws/report/query_report.php");

        // 问诊模块
        define("CWS_EXPERT_URL", "http://219.232.89.73:39001/cws/39hospital/index.php");                        // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", "http://219.232.89.73:39001/cws/39hospital/index.php");       // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL", "http://219.232.89.73:39001/cws/hlwyy/index.php");                              // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://219.232.89.73:39001/cws/hlwyy/index.php");             // 互联网医院外网地址（用于前端拉取数据）
        define('CWS_WXSERVER_URL', "http://219.232.89.73:39001/cws/wxserver");                       // cws-微信模块
        define('SERVER_CONTROL_UNIT', "http://219.232.89.73:39001/cws/landphone"); //落地电话控制中心地址

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        // 39健康网
        define('CWS_39NET_URL', "http://219.232.89.73:39001/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis模块
//        define('REDIS_LOCAL_IP', "10.254.30.100");                                                      // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口
        break;
}

