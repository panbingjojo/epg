/****************************************************************
 * 播放器中涉及常量部分
 *****************************************************************/
var PLAY_EVENT_UP = "up";         // 按键--向上
var PLAY_EVENT_DOWN = "down";     // 按键--向下
var PLAY_EVENT_LEFT = "left";     // 按键--向左
var PLAY_EVENT_RIGHT = "right";   // 按键--向右

/****************************************************************
 * 播放器
 *****************************************************************/
var Player = {

    init: function () {
        // 初始化数据
        Player.initData();
        // 初始化UI
        Player.initUI();
        // 挽留页初始化
        DetainPage.init();
        // 初始化事件监听器
        PlayerKeyEventManager.registerSpecialKeys();
        // 开启播放器开始播放
        Player.play();
        if(RenderParam.carrierId == "371092" || RenderParam.carrierId == "371002"){
            var _type = RenderParam.videoInfo.type != undefined ? RenderParam.videoInfo.type : 0;
            var turnPageInfo = {
                currentPage: window.referrer,
                turnPage:location.href,
                turnPageName: document.title,
                turnPageId:"39_" + RenderParam.videoInfo.videoUrl,
                clickId:RenderParam.clickId,
                reserve1:"39_" + _type,
                reserve2:null
            };
            ShanDongHaiKan.sendReportData('6', turnPageInfo);
        }
    },

    initData: function () {
        if (RenderParam.videoInfo) {
            Player.videoTitle = RenderParam.videoInfo.title;
            Player.videoUrl = RenderParam.videoInfo.videoUrl;
            RenderParam.modelType =  LMEPG.Func.getLocationString('modelType'); //山东电信EPG增加小包进入类型
        }
    },

    initUI: function () {
        // 初始化标题
        G('video-title').innerHTML = Player.videoTitle;
    },

    play: function () {
        switch (RenderParam.carrierId) {
            case "370092":
            case "371092":
                if (typeof window.top.access !== 'undefined' && window.top.access !== null
                    && window.top.access.sendRequest !== undefined) {
                    top.access.sendRequest({
                        url: '/VSP/V3/PlayVOD',
                        body: JSON.stringify({
                            VODID: RenderParam.videoUrl,// 外部ID
                            mediaID: RenderParam.videoUrl.replace("_", "_M_"),//  通过queryVOD返回数据中mediaFiles下的code
                            IDType: '1'
                        })
                    }).then(function (resp) {
                        LMEPG.Log.info("PlayVOD Success >>> " + JSON.stringify(resp));
                        Player.playDefault(resp.body.playURL);
                        // 调用探针接口上报数据 1:进入 0：退出
                        var operateParams = {
                            "action": 1,
                            "contentId": RenderParam.videoUrl
                        };
                        LMEPG.ajax.postAPI("System/clickContentInfo", operateParams, LMEPG.emptyFunc, LMEPG.emptyFunc);
                    }, function (err) {
                        LMEPG.Log.info("PlayVOD fail >>> " + JSON.stringify(err));
                    });
                }
                break;
            default:
                Player.playDefault(Player.videoUrl);
                break;
        }
    },

    playDefault: function (videoUrl) {
        setTimeout(function () {
            // 初始化底层播放器
            LMEPG.mp.initPlayer();
            // 开启全屏播放
            LMEPG.mp.playOfFullscreen(videoUrl);
            // 开始设置进度条
            Player.Controller.startProgress();
        }, 500);
    },

    playByTime: function (second) {
        LMEPG.mp.playByTime(second);
    },

    pause: function () {
        LMEPG.mp.pause();
        Player.Controller.pause();
    },

    resume: function () {
        LMEPG.mp.resume();
        Player.Controller.play();
    },

    playEnd: function () {
        DetainPage.show('重播');         // 显示更多视频页
        Player.Controller.hide();                             // 隐藏进度条
        Player.release();                                   // 释放资源
    },

    getVideoInfo: function () {
        return {
            duration: LMEPG.mp.getMediaDuration(),
            playTime: LMEPG.mp.getCurrentPlayTime()
        }
    },

    release: function () {
        LMEPG.mp.destroy();
        // 清除定时器
        if (Player.Controller.progressTimer) {
            clearInterval(Player.Controller.progressTimer);
        }
    }
};

/****************************************************************
 * 播放器的控制栏
 *****************************************************************/
