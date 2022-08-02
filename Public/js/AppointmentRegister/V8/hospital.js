var initData = {
    department:[],
    hospitalIdName:''
}

var shouldBackDoc = RenderParam.docBtnId || 'doctorItem-0-0'

var openDepFocusId = RenderParam.openDepId

var depAreaId = 'department-item-0';

var buttons = [];

var Home = {
    init:function (){
        this.initData();
    },

    initData:function (){
        var that = this;
        LMEPG.UI.showWaitingDialog();

        this.getHospitalIntro(function (res){

            initData.hospitalIdName = res.HospitalName;
            that.renderIntro(res);

            that.getHospitalDepartment(function (res){
                initData.department=res;
                that.renderDepartment();

                that.getHospitalDoctor(res[RenderParam.backDepIndex || 0].DepId,function (resData){
                    if(RenderParam.backDepIndex){
                        that.renderDoctorList(resData,RenderParam.backDepIndex>2?'add':RenderParam.backDepIndex,res[RenderParam.backDepIndex].DepId,res[RenderParam.backDepIndex].DepName);
                    }else {
                        that.renderDoctorList(resData,0,res[0].DepId,res[0].DepName);
                    }

                    that.initButton();

                    var x =parseInt( Utils.getX(RenderParam.docBtnId) / 2);
                    G('doctor-list-area').scrollTop = 350 * x;

                    LMEPG.UI.dismissWaitingDialog();
                })

            })

        })

    },

    getHospitalIntro:function (success){

        var data = {
            "functionid":"12020",
            "data":JSON.stringify({
                "HospitalId":RenderParam.hospitalId
            }),
        };
        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            console.log(res);
            success(res.data);
        },function (){

        });
    },

    getHospitalDepartment:function (success){
        var data = {
            "functionid":"13010",
            "data":JSON.stringify({
                "HospitalId":RenderParam.hospitalId
            }),
        };

        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            console.log(res);
            success(res.data);
        },function (){

        });
    },

    getHospitalDoctor:function (depId,success){
        var data = {
            "functionid":"14010",
            "HospitalId":RenderParam.hospitalId,
            "data":JSON.stringify({
                "DepId":depId,
            }),
        };
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            console.log(res);
            LMEPG.UI.dismissWaitingDialog();
            success(res.data);
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

    renderIntro:function (data){
        G('hospital-img').src = Home.getPic(data.PhotoUrl);
        G('hospital-name').innerText = data.HospitalName;
        G('hospital-addr').innerText = "地址："+ data.HospitalAddr;

        data.Summary.length === 0?
            G('hospital-intro').innerText='该医院暂无简介':
            G('hospital-intro').innerText = data.Summary.length > 45?data.Summary.substr(0,45)+'....' : data.Summary;
    },

    renderDepartment:function (){
        var departArea = G('department-area');
        var str = '';
        var len=Math.min(3,initData.department.length);

        for (var i = 0;i<len;i++){
            str+='<div class="department-item" id="department-item-'+i+'">'+initData.department[i].DepName+'</div>'

            buttons.push({
                id: 'department-item-'+i,
                type: 'div',
                nextFocusRight:'',
                nextFocusUp: i === 0?'to-detail':'department-item-'+(i-1),
                nextFocusDown:(RenderParam.backDepIndex>2 && i===2)?'department-item-add':'department-item-'+(i+1),
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose_long.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
                click:'',
                focusChange: '',
                beforeMoveChange: PageFunc.leaveAreaDepartment,
                moveChange: PageFunc.changeDepartment,
                depId: initData.department[i].DepId,
                depName:initData.department[i].DepName,
                groupId:i,
                backIndex:i
            })
        }
        if(initData.department.length>3){
            str+='<div class="department-item" style="display: none;" id="department-item-add" ></div>'+
                 '<div class="department-item" id="department-item-'+len+'">更多科室</div>'+


            buttons.push({
                id: 'department-item-'+len,
                type: 'div',
                nextFocusUp:RenderParam.backDepIndex>2?'department-item-add':'department-item-2',
                nextFocusDown:'department-item-add',
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose_long.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
                click:PageFunc.showMoreDep,
                focusChange: '',
                moveChange:'',
            })
        }

        departArea.innerHTML = str

        if(RenderParam.backDepIndex && RenderParam.backDepIndex*1 >2){
            buttons.push({
                id: 'department-item-add',
                type: 'div',
                nextFocusRight:'',
                nextFocusUp: 'department-item-2',
                nextFocusDown:'department-item-3',
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose_long.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
                click:'',
                focusChange: '',
                groupId:'add',
                beforeMoveChange:PageFunc.leaveAreaDepartment,
                moveChange: PageFunc.changeDepartment,
                depId:initData.department[RenderParam.backDepIndex].DepId,
                depName:initData.department[RenderParam.backDepIndex].DepName,

            })

            G('department-item-add').innerHTML = initData.department[RenderParam.backDepIndex].DepName
            G('department-item-add').style.display = 'block'
        }

    },

    renderDoctorList:function (data,groupId,depId,depName){
        var area = G('list-row')
        var str = '';
        var addButtonsArr=[]
        var left = (data.length % 4 )
        var line =Math.ceil(data.length / 4)

        if(data.length === 0){
            G('no-result').style.display='block'
            area.innerHTML=''
        }else {
            G('no-result').style.display='none'
            var turnData = []

            for(var n=0;n<data.length;n++){
                if(data[n].DocId){
                    turnData.push(data[n])
                }
            }

            for( var i = 0;i<turnData.length;i++){

                var x = parseInt(i / 4);
                var y = i % 4;

                str+= '<div class="doctor-item" id="doctorItem-'+x+'-'+y+'">\n' +
                    '    <div class="doctor-pic">\n' +
                    '      <img src="'+Home.getPic(turnData[i].ImageUrl)+'" style="width: 120px;height: 126px;border-radius: 15px"/>\n' +
                    '      <div class="title">'+turnData[i].DocTitle+'</div>'+
                    '    </div>\n' +
                    '    <div id="scroll-name-'+i+'" class="doctor-name">'+turnData[i].DocName+'</div>\n' +
                    '</div>'

                    addButtonsArr.push({
                        id: 'doctorItem-'+x+'-'+y,
                        type: 'div',
                        name:turnData[i].DocName,
                        nextFocusLeft: y === 0?'department-item-'+groupId:'doctorItem-'+x+'-'+(y-1),
                        nextFocusRight: 'doctorItem-'+x+'-'+(y+1),
                        nextFocusUp: 'doctorItem-'+(x-1)+'-'+y,
                        nextFocusDown: (x+1===line-1 && y+1>left-1 && left!==0)?'doctorItem-'+(line-1)+'-'+(left-1):'doctorItem-'+(x+1)+'-'+y,
                        backgroundImage: ' ',
                        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/doctor-choose.png',
                        click:PageFunc.toDoctor,
                        focusChange: '',
                        beforeMoveChange: '',
                        moveChange: PageFunc.turnDocPage,
                        docID:turnData[i].DocId,
                        depId:depId,
                        depName:depName,
                        hospitalName:initData.hospitalIdName,
                        scrollId:'scroll-name-'+i,
                    })
            }

            LMEPG.BM.addButtons(addButtonsArr)

            str+='<div style="clear:both"></div>'
            area.innerHTML = str
        }

    },

    initButton:function (){
        buttons.push({
            id: 'to-detail',
            name: '医院介绍',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown:'department-item-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:PageFunc.toHospitalDetail,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            cIdx: ''
        })

        LMEPG.BM.init((RenderParam.docBtnId ||'department-item-0'), buttons, "", true);
    }

}

