<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class HelpDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    "helpV1UI" => "Help/V16/HelpIndex",
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "helpV1UI" => "Help/V13/HelpIndex",
        );
    }
}