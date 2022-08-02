// +----------------------------------------------------------------------
// | MoFang-EPG-LWS
// +----------------------------------------------------------------------
// | [计费页逻辑-黑龙江移动] 页面控制js
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019-8-15 14:03
// +----------------------------------------------------------------------

// 必须：优先引入通用处理js文件！！！
document.write('<script type="text/javascript" src="' + g_appRootPath + '/Public/js/Pay/V01230001/pay_sdk_util.js?t=' + new Date().getTime() + '"></script>');

var LOG_TAG = "pay.js[01230001]";
var debug = true;

function is_array(obj) {
    return LMEPG.Func.isArray(obj);
}

function is_object(obj) {
    return LMEPG.Func.isObject(obj);
}

function is_empty(obj) {
    return LMEPG.Func.isEmpty(obj);
}

function is_run_on_PC() {
    return typeof window.isRunOnPC === 'undefined' || window.isRunOnPC;
}

function printLog(funcName, msg, errorLevel) {
    if (is_object(msg) || is_array(msg)) msg = JSON.stringify(msg, null, 4);
    if (errorLevel) {
        if (debug) console.error(LOG_TAG + "--->[" + funcName + "]--->", msg);
        if (LMEPG.Log) LMEPG.Log.error(LOG_TAG + "--->[" + funcName + "]--->" + msg);
    } else {
        if (debug) console.log(LOG_TAG + "--->[" + funcName + "]--->", msg);
        if (LMEPG.Log) LMEPG.Log.info(LOG_TAG + "--->[" + funcName + "]--->" + msg);
    }

    var isScreenDebug = false; //用于屏幕日志调试，release请置为false！！！
    if (isScreenDebug) LMEPG.UI.logPanel.i(msg, funcName + "-->", true);
}

function showToastWith2LineStyle(line1, line2, seconds, callback) {
    var cssBigTitle = 'font-size:' + (RenderParam.platformType === 'fhd' ? '100px' : '60px');
    LMEPG.UI.showToast('<span style="'+cssBigTitle+'">'+line1+'</span><br/><br/><span style="color: white;">'+line2+'</span>', seconds, callback);
}

