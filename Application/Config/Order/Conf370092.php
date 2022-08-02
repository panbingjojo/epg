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

//define('USER_ORDER_URL', 'http://150.138.11.100:9295/UserOrderSD');              // 测试服订购地址
define('USER_ORDER_URL', 'http://150.138.11.98:8396/UserOrderSD');                 // 正式服订购地址
// define('USER_AUTH_URL', 'http://150.138.11.97:9293/services/ServiceInterface'); // 测试服鉴权地址
//define('USER_AUTH_URL', 'http://150.138.11.97:8391/services/ServiceInterface?wsdl');    // 正式服鉴权地址
define('USER_AUTH_URL', 'http://sddx.39health.visionall.cn:10002/wsdl/SPSysInterface1_1.wsdl');   //从局方获得wsdl进行鉴权

// 修改内容 -- 应局方要求，修改鉴权订购地址
//define('USER_ORDER_URL_NEW', 'http://150.138.11.100:9295/UserOrderSD');              // 新正式服订购地址
//define('USER_AUTH_URL_NEW', 'http://150.138.11.100:9293/services/ServiceInterface?wsdl');    // 新正式服鉴权地址
define('PRODUCT_ID','');
define('CONTENT_ID_CONFIG',  array(
    "0" => "P_1006157", // 产品大包
    "1" => "P_1201711", // 宝贝天地健康包
    "2" => "P_1201867", // 中老年健康包
    "3" => "P_1204227", // 健康生活包
    "4" => "P_1003386", // 定价20元
    "5" => "P_1003331", // 定价15元
));
define('SPID', 'spa00019');
define('SPName', '贵阳朗玛信息');
define('KEY', 'l3ij39V0fQ918Y33H471eHtc');
define('CLICK_CONTENT_INFO_KEY', 'staryea'); // 数据上报探针字段KEY
define('CLICK_CONTENT_INFO_URL', 'http://150.138.11.100:9293/getClickContentInfo'); // 数据上报探针URL


define("AUTH_USER_CLASS_NAME", "AuthUser370092"); // PHP端接口鉴权的类名
