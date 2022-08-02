// 主页控制js
var isShowToast = false; // 是否已经弹出提示框 true--表示已经弹出
var currentFocusId;

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
        var objCurrent = LMEPG.Intent.createIntent('homeTab2');
        objCurrent.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);

        return objCurrent;
    },

    /**
     * 跳转到3983测试页
     */
    jumpTestPage: function () {
        var objCurrent = Page.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent('testEntrySet');

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
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('fromId', '1');
        objHome.setParam('page', '0');

        var objDst = LMEPG.Intent.createIntent('search');
        objDst.setParam('userId', RenderParam.userId);
        objDst.setParam('position', 'tab1');

        LMEPG.Intent.jump(objDst, objHome);
    },

    /**
     * 跳转 - 我的家
     */
    jumpMyHome: function () {
        // 上一级页面 --- 主页
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('fromId', '1');
        objHome.setParam('page', '0');

        // 目标页面 -- 我的家
        var objFamilyHome = LMEPG.Intent.createIntent('familyHome');
        LMEPG.Intent.jump(objFamilyHome, objHome);
    },

    /**
     * 跳转 - 医生列表页(视频问诊)
     * @param id 焦点ID
     */
    jumpInquiryDoctorList: function () {
        var objDoctorP2P = {};
        var objHome = Page.getCurrentPage();

        // 如果是标清盒子和已经表明不支持的盒子，不支持视频问诊
        if (RenderParam.accessInquiryInfo.isAccessInquiry == 0
            || RenderParam.platformType == 'sd') {
            // 中国联通要弹框提示，安徽电信跳新页面提示
            if (RenderParam.carrierId == '000051') {
                var _html = '';
                _html = '<img id="toast_message_pic" src="' + RenderParam.toastPicUrl + 'toast.png"/>'; // 背景图片
                _html += '<div id="toast_message_text">' + RenderParam.accessInquiryInfo.message + '</div>'; // 提示内容
                _html += '<div id="toast_message_submit">' + RenderParam.accessInquiryInfo.submit + '</div>'; // 确定按钮
                G('toast').innerHTML = _html;
                isShowToast = true;
                currentFocusId = LMEPG.ButtonManager.getCurrentButton().id;
                LMEPG.ButtonManager.requestFocus('toast_message_pic');
            } else {
                objHome.setParam('userId', RenderParam.userId);
                objHome.setParam('fromId', '1');
                objHome.setParam('page', '0');

                objDoctorP2P = LMEPG.Intent.createIntent('doctorLimit');
                objDoctorP2P.setParam('userId', RenderParam.userId);

                LMEPG.Intent.jump(objDoctorP2P, objHome);
            }
        } else {
            // 支持视频问诊，直接进入
            objHome.setParam('userId', RenderParam.userId);
            objHome.setParam('fromId', '1');
            objHome.setParam('page', '0');

            objDoctorP2P = LMEPG.Intent.createIntent('doctorList');
            objDoctorP2P.setParam('userId', RenderParam.userId);

            LMEPG.Intent.jump(objDoctorP2P, objHome);
        }
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
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
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
        // objOrderHome.setParam("videoInfo", typeof(videoInfo) !== "undefined" && videoInfo != "" ?
        //     JSON.stringify(videoInfo) : "");
        objOrderHome.setParam('singlePayItem', typeof (singlePayItem) !== 'undefined' ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objHome);
    },

    /**
     * 跳转 - 大专家主页
     * @param id
     */
    jumpExpertHome: function () {
        var objCurrent = Page.getCurrentPage();
        var objExpert = {};

        // 如果是标清盒子和已经表明不支持的盒子，不支持视频问诊
        if (RenderParam.accessInquiryInfo.isAccessInquiry == 0
            || RenderParam.platformType == 'sd') {
            // 中国联通要弹框提示，安徽电信跳新页面提示
            if (RenderParam.carrierId == '000051') {
                var _html = '';
                _html = '<img id="toast_message_pic" src="' + RenderParam.toastPicUrl + 'toast.png"/>'; // 背景图片
                _html += '<div id="toast_message_text">' + RenderParam.accessInquiryInfo.message + '</div>'; // 提示内容
                _html += '<div id="toast_message_submit">' + RenderParam.accessInquiryInfo.submit + '</div>'; // 确定按钮
                G('toast').innerHTML = _html;
                isShowToast = true;
                currentFocusId = LMEPG.ButtonManager.getCurrentButton().id;
                LMEPG.ButtonManager.requestFocus('toast_message_pic');
            } else {
                objCurrent.setParam('userId', RenderParam.userId);
                objCurrent.setParam('position', 'inquiry');
                objCurrent.setParam('fromId', '0');
                objCurrent.setParam('page', 0);

                objExpert = LMEPG.Intent.createIntent('expertLimit');
                LMEPG.Intent.jump(objExpert, objCurrent);
            }
        } else {
            // 支持视频问诊，直接进入
            objCurrent.setParam('userId', RenderParam.userId);
            objCurrent.setParam('position', 'inquiry');
            objCurrent.setParam('fromId', '0');
            objCurrent.setParam('page', 0);

            objExpert = LMEPG.Intent.createIntent('expertHome');
            LMEPG.Intent.jump(objExpert, objCurrent);
        }
    },

    /**
     * 跳转 - 专家约诊记录
     */
    jumpExpertRecordHome: function () {
        var objCurrent = Page.getCurrentPage();
        var objExpertRecord = {};

        // 如果是标清盒子和已经表明不支持的盒子，不支持视频问诊
        if (RenderParam.accessInquiryInfo.isAccessInquiry == 0
            || RenderParam.platformType == 'sd') {
            // 中国联通要弹框提示，安徽电信跳新页面提示
            if (RenderParam.carrierId == '000051') {
                var _html = '';
                _html = '<img id="toast_message_pic" src="' + RenderParam.toastPicUrl + 'toast.png"/>'; // 背景图片
                _html += '<div id="toast_message_text">' + RenderParam.accessInquiryInfo.message + '</div>'; // 提示内容
                _html += '<div id="toast_message_submit">' + RenderParam.accessInquiryInfo.submit + '</div>'; // 确定按钮
                G('toast').innerHTML = _html;
                isShowToast = true;
                currentFocusId = LMEPG.ButtonManager.getCurrentButton().id;
                LMEPG.ButtonManager.requestFocus('toast_message_pic');
            } else {
                objCurrent.setParam('userId', RenderParam.userId);
                objCurrent.setParam('position', 'inquiry');
                objCurrent.setParam('fromId', '0');
                objCurrent.setParam('page', 0);

                objExpertRecord = LMEPG.Intent.createIntent('expertLimit');
                LMEPG.Intent.jump(objExpertRecord, objCurrent);
            }
        } else {
            // 支持视频问诊，直接进入
            objCurrent.setParam('userId', RenderParam.userId);
            objCurrent.setParam('position', 'inquiry');
            objCurrent.setParam('fromId', '0');
            objCurrent.setParam('page', 0);

            objExpertRecord = LMEPG.Intent.createIntent('expertRecordHome');
            LMEPG.Intent.jump(objExpertRecord, objCurrent);
        }
    },


    /**
     *  跳转 - 调用apk的专家约诊记录
     */
    jumpExpertRecordBridge: function () {
        var objCurrent = Page.getCurrentPage();
        var objExpertRecordBridge = {};

        // 如果是标清盒子和已经表明不支持的盒子，不支持视频问诊
        if (RenderParam.accessInquiryInfo.isAccessInquiry == 0
            || RenderParam.platformType == 'sd') {
            // 中国联通要弹框提示，安徽电信跳新页面提示
            if (RenderParam.carrierId == '000051') {
                var _html = '';
                _html = '<img id="toast_message_pic" src="' + RenderParam.toastPicUrl + 'toast.png"/>'; // 背景图片
                _html += '<div id="toast_message_text">' + RenderParam.accessInquiryInfo.message + '</div>'; // 提示内容
                _html += '<div id="toast_message_submit">' + RenderParam.accessInquiryInfo.submit + '</div>'; // 确定按钮
                G('toast').innerHTML = _html;
                isShowToast = true;
                currentFocusId = LMEPG.ButtonManager.getCurrentButton().id;
                LMEPG.ButtonManager.requestFocus('toast_message_pic');
            } else {
                objCurrent.setParam('userId', RenderParam.userId);
                objCurrent.setParam('position', 'inquiry');
                objCurrent.setParam('fromId', '0');
                objCurrent.setParam('page', 0);

                objExpertRecordBridge = LMEPG.Intent.createIntent('expertLimit');
                LMEPG.Intent.jump(objExpertRecordBridge, objCurrent);
            }
        } else {
            // 支持视频问诊，直接进入
            objCurrent.setParam('userId', RenderParam.userId);
            objCurrent.setParam('position', 'inquiry');
            objCurrent.setParam('fromId', '0');
            objCurrent.setParam('page', 0);

            objExpertRecordBridge = LMEPG.Intent.createIntent('expertRecordBridge');
            LMEPG.Intent.jump(objExpertRecordBridge, objCurrent);
        }
    },

    /**
     * 跳转 - 从挽留页返回到主页
     */
    jumpHomeByHold: function () {
        var objHome = LMEPG.Intent.createIntent('home');

        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', '0');
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
    }
};