var buttons = [];
var Pay = {

    /**
     * SDK支付成功后，默认轮询鉴权的配置。
     */
    reAuthConfig: {
        currentPollingIndex: 0,         //当前正在轮询鉴权的次数（默认为0，每次开始轮询前再自增1）
        allowedPollingMaxTimes: 5,      //可允许轮询鉴权的最大次数
        allowedIntervalSec: 6,          //两次轮询鉴权的时间间隔（单位：秒）
    },

    /**
     * 订购成功回调（同步）
     * @param lmPayInfo 订购前我方传递的所有相关订购参数，同时也会包含部分产品信息
     */
    jumpPayCallback: function (lmPayInfo) {
        printLog("由sdk返回同步通知后端，lmPayInfo:", lmPayInfo);
        LMEPG.ajax.postAPI("Pay/getPayCallbackUrl", lmPayInfo, function (data) {
            if (data.result === 0 && !is_empty(data.pay_callback_url)) {
                LMEPG.KeyEventManager.setAllowFlag(false);//避免在此延时过程中用户按返回退出，未执行后端callback系列逻辑导致未对此次订购上报，从而引发一此时序上的问题。故此间禁止用户操作！
                setTimeout(function () {
                    LMEPG.KeyEventManager.setAllowFlag(true);
                    window.location.href = data.pay_callback_url;
                }, 5000); //延迟再通知返回，让上一步的toast("订购成功！")有足够展示时间！
            } else {
                printLog("jumpPayCallback-->getPayCallbackUrl Failed! result: ", data, true);
                showToastWith2LineStyle("唉呀，出错啦！", "获取回调地址出错["+data.result+"]");
            }
        })
    },

    /**
     * 构建支付请求额外参数
     *
     * @param reqAuthParams 透传顺序执行前上一次的鉴权请求参数，用于支付成功后再次调用鉴权接口查询此次订购是否真正在局方计费系统入库成功
     * @param reqPayInfo 请求sdk支付接口传递下去的所有相关参数
     * @param authProductData 鉴权后返回的可订购产品包信息（第1个）
     */
    buildPayInfoAndJump: function (reqAuthParams, reqPayInfo, authProductData) {
        LMEPG.ajax.postAPI("Pay/buildPayUrl", reqPayInfo, function (data) {
            if (data.result == 0 && is_object(data.payInfo)) {
                Pay.startAndroidSDKPay(reqAuthParams, data.payInfo, authProductData); // 得到支付参数成功，例如我方生成order_id等
            } else {
                LMEPG.UI.dismissWaitingDialog();
                printLog("buildPayInfoAndJump-->Failed! result: ", data, true);
                showToastWith2LineStyle("内部系统处理订单失败！", "["+data.result+", "+data.msg+"]");
            }
        });
    },

    /**
     * 重新调用sdk鉴权询价接口判定当前“支付成功”后的真正订购成功了。注意：只有在知道sdk支付成功后，才能回调该方法。
     * <pre>
     *      1. 官方要求：由于支付接口goOrder返回的result为成功状态的值仅仅是一个临时结果，是否在局方计费系统已经完全入库，
     * 产生真实的订购记录信息，需要我们再次手动调用鉴权接口。
     *      2. 加强处理：可能存在时延可能，即当收到sdk支付接口result返回值成功（临时结果），我们再去调用sdk鉴权询价接口发现，
     * 鉴权还是失败（可能局方计费系统还在处理入库订单信息等等）。如果处理不当，当局方处理订单到入库的时间稍长但我们未正确考虑
     * 这种因素，我方上报cws系统就缺失信息了，就无法真正跟踪用户订购统计了。鉴于这种情况，为了确保用户的订购体验，我们要对这种
     * 极端情况做出恰当的“经验策略”处理：
     *          A' 定时轮询调用sdk鉴权询价接口。
     *          B' 默认定时轮询3次，若在3次鉴权都不通过，我们就结束这种处理，认为此次订购失败。
     *          C' 默认延时下次鉴权询价的时间，暂定3秒。（需要联调及经验值评估）
     *          D' 若指定轮询鉴权周期内查询此次订购已经真正成功，则上报我方cws统计系统。
     * </pre>
     * @param reqAuthParams 向sdk发起“鉴权”操作的相关请求参数，懒得再次耗时从服务器ajax获取了，通过上一次透传即可！
     * @param reqPayInfo 向sdk发起“支付”操作的相关请求参数，通过上一次透传即可！
     */
    reAuthAfterPaySuccessCallback: function (reqAuthParams, reqPayInfo) {
        Pay.reAuthConfig.currentPollingIndex++;
        if (Pay.reAuthConfig.currentPollingIndex > Pay.reAuthConfig.allowedPollingMaxTimes) {
            printLog("轮询鉴权调用", "鉴权此次订购次数最大次数"+Pay.reAuthConfig.allowedPollingMaxTimes+
                "次("+Pay.reAuthConfig.allowedIntervalSec * Pay.reAuthConfig.allowedPollingMaxTimes+"s)仍未查询订购结果，失败！", true);
            showToastWith2LineStyle("订购失败！", "未查询到已订购信息");
            return;
        }

        showToastWith2LineStyle("支付成功！", "正在确认订购结果......", 60);
        LMAndroid.JSCallAndroid.doUserTypeAuth(JSON.stringify(reqAuthParams), function (jsonFromAndroid) {
            printLog("轮询SDK鉴权接口["+Pay.reAuthConfig.allowedIntervalSec+"]->sdk result:", jsonFromAndroid);
            //////////////////////////////////////////////////////
            PaySdk.handleAuthResultFromAndroid(reqAuthParams, jsonFromAndroid, function (handledRC, handledMsg, isAuthSuccess, paySdkResultCode, paySdkResultMsg, authProductList) {
                if (handledRC === 1) {
                    if (isAuthSuccess) {
                        LMEPG.UI.showToast("订购成功！", 10); //提示用户此次订购成功
                        LMAndroid.JSCallAndroid.doUpdateUserInfo(JSON.stringify({"isVIP": 1})); // 需要把vip值持久化到apk层

                        // 请求计费前传递的原始订购参数，如数解析还原并作为输入参数请求同步回调通知！！！
                        var lmPayInfo = reqPayInfo;
                        lmPayInfo.payResultFlag = 1;//局方订购成功（我们定义的payResultFlag，用于上报cws）！！！必须手动置1表示成功！！！
                        Pay.jumpPayCallback(lmPayInfo);
                    } else {
                        setTimeout(function () {
                            printLog("轮询鉴权调用", "时间到！[间隔"+Pay.reAuthConfig.allowedIntervalSec+"s]开始新一轮鉴权...");
                            Pay.reAuthAfterPaySuccessCallback(reqAuthParams, reqPayInfo);
                        }, Pay.reAuthConfig.allowedIntervalSec * 1000);
                    }
                } else {
                    printLog("处理鉴权结果失败：", handledMsg, true);
                }
            });
            //////////////////////////////////////////////////////
        });
    },

    /**
     * 黑龙江移动：在Android端，使用SDK进行计费产品鉴权。
     * @param reqPayInfo 透传初始参数
     */
    startAndroidSDKAuth: function (reqPayInfo) {
        LMEPG.UI.showWaitingDialog("正在下单，请稍后……");

        // 1. 先从后端获取鉴权所需参数
        LMEPG.ajax.postAPI("Pay/getUserTypeAuthParams", null, function (reqAuthParams) {

            // 2. 再向SDK请求鉴权
            LMAndroid.JSCallAndroid.doUserTypeAuth(JSON.stringify(reqAuthParams), function (jsonFromAndroid) {
                printLog("首次启动SDK鉴权接口->请求参数:", JSON.stringify(reqAuthParams));
                printLog("首次启动SDK鉴权接口->Android返回结果：", jsonFromAndroid);

                //////////////////////////////////////////////////////
                PaySdk.handleAuthResultFromAndroid(reqAuthParams, jsonFromAndroid, function (handledRC, handledMsg, isAuthSuccess, paySdkResultCode, paySdkResultMsg, authProductList) {
                    if (handledRC === 1) {
                        if (isAuthSuccess) {
                            LMEPG.UI.dismissWaitingDialog();
                            showToastWith2LineStyle("抱歉！", "您已经订购过了~",1,"LMEPG.Intent.back()");
                            LMAndroid.JSCallAndroid.doUpdateUserInfo(JSON.stringify({"isVIP": 1})); // 需要把vip值持久化到apk层
                        } else {
                            if (is_array(authProductList) && authProductList.length > 0) { //按理isAuthSuccess=0时表示未订购会返回authProductList，但不确定sdk或者解析数据是否异常，故double-check!!!
                                Pay.buildPayInfoAndJump(reqAuthParams, reqPayInfo, authProductList[0]/*取第1个产品包，我们只有一个套餐*/);
                            } else {
                                LMEPG.UI.dismissWaitingDialog();
                                showToastWith2LineStyle("鉴权失败！", paySdkResultMsg,1,"LMEPG.Intent.back()");
                            }
                        }
                    } else {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("处理鉴权结果失败！"+handledRC);
                        printLog("处理鉴权结果失败：", handledMsg, true);
                    }

                });
                //////////////////////////////////////////////////////

            }); // #Endof LMAndroid.JSCallAndroid.doUserTypeAuth
        }); // #Endof LMEPG.ajax.postAPI
    },

    /**
     * 在启动sdk订购前，把部分鉴权返回的产品信息整合进去。
     * @param payInfoObj 原始的订购信息
     * @param authProductInfo 鉴权后返回的产品包信息
     */
    bindAuthProductInfoToPay: function (payInfoObj, authProductInfo) {
        if (is_object(authProductInfo)) {
            payInfoObj.productId = is_empty(payInfoObj.productId) ? authProductInfo.productId : payInfoObj.productId;//产品包ID
            payInfoObj.productName = authProductInfo.productName;//产品名称
            payInfoObj.productType = authProductInfo.productType;//产品包类型 SINGLE(\"单片包\"), MONTH(\"月包\")
            payInfoObj.price = authProductInfo.price;//产品包原价
            payInfoObj.payPrice = authProductInfo.payPrice;//产品包实际支付价格（分）
            payInfoObj.renewStatus = authProductInfo.renewStatus;//续订状态：0:不续订；1:续订
            if (is_object(authProductInfo.payInfo)) { //TODO 文档上说的是“支付信息列表”
                payInfoObj.payType = authProductInfo.payInfo.payType;//支付方式
                payInfoObj.payPrice = authProductInfo.payInfo.payPrice;//支付价格(单位分)
            } else if (is_array(authProductInfo.payInfo) && authProductInfo.payInfo.length > 0 && is_object(authProductInfo.payInfo[0])) {
                payInfoObj.payType = authProductInfo.payInfo[0].payType;//支付方式
                payInfoObj.payPrice = authProductInfo.payInfo[0].payPrice;//支付价格(单位分)
            } else {
                printLog("产品[0]的payInfo无效!", authProductInfo.payInfo, true);
            }
        }
        return payInfoObj;
    },

    /**
     * 黑龙江移动：在Android端，使用SDK进行计费订购。
     *
     * @param reqAuthParams 透传顺序执行前上一次的鉴权请求参数，用于支付成功后再次调用鉴权接口查询此次订购是否真正在局方计费系统入库成功
     * @param reqPayInfo 请求sdk支付接口传递下去的所有相关参数
     * @param authProductData 顺序执行前上一次的鉴权后返回的可订购产品包（取第1个，我们只有一个套餐）
     */
    startAndroidSDKPay: function (reqAuthParams, reqPayInfo, authProductData) {
        // 逻辑备注：
        //      从鉴权产品列表取出相关支付信息并绑定到当前payInfo里，当sdk完成支付后会把原始的payInfo（该参数）透传上来，
        // 这样就可以用作订购成功上报后台cws。
        reqPayInfo = Pay.bindAuthProductInfoToPay(reqPayInfo, authProductData);
        var payJson = JSON.stringify(reqPayInfo);
        printLog("启动SDK支付接口", "payInfo: " + payJson);

        LMEPG.UI.dismissWaitingDialog();

        // 请求SDK请求支付订购
        LMAndroid.JSCallAndroid.doPay(payJson, function (jsonFromAndroid) {
            printLog("启动SDK支付接口->Android返回结果：", jsonFromAndroid);

            //////////////////////////////////////////////////////
            PaySdk.handlePayResultFromAndroid(payJson, jsonFromAndroid, function (handledRC, handledMsg, isPaySuccess, paySdkResultCode, paySdkResultMsg) {
                if (handledRC === 1) {
                    if (isPaySuccess) {
                        Pay.reAuthAfterPaySuccessCallback(reqAuthParams, reqPayInfo);
                    } else {
                        LMEPG.Intent.back();
                        showToastWith2LineStyle("支付失败！", '');
                    }
                } else {
                    LMEPG.UI.showToast("处理订购结果失败！"+handledRC);
                    printLog("处理订购结果失败：", handledMsg, true);
                }
            });
            //////////////////////////////////////////////////////

        }); // #Endof LMAndroid.JSCallAndroid.doPay
    },

    /**
     * 执行订购指定号数订购项
     * <pre>
     *     data:
     *     {
     *         orderItems: [],      //订购项
     *         orderIndex: 0,       //待订购项索引号，>=0
     *         reason: 100,         //订购理由
     *         remark: "备注",      //备注说明
     *         refreshOnly: 0,      //由前端透传控制：订购成功是否仅仅刷新当前页（当且仅当为1时），或者默认lmBackPage返回！
     *     }
     * </pre>
     * @param data [object] 配置信息
     */
    performClickPayItem: function (data) {
        console.debug("Pay.performClickPayItem", data);
        if (!is_array(data.orderItems) || data.orderItems.length <= data.orderIndex) {
            printLog("performClickPayItem: 订购项不匹配", data.orderIndex, true);
            showToastWith2LineStyle("抱歉，无法订购！", "订购项不匹配", 3,"LMEPG.Intent.back()");
            return;
        }

        var orderItem = data.orderItems[data.orderIndex];
        var reqPayInfo = {
            "lmVipId": orderItem.vip_id,
            "lmVipType": orderItem.vip_type,
            "lmOrderReason": data.reason,
            "lmRemark": data.remark,
            "lmRefreshOnly": data.refreshOnly,//由前端透传控制：订购成功是否仅仅刷新当前页（当且仅当为1时），或者默认lmBackPage返回！
        };

        printLog("点击按钮入口信息-->reqPayInfo: ", reqPayInfo);

        if (window.is_run_on_PC()) {
            showToastWith2LineStyle("温馨提示：", "请在IPTV盒子上进行订购！",1,"LMEPG.Intent.back()");

            return;
        }

        Pay.startAndroidSDKAuth(reqPayInfo);
    },

    /**
     * 点击订购项
     */
    onPayItemClick: function (btn) {
        Pay.performClickPayItem({
            orderItems: RenderParam.orderItems,
            orderIndex: btn.cIndex,
            reason: RenderParam.orderReason,
            remark: RenderParam.remark,
        });
    },

    /**
     * 初始化订购项
     */
    initPayItem: function () {
        switch (RenderParam.areaCode) {
            default:
                H("pay_item_1");  // 隐藏单月订购项
                buttons.push({
                    id: "pay_item_0",
                    name: "包月订购项",
                    type: "img",
                    //backgroundImage: g_appRootPath + "/Public/img/hd/Pay/V01230001/V1/bg_pay_item_0.png",
                    //focusImage: g_appRootPath + "/Public/img/hd/Pay/V01230001/V1/bg_pay_item_0.png",
                    click: Pay.onPayItemClick,
                    cIndex: 0,
                });
                break;
        }
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (typeof RenderParam.orderItems === "undefined" || RenderParam.orderItems === null || RenderParam.orderItems === "") {
            showToastWith2LineStyle("唉呀，出错啦！", "后台运营未配置套餐选项", 3, "LMEPG.Intent.back()");
            return;
        }

        //this.initPayItem();
        //LMEPG.BM.init("pay_item_0", buttons, "", true);
        //直接跳转订购
        Pay.performClickPayItem({
            orderItems: RenderParam.orderItems,
            orderIndex: 0,
            reason: RenderParam.orderReason,
            remark: RenderParam.remark,
        });
    }
};

