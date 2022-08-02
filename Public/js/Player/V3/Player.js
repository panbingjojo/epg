// +----------------------------------------------------------------------
// | 播放器模式V3（V3/Player）页面的js控制封装
// +----------------------------------------------------------------------
// | 使用该V3/Player特别之处：
// |    1. 新版UI的EPG播放器。
// |    2. 自定义进度条UI与音量UI，均位于底部。
// |    3. 播放状态图标（暂停/快进/快退）位于右上角。
// +----------------------------------------------------------------------
// | 目前应用地区：
// |     320092(江苏电信)   220094(吉林广电)    650092（新疆电信）
// |     510094(四川广电)
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/11/20
// +----------------------------------------------------------------------

// 调试代码：上线保证该变量关闭！！！
var debug_mode = false;

// TODO 通过Class类查找元素对象
function printObjInfo(obj, tag) {
    var strInfo = 'TAG->' + tag;
    try {
        if (typeof obj !== 'undefined' || obj) {
            strInfo = strInfo + ' ----> object[';
            for (var key in obj) {
                var strValue = key + '->';
                if (typeof (obj[key]) == 'function') {
                    strValue = strValue + 'function'; //+ obj[key];
                } else {
                    strValue = strValue + obj[key];
                }
                strValue = strValue + ',';
                strInfo = strInfo + strValue;
            }
            strInfo = strInfo + ']';
        } else {
            strInfo = strInfo + 'is null or undefined]';
        }
    } catch (e) {
        strInfo += '-->Exception: ' + e.toString();
    }
    return strInfo;
}

/** 判断是否为HD平台 */
function isHD() {
    return RenderParam.platformType === 'hd';
}

/** 统一DEBUG日志打印 */
function printLog(msg, errorLevel) {
    var logMsg = '[V3/Player.js]--->' + msg;
    if (errorLevel === true) {
        console.error(logMsg);
        if (LMEPG.Log) LMEPG.Log.error(logMsg);
    } else {
        console.log(logMsg);
        if (LMEPG.Log) LMEPG.Log.info(logMsg);
    }
}

/**
 * 判断某个值是否在指定数组中。因为使用Array.indexOf()是 === 全类型比较，所以不满足当前需要，
 * 我们只需要检测其内容是否相等即可。例如直接使用“[].indexOf()”有的盒子不支持，而且[]是一
 * 个object，故需要一个个遍历查找比较！[2018-11-23]
 * @param value 要检测的值
 * @param array 等检测值的参考范围数组
 * @return boolean true：包含。false：不包含
 */
function is_contains(value, array) {
    try {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) { // 注意：使用内容比较，不要用全等于“===”！！！
                return true;
            }
        }
    } catch (e) { // 防止参数不合法，出错。
        printLog('is_contains(' + value + ' , ' + array + ')--->Exception: ' + e.toString(), true);
    }
    return false;
}

function debug1(msg) {
    if (!debug_mode) return;
    var debug1 = G('debug1');
    if (!debug1) return;

    debug1.style.display = 'block';
    debug1.innerHTML =
        '*地区编号： ' + RenderParam.carrierId +
        '<br/>*盒子型号：' + LMEPG.STBUtil.getSTBModel() + (isHD() ? '（高清）' : '（标清）') +
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
    printLog('debug2:: ' + msg);
}

/****************************************************************
 * 全局控制变量声明
 *****************************************************************/
var UIFlags = {
    // 挽留页（Detain Page）显示标志
    isDetainPageShowing: false,

    // 用户是否已经触发按键焦点移动。（dpShow = Detain Page Showing，表示挽留页弹出显示中）
    // 例如，某些平台，播放结束弹出挽留页后，若指定时段内用户无按键移动操作，则会自动播放推荐视频。
    dpShow_HasKeyMoved: false,          //挽留页显示中：是否按过键移动了
    dpShow_CounterWhenNoKeyMoved: 0    //挽留页显示中：未按键任何键时的自动计数器（秒）
};

/****************************************************************
 * 全局常量声明。说明：C表示Const常量。
 *****************************************************************/
var C = {
    /** 图片 */
    Pic: {
        // 倍速相关图标
        play_indicator_speed_forward_bg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/play_indicator_forward_bg.png',
        play_indicator_speed_rewind_bg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/play_indicator_rewind_bg.png',
        play_indicator_pause_bg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/play_indicator_pause.png',

        // 音量相关图标
        volume_progress_dot: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/volume_progress.png',
        volume_switch_on: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/volume_on.png',
        volume_switch_off: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/volume_off.png',

        // 挽留页面相关图标
        detain_page_bg_playing: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/detain_page_bg_playing.png',        // 挽留页背景：播放中暂停时应用
        detain_page_bg_play_ended: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/detain_page_bg_play_ended.png',  // 挽留页背景：播放结束时应用

        // 推荐视频 选中/未选中 图片
        recommend_video_bg_unfocused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/recommend_video_bg_unfocused.png',
        recommend_video_bg_focused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/recommend_video_bg_focused.png',

        // “重播”图标：无焦点 / 有焦点
        replay_unfocused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/btn_replay_unfocused.png',
        replay_focused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/btn_replay_focused.png',

        // “继续播放”图标：无焦点 / 有焦点
        resume_replay_unfocused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/btn_play_continue_bg_unfocused.png',
        resume_replay_focused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/btn_play_continue_bg_focused.png',

        // “收藏/取消收藏”图标：无焦点 / 有焦点
        collect_unfocused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/btn_collect_bg_unfocused.png',
        collect_focused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/btn_collect_bg_focused.png',
        no_collect_unfocused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/btn_collect_bg_unfocused.png',
        no_collect_focused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/btn_collect_bg_focused.png',

        // “结束播放”图标：无焦点 / 有焦点
        finish_play_unfocused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/btn_finish_bg_unfocused.png',
        finish_play_focused: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V7/btn_finish_bg_focused.png'
    },

    /** 常用控件id */
    ID: {
        play_indicator_container: 'play-indicator-container', // 播放、暂停、倍速父容器
        play_indicator_img: 'play-indicator-bg',        // 播放、暂停、倍速图标
        play_indicator_text: 'play-indicator-text'     // 倍速显示文本
    },

    /** 按钮功能类型 */
    FuncType: {
        REPLAY: 'replay',                   // 重播
        RESUME: 'resume',                   // 继续播放
        COLLECT: 'collect',                 // 收藏
        NO_COLLECT: 'no_collect',           // 取消收藏
        EXIT: 'exit',                       // 退出
        RECOMMEND_VIDEO: 'recommend_video'  // 推荐视频
    },

    /** 方向标识，请勿修改！ */
    Dir: {
        UP: 'up',                           // 上
        DOWN: 'down',                       // 下
        LEFT: 'left',                       // 左
        RIGHT: 'right'                      // 右
    }
};

/****************************************************************
 * 按钮数组声明
 *****************************************************************/
var buttons = [];

/****************************************************************
 * 焦点保持控制（记录挽留页第1、2排的焦点状态）
 *****************************************************************/
