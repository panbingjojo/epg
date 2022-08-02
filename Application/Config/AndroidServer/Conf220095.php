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
                'src_addr' => 'http://10.128.3.146:10000',
                'dest_addr' => 'http://10.128.3.146:10000',
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
                'src_addr' => 'http://10.128.3.146:10002/fs/',
                'dest_addr' => 'http://10.128.3.146:10002/fs/',
            ],
        ],
        // 崩溃跟踪服务器
        'server_crash' => [
            [
                'src_addr' => 'http://10.128.3.146:10006',
                'dest_addr' => 'http://10.128.3.146:10006',
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
                'dest_addr' => 'ws://10.128.3.146:10008',
            ],
            [
                'src_addr' => 'wss://webrtc1.hlwyy.cn:3004',
                'dest_addr' => 'ws://10.128.3.146:10009',
            ],
            [
                'src_addr' => 'wss://webrtc2.hlwyy.cn:3004',
                'dest_addr' => 'ws://10.128.3.146:10010',
            ],
        ],
        // 互联网医院ice服务
        'hosp_stun' => [
            [
                'src_addr' => 'stun:webrtc.hlwyy.cn:3478',
                'dest_addr' => 'turn:10.128.3.146:20000',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院ice服务
        'hosp_live_stun' => [
            [
                'src_addr' => 'stun:iptv-video.hlwyy.cn:3478',
                'dest_addr' => 'turn:10.128.3.146:20000',
                'turn_username' => 'test',
                'turn_passwd' => 'testpwd',
            ],
        ],
        // 互联网医院视频问诊WSS服务器
        'hosp_inquiry_wss' => [
            [
                'src_addr' => 'wss://websocket.hlwyy.cn:8282/',
                'dest_addr' => 'wss://10.128.3.146:10011',
            ],
        ],
        // 健康检测、直播、日志上传ES推送服务器
        'server_general_push' => [
            [
                'src_addr' => 'ws://10.128.3.146:10012',
                'dest_addr' => 'ws://10.128.3.146:10012',
            ],
        ],
        // 音频适配服务器
        'audio_adapter' => [
            [
                'src_addr' => 'http://10.128.3.146:10013',
                'dest_addr' => 'http://10.128.3.146:10013',
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
