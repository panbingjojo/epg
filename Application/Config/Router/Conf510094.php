<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放青海电信特有路由配置，它在应用运行时，将会与DefaultConf里的配置进行合并，
 *        并且会覆盖掉原来同名的配置。
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
    'nightMedicine' => '/Home/Main/OrderRegisterV7',                    // 青海电信夜间药房
    'orderRegister' => '/Home/Main/orderRegisterV7',                    // 青海电信预约挂号
    'MenuTabLevelThree' => '/Home/Main/MenuTabLevelThreeV7',            // 视频列表


    /** 订购模块 */
    'orderCallback' => '/Home/Pay/payCallback',                         // 订购结果回调
    
    /** 预约挂号页面 */
    'appointmentRegister' => '/Home/Main/orderRegisterV7',              // 医院列表页
   
);");


define('COMMON_IMGS_VIEW', "V6");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V4'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V7'); // 使用播放器的模式（V7-使用自定义播放器，V12-跳转局方播放器页面的）
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
define('COMMON_SPLASH_INTENT_TYPE', '2'); // 欢迎页到专辑和活动的跳转模式