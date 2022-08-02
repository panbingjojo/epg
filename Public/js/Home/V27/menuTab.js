/**
 *
 * @type {*[]}
 */
var tabMockData = {
    id: RenderParam.classifyId,
    name: RenderParam.tabName[RenderParam.classifyId],
    // 1号推荐位
    type_content: {
        carousel: [
            {imgSrc: RenderParam.fsUrl + RenderParam.recommentData1[0].img_url, imgLink: "0"},
            {imgSrc: RenderParam.fsUrl + RenderParam.recommentData1[1].img_url, imgLink: "1"},
            {imgSrc: RenderParam.fsUrl + RenderParam.recommentData1[2].img_url, imgLink: "2"},
            {imgSrc: RenderParam.fsUrl + RenderParam.recommentData1[3].img_url, imgLink: "3"},
            {imgSrc: RenderParam.fsUrl + RenderParam.recommentData1[4].img_url, imgLink: "4"},
        ],
        // 6号推荐位
        left_content: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData6[0].img_url, RenderParam.fsUrl + RenderParam.recommentData6[1].img_url, RenderParam.fsUrl + RenderParam.recommentData6[2].img_url, RenderParam.fsUrl + RenderParam.recommentData6[3].img_url],
            imgLink: ["#1", "#2", "#3", "#4"]
        },
        // 5\4\3\2号推荐位
        center_content: {
            imgSrc: [RenderParam.fsUrl + RenderParam.recommentData5[0].img_url, RenderParam.fsUrl + RenderParam.recommentData4[0].img_url, RenderParam.fsUrl + RenderParam.recommentData3[0].img_url, RenderParam.fsUrl + RenderParam.recommentData2[0].img_url],
            imgLink: ["#1", "#2", "#3", "#4"]
        },
    }
};

/**
 * 渲染数据到页面
 * @type {{init: renderTabsPage.init, carousel: renderTabsPage.carousel, configurableHtml: renderTabsPage.configurableHtml}}
 */
var carouselTimer = null;
var renderTabsPage = {
    init: function () {
        this.configurableHtml();
        this.carousel();
        carouselTimer = setInterval(this.loop, 2000);
        LMEPG.ButtonManager.init([RenderParam.currentFocusId], buttons, '', true);
    },
    carousel: function () {
        var n = 0;
        var Nc = 0;
        var preloaderImg = [];
        var prevImg = document.getElementById("prev-container");
        var currentImg = document.getElementById("current-container");
        var nextImg = document.getElementById("next-container");
        var point = document.getElementById("point").children;
        var httpImg = tabMockData.type_content.carousel;
        httpImg.forEach(function (item) {
            var imgObj = new Image();
            imgObj.src = item.imgSrc;
            imgObj.index = item.imgLink;
            preloaderImg.push(imgObj);
        });
        this.loop = function (direction) {
            this.key = direction;

            /**
             * 方向切换
             */
            function updateDirection() {
                n == 4 ? Nc = 1 : (n == 0 ? Nc = 0 : null);
                !direction ? (direction = Nc == 0 ? "right" : "left") : null;
                updatePreloaderImg();
            }

            /**
             * 渲染图片
             */
            function renderImgObj() {
                prevImg.src = preloaderImg[1].src;
                currentImg.src = preloaderImg[2].src;
                nextImg.src = preloaderImg[3].src;
                currentImg.setAttribute("data-link", preloaderImg[2].index);
                changePointsItem(preloaderImg[2].index);
            }

            /**
             * 更新图片数组对象
             */
            function updatePreloaderImg() {
                if (direction == "left") {
                    preloaderImg.unshift(preloaderImg.pop());
                } else {
                    preloaderImg.push(preloaderImg.shift());
                }
                renderImgObj();
            }

            /**
             * 指示切换
             */
            function changePointsItem(index) {
                for (var j = 0; j < point.length; j++) {
                    point[j].className = ""
                }
                point[index].className = "currentImg";
            }

            updateDirection();
        }
    },
    // 可配置页面元素
    configurableHtml: function () {

        /**
         * 渲染主题背景
         */
        var renderThemeUI = function () {
            var themeImage = "url(" + g_appRootPath + "/Public/img/hd/Home/V27/bg.png)"; // 默认背景
            if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== "") {
                themeImage = "url(" + RenderParam.fsUrl + RenderParam.themeImage + ")";
            }
            G("home_container").style.backgroundImage = themeImage;
        };

        this.carouselHtml = function () {

            var carousel = tabMockData.type_content.carousel;

            var htm = '<img id="carousel-link" src="' + g_appRootPath + '/Public/img/hd/Home/V27/spacer.gif">';
            htm += "<img id='arrow-prev' src='" + ROOT + "/Public/img/hd/Home/V27/prev.png'>";
            htm += "<img id='prev-container' class='prev-container' src=" + carousel[1].imgSrc + ">";
            htm += "<img id='current-container' class='current-container' src=" + carousel[2].imgSrc + " data-link=" + carousel[0].imgLink + ">";
            htm += "<img id='next-container' class='next-container' src=" + carousel[3].imgSrc + ">";
            htm += "<img id='arrow-next' src='" + ROOT + "/Public/img/hd/Home/V27/next.png'>";
            htm += "<ul id='point'>";
            htm += "<li id='point-1'>";
            htm += "<li>";
            htm += "<li class=currentImg>";
            htm += "<li>";
            htm += "<li>";
            G("carousel-wrapper").innerHTML = htm;
        };

        var bottomLeftHtml = function () {

            var bottomleftData = tabMockData.type_content.left_content;
            var htm = '<img id="bottom-left-link1" class="m-b m-r" src=' + bottomleftData.imgSrc[0] + '>';
            htm += '<img id="bottom-left-link2" class="m-b" src=' + bottomleftData.imgSrc[1] + '>';
            htm += '<img id="bottom-left-link3" class="m-r" src=' + bottomleftData.imgSrc[2] + '>';
            htm += '<img id="bottom-left-link4" src=' + bottomleftData.imgSrc[3] + '>';
            G("bottom-left").innerHTML = htm;
        };
        var bottomCenterHtml = function () {

            var bottomCenterData = tabMockData.type_content.center_content;
            var htm = '<img id="bottom-center-link1" class="m-r" src=' + bottomCenterData.imgSrc[0] + ' alt="">';
            htm += '<img id="bottom-center-link2" class="m-r" src=' + bottomCenterData.imgSrc[1] + ' alt="">';
            htm += '<img id="bottom-center-link3" class="m-r" src=' + bottomCenterData.imgSrc[2] + ' alt="">';
            htm += '<img id="bottom-center-link4" class="m-r" src=' + bottomCenterData.imgSrc[3] + ' alt="">';
            G("bottom-center").innerHTML = htm;
        };

        renderThemeUI();
        this.carouselHtml();
        bottomLeftHtml();
        bottomCenterHtml();
        G("title").innerText = tabMockData.name;
    }
};




