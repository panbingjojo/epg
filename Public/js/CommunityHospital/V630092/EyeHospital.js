/**
 * 返回确认
 */
function onBack() {
    LMEPG.Intent.back();
}
/**
 * 获取当前页对象
 */
function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent("eye-hospital");
    objCurrent.setParam("focusIndex2", LMEPG.BM.getCurrentButton().id)
    return objCurrent;
}

/**
 * 跳转到弹框页
 */
function jumpRout(text) {
    var objCurrent = getCurrentPage();
    var objDialog = LMEPG.Intent.createIntent(text);
    LMEPG.Intent.jump(objDialog, objCurrent);
}

/**
 * 跳转到弹框页
 */
function jumpEye() {
    var objCurrent = getCurrentPage();
    var objDialog = LMEPG.Intent.createIntent("experts-introduce");
    LMEPG.Intent.jump(objDialog, objCurrent);
}
var Rout = {
    EXPERTS_INTRODUCE: "experts-introduce", //医生列表
    ESPECIALLY_DEPARTMENT: "especially-department",//医院
    ENTRYTYPENAME: "eye-hospital"
}
var Data = {
    videoInfo: [
        {
            'sourceId': "8086",
            'videoUrl': "Program1006045",
            'title': "大四学姐对学弟学妹的忠告（标示出处版）",
            'unionCode': "aeyk016",
        },
        {
            'sourceId': "8088",
            'videoUrl': "Program1006047",
            'title': "屌丝小明悲催的生活",
            'unionCode': "aeyk018",
        },
        {
            'sourceId': "8092",
            'videoUrl': "Program1006051",
            'title': "8分钟详解近视眼",
            'unionCode': "aeyk022",
        }, {
            'sourceId': "8109",
            'videoUrl': "Program1006068",
            'title': "告别近视眼",
            'unionCode': "aeyk039",
        }
    ],
};
var buttons = [];
var ContactNumber = {
//        校验手机号是否存在
        checkPhone: function (tel, callBack) {
            var reqJsonObj2 = {
                "key": "AierOphthalmology"
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
                    } else if (data.result == -101) {
                        LMEPG.call(callBack);
                    } else {
                        LMEPG.UI.showToast("电话号码校验失败", 3);
                    }
                }
            )
            ;

        },
        startPhone: function () {
            if (Animal.index != 0 && Animal.index != 1) {
                return;
            }
            LMEPG.UI.keyboard.addCloseCallBack(function () {
                LMEPG.ButtonManager.init('gid_common_edit_dialog_input', buttons, '', true);
                LMEPG.KeyEventManager.addKeyEvent("KEY_BACK", 'LMEPG.UI.commonEditDialog.dismiss()');
            });
            LMEPG.UI.commonEditDialog.show("请输入手机号免费进行领取。", ["确&nbsp;&nbsp;定", "取&nbsp;&nbsp;消"], function (btnIndex, inputValue) {
                if (btnIndex === 0) {
                    if (LMEPG.Func.isTelPhoneMatched(inputValue)) {
                        ContactNumber.checkPhone(inputValue, function () {
                            var reqJsonObj = {
                                "value": inputValue + ",",
                                "key": "AierOphthalmology"
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
    }
    ;
var Pages = {
    imgUrl:  g_appRootPath+ "/Public/img/hd/CommunityHospital/EyeHospital/",
    classType: ["focus", "carousel", "album2"],
    data: [],
    init: function () {
        Pages.initRecommendedBtn();
        Pages.initAlbum();

        LMEPG.ButtonManager.init(RenderParam.focusIndex, buttons, "", true);
        Animal.timeOut();
    },
    initRecommendedBtn: function () {
        buttons.push({
            id: 'recommended-1',
            name: '',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommended-2',
            nextFocusUp: '',
            nextFocusDown: 'recommended-4',
            click: Pages.btnClick,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: "",
            cType: 0,
            cRout: Rout.ESPECIALLY_DEPARTMENT,
        })
        buttons.push({
            id: 'recommended-2',
            name: '',
            type: 'img',
            nextFocusLeft: 'recommended-1',
            nextFocusRight: 'recommended-3',
            nextFocusUp: '',
            nextFocusDown: 'album-1',
            click: ContactNumber.startPhone,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: "",
            cType: 1,
            cRout: Rout.EXPERTS_INTRODUCE,
        })
        buttons.push({
            id: 'recommended-3',
            name: '',
            type: 'img',
            nextFocusLeft: 'recommended-2',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommended-5',
            click: Pages.btnClick,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: "",
            cType: 0,
            cRout: Rout.EXPERTS_INTRODUCE,
        })
        buttons.push({
            id: 'recommended-4',
            name: '',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommended-2',
            nextFocusUp: 'recommended-1',
            nextFocusDown: 'album-1',
            click: Pages.btnClick,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: "",
            cType: 0,
        })
        buttons.push({
            id: 'recommended-5',
            name: '',
            type: 'img',
            nextFocusLeft: 'recommended-2',
            nextFocusRight: '',
            nextFocusUp: 'recommended-3',
            nextFocusDown: 'album-1',
            click: Pages.jumpHealthVideoHome,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: "",
            cType: 0,
        })
    },
    initAlbum: function () {
        for (var i = 1; i < 5; i++) {
            buttons.push({
                id: 'album-' + i,
                name: '',
                type: 'img',
                nextFocusLeft: 'album-' + (i - 1),
                nextFocusRight: 'album-' + (i + 1),
                nextFocusUp: 'recommended-4',
                nextFocusDown: '',
                click: Pages.parseVideoInfo,
                focusChange: Pages.btnFocus,
                moveChange: "",
                cIdx: i,
                cType: 2,
            })
        }
    },

    btnFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, Pages.classType[btn.cType]);
        } else {
            LMEPG.CssManager.removeClass(btn.id, Pages.classType[btn.cType]);
        }
    },
    btnClick: function (btn) {
        if (btn.id == "recommended-4") {
            LMEPG.UI.showToast("该功能暂时未开放");
            return;
        }
        jumpRout(btn.cRout);
    },
    parseVideoInfo: function (btn) {
        var videoInfo = Data.videoInfo[(btn.cIdx) - 1];
        var videoParams = {
            'sourceId': videoInfo.source_id,
            'videoUrl': videoInfo.videoUrl,
            'title': videoInfo.title,
            'type': 2,
            'entryType': 4,
            'entryTypeName': Rout.ENTRYTYPENAME,
            'userType': 0,
            'freeSeconds': 0,
            'focusIdx': LMEPG.BM.getCurrentButton().id,
            'unionCode': videoInfo.union_code
        };
        Pages.playVideo(videoParams);
    },

    playVideo: function (videoParams) {
        var objCurrent = getCurrentPage();
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('videoInfo', JSON.stringify(videoParams));
        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    /**
     * 跳转 -- 更多视频页
     */
    jumpHealthVideoHome: function () {
        var objHome = getCurrentPage();
        objHome.setParam("fromId", "2");

        var objChannel = LMEPG.Intent.createIntent("healthVideoList");
        objHome.setParam("userId", "{$userId}");
        objChannel.setParam("page", typeof (page) === "undefined" ? "1" : page);
        objChannel.setParam("modeTitle", "了解近视");
        objChannel.setParam("modelType", 30);
        LMEPG.Intent.jump(objChannel, objHome);
    },
}

var Animal = {
    index: 0,
    timer: null,
    timeOut: function () {
        Pages.timer = setInterval(function () {
            Animal.nextBlock()
        }, 3000)
    },
    nextBlock: function () {
        if (Animal.index < 3) {
            Animal.index++;
        } else {
            Animal.index = 1;
        }
        for (var i = 1; i < 4; i++) {
            G("carousel-focus-radius-" + i).className = "radius withe"
        }
        G("carousel-focus-radius-" + Animal.index).className = "radius blue";
        G("recommended-2").src = Pages.imgUrl + "carousel_" + Animal.index + ".png"
        console.log(Animal.index);
    }
}

