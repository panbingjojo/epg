var buttons = [];
var returnUrl = '';                //订购返回地址
var PAY_TYPE_ANDROID = 1;
var PAY_TYPE_WEB = 2;
var PAY_TYPE_HTTP = 3;
var payType = PAY_TYPE_ANDROID;//是否需要android才能跳转到局方订购页
var payAccount = "-1";             //订购账号
var regionCode = "";
var queryOrderTime = 20;         //查询订单最大次数
var tradeNo = '';                //订单号

var Pay = {

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.ui.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/buildPayUrl", payInfo, function (data) {
            console.log(data);
            if (data.result == 0) {
                Pay.toPay(data);
            } else {
                //获取订购参数失败
                if(LMEPG.func.isExist(data.message)){
                    LMEPG.ui.showToast(data.message, 3);
                } else {
                    LMEPG.ui.showToast("获取订购参数失败!", 3);
                }
                onBackDelay();
            }
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        // 返回按钮
        if (btn.isCancelBtn) {
            onBack();
            return;
        }

        if (RenderParam.orderItems.length <= btn.cIndex) {
            LMEPG.ui.showToast("没有该订购项!");
            return;
        }
        var PayInfo = {
            "vip_id": RenderParam.orderItems[btn.cIndex].vip_id,
            "vip_type": RenderParam.orderItems[btn.cIndex].vip_type,
            "goods_name": RenderParam.orderItems[btn.cIndex].goods_name,
            "userId": RenderParam.userId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "price": RenderParam.areaCode == '23' ? '0':RenderParam.orderItems[btn.cIndex].price,
            "returnPageName": RenderParam.returnPageName,
        };
        Pay.buildPayInfo(PayInfo);
    },

    /**
     * 初始化订购项
     */
    initButton: function () {
        buttons.push({
            id: 'btn-1',
            name: '按钮1',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'btn-2',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: Pay.onPayItemClick,
            focusChange: '',
            beforeMoveChange: '',
            cIndex: 0
        });

        buttons.push({
            id: 'btn-2',
            name: '按钮2',
            type: 'img',
            nextFocusLeft: 'btn-1',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: Pay.onPayItemClick,
            focusChange: '',
            beforeMoveChange: '',
            cIndex: 1
        });

        // 根据计费项，设置按钮的图片，如果计费项少于2个，则把第二个按钮设置为返回按钮
        for (var i = 0; i < RenderParam.orderItems.length; i++) {
            // 顶多2个计费项，其他多出的不管
            if (i >= 2) {
                break;
            }
            // 按次计费
            if (RenderParam.orderItems[i].vip_type == 1) {
                if(RenderParam.areaCode == '23'){
                    buttons[i].backgroundImage = ROOT + '/Public/img/hd/Pay/V000005/btn_pay_free.png';
                    buttons[i].focusImage = ROOT + '/Public/img/hd/Pay/V000005/btn_pay_free_f.png';
                }else{
                    buttons[i].backgroundImage = ROOT + '/Public/img/hd/Pay/V000006/btn_pay_times_20.png';
                    buttons[i].focusImage = ROOT + '/Public/img/hd/Pay/V000006/btn_pay_times_20_f.png';
                }
            }
            // 包月计费
            else if (RenderParam.orderItems[i].vip_type == 2) {
                buttons[i].backgroundImage = ROOT + '/Public/img/hd/Pay/V000006/btn_pay_month.png';
                buttons[i].focusImage = ROOT + '/Public/img/hd/Pay/V000006/btn_pay_month_f.png';
            }
            G("btn-" + (i + 1)).src = buttons[i].backgroundImage;
        }
        if (RenderParam.orderItems.length < 2) {
            buttons[1].backgroundImage = ROOT + '/Public/img/hd/Pay/V000006/btn_pay_cancel.png';
            buttons[1].focusImage = ROOT + '/Public/img/hd/Pay/V000006/btn_pay_cancel_f.png';
            G("btn-2").src = buttons[1].backgroundImage;
            buttons[1].isCancelBtn = true;
        }
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (typeof(RenderParam.orderItems) === "undefined" || RenderParam.orderItems == "") {
            LMEPG.UI.showToast("没有套餐",100);
            onBackDelay();
            return;
        }
        this.initButton();
        LMEPG.ButtonManager.init(["btn-1"], buttons, '', true);
    },

    /**
     * 去订购
     */
    toPay: function (data) {
        if(LMEPG.Func.isExist(data) && LMEPG.Func.isExist(data.payInfo)){
            var payInfo = data.payInfo;
            tradeNo = payInfo.tradeNo;
            returnUrl = payInfo.returnUrl;
            LMAndroid.JSCallAndroid.doPay(JSON.stringify(payInfo),function (param, notifyAndroidCallback) {
                param = param instanceof Object ? param : JSON.parse(param);
                LMEPG.Log.info("task param:"+JSON.stringify(param));
                // 订购失败
                if (param.result == -1) {
                    LMEPG.UI.showToast(param.data);
                    onBack();
                }
                // 查询订购结果
                else {
                    Pay.queryOrder();
                    LMEPG.UI.showToast("获取订购结果中，请稍等！", 60);
                    LMEPG.UI.showWaitingDialog();
                }
            });
        } else {
            LMEPG.UI.showToast("没有获取到订购信息");
            onBackDelay();
        }
    },

    /**
     * 查询订购结果
     */
    queryOrder:function () {
        setTimeout(function () {
            if(queryOrderTime < 1){
                LMEPG.UI.dismissWaitingDialog();
                console.log("queryOrder returnUrl:" + returnUrl + "&isOrder=0");
                LMEPG.Log.info("queryOrder returnUrl:" + returnUrl + "&isOrder=0");
                window.location.href = returnUrl + "&isOrder=0";
            } else {
                var requestData = {
                    "userId": RenderParam.userId,
                    "order_id": tradeNo,
                };
                console.log("queryOrder requestData:" + RenderParam.userId + "," + tradeNo);
                LMEPG.ajax.postAPI("Pay/getOrderPayResult", requestData, function (rsp) {
                    console.log("queryOrder result  Data:" + rsp.toString());
                    LMEPG.Log.info("queryOrder result  Data:" + rsp.toString());
                    var data  = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    if(data.result == 0){
                        LMEPG.UI.dismissWaitingDialog();
                        console.log("queryOrder returnUrl:" + returnUrl + "&isOrder=1");
                        LMEPG.Log.info("queryOrder returnUrl:" + returnUrl + "&isOrder=1");
                        window.location.href = returnUrl + "&isOrder=1";
                    } else {
                        queryOrderTime--;
                        Pay.queryOrder();
                    }
                });
            }
        }, 1000);
    }
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
