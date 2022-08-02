/***********************首页导航栏js控制***************************/
// 定义全局按钮
var buttons = [];

var HomeEntryType = {
    VIDEO_VISIT_BY_DEPART: 1, //视频问诊-科室
    VIDEO_VISIT_BY_DOCTOR: 2, //视频问诊-医生
    ACTIVITYS: 3,   //活动
    HEALTH_VIDEO_BY_TYPES: 4, //健康视频分类
    HEALTH_VIDEO: 5,  //健康视频
    DEVICE_STORES: 6,//设备商城
    DEVICE_STORES_BY_ID: 7,//设备商城商品
    HOME_PAGE: 8,//首页
    VIDEO_VISIT_HOME: 9,//视频问诊
    DOCTOR_CONSULTATION_HOME: 10,//名医会诊
    MY_FIMILY_HOME: 11,//我的家
    HEALTH_VIDEO_HOME: 12,//健康视频首页
    HEALTH_VIDEO_SUBJECT: 13,//健康视频专题
    GUAHAO_HOME: 14,//预约挂号
    GUAHAO_BY_HOSP: 15,//预约挂号-医院
    USER_GUIDE: 16,//使用指南
    HEALTH_MEASURE: 17,//健康检测
    SEARCH: 18,//搜索
    EXPERT_CONSULTATION: 19,//专家约诊
    EXPERT_CONSULTATION_REMIND: 20, //专家约诊消息提醒
    EPIDEMIC: 48 //疫情实时播报
};


//测试服按键控制
var TestHandle = {
    onKeyDown: function (code) {
        switch (code) {
            case KEY_3:
                var keys = LMEPG.KeyEventManager.getKeyCodes();
                if (keys.length >= 4) {
                    if (keys[keys.length - 1] == KEY_3
                        && keys[keys.length - 2] == KEY_8
                        && keys[keys.length - 3] == KEY_9
                        && keys[keys.length - 4] == KEY_3) {
                        // 进入测试服
                        Page.jumpTestPage();
                    }
                }
                break;
        }
    }
};
// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_3: TestHandle.onKeyDown,
    }
);

