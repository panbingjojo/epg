<?php

define("ANDROID_SERVER_CONFIG_DEBUG", false);

// 测试服配置
if (ANDROID_SERVER_CONFIG_DEBUG) {
    define("ANDROID_SERVER_CONFIG", json_encode([
        // cws服务器
        'server_cws' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 消息推送服务器
        'server_push' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 文件系统服务器
        'server_file_system' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 互联网医院web服务器
        'hosp_apis' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 互联网医院licode服务
        'hosp_licode' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
                'turn_username' => '',
                'turn_passwd' => '',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // APK2.0入口地址
        'epg_lws_for_apk' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 客服电话
        'customer_service_hotline' => [
            [
                'phone_number' => '0898-6856-8003',
            ],
        ],
    ]));
}
// 正式服配置
else {
    define("ANDROID_SERVER_CONFIG", json_encode([
        // cws服务器
        'server_cws' => [
            [
                'src_addr' => 'http://10.0.4.170:39001/apk',
                'dest_addr' => 'http://10.0.4.170:39001/apk',
            ],
        ],
        // 消息推送服务器
        'server_push' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 文件系统服务器
        'server_file_system' => [
            [
                'src_addr' => 'http://10.0.4.170:39008/',
                'dest_addr' => 'http://10.0.4.170:39008/',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 互联网医院web服务器
        'hosp_apis' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // 互联网医院licode服务
        'hosp_licode' => [
            [
                'src_addr' => 'wss://webrtc.hlwyy.cn:3004',
                'dest_addr' => 'ws://10.0.4.170:39009',
            ],
            [
                'src_addr' => 'wss://webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'ws://10.0.4.170:39009',
            ],
            [
                'src_addr' => 'wss://webrtc2.hlwyy.cn:3004',
                'dest_addr' => 'ws://10.0.4.170:39009',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:webrtc.hlwyy.cn:3478',
                'dest_addr' => 'stun:10.0.4.170:39101',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://10.0.4.170:39010/',
                'dest_addr' => 'wss://10.0.4.170:39010/',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://10.0.4.170:39008',
                'dest_addr' => 'ws://10.0.4.170:39008',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://app.amx.langma.cn',
                'dest_addr' => 'http://app.amx.langma.cn',
            ],
        ],
        // APK2.0入口地址
        'epg_lws_for_apk' => [
            [
                'src_addr' => 'http://10.0.4.170:39001/apk/epg-apk-for-lws-450004/index.php',
                'dest_addr' => 'http://10.0.4.170:39001/apk/epg-apk-for-lws-450004/index.php',
            ],
        ],
        // 客服电话
        'customer_service_hotline' => [
            [
                'phone_number' => '0898-6856-8003',
            ],
        ],
    ]));
}