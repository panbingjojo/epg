<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class IntroVideoDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "detailV2UI" => "IntroVideo/V2/detail"
                )
            ),

            CARRIER_ID_YBHEALTH => array(
                self::DEFAULT_PAGE_CONF => array(
                    "detailV2UI" => "IntroVideo/V2/detail"
                )
            ),

            CARRIER_ID_MANGOTV_LT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "detailV2UI" => "IntroVideo/V2/detail"
                )
            ),
            CARRIER_ID_MANGOTV_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "detailV2UI" => "IntroVideo/V2/detail"
                )
            ),

        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "singleUI" => "IntroVideo/V1/SingleOrPay",
            "listUI" => "IntroVideo/V1/ListVideo",
            "detailUI" => "IntroVideo/V1/detail"
        );
    }
}