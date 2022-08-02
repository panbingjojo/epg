<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放默认路由配置，如果有特殊之处，请在同级目录下Confxxxxx.php下进行增加
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */
define("DEFAULT_VIEW_PAGES", "return array(
    /** 导航页模块 */
    'splash' => '/Home/Splash/indexV1',                                   // 导航页入口页面
    
    /** 主页模块 */
    'home' => '/Home/Main/homeV1',                                        // 主页 - 推荐页
    'homeTab1' => '/Home/Main/homeTab1V1',                                // 主页 - 老年保健
    'homeTab2' => '/Home/Main/homeTab2V1',                                // 主页 - 宝贝指南
    'homeTab3' => '/Home/Main/homeTab3V1',                                // 主页 - 女性宝典
    'homeTab4' => '/Home/Main/homeTab4V1',                                // 主页 - 健康百科
     
     /** 设备商城 */
    'goodsHome' => '/Home/Goods/goodsHome',                               // 商城首页
    'goodsDetail' =>  '/Home/Goods/goodsDetail',                          // 商品详情
    'goodsBuy' => '/Home/Goods/goodsBuy',                                 // 测试 - 进入设备信息页面
    'goodsRule' => '/Home/Goods/goodsRule',                               // 测试 - 进入设备信息页面
    'goodsPay' => '/Home/Goods/goodsPay',                                 // 测试 - 进入设备信息页面
    'goodsPayComplete' => '/Home/Goods/goodsPayComplete',                 // 测试 - 进入设备信息页面
    'goodsPayError' => '/Home/Goods/goodsPayError',                       // 测试 - 进入设备信息页面
    
    /** 购买记录 */
    'goodsRecordHome' => '/Home/GoodsRecord/goodsRecordHome',             // 记录首页首页
    
    /** 搜索模块 */
    'search' => '/Home/Search/search',                                    // 搜索页主页
    
    /** 播放模块 */
    'player' => '/Home/Player/indexV1',                                   // 播放器主页面
    'playerCallback' => '/Home/Player/playerCallback',                    // 播放器返回
    'smallPlayer' => '/Home/Player/smallV1',                              // 播放器主页面
    
    /** 订购模块 */
    'orderHome' => '/Home/Pay/indexV1',                                   // 订购主页
    'orderFake' => '/Home/Pay/fakeOrderV1',                               // 订购主页
    'payCallback' => '/Home/Pay/payCallback',                             // 订购结果回调
   
    /** 更多视频模块 */   
    'channel' => '/Home/Channel/indexV1',                                 // 更多视频主页
    
    /** 收藏模块 */
    'collect' => '/Home/Collect/indexV1',                                 // 收藏主页
   
    /** 系统模块 */
    'wait' => '/Home/System/wait',                                        // 等待页面
    'jumpToPay' => 'Home/Debug/jumpToPay',
    'authOrder' => '/Home/System/authOrder',                              // 前端中间鉴权页
    
    /** 视频问诊模块 */
    'doctorList' => '/Home/DoctorP2P/doctorIndexV13',                     // 视频问诊 - 医生列表页
    'doctorDepartment' => '/Home/DoctorP2P/doctorDepartmentV1',           // 视频问诊 - 医生科室选择页
    'doctorDetails' => '/Home/DoctorP2P/doctorDetailsV1',                 // 视频问诊 - 医生详情页
    'inquiryCall' => '/Home/DoctorP2P/inquiryCallV1',                       // 视频问诊 - 呼叫页面
   
     /** 问诊记录模块 */
    'doctorRecordHome' => '/Home/DoctorP2PRecord/recordHomeV1',           // 问诊记录 - 记录主页
    'doctorRecordDetail' => '/Home/DoctorP2PRecord/recordDetailV1',       // 问诊记录 - 记录详情页
    'doctorRecordArchive' => '/Home/DoctorP2PRecord/recordArchiveV1',     // 问诊记录 - 记录归档页
    
    /** 我的家模块 */
    'familyHome' => '/Home/Family/myHomeV1',                              // 我的家 - 主页
    'familyMembersEditor' => '/Home/Family/familyMembersEditorV1',        // 我的家 - 家庭成员编辑
    'familyMembersAdd' => '/Home/Family/familyMembersAddV1',              // 我的家 - 家庭成员添加
    'familyAbout' => '/Home/Family/aboutV1',                              // 我的家 - 关于我们
   
    /** 退出挽留页 */
    'hold' => '/Home/Hold/indexV1',                                       // 退出挽留页
   
    /** 测试、调试页面 */
    'debugShowSTBInfo' => '/Home/Splash/indexV1',                         // 测试 - 显示设备信息
    'debugCallApkTest' => '/Home/Debug/callApkTest',                      // 测试 - apk调用测试
    'debugVideoPlayTest' => '/Home/Debug/videoPlayTest',                  // 测试 - 视频播放测试
    'debugAudioPlayTest' => '/Home/Debug/audioPlayTest',                  // 测试 - 音频播放测试
    'testServer' => '/Home/Debug/goTestServer',                           // 测试 - 测试入口
    'testEntrySet' => '/Home/Debug/goTestEntrySet',                       // 测试 - 进入测试页面
    'deviceInformation' => '/Home/Debug/goDeviceInformation',             // 测试 - 进入测试页面
    'goJ2meTest' => '/Home/Debug/callTestByJ2ME',                         // 测试 - 进入j2me游戏测试
    'jumpToPay' => '/Home/Debug/jumpToPay',
    'serverResponseTest' => '/Home/Debug/goServerResponseTest',            //测试 - 进入服务器响应时间测试   
   
     /** 视频问专家模块 */
    'expertHome' => '/Home/Expert/expertIndexV13',                           // 视频问专家 - 首页
    'expertIndex' => '/Home/Expert/expertIndexV13',                          // 视频问专家 - 首页
    'expertItem' => '/Home/Expert/expertItemV13',                            // 视频问专家 - 问专家医生列表页
    'expertDetail' => '/Home/Expert/expertDetailV13',                        // 视频问专家 - 专家详情页
    'expertDepartment' => '/Home/Expert/expertDepartmentV13',                // 视频问专家 - 部门选择页
    'expertSuccess' => '/Home/Expert/expertSuccessV13',
     
    /** 视频问专家记录模块 */
    'expertRecordHome' => '/Home/ExpertRecord/expertRecordHomeV13',       // 问专家记录 - 记录主页
    'expertCase' => '/Home/ExpertRecord/expertCase',                      // 问专家记录 - 病例页
    'expertAdvice' => '/Home/ExpertRecord/expertAdvice',                  // 问专家记录 - 
    'expertRecordSuccess' => '/Home/ExpertRecord/expertRecordSuccess',    // 问专家记录 - 预约成功
    'expertRecordBridge' => '/Home/ExpertRecord/expertRecordBridge',      // 问专家记录 -  
    
    /** 专辑模块 */
    'album' => '/Album/Album/index',                                       // 专辑主页
    
    /** 系统维护提示页面 */
    'update' => '/Home/System/update',
    'error' => '/Home/System/error',
    
    /** 健康检测 */  
    'healthTestInputData' => '/Home/HealthTest/inputTestDataV8',            // 检测数据输入 
    'healthTestDetectionStep' => '/Home/HealthTest/detectionStepV10',       // 检测引导步骤
    'healthTestImeiInput' => '/Home/HealthTest/imeiInputV10',               // IMEI号输入
    'bodyfat-a20'=>'/Home/HealthTest/bodyfata20InputV8', 
    'testIndex'=>'/Home/HealthTest/index',                                  // 健康检测 - 主页 
    'aal-imei'=>'/Home/HealthTest/imeiInputV8',                            //  
    'sg-blood'=>'/Home/HealthTest/code',                                   //  
    'introduce'=>'/Home/HealthTest/introduce',                             //  
    'st-introduce'=>'/Home/HealthTest/introduceST',                        // 健康检测 - 使用说明
    'bodyfat-introduce'=>'/Home/HealthTest/introduceBodyFat',
    'xy-step'=>'/Home/HealthTest/XYStep',                                  //  
    'bodyfat-step'=>'/Home/HealthTest/bodyFatStep',                        //  
    'xt-step'=>'/Home/HealthTest/XTStep',                                  //  
    'tz-step'=>'/Home/HealthTest/TZStep',                                  //  
    'inputTest'=>'/Home/HealthTest/inputTestDataV8',                       //  
    'outIndex'=>'/Home/HealthTest/outIndex',                               //  
    'familyEdit' => '/Home/Family/myHomeV2',                               // 我的家 - 家庭成员编辑
    'familyMembersEdit'=>'/Home/Family/familyMembersAddEditV1',  
    'testRecord' => '/Home/DataArchiving/testType',
    'testList' => '/Home/DataArchiving/testList',                          // 
    'test-weight'=>'/Home/HealthTest/testWeightV8',                        // 体重检测 - 主页
    'tz-introduce'=>'/Home/HealthTest/introduceTZ',                        // 健康检测 - 主页
    'weight-list' => '/Home/DataArchiving/weightList',                     // 体脂归档数据
    'weight-detail' => '/Home/DataArchiving/weightDetail',                 // 体脂归档数据详情
    'weight-introduce' => '/Home/DataArchiving/weightIntroduce',           // 体脂归档数据评分
    'common-doc'=>'/Hospital/Hospital/indexV1',
    'report-data' => 'Home/DataArchiving/reportData',    
    'bind-wristband'=>'/Home/HealthTest/bindWristband',                    // 手环绑定
    'intro-wristband'=>'/Home/HealthTest/introduceSH',                     // 手环绑定
    'step-wristband'=>'/Home/HealthTest/stepSH',                           // 手环绑定
    'step-hsDoctor'=>'/Home/HealthTest/stepHSDoctorSH',                    // 恒生博士医生
    'wristList-wristband'=>'/Home/DataArchiving/wristList',                // 手环绑定
    'stepCount-wristband'=>'/Home/DataArchiving/stepCountList',            // 步数
    'stepCountDetail-wristband'=>'/Home/DataArchiving/stepCountDetail',    // 步数
    'heartRateList-wristband'=>'/Home/DataArchiving/heartRateList',        // 心率
    'heartRateDetail-wristband'=>'/Home/DataArchiving/heartRateDetail',    // 心率
    'heartRateSport-wristband'=>'/Home/DataArchiving/heartRateSport',      // 运动心率
    'sleepList-wristband'=>'/Home/DataArchiving/sleepList',                // 睡眠
    'sleepDetail-wristband'=>'/Home/DataArchiving/sleepDetail',            // 睡眠
    'sportList-wristband'=>'/Home/DataArchiving/sportList',                // 运动
    'sportDetail-wristband'=>'/Home/DataArchiving/sportDetail',            // 详情
    'sportEqDetail-wristband'=>'/Home/DataArchiving/sportEqDetail',        // 详情
    'doctor-code'=>'/Home/HealthTest/doctorCode',                          // 健康检测-博士血糖仪
    'hsDoctorIntroduce'=>'/Home/HealthTest/hsDoctorIntroduce',             // 健康检测 - 博士血糖仪操作说
     
    /** 检测记录 */
    'healthTestRecordList' => '/Home/DataArchiving/recordListV1',          // 检测记录（家庭成员已归档检测记录）
    'healthTestRecordDetail' => '/Home/DataArchiving/recordDetailV1',      // 检测记录详情页面
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13',   // 数据归档
    'healthTestArchived' => '/Home/DataArchiving/archivedV1',              // 归档 
    'imeiInput' => '/Home/HealthTest/imeiInputV13',         
    
    /** 关于我们 */ 
    'about' => '/Home/About/aboutV1',
   
    /** 新疆社区医院 */
    'community-index' => '/Home/CommunityHospital/communityIndex',
    'community-doctor' => '/Home/CommunityHospital/communityDoctor',
    'health-education' => '/Home/CommunityHospital/healthEducationList',
    'experts-introduce' => '/Home/CommunityHospital/expertList',
    'experts-details' => '/Home/CommunityHospital/expertDetails',
    'especially-department' => '/Home/CommunityHospital/departmentList',
    'department-introduce' => '/Home/CommunityHospital/DepartmentDetails',
    'eye-hospital' => '/Home/CommunityHospital/eyeHospital',
    
    /** 血压管理 */
    'blood-manage-index' => '/Home/CommunityHospital/bloodManageIndex',
    'blood-data-up' => '/Home/CommunityHospital/bloodDataUp',
    'add-user' => '/Home/CommunityHospital/addUser',
    'members-list' => '/Home/CommunityHospital/membersList',
      
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
    'nucleicAcidDetect'=>'/Home/OutbreakReport/nucleicAcidDetectV1',         // 核酸检测疫苗接种首页
    'detectAgency'=>'/Home/OutbreakReport/detectAgencyV1',                   // 核算检测机构预约
    'hotline'=>'/Home/OutbreakReport/hotlineV1',                             // 健康码服务热线
    'epidemic-Area' => '/Home/OutbreakReport/epidemicArea',                  // 隔离地区
    'go-home-isolation' => '/Home/OutbreakReport/goHomeIsolation',           // 往返家乡情况
     
    /** 预约挂号 */
    'appointment' => '/Home/AppointmentRegister/appointment',
   
     /** 医院 */
    'hospital-index' => '/Hospital/Hospital/indexV1',
    'hospital-index-version' => '/Hospital/Hospital/indexV2',                 // 带版本控制的社区医院
    'hospital-hospitalIntroduce' => '/Hospital/Hospital/hospitalIntroduceV1',
    'hospital-doctorIntroduce' => '/Hospital/Hospital/doctorIntroduceV1',
    'hospital-disease-control' => '/Hospital/Hospital/diseaseControlV1',
    'hospital-doctor-list' => '/Hospital/Hospital/doctorListV1',
    
    /** 献血模块 */
    'commonweal' => '/Home/DonateBlood/commonwealV1',                          // 爱心公益
    'bloodStep' => '/Home/DonateBlood/bloodStepV1',                            // 献血步骤
    'bloodOrder' => '/Home/DonateBlood/bloodOrderV1',                          // 预约献血
    'bloodKnow' => '/Home/DonateBlood/bloodKnowV1',                            // 献血须知
    'bloodNav' => '/Home/DonateBlood/bloodNavV1',                              // 报销指引
    'bloodRoomInfo' => '/Home/DonateBlood/bloodRoomInfoV1',                    // 献血屋
    'personal' => '/Home/DonateBlood/personalV1',                              // 个人中心
    'qrCode' => '/Home/DonateBlood/qrCodeV1',                                  // 二维码界面
    
    /** 健康知识 */
    'healthKnowledgeList' => '/Home/HealthKnowledge/knowledgeListV1',          // 知识列表
    'healthKnowledgeDetails' => '/Home/HealthKnowledge/knowledgeDetailsV1',    // 知识详情
    
    /** 健康自测 */
    'answer' => '/Home/HealthSelfTest/answerV1',                               // 健康自测答题
    'testResults' => '/Home/HealthSelfTest/testResultsV1',                     // 测试结果及建议
    'selfTestList' => '/Home/HealthSelfTest/testListV1',                       // 健康自测列表页
    'third-party-sp' => '/Home/Debug/jumpThirdPartySP',                        // 跳转其他应用
    
    /** 在线购买*/
    'payOnline' => '/Home/PayOnline/payOnlineV1',                              // 在线购买-首页
    'productDetail' => '/Home/PayOnline/productDetailV1',                      // 商品详情页
    
     'customizeModule' => '/Home/CustomizeModule/customizeModuleV1',        // 定制模块路由
     
     /*游戏详情*/
     'gameDetails' => '/Home/Game/gameDetails',                              // 游戏详情页
);");