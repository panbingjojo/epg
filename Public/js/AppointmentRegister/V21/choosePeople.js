var buttons = []
var len = 0
var Home = {
    init: function() {
        pageFunc.getPeopleList(function (res) {
            Home.renderList(res);
        })
    },

    plusXing: function (str) {

        var len = str.length -2 - 2;
        var xing = '';
        for (var i = 0; i < len; i++) {
            xing += '*';
        }
        return (str?str.substring(0, 2) + xing + str.substring(str.length - 2):'');
    },

    renderList:function (res){
        var html=''
        for (var j = 0;j<res.length;j++) {
            if (res[j].is_del==='1') {
                res.splice(j,1);
                j--;
            }
        }
        if(res.length === 0){
            G('add').style.display = 'none'
            G('add2').style.display='block'
            G('top_row').style.display = 'none'
            buttons.push({
                id: 'add-btn',
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                click: pageFunc.addInfo,
                focusChange:pageFunc.chooseOrder,
                beforeMoveChange: '',
                moveChange: '',
            },{
                id:'window2',
            })
            LMEPG.BM.init('add-btn',buttons,'',true);
        }else {
            // 如果is_del存在就不显示
            G('add').style.display = 'block';
            G('top_row').style.display = 'block';
            for (var i =0;i<res.length;i++){
                html+='<div class="people-item">\n' +
                    '      <div class="'+(RenderParam.isManage === '0'?'info':'info2')+'">\n' +
                    '          <div class="'+(RenderParam.isManage === '0'?'name':'name2')+'">'+res[i].patient_name+'</div>\n' +
                    '           <div class="gender">'+Util.getGender(res[i].sex)+'</div>\n' +
                    '           <div class="'+(RenderParam.isManage === '0'?'card-num':'card-num2')+'">'+Home.plusXing(res[i].patientid_card)+'</div>\n' +
                    '       </div>'

                if( RenderParam.isManage ==='1'){
                    html +=   ' <div class="func-btn" id="edit-'+i+'">编辑</div>\n' +
                        '<div class="func-btn" id="del-'+i+'">删除</div>\n' +
                        ' </div>'

                    buttons.push({
                        id: 'edit-'+i,
                        type: 'div',
                        nextFocusLeft: '',
                        nextFocusRight: 'del-'+i,
                        nextFocusUp: i===0?'':'edit-'+(i-1),
                        nextFocusDown: i===res.length-1?'add':'edit-'+(i+1),
                        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                        click: pageFunc.addInfo,
                        focusChange:pageFunc.chooseOrder,
                        beforeMoveChange: '',
                        moveChange: pageFunc.turnPage,
                        info:JSON.stringify(res[i]),
                        backIndex:i
                    },{
                        id: 'del-'+i,
                        type: 'div',
                        nextFocusLeft: 'edit-'+i,
                        nextFocusRight: '',
                        nextFocusUp: i===0?'':'del-'+(i-1),
                        nextFocusDown: i===res.length-1?'add':'del-'+(i+1),
                        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                        click: pageFunc.delInfo,
                        moveChange: pageFunc.turnPage,
                        focusChange:pageFunc.chooseOrder,
                        info:JSON.stringify(res[i]),
                        backIndex:i,
                        patientidCard:res[i].patientid_card,
                    })

                }else {
                    html += '  <div class="func-btn" id="choose-'+i+'">选择</div>\n' +
                        '      <div class="func-btn" id="edit-'+i+'">编辑</div>\n' +
                        '  </div>'

                    buttons.push({
                        id: 'choose-'+i,
                        type: 'div',
                        nextFocusLeft: '',
                        nextFocusRight: 'edit-'+i,
                        nextFocusUp: i===0?'':'choose-'+(i-1),
                        nextFocusDown: i===res.length-1?'add':'choose-'+(i+1),
                        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                        click: pageFunc.choosePeople,
                        focusChange:pageFunc.chooseOrder,
                        beforeMoveChange: '',
                        moveChange: pageFunc.turnPage,
                        info:JSON.stringify(res[i]),
                        backIndex:i
                    },{
                        id: 'edit-'+i,
                        type: 'div',
                        nextFocusLeft: 'choose-'+i,
                        nextFocusRight: '',
                        nextFocusUp: i===0?'':'edit-'+(i-1),
                        nextFocusDown: i===res.length-1?'add':'edit-'+(i+1),
                        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                        click: pageFunc.addInfo,
                        focusChange:pageFunc.chooseOrder,
                        beforeMoveChange: '',
                        moveChange: pageFunc.turnPage,
                        info:JSON.stringify(res[i]),
                        backIndex:i
                    })
                }
            }
        buttons.push({
            id: 'add',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: RenderParam.isManage === '1'? 'edit-'+(res.length-1) : 'choose-'+(res.length-1),
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
            click: pageFunc.addInfo,
            focusChange:pageFunc.chooseOrder,
            beforeMoveChange: '',
            moveChange: ''
        })

        G('add').style.display='block';
        G('list').innerHTML=html;

        var scrollIndex = RenderParam.backIndex<5?0:parseInt(RenderParam.backIndex / 5);
        G('list').scrollTop = 320*scrollIndex;
        var result = RenderParam.isAdd?'add':RenderParam.isManage === '1'?'edit-'+RenderParam.backIndex:'choose-'+RenderParam.backIndex;

        LMEPG.BM.init(result,buttons,'',true);
    }
    }
}

