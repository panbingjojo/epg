<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class Hospital39DisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_GUIZHOUGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV10UI" => "New39hospital/V10/index",
                    "homeV10UI" => "New39hospital/V10/home",
                    "expertV10UI" => "New39hospital/V10/expert",
                    "guideV10UI" => "New39hospital/V10/guide",
                    "caseV10UI" => "New39hospital/V10/case",
                    "consultV10UI" => "New39hospital/V10/consult",
                )
            )
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "indexUI" => "New39hospital/V1/index"
        );
    }
}