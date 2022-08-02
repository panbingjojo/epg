// 定义全局按钮
var pageCurrent = 1;
var cutNum = 6;
var buttons = [];
var videoList;                //视频数据列表
var pageNum;                  //总页数

// 当前右侧已加载的数据属于左侧的哪个分类，数据加载成功才赋值
var curModelType = !LMEPG.Func.isEmpty(RenderParam.modelType) ? RenderParam.modelType : 0;
// 当前右侧已加载视频
var curVideoList = RenderParam.videoList;

// 返回按键
function onBack() {
    Page.onBack();
}

var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("healthVideoList");
        currentPage.setParam("modelType", curModelType);
        currentPage.setParam("modelTitle", RenderParam.modelTitle);
        currentPage.setParam("focusIndex", LMEPG.ButtonManager.getCurrentButton().id);
        currentPage.setParam("pageCurrent", pageCurrent);
//         currentPage.setParam("navFocusIndex", LMEPG.ButtonManager.getSelectedButton("nav").id);
        // currentPage.setParam("navPageCurrent", Nav.page);
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
     * 跳转到专辑
     * @param albumName
     */
    jumpAlbum: function (albumName) {
        var objCurrent = Page.getCurrentPage(); //得到当前页
        var objAlbum = LMEPG.Intent.createIntent("album");
        objAlbum.setParam("userId", RenderParam.userId);
        objAlbum.setParam("albumName", albumName);
        objAlbum.setParam("inner", 1);

        LMEPG.Intent.jump(objAlbum, objCurrent);
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
        // if (Nav.createNavPart(RenderParam.videoClass.data)) { // 视频分类导航
            List.createList(RenderParam.videoList);           // 视频数据
        // }
        Channel.initButtons();                                // 初始化焦点按钮
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
            if (RenderParam.videoClass.data.length > 0) {
                curModelType = RenderParam.videoClass.data[0].model_type;
            }
        }
        var focusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? "recommended_1" : RenderParam.focusIndex;
        LMEPG.ButtonManager.init("", buttons, "", true);

        // 左侧导航被选中状态恢复
        var lastNavSelected = RenderParam.navFocusIndex;
        var getNavFocusId = lastNavSelected;
        if (!LMEPG.Func.isEmpty(lastNavSelected)) {
            LMEPG.ButtonManager.setSelected(lastNavSelected, true);
        } else {
            getNavFocusId = "btn-nav-" + (Nav.currNavIndex + 1);
            LMEPG.ButtonManager.setSelected(getNavFocusId, true);//默认选中第一个导航栏
        }
        LMEPG.BM.requestFocus(getNavFocusId);
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
                nextFocusUp: i < 3 ? 'btn_search' : 'recommended_' + upBtn,
                nextFocusDown: i < 3 ?  'recommended_' + downBtn : '',
                backgroundImage: "",
                focusImage: "",
                click: Channel.onClickRecommendPosition,
                focusChange: Channel.recommendedFocus,
                beforeMoveChange: Channel.onRecommendBeforeMoveChange,
                cPosition: i //位置编号
            });
        }
        buttons.push({
            id: 'btn_search',
            name: '搜索',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommended_1',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V21/Nav/btn_search.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V21/Nav/btn_search_f.png",
            selectedImage: g_appRootPath + "/Public/img/hd/Home/V21/Nav/btn_search.png",
            click: Channel.onClickSearch,
            focusChange: "",
            groupId: "nav",
            beforeMoveChange: "",
        });
    },

    // 侧边导航栏焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended_hover");
            // EpgClass.epgFocus(btn, hasFocus);
            LMEPG.UI.Marquee.start(btn.id + "_title", 10, 5, 50, "left", "scroll");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended_hover");
            // EpgClass.epgFocus(btn, hasFocus);
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
            var focusModelType = RenderParam.videoClass.data[pos].model_type;
            G("title").innerHTML = RenderParam.videoClass.data[pos].show_title;
            if (curModelType != focusModelType) {
                List.getVideoList(focusModelType);
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
                        List.preMenu();
                        return false;
                }
                break;
            case 'right':
                switch (current.id) {
                    case 'recommended_6':
                    case 'recommended_3':
                    case 'recommended_9':
                        List.nextMenu();
                        return false;
                }
                // if (current.id.substring(0, 8) == "btn-nav-") {
                //     LMEPG.ButtonManager.setSelected(current.id, true);
                // }
                break;
            case 'down':
                switch (current.id) {
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
                                nextRightBtn = LMEPG.BM.getButtonById(current.nextFocusRight);
                                if (!LMEPG.Func.isEmpty(nextRightBtn))
                                    nextRightBtn = LMEPG.BM.getButtonById(nextRightBtn.nextFocusRight);
                            } else if (current.id == 'recommended_3' || current.id == 'recommended_6') {
                                nextRightBtn = LMEPG.BM.getButtonById(current.nextFocusRight);
                                if (!LMEPG.Func.isEmpty(nextRightBtn))
                                    var nextRightBtnTmp = LMEPG.BM.getButtonById(nextRightBtn.nextFocusRight);
                                if (!LMEPG.Func.isEmpty(nextRightBtnTmp)) {
                                    nextRightBtn = nextRightBtnTmp;
                                }
                            }
                            if (LMEPG.Func.isExist(nextRightBtn)) {
                                LMEPG.BM.requestFocus(nextRightBtn.id);
                            }
                        }
                        return false;
                }
                if (current.id == "btn-nav-6") {
                    Nav.nextPage();
                }
                break;
            case 'up':
