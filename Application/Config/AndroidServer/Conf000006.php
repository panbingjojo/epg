<?php

define("ANDROID_SERVER_CONFIG_DEBUG", false);

// 测试服配置
if (ANDROID_SERVER_CONFIG_DEBUG) {
    define("ANDROID_SERVER_CONFIG", json_encode([
        // cws服务器
        'server_cws' => [
            [
                'src_addr' => 'http://202.99.114.152:30257',
                'dest_addr' => 'http://202.99.114.152:30257',
            ],
        ],
        // 消息推送服务器
        'server_push' => [
            [
                'src_addr' => 'ws://202.99.114.152:30258',
                'dest_addr' => 'ws://202.99.114.152:30258',
            ],
        ],
        // 文件系统服务器
        'server_file_system' => [
            [
                'src_addr' => 'http://202.99.114.152:30259',
                'dest_addr' => 'http://202.99.114.152:30259',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://202.99.114.152:30260',
                'dest_addr' => 'http://202.99.114.152:30260',
            ],
        ],
        // 互联网医院web服务器
        'hosp_apis' => [
            [
                'src_addr' => 'http://202.99.114.152:30261',
                'dest_addr' => 'http://202.99.114.152:30261',
            ],
        ],
        // 互联网医院licode服务
        'hosp_licode' => [
            [
                'src_addr' => 'wss://test-webrtc.hlwyy.cn:3004',
                'dest_addr' => 'ws://202.99.114.152:30262',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:test-webrtc.hlwyy.cn:3478',
                'dest_addr' => 'turn:202.99.114.152:30238',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://websocket.hlwyy.cn:8282/',
                'dest_addr' => 'wss://202.99.114.152:30263',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://202.99.114.152:30212',
                'dest_addr' => 'ws://202.99.114.152:30212',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://202.99.114.152:30208',
                'dest_addr' => 'http://202.99.114.152:30208',
            ],
        ],
        // APK2.0入口地址
        'epg_lws_for_apk' => [
            [
                'src_addr' => 'http://202.99.114.152:30257/apk-lws/000006-chinaunicom/index.php',
                'dest_addr' => 'http://202.99.114.152:30257/apk-lws/000006-chinaunicom/index.php',
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
                'src_addr' => 'http://202.99.114.152:30207',
                'dest_addr' => 'http://202.99.114.152:30207',
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
                'src_addr' => 'http://202.99.114.152:30218',
                'dest_addr' => 'http://202.99.114.152:30218',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://202.99.114.152:30210',
                'dest_addr' => 'http://202.99.114.152:30210',
            ],
        ],
        // 互联网医院web服务器
        'hosp_apis' => [
            [
                'src_addr' => 'http://202.99.114.152:30206',
                'dest_addr' => 'http://202.99.114.152:30206',
            ],
        ],
        // 互联网医院licode服务
        'hosp_licode' => [
            [
                'src_addr' => 'wss://webrtc.hlwyy.cn:3004',
                'dest_addr' => 'ws://202.99.114.152:30200',
            ],
            [
                'src_addr' => 'wss://webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'ws://202.99.114.152:30201',
            ],
            [
                'src_addr' => 'wss://webrtc2.hlwyy.cn:3004',
                'dest_addr' => 'ws://202.99.114.152:30202',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:webrtc.hlwyy.cn:3478',
                'dest_addr' => 'turn:202.99.114.152:30238',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://websocket.hlwyy.cn:8282/',
                'dest_addr' => 'wss://202.99.114.152:30204',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://202.99.114.152:30212',
                'dest_addr' => 'ws://202.99.114.152:30212',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://202.99.114.152:30208',
                'dest_addr' => 'http://202.99.114.152:30208',
            ],
        ],
        // APK2.0入口地址
        'epg_lws_for_apk' => [
            [
                'src_addr' => 'http://202.99.114.152:30207/epg-lws-for-apk/index.php',
                'dest_addr' => 'http://202.99.114.152:30207/epg-lws-for-apk/index.php',
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