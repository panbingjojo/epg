<?php
/**
 * Created by longmaster
 * Brief: 宁夏广电EPG
 */

// 插件配置
include_once('./Application/Config/Plugin/Conf' . CARRIER_ID . ".php");

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
define('IS_REDIS_CACHE_DATA',0);

// 是否缓存session内容到redis （1--缓存，0不缓存）define('IS_REDIS_CACHE_DATA', 1);
define('IS_REDIS_CACHE_SESSION', 0);

// 系统在维护升级中 1--表示在维护升级状态， 0--表示处于正常工作状态
define('SYSTEM_IS_UPDATE', 0);

// 屏蔽掉不能访问视频问诊插件的盒子型号
define("FORBID_ACCESS_INQUIRY", "return array(
    //'EC2106V1', 'HG680-R', 'HG680',
    //'HG680-J', 'EC2106V1',
     // 'E900','B860A',  暂时删除
);");

// 不支持视频问诊的弹框提示
define("FORBID_ACCESS_INQUIRY_STRING", "return array(
    'MESSAGE' => '您的电视盒子暂不支持该功能',
    'SUBMIT' => '知道了'
);");

// 上报用户数据的地区及内容信息
define("UPLOAD_USER_BEHAVIOUR_POSITION_DATA", "return array(
    '201' => '天津-朗玛信息-39健康-13', // 天津独立入口13
    '216' => '山东-朗玛信息-39健康-03', // 山东独立入口03
    '211' => '黑龙江-朗玛信息-39健康-03', // 黑龙江信息聚合入口产品
);");

define("STB_MODEL_TYPE", "return array(
    'HUAWEI' => '1 ', // 华为
    'ZTE' => '2', // 中兴
);");