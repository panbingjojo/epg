<?php
/**
 * +----------------------------------------------------------------------
 * | 湖南电信的计费配置
 * +----------------------------------------------------------------------
 * | spid、鉴权地址
 * +----------------------------------------------------------------------
 * | Author: wangjiang
 * | Date: 2021/1/14 11:11
 * +----------------------------------------------------------------------
 */

//平台唯一标识（家庭健康顾问）
define("SP_ID","spa00111");

//产品id(连续包月)
define("PRODUCT_ID_CONTINUED","productIDa2000000000000000016545");
//产品id(包月30)
define("PRODUCT_ID","productIDa2000000000000000016547");

define("PRODUCT_ID_1YUAN","productIDa2000000000000000022533");
define("PRODUCT_ID_3YUAN","productIDa2000000000000000022037");
define("PRODUCT_ID_5YUAN","productIDa2000000000000000022536");
define("PRODUCT_ID_9YUAN","productIDa2000000000000000022040");

define("PRODUCT_ID_90DAY","productIDa1000000000000000036029");
define("PRODUCT_ID_FIGT","productIDa2000000000000090007080");//IPTV健康顾问礼包
define("PRODUCT_ID_ADVISER","productIDa2000000000000090007113");//天翼高清家庭健康顾问
define("PRODUCT_ID_GAME","productIDa1000000000000090007115");//健康欢唱游戏体验年包
define("PRODUCT_ID_SALE","productIDa1000000000000090007203");//家庭健康顾问（装维随销） 20元/月
define("PRODUCT_ID_HEALTH_ADVISER","productIDa2000000000000090007367");//天翼高清家庭健康顾问
define("PRODUCT_ID_ONE_3DAY","productIDa1000000000000090007405");//1元3天全站包
define("PRODUCT_ID_ONE_7DAY","productIDa1000000000000090007407");//1元7天全站包
define("PRODUCT_ID_ONE_30DAY","productIDa1000000000000090007409");//1元30天全站包

//用户帐号类型
//0：普通用户（需要绑定机顶盒）
//1：测试用户(无需绑定机顶盒)
define("NORMAL_USER",0);
define("TEST_USER",1);

//鉴权的测试地址
define("AUTH_TEST_URL","http://124.232.135.227:8297/services/SPSysBatchInterface?wsdl");
//鉴权的正式地址
define("AUTH_RELEASE_URL","http://222.246.132.231:8297/services/SPSysBatchInterface?wsdl");
//回调
define('ORDER_CALL_BACK_URL', SERVER_HOST ."/cws/pay/hunandx/callback/index.php");  //现网 - 订购通知回调地址


define("SP_NAME","HNDX39JK");
define("BACKPACKAGE","com.longmaster.iptv.health.mofang.hunandx");
define("BACKURL","http://124.232.135.225:8082/AppStoreTV/back.do");
define("BACKCLASS","com.longmaster.iptv.health.mofang.splash.PayResultActivity");
define("NOTIFYURL","http://10.255.26.9:10000/cws/pay/hunandx/callback/index.php");
