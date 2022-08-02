<?php

/**
 * 该文档用于定义与订购相关的常量参数
 */

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义

define('ORDER_CALL_BACK_URL', SERVER_HOST ."/cws/pay/anhuiyd_newtv/callback/index.php");  //现网 - 订购通知回调地址