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
/////////////////////// begin : 聚精彩计费接口 ////////////////////////////////
define('SPID', "spaj0080"); //SPID
define('KEY_3DES', "0904j2OTat056hm41875z737"); //3DES加密串
define('MD5', "1M909sY3c236JP01"); //MD5加密
define('PRODUCT_ID_18', "productIDa3j00000000000000000915"); //产品ID - "39健康18元续包月" 订购项
define('productID_18', "1");
// 下面是统一订购接口服务地址
define('USER_ORDER_QUERY', "http://192.168.142.15:8296/OrderQuery");  // 鉴权查询接口
define('USER_ORDER_URL', "http://10.255.6.17:8296/UserOrderJYH");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）
/////////////////////// end : 聚精彩计费接口 ////////////////////////////////

/////////////////////// begin : 海南省内鉴权计费 ////////////////////////////////
define('PROD_NAME', "聚精彩_39健康");
define('SP_ID', "JYPT");
define('SP_PWD', "E10ADC3949BA59ABBE56E057F20F883E"); // 通过对123456进行md5加密，再转成大写：strtoupper(md5(123456))
define('BUSI_ID', "JYPTEDU");
define('PRODUCT_ID_HN', "productIDa30000000915"); // 省内计费项
define('USER_ORDER_QUERY_HN', "http://121.58.0.92/iptvsp/jsp/interface/prodCheckForZY.jsp");  // 鉴权URL
define('USER_ORDER_URL_HN', "http://121.58.0.92/iptvsp/jsp/interface/epg/prodOrderCreate.jsp?");  // 计费URL

define("RESULT_CODE", "return Array(
    /** 局方返回 文字描述 */
    '0' => '成功',
    '1' => '用户二次确定时取消订购',
    '2' => '订购失败，参数丢失',
    '9' => '订购失败，重复订购（包月类产品）',
    '11' => '获取参数SP订单号错误',
    '12' => '获取参数用户ID错误',
    '13' => '获取参数SPID错误',
    '14' => '获取参数SP接口密码错误',
    '15' => '不能使用SP接口初始密码办理业务',
    '16' => '获取参数产品ID错误',
    '17' => '获取参数业务ID错误',
    '18' => '获取参数订购数量错误',
    '19' => '获取参数返回URL错误',
    '20' => '验证SP失败，密码错或当前SP状态为不可用',
    '21' => '验证业务失败，当前业务状态为不可用或还未通过审核',
    '22' => '验证产品失败，当前产品状态为不可用或还未通过审核',
    '99' => '订购失败,其他错误',
);");
/////////////////////// end : 海南省内鉴权计费 ////////////////////////////////



/////////////////////// begin : 海南省内鉴权计费V1 ////////////////////////////////
// 异步回调地址：http://202.100.207.161:10202/index.php/Home/Pay/asyncCallBack
define('PRODUCT_ID_V1', "productIDa30000000915"); // 省内计费项
define('CHANNEL_ID_V1', "39JK001"); // 通道ID，为bms平台下发
define('USER_ORDER_QUERY_V1', "http://10.255.53.229:8001/product/auth");  // 鉴权URL
define('USER_ORDER_URL_V1', "http://10.255.53.244:8002/hainan_payEPG/index.html");  // 计费URL
define('KEY_3DES_V1', "HK6Jy6OrfB7ZkZg6WD/rQIZfNeFn+nrrXQCTfN7Cv3cAADoAAAAAAOPCv3cAAAAAAM35CFzU/wsIAAAAVNT/C8LWWgwUwXwDkMB8A+GrWgzEwXwDlFzAd3AgvncAAAAAZAYAAK8nVQwUwXwDZAAAAEAAAABn0/8LXNT/C9PAWgwUwXwDQAAAAATBfAMJTRN4SLuBCnzBfAMAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAABEWnGJorzX8xAuTW1+kKO3zOL5ESpEX3uYttX1BhgrP1RqgZmyzOcDID5dfY6gs8fc8gkhOlRvi6jG5QUWKDtPO7f8CyC1YQxQvmEMAAAAAASCwBckn0F6gAAAAGjT/ws="); //3DES加密串
/////////////////////// end : 海南省内鉴权计费V1 //////////////////////////////////