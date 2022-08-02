<?php
/**
 * Created by longmaster.
 * Date: 2018-09-03
 * Time: 10:02
 * Brief: 此文件（或类）用于记录配置信息
 */

// 调试模式，发布时一定要修改为0，不调试。 1、调试模式。
define('DEBUG', 1);

//运行环境  - 1: 在Android浏览器上运行， 0: 在EPG浏览器上运行
define("IS_RUN_ON_ANDROID", 0);

// SESSION 24小时有效
define('SESSION_EXPIRE_TIME', 24 * 60 * 60);

// COOKIE 24小时有效
define('COOKIE_EXPIRE_TIME', 24 * 60 * 60);

// 是否日志缓存redis（1--缓存，0不缓存）
define('IS_REDIS_CACHE_LOG', 0);

// 是否要缓存页面配置信息（1--缓存，0不缓存）
define('IS_REDIS_CACHE_DATA', 0);

// 是否缓存session内容到redis （1--缓存，0不缓存）define('IS_REDIS_CACHE_DATA', 1);
define('IS_REDIS_CACHE_SESSION', 0);

// 系统在维护升级中 1--表示在维护升级状态， 0--表示处于正常工作状态
define('SYSTEM_IS_UPDATE', 0);

// 甘肃电信各地市的区号
define("GANSUDX_AREACODE_MAP", "return Array(
    /** 地市拼音简称 地市编码 地市名称 */
    'lz' => '0931', // 兰州
    'jyg' => '0937', // 嘉峪关
    'jc' => '0935', // 金昌
    'by' => '0943', // 白银
    'ts' => '0938', // 天水
    'ww' => '0935', // 武威
    'zy' => '0936', // 张掖
    'pl' => '0933', // 平凉
    'jq' => '0937', // 酒泉
    'qy' => '0934', // 庆阳
    'dx' => '0932', // 定西
    'ln' => '0939', // 陇南
    'lx' => '0930', // 临夏
    'gl' => '0941', // 甘南
);");