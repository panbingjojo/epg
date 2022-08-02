/**
 * 渲染页面
 * @type {{}}
 */
var tab0MockDate = {
    // 导航页
    nav_content: {
        imgSrc: [],
        imgLink: [],

        // 动态初始化导航
        __init: function () {
            switch (RenderParam.carrierId) {
                default:
                    for (var i = 0, len = RenderParam.navConfig.length; i < len; i++) {
                        this.imgLink[i] = '#' + (i + 1);
                        this.imgSrc[i] = '';
                        try {
                            var item = RenderParam.navConfig[i];
                            var imgObj = JSON.parse(item.img_url);
                            this.imgSrc[i] = RenderParam.fsUrl + imgObj.normal;
                        } catch (e) {
                            console.error('[V7/home.js]---[nav_content#__init()]--->Exception: ' + e.toString());
                            LMEPG.Log.error('[V7/home.js]---[nav_content#__init()]--->Exception: ' + e.toString());
                        }
                    }
                    break;
            }
        }
    },

    // 左侧：夜间药扇、39精选、近期专辑
    left_content: {
        imgSrc: [RenderParam.fsUrl + RenderParam.recommentData6[0].img_url, RenderParam.fsUrl + RenderParam.recommentData7[0].img_url, RenderParam.fsUrl + RenderParam.recommentData8[0].img_url, RenderParam.fsUrl + RenderParam.recommentData9[0].img_url],
        imgLink: ['#1', '#2', '#3', '#4']
    },

    // 中间的3个（1号推荐位、5号推荐位、4号推荐位）
    center_content: {
        carousel: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData1[0].img_url, RenderParam.fsUrl + RenderParam.recommentData1[1].img_url, RenderParam.fsUrl + RenderParam.recommentData1[2].img_url, RenderParam.fsUrl + RenderParam.recommentData1[3].img_url, RenderParam.fsUrl + RenderParam.recommentData1[4].img_url],
            imgLink: ['#1', '#2', '#3', '#4', '#5']
        },
        center_other: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData5[0].img_url, RenderParam.fsUrl + RenderParam.recommentData4[0].img_url],
            imgLink: ['']
        }
    },

    // 右侧：3号推荐位，2号推荐位(视频轮播)
    right_content: {
        rightLink1: {
            imgSrc: RenderParam.fsUrl + RenderParam.recommentData3[0].img_url,
            imgLink: ['#1']
        },
        rightLink2: {
            imgSrc: [],
            imgLink: []
        }
    },

    /**
     * 动态数据控制与绑定
     */
    initAllFirst: function () {
        this.nav_content.__init();
    }
};

var Home = {
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
    }
};

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        EVENT_MEDIA_END: Play.onPlayEvent,
        EVENT_MEDIA_ERROR: Play.onPlayEvent,
        KEY_VOL_UP: Play.onPlayEvent,
        KEY_VOL_DOWN: Play.onPlayEvent,
        KEY_3: Home.onKeyDown
    }
);

