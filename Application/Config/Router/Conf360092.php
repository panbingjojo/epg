<?php
/**
 * Created by longmaster.
 * Date: 2019-03-27
 * Time: 14:43
 * Brief: 此文件（或类）用于记录江西电信EPG的路由配置参数
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
      'appointmentRegister' => '/Home/AppointmentRegister/IndexV1',            // 预约挂号
);");

define('COMMON_IMGS_VIEW', "V1");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V3'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V8'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V2'); // 退出拘留页的模式
