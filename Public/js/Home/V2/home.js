// 主页控制js
var isShowToast = false; // 是否已经弹出提示框 true--表示已经弹出
var currentFocusId;

var Page = {
    // 退出应用。
    exitAppHome: function () {
        if (typeof (iPanel) != 'undefined') {
            iPanel.focusWidth = LMEPG.Cookie.getCookie('iPanel_focusWidth'); // 还原系统光标的大小
        }
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
        var objCurrent = LMEPG.Intent.createIntent('home');
        objCurrent.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);

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
     * 疫情模块接口
     */
    jumpEpidemic: function () {
        var objHome = Page.getCurrentPage();

        var objEpidemic = LMEPG.Intent.createIntent('report-index');
        objEpidemic.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objEpidemic, objHome);
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
    },

    /**
     * 进度相应模块的功能
     * @param data
     */
    jumpModule: function (data) {
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
                    'unionCode': data.union_code,
                    'entryType': 1,
                    'entryTypeName': 'home',
                    'focusIdx': LMEPG.ButtonManager.getCurrentButton().id
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
                // 活动;
                Page.jumpActivityPage(data.source_id);
                break;
            case '19':
                // 专家详情页
                Page.jumpExpertHome();
                break;
            case '20':
                if (data.isJoinInquiryRoom) {
                    Page.jumpExpertRecordBridge();
                } else {
                    Page.jumpExpertRecordHome();
                }
                break;
            case '9':
                Page.jumpInquiryDoctorList();
                break;
            case '22':
                // 具体地址跳转
                LMEPG.UI.showToast('具体地址跳转');
                break;
            case '48':
                Page.jumpEpidemic();
                break;
        }
    }
};

/**
 * 处理首页轮播
 * @type {{}}
 */
