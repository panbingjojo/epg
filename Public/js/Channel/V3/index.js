var initFocusID = RenderParam.focusIndex; //初始化时默认的第一个焦点
var showCornerVip = "1"; // 是否显示vip角标
var lastFocusBtnId = "";

/**
 * 返回按键事件回调
 */
function onBack() {
    LMEPG.Intent.back();
}

<!--页面跳转-->
if (typeof iPanel == "object") {  //广西广电需要师父返回键、退出键有页面来控制
    iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE", 1);
    iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE", 1);
}

/**
 * 页面跳转控制
 */
var Page = {
    /**
     * 得到当前页对象
     */
    getCurrentPage: function (focusId, fromId) {
        var objCurrent = LMEPG.Intent.createIntent("channel");
        objCurrent.setParam("fromId", fromId);
        objCurrent.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam("page", pageCurrent);
        objCurrent.setParam("modeType", RenderParam.modeType);
        objCurrent.setParam("modeTitle", RenderParam.modeTitle);
        return objCurrent;
    },

    /**
     * 跳转 - 挽留页
     */
    jumpHoldPage: function () {
        var objHome = Page.getCurrentPage();
        var objHold = LMEPG.Intent.createIntent("hold");
        LMEPG.Intent.jump(objHold, objHome);
    },

    /**
     * @func 进行购买操作
     * @param id 当前页的焦点位置
     * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
     * @returns {boolean}
     */
    jumpBuyVip: function (id, remark) {
        var objCurrent = Page.getCurrentPage(id, "1");

        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("isPlaying", "1");
        objOrderHome.setParam("remark", remark);

        LMEPG.Intent.jump(objOrderHome, objCurrent);
    },

    /**
     * 播放视频
     */
    jumpPlayVideo: function (videoInfo) {
        var objCurrent = Page.getCurrentPage(videoInfo.focusIdx, "2");

        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    /**
     * 页面跳转 -  专辑
     * @param videoItem
     * @param focusIDName
     */
    jumpAlbum: function (videoItem, focusIDName) {
        var objCurrent = Page.getCurrentPage(focusIDName, "3");

        var objAlbum = LMEPG.Intent.createIntent("album");
        objAlbum.setParam("albumName", videoItem.alias_name);
        objAlbum.setParam("inner", "1");

        LMEPG.Intent.jump(objAlbum, objCurrent);
    },

    /**
     * 跳转 - 视频详情页
     */
    jumpIntroVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast("视频信息为空！");
            return;
        }

        var objHome = Page.getCurrentPage();

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent("introVideo-single");
        objPlayer.setParam("inner", 1);
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
    },

    jumpHome: function () {
        LMEPG.Intent.back("IPTVPortal");
    },

    jumpMain: function () {
        var currentPage = LMEPG.Intent.createIntent("");
        var objHome = LMEPG.Intent.createIntent("home");
        LMEPG.Intent.jump(objHome, currentPage, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
    },
};


var MAX_ITEM_LEN = 8;               // 最大的元素个数
var DATA_TYPE_ALBUM = 0;            // 数据类型 - 专辑
var DATA_TYPE_VIDEO = 1;            // 数据类型 - 视频
var platformType = RenderParam.platformType;


var pageTotal = 0;                                   // 总页数
var pageCurrent = RenderParam.currentPage;                                 // 当前页码

