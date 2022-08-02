var buttons = [];
var Pay = {
    /**
     * 构建支付地址
     * @param payInfo
     */
    buildPayUrlAndJump: function (payInfo) {
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Pay/buildPayUrl', payInfo, function (data) {
            LMEPG.UI.dismissWaitingDialog('');
            if (data.result == 0) {
                // 得到支付地址并跳转
                window.location.href = data.payUrl;
            }
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        switch (btn.id) {
            case 'back_btn':
                onBack();
                break;
            default:
                if (RenderParam.orderItems.length <= btn.cIndex) {
                    LMEPG.Log.error('订购项不匹配!');
                    return;
                }
                var PayInfo = {
                    'vip_id': RenderParam.orderItems[btn.cIndex].vip_id,
                    'product_id': btn.cIndex + 1,
                    'userId': RenderParam.userId,
                    'isPlaying': RenderParam.isPlaying,
                    'orderReason': RenderParam.orderReason,
                    'remark': RenderParam.remark,
                    'returnUrl': '',
                    'returnPageName': RenderParam.returnPageName
                };
                Pay.buildPayUrlAndJump(PayInfo);
                break;
        }
    },

    /**
     * 初始化订购项
     */
    initPayItem: function () {
        buttons.push({
            id: 'back_btn',
            name: '返回',
            type: 'img',
            nextFocusLeft: 'sure_btn',
            nextFocusRight: 'sure_btn',
            nextFocusUp: '',
            nextFocusDown: 'sure_btn',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V420092/back_btn.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V420092/back_btn_f.png',
            click: Pay.onPayItemClick,
            focusChange: LMEPG.emptyFunc,
            beforeMoveChange: LMEPG.emptyFunc,
            moveChange: LMEPG.emptyFunc,
            cIndex: 0
        });

        buttons.push({
            id: 'sure_btn',
            name: '包月订购项',
            type: 'img',
            nextFocusLeft: 'back_btn',
            nextFocusRight: 'back_btn',
            nextFocusUp: 'back_btn',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V420092/sure_btn.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V420092/sure_btn_f.png',
            click: Pay.onPayItemClick,
            focusChange: LMEPG.emptyFunc,
            beforeMoveChange: LMEPG.emptyFunc,
            moveChange: LMEPG.emptyFunc,
            cIndex: 0
        });
    },

    /**
     *  初始化显示规则
     */
    initShowRule: function () {
        // 下面判断是否为自动跳转，如果是自动跳转，则按stay_duration时间来跳转
        var showRule = RenderParam.showRule;
        if (showRule != '') {
            if (RenderParam.showRule.result != 0) {
                return;
            }

            var rule = showRule.data;
            if (rule.is_jump == 1) {
                var duration = parseInt(rule.stay_duration) * 1000;
                setTimeout('Pay.onPayItemClick(\'sure_btn\')', duration); // duration秒后跳转
            }
        }
    },

    /**
     * 初始化订购页
     */
    init: function () {
        this.initPayItem();
        LMEPG.ButtonManager.init('back_btn', buttons, '', true);
        // this.initShowRule();
    }
};

/**
 * 返回处理
 */
function onBack() {
    LMEPG.Intent.back();
}

window.onload = function () {
    Pay.init();
};
