var buttons = [];   // 定义全局按钮
var imgUrl = ROOT + "/Public/img/Pay/V620007/V2/";
var cerrentBtn = "";

var isSinglePay = true;   // TODO 是否是单订购项

// 返回按键
function onBack() {
    if (G("second-order-toast").style.display == "block") {
        LMEPG.BM.requestFocus(cerrentBtn);
        Pay.qrCodeImage = ''; //清空二维码图片
        G('code-img').src = imgUrl + 'bg_order_2.png';
        G("second-order-toast").style.display = "none";
        G("phone_num_container").style.display = "none";
    } else {
        LMEPG.Intent.back();
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

// 延迟退出该页面
function onDelayBack() {
    setTimeout(function () {
        LMEPG.Intent.back();
    }, 1500);
}

//页面跳转控制
var Jump = {
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
    payParamInfo: null,     // 下单结果存储
    isClickPay: false,       // 是否已经点击了支付
    changeScore: [1720, 5160, 10320, 20640],
    payMonth: [1, 3, 6, 12],  //订购套餐代表的月数
    qrCodeImage: '',       //二维码支付的图片
    PayType: {
        PHONE_TYPE: 1,             //话费支付
        QR_CODE_TYPE: 2,           //第三方二维码支付
        EXCHANGE_POINT_TYPE: 3     //积分支付
    },

    createOrderInfo: function (payType) {
        var cIndex = Pages.btnIndex;
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
            "pay_type": payType
        };
        Pay.buildPayInfo(payInfo);
    },

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.ui.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/buildPayInfo", payInfo, function (data) {
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
            if (data.result == 0) {
                switch (payInfo.pay_type) {
                    case Pay.PayType.PHONE_TYPE:
                        // 话费支付
                        Pay.payByPhone(data.payInfo);
                        break;
                    case Pay.PayType.QR_CODE_TYPE:
                        // 二维码支付，请求获取二维码图片
                        Pay.queryCodeImage(data.payInfo);
                        break;
                    case  Pay.PayType.EXCHANGE_POINT_TYPE:
                        // 积分支付
                        Pay.payByExchangePoint(data.payInfo);
                        break;
                }
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
            orderMonth: Pay.payMonth[Pages.btnIndex]
        };
        LMEPG.ajax.postAPI("Pay/queryCodeImage", postData, function (rsp) {
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
            LMEPG.Log.error("gansuyd---queryCodeImage: " + rsp);
            var data = rsp instanceof Object ? rsp : rsp ? JSON.parse(rsp) : rsp;
            if (data.result == 0) {
                // 判断当前请求是否成功,保存当前二维码图片
                Pay.qrCodeImage = "http://healthiptv.langma.cn" + data.qrcode;
                // 显示二维码图片
                G("code-img").src = Pay.qrCodeImage;
            } else {
                Pay.qrCodeImage = '';
                LMEPG.ui.showToast('二维码图片获取失败');
            }
        }, function () {
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
        });
    },

    /**
     *  话费订购
     */
    payByPhone: function (payInfo) {
        LMEPG.ui.showWaitingDialog("");
        var postData = {
            orderId: payInfo.tradeNo,
            userAccount: payInfo.accountIdentity,
            macAddress: payInfo.deviceId
        };
        LMEPG.ajax.postAPI("Pay/payByPhone", postData, function (data) {
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
            LMEPG.Log.error("gansuyd---payByPhone: " + data);
            Pay.showPayResult(data);
        }, function () {
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
        });

    },

    /**
     *  积分订购
     */
    payByExchangePoint: function (payInfo) {
        LMEPG.ui.showWaitingDialog("");
        var postData = {
            orderId: payInfo.tradeNo,
            userAccount: payInfo.accountIdentity,
            macAddress: payInfo.deviceId,
            orderMonth: Pay.payMonth[Pages.btnIndex]
        };
        LMEPG.ajax.postAPI("Pay/payByExchangePoint", postData, function (data) {
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
            LMEPG.Log.error("gansuyd---payByExchangePoint: " + data);
            Pay.showPayResult(data);
        }, function () {
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
        });
    },

    showPayResult: function (result) {
        if (result.orderSuccess == 1) {
            LMEPG.UI.commonDialog.show("您已成功订购智慧健康业务！", ["确定"], function (index) {
                LMEPG.Intent.back();
            })
        } else {
            LMEPG.ui.showToast("智慧健康业务订购失败!", 5, function () {
                LMEPG.Intent.back();
            });
        }
    },

    /**
     *  积分订购
     */
    queryVIPInfo: function () {
        var postData = {};
        LMEPG.ajax.postAPI("Pay/queryVipInfo", postData, function (data) {
            if (data.isVIP) {
                // 当前二维码支付成功，关闭当前页面
                LMEPG.Intent.back();
                // 清除定时器
                clearTimeout(Pay.qrCodeTimer);
            } else {
                if (Pages.cIndex == 1) {
                    // 启动定时器轮询
                    Pay.startTimer();
                }
            }
        });
    },

    /**
     * 套餐选择页面焦点切换
     * @param btn
     * @param hasFocus
     */
    onPackageFocusChange: function (btn, hasFocus) {
        if (hasFocus) {
            Pages.selectedPaymentID = btn.id;
            Pages.cIndex = btn.cIndex;
            LMEPG.bm.setSelected(btn.id, true);
            Pay._currentPackageId = btn.cIndex;
            // var item = Pages.orderInfo[Pages.btnIndex];
            var item = RenderParam.orderItems[Pages.btnIndex];
            if (btn.cIndex == 0) {
                G("phone_num_container").style.display = "block";
                G("check_code_container").style.display = "block";
            } else {
                G("phone_num_container").style.display = "none";
            }
            if (btn.cIndex == 1) {
                // 如果当前是二维码界面
                // 检测当前是否已经生成二维码图片，如果有二维码图片，直接显示二维码图片
                G("check_code_container").style.display = "none";
                if (Pay.qrCodeImage) {
                    G("code-img").src = Pay.qrCodeImage; // 设置二维码图片
                } else {
                    // 如果当前没有二维码图片，调用接口生成订单号，使用订单号生成二维码图片
                    Pay.createOrderInfo(Pay.PayType.QR_CODE_TYPE);
                }
                G("code-img").style.display = "block";
                Pay.startTimer(); //启动定时器轮询二维码结果
            } else {
                clearTimeout(Pay.qrCodeTimer); //清除定时器轮询二维码结果
                G("code-img").style.display = "none";
            }
            G("name").innerHTML = item.goods_name;
            G("type").innerHTML = Pages.order_type[Pages.btnIndex];
            if (btn.cIndex == 2) {
                G("price").innerHTML = item.score + "积分" + Pages.order_type_num[Pages.btnIndex];
                G("score").innerHTML = "当前账户积分：" + RenderParam.exchangePoint;
                G("price").innerHTML = Pay.changeScore[Pages.btnIndex] + "积分" + Pages.order_type_num[Pages.btnIndex];
                G("score").innerHTML = "当前账户积分：" + RenderParam.exchangePoint;
                G("check_code_container").style.display = "block";
            } else {
                G("price").innerHTML = item.price / 100 + "元" + Pages.order_type_num[Pages.btnIndex];
                G("score").innerHTML = "";
            }
        } else {
            LMEPG.bm.setSelected(btn.id, true);
        }
    },

    startTimer: function () {
        // 创建定时器，每间隔5秒轮询鉴权VIP接口，查询二维码订购结果
        Pay.qrCodeTimer = setTimeout(function () {
            Pay.queryVIPInfo();
        }, 5 * 1000);
    },

    toPayOnClick: function () {
        switch (Pay._currentPackageId) {
            case 0:
                // 电话订购
                if (Pay.checkCode()){
                    Pay.showConfirmDialog();
                }
                break;
            case 1:
                // 二维码订购
                LMEPG.UI.showToast("请扫描二维码进行支付");
                break;
            case 2:
                // 积分订购
                if (Pay.checkCode()) {
                    if (Pay.getScore()) {
                        LMEPG.UI.showToast("您的积分不足");
                    } else {
                        Pay.showConfirmDialog();
                    }
                }
                break;
        }
    },

    checkCode: function () {
        var checkResult = false;
        var inputVal = G("input_verify_code").innerHTML;
        if (inputVal.trim() === "") {
            console.error("验证码不能为空，请重试~");
            LMEPG.UI.showAndroidToast("验证码不能为空，请重试~");
        } else {
            if (inputVal == SecondToast.checkCode) {
                console.log("验证码正确");
                checkResult = true;
            } else {
                console.error("验证码输入错误");
                LMEPG.UI.showAndroidToast("验证码输入错误");
                G("verify_code").innerHTML = SecondToast.check_code = '' + SecondToast.getRandomNumber(1000, 9999);
            }
        }
        return checkResult;
    },

    showConfirmDialog: function () {
        // 添加验证码的检测功能
        var inputVal = G("input_verify_code").innerHTML;
        if (inputVal.trim() === "") {
            console.error("验证码不能为空，请重试~");
            LMEPG.UI.showAndroidToast("验证码不能为空，请重试~");
        } else {
            if (inputVal == SecondToast.checkCode) {
                console.log("验证码正确");
                LMEPG.UI.commonDialog.show("资费信息：20元/月<br/>" +
                    "提示：到期后如未退订，将自动续订", ["确定", "取消"], function (index) {
                    if (index == 0) {
                        // 点击确定按钮
                        // 话费支付
                        Pay.createOrderInfo(Pay.PayType.PHONE_TYPE);
                    }
                }, "gid_common_button_1");
            } else {
                console.error("验证码输入错误");
                LMEPG.UI.showAndroidToast("验证码输入错误");
                G("verify_code").innerHTML = SecondToast.check_code = '' + SecondToast.getRandomNumber(1000, 9999);
            }
        }
    },

    getScore: function () {
        if (parseInt(RenderParam.exchangePoint) >= Pay.changeScore[Pages.btnIndex]) {
            return false;
        } else {
            return true;
        }
    }
};
/**
 * 界面信息
 */
