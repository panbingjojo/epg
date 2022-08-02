
var Home ={
    init:function (){
        var that = this
        this.initButton()
        this.getQr()

       G('title-type').innerHTML =  RenderParam.editInfo? '编辑就诊人' : '新增就诊人'

        if(RenderParam.editInfo){
            var res = JSON.parse(RenderParam.editInfo.replace(/&quot;/g,"\""))
            G('name').innerHTML = res.patient_name
            G('card-num').innerHTML = res.patientid_card
            G('addr').innerHTML = res.addr
            G('phone').innerHTML = res.tel
            G('man').src =res.sex === "0"?g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/iok.png':g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/ino.png'
            G('woman').src =res.sex === "1"?g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/iok.png':g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/ino.png'

        }

        var c = setInterval(function (){
            that.getInfo(function (res){
                if (res){
                    console.log(res,999)
                    G('name').innerHTML = res.patient_name
                    G('card-num').innerHTML = res.patientid_card
                    G('addr').innerHTML = res.addr
                    G('phone').innerHTML = res.tel
                    G('man').src =res.sex === "0"?g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/iok.png':g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/ino.png'
                    G('woman').src =res.sex === "1"?g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/iok.png':g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/ino.png'
                    clearInterval(c)
                }
            })
        },1000)

    },
    initButton:function (){
      var btn =[]

      btn.push({
          id: 'back',
          type: 'div',
          backgroundImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/no_choose.png',
          focusImage:g_appRootPath+ '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
          click:function (){
              LMEPG.Intent.back()
          },
          focusChange: '',
          beforeMoveChange: '',
          moveChange: '',
          cIdx: ''
      })
        LMEPG.BM.init("back", btn, "", true);
    },
    getQr:function (){
        var data = {
            "functionid":"20003",
            "data":JSON.stringify({}),
        };
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            console.log(res)
            G('qr').src =res.file_url
            LMEPG.UI.dismissWaitingDialog()
        });
    },

    getInfo:function (success){
        var data = {
            "functionid":"20007",
            "data":JSON.stringify({}),
        };

        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            console.log(res,99)
            success(res.data)

        });
    }
}