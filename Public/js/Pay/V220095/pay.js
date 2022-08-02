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
    if (errorLevel === true) console.error('[220095][pay.js]--->[' + tag + ']--->' + msg);
    else console.info('[220095][pay.js]--->[' + tag + ']--->' + msg);
    LMEPG.Log.info('[220095][pay.js]--->[' + tag + ']--->' + msg);
}

//////////////////////////////
//   吉林广电支付接口整理   //
//////////////////////////////
var PayType = {
    WECHAT_PAY: 1,     // 微信支付
    ALI_PAY: 2,        // 支付宝支付
    BEST_PAY: 3,       // 翼支付
    BILL_PAYMENT: 4,   // 账单支付
    MOBILE_PAYMENT: 6, // 手机支付
};

var JLPayService = {
    SERVER_URL: "http://10.128.7.2:8008",
    //SERVER_URL: "http://10.128.7.100:8008",
    //SERVER_AUTH_URL: "http://10.128.7.100:8088",
    SERVER_AUTH_URL: "http://10.128.7.2:8088",
    PRODUCT_ID: "1100000481",
    SP_ID: "073",
    AREA_ID: "10440",

    /**
     * 构建订单信息
     * @param payInfoObj
     */
    buildOrderInfo: function () {
        var orderIndex = JLPay.orderIndex;
        var payInfoObj = {
            'lmVipId': RenderParam.orderItems[orderIndex].vip_id,
            'lmVipType': RenderParam.orderItems[orderIndex].vip_type,
            'contentName': RenderParam.orderItems[orderIndex].goods_name,
            'lmTradeNo': '',//我方生成的订单号，后面某个阶段会去cws请求它，先占位所有参数定义
            'renew': '',  //是否续订
            'payTime': '',//支付时间
            'endTime': '',//VIP过期时间
            'price': RenderParam.orderItems[orderIndex].price,  //支付费用
            'payType': '',// 支付类型
            'lmIsPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'lmRemark': RenderParam.remark,
            'lmReturnPageName': RenderParam.returnPageName,
            'lmReason': RenderParam.lmReason,
            'orderType': RenderParam.orderType
        };
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Pay/getOrderTradeNo', {
            'orderItemId': payInfoObj.lmVipId,
            'orderReason': payInfoObj.orderReason,
            'orderRemark': payInfoObj.lmRemark,
            'orderType': payInfoObj.orderType,
            'lmReason': payInfoObj.lmReason
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            log("buildOrderInfo", "rsp >>> " + JSON.stringify(data));
            if (data.result == 0 && data.tradeNo !== '') {
                payInfoObj.lmTradeNo = data.tradeNo;//把从我方cws生成的订单号附加到payInfoObj对象参数里，用于构建返回地址
                // 保存当前订单信息
                JLPay.orderInfo = payInfoObj;
                // 生成局方订单信息
                switch (JLPay.orderIndex) {
                    case 0:
                        JLPay.orderInfo.renew = 1;
                        JLPayService.serviceOrder(1, 1, payInfoObj.price);
                        break;
                    case 1:
                        JLPay.orderInfo.renew = 0;
                        JLPayService.serviceOrder(0, 1, payInfoObj.price);
                        break;
                    case 2:
                        JLPay.orderInfo.renew = 0;
                        JLPayService.serviceOrder(0, 4, payInfoObj.price);
                        break;
                }
            } else {
                LMEPG.UI.dismissWaitingDialog();
                log('JLPayService.buildOrderInfo()', '[buildOrderInfo][failed!]-->我方生成支付订单失败！' + JSON.stringify(data), true);
                if (RenderParam.isVip == 1){
                    LMEPG.UI.showToast('您已经是会员',3);
                }else {
                    LMEPG.UI.showToast('生成订单失败[' + data.result + ']',3);
                }
            }
        });
    },

    /**
     * 生成预订单
     * @param customerRenew 是否续订 0：非续订， 1：续订（账单支付）
     * @param cycleType 包时长周期类型，1：月卡，2：季卡，3：半年卡，4：年卡， 5：周卡， 6:三日卡
     * @param fee 价格 单位：分
     */
    serviceOrder: function (customerRenew, cycleType, fee) {
        var serviceOrderURL = JLPayService.SERVER_URL + "/orders/service_order";
        var serviceOrderParams = "?spId=" + JLPayService.SP_ID + "&productId=" + RenderParam.productId + "&userId=" + RenderParam.accountId
            + "&chargesType=1&areaId=" + JLPayService.AREA_ID + "&customerRenew=" + customerRenew + "&cycleType=" + cycleType
            + "&fee=" + fee;
        serviceOrderURL += serviceOrderParams;
        LMEPG.UI.showWaitingDialog();
        log("serviceOrder", "serviceOrderURL >>> " + serviceOrderURL);
        // 发起网络请求
        LMEPG.ajax.post(
            {
                url: serviceOrderURL,
                requestType: "GET",
                dataType: "json",
                data: "",
                success: function (xmlHttp, rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    log("serviceOrder", "rsp >>> " + JSON.stringify(rsp));
                    if (rsp.code == 0) {
                        JLPay.wechatQrUrl = JLPayService.SERVER_URL + "/orders" + rsp.wechatQrUrl;
                        JLPay.alipayQrUrl = JLPayService.SERVER_URL + "/orders" + rsp.fusionpayQrUrl;
                        JLPay.bestpayQrUrl = JLPayService.SERVER_URL + "/orders" + rsp.bestpayQrUrl;
                        JLPay.orderId = rsp.orderId;
                        JLPay.fee = rsp.fee;

                        JLPay.showOrderDetail();
                        if (JLPay.orderIndex == 1 || JLPay.orderIndex == 2) {
                            JLPayService.orderStatus();
                        }
                    } else {
                        LMEPG.UI.showToast("生成订单失败," + rsp.msg);
                    }
                },
                error: function (xmlHttp, rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("生成订单失败，服务器出错," + xmlHttp.status);
                },
            }
        )
    },

    /**
     * 订单结果查询
     */
    orderStatus: function () {
        var orderStatusURL = JLPayService.SERVER_URL + "/orders/status/" + JLPay.orderId;
        log("orderStatus", "orderStatusURL >>> " + orderStatusURL);
        // 发起网络请求
        LMEPG.ajax.post(
            {
                url: orderStatusURL,
                requestType: "GET",
                dataType: "json",
                data: "",
                success: function (xmlHttp, rsp) {
                    log("orderStatus", "rsp >>> " + JSON.stringify(rsp));
                    // status 返回支付状态1：支付成功 2：支付失败 3：未支付 4.超时 5.删除 6.取消 7.退款成功 8.退款失败
                    if (rsp.code == 0) {
                        switch (rsp.status) {
                            case 1:
                                JLPayService.doAuth();
                                break;
                            case 2:
                                LMEPG.UI.showToast("支付失败", 3, function () {
                                    JLPay.showOrderItems();
                                });
                                break;
                            case 3:
                            case 4:
                                JLPayService.orderStatusTimer = setTimeout(function () {
                                    JLPayService.orderStatus(JLPay.orderId);
                                }, 3 * 1000);
                                break;
                        }
                    } else {
                        LMEPG.UI.showToast("支付失败，" + rsp.msg, 3, function () {
                            JLPay.showOrderItems();

                        })
                    }
                },
                error: function (xmlHttp, rsp) {
                    LMEPG.UI.showToast("支付失败，服务器出错," + xmlHttp.status, 3, function () {
                        JLPay.showOrderItems();
                    })
                },
            }
        )
    },

    payBill: function (payType) {
        var payBillURL = JLPayService.SERVER_URL + "/orders/payBill/" + JLPay.orderId;
        var payBillParams = "?payType=" + payType;
        if (payType === PayType.MOBILE_PAYMENT) {
            payBillParams += "&phone=" + JLPay.userPhone + "&checkCode=" + JLPay.checkCode;
        }
        payBillURL += payBillParams;
        LMEPG.UI.showWaitingDialog();
        log("payBill", "payBillURL >>> " + payBillURL);
        // 发起网络请求
        LMEPG.ajax.post(
            {
                url: payBillURL,
                requestType: "GET",
                dataType: "json",
                data: "",
                success: function (xmlHttp, rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    log("payBill", "rsp >>> " + JSON.stringify(rsp));
                    if (rsp.code == 0) {
                        JLPayService.doAuth();
                    } else {
                        LMEPG.UI.showToast("支付失败，" + rsp.msg, 3, function () {
                            JLPay.showOrderItems();
                        });
                    }
                },
                error: function (xmlHttp, rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("支付失败，服务器出错," + xmlHttp.status, 3, function () {
                        JLPay.showOrderItems();
                    });
                },
            }
        )
    },

    checkCode: function () {
        var checkCodeURL = JLPayService.SERVER_URL + "/orders/checkcode/" + JLPay.userPhone + "/" + RenderParam.accountId;
        LMEPG.UI.showWaitingDialog();
        log("checkCode", "checkCodeURL >>> " + checkCodeURL);
        // 发起网络请求
        LMEPG.ajax.post(
            {
                url: checkCodeURL,
                requestType: "GET",
                dataType: "json",
                data: "",
                success: function (xmlHttp, rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    log("checkCode", "rsp >>> " + JSON.stringify(rsp));
                    // 调用成功
                    if (rsp.code == 0) {
                        // 开启倒计时
                        // JLPay.startCheckCode();
                        JLPay.startCheckCode();
                    } else {
                        LMEPG.UI.showToast("获取验证码失败，" + rsp.msg);
                    }
                },
                error: function (xmlHttp, rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("获取验证码失败，服务器出错," + xmlHttp.status);
                },
            }
        )
    },

    /**
     * 鉴权查询订购相关详细信息
     */
    doAuth: function () {
        var doAuthURL = JLPayService.SERVER_AUTH_URL + "/auth/serviceAuth?productId=" + JLPayService.PRODUCT_ID + "&userId=" + RenderParam.accountId + "&chargesType=1";
        LMEPG.UI.showWaitingDialog();
        log("doAuth", "doAuthURL >>> " + doAuthURL);
        // 发起网络请求
        LMEPG.ajax.post(
            {
                url: doAuthURL,
                requestType: "GET",
                dataType: "json",
                data: "",
                success: function (xmlHttp, rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    log("doAuth", "rsp >>> " + JSON.stringify(rsp));
                    // 调用成功
                    if (rsp[JLPayService.PRODUCT_ID].result == 0) {
                        // 记录信息
                        JLPay.orderInfo.payTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                        JLPay.orderInfo.endTime = rsp[JLPayService.PRODUCT_ID].expiredTime;

                        JLPayService.uploadResultInfo();
                    }
                },
                error: function (xmlHttp, rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    log("doAuth", "鉴权失败，服务器出错 >>> " + xmlHttp.status);
                    LMEPG.UI.showToast("鉴权失败，服务器出错," + xmlHttp.status);
                },
            }
        )
    },

    /**
     * 上传订购结果信息到CWS保存
     */
    uploadResultInfo: function () {
        LMEPG.UI.showWaitingDialog();
        log("uploadResultInfo()", "上报订购结果参数--->uploadInfo: " + JSON.stringify(JLPay.orderInfo));
        LMEPG.ajax.postAPI("Pay/uploadPayResult", JLPay.orderInfo, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("订购成功", 3, function () {
                LMEPG.Intent.back();
            });
        }, function (msg) {
            log("uploadResultInfo()", "订购成功[" + msg + "]！但未查询到订购信息，无法上报。");
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("订购成功[" + msg + "]", 3, "onBack()");//订购成功，但是未查询到订购信息，无法上报！
        });
    }
};

