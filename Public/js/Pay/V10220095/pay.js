var orderItemContainer = "order_item_container"; // 订购选项列表
var paymentContainer = "payment_container";      // 支付方式列表
var paymentDetail = "payment_detail";            // 支付方式详情

var monthlyRenewal = "monthly_renewal"; // 续包月按钮
var singleMonthly = "single_monthly";   // 单包月按钮
var singleYear = "single_year";         // 单包年按钮

var mobilePayment = "mobile_payment";   // 手机号支付
var billPayment = "bill_payment";       // 账单支付
var weChatPaymentSingleMonth = "we_chat_payment_single_month";  // 微信支付
var aliPaymentSingleMonth = "ali_payment_single_month";         // 支付包支付
var bestPaymentSingleMonth = "best_payment_single_month";       // 电信翼支付
var weChatPaymentSingleYear = "we_chat_payment_single_year";  // 微信支付
var aliPaymentSingleYear = "ali_payment_single_year";         // 支付包支付
var bestPaymentSingleYear = "best_payment_single_year";       // 电信翼支付

// 手机支付相关页面元素
var getCheckCode4Mobile = 'get_mobile_payment_check_code';
var phoneNumber = 'mobile_payment_phone';
var checkCode4Mobile = 'mobile_payment_check_code';
var commit4Mobile = 'mobile_payment_sure';
var cancelOfMobile = 'mobile_payment_cancel';

// 账单支付相关页面元素
var checkCode4Bill = 'bill_payment_check_code';
var commit4Bill = 'bill_payment_sure';
var cancelOfBill = 'bill_payment_cancel';

var weChatPaymentDetailBg = rootPath + '/Public/img/hd/Pay/V10220095/weChat_payment_detail.png'
var aliPaymentDetailBg = rootPath + '/Public/img/hd/Pay/V10220095/ali_payment_detail.png'
var bestPaymentDetailBg = rootPath + '/Public/img/hd/Pay/V10220095/best_payment_detail.png'

var weChatPayType = 1; // 微信支付订购标志
var aliPayType = 2; // 支付包支付订购标志
var bestPayType = 3; // 天翼支付订购标志

var paySuccessStatus = 1; // 支付成功状态码
var payFailStatus = 2; // 支付失败状态码
var payingStatus1 = 3; // 支付查询中状态码
var payingStatus2 = 4; // 支付查询中状态码

