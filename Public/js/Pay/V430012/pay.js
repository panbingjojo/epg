var OrderPage = {
    buttons: [],
    productInfos: [
        {
            productNo: "VirtualPolicy_312553001", // 商品价格编码
            productCode: "VirtualPolicy_312553001", // 商品编码
            productName: "家庭医生19.9元包月", // 商品名称
        }, {
            productNo: "VirtualPolicy_312553002",
            productCode: "VirtualPolicy_312553002",
            productName: "家庭医生199元包年",
        }
    ],
    init: function () {
        OrderPage.initButtons();
    },

    initButtons: function () {
        OrderPage.buttons.push({
            id: 'order_item_1',
            name: '包月',
            type: 'img',
            nextFocusRight: 'order_item_2',
            backgroundImage: RenderParam.imagePath + 'order_item_1.png',
            focusImage: RenderParam.imagePath + 'order_item_1_f.png',
            click: OrderPage.eventHandler,
            cIndex: 0
        }, {
            id: 'order_item_2',
            name: '包年',
            type: 'img',
            nextFocusLeft: 'order_item_1',
            backgroundImage: RenderParam.imagePath + 'order_item_2.png',
            focusImage: RenderParam.imagePath + 'order_item_2_f.png',
            click: OrderPage.eventHandler,
            cIndex: 1
        });

        LMEPG.BM.init('order_item_1', OrderPage.buttons, '', true);
    },

    eventHandler: function (btn) {
        // 调用后台接口组装请求参数
        OrderPage.buildOrderInfo(btn.cIndex);
    },

    buildOrderInfo: function (orderItemIndex) {
        // 管理后台配置的顺顺序是相反的
        var orderItem = RenderParam.orderItems[1 - orderItemIndex];
        var productItem = OrderPage.productInfos[orderItemIndex];
        var requestData = {
            "vip_id": orderItem.vip_id,
            "vip_type": orderItem.vip_type,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "price": orderItem.price,
            "order_count": orderItem.order_count,
            "returnPageName": RenderParam.returnPageName,
            "productNo": productItem.productNo,
            "productCode": productItem.productCode,
            "productName": productItem.productName,
        };
        LMEPG.ajax.postAPI("Pay/buildPayUrl", requestData, function (rsp) {
            if (rsp.result == '0') { // 管理后台创建订单成功
                var uploadResult = {
                    tradeNo: rsp.tradeNo,
                    isPlayIng: RenderParam.isPlaying,
                    orderReason: RenderParam.lmreason
                };
                LMEPG.Log.info("buildOrderInfo PayInfo " + rsp.payInfo);
                LMAndroid.JSCallAndroid.doPay(rsp.payInfo, function (param, notifyAndroidCallback) {
                    //订购结束
                    LMEPG.Log.info("LMAndroid.JSCallAndroid.doPay resutl：" + param);
                    param = param instanceof Object ? param : JSON.parse(param);
                    if(param.result == '1') { // 标识订购成功
                        LMEPG.ajax.postAPI("Pay/uploadPayResult", uploadResult, function (rsp) {
                            if (rsp.result == '0') {
                                // 测试弹窗显示效果
                                LMEPG.UI.showToastCustom({
                                    content: "订购成功！",
                                    showStyle: "toast_style_v1",
                                    textStyle: "toast_text_v1",
                                    bgImage: "bg_toast_v1.png",
                                    showTime: 3
                                },function () {
                                    LMEPG.Intent.back();
                                });
                            } else {
                                LMEPG.UI.showToast("上传订购结果失败", 3)
                            }
                        });
                    }else {
                        LMEPG.UI.showToastCustom({
                            content: "订购失败，请稍后重试！",
                            showStyle: "toast_style_v2",
                            textStyle: "toast_text_v2",
                            bgImage: "bg_toast_v2.png",
                            showTime: 3
                        });
                    }
                });
            } else {
                LMEPG.UI.showToast("创建订单失败，请稍后重试！");
            }
        }, function () {
            // 提示创建订单失败
            LMEPG.UI.showToast("服务器连接不正确，请稍后重试！");
        })
    }
};

window.onBack = function () {
    LMEPG.Intent.back();
};