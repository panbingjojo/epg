var LMActivity = {
    page: {
        /**
         * 获取当前页对象
         */
        getCurrentPage: function getCurrentPage() {
            var objCurrent = LMEPG.Intent.createIntent("activity-common-guide");
            objCurrent.setParam("userId",RenderParam.userId);
            objCurrent.setParam("inner", RenderParam.inner);
            return objCurrent;
        },

        /**
         * @func 进行购买操作
         * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
         * @returns {boolean}
         */
        jumpBuyVip: function () {
            var objCurrent = this.getCurrentPage();

            var objOrderHome = LMEPG.Intent.createIntent("orderHome");
            objOrderHome.setParam("userId", RenderParam.userId);
            objOrderHome.setParam("directPay", "1");
            objOrderHome.setParam("orderReason", "101");
            objOrderHome.setParam("remark", RenderParam.activityName);

            var objActivityGuide = LMEPG.Intent.createIntent("activity-common-guide");
            objActivityGuide.setParam("userId", RenderParam.userId);
            objActivityGuide.setParam("inner", RenderParam.inner);
            objActivityGuide.setParam("isOrderBack", "1"); // 表示订购回来

            LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
        },

        reload: function () {
            LMEPG.ButtonManager.setKeyEventPause(true);
            LMEPG.UI.showWaitingDialog('', 0.4, function () {
                LMEPG.Intent.jump(LMActivity.page.getCurrentPage());
            });
        },

        goBack: function () {
            LMEPG.Intent.back(); // 应用内活动，直接返回上一级页面
        }
    },

    ajaxHelper: {
        updatePrizerPhone: function (userTel, prizeIndex, callback) {
            var reqData = {
                "phoneNumber": userTel,
                "prizeIdx": prizeIndex
            };
            LMEPG.ajax.postAPI('Activity/setPhoneNumber', reqData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {
                            LMEPG.UI.showToast("提交电话成功！");
                            callback();
                        } else {
                            LMEPG.UI.showToast("提交失败，请重试！");
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("保存手机号结果处理异常！");
                        LMEPG.Log.error(e.toString());
                        console.log(e.toString())
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("请求保存手机号发生错误！");
                });
        },
        lottery: function (extraTimes,successCallback) {
            var postData = {
                "action": "lottery",
                "extraTimes": extraTimes,
                "lottery": 1
            };
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Activity/commonAjax', postData,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        successCallback(data.result, data.prize_idx);
                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        console.log(e)
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                }
            );
        },
        saveData: function (key, value, successCallback) {
            var postData = {
                "key": key,
                "value": value
            };
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Common/saveData', postData,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        successCallback(data.result, data.prize_idx);
                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        console.log(e)
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                }
            );
        },
        addExtraTimes: function (successCallback, errCallback) {
            var postData = {};
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Activity/addExtraTimes', postData,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        if (data.result == 0) {
                            successCallback();
                        } else {
                            errCallback();
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        console.log(e)
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                }
            );
        },
        subExtraTimes: function (successCallback, errCallback) {
            var postData = {};
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Activity/subExtraTimes', postData,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        if (data.result == 0) {
                            successCallback();
                        } else {
                            errCallback();
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        console.log(e)
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                }
            );
        }
    },

    func: {
        formatWinnerUser: function (str) {
            return str.substring(0, 3) + "***" + str.substring(str.length - 3);
        },

        formatWinnerDate: function (dateStr) {
            return new Date(LMActivity.func.getStandardDt(dateStr)).format("yyyy-MM-dd");
        },

        getStandardDt: function (dt) {
            var time = dt.replace(/-/g, ':').replace(' ', ':');
            time = time.split(':');
            return new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
        },
    },
};

(function () {
    function LMActivityDialog(options) {
        options = options || {};
        // 挂载点
        this.el = options.el;
        // 页面内容
        this.dialogHtml = options.dialogHtml;
        // 页面按钮
        this.buttons = options.buttons;
        // 默认焦点
        this.focusId = options.focusId;
        // 退出选中焦点
        this.dismissFocusId = options.dismissFocusId;
    }

    LMActivityDialog.prototype.showDialog = function () {
        G(this.el).innerHTML = this.dialogHtml;
        LMEPG.ButtonManager.addButtons(this.buttons);
        LMEPG.ButtonManager.requestFocus(this.focusId);
    };

    LMActivityDialog.prototype.dismissDialog = function () {
        G(this.el).innerHTML = "";
        LMEPG.ButtonManager.deleteButtons(this.buttons);
        LMEPG.ButtonManager.requestFocus(this.dismissFocusId);
    };

    window.LMActivityDialog = LMActivityDialog;
})();
