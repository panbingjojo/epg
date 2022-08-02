// 定义全局按钮
var buttons = [];

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
        var currentPage = LMEPG.Intent.createIntent("patientSelection");
        currentPage.setParam("user_id", RenderParam.user_id);
        currentPage.setParam("expert_key", RenderParam.expert_key);
        currentPage.setParam("num", RenderParam.num);
        currentPage.setParam("is_online", RenderParam.is_online);
        currentPage.setParam("page", Patient.page);
        currentPage.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
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
    defaultFocusId: "btn-1",
    init: function () {
        /*for (var i = 0; i < 6; i++) {
            var tmp = {};
            for (var key in RenderParam.patient_list.list[0]) {
                tmp[key] = RenderParam.patient_list.list[0][key];
            }
            tmp["patient_name"] = "附件" + (i + 1);
            RenderParam.patient_list.list.push(tmp);
        }*/

        Patient.createHtml(RenderParam.patient_list.list);
        Home.initButtons();
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        LMEPG.BM.init(lastFocusId, buttons, "", true);

        for (var i = 0;i < RenderParam.page; i++) {
            Patient.nextPage();
        }

        LMEPG.BM.requestFocus(lastFocusId);
    },

    initButtons: function() {
        for (var i = 0; i < Patient.count; i++) {
            buttons.push({
                id: 'btn-' + (i + 1),
                name: '就诊人',
                type: 'div',
                nextFocusLeft: 'btn-editor-' + (i + 1),
                nextFocusRight: '',
                nextFocusUp: 'btn-' + i,
                nextFocusDown: 'btn-' + (i + 2),
                backgroundImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/bg_btn_long_1.png",
                focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/f_btn_long_1.png",
                click: Home.reservationAdd,
                focusChange: Home.departFocus,
                beforeMoveChange: Home.onRecommendBeforeMoveChange,
                cType: "region",
            });

            buttons.push({
                id: 'btn-editor-' + (i + 1),
                name: '编辑',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn-' + (i + 1),
                nextFocusUp: 'btn-editor-' + i,
                nextFocusDown: 'btn-editor-' + (i + 2),
                backgroundImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/icon_editor_bg.png",
                focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/icon_editor_f.png",
                click: Home.goPatientEditor,
                focusChange: "",
                beforeMoveChange: Home.onRecommendBeforeMoveChange,
                cType: "edit",
            });
        }

        // 添加就诊人按钮
        buttons.push({
            id: 'btn-0',
            name: '添加就诊人',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'btn-4',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/bg_btn_long_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/f_btn_long_1.png",
            click: Home.goPatientEditor,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cType: "add",
        });
    },

    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        var pos = parseInt(G(current.id).getAttribute("pos"));
        switch (dir) {
            case 'up':
                if (current.id == "btn-1" || current.id == "btn-editor-1") {
                    Patient.prevPage();
                    if (current.id == "btn-1") {
                        LMEPG.BM.requestFocus("btn-1");
                    } else {
                        LMEPG.BM.requestFocus("btn-editor-1");
                    }
                    return false;
                }

                // 添加按钮，向上焦点到最后一条
                if (current.id == "btn-0") {
                    var len = RenderParam.patient_list.list.length;
                    if (len > 0 && len < Patient.count) {
                        LMEPG.BM.requestFocus("btn-" + len);
                        return false;
                    }
                }
                break;
            case 'down':
                if (current.id == "btn-4" || current.id == "btn-editor-4") {
                    Patient.nextPage();
                    if (current.id == "btn-4") {
                        LMEPG.BM.requestFocus("btn-4");
                    } else {
                        LMEPG.BM.requestFocus("btn-editor-4");
                    }
                    if (Patient.page >= RenderParam.patient_list.list.length - Patient.count) {
                        LMEPG.BM.requestFocus("btn-0");
                    }
                    return false;
                }

                // 最后一条，向下焦点到添加按钮
                if (pos == RenderParam.patient_list.list.length - 1) {
                    LMEPG.BM.requestFocus("btn-0");
                    return false;
                }
                break;
        }
    },

    // 跳转添加就诊人页面
    goPatientEditor: function (btn) {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("patientEditor");
        if (btn.cType == "add")
            objDst.setParam("type", 1);
        else {
            var pos = parseInt(G(btn.id).getAttribute("pos"));
            objDst.setParam("type", 2);
            objDst.setParam("patient_info", JSON.stringify(RenderParam.patient_list.list[pos]));
        }
        objDst.setParam("user_id", RenderParam.user_id);
        objDst.setParam("expert_key", RenderParam.expert_key);
        objDst.setParam("num", RenderParam.num);
        objDst.setParam("is_online", RenderParam.is_online);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳回就诊页面，携带选择的就诊人数据
    reservationAdd: function (btn) {
        var pos = parseInt(G(btn.id).getAttribute("pos"));
        var patient_info = RenderParam.patient_list.list[pos];
        var objSrc = Page.getCurrentPage();
        objSrc = null;
        var objDst = LMEPG.Intent.createIntent("reservationAdd");
        objDst.setParam("patient_info", JSON.stringify(patient_info));
        objDst.setParam("user_id", RenderParam.user_id);
        objDst.setParam("expert_key", RenderParam.expert_key);
        objDst.setParam("num", RenderParam.num);
        objDst.setParam("is_online", RenderParam.is_online);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },
}

