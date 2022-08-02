var Hold = {
    mainButton: null,
    buttons: [],
    pageInfo: '',
    RecommendList: [],          //挽留页推荐位数组

    //默认提示语
    message: '您确定要离开吗？这里还有很多您没体验店哦！',
    cancelTxt: '再看看',
    exitTxt: '残忍离开',

    /**
     * 打开控制面板
     */
    open: function () {
        //保存进入时的焦点
        this.mainButton = LMEPG.BM.getCurrentButton();
        if (Hold.isExistHold()) {
            //存在表示以前创建过，只是被隐藏了
            S('retain');
        } else {
            Hold.initData();
            Hold.initHtml();
            Hold.initButton();
            LMEPG.BM.addButtons(Hold.buttons);
        }
        LMEPG.BM.requestFocus("continue_btn");
    },

    /**
     * 初始化数据
     */
    initData: function () {
        this.pageInfo = RenderParam.pageInfo;
        if (LMEPG.Func.isExist(this.pageInfo.data) && this.pageInfo.data.length > 0) {
            for (var i = 0; i < this.pageInfo.data.length; i++) {
                var data = RenderParam.pageInfo.data[i];
                switch (data.position) {
                    case "101":
                    case "102":
                    case "103":
                        this.RecommendList.push(data);
                }
            }
        }
        var exitTips = RenderParam.pageInfo.exitTips;
        if (LMEPG.Func.isExist(exitTips)) {
            if (LMEPG.Func.isExist(exitTips.message) && !LMEPG.Func.isEmpty(exitTips.message)) {
                this.message = exitTips.message;
            }
            if (LMEPG.Func.isExist(exitTips.cancel_txt) && !LMEPG.Func.isEmpty(exitTips.cancel_txt)) {
                this.cancelTxt = exitTips.cancel_txt;
            }
            if (LMEPG.Func.isExist(exitTips.exit_txt) && !LMEPG.Func.isEmpty(exitTips.exit_txt)) {
                this.exitTxt = exitTips.exit_txt;
            }
        }
    },

    /**
     * 初始化布局
     */
    initHtml: function () {
        var html = "";
        html += '<img class="hold_bg" src="' + g_appRootPath + '/Public/img/hd/Hold/V10/hold_bg.png"/>';
        html += '<div class="video-title">' + this.message + '</div>';
        html += '<div class="video-list">';
        for (var i = 0; i < this.RecommendList.length && i < 3; i++) {
            html += '<img id="video-' + (i + 1) + '" class="video-img" src="' + addFsUrl(this.RecommendList[i].image_url) + '"/>';
        }
        html += '</div>';
        html += '<img id="continue_btn" class="continue_btn" src="' + g_appRootPath + '/Public/img/hd/Hold/V10/bg_go.png"/>';
        html += '<img id="close_btn" class="close_btn" src="' + g_appRootPath + '/Public/img/hd/Hold/V10/bg_back.png"/>';
        var holdPage = document.createElement("div");  //创建显示控件
        holdPage.id = "retain";
        LMEPG.CssManager.addClass(holdPage, "retain");
        holdPage.innerHTML = html;
        var body = document.body;
        body.appendChild(holdPage);
    },

    /**
     * 初始化焦点
     */
    initButton: function () {
        Hold.buttons.push({
            id: 'continue_btn',
            focusable: true,
            name: '继续',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'close_btn',
            nextFocusUp: 'video-1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/Hold/V10/bg_go.png',
            focusImage: g_appRootPath + '/Public/img/hd/Hold/V10/f_go.png',
            click: Hold.colse,
            focusChange: '',
            beforeMoveChange: '',
        });
        Hold.buttons.push({
            id: 'close_btn',
            name: '退出按钮',
            focusable: true,
            type: 'img',
            nextFocusLeft: 'continue_btn',
            nextFocusRight: '',
            nextFocusUp: 'video-1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/Hold/V10/bg_back.png',
            focusImage: g_appRootPath + '/Public/img/hd/Hold/V10/f_back.png',
            click: Hold.appExit,
            focusChange: '',
            beforeMoveChange: '',
        });

        for (var i = 0; i < this.RecommendList.length && i < 3; i++) {
            Hold.buttons.push({
                id: 'video-' + (i + 1),
                name: '视频源',
                focusable: true,
                type: 'img',
                nextFocusLeft: 'video-' + i,
                nextFocusRight: 'video-' + (i + 2),
                nextFocusUp: '',
                nextFocusDown: 'continue_btn',
                backgroundImage: "",
                focusImage: "",
                click: Home.onClickRecommendPosition,
                focusChange: Hold.departFocus,
                beforeMoveChange: '',
                cPosition: this.RecommendList[i].position, //推荐位编号
            });
        }
    },

    /**
     * 关闭控制面板
     */
    appExit: function () {
        switch (RenderParam.carrierId) {
            case "520094":
                // 贵州广电
                starcorCom.exit();
                break;
            default:
                LMEPG.Intent.back("IPTVPortal");
                break;
        }
    },

    /**
     * 继续按键事件，将挽留页隐藏
     */
    colse: function () {
        if (Hold.mainButton) {
            LMEPG.BM.requestFocus(Hold.mainButton.id);
        }
        H('retain');
    },

    /**
     * 是否存在挽留弹窗
     */
    isExistHold: function () {
        return LMEPG.Func.isExist(G("retain"));
    },
    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "retention-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "retention-hover");
        }
    },

    /**
     * 是否显示挽留弹窗
     */
    isShowHold: function () {
        if (Hold.isExistHold()) {
            var visible = G("retain").style.visibility;
            if (LMEPG.Func.isEmpty(visible) || visible != 'hidden') {
                return true;
            }
        }
        return false;
    }
};
