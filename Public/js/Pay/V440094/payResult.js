var buttons = [];
var picPath = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Pay/V440094";

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
            backgroundImage: picPath + '/btn_pay_result_ok_out.png',
            focusImage: picPath + '/btn_pay_result_ok_in.png',
            click: 'onBack()',
        }
    );
}

window.onload = function () {
    if (RenderParam.isSuccess == "1") {
        G("bgImg").src = picPath + "/pay_result_success.png";
    } else {
        G("bgImg").src = picPath + "/pay_result_fail.png";
    }

    initButtons();
    LMEPG.ButtonManager.init("btn-ok", buttons, '', true);
};
