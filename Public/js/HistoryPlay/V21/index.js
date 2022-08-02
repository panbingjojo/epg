var HistoryPlay = {
    page: 1,
    maxPage: 1,
    buttons: [],
    beClickBtnId: 'btn-ttjs',
    dataList: [], // 当前页面的视频数据
    dataListTtjs:[],
    dataListTtyj:[],
    currentTab:1, //1、天天健身 2、天天瑜伽

    init: function () {        
        HistoryPlay.page = parseInt(RenderParam.page);

        var _this = HistoryPlay;
        _this.createBtns();

        _this.getHistoryPlayList(_this.page, function () {
            _this.render();
            _this.moveToFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'btn_ttjs');
        });
    },

    currentData: [],
    render: function () {
        // var page = this.page * 8;
        // var maxPage = this.maxPage;
        // this.currentData = this.data['nav0'].slice(page, page + 8);
        LMEPG.UI.Marquee.stop();
        var htm = '';
        G('list-wrapper').innerHTML = '';
        G('page-index').innerHTML = '';
        var isNullData = HistoryPlay.isNullData();
        if (isNullData) {
            // maxPage = 0;
        } else {
            HistoryPlay.dataList.forEach(function (t, i) {
                htm += '<li id=focus-' + i + '>' +
                    '<img onerror="HistoryPlay.src=\'' + g_appRootPath + '/Public/img/hd/Home/V21/Common/default.png\'" src=' + RenderParam.fsUrl + t.image_url + '><p id=focus-' + i + 'title>' + t.title + '</p>';
            });
            G('list-wrapper').innerHTML = htm;
        }
        G('page-index').innerHTML = HistoryPlay.maxPage == 0 ? '0/0' : HistoryPlay.page + '/' + HistoryPlay.maxPage;
        HistoryPlay.toggleArrow();
    },
    // 空数据处理
    isNullData: function () {
        if (HistoryPlay.dataList.length == 0) {
            G('list-wrapper').innerHTML = '<div class="null-data">还没有播放记录，快去开始您的健康之旅吧！';
            H('page-wrapper');
            H('prev-arrow');
            H('next-arrow');
            // HistoryPlay.moveToFocus('btn_clear');
            return true;
        }
        return false;
    },

    // 上一页
    prevPage: function (btn) {
        var _this = HistoryPlay;
        if (_this.page - 1 >= 1) {
            _this.getHistoryPlayList(_this.page - 1, function () {
                _this.page--;
                _this.render();
                if (btn.id.substr(0, 5) == 'focus') {
                    _this.moveToFocus('focus-3');
                } else {
                    _this.moveToFocus('prev-page');
                }
            });
        }
    },
    // 下一页
    nextPage: function (btn) {
        var _this = HistoryPlay;
        if (_this.page + 1 <= _this.maxPage) {
            _this.getHistoryPlayList(_this.page + 1, function () {
                _this.page++;
                _this.render();
                if (btn.id.substr(0, 5) == 'focus') {
                    _this.moveToFocus('focus-0');
                } else {
                    _this.moveToFocus('next-page');
                }
            });
        }
    },
    // 首页
    firstPage: function (btn) {
        var _this = HistoryPlay;
        if (_this.page != 1) {
            _this.getHistoryPlayList(1, function () {
                _this.page = 1;
                _this.render();
                _this.moveToFocus('first-page');
            });
        }
    },
    // 尾页
    lastPage: function (btn) {
        var _this = HistoryPlay;
        if (_this.page != _this.maxPage) {
            _this.getHistoryPlayList(_this.maxPage, function () {
                _this.page = _this.maxPage;
                _this.render();
                _this.moveToFocus('last-page');
            });
        }
    },

    // 箭头指示切换
    toggleArrow: function () {
        if (HistoryPlay.page > 1) {
            S('prev-arrow')
        } else {
            H('prev-arrow')
        }
        if (HistoryPlay.page < HistoryPlay.maxPage) {
            S('next-arrow')
        } else {
            H('next-arrow')
        }
    },
    getCurPageObj: function () {
        var objCurrent = LMEPG.Intent.createIntent('HistoryPlayIndex');
        return objCurrent;
    },

    isInArray: function(arr, value) {
        for (var i = 0; i < arr.length; i++) {
            var c = arr[i];
            if (value === c) {
                return true;
            }
        }
        return false;
    },

    onMoveChangeMoveToId: function (key, btn) {
        // 上一页
        if (key == 'left' && (btn.id == 'focus-0' || btn.id == 'focus-3')) {
            HistoryPlay.prevPage(btn);
            return false;
        }

        // 下一页
        if (key == 'right' && (btn.id == 'focus-2' || btn.id == 'focus-5')) {
            HistoryPlay.nextPage(btn);
            return false;
        }

        if (key == 'up' && HistoryPlay.isInArray(['focus-0', 'focus-1','focus-2'], btn.id)){
            HistoryPlay.moveToFocus(HistoryPlay.currentTab == 1 ? 'btn_ttjs' : 'btn_ttyj');
            return false;
        }

        if(btn.id == 'btn_ttjs' || btn.id == 'btn_ttyj'){
            if (key == 'down'){
                LMEPG.ButtonManager.setSelected(btn.id == 'btn_ttjs' ? 'btn_ttjs' : 'btn_ttyj', true);
                LMEPG.ButtonManager.setSelected(btn.id == 'btn_ttjs'? 'btn_ttyj' : 'btn_ttjs', false);
            } else{
                LMEPG.ButtonManager.setSelected('btn_ttjs', false);
                LMEPG.ButtonManager.setSelected('btn_ttyj', false);
            }
        }
        var _this = HistoryPlay;
        var btnIdFistIndex = btn.id.slice(0, 5); // 索引字符“focus”
        var btnIdLastIndex = btn.id.slice(btn.id.length - 4); // 索引字符“page”
        var lastVideoItemIndex = _this.dataList.length - 1; // 视频列表的最后一个
        var moveCondition = {
            list: key == 'down' && btnIdFistIndex == 'focus' && !G(btn.nextFocusDown),
            btnAction: key == 'up' && btnIdLastIndex == 'page'
        };
        // 功能区向上移动到最后一个视频；
        // 视频列表向下移动的视频不存在则移动到最后一个视频上；
        if (moveCondition.list || moveCondition.btnAction) {
            _this.moveToFocus('focus-' + lastVideoItemIndex);
            // 当前页视频个数小于两行向下移动到功能取
            if (moveCondition.list && lastVideoItemIndex < 3) {
                _this.moveToFocus('first-page');
            }
            return false;
        }
    },
    toggleFocus: function (btn, hasFocus) {        
        var btnElement = HistoryPlay.findChildrenById(btn.id,"p")[0];
        if (hasFocus) {
            LMEPG.UI.Marquee.start(btnElement.id, 10, 5, 50, "left", "scroll");
        } else {
            LMEPG.UI.Marquee.stop();
        }
    },
    findChildrenById: function (id, childNodeName) {
        var resultNodeList = []

        if (!childNodeName && typeof childNodeName !== 'string') return resultNodeList
        childNodeName = childNodeName.toUpperCase()

        var parentNode = document.getElementById(id)
        if (!parentNode) return resultNodeList

        var childrenNodeList = parentNode.children

        for (var i = 0; i < childrenNodeList.length; i++) {
            if (childrenNodeList[i].nodeName === childNodeName) {
                resultNodeList.push(childrenNodeList[i])
            }
        }

        return resultNodeList
    },
    createBtns: function () {
        var VIDEO_COUNT = 8;
        while (VIDEO_COUNT--) {
            HistoryPlay.buttons.push({
                id: 'focus-' + VIDEO_COUNT,
                name: '视频',
                type: 'div',
                nextFocusLeft: 'focus-' + (VIDEO_COUNT - 1),
                nextFocusRight: 'focus-' + (VIDEO_COUNT + 1),
                nextFocusUp: VIDEO_COUNT < 3 ? 'btn_ttjs' : 'focus-' + (VIDEO_COUNT - 3),
                nextFocusDown: VIDEO_COUNT > 2 ? 'first-page' : 'focus-' + (VIDEO_COUNT + 3),
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                // focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V21/video_list_f.png' : g_appRootPath + '/Public/img/hd/HistoryPlay/V21/video_list_f.png',
                focusImage: g_appRootPath + '/Public/img/hd/HistoryPlay/V21/video_list_f.png',
                click: HistoryPlay.onClickVideoItem,
                focusChange: HistoryPlay.toggleFocus,
                beforeMoveChange: HistoryPlay.onMoveChangeMoveToId
            });
        }
        HistoryPlay.buttons.push({
            id: 'btn_clear',
            name: '清空历史观看记录',
            type: 'img',
            nextFocusLeft: 'btn_ttyj',
            nextFocusDown: 'btn_ttyj',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_clear.png',
            focusImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_clear_f.png',
            click: HistoryPlay.deleteHistoryPlay,
            beforeMoveChange: HistoryPlay.onMoveChangeMoveToId
        },  {
            id: 'btn_ttjs',
            name: '播放历史天天健身导航',
            type: 'img',
            nextFocusRight: 'btn_ttyj',
            nextFocusUp: 'btn_clear',
            nextFocusDown: 'focus-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttjs.png',
            focusImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttjs_f.png',
            selectedImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttjs_offline.png',
            click: HistoryPlay.deleteHistoryPlay,
            beforeMoveChange: HistoryPlay.onMoveChangeMoveToId,
            focusChange: HistoryPlay.tabGetFocus,
        }, {
            id: 'btn_ttyj',
            name: '播放历史天天瑜伽导航',
            type: 'img',
            nextFocusLeft: 'btn_ttjs',
            nextFocusRight: 'btn_clear',
            nextFocusUp: 'btn_clear',
            nextFocusDown: 'focus-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttyj.png',
            focusImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttyj_f.png',
            selectedImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttyj_offline.png',
            click: HistoryPlay.deleteHistoryPlay,
            beforeMoveChange: HistoryPlay.onMoveChangeMoveToId,
            focusChange: HistoryPlay.tabGetFocus,
        }, {
            id: 'first-page',
            name: '首页',
            type: 'img',
            nextFocusRight: 'prev-page',
            nextFocusUp: 'focus-3',
            backgroundImage: g_appRootPath + '/Public/img/hd/HistoryPlay/V21/first_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/HistoryPlay/V21/first_page_f.png',
            click: HistoryPlay.firstPage,
            beforeMoveChange: HistoryPlay.onMoveChangeMoveToId
        }, {
            id: 'prev-page',
            name: '上一页',
            type: 'img',
            nextFocusLeft: 'first-page',
            nextFocusRight: 'next-page',
            nextFocusUp: 'focus-3',
            backgroundImage: g_appRootPath + '/Public/img/hd/HistoryPlay/V21/prev_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/HistoryPlay/V21/prev_page_f.png',
            click: HistoryPlay.prevPage,
            beforeMoveChange: HistoryPlay.onMoveChangeMoveToId
        }, {
            id: 'next-page',
            name: '下一页',
            type: 'img',
            nextFocusLeft: 'prev-page',
            nextFocusRight: 'last-page',
            nextFocusUp: 'focus-2',
            backgroundImage: g_appRootPath + '/Public/img/hd/HistoryPlay/V21/next_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/HistoryPlay/V21/next_page_f.png',
            click: HistoryPlay.nextPage,
            beforeMoveChange: HistoryPlay.onMoveChangeMoveToId
        }, {
            id: 'last-page',
            name: '尾页',
            type: 'img',
            nextFocusLeft: 'next-page',
            nextFocusUp: 'focus-2',
            backgroundImage: g_appRootPath + '/Public/img/hd/HistoryPlay/V21/last_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/HistoryPlay/V21/last_page_f.png',
            click: HistoryPlay.lastPage,
            beforeMoveChange: HistoryPlay.onMoveChangeMoveToId
        });
        console.log(HistoryPlay.buttons);
        HistoryPlay.initButtons('focus-0');
    },
    initButtons: function (id) {
        LMEPG.ButtonManager.init(id, HistoryPlay.buttons, '', true);
        LMEPG.ButtonManager.setSelected('btn_ttjs', true);
    },

    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },

    /*导航栏得失焦点回调操作*/
    tabGetFocus: function (btn, hasFocus)
    {
        if (!hasFocus){
            if(btn.direction == 'down'){
                LMEPG.ButtonManager.setSelected(btn.id == 'btn_ttjs' ? 'btn_ttjs' : 'btn_ttyj', true);
                LMEPG.ButtonManager.setSelected(btn.id == 'btn_ttjs'? 'btn_ttyj' : 'btn_ttjs', false);
            }

            return false;
        }
        if(btn.id == 'btn_ttjs'){
            HistoryPlay.currentTab = 1;
        }else if (btn.id == 'btn_ttyj'){
            HistoryPlay.currentTab = 2;
        }
//         HistoryPlay.moveToFocus(btn.id);

        HistoryPlay.getHistoryPlayList(HistoryPlay.page, function () {
            HistoryPlay.render();
            // HistoryPlay.moveToFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'focus-0');
        });
    },

    /**
     * 获取历史播放视频
     * @param page
     * @param callback
     */
    getHistoryPlayList: function (page, callback) {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            'currentPage': page,
            'pageNum': 6
        };
        // 获取播放历史
        LMEPG.ajax.postAPI('Video/getHistoryPlayList', postData, function (data) {
            data = data instanceof Object ? data : JSON.parse(data);
            console.log(data);

            if (data.result == 0) {
                // 模拟假数据
                // for (var i = 0; i < 8; i++) {
                //     var videoInfo = {
                //         carrier_id: "51",
                //         duration: "00:01:12",
                //         free_seconds: "0",
                //         ftp_url: '{"bq_ftp_url":"rtsp://202.99.114.93/88888891/16/20171222/269779681/269779681.ts","gq_ftp_url":"http://202.99.114.93/88888891/16/20171109/269711598/269711598.ts"}',
                //         image_url: "/imgs/51/video/20180306/171.png",
                //         insert_dt: "2018-03-06 17:04:24",
                //         intro_image_url: "",
                //         intro_txt: "",
                //         model_type: "3",
                //         price: "0",
                //         source_id: "4600",
                //         source_type: "0",
                //         title: "尿毒症的定义",
                //         user_type: "1",
                //         valid_duration: "0",
                //     };
                //     data.list.push(videoInfo);
                // }
                // data.count = 24;
                // console.log(data.list);
                //////////////////////////////////
                HistoryPlay.dataList = [];
                data.list.forEach(function (t, i) {
                    if (HistoryPlay.currentTab == 1 && t.model_type >= 5 && t.model_type <= 8){
                        HistoryPlay.dataList.push(t);
                    }else if(HistoryPlay.currentTab == 2 && t.model_type >= 1 && t.model_type <= 4)
                    {
                        HistoryPlay.dataList.push(t);
                    }
                });

                HistoryPlay.maxPage = Math.ceil(HistoryPlay.dataList.length / 6);
                // HistoryPlay.maxPage = 0;
                callback();
            } else {
                LMEPG.UI.showToast('数据获取失败！');
            }

            LMEPG.UI.dismissWaitingDialog();
        });
    },

    /**
     * 清空历史记录
     */
    deleteHistoryPlay: function () {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            'source_id': -1
        };
        // 存储视频信息
        LMEPG.ajax.postAPI('Video/deleteHistoryPlay', postData, function (data) {
            data = data instanceof Object ? data : JSON.parse(data);
            console.log(data);

            if (data.result == 0) {
                HistoryPlay.maxPage = 0;
                HistoryPlay.dataList = [];
                HistoryPlay.render();
                // 记录清空后隐藏箭头显示
                Hide("prev-arrow");
                Hide("next-arrow");
            } else {
                LMEPG.UI.showToast('清空失败！');
            }

            LMEPG.UI.dismissWaitingDialog();
        });
    },

    /**
     * 处理点击视频列表事件
     * @param dataIndex
     */
    onClickVideoItem: function (btn) {
        var index = parseInt(btn.id.substr(6));
        var data = HistoryPlay.dataList[index];
        var ftp_url = JSON.parse(data.ftp_url);
        // 创建视频信息
        var videoInfo = {
            'sourceId': data.source_id,
            'videoUrl': RenderParam.platformType == 'hd' ? ftp_url.gq_ftp_url : ftp_url.bq_ftp_url,
            'title': data.title,
            'type': data.model_type,
            'userType': data.user_type,
            'freeSeconds': data.free_seconds,
            'entryType': 1,
            'entryTypeName': '播放历史',
            'unionCode': data.union_code,
        };

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            PageJump.jumpPlayVideo(videoInfo);
        } else {
            PageJump.jumpBuyVip(videoInfo.title, videoInfo);
        }
    }

};

/**
 * ===============================处理跳转===============================
 */
var PageJump = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('historyPlay');
        currentPage.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        currentPage.setParam('page', HistoryPlay.page);
        return currentPage;
    },

    /**
     * 跳转购买vip页面
     */
    jumpBuyVip: function (remark, videoInfo) {
        if (typeof (videoInfo) !== "undefined" && videoInfo !== "") {
            var postData = {
                "videoInfo": JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
            });
        }

        var objCurrent = PageJump.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        jumpObj.setParam("userId", RenderParam.userId);
        jumpObj.setParam("isPlaying", "1");
        jumpObj.setParam("remark", remark);
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (!LMEPG.Func.isObject(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast('视频信息为空！');
            return;
        }

        var objHome = PageJump.getCurrentPage();

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
    }

};

var onBack = function () {
    LMEPG.Intent.back();
};