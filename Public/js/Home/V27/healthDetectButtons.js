//挽留页按钮
var HOLD_BUTTONS = ['video-1', 'video-2', 'video-3', 'continue_btn', 'close_btn'];

/**
 * 页面跳转
 * @type {{}}
 */
var JumpPage = {

    getCurrentPage: function () {
        var current = LMEPG.ButtonManager.getCurrentButton();
        var objCurrent = LMEPG.Intent.createIntent("healthDetect");
        var focusIndex = current.id;
        if (HOLD_BUTTONS.indexOf(focusIndex) >= 0) {
            focusIndex = "nav-3";
        }
        objCurrent.setParam("focusIndex", focusIndex);
        return objCurrent;
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
        var objcurrent = JumpPage.getCurrentPage();

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("remark", remark);
        objOrderHome.setParam("isPlaying", 1);
        objOrderHome.setParam("singlePayItem", typeof(singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objcurrent);
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
     * 跳转首页
     * @param btn
     * @param classifyId
     * @param modelType
     */
    jumpHome: function (btn) {
        var objCurrent = JumpPage.getCurrentPage();
        var objHomeTab = LMEPG.Intent.createIntent("home");

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },



    /**
     * 跳转健康检测页
     * @param btn
     * @param classifyId
     * @param modelType
     */
    jumpHealthDetectPage: function (btn, classifyId, modelType) {
        LMEPG.ButtonManager.setSelected(btn.id, true);
        var objCurrent = JumpPage.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("healthDetect");
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

        var objCollect = LMEPG.Intent.createIntent("collection");
        objCollect.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objCollect, objCurrent);
    },

    //跳转到输入IMEI界面
    jumpHealthMeasureIMEI: function () {
        var dstObj = LMEPG.Intent.createIntent("healthTestImeiInput");
        LMEPG.Intent.jump(dstObj, JumpPage.getCurrentPage());
    },

    //跳转到图文介绍
    jumpHealthMeasureImg: function () {
        var photoExplanationHome = LMEPG.Intent.createIntent("photoExplanation");
        LMEPG.Intent.jump(photoExplanationHome, JumpPage.getCurrentPage());
    },

    //跳转到设备商城首页
    jumpGoodsHome: function () {
        var goodsHomeHome = LMEPG.Intent.createIntent("goodsHome");
        LMEPG.Intent.jump(goodsHomeHome, JumpPage.getCurrentPage());
    }
};

var buttons = [
    {
        id: 'vip',
        name: '',
        type: 'img',
        nextFocusLeft: 'help',
        nextFocusRight: 'search',
        nextFocusUp: '',
        nextFocusDown: 'nav-4',
        backgroundImage: g_appRootPath + "/Public/img/hd/Home/V27/tab0/vip.png",
        focusImage: g_appRootPath  + "/Public/img/hd/Home/V27/tab0/vip_f.png",
        click: topBtnClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    }, {
        id: 'search',
        name: '',
        type: 'img',
        nextFocusLeft: 'vip',
        nextFocusRight: 'collection',
        nextFocusUp: '',
        nextFocusDown: 'nav-4',
        backgroundImage: g_appRootPath  + "/Public/img/hd/Home/V27/tab0/search.png",
        focusImage: g_appRootPath  + "/Public/img/hd/Home/V27/search_f.png",
        click: topBtnClick,
        focusChange: "",
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
        nextFocusDown: 'nav-4',
        backgroundImage: g_appRootPath  + "/Public/img/hd/Home/V27/tab0/collection.png",
        focusImage: g_appRootPath  + "/Public/img/hd/Home/V27/tab0/collection_f.png",
        click: topBtnClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    },
    {
        id: 'help',
        name: '',
        type: 'img',
        nextFocusLeft: 'collection',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: 'nav-4',
        backgroundImage: g_appRootPath  + "/Public/img/hd/Home/V27/tab0/help.png",
        focusImage: g_appRootPath  + "/Public/img/hd/Home/V27/tab0/help_f.png",
        click: topBtnClick,
        focusChange: "",
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
        nextFocusLeft: 'nav-6',
        nextFocusRight: 'nav-2',
        nextFocusUp: 'vip',
        nextFocusDown: 'recommended-1',
        backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).normal,
        focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_in,
        selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_out,
        click: JumpPage.jumpHome,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    },{
        id: 'nav-2',
        name: '健康检测',
        type: 'img',
        nextFocusLeft: 'nav-1',
        nextFocusRight: 'nav-3',
        nextFocusUp: 'vip',
        nextFocusDown: 'recommended-1',
        backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[7].img_url).normal,
        focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[7].img_url).focus_in,
        selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[7].img_url).normal,
        click: JumpPage.jumpHealthDetectPage,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 8,
    }, {
        id: 'nav-3',
        name: '养生堂',
        type: 'img',
        nextFocusLeft: 'nav-2',
        nextFocusRight: 'nav-4',
        nextFocusUp: 'vip',
        nextFocusDown: 'recommended-1',
        backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).normal,
        focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_in,
        selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_out,
        click: JumpPage.jumpMenuPage,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 1,
    },  {
        id: 'nav-4',
        name: '名医说',
        type: 'img',
        nextFocusLeft: 'nav-3',
        nextFocusRight: 'nav-5',
        nextFocusUp: 'vip',
        nextFocusDown: 'recommended-1',
        backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).normal,
        focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_in,
        selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_out,
        click: JumpPage.jumpMenuPage,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 2,
    }, {
        id: 'nav-5',
        name: '健康科普',
        type: 'img',
        nextFocusLeft: 'nav-4',
        nextFocusRight: 'nav-6',
        nextFocusUp: 'vip',
        nextFocusDown: 'recommended-1',
        backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).normal,
        focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_in,
        selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_out,
        click: JumpPage.jumpMenuPage,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 3,
    },
    /**
     * 推荐位
     */
    {
        id: 'recommended-1',
        name: '推荐位1',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'recommended-2',
        nextFocusUp: 'nav-2',
        nextFocusDown: '',
        backgroundImage: "",
        focusImage: "",
        click: onRecommendPositionClick,
        focusChange: onRecommendPositionFocus,
        beforeMoveChange: '',
        cPosition: "81", //推荐位编号
    }, {
        id: 'recommended-2',
        name: '推荐位2',
        type: 'img',
        nextFocusLeft: 'recommended-1',
        nextFocusRight: '',
        nextFocusUp: 'nav-2',
        nextFocusDown: 'recommended-3',
        backgroundImage: "",
        focusImage: "",
        click: onRecommendPositionClick,
        focusChange: onRecommendPositionFocus,
        beforeMoveChange: '',
        cPosition: "82", //推荐位编号
    }, {
        id: 'recommended-3',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'recommended-1',
        nextFocusRight: 'recommended-4',
        nextFocusUp: 'recommended-2',
        nextFocusDown: '',
        backgroundImage: "",
        focusImage: "",
        click: onRecommendPositionClick,
        focusChange: onRecommendPositionFocus,
        beforeMoveChange: "",
        cPosition: "83", //推荐位编号
    }, {
        id: 'recommended-4',
        name: '推荐位4',
        type: 'img',
        nextFocusLeft: 'recommended-3',
        nextFocusRight: '',
        nextFocusUp: 'recommended-2',
        nextFocusDown: '',
        backgroundImage: "",
        focusImage: "",
        click: onRecommendPositionClick,
        focusChange: onRecommendPositionFocus,
        beforeMoveChange: '',
        cPosition: "84", //推荐位编号
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


/**
 * 顶部菜单按钮点击事件
 * @param btn
 */
function topBtnClick(btn) {
    switch (btn.id) {
        case "vip":
            if ((RenderParam.isVip === '1' || RenderParam.isVip == 1)) {
                if (RenderParam.vipInfo.auto_order == "1") {
                    //是vip且没有退订的
                    LMEPG.UI.commonDialog.show("您已订购VIP，请勿重复订购！", ["退订VIP", "取消"], function (index) {
                        if (index == 0) {
                            //退订流程
                            var postData = {
                                orderId: '',
                                orderType: 1,
                            };
                            LMEPG.UI.showToast("退订中，请稍等！", 3, function () {
                                LMEPG.UI.showToast("等待超时，退订失败！");
                            });
                            LMEPG.ajax.postAPI("Pay/OrderForGansuYd", postData, function (data) {
                                LMEPG.Log.error("gansuyd---UnOrderForGansuYd: " + data);
                                var resultDataJson = JSON.parse(data);
                                if (resultDataJson.result == 0) {
                                    if (resultDataJson.result_code === "1000" || resultDataJson.result_code === 1000) {
                                        //退订成功
                                        RenderParam.vipInfo.auto_order = '0';
                                        LMEPG.UI.showToast("退订成功:" + resultDataJson.result_desp);
                                    } else {
                                        //局方服务器返回的错误
                                        LMEPG.UI.showToast("退订失败:" + resultDataJson.result_desp);
                                    }
                                } else {
                                    //我方服务返回的错误
                                    LMEPG.UI.showToast("退订失败,result:" + resultDataJson.result);
                                }
                            });
                        }

                    });
                } else {
                    //是vip,但是已经退订的
                    LMEPG.UI.commonDialog.show("您订购的VIP已经退订！", ["确定"], function (index) {

                    });
                }
            } else {
                //不是vip
                JumpPage.jumpBuyVip("首页订购", null);
            }
            break;
        case "search":
            JumpPage.jumpSearchPage(btn);
            break;
        case "collection":
            JumpPage.jumpCollectPage(btn);
            break;
        case "help":
            showHelpIntroduce();
            break;
    }
}

/**
 * 推荐位点击事件
 * @param btn
 */
function onRecommendPositionClick(btn) {

    // Page.jumpExpertHome();
    var data = getRecommendDataByPosition(btn.cPosition);
    // 统计推荐位点击事件
   LMEPG.StatManager.statRecommendEvent(btn.cPosition, data.order);
    switch (data.entry_type) {
        case "5":
            // 视频播放
            var videoObj = data.inner_parameters instanceof Object ? data.inner_parameters : JSON.parse(data.inner_parameters);
            var videoUrl = RenderParam.platformType == "hd" ? videoObj.ftp_url.gq_ftp_url : videoObj.ftp_url.bq_ftp_url;

            var parameter = JSON.parse(data.parameters);
            // 创建视频信息
            var videoInfo = {
                "sourceId": parameter[0].param,
                "videoUrl": videoUrl,
                "title": videoObj.title,
                "type": videoObj.model_type,
                "userType": videoObj.user_type,
                "freeSeconds": videoObj.free_seconds,
                "entryType": 1,
                "entryTypeName": "home",
                "focusIdx": btn.id,
                "unionCode": videoObj.union_code
            };

            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                Page.jumpPlayVideo(videoInfo);
            } else {
                Page.jumpBuyVip(videoInfo.title, videoInfo);
            }
            break;
        case "36":
            JumpPage.jumpHealthMeasureIMEI();   //跳转到输入IMEI界面
            // LMEPG.ui.showToastV1("本功能暂未开放，敬请期待");
            break;
        case "37":
            JumpPage.jumpHealthMeasureImg();  // 健康检测图文介绍
            break;
        case "6":
            JumpPage.jumpGoodsHome();  //设备商城
            break;
        case "16":
            // 创建视频信息
            var videoInfo = {
                "sourceId": "0",
                "videoUrl": RenderParam.fsUrl + data.source_id,
                "title": data.title,
                "type": data.model_type,
                "userType": data.user_type,
                "freeSeconds": data.freeSeconds,
                "entryType": 1,
                "entryTypeName": "nav-3",
                "focusIdx": btn.id,
                "unionCode": data.union_code
            };
            Page.jumpPlayVideo(videoInfo);
            break;
    }
}

