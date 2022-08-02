<?php
/**
 * Created by longmaster
 * Brief: 中国联通EPG
 */

/**
 * 注册系统中的页面, 进行路由配置
 * 所有页面需要注册配置
 */
define("SPECIAL_VIEW_PAGES", "return array(
    // TODO在这儿增加配置项
    'home' => '/Home/Main/homeV21',                                       // 主页 - 推荐页
      
    /** 订购模块 */
    'orderCallback' => '/Home/Pay/payCallback',                           // 订购结果回调
    'asyncOrderCallback' => '/Home/Pay/asyncCallBack',                    // 异步结果回调
    'directPay' => '/Home/Pay/directPay',                                 // 订购直接支付通过本地post的方式
        
    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',    
   
     /** 健康视频 */
    'healthVideoList' => '/Home/HealthVideo/videoListV10',                // 健康视频首页
    'healthVideoSet' => '/Home/HealthVideo/videoSetV10',                  // 健康视频连续剧
    'channelList'=>'/Home/HealthVideo/videoSetV10', 
     
    /** 图文栏目 */
    'graphicColumn'=>'/Home/GraphicColumn/graphicColumn',
    
    /** 我的家模块 */
   'familyEdit' => '/Home/Family/myHomeV2',                               // 我的家 - 主页
   'familyMembers'=>'/Home/Family/familyMembersEditorV1',
   'familyMembersAdd' => '/Home/Family/familyMembersAddV1',               // 我的家 - 家庭成员添加
   
    /** 订购模块 */
    'orderHome' => '/Home/Pay/indexV1',                                   // 订购主页
);");

define('COMMON_SPLASH_INTENT_TYPE', '1'); // 欢迎页到专辑和活动的跳转模式