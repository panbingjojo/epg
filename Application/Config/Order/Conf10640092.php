<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午7:06
 */

define("productID_15", 1); // “39健康15元续包月”在局方注册的产品id，用于此产品的单独订购

////////////////////////////////////// 下面是与EPG局方交互时使用的参数常量 ////////////////////////////////////////
define('SPID', "spaj0330"); //SPID
define('KEY_3DES', "olGo7Do2qRwt24031c8mNyn4"); //3DES加密串
define('MD5', "6G233e9EF65I1279 "); //MD5加密
define("PRODUCT_ID_15", "productIDa21j0000000000000001696");//产品-NX39健康15元包月

define('SERVICE_ID_SINGLE', "99100000122017111017574901239363"); // 统一订购服务编码--单个 ----宁夏电信此参数无用
define('SERVICE_ID_GROUP', "99100000122017111017575801239364"); // 统一订购服务编码--组合  ----宁夏电信此参数无用


//订购、鉴权现网测试地址
//define('USER_ORDER_QUERY', "http://124.224.242.243:9296/OrderQuery");  // 鉴权查询接口
//define('USER_ORDER_URL', "http://124.224.242.243:9296/UserOrder");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）

//订购、鉴权现网正式地址--上线使用
define('USER_ORDER_QUERY', "http://124.224.242.243:8296/OrderQuery");  // 鉴权查询接口
define('USER_ORDER_URL', "http://124.224.242.243:8296/UserOrder");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）
