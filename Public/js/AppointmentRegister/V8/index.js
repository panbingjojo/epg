var buttons = []

var initData={
    area:[]
}

var areaIndex = 0
var preIndex = 0
var turnFlag = null

var page = 0
var nowAreaId = 'area-0'

var Home = {

    init:function (){
        this.initData();
    },


    initData:function (){
        var that = this;

        LMEPG.UI.showWaitingDialog()
        this.getAreaData(function (res){
            console.log(res)
            initData.area = res
            that.renderArea();
            that.getHospitalList(initData.area[RenderParam.backIndex].AreaId,function (res){
                that.renderHospitalList(res,'area-'+(RenderParam.backIndex))
                that.initButton();

                var x =Utils.getX(RenderParam.hosId);

                G('hospital-area').scrollTop += parseInt(x / 2)*480;


                LMEPG.UI.dismissWaitingDialog();

            })
        })
    },

    getAreaData:function(success){
        var data = {
            "functionid":"11010",
            "data":JSON.stringify({
                "AreaId":'233'
            }),
        };
        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            success(res.data)
        },function (){

        });
    },

    getHospitalList:function (id,success){
        var data = {
            "functionid":"12010",
            "data":JSON.stringify({
                "AreaId":id
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

    renderHospitalList:function (list,id){
        var area = G('hospital-area');
        var str=''
        console.log(id)
        area.innerHTML=''

        if (list.length === 0){
            Show('no-result');
            return
        }else {
            Hide('no-result');
        }

        for (var i = 0;i<list.length;i++){
            var x = parseInt(i / 3);
            var y = i % 3;

            if(x !== turnFlag){
                turnFlag = x
                str+='<div class="row">'
            }
                str+= '<div class="hospital" style="left:'+ y*380+'px;" id="hospital-'+x+'x'+y+'" >\n' +
                    '   <div class="hospital-one">\n' +
                    '   <img src="'+Home.getPic(list[i].PhotoUrl)+'" style="height: 210px;width: 350px;border-radius: 15px">\n'+
                    '       <div class="name">'+list[i].HospitalName+'</div>\n' +
                    '    </div>\n'+
                    ' </div>\n'

                buttons.push({
                    id: 'hospital-'+x+'x'+y,
                    name: '',
                    type: 'div',
                    nextFocusLeft: 'hospital-'+x+'x'+(y-1),
                    nextFocusRight: 'hospital-'+x+'x'+(y+1),
                    nextFocusUp: x === 0?id:'hospital-'+(x-1)+'x'+y,
                    nextFocusDown: 'hospital-'+(x+1)+'x'+y,
                    backgroundImage: ' ',
                    focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/hospital-choose.png',
                    click: PageFunc.toHospital,
                    beforeMoveChange:function (dir,btn) {
                        if(!G(btn. nextFocusDown)&& dir === 'down'){
                            LMEPG.BM.requestFocus('hospital-'+(parseInt(list.length/3))+'x'+(list.length%3 -1))
                        }
                    },
                    focusChange:'',
                    moveChange: PageFunc.turnHospitalPage,
                    hospitalId: list[i].HospitalId
                })

            if(i % 3 === Math.min(2,list.length))
                str+='</div>'
        }
        LMEPG.BM.addButtons(buttons);

        area.innerHTML = str;
    },

    renderArea:function (){
        var list = G('place-area')
        var str=''

        if(RenderParam.backIndex === '0'){ Hide('left-arrow')}

        areaIndex =RenderParam.backIndex
        preIndex = RenderParam.backIndex

        for (var i = 0; i<initData.area.length;i++){
            str+='<div id="area-'+i+'" class="area-name" style="left:'+ 180*(i-RenderParam.backIndex) +'px">\n' +
                '<div id="scroll-'+i+'" class="area-text">'+initData.area[i].AreaName+'</div>\n'+
                 '</div>\n'

            buttons.push({
                id: 'area-'+i,
                name: initData.area[i].AreaName,
                type: 'div',
                nextFocusLeft: 'area-'+(i-1),
                nextFocusRight: 'area-'+(i+1),
                nextFocusUp: 'record',
                nextFocusDown: 'hospital-0x0',
                backgroundImage: ' ',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
                click: '',
                focusChange:'',
                beforeMoveChange: PageFunc.leaveArea,
                moveChange: PageFunc.changArea,
                areaId:initData.area[i].AreaId,
                scrollId:"scroll-"+i,
                backIndex:i
            })
        }

        list.innerHTML=str
    },

    initButton:function (){
        buttons.push({
            id: 'record',
            name: '订单记录',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'patient-admin',
            nextFocusUp: '',
            nextFocusDown:RenderParam.hosId ==='record'?'area-'+RenderParam.backIndex:'area-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:PageFunc.toOrderList,
            beforeMoveChange: PageFunc.leaveTitleBtn,
            moveChange:'',
            cIdx: ''
        },{
            id: 'patient-admin',
            name: '就诊人管理',
            type: 'div',
            nextFocusLeft: 'record',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: RenderParam.hosId ==='patient-admin'?'area-'+RenderParam.backIndex:'area-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            beforeMoveChange: PageFunc.leaveTitleBtn,
            moveChange:'',
            cIdx: '',
            click:PageFunc.toPatientAdmin
        })

        console.log(RenderParam.hosId?RenderParam.hosId:"area-0")
        LMEPG.BM.init(RenderParam.hosId?RenderParam.hosId:"area-0", buttons, "", true);

    }
}

var PageFunc={
    changArea:function (pre,cur,dir){
        var childList = G('place-area').children

        if(dir === 'up' || dir === 'down'){
            LMEPG.BM.requestFocus("area-"+RenderParam.backIndex)
            return
        }

        turnFlag = null

        LMEPG.UI.showWaitingDialog()
        Home.getHospitalList(cur.areaId,function (res){
            Home.renderHospitalList(res,nowAreaId)
            LMEPG.UI.dismissWaitingDialog()
        })

        if(pre.name.length > 5){
            LMEPG.UI.Marquee.stop()
        }

        if(cur.name.length > 5){
            LMEPG.UI.Marquee.start(cur.scrollId,5)
        }

        if((dir === 'right') && areaIndex < initData.area.length - 1 ){
            areaIndex++
            if(areaIndex - preIndex === 4){
                preIndex++
                for(var i = 0;i<childList.length;i++){
                    childList[i].style.left=Utils.getStyleValue(childList[i].style.left) - 180+'px'
                }
            }
        } else if(dir === 'left'){
            if(areaIndex>0){
                areaIndex--
                if(areaIndex < preIndex && preIndex > 0){
                    preIndex--
                    for(var i = 0;i<childList.length;i++){
                        childList[i].style.left=Utils.getStyleValue(childList[i].style.left) + 180+'px'
                    }
                }
            }
        }

        areaIndex === 0?Hide('left-arrow'):Show('left-arrow')
        areaIndex === initData.area.length-1?Hide('right-arrow'):Show('right-arrow')
    },

    leaveArea:function (dir,btn){
        if(dir === 'down' || dir === 'up'){
            nowAreaId = btn.id
            RenderParam.backIndex=btn.backIndex
        }
    },

    leaveTitleBtn:function (dir){
        if(dir === 'down'){
            setTimeout(function (){ LMEPG.BM.requestFocus((RenderParam.hosId ==='record' || RenderParam.hosId ==='patient-admin') ?
                'area-'+RenderParam.backIndex:nowAreaId);})
        }
    },

    toHospital:function (btn){
        var toPage = LMEPG.Intent.createIntent("xinjiang-hospital");
        var currentPage = LMEPG.Intent.createIntent("xinjiang-reservation");

        console.log(btn)

        toPage.setParam("HospitalId",btn.hospitalId);

        currentPage.setParam('backIndex',RenderParam.backIndex)
        currentPage.setParam('hosId',btn.id)

       LMEPG.Intent.jump(toPage,currentPage);
    },

    toOrderList:function (btn){
        var toPage = LMEPG.Intent.createIntent("xinjiang-order-list");
        var currentPage = LMEPG.Intent.createIntent("xinjiang-reservation");
        currentPage.setParam('backIndex',RenderParam.backIndex)
        currentPage.setParam('hosId',btn.id)
        LMEPG.Intent.jump(toPage,currentPage);
    },

    toPatientAdmin:function (btn){
        var toPage = LMEPG.Intent.createIntent("xinjiang-choose-people");
        var currentPage = LMEPG.Intent.createIntent("xinjiang-reservation");
        currentPage.setParam('backIndex',RenderParam.backIndex)
        currentPage.setParam('hosId',btn.id)
        toPage.setParam('manage','1')

        LMEPG.Intent.jump(toPage,currentPage);
    },

    turnHospitalPage:function (pre,cur,dir){
        console.log(G(cur.id).getBoundingClientRect().top,99)
        if(dir === 'down'){
            if(G(pre.id).getBoundingClientRect().top === 430){
                G('hospital-area').scrollTop += 480
            }
        }else if(dir === 'up'){
            if (G(pre.id).getBoundingClientRect().top === 190) {
                G('hospital-area').scrollTop -= 480
            }

        }
    },
}

var Utils = {
    getStyleValue:function (str){
        return str.substring(0,str.indexOf('p')) * 1
    },

    getX:function (x){
        var num = x.indexOf('-')
        return parseInt(x.substring(num+1,num+2))
    },

    cutWord:function (text,char){
        return text.substring(0,text.indexOf(char))
    }

}