var buttons = []

var Home = {
    init:function (){
        this.renderInfo()
        this.initButton()
    },

    renderInfo:function (){
        //var info =JSON.parse(LMEPG.Cookie.getCookie('docInfo'))
        var data = {
            "type":"docInfo",
        };
        LMEPG.ajax.postAPI('Debug/getDocInfoSession',data,function (res){
            var info =JSON.parse(decodeURIComponent(res.msg));
            G('hospital-name').innerHTML=RenderParam.hospitalName || info.hospitalName
            G('name').innerHTML='专家：'+(RenderParam.docName || info.doctorName)
            G('time').innerText=RenderParam.docTime || info.time
        });
    },

    initButton:function (){
        var info =LMEPG.Cookie.getCookie('userInfo')

        if(info){
            this.renderPeopleData(JSON.parse(info))
        }else {
            G('add-area').style.display = 'block'
        }
        buttons.push({
            id: info?'exchange':'add',
            name: '添加就诊人',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown:'next',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:pageFunc.toChoosePeople,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            cIdx: ''
        },{
            id: 'next',
            name: '下一步',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: info?'exchange':'add',
            nextFocusDown:'next',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:pageFunc.toNext,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            cIdx: ''
        })

        LMEPG.BM.init(info?'exchange':'add', buttons, "", true);

    },

    renderPeopleData:function (info){
        var html='<div class="people-info">\n' +
            '         <div class="name">'+info.patient_name+'</div>\n' +
            '         <div class="gender">'+pageFunc.getGender(info.sex)+'</div>\n' +
            '         <div class="card-id">'+info.patientid_card+'</div>\n' +
            '     </div>\n' +
            '     <div class="exchange" id="exchange">换一个</div>'

        G('people-item').innerHTML=html
    }
}

var pageFunc = {
    toChoosePeople:function (){
        var curPage = LMEPG.Intent.createIntent("xinjiang-add-order");
        var toPage = LMEPG.Intent.createIntent("xinjiang-choose-people");

        LMEPG.Intent.jump(toPage,curPage);
    },

    toNext:function (){
        var info =LMEPG.Cookie.getCookie('userInfo')
        if(info){
            var curPage = LMEPG.Intent.createIntent("xinjiang-add-order");
            var toPage = LMEPG.Intent.createIntent("xinjiang-final-add");

            LMEPG.Intent.jump(toPage,curPage);
        }else {
            LMEPG.UI.showToast('请选择就诊人',2)
        }
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