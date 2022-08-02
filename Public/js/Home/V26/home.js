// 推荐位入口类型
var HomeEntryType = {
    VIDEO_VISIT_BY_DEPART: 1, //视频问诊-科室
    VIDEO_VISIT_BY_DOCTOR: 2, //视频问诊-医生
    ACTIVITYS: 3,   //活动
    HEALTH_VIDEO_BY_TYPES: 4, //健康视频分类
    HEALTH_VIDEO: 5,  //健康视频
    DEVICE_STORES: 6,//设备商城
    DEVICE_STORES_BY_ID: 7,//设备商城商品
    HOME_PAGE: 8,//首页
    VIDEO_VISIT_HOME: 9,//视频问诊
    DOCTOR_CONSULTATION_HOME: 10,//名医会诊
    MY_FIMILY_HOME: 11,//我的家
    HEALTH_VIDEO_HOME: 12,//健康视频首页
    HEALTH_VIDEO_SUBJECT: 13,//健康视频专题
    GUAHAO_HOME: 14,//预约挂号
    GUAHAO_BY_HOSP: 15,//预约挂号-医院
    USER_GUIDE: 16,//使用指南
    HEALTH_MEASURE: 17,//健康检测
    SEARCH: 18,//搜索
    EXPERT_CONSULTATION: 19,//专家约诊
    EXPERT_CONSULTATION_REMIND: 20, //专家约诊消息提醒
    THIRD_PARTY_URL: 22,            //跳转第三方应用
    HEALTH_VIDEO_SET: 34,  //视频集
    HEALTH_GRAPHIC_SUBJECT: 39,//健康图文专题
    ALBUM_GRAPHIC: 39,// 专辑 - 图文
    GRAPHIC_DETAIL: 43, // 图文
    JUMP_APK: 47,  // 跳转APK
    EPIDEMIC: 48,  // 健康时播
    SELF_TEST_CLASSIFY: 51,  // 健康自测-分类
    SELF_TEST_DETAILS: 52,  // 健康自测-项目
};

// 轮播数组
var carouselDataList0;
var carouselDataList1;
// Tab1热播榜数组
var videoRankList = RenderParam.videoPlayRank.list;
// Tab1视频栏目
var videoClassList = RenderParam.videoClass.data;
// Tab2专辑列表
var albumList = RenderParam.albumList.list;

// Tab0轮播推荐位当前显示的数据id
var curTab0CarouselId = 0;
// Tab1轮播推荐位当前显示的数据id
var curTab1CarouselId = 0;
// Tab2轮播推荐位当前显示的数据数组下标id
var curTab2CarouselId = 2;

/**
 * ===============================处理页面数据===============================
 */
