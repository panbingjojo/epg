var buttons = []

var Home = {
    init:function (){
        LMEPG.UI.showWaitingDialog()
        var that = this
        this.getDoctorInfo(function (res){
            RenderParam.name = res.DocName
            that.renderDoctorInfo(res)
            that.getOrderInfo(function (res){
                that.renderOrderList(res)
                LMEPG.UI.dismissWaitingDialog()

            })
        })


    },
    getOrderInfo:function (success){
        var data = {
            "functionid":"15010",
            "HospitalId":RenderParam.hospitalId,
            "data":JSON.stringify({
                "DepId":RenderParam.depId,
                "DocId":RenderParam.docId
            }),
        };

        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            console.log(res)
            success(res.data)
        },function (){

        });
    },

    getOrderId:function (SchemeId,ResDate,SchemeDaypart,success){
        var data = {
            "functionid":"15030",
            "HospitalId":RenderParam.hospitalId,
            "data":JSON.stringify({
                "SchemeId":SchemeId,
                "ResDate":ResDate,
                "SchemeDaypart":SchemeDaypart
            }),
        };

        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            console.log(res)
            success(res.data)
        },function (){

        });
    },

    getDoctorInfo:function (success){
        var data = {
            "functionid":"14020",
            "HospitalId":RenderParam.hospitalId,
            "data":JSON.stringify({
                "DepId":RenderParam.depId,
                "DocId":RenderParam.docId
            }),
        };

        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            console.log(res)
            success(res.data)
        },function (){

        });
    },

    getPic:function (src){
        var text = src.substring(src.lastIndexOf('/'))

        var json = JSON.stringify({
            "functionid":"20008",
            "imgName":text.split('.')[0],
            "imgUrl":src
        })


        return 'http://120.70.237.86:10000/cws/jiukang/index.php?head={}&json='+encodeURI(json);
    },

    renderDoctorInfo:function (res){
        G('avatar').src=Home.getPic(res.ImageUrl)
        G('name').innerText = res.DocName
        G('hospital-name').innerText=RenderParam.hospitalName
        G('title').innerText = res.DocTitle
        G('depName').innerText = RenderParam.depName
        G('introduce').innerText=res.DocDisc || '暂无'

        if(res.DocDisc && res.DocDisc.length >= 70){
            LMEPG.UI.Marquee.start('introduce',70,3,1,'up')
            document.getElementsByTagName('marquee')[0].style.height = '140px'
        }
    },

    renderOrderList:function (data){
        var html = ''
        var lastLineNum = parseInt(data.length / 4) * 4
        if(data.length === 0){
            G('no-result').style.display = 'block'
            buttons.push({
                id:'doctor-info',
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown:'',
                backgroundImage:' ' ,
                focusImage: g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/order-list-choose.png',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: Page.turnPage,
                max:data.length-1
            })
            LMEPG.BM.init('doctor-info',buttons,true)
        }else{
            for (var i=0;i<data.length;i++){
                html +=' <div id="item-'+i+'" class="order-state" style="background: url('+Utils.getFlag(data[i].Flag).noUrl+');background-size: 178px 80px;">\n' +
                    '         <div style="padding: 18px 5px">\n' +
                    '               <div class="order-info">'+data[i].SchemeDate+'</div>\n' +
                    '                <div class="order-info">周'+Utils.getWeek(data[i].SchemeWeekday)+ Utils.getTime(data[i].SchemeDaypart)+'</div>\n' +
                    '          </div>\n' +
                    '    </div>'

                buttons.push({
                    id: 'item-'+i,
                    type: 'div',
                    nextFocusLeft: 'item-'+(i-1),
                    nextFocusRight: 'item-'+(i+1),
                    nextFocusUp: 'item-'+(i-4),
                    nextFocusDown:i>=lastLineNum?'':i+4>=data.length?'item-'+(data.length-1):'item-'+(i+4),
                    backgroundImage: Utils.getFlag(data[i].Flag).noUrl,
                    focusImage: Utils.getFlag(data[i].Flag).chooseUrl,
                    click:Page.toOrder,
                    focusChange: '',
                    beforeMoveChange: '',
                    moveChange: '',
                    flag: data[i].Flag,
                    time:data[i].SchemeDate+' 周'+Utils.getWeek(data[i].SchemeWeekday)+ Utils.getTime(data[i].SchemeDaypart),
                    info:data[i]
                    
                })
            }

            buttons.push({
                id:'doctor-info',
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown:'',
                backgroundImage:' ' ,
                focusImage:g_appRootPath+ '/Public/img/hd/AppointmentRegister/V8/order-list-choose.png',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: Page.turnPage,
                max:data.length-1
            })

            html+='<div style="clear: both"></div>'

            //LMEPG.BM.addButtons(buttons)

            G('order-list').innerHTML = html

            LMEPG.BM.init((RenderParam.backId || 'item-0'),buttons,true)
        }
    }
}

