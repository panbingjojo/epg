/**
 * 新疆电信天天健身播放器控制器
 */
var scene;
var CUCCPlayer = {
    /*初始化函数*/
    init: function () {
        this.createBtns();
        this.paySureTipOn();

        G("video-title").innerHTML = RenderParam.videoInfo.title; // 设置视频标题
        CUCCPlayer.initRecommendVideoInfo(RenderParam.userId); // 加载数据并初始化渲染 “推荐视频1-3”相关控件
        // 设置收藏按钮显示
        CUCCPlayer.setCollectBtnUI();
        // 设置播放按钮文字
        G("playText").innerHTML = "继续播放";
    },
    /*切换模态框*/
    previousModal: '',
    toggleModal: function (id) {
        // id:需要显示的模态层id
        // 以下模态层除支付层为唯一性（即唯一一个显示效果）；
        // 分级为下面模态层（播放导航）；
        // 中间模态层（上下集切换）；
        // 全局层（推荐视频--触发为退出该播放视频）；
        H(this.previousModal);
        this.previousModal = id;
        S(id);
        console.log(1);
    },
    /*订购VIP提示 （普通用户一直显示支付按钮提示）*/
    paySureTipOn: function () {
        // 联通山东/山西/辽宁/河南/内蒙地区
        if (RenderParam.carrierId == '000051') {
            if (RenderParam.areaCode == '216' || RenderParam.areaCode == '207' || RenderParam.areaCode == '209'
                || RenderParam.areaCode == '204' || RenderParam.areaCode == '208') {
                var surePay = G("tip-press-sure-pay");
                surePay.innerHTML = '<img src="__ROOT__/Public/img/hd/Player/V21/btn_sure_f_2.png"/>';
                surePay.className = "tip-press-sure-pay-2";
            }
        }
        var isVip = RenderParam.isVip; // 后台拉取
        if (isVip == 0) {
            S('tip-press-sure-pay');
            this.moveToFocus('tip-press-sure-pay');
        }
    },
    /*切换播放/暂停*/
    togglePlay: function () {
    },
    /*快进*/
    fastForward: function () {
    },
    /*快退*/
    fastBackward: function () {
    },
    /*视频集的上一集*/
    prevVideoItem: function () {
    },
    /*视频集的下一集*/
    nextVideoItem: function () {
    },
    /*音量加+*/
    volumeUp: function () {
    },
    /*音量减-*/
    volumeDown: function () {
    },
    /*解析第三方播放地址前缀*/
    resolveSPUrl: function () {
    },
    /*普通用户订购会员*/
    buyVip: function () {
    },
    /*返回/退出*/
    back: function () {
        LMEPG.Intent.back();
    },
    /*播放按钮状态切换*/
    onFocusTogglePlayStatusUI: function (btn, hasFocus) {

        if (hasFocus) {
            if (!btn.isPlay) {
                G(btn.id).src = btn.focusPlayImage;
            }
        } else {
            if (btn.isPlay) {
                G(btn.id).src = btn.focusImage;
            }
        }
    },
    onClickTogglePlayStatusAction: function (btn) {
        if (btn.isPlay) {
            LMEPG.mp.pause();
        } else {
            LMEPG.mp.play();
        }
        btn.isPlay = !btn.isPlay;
    },
    toggleMarquee: function (btn, hasFocus) {
        /*var textEl = G(btn.id).lastElementChild;
        if (hasFocus) {
            LMEPG.Func.marquee(textEl, {wordsW: 11}, true);
        } else{
            LMEPG.Func.marquee(textEl);
        }*/
    },
    /*创建虚拟按钮*/
    buttons: [],
    createBtns: function () {
        this.buttons.push(
            {
                id: 'focus-0',
                name: '',
                type: 'div',
                nextFocusUp: '',
                nextFocusDown: 'collect',
                nextFocusLeft: '',
                nextFocusRight: 'focus-1',
                backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.platformType == 'sd' ?g_appRootPath+ '/Public/img/sd/Unclassified/V21/video_f.png' : g_appRootPath+'/Public/img/hd/Player/V21/video_f.png',
                click: ButtonAction.onClick,
                focusChange: this.toggleMarquee,
                beforeMoveChange: '',
                dataObj: null//推荐视频对象
            },
            {
                id: 'focus-1',
                name: '',
                type: 'div',
                nextFocusUp: '',
                nextFocusDown: 'replay',
                nextFocusLeft: 'focus-0',
                nextFocusRight: 'focus-2',
                backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.platformType == 'sd' ? g_appRootPath+'/Public/img/sd/Unclassified/V21/video_f.png' : g_appRootPath+'/Public/img/hd/Player/V21/video_f.png',
                click: ButtonAction.onClick,
                focusChange: this.toggleMarquee,
                beforeMoveChange: '',
                dataObj: null//推荐视频对象
            },
            {
                id: 'focus-2',
                name: '',
                type: 'div',
                nextFocusUp: '',
                nextFocusDown: 'back',
                nextFocusLeft: 'focus-1',
                nextFocusRight: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.platformType == 'sd' ? g_appRootPath+'/Public/img/sd/Unclassified/V21/video_f.png' : g_appRootPath+'/Public/img/hd/Player/V21/video_f.png',
                click: ButtonAction.onClick,
                focusChange: this.toggleMarquee,
                beforeMoveChange: '',
                dataObj: null//推荐视频对象
            },
            {
                id: 'collect',
                name: '收藏',
                type: 'img',
                nextFocusUp: 'focus-0',
                nextFocusDown: '',
                nextFocusLeft: '',
                nextFocusRight: 'replay',
                backgroundImage: g_appRootPath + '/Public/img/hd/Player/V21/btn_collect.png',
                focusImage: g_appRootPath + '/Public/img/hd/Player/V21/btn_collect_f.png',
                click: ButtonAction.onClick,
                beforeMoveChange: ''
            },
            {
                id: 'replay',
                name: '重播/继续播放',
                type: 'img',
                nextFocusUp: 'focus-1',
                nextFocusDown: '',
                nextFocusLeft: 'collect',
                nextFocusRight: 'back',
                backgroundImage: g_appRootPath + '/Public/img/hd/Player/V21/btn_replay.png',
                focusImage: g_appRootPath + '/Public/img/hd/Player/V21/btn_replay_f.png',
                click: ButtonAction.onClick,
                focusChange: '',
                beforeMoveChange: ''
            },
            {
                id: 'btn_one_key_inquiry',
                name: '一键问医',
                type: 'img',
                nextFocusUp: 'focus-1',
                nextFocusDown: '',
                nextFocusLeft: 'replay',
                nextFocusRight: 'back',
                backgroundImage: g_appRootPath + '/Public/img/hd/Player/V21/one_key_inquiry.png',
                focusImage: g_appRootPath + '/Public/img/hd/Player/V21/one_key_inquiry_f.png',
                click: ButtonAction.onClick,
                focusChange: '',
                beforeMoveChange: ''
            },
            {
                id: 'back',
                name: '返回/退出',
                type: 'img',
                nextFocusUp: 'focus-2',
                nextFocusDown: '',
                nextFocusLeft: 'replay',
                nextFocusRight: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/Player/V21/btn_back.png',
                focusImage: g_appRootPath + '/Public/img/hd/Player/V21/btn_back_f.png',
                click: ButtonAction.onClick,
                focusChange: '',
                beforeMoveChange: ''
            }, {
                id: 'prev-video-item',
                name: '',
                type: 'img',
                nextFocusUp: '',
                nextFocusDown: '',
                nextFocusLeft: '',
                nextFocusRight: 'continue-play',
                backgroundImage: g_appRootPath + '/Public/img/hd/Player/V21/prev_video_item.png',
                focusImage: g_appRootPath + '/Public/img/hd/Player/V21/prev_video_item_f.png',
                click: '',
                focusChange: '',
                beforeMoveChange: ''
            },
            {
                id: 'continue-play',
                name: '',
                type: 'img',
                nextFocusUp: '',
                nextFocusDown: '',
                nextFocusLeft: 'prev-video-item',
                nextFocusRight: 'next-video-item',
                backgroundImage: g_appRootPath + '/Public/img/hd/Player/V21/btn_pause.png',
                focusImage: g_appRootPath + '/Public/img/hd/Player/V21/btn_pause_f.png',
                click: '',
                focusChange: '',
                beforeMoveChange: ''
            },
            {
                id: 'next-video-item',
                name: '',
                type: 'img',
                nextFocusUp: '',
                nextFocusDown: '',
                nextFocusLeft: 'continue-play',
                nextFocusRight: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/Player/V21/next_video_item.png',
                focusImage: g_appRootPath + '/Public/img/hd/Player/V21/next_video_item_f.png',
                click: '',
                focusChange: '',
                beforeMoveChange: ''
            },
            {
                id: 'tip-press-sure-pay',
                name: '支付提示',
                click: ButtonAction.onClick,
            },
            {
                id: 'default_link',
                name: '',
                type: 'img',
                nextFocusUp: '',
                nextFocusDown: '',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: '',
                focusImage: '',
                click: '',
                focusChange: '',
                beforeMoveChange: ''
            });
        this.initButtons('default_link');
    },
    initButtons: function (id) {
        LMEPG.ButtonManager.init(id, this.buttons, '', true);
    },
    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },

    /**
     * 根据 播放-1/暂停-2/快进-3/快退-4 设置不同的图片
     */
    setPlayStatusImg: function (status) {
        if (status == 1) {
            G('toggle-play').src =g_appRootPath+ '/Public/img/hd/Player/V21/btn_play_f.png';
            G('fast-backward').src = g_appRootPath+'/Public/img/hd/Player/V21/fast_backward.png';
            G('fast-forward').src = g_appRootPath+'/Public/img/hd/Player/V21/fast_forward.png';
            G('toggle-play-text').innerHTML = '播放';
        } else if (status == 2) {
            G('toggle-play').src = g_appRootPath+'/Public/img/hd/Player/V21/btn_pause_f.png';
            G('fast-backward').src = g_appRootPath+'/Public/img/hd/Player/V21/fast_backward.png';
            G('fast-forward').src =g_appRootPath+ '/Public/img/hd/Player/V21/fast_forward.png';
            G('toggle-play-text').innerHTML = '暂停';

        } else if (status == 3) {
            G('toggle-play').src =g_appRootPath+ '/Public/img/hd/Player/V21/btn_pause.png';
            G('fast-backward').src = g_appRootPath+'/Public/img/hd/Player/V21/fast_backward.png';
            G('fast-forward').src =g_appRootPath+ '/Public/img/hd/Player/V21/fast_forward_f.png';
            G('toggle-play-text').innerHTML = '暂停';

        } else if (status == 4) {
            G('toggle-play').src =g_appRootPath+ '/Public/img/hd/Player/V21/btn_pause.png';
            G('fast-backward').src = g_appRootPath+'/Public/img/hd/Player/V21/fast_backward_f.png';
            G('fast-forward').src =g_appRootPath+ '/Public/img/hd/Player/V21/fast_forward.png';
            G('toggle-play-text').innerHTML = '暂停';

        }
    },

    /**
     * 加载推荐位视频数据（即挽留页显示的1-3号位视频数据）
     * @param userId 当前用户id
     */
    initRecommendVideoInfo: function (userId) {
        debug2('Player.initRecommendVideoInfo(' + userId + ')');
        var postData = {
            'userId': userId,
            "videoUserType": 2 // 表示只取VIP可看的视频
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

                var recommendData = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log("recommendData---->:");
                console.log(recommendData);
                if (LMEPG.Func.isObject(recommendData)) {
                    if (!LMEPG.Func.isArray(recommendData.data) || recommendData.data.length <= 0) {
                        return;
                    }

                    for (var i = 0; i < recommendData.data.length; i++) {
                        // 接口返回了4条数据，只需要3条
                        if (i == 3)
                            break;
                        gqPlayUrl[i] = eval('(' + recommendData.data[i].ftp_url + ')').gq_ftp_url;
                        bqPlayUrl[i] = eval('(' + recommendData.data[i].ftp_url + ')').bq_ftp_url;
                        title[i] = recommendData.data[i].title;
                        image_url[i] = recommendData.data[i].image_url;
                        userType[i] = recommendData.data[i].user_type;
                        sourceId[i] = recommendData.data[i].source_id;
                        freeTimes[i] = recommendData.data[i].free_seconds;
                        G('recommend-title-' + i).innerHTML = title[i];
                        G('recommend-img-' + i).src = RenderParam.imgHost + image_url[i];
                        G('focus-' + i).setAttribute('gqPlayUrl', gqPlayUrl[i]);
                        G('focus-' + i).setAttribute('bqPlayUrl', bqPlayUrl[i]);
                        G('focus-' + i).setAttribute('user_type', userType[i]);
                        G('focus-' + i).setAttribute('sourceId', sourceId[i]);
                        G('focus-' + i).setAttribute('title', title[i]);
                        G('focus-' + i).setAttribute('freeSeconds', freeTimes[i]);

                        var itemDataObj = recommendData.data[i];
                        CUCCPlayer.buttons[i].dataObj = itemDataObj;
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
     * 设置收藏按钮显示
     */
    setCollectBtnUI: function () {
        var focusId = LMEPG.BM.getCurrentButton().id;
        if (RenderParam.collectStatus == 1) {
            G('collectStatus').innerHTML = '收藏';
            // this.buttons[0].backgroundImage = '/Public/img/hd/Player/V21/btn_collect.png';
            // this.buttons[0].focusImage = '/Public/img/hd/Player/V21/btn_collect_f.png';
            if (focusId == 'collect') {
                G('collect').src = g_appRootPath+'/Public/img/hd/Player/V21/btn_collect_f.png';
            } else {
                G('collect').src =g_appRootPath+ '/Public/img/hd/Player/V21/btn_collect.png';
            }
        } else {
            G('collectStatus').innerHTML = '取消收藏';
            // this.buttons[0].backgroundImage = '/Public/img/hd/Player/V21/btn_collected.png';
            // this.buttons[0].focusImage = '/Public/img/hd/Player/V21/btn_collected_f.png';
            if (focusId == 'collect') {
                G('collect').src = g_appRootPath+'/Public/img/hd/Player/V21/btn_collected_f.png';
            } else {
                G('collect').src = g_appRootPath+'/Public/img/hd/Player/V21/btn_collected.png';
            }
        }
    }
};


// +------------------------------------------------------------------------------------------------
// |                   原V1/Player相关JS逻辑，在上面做修改
// +------------------------------------------------------------------------------------------------

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
var isChangeVideoPageShowing = false; // 视频切换（上一集、下一集）页面显示标志
var isBuyVipTipsPageShowing = false; // 提示购买vip蒙层页面显示标志

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
                return g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Player/V1/speed_' + speed + '.png';
            } else {
                return undefined;
            }
        },

        // 倍速相关图标
        speed_play:g_appRootPath+ '/Public/img/' + RenderParam.platformType + '/Player/V1/speed_play.png',
        speed_rewind: g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Player/V1/speed_rewind.png',
        speed_forward:g_appRootPath+ '/Public/img/' + RenderParam.platformType + '/Player/V1/speed_forward.png',

        // 挽留页面相关图标
        replay: g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Player/V1/Replay.png',                             // “重播”：无焦点
        replay_focus: g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Player/V1/ReplayFocus.png',                  // “重播”：有焦点
        resume_replay: g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Player/V1/ResumePlay.png',                  // “继续播放”：无焦点
        resume_replay_focus:g_appRootPath+ '/Public/img/' + RenderParam.platformType + '/Player/V1/ResumePlayFocus.png',       // “继续播放”：有焦点
        collect:g_appRootPath+ '/Public/img/' + RenderParam.platformType + '/Player/V1/Collect.png',                           // “收藏”：无焦点
        collect_focus: g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Player/V1/CollectFocus.png',                // “收藏”：有焦点
        no_collect:g_appRootPath+ '/Public/img/' + RenderParam.platformType + '/Player/V1/NoCollect.png',                      // “取消收藏”：无焦点
        no_collect_focus:g_appRootPath+ '/Public/img/' + RenderParam.platformType + '/Player/V1/NoCollectFocus.png'           // “取消收藏”：有焦点
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
        objCurrent.setParam('subjectId', RenderParam.subjectId);
        return objCurrent;
    },

    /** 页面跳转 - 播放器 */
    jumpPlayVideo: function (videoInfo) {
        // 离开当前播放器页面，需要上报局方数据
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
    jumpBuyVip: function (remark, videoInfo, isDirectPay) {
        // 离开当前播放器页面，需要上报局方数据
        var objCurrent = this.getCurrentPage();
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('userId', RenderParam.userId);
        objOrderHome.setParam('isPlaying', '1');
        if (remark) {
            objOrderHome.setParam("remark", remark);
        }
        // 中国联通山东/山西/辽宁/河南/内蒙，在免费时长按确定或免费时长到了自动跳转局方订购
        if (RenderParam.carrierId == '000051') {
            if (RenderParam.areaCode == '216' || RenderParam.areaCode == '207' || RenderParam.areaCode == '209'
                || RenderParam.areaCode == '204' || RenderParam.areaCode == '208') {
                objOrderHome.setParam("directPay", isDirectPay);
            }
        }
        LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName) {
        var objHome = this.getCurrentPage();
        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },
};

