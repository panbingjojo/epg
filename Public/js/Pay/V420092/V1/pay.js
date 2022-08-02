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
        if (RenderParam.orderItems.length <= btn.cIndex) {
            LMEPG.Log.error('订购项不匹配!');
            return;
        }
        var vip_id = RenderParam.orderItems[btn.cIndex].vip_id;
        var price = RenderParam.orderItems[btn.cIndex].price;
        //25元包月产品
        if(RenderParam.productId == 'productIDa9j000001746'){
            for(var i = 0; i < RenderParam.orderItems.length; i++) {
                if(RenderParam.orderItems[i].price == '2500'){
                    vip_id = RenderParam.orderItems[i].vip_id;
                    price = RenderParam.orderItems[i].price;
                }
            }
        }
        if(btn.id == 'ly_btn'){
            for(var i = 0; i < RenderParam.orderItems.length; i++) {
                if(RenderParam.orderItems[i].price == '3900'){
                    vip_id = RenderParam.orderItems[i].vip_id;
                    price = RenderParam.orderItems[i].price;
                }
            }
        }

        var PayInfo = {
            'vip_id': vip_id,
            'price': price,
            'product_id': btn.cIndex + 1,
            'userId': RenderParam.userId,
            'isPlaying': RenderParam.isPlaying,
            'orderReason': 102,
            'remark': RenderParam.remark,
            'returnUrl': '',
            'returnPageName': RenderParam.returnPageName
        };
        Pay.buildPayUrlAndJump(PayInfo);
    },

    /**
     * 初始化订购项
     */
    initPayItem: function () {
        buttons.push({
            id: 'health_btn',
            name: '39健康订购项',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'ly_btn',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V420092/V1/39health_fee.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V420092/V1/39health_fee_f.png',
            click: Pay.onPayItemClick,
            focusChange: Pay.onFocusChange,
            beforeMoveChange: LMEPG.emptyFunc,
            moveChange: LMEPG.emptyFunc,
            cIndex: 0
        });

        buttons.push({
            id: 'ly_btn',
            name: '老友订购',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'health_btn',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V420092/V1/ly_fee.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V420092/V1/ly_fee_f.png',
            click: Pay.onPayItemClick,
            focusChange: Pay.onFocusChange,
            beforeMoveChange: LMEPG.emptyFunc,
            moveChange: LMEPG.emptyFunc,
            cIndex: 0
        });
    },

    onFocusChange: function (btn, hasFocus) {
        if (hasFocus) {
            if(btn.id == 'ly_btn'){
                G('details').src = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V420092/V1/ly-details.png';
            }else{
                G('details').src = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V420092/V1/39-details.png';
            }
        }
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
        LMEPG.ButtonManager.init('ly_btn', buttons, '', true);
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