var orderListRender = {
    orderList: [
        {
            id: monthlyRenewal, // 节点ID
            configId: '29', // 对应管理后台配置的计费项ID
            LMTradeNo: '', // cws创建订单的订单号
            configOrderItem: null, // 管理后台配置内容
            isCreateOrder: false,  // 是否请求CWS创建订单
            customerRenew: '1', // 是否续订
            cycleType: '1', // 订购周期，包月
            fee: '',
            name: '续包月',
            imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/monthly_renewal.png',          // 节点显示图片
            imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/monthly_renewal_select.png',  // 节点显示图片
            imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/monthly_renewal_focus.png',     // 节点显示图片
            downToNext: singleMonthly,
            rightToNext: billPayment,
            isLoadedPaymentList: false, // 支付方式列表是否已经添加防止重复添加
            paymentListHTML: '',
            paymentList: [
                {
                    id: billPayment,
                    rightToNext: mobilePayment,
                    leftToNext: monthlyRenewal,
                    downToNext: checkCode4Bill,
                    imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/bill_payment.png',          // 节点显示图片
                    imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/bill_payment_focus.png',     // 节点显示图片
                    imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/bill_payment_select.png',  // 节点显示图片
                    onFocusChange: function (eventSource, hasFocus) {
                        if (hasFocus) {
                            billPaymentObj.show();
                            LMEPG.ButtonManager.setSelected(monthlyRenewal, true);
                            LMEPG.ButtonManager.setSelected(billPayment, false);
                        }
                    }
                },
                {
                    id: mobilePayment,
                    name: '手机号码支付',
                    leftToNext: billPayment,
                    downToNext: getCheckCode4Mobile,
                    imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/mobile_payment.png',          // 节点显示图片
                    imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/mobile_payment_focus.png',     // 节点显示图片
                    imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/mobile_payment_select.png',  // 节点显示图片
                    onFocusChange: function (eventSource, hasFocus) {
                        if (hasFocus) {
                            mobilePaymentObj.show();
                            LMEPG.ButtonManager.setSelected(mobilePayment, false);
                        }
                    }
                }
            ],
            onFocusChange: function (eventSource, hasFocus) {
                if (hasFocus) {
                    if (!eventSource.that.isCreateOrder) {
                        PayController.buildOrderInfo(eventSource.that.configId, function (data) { // 创建CWS订单
                            eventSource.that.LMTradeNo = data.tradeNo;
                            PayController.serviceOrder(eventSource.that.customerRenew, eventSource.that.cycleType, eventSource.that.configOrderItem.price, function (orderData) {
                                // 手机支付、账单支付设置相关数据
                                eventSource.that.isCreateOrder = true;
                                mobilePaymentObj.setData(orderData.orderId, orderData.fee);
                                billPaymentObj.setData(orderData.orderId, orderData.fee);
                                eventSource.that.onFocus();
                            })
                        })
                    } else {
                        eventSource.that.onFocus();
                    }
                } else {
                    LMEPG.ButtonManager.setSelected(billPayment, false);
                }
            },
            onFocus: function () {
                this.showPaymentList();
                billPaymentObj.show();
                LMEPG.ButtonManager.setSelected(monthlyRenewal, false);
                LMEPG.ButtonManager.setSelected(billPayment, true);
            },
            showPaymentList: function () {
                if (this.isLoadedPaymentList) {
                    G(paymentContainer).innerHTML = this.paymentListHTML;
                } else {
                    var _innerHtml = "";
                    var buttons = [];
                    for (var index = 0; index < this.paymentList.length; index++) {
                        var paymentItem = (this.paymentList)[index];
                        _innerHtml += '<img id="' + paymentItem.id + '" src="' + paymentItem.imageSrc + '"/>';
                        buttons.push({
                            id: paymentItem.id,
                            name: paymentItem.name,
                            type: 'img',
                            nextFocusRight: paymentItem.rightToNext ? paymentItem.rightToNext : '',
                            nextFocusDown: paymentItem.downToNext ? paymentItem.downToNext : '',
                            nextFocusLeft: paymentItem.leftToNext ? paymentItem.leftToNext : '',
                            backgroundImage: paymentItem.imageSrc,
                            focusImage: paymentItem.imageFocusSrc,
                            selectedImage: paymentItem.imageSelectedSrc,
                            click: '',
                            // beforeMoveChange: orderItem.moveToNext,
                            focusChange: paymentItem.onFocusChange,
                        })
                    }
                    LMEPG.ButtonManager.addButtons(buttons);
                    G(paymentContainer).innerHTML = _innerHtml;
                    this.paymentListHTML = _innerHtml;
                    this.isLoadedPaymentList = true;
                }
            },
            moveToNext: function (moveDirection, eventSource) {

            },
        },
        {
            id: singleMonthly, // 节点ID
            configId: '28', // 对应管理后台配置的计费项ID
            configOrderItem: null, // 管理后台配置内容
            name: '单包月',
            isCreateOrder: false,  // 是否请求CWS创建订单
            customerRenew: '0', // 是否续订
            cycleType: '1', // 订购周期，包月
            fee: '',
            imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/single_monthly.png',          // 节点显示图片
            imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/single_monthly_select.png',  // 节点显示图片
            imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/single_monthly_focus.png',     // 节点显示图片
            upToNext: monthlyRenewal,
            downToNext: singleYear,
            rightToNext: weChatPaymentSingleMonth,
            isLoadedPaymentList: false, // 支付方式列表是否已经添加防止重复添加
            paymentListHTML: '',
            paymentList: [
                {
                    id: weChatPaymentSingleMonth,
                    leftToNext: singleMonthly,
                    rightToNext: aliPaymentSingleMonth,
                    imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/weChat_payment.png',          // 节点显示图片
                    imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/weChat_payment_focus.png',     // 节点显示图片
                    imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/weChat_payment_select.png',  // 节点显示图片
                    onFocusChange: function (eventSource, hasFocus) {
                        if (hasFocus) {
                            LMEPG.ButtonManager.setSelected(singleMonthly, true);
                            weChatPayment4SingleMonth.show();
                        }
                    }
                }, {
                    id: aliPaymentSingleMonth,
                    leftToNext: weChatPaymentSingleMonth,
                    rightToNext: bestPaymentSingleMonth,
                    imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/ali_payment.png',          // 节点显示图片
                    imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/ali_payment_focus.png',     // 节点显示图片
                    imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/ali_payment_select.png',  // 节点显示图片
                    onFocusChange: function (eventSource, hasFocus) {
                        if (hasFocus) {
                            aliPayment4SingleMonth.show();
                        }
                    }
                }, {
                    id: bestPaymentSingleMonth,
                    leftToNext: aliPaymentSingleMonth,
                    imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/best_payment.png',          // 节点显示图片
                    imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/best_payment_focus.png',     // 节点显示图片
                    imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/best_payment_select.png',  // 节点显示图片
                    onFocusChange: function (eventSource, hasFocus) {
                        if (hasFocus) {
                            bestPayment4SingleMonth.show();
                        }
                    }
                }
            ],
            onFocusChange: function (eventSource, hasFocus) {
                if (hasFocus) {
                    if (!eventSource.that.isCreateOrder) {
                        PayController.buildOrderInfo(eventSource.that.configId, function (data) { // 创建CWS订单
                            eventSource.that.LMTradeNo = data.tradeNo;
                            PayController.serviceOrder(eventSource.that.customerRenew, eventSource.that.cycleType, eventSource.that.configOrderItem.price, function (orderData) {
                                // 手机支付、账单支付设置相关数据
                                eventSource.that.isCreateOrder = true;
                                var qrCodeCommonUrl = RenderParam.extraData.qrCodeCommonUrl;
                                weChatPayment4SingleMonth.setData(orderData.orderId, orderData.fee, qrCodeCommonUrl + orderData.wechatQrUrl);
                                aliPayment4SingleMonth.setData(orderData.orderId, orderData.fee, qrCodeCommonUrl + orderData.fusionpayQrUrl);
                                bestPayment4SingleMonth.setData(orderData.orderId, orderData.fee, qrCodeCommonUrl + orderData.bestpayQrUrl);
                                eventSource.that.onFocus();
                            })
                        })
                    } else {
                        eventSource.that.onFocus();
                    }
                } else {
                    LMEPG.ButtonManager.setSelected(weChatPaymentSingleMonth, false);
                }
            },

            onFocus: function () {
                this.showPaymentList();
                weChatPayment4SingleMonth.show();
                LMEPG.ButtonManager.setSelected(singleMonthly, false);
                LMEPG.ButtonManager.setSelected(weChatPaymentSingleMonth, true);
            },

            showPaymentList: function () {
                if (this.isLoadedPaymentList) {
                    G(paymentContainer).innerHTML = this.paymentListHTML;
                } else {
                    var _innerHtml = "";
                    var buttons = [];
                    for (var index = 0; index < this.paymentList.length; index++) {
                        var paymentItem = (this.paymentList)[index];
                        _innerHtml += '<img id="' + paymentItem.id + '" src="' + paymentItem.imageSrc + '"/>';
                        buttons.push({
                            id: paymentItem.id,
                            name: paymentItem.name,
                            type: 'img',
                            nextFocusRight: paymentItem.rightToNext ? paymentItem.rightToNext : '',
                            nextFocusDown: paymentItem.downToNext ? paymentItem.downToNext : '',
                            nextFocusLeft: paymentItem.leftToNext ? paymentItem.leftToNext : '',
                            backgroundImage: paymentItem.imageSrc,
                            focusImage: paymentItem.imageFocusSrc,
                            selectedImage: paymentItem.imageSelectedSrc,
                            click: '',
                            // beforeMoveChange: orderItem.moveToNext,
                            focusChange: paymentItem.onFocusChange,
                        })
                    }
                    LMEPG.ButtonManager.addButtons(buttons);
                    G(paymentContainer).innerHTML = _innerHtml;
                    this.paymentListHTML = _innerHtml;
                    this.isLoadedPaymentList = true;
                }
            },
            moveToNext: function (moveDirection, eventSource) {

            },
        },
        {
            id: singleYear, // 节点ID
            configId: '30', // 对应管理后台配置的计费项ID
            configOrderItem: null, // 管理后台配置内容
            name: '单包年',
            isCreateOrder: false,  // 是否请求CWS创建订单
            customerRenew: '0', // 是否续订
            cycleType: '4', // 订购周期，包年
            fee: '',
            imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/single_year.png',          // 节点显示图片
            imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/single_year_select.png',  // 节点显示图片
            imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/single_year_focus.png',     // 节点显示图片
            upToNext: singleMonthly,
            rightToNext: weChatPaymentSingleYear,
            isLoadedPaymentList: false, // 支付方式列表是否已经添加防止重复添加
            paymentListHTML: '',
            paymentList: [
                {
                    id: weChatPaymentSingleYear,
                    leftToNext: singleYear,
                    rightToNext: aliPaymentSingleYear,
                    imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/weChat_payment.png',          // 节点显示图片
                    imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/weChat_payment_focus.png',     // 节点显示图片
                    imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/weChat_payment_select.png',  // 节点显示图片
                    onFocusChange: function (eventSource, hasFocus) {
                        if (hasFocus) {
                            LMEPG.ButtonManager.setSelected(singleYear, true);
                            weChatPayment4SingleYear.show();
                        }
                    }
                }, {
                    id: aliPaymentSingleYear,
                    leftToNext: weChatPaymentSingleYear,
                    rightToNext: bestPaymentSingleYear,
                    imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/ali_payment.png',          // 节点显示图片
                    imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/ali_payment_focus.png',     // 节点显示图片
                    imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/ali_payment_select.png',  // 节点显示图片
                    onFocusChange: function (eventSource, hasFocus) {
                        if (hasFocus) {
                            aliPayment4SingleYear.show();
                        }
                    }
                }, {
                    id: bestPaymentSingleYear,
                    leftToNext: aliPaymentSingleYear,
                    imageSrc: rootPath + '/Public/img/hd/Pay/V10220095/best_payment.png',          // 节点显示图片
                    imageFocusSrc: rootPath + '/Public/img/hd/Pay/V10220095/best_payment_focus.png',     // 节点显示图片
                    imageSelectedSrc: rootPath + '/Public/img/hd/Pay/V10220095/best_payment_select.png',  // 节点显示图片
                    onFocusChange: function (eventSource, hasFocus) {
                        if (hasFocus) {
                            bestPayment4SingleYear.show();
                        }
                    }
                }
            ],
            showPaymentList: function () {
                if (this.isLoadedPaymentList) {
                    G(paymentContainer).innerHTML = this.paymentListHTML;
                } else {
                    var _innerHtml = "";
                    var buttons = [];
                    for (var index = 0; index < this.paymentList.length; index++) {
                        var paymentItem = (this.paymentList)[index];
                        _innerHtml += '<img id="' + paymentItem.id + '" src="' + paymentItem.imageSrc + '"/>';
                        buttons.push({
                            id: paymentItem.id,
                            name: paymentItem.name,
                            type: 'img',
                            nextFocusRight: paymentItem.rightToNext ? paymentItem.rightToNext : '',
                            nextFocusDown: paymentItem.downToNext ? paymentItem.downToNext : '',
                            nextFocusLeft: paymentItem.leftToNext ? paymentItem.leftToNext : '',
                            backgroundImage: paymentItem.imageSrc,
                            focusImage: paymentItem.imageFocusSrc,
                            selectedImage: paymentItem.imageSelectedSrc,
                            click: '',
                            // beforeMoveChange: orderItem.moveToNext,
                            focusChange: paymentItem.onFocusChange,
                        })
                    }
                    LMEPG.ButtonManager.addButtons(buttons);
                    G(paymentContainer).innerHTML = _innerHtml;
                    this.paymentListHTML = _innerHtml;
                    this.isLoadedPaymentList = true;
                }
            },

            onFocusChange: function (eventSource, hasFocus) {
                if (hasFocus) {
                    if (!eventSource.that.isCreateOrder) {
                        PayController.buildOrderInfo(eventSource.that.configId, function (data) { // 创建CWS订单
                            eventSource.that.LMTradeNo = data.tradeNo;
                            PayController.serviceOrder(eventSource.that.customerRenew, eventSource.that.cycleType, eventSource.that.configOrderItem.price, function (orderData) {
                                // 手机支付、账单支付设置相关数据
                                eventSource.that.isCreateOrder = true;
                                var qrCodeCommonUrl = RenderParam.extraData.qrCodeCommonUrl;
                                weChatPayment4SingleYear.setData(orderData.orderId, orderData.fee, qrCodeCommonUrl + orderData.wechatQrUrl);
                                aliPayment4SingleYear.setData(orderData.orderId, orderData.fee, qrCodeCommonUrl + orderData.fusionpayQrUrl);
                                bestPayment4SingleYear.setData(orderData.orderId, orderData.fee, qrCodeCommonUrl + orderData.bestpayQrUrl);
                                eventSource.that.onFocus();
                            })
                        })
                    } else {
                        eventSource.that.onFocus();
                    }
                } else {
                    LMEPG.ButtonManager.setSelected(weChatPaymentSingleYear, false);
                }
            },

            moveToNext: function (moveDirection, eventSource) {

            },

            onFocus: function () {
                this.showPaymentList();
                weChatPayment4SingleYear.show();
                LMEPG.ButtonManager.setSelected(singleYear, false);
                LMEPG.ButtonManager.setSelected(weChatPaymentSingleYear, true);
            }
        }
    ],

    showOrderList: function (productData) {
        var _innerHtml = "";
        var buttons = [];
        for (var index = 0; index < orderListRender.orderList.length; index++) {
            var orderItem = (orderListRender.orderList)[index];
            var configOrderItem = PayController.getOrderItemById(orderItem.configId);
            configOrderItem.price = PayController.getOrderItemFee(productData.products[0].fees, orderItem.cycleType, orderItem.customerRenew);
            orderItem.configOrderItem = configOrderItem; // 设置配置选项
            _innerHtml += '<div id="' + orderItem.id + '" style="background-image: url(' + orderItem.imageSrc + ')">';
            _innerHtml += '<div class="order_price">' + configOrderItem.price / 100 + '</div>';
            _innerHtml += '</div>';
            buttons.push({
                id: orderItem.id,
                name: orderItem.name,
                type: 'div',
                nextFocusRight: orderItem.rightToNext,
                nextFocusDown: orderItem.downToNext ? orderItem.downToNext : '',
                nextFocusUp: orderItem.upToNext ? orderItem.upToNext : '',
                backgroundImage: orderItem.imageSrc,
                focusImage: orderItem.imageFocusSrc,
                selectedImage: orderItem.imageSelectedSrc,
                click: '',
                beforeMoveChange: orderItem.moveToNext,
                focusChange: orderItem.onFocusChange,
                that: orderItem,
            });
        }
        G(orderItemContainer).innerHTML = _innerHtml;
        LMEPG.ButtonManager.init(monthlyRenewal, buttons, '', true);
    },

    getOrderItemById: function (orderItemId) {
        for (var index = 0; index < this.orderList.length; index++) {
            if (orderItemId === this.orderList[index].id) {
                return this.orderList[index];
            }
        }
    }
};

