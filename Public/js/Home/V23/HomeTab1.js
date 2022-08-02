/***********************首页导航栏js控制***************************/
// 定义全局按钮
var buttons = [];
var scroll = "center";

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
        var currentPage = LMEPG.Intent.createIntent("appointmentRegister");
        if (!LMEPG.ButtonManager.getCurrentButton().id.startWith('nav_')) {
            currentPage.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        } else {
            currentPage.setParam('focusIndex', Home.defaultFocusId);
        }
        currentPage.setParam('scrollTop', G("center").scrollTop);
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
    defaultFocusId: 'recommended-1',
    // defaultFocusId: 'nav-btn-2',
    defaultUrl: g_appRootPath + "/Public/img/hd/Home/V10/",

    navImgs: [],                            //导航栏图片数组

    //页面初始化操作
    init: function () {
        Home.initRenderAll();                //渲染页面
        Home.initButtons();                 // 初始化焦点按钮
        NewGuidanceUtil.checkIsFirstTimeEntry("tab1_step", function () {
            LMEPG.BM.requestFocus("btn-region");
            Guide.open(1, "tab1_step");
        });//新手指导部分
    },

    /**
     * 初始化渲染页面,将后台活动的数据和前端dom绑定
     */
    initRenderAll: function () {
        // Home.renderThemeUI();             // 渲染主题背景
        // Home.renderNavigationBar();       //渲染导航栏按钮
        // Home.renderVipInfo();             //渲染vip信息
        DataList.regionData = Home.formatRegionData(RenderParam.areaList);
        DataList.createRegion(DataList.regionData);//渲染区域选择
        DataList.hospitalData.list = Home.formatHospitalData(RenderParam.hospitalList);
        DataList.createHospital(DataList.hospitalData.list)//渲染医院列表
        // Home.renderRecommendPosition();   //渲染推荐位
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
    /*renderVipInfo: function () {
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
*/
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
        // Home.initNavigationBar();           // 初始化顶部[导航栏按钮]
        // Home.initRecommendPosition();       // 初始化[推荐位按钮]
        Home.initRegionBtn();         // 初始化[区域按钮]
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        if (lastFocusId == "btn-order" && (RenderParam.isVip == "1" || RenderParam.isVip == 1)) {
            lastFocusId = Home.defaultFocusId;
        }
        LMEPG.ButtonManager.init(lastFocusId, buttons, "", true);
        G(scroll).scrollTop = RenderParam.scrollTop;
        G("center").style.overflow = "auto";
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

        if (RenderParam.isVip != "1" && RenderParam.isVip != 1) {
            if (isShow("order-status-vip-timeout")) {
                buttons.push({
                    id: 'btn-renew',
                    name: '续订',
                    type: 'img',
                    nextFocusLeft: 'nav-btn-5',
                    nextFocusRight: '',
                    nextFocusUp: '',
                    nextFocusDown: 'btn-region',
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
                    nextFocusDown: 'btn-region',
                    backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/bg_order.png",
                    focusImage: g_appRootPath + "/Public/img/hd/Home/V10/f_order.png",
                    click: Home.onClickRecommendPosition,
                    focusChange: "",
                    beforeMoveChange: Home.onRecommendBeforeMoveChange,
                });
            }
        }
    },
