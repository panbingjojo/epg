/**
 * Created by Administrator on 2018-11-21.
 */
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
            case '510094'://四川广电
            function __exit510094() {
                RenderParam.historyLength = LMEPG.Cookie.getCookie('c_history_length');
                var splashHistory = parseInt(RenderParam.historyLength);
                if (isNaN(splashHistory)) {
                    LMEPG.Log.info('[js/homeV7/function.js]-->exitApp-->"RenderParam.historyLength(' + RenderParam.historyLength + ')" is NaN!');
                    LMEPG.Intent.back('IPTVPortal');
                } else {
                    var currentLength = history.length;
                    if (currentLength === splashHistory) {
                        currentLength++;
                    }
                    var backLength = currentLength - splashHistory + 1;

                    LMEPG.Log.info('[js/homeV7/function.js]-->exitApp-->"Current/Origin historyLength=' + currentLength + '/' + splashHistory + ' --> history.go(-' + backLength + ')');
                    console.log('[js/homeV7/function.js]-->exitApp-->"Current/Origin historyLength=' + currentLength + '/' + splashHistory + ' --> history.go(-' + backLength + ')');

                    history.go(-backLength);
                }
            }

                //TODO Annotated by Songhui on 2019-10-8
                // 注：由于使用计算规则（window.history.go(-(var backLength = currentLength - splashHistory + 1))）
                // 跳转到启动我方39健康EPG的splash前一个君吉EPG（名为“健康四川”EPG）页面时，按1次返回键总会先退出到我方splash页面，
                // 除非快速按2次返回，才可正常退到君吉页面且并不会出现39健康splash页面。故，临时硬编码模拟连续2次点击，暂时解决这个
                // 问题。因为与 广西广电 一样的 history.go 方式退出到大厅，也是计算出其进入前的history值，逻辑应该没有问题。
                // 但为何不正常？目前未发现原因和有效解决方案，待后期再观察思考，以完善这种不友好的逻辑写法！
                LMEPG.UI.forbidDoubleClickBtn(function () {
                    __exit510094();
                    __exit510094();
                });
                break;
            default:
                LMEPG.Intent.back('IPTVPortal');
                break;
        }
    },

    /**
     * 跳转到3983测试页
     */
    jumpTestPage: function () {
        var objCurrent = JumpPage.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent('testEntrySet');
        objHomeTab.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    /**
     * 跳转 - 切换导航页
     */
    jumpHomeTab: function (tabName, focusIndex) {
        var objCurrent = JumpPage.getCurrentPage();

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
        var objCurrent = JumpPage.getCurrentPage();
        objCurrent.setParam('userId', RenderParam.userId);
        objCurrent.setParam('classifyId', RenderParam.classifyId);
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
        var objCurrent = JumpPage.getCurrentPage();
        objCurrent.setParam('userId', RenderParam.userId);
        objCurrent.setParam('classifyId', RenderParam.classifyId);
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
        var objHome = JumpPage.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', RenderParam.classifyId);
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
        var objHome = JumpPage.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', 1);
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
        var objHome = JumpPage.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', RenderParam.classifyId);
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
        var objCurrent = JumpPage.getCurrentPage();

        var objHospitalList = LMEPG.Intent.createIntent('appointmentRegister');
        LMEPG.Intent.jump(objHospitalList, objCurrent);
    },

    /**
     * 跳转到夜间药房
     */
    jumpnightMedicine: function () {
        var objCurrent = JumpPage.getCurrentPage();
        objCurrent.setParam('userId', RenderParam.userId);
        // objCurrent.setParam("classifyId", RenderParam.classifyId);
        objCurrent.setParam('position', 'QHotherPages');
        objCurrent.setParam('fromId', '1');
        objCurrent.setParam('page', '0');

        var objCollect = LMEPG.Intent.createIntent('nightMedicine');
        objCollect.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objCollect, objCurrent);
    },

    jumpInquiry: function () {
        // 支持视频问诊，直接进入
        var objCurrent = JumpPage.getCurrentPage();

        objDoctorP2P = LMEPG.Intent.createIntent('doctorList');
        objDoctorP2P.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objDoctorP2P, objCurrent);
    },

    jumpInquiryRecord: function () {
        var objCurrent = JumpPage.getCurrentPage();

        objDoctorRecord = LMEPG.Intent.createIntent('doctorRecordHome');
        objDoctorRecord.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objDoctorRecord, objCurrent);
    },


    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast('视频信息为空！');
            return;
        }

        var objHome = JumpPage.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('fromId', '2');
        objHome.setParam('focusIndex', videoInfo.focusIdx);


        // 进入播放器
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
        var objHome = JumpPage.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('fromId', '1');
        objHome.setParam('focusIndex', videoInfo.focusIdx);

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('userId', RenderParam.userId);
        objOrderHome.setParam('remark', remark);
        objOrderHome.setParam('isPlaying', 1);
        objOrderHome.setParam('singlePayItem', typeof (singlePayItem) !== 'undefined' ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objHome);
    },
    /**
     * 跳转 - 从挽留页返回到主页
     */
    jumpHomeByHold: function () {
        var objHome = LMEPG.Intent.createIntent('home');

        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', RenderParam.classifyId);
        objHome.setParam('fromId', '0');
        objHome.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        objHome.setParam('page', '0');

        LMEPG.Intent.jump(objHome);
    },

    /**
     * 跳转 - 挽留页
     */
    jumpHoldPage: function () {
        var objHome = JumpPage.getCurrentPage();

        var objHold = LMEPG.Intent.createIntent('hold');
        objHold.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objHold, objHome, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },
    /**
     * 疫情模块接口
     */
    jumpEpidemic: function () {
        var objHome = JumpPage.getCurrentPage();

        var objEpidemic = LMEPG.Intent.createIntent('report-index');
        objEpidemic.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objEpidemic, objHome);
    }
};


