var buttons = [];
var domShowDialog;
var isStarcInit = false;
var returnUrl;
var payBackUrl;

var Pay = {

    orderItem: new Object(),

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Pay/buildPayUrl', payInfo, function (data) {
            LMEPG.UI.dismissWaitingDialog('');
            if (data.result == 0) {
                returnUrl = decodeURIComponent(data.payInfo.returnUrl);

                //订购成功回调
                function successCallback(res, step) {
                    if (step == 1) {
                        //表示支付成功
                        LMEPG.UI.showToast('订购成功', 3);
                        //构建支付结果回调地址
                        var gzgdTradeNo = res.output.serialno;
                        payBackUrl = returnUrl + '&result=0&gzgdTradeNo=' + gzgdTradeNo;
                    } else {
                        //表示支付成功之后的支付结果显示界面的确认按钮,点击以后在返回
                        window.location.href = payBackUrl;
                    }
                }

                //关闭订购页回调
                function closeCallback() {
                    if (LMEPG.Func.isEmpty(payBackUrl)) {
                        //判断没有订购成功就关闭订购弹窗
                        onBack();
                    } else {
                        window.location.href = payBackUrl;
                    }
                }

                //错误回调，判断的错误点都是我方的，局方的订购没有错误回调
                function errorCallback() {
                    onBackDelay();
                }

                gzgdPay.start(successCallback, closeCallback, errorCallback);
            } else {
                //获取订购参数失败
                LMEPG.UI.showToast('获取订购参数失败!', 3);
                onBackDelay();
            }
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        if (RenderParam.orderItems.length <= btn.cIndex) {
            LMEPG.UI.showToast('订购项不匹配!');
            return;
        }
        var PayInfo = {
            'vip_id': RenderParam.orderItems[btn.cIndex].vip_id,
            'vip_type': RenderParam.orderItems[btn.cIndex].vip_type,
            'product_id': btn.cIndex + 1,
            'userId': RenderParam.userId,
            'isPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'remark': RenderParam.remark,
            'returnUrl': '',
            'returnPageName': RenderParam.returnPageName
        };
        Pay.buildPayInfo(PayInfo);
    },

    /**
     * 初始化订购项
     */
    initButton: function () {
        buttons.push(
            {
                id: 'default',
                name: '',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: '',
                focusImage: '',
                click: '',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0
            }
        );
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            LMEPG.UI.showToast('没有套餐', 3000);
            onBackDelay();
            return;
        }
        domShowDialog = G('showDialog');
        this.initButton();
        LMEPG.ButtonManager.init('default', buttons, '', true);

        //设置视达科js初始化超时
        setTimeout(function () {
            if (isStarcInit == false) {
                LMEPG.UI.showToast('网络异常，请稍后重试!', 8);
                onBack();
            }
        }, 5000);
        //初始化视达科js中间件接口
        starcorCom.ready(function () {
            isStarcInit = true;
            Pay.onPayItemClick(buttons[0]);
        });
    }
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
