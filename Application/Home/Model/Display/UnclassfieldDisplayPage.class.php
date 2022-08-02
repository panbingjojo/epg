<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class UnclassfieldDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array();
    }

    public function getDefaultPageConf()
    {
        return array(
            "nightPharmacyV13UI" => "Unclassfiled/V13/NightPharmacy",
        );
    }
}