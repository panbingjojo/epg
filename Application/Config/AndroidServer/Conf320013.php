<?php

define("ANDROID_SERVER_CONFIG_DEBUG", false);

// 测试服配置
if (ANDROID_SERVER_CONFIG_DEBUG) {
    define("ANDROID_SERVER_CONFIG", json_encode([
        // cws服务器
        'server_cws' => [
            [
                'src_addr' => 'http://test-healthiptv.langma.cn:8100',
                'dest_addr' => 'http://test-healthiptv.langma.cn:8100',
            ],
        ],
        // 消息推送服务器
        'server_push' => [
            [
                'src_addr' => 'ws://test-healthiptv.langma.cn:8101',
                'dest_addr' => 'ws://test-healthiptv.langma.cn:8101',
            ],
        ],
        // 文件系统服务器
        'server_file_system' => [
            [
                'src_addr' => 'http://test-healthiptv-fs.langma.cn:8091/',
                'dest_addr' => 'http://test-healthiptv-fs.langma.cn:8091/',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://test-healthiptv.langma.cn:15000/',
                'dest_addr' => 'http://test-healthiptv.langma.cn:15000/',
            ],
        ],
        // 互联网医院web服务器
        'hosp_apis' => [
            [
                'src_addr' => 'http://test-apis.hlwyy.cn',
                'dest_addr' => 'http://test-apis.hlwyy.cn',
            ],
        ],
        // 互联网医院licode服务
        'hosp_licode' => [
            [
                'src_addr' => 'wss://test-webrtc.hlwyy.cn:3004',
                'dest_addr' => 'ws://test-webrtc.hlwyy.cn:3006',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:test-webrtc.hlwyy.cn:3478',
                'dest_addr' => 'stun:test-webrtc.hlwyy.cn:3478',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://test-dr.hlwyy.cn:8282/',
                'dest_addr' => 'wss://test-dr.hlwyy.cn:8282/',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://222.85.144.70:8101',
                'dest_addr' => 'ws://222.85.144.70:8101',
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
                'src_addr' => 'http://test-healthiptv.langma.cn:40037/320013-zhejiang-huashu/index.php',
                'dest_addr' => 'http://test-healthiptv.langma.cn:40037/320013-zhejiang-huashu/index.php',
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
                'src_addr' => 'http://125.210.121.175:10000',
                'dest_addr' => 'http://125.210.121.175:10000',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://125.210.121.175:10002/',
                'dest_addr' => 'http://125.210.121.175:10002/',
            ],
        ],
        // 互联网医院医生头像服务器
        'hosp_doctor_avater' => [
            [
                'src_addr' => 'https://www.hlwyy.cn',
                'dest_addr' => 'https://125.210.121.175:10003',
            ],
        ],
        // 互联网医院licode服务
        'hosp_licode' => [
            [
                'src_addr' => 'wss://webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'wss://125.210.121.175:10003',
            ],
            [
                'src_addr' => 'wss://webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'wss://125.210.121.175:10003',
            ],
            [
                'src_addr' => 'wss://webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'wss://125.210.121.175:10003',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:webrtc.hlwyy.cn:3478',
                'dest_addr' => 'turn:125.210.121.175:10000',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://websocket.hlwyy.cn:8282/',
                'dest_addr' => 'wss://125.210.121.175:10004',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://125.210.121.175:10005',
                'dest_addr' => 'ws://125.210.121.175:10005',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://app.amx.langma.cn',
                'dest_addr' => 'http://125.210.121.175:10007',
            ],
        ],
        // APK2.0入口地址
        'epg_lws_for_apk' => [
            [
                'src_addr' => 'http://125.210.121.175:10000/epg-lws-for-apk-320013/index.php',
                'dest_addr' => 'http://125.210.121.175:10000/epg-lws-for-apk-320013/index.php',
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
