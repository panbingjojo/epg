<?php
/**
 * Created by longmaster.
 * Date: 2018-08-31
 * Time: 14:00
 * Brief: 此文件（或类）用于配置路由跳转映射
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    /** 主页模块 */
    'home' => '/Home/Main/homeV7',                                        // 主页 - 推荐页

    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                     // 视频问诊首页
    'doctorDepartment' => '/Home/DoctorP2P/doctorDepartmentV13',           // 视频问诊 - 医生科室选择页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV13',                 // 视频问诊 - 医生详情页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                      // 视频问诊 - 小程序问诊页面
 
     /** 视频问专家模块 */
    'expertIndex' => '/Home/Expert/expertIndexV13',                          // 视频问专家 - 首页
    'expertItem' => '/Home/Expert/expertItemV13',                            // 视频问专家 - 问专家医生列表页
    'expertDetail' => '/Home/Expert/expertDetailV13',                        // 视频问专家 - 专家详情页
    'expertDepartment' => '/Home/Expert/expertDepartmentV13',                // 视频问专家 - 部门选择页
    'expertSuccess' => '/Home/Expert/expertSuccessV13',                      // 视频问专家 - 预约成功页

    'orderVip' => '/Home/Pay/orderVip',                                   // 退订-用户不是vip-订购页
    'hadOrderVip' => '/Home/Pay/HadOrderVip',                             // 说明用户已经是VIP
    'unsubscribeVip' => '/Home/Pay/unsubscribeVip',                       // 退订-用户是vip-退订页
    'secondUnsubscribeVip' => '/Home/Pay/secondUnsubscribeVip',           // 退订-二次确定退订页
    'unsubscribeResult' => '/Home/Pay/unsubscribeResult',                 // 退订-结果页面
    'unPayCallback' => '/Home/Pay/unPayCallback',                         // 退订结果回调
    'orderProductList' => '/Home/Pay/queryOrderProductList',              // 用户订购商品记录页
    'payLockVerifyResult' => '/Home/Pay/payLockVerifyResult',             // 童锁校验回调地址
    'payUnifiedAuthResult' => '/Home/Pay/payUnifiedAuthResult',           // 统一鉴权校验回调地址
    'payShowResult' => '/Home/Pay/payShowResult',                         // 订购结果显示界面
    
     /** 订购模块 */
    'tempPayPage' => '/Home/Pay/tempPayPage',                             // 临时的订购选择页
    
    'custom' => '/Home/Custom/customV1',                     // 自定义背景图
    'searchOrder' => '/Home/Pay/searchOrder',           // 查询及退订                   
    'dateMark' => '/Home/DateMark/indexV1',           // 签到 - 主页
    'lottery' => '/Home/DateMark/lotteryV1',           // 签到 - 抽奖页 
    
    /**更多视频（视频集）*/
    'channelIndex'=>'/Home/Channel/channelIndexV13',                 // 一级视频页面
    'secondChannelIndex'=>'/Home/Channel/secondChannelIndexV13',     // 二级视频页面
    'channelList'=>'/Home/Channel/videoListV13',
    
    /*我的模块*/
    'collect'=>'/Home/Collect/indexV1',
    'playRecord'=>'/Home/Channel/historyPlayV1',
    'familyEdit'=>'/Home/Family/myHomeV2',
    'familyMembersEdit'=>'/Home/Family/familyMembersAddEditV1',
    'seekOnLineRecord'=>'/Home/DoctorP2P/doctorCommentV13',
    'orderExpertRecord'=>'/Home/Channel/historyPlayV1',
    'debook'=>'/Home/Pay/searchOrder',
    
    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',
     'appointmentRegister' => '/Home/AppointmentRegister/indexV1',            // 预约挂号
    
    /** 问诊记录模块 */
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',       // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',     // 问诊记录 - 记录归档页 
    
    /** 视频问专家记录模块 */
    'expertRecordHome' => '/Home/ExpertRecord/expertRecordHomeV13',          // 问专家记录 - 记录主页
    'expertCase' => '/Home/ExpertRecord/expertCase',                      // 问专家记录 - 病例页
    'expertAdvice' => '/Home/ExpertRecord/expertAdvice',                  // 问专家记录 - 
    'expertRecordSuccess' => '/Home/ExpertRecord/expertRecordSuccess',    // 问专家记录 - 预约成功
    'expertRecordBridge' => '/Home/ExpertRecord/expertRecordBridge',      // 问专家记录 -  
    
    /** 帮助 */
    'helpIndex' => '/Home/Help/helpV1',
    
    /** 静态夜间药房 */
    'nightPharmacy' => '/Home/AppointmentRegister/nightPharmacyV13',

    /** 静态预约挂号 */
    'indexStatic' => '/Home/AppointmentRegister/indexStaticV1',               
    'areaListStatic' => '/Home/AppointmentRegister/areaListStaticV1',                
    'doctorStatic' => '/Home/AppointmentRegister/doctorStaticV1',                
    'doctorDetailStatic' => '/Home/AppointmentRegister/doctorDetailStaticV1',                
    'moreHospitalStatic' => '/Home/AppointmentRegister/moreHospitalStaticV1',
    
    /** 我的家模块 */
    'familyIndex' => '/Home/Family/myHomeV2',                              // 我的家 - 主页
    'familyHome' => '/Home/Family/myHomeV2',                              // 我的家 - 主页
    'familyMembersEditor' => '/Home/Family/familyMembersEditorV1',        // 我的家 - 家庭成员编辑
    'familyMembersAdd' => '/Home/Family/familyMembersAddV1',              // 我的家 - 家庭成员添加
    'familyAbout' => '/Home/Family/aboutV1',                              // 我的家 - 关于我们     
    
    /** 订购模块 */
    'payInfo' => '/Home/Pay/payInfo',                                     // 订购信息显示界面
    'orderCallback' => '/Home/Pay/payCallback',                            // 订购结果回调
    'doctorRecordHomeV2' => '/Home/DoctorP2PRecord/recordHomeV2',          // 问诊记录 - 记录主页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCall',                        // 视频问诊 - 呼叫页面
    
    /** 健康视频 */
    'healthVideoList' => '/Home/HealthVideo/videoListV10',                              // 健康视频首页
    'healthVideoSet' => '/Home/HealthVideo/videoSetV10',                              // 健康视频连续剧
    'gym' => '/Home/CommunityHospital/gym',                              // 健康视频连续剧
    'fifthHospital' => '/Home/CommunityHospital/fifthHospital',
    'hospitalPackage' => '/Home/CommunityHospital/hospitalPackage',
);");


define('COMMON_IMGS_VIEW', "V1");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V2'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V2'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式