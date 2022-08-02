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
    EXPERT_UNREG: 21, //查询和退订
    THIRD_PARTY_URL: 22,            //跳转第三方应用
    MY_COLLECTION: 23, // 我的收藏
    EXPERT_INQUIRY_RECORD: 25, // 专家问诊记录
    NIGHTPHARMACY: 24, //夜间药房
    VIDEO_INQUIRY_RECORD: 28, // 视频问诊记录
    REGISTER_RECORD: 29, // 挂号记录
    DETECT_HEALTH_RECORD: 30, // 健康检测记录
    FAMILY_MEMBER: 31, // 家庭成员
    ABOUT_US: 32, // 关于我们
    ALBUM_UI: 33, // UI专辑
    HEALTH_VIDEO_SET: 34,  //视频集
    PURCHASE_DEVICE_RECORD: 38, //设备商城–购买记录
    ALBUM_GRAPHIC: 39,// 专辑 - 图文
    GRAPHIC_DETAIL: 43, // 图文
    PLAY_VIDEO_RECORD: 44, // 播放记录
    FAMILY_ARCHIVES: 45, // 家庭档案
    EPIDEMIC: 48, // 疫情模块
    SELF_TEST_CLASSIFY: 51,  // 健康自测-分类
    SELF_TEST_DETAILS: 52,   // 健康自测-项目
    DONATE_BLOOD_PAGE: 53,   // 公益鲜血模块
    PACKET_HEALTH_LIVE: 55,  // 山东电信 健康生活小包模块
    PACKET_CHANNEL_OLD: 56,  // 山东电信 中老年健康-小包视频模块
    PACKET_CHANNEL_BABY: 57,  // 山东电信 宝贝天地-小包视频模块
    HEALTH_REMIND: 61, // 健康提醒
    Custom_Module: 62, // 定制模块
};
var CARRIER_ID_SHANDONG_HICON = "371092"; // 山东电信海看carrierId
/**
 * ===============================处理页面数据===============================
 */
