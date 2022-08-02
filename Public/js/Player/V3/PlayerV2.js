// +----------------------------------------------------------------------
// | 播放器模式V3（V3/Player）页面的js控制封装
// +----------------------------------------------------------------------
// | 使用该V3/Player特别之处：
// |    1. 新版UI的EPG播放器。
// |    2. 自定义进度条UI与音量UI，均位于底部。
// |    3. 播放状态图标（暂停/快进/快退）位于右上角。
// +----------------------------------------------------------------------
// | 目前应用地区：
// |     320092(江苏电信)     220094(吉林广电-联通)     220095(吉林广电-电信)
// |     650092(新疆电信)     510094(四川广电)       10220094(吉林广电-联通)魔方
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/12/13
// +----------------------------------------------------------------------

// 打日志TAG，方便追踪不同模式的播放器JavaScript
window.TAG_NAME = "V3/Player.js";

//************************************************************//
// 特别强调：开头必须，优先加载通用逻辑JS。
//************************************************************//
document.write('<script type="text/javascript" src="' + g_appRootPath + '/Public/js/Player/LMTVPlayHelper.js?t=' + new Date().getTime() + '"></script>');
document.write('<script type="text/javascript" src="' + g_appRootPath + '/Public/js/Player/LMTVPlayUrlFetcher.js?t=' + new Date().getTime() + '"></script>');

/****************************************************************
 * 按钮数组声明
 *****************************************************************/
var buttons = [];

/****************************************************************
 * 全局常量声明。说明：C表示Const常量。
 *****************************************************************/
var C = {
    /** 图片 */
    Pic: (function () {
        var c_commonPath = g_appRootPath + "/Public/img/" + get_platform_type() + "/Player/V7";
        var clazz = function () {
            // 倍速相关图标
            this.play_indicator_speed_forward_bg = c_commonPath + "/play_indicator_forward_bg.png";
            this.play_indicator_speed_rewind_bg = c_commonPath + "/play_indicator_rewind_bg.png";
            this.play_indicator_pause_bg = c_commonPath + "/play_indicator_pause.png";

            // 音量相关图标
            this.volume_progress_dot = c_commonPath + "/volume_progress.png";
            this.volume_switch_on = c_commonPath + "/volume_on.png";
            this.volume_switch_off = c_commonPath + "/volume_off.png";

            // 挽留页面相关图标
            this.detain_page_bg_playing = c_commonPath + "/detain_page_bg_playing.png";        // 挽留页背景：播放中暂停时应用
            this.detain_page_bg_play_ended = c_commonPath + "/detain_page_bg_play_ended.png";  // 挽留页背景：播放结束时应用

            // 推荐视频 选中/未选中 图片
            this.recommend_video_bg_unfocused = c_commonPath + "/recommend_video_bg_unfocused.png";
            this.recommend_video_bg_focused = c_commonPath + "/recommend_video_bg_focused.png";

            // “重播”图标：无焦点 / 有焦点
            this.replay_unfocused = c_commonPath + "/btn_replay_unfocused.png";
            this.replay_focused = c_commonPath + "/btn_replay_focused.png";

            // “继续播放”图标：无焦点 / 有焦点
            this.resume_replay_unfocused = c_commonPath + "/btn_play_continue_bg_unfocused.png";
            this.resume_replay_focused = c_commonPath + "/btn_play_continue_bg_focused.png";

            // “收藏/取消收藏”图标：无焦点 / 有焦点
            this.collect_unfocused = c_commonPath + "/btn_collect_bg_unfocused.png";
            this.collect_focused = c_commonPath + "/btn_collect_bg_focused.png";
            this.no_collect_unfocused = c_commonPath + "/btn_collect_bg_unfocused.png";
            this.no_collect_focused = c_commonPath + "/btn_collect_bg_focused.png";

            // “结束播放”图标：无焦点 / 有焦点
            this.finish_play_unfocused = c_commonPath + "/btn_finish_bg_unfocused.png";
            this.finish_play_focused = c_commonPath + "/btn_finish_bg_focused.png";
        };
        return new clazz();
    })(),

    /** 常用控件id */
    ID: {
        play_indicator_container: "play-indicator-container",   // 播放、暂停、倍速父容器
        play_indicator_img: "play-indicator-bg",                // 播放、暂停、倍速图标
        play_indicator_text: "play-indicator-text",             // 倍速显示文本
    },

    /** 按钮功能类型 */
    FuncType: {
        REPLAY: "replay",                       // 重播
        RESUME: "resume",                       // 继续播放
        COLLECT: "collect",                     // 收藏
        NO_COLLECT: "no_collect",               // 取消收藏
        EXIT: "exit",                           // 退出
        RECOMMEND_VIDEO: "recommend_video",     // 推荐视频
    },

};

/*****************************************************************
 * 按需重写通用接口方法，以适配不同平台交互需求！
 * 注：必须实现，才可复用通用js里规范定义的接口！！！
 *****************************************************************/
function init_playAPIs() {

    // 自定义：播控行为
    (function init_lmPlayAPI() {

        lmPlayAPI.doReplayBefore = function (isReplay, videoInfoJson) {
            lmTVLogPanel.log.v("[doReplayBefore]");

            // 重置视频资源信息和UI
            lmTVParams.init_VideoInfo(videoInfoJson);
            lmTVGlobals.reset();
            lmTVLayout.initRenderUI();

            // 停止播放，释放逻辑资源
            LMEPG.mp.stop(); //停止播放
            lmTVPlayAction.release(); //释放资源
        };

        lmPlayAPI.doRefreshPlay = function (isReplay, videoInfoJson) {
            lmTVLogPanel.log.v("[doRefreshPlay] - " + isReplay + ", " + videoInfoJson);

            // 如下为启动新播放的核心代码！！！
            lmTVPlayAction.startFullScreenPlay();

            // 启动UI相关定时器监听
            lmTVLayout.progressBar.start(); // 启动 进度条 显示
            lmTVLayout.indicatorBar.start(); // 启动 倍速/暂停 显示
        };

        lmPlayAPI.doReplayAfter = function (isReplay, videoInfoJson) {
            // lmTVLogPanel.log.v("[doReplayAfter]");
        };

        if (RenderParam.carrierId === '10220095') { // 吉林电信魔方，点击推荐位视频/自动续播需要上报历史播放记录
            lmPlayAPI.doPlayNew = function (videoInfoJson) {
                Page.jumpPlayVideo(videoInfoJson);
            }
        }

    })();

    // 自定义：播控行为 - UI
    (function init_lmPlayUIAPI() {
        lmPlayUIAPI.withFastForward = function (latestPlayState, isSpeedResumed, currentPlayTimeInSec) {
            lmTVLogPanel.log.i(LMEPG.Func.string.format("[快进]-({0},{1},{2})", [latestPlayState, isSpeedResumed, currentPlayTimeInSec]));
            if (isSpeedResumed) {
                lmTVLayout.indicatorBar.showOrHideSpeedUI(false);
            } else {
                lmTVLayout.indicatorBar.showOrHideSpeedUI(true);
            }
        };

        lmPlayUIAPI.withFastRewind = function (latestPlayState, isSpeedResumed, currentPlayTimeInSec) {
            lmTVLogPanel.log.i(LMEPG.Func.string.format("[快退]-({0},{1},{2})", [latestPlayState, isSpeedResumed, currentPlayTimeInSec]));
            if (isSpeedResumed || currentPlayTimeInSec === 0) {
                lmTVLayout.indicatorBar.showOrHideSpeedUI(false);
            } else {
                lmTVLayout.indicatorBar.showOrHideSpeedUI(true);
            }
        };

        lmPlayUIAPI.withPause = function () {
            lmTVLogPanel.log.i("[暂停]：成功");
            lmTVLayout.indicatorBar.showOrHidePauseUI(true);
            lmTVLayout.progressBar.show();
        };

        lmPlayUIAPI.withPauseCancelled = function () {
            // 非挽留页情况：快进/快退 ---> 正常倍速恢复 （正常播放，则无须重复操作）
        };

        lmPlayUIAPI.withResume = function () {
            lmTVLogPanel.log.i("[恢复播放]");
            lmTVLayout.indicatorBar.showOrHideSpeedUI(false);
            lmTVLayout.indicatorBar.showOrHidePauseUI(false);
        };

        lmPlayUIAPI.withStop = function () {
            lmTVLogPanel.log.w("[停止播放]：手动操作");
            lmTVPlayAction.playToEnd(true);
        };

        lmPlayUIAPI.withVolumeChange = function (isAscend) {
            // lmTVLogPanel.log.i(LMEPG.Func.string.format("[调节音量]-({0})", [isAscend]));
            lmTVLayout.volumeBar.showWith(isAscend ? LMEPG.mp.upVolume() : LMEPG.mp.downVolume());
        };

        lmPlayUIAPI.withVolumeMute = function (isMuted) {
            lmTVLogPanel.log.i(LMEPG.Func.string.format("[静音切换]-({0})", [isMuted ? "静音" : "有声"]));
            if (RenderParam.carrierId === "440094") {
                LMEPG.UI.showToast("静音：" + (isMuted ? "开" : "关"));
            } else {
                lmTVLayout.volumeBar.toggleMute(isMuted);
            }
        };

        /* 物理功能按键（方向相关） */
        lmPlayUIAPI.withPressDirKey = function (direction) {
            // lmTVLogPanel.log.i(LMEPG.Func.string.format("[方向键]-({0})", [direction]));
            lmTVLayout.progressBar.toggleVisible(); // 呼出/关闭进度条
            /*if (LMEPG.Func.array.contains(direction, [G_CONST.left, G_CONST.right])) {
                lmTVLayout.progressBar.seekTo(direction); // 注：暂不做任何事
            }*/
        };

        lmPlayUIAPI.withPressDirKeyOnHoldPage = function (direction) {
            // lmTVLogPanel.log.i(LMEPG.Func.string.format("[挽留页-方向键]-({0})", [direction]));
            switch (direction) {
                case G_CONST.up:
                case G_CONST.down:
                    var btn = LMEPG.BM.getCurrentButton();
                    if (!btn || !btn.id) return;

                    if (direction === G_CONST.up && btn.id.startWith("recommend-video") && is_element_exist(lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine1)) {
                        LMEPG.BM.requestFocus(lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine1);
                        return true;
                    }

                    if (direction === G_CONST.down && btn.id.startWith("operate-btn") && is_element_exist(lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine2)) {
                        LMEPG.BM.requestFocus(lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine2);
                        return true;
                    }
                    break;
            }
        };

        /* 其它按键 */
        lmPlayUIAPI.withPressKeyBack = function (isHoldPageShowing) {
            lmTVLogPanel.log.i(LMEPG.Func.string.format("[lmPlayUIAPI]：withPressKeyBack({0})", [isHoldPageShowing]));
            if (isHoldPageShowing) {
                if (LMEPG.Func.array.contains(RenderParam.carrierId, ["220094","10220094"])) {
                    // 注：应局方要求，继续返回不退出而是返回播放状态（Songhui 2019-6-4）
                    lmTVPlayAction.resumeOrReplay(LMEPG.BM.getButtonById("operate-btn-2")/*继续播放*/);
                } else {
                    lmTVPlayAction.jumpBack();
                }
            } else {
                lmTVPlayAction.pausePlaying(); // 按返回，先暂停当前正在播放
                // lmTVLayout.indicatorBar.showOrHidePauseUI(false);// 如果是从“暂停”状态按返回键到“挽留页”，先隐藏暂停按钮 TODO 需要优化掉，在LMEPG.mp操作回调后更新UI里做
                // lmTVLayout.progressBar.hide(true); // 弹出挽留页，如果正在显示播放戟，则强制隐藏进度条
            }
        };

        lmPlayUIAPI.withPressKeyExit = function () {
            lmTVLogPanel.log.i("[lmPlayUIAPI]: withPressKeyExit()");
            lmTVPlayAction.jumpBack()
        };

        /* 虚拟按键 */
        lmPlayUIAPI.withVirtualKey = function (isOk, msg, vKeyCode, vKeyEvent) {
            lmTVLogPanel.log.i(isOk + "-->" + msg + "-->" + vKeyCode);
            if (!isOk) return;

            if (LMEPG.mp.isEnd(vKeyCode)) { //播放结束
                if (parseInt(RenderParam.isVip) !== 1 && parseInt(lmTVParams.get_v_UserType()) === 2) {
                    clearInterval(window.mpTimer) || (window.mpTimer = null); // 释放定时器
                    LMEPG.mp.stop();

                    // 如果isForbidOrder = 1，表示不允许订购，直接返回
                    if (parseInt(RenderParam.isForbidOrder) === 1) {
                        LMEPG.UI.showToast("您已受限订购该业务，暂时不能订购!", 3, "LMEPG.Intent.back()");
                    } else {
                        Page.jumpBuyVip(lmTVParams.get_v_VideoTitle(), lmTVParams.get_v_VideoInfo());
                    }
                } else {
                    lmTVPlayAction.playToEnd();
                }
            } else if (LMEPG.mp.isError(vKeyCode)) {// 播放错误
            } else if (LMEPG.mp.isBeginning(vKeyCode)) {
                G("play-progressbar-ball").style.left = "0px";
                lmTVLayout.indicatorBar.showOrHidePauseUI(false);
                lmTVLayout.indicatorBar.showOrHideSpeedUI(false);
            } else if (lmTVGlobals.isHoldPageShowing()) { // 修正当弹出推荐视频后，当视频数据缓冲结束会自动播放视频的问题
                LMEPG.mp.pause();
            }
        };
    })();

}

