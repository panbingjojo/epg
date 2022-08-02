
var OrderPage = {
    queryOrderTimer: null,
    isShowDialog: false,
    buttons : [],
    init: function () {
        OrderPage.initButtons();
        LMEPG.BM.init('order_item_1', OrderPage.buttons, '', true);
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
    },

    eventHandler: function (btn) {
        LMEPG.Log.info('pay.js eventHandler')
        // 调用后台接口组装请求参数
        OrderPage.buildOrderInfo(btn.cIndex);
    },

    buildOrderInfo: function (orderItemIndex) {
        var orderItem = RenderParam.orderItems[orderItemIndex];
        var requestData = {
            "vip_id": orderItem.vip_id,
        };
        LMEPG.Log.info('pay.js buildOrderInfo')
        LMEPG.UI.showWaitingDialog('')
        LMEPG.ajax.postAPI("Pay/buildPayUrl", requestData, function (rsp) {
            LMEPG.UI.dismissWaitingDialog()
            LMEPG.Log.info(' pay.js rsp = ' + JSON.stringify(rsp))
            if (rsp.result == 0) { // 管理后台创建订单成功
                OrderPage.showQrCode(rsp.pay_url);
                OrderPage.startQueryOrderResult();
            } else {
                LMEPG.UI.showToast("创建订单失败，请稍后重试！");
            }
        }, function () {
            // 提示创建订单失败
            LMEPG.UI.showToast("服务器连接不正确，请稍后重试！");
        })
    },

    /**
     *  显示订购二维码
     */

    showQrCode: function (url) {
        var element = window.document.createElement('div');

        var htm = '<img class="dialog_wechat_qrcode_bg" src=' + ROOT + '/Public/img/Common/ask_doc_dialog_bg.png>';
        htm += '<p class="dialog_wechat_qrcode_title" style="color: #c38554; font-weight: bold">请使用微信扫码进行支付</p>';
        htm += '<img class="dialog_wechat_qrcode_image" id="qrcode" src=\'' + url + '\'>';
        //
        element.id = 'qrcode';
        element.innerHTML = htm;
        var modal = window.document.getElementById('qrcode');
        if (modal) {
            modal.innerHTML = htm;
        } else {
            window.document.body.appendChild(element);
        }
        OrderPage.isShowDialog = true
    },
    /**
     *  隐藏订购二维码
     */
    hideQRCode: function () {
        var modal = G("qrcode")
        if (modal) {
            modal.parentNode.removeChild(modal)
        }
        OrderPage.isShowDialog = false;
    },
    /**
    //  *  开启定时器轮询查询订单支付结果通知
    //  */
    startQueryOrderResult: function () {
        OrderPage.queryOrderTimer = setInterval(function () {
            var postData = {};
            console.log("轮询查询订单支付结果通知");
            LMEPG.ajax.postAPI("Pay/queryVipInfo", postData, function (data) {
                console.log("轮询查询订单支付结果 = " + JSON.stringify(data));
                if (data.isVIP) {
                    // 清除定时器
                    OrderPage.clearQueryOrderTimer();
                    LMEPG.UI.commonDialog.show("支付成功", ["确定"], function (index) {
                        LMEPG.Intent.back();
                    });
                }
            }, function () {
                // 清除定时器
                OrderPage.clearQueryOrderTimer();
                LMEPG.UI.commonDialog.show("支付异常！", ["确定"], function (index) {
                    LMEPG.Intent.back();
                });
            });
        }, 1 * 1000);
    },

    /**
     *  清除定时器
     */
    clearQueryOrderTimer: function () {
        clearInterval(OrderPage.queryOrderTimer);
    }
};

window.onBack = function () {
    // 清除定时器
    OrderPage.clearQueryOrderTimer();
    if (OrderPage.isShowDialog) {
        OrderPage.hideQRCode();
    } else {
        LMEPG.Intent.back();
    }
};

