// 定义全局按钮
var pageCurrent = 1;
var cutNum = 4;
var buttons = [];
var videoList;                //视频数据列表
var pageNum;                  //总页数
var isCollect = RenderParam.isCollect;
var curPageDataNum = -1; // 当前页面数据个数
var testFlag = false;
var allVideoInfo = []; // 全部视频集合
// 返回按键
function onBack() {
    Page.onBack();
}

var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("healthVideoSet");
        currentPage.setParam("modeType", RenderParam.modeType);
        currentPage.setParam("modeTitle", RenderParam.modeTitle);
        currentPage.setParam("focusIndex", LMEPG.ButtonManager.getCurrentButton().id);
        currentPage.setParam("pageCurrent", pageCurrent);
        // currentPage.setParam("navFocusIndex", LMEPG.ButtonManager.getSelectedButton("nav").id);
        currentPage.setParam("navPageCurrent", pageCurrent);
        currentPage.setParam("subject_id", RenderParam.subject_id);
        return currentPage;
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast("视频信息为空！");
            return;
        }

        var objcurrent = Page.getCurrentPage();

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));
        objPlayer.setParam("subjectId", RenderParam.albumDetail.data.subject_list[0].subject_id);

        LMEPG.Intent.jump(objPlayer, objcurrent);
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

        if (parseInt(RenderParam.pageCurrent) == -1) {
            pageCurrent == 1;
        }
        // pageCurrent = LMEPG.Func.isEmpty(RenderParam.pageCurrent) ? 1 : parseInt(RenderParam.pageCurrent)
        List.createList(pageCurrent); // 列表
        // Nav.createPagination(videoList); // 底部导航
        Channel.initButtons(); // 初始化焦点按钮
        List.initTopData(); // 顶部数据
        // G("pagination-1-title").style.color = "#011025";
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
        // 数据栏焦点恢复，分页恢复
        for (var i = 1; i < RenderParam.pageCurrent; i++) {
            List.nextMenu();
        }
        var focusId = "recommended_1";
        if (!LMEPG.Func.isEmpty(RenderParam.focusIndex)) {
            focusId = RenderParam.focusIndex;
        }
        LMEPG.ButtonManager.init(focusId, buttons, "", true);

        // 导航栏焦点恢复，分页恢复
        // for (var i = 0; i < RenderParam.navPageCurrent; i++) {
        //     Nav.nextPage();
        // }
        var lastNavSelected = RenderParam.navFocusIndex;
        if (!LMEPG.Func.isEmpty(lastNavSelected)) {
            LMEPG.ButtonManager.setSelected(lastNavSelected, true);
            LMEPG.BM.requestFocus(lastNavSelected);
            G(lastNavSelected + "-title").style.color = "#011025";
        } else {
            LMEPG.ButtonManager.setSelected("pagination-1", true);//默认选中第一个导航栏
            // LMEPG.BM.requestFocus("pagination-1");
            if (G("pagination-1-title")) G("pagination-1-title").style.color = "#011025";
        }

        if (!LMEPG.Func.isEmpty(RenderParam.focusIndex)) {
            LMEPG.BM.requestFocus(focusId);
        }
    },

    // 初始化界面
    initRecommendPosition: function () {
        for (var i = 0; i < cutNum; i++) {
            var downBtn = (i + 1) + 4;
            var upBtn = (i + 1) - 4;
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
                cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_video_2.png",
                click: Channel.onClickRecommendPosition,
                focusChange: Channel.recommendedFocus,
                beforeMoveChange: Channel.onRecommendBeforeMoveChange,
                cPosition: i, //位置编号
            });
        }
        buttons.push({
            id: 'collect',
            name: '收藏',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommended_1',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V22/Collect/uncollect.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V22/Collect/uncollect_f.png",
            cBackgroundImage: g_appRootPath + "/Public/img/hd/Home/V22/Collect/collect.png",
            cFocusImage: g_appRootPath + "/Public/img/hd/Home/V22/Collect/collect_f.png",
            uBackgroundImage: g_appRootPath + "/Public/img/hd/Home/V22/Collect/uncollect.png",
            uFocusImage: g_appRootPath + "/Public/img/hd/Home/V22/Collect/uncollect_f.png",
            click: Channel.onClickCollect,
            focusChange: "",
            beforeMoveChange: "",
            cType: "unCollect", //位置编号
        });


    },

    // 侧边导航栏焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended_hover");
            EpgClass.epgFocus(btn, hasFocus);
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended_hover");
            EpgClass.epgFocus(btn, hasFocus);
        }
    },

    // 侧边导航栏焦点效果
    navFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.ButtonManager.setSelected(btn.id, true);
            // LMEPG.UI.Marquee.start(btn.id + "_title", 13, 5, 50, "left", "scroll");
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
                        List.preMenu();
                        return false;
                }
                break;
            case 'right':

                switch (current.id) {
                    case 'recommended_4':
                        List.nextMenu();
                        return false;
                }
                // if (current.id.substring(0, 8) == "btn-nav-") {
                //     LMEPG.ButtonManager.setSelected(current.id, true);
                // }
                break;
            case 'down':
                // switch (current.id) {
                //     case 'recommended_1':
                //     case 'recommended_2':
                //     case 'recommended_3':
                //     case 'recommended_4':
                //         var nextFocusDownId = LMEPG.Func.gridBtnUtil.getNextFocusDownId(current);
                //         if (!LMEPG.Func.isEmpty(nextFocusDownId)) {
                //             LMEPG.BM.requestFocus(nextFocusDownId);
                //         }
                //         if (current.id == nextFocusDownId || (curPageDataNum > 0 && curPageDataNum <= 4)) {
                //             var navId = LMEPG.ButtonManager.getSelectedButton("nav").id;
                //             LMEPG.BM.requestFocus(navId);
                //         }
                //         return false;
                //         break;
                //     case 'recommended_5':
                //     case 'recommended_6':
                //     case 'recommended_7':
                //     case 'recommended_8':
                //         var navId = LMEPG.ButtonManager.getSelectedButton("nav").id;
                //         LMEPG.BM.requestFocus(navId);
                //         return false;
                //         break;
                // }
                break;
            case 'up':
                switch (current.id) {
                    case 'recommended_1':
                    case 'recommended_2':
                    case 'recommended_3':
                    case 'recommended_4':
                        LMEPG.BM.requestFocus("collect");
                        return false;
                }
                if (current.id.substring(0, 10) == "pagination") {
                    G(current.id + "-title").style.color = "#011025";
                }
                break;
        }
    },

    /**
     * 收藏按钮点击
     * @param btn
     */
    onClickCollect: function (btn) {
        var subject_id = RenderParam.albumDetail.data.subject_list[0].subject_id;
        // 未收藏
        if (isCollect == 0) {
            // 去收藏
            Channel.setCollectStatus(0, subject_id, btn);
        }
        // 已收藏
        else {
            // 取消收藏
            Channel.setCollectStatus(1, subject_id, btn);
        }

    },

    // 推荐位点击
    onClickRecommendPosition: function (btn) {

        if (LMEPG.Func.isExist(videoList)) {
            var index = (RenderParam.navIndex - 1) * cutNum + btn.cPosition;
            if (index < videoList.length) {
                var data = videoList[index];
                // 视频播放
                var videoObj = data.ftp_url instanceof Object ? data.ftp_url : JSON.parse(data.ftp_url);
                var videoUrl = RenderParam.platformType == "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
                // 创建视频信息
                var videoInfo = {
                    "sourceId": data.source_id,
                    "videoUrl": encodeURIComponent(videoUrl),
                    "title": data.title,
                    "type": RenderParam.albumDetail.data.subject_list[0].model_type,
                    "userType": data.user_type,
                    "freeSeconds": data.free_seconds,
                    "entryType": 13,
                    "entryTypeName": "视频专辑",
                    "unionCode": data.union_code,
                    "show_status": data.show_status
                };
                //视频专辑下线处理
                if (videoInfo.show_status == "3") {
                    LMEPG.UI.showToast('该节目已下线');
                    return;
                }
                if (isAllowPlay(videoInfo)) {
                    Page.jumpPlayVideo(videoInfo);
                } else {
                    Page.jumpBuyVip(videoInfo.title, videoInfo);
                }
            }
        }
    },

    /**
     * @param type 0收藏 1取消收藏
     */
    setCollectStatus: function (type, item_id, btn) {
        var postData = {
            "type": type,
            "item_type": 2,
            "item_id": item_id,
        };
        LMEPG.ajax.postAPI("Collect/setCollectStatusNew", postData, function (rsp) {
            var data = rsp instanceof Object ? rsp : JSON.parse(data);
            console.log(data);
            if (data.result == 0) {
                if (type == 0) {
                    G(btn.id).src = btn.cFocusImage;
                    btn.focusImage = btn.cFocusImage;
                    btn.backgroundImage = btn.cBackgroundImage;
                    isCollect = 1;
                } else {
                    G(btn.id).src = btn.uFocusImage;
                    btn.focusImage = btn.uFocusImage;
                    btn.backgroundImage = btn.uBackgroundImage;
                    isCollect = 0;
                }
            }
        });
    },
};

