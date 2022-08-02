// 定义全局按钮
var buttons = [];

// websocket是否连接
var connected = false;
var socket = null;
var wshost = RenderParam.appoint_info.wsserver;

// 二维码地址
var QRCodeUrl = "";

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
        var currentPage = LMEPG.Intent.createIntent("phoneCode");
        currentPage.setParam("is_online", RenderParam.is_online);
        currentPage.setParam("expert_key", RenderParam.expert_key);
        currentPage.setParam("user_id", RenderParam.user_id);
        currentPage.setParam("num", RenderParam.num);
        return currentPage;
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
        Home.getQRCode(); // 获取二维码图片
        Home.initButtons();                 // 初始化焦点按钮
        LMEPG.BM.init(Home.defaultFocusId, buttons, "", true);
        // 页面确定键（回车）监听
        // document.onkeydown = function (e) {
        //     var theEvent = window.event || e;
        //     var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        //     if (code == 13) {
        //         Home.onConfirm();
        //     }
        // };
    },

    initButtons: function () {
        buttons.push({
            id: 'default',
            name: '预约挂号',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Home.onConfirm,
            focusChange: "",
            beforeMoveChange: "",
            cType: "region",
        });
    },

    // 获取二维码图片
    getQRCode: function () {
        var postData = {
            "user_id": RenderParam.appoint_info.user_id,
            "expert_key": RenderParam.appoint_info.expert_key,
            "num": RenderParam.appoint_info.num,
            // "session_id" :Home.getUniqueID(RenderParam.appoint_info.user_id),
            "session_id": RenderParam.appoint_info.user_id,
        };
        LMEPG.ajax.postAPI("GuaHao/getAppointQRCode", postData, function (data) {
            var data = JSON.parse(data);
            console.log(data);
            if (data.code != 0) {
                LMEPG.UI.showToast("数据加载失败");
                return;
            }
            //预约挂号，使用代理到中心服务器，不使用本地挂号
            if(RenderParam.carrierId == '520095'){
                RenderParam.cwsGuaHaoUrl = RenderParam.cwsGuaHaoUrl.replace('/lmzhjkpic','');
            }
            G("QRCode").src = RenderParam.cwsGuaHaoUrl + data.file_url;
            QRCodeUrl = RenderParam.cwsGuaHaoUrl + data.file_url;

            // 保存二维码图片地址
            var postData2 = {
                "key": "EPG-LWS-AppointmentRegister-" + RenderParam.carrierId + "-" + RenderParam.userId,
                "value": QRCodeUrl
            };
            LMEPG.ajax.postAPI('Activity/saveStoreData', postData2, function (rsp) {
                console.log(rsp);
            });

            if (typeof WebSocket != 'undefined') {
                // 连接websocket
                Home.connectWSServer(postData.session_id);
            } else {
                // 10s后自动跳转引导页面
                setTimeout(function () {
                    // 跳转到扫码引导页
                    var objSrc = Page.getCurrentPage();
                    var objDst = LMEPG.Intent.createIntent("guide");
                    objDst.setParam("session_id", postData.session_id);
                    objDst.setParam("wsserver", wshost);
                    objDst.setParam("QRCodeUrl", QRCodeUrl);
                    LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                }, 10000);
            }
        });
    },

    // 获取唯一id
    getUniqueID: function (prefix) {
        return (prefix + Home.S4() + Home.S4() + Home.S4() + Home.S4());
    },

    S4: function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },

    // 点击遥控器确定按钮
    onConfirm: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("reservationAdd");
        objDst.setParam("is_online", RenderParam.appoint_info.is_online);
        objDst.setParam("expert_key", RenderParam.appoint_info.expert_key);
        objDst.setParam("user_id", RenderParam.appoint_info.user_id);
        objDst.setParam("num", RenderParam.appoint_info.num);
        // 表示从二维码页面跳入挂号页面
        objDst.setParam("from_qrcode_page", 1);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 连接websocket，接收手机扫码消息
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
                        msg.ext = "i'm in qrcode page";

                        var msgstr = JSON.stringify(msg);

                        try {
                            socket.send(msgstr);
                            console.log("bind user success ...");
                        } catch (exception) {
                            console.log("bind user failed ...");
                        }
                    };

                    socket.onmessage = function (e) {
                        console.log(e);
                        var data = e.data;
                        var msg = JSON.parse(data);

                        var sender_id = msg.sender_id;
                        var recver_id = msg.recver_id;
                        var content = JSON.parse(msg.content);

                        console.log("recved msg, content=", content);

                        if (content.type == 1) {
                            console.log("recved start signal, enter appoint_mobile_guide ... ");

                            socket.close();
                            socket = null;
                            // 跳转到扫码引导页
                            var objSrc = Page.getCurrentPage();
                            var objDst = LMEPG.Intent.createIntent("guide");
                            objDst.setParam("session_id", session_id);
                            objDst.setParam("wsserver", wshost);
                            objDst.setParam("QRCodeUrl", QRCodeUrl);
                            LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
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