var PageFunc = {
    getCurrentPage:function (){
        var cur = LMEPG.Intent.createIntent("xinjiang-hospital");
        cur.setParam("HospitalId",RenderParam.hospitalId);
        return cur
    },

    toHospitalDetail:function (){
        var toPage = LMEPG.Intent.createIntent("xinjiang-hospital-intro");
        var currentPage = PageFunc.getCurrentPage()

        toPage.setParam("HospitalId",RenderParam.hospitalId);

        LMEPG.Intent.jump(toPage,currentPage);
    },

    toDoctor:function (btn){
        var toPage = LMEPG.Intent.createIntent("xinjiang-doctor-order");
        var currentPage =PageFunc.getCurrentPage()

        toPage.setParam("HospitalId",RenderParam.hospitalId);
        toPage.setParam("DepId",btn.depId);
        toPage.setParam("DocID",btn.docID);
        toPage.setParam("HospitalName",initData.hospitalIdName);
        toPage.setParam("DepName",btn.depName);

        currentPage.setParam('backDepIndex',RenderParam.backDepIndex);
        currentPage.setParam('docBtnId',btn.id);
        currentPage.setParam('openDepId',openDepFocusId)

        LMEPG.Intent.jump(toPage,currentPage);
    },

    leaveAreaDepartment:function (dir,cur){
        if(dir === 'right'){
           setTimeout(function (){
               LMEPG.BM.requestFocus(shouldBackDoc)
           })
        }
    },

    changeDepartment:function (pre,cur,dir){

        if( dir === 'up' || dir === 'down'){

            // if(pre.depName && pre.depName.length > 9){
            //     LMEPG.UI.Marquee.stop()
            // }
            //
            // if(cur.depName.length > 9){
            //     LMEPG.UI.Marquee.start(cur.id,9)
            // }

            RenderParam.backDepIndex = cur.backIndex;
            depAreaId = cur.id;
            shouldBackDoc = 'doctorItem-0-0'
            Home.getHospitalDoctor(cur.depId,function (res){
                Home.renderDoctorList(res,cur.groupId,cur.depId,cur.depName);
            })
        }
    },

    showMoreDep:function (){
        G('all-dep-area').scrollTop = 0;

        var buttonDep = []
        var html = ''

        var left =5 - Math.ceil(initData.department.length % 20 / 4)

        var hasLeft = (initData.department.length % 4 )
        var line =Math.ceil(initData.department.length / 4)


        for(var i = 0; i< initData.department.length;i++){
            var x = parseInt(i / 4);
            var y = i % 4;
            html += '<div class="dep" style="font-size: 20px" id="dep-'+x+'-'+y+'">'+ initData.department[i].DepName+'</div>'

            buttonDep.push({
                id: 'dep-'+x+'-'+y,
                type: 'div',
                nextFocusLeft: y === 0?'':'dep-'+x+'-'+(y-1),
                nextFocusRight: 'dep-'+x+'-'+(y+1),
                nextFocusUp: x===0?'close-menu':'dep-'+(x-1)+'-'+y,
                nextFocusDown:(x+1===line-1 && y+1>(hasLeft-1) && hasLeft!==0)?'dep-'+(line-1)+'-'+(hasLeft-1):'dep-'+(x+1)+'-'+y,
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose_long.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
                click:PageFunc.chooseDep,
                focusChange: '',
                beforeMoveChange: '',
                name:initData.department[i].DepName,
                depId:initData.department[i].DepId,
                moveChange: PageFunc.turnDepPage,
                backIndex:i
            })
        }

        LMEPG.BM.addButtons(buttonDep)

        html+= '<div style="clear: both"></div>' +
               '<div style="height:'+(left*70)+'px"></div>'

        G('all-dep-area').innerHTML = html
        G('more-dep').style.display = 'block'

        var x =Utils.getX(openDepFocusId);


        G('all-dep-area').scrollTop =parseInt(x / 5)* 350;
        LMEPG.BM.requestFocus(openDepFocusId)
    },

    chooseDep:function (btn){
        G('more-dep').style.display = 'none'
        G('department-item-add').innerHTML = btn.name
        G('department-item-add').style.display = 'block'
        openDepFocusId = btn.id

        Home. getHospitalDoctor(btn.depId,function (res){
            Home.renderDoctorList(res,'add',btn.depId,btn.name)
        })

        LMEPG.BM.deleteButtons('department-item-3')
        LMEPG.BM.deleteButtons('department-item-2')

        LMEPG.BM.addButtons([{
            id: 'department-item-add',
            type: 'div',
            nextFocusRight:'',
            nextFocusUp: 'department-item-2',
            nextFocusDown:'department-item-3',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose_long.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:'',
            focusChange: '',
            groupId:'add',
            depId:btn.depId,
            depName:btn.name,
            backIndex:btn.backIndex,
            beforeMoveChange: PageFunc.leaveAreaDepartment,
            moveChange: PageFunc.changeDepartment,
        },{
            id: 'department-item-3',
            type: 'div',
            nextFocusUp:'department-item-add',
            nextFocusDown:'',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose_long.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            click:PageFunc.showMoreDep,
            focusChange: '',
            moveChange:'',
        },{
            id: 'department-item-2',
            type: 'div',
            nextFocusRight:'doctorItem-0-0',
            nextFocusUp:'department-item-1',
            nextFocusDown:'department-item-add',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/no_choose_long.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/choose_oval.png',
            focusChange: '',
            moveChange: PageFunc.changeDepartment,
            depId: initData.department[2].DepId,
            depName:initData.department[2].DepName,
            groupId:2,
            backIndex:2
        }])

        RenderParam.backDepIndex = btn.backIndex

        LMEPG.BM.requestFocus('department-item-add')
    },

    closeMenu:function (){
        G('more-dep').style.display = 'none'
        LMEPG.BM.requestFocus('department-item-3')
    },

    turnDepPage:function (pre,cur,dir){

        if(pre.name && pre.name.length > 9){
            LMEPG.UI.Marquee.stop()
        }

        if(cur.name.length > 9){
            LMEPG.UI.Marquee.start(cur.id,9)
        }

        var x =Utils.getX(cur.id);
        if(dir === 'down' && x!==0){
            if(x % 5=== 0 ){
                G('all-dep-area').scrollTop += 350;
            }
        }else if ( dir === 'up'){
            if(Utils.getX(pre.id) % 5 ===0){
                G('all-dep-area').scrollTop -= 350;
            }
        }

    },

    turnDocPage:function (pre,cur,dir){
        shouldBackDoc = cur.id

        var x =Utils.getX(cur.id);

        if(pre.name && pre.name.length > 5){
            LMEPG.UI.Marquee.stop()
        }

        if(cur.name.length > 5){
            LMEPG.UI.Marquee.start(cur.scrollId,5)
        }

        if(dir === 'down'){
            if( x % 2 === 0 ){
                G('doctor-list-area').scrollTop += 354;
            }
        }else if(dir === 'up'){
            if(Utils.getX(pre.id) % 2 ===0){
                G('doctor-list-area').scrollTop -= 354;
            }
        }
    }
}


var Utils = {
    getX:function (x){
        var num = x.indexOf('-')
        var lastNum = x.lastIndexOf('-')
        return parseInt(x.substring(num+1,lastNum))
    },
}

function onBack(){
    console.log(54)
    if(G('more-dep').style.display ==='block'){
        G('more-dep').style.display = 'none'
        LMEPG.BM.requestFocus('department-item-3')
    }else {
        LMEPG.Intent.back()
    }
}