<?php
/**
 * 订购相关的配置项
 */
define('APP_ID', "ottsjjk1");                                                            // 提供商标识，由联通平台统一分配
define('SERVICE_ID', "ottsjjk");                                                         // 提供商标识，由联通平台统一分配
define('PRODUCT_ID', "ottsjjkby025@237");                                                // 商品标识；由联通统一分配//203000647021101 下线
define('PRODUCT_NAME', "39健康");                                                         // 商品名称；CP申请计费点时向联通提供
define('CONTENT_ID', "ottsjjk025");                                                      // 应用内计费项ContentID

define("AUTH_BY_ANDROID_SDK", 1);                                                        // 定义鉴权的时候通过安卓平台的sdk

define("AUTH_USER_WITH_WEB", 1);                                                         // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义

define('ORDER_AUTHORIZATION_URL', "http://202.99.114.28:10000/authorizationForCP"); //正式  用户鉴权接口