// 初始化区域选择按钮
    initRegionBtn: function () {
        buttons.push({
            id: 'btn-region',
            name: '区域选择',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'region-btn-1',
            nextFocusUp: '',
            nextFocusDown: 'recommended-1',
            backgroundImage: "",
            focusImage: "",
            click: Home.onClickNavigation,
            focusChange: Home.regionFocus,
            beforeMoveChange: DataList.onRecommendBeforeMoveChange,
            cType: "region",
        });
        for (var i = 0; i < DataList.regionCut; i++) {
            buttons.push({
                id: 'region-btn-' + (i + 1),
                name: '区域选择',
                type: 'img',
                nextFocusLeft: 'region-btn-' + i,
                nextFocusRight: 'region-btn-' + (i + 2),
                nextFocusUp: 'nav-btn-2',
                nextFocusDown: 'recommended-1',
                backgroundImage: "",
                focusImage: "",
                click: Home.onClickRegion,
                focusChange: Home.regionFocus,
                beforeMoveChange: DataList.onRecommendBeforeMoveChange,
                cType: "region",
            });
        }

    },

    regionFocus: function (btn, hasFocus) {
        if (hasFocus) {
            G(scroll).scrollTop = 0;
            G("center").style.overflow = "hidden";
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
            LMEPG.UI.Marquee.stop();
            LMEPG.UI.Marquee.start(btn.id, 4, 5, 50, "left", "scroll");
            if (btn.cType = "region") {
                G("region-content").style.display = "block";
            }
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            // if(btn.id="btn-region") {
            //     G("region-content").style.display="none";
            // }
        }
    },
    // 加边框焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended-hover");
            LMEPG.UI.Marquee.stop();
            LMEPG.UI.Marquee.start(btn.id + "-title", 13, 5, 50, "left", "scroll");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended-hover");
            LMEPG.UI.Marquee.stop();
        }
    },

    onClickRegion: function (btn) {
        G("btn-region").innerHTML = G(btn.id).innerHTML;
        var pos = G(btn.id).getAttribute("pos");
        console.log(DataList.regionData[pos].city_id);
        // 获取指定区域的医院列表
        var postData = {
            "areaId": DataList.regionData[pos].city_id,
        };
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("GuaHao/getAppointmentHospitalList", postData, function (data) {
            var data = JSON.parse(data);
            DataList.hospitalData.list = Home.formatHospitalData(data);
            DataList.createHospital(DataList.hospitalData.list); // 渲染医院列表
            LMEPG.UI.dismissWaitingDialog();
        });
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
            var data = getRecommendDataByPosition(btn.cPosition);
            switch (data.entryType) {
                case "5":
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
                        "entryTypeName": "homeTab1",
                        "focusIdx": btn.id,
                        "unionCode": data.union_code,
                    };

                    if (isAllowPlay(videoInfo)) {
                        Page.jumpPlayVideo(videoInfo);
                    } else {
                        Page.jumpBuyVip(videoInfo.title, videoInfo);
                    }
                    break;
                case "4":
                    // 更多视频
                    Page.jumpHealthVideoHome(data.title, data.source_id, "1");
                    break;
                case "13":
                    // 专辑
                    Page.jumpAlbumPage(data.source_id);
                    break;
                case "3":
                    // 活动
                    Page.jumpActivityPage(data.source_id);
                    break;
                case "14":
                    //预约挂号首页
                    Page.jumpGuaHaoPage();
                    break;
                case "22":
                    // 具体地址跳转
                    LMEPG.UI.showToast("具体地址跳转");
                    break;
                case "10":
                    Page.jump39Hospital();
                    break;
            }
        }
    },

    // 格式化区域数据
    formatRegionData: function (areaList) {
        var regionData = [];
        if (areaList.result == 0) {
            if (areaList.list != null && areaList.list.length > 0) {
                for (var i = 0; i < areaList.list[0].city.length; i++) {
                    var item = {};
                    item.city_id = areaList.list[0].city[i].city_id;
                    item.city_name = areaList.list[0].city[i].city_name;
                    regionData.push(item);
                }
            }
        } else {
            LMEPG.UI.showToast("获取区域列表失败");
            Home.defaultFocusId = "nav-btn-2";
        }
        return regionData;
    },

    // 格式化医院数据
    formatHospitalData: function (hospitalList) {
        var hospitalData = [];
        if (hospitalList.result == 0) {
            if (hospitalList.list != null && hospitalList.list.length > 0) {
                for (var i = 0; i < hospitalList.list.length; i++) {
                    var item = {};
                    item.hospital_id = hospitalList.list[i].hosl_id;
                    item.hospital_name = hospitalList.list[i].hosl_name;
                    item.is_province = hospitalList.list[i].is_province;
                    item.img_url = RenderParam.guahaoUrl + hospitalList.list[i].hosl_pic;
                    item.is_vip = "0";
                    item.produce = hospitalList.list[i].hosl_name;
                    hospitalData.push(item);
                }
            }
        } else {
            LMEPG.UI.showToast("获取医院列表失败");
            Home.defaultFocusId = "nav-btn-2";
        }
        return hospitalData;
    },

    // 跳转到医院首页或扫码页面（扫码页面的医院不支持在电视端挂号）
    onJumpDepartment: function (btn) {
        console.log(btn.cPosition);
        console.log(DataList.hospitalData.list[btn.cPosition].hospital_id);
        var hospital_id = DataList.hospitalData.list[btn.cPosition].hospital_id;
        var is_province = DataList.hospitalData.list[btn.cPosition].is_province;
        var objCurrent = Page.getCurrentPage();
        if (is_province == 0) {
            var objDst = LMEPG.Intent.createIntent("departmentDetail");
        } else {
            var objDst = LMEPG.Intent.createIntent("createCode");
        }
        objDst.setParam("hospital_id", hospital_id);
        objDst.setParam("is_province", is_province);
        LMEPG.Intent.jump(objDst, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    }
};

