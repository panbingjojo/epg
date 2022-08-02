<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午7:10
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    /** 订购模块 */
    'directPay' => '/Home/Pay/directPay',                                 // 订购直接支付通过本地post的方式
);");

define('COMMON_IMGS_VIEW', "V1");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V3'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V1'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V2'); // 退出拘留页的模式
