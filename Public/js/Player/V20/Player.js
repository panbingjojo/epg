// 调试代码：上线保证该变量关闭！！！
var debug_mode = false;
var times = Date.parse(new Date());
function debug1(msg) {
    if (!debug_mode) return;
    var debug1 = G('debug1');
    if (!debug1) return;

    debug1.style.display = 'block';
    debug1.innerHTML =
        '*地区编号： ' + RenderParam.carrierId +
        '<br/>*盒子型号：' + LMEPG.STBUtil.getSTBModel() + '（高清）' +
        '<br/><div class="debug-divider" style="width:100%;height:1px;background-color:red;margin: 7px 0"></div>' +
        '*' + (RenderParam.isVip == 1 ? 'VIP用户' : '普通用户') + '：播放策略[' + RenderParam.userType + ']' +
        '<br/>*视频名称[id]：' + RenderParam.videoInfo.title + '[' + RenderParam.sourceId + ']' +
        '<br/>*视频地址：' + RenderParam.videoUrl +
        '<br/>*试看时长：共 ' + RenderParam.freeSeconds + ' s';
    if (msg) {
        debug1.innerHTML = debug1.innerHTML + '<br/><div class="debug-divider" style="width:100%;height:1px;background-color:red;margin: 7px 0"></div>*' + msg;
    }
}

function debug2(msg) {
    if (!debug_mode) return;
    var debug2 = G('debug2');
    if (!debug2) return;

    debug2.style.display = 'block';
    if (!debug2.innerHTML) {
        debug2.innerHTML = '';
    }
    debug2.innerHTML = (debug2.innerHTML ? debug2.innerHTML + '<br/>' : '') + '→ ' + msg;
    debug2.scrollTop = debug2.scrollHeight;
}

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
        debug1();
        // 开启播放器开始播放
        debug2("play start");
        Player.playDefault(Player.videoUrl);
        //跳转促进页面
        if(LMEPG.Func.getLocationString('remark') =='homeJump'){
          //  LmOrderConf.checkOrderHome();
            // Page.checkOrderHome();
            Page.jumpBuyVip('remark');

        }
    },

    initData: function () {
        if (RenderParam.videoInfo) {
            Player.videoTitle = RenderParam.videoInfo.title;
            Player.videoUrl = RenderParam.videoInfo.videoUrl;
        }
    },

    initUI: function () {
        // 初始化标题
        G('video-title').innerHTML = Player.videoTitle;
    },

    /*play: function () {
        switch (RenderParam.carrierId) {
            case "370092":
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
                        Player.playDefault(resp.body.playURL)
                    }, function (err) {
                        LMEPG.Log.info("PlayVOD fail >>> " + JSON.stringify(err));
                    });
                }
                break;
            default:
                Player.playDefault(Player.videoUrl);
                break;
        }
    },*/

    playDefault: function (videoUrl) {
        setTimeout(function () {
            var stbModel = LMEPG.STBUtil.getSTBModel();
            debug2("playDefault stbModel >>> " + stbModel);
            // 初始化底层播放器
            //if (stbModel == "IP506H_54U3" || stbModel == "PTV-8698"){
            //    LMMediaPlayer.initPlayerByBind();
            //}else {
            LMMediaPlayer.init();
            //}
            // 开启全屏播放
            LMMediaPlayer.play(videoUrl);

            // 开始设置进度条
            Player.Controller.startProgress();

        }, 500);
    },

    playByTime: function (second) {
        LMMediaPlayer.playByTime(second);
    },

    pause: function () {
        LMMediaPlayer.pause();
        Player.Controller.pause();
    },

    resume: function () {
        LMMediaPlayer.resume();
        Player.Controller.play();
    },

    playEnd: function () {
        DetainPage.show('重播');         // 显示更多视频页
        Player.Controller.hide();                             // 隐藏进度条
        Player.release();                                   // 释放资源
    },

    getVideoInfo: function () {
        return {
            duration: LMMediaPlayer.getMediaDuration(),
            playTime: LMMediaPlayer.getCurrentPlayTime()
        }
    },

    release: function () {
        LMMediaPlayer.destroy();
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
                // 保留当前播放进度
                // Network.savePlayerProgress(JSON.stringify(RenderParam.videoInfo));
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

        RenderParam.videoInfo.lastedPlaySecond = playTime;

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
        // G("debug1").innerHTML = "playTime = " + playTime + ", duration = " + duration + " <br/>";
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
        G('play-status').src = g_appRootPath+ "/Public/hd/img/Player/V1/img_play.png";
    },

    play: function () {
        G('play-status').src = g_appRootPath+ "/Public/hd/img/Player/V1/img_pause.png";
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
            var playTime = LMMediaPlayer.getCurrentPlayTime();
            //debug1('当前播放时刻: ' + playTime + ' s');
            if (playTime >= RenderParam.freeSeconds) {
                clearInterval(Player.Controller.progressTimer); // 释放定时器
                //Q21_hnylt型号盒子视频停止报错
                if(RenderParam.carrierId == '10000051' && LMEPG.STBUtil.getSTBModel() == 'Q21_hnylt'){
                    DetainPage.checkUserOrderStatus(RenderParam.videoInfo);
                    LMMediaPlayer.destroy();
                }else{
                    LMMediaPlayer.destroy();
                    DetainPage.checkUserOrderStatus(RenderParam.videoInfo);
                }
            }
        }
    },
};

