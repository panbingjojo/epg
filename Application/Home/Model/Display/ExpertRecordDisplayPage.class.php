<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class ExpertRecordDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array();
    }

    public function getDefaultPageConf()
    {
        return array(
            "expertRecordHomeV13UI" => "ExpertRecord/V13/ExpertRecordIndex",
            "expertCaseUI" => "ExpertRecord/V13/CaseData",
            "expertAdviceUI" => "ExpertRecord/V13/DoctorAdvise",
        );
    }
}