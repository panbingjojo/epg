var buttons = [];

var initData = {
    department: [],
    hospitalIdName: '',
}
var date1 = [];
var date2 = [];
var times1 = '';
var times2 = '';
var startDay = 0;
var endDay = 4;
var dataExists = false;
var cost = '';
var depCode = '';
var remainderNum = '';
var specificTime = [];

var timeResultList = [];
var Home = {
    groupId: '',
    init: function () {
        Home.renderDoctorInfo();
        Home.renderTime();
        LMEPG.BM.init((RenderParam.backId || 'dayTime-0'), buttons, true);
    },

    getOrderInfo: function (res) {
        res = (res instanceof Array) ? res : [res]
        if (res.length > 1) {
            cost = res[0].cost;
            console.log(cost,'挂号费');
            remainderNum = '';
            timeResultList = [];
            for (var i =0;i<res.length;i++) {
                specificTime.push({
                    id_sch:res[i].id_sch,
                    remainderNum: res[i].remainderNum
                })
            }
            Home.getTimeList(0,res,res.length);
        } else if (res.length === 0 || res[0] === null) {
            Home.renderOrderList();
        } else {
            depCode = res[0].deptCode;
            cost = res[0].cost;
            console.log(cost,'挂号费');
            remainderNum = res[0].remainderNum;
            for (var i =0;i<res.length;i++) {
                specificTime.push({
                    id_sch:res[i].id_sch,
                    remainderNum: res[i].remainderNum
                })
            }
            Home.getOrderTime(res[0].id_sch, function (res) {
                Home.renderOrderList(res, (RenderParam.backDepIndex || 0));
            })
        }
        console.log(specificTime,'specificTime')
    },

    getTimeList: function(i,data,length) {
        depCode = data[i].deptCode;
        Home.getOrderTime(data[i].id_sch,function (res1) {
            timeResultList = timeResultList.concat(res1);
            if (i<length-1) {
                Home.getTimeList(i+1,data,length);
                times1 = data[i].remainderNum;
                times2 = data[i].remainderNum;
            }else {
                Home.renderOrderList(timeResultList,(RenderParam.backDepIndex || 0))
            }
        })
    },

    // 预约时间
    getOrderId: function (time1, success) {
        var data = {
            "deptCode": RenderParam.code + "",
            "beginDate": time1,
            "endDate": time1,
        };

        LMEPG.ajax.postAPI('AppointmentRegister/getDoctorInfo', data, function (res) {
            success(res.data);
            console.log(res.data,'---------------预约时间');
        }, function () {

        });
    },


    getOrderTime: function (id_sch, success) {
        var data = {
            'schIds': id_sch + ''
        };
        console.log(id_sch,'id_sch')
        LMEPG.ajax.postAPI('AppointmentRegister/getOrderTime', data, function (res) {
            if (res.result === 0) {
                success(res.data);
                console.log(res,'时间信息');
            }
        }, function () {
            dataExists = false;
        });
    },

    //渲染医生介绍
    renderDoctorInfo: function () {
        G('name').innerText = RenderParam.docName;
        G('hospital-name').innerText = RenderParam.hospitalName;
        G('title').innerText = RenderParam.title;
        G('depName').innerText = RenderParam.depName;
        G('introduce').innerText = '暂无';
        if (RenderParam.docName.length > 4) {
            LMEPG.UI.Marquee.start('name', 5);
        }
        if(RenderParam.depName > 6) {
            LMEPG.UI.Marquee.start('depName', 5);
        }
        RenderParam.title1==='02'?G('title1').style.display = 'block':'';
    },

    //渲染时间
    renderTime: function () {
        for (var i = 0; i < 7; i++) {
            var date = new Date();
            date.setDate(date.getDate() + i);
            var today = date.format("yyyy-MM-dd");
            var today1 = date.format('MM月dd日');
            date1.push(today);
            date2.push(today1);
        }
        Home.rendDayTime(0,4);
    },

    //时间日期
    rendDayTime: function (startDay1, endDay1) {
        startDay===0?G('left-arrow').style.display = 'none':G('left-arrow').style.display = 'block';
        endDay <5?G('right-arrow').style.display = 'block':G('right-arrow').style.display = 'none';
        var dayTime = date2.slice(startDay1, endDay1);
        var today = date1.slice(startDay1,endDay1);
        var timeButtons = [];
        var html = '';
        for (var i = 0; i < dayTime.length; i++) {
            html += '<div id = "dayTime-' + i + '" class="order-state">' + dayTime[i] + '</div>'
            timeButtons.push({
                id: 'dayTime-' + i ,
                type: 'div',
                nextFocusLeft: 'dayTime-' + (i - 1),
                nextFocusDown: 'item-0-0',
                nextFocusRight: 'dayTime-' + (i + 1),
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/blue.png',
                backgroundImage: '',
                focusChange: Home.doctorFocus1,
                beforeMoveChange: Page.turnDocPage,
                today: today[i],
                groupId: i,
            })
        }
        html += '<div style="clear: both"></div>';
        G('time-area').innerHTML = html;
        LMEPG.BM.addButtons(timeButtons);
    },

    //渲染每天预约时间
    renderOrderList: function (data, groupId) {
        G('appointment').innerHTML = '';
        Home.groupId = 'dayTime-' + groupId;
        var addButtonsArr = [];
        var html = '';
        if (data == null || typeof data == "undefined") {
            dataExists = false;
            G('no-result').style.display = 'block'
            addButtonsArr.push({
                id: 'doctor-info',
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: ' ',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/order-list-choose.png',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: Page.turnPage,
            })
            LMEPG.BM.addButtons(addButtonsArr);
            LMEPG.UI.dismissWaitingDialog();
        } else {
            dataExists = true;
            G('no-result').style.display = 'none';
            console.log(data,'data1111')
            console.log(initData.department,'initData.department')
            for (var i = 0; i < data.length; i++) {
                var x = parseInt(i / 3);
                var y = i % 3;

                html += ' <div class="order-time"  style="width: 256px;height: 80px;background: url(' + Utils.getFlag(data[i].fg_apptable).noUrl + ')">\n' +
                    '         <div id="item-' +x+'-'+y+ '"  class="order-time1" style="width: 170px;height: 80px">\n' +
                    '               <div class="order-info"">' + data[i].start_time + '-' + data[i].end_time + '</div>\n' +
                    '          </div>\n' +
                    '    </div>'

                addButtonsArr.push({
                    id: 'item-' +x+'-'+y,
                    type: 'div',
                    nextFocusLeft: 'item-' +x+'-'+(y-1),
                    nextFocusRight: 'item-' +x+'-'+(y+1),
                    nextFocusUp: x===0 ? 'dayTime-' + groupId : 'item-' +(x-1)+'-'+y,
                    nextFocusDown: 'item-' +(x+1)+'-'+y,
                    // backgroundImage: Utils.getFlag(initData.department.remainderNum).noUrl,
                    focusImage: '',
                    click: Page.toOrder,
                    focusChange: Home.doctorFocus,
                    moveChange: Page.turnDepPage,
                    idSch: data[i].schId,
                    tickId: data[i].code,
                    remainderNum: remainderNum,
                    appointment_start: data[i].start_time,
                    appointment_end: data[i].end_time,
                    today: initData.department.length >1?initData.department[0].schDate:initData.department.schDate,
                    appointmentType: data[i].fg_apptable
                })
            }

            addButtonsArr.push({
                id: 'doctor-info',
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: ' ',
                focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/order-list-choose.png',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: Page.turnPage,
                // max:data.length-1
            })


            html += '<div style="clear: both"></div>';

            LMEPG.BM.addButtons(addButtonsArr);

            G('appointment').innerHTML = html;
            LMEPG.UI.dismissWaitingDialog();
            // LMEPG.BM.init((RenderParam.backId || 'dayTime-0'),buttons,true)
        }
    },

    //是不是就能把变颜色的删除
    doctorFocus: function (btn, hasFocus) {
        var doctor_focus = G(btn.id);
        if (hasFocus) {
            doctor_focus.style.backgroundColor = '#17a1e5';
            doctor_focus.style.color = '#fff';
            LMEPG.CssManager.removeClass(doctor_focus, "test-tab-f");
        } else {
            doctor_focus.style.backgroundColor = '';
            doctor_focus.style.color = '#fff';
        }
    },

    doctorFocus1: function (btn, hasFocus) {
        var doctor_focus = G(btn.id);
        if (hasFocus) {
            specificTime = [];
            LMEPG.UI.showWaitingDialog();
            doctor_focus.style.color = '#fff';
            RenderParam.backDepIndex = btn.groupId;
            var tempArr = [];
            Home.getOrderId(btn.today, function (res) {
                if (res != null){
                    initData.department = res;
                    res = (res instanceof Array) ? res : [res];
                    for (var i = 0;i<res.length;i++) {
                        if (RenderParam.docNum === res[i].doctorCode) {
                            tempArr.push(res[i]);
                        }
                    }
                    Home.getOrderInfo(tempArr);
                }else {
                    initData.department = res;
                    Home.getOrderInfo(res);
                }
            })
            LMEPG.CssManager.removeClass(doctor_focus, "test-tab-f");
        } else {
            doctor_focus.style.background = '';
            doctor_focus.style.color = '#FFF';
        }
    }
}