var Page = {
    tabId: "tab-0",
    /**
     * 初始化
     */
    init: function () {
        this.tabId = LMEPG.Func.getLocationString('tabId') || 'tab-0';
        var focusId = LMEPG.Func.getLocationString('focusId');
        if (this.tabId == "tab-0") {
            G("scroll").style.transition = "top 0.5s"
        }
        this.initAllPages();
        showTabContent(this.tabId);
        LMEPG.ButtonManager.init("video-TV", buttons, '', true);
        // 焦点恢复（如果非VIP点击“加入会员”按钮订购，变成VIP后，此按钮会隐藏，焦点需改变）
        if (focusId == 'join-vip' && LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            focusId = 'tab-3';
        }
        LMEPG.BM.requestFocus(focusId);
        this.uiProcessByCarrierId();
    },

    initAllPages: function () {
        Tab0.init();
        Tab1.init();
        Tab2.init();
        Tab3.init();
        LMEPG.ButtonManager.init(this.tabId, buttons, '', true);
    },


    /**
     * 改变推荐位左上角图标
     * @param data 推荐位数组数据
     * @param eleId 角标id
     * @param isShowIcon  是否显示默认图标，默认图标是icon_hot.png true:显示  false：不显示
     */
    changeRecommendPosIcon: function (data, eleId, isShowIcon) {
        if (RenderParam.isVip != 1 && JSON.parse(data.item_data[0].inner_parameters).user_type == '1') {
            if (isShowIcon) {
                G(eleId).src = g_appRootPath + "/Public/img/HomePage/V13/home/icon_hot.png";
            }
        } else if (RenderParam.isVip != 1 && JSON.parse(data.item_data[0].inner_parameters).user_type == '2') {

            if (isShowIcon) {
                G(eleId).src = g_appRootPath + "/Public/img/HomePage/V13/home/vip_icon.png";
            } else {
                G(eleId).style.display = "block";
                G(eleId).src = g_appRootPath + "/Public/img/HomePage/V13/home/vip_icon.png";
            }
        } else if (RenderParam.isVip != 1 && JSON.parse(data.item_data[0].inner_parameters).user_type == '0') {
            if (isShowIcon) {
                G(eleId).src = g_appRootPath + "/Public/img/HomePage/V13/home/icon_hot.png";
            }
        } else if (RenderParam.isVip == 1) {
            if (isShowIcon) {
                G(eleId).src = g_appRootPath + "/Public/img/HomePage/V13/home/icon_hot.png";
            }
        }

    },


    /**
     * 推荐位点击事件
     * @param btn
     */
    onClickRecommendPosition: function (btn) {
        var pos = btn.cPosition;
        // 小窗视频（tab0 二号位）
        if (pos == 12 && !Tab0.isHideSmallVideo) {
            // 跳转全屏播放页面
            Play.clickSmartPlay(btn);
            return;
        }
        // 其他推荐位
        var entryItem = Page.getRecommendDataByPosition(pos);
        var index = 0; // 一个推荐位可能有多条数据，一般为1条。多条的特殊处理，index表示数组下标
        if (pos == 14) {
            index = curTab0CarouselId;
        } // Tab0的轮播
        if (pos == 21) {
            index = curTab1CarouselId;
        } // Tab1的轮播
        if (pos == 16) {
            index = parseInt(btn.id.substr(7, 1));
        }
        var itemData = entryItem.item_data[index];
        switch (parseInt(itemData.entry_type)) {
            case HomeEntryType.VIDEO_VISIT_BY_DEPART:
                //视频问诊-科室
                break;
            case HomeEntryType.VIDEO_VISIT_BY_DOCTOR:
                //视频问诊-医生
                break;
            case HomeEntryType.ACTIVITYS:
                // 活动
                PageJump.jumpActivityPage(JSON.parse(itemData.parameters)[0].param, btn);
                break;
            case HomeEntryType.HEALTH_VIDEO_BY_TYPES:
                // 更多视频
                PageJump.onClickJumpLevel2Page(JSON.parse(itemData.parameters)[0].param, '');
                break;
            case HomeEntryType.HEALTH_VIDEO:
                // 视频播放
                var videoData = JSON.parse(itemData.inner_parameters);
                var play_url = videoData.ftp_url;
                var videoObj = play_url instanceof Object ? play_url : JSON.parse(play_url);
                var videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

                // 创建视频信息
                var videoInfo = {
                    'sourceId': JSON.parse(itemData.parameters)[0].param,
                    'videoUrl': videoUrl,
                    'title': videoData.title,
                    'type': videoData.model_type,
                    'userType': videoData.user_type,
                    'freeSeconds': videoData.free_seconds,
                    'entryType': 1,
                    'entryTypeName': 'home',
                    'focusIdx': btn.id,
                    'unionCode': videoData.union_code,
                    'showStatus': videoData.show_status
                };

                //视频专辑下线处理
                if (videoInfo.showStatus == "3") {
                    LMEPG.UI.showToast('该节目已下线');
                    return;
                }

                if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                    PageJump.jumpPlayVideo(videoInfo);
                } else {
                    PageJump.jumpBuyVip(videoInfo.title, videoInfo);
                }
                break;
            case HomeEntryType.DEVICE_STORES:
                //设备商城
                break;
            case HomeEntryType.DEVICE_STORES_BY_ID:
                //设备商城商品
                break;
            case HomeEntryType.HOME_PAGE:
                //首页
                break;
            case HomeEntryType.VIDEO_VISIT_HOME:
                //视频问诊
                PageJump.jumpVideoVisitHome(btn);
                break;
            case HomeEntryType.HEALTH_VIDEO_SUBJECT:
            case HomeEntryType.HEALTH_GRAPHIC_SUBJECT:
            case HomeEntryType.ALBUM_GRAPHIC:
                // 专辑
                typeof LMTrace !== "undefined" && LMTrace.click(LMTrace.ID.clickId.picture);
                PageJump.jumpAlbumPage(JSON.parse(itemData.parameters)[0].param, btn);
                break;
            case HomeEntryType.GUAHAO_HOME:
                // 挂号主页
                PageJump.jumpGuaHaoPage();
                break;
            case HomeEntryType.GUAHAO_BY_HOSP:
                //挂号-医院
                break;
            case HomeEntryType.USER_GUIDE:
                //用户指南
                break;
            case HomeEntryType.HEALTH_MEASURE:
                //健康检测
                PageJump.jumpHealthMeasure(btn);
                break;
            case HomeEntryType.EXPERT_CONSULTATION:
                //专家约诊
                if (RenderParam.platformType == 'sd') {
                    LMEPG.UI.showToast('不支持的盒子类型！', 1.5);
                    return;
                }
                PageJump.jumpExpertConsultation(btn);
                break;
            case HomeEntryType.EXPERT_CONSULTATION_REMIND:
                //专家约诊消息提醒
                break;
            case HomeEntryType.SEARCH:
                //搜索
                break;
            case HomeEntryType.HEALTH_VIDEO_SET:
                //视频集
                Network.getAlbumIdByAlias(JSON.parse(itemData.parameters)[0].param, function (subject_id) {
                    PageJump.jumpVideoListPage(subject_id);
                });
                break;
            case HomeEntryType.THIRD_PARTY_URL:
                //跳转第三方网页
                PageJump.jumpThirdPartyUrl(JSON.parse(itemData.parameters)[0].param);
                break;
            case HomeEntryType.EPIDEMIC:
                //跳转第三方网页
                PageJump.jumpEpidemic();
                break;
            case HomeEntryType.JUMP_APK:
                //跳转APK
                console.log("Jump APK");
                PageJump.jumpAPK(JSON.parse(itemData.parameters)[1].param, JSON.parse(itemData.parameters)[0].param);
                break;
            case HomeEntryType.SELF_TEST_CLASSIFY:
                PageJump.jumpHealthSelfTestList(JSON.parse(itemData.parameters)[0].param);
                break;
            case HomeEntryType.SELF_TEST_DETAILS:
                PageJump.jumpHealthSelfTestDetail(JSON.parse(itemData.parameters)[0].param);
                break;
            case HomeEntryType.GRAPHIC_DETAIL:
                var graphicJson = JSON.parse(itemData.parameters);
                var graphicId = graphicJson[0]['param'];
                PageJump.jumpGraphicDetail(graphicId);
                break;
        }

    },

    /**
     * 点击Tab2的专辑
     */
    onClickTab2Album: function (btn) {
        PageJump.jumpAlbumPage(albumList[curTab2CarouselId].alias_name, btn);
    },

    /**
     * 点击热播视频
     * @param btn
     */
    onClickHotVideo: function (btn) {
        var videoData = videoRankList[parseInt(btn.id.substr(4, 1))];
        var play_url = videoData.ftp_url;
        var videoObj = play_url instanceof Object ? play_url : JSON.parse(play_url);
        var videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
        // 创建视频信息
        var videoInfo = {
            'sourceId': videoData.source_id,
            'videoUrl': videoUrl,
            'title': videoData.title,
            'type': videoData.model_type,
            'userType': videoData.user_type,  // user_type,0:不限制用户，1普通用户也能看，2：vip用户才能看
            'freeSeconds': videoData.free_seconds,
            'entryType': 1,
            'entryTypeName': 'home',
            'focusIdx': btn.id,
            'unionCode': videoData.union_code,
            'showStatus': videoData.show_status
        };

        //视频专辑下线处理
        if (videoInfo.showStatus == "3") {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            PageJump.jumpPlayVideo(videoInfo);
        } else {
            PageJump.jumpBuyVip();
        }
    },

    /**
     * 获取完整路径图片地址
     */
    getImg: function (relativeUrl) {
        return RenderParam.fsUrl + relativeUrl;
    },

    /**
     * 通过位置获取推荐位数据
     * @param position
     * @returns {*}
     */
    getRecommendDataByPosition: function (position) {
        var dataList = RenderParam.configInfo.data.entry_list;
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            if (data.position == position) {
                return data;
            }
        }
        return null;
    },

    /**
     * 按键事件回调
     * @param code
     */
    onKeyDown: function (code) {
        LMEPG.Log.debug('V13 ---> home.js onKeyDown code ' + code);
        switch (code) {
            case KEY_3:
                var keys = LMEPG.KeyEventManager.getKeyCodes();
                LMEPG.Log.debug('V2 ---> home.js  key_3: keys=' + keys);
                if (keys.length >= 4) {
                    if (keys[keys.length - 1] == KEY_3
                        && keys[keys.length - 2] == KEY_8
                        && keys[keys.length - 3] == KEY_9
                        && keys[keys.length - 4] == KEY_3) {
                        // 进入测试服
                        PageJump.jumpTestPage();
                    }
                }
                break;
        }
    },

    /**
     * 不同地区的UI差异化处理
     */
    uiProcessByCarrierId: function () {

    },

    back: function () {
        var isRouteHold = RenderParam.carrierId === '220001' || RenderParam.carrierId === '440004';
        if (isRouteHold) {
            PageJump.jumpHold();
        }  else {
            Hold.open();
        }
    }
};

