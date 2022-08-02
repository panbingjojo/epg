<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 青海 订购参数
// +----------------------------------------------------------------------
// | Author: LongMaster
// | Date: 2019/4/16 18:00
// +----------------------------------------------------------------------

//回调
define('ORDER_CALL_BACK_URL', SERVER_HOST . "/cws/pay/xizangyd/callback/index.php");  //现网 - 订购通知回调地址

//define('SCSP_PROXY_URL', 'http://183.192.162.103:80/scspProxy');        // 订购地址
//define('SCSP_PROXY_URL', 'http://cstv.itv.cmvideo.cn:8095/cmcc/interface');        // 订购地址
//define('SCSP_PROXY_URL', 'http://117.131.17.19:8095/cmcc/interface');              // 订购地址
define('SCSP_PROXY_URL', 'http://cstv.itv.cmvideo.cn:8095/cmcc/interface');              // 订购地址

define('COPYRIGHT_ID', '698057');                                       // 牌照方ID

const IS_PAY_RELEASE = true; //线上发布更新，务必改为true！
if (IS_PAY_RELEASE) {
    define('CONTENT_ID', '200002');         // 当前"200002"为：爱家健康包
} else {
    define('CONTENT_ID', '100001');         // 当前"10000X"为：测试"产品ID"联调！
}

define('CHANNEL_ID', '00001');                                          // 渠道号

define('PAY_PACKAGE_TYPE_1', 1);                                   // 基础包月
define('PAY_PACKAGE_TYPE_2', 2);                                   // 视频问诊包
define('PAY_PACKAGE_TYPE_3', 3);                                   // 专家问诊包


// 套餐包及其对应信息（价格、描述、功能限制(详见定义：Constants.php->FUNC_XXX)）----Added by Songhui on 2019-12-27
define("PAY_PACKAGES", "return array(
    array(   'price'=>2900,  
                        'productId'=>'8802001123',
                        'productName'=>'续包月', 
                        'desc'=>'29元/月'
                    ),
    /*array(   'price'=>2900,  
                        'productId'=>'8802001124',
                        'productName'=>'包月', 
                        'desc'=>'29元/月'
                    ),*/
    array(   'price'=>6800,  
                        'productId'=>'8802001125',//局方分配产品id，上线要换为正式的（TODO待分配）
                        'productName'=>'包季', 
                        'desc'=>'68元/季'
                    ),
    array(   'price'=>12800, 
                        'productId'=>'8802001126',//局方分配产品id，已上线！
                        'productName'=>'包半年', 
                        'desc'=>'128元/半年'
                    ),
    array(   'price'=>21800, 
                        'productId'=>'8802001127',//局方分配产品id，已上线！
                        'productName'=>'包年', 
                        'desc'=>'218元/年'
                    ),
);");