var Page = {
    hasSmallVideo: true,
    /**
     * 初始化
     */
    init: function () {
        this.hideSmallVideo()
        this.getLocationParam();
        this.renderNav();
        this.initMarquee();
        this.isVipToDo();
        this.setPageSize();

        this.setHeader();
        this.initBtnFocus();
        // this.initRightTopButtons();
        this.initByCarrierId(); // 根据不同的区域初始化
        LMEPG.BM.requestFocus(this.focusId || 'link-1');
        getJumpKeepFocusTabId = true;

        LMEPG.Func.listenKey(3, [KEY_3, KEY_9, KEY_8, KEY_3], PageJump.jumpTestPage);
        LMEPG.Func.listenKey(4, [KEY_4, KEY_9, KEY_8, KEY_4], Page.test);
        if (RenderParam.carrierId === "371002" || RenderParam.carrierId === "370002"){ // 山东电信apk、山东电信海看apk
            LMEPG.Func.listenKey("CHANNEL_UP", [KEY_CHANNEL_UP, KEY_CHANNEL_UP, KEY_CHANNEL_UP, KEY_CHANNEL_UP], PageJump.jumpTestPage);
        }
        if (RenderParam.carrierId == CARRIER_ID_SHANDONG_HICON || RenderParam.carrierId == "371002") {
            if (LMEPG.Func.getLocationString('tabId') == undefined) {
                sendNavEventFoHICON('tab-0');
            } else {
                sendNavEventFoHICON(LMEPG.Func.getLocationString('tabId'));
            }
        }
    },

    /**
     * 初始化按钮焦点
     */
    initBtnFocus: function () {
        LMEPG.ButtonManager.init(this.tabId, buttons, '', true);
    },

    /**
     * 设置头部显示内容
     */
    setHeader: function () {
        RenderParam.carrierId == "650092" && Page.setHeader650092();
        RenderParam.carrierId == "500092" && Page.setHeader500092();
    },

    /**
     * 隐藏播放小窗，
     * 根据条件判断是否显示小窗
     */
    hideSmallVideo: function () {
        // 配置了2号位，就表示配置了普通内容，关闭小窗口
        if (RenderParam.configInfo.data.entry_list[1].position === "12") {
            //小窗不消失
            Tab0.hasSmallVideo = false;
            Show('link-0');
            //播放小窗隐藏
            G('iframe_small_screen').setAttribute("style", "display:none");
        }
    },

    /**
     * 渲染导航栏
     */
    renderNav: function () {
        this.buildRenderNav();
        this.setNavCenter()
    },

    /**
     * 设置导航栏居中
     */
    setNavCenter: function () {
        if (RenderParam.carrierId === '371092') {
            var navContainer = G('nav-content-tabs');
            navContainer.style.left = '319px'; // 居中显示导航栏
        }
    },

    /**
     * 构建导航HTML
     */
    buildRenderNav: function () {
        var count = RenderParam.navConfig && RenderParam.navConfig.length;
        var htm = '';
        var itemSrc = '';
        while (count--) {
            itemSrc = RenderParam.fsUrl + RenderParam.navConfig[count].img_url.normal;
            htm = '<img id="tab-' + count + '" src="' + itemSrc + '">' + htm;
        }
        G('nav-content-tabs').innerHTML = htm;
        // 设置导航栏居中
        var isNavCenter = RenderParam.carrierId === '371092' || RenderParam.carrierId === '371002';
        if (isNavCenter) {
            var navContainer = G('nav-content-tabs');
            navContainer.style.left = '319px'; // 居中显示导航栏
        }
    },

    /**
     *
     */
    isVipToDo: function () {
        // 焦点恢复（如果非VIP点击“加入会员”按钮订购，变成VIP后，此按钮会隐藏，焦点需改变）
        if (this.focusId == 'join-vip' && LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) this.focusId = 'tab-3';
    },

    /**
     * 获取本地参数
     */
    getLocationParam: function () {
        this.tabId = LMEPG.Func.getLocationString('tabId') || 'tab-0';
        this.focusId = LMEPG.Func.getLocationString('focusId');
        this.tab2CarouselId = +LMEPG.Func.getLocationString('curTab2CarouselId') || 2;
    },

    /**
     * 获取专辑别名
     * @param aliasName
     * @param callback
     */
    getAlbumIdByAlias: function (aliasName, callback) {
        LMEPG.UI.showWaitingDialog();
        var reqData = {
            'aliasName': aliasName
        };
        LMEPG.ajax.postAPI('Album/getAlbumIdByAlias', reqData, function (rsp) {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data.result == 0) {
                callback(data.album_id);
            } else {
                LMEPG.UI.showToast('获取视频集id失败!');
            }
            LMEPG.UI.dismissWaitingDialog();
        })
    },
    /**
     * 处理不同地区少部分逻辑调整
     */
    initByCarrierId: function () {
        if (RenderParam.carrierId == "370092" || RenderParam.carrierId == "450092") {
            // 山东电信需对音量键做监听操作
            LMEPG.KeyEventManager.addKeyEvent(
                {
                    KEY_VOL_UP: 'Play.onVolumeChanged("up")',        // 音量+
                    KEY_VOL_DOWN: 'Play.onVolumeChanged("down")'      // 音量+
                }
            );
        }
        //var addKeyEventLmcid = ['371092','371002'];
        //EPG 全平台注册视频播放事件的监听
        LMEPG.KeyEventManager.addKeyEvent(
            {
                EVENT_MEDIA_END: Play.onPlayEvent,
                EVENT_MEDIA_ERROR: Play.onPlayEvent,
            }
        );
        // TODO 测试阶段屏蔽
        var doSameLmcid = ['610092'];
        if (doSameLmcid.indexOf(RenderParam.carrierId) > -1) {
            var button = LMEPG.BM._buttons;
            /*
            button['tab3-link-3'].click = button['join-vip'].click = function () {
                LMEPG.UI.showToast('该功能暂未开放，敬请期待~', 1.5)
            };
            */
        }
        // 判断首页是否有小窗播放功能
        if (Tab0.hasSmallVideo) {
            Hide('link-0');
        }
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
    },

    /**
     * 跑马灯信息初始化
     */
    initMarquee: function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            G('scroll-wrapper').innerHTML = '<marquee scrollamount="4">' + data.content + '</marquee>';
        }, function (errorInfo) {
            LMEPG.Log.error("getMarquee error: " + errorInfo)
        })
    },

    /**
     * 点击Tab2的专辑
     */
    onClickTab2Album: function (btn) {
        var album = Tab2.linkAlbum;
        if (!album) {
            LMEPG.UI.showToast('未配置该专辑哦 ~');
            return;
        }
        PageJump.jumpAlbumPage(Tab2.linkAlbum.alias_name, btn);
    },

    /**
     * 点击热播视频
     * @param btn
     */
    onClickHotVideo: function (btn) {
        var videoData = Tab1.hotRefVideo[btn.id.slice(-1)];
        //视频专辑下线处理
        if (videoData.show_status == "3") {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }
        PageJump.jumpPlayVideo(videoData);
    },

    /**
     * 获取完整路径图片地址
     */
    getImg: function (relativeUrl) {
        return relativeUrl ? RenderParam.fsUrl + relativeUrl : '';
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
     * 设置重庆电信首页内容
     */
    setHeader650092: function () {
        for (i = 0, len = buttons.length; i < len; i++) {
            if (buttons[i].id == "search") {
                buttons[i].nextFocusRight = "vip";
            }
            if (buttons[i].id == "vip") {
                buttons[i].nextFocusRight = "help";
                buttons[i].nextFocusLeft = "search";
            }
            if (buttons[i].id == "help") {
                buttons[i].nextFocusLeft = "vip";
                buttons[i].nextFocusRight = "";
            }
        }

    },

    /**
     * 设置重庆电信首页内容
     */
    setHeader500092: function () {
        for (i = 0, len = buttons.length; i < len; i++) {
            if (buttons[i].id == "search") {
                buttons[i].nextFocusRight = "vip";
            }
            if (buttons[i].id == "vip") {
                buttons[i].nextFocusLeft = "search";
            }
            if (buttons[i].id == "tab-3") {
                buttons[i].nextFocusDown = "join-vip"
            }
        }
        //G("help").style.display = "none";
    },

    /**
     * 右上角功能按钮设置
     */
    initRightTopButtons: function () {
        var btnSearchId = 'search';
        var btnOrderId = 'vip';
        var btnHelpId = 'help';
        var isHideMark = RenderParam.carrierId == '371092';
        var isHideSet = RenderParam.carrierId == '371092';

        var btnSearch = LMEPG.ButtonManager.getButtonById(btnSearchId) != null ?
            LMEPG.ButtonManager.getButtonById(btnSearchId) : '';
        var btnOrder = LMEPG.ButtonManager.getButtonById(btnOrderId) != null ?
            LMEPG.ButtonManager.getButtonById(btnOrderId) : '';
        var btnHelp = LMEPG.ButtonManager.getButtonById(btnHelpId) != null ?
            LMEPG.ButtonManager.getButtonById(btnHelpId) : '';

        if (isHideMark) {
            btnSearch.nextFocusRight = btnOrderId;
            btnOrder.nextFocusLeft = btnSearchId;
        }

        if (isHideSet) {
            btnOrder.nextFocusRight = btnHelpId;
            btnHelp.nextFocusLeft = btnOrderId;
        }
    },

    /**
     * 一个推荐位可能有多条数据，一般为1条。多条的特殊处理，index表示数组下标
     * @param btn {{}} 按钮信息
     * @returns {number}
     */
    getIndexByPos: function (btn) {
        var index = 0;
        btn.cPosition == 14 && (index = Tab0.banner.activeImageIdx); // Tab0的轮播
        btn.cPosition == 21 && (index = Tab1.banner.activeImageIdx || index); // Tab1的轮播
        btn.cPosition == 16 && (index = btn.id.slice(-1)); // // Tab0 最下面一排四个融合推荐位
        return index;
    },

    /**
     * 推荐位点击事件
     * @param btn
     */
    onClickRecommendPosition: function (btn) {
        var pos = btn.cPosition;
        // 部分地区没有小窗视频，需要调整全屏播放（tab0 二号位）
        if (pos == 12 && Tab0.hasSmallVideo) {
            Play.playHomePollVideo(btn); // 跳转全屏播放页面
            return;
        }
        var index = (RenderParam.carrierId==='440001' && btn.isButton?btn.cIdx.order-1:Page.getIndexByPos(btn))
        var entryItem = Page.getRecommendDataByPosition(pos);
        var itemData = entryItem && entryItem.item_data && entryItem.item_data[index];
        LMEPG.StatManager.statRecommendEvent(pos, itemData.order); // 统计推荐位点击事件
        Page.onClickShanDongHHCON(itemData, btn);
        Page.jumpByEntryType(itemData, btn);
    },

    /**
     * 根据URL传入的进入类型跳到不同的页面
     * @param itemData
     * @param btn
     */
    jumpByEntryType:function(itemData, btn) {

        LMEPG.Log.info("home.js---onClickRecommendPosition---entry_type::" + itemData.entry_type);
        switch (parseInt(itemData.entry_type)) {
            case HomeEntryType.ACTIVITYS: // 活动
                PageJump.jumpActivityPage(JSON.parse(itemData.parameters)[0].param, btn);
                break;
            case HomeEntryType.HEALTH_VIDEO_BY_TYPES: // 更多视频
                PageJump.jumpMoreVideos(itemData);
                break;
            case HomeEntryType.HEALTH_VIDEO:
                // 视频播放
                PageJump.jumpPlayVideo(itemData);
                break;
            case HomeEntryType.VIDEO_VISIT_HOME: // 视频问诊
                PageJump.jumpVideoVisitHome(btn);
                break;
            case HomeEntryType.HEALTH_VIDEO_SUBJECT:
            case HomeEntryType.ALBUM_UI:
            case HomeEntryType.ALBUM_GRAPHIC:
                PageJump.jumpAlbumPage(JSON.parse(itemData.parameters)[0].param, btn);
                break;
            case HomeEntryType.GUAHAO_HOME: // 挂号主页
                PageJump.jumpGuaHaoPage();
                break;
            case HomeEntryType.NIGHTPHARMACY: // 夜间药房
                PageJump.jumpNightpharmacy();
                break;
            case HomeEntryType.HEALTH_MEASURE: // 健康检测
                PageJump.jumpHealthMeasure(btn);
                break;
            case HomeEntryType.EXPERT_CONSULTATION: //专家约诊
                if (RenderParam.platformType == 'sd') {
                    LMEPG.UI.showToast('不支持的盒子类型！', 1.5);
                    return;
                }
                PageJump.jumpExpertConsultation(btn);
                break;
            case HomeEntryType.HEALTH_VIDEO_SET:  //视频集
                Page.getAlbumIdByAlias(JSON.parse(itemData.parameters)[0].param, function (subject_id) {
                    PageJump.jumpVideoListPage(subject_id);
                });
                break;
            case HomeEntryType.MY_COLLECTION:
                PageJump.jumpCommon('collect');
                break;
            case HomeEntryType.EXPERT_INQUIRY_RECORD:
                if (RenderParam.platformType == 'sd') {
                    LMEPG.UI.showToast('不支持的盒子类型！', 1.5);
                    return;
                }
                PageJump.jumpCommon('expertRecordHome');
                break;
            case HomeEntryType.FAMILY_ARCHIVES:
            case HomeEntryType.FAMILY_MEMBER:
                PageJump.jumpCommon('familyEdit');
                break;
            case HomeEntryType.PLAY_VIDEO_RECORD:
                PageJump.jumpCommon('historyPlay');
                break;
            case HomeEntryType.GRAPHIC_DETAIL:
                var graphicJson = JSON.parse(itemData.parameters);
                var graphicId = graphicJson[0]['param'];
                PageJump.jumpGraphicDetail(graphicId);
                break;
            case HomeEntryType.THIRD_PARTY_URL: //跳转第三方网页
                PageJump.jumpThirdPartyUrl(JSON.parse(itemData.parameters)[0].param);
                break;
            case HomeEntryType.EPIDEMIC: //跳转第三方网页
                PageJump.jumpEpidemic();
                break;
            case HomeEntryType.DONATE_BLOOD_PAGE: // 献血模块
                PageJump.jumpDonateBloodPage()
                break;
            case HomeEntryType.SELF_TEST_CLASSIFY:
                PageJump.jumpHealthSelfTestList(JSON.parse(itemData.parameters)[0].param);
                break;
            case HomeEntryType.SELF_TEST_DETAILS:
                PageJump.jumpHealthSelfTestDetail(JSON.parse(itemData.parameters)[0].param);
                break;
            case HomeEntryType.PACKET_HEALTH_LIVE: //跳转健康生活
                PageJump.jumpPacketHealth();
                break;
            case HomeEntryType.PACKET_CHANNEL_OLD: //跳转小包视频 中老年健康、宝贝天地
            case HomeEntryType.PACKET_CHANNEL_BABY:
                PageJump.jumpPacketChannel(itemData.entry_type);
                break;
            case HomeEntryType.DEVICE_STORES:  //设备商城
                PageJump.jumpDeviceStore();
                break;
            case HomeEntryType.EXPERT_UNREG: //用户指南
                PageJump.jumpUnreg();
                break;
            case HomeEntryType.VIDEO_INQUIRY_RECORD:  //视频问医记录 -- 待完成，需要家庭成员
                PageJump.jumpInquiryRecord();
                break;
            case HomeEntryType.HEALTH_REMIND: // 健康提醒
                PageJump.jumpHealthRemind();
                break;
            case HomeEntryType.Custom_Module: //跳转定制模块
                PageJump.jumpCustomModule(JSON.parse(itemData.parameters)[0].param);
                break;
            case HomeEntryType.ABOUT_OURS: // 关于我们 -- 待完成，需要跳转帮助页面再显示关于我们
            case HomeEntryType.PURCHASE_DEVICE_RECORD:
            case HomeEntryType.DEVICE_STORES_BY_ID:  //设备商城商品
            case HomeEntryType.HOME_PAGE:  //首页
            case HomeEntryType.REGISTER_RECORD: // 挂号记录 -- 待完成
            case HomeEntryType.DETECT_HEALTH_RECORD: // 健康检测记录 -- 待完成，需要家庭成员
            case HomeEntryType.EXPERT_CONSULTATION_REMIND: //专家约诊消息提醒
            case HomeEntryType.SEARCH:  //搜索

            case HomeEntryType.VIDEO_VISIT_BY_DOCTOR:  //视频问诊-医生
            case HomeEntryType.VIDEO_VISIT_BY_DEPART:  //视频问诊-科室
            case HomeEntryType.GUAHAO_BY_HOSP: //挂号-医院
            case HomeEntryType.USER_GUIDE: //用户指南
            default:
                LMEPG.UI.showToast('未配置的跳转类型!');
                break;
        }
    },

    /**
     * 山东电信海看埋点上报推荐位点击事件
     * @param itemData
     * @param btn
     */
    onClickShanDongHHCON:function(itemData, btn) {
        if ((RenderParam.carrierId == CARRIER_ID_SHANDONG_HICON || RenderParam.carrierId == "371002")
            && (parseInt(itemData.entry_type) != HomeEntryType.HEALTH_VIDEO)) {
            var turnPageInfo = Page._getHICONTurnPageInfo(itemData);
            turnPageInfo.clickId = Page._getHICONClickId(btn.id);
            if (turnPageInfo.clickId != "" && turnPageInfo.clickId != null) {
                ShanDongHaiKan.sendReportData('6', turnPageInfo);
            }
        }
    },

    /**
     * 获取海看数据探针上报页面信息
     * @param recommendInfo 推荐位相关信息
     * @returns {{turnPage: string, turnPageName: string, turnPageId: string}}
     * @private
     */
    _getHICONTurnPageInfo: function (recommendInfo) {
        var turnPage = "";       // 路由的页面
        var turnPageName = "";   // 路由页面名称
        var turnPageId = "";     // 路由页面ID
        var routeFlag = parseInt(recommendInfo.entry_type);
        var rootPath = location.origin + "/index";
        var recommendParams = JSON.parse(recommendInfo.parameters);
        var innerP = JSON.parse(recommendInfo.inner_parameters);
        switch (routeFlag) {
            case HomeEntryType.ACTIVITYS:
                // 活动
                turnPage = "/Activity/Activity/index";
                turnPageName = "活动详情页";
                turnPageId = recommendParams[0].param;
                break;
            case HomeEntryType.HEALTH_VIDEO_BY_TYPES:
                // 更多视频
                if (innerP.level == 1) {
                    turnPage = '/Home/Channel/channelIndexV13';
                    turnPageName = "视频剧集列表页";
                } else {
                    turnPage = '/Home/Channel/secondChannelIndexV13';
                    turnPageName = "剧集详情页";
                }
                break;
            case HomeEntryType.HEALTH_VIDEO:

                // 视频播放
                var videoInfo;
                if (!innerP) {
                    videoInfo = recommendInfo;
                } else {
                    videoInfo = JSON.parse(recommendInfo.inner_parameters);
                }
                turnPage = "/Home/Player/indexV1";
                turnPageName = "视频播放页1";
                turnPageId = videoInfo.ftp_url.gq_ftp_url;
                break;
            case HomeEntryType.VIDEO_VISIT_HOME:
                // 视频问诊
                turnPage = "/Home/DoctorP2P/doctorIndexV13";
                turnPageName = "医生列表页";
                break;
            case HomeEntryType.HEALTH_VIDEO_SUBJECT:
            case HomeEntryType.ALBUM_UI:
            case HomeEntryType.ALBUM_GRAPHIC:
            case HomeEntryType.GRAPHIC_DETAIL:
                turnPage = '/Album/Album/index';
                turnPageName = '专辑详情页';
                turnPageId = recommendParams[0].param;
                break;
            case HomeEntryType.HEALTH_MEASURE:
                // 健康检测
                turnPage = '/Home/HealthTest/index';
                turnPageName = '健康检测页';
                break;
            case HomeEntryType.EXPERT_CONSULTATION: //专家约诊
                turnPage = '/Home/Expert/expertIndexV13';
                turnPageName = '专家约诊列表页';
                break;
            case HomeEntryType.MY_COLLECTION:
                turnPage = '/Home/Collect/indexV1';
                turnPageName = '收藏详情页';
                break;
            case HomeEntryType.EXPERT_INQUIRY_RECORD:
                turnPage = '/Home/ExpertRecord/expertRecordHomeV13';
                turnPageName = '专家约诊记录页';
                break;
            case HomeEntryType.FAMILY_ARCHIVES:
            case HomeEntryType.FAMILY_MEMBER:
                turnPage = '/Home/Family/myHomeV2';
                turnPageName = '家庭成员页';
                break;
            case HomeEntryType.PLAY_VIDEO_RECORD:
                turnPage = '/Home/HistoryPlay/historyPlayV1';
                turnPageName = '播放历史记录页';
                break;
            case HomeEntryType.EPIDEMIC:
                turnPage = '/Home/OutbreakReport/indexV1';
                turnPageName = '疫情专区页';
                break;
            case HomeEntryType.PACKET_HEALTH_LIVE:
                turnPage = '/Home/Hold/healthLiveV1';
                turnPageName = '健康生活页';
                break;
        }

        return {
            currentPage: location.href,   // 跳转前页面
            turnPage: rootPath + turnPage,
            turnPageName: turnPageName,
            turnPageId: turnPageId
        };
    },

    /**
     * 海看数据探针接口点击推荐位ID
     * @param buttonId 按钮id
     * @returns {string} 推荐位ID
     * @private
     */
    _getHICONClickId: function (buttonId) {
        var clickId = "";
        switch (buttonId) {
            case 'video-TV':
                clickId = '39JKTJ-1-1';
                break;
            case 'free-area':
                clickId = '39JKTJ-1-2';
                break;
            case 'link-1':
                clickId = '39JKTJ-1-3';
                break;
            case 'link-2':
                clickId = '39JKTJ-1-4';
                break;
            case 'keep-watch':
                clickId = '39JKTJ-1-5';
                break;
            case 'link-3':
                clickId = '39JKTJ-1-6';
                break;
            case 'b-link-0':
                clickId = '39JKTJ-2-1';
                break;
            case 'b-link-1':
                clickId = '39JKTJ-2-2';
                break;
            case 'b-link-2':
                clickId = '39JKTJ-2-3';
                break;
            case 'b-link-3':
                clickId = '39JKTJ-2-4';
                break;
            case 'b-link-4':
                clickId = '39JKTJ-2-5';
                break;
            case 'tab1-link':
                clickId = '39JKFX-1-1';
                break;
            case 'tab1-link-2':
                clickId = '39JKFX-1-2';
                break;
            case 'tab1-link-3':
                clickId = '39JKFX-1-4';
                break;
            case 'tab1-link-4':
                clickId = '39JKFX-1-3';
                break;
            case 'tab1-link-5':
                clickId = '39JKFX-1-5';
                break;
            case 'hot-0':
                clickId = '39JKFX-1-6';
                break;
            case 'hot-1':
                clickId = '39JKFX-1-7';
                break;
            case 'hot-2':
                clickId = '39JKFX-1-8';
                break;
            case 'hot-3':
                clickId = '39JKFX-1-9';
                break;
            case 'hot-4':
                clickId = '39JKFX-1-10';
                break;
            case 'hot-5':
                clickId = '39JKFX-1-11';
                break;
            case 'bottom-link-0':
                clickId = '39JKFX-2-1';
                break;
            case 'bottom-link-1':
                clickId = '39JKFX-2-2';
                break;
            case 'bottom-link-2':
                clickId = '39JKFX-2-3';
                break;
            case 'bottom-link-3':
                clickId = '39JKFX-2-4';
                break;
            case 'bottom-link-4':
                clickId = '39JKFX-2-5';
                break;
            case 'sift-2':
                clickId = '39JKJXZT';
                break;
            case 'join-vip':
                clickId = '39JKWD-1-1';
                break;
            case 'tab3-link-1':
                clickId = '39JKWD-1-2';
                break;
            case 'tab3-link-4':
                clickId = '39JKWD-1-3';
                break;
            case 'tab3-link-2':
                clickId = '39JKWD-1-4';
                break;
            case 'tab3-link-3':
                clickId = '39JKWD-1-5';
                break;
        }
        return clickId;
    }
};

