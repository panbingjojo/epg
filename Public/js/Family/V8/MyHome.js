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
            var objAbout = LMEPG.Intent.createIntent('familyEdit');
            LMEPG.Intent.jump(objAbout, objBack);
        } else {
            LMEPG.UI.showToast('不支持该功能，请更换安卓机顶盒', 3);
        }
    },
    //播放记录
    jumpPlayHistory: function () {
        if (RenderParam.platformType === 'hd') {
            var objBack = Page.getCurrentPage();
            var objAbout = LMEPG.Intent.createIntent('historyPlay');
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
    },
    //家庭档案
    jumpFamilyMember: function () {
        if (RenderParam.platformType === 'hd') {
            var objBack = Page.getCurrentPage();
            var objAbout = LMEPG.Intent.createIntent('familyEdit');
            LMEPG.Intent.jump(objAbout, objBack);
        } else {
            LMEPG.UI.showToast('不支持该功能，请更换安卓机顶盒', 3);
        }
    },

    //专家約诊记录
    jumpExpertConsultationRecord: function () {
        if (RenderParam.platformType === 'hd') {
            var objBack = Page.getCurrentPage();
            var objAbout = LMEPG.Intent.createIntent('expertRecordHome');
            LMEPG.Intent.jump(objAbout, objBack);
        } else {
            LMEPG.UI.showToast('不支持该功能，请更换安卓机顶盒', 3);
        }
    },
};

/**
 * 焦点控制
 */
var Action = {
    onClick: function (btn) {
        switch (btn.id) {
            case 'cond-1':   // 在线问诊记录
                Page.jumpMemberEditor();
                break;
            case 'cond-2':   // 我的收藏
                Page.jumpCollect();
                break;
            case 'cond-3': //关于
                Page.jumpAbout();
                break;
            case 'cond-4'://我的收藏
                Page.jumpCollect();
                break;
            case 'cond-5': // 播放记录
                Page.jumpPlayHistory();
                break;
            case 'cond-6': //家庭档案
                Page.jumpFamilyMember();
                break;
            case 'cond-7': //专家约诊记录
                Page.jumpExpertConsultationRecord();
                break;
        }
    }
};

// 当前页面的所有按钮
var buttons = [
    {
        id: 'cond-1',
        name: '家庭档案',
        type: 'img',
        focusable: true,
        nextFocusLeft: '',
        nextFocusUp: '',
        nextFocusRight: 'cond-2',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_1.png',
        focusImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_1_f.png',
        click: Action.onClick
    },
    {
        id: 'cond-2',
        name: '我都收藏',
        type: 'img',
        focusable: true,
        nextFocusLeft: 'cond-1',
        nextFocusUp: '',
        nextFocusRight: 'cond-3',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_2.png',
        focusImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_2_f.png',
        click: Action.onClick
    },                          // 当前页面的所有按钮
    {
        id: 'cond-3',
        name: '关于我们',
        type: 'img',
        focusable: true,
        nextFocusLeft: 'cond-2',
        nextFocusUp: '',
        nextFocusRight: 'focus-2-1',
        backgroundImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_3.png',
        focusImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_3_f.png',
        nextFocusDown: 'cond-4',
        click: Action.onClick
    },
];

/**
 * 我的家 - 初始化唯一入口类
 */
var MyHome = {
    init: function () {
        if(RenderParam.carrierId == '10220094' || RenderParam.carrierId == '10220095'){
            buttons = [
                {
                    id: 'cond-4',
                    name: '我的收藏',
                    type: 'img',
                    focusable: true,
                    nextFocusLeft: '',
                    nextFocusUp: '',
                    nextFocusRight: 'cond-5',
                    nextFocusDown: '',
                    backgroundImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_4.png',
                    focusImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_4_f.png',
                    click: Action.onClick
                },
                {
                    id: 'cond-5',
                    name: '播放记录',
                    type: 'img',
                    focusable: true,
                    nextFocusLeft: 'cond-4',
                    nextFocusUp: '',
                    nextFocusRight: 'cond-6',
                    nextFocusDown: '',
                    backgroundImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_5.png',
                    focusImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_5_f.png',
                    click: Action.onClick
                },                          // 当前页面的所有按钮
                {
                    id: 'cond-6',
                    name: '家庭档案',
                    type: 'img',
                    focusable: true,
                    nextFocusLeft: 'cond-5',
                    nextFocusUp: '',
                    nextFocusDown: 'cond-7',
                    nextFocusRight: '',
                    backgroundImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_6.png',
                    focusImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_6_f.png',
                    click: Action.onClick
                },
                {
                    id: 'cond-7',
                    name: '专家约诊',
                    type: 'img',
                    focusable: true,
                    nextFocusLeft: 'cond-5',
                    nextFocusUp: 'cond-6',
                    nextFocusRight: '',
                    backgroundImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_7.png',
                    focusImage: g_appRootPath + '/Public/img/hd/Family/V8/cond_7_f.png',
                    click: Action.onClick
                },
            ];
        }
        if(RenderParam.carrierId == '10220094' || RenderParam.carrierId == '10220095'){
            var initFocusId = LMEPG.Func.isEmpty(RenderParam.currentFocusId) ? 'cond-4' : RenderParam.currentFocusId;
        }else{
            var initFocusId = LMEPG.Func.isEmpty(RenderParam.currentFocusId) ? 'cond-1' : RenderParam.currentFocusId;
        }

        LMEPG.BM.init(initFocusId, buttons, '', true);
    }
};