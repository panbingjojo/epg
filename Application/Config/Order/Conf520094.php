<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午7:06
 */

define('CP_ID', "10072"); //CPID
define('AUTH_KEY', "ASSSSSSSASSSSSs7"); //加密秘钥
define('NEW_MEDIA_HOST', "http://aaa.interface.gzgd/"); //新媒资平台host
define('VIDEO_AUTH_PATH', "nn_cms/api/std/z51_a.php"); //新媒资平台视频鉴权获取播放串路径
define('ORDER_BACK_ENTRY_URL', ""); // 订购返回时，进入应用的入口
define('IS_USE_CUSTOM_GO_ORDER_ENTRY_URL', 1); // 1--表示使用自定义的url，0--表示使用本机
define('GO_EPG_PAY_ENTRY_URL', ""); // 去订购时，去局方的入口

define('IS_USE_CUSTOM_ORDER_BACK_ENTRY_URL', 1); // 1--表示使用自定义的url，0--表示使用本机

//回调
define('ORDER_CALL_BACK_URL', "http://10.69.46.209:10000/cws/pay/guizhougd/callback/web_index.php");  //现网 - 订购通知回调地址

define("AUTH_USER_WITH_WEB", 1); // 是否需要通过网页端进行用户鉴权，需要定义该常量，不需要就不用定义