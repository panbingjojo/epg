var activeBtnId = 'tab-home';
var domTabBtn = G('nav').children;
var domContentBtn = G('container-right').children;
var fileIndex = g_appRootPath + '/Public/img/hd/New39hospital/';
var expertPage = 0;
var guidePage = 0;
var casePage = 0;
var platformType = 'hd';
var currentTab = 'home';                  //当前选中的导航栏（不一定当前获得焦点）
var currentVideoInde = 0;                 //当前播放视频的index
var playPosition;                         //当前播放视频的位置，从videoPosition获取
var domBodyImg = G('bodyImg');                           //有镂空的背景
var domBodyDefaultImg = G('bodyDefaultImg');                   //无镂空的背景

//焦点移动、视频播放处理
var buttons = [
    {
        id: 'tab-home',
        name: '首页',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: 'tab-experts',
        defaultImage: fileIndex + 'home.png',
        focusImage: fileIndex + 'home_hover.png',
        activeImage: fileIndex + 'home_active.png',
        bigImg: '',
        focusChange: onFocus,
        click: enterFocusKey,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    }, {
        id: 'tab-experts',
        name: '顶级专家',
        type: 'img',
        nextFocusUp: 'tab-home',
        nextFocusDown: 'tab-guide',
        defaultImage: fileIndex + 'experts.png',
        focusImage: fileIndex + 'experts_hover.png',
        activeImage: fileIndex + 'experts_active.png',
        active: false,
        focusChange: onFocus,
        click: enterFocusKey,
        beforeMoveChange: onBeforeMoveChange
    }, {
        id: 'tab-guide',
        name: '就诊指南',
        type: 'img',
        nextFocusUp: 'tab-experts',
        nextFocusDown: 'tab-case',
        defaultImage: fileIndex + 'guide.png',
        focusImage: fileIndex + 'guide_hover.png',
        activeImage: fileIndex + 'guide_active.png',
        active: false,
        focusChange: onFocus,
        click: enterFocusKey,
        beforeMoveChange: onBeforeMoveChange
    }, {
        id: 'tab-case',
        name: '患者案例',
        type: 'img',
        nextFocusUp: 'tab-guide',
        nextFocusDown: 'tab-order',
        defaultImage: fileIndex + 'case.png',
        focusImage: fileIndex + 'case_hover.png',
        activeImage: fileIndex + 'case_active.png',
        active: false,
        focusChange: onFocus,
        click: enterFocusKey,
        beforeMoveChange: onBeforeMoveChange
    }, {
        id: 'tab-order',
        name: '立即咨询按钮',
        type: 'img',
        nextFocusUp: 'tab-case',
        defaultImage: fileIndex + 'order.png',
        focusImage: fileIndex + 'order_hover.png',
        activeImage: fileIndex + 'order_hover.png',
        focusChange: onFocus,
        click: enterFocusKey,
        beforeMoveChange: onBeforeMoveChange
    }, {
        id: 'container-right',
        name: '右边内容视图',
        type: 'img',
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange
    }];

/**
 * 处理首页轮播
 * @type {{}}
 */
