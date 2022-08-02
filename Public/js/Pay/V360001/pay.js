var buttons = [];
var returnUrl = '';                //订购返回地址

var Pay = {

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.ui.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/buildPayUrl", payInfo, function (data) {
            console.log(data);
            LMEPG.Log.error("pay.js buildPayInfo:" + JSON.stringify(data));
            if (data.result == 0) {
                Pay.toPay(data);
            } else {
                //获取订购参数失败
                if(LMEPG.func.isExist(data.message)){
                    LMEPG.ui.showToast(data.message, 3);
                } else {
                    LMEPG.ui.showToast("获取订购参数失败!", 3);
                }
                onBackDelay();
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

    /**
     * 去订购
     */
    toPay: function () {
        LMEPG.UI.showWaitingDialog();
        LMAndroid.JSCallAndroid.doPay(null,function (param, notifyAndroidCallback) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.Log.info("360001 toPay result:" + param);
            param = param instanceof Object ? param : JSON.parse(param);
            /*// 订购失败
            if (param.result == -1) {
                LMEPG.UI.showToast(param.data);
                onBack();
            }
            // 订购成功
            else {
                LMEPG.LOG.info("toPay returnUrl:" + returnUrl + "?isOrder=1");
                window.location.href = returnUrl + "?isOrder=1";
            }*/
        });
        // 直接返回，江西移动计费有可能不返回结果
        onBack();
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
