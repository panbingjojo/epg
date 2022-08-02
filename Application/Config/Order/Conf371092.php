<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午6:09
 */

/**
 * 订购相关的配置项
 */

//define('USER_ORDER_URL', 'http://150.138.11.100:9295/UserOrderSD');              // 测试服订购地址
define('USER_ORDER_URL', 'http://150.138.11.98:8396/UserOrderSD');                 // 正式服订购地址
// define('USER_AUTH_URL', 'http://150.138.11.97:9293/services/ServiceInterface'); // 测试服鉴权地址
define('USER_AUTH_URL', 'http://150.138.11.97:8391/services/ServiceInterface?wsdl');    // 正式服鉴权地址

// 修改内容 -- 应局方要求，修改鉴权订购地址
//define('USER_ORDER_URL_NEW', 'http://150.138.11.100:9295/UserOrderSD');              // 新正式服订购地址
//define('USER_AUTH_URL_NEW', 'http://150.138.11.100:9293/services/ServiceInterface?wsdl');    // 新正式服鉴权地址
define('PRODUCT_ID','');
define('CONTENT_CODE', '2110MAMS000000011612857872982000');
define('SPID', 'spa00003');
define('SPName', '贵阳朗玛信息');
define('KEY', '2ws3ed4rfaq16yh5tg3');
define('CLICK_CONTENT_INFO_KEY', 'staryea'); // 数据上报探针字段KEY
// define('CLICK_CONTENT_INFO_URL', 'http://150.138.11.100:9293/getClickContentInfo'); // 数据上报探针URL


define("AUTH_USER_WITH_WEB", 1);                                                       // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义
