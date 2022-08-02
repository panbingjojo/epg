var buttons = [];
var Page = {
    //页面初始化操作
    init: function () {
        Page.initButtons();                 // 初始化焦点按钮
        Page.defaultFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? "btn-1" : RenderParam.focusIndex;
        LMEPG.BM.init(Page.defaultFocusId, buttons, "", true);
        G("time").innerHTML = RenderParam.epidemicDetails.main[0].last_msg_dt;
    },
    initButtons: function () {
        var len = 2;// 页面入口按钮数
        for (var i = 0; i < len; i++) {
            buttons.push({
                id: 'btn-' + (i + 1),
                name: '按钮',
                type: 'img',
                nextFocusLeft: 'btn-' + i,
                nextFocusRight: 'btn-' + (i + 2),
                nextFocusUp: 'btn-' + (i - 3),
                nextFocusDown: 'btn-' + (i + 5),
                backgroundImage: Root + "/Public/img/hd/OutbreakReport/EAS/btn_" + (i + 1) + ".png",
                focusImage: Root + "/Public/img/hd/OutbreakReport/EAS/btn_" + (i + 1) + "_f.png",
                click: Page.onClickJump
            });
        }
    },
    onClickJump: function (btn) {
        switch (btn.id) {
            case "btn-1":
                Page.jumpSureIsolation();
                break;
            case "btn-2":
                Page.jumpSureArea();
                break;
        }
    },

    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("epidemic-Area");
        currentPage.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
        return currentPage;
    },
    //跳转->确诊小区
    jumpSureArea: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("nCoV-sure-area");
        LMEPG.Intent.jump(objDst, objCurrent);
    },
    //跳转->确诊小区
    jumpSureIsolation: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("go-home-isolation");
        LMEPG.Intent.jump(objDst, objCurrent);
    },


}

function onBack() {
    LMEPG.Intent.back();

}