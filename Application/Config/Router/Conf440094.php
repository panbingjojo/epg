<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放广东广电特有路由配置，它在应用运行时，将会与DefaultConf里的配置进行合并，
 *        并且会覆盖掉原来同名的配置。
 */
/**
 * 注册系统中的页面, 进行路由配置
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    /** 订购模块 */
    'directPay' => '/Home/Pay/directPay',                                 // 订购直接支付通过本地post的方式
    'orderVip' => '/Home/Pay/orderVip',                                   // 退订-用户不是vip-订购页
    'unsubscribeVip' => '/Home/Pay/unsubscribeVip',                       // 退订-用户是vip-退订页
    'secondUnsubscribeVip' => '/Home/Pay/secondUnsubscribeVip',           // 退订-二次确定退订页
    'unsubscribeResult' => '/Home/Pay/unsubscribeResult',                 // 退订-结果页面
    'payCallback' => '/Home/Pay/payCallback',                             // 订购结果回调
    'payShowResult' => '/Home/Pay/payShowResult',                         // 订购结果显示界面
    
    /** 39互联网医院模块 */
    '39hospital' => '/Home/Hospital39/index',                             // 39互联网医院模块
    
    /** 预约挂号模块 */
    'appointmentRegister' => '/Home/AppointmentRegister/indexV1',         // 预约挂号主界面
);");


// 暂时存放，后面修改机制
define('COMMON_IMGS_VIEW', "V6");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V1'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V2'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V6'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
