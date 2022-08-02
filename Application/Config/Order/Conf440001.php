<?php
/**
 * 订购相关的配置项
 */
define('APP_ID_FOR_NAN_CHUAN', "guiyanglangma_001");                                     // 提供商标识，由南传扣费平台统一分配
define('PRODUCT_ID', "0203000700021101");                                                 // 商品标识；由移动统一分配//203000647021101 下线
define('PRODUCT_NAME', "39健康");                                                         // 商品名称；CP申请计费点时向移动提供
define('APP_KEY_FOR_NAN_CHUAN', "guiyanglangma20190912");                                // 由南传扣费平台统一分配
define("PAY_ORDER_URL", "http://183.235.16.126:9004/pay/payment");                       // 由南传扣费平台统一分配

//回调
define('ORDER_CALL_BACK_URL', SERVER_HOST . "/cws/pay/guangdongyd/callback/index.php");  // 现网 - 订购通知回调地址

//年包内容 billing
define('PRODUCT_ID_YEAR', "0203000700051101");                                           // 年包商品标识；由移动统一分配
//define('MOBILE_COMMIT_YEAR', "0=prod.10086000040519|2=prod.10086000040520");           // 年包商品标识；由移动统一分配
define('MOBILE_COMMIT_YEAR', "0=prod.10086000040519|2=prod.10086000012231");             // 年包商品标识；由移动统一分配

define("AUTH_BY_ANDROID_SDK", 1);                                                        // 定义鉴权的时候通过安卓平台的sdk

define("AUTH_USER_WITH_WEB", 1);                                                         // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义

/**
 * 易视腾融合包订购项配置
 */
define('APP_ID_FOR_YST', "GYLMXXJS");                                                     // 提供商标识，由易视腾平台统一分配
define('APP_KEY_FOR_YST', "SJJK");                                                       // 由易视腾平台统一分配
define("PRODUCT_ID_FOR_YST","0299999999021101");                                          //商品标识，广东移动融合包（易视腾）
//Ysten 融合包订购回调接口
define('ORDER_CALL_BACK_URL_FOR_YST', SERVER_HOST . "/cws/pay/guangdongyd/callback/index_yisten.php");  // 现网 - 订购通知回调地址