// 返回按键
function onBack() {
    Page.onBack();
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("home");
        if (!LMEPG.ButtonManager.getCurrentButton().id.startWith('nav-')) {
            currentPage.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        } else {
            currentPage.setParam('focusIndex', Home.defaultFocusId);
        }
        return currentPage;
    },

    /**
     * 跳转到3983测试页
     */
    jumpTestPage: function () {
        var objCurrent = Page.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("testEntrySet");
        objHomeTab.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    /**
     * 跳转->home主页面
     */
    jumpHomeUI: function () {
        Page.jumpHomeTab("home");
    },

    /**
     * 跳转->挂号
     */
    jumpGuaHaoPage: function () {
        Page.jumpHomeTab("homeTab1");
    },

    /**
     * 跳转->健康视频首页
     */
    jumpHealthVideoHome: function () {
        Page.jumpHomeTab("homeTab2");
    },

    /**
     * 跳转->视频问诊
     */
    jumpVideoVisitHome: function () {
        Page.jumpHomeTab("homeTab3");
    },

    /**
     * 跳转->我的家页面
     */
    jumpMyFamilyUI: function () {
        Page.jumpHomeTab("homeTab4");
    },

    /**
     * 跳转->39互联网医院模块
     */
    jump39Hospital: function () {
        var objCurrent = Page.getCurrentPage();

        var objHome = LMEPG.Intent.createIntent("Hospital39Home");
        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转->视频问诊-科室
     */
    jumpVideoVisitByDepart: function () {

    },

    /**
     * 跳转->设备商城首页
     */
    jumpDeviceStore: function () {

    },

    /**
     * 跳转->设备商城，商品详情页
     */
    jumpDeviceStoreById: function () {

    },

    /**
     * 跳转->挂号-医院详情页
     */
    jumpGuaHaoByHospital: function (hospitalId) {
        var objCurrent = Page.getCurrentPage();

        var objDst = LMEPG.Intent.createIntent("department");
        objDst.setParam("hospital_id", hospitalId);
        objDst.setParam("is_province", 0);
        LMEPG.Intent.jump(objDst, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转->用户指南
     */
    jumpUserGuide: function () {

    },

    /**
     * 跳转->健康检测
     */
    jumpHealthMeasure: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("testIndex");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     *  跳转->专家约诊首页
     */
    jumpExpertConsultation: function () {
        var objCurrent = Page.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent("expertHome");
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转->专家约诊消息提醒
     */
    jumpExpertConsultationRemind: function () {

    },

    /**
     * 疫情模块接口
     */
    jumpEpidemic: function () {
        var objHome = Page.getCurrentPage();

        var objEpidemic = LMEPG.Intent.createIntent('report-index');
        objEpidemic.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objEpidemic, objHome);
    },

    /**
     * 跳转->视频问诊-医生
     */
    jumpVideoVisitByDoctor: function () {

    },

    /**
     * 跳转->home页面
     * @param tabName 将要跳转的栏目路由名称
     * @param focusIndex 跳转到指定栏目页时让其默认焦点保持在哪个按钮上
     */
    jumpHomeTab: function (tabName, focusIndex) {
        var objCurrent = Page.getCurrentPage();

        var objHome = LMEPG.Intent.createIntent(tabName);
        objHome.setParam("focusIndex", focusIndex);

        LMEPG.Intent.jump(objHome, objCurrent);
    },

    /**
     * 跳转 - 搜索页
     * */
    jumpSearchPage: function () {
        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "1");
        objHome.setParam("focusIndex", LMEPG.ButtonManager.getCurrentButton().id);
        objHome.setParam("page", "0");

        var objSearch = LMEPG.Intent.createIntent("search");
        objSearch.setParam("userId", RenderParam.userId);
        objSearch.setParam("position", "tab1");


        LMEPG.Intent.jump(objSearch, objHome);
    },

    /**
     * 跳转 -- 更多视频页
     */
    jumpHealthVideoHome: function (modelTitle, modelType, page) {
        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objChannel = LMEPG.Intent.createIntent("healthVideoList");
        objChannel.setParam("userId", RenderParam.userId);
        objChannel.setParam("page", typeof(page) === "undefined" ? "1" : page);
        objChannel.setParam("modelTitle", modelTitle);
        objChannel.setParam("modelType", modelType);
        LMEPG.Intent.jump(objChannel, objHome);
    },

    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName) {
        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objAlbum = LMEPG.Intent.createIntent("album");
        objAlbum.setParam("userId", RenderParam.userId);
        objAlbum.setParam("albumName", albumName);
        objAlbum.setParam("inner", 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转 -- 活动页面
     * @param activityName
     */
    jumpActivityPage: function (activityName) {
        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objActivity = LMEPG.Intent.createIntent("activity");
        objActivity.setParam("userId", RenderParam.userId);
        objActivity.setParam("activityName", activityName);
        objActivity.setParam("inner", 1);
        LMEPG.Intent.jump(objActivity, objHome);
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast("视频信息为空！");
            return;
        }

        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("userId", RenderParam.userId);
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
    },

    /**
     * 跳转 -- 订购页
     * @param remark        订购来源（标示）
     * @param videoInfo     如果视频正在播放，播放视频的信息。
     * @param singlePayItem 是否是单订购
     */
    jumpBuyVip: function (remark, videoInfo, singlePayItem) {
        if (typeof(videoInfo) !== "undefined" && videoInfo !== "") {
            var postData = {
                "videoInfo": JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
            });
        }
        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "1");
        objHome.setParam("page", "0");

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("userId", RenderParam.userId);
        objOrderHome.setParam("remark", remark);
        if (LMEPG.Func.isExist(videoInfo)) {
            objOrderHome.setParam("isPlaying", 1);
        } else {
            objOrderHome.setParam("isPlaying", -1);
        }
        objOrderHome.setParam("singlePayItem", typeof(singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objHome);
    },

    /**
     * 返回事件
     */
    onBack: function () {
        //使用挽留页弹窗的都需要增加下面的判断逻辑
        if (Hold.isShowHold()) {
            Hold.appExit();
        } else {
            Hold.open();
        }
    }
};

window.onload = function (ev) {
    // Home.initSmartPlayData();           //初始化小窗播放数据
    Home.setSmallPlayer();

    lmInitGo();
}

window.onunload = function () {
    G("smallPlayer").contentWindow.destorySmallPlayer();
    // LMEPG.mp.destroy();
}

//页面显示控制
var Home = {
    defaultFocusId: "nav-btn-1",
    navImgs: [],                            //导航栏图片数组
    homePollVideoList: '',                //轮播视频列表
    homePollVideoIndex: 0,                  //轮播视频数组下标


    //页面初始化操作
    init: function () {
        // Home.initSmartPlayData();           //初始化小窗播放数据
        Home.initRenderAll();                //渲染页面
        Home.initButtons();                 // 初始化焦点按钮
        Guide.open(3, "home_step");
    },

    initButtons: function () {
        Home.initNavigationBar();           // 初始化顶部[导航栏按钮]
        Home.initRecommendPosition();       // 初始化[推荐位按钮]
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        if (lastFocusId == "btn-order" && (RenderParam.isVip == "1" || RenderParam.isVip == 1)) {
            lastFocusId = Home.defaultFocusId;
        }
        LMEPG.ButtonManager.init(lastFocusId, buttons, "", true);
    },

    /**
     * 初始化渲染页面,将后台活动的数据和前端dom绑定
     */
    initRenderAll: function () {
        Home.renderThemeUI();             // 渲染主题背景
        Home.renderNavigationBar();       //渲染导航栏按钮
        Home.renderVipInfo();             //渲染vip信息
        Home.initMarquee();
        Home.renderRecommendPosition();   //渲染推荐位
    },

    /** 跑马灯信息初始化 */
    initMarquee: function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            G('scroll-message').innerHTML = data.content ;
        }, function (errorInfo) {
            LMEPG.Log.error("getMarquee error: " + errorInfo)
        })
    },

    /**
     * 初始化小窗播放数据
     */
    initSmartPlayData: function () {
        Home.homePollVideoList = RenderParam.pageInfo.homePollVideoList.list;
        if (LMEPG.Func.isEmpty(Home.homePollVideoList) || Home.homePollVideoList.length < 1) {
            LMEPG.UI.showToast("轮播视频列表为空，无法小窗播放", 3);
            return;
        }
        Home.startSmartPlay();
    },

    /**
     * 播放小窗视频
     */
    startSmartPlay: function () {
        var UserId = RenderParam.epgInfoMap.user_id;
        if (Home.homePollVideoIndex >= Home.homePollVideoList.length) {
            Home.homePollVideoIndex = 0;
        }
        var videoInfo = Home.homePollVideoList[Home.homePollVideoIndex];
        Home.homePollVideoIndex++;
        LMEPG.Log.error("Home.homePollVideoIndex::" + Home.homePollVideoIndex);
        LMEPG.mp.registerCallback(function () {

        }, function () {
            LMEPG.mp.destroy();
            Home.startSmartPlay();
        });
        LMEPG.mp.getUrl(videoInfo.videoUrl, function (url) {
            LMEPG.mp.initPlayer(url, 360, 130, 502, 284);
        });
    },
    /**
     * 全屏播放
     */
    startFullVideo: function () {
        var arrIndex = 0;
        if (Home.homePollVideoIndex > 0) {
            arrIndex = Home.homePollVideoIndex - 1;
        }
        var data = Home.homePollVideoList[arrIndex];
        // 创建视频信息
        var videoInfo = {
            "sourceId": data.sourceId,
            "videoUrl": data.videoUrl,
            "title": data.title,
            "type": data.modelType,
            "userType": data.userType,
            "freeSeconds": data.freeSeconds,
            "unionCode": data.unionCode,
            "entryType": 1,
            "entryTypeName": "首页轮播视频",
            "show_status": data.showStatus,
        };

        //视频专辑下线处理
        if(videoInfo.show_status == "3") {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }
        videoInfo = G("smallPlayer").contentWindow.RenderParam.videoInfo;

        if (isAllowPlay(videoInfo)) {
            Page.jumpPlayVideo(videoInfo);
        } else {
            Page.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },

    setSmallPlayer: function () {
        Home.homePollVideoList = RenderParam.pageInfo.homePollVideoList.list;
        var videoInfoArr = [];
        for (var i = 0; i < Home.homePollVideoList.length; i++) {
            var data = Home.homePollVideoList[i];
            var videoInfo = {   // 创建视频信息
                "sourceId": data.sourceId,
                "videoUrl": data.videoUrl,
                "title": data.title,
                "type": data.modelType,
                "userType": data.userType,
                "freeSeconds": data.freeSeconds,
                "entryType": 1,
                "entryTypeName": "首页轮播视频"
            };
            videoInfoArr.push(videoInfo);
        }
        var tempPosition = "";
        if (starcorCom.get_env() !== 'starcor') {  //父母乐1代盒子
            tempPosition = {
                left: 372,
                top: 140,
                width: 480,
                height: 270
            };
        } else {
            tempPosition = {
                left: 360,
                top: 130,
                width: 502,
                height: 284
            };
        }


        var tempVideoInfo = encodeURIComponent(JSON.stringify(videoInfoArr[0]));
        var tempAllVideoInfo = encodeURIComponent(JSON.stringify(videoInfoArr));
        var jumpUrl = "/index.php/Home/Player/smallV1?videoInfo=" + tempVideoInfo + "&allVideoInfo=" + tempAllVideoInfo + "&position=" + JSON.stringify(tempPosition);
        G("smallPlayer").src = jumpUrl;
    },

    /**
     * 渲染主题背景
     */
    renderThemeUI: function () {
        if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== "") {
            var themeImage = RenderParam.fsUrl + RenderParam.themeImage;
            G("img-body").src = themeImage;
        }
    },

    /**
     * 渲染导航栏按钮
     */
    renderNavigationBar: function () {
        try {
            if (LMEPG.Func.isExist(RenderParam.navConfig)) {
                for (var i = 0; i < RenderParam.navConfig.length; i++) {
                    var focusOutImg;
                    var focusInImg = JSON.parse(RenderParam.navConfig[i].img_url).focus_in;
                    if (RenderParam.classifyId == (i + "")) {
                        focusOutImg = JSON.parse(RenderParam.navConfig[i].img_url).focus_out;//离开但是选中的图片
                    } else {
                        focusOutImg = JSON.parse(RenderParam.navConfig[i].img_url).normal;//普通未选中的图片
                    }
                    Home.navImgs.push({
                        focus_in: addFsUrl(focusInImg),
                        focus_out: addFsUrl(focusOutImg),
                    });
                    G("nav-btn-" + (i + 1)).src = addFsUrl(focusOutImg);
                }
            }
        } catch (e) {

        }
    },

    /**
     * 渲染vip信息
     */
    renderVipInfo: function () {
        var vipInfoJson = JSON.parse(RenderParam.vipInfo);
        var expireDt = vipInfoJson.expire_dt;                  //vip到期时间
        if (!LMEPG.Func.isEmpty(expireDt)) {
            expireDt = expireDt.substr(0, 10);
        }
        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            //是vip
            G("order-status-vip").innerHTML = "VIP " + expireDt + " 到期";
            Show("order-status-vip");
        } else {
            if (!LMEPG.Func.isEmpty(expireDt)) {
                //vip过期
                Show("order-status-vip-timeout");
            } else {
                //从来没有订购过
                Show("order-status-no-vip");
            }
        }
    },

    /**
     * 渲染推荐位
     */
    renderRecommendPosition: function () {
        // 遍历推荐列表， 注意二号不是推荐位，是观看历史
        for (var i = 0; i < RenderParam.pageInfo.data.length; i++) {
            var data = RenderParam.pageInfo.data[i];
            switch (data.position) {
                case "11":
                    // 第一个位置 用户其它用途，暂时不管  初始化位置
                    G("recommended-1-bg").src = addFsUrl(data.image_url);
                    // updateVipIcon(data, "recommend-1-vip-icon");
                    updateCornerMark(data.cornermark, "recommend-1-vip-icon");
                    break;
                case "13":
                    G("recommended-4-bg").src = addFsUrl(data.image_url);
                    //updateVipIcon(data, "recommend-4-vip-icon");
                    updateCornerMark(data.cornermark, "recommend-4-vip-icon");
                    break;
                case "14":
                    G("recommended-5-bg").src = addFsUrl(data.image_url);
                    //updateVipIcon(data, "recommend-5-vip-icon");
                    updateCornerMark(data.cornermark, "recommend-5-vip-icon");
                    break;
                case "15":
                    G("recommended-3-bg").src = addFsUrl(data.image_url);
                    //updateVipIcon(data, "recommend-3-vip-icon");
                    updateCornerMark(data.cornermark, "recommend-3-vip-icon");
                    break;
                case "16":
                    // 第六个位置
                    G("recommended-6-bg").src = addFsUrl(data.image_url);
                    //updateVipIcon(data, "recommend-6-vip-icon");
                    updateCornerMark(data.cornermark, "recommend-6-vip-icon");
                    break;
            }
        }
    },
    //导航栏焦点效果
    navFocus: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).src = Home.navImgs[btn.cPosition].focus_in;
        } else {
            G(btn.id).src = Home.navImgs[btn.cPosition].focus_out;
        }
    },

    // 初始化导航栏
    initNavigationBar: function () {
        buttons.push({
            id: 'nav-btn-1',
            name: '导航栏1',
            type: 'img',
            nextFocusLeft: 'nav-btn-6',
            nextFocusRight: 'nav-btn-2',
            nextFocusUp: 'search-btn',
            nextFocusDown: 'recommended-1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_in,
            click: Home.onClickNavigation,
            focusChange: Home.navFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            cPosition: 0,
        });
        buttons.push({
            id: 'nav-btn-2',
            name: '导航栏2',
            type: 'img',
            nextFocusLeft: 'nav-btn-1',
            nextFocusRight: 'nav-btn-3',
            nextFocusUp: 'search-btn',
            nextFocusDown: 'recommended-1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_in,
            click: Home.onClickNavigation,
            focusChange: Home.navFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            cPosition: 1,
        });
        buttons.push({
            id: 'nav-btn-3',
            name: '导航栏3',
            type: 'img',
            nextFocusLeft: 'nav-btn-2',
            nextFocusRight: 'nav-btn-4',
            nextFocusUp: 'search-btn',
            nextFocusDown: 'recommended-1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_in,
            click: Home.onClickNavigation,
            focusChange: Home.navFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            cPosition: 2,
        });
        buttons.push({
            id: 'nav-btn-4',
            name: '导航栏4',
            type: 'img',
            nextFocusLeft: 'nav-btn-3',
            nextFocusRight: 'nav-btn-5',
            nextFocusUp: 'search-btn',
            nextFocusDown: 'recommended-1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_in,
            click: Home.onClickNavigation,
            focusChange: Home.navFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            cPosition: 3,
        });
        buttons.push({
            id: 'nav-btn-5',
            name: '导航栏5',
            type: 'img',
            nextFocusLeft: 'nav-btn-4',
            nextFocusRight: isShow("order-status-vip-timeout") ? 'btn-renew' : 'btn-order',
            nextFocusUp: 'search-btn',
            nextFocusDown: 'recommended-1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).focus_in,
            click: Home.onClickNavigation,
            focusChange: Home.navFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            cPosition: 4,
        });
        if (!LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            if (isShow("order-status-vip-timeout")) {
                buttons.push({
                    id: 'btn-renew',
                    name: '续订',
                    type: 'img',
                    nextFocusLeft: 'nav-btn-5',
                    nextFocusRight: '',
                    nextFocusUp: '',
                    nextFocusDown: 'recommended-1',
                    backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/bg_renew.png",
                    focusImage: g_appRootPath + "/Public/img/hd/Home/V10/f_renew.png",
                    click: Home.onClickRecommendPosition,
                    focusChange: "",
                    beforeMoveChange: Home.onRecommendBeforeMoveChange,
                });
            } else {
                buttons.push({
                    id: 'btn-order',
                    name: '订购',
                    type: 'img',
                    nextFocusLeft: 'nav-btn-5',
                    nextFocusRight: '',
                    nextFocusUp: '',
                    nextFocusDown: 'recommended-1',
                    backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/bg_order.png",
                    focusImage: g_appRootPath + "/Public/img/hd/Home/V10/f_order.png",
                    click: Home.onClickRecommendPosition,
                    focusChange: "",
                    beforeMoveChange: Home.onRecommendBeforeMoveChange,
                });
            }
        }
    },

    onNavBeforeMoveChange: function (dir, current) {
        switch (current.id) {
            case 'nav-btn-1':
                switch (dir) {
                    case 'left':
                        Page.jumpHomeTab('homeTab4');
                        return false;
                    case 'right':
                        Page.jumpHomeTab("homeTab2");
                        return false;
                }
        }

    },

    // 初始化推荐位
    initRecommendPosition: function () {
        buttons.push({
            id: 'recommended-1',
            name: '推荐位1',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommended-2',
            nextFocusUp: 'nav-btn-1',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_home_1.png",
            cPosition: "11", //推荐位编号
        });
        buttons.push({
            id: 'recommended-2',
            name: '推荐位2',
            type: 'img',
            nextFocusLeft: 'recommended-1',
            nextFocusRight: 'recommended-3',
            nextFocusUp: 'nav-btn-1',
            nextFocusDown: 'recommended-4',
            backgroundImage: "",
            cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_home_2.png",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.TvFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cPosition: "12", //推荐位编号
        });
        buttons.push({
            id: 'recommended-3',
            name: '推荐位3',
            type: 'img',
            nextFocusLeft: 'recommended-2',
            nextFocusRight: '',
            nextFocusUp: 'nav-btn-1',
            nextFocusDown: 'recommended-6',
            backgroundImage: "",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_home_3.png",
            cPosition: "15", //推荐位编号
        });
        buttons.push({
            id: 'recommended-4',
            name: '推荐位4',
            type: 'img',
            nextFocusLeft: 'recommended-1',
            nextFocusRight: 'recommended-5',
            nextFocusUp: 'recommended-2',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_home_4.png",
            cPosition: "13", //推荐位编号
        });
        buttons.push({
            id: 'recommended-5',
            name: '推荐位5',
            type: 'img',
            nextFocusLeft: 'recommended-4',
            nextFocusRight: 'recommended-6',
            nextFocusUp: 'recommended-2',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_home_4.png",
            cPosition: "14", //推荐位编号
        });
        buttons.push({
            id: 'recommended-6',
            name: '推荐位6',
            type: 'img',
            nextFocusLeft: 'recommended-5',
            nextFocusRight: '',
            nextFocusUp: 'recommended-3',
            nextFocusDown: 'recommended-5',
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_home_6.png",
            cPosition: "16", //推荐位编号
        });
    },

    /**
     * 推荐位按键移动
     * @param dir
     * @param current
     * @returns {boolean}
     */
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                switch (current.id) {
                    case 'recommended-1':
                        Page.jumpHomeTab('homeTab4', "recommended-3");
                        return false;
                }
                break;
            case 'right':
                switch (current.id) {
                    case 'recommended-3':
                    case 'recommended-6':
                        Page.jumpHomeTab("homeTab2");
                        return false;
                }
                break;
        }
        return true;
    },

    // 加边框焦点效果
    TvFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended-hover");
            var boxUrl = btn.cIconBox;
            G(btn.id + "-bg").style.background = 'url("' + boxUrl + '")  no-repeat';

        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended-hover");
            G(btn.id + "-bg").style.background = 'url("")  no-repeat';
        }
    },

    // 加边框焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            if (btn.id === "recommended-2") {
                LMEPG.CssManager.addClass(btn.id, "recommended-hover-no-scale");
            } else {
                LMEPG.CssManager.addClass(btn.id, "recommended-hover");
                EpgClass.epgFocus(btn, hasFocus);
            }
        } else {
            if (btn.id === "recommended-2") {
                LMEPG.CssManager.removeClass(btn.id, "recommended-hover-no-scale");
            } else {
                EpgClass.epgFocus(btn, hasFocus);
                LMEPG.CssManager.removeClass(btn.id, "recommended-hover");
            }
        }
    },


    // 导航栏目点击
    onClickNavigation: function (btn) {
        LMEPG.ButtonManager.setSelected(btn.id, true);
        Home.currNavId = btn.cNavId;
        switch (btn.id) {
            case "nav-btn-1":
                Page.jumpHomeTab("home");
                break;
            case "nav-btn-2":
                Page.jumpHomeTab("homeTab1");
                break;
            case "nav-btn-3":
                Page.jumpHomeTab("homeTab2");
                break;
            case "nav-btn-4":
                Page.jumpHomeTab("homeTab3");
                break;
            case "nav-btn-5":
                Page.jumpHomeTab("homeTab4");
                break;
        }
    },

    // 推荐位点击
    onClickRecommendPosition: function (btn) {
        if (btn.id == 'btn-renew' || btn.id == 'btn-order') {
            Page.jumpBuyVip("首页订购", null);
        } else if (btn.id == 'recommended-2') {
            var videoData = getRecommendDataByPosition(btn.cPosition);
            // 统计推荐位点击事件
            LMEPG.StatManager.statRecommendEvent(videoData.position,videoData.order);
            //点击2号推荐位小窗视频
            Home.startFullVideo();
        } else {
            if (Hold.isShowHold()) {
                Hold.colse();
            }
            var data = getRecommendDataByPosition(btn.cPosition);
            // 统计推荐位点击事件
            LMEPG.StatManager.statRecommendEvent(data.position,data.order);
            switch (parseInt(data.entryType)) {
                case HomeEntryType.VIDEO_VISIT_BY_DEPART:
                    //视频问诊-科室
                    Page.jumpVideoVisitByDepart();
                    break;
                case HomeEntryType.VIDEO_VISIT_BY_DOCTOR:
                    //视频问诊-医生
                    Page.jumpVideoVisitByDoctor();
                    break;
                case HomeEntryType.ACTIVITYS:
                    // 活动
                    Page.jumpActivityPage(data.source_id);
                    break;
                case HomeEntryType.HEALTH_VIDEO_BY_TYPES:
                    // 更多视频
                    Page.jumpHealthVideoHome(data.title, data.source_id, "1");
                    break;
                case HomeEntryType.HEALTH_VIDEO:
                    // 视频播放
                    var videoObj = data.play_url instanceof Object ? data.play_url : JSON.parse(data.play_url);
                    var videoUrl = RenderParam.platformType == "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

                    // 创建视频信息
                    var videoInfo = {
                        "sourceId": data.source_id,
                        "videoUrl": videoUrl,
                        "title": data.title,
                        "type": data.model_type,
                        "userType": data.user_type,
                        "freeSeconds": data.freeSeconds,
                        "entryType": 1,
                        "entryTypeName": "home",
                        "focusIdx": btn.id,
                        "unionCode": data.union_code,
                        "show_status": data.show_status,
                    };
                    //视频专辑下线处理
                    if(videoInfo.show_status == "3") {
                        LMEPG.UI.showToast('该节目已下线');
                        return;
                    }
                    if (isAllowPlay(videoInfo)) {
                        Page.jumpPlayVideo(videoInfo);
                    } else {
                        Page.jumpBuyVip(videoInfo.title, videoInfo);
                    }
                    break;
                case HomeEntryType.DEVICE_STORES:
                    //设备商城
                    Page.jumpDeviceStore();
                    break;
                case HomeEntryType.DEVICE_STORES_BY_ID:
                    //设备商城商品
                    Page.jumpDeviceStoreById();
                    break;
                case HomeEntryType.HOME_PAGE:
                    Page.jumpHomeUI();
                    //首页
                    break;
                case HomeEntryType.VIDEO_VISIT_HOME:
                    Page.jumpVideoVisitHome();
                    //视频问诊
                    break;
                case HomeEntryType.DOCTOR_CONSULTATION_HOME:
                    Page.jump39Hospital();
                    break;
                case HomeEntryType.MY_FIMILY_HOME:
                    Page.jumpMyFamilyUI();
                    //我的家
                    break;
                case HomeEntryType.HEALTH_VIDEO_HOME:
                    Page.jumpHealthVideoHome()
                    //健康视频首页
                    break;
                case HomeEntryType.HEALTH_VIDEO_SUBJECT:
                    // 专辑
                    Page.jumpAlbumPage(data.source_id);
                    break;
                case HomeEntryType.GUAHAO_HOME:
                    // 挂号主页
                    Page.jumpGuaHaoPage();
                    break;
                case HomeEntryType.GUAHAO_BY_HOSP:
                    //挂号-医院
                    Page.jumpGuaHaoByHospital(data.source_id);
                    break;
                case HomeEntryType.USER_GUIDE:
                    //用户指南
                    Page.jumpUserGuide();
                    break;
                case HomeEntryType.HEALTH_MEASURE:
                    //健康检测
                    Page.jumpHealthMeasure();
                    break;
                case HomeEntryType.EXPERT_CONSULTATION:
                    Page.jumpExpertConsultation();
                    //专家约诊
                    break;
                case HomeEntryType.EXPERT_CONSULTATION_REMIND:
                    //专家约诊消息提醒
                    Page.jumpExpertConsultationRemind();
                    break;
                case HomeEntryType.EPIDEMIC:
                    // 疫情实时播报
                    Page.jumpEpidemic();
                    break;
                case HomeEntryType.SEARCH:
                    //搜索
                    Page.jumpSearchPage();
                    break;
            }
        }
    },

};

