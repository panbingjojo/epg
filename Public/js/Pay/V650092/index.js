var Pay = {
    bUIldPayUrlAndJump: function (payInfo) { //构建支付地址
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/bUIldPayUrl", payInfo, function (data) {
            LMEPG.UI.dismissWaitingDialog("");
            var orderObj = null;
            if (data instanceof Object) {
                orderObj = data;
            } else {
                orderObj = JSON.parse(data);
            }
            if (data.result === 0) {
                var orderUrl = orderObj.orderUrl;
                var providerId = orderObj.providerId;
                var tempOrderInfo = decodeURIComponent(orderObj.orderInfo);
                var returnUrl = orderObj.returnUrl;
                var notifyUrl = orderObj.notifyUrl;

                G('pay').setAttribute("action", orderUrl);
                G("providerId").setAttribute("value", providerId);
                G("orderInfo").setAttribute("value", tempOrderInfo);
                G("returnUrl").setAttribute("value", returnUrl);
                G("notifyUrl").setAttribute("value", notifyUrl);
                G('pay').submit();

            } else {
                LMEPG.UI.showToast("获取订购参数异常：" + data.result);
            }
            console.log(data);

            // if (data.result == 0) {
            //     window.location.href = data.payUrl; // 得到支付地址并跳转
            // } else {
            //     LMEPG.UI.showToast("获取订购参数异常：" + data.result);
            // }
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {

        var PayInfo = {
            "vip_id": RenderParam.orderItems[btn.cIndex].vip_id,
            "product_id": btn.cIndex,//1包月订购，3包年订购
            "userId": RenderParam.userId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "returnUrl": "",
            "returnPageName": RenderParam.returnPageName,
        };
        Pay.bUIldPayUrlAndJump(PayInfo);
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (typeof(RenderParam.orderItems) === "undefined" || RenderParam.orderItems == "") {
            onBack();
            return;
        }
        LMEPG.ButtonManager.init(['focus-2-1'], buttons, '', true);
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
        backgroundImage: g_appRootPath + '/Public/img/'+RenderParam.platformType+'/Pay/V650092/payback0.png',
        focusImage: g_appRootPath + '/Public/img/'+RenderParam.platformType+'/Pay/V650092/payback1.png',
        click: onBack,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
    },
    {
        id: 'focus-2-1',
        name: "包月",
        type: "img",
        nextFocusLeft: 'focus-2-3',
        nextFocusRight: 'focus-2-2',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/'+RenderParam.platformType+'/Pay/V650092/bg_pay_type_3.png',
        focusImage: g_appRootPath + '/Public/img/'+RenderParam.platformType+'/Pay/V650092/f_pay_type_3.png',
        click: Pay.onPayItemClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIndex: 0,
    },
    {
        id: 'focus-2-2',
        name: "包日",
        type: "img",
        nextFocusLeft: 'focus-2-1',
        nextFocusRight: 'focus-2-3',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/'+RenderParam.platformType+'/Pay/V650092/bg_pay_type_2.png',
        focusImage: g_appRootPath + '/Public/img/'+RenderParam.platformType+'/Pay/V650092/f_pay_type_2.png',
        click: Pay.onPayItemClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIndex: 3,
    },
    {
        id: 'focus-2-3',
        name: "包周",
        type: "img",
        nextFocusLeft: 'focus-2-2',
        nextFocusRight: 'focus-2-1',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/'+RenderParam.platformType+'/Pay/V650092/bg_pay_type_1.png',
        focusImage: g_appRootPath + '/Public/img/'+RenderParam.platformType+'/Pay/V650092/f_pay_type_1.png',
        click: Pay.onPayItemClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIndex: 2,
    },

];

