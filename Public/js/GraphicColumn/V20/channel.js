// 定义全局按钮
var pageCurrent = 1;
var cutNum = 9;
var buttons = [];
var videoList;                //视频数据列表
var pageNum;                  //总页数

// 当前右侧已加载的数据属于左侧的哪个分类，数据加载成功才赋值
var curModelType = !LMEPG.Func.isEmpty(RenderParam.modelType) ? RenderParam.modelType : 0;
// 当前右侧已加载视频
var curVideoList = RenderParam.graphicList;

// 返回按键
function onBack() {
    Page.onBack();
}

var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("graphicColumn");
        currentPage.setParam("modelType", curModelType);
        currentPage.setParam("modelTitle", RenderParam.modelTitle);
        currentPage.setParam("focusIndex", LMEPG.ButtonManager.getCurrentButton().id);
        currentPage.setParam("pageCurrent", pageCurrent);
        currentPage.setParam("navFocusIndex", LMEPG.ButtonManager.getSelectedButton("nav").id);
        // currentPage.setParam("navPageCurrent", Nav.page);
        return currentPage;
    },

    /**
     * 跳转 -- 订购页
     * @param remark        订购来源（标示）
     * @param videoInfo     如果视频正在播放，播放视频的信息。
     * @param singlePayItem 是否是单订购
     */
    jumpBuyVip: function (remark, videoInfo, singlePayItem) {
        if (typeof (videoInfo) !== "undefined" && videoInfo !== "") {
            var postData = {
                "videoInfo": JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
            });
        }
        var objcurrent = Page.getCurrentPage();

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("remark", remark);
        objOrderHome.setParam("isPlaying", 1);
        objOrderHome.setParam("singlePayItem", typeof (singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objcurrent);
    },

    /**
     * 返回事件
     */
    onBack: function () {
        LMEPG.Intent.back();
    }
};

