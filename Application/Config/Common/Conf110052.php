<?php

define('CUSTOM_CLIENT_VERSION', '0.1.1');

// 调试模式，发布时一定要修改为0，不调试。 1、调试模式。
define('DEBUG', 0);

//运行环境  - 1: 在Android浏览器上运行， 0: 在EPG浏览器上运行
define("IS_RUN_ON_ANDROID", 1);

// SESSION 24小时有效
define('SESSION_EXPIRE_TIME', 24 * 60 * 60);

// COOKIE 24小时有效
define('COOKIE_EXPIRE_TIME', 24 * 60 * 60);

// 是否上报日志到服务器（1--上报，0不上报）
define('IS_USE_REPORT_LOG', 0);

// 欢迎页的逻辑是否需要自身特殊处理，需要定义该常量，不需要就不用定义
define("HANDLE_SPLASH_SELF", 1);

// 各省份 -- 陕西和山西的拼音一直，陕西用shaanxi
define("AREA_CODE_TABLE", "return Array(
    'INNER_MONGOLIA' => '208', // 内蒙古
    'BEIJING' => '205', // 北京
    'TIANJIN' => '201', // 天津
    'SHANDONG' => '216', // 山东
    'HEBEI' => '206', // 河北
    'SHANXI' => '207', // 山西
    'ANHUI' => '213', // 安徽
    'SHANGHAI' => '232', // 上海
    'JIANGSU' => '212', // 江苏
    'ZHEJIANG' => '202', // 浙江
    'FUJIAN' => '214', // 福建
    'HAINAN' => '220', // 海南
    'GUANGDONG' => '218', // 广东
    'GX' => '219', // 广西
    'QINGHAI' => '228', // 青海
    'HUBEI' => '217', // 湖北
    'HUNAN' => '231', // 湖南
    'JIANGXI' => '215', // 江西
    'HENAN' => '204', // 河南
    'XIZANG' => '225', // 西藏
    'SICHUAN' => '222', // 四川
    'CHONGQING' => '221', // 重庆
    'SHAANXI' => '226', // 陕西
    'GUIZHOU' => '223', // 贵州
    'YUNNAN' => '224', // 云南
    'GANSU' => '227', // 甘肃
    'NX' => '229', // 宁夏
    'XINJIANG' => '230', // 新疆	
    'JILIN' => '210', // 吉林
    'LIAONING' => '209', // 辽宁
    'HEILONGJIANG' => '211', // 黑龙江
);");