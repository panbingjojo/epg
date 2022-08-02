/**
 * 返回键
 */
function onBack() {
    LMEPG.Intent.back();
}

var buttons = [];
buttons.push({
    id: 'back',
    name: '返回按钮',
    type: 'img',
    nextFocusLeft: '',
    nextFocusRight: '',
    nextFocusUp: '',
    nextFocusDown: '',
    backgroundImage: '',
    focusImage: '',
    click: 'onBack()',
    focusChange: LMEPG.emptyFunc,
    beforeMoveChange: LMEPG.emptyFunc,
    moveChange: LMEPG.emptyFunc,
});

window.onload = function () {
    LMEPG.ButtonManager.init('back', buttons, '', true);
};