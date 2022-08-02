/********************************************************
 *  视图层
 * ******************************************************/
var PayView220001 = {
    imageUrl: ROOT + "/Public/img/hd/Pay/V220001/",
    defaultFocusId: 'order_package_1',

    // --- start 支付套餐页面 ---
    orderPackageContainerId: 'order_package_container',
    orderPackage1Id: 'order_package_1',
    orderPackage2Id: 'order_package_2',
    orderPackage3Id: 'order_package_3',
    // --- end 支付套餐页面 ---

    // --- start 支付方式页面 ---
    paymentContainerId: 'payment_container',
    // --- end 支付方式页面 ---

    // --- start 账号支付方式（续包月） ---
    billPayContainer1Id: "bill_payment_container1",
    accountInfo1Id: "account_info1",
    accountBal1Id: "account_balance1",
    productFee1Id: "product_fee1",
    btnBillSure1Id: "btn_bill_sure1",
    btnCharge1Id: "btn_charge1",
    // --- end 账号支付方式（续包月） ---

    multiPaymentContainerId: "multi_payment_container",
    wechatPaymentId: 'wechat_payment',
    aliPaymentId: 'ali_payment',
    billPaymentId: 'bill_payment',
    qrCodeNameId: 'qr_code_name',

    // --- start 二维码支付方式（单包月/包年） ---
    qrCodePaymentContentId: "QRCode_payment_content",
    packagePriceId: 'package_price',
    QRCodeId: 'qr_code',
    btnQRSureId: 'btn_qr_sure',
    btnQRCancelId: 'btn_qr_cancel',
    // --- start 二维码支付方式（单包月/包年） --

    // --- start 账号支付方式（单包月/包年） ---
    billPayContainer2Id: "bill_payment_container2",
    accountInfo2Id: "account_info2",
    accountBal2Id: "account_balance2",
    productFee2Id: "product_fee2",
    btnBillSure2Id: "btn_bill_sure2",
    btnCharge2Id: "btn_charge2",
    // --- end 账号支付方式（单包月/包年） ---

    // --- start 验证码 ---
    checkCodeContainerId: 'check_code_container',
    checkCodeTitleId: 'check_code_title',
    checkCodeTipsId: 'check_code_tips',
    checkCodeId: 'check_code',
    btnCheckSureId: 'btn_check_sure',
    btnCheckCancelId: 'btn_check_cancel',
    // --- end 验证码 ---

    // --- start 账户充值 ---
    chargeContainerId: 'charge_container',
    accountInfo3Id: "account_info3",
    accountBal3Id: "account_balance3",
    chargeQRCodeId: "charge_qr_code",
    btnChargeCancelId: "btn_charge_cancel",
    // --- end 账户充值 ---

    currentBtnId: "",

    isShownChargePage: false,

    buttons: [],
    initButtons: function () {
        PayView220001.buttons.push(
            {
                id: 'order_package_1',
                name: '订购套餐--续包月',
                type: 'img',
                nextFocusRight: 'order_package_2',
                backgroundImage: PayView220001.imageUrl + "package_1_unselected.png",
                focusImage: PayView220001.imageUrl + "package_1_selected.png",
                click: PayController220001.onClick,
                renew: "1",
                cycleType: 1,
                orderMonth: '1',
                vipId: "27",
            }, {
                id: 'order_package_2',
                name: '订购套餐--月卡',
                type: 'img',
                nextFocusLeft: 'order_package_1',
                nextFocusRight: 'order_package_3',
                backgroundImage: PayView220001.imageUrl + "package_2_unselected.png",
                focusImage: PayView220001.imageUrl + "package_2_selected.png",
                click: PayController220001.onClick,
                renew: "0",
                cycleType: 1,
                orderMonth: '1',
                vipId: "26",
            }, {
                id: 'order_package_3',
                name: '订购套餐--年卡',
                type: 'img',
                nextFocusLeft: 'order_package_2',
                backgroundImage: PayView220001.imageUrl + "package_3_unselected.png",
                focusImage: PayView220001.imageUrl + "package_3_selected.png",
                click: PayController220001.onClick,
                renew: "0",
                cycleType: 4,
                orderMonth: '12',
                vipId: "25",
            }, {
                id: 'wechat_payment',
                name: '支付方式--微信',
                type: 'img',
                nextFocusRight: 'ali_payment',
                nextFocusDown: 'btn_cancel',
                backgroundImage: PayView220001.imageUrl + "wechat_payment_unselected.png",
                focusImage: PayView220001.imageUrl + "wechat_payment_selected.png",
                selectedImage: PayView220001.imageUrl + "wechat_payment_focus.png",
                // beforeMoveChange: PayController220001.onPaymentMoveChange,
                focusChange: PayController220001.onPaymentSelected
            }, {
                id: 'ali_payment',
                name: '支付方式--支付宝',
                type: 'img',
                nextFocusLeft: 'wechat_payment',
                nextFocusRight: 'bill_payment',
                nextFocusDown: 'btn_cancel',
                backgroundImage: PayView220001.imageUrl + "ali_payment_unselected.png",
                focusImage: PayView220001.imageUrl + "ali_payment_selected.png",
                selectedImage: PayView220001.imageUrl + "ali_payment_focus.png",
                // beforeMoveChange: PayController220001.onPaymentMoveChange,
                focusChange: PayController220001.onPaymentSelected
            }, {
                id: 'bill_payment',
                name: '支付方式--账单支付',
                type: 'img',
                nextFocusLeft: 'ali_payment',
                nextFocusDown: 'btn_bill_sure2',
                backgroundImage: PayView220001.imageUrl + "bill_payment_unselected.png",
                focusImage: PayView220001.imageUrl + "bill_payment_selected.png",
                selectedImage: PayView220001.imageUrl + "bill_payment_focus.png",
                beforeMoveChange: PayController220001.onPaymentMoveChange,
                focusChange: PayController220001.onPaymentSelected
            }, {
                id: "btn_bill_sure1",
                name: "账号支付-立即支付",
                type: "img",
                backgroundImage: PayView220001.imageUrl + "btn_bill_sure_unselect.png",
                focusImage: PayView220001.imageUrl + "btn_bill_sure_selected.png",
                click: PayController220001.onClick,
            }, {
                id: "btn_charge1",
                name: "账号支付-移动账号充值",
                type: "img",
                backgroundImage: PayView220001.imageUrl + "btn_charge_unselect.png",
                focusImage: PayView220001.imageUrl + "btn_charge_selected.png",
                click: PayController220001.onClick,
            }, {
                id: "btn_bill_sure2",
                name: "账号支付-立即支付",
                type: "img",
                nextFocusUp: 'bill_payment',
                backgroundImage: PayView220001.imageUrl + "btn_bill_sure_unselect.png",
                focusImage: PayView220001.imageUrl + "btn_bill_sure_selected.png",
                click: PayController220001.onClick,
            }, {
                id: "btn_charge2",
                name: "账号支付-移动账号充值",
                type: "img",
                nextFocusUp: 'bill_payment',
                backgroundImage: PayView220001.imageUrl + "btn_charge_unselect.png",
                focusImage: PayView220001.imageUrl + "btn_charge_selected.png",
                click: PayController220001.onClick,
            }, {
                id: "check_code",
                name: "验证码",
                type: "div",
                backgroundImage: PayView220001.imageUrl + "input_unselected.png",
                focusImage: PayView220001.imageUrl + "input_selected.png",
                focusChange: PayController220001.onInputVerifyCodeFocus,
                relateElement: "btn_sure"
            }, {
                id: 'btn_check_sure',
                name: '按钮--确定',
                type: 'img',
                nextFocusRight: 'btn_check_cancel',
                nextFocusUp: 'check_code',
                backgroundImage: PayView220001.imageUrl + "btn_sure_unselected.png",
                focusImage: PayView220001.imageUrl + "btn_sure_selected.png",
                click: PayController220001.onClick,
                // beforeMoveChange: PayController220001.onOperationMoveChange
            }, {
                id: 'btn_check_cancel',
                name: '按钮--取消',
                type: 'img',
                nextFocusLeft: 'btn_check_sure',
                nextFocusUp: 'check_code',
                backgroundImage: PayView220001.imageUrl + "btn_cancel_unselected.png",
                focusImage: PayView220001.imageUrl + "btn_cancel_selected.png",
                click: PayController220001.onClick,
                // beforeMoveChange: PayController220001.onOperationMoveChange
            }, {
                id: 'btn_charge_cancel',
                name: '充值按钮--取消',
                type: 'img',
                backgroundImage: PayView220001.imageUrl + "btn_charge_cancel.png",
                focusImage: PayView220001.imageUrl + "btn_charge_cancel.png",
                click: PayController220001.onClick,
            });
        LMEPG.ButtonManager.init(PayView220001.defaultFocusId, PayView220001.buttons, '', true);
    },

    /** 显示支付方式页面 -- 判断当前点击的套餐类型 */
    showPaymentPage: function () {
        Hide(PayView220001.orderPackageContainerId);
        Show(PayView220001.paymentContainerId);
        if (PayController220001.selectedPackageId == PayView220001.orderPackage1Id) {
            PayView220001.showBillPage1();
        } else {
            PayView220001.showMultiPaymentPage();
        }
    },

    /** 显示账号支付方式（续包月） */
    showBillPage1: function () {
        Show(PayView220001.billPayContainer1Id);
        var prefix = "宽带账号：";
        if (PayController220001.payPhoneType == "1001") {
            prefix = "手机号码：";
        }
        G(PayView220001.accountInfo1Id).innerHTML = prefix + PayController220001.payPhone;
        G(PayView220001.accountBal1Id).innerHTML = PayController220001.balance / 100 + "元";
        G(PayView220001.productFee1Id).innerHTML = PayController220001.price / 100 + "元";
        G('bill_fee').innerHTML = PayController220001.price / 100 + "元";

        if (PayController220001.balance < PayController220001.price) {
            Hide(PayView220001.btnBillSure1Id);
            Show(PayView220001.btnCharge1Id);
            G(PayView220001.accountBal1Id).style.color = "#ff0000";
            LMEPG.ButtonManager.requestFocus(PayView220001.btnCharge1Id);
        } else {
            Hide(PayView220001.btnCharge1Id);
            Show(PayView220001.btnBillSure1Id);
            G(PayView220001.accountBal1Id).style.color = "#06203b";
            LMEPG.ButtonManager.requestFocus(PayView220001.btnBillSure1Id);
        }
    },

    /** 显示多种支付方式（单月、包年） */
    showMultiPaymentPage: function () {
        Show(PayView220001.multiPaymentContainerId);
        // 显示微信二维码页
        PayController220001.selectPaymentId = PayView220001.wechatPaymentId;
        LMEPG.BM.setSelected(PayView220001.wechatPaymentId, true);
        PayView220001.showQRCodePage();
        G(PayView220001.aliPaymentId).src = PayView220001.imageUrl + "ali_payment_unselected.png";
        G(PayView220001.billPaymentId).src = PayView220001.imageUrl + "bill_payment_unselected.png";
        LMEPG.ButtonManager.requestFocus(PayView220001.wechatPaymentId);
        PayModel220001.queryOrderStatus();
    },

    showBillPage2: function () {
        Hide(PayView220001.qrCodePaymentContentId);
        Show(PayView220001.billPayContainer2Id);
        var prefix = "宽带账号：";
        if (PayController220001.payPhoneType == "1001") {
            prefix = "手机号码：";
        }
        G(PayView220001.accountInfo2Id).innerHTML = prefix + PayController220001.payPhone;
        G(PayView220001.accountBal2Id).innerHTML = PayController220001.balance / 100 + "元";
        G(PayView220001.productFee2Id).innerHTML = PayController220001.price / 100 + "元";
        G('bill_cycle').innerHTML = PayController220001.orderMonth;
        G('bill_price').innerHTML = PayController220001.price / 100 + '';
        if (PayController220001.balance < PayController220001.price) {
            Hide(PayView220001.btnBillSure2Id);
            Show(PayView220001.btnCharge2Id);
            G(PayView220001.accountBal2Id).style.color = "#ff0000";
        } else {
            Hide(PayView220001.btnCharge2Id);
            Show(PayView220001.btnBillSure2Id);
            G(PayView220001.accountBal2Id).style.color = "#06203b";
        }
    },

    showQRCodePage: function () {
        Hide(PayView220001.billPayContainer2Id);
        Show(PayView220001.qrCodePaymentContentId);
        G(PayView220001.packagePriceId).innerHTML = PayController220001.price / 100 + "元";
        G('qr_code_cycle').innerHTML = PayController220001.orderMonth;
        G('qr_code_price').innerHTML = PayController220001.price / 100 + '';
        if (PayController220001.selectPaymentId == PayView220001.wechatPaymentId) {
            G(PayView220001.QRCodeId).src = PayController220001.wechatQRCodeUrl;
            G(PayView220001.qrCodeNameId).innerHTML = "微信";
        } else {
            G(PayView220001.QRCodeId).src = PayController220001.aliQRCodeUrl;
            G(PayView220001.qrCodeNameId).innerHTML = "支付宝";
        }
    },

    showCheckCodePage: function () {
        PayView220001.currentBtnId = (LMEPG.ButtonManager.getCurrentButton()).id;
        if (PayController220001.selectedPackageId == PayView220001.orderPackage1Id) {
            Hide(PayView220001.billPayContainer1Id);
        } else {
            Hide(PayView220001.multiPaymentContainerId);
        }
        Show(PayView220001.checkCodeContainerId);
        var optimalData = VCAlgorithmTool.getOptimalData(function (expresion, result) {
            return result >= 0 && result <= 10;
        });
        PayController220001.checkCode = optimalData.displayResult;
        // 显示随机验证码
        G(PayView220001.checkCodeTipsId).innerHTML = optimalData.displayExpr + '=';
        LMEPG.ButtonManager.requestFocus(PayView220001.btnCheckCancelId);
    },

    showChargePage: function () {
        PayView220001.currentBtnId = (LMEPG.ButtonManager.getCurrentButton()).id;
        if (PayController220001.selectedPackageId == PayView220001.orderPackage1Id) {
            Hide(PayView220001.billPayContainer1Id);
        } else {
            Hide(PayView220001.multiPaymentContainerId);
        }
        Show(PayView220001.chargeContainerId);
        var prefix = "宽带账号：";
        if (PayController220001.payPhoneType == "1001") {
            prefix = "手机号码：";
        }
        G(PayView220001.accountInfo3Id).innerHTML = prefix + PayController220001.payPhone;
        G(PayView220001.accountBal3Id).innerHTML = PayController220001.balance / 100 + "元";
        G('charge_cycle').innerHTML = PayController220001.orderMonth;
        G('charge_price').innerHTML = PayController220001.price / 100 + '';
        G('charge_balance').innerHTML = PayController220001.balance / 100 + '';
        if (PayController220001.balance < PayController220001.price) {
            G(PayView220001.accountBal3Id).style.color = "#ff0000";
        } else {
            G(PayView220001.accountBal3Id).style.color = "#06203b";
        }
        G(PayView220001.chargeQRCodeId).src = PayController220001.chargeQRCodeUrl + "&ProCreatDate=" + new Date().format("yyyyMMddhhmmss");
        LMEPG.ButtonManager.requestFocus(PayView220001.btnChargeCancelId);
        // 轮询账号充值的结果
        PayController220001.accountStatusTimer = setTimeout(function () {
            PayModel220001.queryUserStatus();
        }, 500);
    },

    /** 页面显示余额刷新 */
    updateBalance: function () {
        var autoHideFocusId = PayView220001.currentBtnId;
        G(PayView220001.accountBal3Id).innerHTML = PayController220001.balance / 100 + "元";
        G('charge_balance').innerHTML = PayController220001.balance / 100 + '';
        if (PayController220001.balance < PayController220001.price) {
            G(PayView220001.accountBal3Id).style.color = "#ff0000";
        } else {
            G(PayView220001.accountBal3Id).style.color = "#06203b";
        }

        if (PayController220001.selectedPackageId == PayView220001.orderPackage1Id) {
            G(PayView220001.accountBal1Id).innerHTML = PayController220001.balance / 100 + "元";
            if (PayController220001.balance < PayController220001.price) {
                Hide(PayView220001.btnBillSure1Id);
                Show(PayView220001.btnCharge1Id);
                G(PayView220001.accountBal1Id).style.color = "#ff0000";
            } else {
                Hide(PayView220001.btnCharge1Id);
                Show(PayView220001.btnBillSure1Id);
                G(PayView220001.accountBal1Id).style.color = "#06203b";
                autoHideFocusId = PayView220001.btnBillSure1Id;
            }
        }else {
            G(PayView220001.accountBal2Id).innerHTML = PayController220001.balance / 100 + "元";
            if (PayController220001.balance < PayController220001.price) {
                Hide(PayView220001.btnBillSure2Id);
                Show(PayView220001.btnCharge2Id);
                G(PayView220001.accountBal2Id).style.color = "#ff0000";
            } else {
                Hide(PayView220001.btnCharge2Id);
                Show(PayView220001.btnBillSure2Id);
                G(PayView220001.accountBal2Id).style.color = "#06203b";
                autoHideFocusId = PayView220001.btnBillSure2Id;
            }
        }

        return autoHideFocusId;
    },

    showConfirmDialog: function () {
        modal.commonDialog({
            beClickBtnId: PayController220001.selectedPackageId == PayView220001.orderPackage1Id ? PayView220001.btnBillSure1Id : PayView220001.btnBillSure2Id,
            onClick: PayController220001.onConfirmDialogClick
        }, '您是否确定支付，确认后不可退费');

        //弹窗焦点策略与局方保持一致
        G('modal-sure').style.position = 'relative';
        G('modal-cancel').style.position = 'relative';
        G('modal-sure').style.left = '277px';
        G('modal-cancel').style.left = '-277px';
        LMEPG.BM.requestFocus('modal-cancel');
        LMEPG.BM._buttons['modal-sure'].nextFocusLeft=LMEPG.BM._buttons['modal-sure'].nextFocusRight;
        LMEPG.BM._buttons['modal-sure'].nextFocusRight='';
        LMEPG.BM._buttons['modal-cancel'].nextFocusRight=LMEPG.BM._buttons['modal-cancel'].nextFocusLeft;
        LMEPG.BM._buttons['modal-cancel'].nextFocusLeft='';
    },

    hideChargePage: function (hideFocusId) {
        Hide(PayView220001.chargeContainerId);
        if (PayController220001.selectedPackageId == PayView220001.orderPackage1Id) {
            Show(PayView220001.billPayContainer1Id);
        } else {
            Show(PayView220001.multiPaymentContainerId);
        }
        LMEPG.Log.info("hideFocusId::" + hideFocusId);
        if(typeof hideFocusId != 'undefined') {
            LMEPG.ButtonManager.requestFocus(hideFocusId);
        }else {
            LMEPG.ButtonManager.requestFocus(PayView220001.currentBtnId);
        }
    },

    hideCheckCodePage: function () {
        Hide(PayView220001.checkCodeContainerId);
        if (PayController220001.selectedPackageId == PayView220001.orderPackage1Id) {
            Show(PayView220001.billPayContainer1Id);
        } else {
            Show(PayView220001.multiPaymentContainerId);
        }
        LMEPG.ButtonManager.requestFocus(PayView220001.currentBtnId);
    },

    hidePaymentPage: function () {
        Hide(PayView220001.billPayContainer1Id);
        Hide(PayView220001.multiPaymentContainerId);
        Hide(PayView220001.paymentContainerId);
        Show(PayView220001.orderPackageContainerId);
        LMEPG.ButtonManager.requestFocus(PayController220001.selectedPackageId);
    },


    isShowChargePage: function () {
        return G(PayView220001.chargeContainerId).style.display == "block";
    },

    isShowCheckCodePage: function () {
        return G(PayView220001.checkCodeContainerId).style.display == "block";
    },

    isShowPaymentPage: function () {
        return G(PayView220001.paymentContainerId).style.display == "block";
    }
}