var Home = {
    currNavId: RenderParam.classifyId,              // 当前导航栏下标
    classifyId: RenderParam.classifyId,             // 当前分类ID
    entryDuration: 0,                               // 进入页面时长,进入页面后进行定时器刷新
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
    },

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
    },

    /**
     * 顶部 导航栏移动前焦点处理
     * @param dir
     * @param current
     */
    onNavBeforeMoveChange: function (dir, current) {
        // if (dir == "up" || dir == "down") {
        //     LMEPG.ButtonManager.setSelected(current.id, true);
        // }
    },

    onNavClick: function (btn) {
        LMEPG.ButtonManager.setSelected(btn.id, true);
        Home.currNavId = btn.cNavId;
        switch (btn.id) {
            case 'nav_0':
                Page.jumpHomeTab('home', '');
                break;
            case 'nav_1':
                Page.jumpHomeTab('homeTab1', '');
                break;
            case 'nav_2':
                Page.jumpHomeTab('homeTab2', '');
                break;
            case 'nav_3':
                Page.jumpHomeTab('homeTab3', '');
                break;
            case 'nav_4':
                Page.jumpHomeTab('homeTab4', '');
                break;
        }
    },

    /**
     * 左侧 菜单焦点处理
     * @param btn
     * @param hasFocus
     */
    onMenuFocus: function (btn, hasFocus) {
        if (hasFocus) {
            if (RenderParam.platformType == 'hd') {
                LMEPG.CssManager.removeClass(G('menu_' + btn.cIdx), 'menu_zoom_in');
                LMEPG.CssManager.addClass(G('menu_' + btn.cIdx), 'menu_zoom_out');
            }
        } else {
            if (RenderParam.platformType == 'hd') {
                LMEPG.CssManager.removeClass(G('menu_' + btn.cIdx), 'menu_zoom_out');
                LMEPG.CssManager.addClass(G('menu_' + btn.cIdx), 'menu_zoom_in');
            }
        }
    },

    /**
     * 左侧 菜单移动前
     * @param btn
     * @param hasFocus
     */
    onMenuBeforMoveChange: function (dir, current) {
        if (dir == 'up') {
            switch (current.id) {
                case 'menu_border_0':
                    LMEPG.ButtonManager.requestFocus('nav_' + Home.currNavId);
                    return false;
            }
        } else if (dir == 'left') {
            Page.jumpHomeTab('homeTab1', 'recommend_border_5');
            return false;
        }
    },

    /**
     * 菜单栏被点击
     * @param btn
     */
    /**
     * 菜单栏被点击
     * @param btn
     */
    onMenuClick: function (btn) {
        switch (btn.id) {
            case 'menu_border_0':
                // 在线问诊
                Page.jumpInquiryDoctorList(btn.id);
                break;
            case 'menu_border_1':
                // 专家约诊
                switch (RenderParam.carrierId) {
                    case '000051':
                        Page.jumpExpertHome(btn.id);
                        break;
                    case '340092':
                    default:
                        LMEPG.UI.showToast('本栏目暂未开放，敬请期待！', 3);
                        break;
                }
                break;
            case 'menu_border_2':
                // 收藏
                Page.jumpCollectPage();
                break;
            case 'menu_border_3':
                if (RenderParam.areaCode == '201') {
                    LMEPG.UI.showToast('本栏目暂未开放，敬请期待！', 3);
                } else {
                    // 搜索
                    Page.jumpSearchPage();
                }
                break;
            case 'menu_border_4':
                // 我的家
                Page.jumpMyHome();
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
                LMEPG.CssManager.removeClass(G('recommend_' + btn.cIdx), 'recommend_zoom_in');
                LMEPG.CssManager.addClass(G('recommend_' + btn.cIdx), 'recommend_zoom_out');
            }
        } else {
            if (RenderParam.platformType == 'hd') {
                LMEPG.CssManager.removeClass(G('recommend_' + btn.cIdx), 'recommend_zoom_out');
                LMEPG.CssManager.addClass(G('recommend_' + btn.cIdx), 'recommend_zoom_in');
            }
        }
    },

    /**
     * 推荐位移动
     * @param dir
     * @param current
     */
    onRecommendBeforMoveChange: function (dir, current) {
        if (dir == 'up') {
            switch (current.id) {
                case 'recommend_border_1':
                case 'recommend_border_2':
                case 'recommend_border_3':
                case 'recommend_border_4':
                    LMEPG.ButtonManager.requestFocus('nav_' + Home.currNavId);
                    return false;

            }
        } else if (dir == 'right') {
            switch (current.id) {
                case 'recommend_border_4':
                case 'recommend_border_7':
                    Page.jumpHomeTab('homeTab3', 'recommend_border_1');
                    return false;
            }
        }
    },

    /**
     * 推荐位被点击
     * @param btn
     */
    onRecommendClick: function (btn) {
        var postion = btn.cPosition;   // 得到位置类型数据
        var data = Home.getRecommendDataByPosition(postion);
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
                    'entryTypeName': 'homeTab2',
                    'focusIdx': btn.id,
                    'unionCode': data.union_code
                };

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
            case '9':
                Page.jumpInquiryDoctorList();
                break;
            case '22':
                // 具体地址跳转
                LMEPG.UI.showToast('具体地址跳转');
                break;
        }

    },

    /**
     * 显隐童锁
     */
    toggleLockShow: function () {
        var logo = document.getElementsByClassName('logo')[0];
        if (parseInt(RenderParam.showPayLock) != 1) {
            G('home_container').removeChild(G('lock'));
            logo.className = 'logo';
        } else {
            logo.className = 'logo-has-lock';
        }
    },
    /**
     * 童锁被点击
     */
    lockBeClick: function (btn) {
        if (RenderParam.payLockStatus == '0') {
            // 童锁未开启，开启童锁
            var postData = {
                'flag': 1,
                'focusIndex': btn.id,
                'returnPageName': 'homeTab2'
            };
            LMEPG.ajax.postAPI('Pay/getPayLockSetUrl', postData, function (data) {
                if (data.result == 0) {
                    window.location.href = data.url;
                }
            });
            return;
        }
        if (RenderParam.payLockStatus == '1') {
            // 童锁已开启，关闭童锁
            var postData = {
                'flag': 0,
                'focusIndex': btn.id,
                'returnPageName': 'homeTab2'
            };
            LMEPG.ajax.postAPI('Pay/getPayLockSetUrl', postData, function (data) {
                if (data.result == 0) {
                    window.location.href = data.url;
                }
            });
            return;
        }
        // 查询童锁的状态异常。
    },
    /**
     * 童锁获得失去焦点事件
     * @param btn
     * @param hasFocus
     */
    lockOnfocusChange: function (btn, hasFocus) {
        var lockElement = G(btn.id);
        if (hasFocus) {
            if (RenderParam.payLockStatus == '1') {
                lockElement.src = btn.focusUnlookImage;
            } else if (RenderParam.payLockStatus == '0') {
                lockElement.src = btn.focusImage;
            }
        } else {
            if (RenderParam.payLockStatus == '1') {
                lockElement.src = btn.backgroundUnlookImage;
            } else if (RenderParam.payLockStatus == '0') {
                lockElement.src = btn.backgroundImage;
            }
        }
    },
    /**
     * 初始化导航栏
     */
    initNav: function () {
        if (RenderParam.payLockStatus == '1') {
            G('lock').src = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/unlock.png';
        } else if (RenderParam.payLockStatus == '0') {
            G('lock').src = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/lock.png';
        }
        var topFocus = function () {
            var id = '';
            if (RenderParam.platformType == 'sd') {
                id = 'lock';
            }
            return id;
        }();
        var downFocus = function () {
            var id = 'recommend_border_1';
            if (RenderParam.platformType == 'sd') {
                id = 'nav_0';
            }
            return id;
        }();
        var isMoveLock = function () {
            var id = '';
            if (RenderParam.platformType == 'hd') {
                id = 'lock';
            }
            return id;
        }();
        buttons.push({
            id: 'lock',
            name: '童锁',
            type: 'img',
            nextFocusLeft: 'nav_4',
            nextFocusRight: 'nav_0',
            nextFocusUp: '',
            nextFocusDown: downFocus,
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/lock.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/lock_f.png',
            backgroundUnlookImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/unlock.png',
            focusUnlookImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/unlock_f.png',
            click: Home.lockBeClick,
            focusChange: Home.lockOnfocusChange,
            beforeMoveChange: '',
            moveChange: '',
            cNavId: 0
        });
        buttons.push({
            id: 'nav_0',
            name: '首页推荐',
            type: 'img',
            nextFocusLeft: isMoveLock,
            nextFocusRight: 'nav_1',
            nextFocusUp: topFocus,
            nextFocusDown: 'recommend_border_1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_out,
            click: Home.onNavClick,
            focusChange: Home.onNavFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cNavId: 0
        });
        buttons.push({
            id: 'nav_1',
            name: '首页推荐',
            type: 'img',
            nextFocusLeft: 'nav_0',
            nextFocusRight: 'nav_2',
            nextFocusUp: topFocus,
            nextFocusDown: 'recommend_border_1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_out,
            click: Home.onNavClick,
            focusChange: Home.onNavFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cNavId: 1
        });
        buttons.push({
            id: 'nav_2',
            name: '首页推荐',
            type: 'img',
            nextFocusLeft: 'nav_1',
            nextFocusRight: 'nav_3',
            nextFocusUp: topFocus,
            nextFocusDown: 'recommend_border_1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_out,
            click: Home.onNavClick,
            focusChange: Home.onNavFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cNavId: 2
        });
        buttons.push({
            id: 'nav_3',
            name: '首页推荐',
            type: 'img',
            nextFocusLeft: 'nav_2',
            nextFocusRight: 'nav_4',
            nextFocusUp: topFocus,
            nextFocusDown: 'recommend_border_1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_out,
            click: Home.onNavClick,
            focusChange: Home.onNavFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cNavId: 3
        });
        buttons.push({
            id: 'nav_4',
            name: '首页推荐',
            type: 'img',
            nextFocusLeft: 'nav_3',
            nextFocusRight: isMoveLock,
            nextFocusUp: topFocus,
            nextFocusDown: 'recommend_border_1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).focus_out,
            click: Home.onNavClick,
            focusChange: Home.onNavFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cNavId: 4
        });
    },

    /**
     * 初始化左侧菜单栏
     */
    initMenu: function () {
        if (RenderParam.areaCode == '201') {
            buttons.push({
                id: 'menu_border_0',
                name: '在线问诊',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend_border_1',
                nextFocusUp: 'nav_0',
                nextFocusDown: 'menu_border_1',
                backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_menu_border.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 0
            });
            buttons.push({
                id: 'menu_border_1',
                name: '专家约诊',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend_border_1',
                nextFocusUp: 'menu_border_0',
                nextFocusDown: 'menu_border_2',
                backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_menu_border.png',
                click: tempVideo,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 1
            });

            buttons.push({
                id: 'menu_border_2',
                name: '收藏',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend_border_1',
                nextFocusUp: 'menu_border_1',
                nextFocusDown: 'menu_border_4',
                backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_menu_border.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 2
            });

            buttons.push({
                id: 'menu_border_4',
                name: '我的家',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend_border_5',
                nextFocusUp: 'menu_border_2',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_menu_border.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 4
            });
        } else {
            buttons.push({
                id: 'menu_border_0',
                name: '在线问诊',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend_border_1',
                nextFocusUp: 'nav_0',
                nextFocusDown: 'menu_border_1',
                backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_menu_border.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 0
            });
            buttons.push({
                id: 'menu_border_1',
                name: '专家约诊',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend_border_1',
                nextFocusUp: 'menu_border_0',
                nextFocusDown: 'menu_border_2',
                backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_menu_border.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 1
            });
            buttons.push({
                id: 'menu_border_2',
                name: '收藏',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend_border_1',
                nextFocusUp: 'menu_border_1',
                nextFocusDown: 'menu_border_3',
                backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_menu_border.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 2
            });
            buttons.push({
                id: 'menu_border_3',
                name: '搜索',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend_border_5',
                nextFocusUp: 'menu_border_2',
                nextFocusDown: 'menu_border_4',
                backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_menu_border.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 3
            });
            buttons.push({
                id: 'menu_border_4',
                name: '我的家',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend_border_5',
                nextFocusUp: 'menu_border_3',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_menu_border.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 4
            });
        }

        buttons.push({
            id: 'toast_message_pic',
            name: '弹框',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            click: closeToast,
            moveChange: ''
        });
    },
    // 初始化推荐位控件
    initRecommend: function () {
        buttons.push({
            id: 'recommend_border_1',
            name: '推荐位1',
            type: 'img',
            nextFocusLeft: 'menu_border_0',
            nextFocusRight: 'recommend_border_2',
            nextFocusUp: '',
            nextFocusDown: 'recommend_border_5',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + +RenderParam.classifyId + '_1.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 1,
            cPosition: '31'   //数据对应位置，用来查找对应数据
        });
        buttons.push({
            id: 'recommend_border_2',
            name: '推荐位2',
            type: 'img',
            nextFocusLeft: 'recommend_border_1',
            nextFocusRight: 'recommend_border_3',
            nextFocusUp: '',
            nextFocusDown: 'recommend_border_5',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_2.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 2,
            cPosition: '32'        //数据对应位置，用来查找对应数据
        });
        buttons.push({
            id: 'recommend_border_3',
            name: '推荐位3',
            type: 'img',
            nextFocusLeft: 'recommend_border_2',
            nextFocusRight: 'recommend_border_4',
            nextFocusUp: '',
            nextFocusDown: 'recommend_border_6',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_3.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 3,
            cPosition: '33'
        });
        buttons.push({
            id: 'recommend_border_4',
            name: '推荐位4',
            type: 'img',
            nextFocusLeft: 'recommend_border_3',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommend_border_7',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_4.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 4,
            cPosition: '34'
        });
        buttons.push({
            id: 'recommend_border_5',
            name: '推荐位5',
            type: 'img',
            nextFocusLeft: 'menu_border_4',
            nextFocusRight: 'recommend_border_6',
            nextFocusUp: 'recommend_border_1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_5.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 5,
            cPosition: '35'
        });
        buttons.push({
            id: 'recommend_border_6',
            name: '推荐位6',
            type: 'img',
            nextFocusLeft: 'recommend_border_5',
            nextFocusRight: 'recommend_border_7',
            nextFocusUp: 'recommend_border_3',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_6.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 6,
            cPosition: '36'
        });
        buttons.push({
            id: 'recommend_border_7',
            name: '推荐位7',
            type: 'img',
            nextFocusLeft: 'recommend_border_6',
            nextFocusRight: '',
            nextFocusUp: 'recommend_border_4',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_7.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 7,
            cPosition: '37'
        });
    },

    // 渲染推荐位图片
    renderRecommend: function () {
        // 遍历推荐列表
        for (var i = 0; i < RenderParam.recommendDataList.length; i++) {
            var data = RenderParam.recommendDataList[i];
            switch (data.position) {
                case '31':
                    // 第一个位置
                    G('recommend_1').src = RenderParam.fsUrl + data.image_url;
                    break;
                case '32':
                    // 第二个位置
                    G('recommend_2').src = RenderParam.fsUrl + data.image_url;
                    break;
                case '33':
                    // 第三个位置
                    G('recommend_3').src = RenderParam.fsUrl + data.image_url;
                    break;
                case '34':
                    // 第四个位置
                    G('recommend_4').src = RenderParam.fsUrl + data.image_url;
                    break;
                case '35':
                    // 第五个位置
                    G('recommend_5').src = RenderParam.fsUrl + data.image_url;
                    break;
                case '36':
                    // 第六个位置
                    G('recommend_6').src = RenderParam.fsUrl + data.image_url;
                    break;
                case '37':
                    // 第七个位置
                    G('recommend_7').src = RenderParam.fsUrl + data.image_url;
                    break;
            }
        }
    },

    // 格式化日期
    formatDate: function (date) {
        var time = date.replace(/-/g, ':').replace(' ', ':').split(':');
        return new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
    },

    /**
     * 启动定时器
     * 每一秒中刷新一次，在定时器中做一些任务
     */
    startTimer: function () {
        setInterval(function () {
            Home.entryDuration = Home.entryDuration + 1000;  // 计算进入页面时间
        }, 1000);
    },

    /** 跑马灯信息初始化 */
    initMarquee: function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            G('scroll_message').innerHTML = data.content;
        }, function (errorInfo) {
            LMEPG.Log.error("getMarquee error: " + errorInfo)
        })
    },

    init: function () {
        G('default_link').focus();  // 防止页面丢失焦点

        Home.renderThemeUI();       // 刷新主页背景
        Home.initNav();             // 初始化导航栏
        Home.initMenu();            // 初始化左侧菜单栏
        Home.initRecommend();       // 初始化推荐位
        Home.initMarquee();         // 初始化滚动字幕

        Home.renderRecommend();     // 渲染推荐位

        var defaultFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? 'recommend_border_1' : RenderParam.focusIndex;
        LMEPG.ButtonManager.init(defaultFocusId, buttons, '', true);
        LMEPG.ButtonManager.setSelected('nav_' + Home.classifyId, true);   // 设置导航栏菜单的选中项


        //启动字幕滚动
        LMEPG.UI.Marquee.start('scroll_message', 7, 2, 50, 'left', 'scroll_message');

        Home.startTimer(); // 启动定时器

        // 开始轮播
        //Play.startPollPlay();
        Home.toggleLockShow();
    }
};

// 定义全局按钮
var buttons = [];

function onBack() {
    LMEPG.Intent.back('home');
}

/**
 * 关闭弹窗
 */
function closeToast() {
    isShowToast = false;
    G('toast').innerHTML = '';
    LMEPG.ButtonManager.requestFocus(currentFocusId);
}

/**
 * 关闭弹窗
 */
function tempVideo() {
    Page.jumpChannelPage('全部视频', 31, 1);
}
