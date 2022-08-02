// +----------------------------------------------------------------------
// | EPG-LWS
// +----------------------------------------------------------------------
// | 吉林广电EPG订购逻辑
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/3/28 15:02
// +----------------------------------------------------------------------
//调试模式，上线改为false

window.unPreventDefault = true;

var debug = true;
// 页面按钮
var buttons = [];

function log(tag, msg, errorLevel) {
    if (errorLevel === true) console.error('[540001][pay.js]--->[' + tag + ']--->' + msg);
    else console.info('[540001][pay.js]--->[' + tag + ']--->' + msg);
    LMEPG.Log.info('[540001][pay.js]--->[' + tag + ']--->' + msg);
}

/**
 *  西藏移动支付方式
 */
var XZPayment = {
    ALi_Payment: '1', // 支付宝支付
    WeChat_Payment: '2', // 微信支付
    Bill_Payment: '16', // 账单支付
};

//////////////////////////////
//   吉林广电支付接口整理   //
//////////////////////////////
var XZPayService = {
    _ADVOrder: function (payType, callBack, userPhone) {
        var orderItem = RenderParam.orderItems[XZPay.orderIndex];
        var productInfo = XZPay.productInfo;
        var productId = productInfo['productCode'];
        var accountIdentify = RenderParam.apkInfo.epgAccountIdentity;
        if (payType == XZPayment.Bill_Payment && userPhone) {
            accountIdentify = userPhone;
        }
        log("_ADVOrder", "payType --> " + payType);
        var postData = {
            orderReason: RenderParam.orderReason,
            remark: RenderParam.remark,
            accountIdentify: accountIdentify,
            orderItem: JSON.stringify(orderItem),
            productInfo: JSON.stringify(productInfo),
            productId: productId,
            paymentType: payType
        };
        LMEPG.UI.showWaitingDialog("正在下单,请等待...");
        LMEPG.ajax.postAPI("Pay/ADVPay", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (data.result == '0') {
                callBack(data);
            } else {
                // 下单失败
                LMEPG.UI.showToast(data.resultDesc, 3, function () {
                    XZPay.back();
                });
            }
        });
    },

    _AVDPay: function () {
        var payData = {
            apkInfo: RenderParam.apkInfo,
            orderItem: RenderParam.orderItems[XZPay.orderIndex],
            productInfo: XZPay.productInfo,
            payParamInfo: XZPay.billPayInfo,
        };
        LMEPG.UI.showWaitingDialog("下单成功,正在准备订购...");
        LMEPG.Log.info("LMAndroid.JSCallAndroid.doPay start: " + JSON.stringify(payData));
        LMAndroid.JSCallAndroid.doPay(JSON.stringify(payData), function (param, notifyAndroidCallback) {
            //订购结束
            LMEPG.Log.info("LMAndroid.JSCallAndroid.doPay resutl：" + param);
            // LMEPG.UI.showWaitingDialog("SDK订购完成,查询结果...", 60);
            LMEPG.UI.dismissWaitingDialog();
            var queryData = {
                orderItem: JSON.stringify(RenderParam.orderItems[XZPay.orderIndex]),
                productInfo: JSON.stringify(XZPay.productInfo),
                payParamInfo: JSON.stringify(XZPay.billPayInfo),
                externalSeqNum: XZPay.billPayInfo.externalSeqNum,
                payNum: XZPay.billPayInfo.payParam.PayNum,
                payType: XZPayment.Bill_Payment
            };
            XZPayService.loopPayResult(queryData);
        });
    },

    /**
     * 轮询支付结果
     */
    loopPayResult: function (queryData) {
        LMEPG.Log.info("pay.js loopPayResult start ...... ");

        LMEPG.ajax.postAPI('Pay/ADVPayResult2', queryData, function (data) {
            /*if (data && data.result == '0') {
                LMEPG.Log.info("pay.js ADVPayResult data.result: " + JSON.stringify(data));
                if (data.payResult == "0") {
                    // sdk支付成功，调用最终的支付接口
                    var payData = {
                        apkInfo: encodeURIComponent(JSON.stringify(RenderParam.apkInfo)),
                        orderItem: JSON.stringify(RenderParam.orderItems[XZPay.orderIndex]),
                        productInfo: JSON.stringify(XZPay.productInfo),
                        payParamInfo: JSON.stringify(queryData.payParamInfo),
                        payType: queryData.payType
                    };
                    LMEPG.UI.showWaitingDialog("SDK订购完成,查询结果完成，准备支付...");
                    LMEPG.ajax.postAPI('Pay/ADVOrder', payData, function (data) {
                        LMEPG.UI.dismissWaitingDialog();
                        if (data && data.result == "0") {
                            LMEPG.UI.showToast("支付成功!");
                        } else {
                            LMEPG.UI.showToast("支付失败!");
                        }
                        onDelayBack();
                    });
                } else if (data.payResult == "3" || data.payResult == "2") {
                    // 支付正在受理， 支付等待
                    switch (queryData.payType) {
                        case XZPayment.ALi_Payment:
                            XZPay.aLiPayTimer = setTimeout(function () {
                                XZPayService.loopPayResult(queryData)
                            }, 3000);
                            break;
                        case XZPayment.WeChat_Payment:
                            XZPay.weChatPayTimer = setTimeout(function () {
                                XZPayService.loopPayResult(queryData)
                            }, 3000);
                            break;
                        case XZPayment.Bill_Payment:
                            XZPay.billPayTimer = setTimeout(function () {
                                XZPayService.loopPayResult(queryData)
                            }, 3000);
                            break;
                    }

                } else if (data.payResult == "1") {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("订购失败!");
                }
            } else {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("查询订购结果失败!");
            }*/
        });
    },
};