var mobilePaymentObj = {
    isSendSMS: false,
    userPhone: '',
    countdown: 60, // 短信验证码倒计时时长
    checkCodeInterval: null, // 短信验证码倒计时计时器
    payType: 6, // 手机支付类型标识

    isLoadedPaymentDetail: false,
    paymentDetailHTML: '',
    backgroundImage: rootPath + '/Public/img/hd/Pay/V10220095/mobile_payment_detail.png',
    sureSrc: rootPath + '/Public/img/hd/Pay/V10220095/payment_sure.png',
    cancelSrc: rootPath + '/Public/img/hd/Pay/V10220095/payment_cancel.png',

    orderId: '', // 订单Id
    fee: '', // 支付费用

    setData: function (orderId, fee) {
        this.orderId = orderId;
        this.fee = fee;
    },

    show: function () {
        if (this.isLoadedPaymentDetail) {
            var getCheckCodeBg = G(getCheckCode4Mobile).style.backgroundImage;
            G(paymentDetail).innerHTML = this.paymentDetailHTML;
            G(getCheckCode4Mobile).style.backgroundImage = getCheckCodeBg;
        } else {
            // 支付价格
            var _innerHTML = '<div id="mobile_payment_price">' + this.fee / 100 + '</div>'
            _innerHTML += '<div id="' + phoneNumber + '">请输入正确的手机号</div>';
            _innerHTML += '<div id="' + getCheckCode4Mobile + '"><div id="count_down"></div></div>';
            _innerHTML += '<div id="' + checkCode4Mobile + '"></div>';
            _innerHTML += '<img id="' + commit4Mobile + '" src="' + this.sureSrc + '"/>';
            _innerHTML += '<img id="' + cancelOfMobile + '" src="' + this.cancelSrc + '"/>';

            G(paymentDetail).innerHTML = _innerHTML;
            this.paymentDetailHTML = _innerHTML;
            this.isLoadedPaymentDetail = true;

            this.addButtons();
        }
        G(paymentDetail).style.backgroundImage = 'url("' + this.backgroundImage + '")';
    },

    addButtons: function () {
        var _buttons = [{
            id: getCheckCode4Mobile,
            name: '手机支付-获取验证码',
            type: 'div',
            nextFocusUp: mobilePayment,
            nextFocusDown: checkCode4Mobile,
            nextFocusLeft: phoneNumber,
            backgroundImage: rootPath + '/Public/img/hd/Pay/V10220095/get_check_code.png',
            focusImage: rootPath + '/Public/img/hd/Pay/V10220095/get_check_code_focus.png',
            limitImage: rootPath + '/Public/img/hd/Pay/V10220095/get_check_code_limit.png',
            click: this.onGetCheckCodeClick,
            focusChange: this.onGetCheckCodeFocus,
        }, {
            id: checkCode4Mobile,
            name: '手机支付-验证码',
            type: 'div',
            nextFocusDown: commit4Mobile,
            nextFocusUp: getCheckCode4Mobile,
            backgroundImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_check_code.png',
            focusImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_check_code_focus.png',
            click: this.onCheckCodeClick,
        }, {
            id: commit4Mobile,
            name: '手机支付-确定',
            type: 'img',
            nextFocusUp: checkCode4Mobile,
            nextFocusRight: cancelOfMobile,
            backgroundImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_sure.png',
            focusImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_sure_focus.png',
            click: this.onCommitClick,
        }, {
            id: cancelOfMobile,
            name: '手机支付-取消',
            type: 'img',
            nextFocusUp: checkCode4Mobile,
            nextFocusLeft: commit4Mobile,
            backgroundImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_cancel.png',
            focusImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_cancel_focus.png',
            click: this.onCancelClick,
        }, {
            id: phoneNumber,
            name: '手机支付-输入手机号',
            type: 'div',
            focusChange: this.onPhoneNumberFocus,
        }];
        LMEPG.ButtonManager.addButtons(_buttons);
    },

    onGetCheckCodeClick: function (eventSource) {
        if (!mobilePaymentObj.isSendSMS) {
            LMEPG.UI.forbidDoubleClickBtn(function () { // 防止连续点击操作
                var userPhone = G(phoneNumber).innerHTML;
                if (LMEPG.Func.isTelPhoneMatched(userPhone)) {
                    mobilePaymentObj.userPhone = userPhone; // 保存电话号码
                    LMEPG.UI.showWaitingDialog();
                    LMEPG.ajax.postAPI('Pay/getCheckCode', {
                        'userPhone': userPhone,
                    }, function (data) {
                        LMEPG.UI.dismissWaitingDialog();
                        data = typeof data == 'string' ? JSON.parse(data) : data;
                        if (data.code == 0) {
                            mobilePaymentObj.onGetCheckCodeSuccess();
                        } else {
                            LMEPG.UI.showToast("获取短信验证码失败," + data.msg);
                        }
                    }, function (errData) {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("服务器获取短信验证码失败！！");
                        LMEPG.Log.error("pay.js::onGetCheckCodeClick, error = " + errData);
                    });
                } else {
                    // 提示输入有效的手机号
                    LMEPG.UI.showToast("请输入有效的手机号码", 3);
                }
            }, 500);
        }
    },

    onGetCheckCodeSuccess: function () {
        this.isSendSMS = true;
        this.countdown = 60;
        G('count_down').innerHTML = "" + this.countdown;
        var unableImagePath = rootPath + '/Public/img/hd/Pay/V10220095/get_check_code_limit.png';
        G(getCheckCode4Mobile).style.backgroundImage = 'url("' + unableImagePath + '")';
        var checkCodeBtn = LMEPG.ButtonManager.getButtonById(getCheckCode4Mobile);
        checkCodeBtn.backgroundImage = unableImagePath;
        checkCodeBtn.focusImage = unableImagePath;
        mobilePaymentObj.checkCodeInterval = setInterval(function () {
            mobilePaymentObj.countdown -= 1;
            G('count_down').innerHTML = mobilePaymentObj.countdown + "";
            if (mobilePaymentObj.countdown <= 0) {
                mobilePaymentObj.resetCheckCode(checkCodeBtn);
            }
        }, 1000);
    },

    resetCheckCode: function (checkCodeBtn) {
        var normalImage = 'url("' + rootPath + '/Public/img/hd/Pay/V10220095/get_check_code.png")';
        var focusImage = 'url("' + rootPath + '/Public/img/hd/Pay/V10220095/get_check_code_focus.png")';
        clearInterval(this.checkCodeInterval);
        this.isSendSMS = false;
        if (LMEPG.ButtonManager.getCurrentButton.id == getCheckCode4Mobile) { // 判断当前焦点
            G(getCheckCode4Mobile).style.backgroundImage = focusImage;
        } else {
            G(getCheckCode4Mobile).style.backgroundImage = normalImage;
        }
        G('count_down').innerHTML = '';
        checkCodeBtn.backgroundImage = rootPath + '/Public/img/hd/Pay/V10220095/get_check_code.png';
        checkCodeBtn.focusImage = rootPath + '/Public/img/hd/Pay/V10220095/get_check_code_focus.png';
    },

    onGetCheckCodeFocus: function (eventSource, hasFocus) {
        if (hasFocus) {
            LMEPG.ButtonManager.setSelected(mobilePayment, true);
        }
    },

    onCheckCodeClick: function (eventSource) {
        // 弹出小键盘
        var keyBoardLeft = 544;
        var keyBoardTop = 398;
        LMEPG.UI.keyboard.show(keyBoardLeft, keyBoardTop, eventSource.id, 4, commit4Mobile);
        // G(eventSource.id).style.backgroundImage = 'url("' + rootPath + '/Public/img/hd/Pay/V10220095/payment_check_code_focus.png")'
    },

    onCommitClick: function (eventSource) {
        var checkCode = G(checkCode4Mobile).innerHTML;
        if (checkCode) {
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Pay/payByPhone', {
                'orderId': mobilePaymentObj.orderId,
                'payType': mobilePaymentObj.payType,
                'userPhone': mobilePaymentObj.userPhone,
                'checkCode': checkCode
            }, function (data) {
                LMEPG.UI.dismissWaitingDialog();
                data = typeof data == 'string' ? JSON.parse(data) : data;
                if (data.code == 0) {
                    PayController.uploadResult(mobilePaymentObj.payType, monthlyRenewal);
                } else {
                    LMEPG.UI.showToast("手机支付失败," + data.msg);
                }
            }, function (errData) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("服务器手机支付证码失败！！");
                LMEPG.Log.error("pay.js::mobilePaymentObj::onCommitClick, error = " + errData);
            });
        } else {
            LMEPG.UI.showToast("请输入验证码");
        }
    },

    onCancelClick: function (eventSource) {
        LMEPG.Intent.back();
    },

    onPhoneNumberFocus: function (eventSource, hasFocus) {
        if (hasFocus) {
            var keyBoardLeft = 544;
            var keyBoardTop = 398;
            LMEPG.UI.keyboard.show(keyBoardLeft, keyBoardTop, eventSource.id, 11, getCheckCode4Mobile);
        }
    }

};

