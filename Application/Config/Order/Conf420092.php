<?php
/**
 * Created by longmaster.
 * Date: 2018-08-31
 * Time: 13:59
 * Brief: 此文件（或类）用于存放湖北电信局方的计费相关信息
 */
define("productID_18", 1); // “39健康15元续包月”在局方注册的产品id，用于此产品的单独订购

////////////////////////////////////// 下面是与EPG局方交互时使用的参数常量 ////////////////////////////////////////
define('SPID', "spaj0080"); //SPID
define('KEY_3DES', "80fTJwbl3Jv7B77i0501Okb0"); //3DES加密串
define('MD5', "4q91154FQd923J05"); //MD5加密
define("PRODUCT_ID_18", "productIDa3j00000000000000000880"); // JY39健康  18元包月（HB）
define("PRODUCT_ID_JD_30", "productIDa9j00000000000000001747"); // JY39健康  30元包30天（HB）
define("PRODUCT_ID_JD_25", "productIDa9j00000000000000001746"); // JY39健康  25元包月（HB）

//订购、鉴权现网测试地址
//define('USER_ORDER_QUERY', "http://124.224.242.243:9296/OrderQuery");  // 鉴权查询接口
//define('USER_ORDER_URL', "http://124.224.242.243:9296/UserOrder");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）

//订购、鉴权现网正式地址--上线使用
define('USER_ORDER_QUERY', "http://192.168.154.15:8296/OrderQuery");  // 统一订购查询地址
define('USER_ORDER_URL', "http://116.210.254.194:8296/UserOrderJYH");  //现网 - 新版订购地址
//2021-01-27割接到自研平台支付订购
define('SPID_NEW', "001"); //自研平台SPID
define('SERVICE_ID_ZX', "39jk");          // 中兴服务ID
define('SERVICE_ID_HW', "387");          // 华为服务ID
define('CONTENT_ID', "00000020260014904178");          // 内容ID
define('CONTENT_TYPE_ZX', "26");          // SP页面：中兴平台固定传入26，华为平台固定传入100
define('CONTENT_TYPE_HW', "100");          // SP页面：中兴平台固定传入26，华为平台固定传入100
define('CONTENT_NAME', "39健康");          // 内容名称
//define('PRODUCT_ID', "productIDa30000000880");//当前省计费产品包
define('PRODUCT_ID', "productIDa9j000001746");//用于切换产品
//define('PRODUCT_ID', "productIDa9j000001747");//用于切换产品

define('SERVICE_ID_AFM', "99180001000000110000000000000685");//爱父母服务代码
define('CONTENT_ID_AFM', "00000020260015386199");//爱父母内容代码
define('PRODUCT_ID_AFM', "lyhyby");//爱父母产品代码
define('CONTENT_NAME_AFM', "爱父母");//内容名称

define('PRODUCT_ID_JK_18', "productIDa30000000880");//39健康包
define('PRODUCT_ID_CX_25', "productIDa9j000001746");//39健康促销包:productIDa9j000001746
define('PRODUCT_ID_DAY_30', "productIDa9j000001747");//39健康30天:productIDa9j000001747
define('USER_ORDER_URL_NEW', "http://116.210.253.196/epg-service/epg/pay");  //自研平台支付订购入口地址


define('USER_AUTH_URL_ZTE', 'http://121.60.255.2:9347/VaServiceAuthReq');    // 正式服鉴权地址
define('USER_AUTH_URL_HW', 'http://116.210.252.23:33500/ACS/services/VASService');    // 正式服鉴权地址
define('USER_AUTH_URL_HW_3', 'http://116.210.251.146:33200/ACS/services/VASService');    // 正式服鉴权地址