/**
 *  支付入口类
 */
var XZPay = {
    imagePath: ROOT + "/Public/img/hd/Pay/V540001/", // 图片存放路径
    orderId: "",
    orderIndex: -1,       // 订购项下标
    orderClickItem: "",
    orderInfo: null,
    productInfo: null,   // 产品信息
    billPayInfo: null,   // 账单支付参数
    weChatPayInfo: null, // 微信支付参数
    aLiPayInfo: null,    // 阿里支付参数
    aLiPayTimer: null,    // 支付宝支付结果轮询器
    weChatPayTimer: null, // 微信支付结果轮询器
    billPayTimer: null, // 微信支付结果轮询器
    paymentIndex: 0,
    initButtons: function () {
        buttons.push({
            id: 'order_item_1',
            name: '续包月',
            type: 'div',
            nextFocusRight: 'order_item_3',
            backgroundImage: XZPay.imagePath + 'order_item_1.png',
            focusImage: XZPay.imagePath + 'order_item_1_f.png',
            click: XZPay.eventHandler,
            cIndex: 0
        }, {
            id: 'order_item_2',
            name: '包月',
            type: 'div',
            nextFocusRight: 'order_item_3',
            nextFocusLeft: 'order_item_1',
            backgroundImage: XZPay.imagePath + 'order_item_2.png',
            focusImage: XZPay.imagePath + 'order_item_2_f.png',
            click: XZPay.eventHandler,
            cIndex: 1
        }, {
            id: 'order_item_3',
            name: '包季',
            type: 'div',
            nextFocusLeft: 'order_item_1',
            nextFocusRight: 'order_item_4',
            backgroundImage: XZPay.imagePath + 'order_item_3.png',
            focusImage: XZPay.imagePath + 'order_item_3_f.png',
            click: XZPay.eventHandler,
            cIndex: 1
        }, {
            id: 'order_item_4',
            name: '包半年',
            type: 'div',
            nextFocusLeft: 'order_item_3',
            nextFocusRight: 'order_item_5',
            backgroundImage: XZPay.imagePath + 'order_item_4.png',
            focusImage: XZPay.imagePath + 'order_item_4_f.png',
            click: XZPay.eventHandler,
            cIndex: 2
        }, {
            id: 'order_item_5',
            name: '包全年',
            type: 'div',
            nextFocusLeft: 'order_item_4',
            backgroundImage: XZPay.imagePath + 'order_item_5.png',
            focusImage: XZPay.imagePath + 'order_item_5_f.png',
            click: XZPay.eventHandler,
            cIndex: 3
        }, {
            id: 'pay_item_1',
            name: '支付方式1',
            type: 'img',
            nextFocusRight: 'pay_item_2',
            nextFocusDown: "pay_phone",
            backgroundImage: XZPay.imagePath + 'bill_payment.png',
            focusImage: XZPay.imagePath + 'bill_payment_f.png',
            selectedImage: XZPay.imagePath + 'bill_payment_s.png',
            focusChange: XZPay.onPayTypeFocus,
            beforeMoveChange: XZPay.onPayTypeMove,
            click: XZPay.eventHandler,
            pIndex: 0
        }, {
            id: 'pay_item_2',
            name: '支付方式2',
            type: 'img',
            nextFocusLeft: 'pay_item_1',
            nextFocusRight: 'pay_item_3',
            nextFocusDown: "btn_pay_sure",
            backgroundImage: XZPay.imagePath + 'ali_payment.png',
            focusImage: XZPay.imagePath + 'ali_payment_f.png',
            selectedImage: XZPay.imagePath + 'ali_payment_s.png',
            focusChange: XZPay.onPayTypeFocus,
            beforeMoveChange: XZPay.onPayTypeMove,
            click: XZPay.eventHandler,
            pIndex: 1
        }, {
            id: 'pay_item_3',
            name: '支付方式3',
            type: 'img',
            nextFocusLeft: 'pay_item_2',
            nextFocusDown: "btn_pay_sure",
            backgroundImage: XZPay.imagePath + 'wechat_payment.png',
            focusImage: XZPay.imagePath + 'wechat_payment_f.png',
            selectedImage: XZPay.imagePath + 'wechat_payment_s.png',
            focusChange: XZPay.onPayTypeFocus,
            beforeMoveChange: XZPay.onPayTypeMove,
            click: XZPay.eventHandler,
            pIndex: 2
        }, {
            id: 'btn_pay_sure',
            name: '确定支付',
            type: 'img',
            nextFocusRight: 'btn_pay_cancel',
            nextFocusUp: 'pay_item_1',
            backgroundImage: XZPay.imagePath + 'pay_sure.png',
            focusImage: XZPay.imagePath + 'pay_sure_f.png',
            beforeMoveChange: XZPay.onPayCommitMoveChange,
            click: XZPay.eventHandler,
        }, {
            id: 'btn_pay_cancel',
            name: '取消支付',
            type: 'img',
            nextFocusLeft: 'btn_pay_sure',
            nextFocusUp: 'pay_phone',
            backgroundImage: XZPay.imagePath + 'pay_cancel.png',
            focusImage: XZPay.imagePath + 'pay_cancel_f.png',
            beforeMoveChange: XZPay.onPayCommitMoveChange,
            click: XZPay.eventHandler,
        }, {
            id: 'pay_phone',
            name: '订购号码输入框',
            type: 'div',
            nextFocusDown: 'btn_pay_cancel',
            nextFocusUp: 'pay_item_1',
            backgroundImage: XZPay.imagePath + 'input_phone.png',
            focusImage: XZPay.imagePath + 'input_phone_f.png',
            focusChange: XZPay.onInputVerifyFocus,
        });
    },

    /**
     * 事件处理器
     * @param btn 触发事件按钮
     */
    eventHandler: function (btn) {
        switch (btn.id) {
            case 'order_item_1':
            case 'order_item_2':
            case 'order_item_3':
            case 'order_item_4':
            case 'order_item_5':
                XZPay.orderIndex = btn.cIndex;
                XZPay.orderClickItem = btn.id;
                // 构建cws订单信息
                // XZPayService.buildOrderInfo();
                XZPay.orderInfo = RenderParam.payPackages[btn.cIndex];
                XZPay.getProductInfo();
                XZPay.showOrderDetail();
                break;
            case 'btn_pay_sure':
                XZPay.onPayItemClick();
                break;
            case 'btn_pay_cancel':
                XZPay.showOrderItems();
                break;
        }
    },

    onPayCommitMoveChange: function (direction,btn) {
        if (direction == 'up'){
            if (XZPay.orderIndex == 0){
                btn.nextFocusUp = '';
            }else if (XZPay.paymentIndex == 0){
                btn.nextFocusUp = 'pay_phone';
            }else {
                btn.nextFocusUp = 'pay_item_' + (XZPay.paymentIndex + 1);
            }
        }
    },

    getProductInfo: function () {
        var productInfoList = RenderParam.authProductInfo.productInfos;
        for (var i = 0; i < productInfoList.length; i++) {
            if (XZPay.orderInfo.productId == productInfoList[i].productCode) {
                XZPay.productInfo = productInfoList[i];
                break;
            }
        }
    },

    /**
     * 支付方式选中监听
     * @param btn 被选中的按钮
     * @param hasFocus 是否处于选中状态
     */
    onPayTypeFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.BM.setSelected(btn.id, false);
            XZPay.clearTimer();
            XZPay.paymentIndex = btn.pIndex;
            switch (btn.pIndex) {
                case 0:
                    XZPay.hideElement("pay_qr_code");
                    XZPay.showElement("bill_payment_container");
                    break;
                case 1:
                    if (XZPay.aLiPayInfo) {// 判断是否获取过二维码图片，没有则获取
                        XZPay.showQRImage(XZPay.aLiPayInfo.qrCodeImg, XZPayment.ALi_Payment);
                        // 轮询查询结果
                        XZPay.queryResult(XZPayment.ALi_Payment);
                    } else {
                        XZPayService._ADVOrder(XZPayment.ALi_Payment, function (payInfo) {
                            XZPay.aLiPayInfo = payInfo;
                            XZPay.showQRImage(XZPay.aLiPayInfo.qrCodeImg, XZPayment.ALi_Payment);
                            // 轮询查询结果
                            XZPay.queryResult(XZPayment.ALi_Payment);
                        });
                    }
                    break;
                case 2:
                    if (XZPay.weChatPayInfo) {// 判断是否获取过二维码图片，没有则获取
                        XZPay.showQRImage(XZPay.weChatPayInfo.qrCodeImg, XZPayment.WeChat_Payment);
                        // 轮询查询结果
                        XZPay.queryResult(XZPayment.WeChat_Payment);
                    } else {
                        XZPayService._ADVOrder(XZPayment.WeChat_Payment, function (payInfo) {
                            XZPay.weChatPayInfo = payInfo;
                            XZPay.showQRImage(XZPay.weChatPayInfo.qrCodeImg, XZPayment.WeChat_Payment);
                            // 启动定时器轮询查询结果
                            XZPay.queryResult(XZPayment.WeChat_Payment);
                        });
                    }
                    break;
            }
        }
    },

    onPayTypeMove: function (dir, btn) {
        if (dir === 'down') {
            LMEPG.BM.setSelected(btn.id, true);
        }
    },

    queryResult: function (payType) {
        var queryData = null;
        switch (payType) {
            case XZPayment.ALi_Payment:
                queryData = {
                    orderItem: JSON.stringify(RenderParam.orderItems[XZPay.orderIndex]),
                    productInfo: JSON.stringify(XZPay.productInfo),
                    payParamInfo: XZPay.aLiPayInfo,
                    externalSeqNum: XZPay.aLiPayInfo.externalSeqNum,
                    payNum: XZPay.aLiPayInfo.payParam.PayNum,
                    payType: payType
                };
                break;
            case XZPayment.WeChat_Payment:
                queryData = {
                    orderItem: JSON.stringify(RenderParam.orderItems[XZPay.orderIndex]),
                    productInfo: JSON.stringify(XZPay.productInfo),
                    payParamInfo: XZPay.weChatPayInfo,
                    externalSeqNum: XZPay.weChatPayInfo.externalSeqNum,
                    payNum: XZPay.weChatPayInfo.payParam.PayNum,
                    payType: payType
                };
                break;
        }
        XZPayService.loopPayResult(queryData);
    },

    clearTimer: function () {
        // 停止定时器轮询
        if (XZPay.aLiPayTimer) {
            clearTimeout(XZPay.aLiPayTimer);
        }

        if (XZPay.weChatPayTimer) {
            clearTimeout(XZPay.weChatPayTimer);
        }
    },

    showQRImage: function (imageCode, payType) {
        log("showQRImage", "payType --> " + payType + "imageCode -> " + imageCode);
        G("pay_qr_code").src = 'data:image/jpg;base64,' + imageCode;
        XZPay.hideElement("bill_payment_container");
        XZPay.showElement("pay_qr_code");
    },

    onInputVerifyFocus: function (btn, hasFocus) {
        var dom = G(btn.id);
        if (hasFocus) {
            dom.disabled = false;
            dom.focus();
        } else {
            dom.disabled = true;
            dom.blur();
        }
    },

    /**
     * 点击订购项
     */
    onPayItemClick: function () {
        switch (XZPay.paymentIndex) {
            case 0:
                // 校验输入的手机号
                var userPhone = G("pay_phone").value.trim();
                if (userPhone == "") {
                    LMEPG.UI.showAndroidToast("手机号不能为空，请重试~");
                    return;
                }

                if (!LMEPG.Func.isTelPhoneMatched(userPhone)) {
                    LMEPG.UI.showAndroidToast("请输入有效的手机号~");
                    return;
                }

                LMEPG.ui.showWaitingDialog("请稍等...");
                LMEPG.ajax.postAPI("Pay/isLoopPayResult", {}, function (rsp) {
                    LMEPG.ui.dismissWaitingDialog();
                    if (rsp.result == "1") {
                        LMEPG.UI.showToast("当前正在查询订购支付结果，请稍后再试！");
                    } else {
                        // 发起支付
                        XZPayService._ADVOrder(XZPayment.Bill_Payment, function (payInfo) {
                            // 数据记录
                            // payInfo.payParam.PayNum = userPhone;
                            XZPay.billPayInfo = payInfo;
                            // 调用支付接口发起支付
                            XZPayService._AVDPay(userPhone);
                        }, userPhone);
                    }
                }, function (rsp) {
                    LMEPG.ui.dismissWaitingDialog();
                    LMEPG.UI.showToast("查询结果出错，请重试！");
                });
                break;
            case 1:
            case 2:
                LMEPG.UI.showToast("请扫描上方二维码支付！");
                break;
        }
    },

    /**
     * 渲染套餐详情
     */
    showOrderDetail: function () {
        G('pay_type').innerHTML = XZPay.orderInfo.productName;
        G('pay_price').innerHTML = XZPay.orderInfo.desc;
        G('desc_price').innerHTML = XZPay.orderInfo.desc;

        var payItem1 = LMEPG.ButtonManager.getButtonById('pay_item_1');
        var payPhone = LMEPG.ButtonManager.getButtonById('pay_phone');
        if (XZPay.orderIndex == 0) {
            G('pay_item_1').src = XZPay.imagePath + 'bill_payment_2.png';
            G('pay_item_1').style.width = '534px';
            payItem1.nextFocusLeft = '';
            payItem1.backgroundImage = XZPay.imagePath + 'bill_payment_2.png';
            payItem1.focusImage = XZPay.imagePath + 'bill_payment_2.png';
            payItem1.selectedImage = XZPay.imagePath + 'bill_payment_2.png';

            // 显示账单支付
            G('pay_item_2').style.display = 'none';
            G('pay_item_3').style.display = 'none';
            payItem1.nextFocusLeft = '';

            XZPay.showElement("bill_payment_container");
            payPhone.nextFocusUp = "";
            // LMEPG.ButtonManager.requestFocus("pay_phone");

            // 续包月暂时隐藏修改手机号功能
            Hide('update_phone_tips');
        } else {
            G('pay_item_1').src = XZPay.imagePath + 'bill_payment_s.png';
            G('pay_item_1').style.width = '178px';
            payItem1.backgroundImage = XZPay.imagePath + 'bill_payment.png';
            payItem1.focusImage = XZPay.imagePath + 'bill_payment_f.png';
            payItem1.selectedImage = XZPay.imagePath + 'bill_payment_s.png';

            // 显示账单支付
            G('pay_item_2').src = XZPay.imagePath + 'ali_payment.png';
            G('pay_item_2').style.display = 'inline-block';
            G('pay_item_3').src = XZPay.imagePath + 'wechat_payment.png';
            G('pay_item_3').style.display = 'inline-block';
            payItem1.nextFocusLeft = '';

            payPhone.nextFocusUp = "pay_item_1";
            // LMEPG.ButtonManager.requestFocus("pay_item_1");
        }

        XZPay.showPayTypes();
    },

    /**
     * 显示订购项
     */
    showOrderItems: function () {
        XZPay.hideElement('order_item_detail');
        XZPay.hideElement('pay_qr_code');
        XZPay.hideElement('bill_payment_container');

        XZPay.showElement('order_options_container');
        // 恢复默认的选项
        XZPay.paymentIndex = 0;

        LMEPG.ButtonManager.requestFocus(XZPay.orderClickItem);
    },

    /**
     * 显示支付类型
     */
    showPayTypes: function () {
        XZPay.hideElement('order_options_container');
        XZPay.showElement('order_item_detail');
        XZPay.showElement("bill_payment_container");

        LMEPG.ButtonManager.requestFocus("btn_pay_cancel");

        // 显示默认电话
        G('pay_phone').value = RenderParam.apkInfo.epgAccountIdentity;
    },

    showElement: function (elementId) {
        document.getElementById(elementId).style.visibility = 'visible';
    },

    hideElement: function (elementId) {
        document.getElementById(elementId).style.visibility = 'hidden';
    },

    back: function () {
        if (G('order_item_detail').style.visibility === "visible") {
            XZPay.clearPayInfo();
            // 显示二级页面返回一级页面
            XZPay.showOrderItems();
        } else {
            // 退出当前页面
            LMEPG.Intent.back();
        }
    },

    clearPayInfo: function () {
        // 清除订购项缓存
        XZPay.orderInfo = null;

        // 清除支付信息
        XZPay.aLiPayInfo = null;
        XZPay.weChatPayInfo = null;
        XZPay.billPayInfo = null;

        // 清除定时器
        XZPay.clearTimer();
    },

    checkConfigInfo: function () {
        if (RenderParam.isLoopPayResult == '1') {
            LMEPG.ui.showToast("当前正在查询订购支付结果，请稍后再试！");
            onDelayBack();
            return;
        }

        if (RenderParam.authProductInfo.result == '0') {
            LMEPG.ui.showToast("您已经订购产品！");
            onDelayBack();
            return;
        }

        if (RenderParam.authProductInfo.result != '1' && RenderParam.authProductInfo.result != '20') {
            LMEPG.ui.showToast(RenderParam.authProductInfo.resultDesc);
            onDelayBack();
            return;
        }
        if (!RenderParam.orderItems || RenderParam.orderItems.length <= 0) {
            // 获取订购项失败
            LMEPG.ui.showToast("获取订购套餐失败！");
            onDelayBack();
        }
    },

    /**
     * 初始化订购页
     */
    init: function () {
        XZPay.checkConfigInfo();
        XZPay.initButtons();
        LMEPG.BM.init('order_item_1', buttons, '', true);
    }
};

window.onBack = XZPay.back;

// 延迟退出该页面
function onDelayBack() {
    setTimeout(function () {
        LMEPG.Intent.back();
    }, 1500);
}

function onInputChange(e) {
    if (G("input_verify").value.length > 11) {
        G("input_verify").value = G("input_verify").value.substring(0, 11);
    }
}

// 页面错误
// window.onerror = function (message, filename, lineno) {
//     var errorLog = '[V2220095-pay.js]::error --->' + '\nmessage:' + message + '\nfile_name:' + filename + '\nline_NO:' + lineno;
//     if (debug) {
//         LMEPG.UI.showToast(errorLog,5);
//         LMEPG.BM.init('', buttons, '', true);
//     }
//
//     log('window.onerror()', errorLog, true);
// };