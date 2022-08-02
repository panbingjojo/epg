<?php
/**
 * Created by longmaster.
 * Date: 2019-01-31
 * Time: 14:22
 * Brief: 此文件（或类）用于处理 山东电信 的特殊配置
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
    
    /** 订购模块 */
    'payInfo' => '/Home/Pay/payInfo',                                     // 订购信息显示界面
    'orderCallback' => '/Home/Pay/payCallback',                            // 订购结果回调
    'doctorRecordHomeV2' => '/Home/DoctorP2PRecord/recordHomeV2',          // 问诊记录 - 记录主页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCall',                        // 视频问诊 - 呼叫页面
    
    /** 预约挂号页面 */
    'appointmentRegister' => '/Home/Main/orderRegisterV7',              // 医院列表页
    
    /** 挽留页增加跳转健康生活 */
    'healthLive' => '/Home/Hold/healthLiveV1',
    
    /** 我的家模块 */
    'familyIndex' => '/Home/Family/myHomeV2',                              // 我的家 - 主页
    'familyHome' => '/Home/Family/myHomeV2',                              // 我的家 - 主页
    'familyMembersEditor' => '/Home/Family/familyMembersEditorV1',        // 我的家 - 家庭成员编辑
    'familyMembersAdd' => '/Home/Family/familyMembersAddV1',              // 我的家 - 家庭成员添加
    'familyAbout' => '/Home/Family/aboutV1',                              // 我的家 - 关于我们
  
    /** 在线问医模块 */
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                   // 视频问诊首页
    'doctorDepartment' => '/Home/DoctorP2P/doctorDepartmentV13',         // 视频问诊 - 医生科室选择页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV13',               // 视频问诊 - 医生详情页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                    // 视频问诊 - 小程序问诊页面
    
    /** 问诊记录模块 */
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',      // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',     // 问诊记录 - 记录归档页
    
    /** 家庭成员模块 */
    'familyEdit'=>'/Home/Family/myHomeV2',
    'familyMembersEdit'=>'/Home/Family/familyMembersAddEditV1',

    'expertRecordSuccess' => '/Home/ExpertRecord/expertRecordSuccess',    // 问专家记录 - 预约成功
    'expertRecordBridge' => '/Home/ExpertRecord/expertRecordBridge',      // 问专家记录 -  
   
     /** 数据归档 */
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13',
    'payShowResult' => '/Home/Pay/payShowResult',                          // 订购结果显示
   
);");

define('COMMON_IMGS_VIEW', "V9");     //使用的公用图片套装