var contentContainer = "content_container";

var singleMonth = "single_month";
var singleYear = "single_year";

var lmOrderId = "";

var orderServerUrl = 'http://100.83.3.30:8008/orders';

var OrderList = {

    // 月卡
    singleMonthImage: g_appRootPath + '/Public/img/hd/Pay/V220001/V2/single_month.png',
    // 月卡 - 选中
    singleMonthFocusImage: g_appRootPath + '/Public/img/hd/Pay/V220001/V2/single_month_focus.png',

    // 年卡
    singleYearImage: g_appRootPath + '/Public/img/hd/Pay/V220001/V2/single_year.png',
    // 年卡 - 选中
    singleYearFocusImage: g_appRootPath + '/Public/img/hd/Pay/V220001/V2/single_year_focus.png',

    /**
     * 展示订购选项
     */
    show: function (focusElementId) {
        var _html = '<img id="' + singleMonth + '" src="' + OrderList.singleMonthImage + '" />';
        _html += '<img id="' + singleYear + '" src="' + OrderList.singleYearImage + '" />';

        G(contentContainer).innerHTML = _html;

        if (typeof focusElementId != 'undefined') {
            LMEPG.ButtonManager.requestFocus(focusElementId);
        } else {
            OrderList.addButtons();
        }
    },

    addButtons: function () {
        var _buttons = [
            {
                id: singleMonth,
                name: '月卡',
                type: 'img',
                nextFocusRight: singleYear,
                backgroundImage: OrderList.singleMonthImage,
                focusImage: OrderList.singleMonthFocusImage,
                click: OrderList.onOrderItemClick,
                renew: "0",
                cycleType: 1,
                orderMonth: '1',
                vipId: "26",
            }, {
                id: singleYear,
                name: '年卡',
                type: 'img',
                nextFocusLeft: singleMonth,
                backgroundImage: OrderList.singleYearImage,
                focusImage: OrderList.singleYearFocusImage,
                click: OrderList.onOrderItemClick,
                renew: "0",
                cycleType: 4,
                orderMonth: '12',
                vipId: "26",
            },
        ];
        LMEPG.ButtonManager.init(singleMonth, _buttons, '', true);
    },

    /**
     * 订购项点击事件
     * @param button 点击事件关联订购项
     */
    onOrderItemClick: function (button) {

        var fee = PayController.queryFee(button.cycleType, button.renew);
        if (fee == -1) {
            LMEPG.UI.showToast("查询产品信息失败！");
        } else {
            PayController.serviceOrder(button.vipId, button.cycleType, button.renew, fee, function (serverOrderInfo) {
                switch (button.id) {
                    case singleMonth:
                        PaymentContainer.orderId4Month = serverOrderInfo.orderId;
                        PaymentContainer.weChatQRCode4Month = orderServerUrl + serverOrderInfo.wechatQrUrl;
                        PaymentContainer.aliQRCode4Month = orderServerUrl + serverOrderInfo.alipayQrUrl;
                        PaymentContainer.price4Month = serverOrderInfo.fee;
                        PaymentContainer.show(singleMonth);
                        break;
                    case singleYear:
                        PaymentContainer.orderId4Year = serverOrderInfo.orderId;
                        PaymentContainer.weChatQRCode4Year = orderServerUrl + serverOrderInfo.wechatQrUrl;
                        PaymentContainer.aliQRCode4Year = orderServerUrl + serverOrderInfo.alipayQrUrl;
                        PaymentContainer.price4Year = serverOrderInfo.fee;
                        PaymentContainer.show(singleYear);
                        break;
                }
            });
        }
    }
};

var wechatPayment = "wechat_payment";
var aliPayment = "ali_payment";
var paymentDetail = "payment_detail";
var paySure = "pay_sure";
var payCancel = "pay_cancel";
var QRCode = "pay_qr_code";