var Channel = {
    init: function () {
        // 右侧数据页数恢复
        pageCurrent = LMEPG.Func.isEmpty(RenderParam.pageCurrent) ? 1 : parseInt(RenderParam.pageCurrent);

        Nav.init();
        if (Nav.createNavPart(RenderParam.columnList.list)) { // 视频分类导航
            List.createList(RenderParam.graphicList); // 视频数据
        }
        Channel.initButtons(); // 初始化焦点按钮
    },

    /**
     * 初始化参数
     */
    initData: function () {
        if (LMEPG.Func.isExist(RenderParam.videoChannel)) {
            if (RenderParam.videoChannel.result == 0) {
                videoList = RenderParam.videoChannel.list;
                if (LMEPG.Func.isExist(videoList)) {
                    if (videoList.length > 0) {
                        pageNum = Math.ceil(videoList.length / cutNum);
                        return true;
                    } else {
                        LMEPG.UI.showToast("更多视频,视频长度为0");
                    }
                } else {
                    LMEPG.UI.showToast("更多视频总数据为空");
                }
            } else {
                LMEPG.UI.showToast("获取更多视频数据失败:" + RenderParam.videoChannel.result);
            }
        } else {
            LMEPG.UI.showToast("更多视频总数据为空");
        }
        return false;
    },

    /**
     * 初始化焦点按钮。应当在页面渲染完毕后，最后一步再调用设置焦点按钮。
     */
    initButtons: function () {
        Channel.initRecommendPosition();       // 初始化界面

        if (curModelType == 0) {
            if (RenderParam.columnList.list.length > 0) {
                curModelType = RenderParam.columnList.list[0].class_id;
            }
        }
        var focusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? "recommended_1" : RenderParam.focusIndex;
        LMEPG.ButtonManager.init([], buttons, "", true);

        // 左侧导航被选中状态恢复
        var lastNavSelected = RenderParam.navFocusIndex;
        if (!LMEPG.Func.isEmpty(lastNavSelected)) {
            LMEPG.ButtonManager.setSelected(lastNavSelected, true);
        } else {
            LMEPG.ButtonManager.setSelected("btn-nav-" + (Nav.currNavIndex + 1), true);//默认选中第一个导航栏
        }

        // 右侧无数据，焦点选中左侧导航
        /* if (RenderParam.videoList.list.length + RenderParam.videoList['album_list']['length']== 0){
             LMEPG.BM.requestFocus("btn-nav-1");
         } else {
             LMEPG.BM.requestFocus(focusId);
         }*/
        LMEPG.BM.requestFocus(focusId);
    },

    // 初始化界面
    initRecommendPosition: function () {
        for (var i = 0; i < cutNum; i++) {
            var downBtn = (i + 1) + 3;
            var upBtn = (i + 1) - 3;
            buttons.push({
                id: 'recommended_' + (i + 1),
                name: '推荐位',
                type: 'img',
                nextFocusLeft: 'recommended_' + i,
                nextFocusRight: 'recommended_' + (i + 2),
                nextFocusUp: 'recommended_' + upBtn,
                nextFocusDown: 'recommended_' + downBtn,
                backgroundImage: "",
                focusImage: "",
                cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_video.png",
                click: Channel.onClickRecommendPosition,
                focusChange: Channel.recommendedFocus,
                beforeMoveChange: Channel.onRecommendBeforeMoveChange,
                cPosition: i //位置编号
            });
        }
        buttons.push({
            id: 'search',
            name: '搜索',
            type: 'img',
            nextFocusLeft: 'btn-nav-1',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommended_1',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V20/Nav/search.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V20/Nav/search_f.png",
            click: Channel.onClickSearch,
            focusChange: "",
            groupId: "nav",
            beforeMoveChange: "",
            cPosition: i //位置编号
        });


    },

    // 侧边导航栏焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended_hover");
            LMEPG.UI.Marquee.start(btn.id + "_title", 10, 5, 50, "left", "scroll");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended_hover");
            LMEPG.UI.Marquee.stop();

        }
    },

    // 侧边导航栏焦点效果
    navFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.ButtonManager.setSelected(btn.id, true);
            // LMEPG.UI.Marquee.start(btn.id + "_title", 13, 5, 50, "left", "scroll");

            // 导航栏获取焦点，并且右边的数据不属于此分类，则加载数据
            var pos = G(btn.id).getAttribute("pos");
            var focusModelType = RenderParam.columnList.list[pos].class_id;
            G("title").innerHTML = RenderParam.columnList.list[pos].show_title;
            if (curModelType != focusModelType) {
                pageCurrent = 1;
                List.getGraphicList(focusModelType);
            }
        } else {
            // LMEPG.CssManager.removeClass(btn.id, "recommended_hover")
            // LMEPG.UI.Marquee.stop();
        }
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                switch (current.id) {
                    case 'recommended_1':
                    case 'recommended_4':
                    case 'recommended_7':
                        var navId = LMEPG.ButtonManager.getSelectedButton("nav").id;
                        LMEPG.BM.requestFocus(navId);
                        return false;
                }
                break;
            case 'right':
                // switch (current.id) {
                //     case 'recommended_6':
                //     case 'recommended_3':
                //     case 'recommended_9':
                //         List.nextMenu();
                //         return false;
                // }
                break;
            case 'down':
                /*                switch (current.id) {
                 case 'recommended_1':
                 case 'recommended_2':
                 case 'recommended_3':
                 case 'recommended_4':
                 case 'recommended_5':
                 case 'recommended_6':
                 var nextFocusDownId = LMEPG.Func.gridBtnUtil.getNextFocusDownId(current);
                 if (!LMEPG.Func.isEmpty(nextFocusDownId)) {
                 LMEPG.BM.requestFocus(nextFocusDownId);
                 } else {
                 var nextRightBtn = null;
                 if (current.id == 'recommended_2' || current.id == 'recommended_5') {
                 nextRightBtn = LMEPG.BM.getButtonById(current.nextFocusRight, true);
                 if (!LMEPG.Func.isEmpty(nextRightBtn))
                 nextRightBtn = LMEPG.BM.getButtonById(nextRightBtn.nextFocusRight, true);
                 } else if (current.id == 'recommended_3' || current.id == 'recommended_6') {
                 nextRightBtn = LMEPG.BM.getButtonById(current.nextFocusRight, true);
                 if (!LMEPG.Func.isEmpty(nextRightBtn))
                 var nextRightBtnTmp = LMEPG.BM.getButtonById(nextRightBtn.nextFocusRight, true);
                 if (!LMEPG.Func.isEmpty(nextRightBtnTmp)) {
                 nextRightBtn = nextRightBtnTmp;
                 }
                 }
                 if (LMEPG.Func.isExist(nextRightBtn)) {
                 LMEPG.BM.requestFocus(nextRightBtn.id);
                 }
                 }
                 return false;
                 }*/
                switch (current.id) {
                    case 'recommended_7':
                    case 'recommended_8':
                    case 'recommended_9':
                        List.nextMenu();
                        return false;
                        break;
                    case 'btn-nav-7':
                        Nav.nextPage();
                        break;
                }
                break;
            case 'up':
                switch (current.id) {
                    case 'recommended_1':
                    case 'recommended_2':
                    case 'recommended_3':
                        List.preMenu(current.id);
                        return false;
                        break;
                    case 'btn-nav-1':
                        Nav.prevPage();
                        break;
                }
                break;
        }
    },

    // onClickNav:function (btn) {
    //     LMEPG.ButtonManager.setSelected(btn.id, true);
    // },

    // 推荐位点击
    onClickRecommendPosition: function (btn) {
        if (LMEPG.Func.isExist(videoList)) {
            var index = (pageCurrent - 1) * cutNum + btn.cPosition;
            if (index < videoList.length) {
                var data = videoList[index];
                var objSrc = Page.getCurrentPage();
                var objDst = LMEPG.Intent.createIntent('album');
                objDst.setParam("albumName", "TemplateAlbum");
                objDst.setParam("graphicId", data.tuwen_id);
                LMEPG.Intent.jump(objDst, objSrc);
            }
        }
    },

    /**
     * 点击搜索按钮
     */
    onClickSearch: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("search");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    }
};

