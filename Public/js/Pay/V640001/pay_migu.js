var buttons = [];   // 定义全局按钮
var imgUrl = ROOT + "/Public/img/Pay/V640001/";

// 返回按键
function onBack() {
    LMEPG.Intent.back();
}

// 延迟退出该页面
function onDelayBack() {
    setTimeout(function () {
        LMEPG.Intent.back();
    }, 1500);
}

// 页面跳转控制
var Jump = {
    /**
     * 跳转 -- 规则
     */
    jumpRule: function () {
        var objCurr = Jump.getCurrentPage();
        var objRule = LMEPG.Intent.createIntent("goodsRule");
        LMEPG.Intent.jump(objRule, objCurr);
    },

    /**
     * 跳转 -- 付款
     */
    jumpPay: function (orderId, payUrl) {
        var objCurr = Jump.getCurrentPage();
        var objPay = LMEPG.Intent.createIntent("goodsPay");
        objPay.setParam("goodInfo", DataHandle.InitData.goodInfo);
        objPay.setParam("orderId", orderId);
        objPay.setParam("payUrl", payUrl);
        LMEPG.Intent.jump(objPay, objCurr);
    },

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
    // netId: "7ce99fd30dd043e98beca25580e4ec76", // SDK支付使用参数，需要向局方申请，测试环境
    netId: "59ad781eac0343e8b2a0e0ad48e98c07", // SDK支付使用参数，需要向局方申请，现网环境
    isClickPaying: false,       // 是否已经点击了支付按钮，表示正在支付中（此过程不该允许重复操作，避免逻辑错误影响）
    loopPayResultMaxSec: 5,     // 轮询支付结果最大超时允许值（秒）（注：5s对用户已经很长，再大体验就不好了！）
    loopPayResultMaxSec2: 60,     // 第三方支付轮询支付结果最大超时允许值（秒）（注：60s对用户已经很长，再大体验就不好了！）
    loopPayResultTimes: 0,      // 轮询支付结果超时时刻（秒）（当>最大超时限制，则结果并给予相关提示、释放某些控制变量以进行再次订购）
    lastProductPkgIndex: 0,     // 展示页1 - 当前套餐索引序号（0开始）（仅UI上呈现的顺序）
    payingData: {               // 当前正在触发订购的相关数据存储，用于支付成功后轮询结果过程需要（中间存储，避免业务逻辑控制不好切换选择新的未订购信息轮询）
        payParamInfo: null,     // 下单结果存储
        orderItem: null,        // 套餐选项 - UI上对应我方后台配置项
        authProduct: null,      // 套餐选项 - 匹配对应局方鉴权返回的那个可订购产品包
        reset: function () {    // 重置存储数据，在二次确认弹窗前重置旧数据
            Pay.payingData.payParamInfo = null;
            Pay.payingData.orderItem = null;
            Pay.payingData.authProduct = null;
        },
    },
    chargePolicy: "", // 订购时的安管策略
    isGetVerifyCode: false, // 判断当前是否获取短信验证码
    verifyCodeTimer: null, // 短信验证码定时器倒计时
    countDown: 60, // 倒计时时长

    // 重置轮询支付结果查询相关控制变量。当支付失败或查询超时，则重置相关控制变量，以便用户可进行再次订购点击操作。
    resetLoopPayResultFlags: function (isNeedCancelPaying) {
        Pay.isClickPaying = typeof isNeedCancelPaying !== "boolean" ? false/*默认取消*/ : isNeedCancelPaying;
        Pay.loopPayResultTimes = 0;
    },

    initData: function () {
        if (RenderParam.authProductInfo.result == "0") {
            LMEPG.UI.showToast("用户已经订购产品！");
            onDelayBack();
            return;
        }
        if (RenderParam.authProductInfo.result != "1" && RenderParam.authProductInfo.result != "20") {
            LMEPG.UI.showToast(RenderParam.authProductInfo.resultDesc || "信息为空！");
            onDelayBack();
            return;
        }
        if (!RenderParam.orderItems || RenderParam.orderItems.length <= 0) {
            // 获取订购项失败
            LMEPG.UI.showToast("获取订购套餐失败！");
            onDelayBack();
            return;
        }

        // 初始化交互焦点
        Pay.initButtons();
        Pay.showOrderItem("6");
        // SDK相关初始化
        // Pay.init();
    },

    /**
     * 套餐包选项 -- 点击 -- 直接发起订购
     */
    onProductPkgClicked: function (btn) {
        Pay._ADVPay(Pay.chargePolicy);
    },

    init: function () {
        // 咪咕SDK初始化
        var initData = {
            protocol: "", // 选填项 指定使用的通信协议（默认http）
            backstring1: "" // 选填项 保留字段
        };
        migusdk.init(function (code, message, data) {
            // 对Code值进行判断，局方的sdk是否初始化成功
            if (code == "0000") {
                // 如果初始化成功，继续进行下一步操作，下单
                // Pay._ADVOrder();
                Pay.showOrderItem(1);
            } else {
                // 提示用户SDK未初始化成功，以及相关的错误信息
                LMEPG.UI.showToast("服务器初始化失败，" + message, 3, function () {
                    LMEPG.Intent.back();
                })
            }
        }, initData, Pay.netId);
    },

    /**
     * 相关交互焦点初始化
     */
    initButtons: function () {
        buttons.push({
            id: "order_item_1",
            name: "套餐包-1",
            type: "img",
            backgroundImage: imgUrl + "order_item_1.png",
            focusImage: imgUrl + "order_item_1_f.png",
            click: Pay.onProductPkgClicked,
        }, {
            id: "code_container",
            name: "短信验证码",
            type: "div",
            backgroundImage: imgUrl + "bg_code_container.png",
            focusImage: imgUrl + "bg_code_container_f.png",
            focusChange: Pay.onInputVerifyCodeFocus,
            relateElement: "get_verify_code"
        }, {
            id: "get_verify_code",
            name: "获取短信验证码",
            type: "div",
            backgroundImage: imgUrl + "bg_get_verify_code.png",
            focusImage: imgUrl + "bg_get_verify_code_f.png",
            nextFocusLeft: "code_container",
            nextFocusDown: "verify_code_commit",
            click: Pay.getVerifyCode,
        }, {
            id: "verify_code_commit",
            name: "提交短信验证码",
            type: "img",
            backgroundImage: imgUrl + "img_verify_commit.png",
            focusImage: imgUrl + "img_verify_commit_f.png",
            nextFocusUp: "get_verify_code",
            click: Pay.commitVerifyCode,
        }, {
            id: "picture_container",
            name: "图形验证码",
            type: "div",
            backgroundImage: imgUrl + "bg_code_container.png",
            focusImage: imgUrl + "bg_code_container_f.png",
            focusChange: Pay.onInputVerifyCodeFocus,
            relateElement: "verify_picture_commit"
        }, {
            id: "verify_picture_commit",
            name: "提交图形验证码",
            type: "img",
            backgroundImage: imgUrl + "img_verify_commit.png",
            focusImage: imgUrl + "img_verify_commit_f.png",
            nextFocusUp: "picture_container",
            click: Pay.commitVerifyCode,
        });
        LMEPG.BM.init("order_item_1", buttons, "", true);
    },

    /**
     * 输入框焦点变动事件
     */
    onInputVerifyCodeFocus: function (btn, hasFocus) {
        if (hasFocus) {
            JJKye.init({
                isExist: true,
                top: '158px',
                left: '15px',
                width: '412px',
                height: '135px',
                action: "checkCode",
                input: btn.id, // 输入框ID
                backFocus: btn.relateElement, // 返回ID
                resolution: 'hd' // 盒子分辨率
            });
        }
    },

    /**
     * 获取短信验证码
     *
     * @param btn 事件源
     */
    getVerifyCode: function (btn) {
        if (typeof btn !== "undefined" && Pay.isGetVerifyCode) { // 当前已经获取短信验证码
            return;
        }
        if (typeof btn !== "undefined") { // 获取短信验证码
            Pay.isGetVerifyCode = true;
            G(btn.id).innerHTML = Pay.countDown + "s";
            Pay.verifyCodeTimer = setInterval(function () {
                Pay.countDown -= 1;
                G(btn.id).innerHTML = Pay.countDown + "s";
                if (Pay.countDown <= 0) { // 关闭定时器，重置状态值
                    clearInterval(Pay.verifyCodeTimer);
                    Pay.isGetVerifyCode = false;
                    G(btn.id).innerHTML = "获取验证码";
                }
            }, 1000);
        }
        var orderInfo = Pay.payingData.payParamInfo.payParam;
        var getVerifyCodeData = {
            netId: Pay.netId, // 网页ID
            orderId: orderInfo.OrderId, // 订单号
            picturePixel: 2, // 获取的图片像素 由于UI标注设计110 * 40 故选择2 120 * 40
            friendPay: 0, // 0 -- 本人支付，1 -- 好友支付
            ctype: orderInfo.Ctype,
            phoneNumber: orderInfo.PayNum,
            protocolType: "",
            chargePolicy: Pay.chargePolicy
        };
        LMEPG.Log.info("pay_migu.js getVerifyCode getVerifyCodeData is " + JSON.stringify(getVerifyCodeData));
        migusdk.getVerfiCode(JSON.stringify(getVerifyCodeData), function (message, resultCode, payData) {
            LMEPG.Log.info("pay_migu.js getVerifyCode success!! resultCode is " + resultCode + ", message is " + message + ",data is " + JSON.stringify(payData));
            if (resultCode == "0000") {
                LMEPG.Log.info("pay_migu.js getVerifyCode success!! chargePolicy is " + Pay.chargePolicy);
                if (Pay.chargePolicy == 2) { // 图形验证码需要将图片展示
                    var pictureUrl = payData.pictureURL; // 图形验证码图片链接
                    LMEPG.Log.info("ay_migu.js getVerifyCode pictureUrl is " + pictureUrl);
                    G("picture_code").src = pictureUrl;
                }
            }
        });

    },

    /**
     * 提交验证码并支付
     *
     * @param btn 事件源
     */
    commitVerifyCode: function (btn) {
        // 校验短信验证码
        var verifyCode = "";
        if (btn.id == "verify_code_commit") {
            verifyCode = G("code_container").innerHTML;
            var verifyCodeText = G("code_container").innerText;
        }

        if (btn.id == "verify_picture_commit") {
            verifyCode = G("picture_container").innerHTML;
        }
        LMEPG.Log.info("pay_migu.js commitVerifyCode verifyCode html is " + verifyCode);
        if (verifyCode == "" || verifyCode == "请输入验证码") {
            LMEPG.UI.showAndroidToast("请输入验证码");
            return;
        }
        Pay._ADVPay(Pay.chargePolicy, verifyCode);
    },

    /**
     * 该函数用于向局方发起下单，函数的返回值用于sdk的计费
     * @private
     */
    _ADVOrder: function () {

        if (Pay.isClickPaying) {
            console.debug("正在支付中，无需重复操作...");
            return;
        }

        Pay.isClickPaying = true;
        // 目前宁夏移动只有一个续包月套餐，之前从数组获取第一个数据
        Pay.payingData.orderItem = (RenderParam.orderItems)[0];
        Pay.payingData.authProduct = (RenderParam.authProductInfo.productInfos)[0];

        var postData = {
            orderReason: RenderParam.orderReason,
            remark: RenderParam.remark,
            accountIdentify: RenderParam.authProductInfo.accountIdentify,
            orderItem: JSON.stringify(Pay.payingData.orderItem),
            productInfo: JSON.stringify(Pay.payingData.authProduct),
        };

        LMEPG.UI.showWaitingDialog("正在下单,请等待...");
        LMEPG.ajax.postAPI("Pay/ADVPay", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (data.result == "0") {
                // 下单成功,将下单成功返回的数据保存提供支付接口使用
                Pay.payingData.payParamInfo = data; // 保存起来
                LMEPG.UI.showWaitingDialog("下单成功,正在准备订购...");
                Pay._ADVChargePolicy();
            } else {
                // 下单失败
                Pay.isClickPaying = false;
                LMEPG.UI.showToast("下单失败：" + data.resultDesc);
            }
        });
    },

    /**
     * SDK调用支付之前需要调用策略查询接口
     * @private
     */
    _ADVChargePolicy: function () {
        var orderInfo = Pay.payingData.payParamInfo.payParam;
        var payInfo = orderInfo.PayInfo;
        var chargePolicyData = {
            netId: Pay.netId,// 必填选 网页ID
            channelId: payInfo.ChannelCode, // 必填项 渠道代码
            contentId: payInfo.ContentCode, // 选填项 应用代码
            phoneNumber: orderInfo.PayNum, // 必填项 用户手机号码
            orderId: orderInfo.OrderId, // 必填项 订单号
            provinceCode: "", // 选填项 省份编码
            // 必填项,业务类型
            // 01：视讯个人产品灵活计费
            // 02：视讯魔百和OTT灵活计费
            // 03：视讯魔百和IPTV灵活计费
            // 11：视讯个人产品普通计费
            // 12：视讯魔百和OTT普通计费
            // 13：视讯魔百和IPTV普通计费
            bizType: orderInfo.BizType,
            stbId: orderInfo.StbID, // 必填项 设备唯一串号
            payType: "1", // 必填项 操作类型 0：普通点播订购;1：普通包月订购;2：普通包月退订;4：灵活计费订购
            ctype: orderInfo.Ctype, // 必填项，子公司代码
            subContentList: [
                {
                    index: payInfo.Index, // 必填项 序列 从0开始填写，表示当前是第1个
                    fee: payInfo.Fee, // 必填项 价格 单位：分
                    cooperateCode: payInfo.CooperateCode, //  必填项 企业代码
                    channelCode: payInfo.ChannelCode, // 必填项 渠道代码 透传子公司业务平台或APP发起计费请求时的渠道代码，
                    productCode: payInfo.ProductCode, // 必填项 产品代码 productCode和contentCode 根据业务侧规则二选一
                    contentCode: payInfo.ContentCode, // 非必填项 内容代码 productCode和contentCode 根据业务侧规则二选一
                    isMonthly: payInfo.IsMonthly, // 必填项 操作类型  0：点播 1：包月
                    spCode: payInfo.SpCode, // 必填项 服务商编码
                    servCode: payInfo.ServCode, // 非必填项 业务类型 点播忽略，包月必填，对应策略接口的servCode
                }
            ]
        };

        // 开始发起下单支付请求
        LMEPG.UI.showWaitingDialog("正在查询策略,请等待...");
        console.log(JSON.stringify(chargePolicyData));
        LMEPG.Log.info("_ADVChargePolicy chargePolicyData > " + JSON.stringify(chargePolicyData));
        migusdk.chargePolicy(JSON.stringify(chargePolicyData), function (message, code, resultData) {
            // 恢复初始化之前的状态值
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.Log.info("_ADVChargePolicy result code > " + code + " message > " + message);
            if (code == "0000") {
                // 若请求成功，记录策略，后期获取验证码时用到，调用后台接口保存当前次订购的相关参数值
                Pay.chargePolicy = resultData.chargePolicy;
                Pay.showOrderItem(resultData.chargePolicy, orderInfo.PayNum);
            } else {
                Pay.isClickPaying = false;
                // 提示用户当前次订购失败
                LMEPG.UI.showToast("查询策略失败，" + message, 3);
            }
        });
    },

    /**
     * 由于局方需要添加安管策略，所以需要根据查询到的策略显示不同的页面进行交互
     *
     * 1、一键支付
     * 2、简单图验
     * 3、四选一图验
     * 6、四位短验
     * 8、六位短验
     *
     * @param chargePolicy 安管策略
     * @param payNum 用户支付手机号
     */
    showOrderItem: function (chargePolicy, payNum) {
        LMEPG.Log.info("pay_migu.js showOrderItem chargePolicy is " + chargePolicy);
        // 根据不同的安管策略显示不同的交互页面
        switch (chargePolicy) {
            case "1":
                Show("order_without_policy");
                LMEPG.ButtonManager.requestFocus("order_item_1");
                break;
            case "2":
                G("picture_phone").innerHTML = payNum; // 填入手机号
                // 获取图形验证码
                Pay.getVerifyCode();
                // 显示图形验证码策略
                Show("order_picture_policy");
                LMEPG.ButtonManager.requestFocus("verify_picture_commit");
                break;
            case "6":
            case "8":
                G("code_phone").innerHTML = payNum; // 填入手机号
                Show("order_code_policy");
                LMEPG.ButtonManager.requestFocus("verify_code_commit");
                break;
        }
    },

    /**
     * 由于宁夏移动省公司要求，不使用验证码进行验证，所以直接发起一键支付进行订购
     * 下单接口
     */
    _ADVPay: function (chargePolicy, verifyCode) {
        var orderInfo = Pay.payingData.payParamInfo.payParam;
        var payInfo = orderInfo.PayInfo;
        var payData = {
            ctype: orderInfo.Ctype, // 必填项，子公司代码
            rspNow: "1", // 非必填项，是否立即响应，Opt为0时不填，为1或者2时选题（默认为立即响应），0 – 不立即响应；1 – 立即响应
            // 必填项,业务类型
            // 01：视讯个人产品灵活计费
            // 02：视讯魔百和OTT灵活计费
            // 03：视讯魔百和IPTV灵活计费
            // 11：视讯个人产品普通计费
            // 12：视讯魔百和OTT普通计费
            // 13：视讯魔百和IPTV普通计费
            bizType: orderInfo.BizType,
            // 该选项当前使用一键支付，避免验证码
            chargePolicy: chargePolicy, // 必填项，用户计费策略 1、一键支付;2、简单图验;3、四选一图验;6、四位短验;8、六位短验
            orderId: orderInfo.OrderId, // 必填项 订单号
            phoneNumber: orderInfo.PayNum, // 必填项 用户手机号
            stbID: orderInfo.StbID, // 必填项 设备唯一串号
            cpparam: orderInfo.Cpparam, // 非必填项 透传字段
            reserveParam: orderInfo.ReserveParam, // 非必填项 保留字段
            payType: "1", // 必填项 操作类型 0：普通点播订购;1：普通包月订购;2：普通包月退订;4：灵活计费订购
            // 灵活计费必填
            // 普通点播订购、普通包月订购、普通包月退订忽略
            customBizExpiryDate: orderInfo.CustomBizExpiryDate,// 灵活计费业务订购失效日期 若为无限期，则20991230
            subPayList: [
                {
                    index: payInfo.Index, // 必填项 序列 从0开始填写，表示当前是第1个
                    fee: payInfo.Fee, // 必填项 价格 单位：分
                    spCode: payInfo.SpCode, // 必填项 服务商编码
                    cooperateCode: payInfo.CooperateCode, //  必填项 企业代码
                    channelCode: payInfo.ChannelCode, // 必填项 渠道代码 透传子公司业务平台或APP发起计费请求时的渠道代码，
                    productCode: payInfo.ProductCode, // 必填项 产品代码 productCode和contentCode 根据业务侧规则二选一
                    contentCode: payInfo.ContentCode, // 非必填项 内容代码 productCode和contentCode 根据业务侧规则二选一
                    servCode: payInfo.ServCode, // 非必填项 业务类型 点播忽略，包月必填，对应策略接口的servCode
                    platForm_Code: payInfo.PlatForm_Code, // 非必填项 平台编码 用于填写回调通知的平台编码，计费成功后通知该平台
                    campaignId: payInfo.CampaignId, // 非必填项 营销案ID 点播不填，包月选填
                    description: "健康魔方25元包月", // 必填项 计费信息描述
                    isMonthly: payInfo.IsMonthly, // 必填项 操作类型  0：点播 1：包月
                    customPeriod: payInfo.CustomPeriod, // 灵活计费必填，其他忽略 灵活计费周期长度 单位：月 若为0，表示周期无限长
                    // 周期内计费次数
                    // 若customerPeriod为0，BuiiTimes也为0；customerPeriod不为0，则BillTimes也不为0
                    billTimes: payInfo.BillTimes, // 灵活计费必填，其他忽略
                    billInterval: payInfo.BillInterval, // 灵活计费必填，其他忽略 每次计费的月份长度
                }
            ],
            verifyInfo: // 由于使用一键支付，该参数忽略
                {
                    userId: chargePolicy == 6 || chargePolicy == 8 ? orderInfo.PayNum : "", // 短验时必填项，为用户手机号
                    verifyCode: typeof verifyCode != "undefined" ? verifyCode : "" // 非必填项
                }
        };
        // 开始发起下单支付请求
        LMEPG.UI.showWaitingDialog("SDK正在支付,请等待...");
        console.log(JSON.stringify(payData));
        LMEPG.Log.info("_ADVPay payData > " + JSON.stringify(payData));
        // SDK提供下单支付接口
        migusdk.pay(JSON.stringify(payData), function (message, code, resultData) {
            LMEPG.Log.info("_ADVChargePolicy result code > " + code + " message > " + message);
            // 恢复初始化之前的状态值
            LMEPG.UI.dismissWaitingDialog();
            if (code == "4901" || code == "0000") {
                // 返回0000或4901（包月业务受理）表示收到计费请求，此时可调视讯的接口轮询结果
                LMEPG.UI.showWaitingDialog("SDK支付完成,查询结果...", 30);
                Pay.loopPayResult();
            } else {
                // 提示用户当前次订购失败
                Pay.isClickPaying = false;
                LMEPG.UI.showToast("SDK支付失败，" + message, 3);
            }
        });
    },

    /**
     * 轮询支付结果
     */
    loopPayResult: function () {
        LMEPG.Log.info("pay.js loopPayResult start ...... ");
        // 统一关闭轮询加载dialog及相关释放提示
        var dismissDialogWithToast = function (msg, isUpdateVerifyCode, isNeedCancelPaying) {
            Pay.resetLoopPayResultFlags(isNeedCancelPaying);
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast(msg);
            !!isUpdateVerifyCode && SecondToast.randomNumber();//更新随机码
        };
        var queryData = {
            externalSeqNum: Pay.payingData.payParamInfo.externalSeqNum,
            payNum: Pay.payingData.payParamInfo.payParam.PayNum
        };
        LMEPG.ajax.postAPI("Pay/ADVPayResult", queryData, function (data) {
            if (data && data.result == "0") {
                console.debug("pay.js ADVPayResult data: " + JSON.stringify(data));
                LMEPG.Log.info("pay.js ADVPayResult data: " + JSON.stringify(data));
                if (data.payResult == "0") {
                    // SDK支付成功，调用最终的支付接口
                    LMEPG.UI.dismissWaitingDialog();
                    Pay.syncPayInfo();
                } else {
                    // SDK支付最终结果暂时未知（可能延时、或可能正在受理中、或可能等待支付、或最终受理失败）
                    // 注：查询结果与局方计费系统入库可能存在时延。故在指定时长段内多次轮询，以达到超时的最终结果为评判标准~（Songhui on 2020-1-7）
                    if (Pay.loopPayResultTimes > Pay.loopPayResultMaxSec) {
                        // 轮询超时！
                        switch (parseInt(data.payResult)) {
                            case 2://支付正在受理中（2）
                                dismissDialogWithToast("支付受理超时，请重试！", true);
                                break;
                            case 3://等待支付（3）
                                dismissDialogWithToast("用户未支付！", true);
                                break;
                            case 1://支付失败（1）
                                dismissDialogWithToast("支付失败！", true);
                                break;
                            default://支付失败（其他状态码）
                                dismissDialogWithToast("支付失败[" + data.payResult + "]！", true);
                                break;
                        }
                    } else {
                        // 继续轮询中...
                        Pay.loopPayResultTimes++;//轮询超时自增1秒
                        setTimeout(Pay.loopPayResult, 1000);
                    }
                }
            } else {
                dismissDialogWithToast("查询订购结果失败！", true);
            }
        });
    },

    syncPayInfo: function () {
        var payData = {
            apkInfo: encodeURIComponent(JSON.stringify(RenderParam.apkInfo)),
            orderItem: JSON.stringify(Pay.payingData.orderItem),
            productInfo: JSON.stringify(Pay.payingData.authProduct),
            payParamInfo: JSON.stringify(Pay.payingData.payParamInfo),
        };
        LMEPG.UI.showWaitingDialog("SDK订购完成,查询结果完成，准备支付...");
        LMEPG.ajax.postAPI("Pay/ADVOrder", payData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            Pay.isClickPaying = false;
            if (data && data.result == "0") {
                LMEPG.UI.showToast("支付成功！");
            } else {
                LMEPG.UI.showToast("支付失败！");
            }
            onDelayBack();
        });
    }
};

