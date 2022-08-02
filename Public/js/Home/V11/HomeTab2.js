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
    EXPERT_CONSULTATION: 19,//专家约诊
    EXPERT_CONSULTATION_REMIND: 20 //专家约诊消息提醒
};

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
        var currentPage = LMEPG.Intent.createIntent("homeTab2");
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

        var objChannel = LMEPG.Intent.createIntent("healthVideoList");
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
    //问专家首页
    jumpExpertHome: function () {
        var objExpertHome = LMEPG.Intent.createIntent("expertHome");
        LMEPG.Intent.jump(objExpertHome, Page.getCurrentPage());
    },

    /**
     * 返回事件
     */
    onBack: function () {
        // Page.jumpHomeTab('home', "recommended-1");
        Page.jumpHomeTab("home");
    }
};

//页面显示控制
var Home = {
    defaultFocusId:"recommended-1",
    navImgs: [],                            //导航栏图片数组
    //页面初始化操作
    init: function () {
        Home.initRenderAll();                //渲染页面
        Home.initButtons();                 // 初始化焦点按钮
        NewGuidanceUtil.checkIsFirstTimeEntry("tab2_step", function () {
            Guide.open(1, "tab2_step");
        });//新手指导部分
    },

    initButtons: function () {
        Home.initNavigationBar();           // 初始化顶部[导航栏按钮]
        Home.initRecommendPosition();       // 初始化[推荐位按钮]
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        if(lastFocusId == "btn-order" && (RenderParam.isVip == "1" || RenderParam.isVip == 1)){
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
        Home.renderRecommendPosition();   //渲染推荐位
    },

    /**
     * 渲染主题背景
     */
    renderThemeUI: function () {
        if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== "") {
            var themeImage = RenderParam.fsUrl + RenderParam.themeImage;
            G("body").src = themeImage;
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
     * 渲染vip信息
     */
    renderVipInfo: function () {
        var vipInfoJson = JSON.parse(RenderParam.vipInfo);
        var expireDt = vipInfoJson.expire_dt;                  //vip到期时间
        if (!LMEPG.Func.isEmpty(expireDt)) {
            expireDt = expireDt.substr(0, 10);
        }
        if (RenderParam.isVip == "1" || RenderParam.isVip == 1) {
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
                case "31":
                    // 第一个位置
                    G("recommend-1-bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend-1-vip-icon");
                    break;
                case "32":
                    // 第一个位置
                    G("recommend-2-bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend-2-vip-icon");
                    break;
                case "33":
                    // 第三个位置
                    G("recommend-3-bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend-3-vip-icon");
                    break;
                case "34":
                    // 第四个位置
                    G("recommend-4-bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend-4-vip-icon");
                    break;
                case "35":
                    // 第五个位置
                    G("recommend-5-bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend-5-vip-icon");
                    break;
                case "36": // 第六个位置
                    G("recommend-6-bg").src = addFsUrl(data.image_url);
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
            backgroundImage:RenderParam.fsUrl+JSON.parse(RenderParam.navConfig[0].img_url).normal,
            focusImage: RenderParam.fsUrl+JSON.parse(RenderParam.navConfig[0].img_url).focus_in,
            click: Home.onClickNavigation,
            focusChange: Home.navFocus,
            beforeMoveChange: "",
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
            backgroundImage:RenderParam.fsUrl+JSON.parse(RenderParam.navConfig[1].img_url).normal,
            focusImage: RenderParam.fsUrl+JSON.parse(RenderParam.navConfig[1].img_url).focus_in,
            click: Home.onClickNavigation,
            focusChange: Home.navFocus,
            beforeMoveChange: "",
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
            backgroundImage:RenderParam.fsUrl+JSON.parse(RenderParam.navConfig[2].img_url).normal,
            focusImage: RenderParam.fsUrl+JSON.parse(RenderParam.navConfig[2].img_url).focus_in,
            click: Home.onClickNavigation,
            focusChange: Home.navFocus,
            beforeMoveChange: "",
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
            backgroundImage:RenderParam.fsUrl+JSON.parse(RenderParam.navConfig[3].img_url).normal,
            focusImage: RenderParam.fsUrl+JSON.parse(RenderParam.navConfig[3].img_url).focus_in,
            click: Home.onClickNavigation,
            focusChange: Home.navFocus,
            beforeMoveChange: "",
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
            backgroundImage:RenderParam.fsUrl+JSON.parse(RenderParam.navConfig[4].img_url).normal,
            focusImage: RenderParam.fsUrl+JSON.parse(RenderParam.navConfig[4].img_url).focus_in,
            click: Home.onClickNavigation,
            focusChange: Home.navFocus,
            beforeMoveChange: "",
            cPosition: 4,
        });

        if (RenderParam.isVip != "1" && RenderParam.isVip != 1) {
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
            nextFocusLeft: '',
            nextFocusRight: 'recommended-2',
            nextFocusUp: 'nav-btn-3',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cPosition: "31", //推荐位编号
        });
        buttons.push({
            id: 'recommended-2',
            name: '推荐位2',
            type: 'img',
            nextFocusLeft: 'recommended-1',
            nextFocusRight: 'recommended-3',
            nextFocusUp: 'nav-btn-3',
            nextFocusDown: 'recommended-5',
            backgroundImage: "",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cPosition: "32", //推荐位编号
        });
        buttons.push({
            id: 'recommended-3',
            name: '推荐位3',
            type: 'img',
            nextFocusLeft: 'recommended-2',
            nextFocusRight: 'recommended-4',
            nextFocusUp: 'nav-btn-3',
            nextFocusDown: 'recommended-5',
            backgroundImage: "",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: "",
            cPosition: "33", //推荐位编号
        });
        buttons.push({
            id: 'recommended-4',
            name: '推荐位4',
            type: 'img',
            nextFocusLeft: 'recommended-3',
            nextFocusRight: '',
            nextFocusUp: 'nav-btn-3',
            nextFocusDown: 'recommended-6',
            backgroundImage: "",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cPosition: "34", //推荐位编号
        });
        buttons.push({
            id: 'recommended-5',
            name: '推荐位5',
            type: 'img',
            nextFocusLeft: 'recommended-1',
            nextFocusRight: 'recommended-6',
            nextFocusUp: 'recommended-2',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cPosition: "35", //推荐位编号
        });

        buttons.push({
            id: 'recommended-6',
            name: '推荐位6',
            type: 'img',
            nextFocusLeft: 'recommended-5',
            nextFocusRight: '',
            nextFocusUp: 'recommended-4',
            nextFocusDown: 'recommended-5',
            click: Home.onClickRecommendPosition,
            focusChange: Home.recommendedFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cPosition: "36", //推荐位编号
        });
    },

    // 加边框焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id,"recommended-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id,"recommended-hover");
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
        } else {
            // Page.jumpExpertHome();
            var data = getRecommendDataByPosition(btn.cPosition);
            switch (parseInt(data.entryType)) {
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
                        "entryTypeName": "homeTab2",
                        "focusIdx": btn.id,
                        "unionCode": data.union_code,
                    };

                    if (isAllowPlay(videoInfo)) {
                        Page.jumpPlayVideo(videoInfo);
                    } else {
                        Page.jumpBuyVip(videoInfo.title, videoInfo);
                    }
                    break;
                case HomeEntryType.HEALTH_VIDEO_BY_TYPES:
                    // 更多视频
                    Page.jumpHealthVideoHome(data.title, data.source_id, "1");
                    break;
                case HomeEntryType.HEALTH_VIDEO_SUBJECT:
                    // 专辑
                    Page.jumpAlbumPage(data.source_id);
                    break;
            }
        }
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                switch (current.id) {
                    case 'recommended-1':
                        Page.jumpHomeTab('homeTab1', "recommended-3");
                        return false;
                }
                break;
            case 'right':
                switch (current.id) {
                    case 'recommended-4':
                    case 'recommended-6':
                        Page.jumpHomeTab('homeTab3', "depart");
                        return false;
                }
                break;
        }
    },

};
