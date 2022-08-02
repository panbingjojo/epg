/**
 * 页面跳转
 * @type {{}}
 */
var JumpPage = {
    getCurrentPage: function () {
        var current = LMEPG.ButtonManager.getCurrentButton();
        var objCurrent = LMEPG.Intent.createIntent("menuTab");
        objCurrent.setParam("pageIndex", RenderParam.index);
        objCurrent.setParam("focusIndex", current.id);
        return objCurrent;
    },
    pageLevelThreeTab: function (btn) {
        var position = btn.cIdx;   // 得到位置类型数据
        var idx = "";
        if (position == RenderParam.recommendDataList[5].position) {
            idx = btn.subIdx;
        }
        var data = JumpPage.getRecommendDataByPosition(position, idx);
        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(position, data.order);
        var objCurrent = JumpPage.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("MenuTabLevelThree");
        objHomeTab.setParam("userId", RenderParam.userId);
        objHomeTab.setParam("homeTabIndex", RenderParam.classifyId);
        objHomeTab.setParam("currentTabIndex", idx);
        objHomeTab.setParam("modelType", data.source_id);
        objHomeTab.setParam("modelTitle", data.title);
        objHomeTab.setParam("homeTabName", RenderParam.tabName[RenderParam.classifyId]);
        objHomeTab.setParam("classifyId", RenderParam.classifyId);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
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
            idx = G('current-container').getAttribute('data-link');
        }

        var data = JumpPage.getRecommendDataByPosition(position, idx);

        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(position, data.order);
        switch (data.entryType) {
            case "5":
                // 视频播放
                var videoUrl = "";
                try {
                    var videoObj = data.play_url instanceof Object ? data.play_url : JSON.parse(data.play_url);
                    videoUrl = RenderParam.platformType === "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
                } catch (e) {
                    console.warn(JSON.stringify(data), e);
                }
                if (LMEPG.Func.isEmpty(videoUrl)) {
                    console.error("无效的播放url");
                    switch (RenderParam.carrierId) {
                        case CARRIER_ID_QINGHAIYD://青海移动：若后台未配置有效视频或者被未来电视（第三方内容审核）下线后，暂统一提示为“下线”
                            LMEPG.UI.showToast("该节目已下线");//注：集成未来电视播控要求鉴权失败统一提示“该节目已下线”
                            break;
                        default:
                            LMEPG.UI.showAndroidToast("无效的视频地址！");
                            break;
                    }
                    return;
                }

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
                    "showStatus":data.show_status
                };

                //视频专辑下线处理
                if(videoInfo.showStatus == "3") {
                    LMEPG.UI.showToast('该节目已下线');
                    return;
                }
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
            case '17':
                // 跳转健康检测
                Page.jumpHealthDetectPage();
                break;
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
                data.union_code = innerParams.union_code;
                data.show_status = innerParams.show_status;
            }
        }

        return data;
    },
};

