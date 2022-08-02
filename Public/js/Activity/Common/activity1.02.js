var LMActivity = {
    intent: {
        /**
         * 获取当前页对象
         */
        getCurrentPage: function getCurrentPage(userId, inner) {
            var objCurrent = LMEPG.Intent.createIntent("activity-common-guide");
            objCurrent.setParam("userId", userId);
            objCurrent.setParam("inner", inner);
            return objCurrent;
        },

        /**
         * @func 进行购买操作
         * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
         * @returns {boolean}
         */
        jumpBuyVip: function (userId, inner, activityName) {
            var objCurrent = this.getCurrentPage(userId, inner);

            var objOrderHome = LMEPG.Intent.createIntent("orderHome");
            objOrderHome.setParam("userId", userId);
            objOrderHome.setParam("directPay", "1");
            objOrderHome.setParam("orderReason", "101");
            objOrderHome.setParam("remark", activityName);

            var objActivityGuide = LMEPG.Intent.createIntent("activity-common-guide");
            objActivityGuide.setParam("userId", userId);
            objActivityGuide.setParam("inner", inner);
            objActivityGuide.setParam("isOrderBack", "1"); // 表示订购回来

            LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
        },

        reload: function (userId, inner) {
            LMEPG.ButtonManager.setKeyEventPause(true);
            LMEPG.UI.showWaitingDialog('', 0.4, function () {
                LMEPG.Intent.jump(LMActivity.intent.getCurrentPage(userId, inner));
            });
        },

        goBack: function () {
            LMEPG.Intent.back(); // 应用内活动，直接返回上一级页面
        }
    },

    ajaxHelper: {
        updateScore: function (score,callback) {
            // 未清扫、剩余次数大于0
            var reqData = {
                'score': score,
                'remark': '用户积分'
            };
            LMEPG.ajax.postAPI('Activity/addUserScore', reqData,
                function (data) {
                    try {
                        if (data.result != 0) {
                            LMEPG.UI.showToast("上传积分失败!");
                        }
                        callback()
                    } catch (e) {
                        LMEPG.UI.showToast("上传积分解析异常!" + e);
                    }
                },
                function (data) {
//                        LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("上传积分请求失败!");
                }
            );
        },
        uploadPlayRecord: function (extraTimes,callback) {
            var postData = {
                "extraTimes": extraTimes
            };
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Activity/uploadPlayedRecord', postData,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        callback();
                        console.log('--->uploadAnswerResult: 上报参与记录' + (result == 0 ? '成功！' : '失败！'));
                        LMEPG.Log.info('--->uploadAnswerResult: 上报参与记录' + (result == 0 ? '成功！' : '失败！'));
                    } catch (e) {
                        console.log('--->uploadAnswerResult: 上报参与记录解析异常！error:' + e.toString());
                        LMEPG.Log.info('--->uploadAnswerResult: 上报参与记录解析异常！error:' + e.toString());
                    }
                },
                function (rsp) {
                    console.log('--->uploadAnswerResult: 上报参与记录发生错误！rsp:' + rsp.toString());
                    LMEPG.Log.info('--->uploadAnswerResult: 上报参与记录发生错误！rsp:' + rsp.toString());
                }
            );
        },
        setPrizePhone: function (userTel, prizeIdx,successCallback,errorCallback) {
            var reqData = {
                "action": "phone",
                "number": userTel,
                "prizeIdx": prizeIdx
            };
            LMEPG.ajax.postAPI('Activity/commonAjax', reqData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {
                            LMEPG.UI.showToast("提交电话成功！");
                            successCallback();
                        } else {
                            LMEPG.UI.showToast("提交失败，请重试！");
                            errorCallback();
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
        updatePrizePhone: function (userTel, prizeIndex, isExchange,successCallback,errorCallback) {
            var reqData = {
                "phoneNumber": userTel,
                "prizeIdx": prizeIndex
            };
            var url = 'Activity/setPhoneNumber';
            if (isExchange){
                url = 'Activity/setPhoneNumberForExchange'
            }
            LMEPG.ajax.postAPI(url, reqData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {
                            LMEPG.UI.showToast("提交电话成功！");
                            successCallback();
                        } else {
                            LMEPG.UI.showToast("提交失败，请重试！");
                            errorCallback();
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
        lottery: function (successCallback) {
            var postData = {
                "action": "lottery",
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
        },
        exchangePrize: function (id,successCallback,errorCallback) {
            var postData = {
                action: "bgExchange",
                goodsId: id,
                score: 0
            };
            LMEPG.UI.showWaitingDialog();
            LMEPG.ButtonManager.setKeyEventPause(true);
            LMEPG.ajax.postAPI('Activity/commonAjax', postData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : rsp ? JSON.parse(rsp) : rsp;
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.ButtonManager.setKeyEventPause(false);
                        if ( data.result == 0 ){
                            successCallback(id);
                        }else {
                            errorCallback(data.result);
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        LMEPG.Log.error(e.toString());
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                }
            );
        }
    },

    func: {
        isNull: function (param) {
            // 判空操作
            return param ? param : "";
        },

        formatWinnerUser: function (str) {
            if (str){
                return str.substring(0, 3) + "***" + str.substring(str.length - 3);
            }
        },

        formatWinnerDate: function (dateStr) {
            if (dateStr){
                return new Date(LMActivity.func.getStandardDt(dateStr)).format("yyyy-MM-dd");
            }
        },

        getStandardDt: function (dt) {
            var time = dt.replace(/-/g, ':').replace(' ', ':');
            time = time.split(':');
            return new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
        }
    }
};

/**
 *  通用对话框
 */
(function () {
    function LMActivityDialog(options) {
        options = options || {};
        for (var attr in options) {
            if (options.hasOwnProperty(attr)) {
                this[attr] = options[attr];
            }
        }
    }

    LMActivityDialog.prototype.showDialog = function () {
        G(this.el).innerHTML = this.dialogHtml;
        LMEPG.ButtonManager.addButtons(this.buttons);
        LMEPG.ButtonManager.requestFocus(this.focusId);
        LMActivity.showDialog = this;
        this.isShow = true;
    };

    LMActivityDialog.prototype.dismissDialog = function () {
        G(this.el).innerHTML = "";
        LMEPG.ButtonManager.deleteButtons(this.buttons);
        LMEPG.ButtonManager.requestFocus(this.dismissFocusId);
        LMActivity.showDialog = null;
        this.isShow = false;
    };

    LMActivity.LMActivityDialog = LMActivityDialog;
})();
