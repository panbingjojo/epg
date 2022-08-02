<?php
/**
 * Created by PhpStorm.
 * User: RenJiaFen
 * Date: 2020/8/11
 * Time: 下午6:09
 */

/**
 * 订购相关的配置项
 */
define("productID_18", 1); // “39健康15元续包月”在局方注册的产品id，用于此产品的单独订购

////////////////////////////////////// 下面是与EPG局方交互时使用的参数常量 ////////////////////////////////////////
define('SPID', "spa00042"); //SPID
define('SP_KEY', "R0iR4GPyB2N4rVQ8YC5J0973"); //SP密钥
define('productID_OneMonth', "a3100000000000000000536");  //单包月
define('productID_ContMonth', "a3100000000000000000537"); //连续包月
define('productID_QuarPack', "a3100000000000000000538");  //包季度
define('productID_YearPack', "a3100000000000000000539");  //包年

define("AUTH_USER_WITH_WEB", 1);                          // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义
