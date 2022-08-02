/**
 * 得到当前页面对象
 */
function getCurrentPage() {
    return LMEPG.Intent.createIntent('unsubscribeResult');
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
        case 'btn_ok':
            onBack();
            break;
    }
}

var buttons = [];
buttons.push({
    id: 'btn_ok',
    name: '确定按钮',
    type: 'img',
    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/bg_unsubscribe_back.png',
    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Order/f_unsubscribe_back.png',
    click: onClick,
});

window.onload = function () {
    LMEPG.ButtonManager.init('btn_ok', buttons, '', true);
};