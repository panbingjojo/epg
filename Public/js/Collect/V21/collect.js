var UN_COLLECT_CODE = 1;     //取消收藏操作
var COLLECT_CODE = 0;        //收藏操作

var Collect = {
    page: 1,
    maxPage: 1,
    buttons: [],
    beClickBtnId: 'btn-ttjs',
    currentData: [],
    dataList: [], // 当前页面的视频数据
    dataListTtjs: [],
    dataListTtyj: [],
    currentTab: 1, //1、天天健身 2、天天瑜伽
    collectStatus: [1, 1, 1],//收藏状态 //1、收藏 0、取消收藏
    NUM_PER_PAGE: 3,

    init: function () {
        Collect.page = parseInt(RenderParam.page);

        var _this = Collect;

        _this.createBtns();

        _this.getCollectList(_this.page, function () {
            _this.render();
            Collect.currentTab = parseInt(RenderParam.currentTab);
            if (Collect.currentTab === 2) {
                G('btn_ttyj').src = g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttyj_offline.png';
                G('btn_ttjs').src = g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttjs.png';
            }
            _this.moveToFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'btn_ttjs');
        });
    },

    updateCollectStatus: function (btn, status) {
        Collect.collectStatus[btn.cIndex] = !status;
        G(btn.id).src = g_appRootPath + '/Public/img/hd/Home/V21/Collect/' + (!status ? 'btn_unCollect_f.png' : 'btn_collect_f.png');
        for (var i = 0; i < Collect.buttons.length; i++) {
            if (Collect.buttons[i].id == btn.id) {
                Collect.buttons[i].backgroundImage = g_appRootPath + '/Public/img/hd/Home/V21/Collect/' + (!status ? 'btn_unCollect.png' : 'btn_collect.png');
                Collect.buttons[i].focusImage = g_appRootPath + '/Public/img/hd/Home/V21/Collect/' + (!status ? 'btn_unCollect_f.png' : 'btn_collect_f.png');
                break;
            }
        }
    },

    // /**
    //  * 收藏内容点击
    //  * @param btn
    //  */
    // onClickCollect: function (btn) {
    //     Collect.doCollectItem(btn);
    // },

    /**
     * 收藏/取消收藏操作
     * @param status   收藏状态：0、 收藏 1、取消收藏
     */
    doCollectItem: function (btn) {
        //如果当前状态是收藏，就去取消收藏，反之亦然
        // var type = Collect.collectStatus[btn.cIndex] == 1? 0:1;
        var type = Collect.collectStatus[btn.cIndex]
        data = Collect.dataList[btn.cIndex];
        var postData = {
            "type": type,
            "item_type": 1,
            "item_id": data.source_id,
        };
        LMEPG.ajax.postAPI("Collect/setCollectStatusNew", postData, function (rsp) {
            try {
                var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (collectItem.result == 0) {
                    if (type == COLLECT_CODE) {
                        //收藏成功
                        LMEPG.UI.showToast("收藏成功");
                    } else {
                        //取消收藏成功
                        LMEPG.UI.showToast("取消收藏成功");
                    }
                    Collect.updateCollectStatus(btn, type);
                } else {
                    LMEPG.UI.showToast("操作失败");
                }
            } catch (e) {
                LMEPG.UI.showToast("操作异常");
            }
        });
    },

    render: function () {
        var start = (this.page - 1) * this.NUM_PER_PAGE;
        var maxPage = this.maxPage;
        this.currentData = this.dataList.slice(start, start + this.NUM_PER_PAGE);
        LMEPG.UI.Marquee.stop();
        var htm = '';
        var btn_collect_img = '';
        G('list-wrapper').innerHTML = '';
        G('page-index').innerHTML = '';
        var isNullData = this.isNullData();
        if (isNullData) {
            maxPage = 0;
            G('collect_wrap').innerHTML = '';
        } else {
            this.currentData.forEach(function (t, i) {
                htm += '<li id=focus-' + i + '>' +
                    '<img onerror="this.src=\'' + g_appRootPath + '/Public/img/hd/Home/V21/Common/default.png\'" src=' + RenderParam.fsUrl + t.image_url + '><p id=focus-' + i + 'title>' + t.title + '</p>';
                btn_collect_img += '<img id="btn_collect_' + i + '" src="' + g_appRootPath + '/Public/img/hd/Home/V21/Collect/btn_unCollect.png">';
                Collect.collectStatus[i] = 1;
            });
            G('list-wrapper').innerHTML = htm;
            G('collect_wrap').innerHTML = btn_collect_img;
        }
        G('page-index').innerHTML = this.maxPage == 0 ? '0/0' : this.page + '/' + this.maxPage;
        // 在此收藏页面，如果用户看视频时把视频取消收藏，焦点恢复时焦点会丢失，需重新判断页数、焦点
        if (!LMEPG.Func.isEmpty(RenderParam.focusId) && LMEPG.BM.getButtonById(RenderParam.focusId) == null) {
            var focusId = RenderParam.focusId;
            var btn = {
                id: focusId
            }
            var posNum = parseInt(focusId.substr(6));
            if (posNum > 0) {
                Collect.moveToFocus('focus-' + (posNum - 1));
            } else {
                if (Collect.page > 0) {
                    Collect.prevPage(btn);
                    Collect.moveToFocus('focus-2');
                } else {
                    Collect.moveToFocus('nav-' + Collect.navIndex);
                }
            }
        }
        this.toggleArrow();
    },
    // 空数据处理
    isNullData: function () {
        if (this.dataList.length == 0) {
            G('list-wrapper').innerHTML = '<div class="null-data">还没有收藏记录，快去收藏吧！';
            H('page-wrapper');
            H('prev-arrow');
            H('next-arrow');
            // Collect.moveToFocus('btn_clear');
            return true;
        }
        return false;
    },

    // 上一页
    prevPage: function (btn) {
        var _this = Collect;
        if (_this.page - 1 >= 1) {
            _this.getCollectList(_this.page - 1, function () {
                _this.page--;
                _this.render();
                if (btn.id.substr(0, 5) == 'focus') {
                    _this.moveToFocus('focus-2');
                } else if (btn.id.substr(0, 11) == 'btn_collect') {
                    _this.moveToFocus('btn_collect_2');
                } else {
                    _this.moveToFocus('prev-page');
                }
            });
        }
    },
    // 下一页
    nextPage: function (btn) {
        var _this = Collect;
        if (_this.page + 1 <= _this.maxPage) {
            _this.getCollectList(_this.page + 1, function () {
                _this.page++;
                _this.render();
                if (btn.id.substr(0, 5) == 'focus') {
                    _this.moveToFocus('focus-0');
                } else if (btn.id.substr(0, 11) == 'btn_collect') {
                    _this.moveToFocus('btn_collect_0');
                } else {
                    _this.moveToFocus('next-page');
                }
            });
        }
    },
    // 首页
    firstPage: function (btn) {
        var _this = Collect;
        if (_this.page != 1) {
            _this.getCollectList(1, function () {
                _this.page = 1;
                _this.render();
                _this.moveToFocus('first-page');
            });
        }
    },
    // 尾页
    lastPage: function (btn) {
        var _this = Collect;
        if (_this.page != _this.maxPage) {
            _this.getCollectList(_this.maxPage, function () {
                _this.page = _this.maxPage;
                _this.render();
                _this.moveToFocus('last-page');
            });
        }
    },

    // 箭头指示切换
    toggleArrow: function () {
        if (this.page > 1) {
            S('prev-arrow')
        } else {
            H('prev-arrow')
        }
        if (this.page < this.maxPage) {
            S('next-arrow')
        } else {
            H('next-arrow')
        }
    },
    getCurPageObj: function () {
        var objCurrent = LMEPG.Intent.createIntent('HistoryPlayIndex');
        return objCurrent;
    },


    isInArray: function (arr, value) {
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
        if (key == 'left' && (btn.id === 'focus-0' || btn.id === 'btn_collect_0')) {
            Collect.prevPage(btn);

            return false;
        }

        // 下一页
        if (key == 'right' && (btn.id === 'focus-2' || btn.id === 'btn_collect_2')) {
            Collect.nextPage(btn);
            return false;
        }

        if (key == 'up' && Collect.isInArray(['focus-0', 'focus-1', 'focus-2'], btn.id)) {
            Collect.moveToFocus(Collect.currentTab == 1 ? 'btn_ttjs' : 'btn_ttyj');
            return false;
        }

        if (btn.id == 'btn_ttjs' || btn.id == 'btn_ttyj') {
            if (key == 'down') {
                LMEPG.ButtonManager.setSelected(btn.id == 'btn_ttjs' ? 'btn_ttjs' : 'btn_ttyj', true);
                LMEPG.ButtonManager.setSelected(btn.id == 'btn_ttjs' ? 'btn_ttyj' : 'btn_ttjs', false);
            } else if (key === 'right' || key === 'left') {
                Collect.firstPage();
            } else {
                LMEPG.ButtonManager.setSelected('btn_ttjs', false);
                LMEPG.ButtonManager.setSelected('btn_ttyj', false);
            }
        }
        var _this = Collect;
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
            if (moveCondition.list && lastVideoItemIndex < this.NUM_PER_PAGE) {
                _this.moveToFocus('first-page');
            }
            return false;
        }
    },
    toggleFocus: function (btn, hasFocus) {
        var btnElement = Collect.findChildrenById(btn.id, "p")[0];
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
        var VIDEO_COUNT = this.NUM_PER_PAGE;

        while (VIDEO_COUNT--) {
            this.buttons.push({
                id: 'focus-' + VIDEO_COUNT,
                name: '视频',
                type: 'div',
                nextFocusLeft: 'focus-' + (VIDEO_COUNT - 1),
                nextFocusRight: 'focus-' + (VIDEO_COUNT + 1),
                nextFocusUp: this.currentTab == 1 ? 'btn_ttjs' : 'btn_ttyj',
                nextFocusDown: 'btn_collect_' + VIDEO_COUNT,
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                // focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V21/video_list_f.png' : g_appRootPath + '/Public/img/hd/Collect/V21/video_list_f.png',
                focusImage: g_appRootPath + '/Public/img/hd/Collect/V21/video_list_f.png',
                click: this.onClickVideoItem,
                focusChange: this.toggleFocus,
                beforeMoveChange: this.onMoveChangeMoveToId
            }, {
                id: 'btn_collect_' + VIDEO_COUNT,
                name: '收藏-' + VIDEO_COUNT,
                type: 'img',
                nextFocusLeft: 'btn_collect_' + (VIDEO_COUNT != 0 ? VIDEO_COUNT - 1 : 2),
                nextFocusRight: 'btn_collect_' + (VIDEO_COUNT < this.NUM_PER_PAGE ? (VIDEO_COUNT + 1) : 0),
                nextFocusUp: 'focus-' + VIDEO_COUNT,
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V21/Collect/' + (Collect.collectStatus[VIDEO_COUNT] ? 'btn_unCollect.png' : 'btn_collect.png'),
                focusImage: g_appRootPath + '/Public/img/hd/Home/V21/Collect/' + (Collect.collectStatus[VIDEO_COUNT] ? 'btn_unCollect_f.png' : 'btn_collect_f.png'),
                click: this.doCollectItem,
                beforeMoveChange: this.onMoveChangeMoveToId,
                cIndex: VIDEO_COUNT,
            });
        }
        this.buttons.push({
            id: 'btn_clear',
            name: '清空历史观看记录',
            type: 'img',
            nextFocusLeft: 'btn_ttyj',
            nextFocusDown: 'btn_ttyj',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_clear.png',
            focusImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_clear_f.png',
            click: this.clearAllCollection,
            beforeMoveChange: this.onMoveChangeMoveToId
        }, {
            id: 'btn_ttjs',
            name: '播放历史天天健身导航',
            type: 'img',
            nextFocusRight: 'btn_ttyj',
            nextFocusUp: 'btn_clear',
            nextFocusDown: 'focus-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttjs.png',
            focusImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttjs_f.png',
            selectedImage: g_appRootPath + '/Public/img/hd/Home/V21/Nav/btn_ttjs_offline.png',
            click: '',
            beforeMoveChange: this.onMoveChangeMoveToId,
            focusChange: this.tabGetFocus,
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
            click: '',
            beforeMoveChange: this.onMoveChangeMoveToId,
            focusChange: this.tabGetFocus,
        }, {
            id: 'prev-page',
            name: '上一页',
            type: 'img',
            nextFocusLeft: 'first-page',
            nextFocusRight: 'next-page',
            nextFocusUp: 'focus-3',
            backgroundImage: g_appRootPath + '/Public/img/hd/Collect/V21/prev_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/Collect/V21/prev_page_f.png',
            click: this.prevPage,
            beforeMoveChange: this.onMoveChangeMoveToId
        }, {
            id: 'next-page',
            name: '下一页',
            type: 'img',
            nextFocusLeft: 'prev-page',
            nextFocusRight: 'last-page',
            nextFocusUp: 'focus-2',
            backgroundImage: g_appRootPath + '/Public/img/hd/Collect/V21/next_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/Collect/V21/next_page_f.png',
            click: this.nextPage,
            beforeMoveChange: this.onMoveChangeMoveToId
        }, {
            id: 'last-page',
            name: '尾页',
            type: 'img',
            nextFocusLeft: 'next-page',
            nextFocusUp: 'focus-2',
            backgroundImage: g_appRootPath + '/Public/img/hd/Collect/V21/last_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/Collect/V21/last_page_f.png',
            click: this.lastPage,
            beforeMoveChange: this.onMoveChangeMoveToId
        });
        console.log(this.buttons);
        this.initButtons('focus-0');
    },
    initButtons: function (id) {
        LMEPG.ButtonManager.init(id, this.buttons, '', true);
        LMEPG.ButtonManager.setSelected('btn_ttjs', true);
    },

    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },

    /*导航栏得失焦点回调操作*/
    tabGetFocus: function (btn, hasFocus) {
        if (!hasFocus) {
            return false;
        }
        if (btn.id == 'btn_ttjs') {
            Collect.currentTab = 1;
        } else if (btn.id == 'btn_ttyj') {
            Collect.currentTab = 2;
        }
//         Collect.moveToFocus(btn.id);


        Collect.getCollectList(Collect.page, function () {
            Collect.render();
            // Collect.moveToFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'focus-0');
        });
    },
    /**
     * 获取历史播放视频
     * @param page
     * @param callback
     */
    getCollectList: function (page, callback) {
        LMEPG.UI.showWaitingDialog();
        // var postData = {
        //     'currentPage': page,
        //     'pageNum': 6
        // };
        // 1：视频、2：视频集、8：测试题
        if (typeof (type) === 'undefined' || type == 'null') {
            type = 1;      //默认拉取视频
        }
        var postVideoData = {
            "item_type": type,
        };

        // 获取播放历史
        // LMEPG.ajax.postAPI('Collect/getCollectListNew', postData, function (data) {
        LMEPG.ajax.postAPI("Collect/getCollectListNew", postVideoData, function (data) {
            data = data instanceof Object ? data : JSON.parse(data);
            console.log(data);

            if (data.result == 0) {
                Collect.dataList = [];
                data.list.forEach(function (t, i) {
                    if (Collect.currentTab == 1 && t.model_type >= 5 && t.model_type <= 8) {
                        Collect.dataList.push(t);
                    } else if (Collect.currentTab == 2 && t.model_type >= 1 && t.model_type <= 4) {
                        Collect.dataList.push(t);
                    }
                });

                Collect.maxPage = Math.ceil(Collect.dataList.length / Collect.NUM_PER_PAGE);
                // Collect.maxPage = 0;
                callback();
            } else {
                LMEPG.UI.showToast('数据获取失败！');
            }

            LMEPG.UI.dismissWaitingDialog();
        });
    },

    // 清空所有收藏
    clearAllCollection: function () {
        LMEPG.ajax.postAPI("Collect/clearCollectRecord", null, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data.result == 0) {
                    G("page-index").innerHTML = "";
                    LMEPG.Intent.jump(PageJump.getCurrentPage());
                    Hide("arrow-left");
                    Hide("arrow-right");
                } else {
                    LMEPG.UI.showToast("清空失败:" + data.result);
                }
            } catch (e) {
                LMEPG.UI.showToast("清空异常");
            }
        });
    },

    /**
     * 处理点击视频列表事件
     * @param dataIndex
     */
    onClickVideoItem: function (btn) {
        var index = parseInt(btn.id.substr(6));
        var data = Collect.dataList[index];
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
        var currentPage = LMEPG.Intent.createIntent('collect');
        currentPage.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        currentPage.setParam('currentTab', Collect.currentTab);
        currentPage.setParam('page', Collect.page);
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