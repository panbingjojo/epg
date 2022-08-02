// 定义全局按钮
var buttons = [];

// 列表id
var scroll = "doctor";

// 全局变量，记录当前选中的时间html id
var curFocusId;
// 记录当前选择的时间
var curSelectedDate;
// 记录当前选择的时间的数组下标
var dateIndex = 0;

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
        var currentPage = LMEPG.Intent.createIntent("doctorList");
        currentPage.setParam("hospital_id", RenderParam.hospital_id);
        currentPage.setParam("dept_id", RenderParam.dept_id);
        // 焦点保持相关信息
        currentPage.setParam("curSelectedDate", curSelectedDate);
        currentPage.setParam("curTimeSelectedId", curFocusId);
        currentPage.setParam("page", Doctor.page);
        currentPage.setParam("date_index", dateIndex);
        currentPage.setParam("tips", RenderParam.tips);
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
    defaultFocusId: "data-1",
    //页面初始化操作
    init: function () {
        Home.initButtons();                 // 初始化焦点按钮
        Doctor.createDoctor(RenderParam.doc_list.list.experts);
        Doctor.createSevenDays(7);

        // 焦点恢复
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        LMEPG.BM.init(lastFocusId, buttons, "", true);
        if (LMEPG.Func.isEmpty(RenderParam.focusIndex)) {
            curFocusId = Home.defaultFocusId;
            curSelectedDate = Doctor.getDay(0)[3] + "-" + Doctor.getDay(0)[0] + "-" + Doctor.getDay(0)[1];
        } else {
            var curSelectedDateTmp = RenderParam.curSelectedDate;
            var curTimeSelectedId = RenderParam.curTimeSelectedId;
            curFocusId = curTimeSelectedId;
            curSelectedDate = curSelectedDateTmp;
            dateIndex = RenderParam.date_index;
            LMEPG.BM.setSelected(curTimeSelectedId, true);
            LMEPG.CssManager.addClass(curTimeSelectedId, "btn-selected");

            var page = RenderParam.page;
            for (var i = 0; i < page; i++) {
                Doctor.nextPage();
            }
        }
        LMEPG.BM.requestFocus(lastFocusId);

        if (!LMEPG.Func.isEmpty(RenderParam.tips)) {
            LMEPG.UI.commonDialog.show(RenderParam.tips, ["确定"], null);
        }
    },

    initButtons: function () {
        for (var i = 0; i < Doctor.count; i++) {
            buttons.push({
                id: 'doctor-' + (i + 1),
                name: '医生',
                type: 'div',
                nextFocusLeft: "",
                nextFocusRight: '',
                nextFocusUp: 'doctor-' + i,
                nextFocusDown: 'doctor-' + (i + 2),
                backgroundImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/bg_doctor.png",
                focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/f_doctor.png",
                click: Home.onClickDoctor,
                focusChange: Home.doctorFocus,
                beforeMoveChange: Home.onRecommendBeforeMoveChange,
            });
        }
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                if (current.id == "doctor-1") {
                    if (Doctor.page == 0) {
                        var currentId = LMEPG.BM.getSelectedButton("data").id;
                        LMEPG.BM.requestFocus(currentId);
                    } else {
                        Doctor.prevPage();
                    }
                }
                break;
            case 'down':
                if (current.id == "doctor-2") {
                    Doctor.nextPage();
                }
                break;
        }
    },

    // 时间焦点变化
    timeFocus: function (btn, hasFocus) {
        if (LMEPG.Func.isEmpty(LMEPG.BM.getSelectedButton("data"))) {
            LMEPG.BM.setSelected(Home.defaultFocusId, true);
        }
        var currentId = LMEPG.BM.getSelectedButton("data").id;
        if (hasFocus) {
            if (btn.id == currentId) {
                LMEPG.CssManager.removeClass(btn.id, "btn-selected");
            }
        } else {
            if (btn.id == currentId) {
                LMEPG.CssManager.addClass(btn.id, "btn-selected");
            }
        }
    },
    // 医生焦点变化
    doctorFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended-hover");
        }
    },

    // 点击时间，加载对应医生列表
    onClickTime: function (btn) {
        var pos = btn.pos;
        var date = Doctor.getDay(pos)[3] + "-" + Doctor.getDay(pos)[0] + "-" + Doctor.getDay(pos)[1];
        var postData = {
            "hospital_id": RenderParam.hospital_id,
            "dept_id": RenderParam.dept_id,
            "date": date,
        };
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("GuaHao/getDoctors", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            var data = JSON.parse(data);
            console.log(data);
            if (data.code != 0) {
                LMEPG.UI.showToast("数据加载失败");
                return;
            }
            // 刷新医生列表
            Doctor.createDoctor(data.list.experts);

            // 保存数据
            RenderParam.doc_list = data;
            curSelectedDate = date;
            dateIndex = pos;

            LMEPG.CssManager.removeClass(curFocusId, "btn-selected");
            curFocusId = btn.id;
            LMEPG.BM.setSelected(btn.id, true);
        });
    },

    // 点击医生
    onClickDoctor: function (btn) {
        // 跳转到预约时间页面
        var objSrc = Page.getCurrentPage();
        objSrc.setParam("focusIndex", btn.id);
        var objDst = LMEPG.Intent.createIntent("appointmentTime");
        var pos = parseInt(G(btn.id).getAttribute("pos"));
        objDst.setParam("hospital_id", RenderParam.hospital_id);
        objDst.setParam("department_id", RenderParam.dept_id);
        objDst.setParam("doctor_id", RenderParam.doc_list.list.experts[pos].expertId);
        objDst.setParam("date", curSelectedDate);
        objDst.setParam("on_line", RenderParam.doc_list.list.experts[pos].on_line);
        objDst.setParam("date_index", dateIndex);
        objDst.setParam("name", RenderParam.doc_list.list.experts[pos].name);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

}

