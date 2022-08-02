<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class HoldDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        $pagePaths = array(
            CARRIER_ID_CHINAUNICOM => array(
                '201' => array(
                    "indexV1UI" => "Hold/V5/index",
                ),
                '251' => array(
                    "indexV1UI" => "Hold/V5/index",
                ),
                '207' => array(
                    "indexV1UI" => "Hold/V3/index",
                ),
                '204' => array(
                    "indexV1UI" => "Hold/V4/index",
                ),
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V4/index",
                )
            ),
            CARRIER_ID_NINGXIAGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V6/index",
                )
            ),
            CARRIER_ID_JIANGSUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V2/index",
                )
            ),
            CARRIER_ID_GUANGXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V2/index",
                )
            ),

            CARRIER_ID_CHONGQINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V2/index",
                )
            ),
            CARRIER_ID_NINGXIADX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG => array(
                '201' => array(
                    "indexV1UI" => "Hold/V5/index",
                    "healthLiveV1UI" => "Hold/V1000051By201/index",
                ),
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
            CARRIER_ID_HUBEIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
            CARRIER_ID_JIANGSUDX_OTT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
            CARRIER_ID_MANGOTV_LT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
            CARRIER_ID_SHANDONGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                    "healthLiveV1UI" => "Hold/V7/HealthLive",
                )
            ),
            CARRIER_ID_SHANDONGDX_HAIKAN => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                    "healthLiveV1UI" => "Hold/V7/HealthLive",
                )
            ),
            CARRIER_ID_LDLEGEND => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V5/index",
                    "healthLiveV1UI" => "Hold/V7/HealthLive",
                )
            ),
            CARRIER_ID_XINJIANGDX_TTJS => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V21/index",
                    "healthLiveV1UI" => "Hold/V21/HealthLive",
                )
            ),
            CARRIER_ID_XINJIANGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
            CARRIER_ID_GUANGXIGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MEETLIFE => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index"
                )
            ),
            CARRIER_ID_JILINGD_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index"
                )
            ),
            CARRIER_ID_JILINGDDX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index"
                )
            ),
            CARRIER_ID_HENANDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                    "healthLiveV1UI" => "Hold/V7/HealthLive",
                )
            ),
            CARRIER_ID_GUANGDONGGD_NEW => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
            CARRIER_ID_NINGXIADX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
            // --------APK版本从这里开始配置--------
            CARRIER_ID_CHINAUNICOM_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V4/index",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG_APK => array(
                '201' => array(
                    "indexV1UI" => "Hold/V5/index",
                    "healthLiveV1UI" => "Hold/V1000051By201/index",
                ),
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                )
            ),
        );

        // V7模式统一配置
        $v7PagePathCarriers = [
            CARRIER_ID_DEMO4,            // demo4 - 展厅显示版本4
            CARRIER_ID_DEMO7,            // demo7 - 展厅显示版本7
            CARRIER_ID_HUNANDX,          // 湖南电信
            CARRIER_ID_CHINAUNICOM_OTT,  // 中国联通OTT
            CARRIER_ID_GUANGDONGYD,      // 广东移动
            CARRIER_ID_HAIKAN_APK,       // 山东电信 -- 海看APK项目
            CARRIER_ID_JILIN_YD,         // 吉林移动
            CARRIER_ID_JIANGSUDX_YUEME,  // 江苏电信apk -- 悦me
            CARRIER_ID_NEIMENGGU_DX,     // 内蒙古电信apk
            CARRIER_ID_NINGXIA_YD,       // 宁夏移动apk
            CARRIER_ID_GUANGXI_YD,       // 广西移动apk
            CARRIER_ID_ZHEJIANG_HUASHU,  // 浙江华数apk
            CARRIER_ID_SHANDONGDX_APK,   // 山东电信apk
            CARRIER_ID_GUANGXIGD_APK,    // 广西广电apk
            CARRIER_ID_HUNANYX,          // 湖南有线apk
            CARRIER_ID_HEILONGJIANG_YD,  // 黑龙江移动apk
            CARRIER_ID_HEBEIYD,          // 河北移动apk
            CARRIER_ID_JILINGD,          // 吉林广电联通
            CARRIER_ID_JILINGDDX,        // 吉林广电电信
        ];
        if(in_array(CARRIER_ID,$v7PagePathCarriers)) {
            $pagePaths[CARRIER_ID] = array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Hold/V7/index",
                ),
            );
        }

        return $pagePaths;
    }

    public function getDefaultPageConf() {
        return array(
            "indexV1UI" => "Hold/V1/index",
            "healthLiveV1UI" => "Hold/V1000051By201/index",
        );
    }
}