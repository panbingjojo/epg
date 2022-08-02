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
            case '440094':
                window.location.href = 'main://index.html';
                break;
            case '460092':
                if (RenderParam.fromLaunch == '1') {
                    Utility.setValueByName("exitIptvApp");
                } else {
                    LMEPG.Intent.back('IPTVPortal');
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
     * 跳转 - 查询及退订购
     */

    jumpReturnBook: function () {
        var objCurrent = Page.getCurrentPage();
        objCurrent.setParam('userId', RenderParam.userId);
        objCurrent.setParam('classifyId', Home.classifyId);
        // objCurrent.setParam("focusIndex", focusIndex);
        var objReturn = LMEPG.Intent.createIntent('orderProductList');
        LMEPG.Intent.jump(objReturn, objCurrent);
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
     * 跳转到39互联网医院
     */
    jump39Hospital: function () {
        var objCurrent = Page.getCurrentPage();

        var objHospitalList = LMEPG.Intent.createIntent('39hospital');
        LMEPG.Intent.jump(objHospitalList, objCurrent);
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
     * 疫情模块接口
     */
    jumpDoctorIndex: function () {
        var objHome = Page.getCurrentPage();

        var objEpidemic = LMEPG.Intent.createIntent('doctorList');
        LMEPG.Intent.jump(objEpidemic, objHome);
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
     * 跳转第三方网页
     * @param url 网页地址
     */
    jumpThirdPartyUrl: function (url) {
        window.location.href = url;
    },

    jumpFamilyHome:function(){
        var objHome = Page.getCurrentPage();
        var objHold = LMEPG.Intent.createIntent('familyEdit');

        LMEPG.Intent.jump(objHold, objHome);
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
                    'entryType': 1,
                    'entryTypeName': 'home',
                    'focusIdx': LMEPG.ButtonManager.getCurrentButton().id,
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
                Page.jumpThirdPartyUrl(data.source_id);
                break;
            case '10':
                Page.jump39Hospital();
                break;
            case '9':
                Page.jumpDoctorIndex();
                break;
            case '48':
                Page.jumpEpidemic();
                break;
            case '45':
                Page.jumpFamilyHome()
                break
        }
    },
};

/**
 * 处理首页轮播
 * @type {{}}
 */
var Play = {
    currPollVideoId: 0,     //当前轮播id

    // 启动小窗播放
    startPollPlay: function () {
        // 河南电信EPG ，不支持小窗口播放
        if (RenderParam.carrierId == '410092') {
            return;
        }

        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        LMEPG.mp.destroy();

        var videoUrl = Play.getCurrentPollVideoUrl(); //播放地址
        switch (RenderParam.carrierId) {
            case '320092':
                // 江苏电信
                this.play320092(videoUrl);
                break;
            case '450092':
                // 广西电信
                this.play450092(videoUrl);
                break;
            case '640092':
                // 宁夏电信
                this.play640092(videoUrl);
                break;
            case '630092':
                // 青海电信
                this.play630092(videoUrl);
                break;
            case '650092':
                this.play650092(videoUrl); //新疆电信
                break;
            case '000051':
                this.play000051(videoUrl);
                break;
            case '340092':
                this.play340092(videoUrl);
                break;
            case '420092':
                // 湖北电信
                this.play420092(videoUrl);
                break;
            case '350092':
                this.play350092(videoUrl);
                break;
            case '460092':
                this.play460092(videoUrl);
                break;
            case '440094':
                this.play440094(videoUrl);
                break;
            case '360092': // 江西电信EPG
                this.play360092(videoUrl);
                break;
            case '410092':
                // 河南电信EPG，不支持小窗口播放
                break;
            case '210092': // 辽宁电信EPG
                this.play210092();
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
            'entryTypeName': '首页轮播视频',
            'show_status': data.showStatus
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
            var stbModel = LMEPG.STBUtil.getSTBModel();
            var playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)]; //默认为高清正常播放位置

            // 判断第三方播放器地址
            if (RenderParam.thirdPlayerUrl == undefined || RenderParam.thirdPlayerUrl == '') {
                LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                return;
            }

            if (RenderParam.platformType == 'hd') {
                // 高清
                switch (stbModel) {
                    case 'RP0201':  //标清特殊型号判断
                        playPosition = [parseInt(183), parseInt(110), parseInt(261), parseInt(222)];
                        break;
                }
            } else {
                // 标清
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }
            var playParam = LMEPG.mp.dispatcherUrl.getUrlWith320092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl);
            var thirdPlayerFullUrl = RenderParam.thirdPlayerUrl + playParam;

            G('iframe_small_screen').setAttribute('src', thirdPlayerFullUrl); // 设置第三方播放器地址
            LMEPG.mp.initPlayerByBind();
        }, 500);
    },

    /**
     * 湖北电信小窗播放
     * @param videoUrl
     */
    play420092: function (videoUrl) {
        LMEPG.Log.info('play url is : ' + videoUrl);
        setTimeout(function () {
            var stbModel = LMEPG.STBUtil.getSTBModel();
            var playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)]; //默认为高清正常播放位置

            // 判断第三方播放器地址
            if (RenderParam.thirdPlayerUrl == undefined || RenderParam.thirdPlayerUrl == '') {
                LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                return;
            }

            if (RenderParam.platformType == 'hd') {
                switch (stbModel) {
                    case 'RP0201':  //高清特殊型号判断
                        playPosition = [parseInt(183), parseInt(110), parseInt(261), parseInt(222)];
                        break;
                }
            } else {
                // 标清平台
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }

            var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
            if (thirdPlayerUrl == '') {
                LMEPG.UI.showToast('domainUrl is empty!!!', 3);
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

            var info = LMEPG.mp.dispatcherUrl.getUrlWith420092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl, lmpf);
            var playUrl = thirdPlayerUrl + info;
            // var playUrl = "http://121.60.253.205:8080/iptvepg/function/MediaService/SmallScreen?Type=ad&ContentID=00000020010013647677&Left=358&Top=150&Width=550&Height=302&CycleFlag=0";
            LMEPG.Log.info('thirdPlayerUrl playUrl : ' + playUrl);
            G('iframe_small_screen').setAttribute('src', playUrl);
            LMEPG.mp.initPlayerByBind();
        }, 500);
        G('default_link').focus(); // 防止焦点丢失
    },

    /**
     * 江西电信小窗播放
     * @param videoUrl
     */
    play360092: function (videoUrl) {
        LMEPG.Log.info('play url is : ' + videoUrl);
        setTimeout(function () {
            var stbModel = LMEPG.STBUtil.getSTBModel();
            var playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)]; //默认为高清正常播放位置

            if (RenderParam.platformType == 'hd') {
                switch (stbModel) {
                    case 'RP0201':  //高清特殊型号判断
                        playPosition = [parseInt(183), parseInt(110), parseInt(261), parseInt(222)];
                        break;
                }
            } else {
                // 标清平台
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }

            // 判断第三方播放器地址
            if (RenderParam.thirdPlayerUrl == undefined || RenderParam.thirdPlayerUrl == '') {
                LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                return;
            }

            // videoUrl = "99100000012019031416475304411751";
            var info = LMEPG.mp.dispatcherUrl.getUrlWith360092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl, RenderParam.platformType);
            var playUrl = RenderParam.thirdPlayerUrl + info;
            // http://115.153.215.71:8282/EPG/jsp/8601_4Kdazhongban/en/HD_vasToMemInterface.jsp?vas_info=<vas_action>play_trailer</vas_action>
            // <mediacode>99100000012019031416475304411751</mediacode><mediatype>VOD</mediatype><left>358</left><top>150</top><width>550</width>
            // <height>302</height><size>hd</size>
            LMEPG.Log.info('thirdPlayerUrl playUrl : ' + playUrl);
            G('iframe_small_screen').setAttribute('src', playUrl);
            LMEPG.mp.initPlayerByBind();
        }, 500);
        G('default_link').focus(); // 防止焦点丢失
    },

    /**
     * 广西电信小窗播放
     * @param videoUrl
     */
    play450092: function (videoUrl) {
        setTimeout(function () {
            var stbModel = LMEPG.STBUtil.getSTBModel();
            var playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)]; //默认为高清正常播放位置

            // 判断第三方播放器地址
            if (RenderParam.thirdPlayerUrl == undefined || RenderParam.thirdPlayerUrl == '') {
                LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                return;
            }

            if (RenderParam.platformType == 'hd') {
                // 高清
                switch (stbModel) {
                    case 'RP0201':  //标清特殊型号判断
                        playPosition = [parseInt(183), parseInt(110), parseInt(261), parseInt(222)];
                        break;
                }
            } else {
                // 标清
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
                switch (stbModel) {
                    case 'EC2108v3B_pub':
                        playPosition = [parseInt(179), parseInt(122), parseInt(278), parseInt(155)];
                        break;
                    case 'ITV628HD':
                        playPosition = [parseInt(185), parseInt(123), parseInt(278), parseInt(157)];
                        break;
                }
            }
            // 广西电信按照江苏电信方式组装播放参数。
            var playParam = LMEPG.mp.dispatcherUrl.getUrlWith320092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl);
            var thirdPlayerFullUrl = RenderParam.thirdPlayerUrl + playParam;

            G('iframe_small_screen').setAttribute('src', thirdPlayerFullUrl); // 设置第三方播放器地址
            LMEPG.mp.initPlayerByBind();
        }, 500);
    },
    /**
     * 海南电信小窗播放
     * @param videoUrl
     */
    play460092: function (videoUrl) {
        setTimeout(function () {
            var stbModel = LMEPG.STBUtil.getSTBModel();
            var playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)]; //默认为高清正常播放位置

            // 判断第三方播放器地址
            // if (RenderParam.thirdPlayerUrl == undefined || RenderParam.thirdPlayerUrl == "") {
            //     LMEPG.UI.showToast("domainUrl is empty!!!", 3);
            //     return;
            // }

            if (RenderParam.platformType == 'hd') {
                // 高清
                switch (stbModel) {
                    case 'RP0201':  //标清特殊型号判断
                        playPosition = [parseInt(183), parseInt(110), parseInt(261), parseInt(222)];
                        break;
                }
            } else {
                // 标清
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
                switch (stbModel) {
                    case 'EC2108v3B_pub':
                        playPosition = [parseInt(179), parseInt(122), parseInt(278), parseInt(155)];
                        break;
                    case 'ITV628HD':
                        playPosition = [parseInt(185), parseInt(123), parseInt(278), parseInt(157)];
                        break;
                }
            }

            var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
            if (thirdPlayerUrl == '') {
                LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                return;
            }
            LMEPG.Log.info('thirdPlayerUrl is : ' + thirdPlayerUrl);
            thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
            var port_index = thirdPlayerUrl.indexOf(':');
            var path_index = thirdPlayerUrl.indexOf('/');
            var result = thirdPlayerUrl.substring(port_index, path_index);
            thirdPlayerUrl = thirdPlayerUrl.replace('+++', '://');
            var lmpf = "", index = 0;
            if (result == ':33200') {
                lmpf = 'huawei';
                index = thirdPlayerUrl.indexOf('/EPG/');
                thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/EPG/';
            } else {
                lmpf = 'zte';
                index = thirdPlayerUrl.lastIndexOf('/');
                thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/';
            }

            var info = LMEPG.mp.dispatcherUrl.getUrlWith420092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl, lmpf);
            var thirdPlayerFullUrl = thirdPlayerUrl + info;
            LMEPG.Log.info('thirdPlayerFullUrl : ' + thirdPlayerFullUrl);

            G('iframe_small_screen').setAttribute('src', thirdPlayerFullUrl); // 设置第三方播放器地址
            LMEPG.mp.initPlayerByBind();
            setTimeout(function () {
                var stbType1 = LMEPG.STBUtil.getSTBModel();
                if (stbType1.toUpperCase().indexOf('HG600') >= 0) {
                    LMEPG.mp.setCurrentVolume(LMEPG.mp.getCurrentVolume() + 5);
                }
            }, 1000);
        }, 500);
    },
    /**
     * 宁夏电信小窗播放
     */
    play640092: function (videoUrl) {
        setTimeout(function () {
            var stbModel = LMEPG.STBUtil.getSTBModel();
            var playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)]; //默认为高清正常播放位置

            // 判断第三方播放器地址
            if (RenderParam.thirdPlayerUrl == undefined || RenderParam.thirdPlayerUrl == '') {
                LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                return;
            }

            if (platformType == 'hd') {
                switch (stbModel) {
                    case 'RP0201':  //高清特殊型号判断
                        playPosition = [parseInt(183), parseInt(110), parseInt(261), parseInt(222)];
                        break;
                }
            } else {
                // 标清平台
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }
            var info = LMEPG.mp.dispatcherUrl.getUrlWith640092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl);

            var playUrl = RenderParam.thirdPlayerUrl + info;
            G('iframe_small_screen').setAttribute('src', playUrl);
            LMEPG.mp.initPlayerByBind();
        }, 500);
        G('default_link').focus(); // 防止焦点丢失
    },

    /**
     * 青海电信小窗播放
     */
    play630092: function (videoUrl) {
        setTimeout(function () {
            var stbModel = LMEPG.STBUtil.getSTBModel();
            var playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)]; //默认为高清正常播放位置

            // 判断第三方播放器地址
            if (RenderParam.thirdPlayerUrl == undefined || RenderParam.thirdPlayerUrl == '') {
                LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                return;
            }

            if (RenderParam.platformType == 'hd') {
                switch (stbModel) {
                    case 'RP0201':  //高清特殊型号判断
                        playPosition = [parseInt(183), parseInt(110), parseInt(261), parseInt(222)];
                        break;
                }
            } else {
                // 标清平台
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }

            var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
            thirdPlayerUrl = thirdPlayerUrl.split('/EPG')[0];

            var info = LMEPG.mp.dispatcherUrl.getUrlWith630092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl);

            var playUrl = thirdPlayerUrl + info;
            G('iframe_small_screen').setAttribute('src', playUrl);
            LMEPG.mp.initPlayerByBind();
        }, 500);
        G('default_link').focus(); // 防止焦点丢失
    },

    /**
     * 新疆电信小窗播放
     */
    play650092: function (videoUrl) {
        setTimeout(function () {
            var stbModel = LMEPG.STBUtil.getSTBModel();
            var playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)]; //默认为高清正常播放位置

            if (RenderParam.platformType == 'hd') {
                switch (stbModel) {
                    case 'RP0201':  //高清特殊型号判断
                        playPosition = [parseInt(183), parseInt(110), parseInt(261), parseInt(222)];
                        break;
                }
            } else {
                // 标清平台
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }

            var stbDomainUrl = LMEPG.STBUtil.getEPGDomain();
            var prefixObj = LMEPG.mp.dispatcherUrl.getUrlWith650092PrefixObj(stbDomainUrl);
            var thirdPlayerUrl = prefixObj.url;

            var info = LMEPG.mp.dispatcherUrl.getUrlWith650092Suffix(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl, prefixObj.isHW);
            var playUrl = thirdPlayerUrl + info;
            G('iframe_small_screen').setAttribute('src', playUrl);
            LMEPG.mp.initPlayerByBind();
        }, 500);
        G('default_link').focus(); // 防止焦点丢失
    },


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
                playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)];
            } else {
                switch (RenderParam.stbModel) {
                    case 'MP606H': //海信高请盒子会放大小窗
                        playPosition = [parseInt(180), parseInt(123), parseInt(271), parseInt(155)];
                        break;
                    default:
                        playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
                        break;
                }
            }
            // 开始小窗播放
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
                        playPosition = [parseInt(373), parseInt(152), parseInt(535), parseInt(302)];
                        break;
                    default:
                        playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)];
                        break;
                }
            } else {
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }
            LMEPG.mp.playOfSmallscreen(videoUrl, playPosition[0], playPosition[1], playPosition[2], playPosition[3]); //小窗播放
        }, 500);
    },

    /**
     * 广东广电小窗播放
     * @param videoUrl
     */
    play440094: function (videoUrl) {
        Play.getPlayUrl440094(videoUrl);
    },
    /**
     * 福建电信小窗播放
     * @param videoUrl
     */
    play350092: function (videoUrl) {
        setTimeout(function () {
            var stbModel = LMEPG.STBUtil.getSTBModel();
            var playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)]; //默认为高清正常播放位置

            // 判断第三方播放器地址
            if (RenderParam.thirdPlayerUrl == undefined || RenderParam.thirdPlayerUrl == '') {
                LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                return;
            }

            if (RenderParam.platformType == 'hd') {
                // 高清
                switch (stbModel) {
                    case 'RP0201':  //标清特殊型号判断
                        playPosition = [parseInt(183), parseInt(110), parseInt(261), parseInt(222)];
                        break;
                }
            } else {
                // 标清
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }
            var playParam = LMEPG.mp.dispatcherUrl.getUrlWith350092(playPosition[0], playPosition[1], playPosition[2], playPosition[3], videoUrl);
            var thirdPlayerFullUrl = RenderParam.thirdPlayerUrl + playParam;

            G('iframe_small_screen').setAttribute('src', thirdPlayerFullUrl); // 设置第三方播放器地址
            LMEPG.mp.initPlayerByBind();
        }, 500);
    },

    /**
     * 辽宁电信小窗播放
     * @param videoUrl
     */
    play210092: function () {
        setTimeout(function () {
            // 目前播放地址写死，全省共有14个地市，华为和中兴各有7个地市
            var playVideoUrl;
            var paramJson = JSON.stringify({
                type: 13,
                data: {},
                spid: RenderParam.spid
            });
            LMEPG.Log.info('辽宁电信获取用户所属平台 jsObj 调用参数: ' + paramJson);
            console.log('辽宁电信获取用户所属平台 jsObj 调用参数: ' + paramJson);
            if (typeof (jsObj) === 'undefined') {
                LMEPG.Log.info('辽宁电信 jsObj 不存在');
                console.log('辽宁电信 jsObj 不存在');
                return;
            }
            var platform = jsObj.eventFromJS(paramJson);
            LMEPG.Log.info('辽宁电信获取用户所属平台: ' + platform);
            console.log('辽宁电信获取用户所属平台: ' + platform);
            if (platform == 'ZX') {
                playVideoUrl = 'http://10.255.129.26:6060/ZTEEPG42/2/MOV190725120531076cx000?virtualDomain=ZTE_CMS.vod_hls.zte.com';
            } else if (platform == 'HW') {
                playVideoUrl = 'http://10.255.128.136:80/testag/vod/PRO190725120531076cx000/MOV190725120531076cx000?fmt=ts2hls';
            }
            //================================================================

            LMEPG.mp.initPlayer();
            var playPosition = [parseInt(358), parseInt(150), parseInt(550), parseInt(302)];
            if (RenderParam.platformType == 'sd') {
                playPosition = [parseInt(175), parseInt(115), parseInt(282), parseInt(160)];
            }
            // 开始小窗播放
            LMEPG.mp.playOfSmallscreen(playVideoUrl, playPosition[0], playPosition[1], playPosition[2], playPosition[3]);
        }, 500);
    },

    /**
     * 默认小窗播放
     * @param videoUrl
     */
    defaultPlay: function (videoUrl) {
        setTimeout(function () {
            var isHD = RenderParam.platformType === "hd";
            var location = isHD ? [358, 150, 550, 302] : [175, 115, 282, 160]; // left,top,width,height
            LMEPG.mp.initPlayer(); // 初始化
            LMEPG.mp.playOfSmallscreen(videoUrl, location[0], location[1], location[2], location[3]); //小窗播放
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
        } else if (keyCode == KEY_VOL_UP) {           // 音量+
            LMEPG.mp.upVolume();
        } else if (keyCode == KEY_VOL_DOWN) {         // 音量-
            LMEPG.mp.downVolume();
        }
    },

    /**
     * 广东广电获取播放串
     */
    getPlayUrl440094: function (videoId) {
        var titleAssetId = videoId;
        var callback = function (isSuccess, data) {
            if (isSuccess) {
                var isHD = RenderParam.platformType === "hd";
                var location = isHD ? [358, 150, 550, 302] : [175, 115, 282, 160];
                LMEPG.mp.initPlayer().playOfSmallscreen(data, location[0], location[1], location[2], location[3]); //初始化并播放
                Play.getVideoInfo440094(titleAssetId); //获取视频信息
            } else {
                LMEPG.UI.showToast(data, 5);
            }
        };
        window.UtilsWithGDGD.getPlayUrl(titleAssetId, callback);
    },

    /**
     * 广东广电获取视频信息
     */
    getVideoInfo440094: function (titleAssetId) {
        var callback = function (isSuccess, data) {
            if (isSuccess) {
                // LMEPG.mp.setMediaDuration(data.progTimeLength);//保存视频总时长
                LMEPG.mp.play(); //启动播放
            } else {
                LMEPG.UI.showToast(data, 5);
                LMEPG.mp.destroy();
            }
        };
        window.UtilsWithGDGD.getVideoInfo(titleAssetId, callback);
    }
};

