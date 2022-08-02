// 定义全局按钮
var buttons = [];

// 全局变量，记录当前选中的时间html id
var curFocusId;
// 记录当前选择的时间
var curSelectedDate;

// 返回按键
function onBack() {
    Page.onBack();
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("appointmentTime");
        currentPage.setParam("hospital_id", RenderParam.hospital_id);
        currentPage.setParam("department_id", RenderParam.department_id);
        currentPage.setParam("doctor_id", RenderParam.doctor_id);
        currentPage.setParam("date", RenderParam.date);
        currentPage.setParam("on_line", RenderParam.on_line);
        currentPage.setParam("date_index", RenderParam.date_index);
        currentPage.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
        currentPage.setParam("page", Doctor.page);
        currentPage.setParam("name", RenderParam.name);
        return currentPage;
    },

    /**
     * 返回事件
     */
    onBack: function () {
        LMEPG.Intent.back();
    }
};

var Home = {
    defaultFocusId: "data-" + (parseInt(RenderParam.date_index) + 1),
    //页面初始化操作
    init: function () {
        curSelectedDate = Doctor.getDay(0)[3] + "-" + Doctor.getDay(0)[0] + "-" + Doctor.getDay(0)[1];
        Home.initRenderAll();
        Doctor.createSevenDays(7);
        Home.initButtons();                 // 初始化焦点按钮

        var page = RenderParam.page;
        for (var i = 0; i < page; i++) {
            Doctor.nextPage();
        }

        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        LMEPG.BM.init(lastFocusId, buttons, "", true);
        curFocusId = this.defaultFocusId;
        LMEPG.BM.setSelected(curFocusId, true);
        LMEPG.CssManager.addClass(curFocusId, "btn-selected");
        LMEPG.BM.requestFocus(lastFocusId);
    },

    initRenderAll: function () {
        if (RenderParam.detail.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            return;
        }
        Doctor.createTime(RenderParam.detail.number_list.list);
        Doctor.createDoctorDetail();
    },

    initButtons: function () {
        buttons.push({
            id: 'btn-introduce',
            name: '医生简介',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'data-1',
            nextFocusUp: 'data-1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            click: Home.goDoctorProfile,
            focusChange: Home.departFocus,
            beforeMoveChange: "",
            cType: "region",
        });
        for (var i = 0; i < Doctor.count; i++) {
            buttons.push({
                id: 'time-' + (i + 1),
                name: '科室选择',
                type: 'div',
                nextFocusLeft: i == 0 ? 'btn-introduce' : 'time-' + i,
                nextFocusRight: 'time-' + (i + 2),
                nextFocusUp: 'time-' + ((i + 1) - 5),
                nextFocusDown: 'time-' + ((i + 1) + 5),
                backgroundImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/f_number.png",
                focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/bg_number.png",
                click: Home.goPhoneCode,
                focusChange: Home.departFocus,
                beforeMoveChange: Home.onRecommendBeforeMoveChange,
            });
        }
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                if (current.id == "time-1" || current.id == "time-2" || current.id == "time-3" || current.id == "time-4" || current.id == "time-5") {
                    if (Doctor.page == 0) {
                        var currentId = LMEPG.BM.getSelectedButton("data").id;
                        LMEPG.BM.requestFocus(currentId);
                    } else {
                        var isGoNext = Doctor.prevPage();
                        if (isGoNext) {
                            if (current.id == "time-1")
                                LMEPG.BM.requestFocus("time-11");
                            else if (current.id == "time-2")
                                LMEPG.BM.requestFocus("time-12");
                            else if (current.id == "time-3")
                                LMEPG.BM.requestFocus("time-13");
                            else if (current.id == "time-4")
                                LMEPG.BM.requestFocus("time-14");
                            else if (current.id == "time-5")
                                LMEPG.BM.requestFocus("time-15");
                        }
                        return false;
                    }
                }
                break;
            case 'down':
                if (current.id.substring(0, 4) == "data") {
                    // LMEPG.CssManager.addClass(current.id, "btn-selected");
                    LMEPG.BM.requestFocus("time-1");
                    return false;
                }
                if (current.id == "time-11" || current.id == "time-12" || current.id == "time-13" || current.id == "time-14" || current.id == "time-15") {
                    var isGoNext = Doctor.nextPage();
                    if (isGoNext) {
                        if (current.id == "time-11") {
                            LMEPG.BM.requestFocus("time-1");
                        } else if (current.id == "time-12") {
                            LMEPG.BM.requestFocus("time-2");
                            if (Doctor.page == Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1 &&
                                RenderParam.detail.number_list.list.length % Doctor.count < 2) {
                                LMEPG.BM.requestFocus("time-1");
                            }
                        } else if (current.id == "time-13") {
                            LMEPG.BM.requestFocus("time-3");
                            if (Doctor.page == Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1 &&
                                RenderParam.detail.number_list.list.length % Doctor.count < 2) {
                                LMEPG.BM.requestFocus("time-1");
                            } else if (Doctor.page == Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1 &&
                                RenderParam.detail.number_list.list.length % Doctor.count < 3) {
                                LMEPG.BM.requestFocus("time-2");
                            }
                        } else if (current.id == "time-14") {
                            LMEPG.BM.requestFocus("time-4");
                            if (Doctor.page == Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1 &&
                                RenderParam.detail.number_list.list.length % Doctor.count < 2) {
                                LMEPG.BM.requestFocus("time-1");
                            } else if (Doctor.page == Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1 &&
                                RenderParam.detail.number_list.list.length % Doctor.count < 3) {
                                LMEPG.BM.requestFocus("time-2");
                            } else if (Doctor.page == Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1 &&
                                RenderParam.detail.number_list.list.length % Doctor.count < 4) {
                                LMEPG.BM.requestFocus("time-3");
                            }
                        } else if (current.id == "time-15") {
                            LMEPG.BM.requestFocus("time-5");
                            if (Doctor.page == Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1 &&
                                RenderParam.detail.number_list.list.length % Doctor.count < 2) {
                                LMEPG.BM.requestFocus("time-1");
                            } else if (Doctor.page == Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1 &&
                                RenderParam.detail.number_list.list.length % Doctor.count < 3) {
                                LMEPG.BM.requestFocus("time-2");
                            } else if (Doctor.page == Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1 &&
                                RenderParam.detail.number_list.list.length % Doctor.count < 4) {
                                LMEPG.BM.requestFocus("time-3");
                            } else if (Doctor.page == Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1 &&
                                RenderParam.detail.number_list.list.length % Doctor.count < 5) {
                                LMEPG.BM.requestFocus("time-4");
                            }
                        }
                    }
                    return false;
                }
                break;
            case 'left':
                if (current.id == "data-1") {
                    // var currentId = LMEPG.BM.getSelectedButton("data").id;
                    // LMEPG.CssManager.addClass(current.id, "btn-selected");
                    LMEPG.BM.requestFocus("btn-introduce");
                }
                break;
            case 'right':
                break;
        }
    },


    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            if (btn.id.substring(0, 4) == "data") {
                if (btn.id == curFocusId)
                    LMEPG.CssManager.removeClass(btn.id, "btn-selected");
            }
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            if (btn.id.substring(0, 4) == "data") {
                if (btn.id == curFocusId) {
                    LMEPG.CssManager.addClass(btn.id, "btn-selected");
                }
            }
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },
    // 加边框焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended-hover");
        }
    },

    // 点击时间，加载对应医生排班
    onClickTime: function (btn) {
        var pos = btn.pos;
        var date = Doctor.getDay(pos)[3] + "-" + Doctor.getDay(pos)[0] + "-" + Doctor.getDay(pos)[1];
        var postData = {
            "hospital_id": RenderParam.detail.detail.expert.hospitalId,
            "department_id": RenderParam.detail.detail.expert.hdeptId,
            "doctor_id": RenderParam.detail.detail.expert.expertId,
            "date": date,
            "on_line": RenderParam.detail.detail.expert.on_line,
            "name": RenderParam.detail.detail.expert.name,
        };
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("GuaHao/getDoctorDetail", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            var data = JSON.parse(data);
            console.log(data);
            if (data.code != 0) {
                LMEPG.UI.showToast("数据加载失败");
                return;
            }
            // 保存数据
            curSelectedDate = date;

            // 刷新排班列表
            RenderParam.detail = data;
            Doctor.createTime(RenderParam.detail.number_list.list);

            LMEPG.CssManager.removeClass(curFocusId, "btn-selected");
            curFocusId = btn.id;
            LMEPG.BM.setSelected(curFocusId, true);

            Doctor.page = 0;
        });
    },

    // 跳转医生简介
    goDoctorProfile: function () {
        var objSrc = Page.getCurrentPage();
        objSrc.setParam("focusIndex", "btn-introduce");
        var objDst = LMEPG.Intent.createIntent("doctorDetail");
        objDst.setParam("hospital_id", RenderParam.hospital_id);
        objDst.setParam("department_id", RenderParam.department_id);
        objDst.setParam("doctor_id", RenderParam.doctor_id);
        objDst.setParam("date", RenderParam.date);
        objDst.setParam("on_line", RenderParam.on_line);
        objDst.setParam("date_index", RenderParam.date_index);
        objDst.setParam("name", RenderParam.name);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转到就诊二维码页面
    goPhoneCode: function (btn) {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("phoneCode");
        var pos = parseInt(G(btn.id).getAttribute("pos"));
        var expert_key = "expert_" + RenderParam.detail.detail.expert.hospitalId + "_" +
            RenderParam.detail.detail.expert.hdeptId + "_" + RenderParam.detail.detail.expert.expertId;
        var num_item = RenderParam.detail.number_list.list[pos];
        objDst.setParam("is_online", RenderParam.detail.is_online);
        objDst.setParam("expert_key", expert_key);
        objDst.setParam("user_id", RenderParam.detail.user_id);
        objDst.setParam("num", JSON.stringify(num_item));
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    }
}

