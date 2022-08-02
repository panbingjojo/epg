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
    EPIDEMIC: 48 // 疫情模块
};

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
        if (RenderParam.carrierId == '210092' || RenderParam.payMethod.data.list.length != 0) {
            return;
        }

        var self = HelpModal;
        var index = thisNavID.slice(-1);                   // 得到当前tab导航对应的索引
        var curTabEnter = self.getCurrentSign(index);      // 得到当前tab对应的判断标识
        var curTabPrefix = self.getCurrentTabId(index);    // 得到当前tab对应的图片ID前缀
        if (self[curTabEnter] && G(curTabPrefix + this.count)) {
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
        this.getLocationParam();
        this.renderNav();
        this.initMarquee();
        Tab0.init();
        Tab1.init();
        Tab2.init();
        Tab3.init();
        this.isVipToDo();
        this.setPageSize();
        LMEPG.ButtonManager.init(this.tabId, buttons, '', true);
        LMEPG.BM.requestFocus(this.focusId || this.tabId);
        LMEPG.Func.listenKey(3, [KEY_3, KEY_9, KEY_8, KEY_3], PageJump.jumpTestPage);
        LMEPG.Func.listenKey(4, [KEY_4, KEY_9, KEY_8, KEY_4], Page.test);
        this.isSD();
        // 根据不同的区域初始化
        this.initByCarrierId();
    },

    /** 跑马灯信息初始化 */
    initMarquee: function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            G('scroll-wrapper').innerHTML = '<marquee scrollamount="4">' + data.content + '</marquee>';
        }, function (errorInfo) {
            LMEPG.Log.error("getMarquee error: " + errorInfo)
        })
    },

    test: function () {
        // LMEPG.Intent.jump(LMEPG.Intent.createIntent('hospital-index'));
    },
    isSD: function () {
        if (RenderParam.platformType === 'sd') {
            // do something
        }
    },
    /*渲染导航条背景*/
    renderNav: function () {
        var count = RenderParam.navConfig && RenderParam.navConfig.length;
        var htm = '';
        var itemSrc = '';
        while (count--) {
            itemSrc = RenderParam.fsUrl + RenderParam.navConfig[count].img_url.normal;
            htm = '<img id="tab-' + count + '" src="' + itemSrc + '">' + htm;
        }
        G('nav-content-tabs').innerHTML = htm;
    },

    isVipToDo: function () {
        // 焦点恢复（如果非VIP点击“加入会员”按钮订购，变成VIP后，此按钮会隐藏，焦点需改变）
        if (this.focusId == 'join-vip' && LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) this.focusId = 'tab-3';

    },
    getLocationParam: function () {
        this.tabId = LMEPG.Func.getLocationString('tabId') || 'tab-0';
        this.focusId = LMEPG.Func.getLocationString('focusId');
        this.tab2CarouselId = +LMEPG.Func.getLocationString('curTab2CarouselId') || 2;
    },

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
    initByCarrierId: function() {
        if(RenderParam.carrierId == "370092"){
            // 山东电信需对音量键做监听操作
            LMEPG.KeyEventManager.addKeyEvent(
                {
                    KEY_VOL_UP: 'Play.onVolumeChanged("up")',        // 音量+
                    KEY_VOL_DOWN: 'Play.onVolumeChanged("down")',      // 音量+
                }
            );
        };
        // 甘肃电信EPG 首页改版
        if(RenderParam.carrierId == "620092"){
            var epg = LMEPG;
            set_1();
            set_2();
            set_3();
            set_4();
            set_5();
            // 调整首页tab 菜单
            function set_1() {
                var ID2Btn = LMEPG.BM._buttons['tab-1'];
                delNode('tab-1');
                LMEPG.BM._buttons['tab-0'].nextFocusRight = ID2Btn.nextFocusRight;
                LMEPG.BM._buttons['tab-2'].nextFocusLeft = ID2Btn.nextFocusLeft;

                delNode('search');
                LMEPG.BM._buttons['tab-0'].nextFocusUp = 'mark';
                LMEPG.BM._buttons['tab-2'].nextFocusUp = 'mark';
                LMEPG.BM._buttons['tab-3'].nextFocusUp = 'mark';
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
                delNode('tab3-link-3');
                delNode('tab3-link-4');
                delNode('help');
            }
        }
    },
    /**
     * 重新设置分辨率，河南有盒子会出现页面放大情况，原因是高清盒子使用了标清页面
     */
    setPageSize: function () {
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
        // setTimeout(Page.setPageSize, 500);
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
        if(videoData.show_status == "3") {
            LMEPG.UI.showToast('该节目已下线',1);
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
     * 推荐位点击事件
     * @param btn
     */
    onClickRecommendPosition: function (btn) {
        var pos = btn.cPosition;
        // 小窗视频（tab0 二号位）
        if (pos == 12) {
            // 辽宁电信小窗位置为普通推荐位
            if (RenderParam.carrierId != '210092' && RenderParam.carrierId != '370092'&& RenderParam.carrierId != '620092') {
                // 跳转全屏播放页面
                Play.playHomePollVideo(btn);
                return;
            }
        }
        // 其他推荐位
        var entryItem = Page.getRecommendDataByPosition(pos);
        var index = 0; // 一个推荐位可能有多条数据，一般为1条。多条的特殊处理，index表示数组下标
        if (pos == 14) {
            index = Tab0.Carousel.carouselIdx;
        } // Tab0的轮播
        if (pos == 21) {
            index = Tab1.Carousel.carouselIdx;
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
                PageJump.jumpPlayVideo(JSON.parse(itemData.inner_parameters));
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
                Page.getAlbumIdByAlias(JSON.parse(itemData.parameters)[0].param, function (subject_id) {
                    PageJump.jumpVideoListPage(subject_id);
                });
                break;
            case HomeEntryType.MY_COLLECTION:
                if(RenderParam.carrierId == '620092'){
                    LMEPG.UI.showToast('该功能暂未开放！', 2);
                }else{
                    PageJump.jumpCommon('collect');
                }
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
        }
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

    /**跳转 - 播放器*/
    jumpPlayVideo: function (videoData) {
        if (!videoData) return;
        var objHome = getCurPageObj();
        var objPlayer = null;
        var play_url = videoData.ftp_url;
        var videoUrl = null;
        if(typeof (play_url) !== "undefined" && play_url != "") {
            var videoObj = play_url instanceof Object ? play_url : JSON.parse(play_url);
            videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
        }else if(typeof (videoData.videoUrl) !== "undefined" && videoData.videoUrl != ""){
            videoUrl = RenderParam.platformType = videoData.videoUrl;
        }
        var showStatus = "";
        if(typeof(videoData.show_status) !== "undefined" && videoData.show_status != ""){
            showStatus = videoData.show_status;
        }else if(typeof(videoData.showStatus) !== "undefined" && videoData.showStatus != ""){
            showStatus = videoData.showStatus;
        }else{
            LMEPG.UI.showToast('视频信息为空！！');
            return;
        }

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
            'unionCode': videoData.union_code,
            'show_status': showStatus,
        };

        if(videoInfo.show_status == '3'){
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

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            LMEPG.Intent.jump(objPlayer, objHome);
        } else {
            PageJump.jumpBuyVip(videoInfo.title, videoInfo);
        }
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
    jumpAlbumPage: function (albumName, isLatest) {
        var objHome = getCurPageObj();
        var objAlbum = LMEPG.Intent.createIntent('album');
        var unionCode = isLatest === 'latestAlbum' ? albumName.union_code : 0;
        albumName =  isLatest === 'latestAlbum' ? unionCode ? 'TemplateAlbum':albumName.alias_name : albumName;
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
        var latestInfo = RenderParam.carrierId === '620092' ? RenderParam.latestAlbumInfo : RenderParam.latestVideoInfo;
        if (latestInfo.result == 0 && latestInfo.val && latestInfo.val !=='null') {
            LMEPG.UI.showToast('已为您继续播放', 1, function () {

                var infoVal =  latestInfo.val instanceof Object ? latestInfo.val : JSON.parse(latestInfo.val);
                if (RenderParam.carrierId === '620092') {
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
    }
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
        data.entryType = 1;
        data.entryTypeName = '首页轮播视频';
        data.ftp_url = {
            gq_ftp_url:data.videoUrl,
            bq_ftp_url:data.videoUrl
        };

        PageJump.jumpPlayVideo(data);
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
    }
};

var onBack = htmlBack = function () {
    var currentNavID = thisNavID;
    var currentFocusId = LMEPG.BM.getCurrentButton().id;
    var lastIndex = currentNavID.slice(-1);
    // 如果有促订弹窗弹出，取消促订弹窗
    switch (true) {
        // 关闭新手指导
        case currentFocusId == 'debug':
            var HelpModalPath = HelpModal;
            // 标记已进入
            HelpModalPath[HelpModalPath.getCurrentSign(lastIndex)] = 1;
            // 隐藏当前显示的help
            H(HelpModalPath.getCurrentTabId(currentNavID.slice(-1)) + (HelpModalPath.count - 1));
            // 上报进入记录
            HelpModalPath.upLoadFirstEnter();
            break;
        // 跳转Tab0
        case currentNavID != 'tab-0':
            Hide('content-' + lastIndex);
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
    LMEPG.mp.destroy();  //释放播放器
};