var Test = {
    page: 0,
    buttons: [],
    testTYpe: ["testIndex", "doctorList", "familyHome","inputTest"],
    init: function () {
        this.createBtns();
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('outIndex');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        return objCurrent;
    },
    onClick: function (btn) {
        Test.jumpHealthTestIMEI(btn.type);
    },

    /**
     * 跳转 - 健康检测IMEI号输入页面
     */
    jumpHealthTestIMEI: function (type) {
        var objCurrent = Test.getCurrentPage();
        var objHomeTab = LMEPG.Intent.createIntent(type);
        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    createBtns: function () {
        var FOCUS_COUNT = 2;
        while (FOCUS_COUNT--) {
            this.buttons.push({
                id: 'link-' + FOCUS_COUNT,
                type: 'img',
                nextFocusUp: 'home',
                nextFocusLeft: 'link-' + (FOCUS_COUNT - 1),
                nextFocusRight: 'link-' + (FOCUS_COUNT + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/link_out_' + (FOCUS_COUNT + 1) + '.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/link_out_' + (FOCUS_COUNT + 1) + '_f.png',
                click: this.onClick,
                type: this.testTYpe[FOCUS_COUNT]
            });
        }
        this.buttons.push(
            {
                id: 'home',
                type: 'img',
                nextFocusDown: 'link-0',
                nextFocusRight: 'input',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/my_home.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/my_home_f.png',
                click: this.onClick,
                type: this.testTYpe[2],
                beforeMoveChange: this.onBeforeMoveChange
            })

        this.buttons.push(
            {
                id: 'input',
                type: 'img',
                nextFocusDown: 'link-0',
                nextFocusLeft:'home',
                nextFocusRight: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input_f.png',
                click: this.onClick,
                type: this.testTYpe[3],
                beforeMoveChange: this.onBeforeMoveChange
            })
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'link-0', this.buttons, '', true);
    }
};

var onBack = function () {
    LMEPG.Intent.back('IPTVPortal');
};