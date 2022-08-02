/**
 * 页面跳转
 * @type {{}}
 */
var JumpPage = {
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent("MenuTabLevelThree");
        objCurrent.setParam("userId", RenderParam.userId);
        objCurrent.setParam("homeTabIndex", RenderParam.classifyId);
        objCurrent.setParam("currentTabIndex", RenderParam.currentTabIndex);
        objCurrent.setParam("modelType", RenderParam.modelType);
        objCurrent.setParam("focusIndex", RenderParam.focusIndex);
        objCurrent.setParam("modelTitle", RenderParam.title);
        objCurrent.setParam("homeTabName", G("title").innerText);
        objCurrent.setParam("classifyId", RenderParam.classifyId);
        objCurrent.setParam("pageCurrent", RenderParam.pageCurrent);

        return objCurrent;
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
    jumpCollectPage: function (btn) {
        var objCurrent = JumpPage.getCurrentPage();
        objCurrent.setParam("userId", RenderParam.userId);
        // objCurrent.setParam("classifyId", RenderParam.classifyId);
        objCurrent.setParam("position", "collect");
        objCurrent.setParam("focusIndex", btn.id);
        objCurrent.setParam("fromId", "1");
        objCurrent.setParam("page", "0");

        var objCollect = LMEPG.Intent.createIntent("collect");
        objCollect.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objCollect, objCurrent);
    },
    /**
     * 推荐位被点击
     * @param btn
     */
    onRecommendClick: function (btn) {
        var position = btn.cIdx;   // 得到位置类型数据

        var data = JumpPage.getRecommendDataByPosition(position);

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
                    "entryTypeName": "menuTabLevelThree",
                    "focusIdx": btn.id,
                    "unionCode": data.union_code,
                    "showStatus":data.show_status
                };

                //视频专辑下线处理
                if(videoInfo.showStatus == "3") {
                    LMEPG.UI.showToast('该节目已下线');
                    return;
                }

                LMEPG.ExtService.checkUserFuncLimit(RenderParam.isVip, function (isVipUser, msg) {
                    if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                        Page.jumpPlayVideo(videoInfo);
                    } else {
                        Page.jumpBuyVip(videoInfo.title, videoInfo);
                    }
                }, function (isVipUser, msg, vipUserLimitFuncIDs) {
                    LMEPG.UI.showToast(LMEPG.Tips.VIP_NOT_SUPPORT);
                }, LMEPG.ExtService.FuncID.FUNC_PLAY_VIDEO);
                break;
            case "4":
                // 更多视频
                Page.jumpChannelPage(data.title, data.source_id, "1");
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
                LMEPG.ui.showToast("具体地址跳转");
                break;
            case "24":
                //预约挂号首页
                Page.jumpnightMedicine();
                break;
            case "10":
                Page.jump39Hospital();
                break;
        }
    },
    /**
     * 通过推荐位编号得到推荐位数据
     * @param: position 推荐位编号
     * @param position
     */
    getRecommendDataByPosition: function (position) {
        var dataList = RenderParam.videoList;
        var tmpData = dataList[position];

        // 重新组装数据
        var data = {};
        if (tmpData != "") {
            data.image_url = tmpData.img_url;
            data.entryType = "5";
            data.source_id = tmpData.source_id;
            data.title = tmpData.title;

            data.model_type = tmpData.model_type;
            data.user_type = tmpData.user_type;
            data.play_url = tmpData.ftp_url;
            data.freeSeconds = tmpData.free_seconds;
            data.union_code = tmpData.union_code;
            data.show_status = tmpData.show_status;
        }

        return data;
    },

    // 解析导航信息
    parseNavInfo: function (position) {
        var dataList = RenderParam.navData.item_data;
        var tmpData = dataList[position];

        // 重新组装数据
        var data = {};
        if (tmpData != "") {
            data.image_url = tmpData.img_url;
            data.entryType = tmpData.entry_type;

            var paramArr = JSON.parse(tmpData.parameters);
            data.modelType = paramArr[0].param;

            // 解析视频内部参数
            if (tmpData.inner_parameters != "") {
                var innerParams = JSON.parse(tmpData.inner_parameters);
                data.title = innerParams.title;
            }
        }

        return data;
    }
};

/**
 * 页面虚拟按钮
 * @type {*[]}
 */
