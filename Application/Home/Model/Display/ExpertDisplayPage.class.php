<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class ExpertDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array();
    }

    public function getDefaultPageConf()
    {
        return array(
            "expertLimitUI" => "Expert/V13/ExpertLimit",
            "expertIndexV13UI" => "Expert/V13/ExpertIndex",
            "expertDetailV13UI" => "Expert/V13/ExpertDetail",
            "expertSuccessV13UI" => "Expert/V13/OrderExpertSuccess",
        );
    }
}