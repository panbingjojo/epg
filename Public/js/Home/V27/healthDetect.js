/**
 * 渲染页面
 * @type {{}}
 */
var tab0MockDate = {
    // 导航页
    nav_content: {
        imgSrc: [RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).normal,RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[7].img_url).normal, RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).normal,  RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).normal, RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).normal],
        imgLink: ["#1", "#2", "#3", "#4", "#5"],
    }
};

var HealthDetect = {
    init: function () {
        this.renderHead();
        this.renderRecommendPosition();
        LMEPG.ButtonManager.init(RenderParam.focusIndex, buttons, '', true);
    },

    renderHead: function () {
        /**
         * 渲染主题背景
         */
        var themeImage = "url(" + g_appRootPath + "/Public/img/"+RenderParam.platformType+"/Home/V27/bg.png)"; // 默认背景
        if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== "") {
            themeImage = "url(" + RenderParam.fsUrl + RenderParam.themeImage + ")";
        }
        G("body").style.backgroundImage = themeImage;

        /**
         * 渲染导航栏
         */
        var htm = '';
        for (var i in tab0MockDate.nav_content.imgSrc) {
            htm += '<img id=nav-' + (+i + 1) + ' data-link=' + tab0MockDate.nav_content.imgLink[i] + ' src=' + tab0MockDate.nav_content.imgSrc[i] + '>';
        }
        G("nav").innerHTML = htm;

    },

    /**
     * 渲染推荐位
     */
    renderRecommendPosition: function () {
        // 遍历推荐列表， 注意二号不是推荐位，是观看历史
        for (var i = 0; i < RenderParam.recommendDataList.length; i++) {
            var data = RenderParam.recommendDataList[i];
            switch (data.position) {
                case "81":
                    // 第一个位置
                    G("recommend-1-bg").src = RenderParam.fsUrl + data.item_data[0].img_url;
                    //updateVipIcon(data, "recommend-1-vip-icon");
                    break;
                case "82":
                    // 第一个位置
                    G("recommend-2-bg").src = RenderParam.fsUrl + data.item_data[0].img_url;
                    //updateVipIcon(data, "recommend-2-vip-icon");
                    break;
                case "83":
                    // 第三个位置
                    G("recommend-3-bg").src = RenderParam.fsUrl + data.item_data[0].img_url;
                    //updateVipIcon(data, "recommend-3-vip-icon");
                    break;
                case "84":
                    // 第四个位置
                    G("recommend-4-bg").src = RenderParam.fsUrl + data.item_data[0].img_url;
                    //updateVipIcon(data, "recommend-4-vip-icon");
                    break;
            }
        }
    },
};