var dataSet = (function () {
    return {
        rawData: [],
        fillDataList: [],

        /**
         * 初始化数据集
         */
        init: function (rawData) {
            if (rawData == undefined || rawData == null)
                return;
            this.rawData = rawData;
            pageTotal = Math.ceil(this.rawData.count / MAX_ITEM_LEN);         // 计算总页数
            if (pageTotal == 0) {
                pageCurrent = 0;  //重置当前页
            }
            if (pageTotal > 0 && pageCurrent == 0) {
                pageCurrent = 1;  //如果是默认页，有数据后设置为第一页
            }
            this.initData();
        },

        /**
         * 得到数据总条数
         */
        getDataCount: function () {
            if (this.rawData !== undefined && this.rawData !== null && this.rawData.count !== null) {
                return this.rawData.count;
            }
            return 0;
        },

        /**
         * 初始化数据
         */
        initData: function () {
            this.fillDataList = [];
            if (this.rawData === undefined && this.rawData === null)
                return;
            if (this.rawData.album_list !== undefined && this.rawData.album_list !== null) {
                //专辑列表不为空
                for (var i = 0; i < this.rawData.album_list.length; i++) {
                    var item = {
                        type: DATA_TYPE_ALBUM,
                        name: this.rawData.album_list[i].subject_name,
                        image: this.rawData.album_list[i].image_url,
                        dataId: this.rawData.album_list[i].subject_id,
                    }
                    this.fillDataList.push(item);
                }
            }
            if (this.rawData.list !== undefined && this.rawData.list !== null) {
                //视频列表不为空
                for (var i = 0; i < this.rawData.list.length; i++) {
                    var item = {
                        type: DATA_TYPE_VIDEO,
                        name: this.rawData.list[i].title,
                        image: this.rawData.list[i].image_url,
                        dataId: this.rawData.list[i].source_id,
                    }
                    this.fillDataList.push(item);
                }
            }
            return this.fillDataList;
        },

        /**
         * 得到填充数据列表
         */
        getFillDataList: function () {
            //type: 类型，自己定义   name: 名称   image: 背景图片， dataId: 表示数据的Id
            if (this.fillDataList != undefined && this.fillDataList != null && this.fillDataList.length > 0) {
                //如果数据已经填充，直接返回数据列表
                return this.fillDataList;
            }
            this.initData();
            return this.fillDataList;
        },

        /**
         * 得到填充数据的长度
         */
        getFillDataCount: function () {
            if (this.fillDataList != undefined && this.fillDataList != null && this.fillDataList.length > 0) {
                //如果数据已经填充，直接返回数据列表
                return this.fillDataList.length;
            }
            return 0;
        },

        /**
         * 通过填充数据项获取原始数据对象
         * @param dataItem
         */
        getDataByItem: function (dataItem) {
            if (dataItem !== undefined && dataItem !== null) {
                switch (dataItem.type) {
                    case DATA_TYPE_ALBUM:
                        if (this.rawData.album_list !== undefined && this.rawData.album_list !== null) {
                            //专辑列表不为空
                            for (var i = 0; i < this.rawData.album_list.length; i++) {
                                if (this.rawData.album_list[i].subject_id == dataItem.dataId) {
                                    return this.rawData.album_list[i];
                                }
                            }
                        }
                        break;
                    case DATA_TYPE_VIDEO:
                        if (this.rawData.list !== undefined && this.rawData.list !== null) {
                            //专辑列表不为空
                            for (var i = 0; i < this.rawData.list.length; i++) {
                                if (this.rawData.list[i].source_id == dataItem.dataId) {
                                    return this.rawData.list[i];
                                }
                            }
                        }
                        break;
                }
            }
        }
    }
})();

/**
 * 创建元素
 */
