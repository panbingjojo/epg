<?php
/**
 * Created by longmaster
 * Brief: 贵州广电WEB-EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服 （用户测试服）
 * 3、表示北京测试服
 * 3、表示内网测试服
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境-内网）
        define('SERVER_ENTRY_ADDR', "http://192.168.8.80:10002");                       // 提供给APK插件使用
        define('SERVER_HOST', "http://192.168.8.80:10002");                             // cws服务器主机地址
        define('SERVER_URL', "http://192.168.8.80:10002/cws/index.php?");               // 现网 - cws服务器访问地址
//        define('RESOURCES_URL', "http://10.255.12.54:10002/fs");                        // 文件服务器地址
        if($_SERVER['HTTP_HOST'] == '10.255.12.54:10002'){
            define('RESOURCES_URL', "http://10.255.12.54:10002/fs"); //现网 - 文件服务器访问地址
        }else{
            define('RESOURCES_URL', "http://10.254.56.101:10008/fs"); //现网 - 文件服务器访问地址
        }
        define('SERVER_GUAHAO', "http://10.255.12.54:10002/cws/guahaotupian");                      // 预约挂号服务器（显示首页医院图片）
        define('SERVER_GUAHAO_CWS', SERVER_HOST ."/cws/guahao/index.php?");             // cws挂号代理服务器
        define('SERVER_GUAHAO_CWS_FS',  "http://10.255.12.54:10002/cws/guahao/");       // cws挂号代理服务器图片地址
        define("CWS_EXPERT_URL", SERVER_HOST . "/cws/39hospital/index.php");            // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL", SERVER_HOST . "/cws/hlwyy/index.php");                  // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define('ORDER_CALL_BACK_URL', "http://192.168.8.80:10002/cws/pay/guizhoudx/callback/index.php");
        define("CWS_EXPERT_URL_OUT",  "http://10.255.12.54:10002/cws/39hospital/index.php");         // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL_OUT",  "http://10.255.12.54:10002/cws/hlwyy/index.php");               //  互联网医院外网地址（用于前端拉取数据）
        define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");          // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://192.168.8.80:10002/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://192.168.8.80:10002/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://192.168.8.80:10002/cws/report/query_report.php");

        define('SERVER_CONTROL_UNIT', "http://192.168.8.80:10006"); //落地电话控制中心地址

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');
        define('REDIS_LOCAL_IP', "127.0.0.1");                                          // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");                                             // redis本地服务器端口

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        define('APP_ROOT_PATH', "http://10.255.12.54:10002");
        break;
    case 2:
        // 现网进入3983 (用户环境)
        define('SERVER_ENTRY_ADDR', "http://192.168.8.80:10002");                       // 提供给APK插件使用
        define('SERVER_HOST', "http://192.168.8.80:10002");                             // cws服务器主机地址
        define('SERVER_URL', "http://192.168.8.80:10002/cws/index.php?");               // 现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://10.255.12.54:10002/fs");                        // 文件服务器地址
        define('SERVER_GUAHAO', "http://10.255.12.54:10002/cws/guahaotupian");                      // 预约挂号服务器（显示首页医院图片）
        define('SERVER_GUAHAO_CWS', SERVER_HOST ."/cws/guahao/index.php?");             // cws挂号代理服务器
        define('SERVER_GUAHAO_CWS_FS',  "http://10.255.12.54:10002/cws/guahao/");       // cws挂号代理服务器图片地址
        define("CWS_EXPERT_URL", SERVER_HOST . "/cws/39hospital/index.php");            // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL", SERVER_HOST . "/cws/hlwyy/index.php");                  // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT",  "http://10.255.12.54:10002/cws/39hospital/index.php");         // 大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL_OUT",  "http://10.255.12.54:10002/cws/hlwyy/index.php");               //  互联网医院外网地址（用于前端拉取数据）
        define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");          // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://192.168.8.80:10002/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://192.168.8.80:10002/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://192.168.8.80:10002/cws/report/query_report.php");
        define('SERVER_CONTROL_UNIT', "http://192.168.8.80:10006"); //落地电话控制中心地址

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');
//        define('REDIS_LOCAL_IP', "127.0.0.1");                                          // redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379");                                             // redis本地服务器端口
        break;

    case 3:
        // 现网进入3983 (正式服北京)
        define('SERVER_URL', "http://123.59.206.199:50006/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://123.59.206.199:20003/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALLBACK', "http://123.59.206.199:50006/cws/pay/jiangsudx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.199:50006/cws/report/index.php"); // 现网 - 上报订购信息
//        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
//        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 4:
        // 本地内网测试服
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_HOST', "http://test-healthiptv.langma.cn:8100"); // cws服务器主机地址
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://10.254.30.100:8091/");
        define('SERVER_GUAHAO', "http://test-healthiptv-guahao.langma.cn:8090/"); // 预约挂号服务器（显示首页医院图片）
        define('SERVER_GUAHAO_CWS', SERVER_HOST ."/cws/guahao/index.php?"); // cws挂号代理服务器
        define('SERVER_GUAHAO_CWS_FS', SERVER_HOST ."/cws/guahao/"); // cws挂号代理服务器图片地址
        define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");         //大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL", "http://222.85.144.70:8100/cws/hlwyy/index.php");                //互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php");    //大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php");           //互联网医院外网地址（用于前端拉取数据）
        define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.85.144.70:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.85.144.70:8100/cws/report/query_report.php");
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        //define('APP_ROOT_PATH', "http://localhost:8095");
        break;
}
