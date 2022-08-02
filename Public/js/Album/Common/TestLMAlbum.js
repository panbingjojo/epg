// 中国联通活动不再弹窗倒计时
if (RenderParam.lmcid == '000051' || RenderParam.lmcid == '12650092') {
    RenderParam.valueCountdown.showDialog = '0';
}
//需要跳转订购页活动名称
var toPay = ['000051',];

var LMAlbum = {
    backgroundId: 'background',
    backId: 'btn-back',
    viewMoreId: 'btn-view-more',
    viewInquiryId: 'btn-view-inquiry',
    prevVideoArrowId: 'image-prev-arrow',
    nextVideoArrowId: 'image-next-arrow',
    smallVideoId: 'small-video',
    firstVideoId: 'video-1',
    moreWonderfulId: 'more-wonderful',
    viewMorePageName: 'channel',
    viewMoreModeType: 4,
    viewMoreBackPage: 'home',
    classifyId: 1,
    modelType: 4,
    isShowOrder: true, //是否弹窗订购
    // isNeedInspireOrder: RenderParam.lmcid == '450092' ? false : true, // 是否需要促订功能，默认为true，表示专辑内都需要功能，如果针对专辑需要关闭，在专辑内将该变量置为false即可
    ArrowStatus: {
        ShowPrev: 1,
        ShowAll: 2,
        ShowNext: 3
    },
    LayoutDirection: {
        Horizontal: 1,
        Vertical: 2
    },
    smallVideoIndex: 0,
    videoListId: 'video-list',
    albumListId: 'history-album',
    firstVideoIndex: 0,
    videoInfoList: [],
    videoList: [],
    showAlbumLength: 4,
    focusId: '',
    countdownId: '',
    buttons: [],
    hasMoreWonderful: false,
    //判断是否跳转订购页
    toPay: function (albumName) {
        for (var i = 0; i < toPay.length; i++) {
            if (toPay[i] == albumName) {
                return true;
            }
        }
    },
    initRegional: function (albumAlias) {
        switch (RenderParam.lmcid) {
            case '000051':
                LMAlbum.viewMorePageName = 'home';
                // 判断专辑或者活动是否要跳转到促订逻辑跳转
                // LmOrderConf.init({
                //     getCurrentPage: LMAlbum.getCurrentPage,
                // });
                break;
            case '10000051':
                LMAlbum.viewMorePageName = 'healthVideoList';
                break;
            case '210092':
                //  中国联通
                LMAlbum.viewMorePageName = 'home';
                break;
            case '630092':
                // 青海，宁夏
                LMAlbum.viewMorePageName = 'healthVideoList';
                LMAlbum.classifyId = 4;
                LMAlbum.modelType = 20;
                break;
            case '640092':
                // 青海，宁夏
                LMAlbum.viewMorePageName = 'healthVideoList';
                LMAlbum.classifyId = 5;
                LMAlbum.modelType = 1;
                break;
            case '520094':
                // 贵州广电
                LMAlbum.viewMorePageName = 'healthVideoList';
                break;
            case '450092':
            case '420092':
            case '410092':
                //  中国联通
                LMAlbum.viewMorePageName = 'home';
                LMAlbum.classifyId = 0;
                break;
            case '450094':
                if (typeof iPanel == "object") {  //广西广电需要赋值返回键、退出键有页面来控制
                    iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE", 1);
                    iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE", 1);
                }
                break;
            case '320092':
                LMAlbum.viewMorePageName = "home"; //查看更多跳转页初始化
                LMAlbum.hasMoreWonderful = true;
                LMAlbum.albumMoveConfig = {};
                if (albumAlias.length == 4) {
                    LMAlbum.historyAlbumList = [
                        {
                            albumImage: RenderParam.albumImgPath + 'bg_album' + albumAlias[0] + '.png',
                            albumFocusImage: '',
                            albumName: 'album' + albumAlias[0]
                        },
                        {
                            albumImage: RenderParam.albumImgPath + 'bg_album' + albumAlias[1] + '.png',
                            albumFocusImage: '',
                            albumName: 'album' + albumAlias[1]
                        },
                        {
                            albumImage: RenderParam.albumImgPath + 'bg_album' + albumAlias[2] + '.png',
                            albumFocusImage: '',
                            albumName: 'album' + albumAlias[2]
                        },
                        {
                            albumImage: RenderParam.albumImgPath + 'bg_album' + albumAlias[3] + '.png',
                            albumFocusImage: '',
                            albumName: 'album' + albumAlias[3]
                        }
                    ];
                } else {
                    LMAlbum.historyAlbumList = [
                        {
                            albumImage: RenderParam.albumImgPath + 'bg_album' + albumAlias[0] + '.png',
                            albumFocusImage: '',
                            albumName: 'album' + albumAlias[0]
                        },
                        {
                            albumImage: RenderParam.albumImgPath + 'bg_album' + albumAlias[1] + '.png',
                            albumFocusImage: '',
                            albumName: 'album' + albumAlias[1]
                        },
                        {
                            albumImage: RenderParam.albumImgPath + 'bg_album' + albumAlias[2] + '.png',
                            albumFocusImage: '',
                            albumName: 'album' + albumAlias[2]
                        },
                        {
                            albumImage: RenderParam.commonHDImgPath + 'bg_album_more.png',
                            albumFocusImage: '',
                            albumName: 'more'
                        }
                    ];
                }

                break;
            case "640094":
                G('small-video-wrap').innerHTML = '';
                LMAlbum.viewMorePageName = 'home';
                LMAlbum.onClickBackListener = function (btn) {
                    ottService.stopTrailer();
                    LMEPG.Intent.back();
                };
                break;
            case "650092":
                // 新疆电信直接返回
                LMAlbum.goBack = function () {
                    LMEPG.Intent.back();
                };
                LMAlbum.onClickBackListener = function (btn) {
                    LMEPG.Intent.back();
                };
                // 新疆电信直接取消订购
                LMAlbum.hidePurchaseDialog = function () {
                    H('purchase-dialog');
                    LMEPG.ButtonManager.requestFocus(LMAlbum.focusId);
                };
                break;
        }
    },
    /**
     *获取当前页面
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('album');
        objCurrent.setParam('albumName', RenderParam.albumName);
        objCurrent.setParam('focus_index', LMAlbum.focusId);
        objCurrent.setParam('moveNum', LMAlbum.firstVideoIndex);
        objCurrent.setParam('fromId', 1);
        objCurrent.setParam('inner', RenderParam.inner);
        return objCurrent;
    },
    /**
     *  预处理设定相关参数
     */
    initPretreatment: function (initParams) {
        LMAlbum.parseTemplate();
        LMAlbum.initRegional(initParams.albumAlias);
        LMAlbum.initVideoList(); // 解析构建视频列表数据
    },

    init: function () {
        if (RenderParam.lmcid == '630092') {
            //数据探针上报  页面探针
            var dataRP = {
                userId: RenderParam.userId,
                pageKey: window.location.pathname,
                pageType: 'topicPage',
                pageMParam: RenderParam.albumName,
            }
            DataReport.getValue(1, dataRP);
        }
        if (RenderParam.carrierId == "650092" || RenderParam.carrierId == "370092" || RenderParam.carrierId == "000051") {
            RenderParam.valueCountdown.showDialog = "0";
        }
        // 初始化基本参数
        if (RenderParam.focusId == 'focus-1-1') {
            LMAlbum.focusId = 'video-1';
        } else {
            LMAlbum.focusId = RenderParam.focusId;
        }
        // 渲染页面
        LMAlbum.renderAlbumHtml();
        // 初始化页面内部按钮
        LMAlbum.initAlbumButtons();
        // 监听遥控器按键
        LMAlbum.initEventKey();
        // 使用焦点方案初始化按钮
        LMAlbum.initButtons();
        // 检测当前视频是否播放免费时长结束
        LMAlbum.checkTryWatchEnd();
        window.onBack = LMAlbum.goBack;
        window.htmlBack = LMAlbum.goBack;

        if (LMAlbum.smallVideoImage) {
            LMAlbum.playSmallVideo();
        }
        // if (LMAlbum.isNeedInspireOrder) { // 由于促订模块内部已经针对地区做了过滤，这里只需要判断专辑内部是否配置促订开关，参照album222
        LmOrderConf.init({
            getCurrentPage: LMAlbum.getCurrentPage,
        });
        // }
        document.getElementById("title").innerHTML = RenderParam.videoData[0].subject_name
    },
    goBack: function () {
        if (RenderParam.lmcid == "10000051") {
            LMEPG.Intent.back();
            return;
        }
        if (LMAlbum.dialogId) {
            if (LMAlbum.countdownId == 'back') {
                LMAlbum.commonBack();
            } else if (LMAlbum.dialogId == 'countdown-dialog') {
                LMAlbum.dialogId = '';
                LMAlbum.hideDialog('countdown-dialog');
            } else {
                LMAlbum.hideDialog(LMAlbum.dialogId);
            }
            LMEPG.BM.setKeyEventPause(false);
        } else {
            if (RenderParam.lmcid == '370092' || RenderParam.lmcid == '000051' || RenderParam.lmcid == '640094') {
                LMAlbum.commonBack();
            } else {
                LMAlbum.countdownBack();
            }
        }
    },

    debugAlbum: function (msg) {
    },

    makeUrl: function (fileUrl) {
        return RenderParam.resourceUrl + fileUrl;
    },
    parseTemplate: function () {
        var templateInfo = null;
        if (RenderParam.albumName == null || RenderParam.templateInfo == null) {
            return;
        } else {
            if (RenderParam.platformType == 'hd') {
                templateInfo = RenderParam.templateInfo['gq'];
            } else {
                templateInfo = RenderParam.templateInfo['bq'];
            }
            LMAlbum.backgroundImage = LMAlbum.makeUrl(templateInfo['bg']);
            LMAlbum.backImage = LMAlbum.makeUrl(templateInfo['back_focus_out']);
            LMAlbum.backFocusImage = LMAlbum.makeUrl(templateInfo['back_focus_in']);

            if (templateInfo['more_focus_out']) {
                LMAlbum.hasViewMore = true;
                LMAlbum.viewMoreImage = LMAlbum.makeUrl(templateInfo['more_focus_out']);
                LMAlbum.viewMoreFocusImage = LMAlbum.makeUrl(templateInfo['more_focus_in']);
            } else {
                LMAlbum.hasViewMore = false;
            }

            if (templateInfo['sw_focus_out']) {
                LMAlbum.hasSmallVideo = true;
                LMAlbum.smallVideoImage = LMAlbum.makeUrl(templateInfo['sw_focus_out']);
                LMAlbum.smallVideoFocusImage = LMAlbum.makeUrl(templateInfo['sw_focus_in']);
            } else {
                LMAlbum.hasSmallVideo = false;
            }

            LMAlbum.prevVideoArrowImage = LMAlbum.makeUrl(templateInfo['la']);
            LMAlbum.nextVideoArrowImage = LMAlbum.makeUrl(templateInfo['ra']);
        }
    }, renderAlbumHtml: function () {
        // 初始化背景图片
        G(LMAlbum.backgroundId).src = LMAlbum.backgroundImage;
        // 初始化返回按钮
        G(LMAlbum.backId).src = LMAlbum.backImage;
        // 初始化视频焦点按钮
        LMAlbum.renderVideoList();
        // 初始化视频箭头
        LMAlbum.initVideoArrow();
        if (LMAlbum.hasViewMore) {
            // 初始化查看更多
            LMAlbum.initViewMore();
        }

        if (RenderParam.hasInquiry == 1 && RenderParam.lmcid == "650092") {
            LMAlbum.initInquiry();
        }

        if (LMAlbum.hasSmallVideo) {
            // 初始化小窗视频
            LMAlbum.initSmallVideo();
        }
        if (LMAlbum.hasMoreWonderful) {
            // 江苏地区，增加更多精彩
            LMAlbum.initMoreWonderful();
        }
        if (LMAlbum.historyAlbumList) {
            // 往期专辑列表渲染
            LMAlbum.renderAlbumList();
            // 往期专辑列表按钮初始化
            LMAlbum.initAlbumButton();
        }
    },

    initAlbumButtons: function () {
        // 初始化返回按钮
        LMAlbum.initBackButton();
        // 初始化视频焦点按钮
        LMAlbum.initVideoButton();
        // 初始化订购弹窗
        LMAlbum.initPurchaseDialog();
    },

    initBackButton: function () {
        LMAlbum.buttons.push(
            {
                id: LMAlbum.backId,
                name: '返回',
                type: 'img',
                nextFocusLeft: LMAlbum.backMoveConfig.left,
                nextFocusRight: LMAlbum.backMoveConfig.right,
                nextFocusDown: LMAlbum.backMoveConfig.down,
                nextFocusUp: LMAlbum.backMoveConfig.up,
                backgroundImage: LMAlbum.backImage,
                focusImage: LMAlbum.backFocusImage,
                beforeMoveChange: '',
                click: LMAlbum.onClickBackListener,
                buttonMoveValue: 1,
                Obj: LMAlbum
            }
        )
    },

    initViewMore: function () {
        G('btn-view-more').src = LMAlbum.viewMoreImage;
        LMAlbum.buttons.push(
            {
                id: LMAlbum.viewMoreId,
                name: '查看更多',
                type: 'img',
                nextFocusLeft: LMAlbum.viewMoreMoveConfig.left,
                nextFocusRight: LMAlbum.viewMoreMoveConfig.right,
                nextFocusDown: LMAlbum.viewMoreMoveConfig.down,
                nextFocusUp: LMAlbum.viewMoreMoveConfig.up,
                backgroundImage: LMAlbum.viewMoreImage,
                focusImage: LMAlbum.viewMoreFocusImage,
                beforeMoveChange: '',
                click: LMAlbum.onClickViewMoreListener,
                Obj: LMAlbum
            }
        );
    },

    // 携带有视频问诊功能
    initInquiry: function () {
        G('btn-view-inquiry').src = RenderParam.commonHDImgPath + "btn_free_consultation.png";
        LMAlbum.buttons.push(
            {
                id: LMAlbum.viewMoreId,
                name: '查看更多',
                type: 'img',
                nextFocusLeft: LMAlbum.viewInquiryId,
                nextFocusRight: LMAlbum.viewMoreMoveConfig.right,
                nextFocusDown: LMAlbum.viewMoreMoveConfig.down,
                nextFocusUp: LMAlbum.viewMoreMoveConfig.up,
                backgroundImage: LMAlbum.viewMoreImage,
                focusImage: LMAlbum.viewMoreFocusImage,
                beforeMoveChange: '',
                click: LMAlbum.onClickViewMoreListener,
                Obj: LMAlbum
            },
            {
                id: LMAlbum.viewInquiryId,
                name: '视频问诊',
                type: 'img',
                nextFocusLeft: LMAlbum.viewMoreMoveConfig.left,
                nextFocusRight: LMAlbum.viewMoreId,
                nextFocusDown: LMAlbum.viewMoreMoveConfig.down,
                nextFocusUp: LMAlbum.viewMoreMoveConfig.up,
                backgroundImage: RenderParam.commonHDImgPath + "btn_free_consultation.png",
                focusImage: RenderParam.commonHDImgPath + "btn_free_consultation_focus.png",
                beforeMoveChange: '',
                click: LMAlbum.onClickViewInquiryListener,
                Obj: LMAlbum
            }
        );
    },

    initSmallVideo: function () {
        G('small-video').src = LMAlbum.smallVideoImage;
        if (RenderParam.cornerMarkUrl) {
            G('corner-mark').src = LMAlbum.makeUrl(RenderParam.cornerMarkUrl);
        }
        LMAlbum.buttons.push(
            {
                id: LMAlbum.smallVideoId,
                name: '小窗视频',
                type: 'img',
                nextFocusLeft: LMAlbum.smallVideoMoveConfig.left,
                nextFocusRight: LMAlbum.smallVideoMoveConfig.right,
                nextFocusDown: LMAlbum.smallVideoMoveConfig.down,
                nextFocusUp: LMAlbum.smallVideoMoveConfig.up,
                backgroundImage: LMAlbum.smallVideoImage,
                focusImage: LMAlbum.smallVideoFocusImage,
                beforeMoveChange: '',
                click: LMAlbum.onClickSmallVideoListener,
                index: LMAlbum.smallVideoIndex,
                Obj: LMAlbum
            }
        );
    },

    initMoreWonderful: function () {
        if (RenderParam.platformType == 'hd') {
            LMAlbum.albumBackgroundImg = 'bg_selected.png';
        } else {
            LMAlbum.albumBackgroundImg = 'bg_selected_sd.png';
        }
        // S('more-wonderful');
        document.body.removeChild(G("more-wonderful"))

        LMAlbum.buttons.push({
            id: 'more-wonderful',
            name: '更多精彩',
            type: 'img',
            nextFocusLeft: LMAlbum.moreWonderfulMoveConfig.left,
            nextFocusRight: LMAlbum.moreWonderfulMoveConfig.right,
            nextFocusDown: LMAlbum.moreWonderfulMoveConfig.down,
            nextFocusUp: LMAlbum.moreWonderfulMoveConfig.up,
            backgroundImage: RenderParam.commonHDImgPath + 'btn_more_album.png',
            focusImage: RenderParam.commonHDImgPath + 'btn_more_album_f.png',
            beforeMoveChange: '',
            focusChange: '',
            click: LMAlbum.onClickMoreWonderfulListener,
            Obj: LMAlbum
        });
    },

    initVideoList: function () {
        // 视频翻页过程中第一条视频显示的位置
        LMAlbum.firstVideoIndex = RenderParam.firstVideoIndex;
        LMAlbum.videoInfoList = LMAlbum.videoInfoList.concat(RenderParam.videoData);
        if (LMAlbum.smallVideoImage) {
            LMAlbum.smallVideoInfo = LMAlbum.videoInfoList.shift();
        }
        for (var index = 0; index < LMAlbum.videoInfoList.length; index++) {
            var videoInfo = {
                videoIndex: index,
                videoImage: LMAlbum.makeUrl(LMAlbum.videoInfoList[index]['title_img_url']['focus_out']),
                videoFocusImage: LMAlbum.makeUrl(LMAlbum.videoInfoList[index]['title_img_url']['focus_in'])
            };
            LMAlbum.videoList.push(videoInfo);
        }
        LMAlbum.morePage = true;
        if (LMAlbum.videoInfoList.length <= LMAlbum.showVideoLength) {
            LMAlbum.showVideoLength = LMAlbum.videoInfoList.length;
            LMAlbum.morePage = false;
        }
        LMAlbum.showVideoList = LMAlbum.videoList.slice(LMAlbum.firstVideoIndex, LMAlbum.showVideoLength + LMAlbum.firstVideoIndex);
        LMAlbum.lastVideoId = 'video-' + LMAlbum.showVideoLength;
    },

    renderVideoList: function () {
        var videoListHtml = '';
        for (var videoIndex = 0; videoIndex < LMAlbum.showVideoLength; videoIndex++) {
            var videoInfo = LMAlbum.showVideoList[videoIndex];
            videoListHtml += '<img id="video-' + (videoIndex + 1) + '" src="' + videoInfo.videoImage + '" data-v="' + videoInfo.videoIndex + '" data-f="' + videoInfo.videoFocusImage + '" data-b="' + videoInfo.videoImage + '"/>';
        }
        G('video-list').innerHTML = videoListHtml;
    },

    renderAlbumList: function () {
        var albumListHtml = '';
        if (RenderParam.lmcid == '320092') {
            // 江苏地区
            // albumListHtml += '<img id="history-album-marker" class="' + RenderParam.platformType + '-history-album-marker" src="__ROOT__/Public/img/Common/Album/bg_marker.png">';
            // albumListHtml += '<div id="history-album-list" class="' + RenderParam.platformType + '-history-album-list">';
            for (var index = 0; index < LMAlbum.showAlbumLength; index++) {
                var album = LMAlbum.historyAlbumList[index];
                albumListHtml += '<img id=album-' + (index + 1) + ' data-a=' + album.albumName + ' src=' + album.albumImage + ' >';
            }
            albumListHtml += '</div>';
        } else {
            for (var albumIndex = 0; albumIndex < LMAlbum.showAlbumLength; albumIndex++) {
                var albumInfo = LMAlbum.historyAlbumList[albumIndex];
                albumListHtml += '<img id=album-' + (albumIndex + 1) + ' data-a=' + albumInfo.albumName + ' src=' + albumInfo.albumImage + ' >';
            }
        }
        G('history-album').innerHTML += albumListHtml;

        var lastAlbum = 'album-' + LMAlbum.showAlbumLength;
        G(lastAlbum).style.marginRight = "0px";
    },
    buttonMove: function (buttonValue) {
        var x = "RenderParam.templatePageInfo.bq.focus_cfg." + buttonValue
        var buttonMove = eval(x);
        if (buttonMove == "more") {
            return LMAlbum.viewMoreId;
        } else if (buttonMove == "back") {
            return LMAlbum.backId
        } else if (buttonMove == "video_list") {
            return LMAlbum.lastVideoId;
        } else if (buttonMove == "small_video") {
            return LMAlbum.smallVideoId;
        } else {
            return null;
        }
    },
    initVideoButton: function () {
        var buttonIndex=0;
        // G('small-video').src = LMAlbum.smallVideoImage;
        // if (RenderParam.cornerMarkUrl) {
        //     G('corner-mark').src = LMAlbum.makeUrl(RenderParam.cornerMarkUrl);
        // }
        // LMAlbum.buttons.push(
        //     {
        //         id: LMAlbum.smallVideoId,
        //         name: '小窗视频',
        //         type: 'img',
        //         nextFocusLeft: LMAlbum.smallVideoMoveConfig.left,
        //         nextFocusRight: LMAlbum.smallVideoMoveConfig.right,
        //         nextFocusDown: LMAlbum.smallVideoMoveConfig.down,
        //         nextFocusUp: LMAlbum.smallVideoMoveConfig.up,
        //         backgroundImage: LMAlbum.smallVideoImage,
        //         focusImage: LMAlbum.smallVideoFocusImage,
        //         beforeMoveChange: '',
        //         click: LMAlbum.onClickSmallVideoListener,
        //         index: LMAlbum.smallVideoIndex,
        //         Obj: LMAlbum
        //     }
        // );

        for (var videoBtnIndex = 1; videoBtnIndex <= LMAlbum.showVideoLength; videoBtnIndex++) {
            var videoInfo = LMAlbum.showVideoList[videoBtnIndex - 1];
            if (LMAlbum.videoLayout == LMAlbum.LayoutDirection.Horizontal) {

                if (videoBtnIndex > 1) {
                    LMAlbum.videoMoveConfig.left = 'video-' + (videoBtnIndex - 1);
                }

                if (videoBtnIndex < LMAlbum.showVideoLength) {
                    LMAlbum.videoMoveConfig.right = 'video-' + (videoBtnIndex + 1);
                }
            } else {
                if (videoBtnIndex > 0) {
                    LMAlbum.videoMoveConfig.up = 'video-' + (videoBtnIndex - 1);
                }
                if (videoBtnIndex < LMAlbum.showVideoLength) {
                    LMAlbum.videoMoveConfig.down = 'video-' + (videoBtnIndex + 1);
                }
                buttonIndex++;
            }
            LMAlbum.buttons.push(
                {
                    id: 'video-' + videoBtnIndex,
                    name: '视屏' + videoBtnIndex,
                    type: 'img',
                    nextFocusLeft: LMAlbum.videoMoveConfig.left,
                    nextFocusRight: LMAlbum.videoMoveConfig.right,
                    nextFocusDown: LMAlbum.videoMoveConfig.down,
                    nextFocusUp: LMAlbum.videoMoveConfig.up,
                    backgroundImage: videoInfo.videoImage,
                    focusImage: videoInfo.videoFocusImage,
                    focusChange: LMAlbum.onVideoFocus,
                    beforeMoveChange: LMAlbum.beforeVideoMoveChange,
                    click: LMAlbum.onClickVideoListener,
                    index: videoBtnIndex,
                    Obj: LMAlbum
                }
            )
        }
    },

    initVideoArrow: function () {
        G(LMAlbum.prevVideoArrowId).src = LMAlbum.prevVideoArrowImage;
        G(LMAlbum.nextVideoArrowId).src = LMAlbum.nextVideoArrowImage;
        H(LMAlbum.prevVideoArrowId);
        H(LMAlbum.nextVideoArrowId);
        var shiftLength = LMAlbum.videoList.length - LMAlbum.showVideoLength;
        switch (LMAlbum.firstVideoIndex) {
            case 0:
                if (LMAlbum.morePage) {
                    //当前视频条数是多页，即可以翻页
                    LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowNext);
                }
                break;
            case shiftLength:
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowPrev);
                break;
            default:
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowAll);
                break
        }
    },


    initAlbumButton: function () {
        for (var albumBtnIndex = 1; albumBtnIndex <= LMAlbum.showAlbumLength; albumBtnIndex++) {
            var albumInfo = LMAlbum.historyAlbumList[albumBtnIndex - 1];
            if (albumBtnIndex > 1) {
                LMAlbum.albumMoveConfig.left = 'album-' + (albumBtnIndex - 1);
            }

            if (albumBtnIndex < LMAlbum.showAlbumLength) {
                LMAlbum.albumMoveConfig.right = 'album-' + (albumBtnIndex + 1);
            }
            LMAlbum.buttons.push(
                {
                    id: 'album-' + albumBtnIndex,
                    name: '专辑' + albumBtnIndex,
                    type: 'img',
                    nextFocusLeft: LMAlbum.albumMoveConfig.left,
                    nextFocusRight: LMAlbum.albumMoveConfig.right,
                    nextFocusDown: LMAlbum.albumMoveConfig.down,
                    nextFocusUp: LMAlbum.albumMoveConfig.up,
                    backgroundImage: albumInfo.albumImage,
                    focusImage: albumInfo.albumFocusImage,
                    focusChange: LMAlbum.onAlbumFocus,
                    beforeMoveChange: LMAlbum.beforeAlbumMoveChange,
                    click: LMAlbum.onClickAlbumListener,
                    index: albumBtnIndex,
                    Obj: LMAlbum
                }
            )
        }
    },

    onVideoFocus: function (btn, hasFocus) {
        var btnObj = G(btn.id);
        if (hasFocus) {
            G('debug').innerHTML = '.'; // 标清防止焦点丢失
            btnObj.src = btnObj.getAttribute('data-f');//获取焦点
        } else {
            G('debug').innerHTML = '';
            btnObj.src = btnObj.getAttribute('data-b');//失去取焦点
        }
    },

    onAlbumFocus: function (btn, hasFocus) {
        var btnObj = document.getElementById(btn.id);
        if (hasFocus) {
            btnObj.style.backgroundImage = 'url(' + RenderParam.commonHDImgPath + LMAlbum.albumBackgroundImg + ')';
            btnObj.style.backgroundRepeat = "no-repeat";
        } else {
            btnObj.style.backgroundImage = "";
        }
    },

    beforeVideoMoveChange: function (direction, btn) {
        if (LMAlbum.videoLayout == LMAlbum.LayoutDirection.Horizontal) {
            var videoStep = Math.ceil(LMAlbum.showVideoLength / 2);
            switch (direction) {
                case "right":
                    return LMAlbum.toggleNextVideo(btn);
                case "left":
                    return LMAlbum.togglePrevVideo(btn);

                case "down":
                    if (videoStep == 2) {
                        if (btn.id == "video-1" || btn.id == "video-2") {
                            LMEPG.BM.requestFocus("video-" + (parseInt(btn.id.substr(-1)) + videoStep));
                            return false;
                        }
                    } else {
                        if (btn.id == "video-1" || btn.id == "video-2" || btn.id == "video-3") {
                            LMEPG.BM.requestFocus("video-" + (parseInt(btn.id.substr(-1)) + videoStep));
                            return false;
                        }
                    }
                    break;
                case "up":
                    if (videoStep == 2) {
                        if (btn.id == "video-3" || btn.id == "video-4") {
                            LMEPG.BM.requestFocus("video-" + (parseInt(btn.id.substr(-1)) - videoStep));
                            return false;
                        }
                    } else {
                        if (btn.id == "video-4" || btn.id == "video-5" || btn.id == "video-6") {
                            LMEPG.BM.requestFocus("video-" + (parseInt(btn.id.substr(-1)) - videoStep));
                            return false;
                        }
                    }
                    break;
            }
        } else {
            switch (direction) {
                case "down":
                    return LMAlbum.toggleNextVideo(btn);
                    break;
                case "up":
                    return LMAlbum.togglePrevVideo(btn);
                    break;
            }
        }
    },

    beforeAlbumMoveChange: function (direction, btn) {
        switch (direction) {
            case "right":
                if (btn.id == 'album-more' && LMAlbum.albumMoveConfig.next) {
                    LMEPG.ButtonManager.requestFocus(LMAlbum.albumMoveConfig.next);
                }
                break;
            case "left":
                if (btn.id == 'album-1' && LMAlbum.albumMoveConfig.prev) {
                    LMEPG.ButtonManager.requestFocus(LMAlbum.albumMoveConfig.prev);
                }
                break;
            default:
                if (RenderParam.lmcid == '320092' && direction == 'down') {
                    H('history-album');
                    LMEPG.ButtonManager.requestFocus('more-wonderful');
                }
                if (LMAlbum.hookAlbumMoveChange) {
                    LMAlbum.hookAlbumMoveChange();
                }
                break;
        }
    },

    toggleNextVideo: function (btn) {
        if (btn.id == 'video-' + LMAlbum.showVideoLength) {
            var videoIndex = parseInt(G(btn.id).getAttribute('data-v'));
            return LMAlbum.renderNextVideo(videoIndex);
        }
    },

    togglePrevVideo: function (btn) {
        if (btn.id == 'video-1') {
            // var videoIndex = parseInt(G(btn.id).getAttribute('data-v'));
            var videoIndex = LMAlbum.firstVideoIndex;
            return LMAlbum.renderPrevVideo(videoIndex);
        }
    },

    renderNextVideo: function (videoIndex) {
        var lastVideoIndex = LMAlbum.videoList.length - 1;
        if (videoIndex == lastVideoIndex) {
            LMEPG.ButtonManager.requestFocus(LMAlbum.videoMoveConfig.next);
            return false;
        } else {
            // 最后显示的元素
            LMAlbum.showVideoList.shift(); // 移除第一个元素
            LMAlbum.showVideoList.push(LMAlbum.videoList[videoIndex + 1]);
            LMAlbum.renderVideoList();
            LMEPG.ButtonManager.requestFocus('video-' + LMAlbum.showVideoLength - 1);
            LMAlbum.firstVideoIndex++;
            if (videoIndex == (lastVideoIndex - 1)) {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowPrev);
            } else {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowAll);
            }
        }
    },

    renderPrevVideo: function (videoIndex) {
        if (videoIndex == 0) {
            LMEPG.ButtonManager.requestFocus(LMAlbum.videoMoveConfig.prev);
            return false;
        } else {
            // 最后显示的元素
            LMAlbum.showVideoList.pop(); // 移除最后一个元素
            LMAlbum.showVideoList.unshift(LMAlbum.videoList[videoIndex - 1]);
            LMAlbum.renderVideoList();
            LMEPG.ButtonManager.requestFocus('video-1');
            LMAlbum.firstVideoIndex--;
            if (videoIndex == 1) {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowNext);
            } else {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowAll);
            }
        }
    },

    showVideoArrow: function (status) {
        switch (status) {
            case LMAlbum.ArrowStatus.ShowPrev:
                // 显示左/下箭头，隐藏右/上箭头
                S(LMAlbum.prevVideoArrowId);
                H(LMAlbum.nextVideoArrowId);
                break;
            case LMAlbum.ArrowStatus.ShowAll:
                // 显示左/下箭头，显示右/上箭头
                S(LMAlbum.prevVideoArrowId);
                S(LMAlbum.nextVideoArrowId);
                break;
            case LMAlbum.ArrowStatus.ShowNext:
                // 隐藏左/下箭头，显示右/上箭头
                H(LMAlbum.prevVideoArrowId);
                S(LMAlbum.nextVideoArrowId);
                break;
        }
    },

    initEventKey: function () {
        if (RenderParam.lmcid == '450094') {
            //  添加点击返回事件
            LMEPG.Log.info('--->album History addKeyEvent: 广西广电新增返回事件');
            LMEPG.KeyEventManager.addKeyEvent(
                {
                    KEY_399: function () { //广西广电返回键
                        LMEPG.Log.info('--->album History KEY_399: 广西广电返回键');
                        LMAlbum.commonBack();
                    },
                    KEY_514: function () {  //广西广电退出键
                        LMEPG.Log.info('--->album History KEY_514: 广西广电退出键');
                        LMAlbum.commonBack();
                    }
                }
            )
        }
    },

    initButtons: function () {
        LMEPG.ButtonManager.init(LMAlbum.focusId, LMAlbum.buttons, '', true);
    },

    onClickBackListener: function (btn) {
        LMAlbum.focusId = btn.id;
        if (RenderParam.lmcid == '370092' || RenderParam.lmcid == '000051') {
            LMAlbum.commonBack();
        } else {
            LMAlbum.countdownBack();
        }
    },

    countdownBack: function () {
        LMAlbum.countdownId = 'back';
        //LMAlbum.showDialog('countdown-dialog');
        if (!(RenderParam.lmcid == "000051" && RenderParam.areaCode == "207") && !Boolean(RenderParam.vip) && RenderParam.valueCountdown && RenderParam.valueCountdown.showDialog == '1') {
            // 普通用户且未弹窗倒计时，倒计时弹窗
            LMAlbum.countdownId = 'back';
            LMEPG.BM.setKeyEventPause(true);
            LMAlbum.showDialog('countdown-dialog');
        } else {
            LMAlbum.commonBack();
        }
    },

    commonBack: function () {
        if (RenderParam.userId == "109785884") {
            LMEPG.UI.logPanel.i("inner>>" + RenderParam.inner);
        }
        // 宁夏广电返回不弹窗
        if (RenderParam.lmcid == '640094') {
            ottService.stopTrailer();
            LMEPG.Intent.back();
            return;
        }

        if (RenderParam.lmcid == '450094' && RenderParam.inner != 1) {
            // 广西广电局方大厅进入返回逻辑
            var albumHistoryLength = history.length;
            if (albumHistoryLength == RenderParam.splashHistory) {
                albumHistoryLength++;
            }
            var backLength = albumHistoryLength + 1 - RenderParam.splashHistory;
            //LMEPG.Log.info("clickType = " + clickType + ",albumHistoryLength = " + albumHistoryLength + ",splashHistory = " + RenderParam.splashHistory);
            history.go(-backLength);
            return;
        }
        if (RenderParam.lmcid == "630092" && RenderParam.inner == 0 && RenderParam.fromLaunch == '1') {
            Utility.setValueByName("exitIptvApp");
        } else {
            if (RenderParam.lmcid == '420092' && (RenderParam.albumName == "album175" || RenderParam.albumName == "album147"
                || RenderParam.albumName == "album196")) {
                LMEPG.Intent.back('IPTVPortal');
            } else if (0 && RenderParam.lmcid == '000051'
                && (RenderParam.albumName == "album176" || RenderParam.albumName == "album210")
                && RenderParam.areaCode == "207") {
                LMEPG.Intent.back('IPTVPortal');
            } else {
                LMEPG.Intent.back();
            }
        }
    },
    jumpMenuPage: function () {

        var objCurrent = LMAlbum.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("menuTab");
        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },


    onClickViewMoreListener: function (btn) {
        if (RenderParam.lmcid == "630092" || RenderParam.lmcid == "640092") {
            LMAlbum.jumpMenuPage();
            return;
        }
        LMAlbum.focusId = btn.id;
        var objMoreVideo = LMEPG.Intent.createIntent(LMAlbum.viewMorePageName);
        objMoreVideo.setParam('classifyId', LMAlbum.classifyId);
        objMoreVideo.setParam('modeTitle', '更多精彩');
        objMoreVideo.setParam('modeType', LMAlbum.viewMoreModeType);
        objMoreVideo.setParam('modelType', LMAlbum.modelType);
        objMoreVideo.setParam('currentTabIndex', 3);
        objMoreVideo.setParam('homeTabIndex', 5);
        objMoreVideo.setParam('pageCurrent', 1); // 内容页数
        objMoreVideo.setParam('navCurrent', 0);  // 导航焦点
        objMoreVideo.setParam('tabId', "tab-3");  // 导航焦点


        var objBack = LMEPG.Intent.createIntent(LMAlbum.viewMoreBackPage);
        LMEPG.Intent.jump(objMoreVideo, objBack);
    },

    // 点击视频问诊按钮
    onClickViewInquiryListener: function () {
        var objCurrent = LMAlbum.getCurrentPage();

        var objDoctorP2P = LMEPG.Intent.createIntent('doctorList');
        objDoctorP2P.setParam('userId', RenderParam.userId);
        objDoctorP2P.setParam('s_demo_id', "demo");

        LMEPG.Intent.jump(objDoctorP2P, objCurrent);
    },

    onClickSmallVideoListener: function (btn) {
        LMAlbum.focusId = btn.id;
        LMAlbum.parseVideoInfo(LMAlbum.smallVideoInfo);
    },

    onClickVideoListener: function (btn) {
        LMAlbum.focusId = btn.id;
        var videoIndex = G(btn.id).getAttribute('data-v');
        var videoInfo = LMAlbum.videoInfoList[videoIndex];
        LMAlbum.parseVideoInfo(videoInfo);
    },

    onClickMoreWonderfulListener: function () {
        S('history-album');
        LMEPG.ButtonManager.requestFocus('album-1');
    },

    onClickAlbumListener: function (btn) {
        LMAlbum.focusId = btn.id;
        var objCurrent = LMAlbum.getCurrentPage();
        var objAlbum = LMEPG.Intent.createIntent('album');
        var currentAlbum = G(LMAlbum.focusId).getAttribute('data-a');
        objAlbum.setParam('albumName', currentAlbum);
        objAlbum.setParam('inner', '1');
        if (RenderParam.lmcid == '320092') {
            objCurrent.setParam('focus_index', 'more-wonderful'); // 记录当前页面的焦点，用于返回时恢复焦点
        } else {
            objCurrent.setParam('focus_index', btn.id); // 记录当前页面的焦点，用于返回时恢复焦点
        }
        if (currentAlbum === 'more') {
            LMAlbum.jumpHomeTab('home');
        } else {
            LMEPG.Intent.jump(objAlbum, objCurrent);
        }
    },


    parseVideoInfo: function (videoInfo) {
        try {
            var ftp_url_json, play_id;
            if (videoInfo.ftp_url instanceof Object) {
                ftp_url_json = videoInfo.ftp_url;
            } else {
                ftp_url_json = JSON.parse(videoInfo.ftp_url);
            }
            // 视频ID
            if (RenderParam.platformType == 'hd') {
                play_id = ftp_url_json.gq_ftp_url;
            } else {
                play_id = ftp_url_json.bq_ftp_url;
            }
            if (RenderParam.lmcid == '520092') {
                // 贵州电信需要编码
                play_id = encodeURIComponent(play_id);
            }
            var videoParams = {
                'sourceId': videoInfo.source_id,
                'videoUrl': play_id,
                'title': videoInfo.title,
                'type': 2,
                'entryType': 4,
                'entryTypeName': RenderParam.albumName,
                'userType': videoInfo.user_type,
                'freeSeconds': videoInfo.free_seconds,
                'duration': videoInfo.duration,
                'focusIdx': LMAlbum.focusId,
                'unionCode': videoInfo.union_code
            };
            LMAlbum.videoTitle = videoParams.title;
            if (RenderParam.vip == 0 && RenderParam.isVideoFree == 1) {
                // 普通用户且具备免费观看权限，修改当前视频观看权限
                videoParams.userType = 0;
            }
            if (LMEPG.Func.isAllowAccess(RenderParam.vip, ACCESS_PLAY_VIDEO_TYPE, videoParams)) {
                if (RenderParam.albumName == "album231") {
                    if (RenderParam.addScore == "1") {
                        LMAlbum.addScore(10, function () {
                            LMEPG.UI.showToast('添加10积分', 2);
                            LMAlbum.playVideo(videoParams);
                        }, function () {
                            LMEPG.UI.showToast('添加积分失败', 2);
                            // LMAlbum.playVideo(videoParams);
                        })
                    } else {
                        LMAlbum.playVideo(videoParams);
                    }
                } else {
                    LMAlbum.playVideo(videoParams);
                }
            } else {
                LMAlbum.storeVideoInfo(LMAlbum, videoParams);
            }
        } catch (e) {
            G('debug').innerText = '系统报错！' + e.toString();
        }
    },
    addScore: function (score, successFn, errorFn) {
        var params = {
            postData: {
                'score': score,
                'remark': '用户积分'
            },
            path: 'NewActivity/addUserScore'
        };
        params.successCallback = successFn;
        params.errorCallback = errorFn;
        LMAlbum.ajaxPost(params);
    },
    ajaxPost: function (params) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.BM.setKeyEventPause(true);
        // 处理抽奖接口成功码的判断
        var successCode = 0;
        if (params.successCode) {
            successCode = params.successCode;
        }
        LMEPG.ajax.postAPI(params.path, params.postData,
            function (rsp) { // 网络请求成功
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.BM.setKeyEventPause(false);
                if (rsp.result == successCode) {// 接口调用成功
                    params.successCallback(rsp);
                } else { // 接口调用失败
                    params.errorCallback(rsp.result);
                }
            }, function () { // 网络请求失败
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.BM.setKeyEventPause(false);
            }
        );
    },

    playVideo: function (videoParams) {
        var objCurrent = LMAlbum.getCurrentPage();
        objCurrent.setParam('fromId', 2);
        objCurrent.setParam('videoTitle', videoParams.title);
        objCurrent.setParam('isVideoFree', RenderParam.isVideoFree);

        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('videoInfo', JSON.stringify(videoParams));
        // 广西广电多传一个参数
        objPlayer.setParam('allVideoInfo', JSON.stringify([videoParams]));
        objPlayer.setParam('albumName', RenderParam.albumName);

        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    playSmallVideo: function (keyCode) {
        if (LMSmallPlayer.isInterceptPlayException(keyCode)) return;
        LMSmallPlayer.initParam({
            carrierId: RenderParam.lmcid,
            playerUrl: RenderParam.domainUrl,
            position: LMAlbum.smallVideoPosition,
            playerScreenId: 'small-screen',
            platformType: RenderParam.platformType,
            videoData: RenderParam.videoData
        });
        LMSmallPlayer.startPlayVideo();
        //虚拟按键触发，轮询播放
        LMEPG.KeyEventManager.addKeyEvent({
            EVENT_MEDIA_END: LMAlbum.playSmallVideo,	         //视频播放结束
            EVENT_MEDIA_ERROR: LMAlbum.playSmallVideo        //视频播放错误
        });
    },

    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('album');
        objCurrent.setParam('albumName', RenderParam.albumName);
        objCurrent.setParam('focus_index', LMAlbum.focusId);
        objCurrent.setParam('moveNum', LMAlbum.firstVideoIndex);
        objCurrent.setParam('fromId', 1);
        objCurrent.setParam('inner', RenderParam.inner);
        return objCurrent;
    },

    jumpHomeTab: function () {
        var objHomeTab = LMEPG.Intent.createIntent('home');
        objHomeTab.setParam('classifyId', '');
        LMEPG.Intent.jump(objHomeTab);
    },

    initPurchaseDialog: function () {
        LMAlbum.buttons.push({
            id: 'btn-purchase',
            name: '立即订购',
            type: 'img',
            nextFocusLeft: 'btn-cancel-purchase',
            nextFocusRight: 'btn-cancel-purchase',
            nextFocusDown: '',
            nextFocusUp: '',
            backgroundImage: RenderParam.commonImgPath + 'btn_purchase.png',
            focusImage: RenderParam.commonImgPath + 'btn_purchase_focus.png',
            beforeMoveChange: '',
            focusChange: '',
            click: LMAlbum.purchaseVIP,
            Obj: LMAlbum
        }, {
            id: 'btn-cancel-purchase',
            name: '取消订购',
            type: 'img',
            nextFocusLeft: 'btn-purchase',
            nextFocusRight: 'btn-purchase',
            nextFocusDown: '',
            nextFocusUp: '',
            backgroundImage: RenderParam.commonImgPath + 'btn_cancel_purchase.png',
            focusImage: RenderParam.commonImgPath + 'btn_cancel_purchase_focus.png',
            beforeMoveChange: '',
            focusChange: '',
            click: LMAlbum.cancelPurchaseVIP,
            Obj: LMAlbum
        })
    },

    purchaseVIP: function (btn) {
        var self = btn.id;
        var objCurrent = LMAlbum.getCurrentPage();
        objCurrent.setParam('fromId', 1);
        objCurrent.setParam('page', 0);

        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('isPlaying', '1');

        if (LMAlbum.videoTitle) {
            objOrderHome.setParam('remark', LMAlbum.videoTitle);
        }

        // pop_type：局方订购页形式（0浮窗形式 1跳转形式）,IFrame加载订购页面(0--不是，是直接页面跳转, 1--是，在当前页面用IFrame加载；)
        var isIFramePay = 0;
        var payMethod = RenderParam.payMethod;
        if (payMethod && payMethod.result == 0) {
            var item = payMethod.data.list[0];
            if (item) {
                isIFramePay = item.pop_type == '0' ? 1 : 0;
            }
        }

        LMEPG.Log.info("album isIFramePay = " + isIFramePay);
        if (isIFramePay == 1) {
            H('purchase-dialog');
            objOrderHome.setParam('isIFramePay', '1');
            var payUrl = LMEPG.Intent.getJumpUrl(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
            LMEPG.PayFrame.goLMPay(payUrl, RenderParam.platformType);
        } else {
            LMEPG.Intent.jump(objOrderHome, objCurrent);
        }
    },

    cancelPurchaseVIP: function (btn) {
        var self = btn.Obj;
        LMAlbum.hidePurchaseDialog();
    },

    hidePurchaseDialog: function () {
        if (RenderParam.lmcid != '000051' && RenderParam.lmcid != '370092' && !(RenderParam.lmcid == "000051" && RenderParam.areaCode == "207") && RenderParam.valueCountdown.showDialog == "1") {
            H('purchase-dialog');
            LMAlbum.countdownId = 'purchase';
            LMEPG.BM.setKeyEventPause(true);
            LMAlbum.showDialog('countdown-dialog');
        } else {
            H('purchase-dialog');
            LMEPG.ButtonManager.requestFocus(LMAlbum.focusId);
        }
    },

    checkTryWatchEnd: function () {
        if (!Boolean(RenderParam.vip) && RenderParam.atFreeTime == '1') {
            // 普通用户观看免费时长结束，弹出计费页
            LMAlbum.showDialog('purchase-dialog');
            LMEPG.ButtonManager.requestFocus('btn-purchase');
        }
    },

    storeVideoInfo: function (obj, videoParams) {
        var postData = {'videoInfo': JSON.stringify(videoParams)};
        LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
            if (data.result != 0) {
                G('debug').innerText = '系统报错!';
            } else {
                if (RenderParam.lmcid == "650092") {
                    LMAlbum.purchaseVIP({"id": "btn-purchase"});
                    return;
                } else if (RenderParam.lmcid == "610092" || RenderParam.lmcid == "10000051") {
                    LMAlbum.purchaseVIP();  //直接去计费页
                    return;
                }
                obj.showDialog('purchase-dialog');
                if (RenderParam.lmcid == "450092" || RenderParam.lmcid == "450094") {
                    LMEPG.ButtonManager.requestFocus('btn-purchase');
                    LMEPG.ButtonManager.requestFocus('btn-cancel-purchase');
                    // LMEPG.ButtonManager.requestFocus('btn-purchase');
                } else {
                    LMEPG.ButtonManager.requestFocus('btn-purchase');
                }
            }
        });
    },

    showDialog: function (dialogId) {
        LMAlbum.dialogId = dialogId;
        S(dialogId);
        if (dialogId == 'countdown-dialog') {
            LMAlbum.startCountdown();
        }
    },

    hideDialog: function (dialogId) {
        H(dialogId);
        switch (dialogId) {
            case 'countdown-dialog':
                clearInterval(LMAlbum.countInterval)
                break;
            case 'purchase-dialog':
                LMAlbum.hidePurchaseDialog();
                break;
        }
        if (LMAlbum.dialogId != 'countdown-dialog') {
            LMAlbum.dialogId = '';
            LMEPG.ButtonManager.requestFocus(LMAlbum.focusId);
        }
    },

    startCountdown: function () {
        LMAlbum.dialogId = 'countdown-dialog';
        LMAlbum.count = 8;
        G('count').innerHTML = String(LMAlbum.count);
        LMAlbum.countInterval = setInterval(function () {
            G('count').innerHTML = String(--LMAlbum.count);
            if (LMAlbum.count == 0) {
                clearInterval(LMAlbum.countInterval);
                LMEPG.BM.setKeyEventPause(false);
                RenderParam.valueCountdown.showDialog = '0';
                // 调用后台接口，保存数据
                var countdownValue = {
                    showDialog: "0"
                };
                LMAlbum.saveData(RenderParam.keyCountdown, JSON.stringify(countdownValue))
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
                    H('countdown-dialog');
                    if (data.result != 0) {
                        LMEPG.UI.showToast("上报数据异常！", 3);
                        LMEPG.ButtonManager.requestFocus(LMAlbum.focusId);
                    } else {
                        RenderParam.isVideoFree = 1;
                        RenderParam.valueCountdown.showDialog = "0";
                        // 跳转播放器播放第一条视频
                        var videoInfo = LMAlbum.videoInfoList[0];
                        LMAlbum.focusId = 'video-1';
                        LMAlbum.parseVideoInfo(videoInfo);
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
    }
};

// 结束声明命名空间LMEPG后，引入业务扩展js
try {
    console.debug('lmcommon.js g_appRootPath=' + g_appRootPath);
    document.writeln('<script type="text/javascript" src="' + g_appRootPath + '/Public/js/Pay/lmOrderConf.js"></script>');
} catch (e) {
    console.error('lmcommon.js includes JS-Files error:' + e.toString());
}