var buttons = []

var addButtonsArr = []

var initData = {
    department: [],
    hospitalIdName: '',
}
var docData
var shouldBackDoc = RenderParam.docBtnId || 'doctorItem-0'
//科室id
var openDepFocusId = 'dep-0-0'
//科室
var depAreaId = 'department-item-0';
var depBackIndex = '';
var Home = {
    Data: [],
    depGroupId: '',
    depNo: '',
    doctorPage: 0,
    doctorMaxPage: '',
    depCode: '',
    init: function () {
        LMEPG.UI.showWaitingDialog();
        Home.getHospitalIntro(function (res) {
            initData.hospitalIdName = res.hospital_name;
            Home.renderIntro(res)
            Home.getHospitalDepartment(function (res) {
                initData.department=res;
                Home.renderDepartment();
                Home.getHospitalDoctor(((RenderParam.depBackIndex>2||RenderParam.depBackIndex==='')?res[0].deptNo:RenderParam.depCode),function (resData) {
                    Home.Data = resData;
                    if((RenderParam.depBackIndex>2||RenderParam.depBackIndex)){
                        Home.renderDoctorList(Home.Data,(RenderParam.depBackIndex>2||RenderParam.depBackIndex==='')?0:RenderParam.depBackIndex,res[RenderParam.backDepIndex].deptCode,res[RenderParam.backDepIndex].name);
                    }else {
                        Home.renderDoctorList(Home.Data,0,res[0].code,res[0].name);
                    }
                    Home.initButton();
                    LMEPG.UI.dismissWaitingDialog();
                })
            })
        })
    },

    /**
     * 拉取管理后台配置的医院信息
     * */
    getHospitalIntro:function (success){
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalListInfo", "", function (rsp) {
            try {
                if (rsp.result === 0) {
                    var res = '';
                    for(var i =0;i<rsp.list.length;i++) {
                        if (rsp.list[i].hospital_code === 'QH013') {
                            res = rsp.list[i];
                            break;
                        }
                    }
                    console.log(res,'医院信息');
                    success(res);
                } else {
                    LMEPG.UI.showToast("数据拉取失败:" + rsp);
                }
            } catch (e) {
                LMEPG.UI.showToast("数据拉取失败:" + e);
            }
        });
    },

    /**
     * 通过今天日期拉取今天的医院科室信息
     * */
    getHospitalDepartment:function (success){
        var date = new Date();
        date.setDate(date.getDate());
        var today = date.format('yyyy-MM-dd');
        var data = {
            'date': today
        }

        LMEPG.ajax.postAPI('AppointmentRegister/getDepartmentInfo1',data,function (res){
            success(res.data);
            console.log(res,'医院科室')
        },function (){
        });
    },

    /**
     * 拉取今天跟明天之内的排版医生信息
     * */
    getHospitalDoctor:function (code,success){
        var date = new Date();
        var fullYear = date.getFullYear();
        var month = date.getMonth() + 1;
        if  (month<10) {
            month = '0'+month
        }
        var day = date.getDate()
        if  (day<10) {
            day = '0' + day
        }
        date.setDate(date.getDate() + 1)
        var tomorrow = date.format("yyyy-MM-dd");
        var data = {
            "deptCode": code+"",
            "beginDate":fullYear + '-' + month + '-' +day,
            "endDate":tomorrow,
            // 'beginDate': '2022-01-01',
            // 'endDate' : '2022-12-31'
        };
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('AppointmentRegister/getDoctorInfo',data,function (res){
            console.log(res.data,'医生');
            LMEPG.UI.dismissWaitingDialog();
            success(res.data);
        },function (){
        });
    },

    /**
     * 渲染医院介绍
     * */
    renderIntro: function (data) {
        // G('hospital-img').src = Home.getPic(data.PhotoUrl);
        G('hospital-name').innerText = (data?data.hospital_name:'西宁市中医院');
        G('hospital-addr').innerText = "地址：" + (data?data.location:'暂无地址');

        data.registration_intro?
            G('hospital-intro').innerText = data.registration_intro.length > 90 ? data.registration_intro.substr(0, 90) + '....' : data.brief_intro:
            G('hospital-intro').innerText = '该医院暂无简介'
    },

    /**
     * 渲染科室信息
     * */
    renderDepartment: function () {
        var dep_id_list = [];
        var result  = [];
        if (initData.department) {
            // 对重复的科室做去重处理
            for (var i = 0; i <initData.department.length ; i++) {
                var item = initData.department[i];
                var is_not_exits = dep_id_list.indexOf(item.deptNo) < 0
                is_not_exits && dep_id_list.push(item.deptNo)
                is_not_exits && result.push(item)
            }
            var departArea = G('department-area');
            var str = '';
            var len=Math.min(3,result.length);
            for (var i = 0; i < len; i++) {
                str += '<div class="department-item " id="department-item-' + i + '">' + result[i].deptName + '</div>'
                buttons.push({
                    id: 'department-item-' + i,
                    type: 'div',
                    nextFocusRight: '',
                    nextFocusUp: i === 0 ? 'to-detail' : 'department-item-' + (i - 1),
                    nextFocusDown: (RenderParam.backDepIndex > 2 && i === 2) ? 'department-item-add' : 'department-item-' + (i + 1),
                    focusChange: Home.doctorFocus1,
                    beforeMoveChange: pageFunc.leaveAreaDepartment,
                    moveChange: pageFunc.changeDepartment,
                    depId: result[i].deptNo,
                    depName:result[i].deptName,
                    groupId: i,
                    backIndex: i
                })
            }
            if (result.length > 3) {
                str += '<div class="department-item" style="display: none;" id="department-item-add" ></div>' +
                    '<div class="department-item" id="department-item-' + len + '">更多科室</div>'
                buttons.push({
                    id: 'department-item-' + len,
                    type: 'div',
                    nextFocusUp: RenderParam.backDepIndex > 2 ? 'department-item-add' : 'department-item-2',
                    nextFocusDown: 'department-item-add',
                    focusChange: Home.doctorFocus1,
                    click: pageFunc.showMoreDep,
                })
            }

            departArea.innerHTML = str;

            if (RenderParam.backDepIndex && RenderParam.backDepIndex * 1 > 2) {
                buttons.push({
                    id: 'department-item-add',
                    type: 'div',
                    nextFocusUp: 'department-item-2',
                    nextFocusDown: 'department-item-3',
                    focusChange: Home.doctorFocus1,
                    groupId: 'add',
                    beforeMoveChange: pageFunc.leaveAreaDepartment,
                    moveChange: pageFunc.changeDepartment,
                    depId: result[RenderParam.backDepIndex].deptNo,
                    depName: result[RenderParam.backDepIndex].deptName
                })

                G('department-item-add').innerHTML = result[RenderParam.backDepIndex].deptName;
                G('department-item-add').style.display = 'block';
            }
        }else {
            LMEPG.UI.showToast('接口出错了，请联系管理员');
            G('left_arrow').style.display = 'none';
            G('right_arrow').style.display = 'none';
        }
    },
    //渲染医生列表
    renderDoctorList: function (data,groupId,deptNo,deptName) {
        Home.depGroupId = groupId;
        Home.depNo = deptNo;
        var area = G('list-row');
        if (data == null) {
            G('no-result').style.display = 'block';
            G('left_arrow').style.display = 'none';
            G('right_arrow').style.display = 'none';
            docData = '';
            area.innerHTML = '';
        } else {
            G('no-result').style.display = 'none';
            docData = data;
            Home.doctor(data,groupId,deptNo);
        }
    },

    doctor: function (data,groupId,deptNo) {
        var area = G('list-row');
        area.innerHTML = '';
        var str = '';
        var dep_id_list = [];
        var result  = [];
        if (data.length > 1){
            for (var i = 0; i <data.length ; i++) {
                var item = data[i];
                var is_not_exits = dep_id_list.indexOf(item.doctorCode) < 0
                is_not_exits && dep_id_list.push(item.doctorCode)
                is_not_exits && result.push(item)
            }
        }else {
            result = [data];
        }
        Home.doctorMaxPage = Math.ceil(result.length / 6);
        (Home.doctorMaxPage>1 && (Home.doctorPage+1)<Home.doctorMaxPage)
            ?G('right_arrow').style.display = 'block':G('right_arrow').style.display = 'none';
        (Home.doctorPage+1)>1?G('left_arrow').style.display = 'block':G('left_arrow').style.display = 'none';
        var resultData = result.slice((Home.doctorPage*6), (Home.doctorPage+1)*6);
        for (var i = 0; i < resultData.length; i++) {
            str += '<div class="doctor-item" id="doctorItem-' + i + '">\n' +
                '    <div class="doctor-pic">\n' +
                '      <img src="'+g_appRootPath+'/Public/img/hd/AppointmentRegister/V21/doctor.png" style="width: 110px;height: 133px;border-radius: 15px"/>\n' +
                '      <div id="scroll-name-' + i + '" class="doctor-name">' + resultData[i].doctorName + '</div>\n' +
                '      <div class="title">' + resultData[i].title + '</div>\n' +
                '      <div class="department">'+resultData[i].deptName+'</div>\n' +
                '      <div class="title1" style="display: '+(resultData[i].srvType==='02'?'block':'none')+' ">'+(resultData[i].srvType==='02'?'专家':'')+'</div>\n' +
                '    </div>\n' +
                '</div>'
            addButtonsArr.push({
                id: 'doctorItem-' + i,
                type: 'div',
                name:resultData[i].doctorName,
                nextFocusLeft: (i<=0&&Home.doctorPage==0)?'department-item-'+groupId:'doctorItem-'+(i-1),
                nextFocusRight: 'doctorItem-' + (i + 1),
                nextFocusUp:i<3?'to-detail':'doctorItem-' + (i - 3),
                nextFocusDown: 'doctorItem-' + (i + 3),
                backgroundImage: '',
                focusImage: '',
                click: pageFunc.toDoctor,
                focusChange: Home.doctorFocus,
                beforeMoveChange: pageFunc.turnDocPage,
                depId:deptNo,
                depName: resultData[i].deptName,
                scrollId: 'scroll-name-' + i,
                hospitalName: initData.hospitalIdName,
                title: resultData[i].title,
                docNum: resultData[i].doctorCode,
                title1: resultData[i].srvType,
                num: i,
                depGroup: groupId
            })
        }
        LMEPG.BM.addButtons(addButtonsArr);
        area.innerHTML = str;
    },

    initButton: function () {
        buttons.push({
                id: 'record',
                name: '订单记录',
                type: 'div',
                nextFocusLeft: 'patient-admin',
                nextFocusDown: 'to-detail',
                focusChange: Home.doctorFocus,
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                click: pageFunc.toOrderList,
            }, {
                id: 'patient-admin',
                name: '就诊人管理',
                type: 'div',
                nextFocusRight: 'record',
                nextFocusDown: 'to-detail',
                focusChange: Home.doctorFocus,
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                click: pageFunc.toPatientAdmin
            }, {
                id: 'to-detail',
                name: '医院概况',
                type: 'div',
                nextFocusLeft: 'department-item-0',
                nextFocusUp: 'record',
                focusChange: Home.doctorFocus,
                nextFocusDown: 'department-item-0',
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                click: pageFunc.toHospitalDetail,
            }
        )

        LMEPG.BM.init(RenderParam.hosId?RenderParam.hosId:"department-item-0", buttons, "", true);

    },
    doctorFocus: function (btn, hasFocus) {
        var doctor_focus = G(btn.id);
        if (hasFocus) {
            doctor_focus.style.backgroundColor = '#17a1e5';
            doctor_focus.style.color = '#fff';
        } else {
            doctor_focus.style.backgroundColor = '';
            doctor_focus.style.color = '#fff';
        }
    },
    doctorFocus1: function (btn, hasFocus) {
        var doctor_focus = G(btn.id);
        if (hasFocus) {
            doctor_focus.style.backgroundColor = '#17a1e5';
            doctor_focus.style.color = '#fff';
            LMEPG.CssManager.removeClass(doctor_focus, "test-tab-f");

        } else {
            doctor_focus.style.backgroundColor = "";
            doctor_focus.style.color = '#fff';
        }
    },

}

