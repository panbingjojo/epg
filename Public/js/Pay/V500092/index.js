var Pay = {
    /**
     * 初始化订购页
     */
    init: function () {
        LMEPG.ButtonManager.init(['focus-2-1'], buttons, '', true);
    },
    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        var PayInfo = {
            'vip_id': RenderParam.orderItems[btn.cIndex-1].vip_id,
            'product_id': btn.cIndex,//1包月订购，3包年订购
            'userId': RenderParam.userId,
            'isPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'remark': RenderParam.remark,
            'returnUrl': '',
            'price': 2500,//RenderParam.orderItems[0].price,
            'returnPageName': RenderParam.returnPageName
        };
        Pay.buildPayUrlAndJump(PayInfo);
    },

    buildPayUrlAndJump: function (payInfo) { //构建支付地址
        //LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Pay/buildPayUrl', payInfo, function (data) {
            //LMEPG.UI.dismissWaitingDialog('');
            if (data.result == 0) {
                window.location.href = data.payUrl; // 得到支付地址并跳转
            } else {
                LMEPG.UI.showToast('获取订购参数异常：' + data.result);
            }
        });
    },
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
        name: "返回",
        type: "img",
        nextFocusLeft: 'focus-2-1',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Pay/V650092/payback0.png',
        focusImage: g_appRootPath + '/Public/img/hd/Pay/V650092/payback1.png',
        click: onBack,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
    },
    {
        id: 'focus-2-1',
        name: "包月",
        type: "img",
        nextFocusLeft: 'focus-2-4',
        nextFocusRight: 'focus-2-2',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Pay/V500092/bg_pay_type_1.png',
        focusImage: g_appRootPath + '/Public/img/hd/Pay/V500092/f_pay_type_1.png',
        click: Pay.onPayItemClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIndex: 1,
    },
    {
        id: 'focus-2-2',
        name: "续包月",
        type: "img",
        nextFocusLeft: 'focus-2-1',
        nextFocusRight: 'focus-2-3',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Pay/V500092/bg_pay_type_2.png',
        focusImage: g_appRootPath + '/Public/img/hd/Pay/V500092/f_pay_type_2.png',
        click: Pay.onPayItemClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIndex: 2,
    },
    {
        id: 'focus-2-3',
        name: "季度",
        type: "img",
        nextFocusLeft: 'focus-2-2',
        nextFocusRight: 'focus-2-4',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Pay/V500092/bg_pay_type_3.png',
        focusImage: g_appRootPath + '/Public/img/hd/Pay/V500092/f_pay_type_3.png',
        click: Pay.onPayItemClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIndex: 3,
    },
    {
        id: 'focus-2-4',
        name: "包年",
        type: "img",
        nextFocusLeft: 'focus-2-3',
        nextFocusRight: 'focus-2-1',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Pay/V500092/bg_pay_type_4.png',
        focusImage: g_appRootPath + '/Public/img/hd/Pay/V500092/f_pay_type_4.png',
        click: Pay.onPayItemClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIndex: 4,
    },

];

