var Page = {
    /**
     * 退出应用
     */
    exitAppHome: function () {

        LMEPG.Intent.back('IPTVPortal');
    },


    // 跳转到其他第三方sp
    jumpThirdPartySP: function (carrierId) {
        var objTestServer = LMEPG.Intent.createIntent('third-party-sp');
        objTestServer.setParam('carrierId', carrierId);
        objTestServer.setParam('isTest', '1');
        LMEPG.Intent.jump(objTestServer);
    },
    /**
     * 跳转 - 应用首页
     */
    jumpAppHome: function () {
        var objHold = LMEPG.Intent.createIntent('hold');

        var objHome = LMEPG.Intent.createIntent('home');
        objHome.setParam('classifyId', '0');

        LMEPG.Intent.jump(objHome, objHold, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },
};

var buttons = [];
var Hold = {
    /**
     * 按钮点击事件
     * @param btn
     */
    onBtnClick: function (btn) {
        switch (btn.id) {
            case 'continue':
                Page.jumpThirdPartySP("000051");
                break;
            case 'back':
                Page.exitAppHome();
                break;
        }

    },

    /**
     * 初始化按钮
     */
    initButton: function () {

        buttons.push({
            id: 'continue',
            name: '继续',
            type: 'img',
            nextFocusLeft: 'back',
            nextFocusRight: 'back',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + "/Public/img/hd/Hold/V20/jump.png",
            focusImage: g_appRootPath + "/Public/img/hd/Hold/V20/jump_f.png",
            click: Hold.onBtnClick,
            focusChange: LMEPG.emptyFunc,
            beforeMoveChange: LMEPG.emptyFunc,
            moveChange: LMEPG.emptyFunc,
            cIndex: 2
        });
        buttons.push({
            id: 'back',
            name: '残忍离开',
            type: 'img',
            nextFocusLeft: 'continue',
            nextFocusRight: 'continue',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + "/Public/img/hd/Hold/V20/back.png",
            focusImage: g_appRootPath + "/Public/img/hd/Hold/V20/back_f.png",
            click: Hold.onBtnClick,
            focusChange: LMEPG.emptyFunc,
            beforeMoveChange: LMEPG.emptyFunc,
            moveChange: LMEPG.emptyFunc,
            cIndex: 1
        });
    },

    /**
     * 导航栏初始化
     */
    init: function () {
        G('default_link').focus();

        this.initButton();
        LMEPG.ButtonManager.init('continue', buttons, '', true);

    }
};

/**
 * 返回按键响应
 */
function onBack() {
    Page.jumpAppHome();
}
