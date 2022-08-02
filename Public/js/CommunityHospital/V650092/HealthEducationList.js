var CommunityHosp = {
    page: LMEPG.Func.getLocationString('page') || 1,
    maxPage: 0,
    init: function () {
        this.getVideoList();
    },
    goBack: function () {
        LMEPG.Intent.back();
    },
    /**
     * 获取对应分类视频列表
     * @param modelType
     */
    getVideoList: function () {
        var _this = CommunityHosp;
        if (TP.areaName == "mingde") {
            var postData = {'model_type': 22};
        }else {
            var postData = {'model_type': 6};
        }

        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Video/getVideoList', postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            var data = JSON.parse(data);
            console.log(data);
            if (data.result == 0) {
                _this.data = data;
                _this.render();
                _this.createBtns();
            } else {
                LMEPG.UI.showToast('视频请求失败！即将返回。', 2, _this.goBack);
            }
        }, function () {
            LMEPG.UI.showToast('视频请求失败！即将返回。', 2, _this.goBack);
        });
    },

    setPageInfo: function (data) {

    },

    render: function () {
        var htm = '';
        var reCount = (this.page - 1) * 6; // 初始起始页数为1，翻页页数计算起始页
        var listData = CommunityHosp.data.list;
        var cls; // 添加className
        var item; // 单条数据

        this.currentData = listData.slice(reCount, reCount + 6); // 当前页面数据（存储在跳转播放的时候使用）
        this.maxPage = Math.ceil(listData.length / 6); // 每页6条数据来计算总页数

        for (var i = 0, len = this.currentData.length; i < len; i++) {
            item = this.currentData[i];
            cls = (i + 1) % 3 || 'last-item';
            htm += '<div class="health-wrap ' + cls + '">'
                + '<img class="img-item"  src="' + 'http://120.70.237.86:10001/fs/' + item.image_url + '"'
                + ' onerror="this.src=\'__ROOT__/Public/img/hd/CommunityHospital/Expert/default.png\'" />'
                + '<p id="title-' + i + '" class="title-item" title="' + item.title + '">' + LMEPG.Func.substrByOmit(item.title, 11)
                + '</p></div>';
        }

        G('container').innerHTML = (htm || '<span style="font-style: italic;font-size: 20px">内容为空 ~</span>');
        this.toggleArrow();
    },
    turnList: function (key, btn) {
        var _this = CommunityHosp;
        if (key === 'left' && (btn.id === 'title-0' || btn.id === 'title-3') && _this.page != 1) {
            _this.prevList();
            return false;
        }

        if (key === 'right' && (btn.id === 'title-2' || btn.id === 'title-5') && _this.page != _this.maxPage) {
            _this.nextList();
            return false;
        }
    },
    prevList: function () {
        this.page--;
        this.render();
        LMEPG.BM.requestFocus('title-5');
    },
    nextList: function () {
        this.page++;
        this.render();
        LMEPG.BM.requestFocus('title-0');
    },
    toggleArrow: function () {
        H('prev-arrow');
        H('next-arrow');
        if (this.maxPage) {
            this.page != 1 && S('prev-arrow');
            this.page != this.maxPage && S('next-arrow');
        }
    },
    onClickVideoItem: function (btn) {
        var _this = CommunityHosp;
        var ftp_url_json, play_id;
        var videoInfo = _this.currentData[btn.idx];
        if (videoInfo.ftp_url instanceof Object) {
            ftp_url_json = videoInfo.ftp_url;
        } else {
            ftp_url_json = JSON.parse(videoInfo.ftp_url);
        }
        var focusId = LMEPG.BM.getCurrentButton().id;
        // 视频ID
        if (TP.platformType == 'hd') {
            play_id = ftp_url_json.gq_ftp_url;
        } else {
            play_id = ftp_url_json.bq_ftp_url;
        }
        var paramJson = {
            'sourceId': videoInfo.source_id,
            'videoUrl': play_id,
            'title': videoInfo.title,
            'type': 2,
            'entryType': 4,
            'entryTypeName': '社区医院',
            'userType': videoInfo.user_type,
            'freeSeconds': videoInfo.free_seconds,
            'focusIdx': focusId,
            'unionCode': videoInfo.union_code
        };
        if (LMEPG.Func.isAllowAccess(TP.vip, ACCESS_PLAY_VIDEO_TYPE, paramJson)) {
            _this.jumpVideoPlay(paramJson);
        } else {
            var postData = {'videoInfo': JSON.stringify(paramJson)};
            LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
                if (data.result == 0) {
                    _this.jumpBuyVip(paramJson.focusIdx, paramJson.title);
                } else {
                    document.getElementById('debug').innerText = '系统报错!';
                }
            });
        }
    },

    jumpVideoPlay: function (paramJson) {
        var objCurrent = CommunityHosp.currentPage();
        objCurrent.setParam('fromId', 2);

        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('videoInfo', JSON.stringify(paramJson));
        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    jumpBuyVip: function (focusIdx, remark) {
        var objCurrent = this.currentPage();
        objCurrent.setParam('fromId', 1);
        objCurrent.setParam('focusId', focusIdx);

        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('isPlaying', '1');
        objOrderHome.setParam('remark', remark);

        LMEPG.Intent.jump(objOrderHome, objCurrent);
    },

    currentPage: function () {
        var obj = LMEPG.Intent.createIntent('health-education');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        obj.setParam('areaName', TP.areaName);
        obj.setParam('page', CommunityHosp.page);
        return obj;
    },

    onFocusChange: function (btn, hasFocus) {
        var marqueeEl = G(btn.id);
        if (hasFocus) {
            LMEPG.UI.Marquee.start(btn.id, 4, 11, 50, "left", "scroll");
        } else {
            LMEPG.UI.Marquee.stop();
        }
    },
    createBtns: function () {
        var buttons = [];
        var len = 6; // 焦点个数
        while (len--) {
            buttons.push({
                id: 'title-' + len,
                type: 'div',
                nextFocusUp: 'title-' + (len - 3),
                nextFocusDown: 'title-' + (len + 3),
                nextFocusLeft: 'title-' + (len - 1),
                nextFocusRight: 'title-' + (len + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/title.png',
                focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/title-f.png',
                beforeMoveChange: this.turnList,
                focusChange: this.onFocusChange,
                click: this.onClickVideoItem,
                idx: len
            });
        }
        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'title-0', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    }
};

CommunityHosp.init();
