<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class FamilyDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        $pagePaths = array(
            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V16/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V16/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_NINGXIAGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_LIAONINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_SHANXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_HENANDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_HUBEIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "myHomeV1UI" => "Family/V8/MyHome",
                    "aboutV1UI" => "Family/V3/About",
                    "familyMembersAddV1UI" => "Family/V13/FamilyMembersEdit",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_JIANGSUDX_OTT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "myHomeV1UI" => "Family/V8/MyHome",
                    "aboutV1UI" => "Family/V3/About",
                    "familyMembersAddV1UI" => "Family/V13/FamilyMembersEdit",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_GUANGXIGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_GUIZHOUGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "aboutV1UI" => "Family/V3/About",
                    "familyMembersAddV1UI" => "Family/V10/FamilyMembersAdd",
                    "familyMembersEditorV1UI" => "Family/V10/FamilyMembersEditor",
                    "familyMembersAddEditV1UI" => "Family/V10/FamilyMembersEditor",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit",
                    "myHomeV1UI" => "Family/V8/MyHome",
                )
            ),
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),

            CARRIER_ID_YBHEALTH => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V10/MyHome",
                    "indexV11UI" => "Family/V15/FamilyIndex",
                    "aboutV1UI" => "Family/V10/About",
                    "familyMembersAddV1UI" => "Family/V10/FamilyMembersAdd",
                    "familyMembersEditorV1UI" => "Family/V10/FamilyMembersEditor",
                )
            ),

            CARRIER_ID_MANGOTV_LT => array(

                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V10/MyHome",
                    "indexV11UI" => "Family/V15/FamilyIndex",
                    "aboutV1UI" => "Family/V10/About",
                    "familyMembersAddV1UI" => "Family/V10/FamilyMembersAdd",
                    "familyMembersEditorV1UI" => "Family/V10/FamilyMembersEditor",
                )
            ),

            CARRIER_ID_MANGOTV_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V10/MyHome",
                    "indexV11UI" => "Family/V17/FamilyIndex",
                    "aboutV1UI" => "Family/V10/About",
                    "familyMembersAddV1UI" => "Family/V10/FamilyMembersAdd",
                    "familyMembersEditorV1UI" => "Family/V10/FamilyMembersEditor",
                )
            ),

            CARRIER_ID_NINGXIADX => array(
                self::DEFAULT_PAGE_CONF => array(
//                    "myHomeV2UI" => "Family/V10/MyHome",
//                    "familyMembersEditorV1UI" => "Family/V10/FamilyMembersEditor",
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                    "indexV11UI" => "Family/V15/FamilyIndex",
                    "aboutV1UI" => "Family/V10/About",
                    "familyMembersAddV1UI" => "Family/V10/FamilyMembersAdd",
                )
            ),
            CARRIER_ID_JILINGDDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV1UI" => "Family/V220095/family",
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                    "familyMembersAddV1UI" => "Family/V13/FamilyMembersEdit",
                    "aboutV1UI" => "Family/V3/About",
                )
            ),
            CARRIER_ID_JILINGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV1UI" => "Family/V4/MyHome",
                    "aboutV1UI" => "Family/V3/About",
                    "familyMembersAddV1UI" => "Family/V3/FamilyMembersAdd",
                    "familyMembersEditorV1UI" => "Family/V3/FamilyMembersEditor",
                )
            ),
            CARRIER_ID_GUIZHOUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "aboutV1UI" => "About/V2/about",
                    "familyMembersAddV1UI" => "Family/V10/FamilyMembersAdd",
                    "familyMembersEditorV1UI" => "Family/V10/FamilyMembersEditor",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit",
                    "myHomeV1UI" => "Family/V8/MyHome",
                )
            ),
            CARRIER_ID_XINJIANGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV1UI" => "Family/V8/MyHome",
                    "aboutV1UI" => "Family/V3/About",
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                    "familyMembersAddV1UI" => "Family/V13/FamilyMembersEdit",
                )
            ),
            CARRIER_ID_SHANDONGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_SHANDONGDX_HAIKAN => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_JIANGSUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_GUANGXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_GUANGDONGGD_NEW => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_CHONGQINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            //ylp 20200122 改为新疆的View
            CARRIER_ID_CHINAUNICOM_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV1UI" => "Family/V8/MyHome",
                    "aboutV1UI" => "Family/V3/About",
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                    "familyMembersAddV1UI" => "Family/V13/FamilyMembersEdit",
                )
            ),
            CARRIER_ID_JILINGD_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "myHomeV1UI" => "Family/V8/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_JILINGDDX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "myHomeV1UI" => "Family/V8/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            // --------APK版本从这里开始配置--------
            CARRIER_ID_DEMO4 => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV1UI" => "Family/V8/MyHome",
                    "aboutV1UI" => "Family/V3/About",
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                    "familyMembersAddV1UI" => "Family/V13/FamilyMembersEdit",
                )
            ),
            CARRIER_ID_GANSUYD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_QINGHAI_YD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_XIZANG_YD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV1UI" => "Family/V8/MyHome",
                    "aboutV1UI" => "Family/V3/About",
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                    "familyMembersAddV1UI" => "Family/V13/FamilyMembersEdit",
                )
            ),
        );

        // v13模式统一配置
        $v13PagePathCarriers = [CARRIER_ID_DEMO7,// demo7 - 展厅显示版本7
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
            CARRIER_ID_HAINANDX,         // 海南电信EPG
            CARRIER_ID_SHIJICIHAI,       // 世纪慈海在线问诊APK
            CARRIER_ID_HEBEIYD,          // 河北移动APK
        ];
        if(in_array(CARRIER_ID,$v13PagePathCarriers)) {
            $pagePaths[CARRIER_ID] = array(
                self::DEFAULT_PAGE_CONF => array(
                    "myHomeV2UI" => "Family/V13/MyHome",
                    "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
                )
            );
        }

        return $pagePaths;
    }

    private function _getPagePathV13(){
        return array(
            self::DEFAULT_PAGE_CONF => array(
                "myHomeV2UI" => "Family/V13/MyHome",
                "familyMembersAddEditV1UI" => "Family/V13/FamilyMembersEdit", // 添加和编辑在同一个页面
            )
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "myHomeV1UI" => "Family/V1/MyHome",
            "aboutV1UI" => "Family/V1/About",
            "familyMembersAddV1UI" => "Family/V1/FamilyMembersAdd",
            "familyMembersEditorV1UI" => "Family/V1/FamilyMembersEditor",
        );
    }
}