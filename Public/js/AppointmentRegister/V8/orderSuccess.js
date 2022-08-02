
var buttons = []

var Home = {
    init:function (){
        this.renderInfo()
        this.initButton()
    },
    renderInfo:function (){
        //var docInfo = JSON.parse(LMEPG.Cookie.getCookie('docInfo'))
        var user = JSON.parse((LMEPG.Cookie.getCookie('userInfo')))

        var data = {
            'type':'docInfo'
        };
        LMEPG.ajax.postAPI('Debug/getDocInfoSession',data,function (res){
            var docInfo = JSON.parse(decodeURIComponent(res.msg));
            G('hospital-name').innerHTML = docInfo.hospitalName
            G('depName').innerHTML = docInfo.depName
            G('name').innerHTML = docInfo.doctorName
            G('time').innerHTML = docInfo.time
            G('tel').innerHTML = user.tel
        });
    },

    initButton:function (){
        buttons.push({
            id: 'my-order',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown:'go-home',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:Home.goOrder,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
        },{
            id: 'go-home',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'my-order',
            nextFocusDown:'',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:Home.goHome,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
        })

        LMEPG.BM.init("go-home", buttons, "", true);
    },

    goHome:function (){
        var curPage = LMEPG.Intent.createIntent("xinjiang-order-success");
        var toPage = LMEPG.Intent.createIntent("xinjiang-reservation");

        LMEPG.Intent.jump(toPage,curPage,LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    goOrder:function (){
        var curPage = LMEPG.Intent.createIntent("xinjiang-order-success");
        var toPage = LMEPG.Intent.createIntent("xinjiang-order-list");

        LMEPG.Intent.jump(toPage,curPage);

    }
}

function onBack() {
    Home.goHome();
}