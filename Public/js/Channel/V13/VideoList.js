/**
 * 三级视频列表
 */
var scene;
var Level3 = {
    COUNT: 7,      // 导航栏单页个数常量
    MAX_COUNT: 56, // 单页导航条总数常量
    NUM: 8,        // 单页视频列表的个数常量
    listPage: 0,
    tabPage: 0,
    tabMaxPage: 0,
    isLeaveTab: false,
    keepFocusId: 'tab-0', // 焦点保持变量
    currentTabIndex: 0,   // 当前导航条索引
    tabData: [],
    buttons: [],
    noSmallVideo: false, // 是否有小窗口播放
    init: function () {

        // 数据和焦点保持
        this.tabPage = parseInt(RenderParam.tabPage);
        this.keepFocusId = RenderParam.keepFocusId;
        this.listPage = +RenderParam.keepFocusId.slice(-1) + parseInt(this.tabPage) * this.COUNT;

        this.initTopData();
        this.tabArray();
        this.createBtns();
        this.renderTab();
        this.renderList();
        this.updateCollectBtnUI();
        this.setPageSize();
        this.diffCarrierId();
        if(RenderParam.noSmallVideo === '0') { // 支持小窗口播放的地区才开始小窗口播放
            this.startPlay();
        }
        if (RenderParam.carrierId == "500092") {
            Level3.setoneKeyInquiryHide();
        }
        RenderParam.focusId && LMEPG.BM.requestFocus(RenderParam.focusId);
        Level3.keepFocusId && this.bg(Level3.keepFocusId, RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/gather_video_s.png' : g_appRootPath + '/Public/img/hd/Channel/V13/gather_video_s.png');
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
            // LMEPG.Log.error("task::setPageSize ---> meta set 1280*720");
        }
        //LMEPG.Log.error("task::setPageSize ---> meta end");
        // setTimeout(Page.setPageSize, 500);
    },

    /**
     * 地区差异化
     */
    diffCarrierId: function () {
        // 辽宁电信EPG焦点，首次进入默认在第一个视频上，隐藏集数和收藏按钮，左侧小窗替换为图片
        if (LMEPG.BM.getCurrentButton().id == 'full-screen' && RenderParam.noSmallVideo === '1') {
            if (RenderParam.carrierId != '610092' && RenderParam.carrierId !== '220001') {
                LMEPG.BM.requestFocus('focus-0');
                G('desc-icon').innerHTML = "";
            }
            var videoSetDetail = JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n"));
            G('cover-img').src = RenderParam.fsUrl + videoSetDetail.data.subject_list[0].image_url;
        }

        if (RenderParam.carrierId == '450092' || RenderParam.carrierId == '610092'
            || RenderParam.carrierId === '150002' || RenderParam.carrierId === '01230001') {
            delNode('one-key-inquiry')
        }

        if (RenderParam.carrierId === '220001') {
            delNode('full-screen');
            delNode('sm-current');
            LMEPG.BM.requestFocus('focus-0');
        }
    },

    bg: function (id, val) {
        var element = G(id);
        if (element)
            element.style.backgroundImage = "url(" + val + ")";
    },

    startPlay: function () {

        if (this.videoList.length > 0) {
            // 播放小窗视频
            setTimeout(function () {
                Play.init();
                Play.startPollPlay(Play.lastedPlaySecond);
            }, 1000);
        }
        // 无数据调整UI提示效果
        else {
            Hide("container");
            Show("null-data-000051");
        }
    },

    /**
     * 处理视频数据
     * 8个一组包装
     */
    tabArray: function () {
        for (var i = 0; i < this.videoList.length / this.NUM; i++) {
            var tempArr = [];
            for (var j = 0; j < this.NUM; j++) {
                tempArr.push(this.videoList[i * this.NUM + j]);
            }
            this.tabData[i] = tempArr;
        }
        this.tabMaxPage = Math.ceil((this.tabData.length) / this.COUNT);
    },

    /**
     * 渲染视频集导航
     */
    renderTab: function () {
        var htm = '';
        var count = this.tabPage * this.COUNT;
        this.currentPageData = this.tabData.slice(count, count + this.COUNT);
        var len = this.currentPageData.length;
        for (var i = 0; i < len; i++) {
            var start = i * this.NUM + this.tabPage * this.MAX_COUNT;
            // 最后一个tab特殊显示，集数根据实际情况显示
            if (Level3.tabPage == Level3.tabMaxPage - 1 && i == len - 1) {
                // 最后一页的视频个数
                var lastTabVideoCount = Level3.videoList.length % this.NUM;
                if (lastTabVideoCount == 0)
                    lastTabVideoCount = this.NUM;
                if (lastTabVideoCount == 1)
                    htm += '<li id=tab-' + i + '>' + (start + 1) + '</li>';
                else
                    htm += '<li id=tab-' + i + '>' + (start + 1) + '-' + (start + lastTabVideoCount) + '</li>';
            } else {
                htm += '<li id=tab-' + i + '>' + (start + 1) + '-' + (start + 8) + '</li>';
            }
        }

        G('tab-wrap').innerHTML = htm;
        Level3.toggleNavArrow();
    },

    /**
     * 导航条移动操作
     * 左翻上一页、右翻下一页
     * 上、下记录焦点保持且标记焦点离开导航条
     * @param key
     * @param btn
     * @returns {boolean}
     */
    onBeforeMoveTurnTab: function (key, btn) {
        var me = Level3;
        if (key == 'left' && btn.id == 'tab-0' && me.tabPage > 0) {
            me.tabPrev();
            return false;
        }
        if (key == 'right' && btn.id == 'tab-6' && me.tabPage < me.tabMaxPage - 1) {
            me.tabNext();
            return false;
        }

        if (key === "up" || key === "down") {
            me.isLeaveTab = true;
        }

        if(key === "up" && !G('full-screen') && G('collect')) {
            LMEPG.ButtonManager.requestFocus('collect');
        }

        me.keepFocusId = btn.id;
    },

    // 上一个导航页
    tabPrev: function () {
        this.tabPage--;
        this.renderTab();
        LMEPG.BM.requestFocus('tab-6');
    },

    // 下一个导航页
    tabNext: function () {
        this.tabPage++;
        this.renderTab();
        LMEPG.BM.requestFocus('tab-0');
    },

    /**
     * tab导航条得失焦点
     */
    onFocusRenderVideoList: function (btn, hasFocus) {
        var me = Level3;
        if (hasFocus) {
            // 标记当前tab索引
            me.currentTabIndex = +btn.id.substr(-1);
            me.listPage = me.currentTabIndex + parseInt(me.tabPage) * me.COUNT;
            me.renderList();
            me.isLeaveTab = false;
        } else {
            if (me.isLeaveTab) {
                G(btn.id).style.backgroundImage = 'url(' + btn.selectedImage + ')';
            }
        }
    },

    /**
     * 渲染视频列表
     */
    renderList: function () {
        // 当前tab上下焦点移动不再重复渲染视频列表
        if (this.keepFocusId !== LMEPG.BM.getCurrentButton().id) {
            var htm = '';
            var data = Level3.videoList;
            var count = this.listPage * 8;
            var currentData = data.slice(count, count + 8);
            currentData.forEach(function (t, i) {
                htm += '<div id="focus-' + i + '" data-link=' + t.id + '>' +
                    '<img onerror=this.src="' + '__ROOT__/Public/img/Common/default.png" src=' + RenderParam.fsUrl + t.image_url + '>' +
                    '<p class="video-number">第' + (data.indexOf(t) + 1) + '集</p>' +
                    '</div>';
            });

            G('content-wrap').innerHTML = htm;
            this.initListFocusBtn(currentData);
            this.toggleListArrow();
        }
    },

    /**
     * 初始化视频列表按钮
     */
    initListFocusBtn: function (pageData) {
        // 视频列表
        var listLen = this.NUM;
        var sdImg = g_appRootPath + '/Public/img/sd/Unclassified/V13/video_list1_f.png';
        var hdImg = g_appRootPath + '/Public/img/hd/Channel/V13/video_list_f.png';
        while (listLen--) {
            this.buttons.push({
                id: 'focus-' + listLen,
                name: '',
                type: 'div',
                nextFocusLeft: 'focus-' + (listLen - 1),
                nextFocusRight: 'focus-' + (listLen + 1),
                nextFocusUp: listLen < 4 ? 'debug' : 'focus-' + (listLen - 4),
                //nextFocusDown: 'focus-' + (listLen + 4),
                nextFocusDown: LMEPG.Func.setDownFocus(pageData.length, 4, listLen, 'focus-'),
                backgroundImage: g_appRootPath + '/Public/img/Common/transparent.png',
                focusImage: RenderParam.platformType == 'sd' ? sdImg : hdImg,
                click: this.onClickPlay,
                beforeMoveChange: this.onBeforeMoveTurnVideoList,
                focusChange: ''
            });
        }

        LMEPG.BM.addButtons(this.buttons);
    },

    /**
     * 下一页视频列表
     * @param dir
     */
    listPrev: function (dir) {
        if (this.listPage == 0) return;
        this.listPage--;
        this.renderList();
        LMEPG.BM.requestFocus('focus-7');
        // tab选中状态跟随移动变化
        Level3.keepFocusId === 'tab-0' ? Level3.tabPrev() : this.setNavBgState(dir);
    },

    /**
     * 上一页视频列表
     * @param dir
     */
    listNext: function (dir) {
        var tabIndex = +this.keepFocusId.slice(-1) * this.tabPage;
        if ((this.listPage + tabIndex) == Level3.listMaxPage) return;
        this.listPage++;
        this.renderList();
        LMEPG.BM.requestFocus('focus-0');
        // tab选中状态跟随移动变化
        Level3.keepFocusId === 'tab-6' ? Level3.tabNext() : this.setNavBgState(dir);
    },

    /**
     * 设置背景图片
     * @param dir 切换视频列表的方向（左/右）
     */
    setNavBgState: function (dir) {
        var me = Level3;
        var tabFocusIndex = +me.keepFocusId.substr(4);
        me.bg(me.keepFocusId, RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/gather_video.png' : g_appRootPath + '/Public/img/hd/Channel/V13/gather_video.png');
        me.keepFocusId = 'tab-' + (tabFocusIndex - (dir === "left" ? (tabFocusIndex === 0 ? 0 : 1) : (tabFocusIndex === 6 ? 6 : -1)));
        me.bg(me.keepFocusId, RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/gather_video_s.png' : g_appRootPath + '/Public/img/hd/Channel/V13/gather_video_s.png');
    },

    /**
     * 1.焦点移动翻页视频列表
     * 2.向上移动到对应集数的tab上
     * @param key
     * @param btn
     * @returns {boolean}
     */
    onBeforeMoveTurnVideoList: function (key, btn) {
        switch (true) {
            case key == 'left' && (btn.id == 'focus-0' || btn.id == 'focus-4'):
                Level3.listPrev(key);
                return false;
            case key == 'right' && (btn.id == 'focus-3' || btn.id == 'focus-7'):
                Level3.listNext(key);
                return false;
            case btn.id.slice(-1) < 4:
                if (key == 'up') {
                    LMEPG.BM.requestFocus('debug');
                    LMEPG.BM.getButtonById('debug').nextFocusUp = Level3.keepFocusId;
                } else if (key == 'down') {
                    // 最后一页
                    if (Level3.tabPage == Level3.tabMaxPage) {
                        // 最后一页的视频个数
                        var lastTabVideoCount = Level3.videoList.length % 8;
                        if (+btn.id.substr(6, 1) + 4 > lastTabVideoCount - 1) {
                            LMEPG.BM.requestFocus('focus-' + (lastTabVideoCount - 1));
                            return false;
                        }
                    }
                }
                break;
        }
    },

    toggleListArrow: function () {
        S('prev-arrow');
        S('next-arrow');
        this.listPage == 0 && H('prev-arrow');
        this.listPage == Level3.listMaxPage && H('next-arrow');
    },

    toggleNavArrow: function () {
        S("nav-next");
        if (Level3.tabPage == Level3.tabMaxPage - 1)
            H("nav-next");
    },

    onFocusMoveToNavFocusId: function (key, btn) {
        switch (btn.id) {
            case 'full-screen':
            case 'collect':
            case 'one-key-inquiry':
                if (key == 'down') {
                    // 如果视频集无数据，则焦点禁止向下
                    if (Level3.videoList.length == 0) return false;
                    LMEPG.BM.requestFocus('debug');
                    LMEPG.BM.getButtonById('debug').nextFocusDown = Level3.keepFocusId;
                }
                break;
        }
    },

    /**
     * 点击视频列表播放
     * @param btn
     */
    onClickPlay: function (btn) {
        var dataIndex = parseInt(btn.id.slice(btn.id.length - 1)) + Level3.listPage * Level3.NUM;
        Level3.onClickVideoItem(dataIndex); // 播放视频
    },

    // 处理点击视频列表事件
    onClickVideoItem: function (dataIndex) {
        var videoList = JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n")).data.video_list;
        var data = videoList[dataIndex];
        // 创建视频信息
        var videoInfo = {
            'sourceId': data.source_id,
            'videoUrl': RenderParam.platformType == 'hd' ? data.ftp_url.gq_ftp_url : data.ftp_url.bq_ftp_url,
            'title': data.title,
            'type': JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n")).data.subject_list[0].model_type,
            'userType': data.user_type,
            'freeSeconds': data.free_seconds,
            'duration': data.duration,
            'entryType': 1,
            'entryTypeName': JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n")).data.subject_list[0].alias_name,
            'unionCode': data.union_code,
            'show_status': data.show_status
        };
        LMEPG.Log.debug("free video >>> " + videoInfo.videoUrl);
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
     * 设置虚拟按钮
     */
    createBtns: function () {
        this.buttons.push({
            id: 'full-screen',
            name: '全屏',
            type: 'img',
            nextFocusRight: 'collect',
            nextFocusDown: 'debug',
            backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V13/full_screen.png',
            focusImage: g_appRootPath + '/Public/img/hd/Channel/V13/full_screen_f.png',
            click: Play.playHomePollVideo,
            beforeMoveChange: this.onFocusMoveToNavFocusId,
            focusChange: ''
        }, {
            id: 'collect',
            name: '收藏',
            type: 'img',
            nextFocusLeft: 'full-screen',
            nextFocusRight: 'one-key-inquiry',
            nextFocusDown: 'debug',
            backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V13/collect.png',
            focusImage: g_appRootPath + '/Public/img/hd/Channel/V13/collect_f.png',
            click: Level3.setCollectStatus,
            beforeMoveChange: this.onFocusMoveToNavFocusId,
            focusChange: ''
        }, {
            id: 'one-key-inquiry',
            name: '一键问诊',
            type: 'img',
            nextFocusLeft: 'collect',
            nextFocusDown: 'debug',
            backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V13/one_key_inquiry.png',
            focusImage: g_appRootPath + '/Public/img/hd/Channel/V13/one_key_inquiry_f.png',
            click: Inquiry.oneKeyInquiry,
            beforeMoveChange: this.onFocusMoveToNavFocusId,
            focusChange: ''
        }, {
            id: 'debug',
            name: '脚手架ID',
            type: 'others',
            nextFocusUp: 'tab-0',
            nextFocusDown: 'tab-0'
        });

        // 导航条
        var tabLen = this.COUNT;
        while (tabLen--) {
            this.buttons.push({
                id: 'tab-' + tabLen,
                name: '',
                type: 'div',
                nextFocusLeft: 'tab-' + (tabLen - 1),
                nextFocusRight: 'tab-' + (tabLen + 1),
                nextFocusUp: 'full-screen',
                nextFocusDown: 'focus-0',
                backgroundImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/gather_video.png' : g_appRootPath + '/Public/img/hd/Channel/V13/gather_video.png',
                focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/gather_video_f.png' : g_appRootPath + '/Public/img/hd/Channel/V13/gather_video_f.png',
                selectedImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/gather_video_s.png' : g_appRootPath + '/Public/img/hd/Channel/V13/gather_video_s.png',
                click: '',
                beforeMoveChange: this.onBeforeMoveTurnTab,
                focusChange: this.onFocusRenderVideoList
            });
        }
        LMEPG.BM.init("full-screen", this.buttons, '', true);
    },

    /**
     * 初始化顶部数据
     */
    initTopData: function () {
        var res = JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n"));
        if (res.result != 0) {
            LMEPG.UI.showToast("数据加载失败！", 2, function () {
                onBack();
            });
            return;
        }
        Level3.videoList = res.data.video_list;
        Level3.listMaxPage = Math.ceil(Level3.videoList.length / 8) - 1;

        G("desc-title").innerHTML = res.data.subject_list[0].subject_name;
        G("desc-total").innerHTML = "集数：" + Level3.videoList.length;
        G("desc-text").innerHTML = res.data.subject_list[0].intro_txt;
    },

    /**
     * 设置收藏状态
     */
    setCollectStatus: function () {
        var postData = {
            "type": RenderParam.isCollect == 1 ? 1 : 0, // 类型（0收藏 1取消收藏）
            "item_type": 2, // 收藏对象类型（1视频 2视频专辑 3医生 4专家）
            "item_id": JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n")).data.subject_list[0].subject_id // 收藏对象id
        };

        // 海看数据探针
        if(RenderParam.carrierId == "371092" || RenderParam.carrierId == "371002") {
            var turnPageInfo = {
                VODCODE: "39_" + JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n")).data.subject_list[0].alias_name,
                VODNAME: JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n")).data.subject_list[0].subject_name,
                mediastatus: RenderParam.isCollect ? "0" : "1",
                reserve1: null,
                reserve2:null,
                from:"jz3.0"
            };
            ShanDongHaiKan.sendReportData('8', turnPageInfo);
        }
        LMEPG.ajax.postAPI("Collect/setCollectStatusNew", postData, function (rsp) {
            try {
                var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(collectItem);
                if (collectItem.result == 0) {
                    if (postData.type == 0) {
                        //收藏成功
                        RenderParam.isCollect = 1;
                        G("collect").src = g_appRootPath + "/Public/img/hd/Channel/V13/collected_f.png";
                        LMEPG.UI.showToast("收藏成功");
                    } else {
                        //取消收藏成功
                        RenderParam.isCollect = 0;
                        G("collect").src = g_appRootPath + "/Public/img/hd/Channel/V13/collect_f.png";
                        LMEPG.UI.showToast("取消收藏成功");
                    }

                    // 更新收藏按钮图片
                    Level3.updateCollectBtnUI();
                } else {
                    LMEPG.UI.showToast("操作失败");
                }
            } catch (e) {
                LMEPG.UI.showToast("操作异常");
            }
        });
    },

    /**
     * 更新收藏按钮图片
     */
    updateCollectBtnUI: function () {
        var collectBtn = Level3.buttons[1]; // 添加的第第二个按钮为收藏按钮
        var currentFocusBtn = LMEPG.BM.getCurrentButton().id;
        if (RenderParam.isCollect == 0) {
            collectBtn.backgroundImage = g_appRootPath + "/Public/img/hd/Channel/V13/collect.png";
            collectBtn.focusImage = g_appRootPath + "/Public/img/hd/Channel/V13/collect_f.png";
            if (currentFocusBtn != 'collect')
                G("collect").src = g_appRootPath + "/Public/img/hd/Channel/V13/collect.png";
        } else {
            collectBtn.backgroundImage = g_appRootPath + "/Public/img/hd/Channel/V13/collected.png";
            collectBtn.focusImage = g_appRootPath + "/Public/img/hd/Channel/V13/collected_f.png";
            if (currentFocusBtn != 'collect')
                G("collect").src = g_appRootPath + "/Public/img/hd/Channel/V13/collected.png";
        }
    },

    /**
     * 一键问医隐藏
     */
    setoneKeyInquiryHide: function () {
        G("one-key-inquiry").style.display = "none";
        G("collect").style.display = "none";
        Level3.buttons[0].nextFocusRight = "";
    }

};

/**
 * ===============================一键问诊网络请求===============================
 */
var Inquiry = {
    /**
     * 一键问医
     */
    oneKeyInquiry: function (btnObj) {
        var inquiryInfo = {
            userInfo: {
                isVip: RenderParam.isVip,                                    // 用户身份信息标识
                accountId: RenderParam.accountId,                            // IPTV业务账号
            },
            memberInfo: null,                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
                moduleInfo: {
                moduleId: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                moduleName: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                moduleType: LMEPG.Inquiry.p2p.InquiryEntry.ONLINE_INQUIRY,   // 问诊模块标识 - 在线问医
                focusId: btnObj.id,                                          // 当前页面的焦点Id
                intent: PageJump.getCurrentPage(),                           // 当前模块页面路由标识
        },
            serverInfo: {
                fsUrl: RenderParam.fsUrl,                                    // 文件资源服务器链接地址，一键问医获取按钮图片时用到
                cwsHlwyyUrl: RenderParam.CWS_HLWYY_URL,                      // cws互联网医院模块链接地址
                teletextInquiryUrl: RenderParam.teletextInquiryUrl,          // 微信图文问诊服务器链接地址
            },
            blacklistHandler: Inquiry.inquiryBlacklistHandler,               // 校验用户黑名单时处理函数
            noTimesHandler: Inquiry.noInquiryTimesHandler,                   // 检验普通用户无问诊次数处理函数
            doctorOfflineHandler: Inquiry.showDoctorOfflineTips,             // 检验医生离线状态时处理函数
            inquiryEndHandler: Inquiry.inquiryEndHandler,                    // 检测医生问诊结束之后，android端回调JS端的回调函数
            inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 判断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
        }

        LMEPG.Inquiry.p2p.oneKeyInquiry(inquiryInfo); // 启动一键问诊
    },

    /**
     * 检测当前用户黑名单时处理函数
     * @param focusIdOnHideDialog 提示弹窗消失后回复页面的焦点
     */
    inquiryBlacklistHandler: function (focusIdOnHideDialog) {
        var forbiddenAskTips = '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。';
        modal.commonDialog({
            beClickBtnId: focusIdOnHideDialog,
            onClick: modal.hide
        }, '', forbiddenAskTips, '');
    },

    /**
     * 检测当前用户无问诊次数时处理函数
     * @param focusIdOnHideDialog 提示弹窗消失后回复页面的焦点
     */
    noInquiryTimesHandler: function(focusIdOnHideDialog){
        var noInquiryTimesTips = '您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊'
        modal.commonDialog({
            beClickBtnId: focusIdOnHideDialog,
            onClick: PageJump.jumpBuyVip
        }, '', noInquiryTimesTips, '');
    },

    /**
     * 医生不在线处理函数
     */
    showDoctorOfflineTips: function () {
        LMEPG.UI.showToast('当前医生不在线');
    },

    /**
     * 医生问诊结束处理函数
     */
    inquiryEndHandler: function () {

    }
};


/**
 * ===============================处理首页小窗口视频轮播===============================
 */
var Play = {
    currPollVideoId: 0,     //当前轮播id

    androidPlayerInfo: null,  // android端播放器的播放信息
    androidVideoInfo: null,   // android端视频的播放信息

    /**
     * 初始化，如果有用户当前视频集历史播放记录和进度，则给currPollVideoId赋值，找到当前的轮播id，
     * 并且从指定的进度进行小窗播放
     */
    lastedPlaySecond: 0, // 当前视频集小窗播放的历史进度
    lastedPollVideoId: 0, // 有历史播放进度的轮播id，首次进入页面初始化
    init: function () {
        var latestVideoInfo = RenderParam.latestVideoInfo;
        if (latestVideoInfo.result == 0) {
            var videoInfo = JSON.parse(latestVideoInfo.val);
            for (var i = 0; i < Level3.videoList.length; i++) {
                if (videoInfo.sourceId == Level3.videoList[i].source_id) {
                    Play.currPollVideoId = i;
                    Play.lastedPollVideoId = i;
                    Play.lastedPlaySecond = parseInt(videoInfo.lastedPlaySecond);
                    break;
                }
            }
        }

        // 海看数据探针
        if(RenderParam.carrierId == "371092" || RenderParam.carrierId == "371002") {
            var turnPageInfo = {
                currentPage: document.referrer,   // 当前页面
                turnPage: location.href, // 目标页面
                turnPageName: document.title,
                turnPageId: "39_" + JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n")).data.subject_list[0].alias_name,
                clickId: ''
            };
            ShanDongHaiKan.sendReportData('6', turnPageInfo);
        }
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
        if (LMEPG.func.isExist(paramJson) && !LMEPG.func.isEmpty(paramJson.resean)) {
            var reason = paramJson.resean;
            console.log("网页接收到视频播放完成消息");
            Play.currPollVideoId++;
            Play.startPollPlay();
        } else {
            LMAndroid.JSCallAndroid.showToastV1("resean为空");
        }
    },

    /**
     * 启动小窗播放
     */
    startPollPlay: function (lastedPlaySecond) {
        if (RenderParam.carrierId === '410092') return; // 河南电信EPG没有小窗视频

        if(!LMEPG.Func.isEmpty(G("sm-current"))) {
            G("sm-current").innerHTML = "第" + (Play.currPollVideoId + 1) + "集";
        }

        if(RenderParam.isRunOnAndroid === '1') { // apk版本视频播放
            var currentPlayVideoInfo = Level3.videoList[Play.currPollVideoId];
            Play.androidPlayerInfo = {
                "videoLeft": 92,        // 小窗显示到屏幕左边举例
                "videoTop": 54,        // 小窗显示到屏幕顶部举例
                "videoWidth": 348,      // 小窗显示的宽度
                "videoHeight": 200,     // 小窗显示的高度
                "playerType": 1,        // 播放器类型:0->rawplayer；1->ijkplayer;default->0
                "playerDecoderType": 0,	// 播放器解码类型：0->硬解码；1->软解码；default-0
                "isReplay": 0,          // 是否循环播放
                "urlList": []
            };
            Play.androidVideoInfo = {
                videoUrl: currentPlayVideoInfo.ftp_url.gq_ftp_url,  // 管理后台配置的视频播放链接地址
                jurisdiction: true,                                 // 是否有权限播放
                freeDuration: currentPlayVideoInfo.free_seconds,    // 免费观看的播放时长
                userType: currentPlayVideoInfo.user_type,           // 管理后台配置视频播放的策略，免费，有免费观看时长，收费
                videoTitle: currentPlayVideoInfo.title,             // 管理后台配置视频播放的标题
            };
            switch (RenderParam.carrierId) {
                case '371002': // 山东海看apk
                    Play.playVideo371002();
                    break;
                case '150002': // 内蒙电信apk
                    Play.playVideo150002();
                    break;
                case '450004': // 广西广电apk
                    Play.playVideo450004();
                    break;
                case '640001': // 宁夏移动apk
                case '450001': // 广西移动apk
                    Play.playVideo640001();
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

        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        LMEPG.mp.destroy();
        var videoUrl = Play.getCurrentPollVideoUrl(); //播放地址
        var playVideoUrl = LMEPG.Func.http2rtsp(videoUrl);
        LMEPG.Log.debug("startPollPlay playVideoUrl >>> " + playVideoUrl);
        var param = {
            carrierId: RenderParam.carrierId,
            videoUrl: playVideoUrl,
            playerScreenId: 'iframe_small_screen',
            platformType: RenderParam.platformType,
            playerUrl: RenderParam.thirdPlayerUrl
        };
        if (RenderParam.platformType == 'hd') {
            param.position = {top: 54, left: 92, width: 348, height: 200};
        } else {
            param.position = {top: 40, left: 50, width: 180, height: 134};
        }
        // 时移播放
        if (!LMEPG.Func.isEmpty(lastedPlaySecond))
            param.playByTimeSeconds = lastedPlaySecond;
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
                LMEPG.ui.showToast("获取小窗播放地址失败!");
            }
        });
    },

    /** 内蒙电信apk视频播放 */
    playVideo150002: function(){
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
                LMEPG.ui.showToast("获取播放地址失败!");
            }
        });
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
    playVideo4Android:function(){
        Play.androidPlayerInfo.urlList = [
            Play.androidVideoInfo,
        ];
        LMEPG.Log.info("小窗播放: videoInfo = "+JSON.stringify(Play.androidPlayerInfo))
        LMAndroid.startSmallPlay(Play.androidPlayerInfo);
        LMAndroid.registSmallPlayUICallback(Play.onSmallPlayerCompleteCallback);
    },

    /** 处理首页轮播视频 */
    playHomePollVideo: function () {
        var data = Play.getCurrentPollVideoData();
        if (data == null) {
            return;
        }
        // 创建视频信息
        var videoInfo = {
            'sourceId': data.source_id,
            'videoUrl': RenderParam.platformType == 'hd' ? data.ftp_url.gq_ftp_url : data.ftp_url.bq_ftp_url,
            'title': data.title,
            'type': JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n")).data.subject_list[0].model_type,
            'userType': data.user_type,
            'freeSeconds': data.free_seconds,
            'duration': data.duration,
            'entryType': 1,
            'entryTypeName': '视频集',
            'unionCode': data.union_code,
            'show_status': data.show_status,
        };
        //视频专辑下线处理
        if (videoInfo.show_status == "3") {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }
        if (Play.lastedPollVideoId == Play.currPollVideoId) {
            videoInfo.lastedPlaySecond = Play.lastedPlaySecond;
        }

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            PageJump.jumpPlayVideo(videoInfo);
        } else {
            PageJump.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },

    /**
     * 得到当前轮播地址
     */
    getCurrentPollVideoUrl: function () {
        if (RenderParam.platformType == 'hd')
            return Level3.videoList[Play.currPollVideoId].ftp_url.gq_ftp_url;
        else
            return Level3.videoList[Play.currPollVideoId].ftp_url.bq_ftp_url;
    },

    /**
     * 得到当前轮播数据对象
     * @returns {*}
     */
    getCurrentPollVideoData: function () {
        return Level3.videoList[Play.currPollVideoId];
    },

    /**
     * 播放过程中的事件
     */
    onPlayEvent: function (keyCode) {
        if (LMEPG.mp.isEnd(keyCode) || LMEPG.mp.isError(keyCode)) {
            var videoCount = Level3.videoList.length;
            if (Play.currPollVideoId >= 0 && Play.currPollVideoId < videoCount - 1) {
                Play.currPollVideoId++;
            } else {
                Play.currPollVideoId = 0;
            }
            Play.startPollPlay();
        }
    },

};

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        EVENT_MEDIA_END: Play.onPlayEvent,
        EVENT_MEDIA_ERROR: Play.onPlayEvent,
    }
);