/*****************************************************************
 * 全局统一封装 - 播控UI
 *****************************************************************/
var lmTVLayout = {

    /** 全局UI控制管理 */
    globalMgr: (function () {
        var clazz = function () {
            var self = this;

            // 缓存当前播放状态，用于控制各种UI切换显示等（play|pause|fastRewind|fastForward|end）
            var g_uiPlayState = LMEPG.mp.State.PLAY;

            /** 焦点保持控制（记录挽留页第1、2排的焦点状态） */
            this.focusKeeper = {
                lastFocusedBtnIdOfLine1: "operate-btn-1",       // 离开第1排前的焦点按钮，默认为第1个
                lastFocusedBtnIdOfLine2: "recommend-video-1",   // 离开第2排前的焦点按钮，默认为第1个
                record: function (requestFocusBtnId) {   // 记录当前的焦点按钮id
                    if (requestFocusBtnId) {
                        if (requestFocusBtnId.startWith("operate-btn")) {
                            this.lastFocusedBtnIdOfLine1 = requestFocusBtnId;
                        } else if (requestFocusBtnId.startWith("recommend-video")) {
                            this.lastFocusedBtnIdOfLine2 = requestFocusBtnId;
                        }
                    }
                },
                reset: function () {
                    this.lastFocusedBtnIdOfLine1 = "operate-btn-1";
                    this.lastFocusedBtnIdOfLine2 = "recommend-video-1";
                },
            };

            // 初始化默认焦点指向
            this.requestDefaultFocusView = function () {
                LMEPG.BM.requestFocus("operate-btn-1");
            };

            /** 设置 - 当前记录的全局UI控制状态（并返回当前对象） */
            this.set_g_uiPlayState = function (newPlayState) {
                g_uiPlayState = newPlayState;
                return self;
            };

            /** 获取 - 当前记录的全局UI控制状态*/
            this.get_g_uiPlayState = function () {
                return g_uiPlayState;
            };

            /** 重置状态 - 当前记录的全局UI控制状态 */
            this.reset = function () {
                g_uiPlayState = LMEPG.mp.State.PLAY;
                this.focusKeeper.reset();
            };
        };
        return new clazz();
    })(),

    /** 音量UI控制 */
    volumeBar: (function () {
        var autoHideTimer = null;                // 自动隐藏音量调节进度条定时器
        var autoHideDelayInSec = 3;              // 自动隐藏音量进度条的时间（秒）
        var clazz = function () {

            // 隐藏音量UI
            var hide = 'H("volumeUI")';

            // 拖动音量进度。volumeValue：音频值[0, 100]
            var seekTo = function (volumeValue) {
                var progress = volumeValue / 5; // 每5个单位值显示作为一个单位进度等级
                var volumeUIContainer = G("volume-progressbar-container");
                volumeUIContainer.innerHTML = "";
                var htmlStr = '';
                for (var i = 0; i < progress; i++) {
                    htmlStr += '<img class="volume-progress" src="' + C.Pic.volume_progress_dot + '" alt=""/>';
                }
                volumeUIContainer.innerHTML = htmlStr;
                G("volume-value").innerHTML = progress + "";
                G("volume-switch").setAttribute("src", progress <= 0 ? C.Pic.volume_switch_off : C.Pic.volume_switch_on);
            };

            // 音量进度条显示 - 开始计时器
            var restartTimer = function () {
                (autoHideTimer && clearTimeout(autoHideTimer)) || (autoHideTimer = null);
                autoHideTimer = setTimeout(hide, autoHideDelayInSec * 1000);
            };

            /** 显示音量UI */
            this.showWith = function (volumeValue) {
                S("volumeUI");
                seekTo(volumeValue);
                restartTimer();
            };

            /** 当静音开/关后，显示开关 */
            this.toggleMute = function (isMuted) {
                var value = LMEPG.mp.getCurrentVolume();
                this.showWith(value);
                G("volume-switch").setAttribute("src", isMuted || value <= 0 ? C.Pic.volume_switch_off : C.Pic.volume_switch_on);
            };

            /** 重置状态 - 音量控制及UI */
            this.reset = function () {
                // DO NOTHING HERE...
            };

            /** 释放 - 音量控制相关 */
            this.release = function () {
                lmTVLogPanel.log.a("[音量控制] - release...");
                (autoHideTimer && clearTimeout(autoHideTimer)) || (autoHideTimer = null);
            };
        };
        return new clazz();
    })(),

    /** 进度条UI控制 */
    progressBar: (function () {
        /* 长度相关定值 */
        var progressBarWidth = I_HD() ? 1048 : 482;             // 进度条总的宽度：hd-1048 / sd-482
        var floatingTimeLeftOffset = I_HD() ? 75 : 50;          // 悬浮时间的起始左偏移：hd-75 / sd-50，与css中保持一致
        var indicatorWidth = 40;                                // 进度条指示器（小球？）的宽度

        /* 手动seek进度参数 */
        var currentSeekInSec = -1;                              // 记录手动seek的当前时长（秒）：只要 >=0 就表示正在手动seek（为什么设置全局，因为可能快速seek以在上一次未来得及走完流程的seek值基础进行新一轮seek）
        var seekStepInSec = 10;                                 // 手动seek的单位间隔（秒）
        var autoSeekTimer = null;                               // 手动seek的定时器

        /* 进度条相关参数 */
        var isShowing = false;                                  // 进度条是否正在显示
        var autoHideTimer = null;                               // 自动隐藏进度条定时器
        var autoHideDelayInSec = 5;                             // 自动隐藏音量进度条的时间（秒）
        var  moveBar = 0;


        var clazz = function () {

            var self = this;

            // 计算获取播放总进度比例，返回介于0-1之间的小数
            var getPlayRate = function (playPosition, playDuration) {
                return playDuration > 0 && playPosition >= 0 ? playPosition / playDuration : 0;
            };

            // 手动拖动 - 播放进度
            var seekTo = function (playInSeconds) {
                if (playInSeconds >= 0) {
                    LMEPG.mp.playByTime(playInSeconds);
                    resetSeekState();
                }
            };

            // 重置seek的状态：每次seekTo后，就重置初始状态
            var resetSeekState = function () {
                currentSeekInSec = -1;
            };

            /** 移动进度条上的点的操作。dir：left | right */
            this.seekTo = function (dir) {
                lmTVLogPanel.log.i(LMEPG.Func.string.format("[手动拖动进度]-（{0}）", [dir]));
                if (LMEPG.Func.array.contains(dir, [G_CONST.left, G_CONST.right])) {
                    (autoSeekTimer && clearTimeout(autoSeekTimer)) || (autoSeekTimer = null);

                    // 1，取出“当前播放进度、视频总时长”
                    var mpTimes = LMEPG.mp.getTimes();
                    var playPosition = mpTimes.position;
                    var playDuration = mpTimes.duration;

                    // 2，当前 seek 时刻
                    var lastSeekPosition = currentSeekInSec < 0 ? playPosition : currentSeekInSec; //新一轮seek前，当前的seek进度
                    currentSeekInSec = lastSeekPosition + (dir === G_CONST.left ? -1 : 1) * seekStepInSec;

                    // 越界处理
                    if (currentSeekInSec <= 0) currentSeekInSec = 0;
                    else if (currentSeekInSec >= playDuration) currentSeekInSec = playDuration;

                    // 3，更新进度条UI比例效果
                    var seekRate = currentSeekInSec / playDuration;
                    var progressLength = progressBarWidth * seekRate;
                    G("play-progressbar").style.width = progressLength + "px";
                    if ((progressLength - indicatorWidth) < 0) {
                        G("play-progressbar-ball").style.left = "0px";
                    } else if ((progressLength - indicatorWidth) > (progressBarWidth - indicatorWidth / 2)) {
                        G("play-progressbar-ball").style.left = (progressBarWidth - indicatorWidth / 2) + "px";
                    } else {
                        G("play-progressbar-ball").style.left = (progressLength - indicatorWidth / 2) + "px";
                    }

                    autoSeekTimer = setTimeout(function () {
                        seekTo(currentSeekInSec);
                    }, 500);
                }
                return false;
            };

            // 进度条更新UI - 核心
            var onProgressUpdate = function () {

                // 1，取出“当前播放进度、视频总时长”
                var mpTimes = LMEPG.mp.getTimes();
                var playPosition = mpTimes.position;
                var playDuration = mpTimes.duration;


                // playPosition = moveBar + playPosition * LMEPG.mp.getSpeed();
                // moveBar = playPosition;
                if (!lmTVGlobals.isHoldPageShowing()) {
                    var logstr = "状态：{0}&nbsp;&nbsp;&nbsp;&nbsp;倍速：{1}&nbsp;&nbsp;&nbsp;&nbsp;进度显示：{2}/{3}（秒）";
                    var logrep = [LMEPG.mp.getPlayerState(), LMEPG.mp.getSpeed(), playPosition, playDuration];
                    lmTVLogPanel.logBasicInfo(LMEPG.Func.string.format(logstr, logrep));
                }

                // 2，显示“当前时长:总时长”。当读取到有效播放时刻(>0)后，才允许弹出悬浮当前播放时刻！
                var displayPlayPosition = LMEPG.Func.formatTimeInfo(1, playPosition);
                var displayPlayDuration = LMEPG.Func.formatTimeInfo(1, playDuration);
                if (displayPlayPosition === "0-1:0-1") { //表示读时间进度有问题，不给予更新时间
                    return;
                }

                G("video-current-play-time").innerHTML = displayPlayPosition;
                G("floating-play-time-text").innerHTML = displayPlayPosition;
                G("video-total-time").innerHTML = displayPlayDuration;

                // 启动显示“悬浮播放进度”
                playPosition > 0 ? S("floating-play-time-container") : H("floating-play-time-container");

                // 3，更新进度条UI比例效果
                var rate = getPlayRate(playPosition, playDuration); //当前播放比例，取值范围[0-1]
                var progressLength = rate * progressBarWidth; //进度条的长度
                if (currentSeekInSec < 0) {
                    // lmTVLogPanel.log.i(LMEPG.Func.string.format("[快进DISP]-(currentSeekInSec={0},progressLength={1},displayPlayPosition={2})", [currentSeekInSec, progressLength,displayPlayPosition]));
                    // 说明：(progressLength - X)，X为微调偏移量，不减它会产生超前进度小球一小段距离！高清-6，标清-3
                    G("play-progressbar").style.width = (progressLength - 6) + "px";
                    if (progressLength === 0) {
                        G("play-progressbar-ball").style.left = "0px";
                        G("floating-play-time-container").style.left = floatingTimeLeftOffset + "px"; // 起始左偏移：hd-75 / sd-50，与css中保持一致
                        LMEPG.mp.resume();//长度为0时，恢复播放（兼容拖动或快退操作）
                    } else if (progressLength > indicatorWidth / 2) {
                        G("play-progressbar-ball").style.left = (progressLength - indicatorWidth / 2) + "px";
                        G("floating-play-time-container").style.left = (progressLength - indicatorWidth / 2 + floatingTimeLeftOffset) + "px";
                    }
                }

                // 为了解决烽火盒子对快退播放视频，重新播放时，快退的UI界面没有隐藏问题
                if (currentSeekInSec < 2) {
                    // lmTVLayout.indicatorBar.showOrHideSpeedUI(false);
                }

                /*// 防止当视频未加载完，用户按返回键已弹出挽留页，避免此时视频加载完回来继续播放，应当暂停播放！
                if (lmTVGlobals.isHoldPageShowing()) { //备注：已在挽留页弹窗中处理，屏蔽此段但保留着，以供参考。
                    lmTVLayout.holdPage.checkTodoIfHoldPageShowing();
                }*/

                // 注：最后操作！！！
                // 针对某些地区盒子，播放结束后不会发出结束虚拟按键，以致于无法知道是否播放完毕。
                // 对此，目前解决办法为：比较“当前播放时长和总时长”，当二者相等是，则认为播放结束。
                try {
                    if (lmTVPlayAction.isNeedListenProgressEnd()) {
                        // CASE-->广东广电
                        if (RenderParam.carrierId === "440094") {
                            if (playPosition >= playDuration && playPosition > 30/*TODO: 不知道为什么写30？试看时长(那应用RenderParam.freeSeconds啊)？*/) {
                                lmTVPlayAction.playToEnd(true);
                                return;
                            }
                        }
                        if(LMEPG.mp.getPlayerState() == 'fastForward' && (playPosition + LMEPG.mp.getSpeed()) >= (playDuration - LMEPG.mp.getSpeed())){
                            lmTVLogPanel.log.i(LMEPG.Func.string.format("[快进结束，播放主动完成]-（{0}）", [playPosition]));
                            setTimeout(function () {
                                lmTVPlayAction.playToEnd(true);
                            }, 1000/*注：由于(curPlayTime+ALLOW_OFFSET_SEC) >= totalDuration)多加1s判断了，故延迟1s执行，保证时差抵消*/);
                            return;
                        }

                        // CASE-->默认处理！
                        // 提前1s结束。因为存在可能既不发768虚拟结束信号，获取的currentPlayTime到不了视频的最后1s情况，就无法
                        // 知道是否结束。此行提前1s判断，尝试解决。
                        var ALLOW_OFFSET_SEC = 1;

                        if (playPosition > 0 && playDuration > 0 && (playPosition + ALLOW_OFFSET_SEC) >= playDuration) {
                            setTimeout(function () {
                                lmTVPlayAction.playToEnd(true);
                            }, 1000 * ALLOW_OFFSET_SEC/*注：由于(curPlayTime+ALLOW_OFFSET_SEC) >= totalDuration)多加1s判断了，故延迟1s执行，保证时差抵消*/);
                        }
                    }
                } catch (e) {
                    printLog('Player$onProgress()-----> error:' + e.toString(), true);
                }

            };

            /*
             * 校验免费试看时长 - 是否允许当前用户继续播看。
             * 说明：当用户为非vip(1表示VIP)且用户策略为vip(userType==2)时，才会检测是否达到试看临界点。若是，跳转订购页。否则，继续播放。
             */
            var checkFreeTrialTime = function () {
                // 如果视频是vip才可以看，否则要判断免费播放时长。（userType：（0-不限，1-普通用户可看, 2-vip可看））
                if (parseInt(RenderParam.isVip) === 1) {
                    return;
                }

                if (parseInt(lmTVParams.get_v_UserType()) === 2) {
                    var playPosition = LMEPG.mp.getCurrentPlayTime();
                    if (playPosition >= lmTVParams.get_v_FreeSeconds()) {
                        clearInterval(window.mpTimer) || (window.mpTimer = null); //释放定时器
                        LMEPG.mp.stop(); //停止播放
                        if (parseInt(RenderParam.isForbidOrder) === 1) { // 如果isForbidOrder = 1，表示不允许订购，直接返回
                            LMEPG.UI.showToast("您已受限订购该业务，暂时不能订购!", 3, "LMEPG.Intent.back()");
                        } else {
                            Page.jumpBuyVip(lmTVParams.get_v_VideoTitle(), lmTVParams.get_v_VideoInfo());
                        }
                    }
                }
            };

            // 播放进度条显示 - 开始计时器
            var restartTimer = function () {
                (autoHideTimer && clearTimeout(autoHideTimer)) || (autoHideTimer = null);
                autoHideTimer = setTimeout(self.hide, autoHideDelayInSec * 1000);
            };

            /** 进度条是否正在显示 */
            this.isShowing = function () {
                return isShowing;
            };

            /** 显示进度条 */
            this.show = function () {
                // lmTVLogPanel.log.i("[进度条] - 显示");
                isShowing = true;
                Show("playUI");
                restartTimer();
            };

            /** 隐藏进度条（可强制性） */
            this.hide = function (forceHidden) {
                // lmTVLogPanel.log.i("[进度条] - 隐藏");
                // 若正处于 [暂停/快进/快退]，则继续保持当前指示器图标显示
                if (!forceHidden && LMEPG.Func.array.contains(LMEPG.mp.getPlayerState(), [LMEPG.mp.State.PAUSE, LMEPG.mp.State.FAST_FORWARD, LMEPG.mp.State.FAST_REWIND])) {
                    restartTimer();
                } else {
                    isShowing = false;
                    Hide("playUI");
                    (autoHideTimer && clearTimeout(autoHideTimer)) || (autoHideTimer = null);
                }
            };

            /** 切换进度条显示/隐藏 */
            this.toggleVisible = function () {
                if (isShowing) self.hide(true);
                else self.show();
            };

            /** 返回进度条总宽度（number） */
            this.getWidth = function () {
                return progressBarWidth;
            };

            /** 启动进度条计时器 */
            this.start = function () {
                // lmTVLogPanel.log.i("[进度条] - starting...");

                // 启动进度条的同时，显示并同时启动进度条显示/隐藏计时器，避免进度条从一开始播放就一直显示！
                if (!isShowing) {
                    self.show();
                }

                // TODO 青海电信先show进度条的话，则不会再显示了，故启动计时器先show一下！
                // self.show();

                // 进入页面时，视频需要一定的加载时间
                setTimeout(function () {
                    onProgressUpdate();
                    (window.mpTimer && clearInterval(window.mpTimer)) || (window.mpTimer = null);
                    window.mpTimer = setInterval(function () {
                        onProgressUpdate();
                        checkFreeTrialTime();
                    }, 1000);//1秒刷新一次
                }, 2500);
            };

            /** 重置状态 - 进度控制及UI */
            this.reset = function () {
                // 开始播放前，重置相关参数状态
                resetSeekState();
                isShowing = false; //标记为false，当下次调用start时才会刷新定时器

                // 开始播放前，重置相关UI状态
                H("floating-play-time-container"); //隐藏进度浮动时间
                G("floating-play-time-container").style.left = floatingTimeLeftOffset + "px"; //进度浮动时间初始左偏移
                G("play-progressbar-ball").style.left = "0px"; //进度小球从头开始
                G("play-progressbar").style.width = progressBarWidth + "px"; //进度条总长度
                G("video-current-play-time").innerHTML = LMEPG.Func.formatTimeInfo(1, 0); //设置当前播放时长
                G("video-total-time").innerHTML = LMEPG.Func.formatTimeInfo(1, 0); //设置总时长
                G("video-title").innerHTML = lmTVParams.get_v_VideoTitle();
            };

            /** 释放 - 进度控制相关 */
            this.release = function () {
                lmTVLogPanel.log.a("[进度控制] - release...");
                (autoHideTimer && clearTimeout(autoHideTimer)) || (autoHideTimer = null);
                (autoSeekTimer && clearTimeout(autoSeekTimer)) || (autoSeekTimer = null);
                (window.mpTimer && clearInterval(window.mpTimer)) || (window.mpTimer = null);
            };
        };
        return new clazz();
    })(),

    /** 指示器UI（暂停/倍速）控制 */
    indicatorBar: (function () {
        var autoRefreshTimer = null;            // 自动刷新指示UI定时器
        var clazz = function () {

            // 显示/隐藏- 暂停图标（与 倍速 图标显示互斥）
            this.showOrHidePauseUI = function (isShow) {
                lmTVLogPanel.log.v(LMEPG.Func.string.format("[indicatorBar]-设置可见性：{0}({1})", ["暂停", isShow]));
                if (isShow) lmTVLayout.progressBar.show();
            };

            // 显示/隐藏 - 倍速图标（与 暂停 图标显示互斥）
            this.showOrHideSpeedUI = function (isShow) {
                lmTVLogPanel.log.v(LMEPG.Func.string.format("[indicatorBar]-设置可见性：{0}({1})", ["倍速", isShow]));
                if (isShow) lmTVLayout.progressBar.show();
            };

            // 切换右上角背景图片：暂停、快进、快退
            var updatePlayIndicatorBg = function (playState, speed, isForcedVisible) {
                // lmTVLogPanel.log.v("[更新指示器背景]-" + playState);
                switch (playState) {
                    case LMEPG.mp.State.PAUSE:
                        G(C.ID.play_indicator_img).src = C.Pic.play_indicator_pause_bg;
                        G(C.ID.play_indicator_text).innerHTML = "";
                        S(C.ID.play_indicator_container);
                        break;
                    case LMEPG.mp.State.FAST_FORWARD:
                    case LMEPG.mp.State.FAST_REWIND:
                        if (playState === LMEPG.mp.State.FAST_FORWARD) G(C.ID.play_indicator_img).src = C.Pic.play_indicator_speed_forward_bg;
                        else G(C.ID.play_indicator_img).src = C.Pic.play_indicator_speed_rewind_bg;
                        if (LMEPG.Func.array.contains(speed, [2, 4, 8, 16, 32, 64])) {
                            G(C.ID.play_indicator_text).innerHTML = LMEPG.mp.getSpeed() + "X"; // 显示倍速值
                            S(C.ID.play_indicator_container);
                        } else {
                            H(C.ID.play_indicator_container);
                        }
                        break;
                    case LMEPG.mp.State.PLAY:
                    default:
                        G(C.ID.play_indicator_text).innerHTML = "";
                        H(C.ID.play_indicator_container);
                        break;
                }

                // 强制显示/隐藏
                if (typeof isForcedVisible === "boolean") isForcedVisible ? S(C.ID.play_indicator_container) : H(C.ID.play_indicator_container);
            };

            // 指示器（倍速/暂停）更新UI - 核心
            var onIndicatorUpdate = function () {
                var latestPlayState = LMEPG.mp.getPlayerState();
                switch (true) {
                    case latestPlayState === LMEPG.mp.State.FAST_FORWARD:
                    case latestPlayState === LMEPG.mp.State.FAST_REWIND:
                        // 显示 倍速 图标
                        updatePlayIndicatorBg(latestPlayState, LMEPG.mp.getSpeed());
                        break;
                    case latestPlayState === LMEPG.mp.State.PAUSE:
                        // 显示 暂停 图标
                        updatePlayIndicatorBg(latestPlayState, LMEPG.mp.getSpeed(), true);
                        break;
                    default:
                        updatePlayIndicatorBg(latestPlayState, LMEPG.mp.getSpeed(), false);
                        break;
                }
            };

            // 指示器显示 - 开始计时器
            var restartTimer = function () {
                onIndicatorUpdate();
                (autoRefreshTimer && clearInterval(autoRefreshTimer)) || (autoRefreshTimer = null);
                autoRefreshTimer = setInterval(function () {
                    onIndicatorUpdate();
                }, 200);//间隔刷新一次UI：保证交互体验
            };

            /** 启动指示器计时器 */
            this.start = function () {
                // lmTVLogPanel.log.v("[指示器] - starting...");
                setTimeout(restartTimer, 2500); // 进入页面时，视频需要一定的加载时间
            };

            /** 重置状态 - 指示器UI控制状态 */
            this.reset = function () {
                (autoRefreshTimer && clearInterval(autoRefreshTimer)) || (autoRefreshTimer = null);
                updatePlayIndicatorBg(null, null, false);//强制关掉
            };

            /** 释放 - 指示器控制相关 */
            this.release = function () {
                lmTVLogPanel.log.a("[指示器控制] - release...");
                (autoRefreshTimer && clearInterval(autoRefreshTimer)) || (autoRefreshTimer = null);
            };
        };
        return new clazz();
    })(),

    /** 挽留页UI控制 */
    holdPage: (function () {
        // 说明：挽留页检查当前播放状态（用于加固不可预料情况：刚进入就按返回弹出挽留页，但播放器还在初始化未播放出帧画面。
        // 当能播放时已经有挽留页了，此时定时检查若正在播放则暂停！）
        var checkPlayStateTimer = null;         //定时器1-每秒检查
        var checkPlayStateTimerExec = null;     //定时器2-延时执行目标任务（用于：优化关闭挽留弹窗后，清除上一次尚未开始执行的延时pause任务）

        var clazz = function () {
            var self = this;

            /**
             * 创建  重播/续播  按钮
             * @param isPlayEnd [boolean] false-续放（播放暂停显示） true-重播（播放结束显示）
             */
            this.initPlayOrReplay = function (isPlayEnd) {
                lmTVLogPanel.log.v("[holdPage]-重播续播：" + isPlayEnd);
                var isReplayStatus = !!isPlayEnd; // 结束-“重播”/暂停-“续播”
                var initImgSrc = isReplayStatus ? C.Pic.replay_unfocused : C.Pic.resume_replay_unfocused;

                var domFocus_2_2 = G("operate-btn-2");
                if (LMEPG.Func.isExist(domFocus_2_2)) {
                    // 已经创建过了，直接更改内容即可
                    domFocus_2_2.setAttribute("src", initImgSrc);
                } else {
                    // 未曾创建，新添加
                    var btnContainer = G("operate-btn-container");
                    var htmlStr = LMEPG.Func.isExist(btnContainer.innerHTML) ? btnContainer.innerHTML : ''; //加强判断
                    htmlStr += '<img id="operate-btn-2" class="operate-btn-img" src="' + initImgSrc + '" alt="">';
                    btnContainer.innerHTML = htmlStr;
                }

                // 按钮属性赋值
                buttons[5].name = isReplayStatus ? "重播" : "继续播放";
                buttons[5].backgroundImage = isReplayStatus ? C.Pic.replay_unfocused : C.Pic.resume_replay_unfocused;
                buttons[5].focusImage = isReplayStatus ? C.Pic.replay_focused : C.Pic.resume_replay_focused;
                buttons[5].funcType = isReplayStatus ? C.FuncType.REPLAY : C.FuncType.RESUME;
            };

            /**
             * 创建  收藏/取消收藏  按钮
             */
            this.initCollectOrNot = function () {
                // 已经收藏过视频，不再显示“收藏按钮”
                if (lmTVParams.is_t_Collected()) {
                    return;
                }

                lmTVLogPanel.log.v("[holdPage]-收藏取消收藏：" + lmTVParams.get_v_CollectStatus());
                var isCollected = lmTVParams.is_t_Collected(); // 当前是否为“已收藏”状态（注：UI上显示应该是取反的！）
                var initImgSrc = isCollected ? C.Pic.collect_unfocused : C.Pic.no_collect_unfocused;

                var domFocus_2_3 = G("operate-btn-3");
                if (LMEPG.Func.isExist(domFocus_2_3)) {
                    // 已经创建过了，直接更改内容即可
                    domFocus_2_3.setAttribute("src", initImgSrc);
                } else {
                    // 未曾创建，新添加
                    var btnContainer = G("operate-btn-container");
                    var htmlStr = LMEPG.Func.isExist(btnContainer.innerHTML) ? btnContainer.innerHTML : ""; //加强判断
                    htmlStr += '<img id="operate-btn-3" class="operate-btn-img" src="' + initImgSrc + '" alt="">';
                    btnContainer.innerHTML = htmlStr;
                }

                // 按钮属性赋值
                buttons[6].name = isCollected ? "取消收藏" : "收藏";
                buttons[6].backgroundImage = isCollected ? C.Pic.collect_unfocused : C.Pic.no_collect_unfocused;
                buttons[6].focusImage = isCollected ? C.Pic.collect_focused : C.Pic.no_collect_focused;
                buttons[6].funcType = isCollected ? C.FuncType.COLLECT : C.FuncType.NO_COLLECT;
            };

            // 加载推荐位视频数据（即挽留页显示的1-4号位视频数据） userId 当前用户id
            this.initRecommendVideoInfo = function () {
                lmTVLogPanel.log.v("[holdPage]-推荐视频列表");
                var postData = {};
                if (RenderParam.carrierId === "650092" || RenderParam.carrierId === "12650092") {
                    postData = {
                        "userId": RenderParam.userId,
                        "videoUserType": 2 // 表示只取VIP可看的视频
                    };
                } else {
                    postData = {
                        "userId": RenderParam.userId
                    };
                }
                LMEPG.ajax.postAPI("Player/getRecommendVideoInfo", postData, function (rsp) {
                    try {
                        var gqPlayUrl = {};     //hd-播放串url
                        var bqPlayUrl = {};     //sd-播放串url
                        var title = {};
                        var image_url = {};
                        var userType = {};
                        var sourceId = {};      //视频编码
                        var freeTimes = {};
                        var unionCode = {};
                        var collectStatus = {}; //收藏状态（0-已收藏 1-未收藏）

                        var recommendData = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        if (!LMEPG.Func.isObject(recommendData) || LMEPG.Func.array.isEmpty(recommendData.data)) {
                            lmTVLogPanel.log.e("获取推荐视频失败！");
                            return;
                        }

                        for (var i = 0, len = recommendData.data.length; i < len; i++) {
                            var itemDataObj = recommendData.data[i];
                            if (!LMEPG.Func.isObject(itemDataObj)) {
                                continue;
                            }

                            try {
                                var ftpUrlObjTemp = eval("(" + itemDataObj.ftp_url + ")");
                                gqPlayUrl[i] = ftpUrlObjTemp.gq_ftp_url;
                                bqPlayUrl[i] = ftpUrlObjTemp.bq_ftp_url;
                            } catch (e) {
                                console.error("parse ftp_url error: " + e.toString());
                                gqPlayUrl[i] = "";
                                bqPlayUrl[i] = "";
                            }
                            title[i] = itemDataObj.title;
                            image_url[i] = itemDataObj.image_url;
                            userType[i] = itemDataObj.user_type;
                            sourceId[i] = itemDataObj.source_id;
                            freeTimes[i] = itemDataObj.free_seconds;
                            unionCode[i] = itemDataObj.union_code;
                            collectStatus[i] = itemDataObj.collect_status;

                            // 推荐视频img及title的id，编号索引从1开始哦~
                            var vTitleId = "recommend-video-" + (i + 1) + "-title";
                            var vImgId = "recommend-video-" + (i + 1) + "-img";

                            var domTitle = G(vTitleId);
                            var domImage = G(vImgId);

                            domTitle.innerText = title[i];
                            domImage.src = RenderParam.imgHost + image_url[i];
                            domImage.setAttribute("gqPlayUrl", gqPlayUrl[i]);
                            domImage.setAttribute("bqPlayUrl", bqPlayUrl[i]);
                            domImage.setAttribute("user_type", userType[i]);
                            domImage.setAttribute("sourceId", sourceId[i]);
                            domImage.setAttribute("title", title[i]);
                            domImage.setAttribute("freeSeconds", freeTimes[i]);
                            domImage.setAttribute("unionCode", unionCode[i]);
                            domImage.setAttribute("collectStatus", collectStatus[i]);

                            // 按钮属性赋值
                            buttons[i].funcType = C.FuncType.RECOMMEND_VIDEO;
                            buttons[i].dataObj = itemDataObj;
                        }
                    } catch (e) {
                        printLog("推荐视频数据处理异常：" + e.toString(), true);
                        LMEPG.UI.showToast("推荐视频数据处理异常：" + e.toString());
                    }
                });
            };

            // 依附于挽留页显示/隐藏时，管理其它UI交互状态
            var monitorExtrasUIStates = function (isHoldPageShowing) {
                // lmTVLogPanel.log.v("[holdPage]-监听状态");
                if (isHoldPageShowing) {
                    lmTVLayout.indicatorBar.showOrHidePauseUI(false);// 互斥显示图标 - “暂停”
                    lmTVLayout.indicatorBar.showOrHideSpeedUI(false);// 互斥显示图标 - “倍速”
                    lmTVLayout.progressBar.hide(true); // 互斥显示图标 - “进度条”
                } else {
                    lmTVLayout.indicatorBar.showOrHidePauseUI(false);// 立即隐藏图标 - “暂停”
                    lmTVLayout.progressBar.show(); // 从挽留页返回，应当立即显示进度条，保证UX
                }
            };

            /**
             * 重庆电信隐藏收藏
             */
            setCollection500092= function () {
                G("operate-btn-3").style.display = "none";
                buttons[5].nextFocusRight = "";
                buttons[4].nextFocusLeft = "";
            };

            // 显示/隐藏 挽留页
            var setVisibilityForHoldPageUI = function (isShow) {
                if(RenderParam.carrierId=="500092"){
                    setCollection500092();
                }
                lmTVLogPanel.log.v("[holdPage]-显示挽留页：" + isShow);
                lmTVGlobals.setHoldPageShowing(isShow);
                var holdPageBg = lmTVLayout.globalMgr.get_g_uiPlayState() === LMEPG.mp.State.END ? C.Pic.detain_page_bg_play_ended : C.Pic.detain_page_bg_playing;
                G("detain-page").style.backgroundImage = 'url("' + holdPageBg + '")';
                if (!!isShow) {
                    monitorExtrasUIStates(true);
                    Show("detain-page");
                    // 注：请勿随意动该段逻辑控制！
                    // 防止当视频未加载完，用户按返回键已弹出挽留页，避免此时视频加载完回来继续播放，应当暂停播放！
                    (checkPlayStateTimer && clearInterval(checkPlayStateTimer)) || (checkPlayStateTimer = null);
                    checkPlayStateTimer = setInterval(function () {
                        (checkPlayStateTimerExec && clearTimeout(checkPlayStateTimerExec)) || (checkPlayStateTimerExec = null);
                        checkPlayStateTimerExec = setTimeout(function () {
                            self.checkTodoIfHoldPageShowing(function () {
                                clearInterval(checkPlayStateTimer) || (checkPlayStateTimer = null);
                            });
                        }, 500); //必须延迟！！！
                    }, 1000); // 每隔1秒检查一次
                } else {
                    monitorExtrasUIStates(false);
                    Hide("detain-page");
                    (checkPlayStateTimerExec && clearTimeout(checkPlayStateTimerExec)) || (checkPlayStateTimerExec = null);
                    (checkPlayStateTimer && clearInterval(checkPlayStateTimer)) || (checkPlayStateTimer = null);
                }
            };

            /** 挽留弹出中检查并更新（请勿随意动该段逻辑控制！） */
            this.checkTodoIfHoldPageShowing = function (pausedCallback) {
                if (LMEPG.mp.isPlaying()) {
                    setTimeout(function () {
                        LMEPG.mp.pause();
                        if (typeof pausedCallback === "function") pausedCallback();
                    }, 500); //必须延迟！！！
                } else {
                    if (typeof pausedCallback === "function") pausedCallback();
                }
            };

            /** 刷新挽留页UI显示 */
            this.refreshDisplay = function () {
                var g_uiPlayState = lmTVLayout.globalMgr.get_g_uiPlayState();
                if (LMEPG.Func.array.contains(g_uiPlayState, [LMEPG.mp.State.PAUSE, LMEPG.mp.State.END])) {
                    setVisibilityForHoldPageUI(true);
                } else if (g_uiPlayState === LMEPG.mp.State.PLAY) {
                    setVisibilityForHoldPageUI(false);
                } else {
                    // setVisibilityForHoldPageUI(false);
                }

                // 获取默认焦点按钮
                lmTVLayout.globalMgr.requestDefaultFocusView();
            };

            /** 重置状态 - 挽留控制及UI */
            this.reset = function () {
                self.initPlayOrReplay(false); // 初始化渲染 “继续播放/重播”相关控件
                self.initCollectOrNot(); // 初始化渲染 “收藏/取消收藏”相关控件
                self.initRecommendVideoInfo(); // 加载数据并初始化渲染 “推荐视频1-4”相关控件
                self.refreshDisplay();
            };
        };
        return new clazz();
    })(),

    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++*
     * 重置所有状态
     *+++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    resetAll: function () {
        this.globalMgr.reset();         // order-1
        this.holdPage.reset();          // order-2
        this.volumeBar.reset();         // order-3
        this.indicatorBar.reset();      // order-4
        this.progressBar.reset();       // order-5
    },

    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++*
     * 释放所有资源
     *+++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    releaseAll: function () {
        this.volumeBar.release();
        this.progressBar.release();
        this.indicatorBar.release();
    },

    /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++*
     * 重置渲染UI
     *+++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    initRenderUI: function () {
        // 调试跟踪 - 播放信息
        lmTVLogPanel.logBasicInfo();

        // 进度条区域
        this.resetAll();
    },
}; // #End of Class$lmTVLayout

