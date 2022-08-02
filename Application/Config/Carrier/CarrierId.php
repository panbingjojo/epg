<?php
/**
 * @brief: 此文件用于定义各运营商的carrierId
 * Date: 2018-03-01
 * Time: 08:55
 */

/*******************************************************************************
 ******************************  EPG平台的区域编码  *******************************
 ********************************************************************************/
// 电信
define('CARRIER_ID_JIANGSUDX', '320092');                   // 江苏电信WEB-EPG
define('CARRIER_ID_ANHUIDX', '340092');                     // 安徽电信WEB-EPG
define("CARRIER_ID_FUJIANDX", "350092");                    // 福建电信EPG
define("CARRIER_ID_GUANGXIDX", "450092");                   // 广西电信EPG
define("CARRIER_ID_NINGXIADX", "640092");                   // 宁夏电信EPG
define("CARRIER_ID_NINGXIADX_MOFANG", "10640092");          // 宁夏电信魔方EPG
define("CARRIER_ID_QINGHAIDX", "630092");                   // 青海电信EPG
define("CARRIER_ID_HUBEIDX", "420092");                     // 湖北电信EPG
define("CARRIER_ID_HAINANDX", "460092");                    // 海南电信EPG
define("CARRIER_ID_XINJIANGDX", "650092");                  // 新疆电信EPG
define("CARRIER_ID_CHONGQINGDX", "500092");                 // 重庆电信EPG
define("CARRIER_ID_GUIZHOUDX", "520092");                   // 贵州电信EPG
define("CARRIER_ID_JIANGXIDX", "360092");                   // 江西电信EPG
define("CARRIER_ID_HENANDX", "410092");                     // 河南电信EPG
define("CARRIER_ID_LIAONINGDX", "210092");                  // 辽宁电信EPG
define("CARRIER_ID_SHANXIDX", "610092");                    // 陕西电信EPG
define("CARRIER_ID_SHANDONGDX", "370092");                  // 山东电信EPG
define("CARRIER_ID_SHANDONGDX_HAIKAN", "371092");           // 山东电信EPG -- 海看项目
define("CARRIER_ID_GANSUDX", "620092");                     // 甘肃电信EPG
define("CARRIER_ID_XINJIANGDX_HOTLINE", "651092");          // 新疆电信EPG -- 热线服务
define("CARRIER_ID_XINJIANGDX_TTJS", "12650092");           // 新疆电信EPG -- 天天健身
define("CARRIER_ID_ZHEJIANGDX", "330092");                  // 浙江电信EPG


// 联通
define('CARRIER_ID_CHINAUNICOM', '000051');                 // 中国联通天津基地WEB-EPG
define('CARRIER_ID_SHANDONGLT', '370093');                  // 山东联通WEB-EPG
define('CARRIER_ID_CHINAUNICOM_MOFANG', '10000051');        // 中国联通魔方
define('CARRIER_ID_MANGOTV_LT', '07430093');                // 芒果TV-WEB-EPG（联通）
define('CARRIER_ID_CHINAUNICOM_MEETLIFE', '13000051');      // 中国联通遇见生活

// 移动
define('CARRIER_ID_MANGOTV_YD', '07430091');                // 芒果TV-WEB-EPG（移动）


// 广电
define('CARRIER_ID_GUANGDONGGD', '440094');                 // 广东广电WEB-EPG
define('CARRIER_ID_GUANGDONGGD_NEW', '440004');             // 广东广电WEB-EPG-纯WEB版本
define("CARRIER_ID_GUANGXIGD", "450094");                   // 广西广电WEB-EPG
define('CARRIER_ID_SICHUANGD', '510094');                   // 四川广电WEB-EPG
define('CARRIER_ID_CHONGQINGGD', '500094');                 // 重庆广电WEB-EPG
define('CARRIER_ID_GUIZHOUGD', '520094');                   // 贵州广电WEB-EPG
define('CARRIER_ID_GUIZHOUGD_XMT', '520095');               // 贵州广电新媒体WEB-EPG //落在电信
define('CARRIER_ID_NINGXIAGD', '640094');                   // 宁夏广电WEB-EPG
define("CARRIER_ID_XINJIANGGD_SLH", "650094");              // 新疆广电食乐汇EPG
define("CARRIER_ID_XINJIANGGD_MOFANG", "10650094");         // 新疆广电健康魔方EPG

