<?php
/**
 * Created by longmaster
 * Brief: 河南电信EPG
 */

/**
 * 订购相关的配置项
 */
define('SPID', "spaj0080"); //SPID
define('KEY_3DES', "1227F3pT2mn1d446X78W1Y63"); //3DES加密串
define('MD5', "2ML4088WIwCdyC0h"); //MD5加密

define('PRODUCT_ID_25', "productIDa3j00000000000000000829"); //产品ID - "39健康25元续包月" 订购项
define('SERVICE_ID_SINGLE', "99100000122017111017574901239363"); // 统一订购服务编码--单个 ----河南电信此参数无用
define('SERVICE_ID_GROUP', "99100000122017111017575801239364"); // 统一订购服务编码--组合  ----河南电信此参数无用
// 下面是统一订购接口服务地址
define('USER_ORDER_QUERY', "http://222.85.91.211:8296/OrderQuery");  // 统一订购查询地址
define('USER_ORDER_URL', "http://222.85.91.211:8296/UserOrderJYH");  //现网 - 新版订购地址

// 商品ID编号
define("productID_25", 1); // “39健康18元续包月”在局方注册的产品id，用于此产品的单独订购

// 用户向平台方注册
define("USER_LOGIN_TO_SP", "http://222.85.91.211:8296/UserLoginToSP"); // 聚精彩外面进入39健康应用，需要向聚精彩进行注册，不然会出现用户不存在的情况



/*
群公告
河南省电信ITV增值业务平台接口：
    鉴权接口：http://171.14.99.98:7001/hnitv-api/has_order 
    下单接口：http://171.14.99.98:7001/hnitv-api/order 

    说明：
    鉴权接口中，同一个业务下的几个产品的编码要同时送，中间逗号隔开。
    比如，附件猿辅导业务下目前有四个产品，鉴权时，产品编码字段，需要把四个产品编码都要送到ITV平台，只要订购了其中一个，就可以鉴权通过，就不用在订购其他的几个产品就可以观看使用了，保证了产品互斥。qq音乐和新东方相同，后续如果增加了季包年包之类的，鉴权接口要按照同样的方式处理。
*/
define("VENDORC_CODE", "17102081");//供应商编码
define('PRODUCT_ID_PROVINCE', "productIDa3j00000000000000000829"); //产品ID - "39健康25元续包月" 订购项
define("PRODUCT_PRICE_PROVINCE", 2500);//计费金额 //局方配置的3元钱，这个值以分计算
define("Encrypt_3DES", "6cfeb2f13207439090f505d6b3c2ad04");//3des加密秘钥
define('USER_ORDER_AUTH_PROVINCE', "http://171.14.99.98:7001/hnitv-api/has_order?");//鉴权接口
define('USER_ORDER_URL_PROVINCE', "http://171.14.99.98:7001/hnitv-api/order");//订购地址