/****************************************************************
 * 底层播放器对象 -- 由于lmplayer.js文件中导致部分盒子适配出现问题，顾抽离到当前页面
 *****************************************************************/
var LMMediaPlayer = {

    mediaPlayer: null,
    playState: "",
    videoDuration: 0,
    muteFlag: 0,
    instanceID: null,
    isBindMode: false,
    nativeInstanceId: 0,

    State: {
        PLAY: "play",                           //正常播放
        PAUSE: "pause",                         //暂停
        FAST_REWIND: "fastRewind",              //倍速快退
        FAST_FORWARD: "fastForward",            //倍速快进
        END: "end",                             //结束
    },

    init: function () {
        var mp = new MediaPlayer();                               // 创建播放实例
        mp.bindNativePlayerInstance(0);
        var instanceId = LMMediaPlayer.nativeInstanceId = mp.getNativePlayerInstanceID();      // 本地播放器实例
        var playListFlag = 0;                                   // 0、单媒体播放  1、多媒体播放
        var videoDisplayMode = 1;                               // 显示模式：0、自定义尺寸 1、全屏(默认) 2、按宽度显示 3、按高度显示 255、不显示在背后播放
        var height = 1280;                                       // 播放窗口的高度
        var width = 720;                                        // 播放窗口的宽带
        var left = 0;                                          // 播放窗口到浏览器左边的距离，自定义尺寸必须指定
        var top = 0;                                           // 播放窗口到浏览器顶部的距离，自定义尺寸必须指定
        var muteFlag = 0;                                       // 静音标志： 0、有声(默认) 1、静音
        var useNativeUIFlag = 1;                                // 本地UI显示标志: 0、不使用本地自带UI 1、使用本地自带UI(默认)
        var subtitleFlag = 0;                                   // 字幕显示标志：0、不显示字幕(默认) 1、显示字幕
        var videoAlpha = 0;                                     // 透明度设置（0-100）：  0、不透明(默认) 100、完全透明
        var cycleFlag = 1;                                      // 循环播放标志：0、循环播放（默认值）, 1、单次播放
        var randomFlag = 0;                                     // 随机播放标志
        var autoDelFlag = 0;                                    // 自动删除标志
        mp.initMediaPlayer(instanceId, playListFlag, videoDisplayMode,
            height, width, left, top, muteFlag,
            useNativeUIFlag, subtitleFlag, videoAlpha,
            cycleFlag, randomFlag, autoDelFlag);
        mp.leaveChannel();                                    // 离开直播频道
        mp.setAllowTrickmodeFlag(0);                          // 是否允许播放期间TrickMode操作： 0、允许 1、不允许(默认值)
        mp.setProgressBarUIFlag(0);                           // 是否显示自带进度条UI： 0、不显示 1、显示（默认）
        mp.setAudioVolumeUIFlag(1);                           // 是否显示自带音量UI，0、不显示   1、显示（默认值）
        LMMediaPlayer.mediaPlayer = mp;
        debug2("init NativePlayerInstanceID >>> " + instanceId);
    },

    // 默认实例初始化：绑定方式
    initPlayerByBind: function () {
        if (typeof MediaPlayer === "undefined") {
            return;
        }
        var mp = new MediaPlayer();
        var instance = LMMediaPlayer.nativeInstanceId = mp.getNativePlayerInstanceID();
        mp.bindNativePlayerInstance(0);
        mp.bindNativePlayerInstance(instance);
        mp.setAllowTrickmodeFlag(0);
        mp.setProgressBarUIFlag(0);
        mp.setAudioVolumeUIFlag(1);
    },

    play: function (mediaUrl) {
        // var formatUrl = LMEPG.Func.http2rtsp(mediaUrl);//特别注意：该地区默认使用转换为rtsp格式
        var stbType = LMEPG.STBUtil.getSTBModel();
        var protocol = mediaUrl.substring(0, 4);
        if (stbType.indexOf('B860A') >= 0
            // || stbType.indexOf('B700V2US1') >= 0
            || stbType.indexOf('HG680') >= 0
            || stbType.indexOf('BV310') >= 0
            || stbType.indexOf('PTV-8698') >= 0
            || stbType.indexOf('IP108H') >= 0) {
            if (protocol === "rtsp") {
                mediaUrl = mediaUrl.replace("rtsp://", "http://");
            }
        } else if (protocol === "http") {
            mediaUrl = mediaUrl.replace("http://", "rtsp://");
        }
        debug2(mediaUrl);
        var mediaStr = '';
        if (stbType.indexOf('B860A') >= 0) {
            mediaStr = LMMediaPlayer.formatMediaStr2(mediaUrl);
        } else {
            mediaStr = LMMediaPlayer.formatMediaStr(mediaUrl);
        }
        var mp = LMMediaPlayer.mediaPlayer;
        debug2("play NativePlayerInstanceID >>> " + mp.getNativePlayerInstanceID());
        mp.setSingleMedia(mediaStr);
        mp.setVideoDisplayMode(1);                          // 设置播放模式
        mp.refreshVideoDisplay();                           // 刷新显示
        mp.playFromStart();                                 // 开始播放
    },

    formatMediaStr: function (mediaUrl) {
        var mediaStr = '';
        mediaStr += '[{';
        mediaStr += 'mediaUrl:"' + mediaUrl + '",';                 // 媒体地址
        mediaStr += 'mediaCode:"jsoncode1",';                       // 媒体唯一标识
        mediaStr += 'mediaType:2,';                                 // 媒体类型 1、TYPE_CHANNEL 2、TYPE_VOD 3、TYPE_TVOD 4、TYPE_MUSIC
        mediaStr += 'audioType:4,';                                 // 音频编码类型：1: MPEG-1/2 layer 2 (MP2) 2: MPEG-1/2 layer 3 (MP3) 3: MPEG-2 LC-AAAC 4: MPEG-4 LC-AAC 5: MPEG-4 HE-AAC 6: AC-3 7: WMA9
        mediaStr += 'videoType:3,';                                 // 视频编码类型： 1、MPEG-2 2、MPEG-4 3、H.264 4、WMV9 5、VC-1 6、AVS
        mediaStr += 'streamType:2,';                                // 流类型： 1、PS 2、TS 3、MP4 4、ASF
        mediaStr += 'drmType:1,';                                   // DRM类型：1、DRM_TYPE_CLEAR_TEXT 2、DRM_TYPE_BESTDRM 3、DRM_TYPE_NDS 4、DRM_TYPE_MICROSOFT 5、DRM_WIDEVINE
        mediaStr += 'fingerPrint:0,';                               // 是否支持水印保护：0、开启fingerPrint 1、关闭fingerPrint (缺省值))
        mediaStr += 'copyProtection:1,';                            // 防止拷贝类型：0、PROTECTION_NO (缺省值) 1、PROTECTION_MACROVISION 3、PROTECTION_CGMSA
        mediaStr += 'allowTrickmode:1,';                            // 是否允许Trickmode：0、不允许Trickmode 1、允许Trickmode (缺省值)
        mediaStr += 'startTime:0,';                                 // 开始时间
        mediaStr += 'endTime:20000.3,';                             // 结束时间
        mediaStr += 'entryID:"jsonentry1"';                         // 多媒体播放时 PlayList列表中的唯一标识（只在加入Playlist时用到）
        mediaStr += '}]';
        return mediaStr;
    },

    formatMediaStr2: function (mediaUrl) {
        var mediaStr = '';
        mediaStr += '[{';
        mediaStr += 'mediaUrl:"' + mediaUrl + '",';                 // 媒体地址
        mediaStr += 'mediaCode:"jsoncode1",';                       // 媒体唯一标识
        mediaStr += 'mediaType:2,';                                 // 媒体类型 1、TYPE_CHANNEL 2、TYPE_VOD 3、TYPE_TVOD 4、TYPE_MUSIC
        mediaStr += 'audioType:1,';                                 // 音频编码类型：1: MPEG-1/2 layer 2 (MP2) 2: MPEG-1/2 layer 3 (MP3) 3: MPEG-2 LC-AAAC 4: MPEG-4 LC-AAC 5: MPEG-4 HE-AAC 6: AC-3 7: WMA9
        mediaStr += 'videoType:1,';                                 // 视频编码类型： 1、MPEG-2 2、MPEG-4 3、H.264 4、WMV9 5、VC-1 6、AVS
        mediaStr += 'streamType:1,';                                // 流类型： 1、PS 2、TS 3、MP4 4、ASF
        mediaStr += 'drmType:1,';                                   // DRM类型：1、DRM_TYPE_CLEAR_TEXT 2、DRM_TYPE_BESTDRM 3、DRM_TYPE_NDS 4、DRM_TYPE_MICROSOFT 5、DRM_WIDEVINE
        mediaStr += 'fingerPrint:0,';                               // 是否支持水印保护：0、开启fingerPrint 1、关闭fingerPrint (缺省值))
        mediaStr += 'copyProtection:1,';                            // 防止拷贝类型：0、PROTECTION_NO (缺省值) 1、PROTECTION_MACROVISION 3、PROTECTION_CGMSA
        mediaStr += 'allowTrickmode:1,';                            // 是否允许Trickmode：0、不允许Trickmode 1、允许Trickmode (缺省值)
        mediaStr += 'startTime:0,';                                 // 开始时间
        mediaStr += 'endTime:20000.3,';                             // 结束时间
        mediaStr += 'entryID:"jsonentry1"';                         // 多媒体播放时 PlayList列表中的唯一标识（只在加入Playlist时用到）
        mediaStr += '}]';
        return mediaStr;
    },


    playByTime: function (second) {
        LMMediaPlayer.playState = LMMediaPlayer.State.PLAY;
        LMMediaPlayer.mediaPlayer.playByTime(1, second);
    },

    resume: function () {
        LMMediaPlayer.playState = LMMediaPlayer.State.PLAY;
        LMMediaPlayer.mediaPlayer.resume();
    },

    pause: function () {
        LMMediaPlayer.playState = LMMediaPlayer.State.PAUSE;
        LMMediaPlayer.mediaPlayer.pause();
    },

    getMediaDuration: function () {
        if (LMMediaPlayer.videoDuration == 0) {
            var timeInSec = (LMMediaPlayer.mediaPlayer.getMediaDuration() || 0);
            if (typeof timeInSec === "string") timeInSec = get_as_int(timeInSec);// 转换为int类型给上层（因为某些盒子取到的值为string类型）
            LMMediaPlayer.videoDuration = timeInSec; //缓存总时长，以便下次使用缓存选择时直接使用
        }
        return LMMediaPlayer.videoDuration;
    },

    getCurrentPlayTime: function () {
        var timeInSec = (LMMediaPlayer.mediaPlayer.getCurrentPlayTime() || 0);
        if (typeof timeInSec === "string") timeInSec = get_as_int(timeInSec);// 转换为int类型给上层（因为某些盒子取到的值为string类型）
        // if (timeInSec <= 0) _varMgrTool.fastOpr.resetFastSeekOpr();
        return timeInSec;
    },

    upVolume: function (realAbsOffset) {
        realAbsOffset = realAbsOffset !== 0 ? realAbsOffset : 5; //其它默认改变值：5
        return LMMediaPlayer.changeVolume(100, realAbsOffset);
    },

    downVolume: function (realAbsOffset) {
        realAbsOffset = realAbsOffset !== 0 ? realAbsOffset : 5; //其它默认改变值：5
        return LMMediaPlayer.changeVolume(100, -realAbsOffset);
    },

    changeVolume: function (max/*允许音量最大值*/, offset/*每次音量变化值：+即音量加，-即音量减*/) {
        // 参数校验
        if (typeof offset !== "number") offset = 5;
        if (typeof max !== "number" || max <= 0) max = 100;

        // 设置
        var volume = (+LMMediaPlayer.mediaPlayer.getVolume());
        volume += offset; //计算目标音量值
        if (offset > 0) {
            volume = volume > max ? max : volume;
        } else {
            volume = volume < Math.abs(offset) ? 0 : volume;
        }

        LMMediaPlayer.mediaPlayer.setVolume(volume);
        return LMMediaPlayer.mediaPlayer.getVolume();
    },

    toggleMuteFlag: function () {
        var muteFlag = (LMMediaPlayer.mediaPlayer.getMuteFlag() == 1 ? 0 : 1);
        LMMediaPlayer.mediaPlayer.setMuteFlag(muteFlag)
    },

    isBeginning: function (keyCode) {
        return keyCode === "EVENT_MEDIA_BEGINING";
    },

    isError: function (keyCode) {
        return keyCode === 'EVENT_MEDIA_ERROR';
    },

    isEnd: function (keyCode) {
        return keyCode === "EVENT_MEDIA_END"
    },

    bind: function (virtualEvent) {

        if (LMMediaPlayer.isBindMode) return;

        var _bindInstanceId = parseInt(virtualEvent.instance_id);
        if (_bindInstanceId < 0) {
            return false; //参数错误
        }

        if (LMMediaPlayer.instanceID == _bindInstanceId) {
            return true; //播放器正常，进行后续操作
        }

        if (virtualEvent.type !== "EVENT_PLAYMODE_CHANGE" && virtualEvent.type !== "EVENT_MEDIA_BEGINING") {
            return false; //接收的事件对绑定没有帮助
        }

        LMMediaPlayer.mediaPlayer.bindNativePlayerInstance(_bindInstanceId);

        if (_bindInstanceId == LMMediaPlayer.mediaPlayer.getNativePlayerInstanceID()) {
            LMMediaPlayer.instanceID = _bindInstanceId;
            return true; //绑定成功，继续后续处理
        }
    },

    destroy: function () {
        LMMediaPlayer.mediaPlayer.stop();
        LMMediaPlayer.mediaPlayer.releasePlayerInstance(LMMediaPlayer.nativeInstanceId);
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
            backgroundImage: g_appRootPath + '/Public/img/hd/Player/V13/btn_collect.png',
            focusImage: g_appRootPath + '/Public/img/hd/Player/V13/btn_collect_f.png',
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
            backgroundImage: g_appRootPath + '/Public/img/hd/Player/V13/btn_replay.png',
            focusImage: g_appRootPath + '/Public/img/hd/Player/V13/btn_replay_f.png',
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
            backgroundImage: g_appRootPath + '/Public/img/hd/Player/V13/btn_back.png',
            focusImage: g_appRootPath + '/Public/img/hd/Player/V13/btn_back_f.png',
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
            backgroundImage:g_appRootPath+ '/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ?g_appRootPath+ '/Public/img/sd/Unclassified/V13/video_f.png' : g_appRootPath+'/Public/img/hd/Player/V13/video_f.png',
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
            backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
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
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath+'/Public/img/sd/Unclassified/V13/video_f.png' :g_appRootPath+ '/Public/img/hd/Player/V13/video_f.png',
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
            backgroundImage: g_appRootPath + '/Public/img/hd/Player/V13/prev_video_item.png',
            focusImage: g_appRootPath + '/Public/img/hd/Player/V13/prev_video_item_f.png',
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
                DetainPage.setCollectStatus(RenderParam.sourceId, expectedStatus);
                break;
            case 'back':
                PlayerKeyEventManager.jumpBack();
                break;
        }
    },


    /**
     * 加载推荐位视频数据（即挽留页显示的1-3号位视频数据）
     * @param: userId 当前用户id
     */
    initRecommendVideoInfo: function () {
        var postData = {
            'userId': RenderParam.userId
        };
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
                            freeTimes[i] = recommendData.data[i].free_seconds;
                            showStatus[i] = recommendData.data[i].show_status;
                            G('recommend-title-' + i).innerHTML = title[i];
                            G('recommend-img-' + i).src = RenderParam.imgHost + image_url[i];
                            G('focus-' + i).setAttribute('gqPlayUrl', gqPlayUrl[i]);
                            G('focus-' + i).setAttribute('bqPlayUrl', bqPlayUrl[i]);
                            G('focus-' + i).setAttribute('user_type', userType[i]);
                            G('focus-' + i).setAttribute('sourceId', sourceId[i]);
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
            'type': '',
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
        if (RenderParam.isVip) {    // vip用户可播放观看
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
        // 上报局方数据
        Network.sendUserBehaviour(PlayerKeyEventManager.exitPlayer());
    },

    /** 退出播放器  */
    exitPlayer: function(){
        LMEPG.Intent.back();
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
        switch (LMMediaPlayer.playState) {
            case LMMediaPlayer.State.PLAY:
                break;
            case LMMediaPlayer.State.PAUSE:
                break;
            case LMMediaPlayer.State.FAST_REWIND:
                break;
            case LMMediaPlayer.State.FAST_FORWARD:
                break;
        }
    },

    /** 右键。*/
    onKeyRight: function (currentBtnObj) {
        switch (LMMediaPlayer.playState) {
            case LMMediaPlayer.State.PLAY:
                break;
            case LMMediaPlayer.State.PAUSE:
                break;
            case LMMediaPlayer.State.FAST_REWIND:
                break;
            case LMMediaPlayer.State.FAST_FORWARD:
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
        switch (LMMediaPlayer.playState) {
            case LMMediaPlayer.State.PLAY:
                Player.pause();
                Player.Controller.show(false);
                break;
            case LMMediaPlayer.State.PAUSE:
                Player.resume();
                Player.Controller.show(true);
                break;
            case LMMediaPlayer.State.FAST_REWIND:
                PlayerKeyEventManager.onSpeedChanged(KEY_RIGHT);
                break;
            case LMMediaPlayer.State.FAST_FORWARD:
                PlayerKeyEventManager.onSpeedChanged(KEY_LEFT);
                break;
        }
    },

    /** “静音”按键 */
    onMuteKeyClicked: function () {
        LMMediaPlayer.toggleMuteFlag();
    },

    /** “虚拟”按键 */
    onVirtualKeyClicked: function () {
        var oEvent = Utility.getEvent();
        var keyCode = oEvent.type;

        if (!LMMediaPlayer.bind(oEvent)) {
            return;
        }
        if (LMMediaPlayer.isEnd(keyCode)) { //播放结束
            Player.playEnd();
        } else if (LMMediaPlayer.isError(keyCode)) {// 播放错误
        } else if (LMMediaPlayer.isBeginning(keyCode)) { // 视频播放准备开始
        } else { // 修正当弹出推荐视频后，当视频数据缓冲结束会自动播放视频的问题
            // LMEPG.mp.pause();
        }
    },

    /** “音量+/-”按键 */
    onVolumeChanged: function (dir) {
        switch (dir) {
            case PLAY_EVENT_UP:
                LMEPG.UI.showToast("音量+");
                LMMediaPlayer.upVolume();
                break;
            case PLAY_EVENT_DOWN:
                LMEPG.UI.showToast("音量-");
                LMMediaPlayer.downVolume();
                break;
        }
    },

    /** “快进/快退”按键。dir：left|right */
    onSpeedChanged: function (dir) {
        // 如果播放器正在播放，快进或快退过程会一直持续。如果播放器暂停状态，快进或快退时，一段时间后就正常播放了，
        // 所以暂停状态快进或快退时，先让播放器正常播放，这样流程才正常
        // var playerState = LMEPG.mp.getPlayerState();
        if (LMMediaPlayer.playState === LMMediaPlayer.State.PAUSE) {
            Player.resume(); // 去播放
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        var timestamp = Date.parse(new Date());
        if(timestamp - times <= 500){
            return;
        }
        times = timestamp;

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
        Network.sendUserBehaviour(LMEPG.emptyFunc()); // 上报局方数据
        var objCurrent = this.getCurrentPage();

        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));
        if (!LMEPG.Func.isEmpty(RenderParam.subjectId)) {
            objPlayer.setParam('subjectId', RenderParam.subjectId);
        }

        LMEPG.Intent.jump(objPlayer, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 页面跳转 -  购买vip页
     * @param remark
     */
    jumpBuyVip: function (remark) {
        Network.sendUserBehaviour(LMEPG.emptyFunc()); // 上报局方数据
        var objCurrent = this.getCurrentPage();
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('userId', RenderParam.userId);
        objOrderHome.setParam('isPlaying', '1');
        if (remark) {
            objOrderHome.setParam("remark", remark);
        }
        LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

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

    /**
     * 中国联通观看视频内容时需要上报局方数据
     * @param func
     */
    sendUserBehaviour: function (func) {
        var title = RenderParam.videoInfo.title.replace(/,/g, "");
        // 字符串长度长度限制在20
        var operateResult = title.length > 20 ? title.substring(0, 20) : title;
        var postData = {
            "type": 7,
            "operateResult": operateResult,
            "stayTime":  RenderParam.videoInfo.lastedPlaySecond
        };
        LMEPG.ajax.postAPI("Debug/sendUserBehaviourWeb", postData, func, func);
    },
};

// 页面错误
window.onerror = function (message, filename, lineno) {
    var errorLog = '[V16][Player.js]::error --->' + '\nmessage:' + message + '\nfile_name:' + filename + '\nline_NO:' + lineno;
    debug2('window.onerror:' + errorLog);
    if (debug_mode) LMEPG.UI.showToast(errorLog, 10);
    LMEPG.Log.error(errorLog);
};

// 页面销毁
window.onunload = function () {
    Player.release(); // 关闭播放器
}