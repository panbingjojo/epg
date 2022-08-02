<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午6:13
 */

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
define('IS_REDIS_CACHE_LOG', 1);

// 是否要缓存页面配置信息（1--缓存，0不缓存）
define('IS_REDIS_CACHE_DATA', 1);

// 是否缓存session内容到redis （1--缓存，0不缓存）define('IS_REDIS_CACHE_DATA', 1);
define('IS_REDIS_CACHE_SESSION', 1);

// 系统在维护升级中 1--表示在维护升级状态， 0--表示处于正常工作状态
define('SYSTEM_IS_UPDATE', 0);

// 欢迎页的逻辑是否需要自身特殊处理，需要定义该常量，不需要就不用定义
define("HANDLE_SPLASH_SELF", 1);

// 屏蔽掉不能访问视频问诊插件的盒子型号UNT400G|S-010W-AV2S|S65|NL5101RK3228H
define("FORBID_ACCESS_INQUIRY", "return array(
    'EC6106V6',         // 华为EC6106V6：不能下载
    'UNT400G',
    'S-010W-AV2S',
    'S65',
    'NL5101RK3228H',
);");

// 不支持视频问诊的弹框提示
define("FORBID_ACCESS_INQUIRY_STRING", "return array(
    'MESSAGE' => '您的机顶盒暂不支持该功能',
    'SUBMIT' => '知道了',
);");

// 问诊插件打印日志目录
define("INQUIRY_LOG_PATH", '/data/logs/inquiry/' . CARRIER_ID . '/');