/***************************************************************
 * 集成接入独立且非UI模块调用接口！（外部独立调用）
 ***************************************************************/
var lmPayApiExt = (function () {
    var clazz = function () {

        var self = this;

        // 存储订购项（null表示未初始化过）
        var orderItems = [];

        // 获取订购配置项
        var getPayOrderItems = function () {
            console.debug("lmPayApiExt.getPayOrderItems...");
            if (orderItems.length > 0) {
                console.debug("已经请求过订购项了，使用缓存");
                return orderItems;
            }
            LMEPG.ajax.postAPI("Pay/getPayOrderItems", null, function (data) {
                console.debug(data);
                orderItems = LMEPG.Func.isArray(data) ? data : [];
            }, function () {
                showToastWith2LineStyle("唉呀，出错啦！", "获取套餐选项网络出错");
            }, true);
        };

        /** 返回订购项 */
        this.getOrderItems = function () {
            return orderItems;
        };

        /**
         * 一键订购。内部默认获取第1个订购项，依次发起：鉴权->订购。且结果（成功或失败）以回调函数通知，应用层需要传递相关callback函数接收。
         // * @param fnSuccess [function] 成功回调
         // * @param fnFailed [function] 失败回调
         */
        this.goPay = function (/*fnSuccess, fnFailed*/) {
            // 1. 拿到配置订购项（同步执行）
            getPayOrderItems();

            // 2. 选择操作订购项（默认第1个，可通过形参数指定选择第x个）
            var orderItems = self.getOrderItems();
            if (orderItems.length <= 0) {
                showToastWith2LineStyle("唉呀，出错啦！", "后台运营未配置套餐选项");
                return;
            }
            var orderIndex = 0; // 订购套餐项索引号（默认第1个）

            // 3. 鉴权订购 -> 4. 启动订购 -> 5. 订购结果处理
            Pay.performClickPayItem({
                orderItems: orderItems,
                orderIndex: orderIndex,
                reason: "100",
                remark: "外部模块直接订购",
                refreshOnly: 1,//订购成功后，仅刷新当前页面！！！
            });
        };
    };
    return new clazz();
})();