var pageFunc = {
    //当前页面
    getCurrentPage: function () {
        var cur = LMEPG.Intent.createIntent("qinghai-index");
        cur.setParam("HospitalId", RenderParam.hospitalId);
        cur.setParam('backDepIndex', RenderParam.backDepIndex);
        cur.setParam('depBackIndex', RenderParam.depBackIndex);
        return cur;
    },
    turnDocPage: function (dir, pre) {
        if (dir === 'right') {
            if ((pre.id === 'doctorItem-2' || pre.id === 'doctorItem-5')&&(Home.doctorPage+1)<Home.doctorMaxPage){
                Home.doctorPage++;
                Home.doctor(docData,Home.depGroupId,Home.depNo);
                LMEPG.BM.requestFocus('doctorItem-0');
                return false;
            }
        }else if (dir === 'left'){
            if ((pre.id === 'doctorItem-0' || pre.id === 'doctorItem-3')&&(Home.doctorPage+1)>1){
                Home.doctorPage--;
                Home.doctor(docData,Home.depGroupId,Home.depNo);
                LMEPG.BM.requestFocus('doctorItem-2');
                return false;
            }
        }else if (dir === 'up' && (0<=pre.num<=3)) {
            LMEPG.CssManager.removeClass(G('department-item-'+pre.depGroup), "test-tab-f");
        }
    },

    //订单记录
    toOrderList: function (btn) {
        var toPage = LMEPG.Intent.createIntent("qinghai-order-list");
        var currentPage = LMEPG.Intent.createIntent("qinghai-index");
        currentPage.setParam('backIndex', RenderParam.backIndex);
        currentPage.setParam('hosId', btn.id);
        LMEPG.Intent.jump(toPage, currentPage);
    },
    //就诊人管理
    toPatientAdmin: function (btn) {
        var toPage = LMEPG.Intent.createIntent("qinghai-choose-people");
        var currentPage = LMEPG.Intent.createIntent("qinghai-index");
        currentPage.setParam('backIndex', RenderParam.backIndex);
        currentPage.setParam('hosId', btn.id);
        toPage.setParam('manage', '1');

        LMEPG.Intent.jump(toPage, currentPage);
    },
    //医院概况
    toHospitalDetail: function (btn) {
        var toPage = LMEPG.Intent.createIntent("qinghai-hospital-intro");
        var currentPage = pageFunc.getCurrentPage();
        currentPage.setParam('backIndex', RenderParam.backIndex);
        currentPage.setParam('hosId', btn.id);

        toPage.setParam("HospitalId", RenderParam.hospitalId);

        LMEPG.Intent.jump(toPage, currentPage);
    },
    //科室列表焦点跳转到医生上
    leaveAreaDepartment: function (dir, btn) {
        RenderParam.depBackIndex = btn.backIndex;
        if (dir === 'right' && docData) {
            setTimeout(function () {
                LMEPG.CssManager.addClass(btn.id, "test-tab-f");
                LMEPG.BM.requestFocus(shouldBackDoc);
                Home.depCode = btn.depId;
            })
        }
    },

    changeDepartment: function (pre, cur, dir) {
        if (((dir === 'up' || dir === 'down') && cur.id !== 'department-item-3') ||
            (dir === 'left' && pre.id === 'to-detail')) {
            Home.doctorPage = 0;
            var dep_id_list = [];
            var result  = [];
            for (var i = 0; i <initData.department.length ; i++) {
                var item = initData.department[i];
                var is_not_exits = dep_id_list.indexOf(item.deptNo) < 0;
                is_not_exits && dep_id_list.push(item.deptNo);
                is_not_exits && result.push(item);
            }
            RenderParam.backDepIndex = cur.backIndex;
            depAreaId = cur.id;
            shouldBackDoc = 'doctorItem-0';
            var deptCode = result[cur.backIndex].deptNo;
            Home.getHospitalDoctor(deptCode,function (res){
                Home.renderDoctorList(res,cur.groupId,deptCode,cur.deptName);
            })
        }
    },
    //医生详情页面
    toDoctor: function (btn) {
        var depGroupId = Home.depGroupId=='add'
            ?'':'department-item-' + Home.depGroupId;
        var toPage = LMEPG.Intent.createIntent("qinghai-doctor-order");
        var currentPage = pageFunc.getCurrentPage();

        toPage.setParam("HospitalId", RenderParam.hospitalId);
        toPage.setParam("code", btn.depId);
        toPage.setParam("HospitalName", initData.hospitalIdName);
        toPage.setParam("DepName", btn.depName);
        toPage.setParam('DocName',btn.name);
        toPage.setParam('title',btn.title);
        toPage.setParam('DocNum',btn.docNum);
        toPage.setParam('title1',btn.title1);

        currentPage.setParam('depCode',Home.depCode)
        currentPage.setParam('hosId',depGroupId);

        LMEPG.Intent.jump(toPage, currentPage);
    },
    //更多科室展示
    showMoreDep: function () {
        var dep_id_list = [];
        var result  = [];
        for (var i = 0; i <initData.department.length ; i++) {
            var item = initData.department[i];
            var is_not_exits = dep_id_list.indexOf(item.deptNo) < 0
            is_not_exits && dep_id_list.push(item.deptNo)
            is_not_exits && result.push(item)
        }
        G('all-dep-area').scrollTop = 0;

        var buttonDep = [];
        var html = '';
        var left = 5 - Math.ceil(result.length % 20 / 5);
        var hasLeft = (result.length % 5);
        var line = Math.ceil(result.length / 5);

        for (var i = 0; i < result.length; i++) {
            var x = parseInt(i / 5);
            var y = i % 5;
            html += '<div class="dep" style="font-size: 20px" id="dep-' + x + '-' + y + '">' + result[i].deptName + '</div>'

            buttonDep.push({
                id: 'dep-' + x + '-' + y,
                type: 'div',
                nextFocusLeft: y === 0 ? '' : 'dep-' + x + '-' + (y - 1),
                nextFocusRight: 'dep-' + x + '-' + (y + 1),
                nextFocusUp: 'dep-' + (x - 1) + '-' + y,
                nextFocusDown: (x + 1 === line - 1 && y + 1 > (hasLeft - 1) && hasLeft !== 0) ? 'dep-' + (line - 1) + '-' + (hasLeft - 1) : 'dep-' + (x + 1) + '-' + y,
                backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/box2.png',
                click: pageFunc.chooseDep,
                name:result[i].deptName,
                // depId:initData.department[i].DepId,
                moveChange: pageFunc.turnDepPage,
                focusChange: Home.doctorFocus,
                backIndex: i
            })
        }

        LMEPG.BM.addButtons(buttonDep);

        html +=
            '<div style="clear: both"></div>' +
            '<div style="height:' + (left * 60) + 'px"></div>'

        G('all-dep-area').innerHTML = html;
        G('more-dep').style.display = 'block';

        var x = Utils.getX(openDepFocusId);

        G('all-dep-area').scrollTop = parseInt(x / 4) * 240;
        LMEPG.BM.requestFocus(openDepFocusId);
    },
    //点击更多科室里的科室之后做的操作
    chooseDep: function (btn) {
        var dep_id_list = [];
        var result  = [];
        for (var i = 0; i <initData.department.length ; i++) {
            var item = initData.department[i];
            var is_not_exits = dep_id_list.indexOf(item.deptNo) < 0
            is_not_exits && dep_id_list.push(item.deptNo)
            is_not_exits && result.push(item)
        }
        console.log(result,'result--更多科室');
        var deptCode = result[btn.backIndex].deptNo;
        if (0<=btn.backIndex && btn.backIndex<=2) {
            G('more-dep').style.display = 'none';
            openDepFocusId = btn.id;
            Home.getHospitalDoctor(deptCode,function (resData){
                Home.renderDoctorList(resData,btn.backIndex,deptCode,btn.deptName);
            });

            RenderParam.backDepIndex = btn.backIndex;
            LMEPG.BM.requestFocus('department-item-'+btn.backIndex);
        }else {
            G('more-dep').style.display = 'none';
            G('department-item-add').innerHTML = btn.name;
            G('department-item-add').style.display = 'block';
            openDepFocusId = btn.id;
            Home.getHospitalDoctor(deptCode,function (resData){
                Home.renderDoctorList(resData,'add',deptCode,btn.deptName);
            })
            LMEPG.BM.deleteButtons('department-item-3');
            LMEPG.BM.deleteButtons('department-item-2');

            LMEPG.BM.addButtons([{
                id: 'department-item-add',
                type: 'div',
                nextFocusUp: 'department-item-2',
                nextFocusDown: 'department-item-3',
                focusChange: Home.doctorFocus1,
                groupId: 'add',
                depId:result[btn.backIndex].deptNo,
                depName: btn.name,
                backIndex: btn.backIndex,
                beforeMoveChange: pageFunc.leaveAreaDepartment,
                moveChange: pageFunc.changeDepartment,
            }, {
                id: 'department-item-3',
                type: 'div',
                nextFocusUp: 'department-item-add',
                focusChange: Home.doctorFocus1,
                click: pageFunc.showMoreDep,
                moveChange: pageFunc.changeDepartment,
            }, {
                id: 'department-item-2',
                type: 'div',
                nextFocusRight: 'doctorItem-0',
                nextFocusUp: 'department-item-1',
                nextFocusDown: 'department-item-add',
                beforeMoveChange: pageFunc.leaveAreaDepartment,
                focusChange: Home.doctorFocus1,
                moveChange: pageFunc.changeDepartment,
                depId: result[2].deptNo,
                depName:result[2].name,
                groupId: 2,
                backIndex: 2
            }])

            LMEPG.BM.requestFocus('department-item-add');
        }
    },
    //应该是控制更多科室里的科室移动的函数
    turnDepPage: function (pre, cur, dir) {
        //判断如果名字太长需要滚动
        if (pre.name && pre.name.length > 6) {
            LMEPG.UI.Marquee.stop();
        }

        if (cur.name.length > 6) {
            LMEPG.UI.Marquee.start(cur.id, 5);
        }

        var x = Utils.getX(cur.id);
        if (dir === 'down' && x !== 0) {
            if (x % 4 === 0) {
                G('depArea').scrollTop += 240;
            }
        } else if (dir === 'up') {
            if (Utils.getX(pre.id) % 4 === 0) {
                G('depArea').scrollTop -= 240;
            }
        }
    },
}

var Utils = {
    getStyleValue: function (str) {
        return str.substring(0, str.indexOf('p')) * 1;
    },
    getX: function (x) {
        var num = x.indexOf('-');
        var lastNum = x.lastIndexOf('-');
        return parseInt(x.substring(num + 1, lastNum));
    },
}

//控制更多科室的关闭与开启
function onBack() {
    if (G('more-dep').style.display === 'block') {
        G('more-dep').style.display = 'none';
        LMEPG.BM.requestFocus('department-item-3');
    } else {
        LMEPG.Intent.back();
    }
}