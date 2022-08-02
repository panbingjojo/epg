var GDGD_BRIDGE = {
    /**
     * 统一的WebViewJavascriptBridge调用入口
     * @param tag 方法名
     * @param params  参数
     * @param callback 回调
     * @constructor
     */
    bridge: function (tag, params, callback) {
        if (window.WebViewJavascriptBridge) {
            LMEPG.Log.info('[manager.js GDGD_BRIDGE]--->[bridge]--->tag:'+tag+'  params:' + JSON.stringify(params));
            WebViewJavascriptBridge.callHandler(
                tag,
                params,
                callback
            );
        } else {
            LMEPG.Log.info('[manager.js GDGD_BRIDGE]--->[bridge111]--->tag:'+tag+'  params:' + JSON.stringify(params));
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                , function () {
                    WebViewJavascriptBridge.callHandler(
                        tag,
                        params,
                        callback
                    );
                },
                false
            );
        }
    },

    /**
     * 获取配置信息
     * @param callback 回调函数
     */
    getEpgConfig: function (callback) {
        LMEPG.Log.info('[manager.js GDGD_BRIDGE]--->[getEpgConfig]--->');
        this.bridge("GetConfig", {'param': ""}, callback);
    },

    /**
     * 广东广电EPG 全屏播放
     * @param assetId 视频id
     * @param offset_time  0 时从头开始播放
     * @param playType playType=0 正常播放； playType=1 试看
     */
    startFullScreenPlay: function (assetId, offset_time = 0, playType = 1) {
        this.bridge(
            "CallVodPlay",
            {'assetId': assetId, 'providerId': "11052", 'offset_time': offset_time, "playType": playType},
            function (_json) {
                LMEPG.Log.info('[440004][bridge.js]---[startFullScreenPlay]--->_json: ' + _json);
            }
        );
    },
}

