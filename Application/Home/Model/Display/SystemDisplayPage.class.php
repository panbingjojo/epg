<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class SystemDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array();
    }

    public function getDefaultPageConf()
    {
        return array(
            "updateUI" => "System/update",
            "waitUI" => "System/wait",
            "authOrderUI" => "System/authOrder",
            "errorUI" => "System/error",
        );
    }
}