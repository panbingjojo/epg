
function getNavImageSrc() {
    var imgSrcArray = [RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).normal, RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).normal, RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).normal, RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).normal, RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).normal];
    if(RenderParam.navConfig.length > 5) {
        imgSrcArray.push( RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[5].img_url).normal);
    }
    return imgSrcArray;
}

function getNavImageLink() {
    var imgLinkArray = ["#1", "#2", "#3", "#4", "#5"];
    if(RenderParam.navConfig.length > 5) {
        imgLinkArray.push("#6");
    }
    return imgLinkArray;
}
/**
 * 渲染页面
 * @type {{}}
 */
var tab0MockDate = {
    // 导航页
    nav_content: {
        imgSrc: getNavImageSrc(),
        imgLink: getNavImageLink(),
    },

    // 左侧：夜间药扇、39精选、近期专辑
    left_content: {
        imgSrc: [RenderParam.fsUrl + RenderParam.recommentData6[0].img_url, RenderParam.fsUrl + RenderParam.recommentData7[0].img_url, RenderParam.fsUrl + RenderParam.recommentData8[0].img_url, RenderParam.fsUrl + RenderParam.recommentData9[0].img_url],
        imgLink: ["#1", "#2", "#3", "#4"],
    },

    // 中间的3个（1号推荐位、5号推荐位、4号推荐位）
    center_content: {
        carousel: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData1[0].img_url, RenderParam.fsUrl + RenderParam.recommentData1[1].img_url, RenderParam.fsUrl + RenderParam.recommentData1[2].img_url, RenderParam.fsUrl + RenderParam.recommentData1[3].img_url, RenderParam.fsUrl + RenderParam.recommentData1[4].img_url],
            imgLink: ["#1", "#2", "#3", "#4", "#5"],
        },
        center_other: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData5[0].img_url, RenderParam.fsUrl + RenderParam.recommentData4[0].img_url],
            imgLink: [""],
        }
    },

    // 右侧：3号推荐位，2号推荐位(视频轮播)
    right_content: {
        rightLink1: {
            imgSrc: RenderParam.fsUrl + RenderParam.recommentData3[0].img_url,
            imgLink: ["#1"],
        },
        rightLink2: {
            imgSrc: isPlaySmallVideo ? '' : RenderParam.fsUrl + RenderParam.recommentData2[0].img_url,
            imgLink: [],
        }
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
    },
};

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        EVENT_MEDIA_END: Play.onPlayEvent,
        EVENT_MEDIA_ERROR: Play.onPlayEvent,
        KEY_VOL_UP: Play.onPlayEvent,
        KEY_VOL_DOWN: Play.onPlayEvent,
        KEY_3: Home.onKeyDown,
    }
);

