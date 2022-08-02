<?php

// 商品ID编号
define("productID_18", '446'); // “包月”在局方注册的产品id，用于此产品的单独订购

//正式订购地址
define('USER_ORDER_QUERY', "http://119.39.13.149:8082/SPM/Interface/");
//测试订购地址
//define('USER_ORDER_QUERY', "http://223.221.8.102:8083/RHBMS/AAA/authentication.do");

// spId
define('SPID', '39JK');

// 统一播放器收藏、播放记录等接口请求地址
define('UNIFIED_PLAYER_REQUEST_URL', 'http://110.167.132.17:8081/');

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义