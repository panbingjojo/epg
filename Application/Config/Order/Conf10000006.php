<?php
/**
 * 计费参数
 */


/**
 * 订购相关的配置项
 */

// 现网计费信息
define('SPID', "96596");                    // 合作伙伴ID
define('SERVICE_ID', "jkmfby25");          // 服务ID
define('CONTENT_ID', "jkmf");          // 内容ID
define('PRODUCT_ID', "jkmfby25");             // 产品ID 【鉴权时不带@地区码】 天津：sjjklx@201 山东：sjjklx@216 山西: sjjklx@207 黑龙江：sjjklx@211 河北: sjjklx@206 辽宁: sjjklx@209 内蒙: sjjklx@208

/****************************************2021-02-25割接到新平台--新地址***************************************/
define('ORDER_AUTHORIZATION_URL', "http://202.99.114.14:10020/ACS/vas/authorization"); //正式  用户鉴权接口
define('ORDER_VERIFY_USER_URL', "http://202.99.114.14:10020/ACS/vas/verifyuser"); //正式  用户鉴权接口
define('ORDER_SERVICE_ORDER_URL', "http://202.99.114.14:10020/ACS/vas/serviceorder"); //正式  用户身份确定
define('ORDER_SERVICE_CANCEL_ORDER_URL', "http://202.99.114.28:10000/orderProduct"); //正式  产品取消续订接口

define('SHA256_SECRET_KEY', "huangfei"); //正式  查询消费记录SHA256加密密钥

// 商品ID编号
define("PRODUCT_ID_15", 1); // “39健康25元续包月”在局方注册的产品id，用于此产品的单独订购
