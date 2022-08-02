// 定义全局按钮
var buttons = [];

// 返回按键
function onBack() {
    Page.onBack();
}

// 页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        return LMEPG.Intent.createIntent("reservationRule");
    },

    /**
     * 返回事件
     */
    onBack: function () {
        if (RenderParam.lmcid == '450094' && RenderParam.inner != 1) {
            // 广西广电局方大厅进入返回逻辑
            var historyLength = history.length;
            var backLength = historyLength + 1 - RenderParam.splashHistory;
            history.go(-backLength);
        } else if (RenderParam.lmcid == '520092') {
            LMEPG.Intent.back("IPTVPortal");
        } else {
            LMEPG.Intent.back();
        }
    }
};

var Activity = {
    defaultFocusId: "default",

    init: function () {
        if(RenderParam.lmcid == "450094"){
            if (typeof iPanel == "object") {  //广西广电需要赋值返回键、退出键有页面来控制
                iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE", 1);
                iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE", 1);
            }

            //  添加点击返回事件
            LMEPG.Log.info('--->album History addKeyEvent: 广西广电新增返回事件');
            LMEPG.KeyEventManager.addKeyEvent(
                {
                    KEY_399: function () { //广西广电返回键
                        LMEPG.Log.info('--->album History KEY_399: 广西广电返回键');
                        Page.onBack();
                    },
                    KEY_514: function () {  //广西广电退出键
                        LMEPG.Log.info('--->album History KEY_514: 广西广电退出键');
                        Page.onBack();
                    }
                }
            )
        }

        Activity.initButtons();
        LMEPG.BM.init(Activity.defaultFocusId, buttons, "", true);
    },

    initButtons: function () {
        buttons.push({
            id: 'default',
            name: '默认焦点',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'subject-1',
            backgroundImage: "",
            focusImage: "",
            click: onBack,
            focusChange: "",
            beforeMoveChange: "",
            cType: "region",
        });
    },
};

window.onload = function () {
    Activity.init();
    lmInitGo();
};