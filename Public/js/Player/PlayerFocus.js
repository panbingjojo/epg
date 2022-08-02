/**
 * +----------------------------------------
 * | 播放器页面通用功能的焦点移动与交互：
 * | -->挽留页的推荐位焦点与滚动等控制
 * +----------------------------------------
 * | 创建者：SongHui
 * | 日期：2018/8/2
 * +----------------------------------------
 */

/****************************************************************
 * 先声明当前的命名空间
 *****************************************************************/
var PlayerFocus = {};

/****************************************************************
 * 提供外部调用的：控制播放挽留页指定按钮焦点方式
 *****************************************************************/
PlayerFocus.hasFocus = function (buttonObj, hasFocus) {
    if (typeof buttonObj === 'undefined' || buttonObj == null) {
        console.error('------> Error: buttonObj is undefined!');
        return;
    }

    if (typeof buttonObj.id === 'undefined' || buttonObj.id == null || buttonObj.id === '') {
        console.error('------> Error: No specified button.id!!!');
        return;
    }

    if (hasFocus) {
        _onFocus(buttonObj);
    } else {
        _onBlur(buttonObj);
    }
};

/****************************************************************
 * 内部调用：指定按钮获得焦点
 *****************************************************************/
function _onFocus(buttonObj) {
    var btnId = buttonObj.id;
    var dom = G(btnId);
    if (!dom) {
        console.error('------> _onFocus(buttonObj).Error: Not exist dom!!!');
        return;
    }

    // 如果焦点移动到挽留页的第2行按钮（“重播/继续播放、收藏/取消收藏、退出”）
    if (btnId.startWith('focus-2')) {
        dom.src = buttonObj.focusImage;
        LMEPG.UI.Marquee.stop();
    }

    // 如果焦点移动到挽留页的第1行按钮（1-4号推荐位）
    if (btnId.startWith('focus-1')) {
        if (RenderParam.carrierId != '520092') {
            dom.className = dom.className + ' imghover';
        }
        for (var i = 0; i < 4; i++) {
            if (btnId == ('focus-1-' + (i + 1))) {
                LMEPG.UI.Marquee.stop();  // 停止上一个滚动
                LMEPG.UI.Marquee.start('li' + i, 8, 2, 50, 'left', 'scroll'); // 开启新的文字滚动
                break; // 找到匹配的，则退出循环！
            }
        }
    }
}

/****************************************************************
 * 内部调用：指定按钮失去焦点
 *****************************************************************/
function _onBlur(buttonObj) {
    var btnId = buttonObj.id;
    var dom = G(btnId);
    if (!dom) {
        console.error('------> _onBlur(buttonObj).Error: Not exist dom!!!');
        return;
    }

    // 如果焦点移出挽留页的第2行按钮（“重播/继续播放、收藏/取消收藏、退出”）
    if (btnId.startWith('focus-2')) {
        dom.src = buttonObj.backgroundImage;
    }

    // 如果焦点移出到挽留页的第1行按钮（1-4号推荐位）
    if (btnId.startWith('focus-1')) {
        dom.className = 'imgback';
        LMEPG.UI.Marquee.stop();
    }
}