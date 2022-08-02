<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class CustomDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    "customV1UI" => "Custom/V16/index",
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "customV1UI" => "Custom/V1/index",
        );
    }
}