<?php

define("ANDROID_SERVER_CONFIG_DEBUG", false);

// 测试服配置
if (ANDROID_SERVER_CONFIG_DEBUG) {
    define("ANDROID_SERVER_CONFIG", json_encode([
        // cws服务器
        'server_cws' => [
            [
                'src_addr' => 'http://222.85.144.70:8100',
                'dest_addr' => 'http://222.85.144.70:8100',
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
                'src_addr' => 'http://222.85.144.70:8091/',
                'dest_addr' => 'http://222.85.144.70:8091/',
            ],
        ],
        // 统计服务器
        'server_stat' => [
            [
                'src_addr' => 'http://test-healthiptv.langma.cn:8888',
                'dest_addr' => 'http://test-healthiptv.langma.cn:8888',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://222.85.144.70:15000/',
                'dest_addr' => 'http://222.85.144.70:15000/',
            ],
        ],
        // 互联网医院轮询服务
        'hosp_polling' => [
            [
                'src_addr' => 'https://test-hosp.hlwyy.cn/lp/',
                'dest_addr' => 'https://test-hosp.hlwyy.cn/lp/',
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
                'src_addr' => 'wss://test-askhotline.langma.cn:36064',
                'dest_addr' => 'ws://test-askhotline.langma.cn:36066',
            ]
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:test-askhotline.langma.cn:37071',
                'dest_addr' => 'stun:test-askhotline.langma.cn:37071',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院ice服务
        'hosp_live_stun' => [
            [
                'src_addr' => 'stun:test-live-webrtc.hlwyy.cn:3478',
                'dest_addr' => 'stun:106.3.36.99:3478',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://test-askhotline.langma.cn:36062/',
                'dest_addr' => 'wss://test-askhotline.langma.cn:36062/',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://222.85.144.70:8101',
                'dest_addr' => 'ws://222.85.144.70:8101',
            ],
        ],
        // 直播服务licode 服务
        'hosp_live_licode' => [
            [
                'src_addr' => 'wss://test-live-webrtc.hlwyy.cn:3004',
                'dest_addr' => 'ws://106.3.36.99:3006',
            ],
        ],
        // 直播服务推送服务器
        'hosp_live_push' => [
            [
                'src_addr' => 'ws://222.85.144.70:9101',
                'dest_addr' => 'ws://222.85.144.70:9101',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://app.amx.langma.cn',
                'dest_addr' => 'http://app.amx.langma.cn',
            ],
        ],
        // 落地电话控制中心地址
        'server_control_unit' => [
            [
                'src_addr' => 'http://222.85.144.70:40000',
                'dest_addr' => 'http://222.85.144.70:40000',
            ],
        ],
        // log_config字段说明，用于配置插件端打印日志到服务器端的相关选项，对应打印日志在服务器端的路径在Application/Config/Common/Config[$CARRIER_ID].php文件中配置
        //      例如新疆电信配置为：define("INQUIRY_LOG_PATH", '/data/logs/inquiry/' . CARRIER_ID . '/');
        //      对应的输入路径为：/data/logs/inquiry/650092/yy_MM_dd.log
        // log_config_filters选项，用户过滤插件端打印内容，例如配置P2PManager，就会过滤筛选日志内容中包含P2PManager的相关信息，多个字段用，分隔
        //      注：过滤的内容区分大小写，如ErizoClient打印为内容，可在添加参数erizoclient
        // log_config_level选项，用于过滤日志级别，例如只打印Error界别，传入“*：E”；各级别配置如下
        //      verbose（最低优先级） - *:V
        //      debug（调试） - *:D
        //      info（信息）  - *:I
        //      warn（警告）  - *:W
        //      error（错误） - *:E
        //      fatal（严重错误） - *:F
        //      silent（无记载） - *:S （该配置项可用于关闭插件端日志的打印）
        "log_config" => [
            [
                "log_config_filters" => "ServerConfigManager, P2PManager,VideoInquiryManager, UserWebAPI, BooterWebAPI, MyWebsocketManager, ErizoClient, WebSocketManager, VIESessionManager",
                "log_config_level" => "*:V",
            ]
        ]
    ]));
}
// 正式服配置
else {
    define("ANDROID_SERVER_CONFIG", json_encode([
        // cws服务器
        'server_cws' => [
            [
                'src_addr' => 'http://127.0.0.1:10000',
                'dest_addr' => 'http://127.0.0.1:10000',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://218.31.231.118:10005',
                'dest_addr' => 'http://218.31.231.118:10005',
            ],
        ],
        // 互联网医院web服务器
        'hosp_apis' => [
            [
                'src_addr' => 'http://218.31.231.119:10001',
                'dest_addr' => 'http://218.31.231.119:10001',
            ],
        ],
        // 互联网医院licode服务
        'hosp_licode' => [
            [
                'src_addr' => 'wss://xjask-av.langma.cn:10001',
                'dest_addr' => 'wss://218.31.231.120:10001',
            ]
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:xjask-av.langma.cn:10004',
                'dest_addr' => 'stun:218.31.231.120:10004',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://websocket.hlwyy.cn:8282/',
                'dest_addr' => 'wss://218.31.231.119:10002',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://218.31.231.118:10003',
                'dest_addr' => 'ws://218.31.231.118:10003',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://218.31.231.118:10004',
                'dest_addr' => 'http://218.31.231.118:10004',
            ],
        ],
        // APK2.0入口地址
        'epg_lws_for_apk' => [
            [
                'src_addr' => '',
                'dest_addr' => '',
            ],
        ],
        // log_config字段说明，用于配置插件端打印日志到服务器端的相关选项，对应打印日志在服务器端的路径在Application/Config/Common/Config[$CARRIER_ID].php文件中配置
        //      例如新疆电信配置为：define("INQUIRY_LOG_PATH", '/data/logs/inquiry/' . CARRIER_ID . '/');
        //      对应的输入路径为：/data/logs/inquiry/650092/yy_MM_dd.log
        // log_config_filters选项，用户过滤插件端打印内容，例如配置P2PManager，就会过滤筛选日志内容中包含P2PManager的相关信息，多个字段用，分隔
        //      注：过滤的内容区分大小写，如ErizoClient打印为内容，可在添加参数erizoclient
        // log_config_level选项，用于过滤日志级别，例如只打印Error界别，传入“*：E”；各级别配置如下
        //      verbose（最低优先级） - *:V
        //      debug（调试） - *:D
        //      info（信息）  - *:I
        //      warn（警告）  - *:W
        //      error（错误） - *:E
        //      fatal（严重错误） - *:F
        //      silent（无记载） - *:S （该配置项可用于关闭插件端日志的打印）
        "log_config" => [
            [
                "log_config_filters" => "ServerConfigManager, P2PManager,VideoInquiryManager, UserWebAPI, BooterWebAPI, MyWebsocketManager, ErizoClient, WebSocketManager, VIESessionManager",
                "log_config_level" => "*:V",
            ]
        ]
    ]));
}