var FocusKeeper = {
    lastFocusedBtnIdOfLine1: 'operate-btn-1',       // 离开第1排前的焦点按钮，默认为第1个
    lastFocusedBtnIdOfLine2: 'recommend-video-1',   // 离开第2排前的焦点按钮，默认为第1个
    record: function (currentFocusedBtnId) {   // 记录当前的焦点按钮id
        if (currentFocusedBtnId) {
            if (currentFocusedBtnId.startWith('operate-btn')) {
                this.lastFocusedBtnIdOfLine1 = currentFocusedBtnId;
            } else if (currentFocusedBtnId.startWith('recommend-video')) {
                this.lastFocusedBtnIdOfLine2 = currentFocusedBtnId;
            }
        }
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
        return objCurrent;
    },

    /** 页面跳转 - 播放器 */
    jumpPlayVideo: function (videoInfo) {
        var objCurrent = this.getCurrentPage();
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));
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
        objOrderHome.setParam('remark', remark);
        LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /** 页面跳转 - 专辑 */
    jumpAlbum: function (albumName) {
        var objCurrent = this.getCurrentPage();

        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('atFreeTime', 1);
        objAlbum.setParam('inner', 1);

        LMEPG.Intent.jump(objAlbum, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
};

/****************************************************************
 * 先声明当前的命名空间
 *****************************************************************/
var Player = {
    // 播放器页面控制唯一入口调用：必须调用！
    init: function () {
        // 初始化所有按钮
        _init_buttons();
    },

    /**
     * 功能：用于判断是否需要使用进度来判断是否播放完成.
     * 原因：因为某些平台的MediaPlayer并不会发送播放结束等信号，所以需要手动计算监听以停止及其UI等逻辑。
     *
     * @return {boolean} true：需要使用进度条来监听是否结束 false：不需要
     */
    isNeedListenProgressEnd: function () {
        switch (RenderParam.carrierId) {
            case '440094'://广东广电EPG
            case '510094'://四川广电EPG
            case '650092'://新疆电信EPG
            case '320092'://江苏电信EPG
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
            var isOnlyVIPPlay = videoInfo.userType == 2; // 0-不限，1-普通用户可看，2-仅限VIP用户可看（普通用户需要检查免费时长）
            return !isOnlyVIPPlay || videoInfo.freeSeconds > 0;
        }
    },

    /**
     * 实时获取当前“视频总时长、当前已播放时长”。注意：每个值为>=0的number类型。
     * @return {*[]} [视频总时长, 当前已播放时长]
     */
    getTimesArray: function () {
        var duration = LMEPG.mp.getMediaDuration();
        var currentPlayTime = LMEPG.mp.getCurrentPlayTime();

        // 强转数据类型。
        // 特别注意：盒子底层播放器MediaPlayer.getCurrentPlayTime()和MediaPlayer.getMediaDuration()返回可能是"string"
        // 类型，例如："25"。
        // 所以，若我们应用层要将其作为一个"number"类型来处理，比如：相加、比较大小等操作，我们需要强转
        if (typeof duration === 'string') {
            var durationTemp = parseInt(duration + '');
            if (!isNaN(durationTemp)) duration = durationTemp;
        }
        if (typeof currentPlayTime === 'string') { // 目前检测到：LMEPG.mp.getCurrentPlayTime()可能为"string"
            var currentPlayTimeTemp = parseInt(currentPlayTime + '');
            if (!isNaN(currentPlayTimeTemp)) currentPlayTime = currentPlayTimeTemp;
        }

        return [duration, currentPlayTime];
    },

    // 初始化默认焦点指向
    focusDefaultView: function () {
        LMEPG.BM.requestFocus('operate-btn-1');
    },

    /**
     * 创建  重播/继续播放  按钮
     * @param isPlayEnd 0-继续播放 1-重播
     */
    initPlayOrReplay: function (isPlayEnd) {
        debug2('Player.initPlayOrReplay(' + isPlayEnd + ')');
        var isReplayStatus = isPlayEnd == 1; // 是否变更为“重播”状态
        var initImgSrc = isReplayStatus ? C.Pic.replay_unfocused : C.Pic.resume_replay_unfocused;

        var domFocus_2_2 = G('operate-btn-2');
        if (LMEPG.Func.isExist(domFocus_2_2)) { // 已经创建过了，直接更改内容即可
            domFocus_2_2.setAttribute('src', initImgSrc);
        } else { // 未曾创建，新添加
            var btnContainer = G('operate-btn-container');
            var htmlStr = LMEPG.Func.isExist(btnContainer.innerHTML) ? btnContainer.innerHTML : ''; //加强判断
            htmlStr += '<img id="operate-btn-2" class="operate-btn-img" src="' + initImgSrc + '" alt="">';
            btnContainer.innerHTML = htmlStr;
        }

        // 按钮属性赋值
        buttons[5].name = isReplayStatus ? '重播' : '继续播放';
        buttons[5].backgroundImage = isReplayStatus ? C.Pic.replay_unfocused : C.Pic.resume_replay_unfocused;
        buttons[5].focusImage = isReplayStatus ? C.Pic.replay_focused : C.Pic.resume_replay_focused;
        buttons[5].funcType = isReplayStatus ? C.FuncType.REPLAY : C.FuncType.RESUME;
    },

    /**
     * 创建  收藏/取消收藏  按钮
     * @param collectStatus 变更当前的收藏状态 0-已收藏 1-未收藏
     */
    initCollectOrNot: function (collectStatus) {
        // 已经收藏过视频，不再显示“收藏按钮”
        if (collectStatus == 0) {
            return;
        }

        debug2('Player.initCollectOrNot(' + collectStatus + ')');
        var isCurrentCollectStatus = collectStatus == 0; // 当前是否为“已收藏”状态（注：UI上显示应该是取反的！）
        var initImgSrc = isCurrentCollectStatus ? C.Pic.collect_unfocused : C.Pic.no_collect_unfocused;

        var domFocus_2_3 = G('operate-btn-3');
        if (LMEPG.Func.isExist(domFocus_2_3)) { // 已经创建过了，直接更改内容即可
            domFocus_2_3.setAttribute('src', initImgSrc);
        } else { // 未曾创建，新添加
            var btnContainer = G('operate-btn-container');
            var htmlStr = LMEPG.Func.isExist(btnContainer.innerHTML) ? btnContainer.innerHTML : ''; //加强判断
            htmlStr += '<img id="operate-btn-3" class="operate-btn-img" src="' + initImgSrc + '" alt="">';
            btnContainer.innerHTML = htmlStr;
        }

        // 按钮属性赋值
        buttons[6].name = isCurrentCollectStatus ? '取消收藏' : '收藏';
        buttons[6].backgroundImage = isCurrentCollectStatus ? C.Pic.collect_unfocused : C.Pic.no_collect_unfocused;
        buttons[6].focusImage = isCurrentCollectStatus ? C.Pic.collect_focused : C.Pic.no_collect_focused;
        buttons[6].funcType = isCurrentCollectStatus ? C.FuncType.COLLECT : C.FuncType.NO_COLLECT;
    },

    // 加载推荐位视频数据（即挽留页显示的1-4号位视频数据） userId 当前用户id
    initRecommendVideoInfo: function (userId) {
        debug2('Player.initRecommendVideoInfo(' + userId + ')');
        var postData = {};
        if (RenderParam.carrierId === '650092') {
            postData = {
                'userId': userId,
                'videoUserType': 2 // 表示只取VIP可看的视频
            };
        } else {
            postData = {
                'userId': userId
            };
        }
        LMEPG.ajax.postAPI('Player/getRecommendVideoInfo', postData, function (rsp) {
            try {
                var gqPlayUrl = {};
                var bqPlayUrl = {};
                var title = {};
                var image_url = {};
                var userType = {};
                var sourceId = {};
                var freeTimes = {};
                var unionCode = {};

                var recommendData = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (LMEPG.Func.isObject(recommendData)) {
                    if (!LMEPG.Func.isArray(recommendData.data) || recommendData.data.length <= 0) {
                        return;
                    }

                    for (var i = 0; i < recommendData.data.length; i++) {
                        gqPlayUrl[i] = eval('(' + recommendData.data[i].ftp_url + ')').gq_ftp_url;
                        bqPlayUrl[i] = eval('(' + recommendData.data[i].ftp_url + ')').bq_ftp_url;
                        title[i] = recommendData.data[i].title;
                        image_url[i] = recommendData.data[i].image_url;
                        userType[i] = recommendData.data[i].user_type;
                        sourceId[i] = recommendData.data[i].source_id;
                        freeTimes[i] = recommendData.data[i].free_seconds;
                        unionCode[i] = recommendData.data[i].union_code;

                        // 推荐视频img及title的id，编号索引从1开始哦~
                        var vTitleId = 'recommend-video-' + (i + 1) + '-title';
                        var vImgId = 'recommend-video-' + (i + 1) + '-img';

                        G(vTitleId).innerText = title[i];
                        G(vImgId).src = RenderParam.imgHost + image_url[i];
                        G(vImgId).setAttribute('gqPlayUrl', gqPlayUrl[i]);
                        G(vImgId).setAttribute('bqPlayUrl', bqPlayUrl[i]);
                        G(vImgId).setAttribute('user_type', userType[i]);
                        G(vImgId).setAttribute('sourceId', sourceId[i]);
                        G(vImgId).setAttribute('title', title[i]);
                        G(vImgId).setAttribute('freeSeconds', freeTimes[i]);
                        G(vImgId).setAttribute('unionCode', unionCode[i]);

                        // 按钮属性赋值
                        buttons[i].funcType = C.FuncType.RECOMMEND_VIDEO;
                        buttons[i].dataObj = recommendData.data[i];
                    }
                } else { //抛出一个推荐视频数据异常，以便前端debug跟踪
                    throw 'The parsed result "RecommendData" is not an Object!';
                }
            } catch (e) {
                printLog('推荐视频数据处理异常：' + e.toString(), true);
                LMEPG.UI.showToast('推荐视频数据处理异常：' + e.toString());
            }
        });
    },

    // 切换右上角背景图片：暂停、快进、快退
    switchPlayIndicatorBg: function (playState) {
        switch (playState) {
            case LMEPG.mp.State.PAUSE:
                G(C.ID.play_indicator_img).src = C.Pic.play_indicator_pause_bg;
                G(C.ID.play_indicator_text).innerHTML = '';
                break;
            case LMEPG.mp.State.FAST_FORWARD:
                G(C.ID.play_indicator_img).src = C.Pic.play_indicator_speed_forward_bg;
                break;
            case LMEPG.mp.State.FAST_REWIND:
                G(C.ID.play_indicator_img).src = C.Pic.play_indicator_speed_rewind_bg;
                break;
            case LMEPG.mp.State.PLAY:
            default:
                G(C.ID.play_indicator_text).innerHTML = '';
                H(C.ID.play_indicator_container);
                break;
        }
    },


    /**
     * 显示倍速播放图标状态
     * @param show 显示还是隐藏“倍速”控件。true | false
     * @param dir 显示“倍速”控件的方向。left | right
     */
    setVisibilityForSpeedUI: function (show, dir) {
        if (show) {
            switch (dir) {
                case C.Dir.RIGHT:
                    debug2('Player.setVisibilityForSpeedUI(true, right)');
                    LMEPG.mp.fastForward();
                    Player.switchPlayIndicatorBg(LMEPG.mp.getPlayerState());
                    if (LMEPG.mp.isSpeedResumed()) {
                        hidePlayIndicatorViews();
                    }
                    break;
                case C.Dir.LEFT:
                    debug2('Player.setVisibilityForSpeedUI(true, left)');
                    LMEPG.mp.fastRewind();
                    Player.switchPlayIndicatorBg(LMEPG.mp.getPlayerState());
                    if (LMEPG.mp.isSpeedResumed() || LMEPG.mp.getCurrentPlayTime() == 0) {
                        hidePlayIndicatorViews();
                    }
                    break;
                default:
                    return;
            }

            // 显示倍速及倍速值
            if (is_contains(LMEPG.mp.getSpeed(), [2, 4, 8, 16, 32, 64])) {
                G(C.ID.play_indicator_text).innerHTML = LMEPG.mp.getSpeed() + 'X';
                S(C.ID.play_indicator_container);
            } else {
                H(C.ID.play_indicator_container);
            }
        } else {
            hidePlayIndicatorViews();
        }

        // 关闭播放提示器图标
        function hidePlayIndicatorViews() {
            // 取出“视频总时长、当前已播放时长”
            var mpTimes = Player.getTimesArray();
            //var totalDuration = mpTimes[0];
            var curPlayTime = mpTimes[1];

            // 若正处于 [暂停/快进/快退]，则继续保持当前指示器图标显示
            if (!is_contains(LMEPG.mp.getPlayerState(), [LMEPG.mp.State.PAUSE, LMEPG.mp.State.FAST_REWIND, LMEPG.mp.State.FAST_FORWARD])) {
                H(C.ID.play_indicator_container);
            }
            // 当快退到播放开始时，隐藏并重置倍速
            if (curPlayTime <= 1 && LMEPG.mp.getPlayerState() === LMEPG.mp.State.FAST_REWIND) {
                LMEPG.mp.setSpeed(1);//正常播放
                H(C.ID.play_indicator_container);
            }
        }
    },

    /**
     * 显示/隐藏 暂停按钮
     * @param show 显示还是隐藏“暂停”控件。true | false
     */
    setVisibilityForPauseUI: function (show) {
        if (show) {
            Player.switchPlayIndicatorBg(LMEPG.mp.State.PAUSE);
            S(C.ID.play_indicator_container);
        } else {
            H(C.ID.play_indicator_container);
        }
    },

    /**
     * 显示/隐藏 挽留页
     * @param show 显示还是隐藏“挽留页”。true | false
     */
    setVisibilityForDetainPageUI: function (show) {
        debug2('Player.setVisibilityForDetainPageUI(' + show + ')');
        UIFlags.isDetainPageShowing = show;
        G('detain-page').style.backgroundImage = 'url("' + (Player.Status.curPlayerState === LMEPG.mp.State.END
            ? C.Pic.detain_page_bg_play_ended : C.Pic.detain_page_bg_playing) + '")';
        if (show) {
            Show('detain-page');
        } else {
            Hide('detain-page');
        }
    },

    /**
     * 通过iFrame获取播放串mediaStr，再进行播放（使用此方式，是为了兼容某升级平台）
     */
    initPlayerByMediaStrFromHideFrame: function () {
        /*-新疆电信完整的地址：
         * var url = "rtsp://222.83.5.77/88888888/16/20181126/271503595/271503595.ts?rrsip=222.83.5.77&icpid=SSPID&accounttype=1&limitflux=-1&limitdur=-1&accountinfo=:20181227134822,testiptv233HD,10.131.236.20,20181227134822,CDWYPro514339651743116122,F706F94FB0B33E6E7DD96BB90F60A6E6,-1,0,3,-1,,1,,,,1,END";
         * var code = "CDWYPro514339651743116122"; //第三方的媒资ID
         */
        var mediaStr = '';
        var code = RenderParam.videoUrl;//我们平台的媒资ID

        // printLog(printObjInfo(window.frames['smallscreen'], '[smallscreen]')); // TODO DEBUG

        var loopTime = setInterval(function () {
            var iframe = window.frames['smallscreen'];

            // [临时加强处理]：用于处理弹出挽留推荐页时，点击“重播”或“任一推荐视频”进行新的播放时，某些款盒子会拿不到
            // window.frames['smallscreen'].getMediastr(code)这个方法。暂时未查出具体原因，在此先做特别处理（不影响其它）：
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
                    debug2(LMEPG.STBUtil.getSTBModel() + (isHD() ? "（高清）" : "（标清）") + "：iframe.getMediastr失败，切换默认方式！");
                    window.clearInterval(loopTime);
                    Player.initPlayerWithDomainUrl();
                }
                return;
            }

            mediaStr = iframe.getMediastr(code);
            if (mediaStr !== undefined && mediaStr.length > 1) {
                window.clearInterval(loopTime);
                LMEPG.mp.initPlayerMode1();
                LMEPG.mp.playOfFullscreen(mediaStr, false);
            }
            debug2("[新疆电信] getMediastr-->" + mediaStr);
        }, 1000);
    },

    /**
     * 初始化播放器：需要使用的第三方播放器前缀地址，即domainUrl有效才可调用该方法。
     */
    initPlayerWithDomainUrl: function () {
        debug2('Player.initPlayerWithDomainUrl->domainUrl: ' + RenderParam.domainUrl);
        setTimeout(function () {
            if (RenderParam.carrierId !== "650092") {
                if (!LMEPG.Func.isEmpty(RenderParam.domainUrl)) {
                    return;
                }
            }

            //var videoUrl="progcpaj0030a8275925000111956642";//第三方测试的注入id--江苏电信测试
            //var videoUrl="99100000012017120414241401167998";//公司注入的id--广西电信标清测试
            //var videoUrl="99100000012018113015544301259884";//第三方注入id--广西电信高清测试

            // HD/SD不同模式下的坐标宽高：left, top, width, height
            var coordinates = isHD() ? [0, 0, 1280, 720] : [0, 0, 644, 530];
            var left = coordinates[0], top = coordinates[1], width = coordinates[2], height = coordinates[3];

            var info = '';
            var thirdPlayerUrl = RenderParam.domainUrl;//默认用提供的前缀！特殊地区再根据接口拼接！
            switch (RenderParam.carrierId) {
                case '350092'://福建电信
                    info = LMEPG.mp.dispatcherUrl.getUrlWith350092(left, top, width, height, RenderParam.videoUrl);
                    break;
                case '640092'://宁夏电信
                    info = LMEPG.mp.dispatcherUrl.getFullScreenUrlWith640092(RenderParam.videoUrl);
                    break;
                case '630092'://青海电信
                    thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
                    thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
                    var port_index = thirdPlayerUrl.indexOf(':');
                    var path_index = thirdPlayerUrl.indexOf('/');
                    var result = thirdPlayerUrl.substring(port_index, path_index);
                    thirdPlayerUrl = thirdPlayerUrl.replace('+++', '://');
                    var lmpf = '', index = -1;
                    if (result === ':33200') {//华为端口
                        lmpf = 'huawei';
                        index = thirdPlayerUrl.indexOf('/EPG/');
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/EPG/';
                    } else {
                        lmpf = 'zte';
                        index = thirdPlayerUrl.lastIndexOf('/');
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/';
                    }
                    info = LMEPG.mp.dispatcherUrl.getUrlWith630092(left, top, width, height, RenderParam.videoUrl, lmpf);
                    break;
                case '650092':  //新疆电信
                    var stbDomainUrl = LMEPG.STBUtil.getEPGDomain();
                    var prefixObj = LMEPG.mp.dispatcherUrl.getUrlWith650092PrefixObj(stbDomainUrl);
                    thirdPlayerUrl = prefixObj.url;//第三方测试注入地址:CDWYPro543180802025700337
                    info = LMEPG.mp.dispatcherUrl.getUrlWith650092Suffix(left, top, width, height, RenderParam.videoUrl, prefixObj.isHW);
                    break;
                case '320092'://江苏电信-自定义UI播放器
                    info = LMEPG.mp.dispatcherUrl.getUrlWith320092(left, top, width, height, RenderParam.videoUrl);
                    break;
                default:
                    info = LMEPG.mp.dispatcherUrl.getUrlWith320092(left, top, width, height, RenderParam.videoUrl);
                    break;
            }

            var factUrl = thirdPlayerUrl + info;
            debug2('factUrl-->' + factUrl);
            G('smallscreen').setAttribute('src', factUrl);
            LMEPG.mp.initPlayerByBindWithCustomUI(); // 具有自定义音量UI的初始化必须使用该方法！
        }, 500);
    },

    /**
     * 吉林广电根据局方注入视频code获取真正的播放地址
     * @param videoId 注入到吉林广电的视频code
     */
    getPlayUrl220094: function (videoId) {

        if (LMEPG.Func.isEmpty(videoId)) {
            LMEPG.UI.showToast('无效的视频ID');
            return;
        }
        try {
            if (typeof window.top.jk39 !== 'undefined' && window.top.jk39 !== null && window.top.jk39.fetchPlayData !== undefined) {
                window.top.jk39.fetchPlayData({
                        type: window.top.jk39.PLAYTYPE.vod, //播放视频类型，玛朗39健康的默认vod
                        contentId: videoId, //节目ID，即注入的视频code
                        breakpoint: '0', //开始播放时间，可选，默认为0
                        categoryId: '', //栏目ID，可选
                        callback: function (playUrl, name) {
                            debug2('--->getPlayUrl220094--->callback: [' + videoId + ']-->[' + playUrl + ' , ' + name + ']');
                            LMEPG.mp.initPlayerMode1();
                            LMEPG.mp.playOfFullscreen(playUrl);
                            LMEPG.mp.play();
                        }
                    }
                );
            } else {
                debug2('getPlayUrl220094--->No "window.top.jk39.fetchPlayData" function!', true);
            }
        } catch (e) { //保护兼容
            debug2('getPlayUrl220094--->Exception: ' + e.toString());
            LMEPG.UI.showToast('获取播放地址发生异常！');
        }
    },

    /**
     * 吉林广电根据局方注入视频code获取真正的播放地址
     * @param videoId 注入到吉林广电的视频code
     */
    getPlayUrl220095: function (videoId) {
        if (LMEPG.Func.isEmpty(videoId)) {
            LMEPG.UI.showToast('无效的视频ID');
            return;
        }
        try {
            if (typeof window.top.bestv !== 'undefined' && window.top.bestv !== null && window.top.bestv.fetchPlayData !== undefined) {
                window.top.bestv.fetchPlayData({
                        type: window.top.bestv.PLAYTYPE.vod, //播放视频类型，玛朗39健康的默认vod
                        contentId: videoId, //节目ID，即注入的视频code
                        breakpoint: '0', //开始播放时间，可选，默认为0
                        categoryId: '', //栏目ID，可选
                        callback: function (playUrl, name) {
                            debug2('--->getPlayUrl220094--->callback: [' + videoId + ']-->[' + playUrl + ' , ' + name + ']');
                            LMEPG.mp.initPlayerMode1();
                            LMEPG.mp.playOfFullscreen(playUrl);
                            g_mp.play();
                        }
                    }
                );
            } else {
                debug2('getPlayUrl220095--->No "window.top.bestv.fetchPlayData" function!', true);
            }
        } catch (e) { //保护兼容
            debug2('getPlayUrl220095--->Exception: ' + e.toString());
            LMEPG.UI.showToast('获取播放地址发生异常！');
        }
    },

    /**
     * 四川广电根据局方注入视频媒资信息获取真正的播放地址
     * @param videoId 我方配置到后台的播放信息
     */
    getPlayUrl510094: function (videoId) {
        if (typeof SCGDPlayer === 'object') {
            SCGDPlayer.getMediaPlayUrl(videoId, function (playUrl, data) {
                printLog('getPlayUrl510094--->callback: [' + videoId + ']-->' + playUrl);
                LMEPG.mp.setMediaDuration(data.duration);
                LMEPG.mp.initPlayerByBind().playOfFullscreen(playUrl)
            }, function (errorMsg) {
                LMEPG.UI.showToast(errorMsg, 5, 'LMEPG.Intent.back()');
            });
        } else {
            LMEPG.UI.showToast('初始化失败！3秒后退出...', 3, 'LMEPG.Intent.back()');
        }
    },

    /**
     * 广东广电获取播放串
     */
    getPlayUrl440094: function (videoId) {
        var titleAssetId = videoId;
        //回调函数
        var callback = function (isSuccess, data) {
            printLog("getPlayUrl440094 ---- callback:" + data);
            if (isSuccess) {
                LMEPG.mp.initPlayer().playOfFullscreen(data);//初始化全屏播放器
                Player.getVideoInfo440094(titleAssetId);//获取视频信息
            } else {
                LMEPG.UI.showToast(data, 5);
                PlayerKeyEventManager.jumpBack(5);
            }
        };
        window.UtilsWithGDGD.getPlayUrl(titleAssetId, callback);
    },

    /**
     * 广东广电获取视频信息
     */
    getVideoInfo440094: function (titleAssetId) {
        //回调函数
        var callback = function (isSuccess, data) {
            printLog("getVideoInfo440094 ---- callback:" + data);
            if (isSuccess) {
                LMEPG.mp.setMediaDuration(data.progTimeLength);//保存视频总时长
                LMEPG.mp.play(); //启动播放
            } else {
                LMEPG.UI.showToast(data, 5);
                PlayerKeyEventManager.jumpBack(5);
            }
        };
        window.UtilsWithGDGD.getVideoInfo(titleAssetId, callback);
    },

    /** 初始化播放器 */
    initPlayerWithIframe: function () {
        debug2('Player.initPlayerWithIframe');
        switch (RenderParam.carrierId) {
            case '320092'://江苏电信
            case '450092'://广西电信
            case '630092'://青海电信
            case '350092'://福建电信
            case '640092'://宁夏电信
                Player.initPlayerWithDomainUrl();
                break;
            case '650092'://新疆电信
                Player.initPlayerByMediaStrFromHideFrame();
                break;
            case '000051'://中国联通
                // setTimeout(function () {
                //     var stbModel = LMEPG.STBUtil.getSTBModel();
                //     if (stbModel === 'IP506H_54U3') {  //内蒙联通海信盒子
                //         LMEPG.mp.initPlayerByBind();
                //         LMEPG.mp.playOfFullscreen(RenderParam.videoUrl);
                //     } else {
                //         LMEPG.mp.initPlayer();
                //         LMEPG.mp.playOfFullscreen(RenderParam.videoUrl);
                //     }
                // }, 500);
                LMEPG.mp.initPlayerMode1();
                LMEPG.mp.playOfFullscreen(RenderParam.videoUrl);
                break;
            case '220094'://吉林广电
            case '10220094'://吉林广电
                Player.getPlayUrl220094(RenderParam.videoUrl);
                break;
            case '220095'://吉林广电电信
                Player.getPlayUrl220095(RenderParam.videoUrl);
                break;
            case '510094'://四川广电
                Player.getPlayUrl510094(RenderParam.videoUrl);
                break;
            case '440094'://广东广电
                Player.getPlayUrl440094(RenderParam.videoUrl);
                break;
            default:
                setTimeout(function () {
                    LMEPG.mp.initPlayer();
                    LMEPG.mp.playOfFullscreen(RenderParam.videoUrl);
                }, 500);
                break;
        }
    },

    /**
     * 初始化或转换一些必要的JS参数，一般开头先调用。比如：video_url的协议地址转换等。
     */
    initJSPrams: function () {
        switch (RenderParam.carrierId) {
            case '000051': // 中国联通
            case '370093': // 山东联通
                //将http协议头转化为rtsp
                RenderParam.videoUrl = LMEPG.Func.http2rtsp(RenderParam.videoUrl);
                break;
            case '650092': // 新疆电信
                //新疆电信针对华为盒子EC6108V9U_pub_xjxdx获取不到播放器时长：先通过iframe获取getMediastr在进行播放
                var url = '';
                var code = RenderParam.videoUrl; //媒资ID (e.g. "CDWYPro514339651743116122")
                try {
                    var epgdomain = Authentication.CTCGetConfig('EPGDomain');
                    var last = epgdomain.indexOf('/jsp/');
                    var platform;
                    if (last === -1) {
                        last = epgdomain.lastIndexOf('/');
                        url = epgdomain.substr(0, last);
                        url += '/MediaService/SmallScreen';
                        platform = 'ZTE';
                    } else {
                        url = epgdomain.substr(0, last);
                        url += '/MediaService/SmallScreen.jsp';
                        platform = 'HW';
                    }
                    url += '?ContentID=' + code + '&Left=0&Top=0&Width=0&Height=0&CycleFlag=0&GetCntFlag=1';
                    if (platform === 'HW') {
                        url += '&ReturnURL=' + encodeURIComponent(document.referrer);
                    }
                } catch (e) {
                    url = '';
                }

                var iframe = Player.createEmptyIframe();
                if (iframe) iframe.setAttribute('src', url);
                break;
        }
    },

    /**
     * 动态创建iframe并返回
     * @return {Element} 返回创建的iframe对象。可能为null或者undefined，上层需要判断。
     */
    createEmptyIframe: function () {
        // 注：（再次加强）目前，非指定地区，暂不动态操作该iframe，以避免影响到其它地区的同样使用（需要测试通过才允许）
        if (RenderParam.carrierId !== '650092') {//新疆电信
            printLog('"createEmptyIframe" failed because of no support this area! : ' + RenderParam.carrierId, true);
            return null;
        }

        // 1. 在 <div id="smallvod"></div> 中创建iframe
        // 示例：
        // <div id="smallvod">
        //      <iframe id="smallscreen" name="smallscreen" src="about:blank"
        //              frameborder="0" scrolling="no"
        //              style="width: 0; height: 0; visibility: hidden">
        //      </iframe>
        // </div>
        var iframeContainer = G('smallvod');
        if (!iframeContainer) {
            iframeContainer = document.createElement('div');
            iframeContainer.id = 'smallvod';
            if (G('backg')) G('backg').appendChild(iframeContainer);
            else document.body.appendChild(iframeContainer);
        }

        // 2. 创建iframe对象并添加到容器中
        var iframe = G('smallscreen');
        if (iframe) Player.destroyIframe(iframe);

        iframe = document.createElement('iframe');

        // 设置iframe的样式
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.visibility = 'hidden';
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';
        iframe.id = 'smallscreen';//必须！
        iframe.name = 'smallscreen';//必须！
        iframe.src = 'about:blank';//空

        // 添加到iframe_container中
        iframeContainer.appendChild(iframe);

        return iframe;
    },

    /**
     * 销毁释放Iframe
     * @param iframe
     */
    destroyIframe: function (iframe) {
        // 注：（再次加强）目前，非指定地区，暂不动态操作该iframe，以避免影响到其它地区的同样使用（需要测试通过才允许）
        if (RenderParam.carrierId !== '650092') {//新疆电信
            return;
        }

        debug2('destroyIframe');
        if (typeof iframe === 'undefined' || iframe == null) iframe = G('smallscreen');
        if (!iframe) return;

        iframe.src = 'about:blank';//iframe指向空白页面，这样能够释放大部分内存
        try {
            iframe.contentWindow.document.write('');//清空iframe的内容
            iframe.contentWindow.document.close();//避免iframe内存泄漏
        } catch (e) {
        } finally {
            iframe.parentNode.removeChild(iframe);//把iframe从页面移除
        }
    },

    /**
     * 播放结束/播放出错时，结束某些操作以节约资源。例如：计时器
     */
    release: function () {
        // 释放定时器
        if (window.mpTimer) window.clearInterval(window.mpTimer);
        if (Player.Progress.autoSeekTimer) window.clearTimeout(Player.Progress.autoSeekTimer);
        if (Player.Progress.autoHideProgressTimer) window.clearTimeout(Player.Progress.autoHideProgressTimer);

        // 其它
        switch (RenderParam.carrierId) {
            case '650092': //新疆电信
                Player.destroyIframe();
                break;
        }
    },

    /**
     * 播放结束
     * @param forceEndManually [boolean] 是否强制播放结束
     */
    playToEnd: function (forceEndManually) {
        // 若某些地区盒子播放结束不会发现虚拟按钮768通知我们应用层，则程序会自动检测当前播放时长是否达到总时长。
        // 是，则手动置为结束，则就不再重复该方法后续操作，避免出错。
        if (Player.Status.curPlayerState === LMEPG.mp.State.END) {
            return;
        }

        Player.initPlayOrReplay(1); // 创建重播按钮
        Player.initCollectOrNot(RenderParam.collectStatus); // 初始化渲染 “收藏/取消收藏”相关控件
        Player.Status.curPlayerState = LMEPG.mp.State.END; // 播放结束
        Player.Status.refreshPlayState(); // 统一刷新是否显示挽留页
        Player.focusDefaultView(); // 设置默认焦点
        Player.setVisibilityForDetainPageUI(true); // 显示更多视频页
        Player.setVisibilityForSpeedUI(false); // 关闭倍速
        Player.Progress.hide(true); // 隐藏进度条

        if (RenderParam.carrierId === '650092'
            && Player.Status.curPlayerState === LMEPG.mp.State.END
            && UIFlags.isDetainPageShowing === true) {
            // 当弹出推荐视频时，就启动自动播放视频的定时器
            // 如果到5秒，定时器没有被释放，就自动播放视频
            UIFlags.dpShow_HasKeyMoved = false;
            var autoPlayTimer = setInterval(function () {
                if (!UIFlags.dpShow_HasKeyMoved && ++UIFlags.dpShow_CounterWhenNoKeyMoved >= 5) {
                    window.clearInterval(autoPlayTimer);
                    autoPlayTimer = null;
                    PlayerKeyEventManager.goAutoPlayVideo();
                }
            }, 1000);//1秒刷新一次
        }

        if (typeof forceEndManually !== 'undefined' && forceEndManually) {
            LMEPG.mp.destroy();                             // 停止播放，释放资源
        }
        Player.release();                                   // 释放资源
        G('play-progressbar-ball').style.left = Player.Progress.progressWidth + 'px';
        G('video-current-play-time').innerHTML = LMEPG.Func.formatTimeInfo(1, LMEPG.mp.getMediaDuration());
        G('play-progressbar').style.width = Player.Progress.progressWidth + 'px';
    }
};

