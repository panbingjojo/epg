<?php

define("ANDROID_SERVER_CONFIG_DEBUG", false);

// 测试服配置
if (ANDROID_SERVER_CONFIG_DEBUG) {
    define("ANDROID_SERVER_CONFIG", json_encode([
        // cws服务器
        'server_cws' => [
            [
                'src_addr' => 'http://test-healthiptv.langma.cn:7100',
                'dest_addr' => 'http://test-healthiptv.langma.cn:7100',
            ],
        ],
        // 消息推送服务器
        'server_push' => [
            [
                'src_addr' => 'ws://222.85.144.70:8101',
                'dest_addr' => 'ws://222.85.144.70:8101',
            ],
        ],
        // 文件系统服务器
        'server_file_system' => [
            [
                'src_addr' => 'http://test-healthiptv.langma.cn:8091',
                'dest_addr' => 'http://test-healthiptv.langma.cn:8091',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://10.254.30.100:15000/',
                'dest_addr' => 'http://10.254.30.100:15000/',
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
                'dest_addr' => 'wss://test-webrtc.hlwyy.cn:3006',
            ],
            [
                'src_addr' => 'wss://test-webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'wss://test-webrtc1.hlwyy.cn:3006',
            ],
            [
                'src_addr' => 'wss://test-webrtc2.hlwyy.cn:3004',
                'dest_addr' => 'wss://test-webrtc2.hlwyy.cn:3006',
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
                'src_addr' => 'http://test-healthiptv.langma.cn:40013/01230001-heilongjiangyd/index.php',
                'dest_addr' => 'http://test-healthiptv.langma.cn:40013/01230001-heilongjiangyd/index.php',
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
                'src_addr' => 'http://123.59.206.200:20005/',
                'dest_addr' => 'http://gylm39jk-hlj.a106.ottcn.com:20005/',
            ],
        ],
        // 消息推送服务器
        'server_push' => [
            [
                'src_addr' => 'ws://123.59.206.200:10006',
                'dest_addr' => 'ws://gylm39jk-hlj-push.a106.ottcn.com:10006',
            ],
        ],
        // 文件系统服务器
        'server_file_system' => [
            [
                'src_addr' => 'http://123.59.206.200:10013/mofang/',
                'dest_addr' => 'http://gylm39jk-hlj-fs.a106.ottcn.com:10013/mofang/',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://123.59.206.200:10005/',
                'dest_addr' => 'http://gylm39jk-hlj-crash.a106.ottcn.com:10005/',
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
                'dest_addr' => 'ws://gylm39jk-hlj-webrtc.a106.ottcn.com:10017',
            ],
            [
                'src_addr' => 'wss://webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'ws://gylm39jk-hlj-webrtc1.a106.ottcn.com:10018',
            ],
            [
                'src_addr' => 'wss://webrtc2.hlwyy.cn:3004',
                'dest_addr' => 'ws://gylm39jk-hlj-webrtc2.a106.ottcn.com:10019',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:webrtc.hlwyy.cn:3478',
                'dest_addr' => 'stun:gylm39jk-hlj-stun.a106.ottcn.com:10050',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://websocket.hlwyy.cn:8282',
                'dest_addr' => 'wss://gylm39jk-hlj-hlwyy-wss.a106.ottcn.com:10021/',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://123.59.206.200:10007',
                'dest_addr' => 'ws://gylm39jk-hlj-push-live.a106.ottcn.com:10007',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://app.amx.langma.cn',
                'dest_addr' => 'http://gylm39jk-hlj-appamx.a106.ottcn.com:10003',
            ],
        ],
        // APK2.0入口地址
        'epg_lws_for_apk' => [
            [
                'src_addr' => 'http://123.59.206.200:20005/apk-lws/index.php',
                'dest_addr' => 'http://gylm39jk-hlj.a106.ottcn.com:20005/apk-lws/index.php',
            ],
        ],
    ]));
}
