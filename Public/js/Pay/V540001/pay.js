var buttons = [];   // 定义全局按钮
var imgUrl = ROOT + "/Public/img/Pay/V630001/";

var isSinglePay = true;   // TODO 是否是单订购项

// 返回按键
function onBack() {
    if (G("second-order-toast").style.display == "block") {
        LMEPG.BM.requestFocus("confirm");
        G("second-order-toast").style.display = "none"
    } else {
        LMEPG.Intent.back();
    }
}

// 延迟退出该页面
function onDelayBack() {
    setTimeout(function () {
        LMEPG.Intent.back();
    }, 1500);
}

//页面跳转控制
var Jump = {
    /**
     * 跳转 -- 规则
     * @param activityName
     */
    jumpRule: function () {
        var objCurr = Jump.getCurrentPage();
        var objRule = LMEPG.Intent.createIntent("goodsRule");
        LMEPG.Intent.jump(objRule, objCurr);
    },

    /**
     * 跳转 -- 付款
     * @param activityName
     */
    jumpPay: function (orderId, payUrl) {
        var objCurr = Jump.getCurrentPage();
        var objPay = LMEPG.Intent.createIntent("goodsPay");
        objPay.setParam("goodInfo", DataHandle.InitData.goodInfo);
        objPay.setParam("orderId", orderId);
        objPay.setParam("payUrl", payUrl);
        LMEPG.Intent.jump(objPay, objCurr);
    },

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("goodsBuy");
        currentPage.setParam("goodInfo", DataHandle.InitData.goodInfo);
        return currentPage;
    },

};
var Pay = {
    _currentPackageId: 0,    // 当前套餐ID
    payNum: "",              // 当前支付的手机号
    payParamInfo: null,      // 下单结果存储
    isClickPay: false,       // 是否已经点击了支付
    initStaticButton: function () {
        buttons.push({
            id: 'confirm',
            name: '确认',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'cancel',
            nextFocusUp: isSinglePay ? "" : 'btn-order-1',
            nextFocusDown: '',
            backgroundImage: imgUrl + "bg_confirm.png",
            focusImage: imgUrl + "f_confirm.png",
            click: Pay.onClick,
            focusChange: "",
            beforeMoveChange: Pay.onBeforeMoveChange,
            cType: "region",
        });
        buttons.push({
            id: 'cancel',
            name: '取消',
            type: 'img',
            nextFocusLeft: 'confirm',
            nextFocusRight: '',
            nextFocusUp: isSinglePay ? "" : 'btn-order-1',
            nextFocusDown: '',
            backgroundImage: imgUrl + "bg_cancel.png",
            focusImage: imgUrl + "f_cancel.png",
            click: onBack,
            focusChange: "",
            beforeMoveChange: Pay.onBeforeMoveChange,
            cType: "region",
        });


        buttons.push({
            id: 'textPhone-text',
            name: '取消',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'second-confirm',
            backgroundImage: "bg_text_2.png",
            focusImage: "f_text_2.png",
            click: '',
            focusChange: SecondToast.textPhoneFocus,
            beforeMoveChange: "",
            cType: "region",
        });

        buttons.push({
            id: 'second-confirm',
            name: '确认',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'second-cancel',
            nextFocusUp: 'textPhone-text',
            nextFocusDown: '',
            backgroundImage: imgUrl + "bg_confirm.png",
            focusImage: imgUrl + "f_confirm.png",
            click: SecondToast.toSubmit,
            focusChange: "",
            beforeMoveChange: "",
            cType: "region",
        });
        buttons.push({
            id: 'second-cancel',
            name: '取消',
            type: 'img',
            nextFocusLeft: 'second-confirm',
            nextFocusRight: '',
            nextFocusUp: 'textPhone-text',
            nextFocusDown: '',
            backgroundImage: imgUrl + "bg_cancel.png",
            focusImage: imgUrl + "f_cancel.png",
            click: onBack,
            focusChange: "",
            beforeMoveChange: "",
            cType: "region",
        });

    },
    initData: function () {
        if (RenderParam.authProductInfo.result == '0') {
            LMEPG.ui.showToast("用户已经订购产品！");
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
            //LMEPG.ui.showToast("获取订购套餐失败！");
            //onDelayBack();
            //return;
        }
        if (!isSinglePay) {
            for (var i = 0; i < RenderParam.orderItems.length; i++) {
                // 初始化Tab
                buttons.push({
                    id: 'btn-order-' + (i + 1),
                    name: '订购',
                    type: 'img',
                    nextFocusLeft: 'btn-order-' + i,
                    nextFocusRight: 'btn-order-' + (i + 2),
                    nextFocusUp: '',
                    nextFocusDown: 'confirm',
                    backgroundImage: imgUrl + "bg_order_" + (i + 1) + ".png",
                    focusImage: imgUrl + "f_order_" + (i + 1) + ".png",
                    selectedImage: imgUrl + "s_order_" + (i + 1) + ".png",
                    groupId: "order_item",
                    click: "",
                    focusChange: Pay.onPackageFocusChange,
                    beforeMoveChange: "",
                    //cIndex: i,     // 订购项下标
                    cIndex: 0,     // 订购项下标
                });
            }
        }
    },
    /**
     * 套餐选择页面焦点切换
     * @param btn
     * @param hasFocus
     */
    onPackageFocusChange: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.bm.setSelected(btn.id, true);
            Pay._currentPackageId = btn.cIndex;
            var item = RenderParam.orderItems[btn.cIndex];
            G("introduce-img").src = imgUrl + "introduce_" + (btn.cIndex + 1) + ".png";
            G("name").innerHTML = RenderParam.authProductInfo.productInfos[btn.cIndex].productInfo;
            G("type").innerHTML = RenderParam.authProductInfo.productInfos[btn.cIndex].unit == 2 ? "包月" : "按次";
            G("price").innerHTML = item.price / 100 + "元/月";
            var unit = RenderParam.authProductInfo.productInfos[btn.cIndex].unit == 2 ? "元/月" : "元/次";
            G("price").innerHTML = RenderParam.authProductInfo.productInfos[btn.cIndex].price / 100 + unit;
        } else {
            LMEPG.bm.setSelected(btn.id, true);
        }
    },

    /**
     * 焦点移动前改变
     */
    onBeforeMoveChange: function (direction, current) {
        switch (direction) {
            case 'up':
                if (current.id == 'confirm' || current.id == 'cancel') {
                    var tabId = 'btn-order-' + (Pay._currentPackageId + 1);
                    LMEPG.BM.requestFocus(tabId);
                    return false;
                }
        }
        return true;
    },

    onClick: function (btn) {
        SecondToast.init();
    },

    init: function () {
        Pay.initData();
        Pay.initStaticButton();     //初始化焦点按钮
        var defaultId = isSinglePay ? "cancel" : "btn-order-1";
        LMEPG.ButtonManager.init([defaultId], buttons, "", true);

        // 设置手机号
        G('textPhone-text').value = RenderParam.apkInfo.epgAccountIdentity;
    },


    /**
     * 下单接口
     * @private
     */
    _ADVPay: function () {
        if (Pay.isClickPay) {
            return;
        }
        var orderItem = RenderParam.orderItems[Pay._currentPackageId];
        var productInfo = RenderParam.authProductInfo.productInfos[Pay._currentPackageId];
        // TODO 后续需要考虑我们订购项和局方订购产品的对应，现在使用默认的顺序匹配。
        var postData = {
            orderReason: RenderParam.orderReason,
            remark: RenderParam.remark,
            accountIdentify: Pay.payNum,
            orderItem: JSON.stringify(orderItem),
            productInfo: JSON.stringify(productInfo),
        };
        LMEPG.UI.showWaitingDialog("正在下单,请等待...");
        LMEPG.ajax.postAPI("Pay/ADVPay", postData, function (data) {
            if (data.result == '0') {
                // 下单成功
                // LMEPG.UI.showToast("下单成功,正在准备订购...", 60 * 1000);
                Pay.isClickPay = true;
                data.payParam.PayNum = Pay.payNum;
                Pay.payParamInfo = data;   // 保存起来
                var payData = {
                    apkInfo: RenderParam.apkInfo,
                    orderItem: RenderParam.orderItems[Pay._currentPackageId],
                    productInfo: RenderParam.authProductInfo.productInfos[Pay._currentPackageId],
                    //productInfo: RenderParam.authProductInfo.productInfos[Pay._currentPackageId >=1 ? Pay._currentPackageId + 1 : Pay._currentPackageId],
                    payParamInfo: Pay.payParamInfo,
                };
                LMEPG.UI.showWaitingDialog("下单成功,正在准备订购...");
                LMEPG.Log.info("LMAndroid.JSCallAndroid.doPay start: " + JSON.stringify(payData));
                LMAndroid.JSCallAndroid.doPay(JSON.stringify(payData), function (param, notifyAndroidCallback) {
                    //订购结束
                    LMEPG.Log.info("LMAndroid.JSCallAndroid.doPay resutl：" + param);
                    LMEPG.UI.showWaitingDialog("SDK订购完成,查询结果...", 60);
                    Pay.loopPayResult();
                });
            } else {
                // 下单失败
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast(data.resultDesc);
            }
        });
    },

    /**
     * 轮询支付结果
     */
    loopPayResult: function () {
        LMEPG.Log.info("pay.js loopPayResult start ...... ");

        var queryData = {
            externalSeqNum: Pay.payParamInfo.externalSeqNum,
            payNum: Pay.payParamInfo.payParam.PayNum,
        };

        LMEPG.ajax.postAPI('Pay/ADVPayResult', queryData, function (data) {
            if (data && data.result == '0') {
                LMEPG.Log.info("pay.js ADVPayResult data.result: " + JSON.stringify(data));
                if (data.payResult == "0") {
                    // sdk支付成功，调用最终的支付接口
                    LMEPG.UI.dismissWaitingDialog();
                    var payData = {
                        apkInfo: encodeURIComponent(JSON.stringify(RenderParam.apkInfo)),
                        orderItem: JSON.stringify(RenderParam.orderItems[Pay._currentPackageId]),
                        productInfo: JSON.stringify(RenderParam.authProductInfo.productInfos[Pay._currentPackageId]),
                        //productInfo: JSON.stringify(RenderParam.authProductInfo.productInfos[Pay._currentPackageId >=1 ? Pay._currentPackageId + 1 : Pay._currentPackageId]),
                        payParamInfo: JSON.stringify(Pay.payParamInfo),
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
                    setTimeout(Pay.loopPayResult, 1000);
                } else if (data.payResult == "1") {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("订购失败!");
                }
            } else {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("查询订购结果失败!");
            }
        });
    }
};

var SecondToast = {

    init: function () {
        G("second-order-toast").style.display = "block";
        LMEPG.ButtonManager.requestFocus("second-cancel");
    },

    textPhoneFocus: function (btn, hasFocus) {
        var dom = G(btn.id);
        if (hasFocus) {
            dom.disabled = false;
            dom.focus();
        } else {
            dom.disabled = true;
            dom.blur();
        }
    },

    //提交订购
    toSubmit: function () {
        var userPhone = G("textPhone-text").value.trim();
        if (userPhone == "") {
            LMEPG.UI.showAndroidToast("手机号不能为空，请重试~");
            return;
        }

        if (!LMEPG.Func.isTelPhoneMatched(userPhone)) {
            LMEPG.UI.showAndroidToast("请输入有效的手机号~");
            return;
        }

        // 设置支付手机号
        Pay.payNum = userPhone;

        Pay._ADVPay();
    },
};

function onInputChange(e) {
    var maxLength = 11;
    if (G("textPhone-text").value.length > maxLength) {
        G("textPhone-text").value = G("textPhone-text").value.substring(0, 4);
    }
}