/****************************************************************
 * 播放器页面状态控制：播放、暂停、前进、快退、收藏和取消收藏……
 *****************************************************************/
Player.Status = {

    // 当前播放状态：play|pause|fastRewind|fastForward|end
    curPlayerState: LMEPG.mp.State.PLAY,

    // 播放
    resume: function () {
        Player.setVisibilityForSpeedUI(false);
        Player.setVisibilityForPauseUI(false);
        LMEPG.mp.resume();
        debug2('Player.Status.resume()');
    },

    // 从倍速状态恢复
    resumeFromFastSeek: function () {
        Player.setVisibilityForSpeedUI(false);
        LMEPG.mp.resume();
        debug2('Player.Status.resumeFromFastSeek()');
    },

    // 暂停
    pause: function () {
        if (LMEPG.mp.getPlayerState() !== LMEPG.mp.State.PAUSE) debug2('Player.Status.pause()');
        Player.setVisibilityForPauseUI(true);
        LMEPG.mp.pause();
    },

    // 暂停正在播放
    pausePlaying: function () {
        Player.setVisibilityForSpeedUI(false);    // 隐藏倍速
        Player.Progress.hide(); // 隐藏进度条
        this.togglePlayerState();
        Player.focusDefaultView();
        debug2('Player.Status.pausePlaying()');
    },

    // 点击确认键播放或者暂停
    togglePlayerState: function () {
        if (this.curPlayerState === LMEPG.mp.State.PLAY) {
            this.curPlayerState = LMEPG.mp.State.PAUSE;
            LMEPG.mp.pause();
        } else if (this.curPlayerState === LMEPG.mp.State.PAUSE) {
            this.curPlayerState = LMEPG.mp.State.PLAY;
            LMEPG.mp.resume();
        } else if (this.curPlayerState === LMEPG.mp.State.END) {
            this.curPlayerState = LMEPG.mp.State.END;
        }

        this.refreshPlayState(); // 统一刷新是否显示挽留页
    },

    // 刷新播放状态
    refreshPlayState: function () {
        if (is_contains(this.curPlayerState, [LMEPG.mp.State.PAUSE, LMEPG.mp.State.END])) {
            Player.setVisibilityForDetainPageUI(true);
        } else if (this.curPlayerState === LMEPG.mp.State.PLAY) {
            Player.setVisibilityForDetainPageUI(false);
        }
    },

    // 收藏与取消收藏
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
                    // Player.initCollectOrNot(RenderParam.collectStatus); //TODO 新UI样式暂时不隐藏，收藏成功还可收藏，给出提示
                    //
                    // 加强用户体验：
                    // 如果在收藏/取消收藏过程中，用户就移动了按钮焦点。即：server响应时刻 > 用户变更当前收藏/取消收藏按钮焦点时刻，
                    // 当server变更收藏状态响应时，若当前记录的焦点按钮还是自己本身，则强制requestFocus以更新最新的UI焦点状态！
                    var currentFocusBtn = LMEPG.BM.getCurrentButton();
                    if (currentFocusBtn && currentFocusBtn.id === 'operate-btn-2') {
                        LMEPG.BM.requestFocus('operate-btn-2');
                    }
                    LMEPG.UI.showToast(RenderParam.collectStatus == 0 ? '收藏成功' : '取消收藏');
                } else {
                    LMEPG.UI.showToast((expectedStatus == 1 ? '取消收藏失败！' : '收藏失败！') + '[' + (jsonObj ? jsonObj.result : jsonObj) + ']');
                }
            } catch (e) {
                LMEPG.UI.showToast('发生异常，操作失败！');
                printLog('setCollectStatus-->error:' + e.toString(), true);
            }
        }, function (rsp) {
            // 请求失败
        });
    }
};

