<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class AppointmentRegisterDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        $pagePaths =  array(
            CARRIER_ID_SICHUANGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV2UI" => 'Main/V7/QHotherPages/OrderRegister',
                    "detailV2UI" => "AppointmentRegister/V2/HospitalDetail",
                    "introduceV2UI" => "AppointmentRegister/V2/HospitalIntroduce",
                    "subjectV2UI" => "AppointmentRegister/V2/SubjectList",
                    "doctorV2UI" => "AppointmentRegister/V2/DoctorList",
                )
            ),
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV2UI" => 'Main/V7/QHotherPages/OrderRegister',
                    "detailV2UI" => "AppointmentRegister/V2/HospitalDetail",
                    "introduceV2UI" => "AppointmentRegister/V2/HospitalIntroduce",
                    "subjectV2UI" => "AppointmentRegister/V2/SubjectList",
                    "doctorV2UI" => "AppointmentRegister/V2/DoctorList",
                    "indexV21UI" => 'AppointmentRegister/V21/index',
                    'indexOrderDoctorV21UI' => 'AppointmentRegister/V21/orderDoctor',
                    'indexHospitalIntroV21UI' => 'AppointmentRegister/V21/hospitalIntroDetail',
                    'indexAddOrderV21UI' => 'AppointmentRegister/V21/addOrder',
                    'indexChoosePeopleV21UI' => 'AppointmentRegister/V21/choosePeople',
                    'indexFinalAddInfoV21UI' => 'AppointmentRegister/V21/finalAddInfo',
                    'indexOrderDetailsV21UI' => 'AppointmentRegister/V21/orderDetails',
                    'indexOrderListV21UI' => 'AppointmentRegister/V21/orderList'
                )
            ),

            CARRIER_ID_YBHEALTH => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV2UI" => 'Main/V7/QHotherPages/OrderRegister',
                    "detailV2UI" => "AppointmentRegister/V2/HospitalDetail",
                    "introduceV2UI" => "AppointmentRegister/V2/HospitalIntroduce",
                    "subjectV2UI" => "AppointmentRegister/V2/SubjectList",
                    "doctorV2UI" => "AppointmentRegister/V2/DoctorList",
                )
            ),

            CARRIER_ID_MANGOTV_LT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV2UI" => 'Main/V7/QHotherPages/OrderRegister',
                    "detailV2UI" => "AppointmentRegister/V2/HospitalDetail",
                    "introduceV2UI" => "AppointmentRegister/V2/HospitalIntroduce",
                    "subjectV2UI" => "AppointmentRegister/V2/SubjectList",
                    "doctorV2UI" => "AppointmentRegister/V2/DoctorList",
                )
            ),
            CARRIER_ID_MANGOTV_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV2UI" => 'Main/V7/QHotherPages/OrderRegister',
                    "detailV2UI" => "AppointmentRegister/V2/HospitalDetail",
                    "introduceV2UI" => "AppointmentRegister/V2/HospitalIntroduce",
                    "subjectV2UI" => "AppointmentRegister/V2/SubjectList",
                    "doctorV2UI" => "AppointmentRegister/V2/DoctorList",
                )
            ),
            CARRIER_ID_GUIZHOUGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "hospitalDetailV10UI" => "AppointmentRegister/V10/HospitalDetail",
                    "departmentV10UI" => "AppointmentRegister/V10/Department",
                    "doctorListV10UI" => "AppointmentRegister/V10/DoctorList",
                    "appointmentTimeV10UI" => "AppointmentRegister/V10/AppointmentTime",
                    "doctorDetailV10UI" => "AppointmentRegister/V10/DoctorDetail",
                    "reservationAddV10UI" => "AppointmentRegister/V10/ReservationAdd",
                    "patientSelectionV10UI" => "AppointmentRegister/V10/PatientSelection",
                    "patientEditorV10UI" => "AppointmentRegister/V10/PatientEditor",
                    "reservationRuleV10UI" => "AppointmentRegister/V10/ReservationRule",
                    "paymentOrderV10UI" => "AppointmentRegister/V10/PaymentOrder",
                    "phoneCodeV10UI" => "AppointmentRegister/V10/PhoneCode",
                    "guideV10UI" => "AppointmentRegister/V10/guide",
                    "registeredRecordV10UI" => "AppointmentRegister/V10/RegisteredRecord",
                    "registrationDetailsV10UI" => "AppointmentRegister/V10/RegistrationDetails",
                    "createCodeV10UI" => "AppointmentRegister/V10/CreateCode",
                )
            ),
            CARRIER_ID_GUIZHOUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "AppointmentRegister/V10/HospitalIndex",
                    "hospitalDetailV10UI" => "AppointmentRegister/V10/HospitalDetail",
                    "departmentV10UI" => "AppointmentRegister/V10/Department",
                    "doctorListV10UI" => "AppointmentRegister/V10/DoctorList",
                    "appointmentTimeV10UI" => "AppointmentRegister/V10/AppointmentTime",
                    "doctorDetailV10UI" => "AppointmentRegister/V10/DoctorDetail",
                    "reservationAddV10UI" => "AppointmentRegister/V10/ReservationAdd",
                    "patientSelectionV10UI" => "AppointmentRegister/V10/PatientSelection",
                    "patientEditorV10UI" => "AppointmentRegister/V10/PatientEditor",
                    "reservationRuleV10UI" => "AppointmentRegister/V10/ReservationRule",
                    "paymentOrderV10UI" => "AppointmentRegister/V10/PaymentOrder",
                    "phoneCodeV10UI" => "AppointmentRegister/V10/PhoneCode",
                    "guideV10UI" => "AppointmentRegister/V10/guide",
                    "registeredRecordV10UI" => "AppointmentRegister/V10/RegisteredRecord",
                    "registrationDetailsV10UI" => "AppointmentRegister/V10/RegistrationDetails",
                    "createCodeV10UI" => "AppointmentRegister/V10/CreateCode",
                )
            ),
            CARRIER_ID_GUIZHOUGD_XMT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "AppointmentRegister/V10/HospitalIndex",
                    "hospitalDetailV10UI" => "AppointmentRegister/V10/HospitalDetail",
                    "departmentV10UI" => "AppointmentRegister/V10/Department",
                    "doctorListV10UI" => "AppointmentRegister/V10/DoctorList",
                    "appointmentTimeV10UI" => "AppointmentRegister/V10/AppointmentTime",
                    "doctorDetailV10UI" => "AppointmentRegister/V10/DoctorDetail",
                    "reservationAddV10UI" => "AppointmentRegister/V10/ReservationAdd",
                    "patientSelectionV10UI" => "AppointmentRegister/V10/PatientSelection",
                    "patientEditorV10UI" => "AppointmentRegister/V10/PatientEditor",
                    "reservationRuleV10UI" => "AppointmentRegister/V10/ReservationRule",
                    "paymentOrderV10UI" => "AppointmentRegister/V10/PaymentOrder",
                    "phoneCodeV10UI" => "AppointmentRegister/V10/PhoneCode",
                    "guideV10UI" => "AppointmentRegister/V10/guide",
                    "registeredRecordV10UI" => "AppointmentRegister/V10/RegisteredRecord",
                    "registrationDetailsV10UI" => "AppointmentRegister/V10/RegistrationDetails",
                    "createCodeV10UI" => "AppointmentRegister/V10/CreateCode",
                )
            ),
            CARRIER_ID_GUANGDONGGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "AppointmentRegister/V440094/index",
                )
            ),
            CARRIER_ID_GUANGDONGYD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "AppointmentRegister/V22/index",
                )
            ),
            CARRIER_ID_GUANGDONGGD_NEW => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexStaticV1UI" => "AppointmentRegister/V16/HospitalList",
                    "areaListStaticV1UI" => "AppointmentRegister/V16/HospitalInner",
                    "moreHospitalStaticV1UI" => "AppointmentRegister/V16/MoreHospital",
                    "indexV1UI" => "AppointmentRegister/V440094/index",
                )
            ),
            CARRIER_ID_JILIN_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexStaticV1UI" => "AppointmentRegister/V16/HospitalList",
                    "areaListStaticV1UI" => "AppointmentRegister/V16/HospitalInner",
                    "moreHospitalStaticV1UI" => "AppointmentRegister/V16/MoreHospital",
                )
            ),
            CARRIER_ID_NINGXIA_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexStaticV1UI" => "AppointmentRegister/V16/HospitalList",
                    "areaListStaticV1UI" => "AppointmentRegister/V16/HospitalInner",
                    "moreHospitalStaticV1UI" => "AppointmentRegister/V16/MoreHospital",
                )
            ),
            CARRIER_ID_HUBEIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "AppointmentRegister/V0/index",
                )
            ),
            CARRIER_ID_JIANGSUDX_OTT => array(
                self::DEFAULT_PAGE_CONF => array(
//                    "indexV1UI" => "AppointmentRegister/V0/index",
                    // 静态预约挂号
                    "indexStaticV1UI" => "AppointmentRegister/V13/HospitalList",
                    "areaListStaticV1UI" => "AppointmentRegister/V13/HospitalInner",
                    "doctorStaticV1UI" => "AppointmentRegister/V13/HospitalDoctor",
                    "doctorDetailStaticV1UI" => "AppointmentRegister/V13/DoctorDetail",
                    "moreHospitalStaticV1UI" => "AppointmentRegister/V13/MoreHospital",
                )
            ),
            CARRIER_ID_HAINANDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "AppointmentRegister/V0/index",
                )
            ),
            CARRIER_ID_JIANGXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "AppointmentRegister/V0/index",
                )
            ),

            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    // 静态预约挂号
                    "indexStaticV1UI" => "AppointmentRegister/V16/HospitalList",
                    "areaListStaticV1UI" => "AppointmentRegister/V16/HospitalInner",
                    "doctorStaticV1UI" => "AppointmentRegister/V16/HospitalDoctor",
                    "doctorDetailStaticV1UI" => "AppointmentRegister/V16/DoctorDetail",
                    "moreHospitalStaticV1UI" => "AppointmentRegister/V16/MoreHospital",
                )
            ),
            CARRIER_ID_JIANGSUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    // 静态预约挂号
                    "indexStaticV1UI" => "AppointmentRegister/V13/HospitalList",
                    "areaListStaticV1UI" => "AppointmentRegister/V13/HospitalInner",
                    "doctorStaticV1UI" => "AppointmentRegister/V13/HospitalDoctor",
                    "doctorDetailStaticV1UI" => "AppointmentRegister/V13/DoctorDetail",
                    "moreHospitalStaticV1UI" => "AppointmentRegister/V13/MoreHospital",
                )
            ),
            CARRIER_ID_CHONGQINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    // 静态预约挂号
                    "indexStaticV1UI" => "AppointmentRegister/V13/HospitalList",
                    "areaListStaticV1UI" => "AppointmentRegister/V13/HospitalInner",
                    "doctorStaticV1UI" => "AppointmentRegister/V13/HospitalDoctor",
                    "doctorDetailStaticV1UI" => "AppointmentRegister/V13/DoctorDetail",
                    "moreHospitalStaticV1UI" => "AppointmentRegister/V13/MoreHospital",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    // 静态预约挂号
                    "indexStaticV1UI" => "AppointmentRegister/V20/HospitalList",
                    "areaListStaticV1UI" => "AppointmentRegister/V20/HospitalInner",
                    "doctorStaticV1UI" => "AppointmentRegister/V20/HospitalDoctor",
                    "doctorDetailStaticV1UI" => "AppointmentRegister/V20/DoctorDetail",
                    "moreHospitalStaticV1UI" => "AppointmentRegister/V20/MoreHospital",
                )
            ),
            CARRIER_ID_GUANGXIDX => array( // 广西电信epg
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "AppointmentRegister/V0/index",
                )
            ),

            /**************** apk平台配置 ****************/
            CARRIER_ID_DEMO4 => array(
                self::DEFAULT_PAGE_CONF => array(
                    // 静态预约挂号
                    "indexStaticV1UI" => "AppointmentRegister/V20/HospitalList",
                    "areaListStaticV1UI" => "AppointmentRegister/V20/HospitalInner",
                    "doctorStaticV1UI" => "AppointmentRegister/V20/HospitalDoctor",
                    "doctorDetailStaticV1UI" => "AppointmentRegister/V20/DoctorDetail",
                    "moreHospitalStaticV1UI" => "AppointmentRegister/V20/MoreHospital",
                )
            ),

            CARRIER_ID_GUANGXIGD_APK => array( // 广西广电apk
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "AppointmentRegister/V0/index",
                )
            ),

            CARRIER_ID_DEMO7 => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "AppointmentRegister/V10/HospitalIndex",
                    "hospitalDetailV10UI" => "AppointmentRegister/V10/HospitalDetail",
                    "departmentV10UI" => "AppointmentRegister/V10/Department",
                    "doctorListV10UI" => "AppointmentRegister/V10/DoctorList",
                    "appointmentTimeV10UI" => "AppointmentRegister/V10/AppointmentTime",
                    "doctorDetailV10UI" => "AppointmentRegister/V10/DoctorDetail",
                    "reservationAddV10UI" => "AppointmentRegister/V10/ReservationAdd",
                    "patientSelectionV10UI" => "AppointmentRegister/V10/PatientSelection",
                    "patientEditorV10UI" => "AppointmentRegister/V10/PatientEditor",
                    "reservationRuleV10UI" => "AppointmentRegister/V10/ReservationRule",
                    "paymentOrderV10UI" => "AppointmentRegister/V10/PaymentOrder",
                    "phoneCodeV10UI" => "AppointmentRegister/V10/PhoneCode",
                    "guideV10UI" => "AppointmentRegister/V10/guide",
                    "registeredRecordV10UI" => "AppointmentRegister/V10/RegisteredRecord",
                    "registrationDetailsV10UI" => "AppointmentRegister/V10/RegistrationDetails",
                    "createCodeV10UI" => "AppointmentRegister/V10/CreateCode",
                )
            ),
            CARRIER_ID_CHINAUNICOM_MOFANG_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    // 静态预约挂号
                    "indexStaticV1UI" => "AppointmentRegister/V20/HospitalList",
                    "areaListStaticV1UI" => "AppointmentRegister/V20/HospitalInner",
                    "doctorStaticV1UI" => "AppointmentRegister/V20/HospitalDoctor",
                    "doctorDetailStaticV1UI" => "AppointmentRegister/V20/DoctorDetail",
                    "moreHospitalStaticV1UI" => "AppointmentRegister/V20/MoreHospital",
                )
            ),
        );
        return $pagePaths;
    }

    /**
     * 预约挂号的数据通过管理后台动态配置
     * @return \string[][] 具体的页面路由配置
     */
    private function _getPageOfConfigData(){
        return array(
            self::DEFAULT_PAGE_CONF => array(
                // 静态预约挂号
                "indexStaticV1UI" => "AppointmentRegister/V16/HospitalList",
                "areaListStaticV1UI" => "AppointmentRegister/V16/HospitalInner",
                "doctorStaticV1UI" => "AppointmentRegister/V16/HospitalDoctor",
                "doctorDetailStaticV1UI" => "AppointmentRegister/V16/DoctorDetail",
                "moreHospitalStaticV1UI" => "AppointmentRegister/V16/MoreHospital",
            )
        );
    }

    /**
     * 获取默认前端路由
     * @return string[]
     */
    public function getDefaultPageConf() {
        return array(
            "indexV1UI" => "AppointmentRegister/V1/HospitalList",
            "detailV1UI" => "AppointmentRegister/V1/HospitalDetail",
            "areaListV1UI" => "AppointmentRegister/V1/AreaList",
            "recordV1UI" => "AppointmentRegister/V1/RegisteredRecord",
            "recordDetailV1UI" => "AppointmentRegister/V1/RegisteredDetail",
            "moreRecordV1UI" => "AppointmentRegister/V1/MoreRecord",
            "appointmentUI" => "AppointmentRegister/V220094/appointment",
            // 静态预约挂号
            "indexStaticV1UI" => "AppointmentRegister/V13/HospitalList",
            "areaListStaticV1UI" => "AppointmentRegister/V13/HospitalInner",
            "doctorStaticV1UI" => "AppointmentRegister/V13/HospitalDoctor",
            "doctorDetailStaticV1UI" => "AppointmentRegister/V13/DoctorDetail",
            "moreHospitalStaticV1UI" => "AppointmentRegister/V13/MoreHospital",

            //新疆挂号相关
            "indexV8UI" => "AppointmentRegister/V8/index",
            "indexHospitalV8UI" => "AppointmentRegister/V8/hospital",
            "indexHospitalIntroV8UI" => "AppointmentRegister/V8/hospitalIntroDetail",
            "indexOrderDoctorV8UI" => "AppointmentRegister/V8/orderDoctor",
            "indexAddOrderV8UI" => "AppointmentRegister/V8/addOrder",
            "indexChoosePeopleV8UI" => "AppointmentRegister/V8/choosePeople",
            "indexPeopleInfoV8UI" => "AppointmentRegister/V8/peopleInfo",
            "indexFinalAddInfoV8UI" => "AppointmentRegister/V8/finalAddInfo",
            'indexOrderSuccessV8UI' => "AppointmentRegister/V8/orderSuccess",
            'indexOrderListV8UI' => "AppointmentRegister/V8/orderList",
            'indexCancelOrderV8UI' => "AppointmentRegister/V8/cancelOrder"
        );
    }
}