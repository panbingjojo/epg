<?php
/**
 * Created by PhpStorm.
 * User: czy
 * Date: 2018/7/24
 * Time: 下午6:09
 */

//播放相关的
//define('VIDEO_AUTH_URL', "http://ns.gcable.cn/SelectionStart");              //播放鉴权接口
//define('GET_VIDEO_INFO', "http://ns.gcable.cn/GetItemData");           //获取视频信息
define('VIDEO_AUTH_URL', "http://172.16.241.29/u1/SelectionStart");              //播放鉴权接口
define('GET_VIDEO_INFO', "http://172.16.241.29/u1/GetItemData");           //获取视频信息
define('REQUEST_PLAY', "http://gw.vodserver.local/RequestPlay");           //播放请求接口（获取播放地址）
define('START_PLAY', "http://gw.vodserver.local/Play");                     //请求开始播放
define('PAUSE_PLAY', "http://gw.vodserver.local/Pause");                     //请求开始播放

//订购相关
/**
 * 订购相关的配置项
 */
//9.9元 appId 1201080011 productId_month 1200002
//25元 appId 1201080002 productId_month 1200001

define('appId', "1201080002"); //appid
define('key', "99900054");
define('providerId', "120");

define('productId_time', "1200001"); //单次产品ID
define('productId_month', "1200001"); //包月产品ID
define('check_productId_time', "1200001"); //鉴权单次产品ID
define('check_productId_month', "1200001"); //鉴权包月产品ID

// 下面是统一订购接口服务地址
define('USER_ORDER_URL', "http://172.16.147.186:8081/PlatformService/");  //现网统一鉴权订购接口（业务专区/SP使用）
define('USER_ORDER_PROXY_URL', "http://172.31.134.185:10017/PlatformService/");  //现网统一鉴权订购接口（业务专区/SP使用）通过代理服务器
define('TIME_ORDER_FUNC', "wallet/pay");  //单次订购方法名
define('MONTH_ORDER_FUNC', "wallet/order"); //包月订购方法名
define('QUERY_ORDER_FUNC', "wallet/has_order"); //鉴权方法名
define('GET_USER_CONFIG', "iptv/androidLogin"); //获取登录用户信息（通过从网关获取的信息获取）

// 查询用户信息
define('QUERY_USER_INFO_URL', "http://172.31.135.88:8081/PlatformService/iptv/queryUserInfo");

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
