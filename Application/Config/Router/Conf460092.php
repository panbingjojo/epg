<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午6:56
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    'appointmentRegister' => '/Home/AppointmentRegister/IndexV1',            // 预约挂号
     'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV13',
     
      /** 数据归档 */
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13',     
        
    /** 问诊记录 */
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',       // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',      // 问诊记录 - 记录归档页
    
     'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                     // 视频问诊首页
     'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV13',                 // 视频问诊 - 医生详情页
);");


define('COMMON_IMGS_VIEW', "V1");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V2'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V2'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
