// 定义全局按钮
var buttons = [];

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
        return LMEPG.Intent.createIntent("reservationRule");
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

    init: function () {
        Home.initButtons();
        LMEPG.BM.init(Home.defaultFocusId, buttons, "", true);
    },

    initButtons: function () {
        buttons.push({
            id: "default",
            name: "默认焦点",
            type: "img",
            nextFocusLeft: "",
            nextFocusRight: "",
            nextFocusUp: "",
            nextFocusDown: "subject-1",
            backgroundImage: "",
            focusImage: "",
            click: onBack,
            focusChange: "",
            beforeMoveChange: "",
            cType: "region",
        });
    },
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};
