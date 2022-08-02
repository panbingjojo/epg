// +----------------------------------------------------------------------
// | apk
// +----------------------------------------------------------------------
// | [计费页逻辑-广西移动] 页面控制js
// +----------------------------------------------------------------------
// | Author: listen
// | Date: 2020-10-19 17:37
// +----------------------------------------------------------------------


var LOG_TAG = "pay.js[450001]";
var debug = true;

function printLog(funcName, msg, errorLevel) {
    if (LMEPG.Func.isObject(msg) || LMEPG.Func.isArray(msg)) msg = JSON.stringify(msg, null, 4);
    if (errorLevel) {
        if (debug) console.error(LOG_TAG + "--->[" + funcName + "]--->" + msg);
        if (LMEPG.Log) LMEPG.Log.error(LOG_TAG + "--->[" + funcName + "]--->" + msg);
    } else {
        if (debug) console.log(LOG_TAG + "--->[" + funcName + "]--->" + msg);
        if (LMEPG.Log) LMEPG.Log.info(LOG_TAG + "--->[" + funcName + "]--->" + msg);
    }

    var isScreenDebug = false; //用于屏幕日志调试，release请置为false！！！
    if (isScreenDebug) LMEPG.UI.logPanel.i(msg, funcName + "-->", true);
}


var buttons = [];
var Pay = {
    buttons: [], // 按钮数组
    init: function () { // 初始化程序
        LMEPG.KeyEventManager.delKeyEvent([KEY_BACK, KEY_BACK_640, KEY_BACK_ANDROID]);
        LMEPG.KeyEventManager.addKeyEvent({
            KEY_BACK: "onBack()",
            KEY_BACK_640: "onBack()",
            KEY_BACK_ANDROID: "onBack()"
        });
        // Pay.createBtns();
        // LMEPG.ButtonManager.init("order", Pay.buttons, '', true);
        Pay.doPay();
    },
    /**
     * 开始订购
     */
    doPay: function () {  //支付方法
        LMEPG.UI.showWaitingDialog("",30);
        LMEPG.ajax.postAPI("Pay/buildPayUrl", "", function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (data.result == 0 && data.payInfo.transactionid) {
                var params = {
                    userId: RenderParam.userId,                     // 用户userid
                    notifyUrl: data.payInfo.notifyUrl,              // 支付结果回调地址，必传
                    transactionid: data.payInfo.transactionid,      // 订单号，必传
                    productId: data.payInfo.productId,              // 产品id，非必传
                    productName: data.payInfo.productName,          // 产品id，非必传
                    price: data.payInfo.price                       // 产品价格，必传
                }
                LMAndroid.JSCallAndroid.doPay(JSON.stringify(params), function (jsonFromAndroid, notifyAndroidCallback) {
                    printLog("启动SDK支付接口->Android返回结果：", jsonFromAndroid);
                    var rootJson = JSON.parse(jsonFromAndroid);
                    var dataJson = JSON.parse(rootJson.data);
                    if (dataJson.result=="0"){
                        var uploadParam = {
                            result:dataJson.result,
                            tradeNo:dataJson.transactionid,
                            msg:dataJson.msg,
                            timestamp:dataJson.timestamp
                        };
                         Pay.paySuccessCallback(uploadParam);
                         printLog("doPay()->Android返回结果：", "订购成功");
                         Pay.jumpAppHome();
                    }else{
                         printLog("doPay()->Android返回结果：", "订购失败！");
                         printLog("doPay()->Android返回结果：", dataJson.result);
                         Pay.jumpAppHome();
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
    paySuccessCallback:function (data){
        LMEPG.ajax.postAPI("Pay/uploadPayResult", data, function (data) {
            if (data.result==0){
                printLog("paySuccessCallback","数据上报成功",false);
            }else {
                printLog("paySuccessCallback","数据上报失败",false);
            }
        })
    },

    /**
     * 跳转 - 应用首页
     */
    jumpAppHome: function () {

        var objHome = LMEPG.Intent.createIntent('home');
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', '0');

        LMEPG.Intent.jump(objHome);
    },

    createBtns: function () { //加入buttons
        Pay.buttons.push({
            id: 'order',
            name: '订购',
            type: 'img',
            nextFocusRight: "back",
            backgroundImage: ROOT + '/Public/img/hd/Pay/V450001/order.png',
            focusImage: ROOT + '/Public/img/hd/Pay/V450001/order_f.png',
            click: Pay.doPay,
        }, {
            id: 'back',
            name: '返回按钮',
            type: 'img',
            nextFocusLeft: 'order',
            backgroundImage: ROOT + '/Public/img/hd/Pay/V450001/back.png',
            focusImage: ROOT + '/Public/img/hd/Pay/V450001/back_f.png',
            click: onBack,

        });
    }
};

/**
 * 返回处理
 */
function onBack() {
    LMEPG.Intent.back();
}
