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
include_once('./Application/Config/Rule/Conf'.CARRIER_ID.'.php');

// 现网计费信息
define('SPID', "96596");                     // 合作伙伴ID
define('SERVICE_ID', "qsldcqby15");          // 服务ID
define('CONTENT_ID', "");                    // 内容ID
define('PRODUCT_ID', "qsldcqby015");         // 产品ID 【鉴权时不带@地区码】 天津：sjjklx@201 山东：sjjklx@216 山西: sjjklx@207 黑龙江：sjjklx@211 河北: sjjklx@206 辽宁: sjjklx@209 内蒙: sjjklx@208

// 天津专用入口计费信息
define('SERVICE_ID_TJ', "sjjktj");           // 服务ID -- 天津专用
define('CONTENT_ID_TJ', "sjjktj1");          // 内容ID -- 天津专用
define('PRODUCT_ID_TJ', "sjjktj@201");       // 产品ID -- 天津专用

/****************************************2021-02-25割接到新平台--新地址***************************************/
define('ORDER_AUTHORIZATION_URL', "http://202.99.114.14:10020/ACS/vas/authorization"); //正式  用户鉴权接口
define('ORDER_VERIFY_USER_URL', "http://202.99.114.14:10020/ACS/vas/verifyuser"); //正式  用户鉴权接口
define('ORDER_SERVICE_ORDER_URL', "http://202.99.114.14:10020/ACS/vas/serviceorder"); //正式  用户身份确定
define('ORDER_SERVICE_QUERY_ORDER_PRODUCT_URL', "http://202.99.114.14:10000/getOrders"); //正式  获取已订购产品列表接口
define('ORDER_SERVICE_QUERY_CONSUME_URL', "http://202.99.114.28:10000/getConsumption"); //正式  获取用户消费记录接口
define('ORDER_SERVICE_CANCEL_ORDER_URL', "http://202.99.114.28:10000/orderProduct"); //正式  产品取消续订接口

// 直接订购--不通过局方计费页的接口
define('ORDER_DIRECT_PAY_URL', "http://202.99.114.14:35820/ACS/vas/userOrder"); //正式  用户计费接口

define('SHA256_SECRET_KEY', "huangfei"); //正式  查询消费记录SHA256加密密钥

// 商品ID编号
define("PRODUCT_ID_15", 1); // “39健康15元续包月”在局方注册的产品id，用于此产品的单独订购
define("PRODUCT_ID_20", 2); // “39健康20元包30天”在局方注册的产品id，，用于此产品的单独订购

define('SELF_MD5', 'lm123789'); // 我们自己的md5串

// 数据上报相关
define('CPID', "lmjf");  // 合作伙伴ID
define('REPORT_APP_ID', 'sjjk');// 数据上报应用ID
//define('SEND_USER_BEHAVIOUR_URL', "http://202.99.114.62:10000/externalDataNotify");  // 镜像
define('SEND_USER_BEHAVIOUR_URL', "http://202.99.114.28:10000/externalDataNotify");  // 现网

// 童锁相关
define('APP_ID', 'cp0026');                 // appId
define('APP_KEY', 'wer');                    // appKey
//河南-童锁现网
define('PAY_LOCK_VERIFY_URL', 'http://202.99.114.14:15081/payLock/payVerify.html');   // 童锁支付校验接口地址
define('PAY_LOCK_OPEN_URL', 'http://202.99.114.14:15081/payLock/lockOpen.html');      // 童锁打开接口地址
define('PAY_LOCK_CLOSE_URL', 'http://202.99.114.14:15081/payLock/lockClose.html');    // 童锁关闭接口地址
define('PAY_LOCK_QUERY_URL', 'http://202.99.114.14:15081/hn/querySafetylockSts');    // 童锁状态查询接口地址
//河南-童锁测试
//define('PAY_LOCK_VERIFY_URL', 'http://202.99.114.71:25081/payLock/payVerify.html');   // 童锁支付校验接口地址
//define('PAY_LOCK_OPEN_URL', 'http://202.99.114.71:25081/payLock/lockOpen.html');      // 童锁打开接口地址
//define('PAY_LOCK_CLOSE_URL', 'http://202.99.114.71:25081/payLock/lockClose.html');    // 童锁关闭接口地址
//define('PAY_LOCK_QUERY_URL', 'http://202.99.114.14:15081/hn/querySafetylockSts');    // 童锁状态查询接口地址
// 统一认证平台
define('PAY_AUTH_HD_URL', 'http://202.99.114.14:35666/cap/h5/auth-hd.html');        // 统一认证地址-高清
define('PAY_AUTH_SD_URL', 'http://202.99.114.14:35666/cap/h5/auth-sd.html');        // 统一认证地址-标清
define('PAY_AUTH_KEY', 'dda976a3df663d25');                                         // 统一认证密钥

define("AUTH_USER_CLASS_NAME", "AuthUser000051"); // PHP端接口鉴权的类名

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义