
// 浏览器测试进入应用提示语
var PC_AUTH_TIPS = "浏览器测试进入";

// 重新定义鉴权方法
LMEPG.AuthUser.authUser4Android = function (authData, successFunc, failFunc) {
    LMEPG.Log.info("Splash页鉴权结果 isEnterFromYsten:" + RenderParam.isEnterFromYsten);
    if(RenderParam.isEnterFromYsten == "1"){
        LMEPG.Log.info("Splash页鉴权结果 isRunOnPC:" + isRunOnPC);
        if (isRunOnPC) { // 浏览器直接进入
            authData.vipState = 0;
            authData.msg = PC_AUTH_TIPS;
            LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
        }else {
            // 获取鉴权参数，向sdk请求鉴权
            LMEPG.ajax.postAPI("Pay/getUserTypeAuthParams", null, function (reqAuthParams) {
                LMEPG.Log.info("Splash页鉴权结果 getUserTypeAuthParams:" + JSON.stringify(reqAuthParams));

                LMAndroid.JSCallAndroid.doUserTypeAuth(JSON.stringify(reqAuthParams), function (jsonFromAndroid, notifyAndroidCallback) {
                    LMEPG.Log.info("Splash页鉴权结果:" + jsonFromAndroid);
                    PaySdk.handleAuthResultFromAndroid(reqAuthParams, jsonFromAndroid, function (resultCode, resultMsg, isAuthSuccess, paySdkResultCode, authProductList) {
                        LMEPG.Log.info("Splash页鉴权结果 resultCode:" + resultCode);
                        LMEPG.Log.info("Splash页鉴权结果 isAuthSuccess:" + isAuthSuccess);
                        if (resultCode === 1 && isAuthSuccess) {
                            authData.userTypeAuth = 1;//sdk鉴权结果（1：鉴权成功 -1：鉴权失败）
                            // 注：需要把vip值持久化到apk层（splash页此处暂不需要，在后续登录成功后会更新写入apk层的）
                        }
                        LMEPG.Log.info("Splash页鉴权结果 authData:" + JSON.stringify(authData));
                        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
                    });
                });
            });
        }
    }else {
        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
    }
}


function  dataAnalysis(data){
    data = data.split(',');
    for (var i = 0; i < data.length; i++) {
        if(data[i].indexOf("result") != -1){

        }
    }
}