var Play = {
    currPollVideoId: 0,     //当前轮播id

    /**
     * 音量控制器
     */
    volumeController: {
        _autoHideTimer: null, //自动隐藏音量调节进度条定时器
        MAX_SHOW_DURATION: 5 * 1000,    //自动隐藏音量进度条的时间，单位毫秒

        /**
         * 创建音量显示UI
         * @returns {string}
         */
        createUI: function () {
            if (G('volumeUI') != null) {
                //已经存在
                return '';
            }

            var html = '<div id="volumeUI">';
            html += '<img id ="volume_background" src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/volume_background.png"/>';
            html += '<img id ="volume_horn" src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/volume_horn.png"/>';
            html += '<div id="volume_progressbar_home">';
            html += '<div id="volume_fill" style="width:0;">';
            html += '<img id="volume_ball" style="left:0px;"/>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            G('volume_container').innerHTML = html;
            H('volume_container');
        },

        /**
         * 更新音量
         * @param volumeValue
         */
        updateVolume: function (volumeValue) {
            S('volume_container');
            Play.volumeController._moveVolumeBall(volumeValue);
            Play.volumeController._startVolumeTimer();
        },

        // 移动音量值图标
        _moveVolumeBall: function (volumeValue) {
            var offset = volumeValue * 4;
            G('volume_ball').style.left = offset + 'px';
            G('volume_fill').style.width = offset + 'px';
            if (offset == 0) {
                // 当到达最小时，就显示静音的小喇叭
                G('volume_horn').src = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/volume_horn_none.png';
            } else {
                G('volume_horn').src = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V1/volume_horn.png';
            }
        },

        // 启动定时器隐藏音量条
        _startVolumeTimer: function () {
            if (Play.volumeController._autoHideTimer) {
                clearTimeout(Play.volumeController._autoHideTimer);
            }
            Play.volumeController._autoHideTimer = setTimeout(function () {
                H('volume_container');
                Play.volumeController._autoHideTimer = null;
            }, Play.volumeController.MAX_SHOW_DURATION);// 5秒钟后自动隐藏
        }
    },

// 启动小窗播放
    startPollPlay: function () {
        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        LMEPG.mp.destroy();

        var videoUrl = Play.getCurrentPollVideoUrl(); //播放地址
        switch (RenderParam.carrierId) {
            case '320092':   // 江苏电信
                this.play320092(videoUrl);
                break;
            case '000051':
                this.play000051(videoUrl);
                break;
            case '340092':
                this.play340092(videoUrl);
                break;
            default:
                this.defaultPlay(videoUrl);
                break;
        }
    },

    /** 处理首页轮播视频 */
    playHomePollVideo: function () {
        var data = Play.getCurrentPollVideoData();
        if (data == null) {
            return;
        }
        // 创建视频信息
        var videoInfo = {
            'sourceId': data.sourceId,
            'videoUrl': data.videoUrl,
            'title': data.title,
            'type': data.modelType,
            'userType': data.userType,
            'freeSeconds': data.freeSeconds,
            'unionCode': data.unionCode,
            'entryType': 1,
            'entryTypeName': '首页轮播视频'
        };

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            Page.jumpPlayVideo(videoInfo);
        } else {
            Page.jumpBuyVip(videoInfo.title, videoInfo);
        }
    }
    ,

    /**
     * 得到当前轮播地址
     */
    getCurrentPollVideoUrl: function () {
        return RenderParam.homePollVideoList.list[Play.currPollVideoId].videoUrl;
    }
    ,

    /**
     * 得到当前轮播数据对象
     * @returns {*}
     */
    getCurrentPollVideoData: function () {
        return RenderParam.homePollVideoList.list[Play.currPollVideoId];
    }
    ,

    /**
     * 江苏电信小窗播放
     * @param videoUrl
     */
    play320092: function (videoUrl) {
        setTimeout(function () {
            if (RenderParam.thirdPlayerUrl == undefined || RenderParam.thirdPlayerUrl == '') {
                LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                return;
            }
            var playPosition = [0, 0, 0, 0];
            if (RenderParam.platformType == 'hd') {
                // 高清
                switch (RenderParam.stbModel) {
                    case 'RP0201':  //标清特殊型号判断
                        playPosition = [183, 110, 261, 222];
                        break;
                    default:
                        playPosition = [358, 150, 550, 550];
                        break;
                }
            } else {
                // 标清
                playPosition = [175, 115, 282, 160];
            }
            var playParam = LMEPG.mp.dispatcherUrl.getUrlWith320092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl);
            var thirdPlayerFullUrl = RenderParam.thirdPlayerUrl + playParam;

            G('iframe_small_screen').setAttribute('src', thirdPlayerFullUrl); // 设置第三方播放器地址
            LMEPG.mp.initPlayerByBind();
        }, 500);
    }
    ,

    /**
     * 中国联通小窗播放
     * @param videoUrl
     */
    play000051: function (videoUrl) {
        setTimeout(function () {
            if (RenderParam.stbModel == 'IP506H_54U3') { //内蒙联通海信盒子
                LMEPG.mp.initPlayerByBind();
            } else {
                LMEPG.mp.initPlayer();
            }
            var playVideoUrl = LMEPG.Func.http2rtsp(videoUrl);
            var playPosition = [parseInt(0), parseInt(0), parseInt(0), parseInt(0)]; // left,top,width,height
            if (RenderParam.platformType == 'hd') {
                playPosition = [parseInt(435), parseInt(145), parseInt(550), parseInt(302)];
            } else {
                switch (RenderParam.stbModel) {
                    case 'MP606H': // 海信 内蒙地区
                    case 'MP606H_54U3':
                        playPosition = [parseInt(208), parseInt(116), parseInt(300), parseInt(180)];
                        break;
                    case 'S65':
                        playPosition = [parseInt(215), parseInt(120), parseInt(785), parseInt(258)];
                        break;
                    case 'EC6109_pub_jljlt': // 内蒙地区
                        playPosition = [parseInt(213), parseInt(120), parseInt(290), parseInt(160)];
                        break;
                    default:
                        // playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
                        playPosition = [parseInt(208), parseInt(116), parseInt(300), parseInt(180)];
                        break;
                }
            }
            // 开始小窗播放 :left--top--width--height:
            LMEPG.mp.playOfSmallscreen(playVideoUrl, playPosition[0], playPosition[1], playPosition[2], playPosition[3]);
        }, 500);
    }
    ,

    /**
     * 安徽电信小窗播放
     * @param videoUrl
     */
    play340092: function (videoUrl) {
        setTimeout(function () {
            LMEPG.mp.initPlayerMode1(); //初始化
            var playPosition = [0, 0, 0, 0]; //left,top,width,height
            if (RenderParam.platformType == 'hd') {
                switch (RenderParam.stbModel) {
                    case 'Q5': // 数码视讯Q5
                        playPosition = [parseInt(450), parseInt(147), parseInt(535), parseInt(302)];
                        break;
                    default:
                        playPosition = [parseInt(435), parseInt(145), parseInt(550), parseInt(302)];
                        break;
                }
            } else {
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }
            LMEPG.mp.playOfSmallscreen(videoUrl, playPosition[0], playPosition[1], playPosition[2], playPosition[3]); //小窗播放
        }, 500);
    }
    ,

    /**
     * 默认小窗播放
     * @param videoUrl
     */
    defaultPlay: function (videoUrl) {
        setTimeout(function () {
            LMEPG.mp.initPlayer(); // 初始化
            var playPosition = [0, 0, 0, 0]; // left,top,width,height
            if (RenderParam.platformType == 'hd') {
                playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)];
            } else {
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }
            LMEPG.mp.playOfSmallscreen(videoUrl, playPosition[0], playPosition[1], playPosition[2], playPosition[3]); //小窗播放
        }, 500);
    }
    ,

    /**
     * 播放过程中的事件
     */
    onPlayEvent: function (keyCode) {
        if (LMEPG.mp.isEnd(keyCode) || LMEPG.mp.isError(keyCode)) {
            var videoCount = RenderParam.homePollVideoList.count;
            if (Play.currPollVideoId >= 0 && Play.currPollVideoId < videoCount - 1) {
                Play.currPollVideoId++;
            } else {
                Play.currPollVideoId = 0;
            }
            Play.startPollPlay();
        }
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
        isJoinInquiryRoom: false,         //是否可以进入诊室
        // 初始化banner
        initBanner: function (rawData) {
            if (rawData == null || rawData.length <= 0)
                return;
            for (var i = 0; i < 3 && i < rawData.length; i++) { // 暂时最多显示三项
                if (rawData.length > 1) {
                    Show('indicator_' + i); // 配置的banner项大于1 才显示指示器
                }
                Home.Banner.item[i] = {};
                Home.Banner.item[i].image_url = rawData[i].img_url;      // 背景图片
                Home.Banner.item[i].entry_type = rawData[i].entry_type + '';         // 类型
                Home.Banner.item[i].rawData = rawData[i];
                if (Home.Banner.item[i].entry_type == '20') {
                    // 问专家预约信息提示
                    Home.Banner.item[i].info = rawData[i].recordList.data[0];        // 只处理第一个提示内容
                    Home.Banner.item[i].isJoinInquiryRoom = false;
                }
            }
            Home.Banner.update(); // 先初始化刷新一次页面
            Home.Banner.startTimer();  //启动banner定时器。
        },

        // 启动定时器
        startTimer: function () {
            Home.Banner.timer = setInterval(Home.Banner.onTimer, Home.Banner.MAX_TIMER_DURATION);
        },

        // 关闭定时器
        closeTimer: function () {
            clearInterval(Home.Banner.timer);
        },

        // 定时器触发
        onTimer: function () {
            //定时切换banner
            Home.Banner.bannerIndex = Home.Banner.bannerIndex < Home.Banner.item.length - 1 ?
                Home.Banner.bannerIndex + 1 : 0;
            Home.Banner.update();
        },

        /**
         * 当Banner被点击
         */
        onBannerClick: function (btn) {
            var configInfo = Home.Banner.transModuleData(Home.Banner.item[Home.Banner.bannerIndex]);
            Page.jumpModule(configInfo);
        },

        /**
         * 转化第一个位置配置的数据为通用的配置数据类型
         * @param data
         * @returns {{}}
         */
        transModuleData: function (data) {
            var configInfo = {};
            configInfo.entryType = data.entry_type;
            configInfo.image_url = data.img_url;
            if (data.entry_type == '20') {
                configInfo.isJoinInquiryRoom = data.isJoinInquiryRoom;
                configInfo.info = data.info;
            } else if (data.entry_type == '19') {
                return configInfo;
            } else {
                var data = data.rawData;
                var tempInnerParametersObj = JSON.parse(data.inner_parameters);
                var tempParametersArr = JSON.parse(data.parameters);
                configInfo.entryType = data.entry_type;
                configInfo.image_url = data.img_url;
                configInfo.model_type = tempInnerParametersObj.model_type;
                configInfo.play_url = tempInnerParametersObj.ftp_url;
                configInfo.source_id = tempParametersArr[0].param;
                configInfo.title = tempInnerParametersObj.title;
                configInfo.user_type = tempInnerParametersObj.user_type;
            }
            return configInfo;
        },

        update: function () {
            Home.Banner.updateView();
            Home.Banner.updateIndicator();
            Home.Banner.updateExpertInfo();
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
            G('indicator_' + Home.Banner.bannerIndex).src = indicatorSelectedImage;
        },

        /**
         * 更新视图
         */
        updateView: function () {
            G('recommend_1').src = RenderParam.fsUrl + Home.Banner.item[Home.Banner.bannerIndex].image_url;
        },

        /**
         * 更新专家提示信息
         */
        updateExpertInfo: function () {
            if (Home.Banner.item[Home.Banner.bannerIndex].entry_type != '20') {
                H('recommend_text_1');
            } else {
                S('recommend_text_1');
                var expertName = Home.Banner.item[Home.Banner.bannerIndex].info.doctor_name;
                var beginDate = Home.Banner.item[Home.Banner.bannerIndex].info.begin_dt;
                var endDate = Home.Banner.item[Home.Banner.bannerIndex].info.end_dt;

                var startInquiryDate = new Date(Home.formatDate(beginDate)).getTime();
                var checkTimer = new Date(Home.formatDate(RenderParam.checkTime)).getTime();

                var strInquiryStartTime = '3天内安排就诊';  // 默认3天内开始
                if (new Date(Home.formatDate(beginDate)).format('yyyy') != '2099') {
                    strInquiryStartTime = new Date(Home.formatDate(beginDate)).format('yyyy-MM-dd hh:mm')
                        + '到' + new Date(Home.formatDate(endDate)).format('hh:mm');
                }
                var timeDuration = parseInt(startInquiryDate) - parseInt(checkTimer);
                var inquiryInfo = '';
                if (timeDuration < 20 * 60 * 1000) {
                    // 门诊已经开始 或者 在 20分钟以内
                    Home.Banner.item[Home.Banner.bannerIndex].isJoinInquiryRoom = true;
                    inquiryInfo = '您预约的' + expertName + '专家门诊（' + strInquiryStartTime
                        + '）现在已可进入候诊室等候， 点此进入候诊室。';
                } else {
                    Home.Banner.item[Home.Banner.bannerIndex].isJoinInquiryRoom = false;
                    inquiryInfo = '您已预约' + expertName + '专家门诊（' + strInquiryStartTime
                        + '）， 点此可查看预约详情。';
                }
                G('expert_tips').innerHTML = inquiryInfo;
            }
        }
    },

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
        var keys = LMEPG.KeyEventManager.getKeyCodes();
        if (current.id == 'nav_0' && dir == 'up') {
            // 中国联通EPG,山东盒子华为EC6108V8数字按键值异常，采用该方案进入测试服
            if (keys.length >= 10) {
                if (keys[keys.length - 1] == KEY_UP
                    && keys[keys.length - 2] == KEY_UP
                    && keys[keys.length - 3] == KEY_UP
                    && keys[keys.length - 4] == KEY_UP
                    && keys[keys.length - 5] == KEY_UP
                    && keys[keys.length - 6] == KEY_UP
                    && keys[keys.length - 7] == KEY_UP
                    && keys[keys.length - 8] == KEY_UP
                    && keys[keys.length - 9] == KEY_UP
                    && keys[keys.length - 10] == KEY_UP) {
                    // 进入测试服
                    Page.jumpTestPage();
                }
            }
        }
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
            Page.jumpHomeTab('homeTab4', 'recommend_border_4');
            return false;
        }
    },

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
                    LMEPG.ButtonManager.requestFocus('nav_' + Home.currNavId);
                    return false;
            }
        } else if (dir == 'right') {
            switch (current.id) {
                case 'recommend_border_3':
                case 'recommend_border_7':
                    Page.jumpHomeTab('homeTab1', 'recommend_border_1');
                    return false;
            }
        }
    },

    /**
     * 推荐位被点击
     * @param btn
     */
    onRecommendClick: function (btn) {
        if (btn.id == 'recommend_border_1') {
            // 调用banner被点击
            return Home.Banner.onBannerClick(btn);
        }
        var postion = btn.cPosition;   // 得到位置类型数据
        var data = Home.getRecommendDataByPosition(postion);
        if (data == null) {
            // 没有相关的推荐位数据
            if (btn.id == 'recommend_border_2') {
                //推荐位2 如果没有配置数据，是轮播视频，点击放大播放
                Play.playHomePollVideo();
            }
            return;
        }
        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(data.position, data.order);
        Page.jumpModule(data);
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
                'returnPageName': 'home'
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
                'returnPageName': 'home'
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
                nextFocusRight: 'recommend_border_4',
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
                nextFocusRight: 'recommend_border_4',
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
                nextFocusRight: 'recommend_border_4',
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
            nextFocusDown: 'recommend_border_4',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_1.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 1,
            cPosition: '11'   //数据对应位置，用来查找对应数据
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
            focusChange: Home.emptyFunc,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 2,
            cPosition: '12'        //数据对应位置，用来查找对应数据
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
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_3.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 3,
            cPosition: '13'
        });
        buttons.push({
            id: 'recommend_border_4',
            name: '推荐位4',
            type: 'img',
            nextFocusLeft: 'menu_border_4',
            nextFocusRight: 'recommend_border_5',
            nextFocusUp: 'recommend_border_1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_4.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 4,
            cPosition: '14'
        });
        buttons.push({
            id: 'recommend_border_5',
            name: '推荐位5',
            type: 'img',
            nextFocusLeft: 'recommend_border_4',
            nextFocusRight: 'recommend_border_6',
            nextFocusUp: 'recommend_border_2',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_5.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 5,
            cPosition: '15'
        });
        buttons.push({
            id: 'recommend_border_6',
            name: '推荐位6',
            type: 'img',
            nextFocusLeft: 'recommend_border_5',
            nextFocusRight: 'recommend_border_7',
            nextFocusUp: 'recommend_border_2',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + RenderParam.classifyId + '_6.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 6,
            cPosition: '16'
        });
        buttons.push({
            id: 'recommend_border_7',
            name: '推荐位7',
            type: 'img',
            nextFocusLeft: 'recommend_border_6',
            nextFocusRight: '',
            nextFocusUp: 'recommend_border_3',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V2/bg_home_recommend_border_' + +RenderParam.classifyId + '_7.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 7,
            cPosition: '17'
        });
    },

    // 渲染推荐位图片
    renderRecommend: function () {
        // 遍历推荐列表
        for (var i = 0; i < RenderParam.recommendDataList.length; i++) {
            var data = RenderParam.recommendDataList[i];
            switch (data.position) {
                case '11':
                    // 第一个位置 用户其它用途，暂时不管  初始化位置
                    Home.Banner.initBanner(RenderParam.initPositionList);
                    break;
                case '12':
                    // 第二个位置，用于轮播或其它，暂时不管
                    break;
                case '13':
                    // 第三个位置
                    G('recommend_3').src = RenderParam.fsUrl + data.image_url;
                    break;
                case '14': // 第四个位置
                    G('recommend_4').src = RenderParam.fsUrl + data.image_url;
                    break;

                case '15': // 第五个位置
                    G('recommend_5').src = RenderParam.fsUrl + data.image_url;
                    break;

                case '16': // 第六个位置
                    G('recommend_6').src = RenderParam.fsUrl + data.image_url;
                    break;

                case '17': // 第七个位置
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

    /**
     * 按键事件回调
     * @param code
     */
    onKeyDown: function (code) {
        LMEPG.Log.debug('V2 ---> home.js onKeyDown code ' + code);
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
                        Page.jumpTestPage();
                    }
                }
                break;
            case KEY_6:
                var keys = LMEPG.KeyEventManager.getKeyCodes();
                LMEPG.Log.debug('V2 ---> home.js  key_3: keys=' + keys);
                if (keys.length >= 4) {
                    if (keys[keys.length - 1] == KEY_6
                        && keys[keys.length - 2] == KEY_6
                        && keys[keys.length - 3] == KEY_8
                        && keys[keys.length - 4] == KEY_8) {
                        // 进入测试服
                        window.location.href = 'http://222.85.144.70:40050/index.php?lmuf=0&lmsl=hd&lmcid=01000051&lmsid=JointActivityWordsPuzzle20190124&lmp=52&UserID=cutv518112276576_211&LoginID=vern&tvPlatForm=&carrierId=211&type=11&resolution=hd&feeAccoutCode=vern&UserToken=0E344A67656332ED4F708ED9D7C3230&StbVendor=HUWEI&BuyWebUrl=&BuyService=&RechargeUrl=&PlatformExt=&HomeUrl=http%3A%2F%2F202.99.114.62%3A35807%2Fepg_uc%2Freturn.action%3FreturnUrl%3DaHR0cDovLzIwMi45OS4xMTQuNjI6MzU4MDcvZXBnX3VjL3Nob3BwaW5nLmFjdGlvbj9yZXR1cm5Vcmw9JTJGZXBnX3VjJTJGcmVjb21tZW5kcy5hY3Rpb24mY3VycmVudFBvc3Rpb249MywxJlVzZXJJRD12ZXJu&ReturnUrl=http%3A%2F%2F202.99.114.62%3A35807%2Fepg_uc%2Freturn.action%3FreturnUrl%3DaHR0cDovLzIwMi45OS4xMTQuNjI6MzU4MDcvZXBnX3VjL3Nob3BwaW5nLmFjdGlvbj9yZXR1cm5Vcmw9JTJGZXBnX3VjJTJGcmVjb21tZW5kcy5hY3Rpb24mY3VycmVudFBvc3Rpb249MywxJlVzZXJJRD12ZXJu';
                    }
                }
                break;
        }
    },

    /**
     * 音量+
     */
    onVolumeUp: function () {
        var volumeValue = LMEPG.mp.upVolume();
        if (RenderParam.carrierId == '340092') {
            Play.volumeController.updateVolume(volumeValue);
        }
    },

    /**
     * 音量-
     */
    onVolumeDown: function () {
        var volumeValue = LMEPG.mp.downVolume();
        if (RenderParam.carrierId == '340092') {
            Play.volumeController.updateVolume(volumeValue);
        }
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
        LMEPG.Log.debug('V2 ---> home.js init() ');

        G('default_link').focus();  // 防止页面丢失焦点

        Play.volumeController.createUI();

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
        Play.startPollPlay();
        Home.toggleLockShow();
    }
};

// 定义全局按钮
var buttons = [];

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        EVENT_MEDIA_END: Play.onPlayEvent,
        EVENT_MEDIA_ERROR: Play.onPlayEvent,
        KEY_VOL_UP: Home.onVolumeUp,
        KEY_VOL_DOWN: Home.onVolumeDown,
        KEY_3: Home.onKeyDown,
        KEY_6: Home.onKeyDown
    }
);

function onBack() {
    // 如果已经弹框，按返回时，把弹框关闭，不进行后续操作
    if (isShowToast) {
        closeToast();
        return;
    }

    Page.jumpHoldPage();
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

window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};
