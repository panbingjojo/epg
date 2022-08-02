<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

/**
 * 主页配置信息类
 * Class MainDisplayPage
 * @package Home\Model\Display
 */

class MainDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        $pagePaths = array(
            CARRIER_ID_GUANGXIGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            ),
            CARRIER_ID_GUANGDONGGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV1UI" => "Main/V6/home",
                    "homeTab1V1UI" => "Main/V6/HomeTab1",
                    "homeTab2V1UI" => "Main/V6/HomeTab2",
                    "homeTab3V1UI" => "Main/V6/HomeTab3",
                    "homeTab4V1UI" => "Main/V6/HomeTab4",
                )
            ),
            CARRIER_ID_GUANGDONGGD_NEW => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                    "homeV7UI" => "Main/V15/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),

            ),
            CARRIER_ID_GUIZHOUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV1UI" => "Main/V11/home",
                    "homeTab1V10UI" => "Main/V11/HomeTab1",
                    "homeTab2V10UI" => "Main/V11/HomeTab2",
                    "homeTab3V10UI" => "Main/V11/HomeTab3",
                    "homeTab4V10UI" => "Main/V11/HomeTab4",
                )
            ),

            CARRIER_ID_XINJIANGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            ),
            CARRIER_ID_XINJIANGDX_HOTLINE => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV2UI" => "Main/V8/home",
                    "homeTab1V2UI" => "Main/V8/HomeTab1",
                    "homeTab2V2UI" => "Main/V8/HomeTab2",
                    "homeTab3V2UI" => "Main/V8/HomeTab3",
                    "homeTab4V2UI" => "Main/V8/HomeTab4",
                )
            ),
            CARRIER_ID_JILINGD => array(
                self::DEFAULT_PAGE_CONF => array(
//                     旧版
                    "homeV2UI" => "Main/V12/home",
                    "homeTab1V2UI" => "Main/V12/HomeTab1",
                    "homeTab2V2UI" => "Main/V12/HomeTab2",
                    "homeTab3V2UI" => "Main/V12/HomeTab3",
                    "homeTab4V2UI" => "Main/V12/HomeTab4",
                )
            ),
            CARRIER_ID_JILINGDDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV2UI" => "Main/V12/home",
                    "homeTab1V2UI" => "Main/V12/HomeTab1",
                    "homeTab2V2UI" => "Main/V12/HomeTab2",
                    "homeTab3V2UI" => "Main/V12/HomeTab3",
                    "homeTab4V2UI" => "Main/V12/HomeTab4",
                )
            ),
            CARRIER_ID_GUANGXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                    "homeTab1V3UI" => "Main/V3/HomeTab1",
                    "homeTab2V3UI" => "Main/V3/HomeTab2",
                    "homeTab3V3UI" => "Main/V3/HomeTab3",
                    "homeTab4V3UI" => "Main/V3/HomeTab4",
                    "tabMoreV3UI" => "Main/V3/TabMore",
                )
            ),
            CARRIER_ID_SICHUANGD => array(
                self::DEFAULT_PAGE_CONF => $this->homeV7Config,
            ),
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V29/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),
            CARRIER_ID_QINGHAIDX_GAME => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V32/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),
            CARRIER_ID_YBHEALTH => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V15/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),
            CARRIER_ID_LDLEGEND => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV22UI" => "Main/V28/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),

            CARRIER_ID_MANGOTV_LT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V15/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/TwoLevelMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),
            CARRIER_ID_MANGOTV_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V15/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),
            CARRIER_ID_NINGXIADX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V9/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                    "MenuTabLevelThreeV7UI" => "Main/V9/MenuTabLevelThree",
                )
            ),
            CARRIER_ID_NINGXIADX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V24/home",
                )
            ),
            CARRIER_ID_GUIZHOUGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV10UI" => "Main/V10/home",
                    "homeTab1V10UI" => "Main/V10/HomeTab1",
                    "homeTab2V10UI" => "Main/V10/HomeTab2",
                    "homeTab3V10UI" => "Main/V10/HomeTab3",
                    "homeTab4V10UI" => "Main/V10/HomeTab4",
                )
            ),
            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V25/home",
                )
            ),
            CARRIER_ID_XINJIANGGD_SLH => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V25/home",
                )
            ),
            CARRIER_ID_XINJIANGGD_SLH_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V25/home",
                )
            ),
            CARRIER_ID_CHINAUNICOM_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V25/home",
                )
            ),
            CARRIER_ID_NINGXIAGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V17/home",
                    "nightMedicineV7UI" => "Main/V9/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                )
            ),
            CARRIER_ID_LIAONINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            ),
            CARRIER_ID_SHANXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            ),
            CARRIER_ID_HENANDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            ),
            CARRIER_ID_HUBEIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V30/home",
                )
            ),
            CARRIER_ID_JIANGSUDX_OTT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V30/home",
                )
            ),
            CARRIER_ID_SHANDONGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V31/home",
                )
            ),
            CARRIER_ID_SHANDONGDX_HAIKAN => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            ),
            CARRIER_ID_JIANGSUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            ),
            CARRIER_ID_CHONGQINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            ),
            CARRIER_ID_GANSUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            ),
            CARRIER_ID_JILIN_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V26/home",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                    "homeV7UI" => "Main/V15/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),
            CARRIER_ID_XINJIANGGD_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                    "homeV7UI" => "Main/V15/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),
            CARRIER_ID_XINJIANGGD_MOFANG_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                    "homeV7UI" => "Main/V15/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),
            CARRIER_ID_XINJIANGDX_TTJS => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV21UI" => "Main/V21/home",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MEETLIFE => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV22UI" => "Main/V22/home",
                )
            ),
            CARRIER_ID_GUIZHOUGD_XMT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            ),
            CARRIER_ID_JILINGD_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV1UI" => "Main/V23/home",
