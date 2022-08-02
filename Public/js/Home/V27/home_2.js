/**
 * 渲染页面
 * @type {{}}
 */
var tab0MockDate = {
    // 导航页
    nav_content: {
        imgSrc: [RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).normal
            , RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).normal
            , RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).normal
            , RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).normal
            , RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).normal],
        imgLink: ["#1", "#2", "#3", "#4", "#5"]
    },

    // 左侧：夜间药扇、39精选、近期专辑
    left_content: {
        imgSrc: [
            RenderParam.fsUrl + RenderParam.recommentData1[0].img_url
            , RenderParam.fsUrl + RenderParam.recommentData1[1].img_url
            , RenderParam.fsUrl + RenderParam.recommentData1[2].img_url
            , RenderParam.fsUrl + RenderParam.recommentData1[3].img_url
            , RenderParam.fsUrl + RenderParam.recommentData1[4].img_url
            , RenderParam.fsUrl + RenderParam.recommentData1[5].img_url
        ],
        imgLink: ["#1", "#2", "#3", "#4", "#5", "#6"]
    },

    // 中间的3个（2号推荐位、3号推荐位、4号推荐位）
    center_content: {
        carousel: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData2[0].img_url
            ],
            imgLink: ["#1"]
        },
        center_other: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData3[0].img_url, RenderParam.fsUrl + RenderParam.recommentData4[0].img_url],
            imgLink: [""]
        }
    },

    // 右侧：3个推荐位
    right_content: {
        rightLink1: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData5[0].img_url, RenderParam.fsUrl + RenderParam.recommentData6[0].img_url, RenderParam.fsUrl + RenderParam.recommentData7[0].img_url],
            imgLink: ["#1", "#2", "#3"]
        },
        rightLink2: {
            imgSrc: [],
            imgLink: []
        }
    },
    // 最后三个推荐位：
    end_content: {
        rightLink1: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData8[0].img_url, RenderParam.fsUrl + RenderParam.recommentData8[1].img_url, RenderParam.fsUrl + RenderParam.recommentData8[2].img_url],
            imgLink: ["#1", "#2", "#3"]
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
        this.staticHtml();
        this.configurableHtml();
        this.dispatchPage();
        LMEPG.ButtonManager.init(RenderParam.focusIndex === 'night-medicine'?'carousel-link':RenderParam.focusIndex, buttons, buttons, '', true);
        nav1hasFocus("nav-1");
    },


    staticHtml: function () {
        /**
         * 渲染主题背景
         */
        function renderThemeUI() {
            var themeImage = "url('" + ROOT + "/Public/img/"+RenderParam.platformType+"/Home/V27/bg.png"; // 默认背景

            if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== "") {
                themeImage = "url(" + RenderParam.fsUrl + RenderParam.themeImage + ")";
            }
            G("home_container").style.backgroundImage = themeImage;
        }

        var navItem = function () {
            var htm = '';
            for (var i in tab0MockDate.nav_content.imgSrc) {
                htm += '<img id=nav-' + (+i + 1) + ' data-link=' + tab0MockDate.nav_content.imgLink[i] + ' src=' + tab0MockDate.nav_content.imgSrc[i] + '>';
            }
            G("nav").innerHTML = htm;
        };
        renderThemeUI();
        navItem();
        if (RenderParam.carrierId == "630001") {
            G('vip').src =  g_appRootPath + "/Public/img/hd/Home/V27/tab0/vip.png";
            Hide('help');
        }
        if (RenderParam.carrierId == '000509') { //展示版本-5去掉vip和help
            H('help');
            H('vip');
        }
    },

    // 前端html静态布局占位，js动态设置src等处理：保证加载数据前后有占位图切换。
    configurableHtml: function () {
        // 左边
        var leftHtml = function () {
            var leftData = tab0MockDate.left_content;
            for (var i = 0, len = leftData.imgSrc.length; i < len; i++) {
                var leftBtnDom = G("left-btn-" + (i + 1));
                leftBtnDom.src = leftData.imgSrc[i];
                leftBtnDom.setAttribute("data-Link", "#" + (i + 1));
            }
        };

        // 中间位置 1号推荐位
        var centerHtml = function () {
            var centerData = tab0MockDate.center_content;
            var carouselData = centerData.carousel;
            var centerOtherData = centerData.center_other;

            var carouselDom = G("carousel");
            carouselDom.src = carouselData.imgSrc[0];
            carouselDom.setAttribute("data-Link", "0");

            G("book-registration").src = centerOtherData.imgSrc[0];
            G("do-smile-people").src = centerOtherData.imgSrc[1];
        };
        // 右边
        var rightHtml = function () {
            var rightData = tab0MockDate.right_content;

            G("album-inner").src = rightData.rightLink1.imgSrc[0];
            G("album-inner-1").src = rightData.rightLink1.imgSrc[1];
            G("album-inner-2").src = rightData.rightLink1.imgSrc[2];
        };

        // 最后
        var endHtml = function () {
            var end_content = tab0MockDate.end_content;

            G("end-inner").src = end_content.rightLink1.imgSrc[0];
            G("end-inner-1").src = end_content.rightLink1.imgSrc[1];
            G("end-inner-2").src = end_content.rightLink1.imgSrc[2];
        };
        leftHtml();
        centerHtml();
        rightHtml();
        endHtml();
    },

    dispatchPage: function () {
        switch (RenderParam.carrierId) {
            case '540001':
                if (RenderParam.areaCode == 'newtv'){
                    // 未来电视
                    G('nav').style.left = '72px';
                }
                break;
            default:
                break;
        }
    }
};
window.onload = function () {
    renderHomePage.init();
    // JumpPage.jumpMyHome();
};
window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};