/**
 *  支付入口类
 */
var JLPay = {
    VERIFY_CODE_NUMS: 4,// 验证码随机位数
    verifyCode: "",     // 存储当前生成的随机数
    isCheckCode: false, // 是否获取验证码
    wechatQrUrl: "",    // 微信二维码图片
    alipayQrUrl: "",
    bestpayQrUrl: "",
    fee: "",
    orderId: "",
    orderIndex: -1,
    orderClickItem: "",
    orderInfo: null,
    countdown: 60,
    payItem: null,
    payTypeArr: [],
    checkCodeInterval: null, // 手机号验证码计时器
    initButtons: function () {
        buttons.push({
            id: 'order_item_1',
            name: '续包月',
            type: 'img',
            nextFocusRight: 'order_item_2',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/order_item_1.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/order_item_1_f.png',
            click: JLPay.eventHandler,
            cIndex: 0
        }, {
            id: 'order_item_2',
            name: '包月',
            type: 'img',
            nextFocusRight: 'order_item_3',
            nextFocusLeft: 'order_item_1',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/order_item_2.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/order_item_2_f.png',
            click: JLPay.eventHandler,
            cIndex: 1
        }, {
            id: 'order_item_3',
            name: '包年',
            type: 'img',
            nextFocusLeft: 'order_item_2',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/order_item_3.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/order_item_3_f.png',
            click: JLPay.eventHandler,
            cIndex: 2
        }, {
            id: 'pay_item_1',
            name: '支付方式1',
            type: 'img',
            nextFocusRight: 'pay_item_2',
            nextFocusDown: "btn_pay_sure",
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/wechat_pay.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/wechat_pay_f.png',
            selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/wechat_pay_s.png',
            focusChange: JLPay.onPayTypeFocus,
            click: JLPay.eventHandler,
            pIndex: 0
        }, {
            id: 'pay_item_2',
            name: '支付方式2',
            type: 'img',
            nextFocusLeft: 'pay_item_1',
            nextFocusRight: 'pay_item_3',
            nextFocusDown: "btn_pay_sure",
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/ali_pay.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/ali_pay_f.png',
            selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/ali_pay_s.png',
            focusChange: JLPay.onPayTypeFocus,
            click: JLPay.eventHandler,
            pIndex: 1
        }, {
            id: 'pay_item_3',
            name: '支付方式3',
            type: 'img',
            nextFocusLeft: 'pay_item_2',
            nextFocusDown: "btn_pay_sure",
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/best_pay.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/best_pay_f.png',
            selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/best_pay_s.png',
            focusChange: JLPay.onPayTypeFocus,
            click: JLPay.eventHandler,
            pIndex: 2
        }, {
            id: 'btn_pay_sure',
            name: '确定支付',
            type: 'img',
            nextFocusRight: 'btn_pay_cancel',
            nextFocusUp: 'pay_item_1',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/pay_sure.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/pay_sure_f.png',
            click: JLPay.eventHandler,
        }, {
            id: 'btn_pay_cancel',
            name: '取消支付',
            type: 'img',
            nextFocusLeft: 'btn_pay_sure',
            nextFocusUp: 'pay_item_1',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/pay_cancel.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/pay_cancel_f.png',
            click: JLPay.eventHandler,
        }, {
            id: 'user_phone',
            name: '用户手机号',
            type: 'div',
            nextFocusUp: 'pay_item_2',
            nextFocusDown: 'btn_check_code',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/bg_user_phone.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/bg_user_phone.png',
            focusChange: JLPay.onInputFocus,
            click: JLPay.eventHandler,
        }, {
            id: 'btn_check_code',
            name: '获取验证码',
            type: 'div',
            nextFocusUp: 'user_phone',
            nextFocusDown: 'btn_pay_cancel',
            nextFocusRight: "check_code",
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/check_code.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/check_code_f.png',
            click: JLPay.eventHandler,
        }, {
            id: 'check_code',
            name: '验证码',
            type: 'div',
            nextFocusUp: 'user_phone',
            nextFocusDown: 'btn_pay_cancel',
            nextFocusLeft: "btn_check_code",
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/bg_check_code.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/bg_check_code.png',
            focusChange: JLPay.onInputFocus,
            click: JLPay.eventHandler,
        }, {
            id: 'input_verify',
            name: '验证码输入框',
            type: 'div',
            nextFocusDown: 'btn_pay_sure',
            nextFocusRight: 'delete_verify_code',
            nextFocusUp: 'pay_item_1',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/input_verify.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/input_verify_f.png',
            focusChange: JLPay.onInputVerifyFocus,
        }, {
            id: 'delete_verify_code',
            name: '删除验证码',
            type: 'img',
            nextFocusDown: 'btn_pay_sure',
            nextFocusLeft: 'input_verify',
            nextFocusUp: 'pay_item_1',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/delete_code.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/delete_code_f.png',
            click: JLPay.eventHandler,
        });
    },

    /**
     * 事件处理器
     * @param btn 触发事件按钮
     */
    eventHandler: function (btn) {
        switch (btn.id) {
            case 'order_item_1':
                JLPay.createVerifyCode();
                JLPay.orderIndex = btn.cIndex;
                JLPay.orderClickItem = btn.id;
                // 构建cws订单信息
                JLPayService.buildOrderInfo();
                //JLPay.showOrderDetail();
                break;
            case 'order_item_2':
            case 'order_item_3':
                JLPay.orderIndex = btn.cIndex;
                JLPay.orderClickItem = btn.id;
                // 构建cws订单信息
                JLPayService.buildOrderInfo();
                break;
            case 'btn_pay_sure':
                JLPay.onPayItemClick();
                break;
            case 'btn_pay_cancel':
                JLPay.showOrderItems();
                break;
            case 'btn_check_code':
                if (!JLPay.isCheckCode) {
                    // 防止连续点击操作
                    LMEPG.UI.forbidDoubleClickBtn(function () {
                        JLPay.userPhone = G('user_phone').innerHTML;
                        if (LMEPG.Func.isTelPhoneMatched(JLPay.userPhone)) {
                            // 调用接口
                            JLPayService.checkCode(JLPay.orderId);
                            // JLPay.startCheckCode();
                        } else {
                            // 提示输入有效的手机号
                            LMEPG.UI.showToast("请输入有效的手机号码", 3);
                        }

                    }, 500);
                }
                break;
            case "delete_verify_code":
                var verifyCode = G('input_verify').value;
                if(verifyCode != ''){
                    var deleteCode = verifyCode.substr(0, verifyCode.length - 1);
                    G('input_verify').value = deleteCode;
                }
                break;
        }
    },

    /**
     * 生成随机4位数验证码
     */
    createVerifyCode: function () {
        var verifyCode = "";
        for (var i = 0; i < JLPay.VERIFY_CODE_NUMS; i++) {
            verifyCode += Math.floor(Math.random() * 10)
        }
        JLPay.verifyCode = verifyCode;
        G("verify_code").innerHTML = verifyCode;
    },

    startCheckCode: function () {
        JLPay.isCheckCode = true;
        JLPay.countdown = 60;
        G('countdown').innerHTML = "60s";
        var unableImage = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/check_code_u.png';
        G('btn_check_code').style.backgroundImage = 'url('+ unableImage +')';
        var checkCodeBtn = LMEPG.ButtonManager.getButtonById("btn_check_code");
        checkCodeBtn.backgroundImage = unableImage;
        checkCodeBtn.focusImage = unableImage;
        JLPay.checkCodeInterval = setInterval(function () {
            JLPay.countdown -= 1;
            G('countdown').innerHTML = JLPay.countdown + 's';
            if (JLPay.countdown <= 0) {
                JLPay.resetCheckCode(checkCodeBtn);
            }
        }, 1000);
    },

    /**
     * 支付方式选中监听
     * @param btn 被选中的按钮
     * @param hasFocus 是否处于选中状态
     */
    onPayTypeFocus: function (btn, hasFocus) {
        if (hasFocus) {
            // 隐藏元素
            H("pay_qr_code");
            H("check_code_container");
            H("bill_pay_check");

            var payCancelBtn = LMEPG.ButtonManager.getButtonById("btn_pay_sure");
            var paySureBtn = LMEPG.ButtonManager.getButtonById("btn_pay_cancel");
            payCancelBtn.nextFocusUp = paySureBtn.nextFocusUp = btn.id;
            JLPay.payItem = JLPay.payTypeArr[btn.pIndex];
            log("onPayTypeFocus", "onPayTypeFocus payType >>> " + JLPay.payItem.payType);
            JLPay.orderInfo.payType = JLPay.payItem.payType;
            switch (JLPay.payItem.payType) {
                case PayType.MOBILE_PAYMENT:
                    btn.nextFocusDown = "user_phone";
                    S("check_code_container");
                    break;
                case PayType.BILL_PAYMENT:
                    btn.nextFocusDown = "input_verify";
                    S("bill_pay_check");
                    break;
                case PayType.WECHAT_PAY:
                    log("onPayTypeFocus", "onPayTypeFocus wechatQrUrl >>> " + JLPay.wechatQrUrl);
                    btn.nextFocusDown = "btn_pay_sure";
                    G("pay_qr_code").src = JLPay.wechatQrUrl;
                    S("pay_qr_code");
                    break;
                case PayType.ALI_PAY:
                    log("onPayTypeFocus", "onPayTypeFocus alipayQrUrl >>> " + JLPay.alipayQrUrl);
                    btn.nextFocusDown = "btn_pay_sure";
                    G("pay_qr_code").src = JLPay.alipayQrUrl;
                    S("pay_qr_code");
                    break;
                case PayType.BEST_PAY:
                    log("onPayTypeFocus", "onPayTypeFocus bestpayQrUrl >>> " + JLPay.bestpayQrUrl);
                    btn.nextFocusDown = "btn_pay_sure";
                    G("pay_qr_code").src = JLPay.bestpayQrUrl;
                    S("pay_qr_code");
                    break;
            }
        }
    },

    /**
     * 输入框选中效果
     *
     * @param btn
     * @param hasFocus
     */
    onInputFocus: function (btn, hasFocus) {
        switch (btn.id) {
            case "user_phone":
                LMEPG.UI.keyboard.show(450, 150, 'user_phone', 'btn_check_code','11');
                break;
            case "check_code":
                LMEPG.UI.keyboard.show(450, 150, 'check_code', 'pay_item_2','4');
                break;
        }
        if (hasFocus) {
            G(btn.id).style.color = "#333";
        } else {
            G(btn.id).style.color = "#999";
        }
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
     * 获取订购详情
     */
    getOrderDetail: function () {
        switch (JLPay.orderIndex) {
            case 0:
                JLPay.payTypeArr = [
                    {
                        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/bill_payment.png',
                        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/bill_payment_f.png',
                        selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/bill_payment_s.png',
                        navWidth: "267px",
                        nextFocusRight: "pay_item_2",
                        payType: PayType.BILL_PAYMENT,
                        payTypeName: "续包月",
                        payPrice: (JLPay.fee / 100) + "元/月"
                    }, {
                        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/mobile_payment.png',
                        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/mobile_payment_f.png',
                        selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/mobile_payment_s.png',
                        navWidth: "267px",
                        nextFocusRight: "",
                        nextFocusDown: "user_phone",
                        payType: PayType.MOBILE_PAYMENT,
                        payTypeName: "续包月",
                        payPrice: (JLPay.fee / 100) + "元/月"
                    }
                ];
                break;
            case 1:
                JLPay.payTypeArr = [
                    {
                        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/wechat_pay.png',
                        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/wechat_pay_f.png',
                        selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/wechat_pay_s.png',
                        navWidth: "178px",
                        nextFocusRight: "pay_item_2",
                        payType: PayType.WECHAT_PAY,
                        payTypeName: "包月",
                        payPrice: (JLPay.fee / 100) + "元/月"
                    }, {
                        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/ali_pay.png',
                        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/ali_pay_f.png',
                        selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/ali_pay_s.png',
                        navWidth: "178px",
                        nextFocusRight: "pay_item_3",
                        payType: PayType.ALI_PAY,
                        payTypeName: "包月",
                        payPrice: (JLPay.fee / 100) + "元/月"
                    }, {
                        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/best_pay.png',
                        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/best_pay_f.png',
                        selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/best_pay_s.png',
                        navWidth: "178px",
                        nextFocusRight: "",
                        payType: PayType.BEST_PAY,
                        payTypeName: "包月",
                        payPrice: (JLPay.fee / 100) + "元/月"
                    }
                ];
                break;
            case 2:
                JLPay.payTypeArr = [
                    {
                        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/wechat_pay.png',
                        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/wechat_pay_f.png',
                        selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/wechat_pay_s.png',
                        navWidth: "178px",
                        nextFocusRight: "pay_item_2",
                        payType: PayType.WECHAT_PAY,
                        payTypeName: "包年",
                        payPrice: (JLPay.fee / 100) + "元/年"
                    }, {
                        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/ali_pay.png',
                        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/ali_pay_f.png',
                        selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/ali_pay_s.png',
                        navWidth: "178px",
                        nextFocusRight: "pay_item_3",
                        payType: PayType.ALI_PAY,
                        payTypeName: "包年",
                        payPrice: (JLPay.fee / 100) + "元/年"
                    }, {
                        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/best_pay.png',
                        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/best_pay_f.png',
                        selectImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/best_pay_s.png',
                        navWidth: "178px",
                        nextFocusRight: "",
                        payType: PayType.BEST_PAY,
                        payTypeName: "包年",
                        payPrice: (JLPay.fee / 100) + "元/年"
                    }
                ];
                break;
        }
    },

    /**
     * 计费项点击事件
     */
    showOrderDetail: function () {
        // 构建页面渲染数据
        JLPay.getOrderDetail();

        for (var i = 0; i < JLPay.payTypeArr.length; i++) {
            // 获取支付类型对象
            var payTypeItem = JLPay.payTypeArr[i];

            // 获取导航栏ID
            var payTypeNav = "pay_item_" + (i + 1);
            // 清除所有样式
            G(payTypeNav).style.width = payTypeItem.navWidth;

            // 获取按钮
            var navBtn = LMEPG.ButtonManager.getButtonById(payTypeNav);
            // 设置导航栏图片
            G(payTypeNav).src = payTypeItem.backgroundImage;
            navBtn.backgroundImage = payTypeItem.backgroundImage;
            navBtn.focusImage = payTypeItem.focusImage;
            navBtn.selectImage = payTypeItem.selectImage;

            // 设置焦点
            navBtn.nextFocusRight = payTypeItem.nextFocusRight;

            // 设置支付详情
            G('pay_type').innerHTML = payTypeItem.payTypeName;
            G('pay_price').innerHTML = payTypeItem.payPrice;
        }

        JLPay.showPayTypes();
    },

    /**
     * 点击订购项
     */
    onPayItemClick: function () {
        switch (JLPay.payItem.payType) {
            case PayType.BILL_PAYMENT:
                var inputVal = G("input_verify").value;
                if (inputVal.trim() === "") {
                    LMEPG.UI.showToast("验证码不能为空，请重试~");
                } else if (inputVal == JLPay.verifyCode) {
                    // 执行订购操作
                    JLPayService.payBill(JLPay.payItem.payType);
                } else {
                    LMEPG.UI.showToast("验证码输入错误", 3);
                    JLPay.createVerifyCode();
                }
                break;
            case PayType.MOBILE_PAYMENT:
                JLPay.checkCode = G('check_code').innerHTML;
                if (JLPay.checkCode) {
                    JLPayService.payBill(JLPay.payItem.payType);
                } else {
                    LMEPG.UI.showToast("请输入验证码");
                }
                break;
            case PayType.WECHAT_PAY:
            case PayType.ALI_PAY:
            case PayType.BEST_PAY:
                LMEPG.UI.showToast("请扫描上方二维码支付！");
                break;
        }
    },

    /**
     * 显示订购项
     */
    showOrderItems: function () {
        H('pay_type_container');
        // 隐藏元素 -- 二维码图片，手机验证码图片
        H("pay_qr_code");
        H("check_code_container");
        H('bill_pay_check');

        // 清除电话号码和验证码
        G('user_phone').innerHTML = '输入手机号';
        G('check_code').innerHTML = '输入验证码';

        // 清除计时器,恢复验证码状态
        if(JLPay.checkCodeInterval){
            var checkCodeBtn = LMEPG.ButtonManager.getButtonById("btn_check_code");
            JLPay.resetCheckCode(checkCodeBtn);
        }

        S('order_items_container');
        LMEPG.ButtonManager.requestFocus(JLPay.orderClickItem);
    },

    resetCheckCode: function (checkCodeBtn) {
        var normalImage = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/check_code.png';
        var focusImage = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220095/check_code_f.png';
        clearInterval(JLPay.checkCodeInterval);
        JLPay.isCheckCode = false;
        if (LMEPG.ButtonManager.getCurrentButton.id == 'btn_check_code'){ // 判断当前焦点
            G('btn_check_code').style.backgroundImage = 'url('+ focusImage +')';
        }else {
            G('btn_check_code').style.backgroundImage = 'url('+ normalImage +')';
        }
        G('countdown').innerHTML = '';
        checkCodeBtn.backgroundImage = normalImage;
        checkCodeBtn.focusImage = focusImage;
    },

    /**
     * 显示支付类型
     */
    showPayTypes: function () {
        H('order_items_container');
        H('bill_pay_check');
        S('pay_type_container');
        LMEPG.ButtonManager.requestFocus("pay_item_1");
    },

    back: function () {
       if (G('pay_type_container').style.visibility === "visible") {
            // 显示二级页面返回一级页面
            JLPay.showOrderItems();
        } else {
            // 退出当前页面
            LMEPG.Intent.back();
        }
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            LMEPG.UI.showToast('后台运营未配置订购项！');
            onBack();
            return;
        }
        this.initButtons();
        LMEPG.BM.init('order_item_1', buttons, '', true);
    }
};

window.onBack = JLPay.back;

function onInputChange(e) {
    if (G("input_verify").value.length > 4) {
        G("input_verify").value = G("input_verify").value.substring(0, 4);
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