var Page = {
    turnPage:function (pre,cur,dir){
        if(dir === 'up'){
            if( G('introduce').scrollTop === 0){
                LMEPG.BM.requestFocus('item-'+cur.max)
            }else {
                G('introduce').scrollTop-=50
            }

        }else if(dir === 'down' ){
            G('introduce').scrollTop+=50
        }
    },
    toOrder:function (btn){
        if(btn.flag > 0 ){
            LMEPG.UI.showWaitingDialog()

            Home.getOrderId(btn.info.SchemeId,btn.info.SchemeDate,btn.info.SchemeDaypart,function (res){
                LMEPG.UI.dismissWaitingDialog()
                if(res.length > 0){
/*
                    LMEPG.Cookie.setCookie('order',JSON.stringify(res[0]))
                    LMEPG.Cookie.setCookie('docInfo',JSON.stringify({
                        hospitalName:RenderParam.hospitalName,
                        doctorName:RenderParam.name,
                        time:btn.time,
                        DepId:RenderParam.depId,
                        DocId:RenderParam.docId,
                        HospitalId:RenderParam.hospitalId,
                        OutcallDate:btn.info.SchemeDate,
                        OutcallDaypart:btn.info.SchemeDaypart,
                        depName:RenderParam.depName
                    }))
*/
                    var order = encodeURIComponent(JSON.stringify(res[0]));
                    var docInfo = encodeURIComponent(JSON.stringify({
                        hospitalName:RenderParam.hospitalName,
                        doctorName:RenderParam.name,
                        time:btn.time,
                        DepId:RenderParam.depId,
                        DocId:RenderParam.docId,
                        HospitalId:RenderParam.hospitalId,
                        OutcallDate:btn.info.SchemeDate,
                        OutcallDaypart:btn.info.SchemeDaypart,
                        depName:RenderParam.depName
                    }));

                    var data = {
                        "order":order,
                        "docInfo":docInfo,
                    };

                    LMEPG.ajax.postAPI('Debug/setDocInfoSession',data,function (res){
                        var curPage = LMEPG.Intent.createIntent("xinjiang-doctor-order");
                        var toPage = LMEPG.Intent.createIntent("xinjiang-add-order");

                        curPage.setParam("HospitalId",RenderParam.hospitalId);
                        curPage.setParam("DepId",RenderParam.depId);
                        curPage.setParam("DocID",RenderParam.docId);
                        curPage.setParam("HospitalName",RenderParam.hospitalName);
                        curPage.setParam("DepName",RenderParam.depName);
                        curPage.setParam('backId',btn.id)


                        toPage.setParam('HospitalName',RenderParam.hospitalName);
                        toPage.setParam('DoctorName',RenderParam.name);
                        toPage.setParam('Time',btn.time)

                        LMEPG.Intent.jump(toPage,curPage);
                    });
                }else {
                    LMEPG.UI.showToast('该医生已停诊，暂时不接受预约',2)
                }
            }

            )
        }else {
            LMEPG.UI.showToast("当前暂时不接受预约",1.5)
        }

    }
}

var Utils = {
    getWeek:function (w){
        var weekArr=['日','一','二','三','四','五','六']
        return weekArr[w]
    },
    getTime:function (w){
        switch (w){
            case '0':
                return ' 上午'
            case '1':
                return ' 下午'
            case '2':
                return ' 晚上'

        }
    },
    getFlag:function (type){
       if(type > 0){
           return {
               noUrl:g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/can.png',
               chooseUrl:g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/can-choose.png'
           }
       }else if(type === '约满'){
           return {
               noUrl:g_appRootPath+"/Public/img/hd/AppointmentRegister/V8/full.png",
               chooseUrl:g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/full-choose.png'
           }
       }else if(type === '停诊' || type === '暂停' ){
           return {
               noUrl:g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/pause.png',
               chooseUrl:g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/pause-choose.png'
           }
       }else if(type == 0){
           return {
               noUrl:g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/pause.png',
               chooseUrl:g_appRootPath+'/Public/img/hd/AppointmentRegister/V8/pause-choose.png'
           }
       }
    }
}