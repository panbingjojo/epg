<?php
/**
 * Created by longmaster.
 * Date: 2018-09-03
 * Time: 10:02
 * Brief: 此文件（或类）用于记录配置信息
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

// 湖北电信各地市的区号
define("HUBEIDX_AREACODE_MAP", "return Array(
    /** 地市拼音简称 地市编码 地市名称 */
    'wh' => '027', // 武汉
    'xg' => '0712', // 孝感
    'xn' => '0715', // 咸宁
    'jz' => '0716', // 荆州
    'jm' => '0724', // 荆门
    'hg' => '0713', // 黄冈
    'hs' => '0714', // 黄石
    'ez' => '0711', // 鄂州
    'sy' => '0719', // 十堰
    'es' => '0718', // 恩施
    'yc' => '0717', // 宜昌
    'sz' => '0722', // 随州
    'xf' => '0710', // 襄樊（襄阳）
    'tm' => '07281', // 天门
    'qj' => '07282', // 潜江
    'xt' => '07283', // 仙桃
);");