var PaymentContainer = {

    // 绑定的订购选项，即是点击哪个订购选项触发
    bindOrderItemId: '',

    // 月卡微信二维码链接
    weChatQRCode4Month: '',
    // 月卡支付宝二维码链接
    aliQRCode4Month: '',

    // 年卡微信二维码链接
    weChatQRCode4Year: '',
    // 年卡支付宝二维码链接
    aliQRCode4Year: '',

    // 月卡订购ID
    orderId4Month: '',
    // 年卡订购ID
    orderId4Year: '',

    // 月卡订购价格
    price4Month: '',
    // 年卡订购价格
    price4Year: '',

    // 微信支付
    wechatPaymentImage: g_appRootPath + '/Public/img/hd/Pay/V220001/V2/wechat_payment.png',
    // 微信支付 - 选中
    wechatPaymentFocusImage: g_appRootPath + '/Public/img/hd/Pay/V220001/V2/wechat_payment_focus.png',
    // 微信支付 - 移开
    wechatPaymentSelectImage: g_appRootPath + '/Public/img/hd/Pay/V220001/V2/wechat_payment_select.png',
    // 支付宝支付
    aliPaymentImage: g_appRootPath + '/Public/img/hd/Pay/V220001/V2/ali_payment.png',
    // 支付宝支付 - 选中
    aliPaymentFocusImage: g_appRootPath + '/Public/img/hd/Pay/V220001/V2/ali_payment_focus.png',
    // 支付宝支付 - 选中移开
    aliPaymentSelectImage: g_appRootPath + '/Public/img/hd/Pay/V220001/V2/ali_payment_select.png',
    // 确定按钮
    sureImage: g_appRootPath + '/Public/img/hd/Pay/V220001/btn_sure_unselected.png',
    // 确定按钮 - 选中
    sureFocusImage: g_appRootPath + '/Public/img/hd/Pay/V220001/btn_sure_selected.png',
    // 取消按钮
    cancelImage: g_appRootPath + '/Public/img/hd/Pay/V220001/btn_cancel_unselected.png',
    // 取消按钮 - 选中
    cancelFocusImage: g_appRootPath + '/Public/img/hd/Pay/V220001/btn_cancel_selected.png',

    // 是否显示
    isShow: false,
    // 是否已经加载内容，出现，防止多次添加按钮
    isLoaded: false,

    focusPayment: '',

    // 月卡微信支付轮询结果定时器
    timer4MonthWeChat: null,
    // 月卡支付宝支付轮询结果定时器
    timer4MonthAli: null,
    // 年卡微信支付轮询结果定时器
    timer4YearWeChat: null,
    // 年卡支付宝支付轮询结果定时器
    timer4YearAli: null,

    // 当前是否正在查询微信支付订购结果
    isQueryWeChatResult: false,
    // 当前是否正在查询支付宝支付订购结果
    isQueryAliResult: false,

    /**
     * 显示计费详情
     */
    show: function (orderItemId) {
        var _html = '<img id="' + wechatPayment + '" src="' + PaymentContainer.wechatPaymentImage + '">';
        _html += '<img id="' + aliPayment + '" src="' + PaymentContainer.aliPaymentImage + '">';
        _html += '<div id="' + paymentDetail + '" >';
        _html += '<div class="payment_desc">您正在通过<span id="qr_code_name"></span>支付购买“电视家庭医生会员”<span id="qr_code_cycle"></span>个月产品,价格为<span id="qr_code_price"></span>元。</div>';
        _html += '<div class="payment_info">资费信息：<span id="price"></span></div>';
        _html += '<img id="' + QRCode + '">';
        _html += '</div>';
        _html += '<img id="' + paySure + '" src="' + PaymentContainer.sureImage + '">'
        _html += '<img id="' + payCancel + '" src="' + PaymentContainer.cancelImage + '">'

        G(contentContainer).innerHTML = _html;
        PaymentContainer.isShow = true;

        if (!PaymentContainer.isLoaded) {
            PaymentContainer.addButtons();
        }

        PaymentContainer.bindOrderItemId = orderItemId;
        // 默认选中微信支付
        LMEPG.ButtonManager.requestFocus(wechatPayment);
    },

    /**
     * 添加按钮焦点
     */
    addButtons: function () {
        var _buttons = [{
            id: paySure,
            name: '支付确定',
            type: 'img',
            nextFocusRight: payCancel,
            backgroundImage: PaymentContainer.sureImage,
            focusImage: PaymentContainer.sureFocusImage,
            click: PaymentContainer.onClickSure,
            focusChange: PaymentContainer.onSureFocusChange,
            beforeMoveChange: PaymentContainer.onBtnMoveChange,
        }, {
            id: payCancel,
            name: '支付取消',
            type: 'img',
            nextFocusLeft: paySure,
            backgroundImage: PaymentContainer.cancelImage,
            focusImage: PaymentContainer.cancelFocusImage,
            click: PaymentContainer.onClickCancel,
            beforeMoveChange: PaymentContainer.onBtnMoveChange,
        }, {
            id: wechatPayment,
            name: '微信支付',
            type: 'img',
            nextFocusRight: aliPayment,
            nextFocusDown: paySure,
            backgroundImage: PaymentContainer.wechatPaymentImage,
            focusImage: PaymentContainer.wechatPaymentFocusImage,
            selectedImage: PaymentContainer.wechatPaymentSelectImage,
            focusChange: PaymentContainer.onWechatPaymentFocusChange,
        }, {
            id: aliPayment,
            name: '支付宝支付',
            type: 'img',
            nextFocusLeft: wechatPayment,
            nextFocusDown: paySure,
            backgroundImage: PaymentContainer.aliPaymentImage,
            focusImage: PaymentContainer.aliPaymentFocusImage,
            selectedImage: PaymentContainer.aliPaymentSelectImage,
            focusChange: PaymentContainer.onAliPaymentFocusChange,
        }];
        LMEPG.ButtonManager.addButtons(_buttons);
        PaymentContainer.isLoaded = true;
    },

    onBtnMoveChange: function (direction, button) {
        if (direction === 'up') {
            LMEPG.ButtonManager.requestFocus(PaymentContainer.focusPayment);
        }
    },

    /**
     * 确定按钮点击事件
     * @param button
     */
    onClickSure: function (button) {
        LMEPG.UI.showToast("请扫描上方的二维码进行支付！");
        var msg = "支付提醒：请扫描上方的二维码进行支付！";
        reportOrderInfo(lmOrderId, 4, msg);
    },

    /**
     * 确定按钮焦点改变事件
     * @param button
     * @param hasFocus 当前是否获取焦点
     */
    onSureFocusChange: function (button, hasFocus) {
        if (hasFocus) {
            LMEPG.ButtonManager.setSelected(PaymentContainer.focusPayment, true);
        }
    },

    /**
     * 取消按钮点击事件
     * @param button
     */
    onClickCancel: function (button) {
        PaymentContainer.hide();
    },

    /**
     * 微信支付按钮焦点改变事件
     * @param button
     * @param hasFocus 当前是否获得叫i的那
     */
    onWechatPaymentFocusChange: function (button, hasFocus) {
        if (hasFocus) {
            PaymentContainer.focusPayment = button.id;
            PaymentContainer.showWechatQRCode();
            // 开始查询订购结果
            if (!PaymentContainer.isQueryWeChatResult) {
                PaymentContainer.queryOrderStatus();
            }
        } else {
            LMEPG.ButtonManager.setSelected(button.id, false);
        }
    },

    queryOrderStatus: function () {
        switch (PaymentContainer.bindOrderItemId) {
            case singleMonth:
                PayController.queryOrderStatus(PaymentContainer.orderId4Month, PaymentContainer.focusPayment, PaymentContainer.onQueryOrderStatusSuccess);
                break;
            case singleYear:
                PayController.queryOrderStatus(PaymentContainer.orderId4Year, PaymentContainer.focusPayment, PaymentContainer.onQueryOrderStatusSuccess);
                break;
        }
    },

    onQueryOrderStatusSuccess: function (status, focusPayment) {
        if (focusPayment === wechatPayment) PaymentContainer.isQueryWeChatResult = true;
        if (focusPayment === aliPayment) PaymentContainer.isQueryAliResult = true;
        switch (status) {
            case 1:
                // 上报支付状态
                var payType = focusPayment === wechatPayment ? '1' : '2';
                PayController.uploadPayResult(payType);
                var msg = "支付提醒：支付成功";
                reportOrderInfo(lmOrderId, 3, msg);
                break;
            case 2:
                LMEPG.UI.showToast("当前订单支付失败");
                var msg = "支付提醒：当前订单支付失败";
                reportOrderInfo(lmOrderId, 3, msg);
                break;
            case 3:
            case 4:
                if (PaymentContainer.bindOrderItemId === singleMonth && focusPayment === wechatPayment) {
                    PaymentContainer.timer4MonthWeChat = setTimeout(function () {
                        PayController.queryOrderStatus(PaymentContainer.orderId4Month, wechatPayment, PaymentContainer.onQueryOrderStatusSuccess);
                    }, 3 * 1000);
                } else if (PaymentContainer.bindOrderItemId === singleMonth && focusPayment === aliPayment) {
                    PaymentContainer.timer4MonthAli = setTimeout(function () {
                        PayController.queryOrderStatus(PaymentContainer.orderId4Month, aliPayment, PaymentContainer.onQueryOrderStatusSuccess);
                    }, 3 * 1000);
                } else if (PaymentContainer.bindOrderItemId === singleYear && focusPayment === wechatPayment) {
                    PaymentContainer.timer4YearWeChat = setTimeout(function () {
                        PayController.queryOrderStatus(PaymentContainer.orderId4Year, wechatPayment, PaymentContainer.onQueryOrderStatusSuccess);
                    }, 3 * 1000);
                } else if (PaymentContainer.bindOrderItemId === singleYear && focusPayment === wechatPayment) {
                    PaymentContainer.timer4YearAli = setTimeout(function () {
                        PayController.queryOrderStatus(PaymentContainer.orderId4Year, aliPayment, PaymentContainer.onQueryOrderStatusSuccess);
                    }, 3 * 1000);
                }
                break;
        }
    },

    /**
     * 展示微信二维码
     */
    showWechatQRCode: function () {
        G('qr_code_name').innerHTML = "微信";
        switch (PaymentContainer.bindOrderItemId) {
            case singleMonth :
                G(QRCode).src = PaymentContainer.weChatQRCode4Month;
                G('qr_code_cycle').innerHTML = "1";
                G('qr_code_price').innerHTML = PaymentContainer.price4Month / 100 + "";
                G('price').innerHTML = PaymentContainer.price4Month / 100 + "元";
                var msg = "支付提醒：您正在通过微信支付购买“电视家庭医生会员”1个月产品,价格为"+PaymentContainer.price4Month / 100 + "元"+".请扫码支付！";
                break;
            case singleYear :
                G(QRCode).src = PaymentContainer.weChatQRCode4Year;
                G('qr_code_cycle').innerHTML = "12";
                G('qr_code_price').innerHTML = PaymentContainer.price4Year / 100 + "";
                G('price').innerHTML = PaymentContainer.price4Year / 100 + "元";
                var msg = "支付提醒：您正在通过微信支付购买“电视家庭医生会员”12个月产品,价格为"+PaymentContainer.price4Year / 100 + "元"+".请扫码支付！";
                break;
        }
        reportOrderInfo(lmOrderId, 2, msg);
    },

    /**
     * 支付宝支付按钮焦点改变事件
     * @param button
     * @param hasFocus 当前是否获得叫i的那
     */
    onAliPaymentFocusChange: function (button, hasFocus) {
        if (hasFocus) {
            PaymentContainer.focusPayment = button.id;
            PaymentContainer.showAliQRCode();
            if (!PaymentContainer.isQueryAliResult) {
                PaymentContainer.queryOrderStatus();
            }
        } else {
            LMEPG.ButtonManager.setSelected(button.id, false);
        }
    },

    /**
     * 展示支付宝二维码
     */
    showAliQRCode: function () {
        G('qr_code_name').innerHTML = "支付宝";
        switch (PaymentContainer.bindOrderItemId) {
            case singleMonth :
                G(QRCode).src = PaymentContainer.aliQRCode4Month;
                G('qr_code_cycle').innerHTML = "1";
                G('qr_code_price').innerHTML = PaymentContainer.price4Month / 100 + "";
                G('price').innerHTML = PaymentContainer.price4Month / 100 + "元";
                var msg = "支付提醒：您正在通过支付宝购买“电视家庭医生会员”1个月产品,价格为"+PaymentContainer.price4Month / 100 + "元"+".请扫码支付！";
                break;
            case singleYear :
                G(QRCode).src = PaymentContainer.aliQRCode4Year;
                G('qr_code_cycle').innerHTML = "12";
                G('qr_code_price').innerHTML = PaymentContainer.price4Year / 100 + "";
                G('price').innerHTML = PaymentContainer.price4Year / 100 + "元";
                var msg = "支付提醒：您正在通过支付宝购买“电视家庭医生会员”1个月产品,价格为"+PaymentContainer.price4Year / 100 + "元"+".请扫码支付！";
                break;
        }
        reportOrderInfo(lmOrderId, 2, msg);
    },

    hide: function () {
        OrderList.show(PaymentContainer.bindOrderItemId);
        // 清除定时器
        PaymentContainer.isShow = false;
        if (PaymentContainer.timer4MonthWeChat) clearTimeout(PaymentContainer.timer4MonthWeChat);
        if (PaymentContainer.timer4YearWeChat) clearTimeout(PaymentContainer.timer4YearWeChat);
        if (PaymentContainer.timer4MonthAli) clearTimeout(PaymentContainer.timer4MonthAli);
        if (PaymentContainer.timer4YearAli) clearTimeout(PaymentContainer.timer4YearAli);
        PaymentContainer.isQueryWeChatResult = false;
        PaymentContainer.isQueryAliResult = false;
    }
};

