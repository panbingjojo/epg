<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class HealthVideoDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
//            CARRIER_ID_CHINAUNICOM_MOFANG => array(
//                self::DEFAULT_PAGE_CONF => array(
//                    "videoListV10UI" => "HealthVideo/V20/VideoList",
//                    "videoSetV10UI" => "HealthVideo/V20/VideoSet",
//                )
//            ),
            CARRIER_ID_XINJIANGDX_TTJS => array(
                self::DEFAULT_PAGE_CONF => array(
                    "videoListV10UI" => "HealthVideo/V21/VideoList",
                    "videoSetV10UI" => "HealthVideo/V21/VideoSet",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MEETLIFE => array(
                self::DEFAULT_PAGE_CONF => array(
                    "videoListV10UI" => "HealthVideo/V22/VideoList",
                    "videoSetV10UI" => "HealthVideo/V22/VideoSet",
                )
            ),
            CARRIER_ID_JILINGD_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "videoListV10UI" => "HealthVideo/V20/VideoList",
                    "videoSetV10UI" => "HealthVideo/V20/VideoSet",
                )
            ),
            CARRIER_ID_JILINGDDX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "videoListV10UI" => "HealthVideo/V20/VideoList",
                    "videoSetV10UI" => "HealthVideo/V20/VideoSet",
                )
            ),
            CARRIER_ID_LDLEGEND => array(
                self::DEFAULT_PAGE_CONF => array(
                    "videoListV10UI" => "HealthVideo/V28/VideoList",
                ),
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "videoListV10UI" => "HealthVideo/V10/VideoList",
            "videoSetV10UI" => "HealthVideo/V10/VideoSet",
        );
    }
}