<?php
/**
 * Created by longmaster
 * Brief: 贵州广电WEB-EPG
 */

/**
 * USE_SERVER:
 * 1、表示现网
 * 2、表示公司访问现网数据
 * 3、表示内网测试服
 */

define("USE_SERVER", 1);    //发布上线确保该值为1

switch (USE_SERVER) {
    case 1:
        // 现网（用户环境）
        define('SERVER_URL', "http://10.69.46.209:10000/cws/index.php?");  //现网 - cws服务器访问地址
        define('ENTER_IP', "http://10.69.46.209:10001");  //现网 - cws服务器访问地址
//        define('RESOURCES_URL', "http://10.69.46.209:10002/fs"); //现网 - 文件服务器访问地址
        if($_SERVER['HTTP_HOST'] == '10.69.46.209:10001'){
            define('RESOURCES_URL', "http://10.69.46.209:10002/fs"); //现网 - 文件服务器访问地址
        }else{
            define('RESOURCES_URL', "http://10.254.56.100:61006/fs"); //现网 - 文件服务器访问地址--- 从公司访问
        }
        define('GUA_HAO_URL', "http://123.59.206.200:10014/"); // 预约挂号的服务器  修改为走北京移动代理113.31.133.131
        define('REPORT_ORDER_INFO_URL', "http://10.69.46.209:10000/cws/report/index.php"); // 现网 - 上报用户信息
        define('QUERY_REPORT_USER_INFO_URL', "http://10.69.46.209:10000/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.69.46.209:10000/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.69.46.209:10000/cws/report/query_report.php");

        // 问诊模块
        define("CWS_EXPERT_URL", "http://10.69.46.209:10000/cws/39hospital/index.php");         //大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL", "http://10.69.46.209:10000/cws/hlwyy/index.php");                //互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", "http://10.69.46.209:10000/cws/39hospital/index.php");    //大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://10.69.46.209:10000/cws/hlwyy/index.php");           //互联网医院外网地址（用于前端拉取数据）
        define('SERVER_GUAHAO', "http://10.69.46.209:10006/"); // 预约挂号服务器（显示首页医院图片）
        define('SERVER_GUAHAO_CWS', "http://10.69.46.209:10000/cws/guahao/index.php?"); // cws挂号代理服务器
        define('SERVER_GUAHAO_CWS_FS', "http://10.69.46.209:10000/cws/guahao/"); // cws挂号代理服务器图片地址

        // 39健康网
        define('CWS_39NET_URL', "http://10.69.46.209:10000/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
        define('REDIS_LOCAL_IP', "127.0.0.1"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;

    case 2:
        // 表示公司访问现网数据
        define('SERVER_URL', "http://10.254.56.100:61003/cws/index.php?");  //现网 - cws服务器访问地址
        define('RESOURCES_URL', "http://10.254.56.100:61006/fs"); //现网 - 文件服务器访问地址
        define('REPORT_ORDER_INFO_URL', "http://10.254.56.100:61003/cws/report/index.php"); // 现网 - 上报用户信息
        define('QUERY_REPORT_USER_INFO_URL', "http://10.254.56.100:61003/cws/report/query.php");
        define('QUERY_CHECK_REPORT_USER_INFO_URL', "http://10.254.56.100:61003/cws/report/query_check.php");
        define('REPORT_ORDER_STATUS_URL', "http://10.254.56.100:61003/cws/report/query_report.php");

        // 问诊模块
        define("CWS_EXPERT_URL", "http://healthiptv.langma.cn/cws/39hospital/index.php");         //大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL", "http://healthiptv.langma.cn/cws/hlwyy/index.php");                //互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", "http://healthiptv.langma.cn/cws/39hospital/index.php");    //大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://healthiptv.langma.cn/cws/hlwyy/index.php");           //互联网医院外网地址（用于前端拉取数据）
        define('SERVER_GUAHAO', "http://healthiptv-guahao.langma.cn/"); // 预约挂号服务器（显示首页医院图片）
        define('SERVER_GUAHAO_CWS', "http://healthiptv.langma.cn/cws/guahao/index.php?"); // cws挂号代理服务器
        define('SERVER_GUAHAO_CWS_FS', "http://healthiptv.langma.cn/cws/guahao/"); // cws挂号代理服务器图片地址

        // 39健康网
        define('CWS_39NET_URL', "http://10.69.46.209:10000/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');
        // Redis配置
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
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

        // 问诊相关
        define('SERVER_GUAHAO', "http://test-healthiptv-guahao.langma.cn:8090/"); // 预约挂号服务器（显示首页医院图片）
        define('SERVER_GUAHAO_CWS', SERVER_HOST ."/cws/guahao/index.php?"); // cws挂号代理服务器
        define('SERVER_GUAHAO_CWS_FS', SERVER_HOST ."/cws/guahao/"); // cws挂号代理服务器图片地址
//        define('SERVER_GUAHAO_CWS', "http://10.254.58.153/guahao/index.php?"); // cws挂号代理服务器
//        define('SERVER_GUAHAO_CWS_FS', "http://10.254.58.153/guahao/"); // cws挂号代理服务器图片地址
        define("CWS_EXPERT_URL", "http://222.85.144.70:8100/cws/39hospital/index.php");         //大专家内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_HLWYY_URL", "http://222.85.144.70:8100/cws/hlwyy/index.php");                //互联网医院内网地址（测试服的内网实际使用外网地址）（用于php后台拉取数据）
        define("CWS_EXPERT_URL_OUT", "http://222.85.144.70:8100/cws/39hospital/index.php");    //大专家外网地址（用于前端拉取数据）
        define("CWS_HLWYY_URL_OUT", "http://222.85.144.70:8100/cws/hlwyy/index.php");           //互联网医院外网地址（用于前端拉取数据）

        // 39健康网
        define('CWS_39NET_URL', "http://222.85.144.70:8100/cws/39net/index.php"); // cws-39net模块

        // 图文问诊地址
        define('TELETEXT_INQUIRY_URL', 'http://test-m.guijk.com/askdoctor/detail/');

        //设备平台
        define('HEALTH_DEVICE', 'https://healthiptv.langma.cn:10044');

        // Redis配置
//        define('REDIS_LOCAL_IP', "10.254.30.100"); //redis本地服务器ip
        define('REDIS_LOCAL_PORT', "6379"); // redis本地服务器端口
        break;
}
