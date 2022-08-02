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
    DONATE_BLOOD_PAGE:53    //献血模块
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

// 热播榜拉取30条数据，一次显示6条，每隔5s换一次，总共换5次。可能的下标为0,1,2,3,4
var hotVideoIndex = -1;

var tab3RecommendCount = 6;

/**
 * +++++++++++++++++++++帮助图文处理逻辑+++++++++++++++++++++++++++++++++++++
 */
var HelpModal = {
    tab0FirstEnter: RenderParam.helpTabInfo['tab0'] || 0,
    tab1FirstEnter: RenderParam.helpTabInfo['tab1'] || 0,
    tab2FirstEnter: RenderParam.helpTabInfo['tab2'] || 0,
    tab3FirstEnter: RenderParam.helpTabInfo['tab3'] || 0,
    count: 0,
    previousFocusIndex: '',
    showTabHelp: function () {
        // 辽宁电信不显示新手引导页，设置促订弹窗不显示新手引导页
        /*if (RenderParam.carrierId == '640094') {
            return;
        }

        var self = HelpModal;
        var index = cutLastStr(thisNavID);                 // 得到当前tab导航对应的索引
        var curTabEnter = self.getCurrentSign(index);      // 得到当前tab对应的判断标识
        var curTabPrefix = self.getCurrentTabId(index);    // 得到当前tab对应的图片ID前缀
        if (self[curTabEnter] && G(curTabPrefix + this.count)) {
            return;                                        // 不是首次进入、元素不存在不做什么
        }
        self.updateHelpImg(curTabPrefix);                  // 任意键更新下一个帮助图片
        self.previousFocusIndex = self.count++;
        self.isLastHelpModal(curTabPrefix, curTabEnter);
        return false;*/
    },
    updateHelpImg: function (curTabPrefix) {
        LMEPG.BM.requestFocus('debug');                    // 焦点移到脚手架上
        H(curTabPrefix + this.previousFocusIndex);         // 隐藏上一个tab对应的帮助图片
        S(curTabPrefix + this.count);// 显示当前索引帮助图片
    },
    getCurrentSign: function (index) {
        return 'tab' + index + 'FirstEnter';
    },
    getCurrentTabId: function (index) {
        return 'tab' + index + '-help';
    },
    isLastHelpModal: function (curTabPrefix, curTabEnter) {
        if (!G(curTabPrefix + (this.count - 1))) {
            this[curTabEnter] = 1;                        // 标记已经进入过了（模拟异步）
            LMEPG.UI.showWaitingDialog();
            this.upLoadFirstEnter();                      // 保存用户已经进入过的导航(确保下次不再弹出)
        }
    },
    upLoadFirstEnter: function () {
        var reqData = {
            'key': thisNavID,
            'value': thisNavID,
            'userId':RenderParam.userId
        };
        LMEPG.ajax.postAPI('User/updateNoviceGuide', reqData,
            function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    var result = data.result;
                    LMEPG.UI.dismissWaitingDialog();
                    console.log(reqData, result, thisNavID);
                    LMEPG.BM.requestFocus(thisNavID);// 没有了帮助图文且成功存储则焦点送回
                } catch (e) {
                    // 调试else nothing
                }
            },
            function (rsp) {
                console.log('--->上报首次进入错误！rsp:' + rsp.toString());
                LMEPG.Log.info('--->上报首次进入错误！rsp:' + rsp.toString());
            }
        );
    }
};


/**
 * ===============================处理页面数据===============================
 */
