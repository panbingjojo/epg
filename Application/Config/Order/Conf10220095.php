<?php
/**
 * Created by PhpStorm.
 * User: RenJiaFen
 * Date: 2019/09/25
 */

// 现网计费套餐id（备注：“吉林广电”已整合多个套餐项到一个id下管理）
define('PRODUCT_ID', "1100001301");
define('AREA_ID', "10440");
define('SP_ID', "073");

//订购、鉴权现网测试环境地址
// define('ORDER_SERVER_IP', 'http://10.128.7.100'); // 订购服务器地址 - 测试服
define('ORDER_SERVER_IP', 'http://10.128.7.2'); // 订购服务器地址
define('ORDER_SERVER_URL', ORDER_SERVER_IP . ':8008'); // 订购服务器地址
define('SERVICE_AUTH', ORDER_SERVER_IP . ":8088/auth/serviceAuth");  // 鉴权查询接口
define('SERVICE_ORDER_URL', ORDER_SERVER_URL . '/orders/service_order'); // 订购服务器地址
define('GET_CHECK_CODE_URL', ORDER_SERVER_URL . '/orders/checkcode'); // 订购服务器地址
define('PAY_BILL_URL', ORDER_SERVER_URL . '/orders/payBill'); // 订购服务器地址
define('ORDER_STATUS_URL', ORDER_SERVER_URL . '/orders/status'); // 订购服务器地址
define('PRODUCT_INFO_URL', ORDER_SERVER_URL . '/orders/fees'); // 订购服务器地址

define('USER_ORDER_URL', "http://10.128.7.2:8008");  // 计费接口

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义
