<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放中国联通特有路由配置，它在应用运行时，将会与DefaultConf里的配置进行合并，
 *        并且会覆盖掉原来同名的配置。
 */

/**
 * 注册系统中的页面, 进行路由配置
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    /** 主页模块 */
    'home' => '/Home/Main/homeV2',                                        // 主页 - 推荐页
    'homeTab1' => '/Home/Main/homeTab1V2',                                // 主页 - 老年保健
    'homeTab2' => '/Home/Main/homeTab2V2',                                // 主页 - 宝贝指南
    'homeTab3' => '/Home/Main/homeTab3V2',                                // 主页 - 女性宝典
    'homeTab4' => '/Home/Main/homeTab4V2',                                // 主页 - 健康百科

    'orderVip' => '/Home/Pay/orderVip',                                   // 退订-用户不是vip-订购页
    'hadOrderVip' => '/Home/Pay/HadOrderVip',                             // 说明用户已经是VIP
    'unsubscribeVip' => '/Home/Pay/unsubscribeVip',                       // 退订-用户是vip-退订页
    'secondUnsubscribeVip' => '/Home/Pay/secondUnsubscribeVip',           // 退订-二次确定退订页
    'unsubscribeResult' => '/Home/Pay/unsubscribeResult',                 // 退订-结果页面
    'unPayCallback' => '/Home/Pay/unPayCallback',                         // 退订结果回调
    'orderProductList' => '/Home/Pay/queryOrderProductList',              // 用户订购商品记录页
    'payShowResult' => '/Home/Pay/payShowResult',                         // 订购结果显示界面
    
     /** 订购模块 */
    'tempPayPage' => '/Home/Pay/tempPayPage',                             // 临时的订购选择页
    
    /** 健康检测 */
    'healthTestIMEIInput' => '/Home/HealthTest/imeiInputV1',              // IMEI号输入
    'healthTestInputData' => '/Home/HealthTest/inputDataV1',              // 检测数据输入
    'healthTestDetectionStep' => '/Home/HealthTest/detectionStepV1',      // 检测引导步骤
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV1',   // 数据归档
    'testIndexThree' => '/Home/HealthTest/testIndexV13',
    
     /** 视频在线问诊 */
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                     // 视频问诊首页
    'doctorDepartment' => '/Home/DoctorP2P/doctorDepartmentV13',           // 视频问诊 - 医生科室选择页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV13',                 // 视频问诊 - 医生详情页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                      // 视频问诊 - 小程序问诊页面
    
);");


// 暂时存放，后面修改机制
define('COMMON_IMGS_VIEW', "V2");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V1'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V2'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V7'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
