<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 国安广视（康乐养生堂） 订购参数
// +----------------------------------------------------------------------
// | Author: czy
// | Date: 2018/11/5 9:45
// +----------------------------------------------------------------------

//回调
define('ORDER_CALL_BACK_URL', SERVER_HOST . "/cws/pay/guangxigd/callback/apk_index.php");  //现网 - 订购通知回调地址

/** 广西广电 计费配置-->正式 */

define('PRODUCT_ID_MON', "IDC_gdyzhyljcb"); //产品ID,可用于查询包月、促销产品
define('PRODUCT_ID_MON_25', "50077835"); //产品ID,可用于查询包月,25元

define('PRODUCT_ID_SINGLE', "404550068715"); //一次性消费产品
define('PRODUCT_UNIT_PRICE', "5.00"); //产品单价-测试环境使用
define('PRODUCT_QTY', "1"); //开通数量
define('PRODUCT_NAME', "广电云智慧医疗"); //产品名称-测试环境使用
define('PRODUCT_PARTNER', "1000000069"); //商户ID,广西广电网络提供
define("APP_KEY", "31f101e5d75ffde3969afcd0b5b06988");//局方提供的appKey值，用于订购地址加密，视频ID绑定产品包（包年，包月）
define('CP_ID', "GDYZHYL"); //商户ID,广西广电网络提供
define('SPR_ID', "100021111"); //单次计费使用参数，广电使用游戏的接口来处理
define('USER_ORDER_QUERY', "http://10.0.11.38/web-lezboss-dubbo/service");  //正式地址
define("APP_INDEX_URL", "http://10.0.4.170:39001/apk/epg-apk-for-lws-450004/index.php");//39健康首页入口地址

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义

define("AUTH_BY_ANDROID_SDK", 1);                                                        // 定义鉴权的时候通过安卓平台的sdk
