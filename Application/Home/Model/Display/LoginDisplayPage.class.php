<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class LoginDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_QINGHAIDX_GAME => array(
                self::DEFAULT_PAGE_CONF => array(
                    "loginV1UI" => "Login/V1/login",
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "loginV1UI" => "Login/V1/login",
        );
    }
}