var List = {
    // 创建菜单
    createList: function (data) {
        if (data.result != 0) {
            LMEPG.UI.showToast("数据加载失败");
            return;
        }

        LMEPG.UI.Marquee.stop();
        var tab_list = document.getElementById("center");//数据块
        var strTable = '';
        var start = (pageCurrent - 1) * cutNum;//数组截取起始位置
        var end = pageCurrent * cutNum;//数组截取终止位置
        // 专辑和视频数组合并
        videoList = data.list;

        // 计算总页数
        pageNum = Math.ceil(videoList.length / cutNum);
        if(videoList.length == 0){
            List.updateMenuArrows();
            G("pages").innerHTML = '0/0';
            tab_list.innerHTML = '<p>暂无数据</p>';
            return
        }

        var newArr = videoList.slice(start, end);
        var defaultImg = "'" + g_appRootPath + "/Public/img/hd/Home/V10/default.png" + "'";
        tab_list.innerHTML = "";
        for (var i = 0; i < newArr.length; i++) {
            strTable += '<div class="recommended"> ';
            strTable += '<div id="recommended_' + (i + 1) + '" class="recommended_block"> ';
            strTable += '<img id="recommended_' + (i + 1) + '_bg" class="recommended_img" src="' + addFsUrl(newArr[i].img_url) + '" onerror="this.src=' + defaultImg + '" /> ';
            strTable += '<div id="recommended_' + (i + 1) + '_title" class="recommended_title" >' + newArr[i].title + '</div> ';


            // // 视频vip角标，专辑不显示
            // if (newArr[i].subject_id == undefined || newArr[i].subject_id == null) {
            //     if (isShowVip(newArr[i])) {
            //         strTable += '<img id="vip_icon" class="vip_icon" src="' + g_appRootPath + '/Public/img/hd/Home/V10/icon_vip.png"/>';
            //     }
            // }
            // // 专辑显示集数
            // else {
            //     var content_cnt = newArr[i].content_cnt;
            //     content_cnt = parseInt(content_cnt);
            //     if (content_cnt >= 0 && content_cnt <= 9) {
            //         content_cnt = "0" + content_cnt;
            //     }
            //     strTable += '<div id="recommended_' + (i + 1) + '_title" class="recommended_title">' + content_cnt + '全集</div> ';
            // }
            strTable += '</div></div>';
        }
        tab_list.innerHTML = strTable;
        G("pages").innerHTML = pageCurrent + '/' + pageNum;
        // EpgClass.updatePosition();
        List.updateMenuArrows();
    },
    //遥控器左按键翻页
    preMenu: function (btn) {
        if (pageCurrent > 1) {
            pageCurrent--;
            List.createList(curVideoList);
            LMEPG.ButtonManager.requestFocus("recommended_1");
        } else {
            if(btn == 'recommended_1' || btn == 'recommended_2' || btn == 'recommended_3'){
                LMEPG.ButtonManager.requestFocus("search");
                return false;
            }
        }
    },
    updateMenuArrows: function () {
        var page_right = document.getElementById("arrow_pre");
        var page_left = document.getElementById("arrow_next");
        page_right.style.display = "none";
        page_left.style.display = "none";
        if (pageCurrent > 1) {
            page_right.style.display = "block";
        }
        if (pageCurrent < pageNum) {
            page_left.style.display = "block";
        }
    },

    //向下翻页事件
    nextMenu: function () {
        if (pageCurrent < pageNum) {
            pageCurrent++;
            List.createList(curVideoList);
            LMEPG.ButtonManager.requestFocus("recommended_1");
        } else {

        }
    },

    /**
     * 获取对应分类视频列表
     * @param modelType
     */
    getGraphicList: function (modelType) {
        var postData = {"model_type": modelType};
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("Graphic/getGraphicList", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            var data = JSON.parse(data);

            if (data.result == 0) {
                curModelType = modelType;
                curVideoList = data;
            }
            List.createList(data);
        });
    }
};

