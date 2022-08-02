function onBack() {
    LMEPG.Intent.back();
}

/**
 * 网络请求
 */
var Network = {
    /**
     * 保存用户播放进度
     */
    savePlayerProgress: function (value, callback) {
        var postData = {
            'key': 'EPG-LWS-LATEST-VIDEOINFO-' + RenderParam.carrierId + '-' + RenderParam.userId,
            'value': value
        };
        LMEPG.ajax.postAPI('Activity/saveStoreData', postData, function (rsp) {
            console.log(rsp);
            if (callback)
                callback();
        });
    }
};

