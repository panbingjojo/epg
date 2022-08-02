var buttons = [];
var order_state = '0';
var Home = {
    init:function () {
        Home.renderInfo();
        Home.initButton();
        if (!RenderParam.isOrderList) {
            G('cancel').parentElement.removeChild(G('cancel'));
            G('back').style.left = '555px';
        }
    },

    renderInfo:function (){
        var info =LMEPG.Cookie.getCookie('userInfo')?JSON.parse(LMEPG.Cookie.getCookie('userInfo')):'';
        if (RenderParam.isOrderList==='1' && (info.patientid_card!==RenderParam.card)){
            Home.renderPeopleData('');
        }else {
            Home.renderPeopleData(info);
        }
        G('hospital_name').innerHTML='预约医院：西宁市中医院';
        G('doctor_name').innerHTML='预约医生：'+RenderParam.docName;
        G('dayTime').innerHTML='预约时间：'+RenderParam.dateTime+' '+RenderParam.startTime + '-' +RenderParam.endTime;
        G('dep_name').innerHTML='预约科室：'+RenderParam.depName;
        // 将医生专家号写入本地 从本地去读取
        RenderParam.title1==='02'?G('title1').style.display = 'block':'';
    },

    plusXing: function (str) {
        if (str) {
            var len = str.length -2 - 2;
            var xing = '';
            for (var i = 0; i < len; i++) {
                xing += '*';
            }
            return (str?str.substring(0, 2) + xing + str.substring(str.length - 2):'');
        }else {
            return '';
        }
    },


    renderPeopleData:function (info){
        var sex = (RenderParam.isOrderList==='1')?(RenderParam.sex===''?'男':'女')
            :pageFunc.getGender(info.sex);
        var html='<div class="line"></div>\n' +
            '     <div class="patient_name">就诊人：'+(RenderParam.name===''?info.patient_name:RenderParam.name)+'</div>\n' +
            '     <div class="gender">性别：'+(sex)+'</div>\n' +
            '     <div class="card_num">身份证号：'+(RenderParam.card===''?Home.plusXing(info.patientid_card):Home.plusXing(RenderParam.card))+'</div>\n' +
            '     <div class="phone_num">联系电话：'+(RenderParam.num===''?info.tel:RenderParam.num)+'</div>\n' +
            '     <div class="payment">支付方式：'+(RenderParam.payWay===''?'暂无方式':RenderParam.payWay)+'</div> \n' +
            '     <div class="money">支付金额：￥'+(RenderParam.payMoney===''?'暂无价格':RenderParam.payMoney)+'<span  id="money"></span></div> \n' +
            '     <div class="detail">支付订单：'+(RenderParam.payNum===''?'暂无订单号':RenderParam.payNum)+'</div> \n' +
            '     <div class="payTime">支付时间：'+(RenderParam.payTime===''?'暂无时间':RenderParam.payTime)+'</div>'

        G('information').innerHTML+=html;
        if (RenderParam.status==7) {
            G('cancel').parentElement.removeChild(G('cancel'));
            G('back').style.left = '555px';
            G('money').innerHTML = '已退款';
        }
    },

    initButton: function () {
        buttons.push({
            id: 'back',
            name: '返回',
            type: 'div',
            nextFocusRight: 'cancel',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            focusImage:g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            click:pageFunc.toBack,
            focusChange: pageFunc.chooseOrder,
        },{
            id: 'cancel',
            name: '取消订单',
            type: 'div',
            nextFocusLeft: 'back',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            focusImage:g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            click:pageFunc.publicWindow,
            focusChange: pageFunc.chooseOrder,
        },{
            id: 'common',
            name: '确定',
            type: 'div',
            nextFocusRight: 'cancel1',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            focusImage:g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            click:pageFunc.sureCancel,
            focusChange: pageFunc.chooseOrder,
        },{
            id: 'cancel1',
            name: '取消',
            type: 'div',
            nextFocusLeft: 'common',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            focusImage:g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            click:pageFunc.closeWindow,
            focusChange: pageFunc.chooseOrder,
        })

        LMEPG.BM.init('back', buttons, "", true);
    }

}

var pageFunc = {
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

    getGender:function (i){
        switch (i){
            case '0':
                return '男';
            case '1':
                return '女';
            default:
                return i;
        }
    },

    publicWindow: function () {
        G('window1').style.display = 'block';
        LMEPG.BM.requestFocus('common');
    },

    sureCancel: function() {
        LMEPG.UI.showWaitingDialog();
        var data = {
            'payStreamNo': RenderParam.payNum,
            'refundType': '2',
            'refundAmount' : (RenderParam.payMoney*100),
        }
        LMEPG.ajax.postAPI('AppointmentRegister/getRefund',data,function (res){
            if (res.result === 0) {
                pageFunc.getBackNum(function (res) {
                    if (res.result==0) {
                        G('cancel').parentElement.removeChild(G('cancel'));
                        G('back').style.left = '555px';
                        G('money').innerHTML = '已退款';
                        G('window1').style.display = 'none';
                        G('window2').style.display = 'block';
                        LMEPG.UI.dismissWaitingDialog();
                        setInterval(function () {
                            G('window2').style.display = 'none';
                            LMEPG.BM.requestFocus('back');
                        },2000)
                    }else {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast('挂号金额已退还！退号出错请联系管理员')
                    }
                })
            }else {
                LMEPG.UI.showToast('取消订单异常，请稍后重试！');
                G('window1').style.display = 'none';
                LMEPG.BM.requestFocus('back');
            }
        },function (){
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast('取消订单异常，请稍后重试！');
        });

    },
    /**
     * 调用退号接口
     * */
    getBackNum: function (success) {
        var data = {
            'money':RenderParam.payMoney,
            'id_apt':RenderParam.id_apt
        }
        LMEPG.ajax.postAPI('AppointmentRegister/getBackNum',data,function (res){
            success(res)
        },function (){
        });
    },

    closeWindow: function() {
        G('window1').style.display = 'none';
        LMEPG.BM.requestFocus('back');
    },

    toBack:function (){
        if  (RenderParam.isOrderList) {
            LMEPG.Intent.back();
        }else {
            var curPage = LMEPG.Intent.createIntent("qinghai-order-details");
            var toPage = LMEPG.Intent.createIntent("qinghai-index");

            LMEPG.Intent.jump(toPage,curPage,LMEPG.Intent.INTENT_FLAG_NOT_STACK);
        }
    },
}

//控制更多科室的关闭与开启
function onBack() {
    if  (RenderParam.isOrderList) {
        LMEPG.Intent.back();
    }else {
        var curPage = LMEPG.Intent.createIntent("qinghai-order-details");
        var toPage = LMEPG.Intent.createIntent("qinghai-index");

        LMEPG.Intent.jump(toPage,curPage,LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
}
