<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 关于当前模块提供给第三方客户端使用时的一些配置：
// | 例如：app_id、app_key等等之类
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/2 9:26
// +----------------------------------------------------------------------

return array(
    //'配置项'=>'配置值'
    'SESSION_AUTO_START' => false,              // 是否自动开启Session
    'DEFAULT_C_LAYER' => 'APIController',       // 是否自动开启Session
    'ACTION_SUFFIX' => 'Action',                //操作方法后缀

    // 说明：分配第三方客户端的app_id/app_key等信息。
    // 作用：主要用于第三方请求我方（贵阳朗玛）接口时，用于身份校验等。
    'API_CLIENT_INFO' => array(
        CARRIER_ID_SICHUANGD => array(
            // 由lws分配给第三方app的key值，需要传递上来在lws端先进行身份校验的key。用md5加密后判断。
            'client_key' => '7mMAHy9m',

            // 互联网医院（问诊模块）相关
            'hlwyy' => array(
                'app_id' => 10002, //第三方互联网接口调用时传递的appid
                'app_key_test' => 'DcJL354uvIvEdvI9J2wc5Fq08ODjKBbW', //第三方互联网接口调用时传递的appkey：测试服
                'app_key_release' => 'DcJL354uvIvEdvI9J2wc5Fq08ODjKBbW', //第三方互联网接口调用时传递的appkey：正式服
            ),

            // 健康检测模块相关
            'measure' => array(
                'app_id' => 10005, //第三方使用"健康检测模块API"时需要传递的appid
                'app_key' => 'BuClta5T', //第三方使用"健康检测模块API"时需要传递的appkey。注意：第三方应该用该值md5加密传递上来
            ),

            // 微信小程序端相关
            'wx_mini' => array(
                'app_id' => 10006, //微信小程序端使用的appid
                'app_key' => 'GmBBcEWM', //微信小程序端使用的appkey。
            ),

            // VIP套餐id/cws上报后端定义类型映射枚举（注：由四川广电订购成功后，君吉从局方计费结果只能得到对应的套餐id信息，不方便设计我方提供的package_type类型，故我方根据套餐id来做映射）
            // 注意：若后期业务调整，贵阳朗玛申请的vip套餐有变动，则需要与四川广电（君吉对接负责）双方协定，然后该配置同步更新即可！
            //
            // 定义array：key-vip套餐id，value-vip套餐对应的cws上报接口定义的package_type类型值。
            //      package_type(1)     电视门诊（单次）	        15元/次	        包含一次电视门诊，无时间限制。
            //      package_type(2)     电视门诊（包月）	        50元/5次/月	    包含每月5次电视门诊，本月未使用次数，次月不做累计，有效期一个月。超出部分按单次电视门诊计费。
            //      package_type(3)     高血压管理包（包年）	    799元/60次/年	包含每月5次电视门诊，一年共计60次。一年未使用次数，次年不做累计，有效期一年。（每月不做次数限制）
            //      package_type(4)     糖尿病管理基础包（包年）	799元/60次/年	包含每月5次电视门诊，一年共计60次。一年未使用次数，次年不做累计，有效期一年。（每月不做次数限制）
            //      package_type(5)     糖尿病管理增值包（包年）	998元/60次/年	包含拉雅多功能测试仪一部，包含每月5次电视门诊，一年共计60次。一年未使用次数，次年不做累计，有效期一年。（每月不做次数限制）
            //      package_type(6)     健康管理包（包年）	        365元/36次/年	包含每月3次电视门诊，一年共计36次。一年未使用次数，次年不做累计。（每月不做次数限制）
            'vip_pack_id_map' => array(
                '55058' => 1,
                '55059' => 2,
                '55060' => 3,
                '55061' => 4,
            ),
        ),
    ),
);