var pageFunc = {
    getCurrentPage:function (){
        return LMEPG.Intent.createIntent("qinghai-choose-people");
    },

    getQr:function (){
        var data = {
            "functionid":"20003",
            "data":JSON.stringify({}),
        };
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            console.log(res);
            G('window2').src =res.file_url;
            LMEPG.UI.dismissWaitingDialog();
        });
    },
    getPeopleList:function (success){
        LMEPG.UI.showWaitingDialog()

        var json = {
            "functionid":"20000",
            "data":JSON.stringify({}),
        };

        LMEPG.ajax.postAPI("Expert/appointmentInterface", json, function (data){
            console.log(data,'data');
            LMEPG.UI.dismissWaitingDialog();
            if(data.data.length !==0){
                success(data.data[0]);
            }else {
                success([]);
            }
        })
    },

    getDelPeople:function(btn) {
        LMEPG.UI.showWaitingDialog();

        var json= {
            "functionid":'20006',
            "data": JSON.stringify({
                "patientid_card":btn.patientidCard
            })
        }

        LMEPG.ajax.postAPI("Expert/appointmentInterface", json, function (data){
            console.log(data);
            LMEPG.UI.dismissWaitingDialog();
        })
    },

    addInfo:function (){
        pageFunc.getQr();
        G('container_window').style.display = 'block';

        LMEPG.BM.requestFocus('window2');
    },

    delInfo:function (btn) {
        pageFunc.getDelPeople(btn);
        LMEPG.UI.showToast("已成功删除", 1.5);
        location.reload();
    },

    choosePeople:function (btn){
        var curPage = LMEPG.Intent.createIntent("qinghai-choose-people");

        LMEPG.Cookie.setCookie('userInfo',btn.info);
        curPage.setParam('manage',RenderParam.isManage);
        curPage.setParam('backIndex',btn.backIndex);
        curPage.setParam('isAdd','1');

        LMEPG.Intent.back('qinghai-add-order');
    },

    chooseOrder:function (btn, hasFocus) {
        var order_focus = G(btn.id);
        if (hasFocus) {
            order_focus.style.backgroundColor = '#17a1e5';
            order_focus.style.color = '#fff';
        }else {
            order_focus.style.backgroundColor = '';
            order_focus.style.color = '#FFF';
        }

    },
    turnPage:function (pre,cur,dir){
        if(dir === 'down'){
            if(G(pre.id).getBoundingClientRect().top <= 415 && G(pre.id).getBoundingClientRect().top >= 405){
                G('peopleList').scrollTop += 260;
            }
        }else if(dir === 'up'){
            if (G(pre.id).getBoundingClientRect().top <= 222 && G(pre.id).getBoundingClientRect().top >= 210) {
                G('peopleList').scrollTop -= 260;
            }
        }
    },
}

var Util = {
    getGender:function (i){
        switch (i){
            case '0':
                return '男';
            case '1':
                return '女';
        }
    },
    getX:function (x){
        var num = x.indexOf('-');
        return parseInt(x.substring(num+1));
    },
}

function onBack(){
    if(G('container_window').style.display ==='block'){
        G('container_window').style.display = 'none';
        //刷新页面
        location.reload();
        LMEPG.BM.requestFocus('add-btn');
    }else {
        LMEPG.Intent.back();
    }
}
