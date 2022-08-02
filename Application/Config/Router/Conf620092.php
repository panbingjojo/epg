<?php
/**
 * Created by longmaster.
 * Date: 2018-09-12
 * Time: 10:20
 * Brief: 此文件（或类）用于存放甘肃电信特有路由配置，它在应用运行时，将会与DefaultConf里的配置进行合并，
 *        并且会覆盖掉原来同名的配置。
 */

/**
 * 注册系统中的页面
 * 所有页面需要注册配置
 */
// 甘肃省各地市的区号
define("LANZHOU", "0931"); // 兰州市
define("JIAYUGUAN", "0937"); // 嘉峪关
define("JINCHANG", "0935"); // 金昌市
define("BAIYIN", "0943"); // 白银市
define("TIANSHUI", "0938"); // 天水市
define("WUWEI", "0935"); // 武威市
define("ZHANGYE", "0936"); // 张掖市
define("PINGLIANG", "0933"); // 平凉市
define("JIUQUAN", "0937"); // 酒泉市
define("QINGYANG", "0934"); // 庆阳市
define("DINGXI", "0932"); // 定西市
define("LONGNAN", "0939"); // 陇南市
define("LINXIA", "0930"); // 临夏市
define("GANNAN", "0941"); // 甘南市

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

    'custom' => '/Home/Custom/customV1',                                  // 自定义背景图
    'searchOrder' => '/Home/Pay/searchOrder',                             // 查询及退订
    'dateMark' => '/Home/DateMark/indexV1',                               // 签到 - 主页
    'lottery' => '/Home/DateMark/lotteryV1',                              // 签到 - 抽奖页 

    /**更多视频（视频集）*/
    'channelIndex'=>'/Home/Channel/channelIndexV13',
    'channelList'=>'/Home/Channel/videoListV13',

    /*我的模块*/
    'collect'=>'/Home/Collect/indexV1',
    'playRecord'=>'/Home/Channel/historyPlayV1',
    'familyEdit'=>'/Home/Family/myHomeV2',
    'familyMembersEdit'=>'/Home/Family/familyMembersAddEditV1',
    'orderExpertRecord'=>'/Home/Channel/historyPlayV1',
    'debook'=>'/Home/Pay/searchOrder',

    /** 播放历史 */
    'historyPlay'=>'/Home/HistoryPlay/historyPlayV1',

    /** 数据归档 */
    'healthTestArchivingList' => '/Home/DataArchiving/archivingListV13',

    /** 帮助 */
    'helpIndex' => '/Home/Help/helpV1',

     /** 静态夜间药房 */
    'nightPharmacy' => '/Home/Unclassfield/nightPharmacyV13',

    /** 静态预约挂号 */
    'indexStatic' => '/Home/AppointmentRegister/indexStaticV1',
    'areaListStatic' => '/Home/AppointmentRegister/areaListStaticV1',
    'doctorStatic' => '/Home/AppointmentRegister/doctorStaticV1',
    'doctorDetailStatic' => '/Home/AppointmentRegister/doctorDetailStaticV1',
    'moreHospitalStatic' => '/Home/AppointmentRegister/moreHospitalStaticV1',

);");


// 暂时存放，后面修改机制
define('COMMON_IMGS_VIEW', "V2");     //使用的公用图片套装
define('COMMON_ACTIVITY_VIEW', 'V1'); // 活动页面的模块
define('COMMON_ORDER_VIEW', 'V2'); // 自定义订购页面的模块
define('COMMON_PLAYER_VIEW', 'V8'); // 使用播放器的模式
define('COMMON_HOLD_PAGE_VIEW', 'V1'); // 退出拘留页的模式
