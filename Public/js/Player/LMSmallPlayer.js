/**
 * Created by LongMaster on 2019/4/26.
 * 小窗口播放器模块（包括：应用上的小窗口，专辑上的小窗口）
 */
var _readyTimer;
var LMSmallPlayer = {
    isInit: false, // 是否已经初始化,只有初始化参数之后，才能正常使用
    carrierId: '', // 运营商ID
    videoUrl: '', // 视频URL
    playerUrl: '', // 播放器URL
    position: {}, //  视频播放位置{left, top, width, height}
    playerScreenId: '', // 播放器位置ID
    platformType: 'hd', // 平台类型（高清：hd, 标清：sd）
    videoData: {}, // 完整视频信息
    playByTimeSeconds: 0, // 小窗时移播放秒数
    gd_player: null,//广东广电播放器对象

    /**
     * 全局参数初始化
     * 参数：param---> {carrierId, videoUrl, playerUrl, position, playerScreenId, platformType, videoData}
     */
    initParam: function (param) {
        LMSmallPlayer.carrierId = param.carrierId;
        LMSmallPlayer.videoUrl = param.videoUrl;
        LMSmallPlayer.playerUrl = param.playerUrl;
        LMSmallPlayer.position = param.position;
        LMSmallPlayer.playerScreenId = param.playerScreenId;
        LMSmallPlayer.platformType = param.platformType;
        LMSmallPlayer.videoData = param.videoData;
        LMSmallPlayer.playByTimeSeconds = param.playByTimeSeconds;
        LMSmallPlayer.isInit = true;
        console.log("[LMSmallPlayer.js]--> initParam :初始化小窗播放器")
        return true;
    },

    /**
     * 接口：开始播放视频
     * 参数：carrierId -- 运营商区域码
     * 参数：position -- 播放器位置{left, top, width, height}
     * 参数：videoUrl -- 视频URL（有可能是视频ID）
     */
    startPlayVideo: function (position, videoUrl) {
        if (!LMSmallPlayer.isInit) {
            LMEPG.Log.debug('LMSmallPlayer.js ---> startPlayVideo failed, because use before init!!!');
            return;
        }

        if (!is_exist(LMSmallPlayer.playerScreenId)) {
            LMEPG.Log.debug('LMSmallPlayer.js ---> startPlayVideo failed, playerScreenId is empty!!!');
            return;
        }

        if (!is_exist(LMSmallPlayer.carrierId)) {
            LMEPG.Log.debug('LMSmallPlayer.js ---> startPlayVideo failed, carrierId is empty!!!');
            return;
        }

        if (!is_exist(position)) {
            position = LMSmallPlayer.position;
        }

        if (!is_exist(videoUrl)) {
            videoUrl = this.getCurrentPollVideoUrl();
        }

        // 再一次判断，如果videoUrl不存在，就返回
        if (!is_exist(videoUrl)) {
            return;
        }

        console.log("[LMSmallPlayer.js]--> startPlayVideo :开始播放视频 carrierId : " + LMSmallPlayer.carrierId)
        LMEPG.Log.info("startPlayVideo 开始播放视频 carrierId : " + LMSmallPlayer.carrierId+",videoURL:"+videoUrl);
        getmpTimes();//设置小窗视频图片显示
        var left = position.left;
        var top = position.top;
        var width = position.width;
        var height = position.height;
        var domainUrl, port_index, path_index, result, lmpf, index;
        switch (LMSmallPlayer.carrierId) {
            //江苏电信、广西电信、宁夏电信、甘肃电信
            case '320092':
            case '450092':
            case '640092':
            case '620092':
                this.playWithIframe(videoUrl, left, top, width, height);
                break;
            case '000051':
            case '11000051':
                setTimeout(function () {
                    // 兼容push播放器
                    if (window.mp && typeof window.mp != 'undefined') {
                        // 默认从头开始播放
                        var defaultTime = 0;
                        console.log("[LMSmallPlayer.js]-->000051-->videoUrl-->" + videoUrl);
                        // 初始化播放器
                        window.mp.initMediaPlayer(videoUrl, left, top, width, height, defaultTime);
                        _readyTimer = setInterval(function () {
                            var isReady = window.mp.getIsReady();
                            console.log("small isReady --- " + isReady);
                            if (isReady) clearInterval(_readyTimer);
                            if (G('default_link')) G('default_link').focus();//防止（部分盒子）页面失去焦点
                        }, 1000);
                    } else { // epg播放器使用
                        console.log("[LMSmallPlayer.js]-->000051-->epg播放器");
                        var stbModel = LMEPG.STBUtil.getSTBModel();
                        if (stbModel === 'IP506H_54U3') { //内蒙联通海信盒子
                            LMEPG.mp.initPlayerByBind();
                        } else {
                            LMEPG.mp.initPlayer();
                        }
                        if (typeof LMSmallPlayer.playByTimeSeconds === 'undefined') { //小窗播放
                            LMEPG.mp.playOfSmallscreen(videoUrl, left, top, width, height);
                        } else { //全屏播放
                            LMEPG.mp.playOfSmallscreen(videoUrl, left, top, width, height, true, LMSmallPlayer.playByTimeSeconds);
                        }
                    }
                    if (G('default_link')) G('default_link').focus();//防止（部分盒子）页面失去焦点
                }, 500);
                break;
            case '520094': // 贵州广电播放器
                var data = LMSmallPlayer.videoData[0];
                var videoInfoArr = [
                    {   // 创建视频信息
                        'sourceId': data.source_id,
                        'videoUrl': videoUrl,
                        'title': data.show_title,
                        'type': '1',
                        'userType': data.user_type,
                        'freeSeconds': data.free_seconds,
                        'entryType': 1,
                        'entryTypeName': '专题轮播视频'
                    }];
                var tempPosition = {
                    left: left,
                    top: top,
                    width: width,
                    height: height
                };

                var tempVideoInfo = encodeURIComponent(JSON.stringify(videoInfoArr[0]));
                var tempAllVideoInfo = encodeURIComponent(JSON.stringify(videoInfoArr));
                var playUrl = '/index.php/Home/Player/smallV1?videoInfo=' + tempVideoInfo + '&allVideoInfo=' + tempAllVideoInfo + '&position=' + JSON.stringify(tempPosition);
                LMEPG.Log.debug('LMSmallPlayer.js --->playUrl:' + playUrl);
                G(LMSmallPlayer.playerScreenId).setAttribute('src', playUrl);
                break;
            case '630092'://青海电信
                domainUrl = LMEPG.STBUtil.getEPGDomain();
                domainUrl = domainUrl.replace('://', '+++');
                port_index = domainUrl.indexOf(':');
                path_index = domainUrl.indexOf('/');
                result = domainUrl.substring(port_index, path_index);
                domainUrl = domainUrl.replace('+++', '://');
                if (result === ':33200') {
                    //华为端口
                    lmpf = 'huawei';
                    index = domainUrl.indexOf('/EPG/');
                    domainUrl = domainUrl.substr(0, index) + '/EPG/';
                } else {
                    lmpf = 'zte';
                    index = domainUrl.lastIndexOf('/');
                    domainUrl = domainUrl.substr(0, index) + '/';
                }
                info = LMEPG.mp.dispatcherUrl.getUrlWith630092(left, top, width, height, videoUrl, lmpf);
                var playUrl = domainUrl + info;
                LMEPG.Log.debug('LMSmallPlayer.js --->playUrl:' + playUrl);
                G(LMSmallPlayer.playerScreenId).setAttribute('src', playUrl); // 设置第三方播放器地址
                LMEPG.mp.initPlayerByBind();
                if (G('default_link')) G('default_link').focus();//防止（部分盒子）页面失去焦点
                break;
            case '420092':// 湖北电信EPG
                domainUrl = LMEPG.STBUtil.getEPGDomain();
                if (domainUrl === '') {
                    LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                    return;
                }

                domainUrl = domainUrl.replace('://', '+++');
                port_index = domainUrl.indexOf(':');
                path_index = domainUrl.indexOf('/');
                result = domainUrl.substring(port_index, path_index);
                domainUrl = domainUrl.replace('+++', '://');
                if (result === ':33200') {
                    lmpf = 'huawei';
                    index = domainUrl.indexOf('/EPG/');
                    domainUrl = domainUrl.substr(0, index) + '/EPG/';
                } else {
                    lmpf = 'zte';
                    index = domainUrl.lastIndexOf('/');
                    domainUrl = domainUrl.substr(0, index) + '/';
                }

                info = LMEPG.mp.dispatcherUrl.getUrlWith420092(left, top, width, height, videoUrl, lmpf);
                var playUrl = domainUrl + info;
                LMEPG.Log.debug('LMSmallPlayer.js --->playUrl:' + playUrl);
                G(LMSmallPlayer.playerScreenId).setAttribute('src', playUrl); // 设置第三方播放器地址
                LMEPG.mp.initPlayerByBind();
                if (G('default_link')) G('default_link').focus();//防止（部分盒子）页面失去焦点
                break;
            case '350092': // 福建电信EPG
                // 判断第三方播放器地址
                setTimeout(function () {
                    domainUrl = LMSmallPlayer.playerUrl;
                    if (!domainUrl) {
                        LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                        return;
                    }
                    var playParam = LMEPG.mp.dispatcherUrl.getUrlWith350092(left, top, width, height, videoUrl);
                    var playUrl = domainUrl + playParam;
                    LMEPG.Log.debug('LMSmallPlayer.js --->playUrl:' + playUrl);
                    G(LMSmallPlayer.playerScreenId).setAttribute('src', playUrl); // 设置第三方播放器地址
                    LMEPG.mp.initPlayerByBind();
                    if (G('default_link')) G('default_link').focus();//防止（部分盒子）页面失去焦点
                }, 500);
                break;
            case '360092': // 福建电信EPG
                // 判断第三方播放器地址
                if (LMSmallPlayer.domainUrl === undefined || LMSmallPlayer.domainUrl === '') {
                    LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                    return;
                }
                var info = LMEPG.mp.dispatcherUrl.getUrlWith360092(top, left, width, height, videoUrl, LMSmallPlayer.platformType);
                var playUrl = LMSmallPlayer.domainUrl + info;
                // http://115.153.215.71:8282/EPG/jsp/8601_4Kdazhongban/en/HD_vasToMemInterface.jsp?vas_info=<vas_action>play_trailer</vas_action>
                // <mediacode>99100000012019031416475304411751</mediacode><mediatype>VOD</mediatype><left>358</left><top>150</top><width>550</width>
                // <height>302</height><size>hd</size>
                LMEPG.Log.debug('LMSmallPlayer.js --->playUrl:' + playUrl);
                G(LMSmallPlayer.playerScreenId).setAttribute('src', playUrl); // 设置第三方播放器地址
                LMEPG.mp.initPlayerByBind();
                if (G('default_link')) G('default_link').focus();//防止（部分盒子）页面失去焦点
                break;
            case '650092'://新疆电信
            case '12650092'://新疆电信天天健身
                var stbModel = LMEPG.STBUtil.getSTBModel();
                var stbDomainUrl = LMEPG.STBUtil.getEPGDomain();
                var prefixObj = LMEPG.mp.dispatcherUrl.getUrlWith650092PrefixObj(stbDomainUrl);
                var thirdPlayerUrl = prefixObj.url;
                info = LMEPG.mp.dispatcherUrl.getUrlWith650092Suffix(left, top, width, height, videoUrl, prefixObj.isHW);
                var playUrl = thirdPlayerUrl + info;
                LMEPG.Log.debug('LMSmallPlayer.js --->playUrl:' + playUrl);
                G(LMSmallPlayer.playerScreenId).setAttribute('src', playUrl); // 设置第三方播放器地址
                LMEPG.mp.initPlayerByBind();
                if (G('default_link')) G('default_link').focus();
                break;

            case '460092': // 海南电信
                domainUrl = LMEPG.STBUtil.getEPGDomain();
                if (domainUrl === '') {
                    LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                    return;
                }
                domainUrl = domainUrl.replace('://', '+++');
                port_index = domainUrl.indexOf(':');
                path_index = domainUrl.indexOf('/');
                result = domainUrl.substring(port_index, path_index);
                domainUrl = domainUrl.replace('+++', '://');
                if (result === ':33200') {
                    lmpf = 'huawei';
                    index = domainUrl.indexOf('/EPG/');
                    domainUrl = domainUrl.substr(0, index) + '/EPG/';
                } else {
                    lmpf = 'zte';
                    index = domainUrl.lastIndexOf('/');
                    domainUrl = domainUrl.substr(0, index) + '/';
                }

                var info = LMEPG.mp.dispatcherUrl.getUrlWith420092(left, top, width, height, videoUrl, lmpf);
                var playUrl = domainUrl + info;
                LMEPG.Log.debug('LMSmallPlayer.js --->playUrl:' + playUrl);
                G(LMSmallPlayer.playerScreenId).setAttribute('src', playUrl); // 设置第三方播放器地址
                LMEPG.mp.initPlayerByBind();
                if (G('default_link')) G('default_link').focus();
                setTimeout(function () {
                    var stbType1 = LMEPG.STBUtil.getSTBModel();
                    if (stbType1.toUpperCase().indexOf('HG600') >= 0) {
                        LMEPG.mp.upVolume(5);//在当前音量基础上，+5并设置
                    }
                }, 1000);
                break;
            case '220094'://吉林广电
            case '10220094'://吉林广电魔方
                this.__startPlayVideo_220094(videoUrl, left, top, width, height);
                break;
            case '220095'://吉林广电电信新媒体
                this.__startPlayVideo_220095(videoUrl, left, top, width, height);
                break;
            case '370092'://山东电信
            case '371092'://山东电信 -- 海看EPG
                this.__startPlayVideo_370092(videoUrl, left, top, width, height);
                break;
            case '640094': //宁夏广电
                ottService.playVod(videoUrl, left, top, width, height);
                break;
            case '07430093'://芒果联通
                //取消视频小窗播放
                //this.__startPlayVideo_07430093(videoUrl, left, top, width, height);
                break;
            case '500092'://重庆电信
                this.__startPlayVideo_500092(videoUrl, left, top, width, height);
                break;
            case '450094'://广西广电EPG
                this.__startPlayVideo_450094(videoUrl, left, top, width, height);
                break;
            case '440004'://广东广电EPG
                this.__startPlayVideo_440004(videoUrl, left, top, width, height);
                break;
            default:
                setTimeout(function () {
                    LMEPG.mp.initPlayer(); //初始化
                    if (LMSmallPlayer.platformType === 'hd') {
                        LMEPG.mp.playOfSmallscreen(videoUrl, left, top, width, height); //小窗播放
                        if (G('default_link')) G('default_link').focus();
                    }
                }, 500);
                break;
        }
    },

    getCurrentPollVideoUrl: function () {
        if (is_exist(LMSmallPlayer.videoData)) {
            var videoInfo = LMSmallPlayer.videoData[0];
            if (videoInfo != null) {
                var ftp_url_json;
                if (videoInfo.ftp_url instanceof Object) {
                    ftp_url_json = videoInfo.ftp_url;
                } else {
                    ftp_url_json = JSON.parse(videoInfo.ftp_url);
                }

                if (LMSmallPlayer.platformType === 'hd') {
                    return ftp_url_json.gq_ftp_url;
                } else {
                    return ftp_url_json.bq_ftp_url;
                }
            }
        } else {
            return LMSmallPlayer.videoUrl;
        }
    },

    playWithIframe: function (videoUrl, left, top, width, height) {
        setTimeout(function () {
            LMEPG.Log.info('1 playWithIframe LMSmallPlayer.playerUrl: '+LMSmallPlayer.playerUrl);
            if (LMEPG.Func.isEmpty(LMSmallPlayer.playerUrl)) {
                LMEPG.Log.debug('LMSmallPlayer.js ---> playWithIframe failed, because LMSmallPlayer.playerUrl is empty!!!');
                // LMEPG.UI.showToast('domainUrl is empty!!!', 3);
                LMSmallPlayer.playerUrl = LMEPG.STBUtil.getEPGDomain();
                if (LMEPG.Func.isEmpty(LMSmallPlayer.playerUrl)) {
                    return;
                }
                LMEPG.Log.info('playWithIframe LMSmallPlayer.playerUrl: '+LMSmallPlayer.playerUrl);
            }
            var info = "";//避免出现undefined情况
            if (LMSmallPlayer.carrierId === '640092' || LMSmallPlayer.carrierId === '10640092') {
                var stbDomainUrl = LMEPG.STBUtil.getEPGDomain();
                var prefixObj = LMEPG.mp.dispatcherUrl.getUrlWith650092PrefixObj(stbDomainUrl);
                var thirdPlayerUrl = prefixObj.url;
                var play_url = LMEPG.mp.dispatcherUrl.getUrlWith640092Suffix(left, top, width, height, videoUrl, prefixObj.isHW);
                LMEPG.Log.info('playWithIframe play_url: '+play_url);
                //2021年12月01日视频割接到局方统一播放器，小窗使用新播放拼接逻辑
                if(LMEPG.Func.isEmpty(play_url)){
                    //getUrlWith650092Suffix -->老播放逻辑
                    info = LMEPG.mp.dispatcherUrl.getUrlWith650092Suffix(left, top, width, height, videoUrl, prefixObj.isHW);
                    LMSmallPlayer.playerUrl = thirdPlayerUrl;
                }else{
                    LMSmallPlayer.playerUrl = play_url;
                }
            } else if(LMSmallPlayer.carrierId === '620092'){
                // 甘肃电信EPG
                info = LMEPG.mp.dispatcherUrl.getUrlWith360092(left, top, width, height, videoUrl);
            } else {
                info = LMEPG.mp.dispatcherUrl.getUrlWith320092(left, top, width, height, videoUrl);
            }
            if (LMSmallPlayer.carrierId == "450092") {
                LMSmallPlayer.playerUrl = LMSmallPlayer.playerUrl.replace("Category.jsp", "third_to_epg.jsp");
            }
            var playUrl = LMSmallPlayer.playerUrl + info;
            LMEPG.Log.debug('LMSmallPlayer.js ---> playWithIframe playUrl:' + playUrl);
            G(LMSmallPlayer.playerScreenId).setAttribute('src', playUrl); // 设置第三方播放器地址
            /*if (LMSmallPlayer.carrierId != "640092") {
                // 宁夏电信EPG，天邑盒子进行简单绑定时，无法播放视频，所以就不进行绑定
                LMEPG.mp.initPlayerByBind();
            }*/
            LMEPG.mp.initPlayerByBind();
            if (G('default_link')) G('default_link').focus();//防止（部分盒子）页面失去焦点
        }, 500);
        if (G('default_link')) G('default_link').focus();//防止（部分盒子）页面失去焦点
    },

    /**
     * 吉林广电EPG - 小窗视频播放
     * @param videoId  注入局方的视频id
     * @param left 小窗位置坐标（左）
     * @param top 小窗位置坐标（上）
     * @param width 小窗大小（宽）
     * @param height 小窗大小（高）
     * @private 吉林广电 - 小窗视频播放，默认建议为内部调用（Songhui 2019-6-10）
     */
    __startPlayVideo_220094: function (videoId, left, top, width, height) {
        setTimeout(function () {
            try {
                if (typeof window.top.jk39 !== 'undefined' && window.top.jk39 !== null && window.top.jk39.fetchPlayData !== undefined) {
                    window.top.jk39.fetchPlayData({
                            type: window.top.jk39.PLAYTYPE.vod, //播放视频类型，玛朗39健康的默认vod
                            contentId: videoId, //节目ID，即注入的视频code
                            breakpoint: '0', //开始播放时间，可选，默认为0
                            categoryId: '', //栏目ID，可选
                            callback: function (playUrl, name) {
                                if (LMEPG.Log) LMEPG.Log.info('[220094][LMSmallPlayer.js]---[window.top.jk39.fetchPlayData()]--->callback: [' + videoId + ']-->[' + playUrl + ' , ' + name + ']');
                                LMEPG.mp.initPlayerMode1();
                                LMEPG.mp.playOfSmallscreen(playUrl, left, top, width, height);
                            }
                        }
                    );
                } else {
                    if (LMEPG.Log) LMEPG.Log.error('[220094][LMSmallPlayer.js]---[__startPlayVideo_220094()]--->NOTICE: No "window.top.jk39.fetchPlayData" function!');
                    LMEPG.UI.showToast('小窗获取播放地址异常！');
                }
            } catch (e) { //保护兼容
                if (LMEPG.Log) LMEPG.Log.error('[220094][LMSmallPlayer.js]---[__startPlayVideo_220094()]--->Exception: ' + e.toString());
                LMEPG.UI.showToast('小窗获取播放地址异常！');
            }
        }, 500);
    },

    /**
     * 吉林广电电信新媒体EPG - 小窗视频播放
     * @param videoId  注入局方的视频id
     * @param left 小窗位置坐标（左）
     * @param top 小窗位置坐标（上）
     * @param width 小窗大小（宽）
     * @param height 小窗大小（高）
     * @private 吉林广电 - 小窗视频播放，默认建议为内部调用（Songhui 2019-6-10）
     */
    __startPlayVideo_220095: function (videoId, left, top, width, height) {
        setTimeout(function () {
            try {
                if (typeof window.top.bestv !== 'undefined' && window.top.bestv !== null && window.top.bestv.fetchPlayData !== undefined) {
                    window.top.bestv.fetchPlayData({
                            type: window.top.bestv.PLAYTYPE.vod, //播放视频类型，玛朗39健康的默认vod
                            contentId: videoId, //节目ID，即注入的视频code
                            breakpoint: '0', //开始播放时间，可选，默认为0
                            categoryId: '', //栏目ID，可选
                            callback: function (playUrl, name) {
                                if (LMEPG.Log) LMEPG.Log.info('[220095][LMSmallPlayer.js]---[window.top.jk39.fetchPlayData()]--->callback: [' + videoId + ']-->[' + playUrl + ' , ' + name + ']');
                                LMEPG.mp.initPlayerMode1();
                                LMEPG.mp.playOfSmallscreen(playUrl, left, top, width, height);
                                if (G('default_link')) G('default_link').focus();//防止（部分盒子）页面失去焦点
                            }
                        }
                    );
                } else {
                    if (LMEPG.Log) LMEPG.Log.error('[220095][LMSmallPlayer.js]---[__startPlayVideo_220095()]--->NOTICE: No "window.top.bestv.fetchPlayData" function!');
                    LMEPG.UI.showToast('小窗获取播放地址异常！');
                }
            } catch (e) { //保护兼容
                if (LMEPG.Log) LMEPG.Log.error('[220095][LMSmallPlayer.js]---[__startPlayVideo_220095()]--->Exception: ' + e.toString());
                LMEPG.UI.showToast('小窗获取播放地址异常！');
            }
        }, 500);
    },


    /**
     * 山东电信EPG - 小窗视频播放
     * @param videoId  注入局方的视频id
     * @param left 小窗位置坐标（左）
     * @param top 小窗位置坐标（上）
     * @param width 小窗大小（宽）
     * @param height 小窗大小（高）
     * @private 吉林广电 - 小窗视频播放，默认建议为内部调用（Songhui 2019-6-10）
     */
    __startPlayVideo_370092: function (videoId, left, top, width, height) {
        setTimeout(function () {
            LMEPG.Log.debug('[370092][LMSmallPlayer.js]---[__startPlayVideo_370092()]--->videoId: ' + videoId);
            try {
                if (typeof window.top.access !== 'undefined' && window.top.access !== null
                    && window.top.access.sendRequest !== undefined) {
                    LMEPG.Log.debug('[370092][LMSmallPlayer.js]---[sendRequest]');
                    window.top.access.sendRequest({
                        url: '/VSP/V3/PlayVOD',
                        body: JSON.stringify({
                            VODID: videoId,// 外部ID
                            mediaID: videoId.replace("_", "_M_"),//  通过queryVOD返回数据中mediaFiles下的code
                            IDType: '1'
                        })
                    }).then(function (resp) {
                        LMEPG.Log.info("PlayVOD Success >>> " + JSON.stringify(resp));
                        LMEPG.mp.initPlayer();
                        LMEPG.mp.playOfSmallscreen(resp.body.playURL, left, top, width, height);
                    }, function (err) {
                        LMEPG.Log.info("PlayVOD fail >>> " + JSON.stringify(err));
                    });
                }
            } catch (e) { //保护兼容
                if (LMEPG.Log) LMEPG.Log.error('[370092][LMSmallPlayer.js]---[__startPlayVideo_370092()]--->Exception: ' + e.toString());
                LMEPG.UI.showToast('小窗获取播放地址异常！');
            }
        }, 500);
    },

    /**
     * 芒果联通EPG - 小窗视频播放
     * @param videoId  注入局方的视频id
     * @param left 小窗位置坐标（左）
     * @param top 小窗位置坐标（上）
     * @param width 小窗大小（宽）
     * @param height 小窗大小（高）
     * @private 吉林广电 - 小窗视频播放，默认建议为内部调用（Songhui 2019-6-10）
     */
    __startPlayVideo_07430093: function (videoId, left, top, width, height) {
        setTimeout(function () {
            LMEPG.Log.debug('[370092][LMSmallPlayer.js]---[__startPlayVideo_370092()]--->videoId: ' + videoId);
            try {
                Webview.stopVideo();
                left = left + 6;
                top = top + 10;
                width = width - 10;
                height = height - 24;
                Webview.setVideoWindowPosition(left, top, width, height);
                var videoUrl = videoId.split('|');
                var playParams = {
                    video_type: "0", //视频类型 0:点播 1:直播
                    video_id: videoUrl[0],
                    video_name: "",
                    media_asset_id: videoUrl[0],
                    category_id: "",
                    ui_style: 0,
                    video_index: videoUrl[1], //分集索引号（要播放的集数）
                    quality: "hd",
                    video_all_index: 1,
                    video_new_index: 1,
                };
                Webview.setHandler("PlayPrepared", function (prepared) {
                    if (prepared) {
                        Webview.playVideo(playParams);
                    }
                });

            } catch (e) { //保护兼容
                Webview.stopVideo();
                if (LMEPG.Log) LMEPG.Log.error('[370092][LMSmallPlayer.js]---[__startPlayVideo_370092()]--->Exception: ' + e.toString());
                LMEPG.UI.showToast('小窗获取播放地址异常！');
            }
        }, 500);
    },


    /**
     * 广东广电EPG - 小窗视频播放
     * @param videoId  注入局方的视频id
     * @param left 小窗位置坐标（左）
     * @param top 小窗位置坐标（上）
     * @param width 小窗大小（宽）
     * @param height 小窗大小（高）
     * @private 广东广电 - 小窗视频播放，默认建议为内部调用
     */
    __startPlayVideo_440004: function (videoId, left, top, width, height) {
        // setTimeout(function () {
        //     LMEPG.Log.info('[440004][LMSmallPlayer.js]---[__startPlayVideo_440004()]--->videoId: ' + videoId);
        //     try {
        //
        //         //全屏播放
        //         // startFullScreenPlay(videoId)
        //
        //         /*小窗播放
        //         广东广电初始化视频真实地址,先鉴权视频，然后获取播放地址
        //         广东广电真实的签权地址:http://172.16.241.29/u1/SelectionStart
        //         由于服务器不能直接访问,所以需要在通过内网待建代理服务器中转
        //         地址拼接规则见广东广电的文档test.html中的小窗播放示例
        //         小窗只有一个实例,所以播放之前要先释放*/
        //
        //         var url = "http://172.31.134.185:10018/u1/SelectionStart?";
        //         var params = "client="+RenderParam.client+
        //                         "&account="+RenderParam.accountId+
        //                         "&titleAssetId="+videoId+
        //                          "&serviceId=gd_mf"+ "&resultType=json";
        //         var surl = url+params;
        //         LMEPG.Log.info('[440004][LMSmallPlayer.js]---[__startPlayVideo_440004()]--->surl: ' + surl);
        //
        //         if(LMSmallPlayer.gd_player == undefined){
        //             LMSmallPlayer.gd_player = new VideoPlayer(width,height,left,top);
        //             LMSmallPlayer.gd_player.loop = true;
        //         }else{
        //             LMSmallPlayer.gd_player.teardown();
        //         }
        //         LMSmallPlayer.gd_player.play(surl);
        //         if (G('default_link')) G('default_link').focus();//防止（部分盒子）页面失去焦点
        //
        //     } catch (e) { //保护兼容
        //         if (LMEPG.Log) LMEPG.Log.error('[440004][LMSmallPlayer.js]---[__startPlayVideo_440004()]--->Exception: ' + e.toString());
        //         LMEPG.UI.showToast('小窗获取播放地址异常！');
        //     }
        // }, 500);
    },


    /**
     * 重庆电信EPG - 小窗视频播放
     * @param videoId  注入局方的视频id
     * @param left 小窗位置坐标（左）
     * @param top 小窗位置坐标（上）
     * @param width 小窗大小（宽）
     * @param height 小窗大小（高）
     * @private 吉林广电 - 小窗视频播放，默认建议为内部调用（Songhui 2019-6-10）
     */
    __startPlayVideo_500092: function (videoId, left, top, width, height) {
        setTimeout(function () {
            LMEPG.Log.debug('[370092][LMSmallPlayer.js]---[__startPlayVideo_500092()]--->videoId: ' + videoId);
            try {
                var iframe = '<iframe id="hidden_frame" name="hidden_frame" style="width: 0;height: 0;" src=""></iframe>';
                var div = document.createElement("div");
                document.body.appendChild(div);
                div.innerHTML = iframe;
                LMEPG.ajax.postAPI("Player/getUserServerPath", "", function (data) {
                    if (data.result == 0) {
                        var serverPath = data.serverPath + "service/" + data.partner + "PlayURLByMCService.jsp?mediacode=";
                        var mediacode = videoId + "&inIFrame=1&onSuccess=callBackPlayUrlResult&onError=0";
                        var URL = serverPath + mediacode;
                        var param = {
                            carrierId: RenderParam.carrierId,
                            playerScreenId: 'iframe_small_screen',
                            platformType: RenderParam.platformType,
                            playerUrl: RenderParam.thirdPlayerUrl
                        };
                        param.position = {top: top, left: left, width: width, height: height};
                        LMSmallPlayer.initParam(param);
                        G("hidden_frame").src = URL;
                    } else {
                        LMEPG.UI.showToast("系统报错");
                    }
                });
            } catch (e) { //保护兼容
                if (LMEPG.Log) LMEPG.Log.error('[370092][LMSmallPlayer.js]---[__startPlayVideo_500092()]--->Exception: ' + e.toString());
                LMEPG.UI.showToast('小窗获取播放地址异常！');
            }
        }, 500);
    },


    /**
     * 广西广电EPG - 小窗视频播放
     * @param videoId  注入局方的视频id
     * @param left 小窗位置坐标（左）
     * @param top 小窗位置坐标（上）
     * @param width 小窗大小（宽）
     * @param height 小窗大小（高）
     * @private 广西广电 - 小窗视频播放，默认建议为内部调用
     */
    __startPlayVideo_450094:function (videoId,left,top,width,height) {
        var geturl_params = {
            nns_cp_id: "39JK",
            nns_cp_video_id: videoId,
            nns_video_type: "0"
        }
        if ("undefined" !== typeof iPanel) {
            LMEPG.Log.info("getUrl getVersion:"+iPanel.getGlobalVar("VOD_EMBEDDED_VERSION"));
            LMEPG.Log.info("getUrl geturl_params:"+JSON.stringify(geturl_params));
            starcorCom.apply_play(geturl_params, function (resp) {
                LMEPG.Log.info("getUrl resp:"+JSON.stringify(resp));
                if ("0" == resp.result.state) {
                    var url = resp.video.index.media.url;
                    if (iPanel.getGlobalVar("VOD_EMBEDDED_VERSION") >= 1) {
                        iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE", '1');
                        iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE", '1');
                        iPanel.setGlobalVar("VOD_CTRL_LOCATION", "x=" + left +"&y=" + top + "&w=" + width + "&h=" + height + "");
                        iPanel.setGlobalVar("VOD_CTRL_ENABLE_MENU", '0');
                        iPanel.setGlobalVar("VOD_CTRL_IGNORE_MSG", '1');
                        iPanel.setGlobalVar("VOD_CTRL_URL", '' + url + '');
                        iPanel.setGlobalVar("VOD_CTRL_PLAY", '1');
                    }else {
                        LMEPG.UI.showToast('小窗获取播放地址异常！');
                    }
                }
            });
        }
    },


    /**
     * 通用播放异常拦截处理判断：主要应用于适配不同盒子<br/>
     *
     * 添加处理缘由：
     * <pre>
     *     例如：广西电信EPG由于此款盒子“EC6108V9U_pub_gxgdx”播放小窗会频繁发送768的EVENT_MEDIA_ERROR信号，
     *  但又不影响视频正常播放。故暂时屏蔽掉对其EVENT_MEDIA_ERROR的终止处理，让其获得持续播放权。
     *  ---------> Last modified by Songhui on 2019-7-5 #Bug-Fix-广西电信EPG盒子首页小窗播放闪烁循环播放。
     * </pre>
     * @param signalKeyCode MediaPlayer回调信号值
     * @return {boolean} true：表示需要拦截。false：表示不需要拦截。具体业务逻辑，上层自行处理。
     */
    isInterceptPlayException: function (signalKeyCode) {
        if (typeof signalKeyCode !== 'undefined' && typeof EVENT_MEDIA_ERROR !== 'undefined' && signalKeyCode === EVENT_MEDIA_ERROR) {
            if (typeof LMEPG.STBUtil === 'undefined') return false;
            var stbModel = LMEPG.STBUtil.getSTBModel();
            if (LMEPG.Log) {
                LMEPG.Log.error('[LMSmallPlayer.js][SmallPlayVideo]--[isInterceptPlayException(EVENT_MEDIA_ERROR)]--->Occurred on STBModel "' + stbModel + '"!!!');
            }

            var isIntercepted = false; //默认不拦截。若为true，上层业务应该根据实际情况拦截处理
            switch (LMSmallPlayer.carrierId) {
                case '450092'://广西电信
                    switch (stbModel) {
                        case 'EC6108V9U_pub_gxgdx':
                            isIntercepted = true;
                            break;
                    }
                    break;
            }

            return isIntercepted;
        }
        return false;// 处理情况之外，默认不拦截
    }
};

