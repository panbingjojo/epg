<?php
/**
 * Created by longmaster
 * Brief: 辽宁电信EPG
* 订购相关的配置项
 */

define('SPID', "39JK"); //SPID
define('KEY_3DES', "SP0000011234567890123456"); //3DES加密串
define('MD5', "telcommd5"); //MD5加密
define('PRODUCT_ID_18', "productIDa9j00000000000000000552"); //产品ID - "39健康18元续包月" 订购项
define('PRODUCT_ID_20', "productIDa9j00000000000000000553");  //产品ID - "39健康20元包30天" 订购项

// 下面是统一订购接口服务地址
define('USER_ORDER_QUERY', "http://10.255.131.177:9292/ServiceAuth/");  // 鉴权查询接口
define('USER_ORDER_URL', "http://10.255.131.177:9296/UserOrderLNCT/");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）

// 商品ID编号
define("productID_18", 1); // “39健康18元续包月”在局方注册的产品id，用于此产品的单独订购
define("productID_30", 2); // “39健康20元包30天”在局方注册的产品id，，用于此产品的单独订购


define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义
