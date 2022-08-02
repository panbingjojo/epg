var buttons = [];

/**
 * 返回事件
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 焦点初始化
 */
function initButtons() {
    buttons.push(
        {
            id: 'btn-ok',
            name: "确定按键",
            type: "img",
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V370092/btn_pay_result_ok_out.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V370092/btn_pay_result_ok_in.png',
            click: 'onBack()',
        }
    );
}

window.onload = function () {
    if (RenderParam.isSuccess == "1") {
        G("bgImg").src = g_appRootPath + "/Public/img/hd/Pay/V370092/pay_result_success.png";
    } else {
        G("bgImg").src = g_appRootPath + "/Public/img/hd/Pay/V370092/pay_result_fail.png";
    }

    initButtons();
    LMEPG.ButtonManager.init("btn-ok", buttons, '', true);
};