var carouselTimer = null;
var renderHomePage = {
    init: function () {
        this.staticHtml();
        this.configurableHtml();
        this.carousel();
        this.initMarquee();
        carouselTimer = setInterval(renderHomePage.loop, 2000);
        buttons = getButtons();
        LMEPG.ButtonManager.init(RenderParam.focusIndex, buttons, '', true);
        if (RenderParam.carrierId === "370002"){ // 山东电信apk,监听4次【频道+】按钮进入3983页面
            LMEPG.Func.listenKey("CHANNEL_UP", [KEY_CHANNEL_UP, KEY_CHANNEL_UP, KEY_CHANNEL_UP, KEY_CHANNEL_UP], Page.jumpTestPage);
        }
        nav1hasFocus("nav-1");
        // 启动小窗口播放
        if(isPlaySmallVideo) {
            Play.startPollPlay();
        }
    },
    /** 跑马灯信息初始化 */
    initMarquee: function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            G('marquee-wrapper').innerHTML = '<marquee>' + data.content + '</marquee>';
        }, function (errorInfo) {
            LMEPG.Log.error("getMarquee error: " + errorInfo)
        })
    },
    carousel: function () {
        var n = 0;
        var status = 0;
        var carousel = document.getElementsByClassName("carousel");
        var point = document.getElementById("point").children;

        this.loop = function () {
            n == 4 ? status = 1 : (n == 0 ? status = 0 : null);
            n = status == 0 ? Math.min(4, n += 1) : Math.max(0, n -= 1);
            for (var i = 0; i < carousel.length; i++) {
                carousel[i].className = "carousel";
                point[i].className = "";
            }
            carousel[n].className += " active";
            point[n].className += " currentImg";
        }
    },

    staticHtml: function () {
        /**
         * 渲染主题背景
         */
        function renderThemeUI() {
            var themeImage = "url('" + g_appRootPath + "/Public/img/" + RenderParam.platformType
                + "/Common/" + RenderParam.commonImgsView + "/bg_home_play.png')"; // 默认背景
            if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== "") {
                themeImage = "url(" + RenderParam.fsUrl + RenderParam.themeImage + ")";
            }
            document.body.style.backgroundImage = themeImage;
        };

        var navItem = function () {
            var htm = '';
            for (var i = 0; i < tab0MockDate.nav_content.imgSrc.length; i++) {
                htm += '<img id=nav-' + (+i + 1) + ' data-link=' + tab0MockDate.nav_content.imgLink[i] + ' src=' + tab0MockDate.nav_content.imgSrc[i] + '>';
            }
            G("nav").innerHTML = htm;
        };
        renderThemeUI();
        navItem();
    },
    configurableHtml: function () {
        // 左边
        var leftHtml = function () {
            var leftData = tab0MockDate.left_content;
            var htm = '<img id="night-medicine" src=' + leftData.imgSrc[0] + ' data-Link=' + leftData.imgLink[0] + '>';
            htm += '<img id="39-featured" src=' + leftData.imgSrc[1] + ' data-Link=' + leftData.imgLink[1] + '>';
            htm += '<img id="history-album" src=' + leftData.imgSrc[2] + ' data-Link=' + leftData.imgLink[2] + '>';
            htm += '<img id="free-area" src=' + leftData.imgSrc[3] + ' data-Link=' + leftData.imgLink[3] + '>';
            G("container-left").innerHTML = htm;
        };

        // 中间位置 1号推荐位
        var centerHtml = function () {
            var centerData = tab0MockDate.center_content;
            var carouselData = centerData.carousel;
            var centerOtherData = centerData.center_other;
            var carouselHtm = '<div id="carousel-wrapper">';
            carouselHtm += '<img class="carousel active" src=' + carouselData.imgSrc[0] + ' data-Link="0" >';
            carouselHtm += '<img class="carousel" src=' + carouselData.imgSrc[1] + ' data-Link="1">';
            carouselHtm += '<img class="carousel" src=' + carouselData.imgSrc[2] + ' data-Link="2">';
            carouselHtm += '<img class="carousel" src=' + carouselData.imgSrc[3] + ' data-Link="3">';
            carouselHtm += '<img class="carousel" src=' + carouselData.imgSrc[4] + ' data-Link="4">';
            carouselHtm += '<ul id="point">';
            carouselHtm += '<li id="point-1" class="currentImg">';
            carouselHtm += '<li>';
            carouselHtm += '<li>';
            carouselHtm += '<li>';
            carouselHtm += '<li>';
            G("center-link-1").innerHTML = carouselHtm;
            var centerOtherHtm = '';
            centerOtherHtm += '<img id="book-registration" src=' + centerOtherData.imgSrc[0] + '>';
            centerOtherHtm += '<img id="do-smile-people" src=' + centerOtherData.imgSrc[1] + '>';
            G("book-and-smile").innerHTML = centerOtherHtm;
        };
        // 右边
        var rightHtml = function () {
            var rightData = tab0MockDate.right_content;
            var htm = '';
            if(isPlaySmallVideo) {
                htm += '<iframe id="iframe_small_screen" src="" frameborder="0"></iframe>';
                htm += '<img id="videoTv-link" src="__ROOT__/Public/img/Common/spacer.gif">';
            }else {
                htm += '<img id="videoTv-link" src=' + rightData.rightLink2.imgSrc + '>';
            }
            htm += '<img id="album-inner" src=' + rightData.rightLink1.imgSrc + '>';
            htm += '<img id="placeholder" src="" style="visibility: hidden">';
            G("container-right").innerHTML = htm;

        };
        leftHtml();
        centerHtml();
        rightHtml();
    },
};
window.onload = function () {
    renderHomePage.init();
    lmInitGo();
};
window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};
