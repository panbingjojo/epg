var LMAlbum = {
    eleInfo : RenderParam.platformType ==='hd'? RenderParam.templatePageInfo.page_info.gq : RenderParam.templatePageInfo.page_info.bq,
    backgroundId: 'background',
    backId: 'back',
    viewMoreId: 'more',
    smallVideoId: 'small_video',
    prevVideoArrowId: 'image-prev-arrow',
    nextVideoArrowId: 'image-next-arrow',
    videoListId: 'video-list',

    ArrowStatus: {
        ShowPrev: 1,
        ShowAll: 2,
        ShowNext: 3
    },

    LayoutDirection: {
        Horizontal: 1,
        Vertical: 2,
        DoubleVertical:3,
        DoubleHorizontal:4
    },

    videoRender:{
        card:0
    },

    viewInquiryId: 'btn-view-inquiry',
    firstVideoId: 'video-1',
    moreWonderfulId: 'more-wonderful',
    viewMorePageName: 'channel',
    viewMoreModeType: 4,
    viewMoreBackPage: 'home',
    classifyId: 1,
    modelType: 4,

    smallVideoIndex: 0,

    albumListId: 'history-album',
    firstVideoIndex: 0,
    videoInfoList: [],
    videoList: [],
    showAlbumLength: 4,
    focusId: '',
    countdownId: '',
    buttons: [],
    hasMoreWonderful: false,

    videoRenderType:null,
    maxLeft : 0,
    leavePosition:'video-2',
    moveFlag:RenderParam.focusId.substr(6)*1 - 2 || 0,

    initRegional: function (initParams) {
        switch (RenderParam.lmcid) {
            case '000051':
                LMAlbum.viewMorePageName = 'home';
                break;
            case '10000051':
            case '10000006':
                LMAlbum.viewMorePageName = 'healthVideoList';
                break;
            case '130001':
                LMAlbum.classifyId = 5;
                LMAlbum.modelType = 6;
                LMAlbum.viewMorePageName = 'healthVideoList';
                break;
            case '210092':
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
                LMAlbum.viewMorePageName = 'MenuTabLevelThree';
                LMAlbum.classifyId = 5;
                LMAlbum.modelType = 1;
                break;
            case '520094':
                // 贵州广电
                LMAlbum.viewMorePageName = 'healthVideoList';
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

                var albumAlias = initParams.albumAlias;
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

                LMAlbum.onClickBackListener = function (btn) {
                    window.location.href = "http://180.100.135.12:8296/life/superior/login";
                };

                break;
            case "370092":
                // 调用探针接口上报数据 1:进入 0：退出
                var operateParams = {
                    "action": 1,
                    "contentId": RenderParam.albumName
                };
                LMEPG.ajax.postAPI("System/clickContentInfo", operateParams, LMEPG.emptyFunc, LMEPG.emptyFunc);
                break;
            case "640094":
                G('small-video-wrap').innerHTML = '';
                LMAlbum.viewMorePageName = 'home';
                LMAlbum.onClickBackListener = function (btn) {
                    LMEPG.Intent.back();
                };
                break;
            case "650092":
            case "371092":
            case "371002":
                LMAlbum.viewMorePageName = 'home';
                LMAlbum.classifyId = 0;
                break;
        }

        // v13模式查看更多需要跳转首页精选专题导航栏下
        var recommendRouteHomeCarriers = ['000709','410092','420092','430002','440001','450092','220001','640001','000005','150002','370092','430012','450004','01230001','450094'];
        if(recommendRouteHomeCarriers.indexOf(RenderParam.lmcid) > -1) {
            LMAlbum.viewMorePageName = 'home';
            LMAlbum.classifyId = 0;
        }

        if (RenderParam.lmcid === '630001') { // 青海移动apk
            LMAlbum.viewMorePageName = 'menuTab'; // 修改【查看更多】指定跳转二级导航页面
        }
    },

    /**
     *  预处理设定相关参数
     */
    initPretreatment: function (initParams) {
        LMAlbum.parseTemplate();
        LMAlbum.initRegional(initParams);
        LMAlbum.initVideoList(); // 解析构建视频列表数据

        if(RenderParam.lmcid === '410092'){
            try {
                HybirdCallBackInterface.setCallFunction(function (param) {
                    LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                    if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                        if(LMAlbum.eleInfo.page_back_type.value  === ''){
                            if(RenderParam.inner == "0"){
                                LMEPG.Intent.back('IPTVPortal');
                            }else {
                                LMEPG.Intent.back();
                            }
                        }else if(LMAlbum.eleInfo.page_back_type.value === '1'){
                            LMEPG.Intent.back();
                        }else {
                            LMEPG.Intent.back('IPTVPortal');
                        }
                    }
                });
            }catch (e) {
                LMEPG.UI.logPanel.show("e");
            }
        }
    },

    init: function () {
        if (RenderParam.lmcid == '630092') {
            //数据探针上报  页面探针
            var dataRP = {
                userId: RenderParam.userId,
                pageKey: window.location.pathname,
                pageType: 'topicPage',
                pageMParam: RenderParam.albumName,
            };
            DataReport.getValue(1, dataRP);
        }

        // 初始化基本参数
        if (RenderParam.focusId == 'focus-1-1') {
            LMAlbum.focusId = 'video-1';
            if(LMAlbum.videoRenderType === LMAlbum.videoRender.card){
                LMAlbum.focusId = 'video-2';
            }
        } else {
            LMAlbum.focusId = RenderParam.focusId;
        }
        // 初始化页面内部按钮
        LMAlbum.initAlbumButtons();

        // 渲染页面
        LMAlbum.renderAlbumHtml();

        LMAlbum.setPageElePosition();


        // 监听遥控器按键
        LMAlbum.initEventKey();
        // 使用焦点方案初始化按钮
        LMAlbum.initButtons();

        window.onBack =  LMAlbum.commonBack;
        window.htmlBack =  LMAlbum.commonBack;

        if(LMAlbum.videoRenderType === LMAlbum.videoRender.card){
            G('image-prev-arrow').style.visibility='visible'
        }

        if (LMAlbum.smallVideoImage) {
            LMAlbum.playSmallVideo();
        }

        // if (LMAlbum.isNeedInspireOrder) { // 由于促订模块内部已经针对地区做了过滤，这里只需要判断专辑内部是否配置促订开关，参照album222
        LmOrderConf.init({
            getCurrentPage: LMAlbum.getCurrentPage,
        });
        // }

        //统计探针
        if (RenderParam.lmcid == "371092" || RenderParam.lmcid == "371002") {
            var turnPageInfo = {
                currentPage: location.href,
                turnPage: document.referrer,
                turnPageName: document.title,
                turnPageId: "39_" + RenderParam.albumName,
                clickId: "39JKJXZT"
            };
            ShanDongHaiKan.sendReportData('6', turnPageInfo);
        }
    },

    goBack: function () {
        LMAlbum.commonBack();
    },

    setPageElePosition:function(){
        var back = G(LMAlbum.backId);
        var more = G(LMAlbum.viewMoreId);
        var sVideo = G(LMAlbum.smallVideoId);
        var preArrow = G(LMAlbum.prevVideoArrowId);
        var nextArrow = G(LMAlbum.nextVideoArrowId);
        var list = G(LMAlbum.videoListId);


        back.style.top = this.eleInfo.position.back.top + 'px';
        back.style.left = this.eleInfo.position.back.left + 'px';
        if(RenderParam.platformType === 'sd'){
            back.style.width = this.eleInfo.size.back.width + 'px';
            back.style.height = this.eleInfo.size.back.height + 'px';
        }

        more.style.top = this.eleInfo.position.more.top + 'px';
        more.style.left = this.eleInfo.position.more.left + 'px';

        if(RenderParam.platformType === 'sd'){
            more.style.width = this.eleInfo.size.more.width + 'px';
            more.style.height = this.eleInfo.size.more.height + 'px';
        }

        if(sVideo){
            sVideo.style.top = this.eleInfo.position.sw.top + 'px';
            sVideo.style.left = this.eleInfo.position.sw.left + 'px';
        }

        preArrow.style.top = this.eleInfo.position.la.top + 'px';
        preArrow.style.left = this.eleInfo.position.la.left + 'px';

        nextArrow.style.top = this.eleInfo.position.ra.top + 'px';
        nextArrow.style.left = this.eleInfo.position.ra.left + 'px';


        if(RenderParam.platformType === 'sd'){
            preArrow.style.width = this.eleInfo.size.la.width + 'px';
            preArrow.style.height = this.eleInfo.size.la.height + 'px';

            nextArrow.style.width = this.eleInfo.size.ra.width + 'px';
            nextArrow.style.height = this.eleInfo.size.ra.height + 'px';
        }

        list.style.top = this.eleInfo.position.video_list.top + 'px';
        list.style.left = this.eleInfo.position.video_list.left + 'px';
        list.style.width = this.eleInfo.video_list_size.width + 'px';
        list.style.height = this.eleInfo.video_list_size.height +'px';

        var eleLayout = G('video-list').children;

        for(var i=0;i<eleLayout.length;i++){
            eleLayout[i].style.marginTop = this.eleInfo.video_list_item_margin.margintop +'px';
            eleLayout[i].style.marginLeft = this.eleInfo.video_list_item_margin.marginleft +'px';
            eleLayout[i].style.marginBottom= this.eleInfo.video_list_item_margin.marginbottom +'px';
            eleLayout[i].style.marginRight = this.eleInfo.video_list_item_margin.marginright +'px';

            if(RenderParam.platformType === 'sd'){
                eleLayout[i].style.width = this.eleInfo.size.video_list_item.width +'px';
                eleLayout[i].style.height = this.eleInfo.size.video_list_item.height  +'px';
            }
        }

    },

    makeUrl: function (fileUrl) {
        return RenderParam.resourceUrl + fileUrl;
    },

    parseTemplate: function () {
        var templateInfo = null;
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
    },

    renderAlbumHtml: function () {
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
    },

    initAlbumButtons: function () {
        // 初始化返回按钮
        LMAlbum.initBackButton();
        // 初始化视频焦点按钮
        LMAlbum.initVideoButton();
        // 初始化订购弹窗
        //LMAlbum.initPurchaseDialog();
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
                beforeMoveChange: LMAlbum.backMoveChange,
                click: LMAlbum.onClickBackListener,
                Obj: LMAlbum
            }
        )
    },

    backMoveChange: function (dir) {
        if (dir === 'down' && !LMAlbum.hasSmallVideo) {
            if (LMAlbum.videoRenderType === LMAlbum.videoRender.card) {
                setTimeout(function () {
                    LMEPG.BM.requestFocus(LMAlbum.leavePosition)
                }, 50)
            }
        }
    },

    initViewMore: function () {
        G(LMAlbum.viewMoreId).src = LMAlbum.viewMoreImage;
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
                beforeMoveChange: LMAlbum.backMoveChange,
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
        G(LMAlbum.smallVideoId).src = LMAlbum.smallVideoImage;
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
                beforeMoveChange: LMAlbum.leaveSmallVideoChang,
                click: LMAlbum.onClickSmallVideoListener,
                index: LMAlbum.smallVideoIndex,
                Obj: LMAlbum
            }
        );
    },
    leaveSmallVideoChang: function (dir) {
        if (dir === 'down') {
            if (LMAlbum.videoRenderType === LMAlbum.videoRender.card) {
                setTimeout(function () {
                    LMEPG.BM.requestFocus(LMAlbum.leavePosition)
                })
            }

        }
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

        if (LMAlbum.videoRenderType === LMAlbum.videoRender.card) {
            LMAlbum.showVideoLength = LMAlbum.videoInfoList.length
        }

        if((LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleHorizontal || LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleVertical) && RenderParam.nowData){
            LMAlbum.showVideoList = JSON.parse(RenderParam.nowData.replace(/&quot;/g, "\"")).data

        }else {
            LMAlbum.showVideoList = LMAlbum.videoList.slice(LMAlbum.firstVideoIndex, LMAlbum.showVideoLength + LMAlbum.firstVideoIndex);

        }

        LMAlbum.lastVideoId = 'video-' + LMAlbum.showVideoLength;

    },

    renderVideoList: function () {
        var videoListHtml = '';
        var focusNum = null;
        if (RenderParam.focusId !== 'focus-1-1' && RenderParam.focusId !== 'small-video') {
            focusNum = parseInt(RenderParam.focusId.substr(6))
        }

        var len = (LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleVertical || LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleHorizontal)?
            LMAlbum.showVideoList.length:LMAlbum.showVideoLength;

        for (var videoIndex = 0; videoIndex < len; videoIndex++) {

            var videoInfo = LMAlbum.showVideoList[videoIndex];

            if (LMAlbum.videoRenderType === LMAlbum.videoRender.card) {

                LMAlbum.maxLeft = videoIndex * 365;
                var index = focusNum ? Math.abs(focusNum - 2) % LMAlbum.showVideoLength : videoIndex
                if ((focusNum - 2 < 0) && RenderParam.focusId !== 'focus-1-1' && RenderParam.focusId !== 'small-video') {
                    index = LMAlbum.showVideoLength - 1;
                }

                if (RenderParam.focusId !== 'focus-1-1' && RenderParam.focusId !== 'small-video') {
                    videoInfo = LMAlbum.showVideoList[focusNum === 1 ? 6 : (focusNum - 2) % LMAlbum.showVideoLength];
                    focusNum++
                }

                videoListHtml += '<img style="left: ' + (videoIndex * 365) + 'px" id="video-' + (index + 1) + '" src="' + videoInfo.videoImage + '" data-v="' + videoInfo.videoIndex + '" data-f="' + videoInfo.videoFocusImage + '" data-b="' + videoInfo.videoImage + '"/>';
            } else {
                videoListHtml += '<img id="video-' + (videoIndex + 1) + '" src="' + videoInfo.videoImage + '" data-v="' + videoInfo.videoIndex + '" data-f="' + videoInfo.videoFocusImage + '" data-b="' + videoInfo.videoImage + '"/>';
            }

        }
        G('video-list').innerHTML = videoListHtml;


        var eleLayout = G('video-list').children;

        for(var i=0;i<eleLayout.length;i++){
            eleLayout[i].style.marginTop = this.eleInfo.video_list_item_margin.margintop +'px';
            eleLayout[i].style.marginLeft = this.eleInfo.video_list_item_margin.marginleft +'px';
            eleLayout[i].style.marginBottom= this.eleInfo.video_list_item_margin.marginbottom +'px';
            eleLayout[i].style.marginRight = this.eleInfo.video_list_item_margin.marginright +'px';

            if(RenderParam.platformType === 'sd'){
                eleLayout[i].style.width = this.eleInfo.size.video_list_item.width +'px';
                eleLayout[i].style.height = this.eleInfo.size.video_list_item.height  +'px';
            }
        }
    },


    /**
     * 初始化视频列表按钮
     */
    initVideoButton: function () {

        for (var videoBtnIndex = 1; videoBtnIndex <= LMAlbum.showVideoLength; videoBtnIndex++) {
            var videoInfo = LMAlbum.showVideoList[videoBtnIndex - 1];

            if (LMAlbum.videoLayout == LMAlbum.LayoutDirection.Horizontal) {
                if (LMAlbum.videoRenderType === LMAlbum.videoRender.card) {
                    if (videoBtnIndex >= 1) {
                        if (videoBtnIndex === 1) {
                            LMAlbum.videoMoveConfig.left = 'video-' + LMAlbum.showVideoLength;
                        } else {
                            LMAlbum.videoMoveConfig.left = 'video-' + (videoBtnIndex - 1);
                        }

                    }

                    if (videoBtnIndex <= LMAlbum.showVideoLength) {
                        if (videoBtnIndex === LMAlbum.showVideoLength) {
                            LMAlbum.videoMoveConfig.right = 'video-1';
                        } else {
                            LMAlbum.videoMoveConfig.right = 'video-' + (videoBtnIndex + 1);
                        }
                    }

                } else {
                    if (videoBtnIndex > 1) {
                        LMAlbum.videoMoveConfig.left = 'video-' + (videoBtnIndex - 1);
                    }

                    if (videoBtnIndex < LMAlbum.showVideoLength) {
                        LMAlbum.videoMoveConfig.right = 'video-' + (videoBtnIndex + 1);
                    }
                }

            } else if (LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleVertical) {
                LMAlbum.videoMoveConfig.down = 'video-' + (videoBtnIndex + 2);

                if (videoBtnIndex >=3) {
                    LMAlbum.videoMoveConfig.up = 'video-' + (videoBtnIndex - 2);
                }

                if (videoBtnIndex % 2 === 0) {
                    LMAlbum.videoMoveConfig.left = 'video-' + (videoBtnIndex - 1);
                    LMAlbum.videoMoveConfig.right = LMAlbum.eleInfo.focus_cfg.video_list.focus_right
                }else {
                    LMAlbum.videoMoveConfig.right = 'video-' + (videoBtnIndex + 1);
                    LMAlbum.videoMoveConfig.left = LMAlbum.eleInfo.focus_cfg.video_list.focus_left
                }

            } else if(LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleHorizontal){

                LMAlbum.videoMoveConfig.down = 'video-' + (videoBtnIndex + Math.ceil(LMAlbum.showVideoLength/2));

                if(videoBtnIndex <= LMAlbum.showVideoLength / 2){
                    LMAlbum.videoMoveConfig.up = LMAlbum.eleInfo.focus_cfg.video_list.focus_up;
                }else {
                    LMAlbum.videoMoveConfig.up = 'video-' + ( videoBtnIndex - Math.ceil(LMAlbum.showVideoLength/2));
                }

                if(videoBtnIndex > LMAlbum.showVideoLength / 2){
                    LMAlbum.videoMoveConfig.down = LMAlbum.eleInfo.focus_cfg.video_list.focus_down;
                }else {
                    LMAlbum.videoMoveConfig.down = 'video-' + (videoBtnIndex + Math.ceil(LMAlbum.showVideoLength/2));
                }

                LMAlbum.videoMoveConfig.right = 'video-' + (videoBtnIndex + 1);
                LMAlbum.videoMoveConfig.left= 'video-' + (videoBtnIndex - 1);

            } else{
                if (videoBtnIndex > 0) {
                    LMAlbum.videoMoveConfig.up = 'video-' + (videoBtnIndex - 1);
                }

                if (videoBtnIndex < LMAlbum.showVideoLength) {
                    LMAlbum.videoMoveConfig.down = 'video-' + (videoBtnIndex + 1);
                }
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
                    backgroundImage: videoInfo?videoInfo.videoImage:''  ,
                    focusImage: videoInfo?videoInfo.videoFocusImage:''  ,
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

        if((LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleHorizontal || LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleVertical) && RenderParam.nowData){
            var list = JSON.parse(RenderParam.nowData.replace(/&quot;/g, "\"")).data
            var max = 0
            var min = list[0].videoIndex

            list.forEach(function (item) {
                max = Math.max(max,item.videoIndex)
            })

            if(min === 0){
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowNext);
            }else if(max === LMAlbum.videoInfoList.length-1){
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowPrev);
            }else {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowAll);
            }


        }else {
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
        }

    },

    onVideoFocus: function (btn, hasFocus) {
        var btnObj = G(btn.id);
        if (hasFocus) {
            G('debug').innerHTML = '.'; // 标清防止焦点丢失
            btnObj.src = btnObj.getAttribute('data-f');//获取焦点
            if (LMAlbum.videoRenderType === LMAlbum.videoRender.card) {
                btnObj.style.zIndex = '3'
            }
        } else {
            G('debug').innerHTML = '';
            btnObj.src = btnObj.getAttribute('data-b');//失去取焦点
            if (LMAlbum.videoRenderType === LMAlbum.videoRender.card) {
                btnObj.style.zIndex = '1'
            }
        }
    },

    beforeVideoMoveChange: function (direction, btn) {
        LMAlbum.leavePosition = btn.id
        if (LMAlbum.videoLayout === LMAlbum.LayoutDirection.Horizontal || LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleHorizontal) {
            switch (direction) {
                case "right":
                    return LMAlbum.toggleNextVideo(btn);
                case "left":
                    return LMAlbum.togglePrevVideo(btn);
            }
        }else if(LMAlbum.videoLayout === LMAlbum.LayoutDirection.Vertical || LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleVertical){
            switch (direction) {
                case "down":
                    return LMAlbum.toggleNextVideo(btn,direction);
                case "up":
                    return LMAlbum.togglePrevVideo(btn);
            }
        }

        if(LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleHorizontal && (direction === 'down')){
            if(!G(btn.nextFocusDown)){
                setTimeout(function () {
                    LMEPG.BM.requestFocus('video-'+LMAlbum.showVideoList.length)
                },10)

            }
        }
    },

    toggleNextVideo: function (btn,dir) {
        if (LMAlbum.videoRenderType === LMAlbum.videoRender.card) {

            LMAlbum.moveFlag++
            var videoListHtml = ''

            for (var videoIndex = 0; videoIndex < LMAlbum.showVideoLength; videoIndex++) {
                var videoInfo = LMAlbum.showVideoList[(videoIndex + LMAlbum.moveFlag) % LMAlbum.showVideoLength];
                videoListHtml += '<img style="left: ' + (videoIndex * 365) + 'px" id="video-' + ((videoIndex + LMAlbum.moveFlag) % LMAlbum.showVideoLength + 1) + '" src="' + videoInfo.videoImage + '" data-v="' + videoInfo.videoIndex + '" data-f="' + videoInfo.videoFocusImage + '" data-b="' + videoInfo.videoImage + '"/>';
            }

            G('video-list').innerHTML = videoListHtml

            LMEPG.BM.addButtons(LMAlbum.buttons)

        } else {
            var curId = LMEPG.BM.getCurrentButton().id
            var videoIndex = parseInt(G(curId).getAttribute('data-v'));

            if( LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleVertical){
                if (curId === 'video-' + LMAlbum.showVideoLength || curId === 'video-' + (LMAlbum.showVideoLength - 1)) {
                    LMAlbum.renderDoubleNextVideo(videoIndex, curId)
                } else {

                    var index = 0
                    for(var i=0; i<LMAlbum.showVideoList.length; i++){
                        if(LMAlbum.showVideoList[i].videoIndex === videoIndex){
                            index = i
                            break
                        }
                    }

                    var len = LMAlbum.showVideoList.length

                    if (len % 2 !== 0 && index < len - 1) {
                        if (!G(btn.nextFocusDown)) {
                            setTimeout(function () {
                                LMEPG.BM.requestFocus('video-' + LMAlbum.showVideoList.length)
                            }, 10)
                        }
                    }
                }
            }else if(LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleHorizontal){
                if(curId === 'video-' + LMAlbum.showVideoLength || curId === 'video-' + (Math.ceil(LMAlbum.showVideoLength/2))){
                    LMAlbum.renderDoubleHNextVideo(videoIndex,curId)
                }
            }else {
                if (btn.id == 'video-' + LMAlbum.showVideoLength) {
                    videoIndex = parseInt(G(btn.id).getAttribute('data-v'));
                    return LMAlbum.renderNextVideo(videoIndex);
                }
            }

        }

    },

    togglePrevVideo: function (btn) {
        if (LMAlbum.videoRenderType === LMAlbum.videoRender.card) {
            LMAlbum.moveFlag--;

            if (LMAlbum.moveFlag < 0) {
                LMAlbum.moveFlag = LMAlbum.showVideoLength - 1;
            }
            var videoListHtml = ''

            for (var videoIndex = 0; videoIndex < LMAlbum.showVideoLength; videoIndex++) {
                var videoInfo = LMAlbum.showVideoList[(videoIndex + LMAlbum.moveFlag) % LMAlbum.showVideoLength];
                videoListHtml += '<img style="left: ' + (videoIndex * 365) + 'px" id="video-' + ((videoIndex + LMAlbum.moveFlag) % LMAlbum.showVideoLength + 1) + '" src="' + videoInfo.videoImage + '" data-v="' + videoInfo.videoIndex + '" data-f="' + videoInfo.videoFocusImage + '" data-b="' + videoInfo.videoImage + '"/>';
            }
            G('video-list').innerHTML = videoListHtml
            LMEPG.BM.addButtons(LMAlbum.buttons)

        } else {
            var curId = LMEPG.BM.getCurrentButton().id
            var videoIndex = parseInt(G(curId).getAttribute('data-v'));
            if (LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleVertical) {
                var curId = LMEPG.BM.getCurrentButton().id
                if (curId === 'video-1' || curId === 'video-2'){
                    LMAlbum.renderDoublePrevVideo(videoIndex,curId)
                }
            }else if(LMAlbum.videoLayout === LMAlbum.LayoutDirection.DoubleHorizontal){
                if (curId === 'video-1' || curId === 'video-' + (LMAlbum.showVideoLength / 2 + 1)){
                    LMAlbum.renderDoubleHPrevVideo(videoIndex,curId)
                }
            }else {
                if (btn.id == 'video-1') {
                     videoIndex = LMAlbum.firstVideoIndex;
                    return LMAlbum.renderPrevVideo(videoIndex);
                }
            }

        }

    },

    renderNextVideo: function (videoIndex) {
        var lastVideoIndex = LMAlbum.videoList.length - 1;
        if (videoIndex == lastVideoIndex) {
            var dir  = LMAlbum.videoLayout === LMAlbum.LayoutDirection.Vertical ?
                LMAlbum.eleInfo.focus_cfg.video_list.focus_down:LMAlbum.eleInfo.focus_cfg.video_list.focus_right
            LMEPG.ButtonManager.requestFocus(dir);
            return false;
        } else {
            // 最后显示的元素
            LMAlbum.showVideoList.shift(); // 移除第一个元素
            LMAlbum.showVideoList.push(LMAlbum.videoList[videoIndex + 1]);
            LMAlbum.renderVideoList();
            LMEPG.ButtonManager.requestFocus( LMAlbum.showVideoLength ===1?'video-1':'video-' + (LMAlbum.showVideoLength - 1));

            LMAlbum.firstVideoIndex++;
            if (videoIndex == (lastVideoIndex - 1)) {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowPrev);
            } else {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowAll);
            }
        }
    },

    renderDoubleNextVideo:function(videoIndex,id){
        var lastVideoIndex = LMAlbum.videoList.length;

        if (videoIndex + 2 >= lastVideoIndex) {
            LMEPG.ButtonManager.requestFocus(LMAlbum.eleInfo.focus_cfg.video_list.focus_down);
            return false;
        } else {
            // 最后显示的元素
            LMAlbum.showVideoList.shift(); // 移除第一个元素
            LMAlbum.showVideoList.shift();

            var group = parseInt(videoIndex/2) + 1
            LMAlbum.showVideoList.push(LMAlbum.videoList[group * 2]);

            if((group * 2 + 1 ) < LMAlbum.videoList.length){
                LMAlbum.showVideoList.push(LMAlbum.videoList[group * 2 + 1]);
            }

            LMAlbum.renderVideoList();
            LMEPG.ButtonManager.requestFocus(G(id)?id:'video-'+(parseInt(id.substr(6))-1));
            LMAlbum.firstVideoIndex++;

            if ((group+1) * 2 >=lastVideoIndex ) {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowPrev);
            } else {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowAll);
            }
        }
    },

    renderDoubleHNextVideo:function(videoIndex,id){
        var lastVideoIndex = LMAlbum.videoList.length;

        if  (this.showVideoLength+(LMAlbum.firstVideoIndex*2) >= lastVideoIndex) {
            LMEPG.ButtonManager.requestFocus(LMAlbum.eleInfo.focus_cfg.video_list.focus_right);
            return false;
        } else {
            // 最后显示的元素
            LMAlbum.showVideoList.splice(LMAlbum.showVideoLength/2,1);
            LMAlbum.showVideoList.splice(0,1); // 移除第一个元素

            LMAlbum.showVideoList.splice((LMAlbum.showVideoLength / 2 - 1),0,LMAlbum.videoList[this.showVideoLength+(LMAlbum.firstVideoIndex*2)])

            if(this.showVideoLength+(LMAlbum.firstVideoIndex*2)+1 < LMAlbum.videoList.length){
                LMAlbum.showVideoList.push(LMAlbum.videoList[this.showVideoLength+(LMAlbum.firstVideoIndex*2)+1])
           }

            LMAlbum.firstVideoIndex++;
            LMAlbum.renderVideoList();

            setTimeout(function () {
                LMEPG.ButtonManager.requestFocus(G(id)?id:'video-'+(parseInt(id.substr(6))-1))
            })

            if (this.showVideoLength+(LMAlbum.firstVideoIndex*2) >= lastVideoIndex) {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowPrev);
            } else {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowAll);
            }
        }
    },

    renderDoublePrevVideo:function(videoIndex,id){
        if (videoIndex === 0 || videoIndex === 1) {
            setTimeout(function () {
                LMEPG.ButtonManager.requestFocus(LMAlbum.eleInfo.focus_cfg.video_list.focus_up);
            },10)

        } else {

            if(LMAlbum.showVideoList.length % 2 === 0){
                LMAlbum.showVideoList.pop();
                LMAlbum.showVideoList.pop();
            }else {
                LMAlbum.showVideoList.pop()
            }

            var group = (parseInt(videoIndex / 2) - 1)* 2
            LMAlbum.showVideoList.unshift(LMAlbum.videoList[group+1]);
            LMAlbum.showVideoList.unshift(LMAlbum.videoList[group]);
            LMAlbum.renderVideoList();

            setTimeout(function () {
                LMEPG.ButtonManager.requestFocus(id);
            },50)


            LMAlbum.firstVideoIndex--;
            if (videoIndex-2 === 0 || videoIndex-2 === 1) {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowNext);
            } else {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowAll);
            }
        }
    },

    renderDoubleHPrevVideo:function(videoIndex,id){
        if (videoIndex === 0 || videoIndex === LMAlbum.showVideoLength / 2) {
            setTimeout(function () {
                LMEPG.ButtonManager.requestFocus(LMAlbum.eleInfo.focus_cfg.video_list.focus_left || id);
            })

        } else {

            if(LMAlbum.showVideoList.length % 2 === 0){
                LMAlbum.showVideoList.splice((LMAlbum.showVideoLength / 2 - 1),1);
                LMAlbum.showVideoList.pop();
            }else {
                LMAlbum.showVideoList.splice((LMAlbum.showVideoLength / 2 - 1),1);
            }

            LMAlbum.firstVideoIndex--;
            var dex1 ;
            var dex2 ;

            if( LMAlbum.firstVideoIndex<=LMAlbum.showVideoLength / 2 - 1){
                dex1 = LMAlbum.firstVideoIndex
                dex2 = LMAlbum.firstVideoIndex+LMAlbum.showVideoLength / 2
            }else {
                dex1 =  LMAlbum.firstVideoIndex * 2
                dex2 = dex1+1
            }
            LMAlbum.showVideoList.splice(0,0,LMAlbum.videoList[dex1]);
            LMAlbum.showVideoList.splice(LMAlbum.showVideoLength / 2,0,LMAlbum.videoList[dex2])


            LMAlbum.renderVideoList();
            setTimeout(function () {
                LMEPG.ButtonManager.requestFocus(id);
            },10)


            if (videoIndex === 1 || videoIndex === LMAlbum.showVideoLength / 2 + 1) {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowNext);
            } else {
                LMAlbum.showVideoArrow(LMAlbum.ArrowStatus.ShowAll);
            }

        }

    },

    renderPrevVideo: function (videoIndex) {
        if (videoIndex == 0) {
            var dir  = LMAlbum.videoLayout === LMAlbum.LayoutDirection.Vertical ?
                LMAlbum.eleInfo.focus_cfg.video_list.focus_up:LMAlbum.eleInfo.focus_cfg.video_list.focus_left

            LMEPG.ButtonManager.requestFocus(dir);
        } else {
            // 最后显示的元素
            LMAlbum.showVideoList.pop(); // 移除最后一个元素
            LMAlbum.showVideoList.unshift(LMAlbum.videoList[videoIndex - 1]);
            LMAlbum.renderVideoList();
            setTimeout(function () {
                LMEPG.ButtonManager.requestFocus('video-1');
            },10)

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
        if (RenderParam.lmcid == '450092') { //广西电信局方推荐位退出返回至主页
            LMAlbum.jumpHomeTab('home');
        } else {
            LMAlbum.commonBack();
        }
    },


    commonBack: function () {

        if (RenderParam.lmcid == '450094' && RenderParam.inner != 1) {
            // 广西广电局方大厅进入返回逻辑
            var albumHistoryLength = history.length;
            if (albumHistoryLength == RenderParam.splashHistory) {
                albumHistoryLength++;
            }
            var backLength = albumHistoryLength + 1 - RenderParam.splashHistory;
            history.go(-backLength);
            return;
        }

        // 广东广电， 江门特殊返回
        if (RenderParam.lmcid === '440004' && RenderParam.lmp == '23') {
            window.location.href = 'http://172.31.145.50/smartCity/jmys/html/index2.html';
            return;
        }

        if (RenderParam.lmcid === '440004') {
            if(window.WebViewJavascriptBridge) {
                WebViewJavascriptBridge.callHandler("QuitBrowser", {'param':""}, function (_ret) {});
                return;
            }
        }

        // 广东广电， 江门特殊返回
        if (RenderParam.lmcid === '440094' && RenderParam.lmp == '26') {
            window.location.href = 'http://172.31.145.50/smartCity/jmys/html/index2.html';
            return;
        }

        if (RenderParam.lmcid === "610092") {
            if(RenderParam.fromLaunch == '1'){
                Utility.setValueByName("exitIptvApp");
            }else{
                LMEPG.Intent.back('IPTVPortal');
            }
            return;
        }

        if (RenderParam.lmcid == "630092" && RenderParam.inner == 0 && RenderParam.fromLaunch == '1') {
            Utility.setValueByName("exitIptvApp");
        } else {
            if (RenderParam.lmcid == '370092') {
                // 调用探针接口上报数据 1:进入 0：退出
                var operateParams = {
                    "action": 2,
                    "contentId": RenderParam.albumName
                };
                LMEPG.ajax.postAPI("System/clickContentInfo", operateParams, function () {
                    LMEPG.Intent.back();
                }, function () {
                    LMEPG.Intent.back();
                });
            }
        }
        if(LMAlbum.eleInfo.page_back_type.value  === ''){
            if(RenderParam.inner == "0"){
                if ( RenderParam.isRunOnAndroid === '1') {
                    LMAndroid.JSCallAndroid.doExitApp(); // 直接退出应用
                } else {
                    LMEPG.Intent.back('IPTVPortal');
                }
            }else {
                LMEPG.Intent.back();
            }
        } else if(LMAlbum.eleInfo.page_back_type.value === '1'){
            LMEPG.Intent.back();
        } else {
            if ( RenderParam.isRunOnAndroid === '1') {
                LMAndroid.JSCallAndroid.doExitApp(); // 直接退出应用
            } else {
                LMEPG.Intent.back('IPTVPortal');
            }
        }
    },

    jumpMenuPage: function () {

        var objCurrent = LMAlbum.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("menuTab");
        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    jumpVideoPage: function (btn) {
        var objCurrent = LMEPG.Intent.createIntent('home');
        objCurrent.setParam('focusId', btn.id);
        objCurrent.setParam('tabId', "tab-2");
        // 通过点击对象id,设置跳转页面对象
        var jumpAgreementObj = LMEPG.Intent.createIntent('channelIndex');
        jumpAgreementObj.setParam('modelType', LMAlbum.viewMoreModeType);
        jumpAgreementObj.setParam('modelName', "更多精彩");
        LMEPG.Intent.jump(jumpAgreementObj, objCurrent);
    },

    jumpMorePageJILin:function(){
        var objCurrent = LMAlbum.getCurrentPage();

        var jumpAgreementObj = LMEPG.Intent.createIntent('healthVideoList');
        jumpAgreementObj.setParam('userId', RenderParam.userId);
        jumpAgreementObj.setParam('page', '1');
        jumpAgreementObj.setParam('modeTitle',RenderParam.lmcid === '10220094'?'精选大全':'中医养生');
        jumpAgreementObj.setParam('modelType', RenderParam.lmcid === '10220094'?'1':'8');
        LMEPG.Intent.jump(jumpAgreementObj, objCurrent);
    },


    onClickViewMoreListener: function (btn) {
        if (RenderParam.lmcid == "630092") {
            LMAlbum.jumpMenuPage();
            return;
        }
        if (RenderParam.lmcid == "640092") {
            LMEPG.Intent.back();
            return;
        }
        if (RenderParam.lmcid == "500092") {
            LMAlbum.jumpVideoPage(btn);
            return;
        }
        if (RenderParam.lmcid == "620092" && RenderParam.albumName == 'album179') {
            LMAlbum.jumpHomeTab();
            return;
        }

        if(RenderParam.lmcid === '440004'){
            LMEPG.Intent.back();
            return;
        }

        if(RenderParam.lmcid === '10220095' || RenderParam.lmcid === '10220094' ){
            LMAlbum.focusId = btn.id;
            LMAlbum.jumpMorePageJILin()
            return;
        }

        if (RenderParam.lmcid == "371092" || RenderParam.lmcid == "371002") {
            //统计探针
            var clickId = "39JK-Special-" + RenderParam.albumName + "-More";
            var turnPageInfo = {
                currentPage: location.href,
                turnPage: document.referrer,
                turnPageName: document.title,
                turnPageId: "",
                clickId: clickId
            };
            ShanDongHaiKan.sendReportData('6', turnPageInfo);
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
        objMoreVideo.setParam('tabId', "tab-2");  // 导航焦点
        if (RenderParam.lmcid === '220001') { //吉林移动是瀑布流的版本
            objMoreVideo.setParam('focusId', "sift-2");  // 设置返回的焦点
        }
        if (RenderParam.lmcid === '630001') { // 青海移动apk
            var pageIndex630001 = 4;
            objMoreVideo.setParam("pageIndex", pageIndex630001);  // 指定跳转的二级导航页面标识指向健康百科
        }

        if (RenderParam.lmcid == "07430093") {
            var objBack = LMEPG.Intent.createIntent("album");
            objBack.setParam("userId", RenderParam.userId);
            objBack.setParam("albumName", RenderParam.albumName);
            objBack.setParam("inner", RenderParam.inner);
        } else {
            var objBack = LMEPG.Intent.createIntent(LMAlbum.viewMoreBackPage);
        }
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
        LMAlbum.smallVideoInfo.user_type = 0; // 小窗口视频免费播放
        LMAlbum.parseVideoInfo(LMAlbum.smallVideoInfo);
    },

    onClickVideoListener: function (btn) {
        LMAlbum.focusId = btn.id;
        var videoIndex = G(btn.id).getAttribute('data-v');
        var videoInfo = LMAlbum.videoInfoList[videoIndex];
        //下线视频处理
        if (videoInfo['show_status'] == "3") {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }
        LMAlbum.parseVideoInfo(videoInfo);
    },

    parseVideoInfo: function (videoInfo) {
        try {
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

    doBeforePlayVideo: function () { // 视频播放前操作
    },

    playVideo: function (videoParams) {
        LMAlbum.doBeforePlayVideo();
        var objCurrent = LMAlbum.getCurrentPage();
        objCurrent.setParam('fromId', 2);
        objCurrent.setParam('videoTitle', videoParams.title);
        objCurrent.setParam('isVideoFree', RenderParam.isVideoFree);
        // if(RenderParam.lmcid == '630092' && RenderParam.inner == 0 && RenderParam.fromLaunch == '1' ){
        //     // 青海电信 专辑播放视频增加传参,监听播放视频结束返回
        //     objCurrent.setParam('isQHDXPlay', 'QHDXPlay');
        // }
        if (RenderParam.userId == '3526989') {
            objCurrent.setParam('isQHDXPlay', 'QHDXPlay');
        }

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
        objCurrent.setParam('nowData',JSON.stringify({data:LMAlbum.showVideoList}))
        return objCurrent;
    },

    jumpHomeTab: function () {
        var objHomeTab = LMEPG.Intent.createIntent('home');
        objHomeTab.setParam('classifyId', '');
        LMEPG.Intent.jump(objHomeTab);
    },

    purchaseVIP: function () {
        if (RenderParam.lmcid == '630092') {
            //数据探针上报  用户订购行为探针
            var dataRP = {
                userId: RenderParam.userId,
                pageKey: window.location.pathname,
                pageType: 'topicPage',
                actionType: 'bc',
                mediaCode: RenderParam.albumName,
                mediaName: document.title,
                btnName: '立即订购',
            }
            DataReport.getValue(4, dataRP);
        }
        ;
        // var self = btn.id;
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
            if (RenderParam.lmcid == '640092') {
                LMAlbum.purchaseVIP({"id": "video-1"});
            } else {
                // 普通用户观看免费时长结束，弹出计费页
                if (LMAlbum.isShowOrder) {
                    LMAlbum.showDialog('purchase-dialog');
                } else {
                    LMAlbum.purchaseVIP(); //直接去计费页
                }
                LMEPG.ButtonManager.requestFocus('btn-purchase');
            }
        }
    },

    storeVideoInfo: function (obj, videoParams) {
        var postData = {'videoInfo': JSON.stringify(videoParams)};
        LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
            if (data.result != 0) {
                G('debug').innerText = '系统报错!';
            } else {
                LMAlbum.purchaseVIP();
            }
        });
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
    },

    /**
     * 重新设置分辨率，河南有盒子会出现页面放大情况，原因是高清盒子使用了标清页面
     */
    setPageSize: function () {
        var meta = document.getElementsByTagName('meta');
        //LMEPG.Log.error("task::setPageSize ---> meta" + meta);
        if (typeof meta !== "undefined") {
            try {
                if (RenderParam.platformType == "hd") {
                    meta["page-view-size"].setAttribute('content', "1280*720");
                } else {
                    meta["page-view-size"].setAttribute('content', "640*530");
                }
            } catch (e) {

            }
        }
        setTimeout(LMAlbum.setPageSize, 500);
    }
};

window.onunload = function () {
    switch (RenderParam.lmcid) {
        case '640094': // 宁夏广电EPG,停止小窗播放
            ottService.stopTrailer();
            break;
    }
};

// 结束声明命名空间LMEPG后，引入业务扩展js
try {
    console.debug('LMAlbum.js g_appRootPath=' + g_appRootPath);
    document.writeln('<script type="text/javascript" src="' + g_appRootPath + '/Public/js/Pay/lmOrderConf.js"></script>');
} catch (e) {
    console.error('LMAlbum.js includes JS-Files error:' + e.toString());
}

var Util = {
    getStyleValue: function (str) {
        return parseInt(str.substring(0, str.indexOf('p')))
    },
}
