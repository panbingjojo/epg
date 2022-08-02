// 当前服务器时间
var curServerTime = 0;
var qrCodeUrl = RenderParam.qrCodeUrl;
var Page = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('sg-blood');
        currentPage.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        return currentPage;
    },


    /**
     * 跳转输入数据页面
     */
    jumpPageInputDataPage: function () {
        var curPage = Page.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('inputTest');
        dstPage.setParam('type', "3");
        LMEPG.Intent.jump(dstPage, curPage);
    },
    /**
     * 跳转输入数据页面
     */
    jumpPageStep: function () {
        var curPage = Page.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('xt-step');
        LMEPG.Intent.jump(dstPage, curPage);
    },
    /**
     * 跳转输入数据页面
     */
    jumpPageIntroduce: function () {
        var curPage = Page.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('introduce');
        LMEPG.Intent.jump(dstPage, curPage);
    }
};

var WaitStep = {
        secnce: "",

        /**
         * 初始化
         */
        init: function () {
            this.writeDataButtons();
            LMEPG.UI.showWaitingDialog();
            var  boxModel = LMEPG.STBUtil.getSTBModel();
            var rgnCondition= new RegExp('^EC6');
            LMEPG.ajax.postAPI('DeviceCheck/getBloodCode', "",
                function (data) {
                    try {
                        if (data.resultcode != 0) {
                            LMEPG.UI.dismissWaitingDialog();
                            LMEPG.UI.showToast("拉取二维码失败!");
                        } else {
                            LMEPG.UI.dismissWaitingDialog();
                            //G("code").src = data.data.imagebase64;
                            if(typeof boxModel != 'undefined'&& rgnCondition.test(boxModel)){
                                G("code").src = WaitStep.getBoxQrCode(qrCodeUrl,data.data.scene,data.data.url,RenderParam.carrierId);
                                //LMEPG.UI.showToast("拉取地址:"+WaitStep.getBoxQrCode(qrCodeUrl,1001,data.data.url,"10220094"));
                            }else{
                                G("code").src = data.data.imagebase64;
                            }
                            //LMEPG.UI.showToast("机顶盒型号:"+boxModel);
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
         * 获取二维码
         *
         */
        getBoxQrCode: function (urlPrefix, Id, avatarUrl, carrierID) {
                var head = {
                    func: "getDoctorHeadImage",
                    carrierId: carrierID,
                    areaCode: "",
                };
                var json = {
                    doctorId: Id,
                    avatarUrl: avatarUrl
                };
                return urlPrefix + "?head=" + JSON.stringify(head) + "&json=" + JSON.stringify(json);
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
            var buttons = [
                {
                    id: 'write-btn',
                    type: 'img',
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/write_btn.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/write_btn_f.png',
                    // nextFocusLeft: 'introduce-btn',
                    nextFocusRight: 'introduce-btn',
                    click: Page.jumpPageInputDataPage
                },
                {
                    id: 'introduce-btn',
                    type: 'img',
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/introduce.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/introduce_f.png',
                    nextFocusLeft: 'write-btn',
                    click: Page.jumpPageIntroduce
                }
            ];
            console.log(!LMEPG.Func.isEmpty(RenderParam.focusId));
            LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'write-btn', buttons, '', true);
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
