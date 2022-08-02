var buttons = [];
var Test = {
    isFirst: true,
    imgUrl: g_appRootPath + "/Public/img/hd/HealthTest/V8/Wristband/",
    navData: [{
        exercise_type: "-1",
        imagePath: "tab_all.png",
        focusImagePath: "tab_all_f.png",
        selectImagePath: "tab_all_select.png"
    }],//-1代表全部
    currentTabIndex: 0,//当前选中的tab
    tempData: [],
    curType: "",
    typeNameList: ["跑步", "健走", "骑行", "游泳", "力量训练", "新跑步", "室内跑步", "椭圆机", "有氧运动", "篮球", "足球", "羽毛球", "排球",
        "乒乓球", "瑜伽", "电竞", "有氧运动-12分钟跑", "有氧运动-6分钟走", "健身舞", "太极"],

    createNav: function () {
        var ele = {
            "containerId": "tab-list",
            "data": Test.navData,
            "pageSize": 5,
            "btnId": "tab-",
            "type": "img",
            "onFocus": function (btn, has) {
                if (has) {

                } else {
                    // LMEPG.CssManager.removeClass(btn.id, "focus")
                }
            },
            "onClick": Test.selectOnClick
        }
        Pagination.init(ele);
    },

    init: function () {
        /**
         * 通用组件调用
         * @type {number}
         */
        TableComponents.defaultFocusImg = g_appRootPath + '/Public/img/hd/HealthTest/V8/Wristband/m_long_box_f.png';
        this.getType()

        // G("scroll-wrapper").scrollTop = parseInt(RenderParam.scrollTop);
        // LMEPG.BM.setSelected(RenderParam.curTab);
        // if (!LMEPG.Func.isEmpty(RenderParam.curTab)) {
        //     LMEPG.ButtonManager.requestFocus(RenderParam.curTab);
        // } else {
        //     LMEPG.ButtonManager.requestFocus("tab-1");
        // }

    },
    selectOnClick: function (btn) {
        Test.getData(btn.cType, btn.id);
    },

    getType: function () {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            "memberId": RenderParam.member_id,
        }
        LMEPG.ajax.postAPI('DeviceCheck/getExerciseTypeList', postData,
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                if (data.result == 0 && data.list != null && data.list.length > 0) {
                    data.list.forEach(function(v, i){
                        v.imagePath = "tab_" + v.exercise_type + ".png";
                        v.focusImagePath = "tab_" + v.exercise_type + "_f.png";
                        v.selectImagePath = "tab_" + v.exercise_type + "_select.png";
                        Test.navData.push(v);
                    })
                    Test.createNav();
                    Test.getData(RenderParam.exercise_type, "tab-0");
                } else {
                    LMEPG.UI.showToast("暂无数据", 3, LMEPG.Intent.back());
                }
            },
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("手步数数据状态请求失败!");
            }
        );
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('sportList-wristband');
        objCurrent.setParam('page', Test.page);
        objCurrent.setParam('curTab', LMEPG.BM.getSelectedButton("nav").id);
        objCurrent.setParam('scrollTop', parseInt(G("scroll-wrapper").scrollTop));
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('exercise_type', RenderParam.exercise_type);
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        objCurrent.setParam('member_gender', RenderParam.member_gender);
        return objCurrent;
    },
    getData: function (index, id) {
        RenderParam.exercise_type = index;
        // LMEPG.UI.showWaitingDialog();
        var postData = {
            "memberId": RenderParam.member_id,
            "exercise_type": index,
        }
        LMEPG.ajax.postAPI('DeviceCheck/getSportList', postData,
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                if (data.result == 0) {
                    Test.tempData = [];
                    var totalTime = 0;
                    var totalCalories = 0;
                    LMEPG.UI.dismissWaitingDialog();
                    if (data.list != null && data.list.length > 0) {
                        console.log(data)
                        data.list.forEach(function(v, i){
                            var item = {
                                start_dt: v.start_dt,
                                typeName: Test.typeNameList[parseInt(v.exercise_type) - 1],
                                duration: (Math.round(parseInt(v.exercise_time).toFixed(0) / 60)) + "分钟",
                                measure_id: v.measure_id,
                                exercise_type: v.exercise_type,
                            }
                            // totalTime += (Math.round(parseInt(v.exercise_time).toFixed(0) / 60));
                            // totalCalories += parseInt(LMEPG.Func.isEmpty(data.sum_data.calories) ? 0 : data.sum_data.calories);
                            Test.tempData.push(item);
                        })
                        if (Test.isFirst) {
                            if (data.sum_data != null) {
                                G('duration-text').innerHTML = Math.floor(parseInt(data.sum_data[0].exercise_time)/60) + "分钟";
                                G('ca-text').innerHTML = LMEPG.Func.isEmpty(data.sum_data[0].calories) ? 0 : data.sum_data[0].calories + "大卡";
                            }
                        }
                    }
                    TableComponents.render(Test.tempData, ["", "", ""], Test.jumpDetail, ["measure_id", "exercise_type"]);

                    if (Test.isFirst) {
                        Test.isFirst = false;
                        G("scroll-wrapper").scrollTop = parseInt(RenderParam.scrollTop);
                        if (!LMEPG.Func.isEmpty(RenderParam.curTab)) {
                            // LMEPG.ButtonManager.requestFocus(RenderParam.curTab);
                            LMEPG.BM.getButtonById("recd-btn-1").nextFocusUp = RenderParam.curTab;
                            LMEPG.BM.setSelected(RenderParam.curTab, true);
                        } else {
                            LMEPG.BM.setSelected("tab-0", true);
                            LMEPG.BM.getButtonById("recd-btn-1").nextFocusUp = id;
                            // LMEPG.ButtonManager.requestFocus("tab-0");
                        }
                    } else {
                        // alert(id)
                        LMEPG.BM.setSelected(id, true);
                        LMEPG.BM.getButtonById("recd-btn-1").nextFocusUp = id;
                        LMEPG.BM.requestFocus("recd-btn-1");
                        // LMEPG.ButtonManager.init("recd-btn-1", buttons, '', true);
                    }

                } else {
                    LMEPG.UI.showToast("步数数据拉取失败!");
                }
            },
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("手步数数据状态请求失败!");
            }
        );
    },

    formatShortTime: function (date) {
        return newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)
    },

    jumpDetail: function (btn) {
        var curObj = Test.getCurrentPage();
        if (btn.cData.exercise_type == 1 || btn.cData.exercise_type == 2 || btn.cData.exercise_type == 3 || btn.cData.exercise_type == 7) {
            var dstObj = LMEPG.Intent.createIntent("sportDetail-wristband");
        } else {
            var dstObj = LMEPG.Intent.createIntent("sportEqDetail-wristband");
        }
        dstObj.setParam('member_id', RenderParam.member_id);
        dstObj.setParam('member_name', RenderParam.member_name);
        dstObj.setParam('member_image_id', RenderParam.member_image_id);
        dstObj.setParam('member_gender', RenderParam.member_gender);
        dstObj.setParam('measure_id', btn.cData.measure_id);
        dstObj.setParam('exercise_type', btn.cData.exercise_type);
        LMEPG.Intent.jump(dstObj, curObj);
    },
};
var Pagination = {
    isCreateBtn: false,
    containerId: "",//分页容器,
    curPage: 0,
    type: "img",
    data: "",
    pagesSize: 0,
    btnId: "",
    callBack: "",
    onFocusBack: "",
    init: function (element) {
        this.containerId = element.containerId;
        this.data = element.data;
        this.pagesSize = element.pageSize;
        this.btnId = element.btnId;
        this.type = element.type;
        // this.callBack = element.callBack;
        this.onFocusBack = element.onFocus;
        this.callBack = element.onClick;
        if (!this.isCreateBtn) {
            this.isCreateBtn = true;
            this.createBtn(this.pagesSize);
        }
        this.createHtml();
    },
    createHtml: function () {
        G(this.containerId).innerHTML = "";
        var sHtml = "";
        var curDataLength = this.data.length;
        // console.log("ddd>>>" + this.data);
        var curData = this.cut(this.data);
        var that = this;
        curData.forEach(function (item, i) {
            var imgUrl = g_appRootPath + "/Public/img/hd/HealthTest/V8/Wristband/" + item.imagePath;
            sHtml += '<img id="' + that.btnId + i + '" src="' + imgUrl + '">';
        });
        G(this.containerId).innerHTML = sHtml;
        for (var i = 0; i < curData.length; i++) {
            LMEPG.BM.getButtonById(Pagination.btnId + i).backgroundImage = Test.imgUrl + curData[i].imagePath;
            LMEPG.BM.getButtonById(Pagination.btnId + i).focusImage = Test.imgUrl + curData[i].focusImagePath;
            LMEPG.BM.getButtonById(Pagination.btnId + i).selectedImage = Test.imgUrl + curData[i].selectImagePath;

            LMEPG.BM.getButtonById(Pagination.btnId + i).cType = curData[i].exercise_type;
        }
        this.upDateArroww();
        LMEPG.ButtonManager.requestFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : Pagination.btnId + '0');
    },
    cut: function () {
        return this.data.slice(this.curPage, this.pagesSize + this.curPage)
    },
    turnPage: function (dir, cur) {
        if (dir == "left" && cur.id == Pagination.btnId + "0") {
            Pagination.prePage()
            return false
        } else if (dir == "right" && cur.id == Pagination.btnId + (Pagination.pagesSize - 1)) {
            Pagination.nextPage()
            return false
        } else if (dir == "down") {
            LMEPG.BM.getButtonById("recd-btn-1").nextFocusUp = cur.id;
        }
    },
    onClick: function (btn) {
        LMEPG.call(Pagination.callBack, btn)
    },
    onFocus: function (btn, has) {
        LMEPG.call(Pagination.onFocusBack, btn, has)
    },

    createBtn: function (page) {
        var focusNum = page;
        while (focusNum--) {
            buttons.push({
                id: Pagination.btnId + focusNum,
                type: Pagination.type,
                nextFocusLeft: Pagination.btnId + (focusNum - 1),
                nextFocusRight: Pagination.btnId + (focusNum + 1),
                nextFocusDown: "recd-btn-1",
                backgroundImage: Test.imgUrl + "tab_" + (focusNum + 1) + ".png",
                focusImage: Test.imgUrl + "tab_" + (focusNum + 1) + "_f.png",
                selectedImage: Test.imgUrl + "tab_" + (focusNum + 1) + "_select.png",
                groupId: "nav",
                click: Pagination.onClick,
                focusChange: Pagination.onFocus,
                beforeMoveChange: Pagination.turnPage,
                cType: ""
            });
        }
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : Pagination.btnId + '0', buttons, '', true);
    },

    prePage: function () {
        if (this.curPage > 0) {
            this.curPage--;
            this.createHtml();
            LMEPG.BM.requestFocus(Pagination.btnId + "0");
        }
    },
    nextPage: function () {
        if (this.curPage < (this.data.length - this.pagesSize)) {
            this.curPage++;
            this.createHtml();
            LMEPG.BM.requestFocus(Pagination.btnId + (Pagination.pagesSize - 1));
        }
    },

    upDateArroww: function () {
        var page_right = document.getElementById("arrow_right");
        var page_left = document.getElementById("arrow_left");
        page_right.style.display = "none";
        page_left.style.display = "none";

        if (this.curPage < (this.data.length - this.pagesSize)) {
            page_right.style.display = "block";
        }
        if (this.curPage > 0) {
            page_left.style.display = "block";
        }
    }
}

var onBack = function () {
    LMEPG.Intent.back();
};