/**
 * 渲染页面
 * @type {{init: renderPage.init, navHtml: renderPage.navHtml, videoHtml: renderPage.videoHtml}}
 */
var renderPage = {
    init: function () {

        var nav = document.getElementById("nav");
        var title = document.getElementById("title");
        var container = document.getElementById("container");
        var pageIndex = document.getElementById("page-wrapper");
        var prevArrow = document.getElementById("prev-arrow");
        var nextArrow = document.getElementById("next-arrow");
        // 存储dom对象，过渡dom请求
        this.$ = (function () {
            return {
                "nav": nav,
                "title": title,
                "container": container,
                "page-wrapper": pageIndex,
                "prev-arrow": prevArrow,
                "next-arrow": nextArrow,
            }
        }());
        this.navHtml();
        this.renderVideoList();
        LMEPG.ButtonManager.init(["nav-" + RenderParam.currentTabIndex], buttons, '', true);
    },

    // 渲染静态导航
    navHtml: function () {

        var htm = '';
        for (var i = 0; i < 4; i++) {
            htm += '<img id=nav-' + i + ' src=' + ROOT + '/Public/img/hd/Home/V27/menu/tab' + RenderParam.homeTabIndex + "/V" +RenderParam.carrierId  + '/nav' + i + '.png>';
        }
        this.$.nav.innerHTML = htm;
    },

    // ajax 拉取视频列表
    renderVideoList: function (postData, ref) {

        if (!postData) {
            postData = {
                "page": RenderParam.pageCurrent,
                "userId": RenderParam.userId,
                "modeType": RenderParam.modelType,
                "pageNum": 8
            };
        }
        LMEPG.ajax.postAPI("Channel/moreAjaxList", postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data.result == 0) {
                    RenderParam.totalPages = data.list.length ? Math.ceil(data.count / 8) : 1; // 更新总页数
                    RenderParam.modelType = postData.modeType; // 设置请求参数
                    RenderParam.videoList = data.list;
                    renderPage.videoHtml(RenderParam.videoList, ref);
                } else {
                    LMEPG.ui.showToast("视频加载失败[code=" + data.result + "]");
                }
            } catch (e) {
                LMEPG.ui.showToast("视频加载解析异常" + e.toString());
            }
        }, function (rsp) {
            LMEPG.ui.showToast("视频加载请求失败");
        });
    },
    // 渲染视频列表
    videoHtml: function (videoList, ref) {

        var htm = '';
        var $ = this.$;
        var listVideoFocus = ref ? "video-link-0" : RenderParam.focusIndex;
        if (!videoList.length) {
            htm = "<div class='null-data'>没有数据！</div>"
        } else {
            videoList.forEach(function (item, index) {
                htm += '<div id=video-link-' + index + '>';
                htm += '<img src=' + RenderParam.fsUrl + item.image_url + '>';
                htm += '</div>'
            });
        }
        this.toggleArrow($);
        $.container.innerHTML = htm;
        LMEPG.ButtonManager.requestFocus(listVideoFocus);
        $["page-wrapper"].innerText = RenderParam.pageCurrent + "/" + RenderParam.totalPages;
    },
    // 箭头指示切换
    toggleArrow: function ($) {

        $['prev-arrow'].style.visibility = "visible";
        $['next-arrow'].style.visibility = "visible";
        RenderParam.pageCurrent == 1 && ($['prev-arrow'].style.visibility = "hidden");
        RenderParam.pageCurrent == RenderParam.totalPages && ($['next-arrow'].style.visibility = "hidden");
    }
};
