<?php
/**
 * 订购相关的配置项
 */
define('SP_ID', "880080");                                                              // 合作方ID，由局方平台统一分配,
define('PRODUCT_ID', "88008001");                                                       // 商品标识；由局方统一分配，39健康月包（连续包月）25元/月
define('PRODUCT_NAME', "39健康月包（连续包月）");                                           // 商品名称；CP申请计费点时向联通提供

//define("AUTH_BY_ANDROID_SDK", 1);                                                        // 定义鉴权的时候通过安卓平台的sdk

//define("AUTH_USER_WITH_WEB", 1);                                                         // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义


define('ORDER_CALL_BACK_URL', SERVER_HOST."/cws/pay/jiangsudx_ott/callback/index.php");     //现网 - 订购通知回调地址


define('SECRET_KEY', "C3PHdhJQKi7cvZpP53669DbmDMHmm89J");                                       //局方提供的参数，用来验证签名
define('AES', "53T350yOLkAkg3oHaoI1bC==");                                                      //局方提供的参数，

