<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
//test
// 应用入口文件

//PHP环境要求
if (version_compare(PHP_VERSION, '5.3.0', '<'))
    die('require PHP > 5.3.0 !');
//header('Access-Control-Allow-Origin:*');
//// 响应类型
//header('Access-Control-Allow-Methods:*');
//// 响应头设置
//header('Access-Control-Allow-Headers:x-requested-with,content-type');

define('DIR', dirname(__FILE__));

// 开启调试模式 建议开发阶段开启 部署阶段注释或者设为false
define('APP_DEBUG', true);

// 加载carrierId配置文件
include_once("./Application/Config/Carrier/CarrierId.php");
// 当前运行所处的平台区域 （定义在/Application/Config/Carrier/CarrierId.php）
//define('CARRIER_ID', CARRIER_ID_HEBEIYD);
define('CARRIER_ID', CARRIER_ID_GUANGXIDX);

// 加载自定义常量文件
include_once("./Application/Config/Constants/Constants.php");

// 服务器配置
include_once('./Application/Config/Server/Conf' . CARRIER_ID . ".php");
// 统一配置
include_once('./Application/Config/Common/Conf' . CARRIER_ID . ".php");
// 订购配置
include_once('./Application/Config/Order/Conf' . CARRIER_ID . ".php");
// 加载统一路由配置信息
include_once('./Application/Config/Router/DefaultConf.php');
// 活动路由配置信息
include_once('./Application/Config/Router/ActivityConf.php');
// 页面路由配置
include_once('./Application/Config/Router/Conf' . CARRIER_ID . ".php");

$fileName = './Application/Config/AndroidServer/Conf' . CARRIER_ID . ".php";
if (file_exists($fileName)) {
    // Android服务器配置
    include_once($fileName);
}


// 定义应用目录
define('APP_PATH', './Application/');
// 定义Runtime路径
define('RUNTIME_PATH', './Runtime/');

// 引入ThinkPHP入口文件
require './ThinkPHP/ThinkPHP.php';

// 亲^_^ 后面不需要任何代码了 就是如此简单