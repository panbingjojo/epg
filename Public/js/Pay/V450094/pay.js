var Pay = {
    buildPayUrlAndJump: function (payInfo) { //构建支付地址
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Pay/buildPayUrl', payInfo, function (data) {
            LMEPG.UI.dismissWaitingDialog('');
            if (data.result == 0) {
                window.location.href = data.payUrl; // 得到支付地址并跳转
            } else {
                LMEPG.UI.showToast('获取订购参数异常：' + data.result);
            }
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {

        var PayInfo = {
            'vip_id': RenderParam.orderItems[0].vip_id,
            'product_id': btn.cIndex,//1包月订购，3包年订购
            'userId': RenderParam.userId,
            'isPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'remark': RenderParam.remark,
            'returnUrl': '',
            'returnPageName': RenderParam.returnPageName
        };
        Pay.buildPayUrlAndJump(PayInfo);
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            onBack();
            return;
        }
        LMEPG.ButtonManager.init('focus-1-1', buttons, '', true);
    }
};

/**
 * 返回处理
 */
function onBack() {
    LMEPG.Intent.back();
}

var buttons = [
    {
        id: 'focus-1-1',
        name: '返回',
        type: 'img',
        nextFocusLeft: 'focus-2-1',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V450092/back0.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V450092/back1.png',
        click: onBack,
        cIndex: 0
    },
    {
        id: 'focus-2-1',
        name: '包月',
        type: 'img',
        nextFocusRight: 'focus-1-1',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V450092/month0.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V450092/month1.png',
        click: Pay.onPayItemClick,
        cIndex: 1
    }

];

window.onload = function () {
    Pay.init();
};
