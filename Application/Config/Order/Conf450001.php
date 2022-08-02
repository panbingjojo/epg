<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 01230001：[广西移动]
// +----------------------------------------------------------------------
// | 功能说明：此类用于计费相关配置
// +----------------------------------------------------------------------
// | Author: lishengbing
// | Date: 2020/09/02 15:25
// +----------------------------------------------------------------------

// 计费项信息

define('PRODUCT_ID_ALL_MONTH', 'hw20239502'); //融合包，全站产品月包ID
define('PRODUCT_ID_ALL_YEAR', 'hw20239695'); //融合包，全站产品年包ID
define('PRODUCT_ID_MEDICAL', 'hw20239507'); //融合包，医疗养老融合包
define('PRODUCT_ID_AI_JIA', 'hw20239883'); //融合包，“爱家精选”的会员月包，由于局方给这个产品增加权益，所以在这里会传
define('PRODUCT_ID_39HEALTH', 'hw20239773'); //39健康单品包

//------------------------------暂不需要传医养融合包
define('PRODUCT_ID', PRODUCT_ID_39HEALTH . "," . PRODUCT_ID_AI_JIA . "," . PRODUCT_ID_MEDICAL . "," . PRODUCT_ID_ALL_MONTH . "," . PRODUCT_ID_ALL_YEAR); //当发起产品鉴权的时候需要第三方传产品ID，上线前由SP分配
define('CONTENT_ID', ''); //鉴权内容id，自有影视业务鉴权时必填（注：传空，易视腾方说是预留为单点计费用的，包月直接传空！）
define('CONTENT_NAME', ''); //内容名称（注：可选，易视腾方说暂不需要，可传空！）
define('SP_TOKEN', ''); //运营商token（注：可选，易视腾方说暂不需要，可传空！）
define('PAY_PHONE', ''); //支付手机号（注：此字段不用填，填了也没有作用）
define('PAY_PRICE', ""); //产品包实际支付价格，以分为单位（注：暂无配置，添加这个只是为了php取不到前端ajax传递来的价格，用它作为默认常量而已）
define("PRODUCT_TYPE","");  //商品类型
//回调
define('ORDER_CALL_BACK_URL', SERVER_HOST . "/cws/pay/guangxiyd/callback/index.php");  //订购通知回调地址

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义

define("AUTH_BY_ANDROID_SDK", 1); // 定义鉴权的时候通过安卓平台的sdk
