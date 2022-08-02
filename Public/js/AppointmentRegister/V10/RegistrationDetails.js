/**
 * Created by Administrator on 2018/12/28.
 */

/**
 1.状态为待支付（当日）时，请您在下单后3分钟内完成支付，逾期未支付订单将被自动取消
 2.状态为待支付（非当日）时，显示“待支付（29：59）   请您在下单后30分钟内完成支付，逾期未支付订单将被自动取消”
 3.状态为已支付时，显示“已支付   请在规定的时间提前到医院相应的分诊台刷就诊卡等候就诊，如遇预约的专家因特殊原因停诊，医院将安排同等级医生出诊。无同等级医生出诊的，39健康会通过短信告知，用户可以申请取消预约。”
 4.状态为退款中时，显示“您的挂号预约退款中   您的预约在申请退款中，请等待审核！”
 5.状态为已退款时，显示“您的挂号预约已退款   谢谢使用39健康！”
 6.状态为预约已取消时，显示“您的挂号预约取消成功   您的预约挂号取消成功，谢谢使用39健康！”
 7.状态为线下支付时，显示“已预约线下支付   请在预约时间30分钟前至医院门诊一楼大厅预约挂号窗口凭短信及本人有效身份证完成支付，若你不能在预约时间就诊，可在预约时间30分钟前取消预约，否则该号将被自动取消，您将被记违约一次。”
 8.状态为已完成时，显示“已完成   谢谢使用39健康！”
 9.状态为退款失败时，显示“工作人员处理中，如需了解退费情况可联系客服：400-016-0700
 10.状态为支付状态确认中，显示“请等待确认支付结果，若支付不成功费用将退还

 订单状态 1-有效，2-取消，3-停诊，4-待应诊，5-已完成
 支付状态  0:已付款 1:无需付款 2:待付款 3:支付中 4:支付失败 5:退款中 6:退款成功 7:退款失败 8:审核不通过，9-线下支付

 注：
 停诊，贵健康那边也不做提示，会下发短信
 */



// 定义全局按钮
var buttons = [];
var imgUrl = g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/";

// 返回按键
function onBack() {
    Page.onBack();
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("registrationDetails");
        return currentPage;
    },

    /**
     * 返回事件
     */
    onBack: function () {
        // 跳转挂号记录
        var objSrc = null;
        var objDst = LMEPG.Intent.createIntent("registeredRecord");
        objDst.setParam("focusIndex", RenderParam.lastFocusIndex);
        objDst.setParam("page", RenderParam.page);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
    }
};

