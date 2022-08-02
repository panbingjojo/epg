// 主页控制js

var Page = {
    // 退出应用。
    exitAppHome: function () {
        switch (RenderParam.carrierId) {
            case '340092':
                // 安徽电信EPG
                if (typeof Utility !== 'undefined') {
                    Utility.setValueByName('exitIptvApp');
                } else {
                    LMEPG.Intent.back();
                }
                break;
            case '520094':
                // 贵州广电
                starcorCom.exit();
                break;
            case '630092':
                //青海电信
                LMEPG.Intent.back('IPTVPortal');
                break;
            default:
                LMEPG.Intent.back('IPTVPortal');
                break;
        }
    },

    /**
     * 得到当前页面对象
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('homeTab4');
        if (LMEPG.ButtonManager.getCurrentButton().id.indexOf('nav_') == -1) {
            objCurrent.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        } else {
            objCurrent.setParam('focusIndex', 'recommend_border_1');
        }
        return objCurrent;
    },

    /**
     * 跳转到3983测试页
     */
    jumpTestPage: function () {
        var objCurrent = Page.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent('testEntrySet');
        objHomeTab.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    /**
     * 跳转 - 切换导航页
     */
    jumpHomeTab: function (tabName, focusIndex) {
        var objCurrent = Page.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent(tabName);
        objHomeTab.setParam('userId', RenderParam.userId);
        objHomeTab.setParam('classifyId', '');
        objHomeTab.setParam('focusIndex', focusIndex);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    /**
     * 跳转 - 收藏页
     */
    jumpCollectPage: function () {
        var objCurrent = Page.getCurrentPage();
        objCurrent.setParam('userId', RenderParam.userId);
        objCurrent.setParam('classifyId', Home.classifyId);
        objCurrent.setParam('position', 'collect');
        objCurrent.setParam('fromId', '1');
        objCurrent.setParam('page', '0');

        var objCollect = LMEPG.Intent.createIntent('collect');
        objCollect.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objCollect, objCurrent);
    },

    /**
     * 跳转 - 搜索页
     * */
    jumpSearchPage: function () {
        var objCurrent = Page.getCurrentPage();
        objCurrent.setParam('userId', RenderParam.userId);
        objCurrent.setParam('classifyId', Home.classifyId);
        objCurrent.setParam('fromId', '1');
        objCurrent.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        objCurrent.setParam('page', '0');

        var objSearch = LMEPG.Intent.createIntent('search');
        objSearch.setParam('userId', RenderParam.userId);
        objSearch.setParam('position', 'tab1');

        LMEPG.Intent.jump(objSearch, objCurrent);
    },

    /**
     * 跳转 -- 更多视频页
     */
    jumpChannelPage: function (modeTitle, modeType, page) {
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '2');

        var objChannel = LMEPG.Intent.createIntent('channel');
        objChannel.setParam('userId', RenderParam.userId);
        objChannel.setParam('page', typeof (page) === 'undefined' ? '1' : page);
        objChannel.setParam('modeTitle', modeTitle);
        objChannel.setParam('modeType', modeType);
        LMEPG.Intent.jump(objChannel, objHome);
    },

    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName) {
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '2');

        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转 -- 活动页面
     * @param activityName
     */
    jumpActivityPage: function (activityName) {
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '2');

        var objActivity = LMEPG.Intent.createIntent('activity');
        objActivity.setParam('userId', RenderParam.userId);
        objActivity.setParam('activityName', activityName);
        objActivity.setParam('inner', 1);
        LMEPG.Intent.jump(objActivity, objHome);
    },

    /**
     * 跳转到预约挂号页
     */
    jumpGuaHaoPage: function () {
        //预约挂号首页
        var objCurrent = Page.getCurrentPage();

        var objHospitalList = LMEPG.Intent.createIntent('appointmentRegister');
        LMEPG.Intent.jump(objHospitalList, objCurrent);
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast('视频信息为空！');
            return;
        }

        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '2');

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
    },

    /**
     * 跳转 -- 订购页
     * @param remark        订购来源（标示）
     * @param videoInfo     如果视频正在播放，播放视频的信息。
     * @param singlePayItem 是否是单订购
     */
    jumpBuyVip: function (remark, videoInfo, singlePayItem) {
        if (typeof (videoInfo) !== 'undefined' && videoInfo !== '') {
            var postData = {
                'videoInfo': JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
            });
        }
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '1');
        objHome.setParam('page', '0');

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('userId', RenderParam.userId);
        objOrderHome.setParam('remark', remark);
        objOrderHome.setParam('isPlaying', 1);
        // objOrderHome.setParam("videoInfo", typeof(videoInfo) !== "undefined" && videoInfo != "" ? JSON.stringify(videoInfo) : "");
        objOrderHome.setParam('singlePayItem', typeof (singlePayItem) !== 'undefined' ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objHome);
    },

    /**
     * 河南Vip 信息页
     * */
    jumpOrderVipPage: function () {
        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            if (RenderParam.autoOrder == '1') {
                var orderVip = LMEPG.Intent.createIntent('unsubscribeVip');
                orderVip.setParam('userId', RenderParam.userId);
                orderVip.setParam('returnPageName', 'home');
            } else {
                var orderVip = LMEPG.Intent.createIntent('unsubscribeResult');
                orderVip.setParam('userId', RenderParam.userId);
                orderVip.setParam('returnPageName', 'home');
            }
        } else {
            var orderVip = LMEPG.Intent.createIntent('orderVip');
            orderVip.setParam('userId', RenderParam.userId);
            orderVip.setParam('returnPageName', 'home');
        }

        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '1');

        LMEPG.Intent.jump(orderVip, objHome);
    },

    /**
     * 跳转 - 从挽留页返回到主页
     */
    jumpHomeByHold: function () {
        var objHome = LMEPG.Intent.createIntent('home');

        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '0');
        objHome.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        objHome.setParam('page', '0');

        LMEPG.Intent.jump(objHome);
    },

    /**
     * 跳转 - 挽留页
     */
    jumpHoldPage: function () {
        var objHome = Page.getCurrentPage();

        var objHold = LMEPG.Intent.createIntent('hold');
        objHold.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objHold, objHome, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },
    /**
     * 跳转 - 切换视频栏目页
     */
    jumpTabMore: function (model_type) {
        var objCurrent = Page.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent('tabMore');
        objHomeTab.setParam('userId', RenderParam.userId);
        objHomeTab.setParam('classifyId', RenderParam.classifyId);
        objHomeTab.setParam('modelType', model_type);

        LMEPG.Intent.jump(objHomeTab, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
};

var Home = {
    classifyId: RenderParam.classifyId,          // 当前分类ID
    entryDuration: 0,       // 进入页面时长,进入页面后进行定时器刷新
    Banner: {
        MAX_TIMER_DURATION: 3000,       // 定时器时间间隔

        bannerIndex: 0,                 // 第一推荐位banner下标
        item: [],                       // banner项
        timer: null,
        // 初始化banner
        initBanner: function (rawData) {
            if (rawData == null || rawData.length <= 0)
                return;
            for (var i = 0; i < 3 && i < rawData.length; i++) { // 暂时最多显示三项
                this.item[i] = {};
                this.item[i].backgroundImage = rawData[i].img_url;      // 背景图片
                this.item[i].entryType = rawData[i].entry_type;         // 类型
                if (this.item[i].entry_type == 20) {
                    // 问专家预约信息提示
                    this.item[i].info = rawData[i].recordList.data[0];        // 只处理第一个提示内容
                    this.item[i].startInquiryDate = new Date(Home.formatDate(this.item[i].info.begin_dt)).getTime();
                    this.item[i].isEntry = false;
                }
            }
            this.startTimer();  //启动banner定时器。
        },
        // 启动定时器
        startTimer: function () {
            this.timer = setInterval(this.onTimer(), this.MAX_TIMER_DURATION);
        },

        // 关闭定时器
        closeTimer: function () {
            clearInterval(this.timer);
        },

        // 定时器触发
        onTimer: function () {
            //定时切换banner
            this.bannerIndex = this.bannerIndex < this.item.length - 1 ? this.bannerIndex + 1 : 0;
            Home.Banner.update();
        },

        update: function () {
            this.updateIndicator();
            this.updateView();
            this.updateExpertInfo();
        },

        /**
         * 更新Banner指示器
         */
        updateIndicator: function () {
            var indicatorImage = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/icon_indicator_point.png';
            var indicatorSelectedImage = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/icon_indicator_point_show.png';
            // 设置指示器位置
            G('indicator_0').src = indicatorImage;
            G('indicator_1').src = indicatorImage;
            G('indicator_2').src = indicatorImage;
            G('indicator_' + this.bannerIndex).src = indicatorSelectedImage;
        },

        /**
         * 更新视图
         */
        updateView: function () {
            G('recommend_1').src = RenderParam.fsUrl + this.item[this.bannerIndex].backgroundImage;
        },

        /**
         * 更新专家提示信息
         */
        updateExpertInfo: function () {
            if (this.item[this.bannerIndex].entry_type != 20) {
                H('recommend_text_1');
            } else {
                var expertName = data.doctor_name;
                var beginDate = data.begin_dt;
                var endDate = data.end_dt;

                var startInquiryDate = new Date(this.formatDate(data.begin_dt)).getTime();
                //var checkTime =
            }
        }
    }
    ,

    /**
     * 渲染主题背景
     */
    renderThemeUI: function () {
        var themeImage = 'url(\'' + g_appRootPath + '/Public/img/' + RenderParam.platformType
            + '/Common/' + RenderParam.commonImgsView + '/bg_home.png\')'; // 默认背景
        if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== '') {
            themeImage = 'url(' + RenderParam.fsUrl + RenderParam.themeImage + ')';
        }
        G('home_container').style.backgroundImage = themeImage;
    },

    /**
     * 得到推荐位数据通过位置
     * @param position
     */
    getRecommendDataByPosition: function (position) {
        var dataList = RenderParam.recommendDataList;
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            if (data.position == position) {
                return data;
            }
        }
        return null;
    },

    /**
     * 顶部 导航栏菜单获得焦点
     * @param btn
     * @param hasFocus
     */
    onNavFocus: function (btn, hasFocus) {
        if (hasFocus == true) {
            G(btn.id).style.backgroundImage = 'url(' + btn.focusImage + ')';
        } else {
            if (G(btn.id).getAttribute('hover')) {
                G(btn.id).style.backgroundImage = 'url(__ROOT__/Public/img/' + RenderParam.platformType + '/Home/V3/tab_nav_onblur.png)';
            } else {
                G(btn.id).style.backgroundImage = 'none';
            }
        }
    },

    /**
     * 顶部 导航栏移动前焦点处理
     * @param dir
     * @param current
     */
    onNavBeforeMoveChange: function (dir, current) {
        if (dir == 'right') {
            var id = 'nav_4';
            if (RenderParam.platformType == 'sd') {
                id = 'nav_3';
            }
            if (current.id == id && RenderParam.navPage < RenderParam.navigateModelInfo.length) {
                RenderParam.navPage = RenderParam.navPage + 1;
                Home.initNav(RenderParam.navPage);
                LMEPG.ButtonManager.requestFocus(id);
            }
        }
        if (dir == 'left') {
            if (current.id == 'nav_0' && RenderParam.navPage > RenderParam.pageCount) {
                RenderParam.navPage = RenderParam.navPage - 1;
                Home.initNav(RenderParam.navPage);
                LMEPG.ButtonManager.requestFocus('nav_0');
            }
        }
    },

    onNavClick: function (btn) {
        var model_type = G(btn.id).getAttribute('model_type');
        if (model_type == '') {
            Page.jumpHomeTab('homeTab4');
        } else {
            Page.jumpTabMore(model_type);
        }
    },

    /**
     * 左侧 菜单焦点处理
     * @param btn
     * @param hasFocus
     */
    onMenuFocus: function (btn, hasFocus) {

    },

    /**
     * 左侧 菜单移动前
     * @param btn
     * @param hasFocus
     */
    onMenuBeforMoveChange: function (dir, current) {
        if (dir == 'down') {
            switch (current.id) {
                case 'search':
                case 'collect':
                case 'vip_btn':
                    LMEPG.ButtonManager.requestFocus('nav_0');
                    return false;
            }
        }
    },

    /**
     * 菜单栏被点击
     * @param btn
     */
    onMenuClick: function (btn) {
        switch (btn.id) {
            case 'search':
                // 在线问诊
                Page.jumpSearchPage();
                break;
            case 'collect':
                // 收藏
                Page.jumpCollectPage();
                break;
            case 'vip_btn':
                Page.jumpOrderVipPage();
                break;
        }
    },

    /**
     * 推荐位焦点改变
     * @param btn
     * @param hasFocus
     */
    onRecommendFocusChange: function (btn, hasFocus) {
        if (hasFocus) {
            if (RenderParam.platformType == 'hd') {
                // 高清放大处理，标清不放大
                LMEPG.CssManager.removeClass(G('recommend_' + btn.cIdx), 'recommend_zoom_in');
                LMEPG.CssManager.addClass(G('recommend_' + btn.cIdx), 'recommend_zoom_out');
            }
        } else {
            if (RenderParam.platformType == 'hd') {
                // 高清放大处理，标清不放大
                LMEPG.CssManager.removeClass(G('recommend_' + btn.cIdx), 'recommend_zoom_out');
                LMEPG.CssManager.addClass(G('recommend_' + btn.cIdx), 'recommend_zoom_in');
            }
        }
        var corner = G('corner_free_' + btn.cIdx);
        var img = G('recommend_' + btn.cIdx);
        if (corner && RenderParam.platformType == 'hd') {
            if (img.offsetTop < 0) {
                corner.style.top = img.offsetTop + 4 + 'px';
                corner.style.left = img.offsetLeft + 4 + 'px';
            } else {
                corner.style.top = img.offsetTop + 'px';
                corner.style.left = img.offsetLeft + 'px';
            }
        }
    },

    /**
     * 推荐位移动
     * @param dir
     * @param current
     */
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                switch (current.id) {
                    case 'recommend_border_1':
                    case 'recommend_border_2':
                    case 'recommend_border_3':
                        LMEPG.ButtonManager.requestFocus('nav_0');
                        return false;
                }
                break;
        }
    },

    /**
     * 推荐位被点击
     * @param btn
     */
    onRecommendClick: function (btn) {
        var position = btn.cPosition;   // 得到位置类型数据
        var data = Home.getRecommendDataByPosition(position);
        if (data == null) {
            // 没有相关的推荐位数据
            LMEPG.UI.showToast('没有相关的推荐位数据');
            return;
        }
        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(data.position, data.order);
        switch (data.entryType) {
            case '5':
                // 视频播放
                var videoObj = data.play_url instanceof Object ? data.play_url : JSON.parse(data.play_url);
                var videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

                // 创建视频信息
                var videoInfo = {
                    'sourceId': data.source_id,
                    'videoUrl': videoUrl,
                    'title': data.title,
                    'type': data.model_type,
                    'userType': data.user_type,
                    'freeSeconds': data.freeSeconds,
                    'entryType': 1,
                    'entryTypeName': 'homeTab4',
                    'focusIdx': btn.id,
                    'unionCode': data.union_code,
                    'show_status': data.show_status
                };

                //视频专辑下线处理
                if(videoInfo.show_status == "3") {
                    LMEPG.UI.showToast('该节目已下线');
                    return;
                }

                if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                    Page.jumpPlayVideo(videoInfo);
                } else {
                    Page.jumpBuyVip(videoInfo.title, videoInfo);
                }

                break;
            case '4':
                // 更多视频
                Page.jumpChannelPage(data.title, data.source_id, '1');
                break;
            case '13':
                // 专辑
                Page.jumpAlbumPage(data.source_id);
                break;
            case '3':
                // 活动
                Page.jumpActivityPage(data.source_id);
                break;
            case '14':
                //预约挂号首页
                Page.jumpGuaHaoPage();
                break;
            case '22':
                // 具体地址跳转
                LMEPG.UI.showToast('具体地址跳转');
                break;
        }
    },

    /**
     * 初始化导航栏
     */
    initNav: function (current) {
        var pageIndex = current - RenderParam.pageCount;
        var navContent = RenderParam.navigateModelInfo.slice(pageIndex, current);
        var htmlText = '';
        Hide('nav_left');
        Hide('nav_right');
        if (current > RenderParam.pageCount) {
            Show('nav_left');
        }
        if (current < RenderParam.navigateModelInfo.length) {
            Show('nav_right');
        }
        var btnHover;
        for (var i = 0; i < navContent.length; i++) {
            if (navContent[i]['model_type'] == RenderParam.modelType) {
                btnHover = 'nav_' + i;
                htmlText += '<div id="nav_' + i + '" class="navimg" model_type="' + navContent[i]['model_type'] + '" hover="1">' + navContent[i]['model_name'] + '</div>';
            } else {
                htmlText += '<div id="nav_' + i + '" class="navimg" model_type="' + navContent[i]['model_type'] + '">' + navContent[i]['model_name'] + '</div>';
            }

            buttons.push({
                id: 'nav_' + i,
                name: '',
                type: 'img',
                nextFocusLeft: 'nav_' + (i - 1),
                nextFocusRight: 'nav_' + (i + 1),
                nextFocusUp: 'search',
                nextFocusDown: 'recommend_border_1',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V3/tab_nav_onfocus.png',
                click: Home.onNavClick,
                focusChange: Home.onNavFocus,
                beforeMoveChange: Home.onNavBeforeMoveChange,
                moveChange: LMEPG.emptyFunc,
                cNavId: i
            });
        }
        if (htmlText != '') {
            G('navs').innerHTML = htmlText;
            if (G(btnHover)) {
                G(btnHover).style.backgroundImage = 'url(__ROOT__/Public/img/' + RenderParam.platformType + '/Home/V3/tab_nav_onblur.png)';
            }
        }
    },

    /**
     * 初始化左侧菜单栏
     */
    initTopMenu: function () {
        buttons.push({
            id: 'search',
            name: '',
            type: 'img',
            nextFocusLeft: 'vip_btn',
            nextFocusRight: 'collect',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_search.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/f_search.png',
            click: Home.onMenuClick,
            focusChange: Home.onMenuFocus,
            beforeMoveChange: Home.onMenuBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 0
        });
        // 贵州广电不需要收藏
        if (RenderParam.carrierId != '520092') {
            buttons.push({
                id: 'collect',
                name: '收藏',
                type: 'img',
                nextFocusLeft: 'search',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_collect.png',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/f_collect.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 1
            });
        }
        // 中国联通epg  河南联通显示退点按钮
        if (RenderParam.carrierId == '000051' && RenderParam.areaCode == '204') {
            S('vip_btn');
            buttons.push({
                id: 'vip_btn',
                name: 'vip',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'search',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_vip_btn.png',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/f_vip_btn.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 1
            });
        }
    },

    // 初始化推荐位控件
    initRecommend: function () {
        buttons.push({
            id: 'recommend_border_1',
            name: '推荐位1',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommend_border_2',
            nextFocusUp: '',
            nextFocusDown: 'home_btn',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_1.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 1,
            cPosition: '51'   //数据对应位置，用来查找对应数据
        });
        buttons.push({
            id: 'recommend_border_2',
            name: '推荐位2',
            type: 'img',
            nextFocusLeft: 'recommend_border_1',
            nextFocusRight: 'recommend_border_3',
            nextFocusUp: '',
            nextFocusDown: 'recommend_border_4',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_2.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 2,
            cPosition: '52'        //数据对应位置，用来查找对应数据
        });
        buttons.push({
            id: 'recommend_border_3',
            name: '推荐位3',
            type: 'img',
            nextFocusLeft: 'recommend_border_2',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommend_border_7',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_3.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 3,
            cPosition: '53'
        });
        buttons.push({
            id: 'recommend_border_4',
            name: '推荐位4',
            type: 'img',
            nextFocusLeft: 'recommend_border_1',
            nextFocusRight: 'recommend_border_5',
            nextFocusUp: 'recommend_border_2',
            nextFocusDown: 'back_btn',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_4.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 4,
            cPosition: '54'
        });
        buttons.push({
            id: 'recommend_border_5',
            name: '推荐位5',
            type: 'img',
            nextFocusLeft: 'recommend_border_4',
            nextFocusRight: 'recommend_border_6',
            nextFocusUp: 'recommend_border_2',
            nextFocusDown: 'back_btn',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_5.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 5,
            cPosition: '55'
        });
        buttons.push({
            id: 'recommend_border_6',
            name: '推荐位6',
            type: 'img',
            nextFocusLeft: 'recommend_border_5',
            nextFocusRight: 'recommend_border_7',
            nextFocusUp: 'recommend_border_2',
            nextFocusDown: 'back_btn',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_6.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 6,
            cPosition: '56'
        });
        buttons.push({
            id: 'recommend_border_7',
            name: '推荐位6',
            type: 'img',
            nextFocusLeft: 'recommend_border_6',
            nextFocusRight: '',
            nextFocusUp: 'recommend_border_3',
            nextFocusDown: 'back_btn',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_7.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 7,
            cPosition: '57'
        });
    },

    // 初始化底部导航栏按钮
    initNavBottom: function () {
        var domNavsBottom = G('navs_bottom');
        if (LMEPG.Func.isEmpty(domNavsBottom)) {
            return;
        }
        buttons.push({
            id: 'home_btn',
            name: '底部导航首页按钮',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'main_btn',
            nextFocusUp: 'recommend_border_1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V4/bg_home_btn.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V4/f_home_btn.png',
            click: 'Page.exitAppHome()',
            focusChange: '',
            beforeMoveChange: '',
            moveChange: ''
        });
        buttons.push({
            id: 'main_btn',
            name: '底部导航主页按钮',
            type: 'img',
            nextFocusLeft: 'home_btn',
            nextFocusRight: 'back_btn',
            nextFocusUp: 'recommend_border_1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V4/bg_main_btn.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V4/f_main_btn.png',
            click: 'Page.jumpHomeTab(' + '\'home\'' + ', "")',
            focusChange: '',
            beforeMoveChange: '',
            moveChange: ''
        });
        buttons.push({
            id: 'back_btn',
            name: '底部导航返回按钮',
            type: 'img',
            nextFocusLeft: 'main_btn',
            nextFocusRight: '',
            nextFocusUp: 'recommend_border_4',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V4/bg_back_btn.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V4/f_back_btn.png',
            click: 'onBack()',
            focusChange: '',
            beforeMoveChange: '',
            moveChange: ''
        });
    },

    // 渲染推荐位图片
    renderRecommend: function () {
        // 遍历推荐列表
        for (var i = 0; i < RenderParam.recommendDataList.length; i++) {
            var data = RenderParam.recommendDataList[i];
            switch (data.position) {
                case '51':
                    // 第一个位置 用户其它用途，暂时不管  初始化位置
                    //Home.Banner.initBanner(RenderParam.initPositionList);
                    G('recommend_1').src = RenderParam.fsUrl + data.image_url;
                    Home.showCornerFree('recommend_parent_1', 1, data);
                    break;
                case '52':
                    G('recommend_2').src = RenderParam.fsUrl + data.image_url;
                    Home.showCornerFree('recommend_parent_2', 2, data);
                    break;
                case '53':
                    // 第三个位置
                    G('recommend_3').src = RenderParam.fsUrl + data.image_url;
                    Home.showCornerFree('recommend_parent_3', 3, data);
                    break;
                case '54': // 第四个位置
                    G('recommend_4').src = RenderParam.fsUrl + data.image_url;
                    Home.showCornerFree('recommend_parent_4', 4, data);
                    break;
                case '55': // 第五个位置
                    G('recommend_5').src = RenderParam.fsUrl + data.image_url;
                    Home.showCornerFree('recommend_parent_5', 5, data);
                    break;
                case '56': // 第六个位置
                    G('recommend_6').src = RenderParam.fsUrl + data.image_url;
                    Home.showCornerFree('recommend_parent_6', 6, data);
                    break;
                case '57':
                    // 第七个位置
                    G('recommend_7').src = RenderParam.fsUrl + data.image_url;
                    Home.showCornerFree('recommend_parent_7', 7, data);
                    break;
            }
        }
    },

    showCornerFree: function (parent, i, data) {
        if (RenderParam.showCornerFree == '1' && data.entryType == '5' && data.user_type == '0' && !LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            //免费视频&&普通用户显示免费角标
            var img = document.createElement('img');
            img.setAttribute('class', 'corner_free');
            img.setAttribute('id', 'corner_free_' + i);
            img.setAttribute('src', g_appRootPath + '/Public/img/Common/corner_free.png');
            G(parent).appendChild(img);
        }
    },

    // 格式化日期
    formatDate: function (date) {
        var time = date.replace(/-/g, ':').replace(' ', ':').split(':');
        return new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
    },

    startTimer: function () {
        setInterval(function () {
            Home.entryDuration = Home.entryDuration + 1000;  // 计算进入页面时间
        }, 1000);
    },

    /** 跑马灯信息初始化 */
    initMarquee: function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            var marqueeWidth;
            if (RenderParam.platformType == 'hd') { // 高清平台样式
                marqueeWidth = 1130;
            } else { // 标清平台样式
                marqueeWidth = 588;
            }
            G('scroll_message').innerHTML = '<marquee direction="left" behavior="scroll" scrollamount="2" scrolldelay="0" loop="-1" width="' + marqueeWidth + '" >' + data.content + '</marquee>';
        }, function (errorInfo) {
            LMEPG.Log.error("getMarquee error: " + errorInfo)
        })
    },

    init: function () {
        G('default_link').focus();  // 防止页面丢失焦点

        Home.renderThemeUI();       // 刷新主页背景
        Home.initNav(RenderParam.navPage);             // 初始化导航栏
        Home.initTopMenu();         // 顶部菜单
        Home.initRecommend();       // 初始化推荐位
        Home.initNavBottom();       // 初始化底部导航栏按钮
        Home.initMarquee();         // 初始化滚动字幕

        Home.renderRecommend();     // 渲染推荐位

        var defaultFocusId = typeof (RenderParam.focusIndex) === 'undefined' || RenderParam.focusIndex == null || RenderParam.focusIndex != ''
            ? RenderParam.focusIndex : 'nav_0';
        LMEPG.ButtonManager.init(defaultFocusId, buttons, '', true);
        LMEPG.ButtonManager.setSelected('nav_' + Home.classifyId, true);   // 设置导航栏菜单的选中项

        //启动字幕滚动
        //LMEPG.UI.Marquee.start("scroll_message", 7, 2, 50, "left", "scroll_message");

        Home.startTimer(); // 启动定时器
    }
};

// 定义全局按钮
var buttons = [];

function onBack() {
    LMEPG.Intent.back('home');
}