/*****************************************************************
 * 全局统一封装 - 播控交互
 *****************************************************************/
var lmTVPlayAction = {

    /**
     * 返回上一页
     * @param delayInSec [number] [可选] 延时。
     */
    jumpBack: function (delayInSec) {
        if (typeof delayInSec === "number" && delayInSec > 0) {
            setTimeout("LMEPG.Intent.back()", delayInSec * 1000);
        } else {
            LMEPG.Intent.back();
        }
    },

    /** 点击确认键播放或者暂停 */
    togglePlayerState: function () {
        var g_uiPlayState = lmTVLayout.globalMgr.get_g_uiPlayState();
        if (g_uiPlayState === LMEPG.mp.State.PLAY) {
            lmTVLayout.globalMgr.set_g_uiPlayState(LMEPG.mp.State.PAUSE);
            LMEPG.mp.pause();
        } else if (g_uiPlayState === LMEPG.mp.State.PAUSE) {
            lmTVLayout.globalMgr.set_g_uiPlayState(LMEPG.mp.State.PLAY);
            LMEPG.mp.resume();
        } else if (g_uiPlayState === LMEPG.mp.State.END) {
            lmTVLayout.globalMgr.set_g_uiPlayState(LMEPG.mp.State.END);
        }

        // 统一刷新是否显示挽留页
        lmTVLayout.holdPage.refreshDisplay();
    },

    /** 暂停正在播放 */
    pausePlaying: function () {
        lmTVLogPanel.log.i("[lmTVPlayAction]-暂停正在播放...");
        lmTVLayout.indicatorBar.showOrHideSpeedUI(false); // 隐藏倍速图标
        lmTVLayout.progressBar.hide();
        this.togglePlayerState();
    },

    /** 重播/续播 */
    resumeOrReplay: function (btn) {
        lmTVLogPanel.log.i("[lmTVPlayAction]-" + (btn.funcType === C.FuncType.REPLAY ? "重播" : "继续播放"));
        if (btn.funcType === C.FuncType.RESUME) {
            lmTVLayout.progressBar.hide();//隐藏进度条
            this.togglePlayerState();
        } else {
            lmPlayAPI.doReplay();
        }
    },

    /** 自动播放视频 -- 默认播放第一条视频 */
    goAutoPlayVideo: function () {
        lmTVLogPanel.log.i("[lmTVPlayAction]-goAutoPlayVideo...");
        var btn = {id: "recommend-video-1"};
        lmTVPlayAction.playVideo(btn);
    },

    /** 点击播放挽留页推荐视频之一 */
    playVideo: function (btn) {
        // 加强判断处理：非点击挽留页推荐视频，拒绝播放
        if (!lmTVGlobals.isHoldPageShowing()) {
            printLog("playVideo(btn)------->>> 非挽留页推荐视频点击，拒绝操作！", true);
            return;
        }
        // 按钮对象无效：拒绝播放
        if (!LMEPG.Func.isObject(btn)) {
            printLog("playVideo(btn)------->>> invalid button，拒绝操作！", true);
            return;
        }

        var btnId = btn.id;
        if (btnId.startWith("recommend-video")) {
            //得到播放地址
            var domImg_0 = G(btnId).getElementsByTagName("img")[0];
            var videoInfo = {
                "sourceId": domImg_0.getAttribute("sourceId"),
                "videoUrl": domImg_0.getAttribute(I_HD() ? "gqPlayUrl" : "bqPlayUrl"),
                "title": domImg_0.getAttribute("title"),
                "userType": domImg_0.getAttribute("user_type"),
                "freeSeconds": domImg_0.getAttribute("freeSeconds"),
                "unionCode": domImg_0.getAttribute("unionCode"),
                "collectStatus": domImg_0.getAttribute("collectStatus"),
                "type": "",
                "entryType": 1,
                "entryTypeName": "play"
            };
            if (!videoInfo.userType && !videoInfo.sourceId) {
                LMEPG.UI.showToast("播放错误：无效的视频资源！");
                return;
            }
            //=================================================================//
            //  视频的播放策略（userType：0-不限，1-普通用户可看, 2-vip可看）  //
            //=================================================================//
            printLog("play recommend videoInfo:" + JSON.stringify(videoInfo));
            if (lmTVPlayAction.allowPlayVideo(videoInfo)) {
                //
                // 直接播放推荐视频
                lmPlayAPI.doPlayNew(videoInfo);
            } else {
                // 如果isForbidOrder = 1，表示不允许订购，直接返回
                if (parseInt(RenderParam.isForbidOrder) === 1) {
                    LMEPG.UI.showToast("您已受限订购该业务，暂时不能订购!", 3, "LMEPG.Intent.back()");
                } else {
                    // “非VIP用户” 且 “仅限VIP用户” 且 “免费试看时长为0”，则直接跳转到VIP限制订购
                    Page.jumpBuyVip(videoInfo.title, videoInfo);
                }
            }
        }
    },

    /** 收藏与取消收藏（当前视频） */
    toggleCollectStatus: function () {
        var isCollected = lmTVParams.is_t_Collected();
        if (isCollected) {
            LMEPG.UI.showToast("您已经收藏过该视频了哦~");
            return;
        }

        var expectedStatus = isCollected ? 1 : 0;  //改变收藏状态（反选期望值）（0-已收藏 1-未收藏）
        var postData = {
            "source_id": lmTVParams.get_v_SourceId(),
            "status": expectedStatus
        };
        LMEPG.ajax.postAPI("Collect/setCollectStatus", postData, function (rsp) {
            // 请求成功
            try {
                var jsonObj = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (jsonObj && jsonObj.result === 0) {
                    lmTVParams.set_v_CollectStatus(expectedStatus);
                    //lmTVLayout.holdPage.initCollectOrNot(); //注：新UI样式暂时不隐藏，收藏成功还可收藏，给出提示
                    //
                    // 加强用户体验：
                    // 如果在收藏/取消收藏过程中，用户就移动了按钮焦点。即：server响应时刻 > 用户变更当前收藏/取消收藏按钮焦点时刻，
                    // 当server变更收藏状态响应时，若当前记录的焦点按钮还是自己本身，则强制requestFocus以更新最新的UI焦点状态！
                    var currentFocusBtn = LMEPG.BM.getCurrentButton();
                    if (currentFocusBtn && currentFocusBtn.id === "operate-btn-2") {
                        LMEPG.BM.requestFocus("operate-btn-2");
                    }
                    //收藏成功后，隐藏收藏按钮，且设置其他两个按钮的焦点左右移动时指向的按钮对象
                    if(RenderParam.carrierId == "10220095"){
                        if(lmTVParams.is_t_Collected()){
                            H('operate-btn-3');
                            LMEPG.BM.requestFocus("operate-btn-2");
                            buttons[5].nextFocusRight = "operate-btn-1";
                            buttons[4].nextFocusLeft = "operate-btn-2";
                        }
                    }

                    LMEPG.UI.showToast(lmTVParams.is_t_Collected() ? "收藏成功" : "取消收藏");
                } else {
                    LMEPG.UI.showToast((expectedStatus === 1 ? "取消收藏失败！" : "收藏失败！") + "[" + (jsonObj ? jsonObj.result : jsonObj) + "]");
                }
            } catch (e) {
                LMEPG.UI.showToast("发生异常，操作失败！");
                printLog("toggleCollectStatus-->error:" + e.toString(), true);
            }
        }, function (rsp) {
            // 请求失败
            LMEPG.UI.showToast("网络请求失败！");
            printLog("toggleCollectStatus-->ajax error:" + rsp, true);
        });
    },

    /**
     * 功能：用于判断是否需要使用进度来判断是否播放完成.
     * 原因：因为某些平台的MediaPlayer并不会发送播放结束等信号，所以需要手动计算监听以停止及其UI等逻辑。
     *
     * @return {boolean} true：需要使用进度条来监听是否结束 false：不需要
     */
    isNeedListenProgressEnd: function () {
        switch (RenderParam.carrierId) {
            case "440094"://广东广电EPG
            case "510094"://四川广电EPG
            case "650092"://新疆电信EPG
            case "12650092"://新疆电信EPG天天健身
            case "320092"://江苏电信EPG
            case "10220094"://吉林联通魔方EPG
            case "10220095"://吉林电信魔方EPG
                return true;
            default:
                return false;
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
     * @param videoInfo 指定视频配置信息
     * @return boolean  true：表示不能直接播放视频，需要先去局方订购VIP。false：表示可以播放视频
     */
    allowPlayVideo: function (videoInfo) {
        if (RenderParam.isVip) {    // vip用户可播放观看
            return true;
        } else {        // 非vip用户可播放观看的前提是：不限vip用户 或者 有免费试看时长
            var isOnlyVIPPlay = parseInt(videoInfo.userType) === 2; // 0-不限，1-普通用户可看，2-仅限VIP用户可看（普通用户需要检查免费时长）
            return !isOnlyVIPPlay || videoInfo.freeSeconds > 0;
        }
    },

    /**
     * 新疆电信EPG：通过iFrame获取播放串mediaStr，再进行播放（使用此方式，是为了兼容某升级平台）
     */
    initPlayerByMediaStrFromHideFrame: function () {
        /*-新疆电信完整的地址：
         * var url = "rtsp://222.83.5.77/88888888/16/20181126/271503595/271503595.ts?rrsip=222.83.5.77&icpid=SSPID&accounttype=1&limitflux=-1&limitdur=-1&accountinfo=:20181227134822,testiptv233HD,10.131.236.20,20181227134822,CDWYPro514339651743116122,F706F94FB0B33E6E7DD96BB90F60A6E6,-1,0,3,-1,,1,,,,1,END";
         * var code = "CDWYPro514339651743116122"; //第三方的媒资ID
         */
        var mediaStr = "";
        var code = lmTVParams.get_v_VideoUrl();//我们平台的媒资ID

        // printLog(printObjInfo(window.frames["smallscreen"], "[smallscreen]")); // TODO DEBUG

        var loopTimer = setInterval(function () {
            var iframe = window.frames["smallscreen"];

            // [临时加强处理]：用于处理弹出挽留推荐页时，点击“重播”或“任一推荐视频”进行新的播放时，某些款盒子会拿不到
            // window.frames["smallscreen"].getMediastr(code)这个方法。暂时未查出具体原因，在此先做特别处理（不影响其它）：
            //      1、为了兼容某升级平台，继续保持优先使用iframe.getMediastr(code)方法。
            //      2、若其它大众平台盒子，进行如上挽留页播放场景新播放出现异常时，超出自定义处理策略范围内，则继续走原先的播放方式！
            //      3、自定义处理策略：获取失败次数超过指定值，则切换默认播放方式！
            // -------- Added by Songhui on 2019-12-3
            if ((typeof iframe === "undefined" || iframe == null)
                || (typeof iframe.getMediastr !== "function"
                    || iframe.getMediastr(code) === undefined || iframe.getMediastr(code) === "")) {
                // 避免当前（仅新疆电信）创建类变量记录，则使用当前window对象附加该缓存：表示请求获取播放串失败的次数
                window.xj_iframGetFailedTimes = typeof window.xj_iframGetFailedTimes !== "number" ? 1 : window.xj_iframGetFailedTimes++;
                if (window.xj_iframGetFailedTimes >= 1) {
                    lmTVLogPanel.log.e(LMEPG.STBUtil.getSTBModel() + (I_HD() ? "（高清）" : "（标清）") + "：iframe.getMediastr失败，切换默认方式！");
                    window.clearInterval(loopTimer) || (loopTimer = null);
                    lmPlayUrlFetcher.getIFramePlayUrlWithDomainUrl(RenderParam.carrierId, code, RenderParam.domainUrl, function (lmcid, mediaCode, iframePlayUrl) {
                        lmTVPlayAction.__startPlayWithIframe(lmcid, mediaCode, iframePlayUrl);
                    });
                }
                return;
            }

            mediaStr = iframe.getMediastr(code);
            if (mediaStr !== undefined && mediaStr.length > 1) {
                window.clearInterval(loopTimer) || (loopTimer = null);
                LMEPG.mp.initPlayerMode1();
                LMEPG.mp.playOfFullscreen(mediaStr, false);
            }
            lmTVLogPanel.log.v("[新疆电信] getMediastr-->" + mediaStr);
        }, 1000);
    },

    /**
     * 广东广电获取视频信息
     * TODO 应该重新调整 UtilsWithGDGD ，获取媒资详情和播放串以一个接口返回，方便引用！！！
     */
    getVideoInfo440094: function (titleAssetId) {
        var callback = function (isSuccess, data) {
            printLog("getVideoInfo440094 ---- callback:" + data);
            if (isSuccess) {
                LMEPG.mp.setMediaDuration(data.progTimeLength);//保存视频总时长
                LMEPG.mp.play(); //启动播放
            } else {
                LMEPG.UI.showToast(data, 5);
                lmTVPlayAction.jumpBack(5);
            }
        };
        window.UtilsWithGDGD.getVideoInfo(titleAssetId, callback);
    },

    /**
     * 重庆电信获取播放串
     */
    getVideoInfo500092: function (videoId) {
        LMEPG.Log.info("videoId data >>> " + videoId);
        var iframe = '<iframe id="hidden_frame" name="hidden_frame" style="width: 0;height: 0;" src=""></iframe>';
        var div = document.createElement("div");
        document.body.appendChild(div);
        div.innerHTML = iframe;
        var serverPath = RenderParam.serverPath+"service/"+RenderParam.partner+"PlayURLByMCService.jsp?mediacode=";
        var mediacode = videoId+"&inIFrame=1&onSuccess=lmTVPlayAction.callBackPlayUrlResult&onError=0";
        var URL = serverPath+mediacode;
        LMEPG.Log.info("videoId URL >>> " + URL);
        G("hidden_frame").src = URL;
    },

    callBackPlayUrlResult:function(data){
        LMEPG.Log.info("videoId ruturn data >>> " + data);
        var json_data=JSON.parse(data);
        LMEPG.mp.initPlayer();
        LMEPG.mp.playOfFullscreen(json_data.resultSet[0]['playURL']);
    },

    /******************************************************************************************
     * 启动播放 - 方式一：通过获取iframe播放串url，然后传递给iframe.src，最后启动MediaPlayer播放。
     ******************************************************************************************/
    __startPlayWithIframe: function (carrierId, mediaCode, iframePlayUrl, extraData) {
        G("smallscreen").setAttribute("src", iframePlayUrl);
        LMEPG.mp.initPlayerByBindWithCustomUI(); // 具有自定义音量UI的初始化必须使用该方法！
    },

    /******************************************************************************************
     * 启动播放 - 方式二：非iframe设置src播放方式，直接启动MediaPlayer播放。
     ******************************************************************************************/
    __startPlayWithoutIframe: function (lmcid, mediaCode, nonIframePlayUrl, extraData) {
        // 不同平台的不同MediaPlayer调用方式
        switch (lmcid) {
            case "000051"://中国联通
                /*setTimeout(function () {
                    var stbModel = LMEPG.STBUtil.getSTBModel();
                    if (stbModel === "IP506H_54U3") {  //内蒙联通海信盒子
                        LMEPG.mp.initPlayerByBind();
                        LMEPG.mp.playOfFullscreen(lmTVParams.get_v_VideoUrl());
                    } else {
                        LMEPG.mp.initPlayer();
                        LMEPG.mp.playOfFullscreen(lmTVParams.get_v_VideoUrl());
                    }
                }, 500);*/
                LMEPG.mp.initPlayerMode1().playOfFullscreen(nonIframePlayUrl);
                break;
            case "220094"://吉林广电（联通）
            case "10220094"://吉林广电（联通）魔方
            case "220095"://吉林广电（电信）
            case "10220095"://吉林广电（电信）魔方
                LMEPG.Log.info("（吉林广电（联通）魔方）即将进入视频播放 地址是>>> " + nonIframePlayUrl);
                LMEPG.mp.initPlayerMode1().playOfFullscreen(nonIframePlayUrl);
                LMEPG.mp.play();
                break;
            case "440094"://广东广电
                LMEPG.mp.initPlayer().playOfFullscreen(nonIframePlayUrl);
                lmTVPlayAction.getVideoInfo440094(mediaCode);//获取视频信息
                break;
            case "510094"://四川广电
                LMEPG.mp.initPlayerByBind().playOfFullscreen(nonIframePlayUrl);
                break;
            case "650092"://新疆电信
            case "12650092"://新疆电信天天健身
                // 新疆通过iframe.getMediar获取播放串，以兼容某升级平台
                lmTVPlayAction.initPlayerByMediaStrFromHideFrame();
                break;
            case "500092"://重庆电信
                lmTVPlayAction.getVideoInfo500092(mediaCode);//获取视频信息
                break;
            default:
                setTimeout(function () {
                    LMEPG.mp.initPlayer().playOfFullscreen(nonIframePlayUrl);
                }, 500);
                break;
        }
    },

    /********************************************************
     * 启动全屏播放：唯一核心入口！！！
     ********************************************************/
    startFullScreenPlay: function () {
        lmTVLogPanel.log.i("[核心入口]-启动大窗播放......");

        var mediaCode = lmTVParams.get_v_VideoUrl();
        var fnSuccess = function (lmcid, mediaCode, isPlayWithIframe, finalPlayUrl, extraData) {
            lmTVLogPanel.log.i(LMEPG.Func.string.format("[终极播放串][iframe={0}]--地址:{1}", [isPlayWithIframe, finalPlayUrl]));
            if (isPlayWithIframe) {
                lmTVPlayAction.__startPlayWithIframe(lmcid, mediaCode, finalPlayUrl, extraData);
            } else {
                lmTVPlayAction.__startPlayWithoutIframe(lmcid, mediaCode, finalPlayUrl, extraData);
            }
        };
        var fnFailed = function (lmcid, mediaCode, isPlayWithIframe, errorMsg) {
            lmTVLogPanel.log.e(LMEPG.Func.string.format("[终极播放串][iframe={0}]--错误:{1}", [isPlayWithIframe, errorMsg]));
            switch (lmcid) {
                case "440094"://广东广电
                case "510094"://四川广电
                    LMEPG.UI.showToast(errorMsg, 5, "LMEPG.Intent.back()");
                    break;
                default:
                    LMEPG.UI.showToast(errorMsg);
                    break;
            }
        };

        var data = {
            mediaCode: mediaCode,
        };
        lmPlayUrlFetcher.initPlayJSParams(data);
        lmPlayUrlFetcher.fetchPlayUrl(data.mediaCode, fnSuccess, fnFailed);
    },

    /**
     * 播放结束/播放出错时，结束某些操作以节约资源。例如：计时器
     */
    release: function () {
        // 释放定时器
        lmTVLayout.releaseAll();
    },

    /**
     * 播放结束
     * @param isForcedEndManually [boolean] 是否强制播放结束
     */
    playToEnd: function (isForcedEndManually) {
        // 若某些地区盒子播放结束不会发现虚拟按钮768通知我们应用层，则程序会自动检测当前播放时长是否达到总时长。
        // 是，则手动置为结束，则就不再重复该方法后续操作，避免出错。
        if (lmTVLayout.globalMgr.get_g_uiPlayState() === LMEPG.mp.State.END) {
            return;
        }

        lmTVLayout.globalMgr.set_g_uiPlayState(LMEPG.mp.State.END); // 标记当前播放结束状态，以控制其它UI
        lmTVLayout.holdPage.initPlayOrReplay(true); // 创建重播按钮
        lmTVLayout.holdPage.initCollectOrNot(); // 初始化渲染 “收藏/取消收藏”相关控件
        lmTVLayout.holdPage.refreshDisplay(); // 刷新挽留推荐页“显示/隐藏”
        lmTVLayout.indicatorBar.showOrHideSpeedUI(false); //隐藏倍速图标
        lmTVLayout.progressBar.hide(true); //播放结束：强制隐藏进度条

        if (LMEPG.Func.array.contains(RenderParam.carrierId, ["650092","12650092"])
            && lmTVLayout.globalMgr.get_g_uiPlayState() === LMEPG.mp.State.END
            && lmTVGlobals.isHoldPageShowing()) {
            // 说明：当弹出推荐视频时，就启动自动播放视频的定时器。如果到5秒，定时器没有被释放（用户未按任何键移动焦点），就自动播放视频下一个推荐视频
            lmTVGlobals.set_hpShow_HasKeyMoved(false);
            var autoPlayTimer = setInterval(function () {
                if (!lmTVGlobals.is_hpShow_HasKeyMoved() && lmTVGlobals.increase_hpShow_DelayWhenNoKeyMoved() >= 5) {
                    window.clearInterval(autoPlayTimer) || (autoPlayTimer = null);
                    lmTVPlayAction.goAutoPlayVideo();
                }
            }, 1000);//1秒刷新一次
        }

        if (typeof isForcedEndManually !== "undefined" && !!isForcedEndManually) {
            LMEPG.mp.stop(); // 停止播放，释放资源
        }

        lmTVPlayAction.release(); // 释放资源
        G("play-progressbar-ball").style.left = lmTVLayout.progressBar.getWidth() + "px";
        G("video-current-play-time").innerHTML = LMEPG.Func.formatTimeInfo(1, LMEPG.mp.getMediaDuration());
        G("play-progressbar").style.width = lmTVLayout.progressBar.getWidth() + "px";
    },

}; // #End of Class$lmTVPlayAction

/****************************************************************
 * 播放按键事件
 *****************************************************************/
var lmTVBtnAction = {

    /** 按钮聚集/失焦事件 */
    onFocusChanged: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).style.backgroundImage = 'url("' + btn.focusImage + '")';
            if (btn.id.startWith("recommend-video")) { // 视频推荐位
                LMEPG.UI.Marquee.stop();
                LMEPG.UI.Marquee.start(btn.id + "-title", 10, 2, 50, "left", "scroll"); // 开启新的文字滚动
            }
        } else {
            G(btn.id).style.backgroundImage = 'url("' + btn.backgroundImage + '")';
            if (btn.id.startWith("recommend-video")) { // 视频推荐位
                LMEPG.UI.Marquee.stop();
            }
        }

        // 上一次的焦点保持记录
        if (lmTVGlobals.isHoldPageShowing() && hasFocus) {
            lmTVLayout.globalMgr.focusKeeper.record(btn.id);
        }

        // 表示焦点发生变化
        lmTVGlobals.set_hpShow_HasKeyMoved(true);
    },

    /** 按钮点击事件 */
    onClicked: function (btn) {
        // 按钮对象无效！
        if (!LMEPG.Func.isObject(btn)) {
            printLog("onClicked(btn)------->>> invalid button，拒绝操作！", true);
            return;
        }
        if(get_carrier_id() == '10220094' && btn.funcType === C.FuncType.EXIT){
            lmTVPlayAction.jumpBack();
            return;
        }

        switch (true) {
            // 挽留页1-4推荐位
            case btn.id.startWith("recommend-video-"):
                //线下视频处理
                if(btn.dataObj.show_status == '3'){
                    LMEPG.UI.showToast('该节目已下线');
                    break;
                }
                lmTVPlayAction.playVideo(btn);
                break;

            // 挽留页功能按钮：重播/继续播放
            case LMEPG.Func.array.contains(btn.funcType, [C.FuncType.RESUME, C.FuncType.REPLAY]):
                lmTVPlayAction.resumeOrReplay(btn);
                break;

            // 挽留页功能按钮：收藏/取消收藏
            case LMEPG.Func.array.contains(btn.funcType, [C.FuncType.COLLECT, C.FuncType.NO_COLLECT]):
                lmTVPlayAction.toggleCollectStatus();
                break;

            // 挽留页功能按钮：退出
            case btn.funcType === C.FuncType.EXIT:
                lmTVPlayAction.jumpBack();
                break;
        }
    }
};  // #End of Class$lmTVBtnAction

