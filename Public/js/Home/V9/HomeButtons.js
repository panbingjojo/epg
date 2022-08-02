/**
 * 页面跳转
 * @type {{}}
 */
var JumpPage = {

    getCurrentPage: function () {
        var current = LMEPG.ButtonManager.getCurrentButton();
        var objCurrent = LMEPG.Intent.createIntent("home");
        objCurrent.setParam("focusIndex", current.id);
        return objCurrent;
    },
    /**
     * 跳转菜单选中页
     * @param btn
     * @param classifyId
     * @param modelType
     */
    jumpMenuPage: function (btn, classifyId, modelType) {

        var objCurrent = JumpPage.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("menuTab");
        objHomeTab.setParam("userId", RenderParam.userId);
        objHomeTab.setParam("pageIndex", btn.cIdx);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },
    /**
     * 跳转保健页
     * @param btn
     * @param classifyId
     * @param modelType
     */
    jumpHealthCarePage: function (btn, classifyId, modelType) {

        var objCurrent = JumpPage.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("healthCare");
        objHomeTab.setParam("userId", RenderParam.userId);
        objHomeTab.setParam("pageIndex", btn.cIdx);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },
    /**
     * 跳转 - 搜索页
     * */
    jumpSearchPage: function (btn) {
        var objCurrent = JumpPage.getCurrentPage();
        objCurrent.setParam("userId", RenderParam.userId);
        // objCurrent.setParam("classifyId", RenderParam.classifyId);
        // objCurrent.setParam("fromId", "1");
        objCurrent.setParam("focusIndex", btn.id);
        objCurrent.setParam("page", "0");

        var objSearch = LMEPG.Intent.createIntent("search");
        objSearch.setParam("userId", RenderParam.userId);
        objSearch.setParam("position", "tab1");


        LMEPG.Intent.jump(objSearch, objCurrent);
    },
    /**
     * 跳转 - 收藏页
     */
    jumpCollectPage: function () {
        var objCurrent = JumpPage.getCurrentPage();
        objCurrent.setParam("userId", RenderParam.userId);
        // objCurrent.setParam("classifyId", RenderParam.classifyId);
        objCurrent.setParam("position", "collect");
        objCurrent.setParam("fromId", "1");
        objCurrent.setParam("page", "0");

        var objCollect = LMEPG.Intent.createIntent("collect");
        objCollect.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objCollect, objCurrent);
    },
    /**
     * 跳转到预约挂号页
     */
    jumpGuaHaoPage: function () {
        //预约挂号首页
        var objCurrent = JumpPage.getCurrentPage();

        var objHospitalList = LMEPG.Intent.createIntent("orderRegister");
        LMEPG.Intent.jump(objHospitalList, objCurrent);
    },
    videoMore: function () {
        var objHome = JumpPage.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", 1);
        objHome.setParam("fromId", "2");

        var objAlbum = LMEPG.Intent.createIntent("album");
        objAlbum.setParam("userId", RenderParam.userId);
        objAlbum.setParam("albumName", "QHfreeAlbum");
        objAlbum.setParam("inner", 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 推荐位被点击
     * @param btn
     */
    onRecommendClick: function (btn) {
        var position = btn.cIdx;   // 得到位置类型数据
        var idx = "";
        // 第一号推荐位
        if (position == RenderParam.recommendDataList[0].position) {
            idx = G('center-link-1').getElementsByClassName('active')[0].getAttribute('data-Link');
        }

        var data = JumpPage.getRecommendDataByPosition(position, idx);
        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(position, data.order);
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
                    "entryTypeName": "home",
                    "focusIdx": btn.id,
                    "unionCode": data.union_code,
                };

                if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                    Page.jumpPlayVideo(videoInfo);
                } else {
                    Page.jumpBuyVip(videoInfo.title, videoInfo);
                }
                break;
            case "4":
                // 更多视频
                Page.jumpChannelPage(data.title, data.source_id, "1");
                break;
            case "13":
            case "39": // 健康图文
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
            case "24":
                //夜间药房
                Page.jumpnightMedicine();
                break;
            case "10":
                Page.jump39Hospital();
                break;
            case '9':
                Page.jumpInquiry();
                break;
            case '48':
                //跳转第三方网页
                Page.jumpEpidemic();
                break;
            case '19': // 专家约诊
                Page.jumpExpertHome();
                break;
            case "11": // 我的家
                Page.jumpFamilyHome();
                break;
            case '56': //跳转小包视频 中老年健康、宝贝天地
            case '57':
                Page.jumpPacketChannel(data.entryType);
                break;
            case '17': // 健康检测
                Page.jumpHealthTest();
                break;
        }
    },

    // 2号推荐位，小窗口视频播放
    onRecommendPollVideoClick: function (btn) {
        var position = btn.cIdx;   // 得到位置类型数据
        var data = JumpPage.getRecommendPollVideoDataByPosition(position);
        if (data == "") {
            LMEPG.UI.showToast("小窗口视频信息有误！", 3);
            return;
        }

        // 创建视频信息
        var videoInfo = {
            "sourceId": data.sourceId,
            "videoUrl": data.videoUrl,
            "title": data.title,
            "type": data.modelType,
            "userType": data.userType,
            "freeSeconds": data.freeSeconds,
            "entryType": 1,
            "entryTypeName": "home",
            "focusIdx": btn.id,
            "unionCode": data.unionCode,
        };

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            Page.jumpPlayVideo(videoInfo);
        } else {
            Page.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },
    /**
     * 通过推荐位编号得到推荐位数据
     * @param: position 推荐位编号（比如1 号推荐位 --11 ）
     * @param: idx 此推荐位的推荐个数索引，比如一个推荐位有3个内容，引索引为（0，1，2）
     * @param position
     */
    getRecommendDataByPosition: function (position, idx) {
        var tmpData = "";
        var dataList = RenderParam.recommendDataList;
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            if (data.position == position) {
                if (idx != "") {
                    tmpData = data.item_data[idx];
                } else {
                    tmpData = data.item_data[0];
                }
                break;
            }
        }

        // 重新组装数据
        var data = {};
        if (tmpData != "") {
            data.image_url = tmpData.img_url;
            data.entryType = tmpData.entry_type;
            data.order = tmpData.order;

            //解析视频ID
            var paramArr = JSON.parse(tmpData.parameters);
            data.source_id = paramArr[0].param;

            // 解析视频内部参数
            if (tmpData.inner_parameters != "") {
                var innerParams = JSON.parse(tmpData.inner_parameters);
                data.title = innerParams.title;
                data.model_type = innerParams.model_type;
                data.user_type = innerParams.user_type;
                data.play_url = innerParams.ftp_url;
                data.freeSeconds = innerParams.free_seconds;
            }
        }

        return data;
    },

    /**
     * 针对推荐位2 进行数据处理（主要是视频轮播）
     * @param: position 此推荐位的推荐个数索引，比如一个推荐位有3个内容，引索引为（0，1，2）
     */
    getRecommendPollVideoDataByPosition: function (position) {
        var data = "";
        if (position == "-1") { // 表示点击正在播放的视频位置
            data = Play.getCurrentPollVideoData();
        } else {
            var dataList = RenderParam.homePollVideoList;
            if (dataList.count > 0) {
                data = dataList.list[position];
            }
        }
        return data;
    },
};

