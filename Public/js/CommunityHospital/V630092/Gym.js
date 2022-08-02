var buttons = [];
/**
 * 返回确认
 */
/**
 * 返回事件
 */
function onBack() {
    if (isShow("dialog-phone")) {
        Hide("dialog-phone");
        LMEPG.ButtonManager.requestFocus("gym-link");

    } else {
        LMEPG.Intent.back();
    }
}
var Page = {
    count: 5,
    pageCurrent: 1,
    init: function () {
        Page.initButton();
        LMEPG.ButtonManager.init(["gym-link"], buttons, '', true);
        Page.toggleArrow()
    },

    initButton: function () {
        buttons.push(
            {
                id: 'gym-link',
                name: '',
                type: 'img',
                nextFocusLeft: 'recommended-2',
                nextFocusRight: 'recommended-2',
                click: Page.goPhoneDialog,
                beforeMoveChange: Page.swichPages

            }
        )
        buttons.push(
            {
                id: 'submit',
                name: '提交',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'clear',
                nextFocusUp: 'phoneText',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Activity/ActivityLecture/V1/bg_confirm.png',
                focusImage: g_appRootPath+'/Public/img/hd/Activity/ActivityLecture/V1/f_confirm.gif',
                click: Page.goSetPhoneNumber,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }
        )
        buttons.push(
            {
                id: 'clear',
                name: '取消',
                type: 'img',
                nextFocusLeft: 'submit',
                nextFocusRight: 'back',
                nextFocusUp: 'phoneText',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Activity/ActivityLecture/V1/bg_cancel.png',
                focusImage: g_appRootPath+'/Public/img/hd/Activity/ActivityLecture/V1/f_cancel.gif',
                click: onBack,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }
        )
        buttons.push(
            {
                id: 'phoneText',
                name: '号码框',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'submit',
                backgroundImage: '',
                focusImage: '',
                focusChange: Page.onFocuskeyBord,
                beforeMoveChange: "onCommonMoveChange",
                moveChange: ""
            }
        )
    },


    onFocuskeyBord: function (has, btn) {
        if (has)LMEPG.UI.keyboard.show(330, 150, 'phoneText', 'submit');
    },


    swichPages: function (dir, btn) {
        switch (dir) {
            case "left":
                Page.prePages();
                break;
            case "right":
                Page.nextPages();
                break;
        }
    },
    goPhoneDialog: function () {
        Show("dialog-phone");
        LMEPG.ButtonManager.requestFocus("submit");

    },

    /**
     * 去设置中奖电话号码
     */
    goSetPhoneNumber: function () {
        //获取用户填写的手机号
        var phoneTex = G("phoneText");
        var userTel = phoneTex.innerHTML;
        if (!LMEPG.Func.checkTelPhoneNumberValid(userTel)) {
            LMEPG.UI.showToast("请输入有效的手机号码");
            return;
        }
        ContactNumber.checkPhone(userTel, function () {
            var reqData = {
                "value": userTel + ",",
                "key": "Gym"
            };
            LMEPG.ajax.postAPI('Common/saveData', reqData,
                function (data) {
                    try {
                        var result = data.result;
                        if (result == 0) {  // 设置号码成功
                            LMEPG.UI.showToast("提交成功", 3);
                            Hide("dialog-phone");
                            Show("dialog-success");
                            LMEPG.ButtonManager.requestFocus("gym-link");
                        } else { // 设置号码失败
                            LMEPG.UI.showToast("提交失败，请重试！");
                            Focus.closeDialog();
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("保存手机号结果处理异常！");
                        LMEPG.Log.error(e.toString());
                        Focus.closeDialog();
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("请求保存手机号发生错误！");
                }
            );
        });
    },

    prePages: function () {
        Page.pageCurrent = Math.max(1, Page.pageCurrent -= 1);
        G("gym-link").src = g_appRootPath+"/Public/img/hd/CommunityHospital/EyeHospital/" + Page.pageCurrent + ".jpg";
        Page.toggleArrow()
    },
    nextPages: function () {
        Page.pageCurrent = Math.min(Page.count, Page.pageCurrent += 1);
        G("gym-link").src = g_appRootPath+"/Public/img/hd/CommunityHospital/EyeHospital/" + Page.pageCurrent + ".jpg";
        Page.toggleArrow()
    },
    toggleArrow: function () {
        S('left-arrow');
        S('right-arrow');
        this.pageCurrent == 1 && H('left-arrow');
        this.pageCurrent == this.count && H('right-arrow');
        console.log(this.page, this.maxPage)
    },
}

var ContactNumber = {
//        校验手机号是否存在
    checkPhone: function (tel, callBack) {
        var reqJsonObj2 = {
            "key": "Gym"
        };
        LMEPG.ajax.postAPI("Common/queryData", reqJsonObj2, function (data) {
                var data = data instanceof Object ? data : JSON.parse(data);
                if (data.result == "0") {
                    var telArry = data.val.split(",");
                    var isExist = telArry.some(function (item) {
                        return tel == item;
                    })
                    if (isExist) {
                        LMEPG.UI.showToast("电话号码已经存在", 3);
                        return;
                    } else {
                        LMEPG.call(callBack);
                    }
                }
                else if (data.result == -101) {
                    LMEPG.call(callBack);
                } else {
                    LMEPG.UI.showToast("电话号码校验失败", 3);
                }
            }
        )
        ;

    }
}