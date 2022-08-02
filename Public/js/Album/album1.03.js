(function () {
    function LMAlbum(options) {
        // 当前页面背景图片
        this.bgImage = 'bg_album.png';
        this.buttons = [];

        // 查看更多跳转路由
        this.morePageName = 'channel';
        // 跳转查看更多返回路由
        this.backPage = 'home';
        // 查看更多请求视频类型
        this.backHomeTabNumber = '4';
        // 查看更多参数初始化
        switch (TP.lmcid) {
            case "000051":
            case "320092":
                // 中国联通/江苏电信
                this.backPage = "homeTab3";
                this.backHomeTabNumber = "3";
                this.morePageName = 'home';
                break;
            case '630092':
            case '640092':
                // 宁夏、青海电信
                this.morePageName = 'MenuTabLevelThree';
                break;
            case '450094':
                this.bgImage = "bg_album_full.png";
                if (options.smallVideoOption) {
                    // 不设置小窗播放
                    options.smallVideoOption = null;
                    G('videoTv').parentNode.removeChild(G('videoTv'));
                }
                break;
        }
        if (TP.platformType == 'sd') {
            this.bgImage = 'bg_album_sd.png';
        }

        // 页面跳转
        this.page = {
            getCurrentPage: function () {
                var objCurrent = LMEPG.Intent.createIntent('album');
                objCurrent.setParam('albumName', TP.albumName);
                objCurrent.setParam('focus_index', TP.focusIDName);
                objCurrent.setParam('moveAlbumNum', TP.albumMovePages);
                objCurrent.setParam('moveNum', TP.listMovePages);
                objCurrent.setParam('fromId', 1);
                objCurrent.setParam('inner', TP.inner);
                return objCurrent;
            },

            jumpBuyVip: function (focusIdx, remark) {
                var objCurrent = this.getCurrentPage();
                objCurrent.setParam('fromId', 1);
                objCurrent.setParam('focus_index', focusIdx);
                objCurrent.setParam('page', 0);
                objCurrent.setParam('moveNum', TP.listMovePages);

                var objOrderHome = LMEPG.Intent.createIntent('orderHome');
                objOrderHome.setParam('isPlaying', '1');
                objOrderHome.setParam('remark', remark);

                LMEPG.Intent.jump(objOrderHome, objCurrent);
            },

            jumpVideoPlay: function (paramJson) {
                var objCurrent = this.getCurrentPage();
                objCurrent.setParam('fromId', 2);
                objCurrent.setParam('focus_index', paramJson.focusIdx);
                objCurrent.setParam('moveNum', TP.listMovePages);

                var objPlayer = LMEPG.Intent.createIntent('player');
                objPlayer.setParam('videoInfo', JSON.stringify(paramJson));
                // 广西广电多传一个参数
                objPlayer.setParam('allVideoInfo', JSON.stringify([paramJson]));


                LMEPG.Intent.jump(objPlayer, objCurrent);
            },

            jumpAlbum: function (focusId) {
                TP.focusIDName = focusId;
                var objCurrent = this.getCurrentPage();
                var objAlbum = LMEPG.Intent.createIntent('album');
                var currentAlbum = G(focusId).getAttribute('data-a');
                objAlbum.setParam('albumName', currentAlbum);
                objAlbum.setParam('inner', '1');
                objCurrent.setParam('focus_index', focusId);
                if (currentAlbum === 'more') {
                    this.jumpHomeTab('home');
                } else {
                    LMEPG.Intent.jump(objAlbum, objCurrent);
                }
            },

            jumpHomeTab: function (tabName, focusIndex) {
                var objHomeTab = LMEPG.Intent.createIntent(tabName);
                objHomeTab.setParam('classifyId', '');
                objHomeTab.setParam('focusIndex', focusIndex);
                objHomeTab.setParam('tabId', 'tab-2');  // 中国联通/江苏电信新版专辑更多视频跳转的tabId

                LMEPG.Intent.jump(objHomeTab);
            },

            jumpVideoMore: function (btn) {
                var self = btn.Obj;
                var objMoreVideo = LMEPG.Intent.createIntent(self.morePageName);
                objMoreVideo.setParam('classifyId', 1);
                objMoreVideo.setParam('modeTitle', '更多精彩');
                objMoreVideo.setParam('modeType', self.backHomeTabNumber);
                objMoreVideo.setParam('modelType', 4);
                objMoreVideo.setParam('currentTabIndex', 3);
                objMoreVideo.setParam('homeTabIndex', 5);
                objMoreVideo.setParam('pageCurrent', 1); // 内容页数
                objMoreVideo.setParam('navCurrent', 0);  // 导航焦点
                objMoreVideo.setParam('tabId', 'tab-2');  // 中国联通/江苏电信新版专辑更多视频跳转的tabId

                var objBack = LMEPG.Intent.createIntent(self.backPage);
                LMEPG.Intent.jump(objMoreVideo, objBack);
            },

            goBack: function () {
                if (RenderParam.lmcid == '450094' && RenderParam.inner != 1) {

                    // 广西广电局方大厅进入返回逻辑
                    var albumHistoryLength = history.length;
                    var backLength = albumHistoryLength + 1 - RenderParam.splashHistory;
                    //LMEPG.Log.info("clickType = " + clickType + ",albumHistoryLength = " + albumHistoryLength + ",splashHistory = " + RenderParam.splashHistory);
                    history.go(-backLength);
                } else {
                    LMEPG.Intent.back();
                }
            }
        };

        // 网络请求
        this.ajaxHelper = {
            storeVideoInfo: function (obj, paramJson) {
                var postData = {'videoInfo': JSON.stringify(paramJson)};
                LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
                    if (data.result == 0) {
                        obj.page.jumpBuyVip(paramJson.focusIdx, paramJson.title);
                    } else {
                        G('debug').innerText = '系统报错!';
                    }
                });
            }
        };

        // 界面参数初始化
        for (var item in options) {
            if (options.hasOwnProperty(item)) {
                this[item] = options[item];
            }
        }

        // 初始化当前背景
        G('body').style.backgroundImage = 'url(' + this.imgPrefixIndex + this.bgImage + ')';

        // 返回按钮
        this.buttons.push(
            {
                id: 'back',
                name: '返回',
                type: 'img',
                nextFocusLeft: this.backItemMove.left,
                nextFocusRight: this.backItemMove.right,
                nextFocusDown: this.backItemMove.down,
                nextFocusUp: this.backItemMove.up,
                backgroundImage: TP.imgPrefixIndex + 'bg_back.png',
                focusImage: TP.imgPrefixIndex + 'f_back.png',
                beforeMoveChange: this.hookMoveFocus,
                click: this.page.goBack,
                Obj: this
            }
        );

        // 判断是否需要显示查看更多按钮
        if (this.moreItemMove) {
            G('body').innerHTML += '<img id="more" class="' + TP.platformType + '-more" src="' + this.imgPrefixIndex + 'bg_more_video.png" class="' + TP.platformType + '-more-album">';
            // 查看更多按钮
            this.buttons.push(
                {
                    id: 'more',
                    name: '更多精彩',
                    type: 'img',
                    nextFocusLeft: this.moreItemMove.left,
                    nextFocusRight: this.moreItemMove.right,
                    nextFocusDown: this.moreItemMove.down,
                    nextFocusUp: this.moreItemMove.up,
                    backgroundImage: this.imgPrefixIndex + 'bg_more_video.png',
                    focusImage: this.imgPrefixIndex + 'f_more_video.png',
                    beforeMoveChange: this.hookMoveFocus,
                    click: this.page.jumpVideoMore,
                    Obj: this
                }
            )
        }

        // 创建小窗视频按钮
        if (this.smallVideoOption) {
            var videoTvMove = this.smallVideoOption.videoTvItemMove;
            this.buttons.push(
                {
                    id: 'videoTv',
                    name: '视频小窗',
                    type: 'img',
                    nextFocusLeft: videoTvMove.left,
                    nextFocusRight: videoTvMove.right,
                    nextFocusDown: videoTvMove.down,
                    nextFocusUp: videoTvMove.up,
                    backgroundImage: TP.imgPrefixIndex + 'bg_small_video.png',
                    focusImage: TP.imgPrefixIndex + 'f_small_video.png',
                    beforeMoveChange: this.hookMoveFocus,
                    focusChange: "",
                    click: this.onVideoItemClick,
                    Obj: this
                }
            );
            // 播放小窗视频
            this.playSmallVideo(this.smallVideoOption.videoPosition);

            this.totalVideoArray.shift();
        }

        // 创建视频列表
        this.renderVideoList();
        this.initVideoButtons();

        if (this.albumListOptions) {
            // 创建往期专辑列表
            this.renderAlbumList();
            this.initAlbumButtons();
        }
        if (RenderParam.lmcid == '450094') {
            if (typeof iPanel == "object") {  //广西广电需要赋值返回键、退出键有页面来控制
                iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE", 1);
                iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE", 1);
            }
        }
        initEventKey();

        function initEventKey() {
            var that = this;
            if (RenderParam.lmcid == '450094') {
                //  添加点击返回事件
                LMEPG.Log.info('--->album History addKeyEvent: 广西广电新增返回事件');
                LMEPG.KeyEventManager.addKeyEvent(
                    {
                        KEY_399: function () { //广西广电返回键
                            LMEPG.Log.info('--->album History KEY_399: 广西广电返回键');
                            LMAlbum.page.goBack
                        },
                        KEY_514: function () {  //广西广电退出键
                            LMEPG.Log.info('--->album History KEY_514: 广西广电退出键');
                            LMAlbum.page.goBack
                        }
                    }
                )
            }
        }

        // 初始化所有按钮
        this.initButtons();


        window.onBack = this.page.goBack;
    }

    /**
     * 播放小窗视频
     * @param videoPosition 小窗视频位置
     */
    LMAlbum.prototype.playSmallVideo = function (videoPosition) {
        LMSmallPlayer.initParam({
            carrierId: TP.lmcid,
            playerUrl: TP.domainUrl,
            position: videoPosition,
            playerScreenId: 'small_screen',
            platformType: TP.platformType,
            videoData: TP.videoData
        });
        LMSmallPlayer.startPlayVideo();
        //虚拟按键触发，轮询播放
        LMEPG.KeyEventManager.addKeyEvent({
            EVENT_MEDIA_END: this.play,	         //视频播放结束
            EVENT_MEDIA_ERROR: this.play        //视频播放错误
        });
    };

    /**
     * 渲染视频列表
     */
    LMAlbum.prototype.renderVideoList = function () {
        var videoListHtml = '';
        var videoList = this.getCurrentList(this.totalVideoArray, TP.listMovePages, this.videoListOptions.showItemLength);
        for (var i = 0; i < videoList.length; i++) {
            var src = this.imgPrefixIndex + 'bg_video_item_' + (videoList[i].imageIndex) + '.png';
            var focusBg = this.imgPrefixIndex + 'f_video_item_' + (videoList[i].imageIndex) + '.png';
            videoListHtml += '<img id=focus-' + (i + 1) + ' data-v=' + videoList[i].videoIndex + ' src=' + src + ' data-f=' + focusBg +
                ' data-b=' + src + '>';
        }
        this.toggleVideoArrow();
        G('tab-content').innerHTML = videoListHtml;
    };

    /**
     * 控制视频列表两边箭头的隐藏和显示
     */
    LMAlbum.prototype.toggleVideoArrow = function () {
        var videoList = this.totalVideoArray.length - TP.listMovePages;
        H('v-prev');
        H('v-next');
        TP.listMovePages > 0 && S('v-prev');
        videoList > this.videoListOptions.showItemLength && S('v-next');
    };

    /**
     * 渲染往期专辑列表
     */
    LMAlbum.prototype.renderAlbumList = function () {
        var albumListHtml = '';
        var albumList = this.getCurrentList(this.totalAlbumArray, TP.albumMovePages, this.albumListOptions.showItemLength);
        for (var j = 0; j < albumList.length; j++) {
            var src = this.imgPrefixIndex + 'bg_album' + albumList[j].index + '.png';
            var focusBg = this.imgPrefixIndex + 'f_album' + albumList[j].index + '.png';
            albumListHtml += '<img id=album-' + (j + 1) + ' data-a=' + albumList[j].album + ' src=' + src +
                ' data-f=' + focusBg + ' data-b=' + src + '>';
        }
        this.toggleAlbumArrow();
        G('history-album').innerHTML = albumListHtml;
    };

    /**
     * 控制往期列表两边箭头的隐藏和显示
     */
    LMAlbum.prototype.toggleAlbumArrow = function () {
        var videoList = this.albumListOptions.totalAlbumArray.length - TP.albumMovePages;
        H('a-prev');
        H('a-next');
        TP.albumMovePages > 0 && S('a-prev');
        videoList > this.albumListOptions.showItemLength && S('a-next');
    };

    /**
     * 初始化视频列表按键
     */
    LMAlbum.prototype.initVideoButtons = function () {
        var videoList = this.getCurrentList(this.totalVideoArray, 0, this.videoListOptions.showItemLength);
        // 视频列表按钮
        for (var j = 0; j < videoList.length; j++) {
            var move, up, down, left, right;
            move = this.videoListOptions.moveOption;
            up = move.up;
            down = move.down;
            left = move.left;
            right = move.right;
            if (this.videoListOptions.moveDirection == 'right') {
                left = 'focus-' + j;
                right = 'focus-' + (j + 2);
            } else {
                up = 'focus-' + j;
                down = 'focus-' + (j + 2);
            }
            this.buttons.push({
                id: 'focus-' + (j + 1),
                name: '视频' + (j + 1),
                type: 'img',
                nextFocusUp: up,
                nextFocusDown: down,
                nextFocusLeft: left,
                nextFocusRight: right,
                click: this.onVideoItemClick,
                focusChange: this.onVideoFocus,
                beforeMoveChange: this.beforeVideoFocusMove,
                Obj: this
            });
        }
    };

    /**
     * 视频点击事件
     * @param btn 当前点击对象
     */
    LMAlbum.prototype.onVideoItemClick = function (btn) {
        var self = btn.Obj;
        var btnObj = document.getElementById(btn.id);
        var videoIndex = btnObj.getAttribute('data-v');
        var videoInfo = TP.videoData[videoIndex];
        try {
            console.dir(videoInfo);
            var ftp_url_json, play_id;
            if (videoInfo.ftp_url instanceof Object) {
                ftp_url_json = videoInfo.ftp_url;
            } else {
                ftp_url_json = JSON.parse(videoInfo.ftp_url);
            }
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
                'entryTypeName': TP.albumName,
                'userType': videoInfo.user_type,
                'freeSeconds': videoInfo.free_seconds,
                'duration': videoInfo.duration,
                'focusIdx': btn.id,
                'unionCode': videoInfo.union_code,
                'showStatus': videoInfo.show_status
            };
            if (LMEPG.Func.isAllowAccess(TP.vip, ACCESS_PLAY_VIDEO_TYPE, paramJson)) {
                self.page.jumpVideoPlay(paramJson);
            } else {
                self.ajaxHelper.storeVideoInfo(self, paramJson);
            }
        } catch (e) {
            G('debug').innerText = '系统报错！' + e.toString();
        }
    };

    /**
     * 视频列表项获取焦点事件
     * @param btn 当前获取焦点对象
     * @param hasFocus 是否获取焦点 true--获取焦点 false--失去焦点
     */
    LMAlbum.prototype.onVideoFocus = function (btn, hasFocus) {
        var btnObj = document.getElementById(btn.id);
        if (hasFocus) {
            G('debug').innerHTML = '.'; // 标清防止焦点丢失
            btnObj.src = btnObj.getAttribute('data-f');//获取焦点
        } else {
            G('debug').innerHTML = '';
            btnObj.src = btnObj.getAttribute('data-b');//失去取焦点
        }
    };

    /**
     * 视频列表项焦点移出事件
     * @param direction 焦点移动的下一个方向
     * @param current 当前焦点移动对象
     */
    LMAlbum.prototype.beforeVideoFocusMove = function (direction, current) {
        var self = current.Obj;
        var nextDirection = self.videoListOptions.moveDirection;
        var prevDirection = (nextDirection == 'right' ? 'left' : 'up');
        switch (direction) {
            case prevDirection:
                if (current.id == 'focus-1') {
                    self.moveVideoPrev(direction, current);
                }
                break;
            case nextDirection:
                if (current.id == 'focus-' + self.videoListOptions.showItemLength) {
                    self.moveVideoNext(direction, current);
                }
                break;
            default:
                self.hookVideoMoveFocus(direction, current);
                break;
        }
    };
    LMAlbum.prototype.moveVideoPrev = function (direction, current) {
        if (TP.listMovePages > 0) {
            TP.listMovePages--;
            this.renderVideoList();
            this.moveToFocus('focus-1');
        } else {
            this.moveToFocus(this.videoListOptions.moveOption.prev);
        }
    };
    LMAlbum.prototype.moveVideoNext = function (direction, current) {
        var videoList = (this.totalVideoArray.length) - TP.listMovePages;
        if (videoList > this.videoListOptions.showItemLength) {
            TP.listMovePages++;
            this.renderVideoList();
            this.moveToFocus('focus-' + this.videoListOptions.showItemLength);
        } else {
            this.moveToFocus(this.videoListOptions.moveOption.next);
        }
    };

    LMAlbum.prototype.hookVideoMoveFocus = function (direction, current) {

    };

    /**
     * 初始化往期专辑列表项按键
     */
    LMAlbum.prototype.initAlbumButtons = function () {
        // 往期专辑按钮
        for (var i = 0; i < this.albumListOptions.totalAlbumArray.length; i++) {
            var move = this.albumListOptions.moveOption;
            var up = move.up, down = move.down, left = move.left, right = move.right;
            if (this.albumListOptions.moveDirection == 'right') {
                left = 'album-' + i;
                right = 'album-' + (i + 2);
            } else {
                up = 'album-' + i;
                down = 'album-' + (i + 2);
            }
            this.buttons.push({
                id: 'album-' + (i + 1),
                name: this.albumListOptions.totalAlbumArray[i].album,
                type: 'img',
                nextFocusLeft: left,
                nextFocusRight: right,
                nextFocusUp: up,
                nextFocusDown: down,
                click: this.onAlbumItemClick,
                focusChange: this.onAlbumFocus,
                beforeMoveChange: this.beforeAlbumFocusMove,
                Obj: this
            });
        }
    };

    /**
     * 往期专辑项点击事件
     * @param btn 当前点击对象
     */
    LMAlbum.prototype.onAlbumItemClick = function (btn) {
        btn.Obj.page.jumpAlbum(btn.id);
    };

    /**
     * 往期专辑项获取焦点事件
     * @param btn 当前获取焦点对象
     * @param hasFocus 是否获取焦点 true--获取焦点 false--失去焦点
     */
    LMAlbum.prototype.onAlbumFocus = function (btn, hasFocus) {
        var btnObj = document.getElementById(btn.id);
        if (hasFocus) {
            G('debug').innerHTML = '.'; // 标清防止焦点丢失
            btnObj.src = btnObj.getAttribute('data-f');//获取焦点
        } else {
            G('debug').innerHTML = '';
            btnObj.src = btnObj.getAttribute('data-b');//失去取焦点
        }
    };

    /**
     * 往期专辑项焦点移出事件
     * @param direction 焦点移动的下一个方向
     * @param current 当前焦点移动对象
     */
    LMAlbum.prototype.beforeAlbumFocusMove = function (direction, current) {
        var self = current.Obj;
        var nextDirection = self.albumListOptions.moveDirection;
        var prevDirection = (nextDirection == 'right' ? 'left' : 'up');
        switch (direction) {
            case prevDirection:
                if (current.id == 'album-1') {
                    self.moveAlbumPrev(direction, current);
                }
                break;
            case nextDirection:
                if (current.id == 'album-' + self.albumListOptions.showItemLength) {
                    self.moveAlbumNext(direction, current);
                }
                break;
            default:
                self.hookAlbumMoveFocus(direction, current);
                break;
        }
    };
    LMAlbum.prototype.moveAlbumPrev = function (direction, current) {
        if (TP.albumMovePages > 0) {
            TP.albumMovePages--;
            this.renderAlbumList();
            this.moveToFocus('album-1');
        } else {
            this.moveToFocus(this.albumListOptions.moveOption.prev);
        }
    };
    LMAlbum.prototype.moveAlbumNext = function (direction, current) {
        var videoList = this.albumListOptions.totalAlbumArray.length - TP.albumMovePages;
        if (videoList > this.albumListOptions.showItemLength) {
            TP.listMovePages++;
            this.renderAlbumList();
            this.moveToFocus('album-' + this.albumListOptions.showItemLength);
        } else {
            this.moveToFocus(this.albumListOptions.moveOption.next);
        }
    };

    LMAlbum.prototype.hookAlbumMoveFocus = function () {

    };

    LMAlbum.prototype.moveToFocus = function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    };

    LMAlbum.prototype.getCurrentList = function (arr, move, count) {
        return arr.slice(move, move + count);
    };

    LMAlbum.prototype.initButtons = function () {
        LMEPG.ButtonManager.init(TP.focusIDName, this.buttons, '', true);
    };

    window.LMAlbum = LMAlbum;
})();