/****************************************************************
 * 播放器进度条控制
 *****************************************************************/
Player.Progress = {
    isProgressShow: false,                                 // 进度条是否显示
    autoHideProgressTimer: null,                           // 自动隐藏进度条定时器
    AUTO_HIDE_PROGRESS_TIME: 3 * 1000,                      // 自动隐藏菜单的时间，单位毫秒
    videoDuration: 0,                                       // 视频总时长
    progressWidth: isHD() ? 1048 : 482,                     // 进度条总的宽度：hd-1048 / sd-482
    indicatorWidth: 40,                                     // 进度条指示器的宽度
    currentSeekSecond: -1,                                  // 当前seek的秒数，只要>=0就表示正在seek
    seekStep: 10,                                           // 快进/快退单位时长，单位秒
    autoSeekTimer: 0,                                       // 快进/快退计时器
    LEFT_OFFSET_FLOAT_PLAY_TIME: isHD() ? 75 : 50,          // 悬浮时间的起始左偏移：hd-75 / sd-50，与css中保持一致


    /** 启动进度条计时器 */
    start: function () {
        debug2('Player.Progress.start');
        // 启动进度条的同时，显示并同时启动进度条显示/隐藏计时器，避免进度条从一开始播放就一直显示！
        if (!this.isProgressShow) {
            this.show();
        }

        // TODO 青海电信先show进度条的话，则不会再显示了，故启动计时器先show一下！
        Player.Progress.show();

        //进入页面时，视频需要一定的加载时间
        setTimeout(function () {
            Player.Progress.onProgress();
            window.mpTimer = setInterval(function () {
                Player.Progress.onProgress();
                // 检查免费时长 ，如果用户已经是vip，则不判断（isVip：1-是vip）
                if (RenderParam.isVip != 1) {
                    Player.Progress.checkFreeTime();
                }
            }, 1000);//1秒刷新一次
        }, 2500);
    },

    /** 播放菜单重新开始计时 */
    restart: function () {
        if (this.autoHideProgressTimer) clearTimeout(this.autoHideProgressTimer);
        this.autoHideProgressTimer = setTimeout(function () {
            Player.Progress.hide();
        }, this.AUTO_HIDE_PROGRESS_TIME);//3秒钟后自动隐藏
    },

    /** 获取播放总进度比例，返回介于0-1之间的小数 */
    getPlayRate: function () {
        var timeArray = Player.getTimesArray();
        var duration = timeArray[0];
        var currentPlayTime = timeArray[1];
        return duration > 0 && currentPlayTime >= 0 ? currentPlayTime / duration : 0;
    },

    // 显示进度条
    show: function () {
        this.isProgressShow = true;
        Show('playUI');
        this.restart();
    },

    // 隐藏进度条
    hide: function (forceHide) {
        // 若正处于 [暂停/快进/快退]，则继续保持当前指示器图标显示
        if (!forceHide && is_contains(LMEPG.mp.getPlayerState(), [LMEPG.mp.State.PAUSE, LMEPG.mp.State.FAST_REWIND, LMEPG.mp.State.FAST_FORWARD])) {
            if (this.autoHideProgressTimer) clearTimeout(this.autoHideProgressTimer);
            this.restart();
        } else {
            this.isProgressShow = false;
            Hide('playUI');
            if (this.autoHideProgressTimer) clearTimeout(this.autoHideProgressTimer);
        }
    },

    /** 进度条上的点的事件 */
    progressClick: function () {
        if (this.currentSeekSecond >= 0) {
            LMEPG.mp.playByTime(this.currentSeekSecond);
            this.resetSeekState();
        }
    },

    /** 重置seek的状态 */
    resetSeekState: function () {
        this.currentSeekSecond = -1;
    },

    /** 移动进度条上的点的操作。dir：left | right */
    beforeMoveIndicator: function (dir) {
        debug2('Player.Progress.beforeMoveIndicator(' + dir + ')');
        if (dir === C.Dir.LEFT || dir === C.Dir.RIGHT) {
            if (this.autoSeekTimer) clearTimeout(this.autoSeekTimer);

            // 取出“视频总时长、当前已播放时长”
            var timeArray = Player.getTimesArray();
            this.currentSeekSecond = parseFloat(this.currentSeekSecond < 0 ? timeArray[1] : this.currentSeekSecond);//当前seek时间
            this.videoDuration = this.videoDuration || timeArray[0]; //总时长

            this.currentSeekSecond = parseFloat(this.currentSeekSecond + (dir === C.Dir.LEFT ? -1 : 1) * this.seekStep);
            if (this.currentSeekSecond <= 0) {
                this.currentSeekSecond = 0;
            } else if (this.currentSeekSecond >= (this.videoDuration - 1)) {
                this.currentSeekSecond = parseFloat(this.videoDuration - 1);
            }

            var seekRate = this.currentSeekSecond / this.videoDuration;
            var progressLength = this.progressWidth * seekRate;

            G('play-progressbar').style.width = progressLength + 'px';
            if ((progressLength - this.indicatorWidth) < 0) {
                G('play-progressbar-ball').style.left = '0px';
            } else if ((progressLength - this.indicatorWidth) > (this.progressWidth - this.indicatorWidth / 2)) {
                G('play-progressbar-ball').style.left = (this.progressWidth - this.indicatorWidth / 2) + 'px';
            } else {
                G('play-progressbar-ball').style.left = (progressLength - this.indicatorWidth / 2) + 'px';
            }

            this.autoSeekTimer = setTimeout(function () {
                Player.Progress.progressClick();
            }, 500);
        }
        return false;
    },

    /**
     * 当用户为非vip(RenderParam.isVip=0/1表示VIP)且只有vip(RenderParam.userType==2)才可看时：
     * 检测免费时长，如果免费时长到了，就直接跳到局方计费页
     */
    checkFreeTime: function () {
        // 如果视频是vip才可以看，否则要判断免费播放时长。（userType：（0-不限，1-普通用户可看, 2-vip可看））
        if (parseInt(RenderParam.userType) == 2) {
            var curPlayTime = Player.getTimesArray()[1];

            debug1('当前播放时刻: ' + curPlayTime + ' s');
            if (curPlayTime >= RenderParam.freeSeconds) {
                clearInterval(window.mpTimer); // 释放定时器
                LMEPG.mp.destroy();
                // 如果isForbidOrder = 1，表示不允许订购，直接返回
                if (RenderParam.isForbidOrder == '1') {
                    LMEPG.UI.showToast('您已受限订购该业务，暂时不能订购!', 3, '');
                    LMEPG.UI.showToast('您已受限订购该业务，暂时不能订购!', 3, 'LMEPG.Intent.back()');
                } else {
                    Page.jumpBuyVip(RenderParam.videoInfo.title, RenderParam.videoInfo);
                }
            }
        }
    },

    /** 进度条回调接口 */
    onProgress: function () {
        // 取出“视频总时长、当前已播放时长”
        var mpTimes = Player.getTimesArray();
        var totalDuration = mpTimes[0];
        var curPlayTime = mpTimes[1];
        if (!UIFlags.isDetainPageShowing) {
            debug1('播放状态：' + LMEPG.mp.getPlayerState() + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                '倍速：' + LMEPG.mp.getSpeed() + '&nbsp;&nbsp;&nbsp;&nbsp;' +
                '播放进度：' + curPlayTime + '/' + totalDuration + '(s)');
        }

        // 显示“当前时长:总时长”。当读取到有效播放时刻(>0)后，才允许弹出悬浮当前播放时刻！
        if (!this.videoDuration) this.videoDuration = totalDuration;
        G('video-total-time').innerHTML = LMEPG.Func.formatTimeInfo(1, this.videoDuration); //设置总时长

        var pTime = LMEPG.Func.formatTimeInfo(1, curPlayTime);//设置当前播放时间
        if (pTime === '0-1:0-1') return; //表示读时间进度有问题，不给予更新时间

        G('video-current-play-time').innerHTML = pTime;
        G('floating-play-time-text').innerHTML = pTime;

        if (curPlayTime > 0) {
            S('floating-play-time-container');
        } else {
            H('floating-play-time-container');
        }

        //更新进度条UI比例效果
        var rate = this.getPlayRate();       //当前播放的比例，取值0-1
        var progressLength = rate * this.progressWidth;//进度条的长度
        if (this.currentSeekSecond < 0) {
            // (progressLength - X)：X为微调的偏移量，不减它会产生超前进度小球一小段距离！高清-6，标清-3
            G('play-progressbar').style.width = (progressLength - 6) + 'px';
            if (progressLength === 0) {
                G('play-progressbar-ball').style.left = '0px';
                G('floating-play-time-container').style.left = this.LEFT_OFFSET_FLOAT_PLAY_TIME + 'px'; // 起始左偏移：hd-75 / sd-40，与css中保持一致
                LMEPG.mp.resume();
            } else if (progressLength > this.indicatorWidth / 2) {
                G('play-progressbar-ball').style.left = (progressLength - this.indicatorWidth / 2) + 'px';
                G('floating-play-time-container').style.left = (progressLength - this.indicatorWidth / 2 + this.LEFT_OFFSET_FLOAT_PLAY_TIME) + 'px';
            }
        }

        // 为了解决烽火盒子对快退播放视频，重新播放时，快退的UI界面没有隐藏问题
        if (this.currentSeekSecond < 2) {
            Player.setVisibilityForSpeedUI(false);
        }

        // 防止当视频未加载完，用户按返回键已弹出挽留页，避免此时视频加载完回来继续播放，应当暂停播放
        if (UIFlags.isDetainPageShowing) {
            Player.Status.pause();
            Player.setVisibilityForPauseUI(false);
        }

        // 注：最后操作！！！
        // 针对某些地区盒子，播放结束后不会发出结束虚拟按键，以致于无法知道是否播放完毕。
        // 对此，目前解决办法为：比较“当前播放时长和总时长”，当二者相等是，则认为播放结束。
        try {
            if (Player.isNeedListenProgressEnd()) {
                // CASE-->广东广电
                if (RenderParam.carrierId === '440094') {
                    if (curPlayTime >= totalDuration && curPlayTime > 30/*TODO: 不知道为什么写30？试看时长(那应用RenderParam.freeSeconds啊)？*/) {
                        Player.playToEnd();
                        return;
                    }
                }

                // CASE-->默认处理！
                // 提前1s结束。因为存在可能既不发768虚拟结束信号，获取的currentPlayTime到不了视频的最后1s情况，就无法
                // 知道是否结束。此行提前1s判断，尝试解决。
                var ALLOW_OFFSET_SEC = 1;
                if (curPlayTime > 0 && totalDuration > 0 && (curPlayTime + ALLOW_OFFSET_SEC) >= totalDuration) {
                    setTimeout(function () {
                        Player.playToEnd(true);
                    }, 1000 * ALLOW_OFFSET_SEC/*注：由于(curPlayTime+ALLOW_OFFSET_SEC) >= totalDuration)多加1s判断了，故延迟1s执行，保证时差抵消*/);
                }
            }
        } catch (e) {
            printLog('Player$onProgress()-----> error:' + e.toString(), true);
        }

    }, // #End of Player.Progress.onProgress();

    /**
     * 音量控制管理
     */
    Volume: {
        autoHideVolumeProgressTimer: null,          // 自动隐藏音量调节进度条定时器
        AUTO_HIDE_VOLUME_PROGRESS_TIME: 3 * 1000,   // 自动隐藏音量进度条的时间，单位毫秒

        // 音量（Volume）调节。param：volumeValue 当前的音频值
        showVolumeProgressBar: function (volumeValue) {
            S('volumeUI');//进度条外圈UI
            this.moveVolumeProgressBar(volumeValue); // 移动音频进度条
            this.restartVolumeProgress();
        },

        // 当静音开/关后，显示开关
        toggleVolumeMuteUI: function (muted) {
            var cVolumeValue = LMEPG.mp.getCurrentVolume();
            this.showVolumeProgressBar(cVolumeValue);
            G('volume-switch').setAttribute('src', muted || cVolumeValue <= 0 ? C.Pic.volume_switch_off : C.Pic.volume_switch_on);
        },

        // 隐藏音量度
        hideVolumeProgressBar: function () {
            H('volumeUI');
        },

        // 移动音频进度条。param：volumeValue 当前的音频值 [0, 100]
        moveVolumeProgressBar: function (volumeValue) {
            var progress = volumeValue / 5; // 每5个单位值显示作为一个单位进度等级
            var domVolume = G('volume-progressbar-container');
            domVolume.innerHTML = '';
            var htmlStr = '';
            for (var i = 0; i < progress; i++) {
                htmlStr += '<img class="volume-progress" src="' + C.Pic.volume_progress_dot + '" alt=""/>';
            }
            domVolume.innerHTML = htmlStr;
            G('volume-value').innerHTML = progress + '';
            G('volume-switch').setAttribute('src', progress <= 0 ? C.Pic.volume_switch_off : C.Pic.volume_switch_on);
        },

        // 音量调节进度度显示开始计时
        restartVolumeProgress: function () {
            if (this.autoHideVolumeProgressTimer) clearTimeout(this.autoHideVolumeProgressTimer);
            this.autoHideVolumeProgressTimer = setTimeout(function () {
                Player.Progress.Volume.hideVolumeProgressBar();
            }, Player.Progress.Volume.AUTO_HIDE_VOLUME_PROGRESS_TIME);// 5秒钟后自动隐藏
        }
    } // #End of Player.Progress.Volume

};

