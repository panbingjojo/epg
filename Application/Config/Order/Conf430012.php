<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 青海 订购参数
// +----------------------------------------------------------------------
// | Author: LongMaster
// | Date: 2019/4/16 18:00
// +----------------------------------------------------------------------
// IP地址 -- BO鉴权 -- 测试环境
// define('BO_AUTH_IP', "http://172.16.64.243:9944");
// IP地址 -- BO鉴权 -- 正式环境
define('BO_AUTH_IP', "http://172.16.64.239:8080");
//IP地址 -- 登录
define('STB_LOGIN_URL', BO_AUTH_IP . "/BO/STBLogin");
// IP地址 -- 鉴权 -- 正式环境
define('AUTHENTICATION_URL', BO_AUTH_IP . "/BO/aaa");

// IP地址 -- 订购 -- 测试环境地址
// define('USER_ORDER_URL', "http://172.16.21.9:7002/payplatform/prodorder/prod-order-tv!gateway");
// IP地址 -- 订购 -- 正式环境地址
define('USER_ORDER_URL', "http://172.16.21.4:7002/payplatform/prodorder/prod-order-tv!gateway");

// 常量 -- 产品ID -- 包月
define('PRODUCT_MONTH', "79608744");
// 常量 -- 产品ID -- 包年
define('PRODUCT_YEAR', "79608744");
// 常量 -- 用户标识
define('SPID', "239");
// 常量 -- 渠道编码
define('CLIENT_CODE', "109999068");
// 常量 -- 渠道接入密码
define('CLIENT_PWD', "B35421396F3FAF73D500946E1D273FD4");
// 常量 -- 交易密钥
define('PRIVATE_KEY', "4774ED9F4D719941B42BFBF9427B945B");