function createElements(list) {
    if (list == undefined || list == null)
        return;
    //清空数据
    var content = G("content");
    content.innerHTML = "";

    for (var dataIndex = 0; dataIndex < list.length; dataIndex++) {
        //生成id
        if (dataIndex > 3) {
            var tempIndex = dataIndex - 3;
            var uiParentID = "focus-2-" + tempIndex;
            var uiImgBorderID = "focus-2-" + tempIndex + "-border";
            var uiTitleID = "focus-2-" + tempIndex + "-title";
            var uiImgSrcID = "focus-2-" + tempIndex + "-src";
        } else {
            var tempIndex = dataIndex + 1;
            var uiParentID = "focus-1-" + tempIndex;
            var uiImgBorderID = "focus-1-" + tempIndex + "-border";
            var uiTitleID = "focus-1-" + tempIndex + "-title";
            var uiImgSrcID = "focus-1-" + tempIndex + "-src";
        }
        //创建元素
        var uiParent = document.createElement("div");
        var uiImgBorder = document.createElement("img");
        var uiImgSrc = document.createElement("img");
        var uiTitle = document.createElement("div");

        var videoItem = dataSet.getDataByItem(list[dataIndex]);
        var userType = false;
        if (videoItem.user_type == "2" && showCornerVip == "1") {
            //显示vip
            userType = true;
        }
        if (videoItem.user_type == "3" && RenderParam.showCornerFree == "1") {
            //显示付费
            userType = true;
        }
        switch (uiParentID) {
            case "focus-1-1":
                if (platformType == "hd") {
                    LMEPG.UI.setCornerMore(uiParent, 80, 150, 40, 40, userType, videoItem.user_type);
                } else {
                    LMEPG.UI.setCornerMore(uiParent, 13, 133, 25, 25, userType, videoItem.user_type);
                }
                break;
            case "focus-1-2":
                if (platformType == "hd") {
                    LMEPG.UI.setCornerMore(uiParent, 200, 150, 40, 40, userType, videoItem.user_type);
                } else {
                    LMEPG.UI.setCornerMore(uiParent, 14, 133, 25, 25, userType, videoItem.user_type);
                }
                break;
            case "focus-1-3":
                if (platformType == "hd") {
                    LMEPG.UI.setCornerMore(uiParent, 320, 150, 40, 40, userType, videoItem.user_type);
                } else {
                    LMEPG.UI.setCornerMore(uiParent, 13, 132, 25, 25, userType, videoItem.user_type);
                }
                break;
            case "focus-1-4":
                if (platformType == "hd") {
                    LMEPG.UI.setCornerMore(uiParent, 440, 150, 40, 40, userType, videoItem.user_type);
                } else {
                    LMEPG.UI.setCornerMore(uiParent, 13, 132, 25, 25, userType, videoItem.user_type);
                }
                break;
            case "focus-2-1":
                if (platformType == "hd") {
                    LMEPG.UI.setCornerMore(uiParent, 80, 245, 40, 40, userType, videoItem.user_type);
                } else {
                    LMEPG.UI.setCornerMore(uiParent, 14, 133, 25, 25, userType, videoItem.user_type);
                }

                break;
            case "focus-2-2":
                if (platformType == "hd") {
                    LMEPG.UI.setCornerMore(uiParent, 220, 245, 40, 40, userType, videoItem.user_type);
                } else {
                    LMEPG.UI.setCornerMore(uiParent, 14, 143, 25, 25, userType, videoItem.user_type);
                }
                break;
            case "focus-2-3":
                if (platformType == "hd") {
                    LMEPG.UI.setCornerMore(uiParent, 360, 245, 40, 40, userType, videoItem.user_type);
                } else {
                    LMEPG.UI.setCornerMore(uiParent, 13, 132, 25, 25, userType, videoItem.user_type);
                }
                break;
            case "focus-2-4":
                if (platformType == "hd") {
                    LMEPG.UI.setCornerMore(uiParent, 500, 245, 40, 40, userType, videoItem.user_type);
                } else {
                    LMEPG.UI.setCornerMore(uiParent, 13, 132, 25, 25, userType, videoItem.user_type);
                }
                break;
        }

        uiParent.setAttribute("id", uiParentID);
        uiParent.setAttribute("index", dataIndex);   // 索引id。 用于和fillDataList 数组的下标关联
        uiImgBorder.setAttribute("id", uiImgBorderID);
        uiImgBorder.setAttribute("src", g_appRootPath + " /Public/img/Common/spacer.gif");
        uiImgSrc.setAttribute("id", uiImgSrcID);
        uiImgSrc.setAttribute("src", RenderParam.fsUrl + list[dataIndex].image);

        uiTitle.setAttribute("id", uiTitleID);
        uiTitle.innerHTML = list[dataIndex].name;

        uiParent.appendChild(uiImgBorder);
        uiParent.appendChild(uiImgSrc);
        uiParent.appendChild(uiTitle);

        content.appendChild(uiParent);
    }
}

/**
 * 更新界面视频
 */
function updateUI() {
    LMEPG.UI.Marquee.stop();

    // 更新页数显示
    var pageNumDom = G("page");
    if (pageCurrent <= 0 || pageTotal <= 0) {
        H(pageNumDom);
    } else {
        S(pageNumDom);
        pageNumDom.innerHTML = pageCurrent + "/" + pageTotal;
    }

    // 更新箭头显示
    if (pageTotal > 1) {
        if (pageCurrent > 1) {
            S("leftArrow");
        } else {
            H("leftArrow");
        }
        if (pageCurrent < pageTotal) {
            S("rightArrow");
        } else {
            H("rightArrow");
        }
    } else {
        H("leftArrow");
        H("rightArrow");
    }

    // 创建元素
    createElements(dataSet.getFillDataList());

    if (G(initFocusID) === undefined || G(initFocusID) == null || G(initFocusID) === "") {
        initFocusID = "focus-3-1";
    }
    LMEPG.BM.init(initFocusID, buttons, '', true);  //设置默认元素焦点
    initFocusID = "focus-1-1-border";
    var tempBtn = LMEPG.BM.getCurrentButton();
    LMEPG.UI.Marquee.stop();
    LMEPG.UI.Marquee.start(tempBtn.title, 4, 2, 50, "left", "scroll");

}

/**
 * 监听上页按键
 */
function onPageUp() {
    if (pageCurrent > 1) {
        initFocusID = "focus-1-4-border";
        pageCurrent--;
        getData();
    }
}

/**
 * 监听下页按键
 */
function onPageDown() {
    if (pageCurrent < pageTotal) {
        initFocusID = "focus-1-1-border";
        pageCurrent++;
        getData();
    }
}

/**
 * 加载界面数据
 */