var Page = {
    /**
     * 初始化
     */
    init: function () {
        renderNavImg();
        Page.initMarquee(); // 初始化滚动字幕
        this.renderAll();
        Tab0.Carousel.points();
        Tab1.Carousel.points();
        var tabId = LMEPG.Func.getLocationString('tabId') || 'tab-0';
        var tab2CarouselId = LMEPG.Func.getLocationString('curTab2CarouselId') || 2;
        var focusId = LMEPG.Func.getLocationString('focusId');
        tab2CarouselId = parseInt(tab2CarouselId);
        // 如果是tab2，专辑数据保持
        if (tabId == 'tab-2') {
            curTab2CarouselId = tab2CarouselId;
            if (tab2CarouselId == 0) {
                Tab2.onMoveChange('left');
                Tab2.onMoveChange('left');
            } else if (tab2CarouselId == 1) {
                Tab2.onMoveChange('left');
            } else if (tab2CarouselId > 2) {
                for (var i = 2; i < tab2CarouselId; i++) {
                    Tab2.onMoveChange('right');
                }
            }
        }
        LMEPG.ButtonManager.init(tabId, buttons, '', true);

        // 焦点恢复（如果非VIP点击“加入会员”按钮订购，变成VIP后，此按钮会隐藏，焦点需改变）
        if (focusId == 'join-vip' && LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            focusId = 'tab-3';
        }

        LMEPG.BM.requestFocus(focusId || tabId);
        LMEPG.Func.listenKey(3, [KEY_3, KEY_9, KEY_8, KEY_3], PageJump.jumpTestPage);

        // 根据不同的区域初始化:
        // this.initByCarrierId();
        // 局方数据探针接口
        LMEPG.ajax.postAPI("Debug/sendUserBehaviour",{},LMEPG.emptyFunc(),LMEPG.emptyFunc())

        setPageSize();
    },

    /** 跑马灯信息初始化 */
    initMarquee: function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            G('scroll-wrapper').innerHTML = '<marquee scrollamount="4">' + data.content + '</marquee>';
        }, function (errorInfo) {
            LMEPG.Log.error("getMarquee error: " + errorInfo)
        })
    },

    /*initByCarrierId: function () {
    },*/

    /**
     * 渲染所有
     */
    renderAll: function () {
        this.renderTab0();
        this.renderTab1();
        this.renderTab2();
        this.renderTab3();
    },

    /**
     * 渲染Tab0
     */
    renderTab0: function () {
        var list = RenderParam.configInfo.data.entry_list;
        var carousel_0Data = carouselDataList0;
        var tab_0 = Tab0;
        for (var i = 0; i < list.length; i++) {
            var data = list[i].item_data;
            switch (parseInt(list[i].position)) {
                case 11:
                    G('free-area').src = this.getImg(data[0].img_url);
                    break;
                case 12:
                    if (G('link-0')) {
                        G('link-0').src = this.getImg(data[0].img_url);
                    }
                    break;
                case 13:
                    G('link-1').src = this.getImg(data[0].img_url);
                    break;
                // banner
                case 14:
                    carousel_0Data = data;
                    tab_0.data = [];
                    for (var j = 0; j < carousel_0Data.length; j++) {
                        var tmp = {};
                        tmp.id = j;
                        tmp.src = this.getImg(carousel_0Data[j].img_url);
                        tab_0.data.push(tmp);
                    }
                    if (Tab0.data[0])
                        G('link-2-0').src = Tab0.data[0].src;
                    if (Tab0.data[1])
                        G('link-2-1').src = Tab0.data[1].src;
                    break;
                case 15:
                    G('link-3').src = this.getImg(data[0].img_url);
                    break;
                case 16:
                    for (var k = 0; k < data.length; k++) {
                        G('b-link-' + k).src = this.getImg(data[k].img_url);
                    }
                    break;
            }
        }

        // 最近播放的视频
        if (RenderParam.latestVideoInfo.result == 0 && RenderParam.latestVideoInfo.val != "undefined") {
            var videoInfo = JSON.parse(RenderParam.latestVideoInfo.val);
            G('keep-watch-title').innerHTML = '<marquee>' + videoInfo.title + '</marquee>';
        }
    },

    /**
     * 渲染Tab1
     */
    renderTab1: function () {
        var list = RenderParam.configInfo.data.entry_list;
        var carousel_1Data = carouselDataList1;
        var tab_1 = Tab1;
        for (var i = 0; i < list.length; i++) {
            var data = list[i].item_data;
            switch (parseInt(list[i].position)) {
                // banner
                case 21:
                    carousel_1Data = data;
                    tab_1.data = [];
                    for (var j = 0; j < carousel_1Data.length; j++) {
                        var tmp = {};
                        tmp.id = j;
                        tmp.src = this.getImg(carousel_1Data[j].img_url);
                        tab_1.data.push(tmp);
                    }
                    if (Tab1.data[0])
                        G('tab1-link-0').src = Tab1.data[0].src;
                    if (Tab1.data[1])
                        G('tab1-link-1').src = Tab1.data[1].src;
                    break;
                case 22:
                    G('tab1-link-2').src = this.getImg(data[0].img_url);
                    break;
                case 23:
                    G('tab1-link-3').src = this.getImg(data[0].img_url);
                    break;
                case 24:
                    G('tab1-link-4').src = this.getImg(data[0].img_url);
                    break;
                case 25:
                    G('tab1-link-5').src = this.getImg(data[0].img_url);
                    break;
            }
        }
        var cutWords = function (str, len) {
            if (str.length > len) {
                return str.slice(0, len) + '...';
            } else {
                return str;
            }
        };
        // 热播榜
        setHotVideoData();

        // 视频栏目
        var moveCount = LMEPG.Func.getLocationString('moveCount') || 0;
        Tab1.moveCount = +moveCount;
        Tab1.bottomActionData = [];
        for (var k = 0; k < videoClassList.length; k++) {
            var tmp = {};
            tmp.id = k;
            tmp.src = this.getImg(videoClassList[k].img_url);
            Tab1.bottomActionData.push(tmp);
            if (k <= 4) {
                G('bottom-link-' + k).src = this.getImg(videoClassList[k + +Tab1.moveCount].img_url);
            }
            if (k == 0) {
                G('placeholder-img-0').src = this.getImg(videoClassList[videoClassList.length - 1].img_url);
            }
            if (k == videoClassList.length - 1) {
                G('placeholder-img-1').src = this.getImg(videoClassList[0].img_url);
            }
        }

        /**
         * 设置热播视频
         */
        function setHotVideoData() {
            if (videoRankList.length == 0) {
                return;
            }
            hotVideoIndex++;
            if (hotVideoIndex == 5) {
                hotVideoIndex = 0;
            }
            var beginIndex = hotVideoIndex * 6;
            var endIndex = beginIndex + 6;

            if (beginIndex >= videoRankList.length) {
                setHotVideoData();
                return;
            }

            var hotInner = '';
            for (var i = beginIndex; i < endIndex; i++) {
                if (i < videoRankList.length) {
                    hotInner += ' <li data-title="' + videoRankList[i].title + '" id=hot-' + (i % 6) + '>' + cutWords(videoRankList[i].title, RenderParam.platformType == 'sd' ? 10 : 12);
                }
            }
            G('hot-wrap').innerHTML = hotInner;
            // 如果焦点在热播榜上，每次刷新时把焦点移到第一条
            if (LMEPG.BM.getCurrentButton() && LMEPG.BM.getCurrentButton().id.substr(0, 4) == 'hot-') {
                LMEPG.BM.requestFocus('hot-0');
            }

            setTimeout(function () {
                setHotVideoData();
            }, 10000);
        }
    },

    /**
     * 渲染Tab2
     */
    renderTab2: function () {
        Tab2.httpImg = [];
        for (var i = 0; i < albumList.length; i++) {
            var tmp = {};
            tmp.src = this.getImg(albumList[i].list_image_url.large);
            tmp.link = i;
            Tab2.httpImg.push(tmp);
        }
        Tab2.init();
    },

    /**
     * 渲染Tab3
     */
    renderTab3: function () {
        // 辽宁电信隐藏“我的”tab页面
        if (RenderParam.carrierId == '210092') {
            var item = G("content-3");
            item.parentNode.removeChild(item);
            item = G("tab-3");
            item.parentNode.removeChild(item);
            return;
        }
        //
        G('user-account').innerHTML = '账户ID：' + RenderParam.accountId;
        // 如果是vip，隐藏加入会员按钮
        if (RenderParam.isVip == 1) {
            H('join-vip');
            G('user-pic').src =g_appRootPath+ '/Public/img/hd/Home/V13/Home/Tab3/vip.png';
        }
        var configList = RenderParam.configInfo.data.entry_list;
        var recommendCount = 0;
        for (var i = 0; i < configList.length; i++) {
            var configItem = configList[i].item_data;
            switch (parseInt(configList[i].position)) {
                case 41:
                    G('tab3-link-1').src = this.getImg(configItem[0].img_url);
                    recommendCount += 1;
                    break;
                case 42:
                    G('tab3-link-2').src = this.getImg(configItem[0].img_url);
                    recommendCount += 1;
                    break;
                case 43:
                    G('tab3-link-3').src = this.getImg(configItem[0].img_url);
                    recommendCount += 1;
                    break;
                case 44:
                    G('tab3-link-4').src = this.getImg(configItem[0].img_url);
                    recommendCount += 1;
                    break;
                case 45:
                    G('tab3-link-5').src = this.getImg(configItem[0].img_url);
                    recommendCount += 1;
                    break;
                case 46:
                    G('tab3-link-6').src = this.getImg(configItem[0].img_url);
                    recommendCount += 1;
                    break;
            }
        }

        for (var j = recommendCount + 1; j <= tab3RecommendCount; j++) {
            var tabRecommendId = 'tab3-link-' + j;
            Hide(tabRecommendId);
        }

        Tab3.init();
    },

    /**
     * 推荐位点击事件
     * @param btn
     */
    onClickRecommendPosition: function (btn) {
        var pos = btn.cPosition;
        // 小窗视频（tab0 二号位）
        if (pos == 12) {
            // 辽宁电信小窗位置为普通推荐位
            if (RenderParam.carrierId != '210092' && RenderParam.carrierId != '370092') {
                // 跳转全屏播放页面
                Play.playHomePollVideo(btn);
                return;
            }
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
        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(pos, itemData.order);
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
                PageJump.jumpMoreVideos(itemData);
                break;
            case HomeEntryType.HEALTH_VIDEO:
                // 视频播放
                var videoData = JSON.parse(itemData.inner_parameters);
                var play_url = videoData.ftp_url;
                var videoObj = play_url instanceof Object ? play_url : JSON.parse(play_url);
                var videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

                // 创建视频信息
                var videoInfo = {
                    'sourceId': videoData.source_id,
                    'videoUrl': videoUrl,
                    'title': videoData.title,
                    'type': videoData.model_type,
                    'userType': videoData.user_type,
                    'freeSeconds': videoData.free_seconds,
                    'entryType': 1,
                    'entryTypeName': 'home',
                    'focusIdx': btn.id,
                    'unionCode': videoData.union_code
                };
                PageJump.jumpPlayVideo(videoInfo);
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
            case HomeEntryType.ALBUM_UI:
            case HomeEntryType.ALBUM_GRAPHIC:
                PageJump.jumpAlbumPage(JSON.parse(itemData.parameters)[0].param, btn);
                break;
            case HomeEntryType.GUAHAO_HOME:
                PageJump.jumpGuaHaoPage();
                // 挂号主页
                break;
            case HomeEntryType.NIGHTPHARMACY:
                PageJump.jumpNightpharmacy();
                // 夜间药房
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
            case HomeEntryType.VIDEO_INQUIRY_RECORD:
                // 视频问医记录 -- 待完成，需要家庭成员
                break;
            case HomeEntryType.REGISTER_RECORD:
                // 挂号记录 -- 待完成
                break;
            case  HomeEntryType.DETECT_HEALTH_RECORD:
                // 健康检测记录 -- 待完成，需要家庭成员
                break;
            case HomeEntryType.FAMILY_ARCHIVES:
            case HomeEntryType.FAMILY_MEMBER:
                PageJump.jumpCommon('familyEdit');
                break;
            case HomeEntryType.ABOUT_OURS:
                // 关于我们 -- 待完成，需要跳转帮助页面再显示关于我们
                break;
            case HomeEntryType.PURCHASE_DEVICE_RECORD:
                break;
            case HomeEntryType.PLAY_VIDEO_RECORD:
                PageJump.jumpCommon('historyPlay');
                break;
            case HomeEntryType.GRAPHIC_DETAIL:
                var graphicJson = JSON.parse(itemData.parameters);
                var graphicId = graphicJson[0]['param'];
                PageJump.jumpGraphicDetail(graphicId);
                break;
            case HomeEntryType.THIRD_PARTY_URL:
                //跳转第三方网页
                PageJump.jumpThirdPartyUrl(JSON.parse(itemData.parameters)[0].param);
                break;
            case HomeEntryType.EPIDEMIC:
                //跳转第三方网页
                PageJump.jumpEpidemic();
                break;
            case HomeEntryType.DONATE_BLOOD_PAGE:
                // 献血模块
                PageJump.jumpDonateBloodPage();
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
        var videoData = videoRankList[parseInt(btn.id.substr(4)) + (hotVideoIndex * 6)];
        var play_url = videoData.ftp_url;
        var videoObj = play_url instanceof Object ? play_url : JSON.parse(play_url);
        var videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
        // 创建视频信息
        var videoInfo = {
            'sourceId': videoData.source_id,
            'videoUrl': videoUrl,
            'title': videoData.title,
            'type': videoData.model_type,
            'userType': videoData.user_type,
            'freeSeconds': videoData.free_seconds,
            'entryType': 1,
            'entryTypeName': 'home',
            'focusIdx': btn.id,
            'unionCode': videoData.union_code
        };
        PageJump.jumpPlayVideo(videoInfo);
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
    }
};

