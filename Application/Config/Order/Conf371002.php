<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 山东电信 订购参数
// +----------------------------------------------------------------------
// | Author: czy
// | Date: 2018/11/5 9:45
// +----------------------------------------------------------------------

//回调
define('ORDER_CALL_BACK_URL', SERVER_HOST ."/cws/pay/shandongdx_haikan/callback/index.php");  //现网 - 订购通知回调地址

//define('USER_ORDER_URL', 'http://150.138.11.100:9295/UserOrderSD');              // 测试服订购地址
define('USER_ORDER_URL', 'http://150.138.11.98:8396/UserOrderSD');              // 正式服订购地址
define('USER_AUTH_URL', 'http://150.138.11.97:8391/services/ServiceInterface?wsdl');    // 正式服鉴权地址

// 修改内容 -- 局方要求替换订购和鉴权的服务器IP
//define('USER_ORDER_URL', 'http://150.138.11.100:9295/UserOrderSD');              // 新正式服订购地址
//define('USER_AUTH_URL', 'http://150.138.11.100:9293/services/ServiceInterface?wsdl');    // 新正式服鉴权地址
// define('PRODUCT_ID', '6010000008');
define('PRODUCT_ID', '');
define('CONTENT_CODE', '2110MAMS000000011612857872982000');
define('SPID', 'spa00003');
define('SPName', '贵阳朗玛信息');
define('KEY', '2ws3ed4rfaq16yh5tg3');

define('CLICK_CONTENT_INFO_KEY', 'staryea');                                        // 数据上报探针字段KEY
define('CLICK_CONTENT_INFO_URL', 'http://150.138.11.100:9293/getClickContentInfo'); // 数据上报探针URL

define("AUTH_BY_ANDROID_SDK", 1);                                                   // 定义鉴权的时候通过安卓平台的sdk

define("AUTH_USER_WITH_WEB", 1);                                                    // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义

