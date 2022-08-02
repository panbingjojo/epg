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
define('IS_REDIS_CACHE_LOG', 0);

// 是否要缓存页面配置信息（1--缓存，0不缓存）
define('IS_REDIS_CACHE_DATA',0);

// 是否缓存session内容到redis （1--缓存，0不缓存）define('IS_REDIS_CACHE_DATA', 1);
define('IS_REDIS_CACHE_SESSION', 0);

// 系统在维护升级中 1--表示在维护升级状态， 0--表示处于正常工作状态
define('SYSTEM_IS_UPDATE', 0);

// 自定义版本号
define('CUSTOM_CLIENT_VERSION', '0.1.1');

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

// 中国联通各省份的区号
define("CHINAUNICOM_AREACODE_MAP", "return Array(
    /** 联通省分运营商ID 联通省分公司编码(New) 联通省分公司名称 */
    '208' => ['10','内蒙古'], // 内蒙古
    '205' => ['11','北京'], // 北京
    '201' => ['13','天津'], // 天津
    '216' => ['17','山东'], // 山东
    '206' => ['18','河北'], // 河北
    '207' => ['19','山西'], // 山西
    '213' => ['30','安徽'], // 安徽
    '232' => ['31','上海'], // 上海
    '212' => ['34','江苏'], // 江苏
    '202' => ['36','浙江'], // 浙江
    '214' => ['38','福建'], // 福建
    '220' => ['50','海南'], // 海南
    '218' => ['51','广东'], // 广东
    '219' => ['59','广西'], // 广西
    '228' => ['70','青海'], // 青海
    '217' => ['71','湖北'], // 湖北
    '231' => ['74','湖南'], // 湖南
    '215' => ['75','江西'], // 江西
    '204' => ['76','河南'], // 河南
    '225' => ['79','西藏'], // 西藏
    '222' => ['81','四川'], // 四川
    '221' => ['83','重庆'], // 重庆
    '226' => ['84','陕西'], // 陕西
    '223' => ['85','贵州'], // 贵州
    '224' => ['86','云南'], // 云南
    '227' => ['87','甘肃'], // 甘肃
    '229' => ['88','宁夏'], // 宁夏
    '230' => ['89','新疆'], // 新疆	
    '210' => ['90','吉林'], // 吉林
    '209' => ['91','辽宁'], // 辽宁
    '211' => ['97','黑龙江'], // 黑龙江
);");