var buttons = [];
var Test = {
    tempData: [
        // {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        // {param1: "2012-12-15", param2: "789", param3: "还差120步"},

    ],

    init: function () {
        /**
         * 通用组件调用
         * @type {number}
         */
        TableComponents.defaultFocusImg = g_appRootPath + '/Public/img/hd/HealthTest/V8/Wristband/m_long_box_f.png';
        Test.getData();
        // TableComponents.render(Test.tempData, ["日期", "日最高心率", "日最低心率"], this.jumpDetail);
        // G("scroll-wrapper").scrollTop = parseInt(RenderParam.scrollTop);

    },
    getData: function () {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            "memberId": RenderParam.member_id,
            "start_dt": RenderParam.start_dt,
            "end_dt": RenderParam.end_dt,
        }
        LMEPG.ajax.postAPI('DeviceCheck/getHeartRateSport', postData,
            function (data) {
                try {
                    if (data.result == 0) {
                        LMEPG.UI.dismissWaitingDialog();
                        if (data.list.length < 1) {
                            LMEPG.UI.showToast("心率数据为空!", 3, LMEPG.Intent.back())
                            return
                        }
                        console.log(">>>>>" + JSON.stringify(data));
                        Test.deepClone(data.list.slice(0, 60));
                        console.log(">>>>>" + JSON.stringify(Test.tempData));
                        TableComponents.render(Test.tempData, ["日期", "心率", "心率区间+时长"]);
                        if (data.level_list.length > 1) {
                            var total = data.level_list[0].num;
                            for (var i = 0; i < data.level_list.length; i++) {
                                if (i == 1) {
                                    G("low").innerHTML = data.level_list[i].num + "分钟";
                                    G("low-per").innerHTML = Math.round(parseInt(data.level_list[i].num) / total) + "%";
                                } else if (i == 2) {
                                    G("middle").innerHTML = data.level_list[i].num + "分钟";
                                    G("middle-per").innerHTML = Math.round(data.level_list[i].num / total) + "%";
                                } else if (i == 3) {
                                    G("higher").innerHTML = data.level_list[i].num + "分钟";
                                    G("higher-per").innerHTML = Math.round(data.level_list[i].num / total) + "%";
                                }
                            }
                        }

                    } else {
                        LMEPG.UI.dismissWaitingDialog();
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
    deepClone: function (list) {
        list.forEach(function (item) {
            Test.tempData.push({
                "param1": item.bit_dt,
                "param2": item.heart_rate+'次/分',
                "param3": item.rate_level,
            })
        })
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('heartRateList-wristband');
        objCurrent.setParam('page', Test.page);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        objCurrent.setParam('member_gender', RenderParam.member_gender);
        return objCurrent;
    },

};

var onBack = function () {
    LMEPG.Intent.back();
};