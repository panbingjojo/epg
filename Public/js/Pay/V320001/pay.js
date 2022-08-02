var buttons = [];
var returnUrl = '';                //订购返回地址

var Pay = {

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.ajax.postAPI("Pay/buildPayUrl", payInfo, function (data) {
            console.log(data);
            LMEPG.Log.error("pay.js buildPayInfo:" + JSON.stringify(data));
            if (data.result == 0) {
                LMAndroid.JSCallAndroid.doPay(data.payInfo.payUrl, function (result, notifyAndroidCallback) {
                    // 订购成功回调通知
                    LMEPG.Log.debug("Pay320001 callback success");
                    LMEPG.ajax.postAPI("Pay/payCallBackJS", null, function (data) {
                        LMEPG.Log.debug("Pay320001 payCallback success");
                        isVip = 1;
                    });
                });
            } else {
                //获取订购参数失败
                if (LMEPG.Func.isExist(data.message)) {
                    LMEPG.UI.showToast(data.message, 3);
                } else {
                    LMEPG.UI.showToast("获取订购参数失败!", 3);
                }
                //onBackDelay();
            }
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
        });
    },

    /**
     * 初始化订购页
     */
    init: function () {
        buttons.push({
            id: 'debug',
            name: '默认焦点',
        });
        LMEPG.ButtonManager.init('', buttons, '', true);
        var PayInfo = {
            "returnPageName": RenderParam.returnPageName,
        };
        Pay.buildPayInfo(PayInfo);
    },
};

/**
 * 返回处理
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 返回（延时）
 */
function onBackDelay() {
    setTimeout(function () {
        onBack();
    }, 3000);
}
