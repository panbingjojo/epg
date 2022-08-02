// /** 按返回键 */
// function onBack() {
//     LMEPG.Intent.back();
// }
// 返回键
function onBack() {
    LMEPG.Intent.back('IPTVPortal');
}

/**
 * 页面跳转控制
 */
var Page = {
    /**
     *跳转
     * */
    routeHospital: function (hospitalName) {
        switch (hospitalName) {
            case 'saimachang':
                var hospitalIntent1 = LMEPG.Intent.createIntent("hospital-index");
                hospitalIntent1.setParam("hospitalName", 'saimachangpianqu');
                hospitalIntent1.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
                var activityIntent = LMEPG.Intent.createIntent("activity");
                activityIntent.setParam("activityName", "ActivityCommunityHospital20191031");
                activityIntent.setParam("inner", 0);
                LMEPG.Intent.jump(activityIntent, hospitalIntent1, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                break;
            case 'saimachanghonhqishequ':
                var hospitalIntent = LMEPG.Intent.createIntent("hospital-index");
                hospitalIntent.setParam("hospitalName", 'saimachangpianqu');
                hospitalIntent.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
                var obj = LMEPG.Intent.createIntent('common-doc');
                obj.setParam("hospitalName", hospitalName);
                LMEPG.Intent.jump(obj, hospitalIntent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
        }
    },

    /**
     * 跳转 - 健康检测外部页面
     */
    routeHealthTestIndex: function () {
        var hospitalIntent = LMEPG.Intent.createIntent("hospital-index");
        hospitalIntent.setParam("hospitalName", 'saimachangpianqu');
        hospitalIntent.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
        var obj = LMEPG.Intent.createIntent('outIndex');
        LMEPG.Intent.jump(obj, hospitalIntent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

};

/**
 * 焦点控制
 */
var Action = {
    onClick: function (btn) {
        switch (btn.id) {
            case 'content1':
                Page.routeHospital("saimachang");
                break;
            case 'content2':
                Page.routeHospital("saimachanghonhqishequ");
                break;
            case 'content3':
                Page.routeHealthTestIndex();
                break;
        }
    },

};

// 当前页面的所有按钮
var buttons = [
    {
        id: 'content1',
        name: 'saimachang',
        type: 'img',
        focusable: true,
        nextFocusLeft: '',
        nextFocusUp: '',
        nextFocusRight: 'content2',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Hospital/SaiMaChangHospital/saimachang.png',
        focusImage: g_appRootPath + '/Public/img/hd/Hospital/SaiMaChangHospital/saimachang_f.png',
        click: Action.onClick
    },
    {
        id: 'content2',
        name: 'saimachanghonhqishequ',
        type: 'img',
        focusable: true,
        nextFocusLeft: 'content1',
        nextFocusRight: 'content3',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Hospital/SaiMaChangHospital/hongqishequ.png',
        focusImage: g_appRootPath + '/Public/img/hd/Hospital/SaiMaChangHospital/hongqishequ_f.png',
        click: Action.onClick
    },
    {
        id: 'content3',
        name: '健康检测',
        type: 'img',
        focusable: true,
        nextFocusLeft: 'content2',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Hospital/SaiMaChangHospital/health_examination.png',
        focusImage: g_appRootPath + '/Public/img/hd/Hospital/SaiMaChangHospital/health_examination_focus.png',
        click: Action.onClick
    }
];

/**
 * 我的家 - 初始化唯一入口类
 */
var MyHome = {
    init: function () {
        var initFocusId = LMEPG.Func.isEmpty(RenderParam.currentFocusId) ? 'content1' : RenderParam.currentFocusId;
        LMEPG.BM.init(initFocusId, buttons, '', true);
    }
};