/**
 * ===============================处理跳转===============================
 */
var PageJump = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = getCurPageObj();
        return currentPage;
    },

    /**
     * 跳转购买vip页面
     */
    jumpBuyVip: function () {
        var objCurrent = getCurPageObj();
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast('视频信息为空！');
            return;
        }

        var objHome = getCurPageObj();

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
    },

    /**
     *  跳转->专家约诊首页
     */
    jumpExpertConsultation: function (btn) {
        var objCurrent = getCurPageObj();
        var jumpObj = LMEPG.Intent.createIntent('expertIndex');
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转 -- 活动页面
     * @param activityName
     */
    jumpActivityPage: function (activityName, btn) {
        var objHome = getCurPageObj();
        var objActivity = LMEPG.Intent.createIntent('activity');
        objActivity.setParam('userId', RenderParam.userId);
        objActivity.setParam('activityName', activityName);
        objActivity.setParam('inner', 1);
        LMEPG.Intent.jump(objActivity, objHome);
    },

    /**
     * 跳转->视频问诊
     */
    jumpVideoVisitHome: function (btn) {
        typeof LMTrace !== "undefined" && LMTrace.click(LMTrace.ID.clickId.seeDoctor);
        var objCurrent = getCurPageObj();
        var jumpObj = LMEPG.Intent.createIntent('doctorIndex');
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName, btn) {
        var objHome = getCurPageObj();
        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转->健康检测
     */
    jumpHealthMeasure: function (btn) {
        var objSrc = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('testIndex');
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转继续播放
     */
    jumpContinuePlay: function () {
        if (RenderParam.latestVideoInfo.result == 0) {
            LMEPG.UI.showToast('已为您继续播放', 1, function () {
                var videoInfo = JSON.parse(RenderParam.latestVideoInfo.val);
                PageJump.jumpPlayVideo(videoInfo);
            });
        } else {
            LMEPG.UI.showToast('无未播放完的视频');
        }
    },

    /**
     * 跳转 - 挽留页
     */
    jumpHoldPage: function () {
        var objHome = getCurPageObj();
        var objHold = LMEPG.Intent.createIntent('hold');
        objHold.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objHold, objHome, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 跳转到3983测试页
     */
    jumpTestPage: function () {
        var objHome = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('testEntrySet');
        objDst.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objDst, objHome);
    },

    /**
     * 跳转到视频集
     * @param btn
     */
    jumpVideoListPage: function (subjectId) {
        var objHome = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('channelList');
        objDst.setParam('subject_id', subjectId);
        LMEPG.Intent.jump(objDst, objHome);
    },

    /*点击二级视频入口（页面的最后一行）*/
    onClickJumpLevel2Page: function (modelType, modelName) {
        typeof LMTrace !== "undefined" && LMTrace.click(LMTrace.ID.clickId.healthVideo);
        var currentObj = getCurPageObj();
        var jumpAgreementObj = LMEPG.Intent.createIntent('channelIndex');
        jumpAgreementObj.setParam('modelType', modelType);
        jumpAgreementObj.setParam('modelName', modelName);
        LMEPG.Intent.jump(jumpAgreementObj, currentObj);
    },

    /**
     * 跳转到预约挂号页
     */
    jumpGuaHaoPage: function () {
        typeof LMTrace !== "undefined" && LMTrace.click(LMTrace.ID.clickId.guaHao);
        var objCurrent = getCurPageObj();
        var objHospitalList = LMEPG.Intent.createIntent("indexStatic");
        LMEPG.Intent.jump(objHospitalList, objCurrent);
    },

    /**
     * 跳转第三方网页
     * @param url 网页地址
     */
    jumpThirdPartyUrl: function (url) {
        // 广东广电APK，此地址跳转H5替换为跳转apk（aar内部跳转三合）
        if (url == 'http://172.16.130.124:8080/TCMedicine-GDmin/') {
            LMAndroid.JSCallAndroid.doJumpUHealthAppH5('', '');
            return;
        }
        // 美人技/名老中医
        else if (url == 'http://172.16.147.80:8080/index.jsp?origin_type=1&lcn=apk_mrj' || url == 'http://172.16.130.102:8081/TCMedicine-GDh5/') {
            var param = {
                url: url
            }
            LMAndroid.JSCallAndroid.doJumpGDGDH5(JSON.stringify(param), '');
            return;
        }
        window.location.href = url;
    },

    /**
     * 疫情模块接口
     */
    jumpEpidemic: function () {
        var objHome = getCurPageObj();

        var objEpidemic = LMEPG.Intent.createIntent('report-index');
        objEpidemic.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objEpidemic, objHome);
    },

    /**
     * 跳转第三方网页
     * @param url 网页地址
     */
    jumpAPK: function (pkgName, clsName) {
        var data = {
            pkg: pkgName,
            cls: clsName,
            notInstallMsg: "",
        };
        LMAndroid.JSCallAndroid.doJumpThirdParty(JSON.stringify(data), '');
    },

    // 跳转->疾病自测-首页-列表
    jumpHealthSelfTestList: function (classifyId) {
        var objSrc = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('testList');
        objDst.setParam('currentClassId', is_empty(classifyId) ? -1 : classifyId);
        LMEPG.Intent.jump(objDst, objSrc);
    },

    // 跳转->疾病自测题目页面
    jumpHealthSelfTestDetail: function (topicId) {
        var objSrc = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('answer');
        objDst.setParam('topicId', is_empty(topicId) ? '' : topicId);
        LMEPG.Intent.jump(objDst, objSrc);
    },

    /**
     * 跳转 -- 图文详情
     * @param graphicId 图文ID
     */
    jumpGraphicDetail: function (graphicId) {
        var objHome = getCurPageObj();

        var objGraphic = LMEPG.Intent.createIntent("album");
        objGraphic.setParam('albumName', 'TemplateAlbum');
        objGraphic.setParam('graphicId', graphicId);

        LMEPG.Intent.jump(objGraphic, objHome);
    },

    /**
     * 跳转挽留页
     */
    jumpHold: function () {
        var objCurrent = PageJump.getHomePage();

        var objHomeTab = LMEPG.Intent.createIntent("hold");

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },
    /**
     * 获取当前页
     * @returns {{param: *, setomPageName: setPageName, name: *, setParam: setParam}}
     */
    getHomePage: function () {
        var current = LMEPG.ButtonManager.getCurrentButton();
        var objCurrent = LMEPG.Intent.createIntent("home");
        return objCurrent;
    },

};

/**
 * ===============================处理首页小窗口视频轮播===============================
 */
var Play = {

    homePollVideoList: '', // 轮播视频列表
    homePollVideoIndex: 0, // 轮播视频数组下标

    /**
     * 初始化小窗播放数据
     */
    initSmartPlayData: function () {
        Play.homePollVideoList = RenderParam.homePollVideoList.list;
        if (LMEPG.Func.isEmpty(Play.homePollVideoList) || Play.homePollVideoList.length < 1) {
            LMEPG.UI.showToast("轮播视频列表为空，无法小窗播放", 3);
            return;
        }
        Play.startSmartPlay();
        //注册播放回调事件
        LMAndroid.registSmallPlayUICallback(Play.onSmallPlayerCompleteCallback);
    },

    /**
     * 播放小窗视频
     */
    startSmartPlay: function () {
        if (Play.homePollVideoIndex >= Play.homePollVideoList.length) {
            Play.homePollVideoIndex = 0;
        }
        var videoInfo = Play.homePollVideoList[Play.homePollVideoIndex];
        Play.homePollVideoIndex++;

        Play.initVideoRealUrl(videoInfo.videoUrl, function (realPlayUrl) {
            var lowerBuffer = 1;

            if (RenderParam.carrierId === "220001") {
                lowerBuffer = 0;
            }
            var videoInfoParam = {
                "videoLeft": 70,
                "videoTop": 172,
                "videoWidth": 347,
                "videoHeight": 205,
                "playerType": 1, // 全屏播放器类型:0->rawplayer；1->ijkplayer;default->0
                "playerDecoderType": 0,	// 全屏播放器解码类型：0->硬解码；1->软解码；default-0
                "playerRenderType": 1,
                "isReplay": 0,
                "lowerBuffer": lowerBuffer, // 设置是否打开秒开机制
                "urlList": [{
                    videoUrl: realPlayUrl,
                    jurisdiction: true, //是否有权限播放
                    freeDuration: videoInfo.freeSeconds,
                    userType: videoInfo.userType,
                    videoTitle: videoInfo.title,
                }]
            };

            if (RenderParam.carrierId == '220001') {
                videoInfoParam.playerRenderType = 2; // 小窗口播放模糊问题修复
            }

            LMAndroid.startSmallPlay(videoInfoParam);
        });
    },

    /**
     * 播放结束回调
     * @param param
     * @param notifyAndroidCallback
     * @constructor
     */
    onSmallPlayerCompleteCallback: function (param, notifyAndroidCallback) {
        console.log("onSmallPlayerCompleteCallback,param:" + param);
        LMAndroid.JSCallAndroid.doHideVideo("", null);
        var paramJson = JSON.parse(param);
        if (LMEPG.Func.isExist(paramJson) && !LMEPG.Func.isEmpty(paramJson.resean)) {
            var reason = paramJson.resean;
            console.log("网页接收到视频播放完成消息");
            Play.startSmartPlay();
        } else {
            LMAndroid.JSCallAndroid.showToastV1("resean为空");
        }
    },

    /**
     * 点击小窗视频，大窗播放
     */
    clickSmartPlay: function (btn) {
        var videoInfo = Play.homePollVideoList[Play.homePollVideoIndex - 1];
        // 创建视频信息
        var videoParam = {
            'sourceId': videoInfo.sourceId,
            'videoUrl': videoInfo.videoUrl,
            'title': videoInfo.title,
            'type': videoInfo.modelType,
            'userType': videoInfo.userType,
            'freeSeconds': videoInfo.freeSeconds,
            'entryType': 1,
            'entryTypeName': 'home',
            'focusIdx': btn.id,
            'unionCode': videoInfo.unionCode,
            'showStatus': videoInfo.showStatus
        };

        //视频专辑下线处理
        if (videoInfo.showStatus == "3") {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoParam)) {
            PageJump.jumpPlayVideo(videoParam);
        } else {
            PageJump.jumpBuyVip(videoParam.title, videoParam);
        }
    },

    /**
     * 获取真实播放地址
     * @param originalPlayUrl
     * @param callback
     */
    initVideoRealUrl: function (originalPlayUrl, callback) {
        // 广东广电初始化视频真实地址,先鉴权视频，然后获取播放地址
        switch (RenderParam.carrierId) {
            case "220001":
                var data = {
                    "cid": originalPlayUrl,
                    "tid": "-1",
                    "supercid": "",
                    "playType": "1",
                    "contentType": "0",
                    "businessType": "1",
                    "idflag": "1"
                };
                var firstElementIndex = 0;
                // 服务器请求获取播放地址网络被限制，ajax请求存在跨域问题，故将获取播放地址的问题放到android端
                LMAndroid.JSCallAndroid.getPlayUrl(JSON.stringify(data), function (finalParam, notifyAndroidCallback) {
                    // 调试，打印播放地址
                    LMEPG.Log.debug("home.js-->getPlayUrl-->" + finalParam);
                    var videoData = JSON.parse(finalParam);
                    if (videoData.isSuccess == 1) {
                        var videoObj = JSON.parse(videoData.data);
                        var urls = videoObj.urls;
                        var urlObj = urls[firstElementIndex];
                        LMEPG.Log.debug("home.js-->playUrl-->" + (urlObj.playurl));
                        // 回调函数，输出真实播放地址
                        callback(urlObj.playurl);
                    } else {
                        LMEPG.UI.showToast("获取小窗播放地址失败!");
                    }

                });
                break;
            // 其他地区为原始地址就是真实播放地址
            default:
                callback(originalPlayUrl);
                break;
        }
    },
};

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        EVENT_MEDIA_END: Play.onPlayEvent,
        EVENT_MEDIA_ERROR: Play.onPlayEvent,
        KEY_VOL_UP: Play.onVolumeUp,
        KEY_VOL_DOWN: Play.onVolumeDown,
        KEY_3: Page.onKeyDown
    }
);