var buttons = [{
    id: 'search',
    name: '',
    type: 'img',
    nextFocusLeft: 'collection',
    nextFocusRight: 'collection',
    nextFocusUp: '',
    nextFocusDown: 'nav-3',
    backgroundImage: ROOT + "/Public/img/hd/Home/V27/search.png",
    focusImage: ROOT + "/Public/img/hd/Home/V27/search_f.png",
    click: JumpPage.jumpSearchPage,
    focusChange: "",
    beforeMoveChange: "",
    moveChange: "",
    cIdx: "",
}, {
    id: 'collection',
    name: '',
    type: 'img',
    nextFocusLeft: 'search',
    nextFocusRight: 'search',
    nextFocusUp: '',
    nextFocusDown: 'nav-3',
    backgroundImage: ROOT + "/Public/img/hd/Home/V27/collection.png",
    focusImage: ROOT + "/Public/img/hd/Home/V27/collection_f.png",
    click: JumpPage.jumpCollectPage,
    focusChange: "",
    beforeMoveChange: "",
    moveChange: "",
    cIdx: "",
},
    /**
     * 导航四个----
     */
    {
        id: 'nav-0',
        name: '',
        type: 'img',
        nextFocusLeft: 'nav-3',
        nextFocusRight: 'nav-1',
        nextFocusUp: 'search',
        nextFocusDown: 'video-link-0',
        backgroundImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav0.png",
        focusImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav0_f.png",
        selectedImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav0_s.png",
        click: clickSelectedFocus,
        focusChange: judgeSelectedFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 0,
    }, {
        id: 'nav-1',
        name: '',
        type: 'img',
        nextFocusLeft: 'nav-0',
        nextFocusRight: 'nav-2',
        nextFocusUp: 'search',
        nextFocusDown: 'video-link-0',
        backgroundImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav1.png",
        focusImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav1_f.png",
        selectedImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav1_s.png",
        click: clickSelectedFocus,
        focusChange: judgeSelectedFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 1,
    }, {
        id: 'nav-2',
        name: '',
        type: 'img',
        nextFocusLeft: 'nav-1',
        nextFocusRight: 'nav-3',
        nextFocusUp: 'search',
        nextFocusDown: 'video-link-0',
        backgroundImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav2.png",
        focusImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav2_f.png",
        selectedImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav2_s.png",
        click: clickSelectedFocus,
        focusChange: judgeSelectedFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 2,
    }, {
        id: 'nav-3',
        name: '',
        type: 'img',
        nextFocusLeft: 'nav-2',
        nextFocusRight: 'nav-0',
        nextFocusUp: 'search',
        nextFocusDown: 'video-link-0',
        backgroundImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav3.png",
        focusImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav3_f.png",
        selectedImage: ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav3_s.png",
        click: clickSelectedFocus,
        focusChange: judgeSelectedFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 3,
    },
    /**
     * 视频列表8个 --------
     */
    {
        id: 'video-link-0',
        name: '',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'video-link-1',
        nextFocusUp: 'nav-0',
        nextFocusDown: 'video-link-4',
        backgroundImage: ROOT + "/Public/img/Menu/common/spacer.gif",
        focusImage: ROOT + "/Public/img/Menu/common/levelThree_f.png",
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: turnPrevPage,
        moveChange: "",
        cIdx: "0",
    }, {
        id: 'video-link-1',
        name: '',
        type: 'img',
        nextFocusLeft: 'video-link-0',
        nextFocusRight: 'video-link-2',
        nextFocusUp: 'nav-1',
        nextFocusDown: 'video-link-5',
        backgroundImage: ROOT + "/Public/img/Menu/common/spacer.gif",
        focusImage: ROOT + "/Public/img/Menu/common/levelThree_f.png",
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: changeDownFocus,
        moveChange: "",
        cIdx: "1",
    }, {
        id: 'video-link-2',
        name: '',
        type: 'img',
        nextFocusLeft: 'video-link-1',
        nextFocusRight: 'video-link-3',
        nextFocusUp: 'nav-2',
        nextFocusDown: 'video-link-6',
        backgroundImage: ROOT + "/Public/img/Menu/common/spacer.gif",
        focusImage: ROOT + "/Public/img/Menu/common/levelThree_f.png",
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: changeDownFocus,
        moveChange: "",
        cIdx: "2",
    }, {
        id: 'video-link-3',
        name: '',
        type: 'img',
        nextFocusLeft: 'video-link-2',
        nextFocusRight: '',
        nextFocusUp: 'nav-3',
        nextFocusDown: 'video-link-7',
        backgroundImage: ROOT + "/Public/img/Menu/common/spacer.gif",
        focusImage: ROOT + "/Public/img/Menu/common/levelThree_f.png",
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: turnNextPage,
        moveChange: "",
        cIdx: "3",
    }, {
        id: 'video-link-4',
        name: '',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'video-link-5',
        nextFocusUp: 'video-link-0',
        nextFocusDown: '',
        backgroundImage: ROOT + "/Public/img/Menu/common/spacer.gif",
        focusImage: ROOT + "/Public/img/Menu/common/levelThree_f.png",
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: turnPrevPage,
        moveChange: "",
        cIdx: "4",
    }, {
        id: 'video-link-5',
        name: '',
        type: 'img',
        nextFocusLeft: 'video-link-4',
        nextFocusRight: 'video-link-6',
        nextFocusUp: 'video-link-1',
        nextFocusDown: '',
        backgroundImage: ROOT + "/Public/img/Menu/common/spacer.gif",
        focusImage: ROOT + "/Public/img/Menu/common/levelThree_f.png",
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "5",
    }, {
        id: 'video-link-6',
        name: '',
        type: 'img',
        nextFocusLeft: 'video-link-5',
        nextFocusRight: 'video-link-7',
        nextFocusUp: 'video-link-2',
        nextFocusDown: '',
        backgroundImage: ROOT + "/Public/img/Menu/common/spacer.gif",
        focusImage: ROOT + "/Public/img/Menu/common/levelThree_f.png",
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "6",
    }, {
        id: 'video-link-7',
        name: '',
        type: 'img',
        nextFocusLeft: 'video-link-6',
        nextFocusRight: '',
        nextFocusUp: 'video-link-3',
        nextFocusDown: '',
        backgroundImage: ROOT + "/Public/img/Menu/common/spacer.gif",
        focusImage: ROOT + "/Public/img/Menu/common/levelThree_f.png",
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: turnNextPage,
        moveChange: "",
        cIdx: "7",
    }, {
        id: '',
        name: '',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: "",
        focusImage: "",
        click: "",
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    },];

