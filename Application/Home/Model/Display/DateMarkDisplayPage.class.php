<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class DateMarkDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "DateMark/V16/index",
                    "lotteryV1UI" => "DateMark/V16/lottery",
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "indexV1UI" => "DateMark/V1/index",
            "lotteryV1UI" => "DateMark/V1/lottery",
        );
    }
}