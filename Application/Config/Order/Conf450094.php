<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午7:06
 */

/** 广西广电 计费配置-->测试 */

//define('MD5', "2247ffca2c2ee5313c7043aa035a26a8"); //MD5加密
//define('PRODUCT_ID_MON', "IDC_CP_TEST_MON"); //产品ID - 包月
//define('PRODUCT_ID_YEAR', "IDC_CP_TEST_YEAR"); //产品ID - 包年
//define('PRODUCT_ID_SINGLE', "IDC_CP_TEST_DP"); //按次计费
//define('PRODUCT_UNIT_PRICE', "10"); //产品单价-测试环境使用
//define('PRODUCT_QTY', "1"); //开通数量
//define('PRODUCT_NAME', "广电测试包月产品"); //产品名称-测试环境使用
//define('PRODUCT_PARTNER', "1000000034"); //商户ID,广西广电网络提供
//define('CP_ID', "test"); //商户ID,广西广电网络提供
//define('USER_ORDER_QUERY', "http://10.0.11.40/web-lezboss-test/service");  // 鉴权与订购地址
//define('USER_PROMOTION_SERVICE', "http://10.0.11.40/web-lezboss-test/service");  //促销产品相关地址

/** 广西广电 计费配置-->正式 */

define('MD5', "2247ffca2c2ee5313c7043aa035a26a8"); //MD5加密-->正式服的自己生存，这个值没用
define('PRODUCT_ID_MON', "IDC_39jkjcb"); //产品ID - 包月
define('PRODUCT_ID_YEAR', "IDC_39jkjcb"); //产品ID - 包年
define('PRODUCT_ID_SINGLE', "IDC_tydcdbcp_0.5"); //按次计费
define('PRODUCT_UNIT_PRICE', "20.00"); //产品单价-测试环境使用
define('PRODUCT_QTY', "1"); //开通数量
define('PRODUCT_NAME', "39健康"); //产品名称-测试环境使用
//define('PRODUCT_PARTNER', "1000000034"); //商户ID,广西广电网络提供 不包含正本支付
//define("APP_KEY", "2247ffca2c2ee5313c7043aa035a26a8");//局方提供的appKey值，用于订购地址加密，视频ID绑定产品包（包年，包月）
define('PRODUCT_PARTNER', "1000000115"); //商户ID,广西广电网络提供 包含正本支付
define("APP_KEY", "af1f189d7fadd82f194f3207c4009db8");//局方提供的appKey值，用于订购地址加密，视频ID绑定产品包（包年，包月）
define('CP_ID', "39JK"); //商户ID,广西广电网络提供
define('USER_ORDER_QUERY', "http://10.0.11.38/web-lezboss-dubbo/service");  //正式地址
define('USER_PROMOTION_SERVICE', "http://10.0.11.38/web-lezboss-dubbo/service");  //促销产品相关地址

define('PRODUCT_ID_THREE', "SJF00287"); //3元按次计费
define('PRODUCT_UNIT_THREE_PRICE', "3.00"); //产品单价-测试环境使用
define('PRODUCT_THREE_NAME', "39健康一次性问诊_3元/次（线上）"); //产品名称-测试环境使用
define('SPR_ID', "100021116");

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义