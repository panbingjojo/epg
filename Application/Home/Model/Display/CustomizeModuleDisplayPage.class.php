<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class CustomizeModuleDisplayPage implements IDisplayPage
{
    private $homeV1Config = array(
        "customizeModuleV1UI" => "CustomizeModule/V1/home",
    );

    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "customizeModuleV1UI" => "CustomizeModule/V1/plate1",
                ),
            ),

            CARRIER_ID_CHINAUNICOM=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "customizeModuleV1UI" => "CustomizeModule/V2/plate000051",
                ),
            ),

            CARRIER_ID_HUBEIDX=> array(
                self::DEFAULT_PAGE_CONF => array(),
                "plate1" => array(
                    "customizeModuleV1UI" => "CustomizeModule/V4/plate420092",
                ),
                "plate2" => array(
                    "customizeModuleV1UI" => "CustomizeModule/V3/plate420092",
                ),
            ),

            CARRIER_ID_GUANGXIDX=> array(
                self::DEFAULT_PAGE_CONF => array(
                    "customizeModuleV1UI" => "CustomizeModule/V5/plate450092",
                ),
            ),
            CARRIER_ID_GUIZHOUDX=> array(
                self::DEFAULT_PAGE_CONF => array(),
                "JKYS" => array(
                    "customizeModuleV1UI" => "CustomizeModule/V520092/jkys",
                ),
                "JKSH" => array(
                    "customizeModuleV1UI" => "CustomizeModule/V520092/jksh",
                ),
                "JKYD" => array(
                    "customizeModuleV1UI" => "CustomizeModule/V520092/jkyd",
                ),
                "JKZS" => array(
                    "customizeModuleV1UI" => "CustomizeModule/V520092/jkzs",
                ),
            ),
            CARRIER_ID_JIANGSUDX=> array(
                self::DEFAULT_PAGE_CONF => array(),
                "plate1" => array(
                    "customizeModuleV1UI" => "CustomizeModule/V6/plate320092",
                ),
            ),
            CARRIER_ID_NINGXIADX=> array(
                self::DEFAULT_PAGE_CONF => array(),
                "plate1" => array(
                    "customizeModuleV1UI" => "CustomizeModule/V640092/oralHealth",
                ),
            )
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "customizeModuleV1UI" => "CustomizeModule/V1/plate1",
        );
    }

}