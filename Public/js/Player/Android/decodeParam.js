/**
 * 用于配置视频播放时的解码信息
 * 播放器类型:0->rawplayer; 1->ijkplayer;default->0; lowerBuffer->1
 * Created by Administrator on 2019-04-12.
 */
var decodeParam = (function(){
    var object = {
        allConfig:[],

         // 每个元素格式：盒子型号 + 解码参数信息
         config000006 : [ // 中国联通
            {"stbModel":"S3", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 1,"lowerBuffer": 1}},
            {"stbModel":"HG680Y", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 1,"lowerBuffer": 1}},
        ],

        config000005 : [ // 江苏电信_悦me
            {"stbModel":"HG680J", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
        ],

        config320002 : [ // 江苏电信
            {"stbModel":"HG680J", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
        ],

        config620007 : [ // 甘肃移动
            {"stbModel":"MagicBox1s_Plus", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
        ],

        config02000011 : [ // 国安广视
            {"stbModel":"HC2910-S", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
        ],

        config450004 : [ // 广西广电
            {"stbModel":"Hi3798MV200", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
        ],

        config630001 : [ //青海移动
            {"stbModel":"R1500", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
        ],

        config640001 : [ //宁夏移动
            {"stbModel":"R1500", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
        ],

        config000509 : [ //APK2.0演示版demo5
            {"stbModel":"R1500", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
        ],

        config000709 : [ //APK2.0演示版demo7
            {"stbModel":"SE818", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 1,"lowerBuffer": 1}},
            {"stbModel":"R3300", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 1,"lowerBuffer": 1}},
        ],

        config430002 : [ //湖南电信
            {"stbModel":"TY1208-Z", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
            {"stbModel":"B860A", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
            {"stbModel":"B860AV1.1-T", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 0,"lowerBuffer": 1}},
            {"stbModel":"B860AV1.1", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 1,"lowerBuffer": 1}},
            {"stbModel":"B760EV3", "param": {"showPlayingInfo": false,"playerType": 1,"playerDecoderType": 1, "lowerBuffer": 0}},
        ],

        initData: function () {
            // 总的配置参数
            this.allConfig = [
                {"carrierId": "000006", "config": this.config000006},
                {"carrierId": "000005", "config": this.config000005},
                {"carrierId": "320002", "config": this.config320002},
                {"carrierId": "620007", "config": this.config620007},
                {"carrierId": "02000011", "config": this.config02000011},
                {"carrierId": "450004", "config": this.config450004},
                {"carrierId": "630001", "config": this.config630001},
                {"carrierId": "640001", "config": this.config640001},
                {"carrierId": "000509", "config": this.config000509},
                {"carrierId": "000709", "config": this.config000709},
                {"carrierId": "430002", "config": this.config430002},
            ];
        },

        /**
         * 查询视频盒子的解码类型以及相关参数
         * @param carrierId 区域码
         * @param stbModel 盒子型号
         */
        queryDecodeParam: function (carrierId, stbModel) {
            LMEPG.Log.info("queryDecodeParam---> stbModel:" + stbModel + ", carrierId : " + carrierId );
            var param = {
                "showPlayingInfo": false,		// 是否显示实时播放信息:false->不显示；true->显示;default->false
                "playerType": 0,			// 全屏播放器类型:0->rawplayer；1->ijkplayer;default->0
                "playerDecoderType": 0,	// 全屏播放器解码类型：0->硬解码；1->软解码；default-0
                "lowerBuffer" : 1, // 是否打开秒开机制，1->打开，0->关闭
            };

            // 根据carrierId来提取对应的配置
            var tmpConfig;
            for (var i = 0; i < this.allConfig.length; i++) {
                var itemConfig = this.allConfig[i];
                if (carrierId == itemConfig.carrierId) {
                    tmpConfig = itemConfig.config;
                }
            }

            if (tmpConfig) {
                param = decodeParam._queryDecodeParam(tmpConfig, stbModel);
            }
            return param;
        },

        /**
         * 根据盒子型号来查询特殊配置
         * @param config 配置参数
         * @param stbModel 盒子型号
         */
        _queryDecodeParam: function (config, stbModel) {
            LMEPG.Log.info("_queryDecodeParam---> stbModel:" + stbModel + "config : " + JSON.stringify(config) );
            var param = {
                "showPlayingInfo": false,
                "playerType": 0,
                "playerDecoderType": 0,
                "lowerBuffer" : 1
            };

            for (var i = 0; i < config.length; i++) {
                var info = config[i];
                if (info.stbModel == stbModel) {
                    param = info.param;
                    break;
                }
            }
            return param;
        },
    };
    object.initData();
    return object;
})();