<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午6:13
 */


// 调试模式，发布时一定要修改为0，不调试。 1、调试模式。
define('DEBUG', 0);

//运行环境  - 1: 在Android浏览器上运行， 0: 在EPG浏览器上运行
define("IS_RUN_ON_ANDROID", 0);

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

// 系统在维护升级中 1--表示在维护升级状态， 0--表示处于正常工作状态
define('SYSTEM_IS_UPDATE', 0);

// 欢迎页的逻辑是否需要自身特殊处理，需要定义该常量，不需要就不用定义
// define("HANDLE_SPLASH_SELF", 1);

//epg大厅
define('IPTV_PORTAL_URL', "main://index.html");

// 广东广电各地市的区号
define("GUANGDONGGD_AREACODE_MAP", "return Array(
    /** 地市拼音简称 地市编码 地市名称 */
    'GZ' => '4401', // 广州市
    'FS' => '4406', // 佛山市
    'SW' => '4415', // 汕尾市
    'MM' => '4409', // 茂名市
    'HY' => '4416', // 河源市
    'SG' => '4402', // 韶关市
    'CZ' => '4451', // 潮州市
    'DG' => '4419', // 东莞市
    'YF' => '4453', // 云浮市
    'ZH' => '4404', // 珠海市
    'HZ' => '4413', // 惠州市
    'ZS' => '4420', // 中山市
    'JY' => '4452', // 揭阳市
    'ZJ' => '4408', // 湛江市
    'ST' => '4405', // 汕头市
    'JM' => '4407', // 江门市
    'MZ' => '4414', // 梅州市
    'QY' => '4418', // 清远市
    'ZQ' => '4412', // 肇庆市
    'SZ' => '4403', // 深圳市
    'YJ' => '4417', // 阳江市
);");