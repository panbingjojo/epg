var initFocusID = "focus-1-1-border"; //初始化时默认的第一个焦点
var timerID;

/**
 * 返回按键事件回调
 */
function onBack() {
    LMEPG.Intent.back();
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
        objCurrent.setParam("focusIndex", focusId);
        objCurrent.setParam("page", pageCurrent);
        objCurrent.setParam("modeType", RenderParam.modeType);
        objCurrent.setParam("modeTitle", RenderParam.modeTitle);
        return objCurrent;
    },

    /**
     * 进行购买操作
     * @param id 当前页的焦点位置
     * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
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
};

/**
 * 监听上页按键
 */
function onPageUp() {
    if (pageCurrent > 1) {
        pageCurrent--;
        getData();
    }
}

/**
 * 监听下页按键
 */
function onPageDown() {
    if (pageCurrent < pageTotal) {
        pageCurrent++;
        getData();
    }
}

function onKeyEnter(btn) {
    var focusIDName = btn.indexId;
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
                            "videoUrl": RenderParam.carrierId === "520092" ? encodeURIComponent(videoUrl) : videoUrl,//贵州电信需对特殊字符编码
                            "title": videoItem.title,
                            "type": videoItem.model_type,
                            "freeSeconds": videoItem.free_seconds,
                            "userType": videoItem.user_type,
                            "unionCode": videoItem.union_code,
                            "entryType": 3,
                            "entryTypeName": RenderParam.modeTitle,
                            "focusIdx": focusIDName,
                            "durationTime": videoItem.duration,
                            'show_status': videoItem.show_status,
                        };

                        //视频专辑下线处理
                        if(videoInfo.show_status == "3") {
                            LMEPG.UI.showToast('该节目已下线');
                            return;
                        }
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
                    } catch (e) {
                    }
                    break;
            }
        }
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

// 获得焦点事件
function onFocusChange(btn, hasFocus) {
    if (hasFocus) {
        LMEPG.UI.Marquee.stop();
        LMEPG.UI.Marquee.start(btn.title, 4, 2, 50, "left", "scroll");
    } else {
        LMEPG.UI.Marquee.stop();
    }
}

// 注册翻页按钮
LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_PAGE_UP: 'onPageUp()', //上一页事件
        KEY_PAGE_DOWN: 'onPageDown()', //下一页事件
    }
);

/**
 * 焦点移动前事件回调
 */
function onBeforeMoveChange(dir, current) {
    //翻页
    switch (current.id) {
        case 'focus-2-1-border':
        case 'focus-2-2-border':
        case 'focus-2-3-border':
        case 'focus-2-4-border':
            if (dir == "down") {
                onPageDown();
            }
            break;
        case 'focus-1-1-border':
        case 'focus-1-2-border':
        case 'focus-1-3-border':
        case 'focus-1-4-border':
            if (dir == "down") {
                //如果焦点位置在第二个详情位置按下键，判断第二行没有数据，跳到第二行上一个焦点
                var x = parseInt(current.id.substring(8, 9));
                for (; x > 0; x--) {
                    var nextFocusIdName = "focus-" + 2 + "-" + x + "-border";
                    var element = G(nextFocusIdName);
                    if (element != null && typeof (element) != "undefined") {
                        break;
                    }
                }
                if (typeof (element) == "undefined" || element == null) {
                    return false;
                } else {
                    LMEPG.BM.requestFocus(nextFocusIdName);
                }
            } else if (dir == "up") {
                onPageUp();
            }
            break;
    }
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
        nextFocusDown: '',
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
        nextFocusDown: '',
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
        nextFocusDown: '',
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
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/imgbox.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    }
];

var MAX_ITEM_LEN = 8;               // 最大的元素个数
var DATA_TYPE_ALBUM = 0;            // 数据类型 - 专辑
var DATA_TYPE_VIDEO = 1;            // 数据类型 - 视频
var pageTotal = 0;                  // 总页数
var pageCurrent = 0;                // 当前页码

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
                        user_type: this.rawData.album_list[i].user_type,
                    };
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
                        user_type: this.rawData.list[i].user_type,
                    };
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
    if (!LMEPG.Func.isArray(list)) {
        return;
    }
    for(var i = 1; i<9;i++){
        H('vip_corner_' + i);
    }

    var borderGetUrl = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/imgbox.png";
    var borderLostUrl = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Channel/V1/transparent.png";  //失去焦点背景边框
    var content = G("content");
    content.innerHTML = ""; //清空数据
    for (var i = 0; i < list.length; i++) {
        //生成id
        if (i > 3) {
            var tempIndex = i - 3;
            var uiParentID = "focus-2-" + tempIndex;
            var uiImgBorderID = "focus-2-" + tempIndex + "-border";
            var uiTitleID = "focus-2-" + tempIndex + "-title";
            var uiImgSrcID = "focus-2-" + tempIndex + "-src";
        } else {
            var tempIndex = i + 1;
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

        uiParent.setAttribute("id", uiParentID);
        uiParent.setAttribute("index", i);   // 索引id。 用于和fillDataList 数组的下标关联
        uiImgBorder.setAttribute("id", uiImgBorderID);
        uiImgBorder.setAttribute("src", borderLostUrl);
        uiImgSrc.setAttribute("id", uiImgSrcID);
        uiImgSrc.setAttribute("src", RenderParam.fsUrl + list[i].image);

        uiTitle.setAttribute("id", uiTitleID);
        uiTitle.innerHTML = list[i].name;

        uiParent.appendChild(uiImgBorder);
        uiParent.appendChild(uiImgSrc);
        uiParent.appendChild(uiTitle);

        var videoItem = dataSet.getDataByItem(list[i]);
        if (RenderParam.showCornerFree == "1" && videoItem.user_type == "0" && !LMEPG.Func.isAllowAccess(isVip, ACCESS_NO_TYPE)) {
            var uiImgCorner = document.createElement("img");
            uiImgCorner.setAttribute("class", "corner_free");
            uiImgCorner.setAttribute("src", g_appRootPath + "/Public/img/Common/corner_free.png");
            uiParent.appendChild(uiImgCorner);
        }

        content.appendChild(uiParent);
        if(RenderParam.isShowVipCorner && RenderParam.carrierId == '460092' && RenderParam.isVip != '1') {
            if (list[i].user_type == '2') {
                S('vip_corner_' + (i + 1));
            } else {
                H('vip_corner_' + (i + 1));
            }
        }
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
    var element = G(initFocusID);
    if (element == null || typeof (element) == "undefined") {
        initFocusID = "focus-1-1-border";
    }
    //设置默认元素焦点
    LMEPG.BM.init(initFocusID, buttons, '', true);
}

/**
 * 更多视频 - 唯一入口类
 */
var ChannelManager = {

    init: function () {
        G('default_link').focus();

        // 判断如果是购买、播放回来，就跳到原来的焦点位置
        if (!LMEPG.Func.isEmpty(RenderParam.fromId) && RenderParam.fromId != "0") {
            var focusIdx = RenderParam.focusIndex;
            pageCurrent = RenderParam.page;
            initFocusID = focusIdx + "-border";
        } else {
            // 初始化时添加默认的焦点
        }

        for(var i=1;i<9;i++){
            H('vip_corner_' + i);
        }

        getData();
    }
};
