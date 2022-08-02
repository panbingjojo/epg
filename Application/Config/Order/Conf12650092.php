<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |新疆电信EPG—天天健身计费相关
 * +----------------------------------------------------------------------+
 * | Author: fqw                                                         |
 * | Date:2020/08/21 17:07                                               |
 * +----------------------------------------------------------------------+
 */
//正式订购相关参数
define("productID_10", '83000007'); // “包月”在局方注册的产品id，用于此产品的单独订购
//define("productID_365", '83000004'); // “包年”在局方注册的产品id，用于此产品的单独订购
//define("productID_1", '83000005'); // “包日”在局方注册的产品id，用于此产品的单独订购
//define("productID_7", '83000006'); // “包周”在局方注册的产品id，用于此产品的单独订购
define("Encrypt_3DES", "ef0862cb7ce640f0bf3db1b54304a70d");//3des加密秘钥
//define("PRODUCT_PRICE", 2900);//计费金额 //局方配置的29元钱，这个值以分计算
//define("PRODUCT_PRICE_365", 24000);//计费金额 //局方配置的240元钱，这个值以分计算
//define("PRODUCT_PRICE_1", 300);//计费金额 //局方配置的3元钱，这个值以分计算
define("PRODUCT_PRICE_7", 2000);//计费金额 //局方配置的9元钱，这个值以分计算
define("VENDORC_CODE", "GYLM");//供应商编码
define('USER_ORDER_AUTH', "http://202.100.170.235:7001/xjitv-api/has_order?");//鉴权接口
define('USER_ORDER_QUERY', "http://202.100.170.235:7001/xjitv-api/order");//订购地址

//测试订购相关参数
//define("productID_10", '3251263'); // “包月”在局方注册的产品id，用于此产品的单独订购 --商品ID编号
//define("Encrypt_3DES", "ef14eea669f8448bbc9f328c7e9334ce");//3des加密秘钥
//define("PRODUCT_PRICE", 1000);//计费金额 //局方配置的10元钱，这个值以分计算
//define("VENDORC_CODE", "gylm");//供应商编码
//define('USER_ORDER_AUTH', "http://202.100.170.237:9001/xjitv-api/has_order?");//鉴权接口
//define('USER_ORDER_QUERY', "http://202.100.170.237:9001/xjitv-api/order");//订购地址