var Pages = {
    selectedPaymentID: 'btn-order-1',
    cIndex: 0,
    btnIndex: 0,
    orderInfo: [],
    order_type_num: ["/月", "/季度", "/半年", "/年"],
    order_type: ["包月", "季度", "半年", "包年"],
    initData: function () {
        if (typeof (RenderParam.orderItems) === "undefined" || RenderParam.orderItems == "") {
            showError("没有套餐");
            return;
        }
        Pages.orderInfo = [{
            "order_id": "1",
            "order_name": "包月",
            "price": "30",
            "prd_name": "智慧健康",
            "code": "bg_buy_1.png",
            "score": 120,
        }, {
            "order_id": "2",
            "order_name": "季度",
            "price": "120",
            "prd_name": "智慧健康",
            "code": "bg_buy_2.png",
            "score": 120,
        }, {
            "order_id": "3",
            "order_name": "半年",
            "price": "180",
            "prd_name": "智慧健康",
            "code": "bg_buy_3.png",
            "score": 120,
        }, {
            "order_id": "4",
            "order_name": "包年",
            "price": "360",
            "prd_name": "智慧健康",
            "code": "bg_buy_4.png",
            "score": 120,
        }]
    },
    initFirstLevelButton: function () {
        for (var i = 0; i < 4; i++) {
            buttons.push({
                id: 'order-type-' + (i + 1),
                name: '订购类型',
                type: 'img',
                nextFocusLeft: 'order-type-' + i,
                nextFocusRight: 'order-type-' + (i + 2),
                nextFocusUp: "",
                nextFocusDown: '',
                backgroundImage: imgUrl + "bg_buy_" + (i + 1) + ".png",
                focusImage: imgUrl + "f_buy_" + (i + 1) + ".png",
                click: Pages.onSecondTostClick,
                focusChange: "",
                beforeMoveChange: "",
                cType: i,
            });
        }
    },
    initSecondLevelButton: function () {
        for (var i = 0; i < 3; i++) {
            // 初始化Tab
            buttons.push({
                id: 'btn-order-' + (i + 1),
                name: '订购',
                type: 'img',
                nextFocusLeft: 'btn-order-' + i,
                nextFocusRight: 'btn-order-' + (i + 2),
                nextFocusUp: '',
                nextFocusDown: 'cancel',
                backgroundImage: imgUrl + "bg_order_" + (i + 1) + ".png",
                focusImage: imgUrl + "f_order_" + (i + 1) + ".png",
                selectedImage: imgUrl + "s_order_" + (i + 1) + ".png",
                groupId: "orderType",
                click: "",
                focusChange: Pay.onPackageFocusChange,
                beforeMoveChange: "",
                cIndex: i,     // 订购项下标
            });
        }
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
            click: Pay.toPayOnClick,
            focusChange: "",
            beforeMoveChange: Pages.onBeforeConfirmMoveChange,
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
            beforeMoveChange: Pages.onBeforeCancelMoveChange,
            cType: "region",
        });
        buttons.push({
            id: "input_verify_code",
            name: "",
            type: "div",
            nextFocusDown: "pay_cancel",
            nextFocusUp: "payment_item_1",
            backgroundImage: imgUrl + "bg_verify_code_n.png",
            focusImage: imgUrl + "bg_verify_code_f.png",
            focusChange: SecondToast.onInputVerifyCodeFocus,
        });

    },
    /**
     * 焦点移动前改变
     */
    onBeforeCancelMoveChange: function (direction, current) {
        switch (direction) {
            case 'up':
                if (Pages.selectedPaymentID == 'btn-order-1' || Pages.selectedPaymentID == 'btn-order-3') {
                    LMEPG.BM.requestFocus('input_verify_code');
                } else {
                    LMEPG.BM.requestFocus(Pages.selectedPaymentID);
                }
                break;
            case 'down':
                break;
        }
    },

    /**
     * 焦点移动前改变
     */
    onBeforeConfirmMoveChange: function (direction, current) {
        switch (direction) {
            case 'up':
                LMEPG.BM.requestFocus(Pages.selectedPaymentID);
                break;
            case 'down':
                break;
        }
    },


    onSecondTostClick: function (btn) {
        Pages.btnIndex = btn.cType;
        cerrentBtn = btn.id;
        SecondToast.init();
    }
    ,

    init: function () {
        Pages.initData();
        Pages.initFirstLevelButton();     //一级界面订购项
        Pages.initSecondLevelButton();    //二级界面订购项
        Pay.qrCodeImage = '';             //清除二维码图片
        var defaultId = "order-type-1";
        LMEPG.ButtonManager.init([defaultId], buttons, "", true);
    }
    ,

};