function getButtons() {
    var lastNavIndex = RenderParam.navConfig.length;
    var isShowOrder = !!G('order');
    var buttons = [{
        id: 'order',
        name: '',
        type: 'img',
        nextFocusLeft: 'help',
        nextFocusRight: 'search',
        nextFocusUp: '',
        nextFocusDown: 'nav-' + lastNavIndex,
        backgroundImage: g_appRootPath + "/Public/img/hd/Home/V9/tab0/order.png",
        focusImage: g_appRootPath + "/Public/img/Common/spacer.gif",
        bgImage: g_appRootPath + "/Public/img/hd/Home/V9/tab0/order_focus.png",
        click: Page.jumpOrderHome,
        focusChange: topIconOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    },{
        id: 'search',
        name: '',
        type: 'img',
        nextFocusLeft: isShowOrder ? 'order' : 'help',
        nextFocusRight: 'collection',
        nextFocusUp: '',
        nextFocusDown: 'nav-' + lastNavIndex,
        backgroundImage: g_appRootPath + "/Public/img/hd/Home/V7/tab0/search.png",
        focusImage: g_appRootPath + "/Public/img/Common/spacer.gif",
        bgImage: g_appRootPath + "/Public/img/hd/Home/V7/tab0/search_f.png",
        click: JumpPage.jumpSearchPage,
        focusChange: topIconOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    }, {
        id: 'collection',
        name: '',
        type: 'img',
        nextFocusLeft: 'search',
        nextFocusRight: 'help',
        nextFocusUp: '',
        nextFocusDown: 'nav-' + lastNavIndex,
        backgroundImage: g_appRootPath + "/Public/img/hd/Home/V7/tab0/collection.png",
        focusImage: g_appRootPath + "/Public/img/Common/spacer.gif",
        bgImage: g_appRootPath + "/Public/img/hd/Home/V7/tab0/collection_f.png",
        click: JumpPage.jumpCollectPage,
        focusChange: topIconOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    }, {
        id: 'help',
        name: '',
        type: 'img',
        nextFocusLeft: 'collection',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: 'nav-' + lastNavIndex,
        backgroundImage: g_appRootPath + "/Public/img/hd/Home/V7/tab0/help.png",
        focusImage: g_appRootPath + "/Public/img/Common/spacer.gif",
        bgImage: g_appRootPath + "/Public/img/hd/Home/V7/tab0/help_f.png",
        click: showHelpIntroduce,
        focusChange: topIconOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    },
        /**
         * 导航菜单------
         */
        {
            id: 'nav-1',
            name: '推荐',
            type: 'img',
            nextFocusLeft: 'nav-' + lastNavIndex,
            nextFocusRight: 'nav-2',
            nextFocusUp: isShowOrder ? 'order' : 'search',
            nextFocusDown: 'night-medicine',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_out,
            click: "",
            focusChange: nav1hasFocus,
            beforeMoveChange: "",
            moveChange: "",
            cIdx: "",
        }, {
            id: 'nav-2',
            name: '老年',
            type: 'img',
            nextFocusLeft: 'nav-1',
            nextFocusRight: 'nav-3',
            nextFocusUp: isShowOrder ? 'order' : 'search',
            nextFocusDown: 'night-medicine',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_out,
            click: JumpPage.jumpMenuPage,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            cIdx: 1,
        }, {
            id: 'nav-3',
            name: '育儿',
            type: 'img',
            nextFocusLeft: 'nav-2',
            nextFocusRight: 'nav-4',
            nextFocusUp: isShowOrder ? 'order' : 'search',
            nextFocusDown: 'carousel-link',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_out,
            click: JumpPage.jumpMenuPage,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            cIdx: 2,
        }, {
            id: 'nav-4',
            name: '女性',
            type: 'img',
            nextFocusLeft: 'nav-3',
            nextFocusRight: 'nav-5',
            nextFocusUp: isShowOrder ? 'order' : 'search',
            nextFocusDown: 'carousel-link',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_out,
            click: JumpPage.jumpMenuPage,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            cIdx: 3,
        }, {
            id: 'nav-5',
            name: '男性',
            type: 'img',
            nextFocusLeft: 'nav-4',
            nextFocusRight: lastNavIndex > 5 ? 'nav-6' : 'nav-1',
            nextFocusUp: isShowOrder ? 'order' : 'search',
            nextFocusDown: 'videoTv-link',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).focus_out,
            click: JumpPage.jumpMenuPage,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            cIdx: 4,
        },
        /**
         * 左边四个---
         */
        {
            id: 'night-medicine',
            name: '推荐位6',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'carousel-link',
            nextFocusUp: 'nav-1',
            nextFocusDown: '39-featured',
            click: JumpPage.onRecommendClick,
            focusChange: linkOnFocus,
            beforeMoveChange: "",
            moveChange: "",
            cIdx: "16",
        }, {
            id: '39-featured',
            name: '推荐位7',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'carousel-link',
            nextFocusUp: 'night-medicine',
            nextFocusDown: 'history-album',
            click: JumpPage.onRecommendClick,
            focusChange: linkOnFocus,
            beforeMoveChange: "",
            moveChange: "",
            cIdx: "17",
        }, {
            id: 'history-album',
            name: '推荐位8',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'book-registration',
            nextFocusUp: '39-featured',
            nextFocusDown: 'free-area',
            click: JumpPage.onRecommendClick,
            focusChange: linkOnFocus,
            beforeMoveChange: "",
            moveChange: "",
            cIdx: "18",
        }, {
            id: 'free-area',
            name: '推荐位9',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'book-registration',
            nextFocusUp: 'history-album',
            nextFocusDown: '',
            click: JumpPage.onRecommendClick,
            focusChange: linkOnFocus,
            beforeMoveChange: "",
            moveChange: "",
            cIdx: "19",
        },
        /**
         * 中间三个---
         */
        {
            id: 'carousel-link',
            name: '推荐位1',
            type: 'img',
            nextFocusLeft: 'night-medicine',
            nextFocusRight: 'videoTv-link',
            nextFocusUp: 'nav-3',
            nextFocusDown: 'book-registration',
            backgroundImage: g_appRootPath + "/Public/img/Common/spacer.gif",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V7/tab0/carousel_f.png",
            click: JumpPage.onRecommendClick,
            focusChange: carouselFocus,
            beforeMoveChange: "",
            moveChange: "",
            cIdx: RenderParam.recommendDataList[0].position,
        }, {
            id: 'book-registration',
            name: '推荐位5',
            type: 'img',
            nextFocusLeft: 'history-album',
            nextFocusRight: 'do-smile-people',
            nextFocusUp: 'carousel-link',
            nextFocusDown: '',
            click: JumpPage.onRecommendClick,
            focusChange: linkOnFocus,
            beforeMoveChange: "",
            moveChange: "",
            cIdx: "15",
        }, {
            id: 'do-smile-people',
            name: '推荐位4',
            type: 'img',
            nextFocusLeft: 'book-registration',
            nextFocusRight: 'album-inner',
            nextFocusUp: 'carousel-link',
            nextFocusDown: '',
            click: JumpPage.onRecommendClick,
            focusChange: linkOnFocus,
            beforeMoveChange: "",
            moveChange: "",
            cIdx: "14",
        },
        /**
         * 右边2个-----
         */
        {
            id: 'videoTv-link',
            name: '推荐位2 -- 1号',
            type: 'img',
            nextFocusLeft: 'carousel-link',
            nextFocusRight: '',
            nextFocusUp: 'nav-5',
            nextFocusDown: 'album-inner',
            click: JumpPage.onRecommendPollVideoClick,
            focusChange: linkOnFocus,
            beforeMoveChange: "",
            moveChange: "",
            cIdx: "-1",
        },
        {
            id: 'album-inner',
            name: '推荐位3',
            type: 'img',
            nextFocusLeft: 'do-smile-people',
            nextFocusRight: '',
            nextFocusUp: 'videoTv-link',
            nextFocusDown: '',
            click: JumpPage.onRecommendClick,
            focusChange: linkOnFocus,
            beforeMoveChange: "",
            moveChange: "",
            cIdx: "13",
        },
        /**
         * 脚手架ID
         */
        {
            id: 'debug',
            name: '',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: onBack,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            cIdx: "",
        },];
    if (lastNavIndex > 5) { // 当配置的数组超过5条时
        buttons.push({
            id: 'nav-6',
            name: '保健',
            type: 'img',
            nextFocusLeft: 'nav-5',
            nextFocusRight: 'nav-1',
            nextFocusUp: 'collection',
            nextFocusDown: 'videoTv-link',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[5].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[5].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[5].img_url).focus_out,
            click: JumpPage.jumpHealthCarePage,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            cIdx: 5,
        });
    }
    return buttons;
}

