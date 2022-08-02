<?php
/**
 * Created by PhpStorm.
 * User: czy
 * Date: 2018/7/24
 * Time: 下午6:09
 */

/**
 * 订购相关的配置项
 */
//9.9元 appId 1201080011 productId_month 1200002
//25元 appId 1201080002 productId_month 1200001

define('appId', "1201080001"); //appid
define('key', "99900054");    // old:99900054
define('providerId', "120");  // old:120

define('productId_time', "1200001"); //单次产品ID
define('productId_month', "1200001"); //包月产品ID

// 下面是统一订购接口服务地址
define('USER_ORDER_URL', "http://172.16.147.186:8081/PlatformService/wallet");  //现网统一鉴权订购接口（业务专区/SP使用）
define('USER_ORDER_PROXY_URL', "http://172.16.147.186:8081/PlatformService/wallet");  //现网统一鉴权订购接口（业务专区/SP使用）
//define('USER_ORDER_PROXY_URL', "http://172.31.134.185:10001/PlatformService/wallet");  //现网统一鉴权订购接口（业务专区/SP使用）
define('TIME_ORDER_FUNC', "/pay");  //单次订购方法名
define('MONTH_ORDER_FUNC', "/order"); //包月订购方法名
define('QUERY_ORDER_FUNC', "/has_order"); //鉴权方法名

// 查询用户信息
define('QUERY_USER_INFO_URL', "http://172.31.135.88:8081/PlatformService/iptv/queryUserInfo");

// U点健康计费相关
//define('productId', "201912041522751");  // 渠道号
//define('appKey', "20697b8b44133ec2");    // 密钥
//define('USER_ORDER_URL', "http://172.16.147.85:9001/"); // 接口地址
//define('MONTH_ORDER_FUNC', "api/order/topay"); // 包月订购方法名
//define('QUERY_ORDER_FUNC', "api/order/auth?productid=" . productId); // 鉴权方法名


// 新计费参数（诚毅计费平台）
define('SPID', "99900054");
define('CHANNEL_ID', "SP_SJH00116");
define('USER_ORDER_URL_NEW', "http://10.205.22.158/spaaa/dp/channel/order");

//获取订单接口
//U点健康CPCODE：JKJK000001
//MD5_KEY：709390fa2fe094379bc28dc6265301aec39f88983766d9b849ed6e1e
define('CP_CODE', "JKJK000001");
define('MD5_KEY', "709390fa2fe094379bc28dc6265301aec39f88983766d9b849ed6e1e");
define('USER_GET_ORDER_ID_URL', "http://172.31.134.174:8895/preorder");

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义
