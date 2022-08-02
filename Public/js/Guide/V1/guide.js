var url = g_appRootPath + '/Public/img/hd/V3/HomePage/';
var Guide = {
    mainButton: null,
    buttons: [],
    stepNum: 0,
    i: 1,
    type: "",

    /**
     * 打开控制面板
     */
    open: function (step, type) {
        console.log("openopenopenopenopen")
        //保存进入时的焦点
        this.mainButton = LMEPG.BM.getCurrentButton();
        Guide.stepNum = step;
        Guide.type = type;
        if (Guide.isExistGuide()) {
            //存在表示以前创建过，只是被隐藏了
            S('guide');
        } else {
            Guide.initHtml();
            Guide.initButton();
            LMEPG.BM.addButtons(Guide.buttons);
            LMEPG.BM.setKeyEventInterceptCallback(Guide.keyEventInterceptCallback);
        }
        LMEPG.BM.requestFocus("guide-bg");
    },

    /**
     * 按键拦截回调函数
     */
    keyEventInterceptCallback:function (keyCode) {
        Guide.step();
        return true;
    },

    /**
     * 初始化布局
     */
    initHtml: function () {
        var html = "";
        html += '<img id="guide-bg" class="hold_bg" src="' + g_appRootPath + '/Public/img/hd/V3/HomePage/'+Guide.type+'_1.png"/>';
        var GuidePage = document.createElement("div");  //创建显示控件
        GuidePage.id = "guide";
        LMEPG.CssManager.addClass(GuidePage, "retain2");
        GuidePage.innerHTML = html;
        var body = document.body;
        body.appendChild(GuidePage);
    },

    /**
     * 初始化焦点
     */
    initButton: function () {
        Guide.buttons.push({
            id: 'guide-bg',
            name: '继续',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Guide.step,
            focusChange: '',
            beforeMoveChange: '',
        });
    },

    /**
     * 关闭控制面板
     */
    appExit: function () {
        LMEPG.UI.showMessage('退出app');
    },

    /**
     * 继续按键事件，将挽留页隐藏
     */
    step: function () {
        if (Guide.i < Guide.stepNum) {
            Guide.i++;
            G("guide-bg").src = url + Guide.type+"_" + Guide.i + ".png";
        } else {
            if (Guide.mainButton) {
                LMEPG.BM.requestFocus(Guide.mainButton.id);
            }
            H('guide');
            NewGuidanceUtil.markFirstTimeEntryFlag(Guide.type,1);//新手指导部分
            LMEPG.BM.removeKeyEventInterceptCallback();
        }
    },

    /**
     * 是否存在新手指导
     */
    isExistGuide: function () {
        return LMEPG.Func.isExist(G("guide"));
    },

};
