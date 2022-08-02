<?php
namespace Home\Model\Display;

require "IDisplayPage.class.php";

class HealthTestDisplayPage implements IDisplayPage {
    public function getDisplayPageConf() {
        $pagePaths = array(
            CARRIER_ID_MANGOTV_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "imeiInputV10UI" => "HealthTest/V10/ImeiInput", // 先直接用首页测试
                    "detectionStepV10UI" => "HealthTest/V10/DetectionStep", // 先直接用首页测试
                )
            ),
            // 贵州电信
            CARRIER_ID_GUIZHOUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "imeiInputV10UI" => "HealthTest/V10/ImeiInput", // 先直接用首页测试
                    "detectionStepV10UI" => "HealthTest/V10/DetectionStep", // 先直接用首页测试
                )
            ),
            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    "testIndexV13UI" => "HealthTest/V16/TestIndex",        // 先直接用首页测试
                    "imeiInputV13UI" => "HealthTest/V16/ImeiInput",
                    "inputTestDataV13UI" => "HealthTest/V16/InputTestData",
                    "waitStepV13UI" => "HealthTest/V16/WaitStep",
                )
            ),
            CARRIER_ID_MANGOTV_LT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "imeiInputV10UI" => "HealthTest/V10/ImeiInput", // 先直接用首页测试
                    "detectionStepV10UI" => "HealthTest/V10/DetectionStep", // 先直接用首页测试
                )
            ),
            CARRIER_ID_GUIZHOUGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "imeiInputV10UI" => "HealthTest/V10/ImeiInput", // 先直接用首页测试
                    "detectionStepV10UI" => "HealthTest/V10/DetectionStep", // 先直接用首页测试
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "imeiInputV1UI" => "HealthTest/V13/ImeiInput",
                )
            ),
            CARRIER_ID_JILINGD_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "detectionStepV10UI" => "HealthTest/V10/DetectionStep", // 先直接用首页测试
                )
            ),
            CARRIER_ID_JILINGDDX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "detectionStepV10UI" => "HealthTest/V10/DetectionStep", // 先直接用首页测试
                )
            ),
            CARRIER_ID_JILINGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "imeiInputV1UI" => "HealthTest/V1/ImeiInput",
                    "inputDataV1UI" => "HealthTest/V1/InputData",
                    "detectionStepV1UI" => "HealthTest/V1/DetectionStep",
                )
            ),

            // --------APK版本从这里开始配置--------
            CARRIER_ID_CHINAUNICOM_MOFANG_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "imeiInputV1UI" => "HealthTest/V13/ImeiInput",
                )
            ),
        );
        // 新版设备健康检测涉及页面统一配置
        $newPagePathsCarriers = [
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
            CARRIER_ID_ZHEJIANG_HUASHU,  // 浙江华数apka'
            CARRIER_ID_GUANGXIGD_APK,    // 广西广电apk
            CARRIER_ID_HUNANYX,          // 湖南有线apk
            CARRIER_ID_HEILONGJIANG_YD,  // 黑龙江移动apk
        ];
        if (in_array(CARRIER_ID, $newPagePathsCarriers)) {
            $pagePaths[CARRIER_ID] = array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexUI" => "HealthTest/650092/index", // 先直接用首页测试
                    "imeiInputV8UI" => "HealthTest/650092/ImeiInputWeiXin",         // 健康检测，微信扫一扫，进入小程序
                    "codeUI" => "HealthTest/650092/code",
                    "introduceUI" => "HealthTest/650092/introduce",
                    "introduceSTUI" => "HealthTest/650092/introduceST",
                    "introduceTZUI" => "HealthTest/650092/IntroduceTZ",
                    "XYStepUI" => "HealthTest/650092/StepXY",
                    "XTStepUI" => "HealthTest/650092/StepXT",
                    "TZStepUI" => "HealthTest/650092/StepTZ",
                    "inputTestDataV8UI" => "HealthTest/650092/InputTestData",
                    "outIndexUI" => "HealthTest/650092/OutIndex",
                    "testWeightV8UI" => "HealthTest/650092/InputWeight",
                    "bindWristbandUI" => "HealthTest/650092/Wristband/BindWristband",
                    "introduceSHUI" => "HealthTest/650092/Wristband/IntroduceSH",
                    "stepSHUI" => "HealthTest/650092/Wristband/StepSH",
                    "stepHSDoctorSHUI" => "HealthTest/650092/Wristband/stepHSDoctorSH",
                )
            );
        }

        return $pagePaths;
    }

    /**
     * 默认的，公共的路由页面
     * @return string[]
     */
    public function getDefaultPageConf() {
        return array(
            "testIndexV13UI" => "HealthTest/V13/TestIndex",        // 先直接用首页测试
            "imeiInputV13UI" => "HealthTest/V13/ImeiInput",
            "imeiInputV1UI" => "HealthTest/V1/ImeiInput",
            "inputDataV1UI" => "HealthTest/V1/InputData",
            "detectionStepV1UI" => "HealthTest/V1/DetectionStep",
            "imeiInputV8UI" => "HealthTest/650092/ImeiInputWeiXin",
            "indexUI" => "HealthTest/650092/index", // 先直接用首页测试
            "codeUI" => "HealthTest/650092/code",
            "doctorCodeUI" => "HealthTest/650092/doctorCode",
            "introduceUI" => "HealthTest/650092/introduce",
            "hsDoctorIntroduceUI" => "HealthTest/650092/hsDoctorIntroduce",
            "introduceSTUI" => "HealthTest/650092/introduceST",
            "introduceTZUI" => "HealthTest/650092/IntroduceTZ",
            "XYStepUI" => "HealthTest/650092/StepXY",
            "XTStepUI" => "HealthTest/650092/StepXT",
            "TZStepUI" => "HealthTest/650092/StepTZ",
            "bodyfata20InputV8UI" => "HealthTest/650092/bodyfata20Input",
            "introduceBodyFatUI" => "HealthTest/650092/introduceBodyFat",
            "bodyFatStepUI" => "HealthTest/650092/bodyFatStep",
            "inputTestDataV8UI" => "HealthTest/650092/InputTestData",
            "outIndexUI" => "HealthTest/650092/OutIndex",
            "testWeightV8UI" => "HealthTest/650092/InputWeight",
            "inputTestDataV13UI" => "HealthTest/V13/InputTestData",
//            "detectionStepV1UI" => "HealthTest/V13/WaitStep",         //  等待检测-V13
            "waitStepV13UI" => "HealthTest/V13/WaitStep",
            "bindWristbandUI" => "HealthTest/650092/Wristband/BindWristband",
            "introduceSHUI" => "HealthTest/650092/Wristband/IntroduceSH",
            "stepSHUI" => "HealthTest/650092/Wristband/StepSH",
            "stepHSDoctorSHUI" => "HealthTest/650092/Wristband/stepHSDoctorSH",
        );
    }
}