var Play = {

    // 启动小窗播放
    startPollPlay: function () {
        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        Play.stopPlay();

        var videoUrl = Play.getCurrentPollVideoUrl(); //播放地址
        playPosition = Play.getVideoPosition();     //获取视频播放位置
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
            case '440094':
                this.play440094(videoUrl);
                break;
            default:
                this.defaultPlay();
                break;
        }
    },

    stopPlay: function () {
        LMEPG.mp.destroy();
    },

    pausePlay: function () {
        LMEPG.mp.pause();
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
            'entryType': 1,
            'entryTypeName': '首页轮播视频'
        };

        Page.jumpPlayVideo(videoInfo);
    },

    /**
     * 得到当前轮播地址
     */
    getCurrentPollVideoUrl: function () {
        var videoUrl;
        if (currentTab == 'home') {
            if (hospitalData.home.video.length > currentVideoInde + 1) {
                currentVideoInde = 0;
            }
            videoUrl = hospitalData.home.video[currentVideoInde];
        } else {
            if (hospitalData.guide[0].video.length > currentVideoInde + 1) {
                currentVideoInde = 0;
            }
            videoUrl = hospitalData.guide[0].video[currentVideoInde];
        }
        return videoUrl;
    },

    getVideoPosition: function () {
        if (currentTab == 'home') {
            return hospitalData.home.videoPosition;
        } else {
            return hospitalData.guide[0].videoPosition;
        }
    },

    /**
     * 得到当前轮播数据对象
     * @returns {*}
     */
    getCurrentPollVideoData: function () {

        return RenderParam.homePollVideoList.list[Play.currPollVideoId];
    },

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
                switch (model) {
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
            currentVideoInde++;
            startPollPlay();
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
        //回调函数
        var callback = function (isSuccess, data) {
            if (isSuccess) {
                //初始化播放器
                LMEPG.mp.initPlayer().playOfSmallscreen(data, playPosition[0], playPosition[1], playPosition[2], playPosition[3]);
                //获取视频信息
                Play.getVideoInfo440094(titleAssetId);
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
        //回调函数
        var callback = function (isSuccess, data) {
            if (isSuccess) {
                // data.progTimeLength;//保存视频总时长
                //启动播放
                LMEPG.mp.play();
            } else {
                LMEPG.UI.showToast(data, 5);
                LMEPG.mp.destroy();
            }
        };
        window.UtilsWithGDGD.getVideoInfo(titleAssetId, callback);
    }
};


function initStyle() {
    for (var k = 0; k < domContentBtn.length; k++) {
        var _thisBtn = domTabBtn[k];
        var _thisBg = buttons[k].defaultImage;
        var _thisColor = '#fff';
        setStyle(_thisBtn, _thisBg, _thisColor);
        setdDisplay(domContentBtn[k], 'none');
    }
    setdDisplay(domContentBtn[0], 'block');
    LMEPG.ButtonManager.init('tab-home', buttons, '', true);
}


/** 结束页面 */
window.onunload = function () {
    LMEPG.mp.destroy();
};

/**
 * 焦点移动后的操作
 */
function onBeforeMoveChange(direction, current) {
    var nextBtn = LMEPG.BM.getNearbyFocusButton(direction, current.id);
    switch (direction) {
        case 'up':
            if (current.id == 'tab-home' || current.id == 'tab-experts' || current.id == 'tab-guide' || current.id == 'tab-case') {
                enterFocusKey(nextBtn);
                return false;
            }
            moveUp(current);
            if (current.id != 'tab-home') {
                setActiveStyle();
            }
            break;
        case 'down':
            if (current.id == 'tab-home' || current.id == 'tab-experts' || current.id == 'tab-guide' || current.id == 'tab-case') {
                enterFocusKey(nextBtn);
                return false;
            }
            moveDown(current);
            if (current.id != 'tab-case') {
                setActiveStyle();
            }
            break;
        case 'left':
            moveLeft(current);
            break;
        case 'right':
            moveRight(current);
            break;
    }
}

//焦点上移
function moveUp(current) {
    var Condition = {
        C1: activeBtnId === 'tab-guide',
        C2: expertPage >= 1,
        C3: current.id === 'container-right',
        C4: current.id !== 'container-right',
        C5: current.id !== 'tab-home',
        C6: activeBtnId === 'tab-experts',
        C7: activeBtnId === 'tab-case'
    };
    if (Condition.C4 && Condition.C5) {
        moveFocus();
    } else if (Condition.C2 && Condition.C5 && Condition.C6) {
        expertPage -= 1;
        expertsTopView(expertPage);
        setStyle(G('experts-img'), hospitalData.experts[expertPage].imgUrl);
        arrow();
    } else if (Condition.C1 && guidePage === 1 && Condition.C3) {
        guidePage -= 1;
        if (guidePage === 0) {
            showDefaultBg(false);
        } else {
            showDefaultBg(true);
        }
        guideSickView(guidePage);
        arrow();
    } else if (Condition.C7 && casePage > 0 && Condition.C3) {
        casePage -= 1;
        caseSickView(casePage);
        arrow();
    }
}

//焦点下移
function moveDown(current) {

    var Condition = {
        C1: activeBtnId === 'tab-experts',
        C2: expertPage <= hospitalData.experts.length - 2,
        C3: current.id === 'container-right',
        C4: current.id !== 'container-right',
        C5: current.id !== 'tab-case',
        C6: expertPage === hospitalData.experts.length - 2,
        C7: activeBtnId === 'tab-case',
        C8: activeBtnId === 'tab-guide'
    };

    if (Condition.C4 && Condition.C5) {
        //判断在最下面，不做任何操作
        moveFocus();
    } else if (Condition.C1 && Condition.C2 && Condition.C3) {
        expertPage += 1;
        expertsTopView(expertPage);
        arrow();
    } else if (activeBtnId === 'tab-guide' && guidePage === 0 && Condition.C3) {
        guidePage += 1;
        if (guidePage === 0) {
            showDefaultBg(false);
        } else {
            showDefaultBg(true);
            setStyle(G('content-guide'), '');
        }
        guideSickView(guidePage);
        arrow();
    } else if (activeBtnId === 'tab-case' && casePage < hospitalData.case.images.length - 1 && Condition.C3) {
        casePage += 1;
        caseSickView(casePage);
        arrow();
    }
}

//焦点左移
function moveLeft(current) {
    if (current.id === 'container-right') {
        LMEPG.ButtonManager.getButtonById(current.id).nextFocusLeft = activeBtnId;
        var _rightViewId = 'content-' + activeBtnId.slice(4);
        setStyle(G(_rightViewId), '');
    }
}

//焦点右移
function moveRight(current) {
    if (current.id == activeBtnId && current.id != 'tab-home' && current.id != 'tab-order') {
        LMEPG.ButtonManager.requestFocus('container-right');
        var left_focus = 'content-' + activeBtnId.slice(4);
        var left_focus_bg = fileIndex + activeBtnId.slice(4) + '_selected.png';
        setStyle(G(left_focus), left_focus_bg);

    }
    if (guidePage == 1) {
        setStyle(G('content-guide'), '');

    }
}

//箭头指示
function arrow() {
    setdDisplay(G('pre-arrow'), 'block');
    setdDisplay(G('next-arrow'), 'block');
    var config = {
        A1: activeBtnId === 'tab-experts',
        A2: expertPage === 0,
        A3: expertPage === hospitalData.experts.length - 1,
        A4: activeBtnId === 'tab-guide',
        A5: guidePage === 0,
        A6: guidePage === hospitalData.guide.length - 1,
        A7: activeBtnId === 'tab-case',
        A8: casePage === 0,
        A9: casePage === hospitalData.case.images.length - 1
    };

    switch (true) {
        case config.A1 && config.A2:
            setdDisplay(G('pre-arrow'), 'none');
            break;
        case config.A1 && config.A3:
            setdDisplay(G('next-arrow'), 'none');
            break;
        case config.A4 && config.A5:
            setdDisplay(G('pre-arrow'), 'none');
            break;
        case config.A4 && config.A6:
            setdDisplay(G('next-arrow'), 'none');
            break;
        case config.A7 && config.A8:
            setdDisplay(G('pre-arrow'), 'none');
            break;
        case config.A7 && config.A9:
            setdDisplay(G('next-arrow'), 'none');
            break;
        default:
            setdDisplay(G('pre-arrow'), 'block');
            setdDisplay(G('next-arrow'), 'block');
            break;

    }
}

//焦点保持样式
function setActiveStyle() {
    var activeName = activeBtnId.slice(4);
    var activeImg = fileIndex + activeName + '_active.png';
    setStyle(G(activeBtnId), activeImg, '#000');
}

/**
 *  是否显示默认背景
 */
function showDefaultBg(isShowDefaultBg) {
    if (isShowDefaultBg) {
        domBodyImg.style.display = 'none';
        domBodyDefaultImg.style.display = 'block';
    } else {
        domBodyImg.style.display = 'block';
        domBodyDefaultImg.style.display = 'none';
    }
}

/**
 * 样式切换
 * */
function setStyle(el, bgVal, colorVal) {
    if (!LMEPG.Func.isEmpty(el)) {
        el.style.backgroundImage = 'url(' + bgVal + ')';
        el.style.color = colorVal;
    }
}


/**
 * 焦点移动操作
 */
function moveFocus() {

    for (var i = 0; i < domTabBtn.length; i++) {

        var cutName = domTabBtn[i].id.slice(4);
        var imgUrl = fileIndex + cutName + '.png';
        setStyle(domTabBtn[i], imgUrl, '#fff');
    }

}

/**
 * 获取焦点后操作
 * */
function onFocus(btn, hasFocus) {

    var pdname = btn.id.slice(0, 3);
    if (hasFocus == true && pdname === 'tab') {
        setStyle(G(btn.id), btn.focusImage, '#000');
    } else {

    }
}

/**
 * 键入焦点操作
 * */

function enterFocusKey(btn) {

    activeBtnId = btn.id; //初始化保持焦点
    var _tabBtn = domTabBtn,
        _contentBtn = domContentBtn,
        _activeBg = btn.activeImage,
        _selectedExpertBg = fileIndex + 'experts_selected.png',
        _selectedGuideBg = fileIndex + 'guide_selected.png',
        _selectedCaseBg = fileIndex + 'case_selected.png';
    if (btn.id === 'tab-home' || btn.id === 'tab-guide') {
        showDefaultBg(false);
    } else {
        showDefaultBg(true);

    }
    //tab样式初始化
    var initContentShow = function () {
        for (var i = 0; i < _tabBtn.length; i++) {
            var siblingDom = _tabBtn[i].id.slice(4);
            var bgDefaultVal = fileIndex + siblingDom + '.png';

            setStyle(_tabBtn[i], bgDefaultVal, '#fff');

            var _thisContent = _tabBtn[i].index = i;
            //设置对应按钮的view显示
            if (_tabBtn[i].id === btn.id) {
                for (var k = 0; k < _contentBtn.length; k++) {

                    setdDisplay(_contentBtn[k], 'none');
                }
                setdDisplay(_contentBtn[_thisContent], 'block');
            }
        }
        setStyle(G(btn.id), _activeBg, '#000');
    }();


    //焦点右移到view
    switch (btn.id) {
        case 'tab-home':
            setdDisplay(G('pre-arrow'), 'none');
            setdDisplay(G('next-arrow'), 'none');
            homeView();
            currentTab = 'home';
            currentVideoInde = 0;
            Play.startPollPlay();
            LMEPG.ButtonManager.requestFocus('tab-home');
            break;
        case 'tab-experts':
            Play.pausePlay();
            LMEPG.ButtonManager.requestFocus('container-right');
            expertsTopView(expertPage = 0);
            setStyle(G('content-experts'), _selectedExpertBg, '#000');
            arrow();
            currentTab = 'experts';
            break;
        case 'tab-guide':
            LMEPG.ButtonManager.requestFocus('container-right');
            guideSickView(guidePage);
            if (guidePage === 1) {
                showDefaultBg(true);
            }
            arrow();
            currentTab = 'guide';
            currentVideoInde = 0;
            break;
        case 'tab-case':
            Play.pausePlay();
            LMEPG.ButtonManager.requestFocus('container-right');
            caseSickView(casePage);
            setStyle(G('content-case'), _selectedCaseBg, '#000');
            arrow();
            currentTab = 'case';
            break;
        case 'tab-order':
            Play.pausePlay();
            setdDisplay(G('pre-arrow'), 'none');
            setdDisplay(G('next-arrow'), 'none');
            orderAskView();
            break;
    }
}

function setdDisplay(el, val) {
    return el.style.display = val;
}

/* ====================视图层======================*/

/**
 * 首页视图
 * */
function homeView() {

    var homeData = hospitalData.home;
    var homeViewHtml =
        '<div id="content-home-title">' + homeData.title.firstTitle
        + '<span id="content-home-title-desc">' + homeData.title.secondTitle + '</span>' +
        '</div>' +
        '<div id="content-home-video">' +
        '   <if condition="hd">' +
        '<div id="smallvod" style="left:1px; top:1px; width:200px; height:200px; position:absolute;">' +
        '<iframe id="smallscreen" frameborder="0" scrolling="no" style="width: 500px;height: 500px"></iframe>' +
        '</div>' +
        '<else/>' +
        '</if>' +
        // '<video src="' + RenderParam.platformType + '/Application/Home/View/New39hospital/V1/movie.ogg" autoplay="autoplay" controls="controls" width="100%" height="100%">1</video>' +
        '</div>';
    G('content-home').innerHTML = homeViewHtml;

    showDefaultBg(false);
}

/**
 * 顶级专家视图
 * */
function expertsTopView(expertPage) {
    var data = hospitalData.experts;
    var expertsTopViewHtml =
        '        <div id="experts-img" style="background-image: url(' + data[expertPage].imgUrl + ')"></div>' +
        '        <ul id="experts-introduce">' +
        '        <li>' +
        '        <span id="expert-name">' + data[expertPage].name + '</span>' +
        '        <span id="expert-title">' + data[expertPage].title + '</span>' +
        '        </li>' +
        '        <li id="expert-hospital" class="expert-info">' + data[expertPage].hospital + '</li>' +
        '        <li id="expert-job" class="expert-info">' + data[expertPage].job + '</li>' +
        '        <li id="expert-Specialty" class="expert-info">' + data[expertPage].specialty + '</li>' +
        '        <li id="expert-detail" class="expert-info">' + data[expertPage].detail + '</li>' +
        '        </ul>' +
        '        <div id="expert-num">' + (expertPage + 1) + '/' + data.length + '</div>';
    G('content-experts').innerHTML = expertsTopViewHtml;

}

/**
 * 就诊指南视图
 * */
function guideSickView() {
    var dataGuide = hospitalData.guide;
    var guideText = hospitalData.guide[1].introduce;
    var guideViewHtml;
    guidePage === 0 ? setStyle(G('content-guide'), fileIndex + 'guide_selected.png', '#000') : setStyle(G('content-guide'), '');
    if (guidePage === 0) {
        guideViewHtml = '';
        Play.startPollPlay();
    } else if (guidePage === 1) {
        Play.pausePlay();
        guideViewHtml = '<div class="guide-title">' + guideText.topTitle +
            '    <span class="guide-title-right">' + guideText.introDesc + '</span></div>' +
            '    <img id="guide-img" src= "' + guideText.imgUrl + '" alt="就诊指南介绍背景"/>' +
            '    <div class="answer-guide-q">' +
            '    <p style="font-size: 18px;padding-bottom: 10px">' + guideText.text.title + '</p>';
        var afterText = [];
        for (var i = 0; i < guideText.text.content.length; i++) {
            if (i < 3) {
                guideViewHtml += '<p class="guide-desc">' + guideText.text.content[i] + '</p>';
            } else {

                afterText.push(guideText.text.content[i]);
            }

        }
        guideViewHtml += '<div class="afterThreeText">';
        for (var j = 0; j < afterText.length; j++) {
            guideViewHtml += '<p class="guide-desc">' + afterText[j] + '</p>';
        }
    }
    guideViewHtml += '</div>' + '</div>';
    G('content-guide-video').innerHTML = guideViewHtml;
}

/**
 * 患者案例视图
 * */
function caseSickView(casePage) {
    var dataCase = hospitalData.case.images;
    var caseViewHtml = '<p class="static-title">把健康还给你 - 身边人，身边事 <span class="static-title-child">患者案例介绍</span></p>' +
        '                   <div id="case-img" style="background-image: url(' + dataCase[casePage].imgUrl + ')">' +
        '                   <div class="case-picture-title">' + dataCase[casePage].title + '</div>    ' +
        '                   </div>' +
        '                   <div id="case-num">' + (casePage + 1) + '/' + dataCase.length + '</div>';
    G('content-case-video').innerHTML = caseViewHtml;

}

/**
 * 立即咨询视图
 * */
function orderAskView() {
    var dataOrder = hospitalData.order.images;
    var orderViewHtml = '<img id="order-img" src= "' + dataOrder[0] + '" alt="就诊指南介绍背景"/>';
    G('content-order-img').innerHTML = orderViewHtml;
}

//虚拟按键触发，轮询播放
LMEPG.ButtonManager.init('', buttons, '', true);
LMEPG.KeyEventManager.addKeyEvent(
    {
        EVENT_MEDIA_END: Play.onPlayEvent,	        //视频播放结束
        EVENT_MEDIA_ERROR: Play.onPlayEvent,        //视频播放错误
        KEY_VOL_UP: Play.onPlayEvent,
        KEY_VOL_DOWN: Play.onPlayEvent
    });

/**
 * 返回事件
 */
function onBack() {
    LMEPG.Intent.back();
}
