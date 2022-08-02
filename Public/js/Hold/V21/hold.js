var Page = {
    /**
     * 退出应用
     */
    exitAppHome: function () {
        switch (RenderParam.carrierId) {
            case '460092': // 海南电信
                if (RenderParam.fromLaunch == '1') {
                    Utility.setValueByName("exitIptvApp");
                } else {
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
                    window.top.jk39.back();
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
                var sourceId = configInfo.sourceId == undefined ? configInfo.source_id : configInfo.sourceId;
                // 创建视频信息
                var videoInfo = {
                    'sourceId': sourceId,
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
            case '55':
                //山东电信 跳转健康生活
                objDst = LMEPG.Intent.createIntent('healthLive');
                objDst.setParam('userId', RenderParam.userId);
                objDst.setParam('inner', 1);
                break;
            case '56':
            case '57':
                //山东电信 跳转中老年健康
                objDst = LMEPG.Intent.createIntent('channel');
                objDst.setParam('userId', RenderParam.userId);
                objDst.setParam('modeType', configInfo.entryType == '56' ? 2 : 1);     //1:宝贝天地、2:中老年健康
                objDst.setParam('modeTitle', configInfo.entryType == '56' ? '中老年健康' : '宝贝天地');     //1:宝贝天地、2:中老年健康
                objDst.setParam('inner', 1);
                break;
            default:
                // 默认返回主页
                Page.jumpAppHome();
                return;
        }

        LMEPG.Intent.jump(objDst, objHome);
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
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

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
    INDEX: 1,
    MAX_SIZE: 3,
    CURRENT_PAGE: 1,
    CURRENT_DATA: "",
    // defaultFocusId: RenderParam.focusIndex,

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
                    if (RenderParam.carrierId == "370092") {
                        // 调用探针接口上报数据 1:进入 2：退出
                        var postParams = {"action": 2, "contentId": "EPG_GYLM"};
                        LMEPG.ajax.postAPI("System/clickContentInfo", postParams, function () {
                            Page.exitAppHome();
                        }, function () {
                            Page.exitAppHome();
                        });
                    } else {
                        onBack();
                    }
                    break;
            }
        }

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
        switch (dir) {
            case "right":
                if (current.id == "recommend_2") {
                    Hold.nextPge();
                    LMEPG.BM.requestFocus("recommend_2");
                    return false;
                }
                break;
            case "left":
                if (current.id == "recommend_0") {
                    Hold.prevPge();
                    LMEPG.BM.requestFocus("recommend_0");
                    return false;
                }
                break;
        }
    },

    //上一页
    prevPge: function () {
        if (Hold.CURRENT_PAGE > 1) {
            Hold.CURRENT_PAGE--;
            Hold.createList();
        }
    },
    //下一页
    nextPge: function () {
        if (Hold.CURRENT_PAGE < RenderParam.dataList.length - Hold.MAX_SIZE + 1) {
            Hold.CURRENT_PAGE++;
            Hold.createList();
        }
    },

    cut: function (data, page, max) {
        return data.slice(page - 1, page - 1 + max);
    },

    //轮循提取数据，page=0为划分，0为第一页
    cutData: function (data, page, len) {
        var ArrData = [];
        var startPos = 0;
        if (page > 0) {
            startPos = page % (data.length - 1);
        } else {
            var pos = Math.abs(page) % data.length;
            if (pos == 0) {
                startPos = 0;
            } else {
                startPos = data.length - pos;
            }
        }

        for (var i = 0; i < len; i++) {
            ArrData[i] = data[startPos];
            startPos++;
            if (startPos >= data.length) {
                startPos = 0;
            }
        }
        return ArrData;
    },

    // 加载推荐位图片
    createList: function () {
        var currentData = Hold.cut(Hold.CURRENT_DATA, Hold.CURRENT_PAGE, Hold.MAX_SIZE);

        if (currentData.length > 0) {
            G('recommend_container').innerHTML = '';
            var html = '';
            if (currentData.length >= 3) {
                html = '<div class="center">';
            } else if (currentData.length == 2) {
                html = '<div class="centert">';
            } else if (currentData.length == 1) {
                html = '<div class="centero">';
            }

            html += '<div id="recommend-list">';
                for (var i = 0; i < currentData.length; i++) {
                    var btnImgId = 'recommend_img_' + i;  //按钮ID
                    var btnTitleId = 'recommend_title_' + i;
                    if (currentData[i].title) {
                        currentData[i].title = currentData[i].title.replace(/\s+/g, ',');
                    }
                    var data_json = JSON.stringify(currentData[i]);
                    html += '<div id = '+ '"recommend_' + i + '">';
                        html += '<img id=' + btnImgId + ' class="recommend_img" ' + 'data_json=' + data_json + ' src="' + RenderParam.fsUrl + currentData[i].image_url + '"';
                        html += '</img>';
                        html += '<p id=' + btnTitleId + ' class="recommend_title" >' + currentData[i].title;
                        html += '</p>';
                    html += '</div>';
                }
                html += '</div>';
            html += '</div>';
            G('recommend_container').innerHTML = html;
        }
        Hold.upDateArrow()
    },


    /**
     *加载背景图片
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
            name: '精彩继续',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'back',
            nextFocusUp: '',
            nextFocusDown: RenderParam.dataList.length > 0 ? 'recommend_0' : '',
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
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: RenderParam.dataList.length > 0 ? 'recommend_0' : '',
            backgroundImage: bgContinueImg,
            focusImage: bgFContinueImg,
            click: Hold.onBtnClick,
            focusChange: LMEPG.emptyFunc,
            beforeMoveChange: LMEPG.emptyFunc,
            moveChange: LMEPG.emptyFunc,
            cIndex: 1
        });

        buttons.push({
            id: 'recommend_0',
            name: '推荐位1',
            type: 'div',
            nextFocusLeft: "",
            nextFocusRight: "recommend_1",
            nextFocusUp: 'continue',
            nextFocusDown: '',
            click: Hold.onRecommendClick,
            backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath+'/Public/img/sd/Unclassified/V21/video_f.png' : g_appRootPath+'/Public/img/hd/Player/V21/video_f.png',
            // focusChange: Hold.onRecommendFocusChange,
            beforeMoveChange: Hold.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIndex: 0
        });
        buttons.push({
            id: 'recommend_1',
            name: '推荐位2',
            type: 'div',
            nextFocusLeft: "recommend_0",
            nextFocusRight: "recommend_2",
            nextFocusUp: 'continue',
            nextFocusDown: '',
            click: Hold.onRecommendClick,
            backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ?g_appRootPath+ '/Public/img/sd/Unclassified/V21/video_f.png' :g_appRootPath+ '/Public/img/hd/Player/V21/video_f.png',
            // focusChange: Hold.onRecommendFocusChange,
            beforeMoveChange: Hold.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIndex: 1
        });
        buttons.push({
            id: 'recommend_2',
            name: '推荐位3',
            type: 'div',
            nextFocusLeft: "recommend_1",
            nextFocusRight: "",
            nextFocusUp: 'continue',
            nextFocusDown: '',
            click: Hold.onRecommendClick,
            backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath+'/Public/img/sd/Unclassified/V21/video_f.png' : g_appRootPath+'/Public/img/hd/Player/V21/video_f.png',
            // focusChange: Hold.onRecommendFocusChange,
            beforeMoveChange: Hold.onRecommendBeforeMoveChange,
            moveChange: LMEPG.emptyFunc,
            cIndex: 2
        });
    },
    upDateArrow: function () {
        if (Hold.CURRENT_PAGE < RenderParam.dataList.length - Hold.MAX_SIZE + 1) {
            G("next_page").style.display = "block";
        } else {
            G("next_page").style.display = "none";
        }

        if (Hold.CURRENT_PAGE > 1) {
            G("prev_page").style.display = "block";
        } else {
            G("prev_page").style.display = "none";
        }
    },

    /**
     * 导航栏初始化
     */
    init: function () {
        Hold.CURRENT_DATA = RenderParam.dataList;
        if (RenderParam.carrierId == '650092') {
            onBack();
        }
        Hold.updateBackground();
        Hold.createList();
        Hold.initButton();
        LMEPG.ButtonManager.init('continue', buttons, '', true);
    }
};

/**
 * 返回按键响应
 */
function onBack() {
    if (RenderParam.carrierId == '370092') {
        Page.jumpAppHome();
    } else if (RenderParam.carrierId == '07430093') {
        Webview.closeBrowser("退出芒果健康");
    } else {
        Page.exitAppHome();
    }
}

var htmlBack = onBack;