var Doctor = {
    count: 15,
    page: 0,
    timeCount: 7,
    hospitalData: {
        "list": [{
            "name": "刘明",
            "number": "1234",
            "hospital_name": "第一人民医院",
            "img_url": Home.defaultUrl + "text_8.png",
            "status": "1",
            "department": "一号门诊部",
            "position": "主治医师",
            "produce": "经过不懈的尼禄中午打的广泛地打发点嘎达我嘎都是噶十多个当"
        },
            {
                "name": "张欢",
                "number": "1234",
                "hospital_name": "儿童医院",
                "img_url": Home.defaultUrl + "text_8.png",
                "status": "2",
                "department": "外科",
                "position": "主治医师",
                "produce": "经过不懈的尼禄中午打的广泛地打发点嘎达我嘎都是噶十多个当"
            }, {
                "name": "延安",
                "number": "1234",
                "hospital_name": "第儿人民医院",
                "img_url": Home.defaultUrl + "text_8.png",
                "status": "3",
                "department": "手术科",
                "position": "主治医师",
                "produce": "经过不懈的尼禄中午打的广泛地打发点嘎达我嘎都是噶十多个当"
            }, {
                "name": "几环",
                "number": "1234",
                "hospital_name": "第一人民医院",
                "img_url": Home.defaultUrl + "text_8.png",
                "status": "1",
                "department": "监测科",
                "position": "主治医师",
                "produce": "经过不懈的尼禄中午打的广泛地打发点嘎达我嘎都是噶十多个当"
            }, {
                "name": "张兵",
                "number": "1234",
                "hospital_name": "第一人民医院",
                "img_url": Home.defaultUrl + "text_8.png",
                "status": "1",
                "department": "男科",
                "position": "主治医师",
                "produce": "经过不懈的尼禄中午打的广泛地打发点嘎达我嘎都是噶十多个当"
            }]
    },
    // 翻页数据截取
    cut: function (arr, atMove, count) {
        return arr.slice(atMove, atMove + count);
    },

    // 创建时间
    createTime: function (data) {
        var htmlStr = "";
        if (data.length > 0) {
            var addButton = [];
            data = Doctor.cut(data, Doctor.page * Doctor.count, Doctor.count);
            for (var i = 0; i < data.length; i++) {
                if (RenderParam.detail.detail.expert.on_line == 1) {
                    htmlStr += '<div id="time-' + (i + 1) + '" class="data-detail-time"' + ' pos="' + (i + Doctor.page * Doctor.count) + '">' + data[i].start_dt;
                    htmlStr += '<p>' + data[i].order + '号</p>';
                } else if (RenderParam.detail.detail.expert.on_line == 2) {
                    if (curSelectedDate == data[i].date) {
                        if (data[i].diagnosis_type == 0)
                            htmlStr += '<div id="time-' + (i + 1) + '" class="data-detail-time"' + ' pos="' + (i + Doctor.page * Doctor.count) + '">预约';
                        else if (data[i].diagnosis_type == 1)
                            htmlStr += '<div id="time-' + (i + 1) + '" class="data-detail-time"' + ' pos="' + (i + Doctor.page * Doctor.count) + '">初诊';
                        else if (data[i].diagnosis_type == 2)
                            htmlStr += '<div id="time-' + (i + 1) + '" class="data-detail-time"' + ' pos="' + (i + Doctor.page * Doctor.count) + '">复诊';
                    }
                }
                htmlStr += '</div>';
            }
            // LMEPG.BM.addButtons(addButton);
        } else {
            htmlStr += ' <div  class="data-empty">';
            htmlStr += '<img class="icon-sad" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V10/icon_sad.png"/>';
            htmlStr += ' <div  class="empty-title">无排班或已约完';
            htmlStr += '</div>';
            htmlStr += ' <div  class="empty-time">*号源将在每天凌晨00:00更新';
            htmlStr += '</div>';
            htmlStr += '</div>';
        }
        G("time-list").innerHTML = htmlStr;

        // 最后一页，隐藏下箭头
        if (Doctor.page >= Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1) {
            H("m-next");
        } else {
            S("m-next");
        }
    },

    // 创建未来七天的时间
    createSevenDays: function (data) {
        var htmlStr = "";
        for (var i = 0; i < data; i++) {
            if (i == 0) {
                htmlStr += '<div id="data-' + (i + 1) + '" class="data-time">今日';
            } else {
                htmlStr += '<div id="data-' + (i + 1) + '" class="data-time">' + this.getDay(i)[2] + '';
            }
            htmlStr += '<p>' + this.getDay(i)[0] + '-' + this.getDay(i)[1] + '</p>';
            htmlStr += '</div>';
            buttons.push({
                id: 'data-' + (i + 1),
                name: '时间',
                type: 'div',
                nextFocusLeft: 'data-' + i,
                nextFocusRight: 'data-' + (i + 2),
                nextFocusUp: "",
                nextFocusDown: "time-1",
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_null.png",
                focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/f_date_p.png",
                selectedImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/select_date_p.png",
                groupId: "data",
                click: Home.onClickTime,
                focusChange: Home.departFocus,
                beforeMoveChange: Home.onRecommendBeforeMoveChange,
                pos: i,
            });
        }
        G("data").innerHTML = htmlStr;
    },

    createDoctorDetail: function () {
        if (RenderParam.detail.detail.expert != undefined) {
            G("photo").src = Doctor.getImg(RenderParam.detail.detail.expert.expertPhoto);
            G("name").innerHTML = RenderParam.detail.detail.expert.name;
            G("hospital").innerHTML = RenderParam.detail.detail.expert.hospitalName;
            G("position").innerHTML = RenderParam.detail.detail.expert.jobTitle;
            G("department").innerHTML = RenderParam.detail.detail.expert.hdeptName;

            LMEPG.UI.Marquee.start("hospital", 11, 5, 50, "left", "scroll");
        } else {
            Hide("btn-introduce");
        }
    },

    getDay: function (day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        var tYear = today.getFullYear();
        tMonth = this.doHandleMonth(tMonth + 1);
        var tDay = today.getDay();
        tDate = this.doHandleMonth(tDate);
        var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        tDay = weekday[tDay]
        var dataArry = [tMonth, tDate, tDay, tYear];
        return dataArry;

    },

    doHandleMonth: function (month) {
        var m = month;
        if (month.toString().length == 1) {
            m = "0" + month;
        }
        return m;
    },

    /**
     * 下一页
     */
    nextPage: function () {
        if (Doctor.page < Math.ceil(RenderParam.detail.number_list.list.length / Doctor.count) - 1) {
            Doctor.page++;
            Doctor.createTime(RenderParam.detail.number_list.list);
            return true;
        }
        return false;
    },

    /**
     * 上一页
     */
    prevPage: function () {
        if (Doctor.page > 0) {
            Doctor.page--;
            Doctor.createTime(RenderParam.detail.number_list.list);
            return true;
        }
        return false;
    },

    /**
     * 获取图片
     */
    getImg: function (img_url) {
        return RenderParam.cwsGuaHaoUrl + "index.php?img_url=" + img_url;
    },
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};
