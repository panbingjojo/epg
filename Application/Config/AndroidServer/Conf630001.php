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
                'src_addr' => 'http://123.59.206.200:10002',
                'dest_addr' => 'http://gylm39jk-qh.a106.ottcn.com:10002',
            ],
        ],
        // 消息推送服务器
        'server_push' => [
            [
                'src_addr' => 'ws://123.59.206.200:10006',
                'dest_addr' => 'ws://gylm39jk-qh-push.a106.ottcn.com:10006',
            ],
        ],
        // 文件系统服务器
        'server_file_system' => [
            [
                'src_addr' => 'http://123.59.206.200:10013/',
                'dest_addr' => 'http://gylm39jk-qh-fs.a106.ottcn.com:10013/',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://123.59.206.200:10005/',
                'dest_addr' => 'http://gylm39jk-qh-crash.a106.ottcn.com:10005/',
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
                'dest_addr' => 'ws://gylm39jk-qh-webrtc.a106.ottcn.com:10017',
            ],
            [
                'src_addr' => 'wss://webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'ws://gylm39jk-qh-webrtc1.a106.ottcn.com:10018',
            ],
            [
                'src_addr' => 'wss://webrtc2.hlwyy.cn:3004',
                'dest_addr' => 'ws://gylm39jk-qh-webrtc2.a106.ottcn.com:10019',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:webrtc.hlwyy.cn:3478',
                'dest_addr' => 'turn:gylm39jk-qh-stun.a106.ottcn.com:10050',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://websocket.hlwyy.cn:8282/',
                'dest_addr' => 'wss://gylm39jk-qh-hlwyy-wss.a106.ottcn.com:10021',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://123.59.206.200:10007',
                'dest_addr' => 'ws://gylm39jk-qh-push-live.a106.ottcn.com:10007',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://app.amx.langma.cn',
                'dest_addr' => 'http://gylm39jk-qh-appamx.a106.ottcn.com:10003',
            ],
        ],
        // APK2.0入口地址
        'epg_lws_for_apk' => [
            [
                'src_addr' => 'http://gylm39jk-qh.a106.ottcn.com:10002/epg-lws-for-apk-630001/index.php',
                'dest_addr' => 'http://gylm39jk-qh.a106.ottcn.com:10002/epg-lws-for-apk-630001/index.php',
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