/**
 * 键入tab操作
 * @param btn
 */
function clickSelectedFocus(btn) {
    RenderParam.pageCurrent = 1;// 初始化页数
    var currentIdChildList = G("nav").children;
    for (var i = 0; i < currentIdChildList.length; i++) {
        currentIdChildList[i].src = ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav" + i + ".png";
    }
    RenderParam.currentTabIndex = btn.cIdx;
    var data = JumpPage.parseNavInfo(RenderParam.currentTabIndex);

    // 调整参数，重新拉取数据
    var postData = {
        "page": RenderParam.pageCurrent,
        "userId": RenderParam.userId,
        "modeType": data.modelType,
        "pageNum": 8
    };
    var ref = true;
    renderPage.renderVideoList(postData, ref);
    LMEPG.ButtonManager.init([btn.id], buttons, '', true);
}

/**
 * 标记当前点击的tab对象
 * @param btn
 * @param focus
 */
function judgeSelectedFocus(btn, focus) {
    if (focus) {
        // nothing
    } else {
        var currentTab = RenderParam.currentTabIndex; // 命名起始位置为0
        G("nav-" + currentTab).src = ROOT + "/Public/img/hd/Home/V27/menu/tab" + RenderParam.homeTabIndex + "/V" + RenderParam.carrierId + "/nav" + currentTab + "_s.png";
    }
}

/**
 * 视频列表获得焦点添加class，反之
 * @param btn
 * @param focus
 */
function onFocusChangeBg(btn, focus) {
    var currentFocusId = G(btn.id);
    var elementImg = currentFocusId.getElementsByTagName("img")[0];
    if (focus) {
        elementImg.className = "active";
    } else {
        elementImg.className = "";
    }
}

/**
 * 翻上一个页面
 * @param key
 * @param btn
 */
function turnPrevPage(key, btn) {
    if (key == "left") {
        if (parseInt(RenderParam.pageCurrent) - 1 > 0) {
            RenderParam.pageCurrent = parseInt(RenderParam.pageCurrent) - 1;
            // 调整参数，重新拉取数据
            var postData = {
                "page": RenderParam.pageCurrent,
                "userId": RenderParam.userId,
                "modeType": RenderParam.modelType,
                "pageNum": 8
            };
            RenderParam.focusIndex = btn.id;
            renderPage.renderVideoList(postData);
        }
    }
}

/**
 * 翻下一个页面
 * @param key
 * @param btn
 */
function turnNextPage(key, btn) {
    if (key == "right") {
        if (parseInt(RenderParam.pageCurrent) + 1 <= parseInt(RenderParam.totalPages)) {
            RenderParam.pageCurrent = parseInt(RenderParam.pageCurrent) + 1;
            // 调整参数，重新拉取数据
            var postData = {
                "page": RenderParam.pageCurrent,
                "userId": RenderParam.userId,
                "modeType": RenderParam.modelType,
                "pageNum": 8
            };
            RenderParam.focusIndex = "video-link-0";
            renderPage.renderVideoList(postData);
        }
    }
    changeDownFocus(key, btn)
}

/**
 * 如果向下移动没有对象即移动到第二排第一个
 * @param key
 * @param btn
 */
function changeDownFocus(key, btn) {
    if (key == "down") {
        var containerDom = G("container").children;
        var lastFocusItem = containerDom[containerDom.length - 1].id;
        !G(btn.nextFocusDown) && LMEPG.ButtonManager.requestFocus(lastFocusItem);
    }
}

/**
 * 返回
 */
function onBack() {
    LMEPG.Intent.back();
}
