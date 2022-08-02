var buttons = []

var u = RenderParam.info.replace(/&quot;/g,"\"")
u = JSON.parse(u)

var Home = {
    init:function (){
        this.renderOrder();
        this.initButtons();
    },

    renderOrder:function (){

        G('hospital-name').innerHTML = u.hospitalName;
        G('depName').innerHTML = u.depName;
        G('docName').innerHTML = u.doctorName;
        G('name').innerHTML = u.patient_name;
        G('card-num').innerHTML = u.patientid_card;
        G('tel').innerHTML = u.patient_mobile;
        G('time').innerHTML = u.time;
        G('state').innerHTML = u.order_state ==="0"?'已取消':'预约成功';

        G('cancel').innerHTML = u.order_state ==="0"?'已取消':'取消订单';
    },

    initButtons:function (){
        buttons.push({
            id: 'cancel',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown:u.order_state==="0"?"":'back',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:u.order_state==="0"?'':Home.cancel,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
        },{
            id: 'back',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: u.order_state==="0"?"":'cancel',
            nextFocusDown:'',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:function (){
                LMEPG.Intent.back()
            },
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
        },{
            id: 'dialog-sure',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'dialog-cancel',
            nextFocusUp: '',
            nextFocusDown:'',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:Home.sureCancel,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
        },{
            id: 'dialog-cancel',
            type: 'div',
            nextFocusLeft: 'dialog-sure',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown:'',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:Home.closeDialog,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
        })

        LMEPG.BM.init("back", buttons, "", true);
    },
    cancel:function (){
        if(u.order_state === "0")
            return

        G('dialog').style.display = 'block';
        LMEPG.BM.requestFocus('dialog-sure');
    },
    closeDialog:function (){
        G('dialog').style.display = 'none';
        LMEPG.BM.requestFocus('back');
    },
    sureCancel:function (){

        var data = {
            "functionid":"16020",
            "data":JSON.stringify({
                "OrderId":u.order_id,
                "Reserve":"",
                "Remark":""
            }),
        };


        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){

            if(res.result == 0 || res.result == 1000){
                G('cancel').innerHTML = '已取消';
                G('state').innerHTML = '预约取消';
                u.order_state = "0";

                LMEPG.UI.showToastV2(res.msg,5)
                G('dialog').style.display = 'none';
                LMEPG.BM.requestFocus('back');

            }else {
                LMEPG.UI.showToastV2(res.msg,5)
                G('dialog').style.display = 'none';
                LMEPG.BM.requestFocus('back');
            }

        },function (){

        });
    }
}

function onBack(){
    var v2 = G('id_toast_v_2');
    var dialog = G('dialog');

    if(dialog.style.display ==='block'){

        dialog.style.display = 'none'
        LMEPG.BM.requestFocus('back');
    }else if(v2 && v2.style.visibility === 'visible'){

        v2.style.visibility ='hidden';
    }else {

        LMEPG.Intent.back();
    }
}