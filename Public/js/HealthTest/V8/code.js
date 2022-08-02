// 当前服务器时间
var curServerTime = 0;
var timer = null
var Page = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('sg-blood');
        currentPage.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        currentPage.setParam('testDevice',JSON.stringify(WaitStep.device));
        currentPage.setParam('remind',WaitStep.translateText(RenderParam.remind));
        return currentPage;
    },


    /**
     * 跳转输入数据页面
     */
    jumpPageInputDataPage: function () {
        var curPage = Page.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('inputTest');
        dstPage.setParam('type', WaitStep.device.type_name.substr(0,2));
        LMEPG.Intent.jump(dstPage, curPage);
    },
    /**
     * 跳转计费
     */
    jumpBuyVip: function () {
        if( RenderParam.accountId == 'spcs02' ||
            RenderParam.accountId == 'spcs03' ||
            RenderParam.accountId == 'spcs04' ||
            RenderParam.accountId == 'spcs05'){
            var param = '{\"appId\":\"1747030842\",\"outDown\":\"1\",\"jumpUrl\":\"http://10.255.25.161:8085/activity/tianyiGardenNew/home.html?isNotResumeKeyOut=guhjkl\",\"flag\":\"zj_yyh\"}';
        }else{
            var param = '{\"appId\":\"1747030842\",\"outDown\":\"1\",\"jumpUrl\":\"http://10.255.25.161:8085/activity/tianyiGardenNew/index.html?isNotResumeKeyOut=guhjkl\",\"flag\":\"zj_yyh\"}';
        }
        LMAndroid.JSCallAndroid.quitPay(param, function (resParam, notifyAndroidCallback) {});
        LMAndroid.JSCallAndroid.doExitApp();
        /*
        var curPage = Page.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        jumpObj.setParam("userId", RenderParam.userId);
        jumpObj.setParam("mark", "1");
        LMEPG.Intent.jump(jumpObj, curPage);
         */
    },
    /**
     * 跳转输入数据页面
     */
    jumpPageStep: function () {
        var curPage = Page.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('xt-step');
        dstPage.setParam('stepPic',WaitStep.device.measure_state_picture)
        dstPage.setParam('deviceName',WaitStep.device.check_name)
        dstPage.setParam('testDevice',JSON.stringify(WaitStep.device));
        dstPage.setParam('remind',WaitStep.translateText(RenderParam.remind));
        LMEPG.Intent.jump(dstPage, curPage);
    },
    /**
     * 跳转输入数据页面
     */
    jumpPageIntroduce: function () {
        var curPage = Page.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('introduce');
        dstPage.setParam('introId',WaitStep.device.id)
        LMEPG.Intent.jump(dstPage, curPage);
    }
};

