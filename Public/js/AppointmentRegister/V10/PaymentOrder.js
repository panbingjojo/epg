// 定义全局按钮
var buttons = [];

// websocket是否连接
var connected = false;
var socket = null;
var wshost = RenderParam.detail.wsserver;

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
        return LMEPG.Intent.createIntent("paymentOrder");
    },

    /**
     * 返回事件
     */
    onBack: function () {
        // LMEPG.Intent.back();
        // 跳转挂号详情
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("registrationDetails");
        objDst.setParam("order_id", RenderParam.orderId);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_NOT_STACK);

    }
};

var Home = {
    defaultFocusId: "default",

    init: function () {
        Home.initButtons(); // 初始化焦点按钮
        Home.setPageData(RenderParam.detail); // 设置页面数据
        LMEPG.BM.init(Home.defaultFocusId, buttons, "", true);
        Home.startInquiryTimer(RenderParam.detail.surplusPayDt);
        // 连接websocket
        // Home.connectWSServer(RenderParam.detail.userId);

        // 轮询
        Home.polling();
    },

    initButtons: function () {
        buttons.push({
            id: 'default',
            name: '默认焦点',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: "",
            focusChange: "",
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cType: "region",
        });
    },
    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                Home.scrollController("default2", 180, dir);
                break;
            case 'down':
                Home.scrollController("default2", -180, dir);
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
                if (parseInt(G(id).style.top) >= -540) {
                    G(id).style.top = parseInt(G(id).style.top) + amount + "px";
                }
        }
    },

    //定时器更新
    startInquiryTimer: function (timer) {
        var countdown = G("timer");
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
            // 倒计时结束后，跳转订单详情页
            if (minute == 0 && second == 0) {
                var objSrc = Page.getCurrentPage();
                var objDst = LMEPG.Intent.createIntent("registrationDetails");
                objDst.setParam("order_id", RenderParam.orderId);
                LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
            }
        }, 1000);
    },

    // 设置页面数据
    setPageData: function (data) {
        if (RenderParam.detail.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            return;
        }
        G("orderPrice-1").innerHTML = data.orderPrice;
        G("patientName").innerHTML = data.patientName;
        G("patientId").innerHTML = data.patientId;
        G("igsBillNo").innerHTML = data.igsBillNo;
        G("phone").innerHTML = data.phone;
        G("certificateNo").innerHTML = data.certificateNo;
        G("hospitalName").innerHTML = data.hospitalName;
        G("clinicAddr").innerHTML = data.clinicAddr;
        G("expertName").innerHTML = data.expertName;
        G("hdeptName").innerHTML = data.hdeptName;
        var time = data.shiftDate + " " + data.shiftWeek + " " + data.timeRangeName + " ";
        if (data.igsBillNo != null && data.igsBillNo.length > 0 && data.igsOrder != null && data.igsOrder.length > 0)
            time += data.timeSection + " " + data.igsOrder + "号";
        G("time").innerHTML = time;
        G("regFee").innerHTML = data.regFee;
        G("checkPrice").innerHTML = data.checkPrice;
        G("medicalCardPrice").innerHTML = data.medicalCardPrice;
        G("medicalBookPrice").innerHTML = data.medicalBookPrice;
        G("orderPrice-2").innerHTML = data.orderPrice;
        // 支付二维码
        if(RenderParam.carrierId == '520095'){
            RenderParam.cwsGuaHaoUrl = RenderParam.cwsGuaHaoUrl.replace('/lmzhjkpic','');
        }
        G("payQRCode").src = RenderParam.cwsGuaHaoUrl + data.payQRCode;
    },

    // 连接websocket，接收手机支付成功消息
    connectWSServer: function (session_id) {
        setInterval(function () {
            if (!connected) {
                try {
                    /* 连接 */
                    socket = new WebSocket(wshost);

                    /* 绑定事件 */
                    socket.onopen = function () {
                        connected = true;
                        console.log("connect to wsserver success ...");
                        //绑定
                        var msg = new Object();
                        msg.msgType = 0;
                        msg.user_id = "tv_" + session_id;
                        msg.ext = "i'm in guide page";

                        var msgstr = JSON.stringify(msg);

                        try {
                            socket.send(msgstr);
                            console.log("bind user success ...");
                        } catch (exception) {
                            console.log("bind user failed ...");
                        }
                    };

                    socket.onmessage = function (e) {
                        var data = e.data;
                        var msg = JSON.parse(data);

                        var sender_id = msg.sender_id;
                        var recver_id = msg.recver_id;
                        var content = JSON.parse(msg.content);

                        console.log("recved msg, content=", content);

                        if (content.type == 2) {
                            console.log("recved pay success signal, enter order detail ... ");

                            socket.close();
                            socket = null;
                            // 跳转到挂号详情页（订单详情）
                            var objSrc = Page.getCurrentPage();
                            var objDst = LMEPG.Intent.createIntent("registrationDetails");
                            objDst.setParam("order_id", content.order_id);
                            LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
                        }
                    };

                    socket.onclose = function () {
                        connected = false;
                        console.log("disconnect to wsserver ...");
                    };
                } catch (exception) {
                    console.log("connect to wsserver failed ...");
                }
            }
        }, 2000);
    },

    // 轮询查询订单状态，如果支付成功状态，自动跳转订单详情页面
    polling: function () {
        LMEPG.ajax.postAPI("GuaHao/getAppointRecordDetail", {"order_id": RenderParam.orderId}, function (data) {
            data = JSON.parse(data);
            console.log(data);
            if (data.code == 0 && (data.payState == 0 || data.payState == "0")) {
                // 跳转到挂号详情页（订单详情）
                var objSrc = Page.getCurrentPage();
                var objDst = LMEPG.Intent.createIntent("registrationDetails");
                objDst.setParam("order_id", RenderParam.orderId);
                LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
            } else {
                setTimeout(function () {
                    Home.polling();
                }, 6000);
            }
        });
    }

};

window.onload = function () {
    Home.init();
};
