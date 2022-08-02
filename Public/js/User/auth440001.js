// 鉴权代码
var AUTH_VOD_CODE = "02000642000000012020062999423142";
// 获取盒子信息失败提示
var GET_DEVICE_INFO_FAIL_TIPS = '获取盒子信息失败';
// 鉴权失败提示
var AUTH_FAIL_TIPS = 'android端进入';
// 本地测试提示
var LOCAL_TEST_TIPS = '网页端进入';

var YSTEN_CONTENT_ID = "";
var YSTEN_PRODUCT_TYPE = "1";

// 调用广东移动apk安卓端鉴权
function auth4GUANG_DONG(authData, successFunc, failFunc) {
    LMAndroid.JSCallAndroid.doAuthAndIsVip({vodCode: AUTH_VOD_CODE}, function (res, notifyAndroidCallback) {
        LMEPG.Log.info('auth440001.js--doAuthAndIsVip--result:：' + res);
        var data = JSON.parse(res);
        if (data.result == "0") {  // 鉴权成功，并且该用户是vip
            authData.vipState = data.isVip;
            authData.msg = data.msg;
            LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
        } else {
            authData.vipState = 0;
            authData.msg = AUTH_FAIL_TIPS;
            LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
        }
    });
}

// 初始化融合包SDK
function initYstenSdk(authData, successFunc, failFunc) {
    var userData = {
        userId: authData.accountId
    };
    LMAndroid.JSCallAndroid.doInitYstenSdk(JSON.stringify(userData), function (res,notifyAndroidCallback) {
        LMEPG.Log.info('auth440001.js--doInitYstenSdk-->' + JSON.stringify(res));
        auth4GUANG_DONGYsten(authData, successFunc, failFunc);
    });
}

// 调用广东移动apk易视腾接口鉴权
function auth4GUANG_DONGYsten(authData, successFunc, failFunc) {
    var data = {
        userId: authData.accountId,
        contentId: YSTEN_CONTENT_ID,
        productId: RenderParam.productId,
        productType: YSTEN_PRODUCT_TYPE,
    };
    LMAndroid.JSCallAndroid.doAuthOrize(JSON.stringify(data),
        function (res, notifyAndroidCallback) {
            LMEPG.Log.info('auth440001.js--doAuthOrize--result:：' + res);
            console.log('auth440001.js--doAuthOrize--result:：' + res);
            var resultData = JSON.parse(res);
            if (resultData.result == "0") {  // 鉴权成功，并且该用户是vip
                authData.vipState = resultData.isVip;
                authData.msg = resultData.msg;
            } else {
                authData.vipState = 0;
                authData.msg = AUTH_FAIL_TIPS;
            }
            LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
    });
}

// 重新定义鉴权方法
LMEPG.AuthUser.authUser4Android = function (authData, successFunc, failFunc) {
    if (isRunOnPC) { // 浏览器直接进入
        authData.accountId = "lmtest-gdyd-001";
        authData.deviceInfoForGuangDongYD = "43543";  //pc端必须赋值，不能删除
        authData.vipState = 1;
        authData.msg = LOCAL_TEST_TIPS;
        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
    }else {
        LMEPG.Log.info('auth440001.js--isEnterFromYsten-->' + RenderParam.isEnterFromYsten);
        LMAndroid.JSCallAndroid.getSetTopBoxInfo('', function (res, notifyAndroidCallback) {
            var data = JSON.parse(res);
            LMEPG.Log.info('auth440001.js--getSetTopBoxInfo-->' + JSON.stringify(data));
            if (data && data.result == "0") { //获取盒子信息成功！
                authData.accountId = data.data.userId;
                authData.deviceInfoForGuangDongYD = data.data;
                LMEPG.Log.info('auth440001.js--authData-->' + JSON.stringify(authData));
                if(RenderParam.isEnterFromYsten == "1"){
                    initYstenSdk(authData,successFunc, failFunc);
                }else{
                    auth4GUANG_DONG(authData, successFunc, failFunc);
                }
            } else {
                failFunc({
                    code: -1,
                    message: GET_DEVICE_INFO_FAIL_TIPS,
                });
            }
        });
    }

}