var SecondToast = {
    check_code: '',
    init: function () {
        G("second-order-toast").style.display = "block";
        var orderItem = RenderParam.orderItems[Pages.btnIndex];
        var price = parseInt(orderItem.price) / 100;
        G('desc_price').innerHTML = price + '元/月';
        G("name").innerHTML = orderItem.goods_name;
        G("type").innerHTML = Pages.order_type[Pages.btnIndex];
        G("price").innerHTML = orderItem.price / 100 + "元" + Pages.order_type_num[Pages.btnIndex];
        G("code-img").style.display = "none";
        SecondToast.check_code = '';
        if (Pages.btnIndex != 0) {
            LMEPG.ButtonManager.requestFocus("cancel");
            LMEPG.BM.getButtonById("btn-order-2").nextFocusLeft = "";
            G("btn-order-1").src = imgUrl + "n_order_1.png";
            G("btn-order-2").src = imgUrl + "s_order_2.png";
            LMEPG.BM.getButtonById("btn-order-1").backgroundImage = imgUrl + "n_order_1.png";
            Pages.selectedPaymentID = "btn-order-2";
            G("code-img").style.display = "block";
            Pages.selectedPaymentID = 'btn-order-2';
        } else {
            G("btn-order-1").src = imgUrl + "s_order_1.png";
            G("btn-order-2").src = imgUrl + "bg_order_2.png";
            G("btn-order-3").src = imgUrl + "bg_order_3.png";
            LMEPG.BM.getButtonById("btn-order-1").backgroundImage = imgUrl + "bg_order_1.png";
            LMEPG.BM.getButtonById("btn-order-2").nextFocusLeft = "btn-order-1";
            LMEPG.ButtonManager.requestFocus("cancel");
            G("phone_num_container").style.display = "block";
            G("check_code_container").style.display = "block";
            G("verify_code").innerHTML = SecondToast.check_code = '' + SecondToast.getRandomNumber(1000, 9999);
            Pages.selectedPaymentID = 'btn-order-1';
        }
    },


    getRandomNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
     * 输入框焦点变动事件
     */
    onInputVerifyCodeFocus: function (btn, hasFocus) {
        if (hasFocus) {
            JJKye.init({
                isExist: true,
                top: '-24px',
                left: '20px',
                width: '412px',
                height: '135px',
                action: "checkCode",
                input: 'input_verify_code', //  输入框ID
                backFocus: 'confirm', // 返回ID
                resolution: 'hd' // 盒子分辨率
            });
        }
    },
};

