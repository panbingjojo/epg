<?php
/**
 * Created by longmaster
 * Brief: 中国联通EPG
 */

/**
 * 注册系统中的页面, 进行路由配置
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

     /** 在线问医模块 */
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV11',                     // 视频问诊首页
    'doctorDepartment' => '/Home/DoctorP2P/doctorDepartmentV10',           // 视频问诊 - 医生科室选择页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV10',                 // 视频问诊 - 医生详情页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                      // 视频问诊 - 呼叫页面
    'AppletsQrCode' => '/Home/DoctorP2P/AppletsQrCode',                     // 小程序二维

    /** 问诊记录模块 */
    'doctorRecordHome' => '/Home/DoctorP2PRecord/recordHomeV10',           // 问诊记录 - 记录主页
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',       // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',      // 问诊记录 - 记录归档页
    'recordArchive' => '/Home/DoctorP2PRecord/recordArchiveV10',           // 问诊记录 - 选择家庭成员进行归档
    
    /** 我的家模块 */
    'familyIndex' => '/Home/Family/myHomeV2',                              // 我的家 - 主页
    'familyHome' => '/Home/Family/myHomeV2',                               // 我的家 - 主页
    'familyMembersEditor' => '/Home/Family/familyMembersEditorV1',         // 我的家 - 家庭成员编辑
    'familyMembersAdd' => '/Home/Family/familyMembersAddV1',               // 我的家 - 家庭成员添加
    'familyAbout' => '/Home/Family/aboutV1',                               // 我的家 - 关于我们
    
    /** 订购模块 */
    'payInfo' => '/Home/Pay/payInfo',                                      // 订购信息显示界面
    'orderCallback' => '/Home/Pay/payCallback',                            // 订购结果回调
    
    /** 预约挂号页面 */
    'appointmentRegister' => '/Home/Main/orderRegisterV7',                           // 医院列表页
    //'appointmentRegisterHospitalDetail' => '/Home/AppointmentRegister/detailV2',            // 医院详情页
    //'appointmentRegisterHospitalIntroduce' => '/Home/AppointmentRegister/introduceV2',      // 医院介绍页
    //'appointmentSubjectList' => '/Home/AppointmentRegister/subjectV2',                      // 科室表页
    //'appointmentDoctorList' => '/Home/AppointmentRegister/doctorV2',                        // 科室表页

    /** 健康视频 */
    'healthVideoList' => '/Home/HealthVideo/videoListV10',                 // 健康视频首页
    'healthVideoSet' => '/Home/HealthVideo/videoSetV10',                   // 健康视频连续剧
    'gym' => '/Home/CommunityHospital/gym',                                // 健康视频连续剧
    'fifthHospital' => '/Home/CommunityHospital/fifthHospital',
    'hospitalPackage' => '/Home/CommunityHospital/hospitalPackage',

    /** 图文栏目 */
    'graphicColumn'=>'/Home/GraphicColumn/graphicColumn',

    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',

    'introVideo-detail' => '/Home/IntroVideo/detailV2',                     // 单个视频简介 
);");

define('COMMON_IMGS_VIEW', "V6");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V4'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V0'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
define('COMMON_SPLASH_INTENT_TYPE', '2'); // 欢迎页到专辑和活动的跳转模式