var EpgClass = {
    START_TOP: "",//初始高度
    START_LEFT: "",//初始横坐标
    START_WIDTH: "",//初始宽度
    START_HEIGHT: "",//初始高度
    ZOOM: 1.1,//放大倍数
    PADDING: 42,
    DRAG: 13,//抖动值
    //epg标清盒子放大效果
    epgFocus: function (btn, hasFocus) {
        if (hasFocus) {
            var boxUrl = btn.cIconBox;
            G(btn.id + "-bg").style.background = 'url("' + boxUrl + '")  no-repeat';
            if (btn.id != "recommended-1") {
                EpgClass.START_HEIGHT = parseInt(getPropertyValue(btn.id + "-bg", "height")) + "px";
                EpgClass.START_WIDTH = parseInt(getPropertyValue(btn.id + "-bg", "width")) + "px";
                EpgClass.START_TOP = parseInt(getPropertyValue(btn.id, "top")) + "px";
                EpgClass.START_LEFT = parseInt(getPropertyValue(btn.id, "left")) + "px";
                G(btn.id + "-bg").style.backgroundPosition = 'center';
                G(btn.id + "-bg").style.width = parseInt(getPropertyValue(btn.id + "-bg", "width")) * EpgClass.ZOOM + "px";
                G(btn.id + "-bg").style.height = parseInt(getPropertyValue(btn.id + "-bg", "height")) * EpgClass.ZOOM + "px";
                G(btn.id).style.top = parseInt(getPropertyValue(btn.id, "top")) - EpgClass.DRAG + "px";
                G(btn.id).style.left = parseInt(getPropertyValue(btn.id, "left")) - EpgClass.DRAG + "px";
            }

        } else {
            G(btn.id + "-bg").style.background = 'url("")  no-repeat';
            if (btn.id != "recommended-1") {
                G(btn.id + "-bg").style.width = EpgClass.START_WIDTH;
                G(btn.id + "-bg").style.height = EpgClass.START_HEIGHT;
                G(btn.id).style.top = EpgClass.START_TOP;
                G(btn.id).style.left = EpgClass.START_LEFT;
            }
        }
    },
//界面渲染调整;
    updatePosition: function () {
        for (var i = 1; i < 7; i++) {
            // if (i != 2) {
            G("recommended-" + i + "-bg").style.padding = EpgClass.PADDING + "px";
            G("recommended-" + i).style.top = parseInt(getPropertyValue("recommended-" + i, "top")) - EpgClass.PADDING + "px";
            G("recommended-" + i).style.left = parseInt(getPropertyValue("recommended-" + i, "left")) - EpgClass.PADDING + "px";
            // }
        }
    },
}
