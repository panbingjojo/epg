<?php

namespace Home\Model\User;


class AuthUserBuilder
{

    const BUILDER_TABLE = array(
        CARRIER_ID_CHINAUNICOM => CARRIER_ID_CHINAUNICOM, // 中国联通
        CARRIER_ID_CHINAUNICOM_MOFANG => CARRIER_ID_CHINAUNICOM,   // 中国联通 -- 启生魔方
        CARRIER_ID_CHINAUNICOM_MEETLIFE => CARRIER_ID_CHINAUNICOM, // 中国联通 -- 遇见生活
        CARRIER_ID_LDLEGEND => CARRIER_ID_CHINAUNICOM, // 中国联通 -- 遇见生活
        CARRIER_ID_LIAONINGDX => CARRIER_ID_LIAONINGDX,   // 辽宁电信
        CARRIER_ID_JILINGD => CARRIER_ID_JILINGD,         // 吉林广电 -- 联通
        CARRIER_ID_JILINGDDX => CARRIER_ID_JILINGD,       // 吉林广电 -- 电信
        CARRIER_ID_JILINGD_MOFANG => CARRIER_ID_JILINGD_MOFANG,           // 吉林广电 -- 健康魔方
        CARRIER_ID_JILINGDDX_MOFANG => CARRIER_ID_JILINGDDX_MOFANG,       // 吉林广电 -- 电信
        CARRIER_ID_SHANDONGDX => CARRIER_ID_SHANDONGDX,   // 山东电信
        CARRIER_ID_SHANDONGDX_HAIKAN => CARRIER_ID_SHANDONGDX_HAIKAN,     // 山东电信 -- 海看
        CARRIER_ID_HUBEIDX => CARRIER_ID_HUBEIDX,         // 湖北电信
        CARRIER_ID_GUANGDONGGD=> CARRIER_ID_GUANGDONGGD,  // 广东广电 -- EPG
        CARRIER_ID_GUANGDONGGD_NEW => CARRIER_ID_GUANGDONGGD, // 广东广电 -- APK转EPG
        CARRIER_ID_GUANGXIDX => CARRIER_ID_GUANGXIDX,     // 广西电信
        CARRIER_ID_GUANGXIGD => CARRIER_ID_GUANGXIGD,     // 广西广电
        CARRIER_ID_CHONGQINGDX => CARRIER_ID_CHONGQINGDX, // 重庆电信
        CARRIER_ID_CHONGQINGGD => CARRIER_ID_CHONGQINGGD, // 重庆广电
        CARRIER_ID_GUIZHOUDX => CARRIER_ID_GUIZHOUDX,     // 贵州电信
        CARRIER_ID_GUIZHOUGD => CARRIER_ID_GUIZHOUGD,     // 贵州广电
        CARRIER_ID_GUIZHOUGD_XMT => CARRIER_ID_GUIZHOUDX, // 贵州广电 -- 新媒体
        CARRIER_ID_GANSUDX => CARRIER_ID_HUBEIDX,         // 甘肃电信
        CARRIER_ID_NINGXIADX => CARRIER_ID_NINGXIADX,     // 宁夏电信
        CARRIER_ID_NINGXIADX_MOFANG => CARRIER_ID_NINGXIADX,     // 宁夏电信
        CARRIER_ID_NINGXIAGD => CARRIER_ID_NINGXIAGD,     // 宁夏广电
        CARRIER_ID_QINGHAIDX => CARRIER_ID_QINGHAIDX,     // 青海电信
        CARRIER_ID_XINJIANGDX => CARRIER_ID_QINGHAIDX,    // 新疆电信
        CARRIER_ID_XINJIANGDX_TTJS => CARRIER_ID_QINGHAIDX,       // 新疆电信 -- 天天健身
        CARRIER_ID_XINJIANGDX_HOTLINE => CARRIER_ID_QINGHAIDX,    // 新疆电信 -- 民生热线
        CARRIER_ID_MANGOTV_YD => CARRIER_ID_MANGOTV_YD,   // 芒果TV -- 移动
        CARRIER_ID_MANGOTV_LT => CARRIER_ID_MANGOTV_YD,   // 芒果TV -- 联通
        CARRIER_ID_HENANDX => CARRIER_ID_HENANDX,         // 河南电信
        CARRIER_ID_HAINANDX => CARRIER_ID_HENANDX,        // 海南电信
        CARRIER_ID_FUJIANDX => CARRIER_ID_HENANDX,        // 福建电信
        CARRIER_ID_JIANGXIDX => CARRIER_ID_HENANDX,       // 江西电信
        CARRIER_ID_JIANGSUDX => CARRIER_ID_HENANDX,       // 江西电信
        CARRIER_ID_SHANXIDX => CARRIER_ID_HENANDX,        // 陕西电信


        //--------------------APK平台配置------------------------
        CARRIER_ID_DEMO4 => CARRIER_ID_DEMO4,                                 // 展厅演示版本4
        CARRIER_ID_DEMO7 => CARRIER_ID_DEMO7,                                 // 展厅演示版本7
        CARRIER_ID_CHINAUNICOM_OTT => CARRIER_ID_CHINAUNICOM_OTT,             // 中国联通-OTT-apk
        CARRIER_ID_HUNANDX => CARRIER_ID_HUNANDX,                             // 湖南电信
        CARRIER_ID_GUANGDONGYD => CARRIER_ID_GUANGDONGYD,                     // 广东移动apk
        CARRIER_ID_HAIKAN_APK => CARRIER_ID_HAIKAN_APK,                       // 山东电信apk -- 海看apk项目
        CARRIER_ID_JILIN_YD => CARRIER_ID_JILIN_YD,                           // 吉林移动apk
        CARRIER_ID_GANSUYD => CARRIER_ID_GANSUYD,                             // 甘肃移动apk
        CARRIER_ID_SHANDONGDX_APK => CARRIER_ID_SHANDONGDX_APK,               // 山东电信apk
        CARRIER_ID_JIANGSUDX_YUEME => CARRIER_ID_JIANGSUDX_YUEME,             // 江苏电信apk -- 悦me
        CARRIER_ID_GUANGXIGD_APK => CARRIER_ID_GUANGXIGD_APK,                 // 广西广电apk
        CARRIER_ID_NEIMENGGU_DX => CARRIER_ID_NEIMENGGU_DX,                   // 内蒙古电信apk
        CARRIER_ID_NINGXIA_YD => CARRIER_ID_NINGXIA_YD,                       // 宁夏移动apk
        CARRIER_ID_JIANGXIYD => CARRIER_ID_JIANGXIYD,                         // 江西移动apk
        CARRIER_ID_JIANGSUYD => CARRIER_ID_JIANGSUYD,                         // 江苏移动apk
        CARRIER_ID_JIANGSUDX_OTT => CARRIER_ID_JIANGSUDX_OTT,                 // 江苏电信apk -- ott
        CARRIER_ID_ANHUIYD_YIBAN => CARRIER_ID_ANHUIYD_YIBAN,                 // 安徽移动apk -- 怡伴
        CARRIER_ID_GUANGXI_YD_YIBAN => CARRIER_ID_GUANGXI_YD_YIBAN,           // 广西移动apk -- 怡伴
        CARRIER_ID_WEILAITV_TOUCH_DEVICE => CARRIER_ID_WEILAITV_TOUCH_DEVICE, // 未来电视触摸设备
        CARRIER_ID_YB_HEALTH_UNIFIED => CARRIER_ID_YB_HEALTH_UNIFIED,         // 未来电视怡伴健康统一接口
        CARRIER_ID_GUANGXI_YD => CARRIER_ID_GUANGXI_YD,                       // 广西移动apk
        CARRIER_ID_ZHEJIANG_HUASHU => CARRIER_ID_ZHEJIANG_HUASHU,             // 浙江华数apk
        CARRIER_ID_QINGHAI_YD => CARRIER_ID_QINGHAI_YD,                       // 青海移动apk
        CARRIER_ID_XIZANG_YD => CARRIER_ID_XIZANG_YD,                         // 西藏移动apk
        CARRIER_ID_HUNANYX => CARRIER_ID_HUNANYX,                             // 湖南有线apk
        CARRIER_ID_HEILONGJIANG_YD => CARRIER_ID_HEILONGJIANG_YD,             // 黑龙江移动apk
        CARRIER_ID_CHINAUNICOM_APK => CARRIER_ID_CHINAUNICOM_APK,             // 中国联通apk
        CARRIER_ID_QINGHAIDX_GAME => CARRIER_ID_QINGHAIDX_GAME,               // 青海电信游戏
        CARRIER_ID_SHIJICIHAI => CARRIER_ID_SHIJICIHAI,                       // 世纪慈海在线问诊APK
        CARRIER_ID_CHINAUNICOM_APK => CARRIER_ID_CHINAUNICOM_APK,             // 中国联通食乐汇-apk
        CARRIER_ID_HEBEIYD => CARRIER_ID_HEBEIYD,                             // 河北移动-apk
        CARRIER_ID_CHINAUNICOM_MOFANG_APK => CARRIER_ID_CHINAUNICOM_MOFANG_APK,   // 中国联通魔方-apk
        CARRIER_ID_XINJIANGGD_SLH => CARRIER_ID_XINJIANGGD_SLH,                             // 河北移动-apk
        CARRIER_ID_XINJIANGGD_MOFANG => CARRIER_ID_XINJIANGGD_MOFANG,                             // 河北移动-apk
        CARRIER_ID_XINJIANGGD_SLH_APK => CARRIER_ID_XINJIANGGD_SLH_APK,                             // 河北移动-apk
        CARRIER_ID_XINJIANGGD_MOFANG_APK => CARRIER_ID_XINJIANGGD_MOFANG_APK,                             // 河北移动-apk
    );

    /**
     * 实例化对象
     * 如果对象不存在将不会实例化成功
     * @return mixed
     */
    public static function buildAuthUser()
    {
        $className = AuthUserBuilder::_getClassName();
        if (class_exists($className)) {
            return new $className;
        }
        return null;
    }

    /**
     * 根据地区id获取对应的类名
     * @return string
     */
    private static function _getClassName()
    {
        $carrierId = self::BUILDER_TABLE[CARRIER_ID];
        return 'Home\Model\User\AuthUser' . $carrierId;
    }

}