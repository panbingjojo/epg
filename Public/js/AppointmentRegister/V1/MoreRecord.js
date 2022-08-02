/**
 * 获取当前页对象
 */
function getCurrentPage() {
    return LMEPG.Intent.createIntent("appointmentRegisterRecordMoreRecord");
}

/**
 * 返回事件
 */
function onBack() {
    LMEPG.Intent.back();
}

var moreRecordUrl = RenderParam.moreRecordUrl;
var buttons = [
    {
        id: "default",
        name: "default",
        type: "img",
        nextFocusLeft: "",
        nextFocusRight: "",
        nextFocusUp: "",
        nextFocusDown: "",
        backgroundImage: "",
        focusImage: "",
        click: "",
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
    }
];

window.onload = function () {
    LMEPG.ButtonManager.init("default", buttons, "", true);
};
