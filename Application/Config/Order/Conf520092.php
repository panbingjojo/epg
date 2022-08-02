<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午7:06
 */

define('SPID', '2310');                                                                                 // 商户号
define('ORDER_KEY', '1f80b0300f48c2f16163ec79fba9824c');                                                // 加密秘钥
define('ORDER_URL', 'http://10.255.1.250/index.php/api/api/index/default.shtml');                 // 订购地址
//define('ORDER_URL', 'http://10.255.1.250/index.php/api/besttvapi/index/default.shtml');                 // 订购地址
//define('AUTH_URL', 'http://10.255.1.250/index.php/api/api/authentication/default.shtml');          // 鉴权地址
define('AUTH_URL', 'http://10.255.1.250/index.php/api/api/userproductcheck/default.shtml');          // 鉴权地址
define('CONTENT_ID', '39JKITV20');                                                                      // 内容编号
define('PRODUCT_ID_ITV', '39JK_ITV');                       // 产品ID（现网）- 连续包月
//define('PRODUCT_ID_ITV', 'TYGQ_39JK_JK');                       // 产品ID（现网）- 连续包月
define('PRODUCT_ID_THIRD_48', '39JK_THIRD_48');             // 产品ID（现网）- 第三方支付 （48元/半年）
//define('PRODUCT_ID_THIRD_48', 'TYGQ_39JKBNB_JK');             // 产品ID（现网）- 第三方支付 （48元/半年）
define('PRODUCT_ID_THIRD_96', '39JK_THIRD_96');             // 产品ID（现网）- 第三方支付 （96元/年）
//define('PRODUCT_ID_THIRD_96', 'TYGQ_39JKNB_JK');             // 产品ID（现网）- 第三方支付 （96元/年）
define('PRODUCT_ID_ITV_TEST', '39JK_ITV_TEST');             // 产品ID（测试）- 连续包月
define('PRODUCT_ID_THIRD_TEST', '39JK_THIRD_TEST');         // 产品ID（测试）- 第三方支付
//define('PRODUCT_ID_THIRD_TEST', 'TYGQ_39JKTEST_JK');         // 产品ID（测试）- 第三方支付


//新鉴权地址
define("VENDORC_CODE", "DCGZ");//供应商编码
define('CONTENT_DP_ID', '39JK_ITV_DP001');  //内容ID 垫片
define('Encrypt_3DES', 'b7dc7ee362ed4c5ebbff8dfbc683c9f2');
define('NEW_AUTH_URL', 'http://10.255.12.10:18114/gzitv-api/has_order?');    // 鉴权地址
define('NEW_ORDER_URL', "http://10.255.12.10:18114/gzitv-api/order"); //订购地址


define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义


//专区建设产品信息
define('CONTENT_DP_ID_ZONE', 'YPJK_DP001');  //内容ID 垫片
define('CONTENT_DP_NAME_ZONE', '优品健康垫片');  //内容名称 垫片