var Patient = {
    timeCount: 7,
    page: 0,
    count: 4,
    // 翻页数据截取
    cut: function (arr, atMove, count) {
        return arr.slice(atMove, atMove + count);
    },
    hospitalData: {
        "list": [{
            "name": "刘明",
            "sex": "男",
            "ege": "19岁",
            "phone": "185***554555"
        }, {
            "name": "花大嘎达",
            "sex": "女",
            "ege": "18岁",
            "phone": "185***554555"
        }, {
            "name": "张大哥",
            "sex": "女",
            "ege": "18岁",
            "phone": "185***554555"
        }, {
            "name": "刘明",
            "sex": "男",
            "ege": "18岁",
            "phone": "185***554555"
        }, {
            "name": "刘明",
            "sex": "男",
            "ege": "8岁",
            "phone": "185***554555"
        }, {
            "name": "刘明",
            "sex": "男",
            "ege": "8岁",
            "phone": "185***554555"
        }, {
            "name": "刘明",
            "sex": "男",
            "ege": "8岁",
            "phone": "185***554555"
        },
        ]
    },
    createHtml: function (data) {
        if (RenderParam.patient_list.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            Home.defaultFocusId = "btn-0";
            return;
        }
        data = this.cut(data, this.page, this.count);
        var sHtml = "";
        for (var i = 0; i < data.length; i++) {
            sHtml += '<div  class="list">';
            sHtml += '<img id="btn-editor-' + (i + 1) + '" class="btn-editor" pos="' + (i + this.page) + '" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V10/icon_editor_bg.png"/>';
            sHtml += '<div id="btn-' + (i + 1) + '" class="add-man btn-bg" pos="' + (i + this.page) + '">';
            sHtml += '<ul><li class="one">' + data[i].patient_name + '</li><li >' + (data[i].gender == "0" ? "男" : "女") + '</li><li >' + data[i].age +
                '岁</li><li class="fourd" >联系电话：<span id="phone">' + (data[i].patient_phone == "" ? data[i].contacts_phone : data[i].patient_phone)
                + '</span></li></ul></div></div>';
        }
        sHtml += '<div  class="list">';
        sHtml += '<img class="btn-editor" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V10/icon_editor_bg.png" style="visibility: hidden"/>';
        sHtml += '<div id="btn-0" class="add-man btn-bg">添加就诊人</div>';
        sHtml += '</div>';

        G("scroll").innerHTML = sHtml;

        // 如果没有就诊人信息，把焦点设置在添加按钮上
        if (data.length == 0)
            Home.defaultFocusId = "btn-0";

        // 最后一页，隐藏下箭头
        if (this.page >= RenderParam.patient_list.list.length - this.count) {
            H("m-next");
        } else {
            S("m-next");
        }
    },

    /**
     * 下一页
     */
    nextPage: function () {
        if (this.page < RenderParam.patient_list.list.length - this.count) {
            this.page++;
            this.createHtml(RenderParam.patient_list.list);
        }
    },

    /**
     * 上一页
     */
    prevPage: function () {
        if (this.page > 0) {
            this.page--;
            this.createHtml(RenderParam.patient_list.list);
        }
    },
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};
