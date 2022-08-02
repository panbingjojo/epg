
// 浏览器测试进入应用提示语
var PC_AUTH_TIPS = "浏览器测试进入";

// 重新定义鉴权方法
LMEPG.AuthUser.authUser4Android = function (authData, successFunc, failFunc) {
    if (isRunOnPC) { // 浏览器直接进入
        authData.vipState = 1;
        authData.msg = PC_AUTH_TIPS;
        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
    }else {
        authData.vipState = 0;
        // 获取鉴权参数，向sdk请求鉴权
        LMEPG.ajax.postAPI("Pay/getUserTypeAuthParams", null, function (reqAuthParams) {
            LMEPG.Log.info("[09450001.js] 鉴权参数:" + JSON.stringify(reqAuthParams));
            LMAndroid.JSCallAndroid.doUserTypeAuth(JSON.stringify(reqAuthParams), function (jsonFromAndroid, notifyAndroidCallback) {
                LMEPG.Log.info("[09450001.js] 鉴权结果:" + jsonFromAndroid);
                if(reqAuthParams.authType == 0){
                    PaySdk.handleAuthResultFromAndroid(reqAuthParams, jsonFromAndroid, function (resultCode, resultMsg, isAuthSuccess, paySdkResultCode, authProductList) {
                        LMEPG.Log.info("resultCode结果:" + resultCode + "---->isAuthSuccess结果:" + isAuthSuccess);
                        if (resultCode === 1 && isAuthSuccess) {
                            authData.vipState = 1;//sdk鉴权结果（1：鉴权成功 -1：鉴权失败）
                            // 注：需要把vip值持久化到apk层（splash页此处暂不需要，在后续登录成功后会更新写入apk层的）
                        }
                        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
                    });
                }else{
                    var result = JSON.parse(jsonFromAndroid);
                    if(result.result == "1"){
                        authData.vipState = 1;//sdk鉴权结果（1：鉴权成功 -1：鉴权失败）
                    }
                    LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
                }
            });
        });
    }
}