
// 浏览器测试进入应用提示语
var PC_AUTH_TIPS = "浏览器测试进入";
// 浏览器测试进入应用提示语
var FREE_VERSION_TIPS = "免费版本进入";

// 重新定义鉴权方法
LMEPG.AuthUser.authUser4Android = function (authData, successFunc, failFunc) {
    var deviceInfo = JSON.parse(authData.deviceInfo);
    if (isRunOnPC) { // 浏览器直接进入
        authData.vipState = 1;
        authData.msg = PC_AUTH_TIPS;
        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
    }else if (deviceInfo.app_version_num == 1) { // 浏览器直接进入
        authData.vipState = 1;
        authData.msg = FREE_VERSION_TIPS;
        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
    }else {
        LMAndroid.JSCallAndroid.doAuth(null, function (resParam, notifyAndroidCallback) {
            var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
            authData.vipState = resParamObj.isVip;
            authData.msg = resParamObj.msg;
            LMEPG.Log.info('auth360001.js--doAuth-->' + JSON.stringify(authData));
            LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
        });
    }
}