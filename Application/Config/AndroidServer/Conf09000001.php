<?php

define("ANDROID_SERVER_CONFIG_DEBUG", true);

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
        // 互联网医院医生头像服务器
        'hosp_doctor_avater' => [
            [
                'src_addr' => 'https://test-hosp.hlwyy.cn',
                'dest_addr' => 'https://test-hosp.hlwyy.cn',
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
               'src_addr' => 'http://test-healthiptv.langma.cn:40037/09000001-yb-health-unified/index.php',
               'dest_addr' => 'http://test-healthiptv.langma.cn:40037/09000001-yb-health-unified/index.php',
//                'src_addr' => 'http://10.254.59.80:8081/index.php',
//                'dest_addr' => 'http://10.254.59.80:8081/index.php',
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
                'dest_addr' => 'http://123.59.206.200:10002',
            ],
        ],
        // 消息推送服务器
        'server_push' => [
            [
                'src_addr' => 'ws://123.59.206.200:10006',
                'dest_addr' => 'ws://123.59.206.200:10006',
            ],
        ],
        // 文件系统服务器
        'server_file_system' => [
            [
                'src_addr' => 'http://123.59.206.200:10013/',
                'dest_addr' => 'http://healthiptv-fs.langma.cn/',
            ],
        ],
        // 天气服务器
        'server_weather' => [
            [
                'src_addr' => 'http://123.59.206.200:10002/cws/weather/?',
                'dest_addr' => 'http://123.59.206.200:10002/cws/weather/?',
            ],
        ],
        // 预约挂号服务器
        'server_guahao' => [
            [
                'src_addr' => 'http://123.59.206.200:10014/',
                'dest_addr' => 'http://healthiptv-guahao.langma.cn/',
            ],
        ],
        // 统计服务器
        'server_stat' => [
            [
                'src_addr' => 'http://123.59.206.200:10015/',
                'dest_addr' => 'http://123.59.206.200:10015/',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://123.59.206.200:10005/',
                'dest_addr' => 'http://healthiptv-crash.langma.cn:15000/',
            ],
        ],
        // 互联网医院服务器信息获取地址
        'hosp_main_apis' => [
            [
                'src_addr' => 'http://123.59.206.200:10000/apis?app_id=10002&amp;app_key=DcJL354uvIvEdvI9J2wc5Fq08ODjKBbW',
                'dest_addr' => 'http://123.59.206.200:10000/apis?app_id=10002&amp;app_key=DcJL354uvIvEdvI9J2wc5Fq08ODjKBbW',
            ],
        ],
        // 互联网医院轮询服务
        'hosp_polling' => [
            [
                'src_addr' => 'https://www.hlwyy.cn/lp/',
                'dest_addr' => 'https://123.59.206.200:10008/lp/',
            ],
        ],
        // 互联网医院web服务器
        'hosp_apis' => [
            [
                'src_addr' => 'http://apis.hlwyy.cn',
                'dest_addr' => 'http://123.59.206.200:10001',
            ],
        ],
        // 互联网医院医生头像服务器
        'hosp_doctor_avater' => [
            [
                'src_addr' => 'https://www.hlwyy.cn',
                'dest_addr' => 'https://123.59.206.200:10008',
            ],
        ],
        // 互联网医院licode服务
        'hosp_licode' => [
            [
                'src_addr' => 'wss://webrtc.hlwyy.cn:3004',
                'dest_addr' => 'ws://123.59.206.200:10017',
            ],
            [
                'src_addr' => 'wss://webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'ws://123.59.206.200:10018',
            ],
            [
                'src_addr' => 'wss://webrtc2.hlwyy.cn:3004',
                'dest_addr' => 'ws://123.59.206.200:10019',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:webrtc.hlwyy.cn:3478',
                'dest_addr' => 'turn:123.59.206.200:10050',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院ice服务
        'hosp_live_stun' => [
            [
                'src_addr' => 'stun:iptv-video.hlwyy.cn:3478',
                'dest_addr' => 'turn:123.59.206.200:10050',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://websocket.hlwyy.cn:8282/',
                'dest_addr' => 'wss://123.59.206.200:10021',
            ],
        ],
        // 直播服务licode 服务
        'hosp_live_licode' => [
            [
                'src_addr' => 'wss://iptv-video.hlwyy.cn:3004',
                'dest_addr' => 'ws://123.59.206.200:10020',
            ],
        ],
        // 直播服务推送服务器
        'hosp_live_push' => [
            [
                'src_addr' => 'ws://iptv-push.hlwyy.cn:8101',
                'dest_addr' => 'ws://123.59.206.200:10007',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://123.59.206.200:10007',
                'dest_addr' => 'ws://123.59.206.200:10007',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://app.amx.langma.cn',
                'dest_addr' => 'http://123.59.206.200:10003',
            ],
        ],
        // APK2.0入口地址
        'epg_lws_for_apk' => [
            [
                'src_addr' => 'http://123.59.206.200:10002/epg-lws-for-apk-09000001/index.php',
                'dest_addr' => 'http://123.59.206.200:10002/epg-lws-for-apk-09000001/index.php',
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