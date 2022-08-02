<?php
/**
 * Created by longmaster
 * Brief: 广东广电EPG
 */


/**
 * 广东广电
 * USE_SERVER:
 * 1、表示现网
 * 2、表示内网测试服
 * 3、本地拉取正式服的数据
 */
define("USE_SERVER", 1);    //发布上线确保该值为1
define("GUANGDONG_DEBUG", 0);  //调试

switch (USE_SERVER) {
    case 1:
        define('SERVER_HOST', "http://127.0.0.1:10006");                                            // cws服务器主机地址
        define('SERVER_URL', SERVER_HOST . "/cws/index.php?");                                      // cws服务器访问地址
        if ($_SERVER['HTTP_HOST'] == '172.31.134.185:10017') {
            define('RESOURCES_URL', "http://172.31.134.185:10004/fs");                                  // 现网 - 文件服务器访问地址
        } else {
            define('RESOURCES_URL', "http://203.132.32.92:10004/fs");                                   // 现网 - 文件服务器访问地址
        }
        define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query.php");
//回调
        define('ORDER_CALL_BACK_URL', SERVER_HOST . "/cws/pay/guangdonggd/callback/apk_index.php");  //现网 - 订购通知回调地址
        define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', SERVER_HOST . "/cws/report/query_report.php");

        // 问诊模块
        define("CWS_EXPERT_URL", SERVER_HOST . "/cws/39hospital/index.php");                        // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", "http://172.31.134.185:10006/cws/39hospital/index.php");       // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL", SERVER_HOST . "/cws/hlwyy/index.php");                              // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://172.31.134.185:10006/cws/hlwyy/index.php");             // 互联网医院外网地址（用于前端拉取数据）
        define('CWS_WXSERVER_URL', "http://127.0.0.1:10006/cws/wxserver");                       // cws-微信模块
        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:10019"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10006/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis模块
        define('REDIS_LOCAL_IP', "127.0.0.1");                                                      // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口
        define('APP_ROOT_PATH', "http://172.31.134.185:10017");                                    // 应用入口地址,只有提供给外部链接才使用
        break;

    case 2:

        if(GUANGDONG_DEBUG == 1){
            define('SERVER_ENTRY_ADDR', "http://120.70.237.86:10006");  //现网 - cws服务器访问地址
            define('SERVER_URL', "http://120.70.237.86:10006/cws/index.php?");
            define('RESOURCES_URL', "http://120.70.237.86:10006/fs/");
            define('ORDER_CALLBACK', "http://120.70.237.86:10006/cws/pay/xinjiangdx/callback/index.php");
            define('REPORT_ORDER_INFO_URL', "http://120.70.237.86:10006/cws/report/index.php");
            define('QUERY_REPORT_USER_INFO_URL', "http://120.70.237.86:10006/cws/report/query.php");
            define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://120.70.237.86:10006/cws/report/query_check.php");
            // 问诊模块
            define('CWS_HLWYY_URL', "http://120.70.237.86:10006/cws/hlwyy/index.php"); // cws-hlwyy模块
            define("CWS_HLWYY_URL_OUT", "http://120.70.237.86:10006/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
            define("CWS_EXPERT_URL", "http://120.70.237.86:10006/cws/39hospital/index.php");
            define("CWS_EXPERT_URL_OUT", "http://120.70.237.86:10006/cws/39hospital/index.php"); // 大专家头像外网地址
            define('CWS_WXSERVER_URL', "http://120.70.237.86:10006/cws/wxserver"); // cws-wxserver模块
            define('SERVER_CONTROL_UNIT', "http://120.70.237.86:10006/cws/landphone"); //落地电话控制中心地址

            // IPTV中转代理接口
            define('SERVER_IPTVFORWARD_CWS', "http://120.70.237.86:10006/cws/IPTVForward/index.php");
            define('SERVER_IPTVFORWARD_CWS_FS', "http://120.70.237.86:10006/cws/IPTVForward/");

            // 39健康网
            define('CWS_39NET_URL', "http://120.70.237.86:10006/cws/39net/index.php"); // cws-39net模块

            // 图文问诊地址
            define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

            //设备平台
            define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
            // Redis
            define('REDIS_LOCAL_IP', "10.254.30.100");
            define('REDIS_LOCAL_PORT', "6379");

        }else{
            // 本地内网测试服
            define('SERVER_HOST', "http://222.85.144.70:8100");                             // cws服务器主机地址
            define('SERVER_URL', SERVER_HOST . "/cws/index.php?");                                      // cws服务器访问地址
            define('RESOURCES_URL', "http://222.85.144.70:8091");                           // 文件服务器访问地址
            define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");
            define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query.php");
            define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query_check.php");
            define('REPORT_ORDER_STATUS_URL', SERVER_HOST . "/cws/report/query_report.php");
//回调
            define('ORDER_CALL_BACK_URL', SERVER_HOST . "/cws/pay/guangdonggd/callback/apk_index.php");  //现网 - 订购通知回调地址

            // 问诊模块
            define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");             // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
            define("CWS_HLWYY_URL", "http://222.85.144.70:8100/cws/hlwyy/index.php");                   // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
            define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php");         // 大专家外网地址（用于前端拉取数据）
            define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php");               // 互联网医院外网地址（用于前端拉取数据）
            define('CWS_WXSERVER_URL', "http://222.85.144.70:8100/cws/wxserver");                       // cws-微信模块
            define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

            // 39健康网
            define('CWS_39NET_URL', "http://172.31.134.185:10006/cws/39net/index.php"); // cws-39net模块

            //设备平台
            define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

            // 图文问诊地址
            define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

            // Redis模块
//        define('REDIS_LOCAL_IP', "127.0.0.1");                                                      // redis本地服务器ip
            define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口
            //define('APP_ROOT_PATH', "http://172.31.134.185:10014");                                    // 应用入口地址,只有提供给外部链接才使用
            define('APP_ROOT_PATH', "http://10.254.59.61");                                    // 应用入口地址,只有提供给外部链接才使用
        }

        break;

    case 3:
        define('SERVER_HOST', "http://203.132.32.92:10006");                                        // cws服务器主机地址
        define('SERVER_URL', SERVER_HOST . "/cws/index.php?");                                      // cws服务器访问地址
        if ($_SERVER['HTTP_HOST'] == '172.31.134.185:10004') {
            define('RESOURCES_URL', "http://172.31.134.185:10004/fs");                              // 现网 - 文件服务器访问地址
        } else {
            define('RESOURCES_URL', "http://203.132.32.92:10004/fs");                               // 现网 - 文件服务器访问地址
        }
        define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', SERVER_HOST . "/cws/report/query_report.php");
        //回调
        define('ORDER_CALL_BACK_URL', SERVER_HOST . "/cws/pay/guangdonggd/callback/apk_index.php");  //现网 - 订购通知回调地址

        // 问诊模块
        define("CWS_EXPERT_URL", SERVER_HOST . "/cws/39hospital/index.php");                        // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL", "http://203.132.32.92:10006/cws/hlwyy/index.php");                  // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", SERVER_HOST . "/cws/39hospital/index.php");                    // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://203.132.32.92:10006/cws/hlwyy/index.php");              // 互联网医院外网地址（用于前端拉取数据）
        define('CWS_WXSERVER_URL', "http://203.132.32.92:10006/cws/wxserver");                      // cws-微信模块
        define('SERVER_CONTROL_UNIT', "http://203.132.32.92:10019"); //落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://203.132.32.92:10006/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis模块
//        define('REDIS_LOCAL_IP', "127.0.0.1");                                                      // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");                                                         // redis本地服务器端口

//        define('APP_ROOT_PATH', "http://203.132.32.92:10006");                                     // 应用入口地址,只有提供给外部链接才使用
        break;
}