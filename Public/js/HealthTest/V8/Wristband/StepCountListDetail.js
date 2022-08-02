var buttons = [];
var Test = {
    currData: 10000,
    tempData: [
        {param1: "2012-12-15", param2: "789", param3: "还差120步",},
        {param1: "2012-12-15", param2: "789", param3: "还差120步"},
    ],

    init: function () {
        this.createBtn()
        this.getData();
    },
    formatShortTime: function (date) {
        return newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)
    },
    render: function (data) {
        G("insert-dt").innerHTML = Test.formatShortTime(data.list[0].insert_dt);
        G("cur-step").innerHTML = data.list[0].step;
        G("step").innerHTML = data.list[0].target_steps;
        G("average_step").innerHTML = parseInt(data.day_list[0].average_step).toFixed(0);
        G("max_step").innerHTML = data.day_list[0].max_step;
        G("num").innerHTML = data.day_list[0].num;
        G("consume").innerHTML = data.list[0].calories;
        G("distance").innerHTML = parseInt(data.list[0].distance)/1000;
    },
    createBtn: function () {
        buttons.push({
            id: 'drop-down',
            type: 'img',
            click: Test.dropBox,
        })
        buttons.push({
            id: 'select',
            type: 'img',
            click: Test.setStep,
            beforeMoveChange: Test.onBeforeMoveChange,
        })
        LMEPG.ButtonManager.init('drop-down', buttons, '', true);
    },
    getData: function () {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            "memberId": RenderParam.member_id,
            "dt": RenderParam.dt,
        }
        LMEPG.ajax.postAPI('DeviceCheck/getStepDetail', postData,
            function (data) {
                try {
                    if (data.result == 0) {
                        LMEPG.UI.dismissWaitingDialog();
                        console.log(">>>>>" + JSON.stringify(data));
                        Test.render(data)
                    } else {
                        LMEPG.UI.showToast("步数数据拉取失败!");
                    }
                } catch (e) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("步数数据状态解析异常!" + e);
                }
            },
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("手步数数据状态请求失败!");
            }
        );
    },

    areaList: function (area) {
        var tempArea = area * 1000;
        var selectArea = eval(Test.currData + tempArea) <= 0 ? "" : eval(Test.currData + tempArea);
        return selectArea
    },
    dropBox: function () {
        var select1 = Test.areaList(-2);
        var select2 = Test.areaList(-1);
        var select3 = Test.areaList(1);
        var select4 = Test.areaList(2);
        G("drop-list").innerHTML = '<ul><li>' + select1 + '</li><li>' + select2 + '</li><li id="select">' + Test.currData + '</li><li>' + select3 + '</li><li>' + select4 + '</li></ul>';
        LMEPG.BM.requestFocus("select");
        Show("drop-list");
    },
    setStep: function () {
        G("step").innerHTML = Test.currData;
        Hide("drop-list");
        LMEPG.BM.requestFocus("drop-down");
        Test.setGoalStep(Test.currData);

    },
    onBeforeMoveChange: function (dir, cur) {
        if (dir == "up" && Test.currData > 1000) {
            Test.currData -= 1000;
            Test.dropBox()

        } else if (dir == "down") {
            Test.currData += 1000;
            Test.dropBox()
        }
    },
    setGoalStep: function (count) {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            "member_id": RenderParam.member_id,
            "device_id": RenderParam.device_id,
            "target_steps": count,
        }
        LMEPG.ajax.postAPI('DeviceCheck/setGoalStep', postData,
            function (data) {
                try {
                    if (data.result == 0) {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("设置步数成功！");
                    } else {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("设置步数失败！");
                    }
                } catch (e) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("设置步数解析异常!" + e);
                }
            },
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("设置步数态请求失败!");
            }
        );
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('wristList-wristband');
        return objCurrent;
    },

};

var onBack = function () {
    if (isShow("drop-list")) {
        Hide("drop-list");
        LMEPG.BM.requestFocus("drop-down");
    } else {
        LMEPG.Intent.back();
    }
};