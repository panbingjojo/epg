// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 停止订购提示页
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2019/10/30
// +----------------------------------------------------------------------

/**
 * 停止订购提示页 - 唯一入口管理类
 */
var ForbidOrder = {
    /**
     * 初始化按钮事件
     */
    __initButtons: function () {
        var buttons = [
            {
                id: "toast_message_submit",
                name: "确定",
                type: "img",
                click: 'LMEPG.Intent.back()',
            }
        ];
        LMEPG.BM.init("toast_message_submit", buttons, "", true);
    },

    /**
     * 唯一初始化入口
     */
    init: function () {
        this.__initButtons();
        setTimeout(function () {
            LMEPG.Intent.back();
        }, 5000);
    },
};

window.onload = function () {
    ForbidOrder.init();
};
