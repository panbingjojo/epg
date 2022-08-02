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

//新鉴权地址
define('SPID', '2310');                                                                                 // 商户号
define("VENDORC_CODE", "XMTEPGTEST");//供应商编码
define('CONTENT_DP_ID', '50000087841556503755456288473371');  //内容ID 垫片
define('CONTENT_NAME', '产后抑郁有多可怕？会毁了一位妈妈！');  //内容名称
define('Encrypt_3DES', '6837c0e3716f406daeecce1eb82c512d');
define('NEW_AUTH_URL', 'http://10.255.12.10:18112/gzitv-api/has_order?');    // 正式鉴权地址
//define('NEW_AUTH_URL', 'http://10.255.12.10:18113/gzitv-api/has_order?');    // 测试鉴权地址 测试服无节目
define('PAY_RETURN_URL', 'http://10.255.12.54:10002/lmzhjkpic/index.php?lmuf=2&lmsid=ActivityChoosenLipstick20210414&lmsl=hd-1&lmcid=520095&lmp=3');    // 支付返回地址
define('NEW_ORDER_URL', "http://10.255.12.10:18113/gzitv-api/hd/pay/ask_price.jsp"); //该询价地址不使用，询价地址由鉴权结果返回。

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义
