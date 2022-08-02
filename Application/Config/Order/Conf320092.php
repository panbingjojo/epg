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
define('SPID', "spaj0080"); //SPID
define('KEY_3DES', "N17G08b2qZMb0EEdWk8SP3F2"); //3DES加密串
define('MD5', "Q53W468M0IKB6Fl1"); //MD5加密
define('BUSNISS_ID', "businessIDa000000000000000110091"); //业务ID - 表示 "39健康" 业务
define('SERVICE_ID_SINGLE', "99100000122017111017574901239363"); // 服务编码--单个
define('SERVICE_ID_GROUP', "99100000122017111017575801239364"); // 服务编码--组合
define('PRODUCT_ID_18', "productIDa9j00000000000000000552"); //产品ID - "39健康18元续包月" 订购项
define('PRODUCT_ID_20', "productIDa9j00000000000000000553");  //产品ID - "39健康20元包30天" 订购项
// 优品生活大包业务产品码
define('PRODUCT_ID_27', "productIDa13j0000000000000000895"); //产品ID - "优品生活大包资费27元续包月" 订购项
define('PRODUCT_ID_30', "productIDa13j0000000000000000896");  //产品ID - "优品生活大包资费30元包30天" 订购项


// 下面是统一订购接口服务地址
define('USER_ORDER_QUERY', "http://180.100.134.105:8098/iTVAuthOrder/UserAuthWithoutOrder?");  // 鉴权查询接口
//define('USER_ORDER_URL', "http://180.100.134.106:8096/iTVAuthOrder/"); //测试 - 集约AMS统一鉴权订购接口（业务专区/SP使用）
define('USER_ORDER_URL', "http://180.100.134.105:8098/iTVAuthOrder/");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）

// 商品ID编号
define("productID_18", 1); // “39健康18元续包月”在局方注册的产品id，用于此产品的单独订购
define("productID_30", 2); // “39健康20元包30天”在局方注册的产品id，，用于此产品的单独订购