/****************************************************************
 * 按键监听控制
 *****************************************************************/
var PlayerKeyEventManager = {

    /**
     * 返回上一页
     * @param delayInSec [可选] 延时。
     */
    jumpBack: function (delayInSec) {
        if (typeof delayInSec === 'number' && delayInSec > 0) {
            setTimeout(function () {
                LMEPG.Intent.back();
            }, delayInSec * 1000);
        } else {
            LMEPG.Intent.back();
        }
    },

    /** 返回键 */
    onBack: function () {
        if (UIFlags.isDetainPageShowing) {  // 退出播放器页面
            if (RenderParam.carrierId === '220094' || RenderParam.carrierId === '10220094') { // TODO 应吉林广电局方要求，继续返回不退出而是返回播放状态（Songhui 2019-6-4）
                PlayerKeyEventManager.resumeOrReplay(LMEPG.BM.getButtonById('operate-btn-2')/*继续播放*/);
            } else {
                this.jumpBack();
            }
        } else {                    // 隐藏进度条
            Player.setVisibilityForPauseUI(false); // 如果是从“暂停”状态按返回键到“挽留页”，先隐藏暂停按钮
            Player.Status.pausePlaying();
            Player.Progress.hide(true); // 弹出挽留页，如果正在显示播放戟，则强制隐藏
        }
    },

    /** 上键。*/
    onKeyUp: function (currentBtnObj) {
        if (UIFlags.isDetainPageShowing) {
            if (currentBtnObj.id.startWith('recommend-video')) {
                LMEPG.BM.requestFocus(FocusKeeper.lastFocusedBtnIdOfLine1);
            }
        } else {
            Player.Progress.show();
        }
    },

    /** 下键。*/
    onKeyDown: function (currentBtnObj) {
        if (UIFlags.isDetainPageShowing) {
            if (currentBtnObj.id.startWith('operate-btn')) {
                LMEPG.BM.requestFocus(FocusKeeper.lastFocusedBtnIdOfLine2);
            }
        } else {
            Player.Progress.show();
        }
    },

    /** 左键。*/
    onKeyLeft: function (currentBtnObj) {
        if (UIFlags.isDetainPageShowing) {
            // 这里应用层不做处理，由按钮框架内部处理
        } else {
            Player.Progress.show();
            switch (LMEPG.mp.getPlayerState()) {
                case LMEPG.mp.State.PLAY:
                    Player.setVisibilityForSpeedUI(true, C.Dir.LEFT);
                    break;
                case LMEPG.mp.State.PAUSE:
                    Player.Progress.beforeMoveIndicator(C.Dir.LEFT);
                    Player.setVisibilityForPauseUI(false);
                    break;
                case LMEPG.mp.State.FAST_REWIND:
                    Player.setVisibilityForSpeedUI(true, C.Dir.LEFT);
                    break;
                case LMEPG.mp.State.FAST_FORWARD:
                    Player.setVisibilityForSpeedUI(true, C.Dir.LEFT);
                    break;
            }
        }
    },

    /** 右键。*/
    onKeyRight: function (currentBtnObj) {
        if (UIFlags.isDetainPageShowing) {
            // 这里应用层不做处理，由按钮框架内部处理
        } else {
            Player.Progress.show();
            switch (LMEPG.mp.getPlayerState()) {
                case LMEPG.mp.State.PLAY:
                    Player.setVisibilityForSpeedUI(true, C.Dir.RIGHT);
                    break;
                case LMEPG.mp.State.PAUSE:
                    Player.Progress.beforeMoveIndicator(C.Dir.RIGHT);
                    Player.setVisibilityForPauseUI(false);
                    break;
                case LMEPG.mp.State.FAST_REWIND:
                    Player.setVisibilityForSpeedUI(true, C.Dir.RIGHT);
                    break;
                case LMEPG.mp.State.FAST_FORWARD:
                    Player.setVisibilityForSpeedUI(true, C.Dir.RIGHT);
                    break;
            }
        }
    },

    // 自动播放视频 -- 默认播放第一条视频
    goAutoPlayVideo: function () {
        printLog('timer auto play video 1');
        var btn = {
            id: 'recommend-video-1'
        };
        PlayerKeyEventManager.playVideo(btn);
    },

    /** “确定”按键 */
    onEnterKeyClicked: function () {
        if (UIFlags.isDetainPageShowing) {  // 挽留页按钮点击“确定”按钮
            var focusBtnObj = LMEPG.BM.getCurrentButton();
            ButtonAction.onClick(focusBtnObj);
        } else {                // 播放视频中点击“确定”按钮
            Player.Progress.show();
            switch (LMEPG.mp.getPlayerState()) {
                case LMEPG.mp.State.PLAY:
                    Player.Status.pause();
                    break;
                case LMEPG.mp.State.PAUSE:
                    Player.Status.resume();
                    break;
                case LMEPG.mp.State.FAST_REWIND:
                case LMEPG.mp.State.FAST_FORWARD:
                    Player.Status.resumeFromFastSeek();
                    break;
            }
        }
    },

    /** “静音”按键 */
    onMuteKeyClicked: function () {
        var muteFlag = LMEPG.mp.toggleMuteFlag();
        var hasMuted = muteFlag === LMEPG.mp.MuteFlag.ON;

        if (RenderParam.carrierId === '440094') {
            LMEPG.UI.showToast('静音：' + (hasMuted ? '开' : '关'));
        } else {
            Player.Progress.Volume.toggleVolumeMuteUI(hasMuted);
        }
    },

    /** “虚拟”按键 */
    onVirtualKeyClicked: function () {
        eval('oEvent = ' + Utility.getEvent());
        var keyCode = oEvent.type;
        debug2(LMEPG.Func.string.format("虚拟事件：[{0}]-->oEvent: {1}", [keyCode, JSON.stringify(onEvent)]));
        if (!LMEPG.mp.bind(oEvent)) {
            debug2('虚拟事件：[' + keyCode + ']-->收到虚拟重新绑定::false');
            return;
        }

        if (LMEPG.mp.isEnd(keyCode)) { //播放结束
            if (RenderParam.isVip != 1 && parseInt(RenderParam.userType) == 2) {
                clearInterval(window.mpTimer); // 释放定时器
                LMEPG.mp.destroy();

                // 如果isForbidOrder = 1，表示不允许订购，直接返回
                if (RenderParam.isForbidOrder == '1') {
                    LMEPG.UI.showToast('您已受限订购该业务，暂时不能订购!', 3, 'LMEPG.Intent.back()');
                } else {
                    Page.jumpBuyVip(RenderParam.videoInfo.title, RenderParam.videoInfo);
                }
            } else {
                Player.playToEnd();
            }
        } else if (LMEPG.mp.isError(keyCode)) {// 播放错误
        } else if (LMEPG.mp.isBeginning(keyCode)) {
            G('play-progressbar-ball').style.left = '0px';
            Player.setVisibilityForSpeedUI(false);
            Player.setVisibilityForPauseUI(false);
        } else if (UIFlags.isDetainPageShowing) { // 修正当弹出推荐视频后，当视频数据缓冲结束会自动播放视频的问题
            LMEPG.mp.pause();
        }
    },

    /** “音量+/-”按键 */
    onVolumeChanged: function (dir) {
        if (dir === C.Dir.UP) {                  // 音量+
            Player.Progress.Volume.showVolumeProgressBar(LMEPG.mp.upVolume());
        } else if (dir === C.Dir.DOWN) {         // 音量-
            Player.Progress.Volume.showVolumeProgressBar(LMEPG.mp.downVolume());
        }
    },

    /** “快进/快退”按键。dir：left|right */
    onSpeedChanged: function (dir) {
        if (UIFlags.isDetainPageShowing) {
            // 这里应用层不做处理，由按钮框架内部处理
        } else {
            if (dir === C.Dir.RIGHT) {           // 快进
                Player.Progress.show();
                this.onKeyRight();
            } else if (dir === C.Dir.LEFT) {     // 快退
                Player.Progress.show();
                this.onKeyLeft();
            }
        }
    },

    /** “上/下/左/右”按键。dir必为之一：up/down/left/right */
    onDirectionKeyMoved: function (dir) {
        if (UIFlags.isDetainPageShowing) {  // 暂停状态：弹出挽留页。使用框架内部统一处理挽留页按钮移动焦点行为。
            LMEPG.BM._onMoveChange(dir);
        } else {                // 播放状态：非挽留页。根据需要自定义行为。
            switch (dir) {
                case C.Dir.UP:
                case C.Dir.DOWN:
                    // 播放状态按上/下键则显示底部的进度条
                    Player.Progress.show();
                    break;
                case C.Dir.LEFT:
                case C.Dir.RIGHT:
                    PlayerKeyEventManager.onSpeedChanged(dir);
                    break;
            }
        }
    },

    /**
     * 遥控器“播放键”按下： 仅当正处于“结束/暂停/快进/快退”状态中，按下才切换为播放状态。否则，忽略之！
     */
    onPlayKeyClicked: function () {
        if (UIFlags.isDetainPageShowing) {
            // 弹出挽留页情况：暂停/结束 ---> 续播或重播
            debug2('按下“播放键”：[挽留状态]');
            PlayerKeyEventManager.resumeOrReplay(LMEPG.BM.getButtonById('operate-btn-2')/*继续播放*/);
        } else {
            // 非挽留页情况：快进/快退 ---> 正常倍速恢复 （正常播放，则无须重复操作）
            if (is_contains(LMEPG.mp.getPlayerState(), [LMEPG.mp.State.PAUSE, LMEPG.mp.State.FAST_REWIND, LMEPG.mp.State.FAST_FORWARD])) {
                debug2('按下“播放键”：[当前状态:' + LMEPG.mp.getPlayerState() + ']');
                Player.Status.resume();
            }
        }
    },

    /**
     * 遥控器“暂停键”按下： 仅当正处于“播放/快进/快退”状态中，按下才切换为暂停状态。否则，忽略之！
     */
    onPauseKeyClicked: function () {
        if (UIFlags.isDetainPageShowing) {
            // 弹出挽留页情况：忽略
            debug2('按下“暂停键”：[挽留页状态，暂停无效]');
        } else {
            // 非挽留页情况：快进/快退 ---> 正常倍速恢复 （正常播放，则无须重复操作）
            if (is_contains(LMEPG.mp.getPlayerState(), [LMEPG.mp.State.PLAY, LMEPG.mp.State.FAST_REWIND, LMEPG.mp.State.FAST_FORWARD])) {
                debug2('按下“暂停键”：[当前状态:' + LMEPG.mp.getPlayerState() + ']');
                Player.Status.pause();
            }
        }
    },

    /** 重播 或 继续播放 */
    resumeOrReplay: function (btn) {
        debug2('重播/续播(' + (btn.funcType === C.FuncType.RESUME) + ')');
        if (btn.funcType === C.FuncType.RESUME) {
            Player.Progress.hide(); //隐藏进度条
            Player.Status.togglePlayerState();
        } else {
            window.location.reload();
        }
    },

    /** 点击播放挽留页推荐视频之一 */
    playVideo: function (btn) {
        // 加强判断处理：非点击挽留页推荐视频，拒绝播放
        if (!UIFlags.isDetainPageShowing) {
            printLog('playVideo(btn)------->>> 非挽留页推荐视频点击，拒绝操作！', true);
            return;
        }
        // 按钮对象无效：拒绝播放
        if (typeof btn !== 'object' && btn != null) {
            printLog('playVideo(btn)------->>> invalid button，拒绝操作！', true);
            return;
        }

        var btnId = btn.id;
        if (btnId.startWith('recommend-video')) {
            //得到播放地址
            var videoInfo = {
                'sourceId': G(btnId).getElementsByTagName('img')[0].getAttribute('sourceId'),
                'videoUrl': G(btnId).getElementsByTagName('img')[0].getAttribute(isHD() ? 'gqPlayUrl' : 'bqPlayUrl'),
                'title': G(btnId).getElementsByTagName('img')[0].getAttribute('title'),
                'type': '',
                'userType': G(btnId).getElementsByTagName('img')[0].getAttribute('user_type'),
                'freeSeconds': G(btnId).getElementsByTagName('img')[0].getAttribute('freeSeconds'),
                'unionCode': G(btnId).getElementsByTagName('img')[0].getAttribute('unionCode'),
                'entryType': 1,
                'entryTypeName': 'play'
            };
            if (!videoInfo.userType && !videoInfo.sourceId) {
                LMEPG.UI.showToast('播放错误：无效的视频资源！');
                return;
            }
            //=================================================================//
            //  视频的播放策略（userType：0-不限，1-普通用户可看, 2-vip可看）  //
            //=================================================================//
            printLog('play recommend videoInfo:' + JSON.stringify(videoInfo));
            if (Player.allowPlayVideo(videoInfo)) {
                // 直接播放推荐视频
                Page.jumpPlayVideo(videoInfo);
            } else {
                // 如果isForbidOrder = 1，表示不允许订购，直接返回
                if (RenderParam.isForbidOrder == '1') {
                    LMEPG.UI.showToast('您已受限订购该业务，暂时不能订购!', 3, 'LMEPG.Intent.back()');
                } else {
                    // “非VIP用户” 且 “仅限VIP用户” 且 “免费试看时长为0”，则直接跳转到VIP限制订购
                    Page.jumpBuyVip(videoInfo.title, videoInfo);
                }
            }
        }
    },

    /** 注册监听特殊按键 */
    registerSpecialKeys: function () {
        debug2('PlayerKeyEventManager.registerSpecialKeys');
        LMEPG.KeyEventManager.init();
        LMEPG.KeyEventManager.addKeyEvent(
            {
                KEY_BACK: 'PlayerKeyEventManager.onBack()',                                         // 返回
                KEY_ENTER: 'PlayerKeyEventManager.onEnterKeyClicked()',                             // 确定
                KEY_MUTE: 'PlayerKeyEventManager.onMuteKeyClicked()',                               // 静音
                KEY_VIRTUAL_EVENT: 'PlayerKeyEventManager.onVirtualKeyClicked()',                   // 虚拟按键
                EVENT_MEDIA_END: 'PlayerKeyEventManager.onVirtualKeyClicked()',                     // 虚拟按键
                EVENT_MEDIA_ERROR: 'PlayerKeyEventManager.onVirtualKeyClicked()',                   // 虚拟按键
                KEY_VOL_UP: 'PlayerKeyEventManager.onVolumeChanged("' + C.Dir.UP + '")',            // 音量+
                KEY_VOL_DOWN: 'PlayerKeyEventManager.onVolumeChanged("' + C.Dir.DOWN + '")',        // 音量+
                KEY_DELETE: 'PlayerKeyEventManager.onBack()',                                       // 兼容辽宁华为EC2108V3H的删除键（返回键）
                KEY_FAST_FORWARD: 'PlayerKeyEventManager.onSpeedChanged("' + C.Dir.RIGHT + '")',    // 快进>>
                KEY_FAST_REWIND: 'PlayerKeyEventManager.onSpeedChanged("' + C.Dir.LEFT + '")',      // 快退<<
                KEY_UP: 'PlayerKeyEventManager.onDirectionKeyMoved("' + C.Dir.UP + '")',            // 上键
                KEY_DOWN: 'PlayerKeyEventManager.onDirectionKeyMoved("' + C.Dir.DOWN + '")',        // 下键
                KEY_LEFT: 'PlayerKeyEventManager.onDirectionKeyMoved("' + C.Dir.LEFT + '")',        // 左键
                KEY_RIGHT: 'PlayerKeyEventManager.onDirectionKeyMoved("' + C.Dir.RIGHT + '")',      // 右键
                KEY_EXIT: 'PlayerKeyEventManager.jumpBack()',                                       // 退出按键
                KEY_PLAY: 'PlayerKeyEventManager.onPlayKeyClicked()',                               // 播放按键
                KEY_PLAY_PAUSE: 'PlayerKeyEventManager.onPauseKeyClicked()'                        // 暂停按键
            }
        );
    }
};

