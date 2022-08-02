var buttons = [];

var HomeEntryType = {
    VIDEO_VISIT_BY_DEPART: 1, //视频问诊-科室
    VIDEO_VISIT_BY_DOCTOR: 2, //视频问诊-医生
    ACTIVITYS: 3,   //活动
    HEALTH_VIDEO_BY_TYPES: 4, //健康视频分类
    HEALTH_VIDEO: 5,  //健康视频
    DEVICE_STORES: 6,//设备商城
    DEVICE_STORES_BY_ID: 7,//设备商城商品
    HOME_PAGE: 8,//首页
    VIDEO_VISIT_HOME: 9,//视频问诊
    DOCTOR_CONSULTATION_HOME: 10,//名医会诊
    MY_FIMILY_HOME: 11,//我的家
    HEALTH_VIDEO_HOME: 12,//健康视频首页
    HEALTH_VIDEO_SUBJECT: 13,//健康视频专题
    GUAHAO_HOME: 14,//预约挂号
    GUAHAO_BY_HOSP: 15,//预约挂号-医院
    USER_GUIDE: 16,//使用指南
    HEALTH_MEASURE: 17,//健康检测
    SEARCH: 18,//搜索
    EXPERT_CONSULTATION: 19,//专家约诊
    EXPERT_CONSULTATION_REMIND: 20, //专家约诊消息提醒
    FREE_ALBUM: 21, //免费专区
    EPIDEMIC: 48, //这里改为疫情实时播报
    ALBUM_UI: 33, // UI专辑
    HEALTH_SUBMIT: 39, // 健康话题(图文专辑)
};

var NavClassType = [0, 1, 2]; //样式类型
/**
 * 首页全局配置数据
 * @type {{}}
 */
var GConfigData = {
    navConfig: [],   // 每个导航栏配置，修改一下后端的数据结构，方便前端使用
    initData: function () {

        if (LMEPG.STBUtil.getSTBModel() === "Q21A_pub_jljlt") {

        }
        var isInit = false;
        // 初始化数据

        if (RenderParam.homeConfigInfo.result == 0) {
            for (var i = 0; i < RenderParam.navConfig.length; i++) {
                var navInfo = {
                    navItem: {},                // 导航栏信息
                    recommendList: []           // 导航栏对应的推荐位信息
                };  // 导航栏对象
                navInfo.navItem = RenderParam.navConfig[i];
                //entryList[2]推荐位置
                var entryList = RenderParam.homeConfigInfo.data.entry_list;
                var recommendList = [];

                for (var j = 0; j < entryList.length; j++) {
                    if (i == 0 && j == 1) {
                        // 记录小窗播放视频的推荐位ID
                        GConfigData.videoPositionId = entryList[j].position;
                        //首页2号位置是轮播视频列表
                        recommendList.push(RenderParam.homeConfigInfo.data.home_video.list);
                    } else if (entryList[j].position.substr(0, 1) == (i + 1 + '')) {
                        // 匹配到导航栏
                        var recommendItem = entryList[j].item_data;
                        recommendItem.position = entryList[j].position;
                        recommendList.push(recommendItem);
                    }
                }
                navInfo.recommendList = recommendList;
                this.navConfig.push(navInfo);   // 完成一个导航栏
            }
            isInit = true;
        }
        return isInit;
    },

    /**
     * 返回推荐位位置数据
     * @param navId   导航栏ID
     * @param position  位置ID
     * @param index  序号
     * @returns {*}
     */
    getRecommendData: function (navId, position, index) {
        if (navId < 0 || navId >= this.navConfig.length)
            return null;
        var recommendList = this.navConfig[navId].recommendList;
        if (position < 0 || position > recommendList.length) {
            return null;
        }
        if (typeof index == 'undefined' || index < 0 || index >= recommendList[position].length) {
            return recommendList[position];
        }
        return recommendList[position][index];
    }
};
(function (w) {
    w.Banner = function (id, data) {
        this.id = id || "";
        this.data = data || data;
        this.timer = "";
        this.index = 1;
    };
    Banner.prototype.banner = function () {

        G(this.id + '-title').innerHTML = JSON.parse(this.data[0].inner_parameters).title;
        G(this.id).src = RenderParam.fsUrl + this.data[0].img_url

        console.log("banner>>>" + RenderParam.fsUrl + this.data[0].img_url)
        if (this.data.length > 1) {
            var that = this;
            this.timer = setInterval(function () {
                that.index < that.data.length ? that.index++ : that.index = 1;
                G(that.id).src = RenderParam.fsUrl + that.data[that.index - 1].img_url;
                G(that.id + '-title').innerHTML = " ";
                G(that.id + '-title').innerHTML = JSON.parse(that.data[that.index - 1].inner_parameters).title;
                // LMEPG.UI.Marquee.stop();
                LMEPG.BM.getButtonById(that.id).cBanner = that.data;
                LMEPG.BM.getButtonById(that.id).cIdx = that.index - 1;
                // console.log(JSON.parse(that.data[that.index - 1].inner_parameters).title)
                // LMEPG.UI.Marquee.start(that.id + "-title", btn.show_num, 5, 50, "left", "scroll");
            }, 3000)
        }
    };
}(window))
/**
 * 2号位置开始轮播
 * @type {{}}
 */
var Play = {
    currPollVideoId: 0,     //当前轮播id
    isStart: false,         // 是否已经启动播放过
    /**
     * 得到当前轮播数据对象
     * @returns {*}
     */
    getCurrentPollVideoData: function () {
        var recommendData = GConfigData.navConfig[0].recommendList[1];
        var videoOrder = recommendData.order;
        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(GConfigData.videoPositionId, videoOrder);
        return recommendData[Play.currPollVideoId];
    },

};

