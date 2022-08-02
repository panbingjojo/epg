<?php

/**
 * 该文件用于定义与订购相关的常量参数
 */
define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义

define("AUTH_BY_ANDROID_SDK", 1);

//该配置数据从Con000006拷贝
define('UNSUB_NOTIFY_URL', SERVER_HOST . "/cws/pay/chinaunicom/callback/unsub_notify.php"); // 退订通知地址
define('NOTIFY_URL', SERVER_HOST . "/cws/pay/chinaunicom/callback/index.php"); // 支付通知地址


define('SERVICEID', "23");//服务包id：权益中心分配
define('CHANNELID', "2");//渠道id：权益中心分配

define('QYZX_URL', "http://123.59.206.196:20029");
define('QR_PATH', "http://10.254.59.72:20028/common/qrcode/create");//二维码路径
define('UPLOAD_PATH', "http://123.59.206.196:20029/api/user_vip/sync_iptv");//同步
define('AUTH_PATH', "/api/user_vip/auth"); //鉴权路径
define('CHENK_PATH', "/api/exchange_code/check");//查询权益码数据
define('EQUITY_PATH', "/api/exchange_code/get_equity");//查询权益码数据
define('EXCHANGE_PATH', "/api/exchange_code/exchange");//权益码兑换路径、
define('RECORD_PATH', "/api/exchange_code/equity_record");//权益码兑换记录路径、