var billPaymentObj = {
    checkCode: '', // 生成的随机验证码
    checkCodeLength: 4, // 验证码长度
    payType: 4, // 订购类型

    isLoadedPaymentDetail: false,
    paymentDetailHTML: '',
    backgroundImage: rootPath + '/Public/img/hd/Pay/V10220095/bill_payment_detail.png',
    sureSrc: rootPath + '/Public/img/hd/Pay/V10220095/payment_sure.png',
    cancelSrc: rootPath + '/Public/img/hd/Pay/V10220095/payment_cancel.png',

    orderId: '', // 订单Id
    fee: '', // 支付费用

    setData: function (orderId, fee) {
        this.orderId = orderId;
        this.fee = fee;
    },

    show: function () {
        if (this.isLoadedPaymentDetail) {
            G(paymentDetail).innerHTML = this.paymentDetailHTML;
        } else {
            this.createCheckCode();
            var _innerHTML = '<div id="payment_check_code_text">' + this.checkCode + '</div>'
            _innerHTML += '<div id="' + checkCode4Bill + '"></div>';
            _innerHTML += '<img id="' + commit4Bill + '" src="' + this.sureSrc + '"/>';
            _innerHTML += '<img id="' + cancelOfBill + '" src="' + this.cancelSrc + '"/>';

            G(paymentDetail).innerHTML = _innerHTML;
            this.paymentDetailHTML = _innerHTML;
            this.isLoadedPaymentDetail = true;

            this.addButtons();

        }
        G(paymentDetail).style.backgroundImage = 'url("' + this.backgroundImage + '")';
    },

    addButtons: function () {
        var _buttons = [{
            id: checkCode4Bill,
            name: '账单支付-验证码',
            type: 'div',
            nextFocusDown: commit4Bill,
            nextFocusUp: billPayment,
            backgroundImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_check_code.png',
            focusImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_check_code_focus.png',
            click: this.onCheckCodeClick,
            focusChange: this.onCheckCodeFocus,
        }, {
            id: commit4Bill,
            name: '账单支付-确定',
            type: 'img',
            nextFocusUp: checkCode4Bill,
            nextFocusRight: cancelOfBill,
            backgroundImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_sure.png',
            focusImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_sure_focus.png',
            click: this.onCommitClick,
        }, {
            id: cancelOfBill,
            name: '账单支付-取消',
            type: 'img',
            nextFocusUp: checkCode4Bill,
            nextFocusLeft: commit4Bill,
            backgroundImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_cancel.png',
            focusImage: rootPath + '/Public/img/hd/Pay/V10220095/payment_cancel_focus.png',
            click: this.onCancelClick,
        }];
        LMEPG.ButtonManager.addButtons(_buttons);
    },

    createCheckCode: function () {
        var checkCode = "";
        for (var i = 0; i < this.checkCodeLength; i++) {
            checkCode += Math.floor(Math.random() * 10)
        }
        this.checkCode = checkCode;
    },

    resetCheckCode: function () {
        billPaymentObj.createCheckCode();
        G("payment_check_code_text").innerHTML = this.checkCode;
    },

    onCheckCodeFocus: function (eventSource, hasFocus) {
        if (hasFocus) {
            LMEPG.ButtonManager.setSelected(billPayment, true);
        }
    },

    onCheckCodeClick: function (eventSource) {
        // 弹出小键盘
        var keyBoardLeft = 544;
        var keyBoardTop = 398;
        LMEPG.UI.keyboard.show(keyBoardLeft, keyBoardTop, eventSource.id, 4, commit4Bill);
        // G(eventSource.id).style.backgroundImage = 'url("' + rootPath + '/Public/img/hd/Pay/V10220095/payment_check_code_focus.png")'
    },

    onCommitClick: function (eventSource) {
        var inputVal = G(checkCode4Bill).innerHTML;
        if (inputVal.trim() === "") {
            LMEPG.UI.showToast("验证码不能为空，请重试~");
        } else if (inputVal == billPaymentObj.checkCode) {
            // 执行订购操作
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Pay/payByBill', {
                'orderId': billPaymentObj.orderId,
                'payType': billPaymentObj.payType,
            }, function (data) {
                LMEPG.UI.dismissWaitingDialog();
                data = typeof data == 'string' ? JSON.parse(data) : data;
                if (data.code == 0) {
                    PayController.uploadResult(billPaymentObj.payType, monthlyRenewal);
                } else {
                    LMEPG.UI.showToast("账单支付失败," + data.msg);
                }
            }, function (errData) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("服务器账单支付证码失败！！");
                LMEPG.Log.error("pay.js::billPaymentObj::onCommitClick, error = " + errData);
            });
        } else {
            LMEPG.UI.showToast("验证码输入错误", 3);
            billPaymentObj.resetCheckCode();
        }
    },

    onCancelClick: function (eventSource) {
        LMEPG.Intent.back();
    },

};

