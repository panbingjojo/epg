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
var domShowDialog;
var vip_id_map = {               // 因小包订购时需要固定管理后台配置的映射关系，后期如有调整
    "0": "1", // 产品大包
    "1": "3", // 宝贝天地健康包
    "2": "4", // 中老年健康包
    "3": "2", // 健康生活包
    "4": "5", // 20元包月
    "5": "6", // 15元每次
};

var Pay = {

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/buildPayUrl", payInfo, function (data) {
            if (data.result == 0) {
                Pay.toPay(data);
            } else if (data.result == "9304" || data.result == "9383" || data.result == "9648") {
                //获取订购参数失败
                if (LMEPG.Func.isExist(data.message)) {
                    LMEPG.UI.showToast(data.message, 3);
                } else {
                    LMEPG.UI.showToast("用户已经订购!", 3);
                }
                onBackDelay();
            } else {
                //获取订购参数失败
                if (LMEPG.Func.isExist(data.message)) {
                    LMEPG.UI.showToast(data.message, 3);
                } else {
                    LMEPG.UI.showToast("获取订购参数失败!", 3);
                }
                onBackDelay();
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        if (RenderParam.orderItems.length <= btn.cIndex) {
            LMEPG.UI.showToast("没有该订购项!");
            return;
        }
        if(getQueryVariable("isNewPay") == "1"){
            RenderParam.packetType = '4';
        }
        var PayInfo = {
            "vip_id": RenderParam.orderItems[btn.cIndex].vip_id,
            "vip_type": RenderParam.orderItems[btn.cIndex].vip_type,
            "product_id": btn.cIndex + 1,
            "userId": RenderParam.userId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "price": RenderParam.orderItems[btn.cIndex].price,
            "lmreason": 0,
        };
        Pay.buildPayInfo(PayInfo);
    },

    /**
     * 初始化订购项
     */
    initButton: function () {
        buttons.push(
            {
                id: 'btn-ok-one',
                name: "一次确定按键",
                type: "img",
                nextFocusLeft: '',
                nextFocusRight: 'btn-cancle-one',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/Pay/V440004/btn_ok_one_out.png',
                focusImage: g_appRootPath + '/Public/img/hd/Pay/V440004/btn_ok_one_in.png',
                click: Pay.onPayItemClick,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0,
            }
        );
        buttons.push(
            {
                id: 'btn-cancle-one',
                name: "一次取消按键",
                type: "img",
                nextFocusLeft: 'btn-ok-one',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/Pay/V440004/btn_cancle_one_out.png',
                focusImage: g_appRootPath + '/Public/img/hd/Pay/V440004/btn_cancle_one_in.png',
                click: 'onBack()',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0,
            }
        );
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            LMEPG.UI.showToast("没有套餐", 100);
            onBackDelay();
            return;
        }
        // 直接发起订购
        Pay.directPay();
    },

    /**
     * 显示第一次确认弹窗
     */
    showBuyDialogOne: function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src="' + g_appRootPath + '/Public/img/hd/Pay/V440004/bg.png"/>';//背景图
        _html += '<div id="btn-text-one">海量视频随心看，仅需' + (RenderParam.orderItems[0].price / 100) + '元/月。<br/>是否确认订购?<br/></div>';
        _html += '<img id="btn-ok-one" src="' + g_appRootPath + '/Public/img/hd/Pay/V440004/btn_ok_one_out.png"/>';
        _html += '<img id="btn-cancle-one" src="' + g_appRootPath + '/Public/img/hd/Pay/V440004/btn_cancle_one_out.png"/>';
        domShowDialog.innerHTML = _html;
        LMEPG.ButtonManager.requestFocus("btn-ok-one");
    },

    /**
     *
     */
    toPay: function (data) {
        window.location.href = data.payUrl;
    },

    /**
     * 直接发起订购
     */
    directPay: function () {
        if (RenderParam.orderItems.length <= 0) {
            LMEPG.UI.showToast("没有该订购项!");
            return;
        }
        if(getQueryVariable("isNewPay") == "1"){
            RenderParam.packetType = '4';
        }
        var PayInfo = {
            "vip_id": vip_id_map[RenderParam.packetType],
            "vip_type": RenderParam.orderItems[0].vip_type,
            "product_id": 0 + 1,
            "userId": RenderParam.userId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "price": RenderParam.orderItems[0].price,
            "lmreason": 0,
            "packetType": RenderParam.packetType
        };
        Pay.buildPayInfo(PayInfo);
    },
};

/**
 * 返回处理
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 返回（延时）
 */
function onBackDelay() {
    setTimeout(function () {
        onBack();
    }, 3000);
}

window.onload = function () {
    Pay.init();
};

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}