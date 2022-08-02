<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 甘肃移动 订购参数
// +----------------------------------------------------------------------
// | Author: czy
// | Date: 2018/11/5 9:45
// +----------------------------------------------------------------------

//回调
define('ORDER_CALL_BACK_URL', SERVER_HOST ."/cws/pay/gansuyd/callback/index.php");  //现网 - 订购通知回调地址

// 订购的内容ID
define("CONTENT_ID", "4005456929");
// 订购productId
define("PRODUCT_ID", "158020181212000037");
// 我方的SPID
define("SP_ID", "GSYD_926252_01");

define('ORDER_SERVICE_ORDER_URL', "http://gsydepgpay.bestv.com.cn/epg-pay/cpOrderEntry.jsp?"); //正式订购地址
define('ORDER_SERVICE_PAY_URL', "http://gsydepgpay.bestv.com.cn/epg-pay/pay_selection.html?"); //正式订购地址

define("MSGID", "61237890345");
define('ORDER_VERIFY_USER_URL', "http://117.156.24.246:8990/v2/gs/verify"); //鉴权接口

//未来电视接口
define("AUTH_USER_WITH_WEB", 1);
define("AUTH_BY_ANDROID_SDK", 1);

define('PRODUCT_TYPE', 1); // 当前产品基于产品包鉴权，故该值设置为1，如果为内容鉴权侧为0
define('CONTENT_NAME', ''); //内容名称（注：可选，易视腾方说暂不需要，可传空！）
define('PAY_PHONE', '');