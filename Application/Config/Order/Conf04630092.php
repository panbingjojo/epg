<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午7:06
 */

// 商品ID编号
define("productID_5", '540358100500'); //按次收费5元
define("productID_10", '540358101000'); //按次收费10元
define("productID_20", '540358302000'); //连续包月
define("productID_59", '540358805900'); //季包
define("productID_99", '540358909900'); //半年包
define("productID_189", '540358418900'); //年包

//正式订购地址
define('USER_ORDER_QUERY', "http://223.221.8.102:8082/RHBMS/AAA/authentication.do");
//测试订购地址
//define('USER_ORDER_QUERY', "http://223.221.8.102:8083/RHBMS/AAA/authentication.do");

// spId
define('SPID', '39JK');

// 统一播放器收藏、播放记录等接口请求地址
define('UNIFIED_PLAYER_REQUEST_URL', 'http://110.167.132.17:8081/');

//金币查询接口
define('GOLD_COIN_QUERY_INTERFACE', 'http://223.221.36.218:10015/api/data/user/load?');

//订购、购买
define('GOLD_COIN_CARDS_ADD', 'http://223.221.36.218:10015/api/data/user/cards/change');
