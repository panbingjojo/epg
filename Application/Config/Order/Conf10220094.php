<?php
/**
 * Created by PhpStorm.
 * User: Songhui
 * Date: 2019/6/10
 * Time: 下午7:32
 */

// 现网计费套餐id（备注：“吉林广电”已整合多个套餐项到一个id下管理）
//define('PRODUCT_ID', "1100000481");
define('PRODUCT_ID', "1100001301");

//2010000213 健康魔方（包年）
//2010000212 健康魔方（包月）
//2010000211 健康魔方（连续包月）

define('SPID', ""); //SPID

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义

define("AUTH_USER_CLASS_NAME", "AuthUser220094"); // PHP端接口鉴权的类名
