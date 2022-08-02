<?php
/**
 * Created by longmaster
 * Brief: 河南电信EPG
 */

// 插件配置
include_once('./Application/Config/Plugin/Conf410092.php');

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
define("HANDLE_SPLASH_SELF", 1);

// 问诊插件打印日志目录
define("INQUIRY_LOG_PATH", '/data/logs/inquiry/' . CARRIER_ID . '/');