var DataList = {
    regionData: [
        {"city_id": 1, "city_name": "贵阳市"}, //区域数据
        {"city_id": 1, "city_name": "黔东南市"},
        {"city_id": 1, "city_name": "凯里市"},
        {"city_id": 1, "city_name": "六盘水市"},
        {"city_id": 1, "city_name": "毕节市"},
        {"city_id": 1, "city_name": "遵义市"}
    ],
    hospitalCut: 3,
    regionCut: 5,
    page: 0,
    hospitalPage: 3,
    hospitalData: {
        "list": [{
            "hospital_name": "1",
            "img_url": Home.defaultUrl + "text_2.png",
            "is_vip": "0",
            "produce": "今天很开心，我要做一个成功的人是"
        },
            {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "1",
                "produce": "今天很开心"
            }, {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "0",
                "produce": "今天很开心，我要做一个成功的人是"
            }, {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "0",
                "produce": "今天很开心"
            }, {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "1",
                "produce": "今天很开心，我要做一个成功的人是"
            }, {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "0",
                "produce": "今天很开心"
            }, {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "1",
                "produce": "今天很开心，我要做一个成功的人是"
            },]
    },
    // 翻页数据截取
    cut: function (arr, atMove, count) {
        return arr.slice(atMove, atMove + count);
    },
    // 创建区域
    createRegion: function (arr) {
        LMEPG.UI.Marquee.stop();
        var sHtml = "";
        var regionDataInfo = DataList.cut(arr, DataList.page, this.regionCut);
        console.log(regionDataInfo)
        for (var i = 0; i < regionDataInfo.length; i++) {
            sHtml += '<div id="region-btn-' + (i + 1) + '" class="region-btn" pos="' + (i + DataList.page) + '">' + regionDataInfo[i].city_name + '</div>';
        }
        G("region-list").innerHTML = sHtml;
        DataList.upDateArrow();
    },

    // 创建医院
    createHospital: function (arr) {
        var sHtml = "";
        var row = Math.ceil(arr.length / 3);
        var defaultImg =g_appRootPath+ "/Public/img/hd/Home/V10/default.png";
        for (var j = 0; j < row; j++) {
            sHtml += '<tr>';
            var hospitalDataInfo = DataList.cut(arr, this.hospitalPage * j, this.hospitalCut);
            for (var i = 0; i < hospitalDataInfo.length; i++) {
                sHtml += '<td ><div id="recommended-' + ((j * 3) + (i + 1)) + '" class="recommended">';
                sHtml += '<img class="recommended-bg" src="' + hospitalDataInfo[i].img_url + '" onerror="this.src=' + defaultImg + '" />';
                if (hospitalDataInfo[i].is_vip == "1") {
                    sHtml += '<img id="recommend-' + ((j * 3) + (i + 1)) + '-vip-icon" class="vip-icon" src="__ROOT__/Public/img/hd/Home/V10/icon_vip.png"/>';
                }
                sHtml += '<div id="recommended-' + ((j * 3) + (i + 1)) + '-title" class="recommended-title">' + hospitalDataInfo[i].produce + '</div>';
                sHtml += '</div></td>';

                buttons.push({
                    id: 'recommended-' + ((j * 3) + (i + 1)),
                    name: '推荐位',
                    type: 'img',
                    nextFocusLeft: ((j * 3) + i) % 3 == 0 ? '' : 'recommended-' + ((j * 3) + i),
                    nextFocusRight: (((j * 3) + i) + 1) % 3 == 0 ? '' : 'recommended-' + ((j * 3) + (i + 2)),
                    nextFocusUp: 'recommended-' + ((j * 3) + (i + 1) - 3),
                    nextFocusDown: 'recommended-' + ((j * 3) + (i + 1) + 3),
                    backgroundImage: "",
                    focusImage: "",
                    click: Home.onJumpDepartment,
                    focusChange: Home.recommendedFocus,
                    beforeMoveChange: DataList.onRecommendBeforeMoveChange,
                    cPosition: (j * 3) + i, // 列表下标
                });

            }
            sHtml += '</tr>';

        }
        G("table-list").innerHTML = sHtml;
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                switch (current.id) {
                    case 'recommended-1':
                    case 'recommended-2':
                    case 'recommended-3':
                        LMEPG.ButtonManager.requestFocus("btn-region");
                        return false;
                }
                if (current.cType == "region") {
                    G("region-content").style.display = "none";
                } else {
                    ScrollControl.showScrollTop(current.id, "up");
                }
                break;
            case 'down':
                if (current.cType == "region") {
                    G("region-content").style.display = "none";
                }
                if (current.id == "btn-region" || current.id.substring(0, 10) == "region-btn") {
                    // G("center").scrollTop = G("center").scrollTop -1000;
                    // console.log(G("center").scrollTop);
                    // alert("ffff");
                } else {
                    G("center").style.overflow = "auto";
                    ScrollControl.showScrollTop(current.id, "down");
                }
                break;
            case 'left':
                switch (current.id) {
                    case 'region-btn-1':
                        DataList.prevPage();
                }
                // 向左跳转到主页
                var pos = current.cPosition;
                if (pos % 3 == 0) {
                    // Page.jumpHomeTab("home", "recommended-3");
                }
                break;
            case 'right':
                switch (current.id) {
                    case 'region-btn-5':
                        console.log('right.....')
                        DataList.nextPage();
                }
                // 向右跳转到健康视频
                var pos = current.cPosition;
                if ((pos + 1) % 3 == 0) {
                    // Page.jumpHomeTab("homeTab2");
                }
                break;
        }
    },

    prevPage: function () {
        if (DataList.page > 0) {
            DataList.page--;
            DataList.createRegion(DataList.regionData);
            LMEPG.ButtonManager.requestFocus("region-btn-1");
        } else {
            LMEPG.ButtonManager.requestFocus("btn-region");
            return false;
        }
    },

    nextPage: function () {
        console.log('nextPage： ' + DataList.page)
        if ((DataList.regionData.length - DataList.page) > DataList.regionCut) {
            DataList.page++;
            console.log('nextPage...if： ' + DataList.page)
            DataList.createRegion(DataList.regionData);
            LMEPG.ButtonManager.requestFocus("region-btn-5");
        } else {

        }
    },

    upDateArrow: function () {
        G("arrow-pre").style.display = "none";
        G("arrow-next").style.display = "none";
        if (DataList.page > 0) {
            G("arrow-pre").style.display = "block";
        } else {
            G("arrow-pre").style.display = "none";
        }
        if ((DataList.regionData.length - DataList.page) > DataList.regionCut) {
            G("arrow-next").style.display = "block";
        } else {
            G("arrow-next").style.display = "none";
        }
    }


}

var ScrollControl = {
    showScrollTop: function (id, dir) {
        LMEPG.UI.scrollVertically(id, scroll, dir, 18);
    },
}