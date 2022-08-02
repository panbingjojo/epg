<?php

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示现网（测试服）
 * 3、公司访问现网数据
 * 3、测试服30.100
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:  // 现网（用户环境）
        define('SERVER_HOST', "http://10.0.4.170:39001/apk");                                       // cws服务器主机地址

        // 问诊模块
        define('SERVER_GUAHAO', "http://healthiptv-guahao.langma.cn/");                             // 预约挂号服务器（显示首页医院图片）
        $parsed_url = parse_url($_SERVER['HTTP_HOST']);
        if($parsed_url['host'] == '10.0.4.170'){
            define('RESOURCES_URL', "http://10.0.4.170:39002/fs");                                      // 文件服务器访问地址
            define('APP_ROOT_PATH', "http://10.0.4.170:39001/apk/epg-apk-for-lws-450004");
        }else {
            define('RESOURCES_URL', "http://219.232.89.73:39002/fs");                                      // 文件服务器访问地址
            define('APP_ROOT_PATH', "http://219.232.89.73:39001/apk/epg-apk-for-lws-450004");
        }
        // 落地电话控制中心地址
        define('SERVER_CONTROL_UNIT', "http://123.59.206.196:10026");
        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');
        break;
    case 2:  // 现网（测试服）
        define('SERVER_HOST', "http://219.232.89.73:39001/apk-cesi");                               // cws服务器主机地址
        define('RESOURCES_URL', "http://219.232.89.73:39002/fs");                                   // 文件服务器访问地址

        // 问诊模块
        define('SERVER_GUAHAO', "http://healthiptv-guahao.langma.cn/");                             // 预约挂号服务器（显示首页医院图片）
        break;
    case 3: // 公司访问现网环境
        // cws服务器模块
        define('SERVER_HOST', "http://219.232.89.73:39001/apk");                                    // cws服务器主机地址
        define('RESOURCES_URL', "http://219.232.89.73:39002/fs");                                   // 文件服务器访问地址

        // 问诊模块
        define('SERVER_GUAHAO', "http://healthiptv-guahao.langma.cn/");                             // 预约挂号服务器（显示首页医院图片）
        break;
    case 4: // 本地内网测试服
        // cws服务器模块
        define('SERVER_HOST', "http://222.85.144.70:8100");                             // cws服务器主机地址
        define('RESOURCES_URL', "http://222.85.144.70:8091");                           // 文件服务器访问地址

        // 落地电话控制中心地址
        define('SERVER_CONTROL_UNIT', "http://123.59.206.196:10026");
        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        // 问诊模块
        define('SERVER_GUAHAO', "http://222.85.144.70:8090/");                   // 预约挂号服务器（显示首页医院图片）
        break;
}

/*************************  cws服务器模块 ************************/
// 服务器站点地址
define('SERVER_URL', SERVER_HOST . "/cws/index.php?");
// 上报用户信息
define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/report/index.php");
// cws-39net模块
define('CWS_39NET_URL', SERVER_HOST .  "/cws/39net/index.php");

/*************************  问诊模块 ************************/
// cws挂号代理服务器
define('SERVER_GUAHAO_CWS', SERVER_HOST . "/cws/index.php?");
// cws挂号代理服务器图片地址
define('SERVER_GUAHAO_CWS_FS', SERVER_HOST . "/cws/guahao/");
// 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_EXPERT_URL", SERVER_HOST .  "/cws/39hospital/index.php");
// 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_HLWYY_URL", SERVER_HOST .  "/cws/hlwyy/index.php");
// 大专家外网地址（用于前端拉取数据）
define("CWS_EXPERT_URL_OUT", SERVER_HOST . "/cws/39hospital/index.php");
// 互联网医院外网地址（用于前端拉取数据）
define("CWS_HLWYY_URL_OUT", SERVER_HOST . "/cws/hlwyy/index.php");
// cws-微信模块
define('CWS_WXSERVER_URL', SERVER_HOST . "/cws/wxserver");

/*************************  Redis模块 ************************/
// redis本地服务器ip
 define('REDIS_LOCAL_IP', "127.0.0.1");
// redis本地服务器端口
define('REDIS_LOCAL_PORT', "6379");

//设备平台
define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