/********************************************************
 *  控制器
 * ******************************************************/
var PayController220001 = {

    selectedPackageId: 'order_package_1', // 当前选中的套餐ID
    selectPaymentId: 'wechat_payment', // 当前选中的支付方式
    orderId: "", // 预订单生成的订单ID
    wechatQRCodeUrl: "", // 微信支付二维码
    aliQRCodeUrl: "", // 支付宝二维码
    orderStatusTimer: null,
    accountStatusTimer: null,
    price: 1000, // 当前套餐支付费用
    wechatPayType: 1,
    orderMonth: '',
    aliPayType: 2,
    billPayType: 9,
    checkCode: "", // 验证码

    balance: 0, // 当前账户余额
    payPhone: "",// 当前绑定手机号
    payPhoneType: "",//缴费号码类型(1001. ⼿机码；1002 ，宽带号码)

    init: function () {
        PayView220001.initButtons();
    },

    onClick: function (button) {
        switch (button.id) {
            case PayView220001.orderPackage1Id:
            case PayView220001.orderPackage2Id:
            case PayView220001.orderPackage3Id:
                PayController220001.selectedPackageId = button.id;
                PayController220001.orderMonth = button.orderMonth;
                // var product = PayController220001.queryProduct(button.vipId);
                var fee = PayController220001.queryFee(button.cycleType, button.renew);
                if (fee == -1) {
                    LMEPG.UI.showToast("查询产品信息失败！");
                } else {
                    PayModel220001.serviceOrder(button.vipId, button.cycleType, button.renew, fee);
                }
                break;
            case PayView220001.btnBillSure1Id:
            case PayView220001.btnBillSure2Id:
                // 查询是否黑名单用户
                PayModel220001.isBlackListUser();
                break;
            case PayView220001.btnCharge1Id:
            case PayView220001.btnCharge2Id:
                PayView220001.showChargePage();
                break;
            case PayView220001.btnCheckSureId:
                PayController220001.verifyCheckCode();
                break;
            case PayView220001.btnCheckCancelId:
                PayView220001.hideCheckCodePage();
                break;
            case PayView220001.btnChargeCancelId:
                PayView220001.hideChargePage();
                break;
        }
    },

    onConfirmDialogClick: function () {
        // PayModel220001.queryUserStatus();
        // PayModel220001.isBlackListUser();
        modal.hide();
        PayModel220001.payDirect();
    },

    verifyCheckCode: function () {
        //检验验证码
        var inputCheckCode = G(PayView220001.checkCodeId).innerHTML;
        if (!inputCheckCode) {
            LMEPG.UI.showToast("请输入验证码！");
            return;
        }
        if (inputCheckCode != PayController220001.checkCode) {
            LMEPG.UI.showToast("请输入正确的验证码！");
            return;
        }
        PayModel220001.payDirect();
    },

    onPaymentSelected: function (button, hasFocus) {
        var buttonId = button.id;
        if (hasFocus) { // 获得焦点
            LMEPG.BM.setSelected(buttonId, false);
            PayController220001.selectPaymentId = buttonId;
            if (buttonId == PayView220001.billPaymentId) {
                PayView220001.showBillPage2();
            } else {
                PayView220001.showQRCodePage();
            }
        }
    },

    /**
     * 输入框焦点变动事件
     */
    onInputVerifyCodeFocus: function (btn, hasFocus) {
        if (hasFocus) {
            JJKye.init({
                isExist: true,
                top: '112px',
                left: '20px',
                width: '412px',
                height: '135px',
                action: "checkCode",
                input: 'check_code', //  输入框ID
                backFocus: 'btn_check_sure', // 返回ID
                resolution: 'hd' // 盒子分辨率
            });
        }
    },

    onPaymentMoveChange: function (direction, button) {
        if (direction == "down") { // 向上移动的事件
            LMEPG.BM.setSelected(button.id, true);
            if (PayController220001.balance < PayController220001.price) {
                LMEPG.BM.requestFocus(PayView220001.btnCharge2Id);
            } else {
                LMEPG.BM.requestFocus(PayView220001.btnBillSure2Id);
            }
        }
    },

    /**
     * 调用局方预订单接口返回结果处理
     *  -- 1、保存返回相关参数供之后显示页面使用（微信、支付宝二维码地址），和之后的逻辑使用（订单号）
     *  -- 2、查询当前用户的信息供显示账户信息使用
     */
    saveServerOrderInfo: function (serverOrderInfo) {
        // 1、保存预订单返回相关信息
        PayController220001.orderId = serverOrderInfo.orderId;
        PayController220001.wechatQRCodeUrl = PayModel220001.orderServerAddress + serverOrderInfo.wechatQrUrl;
        PayController220001.aliQRCodeUrl = PayModel220001.orderServerAddress + serverOrderInfo.alipayQrUrl;
        PayController220001.price = serverOrderInfo.fee;

        // 2、查询当前用户信息 -- 账号支付需要显示相关信息
        PayModel220001.queryUserStatus();
    },

    /**
     * 调用局方查询用户信息接口返回结果处理
     *  -- 1、保存返回相关参数供之后的账号支付信息使用
     *  -- 2、显示支付方式页面
     */
    saveUserStatusInfo: function (userStatusInfo) {
        PayController220001.payPhone = userStatusInfo.payPhone;
        PayController220001.payPhoneType = userStatusInfo.payPhoneType;
        PayController220001.chargeQRCodeUrl = PayModel220001.chargeSeverAddress + "?ProOrderNo=" + PayController220001.orderId
            + "&ProOrderMoney=" + PayController220001.price
            + "&ProUserType=" + userStatusInfo.payPhoneType
            + "&ProIDValue=" + userStatusInfo.payPhone;

        LMEPG.Log.info("PayController220001.balance = " + PayController220001.balance + ",userStatusInfo.balance = " + userStatusInfo.balance);
        if (PayController220001.accountStatusTimer) {
            // 判断轮询的用户余额是否大于账户余额,大于账户余额，更新页面刷新余额显示
            if(userStatusInfo.balance > PayController220001.balance) {
                LMAndroid.JSCallAndroid.doShowToast("账户充值成功");
                PayController220001.balance = userStatusInfo.balance;
                var autoHideFocusId = PayView220001.updateBalance();
                if(PayView220001.isShowChargePage()) {
                    PayView220001.hideChargePage(autoHideFocusId);
                }
            }
            if (userStatusInfo.balance >= PayController220001.price) {
                clearTimeout(PayController220001.accountStatusTimer);
            } else {
                PayController220001.accountStatusTimer = setTimeout(function () {
                    PayModel220001.queryUserStatus();
                }, 3000);
            }
        } else {
            // 存取当前账户余额，用于页面展示
            PayController220001.balance = userStatusInfo.balance;
            PayView220001.showPaymentPage();
        }
    },

    /**
     * 订单状态（1-⽀付成功，2-⽀付失败，3-未⽀付，4-超时）
     * @param status
     */
    handleOrderStatus: function (status) {
        switch (status) {
            case 1:
                // 上报支付状态
                var payType = PayController220001.selectPaymentId == PayView220001.wechatPaymentId
                    ? PayController220001.wechatPayType : PayController220001.aliPayType;
                PayModel220001.uploadPayResult(payType);
                break;
            case 2:
                LMEPG.UI.showToast("当前订单支付失败");
                break;
            case 3:
            case 4:
                PayController220001.orderStatusTimer = setTimeout(function () {
                    PayModel220001.queryOrderStatus();
                }, 3 * 1000);
                break;
        }
    },

    queryProduct: function (vipId) {
        var products = RenderParam.orderItems;
        for (var index = 0; index < products.length; index++) {
            var product = products[index];
            if (product.vip_id == vipId) {
                return product;
            }
        }
        return {};
    },

    queryFee: function (cycleType, isRenew) {
        var result = -1;
        var products = RenderParam.extraData.productInfo.products;
        var product = products[0]; // 局方配置只有一个产品
        var fees = product.fees;
        for (var index = 0; index < fees.length; index++) {
            var fee = fees[index];
            if (fee.cycleType == cycleType) {
                if (isRenew == "1") {
                    result = fee.feeRenew;
                } else {
                    result = fee.fee;
                }
                break;
            }
        }
        return result;
    },

    /**
     * 生成随机4位数验证码
     */
    generateCheckCode: function () {
        var checkCode = "";
        for (var i = 0; i < 4; i++) {
            checkCode += Math.floor(Math.random() * 10)
        }
        PayController220001.checkCode = checkCode;
        return checkCode;
    },

    resetStatus: function () {
        PayController220001.orderId = "";
        PayController220001.wechatQRCodeUrl = "";
        PayController220001.aliQRCodeUrl = "";
        PayController220001.price = 0;
        if (PayController220001.accountStatusTimer) {
            clearTimeout(PayController220001.accountStatusTimer);
            PayController220001.accountStatusTimer = null;
        }
    },

    back: function () {
        if (PayView220001.isShowChargePage()) {
            PayView220001.hideChargePage();
        } else if (PayView220001.isShowCheckCodePage()) {
            PayView220001.hideCheckCodePage();
        } else if (PayView220001.isShowPaymentPage()) {
            PayView220001.hidePaymentPage();
            clearTimeout(PayController220001.orderStatusTimer);
            PayController220001.resetStatus();
        } else {
            LMEPG.Intent.back();
        }
    }
}

