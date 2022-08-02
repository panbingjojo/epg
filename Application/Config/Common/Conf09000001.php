<?php
define('CUSTOM_CLIENT_VERSION', '2.0.0');
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

// 是否日志缓存redis（1--缓存，0不缓存）
define('IS_REDIS_CACHE_LOG', 1);

// 是否要缓存页面配置信息（1--缓存，0不缓存）
define('IS_REDIS_CACHE_DATA', 1);

// 是否缓存session内容到redis （1--缓存，0不缓存）define('IS_REDIS_CACHE_DATA', 1);
define('IS_REDIS_CACHE_SESSION', 1);

// 系统在维护升级中 1--表示在维护升级状态， 0--表示处于正常工作状态
define('SYSTEM_IS_UPDATE', 0);

// 欢迎页的逻辑是否需要自身特殊处理，需要定义该常量，不需要就不用定义
define("HANDLE_SPLASH_SELF", 1);

// 未来电视统一版本各省份的区号
define("NEWTV_UNIFIED_AREACODE_MAP", "return Array(
    /** 省分公司编码(New) 省分地区 */
    '208' => '内蒙古',  
    '205' => '北京',
    '201' => '天津',
    '216' => '山东',
    '206' => '河北',
    '207' => '山西',
    '213' => '安徽',
    '232' => '上海', 
    '212' => '江苏', 
    '202' => '浙江',
    '214' => '福建',  
    '220' => '海南',  
    '218' => '广东',  
    '219' => '广西',  
    '228' => '青海',  
    '217' => '湖北',  
    '231' => '湖南',  
    '215' => '江西',  
    '204' => '河南',  
    '225' => '西藏',  
    '222' => '四川',  
    '221' => '重庆',  
    '226' => '陕西',  
    '223' => '贵州',  
    '224' => '云南',  
    '227' => '甘肃',  
    '229' => '宁夏',  
    '230' => '新疆',   
    '210' => '吉林',  
    '209' => '辽宁',  
    '211' => '黑龙江', 
);");