/**
 * ===============================处理跳转===============================
 */
var PageJump = {
    /**
     * 跳转->献血模块
     */
    jumpDonateBloodPage: function () {
        var objHome = LMEPG.Intent.createIntent("commonweal");
        LMEPG.Intent.jump(objHome, getCurPageObj());
    },
    /**
     * 跳转 -- 通用页面跳转方法
     */
    jumpCommon: function (routerId) {
        LMEPG.Intent.jump(LMEPG.Intent.createIntent(routerId), getCurPageObj());
    },

    /**
     * 跳转 -- 购买vip页面
     */
    jumpBuyVip: function (remark, videoInfo, orderType) {
        if (typeof (videoInfo) !== "undefined" && videoInfo !== "") {
            var postData = {
                "videoInfo": JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
            });
        }

        var objCurrent = getCurPageObj();
        objCurrent.setParam("isOrderBack", 1);
        if (typeof (orderType) !== "undefined") {
            objCurrent.setParam("orderType", orderType);
            objCurrent.setParam("focusId", "");
        }

        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        jumpObj.setParam("userId", RenderParam.userId);
        jumpObj.setParam("isPlaying", "1");
        jumpObj.setParam("remark", remark);

        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (itemData) {
        //获取按钮坑位传递到播控页面合并探针信息
        if (RenderParam.carrierId == "371092" || RenderParam.carrierId == "371002") {
            var clickId = Page._getHICONClickId(LMEPG.BM.getCurrentButton().id);
        }

        if (itemData.inner_parameters == "undefined" || itemData.inner_parameters == null) {
            var videoData = itemData;
        } else {
            var videoData = JSON.parse(itemData.inner_parameters);
        }
        if (!videoData) return;
        var objHome = getCurPageObj();
        var objPlayer = null;
        var play_url = videoData.ftp_url;
        var videoUrl = null;
        if (typeof (play_url) !== "undefined" && play_url != "") {
            var videoObj = play_url instanceof Object ? play_url : JSON.parse(play_url);
            videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
        } else if (typeof (videoData.videoUrl) !== "undefined" && videoData.videoUrl != "") {
            videoUrl = RenderParam.platformType = videoData.videoUrl;
        }
        var showStatus = 0;
        if (typeof (videoData.show_status) !== "undefined" && videoData.show_status != "") {
            showStatus = videoData.show_status;
        } else if (typeof (videoData.showStatus) !== "undefined" && videoData.showStatus != "") {
            showStatus = videoData.showStatus;
        }
        // var sourceId = videoData.source_id;
        if (typeof (videoData.sourceId) == 'undefined' || videoData.sourceId === "") {
            try {
                videoData.sourceId = JSON.parse(itemData.parameters)[0].param; //解决首页推荐位视频videoData中source_id未定义
            } catch (e) {
            }
        }

        // 创建视频信息
        var videoInfo = {
            'sourceId': videoData.source_id || videoData.sourceId,
            'videoUrl': videoUrl,
            'title': videoData.title,
            'type': videoData.model_type || videoData.modelType, // 兼容小窗口视频点击
            'userType': videoData.user_type || videoData.userType,
            'freeSeconds': videoData.free_seconds || videoData.freeSeconds,
            'duration': videoData.duration || videoData.duration,
            'entryType': 1,
            'entryTypeName': 'home',
            'unionCode': videoData.union_code || videoData.unionCode,
            'show_status': showStatus,
        };

        if (videoInfo.show_status == '3') {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }

        if (LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast('视频信息为空！');
            return;
        }

        // 更多视频，按分类进入
        objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));
        //获取按钮坑位传递到播控页面合并探针信息
        if (RenderParam.carrierId == "371092" || RenderParam.carrierId == "371002") {
            objPlayer.setParam('clickId', clickId);
        }
        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            LMEPG.Intent.jump(objPlayer, objHome);
        } else {
            PageJump.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },

    /**
     * 跳转->专家约诊首页
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
    jumpActivityPage: function (activityName) {
        var objHome = getCurPageObj();
        var objActivity = LMEPG.Intent.createIntent('activity');
        objActivity.setParam('userId', RenderParam.userId);
        objActivity.setParam('activityName', activityName);
        objActivity.setParam('inner', 1);
        LMEPG.Intent.jump(objActivity, objHome);
    },

    /**
     * 跳转->视频问诊*
     * @param btn
     */
    jumpVideoVisitHome: function (btn) {
        var objCurrent = getCurPageObj();
        var jumpObj = LMEPG.Intent.createIntent('doctorIndex');
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 疫情模块接口
     */
    jumpEpidemic: function () {
        var objHome = getCurPageObj();
        var isDiff = RenderParam.carrierId === '450094' || RenderParam.carrierId === '450092' || RenderParam.carrierId === '450001'
        if(isDiff){
            var objDst = LMEPG.Intent.createIntent("area-data-prev");
            LMEPG.Intent.jump(objDst, objHome);
        }else {
            var objEpidemic = LMEPG.Intent.createIntent('report-index');
            objEpidemic.setParam("userId", RenderParam.userId);
            LMEPG.Intent.jump(objEpidemic, objHome);
        }

    },

    // 跳转->疾病自测-首页-列表
    jumpHealthSelfTestList: function (classifyId) {
        var objSrc = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('selfTestList');
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
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName) {
        var objHome = getCurPageObj();
        var objAlbum = LMEPG.Intent.createIntent('album');
        objHome.setParam('albumName', albumName);
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转->健康检测
     * @param btn
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
                if (RenderParam.carrierId == CARRIER_ID_SHANDONG_HICON || RenderParam.carrierId == "371002") {
                    // 山东电信海看埋点上报推荐位点击事件
                    var _videoUrl = videoInfo.videoUrl ? videoInfo.videoUrl : videoInfo.ftp_url.gq_ftp_url;
                    var turnPageInfo = {
                        currentPage: location.href,   // 跳转前页面
                        turnPage: location.origin + "/index/Home/Player/indexV1",
                        turnPageName: "视频播放页2",
                        turnPageId: "39_" + _videoUrl,
                        clickId: '39JKTJ-1-5'
                    };
                    ShanDongHaiKan.sendReportData('6', turnPageInfo);
                }
                if (RenderParam.carrierId == "500092") {
                    videoInfo = {inner_parameters: RenderParam.latestVideoInfo.val};
                    if (videoInfo.hasOwnProperty("inner_parameters")) {
                        if (videoInfo.inner_parameters !== "" && videoInfo.inner_parameters !== null && videoInfo.inner_parameters !== "undefined")
                            if (typeof videoInfo.inner_parameters == 'string') {
                                videoInfo = JSON.parse(videoInfo.inner_parameters);
                                if (!videoInfo.hasOwnProperty("show_status")) {
                                    videoInfo.show_status = 2;
                                }
                            }
                    }
                }
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
     * 跳转 -- 视频集
     * @param subjectId
     */
    jumpVideoListPage: function (subjectId) {
        var objHome = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('channelList');
        objDst.setParam('subject_id', subjectId);
        LMEPG.Intent.jump(objDst, objHome);
    },

    /**
     * 跳转 -- 预约挂号
     */
    jumpGuaHaoPage: function () {
        var objHome = getCurPageObj();
        var objAlbum;
        if (RenderParam.carrierId == "650092") {
            objAlbum = LMEPG.Intent.createIntent('xinjiang-reservation');
        } else if (RenderParam.carrierId === '450004' || RenderParam.carrierId == '000709' || RenderParam.carrierId == '440001') { // 广西广电apk，预约挂号同海南电信epg
            objAlbum = LMEPG.Intent.createIntent('appointmentRegister');
        } else {
            objAlbum = LMEPG.Intent.createIntent('indexStatic');
        }
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转 -- 夜间药房
     */
    jumpNightpharmacy: function () {
        var objHome = getCurPageObj();
        var objAlbum = LMEPG.Intent.createIntent('nightPharmacy');
        RenderParam.carrierId == "640092" && (objAlbum = LMEPG.Intent.createIntent('nightMedicine'));
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转 -- 一级视频/二级视频
     */
    jumpMoreVideos: function (itemData) {
        console.log(itemData);
        var inner_parameters = JSON.parse(itemData.inner_parameters);
        var parameters = JSON.parse(itemData.parameters);
        var modelName = inner_parameters.title;
        var modelType = parameters[0].param;
        var objHome = getCurPageObj();
        var pageName;
        if (RenderParam.carrierId=='440001'){
            var objChannel = LMEPG.Intent.createIntent("healthVideoList");
            // objChannel.setParam("focusIndex",'btn-nav-'+itemData.order)
            objChannel.setParam("modelName", modelName);
            objChannel.setParam("modelType", modelType);
            return LMEPG.Intent.jump(objChannel, objHome);
        } else if (inner_parameters.level == 1) {
            pageName = 'channelIndex';
        } else {
            pageName = 'secondChannelIndex';
        }
        var objDst = LMEPG.Intent.createIntent(pageName);
        objDst.setParam('modelType', modelType);
        objDst.setParam('modelName', modelName);
        LMEPG.Intent.jump(objDst, objHome);
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
     * 跳转 -- 健康提醒
     *
     */
    jumpHealthRemind: function () {
        var objHome = getCurPageObj();
        var objGraphic = LMEPG.Intent.createIntent("healthRemind");
        LMEPG.Intent.jump(objGraphic, objHome);
    },

    /**
     * 跳转定制模块
     * */
    jumpCustomModule: function (plate) {
        var objCurrent = getCurPageObj();
        var objCustomModule = LMEPG.Intent.createIntent("customizeModule");
        objCustomModule.setParam("moduleId", plate);
        LMEPG.Intent.jump(objCustomModule, objCurrent);
    },

    /**
     * 跳转第三方网页
     * @param url 网页地址
     */
    jumpThirdPartyUrl: function (url) {
        window.location.href = url;
    },

    /**
     *
     */
    jumpPacketHealth: function () {
        //山东电信 跳转健康生活
        var objHome = getCurPageObj();

        objDst = LMEPG.Intent.createIntent('healthLive');
        objDst.setParam('userId', RenderParam.userId);
        objDst.setParam('inner', 1);
        LMEPG.Intent.jump(objDst, objHome);
    },

    /**
     *
     * @param type
     */
    jumpPacketChannel: function (type) {
        //山东电信 跳转中老年健康,宝贝天地
        var objHome = getCurPageObj();

        objDst = LMEPG.Intent.createIntent('channel');
        objDst.setParam('userId', RenderParam.userId);
        objDst.setParam('modeType', type);     //56:中老年健康、57:宝贝天地
        objDst.setParam('modeTitle', type == '56' ? '中老年健康' : '宝贝天地');
        objDst.setParam('inner', 1);
        LMEPG.Intent.jump(objDst, objHome);
    },

    /**
     * 设备商城跳转
     * @param type
     */
    jumpDeviceStore: function (type) {
        var objHome = getCurPageObj();

        var objDst = LMEPG.Intent.createIntent('payOnline');
        LMEPG.Intent.jump(objDst, objHome);
    },
    // 跳转在线问医记录
    jumpInquiryRecord: function () {
        var objHome = getCurPageObj();
        var dstObj = LMEPG.Intent.createIntent('healthTestArchivingList');
        dstObj.setParam('showAskDoctorTab', 1);
        LMEPG.Intent.jump(dstObj, objHome);
    },
    //退订
    jumpUnreg: function () {
        if (RenderParam.carrierId === '430002') {
            if (!LMAndroid.isRunOnPc()) {
                var param = '{\"appId\":\"777777\",\"outDown\":\"1\",\"loadURL\":\"http://124.232.135.212:8082/AppStoreTV4/service/page/newPage/ordertwo.jsp\"}';
                LMAndroid.JSCallAndroid.quitPay(param, function (resParam, notifyAndroidCallback) {

                });
            } else {
                LMEPG.UI.showToast('运行在PC上');
            }

            return;
        }
    },

    jumpClassifyPage:function () {
        var curObj = getCurPageObj();
        var dstObj = LMEPG.Intent.createIntent('healthTestArchivingList');
        dstObj.setParam('showAskDoctorTab', 0); // 是否显示归档页面的问医记录Tab
        LMEPG.Intent.jump(dstObj, curObj);
    }
};


// ===============================处理首页小窗口视频轮播===============================
var Play = {
    currPollVideoId: 0,     //当前轮播id
    androidPlayerInfo: null,  // android端播放器的播放信息
    androidVideoInfo: null,   // android端视频的播放信息

    /**启动小窗播放*/
    startPollPlay: function () {
        if (RenderParam.homePollVideoList.count == 0) return;

        if (RenderParam.isRunOnAndroid === '1') { // apk版本视频播放
            var currentPlayVideoInfo = RenderParam.homePollVideoList.list[Play.currPollVideoId];
            Play.androidPlayerInfo = {
                "videoLeft": 70,        // 小窗显示到屏幕左边举例
                "videoTop": 172,        // 小窗显示到屏幕顶部举例
                "videoWidth": 347,      // 小窗显示的宽度
                "videoHeight": 205,     // 小窗显示的高度
                "playerType": 1,        // 播放器类型:0->rawplayer；1->ijkplayer;default->0
                "playerDecoderType": 0,	// 播放器解码类型：0->硬解码；1->软解码；default-0
                "isReplay": 0,          // 是否循环播放
                "lowerBuffer": 0,       // 是否打开秒开机制，1->打开，0->关闭
                "urlList": []
            };
            Play.androidVideoInfo = {
                videoUrl: currentPlayVideoInfo.videoUrl,        // 管理后台配置的视频播放链接地址
                jurisdiction: true,                             // 是否有权限播放
                freeDuration: currentPlayVideoInfo.freeSeconds, // 免费观看的播放时长
                userType: currentPlayVideoInfo.userType,        // 管理后台配置视频播放的策略，免费，有免费观看时长，收费
                videoTitle: currentPlayVideoInfo.title,         // 管理后台配置视频播放的标题
            };
            switch (RenderParam.carrierId) {
                case '371002': // 山东海看apk
                    Play.playVideo371002();
                    break;
                case '150002': // 内蒙电信apk
                    Play.playVideo150002();
                    break;
                case '640001': // 宁夏移动apk
                case '450001': // 广西移动apk
                    Play.playVideo640001();
                    break;
                case '450004': // 广西广电apk
                    Play.playVideo450004();
                    break;
                case '320013': // 浙江华数apk
                    Play.playVideo320013(Play.androidVideoInfo.videoUrl);
                    break;
                default:
                    Play.playVideo4Android();
                    break;
            }
            return;
        }


        // 避免多次调用
        var globalPath = RenderParam;
        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        LMEPG.mp.destroy();
        var videoUrl = Play.getCurrentPollVideoUrl(); // 播放地址
        if (videoUrl == null || videoUrl === '') return; // 排除异常情况
        var playVideoUrl = LMEPG.Func.http2rtsp(videoUrl);
        var param = {
            carrierId: globalPath.carrierId,
            videoUrl: playVideoUrl,
            playerScreenId: 'iframe_small_screen',
            platformType: globalPath.platformType,
            playerUrl: globalPath.thirdPlayerUrl
        };
        if (globalPath.platformType == 'hd') {
            switch (globalPath.stbModel) {
                case '':
                case 'E900V21D': // 区分盒子传递位置参数
                    param.position = {top: 172, left: 70, width: 347, height: 194}; // 按比例420/235，不按比例有黑边
                    break;
                default:
                    param.position = {top: 172, left: 70, width: 347, height: 205};
                    break;
            }
        } else {
            param.position = {top: 150, left: 40, width: 149, height: 106};// 中国联通标清
        }
        LMSmallPlayer.initParam(param);
        LMSmallPlayer.startPlayVideo();
    },

    /** 山东海看apk视频播放 */
    playVideo371002: function () {
        var postData = {
            "program_id": Play.androidVideoInfo.videoUrl,
        }
        LMEPG.ajax.postAPI("Video/getPlayUrl", postData, function (data) {
            LMEPG.Log.info("getVideoUrlWith370002 getPlayUrl result:" + JSON.stringify(data));
            if (data && data.result == 0) {
                Play.androidVideoInfo.videoUrl = data.playUrl;
                Play.playVideo4Android();
            } else {
                LMEPG.UI.showToast("获取小窗播放地址失败!");
            }
        });
    },

    /** 内蒙电信apk视频播放 */
    playVideo150002: function () {
        var attr = Play.androidVideoInfo.videoUrl.split('|');
        var params = {
            cid: attr[1],
            tid: attr[0],
        };
        console.log(params)
        LMEPG.Log.info("[V150002] getVideoRealUrl-->> 获取播放地址 params = " + JSON.stringify(params));
        LMAndroid.JSCallAndroid.getVideoRealUrl(JSON.stringify(params), function (result, notifyAndroidCallback) {
            LMEPG.Log.info("[V150002] getVideoRealUrl-->> 获取播放地址 result = " + JSON.stringify(result));
            var resParamObj = result instanceof Object ? result : JSON.parse(result);
            if (resParamObj.code == "0") {
                Player.androidVideoInfo.videoUrl = resParamObj.URL;
                Player.playVideo4Android();
            } else {
                LMEPG.UI.showToast("获取播放地址失败!");
            }
        });
    },

    /** 宁夏移动apk视频播放 */
    playVideo640001: function () {
        if (Play.androidVideoInfo.videoUrl.length < 2) {
            LMEPG.UI.showToast("视频ID格式错误！ID=" + Play.androidVideoInfo.videoUrl);
            return;
        }
        var videoUrlArr = Play.androidVideoInfo.videoUrl.split(";");
        Play.androidVideoInfo.videoUrl = "http://gslbserv.itv.cmvideo.cn/"
            + videoUrlArr[0]
            + "?channel-id=langmasp"
            + "&Contentid=" + videoUrlArr[1]
            + "&authCode=3a&stbId=005803FF00158930000050016B8A742C&usergroup=g28093100000&userToken=bc646872b5f7b79a5574a1e19b6c0e6a28vv";
        Play.playVideo4Android();
    },

    /** 广西广电apk视频播放 */
    playVideo450004: function(){
        var reqParam = {
            "serviceType": "ipqam",
            "cpId": "GDYZHYL",
            "videoType": "0",
            "videoIndex": "0",
            "cdnFlag": "gxcatv_playurl",
            "cpVideoId": Play.androidVideoInfo.videoUrl,
            "userAgent": "nn_player",
            "playStyle": "http",
            "isHttp": true
        };

        LMEPG.Log.info("home.js::doAuthAndGetMedia=start:::" + JSON.stringify(reqParam));
        LMAndroid.JSCallAndroid.doAuthAndGetMedia(JSON.stringify(reqParam), function (resParam, notifyAndroidCallback) {
            LMEPG.Log.info("home.js::doAuthAndGetMedia=" + resParam);
            var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
            LMEPG.Log.info("home.js::info=" + resParamObj.info);
            if (resParamObj.result == "0") {
                if (resParamObj.state == "0") {
                    var retUrl = resParamObj.url.replace(/\//g, "/");
                    Play.androidVideoInfo.videoUrl = retUrl;
                    Play.playVideo4Android();
                } else {
                    LMEPG.Log.info("web::获取地址失败=" + resParamObj.info);
                    LMEPG.UI.showToast("获取地址失败:" + resParamObj.info);
                }
            } else {
                LMEPG.UI.showToast("获取视频地址异常:" + resParamObj.errorInfo);
            }
        });
    },

    /**
     * 浙江华数apk播放期播放逻辑
     * @param contentId 视频注入到局方的contentId
     */
    playVideo320013: function (contentId) {
        if (!LMAndroid.isRunOnPc()) {
            // //基础地址
            var baseUrl = "http://125.210.121.175:10008/dataquery/";
            // 栏目code
            var folderCode = 'p_17_1_21_24';
            // 栏目类型 - 新闻类型
            var contentType = '13';
            //获取视频子id
            var getVideoSubId = "columnDetail"
            var getVideoUrl = "contentPlayUrl"
            var videoBitrate = '1600000';
            LMEPG.ajax.post({
                url: baseUrl + getVideoSubId + "?folderCode=" + folderCode + "&contentId=" + contentId,
                requestType: "GET",
                dataType: "json",
                data: {},
                success: function (xmlHttp, rsp) {
                    var videos = rsp.videos
                    for (var index in videos) {
                        //标清,高清暂时不支持
                        var video = videos[index];
                        if (video.bitrate == videoBitrate) {
                            var subId = video.subContentId;
                            LMEPG.ajax.post({
                                url: baseUrl + getVideoUrl + "?folderCode=" + folderCode + "&" + contentType + "&playUrlType=rtsp&contentId=" + contentId + "&subContentId=" + subId,
                                requestType: "GET",
                                dataType: "json",
                                data: {},
                                success: function (xmlHttp, rsp) {
                                    if (rsp.result == 0) {
                                        "rtsp://125.210.227.234:5541/hdds_ip/icms_icds_pub25/opnewsps25/Video/2020/09/28/08/20200927171629gylm81824494044672449414152.ts?Contentid=CP23010020200927098303&isHD=0&isIpqam=0&token=DADEA8C87155771009785ADA0BF83439EB08B150F48706E6AC21EEA795F3699243F43B5E4543AA25A6B7B412C5EBEDC0FBEC3FDFCE9B0ADABBB75802943FA1EB26E6118362B7D42D2767A062EFC5442E17450B9FB432666F1189E866A0D67D253444FCECCB9F0C7B3AEA1529849648FDBA91606B4721121C78A54F85B210B7E9018CB01C76864B6676DFEAA027A25C2190532EBB336ACC5DE8DF0405E572225803EA10AE8814C7BDDC75DCD08C518C0F1AB7751B46DD9E0A7D631D5F2B3E&beginTime=0";
                                        console.log('rsp.playUrl = ' + rsp.playUrl)
                                        LMEPG.Log.info('rsp.playUrl = ' + rsp.playUrl);
                                        var realUrl = rsp.playUrl.replace('rtsp://', '')
                                        realUrl = realUrl.substring(realUrl.indexOf('/'))
                                        realUrl = 'http://lbgslb-sihua.wasu.cn:5543' + realUrl
                                        realUrl = realUrl.replace('.ts', '.m3u8')
                                        console.log('realUrl = ' + realUrl)
                                        LMEPG.Log.info('realUrl = ' + realUrl);
                                        Play.androidVideoInfo.videoUrl = realUrl;
                                        Play.playVideo4Android();
                                    } else {
                                        LMEPG.UI.showToast("获取播放地址失败!");
                                    }
                                },
                                error: function (xmlHttp, rsp) {
                                    LMEPG.Log.error("获取播放地址失败 --->>> xmlHttp = " + xmlHttp)
                                    LMEPG.UI.showToast("获取播放地址失败!");
                                }
                            });
                        }
                    }
                },
                error: function (xmlHttp, rsp) {
                    LMEPG.Log.error("获取播放地址失败 --->>> rsp = " + JSON.stringify(rsp))
                    LMEPG.UI.showToast("获取播放地址失败!");
                }
            });
        } else {
            LMEPG.UI.showToast("获取播放地址失败!");
        }
    },

    /** Android视频小窗播放方法 */
    playVideo4Android: function () {
        Play.androidPlayerInfo.urlList = [
            Play.androidVideoInfo,
        ];
        LMEPG.Log.info("小窗播放: videoInfo = " + JSON.stringify(Play.androidPlayerInfo))
        LMAndroid.startSmallPlay(Play.androidPlayerInfo);
        LMAndroid.registSmallPlayUICallback(Play.onSmallPlayerCompleteCallback);
    },

    /** 处理首页轮播视频 */
    playHomePollVideo: function () {
        var data = Play.getCurrentPollVideoData();
        if (LMEPG.Func.isEmpty(data)) return;
        // 创建视频信息
        data.entryType = 1;
        data.entryTypeName = '首页轮播视频';
        var videoUrl = data.videoUrl;
        data.ftp_url = {
            gq_ftp_url: videoUrl,
            bq_ftp_url: videoUrl
        };
        if (RenderParam.carrierId == CARRIER_ID_SHANDONG_HICON || RenderParam.carrierId == "371002") {
            // 山东电信海看埋点上报推荐位点击事件
            var turnPageInfo = {
                currentPage: location.href,   // 当前页面
                turnPage: location.origin + "/index/Home/Player/indexV1", // 目标页面
                turnPageName: "视频播放页3",
                turnPageId: "39_" + videoUrl,
                clickId: 'video-TV'
            };
            ShanDongHaiKan.sendReportData('6', turnPageInfo);
        }
        PageJump.jumpPlayVideo(data);
    },

    /**
     * 得到当前轮播地址
     */
    getCurrentPollVideoUrl: function () {
        return RenderParam.homePollVideoList.list[Play.currPollVideoId].videoUrl;
    },

    /**
     * 得到当前轮播数据对象
     */
    getCurrentPollVideoData: function () {
        return RenderParam.homePollVideoList.list[Play.currPollVideoId];
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
            console.log("网页接收到视频播放完成消息,reason:" + reason);
            var videoCount = RenderParam.homePollVideoList.count;
            Play.currPollVideoId = Play.currPollVideoId === videoCount - 1 ? 0 : self.currPollVideoId++;
            Play.startPollPlay();
        } else {
            LMAndroid.JSCallAndroid.showToastV1("reason为空");
        }
    },

    /**
     * 播放过程中的事件
     */
    onPlayEvent: function () {
        var self = Play;
        try {
            var videoCount = RenderParam.homePollVideoList.count;
            self.currPollVideoId = self.currPollVideoId == videoCount - 1 ? 0 : self.currPollVideoId++;
            self.startPollPlay();
        } catch (e) {
            LMEPG.UI.showToast('播放出错了[' + e.toString() + ']', 2);
            LMEPG.Log.error(e.toString());
        }
    },

    /**
     * “音量+/-”按键
     */
    onVolumeChanged: function (dir) {
        LMEPG.Log.info("onVolumeChanged --> start");
        switch (dir) {
            case "up":
                if (LMEPG.mp) {
                    // 音量增加
                    LMEPG.Log.info("onVolumeChanged --> up +++");
                    LMEPG.mp.upVolume();
                }
                break;
            case "down":
                if (LMEPG.mp) {
                    // 音量减小
                    LMEPG.Log.info("onVolumeChanged --> down ---");
                    LMEPG.mp.downVolume();
                }
                break;
        }
    }
};

// 返回按钮时记录最后一次点击的时间戳
var lastKeyClickedInMilliSec = 0;
// 判断双击的最大时间间隔
var MAX_FORBID_INTERVAL = 1000;
// 双击事件定时器
var doubleClickTimer = null;
// 判断是否双击事件标识
var isDoubleClick = false;

var onBack = htmlBack = function () {
    var currentNavID = thisNavID;
    var currentFocusId = LMEPG.BM.getCurrentButton().id;
    var lastIndex = currentNavID.slice(-1);
    // 如果有促订弹窗弹出，取消促订弹窗
    switch (true) {
        // 关闭新手指导
        case currentFocusId == 'debug':
            onBackhAssist.trunOffIntroduce(currentNavID, lastIndex)
            break;
        // 跳转Tab0
        case currentNavID != 'tab-0':
            if (RenderParam.carrierId === '430002') { // 湖南电信跳转挽留页面
                PageJump.jumpHoldPage();
            } else { // 其他地区返回导航栏
                Hide('content-' + lastIndex);
                G(currentNavID).src = LMEPG.BM.getButtonById(currentNavID).backgroundImage;
                LMEPG.BM.requestFocus('tab-0');
            }
            break;
        // 跳转挽留页
        default:
            if (RenderParam.carrierId === '430002') { // 湖南电信apk，需要点击两次退出当前应用
                isDoubleClick = false;

                //行业版本直接退出
                var industryLmp = [-1,17];
                if(industryLmp.indexOf(parseInt(RenderParam.lmp)) > -1){
                    isDoubleClick = true;
                    LMAndroid.JSCallAndroid.doExitApp();
                }

                var nowTimeStamp = new Date().getTime();
                var diffInterval = nowTimeStamp - lastKeyClickedInMilliSec;
                if (diffInterval > 0 && diffInterval < MAX_FORBID_INTERVAL) { // 判断当前点击与上一次点击的时间差
                    clearTimeout(doubleClickTimer);
                    isDoubleClick = true;
                    LMAndroid.JSCallAndroid.doExitApp();
                }
                doubleClickTimer = setTimeout(function () { // 启动定时器，1秒钟以内没有再次点击按键，默认只有一次点击，跳转退出挽留页
                    if (!isDoubleClick) { // 1秒钟以内未点击按钮
                        PageJump.jumpHoldPage();
                    }
                }, MAX_FORBID_INTERVAL);
                lastKeyClickedInMilliSec = nowTimeStamp; // 更新点击事件的记录时间戳
            } else if (RenderParam.carrierId === '640001' || RenderParam.carrierId === '440001' || RenderParam.carrierId === '430012' || RenderParam.carrierId === '001006') { // 宁夏移动apk,局方要求无退出挽留页，直接退出app
                LMAndroid.JSCallAndroid.doExitApp();
            } else if (RenderParam.carrierId === '000005') { // 江苏电信(悦me)apk
                exitApp4JIANGSU_YUEME();
            } else {
                PageJump.jumpHoldPage();
            }
            break;
    }
};

/**
 * 江苏电信（悦me）apk退出挽留逻辑
 */
function exitApp4JIANGSU_YUEME() {
    if (Hold.isShowHold()) {
        Hold.appExit();
    } else {
        Hold.open();
    }
}

var Hold = {
    mainButton: null,
    buttons: [],
    pageInfo: '',
    RecommendList: [],          //挽留页推荐位数组

    //默认提示语
    message: '您确定要离开吗？这里还有很多您没体验哦！',
    cancelTxt: '再看看',
    exitTxt: '残忍离开',

    /**
     * 打开控制面板
     */
    open: function () {
        //保存进入时的焦点
        this.mainButton = LMEPG.BM.getCurrentButton();
        if (Hold.isExistHold()) {
            //存在表示以前创建过，只是被隐藏了
            S('retain');
        } else {
            Hold.initData();
            Hold.initHtml();
            Hold.initButton();
            LMEPG.BM.addButtons(Hold.buttons);
        }
        LMEPG.BM.requestFocus("continue_btn");
    },

    /**
     * 初始化数据
     */
    initData: function () {
        this.pageInfo = RenderParam.configInfo.data.entry_list;
        if (LMEPG.Func.isExist(this.pageInfo) && this.pageInfo.length > 0) {
            for (var i = 0; i < this.pageInfo.length; i++) {
                var data = this.pageInfo[i];
                switch (data.position) {
                    case "101":
                    case "102":
                    case "103":
                        this.RecommendList.push(data);
                }
            }
        }
        var exitTips = RenderParam.configInfo.data.exit_tips;
        if (LMEPG.Func.isExist(exitTips)) {
            if (LMEPG.Func.isExist(exitTips.message) && !LMEPG.Func.isEmpty(exitTips.message)) {
                this.message = exitTips.message;
            }
            if (LMEPG.Func.isExist(exitTips.cancel_txt) && !LMEPG.Func.isEmpty(exitTips.cancel_txt)) {
                this.cancelTxt = exitTips.cancel_txt;
            }
            if (LMEPG.Func.isExist(exitTips.exit_txt) && !LMEPG.Func.isEmpty(exitTips.exit_txt)) {
                this.exitTxt = exitTips.exit_txt;
            }
        }
    },

    /**
     * 初始化布局
     */
    initHtml: function () {
        var html = "";
        html += '<img class="hold_bg" src="' + g_appRootPath + '/Public/img/hd/Hold/V10/hold_bg.png"/>';
        html += '<div class="video-title">' + this.message + '</div>';
        html += '<div class="video-list">';
        for (var i = 0; i < this.RecommendList.length && i < 3; i++) {
            html += '<img id="video-' + (i + 1) + '" class="video-img" src="' + RenderParam.fsUrl + this.RecommendList[i].item_data[0].img_url + '"/>';
        }
        html += '</div>';

        html += '<div class="continue_btn">';
        html += '<img id="continue_btn" style="position: absolute;left: 0px;" src="' + g_appRootPath + '/Public/img/hd/Hold/V10/bg_hold_btn.png"/>';
        html += '<span class="continue_text">' + Hold.cancelTxt + '</span>';
        html += '</div>';

        html += '<div class="close_btn">';
        html += '<img id="close_btn" style="position: absolute;left: 0px;"  src="' + g_appRootPath + '/Public/img/hd/Hold/V10/bg_hold_btn.png"/>';
        html += '<span class="close_text">' + Hold.exitTxt + '</span>';
        html += '</div>';

        var holdPage = document.createElement("div");  //创建显示控件
        holdPage.id = "retain";
        LMEPG.CssManager.addClass(holdPage, "retain");
        holdPage.innerHTML = html;
        var body = document.body;
        body.appendChild(holdPage);
    },

    /**
     * 初始化焦点
     */
    initButton: function () {
        Hold.buttons.push({
            id: 'continue_btn',
            name: '继续',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'close_btn',
            nextFocusUp: 'video-1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/Hold/V10/bg_hold_btn.png',
            focusImage: g_appRootPath + '/Public/img/hd/Hold/V10/f_hold_btn.png',
            click: Hold.colse,
            focusChange: '',
            beforeMoveChange: '',
        });
        Hold.buttons.push({
            id: 'close_btn',
            name: '退出按钮',
            type: 'img',
            nextFocusLeft: 'continue_btn',
            nextFocusRight: '',
            nextFocusUp: 'video-1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/Hold/V10/bg_hold_btn.png',
            focusImage: g_appRootPath + '/Public/img/hd/Hold/V10/f_hold_btn.png',
            click: Hold.appExit,
            focusChange: '',
            beforeMoveChange: '',
        });

        for (var i = 0; i < this.RecommendList.length && i < 3; i++) {
            Hold.buttons.push({
                id: 'video-' + (i + 1),
                name: '视频源',
                type: 'img',
                nextFocusLeft: 'video-' + i,
                nextFocusRight: 'video-' + (i + 2),
                nextFocusUp: '',
                nextFocusDown: 'continue_btn',
                backgroundImage: "",
                focusImage: "",
                click: Page.onClickRecommendPosition,
                focusChange: Hold.departFocus,
                beforeMoveChange: '',
                cPosition: this.RecommendList[i].position, //推荐位编号
            });
        }
    },

    /**
     * 关闭控制面板
     */
    appExit: function () {
        LMEPG.UI.showMessage('退出app');
        LMAndroid.JSCallAndroid.doExitApp();
    },

    /**
     * 继续按键事件，将挽留页隐藏
     */
    colse: function () {
        if (Hold.mainButton) {
            LMEPG.BM.requestFocus(Hold.mainButton.id);
        }
        H('retain');
    },

    /**
     * 是否存在挽留弹窗
     */
    isExistHold: function () {
        return RenderParam.carrierId != '640001' && LMEPG.Func.isExist(G("retain"));
    },

    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "retention-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "retention-hover");
        }
    },

    /**
     * 是否显示挽留弹窗
     */
    isShowHold: function () {
        if (Hold.isExistHold()) {
            var visible = G("retain").style.visibility;
            if (LMEPG.Func.isEmpty(visible) || visible != 'hidden') {
                return true;
            }
        }
        return false;
    }
};

// window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
//     LMEPG.UI.logPanel.show("错误信息：" + errorMessage);
//     LMEPG.UI.logPanel.show("出错文件：" + scriptURI);
//     LMEPG.UI.logPanel.show("出错行号：" + lineNumber);
//     LMEPG.UI.logPanel.show("出错列号：" + columnNumber);
//     LMEPG.UI.logPanel.show("错误详情：" + errorObj);
// }
window.onunload = function () {
    if (RenderParam.isRunOnAndroid === '1') {
        LMAndroid.hideSmallVideo();
    } else {
        LMEPG.mp.destroy();
    }
};


