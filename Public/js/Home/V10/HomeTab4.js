/***********************首页导航栏js控制***************************/
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
    EXPERT_CONSULTATION: 19,//专家约诊
    EXPERT_CONSULTATION_REMIND: 20,//专家约诊消息提醒
    APPOINT_RECOREDS: 29,//挂号记录
    HEALTH_TEST_RECOREDS: 30,//检测记录
    FAMILY_MEMBER: 31,//家庭成员管理
    COLLECTION: 23,//我的收藏
    ABOUT_OURS: 32,//关于我们
    EXPERT_RECORD: 25,//专家约诊记录
    P2P_RECORD: 28,//问诊记录
    FAMILY_FILES:45, // 家庭档案
};

// 定义全局按钮
var buttons = [];

// 返回按键
function onBack() {
    // Page.onBack();
    LMEPG.Intent.back("home");
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("homeTab4");
        if (!LMEPG.ButtonManager.getCurrentButton().id.startWith('nav-')) {
            currentPage.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        } else {
            currentPage.setParam('focusIndex', Home.defaultFocusId);
        }
        return currentPage;
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

        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
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
    jumpHealthVideoHome: function (modeTitle, modeType, page) {
        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objChannel = LMEPG.Intent.createIntent("channel");
        objChannel.setParam("userId", RenderParam.userId);
        objChannel.setParam("page", typeof(page) === "undefined" ? "1" : page);
        objChannel.setParam("modeTitle", modeTitle);
        objChannel.setParam("modeType", modeType);
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
     * 跳转到播放历史
     */
    jumpVideoPlayHistory: function () {
        var objHome = Page.getCurrentPage();
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objHistory = LMEPG.Intent.createIntent("history");
        LMEPG.Intent.jump(objHistory, objHome);
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
        objOrderHome.setParam("isPlaying", 1);
        objOrderHome.setParam("singlePayItem", typeof(singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objHome);
    },

    // 跳转挂号记录
    jumpAppointRecords: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("registeredRecord");
        objDst.setParam("isFromMyFamilyPage", 1);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转检测记录
    jumpHealthTestImeiInput: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("recordList");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转到关于我们
    jumpAboutOus: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("about");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转到家庭成员
    jumpFamilyMember: function () {
        var objSrc = Page.getCurrentPage();
        // var objDst = LMEPG.Intent.createIntent("familyHome");
        var objDst = LMEPG.Intent.createIntent("familyEdit");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },
    // 跳转到档案
    // jumpFamilyFiles: function () {
    //     var objSrc = Page.getCurrentPage();
    //     var objDst = LMEPG.Intent.createIntent("familyFiles");
    //     LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    // },


    // 跳转到收藏
    jumpCollection: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("collect");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    jumpP2PRecordHome: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("doctorRecordHome");
        LMEPG.Intent.jump(objDst, objSrc);
    },
    jumpExpertRecordHome: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("expertRecordHome");
        LMEPG.Intent.jump(objDst, objSrc);
    },
    /**
     *  跳转->专家约诊首页
     */
    jumpExpertHome: function () {
        var objCurrent = Page.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent("expertHome");
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 返回事件
     */
    onBack: function () {
        // Page.jumpHomeTab('home', "recommended_1");
        Page.jumpHomeTab("home");
    }
};

//页面显示控制
var Home = {
    defaultFocusId: "nav-btn-5",
    navImgs: [],                            //导航栏图片数组
    //页面初始化操作
    init: function () {
        Home.initRenderAll();                //渲染页面
        Home.initButtons();                 // 初始化焦点按钮
        Guide.open(2, "tab4_step");
    },

    initButtons: function () {
        Home.initNavigationBar();           // 初始化顶部[导航栏按钮]
        Home.initRecommendPosition();       // 初始化[推荐位按钮]
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        if (lastFocusId == "btn-order" && LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
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
        Home.renderRecommendPosition();   //渲染推荐位
        Home.renderVipInfo();             //渲染vip信息
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
    },

    /**
     * 渲染推荐位,显示或隐藏VIP角标
     */
    renderRecommendPosition: function () {
        // 遍历推荐列表， 注意二号不是推荐位，是观看历史
        for (var i = 0; i < RenderParam.pageInfo.data.length; i++) {
            var data = RenderParam.pageInfo.data[i];
            switch (data.position) {
                case "51":
                    // 第一个位置
                    G("recommended-1-bg").src = addFsUrl(data.image_url);
                    Home.updateVipIcon(data, "recommend-1-vip-icon");
                    break;
                case "52":
                    // 第一个位置
                    G("recommended-2-bg").src = addFsUrl(data.image_url);
                    Home.updateVipIcon(data, "recommend-2-vip-icon");
                    break;
                case "53":
                    // 第三个位置
                    G("recommended-3-bg").src = addFsUrl(data.image_url);
                    Home.updateVipIcon(data, "recommend-3-vip-icon");
                    break;
                case "54":
                    // 第四个位置
                    G("recommended-4-bg").src = addFsUrl(data.image_url);
                    Home.updateVipIcon(data, "recommend-4-vip-icon");
                    break;
                // case "55":
                //     // 第五个位置
                //     G("recommended-5-bg").src = addFsUrl(data.image_url);
                //     Home.updateVipIcon(data, "recommend-5-vip-icon");
                //     break;
                // case "56":
                //     // 第六个位置
                //     G("recommended-6-bg").src = addFsUrl(data.image_url);
                //     Home.updateVipIcon(data, "recommend-6-vip-icon");
                //     break;
            }
        }
    },

    /**
     * 更新角标
     */
    updateVipIcon: function (info, id) {
        if (info.entryType == HomeEntryType.COLLECTION && !LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            Show(id);
        } else {
            Hide(id);
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

    // 初始化推荐位
    initRecommendPosition: function () {
        buttons.push({
            id: 'recommended-1',
            name: '推荐位1',
            type: 'img',
            nextFocusLeft: 'recommended-4',
            nextFocusRight: 'recommended-2',
            nextFocusUp: 'nav-btn-5',
            // nextFocusDown: 'recommended-4',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_tab_4_1.png",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cPosition: 51,
        });
        buttons.push({
            id: 'recommended-2',
            name: '推荐位2',
            type: 'img',
            nextFocusLeft: 'recommended-1',
            nextFocusRight: 'recommended-3',
            nextFocusUp: 'nav-btn-5',
            // nextFocusDown: 'recommended-5',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_tab_4_2.png",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cPosition: 52,
        });
        buttons.push({
            id: 'recommended-3',
            name: '推荐位3',
            type: 'img',
            nextFocusLeft: 'recommended-2',
            nextFocusRight: 'recommended-4',
            nextFocusUp: 'nav-btn-5',
            nextFocusDown: 'recommended-4',
            backgroundImage: "",
            focusImage: "",
            cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_tab_4_3.png",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cPosition: 53,
        });
        buttons.push({
            id: 'recommended-4',
            name: '推荐位4',
            type: 'img',
            nextFocusLeft: 'recommended-2',
            nextFocusRight: 'recommended-1',
            nextFocusUp: 'recommended-3',
            nextFocusDown: '',
            backgroundImage: "",
            cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_tab_4_4.png",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cPosition: 54,
        });
        // buttons.push({
        //     id: 'recommended-5',
        //     name: '推荐位5',
        //     type: 'img',
        //     nextFocusLeft: 'recommended-4',
        //     nextFocusRight: 'recommended-6',
        //     nextFocusUp: 'recommended-2',
        //     nextFocusDown: '',
        //     backgroundImage: "",
        //     focusImage: "",
        //     cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_tab_4_5.png",
        //     click: Home.onClickRecommendPosition,
        //     focusChange: Home.recommendedFocus,
        //     beforeMoveChange: Home.onRecommendBeforeMoveChange,
        //     cPosition: 55,
        // });

        // buttons.push({
        //     id: 'recommended-6',
        //     name: '推荐位6',
        //     type: 'img',
        //     nextFocusLeft: 'recommended-5',
        //     nextFocusRight: '',
        //     nextFocusUp: 'recommended-3',
        //     nextFocusDown: 'recommended-5',
        //     click: Home.onClickRecommendPosition,
        //     focusChange: Home.recommendedFocus,
        //     cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_tab_4_6.png",
        //     beforeMoveChange: Home.onRecommendBeforeMoveChange,
        //     cPosition: 56,
        // });
    },

    onNavBeforeMoveChange: function (dir, current) {
        switch (current.id) {
            case 'nav-btn-5':
                switch (dir) {
                    case 'left':
                        Page.jumpHomeTab("homeTab1");
                        return false;
                    case 'right':
                        if (!RenderParam.isVip) {
                            var tempId = isShow("order-status-vip-timeout") ? 'btn-renew' : 'btn-order';
                            LMEPG.BM.requestFocus(tempId);
                            return false;
                        } else {
                            Page.jumpHomeTab("home");
                        }

                }
        }

    },

    // 加边框焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended-hover");
            EpgClass.epgFocus(btn, hasFocus);
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended-hover");
            EpgClass.epgFocus(btn, hasFocus);
        }
    },
    // 加边框焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended-hover");

        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended-hover");

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
            case "nav-btn-6":
                Page.jumpHomeTab("homeTab5");
                break;
            // case "search-btn":
            //     Page.jumpSearchPage();
            //     break;
        }
    },

    // 推荐位点击
    onClickRecommendPosition: function (btn) {
        if (btn.id == 'btn-renew' || btn.id == 'btn-order') {
            Page.jumpBuyVip("首页订购", null);
            return;
        }

        var data = getRecommendDataByPosition(btn.cPosition);
        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(data.position,data.order);
        switch (parseInt(data.entryType)) {
            case HomeEntryType.APPOINT_RECOREDS:
                Page.jumpAppointRecords();
                break;
            case HomeEntryType.HEALTH_TEST_RECOREDS:
                Page.jumpHealthTestImeiInput();
                break;
            // case HomeEntryType.FAMILY_MEMBER:
            //     Page.jumpFamilyMember();
            //     break;
            case HomeEntryType.FAMILY_FILES:
                Page.jumpFamilyMember();
                break;
            case HomeEntryType.COLLECTION:
                Page.jumpCollection();
                // Page.jumpExpertRecordHome();
                break;
            case HomeEntryType.ABOUT_OURS:
                Page.jumpAboutOus();
                // Page.jumpExpertRecordHome();
                // Page.jumpExpertHome();
                break;
            case HomeEntryType.EXPERT_RECORD:
                Page.jumpExpertRecordHome();
                break;
            case HomeEntryType.P2P_RECORD:
                Page.jumpP2PRecordHome();
                break;
            default:
                LMEPG.UI.showToast("没有entryType为" + data.entryType + "的跳转方式");
                break;
        }

    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                switch (current.id) {
                    case 'recommended-1':
                    // case 'recommended-4':
                    //     Page.jumpHomeTab('homeTab1');
                        return false;
                }
                break;
            // case 'right':
            //     switch (current.id) {
            //         case 'recommended-3':
            //         // case 'recommended-4':
            //             Page.jumpHomeTab("recommended-1");
            //             return false;
            //     }
            //     break;
        }
    },
};
//设置主推位的样式
var EpgClass = {
    START_TOP: "",//初始高度
    START_LEFT: "",//初始横坐标
    START_WIDTH: "",//初始宽度
    START_HEIGHT: "",//初始高度
    ZOOM: 1.1,//放大倍数
    PADDING: 42,
    DRAG: 12,//抖动值
    //epg标清盒子放大效果
    epgFocus: function (btn, hasFocus) {
        if (hasFocus) {
            var boxUrl = btn.cIconBox;
            G(btn.id + "-bg").style.background = 'url("' + boxUrl + '")  no-repeat';
            if (btn.id != "recommended-1" && btn.id != "recommended-2" && btn.id != "recommended-3") {
                EpgClass.START_HEIGHT = parseInt(getPropertyValue(btn.id, "height")) + "px";
                EpgClass.START_WIDTH = parseInt(getPropertyValue(btn.id, "width")) + "px";
                EpgClass.START_TOP = parseInt(getPropertyValue(btn.id, "top")) + "px";
                EpgClass.START_LEFT = parseInt(getPropertyValue(btn.id, "left")) + "px";
                G(btn.id + "-bg").style.backgroundPosition = 'center';
                G(btn.id).style.width = parseInt(getPropertyValue(btn.id, "width")) * EpgClass.ZOOM + "px";
                G(btn.id).style.height = parseInt(getPropertyValue(btn.id, "height")) * EpgClass.ZOOM + "px";
                G(btn.id).style.top = parseInt(getPropertyValue(btn.id, "top")) - EpgClass.DRAG + "px";
                G(btn.id).style.left = parseInt(getPropertyValue(btn.id, "left")) - EpgClass.DRAG + "px";
            }

        } else {
            G(btn.id + "-bg").style.background = 'url("")  no-repeat';
            if (btn.id != "recommended-1" && btn.id != "recommended-2" && btn.id != "recommended-3") {
                G(btn.id).style.width = EpgClass.START_WIDTH;
                G(btn.id).style.height = EpgClass.START_HEIGHT;
                G(btn.id).style.top = EpgClass.START_TOP;
                G(btn.id).style.left = EpgClass.START_LEFT;
            }

        }
    },
//界面渲染调整;
//     updatePosition: function () {
//         for (var i = 1; i < 7; i++) {
//             // if (i != 2) {
//             G("recommended-" + i + "-bg").style.padding = EpgClass.PADDING + "px";
//             G("recommended-" + i).style.top = parseInt(getPropertyValue("recommended-" + i, "top")) - EpgClass.PADDING + "px";
//             G("recommended-" + i).style.left = parseInt(getPropertyValue("recommended-" + i, "left")) - EpgClass.PADDING + "px";
//             // }
//         }
//     },
}
