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
    'home' => '/Home/Main/homeV13',                                        // 主页 - 推荐页

    /** 在线问医模块 */ 
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                     // 视频问诊首页
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
    'testIndexV13' => '/Home/HealthTest/testIndexV13',                   //兼容旧版V13首页
    'imeiInput' => '/Home/HealthTest/imeiInputV13',                   
    'inputTestData' => '/Home/HealthTest/inputTestDataV8',
    'healthTestDetectionStep' => '/Home/HealthTest/waitStepV13',         // 检测引导步骤
    'testRecord' => '/Home/DataArchiving/testType',
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
    'weight-detail' => '/Home/DataArchiving/weightDetail',               // 体脂归档数据详情
    'weight-introduce' => '/Home/DataArchiving/weightIntroduce',         // 体脂归档数据评分
    'tz-step'=>'/Home/HealthTest/TZStep',     
    'tz-introduce'=>'/Home/HealthTest/introduceTZ',                      // 健康检测 - 主页           
    
    /**更多视频（视频集）*/
    'channelIndex'=>'/Home/Channel/channelIndexV13',
    'channelList'=>'/Home/Channel/videoListV13',
    
    /*我的模块*/
    'collect'=>'/Home/Collect/indexV1',
    'playRecord'=>'/Home/Channel/historyPlayV1',
    'familyEdit'=>'/Home/Family/myHomeV2',
    'familyMembersEdit'=>'/Home/Family/familyMembersAddEditV1',
    'debook'=>'/Home/Pay/searchOrder',
    'orderExpertRecord'=>'/Home/Channel/historyPlayV1',
    
    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',
    
    /** 问诊记录模块 */
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',       // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',      // 问诊记录 - 记录归档页
    
    /** 数据归档 */
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13',

    /** 视频问专家记录模块 */
    'expertRecordHome' => '/Home/ExpertRecord/expertRecordHomeV13',          // 问专家记录 - 记录主页
    'expertCase' => '/Home/ExpertRecord/expertCase',                      // 问专家记录 - 病例页
    'expertAdvice' => '/Home/ExpertRecord/expertAdvice',                  // 问专家记录 - 
    'expertRecordSuccess' => '/Home/ExpertRecord/expertRecordSuccess',    // 问专家记录 - 预约成功
    'expertRecordBridge' => '/Home/ExpertRecord/expertRecordBridge',      // 问专家记录 -  
    
    /** 预约挂号页面 */
    'appointmentRegister' => '/Home/AppointmentRegister/indexV1',                   // 医院列表页
    'appointmentRegisterHospitalDetial' => '/Home/AppointmentRegister/detailV1',    // 医院详情页
    'appointmentRegisterAreaList' => '/Home/AppointmentRegister/areaListV1',        // 地区列表页
    'appointmentRegisterRecord' => '/Home/AppointmentRegister/recordV1',            // 挂号记录列表页
    'appointmentRegisterRecordDetail' => '/Home/AppointmentRegister/recordDetailV1',          // 挂号记录详情页
    'appointmentRegisterRecordMoreRecord' => '/Home/AppointmentRegister/moreRecordV1',          // 更多挂号记录页
    
    /** 预约挂号 */
    'hospitalDetail' => '/Home/AppointmentRegister/hospitalDetailV10',            // 医院详情
    'departmentDetail' => '/Home/AppointmentRegister/departmentV10',            // 医院部门详情
    'doctorList' => '/Home/AppointmentRegister/doctorListV10',            // 医生列表
    'appointmentTime' => '/Home/AppointmentRegister/appointmentTimeV10',            // 医生预约时间
    'doctorDetail' => '/Home/AppointmentRegister/doctorDetailV10',            // 医生详情
    'reservationAdd' => '/Home/AppointmentRegister/reservationAddV10',            // 就诊信息添加
    'patientSelection' => '/Home/AppointmentRegister/patientSelectionV10',            // 选择就诊人
    'patientEditor' => '/Home/AppointmentRegister/patientEditorV10',            // 编辑就诊人
    'reservationRule' => '/Home/AppointmentRegister/reservationRuleV10',            // 预约规则
    'paymentOrder' => '/Home/AppointmentRegister/paymentOrderV10',            // 支付订单
    'phoneCode' => '/Home/AppointmentRegister/phoneCodeV10',            // 手机扫码
    'guide' => '/Home/AppointmentRegister/guideV10',            // 手机引导
    'registeredRecord' => '/Home/AppointmentRegister/registeredRecordV10',            // 挂号记录
    'registrationDetails' => '/Home/AppointmentRegister/registrationDetailsV10',            // 挂号详情
    'createCode' => '/Home/AppointmentRegister/createCodeV10',            // 手机填写信息 

    /** 帮助 */
    'helpIndex' => '/Home/Help/helpV1', 
    
    /**商城*/
    'store' => '/Home/Store/storeV1',
);");

// 暂时存放，后面修改机制
define('COMMON_IMGS_VIEW', "V2");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V1'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V2'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V1'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式