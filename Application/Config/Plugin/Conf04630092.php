<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/7/24
 * Time: 下午7:07
 */

// 视频问诊插件包名
define('PLUGIN_VIDEO_APP_NAME', 'com.longmaster.iptv.healthplugin.video.qinghaidx');

// 魔方插件包名
define('PLUGIN_MOFANG_APP_NAME', 'com.longmaster.iptv.health.mofang.qinghaidx');

// 插件下载地址
define('PLUGIN_VIDEO_DOWNLOAD_URL', RESOURCES_URL . "/apk_plugin/630092/health39-video-plugin-r0.0.3(3).apk");

// 再次启动APK插件时，决定是否需要重新下载最新的server_config_{$carrier_id}.xml文件。数值类型，如要更新，则自增该值。
define("PLUGIN_CONFIG_UPDATE_TOKEN", 100009);