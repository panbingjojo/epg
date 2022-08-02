/** 按返回键 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 页面跳转控制
 */
var Page = {

    /** 当前页 */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('familyHome');
        currentPage.setParam('myFamilyFocus', LMEPG.BM.getCurrentButton().id);
        return currentPage;
    },

    /** 跳转-在线问诊记录 */
    jumpInquiryRecord: function () {
        var objBack = Page.getCurrentPage();
        var objInquiryRecord = LMEPG.Intent.createIntent(RenderParam.platformType === 'sd' ? 'doctorLimit' : 'doctorRecordHome');
        LMEPG.Intent.jump(objInquiryRecord, objBack);
    },

    /** 跳转-专家约诊记录 */
    jumpExpertRecordHome: function () {
        //LMEPG.UI.showToast("本栏目暂未开放，敬请期待！", 3);
        var objBack = Page.getCurrentPage();
        var objExpertRecordHome = LMEPG.Intent.createIntent(RenderParam.platformType === 'sd' ? 'expertLimit' : 'expertRecordHome');
        LMEPG.Intent.jump(objExpertRecordHome, objBack);
    },

    /** 跳转 - 健康检测记录首页 */
    jumpHealthTestRecordHome: function () {
        if (RenderParam.platformType === 'hd') {
            var objCurrent = Page.getCurrentPage();
            var objHomeTab = LMEPG.Intent.createIntent('healthTestRecordList');
            LMEPG.Intent.jump(objHomeTab, objCurrent);
        } else {
            LMEPG.UI.showToast('不支持该功能，请更换安卓机顶盒', 3);
        }
    },

    /** 跳转-收藏 */
    jumpCollect: function () {
        var objBack = Page.getCurrentPage();
        objBack.setParam('fromId', '1');
        objBack.setParam('page', '0');
        var objCollect = LMEPG.Intent.createIntent('collect');
        LMEPG.Intent.jump(objCollect, objBack);
    },

    /** 跳转-家庭成员管理 */
    jumpMemberEditor: function () {
        if (RenderParam.platformType === 'hd') {
            var objBack = Page.getCurrentPage();
            var objAbout = LMEPG.Intent.createIntent('familyMembersEditor');
            LMEPG.Intent.jump(objAbout, objBack);
        } else {
            LMEPG.UI.showToast('不支持该功能，请更换安卓机顶盒', 3);
        }
    },

    /** 跳转-关于我们 */
    jumpAbout: function () {
        var objBack = Page.getCurrentPage();
        var objAbout = LMEPG.Intent.createIntent('familyAbout');
        LMEPG.Intent.jump(objAbout, objBack);
    }
};

/**
 * 焦点控制
 */
var Action = {
    focusChange: function (btn, hasFocus) {
        G(btn.id).setAttribute('class', hasFocus ? 'imghover' : '');    // 内部图片放大/缩小
        G(btn.id + '-box').className = hasFocus ? 'show' : 'none';      // 发光边框显示/陈艳隐藏
        if (hasFocus) {
            currentFocusId = btn.id; // 记录当前获得焦点的元素id
        }
    },

    onClick: function (btn) {
        switch (btn.id) {
            case 'focus-1-2':   // 在线问诊记录
                Page.jumpInquiryRecord();
                break;
            case 'focus-1-3':   // 专家约诊记录
                switch (RenderParam.carrierId) {
                    case '340092':
                        LMEPG.UI.showToast('本栏目暂未开放，敬请期待！', 3);
                        break;
                    default:
                        Page.jumpExpertRecordHome();
                        break;
                }
                break;
            case 'focus-1-4':   // 家庭成员管理
                Page.jumpMemberEditor();
                break;
            case 'focus-2-4':   // 跳转关于我们
                Page.jumpAbout();
                break;
        }
    }
};

// 当前页面的所有按钮
var buttons = [
    {
        id: 'focus-1-2',
        name: '在线问诊记录',
        type: 'img',
        focusable: true,
        nextFocusLeft: '',
        nextFocusUp: '',
        nextFocusRight: 'focus-1-3',
        nextFocusDown: '',
        focusChange: Action.focusChange,
        click: Action.onClick
    },
    {
        id: 'focus-1-3',
        name: '专家约诊记录',
        type: 'img',
        focusable: true,
        nextFocusLeft: 'focus-1-2',
        nextFocusUp: '',
        nextFocusRight: 'focus-1-4',
        nextFocusDown: '',
        focusChange: Action.focusChange,
        click: Action.onClick
    },
    {
        id: 'focus-1-4',
        name: '家庭成员管理',
        type: 'img',
        focusable: true,
        nextFocusLeft: 'focus-1-3',
        nextFocusUp: '',
        nextFocusRight: '',
        nextFocusDown: 'focus-2-4',
        focusChange: Action.focusChange,
        click: Action.onClick
    },
    {
        id: 'focus-2-4',
        name: '关于我们',
        type: 'img',
        focusable: true,
        nextFocusLeft: 'focus-1-3',
        nextFocusUp: 'focus-1-4',
        nextFocusRight: '',
        nextFocusDown: '',
        focusChange: Action.focusChange,
        click: Action.onClick
    }
];

/**
 * 我的家 - 初始化唯一入口类
 */
var MyHome = {
    init: function () {
        var initFocusId = LMEPG.Func.isEmpty(RenderParam.currentFocusId) ? 'focus-1-2' : RenderParam.currentFocusId;
        LMEPG.BM.init(initFocusId, buttons, '', true);
    }
};

window.onload = function () {
    MyHome.init();
};