/**
 * ===============================处理跳转===============================
 */
var PageJump = {

    /** 通用页面跳转方法 */
    jumpCommon: function (routerId) {
        LMEPG.Intent.jump(LMEPG.Intent.createIntent(routerId), getCurPageObj());
    },

    /**跳转 - 播放器*/
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

    /**跳转->专家约诊首页*/
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

    /**跳转->视频问诊*/
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

        var objEpidemic = LMEPG.Intent.createIntent('report-index');
        objEpidemic.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objEpidemic, objHome);
    },

    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName) {
        var objHome = getCurPageObj();
        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**跳转->健康检测*/
    jumpHealthMeasure: function (btn) {
        var objSrc = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('testIndex');
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**跳转继续播放*/
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

    /**跳转 - 挽留页*/
    jumpHoldPage: function () {
        var objHome = getCurPageObj();
        var objHold = LMEPG.Intent.createIntent('hold');
        objHold.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objHold, objHome, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**跳转到3983测试页*/
    jumpTestPage: function () {
        var objHome = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('testEntrySet');
        objDst.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objDst, objHome);
    },

    /**跳转到视频集*/
    jumpVideoListPage: function (subjectId) {
        var objHome = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('channelList');
        objDst.setParam('subject_id', subjectId);
        LMEPG.Intent.jump(objDst, objHome);
    },

    /**跳转 -- 预约挂号*/
    jumpGuaHaoPage: function () {
        var objHome = getCurPageObj();
        var objAlbum = LMEPG.Intent.createIntent('appointmentRegister');
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**跳转 -- 夜间药房*/
    jumpNightpharmacy: function () {
        var objCurrent = getCurPageObj();
        objCurrent.setParam("userId", RenderParam.userId);
        objCurrent.setParam("fromId", "1");
        objCurrent.setParam("page", "0");

        var objCollect = LMEPG.Intent.createIntent("nightMedicine");
        objCollect.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objCollect, objCurrent);
    },

    /**跳转 -- 一级视频/二级视频*/
    jumpMoreVideos: function (itemData) {
        console.log(itemData);
        var inner_parameters = JSON.parse(itemData.inner_parameters);
        var parameters = JSON.parse(itemData.parameters);
        var modelName = inner_parameters.title;
        var modelType = parameters[0].param;
        var objHome = getCurPageObj();
        var pageName;
        if (inner_parameters.level == 1) {
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
     * 跳转第三方网页
     * @param url 网页地址
     */
    jumpThirdPartyUrl: function (url) {
        window.location.href = url;
    },

    /**
     * 跳转->献血模块
     */
    jumpDonateBloodPage: function () {
        var objCurrent = getCurPageObj();

        var objHome = LMEPG.Intent.createIntent("commonweal");
        LMEPG.Intent.jump(objHome, objCurrent);
    },
};

/**
 * ===============================处理首页小窗口视频轮播===============================
 */
var Play = {
    currPollVideoId: 0,     //当前轮播id
    /**启动小窗播放*/
    startPollPlay: function () {
        if (RenderParam.homePollVideoList.count == 0) {
            return;
        }
        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        var videoUrl = Play.getCurrentPollVideoUrl(); //播放地址
        if(typeof ottService != 'undefined') ottService.playVod(videoUrl, 70, 172, 347, 194);
    },

    /**停止小船播放*/
    stopPollPlay:function(){
        LMEPG.Log.debug("stopPollPlay... ...");
        if(typeof ottService != 'undefined') ottService.stopTrailer();
    },

    /** 处理首页轮播视频 */
    playHomePollVideo: function () {
        var data = Play.getCurrentPollVideoData();
        if (LMEPG.Func.isEmpty(data)) return;
        // 创建视频信息
        var videoInfo = {
            'sourceId': data.sourceId,
            'videoUrl': data.videoUrl,
            'title': data.title,
            'type': data.modelType,
            'userType': data.userType,
            'freeSeconds': data.freeSeconds,
            'entryType': 1,
            'entryTypeName': '首页轮播视频',
            'unionCode': data.unionCode
        };

        PageJump.jumpPlayVideo(videoInfo);

    },

    /**得到当前轮播地址*/
    getCurrentPollVideoUrl: function () {
        return RenderParam.homePollVideoList.list[Play.currPollVideoId].videoUrl;
    },

    /**得到当前轮播数据对象*/
    getCurrentPollVideoData: function () {
        return RenderParam.homePollVideoList.list[Play.currPollVideoId];
    },

    /**播放过程中的事件*/
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

    /** “音量+/-”按键 */
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
    },
};

var onBack = htmlBack = function () {
    var currentNavID = thisNavID;
    var currentFocusId = LMEPG.BM.getCurrentButton().id;
    // 如果有促订弹窗弹出，取消促订弹窗
    switch (true) {
        // 关闭新手指导
        case currentFocusId == 'debug':
            var HelpModalPath = HelpModal;
            // 标记已进入
            HelpModalPath[HelpModalPath.getCurrentSign(cutLastStr(currentNavID))] = 1;
            // 隐藏当前显示的help
            H(HelpModalPath.getCurrentTabId(cutLastStr(currentNavID)) + (HelpModalPath.count - 1));
            // 上报进入记录
            HelpModalPath.upLoadFirstEnter();
            break;
        // 跳转Tab0
        case currentNavID != 'tab-0':
            Hide('content-' + cutLastStr(currentNavID));
            G(currentNavID).src = LMEPG.BM.getButtonById(currentNavID).backgroundImage;
            LMEPG.BM.requestFocus('tab-0');
            break;
        // 跳转挽留页
        default:
            // 检测是否是订购次数取消订购弹窗
            PageJump.jumpHoldPage();
            break;
    }
};


window.onunload = function () {
    if(typeof ottService != 'undefined') ottService.stopTrailer();
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
                callback(data.album_id);
            } else {
                LMEPG.UI.showToast('获取视频集id失败!');
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    }
};

/**
 * 重新设置分辨率，河南有盒子会出现页面放大情况，原因是高清盒子使用了标清页面
 */
function setPageSize() {
    var meta = document.getElementsByTagName('meta');
    //LMEPG.Log.error("task::setPageSize ---> meta" + meta);
    if (typeof meta !== "undefined") {
        if (RenderParam.platformType == "hd") {
            meta["page-view-size"].setAttribute('content', "1280*720");
        } else {
            meta["page-view-size"].setAttribute('content', "640*530");
        }

        // LMEPG.Log.error("task::setPageSize ---> meta set 1280*720");
    }
    //LMEPG.Log.error("task::setPageSize ---> meta end");
    setTimeout(setPageSize, 500);
}