function getData() {
    var postData = {"page": pageCurrent, "userId": RenderParam.userId, "modeType": RenderParam.modeType, "pageNum": 8};
    LMEPG.ajax.postAPI("Channel/moreAjaxList", postData, function (data) {
        if (data.result == 0) {
            dataSet.init(data);
            updateUI();
        } else {
            LMEPG.UI.showToast("视频加载失败[code=" + data.result + "]");
        }
    });
}


var buttons = [
    {
        id: "focus-1-1-border",
        name: "视频1",
        type: 'img',
        indexId: 'focus-1-1',
        title: 'focus-1-1-title',
        nextFocusLeft: '',
        nextFocusRight: 'focus-1-2-border',
        nextFocusUp: '',
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/imgbox.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-1-2-border",
        name: "视频2",
        type: 'img',
        indexId: 'focus-1-2',
        title: 'focus-1-2-title',
        nextFocusLeft: 'focus-1-1-border',
        nextFocusRight: 'focus-1-3-border',
        nextFocusUp: '',
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/imgbox.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-1-3-border",
        name: "视频3",
        type: 'img',
        indexId: 'focus-1-3',
        title: 'focus-1-3-title',
        nextFocusLeft: 'focus-1-2-border',
        nextFocusRight: 'focus-1-4-border',
        nextFocusUp: '',
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/imgbox.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-1-4-border",
        name: "视频4",
        type: 'img',
        indexId: 'focus-1-4',
        title: 'focus-1-4-title',
        nextFocusLeft: 'focus-1-3-border',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/imgbox.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-2-1-border",
        name: "视频1",
        type: 'img',
        indexId: 'focus-2-1',
        title: 'focus-2-1-title',
        nextFocusLeft: '',
        nextFocusRight: 'focus-2-2-border',
        nextFocusUp: 'focus-1-1-border',
        nextFocusDown: 'focus-3-1',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/imgbox.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-2-2-border",
        name: "视频2",
        type: 'img',
        indexId: 'focus-2-2',
        title: 'focus-2-2-title',
        nextFocusLeft: 'focus-2-1-border',
        nextFocusRight: 'focus-2-3-border',
        nextFocusUp: 'focus-1-2-border',
        nextFocusDown: 'focus-3-1',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/imgbox.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-2-3-border",
        name: "视频3",
        type: 'img',
        indexId: 'focus-2-3',
        title: 'focus-2-3-title',
        nextFocusLeft: 'focus-2-2-border',
        nextFocusRight: 'focus-2-4-border',
        nextFocusUp: 'focus-1-3-border',
        nextFocusDown: 'focus-3-1',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/imgbox.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-2-4-border",
        name: "视频4",
        type: 'img',
        indexId: 'focus-2-4',
        title: 'focus-2-4-title',
        nextFocusLeft: 'focus-2-3-border',
        nextFocusRight: '',
        nextFocusUp: 'focus-1-4-border',
        nextFocusDown: 'focus-3-1',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/imgbox.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-3-1",
        name: "视频4",
        type: 'img',
        indexId: 'focus-2-4',
        title: 'focus-2-4-title',
        nextFocusLeft: '',
        nextFocusRight: 'focus-3-2',
        nextFocusUp: 'focus-2-1-border',
        nextFocusDown: 'focus-3-1',
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/bg_home_btn.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/f_home_btn.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-3-2",
        name: "视频4",
        type: 'img',
        title: 'focus-2-4-title',
        nextFocusLeft: 'focus-3-1',
        nextFocusRight: 'focus-3-3',
        nextFocusUp: 'focus-2-1-border',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/bg_main_btn.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/f_main_btn.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-3-3",
        name: "视频4",
        type: 'img',
        title: '',
        nextFocusLeft: 'focus-3-2',
        nextFocusRight: '',
        nextFocusUp: 'focus-2-1-border',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/bg_back_btn.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/f_back_btn.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    }


];

/**
 * 焦点移动前事件回调
 */
