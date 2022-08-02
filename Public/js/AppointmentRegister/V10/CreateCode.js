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
        return LMEPG.Intent.createIntent("createCode");
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
        Home.initRenderAll();
        Home.initButtons();
        LMEPG.BM.init(Home.defaultFocusId, buttons, "", true);
    },

    initRenderAll: function () {
        if (RenderParam.hospital_info.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            return;
        }
        if(RenderParam.carrierId == '520095'){
            RenderParam.cwsGuaHaoUrl = RenderParam.cwsGuaHaoUrl.replace('/lmzhjkpic','');
        }
        G("QRCode").src = RenderParam.cwsGuaHaoUrl + RenderParam.hospital_info.file_url;
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
            click: "",
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
