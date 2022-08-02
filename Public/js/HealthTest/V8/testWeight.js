var InputImei = {
    buttons: [],
    hintText: '',
    device:null,

    init: function () {
        var that = this
        if(RenderParam.deviceModelId && !RenderParam.testDevice){
            that.getDeviceList(function (data) {
                that.device = data
                that.device.reminder = '';
                RenderParam.remind = data.reminder
                InputImei.hintText = that.device.sn || "请输入乐心体脂称的SN号"
                that.initData();
            })
        }else {
            that.device= JSON.parse(RenderParam.testDevice.replace(/&quot;/g, "\""));
            InputImei.hintText = this.device.sn || "请输入乐心体脂称的SN号"
            this.initData();
        }
        console.log(this.device)

        this.checkBindDevice();
        this.createBtns();
    },

    keyPad: function (btn, hasFocus) { // 需定义一个父级容器（不可以body为父级）
        if (hasFocus) LMEPG.UI.keyboard.show(860, 315, 'input-number', false, 'next-step');
    },

    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('test-weight');
        objCurrent.setParam('testType', RenderParam.testType);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('testDevice',JSON.stringify(InputImei.device));
        objCurrent.setParam('remind',InputImei.translateText(RenderParam.remind));
        return objCurrent;
    },
    /**
     * 跳转输入数据页面
     */
    jumpPageStep: function () {
        var curPage = InputImei.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('xt-step');
        dstPage.setParam('stepPic',InputImei.device.measure_state_picture)
        dstPage.setParam('deviceName',InputImei.device.check_name)

        dstPage.setParam('testDevice',JSON.stringify(InputImei.device));
        dstPage.setParam('remind',InputImei.translateText(RenderParam.remind));
        LMEPG.Intent.jump(dstPage, curPage);
    },

    jumpPageInputDataPage: function () {
        var curPage = InputImei.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('inputTest');
        dstPage.setParam('type', '体脂');
        LMEPG.Intent.jump(dstPage, curPage);
    },
    /**
     * 跳转输入数据页面
     */
    jumpPageIntroduce: function () {
        var curPage = InputImei.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('introduce');
        dstPage.setParam('introId',InputImei.device.id)
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
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input_f.png',
                nextFocusDown: 'input-clear',
                click: this.jumpPageInputDataPage
            },
            {
                id: 'introduce-btn',
                type: 'img',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/product-btn.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/product-btn-f.png',
                nextFocusUp: 'next-step',
                nextFocusLeft: '',
                click: this.jumpPageIntroduce
            }, {
                id: 'next-step',
                name: '下一步',
                type: 'img',
                nextFocusUp: 'input-delete',
                nextFocusDown:'introduce-btn',
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
        G('title').innerHTML = this.device.check_name;
        G('blood-tips').innerHTML = this.translateText(RenderParam.remind) || '请打开手机扫描二维码，根据【设备使用说明】流程进行设备绑定和数据归档～'

        if (!LMEPG.Func.isEmpty(RenderParam.imei_number)) {
            G('input-number').innerHTML = RenderParam.imei_number;
        }
    },

    translateText: function (text) {
        return text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, "\"")
    },


    /**
     * 绑定检测仪
     * @param macAddr
     */
    checkBindDevice: function () {
        var postData = {"bind_type": 0, "paper_type": 6};
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
                } else {
                    G('input-number').innerHTML = InputImei.hintText;
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
        if (macAddr == '' || macAddr == '请输入乐心体脂称的SN号') {
            LMEPG.UI.showToast('SN号不可为空');
            return;
        }

        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('NewHealthDevice/bindDevice', {
            sn: macAddr
        }, function (data) {
            console.log(data);
            LMEPG.UI.dismissWaitingDialog();
            if (data.code === 200) {
                LMEPG.UI.showToast('绑定成功');
                InputImei.jumpPageStep();
            } else {
                LMEPG.UI.showToast('绑定设备失败');
            }
        });
    },

    getDeviceList:function(cb){
        LMEPG.ajax.postAPI('NewHealthDevice/getDeviceList', {
            deviceModelId:RenderParam.deviceModelId
        },function (data) {
            console.log(data)
            if(data.result === 0){
                cb(data.data[0])
            }else {
                LMEPG.UI.showToast('获取设备列表错误!')
            }
        })
    },
};

var onBack = function () {
    LMEPG.Intent.back();
};