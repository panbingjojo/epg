/**
 * 页面跳转
 * @type {{}}
 */
var JumpPage = {
    onClickRecommendPosition: function (btn) {
        var position = btn.cIdx;   // 得到位置类型数据
        var idx = "";
        if (position == RenderParam.recommendDataList[5].position) {
            idx = btn.subIdx;
        }
        var data = JumpPage.getRecommendDataByPosition(position, idx);

        var objCurrent = JumpPage.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("MenuTabLevelThree");
        objHomeTab.setParam("userId", RenderParam.userId);
        objHomeTab.setParam("homeTabIndex", RenderParam.classifyId);
        objHomeTab.setParam("currentTabIndex", idx);
        objHomeTab.setParam("modelType", data.source_id);
        objHomeTab.setParam("modelTitle", data.title);
        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },
};

var buttons = [{
    id: 'carousel-link',
    name: '',
    type: 'img',
    nextFocusLeft: '',
    nextFocusRight: '',
    nextFocusUp: 'search',
    nextFocusDown: 'bottom-left-link2',
    backgroundImage:  g_appRootPath+ "/Public/img/hd/Menu/Common/spacer.gif",
    focusImage:  g_appRootPath+ "/Public/img/hd/Home/V15/Home/carousel_f.png",
    click: Page.onClickRecommendPosition,
    focusChange: carouselFocus,
    beforeMoveChange: loopPicture,
    moveChange: "",
    cIdx: RenderParam.homeConfigInfo.data.entry_list[9].item_data,
    cType: "carousel"
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
        click: Page.onClickRecommendPosition,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx:RenderParam.homeConfigInfo.data.entry_list[14].item_data[0],
        subIdx: 0
    }, {
        id: 'bottom-left-link2',
        name: '',
        type: 'img',
        nextFocusLeft: 'bottom-left-link1',
        nextFocusRight: 'bottom-center-link1',
        nextFocusUp: 'carousel-link',
        nextFocusDown: 'bottom-left-link4',
        click: Page.onClickRecommendPosition,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx:RenderParam.homeConfigInfo.data.entry_list[14].item_data[1],
        subIdx: 1
    }, {
        id: 'bottom-left-link3',
        name: '',
        type: 'img',
        nextFocusLeft: 'bottom-left-link2',
        nextFocusRight: 'bottom-left-link4',
        nextFocusUp: 'bottom-left-link1',
        nextFocusDown: '',
        click: Page.onClickRecommendPosition,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx:RenderParam.homeConfigInfo.data.entry_list[14].item_data[2],
        subIdx: 2
    }, {
        id: 'bottom-left-link4',
        name: '',
        type: 'img',
        nextFocusLeft: 'bottom-left-link3',
        nextFocusRight: 'bottom-center-link1',
        nextFocusUp: 'bottom-left-link2',
        nextFocusDown: '',
        click: Page.onClickRecommendPosition,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx:RenderParam.homeConfigInfo.data.entry_list[14].item_data[3],
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
        click: Page.onClickRecommendPosition,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.homeConfigInfo.data.entry_list[10].item_data[0],
    }, {
        id: 'bottom-center-link2',
        name: '推荐位4',
        type: 'img',
        nextFocusLeft: 'bottom-center-link1',
        nextFocusRight: 'bottom-center-link3',
        nextFocusUp: 'carousel-link',
        nextFocusDown: '',
        click: Page.onClickRecommendPosition,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.homeConfigInfo.data.entry_list[11].item_data[0],
    }, {
        id: 'bottom-center-link3',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'bottom-center-link2',
        nextFocusRight: 'bottom-center-link4',
        nextFocusUp: 'carousel-link',
        nextFocusDown: '',
        click: Page.onClickRecommendPosition,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.homeConfigInfo.data.entry_list[12].item_data[0],
    }, {
        id: 'bottom-center-link4',
        name: '推荐位2',
        type: 'img',
        nextFocusLeft: 'bottom-center-link3',
        // nextFocusRight: 'pic-txt-bg',
        nextFocusUp: 'carousel-link',
        nextFocusDown: '',
        click: Page.onClickRecommendPosition,
        focusChange: linkOnfocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.homeConfigInfo.data.entry_list[13].item_data[0],
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
        G("current-container").className = "current-container-hover";
        G("point").className = "point-img-hover";
    } else {
        clearInterval(carouselTimer);
        carouselTimer = setInterval(renderTabsPage.loop, 2222);
        G("point").className = "point-img";
        G("current-container").className = "current-container";
    }
}

/**
 * 推荐位获得失去焦点更换背景
 * @param btn
 * @param hasFocus
 */
function linkOnfocus(btn, hasFocus) {
    if (hasFocus) {
        // G("current-container").className="current-container-hover";
        G(btn.id).className = "focus";
    } else {
        // G("current-container").className="current-container";
        G(btn.id).className = "";
    }
}

function loopPicture(direction, current) {
    if (direction == "left" || direction == "right") {
        renderTabsPage.loop(direction)
    }
}
function onBack() {
    LMEPG.Intent.back();
}

var Pages = {
    getCurrentPage: function () {
        var current = LMEPG.ButtonManager.getCurrentButton();
        var objCurrent = LMEPG.Intent.createIntent("menuTab");
        objCurrent.setParam("pageIndex", RenderParam.index);
        objCurrent.setParam("focusIndex", current.id);
        return objCurrent;
    },
}