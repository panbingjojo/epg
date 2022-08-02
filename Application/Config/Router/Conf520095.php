<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放贵州广电特有路由配置，它在应用运行时，将会与DefaultConf里的配置进行合并，
 *        并且会覆盖掉原来同名的配置。
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    'home' => '/Home/Main/homeV13',
    
    'directPay' => '/Home/Pay/directPay',
    'submitPhone' => '/Home/Pay/submitPhone',
    
    /** 在线问诊模块 */    
    'doctorDepartment' => '/Home/DoctorP2P/doctorDepartmentV10',           // 视频问诊 - 医生科室选择页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV10',                 // 视频问诊 - 医生详情页
    
    /** 问诊记录模块 */
    'doctorRecordHome' => '/Home/DoctorP2PRecord/recordHomeV10',           // 问诊记录 - 记录主页
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV10',       // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV10',     // 问诊记录 - 记录归档页
    'recordArchive' => '/Home/DoctorP2PRecord/recordArchiveV10',           // 问诊记录 - 选择家庭成员进行归档
    
    /** 我的家模块 */
    'familyHome' => '/Home/Family/myHomeV2',                              // 我的家 - 主页
    'familyMembersEditor' => '/Home/Family/familyMembersEditorV1',        // 我的家 - 家庭成员编辑
    'familyMembersAdd' => '/Home/Family/familyMembersAddV1',              // 我的家 - 家庭成员添加
    'familyAbout' => '/Home/Family/aboutV1',                              // 我的家 - 关于我们
    
    /** 健康视频 */
     'healthVideoList' => '/Home/HealthVideo/videoListV10',               // 健康视频首页
     'healthVideoSet' => '/Home/HealthVideo/videoSetV10',                 // 健康视频连续剧
    
    /** 39互联网医院 */
    'new39hospital' => '/Home/Hospital39/indexV10',                 // 首页--老版
    'Hospital39Home' => '/Home/Hospital39/HomeV10',                 // 首页模块
    'Hospital39Expert' => '/Home/Hospital39/ExpertV10',             // 大专家模块
    'Hospital39Guide' => '/Home/Hospital39/GuideV10',               // 就诊指南模块
    'Hospital39Case' => '/Home/Hospital39/CaseV10',                 // 病例资料模块
    'Hospital39Consult' => '/Home/Hospital39/ConsultV10',           // 立即咨询模块
    
    /** 订购模块 */
    'payShowResult' => '/Home/Pay/payShowResult',                         // 订购结果显示界面
    'payInfo' => '/Home/Pay/payInfo',                                     // 订购信息显示界面
    'directPay' => '/Home/Pay/directPay',                                 // 订购直接支付通过本地post的方式
    'orderCallback' => '/Home/Pay/payCallback',                           // 订购结果回调
    'asyncOrderCallback' => '/Home/Pay/asyncCallBack',                    // 异步结果回调

    /** 预约挂号页面 */
    'appointmentRegister' => '/Home/AppointmentRegister/indexV1',                      // 医院列表页
    'appointmentRegisterHospitalDetial' => '/Home/AppointmentRegister/detailV1',       // 医院详情页
    'appointmentRegisterAreaList' => '/Home/AppointmentRegister/areaListV1',           // 地区列表页
    'appointmentRegisterRecord' => '/Home/AppointmentRegister/recordV1',               // 挂号记录列表页
    'appointmentRegisterRecordDetail' => '/Home/AppointmentRegister/recordDetailV1',   // 挂号记录详情页
    'appointmentRegisterRecordMoreRecord' => '/Home/AppointmentRegister/moreRecordV1', // 更多挂号记录页
    
    /** 预约挂号 */
    'hospitalDetail' => '/Home/AppointmentRegister/hospitalDetailV10',                 // 医院详情
    'departmentDetail' => '/Home/AppointmentRegister/departmentV10',                   // 医院部门详情
    'doctorList' => '/Home/AppointmentRegister/doctorListV10',                         // 医生列表
    'appointmentTime' => '/Home/AppointmentRegister/appointmentTimeV10',               // 医生预约时间
    'doctorDetail' => '/Home/AppointmentRegister/doctorDetailV10',                     // 医生详情
    'reservationAdd' => '/Home/AppointmentRegister/reservationAddV10',                 // 就诊信息添加
    'patientSelection' => '/Home/AppointmentRegister/patientSelectionV10',             // 选择就诊人
    'patientEditor' => '/Home/AppointmentRegister/patientEditorV10',                   // 编辑就诊人
    'reservationRule' => '/Home/AppointmentRegister/reservationRuleV10',               // 预约规则
    'paymentOrder' => '/Home/AppointmentRegister/paymentOrderV10',                     // 支付订单
    'phoneCode' => '/Home/AppointmentRegister/phoneCodeV10',                           // 手机扫码
    'guide' => '/Home/AppointmentRegister/guideV10',                                   // 手机引导
    'registeredRecord' => '/Home/AppointmentRegister/registeredRecordV10',             // 挂号记录
    'registrationDetails' => '/Home/AppointmentRegister/registrationDetailsV10',       // 挂号详情
    'createCode' => '/Home/AppointmentRegister/createCodeV10',                         // 手机填写信息 
    
    /** 检测记录 */
    'archivingList' => '/Home/DataArchiving/archivingListV10',                   // 数据归档
    'recordList' => '/Home/DataArchiving/recordListV10',                         // 检测记录
    'recordDetail' => '/Home/DataArchiving/recordDetailV10',                     // 归档
    'APKPlay' => '/Home/Player/APKPlay',                                         // 播放
    
);");

define('COMMON_IMGS_VIEW', "V1");     //使用的公用图片套装
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V4'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
