// 定义全局按钮
var UN_COLLECT_CODE = 1;     //取消收藏操作
var COLLECT_CODE = 0;        //收藏操作
var buttons = [];
var isOnBack = false;

// 返回按键
function onBack() {
    Page.onBack();
}

function HideRecommendPage() {
    H('content');
}

function ShowRecommendPage() {
    S('content');

    // 注：若某些地区挽留页推荐视频标题已经是在图上了，则不用单独显示，请在些追加地区平台。请勿直接修改css中为隐藏，默认要显示！！！
    var hideRecommendCarriers = ['450004','000609','640001'];
    if (hideRecommendCarriers.indexOf(RenderParam.carrierId) > -1) {
        if (is_array(Player.recommendVideoList) && Player.recommendVideoList.length > 0) {
            for (var i = 1; i <= Player.recommendVideoList.length; i++) {
                H("recommended_" + i + "_title");
            }
        }
    }
}

var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        return LMEPG.Intent.createIntent("player");
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast("视频信息为空！");
            return;
        }

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));
        if(Player.isAssignColumnVideo){
            objPlayer.setParam("modelType", RenderParam.modelType);
        }

        LMEPG.Intent.jump(objPlayer, null);
    },

    /**
     * 跳转 -- 订购页
     * @param remark        订购来源（标示）
     * @param videoInfo     如果视频正在播放，播放视频的信息。
     * @param singlePayItem 是否是单订购
     */
    jumpBuyVip: function (remark, videoInfo, singlePayItem) {
        if (typeof (videoInfo) !== "undefined" && videoInfo !== "") {
            var postData = {
                "videoInfo": JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
            });
        }

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("remark", remark);
        objOrderHome.setParam("isPlaying", 1);
        objOrderHome.setParam("inner", RenderParam.inner);
        objOrderHome.setParam("singlePayItem", typeof (singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, null);
    },

    /**
     * 返回事件
     */
    onBack: function () {
        if (isOnBack) {
            return;
        }
        isOnBack = true;
        if (RenderParam.carrierId === "370002") {
            var operateParams = {
                "action": 2,
                "contentId": RenderParam.videoInfo.sourceId
            };
            LMEPG.ajax.postAPI("System/clickContentInfo", operateParams, function () {
                LMEPG.Intent.back();
            }, function () {
                LMEPG.Intent.back();
            });
        }
        // isExist -- 是否直接退出应用（局方统一搜索跳转视频播放页面时添加）
        var isExist = RenderParam.carrierId === "640001" || RenderParam.carrierId === "620007"
        || RenderParam.carrierId === '450001';
        if (isExist && RenderParam.inner == "0"){
            // 外部统一搜索模块进入的页面，返回搜索模块页面
            LMAndroid.JSCallAndroid.doExitApp();
        }else {
            LMEPG.Intent.back();
        }
    },

    /**
     * 延时返回事件
     */
    onBackDelay: function () {
        setTimeout(function () {
            Page.onBack();
        }, 3 * 1000)
    },

    //海看坑位统计
    haiKanHoleStat: function(expectedStatus) {
        var turnPageInfo = {
            VODCODE: "39_" + RenderParam.videoInfo.videoUrl,
            VODNAME: RenderParam.videoInfo.title,
            mediastatus: expectedStatus,
            reserve1: null,
            reserve2 : null,
            from:"jz3.0"
        };
        ShanDongHaiKan.sendReportData('8', turnPageInfo);
    }
};