var weChatPayment4SingleMonth = {
    backgroundImage: weChatPaymentDetailBg,
    orderId: '', // 订单ID
    fee: '', // 订单费用
    QRCodeImageUrl: '', // 二维码图片

    isQueryOrderStatus: false, // 是否开始查询订购结果
    orderStatusTimer: null, // 订购查询定时器

    setData: function (orderId, fee, QRCodeImageUrl) {
        this.orderId = orderId;
        this.fee = fee;
        this.QRCodeImageUrl = QRCodeImageUrl;
    },

    show: function () {
        var _innerHTML = '<div class="third_party_payment_price">' + this.fee / 100 + '</div>'
        _innerHTML += '<img class="payment_qr_code" src="' + this.QRCodeImageUrl + '"/>';
        G(paymentDetail).innerHTML = _innerHTML;
        G(paymentDetail).style.backgroundImage = 'url("' + this.backgroundImage + '")';
        if (!this.isQueryOrderStatus) {
            this.queryPayResult();
        }
    },

    queryPayResult: function () {
        LMEPG.ajax.postAPI('Pay/queryOrderStatus', {
            'orderId': weChatPayment4SingleMonth.orderId,
        }, function (data) {
            data = typeof data == 'string' ? JSON.parse(data) : data;
            if (data.code == 0) {
                weChatPayment4SingleMonth.queryPayResultSuccess(data);
            } else {
                LMEPG.UI.showToast("查询订单结果失败," + data.msg);
            }
        }, function (errData) {
            LMEPG.UI.showToast("服务器查询订单失败！！");
            LMEPG.Log.error("pay.js::weChatPayment4SingleMonth::queryPayResult, error = " + errData);
        });
    },

    queryPayResultSuccess: function (data) {
        this.isQueryOrderStatus = true;
        switch (data.status) {
            case paySuccessStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                PayController.uploadResult(weChatPayType, singleMonthly);
                break;
            case payFailStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                LMEPG.UI.showToast("支付失败", 3);
                break;
            case payingStatus1:
            case payingStatus2:
                this.orderStatusTimer = setTimeout(function () {
                    weChatPayment4SingleMonth.queryPayResult();
                }, 3 * 1000);
                break;
        }
    }
};

