var buttons = [];
var returnUrl = '';                //订购返回地址
var PAY_TYPE_ANDROID = 1;
var PAY_TYPE_WEB = 2;
var PAY_TYPE_HTTP = 3;
var payType = PAY_TYPE_ANDROID;//是否需要android才能跳转到局方订购页
var payAccount = "-1";             //订购账号
var regionCode = "";
var queryOrderTime = 20;         //查询订单最大次数
var tradeNo = '';                //订单号

var Pay = {

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI("Pay/buildPayUrl", payInfo, function (data) {
            if (data.result == 0) {
                Pay.toPay(data.payUrl);
            } else {
                //获取订购参数失败
                if(LMEPG.Func.isExist(data.message)){
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
    onPayItemClick: function () {
        var item = RenderParam.orderItems[0];
        var PayInfo = {
            "vip_id": item.vip_id,
            "vip_type": item.vip_type,
            "goods_name": item.goods_name,
            "userId": RenderParam.userId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "price": item.price,
            "returnPageName": RenderParam.returnPageName,
        };
        Pay.buildPayInfo(PayInfo);
    },

    /**
     * 初始化订购页
     */
    init: function () {
        LMEPG.BM.init([''], [], false, true);
        if (typeof(RenderParam.orderItems) === "undefined" || RenderParam.orderItems == "") {
            LMEPG.UI.showToast("没有套餐",100);
            onBackDelay();
            return;
        }

        Pay.onPayItemClick();
    },

    /**
     * 去订购
     */
    toPay: function (payUrl) {
        task.initAndJump(payUrl);
    },

};

var task = {
    objIFrame: null,
    // 构建IFrame对象
    buildIFrameObject: function (id) {
        if (!task.objIFrame) {
            task.objIFrame = document.createElement("iframe");
            task.objIFrame.name = id;
            task.objIFrame.id = id;
            //设置iframe的样式
            task.objIFrame.style.overflow = "hidden";
            task.objIFrame.style.border = "none";
            task.objIFrame.style.zIndex = "9999";
            task.objIFrame.style.position = "absolute";
            task.objIFrame.style.top = "0px";
            task.objIFrame.style.left = "0px";
            task.objIFrame.width = "1280px";
            task.objIFrame.height = "720px";
            task.objIFrame.scrolling = "no";
            task.objIFrame.frameborder = "0";
        }
        return task.objIFrame;
    },
    // 增加IFrame对象到body中
    addIFrameToBody: function (obj) {
        var body = document.body;
        if (body){
            body.appendChild(obj);
        }
        return body;
    },
    // 加载IFrame
    loadIFrame: function (url) {
        if (task.objIFrame) {
            task.objIFrame.src = url;
        }
        task.objIFrame.onload = function () {
            LMEPG.Log.info("onload....");
            // 为了避免页面跳转时，看到背景图，所以把背景图去掉
            parent.document.getElementById("bg_pay").src = ROOT + "/Public/img/Common/spacer.gif";
        }
    },

    initAndJump: function (url) {
        var obj = task.buildIFrameObject("Host");
        if (!obj) {
            setTimeout(task.initAndJump, 500);
            return;
        }
        var body = task.addIFrameToBody(obj);
        if (!body) {
            setTimeout(task.initAndJump, 500);
            return;
        }
        task.loadIFrame(url);
    },
};

/**
 * 返回（延时）
 */
function onBackDelay() {
    setTimeout(function () {
        onBack();
    }, 2000);
}

function onBack() {
    LMEPG.UI.dismissWaitingDialog('');
    LMEPG.Intent.back();
}