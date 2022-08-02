var buttons = [];
var Test = {
    tempData: [],

    init: function () {
        /**
         * 通用组件调用
         * @type {number}
         */
        this.getData();
        // TableComponents.render(Test.tempData, ["日期", "步数", "是否达标"], this.jumpDetail);
        G("scroll-wrapper").scrollTop = parseInt(RenderParam.scrollTop);

    },
    getData: function () {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            "memberId": RenderParam.member_id,
            "device_id": "",
        }
        LMEPG.ajax.postAPI('DeviceCheck/getStepList', postData,
            function (data) {
                try {
                    if (data.result == 0&& data.list != null && data.list.length > 0) {
                        LMEPG.UI.dismissWaitingDialog();
                        console.log(">>>>>" + JSON.stringify(data));
                        Test.deepClone(data.list);
                        console.log(">>>>>" + JSON.stringify(Test.tempData));
                        TableComponents.render(Test.tempData, ["日期", "步数", "是否达标"], Test.jumpDetail);
                    } else {
                        LMEPG.UI.showToast("暂无数据", 3, LMEPG.Intent.back());
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
    deepClone: function (list) {
        list.forEach(function (item) {
            Test.tempData.push({
                "param1": Test.formatShortTime(item.insert_dt)[0],
                "param2": item.step,
                "param3": item.step - item.target_steps > 0 ? "是" : "否",
            })
        })
    },
    formatShortTime: function (date) {
        return newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('stepCount-wristband');
        objCurrent.setParam('page', Test.page);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('scrollTop', parseInt(G("scroll-wrapper").scrollTop));
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        objCurrent.setParam('member_gender', RenderParam.member_gender);
        objCurrent.setParam('device_id', RenderParam.device_id);

        return objCurrent;
    },

    jumpDetail: function (btn) {
        var curObj = Test.getCurrentPage();
        var dstObj = LMEPG.Intent.createIntent("stepCountDetail-wristband");
        dstObj.setParam('device_id', RenderParam.device_id);
        dstObj.setParam('dt', btn.cData.param1);
        dstObj.setParam('member_id', RenderParam.member_id);
        dstObj.setParam('member_name', RenderParam.member_name);
        dstObj.setParam('member_image_id', RenderParam.member_image_id);
        dstObj.setParam('member_gender', RenderParam.member_gender);
        LMEPG.Intent.jump(dstObj, curObj);
    },
};

var onBack = function () {
    LMEPG.Intent.back();
};