var List = {
    /**
     * 初始化顶部数据
     */
    initTopData: function () {
        if (RenderParam.albumDetail.result != 0) {
            return;
        }
        var subjectList = RenderParam.albumDetail.data.subject_list;
        if (!LMEPG.Func.isEmpty(subjectList) && subjectList.length > 0) {
            var subject = subjectList[0];
            if (!LMEPG.Func.isEmpty(subject.image_url))
                G("introduce-img").src = RenderParam.fsUrl + subject.image_url;
            G("title").innerHTML = subject.subject_name;
            G("number").innerHTML = RenderParam.albumDetail.data.video_list.length;
            G("detail").innerHTML = "<span class='hod'>内容介绍：</span></br>" + subject.intro_txt;
        }
        // 设置收藏状态按钮显示
        var btn = buttons[buttons.length - 1];
        if (isCollect == 0) {
            G(btn.id).src = btn.uBackgroundImage;
            btn.focusImage = btn.uFocusImage;
            btn.backgroundImage = btn.uBackgroundImage;
        } else {
            G(btn.id).src = btn.cBackgroundImage;
            btn.focusImage = btn.cFocusImage;
            btn.backgroundImage = btn.cBackgroundImage;
        }
    },

    /**
     * 保存所有视频
     */
    saveVideoData: function () {
        var videoList = RenderParam.albumDetail.data.video_list;
        for (var i = 0; i < videoList.length; i++) {
            var data = videoList[i];
            // 视频播放
            var videoObj = data.ftp_url instanceof Object ? data.ftp_url : JSON.parse(data.ftp_url);
            var videoUrl = RenderParam.platformType == "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

            // 创建视频信息
            var videoInfo = {
                "sourceId": data.source_id,
                "videoUrl": encodeURIComponent(videoUrl),
                "title": data.title,
                "type": RenderParam.albumDetail.data.subject_list[0].model_type,
                "userType": data.user_type,
                "freeSeconds": data.free_seconds,
                "entryType": 13,
                "entryTypeName": "视频专辑",
            };
            allVideoInfo.push(videoInfo);
        }
    },

    // 创建菜单
    createList: function (page) {
        if (RenderParam.albumDetail.result != 0) {
            LMEPG.UI.showToast("数据加载失败！");
            return;
        }

        LMEPG.UI.Marquee.stop();
        var tab_list = document.getElementById("center");//数据块
        var strTable = '';
        var start = (page - 1) * cutNum;//数组截取起始位置
        var end = page * cutNum;//数组截取终止位置

        // 视频列表
        videoList = RenderParam.albumDetail.data.video_list;
        // TODO 测试
        if (testFlag) {
            for (var i = 0; i < 91; i++) {
                videoList.push(videoList[0]);
            }
            testFlag = false;
        }

        // 分页
        pageNum = Math.ceil(videoList.length / cutNum);
        var newArr = videoList.slice(start, end);
        curPageDataNum = newArr.length;
        var defaultImg = "'" + g_appRootPath + "/Public/img/hd/Home/V10/default.png" + "'";
        tab_list.innerHTML = "";
        for (var i = 0; i < newArr.length; i++) {
            strTable += '<div class="recommended"> ';
            strTable += '<div id="recommended_' + (i + 1) + '" class="recommended_block"> ';
            strTable += '<img id="recommended_' + (i + 1) + '_bg" class="recommended_img" src="' + addFsUrl(newArr[i].image_url) + '" onerror="this.src=' + defaultImg + '" /> ';
            if (isShowVip(newArr[i])) {
                strTable += '<img id="vip_icon" class="vip_icon" src="' + g_appRootPath + '/Public/img/hd/Home/V10/icon_vip.png"/>';
            }
            // 第几集
            var videoNum = (page - 1) * cutNum + i + 1;
            if (videoNum >= 0 && videoNum <= 9) {
                videoNum = "0" + videoNum + "集";
            }
            strTable += '<div id="recommended_' + (i + 1) + '_title" class="recommended_title">' + videoNum + '</div> ';
            strTable += '</div></div>';
        }
        tab_list.innerHTML = strTable;
        G('page-index').innerHTML = page + '/' + pageNum;
        List.updateMenuArrows();
    },
    //遥控器左按键翻页
    preMenu: function () {
        if (pageCurrent > 1) {
            pageCurrent--
            // RenderParam.navIndex = btn.cPages;
            List.createList(pageCurrent);
            LMEPG.ButtonManager.init("recommended_4", buttons, "", true);
            // LMEPG.ButtonManager.setSelected(btn.id, true);
            // G(btn.id + "-title").style.color = "#ffffff"
        } else {
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
            // alert("ddd")
            pageCurrent++;
            List.createList(pageCurrent);
            // Nav.createPagination(videoList);
            // // LMEPG.ButtonManager.requestFocus("pagination-1");
            // LMEPG.BM._buttons = {};
            LMEPG.ButtonManager.init("recommended_1", buttons, "", true);
        } else {

        }
    },
};