var aliPayment4SingleMonth = {
    backgroundImage: aliPaymentDetailBg,
    orderId: '', // 订单ID
    fee: '', // 订单费用
    QRCodeImageUrl: '', // 二维码图片

    isQueryOrderStatus: false, // 是否开始查询订购结果
    orderStatusTimer: null, // 订购查询定时器

    setData: function (orderId, fee, QRCodeImageUrl) {
        this.orderId = orderId;
        this.fee = fee;
        this.QRCodeImageUrl = QRCodeImageUrl;
    },

    show: function () {
        var _innerHTML = '<div class="third_party_payment_price">' + this.fee / 100 + '</div>'
        _innerHTML += '<img class="payment_qr_code" src="' + this.QRCodeImageUrl + '" />';
        G(paymentDetail).innerHTML = _innerHTML;
        G(paymentDetail).style.backgroundImage = 'url("' + this.backgroundImage + '")';
        if (!this.isQueryOrderStatus) {
            this.queryPayResult();
        }
    },

    queryPayResult: function () {
        LMEPG.ajax.postAPI('Pay/queryOrderStatus', {
            'orderId': aliPayment4SingleMonth.orderId,
        }, function (data) {
            data = typeof data == 'string' ? JSON.parse(data) : data;
            if (data.code == 0) {
                aliPayment4SingleMonth.queryPayResultSuccess(data);
            } else {
                LMEPG.UI.showToast("查询订单结果失败," + data.msg);
            }
        }, function (errData) {
            LMEPG.UI.showToast("服务器查询订单失败！！");
            LMEPG.Log.error("pay.js::aliPayment4SingleMonth::queryPayResult, error = " + errData);
        });
    },

    queryPayResultSuccess: function (data) {
        this.isQueryOrderStatus = true;
        switch (data.status) {
            case paySuccessStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                PayController.uploadResult(aliPayType, singleMonthly);
                break;
            case payFailStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                LMEPG.UI.showToast("支付失败", 3);
                break;
            case payingStatus1:
            case payingStatus2:
                this.orderStatusTimer = setTimeout(function () {
                    aliPayment4SingleMonth.queryPayResult();
                }, 3 * 1000);
                break;
        }
    }
};

