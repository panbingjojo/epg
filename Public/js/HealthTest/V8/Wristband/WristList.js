var buttons = [];
var Page = {
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('wristList-wristband');
        objCurrent.setParam('page', Test.page);
        objCurrent.setParam('focusId', "update-wrist");
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        objCurrent.setParam('member_gender', RenderParam.member_gender);
        return objCurrent;
    },
}
var Test = {
    isBind: false,
    deviceId: null,
    data: null,
    jumpRouter: ["stepCount-wristband", "heartRateList-wristband", "sportList-wristband", "sleepList-wristband"],
    init: function () {
        /**
         * 起始页数为零
         * 数据最后一个除以条数再向下取整得到最大页数
         * @type {number}
         */
        // this.render();
        this.initView();
        this.queryWristBindStatus();
        this.getMemberRecentData();
        this.createBtns();
        AddMemberMask.editType = "edit";

    },

    initView: function () {
        H('update-wrist');
        H('delete-wrist');
        H('text-mac');
    },

    initData: function () {
        if (Test.data.step_date != null) {
            G('distance-text').innerHTML = (parseInt(Test.data.step_date.distance) / 1000).toFixed(1) + "公里";
            G('calories-text').innerHTML = Test.data.step_date.calories + "大卡";
            G('step-text').innerHTML = Test.data.step_date.step;
            G('step-updata-time').innerHTML = Test.data.step_date.update_dt + "更新";
        }
        if (Test.data.rate_data != null) {
            // var sum = 0;
            // for (var i = 0; i < Test.data.rate_data.heartRate.length; i++) {
            //     var item = Test.data.rate_data.heartRate[i];
            //     sum += parseInt(item);
            // }
            // G('heart-num-text').innerHTML = (sum/parseInt(Test.data.rate_data.dataSize)).toFixed(0);
            G('heart-num-text').innerHTML = Test.data.rate_data.heartRate[0];
            G('heart-rate-update-time').innerHTML = Test.data.rate_data.updateTime + "更新";
        }
        if (Test.data.exercise_data != null) {
            G('duration-text').innerHTML = (parseInt(Test.data.exercise_data.time) / 60).toFixed(0);
            G('exercise-update-time').innerHTML = Test.data.exercise_data.updateTime + "更新";
        }

        if (Test.data.sleep_data != null) {
            G('sleep-update-time').innerHTML = Test.data.sleep_data.updateTime + "更新";
        }
    },

    queryWristBindStatus: function () {
        LMEPG.ajax.postAPI('DeviceCheck/queryRememberWrist', "",
            function (data) {
                if (data.result == 1 && data.list != 'undefined' && data.list != null) {
                    for (var i = 0; i < data.list.length; i++) {
                        var item = data.list[i];
                        if (item.member_id == RenderParam.member_id) {
                            S('update-wrist');
                            S('delete-wrist');
                            S('text-mac');
                            G('macId').innerHTML = "MAC: " + item.device_id
                            Test.isBind = true;
                            Test.deviceId = item.device_id;
                        }
                    }
                }
            },
            function (data) {
                // LMEPG.UI.showToast("手环绑定状态请求失败!");
            }
        );
    },

    getMemberRecentData: function () {
        var params = {
            memberId: RenderParam.member_id
        }
        LMEPG.ajax.postAPI('DeviceCheck/getMemberRecentData', params,
            function (res) {
                if (res.result == 0) {
                    Test.data = res.data;
                    console.log(res)
                    Test.initData();
                } else {

                }
            },
            function (data) {
                LMEPG.UI.showToast("手环绑定状态请求失败!");
            }
        );
    },

    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('wristList-wristband');
        objCurrent.setParam('page', Test.page);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        objCurrent.setParam('member_gender', RenderParam.member_gender);
        return objCurrent;
    },
    /**
     * 跳转健康检测记录
     */
    jumpHealthTestRecord: function (testType) {
        var curObj = Test.getCurrentPage();
        if (testType == 6) {
            var dstObj = LMEPG.Intent.createIntent('weight-list');
        } else if (testType == 7) {
            var dstObj = LMEPG.Intent.createIntent('wristList-wristband');
        } else {
            var dstObj = LMEPG.Intent.createIntent('testList');
        }
        dstObj.setParam('member_id', RenderParam.member_id);
        dstObj.setParam('member_name', RenderParam.member_name);
        dstObj.setParam('member_image_id', RenderParam.member_image_id);
        dstObj.setParam('member_gender', RenderParam.member_gender);
        dstObj.setParam('testType', testType);
        LMEPG.Intent.jump(dstObj, curObj);
    },
    onBeforeMoveChange: function (dir, curent) {
        switch (dir) {
            case "up":
                if (curent.id == "recd-btn-1" || curent.id == "recd-btn-2") {
                    if (Test.isBind) {
                        LMEPG.BM.requestFocus("update-wrist");
                    }
                }
                break;
        }
    },

    onFocusBtn: function (btn, has) {
        if (has) {
            LMEPG.CssManager.addClass(btn.id, "focusBtn");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "focusBtn");
        }
    },
    onClick: function (btn) {
        if (btn.id == "delete-wrist") {
            modal.commonDialog({
                beClickBtnId: "delete-wrist",
                onClick: Test.deleteMember
            }, '移除设备后，所有的手环记录将无法恢复，<br/>确定移除吗？');
            return;
        } else {
            AddMemberMask.show("update-wrist", function (btn) {
                Test.replaceMember(btn.cType)
            });
        }
    },

    deleteMember: function () {
        var postData = {
            memberId: RenderParam.member_id,
            device_id: Test.deviceId
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('DeviceCheck/removeMember', postData,
            function (data) {
                try {
                    if (data.result == 0) {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("移除设备成功");
                        LMEPG.Intent.back();
                    } else {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("移除设备失败");
                        modal.hide();
                    }
                } catch (e) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("移除设备解析异常!" + e);
                }
            },
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("移除设备请求失败!");
            }
        );
    },

    replaceMember: function (id) {
        var postData = {
            memberId: id,
            oldMemberId: RenderParam.member_id,
            deviceId: Test.deviceId,
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('DeviceCheck/replaceMember', postData,
            function (data) {
                try {
                    if (data.result == 0) {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("更换成员成功");
                        LMEPG.Intent.back();
                    } else {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("更换成员失败");
                    }
                } catch (e) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("更换成员解析异常!" + e);
                }
            },
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("更换成员请求失败!");
            }
        );
    },

    jumpType: function (btn) {
        var curObj = Test.getCurrentPage();
        var dstObj = LMEPG.Intent.createIntent(Test.jumpRouter[btn.cIndex]);

        dstObj.setParam('member_id', RenderParam.member_id);
        dstObj.setParam('member_name', RenderParam.member_name);
        dstObj.setParam('member_image_id', RenderParam.member_image_id);
        dstObj.setParam('member_gender', RenderParam.member_gender);
        dstObj.setParam('device_id', Test.deviceId);
        LMEPG.Intent.jump(dstObj, curObj);
    },


    createBtns: function () {
        var FOCUS_COUNT = 4;
        while (FOCUS_COUNT--) {
            buttons.push({
                id: 'recd-btn-' + (FOCUS_COUNT + 1),
                type: 'img',
                nextFocusLeft: 'recd-btn-' + FOCUS_COUNT,
                nextFocusRight: 'recd-btn-' + (FOCUS_COUNT + 2),
                nextFocusUp: 'recd-btn-' + (FOCUS_COUNT - 1),
                nextFocusDown: 'recd-btn-' + (FOCUS_COUNT + 3),
                click: this.jumpType,
                focusChange: this.onFocusBtn,
                beforeMoveChange: this.onBeforeMoveChange,
                cIndex: FOCUS_COUNT
            });
        }
        buttons.push({
            id: 'update-wrist',
            type: 'img',
            nextFocusDown: 'recd-btn-1',
            nextFocusRight: 'delete-wrist',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/Wristband/change.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/Wristband/change_f.png',
            click: this.onClick,
        })
        buttons.push({
            id: 'delete-wrist',
            type: 'img',
            nextFocusLeft: 'update-wrist',
            nextFocusDown: 'recd-btn-1',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/Wristband/delete.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/Wristband/delete_f.png',
            click: this.onClick,
        })
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'recd-btn-1', buttons, '', true);
    }
};

var onBack = function () {
    LMEPG.Intent.back();
};