var buttons = [{
    id: 'search',
    name: '',
    type: 'img',
    nextFocusLeft: 'collection',
    nextFocusRight: 'collection',
    nextFocusUp: '',
    nextFocusDown: 'carousel-link',
    backgroundImage: g_appRootPath + "/Public/img/hd/Home/V27/search.png",
    focusImage: g_appRootPath + "/Public/img/hd/Home/V27/search_f.png",
    click: Page.jumpSearchPage,
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
    nextFocusDown: 'carousel-link',
    backgroundImage: g_appRootPath+ "/Public/img/hd/Home/V27/collection.png",
    focusImage: g_appRootPath+ "/Public/img/hd/Home/V27/collection_f.png",
    click: Page.jumpCollectPage,
    focusChange: "",
    beforeMoveChange: "",
    moveChange: "",
    cIdx: "",
}, {
    id: 'carousel-link',
    name: '',
    type: 'img',
    nextFocusLeft: '',
    nextFocusRight: '',
    nextFocusUp: 'search',
    nextFocusDown: 'bottom-left-link2',
    backgroundImage: g_appRootPath + "/Public/img/hd/Home/V27/spacer.gif",
    focusImage: g_appRootPath + "/Public/img/hd/Home/V27/carousel_f.png",
    click: JumpPage.onRecommendClick,
    focusChange: carouselFocus,
    beforeMoveChange: loopPicture,
    moveChange: "",
    cIdx: RenderParam.recommendDataList[0].position,
},
    /**
     * 下左四个----
     */
    {
        id: 'bottom-left-link1',
        name: '',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'bottom-left-link2',
        nextFocusUp: 'carousel-link',
        nextFocusDown: 'bottom-left-link3',
        click: JumpPage.pageLevelThreeTab,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[5].position,
        subIdx: 0
    }, {
        id: 'bottom-left-link2',
        name: '',
        type: 'img',
        nextFocusLeft: 'bottom-left-link1',
        nextFocusRight: 'bottom-center-link1',
        nextFocusUp: 'carousel-link',
        nextFocusDown: 'bottom-left-link4',
        click: JumpPage.pageLevelThreeTab,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[5].position,
        subIdx: 1
    }, {
        id: 'bottom-left-link3',
        name: '',
        type: 'img',
        nextFocusLeft: 'bottom-left-link2',
        nextFocusRight: 'bottom-left-link4',
        nextFocusUp: 'bottom-left-link1',
        nextFocusDown: '',
        click: JumpPage.pageLevelThreeTab,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[5].position,
        subIdx: 2
    }, {
        id: 'bottom-left-link4',
        name: '',
        type: 'img',
        nextFocusLeft: 'bottom-left-link3',
        nextFocusRight: 'bottom-center-link1',
        nextFocusUp: 'bottom-left-link2',
        nextFocusDown: '',
        click: JumpPage.pageLevelThreeTab,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[5].position,
        subIdx: 3
    },
    /**
     * 下中4个----
     */
    {
        id: 'bottom-center-link1',
        name: '推荐位5',
        type: 'img',
        nextFocusLeft: 'bottom-left-link2',
        nextFocusRight: 'bottom-center-link2',
        nextFocusUp: 'carousel-link',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[4].position,
    }, {
        id: 'bottom-center-link2',
        name: '推荐位4',
        type: 'img',
        nextFocusLeft: 'bottom-center-link1',
        nextFocusRight: 'bottom-center-link3',
        nextFocusUp: 'carousel-link',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[3].position,
    }, {
        id: 'bottom-center-link3',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'bottom-center-link2',
        nextFocusRight: 'bottom-center-link4',
        nextFocusUp: 'carousel-link',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[2].position,
    }, {
        id: 'bottom-center-link4',
        name: '推荐位2',
        type: 'img',
        nextFocusLeft: 'bottom-center-link3',
        // nextFocusRight: 'pic-txt-bg',
        nextFocusUp: 'carousel-link',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[1].position,
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
 * 轮播获得失去焦点事件
 * @param btn
 * @param hasFocus
 */
function carouselFocus(btn, hasFocus) {
    if (hasFocus) {
        clearInterval(carouselTimer);
    } else {
        clearInterval(carouselTimer);
        carouselTimer = setInterval(renderTabsPage.loop, 2222);
    }
}

/**
 * 推荐位获得失去焦点更换背景
 * @param btn
 * @param hasFocus
 */
function linkOnfocus(btn, hasFocus) {
    if (hasFocus) {
        G(btn.id).className = "focus";
    } else {
        G(btn.id).className = "";
    }
}

function loopPicture(direction, current) {
    if (direction == "left" || direction == "right") {
        renderTabsPage.loop(direction)
    }
}

/*
function onBack() {
    LMEPG.Intent.back();
}*/

function onBack() {
    //LMEPG.Intent.back();

    var objCurrent = JumpPage.getCurrentPage();
    var objHomeTab = LMEPG.Intent.createIntent("home");

    LMEPG.Intent.jump(objHomeTab, objCurrent);
}
