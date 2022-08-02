/***********************首页导航栏js控制***************************/
// 定义全局按钮
var buttons = [];
var scroll = "center";

// 返回按键
function onBack() {
    switch (LMEPG.ButtonManager.getCurrentButton().id) {
        case "depart":
        case "nav-btn-4":
            var fromLaunch = LMEPG.Cookie.getCookie('c_from_launch');
            if (fromLaunch == "0") {
                LMEPG.Log.info('fromLaunch--->home' + fromLaunch);
                LMEPG.Intent.back("home");
            } else {
                // LMEPG.Intent.back("IPTVPortal");
                // LMEPG.Intent.back("IPTVPortal");
                LMEPG.Log.info('fromLaunch--->other' + fromLaunch);
                window.location.href = "http://10.68.50.241/zhihui/app/39/Search.html";
            }
            break;
        default:
            if (P2PManagerUI.hospitalPage > 1) {
                Home.isFirstLoad = false;
                P2PManagerUI.hospitalPage = 1;
                P2PManagerUI.createHtml();
            }
            LMEPG.ButtonManager.requestFocus("nav-btn-4");
            break;
    }

}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("homeTab3");
        if (!LMEPG.ButtonManager.getCurrentButton().id.startWith('nav_')) {
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
        objChannel.setParam("page", typeof (page) === "undefined" ? "1" : page);
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
        if (typeof (videoInfo) !== "undefined" && videoInfo !== "") {
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
        objOrderHome.setParam("singlePayItem", typeof (singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objHome);
    },
    //跳转在线问诊的医生详情页面
    jumpP2PDetail: function (docId) {
        var objHome = Page.getCurrentPage();
        objHome.setParam("departmentId", RenderParam.departmentId);
        objHome.setParam("departmentName", RenderParam.departmentName);
        objHome.setParam("pageCurrent", P2PManagerUI.hospitalPage);
        objHome.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
        var dstObj = LMEPG.Intent.createIntent("doctorDetails");
        dstObj.setParam("doc_id", docId);
        LMEPG.Intent.jump(dstObj, objHome);
    },
    //跳转在线问诊中的科室列表
    jumpP2PDepartment: function () {
        var objHome = Page.getCurrentPage();
        objHome.setParam("departmentId", RenderParam.departmentId);
        objHome.setParam("departmentName", RenderParam.departmentName);
        var dstObj = LMEPG.Intent.createIntent("doctorDepartment");
        dstObj.setParam("departmentId", RenderParam.departmentId);
        dstObj.setParam("departmentName", RenderParam.departmentName);
        dstObj.setParam("scrollTop", RenderParam.scrollTop);
        LMEPG.Intent.jump(dstObj, objHome);
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

    // 当前页默认有焦点的按钮ID
    defaultFocusId: 'nav-btn-4',
    isFirstLoad: false,  //是否第一次加载
    defaultUrl: g_appRootPath + "/Public/img/hd/Home/V10/",

    navImgs: [],                            //导航栏图片数组

    //页面初始化操作
    init: function () {
        Home.initRenderAll();                //渲染页面
        window.onload = function (ev) {
            P2PManagerUI.init();//渲染医院列表
        }
    },

    /**
     * 初始化渲染页面,将后台活动的数据和前端dom绑定
     */
    initRenderAll: function () {
        Home.renderThemeUI();             // 渲染主题背景
        Home.renderNavigationBar();       //渲染导航栏按钮
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
                case "21":
                    // 第一个位置
                    G("recommend_1_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_1_vip_icon");
                    break;
                case "22":
                    // 第一个位置
                    G("recommend_2_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_2_vip_icon");
                    break;
                case "23":
                    // 第三个位置
                    G("recommend_3_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_3_vip_icon");
                    break;
                case "24": // 第四个位置
                    G("recommend_4_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_4_vip_icon");
                    break;
                case "25": // 第五个位置
                    G("recommend_5_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_5_vip_icon");
                    break;
                case "26": // 第六个位置
                    G("recommend_6_bg").src = addFsUrl(data.image_url);
                    break;
            }
        }
    },

    /**
     * 初始化焦点按钮。应当在页面渲染完毕后，最后一步再调用设置焦点按钮。
     */
    initButtons: function () {
        Home.initNavigationBar();           // 初始化顶部[导航栏按钮]
        // Home.initRecommendPosition();       // 初始化[推荐位按钮]
        Home.initRegionBtn();         // 初始化[区域按钮]
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;

        if (lastFocusId == "btn-order" && (RenderParam.isVip == "1" || RenderParam.isVip == 1)) {
            lastFocusId = Home.defaultFocusId;
        }
        LMEPG.ButtonManager.init(lastFocusId, buttons, "", true);
        Guide.open(1, "tab3_step");
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
            nextFocusDown: 'depart',
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
            nextFocusUp: '',
            nextFocusDown: 'depart',
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
            nextFocusUp: '',
            nextFocusDown: 'depart',
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
            nextFocusUp: '',
            nextFocusDown: 'depart',
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
            nextFocusUp: '',
            nextFocusDown: 'depart',
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
                    beforeMoveChange: '',
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
                    focusChange: '',
                    beforeMoveChange: '',
                });
            }
        }
    },
