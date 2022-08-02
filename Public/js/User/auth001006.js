// 获取盒子信息失败提示
var GET_DEVICE_INFO_FAIL_TIPS = '获取盒子信息失败';
// 鉴权失败提示
var AUTH_FAIL_TIPS = 'android端进入';
// 本地测试提示
var LOCAL_TEST_TIPS = '网页端进入';

// 重新定义鉴权方法
LMEPG.AuthUser.authUser4Android = function (authData, successFunc, failFunc) {
    LMEPG.Log.info('auth001006.js--authUser4Android--> isRunOnPC = ' + isRunOnPC);
    if (isRunOnPC) { // 浏览器直接进入
        authData.accountId = "lmtest-ott-001";
        authData.deviceInfo = "43543";  //pc端必须赋值，不能删除
        authData.vipState = 1;
        authData.msg = LOCAL_TEST_TIPS;
        LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
    }else {
        LMAndroid.JSCallAndroid.getSetTopBoxInfo('', function (res, notifyAndroidCallback) {
            var data = JSON.parse(res);
            LMEPG.Log.info('auth001006.js--getSetTopBoxInfo-->' + JSON.stringify(data));
            if (data && data.result == "0") { //获取盒子信息成功！
                authData.accountId = data.data.userId;
                authData.deviceInfo = JSON.stringify(data.data);
                LMEPG.Log.info('auth001006.js--authData-->' + JSON.stringify(authData));
                // auth4ChinaunicomOTT(authData, successFunc, failFunc);
                LMEPG.AuthUser.authByNetwork(authData, successFunc, failFunc);
            } else {
                failFunc({
                    code: -1,
                    message: GET_DEVICE_INFO_FAIL_TIPS,
                });
            }
        });
    }

}
