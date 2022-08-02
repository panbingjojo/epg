
// 鉴权代码
var AUTH_VOD_CODE = "39JKCODE000000101000000300001113";
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
        var reqData = {
            contentID: AUTH_VOD_CODE,
        }
        LMAndroid.JSCallAndroid.doAuth(JSON.stringify(reqData), function (resParam, notifyAndroidCallback) {
            var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
            authData.vipState =resParamObj.code == "0" ? 1 : 0;
            authData.msg = resParamObj.msg;
            LMEPG.Log.info('auth150002.js--doAuth-->' + JSON.stringify(authData));
            LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
        });
    }
}