<?php
/**
 * Created by longmaster
 * Brief: 安徽电信EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示3983测试服
 * 3、表示内网测试服
 */
define("USE_SERVER", 3);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_ENTRY_ADDR', "http://117.71.39.117:10021"); // 提供给APK插件使用
        define('SERVER_URL', "http://172.17.30.130:10021/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://117.71.39.117:10002/fs"); //现网 - 文件服务器访问地址
        define('CWS_HLWYY_URL', "http://172.17.30.130:10021/cws/hlwyy/index.php"); // cws-hlwyy模块
        define('CWS_HLWYY_URL_OUT', "http://117.71.39.117:10021/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_EXPERT_URL", "http://172.17.30.130:10021/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://117.71.39.117:10021/cws/39hospital/index.php"); // 大专家头像外网地址
        define('ORDER_CALL_BACK_URL', "http://172.17.30.130:10021/cws/pay/itv/callback/web_index.php");  //现网 - 订购通知回调地址
        define('REPORT_ORDER_INFO_URL', "http://172.17.30.130:10021/cws/report/index.php"); // 现网 - 上报订购信息
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        define('QUERY_EPG_USER_TELEPHONE_URL', "http://117.71.39.105:8081/outPlatClient/queryByItv");
        define("EPG_UNIQUE_CODE", "20a7e56fcf0b90b7642381f746307334"); // 下游平台唯一码（用户信息中心分配）
        define("EPG_SIGN_KEY", "com.ahcenter.signkey"); // 双方约定sign的key
        define("KEY_AES", "8259632103695621"); // 双方约定加密的key
        define("ENCRYPT_IV", "1269571569321021"); // 加密向量

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 2:
        // 现网进入3983
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://222.85.144.70:8091");
        define('CWS_HLWYY_URL', "http://10.254.30.100:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define('CWS_HLWYY_URL_OUT', "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_EXPERT_URL", "http://10.254.30.100:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php");//大专家头像外网地址
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/itv/callback/web_index.php");
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        define('QUERY_EPG_USER_TELEPHONE_URL', "http://117.71.39.105:8081/outPlatClient/queryByItv");
        define("EPG_UNIQUE_CODE", "20a7e56fcf0b90b7642381f746307334"); // 下游平台唯一码（用户信息中心分配）
        define("EPG_SIGN_KEY", "com.ahcenter.signkey"); // 双方约定sign的key
        define("KEY_AES", "8259632103695621"); // 双方约定加密的key
        define("ENCRYPT_IV", "1269571569321021"); // 加密向量

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 3:
        // 本地内网测试服
        define('SERVER_ENTRY_ADDR', "http://10.254.30.100:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://10.254.30.100:8100/cws/index.php?");
        define('RESOURCES_URL', "http://10.254.30.100:8091");
        define('CWS_HLWYY_URL', "http://10.254.30.100:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define('CWS_HLWYY_URL_OUT', "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_EXPERT_URL", "http://10.254.30.100:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php"); // 大专家头像外网地址
        define('ORDER_CALL_BACK_URL', "http://10.254.30.100:8100/cws/pay/itv/callback/web_index.php");
        define('REPORT_ORDER_INFO_URL', "http://10.254.30.100:8100/cws/report/index.php");
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        define('QUERY_EPG_USER_TELEPHONE_URL', "http://117.71.39.105:8081/outPlatClient/queryByItv");
        define("EPG_UNIQUE_CODE", "20a7e56fcf0b90b7642381f746307334"); // 下游平台唯一码（用户信息中心分配）
        define("EPG_SIGN_KEY", "com.ahcenter.signkey"); // 双方约定sign的key
        define("KEY_AES", "8259632103695621"); // 双方约定加密的key
        define("ENCRYPT_IV", "1269571569321021"); // 加密向量

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
    case 4:
        // 本地外网测试服
        define('SERVER_ENTRY_ADDR', "http://222.85.144.70:8100"); // 提供给APK插件使用
        define('SERVER_URL', "http://222.85.144.70:8100/cws/index.php?");
        define('RESOURCES_URL', "http://222.85.144.70:8091");
        define('CWS_HLWYY_URL', "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define('CWS_HLWYY_URL_OUT', "http://222.85.144.70:8100/cws/hlwyy/index.php"); // cws-hlwyy模块
        define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php"); // 大专家头像外网地址
        define('ORDER_CALL_BACK_URL', "http://222.85.144.70:8100/cws/pay/itv/callback/web_index.php");
        define('REPORT_ORDER_INFO_URL', "http://222.85.144.70:8100/cws/report/index.php");
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        define('QUERY_EPG_USER_TELEPHONE_URL', "http://117.71.39.105:8081/outPlatClient/queryByItv");
        define("EPG_UNIQUE_CODE", "20a7e56fcf0b90b7642381f746307334"); // 下游平台唯一码（用户信息中心分配）
        define("EPG_SIGN_KEY", "com.ahcenter.signkey"); // 双方约定sign的key
        define("KEY_AES", "8259632103695621"); // 双方约定加密的key
        define("ENCRYPT_IV", "1269571569321021"); // 加密向量

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        break;
}
