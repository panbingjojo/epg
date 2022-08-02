<?php
/**
 * Created by longmaster.
 * Date: 2019-01-31
 * Time: 14:22
 * Brief: 此文件（或类）用于处理广东广电的特殊配置
 */

/**
 * 注册系统中的页面, 进行路由配置
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
   /** 主页模块 */
    'home' => '/Home/Main/homeV13',                                        // 主页 - 推荐页

    /** 在线问医模块 */ 
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                     // 视频问诊首页
    'doctorDepartment' => '/Home/DoctorP2P/doctorDepartmentV13',           // 视频问诊 - 医生科室选择页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV13',                 // 视频问诊 - 医生详情页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                      // 视频问诊 - 小程序问诊页面

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
    'directPay' => '/Home/Pay/directPay',                                 // 临时的订购选择页
    
    'custom' => '/Home/Custom/customV1',                                  // 自定义背景图
    'searchOrder' => '/Home/Pay/searchOrder',                             // 查询及退订                   
    'dateMark' => '/Home/DateMark/indexV1',                               // 签到 - 主页
    'lottery' => '/Home/DateMark/lotteryV1',                              // 签到 - 抽奖页
    
    /** 健康检测 */
    'testIndex'=>'/Home/HealthTest/index',                               // 健康检测 - 主页 
    'aal-imei'=>'/Home/HealthTest/imeiInputV8',                          // 健康检测 - 输入设备号 
    'sg-blood'=>'/Home/HealthTest/code',                                 // 健康检测 -  
    'introduce'=>'/Home/HealthTest/introduce',                           // 健康检测 - 简介
    'st-introduce'=>'/Home/HealthTest/introduceST',                      // 健康检测 - 血糖简介
    'tz-introduce'=>'/Home/HealthTest/introduceTZ',                      // 健康检测 - 体脂简介
    'xy-step'=>'/Home/HealthTest/XYStep',                                // 健康检测 - 血氧测量步骤
    'xt-step'=>'/Home/HealthTest/XTStep',                                // 健康检测 - 血糖测量步骤
    'tz-step'=>'/Home/HealthTest/TZStep',                                // 健康检测 - 体脂测量步骤
    'inputTest'=>'/Home/HealthTest/inputTestDataV8',                     // 健康检测 - 数据手动输入
    'outIndex'=>'/Home/HealthTest/outIndex',                             // 健康检测 - 外部入口 
    'test-weight'=>'/Home/HealthTest/testWeightV8',                      // 体重检测 - 主页
    
    /**更多视频（视频集）*/
    'channelIndex'=>'/Home/Channel/channelIndexV13',                     // 一级视频页面
    'secondChannelIndex'=>'/Home/Channel/secondChannelIndexV13',         // 二级视频页面
    'channelList'=>'/Home/Channel/videoListV13',
    
    /*我的模块*/
    'collect'=>'/Home/Collect/indexV1',
    'playRecord'=>'/Home/Channel/historyPlayV1',
    'familyEdit'=>'/Home/Family/myHomeV2',
    'familyMembersEdit'=>'/Home/Family/familyMembersAddEditV1',
    'orderExpertRecord'=>'/Home/Channel/historyPlayV1',
    'debook'=>'/Home/Pay/searchOrder',
    
    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',
    
    /** 问诊记录模块 */
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',      // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',     // 问诊记录 - 记录归档页
    
    /** 数据归档 */
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13',
    'testRecord' => '/Home/DataArchiving/testType',
    'testList' => '/Home/DataArchiving/testList',
    'weight-list' => '/Home/DataArchiving/weightList',                    // 数据归档 -- 体脂
    'weight-detail' => '/Home/DataArchiving/weightDetail',                // 数据归档 -- 体脂详情
    'weight-introduce' => '/Home/DataArchiving/weightIntroduce',          // 数据归档 -- 体脂评分
    
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
               
    /** 挽留页增加跳转健康生活 */
    'healthLive' => '/Home/Hold/healthLiveV1',
               
);");

// 暂时存放，后面修改机制
define('COMMON_IMGS_VIEW', "V2");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V1'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V2'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V1'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式