var Player = {
    videoInfo: {},               //视频信息
    recommendVideoList: "",               //推荐视频列表
    isReplay: true,                        //重新播放按钮是重播还是续播的标识
    currentPlayIndex: 0,                  //播放进度
    titleAssetId: "GDZX9920180815001203",                       //视频媒资id
    currentPosition: 0,                   //当前进度,单位秒
    token: 0,
    showPlayingInfo: false,		// 是否显示实时播放信息:false->不显示；true->显示;default->false
    playerType: 0,			        // 播放器类型:0->rawplayer；1->ijkplayer;default->0
    playerDecoderType: 0,	// 播放器解码类型：0->硬解码；1->软解码；default-0
    isAssignColumnVideo: 0, // 是否指定栏目下的视频

    startTime: '', // 当前视频开始播放的时间戳，宁夏移动增管平台（易视腾）对接观影记录接口时需要使用

    collectBtnBg: {                        //收藏按钮背景图
        backgroundImage: "",
        focusImage: "",
    },

    ReplayBtnBg: {                         //重新播放背景图
        backgroundImage: "",
        focusImage: "",
    },

    init: function () {
        RenderParam.isCollected = Math.abs(parseInt(RenderParam.collectStatus) - 1) + '';
        Player.initData();                                     //初始化数据
        Player.initView();                                     //初始化界面
        Player.initButtons();                                 // 初始化焦点按钮
        LMEPG.ButtonManager.init("btn_replay", buttons, "", true);
    },

    /**
     * 初始化参数
     */
    initData: function () {
        if (Player.initPlayVideoInfo(RenderParam.videoInfo.videoUrl)) {
            Player.initRecommendVideoData();
            Player.initCollectBtnBg();
        }
    },

    /**
     * 初始化将要播放的视频信息
     */
    initPlayVideoInfo: function (videoUrl) {
        if (LMEPG.Func.isEmpty(videoUrl)) {
            LMEPG.UI.showToast("视频播放地址为空");
            return false;
        }
        LMEPG.Log.info("initPlayVideoInfo::RenderParam.carrierId = " + RenderParam.carrierId + ", RenderParam.stbModel = " + RenderParam.stbModel);
        var encodeParam = decodeParam.queryDecodeParam(RenderParam.carrierId, RenderParam.stbModel);
        var jurisdiction = false; // 观看权限判断
        if (RenderParam.isVip === 1 || RenderParam.videoInfo.userType != '2') { // 判断用户观看权限
            jurisdiction = true;
        }
        /* 构建播放器参数 */
        var playVideoInfo = {
            userType: !LMEPG.Func.isEmpty(RenderParam.videoInfo.userType) ? RenderParam.videoInfo.userType : "",
            freeTime: !LMEPG.Func.isEmpty(RenderParam.videoInfo.freeSeconds) ? RenderParam.videoInfo.freeSeconds : "",
            playUrl: !LMEPG.Func.isEmpty(RenderParam.videoInfo.videoUrl) ? RenderParam.videoInfo.videoUrl : "",
            videoId: !LMEPG.Func.isEmpty(RenderParam.videoInfo.sourceId) ? RenderParam.videoInfo.sourceId : "",
            modelType: !LMEPG.Func.isEmpty(RenderParam.videoInfo.type) ? RenderParam.videoInfo.type : "",
            entryType: !LMEPG.Func.isEmpty(RenderParam.videoInfo.entryType) ? RenderParam.videoInfo.entryType : "",
            videoTitle: !LMEPG.Func.isEmpty(RenderParam.videoInfo.title) ? RenderParam.videoInfo.title : "",
            unionCode: !LMEPG.Func.isEmpty(RenderParam.videoInfo.unionCode) ? RenderParam.videoInfo.unionCode : "",
            currentPlayIndex: !LMEPG.Func.isEmpty(RenderParam.videoInfo.currentPlayIndex) ? RenderParam.videoInfo.currentPlayIndex : 0, // 上次播放时移
            isUseLMPlayerFromThird: false, //控制APK是否在拥有第三方播放器情况下仍可强制性选择性切换为使用LongMaster(我方)自定义播放器播放（切换需要重启应用方可生效）（默认false不切换！例如：青海移动）。
            playerSDKType: PlayThirdParty.TVPlayerSDKType.SDK_lmIjk, //控制APK端选择播放器类型（101或其它未支持：LongMaster(我方)自定义自定义Ijk播放器，102-IcntvPlayer（未来TV）集成播放器）
            showPlayingInfo: encodeParam.showPlayingInfo, // 是否显示实时播放信息:false->不显示；true->显示;default->false
            playerType: encodeParam.playerType, // 全屏播放器类型:0->rawplayer；1->ijkplayer;default->0
            playerDecoderType: encodeParam.playerDecoderType, // 全屏播放器解码类型：0->硬解码；1->软解码；default-0
            jurisdiction: jurisdiction, // 判断使用是否有观看权限
            lowerBuffer: encodeParam.lowerBuffer ? encodeParam.lowerBuffer : 0, // 是否打开秒开机制，1->打开，0->关闭
        };

        // 注册播放回调
        LMAndroid.registPlayUICallback(Player.onFullPlayerStartCallbackUI /* 播放开始回调 */
            , Player.notifyFullPlayerPauseCallback /* 播放暂停回调 */
            , Player.onFullPlayerResumeCallback /* 播放暂停回复播放回调 */
            , Player.onFullPlayerCompleteCallback /* 播放结束播放回调 */
            , Player.onFullPlayerSeekCallback /* 播放时移（快进快退）播放回调 */);

        Player.videoInfo = playVideoInfo; // 保存信息，方便后期恢复播放
        Player.playWithCarrier();
        Player.savePlayerProgress(JSON.stringify(RenderParam.videoInfo));
        return true;
    },

    /**
     * 获取播放地址
     */
    playWithCarrier: function(){
        switch (RenderParam.carrierId) {
            case '620007': // 甘肃移动
                Player.playVideo620007();
                break;
            case '450004': // 广西广电
                Player.playVideo450004();
                break;
            case '640001': // 宁夏移动
            case '630001': // 青海移动
            case '540001': // 西藏移动
            case '450001': // 广西移动
            case '01230001': // 黑龙江移动
                Player.playVideo630001();
                break;
            case '370002': // 山东电信
                Player.playVideo370002();
                break;
            case '371002': // 山东电信海看apk
                Player.playVideo371002();
                break;
            default:
                Player.playVideo();
                break;
        }
    },

    //广西广电视频播放地址获取
    playVideo450004: function () {
        var reqParam = {
            "serviceType": "ipqam",
            "cpId": "GDYZHYL",
            "videoType": "0",
            "videoIndex": "0",
            "cdnFlag": "gxcatv_playurl",
            "cpVideoId": RenderParam.videoInfo.videoUrl,
            "userAgent": "nn_player",
            "playStyle": "http",
            "isHttp": true
        };

        LMEPG.Log.info("web::doAuthAndGetMedia=start:::" + JSON.stringify(reqParam));
        LMAndroid.JSCallAndroid.doAuthAndGetMedia(JSON.stringify(reqParam), function (resParam, notifyAndroidCallback) {
            LMEPG.Log.info("web::doAuthAndGetMedia=" + resParam);
            var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
            LMEPG.Log.info("web::info=" + resParamObj.info);
            if (resParamObj.result == "0") {
                if (resParamObj.state == "0") {
                    var retUrl = resParamObj.url.replace(/\//g, "/");
                    Player.videoInfo.playUrl = retUrl;
                    Player.playVideo();
                } else {
                    LMEPG.Log.info("web::获取地址失败=" + resParamObj.info);
                    LMEPG.UI.showToast("获取地址失败:" + resParamObj.info);
                }
            } else {
                LMEPG.UI.showToast("获取视频地址异常:" + resParamObj.errorInfo);
            }
        });
    },

    playVideo370002: function(){
        // 调用探针接口上报数据 1:进入 0：退出
        var operateParams = {
            "action": 1,
            "contentId": RenderParam.videoInfo.sourceId
        };
        LMEPG.ajax.postAPI("System/clickContentInfo", operateParams, function () {}, function () {});
        Player.isAssignColumnVideo = RenderParam.modelType != "0";
        if (Player.isAssignColumnVideo){
            Player.videoInfo.jurisdiction = true;
        }
        var postData = {
            "program_id" : RenderParam.videoInfo.videoUrl,
        }
        LMEPG.ajax.postAPI("Video/getPlayUrl", postData, function (data) {
            LMEPG.Log.info("getVideoUrlWith370002 getPlayUrl result:" + JSON.stringify(data));
            if(data && data.result == 0) {
                Player.videoInfo.playUrl = data.playUrl;
                Player.playVideo();
            } else {
                LMEPG.UI.showToast("获取小窗播放地址失败!");
            }
        });
    },

    //山东电信海看视频播放地址获取
    playVideo371002: function () {
        if (LMEPG.Func.isEmpty(RenderParam.videoInfo.videoUrl)) {
            Player.showError("视频id为空，无法鉴权视频");
            return;
        }
        var _type = RenderParam.videoInfo.type != undefined ? RenderParam.videoInfo.type : 0;
        var turnPageInfo = {
            currentPage: location.href,
            turnPage:location.href,
            turnPageName: document.title,
            turnPageId:"39_" + RenderParam.videoInfo.videoUrl,
            clickId:RenderParam.clickId,
            reserve1:"39_" + _type,
            reserve2:null
        };
        ShanDongHaiKan.sendReportData('6', turnPageInfo);

        var postData = {
            "program_id" : RenderParam.videoInfo.videoUrl
        };
        LMEPG.ajax.postAPI("Video/getPlayUrl", postData, function (data) {
            LMEPG.Log.info("initVideoRealUrl371092 getPlayUrl result:" + JSON.stringify(data));
            if(data && data.result == 0) {
                Player.videoInfo.playUrl = data.playUrl;
                Player.playVideo();
            } else {
                LMEPG.UI.showToast("获取小窗播放地址失败!");
            }
        });
    },

    /**
     * 甘肃移动百视通-拼接真正的地址
     */
    playVideo620007: function () {
        var isHttpUrl = (RenderParam.videoInfo.videoUrl.indexOf('http') === 0);
        if (isHttpUrl) {
            Player.videoInfo.playUrl = RenderParam.videoInfo.videoUrl;
        } else {
            if(RenderParam.videoInfo.videoUrl.length<9){
                // 当接收到panda返回的播放ID后需自行拼接播放地址，拼接方式：
                // http://gslbserv.itv.cmvideo.cn/270000000127/{播放ID}/index.m3u8?channel-id=bstvod&Contentid={播放ID}&stbId={终端STBID}
                var realPlayUrl = "http://gslbserv.itv.cmvideo.cn/270000000127/" + RenderParam.videoInfo.videoUrl+"/index.m3u8?channel-id=bstvod&Contentid="+RenderParam.videoInfo.videoUrl;
            }else{
                var realPlayUrl = "http://gslbserv.itv.cmvideo.cn/index.m3u8?channel-id=bstvod&Contentid=" + RenderParam.videoInfo.videoUrl;
            }
            RenderParam.stbid = LMEPG.Func.isEmpty(RenderParam.stbid)?"275803FF004735900000D4C1C8AB9086":RenderParam.stbid;
            realPlayUrl = realPlayUrl + "&stbId=" + RenderParam.stbid;
            //甘肃移动使用的IJK播放器，指定IJK播放器的实现方式，兼容Android 9.0
            Player.videoInfo.ijkType = PlayThirdParty.IjkPlayerType.TYPE_ADD_VIEW;
            Player.videoInfo.playUrl = realPlayUrl;
        }
        Player.playVideo();
    },

    /**
     * 青海移动-拼接真正的地址
     */
    playVideo630001: function () {
        if(RenderParam.carrierId !== '540001' || RenderParam.areaCode === 'newtv') {
            Player.videoInfo.playerSDKType = PlayThirdParty.TVPlayerSDKType.SDK_weilaiTV; //使用：102-IcntvPlayer（未来TV）集成播放器
        }
        var videoArr = RenderParam.videoInfo.videoUrl.split(";"); //e.g. "gylm314.ts;1028000712;hv_14791_630001"
        if (videoArr.length < 2) {
            // 配置的视频格式有误
            Player.showError("视频ID格式错误！ID=" + RenderParam.videoInfo.videoUrl);
            return;
        }

        var videoFileName = videoArr[0];
        var videoId = videoArr[1];
        var realPlayUrl = "http://gslbserv.itv.cmvideo.cn/"
            + videoFileName
            + "?channel-id=langmasp"
            + "&Contentid=" + videoId
            + "&authCode=3a&stbId=005803FF00158930000050016B8A742C&usergroup=g28093100000&userToken=bc646872b5f7b79a5574a1e19b6c0e6a28vv";
        LMEPG.Log.info("Player.js ---> initVideoRealUrl630001 realPlayUrl:" + realPlayUrl);

        // 用于Android端IcntvPlayerSDK播放，必须！！！
        var newTVPlayProgramId = videoArr.length > 2 ? videoArr[2] : "";
        if (LMEPG.Func.isEmpty(newTVPlayProgramId)) { //兼容未配置第3个参数情况："gylm314.ts;1028000712"
            newTVPlayProgramId = PlayThirdParty.WeilaiTV.getProgramId(Player.videoInfo.videoId, RenderParam.carrierId);
        }

        Player.videoInfo.playUrl = realPlayUrl;
        // 必须传递！约定规则：“videoName.ts;programId”(TODO 测试阶段使用(appId: 598d5096c4851, programId:1234567890))
        Player.videoInfo.srcVideoUrl = videoFileName + ";" + newTVPlayProgramId;
        Player.syncPlayerStatus(1);
        Player.playVideo();
    },

    /**
     * 根据收藏信息，判断显示收藏背景还是取消收藏背景
     */
    initCollectBtnBg: function () {
        if (RenderParam.isCollected === "1") {
            //该视频已经收藏了
            Player.collectBtnBg.backgroundImage = ROOT + "/Public/img/hd/Player/V23/play_collected_out.png";
            Player.collectBtnBg.focusImage = ROOT + "/Public/img/hd/Player/V23/play_collected_in.png";
        } else {
            //该视频还没有收藏
            Player.collectBtnBg.backgroundImage = ROOT + "/Public/img/hd/Player/V23/play_collect_out.png";
            Player.collectBtnBg.focusImage = ROOT + "/Public/img/hd/Player/V23/play_collect_in.png";
        }
    },

    /**
     * 初始化重播按钮，可能显示继续播放
     */
    initReplayBtnBg: function (isReplay) {
        Player.isReplay = isReplay;
        if (Player.isReplay) {
            //重新播放
            Player.ReplayBtnBg.backgroundImage = ROOT + '/Public/img/hd/Player/V23/play_replay_out.png';
            Player.ReplayBtnBg.focusImage = ROOT + '/Public/img/hd/Player/V23/play_replay_in.png';
        } else {
            //继续播放
            Player.ReplayBtnBg.backgroundImage = ROOT + '/Public/img/hd/Player/V23/play_continue_out.png';
            Player.ReplayBtnBg.focusImage = ROOT + '/Public/img/hd/Player/V23/play_continue_in.png';
        }
        G("btn_replay").src = Player.ReplayBtnBg.backgroundImage;
    },

    /**
     * 初始化推荐视频信息
     */
    initRecommendVideoData: function () {
        var  postData = {
            "userId": RenderParam.userId
        };
        if(RenderParam.carrierId === '370002'){
            var modelType = LMEPG.Func.getLocationString('modelType');
            postData = {
                "userId": RenderParam.userId,
                "modelType":modelType
            };
        }
        LMEPG.ajax.postAPI('Player/getRecommendVideoInfo', postData, function (rsp) {
            // 请求成功
            try {
                var recommendData = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (LMEPG.Func.isExist(recommendData)) {
                    if (LMEPG.Func.isExist(recommendData.data) && recommendData.data.length > 0) {
                        Player.recommendVideoList = recommendData.data;
                        for (var i = 0; (i < Player.recommendVideoList.length && i < 3); i++) {
                            var data = Player.recommendVideoList[i];
                            Show("recommended_" + (i + 1));
                            G("recommend_" + (i + 1) + "_bg").src = RenderParam.fsUrl + data.image_url;
                            G("recommended_" + (i + 1) + "_title").innerHTML = data.title;
                            var iconId = "recommend_" + (i + 1) + "_vip_icon";
                            if(data.userType == '2' || RenderParam.isVip == '0') {
                                Show(iconId);
                            } else {
                                Hide(iconId);
                            }
                        }
                    } else {
                        console.error("没有可以推荐的视频");
                    }
                } else {
                    console.error("推荐视频不存在");
                }
            } catch (e) {
                console.error("推荐视频数据处理异常：" + e.toString());
            }
        }, function (rsp) {
            // 请求出错
        });
    },

    /**
     * 初始化按钮
     */
    initButtons: function () {
        buttons.push({
            id: 'recommended_1',
            name: '推荐视频1',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommended_2',
            nextFocusUp: '',
            nextFocusDown: 'btn_replay',
            backgroundImage: '',
            focusImage: '',
            click: Player.onClickRecommendPosition,
            focusChange: Player.recommendedFocus,
            beforeMoveChange: "",
            cPosition: 0
        });
        buttons.push({
            id: 'recommended_2',
            name: '推荐视频2',
            type: 'img',
            nextFocusLeft: 'recommended_1',
            nextFocusRight: 'recommended_3',
            nextFocusUp: '',
            nextFocusDown: 'btn_collect',
            backgroundImage: '',
            focusImage: '',
            click: Player.onClickRecommendPosition,
            focusChange: Player.recommendedFocus,
            beforeMoveChange: "",
            cPosition: 1
        });
        buttons.push({
            id: 'recommended_3',
            name: '推荐视频3',
            type: 'img',
            nextFocusLeft: 'recommended_2',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'btn_back',
            backgroundImage: '',
            focusImage: '',
            click: Player.onClickRecommendPosition,
            focusChange: Player.recommendedFocus,
            beforeMoveChange: "",
            cPosition: 2
        });
        buttons.push({
            id: 'btn_replay',
            name: '重播按钮',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'btn_collect',
            nextFocusUp: 'recommended_1',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: Player.continuePlay,
            focusChange: Player.recommendedFocus,
            beforeMoveChange: "",
        });
        buttons.push({
            id: 'btn_collect',
            name: '搜藏按钮',
            type: 'img',
            nextFocusLeft: 'btn_replay',
            nextFocusRight: 'btn_back',
            nextFocusUp: 'recommended_2',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: Player.setCollectStatus,
            focusChange: Player.recommendedFocus,
            beforeMoveChange: "",
        });
        buttons.push({
            id: 'btn_back',
            name: '退出按钮',
            type: 'img',
            nextFocusLeft: 'btn_collect',
            nextFocusRight: '',
            nextFocusUp: 'recommended_3',
            nextFocusDown: '',
            backgroundImage: ROOT + '/Public/img/hd/Player/V23/play_back_out.png',
            focusImage: ROOT + '/Public/img/hd/Player/V23/play_back_in.png',
            click: Page.onBack,
            focusChange: '',
            beforeMoveChange: "",
        });
    },

    /**
     * 初始化界面
     */
    initView: function () {
        G("btn_collect").src = Player.collectBtnBg.backgroundImage;
    },

    // 推荐位点击
    onClickRecommendPosition: function (btn) {
        if (LMEPG.Func.isExist(Player.recommendVideoList)) {
            var index = btn.cPosition;
            if (index < Player.recommendVideoList.length) {
                var data = Player.recommendVideoList[index];

                // 视频播放
                var videoUrl = "";
                try {
                    var videoObj = data.ftp_url instanceof Object ? data.ftp_url : JSON.parse(data.ftp_url);
                    videoUrl = RenderParam.platformType === "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
                } catch (e) {
                    console.warn(JSON.stringify(data), e);
                }
                if (LMEPG.Func.isEmpty(videoUrl)) {
                    console.error("无效的播放url");
                    switch (RenderParam.carrierId) {
                        case CARRIER_ID_NINGXIAYD://宁夏移动：若后台未配置有效视频或者被未来电视（第三方内容审核）下线后，暂统一提示为“下线”
                        case CARRIER_ID_QINGHAIYD://青海移动：若后台未配置有效视频或者被未来电视（第三方内容审核）下线后，暂统一提示为“下线”
                        case CARRIER_ID_GUANGXIYD://广西移动：若后台未配置有效视频或者被未来电视（第三方内容审核）下线后，暂统一提示为“下线”
                            LMEPG.UI.showToast("该节目已下线");//注：集成未来电视播控要求鉴权失败统一提示“该节目已下线”
                            break;
                        default:
                            LMEPG.UI.showAndroidToast("无效的视频地址！");
                            break;
                    }
                    return;
                }

                // 创建视频信息
                var videoInfo = {
                    "sourceId": data.source_id,
                    "videoUrl": videoUrl,
                    "title": data.title,
                    "type": data.model_type,
                    "userType": data.user_type,
                    "freeSeconds": data.free_seconds,
                    "entryType": 7,
                    "entryTypeName": "片尾推荐",
                    "unionCode": data.union_code
                };
                if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo) || Player.isAssignColumnVideo) {
                    Page.jumpPlayVideo(videoInfo);
                } else {
                    Page.jumpBuyVip(videoInfo.title, videoInfo);
                }
            }
        }
    },

    /**
     * 播放视频
     */
    playVideo: function () {
        HideRecommendPage();
        //设置播放进度
        Player.videoInfo.currentPlayIndex = Player.currentPlayIndex;
        //使用的IJK播放器，指定IJK播放器的实现方式，兼容Android 9.0
        Player.videoInfo.ijkType = PlayThirdParty.IjkPlayerType.TYPE_ADD_VIEW;
        var videoInfoJsonString = JSON.stringify(Player.videoInfo);
        console.log("player videoInfoJsonString:" + videoInfoJsonString);
        LMEPG.Log.info("player videoInfoJsonString:" + videoInfoJsonString);
        // 记录当前播放时长
        Player.startTime = new Date().format("yyyy-MM-dd hh:mm:ss");

        LMAndroid.JSCallAndroid.doPlayVideo(videoInfoJsonString, null);
    },

    /**
     * 继续播放
     */
    continuePlay: function () {
        Player.playVideo();
    },

    // 推荐视频焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            if (btn.id == "btn_collect") {
                G(btn.id).src = Player.collectBtnBg.focusImage;
            } else if (btn.id == "btn_replay") {
                G(btn.id).src = Player.ReplayBtnBg.focusImage;
            } else {
                LMEPG.CssManager.addClass(btn.id, "recommended_hover");
                LMEPG.UI.Marquee.start(btn.id + "_title", 13, 5, 50, "left", "scroll");
            }
        } else {
            if (btn.id == "btn_collect") {
                G(btn.id).src = Player.collectBtnBg.backgroundImage;
            } else if (btn.id == "btn_replay") {
                G(btn.id).src = Player.ReplayBtnBg.backgroundImage;
            } else {
                LMEPG.UI.Marquee.stop();
                LMEPG.CssManager.removeClass(btn.id , "recommended_hover");
            }
        }
    },

    /**
     * 播放开始回调
     */
    onFullPlayerStartCallbackUI: function (param, notifyAndroidCallback) {
        console.log("onFullPlayerStartCallback1111,param:" + param);
    },

    /**
     * 播放暂停回调
     */
    notifyFullPlayerPauseCallback: function (param, notifyAndroidCallback) {
        console.log("onFullPlayerPauseCallback1111,param:" + param);
    },

    /**
     * 继续播放回调
     */
    onFullPlayerResumeCallback: function (param, notifyAndroidCallback) {
        console.log("onFullPlayerResumeCallback1111,param:" + param);
    },

    /**
     * 播放seekto回调
     */
    onFullPlayerSeekCallback: function (param, notifyAndroidCallback) {
        console.log("onFullPlayerSeekCallback,param:" + param);
    },

    /**
     * 播放完成回调
     */
    onFullPlayerCompleteCallback: function (param, notifyAndroidCallback) {
        console.log("onFullPlayerCompleteCallback,param:" + param);

        LMAndroid.JSCallAndroid.doHideVideo("", null);
        var paramJson = JSON.parse(param);
        LMEPG.Log.info("890890152152:"+JSON.stringify(paramJson) )
        if (LMEPG.Func.isExist(paramJson) && !LMEPG.Func.isEmpty(paramJson.resean)) {
            var reason = paramJson.resean;
            // LMAndroid.JSCallAndroid.doShowToast("reason：" + reason);
            switch (reason) {
                case PlayConstans.videoFinish.VIDEO_FINISH_REASON_ERROR_OTHERS:
                    LMEPG.Log.error("onFullPlayerCompleteCallback-error:" + paramJson.errorDetail);
                    Player.showError(LMEPG.Func.isEmpty(paramJson.errorMsg) ? "启动播放器出错" : paramJson.errorMsg);
                    break;
                case PlayConstans.videoFinish.VIDEO_FINISH_REASON_ERROR:
                    Player.showError("播放出错");
                    break;
                case PlayConstans.videoFinish.VIDEO_FINISH_REASON_BAD_NET:
                    Player.showError("网络不通");
                    break;
                case PlayConstans.videoFinish.VIDEO_FINISH_REASON_AUDIT_FAILED:
                    Player.showError("该节目已下线"); //注：集成未来电视播控要求鉴权失败统一提示“该节目已下线”
                    break;
                case PlayConstans.videoFinish.VIDEO_FINISH_REASON_TIME_OUT:
                    Player.showError("播放超时，请稍后重试");
                    break;
                case PlayConstans.videoFinish.VIDEO_FINISH_REASON_USER_RETURN:
                    console.log("网页接收到视频播放用户返回结束消息");
                    Player.currentPlayIndex = paramJson.position;      //保存播放进度
                    RenderParam.videoInfo.currentPlayIndex = Player.currentPlayIndex;

                    // 保存视频播放进度
                    Player.syncPlayerStatus(0);
                    Player.reportVideoRecord();
                    Player.savePlayerProgress(JSON.stringify(RenderParam.videoInfo));
                    Player.saveVideoSetProgress(JSON.stringify(RenderParam.videoInfo));

                    Player.logToWeilaiTV({duration: paramJson.duration, location: paramJson.position});//上报点播日志给未来
                    Player.initReplayBtnBg(false);
                    //S("content");
                    ShowRecommendPage();
                    LMEPG.ButtonManager.requestFocus("btn_replay");
                    break;
                case PlayConstans.videoFinish.VIDEO_FINISH_REASON_PLAY_COMPLETE:
                    console.log("网页接收到视频播放完成消息");
                    Player.logToWeilaiTV({duration: paramJson.duration, location: paramJson.position});//上报点播日志给未来
                    Player.initReplayBtnBg(true);
                    Player.currentPlayIndex = 0;
                    RenderParam.videoInfo.currentPlayIndex = Player.currentPlayIndex;

                    // 保存视频播放进度
                    Player.syncPlayerStatus(0);
                    Player.reportVideoRecord();
                    Player.savePlayerProgress(JSON.stringify(RenderParam.videoInfo));
                    Player.saveVideoSetProgress(JSON.stringify(RenderParam.videoInfo));

                    // S("content");
                    ShowRecommendPage();
                    var defaultFocus = 'recommended_1';
                    if (RenderParam.carrierId == '370002') {
                        // 山东电信默认焦点修改
                        defaultFocus = 'btn_replay';
                    }
                    LMEPG.ButtonManager.requestFocus(defaultFocus);
                    break;
                case PlayConstans.videoFinish.VIDEO_FINISH_REASON_ARRIVE_FREE_TIME:
                case PlayConstans.videoFinish.VIDEO_FINISH_REASON_BUY_VIP:
                    console.log("网页接收到视频播放订购消息");
                    Player.currentPlayIndex = paramJson.position;      //保存播放进度
                    RenderParam.videoInfo.currentPlayIndex = Player.currentPlayIndex;//视频信息增加播放进度

                    // 保存视频播放进度
                    Player.syncPlayerStatus(0);
                    Player.reportVideoRecord();
                    Player.savePlayerProgress(JSON.stringify(RenderParam.videoInfo));
                    Player.saveVideoSetProgress(JSON.stringify(RenderParam.videoInfo));

                    Page.jumpBuyVip(RenderParam.videoInfo.title, RenderParam.videoInfo);
                    break;

            }
        } else {
            LMAndroid.JSCallAndroid.showToast("resean为空");
            Page.onBackDelay();
        }
    },

    /**
     * 收藏/取消收藏操作
     */
    setCollectStatus: function () {
        var postData = {
            "source_id": Player.videoInfo.videoId,
            "content_name": Player.videoInfo.videoTitle,
            "content_id": Player.videoInfo.unionCode,
            "status": RenderParam.isCollected == "1" ? UN_COLLECT_CODE : COLLECT_CODE
        };
        LMEPG.ajax.postAPI("Collect/setCollectStatus", postData, function (rsp) {
            // 请求成功
            try {
                var jsonObj = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (jsonObj && jsonObj.result == 0) {
                    if (RenderParam.isCollected == "1") {
                        LMAndroid.JSCallAndroid.doShowToast("取消收藏成功");
                        RenderParam.isCollected = "0";
                    } else {
                        LMAndroid.JSCallAndroid.doShowToast("收藏成功");
                        RenderParam.isCollected = "1";
                    }
                    if (RenderParam.carrierId == "371002") {
                        Page.haiKanHoleStat(RenderParam.isCollected);
                    }
                    Player.initCollectBtnBg();
                    G("btn_collect").src = Player.collectBtnBg.focusImage;
                } else {
                    LMEPG.UI.showToast((RenderParam.isCollected == "1" ? "取消收藏失败！" : "收藏失败！") + "[" + (jsonObj ? jsonObj.result : jsonObj) + "]");
                }
            } catch (e) {
                LMEPG.UI.showToast("发生异常，操作失败！");
                LMEPG.Log.error("-------setCollectStatus------- exception: " + e.toString());
            }
        }, function (rsp) {
            // 请求失败
            LMEPG.UI.showToast("请求失败！");
        });
    },



    syncPlayerStatus: function (isStartPlay) {},

    reportVideoRecord:function(){
        if (RenderParam.carrierId === '640001') {
            var postData = {
                "union_code": Player.videoInfo.unionCode, // 当前视频编码
                "start_time": Player.startTime, // 开始播放时间
                "end_time": new Date().format("yyyy-MM-dd hh:mm:ss"),
            };
            LMEPG.ajax.postAPI('Video/recordForNX', postData, function (rsp) {
                console.log(rsp);
            });
        }
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
            if (callback) callback();
        });
    },

    /**
     * 保存用户视频集播放进度
     */
    saveVideoSetProgress: function (value) {
        if (false) {
            // 当前V3/Player.js无视频集切换（即无类似V13/Player.js里逻辑），暂停！
            return;
        }
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

    /**
     * 显示错误并退出
     */
    showError: function (msg) {
        LMEPG.UI.showToast(msg, 10);
        setTimeout(function () {
            Page.onBack();
        }, 2000);
    },

    /**
     * 集成未来播控功能 - 视频点播相关日志上报
     */
    logToWeilaiTV: function (extConfig) {
        // 未来TV要求：点播结束的推荐入口，日志。
        switch (RenderParam.carrierId) {
            case '640001'://宁夏移动
            case '630001'://青海移动
            case '450001'://广西移动
                LMAndroid.JSCallAndroid.doTaskWeilaiTV({
                    taskType: 2001, //任务类型（1000-获取广告，2000-上报广告日志 2001-上报用户行为日志）
                    taskInfo: {
                        type: 4, //日志节点类型：4-播放(play)（子类型0-20为点播日志上报，子类型21-40为直播日志上报）（更多请参考文档）
                        contents: [ //上报信息依次：type,seriesID,programID,chargeType,resolution,movieLength,location,playID。
                            // 示例：ICNTV_LOG_logUpload(4|16,CP15200001,CP1524900001,0,1,449000,281000,''/*空值需要单引号*/)
                            "16",//type
                            "",//seriesID
                            PlayThirdParty.WeilaiTV.getProgramId(Player.videoInfo.videoId, RenderParam.carrierId),//programID：节目ID
                            RenderParam.isVip == 1 ? "1" : "0",//chargeType: 0-免费 1-收费
                            "0",//resolution：0-高清 1-标清
                            extConfig.duration,//movieLength: duration-总时长（毫秒）
                            extConfig.location,//location: location-当前时长（毫秒）
                            "''",//playID：应用层无法获取playID，传空值需要用单引号（已和未来对接过此细节！）
                        ]
                    }
                });
                break;
        }
    },
};


