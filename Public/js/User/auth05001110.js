
// 浏览器测试进入应用提示语
var PC_AUTH_TIPS = "浏览器测试进入";
// 鉴权成功
var AUTH_TIPS = "无需鉴权进入";

// 重新定义鉴权方法
LMEPG.AuthUser.authUser4Android = function (authData, successFunc, failFunc) {
    if (isRunOnPC) { // 浏览器直接进入
        authData.msg = PC_AUTH_TIPS;
    }else {
        authData.msg = AUTH_TIPS;
    }
    LMEPG.ajax.postAPI("Pay/getProductInfo",null,function (res) {
        LMAndroid.JSCallAndroid.doUserTypeAuth(JSON.stringify(res), function (resParam, notifyAndroidCallback) {
            LMEPG.Log.info("Splash页鉴权结果:" + resParam);
            var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
            authData.vipState = resParamObj.result == 1?resParamObj.result:0;
            authData.msg = encodeURIComponent(resParamObj.data);
            LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
        });
    });
}