<?php
/**
 * Created by longmaster.
 * Date: 2018-08-31
 * Time: 13:59
 * Brief: 此文件（或类）用于存放甘肃电信局方的计费相关信息
 */
define("productID_18", 1); // “39健康20元续包月”在局方注册的产品id，用于此产品的单独订购

////////////////////////////////////// 下面是与EPG局方交互时使用的参数常量 ////////////////////////////////////////
define('SPID', "spaj0128"); //SPID
define('KEY_3DES', "743jJ48st8fYo14F4Kz7h1e4"); //3DES加密串
define('MD5', "mIPvIa19T78C6N39"); //MD5加密
define("PRODUCT_ID_18", "productIDa3j00000000000000001200"); // JY39健康  20元包月（HB）

//订购、鉴权现网地址
//define('USER_ORDER_QUERY', "http://118.180.22.58:9296/OrderQuery");  // 鉴权查询接口
define('USER_ORDER_QUERY', "http://118.180.22.1:8296/OrderQuery");  // 鉴权查询接口
define('USER_ORDER_URL', "http://118.180.22.59:5298/iTVAuthJYH/UserAuthOrder");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）
define('USER_ORDER_URL_CESI', "http://118.180.22.57:4081/iTVAuthJYH/UserAuthOrder");  //测试用鉴权地址
