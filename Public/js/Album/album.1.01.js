/**
 *desc:专题封装
 *author: jxf
 *@date 2019-04-01
 *@param: {opt}
 */
(function (doc) {
    //window.isPreventDefault = false; // 启用浏览器默认按键功能（方便调试）
    var totalVideoArray = [];
    var module = {
        count: 0, // 倒计时时长
        buttons: [],
        init: function (opt) {
            opt = opt || {};
            this.resolvedOptions(opt);
            this.different();
            this.getVideoArrayItem();
            this.renderVideoItem();
            LMEPG.Func.isExist(this.moreAlbumItemMove) ? this.createHistoryAlbum() : this.historyAlbumList();
            this.createButtons();
        },
        getVideoArrayItem: function () {
            var i = 0;
            if (LMEPG.Func.isEmpty(this.videoImageIndex)) {
                while (i < this.allVideoLength) {
                    totalVideoArray.push(i);
                    i++;
                }
            } else {
                totalVideoArray = this.videoImageIndex;
            }

            if (TP.platformType == 'hd' && this.hasSmallVideo) {
                totalVideoArray.shift();
            }
        },
        resolvedOptions: function (opt) {
            for (var item in opt) {
                if (opt.hasOwnProperty(item)) {
                    this[item] = opt[item];
                }
            }
        },

        setItemCount: function (arr, move, count) {
            // 截取当前页面使用的item个数
            return arr.slice(move, move + count);
        },

        renderVideoItem: function () {
            var videoListHtm = '';
            var videoList = this.setItemCount(totalVideoArray, TP.listMovePages, this.V);
            for (var i = 0; i < videoList.length; i++) {
                var src = this.imgPrefixIndex + 'bg_video_item_' + (videoList[i] + 1) + '.png';
                var focusBg = this.imgPrefixIndex + 'f_video_item_' + (videoList[i] + 1) + (this.imgFormat ? this.imgFormat : '.png');
                if (LMEPG.Func.isEmpty(this.videoImageIndex)) {
                    if (TP.lmcid === '420092' && videoList[i] === 1 && TP.albumName === 'album117_2') {
                        videoListHtm += '<img id=focus-' + (i + 1) + ' data-v=' + videoList[i] + ' src=' + this.imgPrefixIndex + 'bg_video_item_2_free.png' + ' data-f=' + this.imgPrefixIndex + 'f_video_item_2_free.png' +
                            ' data-b=' + this.imgPrefixIndex + 'bg_video_item_2_free.png' + '>';
                    }else {
                        videoListHtm += '<img id=focus-' + (i + 1) + ' data-v=' + videoList[i] + ' src=' + src + ' data-f=' + focusBg +
                            ' data-b=' + src + '>';
                    }
                } else {
                    videoListHtm += '<img id=focus-' + (i + 1) + ' data-v=' + this.videoItemIndex[videoList[i]] + ' src=' + src + ' data-f=' + focusBg +
                        ' data-b=' + src + '>';
                }
            }
            this.arrowToggle();
            var tabContent = this.tabContent ? this.tabContent : 'tab-content';
            G(tabContent).innerHTML = videoListHtm;
        },

        // 往期专辑
        historyAlbumList: function () {
            if (!this.historyAlbum) {
                return;
            }
            var albumlistHtm = '';
            var AlbumList = this.setItemCount(this.setAlbumIndex, TP.albumMovePages, this.A);
            for (var j = 0; j < AlbumList.length; j++) {
                var src = this.imgPrefixIndex + 'bg_album' + AlbumList[j].index + '.png';
                var focusBg = this.imgPrefixIndex + 'f_album' + AlbumList[j].index + '.png';
                albumlistHtm += '<img id=album' + (j + 1) + ' data-a=' + AlbumList[j].album + ' src=' + src +
                    ' data-f=' + focusBg + ' data-b=' + src + '>';
            }
            this.arrowToggle();
            var historyAlbumId = this.historyAlbumId ? this.historyAlbumId : 'history-album';
            G(historyAlbumId).innerHTML = albumlistHtm;
        },

        // 往期专辑
        createHistoryAlbum: function () {
            if (!this.historyAlbum) {
                return;
            }

            var albumlistHtm = '';
            albumlistHtm += '<img id="history-album-marker" class="' + TP.platformType + '-history-album-marker" src="' + appRootPath + '/Public/img/Common/Album/bg_marker.png">';
            albumlistHtm += '<div id="history-album-list" class="' + TP.platformType + '-history-album-list">';
            var AlbumList = this.setItemCount(this.setAlbumIndex, TP.albumMovePages, this.A);
            for (var j = 0; j < AlbumList.length; j++) {
                var src = this.imgPrefixIndex + 'bg_album' + AlbumList[j].index + '.png';
                if (this.setAlbumIndex[j].index == 'more') {
                    src = appRootPath + "/Public/img/Common/Album/bg_album_more.png";
                }
                albumlistHtm += '<div id=album' + (j + 1) + ' data-a=' + AlbumList[j].album + ' class="history_album_item"><img  src=' + src +
                    ' ></div>';
            }
            this.arrowToggle();
            var historyAlbumId = this.historyAlbumId ? this.historyAlbumId : 'history-album';
            G(historyAlbumId).innerHTML = albumlistHtm;
        },

        /**
         * btn 由基础4个部分组成（返回、视频列表、小窗视频、往期专辑，）和前瞻一个btn(待补全)
         */
        createButtons: function () {
            var videoList = this.setItemCount(totalVideoArray, 0, this.V);
            var AlbumList = this.setItemCount(this.setAlbumIndex, 0, this.A);
            // 视频列表按钮
            for (var j = 0; j < videoList.length; j++) {
                var move, up, down, left, right;
                if (this.customVideoItemButton) {
                    move = this.customVideoItemButton(j);
                    up = move.up;
                    down = move.down;
                    left = move.left;
                    right = move.right;
                } else {
                    move = this.firstAndLastListItemMove;
                    up = move.up;
                    down = move.down;
                    left = move.left;
                    right = move.right;
                    if (this.listVideoDirection == 'right') {
                        left = 'focus-' + j;
                        right = 'focus-' + (j + 2);
                    } else {
                        up = 'focus-' + j;
                        down = 'focus-' + (j + 2);
                    }
                }

                this.buttons.push({
                    id: 'focus-' + (j + 1),
                    name: '视频' + (j + 1),
                    type: 'img',
                    nextFocusUp: up,
                    nextFocusDown: down,
                    nextFocusLeft: left,
                    nextFocusRight: right,
                    click: this.keyEnter,
                    focusChange: this.onFocus,
                    beforeMoveChange: this.beforeFocusMove,
                    Obj: this
                });
            }
            // 往期专辑按钮
            for (var i = 0; i < AlbumList.length; i++) {
                var move1 = this.firstAndLastAlbumItemMove;
                var up1 = move1.up, down1 = move1.down, left1 = move1.left, right1 = move1.right;
                if (this.hisAlbumDirection == 'right') {
                    left1 = 'album' + i;
                    right1 = 'album' + (i + 2);
                } else {
                    up1 = 'album' + i;
                    down1 = 'album' + (i + 2);
                }
                this.buttons.push({
                    id: 'album' + (i + 1),
                    name: AlbumList[i].album,
                    type: LMEPG.Func.isExist(this.moreAlbumItemMove) ? 'div' : 'img',
                    nextFocusLeft: left1,
                    nextFocusRight: right1,
                    nextFocusUp: up1,
                    nextFocusDown: down1,
                    click: this.goAlbum,
                    focusChange: LMEPG.Func.isExist(this.moreAlbumItemMove) ? this.onAlbumFocus : this.onFocus,
                    beforeMoveChange: this.beforeFocusMove,
                    Obj: this
                });
            }
            this.buttons.push({
                id: 'back',
                name: '返回',
                type: 'img',
                nextFocusLeft: this.backItemMove.left,
                nextFocusRight: this.backItemMove.right,
                nextFocusDown: this.backItemMove.down,
                nextFocusUp: this.backItemMove.up,
                backgroundImage: this.imgPrefixIndex + 'bg_back.png',
                focusImage: this.imgPrefixIndex + 'f_back' + (this.imgFormat ? this.imgFormat : '.png'),
                beforeMoveChange: this.hookMoveFocus,
                click: this.onBack,
                Obj: this
            }, {
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
                click: this.jumpVideoMore,
                Obj: this
            }, {
                id: 'videoTv',
                name: '视频小窗',
                type: 'img',
                nextFocusLeft: this.videoTvItemMove.left,
                nextFocusRight: this.videoTvItemMove.right,
                nextFocusDown: this.videoTvItemMove.down,
                nextFocusUp: this.videoTvItemMove.up,
                backgroundImage: this.imgPrefixIndex + (this.smallVideoImage ? this.smallVideoImage : 'bg_small_video.png'),
                focusImage: this.imgPrefixIndex + (this.smallFocusVideoImage ? this.smallFocusVideoImage : 'f_small_video.png'),
                beforeMoveChange: this.hookMoveFocus,
                focusChange: this.onVideoTvFocus,
                click: this.keyEnter,
                Obj: this
            });
            if (LMEPG.Func.isExist(this.moreAlbumItemMove)) {
                this.buttons.push(
                    {
                        id: 'moreAlbum',
                        name: '更多精彩',
                        type: 'img',
                        nextFocusLeft: this.moreAlbumItemMove.left,
                        nextFocusRight: this.moreAlbumItemMove.right,
                        nextFocusDown: this.moreAlbumItemMove.down,
                        nextFocusUp: this.moreAlbumItemMove.up,
                        backgroundImage: appRootPath + '/Public/img/Common/Album/btn_more_album.png',
                        focusImage: appRootPath + '/Public/img/Common/Album/btn_more_album_f.png',
                        beforeMoveChange: '',
                        focusChange: '',
                        click: this.showMoreAlbum,
                        Obj: this
                    }
                );

                var focusId = TP.focusIDName.slice(0, 1);
                if (focusId === 'a') {
                    TP.focusIDName = 'moreAlbum';
                }
            }

            this.initButtons(TP.focusIDName);
        },
        showMoreAlbum: function () {
            S('history-album');
            LMEPG.ButtonManager.requestFocus('album1');
        },
        // 指示箭头切换
        arrowToggle: function () {
            var videoList = totalVideoArray.length - TP.listMovePages;
            var albumList = (this.setAlbumIndex.length) - TP.albumMovePages;
            var prevVideoId = this.prevArrowId ? this.prevArrowId : 'v-prev';
            var nextVideoId = this.nextArrowId ? this.nextArrowId : 'v-next';

            var prevAlbumId = this.prevAlbumArrowId ? this.prevAlbumArrowId : 'a-prev';
            var nextAlbumId = this.nextAlbumArrowId ? this.nextAlbumArrowId : 'a-next';
            H(prevVideoId);
            H(nextVideoId);
            H(prevAlbumId);
            H(nextAlbumId);
            TP.listMovePages > 0 && S(prevVideoId);
            videoList > this.V && S(nextVideoId);

            TP.albumMovePages > 0 && S(prevAlbumId);
            albumList > this.A && S(nextAlbumId);

        },

        // 焦点移动前回调
        beforeFocusMove: function (direction, current) {
            var self = current.Obj;
            var IDCut = current.id.slice(0, 1);
            var nextDirection = function () {
                var key;
                if (IDCut == 'f') {
                    key = self.listVideoDirection;
                } else {
                    key = self.hisAlbumDirection;
                }
                return key;
            }();
            var prevDirection = function () {
                return nextDirection == 'right' ? 'left' : 'up';
            }();
            switch (direction) {
                case prevDirection:
                    if (current.id == 'focus-1' || current.id == 'album1') {
                        self.prev(direction, current);
                    }
                    break;
                case nextDirection:
                    if (current.id == 'focus-' + self.V || current.id == 'album' + self.A) {
                        self.next(direction, current);
                    }
                    break;
                default:
                    self.hookMoveFocus(direction, current);
                    break;
            }
        },

        // 上一页
        prev: function (key, btn) {
            var IDCut = btn.id.slice(0, 1);
            switch (IDCut) {
                case 'f':
                    if (TP.listMovePages > 0) {
                        TP.listMovePages--;
                        this.renderVideoItem();
                        this.moveToFocus('focus-1');
                    } else {
                        this.moveToFocus(this.firstAndLastListItemMove.prev);
                    }
                    break;
                case 'a':
                    if (TP.albumMovePages > 0) {
                        TP.albumMovePages--;
                        this.historyAlbumList();
                        this.moveToFocus('album1');
                    } else {
                        this.moveToFocus(this.firstAndLastAlbumItemMove.prev);
                    }
                    break;
            }
        },

        // 下一页
        next: function (key, btn) {
            var cutId = btn.id.slice(0, 1);
            var videoList = (totalVideoArray.length) - TP.listMovePages;
            var albumList = (this.setAlbumIndex.length) - TP.albumMovePages;
            switch (cutId) {
                case 'f':
                    if (videoList > this.V) {
                        TP.listMovePages++;
                        this.renderVideoItem();
                        this.moveToFocus('focus-' + this.V);
                    } else {
                        this.moveToFocus(this.firstAndLastListItemMove.next);
                    }
                    break;
                case 'a':
                    if (albumList > this.A) {
                        TP.albumMovePages++;
                        this.historyAlbumList();
                        this.moveToFocus('album' + this.A);
                    } else {
                        console.log(this.firstAndLastAlbumItemMove.next);
                        this.moveToFocus(this.firstAndLastAlbumItemMove.next);
                    }
                    break;
            }
        },

        // 获得焦点、失去焦点添加样式
        onFocus: function (btn, hasFocus) {
            var btnObj = doc.getElementById(btn.id);
            if (hasFocus) {
                G('debug').innerHTML = '.'; // 标清防止焦点丢失
                btnObj.src = btnObj.getAttribute('data-f');//获取焦点
                var currentId = LMEPG.BM.getCurrentButton().id;
                try {
                    if (currentId.substring(0, 1) == "f") {
                        var index = parseInt(TP.listMovePages) + parseInt(currentId.substring(6, 7));
                        var domTitle = G("title");
                        if (domTitle) domTitle.src = appRootPath + "/Public/img/hd/Album/album110/title" + index + ".gif";
                    }
                } catch (e) {
                    console.log("抛出异常" + e);
                }
            } else {
                G('debug').innerHTML = '';
                btnObj.src = btnObj.getAttribute('data-b');//失去取焦点
            }
        },

        // 江苏专辑获取焦点
        onAlbumFocus: function (btn, hasFocus) {
            var albumBackgroundImg = '';
            if (TP.platformType == 'hd') {
                albumBackgroundImg = 'bg_selected.png';
            } else {
                albumBackgroundImg = 'bg_selected_sd.png';
            }
            var btnObj = doc.getElementById(btn.id);
            if (hasFocus) {
                btnObj.style.backgroundImage = "url('__ROOT__/Public/img/Common/Album/" + albumBackgroundImg + "')";
                btnObj.style.backgroundRepeat = "no-repeat";
            } else {
                btnObj.style.backgroundImage = "";
            }
        },

        // 键入事件
        keyEnter: function (btn) {
            var self = btn.Obj;
            var btnObj = doc.getElementById(btn.id);
            var videoIndex = btnObj.getAttribute('data-v');
            switch (true) {
                case btn.id == 'back':
                    self.onBack();
                    break;
                case self.lastVideoTvItemClickIsMore && videoIndex == self.allVideoLength - 1 :
                    self.jumpVideoMore(btn); // 最后一个视频列表是跳转查看更多
                    break;
                default:
                    try {
                        var videoInfo = TP.videoData[videoIndex];
                        console.dir(videoInfo);
                        self.onClickVideoItem(btn.id, videoInfo);
                    } catch (e) {
                        G('debug').innerText = '系统报错！' + e.toString();
                    }
                    break;
            }
        },

        initButtons: function (id) {
            if (TP.lmcid == '450094') {
                //  添加点击返回事件
                LMEPG.Log.info('--->album addKeyEvent: 广西广电新增返回事件');
                LMEPG.KeyEventManager.addKeyEvent(
                    {
                        KEY_399: function () { //广西广电返回键
                            LMEPG.Log.info('--->album KEY_399: 广西广电返回键');
                            App.onBack();
                        },
                        KEY_514: function () {  //广西广电退出键
                            LMEPG.Log.info('--->album KEY_514: 广西广电退出键');
                            App.onBack();
                        }
                    }
                )
            }
            LMEPG.ButtonManager.init(id, this.buttons, '', true);
        },

        moveToFocus: function (id) {
            LMEPG.ButtonManager.requestFocus(id);
        },

        onClickVideoItem: function (id, videoInfo) {
            var self = this;
            var ftp_url_json, play_id;

            if (videoInfo.ftp_url instanceof Object) {
                ftp_url_json = videoInfo.ftp_url;
            } else {
                ftp_url_json = JSON.parse(videoInfo.ftp_url);
            }
            //视频专辑下线处理
            if (videoInfo.show_status == "3") {
                LMEPG.UI.showToast('该节目已下线');
                return;
            }

            // 视频ID
            if (TP.platformType == 'hd') {
                play_id = ftp_url_json.gq_ftp_url;
            } else {
                play_id = ftp_url_json.bq_ftp_url;
            }
            if (TP.lmcid == '520092') {
                // 贵州电信需要编码
                play_id = encodeURIComponent(play_id);
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
                'focusIdx': id,
                'unionCode': videoInfo.union_code,
                'showStatus': videoInfo.show_status
            };
            if (TP.vip == 0 && TP.isVideoFree == 1) {
                // 普通用户且具备免费观看权限，修改当前视频观看权限
                paramJson.userType = 0;
            }
            if (LMEPG.Func.isAllowAccess(TP.vip, ACCESS_PLAY_VIDEO_TYPE, paramJson)) {
                self.jumpVideoPlay(paramJson);
            } else {
                var postData = {'videoInfo': JSON.stringify(paramJson)};
                LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
                    if (data.result == 0) {
                        // self.jumpBuyVip(paramJson.focusIdx, paramJson.title);
                        // 非VIP用户且不具备免费观看时长，提示购买弹窗
                        if (G('dialog_wrap')) {
                            self.showPurchaseDialog(paramJson.focusIdx, paramJson.title);
                        } else {
                            self.jumpBuyVip(paramJson.focusIdx, paramJson.title);
                        }
                    } else {
                        G('debug').innerText = '系统报错!';
                    }
                });
            }
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
            objCurrent.setParam('videoTitle', paramJson.title);
            objCurrent.setParam('moveNum', TP.listMovePages);
            objCurrent.setParam('isVideoFree', TP.isVideoFree);

            var objPlayer = LMEPG.Intent.createIntent('player');
            objPlayer.setParam('videoInfo', JSON.stringify(paramJson));
            // 广西广电多传一个参数
            objPlayer.setParam('allVideoInfo', JSON.stringify([paramJson]));
            // 专辑传入专辑标识1和专辑别名
            objPlayer.setParam('albumName', TP.albumName);

            LMEPG.Intent.jump(objPlayer, objCurrent);
        },

        /** 跳转到其他专辑*/
        goAlbum: function (btn) {
            TP.focusIDName = btn.id;
            var self = btn.Obj;
            var objCurrent = self.getCurrentPage();
            var objAlbum = LMEPG.Intent.createIntent('album');
            var currentAlbum = G(btn.id).getAttribute('data-a');
            objAlbum.setParam('albumName', currentAlbum);
            objAlbum.setParam('inner', '1');
            objCurrent.setParam('focus_index', btn.id);
            if (currentAlbum === 'more') {
                self.jumpHomeTab('home');
            } else {
                LMEPG.Intent.jump(objAlbum, objCurrent);
            }

        },

        jumpHomeTab: function (tabName, focusIndex) {
            var objHomeTab = LMEPG.Intent.createIntent(tabName);
            objHomeTab.setParam('classifyId', '');
            objHomeTab.setParam('focusIndex', focusIndex);
            objHomeTab.setParam('tabId', 'tab-2');  // 中国联通专辑更多视频跳转的tabId

            LMEPG.Intent.jump(objHomeTab);
        },

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

        jumpVideoMore: function (btn) {
            var self = btn.Obj;
            // 中国联通/江苏电信跳转首页精选专辑tab
            if (TP.lmcid == '000051' || TP.lmcid == '320092' || TP.lmcid == '210092' || TP.lmcid == '450092') {
                self.morePageName = 'home';

            } else if (TP.lmcid == '630092') {
                self.morePageName = 'healthVideoList';
                self.backHomeTabNumber = 20;
            }

            if(TP.lmcid == '420092'){
                var objMoreVideo = LMEPG.Intent.createIntent('home');
                objMoreVideo.setParam('tabId', 'tab-2');  // 中国联通专辑更多视频跳转的tabId
                var objBack = LMEPG.Intent.createIntent(self.backPage);
                LMEPG.Intent.jump(objMoreVideo, objBack);

            }else {
                var objMoreVideo = LMEPG.Intent.createIntent(self.morePageName);
                objMoreVideo.setParam('classifyId', 1);
                objMoreVideo.setParam('modeTitle', '更多精彩');
                objMoreVideo.setParam('modeType', self.backHomeTabNumber);
                objMoreVideo.setParam('modelType', 4);
                objMoreVideo.setParam('currentTabIndex', 3);
                objMoreVideo.setParam('homeTabIndex', 5);
                objMoreVideo.setParam('pageCurrent', 1); // 内容页数
                objMoreVideo.setParam('navCurrent', 0);  // 导航焦点
                objMoreVideo.setParam('tabId', 'tab-2');  // 中国联通专辑更多视频跳转的tabId

                var objBack = LMEPG.Intent.createIntent(self.backPage);
                LMEPG.Intent.jump(objMoreVideo, objBack);
            }
        },

        showPurchaseDialog: function (focusId, videoTitle) {
            var buttons = [
                {
                    id: 'btn_purchase',
                    name: '立即订购',
                    type: 'img',
                    nextFocusLeft: 'btn_cancel_purchase',
                    nextFocusRight: 'btn_cancel_purchase',
                    nextFocusDown: '',
                    nextFocusUp: '',
                    backgroundImage: TP.commonImgPath + 'btn_purchase.png',
                    focusImage: TP.commonImgPath + 'btn_purchase_focus.png',
                    beforeMoveChange: '',
                    focusChange: '',
                    click: this.purchaseVIP,
                    focusId: focusId,
                    videoTitle: videoTitle,
                    Obj: this
                }, {
                    id: 'btn_cancel_purchase',
                    name: '取消订购',
                    type: 'img',
                    nextFocusLeft: 'btn_purchase',
                    nextFocusRight: 'btn_purchase',
                    nextFocusDown: '',
                    nextFocusUp: '',
                    backgroundImage: TP.commonImgPath + 'btn_cancel_purchase.png',
                    focusImage: TP.commonImgPath + 'btn_cancel_purchase_focus.png',
                    beforeMoveChange: '',
                    focusChange: '',
                    click: this.cancelPurchaseVIP,
                    Obj: this
                }
            ];

            var dialogHtml = '<img src="' + TP.commonImgPath + 'bg_purchase_dialog.png">';
            dialogHtml += '<img id="btn_purchase" src="' + TP.commonImgPath + 'btn_purchase_focus.png">';
            dialogHtml += '<img id="btn_cancel_purchase" src="' + TP.commonImgPath + 'btn_cancel_purchase.png">';

            G('dialog_wrap').innerHTML = dialogHtml;
            LMEPG.ButtonManager.addButtons(buttons);
            this.moveToFocus('btn_purchase');
        },

        purchaseVIP: function (btn) {
            var self = btn.Obj;
            self.jumpBuyVip(btn.focusId, btn.videoTitle);
        },

        cancelPurchaseVIP: function (btn) {
            var self = btn.Obj;
            if (TP.valueCountdown.showDialog == "1") {
                self.showCountdownDialog(false);
            } else {
                G('dialog_wrap').innerHTML = "";
                App.moveToFocus(TP.focusIDName);
            }
        },

        showCountdownDialog: function (isExitAlbum) {
            this.isExitAlbum = isExitAlbum;
            this.count = 8;
            var dialogHtml = '<img src="' + TP.commonImgPath + 'bg_countdown_dialog.png">';
            dialogHtml += '<div id="count">8</div>';
            G('dialog_wrap').innerHTML = dialogHtml;

            this.countInterval = setInterval(function () {
                G('count').innerHTML = String(--App.count);
                if (App.count == 0) {
                    clearInterval(App.countInterval);
                    // 调用后台接口，保存数据
                    var countdownValue = {
                        showDialog: "0"
                    };
                    App.saveData(TP.keyCountdown, JSON.stringify(countdownValue))
                }
            }, 1000);
        },

        saveData: function (key, value) {
            var postData = {
                "key": key,
                "value": value
            };
            LMEPG.UI.showWaitingDialog();

            LMEPG.ajax.postAPI('Common/saveData', postData,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        G('dialog_wrap').innerHTML = "";
                        if (data.result != 0) {
                            LMEPG.UI.showToast("上报数据异常！", 3);
                            App.moveToFocus(TP.focusIDName);
                        } else {
                            TP.isVideoFree = 1;
                            TP.valueCountdown.showDialog = "0";
                            // 跳转播放器播放第一条视频
                            var videoInfo = TP.videoData[1];
                            App.onClickVideoItem("focus-1", videoInfo);
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("解析数据异常！", 3);
                        console.log(e)
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报数据失败！", 3);
                }
            );
        },

        onBack: function () {
            // G('debug').innerHTML += 'onBack historyLength: ' + history.length + 'splashHistory: '+ TP.splashHistory + '<br/>'
            if (App.isExitAlbum && App.count > 0) {
                // 倒计时弹窗显示，直接返回当前专辑
                LMEPG.Intent.back();
            } else if (App.count > 0) {
                // 取消订购弹窗,8S倒计时未完成，停留专辑页面
                G('dialog_wrap').innerHTML = '';
                LMEPG.ButtonManager.requestFocus(TP.focusIDName);
            } else if (!Boolean(TP.vip) && TP.valueCountdown && TP.valueCountdown.showDialog == '1') {
                // 普通用户且未弹窗倒计时，倒计时弹窗
                App.showCountdownDialog(true);
            } else if (TP.lmcid == '450094' && TP.inner != 1) {
                // 广西广电局方大厅进入返回逻辑
                // var currentHistoryLength = history.length;
                // if (currentHistoryLength == TP.splashHistory){
                //     // 广西广电有的盒子按返回按键时，history.length和TP.splashHistory会相等
                //     currentHistoryLength++;
                // }
                var backLength = (TP.historyLength + 1) - TP.splashHistory;
                LMEPG.Log.info('--->album onBack: 当前历史步长currentHistoryLength: ' + TP.historyLength);
                LMEPG.Log.info('--->album onBack: 进入应用步长splashHistory: ' + TP.splashHistory);
                history.go(-backLength);
            } else if (TP.lmcid == '450094' && TP.inner == 0 && TP.fromLaunch == "1") {
                Utility.setValueByName("exitIptvApp");
            } else if (TP.lmcid == '630092' && TP.fromLaunch == "1") {
                Utility.setValueByName("exitIptvApp");
            } else if (TP.lmcid == '420092' && TP.fromLaunch == "1") {
                LMEPG.Intent.back('IPTVPortal');
                return;
            } else {
                if( typeof TP.areaCode != 'undefined'){
                    if(TP.carrierId =='000051' && TP.areaCode == '207'){
                        LMEPG.Intent.back('IPTVPortal');
                        return;
                    }
                }

                LMEPG.Intent.back();
            }
        }
    };
    window.onBack = module.onBack;
    window.App = module;
}(document));