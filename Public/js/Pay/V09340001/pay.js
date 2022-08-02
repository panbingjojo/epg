var buttons = [];
var returnUrl = '';                //订购返回地址
var PAY_TYPE_ANDROID = 1;
var PAY_TYPE_WEB = 2;
var PAY_TYPE_HTTP = 3;
var payType = PAY_TYPE_ANDROID;//是否需要android才能跳转到局方订购页
var payAccount = "-1";             //订购账号
var regionCode = "";
var tradeNo = '';                //订单号
var domShowDialog;
var indexOfUserAgreementPicture;
var payInfo = {}; //订单参数对象
var param = {}; //订单参数对象
var uploadResult = {};//结果对象
var queryOrderCount = 20;         //查询订单最大次数
var orderTimer = null; //定时轮询订购结果

var Pay = {

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.ui.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/buildPayUrl", payInfo, function (data) {
            LMEPG.Log.info("buildPayInfo--->> data = "+JSON.stringify(data))
            if (data.result == 0) {
                Pay.toPay(data);
            } else {
                //获取订购参数失败
                if (LMEPG.Func.isExist(data.message)) {
                    LMEPG.ui.showToast(data.message, 3);
                } else {
                    LMEPG.ui.showToast("获取订购参数失败!", 3);
                }
                onBackDelay();
            }
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
        }, function () {
            LMEPG.ui.showToast("请求异常，请稍后重试！", 3);
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function () {
        var PayInfo = {
            "userId": RenderParam.accountId,
        };
        LMEPG.Log.info("09340001 onPayItemClick -->:" + JSON.stringify(PayInfo));
        Pay.buildPayInfo(PayInfo);
    },

    /**
     * 初始化订购项
     */
    initButton: function () {
        buttons.push(
            {
                id: 'select_item_first',
                name: "选择套餐,续包月",
                type: "img",
                backgroundImage: ROOT + '/Public/img/hd/Pay/V440001/monthly_renewal_f.png',
                focusImage: ROOT + '/Public/img/hd/Pay/V440001/monthly_renewal_f.png',
                click: Pay.onPayItemClick,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0,
            }
        );
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (typeof (RenderParam.orderItems) === "undefined" || RenderParam.orderItems == "") {
            LMEPG.UI.showToast("没有套餐", 100);
            onBackDelay();
            return;
        }
        // Pay.initButton();
        // domShowDialog = G("showDialog");
        // LMEPG.ButtonManager.init(["select_item_first"], buttons, '', true);
        // Pay.showBuyDialogOne();
        Pay.onPayItemClick()
    },

    /**
     * 显示第一次确认弹窗
     */
    showBuyDialogOne: function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src=' + ROOT + '"/Public/img/hd/Pay/V440001/bg.png"/>';//背景图
        _html += '<img id="select_item_first" src=' + ROOT + '"/Public/img/hd/Pay/V440001/monthly_renewal_f.png"/>';
        domShowDialog.innerHTML = _html;
        LMEPG.ButtonManager.requestFocus("select_item_first");
    },

    uploadPayResult: function (upData) {
        //支付成功
        LMEPG.ajax.postAPI("Pay/uploadPayResult", upData, function (rsp) {
            if (rsp.result == '0') {
                // 测试弹窗显示效果
                LMEPG.ui.showToastCustom({
                    content: "订购成功!",
                    showStyle: "toast_style_v1",
                    textStyle: "toast_text_v1",
                    bgImage: "bg_toast_v1.png",
                    showTime: 3
                }, function () {
                    LMEPG.Intent.back();
                });
            } else {
                LMEPG.UI.showToast("上传订购结果失败", 3)
            }
        })
    },

    /**
     * 处理结果信息
     * @param res
     * @param upData
     */
    handleOrder: function (res, upData) {
        var result = JSON.parse(res)
        var that = this;
        if (result.Result === '0') {
            that.uploadPayResult(upData);
        } else {
            //因为SDK不准所以重新鉴权判定是否订购成功
            LMAndroid.JSCallAndroid.doAuth(null, function (resParam, notifyAndroidCallback) {
                LMEPG.Log.info('order doAuth result:' + resParam);
                var res = JSON.parse(resParam);
                if (res.code === '0') {
                    that.uploadPayResult(upData);
                } else {
                    //支付失败
                    LMEPG.ui.showToastCustom({
                        content: "订购失败，请稍后重试！",
                        showStyle: "toast_style_v2",
                        textStyle: "toast_text_v2",
                        bgImage: "bg_toast_v2.png",
                        showTime: 3
                    }, function () {
                        LMEPG.Intent.back();
                    });
                }
            });

        }
    },
    /**
     *
     */
    toPay: function (data) {
        var that = this;
        if (LMEPG.Func.isExist(data) && LMEPG.Func.isExist(data.payInfo)) {
            that.payInfo = data.payInfo;
            tradeNo = that.payInfo.tradeNo;
            that.orderReason = that.payInfo.orderReason
            that.uploadResult = {
                tradeNo : tradeNo,
                orderReason: that.orderReason,
            };
            if(LMAndroid.isRunOnPc()){
                var res = "{\"Result\":\"1\"}";
                console.log(that.uploadResult)
                that.handleOrder(res, that.uploadResult);
            }else{
                LMAndroid.JSCallAndroid.doTVPay(data.payInfo.payParam,function (res) {
                    LMEPG.Log.info("[V09340001] toPay ---->>>> res = "+res)
                    that.handleOrder(res, that.uploadResult);
                })
            }

        } else {
            LMEPG.UI.showToast("没有获取到订购信息");
            onBackDelay();
        }
    },

};

/**
 * 返回处理
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 返回（延时）
 */
function onBackDelay() {
    setTimeout(function () {
        onBack();
    }, 3000);
}
