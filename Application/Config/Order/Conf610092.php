<?php
/**
 * Created by longmaster
 * Brief: 陕西电信EPG
* 订购相关的配置项
 */

define('SPID', "cpaj0038"); //SPID
define('KEY_3DES', "X66M2AQW1209CE16d7867BN0"); //3DES加密串
define('MD5', "9YZ96x8l68X04StR"); //MD5加密
//define('PRODUCT_ID_25', "productIDa3j00000000000000001333");  //产品ID - "25元续包月" 订购项
//define('PRODUCT_ID_30', "productIDa3j00000000000000001334"); //产品ID - "30元包30天" 订购项
//define('PRODUCT_ID_360', "productIDa3j00000000000000001335");  //产品ID - "360元包年" 订购项
define('PRODUCT_ID_25', "1021_p5");  //产品ID - "25元续包月" 订购项
define('PRODUCT_ID_30', "1021_p4"); //产品ID - "30元包30天" 订购项
define('PRODUCT_ID_360', "1021_p6");  //产品ID - "360元包年" 订购项
// 下面是统一订购接口服务地址
define('USER_ORDER_QUERY', "http://113.136.205.44:9292/ServiceAuth");  // 鉴权查询接口
define('USER_ORDER_URL', "http://113.136.205.44:9081/iTVAuthJYH/UserAuthOrder");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）
define('SERVICE_ID_SINGLE', "1021_s1002"); // 统一订购服务编码--单个

// 商品ID编号
define("productID_18", 1); // “39健康18元续包月”在局方注册的产品id，用于此产品的单独订购
define("productID_30", 2); // “39健康20元包30天”在局方注册的产品id，，用于此产品的单独订购

//新订购接口参数
define("CHANNEL_ID", "288"); //渠道ID //288测试ID
define("CHANNEL_KEY", "12345678"); //密钥 //12345678 测试
//define('USER_ORDER_AUTH', "http://113.136.202.123:6034/orderInterface/order/orderRelationSearch");  //正式地址 鉴权查询接口
define('USER_ORDER_AUTH', "http://113.136.202.40:6034/orderInterface/auth/useauth");  //测试 鉴权查询接口
define('PRODUCT_ID_P8', "1021_p8");  //聚精彩VIP单月
define('PRODUCT_ID_P9', "1021_p9"); //聚精彩VIP包月(续订购)
define('PRODUCT_ID_P10', "1021_p10"); //聚精彩VIP季度包
define('PRODUCT_ID_P11', "1021_p11"); //聚精彩VIP半年包
define('PRODUCT_ID_P12', "1021_p12"); //聚精彩VIP年包
define('PRODUCT_ID_TEST', "1021_s1003"); //测试
