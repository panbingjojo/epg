<?php
/**
 * Created by longmaster
 * Brief: 贵州广电WEB-EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服 （北京测试服）
 * 3、表示内网测试服
 */

define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_URL', "http://192.168.8.80:10002/lmzhjkpic/cws/index.php?");  //现网 - cws服务器访问地址
        define('SERVER_HOST', "http://192.168.8.80:10002/lmzhjkpic");
        define('RESOURCES_URL', "http://10.255.12.54:10002/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALL_BACK_URL', "http://192.168.8.80:10002/lmzhjkpic/cws/pay/chongqingdx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://192.168.8.80:10002/lmzhjkpic/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://192.168.8.80:10002/lmzhjkpic/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://192.168.8.80:10002/lmzhjkpic/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://192.168.8.80:10002/lmzhjkpic/cws/report/query_report.php");
	    define('SERVER_GUAHAO', "http://10.255.12.54:10002/cws/guahaotupian");
        define('SERVER_GUAHAO_CWS', "http://127.0.0.1:10007" ."/cws/guahao/index.php?");
	    define('SERVER_GUAHAO_CWS_FS',  "http://10.255.12.54:10002/lmzhjkpic/cws/guahao/");

        define('SERVER_CONTROL_UNIT', "http://192.168.8.80:10006"); //落地电话控制中心地址

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
		
	// redis
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        //define('APP_ROOT_PATH', "http://10.255.12.54:10002/xinmeiti");            //  应用入口地址
        break;

    case 2:
        // 现网进入3983 (正式服北京)
        define('SERVER_URL', "http://123.59.206.199:20002/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://healthiptv-fs.langma.cn/"); //现网 - 文件服务器访问地址
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.199:20002/cws/report/index.php"); // 现网 - 上报用户信息
        define('QUERY_REPORT_USER_INFO_URL', "http://10.69.46.209:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.69.46.209:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.69.46.209:10000/cws/report/query_report.php");

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 3:
        define('SERVER_HOST', "http://test-healthiptv.langma.cn:8100"); // cws服务器主机地址
        // 本地内网测试服
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://10.254.30.100:8091/");
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php"); // 上报用户信息
        define('QUERY_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.254.30.100:8100/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.254.30.100:8100/cws/report/query_report.php");

        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        //define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        //define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}