//
                    "homeTab1V10UI" => "Main/V10/HomeTab1",
                    "homeTab2V10UI" => "Main/V10/HomeTab2",
                    "homeTab3V10UI" => "Main/V10/HomeTab3",
                    "homeTab4V10UI" => "Main/V10/HomeTab4",

                )
            ),
            CARRIER_ID_JILINGDDX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV1UI" => "Main/V23/home",
//
                    "homeTab1V10UI" => "Main/V10/HomeTab1",
                    "homeTab2V10UI" => "Main/V10/HomeTab2",
                    "homeTab3V10UI" => "Main/V10/HomeTab3",
                    "homeTab4V10UI" => "Main/V10/HomeTab4",

                )
            ),
            // --------APK版本从这里开始配置--------
            CARRIER_ID_DEMO4 => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                    "homeV7UI" => "Main/V15/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),

            CARRIER_ID_GANSUYD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V27/home",
                    "menuTabV7UI" => "Main/V27/MenuTab",
                    "healthCareV7UI" => "Main/V27/HealthCare",
                    "nightMedicineV7UI" => "Main/V27/QHotherPages/nightMedicine",
                    "orderRegisterV7UI" => "Main/V27/QHotherPages/orderRegister",
                    "MenuTabLevelThreeV7UI" => "Main/V27/MenuTabLevelThree",
                    "healthDetectV7UI" => "Main/V27/healthDetect",
                )
            ),
            CARRIER_ID_XIZANG_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V27/home",
                    "menuTabV7UI" => "Main/V27/MenuTab",
                    "healthCareV7UI" => "Main/V27/HealthCare",
                    "nightMedicineV7UI" => "Main/V27/QHotherPages/nightMedicine",
                    "orderRegisterV7UI" => "Main/V27/QHotherPages/orderRegister",
                    "MenuTabLevelThreeV7UI" => "Main/V27/MenuTabLevelThree",
                    "healthDetectV7UI" => "Main/V27/healthDetect",
                )
            ),
            CARRIER_ID_QINGHAI_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V27/home",
                    "menuTabV7UI" => "Main/V27/MenuTab",
                    "healthCareV7UI" => "Main/V27/HealthCare",
                    "nightMedicineV7UI" => "Main/V27/QHotherPages/nightMedicine",
                    "orderRegisterV7UI" => "Main/V27/QHotherPages/orderRegister",
                    "MenuTabLevelThreeV7UI" => "Main/V27/MenuTabLevelThree",
                    "healthDetectV7UI" => "Main/V27/healthDetect",
                )
            ),
            CARRIER_ID_SHANDONGDX_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V31/home",
                    "menuTabV7UI" => "Main/V9/MenuTab",
                    "healthCareV7UI" => "Main/V9/HealthCare",
                    "nightMedicineV7UI" => "Main/V9/QHotherPages/nightMedicine",
                    "orderRegisterV7UI" => "Main/V9/QHotherPages/orderRegister",
                    "MenuTabLevelThreeV7UI" => "Main/V9/MenuTabLevelThree",
                )
            ),
            CARRIER_ID_HEBEIYD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V15/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV7UI" => "Main/V15/home",
                    "menuTabV7UI" => "Main/V15/MenuTab",
                    "healthCareV7UI" => "Main/V7/HealthCare",
                    "nightMedicineV7UI" => "Main/V15/QHotherPages/NightMedicine",
                    "orderRegisterV7UI" => "Main/V15/QHotherPages/OrderRegister",
                ),
            ),
        );

        // v13模式统一配置
        $v13PagePathCarriers = [CARRIER_ID_DEMO7,// demo7 - 展厅显示版本7
            CARRIER_ID_CHINAUNICOM_OTT,  //中国联通OTT
            CARRIER_ID_HUNANDX,          // 湖南电信
            CARRIER_ID_GUANGDONGYD,      // 广东移动
            CARRIER_ID_HAIKAN_APK,       // 山东电信 -- 海看APK项目
            CARRIER_ID_JIANGSUDX_YUEME,  // 江苏电信apk -- 悦me
            CARRIER_ID_NEIMENGGU_DX,     // 内蒙古电信apk
            CARRIER_ID_NINGXIA_YD,       // 宁夏移动apk
            CARRIER_ID_GUANGXI_YD,       // 广西移动apk
            CARRIER_ID_ZHEJIANG_HUASHU,  // 浙江华数apk
            CARRIER_ID_GUANGXIGD_APK,    // 广西广电apk
            CARRIER_ID_HUNANYX,          // 湖南有线apk
            CARRIER_ID_HEILONGJIANG_YD,  // 黑龙江移动apk
        ];
        if (in_array(CARRIER_ID, $v13PagePathCarriers)) {
            $pagePaths[CARRIER_ID] = array(
                self::DEFAULT_PAGE_CONF => array(
                    "homeV13UI" => "Main/V13/home",
                )
            );
        }

        return $pagePaths;
    }

    /**
     * 获取默认的配置页面
     * @return string[]
     */
    public function getDefaultPageConf()
    {
        return array(
            "homeV1UI" => "Main/V1/home",
            "homeTab1V1UI" => "Main/V1/HomeTab1",
            "homeTab2V1UI" => "Main/V1/HomeTab2",
            "homeTab3V1UI" => "Main/V1/HomeTab3",
            "homeTab4V1UI" => "Main/V1/HomeTab4",
        );
    }
}