// 新媒体
define('CARRIER_ID_JILINGD', '220094');                     // 吉林广电新媒体WEB-EPG -- (联通版本)
define('CARRIER_ID_JILINGDDX', '220095');                   // 吉林广电新媒体WEB-EPG -- (电信版本)
define('CARRIER_ID_JILINGD_MOFANG', '10220094');            // 吉林广电-EPG（联通）魔方
define('CARRIER_ID_JILINGDDX_MOFANG', '10220095');          // 吉林广电-EPG（电信）魔方

// 怡伴健康
define('CARRIER_ID_YBHEALTH', '09000051');                   // 未来电视（怡伴健康EPG）
// 乐动传奇
define('CARRIER_ID_LDLEGEND', '11000051');                   // （乐动传奇EPG）

/*******************************************************************************
 ******************************  APK平台的区域编码  *******************************
 ********************************************************************************/
// 展厅
define('CARRIER_ID_DEMO4', '000409');                   // 展示版本-4（基于广东广电）
define('CARRIER_ID_DEMO7', '000709');                   // 展示版本-7（基于中国联通APK2.0）
define('CARRIER_ID_CHINAUNICOM_OTT', '001006');         // 中国联通-OTT-apk
define('CARRIER_ID_CHINAUNICOM_APK', '000006');         // 中国联通食乐汇-apk
define('CARRIER_ID_CHINAUNICOM_MOFANG_APK', '10000006');       // 中国联通魔方APK

// 电信平台
define("CARRIER_ID_HUNANDX", "430002");                 // 湖南电信apk
define("CARRIER_ID_HAIKAN_APK", "371002");              // 山东电信apk -- 海看项目
define("CARRIER_ID_SHANDONGDX_APK", "370002");          // 山东电信apk
define('CARRIER_ID_JIANGSUDX_YUEME', '000005');         // 江苏电信apk -- 悦me
define('CARRIER_ID_NEIMENGGU_DX', '150002');            // 内蒙古电信apk

// 移动平台
define('CARRIER_ID_GUANGDONGYD', '440001');             // 广东移动apk
define('CARRIER_ID_JILIN_YD', '220001');                // 吉林广电新媒体 -- 移动版本
define('CARRIER_ID_GANSUYD', '620007');                 // 甘肃移动apk
define('CARRIER_ID_NINGXIA_YD', '640001');              // 宁夏移动apk
define('CARRIER_ID_JIANGXIYD', '360001');               // 江西移动apk
define('CARRIER_ID_JIANGSUYD', '320001');               // 江苏移动apk
define('CARRIER_ID_JIANGSUDX_OTT', '320005');           // 江苏电信apk -- ott
define('CARRIER_ID_ANHUIYD_YIBAN', '09340001');         // 安徽移动apk -- 怡伴
define('CARRIER_ID_GUANGXI_YD_YIBAN', '09450001');      // 广西移动apk -- 怡伴
define('CARRIER_ID_GUANGXI_YD', '450001');              // 广西移动apk
define('CARRIER_ID_QINGHAI_YD', '630001');              // 青海移动apk
define('CARRIER_ID_XIZANG_YD', '540001');               // 西藏移动apk
define('CARRIER_ID_HUNANYX', '430012');                 // 湖南有线apk
define('CARRIER_ID_HEILONGJIANG_YD', '01230001');       // 黑龙江移动apk
define('CARRIER_ID_HEBEIYD', '130001');                 // 河北移动apk

define('CARRIER_ID_SHIJICIHAI', '110052');              // 世纪慈海在线问诊APK

// 广电平台
define('CARRIER_ID_GUANGXIGD_APK', '450004');           // 广西广电apk
define("CARRIER_ID_XINJIANGGD_SLH_APK", "650004");          // 新疆广电食乐汇APK
define("CARRIER_ID_XINJIANGGD_MOFANG_APK", "10650004");     // 新疆广电健康魔方APK

