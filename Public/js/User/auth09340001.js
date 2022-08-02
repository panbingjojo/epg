
function handleAuth (resParam, authData, successFunc, failFunc) {
    var res = JSON.parse(resParam);
    if (res.code === '0') {
        authData.vipState = 1;
        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
    } else if (res.code === '100') {
        //未订购，返回订购需要参数
        //保存订购所需要的参数
        var param = { param : JSON.stringify(res.params)}
        LMEPG.ajax.postAPI("User/saveStoreAuthCallbackParam", param, function (data) {
            authData.vipState = 0;
            LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
        });
    } else {
        //未订购
        authData.vipState = 0;
        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
    }
}

// 重新定义鉴权方法
LMEPG.AuthUser.authUser4Android = function (authData, successFunc, failFunc) {
    if (isRunOnPC) { // 浏览器直接进入
        var mockResParams = '{"params":{"ItemCode":"1500107832","ChargingPointId":"BP8179","NotifyURL_CP":"http:\\/\\/120.209.138.11:5080\\/iptvappsvr\\/third_party_feedback","PayCategory":"2","AppID":"0000000120191210113502","OrderContinue":"1","TransactionID":"2228514470testyst00120201203145903","PackageName":"com.longmaster.iptv.health.anhuiYDyiban","RentTime":"30","Price":"2900","ItemName":"互联网电视生活会员","OrderDesc":"{\'Describe\':\'安徽39在线问诊订购\'}","NotifyURL":"http:\\/\\/120.209.138.11:5080\\/iptvappsvr\\/third_party_feedback","RepeatOrder":"1","ReturnURL":"http:\\/\\/www.guttv.cn\\/","CPID":"20180929135913"},"code":"100"}'
        handleAuth(mockResParams,authData,successFunc,failFunc)
    }else {
        LMAndroid.JSCallAndroid.doAuth(null, function (resParam, notifyAndroidCallback) {
            LMEPG.Log.info('09340001.js doAuth result:' + resParam);
            handleAuth(resParam,authData,successFunc,failFunc)
        });
    }
}

