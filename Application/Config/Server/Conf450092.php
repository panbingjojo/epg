<?php
/**
 * Created by longmaster
 * Brief: 广东广电WEB-EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服 （北京测试服）
 * 3、表示内网测试服
 * 4、VPN走正式服
 */
define("USE_SERVER",  5);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_URL', "http://127.0.0.1:10012/cws/index.php?");  //现网 - cws服务器访问地址
        if($_SERVER['HTTP_HOST'] == '222.217.76.249:9133') {
            define('RESOURCES_URL', "http://222.217.76.249:9133/fs"); //现网 - 文件服务器访问地址
        } else {
            define('RESOURCES_URL', "http://123.59.206.196:20000/fs"); //现网 - 文件服务器访问地址
        }
        define('ORDER_CALLBACK', "http://127.0.0.1:10012/cws/pay/guangxidx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10012/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10012/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10012/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://127.0.0.1:10012/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://127.0.0.1:10012/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.217.76.249:9133/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://127.0.0.1:10012/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.217.76.249:9133/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://127.0.0.1:10012/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://222.217.76.249:9133/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:21000"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10012/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'http://123.59.206.196:20025');

        // Redis配置
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 2:
        // 现网进入3983
        define('SERVER_URL', "http://123.59.206.199:10000/cws/index.php?");
        define('RESOURCES_URL', "http://123.59.206.199:10002/");
        define('ORDER_CALLBACK', "http://123.59.206.199:10000/cws/pay/guangxidx/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.199:10000/cws/report/index.php");
        define('QUERY_REPORT_USER_INFO_URL', "http://123.59.206.199:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://123.59.206.199:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://123.59.206.199:10000/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://123.59.206.199:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://123.59.206.199:10000/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://123.59.206.199:10000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://123.59.206.199:10000/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://123.59.206.199:10000/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://123.59.206.199:10000/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://123.59.206.199:10000/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 3:
        // 本地内网测试服
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?");
        define('RESOURCES_URL', "http://test-healthiptv-fs.langma.cn:8091/");
        define('ORDER_CALLBACK', "http://222.85.144.70:8100/cws/pay/guangxidx/callback/index.php");
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
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
//        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 4:
        // VPN 走正式服
        define('SERVER_URL', "http://222.217.76.249:9133/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://222.217.76.249:9133/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALLBACK', "http://222.217.76.249:9133/cws/pay/guangxidx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://222.217.76.249:9133/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://222.217.76.249:9133/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://222.217.76.249:9133/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://222.217.76.249:9133/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://222.217.76.249:9133/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.217.76.249:9133/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://222.217.76.249:9133/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.217.76.249:9133/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://222.217.76.249:9133/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://222.217.76.249:9133/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:11000"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://222.217.76.249:9133/cws/39net/index.php"); // cws-39net模块

        // Redis配置
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 5:
        // 正向代理正式服
        define('SERVER_URL', "http://123.59.206.196:20000/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://123.59.206.196:20000/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALLBACK', "http://123.59.206.196:20000/cws/pay/guangxidx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.196:20000/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://123.59.206.196:20000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://123.59.206.196:20000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://123.59.206.196:20000/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://123.59.206.196:20000/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://123.59.206.196:20000/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://123.59.206.196:20000/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://123.59.206.196:20000/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://123.59.206.196:20000/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://123.59.206.196:20000/cws/wxserver"); // cws-wxserver模块
//        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:11000"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://123.59.206.196:20000/cws/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
//        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 6:
        // 正式服改版测试
        define('SERVER_URL', "http://127.0.0.1:10011/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://222.217.76.249:9136/fs"); //现网 - 文件服务器访问地址
        define('ORDER_CALLBACK', "http://127.0.0.1:10011/cws/gx/pay/guangxidx/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://127.0.0.1:10011/cws/report/index.php"); // 现网 - 上报订购信息
        define('QUERY_REPORT_USER_INFO_URL', "http://127.0.0.1:10011/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://127.0.0.1:10011/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://127.0.0.1:10011/cws/report/query_report.php");

        // 问诊相关
        define('CWS_HLWYY_URL', "http://127.0.0.1:10011/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.217.76.249:9136/cws/hlwyy/index.php"); //  cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://127.0.0.1:10011/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.217.76.249:9136/cws/39hospital/index.php"); // 大专家头像外网地址
        define('CWS_WXSERVER_URL', "http://127.0.0.1:10011/cws/wxserver"); // cws-wxserver模块
        define('CWS_WXSERVER_URL_OUT', "http://222.217.76.249:9136/cws/wxserver"); // cws-wxserver模块
        define('SERVER_CONTROL_UNIT', "http://127.0.0.1:11000"); // 落地电话控制中心地址

        // 39健康网
        define('CWS_39NET_URL', "http://127.0.0.1:10000/cws/gx/39net/index.php"); // cws-39net模块

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}
