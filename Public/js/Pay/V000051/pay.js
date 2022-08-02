var buttons = [];
var Pay = {

    orderProductName: RenderParam.areaCode == "211" || RenderParam.areaCode == "217" ? "家康小卫士" : "39健康",

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
     * 构建支付地址
     * @param payInfo
     */
    buildPayUrlExAndJump: function (payInfo) {
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Pay/buildPayUrlEx', payInfo, function (data) {
            LMEPG.UI.dismissWaitingDialog('');
            if (data.result == 0) {
                // 得到支付地址并跳转
                window.location.href = data.payUrl;
            }
        });
    },

    /**
     * 调整统一支付认证
     */
    jumpUnifiedAuthUrl: function () {
        var index = 0;
        if (RenderParam.vip_id != '') {
            for (var i = 0; i < RenderParam.orderItems.length; i++) {
                if (RenderParam.orderItems[i].vip_id == RenderParam.vip_id) {
                    index = i;
                    break;
                }
            }
        }
        var PayInfo = {
            'vip_id': RenderParam.orderItems[index].vip_id,
            'vip_type': RenderParam.orderItems[index].vip_type,
            'product_id': index + 1,
            'userId': RenderParam.userId,
            'isPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'remark': RenderParam.remark,
            'price': RenderParam.orderItems[index].price,
            'videoInfo': JSON.stringify(RenderParam.videoInfo)
        };
        Pay.buildPayUrlExAndJump(PayInfo);
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
        if (RenderParam.isPayUnifyAuth == 1) {
            LMEPG.UI.commonDialog.show('确定订购' + Pay.orderProductName + RenderParam.orderItems[btn.cIndex].price / 100 + '元/月产品吗?', ['确定', '取消'], function (index) {
                if (index == 0) {
                    var PayInfo = {
                        'vip_id': RenderParam.orderItems[btn.cIndex].vip_id,
                        'vip_type': RenderParam.orderItems[btn.cIndex].vip_type,
                        'product_id': btn.cIndex + 1,
                        'userId': RenderParam.userId,
                        'isPlaying': RenderParam.isPlaying,
                        'orderReason': RenderParam.orderReason,
                        'remark': RenderParam.remark,
                        'price': RenderParam.orderItems[index].price,
                        'returnPageName': RenderParam.returnPageName,
                        'videoInfo': JSON.stringify(RenderParam.videoInfo)
                    };
                    Pay.buildPayUrlExAndJump(PayInfo);
                } else if (index == 1) {
                    LMEPG.UI.commonDialog.dismiss();
                }
            });
        } else {
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
            Pay.buildPayUrlAndJump(PayInfo);
        }
    },

    /**
     * 初始化订购项
     */
    initPayItem: function () {
        switch (RenderParam.areaCode) {
/*            case '211':  // 黑龙江
                buttons.push({
                    id: 'pay_item_1',
                    name: '单月订购项',
                    type: 'img',
                    nextFocusLeft: 'cancel',
                    nextFocusRight: 'cancel',
                    nextFocusUp: '',
                    nextFocusDown: '',
                    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V7/sure_btn.png',
                    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V7/sure_btn_focus.png',
                    click: Pay.onPayItemClick,
                    focusChange: LMEPG.emptyFunc,
                    beforeMoveChange: LMEPG.emptyFunc,
                    moveChange: LMEPG.emptyFunc,
                    cIndex: 1
                });
                buttons.push(
                    {
                        id: 'cancel',
                        name: '取消',
                        type: 'img',
                        nextFocusLeft: 'pay_item_1',
                        nextFocusRight: 'pay_item_1',
                        nextFocusUp: '',
                        nextFocusDown: '',
                        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V7/cancel_btn.png',
                        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V7/cancel_btn_focus.png',
                        click: onBack,
                        focusChange: LMEPG.emptyFunc,
                        beforeMoveChange: LMEPG.emptyFunc,
                        moveChange: LMEPG.emptyFunc
                    }
                );
                S('pay_item_1');   //  显示单月订购项
                break;*/
            case '217':  // 湖北
            case '211':  // 黑龙江
                buttons.push({
                    id: 'pay_item_0',
                    name: '包月订购项',
                    type: 'img',
                    nextFocusLeft: 'pay_item_1',
                    nextFocusRight: 'pay_item_1',
                    nextFocusUp: 'back',
                    nextFocusDown: '',
                    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V5/bg_pay_item_0.png',
                    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V5/f_pay_item_0.png',
                    click: Pay.onPayItemClick,
                    focusChange: LMEPG.emptyFunc,
                    beforeMoveChange: LMEPG.emptyFunc,
                    moveChange: LMEPG.emptyFunc,
                    cIndex: 0
                });
                buttons.push({
                    id: 'pay_item_1',
                    name: '单月订购项',
                    type: 'img',
                    nextFocusLeft: 'pay_item_0',
                    nextFocusRight: 'pay_item_0',
                    nextFocusUp: 'back',
                    nextFocusDown: '',
                    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V5/bg_pay_item_1.png',
                    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V5/f_pay_item_1.png',
                    click: Pay.onPayItemClick,
                    focusChange: LMEPG.emptyFunc,
                    beforeMoveChange: LMEPG.emptyFunc,
                    moveChange: LMEPG.emptyFunc,
                    cIndex: 1
                });
                buttons.push(
                    {
                        id: 'back',
                        name: '返回',
                        type: 'img',
                        nextFocusLeft: '',
                        nextFocusRight: '',
                        nextFocusUp: '',
                        nextFocusDown: 'pay_item_0',
                        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V5/bg_back.png',
                        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V5/f_back.png',
                        click: onBack,
                        focusChange: LMEPG.emptyFunc,
                        beforeMoveChange: LMEPG.emptyFunc,
                        moveChange: LMEPG.emptyFunc
                    }
                );
                S('pay_item_1');   //  显示单月订购项
                break;
            default:
                H('pay_item_1');  // 隐藏单月订购项
                buttons.push({
                    id: 'pay_item_0',
                    name: '包月订购项',
                    type: 'img',
                    nextFocusLeft: '',
                    nextFocusRight: '',
                    nextFocusUp: '',
                    nextFocusDown: '',
                    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V5/bg_pay_item_0.png',
                    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V5/f_pay_item_0.png',
                    click: Pay.onPayItemClick,
                    focusChange: LMEPG.emptyFunc,
                    beforeMoveChange: LMEPG.emptyFunc,
                    moveChange: LMEPG.emptyFunc,
                    cIndex: 0
                });
                break;
        }
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            onBack();
            return;
        }
        if(RenderParam.areaCode == "211" || RenderParam.areaCode == "217"){ // 黑龙江
            document.body.style.backgroundImage = "url(" + g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Pay/V000051/V1/bg_pay.png)";
        }else { // 其他地区
            document.body.style.backgroundImage = "url(" + g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Pay/V000051/V5/first_sure_bg.png)";
        }
        this.initPayItem();
        var focusId = RenderParam.areaCode == '211' ? 'pay_item_1' : 'pay_item_0'; // 默认焦点 黑龙江默认单月
        LMEPG.ButtonManager.init(focusId, buttons, '', true);
    }
};

/**
 * 返回处理
 */
function onBack() {
    LMEPG.Intent.back();
}
