var buttons = [];
var info = '';
var patient = '';
var Home = {
    init:function (){
        Home.renderInfo();
        var date = new Date();
        date.setDate(date.getDate());
        var today = date.format("yyyy-MM-dd");
        console.log(today);
        Home.getPeopleList(function (res) {
            for (var j = 0;j<res.length;j++) {
                if (res[j].is_del==='1') {
                    res.splice(j,1);
                    j--;
                }
            }
            Home.initButton(res);
        });
    },
    /**
     * 获取所有就诊人信息
     * */
    getPeopleList:function (success){
        LMEPG.UI.showWaitingDialog()

        var json = {
            "functionid":"20000",
            "data":JSON.stringify({}),
        };
        LMEPG.ajax.postAPI("Expert/appointmentInterface", json, function (data){
            console.log(data);
            LMEPG.UI.dismissWaitingDialog();
            if(data.data.length !==0){
                success(data.data[0]);
            }else {
                success([]);
            }
        })
    },

    renderInfo:function (){
        G('hospital-name').innerHTML='预约医院：'+RenderParam.hospitalName
        G('name').innerHTML='预约医生：'+RenderParam.docName
        G('time').innerHTML='预约时间：'+RenderParam.dateTime+' '+RenderParam.startTime + '-' +RenderParam.endTime
        G('department').innerHTML='预约科室：'+RenderParam.depName
        RenderParam.title1==='02'?G('title1').style.display = 'block':''
    },
    isCookie: function (res) {
        var info = LMEPG.Cookie.getCookie('userInfo')?JSON.parse(LMEPG.Cookie.getCookie('userInfo')):'';

        for (var i = 0;i<res.length;i++) {
            console.log(res[i])
            if (res[i].patientid_card === info.patientid_card){
                return info;
            }
        }
        return '';
    },

    initButton:function (res){
        G('info_p').style.display = 'none';
        var info = Home.isCookie(res);
        if(info) {
            G('info_p').style.display = 'block'
            G('next').style.display = 'block'
            Home.renderPeopleData(info)
        }else {
            G('add-area').style.display = 'block'
            G('people-item').style.display = 'none'
        }
        buttons.push({
            id: info?'exchange':'add',
            name: '选择就诊人',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown:info?'next':'',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            focusImage:g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            click:pageFunc.toChoosePeople,
            focusChange: pageFunc.chooseOrder1,
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
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            click:pageFunc.toNext,
            focusChange: pageFunc.chooseOrder1,
            beforeMoveChange: '',
            moveChange: '',
            cIdx: ''
        })

        LMEPG.BM.init(info?'exchange':'add', buttons, "", true);
    },

    plusXing: function (str) {

        var len = str.length -2 - 2;

        var xing = '';

        for (var i = 0; i < len; i++) {

            xing += '*';

        }

        return (str?str.substring(0, 2) + xing + str.substring(str.length - 2):'');

    },

    renderPeopleData:function (info){
        patient = info.patient_name;
        console.log(info)
        var html=
            '     <div class="name">'+info.patient_name+'</div>\n' +
            '     <div class="gender">'+pageFunc.getGender(info.sex)+'</div>\n' +
            '     <div class="card-id">'+Home.plusXing(info.patientid_card)+'</div>\n' +
            '     <div class="exchange" id="exchange">换一个</div>'

        G('people-item').innerHTML=html
    }
}

var pageFunc = {
    toChoosePeople:function (){
        var curPage = LMEPG.Intent.createIntent("qinghai-add-order");
        var toPage = LMEPG.Intent.createIntent("qinghai-choose-people");
        curPage.setParam('DoctorName',RenderParam.docName);
        curPage.setParam('HospitalName',RenderParam.hospitalName);
        curPage.setParam('DateTime',RenderParam.dateTime);
        curPage.setParam('DepName',RenderParam.depName);
        curPage.setParam('StartTime',RenderParam.startTime);
        curPage.setParam('EndTime',RenderParam.endTime);
        curPage.setParam('title1',RenderParam.title1);
        curPage.setParam('cost',RenderParam.cost);
        curPage.setParam('depCode',RenderParam.depCode);
        curPage.setParam('docNum',RenderParam.docNum);
        curPage.setParam('id_sch',RenderParam.id_sch);
        curPage.setParam('tickId',RenderParam.tickId);
        LMEPG.Intent.jump(toPage,curPage);
    },

    toNext:function (){
        var info =JSON.parse(LMEPG.Cookie.getCookie('userInfo'))
        console.log(info)
        if(info){
            var curPage = LMEPG.Intent.createIntent("qinghai-add-order");
            var toPage = LMEPG.Intent.createIntent("qinghai-final-add");
            curPage.setParam('DoctorName',RenderParam.docName);
            curPage.setParam('HospitalName',RenderParam.hospitalName);
            curPage.setParam('DateTime',RenderParam.dateTime);
            curPage.setParam('DepName',RenderParam.depName);
            curPage.setParam('StartTime',RenderParam.startTime);
            curPage.setParam('EndTime',RenderParam.endTime);
            curPage.setParam('title1',RenderParam.title1);
            curPage.setParam('cost',RenderParam.cost);
            curPage.setParam('id_sch',RenderParam.id_sch);
            curPage.setParam('tickId',RenderParam.tickId);
            curPage.setParam('depCode',RenderParam.depCode);
            curPage.setParam('docNum',RenderParam.docNum);

            toPage.setParam('DoctorName',RenderParam.docName);
            toPage.setParam('HospitalName',RenderParam.hospitalName);
            toPage.setParam('DateTime',RenderParam.dateTime);
            toPage.setParam('DepName',RenderParam.depName);
            toPage.setParam('StartTime',RenderParam.startTime);
            toPage.setParam('EndTime',RenderParam.endTime);
            toPage.setParam('title1',RenderParam.title1);
            toPage.setParam('patient',patient);
            toPage.setParam('cost',RenderParam.cost);
            toPage.setParam('id_sch',RenderParam.id_sch);
            toPage.setParam('tickId',RenderParam.tickId);
            toPage.setParam('patientId',info.patient_id);
            toPage.setParam('depCode',RenderParam.depCode);
            toPage.setParam('docNum',RenderParam.docNum);

            LMEPG.Intent.jump(toPage,curPage);
        }else {
            LMEPG.UI.showToast('请选择就诊人',2);
        }
    },
    getGender:function (i){
        switch (i){
            case '0':
                return '男'
            case '1':
                return '女'
        }
    },
    chooseOrder1:function (btn, hasFocus) {
        var order_focus = G(btn.id)
        if (hasFocus) {
            order_focus.style.backgroundColor = '#17a1e5';
            order_focus.style.color = '#fff'
        }else {
            order_focus.style.backgroundColor = '';
            order_focus.style.color = '#FFF'
        }

    }
}