/**
 * 简易验证码算法表达式生成工具。VC(Verify-Code)
 * 注：按要求，目前仅支持产生 0~9 的随机个位数，不支持10及其以上的随机数！
 * @author Songhui on 2020-1-19
 */
var VCAlgorithmTool = {
    // 验证码表达式个数（例1（3位混合）：3*5+1。例2（4位混合）：1+2+3+4）
    VERIFY_CODE_NUMS: 2,

    /** 算法规则-2：（局方要求：1位数混合运算）
     *      1. 取值1-9，不许出现0。
     *      2. 一个算式内数字不能重复。例如：2+3-4+5、1+2-2+3
     *      3. 结果非负。
     * @return {Array[]} [随机数,随机符]
     * @author Songhui
     */
    genRule: function () {
        // 获取随机数及运算符
        var numbers = [];
        var symbols = [];

        //（一）生成随机数
        // 是否过滤（true-不符合规则条件，需过滤并重新随机；false-符合规则，计入）
        var is_filter = function (val, extraFilterCondition/*额外条件*/) {
            return val === 0 || (typeof extraFilterCondition === "boolean" && extraFilterCondition);
        };
        for (var i = 0; i < VCAlgorithmTool.VERIFY_CODE_NUMS; i++) {
            var val = Math.floor(Math.random() * 10);
            for (; is_filter(val, (numbers.indexOf(val) !== -1/*已重复*/));) {
                val = Math.floor(Math.random() * 10);
                if (!is_filter(val, (numbers.indexOf(val) !== -1/*已重复*/))) {
                    break;
                }
            }
            numbers.push(val);
        }

        // 2.2 动态随机“加减”（选择其一）
        var symbolOptions = ["+", "-"]; //允许符号
        var symbolRepeated = true; //符号是否可重用还是只能用一个
        for (var index = 0, len = numbers.length; index < len - 1/*最后一位不需要符号*/; index++) {
            if (typeof symbols[i] === "undefined") {
                var symbolPos = Math.floor(Math.random() * symbolOptions.length); //随机用符号-位置
                var symbolVal = symbolOptions[symbolPos]; //随机用符号-值
                symbols[index] = symbolRepeated ? symbolVal : symbolOptions.splice(symbolOptions.indexOf(symbolVal), 1); //插入并决定是否仅允许一次
            }
        }

        console.debug("[rule-2]->random-numbers：", numbers);
        console.debug("[rule-2]->random-symbols：", symbols);

        // 返回随机数据
        return [numbers, symbols];
    },

    /**
     * 计算返回随机表达式及结果
     * @return {{displayResult: int, displayExpr: string}}
     * @author Songhui
     */
    calRandomResult: function (numbers, symbols) {
        var expr = "";
        for (var i = 0, len = numbers.length; i < len; i++) {
            expr += numbers[i] + "" + (i < len - 1 ? symbols[i] : "")/*最后一个符号不需要*/;
        }
        try {
            var displayResult = eval(expr); //UI显示结果
            var displayExpr = expr.replace("/", "÷"); //UI上显示表达式：把“/”转换为“÷”，给用户展示
        } catch (e) {
            displayResult = -1; //加强eval异常（但一般不会，万一上层调用传入不合法运算符和数字就会产生）
        }
        console.debug(displayExpr + "=" + displayResult);
        return {
            displayExpr: displayExpr,
            displayResult: displayResult,
        };
    },

    /**
     * 随机最优验证表达式及结果。
     * <pre>调用示例：
     *      getOptimalData(function(expresion, result) {
     *          // FILTER THE BEST DATA BY YOURSELF...
     *          return true;//判断条件必须可能存在true情况。约定：千万不能固定返回false，否则造成死循环！！！
     *      }, function() {
     *          // GENERATE RANDOM DATA BY YOURSELF...
     *          return [numbers, symbols];
     *      });
     * </pre>
     * @param resultHandler [function] 结果处理器，用于控制符合提供条件的最优结果，返回bool。[match_condition] resultHandler(expresion, result)
     * @author Songhui
     */
    getOptimalData: function (resultHandler) {
        var isMatched = function (expresion, result) {
            if (typeof resultHandler !== "function") return result >= 0; //默认条件：随机表达式结果非负
            else {
                var handled = resultHandler(expresion, result);
                if (typeof handled !== "boolean") return result >= 0; //默认条件：随机表达式结果非负
                else return handled;
            }
        };

        var renderUIExpr = "";
        for (; ;) {
            var randomData = VCAlgorithmTool.genRule();
            var calData = VCAlgorithmTool.calRandomResult(randomData[0], randomData[1]);
            if (isMatched(calData.displayExpr, calData.displayResult)) {
                renderUIExpr = calData.displayExpr;
                break;
            }
        }
        return calData;
    },

    /**
     * 获取随机的4位数
     */
    getRandomNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
};