// var buttons = getButtons();
var buttons ;

function topIconOnFocus(btn, hasFocus) {
    var curObj = document.getElementById(btn.id);
    if (hasFocus) {
        curObj.style.backgroundImage = "url(" + btn.bgImage + ")";
    } else {
        curObj.style.backgroundImage = "url(" + btn.focusImage +")";
    }
}

/**
 * 轮播获得失去焦点事件
 * @param btn
 * @param hasFocus
 */
function carouselFocus(btn, hasFocus) {
    if (hasFocus) {
        clearInterval(carouselTimer);
    } else {
        clearInterval(carouselTimer);
        carouselTimer = setInterval(renderHomePage.loop, 2000);
    }
}


function nav1hasFocus(btn, hasFocus) {
    var currentId = LMEPG.ButtonManager.getButtonById("nav-1");
    G("nav-1").src = currentId.selectedImage;
    if (hasFocus) {
        G("nav-1").src = btn.focusImage;
    } else {
    }
}

function linkOnFocus(btn, hasFocus) {
    if (hasFocus) {
        G(btn.id).className = "focus";
    } else {
        G(btn.id).removeAttribute("class");
    }
}

function showHelpIntroduce() {
    Show("help-introduce");
    LMEPG.ButtonManager.requestFocus("debug");
}

/**
 * 当在首页按返回时，如果已经弹出新手指导信息，则关闭新手指导信息
 * 如果没有弹出新手指导，则退出应用
 */
function onBack() {
    if (G("help-introduce").style.display == "block") {
        Hide("help-introduce");
        LMEPG.ButtonManager.requestFocus("nav-1");
    } else {
        //LMEPG.Intent.back("IPTVPortal");
        Page.jumpHoldPage();
    }
}