window.onunload = function () {
    if (RenderParam.carrierId == '640094') {
        ottService.stopTrailer();
    } else if(RenderParam.isRunOnAndroid === '1') {
        LMAndroid.hideSmallVideo();
    } else {
        LMEPG.mp.destroy();
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
        var currentPage = LMEPG.Intent.createIntent('channelList');
        currentPage.setParam('subject_id',JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n")).data.subject_list[0].subject_id);
        // 焦点保持
        currentPage.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        currentPage.setParam('listPage', Level3.listPage); // 列表页数
        currentPage.setParam('tabPage', Level3.tabPage); // tab页数
        currentPage.setParam('keepFocusId', Level3.keepFocusId); // 选中的tab

        return currentPage;
    },

    /**
     * 跳转购买vip页面
     */
    jumpBuyVip: function (remark, videoInfo) {
        if (typeof (videoInfo) !== "undefined" && videoInfo !== "") {
            var postData = {
                "videoInfo": JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
            });
        }

        var objCurrent = PageJump.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        jumpObj.setParam("userId", RenderParam.userId);
        jumpObj.setParam("isPlaying", "1");
        jumpObj.setParam("remark", remark);
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

        var objHome = PageJump.getCurrentPage();

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));
        objPlayer.setParam('subjectId',JSON.parse(RenderParam.detail.replace(/\n/g,"\\\\n")).data.subject_list[0].subject_id);

        LMEPG.Intent.jump(objPlayer, objHome);
    },

};


var onBack = htmlBack = function () {
    if(G('dialog_container')){
        delNode('dialog_container')
        LMEPG.BM.requestFocus('one-key-inquiry')
    }else {
        LMEPG.Intent.back();
    }
};
