<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";


class DataArchivingDisplayPage implements IDisplayPage
{

    public function getDisplayPageConf()
    {
        $pagePaths = array(

            CARRIER_ID_GUIZHOUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV10UI" => "DataArchiving/V10/ArchivingList",
                    "recordListV10UI" => "DataArchiving/V10/RecordList",
                    "recordDetailV10UI" => "DataArchiving/V10/RecordDetail",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                )
            ),
            CARRIER_ID_GUIZHOUGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV10UI" => "DataArchiving/V10/ArchivingList",
                    "recordListV10UI" => "DataArchiving/V10/RecordList",
                    "recordDetailV10UI" => "DataArchiving/V10/RecordDetail",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",

                )
            ),
            CARRIER_ID_MANGOTV_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV10UI" => "DataArchiving/V10/ArchivingList",
                    "recordListV10UI" => "DataArchiving/V10/RecordList",
                    "recordDetailV10UI" => "DataArchiving/V10/RecordDetail",
                )
            ),
            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V16/ArchivingList",
                )
            ),
            CARRIER_ID_NINGXIAGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                )
            ),
            CARRIER_ID_GUANGXIGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                )
            ),
            CARRIER_ID_LIAONINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                )
            ),
            CARRIER_ID_SHANXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                )
            ),
            CARRIER_ID_HUBEIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                )
            ),
            CARRIER_ID_JIANGSUDX_OTT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                )
            ),
            CARRIER_ID_SHANDONGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                )
            ),
            CARRIER_ID_SHANDONGDX_HAIKAN => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),
            CARRIER_ID_JIANGSUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                )
            ),
            CARRIER_ID_GUANGXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),

            CARRIER_ID_CHONGQINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    ///*ylp add 20210122 begin*/
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
//                    "archivingListV1UI" => "DataArchiving/V8/ArchivingList",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                    ///*ylp add 20210122 end*/
                )
            ),
            CARRIER_ID_XINJIANGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
//                    "archivingListV1UI" => "DataArchiving/V8/ArchivingList",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),
            CARRIER_ID_HENANDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
//                    "archivingListV1UI" => "DataArchiving/V8/ArchivingList",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),
            CARRIER_ID_NINGXIADX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
//                    "archivingListV1UI" => "DataArchiving/V8/ArchivingList",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),
            CARRIER_ID_GUANGDONGGD_NEW => array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
//                    "archivingListV1UI" => "DataArchiving/V8/ArchivingList",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),
            CARRIER_ID_XINJIANGDX_TTJS => array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
                    "archivingListV1UI" => "DataArchiving/V8/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),
            CARRIER_ID_JILINGD_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),
            CARRIER_ID_JILINGDDX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),
            CARRIER_ID_JILINGDDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),
            CARRIER_ID_JILINGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV1UI" => "DataArchiving/V1/ArchivingList",
                )
            ),
            CARRIER_ID_QINGHAIDX=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",

                )
            ),
            // --------APK版本从这里开始配置--------
            CARRIER_ID_DEMO4 => array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                )
            ),

            CARRIER_ID_GANSUYD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",

                )
            ),
            CARRIER_ID_QINGHAI_YD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",

                )
            ),
            CARRIER_ID_XIZANG_YD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",

                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    ///*ylp add 20210122 begin*/
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                    ///*ylp add 20210122 end*/
                )
            ),
        );

        // 新版设备健康检测涉及页面统一配置
        $newPagePathsCarriers = [CARRIER_ID_DEMO7,// demo7 - 展厅显示版本7
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
            CARRIER_ID_QINGHAI_YD,       // 青海移动apk
            CARRIER_ID_GANSUYD,          // 甘肃移动apk
            CARRIER_ID_SHANDONGDX_APK,   // 山东电信apk
            CARRIER_ID_GUANGXIGD_APK,    // 广西广电apk
            CARRIER_ID_HUNANYX,          // 湖南有线apk
            CARRIER_ID_HEILONGJIANG_YD,  // 黑龙江移动apk
            CARRIER_ID_HAINANDX,        // 海南电信EPG
            CARRIER_ID_SHIJICIHAI,      // 世纪慈海在线问诊APK
            CARRIER_ID_HEBEIYD,         // 河北移动APK
        ];
        if (in_array(CARRIER_ID,$newPagePathsCarriers)) {
            $pagePaths[CARRIER_ID] = array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordListV1UI" => "DataArchiving/V8/RecordList",
                    "recordDetailV1UI" => "DataArchiving/V8/RecordDetail",
                    "archivingListV13UI" => "DataArchiving/V13/ArchivingList",
                    "archivedV1UI" => "DataArchiving/V8/archived",
                    "recordDetailV10UI" => "HealthTest/V13/TestRecord",
                    "testTypeUI"=>"HealthTest/V13/testType",
                    "testListUI"=>"HealthTest/650092/TestList",
                    "weightListUI"=>"HealthTest/650092/WeightList",
                    "weightDetailUI"=>"HealthTest/650092/WeightDetail",
                    "weightIntroduceUI"=>"HealthTest/650092/WeightIntroduce",
                    "wristListUI"=>"HealthTest/650092/Wristband/WristList"
                )
            );
        }

        return $pagePaths;
    }

    public function getDefaultPageConf() {
        return array(
            "recordListV1UI" => "DataArchiving/V1/RecordList",
            "recordDetailV1UI" => "DataArchiving/V1/RecordDetail",
            "archivingListV1UI" => "DataArchiving/V1/ArchivingList",
            "archivedV1UI" => "DataArchiving/V1/archived",

            //  健康检测相关前端路由映射
            "recordDetailV10UI" => "HealthTest/V13/TestRecord",
            "testTypeUI" => "HealthTest/V13/testType",
            "testListUI" => "HealthTest/650092/TestList",
            "weightListUI" => "HealthTest/650092/WeightList",
            "weightDetailUI" => "HealthTest/650092/WeightDetail",
            "weightIntroduceUI" => "HealthTest/650092/WeightIntroduce",
            "reportDataUI" => "HealthTest/650092/ReportData",
            "reportDataBatUI" => "HealthTest/650092/ReportDataBat",
            "wristListUI" => "HealthTest/650092/Wristband/WristList",
            "stepCountListUI" => "HealthTest/650092/Wristband/StepCountList",
            "heartRateListUI" => "HealthTest/650092/Wristband/HeartRateList",
            "sleepListUI" => "HealthTest/650092/Wristband/SleepList",
            "sleepDetailUI" => "HealthTest/650092/Wristband/SleepDetail",
            "sportListUI" => "HealthTest/650092/Wristband/SportList",
            "stepCountDetailUI" => "HealthTest/650092/Wristband/StepCountDetail",
            "heartRateDetailUI" => "HealthTest/650092/Wristband/HeartRateDetail",
            "heartRateSportUI" => "HealthTest/650092/Wristband/HeartRateSport",
            "sportDetailUI" => "HealthTest/650092/Wristband/SportDetail",
            "sportEqDetailUI" => "HealthTest/650092/Wristband/SportEqDetail",
        );
    }
}