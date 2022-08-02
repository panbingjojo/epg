<?php

/**
 * USE_SERVER:
 * 1、 现网-走内网IP（用户环境）
 * 2、 现网-走域名
 * 3、 本地内网测试服
 */
define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1: // 现网-走内网IP（用户环境）
        define('SERVER_HOST_ADDRESS', "http://10.20.10.3");                                     // cws服务器主机地址 -- 协议+IP底子好
        define('SERVER_HOST',SERVER_HOST_ADDRESS . ":10027");                                   // cws服务器主机地址
        define('PUBLIC_SERVER_HOST', "http://healthiptv.langma.cn");                            // cws服务器主机地址 -- 外网地址
        define('RESOURCES_URL', "http://gylm39jk-nx-fs.a106.ottcn.com:10013");                                 // 文件服务器访问地址
        //define('RESOURCES_URL', "http://healthiptv-fs.langma.cn");                              // 文件服务器访问地址

        // 问诊模块
        define('SERVER_GUAHAO', "http://healthiptv-guahao.langma.cn/");                         // 预约挂号服务器（显示首页医院图片）
        define('SERVER_CONTROL_UNIT',SERVER_HOST_ADDRESS . ":10026");                           // 落地电话控制中心地

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');
		define('APP_ROOT_PATH', "http://gylm39jk-nx.a106.ottcn.com:10002/epg-lws-for-apk-640001");           // 应用入口地址,只有提供给外部链接才使用
        break;
    case 2: // 现网-走域名（3983-测试亦用此）
        define('SERVER_HOST', "http://healthiptv.langma.cn");                                   // cws服务器主机地址
        define('PUBLIC_SERVER_HOST', "http://healthiptv.langma.cn");                            // cws服务器主机地址 -- 外网地址
        define('RESOURCES_URL', "http://healthiptv-fs.langma.cn");                              // 文件服务器访问地址
        // 问诊模块
        define('SERVER_GUAHAO', "http://healthiptv-guahao.langma.cn/");                         // 预约挂号服务器（显示首页医院图片）
        define('SERVER_CONTROL_UNIT', "http://healthiptv.langma.cn:10026");                     // 落地电话控制中心地址

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        break;
    case 3: // 本地内网测试服
        define('SERVER_HOST_ADDRESS', "http://test-healthiptv.langma.cn");                      // cws服务器主机地址
        define('SERVER_HOST', SERVER_HOST_ADDRESS . ":8100");                                   // cws服务器主机地址
        define('PUBLIC_SERVER_HOST', SERVER_HOST_ADDRESS . ":8100");                            // cws服务器主机地址 -- 外网地址
        define('RESOURCES_URL', SERVER_HOST_ADDRESS . ":8091");                                 // 文件服务器访问地址

        // 问诊模块
        define('SERVER_GUAHAO', "http://test-healthiptv-guahao.langma.cn:8090/");               // 预约挂号服务器（显示首页医院图片）
        define('SERVER_CONTROL_UNIT', "http://222.85.144.70:40000");                            //落地电话控制中心地址

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');
        break;
}

/*************************  cws服务器模块 ************************/
define('SERVER_URL', SERVER_HOST . "/cws/index.php?");                                  // cws服务器访问地址
define('REPORT_ORDER_INFO_URL', SERVER_HOST . "/cws/pay/order/order.php");              // 订购上报地址
define('CWS_39NET_URL', SERVER_HOST . "/cws/39net/index.php");                          // cws-39net模块
define('QUERY_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query.php");
define('QUERY_CHECK_REPORT_USER_INFO_URL', SERVER_HOST . "/cws/report/query_check.php");

/*************************  问诊模块 ************************/
define('SERVER_GUAHAO_CWS', SERVER_HOST . "/cws/guahao/index.php?");                    // cws挂号代理服务器
define('SERVER_GUAHAO_CWS_FS', SERVER_HOST . "/cws/guahao/");                           // cws挂号代理服务器图片地址
define("CWS_EXPERT_URL", SERVER_HOST . "/cws/39hospital/index.php");                    // 大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_HLWYY_URL", SERVER_HOST . "/cws/hlwyy/index.php");                          // 互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
define("CWS_EXPERT_URL_OUT", PUBLIC_SERVER_HOST . "/cws/39hospital/index.php");         // 大专家外网地址（用于前端拉取数据）
define("CWS_HLWYY_URL_OUT", PUBLIC_SERVER_HOST . "/cws/hlwyy/index.php");               // 互联网医院外网地址（用于前端拉取数据）
define('CWS_WXSERVER_URL', PUBLIC_SERVER_HOST . "/cws/wxserver");                       // cws-微信模块

/*************************  Redis模块 ************************/
define('REDIS_LOCAL_IP', "127.0.0.1");                                                  // redis本地服务器ip
define('REDIS_LOCAL_PORT', "6379");                                                     // redis本地服务器端口

//设备平台
define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