/********************************************************
 *  模型层
 * ******************************************************/
var PayModel220001 = {

    // orderServerAddress: "http://100.83.3.29:8008/orders", // 测试环境
    orderServerAddress: "http://100.83.3.30:8008/orders",
    // chargeSeverAddress: "http://100.83.3.29:8008/phoneOrders/rechargeQR", // 测试环境
    chargeSeverAddress: "http://100.83.3.30:8008/phoneOrders/rechargeQR",
    serviceOrderUrl: "Pay/serviceOrder",
    queryQRCodeUrl: "Pay/queryQRCode",
    queryOrderStatusUrl: "Pay/queryOrderStatus",
    queryUserStatusUrl: "Pay/queryUserStatus",
    payDirectUrl: "Pay/payDirect",
    uploadPayResultUrl: "Pay/insertOrderInfo",
    isBlackListUserUrl: "Pay/isBlackListUser",

    serviceOrder: function (vipId, cycleType, renew, fee) {
        var data = {
            "userId": RenderParam.userId, // 朗玛：用户Id
            "vipId": vipId, // 套餐ID
            "orderReason": RenderParam.orderReason, // 订购触发条件
            "remark": RenderParam.remark, // 订单备注
            "backPage": RenderParam.returnPageName, // 订购成功返回页面
            "isRoutePlayer": RenderParam.isPlaying,
            "cycleType": cycleType,
            "customerRenew": renew,
            "fee": fee
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI(PayModel220001.serviceOrderUrl, data, function (rspData) {
            LMEPG.UI.dismissWaitingDialog();
            if (rspData.code == 0) {
                PayController220001.saveServerOrderInfo(rspData);
            } else if (rspData.message) {
                LMEPG.UI.showToast(rspData.message);
            } else {
                LMEPG.UI.showToast("预订单失败，code = " + rspData.code);
            }
        }, function (xmlHttp, errorInfo) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("预订单失败，服务器出错," + xmlHttp.status);
        })
    },

    queryQRCode: function (payType, orderId) {
        var data = {
            "payType": payType,
            "orderId": orderId
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI(PayModel220001.queryQRCodeUrl, data, function (rspData) {
            LMEPG.UI.dismissWaitingDialog();
            if (rspData.code == 0) {
                PayController220001.saveServerOrderInfo(rspData);
            } else if (rspData.message) {
                LMEPG.UI.showToast(rspData.message);
            } else {
                LMEPG.UI.showToast("获取二维码失败，code = " + rspData.code);
            }
        }, function (xmlHttp, errorInfo) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("获取二维码失败，服务器出错," + xmlHttp.status);
        })
    },

    queryOrderStatus: function () {
        var data = {
             "orderId": PayController220001.orderId
         }
         LMEPG.ajax.postAPI(PayModel220001.queryOrderStatusUrl, data, function (rspData) {
             if (rspData.code == 0) {
                 PayController220001.handleOrderStatus(rspData.status);
             } else {
                 LMEPG.UI.showToast("查询订单状态失败，code = " + rspData.code);
             }
         }, function (xmlHttp, errorInfo) {
             LMEPG.UI.showToast("查询订单状态失败，服务器出错," + xmlHttp.status);
         })
    },

    queryUserStatus: function () {
        var data = {
            "price": PayController220001.price
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI(PayModel220001.queryUserStatusUrl, data, function (rspData) {
            LMEPG.UI.dismissWaitingDialog();
            if (rspData.code == 0) {
                PayController220001.saveUserStatusInfo(rspData.data);
            } else {
                LMEPG.UI.showToast("查询用户余额失败，code = " + rspData.code+"," + rspData.message);
            }
        }, function (xmlHttp, errorInfo) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("查询用户余额失败，服务器出错," + xmlHttp.status);
        })
    },

    isBlackListUser: function () {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI(PayModel220001.isBlackListUserUrl, {}, function (rspData) {
            LMEPG.UI.dismissWaitingDialog();
            if (rspData.code == 0) {
                // PayModel220001.payDirect();
                if (RenderParam.extraData.payCheck != 1) {
                    PayView220001.showConfirmDialog();
                } else {
                    PayView220001.showCheckCodePage();
                }
            } else {
                LMEPG.UI.showToast("当前用户状态异常，code = " + rspData.code, "," + rspData.message);
            }
        }, function (xmlHttp, errorInfo) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("查询用户状态失败，服务器出错," + xmlHttp.status);
        })
    },

    payDirect: function () {
        var data = {
            "orderId": PayController220001.orderId,
            "autoRenew": PayController220001.selectedPackageId == PayView220001.orderPackage1Id ? "1" : "0",
            "price": PayController220001.price,
            "orderType": PayController220001.selectedPackageId == PayView220001.orderPackage1Id ? "2" : "1",
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI(PayModel220001.payDirectUrl, data, function (rspData) {
            LMEPG.UI.dismissWaitingDialog();
            if (rspData.code == 0) {
                PayModel220001.uploadPayResult(PayController220001.billPayType);
            } else {
                LMEPG.UI.showToast("账单支付失败，code = " + rspData.code, "," + rspData.msg);
            }
        }, function (xmlHttp, errorInfo) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("账单支付失败，服务器出错," + xmlHttp.status);
        })
    },

    uploadPayResult: function (payType) {
        var data = {
            "payType": payType,
            "payTime": new Date().format("yyyy-MM-dd hh:mm:ss"),
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI(PayModel220001.uploadPayResultUrl, data, function (rspData) {
            LMEPG.UI.dismissWaitingDialog();
            if (rspData.result == 0) {
                LMEPG.UI.showToast("订购成功", 3, function () {
                    LMEPG.Intent.back();
                });
            } else {
                LMEPG.UI.showToast("上报支付结果失败，code = " + rspData.code, "," + rspData.msg);
            }
        }, function (xmlHttp, errorInfo) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("上报支付结果失败，服务器出错," + xmlHttp.status);
        })
    }

}

function onBack() {
    PayController220001.back();
}