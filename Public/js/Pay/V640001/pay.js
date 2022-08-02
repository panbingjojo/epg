var buttons = [];   // 定义全局按钮
var imgUrl = ROOT + "/Public/img/hd/Pay/V640001/";

var LOG_TAG = "pay.js[640001]";

function is_run_on_PC() {
    return typeof window.isRunOnPC === 'undefined' || window.isRunOnPC;
}

function printLog(funcName, msg, errorLevel) {
    if (LMEPG.Func.isObject(msg) || LMEPG.Func.isArray(msg)) msg = JSON.stringify(msg, null, 4);
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
    LMEPG.UI.showToast(line1+line2, seconds, callback);
}

// 返回按键
function onBack() {
    //LMEPG.Intent.back();
    jumpAuthOrder();
}

function jumpAuthOrder() {
    var objDst = LMEPG.Intent.createIntent("authOrder");
    LMEPG.Intent.jump(objDst);
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

    orderIndex: 0, // 订购套餐项对应的下标，套餐选择项页面在局方，目前固定第一个
    isRefreshOnly: 1, // 订购成功后，仅刷新当前页面！！！

    /**
     * SDK支付成功后，默认轮询鉴权的配置。
     */
    reAuthConfig: {
        currentPollingIndex: 0,         //当前正在轮询鉴权的次数（默认为0，每次开始轮询前再自增1）
        allowedPollingMaxTimes: 5,      //可允许轮询鉴权的最大次数
        allowedIntervalSec: 6,          //两次轮询鉴权的时间间隔（单位：秒）
    },

    init: function () {
        if (typeof RenderParam.orderItems === "undefined" || RenderParam.orderItems === null || RenderParam.orderItems === "") {
            showToastWith2LineStyle("唉呀，出错啦！", "后台运营未配置套餐选项", 3, "LMEPG.Intent.back()");
            return;
        }

        buttons.push({
            id: 'debug',
            name: '默认焦点',
        });
        LMEPG.ButtonManager.init('', buttons, '', true);

        Pay.performClickPayItem({
            orderItems: RenderParam.orderItems,
            orderIndex: Pay.orderIndex,
            reason: RenderParam.orderReason,
            remark: RenderParam.remark,
            refreshOnly: Pay.isRefreshOnly,//订购成功后，仅刷新当前页面！！！
        });

        /*var payCallBackInfo = {
               "lmuid": "4021002",
               "lmcid": "640001",
               "lmVipId": "62",
               "lmVipType": "2",
               "lmOrderReason": "102",
               "lmRemark": "生活中怎样保护颈椎？",
               "lmOrderId": "202008060925555157552058706",
               "contentName": "",
               "productId": "s8801000556",
               "productType": "MONTH",
               "payPhone": "",
               "timestamp": "20200806092555",
               "productName": "0.01测试包月",
               "price": "1",
               "payPrice": "1",
               "payResultFlag": 1
           };
           Pay.jumpPayCallback(payCallBackInfo);*/
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
        if (!LMEPG.Func.isArray(data.orderItems) || data.orderItems.length <= data.orderIndex) {
            printLog("performClickPayItem: 订购项不匹配", data.orderIndex, true);
            showToastWith2LineStyle("抱歉，无法订购！", "订购项不匹配", 3);
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
            showToastWith2LineStyle("温馨提示：", "请在IPTV盒子上进行订购！");
            return;
        }

        Pay.startAndroidSDKAuth(reqPayInfo);
    },

    /**
     * 订购成功回调（同步）
     * @param lmPayInfo 订购前我方传递的所有相关订购参数，同时也会包含部分产品信息
     */
    /*jumpPayCallback: function (lmPayInfo) {
        printLog("由sdk返回同步通知后端，lmPayInfo:", lmPayInfo);
        LMEPG.ajax.postAPI("Pay/getPayCallbackUrl", lmPayInfo, function (data) {
            if (data.result === 0 && !is_empty(data.pay_callback_url)) {
                LMEPG.KeyEventManager.setAllowFlag(false);//避免在此延时过程中用户按返回退出，未执行后端callback系列逻辑导致未对此次订购上报，从而引发一此时序上的问题。故此间禁止用户操作！
                setTimeout(function () {
                    LMEPG.KeyEventManager.setAllowFlag(true);
                    var jumpUrl = LMEPG.Intent.getAppRootPath() + data.pay_callback_url;
                    printLog("请求同步地址，jumpUrl:",jumpUrl);
                    window.location.href = jumpUrl;
                }, 5000); //延迟再通知返回，让上一步的toast("订购成功！")有足够展示时间！
            } else {
                printLog("jumpPayCallback-->getPayCallbackUrl Failed! result: ", data, true);
                showToastWith2LineStyle("唉呀，出错啦！", "获取回调地址出错[{0}]".format(data.result));
            }
        })
    },*/

    /**
     * 订购成功回调（同步）
     * @param lmPayInfo 订购前我方传递的所有相关订购参数，同时也会包含部分产品信息
     */
    jumpPayCallback: function (lmPayInfo) {
        printLog("由sdk返回同步通知后端，lmPayInfo:", lmPayInfo);
        LMEPG.ajax.postAPI("Pay/uploadPayResult", lmPayInfo, function () {
            jumpAuthOrder();
            //LMEPG.Intent.back();
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
            if (data.result == 0 && LMEPG.Func.isObject(data.payInfo)) {
                Pay.startAndroidSDKPay(reqAuthParams, data.payInfo, authProductData); // 得到支付参数成功，例如我方生成order_id等
            } else {
                LMEPG.UI.dismissWaitingDialog();
                printLog("buildPayInfoAndJump-->Failed! result: ", data, true);
                showToastWith2LineStyle("内部系统处理订单失败！", "["+data.result+", "+data.msg+"]");
            }
        });
    },

    /**
     * 易视腾增管平台：在Android端，使用SDK进行计费订购。
     *
     * @param reqAuthParams 透传顺序执行前上一次的鉴权请求参数，用于支付成功后再次调用鉴权接口查询此次订购是否真正在局方计费系统入库成功
     * @param reqPayInfo 请求sdk支付接口传递下去的所有相关参数
     * @param authProductData 顺序执行前上一次的鉴权后返回的可订购产品包（取第1个，我们只有一个套餐）
     */
    startAndroidSDKPay: function (reqAuthParams, reqPayInfo, authProductData) {
        // 逻辑备注：
        //      从鉴权产品列表取出相关支付信息并绑定到当前payInfo里，当sdk完成支付后会把原始的payInfo（该参数）透传上来，
        // 这样就可以用作订购成功上报后台cws。
        // reqPayInfo = Pay.bindAuthProductInfoToPay(reqPayInfo, authProductData);
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
                        //showToastWith2LineStyle("支付失败！", "[{0}, {1}]".format(paySdkResultCode, paySdkResultMsg), 5); //注：不显示支付失败的返回码
                        showToastWith2LineStyle("支付失败！", paySdkResultMsg, 5);
                    }
                } else {
                    LMEPG.UI.showToast("处理订购结果失败！{"+handledRC+"}");
                    printLog("处理订购结果失败：", handledMsg, true);
                    jumpAuthOrder();
                }
            });
            //////////////////////////////////////////////////////

        }); // #Endof LMAndroid.JSCallAndroid.doPay
    },

    /**
     * 在启动sdk订购前，把部分鉴权返回的产品信息整合进去。
     * @param payInfoObj 原始的订购信息
     * @param authProductInfo 鉴权后返回的产品包信息
     */
    bindAuthProductInfoToPay: function (payInfoObj, authProductInfo) {
        if (LMEPG.Func.isObject(authProductInfo)) {
            payInfoObj.productId = LMEPG.Func.isEmpty(payInfoObj.productId) ? authProductInfo.productId : payInfoObj.productId;//产品包ID
            payInfoObj.productName = authProductInfo.productName;//产品名称
            payInfoObj.productType = authProductInfo.productType;//产品包类型 SINGLE(\"单片包\"), MONTH(\"月包\")
            payInfoObj.price = authProductInfo.price;//产品包原价
            payInfoObj.payPrice = authProductInfo.payPrice;//产品包实际支付价格（分）
            payInfoObj.renewStatus = authProductInfo.renewStatus;//续订状态：0:不续订；1:续订
            if (LMEPG.Func.isObject(authProductInfo.payInfo)) { //TODO 文档上说的是“支付信息列表”
                payInfoObj.payType = authProductInfo.payInfo.payType;//支付方式
                payInfoObj.payPrice = authProductInfo.payInfo.payPrice;//支付价格(单位分)
            } else if (LMEPG.Func.isArray(authProductInfo.payInfo) && authProductInfo.payInfo.length > 0 && LMEPG.Func.isObject(authProductInfo.payInfo[0])) {
                payInfoObj.payType = authProductInfo.payInfo[0].payType;//支付方式
                payInfoObj.payPrice = authProductInfo.payInfo[0].payPrice;//支付价格(单位分)
            } else {
                printLog("产品[0]的payInfo无效!", authProductInfo.payInfo, true);
            }
        }
        return payInfoObj;
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
            printLog("轮询鉴权调用", "鉴权此次订购次数最大次数"+Pay.reAuthConfig.allowedPollingMaxTimes+"次("+Pay.reAuthConfig.allowedIntervalSec * Pay.reAuthConfig.allowedPollingMaxTimes+"s)仍未查询订购结果，失败！", true);
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
                        LMAndroid.JSCallAndroid.doUpdateUserInfo(JSON.stringify({"isVip": 1})); // 需要把vip值持久化到apk层

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
                            showToastWith2LineStyle("抱歉！", "您已经订购过了~");
                            LMAndroid.JSCallAndroid.doUpdateUserInfo(JSON.stringify({"isVip": 1})); // 需要把vip值持久化到apk层
                        } else {
                            authProductList = authProductList.productList;
                            if (LMEPG.Func.isArray(authProductList) && authProductList.length > 0) { //按理isAuthSuccess=0时表示未订购会返回authProductList，但不确定sdk或者解析数据是否异常，故double-check!!!
                                Pay.buildPayInfoAndJump(reqAuthParams, reqPayInfo, authProductList[0]/*取第1个产品包，我们只有一个套餐*/);
                            } else {
                                LMEPG.UI.dismissWaitingDialog();
                                //showToastWith2LineStyle("鉴权失败！", "[{0}, {1}]".format(paySdkResultCode, paySdkResultMsg));//注：不显示支付失败的返回码
                                showToastWith2LineStyle("鉴权失败！", paySdkResultMsg);
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
};