Player.Controller = {
    isShowing: false,
    seekSecond: -1,

    getTotalProgressLength: function () {
        return 888;
    },

    getIndicatorWidth: function () {
        return 12;
    },

    getSeekStep: function () {
        return 10;
    },

    show: function (isAutoHide) {
        Player.Controller.isShowing = true;
        Show('controller');
        Show('video-title');

        if (isAutoHide) {
            // 设置3秒之后自动隐藏
            Player.Controller.autoHideTimer = setTimeout(function () {
                Player.Controller.hide();
            }, 3 * 1000);//3秒钟后自动隐藏
        }
    },

    hide: function () {
        Player.Controller.isShowing = false;
        Hide('controller');
        Hide('video-title');
        if (Player.Controller.autoHideTimer) {
            clearTimeout(Player.Controller.autoHideTimer);
        }
    },

    startProgress: function () {
        //进入页面时，视频需要一定的加载时间
        setTimeout(function () {
            // 显示控制器
            Player.Controller.show(true);
            Player.Controller.moveProgressBar();

            Player.Controller.progressTimer = setInterval(function () {
                Player.Controller.moveProgressBar();
                Network.savePlayerProgress(JSON.stringify(RenderParam.videoInfo));
                // 检查免费时长 ，如果用户已经是vip，则不判断（isVip：1-是vip）
                if (RenderParam.isVip !== 1) {
                    Player.Controller.checkFreeTime();
                }
            }, 1000);//1秒刷新一次
        }, 2500);
    },

    fastForward: function () {
        // 取出“视频总时长、当前已播放时长”
        var videoInfo = Player.getVideoInfo();
        var duration = videoInfo['duration'];
        var playTime = videoInfo['playTime'];

        Player.Controller.seekSecond = parseFloat(playTime + Player.Controller.getSeekStep());
        if (Player.Controller.seekSecond >= (duration - 1)) {
            Player.Controller.seekSecond = parseFloat(duration - 1);
        }

        Player.Controller.showPreviewTime(Player.Controller.seekSecond, duration);
        Player.Controller.seekProgressBar(duration);
    },

    fastRewind: function () {
        // 取出“视频总时长、当前已播放时长”
        var videoInfo = Player.getVideoInfo();
        var duration = videoInfo['duration'];
        var playTime = videoInfo['playTime'];

        Player.Controller.seekSecond = parseFloat(playTime - Player.Controller.getSeekStep());
        if (Player.Controller.seekSecond < 0) {
            Player.Controller.seekSecond = 0;
        }
        Player.Controller.showPreviewTime(Player.Controller.seekSecond, duration);
        Player.Controller.seekProgressBar(duration);
    },

    seekProgressBar: function (duration) {
        var seekRate = Player.Controller.seekSecond / duration;
        var progressLength = Player.Controller.getTotalProgressLength() * seekRate;

        G('progress-layer').style.width = progressLength + 'px';
        G('progress-indicator').style.left = (progressLength - Player.Controller.getIndicatorWidth() / 2) + 'px';

        Player.Controller.seekTimer = setTimeout(function () {
            Player.playByTime(Player.Controller.seekSecond);
            clearTimeout(Player.Controller.seekTimer);
            Player.Controller.seekSecond = -1;
        }, 500);
    },

    moveProgressBar: function () {
        // 取出“视频总时长、当前已播放时长”
        var videoInfo = Player.getVideoInfo();
        var duration = videoInfo['duration'];
        var playTime = videoInfo['playTime'];

        G('duration').innerHTML = LMEPG.Func.formatTimeInfo(1, duration); //设置总时长
        var playTimeStr = LMEPG.Func.formatTimeInfo(1, playTime);//设置当前播放时间
        if (playTimeStr === '0-1:0-1') return; //表示读时间进度有问题，不给予更新时间
        G('play-time').innerHTML = playTimeStr;

        // 更新进度条UI比例效果
        var playRate = Player.Controller.calcPlayRate(playTime, duration);       //当前播放的比例，取值0-1
        var progressLength = playRate * Player.Controller.getTotalProgressLength();//进度条的长度
        if (Player.Controller.seekSecond < 0) { // 当前正在时移的过程中不对UI进行更新
            G('progress-layer').style.width = progressLength + 'px';
            if (progressLength > Player.Controller.getIndicatorWidth() / 2) {
                G('progress-indicator').style.left = (progressLength - Player.Controller.getIndicatorWidth() / 2) + 'px';
            }
        }

        // 防止当视频未加载完，用户按返回键已弹出挽留页，避免此时视频加载完回来继续播放，应当暂停播放
        if (DetainPage.isShowing) {
            Player.pause();
        }

        // 判断当前视频是否播放结束
        G("debug1").innerHTML = "playTime = " + playTime + ", duration = " + duration + " <br/>";
        if (playTime > 0 && duration > 0 && (playTime + 2) >= duration) {

            setTimeout(function () {
                Player.playEnd(true);
            }, 500);
        }
    },

    calcPlayRate: function (playTime, duration) {
        return duration > 0 && playTime >= 0 ? playTime / duration : 0;
    },

    pause: function () {
        G('play-status').src = g_appRootPath+ "/Public/img/hd/Player/V16/img_play.png";
    },

    play: function () {
        G('play-status').src =  g_appRootPath+"/Public/img/hd/Player/V16/img_pause.png";
    },

    showPreviewTime: function (playTime, duration) {
        G('preview-duration').innerHTML = LMEPG.Func.formatTimeInfo(1, duration); //设置总时长
        var playTimeStr = LMEPG.Func.formatTimeInfo(1, playTime);//设置当前播放时间
        if (playTimeStr === '0-1:0-1') return; //表示读时间进度有问题，不给予更新时间
        G('preview-play-time').innerHTML = playTimeStr;
        Show("time-preview");

        // 设置3秒之后自动隐藏
        Player.Controller.previewTimer = setTimeout(function () {
            Hide("time-preview");
        }, 1000);//3秒钟后自动隐藏
    },

    /**
     * 当用户为非vip(RenderParam.isVip=0/1表示VIP)且只有vip(RenderParam.userType==2)才可看时：
     * 检测免费时长，如果免费时长到了，就直接跳到局方计费页
     */
    checkFreeTime: function () {
        // 如果视频是vip才可以看，否则要判断免费播放时长。（userType：（0-不限，1-普通用户可看, 2-vip可看））
        // console.log("Player.js-checkFreeTime()>>>cTime: " + this.currentPlayTimes + " - fTime: " + RenderParam.freeSeconds);
        if (parseInt(RenderParam.userType) == 2) {
            var playTime = LMEPG.mp.getCurrentPlayTime();
            //debug1('当前播放时刻: ' + playTime + ' s');
            if (playTime >= RenderParam.freeSeconds) {
                clearInterval(Player.Controller.progressTimer); // 释放定时器
                LMEPG.mp.destroy();
                DetainPage.checkUserOrderStatus(RenderParam.videoInfo);
            }
        }
    },
};


