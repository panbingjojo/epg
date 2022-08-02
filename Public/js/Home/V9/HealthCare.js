var Home = {
    classifyId: RenderParam.classifyId          // 当前分类ID
};

/**
 * 渲染页面
 * @type {{}}
 */
var tab5MockDate = {
    // 1号推荐位
    top_content: {
        videoTv: [],
        carousel: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData1[0].img_url, RenderParam.fsUrl + RenderParam.recommentData1[1].img_url, RenderParam.fsUrl + RenderParam.recommentData1[2].img_url, RenderParam.fsUrl + RenderParam.recommentData1[3].img_url, RenderParam.fsUrl + RenderParam.recommentData1[4].img_url],
            imgLink: ['#1', '#2', '#3', '#4', '#5']
        }
    },

    // 9号推荐位
    left_content: {
        imgSrc: [RenderParam.fsUrl + RenderParam.recommentData9[0].img_url, RenderParam.fsUrl + RenderParam.recommentData9[1].img_url, RenderParam.fsUrl + RenderParam.recommentData9[2].img_url, RenderParam.fsUrl + RenderParam.recommentData9[3].img_url],
        imgLink: ['#1', '#2', '#3', '#4']
    },

    // 7\5\3
    // 8\6\4
    right_content: {
        imgSrc: [RenderParam.fsUrl + RenderParam.recommentData7[0].img_url, RenderParam.fsUrl + RenderParam.recommentData5[0].img_url, RenderParam.fsUrl + RenderParam.recommentData3[0].img_url, RenderParam.fsUrl + RenderParam.recommentData8[0].img_url, RenderParam.fsUrl + RenderParam.recommentData6[0].img_url, RenderParam.fsUrl + RenderParam.recommentData4[0].img_url],
        imgLink: ['#1', '#2', '#3', '#4', '#5', '#6']
    }

};

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        EVENT_MEDIA_END: Play.onPlayEvent,
        EVENT_MEDIA_ERROR: Play.onPlayEvent,
        KEY_VOL_UP: Play.onPlayEvent,
        KEY_VOL_DOWN: Play.onPlayEvent
    }
);

var carouselTimer = null;
var renderTab5Page = {
    init: function () {
        this.configurableHtml();
        this.carousel();
        carouselTimer = setInterval(renderTab5Page.loop, 2000);
        LMEPG.ButtonManager.init(RenderParam.focusIndex, buttons, '', true);

        // 启动小窗口播放
        Play.startPollPlay();
    },
    carousel: function () {
        var n = 0;
        var status = 0;
        var carousel = document.getElementsByClassName('carousel');
        var point = document.getElementById('point').children;

        this.loop = function () {
            n == 4 ? status = 1 : (n == 0 ? status = 0 : null);
            n = status == 0 ? Math.min(4, n += 1) : Math.max(0, n -= 1);
            for (var i = 0; i < carousel.length; i++) {
                carousel[i].className = 'carousel';
                point[i].className = '';
            }
            carousel[n].className += ' active';
            point[n].className += ' currentImg';
        };
    },

    /**
     * 可配置UI组件
     */
    configurableHtml: function () {

        /**
         * 渲染主题背景
         */
        var renderThemeUI = function () {
            var themeImage = 'url(__ROOT__/Public/img/' + RenderParam.platformType + '/Menu/Tab5/bg.png)'; // 默认背景
            if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== '') {
                themeImage = 'url(' + RenderParam.fsUrl + RenderParam.themeImage + ')';
            }
            document.body.style.backgroundImage = themeImage;
        };

        var topHtml = function () {
            var carousel = tab5MockDate.top_content.carousel;
            var htm = '<img class="carousel active" src=' + carousel.imgSrc[0] + ' data-Link="0">';
            htm += '<img class="carousel" src=' + carousel.imgSrc[1] + ' data-Link="1" >';
            htm += '<img class="carousel" src=' + carousel.imgSrc[2] + ' data-Link="2" >';
            htm += '<img class="carousel" src=' + carousel.imgSrc[3] + ' data-Link="3" >';
            htm += '<img class="carousel" src=' + carousel.imgSrc[4] + ' data-Link="4" >';
            htm += '<ul id="point">';
            htm += '<li id="point-1" class="currentImg">';
            htm += '<li>';
            htm += '<li>';
            htm += '<li>';
            htm += '<li>';
            G('carousel-wrapper').innerHTML = htm;
        };
        var leftHtml = function () {
            var leftData = tab5MockDate.left_content;
            var htm = '<img id="left-link-1" src=' + leftData.imgSrc[0] + ' model_type="">';
            htm += '<img id="left-link-2" src=' + leftData.imgSrc[1] + ' model_type="">';
            htm += '<img id="left-link-3" src=' + leftData.imgSrc[2] + ' model_type="">';
            htm += '<img id="left-link-4" src=' + leftData.imgSrc[3] + ' model_type="">';
            G('left-container').innerHTML = htm;
        };

        var rightHtml = function () {
            var rightData = tab5MockDate.right_content;
            var htm = '<img id="right-link-1"  src=' + rightData.imgSrc[0] + '>';
            htm += '<img id="right-link-2"  src=' + rightData.imgSrc[1] + '>';
            htm += '<img id="right-link-3"  src=' + rightData.imgSrc[2] + '>';
            htm += '<img id="right-link-4"  src=' + rightData.imgSrc[3] + '>';
            htm += '<img id="right-link-5"  src=' + rightData.imgSrc[4] + '>';
            htm += '<img id="right-link-6"  src=' + rightData.imgSrc[5] + '>';
            G('right-container').innerHTML = htm;
        };
        renderThemeUI();
        topHtml();
        leftHtml();
        rightHtml();
    }
};

window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};


