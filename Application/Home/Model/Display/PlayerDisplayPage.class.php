<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class PlayerDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        $pagePaths = array(
            CARRIER_ID_XINJIANGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V7/index"
                )
            ),
            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V13/index"
                )
            ),
//            CARRIER_ID_GUANGXIDX => array(
//                self::DEFAULT_PAGE_CONF => array(
//                    "indexV1UI" => "Player/V13/index")),
            CARRIER_ID_NINGXIAGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V17/index"
                )
            ),
            CARRIER_ID_SHANDONGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V16/index"
                )
            ),
            CARRIER_ID_SHANDONGDX_HAIKAN => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V16/index"
                )
            ),
            CARRIER_ID_HAINANDX => array(
                'direct' => array(
                    "indexV1UI" => "Player/V8/index"
                ),
                self::DEFAULT_PAGE_CONF => array()
            ),
            CARRIER_ID_GUIZHOUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V11/index"
                )
            ),
            CARRIER_ID_QINGHAIDX => array(
                'noProgressBar' => array(
                    "indexV1UI" => "Player/V8/index"
                ),
                'direct' => array(
                    "indexV1UI" => "Player/V8/index"
                ),
                self::DEFAULT_PAGE_CONF => array()
            ),

            CARRIER_ID_YBHEALTH => array(
                'noProgressBar' => array(
                    "indexV1UI" => "Player/V8/index"
                ),
                'direct' => array(
                    "indexV1UI" => "Player/V8/index"
                ),
                self::DEFAULT_PAGE_CONF => array()
            ),

            CARRIER_ID_MANGOTV_LT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V18/index"
                )
            ),
            CARRIER_ID_MANGOTV_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V18/index"
                )

            ),
            CARRIER_ID_NINGXIADX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V8/index"
                )
            ),
            CARRIER_ID_LIAONINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V14/index"
                )
            ),
            CARRIER_ID_SHANXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V8/index"
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V20/index"
                )
            ),

            CARRIER_ID_XINJIANGDX_TTJS => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V21/index"
                )
            ),

            CARRIER_ID_CHONGQINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V7/index"
                )
            ),
            //广东广电EPG
            CARRIER_ID_GUANGDONGGD_NEW=> array(
                self::DEFAULT_PAGE_CONF => array(
                    // indexV1UI" => "Player/V22/index"
                    "indexV1UI" => "Player/V13/index"
                )
            ),

//            CARRIER_ID_GANSUDX => array(
//                self::DEFAULT_PAGE_CONF => array(
//                    "indexV1UI" => "Player/V13/index"
//                )
//            ),
//            CARRIER_ID_JILINGD_MOFANG => array(
//                self::DEFAULT_PAGE_CONF => array(
//                    "indexV1UI" => "Player/V11/index"
//                )
//            ),
            CARRIER_ID_LDLEGEND => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V20/index"
                )
            ),
            CARRIER_ID_NINGXIADX_MOFANG=>array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V9/index"
                )
            ),
            // --------APK版本从这里开始配置--------
            CARRIER_ID_HAIKAN_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V23/index"
                )
            ),
            CARRIER_ID_SHANDONGDX_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V23/index"
                )
            ),
            CARRIER_ID_GANSUYD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V23/index"
                )
            ),
            CARRIER_ID_NINGXIA_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V23/index"
                )
            ),
            CARRIER_ID_QINGHAI_YD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V23/index"
                )
            ),
            CARRIER_ID_HEILONGJIANG_YD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V23/index"
                )
            ),
            CARRIER_ID_GUANGXIGD_APK=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V23/index"
                )
            ),
            CARRIER_ID_GUANGXI_YD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V23/index"
                )
            ),
            CARRIER_ID_XIZANG_YD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V9/index"
                )
            ),
            CARRIER_ID_CHINAUNICOM_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V23/index"
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V23/index"
                )
            ),
        );

        // v13模式统一配置
        $v13PagePathCarriers = [
            CARRIER_ID_DEMO4,            // demo4 - 展厅显示版本4
            CARRIER_ID_DEMO7,            // demo7 - 展厅显示版本7
            CARRIER_ID_HUNANDX,          // 湖南电信
            CARRIER_ID_CHINAUNICOM_OTT,  // 中国联通OTT
            CARRIER_ID_GUANGDONGYD,      // 广东移动
            CARRIER_ID_JILIN_YD,         // 吉林移动
            CARRIER_ID_JIANGSUDX_YUEME,  // 江苏电信apk -- 悦me
            CARRIER_ID_NEIMENGGU_DX,     // 内蒙古电信apk
            CARRIER_ID_ZHEJIANG_HUASHU,  // 浙江华数apk
            CARRIER_ID_HUNANYX,          // 湖南有线apk
            CARRIER_ID_JIANGSUDX_OTT,    // 江苏电信OTT
            CARRIER_ID_HEBEIYD,          // 河北移动APK
        ];
        if(in_array(CARRIER_ID,$v13PagePathCarriers)) {
            $pagePaths[CARRIER_ID] = array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Player/V13/index"
                )
            );
        }

        return $pagePaths;
    }

    private function _getPagePathV13() {
        return  array(
            self::DEFAULT_PAGE_CONF => array(
                "indexV1UI" => "Player/V13/index"
            )
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "indexV1UI" => "Player/" . COMMON_PLAYER_VIEW . "/index",
            "smallV1UI" => "Player/" . COMMON_PLAYER_VIEW . "/small",
            "APKPlayUI"=>"Player/V4/playApk"
        );
    }
}