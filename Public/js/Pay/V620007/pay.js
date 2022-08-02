var buttons = [];
var returnUrl = '';                //订购返回地址
var PAY_TYPE_ANDROID = 1;
var PAY_TYPE_WEB = 2;
var PAY_TYPE_HTTP = 3;
var payType = PAY_TYPE_ANDROID;//是否需要android才能跳转到局方订购页
var payAccount = "-1";             //订购账号
var regionCode = "";
var queryOrderTime = 20;         //查询订单最大次数
var chooseIndex = 0;

var Pay = {

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.ui.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/buildPayInfo", payInfo, function (data) {
            if (data.result == 0) {
                Pay.toPay(data.payInfo);
            } else {
                //获取订购参数失败
                if (LMEPG.func.isExist(data.message)) {
                    showError(data.message);
                } else {
                    showError("获取订购参数失败!");
                }
            }
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
        });
    },

    /**
     * 点击订购项
     * @param cIndex
     */
    onPayItemClick: function (cIndex) {
        if (RenderParam.orderItems.length <= cIndex) {
            LMEPG.ui.showToast("没有该订购项!");
            return;
        }
        var PayInfo = {
            "vip_id": RenderParam.orderItems[cIndex].vip_id,
            "vip_type": RenderParam.orderItems[cIndex].vip_type,
            "product_id": cIndex + 1,
            "userId": RenderParam.userId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "price": RenderParam.orderItems[cIndex].price,
            "order_count": RenderParam.orderItems[cIndex].order_count,
            "returnPageName": RenderParam.returnPageName,
            "pay_type": 1
        };
        Pay.buildPayInfo(PayInfo);
    },

    /**
     * 初始化订购项
     */
    initButton: function () {
        buttons = [
            {
                id: 'buy_vip_1',
                name: '',
                type: 'img',
                nextFocusLeft: 'buy_vip_4',
                nextFocusRight: 'buy_vip_2',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: '',
                backgroundImage: '',
                click: Pay.onclick,
                focusChange: Pay.onFocuesChange,
                beforeMoveChange: '',
                moveChange: "",
                index: 0,
                focusable: false,
            },
            {
                id: 'buy_vip_2',
                name: '',
                type: 'img',
                nextFocusLeft: 'buy_vip_1',
                nextFocusRight: 'buy_vip_3',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: '',
                backgroundImage: '',
                click: Pay.onclick,
                focusChange: Pay.onFocuesChange,
                beforeMoveChange: '',
                moveChange: "",
                index: 1,
                focusable: false,
            },
            {
                id: 'buy_vip_3',
                name: '',
                type: 'img',
                nextFocusLeft: 'buy_vip_2',
                nextFocusRight: 'buy_vip_4',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: '',
                backgroundImage: '',
                click: Pay.onclick,
                focusChange: Pay.onFocuesChange,
                beforeMoveChange: '',
                moveChange: "",
                index: 2,
                focusable: false,
            },
            {
                id: 'buy_vip_4',
                name: '',
                type: 'img',
                nextFocusLeft: 'buy_vip_3',
                nextFocusRight: 'buy_vip_1',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: '',
                backgroundImage: '',
                click: Pay.onclick,
                focusChange: Pay.onFocuesChange,
                beforeMoveChange: '',
                moveChange: "",
                index: 3,
                focusable: false,
            },
            {
                id: 'btn_order',
                name: '订购二次确定按钮',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn_cancle',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: ROOT + '/Public/img/Pay/V620007/order_in.png',
                backgroundImage: ROOT + '/Public/img/Pay/V620007/order_out.png',
                click: Pay.confirmOkClick,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: "",
            },
            {
                id: 'btn_cancle',
                name: '订购二次取消按钮',
                type: 'img',
                nextFocusLeft: 'btn_order',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: ROOT + '/Public/img/Pay/V620007/cancle_in.png',
                backgroundImage: ROOT + '/Public/img/Pay/V620007/cancle_out.png',
                click: Pay.confirmCancleClick,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: "",
            },
        ];
    },

    /**
     *  初始化套餐显示
     */
    initOrderInfo: function () {
        if (typeof(RenderParam.orderItems) === "undefined" || RenderParam.orderItems == "") {
            showError("没有套餐");
            return;
        }
        for (var i = 0; i < RenderParam.orderItems.length; i++) {
            var domBuyVip = G("buy_vip_" + (i + 1));
            if (LMEPG.func.isExist(domBuyVip)) {
                Show("buy_vip_" + (i + 1));
                buttons[i].focusable = true;
                domBuyVip.getElementsByClassName("vip_price_text")[0].innerHTML = "￥" + RenderParam.orderItems[i].price / 100;
                domBuyVip.getElementsByClassName("vip_time_text")[0].innerHTML = RenderParam.orderItems[i].goods_name;
            }
        }
        LMEPG.ButtonManager.init(["buy_vip_1"], buttons, '', true);
    },

    /**
     * 初始化订购页
     */
    init: function () {
        Pay.initButton();
        Pay.initOrderInfo();
    },

    /**
     * 点击套餐
     * @param btn
     */
    onclick: function (btn) {
        chooseIndex = btn.index;
        if (chooseIndex == -1) {
            //没有改套餐
            LMAndroid.showToast("没有该套餐，请选择其他套餐");
        } else {
            Pay.showConfirm();
        }
    },

    /**
     * 订购二次确认按钮
     */
    confirmOkClick: function (btn) {
        Pay.onPayItemClick(chooseIndex);
    },

    /**
     * 订购二次取消按钮
     */
    confirmCancleClick: function (btn) {
        Pay.hideConfirm();
    },

    /**
     *  显示二次确认弹窗
     */
    showConfirm: function () {
        Show("confirm_dialog");
        LMEPG.ButtonManager.requestFocus("btn_cancle");
    },

    /**
     *  隐藏二次确认弹窗
     */
    hideConfirm: function () {
        Hide("confirm_dialog");
        LMEPG.ButtonManager.requestFocus("buy_vip_" + (chooseIndex + 1));
    },

    /**
     * 是否显示二次确认弹框
     */
    isShowConfirm: function () {
        var domConfirmDialog = G("confirm_dialog");
        if (LMEPG.func.isExist(domConfirmDialog)) {
            if (!is_empty(domConfirmDialog.style.display) && domConfirmDialog.style.display != "none") {
                return true;
            }
        }
        return false;
    },

    /**
     * 焦点改变方式
     * @param btn
     * @param hasFocus
     * @private
     */
    onFocuesChange: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "hover");
        }
    },

    /**
     * 甘肃移动的订购通过cws接口订购
     */
    toPay: function (payInfo) {
        var postData = {
            orderId: payInfo.tradeNo,
            userAccount: payInfo.accountIdentity,
            deviceId: payInfo.deviceId,
            orderType: 0,
        };
        LMEPG.UI.showToast("订购中，请稍等！", 100);
        LMEPG.ajax.postAPI("Pay/OrderForGansuYd", postData, function (data) {
            LMEPG.Log.error("gansuyd---OrderForGansuYd: " + data);
            var resultDataJson = JSON.parse(data);
            var callbackUrl = payInfo.returnUrl + "&resultDataJson=" + data;
            console.log("LMAndroid.JSCallAndroid.doPay callbackUrl：" + callbackUrl);
            window.location.href = callbackUrl;
        });
    },

};

/**
 * 返回处理
 */
function onBack() {
    if (Pay.isShowConfirm()) {
        Pay.hideConfirm();
    } else {
        LMEPG.Intent.back();
    }
}

/**
 * 显示错误信息
 */
function showError(msg) {
    LMEPG.UI.showToast(msg, 100);
    setTimeout(function () {
        onBack();
    }, 3000);
}