(function () {
    function JSAlbum(options) {
        if (TP.platformType == 'hd') {
            this.albumBackgroundImg = 'bg_selected.png';
        } else {
            this.albumBackgroundImg = 'bg_selected_sd.png';
        }

        // 添加专辑更多精彩按钮
        options.moreItemMove = null;
        G('body').innerHTML += '<img id="moreAlbum" src="__ROOT__/Public/img/Common/Album/btn_more_album.png" class="' + TP.platformType + '-more-album">';

        LMAlbum.call(this, options);
    }

    JSAlbum.prototype = LMAlbum.prototype;
    JSAlbum.prototype.constructor = JSAlbum;

    JSAlbum.prototype.renderAlbumList = function () {
        var albumListHtml = '';
        albumListHtml += '<img id="history-album-marker" class="' + TP.platformType + '-history-album-marker" src="__ROOT__/Public/img/Common/Album/bg_marker.png">';
        albumListHtml += '<div id="history-album-list" class="' + TP.platformType + '-history-album-list">';
        var albumList = this.getCurrentList(this.albumListOptions.totalAlbumArray, TP.albumMovePages, this.albumListOptions.showItemLength);
        for (var j = 0; j < albumList.length; j++) {
            var src = this.imgPrefixIndex + 'bg_album' + albumList[j].index + '.png';
            if (albumList[j].index == 'more') {
                src =  g_appRootPath+"/Public/img/Common/Album/bg_album_more.png";
            }
            albumListHtml += '<div id=album-' + (j + 1) + ' data-a=' + albumList[j].album + ' class="history_album_item"><img  src=' + src +
                ' ></div>';
        }
        albumListHtml += '</div>';
        this.toggleAlbumArrow();
        G('history-album').innerHTML = albumListHtml;
    };

    JSAlbum.prototype.onAlbumFocus = function (btn, hasFocus) {
        var self = btn.Obj;
        var btnObj = document.getElementById(btn.id);
        if (hasFocus) {
            btnObj.style.backgroundImage = "url('__ROOT__/Public/img/Common/Album/" + self.albumBackgroundImg + "')";
            btnObj.style.backgroundRepeat = "no-repeat";
        } else {
            btnObj.style.backgroundImage = "";
        }
    };

    JSAlbum.prototype.hookAlbumMoveFocus = function (direction, current) {
        if (direction === 'down') {
            H('history-album');
            LMEPG.ButtonManager.requestFocus('moreAlbum');
        }
    };

    JSAlbum.prototype.showMoreAlbum = function () {
        S('history-album');
        LMEPG.ButtonManager.requestFocus('album-1');
    };

    JSAlbum.prototype.initButtons = function () {
        this.buttons.push({
            id: 'moreAlbum',
            name: '更多精彩',
            type: 'img',
            nextFocusLeft: this.moreAlbumItemMove.left,
            nextFocusRight: this.moreAlbumItemMove.right,
            nextFocusDown: this.moreAlbumItemMove.down,
            nextFocusUp: this.moreAlbumItemMove.up,
            backgroundImage: g_appRootPath+ '/Public/img/Common/Album/btn_more_album.png',
            focusImage: g_appRootPath+ '/Public/img/Common/Album/btn_more_album_f.png',
            beforeMoveChange: '',
            focusChange: '',
            click: this.showMoreAlbum,
            Obj: this
        });

        // 手动修改
        var focusId = TP.focusIDName.slice(0, 1);
        if (focusId === 'a') {
            TP.focusIDName = 'moreAlbum';
        }
        LMEPG.ButtonManager.init(TP.focusIDName, this.buttons, '', true);
    };

    window.JSAlbum = JSAlbum;
})();