var bestPayment4SingleMonth = {
    backgroundImage: bestPaymentDetailBg,
    orderId: '', // 订单ID
    fee: '', // 订单费用
    QRCodeImageUrl: '', // 二维码图片

    isQueryOrderStatus: false, // 是否开始查询订购结果
    orderStatusTimer: null, // 订购查询定时器

    setData: function (orderId, fee, QRCodeImageUrl) {
        this.orderId = orderId;
        this.fee = fee;
        this.QRCodeImageUrl = QRCodeImageUrl;
    },

    show: function () {
        var _innerHTML = '<div class="third_party_payment_price">' + this.fee / 100 + '</div>'
        _innerHTML += '<img class="payment_qr_code" src="' + this.QRCodeImageUrl + '" />';
        G(paymentDetail).innerHTML = _innerHTML;
        G(paymentDetail).style.backgroundImage = 'url("' + this.backgroundImage + '")';
        if (!this.isQueryOrderStatus) {
            this.queryPayResult();
        }
    },

    queryPayResult: function () {
        LMEPG.ajax.postAPI('Pay/queryOrderStatus', {
            'orderId': bestPayment4SingleMonth.orderId,
        }, function (data) {
            data = typeof data == 'string' ? JSON.parse(data) : data;
            if (data.code == 0) {
                bestPayment4SingleMonth.queryPayResultSuccess(data);
            } else {
                LMEPG.UI.showToast("查询订单结果失败," + data.msg);
            }
        }, function (errData) {
            LMEPG.UI.showToast("服务器查询订单失败！！");
            LMEPG.Log.error("pay.js::bestPayment4SingleMonth::queryPayResult, error = " + errData);
        });
    },

    queryPayResultSuccess: function (data) {
        this.isQueryOrderStatus = true;
        switch (data.status) {
            case paySuccessStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                PayController.uploadResult(bestPayType, singleMonthly);
                break;
            case payFailStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                LMEPG.UI.showToast("支付失败", 3);
                break;
            case payingStatus1:
            case payingStatus2:
                this.orderStatusTimer = setTimeout(function () {
                    bestPayment4SingleMonth.queryPayResult();
                }, 3 * 1000);
                break;
        }
    }
};

var weChatPayment4SingleYear = {
    backgroundImage: weChatPaymentDetailBg,
    orderId: '', // 订单ID
    fee: '', // 订单费用
    QRCodeImageUrl: '', // 二维码图片

    isQueryOrderStatus: false, // 是否开始查询订购结果
    orderStatusTimer: null, // 订购查询定时器

    setData: function (orderId, fee, QRCodeImageUrl) {
        this.orderId = orderId;
        this.fee = fee;
        this.QRCodeImageUrl = QRCodeImageUrl;
    },

    show: function () {
        var _innerHTML = '<div class="third_party_payment_price">' + this.fee / 100 + '</div>'
        _innerHTML += '<img class="payment_qr_code" src="' + this.QRCodeImageUrl + '"/>';
        G(paymentDetail).innerHTML = _innerHTML;
        G(paymentDetail).style.backgroundImage = 'url("' + this.backgroundImage + '")';
        if (!this.isQueryOrderStatus) {
            this.queryPayResult();
        }
    },

    queryPayResult: function () {
        LMEPG.ajax.postAPI('Pay/queryOrderStatus', {
            'orderId': weChatPayment4SingleYear.orderId,
        }, function (data) {
            data = typeof data == 'string' ? JSON.parse(data) : data;
            if (data.code == 0) {
                weChatPayment4SingleYear.queryPayResultSuccess(data);
            } else {
                LMEPG.UI.showToast("查询订单结果失败," + data.msg);
            }
        }, function (errData) {
            LMEPG.UI.showToast("服务器查询订单失败！！");
            LMEPG.Log.error("pay.js::weChatPayment4SingleYear::queryPayResult, error = " + errData);
        });
    },

    queryPayResultSuccess: function (data) {
        this.isQueryOrderStatus = true;
        switch (data.status) {
            case paySuccessStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                PayController.uploadResult(weChatPayType, singleYear);
                break;
            case payFailStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                LMEPG.UI.showToast("支付失败", 3);
                break;
            case payingStatus1:
            case payingStatus2:
                this.orderStatusTimer = setTimeout(function () {
                    weChatPayment4SingleYear.queryPayResult();
                }, 3 * 1000);
                break;
        }
    }
};

var aliPayment4SingleYear = {
    backgroundImage: aliPaymentDetailBg,
    orderId: '', // 订单ID
    fee: '', // 订单费用
    QRCodeImageUrl: '', // 二维码图片

    isQueryOrderStatus: false, // 是否开始查询订购结果
    orderStatusTimer: null, // 订购查询定时器

    setData: function (orderId, fee, QRCodeImageUrl) {
        this.orderId = orderId;
        this.fee = fee;
        this.QRCodeImageUrl = QRCodeImageUrl;
    },

    show: function () {
        var _innerHTML = '<div class="third_party_payment_price">' + this.fee / 100 + '</div>'
        _innerHTML += '<img class="payment_qr_code" src="' + this.QRCodeImageUrl + '" />';
        G(paymentDetail).innerHTML = _innerHTML;
        G(paymentDetail).style.backgroundImage = 'url("' + this.backgroundImage + '")';
        if (!this.isQueryOrderStatus) {
            this.queryPayResult();
        }
    },

    queryPayResult: function () {
        LMEPG.ajax.postAPI('Pay/queryOrderStatus', {
            'orderId': aliPayment4SingleYear.orderId,
        }, function (data) {
            data = typeof data == 'string' ? JSON.parse(data) : data;
            if (data.code == 0) {
                aliPayment4SingleYear.queryPayResultSuccess(data);
            } else {
                LMEPG.UI.showToast("查询订单结果失败," + data.msg);
            }
        }, function (errData) {
            LMEPG.UI.showToast("服务器查询订单结果失败！！");
            LMEPG.Log.error("pay.js::aliPayment4SingleYear::queryPayResult, error = " + errData);
        });
    },

    queryPayResultSuccess: function (data) {
        this.isQueryOrderStatus = true;
        switch (data.status) {
            case paySuccessStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                PayController.uploadResult(aliPayType, singleYear);
                break;
            case payFailStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                LMEPG.UI.showToast("支付失败", 3);
                break;
            case payingStatus1:
            case payingStatus2:
                this.orderStatusTimer = setTimeout(function () {
                    aliPayment4SingleYear.queryPayResult();
                }, 3 * 1000);
                break;
        }
    }
};