var Home = {
    currNavId: RenderParam.classifyId,           // 当前导航栏下标
    classifyId: RenderParam.classifyId,          // 当前分类ID
    entryDuration: 0,       // 进入页面时长,进入页面后进行定时器刷新
    Banner: {
        MAX_TIMER_DURATION: 3000,       // 定时器时间间隔
        bannerIndex: 0,                 // 第一推荐位banner下标
        bannerIndex5: 0,                // 第五推荐位banner下标
        item: [],                       // banner项
        item5: [],                      // banner项
        timer: null,
        // 初始化banner
        initBanner: function (rawData, position) {
            if (rawData == null || rawData.length <= 0)
                return;
            for (var i = 0; i < rawData.length; i++) { // 暂时最多显示三项
                if (position == 1) {
                    Home.Banner.item[i] = {};
                    Home.Banner.item[i].backgroundImage = rawData[i].img_url;      // 背景图片
                    Home.Banner.item[i].entryType = rawData[i].entry_type;         // 类型
                    Home.Banner.item[i].rawData = rawData[i];
                } else if (position == 5) {
                    Home.Banner.item5[i] = {};
                    Home.Banner.item5[i].backgroundImage = rawData[i].img_url;      // 背景图片
                    Home.Banner.item5[i].entryType = rawData[i].entry_type;         // 类型
                    Home.Banner.item5[i].rawData = rawData[i];
                }
            }
            this.startTimer(position);  //启动banner定时器。
        },
        // 启动定时器
        startTimer: function (position) {
            if (position == 1) {
                G('recommend_1').src = RenderParam.fsUrl + Home.Banner.item[0].backgroundImage;
                this.timer = setInterval(Home.Banner.triggerTimer(1), this.MAX_TIMER_DURATION);
            } else if (position == 5) {
                G('recommend_5').src = RenderParam.fsUrl + Home.Banner.item5[0].backgroundImage;
                this.timer5 = setInterval(Home.Banner.triggerTimer(5), this.MAX_TIMER_DURATION);
            }
        },
        //定时器触发
        triggerTimer: function (position) {
            try{
                return function () {
                    if (position == 1) {
                        Home.Banner.bannerIndex = Home.Banner.bannerIndex < Home.Banner.item.length - 1 ? Home.Banner.bannerIndex + 1 : 0;
                        G('recommend_1').src = RenderParam.fsUrl + Home.Banner.item[Home.Banner.bannerIndex].backgroundImage;
                    } else if (position == 5) {
                        Home.Banner.bannerIndex5 = Home.Banner.bannerIndex5 < Home.Banner.item5.length - 1 ? Home.Banner.bannerIndex5 + 1 : 0;
                        G('recommend_5').src = RenderParam.fsUrl + Home.Banner.item5[Home.Banner.bannerIndex5].backgroundImage;
                    }
                }
            }catch (e){}
        },

        // 关闭定时器
        closeTimer: function () {
            clearInterval(this.timer);
            clearInterval(this.timer5);
        },

        /**
         * 当Banner被点击
         */
        onBannerClick: function (btn, position) {
            if (position == 1) {
                var configInfo = Home.Banner.transModuleData(Home.Banner.item[Home.Banner.bannerIndex]);
            } else if (position == 5) {
                var configInfo = Home.Banner.transModuleData(Home.Banner.item5[Home.Banner.bannerIndex5]);
            }
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
        }

    }
    ,

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
        if (dir == 'up' || dir == 'down') {
            //LMEPG.ButtonManager.setSelected(current.id, true);
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
                case 'un_subscribe_btn':
                    LMEPG.ButtonManager.requestFocus('nav_' + Home.currNavId);
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
            case 'un_subscribe_btn':
                // 退订
                Page.jumpReturnBook();
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
                LMEPG.CssManager.removeClass(G('recommend_vip_' + btn.cIdx), 'vip_img_' + btn.cIdx);
                LMEPG.CssManager.addClass(G('recommend_vip_' + btn.cIdx), 'vip_img_' + btn.cIdx + '_out');
            }
        } else {
            if (RenderParam.platformType == 'hd') {
                // 高清缩小处理，标清不缩小
                LMEPG.CssManager.removeClass(G('recommend_' + btn.cIdx), 'recommend_zoom_out');
                LMEPG.CssManager.addClass(G('recommend_' + btn.cIdx), 'recommend_zoom_in');
                LMEPG.CssManager.removeClass(G('recommend_vip_' + btn.cIdx), 'vip_img_' + btn.cIdx + '_out');
                LMEPG.CssManager.addClass(G('recommend_vip_' + btn.cIdx), 'vip_img_' + btn.cIdx);
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
                    case 'recommend_border_5':
                        LMEPG.ButtonManager.requestFocus('nav_' + Home.currNavId);
                        return false;
                }
                break;
            case 'left':
                switch (current.id) {
                    case 'recommend_border_1':
                        Page.jumpHomeTab('homeTab4', 'recommend_border_3');
                        return false;
                }
                break;
            case 'right':
                switch (current.id) {
                    case 'recommend_border_5':
                    case 'recommend_border_6':
                        Page.jumpHomeTab('homeTab1', 'recommend_border_1');
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
        if (btn.id == 'recommend_border_1') {
            // 调用banner被点击
            return Home.Banner.onBannerClick(btn, 1);
        } else if (btn.id == 'recommend_border_5') {
            // 调用banner被点击
            return Home.Banner.onBannerClick(btn, 5);
        }
        var postion = btn.cPosition;   // 得到位置类型数据
        var data = Home.getRecommendDataByPosition(postion);
        if (data == null) {
            // 没有相关的推荐位数据
            if (btn.id == 'recommend_border_2') {
                // 辽宁电信小窗不允许点击
                if (RenderParam.carrierId == '210092')
                    return;

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
     * 初始化导航栏
     */
    initNav: function () {
        buttons.push({
            id: 'nav_0',
            name: '首页推荐',
            type: 'img',
            nextFocusLeft: 'nav_4',
            nextFocusRight: 'nav_1',
            nextFocusUp: 'search',
            nextFocusDown: 'recommend_border_1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_out,
            groupId: 'nav',
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
            nextFocusUp: 'search',
            nextFocusDown: 'recommend_border_1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_out,
            groupId: 'nav',
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
            nextFocusUp: 'search',
            nextFocusDown: 'recommend_border_1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_out,
            groupId: 'nav',
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
            nextFocusUp: 'search',
            nextFocusDown: 'recommend_border_1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_out,
            groupId: 'nav',
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
            nextFocusRight: 'nav_0',
            nextFocusUp: 'search',
            nextFocusDown: 'recommend_border_1',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).focus_out,
            groupId: 'nav',
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
        buttons.push({
            id: 'un_subscribe_btn',
            name: '',
            type: 'img',
            nextFocusLeft: 'collect',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_unsubscribe.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/f_unsubscribe.png',
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
                nextFocusRight: 'un_subscribe_btn',
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
            nextFocusLeft: 'menu_border_0',
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
            cPosition: '11'   //数据对应位置，用来查找对应数据
        });
        buttons.push({
            id: 'recommend_border_2',
            name: '推荐位2',
            type: 'img',
            nextFocusLeft: 'recommend_border_1',
            nextFocusRight: 'recommend_border_5',
            nextFocusUp: '',
            nextFocusDown: 'recommend_border_3',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_2.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 2,
            cPosition: '12'        //数据对应位置，用来查找对应数据
        });
        buttons.push({
            id: 'recommend_border_3',
            name: '推荐位4',
            type: 'img',
            nextFocusLeft: 'recommend_border_1',
            nextFocusRight: 'recommend_border_4',
            nextFocusUp: 'recommend_border_2',
            nextFocusDown: 'back_btn',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_3.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 3,
            cPosition: '13'
        });
        buttons.push({
            id: 'recommend_border_4',
            name: '推荐位3',
            type: 'img',
            nextFocusLeft: 'recommend_border_3',
            nextFocusRight: 'recommend_border_6',
            nextFocusUp: 'recommend_border_2',
            nextFocusDown: 'back_btn',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_4.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 4,
            cPosition: '14'
        });
        buttons.push({
            id: 'recommend_border_5',
            name: '推荐位5',
            type: 'img',
            nextFocusLeft: 'recommend_border_2',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommend_border_6',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_5.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 5,
            cPosition: '15'
        });
        buttons.push({
            id: 'recommend_border_6',
            name: '推荐位6',
            type: 'img',
            nextFocusLeft: 'recommend_border_4',
            nextFocusRight: '',
            nextFocusUp: 'recommend_border_5',
            nextFocusDown: 'back_btn',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V1/bg_home_recommend_border_' + RenderParam.classifyId + '_6.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 6,
            cPosition: '16'
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
        // 获取位置5 banner数据
        for (var i = 0; i < RenderParam.entryList.length; i++) {
            var data = RenderParam.entryList[i];
            if (data.position == '15') {
                RenderParam.initPosition5List = data.item_data;
                break;
            }
        }

        // 遍历推荐列表
        for (var i = 0; i < RenderParam.recommendDataList.length; i++) {
            var data = RenderParam.recommendDataList[i];

            switch (data.position) {
                case '11':
                    /*G('recommend_1').src = RenderParam.fsUrl + data.image_url;*/
                    // 修改为banner
                    Home.Banner.initBanner(RenderParam.initPositionList, 1);
                    break;
                case '12':
                    if (RenderParam.positionTwoConfig == '1') {
                        G('recommend_2').src = RenderParam.fsUrl + data.image_url;
                        G('recommend_border_2').className = 'recommend_border_2_1';
                    }
                    break;
                case '13':
                    // 第三个位置
                    G('recommend_3').src = RenderParam.fsUrl + data.image_url;
                    break;
                case '14': // 第四个位置
                    G('recommend_4').src = RenderParam.fsUrl + data.image_url;
                    break;

                case '15': // 第五个位置
                    /*G('recommend_5').src = RenderParam.fsUrl + data.image_url;*/
                    // 修改为banner
                    Home.Banner.initBanner(RenderParam.initPosition5List, 5);
                    break;

                case '16': // 第六个位置
                    G('recommend_6').src = RenderParam.fsUrl + data.image_url;
                    break;
            }
        }
    },

    renderVipCornerMarker: function () {
        var isShow = false;
        for (var i = 0; i < RenderParam.entryList.length; i++) {
            var positionData = RenderParam.entryList[i];
            if(positionData.item_data[0]['inner_parameters'] != ""){
                var imgPag = JSON.parse(positionData.item_data[0]['inner_parameters']).cornermark.img_url;
                if(imgPag == ""){
                    isShow = false;
                }else {
                    isShow = true;
                }
            }else {
                isShow = false;
            }

            var recommendIndex = positionData.position.slice(1,positionData.position.length);
            if(positionData.position.slice(0,1) == '1') {
                if (isShow) {
                    G('recommend_vip_' + recommendIndex).src = RenderParam.fsUrl + imgPag;
                    S('recommend_vip_' + recommendIndex);
                } else {
                    H('recommend_vip_' + recommendIndex);
                }
            }
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
                break;
            case KEY_4:
                var keys = LMEPG.KeyEventManager.getKeyCodes();
                if (keys.length >= 4) {
                    if (keys[keys.length - 1] == KEY_4
                        && keys[keys.length - 2] == KEY_8
                        && keys[keys.length - 3] == KEY_9
                        && keys[keys.length - 4] == KEY_3) {
                        // 显示vip
                        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
                            LMEPG.UI.showToast('是vip', 3);
                        } else {
                            LMEPG.UI.showToast('不是vip', 3);
                        }
                    }
                }
                break;
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
        G('default_link').focus();  // 防止页面丢失焦点

        Home.renderThemeUI();       // 刷新主页背景
        Home.initNav();             // 初始化导航栏
        Home.initTopMenu();         // 顶部菜单
        Home.initRecommend();       // 初始化推荐位
        Home.initNavBottom();       // 初始化底部导航栏按钮
        Home.initMarquee();         // 初始化滚动字幕

        Home.renderThemeUI();       // 渲染背景
        Home.renderRecommend();     // 渲染推荐位
        //渲染VIP角标
        for(var i=1; i < 8 ;i++)
            H('recommend_vip_' + i);
        if(RenderParam.carrierId == '460092' && RenderParam.isVip != 1){
            Home.renderVipCornerMarker(); //渲染VIP角标
        }

        var defaultFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? 'recommend_border_1' : RenderParam.focusIndex;
        LMEPG.ButtonManager.init(defaultFocusId, buttons, '', true);
        LMEPG.ButtonManager.setSelected('nav_' + Home.classifyId, true);   // 设置导航栏菜单的选中项

        //启动字幕滚动
        //LMEPG.UI.Marquee.start("scroll_message", 7, 2, 50, "left", "scroll_message");

        Home.startTimer(); // 启动定时器

        // 开始轮播
        if (RenderParam.positionTwoConfig != '1') {
            //2号位置没有被使用才播放视频
            Play.startPollPlay();
        }
    }
};

// 定义全局按钮
var buttons = [];

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        EVENT_MEDIA_END: Play.onPlayEvent,
        EVENT_MEDIA_ERROR: Play.onPlayEvent,
        KEY_VOL_UP: Play.onPlayEvent,
        KEY_VOL_DOWN: Play.onPlayEvent,
        KEY_3: Home.onKeyDown,
        KEY_4: Home.onKeyDown
    }
);

function onBack() {
    switch (RenderParam.carrierId) {
        case '440094':
        case '450092':
        case '520094':
            LMEPG.mp.destroy();
            Page.exitAppHome();
            return;
        case '000051':
        case '320092':
        case '640092':
        case '650092':
        case '210092':
            Page.jumpHoldPage();
            break;
        default:
            Page.jumpHoldPage();
            break;
    }
}

window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};