var Home = {
    defaultFocusId: "default",
    status: 7, // 1.已支付 2.已完成 3.线下支付 4.预约已取消 5.退款中 6.已退款 7.待支付 8.退款失败 9.支付中

    // 页面初始化操作
    init: function () {
        Home.initButtons();
        Home.initRenderAll();
    },

    initRenderAll: function () {
        if (RenderParam.detail.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            return;
        }
        Home.createStatus(Home.getOrderState(RenderParam.detail.orderState, RenderParam.detail.payState));
        Home.setPageInfo(RenderParam.detail); // 设置页面数据（所有状态都一样的数据）
        Home.setQRCode(); // 设置二维码信息
    },

    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },

    initButtons: function () {
        buttons.push({
            id: 'pay',
            name: '去支付',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: RenderParam.detail.canCancel == 0 ? 'back' : 'cancel',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            click: Home.goPay,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cType: "region",
        });
        buttons.push({
            id: 'cancel',
            name: '取消预约',
            type: 'div',
            nextFocusLeft: 'pay',
            nextFocusRight: 'back',
            nextFocusUp: '',
            nextFocusDown: 'subject-1',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            click: Home.cancelOrder,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cType: "region",
        });
        buttons.push({
            id: 'back',
            name: '返回',
            type: 'div',
            nextFocusLeft: RenderParam.detail.canCancel == 0 ? 'pay' : 'cancel',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'subject-1',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            click: onBack,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cType: "region",
        });
    },

    // 1.已支付 2.已完成 3.线下支付 4.预约已取消 5.退款中 6.已退款 7.待支付 8.退款失败 9.支付中
    createStatus: function (status) {
        var pay = G("pay");
        var cancel = G("cancel");
        // 是否可以取消
        var canCancel = RenderParam.detail.canCancel;
        // 是否预约当天
        var isToday = false;
        var createTime = RenderParam.detail.createTime;
        var shiftDate = RenderParam.detail.shiftDate;
        if (createTime.substr(0, 4) == shiftDate.substr(0, 4) &&
            createTime.substr(4, 2) == shiftDate.substr(4, 2) &&
            createTime.substr(6, 2) == shiftDate.substr(6, 2)) {
            isToday = true;
        }
        switch (status) {
            // 1.已支付
            case 1:
                G("status-img").src = imgUrl + 'pay_' + status + '.png';
                G("status-content").innerHTML = "请在规定的时间到医院相应的分诊台刷就诊卡等候就诊，如遇到预约的专家因特殊原因停诊，医院将安排同等级医生出诊。无同等级医生出诊的，39健康会通过短信告知，用户可以申请取消预约。";
                pay.parentNode.removeChild(pay);
                if (canCancel == 0)
                    cancel.parentNode.removeChild(cancel);
                LMEPG.BM.init("back", buttons, "", true);
                break;
            // 2.已完成
            case 2:
                G("status-img").src = imgUrl + 'pay_' + status + '.png';
                G("status-content").innerHTML = "谢谢使用39健康";
                pay.parentNode.removeChild(pay);
                if (canCancel == 0)
                    cancel.parentNode.removeChild(cancel);
                LMEPG.BM.init("back", buttons, "", true);
                break;
            // 3.线下支付
            case 3:
                G("status-img").src = imgUrl + 'pay_' + status + '.png';
                G("status-content").innerHTML = "请在预约时间30分钟前至医院门诊一楼大厅预约挂号窗口凭短信及本人有效身份证完成支付，若你不能在预约时间就诊，可在预约时间30分钟前取消预约，否则该号将被自动取消，您将被记违约一次。";
                pay.parentNode.removeChild(pay);
                if (canCancel == 0)
                    cancel.parentNode.removeChild(cancel);
                LMEPG.BM.init("back", buttons, "", true);
                break;
            // 4.预约已取消
            case 4:
                G("status-img").src = imgUrl + 'pay_' + status + '.png';
                G("status-content").innerHTML = "您的预约挂号取消成功，谢谢使用39健康！";
                pay.parentNode.removeChild(pay);
                if (canCancel == 0)
                    cancel.parentNode.removeChild(cancel);
                LMEPG.BM.init("back", buttons, "", true);
                break;
            // 5.退款中
            case 5:
                G("status-img").src = imgUrl + 'pay_' + status + '.png';
                G("status-content").innerHTML = "您的预约在申请退款中，请等待审核！";
                pay.parentNode.removeChild(pay);
                if (canCancel == 0)
                    cancel.parentNode.removeChild(cancel);
                LMEPG.BM.init("back", buttons, "", true);
                break;
            // 6.已退款
            case 6:
                G("status-img").src = imgUrl + 'pay_' + status + '.png';
                G("status-content").innerHTML = "您的挂号预约已退款，谢谢使用39健康！";
                pay.parentNode.removeChild(pay);
                if (canCancel == 0)
                    cancel.parentNode.removeChild(cancel);
                LMEPG.BM.init("back", buttons, "", true);
                break;
            // 7.待支付
            case 7:
                G("status-img").src = imgUrl + 'pay_' + status + '.png';
                if (isToday)
                    G("status-content").innerHTML = "请您在下单后3分钟内完成支付，逾期未支付订单将被自动取消！";
                else
                    G("status-content").innerHTML = "请您在下单后30分钟内完成支付，逾期未支付订单将被自动取消！";
                if (canCancel == 0)
                    cancel.parentNode.removeChild(cancel);
                LMEPG.BM.init("pay", buttons, "", true);
                Home.startInquiryTimer(RenderParam.detail.surplusPayDt);
                break;
            // 8.退款失败
            case 8:
                G("status-img").src = imgUrl + 'pay_' + status + '.png';
                G("status-content").innerHTML = "工作人员处理中，如需了解退费情况可联系客服：400-016-0700";
                pay.parentNode.removeChild(pay);
                if (canCancel == 0)
                    cancel.parentNode.removeChild(cancel);
                LMEPG.BM.init("back", buttons, "", true);
                break;
            // 9.支付中
            case 9:
                G("status-img").src = imgUrl + 'pay_' + status + '.png';
                G("status-content").innerHTML = "请等待确认支付结果，若支付不成功费用将退还";
                pay.parentNode.removeChild(pay);
                if (canCancel == 0)
                    cancel.parentNode.removeChild(cancel);
                LMEPG.BM.init("back", buttons, "", true);
                break;
        }
    },
    //定时器更新
    startInquiryTimer: function (timer) {
        var countdown = G("countdown");
        var time = timer;//30分钟换算成1800秒
        setInterval(function () {
            if (time <= 0)
                return;
            time = time - 1;
            var minute = parseInt(time / 60);
            var second = parseInt(time % 60);
            var minuteStr = minute < 10 ? "0" + minute : minute;
            var secondStr = second < 10 ? "0" + second : second;
            countdown.innerHTML = "( " + minuteStr + ':' + secondStr + ' )';
            // 倒计时结束后，刷新当前页面
            if (minute == 0 && second == 0) {
                var objSrc = Page.getCurrentPage();
                var objDst = LMEPG.Intent.createIntent("registrationDetails");
                objDst.setParam("order_id", RenderParam.orderId);
                LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
            }
        }, 1000);
    },

    // 设置页面数据
    setPageInfo: function (data) {
        G("patientName").innerHTML = data.patientName;
        G("patientId").innerHTML = data.patientId;
        G("phone").innerHTML = data.phone;
        var registerOrderNo = "";
        for (var i = 0; i < data.medicalVoucher.length; i++) {
            if (data.medicalVoucher[i].挂号单号 != null) {
                registerOrderNo = data.medicalVoucher[i].挂号单号;
                break;
            }
        }
        G("registerOrderNo").innerHTML = registerOrderNo;
        G("certificateNo").innerHTML = data.certificateNo;
        G("hospitalName").innerHTML = data.hospitalName;
        G("expertName").innerHTML = data.expertName;
        var time = data.shiftDate + " " + data.shiftWeek + " " + data.timeRangeName + " ";
        if (data.igsBillNo != null && data.igsBillNo.length > 0 && data.igsOrder != null && data.igsOrder.length > 0)
            time += data.timeSection + " " + data.igsOrder + "号";
        G("time").innerHTML = time;
        G("hdeptName").innerHTML = data.hdeptName;
        G("clinicAddr").innerHTML = data.clinicAddr;
        G("regFee").innerHTML = data.regFee;
        G("medicalBookPrice").innerHTML = data.medicalBookPrice;
        var checkFee = 0;
        for (var i = 0; i < data.checkItems.length; i++) {
            checkFee += data.checkItems[i].cost;
        }
        G("checkFee").innerHTML = checkFee;
        G("medicalCardPrice").innerHTML = data.medicalCardPrice;
        G("orderPrice").innerHTML = data.orderPrice;

    },

    // 获取文字订单状态，返回自定义页面显示状态
    getOrderState: function (orderState, payState) {
        var orderStateDesc;
        var state;
        if (orderState == 2) {
            orderStateDesc = "预约已取消";
            state = 4;
        } else if (orderState == 5) {
            orderStateDesc = "已完成";
            state = 2;
        } else if (payState == 5) {
            orderStateDesc = "退款中";
            state = 5;
        } else if (payState == 6) {
            orderStateDesc = "已退款";
            state = 6;
        } else if (payState == 0) {
            orderStateDesc = "已支付";
            state = 1;
        } else if (payState == 1 || payState == 9) {
            orderStateDesc = "线下支付";
            state = 3;
        } else if (payState == 2 || payState == 4) {
            orderStateDesc = "待支付";
            state = 7;
        } else if (payState == 3) {
            orderStateDesc = "支付中";
            state = 9;
        } else if (payState == 7 || payState == 8) {
            orderStateDesc = "退款失败";
            state = 8;
        }

        return state;
    },

    // 设置二维码，目前妇幼保健院需要使用条形码去医院就诊
    // 扫描进入手机页面的订单详情（贵健康），里面有条形码
    setQRCode: function () {
        G("QRCode").src = RenderParam.cwsGuaHaoUrl + RenderParam.detail.mobileOrderDetailQRCode;
    },

    // 去支付
    goPay: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("paymentOrder");
        objDst.setParam("order_id", RenderParam.orderId);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                Home.scrollController("default", 180, dir);
                break;
            case 'down':
                Home.scrollController("default", -180, dir);
                break;
        }
    },
    scrollController: function (id, amount, dir) {
        // alert(G(id).offsetHeight);
        switch (dir) {
            case 'up':
                if (parseInt(G(id).style.top) <= -80) {
                    G(id).style.top = parseInt(G(id).style.top) + amount + "px";
                }
                break;
            case 'down':
                // alert(G(id).style.top);
                // G("debug").innerHTML = "" + G(id).style.top;
                if (parseInt(G(id).style.top) >= -720) {
                    G(id).style.top = parseInt(G(id).style.top) + amount + "px";
                }
        }
    },

    // 取消订单
    cancelOrder: function () {
        LMEPG.UI.commonDialog.show('您是否要取消本次预约', ['确定', '取消'], function (index) {
            if (index == 0) {
                var postData = {
                    "order_id": RenderParam.orderId,
                };
                LMEPG.UI.showWaitingDialog("");
                LMEPG.ajax.postAPI("GuaHao/postAppointCancelOrder", postData, function (data) {
                    LMEPG.UI.dismissWaitingDialog();
                    var data = JSON.parse(data);
                    console.log(data);
                    if (data.code != 0) {
                        LMEPG.UI.showToast("取消预约失败，" + data.message);
                        return;
                    } else {
                        LMEPG.UI.showToast(data.info.message, 2, function () {
                            // 刷新当前页面
                            var objSrc = Page.getCurrentPage();
                            var objDst = LMEPG.Intent.createIntent("registrationDetails");
                            objDst.setParam("order_id", RenderParam.orderId);
                            LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
                        });
                    }
                });
            }
        });
    },
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};