window.onunload = function () {
    if (LMSmallPlayer.carrierId === '520094') {
        if (G('smallscreen')) {
            G('smallscreen').contentWindow.destorySmallPlayer();
        }

        if (G('small-screen')) {
            G('small-screen').contentWindow.destorySmallPlayer();
        }
    } else if (LMSmallPlayer.carrierId === '000051') {
        if (typeof window.mp != 'undefined' && window.mp.getIsReady()) {
            window.mp.pause();
            window.mp.hideMedia();
        }
    } else {
        LMEPG.mp.destroy();
    }
};

function callBackPlayUrlResult(data) {
    var json_data = JSON.parse(data);
    // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
    LMEPG.mp.destroy();
    LMSmallPlayer.videoUrl = json_data.resultSet[0]['playURL'];
    LMEPG.mp.initPlayer(); //初始化
    if (LMSmallPlayer.platformType === 'hd') {
        LMEPG.mp.playOfSmallscreen(LMSmallPlayer.videoUrl, LMSmallPlayer.position.left, LMSmallPlayer.position.top, LMSmallPlayer.position.width, LMSmallPlayer.position.height); //小窗播放
        if (G('default_link')) G('default_link').focus();
    }
}

var getTimeCnt = 0;
function getmpTimes() {
    if(get_carrier_id() == "450094"){
        return;
    }
    //650092 存在检测播放时长为0，但播放正常的情况
    if(LMEPG.Func.isEmpty(G('link-0'))){
        return;
    }
    var stbType1 = LMEPG.STBUtil ? LMEPG.STBUtil.getSTBModel() : "";
    if(stbType1.toUpperCase().indexOf("EC6110T") >= 0){
        Hide('link-0');
        return;
    }

    var mpTimes = LMEPG.mp.getTimes();
    LMEPG.Log.debug('playWithIframe position: ' + mpTimes.position+"--duration:"+mpTimes.duration);
    if(mpTimes.duration == 0){
        G('link-0').src = g_appRootPath + '/Public/img/hd/Player/smallvideo_bg.gif';
        Show("link-0");
    }else {
        Hide('link-0');
        return;
    }
    if(getTimeCnt>20){
        return;
    }
    setTimeout(function () {
        getmpTimes();
        getTimeCnt = getTimeCnt + 1;
    },500);
}