var PayController = {

    queryFee: function (cycleType, isRenew) {
        var result = -1;
        var products = RenderParam.extraData.productInfo.products;
        var product = products[0]; // 局方配置只有一个产品
        var fees = product.fees;
        for (var index = 0; index < fees.length; index++) {
            var fee = fees[index];
            if (fee.cycleType == cycleType) {
                if (isRenew == "1") {
                    result = fee.feeRenew;
                } else {
                    result = fee.fee;
                }
                break;
            }
        }
        return result;
    },

    serviceOrder: function (vipId, cycleType, renew, fee, callback) {
        var data = {
            "userId": RenderParam.userId, // 朗玛：用户Id
            "vipId": vipId, // 套餐ID
            "orderReason": RenderParam.orderReason, // 订购触发条件
            "remark": RenderParam.remark, // 订单备注
            "backPage": RenderParam.returnPageName, // 订购成功返回页面
            "isRoutePlayer": RenderParam.isPlaying,
            "cycleType": cycleType,
            "customerRenew": renew,
            "fee": fee
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Pay/serviceOrder', data, function (rspData) {
            LMEPG.UI.dismissWaitingDialog();
            if (rspData.code == 0) {
                lmOrderId = rspData.order_id;
                var msg = "用户申请订购25元产品，生成订单，订单号："+rspData.orderId;
                reportOrderInfo(lmOrderId, 1, msg);

                callback(rspData);
            } else if (rspData.message) {
                LMEPG.UI.showToast(rspData.message);
            } else {
                LMEPG.UI.showToast("预订单失败，code = " + rspData.code);
            }
        }, function (xmlHttp, errorInfo) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("预订单失败，服务器出错," + xmlHttp.status);
        })
    },

    queryOrderStatus: function (orderId, paymentType, callback) {
        var data = {
            "orderId": orderId
        }
        LMEPG.ajax.postAPI('Pay/queryOrderStatus', data, function (rspData) {
            if (rspData.code == 0) {
                callback(rspData.status, paymentType);
            } else {
                LMEPG.UI.showToast("查询订单状态失败，code = " + rspData.code);
            }
        }, function (xmlHttp, errorInfo) {
            LMEPG.UI.showToast("查询订单状态失败，服务器出错," + xmlHttp.status);
        })
    },

    uploadPayResult: function (payType) {
        var data = {
            "payType": payType,
            "payTime": new Date().format("yyyy-MM-dd hh:mm:ss"),
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Pay/insertOrderInfo', data, function (rspData) {
            LMEPG.UI.dismissWaitingDialog();
            if (rspData.result == 0) {
                LMEPG.UI.showToast("订购成功", 3, function () {
                    LMEPG.Intent.back();
                });
            } else {
                LMEPG.UI.showToast("上报支付结果失败，code = " + rspData.code, "," + rspData.msg);
            }
        }, function (xmlHttp, errorInfo) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("上报支付结果失败，服务器出错," + xmlHttp.status);
        })
    }

}

function reportOrderInfo(orderId, status, msg){
    var postData = {
        "orderId": orderId,
        "status": status,
        "msg": msg,
    };
    // 获取目标地址
    LMEPG.ajax.postAPI("Pay/reportOrderInfo", postData, function (data) {
        try {
            data = data instanceof Object ? data : JSON.parse(data);
            if (data) {
                LMEPG.Log.info("reportOrderInfo ---> result:" + data.result);
            }
        } catch (e) {
            LMEPG.Log.error("reportOrderInfo ---> exception(" + e.toString() + ")");
        }
    });
}

/**
 * 遥控器返回事件
 */
function onBack() {
    if (PaymentContainer.isShow) {
        PaymentContainer.hide();
    } else {
        LMEPG.Intent.back();
    }
}