var Page = {
    turnPage: function (pre, cur, dir) {
        if (dir === 'up') {
            if (G('introduce').scrollTop === 0) {
                LMEPG.BM.requestFocus('item-' + cur.max);
            } else {
                G('introduce').scrollTop -= 50;
            }
        } else if (dir === 'down') {
            G('introduce').scrollTop += 50;
        }
    },

    toOrder: function (btn) {
        var info = '';
        console.log(specificTime,'////////////////////')
        for (var i =0;i<specificTime.length;i++) {
            if (specificTime[i].id_sch === btn.idSch) {
                info = specificTime[i].remainderNum;
                break;
            }
        }
        // 判断当前位号所对应的排班号所对应的号还有没有
        if ((btn.remainderNum > 0 || info>0)&&btn.appointmentType==='1') {
            var curPage = LMEPG.Intent.createIntent("qinghai-doctor-order");
            var toPage = LMEPG.Intent.createIntent("qinghai-add-order");
            curPage.setParam('DocName', RenderParam.docName);
            curPage.setParam('code', RenderParam.code);
            curPage.setParam('HospitalName', RenderParam.hospitalName);
            curPage.setParam('title', RenderParam.title);
            curPage.setParam('DepName', RenderParam.depName);
            curPage.setParam('DocNum', RenderParam.docNum);
            curPage.setParam('title1',RenderParam.title1);
            curPage.setParam('backId',Home.groupId);
            curPage.setParam('depCode',depCode);

            toPage.setParam('HospitalName', RenderParam.hospitalName);
            toPage.setParam('DoctorName', RenderParam.docName);
            toPage.setParam('DateTime', btn.today);
            toPage.setParam('DepName', RenderParam.depName);
            toPage.setParam('StartTime', btn.appointment_start);
            toPage.setParam('EndTime', btn.appointment_end);
            toPage.setParam('title1',RenderParam.title1);
            toPage.setParam('cost',cost);
            toPage.setParam('id_sch',btn.idSch);
            toPage.setParam('tickId',btn.tickId);
            toPage.setParam('docNum', RenderParam.docNum);
            toPage.setParam('depCode', depCode);

            LMEPG.Intent.jump(toPage, curPage);
            LMEPG.UI.showWaitingDialog();
        } else {
            LMEPG.UI.showToast("当前暂时不接受预约", 1.5);
        }

    },

    turnDepPage:function (pre,cur,dir){
        if(dir === 'down'){
            if(G(pre.id).getBoundingClientRect().top >= 290 && G(pre.id).getBoundingClientRect().top <= 300){
                G('timeList').scrollTop += 180;
            }
        }else if(dir === 'up'){
            if (G(pre.id).getBoundingClientRect().top >= 200 && G(pre.id).getBoundingClientRect().top <= 210) {
                G('timeList').scrollTop -= 180;
            }
        }
    },

    turnDocPage: function (dir, pre) {
        if (dir === 'right') {
            if (pre.id == 'dayTime-3') {
                startDay += 4, endDay += 4
                Home.rendDayTime(startDay, endDay)
                LMEPG.BM.requestFocus('dayTime-0')
                return false
            }
        } else if (dir === 'left') {
            if (pre.id == 'dayTime-0' && startDay - 4 >= 0) {
                startDay -= 4, endDay -= 4
                Home.rendDayTime(startDay, endDay)
                LMEPG.BM.requestFocus('dayTime-3')
                return false
            }
        } else if (dir === 'down' && dataExists) {
            LMEPG.CssManager.addClass(pre.id, "test-tab-f");
            LMEPG.BM.requestFocus('item-0-0')
            return false
        }
    },
}

var Utils = {
    getFlag: function (type) {
        if (type === '1') {
            return {
                noUrl: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/can.png',
            }
        } else if (type === '0') {
            return {
                noUrl: g_appRootPath + '/Public/img/hd/AppointmentRegister/V21/pause.png',
            }
        } else {
            return {
                noUrl: g_appRootPath + "/Public/img/hd/AppointmentRegister/V21/full.png",
            }
        }
    },
}