/****************************************************************
 * 先声明当前的命名空间
 *****************************************************************/
var Player = {

    /**
     * 用于判断是否需要使用进度来判断是否播放完成
     */
    isNeedListenProgressEnd: function () {
        switch (RenderParam.carrierId) {
            case '440094':
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
            var durationTemp = parseInt(duration + "");
            if (!isNaN(durationTemp)) duration = durationTemp;
        }
        if (typeof currentPlayTime === 'string') { // 目前检测到：LMEPG.mp.getCurrentPlayTime()可能为"string"
            var currentPlayTimeTemp = parseInt(currentPlayTime + "");
            if (!isNaN(currentPlayTimeTemp)) currentPlayTime = currentPlayTimeTemp;
        }
        return [duration, currentPlayTime];
    },

    /** 初始化“快进”和“快退”控件 */
    initSpeedUI: function () {
        debug2('Player.initSpeedUI');
        G(C.ID.speed_rewind).setAttribute('src', C.Pic.speed_rewind);
        G(C.ID.speed_forward).setAttribute('src', C.Pic.speed_forward);
    },

    /**
     * @param show 显示还是隐藏“倍速”控件。true | false
     * @param dir 显示“倍速”控件的方向。left | right
     */
    setVisibilityForSpeedUI: function (show, dir) {
        if (show) {
            switch (dir) {
                case C.Dir.RIGHT:
                    debug2('Player.setVisibilityForSpeedUI(true, right)');
                    Hide(C.ID.speed_rewind);
                    Show(C.ID.speed_forward);
                    LMEPG.mp.fastForward();
                    // var timeArray = Player.getTimesArray();
                    // var currentSeekSecond = parseFloat(timeArray[1]);//当前seek时间
                    // var videoDuration = timeArray[0]; //总时长
                    //
                    // currentSeekSecond = parseFloat(currentSeekSecond + 10);
                    // if (currentSeekSecond >= (videoDuration - 1)) {
                    //     currentSeekSecond = parseFloat(videoDuration - 1);
                    // }
                    // var autoSeekTimer = setTimeout(function () {
                    //     LMEPG.mp.playByTime(currentSeekSecond);
                    // }, 500);

                    if (LMEPG.mp.isSpeedResumed()) {
                        hideAllSpeedViews();
                    }
                    break;
                case C.Dir.LEFT:
                    debug2('Player.setVisibilityForSpeedUI(true, left)');
                    Show(C.ID.speed_rewind);
                    Hide(C.ID.speed_forward);
                    LMEPG.mp.fastRewind();
                    if (LMEPG.mp.isSpeedResumed() || LMEPG.mp.getCurrentPlayTime() == 0) {
                        hideAllSpeedViews();
                    }
                    break;
                default:
                    return;
            }
            var tmpSrc = C.Pic.getSpeedPicBy(LMEPG.mp.getSpeed());
            if (tmpSrc) {
                Show(C.ID.speed);
                G(C.ID.speed).setAttribute('src', tmpSrc);
            }
        } else {
            hideAllSpeedViews();
        }

        function hideAllSpeedViews() {
            Hide(C.ID.speed_rewind);
            Hide(C.ID.speed_forward);
            Hide(C.ID.speed);
            // if (LMEPG.mp.getPlayerState() !== LMEPG.mp.State.PAUSE) Hide(C.ID.speed); // 若正在处于暂停并已显示暂停按钮，则继续保持暂停按钮显示状态
        }
    },

    /**
     * 显示/隐藏 挽留页
     * @param show 显示还是隐藏“挽留页”。true | false
     * @param focusId 在推荐页面的焦点，播放结束在第一个视频上，播放中返回选中继续播放按钮
     */
    setVisibilityForDetainPageUI: function (show, focusId) {
        debug2('Player.setVisibilityForDetainPageUI(' + show + ')');
        isDetainPageShowing = show;
        if (!LMEPG.Func.isEmpty(focusId))
            LMEPG.BM.requestFocus(focusId);
        else
            LMEPG.BM.requestFocus('focus-0');

        if (show) {
            Player.setVisibilityForSpeedUI(false);             // 关闭倍速
            H('bottom-navigation');
            H('tip-press-sure-pay');
            S('recommend-page');
        } else {
            H('recommend-page');
        }
    },

    /**
     * 隐藏或显示提示购买vip蒙层
     */
    setVisibilityForBuyVipTipsPageUI: function () {
        // 如果非vip并且视频不允许免费观看，则一直显示购买蒙层
        // RenderParam.isVip = 0; // 测试使用
        // RenderParam.videoInfo.userType = 1; //测试用
        if (RenderParam.isVip == 0 && +RenderParam.videoInfo.userType != 0) {
            S('tip-press-sure-pay');
            LMEPG.BM.requestFocus('tip-press-sure-pay');
            isBuyVipTipsPageShowing = true;
        }else{
            H('tip-press-sure-pay');
        }
    },

    /**
     * 初始化播放器：需要使用的第三方播放器前缀地址，即domainUrl有效才可调用该方法。
     */
    initPlayerWithDomainUrl: function () {
        debug2('Player.initPlayerWithDomainUrl->domainUrl: ' + RenderParam.domainUrl);
        setTimeout(function () {

            if (RenderParam.domainUrl == undefined || RenderParam.domainUrl == '') {
                return;
            }
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
            var thirdPlayerUrl = RenderParam.domainUrl;//默认用提供的前缀！特殊地区再根据接口拼接！
            switch (RenderParam.carrierId) {
                case "350092"://福建电信
                    info = LMEPG.mp.dispatcherUrl.getUrlWith350092(left, top, width, height, RenderParam.videoUrl);
                    break;
                case "360092"://江西电信
                    info = LMEPG.mp.dispatcherUrl.getUrlWith360092(left, top, width, height, RenderParam.videoUrl, RenderParam.platformType);
                    break;
                case "640092"://宁夏电信
                    info = LMEPG.mp.dispatcherUrl.getFullScreenUrlWith640092(RenderParam.videoUrl);
                    break;
                case '630092'://青海电信
                    thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
                    thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
                    var port_index = thirdPlayerUrl.indexOf(':');
                    var path_index = thirdPlayerUrl.indexOf('/');
                    var result = thirdPlayerUrl.substring(port_index, path_index);
                    thirdPlayerUrl = thirdPlayerUrl.replace('+++', '://');
                    var lmpf;
                    if (result === ':33200') {//华为端口
                        lmpf = 'huawei';
                        var index = thirdPlayerUrl.indexOf('/EPG/');
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/EPG/';
                    } else {
                        lmpf = 'zte';
                        var index = thirdPlayerUrl.lastIndexOf('/');
                        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/';
                    }
                    info = LMEPG.mp.dispatcherUrl.getUrlWith630092(left, top, width, height, RenderParam.videoUrl, lmpf);
                    break;
                case '650092'://新疆电信
                case '12650092'://新疆电信
                    thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
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
                    break;
                default:
                    info = LMEPG.mp.dispatcherUrl.getUrlWith320092(left, top, width, height, RenderParam.videoUrl);
                    break;
            }
            var factUrl = thirdPlayerUrl + info;
            LMEPG.Log.info("getPlayUrl ---- factUrl:" + factUrl);
            G('smallscreen').setAttribute('src', factUrl);
            LMEPG.mp.initPlayerByBind();
        }, 500);
    },

    /**
     * 广东广电获取播放串
     */
    getPlayUrl440094: function (videoId) {
        var titleAssetId = videoId;
        var callback = function (isSuccess, data) {
            LMEPG.Log.info("getPlayUrl440094 ---- callback:" + data);
            if (isSuccess) {
                LMEPG.mp.initPlayer().playOfFullscreen(data); //初始化并播放
                Player.getVideoInfo440094(titleAssetId); //获取视频信息
            } else {
                LMEPG.UI.showToast(data, 5);
                PlayerKeyEventManager.jumpBackDelay(5);
            }
        };
        window.UtilsWithGDGD.getPlayUrl(titleAssetId, callback);
    },

    /**
     * 重庆电信获取播放串
     */
    getPlayUrl500092: function (videoId) {
        LMEPG.Log.info("videoId data >>> " + videoId);
        var iframe = '<iframe id="hidden_frame" name="hidden_frame" style="width: 0;height: 0;" src=""></iframe>';
        var div = document.createElement("div");
        document.body.appendChild(div);
        div.innerHTML = iframe;
        var serverPath = RenderParam.serverPath+"service/"+RenderParam.partner+"PlayURLByMCService.jsp?mediacode=";
        var mediacode = videoId+"&inIFrame=1&onSuccess=Player.callBackPlayUrlResult&onError=0";
        var URL = serverPath+mediacode;
        G("hidden_frame").src = URL;
    },

    callBackPlayUrlResult:function(data){
        var json_data=JSON.parse(data);
        LMEPG.mp.initPlayer();
        LMEPG.mp.playOfFullscreen(json_data.resultSet[0]['playURL']);
    },

    /**
     * 广东广电获取视频信息
     */
    getVideoInfo440094: function (titleAssetId) {
        //回调函数
        var callback = function (isSuccess, data) {
            LMEPG.Log.info("getVideoInfo440094 ---- callback:" + data);
            if (isSuccess) {
                LMEPG.mp.setMediaDuration(data.progTimeLength);//保存视频总时长
                LMEPG.mp.play();//启动播放
            } else {
                LMEPG.UI.showToast(data, 5);
                PlayerKeyEventManager.jumpBackDelay(5);
            }
        };
        window.UtilsWithGDGD.getVideoInfo(titleAssetId, callback);
    },


    /**
     * 新疆电信EPG天天健身：通过iFrame获取播放串mediaStr，再进行播放（使用此方式，是为了兼容某升级平台）
     */
    getPlayUrl2650092: function (code) {
        /*-新疆电信完整的地址：
         * var url = "rtsp://222.83.5.77/88888888/16/20181126/271503595/271503595.ts?rrsip=222.83.5.77&icpid=SSPID&accounttype=1&limitflux=-1&limitdur=-1&accountinfo=:20181227134822,testiptv233HD,10.131.236.20,20181227134822,CDWYPro514339651743116122,F706F94FB0B33E6E7DD96BB90F60A6E6,-1,0,3,-1,,1,,,,1,END";
         * var code = "CDWYPro514339651743116122"; //第三方的媒资ID
         */

        var mediaStr = "";
        // var code = lmTVParams.get_v_VideoUrl();//我们平台的媒资ID

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
                    LMEPG.Log.error(LMEPG.STBUtil.getSTBModel() + (I_HD() ? "（高清）" : "（标清）") + "：iframe.getMediastr失败，切换默认方式！");
                    window.clearInterval(loopTimer) || (loopTimer = null);
                    lmPlayUrlFetcher.getIFramePlayUrlWithDomainUrl(RenderParam.carrierId, code, RenderParam.domainUrl, function (lmcid, mediaCode, iframePlayUrl) {
                        Player.__startPlayWithIframe(lmcid, mediaCode, iframePlayUrl);
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

    /******************************************************************************************
     * 启动播放 - 方式一：通过获取iframe播放串url，然后传递给iframe.src，最后启动MediaPlayer播放。
     ******************************************************************************************/
    __startPlayWithIframe: function (carrierId, mediaCode, iframePlayUrl, extraData) {
        LMEPG.mp.initPlayerByBindWithCustomUI(); // 具有自定义音量UI的初始化必须使用该方法！
    },

    /** 初始化播放器 */
    initPlayerWithIframe: function () {
        debug2('Player.initPlayerWithIframe');
        switch (RenderParam.carrierId) {
            case '320092'://江苏电信
            case '350092'://福建电信
            case '360092'://江西电信
            case '450092'://广西电信
            case '630092'://青海电信
            case '640092'://宁夏电信
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
                    // 首页点击“继续播放”进入，则从历史记录的秒数进行播放
                    if (!LMEPG.Func.isEmpty(RenderParam.videoInfo.lastedPlaySecond)) {
                        LMEPG.mp.playByTime(parseInt(RenderParam.videoInfo.lastedPlaySecond));
                    }
                }, 500);
                break;
            case '370092':
                LMEPG.mp.initPlayer();
                LMEPG.mp.playOfFullscreen(RenderParam.realVideoUrl);
                break;
            case '440094'://广东广电
                Player.getPlayUrl440094(RenderParam.videoUrl);
                break;
            case '500092':
                Player.getPlayUrl500092(RenderParam.videoUrl);
                break;
            case "12650092"://新疆电信天天健身
                // 新疆通过iframe.getMediar获取播放串，以兼容某升级平台
                Player.getPlayUrl2650092(RenderParam.videoUrl);
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
    },

    /**
     * 播放结束的回调函数
     */
    playEnd: function () {
        // 如果是从视频集进入，并且当前不是最后一集，则播放结束后自动跳转下一集
        if (!LMEPG.Func.isEmpty(RenderParam.subjectId)) {
            var videoInfo = RenderParam.videoInfo;
            var allVideoInfo = RenderParam.allVideoInfo;
            for (var i = 0; i < allVideoInfo.length; i++) {
                if (videoInfo.sourceId == allVideoInfo[i].sourceId && allVideoInfo.length - 1 != i) {
                    videoInfo = allVideoInfo[i + 1];
                    if (Player.allowPlayVideo(videoInfo)) {
                        // 直接播放推荐视频
                        LMEPG.UI.showToast("自动为您播放下一集", 2, function () {
                            Page.jumpPlayVideo(videoInfo);
                        });
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
                    return;
                }
            }
        }


        Player.setVisibilityForDetainPageUI(true);         // 显示更多视频页
        Player.setVisibilityForSpeedUI(false);             // 关闭倍速
        Player.Progress.hide();                             // 隐藏进度条
        Player.release();                                   // 释放资源
        G('current-time').innerHTML = LMEPG.Func.formatTimeInfo(1, LMEPG.mp.getMediaDuration());
        // 播放结束后，推荐页面的按钮修改为“重播”
        G('playText').innerHTML = '重播';
    },

    /**
     * 关闭上下集切换窗口
     */
    closeChangeVideoPage: function () {
        H('center-navigation');
        S('bottom-navigation');
        isChangeVideoPageShowing = false;
        Player.Status.resume();
        Player.Progress.show();
    },

    /**
     * 下一集
     */
    nextVideo: function () {
        if (!LMEPG.Func.isEmpty(RenderParam.subjectId)) {
            var videoInfo = RenderParam.videoInfo;
            var allVideoInfo = RenderParam.allVideoInfo;
            for (var i = 0; i < allVideoInfo.length; i++) {
                if (videoInfo.sourceId == allVideoInfo[i].sourceId) {
                    if (allVideoInfo.length - 1 != i) {
                        videoInfo = allVideoInfo[i + 1];
                        if (Player.allowPlayVideo(videoInfo)) {
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
                        return;
                    } else {
                        LMEPG.UI.showToast("当前已为最后一集", 2, function () {
                            Player.closeChangeVideoPage();
                        });
                    }
                }
            }
        } else {
            LMEPG.UI.showToast("无下一集，仅视频集支持");
        }
    },

    /**
     * 上一集
     */
    prevVideo: function () {
        if (!LMEPG.Func.isEmpty(RenderParam.subjectId)) {
            var videoInfo = RenderParam.videoInfo;
            var allVideoInfo = RenderParam.allVideoInfo;
            for (var i = 0; i < allVideoInfo.length; i++) {
                if (videoInfo.sourceId == allVideoInfo[i].sourceId) {
                    if (0 != i) {
                        videoInfo = allVideoInfo[i - 1];
                        if (Player.allowPlayVideo(videoInfo)) {
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
                        return;
                    } else {
                        LMEPG.UI.showToast("当前为第一集");
                    }
                }
            }
        } else {
            LMEPG.UI.showToast("无上一集，仅视频集支持");
        }
    }
};

/****************************************************************
 * 播放器页面状态控制：播放、暂停、前进、快退、收藏和取消收藏……
 *****************************************************************/
Player.Status = {
    // 当前播放状态：play | pause
    curPlayerState: 'play',
    // 播放
    resume: function () {
        CUCCPlayer.setPlayStatusImg(1);
        Player.setVisibilityForSpeedUI(false);
        LMEPG.mp.resume();
        debug2('Player.Status.resume()');
    },
    // 暂停
    pause: function () {
        CUCCPlayer.setPlayStatusImg(2);
        if (LMEPG.mp.getPlayerState() !== LMEPG.mp.State.PAUSE) debug2('Player.Status.pause()');
        LMEPG.mp.pause();
    },
    // 快进
    fastForward: function () {
        CUCCPlayer.setPlayStatusImg(1);
        Player.setVisibilityForSpeedUI(false);
        LMEPG.mp.resume();
        debug2('Player.Status.fastForward()');
    },
    // 快退
    fastRewind: function () {
        CUCCPlayer.setPlayStatusImg(1);
        Player.setVisibilityForSpeedUI(false);
        LMEPG.mp.resume();
        debug2('Player.Status.fastRewind()');
    },
    // 暂停正在播放
    pausePlaying: function () {
        Player.Progress.hide(); // 隐藏进度条
        this.togglePlayerState();
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
            Player.setVisibilityForDetainPageUI(true, 'replay');
        } else if (this.curPlayerState === 'play') {
            Player.setVisibilityForDetainPageUI(false);
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
                    CUCCPlayer.setCollectBtnUI();
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
    autoHideProgressTimer: null,                                    // 自动隐藏进度条定时器
    AUTO_HIDE_PROGRESS_TIME: 3 * 1000,                               // 自动隐藏菜单的时间，单位毫秒
    videoDuration: 0,                                                // 视频总时长
    progressWidth: isHD() ? 888 : 444,                               // 进度条总的宽度
    indicatorWidth: 40,                                              // 进度条指示器的宽度
    currentSeekSecond: -1,                                           // 当前seek的秒数，只要>=0就表示正在seek
    seekStep: 10,                                                    // 快进/快退单位时长，单位秒
    autoSeekTimer: 0,                                                // 快进/快退计时器

    /** 启动进度条计时器 */
    start: function () {
        debug2('Player.Progress.start');

        // 如果显示的是提示购买vip蒙层，则底部UI第一次进入就不显示了
        // if (!isBuyVipTipsPageShowing)
        //     Player.Progress.show();

        Player.Progress.show();

        //进入页面时，视频需要一定的加载时间
        setTimeout(function () {
            Player.Progress.onProgress();
            window.mpTimer = setInterval(function () {
                // 在需要暂停的页面暂停视频播放（主要是因为视频没初始化完成，就打开了推荐等页面，一会儿视频还是会继续播放）
                Player.Progress.pauseVideoInPausePage();
                // 播放器在不同的状态（播放、暂停、快进、快退）时，使底部蒙层的图标正确显示，防止特殊情况
                Player.Progress.updatePlayStatusImg();

                Player.Progress.onProgress();
                // console.log("Player.js-----isVip: " + RenderParam.isVip + ", userType: " + RenderParam.userType);
                // 检查免费时长 ，如果用户已经是vip，则不判断（isVip：1-是vip）
                if (RenderParam.isVip != 1) {
                    Player.Progress.checkFreeTime();
                }
            }, 1000);//1秒刷新一次
        }, 2500);
    },

    /** 在推荐、上下集切换等页面，需要暂停视频播放 */
    pauseVideoInPausePage: function () {
        if (isDetainPageShowing || isChangeVideoPageShowing) {
            LMEPG.mp.pause();
        }
    },

    /** 播放器在不同的状态（播放、暂停、快进、快退）时，更新底部蒙层图标 */
    updatePlayStatusImg: function () {
        switch (LMEPG.mp.getPlayerState()) {
            case LMEPG.mp.State.PLAY:
                CUCCPlayer.setPlayStatusImg(1);
                break;
            case LMEPG.mp.State.PAUSE:
                CUCCPlayer.setPlayStatusImg(2);
                break;
            case LMEPG.mp.State.FAST_REWIND:
                CUCCPlayer.setPlayStatusImg(4);
                break;
            case LMEPG.mp.State.FAST_FORWARD:
                CUCCPlayer.setPlayStatusImg(3);
                break;
        }
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
    show: function (isShowAllTime) {
        this.isProgressShow = true;
        S('bottom-navigation');// 进度条外圈UI
        if (!isShowAllTime)
            this.restart();
        else {
            if (this.autoHideProgressTimer) clearTimeout(this.autoHideProgressTimer);
        }

    },

    /** 隐藏进度条 */
    hide: function () {
        this.isProgressShow = false;
        H('bottom-navigation');//进度条外圈UI
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
                    Page.jumpBuyVip(RenderParam.videoInfo.title, RenderParam.videoInfo, 1);
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
        if (!isDetainPageShowing) {
            debug1('播放状态：' + LMEPG.mp.getPlayerState() + ', 倍速：' + LMEPG.mp.getSpeed() + ', 播放进度：' + curPlayTime + '/' + totalDuration + '(s)');
        }

        // 保存最后的播放进度
        RenderParam.videoInfo.lastedPlaySecond = curPlayTime;
        // 中国联通添加数据上报功能

        Network.savePlayerProgress(JSON.stringify(RenderParam.videoInfo));
        Network.saveVideoSetProgress(JSON.stringify(RenderParam.videoInfo));

        // 显示“当前时长:总时长”
        if (!this.videoDuration) this.videoDuration = totalDuration;
        G('total-time').innerHTML = LMEPG.Func.formatTimeInfo(1, this.videoDuration); //设置总时长
        var pTime = LMEPG.Func.formatTimeInfo(1, curPlayTime);//设置当前播放时间
        if (pTime === '0-1:0-1') return; //表示读时间进度有问题，不给予更新时间
        G('current-time').innerHTML = pTime;

        // 播放结束
        var rate = this.getPlayRate();       //当前播放的比例，取值0-1
        var progressLength = rate * this.progressWidth;//进度条的长度
        if (Player.isNeedListenProgressEnd()) {
            if (curPlayTime >= totalDuration && curPlayTime > 30) {
                //表示播放完成
                Player.playEnd();
                return;
            }
        }
        // 播放开始
        if (progressLength == 0) {
            Player.setVisibilityForSpeedUI(false);
            LMEPG.mp.setPlayerState(LMEPG.mp.State.PLAY);
            if (!isDetainPageShowing) // 如果播放器还未初始化完成，按返回，播放进度为0，这个底部条就一直显示
                Player.Progress.show();
        }
        /*if (progressLength == 0) {
            LMEPG.mp.resume();
        }*/

        // 防止当视频未加载完，用户按返回键已弹出挽留页，避免此时视频加载完回来继续播放，应当暂停播放
        if (isDetainPageShowing) {
            Player.Status.pause();
        }
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

    /** 返回上一页（延时） */
    jumpBackDelay: function (second) {
        setTimeout(function () {
            LMEPG.Intent.back();
        }, second * 1000);
    },

    /** 返回键 */
    onBack: function () {
        if (isDetainPageShowing) {  // 退出播放器页面
            LMEPG.Intent.back();
        } else if (isChangeVideoPageShowing) { // 隐藏上下集切换窗口
            Player.closeChangeVideoPage();
        } else {                    // 隐藏进度条
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
            Player.Progress.show(true);
            CUCCPlayer.setPlayStatusImg(4);
            switch (LMEPG.mp.getPlayerState()) {
                case LMEPG.mp.State.PLAY:
                    Player.setVisibilityForSpeedUI(true, C.Dir.LEFT);
                    break;
                case LMEPG.mp.State.PAUSE:
                    Player.Progress.beforeMoveIndicator(C.Dir.LEFT);
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
        if (isDetainPageShowing) {
            // 这里应用层不做处理，由按钮框架内部处理
        } else {
            Player.Progress.show(true);
            CUCCPlayer.setPlayStatusImg(3);
            switch (LMEPG.mp.getPlayerState()) {
                case LMEPG.mp.State.PLAY:
                    Player.setVisibilityForSpeedUI(true, C.Dir.RIGHT);
                    break;
                case LMEPG.mp.State.PAUSE:
                    Player.Progress.beforeMoveIndicator(C.Dir.RIGHT);
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

    /** “确定”按键 */
    onEnterKeyClicked: function () {
        if (isDetainPageShowing ||         // 挽留页按钮点击“确定”按钮
            isChangeVideoPageShowing ||    // 上下集切换窗口页面显示时，“确定”按钮的事件
            isBuyVipTipsPageShowing) {     // 提示购买vip蒙层页面的确定键

            var focusBtnObj = LMEPG.ButtonManager.getCurrentButton();
            ButtonAction.onClick(focusBtnObj);
        } else {                // 播放视频中点击“确定”按钮
            // 暂停的时候，底部UI一直显示，其他的情况就自动3s后消失
            if (LMEPG.mp.getPlayerState() === LMEPG.mp.State.PLAY) {
                Player.Progress.show(true);
            } else {
                Player.Progress.show();
            }
            LMEPG.Log.error("play.js ----LMEPG.mp.getPlayerState():" + LMEPG.mp.getPlayerState());
            switch (LMEPG.mp.getPlayerState()) {
                case LMEPG.mp.State.PLAY:
                    Player.Status.pause(); // 去暂停
                    break;
                case LMEPG.mp.State.PAUSE:
                    Player.Status.resume(); // 去播放
                    break;
                case LMEPG.mp.State.FAST_REWIND:
                    Player.Status.fastRewind(); // 去播放
                    break;
                case LMEPG.mp.State.FAST_FORWARD:
                    Player.Status.fastForward(); // 去播放
                    break;
            }
        }
    },

    /** “静音”按键 */
    onMuteKeyClicked: function () {
        var currentMuteFlag = LMEPG.mp.toggleMuteFlag();
        if (RenderParam.carrierId === "440094") {
            if (currentMuteFlag === LMEPG.mp.MuteFlag.OFF) {
                LMEPG.UI.showToast("静音:关");
            } else {
                LMEPG.UI.showToast("静音:开");
            }
        }
    },

    /** “虚拟”按键 */
    onVirtualKeyClicked: function () {
        try {
            var oEvent = Utility.getEvent();
            var keyCode = oEvent.type;
            debug2('PlayerKeyEventManager.onVirtualKeyClicked:' + JSON.stringify(oEvent));
            if (!LMEPG.mp.bind(oEvent)) {
                return;
            }
            debug2('PlayerKeyEventManager.onVirtualKeyClicked:' + keyCode);
            if (LMEPG.mp.isEnd(keyCode)) { //播放结束
                Player.playEnd();
            } else if (LMEPG.mp.isError(keyCode)) {// 播放错误
            } else if (LMEPG.mp.isBeginning(keyCode)) {
                Player.setVisibilityForSpeedUI(false);
            } else if (isDetainPageShowing) { // 修正当弹出推荐视频后，当视频数据缓冲结束会自动播放视频的问题
                LMEPG.mp.pause();
            }
        } catch (e) {
            debug2('onVirtualKeyClicked::error-->' + e.toString());
        }
    },

    /** “音量+/-”按键 */
    onVolumeChanged: function (dir) {
        if (dir === C.Dir.UP) {                  // 音量+
            LMEPG.UI.showToast("音量+");
            var currentVolume = LMEPG.mp.upVolume();
            if (RenderParam.carrierId === "440094") {
                LMEPG.UI.showToast("音量:" + currentVolume);
            }
        } else if (dir === C.Dir.DOWN) {         // 音量-
            LMEPG.UI.showToast("音量-");
            var currentVolume = LMEPG.mp.downVolume();
            if (RenderParam.carrierId === "440094") {
                LMEPG.UI.showToast("音量:" + currentVolume);
            }
        }
    },

    /** “快进/快退”按键。dir：left|right */
    onSpeedChanged: function (dir) {
        // 如果播放器正在播放，快进或快退过程会一直持续。如果播放器暂停状态，快进或快退时，一段时间后就正常播放了，
        // 所以暂停状态快进或快退时，先让播放器正常播放，这样流程才正常
        if (dir === C.Dir.RIGHT || dir === C.Dir.LEFT) {
            switch (LMEPG.mp.getPlayerState()) {
                case LMEPG.mp.State.PAUSE:
                    Player.Status.resume(); // 去播放
                    break;
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        if (dir === C.Dir.RIGHT) {            // 快进
            Player.Progress.show(true);
            this.onKeyRight();
        } else if (dir === C.Dir.LEFT) {     // 快退
            Player.Progress.show(true);
            this.onKeyLeft();
        }
    },

    /** “上/下/左/右”按键。dir必为之一：up/down/left/right */
    onDirectionKeyMoved: function (dir) {
        if (isDetainPageShowing) {  // 暂停状态：弹出挽留页。使用框架内部统一处理挽留页按钮移动焦点行为。
            LMEPG.ButtonManager._onMoveChange(dir);
        } else if (isChangeVideoPageShowing && (dir == C.Dir.LEFT || dir == C.Dir.RIGHT)) {
            LMEPG.ButtonManager._onMoveChange(dir); // 显示上下集切换窗口时，左右方向 使用框架内部统一处理按钮移动焦点行为
        } else if (isChangeVideoPageShowing && dir == C.Dir.DOWN) {
            Player.closeChangeVideoPage(); // 显示上下集切换窗口时，下方向，关闭窗口
        }
        else if (isBuyVipTipsPageShowing) { // 在提示购买vip蒙层页面，焦点行为自行控制
            LMEPG.ButtonManager._onMoveChange(dir);
        }
        else {                // 播放状态：非挽留页。根据需要自定义行为。
            switch (dir) {
                case C.Dir.UP:
                    // 如果底部UI是显示的，按上按键弹出上下集切换窗口
                    if (Player.Progress.isProgressShow) {
                        S('center-navigation');
                        H('bottom-navigation');
                        isChangeVideoPageShowing = true;
                        Player.Status.pause();
                        LMEPG.BM.requestFocus('continue-play');
                    }
                    // 否则显示底部的进度条
                    else {
                        Player.Progress.show();
                    }
                    break;
                case C.Dir.DOWN:
                    // 如果底部UI是显示的，按上下按键弹出上下集切换窗口
                    if (Player.Progress.isProgressShow) {
                        S('center-navigation');
                        H('bottom-navigation');
                        isChangeVideoPageShowing = true;
                        Player.Status.pause();
                        LMEPG.BM.requestFocus('continue-play');
                    }
                    // 如果目前是上下集切换窗口，则关闭
                    else if (isChangeVideoPageShowing) {
                        Player.closeChangeVideoPage();
                    }
                    // 否则显示底部的进度条
                    else {
                        Player.Progress.show();
                    }
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
        if (G('playText').innerHTML == '继续播放') {
            Player.Progress.hide(); //隐藏进度条
            Player.Status.togglePlayerState();
        } else {
            // 重播时，把历史播放进度置0
            RenderParam.videoInfo.lastedPlaySecond = 0;
            // Network.savePlayerProgress(JSON.stringify(RenderParam.videoInfo), function () {
            //     window.location.reload();
            // });

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
        if (btnId.startWith('focus-')) {
            //得到播放地址
            var videoInfo = {
                'sourceId': G(btnId).getAttribute('sourceId'),
                'videoUrl': G(btnId).getAttribute(isHD() ? 'gqPlayUrl' : 'bqPlayUrl'),
                'title': G(btnId).getAttribute('title'),
                'type': '',
                'userType': G(btnId).getAttribute('user_type'),
                'freeSeconds': G(btnId).getAttribute('freeSeconds'),
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
            if (Player.allowPlayVideo(videoInfo)) {
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
                // KEY_UP: 'PlayerKeyEventManager.onDirectionKeyMoved("' + C.Dir.UP + '")',    // 上键
                // KEY_DOWN: 'PlayerKeyEventManager.onDirectionKeyMoved("' + C.Dir.DOWN + '")',  // 下键
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
            // 挽留页1-3推荐位
            case 'focus-0':
            case 'focus-1':
            case 'focus-2':
                //线下视频处理
                if (btn.dataObj.show_status == '3') {
                    LMEPG.UI.showToast('该节目已下线');
                    break;
                }
                PlayerKeyEventManager.playVideo(btn);
                break;

            // 挽留页底部按钮：重播/继续播放、收藏/取消收藏、退出
            case 'replay':
                PlayerKeyEventManager.resumeOrReplay(btn);
                break;
            case 'collect':
                var expectedStatus = RenderParam.collectStatus == 1 ? 0 : 1;  //改变收藏状态
                Player.Status.setCollectStatus(RenderParam.sourceId, expectedStatus);
                break;
            case 'back':
                PlayerKeyEventManager.jumpBack();
                break;
            // 上一集
            case 'prev-video-item':
                Player.prevVideo();
                break;
            // 继续播放
            case 'continue-play':
                Player.closeChangeVideoPage();
                break;
            // 下一集
            case 'next-video-item':
                Player.nextVideo();
                break;

            // 按确定键去购买vip
            case 'tip-press-sure-pay':
                Page.jumpBuyVip(RenderParam.videoInfo.title, RenderParam.videoInfo, 1);
                break;

            // dialog弹框的按键相应
            case 'modal-sure':
            case 'modal-cancel':
            case 'dialog_ask_doc_tv_video':
            case 'dialog_ask_doc_tv_phone':
            case 'dialog_ask_doc_wechat_teletext':
            case 'dialog_ask_doc_wechat_video':
                LMEPG.ButtonManager._onClick();
                break;
        }
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

// 页面加载完成
window.onload = function () {
    debug2('《当前页面已加载完成。》');
    debug1();
    G('default_link').focus();  // 防止页面丢失焦点

    CUCCPlayer.init(); // 相关业务逻辑初始化
    // Player.initJSPrams(); // 初始化或者转换必要的JS参数！
    Player.initSpeedUI(); // 初始化“倍速”相关控件
    Player.setVisibilityForDetainPageUI(false); // 隐藏更多显示，防止已进入就显示

    PlayerKeyEventManager.registerSpecialKeys(); // 覆写某些特殊按键事件处理

    Player.initPlayerWithIframe(); // 初始化播放器
    Player.Progress.start(); // 启动进度条显示
    Player.setVisibilityForBuyVipTipsPageUI(); // 隐藏或显示提示购买vip蒙层
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
    var errorLog = '[V21][Player.js]::error --->' + '\nmessage:' + message + '\nfile_name:' + filename + '\nline_NO:' + lineno;
    debug2('window.onerror:' + errorLog);
    if (debug_mode) LMEPG.UI.showToast(errorLog, 10);
    LMEPG.Log.error(errorLog);
};

// 兼容使用
(function addCompatIssues() {
    // 中国联通-湖南省（播控：当前js模式会找不到window.onKeyDown，查找但暂未发现调用之处（暂不知调用者何处），先临时处理！）
    if (get_carrier_id() === "000051" && get_area_code() === "231") {
        if (typeof window.onKeyDown !== "function") {
            console.debug("[000051-231] - 定义onKeyDown");
            window.onKeyDown = function () {
                debug2("[000051-231] - 定义onKeyDown调用：" + JSON.stringify(arguments));
            }
        }
    }
})();