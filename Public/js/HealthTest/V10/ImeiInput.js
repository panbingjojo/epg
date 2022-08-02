// 定义全局按钮
var buttons = [];

// 返回按键
function onBack() {
    Page.onBack();
}

var Page = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("healthTestImeiInput");
        currentPage.setParam("imei_number", G("btn-text").innerHTML);
        currentPage.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        return currentPage;
    },

    /**
     * 跳转到home页面
     */
    jumpHomeTab: function (tabName) {
        var objCurrent = Page.getCurrentPage(); //得到当前页

        var objHome = LMEPG.Intent.createIntent(tabName);
        objHome.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 返回事件
     */
    onBack: function () {
        LMEPG.Intent.back();
    },
};

var PageStart = {
    defaultFocusId: "btn-text",
    init: function () {
        PageStart.initBottom(); // 初始化底部导航栏按钮
        LMEPG.UI.keyboard.setHintText(""/*"请输入正确的IMEI号"*/);

        G("btn-text").innerHTML = RenderParam.imei_number;
        if (!LMEPG.Func.isEmpty(RenderParam.imei_number)) {
            RenderParam.focusIndex = "inquiry_btn";
        }
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? PageStart.defaultFocusId : RenderParam.focusIndex;
        LMEPG.BM.init(lastFocusId, buttons, "", true);
        if (lastFocusId != PageStart.defaultFocusId) {
            // G("btn-text").blur();
        }
    },

    // 初始化底部导航栏按钮
    initBottom: function () {
        //    工具栏
        buttons.push({
            id: 'btn-text',
            name: '输入框',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'inquiry_btn',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V10/bg_text.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V10/f_text.png',
            click: "LMEPG.UI.keyboard.show(305, 392, 'btn-text',false, 'inquiry_btn')",
            focusChange: PageStart.inputFocus,
            beforeMoveChange: "",
        });
        buttons.push({
            id: 'inquiry_btn',
            name: '下一步',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'btn-text',
            nextFocusDown: 'btn-href',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            click: PageStart.bindDevice,
            focusChange: PageStart.departFocus,
            beforeMoveChange: "",
        });

        buttons.push({
            id: 'btn-href',
            name: '超连接',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'inquiry_btn',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: "",
            focusChange: PageStart.departFocus,
            beforeMoveChange: "",
        });
    },
    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            // LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            // LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },

    inputFocus: function (btn, hasFocus) {
        // var idDom = G(btn.id).getElementsByTagName("input")[0]
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
            // idDom.disabled = false;
            // setTimeout(function () {
            //     LMEPG.UI.Style.input_moveCursorTo(idDom, idDom.value.length)
            // });
            // G(btn.id).focus();
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            // idDom.disabled = true;
            // idDom.blur();
            // Form.formValidation(btn.id);
        }
    },

    /**
     * 绑定检测仪
     */
    bindDevice: function () {
        var macAddr = G("btn-text").innerHTML;
        var postData = {"dev_mac_addr": macAddr};
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("Measure/bindDevice", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (!(data instanceof Object)) {
                data = JSON.parse(data);
            }
            if (data.result == 0 || data.result == "0") {
                // 设置推送id
                PageStart.setPushId();
            } else {
                LMEPG.UI.showToast("绑定设备失败");
            }
        });
    },

    /**
     * 设置推送id
     */
    setPushId: function () {
        var postData = {};
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("Measure/setPushId", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (!(data instanceof Object)) {
                data = JSON.parse(data);
            }
            if (data.result == 0 || data.result == "0") {
                // 跳转到检测步骤页面
                var objSrc = Page.getCurrentPage();
                var objDst = LMEPG.Intent.createIntent("healthTestDetectionStep");
                LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
            } else {
                LMEPG.UI.showToast("设置推送id失败");
            }
        });
    },
};

window.onload = function () {
    PageStart.init();
    lmInitGo();
};

window.onload=function () {
    PageStart.init();
    lmInitGo();
};
