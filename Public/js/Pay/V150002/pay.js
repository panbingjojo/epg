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

function jumpAuthOrder() {
    var objDst = LMEPG.Intent.createIntent("authOrder");
    LMEPG.Intent.jump(objDst);
}

var Pay = {

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.ui.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/buildPayUrl", payInfo, function (data) {
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
        var index = 0;
        var PayInfo = {
            "vip_id": RenderParam.orderItems[index].vip_id,
            "vip_type": RenderParam.orderItems[index].vip_type,
            "selectedProductNum": index,
            "userId": RenderParam.accountId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "amount": +RenderParam.orderItems[index].price,
            "description": "25元续包月产品",
            // "contentId": '39JKCODE000000010000000008010013',
            "contentId": '39JKCODE000000010000000008010001',
            // "contentId": 'MHSWJPRO000000010000000000001291',
            'contentName': '39健康'
        };
        console.log("150002 onPayItemClick -->:" + JSON.stringify(PayInfo))
        LMEPG.Log.info("150002 onPayItemClick -->:" + JSON.stringify(PayInfo));
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

    /**
     *
     */
    toPay: function (data) {
        var that = this;
        if (LMEPG.Func.isExist(data) && LMEPG.Func.isExist(data.payInfo)) {
            that.payInfo = data.payInfo;
            that.payInfo.contentName = "39健康";
            that.param = {
                contentID:that.payInfo.contentId,
                contentName:"39健康",
                orderContinueFlag:that.payInfo.orderContinueFlag,
                orderContinueFlag:that.payInfo.orderContinueFlag,
                notifyUrl:that.payInfo.notifyUrl,
                transactionID:that.payInfo.transactionID,
            }
            tradeNo = that.payInfo.tradeNo;
            returnUrl = that.payInfo.returnUrl;
            that.uploadResult = {
                tradeNo: tradeNo,
                isPlayIng: RenderParam.isPlaying,
                orderReason: RenderParam.lmreason
            };
            that.orderTimer = setInterval(function () {
                that.order()
            }, 500)
        } else {
            LMEPG.UI.showToast("没有获取到订购信息");
            onBackDelay();
        }
    },

    order: function () {
        var that = this;
        LMAndroid.JSCallAndroid.doPay(JSON.stringify(that.param), function (param, notifyAndroidCallback) {
            LMEPG.Log.info("[150002] doPay-->>> res = "+param)
            param = param instanceof Object ? param : JSON.parse(param);
            if (param.code == '0') { // 标识订购成功
                clearInterval(that.orderTimer);
                LMEPG.ajax.postAPI("Pay/uploadPayResult", that.uploadResult, function (rsp) {
                    if (rsp.result == '0') {
                        // 测试弹窗显示效果
                        LMEPG.ui.showToastCustom({
                            content: "订购成功!",
                            showStyle: "toast_style_v1",
                            textStyle: "toast_text_v1",
                            bgImage: "bg_toast_v1.png",
                            showTime: 3
                        }, function () {
                            jumpAuthOrder();
                            //LMEPG.Intent.back();
                        });
                    } else {
                        LMEPG.UI.showToast("上传订购结果失败", 3)
                    }
                })
            }else if(param.code == '1000') {
                //用户正在订购 //继续轮询等待

            }else {
                clearInterval(that.orderTimer)
                LMEPG.ui.showToastCustom({
                    content: "订购失败，请稍后重试！",
                    showStyle: "toast_style_v2",
                    textStyle: "toast_text_v2",
                    bgImage: "bg_toast_v2.png",
                    showTime: 3
                }, function () {
                    jumpAuthOrder();
                    //LMEPG.Intent.back();
                });
            }
        });
    },


};

/**
 * 返回处理
 */
function onBack() {
    jumpAuthOrder();
    //LMEPG.Intent.back();
}

/**
 * 返回（延时）
 */
function onBackDelay() {
    setTimeout(function () {
        onBack();
    }, 3000);
}
