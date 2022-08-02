
var docInfo_v = '';//JSON.parse(LMEPG.Cookie.getCookie('docInfo'))
var userInfo_v = JSON.parse(LMEPG.Cookie.getCookie('userInfo'));
var order_v = '';//JSON.parse(LMEPG.Cookie.getCookie('order'))
var buttons = []

var data_v={
    FirstView:'0',
    PayType:'0',
    PatientMediCardFlag:'1'
}

var Home = {
    init:function (){
        var data = {
            'type':'docInfo'
        };
        LMEPG.ajax.postAPI('Debug/getDocInfoSession',data,function (res){
            docInfo_v =JSON.parse(decodeURIComponent(res.msg));
            data.type = 'order';
            LMEPG.ajax.postAPI('Debug/getDocInfoSession',data,function (res){
                order_v =JSON.parse(decodeURIComponent(res.msg));
                Home.renderBaseData();
                Home.initButton();
            });
        });
    },

    renderBaseData:function (){
        G('hospital-name').innerHTML = docInfo_v.hospitalName
        G('doc-name').innerHTML=docInfo_v.doctorName
        G('time').innerHTML=docInfo_v.time

        G('name').innerHTML = userInfo_v.patient_name
        G('gender').innerHTML = pageFunc.getGender(userInfo_v.sex)
        G('card-num').innerHTML = userInfo_v.patientid_card
    },


    initButton:function (){
        buttons.push({
            id: 'first-visit',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'second-visit',
            nextFocusUp: '',
            nextFocusDown:'up',
            backgroundImage: ' ',
            focusImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:pageFunc.chooseVisitState,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            typeState:'0'
        },{
            id: 'second-visit',
            type: 'div',
            nextFocusLeft: 'first-visit',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown:'up',
            backgroundImage: ' ',
            focusImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:pageFunc.chooseVisitState,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            typeState:'1'
        },{
            id: 'has-card',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'has-no-card',
            nextFocusUp: 'first-visit',
            nextFocusDown:'cash',
            backgroundImage: ' ',
            focusImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:pageFunc.chooseHasCard,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            typeState:'1'
        },{
            id: 'has-no-card',
            type: 'div',
            nextFocusLeft: 'has-card',
            nextFocusRight: 'visit-num',
            nextFocusUp: 'second-visit',
            nextFocusDown:'card',
            backgroundImage: ' ',
            focusImage:g_appRootPath+ '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:pageFunc.chooseHasCard,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            typeState:'2'
        },{
            id: 'visit-num',
            type: 'div',
            nextFocusLeft: 'has-no-card',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown:'medical-card-num',
            backgroundImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/bg-item.png',
            focusImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/has-choose-pro.png',
            click:'',
            focusChange: function (){
                LMEPG.UI.keyboard.show(100, 180, 'visit-num-input', '','cash')
            },
            beforeMoveChange: '',
            moveChange: '',
        },{
            id: 'cash',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'card',
            nextFocusUp: 'has-card',
            nextFocusDown:'up',
            backgroundImage: ' ',
            focusImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:pageFunc.choosePayWay,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            typeState:'0'
        },{
            id: 'card',
            type: 'div',
            nextFocusLeft: 'cash',
            nextFocusRight: 'medical-card-num',
            nextFocusUp: 'has-no-card',
            nextFocusDown:'up',
            backgroundImage: ' ',
            focusImage:g_appRootPath+ '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:pageFunc.choosePayWay,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            typeState:'1'
        },{
            id: 'medical-card-num',
            type: 'div',
            nextFocusLeft: 'card',
            nextFocusRight: '',
            nextFocusUp: 'visit-num',
            nextFocusDown:'up',
            backgroundImage:g_appRootPath+ '/Public/img/hd/AppointmentRegister/V8/bg-item.png',
            focusImage:g_appRootPath+ '/Public/img/hd/AppointmentRegister/V8/has-choose-pro.png',
            click:'',
            focusChange: function (){
                LMEPG.UI.keyboard.show(100, 295, 'medical-card-num-input', '','up')
            },
            beforeMoveChange: '',
            moveChange: '',
        },{
            id: 'up',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'first-visit',
            nextFocusDown:'',
            backgroundImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:pageFunc.upData,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
        })

        LMEPG.BM.init("first-visit", buttons, "", true);

    }
}

var pageFunc = {
    chooseVisitState:function (btn){
        data_v.FirstView=btn.typeState
        G('first-visit-img').src = btn.typeState === '0'?g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/iok.png':  g_appRootPath+ "/Public/img/hd/AppointmentRegister/V8/ino.png"
        G('second-visit-img').src = btn.typeState === '1'?g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/iok.png':  g_appRootPath+ "/Public/img/hd/AppointmentRegister/V8/ino.png"
    },

    choosePayWay:function (btn){
        data_v.PayType=btn.typeState
        G('cash-img').src = btn.typeState === '0'?g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/iok.png':  g_appRootPath+ "/Public/img/hd/AppointmentRegister/V8/ino.png"
        G('card-img').src = btn.typeState === '1'?g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/iok.png':  g_appRootPath+ "/Public/img/hd/AppointmentRegister/V8/ino.png"
    },

    chooseHasCard:function (btn){
        data_v.PatientMediCardFlag=btn.typeState
        G('has-card-img').src = btn.typeState === '1'?g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/iok.png':  g_appRootPath+ "/Public/img/hd/AppointmentRegister/V8/ino.png"
        G('has-no-card-img').src = btn.typeState === '2'?g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/iok.png':  g_appRootPath+ "/Public/img/hd/AppointmentRegister/V8/ino.png"
    },

    upData:function (){
        var data = {
            "functionid":"16010",
            "HospitalId":docInfo_v.HospitalId,
            "data":JSON.stringify({
                PatientId:userInfo_v.patient_id,
                NumId:order_v.NumId,
                ResTime:order_v.ResTime,
                PatientName:userInfo_v.patient_name,
                Brithday:userInfo_v.birth_day,
                Sex:userInfo_v.sex,
                PatientMobile:userInfo_v.tel,
                Addr:userInfo_v.addr,
                DocId:docInfo_v.DocId,
                DepId:docInfo_v.DepId,
                HospitalId:docInfo_v.HospitalId,
                OutcallDate:docInfo_v.OutcallDate,
                OutcallDaypart:docInfo_v.OutcallDaypart,
                FirstView: data_v.FirstView,
                ResNumber:order_v.ResNumber,
                PayType: '0',
                PayCardNbr:'',
                PatientMediCardFlag:'2',
                PatientMediCardNbr:''
            }),
        };

        //LMEPG.Cookie.setCookie('docInfo2',encodeURIComponent(LMEPG.Cookie.getCookie('docInfo')))

        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            console.log(res)
            if(res.result === '0'){
                var curPage = LMEPG.Intent.createIntent("xinjiang-final-add");
                var toPage = LMEPG.Intent.createIntent("xinjiang-order-success");

                LMEPG.Intent.jump(toPage,curPage);
            }else {
                LMEPG.UI.showToastV2(res.msg,2);
            }
        },function (){
            LMEPG.UI.showToast('出现未知错误，请稍后再试!',2)
        });
    },

    getGender:function (i){
        switch (i){
            case '0':
                return '男'
            case '1':
                return '女'
        }
    }

}