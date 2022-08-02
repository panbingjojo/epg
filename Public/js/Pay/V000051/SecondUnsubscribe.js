/**
 * 得到当前页面对象
 * @returns {*|{name, param, setPageName, setParam}}
 */
function getCurrentPage() {
    return LMEPG.Intent.createIntent('secondUnsubscribeVip');
}

/**
 * 发起退订
 */
function unsubscribeVip() {
    var postData = {
        product_id: "1",
        returnPageName: RenderParam.returnPageName,
    };
    LMEPG.ajax.postAPI('Pay/buildUnPayUrl', postData, function (data) {
        if (data.result == 0) {
            window.location.href = data.unPayUrl;
        } else {
            LMEPG.UI.showToast('您未订购此产品，不可进行退订操作！');
        }
    });
}

/**
 * 返回键
 */
function onBack() {
    LMEPG.Intent.back(RenderParam.returnPageName);
}

/**
 * 点击事件
 * @param btn
 */
function onClick(btn) {
    switch (btn.id) {
        case 'second_unsubscribe_vip':
            unsubscribeVip();
            break;
        case 'cancel':
            onBack();
            break;
    }
}

var buttons = [];
buttons.push({
    id: 'cancel',
    name: '返回按钮',
    type: 'img',
    nextFocusLeft: '',
    nextFocusRight: 'second_unsubscribe_vip',
    nextFocusUp: '',
    nextFocusDown: '',
    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/bg_second_unsubscribe_cancel.png',
    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/f_second_unsubscribe_cancel.png',
    click: onClick,
    focusChange: LMEPG.emptyFunc,
    beforeMoveChange: LMEPG.emptyFunc,
    moveChange: LMEPG.emptyFunc
});
buttons.push({
    id: 'second_unsubscribe_vip',
    name: '确认退订',
    type: 'img',
    nextFocusLeft: 'cancel',
    nextFocusRight: '',
    nextFocusUp: '',
    nextFocusDown: '',
    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/bg_second_unsubscribe_button.png',
    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/f_second_unsubscribe_button.png',
    click: onClick,
    focusChange: LMEPG.emptyFunc,
    beforeMoveChange: LMEPG.emptyFunc,
    moveChange: LMEPG.emptyFunc
});

window.onload = function () {
    LMEPG.ButtonManager.init('cancel', buttons, '', true);
};