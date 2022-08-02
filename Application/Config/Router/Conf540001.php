<?php
/**
 * Created by longmaster.
 * Date: 2019-01-31
 * Time: 14:22
 * Brief: 此文件（或类）用于处理 青海移动 的特殊配置
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    /** 主页模块 */
    'home' => '/Home/Main/homeV7',                                      // 主页 - 推荐页
    'menuTab' => '/Home/Main/menuTabV7',                                // 视频栏目，采用视图7
    'healthCare' => '/Home/Main/healthCareV7',                          // 保健模块 
    'nightMedicine' => '/Home/Main/nightMedicineV7',                    // 青海电信夜间药房
    'orderRegister' => '/Home/Main/orderRegisterV7',                    // 青海电信预约挂号
    'MenuTabLevelThree' => '/Home/Main/MenuTabLevelThreeV7',            // 视频列表

    /** 订购模块 */
    'orderCallback' => '/Home/Pay/payCallback',                         // 订购结果回调
    
    /** 预约挂号页面 */
    'appointmentRegister' => '/Home/Main/orderRegisterV7',                                    // 医院列表页
    //'appointmentRegisterHospitalDetail' => '/Home/AppointmentRegister/detailV2',            // 医院详情页
    //'appointmentRegisterHospitalIntroduce' => '/Home/AppointmentRegister/introduceV2',      // 医院介绍页
    //'appointmentSubjectList' => '/Home/AppointmentRegister/subjectV2',                      // 科室表页
    //'appointmentDoctorList' => '/Home/AppointmentRegister/doctorV2',                        // 科室表页
    
    /** 家庭档案模块 */
    'familyMemberHome' => '/Home/Family/myHomeV2',                          // 家庭成员首页
    'familyMembersEdit'=>'/Home/Family/familyMembersAddEditV1',
    
    /** 在线问诊模块 */
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                     // 视频问诊 - 医生列表
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV13',                 // 视频问诊 - 医生详情
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                      // 视频问诊 - 小程序问诊页面
    
    /** 问诊记录模块 */
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',       // 问医记录 - 记录详情
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',      // 问医记录 - 归档
    
    'testRecord' => '/Home/DataArchiving/testType',
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13',
    
    'collect'=>'/Home/Collect/indexV1',
);");