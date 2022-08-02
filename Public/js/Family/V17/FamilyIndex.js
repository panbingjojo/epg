/*********************** 我的家 - 首页JS***************************/
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
        var currentPage = LMEPG.Intent.createIntent("familyIndex");
        currentPage.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        // currentPage.setParam("isFromMyFamilyPage", 1);
        return currentPage;
    },

    // 跳转挂号记录
    jumpAppointRecords: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("registeredRecord");
        objDst.setParam("isFromMyFamilyPage", 1);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转检测记录
    jumpHealthTestImeiInput: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("recordList");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转到关于我们
    jumpAboutOus: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("about");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转到家庭成员
    jumpFamilyMember: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("familyHome");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转到收藏
    jumpCollection: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("collect");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },
    // 跳转到问诊记录
    jumpP2PRecordHome: function () {
        // if (RenderParam.carrierId == '520092') {
        //     LMEPG.UI.showToast("本功能暂未开放");
        //     return;
        // }
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent(RenderParam.carrierId==='640092'?"doctorRecordHomeV2": "doctorRecordHome");
        LMEPG.Intent.jump(objDst, objSrc);
    },

    // 跳转到专家约诊记录
    jumpExpertRecordHome: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("expertRecordHome");
        LMEPG.Intent.jump(objDst, objSrc);
    },

    /**
     * 返回事件
     */
    onBack: function () {
        if (!LMEPG.Func.isEmpty(RenderParam.isFromMyFamilyPage)) {
            LMEPG.Intent.back();
        } else {
            // var objCurrent = Page.getCurrentPage(); //得到当前页
            // var objHome = LMEPG.Intent.createIntent("home");
            // objHome.setParam("userId", RenderParam.userId);
            // // objHome.setParam("focusIndex", "b-link-4");
            // LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
            LMEPG.Intent.back();
        }
    }
};

//页面显示控制
var Family = {
    //页面初始化操作
    init: function () {
        Family.initButtons();                 // 初始化焦点按钮
    },

    initButtons: function () {
        Family.initRecommendPosition();       // 初始化[推荐位按钮]
        RenderParam.focusIndex = RenderParam.focusIndex ? RenderParam.focusIndex : "recommended-1";
        LMEPG.ButtonManager.init(RenderParam.focusIndex, buttons, "", true);
    },
    // 初始化推荐位
    initRecommendPosition: function () {
        buttons.push({
            id: 'recommended-1',
            name: '问诊记录',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommended-2',
            nextFocusUp: '',
            nextFocusDown: 'recommended-6',
            backgroundImage: "",
            focusImage: "",
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 51,
        }, {
            id: 'recommended-2',
            name: '挂号记录',
            type: 'img',
            nextFocusLeft: 'recommended-1',
            nextFocusRight: 'recommended-3',
            nextFocusUp: '',
            nextFocusDown: 'recommended-4',
            backgroundImage: "",
            focusImage: "",
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 52,
        }, {
            id: 'recommended-3',
            name: '家庭成员',
            type: 'img',
            nextFocusLeft: 'recommended-2',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommended-5',
            backgroundImage: "",
            focusImage: "",
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 53,
        }, {
            id: 'recommended-4',
            name: '我的收藏',
            type: 'img',
            nextFocusLeft: 'recommended-6',
            nextFocusRight: 'recommended-5',
            nextFocusUp: 'recommended-2',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 54,
        }, {
            id: 'recommended-5',
            name: '关于我们',
            type: 'img',
            nextFocusLeft: 'recommended-4',
            nextFocusRight: '',
            nextFocusUp: 'recommended-3',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 55,
        }, {
            id: 'recommended-6',
            name: '检测记录',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommended-4',
            nextFocusUp: 'recommended-1',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 56,
        });
    },

    // 加边框焦点效果
    onFocusRecommend: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended-hover");
        }
    },

    // 推荐位点击
    onClickRecommendPosition: function (btn) {
        switch (btn.cPosition) {
            case 51:
                Page.jumpP2PRecordHome();
                break;
            case 52:
                LMEPG.UI.showToast("功能暂未开放，敬请期待！");
                return;
                // Page.jumpExpertRecordHome();
                break;
            case 53:
                Page.jumpFamilyMember();
                break;
            case 54:
                Page.jumpCollection();
                break;
            case 55:
                Page.jumpAboutOus();
                break;
            case 56:
                Page.jumpHealthTestImeiInput();
                break;
            default:
                LMEPG.UI.showToast("没有entryType为" + btn.cPosition + "的跳转方式");
                break;
        }
    },
};