/**
 * <pre>
 * 初始化整个页面按钮。
 * [
 *      0~3：依次为挽留页1-4推荐位，
 *      4~6：依次为挽留页“继续播放/重播、收藏/取消收藏、退出”
 * ]
 * </pre>
 */
(function _init_buttons() {
    buttons = [
        // 0: recommend-video-1
        {
            id: "recommend-video-1",
            name: "挽留页-推荐位1",
            type: "div",
            focusable: true,
            backgroundImage: C.Pic.recommend_video_bg_unfocused,
            focusImage: C.Pic.recommend_video_bg_focused,
            nextFocusLeft: "recommend-video-4",//从第1个推荐视频，继续按左键循环移动到最右第4个推荐视频位上
            nextFocusRight: "recommend-video-2",
            nextFocusUp: lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine1,
            focusChange: lmTVBtnAction.onFocusChanged,
            click: lmTVBtnAction.onClicked,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 1: recommend-video-2
        {
            id: "recommend-video-2",
            name: "挽留页-推荐位2",
            type: "div",
            focusable: true,
            backgroundImage: C.Pic.recommend_video_bg_unfocused,
            focusImage: C.Pic.recommend_video_bg_focused,
            nextFocusLeft: "recommend-video-1",
            nextFocusRight: "recommend-video-3",
            nextFocusUp: lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine1,
            focusChange: lmTVBtnAction.onFocusChanged,
            click: lmTVBtnAction.onClicked,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 2: recommend-video-3
        {
            id: "recommend-video-3",
            name: "挽留页-推荐位3",
            type: "div",
            focusable: true,
            backgroundImage: C.Pic.recommend_video_bg_unfocused,
            focusImage: C.Pic.recommend_video_bg_focused,
            nextFocusLeft: "recommend-video-2",
            nextFocusRight: "recommend-video-4",
            nextFocusUp: lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine1,
            focusChange: lmTVBtnAction.onFocusChanged,
            click: lmTVBtnAction.onClicked,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 3: recommend-video-4
        {
            id: "recommend-video-4",
            name: "挽留页-推荐位4",
            type: "div",
            focusable: true,
            backgroundImage: C.Pic.recommend_video_bg_unfocused,
            focusImage: C.Pic.recommend_video_bg_focused,
            nextFocusLeft: "recommend-video-3",
            nextFocusRight: "recommend-video-1",//从第4个推荐视频，继续按右键循环移动到最左第1个推荐视频位上
            nextFocusUp: lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine1,
            focusChange: lmTVBtnAction.onFocusChanged,
            click: lmTVBtnAction.onClicked,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 4: operate-btn-1
        {
            id: "operate-btn-1",
            name: "挽留页-退出",
            type: "img",
            focusable: true,
            backgroundImage: C.Pic.finish_play_unfocused,
            focusImage: C.Pic.finish_play_focused,
            nextFocusLeft: "operate-btn-3",
            nextFocusDown: lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine2,
            nextFocusRight: "operate-btn-2",//从第3个按钮，继续按右键循环移动到最左第1个按钮上
            focusChange: lmTVBtnAction.onFocusChanged,
            click: lmTVBtnAction.onClicked,
            funcType: C.FuncType.EXIT //自定义属性
        },
        // 5: operate-btn-2
        {
            id: "operate-btn-2",
            name: "挽留页-重播/继续播放",
            type: "img",
            focusable: true,
            backgroundImage: "", //动态更新值
            focusImage: "", //动态更新值
            nextFocusLeft: "operate-btn-1",//从第1个按钮，继续按左键循环移动到最右第3个按钮上
            nextFocusDown: lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine2,
            nextFocusRight: "operate-btn-3",
            focusChange: lmTVBtnAction.onFocusChanged,
            click: lmTVBtnAction.onClicked,
            funcType: C.FuncType.RESUME //自定义属性
        },
        // 6: operate-btn-3
        {
            id: "operate-btn-3",
            name: "挽留页-收藏/取消收藏",
            type: "img",
            focusable: true,
            backgroundImage: "", //动态更新值
            focusImage: "", //动态更新值
            nextFocusLeft: "operate-btn-2",
            nextFocusRight: "operate-btn-1",
            nextFocusDown: lmTVLayout.globalMgr.focusKeeper.lastFocusedBtnIdOfLine2,
            focusChange: lmTVBtnAction.onFocusChanged,
            click: lmTVBtnAction.onClicked,
            funcType: C.FuncType.COLLECT //自定义属性
        }

    ];
})();

// 页面销毁前
window.onbeforeunload = function () {
    lmTVLogPanel.log.d("即将销毁页面...");
};

// 页面销毁
window.onunload = function () {
    lmTVLogPanel.log.d("销毁页面...");
    LMEPG.mp.destroy();  //释放播放器
    lmTVPlayAction.release(); // 释放其它资源
};

// 页面错误
window.onerror = function (message, filename, lineno) {
    lmTVLogPanel.log.e(LMEPG.Func.string.format("window.onerror[{0}]:{1}", [lineno, message]));
    var stbModelWithPT = LMEPG.STBUtil.getSTBModel() + (I_HD() ? "（高清）" : "（标清）");
    var errorLog = LMEPG.Func.string.format("window.onerror[{0}][捕获全局错误]：\nmessage:{1}\nfile_name:{2}\nline_NO:{3}", [stbModelWithPT, message, filename, lineno]);
    printLog(errorLog, true);
};

// 页面加载完成
window.onload = function () {
    lmTVLogPanel.log.filter(lmTVLogPanel.logLevel.none);//过滤显示日志级别
    lmTVLogPanel.log.d("加载完成页面...");

    // 1，首先，按当前模式需求，重写交互接口实现（必须根据实际场景需求实现！）
    init_playAPIs();

    // 2，其次，注册按键监听事件
    G("default_link").focus();  // 防止页面丢失焦点
    LMEPG.BM.init("", buttons);
    lmPlayerUtil.registerSpecialKeys();

    Network.savePlayerProgress(JSON.stringify(RenderParam.videoInfo));
    // 3，然后，初始化视频信息和UI状态
    lmTVParams.init_VideoInfo(RenderParam.videoInfo).set_v_CollectStatus(RenderParam.collectStatus);
    lmTVLayout.initRenderUI();

    // 4，最后，启动播放
    lmPlayAPI.doRefreshPlay(true, RenderParam.videoInfo);

    // 5，其它操作
    lmInitGo();
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