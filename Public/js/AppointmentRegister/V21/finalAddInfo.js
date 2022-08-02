var buttons = [];
var payMethod = '';
var payData = [];
var payStatus = '';
var codeFailure = false;
var payMoney = '';
var payWay = '';
var chooseWay = '';
var isPaySuccess = false;
var payStreamNo = '';
var orderList='';
var Home = {
    init:function (){
        Home.getOrderList(function (res){
            orderList = res.length;
        });
        Home.renderBaseData();
        LMEPG.UI.showWaitingDialog();
        Home.initButton();
        Home.stopTimer();
    },

    stopTimer:function () {
        setTimeout(function () {
            clearInterval(payStatus);
            codeFailure = true;
        },180000)
    },
    getStartTime:function() {
        var date = new Date();
        var month = parseInt(date.getMonth() + 1);
        var year = date.getFullYear();
        var star_time = '';
        var cur_month = month < 10 ? '0' + month : month;
        star_time = year + '-' + cur_month + '-01';
        console.log(star_time);
        return star_time;
    },
    getEndTime:function () {
        var date = new Date();
        var year = date.getFullYear();
        var end_time = '';
        var next_month = '';
        if (date.getMonth() == 11) {
            end_time = Number(year) + 1 + '-01' + '-01';
        } else {
            next_month = parseInt(date.getMonth() + 2) < 10 ? '0' + parseInt(date.getMonth() + 2) : parseInt(date.getMonth() + 2);
            end_time = year + '-' + next_month + '-01';
        }
        console.log(end_time);
        return end_time;
    },
    /**
     * 获取订单列表信息
     * */
    getOrderList: function (success) {
        LMEPG.UI.showWaitingDialog()

        var data = {
            'patCode':RenderParam.patientId,
            'beginDate': Home.getStartTime(),
            'endDate': Home.getEndTime()
        };
        LMEPG.ajax.postAPI("AppointmentRegister/getOrderList", data, function (data){
            console.log(data.data,'订单列表信息')
            success(data)
        })
    },
    /**
     * 渲染预约医生数据
     * */
    renderBaseData:function (){
        G('hospital-name').innerHTML = '预约医院：'+RenderParam.hospitalName
        G('doctor-name').innerHTML='预约医生：'+RenderParam.docName
        G('dayTime').innerHTML='预约时间：'+RenderParam.dateTime+' '+RenderParam.startTime + '-' +RenderParam.endTime
        G('dep').innerHTML='预约科室：'+RenderParam.depName
        RenderParam.title1==='02'?G('title1').style.display = 'block':''
    },

    /**
     * 支付状态定时刷新
     * */
    getPayStatus: function () {
        payStatus = setInterval(function() {
            Home.getPaymentStatus(function (res) {
                if (res.data) {
                    if (res.data.transStatus == 1) {
                        payStreamNo = res.data.payStreamNo
                        // 直接跳转订单详情页面
                        clearInterval(payStatus);
                        isPaySuccess = true;
                        pageFunc.getSuccess();
                    }else if(res.data.transStatus == 0 || res.data.transStatus == -2) {
                        clearInterval(payStatus);
                        codeFailure = true;
                    }
                }
            })
        },3000)
    },

    /**
     * 渲染支付二维码
     * */
    renderPaymentCode:function (res) {
        if (res.result == '-1004'){
            LMEPG.UI.showToast('同一时段只能挂一个号！')
            setTimeout(function () {
                LMEPG.UI.showToast('3秒后将自动返回首页！')
                LMEPG.UI.showWaitingDialog();
                setTimeout(function (){
                    var toPage = LMEPG.Intent.createIntent("qinghai-index");

                    LMEPG.Intent.jump(toPage,LMEPG.Intent.INTENT_FLAG_NOT_STACK);
                },3000)
            },2000)
        }else {
            orderStreamNo = res.data.orderStreamNo;
            payMoney = res.data.price/100;
            G('money').innerHTML = '￥' + payMoney;
            var imgArea = G('qr_code');
            var str = '<img src="'+res.data.qrCode+'" style="width: 200px;height: 200px;border-radius: 10px;"/>';
            imgArea.innerHTML+=str;
            Home.getPayStatus();
            LMEPG.UI.dismissWaitingDialog();
        }
    },

    /**
     * 获取支付二维码
     * */
    getMethodPayment: function (pay,success) {
        var patientId = RenderParam.patientId;
        var cost = RenderParam.cost;
        var date = new Date();
        date.setDate(date.getDate());
        var today = date.format("yyyy-MM-dd");
        var type;
        if (RenderParam.dateTime == today){
            type = '0';
        }else {
            type = '1';
        }
        var payType = '';
        if (payWay == '微信') {
            payType = '2';
        }else if (payWay == '支付宝'){
            payType = '1';
        }
        var patient = RenderParam.patient;
        var price = RenderParam.cost*100;
        var data = {
            'payMethod':pay,
            'name': patient,
            'price': price,
            'id_sch': RenderParam.id_sch,
            'tickNo':RenderParam.tickId,
            'patientId':patientId,
            'deptCode':RenderParam.depCode,
            'doctorCode':RenderParam.docNum,
            'cost': cost,
            'date': RenderParam.dateTime,
            'type': type,
            'payWay': payType,
        }
        LMEPG.ajax.postAPI('AppointmentRegister/getMethodPayment',data,function (res){
            success(res);
            console.log(res,'支付方式二维码')
        },function (){
        });
    },

    /**
     * 获取支付状态
     * */
    getPaymentStatus: function (success) {
        var data = {
            'orderStreamNo': orderStreamNo
        }
        LMEPG.ajax.postAPI('AppointmentRegister/getPaymentStatus',data,function (res){
            console.log(res.data,'支付状态')
            success(res);
        },function (){
        });
    },

    initButton:function (){
        buttons.push({
            id: 'weixin_btn',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'zhifubao_btn',
            nextFocusUp: '',
            nextFocusDown:'common',
            backgroundImage: '',
            focusImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V21/yellow_btn.png',
            beforeMoveChange: pageFunc.choosePayment,
            focusChange: pageFunc.chooseImg,
            moveChange: '',
            typeState:'0',
            chooseWay: 'wx'
        },{
            id: 'zhifubao_btn',
            type: 'div',
            nextFocusLeft: 'weixin_btn',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown:'common',
            backgroundImage: '',
            focusImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V21/yellow_btn.png',
            focusChange: pageFunc.chooseImg,
            beforeMoveChange: pageFunc.choosePayment,
            moveChange: '',
            typeState:'1',
            chooseWay: 'zfb'
        },{
            id: 'common',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown:'',
            backgroundImage: '',
            focusImage: '',
            click:pageFunc.getSuccess,
            focusChange: pageFunc.chooseOrder1,
            beforeMoveChange: pageFunc.chooseWays,
            moveChange: '',
        },{
            id:'window1'
        },{
            id:'common1',
            name: '确定',
            type: 'div',
            nextFocusRight: 'cancel1',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            focusImage:g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            click:pageFunc.isBack,
            focusChange: pageFunc.chooseOrder,
        },{
            id: 'cancel1',
            name: '取消',
            type: 'div',
            nextFocusLeft: 'common1',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            focusImage:g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            click:pageFunc.closeWindow,
            focusChange: pageFunc.chooseOrder,
        })

        LMEPG.BM.init("weixin_btn", buttons, "", true);
    }
}