// 未来电视
define('CARRIER_ID_WEILAITV_TOUCH_DEVICE', '05001110'); // 未来电视触摸屏设备
define('CARRIER_ID_YB_HEALTH_UNIFIED', '09000001');     // 未来电视怡伴健康统一接口

// 华数
define('CARRIER_ID_ZHEJIANG_HUASHU', '320013');         // 浙江华数

//游戏
define("CARRIER_ID_QINGHAIDX_GAME", "04630092");                   // 青海电信游戏

// 视频问诊地区映射表
define("INQUIRY_AREA_CODE_MAP", "return Array(
    /** 联通省分运营商ID 联通省分公司编码(New) 联通省分公司名称 */
    '320092' => '江苏电信EPG',
    '330092' => '浙江电信EPG',
    '000051' => '中国联通EPG',
    '640092' => '宁夏电信EPG',
    '630092' => '青海电信EPG',
    '650092' => '新疆电信EPG',
    '420092' => '湖北电信EPG',
    '460092' => '海南电信EPG',
    '370092' => '山东电信EPG',
    '210092' => '辽宁电信EPG',
    '220095' => '吉林广电(电信)EPG',
    '220094' => '吉林广电(联通)EPG',
    '440094' => '广东广电EPG',
    '450094' => '广西广电EPG',
    '450092' => '广西电信EPG',
    '520094' => '贵州广电EPG',
    '10000051' => '中国联通魔方',
    '10220094' => '吉林广电魔方',
);");

// CarriedId映射表 -- 提供前端使用，避免硬编码问题
define("CARRIER_ID_TABLE", "return Array(
    'CARRIER_ID_CHINAUNICOM' => '000051',
    'CARRIER_ID_LIAONINGDX' => '210092',
    'CARRIER_ID_JILINGD' => '210094',
    'CARRIER_ID_JILINGDDX' => '220095',
    'CARRIER_ID_JIANGSUDX' => '320092',
    'CARRIER_ID_ZHEJIANGDX' => '330092',
    'CARRIER_ID_ANHUIDX' => '340092',
    'CARRIER_ID_FUJIANDX' => '350092',
    'CARRIER_ID_JIANGXIDX' => '360092',
    'CARRIER_ID_SHANDONGDX' => '370092',
    'CARRIER_ID_SHANDONGLT' => '370093',
    'CARRIER_ID_HENANDX' => '410092',
    'CARRIER_ID_HUBEIDX' => '420092',
    'CARRIER_ID_GUANGDONGGD' => '440094',
    'CARRIER_ID_GUANGXIDX' => '450092',
    'CARRIER_ID_GUANGXIGD' => '450094',
    'CARRIER_ID_HAINANDX' => '460092',
    'CARRIER_ID_CHONGQINGDX' => '500092',
    'CARRIER_ID_SICHUANGD' => '510094',
    'CARRIER_ID_GUIZHOUDX' => '520092',
    'CARRIER_ID_GUIZHOUGD' => '520094',
    'CARRIER_ID_GUIZHOUGD_XMT' => '520095',
    'CARRIER_ID_SHANXIDX' => '610092',
    'CARRIER_ID_GANSUDX' => '620092',
    'CARRIER_ID_QINGHAIDX' => '630092',
    'CARRIER_ID_NINGXIADX' => '640092',
    'CARRIER_ID_NINGXIAGD' => '640094',
    'CARRIER_ID_XINJIANGDX_HOTLINE' => '651092',
    'CARRIER_ID_MANGOTV_YD' => '07430091',
    'CARRIER_ID_MANGOTV_LT' => '07430093',
    'CARRIER_ID_YBHEALTH' => '09000051',
    'CARRIER_ID_CHINAUNICOM_MOFANG' => '10000051',
    'CARRIER_ID_XINJIANGDX_TTJS' => '12650092',
    'CARRIER_ID_JILINGD_MOFANG' => '10220094',
    'CARRIER_ID_NINGXIADX_MOFANG' => '10640092',
    'CARRIER_ID_SHIJICIHAI' => '110052',
    'CARRIER_ID_CHINAUNICOM_APK' => '000006',
    'CARRIER_ID_HEBEIYD' => '130001',
);");
