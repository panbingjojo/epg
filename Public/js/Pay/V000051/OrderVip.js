/**
 * 得到当前页面对象
 * @returns {*|{name, param, setPageName, setParam}}
 */
function getCurrentPage() {
    return LMEPG.Intent.createIntent('orderVip');
}

/**
 * 跳转 - 订购页
 */
function jumpBuyVip(id, remark) {
    var objOrderVip = getCurrentPage();
    objOrderVip.setParam('returnPageName', RenderParam.returnPageName);

    // 订购首页
    var objOrderHome = LMEPG.Intent.createIntent('orderHome');
    objOrderHome.setParam('isPlaying', '0');
    objOrderHome.setParam('remark', remark);
    objOrderHome.setParam('singlePayItem', 1);
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
        case 'order_vip':
            jumpBuyVip();
            break;
        case 'back':
            onBack();
            break;
    }
}

var buttons = [];
buttons.push({
    id: 'order_vip',
    name: '订购按钮',
    type: 'img',
    nextFocusLeft: '',
    nextFocusRight: 'back',
    nextFocusUp: '',
    nextFocusDown: '',
    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/bg_order_button.png',
    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/f_order_button.png',
    click: onClick,
    focusChange: LMEPG.emptyFunc,
    beforeMoveChange: LMEPG.emptyFunc,
    moveChange: LMEPG.emptyFunc
});
buttons.push({
    id: 'back',
    name: '返回按钮',
    type: 'img',
    nextFocusLeft: 'order_vip',
    nextFocusRight: '',
    nextFocusUp: '',
    nextFocusDown: '',
    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/bg_back.png',
    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/f_back.png',
    click: onClick,
    focusChange: LMEPG.emptyFunc,
    beforeMoveChange: LMEPG.emptyFunc,
    moveChange: LMEPG.emptyFunc
});

window.onload = function () {
    LMEPG.ButtonManager.init('order_vip', buttons, '', true);
};