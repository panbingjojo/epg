/**
 * 返回确认
 */
function onBack() {
    if (G("toast").style.display == "block") {
        G("toast").style.display = "none";
        G("btn-phone").style.display = "none";
        LMEPG.BM.requestFocus(Page.currentBtn);
    } else {
        LMEPG.Intent.back();
    }
}
limitLength = 11;
var buttons = [];
var Page = {
    currentBtn: "",
    list: [1, 2, 3, 4, 5],
    currentPage: 0,
    count: 4,
    initBtn: function () {
        for (var i = 0; i < Page.count; i++) {
            buttons.push({
                id: 'btn-' + (i + 1),
                name: '',
                type: 'img',
                nextFocusLeft: 'btn-' + i,
                nextFocusRight: 'btn-' + (i + 2),
                click: Page.showCode,
                focusChange: Page.btnFocus,
                backgroundImage: '',
                moveChange: "",
                cIdx: "",
                beforeMoveChange: Page.onBeforeMoveChange
            })
        }
        buttons.push(
            {
                id: 'toast',
                name: '',
                type: 'img',
                nextFocusLeft: 'btn-',
                nextFocusRight: 'btn-',
                click: ContactNumber.startPhone,
            }
        )
    },
    btnFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "focus");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "focus");
        }
    },

    init: function () {
        Page.initBtn();
        Page.createHtml();
        LMEPG.ButtonManager.init("btn-1", buttons, "", true);
    },
    cutData: function (data) {
        var currentData = data.slice(Page.currentPage, Page.count + Page.currentPage);
        return currentData;
    },
    createHtml: function () {
        G("container").innerHTML = "";
        var strHtml = '';
        var arryData = Page.cutData(Page.list);
        for (var i = 0; i < arryData.length; i++) {
            strHtml += '<img id="btn-' + (i + 1) + '" src="'+ g_appRootPath +'/Public/img/hd/CommunityHospital/FifHospital/img_pic_' + arryData[i] + '.png"  zIndex="' + arryData[i] + '" alt="">';
        }
        G("container").innerHTML = strHtml;
        Page.toggleArrow();
    },
    prePage: function () {
        Page.currentPage = Math.max(0, Page.currentPage -= 1);
        Page.createHtml();
        LMEPG.BM.requestFocus("btn-1");
    },
    nextPage: function () {
        Page.currentPage = Math.min(1, Page.currentPage += 1);
        Page.createHtml();
        LMEPG.BM.requestFocus("btn-4");
    },
    onBeforeMoveChange: function (key, btn) {

        if (key == 'left' && btn.id == "btn-1") {
            Page.prePage();
        }
        if (key == 'right' && btn.id == "btn-4") {
            Page.nextPage();
        }
    },
    toggleArrow: function () {
        S('prev-arrow');
        S('next-arrow');
        Page.currentPage == 0 && H('prev-arrow');
        Page.currentPage == 1 && H('next-arrow');
    },

    showCode: function (btn) {
        G("btn-phone").style.display = "block";
        G("toast").style.display = "block";
        var index = G(btn.id).getAttribute("zIndex");
        G("toast").src = g_appRootPath+'/Public/img/hd/CommunityHospital/FifHospital/' + index + '.png';
        Page.currentBtn = btn.id;
        LMEPG.BM.requestFocus("toast");
    },
}

var ContactNumber = {
//        校验手机号是否存在
    checkPhone: function (tel, callBack) {
        var reqJsonObj2 = {
            "key": "MedicalCenter"
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
//
            } else if (data.result == -101) {
                LMEPG.call(callBack);
            } else {
                LMEPG.UI.showToast("电话号码校验失败", 3);
            }
        });

    },
    startPhone: function () {
        LMEPG.UI.keyboard.addCloseCallBack(function () {
            LMEPG.ButtonManager.init('gid_common_edit_dialog_input', buttons, '', true);
            LMEPG.KeyEventManager.addKeyEvent("KEY_BACK", 'LMEPG.UI.commonEditDialog.dismiss()');
        });
        LMEPG.UI.commonEditDialog.show("请输入手机号进行预约。", ["确&nbsp;&nbsp;定", "取&nbsp;&nbsp;消"], function (btnIndex, inputValue) {
            if (btnIndex === 0) {
                if (LMEPG.Func.isTelPhoneMatched(inputValue)) {
                    ContactNumber.checkPhone(inputValue, function () {
                        var reqJsonObj = {
                            "value": inputValue + ",",
                            "key": "MedicalCenter"
                        };
                        LMEPG.ajax.postAPI("Common/saveData", reqJsonObj, function (data) {
                            var tempDataObj = data instanceof Object ? data : JSON.parse(data);
                            if (tempDataObj.result == "0") {
                                LMEPG.UI.commonEditDialog.dismiss();
                                LMEPG.UI.showToast("请等待人工审核回复");
//                                window.location.href = payBackUrl;
                            } else {
                                LMEPG.UI.showToast("提交失败，请重新提交", 5);
                            }
                        });
                    });
                    return true;
                } else {
                    LMEPG.UI.showToast("请输入正确的电话号码");
                    return true;
                }
            } else {
//                    window.location.href = payBackUrl;
            }
        }, ['联系方式：', "", '在此输入手机号码...', 'tel']);
    }
};