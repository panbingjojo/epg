<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午7:06
 */

define('PROVIDER_ID', "lm"); // CP/SP供应商在增值平台登记的编码

define('PRODUCT_ID', "lm_ycyl_HD"); // 包月包年产品时传递，如果有多个用逗号分隔
define('PRODUCT_PRICE', 1900); // 15元续包月,19元包30天

// 下面是统一订购接口服务地址与密码
define('KEY_3DES', "b47771bf484140ddb1b65e322358a32c"); // 正式 -- 3DES加密串
define('USER_ORDER_URL', "http://61.191.45.118:7002/itv-api/");  // 正式--统一鉴权定购入口

//define('KEY_3DES', "cdf2909d3a5c4ade9806264c5529ce8c"); // 测试 -- 3DES加密串
//define('USER_ORDER_URL', "http://61.191.45.116:7002/itv-api/"); //测试 - 统一鉴权订购接口（业务专区/SP使用）
