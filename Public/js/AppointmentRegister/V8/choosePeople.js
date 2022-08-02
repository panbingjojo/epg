var buttons = []
var len = 0


var Home = {
    init:function (){
        var that = this
        this.getPeopleList(function (res){
            that.renderList(res)
        })
    },

    getPeopleList:function (success){
        LMEPG.UI.showWaitingDialog()

        var json = {
            "functionid":"20000",
            "data":JSON.stringify({}),
        };

        LMEPG.ajax.postAPI("Expert/appointmentInterface", json, function (data){
            console.log(data)
            LMEPG.UI.dismissWaitingDialog()
            if(data.data.length !==0){
                success(data.data[0])
            }else {
                success([])
            }
        })
    },

    renderList:function (res){
        var html=''
        if(res.length === 0 ){
            G('add2').style.display='block'
            buttons.push({
                id: 'add-btn',
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
                click: pageFunc.addInfo,
                focusChange:'',
                beforeMoveChange: '',
                moveChange: '',
            })
            LMEPG.BM.init('add-btn',buttons,'',true)
        }else {
            len = res.length
            for (var i =0;i<res.length;i++){
                html+='<div class="people-item">\n' +
                    '      <div class="'+(RenderParam.isManage === '0'?'info':'info2')+'">\n' +
                    '          <div class="'+(RenderParam.isManage === '0'?'name':'name2')+'">'+res[i].patient_name+'</div>\n' +
                    '           <div class="gender">'+Util.getGender(res[i].sex)+'</div>\n' +
                    '           <div class="'+(RenderParam.isManage === '0'?'card-num':'card-num2')+'">'+res[i].patientid_card+'</div>\n' +
                    '       </div>'

                if( RenderParam.isManage ==='1'){
                    html +=   ' <div class="func-btn" id="edit-'+i+'">编辑</div>\n' +
                           ' </div>'

                    buttons.push({
                        id: 'edit-'+i,
                        type: 'div',
                        nextFocusLeft: '',
                        nextFocusRight: '',
                        nextFocusUp: i===0?'':'edit-'+(i-1),
                        nextFocusDown: i===res.length-1?'add':'edit-'+(i+1),
                        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
                        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
                        click: pageFunc.editInfo,
                        focusChange:'',
                        beforeMoveChange: '',
                        moveChange: pageFunc.turnPage,
                        info:JSON.stringify(res[i]),
                        backIndex:i
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
                        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
                        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
                        click: pageFunc.choosePeople,
                        focusChange:'',
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
                        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
                        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
                        click: pageFunc.editInfo,
                        focusChange:'',
                        beforeMoveChange: '',
                        moveChange: pageFunc.turnPage,
                        info:JSON.stringify(res[i]),
                        backIndex:i
                    })
                }
            }

            if(res.length % 5 !== 0){
                var len = 5 - (res.length % 5)
                    html+= '<div style="height:'+(63*len)+'px"></div>/n'+
                            '<div style="clear: both"></div>'
            }

            buttons.push({
                id: 'add',
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: RenderParam.isManage === '1'? 'edit-'+(res.length-1) : 'choose-'+(res.length-1),
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
                click: pageFunc.addInfo,
                focusChange:'',
                beforeMoveChange: '',
                moveChange: '',
            })

            G('add').style.display='block'
            G('list').innerHTML=html

            var scrollIndex = RenderParam.backIndex<5?0:parseInt(RenderParam.backIndex / 5)
            G('list').scrollTop = 320*scrollIndex

            if(RenderParam.isAdd){
                G('list').scrollTop = 320 * Math.ceil(len / 5 )
            }

            var result = RenderParam.isAdd?'add':RenderParam.isManage === '1'?'edit-'+RenderParam.backIndex:'choose-'+RenderParam.backIndex

            LMEPG.BM.init(result,buttons,'',true)
        }


    }
}

var pageFunc = {
    getCurrentPage:function (){
        return LMEPG.Intent.createIntent("xinjiang-choose-people");
    },

    addInfo:function (){
        var curPage = pageFunc.getCurrentPage()
        curPage.setParam('manage',RenderParam.isManage)
        curPage.setParam('isAdd','1')

        var toPage = LMEPG.Intent.createIntent("xinjiang-people-info");

        LMEPG.Intent.jump(toPage,curPage);
    },

    choosePeople:function (btn){
        LMEPG.Cookie.setCookie('userInfo',btn.info)

        LMEPG.Intent.back('xinjiang-add-order');
    },

    turnPage:function (pre,cur,dir){
        if( dir === 'down' ){
            if(Util.getX(cur.id) % 5 === 0){
                G('list').scrollTop +=320
            }

        }else if( dir === 'up'){
            if(Util.getX(pre.id) % 5 === 0){
                G('list').scrollTop -= 320
            }

        }
    },

    editInfo:function (btn){
        var curPage = LMEPG.Intent.createIntent("xinjiang-choose-people");
        curPage.setParam('manage',RenderParam.isManage)
        curPage.setParam('backIndex',btn.backIndex)

        var toPage = LMEPG.Intent.createIntent("xinjiang-people-info");

        toPage.setParam('edit',btn.info)

        LMEPG.Intent.jump(toPage,curPage);
    }
}

var Util = {
    getGender:function (i){
        switch (i){
            case '0':
                return '男'
            case '1':
                return '女'
        }
    },
    getX:function (x){
        var num = x.indexOf('-')
        return parseInt(x.substring(num+1))
    },

}