/****************************************************************
 * Button事件
 *****************************************************************/
var ButtonAction = {
    beforeMoveChange: function (dir, current) {
        switch (dir) {
            case C.Dir.LEFT:
                PlayerKeyEventManager.onKeyLeft(current);
                break;
            case C.Dir.RIGHT:
                PlayerKeyEventManager.onKeyRight(current);
                break;
            case C.Dir.UP:
                PlayerKeyEventManager.onKeyUp(current);
                break;
            case C.Dir.DOWN:
                PlayerKeyEventManager.onKeyDown(current);
                break;
        }
    },

    onFocusChange: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).style.backgroundImage = 'url("' + btn.focusImage + '")';
            if (btn.id.startWith('recommend-video')) { // 视频推荐位
                LMEPG.UI.Marquee.stop();
                LMEPG.UI.Marquee.start(btn.id + '-title', 10, 2, 50, 'left', 'scroll'); // 开启新的文字滚动
            }
        } else {
            G(btn.id).style.backgroundImage = 'url("' + btn.backgroundImage + '")';
            if (btn.id.startWith('recommend-video')) { // 视频推荐位
                LMEPG.UI.Marquee.stop();
            }
        }

        // 上一次的焦点保持记录
        if (UIFlags.isDetainPageShowing && hasFocus) {
            FocusKeeper.record(btn.id);
        }

        // 表示焦点发生变化
        UIFlags.dpShow_HasKeyMoved = true;
    },

    onClick: function (btn) {
        switch (btn.id) {
            // 挽留页1-4推荐位
            case 'recommend-video-1':
            case 'recommend-video-2':
            case 'recommend-video-3':
            case 'recommend-video-4':
                PlayerKeyEventManager.playVideo(btn);
                break;

            // 挽留页底部按钮：重播/继续播放、收藏/取消收藏、退出
            case 'operate-btn-2':
                PlayerKeyEventManager.resumeOrReplay(btn);
                break;
            case 'operate-btn-3':
                if (RenderParam.collectStatus == 0) {
                    LMEPG.UI.showToast('您已经收藏过该视频了哦~');
                } else {
                    var expectedStatus = RenderParam.collectStatus == 1 ? 0 : 1;  //改变收藏状态
                    Player.Status.setCollectStatus(RenderParam.sourceId, expectedStatus);
                }
                break;
            case 'operate-btn-1':
                PlayerKeyEventManager.jumpBack();
                break;
        }
    }
};

