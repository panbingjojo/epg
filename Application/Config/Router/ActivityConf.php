<?php
/**
 * Router 目录下配置的是控制器的路由，前端路由在 ~/Home/Model/DisPlay目录下配置
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 11:48
 * Brief: 此文件（或类）用于存在活动相关路由配置
 */

/**
 * 注册系统中的页面, 进行路由配置
 * 所有页面需要注册配置
 */
define("ACTIVITY_VIEW_PAGES", "return array(
     /** 活动模块 */
    'activity' => '/Activity/Activity/index',                                              // 活动主页 - 入口
    'activity-common-guide'         => '/Activity/ActivityCommon/guide',                    // 通用活动 - 引导页（老活动）
    'activity-common-index'         => '/Activity/ActivityIndex/index',                     // 通用活动 - 引导页（新活动）
    'activity-common-proxy'         => '/Activity/ActivityProxy/index',                     // 通用活动 - 引导页（局方直接跳转活动）
    'activity-common-dialog'        => '/Activity/ActivityCommon/dialog',                   // 通用活动 - 弹框页
    'activity-common-home'          => '/Activity/ActivityCommon/index',                    // 通用活动 - 活动主页
    'activity-common-winList'       => '/Activity/ActivityCommon/winList',                  // 通用活动 - 中奖页面
    'activity-common-exchange'      => '/Activity/ActivityCommon/exchangePrize',            // 通用活动 - 奖品兑换页
    'activity-common-thirdPartySP'  => '/Home/Debug/jointActivityOtherSP',                  // 通用活动 - 第三方sp页面
    
     'activity-result'         => '/Activity/ActivityCommon/result',                   // 健康时播 - 结果页
    
    /*健康测一测（中国联通EPG-山东省独立活动）*/
    'healthTestList'                => '/Activity/ActivityCommon/healthTestList',           // 健康测一测列表页面
    'completed'                     => '/Activity/ActivityCommon/completed',                // 健康测一测答题页面
    
    
     'signUp'                     => '/Activity/ActivityCommon/signUp',                // 减肥大赛一宁夏
     'like'                     => '/Activity/ActivityCommon/like',                // 减肥大赛一宁夏
     'activity-introduce'                     => '/Activity/ActivityCommon/introduce',                // 减肥大赛一宁夏
     'picture'                     => '/Activity/ActivityCommon/picture',                // 减肥大赛一宁夏

    // 抓娃娃活动
    'activity-zhuawawa-home'            => '/Activity/ActivityZhuawawa/index',              // 抓娃娃活动 - 主页
    'activity-zhuawawa-showPriceInfo'   => '/Activity/ActivityZhuawawa/showPriceInfo',      // 抓娃娃活动 - 显示奖品信息页
    'activity-zhuawawa-setPhoneNumber'  => '/Activity/ActivityZhuawawa/setPhoneNumber',     // 抓娃娃活动 - 设置号码页
    
     //0元免费问诊活动
     'activity-consultation-guide'      => '/Activity/ActivityConsultation/guide',          // 0元约诊 - 首页页
     'activity-consultation-rule'       => '/Activity/ActivityConsultation/rule',           // 0元约诊 - 规则页
     'activity-consultation-record'     => '/Activity/ActivityConsultation/record',         // 0元约诊 - 约诊记录页
     'activity-consultation-detail'     => '/Activity/ActivityConsultation/detail',         // 0元约诊 - 约诊详情页
     'activity-consultation-code'       =>'/Activity/ActivityConsultation/code',            // 0元约诊 - 扫描二维码页
     'activity-consultation-success'    => '/Activity/ActivityConsultation/success',        // 0元约诊 - 约诊成功页
     'activity-consultation-dialog'     => '/Activity/ActivityConsultation/dialog',         // 0元约诊 - 约诊失败页    'activity-consultation-guide'      => '/Activity/ActivityConsultation/guide',          // 0元约诊 - 首页页
    
     'activity-consultation-new-guide'      => '/Activity/ActivityConsultationNew/guide',          // 0元约诊 - 首页页
     'activity-consultation-new-rule'       => '/Activity/ActivityConsultationNew/rule',         // 0元约诊 - 规则页
     'activity-consultation-new-record'     => '/Activity/ActivityConsultationNew/record',         // 0元约诊 - 约诊记录页
     'activity-consultation-new-detail'     => '/Activity/ActivityConsultationNew/detail',         // 0元约诊 - 约诊详情页
     'activity-consultation-new-code'       =>'/Activity/ActivityConsultationNew/code',            // 0元约诊 - 扫描二维码页
     'activity-consultation-new-success'    => '/Activity/ActivityConsultationNew/success',        // 0元约诊 - 约诊成功页
     'activity-consultation-new-dialog'     => '/Activity/ActivityConsultationNew/dialog',         // 0元约诊 - 约诊失败页
     
      // 广西名医服务基础活动调整（2018-10-17）
      'activity-famous-index'           => '/Activity/ActivityFamousDoctor/index',   
      
      'activity-go-cancel-order-page'   => '/Activity/ActivityCommon/goCancelOrderPage',    // 中国联通，活动页的退订入口
);");

/**
 *  标注哪些地区没有标清模式活动！
 */
define("SD_PLATFORM_DISABLED_AREAS", "return array(
        '340092',     // 安徽电信
        '630092',     // 青海电信
);");