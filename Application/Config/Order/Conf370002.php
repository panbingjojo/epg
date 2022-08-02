<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 山东电信 订购参数
// +----------------------------------------------------------------------
// | Author: czy
// | Date: 2018/11/5 9:45
// +----------------------------------------------------------------------

//回调
define('ORDER_CALL_BACK_URL', SERVER_HOST ."/cws/pay/shandongdx/callback/index.php");  //现网 - 订购通知回调地址

//define('USER_ORDER_URL', 'http://150.138.11.100:9295/UserOrderSD');              // 测试服订购地址
define('USER_ORDER_URL', 'http://150.138.11.98:8396/UserOrderSD');              // 正式服订购地址
//define('USER_AUTH_URL', 'http://150.138.11.97:8391/services/ServiceInterface?wsdl');    // 正式服鉴权地址
define('USER_AUTH_URL', 'http://sddx.39health.visionall.cn:10002/wsdl/SPSysInterface1_1.wsdl');   //从局方获得wsdl进行鉴权

// 修改内容 -- 局方要求替换订购和鉴权的服务器IP
//define('USER_ORDER_URL', 'http://150.138.11.100:9295/UserOrderSD');              // 新正式服订购地址
//define('USER_AUTH_URL', 'http://150.138.11.100:9293/services/ServiceInterface?wsdl');    // 新正式服鉴权地址
// define('PRODUCT_ID', '6010000008');
define('PRODUCT_ID', '');
define('CONTENT_ID', '');
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

