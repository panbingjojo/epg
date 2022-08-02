// 返回按键
function onBack() {
    if (G("pay_container").style.display == "block") {
        order_discount.qrCodeImage = ''; //清空二维码图片
        G('pay_code_img').src = RenderParam.imagePath + 'bg_order_2.png';
        // 停止定时器查询
        clearInterval(order_discount.queryResultTimer);
        // 切换页面显示
        Hide('pay_container');
        Show('order_options');
        LMEPG.BM.requestFocus(order_discount.orderItem);
    } else {
        // 直接关闭当前页面，退出应用程序
        LMAndroid.JSCallAndroid.doExitApp();
    }
}

/**
 * 显示错误信息
 */
function showError(msg) {
    LMEPG.UI.showToast(msg);
    setTimeout(function () {
        onBack();
    }, 3000);
}

var order_pay = {
    orderMonth: [1, 3, 6, 12], // 订购的时长，单位月

    createOrderInfo: function () {
        var cIndex = order_discount.orderType;
        var payInfo = {
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
            "pay_type": 2 // 默认二维码支付
        };
        order_pay.buildPayInfo(payInfo);
    },

    /**
     * 构建支付信息
     * @param payInfo 订购信息
     */
    buildPayInfo: function (payInfo) {
        LMEPG.ui.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/buildPayInfo", payInfo, function (data) {
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
            if (data.result == 0) {
                order_pay.queryCodeImage(data.payInfo);
            } else {
                //获取订购参数失败
                if (LMEPG.func.isExist(data.message)) {
                    showError(data.message);
                } else {
                    showError("获取订购参数失败!");
                }
            }
        });
    },

    /**
     * 甘肃移动，通过接口获取二维码图片
     */
    queryCodeImage: function (payInfo) {
        LMEPG.ui.showWaitingDialog("");
        var postData = {
            orderId: payInfo.tradeNo,
            userAccount: payInfo.accountIdentity,
            macAddress: payInfo.deviceId,
            orderMonth: order_pay.orderMonth[order_discount.orderType]
        };
        LMEPG.ajax.postAPI("Pay/queryCodeImage", postData, function (rsp) {
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
            LMEPG.Log.error("gansuyd---queryCodeImage: " + rsp);
            var data = rsp instanceof Object ? rsp : rsp ? JSON.parse(rsp) : rsp;
            if (data.result == 0) {
                // 判断当前请求是否成功,保存当前二维码图片
                order_discount.qrCodeImage = "http://healthiptv.langma.cn" + data.qrcode;
                // 显示二维码图片
                G("pay_code_img").src = order_discount.qrCodeImage;
                order_discount.queryPayResult();
            } else {
                order_discount.qrCodeImage = '';
                LMEPG.ui.showToast('二维码图片获取失败');
            }
        }, function () {
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
        });
    },

    queryPayResult: function () {
        var postData = {};
        LMEPG.ajax.postAPI("Pay/queryVipInfo", postData, function (data) {
            if (data.isVIP) {
                // 清除定时器
                clearInterval(order_discount.queryResultTimer);
                LMEPG.UI.commonDialog.show("您已成功订购智慧健康业务！", ["确定"], function (index) {
                    LMEPG.Intent.back();
                })
            } else {
                order_pay.queryPayResult();
            }
        });
    },
};

var order_discount = {
    buttons: [], // 当前页面焦点
    orderItem: 'order_item_1', // 当前选中的计费项
    orderType: 0, // 当前计费页面对应的套餐角标，默认月包
    qrCodeImage: '', // 二维码的图片地址
    queryResultTimer: null, // 轮询二维码支付的定时器
    orderTypeName: ["包月", "季度", "半年", "包年"], // 订购套餐名称
    orderTimeUnit: ["/月", "/季度", "/半年", "/年"], // 订购套餐时间单位
    /**
     * 初始化按钮
     */
    initButtons: function () {
        for (var i = 0; i < 4; i++) {
            order_discount.buttons.push({
                id: 'order_item_' + (i + 1),
                name: '订购类型_' + i,
                type: 'img',
                nextFocusLeft: 'order_item_' + i,
                nextFocusRight: 'order_item_' + (i + 2),
                backgroundImage: RenderParam.imagePath + "order_item_" + (i + 1) + ".png",
                focusImage: RenderParam.imagePath + "order_item_" + (i + 1) + ".png",
                click: order_discount.eventHandler,
                focusChange: order_discount.onOrderItemFocus,
                orderType: i,
            });
        }

        order_discount.buttons.push(
            {
                id: 'pay_item_title',
                name: '二维码支付',
                type: 'img',
                nextFocusDown: 'confirm',
                backgroundImage: RenderParam.imagePath + "pay_qr_code_n.png",
                focusImage: RenderParam.imagePath + "pay_qr_code_f.png",
            },
            {
                id: 'confirm',
                name: '确认',
                type: 'img',
                nextFocusRight: 'cancel',
                nextFocusUp: 'pay_item_title',
                backgroundImage: RenderParam.imagePath + "bg_confirm.png",
                focusImage: RenderParam.imagePath + "f_confirm.png",
                click: order_discount.eventHandler,
            },
            {
                id: 'cancel',
                name: '取消',
                type: 'img',
                nextFocusLeft: 'confirm',
                nextFocusUp: 'order_discount.eventHandler',
                backgroundImage: RenderParam.imagePath + "bg_cancel.png",
                focusImage: RenderParam.imagePath + "f_cancel.png",
                click: order_discount.eventHandler,
            }
        );
        LMEPG.ButtonManager.init('order_item_1', order_discount.buttons, '', true);
    },

    /**
     * 事件处理函数
     * @param btn 焦点
     */
    eventHandler: function (btn) {
        switch (btn.id) {
            case "order_item_1":
            case "order_item_2":
            case "order_item_3":
            case "order_item_4":
                order_discount.orderItem = btn.id;
                order_discount.orderType = btn.orderType;
                order_discount.showPayOptions(btn.orderType);
                break;
            case "confirm":
                LMAndroid.JSCallAndroid.doShowToast("请扫描上方二维码完成支付！");
                break;
            case "cancel":
                onBack();
                break;
        }
    },

    /**
     * 展示支付详情页面
     * @param orderType 对应的套餐角标 1--月包；2--季包；3--半年包；4--年包
     */
    showPayOptions: function (orderType) {
        Hide('order_options');
        Show('pay_container');
        var order_item = RenderParam.orderItems[orderType];
        G('desc_price').innerHTML = order_item.price + '元/月';
        G("name").innerHTML = order_item.goods_name;
        G("type").innerHTML = order_discount.orderTypeName[orderType];
        G("price").innerHTML = order_item.price / 100 + "元" + order_discount.orderTimeUnit[orderType];
        // 选中默认焦点
        LMEPG.ButtonManager.requestFocus('pay_item_title');
        // 创建订单，并显示二维码，同时开启轮询器查询二维码支付结果
        order_pay.createOrderInfo();
    },

    /**
     * 计费项获取焦点事件
     * @param btn 焦点
     * @param hasFocus 是否获取焦点
     */
    onOrderItemFocus: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).className = "order_item_selected";
        } else {
            G(btn.id).removeAttribute("class");
        }
    },

    /**
     * 定时查询二维码支付结果
     */
    queryPayResult: function () {
        order_discount.queryResultTimer = setInterval(function () {
            order_pay.queryPayResult();
        }, 5 * 1000);
    },
};

