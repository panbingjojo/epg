var buttons = [];
var returnUrl = '';                //订购返回地址
var PAY_TYPE_ANDROID = 1;
var PAY_TYPE_WEB = 2;
var PAY_TYPE_HTTP = 3;
var payType = PAY_TYPE_ANDROID;//是否需要android才能跳转到局方订购页
var payAccount = "-1";             //订购账号
var regionCode = "";
var queryOrderTime = 20;         //查询订单最大次数

var Pay = {

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        var isFirstOrder = false; //是否第一次订购。
        if (payInfo.order_count < 1 && payInfo.price > 3000) {  //是否首次订购并且订购的非包月
            isFirstOrder = true;
        }

        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/buildPayUrl", payInfo, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (data.result == 0) {
                Pay.toPay(data.payInfo, isFirstOrder);
            } else {
                //获取订购参数失败
                if (LMEPG.Func.isExist(data.message)) {
                    LMEPG.UI.showToast(data.message, 3);
                } else {
                    LMEPG.UI.showToast("获取订购参数失败!", 3);
                }
                onBackDelay();
            }
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        if (RenderParam.orderItems.length <= btn.cIndex) {
            LMEPG.UI.showToast("没有该订购项!");
            return;
        }
        var PayInfo = {
            "vip_id": RenderParam.orderItems[btn.cIndex].vip_id,
            "vip_type": RenderParam.orderItems[btn.cIndex].vip_type,
            "product_id": btn.cIndex + 1,
            "userId": RenderParam.userId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "price": RenderParam.orderItems[btn.cIndex].price,
            "order_count": RenderParam.orderItems[btn.cIndex].order_count,
        };
        Pay.buildPayInfo(PayInfo);
        // Pay.postTel(""); //测试使用
    },

    /**
     * 初始化订购项
     */
    initButton: function () {
        buttons = [
            {
                id: 'btn-book1',
                name: '第一个订购项',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn-book2',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: '',
                backgroundImage: '',
                click: Pay.onPayItemClick,
                focusChange: Pay.onFocuesChange,
                beforeMoveChange: '',
                moveChange: "",
                cIndex: 0
            },
            {
                id: 'btn-book2',
                name: '第二个订购项',
                type: 'img',
                nextFocusLeft: 'btn-book1',
                nextFocusRight: 'btn-book3',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: '',
                backgroundImage: '',
                click: Pay.onPayItemClick,
                focusChange: Pay.onFocuesChange,
                beforeMoveChange: '',
                moveChange: "",
                cIndex: 1
            },
            {
                id: 'btn-book3',
                name: '第3个订购项',
                type: 'img',
                nextFocusLeft: 'btn-book2',
                nextFocusRight: 'btn-book4',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: '',
                backgroundImage: '',
                click: Pay.onPayItemClick,
                focusChange: Pay.onFocuesChange,
                beforeMoveChange: '',
                moveChange: "",
                cIndex: 2
            },
            {
                id: 'btn-book4',
                name: '第4个订购项',
                type: 'img',
                nextFocusLeft: 'btn-book3',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: '',
                backgroundImage: '',
                click: Pay.onPayItemClick,
                focusChange: Pay.onFocuesChange,
                beforeMoveChange: '',
                moveChange: "",
                cIndex: 3
            },
        ];
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            showError("没有套餐");
            return;
        }
        Pay.initButton();
        Pay.initBookPicture();
        LMEPG.ButtonManager.init("btn-book1", buttons, '', true);
    },

    /**
     * 初始化图片,默认是首次订购，判断不是首次就要更换图片
     */
    initBookPicture: function () {
        var imgPath = LMEPG.App.getAppRootPath() + "/Public/img/hd/Pay/V520004/";
        var activityName = LMEPG.Func.getLocationString('activityName') || '';
        for (var i = 0; i < RenderParam.orderItems.length; i++) {
            var orderItem = RenderParam.orderItems[i];
            if (orderItem.order_count > 0 || activityName =='ActivityDemolitionExpress20200312') {
                var price = orderItem.price;
                if (price == 3000) {
                    G("btn-book1").src = imgPath + "book1_once.png";
                } else if (price == 9000) {
                    G("btn-book2").src = imgPath + "book2_once.png";
                } else if (price == 18000) {
                    G("btn-book3").src = imgPath + "book3_once.png";
                } else if (price == 36000) {
                    G("btn-book4").src = imgPath + "book4_once.png";
                }
            }
        }
    },

    /**
     * 焦点改变方式
     * @param btn
     * @param hasFocus
     * @private
     */
    onFocuesChange: function (btn, hasFocus) {
        var dom = G(btn.id);
        var dom_box = G(btn.id + "-box");
        if (hasFocus) {
            dom.className = "img-book-hover";
            dom_box.style.visibility = "visible";
        } else {
            dom.className = "img-book";
            dom_box.style.visibility = "hidden";
        }
    },

    //提交用户电话号码
    postTel: function (payBackUrl, orderId) {
        LMEPG.UI.commonEditDialog.show("尊敬的VIP用户，请留下手机号，工作人员将在3个工作日内与您取得联系并确认赠品发放方式。", ["确&nbsp;&nbsp;定", "取&nbsp;&nbsp;消"], function (btnIndex, inputValue) {
            if (btnIndex === 0) {
                if (LMEPG.Func.isTelPhoneMatched(inputValue)) {
                    var reqJsonObj = {
                        "tel": inputValue,
                        "orderId": orderId
                    };
                    LMEPG.ajax.postAPI("User/orderSuccessToAddTel", reqJsonObj, function (data) {
                        var tempDataObj = data instanceof Object ? data : JSON.parse(data);
                        if (tempDataObj.result == "0") {
                            LMEPG.UI.commonEditDialog.dismiss();
                            LMEPG.UI.showToast("提交成功");
                            window.location.href = payBackUrl;
                        } else {
                            LMEPG.UI.showToast("提交失败，请重新提交");
                        }
                    });
                    return true;
                } else {
                    LMEPG.UI.showToast("请输入正确的电话号码");
                    return true;
                }
            } else {
                window.location.href = payBackUrl;
            }
        }, ['联系方式：', "", '在此输入手机号码...', 'tel']);
    },

    /**
     * 贵州广电的订购通过android的BuyVipUI跳转到局方的订购界面，然后直接返回订购结果
     */
    toPay: function (payInfo, isFirstOrder) {

        returnUrl = decodeURIComponent(payInfo.returnUrl);

        //订购成功回调
        function successCallback(res, step) {
            if (step == 1) {
                if (typeof LMEPG.Log !== "undefined") {
                    LMEPG.Log.info("520094 ---> toPay successCallback: step ---> " + step);
                }
                //表示支付成功
                LMEPG.UI.showToast("订购成功", 3);
                //构建支付结果回调地址
                var gzgdTradeNo = res.output.serialno;
                payBackUrl = returnUrl + "&result=0&gzgdTradeNo=" + gzgdTradeNo;
                if (typeof LMEPG.Log !== "undefined") {
                    LMEPG.Log.info("520094 ---> toPay successCallback: step  payBackUrl ---> " + step);
                }
            } else {
                //表示支付成功之后的支付结果显示界面的确认按钮,点击以后在返回
                if (isFirstOrder) {
                    if (typeof LMEPG.Log !== "undefined") {
                        LMEPG.Log.info("520094 ---> toPay successCallback:  postTel payBackUrl--->" + step);
                    }
                    Pay.postTel(payBackUrl, payInfo.tradeNo);
                } else {
                    if (typeof LMEPG.Log !== "undefined") {
                        LMEPG.Log.info("520094 ---> toPay successCallback:  payBackUrl--->" + payBackUrl);
                    }
                    window.location.href = payBackUrl;
                }

            }
        }

        //关闭订购页回调
        function closeCallback() {
            if (LMEPG.Func.isEmpty(payBackUrl)) {
                //判断没有订购成功就关闭订购弹窗
                onBack();
            } else {
                if (!isFirstOrder) {
                    window.location.href = payBackUrl;
                }
            }
        }

        //错误回调，判断的错误点都是我方的，局方的订购没有错误回调
        function errorCallback() {
            onBackDelay();
        }

        gzgdPay.start(successCallback, closeCallback, errorCallback, payInfo);

    },

};

function jumpAuthOrder() {
    var objDst = LMEPG.Intent.createIntent("authOrder");
    LMEPG.Intent.jump(objDst);
}
/**
 * 返回处理
 */
function onBack() {
    jumpAuthOrder();
    //LMEPG.Intent.back();
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
