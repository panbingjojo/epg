<?php
/**
 * Created by longmaster
 * Brief: 宁夏广电EPG
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服
 * 3、表示内网测试服
 */

define("USE_SERVER", 2);    //发布上线确保该值为1
switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_ENTRY_ADDR', "http://127.0.0.1:10010"); // 提供给APK插件使用
        define('SERVER_URL', "http://127.0.0.1:10010/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://100.100.1.176:10000/fs"); // 文件服务器访问地址
        define('CWS_HLWYY_URL', "http://127.0.0.1:10010/cws/hlwyy/index.php"); // cws-hlwyy模块
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        define('APP_ROOT_PATH', "http://100.100.1.176:10000");            //  应用入口地址

        define('EPG_API_SERVER', "http://10.233.239.24:8095/epg");            //  应用入口地址

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 2:
        // 现网进入3983 (正式服北京)
        define('SERVER_URL', "http://123.59.206.199:50011/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://123.59.206.199:20003/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALLBACK', "http://123.59.206.199:50011/cws/pay/jiangsudx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.199:50011/cws/report/index.php"); // 现网 - 上报订购信息

        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 3:
        // 公司测试服
        define('SERVER_ENTRY_ADDR', "http://10.254.30.100:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://222.85.144.70:8091"); // 文件服务器访问地址
        define('REDIS_LOCAL_IP', "10.254.30.100");
        define('REDIS_LOCAL_PORT', "6379");
        //define('APP_ROOT_PATH', "http://222.85.144.70:40020");            //  应用入口地址

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); //落地电话控制中心地址

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 4:
        // 现网（用户环境）
        define('SERVER_ENTRY_ADDR', "http://127.0.0.1:10010"); // 提供给APK插件使用
        define('SERVER_URL', "http://127.0.0.1:10010/cws-cesi/index.php?"); // cws服务器访问地址
        define('RESOURCES_URL', "http://100.100.1.176:10000/fs"); // 文件服务器访问地址
        define('CWS_HLWYY_URL', "http://127.0.0.1:10010/cws/hlwyy/index.php"); // cws-hlwyy模块
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        define('APP_ROOT_PATH', "http://100.100.1.176:10002");            //  应用入口地址

        define('EPG_API_SERVER', "http://10.233.239.24:8095/epg");            //  应用入口地址

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
}

