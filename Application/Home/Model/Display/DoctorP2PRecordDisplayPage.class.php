<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class DoctorP2PRecordDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        $pagePaths = array(
            CARRIER_ID_QINGHAIDX => array( // // 问医记录V10页面模式渲染路径
                self::DEFAULT_PAGE_CONF => array(
                   "recordHomeV2UI" => "DoctorP2PRecord/V3/RecordHome",
                )
            ),
        );

        if (CARRIER_ID == CARRIER_ID_GUANGXIGD || CARRIER_ID == CARRIER_ID_HAINANDX) { // 问医记录V3页面模式渲染路径
            $pagePaths[CARRIER_ID] = array(
                self::DEFAULT_PAGE_CONF => array(
                    "recordHomeV2UI" => "DoctorP2PRecord/V3/RecordHome", // 问医记录页面（访问入口在医生列表页面）
                )
            );
        }

        return $pagePaths;
    }

    public function getDefaultPageConf()
    {
        return array( // 问医记录V13页面模式渲染路径（默认显示）
            "recordDetailV13UI" => "DataArchiving/V13/DoctorComment", // 问医记录详情页面（该页面既可展示未归档也可展示已归档的问医记录详情）
            "recordArchiveV1UI" => "DataArchiving/V13/AskArchive", // 问医记录归档到某个家庭成员页面
        );
    }
}