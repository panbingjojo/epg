<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放江苏电信特有路由配置，它在应用运行时，将会与DefaultConf里的配置进行合并，
 *        并且会覆盖掉原来同名的配置。
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */

define("SPECIAL_VIEW_PAGES", "return array(
    /** 主页模块 */
    'home' => '/Home/Main/homeV13',                                        // 主页 - 推荐页
    
    /** 在线问医模块 */ 
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                     // 视频问诊首页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV13',                 // 视频问诊 - 医生详情页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                      // 视频问诊 - 小程序问诊页面
    
    /** 静态预约挂号 */
    'indexStatic' => '/Home/AppointmentRegister/indexStaticV1',               
    'areaListStatic' => '/Home/AppointmentRegister/areaListStaticV1',                
    'doctorStatic' => '/Home/AppointmentRegister/doctorStaticV1',                
    'doctorDetailStatic' => '/Home/AppointmentRegister/doctorDetailStaticV1',                
    'moreHospitalStatic' => '/Home/AppointmentRegister/moreHospitalStaticV1',
    
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
    /**************新疆旧有模式******************************    
    //    'home' => '/Home/Main/homeV2',                                        // 主页 - 推荐页
    //    'homeTab1' => '/Home/Main/homeTab1V2',                                // 主页 - 老年保健
    //    'homeTab2' => '/Home/Main/homeTab2V2',                                // 主页 - 宝贝指南
    //    'homeTab3' => '/Home/Main/homeTab3V2',                                // 主页 - 女性宝典
    //    'homeTab4' => '/Home/Main/homeTab4V2',                                // 主页 - 健康百科
    ********************************************/
    
    /** 订购模块 */
    'orderCallback' => '/Home/Pay/payCallback',                           // 订购结果回调
    'asyncOrderCallback' => '/Home/Pay/asyncCallBack',                    // 异步结果回调
    'directPay' => '/Home/Pay/directPay',                                 // 订购直接支付通过本地post的方式
    
    'channelIndex' => 'Home/Channel/channelIndexV13',
    
    /** 帮助 */
    'helpIndex' => '/Home/Help/helpV1',
    
    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',
    
    /** 退出挽留页 */
    'hold' => '/Home/Hold/indexV1',                                       // 退出挽留页
    'channelList'=>'/Home/Channel/videoListV13',
    
    /** 健康检测 */
    'testIndex' => '/Home/HealthTest/Index',
    'imeiInput' => '/Home/HealthTest/imeiInputV13',                   
    'inputTestData' => '/Home/HealthTest/inputTestDataV13',
    'testRecord' => '/Home/DataArchiving/testType',
    'healthTestDetectionStep' => '/Home/HealthTest/waitStepV13',           // 检测引导步骤
    'report-data-bat' => '/Home/DataArchiving/reportDataBat',
    
    /** 数据归档 */
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13',     
        
    /** 问诊记录 */
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',       // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',      // 问诊记录 - 记录归档页
     
    /***************************  新疆挂号相关  *********************************/
    'xinjiang-reservation' => '/Home/AppointmentRegister/indexV8',                       // 新疆预约首页
    'xinjiang-hospital' => '/Home/AppointmentRegister/indexHospitalV8',                  // 新疆医院医生列表
    'xinjiang-hospital-intro'=> '/Home/AppointmentRegister/indexHospitalIntroV8',        // 新疆医院介绍
    'xinjiang-doctor-order'=> '/Home/AppointmentRegister/indexOrderDoctorV8',            // 新疆医院医生挂号信息
    'xinjiang-add-order'=> '/Home/AppointmentRegister/indexAddOrderV8',                  // 添加订单
    'xinjiang-choose-people' => '/Home/AppointmentRegister/indexChoosePeopleV8',         // 选择就诊人
    'xinjiang-people-info' =>'/Home/AppointmentRegister/indexPeopleInfoV8',              // 添加or编辑就诊人
    'xinjiang-final-add' => '/Home/AppointmentRegister/indexFinalAddInfoV8',             // 最后添加信息,提交
    'xinjiang-order-success' => '/Home/AppointmentRegister/indexOrderSuccessV8',         // 预约成功
    'xinjiang-order-list'=>'/Home/AppointmentRegister/indexOrderListV8',                 // 订单列表
    'xinjiang-order-cancel'=>'/Home/AppointmentRegister/indexCancelOrderV8',             // 取消订单
);");

//      'testRecord' => '/Home/DataArchiving/recordDetailV10',

//define('COMMON_IMGS_VIEW', "V1");     //使用的公用图片套装
//define('COMMON_ACTIVITY_VIEW', 'V2'); // 活动页面的模块
//define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
//define('COMMON_PLAYER_VIEW', 'V7'); // 使用播放器的模式
//define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式

// 暂时存放，后面修改机制
define('COMMON_IMGS_VIEW', "V2");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V1'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V2'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V7'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
