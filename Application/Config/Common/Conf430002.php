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

// 是否日志缓存redis（1--缓存，0不缓存）
define('IS_REDIS_CACHE_LOG', 1);

// 是否要缓存页面配置信息（1--缓存，0不缓存）
define('IS_REDIS_CACHE_DATA', 1);

// 是否缓存session内容到redis （1--缓存，0不缓存）define('IS_REDIS_CACHE_DATA', 1);
define('IS_REDIS_CACHE_SESSION', 1);

// 湖南电信各地市的区号
define("HUNANDX_AREACODE_MAP", "return Array(
    /** 地市拼音简称 地市编码 地市名称 */
    'CS' => '0731',  // 长沙
    'ZZ' => '07312', // 株洲
    'HY' => '0734', // 	衡阳
    'HH' => '0745', // 	怀化
    'YZ' => '0746', // 	永州
    'ZJ' => '0744', // 	张家界
    'XT' => '07311', // 湘潭
    'IY' => '0737', // 	益阳
    'YY' => '0730',  // 岳阳
    'LD' => '0738', // 	娄底
    'CZ' => '0735', // 	郴州	
    'CD' => '0736', // 	常德
    'JS' => '0743', // 	吉首
    'SY' => '0739', // 	邵阳
);");