/**
 * <pre>
 * 初始化整个页面按钮。
 * [
 *      0~3：依次为挽留页1-4推荐位，
 *      4~6：依次为挽留页“继续播放/重播、收藏/取消收藏、退出”
 * ]
 * </pre>
 */
function _init_buttons() {
    buttons = [
        // 0: recommend-video-1
        {
            id: 'recommend-video-1',
            name: '挽留页-推荐位1',
            type: 'div',
            focusable: true,
            backgroundImage: C.Pic.recommend_video_bg_unfocused,
            focusImage: C.Pic.recommend_video_bg_focused,
            nextFocusLeft: 'recommend-video-4',//从第1个推荐视频，继续按左键循环移动到最右第4个推荐视频位上
            nextFocusRight: 'recommend-video-2',
            nextFocusUp: FocusKeeper.lastFocusedBtnIdOfLine1,
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 1: recommend-video-2
        {
            id: 'recommend-video-2',
            name: '挽留页-推荐位2',
            type: 'div',
            focusable: true,
            backgroundImage: C.Pic.recommend_video_bg_unfocused,
            focusImage: C.Pic.recommend_video_bg_focused,
            nextFocusLeft: 'recommend-video-1',
            nextFocusRight: 'recommend-video-3',
            nextFocusUp: FocusKeeper.lastFocusedBtnIdOfLine1,
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 2: recommend-video-3
        {
            id: 'recommend-video-3',
            name: '挽留页-推荐位3',
            type: 'div',
            focusable: true,
            backgroundImage: C.Pic.recommend_video_bg_unfocused,
            focusImage: C.Pic.recommend_video_bg_focused,
            nextFocusLeft: 'recommend-video-2',
            nextFocusRight: 'recommend-video-4',
            nextFocusUp: FocusKeeper.lastFocusedBtnIdOfLine1,
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 3: recommend-video-4
        {
            id: 'recommend-video-4',
            name: '挽留页-推荐位4',
            type: 'div',
            focusable: true,
            backgroundImage: C.Pic.recommend_video_bg_unfocused,
            focusImage: C.Pic.recommend_video_bg_focused,
            nextFocusLeft: 'recommend-video-3',
            nextFocusRight: 'recommend-video-1',//从第4个推荐视频，继续按右键循环移动到最左第1个推荐视频位上
            nextFocusUp: FocusKeeper.lastFocusedBtnIdOfLine1,
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 4: operate-btn-1
        {
            id: 'operate-btn-1',
            name: '挽留页-退出',
            type: 'img',
            focusable: true,
            backgroundImage: C.Pic.finish_play_unfocused,
            focusImage: C.Pic.finish_play_focused,
            nextFocusLeft: 'operate-btn-3',
            nextFocusDown: FocusKeeper.lastFocusedBtnIdOfLine2,
            nextFocusRight: 'operate-btn-2',//从第3个按钮，继续按右键循环移动到最左第1个按钮上
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.EXIT //自定义属性
        },
        // 5: operate-btn-2
        {
            id: 'operate-btn-2',
            name: '挽留页-重播/继续播放',
            type: 'img',
            focusable: true,
            backgroundImage: '', //动态更新值
            focusImage: '', //动态更新值
            nextFocusLeft: 'operate-btn-1',//从第1个按钮，继续按左键循环移动到最右第3个按钮上
            nextFocusDown: FocusKeeper.lastFocusedBtnIdOfLine2,
            nextFocusRight: 'operate-btn-3',
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.RESUME //自定义属性
        },
        // 6: operate-btn-3
        {
            id: 'operate-btn-3',
            name: '挽留页-收藏/取消收藏',
            type: 'img',
            focusable: true,
            backgroundImage: '', //动态更新值
            focusImage: '', //动态更新值
            nextFocusLeft: 'operate-btn-2',
            nextFocusRight: 'operate-btn-1',
            nextFocusDown: FocusKeeper.lastFocusedBtnIdOfLine2,
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.COLLECT //自定义属性
        }

    ];
}

// 页面加载完成
window.onload = function () {
    debug2('《当前页面已加载完成。》');
    debug1();
    G('default_link').focus();  // 防止页面丢失焦点

    G('video-title').innerHTML = RenderParam.videoInfo.title; // 显示视频标题
    Player.initJSPrams(); // 初始化或者转换必要的JS参数！
    Player.initPlayOrReplay(0); // 初始化渲染 “继续播放/重播”相关控件
    Player.initCollectOrNot(RenderParam.collectStatus); // 初始化渲染 “收藏/取消收藏”相关控件
    Player.initRecommendVideoInfo(RenderParam.userId); // 加载数据并初始化渲染 “推荐视频1-4”相关控件
    Player.setVisibilityForDetainPageUI(false); // 隐藏更多显示，防止已进入就显示

    Player.initPlayerWithIframe(); // 初始化播放器
    Player.Progress.start(); // 启动进度条显示

    // 注册按键监听事件
    LMEPG.BM.init('', buttons, '', true);
    PlayerKeyEventManager.registerSpecialKeys(); // 覆写某些特殊按键事件处理

    lmInitGo();
};

// 页面销毁前
window.onbeforeunload = function () {
    debug2('《即将关闭当前页面……》');
};

// 页面销毁
window.onunload = function () {
    debug2('《页面onunload……》');
    LMEPG.mp.destroy();  //释放播放器
    Player.release(); // 释放其它资源
};

// 页面错误
window.onerror = function (message, filename, lineno) {
    debug2('window.onerror[' + lineno + ']:' + message);
    var stbModelWithPT = LMEPG.STBUtil.getSTBModel() + (isHD() ? '（高清）' : '（标清）');
    var errorLog = '[Player.js][' + stbModelWithPT + ']::error --->' + '\nmessage:' + message + '\nfile_name:' + filename + '\nline_NO:' + lineno;
    printLog(errorLog, true);
};

////////////////////////////////
// 加载js优先初始化必要数据！ //
////////////////////////////////
Player.init();