var WaitStep = {
    secnce: "",
    device: null,

        /**
         * 初始化
         */
        init: function () {
            var that = this
            if(RenderParam.deviceModelId && !RenderParam.testDevice){
                that.getDeviceList(function (data) {
                    that.device = data
                    that.device.reminder = '';
                    RenderParam.remind = data.reminder
                    that.renderContent()
                })
            }else {
                that.device= JSON.parse(RenderParam.testDevice.replace(/&quot;/g, "\""));
                console.log(that.device)
                that.renderContent()
            }
        },

    renderContent:function(){
        G('title').innerHTML = WaitStep.device.check_name
        G('reminder-tips').innerHTML = WaitStep.translateText(RenderParam.remind) || '请打开手机扫描二维码，根据【设备使用说明】流程进行设备绑定和数据归档～'

        WaitStep.writeDataButtons();
        WaitStep.getDeviceQRNew()

    },

    getDeviceQRNew:function(){

        var data =JSON.stringify({
            carrierId:RenderParam.carrierId,
            nikeName:RenderParam.accountId,
            userId:RenderParam.userId,
            QRCodeType:WaitStep.device.device_model_id,
            snCode:WaitStep.device.sn || '',
            deviceName:WaitStep.device.device_model_name,
            deviceModel:WaitStep.device.device_model
        })

        LMEPG.ajax.postAPI('NewHealthDevice/getDeviceQR', {
                type:10003,
                payload:data
            }, function (data) {

            G("code").src = data.data.data
            timer = setInterval(function () {
                WaitStep.checkQRStatusNew(data.data.scene,function () {
                    LMEPG.UI.showToast("扫码成功!");
                    Page.jumpPageStep();
                    clearInterval(timer);
                })
            },6000)
        })
    },

    checkQRStatusNew:function(scene, cb){
        LMEPG.ajax.postAPI('NewHealthDevice/checkQRStatus', {
            'scene':scene
        },function (res) {
            if(!res){
                WaitStep.checkQRStatus(scene, cb);
            }

            if(res.data.code === 200){
               cb()
            }else if(res.data.code===401 || res.data.code === 403){
                clearInterval(timer);
                WaitStep.getDeviceQRNew();
            }
        })
    },

    getDeviceQR:function(cb){
        LMEPG.ajax.postAPI('DeviceCheck/getBloodCode', {
            QRCodeType:WaitStep.device.device_model_id,
            snCode:WaitStep.device.sn || '',
            deviceName:WaitStep.device.device_model_name,
            deviceModel:WaitStep.device.device_model
        },function (data) {
            console.log(data)
            if(data.resultcode === 0){
                cb(data)
            }else {
                LMEPG.UI.showToast("拉取二维码请求失败!");
            }
        })
    },

    checkQRStatus:function(scene,cb){
        LMEPG.ajax.postAPI('DeviceCheck/getBloodCodeStatus', {
            scene:scene
        },function (data) {
            console.log(data)
            if(data.resultcode == 0 && data.status == 1){
                cb()
            }
        })
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

    translateText: function (text) {
        return text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, "\"")
    },

    //湖南电信--设置计费按钮
    setFeeButton:function(buttons){
        G('fee-btn').style.display = "inline-block";
        G('fee-btn').style.position = "absolute";
        G('fee-btn').style.top = "46px";
        G('fee-btn').style.left = "829px";
        var backImage = '/Public/img/hd/HealthTest/V8/fee.png';
        var focusImage = '/Public/img/hd/HealthTest/V8/fee_f.png';

        if(LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)){
            backImage = '/Public/img/hd/HealthTest/V8/vip.png';
            focusImage = '/Public/img/hd/HealthTest/V8/vip_f.png';
            G('fee-btn').src = g_appRootPath + backImage;
            RenderParam.focusId = RenderParam.focusId == "fee-btn"?"introduce-btn":RenderParam.focusId;
        }


        buttons.push({
            id: 'fee-btn',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'write-btn',
            backgroundImage: g_appRootPath + backImage,//'/Public/img/hd/HealthTest/V8/fee.png',
            focusImage: g_appRootPath + focusImage,//'/Public/img/hd/HealthTest/V8/fee_f.png',
            nextFocusDown: 'introduce-btn',
            click: Page.jumpBuyVip
        });

        if(!LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)){
            buttons[0].nextFocusLeft = "fee-btn";
            buttons[1].nextFocusUp = "fee-btn";
        }

        return buttons;
    },

        /**
         * 初始化按钮
         */
        writeDataButtons: function () {
            var buttons = [
                {
                    id: 'write-btn',
                    type: 'img',
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input_f.png',
                    nextFocusDown: 'introduce-btn',
                    click: Page.jumpPageInputDataPage
                },
                {
                    id: 'introduce-btn',
                    type: 'img',
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/product-btn.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/product-btn-f.png',
                    nextFocusUp: 'write-btn',
                    click: Page.jumpPageIntroduce
                }
            ];

            if(RenderParam.carrierId == "430002" && RenderParam.lmp == "16"){
                buttons = WaitStep.setFeeButton(buttons);
            }

            console.log(!LMEPG.Func.isEmpty(RenderParam.focusId));
            LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'introduce-btn', buttons, '', true);
        }
    }
;

/**
 * 返回键
 */
var onBack = function () {
    LMEPG.Intent.back();
};

// 初始化
WaitStep.init();
