var Page = {
    /**
     * 跳转 - 应用首页
     */
    jumpAppHome: function () {
        var objHold = LMEPG.Intent.createIntent('hold');

        var objHome = LMEPG.Intent.createIntent('home');
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', '0');

        LMEPG.Intent.jump(objHome, objHold, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },
};

var buttons = [];

function onBack() {
    ottService.close();
}

var Hold = {
    /**
     * 按钮点击事件
     * @param btn
     */
    onBtnClick: function (btn) {
        G('debug').innerHTML = 'onBtnClick...<br/>';
        switch (btn.id) {
            case 'continue':
                Page.jumpAppHome();
                break;
            case 'back':
                ottService.close();
                break;
        }
    },

    /**
     *
     */
    updateBackground: function () {
        var background = RenderParam.platformType == 'hd' ? RenderParam.fsUrl + RenderParam.tipsData[2].onfocus_image_url
            : RenderParam.fsUrl + RenderParam.tipsData[2].onblur_image_url;
        G('splash').src = background;
    },

    /**
     * 初始化按钮
     */
    initButton: function () {
        var bgBackImg = RenderParam.fsUrl +
            RenderParam.tipsData[1].onfocus_image_url;
        var bgFBackImg = RenderParam.fsUrl +
            RenderParam.tipsData[1].onblur_image_url;
        var bgContinueImg = RenderParam.fsUrl +
            RenderParam.tipsData[0].onfocus_image_url;
        var bgFContinueImg = RenderParam.fsUrl +
            RenderParam.tipsData[0].onblur_image_url;
        buttons.push({
            id: 'continue',
            name: '继续',
            type: 'img',
            nextFocusLeft: 'back',
            nextFocusRight: 'back',
            backgroundImage: bgBackImg,
            focusImage: bgFBackImg,
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
            backgroundImage: bgContinueImg,
            focusImage: bgFContinueImg,
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
        if(RenderParam.carrierId != "640094"){
            G('default_link').focus();
        }
        G('debug').innerHTML = 'init...<br/>';
        this.updateBackground();
        this.initButton();
        LMEPG.ButtonManager.init('continue', buttons, '', true);
    }
};