/**
 * 主模块
 * @type {{initButtons: Home.initButtons, init: Home.init, listenMoveFocus: string, loadContainer: Home.loadContainer, downMoveMainModuleFocus: Home.downMoveMainModuleFocus, underBottomTips: Home.underBottomTips, renderHtml: Home.renderHtml, backFocus: boolean, createBtns: Home.createBtns, mainBtnOnFocusChange: Home.mainBtnOnFocusChange, moveToFocus: Home.moveToFocus, downMoveLoaderModules: Home.downMoveLoaderModules, loadBtnOnFocusChange: Home.loadBtnOnFocusChange, scrollDistanceTop: Home.scrollDistanceTop}}
 */
var Home = {
    backFocus: true,
    moduleIndex: 0,
    listenMoveFocus: RenderParam.focusIndex ? RenderParam.focusIndex : 'videoTv-link', // 监听移动焦点
    loadIndex: RenderParam.loadIndex ? RenderParam.loadIndex : 1,
    offerHeight: 0,

    init: function () {

        if (GConfigData.initData()) {
            this.initStaticButton();
            this.renderHtml();
            // if (RenderParam.scrollTop == 0) {
            //     Play.startPollPlay();
            // } else {
            Home.scrollDistanceTop(RenderParam.scrollTop);
            this.moveToFocus(Home.listenMoveFocus);
            // }
        } else {
            // 加载首页配置数据失败
            LMEPG.Intent.back();
        }
        // 跳转到测试桩选择界面
        LMEPG.Func.listenKey(3, [KEY_3, KEY_9, KEY_8, KEY_3], Page.jumpTestPage);
        Home.setBodyBg("toggle-bg");

        //关闭屏保
        if (typeof window.top.itv !== 'undefined') {
            window.top.itv.closeSS();
        }
        Home.backFocus = true;
    },

    setBodyBg: function (id) {
        var TP = RenderParam;
        var bgImg = '';
        LMEPG.UI.setBackGround();
        G('header-container').style.backgroundImage = 'url(' + RenderParam.fsUrl + RenderParam.skin.sy + ')';
        if (bgImg) {
            G(id).src = bgImg;
        }
    },

    initStaticButton: function () {
        var orderImageUrl;
        var orderFocusImageUrl;
        if ((RenderParam.carrierId == '10220094' || RenderParam.carrierId == '10220095') && RenderParam.isVip == 1) {
            orderImageUrl = g_appRootPath + '/Public/img/hd/Home/V23/isvip.png';
            orderFocusImageUrl = g_appRootPath + '/Public/img/hd/Home/V23/isvip-f.png';
        } else {
            orderImageUrl = g_appRootPath + '/Public/img/hd/Home/V23/pay.png';
            orderFocusImageUrl = g_appRootPath + '/Public/img/hd/Home/V23/pay-f.png';
        }
        // 虚拟按钮模块
        buttons.push({
                id: 'collect',
                name: '',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'search',
                nextFocusUp: '',
                nextFocusDown: 'r-img-wrap-1',
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V11/collect.png',
                focusImage: g_appRootPath + '/Public/img/hd/Home/V11/collect-f.png',
                click: Page.jumpCollection,
                focusChange: '',
                beforeMoveChange: Home.staticVideoPosition,
                moveChange: '',
                cIdx: ''
            }, {
                id: 'search',
                name: '',
                type: 'img',
                nextFocusLeft: ' ',
                nextFocusRight: 'payInfo',
                nextFocusUp: '',
                nextFocusDown: 'r-img-wrap-1',
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V23/search.png',
                focusImage: g_appRootPath + '/Public/img/hd/Home/V23/search-f.png',
                click: Page.jumpSearchPage,
                focusChange: '',
                beforeMoveChange: Home.staticVideoPosition,
                moveChange: '',
                cIdx: ''
            }, {
                id: 'payInfo',
                name: '',
                type: 'img',
                nextFocusLeft: 'search',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'r-img-wrap-1',
                // backgroundImage: g_appRootPath + '/Public/img/hd/Home/V23/pay.png',
                // focusImage: g_appRootPath +  '/Public/img/hd/Home/V23/pay-f.png',
                backgroundImage: orderImageUrl,
                focusImage: orderFocusImageUrl,
                click: Page.jumpBuyVip,
                focusChange: '',
                beforeMoveChange: Home.staticVideoPosition,
                moveChange: '',
                cIdx: ''
            },
            // 小窗视频
            {
                id: 'videoTv-link',
                type: 'img',
                nextFocusRight: 'r-img-wrap-1',
                nextFocusUp: 'search',
                nextFocusDown: 'b-link-1',
                click: Home.onClickRecommendPosition,
                focusChange: Home.mainBtnOnFocusChange,
                cNavId: 2,
                show_title: true,
                show_num: 10,
                cPosition: 11,
                cBanner: RenderParam.homeConfigInfo.data.entry_list[1].item_data,
                cIdx: 0,
            },
            // 右边四个
            {
                id: 'r-img-wrap-1',
                name: '',
                type: 'others',
                nextFocusLeft: 'videoTv-link',
                nextFocusRight: 'r-img-wrap-2',
                nextFocusUp: 'search',
                nextFocusDown: 'r-img-wrap-3',
                click: Home.onClickRecommendPosition,
                focusChange: Home.rightBtnOnFocusChange,
                beforeMoveChange: Home.staticVideoPosition,
                moveChange: '',
                cNavId: 0,
                cIdx: 0,
                cPosition: 0
            }, {
                id: 'r-img-wrap-2',
                name: '',
                type: 'others',
                nextFocusLeft: 'r-img-wrap-1',
                nextFocusRight: '',
                nextFocusUp: 'search',
                nextFocusDown: 'r-img-wrap-4',
                click: Home.onClickRecommendPosition,
                focusChange: Home.rightBtnOnFocusChange,
                beforeMoveChange: Home.staticVideoPosition,
                moveChange: '',
                cNavId: 0,
                cPosition: 0,
                cIdx: 1
            }, {
                id: 'r-img-wrap-3',
                name: '',
                type: 'others',
                nextFocusLeft: 'videoTv-link',
                nextFocusRight: 'r-img-wrap-4',
                nextFocusUp: 'r-img-wrap-1',
                nextFocusDown: 'b-link-3',
                click: Home.onClickRecommendPosition,
                focusChange: Home.rightBtnOnFocusChange,
                beforeMoveChange: Home.staticVideoPosition,
                moveChange: '',
                cNavId: 0,
                cPosition: 0,
                cIdx: 2
            }, {
                id: 'r-img-wrap-4',
                name: '',
                type: 'others',
                nextFocusLeft: 'r-img-wrap-3',
                nextFocusRight: '',
                nextFocusUp: 'r-img-wrap-2',
                nextFocusDown: 'b-link-5',
                click: Home.onClickRecommendPosition,
                focusChange: Home.rightBtnOnFocusChange,
                beforeMoveChange: Home.staticVideoPosition,
                moveChange: '',
                cNavId: 0,
                cPosition: 0,
                cIdx: 3
            },
            // 下边五个
            {
                id: 'b-link-1',
                name: '',
                type: 'others',
                nextFocusLeft: '',
                nextFocusRight: 'b-link-2',
                nextFocusUp: 'videoTv-link',
                nextFocusDown: 'load-1-link-0',
                click: Home.onClickRecommendPosition,
                focusChange: Home.mainBtnOnFocusChange,
                beforeMoveChange: Home.downMoveMainModuleFocus,
                moveChange: '',
                cNavId: 0,
                cIdx: 0,
                cPosition: 2
            }, {
                id: 'b-link-2',
                name: '',
                type: 'others',
                nextFocusLeft: 'b-link-1',
                nextFocusRight: 'b-link-3',
                nextFocusUp: 'videoTv-link',
                nextFocusDown: 'load-1-link-1',
                click: Home.onClickRecommendPosition,
                focusChange: Home.mainBtnOnFocusChange,
                beforeMoveChange: Home.downMoveMainModuleFocus,
                moveChange: '',
                cNavId: 0,
                cIdx: 1,
                cPosition: 2
            }, {
                id: 'b-link-3',
                name: '',
                type: 'others',
                nextFocusLeft: 'b-link-2',
                nextFocusRight: 'b-link-4',
                nextFocusUp: 'r-img-wrap-3',
                nextFocusDown: 'load-1-link-1',
                click: Home.onClickRecommendPosition,
                focusChange: Home.mainBtnOnFocusChange,
                beforeMoveChange: Home.downMoveMainModuleFocus,
                moveChange: '',
                cNavId: 0,
                cIdx: 2,
                cPosition: 2
            }, {
                id: 'b-link-4',
                name: '',
                type: 'others',
                nextFocusLeft: 'b-link-3',
                nextFocusRight: 'b-link-5',
                nextFocusUp: 'r-img-wrap-3',
                nextFocusDown: 'load-1-link-2',
                click: Home.onClickRecommendPosition,
                focusChange: Home.mainBtnOnFocusChange,
                beforeMoveChange: Home.downMoveMainModuleFocus,
                moveChange: '',
                cNavId: 0,
                cIdx: 3,
                cPosition: 2
            }, {
                id: 'b-link-5',
                name: '',
                type: 'others',
                nextFocusLeft: 'b-link-4',
                nextFocusRight: '',
                nextFocusUp: 'r-img-wrap-4',
                nextFocusDown: 'load-1-link-3',
                click: Home.onClickRecommendPosition,
                focusChange: Home.mainBtnOnFocusChange,
                beforeMoveChange: Home.downMoveMainModuleFocus,
                moveChange: '',
                cNavId: 0,
                albumName: 'commonFreeVideo',
                cIdx: 4,
                cPosition: 2
            });

        LMEPG.ButtonManager.init('', buttons, '', true);
    },
    renderHtml: function () {

        // 主容器内容
        var mainContainer = function () {
            var rightHtm = function () {
                var htm = '';
                var currentData = GConfigData.navConfig[0];
                var contentLength = GConfigData.navConfig[0].recommendList[0].length; // 首页推荐-1号位置
                // this.banner = new Banner('videoTv-link',item.item_data);
                // this.banner.banner();
                var currentContent = GConfigData.navConfig[0].recommendList[0];
                var currentContent2 = GConfigData.navConfig[0].recommendList[2];
                console.log(currentContent2)
                var rightDom = G('right-wrap');
                var i = 0;
                while (i < contentLength) {
                    title = JSON.parse(currentData.recommendList[0][i].inner_parameters).title
                    var index = i + 1;
                    htm += '<div id=r-img-wrap-' + index + '>';
                    htm += '<img id=r-link-' + index + ' class=\'r-link-img\' src=' + RenderParam.fsUrl + currentContent[i].img_url + '>';
                    htm += '<p id=r-img-wrap-' + index + '-title  class=\'r-title\'>' + title + '</p>';
                    var innerParams = JSON.parse(currentContent[i].inner_parameters);
                    var cornerMark = innerParams.cornermark;
                    if (cornerMark && cornerMark.type !== -1) {
                        htm += '<img id=r-corner-' + index + ' class=r-corner-img src=' + RenderParam.fsUrl + cornerMark.img_url + '>';
                    }
                    htm += '</div>';
                    i++;


                }

                rightDom.innerHTML = htm;
            };
            // 下功能单例模块
            var bottomHtm = function () {
                var htm = '';
                var contentLength = GConfigData.navConfig[0].recommendList[2].length;// 下边推荐位个数
                var currentContent = GConfigData.navConfig[0].recommendList[2];
                var bottomDom = G('bottom-wrap');
                var i = 0;
                while (i < contentLength) {
                    var index = i + 1;
                    htm += '<div class=b-img-wrap-' + index + '>';
                    htm += '<img id=b-link-' + index + ' src=' + RenderParam.fsUrl + currentContent[i].img_url + '>';
                    htm += '</div>';
                    i++;
                }
                bottomDom.innerHTML = htm;
            };
            var leftHtml = function () {
                var htm = '';
                var currentData = RenderParam.homeConfigInfo.data.entry_list[1].item_data;
                this.banner = new Banner('videoTv-link', currentData);
                this.banner.banner();
                // this.banner = new Banner('videoTv-link',item.item_data);
                // this.banner.banner();
                // var currentContent = GConfigData.navConfig[0].recommendList[1];
                // var rightDom = G('jiLingCarousel');
                // var i = 0;
                // while (i < contentLength) {
                //     title = JSON.parse(currentData.recommendList[0][i].inner_parameters).title
                //     var index = i + 1;
                //     htm += '<img id=videoTv-link'+index+' class=\'videoTv-link-img\' src=' + RenderParam.fsUrl + currentContent[i].img_url + '>';
                //     htm += '<p id=tab0-recommended-' + index +'-title  class=\'r-title\'>' +title + '</p>';
                //     var innerParams = JSON.parse(currentContent[i].inner_parameters);
                //     var cornerMark = innerParams.cornermark;
                //     if (cornerMark && cornerMark.type !== -1) {
                //         htm += '<img id=r-corner-' + index + ' class=r-corner-img src=' + RenderParam.fsUrl + cornerMark.img_url + '>';
                //     }
                //     i++;
                //
                //
                // }
                //
                // rightDom.innerHTML = htm;

            }

            // for (var i = 1; i <= this.loadIndex; i++) {
            rightHtm();
            // this.loadContainer(i, NavClassType[i]);
            // }
            leftHtml();
            bottomHtm();
        };
        mainContainer();
        for (var i = 1; i <= this.loadIndex; i++) {
            this.loadContainer(i, NavClassType[i]);
        }
    },

    /**
     * 懒加载模块
     * @param index 模块索引
     * @param classType 样式类型
     */
    loadContainer: function (index, classType) {

        // 获得要加载的模块数据
        var currentData = GConfigData.navConfig[index];
        var currentId = 'load-container-' + index;
        var hasDom = G(currentId);
        if (hasDom || currentData == undefined) {
            return;
        }
        // 设置随机样式类名
        var randRow = classType == 1 ? 'row-' : 'rows-';
        var currentClass = 'load-container-' + classType;
        var container = G('container');
        var htm = '';
        htm += '<div id=' + currentId + '  class=\'load-container ' + currentClass + '\'>';
        htm += '<p class=load-module-title>' + currentData.navItem.navigate_name + '</p>';
        htm += '<div class=\'load-content load-content-' + classType + '\' style="width: 100%">';
        // if(currentData.recommendList[0][i].inner_parameters=="")


        for (var i = 0; i < currentData.recommendList[0].length; i++) {
            var title = '';
            // if (currentData.recommendList[0][i].entry_type == '4'
            //     || currentData.recommendList[0][i].entry_type == '5') {
            var innerParam = JSON.parse(currentData.recommendList[0][i].inner_parameters);
            title = innerParam.title;
            // }

            var row = randRow + (i < 4 ? 1 : 2); // 模块行数
            var col = ' col-' + (i < 4 ? (i + 1) : i - 3); // 模块列数
            var id = 'load-' + index + '-link-' + i; // 焦点ID
            htm += '<div class=\'' + row + col + '\'>';
            htm += '<img id=' + id + ' class=\'load-link-img\' src=' + RenderParam.fsUrl + currentData.recommendList[0][i].img_url + '>';
            var innerParams = JSON.parse(currentData.recommendList[0][i].inner_parameters);

            if ((row.trim() == "row-2" || row.trim() == "rows-2") && col.trim() == "col-4") {
                // 第二个导航栏隐藏标题
                title = '';
                htm += '<p>' + title + '</p>';
            } else {
                htm += '<p>' + title + '</p>';
            }
            var cornerMark = innerParams.cornermark;
            if (cornerMark && cornerMark.type !== -1) {
                var cornerId = 'load-' + index + '-corner-' + i;
                htm += '<img id=' + cornerId + ' class=load-corner-img src=' + RenderParam.fsUrl + cornerMark.img_url + '>';
            }
            htm += '</div>';
        }
        console.log(classType, 456)
        if (classType === 2) {
            htm += '<p id="bottom-tips-2">按（返回）键回到顶部</p>'
        }

        container.innerHTML += htm;
        this.moduleIndex = classType;
        this.createBtns(index, classType);
    },

    /**
     * 动态创建虚拟按钮
     * @param index 模块索引
     * @param sid 随机样式id
     */
    createBtns: function (index, sid) {
        var maxLength = GConfigData.navConfig[index].recommendList[0].length; // 模块内容推荐位个数
        var i = 0;
        while (i < maxLength) {
            var upFocus = function () {
                var upFocusId = 'load-' + index + '-link-' + (i - 4);
                //    当且仅当是第一个加载模块、第一行，向上移动到主模块；
                if (index == 1 && i < 4) {
                    upFocusId = 'b-link-1';
                }
                if (index > 1 && i < 4) {
                    upFocusId = 'load-' + (index - 1) + '-link-' + 7;
                }
                return upFocusId;
            }();
            var downFocus = function () {
                var downFocusId = 'load-' + index + '-link-' + (i + 4);
                //    加载模块第2行，向下移动新模块；
                if (index >= 1 && i > 3) {
                    downFocusId = 'load-' + (index + 1) + '-link-' + 0;
                }
                return downFocusId;
            }();

            LMEPG.ButtonManager.addButtons({
                id: 'load-' + index + '-link-' + i,
                name: '',
                type: 'others',
                nextFocusLeft: 'load-' + index + '-link-' + (i - 1),
                nextFocusRight: 'load-' + index + '-link-' + (i + 1),
                nextFocusUp: upFocus,
                nextFocusDown: downFocus,
                click: Home.onClickRecommendPosition,
                focusChange: Home.loadBtnOnFocusChange,
                beforeMoveChange: Home.downMoveLoaderModules,
                moveChange: '',
                cSid: sid,      // 样式类别
                cNavId: index,
                cPosition: 0,
                cIdx: i
            });
            //buttons.push();
            i++;
        }
        //this.initButtons("");
        this.moveToFocus(Home.listenMoveFocus);
    },
    // 在主模块上移动
    staticVideoPosition: function () {
        // may do something
    },

    // 主模块获得焦点
    mainBtnOnFocusChange: function (btn, hasFocus) {
        var btnDom = G(btn.id);
        if (hasFocus) {
            btnDom.className = 'focus';
            Home.listenMoveFocus = btn.id;
        } else {
            btnDom.removeAttribute('class');
        }

    },

    // 主模块获得焦点
    rightBtnOnFocusChange: function (btn, hasFocus) {

        var btnDom = G(btn.id);
        if (hasFocus) {
            btnDom.className = 'recommended-hover';
            //LMEPG.UI.Marquee.start(btn.id + "-title", 10, 10, 50, "left", "scroll");
            LMEPG.UI.Marquee.start(btn.id + "-title", 10, 6, 50, "left", "scroll");
            Home.listenMoveFocus = btn.id;
        } else {
            LMEPG.UI.Marquee.stop()
            btnDom.removeAttribute('class');
        }


    },

    // 加载模块获得焦点
    loadBtnOnFocusChange: function (btn, hasFocus) {


        var btnDom = G(btn.id);
        var pElement = btnDom.nextElementSibling;
        var cElement = pElement.nextElementSibling;
        var text = pElement.innerText;

        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, 'focus');
            // btnDom.className = "focus";
            pElement.className = 'focus';
            if (cElement) {
                LMEPG.CssManager.addClass(cElement.id, 'load-corner-focus');
            }
            Home.listenMoveFocus = btn.id;
            Home.titleOnFocusScrollText(pElement, text);
        } else {
            LMEPG.CssManager.removeClass(btn.id, 'focus');
            //btnDom.removeAttribute("class");
            pElement.removeAttribute('class');
            if (cElement) {
                LMEPG.CssManager.removeClass(cElement.id, 'load-corner-focus');
            }
            pElement.innerHTML = text;
        }
    },
    // 添加标题滚动
    titleOnFocusScrollText: function (el, text) {
        var hasMarquee = el.getElementsByTagName('marquee')[0];
        if (text.length <= 9 || hasMarquee) return;
        el.innerHTML = '<marquee>' + text + '</marquee>';
    },

    // 主模块的下五个向下移动调整滚动条位置
    downMoveMainModuleFocus: function (key, btn) {
        if (key == 'down') {
            if (NavClassType[Home.loadIndex] == 1) {
                Home.scrollDistanceTop(425);
            } else if (NavClassType[Home.loadIndex] == 2) {
                Home.scrollDistanceTop(425);
            }
            Home.toggleBgImage(1);
        }
    },
    /**
     * 移动滚动条方案
     * @param key
     * @param btn
     */
    downMoveLoaderModules: function (key, btn) {
        var sid = btn.cSid;                                  // 取的样式类别
        var cutNumber = +btn.id.slice(btn.id.length - 1);    // 截取模块行数索引值
        var indexNumber = +btn.id.slice(5, 6) + 1;           // 截取加载模块索引值
        switch (true) {
            //   向下滚动
            case key == 'down' && cutNumber > 3:
                // 当且仅当第二行向下移动才加载下一个模块
                if (indexNumber >= GConfigData.navConfig.length) {
                    Home.loadIndex = GConfigData.navConfig.length - 1;
                    return;
                }
                Home.loadIndex = indexNumber;
                Home.loadContainer(Home.loadIndex, NavClassType[Home.loadIndex]);
                if (NavClassType[Home.loadIndex] == 1) {
                    Home.scrollDistanceTop(530);
                } else if (NavClassType[Home.loadIndex] == 2) {
                    Home.scrollDistanceTop(650);
                }
                break;
            //    向上滚动
            case key == 'up' && cutNumber < 4 :
                Home.loadContainer(Home.loadIndex, NavClassType[Home.loadIndex]);
                var seekTop = 0;
                if (NavClassType[Home.loadIndex] == 1) {
                    seekTop = -530;
                } else if (NavClassType[Home.loadIndex] == 2) {
                    seekTop = -650;
                }
                Home.scrollDistanceTop(seekTop);
                if (Home.loadIndex > 1) {
                    Home.loadIndex = Home.loadIndex - 1;
                }
                break;
        }
    },
    // 滚动条移动距离(显示对应模块，显、隐底部提示)
    scrollDistanceTop: function (dis, type) {
        var scrollTopDom = G('container');
        Home.backFocus = false;
        if (RenderParam.carrierId == '10220094' || RenderParam.carrierId == '10220095') {
            var stbModel = LMEPG.STBUtil.getSTBModel();
            //var stbModel = 'Q21A_pub_jljlt'
            if (stbModel == 'Q21A_pub_jljlt' || stbModel == 'JLJDX_Q21' || stbModel == 'Q21A_jljdx') {

                //G('container')['scrollTop'] = dis === 0 ? 0 : Home.offerHeight + dis;

                //var allWin = document.getElementsByTagName('body')[0];
                var allWin = G('container');

                Home.offerHeight = Home.offerHeight + dis;
                if (dis === -530) {
                    Home.offerHeight = 0
                }

                if (type === 'huawei' && dis === 0) {
                    Home.offerHeight = 0
                }

                // if(dis == -530 ){
                //     dis = -425;
                //     Home.offerHeight = Home.offerHeight + dis ;
                //     allWin.setAttribute("style",'top:80px;height:640px');
                //     return;
                // }else if(dis == 0){
                //     Home.offerHeight = 0;
                //     allWin.setAttribute("style",'top:80px;height:640px');
                //     return;
                // }else if(dis == 650){
                //     dis = 500;
                //     Home.offerHeight = Home.offerHeight + dis ;
                // }else{
                //     Home.offerHeight = Home.offerHeight + dis ;
                // }

                allWin.setAttribute("style", 'top:' + (80 - Home.offerHeight) + 'px;height:' + Math.max((640 + Home.offerHeight), 640) + 'px');
            } else {
                scrollTopDom.scrollTop = dis === 0 ? 0 : scrollTopDom.scrollTop + dis;
            }

        } else {
            scrollTopDom.scrollTop = dis === 0 ? 0 : scrollTopDom.scrollTop + dis;
        }
    },
    toggleBgImage: function (n) {
        n == 0 ? H('toggle-bg') : S('toggle-bg');
    },
    underBottomTips: function (value) {
        G('bottom-tips').innerHTML = value;
    },
    initButtons: function (id) {
        id = id ? id : RenderParam.focusIndex;
        LMEPG.ButtonManager.requestFocus(id);
        //LMEPG.ButtonManager.init(id, buttons, "", true);
    },
    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },

    // 推荐位点击
    onClickRecommendPosition: function (btn) {
        switch (btn.id) {
            default:

                if (btn.id == "videoTv-link") {
                    var data = btn.cBanner;
                } else {
                    var data = GConfigData.getRecommendData(btn.cNavId, btn.cPosition);
                }
                if (data == null) {
                    return;
                }
                // 统计推荐位点击事件
                // LMEPG.StatManager.statRecommendEvent(data.position, data[btn.cIdx].order);


                switch (parseInt(data[btn.cIdx].entry_type)) {
                    case HomeEntryType.VIDEO_VISIT_BY_DEPART:
                        //视频问诊-科室
                        Page.jumpVideoVisitByDepart();
                        break;
                    case HomeEntryType.VIDEO_VISIT_BY_DOCTOR:
                        //视频问诊-医生
                        Page.jumpVideoVisitByDoctor();
                        break;
                    case HomeEntryType.ACTIVITYS:
                        // 活动
                        var params = JSON.parse(data[btn.cIdx].parameters);
                        var activityName = params[0].param;
                        Page.jumpActivityPage(activityName);
                        break;
                    case HomeEntryType.ALBUM_UI:
                        Page.jumpAlbumPage(JSON.parse(data[btn.cIdx].parameters)[0].param, btn);
                        break
                    case HomeEntryType.HEALTH_VIDEO_BY_TYPES:
                        // 更多视频
                        var innerParams = JSON.parse(data[btn.cIdx].inner_parameters);
                        var params = JSON.parse(data[btn.cIdx].parameters);
                        var modeTitle = innerParams.title;
                        var modeType = params[0].param;
                        Page.jumpHealthVideoHome(modeTitle, modeType, '1');
                        break;
                    case HomeEntryType.HEALTH_VIDEO:
                        // 视频播放
                        var videoObj = data[btn.cIdx].inner_parameters instanceof Object ? data[btn.cIdx].inner_parameters : JSON.parse(data[btn.cIdx].inner_parameters);
                        var videoUrl = RenderParam.platformType == 'hd' ? videoObj.ftp_url.gq_ftp_url : videoObj.ftp_url.bq_ftp_url;
                        var sourceId = JSON.parse(data[btn.cIdx].parameters)[0].param;
                        // 创建视频信息
                        var videoInfo = {
                            'sourceId': sourceId,
                            'videoUrl': encodeURIComponent(videoUrl),
                            'title': videoObj.title,
                            'type': videoObj.model_type,
                            'userType': videoObj.user_type,
                            'freeSeconds': videoObj.free_seconds,
                            'entryType': 1,
                            'entryTypeName': 'home',
                            'focusIdx': btn.id,
                            'unionCode': videoObj.union_code,
                            "show_status": videoObj.show_status,
                        };
                        //视频专辑下线处理
                        if (videoInfo.show_status == "3") {
                            LMEPG.UI.showToast('该节目已下线');
                            return;
                        }

                        if (Home.isAllowPlay(videoInfo)) {
                            Page.jumpPlayVideo(videoInfo);
                        } else {
                            Page.jumpBuyVip(videoInfo.title, videoInfo);
                        }
                        break;
                    case HomeEntryType.DEVICE_STORES:
                        //设备商城
                        Page.jumpDeviceStore();
                        break;
                    case HomeEntryType.DEVICE_STORES_BY_ID:
                        //设备商城商品
                        Page.jumpDeviceStoreById();
                        break;
                    case HomeEntryType.HOME_PAGE:
                        Page.jumpHomeUI();
                        //首页
                        break;
                    case HomeEntryType.VIDEO_VISIT_HOME:
                        // LMEPG.UI.showToast("该功能还未开放！");
                        // return;
                        Page.jumpVideoVisitHome();
                        //视频问诊
                        break;
                    case HomeEntryType.DOCTOR_CONSULTATION_HOME:
                        Page.jump39Hospital();
                        break;
                    case HomeEntryType.MY_FIMILY_HOME:
                        Page.jumpMyFamilyUI();
                        //我的家
                        break;
                    case HomeEntryType.HEALTH_VIDEO_HOME:
                        //健康视频首页
                        var innerParams = JSON.parse(data[btn.cIdx].inner_parameters);
                        var params = JSON.parse(data[btn.cIdx].parameters);
                        var modeTitle = innerParams.title;
                        var modeType = params[0].param;
                        Page.jumpHealthVideoHome(modeTitle, modeType, '1');
                        break;
                    case HomeEntryType.HEALTH_VIDEO_SUBJECT:
                        // 专辑
                        //if (HomeEntryType.FREE_ALBUM) {
                        // 绝对地址
                        //   Page.jumpAlbumPage(btn.albumName);
                        //} else {
                        // 配置地址
                        //健康视频首页
                        var params = JSON.parse(data[btn.cIdx].parameters);
                        var albumName = params[0].param;
                        Page.jumpAlbumPage(albumName);
                        //}
                        break;
                    case HomeEntryType.FREE_ALBUM:
                        Page.jumpAlbumPage(btn.albumName);
                        break;
                    case HomeEntryType.GUAHAO_HOME:
                        // 挂号主页
                        Page.jumpGuaHaoPage();
                        break;
                    case HomeEntryType.GUAHAO_BY_HOSP:
                        //挂号-医院
                        Page.jumpGuaHaoByHospital(data.source_id);
                        break;
                    case HomeEntryType.USER_GUIDE:
                        //用户指南
                        Page.jumpUserGuide();
                        break;
                    case HomeEntryType.HEALTH_MEASURE:
                        //健康检测
                        Page.jumpHealthMeasure();
                        break;
                    case HomeEntryType.EXPERT_CONSULTATION:
                        Page.jumpExpertConsultation();
                        //专家约诊
                        break;
                    case HomeEntryType.EXPERT_CONSULTATION_REMIND:
                        //专家约诊消息提醒
                        Page.jumpExpertConsultationRemind();
                        break;
                    case HomeEntryType.SEARCH:
                        //搜索
                        Page.jumpSearchPage();
                        break;
                    case HomeEntryType.EPIDEMIC:
                        //搜索
                        Page.jumpEpidemic();
                        break;
                    case HomeEntryType.HEALTH_SUBMIT:
                        //健康主题，图文专辑

                        var albumName = JSON.parse(data[btn.cIdx].parameters)[0].param;
                        Page.jumpHealthSubmit(albumName);
                        break;
                }
                break;
        }
    },

    /**
     * 校验视频是否允许播放
     * @param videoInfo
     */
    isAllowPlay: function (videoInfo) {
        if (RenderParam.isVip == 1) {
            // vip用户可以观看
            return true;
        }

        if (videoInfo.userType == 0 || videoInfo.userType == 1) {
            // 视频允许免费用户观看
            return true;
        }

        if (parseInt(videoInfo.freeSeconds) > 0) {
            // 视频有免费观看时长
            return true;
        }

        return false;
    }
};

