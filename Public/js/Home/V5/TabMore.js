// 主页控制js

var Page = {
    /**
     * 得到当前页面对象
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('tabMore');
        if (LMEPG.BM.getCurrentButton().id.indexOf('nav_') == -1) {
            objCurrent.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        } else {
            objCurrent.setParam('focusIndex', 'nav_0');
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
    jumpHomeTab: function (tabName, classifyId, modelType) {
        var objCurrent = Page.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent(tabName);
        objHomeTab.setParam('userId', RenderParam.userId);
        objHomeTab.setParam('classifyId', classifyId);
        objHomeTab.setParam('modelType', modelType);
        objHomeTab.setParam('navCurrent', RenderParam.navCurrent);

        LMEPG.Intent.jump(objHomeTab, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
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

        var objCollect = LMEPG.Intent.createIntent('collect');
        objCollect.setParam('userId', RenderParam.userId);
        var objActivityGuide = LMEPG.Intent.createIntent('tabMore');
        objActivityGuide.setParam('userId', RenderParam.userId);
        objActivityGuide.setParam('classifyId', Home.classifyId);
        objActivityGuide.setParam('modelType', RenderParam.modelType);
        objActivityGuide.setParam('navCurrent', RenderParam.navCurrent);
        LMEPG.Intent.jump(objCollect, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
    },

    /**
     * 跳转 - 搜索页
     * */
    jumpSearchPage: function () {
        var objCurrent = Page.getCurrentPage();
        objCurrent.setParam('userId', RenderParam.userId);
        objCurrent.setParam('classifyId', Home.classifyId);
        objCurrent.setParam('fromId', '1');
        objCurrent.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);

        var objSearch = LMEPG.Intent.createIntent('search');
        objSearch.setParam('userId', RenderParam.userId);

        var objActivityGuide = LMEPG.Intent.createIntent('tabMore');
        objActivityGuide.setParam('userId', RenderParam.userId);
        objActivityGuide.setParam('classifyId', Home.classifyId);
        objActivityGuide.setParam('modelType', RenderParam.modelType);
        objActivityGuide.setParam('navCurrent', RenderParam.navCurrent);
        LMEPG.Intent.jump(objSearch, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
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
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('modelType', RenderParam.modelType);
        objHome.setParam('pageCurrent', RenderParam.pageCurrent);
        objHome.setParam('navCurrent', RenderParam.navCurrent);

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

        var objActivityGuide = LMEPG.Intent.createIntent('tabMore');
        objActivityGuide.setParam('userId', RenderParam.userId);
        objActivityGuide.setParam('classifyId', Home.classifyId);
        objActivityGuide.setParam('modelType', RenderParam.modelType);
        objActivityGuide.setParam('pageCurrent', RenderParam.pageCurrent);
        objActivityGuide.setParam('navCurrent', RenderParam.navCurrent);
        objActivityGuide.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        LMEPG.Intent.jump(objPlayer, objHome, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
    },

    /**
     * 跳转 -- 订购页
     * @param remark        订购来源（标示）
     * @param videoInfo     如果视频正在播放，播放视频的信息。
     * @param singlePayItem 是否是单订购
     */
    jumpBuyVip: function (remark, videoInfo, singlePayItem) {
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '1');
        objHome.setParam('modelType', RenderParam.modelType);
        objHome.setParam('pageCurrent', RenderParam.pageCurrent);
        objHome.setParam('navCurrent', RenderParam.navCurrent);

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('userId', RenderParam.userId);
        objOrderHome.setParam('remark', remark);
        objOrderHome.setParam('isPlaying', 1);
        //objOrderHome.setParam("videoInfo", typeof(videoInfo) !== "undefined" && videoInfo != "" ? JSON.stringify(videoInfo) : "");
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
        objHome.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
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
    classifyId: RenderParam.classifyId,          // 当前分类ID
    entryDuration: 0,       // 进入页面时长,进入页面后进行定时器刷新
    videoList: null,
    videoPage: 0,
    navPage: 0,
    defaultFocusId: 'nav_0',
    /**
     * 渲染主题背景
     */
    renderThemeUI: function () {
        var themeImage = 'url(\'' + g_appRootPath + '/Public/img/' + RenderParam.platformType
            + '/Common/' + RenderParam.commonImgsView + '/bg_home_play.png\')'; // 默认背景
        if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== '') {
            themeImage = 'url(' + RenderParam.fsUrl + RenderParam.themeImage + ')';
        }
        G('home_container').style.backgroundImage = themeImage;
    },
    renderVideoList: function (focusId) {
        LMEPG.UI.Marquee.stop();
        var postData = {
            'page': RenderParam.pageCurrent,
            'userId': RenderParam.userId,
            'modeType': RenderParam.modelType,
            'pageNum': 9
        };
        LMEPG.ajax.postAPI('Channel/moreAjaxList', postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data.result == 0) {
                    Home.videoList = data.list;
                    Home.videoPage = Math.ceil(data.count / 9);
                    Home.showVideoList(focusId);
                } else {
                    LMEPG.UI.showToast('视频加载失败[code=' + data.result + ']');
                }
            } catch (e) {
                LMEPG.UI.showToast('视频加载解析异常' + e.toString());
            }
        }, function (rsp) {
            LMEPG.UI.showToast('视频加载请求失败');
        });
    },
    showVideoList: function (focusId) {
        if (Home.videoList.length > 0) {
            var htmlText = '';
            G('pages').innerHTML = RenderParam.pageCurrent + '/' + Home.videoPage;
            for (var i = 0; i < Home.videoList.length; i++) {
                if (i <= 2) {
                    htmlText += '<div class="video-item row1 col' + (i + 1) + '">' +
                        '<img id="focus-' + i + '" class="video-border" src="' + g_appRootPath + '/Public/img/Common/spacer.gif" index="' + i + '"/>' +
                        '<img  class="video-img" src="' + RenderParam.fsUrl + Home.videoList[i]['image_url'] + '"/>' +
                        '<div class="focus-title" id="focus-title-' + i + '">' + Home.videoList[i]['title'] + '</div>' +
                        '</div>';
                } else if (i >= 3 && i <= 5) {
                    htmlText += '<div class="video-item row2 col' + (i + 1 - 3) + '">' +
                        '<img id="focus-' + i + '" class="video-border" src="' + g_appRootPath + '/Public/img/Common/spacer.gif" index="' + i + '"/>' +
                        '<img  class="video-img" src="' + RenderParam.fsUrl + Home.videoList[i]['image_url'] + '"/>' +
                        '<div class="focus-title" id="focus-title-' + i + '">' + Home.videoList[i]['title'] + '</div>' +
                        '</div>';
                } else {
                    htmlText += '<div class="video-item row3 col' + (i + 1 - 6) + '">' +
                        '<img id="focus-' + i + '" class="video-border" src="' + g_appRootPath + '/Public/img/Common/spacer.gif" index="' + i + '"/>' +
                        '<img  class="video-img" src="' + RenderParam.fsUrl + Home.videoList[i]['image_url'] + '"/>' +
                        '<div class="focus-title" id="focus-title-' + i + '">' + Home.videoList[i]['title'] + '</div>' +
                        '</div>';
                }
            }
            Hide('video_left_page');
            Hide('video_right_page');
            if (RenderParam.pageCurrent > 1) {
                Show('video_left_page');
            }
            if (RenderParam.pageCurrent < Home.videoPage) {
                Show('video_right_page');
            }
            G('videoList').innerHTML = htmlText;
            if (typeof (RenderParam.focusIndex) === 'undefined' || RenderParam.focusIndex == null || RenderParam.focusIndex != '') {
                LMEPG.BM.requestFocus(RenderParam.focusIndex);
            }
            LMEPG.BM.requestFocus(focusId);
        }
    },
    onVideoFocus: function (btn, hasFocus) {
        LMEPG.UI.Marquee.stop();
        LMEPG.UI.Marquee.start(btn.titleId, 5, 2, 50, 'left', 'scroll');
    },
    onVideoBeforeMoveChange: function (dir, current) {
        if (dir == 'down') {
            if ((current.id == 'focus-6' || current.id == 'focus-7' || current.id == 'focus-8') && RenderParam.pageCurrent < Home.videoPage) {
                RenderParam.pageCurrent = parseInt(RenderParam.pageCurrent) + 1;
                Home.renderVideoList('focus-0');
                return false;
            }
        }
        if (dir == 'up') {
            if ((current.id == 'focus-0' || current.id == 'focus-1' || current.id == 'focus-2') && RenderParam.pageCurrent > 1) {
                RenderParam.pageCurrent = parseInt(RenderParam.pageCurrent) - 1;
                Home.renderVideoList('focus-6');
                return false;
            }
        }
    },
    onVideoClick: function (btn) {
        var focusIDName = btn.id;
        var focusElement = G(focusIDName);
        var index = focusElement.getAttribute('index');
        var list = Home.videoList;
        if (list != undefined && list != null) {
            if (index >= 0 && index < list.length) {
                var item = list[index];
                var videoItem = item;
                try {
                    var videoUrlObj = (videoItem.ftp_url instanceof Object ? videoItem.ftp_url : JSON.parse(videoItem.ftp_url));
                    var videoUrl = (RenderParam.platformType == 'hd' ? videoUrlObj.gq_ftp_url : videoUrlObj.bq_ftp_url);
                    var videoInfo = {
                        'sourceId': videoItem.source_id,
                        'videoUrl': videoUrl,
                        'title': videoItem.title,
                        'type': videoItem.model_type,
                        'freeSeconds': videoItem.free_seconds,
                        'userType': videoItem.user_type,
                        'entryType': 3,
                        'entryTypeName': 'tabMore',
                        'focusIdx': focusIDName,
                        'unionCode': data.union_code
                    };
                    // 先判断userType：2需要会员才能观看，其他可以直接观看
                    if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                        Page.jumpPlayVideo(videoInfo);
                    } else {
                        var postData = {
                            'videoInfo': JSON.stringify(videoInfo)
                        };
                        // 存储视频信息
                        LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
                            if (data.result == 0) {
                                Page.jumpBuyVip(videoInfo.focusIdx, videoInfo.title);
                            } else {
                                LMEPG.UI.showToast('系统报错', 3);
                            }
                        });
                    }
                } catch (e) {
                }
            }
        }
    },

    /**
     * 顶部 导航栏菜单获得焦点
     * @param btn
     * @param hasFocus
     */
    onNavFocus: function (btn, hasFocus) {
        if (hasFocus == true) {
            G(btn.id).className = G(btn.id).className + ' nav_focus';
        } else {
            G(btn.id).className = G(btn.id).className.replace('nav_focus', '');
        }
    },

    /**
     * 顶部 导航栏移动前焦点处理
     * @param dir
     * @param current
     */
    onNavBeforeMoveChange: function (dir, current) {
        if (dir == 'down') {
            if (current.id == 'nav_4' && RenderParam.navCurrent < Home.navPage) {
                RenderParam.navCurrent = parseInt(RenderParam.navCurrent) + 1;
                Home.initNav('nav_4');
                return false;
            }
        }
        if (dir == 'up') {
            if (current.id == 'nav_0') {
                if (RenderParam.navCurrent > 0) {
                    RenderParam.navCurrent = parseInt(RenderParam.navCurrent) - 1;
                    Home.initNav('nav_0');
                    return false;
                } else {
                    LMEPG.BM.requestFocus('search');
                }
            }
        }
    },

    onNavClick: function (btn) {
        var m_id = G(btn.id).getAttribute('model_type');
        Page.jumpHomeTab('tabMore', RenderParam.classifyId, m_id);
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
            nextFocusDown: 'nav_0',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_search.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/f_search.png',
            click: Home.onMenuClick,
            focusChange: Home.onMenuFocus,
            beforeMoveChange: Home.onMenuBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 0
        });
        buttons.push({
            id: 'collect',
            name: '收藏',
            type: 'img',
            nextFocusLeft: 'search',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'nav_0',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_collect.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/f_collect.png',
            click: Home.onMenuClick,
            focusChange: Home.onMenuFocus,
            beforeMoveChange: Home.onMenuBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 1
        });
    },
    /**
     * 初始化导航栏
     */
    initNav: function (focusId) {
        for (var i = 0; i < RenderParam.navConfig.length; i++) {
            var data = RenderParam.navConfig[i];
            if (RenderParam.classifyId == data.navigate_id) {
                G('nav_title').innerHTML = data.navigate_name;
                break;
            }
        }
        var html = '';
        var firstId;
        var count = 0;
        Home.navPage = RenderParam.navigateModelInfo.length - 5;
        for (var i = RenderParam.navCurrent; i < RenderParam.navigateModelInfo.length; i++) {
            if (count == 5) {
                break;
            }
            var data = RenderParam.navigateModelInfo[i];
            if (i == RenderParam.navCurrent) {
                firstId = data.model_type;
            }
            if (RenderParam.modelType == data.model_type) {
                html += '<div id="nav_' + count + '" model_type="' + data.model_type + '" class="nav_current">' +
                    data.model_name +
                    '</div>';
                Home.defaultFocusId = 'nav_' + count;
            } else {
                html += '<div id="nav_' + count + '" model_type="' + data.model_type + '">' +
                    data.model_name +
                    '</div>';
            }

            buttons.push({
                id: 'nav_' + count,
                name: data.model_name,
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: 'focus-0',
                nextFocusUp: 'nav_' + (count - 1),
                nextFocusDown: 'nav_' + (count + 1),
                groupId: 'nav',
                click: Home.onNavClick,
                focusChange: Home.onNavFocus,
                beforeMoveChange: Home.onNavBeforeMoveChange,
                moveChange: LMEPG.emptyFunc,
                cNavId: count
            });
            count++;
        }
        Hide('nav_left_page');
        Hide('nav_right_page');
        if (RenderParam.navCurrent > 0) {
            Show('nav_left_page');
        }
        if (RenderParam.navCurrent < Home.navPage) {
            Show('nav_right_page');
        }
        if (RenderParam.modelType == '') {
            RenderParam.modelType = firstId;
        }
        G('nav_list').innerHTML = html;
        if (focusId != '') {
            Home.defaultFocusId = focusId;
            G(focusId).className = G(focusId).className + ' nav_focus';
            LMEPG.BM.requestFocus(Home.defaultFocusId);
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

    /**
     * 按键事件回调
     * @param code
     */
    onKeyDown: function (code) {
        switch (code) {
            case KEY_3:
                var keys = LMEPG.KeyEventManager.getKeyCodes();
                if (keys.length >= 4) {
                    if (keys[keys.length - 1] == KEY_3
                        && keys[keys.length - 2] == KEY_8
                        && keys[keys.length - 3] == KEY_9
                        && keys[keys.length - 4] == KEY_3) {
                        // 进入测试服
                        Page.jumpTestPage();
                    }
                }
        }
    },
    /**
     * 监听上页按键
     */
    pressPreviousPage: function () {
        if (RenderParam.pageCurrent > 1) {
            RenderParam.pageCurrent = parseInt(RenderParam.pageCurrent) - 1;
            Home.renderVideoList('focus-6');
            return false;
        }
    },
    /**
     * 监听下页按键
     */
    pressNextPage: function () {
        if (RenderParam.pageCurrent < Home.videoPage) {
            RenderParam.pageCurrent = parseInt(RenderParam.pageCurrent) + 1;
            Home.renderVideoList('focus-0');
            return false;
        }
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
        LMEPG.Func.removeIPanelDefaultFocusBorder();      // 取消元素默认的边框
        Home.renderThemeUI();       // 刷新主页背景
        Home.initTopMenu();         // 顶部菜单
        Home.initMarquee();         // 初始化滚动字幕
        for (var i = 0; i < RenderParam.navigateModelInfo.length; i++) {
            var data = RenderParam.navigateModelInfo[i];
            if (RenderParam.modelType == data.model_type) {
                console.log(i);
                if (i >= 4) {
                    RenderParam.navCurrent = i - 4;
                }
                break;
            }
        }
        Home.initNav('');             // 初始化导航栏
        Home.renderVideoList();


        buttons.push({
            id: 'focus-0',
            name: '',
            type: 'img',
            nextFocusLeft: 'nav_0',
            nextFocusRight: 'focus-1',
            nextFocusUp: 'search',
            nextFocusDown: 'focus-3',
            titleId: 'focus-title-0',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/video_border.png',
            click: Home.onVideoClick,
            focusChange: Home.onVideoFocus,
            beforeMoveChange: Home.onVideoBeforeMoveChange,
            moveChange: LMEPG.emptyFunc
        });
        buttons.push({
            id: 'focus-1',
            name: '',
            type: 'img',
            nextFocusLeft: 'focus-0',
            nextFocusRight: 'focus-2',
            nextFocusUp: 'search',
            nextFocusDown: 'focus-4',
            titleId: 'focus-title-1',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/video_border.png',
            click: Home.onVideoClick,
            focusChange: Home.onVideoFocus,
            beforeMoveChange: Home.onVideoBeforeMoveChange,
            moveChange: LMEPG.emptyFunc
        });
        buttons.push({
            id: 'focus-2',
            name: '',
            type: 'img',
            nextFocusLeft: 'focus-1',
            nextFocusRight: '',
            nextFocusUp: 'search',
            nextFocusDown: 'focus-5',
            titleId: 'focus-title-2',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/video_border.png',
            click: Home.onVideoClick,
            focusChange: Home.onVideoFocus,
            beforeMoveChange: Home.onVideoBeforeMoveChange,
            moveChange: LMEPG.emptyFunc
        });
        buttons.push({
            id: 'focus-3',
            name: '',
            type: 'img',
            nextFocusLeft: 'nav_0',
            nextFocusRight: 'focus-4',
            nextFocusUp: 'focus-0',
            nextFocusDown: 'focus-6',
            titleId: 'focus-title-3',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/video_border.png',
            click: Home.onVideoClick,
            focusChange: Home.onVideoFocus,
            beforeMoveChange: Home.onVideoBeforeMoveChange,
            moveChange: LMEPG.emptyFunc
        });
        buttons.push({
            id: 'focus-4',
            name: '',
            type: 'img',
            nextFocusLeft: 'focus-3',
            nextFocusRight: 'focus-5',
            nextFocusUp: 'focus-1',
            nextFocusDown: 'focus-7',
            titleId: 'focus-title-4',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/video_border.png',
            click: Home.onVideoClick,
            focusChange: Home.onVideoFocus,
            beforeMoveChange: Home.onVideoBeforeMoveChange,
            moveChange: LMEPG.emptyFunc
        });
        buttons.push({
            id: 'focus-5',
            name: '',
            type: 'img',
            nextFocusLeft: 'focus-4',
            nextFocusRight: '',
            nextFocusUp: 'focus-2',
            nextFocusDown: 'focus-8',
            titleId: 'focus-title-5',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/video_border.png',
            click: Home.onVideoClick,
            focusChange: Home.onVideoFocus,
            beforeMoveChange: Home.onVideoBeforeMoveChange,
            moveChange: LMEPG.emptyFunc
        });
        buttons.push({
            id: 'focus-6',
            name: '',
            type: 'img',
            nextFocusLeft: 'nav_0',
            nextFocusRight: 'focus-7',
            nextFocusUp: 'focus-3',
            nextFocusDown: '',
            titleId: 'focus-title-6',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/video_border.png',
            click: Home.onVideoClick,
            focusChange: Home.onVideoFocus,
            beforeMoveChange: Home.onVideoBeforeMoveChange,
            moveChange: LMEPG.emptyFunc
        });
        buttons.push({
            id: 'focus-7',
            name: '',
            type: 'img',
            nextFocusLeft: 'focus-6',
            nextFocusRight: 'focus-8',
            nextFocusUp: 'focus-4',
            nextFocusDown: '',
            titleId: 'focus-title-7',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/video_border.png',
            click: Home.onVideoClick,
            focusChange: Home.onVideoFocus,
            beforeMoveChange: Home.onVideoBeforeMoveChange,
            moveChange: LMEPG.emptyFunc
        });
        buttons.push({
            id: 'focus-8',
            name: '',
            type: 'img',
            nextFocusLeft: 'focus-7',
            nextFocusRight: '',
            nextFocusUp: 'focus-5',
            nextFocusDown: '',
            titleId: 'focus-title-8',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/video_border.png',
            click: Home.onVideoClick,
            focusChange: Home.onVideoFocus,
            beforeMoveChange: Home.onVideoBeforeMoveChange,
            moveChange: LMEPG.emptyFunc
        });
        LMEPG.BM.init(Home.defaultFocusId, buttons, '', true);
        //启动字幕滚动
        //LMEPG.UI.Marquee.start("scroll_message", 7, 2, 50, "left", "scroll_message");

        Home.startTimer(); // 启动定时器
    }
};

// 定义全局按钮
var buttons = [];

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_VOL_UP: LMEPG.mp.upVolume,
        KEY_VOL_DOWN: LMEPG.mp.downVolume,
        KEY_3: Home.onKeyDown,
        KEY_PAGE_UP: Home.pressPreviousPage,	        //上一页事件
        KEY_PAGE_DOWN: Home.pressNextPage           //下一页事件
    }
);

function onBack() {
    LMEPG.Intent.back();
}

window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};