function onBeforeMoveChange(dir, currBtn) {
    var itemIdArr = currBtn.id.split("-");
    var tempIdPrefix = itemIdArr[0];
    var tempRow = parseInt(itemIdArr[1]);
    var tempCol = parseInt(itemIdArr[2]);
    var tempSuffix = itemIdArr[3];
    switch (tempRow) {
        case 1:
            if (dir === "down") {
                var fillLength = dataSet.getFillDataCount();
                if (fillLength > 4) {
                    var seLength = fillLength - 4;
                    if (seLength < tempCol) {
                        tempCol = seLength;
                    }
                    tempRow++;
                    var nextId = tempIdPrefix + "-" + tempRow + "-" + tempCol + "-" + tempSuffix;
                    LMEPG.BM.requestFocus(nextId);
                } else {
                    lastFocusBtnId = currBtn.id;
                    LMEPG.BM.requestFocus("focus-3-1");
                }
                return false;
            } else if (dir === "right") {
                if (tempCol === 4) {
                    onPageDown();
                }
            } else if (dir === "left") {
                if (tempCol === 1) {
                    onPageUp();
                }
            }
            break;
        case 2:
            if (dir === "down") {
                lastFocusBtnId = currBtn.id;
                LMEPG.BM.requestFocus("focus-3-1");
                return false;
            } else if (dir === "right") {
                if (tempCol === 4) {
                    onPageDown();
                }
            } else if (dir === "left") {
                if (tempCol === 1) {
                    onPageUp();
                }
            }
            break;
        case 3:
            if (dir === "up") {
                LMEPG.BM.requestFocus(lastFocusBtnId);
                return false;
            }
            break;
    }

}

function onKeyEnter(btn) {
    var itemId = btn.id;
    var itemIdArr = itemId.split("-");
    var tempIdPrefix = itemIdArr[0];
    var tempRow = parseInt(itemIdArr[1]);
    var tempCol = parseInt(itemIdArr[2]);
    switch (tempRow) {
        case 3:
            if (tempCol === 1) {
                Page.jumpHome();
            } else if (tempCol === 2) {
                Page.jumpMain();
            } else {
                LMEPG.Intent.back();
            }
            break;
        default:
            clickVideo(btn.indexId)
            break;
    }
}

function clickVideo(indexId) {
    var focusIDName = indexId;
    var focusElement = G(focusIDName);
    var index = focusElement.getAttribute("index");
    var list = dataSet.getFillDataList();
    if (list != undefined && list != null) {
        if (index >= 0 && index < list.length) {
            var item = list[index];
            switch (item.type) {
                case DATA_TYPE_ALBUM:
                    var videoItem = dataSet.getDataByItem(item);
                    if (videoItem != undefined && videoItem != null) {
                        Page.jumpAlbum(videoItem, focusIDName);
                    }
                    break;
                case DATA_TYPE_VIDEO:
                    var videoItem = dataSet.getDataByItem(item);
                    try {
                        var videoUrlObj = (videoItem.ftp_url instanceof Object ? videoItem.ftp_url : JSON.parse(videoItem.ftp_url));
                        var videoUrl = (RenderParam.platformType == "hd" ? videoUrlObj.gq_ftp_url : videoUrlObj.bq_ftp_url);
                        var videoInfo = {
                            "sourceId": videoItem.source_id,
                            "videoUrl": videoUrl,
                            "title": videoItem.title,
                            "type": videoItem.model_type,
                            "freeSeconds": videoItem.free_seconds,
                            "userType": videoItem.user_type,
                            "unionCode": videoItem.union_code,
                            "entryType": 3,
                            "entryTypeName": RenderParam.modeTitle,
                            "focusIdx": focusIDName,
                            "introImageUrl": videoItem.intro_image_url,
                            "introTxt": videoItem.intro_txt,
                            "price": videoItem.price,
                            "validDuration": videoItem.valid_duration,
                            'show_status': videoItem.show_status
                        };

                        //视频专辑下线处理
                        if(videoInfo.show_status == "3") {
                            LMEPG.UI.showToast('该节目已下线');
                            return;
                        }


                        if (RenderParam.carrierId == "450094") {
                            Page.jumpIntroVideo(videoInfo);
                        } else {
                            // 先判断userType：2需要会员才能观看，其他可以直接观看
                            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                                Page.jumpPlayVideo(videoInfo);
                            } else {
                                var postData = {"videoInfo": JSON.stringify(videoInfo)};
                                LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
                                    if (data.result == 0) {
                                        Page.jumpBuyVip(videoInfo.focusIdx, videoInfo.title);
                                    } else {
                                        LMEPG.UI.showToast("系统报错");
                                    }
                                });
                            }
                        }
                    } catch (e) {
                    }
                    break;
            }
        }
    }
}

function onFocusChange(btn, hasFocus) {
    var itemIdArr = btn.id.split("-");
    var tempRow = parseInt(itemIdArr[1]);
    if (tempRow === 1 || tempRow === 2) {
        if (hasFocus) {
            LMEPG.UI.Marquee.stop();
            LMEPG.UI.Marquee.start(btn.title, 7, 4, 50, "left", "scroll");
        } else {
            LMEPG.UI.Marquee.stop();
        }
    }
}

