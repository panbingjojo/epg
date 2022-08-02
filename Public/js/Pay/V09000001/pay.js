// +----------------------------------------------------------------------
// | apk
// +----------------------------------------------------------------------
// | [计费页逻辑-广西移动怡伴] 页面控制js
// +----------------------------------------------------------------------
// | Author: listen
// | Date: 2020-10-19 17:37
// +----------------------------------------------------------------------


var LOG_TAG = "pay.js[09000001]";
var debug = true;

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


var Pay = {
    /**
     * 初始化
     */
    init: function () { // 初始化程序
        LMEPG.ButtonManager.init("", [], "", true);
        Pay.doPay();
    },
    /**
     * 开始订购
     */
    doPay: function () {  //支付方法
        LMEPG.UI.showWaitingDialog("", 30);
        LMEPG.ajax.postAPI("Pay/buildPayUrl", "", function (data) {
            printLog("启动SDK支付接口->buildPayUrl：", JSON.stringify(data));
            LMEPG.UI.dismissWaitingDialog();
            if (data.result == 0 && data.payInfo.productId) {
                var authType = data.authType;
                var params = {
                    userId: RenderParam.userId,// 用户userid
                    productId: data.payInfo.productId,  // 产品id，必传
                    contentId: data.payInfo.contentId  // 产品id，必传
                }
                printLog("启动SDK支付接口->参数：", JSON.stringify(params));
                LMAndroid.JSCallAndroid.doPay(JSON.stringify(params), function (jsonFromAndroid, notifyAndroidCallback) {
                    printLog("启动SDK支付接口->Android返回结果：", jsonFromAndroid);
                    printLog("启动SDK支付接口->authType：", authType);
                    var result = JSON.parse(jsonFromAndroid);
                    var contentId = "";
                    if(result.data != "undefined" && result.data != ""){
                        var resultData = JSON.parse(result.data);
                        contentId = resultData.contentId;
                    }
                    if (authType == 1) {
                        if (result.result == "1") {
                            var postData = {
                                "isSuccess": "支付成功"
                            };
                            if(contentId != ""){
                                postData.contentId = contentId;
                            }
                            Pay.paySuccessCallback(postData);
                        } else {
                            LMEPG.UI.dismissWaitingDialog();
                            LMEPG.UI.showToast("订购失败!!")
                            Pay.jumpAppHome();
                        }
                    } else {
                        if (result.result == "1") {
                            var postData = {
                                "isSuccess": result.result
                            };
                            if(contentId != ""){
                                postData.contentId = contentId;
                            }
                            Pay.paySuccessCallback(postData);
                        } else {
                            LMEPG.UI.dismissWaitingDialog();
                            printLog("doPay()->Android返回结果：", result.result);
                            Pay.jumpAppHome();
                        }
                    }
                });
            } else {
                LMEPG.UI.dismissWaitingDialog();
                printLog("buildPayInfoAndJump-->Failed! result: ", data, true);
            }
        });
    },
    /**
     * 订购成功才上报数据
     * @param data
     */
    paySuccessCallback: function (data) {
        LMEPG.Log.info("[09000001 pay.js] Pay/uploadPayResult：参数" + JSON.stringify(data));
        LMEPG.ajax.postAPI("Pay/uploadPayResult", data, function (res) {
            printLog("[09000001 pay.js] Pay/uploadPayResult：结果" , JSON.stringify(res));
            if (res.result == 0) {
                LMEPG.UI.showToast("订购成功!!")
                Pay.jumpAppHome();
                printLog("paySuccessCallback", "数据上报成功", false);
            } else {
                LMEPG.UI.showToast("结果上报失败,请重启客户端!!刷新VIP状态")
                Pay.jumpAppHome();
                printLog("paySuccessCallback", "数据上报失败", false);
            }
        })
    },

    /**
     * 跳转 - 应用首页
     */
    jumpAppHome: function () {
        LMEPG.Intent.back();
    },
};
var onBack = function () {
    LMEPG.Intent.back();
};



