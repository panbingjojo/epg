var buttons = [];
var startPage = 0;
var endPage = '';
var groupId = '';
var data = [];
var patSex = '';
var patCard = '';
var Home = {
    maxPage: '',
    page: 0,
    res: [],
    sex: '',
    data: [],
    init: function () {
        Home.getPeopleList(function (res) {
            Home.res = res;
            Home.renderPatientList();
            LMEPG.BM.init((RenderParam.backIndex?'patient_'+RenderParam.backIndex:'patient_0'), buttons, true)
        });
    },

    /**
     * 渲染预约列表
     * */
    renderOrderList: function () {
        G('list').innerHTML = '';
        G('records').innerHTML = '';
        var itemUrl = g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/order-list.png'
        var html = '';
        var timeButtons = [];
        if (data.result!==0) {
            Home.data = data.data;
            G('tips').style.display = 'block';
        } else {
            if (data.data.length==0) {
                G('tips').style.display = 'block';
            }else {
                Home.data = data.data;
                endPage = Math.ceil(data.data.length/3);
                var result = data.data.slice(startPage*3,(startPage+1)*3);
                G('tips').style.display = 'none';
                for (var i = 0; i < result.length; i++) {
                    html += ' <div class="order-item" id="order-' + i + '" style="background-image: url(' + itemUrl + ')">\n' +
                        '       <div class="hospital_name">预约医院：西宁市中医院</div>\n' +
                        '       <div class="dep">预约科室：' + result[i].deptName + '</div>\n' +
                        '       <div class="doctor_name">预约医生：' + result[i].resName + '</div>\n' +
                        '       <div class="dayTime">预约时间：' + (result[i].entTime+' '+Home.formattingTime(result[i].t_b_tick)+'-'+Home.formattingTime(result[i].t_e_tick)) + '</div>\n' +
                        '       <div class="state">' + (result[i].status === '7' ? '已取消' : '预约成功') + '</div>\n' +
                        '   </div>'

                    timeButtons.push({
                        id: 'order-' + i,
                        type: 'div',
                        nextFocusLeft: '',
                        nextFocusRight: '',
                        nextFocusUp: i === 0?(groupId?'patient_'+groupId:'patient_0'):'order-' + (i - 1),
                        nextFocusDown: 'order-' + (i + 1),
                        backgroundImage: '',
                        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/order-list.png',
                        click: Home.chooseOrder,
                        focusChange: Home.doctorFocus,
                        beforeMoveChange: Home.turnPage,
                        backIndex: i,
                        docName: result[i].resName,
                        depName: result[i].deptName,
                        name: result[i].patName,
                        num: result[i].mobile,
                        payWay: result[i].payWay,
                        payMoney: result[i].amtPat,
                        payNum: result[i].paymodeno,
                        payTime: result[i].oprTime,
                        id_apt: result[i].id_apt,
                        startTime: result[i].t_b_tick,
                        endTime: result[i].t_e_tick,
                        status: result[i].status,
                        orderTime: result[i].entTime,
                    })
                }
                G('list').innerHTML = html;
                G('list').style.display = 'block';
                G('records').innerHTML = '共'+data.data.length+'条数据';
                LMEPG.BM.addButtons(timeButtons);
                LMEPG.UI.dismissWaitingDialog();
            }
        }
        LMEPG.UI.dismissWaitingDialog();
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

    /**
     * 获取订单列表信息
     * */
    getOrderList: function (patientId,success) {
        LMEPG.UI.showWaitingDialog();

        var data = {
            'patCode':patientId,
            'beginDate': Home.getStartTime(),
            'endDate': Home.getEndTime()
        };
        LMEPG.ajax.postAPI("AppointmentRegister/getOrderList", data, function (data){
            console.log(data.data,'订单列表信息')
            success(data)
        })
    },
    getStartTime:function() {
        var startTime = new Date();
        startTime.setFullYear(startTime.getFullYear() - 1);
        console.log(startTime.format('yyyy-MM-dd'));
        return startTime.format('yyyy-MM-dd');
    },
    getEndTime:function () {
        var date1 = new Date()
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()+7);
        var endTime = date2.getFullYear()+"-"+((date2.getMonth()+1)>10?
            (date2.getMonth()+1):'0'+(date2.getMonth()+1))+"-"+date2.getDate();
        console.log(endTime)
        return endTime;
    },

    /**
     * 渲染就诊人列表
     * */
    renderPatientList: function () {
        if (Home.res.length!==0) {
            G('name_area').innerHTML = '';
            Home.maxPage = Math.ceil(Home.res.length/4);
            Home.maxPage>1&&Home.maxPage>(Home.page+1)?G('right-arrow').style.display='block':G('right-arrow').style.display='none';
            Home.page>=1?G('left-arrow').style.display='block':G('left-arrow').style.display='none';
            var patientList = Home.res.slice(Home.page * 4, (Home.page+1)*4);
            var timeButtons = [];
            var html = '';
            for (var i = 0; i < patientList.length; i++) {
                html += '<div id = "patient_' + i + '" class="order-state">' + patientList[i].patient_name + '</div>'
                timeButtons.push({
                    id: 'patient_' + i,
                    type: 'div',
                    nextFocusDown: 'order-0',
                    nextFocusLeft: 'patient_' + (i - 1),
                    nextFocusRight: 'patient_' + (i + 1),
                    focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/blue.png',
                    focusChange: Home.doctorFocus1,
                    beforeMoveChange: Home.turnDocPage,
                    patientId: patientList[i].patient_id,
                    groupId: i,
                    card: patientList[i].patientid_card,
                    sex: patientList[i].sex,
                })
            }
            html += '<div style="clear: both"></div>';
            G('name_area').innerHTML = html;
            LMEPG.BM.addButtons(timeButtons);
        }else {
            G('name_area').innerHTML = '';
            G('tips').style.display = 'block';
            G('right-arrow').style.display = 'none';
            G('left-arrow').style.display = 'none';
        }
    },
    turnDocPage: function (dir , pre){
        if (dir === 'right' && Home.page < Home.maxPage) {
            if (pre.id === 'patient_3') {
                Home.page++;
                Home.renderPatientList();
                LMEPG.BM.requestFocus('patient_0');
                return false;
            }
        } else if (dir === 'left' && Home.page > 0) {
            if (pre.id === 'patient_0') {
                Home.page--;
                Home.renderPatientList();
                LMEPG.BM.requestFocus('patient_3');
                return false;
            }
        } else if (dir === 'down' && Home.data.length !== 0) {
            LMEPG.CssManager.addClass(pre.id, "test-tab-f");
        }
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
        groupId = btn.groupId;
        if (hasFocus) {
            patSex = btn.sex;
            patCard = btn.card;
            var patientId = btn.patientId;
            console.log(patientId);
            LMEPG.UI.showWaitingDialog();
            // 获取可退订列表
            Home.getOrderList(patientId,function (res) {
                data = res;
                console.log(data,'**************')
                Home.renderOrderList();
            });
            doctor_focus.style.color = '#fff';
            LMEPG.CssManager.removeClass(doctor_focus, "test-tab-f");
        } else {
            doctor_focus.style.background = '';
            doctor_focus.style.color = '#FFF';
        }
    },
    formattingTime: function (time) {
        return time?time.slice(0,-3):'';
    },
    isPayWay: function (data) {
        if (data==='4'){
            return '微信';
        }  else {
            return '支付宝';
        }
    },

    chooseOrder:function (btn){
        // 将接口获取到的数据传入订单详情页面
        var curPage = LMEPG.Intent.createIntent("qinghai-order-list");
        var toPage = LMEPG.Intent.createIntent("qinghai-order-details");
        toPage.setParam('doctorName',btn.docName);
        toPage.setParam('depName',btn.depName);
        toPage.setParam('name',btn.name);
        toPage.setParam('card',patCard);
        toPage.setParam('sex',patSex);
        toPage.setParam('num',btn.num);
        toPage.setParam('payWay',Home.isPayWay(btn.payNum.charAt(0)));
        toPage.setParam('payMoney',btn.payMoney);
        toPage.setParam('payNum',btn.payNum);
        toPage.setParam('isOrderList','1');
        toPage.setParam('payTime',btn.payTime);
        toPage.setParam('id_apt',btn.id_apt);
        toPage.setParam('startTime',Home.formattingTime(btn.startTime));
        toPage.setParam('endTime',Home.formattingTime(btn.endTime));
        toPage.setParam('status',btn.status);
        toPage.setParam('dateTime',btn.orderTime);
        toPage.setParam('title1','');

        curPage.setParam('backIndex',groupId);

        LMEPG.Intent.jump(toPage,curPage);
    },

    turnPage:function (dir , pre){
        if (dir === 'down' && (startPage+1) < endPage) {
            if (pre.id === 'order-2') {
                startPage++;
                Home.renderOrderList();
                LMEPG.BM.requestFocus('order-0');
                return false;
            }
        } else if (dir === 'up' && startPage > 0) {
            if (pre.id === 'order-0') {
                startPage--;
                Home.renderOrderList();
                LMEPG.BM.requestFocus('order-2');
                return false;
            }
        }
    },

    getX:function (x){
        var num = x.indexOf('-')
        return parseInt(x.substring(num+1))
    },

}