//页面跳转控制
var Page = {
    getCurrentPage: function () {
        var current = LMEPG.ButtonManager.getCurrentButton();
        var objCurrent = LMEPG.Intent.createIntent('menuTab');
        objCurrent.setParam('pageIndex', RenderParam.index);
        objCurrent.setParam('focusIndex', current.id);
        return objCurrent;
    },
    /**
     * 跳转 - 挽留页
     */
    jumpHoldPage: function () {
        var objHome = this.getCurrentPage();

        var objHold = LMEPG.Intent.createIntent('hold');
        objHold.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objHold, objHome, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },
    // 退出应用。
    exitAppHome: function () {
        switch (RenderParam.carrierId) {
            case '340092':
                // 安徽电信EPG
                if (typeof Utility !== 'undefined') {
                    Utility.setValueByName('exitIptvApp');
                } else {
                    LMEPG.Intent.back();
                }
                break;
            case '520094':
                // 贵州广电
                starcorCom.exit();
                break;
            case '630092':
                //青海电信
                LMEPG.Intent.back('IPTVPortal');
                break;
            case '440094':
                window.location.href = 'main://index.html';
                break;
            case '520092':
                if (RenderParam.lmp == '23' || RenderParam.lmp == '11') {
                    LMEPG.Intent.back('IPTVPortal');
                } else if (typeof Utility !== 'undefined') {
                    Utility.setValueByName('exitIptvApp');
                } else {
                    LMEPG.Intent.back();
                }
                break;
            default:
                LMEPG.Intent.back('IPTVPortal');
                break;
        }
    },

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('home');
        currentPage.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        currentPage.setParam('scrollTop', G('container').scrollTop);
        currentPage.setParam('loadIndex', Home.loadIndex);

        return currentPage;
    },

    /**跳转到3983测试页*/
    jumpTestPage: function () {
        var objHome = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('testEntrySet');
        objDst.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objDst, objHome);
    },
    /**
     * 跳转->home主页面
     */
    jumpHomeUI: function () {
        Page.jumpHomeTab('home');
    },

    /**
     * 跳转->挂号
     */
    jumpGuaHaoPage: function () {
        var objCurrent = Page.getCurrentPage();
        var objGuaHao = LMEPG.Intent.createIntent('appointmentRegister');
        objGuaHao.setParam('focusIndex', '');

        LMEPG.Intent.jump(objGuaHao, objCurrent);
    },
    /**
     * 跳转->我的家页面
     */
    jumpMyFamilyUI: function () {
        var objCurrent = Page.getCurrentPage();
        var objMyFamily = LMEPG.Intent.createIntent('familyIndex');
        objMyFamily.setParam('focusIndex', '');

        LMEPG.Intent.jump(objMyFamily, objCurrent);
    },

    /**
     * 视频问诊主页
     */
    jumpVideoVisitHome: function () {
        // if (RenderParam.carrierId == '520092') {
        //     LMEPG.UI.showToast("本功能暂未开放");
        //     return;
        // }
        var objCurrent = Page.getCurrentPage();

        var objDoctorP2P = LMEPG.Intent.createIntent('doctorIndex');
        objDoctorP2P.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objDoctorP2P, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转->39互联网医院模块
     */
    jump39Hospital: function () {
        var objCurrent = Page.getCurrentPage();

        var objHome = LMEPG.Intent.createIntent('new39hospital');
        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转->视频问诊-科室
     */
    jumpVideoVisitByDepart: function () {

    },

    /**
     * 跳转->设备商城首页
     */
    jumpDeviceStore: function () {

    },

    /**
     * 跳转->设备商城，商品详情页
     */
    jumpDeviceStoreById: function () {

    },

    /**
     * 跳转->挂号-医院详情页
     */
    jumpGuaHaoByHospital: function (hospitalId) {
        var objCurrent = Page.getCurrentPage();

        var objDst = LMEPG.Intent.createIntent('department');
        objDst.setParam('hospital_id', hospitalId);
        objDst.setParam('is_province', 0);
        LMEPG.Intent.jump(objDst, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转->用户指南
     */
    jumpUserGuide: function () {

    },

    /**
     * 跳转->健康检测
     */
    jumpHealthMeasure: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('testIndex');
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     *  跳转->专家约诊首页
     */
    jumpExpertConsultation: function () {
        var objCurrent = Page.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('expertHome');
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转->专家约诊消息提醒
     */
    jumpExpertConsultationRemind: function () {

    },

    /**
     * 跳转->视频问诊-医生
     */
    jumpVideoVisitByDoctor: function () {

    },

    /**
     * 跳转->home页面
     * @param tabName 将要跳转的栏目路由名称
     * @param focusIndex 跳转到指定栏目页时让其默认焦点保持在哪个按钮上
     */
    jumpHomeTab: function (tabName, focusIndex) {
        var objCurrent = Page.getCurrentPage();

        var objHome = LMEPG.Intent.createIntent(tabName);
        objHome.setParam('focusIndex', focusIndex);

        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 跳转 - 搜索页
     * */
    jumpSearchPage: function () {
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '1');
        objHome.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        objHome.setParam('page', '0');

        var objSearch = LMEPG.Intent.createIntent('search');
        objSearch.setParam('userId', RenderParam.userId);
        objSearch.setParam('position', 'tab1');


        LMEPG.Intent.jump(objSearch, objHome);
    },

    /**
     * 疫情模块接口
     */
    jumpEpidemic: function () {
        var objHome = Page.getCurrentPage();

        var objEpidemic = LMEPG.Intent.createIntent('report-index');
        objEpidemic.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objEpidemic, objHome);
    },
    //健康主题，图文专辑
    jumpHealthSubmit: function (albumName) {
        var objHome = Page.getCurrentPage();

        var objHealthSubmit = LMEPG.Intent.createIntent('album');
        objHome.setParam('albumName', albumName);
        objHealthSubmit.setParam('userId', RenderParam.userId);
        objHealthSubmit.setParam('albumName', albumName);
        objHealthSubmit.setParam('inner', 1);

        LMEPG.Intent.jump(objHealthSubmit, objHome);
    },


    /**
     * 跳转到订购信息页
     */
    jumpPayInfo: function () {
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '1');
        objHome.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        objHome.setParam('page', '0');

        var objSearch = LMEPG.Intent.createIntent('payInfo');
        objSearch.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objSearch, objHome);
    },
    // 跳转到收藏
    jumpCollection: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('collect');
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转 -- 更多视频页
     */
    jumpHealthVideoHome: function (modeTitle, modeType, page) {
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '2');

        var objChannel = LMEPG.Intent.createIntent('healthVideoList');
        objChannel.setParam('userId', RenderParam.userId);
        objChannel.setParam('page', typeof (page) === 'undefined' ? '1' : page);
        objChannel.setParam('modeTitle', modeTitle);
        objChannel.setParam('modelType', modeType);
        LMEPG.Intent.jump(objChannel, objHome);
    },

    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName) {
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '2');

        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转 -- 活动页面
     * @param activityName
     */
    jumpActivityPage: function (activityName) {
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '2');

        var objActivity = LMEPG.Intent.createIntent('activity');
        objActivity.setParam('userId', RenderParam.userId);
        objActivity.setParam('activityName', activityName);
        objActivity.setParam('inner', 1);
        LMEPG.Intent.jump(objActivity, objHome);
    },
    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName) {
        var objHome = Page.getCurrentPage();
        var objAlbum = LMEPG.Intent.createIntent('album');
        objHome.setParam('albumName', albumName);
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },


    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast('视频信息为空！');
            return;
        }

        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '2');

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
    },

    /**
     * 跳转 -- 订购页
     * @param remark        订购来源（标示）
     * @param videoInfo     如果视频正在播放，播放视频的信息。
     * @param singlePayItem 是否是单订购
     */
    jumpBuyVip: function (remark, videoInfo, singlePayItem) {

        if (RenderParam.carrierId == '10220095' && RenderParam.isVip == 1) {
            LMEPG.UI.showToast("您已经订购，请勿重复订购");
            return;
        }

        if (typeof (videoInfo) !== 'undefined' && videoInfo !== '') {
            var postData = {
                'videoInfo': JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
            });
        }
        var objHome = Page.getCurrentPage();
        objHome.setParam('userId', RenderParam.userId);
        objHome.setParam('classifyId', Home.classifyId);
        objHome.setParam('fromId', '1');
        objHome.setParam('page', '0');

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('userId', RenderParam.userId);
        objOrderHome.setParam('remark', remark);
        if (LMEPG.Func.isExist(videoInfo)) {
            objOrderHome.setParam('isPlaying', 1);
        } else {
            objOrderHome.setParam('isPlaying', -1);
        }
        objOrderHome.setParam('singlePayItem', typeof (singlePayItem) !== 'undefined' ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objHome);
    },
};

var onBack = function () {


    if (Home.backFocus) {
        if (RenderParam.carrierId == '10220094' || RenderParam.carrierId == '10220095') {
            Page.jumpHoldPage();
            return;
        }
        // 返回局方大厅
        LMEPG.mp.destroy();
        Page.exitAppHome();
    } else {
        // 返回顶部
        Home.scrollDistanceTop(0, 'huawei');
        Home.moveToFocus('videoTv-link');
        Home.backFocus = true;
    }
}
window.onload = function () {
    Home.init();
    G('default_link').focus(); // 吉林电信(魔方)进入应用时，需要手动获取页面焦点
    lmInitGo();
};

// 结束页面
window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};