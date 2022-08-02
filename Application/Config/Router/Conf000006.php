<?php
/**
 * Created by longmaster.
 * Date: 2019-01-31
 * Time: 14:22
 */

/**
 * 注册系统中的页面, 进行路由配置
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    /** 主页模块 */
    'home' => '/Home/Main/homeV13',                                        // 主页 - 推荐页

    'orderVip' => '/Home/Pay/orderVip',                                   // 退订-用户不是vip-订购页
    'hadOrderVip' => '/Home/Pay/HadOrderVip',                             // 说明用户已经是VIP
    'unsubscribeVip' => '/Home/Pay/unsubscribeVip',                       // 退订-用户是vip-退订页
    'secondUnsubscribeVip' => '/Home/Pay/secondUnsubscribeVip',           // 退订-二次确定退订页
    'unsubscribeResult' => '/Home/Pay/unsubscribeResult',                 // 退订-结果页面
    'unPayCallback' => '/Home/Pay/unPayCallback',                         // 退订结果回调
    'orderProductList' => '/Home/Pay/queryOrderProductList',              // 用户订购商品记录页
    'payLockVerifyResult' => '/Home/Pay/payLockVerifyResult',             // 童锁校验回调地址
    'payUnifiedAuthResult' => '/Home/Pay/payUnifiedAuthResult',           // 统一鉴权校验回调地址
    'payShowResult' => '/Home/Pay/payShowResult',                         // 订购结果显示界面
    
     /** 订购模块 */
    'tempPayPage' => '/Home/Pay/tempPayPage',                             // 临时的订购选择页
    
    'custom' => '/Home/Custom/customV1',                     // 自定义背景图
    'searchOrder' => '/Home/Pay/searchOrder',           // 查询及退订                   
    
    /**更多视频（视频集）*/
    'channelIndex'=>'/Home/Channel/channelIndexV13',                      // 一级视频页面
    'secondChannelIndex'=>'/Home/Channel/secondChannelIndexV13',          // 二级视频页面
    'channelList'=>'/Home/Channel/videoListV13',
    
    /*我的模块*/
    'collect'=>'/Home/Collect/indexV1',
    'playRecord'=>'/Home/Channel/historyPlayV1',
    'familyEdit'=>'/Home/Family/myHomeV2',
    'familyMembersEdit'=>'/Home/Family/familyMembersAddEditV1',
    'seekOnLineRecord'=>'/Home/DoctorP2P/doctorCommentV13',
    'orderExpertRecord'=>'/Home/Channel/historyPlayV1',
    'debook'=>'/Home/Pay/searchOrder',
    
    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',
    
    /** 视频问专家记录模块 */
    'expertRecordHome' => '/Home/ExpertRecord/expertRecordHomeV13',          // 问专家记录 - 记录主页
    'expertCase' => '/Home/ExpertRecord/expertCase',                      // 问专家记录 - 病例页
    'expertAdvice' => '/Home/ExpertRecord/expertAdvice',                  // 问专家记录 - 
    'expertRecordSuccess' => '/Home/ExpertRecord/expertRecordSuccess',    // 问专家记录 - 预约成功
    'expertRecordBridge' => '/Home/ExpertRecord/expertRecordBridge',      // 问专家记录 -  
    
    /** 帮助 */
    'helpIndex' => '/Home/Help/helpV1',
    
    /**商城*/
    'store' => '/Home/Store/storeV1',
);");

// 暂时存放，后面修改机制
define('COMMON_IMGS_VIEW', "V2");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V1'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V2'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V1'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式