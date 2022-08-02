<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class HealthSelfTestDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "testListV1UI" => "HealthSelfTest/V1/testList",
                    "answerV1UI" => "HealthSelfTest/V1/answer",
                    "testResultsV1UI" => "HealthSelfTest/V1/testResults"
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "testListV1UI" => "HealthSelfTest/V20/testList",
                    "answerV1UI" => "HealthSelfTest/V20/answer",
                    "testResultsV1UI" => "HealthSelfTest/V20/testResults"
                )
            ),

            // --------APK版本从这里开始配置--------
            CARRIER_ID_DEMO4 => array(
                self::DEFAULT_PAGE_CONF => array(
                    "testListV1UI" => "HealthSelfTest/V20/testList",
                    "answerV1UI" => "HealthSelfTest/V20/answer",
                    "testResultsV1UI" => "HealthSelfTest/V20/testResults"
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "testListV1UI" => "HealthSelfTest/V20/testList",
                    "answerV1UI" => "HealthSelfTest/V20/answer",
                    "testResultsV1UI" => "HealthSelfTest/V20/testResults"
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "testListV1UI" => "HealthSelfTest/V1/testList",
            "answerV1UI" => "HealthSelfTest/V1/answer",
            "testResultsV1UI" => "HealthSelfTest/V1/testResults"
        );
    }
}