var carouselTimer = null;
var renderHomePage = {
    init: function () {
        tab0MockDate.initAllFirst();
        this.staticHtml();
        this.configurableHtml();
        this.carousel();
        carouselTimer = setInterval(renderHomePage.loop, 2000);
        LMEPG.ButtonManager.init(RenderParam.focusIndex, buttons, '', true);
        BtnCtrl.onFocusChange_NavBar('nav-1');
        // 启动小窗口播放
        Play.startPollPlay();
    },
    carousel: function () {
        var n = 0;
        var status = 0;
        var carousel = document.getElementsByClassName('carousel');
        var point = document.getElementById('point').children;

        this.loop = function () {
            n === 4 ? status = 1 : (n === 0 ? status = 0 : null);
            n = status === 0 ? Math.min(4, n += 1) : Math.max(0, n -= 1);
            for (var i = 0; i < carousel.length; i++) {
                carousel[i].className = 'carousel';
                point[i].className = '';
            }
            carousel[n].className += ' active';
            point[n].className += ' currentImg';
        };
    },

    staticHtml: function () {
        /**
         * 渲染主题背景
         */
        function renderThemeUI() {
            var themeImage = 'url(\'' + g_appRootPath + '/Public/img/' + RenderParam.platformType
                + '/Common/' + RenderParam.commonImgsView + '/bg_home_play.png\')'; // 默认背景
            if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== '') {
                themeImage = 'url(' + RenderParam.fsUrl + RenderParam.themeImage + ')';
            }
            G('home_container').style.backgroundImage = themeImage;
        }

        var navItem = function () {
            var htm = '';
            for (var i = 0; i < tab0MockDate.nav_content.imgSrc.length; i++) {
                htm += '<img id="nav-' + (+i + 1) + '" data-link=' + tab0MockDate.nav_content.imgLink[i] + ' src="' + tab0MockDate.nav_content.imgSrc[i] + '" alt="">';
            }
            G('nav').innerHTML = htm;
        };
        renderThemeUI();
        navItem();
    },
    configurableHtml: function () {
        // 左边
        var leftHtml = function () {
            var leftData = tab0MockDate.left_content;
            var htm = '<img id="night-medicine" src="' + leftData.imgSrc[0] + '" alt="" data-Link=' + leftData.imgLink[0] + '>';
            htm += '<img id="39-featured" src="' + leftData.imgSrc[1] + '" alt="" data-Link=' + leftData.imgLink[1] + '>';
            htm += '<img id="history-album" src="' + leftData.imgSrc[2] + '" alt="" data-Link=' + leftData.imgLink[2] + '>';
            htm += '<img id="free-area" src="' + leftData.imgSrc[3] + '" alt="" data-Link=' + leftData.imgLink[3] + '>';
            G('container-left').innerHTML = htm;
        };

        // 中间位置 1号推荐位
        var centerHtml = function () {
            var centerData = tab0MockDate.center_content;
            var carouselData = centerData.carousel;
            var centerOtherData = centerData.center_other;
            var carouselHtm = '<div id="carousel-wrapper">';
            carouselHtm += '<img class="carousel active" src=' + carouselData.imgSrc[0] + ' data-Link="0" alt="">';
            carouselHtm += '<img class="carousel" src="' + carouselData.imgSrc[1] + '" data-Link="1" alt="">';
            carouselHtm += '<img class="carousel" src="' + carouselData.imgSrc[2] + '" data-Link="2" alt="">';
            carouselHtm += '<img class="carousel" src="' + carouselData.imgSrc[3] + '" data-Link="3" alt="">';
            carouselHtm += '<img class="carousel" src="' + carouselData.imgSrc[4] + '" data-Link="4" alt="">';
            carouselHtm += '<ul id="point">';
            carouselHtm += '<li id="point-1" class="currentImg">';
            carouselHtm += '<li>';
            carouselHtm += '<li>';
            carouselHtm += '<li>';
            carouselHtm += '<li>';
            G('center-link-1').innerHTML = carouselHtm;
            var centerOtherHtm = '';
            centerOtherHtm += '<img id="book-registration" src="' + centerOtherData.imgSrc[0] + '" alt="">';
            centerOtherHtm += '<img id="do-smile-people" src="' + centerOtherData.imgSrc[1] + '" alt="">';
            G('book-and-smile').innerHTML = centerOtherHtm;
        };
        // 右边
        var rightHtml = function () {
            var rightData = tab0MockDate.right_content;
            //var pollVideoData = Play.getCurrentPollVideoData();
            var htm = '';
            htm += '<iframe id="iframe_small_screen" src="" frameborder="0"></iframe>';
            /*if (RenderParam.carrierId === "510094" && LMEPG.Func.isObject(pollVideoData)) {
                // htm += '<img id="videoTv-link" src="' + (RenderParam.fsUrl + pollVideoData.imgUrl) + '">';//TODO 使用推荐视频封面图（暂保留）
                htm += '<img id="videoTv-link" src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V7/tab0/home_pos_2.png">';
            } else {*/
            htm += '<img id="videoTv-link" src="' + g_appRootPath + '/Public/img/Common/spacer.gif" alt="">';
            /*}*/
            htm += '<img id="album-inner" src="' + rightData.rightLink1.imgSrc + '" alt="">';
            G('container-right').innerHTML = htm;
        };
        leftHtml();
        centerHtml();
        rightHtml();
    }
};
window.onload = function () {
    //console.log("[V7/home.js]history[current/save_cookie]=" + history.length + "/" + LMEPG.Cookie.getCookie("c_history_length"));
    LMEPG.Log.info('[V7/home.js]history[current/save_cookie]=' + history.length + '/' + LMEPG.Cookie.getCookie('c_history_length'));
    renderHomePage.init();
    lmInitGo();
};
window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};