window.onunload = function () {
    LMAndroid.hideSmallVideo();
};

var onBack = function () {
    var currentNavID = thisNavID;
    var currentFocusId = LMEPG.BM.getCurrentButton().id;
    switch (true) {
        // 关闭新手指导
        case currentFocusId == 'debug':
            HelpModal[HelpModal.getCurrentSign(cutLastStr(currentNavID))] = 1;
            H(HelpModal.getCurrentTabId(cutLastStr(currentNavID)) + (HelpModal.count - 1));
            HelpModal.upLoadFirstEnter();
            break;
        // 跳转Tab0
        case currentNavID != 'tab-0':
            showTabContent("tab-0");
            LMEPG.BM.requestFocus('video-TV');
            break;
        // 跳转挽留页
        default:
            Page.back();
            break;
    }
};

/**
 * ***************************************处理网络请求*******************************************
 */
var Network = {
    getAlbumIdByAlias: function (aliasName, callback) {
        LMEPG.UI.showWaitingDialog();
        var reqData = {
            'aliasName': aliasName
        };
        LMEPG.ajax.postAPI('Album/getAlbumIdByAlias', reqData, function (rsp) {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data.result == 0) {
                console.log(data);
                callback(data.album_id);
            } else {
                LMEPG.UI.showToast('获取视频集id失败!');
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    }
};

window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    LMEPG.UI.logPanel.show("错误信息：" + errorMessage);
    LMEPG.UI.logPanel.show("出错文件：" + scriptURI);
    LMEPG.UI.logPanel.show("出错行号：" + lineNumber);
    LMEPG.UI.logPanel.show("出错列号：" + columnNumber);
    LMEPG.UI.logPanel.show("错误详情：" + errorObj);
}