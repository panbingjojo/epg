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
        'custmer_service_hotline' => [
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
                'src_addr' => 'http://sddx.39health.visionall.cn:10000',
                'dest_addr' => 'http://sddx.39health.visionall.cn:10000',
            ],
        ],
        // 消息推送服务器
        'server_push' => [
            [
                'src_addr' => 'ws://sddx.39health.visionall.cn:10012',
                'dest_addr' => 'ws://sddx.39health.visionall.cn:10012',
            ],
        ],
        // 文件系统服务器
        'server_file_system' => [
            [
                'src_addr' => 'http://sddx.39health.visionall.cn:10002/',
                'dest_addr' => 'http://sddx.39health.visionall.cn:10002/',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://sddx.39health.visionall.cn:10006',
                'dest_addr' => 'http://sddx.39health.visionall.cn:10006',
            ],
        ],
        // 互联网医院医生头像服务器
        'hosp_doctor_avater' => [
            [
                'src_addr' => 'http://sddx.39health.visionall.cn:10000',
                'dest_addr' => 'http://sddx.39health.visionall.cn:10000',
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
                'dest_addr' => 'ws://sddx.39health.visionall.cn:10008',
            ],
            [
                'src_addr' => 'wss://webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'ws://sddx.39health.visionall.cn:10009',
            ],
            [
                'src_addr' => 'wss://webrtc2.hlwyy.cn:3004',
                'dest_addr' => 'ws://sddx.39health.visionall.cn:10010',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:webrtc.hlwyy.cn:3478',
                'dest_addr' => 'turn:39health_udp.application.sdteleiptv.com:10000',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://websocket.hlwyy.cn:8282/',
                'dest_addr' => 'wss://sddx.39health.visionall.cn:10011',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'http://sddx.39health.visionall.cn:10012',
                'dest_addr' => 'http://sddx.39health.visionall.cn:10012',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://app.amx.langma.cn',
                'dest_addr' => 'http://sddx.39health.visionall.cn:10013',
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
        'custmer_service_hotline' => [
            [
                'phone_number' => '0898-6856-8003',
            ],
        ],
    ]));
}