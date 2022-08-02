
// 鉴权代码
var AUTH_VOD_CODE = "ZHYL0000000000000000000010000003";
// 浏览器测试进入应用提示语
var PC_AUTH_TIPS = "浏览器测试进入";

// 重新定义鉴权方法
LMEPG.AuthUser.authUser4Android = function (authData, successFunc, failFunc) {
    if (RenderParam.version.result == "0" && !isRunOnPC) {
        var param = RenderParam.version.data;
        LMAndroid.JSCallAndroid.doUpdateAndInstallApk(JSON.stringify(param), "");
    }else if (isRunOnPC) { // 浏览器直接进入
        authData.vipState = 1;
        authData.msg = PC_AUTH_TIPS;
        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
    }else {
        var reqParam = {
            "serviceType": "ipqam",
            "cpId": "GDYZHYL",
            "videoType": "0",
            "videoIndex": "0",
            "cdnFlag": "gxcatv_playurl",
            "cpVideoId": AUTH_VOD_CODE,
            "userAgent": "nn_player",
            "playStyle": "http",
            "isHttp": true
        };
        LMAndroid.JSCallAndroid.doAuthAndGetMedia(JSON.stringify(reqParam), function (resParam, notifyAndroidCallback) {
            var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
            var vipState = -1;
            var reason = "调用鉴权接口失败";
            if (resParamObj.result == "0") {
                vipState = resParamObj.state,   //此状态是0表示是vip
                    reason = resParamObj.info
            }
            authData.vipState = vipState;
            authData.reason = reason;
            LMEPG.Log.info('auth450004.js--doAuth-->' + JSON.stringify(authData));
            LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
        });

    }
}