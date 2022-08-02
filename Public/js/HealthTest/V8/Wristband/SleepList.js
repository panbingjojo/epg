var buttons = [];
var Test = {
    tempData: [
        // {param1: "2012-12-15", param2: "789", param3: "还差120步", param4: "35%", param5: "优秀",},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步", param4: "35%", param5: "优秀",},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步", param4: "35%", param5: "优秀",},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步", param4: "35%", param5: "优秀",},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步", param4: "35%", param5: "优秀",},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步", param4: "35%", param5: "优秀",},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步", param4: "35%", param5: "优秀",},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步", param4: "35%", param5: "优秀",},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步", param4: "35%", param5: "优秀",},
    ],

    init: function () {
        /**
         * 通用组件调用
         * @type {number}
         */
        TableComponents.defaultFocusImg = g_appRootPath + '/Public/img/hd/HealthTest/V8/Wristband/m_long_box_f.png';
        // TableComponents.render(Test.tempData, ["日期", "深睡比例", "浅睡比例", "清醒比例", "睡眠等级"], this.jumpDetail);
        G("scroll-wrapper").scrollTop = parseInt(RenderParam.scrollTop);
        Test.getData();

    },

    getData: function () {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            "memberId": RenderParam.member_id,
        }
        LMEPG.ajax.postAPI('DeviceCheck/getSleepList', postData,
            function (data) {
                try {
                    if (data.result == 0 && data.list != null && data.list.length > 0) {
                        LMEPG.UI.dismissWaitingDialog();
                        console.log(">>>>>" + JSON.stringify(data));
                        Test.deepClone(data.list);
                        console.log(">>>>>" + JSON.stringify(Test.tempData));
                        TableComponents.render(Test.tempData, ["日期", "深睡比例", "浅睡比例", "清醒比例"], Test.jumpDetail,["measure_id"]);
                        G("scroll-wrapper").scrollTop = parseInt(RenderParam.scrollTop);

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
                "param1": Test.formatShortTime(item.daily_dt)[0],
                "param2": item.deep_sleep + '%',
                "param3": item.light_sleep + '%',
                "param4": item.awake_sleep + '%',
                "measure_id":item.measure_id
            })
        })
    },
    formatShortTime: function (date) {
        return newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('sleepList-wristband');
        objCurrent.setParam('page', Test.page);
        objCurrent.setParam('scrollTop', parseInt(G("scroll-wrapper").scrollTop));
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        objCurrent.setParam('member_gender', RenderParam.member_gender);
        return objCurrent;
    },

    jumpDetail: function (btn) {
        var curObj = Test.getCurrentPage();
        var dstObj = LMEPG.Intent.createIntent("sleepDetail-wristband");

        dstObj.setParam('member_id', RenderParam.member_id);
        dstObj.setParam('member_name', RenderParam.member_name);
        dstObj.setParam('member_image_id', RenderParam.member_image_id);
        dstObj.setParam('member_gender', RenderParam.member_gender);
        dstObj.setParam('measure_id', btn.cData.measure_id);
        LMEPG.Intent.jump(dstObj, curObj);
    },
};

var onBack = function () {
    LMEPG.Intent.back();
};