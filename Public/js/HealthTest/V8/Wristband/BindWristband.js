// 当前服务器时间
var curServerTime = 0;
var buttons = [];

var Page = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('bind-wristband');
        currentPage.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        currentPage.setParam('curId', WaitStep.curId);
        return currentPage;
    },


    /**
     * 跳介绍页面
     */
    jumpPageIntroduce: function () {
        var curPage = Page.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('intro-wristband');
        LMEPG.Intent.jump(dstPage, curPage);
    },
    /**
     * 跳转步骤页面
     */
    jumpPageStep: function () {
        var curPage = Page.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('step-wristband');
        LMEPG.Intent.jump(dstPage, curPage);
    },

};

var WaitStep = {
    secnce: "",
    curId: 0,
    /**
     * 初始化
     */
    init: function () {
        this.writeDataButtons();
        if (RenderParam.focusId == "introduce-btn") {
            WaitStep.getCodeAjax({cType: RenderParam.curId})
        } else {
            AddMemberMask.isBack = true;
            AddMemberMask.show("introduce-btn", WaitStep.getCodeAjax);
        }

    },
    getCodeAjax: function (btn) {
        WaitStep.curId = btn.cType;
        AddMemberMask.isBack = false;
        if (RenderParam.focusId != "introduce-btn") {
            AddMemberMask.hidden();
        }
        var postData = {
            QRCodeType: 1,
            memberId: btn.cType,
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('DeviceCheck/getBloodCode', postData,
            function (data) {
                try {
                    if (data.resultcode != 0) {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("拉取二维码失败!");
                    } else {
                        LMEPG.UI.dismissWaitingDialog();
                        G("code").src = data.data.imagebase64;
                        WaitStep.secnce = data.data.scene;
                        WaitStep.polling();
                        // alert(data.data.scene);
                    }
                } catch (e) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("拉取二维码解析异常!" + e);
                }
            },
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("拉取二维码请求失败!");
            }
        );
    },
    /**
     * 轮询查询最新的检测记录
     */
    polling: function () {
        var postData = {'scene': WaitStep.secnce};
        LMEPG.ajax.postAPI('DeviceCheck/getBloodCodeStatus', postData, function (data) {
            console.log(data);
            LMEPG.Log.info('健康检测轮询记录：' + JSON.stringify(data));
            if (data.resultcode == 0) {
                if (data.status == 1) {
                    LMEPG.UI.showToast("扫码成功!");
                    Page.jumpPageStep();
                } else {
                    setTimeout(function () {
                        WaitStep.polling();
                    }, 6000);
                }
            } else {
                setTimeout(function () {
                    WaitStep.polling();
                }, 6000);
            }
        });
    },

    /**
     * 初始化按钮
     */
    writeDataButtons: function () {
        buttons.push({
            id: 'introduce-btn',
            type: 'img',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/introduce.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/introduce_f.png',
            nextFocusLeft: 'write-btn',
            click: Page.jumpPageIntroduce
        })
        console.log(!LMEPG.Func.isEmpty(RenderParam.focusId));
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'introduce-btn', buttons, '', true);
    }
};
/**
 * 返回键
 */
var onBack = function () {
    LMEPG.Intent.back();
};

// 初始化
WaitStep.init();
