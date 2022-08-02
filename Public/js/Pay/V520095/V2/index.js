/**
 * 返回
 */
function onBack() {
    if (G('rule-bg').style.display == 'block') {
        G('rule-bg').style.display = 'none';
        LMEPG.BM.requestFocus('rule');
    } else {
        LMEPG.UI.showToast('放弃订购');
        LMEPG.Intent.back();
    }
}

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
        var index = Pay.getOrderInfoIndex(btn);
        if (index == -1) {
            //没有改套餐
            LMEPG.UI.showToast('没有该套餐，请选择其他套餐');
        } else {
            var orderItem = RenderParam.orderItems[index];
            var PayInfo = {
                'vip_id': orderItem.vip_id,
                'vip_type': orderItem.vip_type,
                'product_id': btn.product_id,
                'userId': RenderParam.userId,
                'isPlaying': RenderParam.isPlaying,
                'orderReason': RenderParam.orderReason,
                'remark': RenderParam.remark,
                'returnPageName': RenderParam.returnPageName,
                'videoInfo': JSON.stringify(RenderParam.videoInfo)
            };
            Pay.buildPayUrlAndJump(PayInfo);
        }
    },

    /**
     * 获取具体的套餐
     */
    getOrderInfoIndex: function getOrderInfoIndex(btn) {
        var orderName = G(btn.id).getAttribute('orderName');
        var expire = G(btn.id).getAttribute('expire');
        var price = G(btn.id).getAttribute('price');
        for (var i = 0; i < RenderParam.orderItems.length; i++) {
            if (RenderParam.orderItems[i].goods_name.search(orderName) != -1) {
                //判断套餐名称
                if (expire == RenderParam.orderItems[i].expire) {
//                        // 判断vip有效期
//                        if (RenderParam.debug == "0") {
//                            // 正式服,还需要匹配价格
//                            if (RenderParam.orderItems[i].price.search(price) != -1) {
//                                return i;
//                            }
//                        } else {
//                            // 测试服
//                            return i;
//                        }
                    return i;
                }
            }
        }
        return -1;
    },
    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            onBack();
            return;
        }
        LMEPG.ButtonManager.init('btn-pay-itv', buttons, '', true);
    }
};

var buttons = [
    {
        id: 'rule-bg',
        name: '返回',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        click: onBack,
        focusChange: '',
        beforeMoveChange: ''
    },
    {
        id: 'back',
        name: '返回',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: 'rule',
        focusImage: LMEPG.App.getAppRootPath() + '/Public/img/'+RenderParam.platformType+'/Activity/ActivityDiscount/V2/f_back.png',
        backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/'+RenderParam.platformType+'/Activity/ActivityDiscount/V2/bg_back.png',
        click: onBack,
        focusChange: '',
        beforeMoveChange: ''
    },
    {
        id: 'rule',
        name: '规则',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: 'back',
        nextFocusDown: 'btn-pay-itv',
        focusImage: LMEPG.App.getAppRootPath() + '/Public/img/'+RenderParam.platformType+'/Activity/ActivityDiscount/V2/f_rule.png',
        backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/'+RenderParam.platformType+'/Activity/ActivityDiscount/V2/bg_rule.png',
        click: showRule,
        focusChange: '',
        beforeMoveChange: ''
    },

    {
        id: 'btn-pay-itv',
        name: 'itv支付',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'btn-pay-third-half-year',
        nextFocusUp: 'rule',
        nextFocusDown: '',
        focusImage: LMEPG.App.getAppRootPath() + '/Public/img/'+RenderParam.platformType+'/Activity/ActivityDiscount/V2/phonepayin.png',
        backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/'+RenderParam.platformType+'/Activity/ActivityDiscount/V2/phonepayout.png',
        click: Pay.onPayItemClick,
        focusChange: '',
        beforeMoveChange: '',
        moveChange: '',
        cIndex: 0,
        product_id: '39JK_ITV'
    },
    {
        id: 'btn-pay-third-half-year',
        name: '半年包',
        type: 'img',
        nextFocusLeft: 'btn-pay-itv',
        nextFocusRight: 'btn-pay-third-one-year',
        nextFocusUp: 'rule',
        nextFocusDown: '',
        focusImage: LMEPG.App.getAppRootPath() + '/Public/img/'+RenderParam.platformType+'/Activity/ActivityDiscount/V2/halfyearin.png',
        backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/'+RenderParam.platformType+'/Activity/ActivityDiscount/V2/halfyearout.png',
        click: Pay.onPayItemClick,
        focusChange: '',
        beforeMoveChange: '',
        moveChange: '',
        cIndex: 1,
        product_id: '39JK_THIRD_48'
    },
    {
        id: 'btn-pay-third-one-year',
        name: '一年包',
        type: 'img',
        nextFocusLeft: 'btn-pay-third-half-year',
        nextFocusRight: '',
        nextFocusUp: 'rule',
        nextFocusDown: '',
        focusImage: LMEPG.App.getAppRootPath() + '/Public/img/'+RenderParam.platformType+'/Activity/ActivityDiscount/V2/oneyearin.png',
        backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/'+RenderParam.platformType+'/Activity/ActivityDiscount/V2/oneyearout.png',
        click: Pay.onPayItemClick,
        focusChange: '',
        beforeMoveChange: '',
        moveChange: '',
        cIndex: 2,
        product_id: '39JK_THIRD_96'
    }
];


function showRule() {
    G('rule-bg').style.display = 'block';
    LMEPG.BM.requestFocus('rule-bg');
}

/**
 * 页面跳转 - 显示中奖信息
 */
function jumpPriceInfo() {
    var objCurrent = getCurrentPage();

    var objActivityWinList = LMEPG.Intent.createIntent('payShowResult');

    LMEPG.Intent.jump(objActivityWinList, objCurrent);
}

/**
 * 获取当前页对象
 */
function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent('payShowResult');
    return objCurrent;
}
