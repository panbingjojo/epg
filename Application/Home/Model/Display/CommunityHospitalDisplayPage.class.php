<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class CommunityHospitalDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "eyeHospitalUI" => "CommunityHospital/V630092/EyeHospital",
                    "communityIndexUI" => "CommunityHospital/V630092/CommunityIndex",
                    "communityDoctorUI" => "CommunityHospital/V630092/CommunityDoctor",
                    "expertDetailsUI" => "CommunityHospital/V630092/ExpertDetails",
                    "healthEducationListUI" => "CommunityHospital/V630092/HealthEducationList",
                    "expertListUI" => "CommunityHospital/V630092/ExpertList",
                    "departmentListUI" => "CommunityHospital/V630092/DepartmentList",
                    "departmentDetailsUI" => "CommunityHospital/V630092/DepartmentDetails",
                    "gymUI" => "CommunityHospital/V630092/Gym",
                    "fifthHospitalUI" => "CommunityHospital/V630092/FifthHospital",
                    "hospitalPackageUI" => "CommunityHospital/V630092/HospitalPackage",
                )
            ),

            CARRIER_ID_YBHEALTH => array(
                self::DEFAULT_PAGE_CONF => array(
                    "eyeHospitalUI" => "CommunityHospital/V630092/EyeHospital",
                    "communityIndexUI" => "CommunityHospital/V630092/CommunityIndex",
                    "communityDoctorUI" => "CommunityHospital/V630092/CommunityDoctor",
                    "expertDetailsUI" => "CommunityHospital/V630092/ExpertDetails",
                    "healthEducationListUI" => "CommunityHospital/V630092/HealthEducationList",
                    "expertListUI" => "CommunityHospital/V630092/ExpertList",
                    "departmentListUI" => "CommunityHospital/V630092/DepartmentList",
                    "departmentDetailsUI" => "CommunityHospital/V630092/DepartmentDetails",
                    "gymUI" => "CommunityHospital/V630092/Gym",
                    "fifthHospitalUI" => "CommunityHospital/V630092/FifthHospital",
                    "hospitalPackageUI" => "CommunityHospital/V630092/HospitalPackage",
                )
            ),

            CARRIER_ID_MANGOTV_LT => array(

                self::DEFAULT_PAGE_CONF => array(
                    "eyeHospitalUI" => "CommunityHospital/V630092/EyeHospital",
                    "communityIndexUI" => "CommunityHospital/V630092/CommunityIndex",
                    "communityDoctorUI" => "CommunityHospital/V630092/CommunityDoctor",
                    "expertDetailsUI" => "CommunityHospital/V630092/ExpertDetails",
                    "healthEducationListUI" => "CommunityHospital/V630092/HealthEducationList",
                    "expertListUI" => "CommunityHospital/V630092/ExpertList",
                    "departmentListUI" => "CommunityHospital/V630092/DepartmentList",
                    "departmentDetailsUI" => "CommunityHospital/V630092/DepartmentDetails",
                    "gymUI" => "CommunityHospital/V630092/Gym",
                    "fifthHospitalUI" => "CommunityHospital/V630092/FifthHospital",
                    "hospitalPackageUI" => "CommunityHospital/V630092/HospitalPackage",
                )
            ),

            CARRIER_ID_MANGOTV_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "eyeHospitalUI" => "CommunityHospital/V630092/EyeHospital",
                    "communityIndexUI" => "CommunityHospital/V630092/CommunityIndex",
                    "communityDoctorUI" => "CommunityHospital/V630092/CommunityDoctor",
                    "expertDetailsUI" => "CommunityHospital/V630092/ExpertDetails",
                    "healthEducationListUI" => "CommunityHospital/V630092/HealthEducationList",
                    "expertListUI" => "CommunityHospital/V630092/ExpertList",
                    "departmentListUI" => "CommunityHospital/V630092/DepartmentList",
                    "departmentDetailsUI" => "CommunityHospital/V630092/DepartmentDetails",
                    "gymUI" => "CommunityHospital/V630092/Gym",
                    "fifthHospitalUI" => "CommunityHospital/V630092/FifthHospital",
                    "hospitalPackageUI" => "CommunityHospital/V630092/HospitalPackage",
                )
            ),


            CARRIER_ID_NINGXIADX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "eyeHospitalUI" => "CommunityHospital/V640092/EyeHospital",
                    "communityIndexUI" => "CommunityHospital/V640092/CommunityIndex",
                    "communityDoctorUI" => "CommunityHospital/V640092/CommunityDoctor",
                    "expertDetailsUI" => "CommunityHospital/V640092/ExpertDetails",
                    "healthEducationListUI" => "CommunityHospital/V640092/HealthEducationList",
                    "expertListUI" => "CommunityHospital/V640092/ExpertList",
                    "departmentListUI" => "CommunityHospital/V640092/DepartmentList",
                    "departmentDetailsUI" => "CommunityHospital/V640092/DepartmentDetails",
                    "gymUI" => "CommunityHospital/V640092/Gym",
                    "fifthHospitalUI" => "CommunityHospital/V640092/FifthHospital",
                    "hospitalPackageUI" => "CommunityHospital/V640092/HospitalPackage",
                )
            ),
            
            CARRIER_ID_XINJIANGDX => array(
                'midong' => array(
                    "communityIndexUI" => "CommunityHospital/V650092/V2/CommunityIndex",
                ),
                self::DEFAULT_PAGE_CONF => array()
            )
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "communityIndexUI" => "CommunityHospital/V650092/CommunityIndex",
            "communityDoctorUI" => "CommunityHospital/V650092/CommunityDoctor",
            "expertDetailsUI" => "CommunityHospital/V650092/ExpertDetails",
            "healthEducationListUI" => "CommunityHospital/V650092/HealthEducationList",
            "expertListUI" => "CommunityHospital/V650092/ExpertList",
            "departmentListUI" => "CommunityHospital/V650092/DepartmentList",
            "departmentDetailsUI" => "CommunityHospital/V650092/DepartmentDetails",

            "bloodManageIndexUI" => "CommunityHospital/BloodManage/BloodManageIndex",
            "bloodDataUpUI" => "CommunityHospital/BloodManage/BloodDataUp",
            "addUserUI" => "CommunityHospital/BloodManage/AddUser",
            "membersListUI" => "CommunityHospital/BloodManage/MembersList",

        );
    }
}