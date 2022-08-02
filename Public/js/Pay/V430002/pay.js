


var Controller = {

    /**
     * 初始化
     */
    init:function () {
        var that = this;
        if (that.checkOrderItems()) {
            LMEPG.UI.showToast("没有套餐", 100);
            onBackDelay();
            return;
        }
        Model.initButtons();
        if(RenderParam.lmp == '15' /*|| Controller.isDuringDate("2021-12-09","2021-12-31")*/){
            Model.insertButtons();
            LMEPG.BM.init('order_item_3', Model.buttons, '', true);
        }else if(RenderParam.lmp == '16' && getQueryVariable("mark") == "1"){
            Model.insertButtonsGarden();
            LMEPG.BM.init('order_item_3', Model.buttons, '', true);
        }else{
            LMEPG.BM.init('order_item_1', Model.buttons, '', true);
        }
    },

    //比较当前时间是否在指定日期范围内
    isDuringDate:function(beginDateStr, endDateStr){
        var curDate = new Date();
        var beginDate = new Date(beginDateStr);
        var endDate = new Date(endDateStr);
        if (curDate >= beginDate && curDate <= endDate) {
            return true;
        }
        return false;
    },

    //检查管理后台是否配置了产品
    checkOrderItems:function(){
        return LMEPG.Func.isEmpty(RenderParam.orderItems)
    },

    onClickListener:function (btn) {
        var that = Controller;
        that.order(btn);
    },

    //订购
    order:function (btn) {
        var that = this;
        var index = btn.cIndex;
        var payInfo = {
            "vip_id": RenderParam.orderItems[index].vip_id,
            "vip_type": RenderParam.orderItems[index].vip_type,
            "price": RenderParam.orderItems[index].price,
            "userId": RenderParam.accountId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
        };
        LMEPG.UI.showWaitingDialog();
        //buildPayInfo
        LMEPG.ajax.postAPI("Pay/buildPayUrl",  payInfo, function (data) {
            Model.payInfo = data.payInfo;
            LMEPG.Log.info("res = "+JSON.stringify(data))
            console.log(data);
            if (data.result == 0) {
                that.toPay(data.payInfo.payInfo);
            } else {
                LMEPG.UI.dismissWaitingDialog();
                //获取订购参数失败
                if (LMEPG.func.isExist(data.message)) {
                    LMEPG.ui.showToast(data.message, 3);
                } else {
                    LMEPG.ui.showToast("获取订购参数失败!", 3);
                }
                onBackDelay();
            }
        }, function () {
            LMEPG.ui.showToast("请求异常，请稍后重试！", 3);
        });
    },

    toPay: function (payInfo) {
        if (LMEPG.Func.isExist(payInfo)) {
            LMEPG.Log.info("doPay params = "+JSON.stringify(payInfo))
            LMAndroid.JSCallAndroid.doPay(JSON.stringify(payInfo), function (param, notifyAndroidCallback) {
                param = param instanceof Object ? param : JSON.parse(param);
            //     param = {transactionID:"spa0011120210402164710HNDX39JK1617353230",result:'9681',description:"success"};
                LMEPG.Log.info("doPay result = "+JSON.stringify(param))
                if ((param.result === '0' && param.description==='success')
                    || param.result === '9304') {// 0标识订购成功 9304已经订购过
                    LMEPG.ajax.postAPI("Pay/uploadPayResult", Model.payInfo, function (rsp) {
                        LMEPG.Log.info("doPay uploadPayResult result = "+JSON.stringify(rsp))
                        LMEPG.UI.dismissWaitingDialog();
                        // LMEPG.Intent.back();
                        if (rsp.result == '0') {
                            // 测试弹窗显示效果
                            LMEPG.ui.showToastCustom({
                                content: "订购成功!",
                                showStyle: "toast_style_v1",
                                textStyle: "toast_text_v1",
                                bgImage: "bg_toast_v1.png",
                                showTime: 1
                            }, function () {
                                if(RenderParam.lmp == '16' && getQueryVariable("mark") == "1"){
                                    //LMAndroid.JSCallAndroid.doExitApp();

                                    var param = '{\"appId\":\"1747030842\",\"outDown\":\"1\",\"jumpUrl\":\"http://10.255.25.161:8085/activity/tianyiGarden/index.html?isNotResumeKeyOut=guhjkl\",\"flag\":\"zj_yyh\"}';
                                    LMAndroid.JSCallAndroid.quitPay(param, function (resParam, notifyAndroidCallback) {});
                                    LMAndroid.JSCallAndroid.doExitApp();
                                }else{
                                    LMEPG.Intent.back();
                                }
                            });
                        } else {
                            LMEPG.UI.showToast("上传订购结果失败", 3,function () {
                                LMEPG.Intent.back();
                            });
                        }
                    })
                }else {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.ui.showToastCustom({
                        content: "订购失败，请稍后重试！",
                        showStyle: "toast_style_v2",
                        textStyle: "toast_text_v2",
                        bgImage: "bg_toast_v2.png",
                        showTime:1
                    }, function () {
                        LMEPG.Intent.back();
                    });
                }
            });
        } else {
            LMEPG.UI.showToast("没有获取到订购信息");
            onBackDelay();
        }
    },

}


var Model = {
    buttons:[],
    payInfo:null,
    initButtons: function () {
        Model.buttons.push({
            id: 'order_item_1',
            name: '包月',
            type: 'img',
            nextFocusRight: 'order_item_2',
            backgroundImage: RenderParam.imagePath + 'order_item_1.png',
            focusImage: RenderParam.imagePath + 'order_item_1_f.png',
            click: Controller.onClickListener,
            cIndex: 0
        }, {
            id: 'order_item_2',
            name: '包年',
            type: 'img',
            nextFocusLeft: 'order_item_1',
            backgroundImage: RenderParam.imagePath + 'order_item_2.png',
            focusImage: RenderParam.imagePath + 'order_item_2_f.png',
            click: Controller.onClickListener,
            cIndex: 1
        });
    },

    insertButtons:function(){
        Model.buttons.push ({
            id: 'order_item_3',
            name: '0元包月',
            type: 'img',
            backgroundImage: RenderParam.imagePath + 'order_item_3.png',
            focusImage: RenderParam.imagePath + 'order_item_3_f.png',
            click: Controller.onClickListener,
            cIndex: 2
        });
        var bgAddr = RenderParam.imagePath + 'bg_order_zero.png';
        G('body').style.background = 'url("'+bgAddr+'") no-repeat';
        G('order_item_1').style.display = 'none';
        G('order_item_2').style.display = 'none';
        G('order_item_3').style.display = 'block';
        var bg = document.getElementsByClassName('order_item_container');
        bg[0].style.left = '537px';
    },
    insertButtonsGarden:function(){
        Model.buttons.push ({
            id: 'order_item_3',
            name: '696元两年',
            type: 'img',
            click: Controller.onClickListener,
            cIndex: 3
        });
        var bgAddr = RenderParam.imagePath + 'bg_order_garden.png';
        G('body').style.background = 'url("'+bgAddr+'") no-repeat';
        G('order_item_1').style.display = 'none';
        G('order_item_2').style.display = 'none';
        var bg = document.getElementsByClassName('order_item_container');
    },
}

/**
 * 返回处理
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 返回（延时）
 */
function onBackDelay() {
    setTimeout(function () {
        onBack();
    }, 3000);
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}