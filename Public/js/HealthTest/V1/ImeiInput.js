// +----------------------------------------------------------------------
// | EPG-LWS
// +----------------------------------------------------------------------
// | [健康检测-首页]页面控制js
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/2/12 下午1:41
// +----------------------------------------------------------------------
var LOG_TAG = 'ImeiInput.js';
var debug = false;

// 启用浏览器默认按键功能：保证<input/>有焦点时能处理返回键！
window.isPreventDefault = false;

// 当前页默认有焦点的按钮ID
var defaultFocusId = 'input_box';

// 定义全局按钮
var buttons = [];

// 本地打印日志
function log(tag, msg) {
    var logMsg = LMEPG.Func.string.format("[{0}][{1}]--->{2}", [LOG_TAG, tag, msg]);
    if (debug) console.log(logMsg);
    LMEPG.Log.info(logMsg);
}

/**
 * 页面跳转控制
 */
var Page = {

    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('healthTestIMEIInput');
        currentPage.setParam('type', RenderParam.type);
        currentPage.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        return currentPage;
    },

    // 跳转->输入数据页面
    jumpInputData: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('healthTestInputData');
        objDst.setParam('type', RenderParam.type);
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    // 跳转->检测引导步骤
    jumpDetectionStep: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('healthTestDetectionStep');
        objDst.setParam('type', RenderParam.type);
        LMEPG.Intent.jump(objDst, objCurrent);
    }

};

/**
 * IMEI输入页面控制
 */
var IMEIInput = {

    // 初始化按钮
    initButtons: function () {
        buttons.push({
            id: 'btn_data_input',
            name: '输入数据',
            type: 'img',
            nextFocusLeft: 'input_box',
            nextFocusDown: 'input_box',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/bg_write.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/f_write.png',
            click: IMEIInput.onBtnClick,
            focusChange: IMEIInput.onBtnFocus
        });
        buttons.push({
            id: 'input_box',
            name: '输入框',
            type: 'img',
            nextFocusRight: 'btn_data_input',
            nextFocusUp: 'btn_data_input',
            nextFocusDown: 'btn_next_step',
            focusChange: IMEIInput.onInputFocus
        });
        buttons.push({
            id: 'btn_next_step',
            name: '下一步',
            type: 'div',
            nextFocusRight: 'btn_data_input',
            nextFocusUp: 'input_box',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/bg_button.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/f_button.png',
            click: IMEIInput.onBtnClick,
            focusChange: IMEIInput.onBtnFocus
        });
    },

    onBtnFocus: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).src = btn.focusImage;
        } else {
            G(btn.id).src = btn.backgroundImage;
        }
    },

    onInputFocus: function (btn, hasFocus) {
        var domInput = G(btn.id);

        if (hasFocus) {
            LMEPG.UI.keyboard.show(400,400,"input_box",false,"btn_next_step")
            // LMEPG.CssManager.removeClass(domInput, 'input_unfocus');
            // LMEPG.CssManager.addClass(domInput, 'input_focus');
            // domInput.disabled = false;
            // // domInput.focus(); // TODO，注意：focus()放在moveCursorTo方法中，否则光标会默认先到开头位置，有移动的差体验
            // setTimeout(function () {
            //     LMEPG.UI.Style.input_moveCursorTo(domInput, domInput.value.length);
            // });
        } else {
            // LMEPG.CssManager.removeClass(domInput, 'input_focus');
            // LMEPG.CssManager.addClass(domInput, 'input_unfocus');
            // domInput.disabled = true;
            // domInput.blur();
        }
    },

    // 实时校验<input>输入内容
    onInputContentChange: function (inputDom) {
        LMEPG.UI.Style.input_onContentChanged(inputDom, function (errorCode) {
            if (errorCode === LMEPG.UI.Style.ErrorCode.NOT_NUMBER) {
                LMEPG.UI.showToast('请输入IMEI数字：0-9', 1);
            }
        });
    },

    onBtnClick: function (btn) {
        switch (btn.id) {
            case 'btn_data_input':
                Page.jumpInputData();
                break;
            case 'btn_next_step':
                IMEIInput.bindIMEI();
                break;
        }
    },

    bindIMEI: function () {
        var imeiID = G('input_box').innerHTML;
        if (LMEPG.Func.isEmpty(imeiID)) {
            LMEPG.UI.showToast('IMEI号码不能为空！', 1);
            return;
        }

        var postData = {
            deviceId: imeiID
        };
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('DeviceCheck/bindDeviceId', postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (data.result == 0) {
                Page.jumpDetectionStep();
            } else {
                if (data.result == -101) { //设备地址不正确
                    LMEPG.UI.showToast('请输入有效的IMEI号码！');
                } else {
                    LMEPG.UI.showToast('绑定失败！[' + data.result + ']');
                }
            }
        });
    },

    // 设置推送id，用于健康检测 server -> client 之间的数据推送。
    listenMeasurePush: function () {
        LMEPG.ajax.postAPI('DeviceCheck/setPushId', null, function (data) {
            // log("listenMeasurePush", JSON.stringify(data))
            // LMEPG.UI.showToast(LMEPG.Func.string.format("设置推送id{0}", data.result == 0 ? "成功" : "失败"));
        });
    },

    // 初始化显示UI数据（标题、历史绑定设备id、温馨提示等）
    initRenderUI: function () {
        // 历史最近一次绑定的设备id
        if (!LMEPG.Func.isEmpty(RenderParam.bindDeviceId)) {
            G('input_box').innerHTML = RenderParam.bindDeviceId;
        }

        // var measureType = Measure.getTypeAsInt(RenderParam.type);
        // var measureTypeText = Measure.getTypeText(measureType);
        // var text2 = "高血糖、低血糖等患者";
        // switch (measureType) {
        //     case Measure.Type.BLOOD_GLUCOSE://血糖
        //         text2 = "高血糖、低血糖等患者";
        //         break;
        //     case Measure.Type.CHOLESTERIN://胆固醇
        //         text2 = "高血脂患者";
        //         break;
        //     case Measure.Type.URIC_ACID://尿酸
        //         text2 = "痛风患者";
        //         break;
        //     default:
        //         break;
        // }
        //
        // G("title").innerHTML = measureTypeText + "检测";
        // G("text1").innerHTML = measureTypeText;
        // G("text2").innerHTML = text2;
        // G("text3").innerHTML = measureTypeText;
    },

    initData: function () {
        // 初始化默认焦点设置
        if (!LMEPG.Func.isEmpty(RenderParam.bindDeviceId)) defaultFocusId = 'btn_next_step';
        if (!LMEPG.Func.isEmpty(RenderParam.focusIndex)) defaultFocusId = RenderParam.focusIndex;
    },

    /**
     * 初始化唯一入口
     */
    init: function () {
        this.listenMeasurePush();
        this.initData();
        this.initButtons();
        this.initRenderUI();

        LMEPG.ButtonManager.init(defaultFocusId, buttons, '', true);
    }
};

function onBack() {
    LMEPG.Intent.back();
}

window.onload = function () {
    IMEIInput.init();
};