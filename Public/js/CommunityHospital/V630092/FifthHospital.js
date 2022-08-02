var Rout = {
    EXPERTS_INTRODUCE: "experts-introduce", //医生列表
    ESPECIALLY_DEPARTMENT: "especially-department",//医院
    ENTRYTYPENAME: "eye-hospital",
    EXPERT_DETAIL: "department-introduce",//医院
    HOSPITAL_PACKAGE:"hospitalPackage",
}
var Data = {
    videoInfo: [
        {
            'sourceId': "8122",
            'videoUrl': "Program1006152",
            'title': "爱耳日",
            'unionCode': "d5yy001",
        },
        {
            'sourceId': "8123",
            'videoUrl': "Program1006153",
            'title': "碘缺乏日专访石元同主任~1",
            'unionCode': "d5yy002",
        },
        {
            'sourceId': "8124",
            'videoUrl': "Program1006154",
            'title': "世界卫生日呼吸内科专家给您讲流感",
            'unionCode': "d5yy003",
        }, {
            'sourceId': "8125",
            'videoUrl': "Program1006155",
            'title': "睡眠日改",
            'unionCode': "d5yy004",
        },{
            "sourceId": "8126",
            "videoUrl": "Program1006156",
            "title": "因你珍稀 所以珍惜丨国际罕见病日",
            "unionCode": "d5yy005",

        }
    ],
};
var buttons = [];

var Pages = {
    imgUrl:  g_appRootPath+ "/Public/img/hd/CommunityHospital/EyeHospital/",
    classType: ["focus", "carousel", "album2"],
    data: [],
    init: function () {
        Pages.initRecommendedBtn();
        Pages.initAlbum();
        LMEPG.ButtonManager.init(RenderParam.focusIndex, buttons, "", true);
        // 启动小窗口播放
        Play.startPollPlay();
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
            cRout: Rout.EXPERT_DETAIL,
        })
        buttons.push({
            id: 'recommended-2',
            name: '',
            type: 'img',
            nextFocusLeft: 'recommended-1',
            nextFocusRight: 'recommended-3',
            nextFocusUp: '',
            nextFocusDown: 'album-1',
            click: Pages.parseVideoInfo,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: 5,
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
            cRout: Rout.ESPECIALLY_DEPARTMENT,
        })
        buttons.push({
            id: 'recommended-5',
            name: '',
            type: 'img',
            nextFocusLeft: 'recommended-2',
            nextFocusRight: '',
            nextFocusUp: 'recommended-3',
            nextFocusDown: 'album-1',
            click: Pages.btnClick,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: "",
            cType: 0,
            cRout: Rout.HOSPITAL_PACKAGE,
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
            if (btn.id == "recommended-2") {
                G("recommended-2").style.display = "block";
            } else {
                LMEPG.CssManager.addClass(btn.id, Pages.classType[btn.cType]);
            }
        } else {
            if (btn.id == "recommended-2") {
                G("recommended-2").style.display = "none";
            } else {
                LMEPG.CssManager.removeClass(btn.id, Pages.classType[btn.cType]);

            }
        }
    },
    btnClick: function (btn) {
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
    var objCurrent = LMEPG.Intent.createIntent("fifthHospital");
    objCurrent.setParam("userId", RenderParam.userId);
    objCurrent.setParam("inner", RenderParam.inner);
    objCurrent.setParam("focusIndex2", LMEPG.BM.getCurrentButton().id);
    return objCurrent;
}

/**
 * 跳转到弹框页
 */
function jumpRout(text) {
    var objCurrent = getCurrentPage();
    var objDialog = LMEPG.Intent.createIntent(text);
    objDialog.setParam("userId", "{$userId}");
    objDialog.setParam("inner", "{$inner}");
    if(text=="department-introduce"){
        objDialog.setParam("channel", 3);
    } else {
        objDialog.setParam("channel", 2);
    }
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