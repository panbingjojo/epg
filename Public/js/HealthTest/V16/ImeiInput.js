var InputImei = {
    buttons: [],
    hintText: "请输入有效的IMEI",

    init: function () {
        this.createBtns();
        this.initData();
    },

    keyPad: function (btn, hasFocus) { // 需定义一个父级容器（不可以body为父级）
        if (hasFocus) LMEPG.UI.keyboard.show(88, 100, 'input-number', 'next-step');
    },

    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('imeiInput');
        objCurrent.setParam('testType', RenderParam.testType);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        return objCurrent;
    },

    jumpPageInputDataPage: function () {
        var curPage = InputImei.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('inputTestData');
        dstPage.setParam('testType', RenderParam.testType);
        LMEPG.Intent.jump(dstPage, curPage);
    },

    deleteInputData: function (btn) {
        var val = G('input-number').innerHTML;
        if (val !== InputImei.hintText) {
            var cutLastValue = val.slice(0, val.length - 1) || InputImei.hintText;
            G('input-number').innerHTML = cutLastValue;
        }
    },

    clearInputData: function (btn) {
        G('input-number').innerHTML = InputImei.hintText;
    },

    createBtns: function () {
        this.buttons.push({
            id: 'input-number',
            name: '输入框',
            type: 'img',
            nextFocusUp: 'write-btn',
            nextFocusDown: 'next-step',
            nextFocusRight: 'input-delete',
            focusChange: this.keyPad
        }, {
            id: 'input-delete',
            name: '删除',
            type: 'img',
            nextFocusUp: 'write-btn',
            nextFocusDown: 'next-step',
            nextFocusLeft: 'input-number',
            nextFocusRight: 'input-clear',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/delete.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/delete_f.png',
            click: this.deleteInputData
        }, {
            id: 'input-clear',
            name: '清空',
            type: 'img',
            nextFocusUp: 'write-btn',
            nextFocusDown: 'next-step',
            nextFocusLeft: 'input-delete',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/clear.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/clear_f.png',
            click: this.clearInputData
        }, {
            id: 'write-btn',
            name: '输入数据按钮',
            type: 'img',
            nextFocusUp: '',
            nextFocusDown: 'input-clear',
            nextFocusLeft: 'input-clear',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/write_btn.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/write_btn_f.png',
            click: this.jumpPageInputDataPage
        }, {
            id: 'next-step',
            name: '下一步',
            type: 'img',
            nextFocusUp: 'input-delete',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/next_step.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/next_step_f.png',
            click: this.bindDevice
        });
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'input-delete', this.buttons, '', true);
        if (LMEPG.Func.isEmpty(RenderParam.focusId) && !LMEPG.Func.isEmpty(RenderParam.imei_number)) {
            LMEPG.BM.requestFocus('next-step');
        }
    },

    /**
     * 初始化数据
     */
    initData: function () {
        Hide('cholesterol-tips');
        Hide('uric-tips');
        Hide('blood-tips');

        if (RenderParam.testType == 1) {
            G('title').innerHTML = '胆固醇检测';
            Show('cholesterol-tips');
        } else if (RenderParam.testType == 2) {
            G('title').innerHTML = '尿酸检测';
            Show('uric-tips');
        } else {
            G('title').innerHTML = '血糖检测';
            Show('blood-tips');
        }

        // 输入过imei，则填入
        if (!LMEPG.Func.isEmpty(RenderParam.imei_number)) {
            G('input-number').innerHTML = RenderParam.imei_number;
        }
    },

    /**
     * 绑定检测仪
     * @param macAddr
     */
    bindDevice: function () {
        var macAddr = G('input-number').innerHTML;
        // macAddr = '865473037826941';
        if (macAddr == '') {
            LMEPG.UI.showToast('IMEI号不可为空');
            return;
        }
        // var postData = {"dev_mac_addr": "865473037826941"};
        var postData = {'dev_mac_addr': macAddr};
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Measure/bindDevice', postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (!(data instanceof Object)) {
                data = JSON.parse(data);
            }
            if (data.result == 0 || data.result == '0') {
                // 设置推送id
                InputImei.setPushId();
            } else {
                LMEPG.UI.showToast('绑定设备失败');
            }
        });
    },

    /**
     * 设置推送id
     */
    setPushId: function () {
        var postData = {};
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Measure/setPushId', postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (!(data instanceof Object)) {
                data = JSON.parse(data);
            }
            if (data.result == 0 || data.result == '0') {
                // 跳转到检测步骤页面
                var objSrc = InputImei.getCurrentPage();
                var objDst = LMEPG.Intent.createIntent('healthTestDetectionStep');
                objDst.setParam('testType', RenderParam.testType);
                LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
            } else {
                LMEPG.UI.showToast('设置推送id失败');
            }
        });
    }
};
var onBack = function () {
    LMEPG.Intent.back();
};