//                 if (current.id == "recommended_1"||current.id == "recommended_2"||current.id == "recommended_3") {
//                     Nav.prevPage();
//                 }
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
                // 1.点击视频
                if (!LMEPG.Func.isExist(data.subject_id)) {
                    // 视频播放
                    var videoObj = data.ftp_url instanceof Object ? data.ftp_url : JSON.parse(data.ftp_url);
                    var videoUrl = RenderParam.platformType == "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
                    // 创建视频信息
                    var videoInfo = {
                        "sourceId": data.source_id,
                        "videoUrl": encodeURIComponent(videoUrl),
                        "title": data.title,
                        "type": data.model_type,
                        "userType": data.user_type,
                        "freeSeconds": data.free_seconds,
                        "entryType": 4,
                        "entryTypeName": "更多视频",
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
                // 2.点击专辑或视频集（album_type：0 UI专辑 1 视频集）
                else {
                    if (!LMEPG.Func.isEmpty(data.album_type) && parseInt(data.album_type) == 0) {
                        Page.jumpAlbum(data.alias_name);
                    } else {
                        var objSrc = Page.getCurrentPage();
                        var objDst = LMEPG.Intent.createIntent("healthVideoSet");
                        objDst.setParam("subject_id", data.subject_id);
                        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                    }
                }
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

        if (data.album_list != undefined) {
            videoList = data.album_list.concat(data.list);
        }

        // 计算总页数
        pageNum = Math.ceil(videoList.length / cutNum);

        var newArr = videoList.slice(start, end);       
        var defaultImg = "'" + g_appRootPath + "/Public/img/hd/Home/V10/default.png" + "'";
        tab_list.innerHTML = "";
        for (var i = 0; i < newArr.length; i++) {
            strTable += '<div class="recommended"> ';
            strTable += '<div id="recommended_' + (i + 1) + '" class="recommended_block"> ';
            strTable += '<img id="recommended_' + (i + 1) + '_bg" class="recommended_img" src="' + addFsUrl(newArr[i].image_url) + '" onerror="this.src=' + defaultImg + '" /> ';
            // 视频vip角标，专辑不显示
            if (newArr[i].subject_id == undefined || newArr[i].subject_id == null) {
                strTable += '<div id="recommended_' + (i + 1) + '_title" class="recommended_title" >' + newArr[i].title + '</div> ';
                if (isShowVip(newArr[i])) {
                    if (RenderParam.lmcid != "630092") {
                        strTable += '<img id="vip_icon" class="vip_icon" src="' + g_appRootPath + '/Public/img/hd/Home/V10/icon_vip.png"/>';
                    }
                }
            }
            // 专辑显示集数
            else {
                var content_cnt = newArr[i].content_cnt;
                content_cnt = parseInt(content_cnt);
                if (content_cnt >= 0 && content_cnt <= 9) {
                    content_cnt = "0" + content_cnt;
                }
                strTable += '<div id="recommended_' + (i + 1) + '_title" class="recommended_title" >' + newArr[i].subject_name + '</div> ';
                strTable += '<div class="recommended_title2" >' + content_cnt + '全集</div> ';
            }
            strTable += '</div></div>';
        }
        tab_list.innerHTML = strTable ? strTable : '<span class="null-data">暂无数据~</span>';
        G("pages").innerHTML = (strTable ? pageCurrent : 0) + '/' + pageNum;
        // EpgClass.updatePosition();
        List.updateMenuArrows();
    },
    //遥控器左按键翻页
    preMenu: function () {
        if (pageCurrent > 1) {
            pageCurrent--;
            List.createList(curVideoList);
            LMEPG.ButtonManager.requestFocus("recommended_3");
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
    getVideoList: function (modelType) {
        var postData = {"model_type": modelType};
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI("Video/getVideoList", postData, function (data) {
            var data = JSON.parse(data);
            console.log(data);

            if (data.result == 0) {
                curModelType = modelType;
                curVideoList = data;
            }
            LMEPG.UI.dismissWaitingDialog();
            List.createList(data);
        });
    }
};

var Nav = {
    currNavIndex: RenderParam.navFocusIndex,
    count: 6,
    page: 0,

    init: function () {
        // 处理外部进入某个分类时，计算页数和位置
        var data = RenderParam.videoClass.data;
        var navPos = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].model_type == curModelType) {
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
        if (RenderParam.videoClass.result != 0) {
            LMEPG.UI.showToast("数据加载失败！");
            return false;
        } else if (RenderParam.videoClass.data.length == 0) {
            return false;
        }

        var htmlStr = "";
        var navList = Nav.cut(data, this.page, this.count);
        for (var i = 0; i < navList.length; i++) {
            htmlStr += '<img id="btn-nav-' + (i + 1) + '" pos="' + (i + this.page) + '"  class="nav-btn" />';
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
        //G("list").innerHTML = htmlStr;
        // Nav.upArrow(data);

        return true;
    },

    prevPage: function () {
        if (Nav.page > 0) {
            Nav.page--;
            Nav.createNavPart(RenderParam.videoClass.data);
            LMEPG.ButtonManager.init("btn-nav-1", buttons, "", true);
            //LMEPG.ButtonManager.requestFocus("btn-nav-1");
        } else {
            LMEPG.ButtonManager.requestFocus("search");
            return false;
        }
    },

    nextPage: function (focusIndex) {
        if (Nav.page < RenderParam.videoClass.data.length - Nav.count) {
            Nav.page++;
            Nav.createNavPart(RenderParam.videoClass.data);
            if (typeof focusIndex !== "undefined") {
                LMEPG.ButtonManager.init(focusIndex, buttons, "", true);
            } else {
                LMEPG.ButtonManager.init("btn-nav-6", buttons, "", true);
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
window.onload = function () {
    // LMEPG.Func.isErrorForceEventBack();
    Channel.init();

};

