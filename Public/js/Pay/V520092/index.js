/**
 * 返回
 */
function onBack() {
    LMEPG.UI.showToast('放弃订购');
    LMEPG.Intent.back();
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
                'price': orderItem.price,
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
                    // 判断vip有效期
//                        if(RenderParam.debug == "0"){
//                            // 正式服,还需要匹配价格
//                            if(RenderParam.orderItems[i].price.search(price) != -1){
//                                return i;
//                            }
//                        } else{
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
        id: 'btn-pay-itv',
        name: 'itv支付',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'btn-pay-third-half-year',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V520092/phonepayin.png',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V520092/phonepayout.png',
        click: Pay.onPayItemClick,
        cIndex: 0,
        product_id: '39JK_ITV'
    },
    {
        id: 'btn-pay-third-half-year',
        name: '半年包',
        type: 'img',
        nextFocusLeft: 'btn-pay-itv',
        nextFocusRight: 'btn-pay-third-one-year',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V520092/halfyearin.png',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V520092/halfyearout.png',
        click: Pay.onPayItemClick,
        cIndex: 1,
        product_id: '39JK_THIRD_48'
    },
    {
        id: 'btn-pay-third-one-year',
        name: '一年包',
        type: 'img',
        nextFocusLeft: 'btn-pay-third-half-year',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V520092/oneyearin.png',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V520092/oneyearout.png',
        click: Pay.onPayItemClick,
        cIndex: 2,
        product_id: '39JK_THIRD_96'
    }
];

window.onload = function () {
    Pay.init();
};
