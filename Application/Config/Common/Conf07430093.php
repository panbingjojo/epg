<?php

// 插件配置
include_once('./Application/Config/Plugin/Conf' . CARRIER_ID . ".php");

// 调试模式，发布时一定要修改为0，不调试。 1、调试模式。
define('DEBUG', 0);

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

// 本地调试--版本稳定后会删掉与此相关的内容（主要用于鉴权） 1--本地调试，0--线上运行
define('LOCATION_TEST', 0);

// 系统在维护升级中 1--表示在维护升级状态， 0--表示处于正常工作状态
define('SYSTEM_IS_UPDATE', 0);

// 自定义版本号
define('CUSTOM_CLIENT_VERSION', '0.1.1');

// 使用特殊的播放器（播放器本身无法获取当前时间以及视频总时长）
define("DIRECT_GO_SPECIAL_PLAYER", "return array(
    'B700V2'
);");

/**
 * 支持访问视频问诊插件的盒子型号（青海电信智能盒子的型号）
 * 厂家	　	型号	　	        平台	　	　
 * 天邑	　	TY1608	　	    华为	　	　
 * 天邑	　	TY1608	　	    中兴	　	　
 * 华为	　	EC6108V9C	    华为	　	　
 * 华为	　	EC6108V9C	    中兴	　	　
 * 中兴	　	B860AV1.1-T2	中兴	　	　
 * 中兴	　	B860AV1.1-T2	华为	　	　
 * 中兴	　	B860AV1.1	    华为	　	　
 * 天邑	　	TY1208-Z	　	华为	　	　
 * 中兴	　	B860AV2.1	    华为	　	　
 * 创维	　	E900-S	　	    中兴	　
 * 创维	　	E900-S	　	    华为	　
 * 烽火	　	HG680-J	　	    中兴
 * EC6108V9_pub_qhqdx
 */
define("ALLOW_ACCESS_INQUIRY", "return array(
//    'TY1608', 'EC6108V9C', 'B860AV1.1-T2', 'B860AV1.1', 'TY1208-Z', 'B860AV2.1', 'E900-S', 'HG680-J', 'EC6108V9_pub_qhqdx',
);");