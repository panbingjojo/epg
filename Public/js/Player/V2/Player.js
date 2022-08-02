// +----------------------------------------------------------------------
// | 播放器模式V2（V2/Player）页面的js控制封装
// +----------------------------------------------------------------------
// | 使用该V2/Player特别之处：
// |    1. 具有对“自定义音量UI”的处理与监听。否则，建议使用V1/Player。
// +----------------------------------------------------------------------
// | 目前应用地区：
// |     340092(安徽电信)   450092(广西电信)    640092(宁夏电信)
// |     420092(湖北电信)
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/08/27
// +----------------------------------------------------------------------

/** 判断是否为HD平台 */
function isHD() {
    return RenderParam.platformType === 'hd';
}

// 调试代码：上线保证该变量关闭！！！
var debug_mode = false;

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
}

/****************************************************************
 * 全局控制变量声明
 *****************************************************************/
var isDetainPageShowing = false;    // 挽留页（Detain Page）显示标志

/****************************************************************
 * 全局常量声明。说明：C表示Const常量。
 *****************************************************************/
var C = {
    /** 图片 */
    Pic: {
        /**
         * 根据指定倍速值（speed=2|4|8|16|32|64）返回对应图片。
         * @param speed number类型，可选值只能为[2|4|8|16|32|64]
         * @return {*} 返回对应speed的图片，如果不存在，则返回undefined。
         */
        getSpeedPicBy: function (speed) {
            var allowSpeedOptions = [2, 4, 8, 16, 32, 64];
            if (allowSpeedOptions.indexOf(speed) > -1) {
                return '/Public/img/' + RenderParam.platformType + '/Player/V1/speed_' + speed + '.png';
            } else {
                return undefined;
            }
        },

        // 倍速相关图标
        speed_play: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/speed_play.png',
        speed_rewind: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/speed_rewind.png',
        speed_forward: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/speed_forward.png',

        // 音量图标
        volume_horn: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/volume_horn.png',
        volume_mute: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/volume_horn_none.png',

        // 挽留页面相关图标
        replay: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/Replay.png',                             // “重播”：无焦点
        replay_focus: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/ReplayFocus.png',                  // “重播”：有焦点
        resume_replay: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/ResumePlay.png',                  // “继续播放”：无焦点
        resume_replay_focus: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/ResumePlayFocus.png',       // “继续播放”：有焦点
        collect: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/Collect.png',                           // “收藏”：无焦点
        collect_focus: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/CollectFocus.png',                // “收藏”：有焦点
        no_collect: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/NoCollect.png',                      // “取消收藏”：无焦点
        no_collect_focus: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/NoCollectFocus.png'           // “取消收藏”：有焦点
    },

    /** 常用控件id */
    ID: {
        speed: 'speed',                          // 倍速
        speed_rewind: 'speed_rewind',            // 快退
        speed_forward: 'speed_forward'          // 快进
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
    lastFocusedBtnIdOfLine1: 'focus-1-1',       // 离开第1排前的焦点按钮，默认为第1个
    lastFocusedBtnIdOfLine2: 'focus-2-1',       // 离开第2排前的焦点按钮，默认为第1个
    record: function (currentFocusedBtnId) {   // 记录当前的焦点按钮id
        if (currentFocusedBtnId) {
            if (currentFocusedBtnId.startWith('focus-1')) {
                this.lastFocusedBtnIdOfLine1 = currentFocusedBtnId;
            } else if (currentFocusedBtnId.startWith('focus-2')) {
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
     * @param videoInfo
     */
    jumpBuyVip: function (remark, videoInfo) {
        var objCurrent = this.getCurrentPage();

        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('userId', RenderParam.userId);
        objOrderHome.setParam('isPlaying', '1');
        objOrderHome.setParam('remark', remark);
        objOrderHome.setParam('videoInfo', JSON.stringify(videoInfo));

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
    /** 播放器页面控制唯一入口调用：必须调用！ */
    init: function () {
        /** 初始化所有按钮 */
        _init_buttons();
    },

    modelDif: ["450092", "420092", "410092"],

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
    allowPlayVideo: function (playVideoFreeSeconds) {
        var isVip = RenderParam.isVip == 1;
        if (isVip) {    // vip用户可播放观看
            return true;
        } else {        // 非vip用户可播放观看的前提是：不限vip用户 或者 有免费试看时长
            var isOnlyVIPPlay = RenderParam.userType == 2; // 0-不限，1-普通用户可看，2-仅限VIP用户可看（普通用户需要检查免费时长）
            return !isOnlyVIPPlay || playVideoFreeSeconds > 0;
        }
    },

    /**
     * 实时获取当前“视频总时长、当前已播放时长”。注意：每个值为>=0的number类型。
     * @return {*[]} [视频总时长, 当前已播放时长]
     */
    getTimesArray: function () {
        var duration = LMEPG.mp.getMediaDuration();
        var currentPlayTime = LMEPG.mp.getCurrentPlayTime();
        return [duration, currentPlayTime];

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

    /** 初始化默认焦点指向 */
    focusDefaultView: function () {
        var focusId = (Player.getRetainMode() == 'v2') ? 'replay' : 'focus-2-1';
        LMEPG.ButtonManager.requestFocus(focusId);
    },

    /** 初始化“快进”和“快退”控件 */
    initSpeedUI: function () {
        debug2('Player.initSpeedUI');
        // G(C.ID.speed_rewind).setAttribute('src', C.Pic.speed_rewind);
        // G(C.ID.speed_forward).setAttribute('src', C.Pic.speed_forward);
    },

    /**
     * 创建  重播/继续播放  按钮
     * @param isPlayEnd 0-继续播放 1-重播
     */
    initPlayOrReplay: function (isPlayEnd) {
        debug2('Player.initPlayOrReplay(' + isPlayEnd + ')');
        var div1 = G('div1');
        var isReplayStatus = isPlayEnd == 1; // 是否变更为“重播”状态

        var textId = isReplayStatus ? 'replaytext' : 'resumeplay';
        var text = isReplayStatus ? '重播' : '继续播放';
        var initImgSrc = isReplayStatus ? C.Pic.replay : C.Pic.resume_replay;
        var leftMargin = isHD() ? '323px' : '133px';
        div1.innerHTML = '<img id="focus-2-1" class="navimg" style="left:' + leftMargin + '" src="' + initImgSrc + '"/><div id="' + textId + '">' + text + '</div>';

        // 按钮属性赋值
        buttons[4].name = text;
        buttons[4].backgroundImage = isReplayStatus ? C.Pic.replay : C.Pic.resume_replay;
        buttons[4].focusImage = isReplayStatus ? C.Pic.replay_focus : C.Pic.resume_replay_focus;
        buttons[4].funcType = isReplayStatus ? C.FuncType.REPLAY : C.FuncType.RESUME;

        if (Player.getRetainMode() == 'v2') {
            var replayImage = G('replay');
            // 设置背景图及按钮状态
            replayImage.src = initImgSrc;
            replayImage.style.left = "395px";
            buttons[8].backgroundImage = isReplayStatus ? C.Pic.replay : C.Pic.resume_replay;
            buttons[8].focusImage = isReplayStatus ? C.Pic.replay_focus : C.Pic.resume_replay_focus;
            buttons[8].funcType = isReplayStatus ? C.FuncType.REPLAY : C.FuncType.RESUME;

            // 设置提示文案
            G('replay_tips').innerHTML = text;
            G('replay_tips').style.left = isReplayStatus ? "421px" : "399px";
        }
    },

    /**
     * 创建  收藏/取消收藏  按钮
     * @param collectStatus 变更当前的收藏状态 0-已收藏 1-未收藏
     */
    initCollectOrNot: function (collectStatus) {
        debug2('Player.initCollectOrNot(' + collectStatus + ')');
        var div2 = G('div2');
        var isCurrentCollectStatus = collectStatus == 0; // 当前是否为“已收藏”状态（注：UI上显示应该是取反的！）

        var textId = isCurrentCollectStatus ? 'collecttext' : 'nocollecttext';
        var text = isCurrentCollectStatus ? '取消收藏' : '收藏';
        var initImgSrc = isCurrentCollectStatus ? C.Pic.collect : C.Pic.no_collect;
        var leftMargin = isHD() ? '583px' : '275px';

        div2.innerHTML = '<img id="focus-2-2" class="navimg" style="left:' + leftMargin + '" src="' + initImgSrc + '"/><div id="' + textId + '">' + text + '</div>';

        // 按钮属性赋值
        buttons[5].name = text;
        buttons[5].backgroundImage = isCurrentCollectStatus ? C.Pic.collect : C.Pic.no_collect;
        buttons[5].focusImage = isCurrentCollectStatus ? C.Pic.collect_focus : C.Pic.no_collect_focus;
        buttons[5].funcType = isCurrentCollectStatus ? C.FuncType.COLLECT : C.FuncType.NO_COLLECT;
    },

    /**
     * 加载推荐位视频数据（即挽留页显示的1-4号位视频数据）
     * @param userId 当前用户id
     */
    initRecommendVideoInfo: function (userId) {
        debug2('Player.initRecommendVideoInfo(' + userId + ')');

        H('vip_corner_1');
        H('vip_corner_2');
        H('vip_corner_3');
        H('vip_corner_4');

        var postData = {
            'userId': userId
        };
        if (RenderParam.carrierId == "640092" && RenderParam.albumName && RenderParam.albumName == 'album149') {
            postData.videoUserType = 1;
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
                        if (Player.modelDif.indexOf(RenderParam.carrierId) != -1) {
                            G('no-bg-' + i).style.backgroundImage = 'url("")';
                        }else {
                            G('li' + i).innerText = title[i];
                        }
                        G('img' + i).src = RenderParam.imgHost + image_url[i];
                        G('img' + i).setAttribute('gqPlayUrl', gqPlayUrl[i]);
                        G('img' + i).setAttribute('bqPlayUrl', bqPlayUrl[i]);
                        G('img' + i).setAttribute('user_type', userType[i]);
                        G('img' + i).setAttribute('sourceId', sourceId[i]);
                        G('img' + i).setAttribute('title', title[i]);
                        G('img' + i).setAttribute('freeSeconds', freeTimes[i]);
                        G('img' + i).setAttribute('unionCode', unionCode[i]);

                        // 按钮属性赋值
                        buttons[i].funcType = C.FuncType.RECOMMEND_VIDEO;
                        buttons[i].dataObj = recommendData.data[i];

                        //海南电信推荐视频非VIP用户添加VIP角标
                        if (RenderParam.isShowVipCorner && RenderParam.carrierId == '460092' && RenderParam.isVip != '1') {
                            if (recommendData.data[i].user_type == '2') {
                                S('vip_corner_' + (i + 1));
                            } else {
                                H('vip_corner_' + (i + 1));
                            }
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

    /**
     * @param show 显示还是隐藏“倍速”控件。true | false
     * @param dir 显示“倍速”控件的方向。left | right
     */
    setVisibilityForSpeedUI: function (show, dir) {
        // if (show) {
        //     switch (dir) {
        //         case C.Dir.RIGHT:
        //             debug2('Player.setVisibilityForSpeedUI(true, right)');
        //             Hide(C.ID.speed_rewind);
        //             Show(C.ID.speed_forward);
        //             LMEPG.mp.fastForward();
        //             if (LMEPG.mp.isSpeedResumed()) {
        //                 hideAllSpeedViews();
        //             }
        //             break;
        //         case C.Dir.LEFT:
        //             debug2('Player.setVisibilityForSpeedUI(true, left)');
        //             Show(C.ID.speed);
        //             Show(C.ID.speed_rewind);
        //             Hide(C.ID.speed_forward);
        //             LMEPG.mp.fastRewind();
        //             if (LMEPG.mp.isSpeedResumed() || LMEPG.mp.getCurrentPlayTime() == 0) {
        //                 hideAllSpeedViews();
        //             }
        //             break;
        //         default:
        //             return;
        //     }
        //
        //     var tmpSrc = C.Pic.getSpeedPicBy(LMEPG.mp.getSpeed());
        //     if (tmpSrc) {
        //         Show(C.ID.speed);
        //         G(C.ID.speed).setAttribute("src", tmpSrc);
        //     }
        // } else {
        //     hideAllSpeedViews();
        // }
        //
        // function hideAllSpeedViews() {
        //     Hide(C.ID.speed_rewind);
        //     Hide(C.ID.speed_forward);
        //     if (LMEPG.mp.state !== LMEPG.mp.State.PAUSE') Hide(C.ID.speed); // 若正在处于暂停并已显示暂停按钮，则继续保持暂停按钮显示状态
        // }
    },

    /**
     * 显示/隐藏 暂停按钮
     * @param show 显示还是隐藏“暂停”控件。true | false
     */
    setVisibilityForPauseUI: function (show) {
        if (show) {
            // G(C.ID.speed).setAttribute("src", C.Pic.speed_play);
            Show(C.ID.speed);
        } else {
            Hide(C.ID.speed);
        }
    },

    /**
     * 显示/隐藏 挽留页
     * @param show 显示还是隐藏“挽留页”。true | false
     */
    setVisibilityForDetainPageUI: function (show) {
        debug2('Player.setVisibilityForDetainPageUI(' + show + ')');
        isDetainPageShowing = show;
        // 宁夏电信【健康教育】进入显示的挽留页模式二
        var retainPageId = (Player.getRetainMode() == 'v2') ? 'retain_page' : 'collectback';
        if (show) {
            Show(retainPageId);
        } else {
            Hide(retainPageId);
        }
    },

    /**
     * 初始化播放器：需要使用的第三方播放器前缀地址，即domainUrl有效才可调用该方法。
     */
    initPlayerWithDomainUrl: function () {

        debug2('Player.playWithIframe->domainUrl: ' + RenderParam.domainUrl);
        setTimeout(function () {
            //var videoUrl="progcpaj0030a8275925000111956642";//第三方测试的注入id--江苏电信测试
            //var videoUrl="99100000012017120414241401167998";//公司注入的id--广西电信标清测试
            //var videoUrl="99100000012018113015544301259884";//第三方注入id--广西电信高清测试

            var left = 0;
            var top = 0;
            var width = 1280;
            var height = 720;
            if (!isHD()) {
                left = 0;
                top = 0;
                width = 644;
                height = 530;
            }

            var info = '';
            var factUrl = '';
            switch (RenderParam.carrierId) {
                case "350092"://福建电信
                    if (LMEPG.Func.isEmpty(RenderParam.domainUrl)) return;
                    info = LMEPG.mp.dispatcherUrl.getUrlWith640092(left, top, width, height, RenderParam.videoUrl);
                    factUrl = RenderParam.domainUrl + info;
                    G('smallscreen').setAttribute('src', factUrl);
                    LMEPG.mp.initPlayerByBind();
                    break;
                case "450092"://广西电信
                    LMEPG.Log.info("RenderParam.accountId :"+RenderParam.accountId +' initPlayerWithDomainUrl—>RenderParam.domainUrl:'+ RenderParam.domainUrl+"stbdomainUrl :"+LMEPG.STBUtil.getEPGDomain()+"RenderParam.videoUrl: "+RenderParam.videoUrl);
                    var playerUrl = RenderParam.domainUrl;
                    if (LMEPG.Func.isEmpty(playerUrl)) {
                        playerUrl = LMEPG.STBUtil.getEPGDomain();
                    }
                    if (LMEPG.Func.isEmpty(playerUrl)) return;
                    playerUrl = playerUrl.replace("Category.jsp", "third_to_epg.jsp");//局方getEPGDomain()返回的地址不对，需要修正。
                    info = LMEPG.mp.dispatcherUrl.getUrlWith320092(left, top, width, height, RenderParam.videoUrl);
                    factUrl = playerUrl + info;
                    LMEPG.Log.info("initPlayerWithDomainUrl—>factUrl:"+factUrl+" left, top, width, height"+left+" "+top+" "+ width+" "+ height);
                    G('smallscreen').setAttribute('src', factUrl);
                    LMEPG.mp.initPlayerByBind();
                    break;
                case '460092'://海南电信
                    var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
                    if (thirdPlayerUrl == "") {
                        LMEPG.UI.showToast("domainUrl is empty!!!", 3);
                        return;
                    }
                    LMEPG.Log.info("thirdPlayerUrl is : " + thirdPlayerUrl);
                    thirdPlayerUrl = thirdPlayerUrl.replace("://", "+++");
                    var port_index = thirdPlayerUrl.indexOf(":");
                    var path_index = thirdPlayerUrl.indexOf("/");
                    var result = thirdPlayerUrl.substring(port_index, path_index);
                    thirdPlayerUrl = thirdPlayerUrl.replace("+++", "://");
                    var lmpf = "", index = 0;
                    if (result == ":33200") {
                        lmpf = "huawei";
                        index = thirdPlayerUrl.indexOf("/EPG/");
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + "/EPG/";
                    } else {
                        lmpf = "zte";
                        index = thirdPlayerUrl.lastIndexOf("/");
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + "/";
                    }

                    var info = LMEPG.mp.dispatcherUrl.getUrlWith420092(left, top, width, height, RenderParam.videoUrl, lmpf);
                    var thirdPlayerFullUrl = thirdPlayerUrl + info;
                    LMEPG.Log.info("thirdPlayerFullUrl is : " + thirdPlayerFullUrl);
                    G("smallscreen").setAttribute("src", thirdPlayerFullUrl);
                    LMEPG.mp.initPlayerByBind();
                    break;
                case '640092'://宁夏电信
                case '10640092'://宁夏电信
                    var stbDomainUrl = LMEPG.STBUtil.getEPGDomain();
                    var prefixObj = LMEPG.mp.dispatcherUrl.getUrlWith650092PrefixObj(stbDomainUrl);
                    thirdPlayerUrl = prefixObj.url;
                    info = LMEPG.mp.dispatcherUrl.getUrlWith650092Suffix(left, top, width, height, RenderParam.videoUrl, prefixObj.isHW);
                    factUrl = thirdPlayerUrl + info;
                    LMEPG.Log.info("thirdPlayerFullUrl is : " + factUrl);
                    G('smallscreen').setAttribute('src', factUrl);
                    LMEPG.mp.initPlayerByBind();
                    break;
                case '630092'://青海电信
                    var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
                    thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
                    var port_index = thirdPlayerUrl.indexOf(':');
                    var path_index = thirdPlayerUrl.indexOf('/');
                    var result = thirdPlayerUrl.substring(port_index, path_index);
                    thirdPlayerUrl = thirdPlayerUrl.replace("+++", "://");
                    var lmpf = "", index = 0;
                    if (result === ":33200") {//华为端口
                        lmpf = "huawei";
                        index = thirdPlayerUrl.indexOf("/EPG/");
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + "/EPG/";
                    } else {
                        lmpf = "zte";
                        index = thirdPlayerUrl.lastIndexOf("/");
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + "/";
                    }

                    if (RenderParam.videoInfo.videoType != undefined && RenderParam.videoInfo.videoType == "channel") {
                        thirdPlayerUrl = thirdPlayerUrl.substring(0, path_index);
                        thirdPlayerUrl = thirdPlayerUrl.replace("+++", "://");

                        info = LMEPG.mp.dispatcherUrl.getUrlWithChannel630092(left, top, width, height, RenderParam.videoUrl, lmpf);
                        factUrl = thirdPlayerUrl + info;
                        LMEPG.Log.info("factUrl is : " + factUrl);
                        G('smallscreen').setAttribute('src', factUrl);
                    } else {
                        info = LMEPG.mp.dispatcherUrl.getUrlWith630092(left, top, width, height, RenderParam.videoUrl, lmpf);
                        factUrl = thirdPlayerUrl + info;
                        LMEPG.Log.info("factUrl is : " + factUrl);
                        G('smallscreen').setAttribute('src', factUrl);
                        LMEPG.mp.initPlayerByBind();
                    }
                    break;
                case '650092'://新疆电信
                    var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
                    thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
                    var port_index = thirdPlayerUrl.indexOf(':');
                    var path_index = thirdPlayerUrl.indexOf('/');
                    var result = thirdPlayerUrl.substring(port_index, path_index);
                    thirdPlayerUrl = thirdPlayerUrl.replace("+++", "://");
                    var lmpf = "", index = 0;
                    if (result === ":33200") {//华为端口
                        lmpf = "huawei";
                        index = thirdPlayerUrl.indexOf("/EPG/");
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + "/EPG/";
                    } else {
                        lmpf = "zte";
                        index = thirdPlayerUrl.lastIndexOf("/");
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + "/";
                    }
                    info = LMEPG.mp.dispatcherUrl.getUrlWith630092(left, top, width, height, RenderParam.videoUrl, lmpf);
                    factUrl = thirdPlayerUrl + info;
                    G('smallscreen').setAttribute('src', factUrl);
                    LMEPG.mp.initPlayerByBind();
                    break;
                case '420092': // 湖北电信
                    var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
                    thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
                    var port_index = thirdPlayerUrl.indexOf(':');
                    var path_index = thirdPlayerUrl.indexOf('/');
                    var result = thirdPlayerUrl.substring(port_index, path_index);
                    thirdPlayerUrl = thirdPlayerUrl.replace("+++", "://");
                    var lmpf = "", index = 0;
                    if (result === ":33200") {//华为端口
                        lmpf = "huawei";
                        index = thirdPlayerUrl.indexOf("/EPG/");
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + "/EPG/";
                    } else {
                        lmpf = "zte";
                        index = thirdPlayerUrl.lastIndexOf("/");
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + "/";
                    }
                    info = LMEPG.mp.dispatcherUrl.getUrlWith420092(left, top, width, height, RenderParam.videoUrl, lmpf);
                    factUrl = thirdPlayerUrl + info;
                    G('smallscreen').setAttribute('src', factUrl);
                    LMEPG.mp.initPlayerByBind();
                    break;
                case '360092': // 江西电信
                    var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
                    LMEPG.Log.info("thirdPlayerUrl is : " + thirdPlayerUrl);
                    var index = thirdPlayerUrl.indexOf("/jsp/");
                    var lmpf = "";
                    if (index == -1) {
                        index = thirdPlayerUrl.lastIndexOf('/');
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index);
                        lmpf = 'zte';
                    } else {
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index);
                        lmpf = 'huawei';
                    }

                    var info = LMEPG.mp.dispatcherUrl.getUrlWith420092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl, lmpf);
                    var playUrl = thirdPlayerUrl + info;
                    LMEPG.Log.error('thirdPlayerUrl playUrl : ' + playUrl);
                    G('smallscreen').setAttribute('src', factUrl);
                    LMEPG.mp.initPlayerByBind();
                    break;
                default:
                    setTimeout(function () {
                        LMEPG.mp.initPlayer();
                        LMEPG.mp.playOfFullscreen(RenderParam.videoUrl);
                    }, 500);
                    break;
            }
        }, 500);
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
            case '10640092'://宁夏电信
            case '420092'://湖北电信
            case '460092'://海南电信
                Player.initPlayerWithDomainUrl();
                break;
            case '000051'://中国联通
                setTimeout(function () {
                    var stbModel = LMEPG.STBUtil.getSTBModel();
                    if (stbModel === 'IP506H_54U3') {  //内蒙联通海信盒子
                        LMEPG.mp.initPlayerByBind();
                        LMEPG.mp.playOfFullscreen(RenderParam.videoUrl);
                    } else {
                        LMEPG.mp.initPlayer();
                        LMEPG.mp.playOfFullscreen(RenderParam.videoUrl);
                    }
                }, 500);
                break;
            case '340092'://安徽电信
                setTimeout(function () {
                    LMEPG.mp.initPlayerMode1();
                    LMEPG.mp.playOfFullscreen(RenderParam.videoUrl);
                    LMEPG.mp.playByTime(0); // 强制从头播放。安徽电信bug：快进到超过试看时长弹计费，然后取消订购并返回播放器时，会直接再弹计费。
                }, 500);
                break;
            default:
                setTimeout(function () {
                    LMEPG.mp.initPlayerMode1();
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
        }
    },

    /**
     * 播放结束，弹出挽留页，释放资源。
     * @param forceEndManually 手动强制结束，设置了该参数true，则需要再手动调用LMEPG.mp.destroy();强制释放关闭
     */
    playToEnd: function (forceEndManually) {
        // 若某些地区盒子播放结束不会发现虚拟按钮768通知我们应用层，则程序会自动检测当前播放时长是否达到总时长。是，则
        // 手动置为结束，则就不再重复该方法后续操作，避免出错。
        if (Player.Status.curPlayerState === 'end') {
            return;
        }

        Player.initPlayOrReplay(1);                         // 创建重播按钮
        Player.initCollectOrNot(RenderParam.collectStatus); // 初始化渲染 “收藏/取消收藏”相关控件
        Player.Status.refreshPlayState();                   // 统一刷新是否显示挽留页
        Player.focusDefaultView();                          // 设置默认焦点
        Player.setVisibilityForDetainPageUI(true);         // 显示更多视频页
        Player.setVisibilityForSpeedUI(false);             // 关闭倍速
        Player.Progress.hide();                             // 隐藏进度条
        Player.Status.end();                                // 改变本地记录的播放状态为：结束！
        if (forceEndManually) {
            LMEPG.mp.destroy();                             // 停止播放，释放资源
        }
        Player.release();                                   // 释放资源
        G('ball').style.left = Player.Progress.progressWidth + 'px';
        G('ptime').innerHTML = LMEPG.Func.formatTimeInfo(1, LMEPG.mp.getMediaDuration());
        G('fill').style.width = Player.Progress.progressWidth + 'px';
    },

    /**
     * 播放结束/播放出错时，结束某些操作以节约资源。例如：计时器
     */
    release: function () {
        // 释放定时器
        if (window.mpTimer) window.clearInterval(window.mpTimer);
        if (Player.Progress.autoSeekTimer) window.clearTimeout(Player.Progress.autoSeekTimer);
        if (Player.Progress.autoHideProgressTimer) window.clearTimeout(Player.Progress.autoHideProgressTimer);
    },

    getRetainMode: function () {
        var retainMode = "";
        if ((RenderParam.carrierId == "640092"||RenderParam.carrierId == "10640092") && RenderParam.retainMode == "v2") {
            retainMode = "v2"
        }

        return retainMode;
    }
};

/****************************************************************
 * 播放器页面状态控制：播放、暂停、前进、快退、收藏和取消收藏……
 *****************************************************************/
Player.Status = {
    // 当前播放状态：play | pause
    curPlayerState: 'play',

    // 结束
    end: function () {
        this.curPlayerState = 'end';//仅仅设置标志为结束状态，在Player.playToEnd()方法调用中再改变！
    },
    // 播放
    resume: function () {
        Player.setVisibilityForSpeedUI(false);
        Player.setVisibilityForPauseUI(false);
        LMEPG.mp.resume();
        debug2('Player.Status.resume()');
    },
    // 暂停
    pause: function () {
        if (LMEPG.mp.state !== LMEPG.mp.State.PAUSE) debug2('Player.Status.pause()');
        Player.setVisibilityForPauseUI(true);
        LMEPG.mp.pause();
    },
    // 快进
    fastForward: function () {
        Player.setVisibilityForSpeedUI(false);
        LMEPG.mp.resume();
        debug2('Player.Status.fastForward()');
    },
    // 快退
    fastRewind: function () {
        Player.setVisibilityForSpeedUI(false);
        LMEPG.mp.resume();
        debug2('Player.Status.fastRewind()');
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
        if (this.curPlayerState === 'play') {
            this.curPlayerState = 'pause';
            LMEPG.mp.pause();
        } else if (this.curPlayerState === 'pause') {
            this.curPlayerState = 'play';
            LMEPG.mp.resume();
        }

        this.refreshPlayState(); // 统一刷新是否显示挽留页
    },
    // 刷新播放状态
    refreshPlayState: function () {
        if (this.curPlayerState === 'pause') {
            Player.setVisibilityForDetainPageUI(true);
        } else if (this.curPlayerState === 'play') {
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
                    Player.initCollectOrNot(RenderParam.collectStatus);
                    //
                    // 加强用户体验：
                    // 如果在收藏/取消收藏过程中，用户就移动了按钮焦点。即：server响应时刻 > 用户变更当前收藏/取消收藏按钮焦点时刻，
                    // 当server变更收藏状态响应时，若当前记录的焦点按钮还是自己本身，则强制requestFocus以更新最新的UI焦点状态！
                    var currentFocusBtn = LMEPG.ButtonManager.getCurrentButton();
                    if (currentFocusBtn && currentFocusBtn.id === 'focus-2-2') {
                        LMEPG.ButtonManager.requestFocus('focus-2-2');
                    }
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
    }
};

/****************************************************************
 * 播放器进度条控制
 *****************************************************************/
Player.Progress = {
    isProgressShow: false,                                          // 进度条是否显示
    isVolumeProgressShow: false,                                    // 音量UI是否显示
    autoHideVolumeProgressTimer: null,                              // 自动隐藏音量调节进度条定时器
    autoHideProgressTimer: null,                                    // 自动隐藏进度条定时器
    AUTO_HIDE_PROGRESS_TIME: 3 * 1000,                               // 自动隐藏菜单的时间，单位毫秒
    AUTO_HIDE_VOLUME_PROGRESS_TIME: 5 * 1000,                        // 自动隐藏音量进度条的时间，单位毫秒
    videoDuration: 0,                                                // 视频总时长
    progressWidth: isHD() ? 888 : 444,                               // 进度条总的宽度
    indicatorWidth: 40,                                              // 进度条指示器的宽度
    currentSeekSecond: -1,                                           // 当前seek的秒数，只要>=0就表示正在seek
    seekStep: 10,                                                    // 快进/快退单位时长，单位秒
    autoSeekTimer: 0,                                                // 快进/快退计时器

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
                // console.log("Player.js-----isVip: " + RenderParam.isVip + ", userType: " + RenderParam.userType);
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

    /** 显示进度条 */
    show: function () {
        this.isProgressShow = true;
        Show('playUI');// 进度条外圈UI
        this.restart();
    },

    /** 隐藏进度条 */
    hide: function () {
        this.isProgressShow = false;
        Hide('playUI');//进度条外圈UI
        if (this.autoHideProgressTimer) clearTimeout(this.autoHideProgressTimer);
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

            G('fill').style.width = progressLength + 'px';
            if ((progressLength - this.indicatorWidth) < 0) {
                G('ball').style.left = '0px';
            } else if ((progressLength - this.indicatorWidth) > (this.progressWidth - this.indicatorWidth / 2)) {
                G('ball').style.left = (this.progressWidth - this.indicatorWidth / 2) + 'px';
            } else {
                G('ball').style.left = (progressLength - this.indicatorWidth / 2) + 'px';
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
        // console.log("Player.js-checkFreeTime()>>>cTime: " + this.currentPlayTimes + " - fTime: " + RenderParam.freeSeconds);
        if (parseInt(RenderParam.userType) == 2) {
            this.currentPlayTimes = LMEPG.mp.getCurrentPlayTime();
            debug1('当前播放时刻: ' + this.currentPlayTimes + ' s');
            if (this.currentPlayTimes >= RenderParam.freeSeconds) {
                clearInterval(window.mpTimer); // 释放定时器
                LMEPG.mp.destroy();

                // 如果isForbidOrder = 1，表示不允许订购，直接返回
                if (RenderParam.isForbidOrder == '1') {
                    LMEPG.UI.showToast("您已受限订购该业务，暂时不能订购!", 3);
                    window.setTimeout(function () {
                        LMEPG.Intent.back();
                    }, 3000);
                } else {
                    Page.jumpBuyVip(RenderParam.videoInfo.title, RenderParam.videoInfo);
                }
            }
        }
    },
    setProgressTime: function (mpTimes) {
        var totalDuration = mpTimes[0];
        var curPlayTime = mpTimes[1];
        if (!isDetainPageShowing) {
            debug1('播放状态：' + LMEPG.mp.getPlayerState() + ', 倍速：' + LMEPG.mp.getSpeed() + ', 播放进度：' + curPlayTime + '/' + totalDuration + '(s)');
        }

        // 保存最后的播放进度
        RenderParam.videoInfo.lastedPlaySecond = curPlayTime;
        // 中国联通添加数据上报功能

        Network.savePlayerProgress(JSON.stringify(RenderParam.videoInfo));
        Network.saveVideoSetProgress(JSON.stringify(RenderParam.videoInfo));

        // // 显示“当前时长:总时长”
        // if (!this.videoDuration) this.videoDuration = totalDuration;
        // G('total-time').innerHTML = LMEPG.Func.formatTimeInfo(1, this.videoDuration); //设置总时长
        // var pTime = LMEPG.Func.formatTimeInfo(1, curPlayTime);//设置当前播放时间
        //
        // if (pTime === '0-1:0-1') return; //表示读时间进度有问题，不给予更新时间
        // G('current-time').innerHTML = pTime;
        //
        // // 播放结束
        // var rate = this.getPlayRate(mpTimes);       //当前播放的比例，取值0-1
        // var progressLength = rate * this.progressWidth;//进度条的长度
        // if (Player.isNeedListenProgressEnd()) {
        //     if (curPlayTime >= totalDuration && curPlayTime > 30) {
        //         //表示播放完成
        //         Player.playEnd();
        //         return;
        //     }
        // }
        // // 播放开始
        //
        // if (progressLength == 0) {
        //     Player.setVisibilityForSpeedUI(false);
        //     LMEPG.mp.setPlayerState(LMEPG.mp.State.PLAY);
        //     if (!isDetainPageShowing) // 如果播放器还未初始化完成，按返回，播放进度为0，这个底部条就一直显示
        //         Player.Progress.show(true);
        // }
        // /*if (progressLength == 0) {
        //     LMEPG.mp.resume();
        // }*/
        //
        // // 防止当视频未加载完，用户按返回键已弹出挽留页，避免此时视频加载完回来继续播放，应当暂停播放
        // if (isDetainPageShowing) {
        //     Player.Status.pause();
        // }
    },

    /** 进度条回调接口 */
    onProgress: function () {
        // 取出“视频总时长、当前已播放时长”
        var mpTimes = Player.getTimesArray();
        if(RenderParam.carrierId == '450092'){
            this.setProgressTime(mpTimes);
        }
        var totalDuration = mpTimes[0];
        var curPlayTime = mpTimes[1];
        if (!isDetainPageShowing) {
            debug1('播放状态：' + LMEPG.mp.getPlayerState() + ', 倍速：' + LMEPG.mp.getSpeed() + ', 播放进度：' + curPlayTime + '/' + totalDuration + '(s)');
        }

        // 显示“当前时长:总时长”
        if (!this.videoDuration) this.videoDuration = totalDuration;
        G('totaltime').innerHTML = LMEPG.Func.formatTimeInfo(1, this.videoDuration); //设置总时长
        var pTime = LMEPG.Func.formatTimeInfo(1, curPlayTime);//设置当前播放时间
        if (pTime === '0-1:0-1') return; //表示读时间进度有问题，不给予更新时间
        G('ptime').innerHTML = pTime;

        // 更新进度条UI比例效果
        var rate = this.getPlayRate();       //当前播放的比例，取值0-1
        var progressLength = rate * this.progressWidth;//进度条的长度
        if (this.currentSeekSecond < 0) {
            G('fill').style.width = progressLength + 'px';
            if (progressLength > this.indicatorWidth / 2) {
                G('ball').style.left = (progressLength - this.indicatorWidth / 2) + 'px';
            }
        }

        // 为了解决烽火盒子对快退播放视频，重新播放时，快退的UI界面没有隐藏问题
        if (this.currentSeekSecond < 2) {
            Player.setVisibilityForSpeedUI(false);
        }

        // 防止当视频未加载完，用户按返回键已弹出挽留页，避免此时视频加载完回来继续播放，应当暂停播放
        if (isDetainPageShowing) {
            Player.Status.pause();
            Player.setVisibilityForPauseUI(false);
        }

        // 针对某些地区盒子，播放结束后不会发出结束虚拟按键，以致于无法知道是否播放完毕。
        // 对此，目前解决办法为：比较“当前播放时长和总时长”，当二者相等是，则认为播放结束。
        try {
            switch (RenderParam.carrierId) {
                case '450092'://广西电信
                case '420092'://湖北电信
                    // 提前1s结束。因为存在可能既不发768虚拟结束信号，获取的currentPlayTime到不了视频的最后1s情况，就无法
                    // 知道是否结束。此行提前1s判断，尝试解决。
                    if (curPlayTime > 0 && totalDuration > 0 && (curPlayTime + 1) >= totalDuration) {
                        setTimeout(function () {
                            Player.playToEnd(true);
                        }, 500);
                    }
                    break;
            }
        } catch (e) {
            //
            LMEPG.Log.error('-------V2::Player.js::onProgress()-----> error:' + e.toString());
        }
    },

    /**
     * 音量（Volume）调节
     * volumeValue 当前的音频值
     */
    showVolumeProgressBar: function (volumeValue) {
        this.isVolumeProgressShow = true;
        S('volumeUI');//进度条外圈UI
        this.moveVolumeProgressBar(volumeValue); // 移动音频进度条
        this.restartVolumeProgress();
    },

    /** 隐藏音量度 */
    hideVolumeProgressBar: function () {
        this.isVolumeProgressShow = false;
        H('volumeUI');//进度条外圈UI
    },

    /** 移动音频进度条 */
    moveVolumeProgressBar: function (volumeValue) {
        var offset = volumeValue * 4;
        switch (RenderParam.carrierId) {
            case '450092'://广西电信
                var volumeWidth = isHD() ? 420 : 210; //这个值跟css中的声音进度条保持一致
                offset = volumeWidth * (volumeValue / 100);
                break;
            default:
                offset = volumeValue * 4;
                break;
        }
        // G('volume_ball').style.left = offset + 'px';//不显示球状拖动条
        G('volume_fill').style.width = offset + 'px';
        G('volume_horn').src = offset === 0 ? C.Pic.volume_mute : C.Pic.volume_horn;
    },

    /** 音量调节进度度显示开始计时 */
    restartVolumeProgress: function () {
        if (this.autoHideVolumeProgressTimer) clearTimeout(this.autoHideVolumeProgressTimer);
        this.autoHideVolumeProgressTimer = setTimeout(function () {
            Player.Progress.hideVolumeProgressBar();
        }, this.AUTO_HIDE_VOLUME_PROGRESS_TIME);// 5秒钟后自动隐藏
    }


};

/****************************************************************
 * 按键监听控制
 *****************************************************************/
var PlayerKeyEventManager = {

    /** 返回上一页 */
    jumpBack: function () {
        LMEPG.Intent.back();
    },

    /** 返回键 */
    onBack: function () {
        if (isDetainPageShowing) {  // 退出播放器页面
            this.jumpBack();
        } else {                    // 隐藏进度条
            Player.setVisibilityForPauseUI(false); // 如果是从“暂停”状态按返回键到“挽留页”，先隐藏暂停按钮
            Player.Status.pausePlaying();
        }
    },

    /** 上键。*/
    onKeyUp: function (currentBtnObj) {
        if (isDetainPageShowing) {
            if (currentBtnObj.id.startWith('focus-2')) {
                LMEPG.ButtonManager.requestFocus(FocusKeeper.lastFocusedBtnIdOfLine1);
            }
        } else {
            Player.Progress.show();
        }
    },

    /** 下键。*/
    onKeyDown: function (currentBtnObj) {
        if (isDetainPageShowing) {
            if (currentBtnObj.id.startWith('focus-1')) {
                LMEPG.ButtonManager.requestFocus(FocusKeeper.lastFocusedBtnIdOfLine2);
            }
        } else {
            Player.Progress.show();
        }
    },

    /** 左键。*/
    onKeyLeft: function (currentBtnObj) {
        if (isDetainPageShowing) {
            // 这里应用层不做处理，由按钮框架内部处理
        } else {
            Player.Progress.show();
            Player.Progress.beforeMoveIndicator(C.Dir.LEFT);
        }
    },

    /** 右键。*/
    onKeyRight: function (currentBtnObj) {
        if (isDetainPageShowing) {
            // 这里应用层不做处理，由按钮框架内部处理
        } else {
            Player.Progress.show();
            Player.Progress.beforeMoveIndicator(C.Dir.RIGHT);
        }
    },

    /** “确定”按键 */
    onEnterKeyClicked: function () {
        if (isDetainPageShowing) {  // 挽留页按钮点击“确定”按钮
            var focusBtnObj = LMEPG.ButtonManager.getCurrentButton();
            ButtonAction.onClick(focusBtnObj);
        } else {                // 播放视频中点击“确定”按钮
            Player.Status.pausePlaying();
        }
    },

    /** “静音”按键 */
    onMuteKeyClicked: function () {
        LMEPG.mp.toggleMuteFlag();
    },

    /** “虚拟”按键 */
    onVirtualKeyClicked: function () {
        eval('oEvent = ' + Utility.getEvent());
        var keyCode = oEvent.type;
        if (!LMEPG.mp.bind(oEvent)) {
            return;
        }
        LMEPG.Log.info('PlayerKeyEventManager.onVirtualKeyClicked:' + keyCode);
        if (keyCode === 'undefined') {
            var oEvent = eval('(' + Utility.getEvent() + ')');
            keyCode = oEvent.type;
            debug2('PlayerKeyEventManager.onVirtualKeyClicked_2:' + keyCode);
        }

        if (LMEPG.mp.isEnd(keyCode) || (LMEPG.mp.isPlayModeChanged(keyCode) && LMEPG.mp.checkPlayEndManually())) { //播放结束
            Player.playToEnd();
        } else if (LMEPG.mp.isError(keyCode)) {// 播放错误
        } else if (LMEPG.mp.isBeginning(keyCode)) {
            G('ball').style.left = '0px';
            Player.setVisibilityForSpeedUI(false);
            Player.setVisibilityForPauseUI(false);
        } else {
            if (RenderParam.carrierId === '450092') {
                // 广西电信
                // :::广西标清盒子 EC2108B_pub，结束后得到虚拟信号 undefined且时长变为0，则认为播放结束！
                if (keyCode === 'undefined' && Player.Status.curPlayerState === 'play') {
                    Player.playToEnd(true);
                    return;
                }
            }

            if (isDetainPageShowing) { // 修正当弹出推荐视频后，当视频数据缓冲结束会自动播放视频的问题
                LMEPG.mp.pause();
            }
        }
    },

    /** “音量+/-”按键 */
    onVolumeChanged: function (dir) {
        if (dir === C.Dir.UP) {                  // 音量+
            var volumeValue = LMEPG.mp.upVolume();
            Player.Progress.showVolumeProgressBar(volumeValue);
        } else if (dir === C.Dir.DOWN) {         // 音量-
            var volumeValue = LMEPG.mp.downVolume();
            Player.Progress.showVolumeProgressBar(volumeValue);
        }
    },

    /** “快进/快退”按键。dir：left|right */
    onSpeedChanged: function (dir) {
        if (dir === C.Dir.RIGHT) {            // 快进
            Player.Progress.show();
            Player.Progress.beforeMoveIndicator(C.Dir.RIGHT);
        } else if (dir === C.Dir.LEFT) {     // 快退
            Player.Progress.show();
            Player.Progress.beforeMoveIndicator(C.Dir.LEFT);
        }
    },

    /** “上/下/左/右”按键。dir必为之一：up/down/left/right */
    onDirectionKeyMoved: function (dir) {
        if (isDetainPageShowing) {  // 暂停状态：弹出挽留页。使用框架内部统一处理挽留页按钮移动焦点行为。
            LMEPG.ButtonManager._onMoveChange(dir);
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

    /** 重播 或 继续播放 */
    resumeOrReplay: function (btn) {
        debug2('PlayerKeyEventManager.resumeOrReplay(' + (btn.funcType === C.FuncType.RESUME) + ')');
        if (btn.funcType === C.FuncType.RESUME) {
            Player.Progress.hide(); //隐藏进度条
            Player.Status.togglePlayerState();
        } else {
            window.location.reload();
        }
    },

    /** 点击播放挽留页推荐视频之一 */
    playVideo: function (btn) {
        if (btn.dataObj.show_status == '3') {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }

        // 加强判断处理：非点击挽留页推荐视频，拒绝播放
        if (!isDetainPageShowing) {
            console.log('-------playVideo(btn)------->>> 非挽留页推荐视频点击，拒绝操作！');
            return;
        }
        // 按钮对象无效：拒绝播放
        if (typeof btn === 'undefined' || btn == null) {
            console.log('-------playVideo(btn)------->>> invalid button，拒绝操作！');
            return;
        }

        var btnId = btn.id;
        if (btnId.startWith('focus-1')) {
            //得到播放地址
            var videoInfo = {
                'sourceId': G(btnId).getElementsByTagName('img')[0].getAttribute('sourceId'),
                'videoUrl': encodeURIComponent(G(btnId).getElementsByTagName('img')[0].getAttribute(isHD() ? 'gqPlayUrl' : 'bqPlayUrl')),
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
            LMEPG.Log.info('play recommend videoInfo:' + JSON.stringify(videoInfo));
            if (Player.allowPlayVideo(videoInfo.freeSeconds)) {
                // 直接播放推荐视频
                Page.jumpPlayVideo(videoInfo);
            } else {
                // 如果isForbidOrder = 1，表示不允许订购，直接返回
                if (RenderParam.isForbidOrder == '1') {
                    LMEPG.UI.showToast("您已受限订购该业务，暂时不能订购!", 3);
                    window.setTimeout(function () {
                        LMEPG.Intent.back();
                    }, 3000);
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
                KEY_BACK: 'PlayerKeyEventManager.onBack()',                                   // 返回
                KEY_ENTER: 'PlayerKeyEventManager.onEnterKeyClicked()',                        // 确定
                KEY_MUTE: 'PlayerKeyEventManager.onMuteKeyClicked()',                         // 静音
                KEY_VIRTUAL_EVENT: 'PlayerKeyEventManager.onVirtualKeyClicked()',                      // 虚拟按键
                EVENT_MEDIA_END: 'PlayerKeyEventManager.onVirtualKeyClicked()',                      // 虚拟按键
                EVENT_MEDIA_ERROR: 'PlayerKeyEventManager.onVirtualKeyClicked()',                      // 虚拟按键
                KEY_VOL_UP: 'PlayerKeyEventManager.onVolumeChanged("' + C.Dir.UP + '")',        // 音量+
                KEY_VOL_DOWN: 'PlayerKeyEventManager.onVolumeChanged("' + C.Dir.DOWN + '")',      // 音量+
                KEY_DELETE: 'PlayerKeyEventManager.onBack()',                                   // 兼容辽宁华为EC2108V3H的删除键（返回键）
                KEY_FAST_FORWARD: 'PlayerKeyEventManager.onSpeedChanged("' + C.Dir.RIGHT + '")',      // 快进>>
                KEY_FAST_REWIND: 'PlayerKeyEventManager.onSpeedChanged("' + C.Dir.LEFT + '")',       // 快退<<
                KEY_UP: 'PlayerKeyEventManager.onDirectionKeyMoved("' + C.Dir.UP + '")',    // 上键
                KEY_DOWN: 'PlayerKeyEventManager.onDirectionKeyMoved("' + C.Dir.DOWN + '")',  // 下键
                KEY_LEFT: 'PlayerKeyEventManager.onDirectionKeyMoved("' + C.Dir.LEFT + '")',  // 左键
                KEY_RIGHT: 'PlayerKeyEventManager.onDirectionKeyMoved("' + C.Dir.RIGHT + '")', // 右键
                KEY_EXIT: 'PlayerKeyEventManager.jumpBack()'                                  // 退出按键
            }
        );
    }
};

/****************************************************************
 * Button事件
 *****************************************************************/
var ButtonAction = {
    beforeMoveChange: function (dir, current) {
        console.log('--------beforeMoveChange---' + current.id + ', ' + dir);
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
        console.log('--------onFocusChange---' + btn.id + ', ' + hasFocus);
        PlayerFocus.hasFocus(btn, hasFocus);

        // 上一次的焦点保持记录
        if (isDetainPageShowing && hasFocus) {
            FocusKeeper.record(btn.id);
        }
    },

    onClick: function (btn) {
        switch (btn.id) {
            // 挽留页1-4推荐位
            case 'focus-1-1':
            case 'focus-1-2':
            case 'focus-1-3':
            case 'focus-1-4':
                PlayerKeyEventManager.playVideo(btn);
                break;

            // 挽留页底部按钮：重播/继续播放、收藏/取消收藏、退出
            case 'focus-2-1':
            case 'replay':
                PlayerKeyEventManager.resumeOrReplay(btn);
                break;
            case 'focus-2-2':
                var expectedStatus = RenderParam.collectStatus == 1 ? 0 : 1;  //改变收藏状态
                Player.Status.setCollectStatus(RenderParam.sourceId, expectedStatus);
                break;
            case 'focus-2-3':
            case 'close':
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
        // 0: focus-1-1
        {
            id: 'focus-1-1',
            name: '挽留页-推荐位1',
            type: 'div',
            focusable: true,
            backgroundImage: '',
            focusImage: '',
            nextFocusLeft: 'focus-1-4',//从第1个推荐视频，继续按左键循环移动到最右第4个推荐视频位上
            nextFocusUp: '',
            nextFocusRight: 'focus-1-2',
            nextFocusDown: FocusKeeper.lastFocusedBtnIdOfLine2,
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 1: focus-1-2
        {
            id: 'focus-1-2',
            name: '挽留页-推荐位2',
            type: 'div',
            focusable: true,
            backgroundImage: '',
            focusImage: '',
            nextFocusLeft: 'focus-1-1',
            nextFocusUp: '',
            nextFocusRight: 'focus-1-3',
            nextFocusDown: FocusKeeper.lastFocusedBtnIdOfLine2,
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 2: focus-1-3
        {
            id: 'focus-1-3',
            name: '挽留页-推荐位3',
            type: 'div',
            focusable: true,
            backgroundImage: '',
            focusImage: '',
            nextFocusLeft: 'focus-1-2',
            nextFocusUp: '',
            nextFocusRight: 'focus-1-4',
            nextFocusDown: FocusKeeper.lastFocusedBtnIdOfLine2,
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 3: focus-1-4
        {
            id: 'focus-1-4',
            name: '挽留页-推荐位4',
            type: 'div',
            focusable: true,
            backgroundImage: '',
            focusImage: '',
            nextFocusLeft: 'focus-1-3',
            nextFocusUp: '',
            nextFocusRight: 'focus-1-1',//从第4个推荐视频，继续按右键循环移动到最左第1个推荐视频位上
            nextFocusDown: FocusKeeper.lastFocusedBtnIdOfLine2,
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.RECOMMEND_VIDEO,
            dataObj: null//推荐视频对象
        },
        // 4: focus-2-1
        {
            id: 'focus-2-1',
            name: '挽留页-重播/继续播放',
            type: 'img',
            focusable: true,
            backgroundImage: '', //动态更新值
            focusImage: '', //动态更新值
            nextFocusLeft: 'focus-2-3',//从第1个按钮，继续按左键循环移动到最右第3个按钮上
            nextFocusUp: FocusKeeper.lastFocusedBtnIdOfLine1,
            nextFocusRight: 'focus-2-2',
            nextFocusDown: '',
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.RESUME //自定义属性
        },
        // 5: focus-2-2
        {
            id: 'focus-2-2',
            name: '挽留页-收藏/取消收藏',
            type: 'img',
            focusable: true,
            backgroundImage: '', //动态更新值
            focusImage: '', //动态更新值
            nextFocusLeft: 'focus-2-1',
            nextFocusUp: FocusKeeper.lastFocusedBtnIdOfLine1,
            nextFocusRight: 'focus-2-3',
            nextFocusDown: '',
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.COLLECT //自定义属性
        },
        // 6: focus-2-3
        {
            id: 'focus-2-3',
            name: '挽留页-退出',
            type: 'img',
            focusable: true,
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/Exit.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/ExitFocus.png',
            nextFocusLeft: 'focus-2-2',
            nextFocusUp: FocusKeeper.lastFocusedBtnIdOfLine1,
            nextFocusRight: 'focus-2-1',//从第3个按钮，继续按右键循环移动到最左第1个按钮上
            nextFocusDown: '',
            beforeMoveChange: ButtonAction.beforeMoveChange,
            focusChange: ButtonAction.onFocusChange,
            click: ButtonAction.onClick,
            funcType: C.FuncType.EXIT //自定义属性
        },
        //  close -- 重播/继续播放
        {
            id: 'close',
            name: '挽留页-退出播放',
            type: 'img',
            focusable: true,
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/Exit.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/ExitFocus.png',
            nextFocusLeft: 'replay',
            nextFocusRight: 'replay',
            click: ButtonAction.onClick,
            funcType: C.FuncType.EXIT //自定义属性
        },
        //  replay -- 重播/继续播放
        {
            id: 'replay',
            name: '挽留页-重播/继续播放',
            type: 'img',
            focusable: true,
            backgroundImage: '', //动态更新值
            focusImage: '', //动态更新值
            nextFocusLeft: 'close',//从第1个按钮，继续按左键循环移动到最右第3个按钮上
            nextFocusRight: 'close',
            click: ButtonAction.onClick,
            funcType: C.FuncType.RESUME //自定义属性
        }
    ];
}

// 页面加载完成
window.onload = function () {
    debug2('《当前页面已加载完成。》');
    debug1();
    G('default_link').focus();  // 防止页面丢失焦点
    //办事处要求20入口视频免费播放
    if(RenderParam.carrierId == '420092' && RenderParam.lmp == '20'){
        RenderParam.userType = 0;
    }

    Player.initJSPrams(); // 初始化或者转换必要的JS参数！
    Player.initSpeedUI(); // 初始化“倍速”相关控件
    Player.initPlayOrReplay(0); // 初始化渲染 “继续播放/重播”相关控件
    Player.initCollectOrNot(RenderParam.collectStatus); // 初始化渲染 “收藏/取消收藏”相关控件
    Player.initRecommendVideoInfo(RenderParam.userId); // 加载数据并初始化渲染 “推荐视频1-4”相关控件
    Player.setVisibilityForDetainPageUI(false); // 隐藏更多显示，防止已进入就显示

    Player.initPlayerWithIframe(); // 初始化播放器
    Player.Progress.start(); // 启动进度条显示

    // 注册按键监听事件
    LMEPG.ButtonManager.init('', buttons, '', true);
    PlayerKeyEventManager.registerSpecialKeys(); // 覆写某些特殊按键事件处理
    lmInitGo();
};

// 页面销毁前
window.onbeforeunload = function (ev) {
    debug2('《即将关闭当前页面……》');
};

// 页面销毁
window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
    Player.release(); // 释放其它资源
};

// 页面错误
window.onerror = function (message, filename, lineno) {
    var errorLog = '[Player.js]::error --->' + '\nmessage:' + message + '\nfile_name:' + filename + '\nline_NO:' + lineno;
    if (debug_mode) {
        debug2('window.onerror:' + message);
        LMEPG.UI.showToast(errorLog);
    }
    LMEPG.Log.error(errorLog);
};

////////////////////////////////
// 加载js优先初始化必要数据！ //
////////////////////////////////
Player.init();

/**
 * 网络请求
 */
var Network = {
    dialogMsg: {
        forbiddenAsk: '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。',
        noTimes: '您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊'
    },

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
     * 保存用户视频集播放进度
     */
    saveVideoSetProgress: function (value) {
        if (!LMEPG.Func.isEmpty(RenderParam.subjectId)) {
            var postData = {
                "key": "EPG-LWS-LATEST-VIDEOINFO-VIDEOSET-" + RenderParam.subjectId + '-' + RenderParam.carrierId + "-" + RenderParam.userId,
                "value": value
            };
            LMEPG.ajax.postAPI('Activity/saveStoreData', postData, function (rsp) {
                console.log(rsp);
            });
        }
    },
};