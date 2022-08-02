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
        var currentPage = LMEPG.Intent.createIntent('familyIndex');
        currentPage.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        // currentPage.setParam("isFromMyFamilyPage", 1);
        return currentPage;
    },

    // 跳转挂号记录
    jumpAppointRecords: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('registeredRecord');
        objDst.setParam('isFromMyFamilyPage', 1);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转检测记录
    jumpHealthTestImeiInput: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('recordList');
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转到关于我们
    jumpAboutOus: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('about');
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转到家庭成员
    jumpFamilyMember: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('familyHome');
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转到收藏
    jumpCollection: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('collect');
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },
    // 跳转到问诊记录
    jumpP2PRecordHome: function () {
        // if (RenderParam.carrierId == '520092') {
        //     LMEPG.UI.showToast("本功能暂未开放");
        //     return;
        // }
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('doctorRecordHome');
        LMEPG.Intent.jump(objDst, objSrc);
    },

    // 跳转到专家约诊记录
    jumpExpertRecordHome: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('expertRecordHome');
        LMEPG.Intent.jump(objDst, objSrc);
    },

    /**
     * 返回事件
     */
    onBack: function () {
        if (!LMEPG.Func.isEmpty(RenderParam.isFromMyFamilyPage)) {
            LMEPG.Intent.back();
        } else {
            var objCurrent = Page.getCurrentPage(); //得到当前页
            var objHome = LMEPG.Intent.createIntent('home');
            objHome.setParam('userId', RenderParam.userId);
            objHome.setParam('focusIndex', 'b-link-4');
            LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
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
        RenderParam.focusIndex = RenderParam.focusIndex ? RenderParam.focusIndex : 'recommended-2';
        LMEPG.ButtonManager.init(RenderParam.focusIndex, buttons, '', true);
    },
    // 初始化推荐位
    initRecommendPosition: function () {
        buttons.push({
            id: 'recommended-1',
            name: '问诊记录',
            type: 'img',
            nextFocusLeft: 'recommended-2',
            nextFocusRight: 'recommended-4',
            nextFocusUp: 'recommended-3',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 51
        }, {
            id: 'recommended-2',
            name: '挂号记录',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommended-3',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 52
        }, {
            id: 'recommended-3',
            name: '家庭成员',
            type: 'img',
            nextFocusLeft: 'recommended-2',
            nextFocusRight: 'recommended-5',
            nextFocusUp: '',
            nextFocusDown: 'recommended-1',
            backgroundImage: '',
            focusImage: '',
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 53
        }, {
            id: 'recommended-4',
            name: '检测记录',
            type: 'img',
            nextFocusLeft: 'recommended-1',
            nextFocusRight: '',
            nextFocusUp: 'recommended-5',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 54
        }, {
            id: 'recommended-5',
            name: '我的收藏',
            type: 'img',
            nextFocusLeft: 'recommended-3',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommended-4',
            backgroundImage: '',
            focusImage: '',
            click: Family.onClickRecommendPosition,
            focusChange: Family.onFocusRecommend,
            beforeMoveChange: '',
            cPosition: 55
        });
    },

    // 加边框焦点效果
    onFocusRecommend: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, 'recommended-hover');
        } else {
            LMEPG.CssManager.removeClass(btn.id, 'recommended-hover');
        }
    },

    // 推荐位点击
    onClickRecommendPosition: function (btn) {
        switch (btn.cPosition) {
            case 52:
                Page.jumpAppointRecords();
                break;
            case 53:
                Page.jumpFamilyMember();
                break;
            case 55:
                Page.jumpCollection();
                break;
            case 54:
                Page.jumpHealthTestImeiInput();
                break;
            case 51:
                LMEPG.UI.showToast("该功能还未开放！");
                return;
                Page.jumpP2PRecordHome();
                break;
            default:
                LMEPG.UI.showToast('没有entryType为' + btn.cPosition + '的跳转方式');
                break;
        }
    }
};

window.onload = function () {
    Family.init();
};