/**
 * 推荐位焦点改变事件
 * @param btn
 * @param hasFocus
 */
function onRecommendPositionFocus(btn, hasFocus) {
    if (hasFocus) {
        LMEPG.CssManager.addClass(btn.id, "focus");
    } else {
        LMEPG.CssManager.removeClass(btn.id, "focus");
    }
    var navBtn = LMEPG.BM.getButtonById('nav-2');
    G('nav-2').src = navBtn.focusImage;
}

/**
 * 获取推荐位相关数据
 * @param position
 * @returns {*}
 */
function getRecommendDataByPosition(position) {
    var dataList = RenderParam.recommendDataList;
    for (var i = 0; i < dataList.length; i++) {
        var data = dataList[i];
        if (data.position == position) {
            return (data.item_data)[0];
        }
    }
    return null;
}

function nav2Focus(btn, hasFocus) {

}


function showHelpIntroduce() {
    Show("help-introduce");
    LMEPG.ButtonManager.requestFocus("debug");
    LMEPG.BM.setKeyEventInterceptCallback(keyEventInterceptCallback);
}

/**
 * 按键拦截回调函数
 */
function keyEventInterceptCallback(keyCode) {
    Hide("help-introduce");
    LMEPG.ButtonManager.requestFocus("help");
    LMEPG.BM.removeKeyEventInterceptCallback();
    return true;
};

/**
 * 当在首页按返回时，如果已经弹出新手指导信息，则关闭新手指导信息
 * 如果没有弹出新手指导，则退出应用
 */
function onBack() {
    JumpPage.jumpHome();
}