var pageFunc = {
    chooseOrder1:function (btn, hasFocus) {
        var order_focus = G(btn.id)
        if (hasFocus) {
            order_focus.style.backgroundColor = '#17a1e5';
            order_focus.style.color = '#fff'
        }else {
            order_focus.style.backgroundColor = '';
            order_focus.style.color = '#FFF'
        }
    },
    closeWindow: function() {
        G('isBack').style.display = 'none';
        LMEPG.BM.requestFocus('common');
    },
    chooseOrder:function (btn, hasFocus) {
        var order_focus = G(btn.id)
        if (hasFocus) {
            order_focus.style.backgroundColor = '#17a1e5';
            order_focus.style.color = '#fff';
        }else {
            order_focus.style.backgroundColor = '';
            order_focus.style.color = '#FFF';
        }
    },
    chooseImg:function (btn, hashFocus) {
        clearInterval(payStatus)
        if (hashFocus) {
            LMEPG.UI.showWaitingDialog();
            G('qr_code').innerHTML = '';
            switch (btn.typeState){
                case "0":
                    payWay = '微信';
                    Home.getMethodPayment('03',function (res) {
                        Home.renderPaymentCode(res);
                    });
                    break;
                case "1":
                    payWay = '支付宝';
                    Home.getMethodPayment('02',function (res) {
                        Home.renderPaymentCode(res);
                    });
                    break;
            }
        }
    },
    choosePayment: function (dir , btn) {
        if (dir === 'down') {
            chooseWay = btn.chooseWay;
            console.log(chooseWay)
            setTimeout(function () {
                LMEPG.CssManager.addClass(btn.id, "test-tab-f");
            })
        }else if (dir === 'right' || (dir === 'left'&&btn.id !== 'weixin_btn')) {
            G(btn.id).style.cssText = '';
            LMEPG.CssManager.removeClass(btn.id, "test-tab-f");
        }
    },
    chooseWays: function (dir) {
        if (dir === 'up') {
            LMEPG.BM.requestFocus(chooseWay==='wx'?'weixin_btn':'zhifubao_btn');
        }
    },
    getCurrentTime: function () {
        var date =  new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return year + "-" + (month<10?"0"+month:month) + "-" + (day<10?'0'+day:day) + "" + "\t" + (hours<10?'0'+hours:hours) + ":" + (minutes<10?'0'+minutes:minutes) + ":" + (seconds<10?'0'+seconds:seconds);
    },

    getSuccess:function () {
        if (isPaySuccess) {
            LMEPG.UI.showWaitingDialog();
            pageFunc.getSaveRegistered(function (res) {
                if (res.result==0) {
                    if  (G('isBack').style.display === 'block') {
                        G('isBack').style.display = 'none';
                        LMEPG.BM.requestFocus('common');
                    }
                    G('window1').style.display = 'block'
                    LMEPG.BM.requestFocus('window1')
                    setTimeout(function () {
                        var toPage = LMEPG.Intent.createIntent("qinghai-order-details");

                        toPage.setParam('doctorName',RenderParam.docName);
                        toPage.setParam('hospitalName',RenderParam.hospitalName);
                        toPage.setParam('dateTime',RenderParam.dateTime);
                        toPage.setParam('depName',RenderParam.depName);
                        toPage.setParam('startTime',RenderParam.startTime);
                        toPage.setParam('endTime',RenderParam.endTime);
                        toPage.setParam('payNum',payStreamNo);
                        toPage.setParam('payTime',pageFunc.getCurrentTime());
                        toPage.setParam('payMoney',payMoney);
                        toPage.setParam('payWay',payWay);
                        LMEPG.Intent.jump(toPage);
                    },2000);
                }else {
                    Home.getOrderList(function (res) {
                        if (res.length>orderList) {
                            if  (G('isBack').style.display === 'block') {
                                G('isBack').style.display = 'none';
                                LMEPG.BM.requestFocus('common');
                            }
                            G('window1').style.display = 'block'
                            LMEPG.BM.requestFocus('window1')
                            setTimeout(function () {
                                var toPage = LMEPG.Intent.createIntent("qinghai-order-details");

                                toPage.setParam('doctorName',RenderParam.docName);
                                toPage.setParam('hospitalName',RenderParam.hospitalName);
                                toPage.setParam('dateTime',RenderParam.dateTime);
                                toPage.setParam('depName',RenderParam.depName);
                                toPage.setParam('startTime',RenderParam.startTime);
                                toPage.setParam('endTime',RenderParam.endTime);
                                toPage.setParam('payNum',payStreamNo);
                                toPage.setParam('payTime',pageFunc.getCurrentTime());
                                toPage.setParam('payMoney',payMoney);
                                toPage.setParam('payWay',payWay);
                                LMEPG.Intent.jump(toPage);
                            },2000);
                        }else {
                            pageFunc.getRefund(function (res) {
                                if (res.result==0) {
                                    LMEPG.UI.showToast('挂号失败，支付金额已退还！');
                                    setTimeout(function (){
                                        LMEPG.UI.showToast('3秒后将自动返回首页！');
                                        LMEPG.UI.showWaitingDialog();
                                        setTimeout(function (){
                                            var toPage = LMEPG.Intent.createIntent("qinghai-index");

                                            LMEPG.Intent.jump(toPage,LMEPG.Intent.INTENT_FLAG_NOT_STACK);
                                        },2000)
                                    },1000);

                                }else {
                                    LMEPG.UI.showToast('挂号出错，请联系管理人员退款！');
                                }
                            })
                        }
                    })
                }
            })
        }else if (codeFailure){
            LMEPG.UI.showToast('当前二维码已失效，请退出重试！')
        }else {
            LMEPG.UI.showToast(' 请完成当前支付或退出挂号！')
        }
    },

    /**
     * 如果未能进行数据上报将进行退款操作
     * */
    getRefund:function (success) {
        var cost = RenderParam.cost*100;
        var data = {
            'payStreamNo': payStreamNo,
            'refundType': '2',
            'refundAmount' : cost,
        }
        console.log(data,'data')
        LMEPG.ajax.postAPI('AppointmentRegister/getRefund',data,function (res){
            success(res)
        },function (){
            LMEPG.UI.showToast('取消订单异常，请稍后重试！');
        });
    },
    /**
     * 进行数据上报
     * */
    getSaveRegistered:function (success) {
        var patientId = RenderParam.patientId;
        var cost = RenderParam.cost;
        var date = new Date();
        date.setDate(date.getDate());
        var today = date.format("yyyy-MM-dd");
        var type;
        if (RenderParam.dateTime == today){
            type = '0';
        }else {
            type = '1';
        }
        var pay = '';
        if (payWay == '微信') {
            pay = '2';
        }else if (payWay == '支付宝'){
            pay = '1';
        }
        var data = {
            'patientId':patientId,
            'deptCode':RenderParam.depCode,
            'doctorCode':RenderParam.docNum,
            'cost': cost,
            'date': RenderParam.dateTime,
            'type': type,
            'payWay': pay,
            'bankNumber': '',
            'bankTradeNo': '',
            'bankTradeDate': '',
            'bankTradeTime': '',
            'orderNo':payStreamNo,
            'id_sch':RenderParam.id_sch,
            'tickNo':RenderParam.tickId,
            'patCardNo': '',
            'patHpTp' : '',
            'hpPriceData': '',
            'patHpNo': '',
            'hpPatInfXml': '',
        }
        LMEPG.ajax.postAPI('AppointmentRegister/getSaveRegistered',data,function (res){
            success(res);
            console.log(res,'保存挂号')
        },function (){
        });
    },
    isBack:function () {
        LMEPG.Intent.back();
    }
}
//控制更多科室的关闭与开启
function onBack() {
    if  (G('isBack').style.display === 'block') {
        G('isBack').style.display = 'none';
        LMEPG.BM.requestFocus('common');
    }else if (G('isBack').style.display === 'none') {
        G('isBack').style.display = 'block';
        LMEPG.BM.requestFocus('common1');
    }
}