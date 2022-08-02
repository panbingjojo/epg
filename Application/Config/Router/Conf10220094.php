<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放中国联通特有路由配置，它在应用运行时，将会与DefaultConf里的配置进行合并，
 *        并且会覆盖掉原来同名的配置。
 */

/**
 * 注册系统中的页面, 进行路由配置
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    /** 主页模块 */
    'homeTab1' => '/Home/Main/homeTab1V10',                                // 主页 - 老年保健
    'homeTab2' => '/Home/Main/homeTab2V10',                                // 主页 - 宝贝指南
    'homeTab3' => '/Home/Main/homeTab3V10',                                // 主页 - 女性宝典
    'homeTab4' => '/Home/Main/homeTab4V10',                                // 主页 - 健康百科
     
    /** 视频问诊模块 */
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV11',                     // 视频问诊首页
    'doctorDepartment' => '/Home/DoctorP2P/doctorDepartmentV10',           // 视频问诊 - 医生科室选择页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV10',                 // 视频问诊 - 医生详情页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                        // 视频问诊 - 呼叫页面
    
    'orderVip' => '/Home/Pay/orderVip',                                   // 退订-用户不是vip-订购页
    'hadOrderVip' => '/Home/Pay/HadOrderVip',                             // 说明用户已经是VIP
    'unsubscribeVip' => '/Home/Pay/unsubscribeVip',                       // 退订-用户是vip-退订页
    'secondUnsubscribeVip' => '/Home/Pay/secondUnsubscribeVip',           // 退订-二次确定退订页
    'unsubscribeResult' => '/Home/Pay/unsubscribeResult',                 // 退订-结果页面
    'unPayCallback' => '/Home/Pay/unPayCallback',                         // 退订结果回调
    'orderProductList' => '/Home/Pay/queryOrderProductList',              // 用户订购商品记录页
    'payShowResult' => '/Home/Pay/payShowResult',                         // 订购结果显示界面
    
    /** 订购模块 */
    'tempPayPage' => '/Home/Pay/tempPayPage',                             // 临时的订购选择页
    
    /** 健康视频 */
    'healthVideoList' => '/Home/HealthVideo/videoListV10',                // 健康视频首页
    'healthVideoSet' => '/Home/HealthVideo/videoSetV10',                  // 健康视频连续剧
    
    /** 疫情播报模块 */
    'nCoV-test' => '/Home/OutbreakReport/nCoVTest',
    'nCoV-test-result' => '/Home/OutbreakReport/nCoVTestResult',
    'nCoV-sure-area' => '/Home/OutbreakReport/nCoVSureArea',
    'nCoV-hospital-department' => '/Home/OutbreakReport/nCoVHospitalDepartment',
    'report-index' => '/Home/OutbreakReport/indexV1',
    'report-time-line' => '/Home/OutbreakReport/timeLineV1',
    'area-data' => '/Home/OutbreakReport/areaDataV1',
    'knowledge' => '/Home/OutbreakReport/knowledgeV1',
    'treatment' => '/Home/OutbreakReport/treatmentV1',
    'liveChannelH' => '/Home/OutbreakReport/liveChannelHV1',
    'liveChannelL' => '/Home/OutbreakReport/liveChannelLV1',
    'retrograde' => '/Home/OutbreakReport/retrogradeV1',
    'area-data-prev' => '/Home/OutbreakReport/areaDataPrevV1',
    
    /*核酸检测模块*/
    'nucleicAcidDetect'=>'/Home/OutbreakReport/nucleicAcidDetectV1',        // 核酸检测疫苗接种首页
    'detectAgency'=>'/Home/OutbreakReport/detectAgencyV1',                  // 核算检测机构预约
    'hotline'=>'/Home/OutbreakReport/hotlineV1',                            // 健康码服务热线
    'epidemic-Area' => '/Home/OutbreakReport/epidemicArea',                 // 隔离地区
    'go-home-isolation' => '/Home/OutbreakReport/goHomeIsolation',          // 往返家乡情况
    
    /** 我的家模块 */
    'familyEdit' => '/Home/Family/myHomeV2',                                // 我的家 - 家庭成员编辑
    'familyMembersEdit' =>'/Home/Family/familyMembersAddEditV1',            // 成员编辑
    'familyIndex' => '/Home/Family/myHomeV1',                               // 我的家 - 主页
    'familyAbout' => '/Home/Family/aboutV1',                                // 我的家 - 关于我们
    
    /** 订购模块 */
    'payInfo' => '/Home/Pay/payInfo',                                       // 订购信息显示界面
    'orderCallback' => '/Home/Pay/payCallback',                             // 订购结果回调
    
    /** 预约挂号页面 */
    'appointmentRegister' => '/Home/Main/orderRegisterV7',                  // 医院列表页
    
    /** 健康视频 */
    'healthVideoList' => '/Home/HealthVideo/videoListV10',                  // 健康视频首页
    'healthVideoSet' => '/Home/HealthVideo/videoSetV10',                    // 健康视频连续剧
    'gym' => '/Home/CommunityHospital/gym',                                 // 健康视频连续剧
    'fifthHospital' => '/Home/CommunityHospital/fifthHospital',
    'hospitalPackage' => '/Home/CommunityHospital/hospitalPackage',
    
    /** 问诊记录模块 */
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',        // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',       // 问诊记录 - 记录归档页
    
    /** 订购模块 */
    'orderHome' => '/Home/Pay/indexV1',                                     // 订购主页
    
    /** 挽留页增加跳转健康生活 */
    'healthLive' => '/Home/Hold/healthLiveV1',
    
    /** 静态预约挂号 */
    'indexStatic' => '/Home/AppointmentRegister/indexStaticV1',               
    'areaListStatic' => '/Home/AppointmentRegister/areaListStaticV1',                
    'doctorStatic' => '/Home/AppointmentRegister/doctorStaticV1',                
    'doctorDetailStatic' => '/Home/AppointmentRegister/doctorDetailStaticV1',                
    'moreHospitalStatic' => '/Home/AppointmentRegister/moreHospitalStaticV1',  
    
    /** 检测记录 */
    'archivingList' => '/Home/DataArchiving/archivingListV10',                   // 数据归档
    'recordList' => '/Home/DataArchiving/recordListV10',                         // 检测记录
    'recordDetail' => '/Home/DataArchiving/recordDetailV10',                     // 归档
    'APKPlay' => '/Home/Player/APKPlay',                                         // 播放   
    'channelList'=>'/Home/HealthVideo/videoSetV10',
    
    /** 帮助 */
    'helpIndex' => '/Home/Help/helpV1',
    
    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',
    
);");


// 暂时存放，后面修改机制
define('COMMON_IMGS_VIEW', "V2");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V1'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V2'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V7'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
