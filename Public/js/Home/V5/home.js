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
        var objCurrent = LMEPG.Intent.createIntent('home');
        objCurrent.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
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
        objCurrent.setParam('page', '0');

        var objSearch = LMEPG.Intent.createIntent('search');
        objSearch.setParam('userId', RenderParam.userId);
        objSearch.setParam('position', 'home');


        LMEPG.Intent.jump(objSearch, objCurrent);
    },
    /**
     * 跳转 - 帮助页
     * */
    jumpHelpPage: function () {
        Show('help_img');
        LMEPG.BM.requestFocus('help_img');
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

/**
 * 处理首页轮播
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
            case '320092':
                // 江苏电信
                this.play320092(videoUrl);
                break;
            case 'play450092':
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
            case '000051':
                this.play000051(videoUrl);
                break;
            case '340092':
                this.play340092(videoUrl);
                break;
            default:
                this.defaultPlay();
                break;
        }
    }
    ,

    /**
     * 校验视频是否允许播放
     * @param videoInfo
     */
    isAllowPlay: function (videoInfo) {
        if (RenderParam.isVip == 1) {
            // vip用户可以观看
            return true;
        }

        if (videoInfo.userType == 0) {
            // 视频允许免费用户观看
            return true;
        }

        if (parseInt(videoInfo.freeSeconds) > 0) {
            // 视频有免费观看时长
            return true;
        }

        return false;
    }
    ,

    /** 处理首页轮播视频 */
    playHomePollVideo: function () {

        var data = Play.getCurrentPollVideoData();
        if (data == null) {
            return;
        }

        // 创建视频信息
        var videoInfo = {
            'sourceId': data.source_id,
            'videoUrl': data.videoUrl,
            'title': data.title,
            'type': data.model_type,
            'userType': data.user_type,
            'freeSeconds': data.freeSeconds,
            'unionCode': data.unionCode,
            'entryType': 1,
            'entryTypeName': '首页轮播视频'
        };

        if (Play.isAllowPlay(videoInfo)) {
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
    currNavId: RenderParam.classifyId - 1,           // 当前导航栏下标
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
    renderThemeUI: function (carrierId) {
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
            //LMEPG.BM.setSelected(current.id, true);
        }
    },

    onNavClick: function (btn) {
        Home.currNavId = btn.cNavId;
        var c_id = G(btn.id).getAttribute('classifyId');
        Page.jumpHomeTab('tabMore', c_id, '');
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
                    LMEPG.BM.requestFocus('nav_' + Home.currNavId);
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
            case 'help':
                Page.jumpHelpPage();
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
    },

    /**
     * 推荐位移动
     * @param dir
     * @param current
     */
    onRecommendBeforeMoveChange: function (dir, current) {

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
            if (btn.id == 'recommend_border_2') {
                //推荐位2 如果没有配置数据，是轮播视频，点击放大播放
                Play.playHomePollVideo();
            }
            return;
        }
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
                    'focusIdx': btn.id,
                    'unionCode': data.union_code
                };

                if (Play.isAllowPlay(videoInfo)) {
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
            case '23':
                //预约挂号首页
                Page.jumpCollectPage();
                break;
            case '22':
                // 具体地址跳转
                LMEPG.UI.showToast('具体地址跳转');
                break;
        }
    },
    /**
     * 推荐位视频栏目被点击
     * @param btn
     */
    onRecommendClickA: function (btn) {
        var postion = btn.cIdx;   // 得到位置类型数据
        var model_type = G('recommend_' + postion).getAttribute('model_type');
        if (model_type != null) {
            // 没有相关的推荐位数据
            Page.jumpHomeTab('tabMore', 1, model_type);
        }

    },
    onHelpClick: function (btn) {
        Hide('help_img');
        LMEPG.BM.requestFocus('help');
    },
    /**
     * 初始化导航栏
     */
    initNav: function () {
        buttons.push({
            id: 'nav_0',
            name: '首页推荐',
            type: 'img',
            nextFocusLeft: 'nav_6',
            nextFocusRight: 'nav_1',
            nextFocusUp: 'search',
            nextFocusDown: 'recommend_border_A0',
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
            nextFocusDown: 'recommend_border_A0',
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
            nextFocusDown: 'recommend_border_A0',
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
            nextFocusDown: 'recommend_border_A0',
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
            nextFocusRight: 'nav_5',
            nextFocusUp: 'search',
            nextFocusDown: 'recommend_border_A0',
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
        buttons.push({
            id: 'nav_5',
            name: '首页推荐',
            type: 'img',
            nextFocusLeft: 'nav_4',
            nextFocusRight: 'nav_6',
            nextFocusUp: 'search',
            nextFocusDown: 'recommend_border_A0',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[5].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[5].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[5].img_url).focus_out,
            groupId: 'nav',
            click: Home.onNavClick,
            focusChange: Home.onNavFocus,
            beforeMoveChange: Home.onNavBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cNavId: 4
        });
        buttons.push({
            id: 'nav_6',
            name: '首页推荐',
            type: 'img',
            nextFocusLeft: 'nav_5',
            nextFocusRight: 'nav_0',
            nextFocusUp: 'search',
            nextFocusDown: 'recommend_border_A0',
            backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[6].img_url).normal,
            focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[6].img_url).focus_in,
            selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[6].img_url).focus_out,
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
        // 贵州广电不需要收藏
        if (RenderParam.carrierId != '520092') {
            buttons.push({
                id: 'search',
                name: '',
                type: 'img',
                nextFocusLeft: 'vip_btn',
                nextFocusRight: 'help',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_search.png',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/f_search.png',
                click: Home.onMenuClick,
                focusChange: Home.onMenuFocus,
                beforeMoveChange: Home.onMenuBeforMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIdx: 0
            });
            buttons.push({
                id: 'help',
                name: '帮助',
                type: 'img',
                nextFocusLeft: 'search',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'nav_0',
                backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_help.png',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/f_help.png',
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
                backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_vip_btn.png',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/f_vip_btn.png',
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
            nextFocusLeft: 'recommend_border_A0',
            nextFocusRight: 'recommend_border_2',
            nextFocusUp: 'nav_0',
            nextFocusDown: 'recommend_border_3',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_1.png',
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
            nextFocusUp: 'nav_0',
            nextFocusDown: 'recommend_border_6',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_2.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 2,
            cPosition: '12'        //数据对应位置，用来查找对应数据
        });
        buttons.push({
            id: 'recommend_border_3',
            name: '推荐位3',
            type: 'img',
            nextFocusLeft: 'recommend_border_A2',
            nextFocusRight: 'recommend_border_4',
            nextFocusUp: 'recommend_border_1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_2.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 3,
            cPosition: '13'
        });
        buttons.push({
            id: 'recommend_border_4',
            name: '推荐位4',
            type: 'img',
            nextFocusLeft: 'recommend_border_3',
            nextFocusRight: 'recommend_border_6',
            nextFocusUp: 'recommend_border_1',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_2.png',
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
            nextFocusRight: 'recommend_border_A4',
            nextFocusUp: 'nav_0',
            nextFocusDown: 'recommend_border_6',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_2.png',
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
            nextFocusRight: 'recommend_border_A7',
            nextFocusUp: 'recommend_border_5',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_1.png',
            click: Home.onRecommendClick,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 6,
            cPosition: '16'
        });
        buttons.push({
            id: 'recommend_border_A0',
            name: '推荐位A',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommend_border_1',
            nextFocusUp: 'nav_0',
            nextFocusDown: 'recommend_border_A1',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_3.png',
            click: Home.onRecommendClickA,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 'A0'
        });
        buttons.push({
            id: 'recommend_border_A1',
            name: '推荐位A',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommend_border_1',
            nextFocusUp: 'recommend_border_A0',
            nextFocusDown: 'recommend_border_A2',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_3.png',
            click: Home.onRecommendClickA,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 'A1'
        });
        buttons.push({
            id: 'recommend_border_A2',
            name: '推荐位A',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommend_border_3',
            nextFocusUp: 'recommend_border_A1',
            nextFocusDown: 'recommend_border_A3',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_3.png',
            click: Home.onRecommendClickA,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 'A2'
        });
        buttons.push({
            id: 'recommend_border_A3',
            name: '推荐位A',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommend_border_3',
            nextFocusUp: 'recommend_border_A2',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_3.png',
            click: Home.onRecommendClickA,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 'A3'
        });
        buttons.push({
            id: 'recommend_border_A4',
            name: '推荐位A',
            type: 'img',
            nextFocusLeft: 'recommend_border_5',
            nextFocusRight: '',
            nextFocusUp: 'nav_6',
            nextFocusDown: 'recommend_border_A5',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_4.png',
            click: Home.onRecommendClickA,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 'A4'
        });
        buttons.push({
            id: 'recommend_border_A5',
            name: '推荐位A',
            type: 'img',
            nextFocusLeft: 'recommend_border_5',
            nextFocusRight: '',
            nextFocusUp: 'recommend_border_A4',
            nextFocusDown: 'recommend_border_A6',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_4.png',
            click: Home.onRecommendClickA,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 'A5'
        });
        buttons.push({
            id: 'recommend_border_A6',
            name: '推荐位A',
            type: 'img',
            nextFocusLeft: 'recommend_border_5',
            nextFocusRight: '',
            nextFocusUp: 'recommend_border_A5',
            nextFocusDown: 'recommend_border_A7',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_4.png',
            click: Home.onRecommendClickA,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 'A6'
        });
        buttons.push({
            id: 'recommend_border_A7',
            name: '推荐位A',
            type: 'img',
            nextFocusLeft: 'recommend_border_6',
            nextFocusRight: '',
            nextFocusUp: 'recommend_border_A6',
            nextFocusDown: 'recommend_border_A8',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_4.png',
            click: Home.onRecommendClickA,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 'A7'
        });
        buttons.push({
            id: 'recommend_border_A8',
            name: '推荐位A',
            type: 'img',
            nextFocusLeft: 'recommend_border_6',
            nextFocusRight: '',
            nextFocusUp: 'recommend_border_A7',
            nextFocusDown: 'recommend_border_A9',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_4.png',
            click: Home.onRecommendClickA,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 'A8'
        });
        buttons.push({
            id: 'recommend_border_A9',
            name: '推荐位A',
            type: 'img',
            nextFocusLeft: 'recommend_border_6',
            nextFocusRight: '',
            nextFocusUp: 'recommend_border_A8',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V5/bg_home_recommend_border_4.png',
            click: Home.onRecommendClickA,
            focusChange: Home.onRecommendFocusChange,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIdx: 'A9'
        });
        buttons.push({
            id: 'help_img',
            name: '',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            click: Home.onHelpClick
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
                    //Home.Banner.initBanner(RenderParam.initPositionList);
                    G('recommend_1').src = RenderParam.fsUrl + data.image_url;
                    break;
                case '12':
                    // 第二个位置，用于轮播或其它，暂时不管
                    G('recommend_2').src = RenderParam.fsUrl + data.image_url;
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
            }
        }
        for (var i = 0; i < RenderParam.navigateModelInfo.length; i++) {
            var data = RenderParam.navigateModelInfo[i];
            G('recommend_A' + i).src = RenderParam.fsUrl + data.img_url;
            G('recommend_A' + i).setAttribute('model_type', data.model_type);
        }
    },


    // 格式化日期
    formatDate: function (date) {
        var time = date.replace(/-/g, ':').replace(' ', ':').split(':');
        return new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
    },


    /**
     * 创建首页推荐位
     */
    createRecommandByHome: function () {
        var html = '<div class="recommends">';

        html = html + '</div>';
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
                        && keys[keys.length - 2] == KEY_9
                        && keys[keys.length - 3] == KEY_8
                        && keys[keys.length - 4] == KEY_3) {
                        // 进入测试服，青海改成了3893
                        Page.jumpTestPage();
                    }
                }
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
        Home.renderThemeUI(RenderParam.carrierId);       // 刷新主页背景
        Home.initNav();             // 初始化导航栏
        Home.initTopMenu();         // 顶部菜单
        Home.initRecommend();       // 初始化推荐位
        Home.initMarquee();         // 初始化滚动字幕

        Home.renderRecommend();     // 渲染推荐位

        var defaultFocusId = typeof (RenderParam.focusIndex) === 'undefined' || RenderParam.focusIndex == null || RenderParam.focusIndex != ''
            ? RenderParam.focusIndex : 'nav_0';
        LMEPG.BM.init(defaultFocusId, buttons, '', true);

        //启动字幕滚动
        //LMEPG.UI.Marquee.start("scroll_message", 7, 2, 50, "left", "scroll_message");

        Home.startTimer(); // 启动定时器

        // 开始轮播
        //Play.startPollPlay();
    }
};

// 定义全局按钮
var buttons = [];

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        //EVENT_MEDIA_END: Play.onPlayEvent,
        //EVENT_MEDIA_ERROR: Play.onPlayEvent,
        KEY_VOL_UP: LMEPG.mp.upVolume,
        KEY_VOL_DOWN: LMEPG.mp.downVolume,
        KEY_3: Home.onKeyDown
    }
);

function onBack() {
    switch (RenderParam.carrierId) {
        case '450092':
        case '520094':
            LMEPG.mp.destroy();
            Page.exitAppHome();
            return;
        case '630092':
            if (LMEPG.BM._current.id == 'help_img') {
                Hide('help_img');
                LMEPG.BM.requestFocus('help');
            } else {
                LMEPG.mp.destroy();
                Page.exitAppHome();
            }
            break;
        case '000051':
        case '320092':
        case '640092':
            if (LMEPG.BM._current.id == 'help_img') {
                Hide('help_img');
                LMEPG.BM.requestFocus('help');
            } else {
                Page.jumpHoldPage();
            }
            break;
        default:
            Page.jumpHoldPage();
            break;
    }
}

window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};
