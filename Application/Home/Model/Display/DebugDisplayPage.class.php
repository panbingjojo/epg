<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class DebugDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_JIANGSUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "callApkTestUI" => "Debug/V320092/V2/ApkTest",
                )
            ),
            CARRIER_ID_CHONGQINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "callApkTestUI" => "Debug/V320092/V2/ApkTest",
                )
            ),
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "callApkTestUI" => "Debug/V630092/V1/ApkTest",
                )
            ),
            CARRIER_ID_QINGHAIDX_GAME => array(
                self::DEFAULT_PAGE_CONF => array(
                    "callApkTestUI" => "Debug/V04630092/V1/ApkTest",
                )
            ),
            CARRIER_ID_YBHEALTH => array(
                self::DEFAULT_PAGE_CONF => array(
                    "callApkTestUI" => "Debug/V630092/V1/ApkTest",
                )
            ),
            CARRIER_ID_HENANDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "callApkTestUI" => "Debug/V410092/V1/ApkTest",
                )
            ),
            CARRIER_ID_HAINANDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "callApkTestUI" => "Debug/V460092/V1/ApkTest",
                )
            ),
            CARRIER_ID_HUBEIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "callApkTestUI" => "Debug/V420092/V1/ApkTest",
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        $model = "V" . CARRIER_ID;
        return array(
            "showSTBInfoUI" => "Debug/STBModel",
            "callApkTestUI" => "Debug/ApkTest",
            "videoPlayTestUI" => "Debug/VideoPlayerTest",
            "audioPlayTestUI" => "Debug/AudioPlayTest",
            "goTestEntrySetUI" => "Debug/TestEntrySet",
            "goDeviceInformationUI" => "Debug/DeviceInformation",
            "callTestByJ2MEUI" => "Debug/TestJ2ME",
            "jumpToPayUI" => "Debug/$model/JumpToPay",
            "goServerResponseTestUI" => "Debug/ServerResponseTest",
        );
    }
}