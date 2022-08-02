<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放宁夏电信特有路由配置，它在应用运行时，将会与DefaultConf里的配置进行合并，
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
    'nightMedicine' => '/Home/Main/nightMedicineV7',                    // 夜间药房
    'orderRegister' => '/Home/Main/orderRegisterV7',                    // 预约挂号
    'MenuTabLevelThree' => '/Home/Main/MenuTabLevelThreeV7',            // 视频列表
    
    'channelIndex'=>'/Home/Channel/channelIndexV13',                    // 一级视频页面
    'secondChannelIndex'=>'/Home/Channel/secondChannelIndexV13',        // 二级视频页面
    'channelList'=>'/Home/Channel/videoListV13',
    'orderHome' => '/Home/Pay/indexV1',    
    
    /** 订购模块 */
    'orderCallback' => '/Home/Pay/payCallback',                          // 订购结果回调
    'appointmentRegister' => '/Home/Main/orderRegisterV7',               // 医院列表页

    /** 我的家模块 */
    'familyIndex' => '/Home/Family/indexV11',                             // 我的家 - 主页
    'familyHome' => '/Home/Family/myHomeV2',                              // 我的家 - 主页
    'familyMembersEditor' => '/Home/Family/familyMembersEditorV1',        // 我的家 - 家庭成员编辑
    'familyMembersAdd' => '/Home/Family/familyMembersAddV1',              // 我的家 - 家庭成员添加
    'familyAbout' => '/Home/Family/aboutV1',                              // 我的家 - 关于我们
    
    /** 订购模块 */
    'payInfo' => '/Home/Pay/payInfo',                                     // 订购信息显示界面
    'orderCallback' => '/Home/Pay/payCallback',                           // 订购结果回调
    
    /** 预约挂号页面 */
    'appointmentRegister' => '/Home/Main/orderRegisterV7',                           // 医院列表页
    //'appointmentRegisterHospitalDetail' => '/Home/AppointmentRegister/detailV2',            // 医院详情页
    //'appointmentRegisterHospitalIntroduce' => '/Home/AppointmentRegister/introduceV2',      // 医院介绍页
    //'appointmentSubjectList' => '/Home/AppointmentRegister/subjectV2',                      // 科室表页
    //'appointmentDoctorList' => '/Home/AppointmentRegister/doctorV2',                        // 科室表页
    
    /** 健康视频 */
    'healthVideoList' => '/Home/HealthVideo/videoListV10',                 // 健康视频首页
    'healthVideoSet' => '/Home/HealthVideo/videoSetV10',                   // 健康视频连续剧
    'gym' => '/Home/CommunityHospital/gym',                                // 健康视频连续剧
    'fifthHospital' => '/Home/CommunityHospital/fifthHospital',
    'hospitalPackage' => '/Home/CommunityHospital/hospitalPackage',
      
    /** 图文栏目 */
    'graphicColumn'=>'/Home/GraphicColumn/graphicColumn',
    
    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1', 
);");


define('COMMON_IMGS_VIEW', "V9");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V6'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V9'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