var Doctor = {
    page: 0,
    count: 2,
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

    // 创建医生
    createDoctor: function (data) {
        if (RenderParam.doc_list.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            return;
        }
        var htmlStr = "";
        var defaultImg = "'" + g_appRootPath + '/Public/img/hd/Home/V10/default_man.png' + "'";
        data = Doctor.cut(data, this.page, this.count);
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                htmlStr += ' <div id="doctor-' + (i + 1) + '" class="doctor-bg" pos="' + (i + Doctor.page) + '">';
                htmlStr += ' <img class="photo" src="' + Doctor.getImg(data[i].expertPhoto) + '" onerror="this.src=' + defaultImg + '" />';
                // 可预约
                if (data[i].has_reg == 1) {
                    htmlStr += ' <img class="status" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V10/status_1.png" />';
                }
                // 暂无排班
                else if (data[i].has_reg == 3) {
                    htmlStr += ' <img class="status" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V10/status_3.png" />';
                }
                // 已约完
                else {
                    htmlStr += ' <img class="status" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V10/status_2.png" />';
                }
                htmlStr += '<div class="produce">';
                htmlStr += '<div class="name line-word">' + data[i].name + '</div>';
                htmlStr += '<div class="line-word">';
                if (data[i].jobTitle != "") {
                    htmlStr += '<span class="subject">' + data[i].jobTitle + '</span>';
                }
                htmlStr += '</div>';
                htmlStr += '<div class="content line-word">' + data[i].introduction + '</div>';
                htmlStr += '</div>';
                htmlStr += '</div>';
                htmlStr += '</div>';
            }
        } else {
            htmlStr += ' <div  class="data-empty">';
            htmlStr += '<img class="icon-sad" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V10/icon_sad.png"/>';
            htmlStr += ' <div  class="empty-title">无排班或已约完';
            htmlStr += '</div>';
            htmlStr += ' <div  class="empty-time">*号源将在每天凌晨00:00更新';
            htmlStr += '</div>';
            htmlStr += '</div>';
        }
        G("doctor").innerHTML = htmlStr;

        // 最后一页，隐藏下箭头
        if (Doctor.page >= RenderParam.doc_list.list.experts.length - Doctor.count) {
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
                nextFocusDown: "doctor-1",
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_null.png",
                focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/f_date_s.png",
                selectedImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/select_date_s.png",
                groupId: "data",
                click: Home.onClickTime,
                focusChange: Home.timeFocus,
                beforeMoveChange: Home.onRecommendBeforeMoveChange,
                pos: i,
            });
        }
        G("data").innerHTML = htmlStr;
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
        var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
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
        if (Doctor.page < RenderParam.doc_list.list.experts.length - Doctor.count) {
            Doctor.page++;
            Doctor.createDoctor(RenderParam.doc_list.list.experts);
            LMEPG.BM.requestFocus("doctor-2");
        }
    },

    /**
     * 上一页
     */
    prevPage: function () {
        if (Doctor.page > 0) {
            Doctor.page--;
            Doctor.createDoctor(RenderParam.doc_list.list.experts);
            LMEPG.BM.requestFocus("doctor-1");
        }
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
