<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class AboutDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_SHANDONGDX_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "aboutV1UI" => "About/V3/about",
                )
            ),
            CARRIER_ID_QINGHAI_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "aboutV1UI" => "About/V5/about",
                    "agreementV1UI" => "Pay/V630001/V1/agreement",
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "aboutV1UI" => "About/V1/about",
        );
    }
}