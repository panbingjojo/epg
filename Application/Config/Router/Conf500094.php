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
   
    /** 视频问诊模块 */
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV11',                     // 视频问诊首页
    'doctorDepartment' => '/Home/DoctorP2P/doctorDepartmentV10',           // 视频问诊 - 医生科室选择页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV10',                 // 视频问诊 - 医生详情页
    
    /** 问诊记录模块 */
    'doctorRecordHome' => '/Home/DoctorP2PRecord/recordHomeV10',           // 问诊记录 - 记录主页
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV10',       // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV10',     // 问诊记录 - 记录归档页
    'recordArchive' => '/Home/DoctorP2PRecord/recordArchiveV10',           // 问诊记录 - 选择家庭成员进行归档
    
     /** 视频问专家模块 */
    'expertIndex' => '/Home/Expert/expertIndexV13',                       // 视频问专家 - 首页
    'expertDetail' => '/Home/Expert/expertDetailV13',                     // 视频问专家 - 专家详情页
    'expertSuccess' => '/Home/Expert/expertSuccessV13',                   // 视频问专家 - 预约成功页
    
);");


define('COMMON_IMGS_VIEW', "V6");         // 使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V4');     // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1');        // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V0');       // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1');    // 退出拘留页的模式
define('COMMON_SPLASH_INTENT_TYPE', '2'); // 欢迎页到专辑和活动的跳转模式