<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class GameDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_QINGHAIDX_GAME => array(
                self::DEFAULT_PAGE_CONF => array(
                    "gameDetailsUI" => "Game/gamedetails",
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "gameDetailsUI" => "Game/gamedetails",
        );
    }
}