/**
 * 2号位置开始轮播
 * @type {{}}
 */
var Play = {
    currPollVideoId: 0,     //当前轮播id

    // 启动小窗播放
    startPollPlay: function () {
        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        LMEPG.mp.destroy();
        var videoUrl = Play.getCurrentPollVideoUrl(); //播放地址
        var position = RenderParam.playPosition;
        switch (RenderParam.carrierId) {
            case '000051':
                // 中国联通
                this.play000051(videoUrl, position);
                break;
            case '510094':
                // 四川广电
                this.play510094(videoUrl, position);
                break;
            case '630092':
                // 青海电信
                this.play630092(videoUrl, position);
                break;
            default:
                this.play630092(videoUrl, position);
                break;
        }
    },

    /** 处理首页轮播视频 */
    playHomePollVideo: function () {

        var data = Play.getCurrentPollVideoData();
        if (!LMEPG.Func.isObject(data)) {
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
            'durationTime': data.durationTime,
            'entryType': 1,
            'entryTypeName': '首页轮播视频',
            'unionCode': data.unionCode
        };

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            Page.jumpPlayVideo(videoInfo);
        } else {
            Page.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },

    /**
     * 得到当前轮播地址
     */
    getCurrentPollVideoUrl: function () {
        var pollVideoObj = Play.getCurrentPollVideoData();
        return LMEPG.Func.isObject(pollVideoObj) ? pollVideoObj.videoUrl : '';
    }
    ,

    /**
     * 得到当前轮播数据对象
     * @returns {*}
     */
    getCurrentPollVideoData: function () {
        if (LMEPG.Func.isObject(RenderParam.homePollVideoList) && LMEPG.Func.isArray(RenderParam.homePollVideoList.list)) {
            if (Play.currPollVideoId >= 0 && Play.currPollVideoId < RenderParam.homePollVideoList.list.length) {
                return RenderParam.homePollVideoList.list[Play.currPollVideoId];
            }
        }
        return null;
    },

    /**
     * 青海电信小窗播放
     */
    play630092: function (videoUrl, playPosition) {
        LMEPG.Log.info('play url is : ' + videoUrl);
        setTimeout(function () {
            var stbModel = LMEPG.STBUtil.getSTBModel();

            var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
            if (thirdPlayerUrl == '') {
                LMEPG.Log.info('thirdPlayerUrl is null ');
                return;
            }

            LMEPG.Log.info('thirdPlayerUrl is : ' + thirdPlayerUrl);
            thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
            var port_index = thirdPlayerUrl.indexOf(':');
            var path_index = thirdPlayerUrl.indexOf('/');
            var result = thirdPlayerUrl.substring(port_index, path_index);
            thirdPlayerUrl = thirdPlayerUrl.replace('+++', '://');
            var lmpf = '', index = -1;
            if (result == ':33200') {
                lmpf = 'huawei';
                index = thirdPlayerUrl.indexOf('/EPG/');
                thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/EPG/';
            } else {
                lmpf = 'zte';
                index = thirdPlayerUrl.lastIndexOf('/');
                thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/';
            }

            var info = LMEPG.mp.dispatcherUrl.getUrlWith630092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl, lmpf);
            var playUrl = thirdPlayerUrl + info;
            LMEPG.Log.info('thirdPlayerUrl playUrl : ' + playUrl);
            G('iframe_small_screen').setAttribute('src', playUrl);
            LMEPG.mp.initPlayerByBind();
        }, 500);
        G('default_link').focus(); // 防止焦点丢失
    },

    /**
     * 中国联通小窗播放
     */
    play000051: function (videoUrl, playPosition) {
        setTimeout(function () {
            if (RenderParam.stbModel == 'IP506H_54U3') { //内蒙联通海信盒子
                LMEPG.mp.initPlayerByBind();
            } else {
                LMEPG.mp.initPlayer();
            }
            var playVideoUrl = videoUrl;
            switch (RenderParam.carrierId) {
                case '000051'://中国联通
                    playVideoUrl = LMEPG.Func.http2rtsp(videoUrl);
                    break;
            }
            LMEPG.mp.playOfSmallscreen(playVideoUrl, playPosition[0], playPosition[1], playPosition[2], playPosition[3]);
        }, 500);
    },

    /**
     * 四川广电EPG小窗播放
     */
    play510094: function (videoId, playPosition) {
        if (LMEPG.Func.isEmpty(videoId)) return;
        if (typeof SCGDPlayer === 'object') {
            setTimeout(function () {
                SCGDPlayer.getMediaPlayUrl(videoId, function (playUrl) {
                    LMEPG.Log.info('[function.js][home/V7]--->getPlayUrl510094--->callback: [' + videoId + ']-->' + playUrl);
                    LMEPG.mp.setMediaDuration(data.duration);
                    LMEPG.mp.initPlayerByBind().playOfSmallscreen(playUrl, playPosition[0], playPosition[1], playPosition[2], playPosition[3]);
                }, function (errorMsg) {
                    LMEPG.Log.error('四川广电首页小窗播放失败：' + errorMsg);
                    LMEPG.UI.showToast('小窗播放失败！');
                });
            }, 500);
        } else {
            LMEPG.UI.showToast('小窗播放初始化错误！');
        }
    },

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
        } else if (keyCode == KEY_VOL_UP) {           // 音量+
            LMEPG.mp.upVolume();
        } else if (keyCode == KEY_VOL_DOWN) {         // 音量-
            LMEPG.mp.downVolume();
        }
    }
};