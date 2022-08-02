var Personal = {

    buttons: [],

    init: function () {
        Personal.initButtons();
        Personal.initUI();

        window.onBack = Personal.goBack;
    },

    initButtons: function () {
        Personal.buttons.push({
            id: 'btn-toggle-order',
            name: '订购或退订',
            type: 'img',
            backgroundImage: RenderParam.imgPath + 'btn_toggle_order.gif',
            focusImage: RenderParam.imgPath + 'btn_toggle_order.gif',
            click: Personal.toggleOrder
        });
        LMEPG.ButtonManager.init('btn-toggle-order', Personal.buttons, '', true);
    },

    initUI: function(){
        if (RenderParam.isVip === '1'){
            G('role-text').innerHTML = 'VIP';
            LMEPG.CssManager.addClass('role-txt', 'vip-color');
        }else {
            G('role-text').innerHTML = '普通用户';
        }

        G('id-text').innerHTML = RenderParam.accountId;
    },

    goBack: function(){
        if (RenderParam.inner === '1'){
            // 返回应用首页
            LMEPG.Intent.back();
        }else {
            // 退出应用
            LMAndroid.JSCallAndroid.doExitApp();
        }
    },

    toggleOrder: function (btn) {
        if (RenderParam.isVip === '0'){
            Personal.orderVIP();
        }else {
            if (RenderParam.vipInfo.pay_type === '1'){// 支付方式 -- 话费
                if (RenderParam.vipInfo.auto_order === "1"){// 续包月
                    Personal.cancelVIP();
                }else {
                    //是vip,但是已经退订的
                    LMEPG.UI.commonDialog.show("您订购的VIP已经退订！", ["确定"], function (index) {});
                }
            }else {
                LMEPG.UI.showToast("该支付方式暂不支持退订！", 3);
            }
        }
    },

    cancelVIP: function() {
        LMEPG.UI.commonDialog.show("您已订购VIP，请勿重复订购！", ["退订VIP", "取消"], function (index) {
            if (index == 0) {
                //退订流程
                var postData = {};
                LMEPG.ajax.postAPI("Pay/cancelVIP", postData, function (data) {
                    LMEPG.Log.error("gansuyd---cancelVIP: " + data);
                    var resultDataJson = JSON.parse(data);
                    if (resultDataJson.result == 0) {
                        if (resultDataJson.result_code === "1000" || resultDataJson.result_code === 1000) {
                            //退订成功
                            RenderParam.vipInfo.auto_order = '0';
                            LMEPG.UI.showToast("退订成功:" + resultDataJson.result_desp);
                        } else {
                            //局方服务器返回的错误
                            LMEPG.UI.showToast("退订失败:" + resultDataJson.result_desp);
                        }
                    } else {
                        //我方服务返回的错误
                        LMEPG.UI.showToast("退订失败,result:" + resultDataJson.result);
                    }
                });
            }

        });
    },

    orderVIP: function () {
        var objCurrent = LMEPG.Intent.createIntent("personal");

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("remark", '个人中心订购');
        objOrderHome.setParam("singlePayItem", 1);

        LMEPG.Intent.jump(objOrderHome, objCurrent);
    }
};