var Nav = {
    currNavIndex: RenderParam.navFocusIndex,
    count: 7,
    page: 0,
    init: function () {
        // 处理外部进入某个分类时，计算页数和位置
        var data = RenderParam.columnList.list;
        var navPos = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].class_id == curModelType) {
                navPos = i;
                G("title").innerHTML = data[i].show_title;
                break;
            }
        }
        this.page = navPos < this.count ? 0 : (navPos - this.count + 1);    // 第几页
        this.currNavIndex = navPos < this.count ? navPos : this.count - 1; // 第几个
    },

    // 翻页数据截取
    cut: function (arr, atMove, count) {
        return arr.slice(atMove, atMove + count);
    },
    /**
     * 创建视频分类
     */
    createNavPart: function (data) {
        if (RenderParam.columnList.result != 0) {
            LMEPG.UI.showToast("数据加载失败！");
            return false;
        } else if (RenderParam.columnList.list.length == 0) {
            return false;
        }

        var htmlStr = "";
        var navList = Nav.cut(data, this.page, this.count);
        for (var i = 0; i < navList.length; i++) {
            htmlStr += '<img id="btn-nav-' + (i + 1) + '" pos="' + (i + this.page) + '"  class="nav-btn"/>';
            if (data[i + this.page].img_url instanceof Object) {
                var tempJson = data[i + this.page].img_url;
            } else {
                var tempJson = JSON.parse(data[i + this.page].img_url);
            }

            buttons.push({
                id: 'btn-nav-' + (i + 1),
                name: '导航',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommended_1',
                nextFocusUp: 'btn-nav-' + i,
                nextFocusDown: 'btn-nav-' + (i + 2),
                backgroundImage: RenderParam.fsUrl + tempJson.normal,
                focusImage: RenderParam.fsUrl + tempJson.focus_in,
                selectedImage: RenderParam.fsUrl + tempJson.focus_out,
                click: "",
                focusChange: Channel.navFocus,
                groupId: "nav",
                beforeMoveChange: Channel.onRecommendBeforeMoveChange,
                cPosition: i //位置编号
            });
        }
        G("list").innerHTML = htmlStr;
        Nav.upArrow(data);

        return true;
    },

    prevPage: function () {
        if (Nav.page > 0) {
            Nav.page--;
            Nav.createNavPart(RenderParam.columnList.list);
            LMEPG.ButtonManager.init("btn-nav-1", buttons, "", true);
            //LMEPG.ButtonManager.requestFocus("btn-nav-1");
        } else {
            // LMEPG.ButtonManager.requestFocus("search");
            // return false;
        }
    },

    nextPage: function (focusIndex) {
        var data =RenderParam.columnList && RenderParam.columnList.list;
        if (data && Nav.page < data.length - Nav.count) {
            Nav.page++;
            Nav.createNavPart(RenderParam.columnList.list);
            if (typeof focusIndex !== "undefined") {
                LMEPG.ButtonManager.init(focusIndex, buttons, "", true);
            } else {
                LMEPG.ButtonManager.init("btn-nav-7", buttons, "", true);
            }
            //LMEPG.ButtonManager.requestFocus("btn-nav-6");
        } else {

        }
    },

    upArrow: function (data) {
        var navList = (data.length) - Nav.page;
        G("nav-pre").style.display = "none";
        G("nav-next").style.display = "none";
        if (Nav.page > 0) {
            G("nav-pre").style.display = "block";
        }
        ;
        if (navList > Nav.count) {
            G("nav-next").style.display = "block";
        }
    }
};

