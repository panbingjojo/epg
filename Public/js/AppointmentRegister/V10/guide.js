// 定义全局按钮
var buttons = [];
var i = 0;

// websocket是否连接
var connected = false;
var socket = null;
var wshost = RenderParam.wsserver;

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
        return LMEPG.Intent.createIntent("guide");
    },

    /**
     * 返回事件
     */
    onBack: function () {
        LMEPG.Intent.back();
    }
};

var Home = {
    defaultFocusId: "default",
    //页面初始化操作
    init: function () {
        Home.initButtons();                 // 初始化焦点按钮
        G("qrcode").src = RenderParam.QRCodeUrl;
        Home.stepImg();
        // 连接websocket
        Home.connectWSServer(RenderParam.session_id);
        LMEPG.BM.init(Home.defaultFocusId, buttons, "", true);
    },

    stepImg: function () {
        i++;
        imgUrl = g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/";
        G("default").src = imgUrl + "guide_" + i + ".png";
        setTimeout(Home.stepImg, 5000);
        if (i == "3") {
            i = 0;
        }
    },

    initButtons: function () {
        buttons.push({
            id: 'default',
            name: '预约挂号',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'subject-1',
            backgroundImage: "",
            focusImage: "",
            click: "",
            focusChange: "",
            beforeMoveChange: "",
            cType: "region",
        });
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
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};
