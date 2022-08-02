/**
 * 得到当前页面对象
 */
function getCurrentPage() {
    return LMEPG.Intent.createIntent('unsubscribeVip');
}

/**
 * 跳转 - 订购页
 */
function jumpSecondUnsubscribeVip() {
    var objOrderVip = getCurrentPage();
    objOrderVip.setParam('returnPageName', RenderParam.returnPageName);

    // 订购首页
    var objOrderHome = LMEPG.Intent.createIntent('secondUnsubscribeVip');
    objOrderHome.setParam('returnPageName', RenderParam.returnPageName);


    LMEPG.Intent.jump(objOrderHome, objOrderVip);
}

/**
 * 返回键
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 点击事件
 * @param btn
 */
function onClick(btn) {
    switch (btn.id) {
        case 'unsubscribe_vip':
            jumpSecondUnsubscribeVip();
            break;
        case 'back':
            onBack();
            break;
    }
}

var buttons = [];
buttons.push({
    id: 'back',
    name: '返回按钮',
    type: 'img',
    nextFocusLeft: '',
    nextFocusRight: 'unsubscribe_vip',
    nextFocusUp: '',
    nextFocusDown: '',
    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/bg_unsubscribe_back.png',
    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/f_unsubscribe_back.png',
    click: onClick,
    focusChange: LMEPG.emptyFunc,
    beforeMoveChange: LMEPG.emptyFunc,
    moveChange: LMEPG.emptyFunc
});

buttons.push({
    id: 'unsubscribe_vip',
    name: '退订按钮',
    type: 'img',
    nextFocusLeft: 'back',
    nextFocusRight: '',
    nextFocusUp: '',
    nextFocusDown: '',
    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/bg_unsubscribe_button.png',
    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/f_unsubscribe_button.png',
    click: onClick,
    focusChange: LMEPG.emptyFunc,
    beforeMoveChange: LMEPG.emptyFunc,
    moveChange: LMEPG.emptyFunc
});

window.onload = function () {
    LMEPG.ButtonManager.init('back', buttons, '', true);
};
