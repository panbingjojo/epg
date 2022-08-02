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
            default:
                LMEPG.Intent.back('IPTVPortal');
                break;
        }
    },

    /**
     * 跳转 -- 大专家界面
     */
    jumpExpertHome: function () {
        var objHome = JumpPage.getCurrentPage();
        var objExpertHome = null;
        if (RenderParam.carrierId === '370002') {
            objExpertHome = LMEPG.Intent.createIntent("expertIndex");
        } else {
            objExpertHome = LMEPG.Intent.createIntent("expertHome");
        }
        LMEPG.Intent.jump(objExpertHome, objHome);
    },

    /**
     * 跳转到home页面
     */
    jumpFamilyHome: function () {
        var objCurrent = JumpPage.getCurrentPage();
        var objDst = null;
        if(RenderParam.carrierId === '370002') { // 山东电信apk
            objDst = LMEPG.Intent.createIntent("familyEdit");
        } else {
            objDst = LMEPG.Intent.createIntent("familyHome");
        }

        LMEPG.Intent.jump(objDst, objCurrent);
    },

    /**
     * 山东电信 跳转中老年健康,宝贝天地
     * @param type 具体跳转的视频类型
     */
    jumpPacketChannel: function (type) {
        var objHome = JumpPage.getCurrentPage();

        var objDst = LMEPG.Intent.createIntent('channel');
        objDst.setParam('userId', RenderParam.userId);
        objDst.setParam('modeType', type === '56' ? '18' : '17');     //56:中老年健康、57:宝贝天地
        objDst.setParam('modeTitle', type === '56' ? '中老年健康' : '宝贝天地');
        objDst.setParam('inner', 1);
        LMEPG.Intent.jump(objDst, objHome);
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
        if (RenderParam.carrierId !== '370002') {
            objHome.setParam('classifyId', 1);
        }
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
     * 跳转订购页面
     */
    jumpOrderHome: function(){

        if(RenderParam.isVip === 1 || RenderParam.isVip === '1') { // 检测当前已经是会员，弹框提示
            LMEPG.UI.commonDialog.show("您已订购VIP，请勿重复订购！", ["确定"], function (index) {});
            return;
        }

        // 当前页
        var objHome = JumpPage.getCurrentPage();
        objHome.setParam('fromId', '1');
        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('isPlaying', 0);
        objOrderHome.setParam('singlePayItem',  1);

        LMEPG.Intent.jump(objOrderHome, objHome);
    },

    /**
     * 健康检测页
     */
    jumpHealthTest:function(){
        // 当前页
        var objHome = JumpPage.getCurrentPage();
        objHome.setParam('fromId', '1');

        // 健康检测页
        var objHealthTest = LMEPG.Intent.createIntent('testIndex');

        LMEPG.Intent.jump(objHealthTest, objHome);
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
     * 跳转视频问诊/电话问诊
     */
    jumpInquiry: function () {
        // 支持视频问诊，直接进入
        var objCurrent = JumpPage.getCurrentPage();

        var objDoctorP2P = null;
        if(RenderParam.carrierId === '370002') {
            objDoctorP2P = LMEPG.Intent.createIntent('doctorIndex');
        }else {
            objDoctorP2P = LMEPG.Intent.createIntent('doctorList');
        }

        objDoctorP2P.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objDoctorP2P, objCurrent);
    },

    /**
     * 跳转问诊记录
     */
    jumpInquiryRecord: function () {
        var objCurrent = JumpPage.getCurrentPage();

        objDoctorRecord = LMEPG.Intent.createIntent('doctorRecordHome');
        objDoctorRecord.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objDoctorRecord, objCurrent);
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
        switch (RenderParam.carrierId) {
            case '630092':
                // 青海电信
                this.play630092(videoUrl, RenderParam.playPosition);
                break;
            case '640092':
                this.play640092(videoUrl, RenderParam.playPosition);
                break;
            default:
                this.play630092(videoUrl, RenderParam.playPosition);
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

        if (Page.isAllowPlay(videoInfo)) {
            Page.jumpPlayVideo(videoInfo);
        } else {
            Page.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },

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
            var lmpf;
            if (result == ':33200') {
                lmpf = 'huawei';
                var index = thirdPlayerUrl.indexOf('/EPG/');
                thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/EPG/';
            } else {
                lmpf = 'zte';
                var index = thirdPlayerUrl.lastIndexOf('/');
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
     * 宁夏电信小窗播放
     */
    play640092: function (videoUrl, playPosition) {
        LMEPG.Log.info('play url is : ' + videoUrl);
        setTimeout(function () {
            var stbDomainUrl = LMEPG.STBUtil.getEPGDomain();
            if (stbDomainUrl == '' || stbDomainUrl == null) {
                return;
            }
            var prefixObj = LMEPG.mp.dispatcherUrl.getUrlWith650092PrefixObj(stbDomainUrl);
            var thirdPlayerUrl = prefixObj.url;
            var info = LMEPG.mp.dispatcherUrl.getUrlWith650092Suffix(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl, prefixObj.isHW);
            var factUrl = thirdPlayerUrl + info;
            LMEPG.Log.info('thirdPlayerUrl playUrl : ' + factUrl);
            G('iframe_small_screen').setAttribute('src', factUrl);
            LMEPG.mp.initPlayerByBind();
        }, 100);
        G('default_link').focus(); // 防止焦点丢失
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