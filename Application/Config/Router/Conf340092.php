<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放安徽电信特有路由配置，它在应用运行时，将会与DefaultConf里的配置进行合并，
 *        并且会覆盖掉原来同名的配置。
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    /** 主页模块 */
    'home' => '/Home/Main/homeV2',                                        // 主页 - 推荐页
    'homeTab1' => '/Home/Main/homeTab1V2',                                // 主页 - 老年保健
    'homeTab2' => '/Home/Main/homeTab2V2',                                // 主页 - 宝贝指南
    'homeTab3' => '/Home/Main/homeTab3V2',                                // 主页 - 女性宝典
    'homeTab4' => '/Home/Main/homeTab4V2',                                // 主页 - 健康百科
    
    /** 订购模块 */
    'directPay' => '/Home/Pay/directPay',                                 // 订购直接支付通过本地post的方式
);");

define('COMMON_IMGS_VIEW', "V2");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V3'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V2'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V2'); // 退出拘留页的模式
