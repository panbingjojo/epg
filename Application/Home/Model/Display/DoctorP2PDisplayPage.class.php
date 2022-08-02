<?php


namespace Home\Model\Display;

use Home\Model\Entry\MasterManager;

require "IDisplayPage.class.php";

class DoctorP2PDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        $pagePaths = array(
            CARRIER_ID_XINJIANGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "DoctorEntrUI" => "DoctorP2P/V5/DoctorEntr", // 天翼问诊入口
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "doctorIndexV11UI" => "DoctorP2P/V10/DoctorIndex", // 医生列表页面
                    "doctorDepartmentV10UI" => "DoctorP2P/V10/DoctorDepartment", // 医生所属部门列表页面
                    "doctorDetailsV10UI" => "DoctorP2P/V10/DoctorDetail", // 医生详情页面
                    "inquiryCallV1UI" => "DoctorP2P/V3/InquiryCall", // 电视电话/微信视频问诊页面
                    "AppletsQrCodeUI" => "DoctorP2P/V10/AppletsQrCode", // 电视电话/微信视频问诊页面
                ),
                'smallPack' => array(
                    "doctorDetailsV10UI" => "DoctorP2P/V28/DoctorDetail", // 医生详情页面
                )
            ),

            //////////// APK //////////////////////
            CARRIER_ID_CHINAUNICOM_MOFANG_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "doctorIndexV11UI" => "DoctorP2P/V10/DoctorIndex", // 医生列表页面
                    "doctorDepartmentV10UI" => "DoctorP2P/V10/DoctorDepartment", // 医生所属部门列表页面
                    "doctorDetailsV10UI" => "DoctorP2P/V10/DoctorDetail", // 医生详情页面
                    "inquiryCallV1UI" => "DoctorP2P/V3/InquiryCall", // 电视电话/微信视频问诊页面
                    "AppletsQrCodeUI" => "DoctorP2P/V10/AppletsQrCode", // 电视电话/微信视频问诊页面
                ),
                'smallPack' => array(
                    "doctorDetailsV10UI" => "DoctorP2P/V28/DoctorDetail", // 医生详情页面
                )
            )
        );

        // v10渲染模式地区列表
        $displayV10Carriers = [CARRIER_ID_JILINGDDX_MOFANG, CARRIER_ID_JILINGD_MOFANG, CARRIER_ID_GUIZHOUDX,
            CARRIER_ID_GUIZHOUGD,CARRIER_ID_QINGHAIDX,CARRIER_ID_CHONGQINGGD, CARRIER_ID_HEBEIYD];

        if (in_array(CARRIER_ID, $displayV10Carriers)) { // V10模式页面的渲染
            $pagePaths[CARRIER_ID] = array(
                self::DEFAULT_PAGE_CONF =>  array(
                    "doctorIndexV11UI" => "DoctorP2P/V10/DoctorIndex", // 医生列表页面
                    "doctorDepartmentV10UI" => "DoctorP2P/V10/DoctorDepartment", // 医生所属部门列表页面
                    "doctorDetailsV10UI" => "DoctorP2P/V10/DoctorDetail", // 医生详情页面
                    "inquiryCallV1UI" => "DoctorP2P/V3/InquiryCall", // 电视电话/微信视频问诊页面
                ),
            );
        }

        if (CARRIER_ID == CARRIER_ID_GUANGXIGD) { // V3模式页面渲染
            $pagePaths[CARRIER_ID] = array(
                self::DEFAULT_PAGE_CONF => array(
                    "doctorListV1UI" => "DoctorP2P/V3/DoctorList", // 医生列表页面
                    "doctorDepartmentV1UI" => "DoctorP2P/V3/DoctorDepartment", // 医生所属部门列表页面
                    "doctorDetailsV1UI" => "DoctorP2P/V3/DoctorDetails", // 医生详情页面
                    "inquiryCallV1UI" => "DoctorP2P/V3/InquiryCall", // 电视电话/微信视频问诊页面
                )
            );
        }

        return $pagePaths;
    }

    /**
     * 默认页面配置
     * @return string[]
     */
    public function getDefaultPageConf()
    {
        return array( // 默认渲染V13模式页面
            "doctorIndexV13UI" => "DoctorP2P/V13/DoctorIndex", // 医生列表页面
            "doctorDetailsV13UI" => "DoctorP2P/V13/DoctorDetail", // 医生详情页面
            "inquiryCallV1UI" => "DoctorP2P/V13/InquiryCall", // 电视电话/微信视频问诊页面
            "doctorCommentV13UI" => "DoctorP2P/V13/DoctorComment",
        );
    }
}