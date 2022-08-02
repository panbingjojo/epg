<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class OutbreakReportDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_QINGHAIDX=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "OutbreakReport/V2/index",
                    "liveChannelHV1UI" => "OutbreakReport/V2/LiveChannelH",
                    "liveChannelLV1UI" => "OutbreakReport/V2/LiveChannelL",
                    "retrogradeV1UI" => "OutbreakReport/V2/retrograde",
                )
            ),

            CARRIER_ID_YBHEALTH=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "OutbreakReport/V2/index",
                    "liveChannelHV1UI" => "OutbreakReport/V2/LiveChannelH",
                    "liveChannelLV1UI" => "OutbreakReport/V2/LiveChannelL",
                    "retrogradeV1UI" => "OutbreakReport/V2/retrograde",
                )
            ),
            CARRIER_ID_MANGOTV_LT=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "OutbreakReport/V2/index",
                    "liveChannelHV1UI" => "OutbreakReport/V2/LiveChannelH",
                    "liveChannelLV1UI" => "OutbreakReport/V2/LiveChannelL",
                )
            ),
            CARRIER_ID_MANGOTV_YD=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "OutbreakReport/V2/index",
                    "liveChannelHV1UI" => "OutbreakReport/V2/LiveChannelH",
                    "liveChannelLV1UI" => "OutbreakReport/V2/LiveChannelL",
                    "retrogradeV1UI" => "OutbreakReport/V2/retrograde",
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "nCoVTestUI" => "OutbreakReport/V1/NCOVTest",
            "nCoVTestResultUI" => "OutbreakReport/V1/NCOVTestResult",
            "nCoVSureAreaUI" => "OutbreakReport/V1/NCOVSureArea",
            "nCoVHospitalDepartmentUI" => "OutbreakReport/V1/NCOVHospitalDepartment",
            "indexV1UI" => "OutbreakReport/V1/index",
            "timeLineV1UI" => "OutbreakReport/V1/TimeLine",
            "areaDataV1UI" => "OutbreakReport/V1/AreaData",
            "areaDataPrevV1UI" => "OutbreakReport/V1/AreaDataPrev",
            "knowledgeV1UI" => "OutbreakReport/V1/knowledge",
            "treatmentV1UI" => "OutbreakReport/V1/treatment",
            "nucleicAcidDetectV1UI" => "OutbreakReport/V1/NucleicAcidDetect",
            "detectAgencyV1UI"=>"OutbreakReport/V1/detectAgency",
            "hotlineV1UI"=>"OutbreakReport/V1/hotline",
            "epidemicAreaUI"=>"OutbreakReport/V1/EpidemicArea",
            "goHomeIsolationUI"=>"OutbreakReport/V1/GoHomeIsolation",
        );
    }
}