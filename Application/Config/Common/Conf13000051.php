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
define('IS_REDIS_CACHE_LOG', 0);

// 是否要缓存页面配置信息（1--缓存，0不缓存）
define('IS_REDIS_CACHE_DATA', 0);

// 是否缓存session内容到redis （1--缓存，0不缓存）define('IS_REDIS_CACHE_DATA', 1);
define('IS_REDIS_CACHE_SESSION', 0);

// 系统在维护升级中 1--表示在维护升级状态， 0--表示处于正常工作状态
define('SYSTEM_IS_UPDATE', 0);


// 上报用户数据的地区及内容信息
define("UPLOAD_USER_BEHAVIOUR_POSITION_DATA", "return array(
    '201' => '天津-朗玛视讯-遇见未来-13', // 天津独立入口13
    '216' => '山东-朗玛视讯-遇见未来-03', // 山东独立入口03
    '211' => '黑龙江-朗玛视讯-遇见未来-03', // 黑龙江信息聚合入口产品
);");

define("STB_MODEL_TYPE", "return array(
    'HUAWEI' => '1 ', // 华为
    'ZTE' => '2', // 中兴
);");

// 中国联通各省份 -- 陕西和山西的拼音一直，陕西用shaanxi
define("CHINAUNICOM_AREA_CODE_TABLE", "return Array(
    /** 联通省分运营商ID 联通省分公司编码(New) 联通省分公司名称 */
    'INNER_MONGOLIA' => '208', // 内蒙古
    'BEIJING' => '205', // 北京
    'TIANJIN' => '201', // 天津
    'SHANDONG' => '216', // 山东
    'HEBEI' => '206', // 河北
    'SHANXI' => '207', // 山西
    'ANHUI' => '213', // 安徽
    'SHANGHAI' => '232', // 上海
    'JIANGSU' => '212', // 江苏
    'ZHEJIANG' => '202', // 浙江
    'FUJIAN' => '214', // 福建
    'HAINAN' => '220', // 海南
    'GUANGDONG' => '218', // 广东
    'GX' => '219', // 广西
    'QINGHAI' => '228', // 青海
    'HUBEI' => '217', // 湖北
    'HUNAN' => '231', // 湖南
    'JIANGXI' => '215', // 江西
    'HENAN' => '204', // 河南
    'XIZANG' => '225', // 西藏
    'SICHUAN' => '222', // 四川
    'CHONGQING' => '221', // 重庆
    'SHAANXI' => '226', // 陕西
    'GUIZHOU' => '223', // 贵州
    'YUNNAN' => '224', // 云南
    'GANSU' => '227', // 甘肃
    'NX' => '229', // 宁夏
    'XINJIANG' => '230', // 新疆	
    'JILIN' => '210', // 吉林
    'LIAONING' => '209', // 辽宁
    'HEILONGJIANG' => '211', // 黑龙江
);");