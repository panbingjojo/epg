/**
 * 获取当前页对象
 */
function getCurrentPage() {
    return LMEPG.Intent.createIntent("appointmentRegisterRecordDetail");
}

/**
 * 跳转到挂号详情页
 */
function updateThisView(orderId) {
    var objHospitalDetail = LMEPG.Intent.createIntent("appointmentRegisterRecordDetail");
    objHospitalDetail.setParam("order_id", orderId);

    LMEPG.Intent.jump(objHospitalDetail, null);
}

/**
 * 返回事件
 */
function onBack() {

    var objRecordList = LMEPG.Intent.createIntent("appointmentRegisterRecord");
    objRecordList.setParam("pageCurrent", pageCurrent);
    objRecordList.setParam("lastFocusId", lastFocusId);

    LMEPG.Intent.jump(objRecordList, null);
}

var payType = RenderParam.payType;
var payState = RenderParam.payState;
var orderState = RenderParam.orderState;
var tipMsg = RenderParam.tipMsg;
var canCancel = RenderParam.canCancel;
var orderId = RenderParam.orderId;

//挂号记录列表页，传入的参数，用于返回时的焦点保持
var pageCurrent = RenderParam.pageCurrent;
var lastFocusId = RenderParam.lastFocusId;
var buttons = [
    {
        id: 'confirm_btn',
        name: '确定',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'cancel_btn',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/AppointmentRegister/V1/detail_btn_out.png',
        focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/AppointmentRegister/V1/detail_btn_in.png',
        click: "onBack()",
        focusChange: onFocusBtn,
        beforeMoveChange: "",
        moveChange: "",
    },
    {
        id: 'cancel_btn',
        name: '取消预约',
        type: 'img',
        nextFocusLeft: 'confirm_btn',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/AppointmentRegister/V1/detail_btn_out.png',
        focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/AppointmentRegister/V1/detail_btn_in.png',
        click: "canCalcel()",
        focusChange: onFocusBtn,
        beforeMoveChange: "",
        moveChange: "",
    },
    {
        id: 'confirm_tip_btn',
        name: '确认',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'cancel_tip_btn',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/AppointmentRegister/V1/detail_btn_out.png',
        focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/AppointmentRegister/V1/detail_btn_in.png',
        click: "getUnAppointment()",
        focusChange: onFocusBtn,
        beforeMoveChange: "",
        moveChange: "",
    },
    {
        id: 'cancel_tip_btn',
        name: '取消',
        type: 'img',
        nextFocusLeft: 'confirm_tip_btn',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/AppointmentRegister/V1/detail_btn_out.png',
        focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/AppointmentRegister/V1/detail_btn_in.png',
        click: closeToast,
        focusChange: onFocusBtn,
        beforeMoveChange: "",
        moveChange: "",
    },
];

/**
 *  按钮获得焦点
 */
function onFocusBtn(btn, hasFocus) {
    if (hasFocus == true) {
        G(btn.id).style.backgroundImage = 'url(' + btn.focusImage + ')';
        G(btn.id).style.color = '#000000';
    } else {
        G(btn.id).style.backgroundImage = 'url(' + btn.backgroundImage + ')';
        G(btn.id).style.color = '#ffffff';
    }
}

/**
 * 显示支付方式
 */
function showPayType() {
    var domCharge = G("charge");

    //支付方式：1-支付宝 2-微信 3-银联 4-微信公众号(目前扫码支付 只支持 微信公众号 ),5-线下支付
    if (payType == 1) {
        domCharge.innerHTML = "支付宝";
    } else if (payType == 2) {
        domCharge.innerHTML = "微信";
    } else if (payType == 3) {
        domCharge.innerHTML = "银联";
    } else if (payType == 4) {
        domCharge.innerHTML = "微信公众号";
    } else if (payType == 5) {
        domCharge.innerHTML = "线下支付";
    } else {
        domCharge.innerHTML = "支付类型:" + payType;
    }
}

/**
 * 显示订单信息和支付信息
 */
function showIntroduce() {
    //orderState：订单状态 1-有效 2-取消
    //payState支付状态  0:已付款 1:无需付款 2:待付款 3:支付中 4:支付失败 5:退款中 6:退款成功 7:退款失败 8:审核不通过，9-线下支付
    var type = payState;
    if (type == 0) {
        G("register_type").src = LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V1/success_icon.png";
        G("register_text").innerHTML += "已支付";
        G("register_text").style.color = "#40bfff";
    } else if (type == 1) {
        G("register_type").src = LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V1/success_icon.png";
        G("register_text").innerHTML += "无需付款";
        G("register_text").style.color = "#40bfff";
    } else if (type == 2) {
        G("register_type").src = LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V1/doing_icon.png";
        G("register_text").innerHTML += "待付款";
        G("register_text").style.color = "yellow";
    } else if (type == 3) {
        G("register_type").src = LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V1/doing_icon.png";
        G("register_text").innerHTML += "支付中";
        G("register_text").style.color = "yellow";
    } else if (type == 4) {
        G("register_type").src = LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V1/failure_icon.png";
        G("register_text").innerHTML += "支付失败";
        G("register_text").style.color = "#FF4A1A";
    } else if (type == 5) {
        G("register_type").src = LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V1/doing_icon.png";
        G("register_text").innerHTML += "退款中";
        G("register_text").style.color = "yellow";
    } else if (type == 6) {
        G("register_type").src = LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V1/success_icon.png";
        G("register_text").innerHTML += "退款成功";
        G("register_text").style.color = "#40bfff";
    } else if (type == 7) {
        G("register_type").src = LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V1/failure_icon.png";
        G("register_text").innerHTML += "退款失败";
        G("register_text").style.color = "#FF4A1A";
    } else if (type == 8) {
        G("register_type").src = LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V1/failure_icon.png";
        G("register_text").innerHTML += "审核不通过";
        G("register_text").style.color = "#FF4A1A";
    } else if (type == 9) {
        G("register_type").src = LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V1/success_icon.png";
        G("register_text").innerHTML += "线下支付";
        G("register_text").style.color = "#40bfff";
    }
    G("content").innerHTML = tipMsg;
}

/**
 * 判断是否可以取消预约
 */
function canCalcel() {
    if (canCancel != 1) {
        LMEPG.UI.showToast("无法取消预约", 3);
    } else {
        openToast();
    }
}

/**
 * 取消预约
 */
function getUnAppointment() {
    var postData = {"order_id": orderId};
    LMEPG.ajax.postAPI("AppointmentRegister/getUnAppointment", postData, function (data) {
        var result = data.result;
        if (result == 0) {
            //取消预约成功
            LMEPG.UI.showToast("取消预约成功", 10);
            setTimeout(function () {
                updateThisView(orderId);
            }, 3000);
        } else {
            //取消预约失败
            LMEPG.UI.showToast("取消预约失败:" + result, 3);
        }
    }, function () {
        LMEPG.UI.showToast("取消预约异常", 3);
    });
}

//打开弹窗
function openToast() {
    S("tost");
    H("regist_type");
    H("confirm_btn");
    H("cancel_btn");
    H("content");
    LMEPG.ButtonManager.requestFocus("confirm_tip_btn");
}

//关闭弹窗
function closeToast() {
    H("tost");
    S("regist_type");
    S("confirm_btn");
    S("cancel_btn");
    S("content");
    LMEPG.ButtonManager.requestFocus("cancel_btn");
}


window.onload = function () {
    showPayType();
    showIntroduce();
    LMEPG.ButtonManager.init("confirm_btn", buttons, "", true);
};