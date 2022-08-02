/**
 * 贵州广电播放器封装
 *
 */


var isFML1 = false;

var PlayCallBack = {
    beginCallback: null,  //视频播放开始时的回调
    endCallBack: null,    //视频播放结束的回调
    isEndCallBack: false, //是否回调过，默认没有回调
    isBeginCallBack: false //是否回调过播放器开始
};

if (starcorCom.get_env() !== 'starcor') {
    isFML1 = true;
}

LMEPG.mp = (function () {

    //得到自定义播放对象
    return {
        S_MP: null,//全局保存的MP对象
        speed: 1,			// 正常播放速度
        state: 'play', 	// play:播放 pause:暂停, fastForward:倍速快进 fastRewind:倍速快退
        muteFlag: 0,		// 静音标志： 0、有声  1、静音
        isSpeedResume: false,     //倍速中是否重新播放标志：false:否，true:是
        instanceID: null,          //播放器本地实例的instanceID
        isBindMode: false,         //是否通过绑定本地播放器实例播放视频
        timerWithCallback: null,
        special520094: {
            playerId: '0',          // 贵州广电epg专属使用值
            url: ''
        },
        beginCallback: null,
        endCallBack: null,

        //定时获取视频播放结束回调
        _timerWithCallback: function () {
            if (!PlayCallBack.isBeginCallBack) {
                PlayCallBack.isBeginCallBack = true;
                PlayCallBack.beginCallback();
            }
            LMEPG.mp.timerWithCallback = setInterval(function () {
                var cPT = LMEPG.mp.getCurrentPlayTime();
                var gMD = LMEPG.mp.getMediaDuration();
                // LMEPG.Log.error("getCurrentPlayTime:" + cPT + ":::getMediaDuration" + gMD + "::isEndCallBack::" + PlayCallBack.isEndCallBack);
                if (cPT >= gMD && cPT > 5) {
                    if (!PlayCallBack.isEndCallBack) {
                        PlayCallBack.isEndCallBack = true;
                        PlayCallBack.endCallBack();
                    } else {
                        clearInterval(LMEPG.mp.timerWithCallback);
                    }
                }
            }, 1000);
        },
        /**
         * 父母乐二代、广大精灵二代、一代盒子
         */
        Player: {
            isSetEvent: false,
            initPlayer: function (url, left, top, width, height) {
                LMEPG.mp.Player._setSpecialEvent();
                LMEPG.mp.special520094.url = url;
                var tempLeft = (parseInt(left) / 1280).toFixed(3);
                var tempTop = (parseInt(top) / 720).toFixed(3);
                var tempWitdh = (parseInt(width) / 1280).toFixed(3);
                var tempHeight = (parseInt(height) / 720).toFixed(3);
                var tempPlayerId = android.create_miniPlayer(tempLeft + "", tempTop + "", tempWitdh + "", tempHeight + "");
                // LMEPG.Log.error("initPlayer520094 ----tempPlayerId::" + tempPlayerId);
                LMEPG.mp.special520094.playerId = tempPlayerId;
            },
            _setSpecialEventFML2AndGDJL2: function () {
                if (!this.isSetEvent) {
                    this.isSetEvent = true;
                } else {
                    return;
                }
                // LMEPG.Log.error("_setSpecialEventFML2AndGDJL2");
                var service_type = starcorCom.get_service_type();
                parent.window.onEvent = function (event) {
                    // LMEPG.Log.error("type=" + event.type + "::reason=" + event.reason + "::service_type=" + service_type);
                    if (service_type === 'iptv') {
                        if (event.type === 2 && parseInt(LMEPG.mp.getCurrentPlayTime()) > 5) {
                            if (!PlayCallBack.isEndCallBack) {
                                PlayCallBack.isEndCallBack = true;
                                PlayCallBack.endCallBack();
                            }
                        } else if (event.type === 3) {
                            var tempPlayerId = android.play_urlVideo(LMEPG.mp.special520094.playerId, LMEPG.mp.special520094.url);
                            // LMEPG.Log.error("tempPlayerId::init::" + tempPlayerId);
                            while (tempPlayerId !== 0) {
                                tempPlayerId = android.play_urlVideo(LMEPG.mp.special520094.playerId, LMEPG.mp.special520094.url);
                                // LMEPG.Log.error("tempPlayerId::while::" + tempPlayerId);
                            }
                            if (!PlayCallBack.isBeginCallBack) {
                                PlayCallBack.isBeginCallBack = true;
                                PlayCallBack.beginCallback();
                            }
                        }

                    } else {
                        if (event.type === 2) {
                            if (!PlayCallBack.isEndCallBack) {
                                PlayCallBack.isEndCallBack = true;
                                PlayCallBack.endCallBack();
                            }
                        } else if (event.type === 10) {
                            var tempPlayerId = android.play_urlVideo(LMEPG.mp.special520094.playerId, LMEPG.mp.special520094.url);
                            LMEPG.mp._timerWithCallback();
                        }
                    }
                }
            },
            _setSpecialEventGDJL1: function () {
                if (!this.isSetEvent) {
                    this.isSetEvent = true;
                } else {
                    return;
                }
                starcorCom.bind_play_event(LMEPG.mp.special520094.playerId, function (code, obj) {
                    // LMEPG.Log.error("bind_play_event::" + code);
                    if (code === 8) {
                        if (!PlayCallBack.isEndCallBack) {
                            PlayCallBack.isEndCallBack = true;
                            PlayCallBack.endCallBack();
                        }
                    } else if (code === 6) {
                        starcorCom.play_video_by_url(LMEPG.mp.special520094.playerId, LMEPG.mp.special520094.url);
                        if (!PlayCallBack.isBeginCallBack) {
                            PlayCallBack.isBeginCallBack = true;
                            PlayCallBack.beginCallback();
                        }

                    }
                });
            },
            _setSpecialEvent: function () {
                var subEnv = starcorCom.get_sub_env();
                switch (subEnv) {
                    case "fml_2":
                        LMEPG.mp.Player._setSpecialEventFML2AndGDJL2();
                        break;
                    case "gdjl_2":
                        LMEPG.mp.Player._setSpecialEventFML2AndGDJL2();
                        break;
                    case "gdjl_1":
                        LMEPG.mp.Player._setSpecialEventGDJL1();
                        break;
                    default:
                        LMEPG.Log.error("subEnv:::error");
                        break;
                }
            },

            /**
             * 接收播放器准备完成通知
             */
            play: function () {
                starcorCom.play_video_by_url(LMEPG.mp.special520094.playerId, LMEPG.mp.special520094.url)
            },
            /** 时移播放  贵州广电*/
            playByTime: function (second) {
                // LMEPG.Log.error("lmplayer ----playByTime520094");
                second = second * 1000;
                var state = starcorCom.miniPlayer_seekTo(LMEPG.mp.special520094.playerId, second);
                // LMEPG.Log.error("lmplayer ----state520094::" + state);
                this.state = 'play';
            },

            /** 暂停 贵州广电*/
            pause: function () {
                this.speed = 1;
                this.state = 'pause';
                try {
                    var temp = starcorCom.pause_miniPlayer(LMEPG.mp.special520094.playerId);
                } catch (e) {
                }
            },

            /** 从暂停、快进、快退中恢复  贵州广电*/
            resume: function () {
                LMEPG.mp.speed = 1;
                LMEPG.mp.state = 'play';
                try {
                    var temp = starcorCom.go_on_play(LMEPG.mp.special520094.playerId);
                } catch (e) {
                }
            },

            /** 播放或暂停 */
            playOrPause: function (callback) {
                if (LMEPG.mp.state == 'play')
                    this.pause();
                else
                    this.resume();
                LMEPG.call(callback, [LMEPG.mp.state, this]);
            },
            /** 获取当前播放时间 贵州广电 */
            getCurrentPlayTime: function () {
                var currentPlayTime = starcorCom.get_miniVideo_current(LMEPG.mp.special520094.playerId) || 0;
                currentPlayTime = parseInt(currentPlayTime / 1000);
                return currentPlayTime;
            },

            /** 获取总时长 贵州广电 */
            getMediaDuration: function () {
                var mediaDuration = starcorCom.get_miniVideo_duration(LMEPG.mp.special520094.playerId) || 0;
                mediaDuration = parseInt(mediaDuration / 1000);
                return mediaDuration;
            },
            /** 停止播放，释放资源 贵州广电*/
            destroy: function () {
                try {
                    var stopState = android.stop_miniPlayer(LMEPG.mp.special520094.playerId);
                    var destoryState = android.destroy_miniPlayer(LMEPG.mp.special520094.playerId);
                    var stopStateEx = starcorCom.stop_miniPlayer(LMEPG.mp.special520094.playerId);
                    var destoryStateEx = starcorCom.destroy_miniPlayer(LMEPG.mp.special520094.playerId);
                    // LMEPG.Log.error("stopState::" + stopState + "::destoryState::" + destoryState + "::stopStateEx=" + stopStateEx + "::destoryStateEx=" + destoryStateEx);

                } catch (e) {
                }
            }
        },

        /**
         * 父母乐一代盒子
         */
        PlayerFML1: {
            nativePlayerInstanceId: 0,
            timer: null,
            initPlayer: function (url, left, top, width, height) {
                var mp = new MediaPlayer();
                var tmp1 = 1;

                for (var i = 0; i < 256; i++) {
                    if (mp.bindNativePlayerInstance(i) == 0) {
                        tmp1 = mp.releaseMediaPlayer(i);
                    }
                }
                if (tmp1 == 0) {
                    LMEPG.mp.S_MP = new MediaPlayer();
                } else {
                    LMEPG.mp.S_MP = mp;
                }


                for (var i = 0; i < 256; i++) {
                    if (mp.bindNativePlayerInstance(i) == 0) {
                        mp.releaseMediaPlayer(i);
                    }
                }

                LMEPG.mp.S_MP = new MediaPlayer();                      // 创建播放实例
                for (var i = 0; i < 256; i++) {
                    var status = LMEPG.mp.S_MP.bindNativePlayerInstance(i);
                    if (status == 0) {
                        this.nativePlayerInstanceId = i;
                        break;
                    } else {
                        LMEPG.mp.S_MP.releaseMediaPlayer(i);
                    }
                }
                LMEPG.mp.S_MP.setVideoDisplayArea(left, top, width, height);
                LMEPG.mp.S_MP.setVideoDisplayMode(0);   //0按setVideoDisplayArea()中设定的height，width，left，top属性所指定的位置和大小来显示。
                LMEPG.mp.S_MP.setAllowTrickmodeFlag(0); //0允许快进、快退、暂停操作
                LMEPG.mp.S_MP.refreshVideoDisplay();    //根据videoDisplayMode、vedioDisplayArea属性调整视频的显示。所以设定Area和Mode参数后并不是立即生效，而是要在调用该函数后才会生效
                LMEPG.mp.S_MP.setSingleMedia(url);
                LMEPG.mp.S_MP.playFromStart();
                LMEPG.mp._timerWithCallback();
            },
            /**
             * 此方法在一代盒子不生效，所以不能做时移播放
             * @param second
             */
            playByTime: function (second) {
                LMEPG.mp.S_MP.fastForward(2);
                LMEPG.mp.S_MP.playByTime(1, second, 0);
                LMEPG.mp.state = 'play';
            },
            /** 暂停 */
            pause: function () {
                LMEPG.mp.speed = 1;
                LMEPG.mp.state = 'pause';
                try {
                    LMEPG.mp.S_MP.pause();
                } catch (e) {

                }
            },
            /** 从暂停、快进、快退中恢复 */
            resume: function () {
                LMEPG.mp.speed = 1;
                LMEPG.mp.state = 'play';
                try {
                    LMEPG.mp.S_MP.resume();
                } catch (e) {

                }
            },
            /** 播放或暂停 */
            playOrPause: function (callback) {
                if (LMEPG.mp.state == 'play') {
                    this.pause();
                } else {
                    this.resume();
                }
                LMEPG.call(callback, [LMEPG.mp.state, this]);
            },
            /** 获取当前播放时间 贵州广电 */
            getCurrentPlayTime: function () {
                if (LMEPG.mp.S_MP) return (LMEPG.mp.S_MP.getCurrentPlayTime() || 0);
                else return 0;
            },

            /** 获取总时长 贵州广电 */
            getMediaDuration: function () {
                if (LMEPG.mp.S_MP) return (LMEPG.mp.S_MP.getMediaDuration() || 0);//还没加载时一般获取到的是NaN或者0
                else return 0;
            },
            /** 停止播放，释放资源 贵州广电*/
            destroy: function () {
                LMEPG.mp.S_MP.stop();
                LMEPG.mp.S_MP.releaseMediaPlayer(this.nativePlayerInstanceId);
            }

        },

        registerCallback: function (beginCallback, endCallback) {
            delete PlayCallBack.beginCallback;
            delete PlayCallBack.endCallBack;

            delete PlayCallBack.isBeginCallBack;
            delete PlayCallBack.isEndCallBack;

            PlayCallBack.isEndCallBack = false;
            PlayCallBack.isBeginCallBack = false;
            PlayCallBack.beginCallback = beginCallback;
            PlayCallBack.endCallBack = endCallback;
        },

        getUrl: function (videoUrl, callback) {
            var getVideoIdParams = {
                "nns_ids": videoUrl,
                'nns_mode': 0,
                'nns_type': 'video'
            };
            starcorCom.transformat_keys(getVideoIdParams, function (data) {
                var videoId = data.l.il[0].id;
                var geturl_params = {
                    nns_video_id: videoId,
                    nns_video_type: "0"
                };
                starcorCom.apply_play(geturl_params, function (resp) {
                    if ("0" == resp.result.state) {
                        var url = resp.playurl != undefined ? resp.playurl : resp.video.index.media.url;
                        // LMEPG.Log.error("guizhougd player--------url:" + url);
                        callback(url);
                    } else { //错误提示
                        // LMEPG.Log.error("guizhougd player--------url:" + resp.result.state);
                    }
                });
            });
        },

        /** 初始化播放器，贵州广电 */
        initPlayer: function (url, left, top, width, height) {
            // LMEPG.Log.error("guizhougd player--------isFML1:" + isFML1);
            if (isFML1) {
                this.PlayerFML1.initPlayer(url, left, top, width, height);
            } else {
                this.Player.initPlayer(url, left, top, width, height);
            }
        },
        /**
         * 接收播放器准备完成通知
         */
        play: function () {
            if (!isFML1) {
                this.Player.play();
            }
        },

        /** 时移播放  贵州广电*/
        playByTime: function (second) {
            if (isFML1) {
                this.PlayerFML1.playByTime(second);
            } else {
                this.Player.playByTime(second);
            }
        },

        /** 暂停 贵州广电*/
        pause: function () {
            this.speed = 1;
            this.state = 'pause';
            if (isFML1) {
                this.PlayerFML1.pause();
            } else {
                this.Player.pause();
            }
        },

        /** 从暂停、快进、快退中恢复  贵州广电*/
        resume: function () {
            this.speed = 1;
            this.state = 'play';
            if (isFML1) {
                this.PlayerFML1.resume();
            } else {
                this.Player.resume();
            }
        },

        /** 播放或暂停 */
        playOrPause: function (callback) {
            if (isFML1) {
                this.PlayerFML1.playOrPause(callback);
            } else {
                this.Player.playOrPause(callback);
            }
        },

        /** 获取当前播放时间 贵州广电 */
        getCurrentPlayTime: function () {
            var currentPlayTime = 0;
            if (isFML1) {
                currentPlayTime = this.PlayerFML1.getCurrentPlayTime();
            } else {
                currentPlayTime = this.Player.getCurrentPlayTime();
            }
            return currentPlayTime;
        },

        /** 获取总时长 贵州广电 */
        getMediaDuration: function () {
            var mediaDuration = 0;
            if (isFML1) {
                mediaDuration = this.PlayerFML1.getMediaDuration();
            } else {
                mediaDuration = this.Player.getMediaDuration();
            }
            return mediaDuration;
        },

        /** 停止播放，释放资源 贵州广电*/
        destroy: function () {
            clearInterval(LMEPG.mp.timerWithCallback);
            if (isFML1) {
                this.PlayerFML1.destroy();
            } else {
                this.Player.destroy();
            }
        },

        /** 通过“当前时长”和“总时长”比较，判断是否播放结束。 */
        checkPlayEndManually: function () {
            var curPlayTimeMoment = this.getCurrentPlayTime();
            var playDuration = this.getMediaDuration();
            if (curPlayTimeMoment > 0 && playDuration > 0) {
                return curPlayTimeMoment == playDuration;
            } else {
                return false;
            }
        },

    };
})();