var EpgClass = {
    START_TOP: "",//初始高度
    START_LEFT: "",//初始横坐标
    START_WIDTH: "",//初始宽度
    START_HEIGHT: "",//初始高度
    ZOOM: 1.1,//放大倍数
    PADDING: 42,
    DRAG: 100,//抖动值
    //epg标清盒子放大效果
    epgFocus: function (btn, hasFocus) {
        if (hasFocus) {
            EpgClass.START_HEIGHT = parseInt(getPropertyValue(btn.id + "_bg", "height")) + "px";
            EpgClass.START_WIDTH = parseInt(getPropertyValue(btn.id + "_bg", "width")) + "px";
            // EpgClass.START_TOP = parseInt(getPropertyValue(btn.id+"_bg", "top")) + "px";
            // EpgClass.START_LEFT = parseInt(getPropertyValue(btn.id+"_bg", "left")) + "px";
            var boxUrl = btn.cIconBox;
            G(btn.id + "_bg").style.background = 'url("' + boxUrl + '")  no-repeat';
            G(btn.id + "_bg").style.backgroundPosition = 'center';
            G(btn.id + "_bg").style.width = parseInt(getPropertyValue(btn.id + "_bg", "width")) * EpgClass.ZOOM + "px";
            G(btn.id + "_bg").style.height = parseInt(getPropertyValue(btn.id + "_bg", "height")) * EpgClass.ZOOM + "px";
            // G(btn.id+"_bg").style.top = parseInt(getPropertyValue(btn.id, "top")) - EpgClass.DRAG + "px";
            // G(btn.id+"_bg").style.left = parseInt(getPropertyValue(btn.id, "left")) - EpgClass.DRAG + "px";
        } else {
            G(btn.id + "_bg").style.background = 'url("")  no-repeat';
            G(btn.id + "_bg").style.width = EpgClass.START_WIDTH;
            G(btn.id + "_bg").style.height = EpgClass.START_HEIGHT;
            // G(btn.id + "_bg").style.top = EpgClass.START_TOP;
            // G(btn.id + "_bg").style.left = EpgClass.START_LEFT;
        }
    },
    // 界面渲染调整;
    updatePosition: function () {
        for (var i = 1; i < 7; i++) {
            // if (i != 2) {
            G("recommended_" + i + "_bg").style.padding = EpgClass.PADDING + "px";
            G("recommended_" + i + "_bg").style.top = parseInt(getPropertyValue("recommended_" + i, "top")) - EpgClass.PADDING + "px";
            G("recommended_" + i + "_bg").style.left = parseInt(getPropertyValue("recommended_" + i, "left")) - EpgClass.PADDING + "px";
            // }
        }
    }
};

