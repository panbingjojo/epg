<?php

/**
 * +----------------------------------------------------------------------
 * | 湖南电信的服务器配置
 * +----------------------------------------------------------------------
 * | USE_SERVER:
 * | 1、表示现网
 * | 2、表示内网测试服
 * | 3、外网测试服
 * | 发布时一定要确保是配置的正式服
 * +----------------------------------------------------------------------
 * | Author: wangjiang
 * | Date: 2021/1/14 11:11
 * +----------------------------------------------------------------------
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        //服务器主机地址
        if($_SERVER['HTTP_HOST'] == '10.255.26.9:10000'){
            define('IP', "http://10.255.26.9");
        }else{
            define('IP', "http://175.6.223.95");
        }
        define('HOST', "http://127.0.0.1");
        //cws端口号
        define('CWS_PORT', "10000");
        //fs端口号
        define('FS_PORT', "10001");
        //落地电话地址端口
        define('LOCAL_PHONE_PORT', "10010");
        //cws服务器主机地址
        define('SERVER_HOST', HOST.':'.CWS_PORT);
        //cws服务器访问地址
        define('SERVER_URL', SERVER_HOST.'/cws/index.php?');
        //文件服务器访问地址
        define('RESOURCES_URL', IP.':'.FS_PORT);
        // 订购上报地址
        define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");
        define('ORDER_CALLBACK', SERVER_HOST.'/cws/pay/hunandx/callback/index.php');

        // 问诊模块
        define("CWS_EXPERT_URL", SERVER_HOST."/cws/39hospital/index.php");           // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL", SERVER_HOST."/cws/hlwyy/index.php");                 // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", IP.':'.CWS_PORT."/cws/39hospital/index.php");       // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL_OUT", IP.':'.CWS_PORT."/cws/hlwyy/index.php");             // 互联网医院外网地址（用于前端拉取数据）
        define('CWS_WXSERVER_URL', SERVER_HOST."/cws/wxserver");                       // cws-微信模块
        define('SERVER_CONTROL_UNIT', HOST.':'.LOCAL_PHONE_PORT); //落地电话控制中心地址
        define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query_check.php");

        // 39健康网
        define('CWS_39NET_URL', SERVER_HOST."/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        // Redis模块
        define('REDIS_LOCAL_IP', "127.0.0.1");                                                      // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口

        define('APP_ROOT_PATH', IP . ":" .CWS_PORT . "/epg-lws-for-apk-430002");              // 应用入口地址,只有提供给外部链接才使用
        //设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');
        break;
    case 2:
        //服务器主机地址
        define('HOST', "http://127.0.0.1");
        //cws端口号
        define('CWS_PORT', "10000");
        //fs端口号
        define('FS_PORT', "10001");
        //落地电话地址端口
        define('LOCAL_PHONE_PORT', "10010");
        //cws服务器主机地址
        define('SERVER_HOST', HOST.':'.CWS_PORT);
        //cws服务器访问地址
        define('SERVER_URL', SERVER_HOST.'/cws/index.php?');
        //文件服务器访问地址
        define('RESOURCES_URL', 'http://175.6.223.95'.':'.FS_PORT);
        // 订购上报地址
        define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");

        define('ORDER_CALLBACK', "http://127.0.0.1:10000/cws/pay/hunandx/callback/index.php");
        // 问诊模块
        define("CWS_EXPERT_URL", SERVER_HOST."/cws/39hospital/index.php");           // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL", SERVER_HOST."/cws/hlwyy/index.php");                 // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", "http://175.6.223.95:10000/cws/39hospital/index.php");       // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://175.6.223.95:10000/cws/hlwyy/index.php");             // 互联网医院外网地址（用于前端拉取数据）
        define('CWS_WXSERVER_URL', "http://127.0.0.1:10000/cws/wxserver");                       // cws-微信模块
        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:10010"); //落地电话控制中心地址
        define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query_check.php");

        // 39健康网
        define('CWS_39NET_URL', SERVER_HOST."/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

        // Redis模块
        define('REDIS_LOCAL_IP', "127.0.0.1");                                                      // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口
        break;
    case 3:
        //服务器主机地址
        define('HOST', "http://test-healthiptv.langma.cn");
        //cws端口号
        define('CWS_PORT', "8100");
        //fs端口号
        define('FS_PORT', "8091");
        //落地电话地址端口
        define('LOCAL_PHONE_PORT', "40000");
        //cws服务器主机地址
        define('SERVER_HOST', HOST.':'.CWS_PORT);
        //cws服务器访问地址
        define('SERVER_URL', SERVER_HOST.'/cws/index.php?');
        //文件服务器访问地址
        define('RESOURCES_URL', HOST.':'.FS_PORT);
        // 订购上报地址
        define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");

        // 问诊模块
        define("CWS_EXPERT_URL", SERVER_HOST."/cws/39hospital/index.php");           // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL", SERVER_HOST."/cws/hlwyy/index.php");                 // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", SERVER_HOST."/cws/39hospital/index.php");       // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL_OUT", SERVER_HOST."/cws/hlwyy/index.php");             // 互联网医院外网地址（用于前端拉取数据）
        define('CWS_WXSERVER_URL', SERVER_HOST."/cws/wxserver");                       // cws-微信模块
        define('SERVER_CONTROL_UNIT', HOST.':'.LOCAL_PHONE_PORT); //落地电话控制中心地址
        define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query_check.php");

        define('ORDER_CALLBACK', SERVER_HOST.'/cws/pay/hunandx/callback/index.php');

        // 39健康网
        define('CWS_39NET_URL', SERVER_HOST."/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

        // Redis模块
//        define('REDIS_LOCAL_IP', "127.0.0.1");                                                      // redis本地服务器ip
//        define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口

//        define('APP_ROOT_PATH', SERVER_HOST."/epg-lws-for-apk-320013");              // 应用入口地址,只有提供给外部链接才使用
        break;

}

