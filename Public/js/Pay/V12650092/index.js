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
        LMEPG.ButtonManager.init(['btn_order'], buttons, '', true);
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
        id: 'btn_order',
        name: "20元包月",
        type: "img",
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/'+RenderParam.platformType+'/Pay/V12650092/btn_order.png',
        focusImage: g_appRootPath + '/Public/img/'+RenderParam.platformType+'/Pay/V12650092/btn_order_f.png',
        click: Pay.onPayItemClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIndex: 0,
    },

];

