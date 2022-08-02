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
    'home' => '/Home/Main/homeV13',                                     // 主页 - 推荐页
    'menuTab' => '/Home/Main/menuTabV7',                                // 视频栏目，采用视图7
    'healthCare' => '/Home/Main/healthCareV7',                          // 保健模块 
    'nightMedicine' => '/Home/Main/nightMedicineV7',                    // 夜间药房
    'orderRegister' => '/Home/Main/orderRegisterV7',                    // 预约挂号
    'MenuTabLevelThree' => '/Home/Main/MenuTabLevelThreeV7',            // 视频列表
    
    /** 订购模块 */
    'orderCallback' => '/Home/Pay/payCallback',                        // 订购结果回调
    'appointmentRegister' => '/Home/Main/orderRegisterV7',             // 医院列表页
    
     /** 在线问医模块 */ 
    'doctorIndex' => '/Home/DoctorP2P/doctorIndexV13',                     // 视频问诊首页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV13',                 // 视频问诊 - 医生详情页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                      // 视频问诊 - 小程序问诊页面
    
    /** 问诊记录模块 */
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV13',       // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',      // 问诊记录 - 记录归档页
    
    /** 我的家模块 */
    'familyIndex' => '/Home/Family/indexV11',                             // 我的家 - 主页
    'familyHome' => '/Home/Family/myHomeV2',                              // 我的家 - 主页
    'familyMembersEditor' => '/Home/Family/familyMembersEditorV1',        // 我的家 - 家庭成员编辑
    'familyMembersAdd' => '/Home/Family/familyMembersAddV1',              // 我的家 - 家庭成员添加
    'familyAbout' => '/Home/Family/aboutV1',                              // 我的家 - 关于我们
    
    /** 订购模块 */
    'payInfo' => '/Home/Pay/payInfo',                                     // 订购信息显示界面
    'orderCallback' => '/Home/Pay/payCallback',                        // 订购结果回调
    'doctorRecordHomeV2' => '/Home/DoctorP2PRecord/recordHomeV10',           // 问诊记录 - 记录主页

    /** 预约挂号页面 */
    'indexStatic' => '/Home/AppointmentRegister/indexStaticV1',                               // 医院列表页  
    'areaListStatic' => '/Home/AppointmentRegister/areaListStaticV1',                         // 医院详情页 
    'doctorStatic' => '/Home/AppointmentRegister/doctorStaticV1',                             // 推荐专家             
    'doctorDetailStatic' => '/Home/AppointmentRegister/doctorDetailStaticV1',                 // 医生详情页面 
    'moreHospitalStatic' => '/Home/AppointmentRegister/moreHospitalStaticV1',                 // 更多医院
    
    /** 健康视频 */
    'healthVideoList' => '/Home/HealthVideo/videoListV10',                            // 健康视频首页
    'healthVideoSet' => '/Home/HealthVideo/videoSetV10',                              // 健康视频连续剧
    'gym' => '/Home/CommunityHospital/gym',                                           // 健康视频连续剧
    'fifthHospital' => '/Home/CommunityHospital/fifthHospital',
    'hospitalPackage' => '/Home/CommunityHospital/hospitalPackage',
    
    /** 图文栏目 */
    'graphicColumn'=>'/Home/GraphicColumn/graphicColumn',
    
    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',
    
    /** 健康检测模块 */
    'imeiInput' => '/Home/HealthTest/imeiInputV13',                   
    'inputTestData' => '/Home/HealthTest/inputTestDataV13',
    'testRecord' => '/Home/DataArchiving/recordDetailV10',
    'healthTestDetectionStep' => '/Home/HealthTest/waitStepV13',        // 检测引导步骤
    'testIndex'=>'/Home/HealthTest/index',                              // 健康检测 - 主页 
    'aal-imei'=>'/Home/HealthTest/imeiInputV8',                         // 健康检测 - 主页 
    'sg-blood'=>'/Home/HealthTest/code',                                // 健康检测 - 主页 
    'introduce'=>'/Home/HealthTest/introduce',                          // 健康检测 - 主页 
    'st-introduce'=>'/Home/HealthTest/introduceST',                     // 健康检测 - 主页
    'xy-step'=>'/Home/HealthTest/XYStep',                               // 健康检测 - 主页
    'xt-step'=>'/Home/HealthTest/XTStep',                               // 健康检测 - 主页
    'tz-step'=>'/Home/HealthTest/TZStep',                               // 健康检测 - 主页
    'inputTest'=>'/Home/HealthTest/inputTestDataV8',                    // 健康检测 - 主页
    'outIndex'=>'/Home/HealthTest/outIndex',                            // 健康检测 - 外部入口 
    'familyEdit' => '/Home/Family/myHomeV2',                            // 我的家 - 家庭成员编辑
    'familyMembersEdit'=>'/Home/Family/familyMembersAddEditV1',
    'testRecord' => '/Home/DataArchiving/testType',
    'testList' => '/Home/DataArchiving/testList',
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13',// 数据归档
    'test-weight'=>'/Home/HealthTest/testWeightV8',                     // 体重检测 - 主页
    'tz-introduce'=>'/Home/HealthTest/introduceTZ',                     // 健康检测 - 主页
    'weight-list' => '/Home/DataArchiving/weightList',                  // 体脂归档数据
    'weight-detail' => '/Home/DataArchiving/weightDetail',              // 体脂归档数据详情
    'weight-introduce' => '/Home/DataArchiving/weightIntroduce',        // 体脂归档数据评分
    'common-doc'=>'/Hospital/Hospital/indexV1',
    'report-data' => 'Home/DataArchiving/reportData',                   // 数据上报 -- 上报入口
       
    /** 手环检测模块 */   
    'bind-wristband'=>'/Home/HealthTest/bindWristband',                 // 手环绑定
    'intro-wristband'=>'/Home/HealthTest/introduceSH',                  // 手环绑定
    'step-wristband'=>'/Home/HealthTest/stepSH',                        // 手环绑定
    'step-hsDoctor'=>'/Home/HealthTest/stepHSDoctorSH',                 // 恒生博士医生
    'wristList-wristband'=>'/Home/DataArchiving/wristList',             // 手环绑定
    'stepCount-wristband'=>'/Home/DataArchiving/stepCountList',         // 步数
    'stepCountDetail-wristband'=>'/Home/DataArchiving/stepCountDetail', // 步数
    'heartRateList-wristband'=>'/Home/DataArchiving/heartRateList',     // 心率
    'heartRateDetail-wristband'=>'/Home/DataArchiving/heartRateDetail', // 心率
    'heartRateSport-wristband'=>'/Home/DataArchiving/heartRateSport',   // 运动心率
    'sleepList-wristband'=>'/Home/DataArchiving/sleepList',             // 睡眠
    'sleepDetail-wristband'=>'/Home/DataArchiving/sleepDetail',         // 睡眠
    'sportList-wristband'=>'/Home/DataArchiving/sportList',             // 运动
    'sportDetail-wristband'=>'/Home/DataArchiving/sportDetail',         // 详情
    'sportEqDetail-wristband'=>'/Home/DataArchiving/sportEqDetail',     // 详情
    'channelIndex' => 'Home/Channel/channelIndexV13',
        
    // 视频集相关
    'channelList'=>'/Home/Channel/videoListV13', 
    
    /** 帮助 */
    'helpIndex' => '/Home/Help/helpV1',
    
    'customizeModule' => '/Home/CustomizeModule/customizeModuleV1',        // 定制模块
    
);");


define('COMMON_IMGS_VIEW', "V9");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V6'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V1'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V9'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