var Nav = {
    count: 8,
    page: 0,
    // 翻页数据截取
    cut: function (arr, atMove, count) {
        return arr.slice(atMove, atMove + count);
    },
    /**
     * 创建底部导航
     */
    createPagination: function (data) {
        if (RenderParam.albumDetail.result != 0) {
            return;
        }

        // 模拟底部导航数据，一页8条
        var len = Math.ceil(data.length / 8);
        data = [];
        for (var i = 0; i < len; i++) {
            data.push(i);
        }

        // 每次新建底部导航栏，buttons移除原先的数据
        var buttons_tmp = [];
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].id.substr(0, 11) != "pagination-") {
                buttons_tmp.push(buttons[i]);
            }
        }
        buttons = buttons_tmp;

        var htmlStr = "";
        var navList = Nav.cut(data, (pageCurrent - 1) * cutNum, this.count);
        var pageNumber = 0;
        for (var i = 0; i < navList.length; i++) {
            pageNumber++;
            // G("pages").innerHTML = pageCurrent + '/' + pageNum;
            var start = (i * Nav.count + 1) + ((pageCurrent - 1) * cutNum * cutNum);
            var end = ((i + 1) * Nav.count) + ((pageCurrent - 1) * cutNum * cutNum);
            var pageContent = start + '-' + end;
            // 最后一页显示有所区别
            var videoCount = RenderParam.albumDetail.data.video_list.length;
            if (start == Nav.count * Math.floor(videoCount / Nav.count) + 1) {
                var modVal = videoCount % Nav.count;
                if (modVal == 1) {
                    pageContent = start;
                } else if (modVal > 1) {
                    pageContent = start + '-' + (start + modVal - 1);
                }
            }
            htmlStr += '<div class="pagination-btn"><img  id="pagination-' + (i + 1) + '" class="pagination-img" src=""/><div id="pagination-' + (i + 1) + '-title" class="pagination-title">' + pageContent + '</div></div>';
            buttons.push({
                id: 'pagination-' + (i + 1),
                name: '导航',
                type: 'img',
                nextFocusLeft: 'pagination-' + i,
                nextFocusRight: 'pagination-' + (i + 2),
                // 最后一个数据不足的情况
                nextFocusUp: i + 1 == navList.length && videoList.length - (start - 1) <= 4 ? 'recommended_1' : 'recommended_5',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/bg_btn_1.png",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V10/f_btn_1.png",
                selectedImage: g_appRootPath + "/Public/img/hd/Home/V10/select_btn_1.png",
                click: "",
                focusChange: Nav.departFocus,
                groupId: "nav",
                beforeMoveChange: Channel.onRecommendBeforeMoveChange,
                cPosition: i, //位置编号
                cPages: pageNumber + (pageCurrent - 1) * cutNum,
            });
        }
        G("pagination").innerHTML = htmlStr;
        List.updateMenuArrows();
    },
    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            RenderParam.navIndex = btn.cPages;
            List.createList(btn.cPages);
            LMEPG.ButtonManager.setSelected(btn.id, true);
            G(btn.id + "-title").style.color = "#ffffff"
        } else {
        }
    },
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
//界面渲染调整;
    updatePosition: function () {
        for (var i = 1; i < 7; i++) {
            // if (i != 2) {
            G("recommended_" + i + "_bg").style.padding = EpgClass.PADDING + "px";
            G("recommended_" + i + "_bg").style.top = parseInt(getPropertyValue("recommended_" + i, "top")) - EpgClass.PADDING + "px";
            G("recommended_" + i + "_bg").style.left = parseInt(getPropertyValue("recommended_" + i, "left")) - EpgClass.PADDING + "px";
            // }
        }
    },
};

window.onload = function () {
    Channel.init();
};
