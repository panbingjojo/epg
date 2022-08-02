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
    ENTRY_APP: 58 //应用跳转
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

var cutDown = 5;
var timer = null
var tempId = ''
/**
 * ===============================处理页面数据===============================
 */
var Page = {

    init: function () {
        this.renderNavImg();
        this.initMarquee();
        this.getLocationInitParam();
        this.isVipToDo();
        this.addPopButton()
        this.setPageSize();
        LMEPG.ButtonManager.init(this.tabId, buttons, '', true);
        if (RenderParam.areaCode==='207'){
            //alert("fan"+RenderParam.areaCode);
            LMEPG.BM.requestFocus(this.focusId || "free-area");
            G('tab-0').src = RenderParam.fsUrl + RenderParam.navConfig[0].img_url.focus_out;
        }else{
            LMEPG.BM.requestFocus(this.focusId || this.tabId);
        }
        LMEPG.Func.listenKey(3, [KEY_3, KEY_9, KEY_8, KEY_3], PageJump.jumpTestPage);
        // LMEPG.Func.listenKey(4, [KEY_4, KEY_9, KEY_8, KEY_4], PageJump.jumpMoFang);
        //this.isSD(); // 3.16 需求更改
        this.someFKCPIdea();
        this.setBeiJingModule(); // 设置背景模块方案
    },
    addPopButton:function(){
        LMEPG.BM.addButtons([
            {
                id: 'pop-back',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'pop-continue',
                nextFocusUp: '',
                backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V16/Home/back.png",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V16/Home/back-choose.png",
                click: function () {
                    LMEPG.Intent.back('IPTVPortal')
                },
                focusChange: '',
                beforeMoveChange: '',
                moveChange: "",
            }, {
                id: 'pop-continue',
                type: 'img',
                nextFocusLeft: 'pop-back',
                nextFocusRight: '',
                nextFocusUp: '',
                backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V16/Home/continue.png",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V16/Home/continue-choose.png",
                click: function () {
                    H('pop')
                    clearInterval(timer)
                    cutDown = 5
                    LMEPG.BM.requestFocus(tempId)
                },
                focusChange: '',
                beforeMoveChange: '',
                moveChange: "",
            }
        ])
    },

    /** 跑马灯信息初始化 */
    initMarquee: function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            G('scroll-wrapper').innerHTML = '<marquee scrollamount="4">' + data.content + '</marquee>';
        }, function (errorInfo) {
            LMEPG.Log.error("getMarquee error: " + errorInfo)
        })
    },

    setBeiJingModule: function () {
        if (RenderParam.areaCode !== '205') return;
        //1）北京地区隐藏导航栏ID 2，客户端展示順移补位
        //2）优选专题拉取图文专辑列表，拉取规则同视频专辑
        //3）首页小窗可当成普通推荐位配置，此需求已在IPTV后台管理系统需求文档-20200320-1体现
        //4）继续观看拉取单条图文，拉取规则同拉单集视频
        //5）我的家：隐藏播放记录
        //隐藏我的收藏中的视频、视频集
        //客户端展示順移补位
        var epg = LMEPG;
        set_1();
        set_2();
        set_3();
        set_4();
        set_5();
        setBtnClickAction();

        function set_1() {
            var ID2Btn = epg.BM._buttons['tab-1'];
            delNode('tab-1');
            epg.BM._buttons['tab-0'].nextFocusRight = ID2Btn.nextFocusRight;
            epg.BM._buttons['tab-2'].nextFocusLeft = ID2Btn.nextFocusLeft;
        }

        function set_2() {
            // set areaCode different in MainController.class.php.
        }

        function set_3() {
            // ----由后台配置成图文专辑
        }

        function set_4() {
            // ----jumpContinuePlay
        }

        function set_5() {
            delNode('tab3-link-2');
            delNode('help');
            G('tab3-link-4').style.display = 'inline';
            epg.BM._buttons['tab-4'].nextFocusDown = 'tab3-link-1';
            epg.BM._buttons['tab3-link-1'].nextFocusRight = 'tab3-link-3';
            epg.BM._buttons['tab3-link-3'].nextFocusLeft = 'tab3-link-1';
            epg.BM._buttons['tab3-link-4'].nextFocusUp = 'tab-4'; // 改 “专家约诊” 上移到焦点k
            epg.BM._buttons['tab3-link-4'].nextFocusLeft = 'tab3-link-3'; // 改 “专家约诊” 按左移动到我的收藏
        }

        function setBtnClickAction() {
            epg.BM._buttons['join-vip'].click = function () {
                epg.UI.showToast('该功能完善中~', 1);
            };
            epg.BM._buttons['vip'].click = function () {
                epg.UI.showToast('该功能完善中~', 1);
            }
        }
    },
    someFKCPIdea: function () {
        //联通首页 下方5个推荐位调整成4个
        // delNode('b-link-4');
        // LMEPG.BM._buttons['link-1'].nextFocusDown = 'b-link-1';
        // LMEPG.BM._buttons['link-2'].nextFocusDown = 'b-link-2';
        // LMEPG.BM._buttons['link-3'].nextFocusDown = 'b-link-3';
        // LMEPG.BM._buttons['b-link-1'].nextFocusUp = 'link-1';
        // LMEPG.BM._buttons['b-link-2'].nextFocusUp = 'link-2';
        // LMEPG.BM._buttons['b-link-3'].nextFocusUp = 'link-3';

        if (RenderParam.areaCode === '205') return;
        // G('record-container').removeChild(G('tab3-link-4'));
    },
    test: function () {
        // 跳转北京联通测试
        window.location.href = "http://10.254.30.100:40020/index.php?lmuf=0&lmsl=hd&lmcid=000051&lmsid=sadf&UserID=cutv201711272160144_205&LoginID=vern&resolution=hd";
    },
    isSD: function () {
        if (RenderParam.platformType === 'sd' || RenderParam.areaCode == '216') {
            Hide('tab-3');
            LMEPG.BM._buttons['tab-2'].nextFocusRight = 'tab-4';
            LMEPG.BM._buttons['tab-4'].nextFocusLeft = 'tab-2';
            return true;
        }
    },
    /**
     * 重新设置分辨率，河南有盒子会出现页面放大情况，原因是高清盒子使用了标清页面
     */
    setPageSize: function () {
        var isCUCCPush = typeof window.mp != 'undefined';
        if(!isCUCCPush){
            var meta = document.getElementsByTagName('meta');
            var contentSize = meta["page-view-size"].getAttribute('content');
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
            if (contentSize !== '1280*720' || contentSize !== '640*530') {
                setTimeout(Page.setPageSize, 500);
            }
        }
    },

    /*渲染导航条背景*/
    renderNavImg: function () {
        var count = RenderParam.navConfig && RenderParam.navConfig.length;
        var htm = [];
        while (count--) {
            var itemSrc = RenderParam.fsUrl + RenderParam.navConfig[count].img_url.normal;
            htm.push('<img id="tab-' + count + '" src="' + itemSrc + '">');
        }
        G('nav-content-tabs').innerHTML = htm.reverse().join(' ');
    },

    isVipToDo: function () {
        // 焦点恢复（如果非VIP点击“加入会员”按钮订购，变成VIP后，此按钮会隐藏，焦点需改变）
        if (this.focusId == 'join-vip' && LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) this.focusId = 'tab-3';

    },
    getLocationInitParam: function () {
        this.tabId = LMEPG.Func.getLocationString('tabId') || 'tab-0';
        this.focusId = LMEPG.Func.getLocationString('focusId');
        this.tab2CarouselId = +LMEPG.Func.getLocationString('curTab2CarouselId') || 2;
    },
    /**
     * 推荐位点击事件
     * @param btn
     */
    onClickRecommendPosition: function (btn) {
        var pos = btn.cPosition;
        // 联通山东/山西/辽宁/河南/内蒙（13 14 15 21 22）推荐位非vip直接跳转订购
        if (RenderParam.carrierId == '000051' && RenderParam.isVip == 0) {
            if (RenderParam.areaCode == '216' || RenderParam.areaCode == '207' || RenderParam.areaCode == '209'
                || RenderParam.areaCode == '204' || RenderParam.areaCode == '208') {
                if (pos == 13 || pos == 14 || pos == 21 || pos == 22) {
                    PageJump.jumpBuyVip('', undefined, undefined, 1);
                    return;
                }
            }
        }

        // 小窗视频（tab0 二号位）
        if (pos == 12 && RenderParam.areaCode !== '204') {
            var data = Play.getCurrentPollVideoData();
            if (data.showStatus == "3") {
                LMEPG.UI.showToast('该节目已下线');
                return;
            }

            // 辽宁电信小窗位置为普通推荐位
            if (RenderParam.carrierId != '210092') {
                // 联通山东/山西/辽宁/河南/内蒙，非vip直接跳转订购页
                if (RenderParam.carrierId == '000051' && RenderParam.isVip == 0) {
                    if (RenderParam.areaCode == '216' || RenderParam.areaCode == '207' || RenderParam.areaCode == '209'
                        || RenderParam.areaCode == '204' || RenderParam.areaCode == '208') {
                        PageJump.jumpBuyVip('', undefined, undefined, 1);
                        return;
                    }
                }
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
                var sourceId = videoData.source_id;
                if (typeof (sourceId) == 'undefined' || sourceId === "") {
                    try {
                        sourceId = JSON.parse(itemData.parameters)[0].param; //解决首页推荐位视频videoData中source_id未定义
                    } catch (e) {
                    }
                }

                // 创建视频信息
                var videoInfo = {
                    'sourceId': sourceId,
                    'videoUrl': videoUrl,
                    'title': videoData.title,
                    'type': videoData.model_type,
                    'userType': videoData.user_type,
                    'freeSeconds': videoData.free_seconds,
                    'entryType': 1,
                    'entryTypeName': 'home',
                    'focusIdx': btn.id,
                    'unionCode': videoData.union_code,
                    'show_status': videoData.show_status
                };
                //视频专辑下线处理
                if (videoInfo.show_status == "3") {
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
            case HomeEntryType.ENTRY_APP:
                //跳转魔方
                PageJump.jumpThirdPartySP('10000051');
                break;
        }
    },

    /**
     * 点击Tab2的专辑
     */
    onClickTab2Album: function (btn) {
        // 联通山东/山西/辽宁/河南/内蒙，该专辑非vip直接跳转订购页
        if (RenderParam.carrierId == '000051' && RenderParam.isVip == 0) {
            if (RenderParam.areaCode == '216' || RenderParam.areaCode == '207' || RenderParam.areaCode == '209'
                || RenderParam.areaCode == '204' || RenderParam.areaCode == '208') {
                if (albumList[curTab2CarouselId].alias_name == 'album211') {
                    PageJump.jumpBuyVip('', undefined, undefined, 1);
                    return;
                }
            }
        }
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
            'unionCode': videoData.union_code,
            'show_status': videoData.show_status
        };
        //视频专辑下线处理
        if (videoInfo.show_status == "3") {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }
        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            PageJump.jumpPlayVideo(videoInfo);
        } else {
            PageJump.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },

    /**
     * 获取完整路径图片地址
     */
    getImg: function (relativeUrl) {
        return RenderParam.fsUrl + relativeUrl;
    },

    setCornerMark: function (elementId, imageSrc) {
        if (imageSrc) {
            G(elementId).src = this.getImg(imageSrc);
        }
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
     * 根据id获取按钮，按钮可能未初始化
     * @param id
     */
    getButtonById: function (id) {
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].id == id) {
                return buttons[i];
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

    /**跳转购买vip页面*/
    jumpBuyVip: function (remark, videoInfo, orderType, isDirectPay) {
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
        jumpObj.setParam("isPlaying", "0");
        jumpObj.setParam("remark", remark);
        if (typeof (isDirectPay) !== "undefined") {
            jumpObj.setParam("directPay", isDirectPay);
        }

        LMEPG.Intent.jump(jumpObj, objCurrent);
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
     * 跳转 -- 专辑页面
     * @param albumName
     * @param isLatest
     */
    jumpAlbumPage: function (albumName, isLatest) {
        var objHome = getCurPageObj();
        var objAlbum = LMEPG.Intent.createIntent('album');
        var unionCode = isLatest === 'latestAlbum' ? albumName.union_code : 0;
        albumName = isLatest === 'latestAlbum' ? unionCode ? 'TemplateAlbum' : albumName.alias_name : albumName;
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('graphicCode', unionCode); // 图文编码
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
        var latestInfo = RenderParam.areaCode === '205' ? RenderParam.latestAlbumInfo : RenderParam.latestVideoInfo;
        if (latestInfo.result == 0 && latestInfo.val && latestInfo.val !== 'null') {
            LMEPG.UI.showToast('已为您继续播放', 1, function () {
                var infoVal = latestInfo.val instanceof Object ? latestInfo.val : JSON.parse(latestInfo.val);
                if (RenderParam.areaCode === '205') {
                    PageJump.jumpAlbumPage(infoVal, 'latestAlbum');
                } else {
                    PageJump.jumpPlayVideo(infoVal);
                }
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
        // 跳转3983前 先注销小窗播放
        LMEPG.mp.destroy();

        var objHome = getCurPageObj();
        var objDst = LMEPG.Intent.createIntent('testEntrySet');
        objDst.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objDst, objHome);
    },

    /**跳转到3983测试页*/
    jumpMoFang: function () {
        window.location.href = "http://10.254.30.100:40050/index.php?lmuf=0&lmsl=hd&lmcid=10000051&lmsid=Album162&UserID=cutv201&LoginID=cutv201711272010200&tvPlatForm=&carrierId=211&type=11&resolution=hd&feeAccoutCode=vern&UserToken=0E344A67656332ED4F708ED9D7C3230&StbVendor=HUWEI&BuyWebUrl=&BuyService=&RechargeUrl=&PlatformExt=&HomeUrl=http%3A%2F%2F202.99.114.62   %3A35807%2Fepg_uc%2Freturn.action%3FreturnUrl%3DaHR0cDovLzIwMi45OS4xMTQuNjI6MzU4MDcvZXBnX3VjL3Nob3BwaW5nLmFjdGlvbj9yZXR1cm5Vcmw9JTJGZXBnX3VjJTJGcmVjb21tZW5kcy5hY3Rpb24mY3VycmVudFBvc3Rpb249MywxJlVzZXJJRD12ZXJu&ReturnUrl=http%3A%2F%2F202.99.114.62   %3A35807%2Fepg_uc%2Freturn.action%3FreturnUrl%3DaHR0cDovLzIwMi45OS4xMTQuNjI6MzU4MDcvZXBnX3VjL3Nob3BwaW5nLmFjdGlvbj9yZXR1cm5Vcmw9JTJGZXBnX3VjJTJGcmVjb21tZW5kcy5hY3Rpb24mY3VycmVudFBvc3Rpb249MywxJlVzZXJJRD12ZXJu";
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
        var objAlbum = LMEPG.Intent.createIntent('indexStatic');
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**跳转 -- 夜间药房*/
    jumpNightpharmacy: function () {
        var objHome = getCurPageObj();
        var objAlbum = LMEPG.Intent.createIntent('nightPharmacy');
        LMEPG.Intent.jump(objAlbum, objHome);
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
     * 疫情模块接口
     */
    jumpEpidemic: function () {
        var objHome = getCurPageObj();

        var objEpidemic = LMEPG.Intent.createIntent('report-index');
        objEpidemic.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objEpidemic, objHome);
    },
    // 跳转到其他第三方sp
    jumpThirdPartySP: function (carrierId) {
        var objTestServer = LMEPG.Intent.createIntent('third-party-sp');
        objTestServer.setParam('userId', RenderParam.userId);
        objTestServer.setParam('carrierId', carrierId);
        objTestServer.setParam('isTest', '1');
        LMEPG.Intent.jump(objTestServer);
    },
};

/**
 * ===============================处理首页小窗口视频轮播===============================
 */
var Play = {
    currPollVideoId: 0,     //当前轮播id
    /**启动小窗播放*/
    startPollPlay: function () {
        if (RenderParam.homePollVideoList.count == 0 || RenderParam.areaCode === '204') {
            return;
        }
        // 避免多次调用
        var globalPath = RenderParam;
        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        LMEPG.mp.destroy();
        var videoUrl = Play.getCurrentPollVideoUrl(); //播放地址
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
            'unionCode': data.unionCode,
            'show_status': data.showStatus
        };

        //视频专辑下线处理
        if (videoInfo.show_status == "3") {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }
        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            PageJump.jumpPlayVideo(videoInfo);
        } else {
            PageJump.jumpBuyVip(videoInfo.title, videoInfo);
        }
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
    }
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
        // 优先消失科室界面    3.0版本模块优化科室选择已在主页移除
        // case Department.isShow:
        //     Hide('department-container');
        //     Doctor.moveToFocus('dept-name');
        //     delete Department.isShow;
        //     break;
        // 跳转Tab0
        case currentNavID != 'tab-0':
            Hide('content-' + cutLastStr(currentNavID));
            G(currentNavID).src = LMEPG.BM.getButtonById(currentNavID).backgroundImage;
            LMEPG.BM.requestFocus('tab-0');
            break;
        // 跳转挽留页
        default:
	    // var isCUCCPush = typeof window.mp != 'undefined';
            //if(isCUCCPush) {
            //    LMEPG.Intent.back('IPTVPortal');
            //}else { // 检测是否是订购次数取消订购弹窗
                PageJump.jumpHoldPage();
            //}
            break;
    }
};


window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
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
 * +++++++++++++++++++++帮助图文处理逻辑+++++++++++++++++++++++++++++++++++++
 */
var HelpModal = {
    tab0FirstEnter: RenderParam.helpTabInfo['tab0'] || 0,
    tab1FirstEnter: RenderParam.helpTabInfo['tab1'] || 0,
    tab2FirstEnter: RenderParam.helpTabInfo['tab2'] || 0,
    tab3FirstEnter: RenderParam.helpTabInfo['tab3'] || 0,
    tab4FirstEnter: RenderParam.helpTabInfo['tab4'] || 0,
    count: 0,
    previousFocusIndex: '',
    showTabHelp: function (index, bol) {
        if (index == 3 && !bol) return; // 在线问医异常操作完后在执行
        // 辽宁电信不显示新手引导页，设置促订弹窗不显示新手引导页
        if (RenderParam.areaCode == '205' || RenderParam.carrierId == '210092' || RenderParam.payMethod.data.list.length != 0) {
            return;
        }
        var self = HelpModal;
        var index = cutLastStr(thisNavID);                 // 得到当前tab导航对应的索引
        var curTabEnter = self.getCurrentSign(index);      // 得到当前tab对应的判断标识
        var curTabPrefix = self.getCurrentTabId(index);    // 得到当前tab对应的图片ID前缀
        if (self[curTabEnter] && G(curTabPrefix + this.count)) {
            if (RenderParam.carrierId == '000051' && RenderParam.areaCode == '207' && thisNavID == 'tab-0') {
                Page.focusId = LMEPG.Func.getLocationString('focusId') || 'free-area';
            }
            return;                                        // 不是首次进入、元素不存在不做什么
        }
        self.updateHelpImg(curTabPrefix);                  // 任意键更新下一个帮助图片
        self.previousFocusIndex = self.count++;
        self.isLastHelpModal(curTabPrefix, curTabEnter);
        return false;
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
            'userId': RenderParam.userId
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

LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_1:' keyClick()',
        KEY_2: 'keyClick()',
        KEY_4: 'keyClick()',
        KEY_5: 'keyClick()',
        KEY_6: 'keyClick()',
        KEY_7: 'keyClick()',
        KEY_8: 'keyClick()',
        KEY_9: 'keyClick()',
        KEY_0: 'keyClick()',
    });

function keyClick() {
        S('pop')
        G('cut-down').innerHTML = cutDown
        tempId = LMEPG.BM.getCurrentButton().id
        LMEPG.BM.requestFocus('pop-back')

        timer = setInterval(function () {
            cutDown--
            G('cut-down').innerHTML = cutDown;
            if(cutDown < 0){
                H('pop')
                clearInterval(timer)
                LMEPG.Intent.back('IPTVPortal')
            }

        },1000)
}