var bestPayment4SingleYear = {
    backgroundImage: bestPaymentDetailBg,
    orderId: '', // 订单ID
    fee: '', // 订单费用
    QRCodeImageUrl: '', // 二维码图片

    isQueryOrderStatus: false, // 是否开始查询订购结果
    orderStatusTimer: null, // 订购查询定时器

    setData: function (orderId, fee, QRCodeImageUrl) {
        this.orderId = orderId;
        this.fee = fee;
        this.QRCodeImageUrl = QRCodeImageUrl;
    },

    show: function () {
        var _innerHTML = '<div class="third_party_payment_price">' + this.fee / 100 + '</div>'
        _innerHTML += '<img class="payment_qr_code" src="' + this.QRCodeImageUrl + '" />';
        G(paymentDetail).innerHTML = _innerHTML;
        G(paymentDetail).style.backgroundImage = 'url("' + this.backgroundImage + '")';
        if (!this.isQueryOrderStatus) {
            this.queryPayResult();
        }
    },

    queryPayResult: function () {
        LMEPG.ajax.postAPI('Pay/queryOrderStatus', {
            'orderId': bestPayment4SingleYear.orderId,
        }, function (data) {
            data = typeof data == 'string' ? JSON.parse(data) : data;
            if (data.code == 0) {
                bestPayment4SingleYear.queryPayResultSuccess(data);
            } else {
                LMEPG.UI.showToast("查询订单结果失败," + data.msg);
            }
        }, function (errData) {
            LMEPG.UI.showToast("服务器查询订单结果失败！！");
            LMEPG.Log.error("pay.js::bestPayment4SingleYear::queryPayResult, error = " + errData);
        });
    },

    queryPayResultSuccess: function (data) {
        this.isQueryOrderStatus = true;
        switch (data.status) {
            case paySuccessStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                PayController.uploadResult(bestPayType, singleYear);
                break;
            case payFailStatus:
                if (this.orderStatusTimer) {
                    clearTimeout(this.orderStatusTimer);
                }
                LMEPG.UI.showToast("支付失败", 3);
                break;
            case payingStatus1:
            case payingStatus2:
                this.orderStatusTimer = setTimeout(function () {
                    bestPayment4SingleYear.queryPayResult();
                }, 3 * 1000);
                break;
        }
    }
};

var PayController = {
    init: function () {
        // 1、校验当前用户是否是vip
        // 2、校验是否获取订购项是否正常
        // 3、创建订购项列表
        PayController.getProductInfo();
    },

    /**
     * 根据配置ID找到管理后台配置的计费信息
     * @param configId 对应管理后台的配置Id
     */
    getOrderItemById: function (configId) {
        for (var index = 0; index < RenderParam.orderItems.length; index++) {
            var configItem = (RenderParam.orderItems)[index];
            if (configId === configItem.vip_id) {
                return configItem;
            }
        }
    },

    /**
     * 获取局方配置的套餐价格
     * @param fees 局方配置套餐计费信息
     * @param cycleType 包时⻓周期（1-⽉卡，2-季卡，3-半年卡，4-年卡，5-周卡，6-三⽇卡）
     * @param customRenew 是否续订
     */
    getOrderItemFee: function (fees, cycleType, customRenew) {
        var fee = 1;
        for (var i = 0; i < fees.length; i++) {
            var feeItem = fees[i];
            if (parseInt(cycleType) === feeItem.cycleType) { // 判断包月、包年
                if (parseInt(customRenew) === 1) { // 续包月 or 续包年
                    fee = feeItem.feeRenew;
                } else { // 包月 or 包年
                    fee = feeItem.fee;
                }
            }
        }
        return fee;
    },

    buildOrderInfo: function (orderItemId, callback) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Pay/getOrderTradeNo', {
            'orderItemId': orderItemId,
            'orderReason': RenderParam.orderReason,
            'orderRemark': RenderParam.remark,
            'orderType': RenderParam.orderType,
            'lmReason': RenderParam.lmReason
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (data.result == 0 && data.tradeNo !== '') {
                callback(data);
            } else {
                LMEPG.Log.info('PayController.buildOrderInfo()', '[buildOrderInfo][failed!]-->我方生成支付订单失败！' + JSON.stringify(data));
                if (RenderParam.isVip == 1) {
                    LMEPG.UI.showToast('您已经是会员', 3);
                } else {
                    LMEPG.UI.showToast('创建订单失败[' + data.result + ']', 3);
                }
            }
        }, function (errData) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("服务器创建订单出错！！");
            LMEPG.Log.error("pay.js::buildOrderInfo, error = " + errData);
        });
    },

    serviceOrder: function (customerRenew, cycleType, fee, callback) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Pay/serviceOrder', {
            'customerRenew': customerRenew,
            'cycleType': cycleType,
            'fee': fee,
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            data = typeof data == 'string' ? JSON.parse(data) : data;
            if (data.code == 0) {
                callback(data);
            } else {
                LMEPG.UI.showToast("生成订单失败," + data.msg);
            }
        }, function (errData) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("服务器生成订单失败！！");
            LMEPG.Log.error("pay.js::serviceOrder, error = " + errData);
        });
    },

    uploadResult: function (payType, orderItemId) {
        LMEPG.UI.showWaitingDialog();
        var orderItem = orderListRender.getOrderItemById(orderItemId);
        LMEPG.ajax.postAPI('Pay/uploadPayResult', {
            'lmVipId': orderItem.configOrderItem.vip_id,
            'lmVipType': orderItem.configOrderItem.vip_type,
            'contentName': orderItem.configOrderItem.goods_name,
            'lmTradeNo': orderItem.LMTradeNo,//我方生成的订单号，后面某个阶段会去cws请求它，先占位所有参数定义
            'renew': orderItem.customerRenew,  //是否续订
            'price': orderItem.configOrderItem.price,  //支付费用
            'payType': payType,// 支付类型
            'lmIsPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'lmRemark': RenderParam.remark,
            'lmReturnPageName': RenderParam.returnPageName,
            'lmReason': RenderParam.lmReason,
            'orderType': RenderParam.orderType
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("订购成功", 3, function () {
                LMEPG.Intent.back();
            });
        }, function (errData) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("服务器上报结果失败！！");
            LMEPG.Log.error("pay.js::uploadResult, error = " + errData);
        });
    },

    /**
     * 获取计费点相关信息
     */
    getProductInfo: function () {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Pay/getProductInfo', {}, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (data.code !== '0') {
                LMEPG.UI.showToast("获取产品信息失败，" + data.msg);
            } else {
                orderListRender.showOrderList(data);
            }
        }, function (errData) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("获取产品信息服务出错！");
        });
    }
}

window.onBack = function () {
    LMEPG.Intent.back();
}