/****************************************************************
 * 挽留页对象
 *****************************************************************/
var DetainPage = {
    isShowing: false,

    buttons: [],

    init: function () {
        DetainPage.initRecommendVideoInfo();
        DetainPage.initButtons();
        DetainPage.setCollectBtnUI();
    },

    initButtons: function () {
        DetainPage.buttons.push({
            id: 'collect',
            name: '收藏',
            type: 'img',
            nextFocusUp: 'focus-0',
            nextFocusDown: '',
            nextFocusLeft: '',
            nextFocusRight: 'replay',
            backgroundImage: g_appRootPath+ '/Public/img/hd/Player/V13/btn_collect.png',
            focusImage:  g_appRootPath+'/Public/img/hd/Player/V13/btn_collect_f.png',
            click: DetainPage.eventHandler,
            beforeMoveChange: ''
        }, {
            id: 'replay',
            name: '重播/继续播放',
            type: 'img',
            nextFocusUp: 'focus-1',
            nextFocusDown: '',
            nextFocusLeft: 'collect',
            nextFocusRight: 'back',
            backgroundImage: g_appRootPath+ '/Public/img/hd/Player/V13/btn_replay.png',
            focusImage: g_appRootPath+ '/Public/img/hd/Player/V13/btn_replay_f.png',
            click: DetainPage.eventHandler,
            focusChange: '',
            beforeMoveChange: ''
        }, {
            id: 'back',
            name: '返回/退出',
            type: 'img',
            nextFocusUp: 'focus-2',
            nextFocusDown: '',
            nextFocusLeft: 'replay',
            nextFocusRight: '',
            backgroundImage: g_appRootPath+ '/Public/img/hd/Player/V13/btn_back.png',
            focusImage:  g_appRootPath+'/Public/img/hd/Player/V13/btn_back_f.png',
            click: DetainPage.eventHandler,
            focusChange: '',
            beforeMoveChange: ''
        }, {
            id: 'focus-0',
            name: '',
            type: 'div',
            nextFocusUp: '',
            nextFocusDown: 'collect',
            nextFocusLeft: '',
            nextFocusRight: 'focus-1',
            backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath+'/Public/img/sd/Unclassified/V13/video_f.png' : g_appRootPath+'/Public/img/hd/Player/V13/video_f.png',
            click: DetainPage.eventHandler,
            // focusChange: this.toggleMarquee,
            beforeMoveChange: ''
        }, {
            id: 'focus-1',
            name: '',
            type: 'div',
            nextFocusUp: '',
            nextFocusDown: 'replay',
            nextFocusLeft: 'focus-0',
            nextFocusRight: 'focus-2',
            backgroundImage:g_appRootPath+ '/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath+'/Public/img/sd/Unclassified/V13/video_f.png' : g_appRootPath+'/Public/img/hd/Player/V13/video_f.png',
            click: DetainPage.eventHandler,
            // focusChange: this.toggleMarquee,
            beforeMoveChange: ''
        }, {
            id: 'focus-2',
            name: '',
            type: 'div',
            nextFocusUp: '',
            nextFocusDown: 'back',
            nextFocusLeft: 'focus-1',
            nextFocusRight: '',
            backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ?g_appRootPath+ '/Public/img/sd/Unclassified/V13/video_f.png' : g_appRootPath+'/Public/img/hd/Player/V13/video_f.png',
            click: DetainPage.eventHandler,
            // focusChange: this.toggleMarquee,
            beforeMoveChange: ''
        }, {
            id: 'prev-video-item',
            name: '',
            type: 'img',
            nextFocusUp: '',
            nextFocusDown: '',
            nextFocusLeft: '',
            nextFocusRight: 'continue-play',
            backgroundImage: g_appRootPath+ '/Public/img/hd/Player/V13/prev_video_item.png',
            focusImage:  g_appRootPath+'/Public/img/hd/Player/V13/prev_video_item_f.png',
            click: '',
            focusChange: '',
            beforeMoveChange: ''
        }, {
            id: 'tip-press-sure-pay',
            name: '支付提示',
            click: ''
        }, {
            id: 'default_link',
            name: '',
            type: 'img',
        });
        // 初始化按钮
        LMEPG.ButtonManager.init('default_link', DetainPage.buttons, "", true);
    },

    eventHandler: function (btn) {
        
        switch (btn.id) {
            // 挽留页1-3推荐位
            case 'focus-0':
            case 'focus-1':
            case 'focus-2':
                DetainPage.playVideo(btn);
                break;
            // 挽留页底部按钮：重播/继续播放、收藏/取消收藏、退出
            case 'replay':
                DetainPage.resumeOrReplay();
                break;
            case 'collect':
                var expectedStatus = RenderParam.collectStatus == 1 ? 0 : 1;  //改变收藏状态
                //添加收藏
                if(RenderParam.carrierId == "371092" || RenderParam.carrierId == "371002"){
                    DetainPage.haiKanHoleStat(expectedStatus);
                }
                DetainPage.setCollectStatus(RenderParam.sourceId, expectedStatus);
                break;
            case 'back':
                PlayerKeyEventManager.jumpBack();
                break;
        }
    },


    /**
     * 加载推荐位视频数据（即挽留页显示的1-3号位视频数据）
     */
    initRecommendVideoInfo: function () {
        var postData = {
            'userId': RenderParam.userId
        };
        if (RenderParam.carrierId === '370092') { // 山东电信需要获取小包的视频内容
            var modelType = LMEPG.Func.getLocationString('modelType');
            if(modelType) {
                postData.modelType = modelType;
            }
        }

        LMEPG.ajax.postAPI('Player/getRecommendVideoInfo', postData, function (rsp) {
            // 请求成功
            try {
                var gqPlayUrl = {};
                var bqPlayUrl = {};
                var title = {};
                var image_url = {};
                var userType = {};
                var sourceId = {};
                var freeTimes = {};
                var showStatus = {};
                var type = {};

                var recommendData = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (LMEPG.Func.isObject(recommendData)) {
                    if (!LMEPG.Func.isArray(recommendData.data) || recommendData.data.length <= 0) {
                        return;
                    }

                    for (var i = 0; i < recommendData.data.length; i++) {
                        // 接口返回了4条数据，只需要3条
                        if (i !== 3) {
                            gqPlayUrl[i] = eval('(' + recommendData.data[i].ftp_url + ')').gq_ftp_url;
                            bqPlayUrl[i] = eval('(' + recommendData.data[i].ftp_url + ')').bq_ftp_url;
                            title[i] = recommendData.data[i].title;
                            image_url[i] = recommendData.data[i].image_url;
                            userType[i] = recommendData.data[i].user_type;
                            sourceId[i] = recommendData.data[i].source_id;
                            type[i] = recommendData.data[i].type;
                            freeTimes[i] = recommendData.data[i].free_seconds;
                            showStatus[i] = recommendData.data[i].show_status;
                            G('recommend-title-' + i).innerHTML = title[i];
                            G('recommend-img-' + i).src = RenderParam.imgHost + image_url[i];
                            G('focus-' + i).setAttribute('gqPlayUrl', gqPlayUrl[i]);
                            G('focus-' + i).setAttribute('bqPlayUrl', bqPlayUrl[i]);
                            G('focus-' + i).setAttribute('user_type', userType[i]);
                            G('focus-' + i).setAttribute('sourceId', sourceId[i]);
                            G('focus-' + i).setAttribute('type', type[i]);
                            G('focus-' + i).setAttribute('title', title[i]);
                            G('focus-' + i).setAttribute('freeSeconds', freeTimes[i]);
                            G('focus-' + i).setAttribute('show_status', freeTimes[i]);
                        }
                    }
                } else {
                    throw 'The parsed result "RecommendData" is not an Object!';
                }
            } catch (e) {
                console.error('推荐视频数据处理异常：' + e.toString());
                LMEPG.Log.error('推荐视频数据处理异常：' + e.toString());
                LMEPG.UI.showToast('推荐视频数据处理异常：' + e.toString());
            }
        }, function (rsp) {
            // 请求出错
        });
    },

    show: function (replayText, focusID) {
        DetainPage.isShowing = true;
        S("recommend-page");
        if (focusID) {
            LMEPG.ButtonManager.requestFocus(focusID);
        } else {
            LMEPG.ButtonManager.requestFocus('focus-0');
        }
        if (replayText && replayText !== "") {
            // 播放结束后，推荐页面的按钮修改为“重播”
            G('playText').innerHTML = replayText;
        }
    },

    hide: function () {
        DetainPage.isShowing = false;
        H("recommend-page");
    },

    /**
     * 设置收藏按钮显示
     */
    setCollectBtnUI: function () {
        if (RenderParam.collectStatus == 1) {
            G('collectStatus').innerHTML = '收藏';
        } else {
            G('collectStatus').innerHTML = '取消收藏';
        }
    },
    //海看坑位统计
    haiKanHoleStat: function (expectedStatus) {
        var turnPageInfo = {
            VODCODE: "39_" + RenderParam.videoInfo.videoUrl,
            VODNAME: RenderParam.videoInfo.title,
            mediastatus: expectedStatus,
            reserve1: null,
            reserve2 : null,
            from:"jz3.0"
        };
        ShanDongHaiKan.sendReportData('8', turnPageInfo);
    },
/**
     * 收藏与取消收藏
     * @param sourceId
     * @param expectedStatus
     */
    setCollectStatus: function (sourceId, expectedStatus) {
        var postData = {
            'source_id': sourceId,
            'status': expectedStatus
        };
        LMEPG.ajax.postAPI('Collect/setCollectStatus', postData, function (rsp) {
            // 请求成功
            try {
                var jsonObj = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (jsonObj && jsonObj.result == 0) {
                    RenderParam.collectStatus = expectedStatus;
                    // 设置收藏按钮显示
                    DetainPage.setCollectBtnUI();
                } else {
                    LMEPG.UI.showToast((expectedStatus == 1 ? '取消收藏失败！' : '收藏失败！') + '[' + (jsonObj ? jsonObj.result : jsonObj) + ']');
                }
            } catch (e) {
                LMEPG.UI.showToast('发生异常，操作失败！');
                LMEPG.Log.error('-------setCollectStatus------- exception: ' + e.toString());
            }
        }, function (rsp) {
            // 请求失败
        });
    },

    /** 重播 或 继续播放 */
    resumeOrReplay: function () {
        if (G('playText').innerHTML === '继续播放') {
            Player.resume();
            DetainPage.hide();
            // Player.Controller.show(true);
        } else {
            // 重播时，把历史播放进度置0
            RenderParam.videoInfo.lastedPlaySecond = 0;
            var objPlayer = LMEPG.Intent.createIntent("player");
            objPlayer.setParam("userId", RenderParam.userId);
            objPlayer.setParam("videoInfo", JSON.stringify(RenderParam.videoInfo));
            if (!LMEPG.Func.isEmpty(RenderParam.subjectId)) {
                objPlayer.setParam('subjectId', RenderParam.subjectId);
            }
            LMEPG.Intent.jump(objPlayer, null, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
        }
    },

    /** 点击播放挽留页推荐视频之一 */
    playVideo: function (btn) {
        var btnId = btn.id;
        //得到播放地址
        var videoInfo = {
            'sourceId': G(btnId).getAttribute('sourceId'),
            'videoUrl': G(btnId).getAttribute(RenderParam.platformType === 'hd' ? 'gqPlayUrl' : 'bqPlayUrl'),
            'title': G(btnId).getAttribute('title'),
            'type': G(btnId).getAttribute('type'),
            'userType': G(btnId).getAttribute('user_type'),
            'freeSeconds': G(btnId).getAttribute('freeSeconds'),
            'entryType': 1,
            'entryTypeName': 'play',
            'show_status': G(btnId).getAttribute('show_status'),
        };
        if (videoInfo.show_status == '3') {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }

        G('debug1').innerHTML += "videoInfo --> " + JSON.stringify(videoInfo) + " <br/>";
        if (!videoInfo.userType && !videoInfo.sourceId) {
            LMEPG.UI.showToast('播放错误：无效的视频资源！');
            return;
        }
        //=================================================================//
        //  视频的播放策略（userType：0-不限，1-普通用户可看, 2-vip可看）  //
        //=================================================================//
        LMEPG.Log.info('play recommend videoInfo:' + JSON.stringify(videoInfo));
        if (DetainPage.allowPlayVideo(videoInfo)) {
            // 直接播放推荐视频
            Page.jumpPlayVideo(videoInfo);
        } else {
            DetainPage.checkUserOrderStatus(videoInfo);
        }
    },

    checkUserOrderStatus: function (videoInfo) {
        if (RenderParam.isForbidOrder == '1') { // 如果isForbidOrder = 1，表示不允许订购，直接返回
            LMEPG.UI.showToast("您已受限订购该业务，暂时不能订购!", 3);
            window.setTimeout(function () {
                LMEPG.Intent.back();
            }, 3000);
        } else {
            // “非VIP用户” 且 “仅限VIP用户” 且 “免费试看时长为0”，则直接跳转到VIP限制订购
            Page.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },

    /**
     * 判断当前用户是否可以直接观看指定视频（包括试看），如果不能需要先去订购VIP。
     * <pre><span style="color:#FFFF00">
     *     播放规则：
     *          1. 若视频播放策略（userType）值为2（仅vip可看）：
     *                  1.1 VIP可直接播放观看。
     *                  1.2 非VIP需要再次校验提供的免费试看时长是否大于0，即 freeSeconds>0 才可播放试看。否则，需要先跳转到局方订购页买VIP。
     *          2. 若视频播放策略（userType）值为0（不限用户）或者1（至少是普通用户条件）：可直接免费观看，没有试看一说。
     * </span></pre>
     * @param playVideoFreeSeconds 指定视频配置的可免费试看时长（秒）
     * @return boolean             true：表示不能直接播放视频，需要先去局方订购VIP。false：表示可以播放视频
     */
    allowPlayVideo: function (videoInfo) {
        if (RenderParam.isVip || (RenderParam.carrierId == '370092' && RenderParam.modelType)) {    // vip用户可播放观看、山东电信小包进入用户也可观看
            return true;
        } else {        // 非vip用户可播放观看的前提是：不限vip用户 或者 有免费试看时长
            var isOnlyVIPPlay = videoInfo.userType == 2; // 0-不限，1-普通用户可看，2-仅限VIP用户可看（普通用户需要检查免费时长）
            return !isOnlyVIPPlay || videoInfo.freeSeconds > 0;
        }
    },
};

/****************************************************************
 * 按键监听控制
 *****************************************************************/
var PlayerKeyEventManager = {

    /** 返回上一页 */
    jumpBack: function () {
        if (RenderParam.carrierId == '370092') {
            // 调用探针接口上报数据 1:进入 0：退出
            var operateParams = {
                "action": 2,
                "contentId": RenderParam.videoUrl
            };
            LMEPG.ajax.postAPI("System/clickContentInfo", operateParams,  function (){
                LMEPG.Intent.back();
            },function (){
                LMEPG.Intent.back();
            });
        } else {
            LMEPG.Intent.back();
        }
    },

    /** 返回上一页（延时） */
    jumpBackDelay: function (second) {
        setTimeout(function () {
            LMEPG.Intent.back();
        }, second * 1000);
    },

    /** 返回键
     *
     *  默认功能： 如果显示挽留页
     * */
    onBack: function () {
        if (DetainPage.isShowing) {
            PlayerKeyEventManager.jumpBack();
        } else {
            Player.pause();
            Player.Controller.hide();
            DetainPage.show("", 'replay');
        }
    },

    /** 上键。*/
    onKeyUp: function (currentBtnObj) {

    },

    /** 下键。*/
    onKeyDown: function (currentBtnObj) {

    },

    /** 左键。*/
    onKeyLeft: function (currentBtnObj) {
        switch (LMEPG.mp.getPlayerState()) {
            case LMEPG.mp.State.PLAY:
                break;
            case LMEPG.mp.State.PAUSE:
                break;
            case LMEPG.mp.State.FAST_REWIND:
                break;
            case LMEPG.mp.State.FAST_FORWARD:
                break;
        }
    },

    /** 右键。*/
    onKeyRight: function (currentBtnObj) {
        switch (LMEPG.mp.getPlayerState()) {
            case LMEPG.mp.State.PLAY:
                break;
            case LMEPG.mp.State.PAUSE:
                break;
            case LMEPG.mp.State.FAST_REWIND:
                break;
            case LMEPG.mp.State.FAST_FORWARD:
                break;
        }
    },

    /** “确定”按键 */
    onEnterKeyClicked: function () {
        if (DetainPage.isShowing) {
            var currentButton = LMEPG.ButtonManager.getCurrentButton();
            DetainPage.eventHandler(currentButton);
        } else {
            PlayerKeyEventManager.onKeyClicked();
        }

    },

    onKeyClicked: function () {
        switch (LMEPG.mp.getPlayerState()) {
            case LMEPG.mp.State.PLAY:
                Player.pause();
                Player.Controller.show(false);
                break;
            case LMEPG.mp.State.PAUSE:
                Player.resume();
                Player.Controller.show(true);
                break;
            case LMEPG.mp.State.FAST_REWIND:
                PlayerKeyEventManager.onSpeedChanged(KEY_RIGHT);
                break;
            case LMEPG.mp.State.FAST_FORWARD:
                PlayerKeyEventManager.onSpeedChanged(KEY_LEFT);
                break;
        }
    },

    /** “静音”按键 */
    onMuteKeyClicked: function () {
        LMEPG.mp.toggleMuteFlag();
    },

    /** “虚拟”按键 */
    onVirtualKeyClicked: function () {
        var oEvent = Utility.getEvent();
        var keyCode = oEvent.type;

        if (!LMEPG.mp.bind(oEvent)) {
            return;
        }
        if (LMEPG.mp.isEnd(keyCode)) { //播放结束
            Player.playEnd();
        } else if (LMEPG.mp.isError(keyCode)) {// 播放错误
        } else if (LMEPG.mp.isBeginning(keyCode)) { // 视频播放准备开始
        } else { // 修正当弹出推荐视频后，当视频数据缓冲结束会自动播放视频的问题
            // LMEPG.mp.pause();
        }
    },

    /** “音量+/-”按键 */
    onVolumeChanged: function (dir) {
        switch (dir) {
            case PLAY_EVENT_UP:
                LMEPG.UI.showToast("音量+");
                LMEPG.mp.upVolume();
                break;
            case PLAY_EVENT_DOWN:
                LMEPG.UI.showToast("音量-");
                LMEPG.mp.downVolume();
                break;
        }
    },

    /** “快进/快退”按键。dir：left|right */
    onSpeedChanged: function (dir) {
        // 如果播放器正在播放，快进或快退过程会一直持续。如果播放器暂停状态，快进或快退时，一段时间后就正常播放了，
        // 所以暂停状态快进或快退时，先让播放器正常播放，这样流程才正常
        var playerState = LMEPG.mp.getPlayerState();
        if (playerState === LMEPG.mp.State.PAUSE) {
            Player.resume(); // 去播放
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        switch (dir) {
            case PLAY_EVENT_LEFT:  // 快退
                Player.Controller.show(true);
                Player.Controller.fastRewind();
                break;
            case PLAY_EVENT_RIGHT: // 快进
                Player.Controller.show(true);
                Player.Controller.fastForward();
                break;
        }
    },

    /** “上/下/左/右”按键。dir必为之一：up/down/left/right */
    onDirectionKeyMoved: function (dir) {
        if (DetainPage.isShowing) {
            LMEPG.ButtonManager._onMoveChange(dir);
        } else {
            PlayerKeyEventManager.onKeyMoved(dir);
        }
    },

    onKeyMoved: function (dir) {
        // 播放状态：非挽留页。根据需要自定义行为。
        switch (dir) {
            case PLAY_EVENT_UP:
                Player.Controller.show(true);
                break;
            case PLAY_EVENT_DOWN:
                Player.Controller.hide();
                break;
            case PLAY_EVENT_LEFT:
            case PLAY_EVENT_RIGHT:
                PlayerKeyEventManager.onSpeedChanged(dir);
                break;
        }
    },

    /** 注册监听特殊按键 */
    registerSpecialKeys: function () {
        LMEPG.KeyEventManager.init();
        LMEPG.KeyEventManager.addKeyEvent(
            {
                KEY_BACK: 'PlayerKeyEventManager.onBack()',                                   // 返回
                KEY_ENTER: 'PlayerKeyEventManager.onEnterKeyClicked()',                        // 确定
                KEY_MUTE: 'PlayerKeyEventManager.onMuteKeyClicked()',                         // 静音
                KEY_VIRTUAL_EVENT: 'PlayerKeyEventManager.onVirtualKeyClicked()',                      // 虚拟按键
                EVENT_MEDIA_END: 'PlayerKeyEventManager.onVirtualKeyClicked()',                      // 虚拟按键
                EVENT_MEDIA_ERROR: 'PlayerKeyEventManager.onVirtualKeyClicked()',                      // 虚拟按键
                KEY_VOL_UP: 'PlayerKeyEventManager.onVolumeChanged("' + PLAY_EVENT_UP + '")',        // 音量+
                KEY_VOL_DOWN: 'PlayerKeyEventManager.onVolumeChanged("' + PLAY_EVENT_DOWN + '")',      // 音量+
                KEY_DELETE: 'PlayerKeyEventManager.onBack()',                                   // 兼容辽宁华为EC2108V3H的删除键（返回键）
                KEY_FAST_FORWARD: 'PlayerKeyEventManager.onSpeedChanged("' + PLAY_EVENT_RIGHT + '")',      // 快进>>
                KEY_FAST_REWIND: 'PlayerKeyEventManager.onSpeedChanged("' + PLAY_EVENT_LEFT + '")',       // 快退<<
                KEY_UP: 'PlayerKeyEventManager.onDirectionKeyMoved("' + PLAY_EVENT_UP + '")',    // 上键
                KEY_DOWN: 'PlayerKeyEventManager.onDirectionKeyMoved("' + PLAY_EVENT_DOWN + '")',  // 下键
                KEY_LEFT: 'PlayerKeyEventManager.onDirectionKeyMoved("' + PLAY_EVENT_LEFT + '")',  // 左键
                KEY_RIGHT: 'PlayerKeyEventManager.onDirectionKeyMoved("' + PLAY_EVENT_RIGHT + '")', // 右键
                KEY_EXIT: 'PlayerKeyEventManager.jumpBack()'                                  // 退出按键
            }
        );
    }
};

/****************************************************************
 * 页面跳转控制
 *****************************************************************/
var Page = {
    /** 得到当前页对象 */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('player');
        objCurrent.setParam('userId', RenderParam.userId);
        objCurrent.setParam('videoInfo', JSON.stringify(RenderParam.videoInfo));
        objCurrent.setParam('subjectId', RenderParam.subjectId);
        return objCurrent;
    },

    /** 页面跳转 - 播放器 */
    jumpPlayVideo: function (videoInfo) {
        var objCurrent = this.getCurrentPage();

        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));
        if (!LMEPG.Func.isEmpty(RenderParam.subjectId)) {
            objPlayer.setParam('subjectId', RenderParam.subjectId);
        };
        // 山东电信小包播放视频增加入参
        if(RenderParam.carrierId == '370092' && typeof (RenderParam.modelType) != 'undefined'){
            objPlayer.setParam('modelType', RenderParam.modelType);
        };
        LMEPG.Intent.jump(objPlayer, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 页面跳转 -  购买vip页
     * @param remark
     */
    jumpBuyVip: function (remark, videoInfo) {
        var objCurrent = this.getCurrentPage();
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('userId', RenderParam.userId);
        objOrderHome.setParam('isPlaying', '1');
        if (remark) {
            objOrderHome.setParam("remark", remark);
        }

        LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
};

/**
 * 网络请求
 */
var Network = {

    /**
     * 保存用户播放进度
     */
    savePlayerProgress: function (value, callback) {
        var postData = {
            "key": "EPG-LWS-LATEST-VIDEOINFO-" + RenderParam.carrierId + "-" + RenderParam.userId,
            "value": value
        };
        LMEPG.ajax.postAPI('Activity/saveStoreData', postData, function (rsp) {
            console.log(rsp);
            if (callback)
                callback();
        });
    },
};