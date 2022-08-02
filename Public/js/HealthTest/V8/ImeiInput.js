var InputImei = {
    buttons: [],
    hintText: "请输入乐心血压计的SN号",

    init: function () {
        this.clearInputData();
        this.checkBindDevice();
        this.createBtns();
        this.initData();
    },

    keyPad: function (btn, hasFocus) { // 需定义一个父级容器（不可以body为父级）
        if (hasFocus){
            LMEPG.UI.keyboard.show(860, 315, 'input-number', false, 'next-step');
        } else {
            if(!G('input-number').innerHTML){
                G('input-number').innerHTML = InputImei.hintText;
            }
        }
    },

    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('aal-imei');
        objCurrent.setParam('testType', RenderParam.testType);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        return objCurrent;
    },
    /**
     * 跳转输入数据页面
     */
    jumpPageStep: function () {
        var curPage = InputImei.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('xy-step');
        LMEPG.Intent.jump(dstPage, curPage);
    },

    jumpPageInputDataPage: function () {
        var curPage = InputImei.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('inputTest');
        dstPage.setParam('testType', RenderParam.testType);
        dstPage.setParam('type', "5");
        LMEPG.Intent.jump(dstPage, curPage);
    },
    /**
     * 跳转输入数据页面
     */
    jumpPageIntroduce: function () {
        var curPage = InputImei.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('st-introduce');
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
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/delete.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/delete_f.png',
                click: this.deleteInputData
            }, {
                id: 'input-clear',
                name: '清空',
                type: 'img',
                nextFocusUp: 'write-btn',
                nextFocusDown: 'next-step',
                nextFocusLeft: 'input-delete',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/clear.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/clear_f.png',
                click: this.clearInputData
            }, {
                id: 'write-btn',
                type: 'img',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/blood.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/blood_f.png',
                nextFocusDown: 'input-clear',
                nextFocusRight: 'introduce-btn',
                click: this.jumpPageInputDataPage
            },
            {
                id: 'introduce-btn',
                type: 'img',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/introduce.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/introduce_f.png',
                nextFocusDown: 'input-clear',
                nextFocusLeft: 'write-btn',
                click: this.jumpPageIntroduce
            }, {
                id: 'next-step',
                name: '下一步',
                type: 'img',
                nextFocusUp: 'input-delete',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/next_step.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/next_step_f.png',
                click: this.bindDevice
            });
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'input-number', this.buttons, '', true);//input-delete
        if (LMEPG.Func.isEmpty(RenderParam.focusId) && !LMEPG.Func.isEmpty(RenderParam.imei_number)) {
            LMEPG.BM.requestFocus('next-step');
        }
    },

    /**
     * 初始化数据
     */
    initData: function () {
        G('title').innerHTML = '乐心血压计检测';
        // 输入过imei，则填入
        if (!LMEPG.Func.isEmpty(RenderParam.imei_number)) {
            G('input-number').innerHTML = RenderParam.imei_number;
        }
    },

    /**
     * 绑定检测仪
     * @param macAddr
     */
    checkBindDevice: function () {
        // bing_type: 0绑定、1解绑
        var postData = {"bind_type": 0, "paper_type": 5};
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('DeviceCheck/queryBloodDevice', postData, function (data) {
            console.log(data);
            LMEPG.UI.dismissWaitingDialog();
            if (!(data instanceof Object)) {
                data = JSON.parse(data);
            }
            if (data.result == 0) {
                if (data.dev_mac_addr != "") {
                    var tempNum = InputImei.replaceStr(data.dev_mac_addr)
                    G('input-number').innerHTML = tempNum;
                    console.log(tempNum.replace(/\s+/g, ""))
                }
            } else {
                LMEPG.UI.showToast('查询设备失败');
            }
        });
    },

    // 每隔4个字符加空格间隔
    replaceStr: function (str) {
        return str.replace(/(.{4})/g, '$1 ');
    },

    /**
     * 绑定检测仪
     * @param macAddr
     */
    bindDevice: function () {
        var macAddr2 = G('input-number').innerHTML;
        var macAddr = macAddr2.replace(/\s+/g, "")
        if (macAddr == '' || macAddr == '请输入乐心血压计的SN号') {
            LMEPG.UI.showToast('SN号不可为空');
            return;
        }
        // var postData = {"dev_mac_addr": "865473037826941"};
        var postData = {
            'devsn': macAddr,
            "paper_type": 5
        };
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('DeviceCheck/bindBloodDevice', postData, function (data) {
            console.log(data);
            LMEPG.UI.dismissWaitingDialog();
            if (!(data instanceof Object)) {
                data = JSON.parse(data);
            }
            if (data.code == 0 || data.code == '0') {
                LMEPG.UI.showToast('绑定成功');
                InputImei.jumpPageStep();
            } else {
                LMEPG.UI.showToast('绑定设备失败');
            }
        });
    },
};

function callFn(str) {
    var tempLength = str.replace(/\s+/g, "");
    if (tempLength.length % 4 == 0) {
        str = str + " ";
    }
    return str;
};
var onBack = function () {
    LMEPG.Intent.back();
};