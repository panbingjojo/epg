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
        var i = parseInt(btn.id.split('-')[1])-1;
        var PayInfo = {
            'vip_id': RenderParam.orderItems[i].vip_id,
            'product_id': btn.cIndex,//1包月订购，3包年订购
            'userId': RenderParam.userId,
            'isPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'remark': RenderParam.remark,
            'returnUrl': '',
            'price': RenderParam.orderItems[i].price,
            'returnPageName': RenderParam.returnPageName
        };
        Pay.buildPayUrlAndJump(PayInfo);
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            LMEPG.UI.showToast('获取计费项失败！');
            setTimeout(onBack, 3000);
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
        name: '包月20',
        type: 'img',
        nextFocusDown: 'focus-2-1',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V13000051/pay_1.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V13000051/pay_1_s.png',
        click: Pay.onPayItemClick,
        cIndex: 1
    },
    {
        id: 'focus-2-1',
        name: '包月30',
        type: 'img',
        nextFocusUp: 'focus-1-1',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V13000051/pay_2.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V13000051/pay_2_s.png',
        click: Pay.onPayItemClick,
        cIndex: 2
    }

];

window.onload = function () {
    Pay.init();
};
