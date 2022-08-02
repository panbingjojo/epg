<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午7:06
 */

/** 广西电信 计费配置 */

define('SPID_SMALL', "spaj0080"); //SPID -- 小包
define('SPID_LARGE', "spaj0128"); //SPID -- 大包
define('KEY_3DES', "30RrQ55GH2r8O868lTgxKvG9"); //3DES加密串 -- 小包
define('KEY_3DES_LARGE', "q35GwW37JluNXT847a4R62g2"); //3DES加密串 -- 大包
//define('MD5', "VrBvCmW67015P60M"); //MD5加密
define('MD5', "MNMaj6nSAN98S6dj"); //MD5加密
define("productID_18", 1);
define('PRODUCT_ID_18', "productIDa3j00000000000000000828"); //产品ID - "39健康18元续包月" 订购项
define('PRODUCT_ID_LIFE', "productIDa11j0000000000000001134"); //产品ID - "局方生活包" 订购项
define('PRODUCT_ID_LIFE_GX_OFF', "productIDa20j0000000000000001693"); //产品ID - GX生活融合包20元续包月-线下
define('SERVICE_ID_SINGLE', "99100000122017111017574901239363"); // 统一订购服务编码--单个
define('CONTENT_ID', "99100000012018041912461902052422");          // 内容ID

// 局方整的线下生活包 ////////////////////////
// 生活 spid：spaj0128：
//productIDa20j0000000000000001366 GX生活垂直包25元包30天
define('PRODUCT_ID_25', "productIDa20j0000000000000001366");

//productIDa20j0000000000000001384 GX生活垂直包68元包90天
define('PRODUCT_ID_68', "productIDa20j0000000000000001384");

//productIDa20j0000000000000001385 GX生活垂直包120元包180天
define('PRODUCT_ID_120', "productIDa20j0000000000000001385");
//////////////////////////////////////////////

// 生活VIP-线下 productIDa20j0000000000000001460
define('PRODUCT_ID_OFFLINE', "productIDa20j0000000000000001460");

// 生活VIP-积分 productIDa20j0000000000000001460
define('PRODUCT_ID_OFFLINE_JIFEN', "productIDa9j00000000000000001493");

//寓教于乐产品id
define('PRODUCT_ID_ENTERTAINING', "bdproductid000000000000000000003");

// 用户探针部署，数据上报url ---测试服
define('SEND_USER_BEHAVIOUR_URL', "http://192.168.101.11:4081/upc/behaviorHis");  // 鉴权查询接口

//订购、鉴权现网测试地址
//define('USER_ORDER_QUERY', "http://222.217.76.250:9296/OrderQuery");  // 鉴权查询接口
//define('USER_ORDER_URL', "http://222.217.76.250:9296/UserOrder");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）
//define('USER_ORDER_URL', "http://222.217.76.250:4081/iTVAuthJYH/UserAuthOrder");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）

//订购、鉴权现网正式地址--上线使用
define('USER_ORDER_QUERY', "http://222.217.76.1:8296/OrderQuery");  // 鉴权查询接口
//define('USER_ORDER_URL', "http://222.217.76.1:8296/UserOrder");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）
define('USER_ORDER_URL', "http://222.217.76.250:5298/iTVAuthJYH/UserAuthOrder");  //现网 - 集约AMS统一鉴权订购接口（业务专区/SP使用）