// 初始化区域选择按钮
    initRegionBtn: function () {
        buttons.push({
            id: 'depart',
            name: '部门选择',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'nav-btn-4',
            nextFocusDown: 'recommended-0',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_long.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_long.png",
            click: Page.jumpP2PDepartment,
            focusChange: Home.regionFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cType: "region",
        });

    },

    regionFocus: function (btn, hasFocus) {
        if (hasFocus) {
            // G(scroll).style.overflow = "hidden";
            // LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            // LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            // if(btn.id="depart") {
            //     G("region-content").style.display="none";
            // }
        }
    },

    onNavBeforeMoveChange: function (dir, current) {
        switch (current.id) {
            case 'nav-btn-4':
                switch (dir) {
                    case 'left':
                        Page.jumpHomeTab("homeTab2");
                        return false;
                    case 'right':
                        Page.jumpHomeTab("homeTab1");
                        return false;
                }
        }

    },

    // 加边框焦点效果
    recommendedFocus: function (btn, hasFocus) {
        var imgs = G(btn.id).getElementsByTagName("img");
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended-hover");
            imgs[0].className += " zoom-img-1";
            imgs[1].className += " zoom-img-2";
            // G("inquiry-number").style.top = "270px";
            // G("inquiry-number").style.left = "59px";
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended-hover");
            imgs[0].className = "recommended-bg";
            imgs[1].className = "recommended-photo";
            // G("inquiry-number").style.top = "260px";
            // G("inquiry-number").style.left = "69px";
        }
    },

    //推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                if (current.id == "depart") {
                    Page.jumpHomeTab('homeTab2');
                    return false;
                }
                break;
            case 'right':
                if (current.id == "depart") {
                    //左边
                    Page.jumpHomeTab("homeTab1", "nav-btn-2");
                    return false;
                }
                break;
        }
    },

    onClickRegion: function (btn) {
        G("depart").innerHTML = G(btn.id).innerHTML;
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
        }
    },
    // 推荐位点击
    onClickRecommendPosition: function (btn) {
        if (btn.id == 'btn-renew' || btn.id == 'btn-order') {
            Page.jumpBuyVip("首页订购", null);
        }
    },
};

