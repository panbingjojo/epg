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

