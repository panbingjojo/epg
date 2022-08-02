<?php
/**
 * Created by longmaster.
 * Date: 2019-01-31
 * Time: 14:22
 */

/**
 * 注册系统中的页面, 进行路由配置
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    /** 主页模块 */
    'home' => '/Home/Main/homeV13',                                    // 主页 - 推荐页

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
    'tempPayPage' => '/Home/Pay/tempPayPage',                             // 临时的订购选择页
    
    'custom' => '/Home/Custom/customV1',                                  // 自定义背景图
    'searchOrder' => '/Home/Pay/searchOrder',                             // 查询及退订                   
    'dateMark' => '/Home/DateMark/indexV1',                               // 签到 - 主页
    'lottery' => '/Home/DateMark/lotteryV1',                              // 签到 - 抽奖页
    
    /** 健康检测 */
    'testIndexV13' => '/Home/HealthTest/testIndexV13',                    // 兼容旧版V13首页
    'imeiInput' => '/Home/HealthTest/imeiInputV13',                   
    'inputTestData' => '/Home/HealthTest/inputTestDataV8',
    'healthTestDetectionStep' => '/Home/HealthTest/waitStepV13',          // 检测引导步骤 
    'testList' => '/Home/DataArchiving/testList',
    
     /*  新疆电信版 健康检测*/
     'testIndex'=>'/Home/HealthTest/index',                               // 健康检测 - 主页 
     'aal-imei'=>'/Home/HealthTest/imeiInputV8',                          // 健康检测 - 主页 
     'sg-blood'=>'/Home/HealthTest/code',                                 // 健康检测 - 主页 
     'introduce'=>'/Home/HealthTest/introduce',                           // 健康检测 - 主页 
     'st-introduce'=>'/Home/HealthTest/introduceST',                      // 健康检测 - 主页
     'xy-step'=>'/Home/HealthTest/XYStep',                                // 健康检测 - 主页
     'xt-step'=>'/Home/HealthTest/XTStep',                                // 健康检测 - 主页
     'inputTest'=>'/Home/HealthTest/inputTestDataV8',                     // 健康检测 - 主页
     'outIndex'=>'/Home/HealthTest/outIndex',                             // 健康检测 - 外部入口 
     'test-weight'=>'/Home/HealthTest/testWeightV8',                      // 体重检测 - 主页
     'weight-list' => '/Home/DataArchiving/weightList',                   // 体脂归档数据
     'wristList-wristband'=>'/Home/DataArchiving/wristList',              // 手环绑定
     'weight-detail' => '/Home/DataArchiving/weightDetail',               // 体脂归档数据详情
     'weight-introduce' => '/Home/DataArchiving/weightIntroduce',         // 体脂归档数据评分
     'tz-step'=>'/Home/HealthTest/TZStep',     
     'tz-introduce'=>'/Home/HealthTest/introduceTZ',                      // 健康检测 - 主页  
     'healthTestDetectionStep' => '/Home/HealthTest/detectionStepV10',    // 检测引导步骤
     'healthTestImeiInput' => '/Home/HealthTest/imeiInputV10',            // IMEI号输入  
     'familyEdit' => '/Home/Family/myHomeV2',                             // 我的家 - 家庭成员编辑
     'familyMembersEdit'=>'/Home/Family/familyMembersAddEditV1',
     'testRecord' => '/Home/DataArchiving/testType', 
     'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13', // 数据归档  
     'doctor-entrance' => '/Home/DoctorP2P/DoctorEntr',                   // 天翼问诊入口
     'common-doc'=>'/Hospital/Hospital/indexV1',
     'report-data' => 'Home/DataArchiving/reportData',    
     'bind-wristband'=>'/Home/HealthTest/bindWristband',                  // 手环绑定
     'intro-wristband'=>'/Home/HealthTest/introduceSH',                   // 手环绑定
     'step-wristband'=>'/Home/HealthTest/stepSH',                         // 手环绑定
     'step-hsDoctor'=>'/Home/HealthTest/stepHSDoctorSH',                  // 恒生博士医生 
     'stepCount-wristband'=>'/Home/DataArchiving/stepCountList',          // 步数
     'stepCountDetail-wristband'=>'/Home/DataArchiving/stepCountDetail',  // 步数
     'heartRateList-wristband'=>'/Home/DataArchiving/heartRateList',      // 心率
     'heartRateDetail-wristband'=>'/Home/DataArchiving/heartRateDetail',  // 心率
     'heartRateSport-wristband'=>'/Home/DataArchiving/heartRateSport',    // 运动心率
     'sleepList-wristband'=>'/Home/DataArchiving/sleepList',              // 睡眠
     'sleepDetail-wristband'=>'/Home/DataArchiving/sleepDetail',          // 睡眠
     'sportList-wristband'=>'/Home/DataArchiving/sportList',              // 运动
     'sportDetail-wristband'=>'/Home/DataArchiving/sportDetail',          // 详情
     'sportEqDetail-wristband'=>'/Home/DataArchiving/sportEqDetail',      // 详情  
        
    /**更多视频（视频集）*/
    'channelIndex'=>'/Home/Channel/channelIndexV13',
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
    
    /** 问诊记录模块 */
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',       // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',     // 问诊记录 - 记录归档页
    
    /** 数据归档 */
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13',
    
    /** 帮助 */
    'helpIndex' => '/Home/Help/helpV1',
    
    /**商城*/
    'store' => '/Home/Store/storeV1',
    
    /** 预约挂号模块 */
    'appointmentRegister' => '/Home/AppointmentRegister/indexV1',            //预约挂号主界面
     
    /** 静态预约挂号 */
    'indexStatic' => '/Home/AppointmentRegister/indexStaticV1',               
    'areaListStatic' => '/Home/AppointmentRegister/areaListStaticV1',                
    'doctorStatic' => '/Home/AppointmentRegister/doctorStaticV1',                
    'doctorDetailStatic' => '/Home/AppointmentRegister/doctorDetailStaticV1',                
    'moreHospitalStatic' => '/Home/AppointmentRegister/moreHospitalStaticV1', 
    
    /**  健康提醒模块 */
    'healthRemind' => '/Home/HealthRemind/healthRemindV1',
);");

// 暂时存放，后面修改机制
define('COMMON_IMGS_VIEW', "V2");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V1'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V2'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V1'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式