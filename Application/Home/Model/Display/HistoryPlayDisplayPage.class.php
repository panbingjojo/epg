<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class HistoryPlayDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V15/index",
                )
            ),
            CARRIER_ID_MANGOTV_LT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V16/index",
                )
            ),
            CARRIER_ID_MANGOTV_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V15/index",
                )
            ),
            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V25/index",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V13/index",
                )
            ),
            CARRIER_ID_XINJIANGDX_TTJS => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V21/index",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MEETLIFE => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V22/index",
                )
            ),
            CARRIER_ID_JILINGD_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V20/index",
                )
            ),
            CARRIER_ID_JILINGDDX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V20/index",
                )
            ),
            CARRIER_ID_GUANGDONGGD_NEW => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V13/index",
                )
            ),
            CARRIER_ID_NINGXIADX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V24/index",
                )
            ),
            CARRIER_ID_LDLEGEND => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V22/index",
                ),
            ),
            // --------APK版本从这里开始配置--------
            CARRIER_ID_DEMO4 => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V13/index",
                )
            ),
            CARRIER_ID_CHINAUNICOM_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V25/index",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "historyPlayV1UI" => "HistoryPlay/V13/index",
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "historyPlayV1UI" => "HistoryPlay/V13/index",
        );
    }
}