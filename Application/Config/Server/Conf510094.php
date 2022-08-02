<?php
/**
 * Created by longmaster
 * Brief: 青海电信EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服 （北京测试服）
 * 3、表示内网测试服
 * 4、VPN走正式服 (在公司访问正式服)
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_ENTRY_ADDR', "http://123.59.206.200:10027");  //现网 - cws服务器访问地址
        define('SERVER_URL', "http://123.59.206.200:10026/cws/index.php?");  //现网 - cws服务器访问地址
        //define('RESOURCES_URL', "http://123.59.206.200:10013"); //现网 - 文件服务器访问地址
        define('RESOURCES_URL', "http://10.215.129.9:10002"); //现网 - 文件服务器访问地址
        define('CWS_HLWYY_URL', "http://123.59.206.200:10026/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://123.59.206.200:10026/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://123.59.206.200:10026/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://123.59.206.200:10026/cws/39hospital/index.php");//大专家头像外网地址
        define('ORDER_CALL_BACK_URL', "http://123.59.206.200:10026/cws/pay/sichuangd/callback/index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://123.59.206.200:10026/cws/pay/order/order.php"); // 现网 - 上报订购信息
        // *************** 提供给第三方接口使用cws/other接口 [START] ***************//
        define('CWS_URL_WX_SERVER', "http://123.59.206.200:10002/cws/wxserver"); //wxserver微信小程序模块cws
        define('CWS_URL_WX_SERVER_ENTRY', "http://123.59.206.200:10002/cws/wxserver/index.php?"); //wxserver微信小程序模块cws入口地址
        define("CWS_URL_COMMON_CLOUD_PUSH", "http://123.59.206.200:10002/cws/api/cloud/push.php"); //通用接口：存储数据到云端
        define("CWS_URL_COMMON_CLOUD_PULL", "http://123.59.206.200:10002/cws/api/cloud/pull.php"); //通用接口：从云端拉取数据
        define("CWS_URL_COMMON_CLOUD_DELETE", "http://123.59.206.200:10002/cws/api/cloud/delete.php"); //通用接口：删除云端数据
        define("CWS_URL_3RD_MEASURE_QUERY", "http://123.59.206.200:10002/cws/api/measure/query.php"); //提供第三方"健康检测"接口：获取健康检测未归档原始数据
        define("CWS_URL_3RD_MEASURE_DELETE", "http://123.59.206.200:10002/cws/api/measure/delete.php"); //提供第三方"健康检测"接口：删除检测数据
        define("CWS_URL_3RD_INQUIRY_TIMES", "http://123.59.206.200:10002/cws/api/inquiry/query_times.php"); //提供第三方"问诊"接口：查询问诊次数

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        // *************** 提供给第三方接口使用cws/other接口 [END] ***************//
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 2:
        // 现网进入3983
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?");
        define('RESOURCES_URL', "http://222.85.144.70:8091");
        define('CWS_HLWYY_URL', "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php");//大专家头像外网地址
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/sichuangd/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/pay/order/order.php");
        // *************** 提供给第三方接口使用cws/other接口 [START] ***************//
        define('CWS_URL_WX_SERVER', "http://test-healthiptv.langma.cn:8100/cws/wxserver"); //wxserver微信小程序模块cws
        define('CWS_URL_WX_SERVER_ENTRY', "http://test-healthiptv.langma.cn:8100/cws/wxserver/index.php?"); //wxserver微信小程序模块cws入口地址
        define("CWS_URL_COMMON_CLOUD_PUSH", "http://test-healthiptv.langma.cn:8100/cws/api/cloud/push.php"); //通用接口：存储数据到云端
        define("CWS_URL_COMMON_CLOUD_PULL", "http://test-healthiptv.langma.cn:8100/cws/api/cloud/pull.php"); //通用接口：从云端拉取数据
        define("CWS_URL_COMMON_CLOUD_DELETE", "http://test-healthiptv.langma.cn:8100/cws/api/cloud/delete.php"); //通用接口：删除云端数据
        define("CWS_URL_3RD_MEASURE_QUERY", "http://test-healthiptv.langma.cn:8100/cws/api/measure/query.php"); //提供第三方"健康检测"接口：获取健康检测未归档原始数据
        define("CWS_URL_3RD_MEASURE_DELETE", "http://test-healthiptv.langma.cn:8100/cws/api/measure/delete.php"); //提供第三方"健康检测"接口：删除检测数据
        define("CWS_URL_3RD_INQUIRY_TIMES", "http://test-healthiptv.langma.cn:8100/cws/api/inquiry/query_times.php"); //提供第三方"问诊"接口：查询问诊次数

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        // *************** 提供给第三方接口使用cws/other接口 [END] ***************//
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
    case 3:
        // 本地内网测试服
        define('SERVER_ENTRY_ADDR', "http://10.254.30.100:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://test-healthiptv-fs.langma.cn:8091/");
        define('CWS_HLWYY_URL', "http://10.254.30.100:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_HLWYY_URL_OUT", "http://10.254.30.100:8100/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
        define("CWS_EXPERT_URL", "http://10.254.30.100:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://10.254.30.100:8100/cws/39hospital/index.php");//大专家头像外网地址
        define('ORDER_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/sichuangd/callback/index.php");
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/pay/order/order.php");
        // *************** 提供给第三方接口使用cws/other接口 [START] ***************//
        define('CWS_URL_WX_SERVER', "http://test-healthiptv.langma.cn:8100/cws/wxserver"); //wxserver微信小程序模块cws
        define('CWS_URL_WX_SERVER_ENTRY', "http://test-healthiptv.langma.cn:8100/cws/wxserver/index.php?"); //wxserver微信小程序模块cws入口地址
        define("CWS_URL_COMMON_CLOUD_PUSH", "http://test-healthiptv.langma.cn:8100/cws/api/cloud/push.php"); //通用接口：存储数据到云端
        define("CWS_URL_COMMON_CLOUD_PULL", "http://test-healthiptv.langma.cn:8100/cws/api/cloud/pull.php"); //通用接口：从云端拉取数据
        define("CWS_URL_COMMON_CLOUD_DELETE", "http://test-healthiptv.langma.cn:8100/cws/api/cloud/delete.php"); //通用接口：删除云端数据
        define("CWS_URL_3RD_MEASURE_QUERY", "http://test-healthiptv.langma.cn:8100/cws/api/measure/query.php"); //提供第三方"健康检测"接口：获取健康检测未归档原始数据
        define("CWS_URL_3RD_MEASURE_DELETE", "http://test-healthiptv.langma.cn:8100/cws/api/measure/delete.php"); //提供第三方"健康检测"接口：删除检测数据
        define("CWS_URL_3RD_INQUIRY_TIMES", "http://test-healthiptv.langma.cn:8100/cws/api/inquiry/query_times.php"); //提供第三方"问诊"接口：查询问诊次数

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        // *************** 提供给第三方接口使用cws/other接口 [END] ***************//
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
//    case 4:
//        // VPN 走正式服
//        define('SERVER_ENTRY_ADDR', "http://223.221.36.146:10000"); // 提供给APK插件使用
//        define('SERVER_URL', "http://223.221.36.146:10000/cws/index.php?");  //现网 - cws服务器访问地址
//        define('RESOURCES_URL', "http://223.221.36.146:10002/fs"); //现网 - 文件服务器访问地址
//        define('CWS_HLWYY_URL', "http://223.221.36.146:10000/cws/hlwyy/index.php"); // cws-hlwyy模块
//        define("CWS_HLWYY_URL_OUT", "http://223.221.36.146:10000/cws/hlwyy/index.php"); // cws-hlwyy模块 外网地址
//        define("CWS_EXPERT_URL", "http://223.221.36.146:10000/cws/39hospital/index.php");
//        define("CWS_EXPERT_URL_OUT", "http://223.221.36.146:10000/cws/39hospital/index.php");//大专家头像外网地址
//        define('ORDER_CALL_BACK_URL', "http://223.221.36.146:10000/cws/pay/sichuangd/callback/index.php");  //现网 - 订购通知回调地址
//        define('REPORT_ORDER_INFO_URL', "http://223.221.36.146:10000/cws/pay/order/order.php"); // 现网 - 上报订购信息
//        // *************** 提供给第三方接口使用cws/other接口 [START] ***************//
//        define('CWS_URL_WX_SERVER', "http://223.221.36.146:10000/cws/wxserver"); //wxserver微信小程序模块cws
//        define('CWS_URL_WX_SERVER_ENTRY', "http://223.221.36.146:10000/cws/wxserver/index.php?"); //wxserver微信小程序模块cws入口地址
//        define("CWS_URL_COMMON_CLOUD_PUSH", "http://223.221.36.146:10000/cws/api/cloud/push.php"); //通用接口：存储数据到云端
//        define("CWS_URL_COMMON_CLOUD_PULL", "http://223.221.36.146:10000/cws/api/cloud/pull.php"); //通用接口：从云端拉取数据
//        define("CWS_URL_COMMON_CLOUD_DELETE", "http://223.221.36.146:10000/cws/api/cloud/delete.php"); //通用接口：删除云端数据
//        define("CWS_URL_3RD_MEASURE_QUERY", "http://223.221.36.146:10000/cws/api/measure/query.php"); //提供第三方"健康检测"接口：获取健康检测未归档原始数据
//        define("CWS_URL_3RD_MEASURE_DELETE", "http://223.221.36.146:10000/cws/api/measure/delete.php"); //提供第三方"健康检测"接口：删除检测数据
//        define("CWS_URL_3RD_INQUIRY_TIMES", "http://223.221.36.146:10000/cws/api/inquiry/query_times.php"); //提供第三方"问诊"接口：查询问诊次数
//        // *************** 提供给第三方接口使用cws/other接口 [END] ***************//
//        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
//        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
//        break;
}
