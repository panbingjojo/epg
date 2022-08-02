var Page = {
    /**
     * 退出应用
     */
    exitAppHome: function () {
        LMEPG.Log.error("hold carrierId:" + RenderParam.carrierId);
        switch (RenderParam.carrierId) {
            case '460092': // 海南电信
            case '610092': // 海南电信
                if (RenderParam.fromLaunch == '1') {
                    if (typeof Utility !== 'undefined') {
                        Utility.setValueByName('exitIptvApp');
                    } else {
                        LMEPG.Intent.back('IPTVPortal');
                    }
                } else {
                    LMEPG.Intent.back('IPTVPortal');
                }
                break;
            case '04630092':// 青海游戏
                LMEPG.Log.error("hold fromLaunch:" + RenderParam.fromLaunch);
                if (RenderParam.fromLaunch == 1) { // 卓影平台退出局方大厅
                    LMEPG.Log.error("hold exitIptvApp:" + RenderParam.exitIptvApp);
                    Utility.setValueByName("exitIptvApp");
                } else { // 正常返回逻辑
                    LMEPG.Intent.back('IPTVPortal');
                }
                break;
            case '340092':// 安徽电信EPG
                if (typeof Utility !== 'undefined') {
                    Utility.setValueByName('exitIptvApp');
                } else {
                    LMEPG.Intent.back();
                }
                break;
            case '220094'://吉林广电EPG
            case '220095'://吉林广电电信EPG
                try {
                    if(RenderParam.carrierId == '220094'){
                        var url = 'http://139.215.92.20:10015/index.php?lmuf=0&lmsid&lmsl=hd-1&lmcid=10220094&lmp=2&POSITIVE';
                    }else{
                        var url = 'http://10.128.3.146:10008/index.php?lmuf=0&lmsid&lmsl=hd-1&lmcid=10220095&lmp=1&POSITIVE';
                    }
                    if(true){
                        window.location.href = url;
                    }else{
                        window.top.jk39.back();
                    }
                } catch (e) {
                    LMEPG.UI.showToast('异常：' + e.toString());
                    if (LMEPG.Log) LMEPG.Log.error(
                        '[220094][hold.js]--->[exitAppHome()]--->Exception: ' +
                        e.toString());
                }
                break;
            case '450094'://广西广电EPG
                var currentHistoryLength = history.length;
                var goLen = currentHistoryLength + 1 -
                    RenderParam.historyLength;
                history.go(-goLen);
                break;
            case '640092'://宁夏电信EPG
                if (RenderParam.userFromType == '2') {
                    var url = LMEPG.STBUtil.getEPGDomain();
                    window.location.href = url;
                } else {
                    LMEPG.Intent.back('IPTVPortal');
                }
                break;
            case '000051'://中国联通EPG
                // 退出时调用接口上报局方
                LMEPG.ajax.postAPI("Debug/sendUserBehaviourWeb", {"type":4},  LMEPG.emptyFunc(),  LMEPG.emptyFunc());
                if (typeof (iPanel) !== 'undefined' && iPanel.hasOwnProperty('focusWidth')) {
                    iPanel.focusWidth = LMEPG.Cookie.getCookie(
                        'iPanel_focusWidth'); // 还原系统光标的大小
                }
                // 应局方通知，需对山东开心乐园入口进行调整：
                // 订购用户退出开心乐园入口内的产品时，在退出引流的页面上，增加岁末年初活动入口，引流活动页地址为：
                // http://202.99.114.63:30721/act/monthFree/enter.html?carrierid=216&userId=XXXX&resolution=hd&homeUrl=xxxx
                if (LMEPG.Func.isAllowAccess(RenderParam.isVip,
                    ACCESS_NO_TYPE) && RenderParam.lmp == '55' &&
                    RenderParam.areaCode == '216') {
                    var goUrl = 'http://202.99.114.63:30721/act/monthFree/enter.html?carrierid=216&userId=' +
                        RenderParam.accountId
                        + '&resolution=' + RenderParam.platformType +
                        '&homeUrl=' +
                        encodeURIComponent(RenderParam.returnEpgUrl);
                    window.location = goUrl;
                }
                // 河南联通返回到新精品商城，中兴和华为平台参数不同。
                // 通过入口参数epgDomain判断平台类型
                // 华为：http://10.254.192.74:33200/EPG/jsp/defaultnew/en/Category.jsp
                // 中兴：http://10.254.245.232:8080/iptvepg/function/index.jsp
                else if ((RenderParam.lmp == '120' || RenderParam.lmp == '90' || RenderParam.lmp == '141' || RenderParam.lmp == '142') && RenderParam.areaCode == '204') {
                    LMEPG.Log.error("hold.js-->RenderParam.epgDomain:" + RenderParam.epgDomain);
                    var tvPlat = '';
                    if ((RenderParam.epgDomain.indexOf('/EPG/jsp/defaultnew/en/Category.jsp') !== -1) || (RenderParam.epgDomain.indexOf('EPG/jsp/yjhnlt/en/Category.jsp') !== -1)) {
                        tvPlat = 'HW';
                    } else if (RenderParam.epgDomain.indexOf('/iptvepg/function/index.jsp') !== -1) {
                        tvPlat = 'ZX'
                    }
                    if (tvPlat == 'HW') {
                        window.location = "http://202.99.114.27:35811/epg_uc/views/login/login.html?carrierId=204&tvplat=hw2&userId="
                            + RenderParam.accountId + "&returnUrl=" + encodeURIComponent(RenderParam.returnEpgUrl);
                    } else if (tvPlat == 'ZX') {
                        window.location = "http://202.99.114.27:35811/epg_uc/views/login/login.html?carrierId=204&tvplat=zx2&userId="
                            + RenderParam.accountId + "&returnUrl=" + encodeURIComponent(RenderParam.returnEpgUrl);
                    } else {
                        LMEPG.Intent.back('IPTVPortal');
                    }
                } else if ((RenderParam.lmp == '69' || RenderParam.lmp == '78' ||
                    RenderParam.lmp == '81' || RenderParam.lmp == '87' || RenderParam.lmp == '102')
                    && RenderParam.areaCode == '204') {
                    // 华为瀑布流 lmp=69、瀑布流推荐5号位lmp=78、中兴瀑布流 lmp=81
                    // var goUrl = 'http://202.99.114.74:58768/iptv/index.do?CarrierId=204&UserID=' +
                    var goUrl = 'http://10.253.69.217:33200/EPG/jsp/yjhnlt/app/vertical-home/vertical-home.html?CarrierId=204&UserID=' +
                        RenderParam.accountId + '&UserToken=' + RenderParam.userToken + '&ReturnUrl=' +
                        encodeURIComponent(RenderParam.returnEpgUrl);
                    window.location = goUrl;
                }else if (RenderParam.areaCode == '204') {
                    LMEPG.Log.info('RenderParam.lmp = '+RenderParam.lmp);
                    if(typeof(window.parent.iframeReturnUrl) == 'function'){
                        //河南3.0版本的返回大厅逻辑
                        window.parent.iframeReturnUrl();
                    }else{
                        LMEPG.Intent.back('IPTVPortal');
                    }
                } else if(RenderParam.areaCode == '216'){
                    //Page.jumpThirdPartySP('10000051');//2021-04-02 关闭跳转健康魔方入口
                    LMEPG.Intent.back('IPTVPortal');
                } else {
                    LMEPG.Intent.back('IPTVPortal');
                }
                break;
            case '210092': // 辽宁电信EPG
                // CS平台
                if (typeof (jsObj) !== 'undefined') {
                    var paramJson = JSON.stringify({
                        type: 0,
                        data: {},
                        spid: '39JK'
                    });
                    jsObj.eventFromJS(paramJson);
                }
                // BS平台
                else if (typeof (Authentication) !== 'undefined') {
                    var returnUri = Authentication.CTCGetConfig('telecom.return_uri');
                    if (!returnUri) {
                        returnUri = Authentication.CUGetConfig('telecom.return_uri');
                    }
                    LMEPG.Log.info("hold.js-->210092 returnUri:" + returnUri);
                    window.location.href = returnUri;
                } else {
                    LMEPG.Intent.back('IPTVPortal');
                }
                break;
            case '410092':
                // 处理河南电信EPG的返回
                HybirdCallBackInterface.quitActivity();
                break;
            default:
                LMEPG.Intent.back('IPTVPortal');
                break;
        }
    },

    /**
     * 页面跳转 - 根据配置项跳转对应的模块
     * @param configInfo
     */
    jumpModulePage: function (configInfo) {
        var objHome = LMEPG.Intent.createIntent('home');
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', '0');

        var objDst = {};
        switch (configInfo.entryType) {
            case '4':
                //视频分类
                // 更多视频，按分类进入
                objDst = LMEPG.Intent.createIntent('channel');
                objDst.setParam('userId', RenderParam.userId);
                objDst.setParam('page', '1');
                objDst.setParam('modeTitle', configInfo.title);
                objDst.setParam('modeType', configInfo.source_id);
                break;
            case '5':
                // 视频播放
                var videoObj = configInfo.play_url instanceof Object
                    ? configInfo.play_url
                    : JSON.parse(configInfo.play_url);
                var videoUrl = RenderParam.platformType == 'hd'
                    ? videoObj.gq_ftp_url
                    : videoObj.bq_ftp_url;

                // 创建视频信息
                var videoInfo = {
                    'sourceId': configInfo.sourceId,
                    'videoUrl': videoUrl,
                    'title': configInfo.title,
                    'type': configInfo.modelType,
                    'userType': configInfo.userType,
                    'freeSeconds': configInfo.freeSeconds,
                    'entryType': 1,
                    'entryTypeName': '挽留页',
                    'unionCode': configInfo.union_code
                };

                if (Hold.isAllowPlay(videoInfo)) {
                    Page.jumpPlayVideo(videoInfo);
                } else {
                    Page.jumpBuyVip(videoInfo.title, videoInfo);
                }
                return;
            case '13':
            case '33':
            case '39':
                //专辑(普通专辑、UI专辑、图文专辑)
                objDst = LMEPG.Intent.createIntent('album');
                objDst.setParam('userId', RenderParam.userId);
                objDst.setParam('albumName', configInfo.source_id);
                objDst.setParam('inner', 1);
                break;
            case '3':
                //活动
                objDst = LMEPG.Intent.createIntent('activity');
                objDst.setParam('userId', RenderParam.userId);
                objDst.setParam('activityName', configInfo.source_id);
                objDst.setParam('inner', 1);
                break;
            case '22':
                // 具体地址
                if (RenderParam.carrierId == '320092') {
                    var info = RenderParam.epgInfo;
                    var type = RenderParam.platformType == 'hd' ? 'HD' : 'SD';
                    var goUrl = configInfo.source_id + '&channel=' + type +
                        '&INFO=' + info;
                    window.location = goUrl;
                    return;
                }
                break;
            default:
                // 默认返回主页
                Page.jumpAppHome();
                return;
        }

        LMEPG.Intent.jump(objDst, objHome);
    },

    // 跳转到其他第三方sp
    jumpThirdPartySP: function (carrierId) {
        var objTestServer = LMEPG.Intent.createIntent('third-party-sp');
        objTestServer.setParam('userId', RenderParam.userId);
        objTestServer.setParam('carrierId', carrierId);
        objTestServer.setParam('isTest', '1');
        LMEPG.Cookie.setCookie("isHold",1)
        LMEPG.Intent.jump(objTestServer);
    },

    /**
     * 跳转 - 医生列表页(视频问诊)
     * @param id 焦点ID
     */
    jumpInquiryDoctorList: function () {
        // 如果是标清盒子和已经表明不支持的盒子，不支持视频问诊
        if (RenderParam.platformType === 'sd') {
            Page.jumpAppHome();
        } else {
            var objHome = LMEPG.Intent.createIntent('home');
            objHome.setParam('userId', RenderParam.userId);
            objHome.setParam('classifyId', '0');
            // 支持视频问诊，直接进入
            var objDoctorP2P = LMEPG.Intent.createIntent('doctorList');
            objDoctorP2P.setParam('userId', RenderParam.userId);

            LMEPG.Intent.jump(objDoctorP2P, objHome);
        }
    },

    /**
     * 跳转 - 应用首页
     */
    jumpAppHome: function () {
        var objHold = LMEPG.Intent.createIntent('hold');

        var objHome = LMEPG.Intent.createIntent('home');
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', '0');

        LMEPG.Intent.jump(objHome, objHold, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 页面跳转 - 跳转到播放器
     * @param videoInfo
     */
    jumpPlayVideo: function (videoInfo) {
        var objHome = LMEPG.Intent.createIntent('home');
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', '0');
        objHome.setParam('fromId', '2');
        objHome.setParam('focusIndex', '');

        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoUrl', videoInfo.videoUrl);
        objPlayer.setParam('lmcid', RenderParam.carrierId);
        objPlayer.setParam('videoInfo', videoInfo);

        LMEPG.Intent.jump(objPlayer, objHome);
    },

    /**
     * @func 进行购买操作
     * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
     * @returns {boolean}
     */
    jumpBuyVip: function (remark, videoInfo) {
        if (typeof (videoInfo) !== 'undefined' && videoInfo !== '') {
            var postData = {
                'videoInfo': JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI('Player/storeVideoInfo', postData,
                function (data) {
                });
        }
        var objHome = LMEPG.Intent.createIntent('home');
        objHome.setParam('userId', TP.userId);
        objHome.setParam('classifyId', '0');
        objHome.setParam('fromId', '1');
        objHome.setParam('focusIndex', '');
        objHome.setParam('page', '0');

        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('userId', RenderParam.userId);
        objOrderHome.setParam('isPlaying', 1);
        // objOrderHome.setParam("videoInfo", typeof(videoInfo) !== "undefined" && videoInfo != "" ? JSON.stringify(videoInfo) : "");
        objOrderHome.setParam('remark', remark);

        LMEPG.Intent.jump(objOrderHome, objHome);
    }

};

var buttons = [];
var Hold = {
    /**
     * 按钮点击事件
     * @param btn
     */
    onBtnClick: function (btn) {
        if (RenderParam.carrierId == '450094') {
            switch (btn.id) {
                case 'continue':
                    LMEPG.Intent.back();
                    break;
                case 'back':
                    Page.exitAppHome();
                    break;
            }
        } else if (RenderParam.carrierId === '000051' && RenderParam.areaCode ===
            '201') {
            switch (btn.id) {
                case 'continue':
                    if (RenderParam.tipsData[1].entryType === '9') {
                        // 当param.entryType=9时，表示去视频问诊
                        Page.jumpInquiryDoctorList();
                    } else {
                        Page.jumpAppHome();
                    }
                    break;
                case 'back':
                    onBack();
                    break;
            }
        } else {
            switch (btn.id) {
                case 'continue':
                    var param = RenderParam.tipsData[1]; // 更多精彩的内容，跳转
                    if (param.entryType != null && param.entryType != '' &&
                        param.entryType != '12') {
                        // 当param.entryType=12时，表示去健康视频首页
                        Page.jumpModulePage(param);
                    } else {
                        Page.jumpAppHome();
                    }
                    break;
                case 'back':
                    if (RenderParam.carrierId == "370092"){
                        // 调用探针接口上报数据 1:进入 2：退出
                        var postParams = {"action":2,"contentId": "EPG_GYLM"};
                        LMEPG.ajax.postAPI("System/clickContentInfo", postParams, function () {
                            Page.exitAppHome();
                        }, function () {
                            Page.exitAppHome();
                        });
                    }else {
                        onBack();
                    }
                    break;
            }
        }

    },

    /**
     * 推荐位被点击
     * @param btn
     */
    onRecommendClick: function (btn) {
        var configInfo = RenderParam.dataList[btn.cIndex];
        Page.jumpModulePage(configInfo);
    },

    /**
     * 推荐位焦点改变
     * @param btn
     * @param hasFocus
     */
    onRecommendFocusChange: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(G(btn.id), 'recommend_img_border');
        } else {
            LMEPG.CssManager.removeClass(G(btn.id), 'recommend_img_border');
        }
    },

    /**
     * 推荐位焦点移动前
     * @param dir
     * @param current
     */
    onRecommendBeforeMoveChange: function (dir, current) {
    },

    /**
     * 校验视频是否允许播放
     * @param videoInfo
     */
    isAllowPlay: function (videoInfo) {
        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            // vip用户可以观看
            return true;
        }

        if (videoInfo.userType == 0) {
            // 视频允许免费用户观看
            return true;
        }

        if (videoInfo.freeSeconds) {
            // 视频有免费观看时长
            return true;
        }

        return false;
    },

    /**
     * 创建推荐位视图
     */
    createRecommendView: function () {
        G('recommend_container').innerHTML = '';
        var html = '<div class="center">';
        for (var i = 0; i < RenderParam.dataList.length; i++) {
            var btnId = 'recommend_' + i;  //按钮ID
            html += '<img id=' + btnId + ' class="recommend_img" ' +
                ' src="' + RenderParam.fsUrl +
                RenderParam.dataList[i].image_url + '"';
            html += '</img>';
            var button = {
                id: btnId,
                name: '推荐位' + i,
                type: 'img',
                nextFocusLeft: i > 0 ? 'recommend_' + eval(i - 1) : 0,
                nextFocusRight: i < RenderParam.dataList.length - 1
                    ? 'recommend_' + eval(i + 1)
                    : i,
                nextFocusUp: '',
                nextFocusDown: 'continue',
                backgroundImage: RenderParam.fsUrl +
                    RenderParam.dataList[i].image_url,
                focusImage: '',
                click: Hold.onRecommendClick,
                focusChange: Hold.onRecommendFocusChange,
                beforeMoveChange: Hold.onRecommendBeforeMoveChange,
                moveChange: LMEPG.emptyFunc,
                cIndex: i
            };
            buttons.push(button);
        }
        html += '</div>';
        G('recommend_container').innerHTML = html;
    },

    /**
     *
     */
    updateBackground: function () {
        var background = RenderParam.platformType == 'hd'
            ?
            RenderParam.fsUrl + RenderParam.tipsData[2].onfocus_image_url
            : RenderParam.fsUrl + RenderParam.tipsData[2].onblur_image_url;
        G('splash').src = background;
    },

    /**
     * 初始化按钮
     */
    initButton: function () {
        var bgBackImg = RenderParam.fsUrl +
            RenderParam.tipsData[1].onfocus_image_url;
        var bgFBackImg = RenderParam.fsUrl +
            RenderParam.tipsData[1].onblur_image_url;
        var bgContinueImg = RenderParam.fsUrl +
            RenderParam.tipsData[0].onfocus_image_url;
        var bgFContinueImg = RenderParam.fsUrl +
            RenderParam.tipsData[0].onblur_image_url;
        var isContinueRight = true;
        switch (RenderParam.carrierId) {
            case '340092':
            case '450092':
                isContinueRight = false;
                break;
        }

        buttons.push({
            id: 'continue',
            name: '继续',
            type: 'img',
            nextFocusLeft: 'back',
            nextFocusRight: 'back',
            nextFocusUp: RenderParam.dataList.length > 0 ? 'recommend_0' : '',
            nextFocusDown: '',
            backgroundImage: bgBackImg,
            focusImage: bgFBackImg,
            click: Hold.onBtnClick,
            focusChange: LMEPG.emptyFunc,
            beforeMoveChange: LMEPG.emptyFunc,
            moveChange: LMEPG.emptyFunc,
            cIndex: 2
        });
        buttons.push({
            id: 'back',
            name: '残忍离开',
            type: 'img',
            nextFocusLeft: 'continue',
            nextFocusRight: 'continue',
            nextFocusUp: RenderParam.dataList.length > 0 ? 'recommend_0' : '',
            nextFocusDown: '',
            backgroundImage: bgContinueImg,
            focusImage: bgFContinueImg,
            click: Hold.onBtnClick,
            focusChange: LMEPG.emptyFunc,
            beforeMoveChange: LMEPG.emptyFunc,
            moveChange: LMEPG.emptyFunc,
            cIndex: 1
        });
    },

    /**
     * 导航栏初始化
     */
    init: function () {
        G('default_link').focus();
        if (RenderParam.carrierId == '650092') {
            onBack();
        }
        this.updateBackground();
        this.createRecommendView();
        this.initButton();
        if (RenderParam.carrierId == '450094' || RenderParam.carrierId == '340092') {
            // 默认焦点在“残忍拒绝”上
            LMEPG.ButtonManager.init('back', buttons, '', true);
        } else {
            LMEPG.ButtonManager.init('continue', buttons, '', true);
        }

    }
};

/**
 * 返回按键响应
 */
function onBack() {
    if(RenderParam.carrierId == '370092'){
        Page.jumpAppHome();
    }else if(RenderParam.carrierId == '440004') {
        quitBrowser();
    }else {
        Page.exitAppHome();
    }
}

var htmlBack = onBack;