var P2PManagerUI = {
    docArr: "",
    hospitalCut: 4,
    hospitalPage: parseInt(RenderParam.pageCurrent),
    totalPage: 0,
    _itemRow: function (tempDocObj, index) {
        var defaultImg = g_appRootPath + "/Public/img/hd/DoctorP2P/V10/init_doc.png";
        var tempHtml = "";
        var tempImgUrl = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.expertUrl, tempDocObj.doc_id, tempDocObj.avatar_url, RenderParam.carrierId);
        console.log("tempImgUrl::" + tempImgUrl);

        // 调整医院名称为空时，不显示null
        tempDocObj.hospital = tempDocObj.hospital ? tempDocObj.hospital : '';

        tempHtml += '<div id="recommended-' + index + '" class="recommended">';
        tempHtml += '<img class="recommended-bg" src="' + P2PManagerUI.getDoctorStatusImage(tempDocObj.online_state) + '"/>';
        tempHtml += "<img class='recommended-photo' src='" + tempImgUrl + "' onerror='this.src=" + defaultImg + "'>";
        tempHtml += '<div id="inquiry-number" class="inquiry-number">已问诊<span>' + LMEPG.Inquiry.p2pApi.switchInquiryNumStr(tempDocObj.inquiry_num) + '</span></div>';
        tempHtml += '<div class="introduce">';
        tempHtml += '<div class="introduce-word big-size">' + tempDocObj.doc_name + '</div>';
        tempHtml += '<div class="introduce-word middle-size">' + tempDocObj.hospital + '</div>';
        tempHtml += '<div class="introduce-word">科室：<span>' + tempDocObj.department + '</span></div>';
        tempHtml += '<div class="introduce-word">职称：<span>' + tempDocObj.job_title + '</span></div>';
        tempHtml += '</div></div>';
        return tempHtml;
    },
    init: function () {
        G("depart-name").innerHTML = RenderParam.departmentName;
        LMEPG.UI.showWaitingDialog();
        P2PManagerUI.createHtml();
        P2PManagerUI._addButton();
        Home.initButtons();

    },

    createHtml: function () {
        var requestInfo = {
            deptId: RenderParam.departmentId,       // 医院科室ID
            deptIndex: RenderParam.departmentIndex, // 医院科室编号
            page: P2PManagerUI.hospitalPage,        // 医生列表分页所在分页
            pageSize: P2PManagerUI.hospitalCut       // 医生列表单页显示医生数量
        }
        LMEPG.Inquiry.p2pApi.getDoctorList(true, requestInfo, function (data) {
            console.log("data::" + JSON.stringify(data));
            P2PManagerUI.totalPage = data.total;
            if (data.code !== "0") {
                console.log("getDoctorList::" + data.code);
                return null;
            }
            var tempList = data.list;
            P2PManagerUI.docArr = tempList;
            var sHtml = "";
            for (var i = 0; i < tempList.length; i++) {
                var tempDocObj = tempList[i];
                sHtml += P2PManagerUI._itemRow(tempDocObj, i);
            }
            G("table-list").innerHTML = sHtml;
            LMEPG.UI.dismissWaitingDialog();
            G("pages").innerHTML = "" + P2PManagerUI.hospitalPage + "/ " + Math.ceil(P2PManagerUI.totalPage / 4);
            if (P2PManagerUI.hospitalPage >= Math.ceil(P2PManagerUI.totalPage / 4)) {
                Hide("m-next");
            } else {
                Show("m-next");
            }
            if (!Home.isFirstLoad) {
                Home.isFirstLoad = true;
                LMEPG.ButtonManager.requestFocus(RenderParam.focusIndex);
            } else {
                LMEPG.ButtonManager.requestFocus("recommended-0");
            }
        });
    },
    _addButton: function () {
        for (var i = 0; i < 4; i++) {
            buttons.push({
                id: 'recommended-' + i,
                name: '推荐位',
                type: 'div',
                nextFocusLeft: 'recommended-' + (i - 1),
                nextFocusRight: 'recommended-' + (i + 1),
                nextFocusUp: 'recommended-' + (i - 2),
                nextFocusDown: 'recommended-' + (i + 2),
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_card.png",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_card.png",
                click: P2PManagerUI.onClickDoc,
                focusChange: Home.recommendedFocus,
                beforeMoveChange: P2PManagerUI.onRecommendBeforeMoveChange,
                cIndex: i,
                cDocObj: ""
            });
        }
    },
    onClickDoc: function (btn) {
        var tempDocObj = P2PManagerUI.docArr[btn.cIndex];
        Page.jumpP2PDetail(tempDocObj.doc_id);
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                switch (current.id) {
                    case 'recommended-0':
                    case 'recommended-1':
                        P2PManagerUI.prevRecommendedPage();
                        return false;
                }
                // if (current.cType == "region") {
                //     G("region-content").style.display = "none";
                // }
                // LMEPG.UI.scrollVertically(current.id, scroll, "up", 17);
                break;
            case'down':
                switch (current.id) {
                    case 'recommended-2':
                    case 'recommended-3':
                        P2PManagerUI.nextRecommendedPage();
                        return false;
                    case "recommended-1":
                        if (!G("recommended-3") && G("recommended-2")) {
                            LMEPG.BM.requestFocus("recommended-2");
                        }
                        break;
                }

                break;
            case 'left':
                switch (current.id) {
                    case 'recommended-0':
                    case 'recommended-2':
                        Page.jumpHomeTab('homeTab2');
                        return false;
                }
                break;
            case 'right':
                switch (current.id) {
                    case 'recommended-1':
                    case 'recommended-3':
                        Page.jumpHomeTab('homeTab1');
                        return false;
                }
                break;
        }
    },

    upDateRecommendedArrow: function () {
        G("m-pre").style.display = "none";
        G("m-next").style.display = "none";
        if (P2PManagerUI.hospitalPage > 1) {
            // G("m-pre").style.display = "block";
        } else {
            G("m-pre").style.display = "none";
        }
        if (Math.ceil(Math.ceil(parseInt(P2PManagerUI.totalPage)) / P2PManagerUI.hospitalCut) > P2PManagerUI.hospitalPage) {
            G("m-next").style.display = "block";
        } else {
            G("m-next").style.display = "none";
        }
    },


    prevRecommendedPage: function () {
        if (P2PManagerUI.hospitalPage > 1) {
            P2PManagerUI.hospitalPage--;
            P2PManagerUI.createHtml()//渲染医院列表
        } else {
            // LMEPG.ButtonManager.requestFocus("btn-region");
            LMEPG.ButtonManager.requestFocus("depart");
        }
    },

    nextRecommendedPage: function () {
        if (Math.ceil(parseInt(P2PManagerUI.totalPage) / P2PManagerUI.hospitalCut) > P2PManagerUI.hospitalPage) {
            P2PManagerUI.hospitalPage++;
            P2PManagerUI.createHtml()//渲染医院列表
        } else {

        }
    },

    /**
     * 根据医生状态获取显示的图像
     * @param status 医生状态
     */
    getDoctorStatusImage: function (status) {
        var statusImage = '';
        switch (status) {
            case '0': // 离线
                statusImage = 'off_line.png';
                break;
            case '3': // 在线
                statusImage = 'on_line.png';
                break;
            case '2': // 忙碌
            case '4': // 假忙碌
                statusImage = 'busy.png';
                break;
            default:
                statusImage = 'off_line.png';
                break;
        }
        return g_appRootPath + '/Public/img/hd/DoctorP2P/V10/status_' + statusImage;
    }

}