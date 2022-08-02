<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放广西广电特有路由配置，它在应用运行时，将会与DefaultConf里的配置进行合并，
 *        并且会覆盖掉原来同名的配置。
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    /** 主页模块 */
    'home' => '/Home/Main/homeV13',                                       // 主页 - 推荐页

    /** 订购模块 */
    'orderCallback' => '/Home/Pay/payCallback',                           // 订购结果回调
    'asyncOrderCallback' => '/Home/Pay/asyncCallBack',                    // 异步结果回调
    
    'introVideo-single' => '/Home/IntroVideo/single',                     // 单个视频简介
    'introVideo-list' => '/Home/IntroVideo/list',                         // 视频系列页面
    'introVideo-detail' => '/Home/IntroVideo/detail',                     // 单个视频简介
    
    'doctorRecordHomeV2' => '/Home/DoctorP2PRecord/recordHomeV2',         // 问诊记录 - 记录主页
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',      // 问诊记录 - 记录详情页
    
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                    // 视频问诊首页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCall',                       // 视频问诊 - 呼叫页面
    
    'channelIndex'=>'/Home/Channel/channelIndexV13',                 // 一级视频页面
    'secondChannelIndex'=>'/Home/Channel/secondChannelIndexV13',     // 二级视频页面
    'channelList'=>'/Home/Channel/videoListV13',
    
    /** 在线问医模块 */
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                     // 视频问诊首页
    'doctorDepartment' => '/Home/DoctorP2P/doctorDepartmentV13',           // 视频问诊 - 医生科室选择页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV13',                 // 视频问诊 - 医生详情页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                      // 视频问诊 - 小程序问诊页面
    
    /*我的模块*/
    'collect'=>'/Home/Collect/indexV1',
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',
    
    /** 退出挽留页 */
    'hold' => '/Home/Hold/indexV1',
);");


define('COMMON_IMGS_VIEW', "V1");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V4'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V5'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
