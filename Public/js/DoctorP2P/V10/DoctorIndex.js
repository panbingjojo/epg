/***********************首页导航栏js控制***************************/
// 定义全局按钮
var buttons = [];
var scroll = "center";

// 返回按键
function onBack() {
    if (LMEPG.BM.getCurrentButton().id != "depart") {
        LMEPG.BM.requestFocus("depart");
    } else {
        Page.onBack();
    }
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("doctorIndex");
        if (!LMEPG.BM.getCurrentButton().id.startWith('nav_')) {
            currentPage.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        } else {
            currentPage.setParam('focusIndex', Home.defaultFocusId);
        }
        return currentPage;
    },

    /**
     * 跳转 -- 更多视频页
     */
    jumpHealthVideoHome: function (modeTitle, modeType, page) {
        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objChannel = LMEPG.Intent.createIntent("channel");
        objChannel.setParam("userId", RenderParam.userId);
        objChannel.setParam("page", typeof (page) === "undefined" ? "1" : page);
        objChannel.setParam("modeTitle", modeTitle);
        objChannel.setParam("modeType", modeType);
        LMEPG.Intent.jump(objChannel, objHome);
    },

    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName) {
        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objAlbum = LMEPG.Intent.createIntent("album");
        objAlbum.setParam("userId", RenderParam.userId);
        objAlbum.setParam("albumName", albumName);
        objAlbum.setParam("inner", 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转 -- 活动页面
     * @param activityName
     */
    jumpActivityPage: function (activityName) {
        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objActivity = LMEPG.Intent.createIntent("activity");
        objActivity.setParam("userId", RenderParam.userId);
        objActivity.setParam("activityName", activityName);
        objActivity.setParam("inner", 1);
        LMEPG.Intent.jump(objActivity, objHome);
    },

    /**
     * 跳转到播放历史
     */
    jumpVideoPlayHistory: function () {
        var objHome = Page.getCurrentPage();
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objHistory = LMEPG.Intent.createIntent("history");
        LMEPG.Intent.jump(objHistory, objHome);
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast("视频信息为空！");
            return;
        }

        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("userId", RenderParam.userId);
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
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
        var objHome = Page.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "1");
        objHome.setParam("page", "0");

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("userId", RenderParam.userId);
        objOrderHome.setParam("remark", remark);
        objOrderHome.setParam("isPlaying", 1);
        objOrderHome.setParam("singlePayItem", typeof (singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objHome);
    },
    //跳转在线问诊的医生详情页面
    jumpP2PDetail: function (docId) {
        var objHome = Page.getCurrentPage();
        objHome.setParam("departmentId", RenderParam.departmentId);
        objHome.setParam("departmentName", RenderParam.departmentName);
        objHome.setParam("pageCurrent", P2PManagerUI.hospitalPage);
        objHome.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
        objHome.setParam("scrollTop", RenderParam.scrollTop);

        var dstObj = LMEPG.Intent.createIntent("doctorDetails");
        if (P2PManagerUI.isMFSmallPackage) {
            dstObj = LMEPG.Intent.createIntent("doctorDetailsSmall");
        }
        dstObj.setParam("doc_id", docId);
        LMEPG.Intent.jump(dstObj, objHome);
    },
    //跳转在线问诊中的科室列表
    jumpP2PDepartment: function () {
        var objHome = Page.getCurrentPage();
        objHome.setParam("departmentId", RenderParam.departmentId);
        objHome.setParam("departmentName", RenderParam.departmentName);
        objHome.setParam("scrollTop", RenderParam.scrollTop);

        var dstObj = LMEPG.Intent.createIntent("doctorDepartment");
        dstObj.setParam("departmentId", RenderParam.departmentId);
        dstObj.setParam("departmentName", RenderParam.departmentName);
        dstObj.setParam("scrollTop", RenderParam.scrollTop);
        LMEPG.Intent.jump(dstObj, objHome);
    },

    /**
     * 返回事件
     */
    onBack: function () {
        //贵州电信无主界面，直接返回局方大厅
        if (((RenderParam.carrierId == '520092' || RenderParam.carrierId == '520095') && RenderParam.lmp == '51') ||
            (RenderParam.carrierId == '10000051' && (RenderParam.lmp == '261' || RenderParam.lmp == '266'))) {
            LMEPG.Intent.back('IPTVPortal');
        } else {
            LMEPG.Intent.back();
        }
    }
};

//页面显示控制
var Home = {

    // 当前页默认有焦点的按钮ID
    defaultFocusId: 'depart',
    isFirstLoad: false,  //是否第一次加载
    defaultUrl: g_appRootPath + "/Public/img/hd/Home/V10/",

    navImgs: [],                            //导航栏图片数组

    //页面初始化操作
    init: function () {
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        if (lastFocusId == "btn-order" && (RenderParam.isVip == "1" || RenderParam.isVip == 1)) {
            lastFocusId = Home.defaultFocusId;
        }
        Home.defaultFocusId = lastFocusId;
        P2PManagerUI.init();//渲染医院列表
    },

    /**
     * 渲染主题背景
     */
    renderThemeUI: function () {
        if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== "") {
            var themeImage = RenderParam.fsUrl + RenderParam.themeImage;
            G("body").src = themeImage;
        }
    },


    /**
     * 渲染推荐位
     */
    renderRecommendPosition: function () {
        // 遍历推荐列表， 注意二号不是推荐位，是观看历史
        for (var i = 0; i < RenderParam.pageInfo.data.length; i++) {
            var data = RenderParam.pageInfo.data[i];
            switch (data.position) {
                case "21":
                    // 第一个位置
                    G("recommend_1_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_1_vip_icon");
                    break;
                case "22":
                    // 第一个位置
                    G("recommend_2_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_2_vip_icon");
                    break;
                case "23":
                    // 第三个位置
                    G("recommend_3_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_3_vip_icon");
                    break;
                case "24": // 第四个位置
                    G("recommend_4_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_4_vip_icon");
                    break;
                case "25": // 第五个位置
                    G("recommend_5_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_5_vip_icon");
                    break;
                case "26": // 第六个位置
                    G("recommend_6_bg").src = addFsUrl(data.image_url);
                    break;
            }
        }
    },

    /**
     * 初始化焦点按钮。应当在页面渲染完毕后，最后一步再调用设置焦点按钮。
     */
    initButtons: function () {
        Home.initRegionBtn();         // 初始化[区域按钮]
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;

        if (lastFocusId == "btn-order" && (RenderParam.isVip == "1" || RenderParam.isVip == 1)) {
            lastFocusId = Home.defaultFocusId;
        }
        LMEPG.BM.init(lastFocusId, buttons, "", true);
        Guide.open(1, "tab3_step");
    },

// 初始化区域选择按钮
    initRegionBtn: function () {
        buttons.push({
            id: 'depart',
            name: '部门选择',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'nav-btn-4',
            nextFocusDown: 'recommended-0',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_long.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_long.png",
            click: Page.jumpP2PDepartment,
            focusChange: Home.regionFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cType: "region",
        });

    },

    regionFocus: function (btn, hasFocus) {
        if (hasFocus) {
            // G(scroll).style.overflow = "hidden";
            // LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            // LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            // if(btn.id="depart") {
            //     G("region-content").style.display="none";
            // }
        }
    },


    // 加边框焦点效果
    recommendedFocus: function (btn, hasFocus) {
        var imgs = G(btn.id).getElementsByTagName("img");
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended-hover");
            imgs[0].className += " zoom-img-1";
            imgs[1].className += " zoom-img-2";
            // G("inquiry-number").style.top = "270px";
            // G("inquiry-number").style.left = "59px";
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended-hover");
            imgs[0].className = "recommended-bg";
            imgs[1].className = "recommended-photo";
            // G("inquiry-number").style.top = "260px";
            // G("inquiry-number").style.left = "69px";
        }
    },

    //推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                break;
            case 'right':
                break;
        }
    },

    onClickRegion: function (btn) {
        G("depart").innerHTML = G(btn.id).innerHTML;
    },
    // 推荐位点击
    onClickRecommendPosition: function (btn) {
        if (btn.id == 'btn-renew' || btn.id == 'btn-order') {
            Page.jumpBuyVip("首页订购", null);
        }
    },
};

var P2PManagerUI = {
    docArr: "",
    hospitalCut: 4,
    hospitalPage: parseInt(RenderParam.pageCurrent),
    totalPage: 0,

    isMFSmallPackage: RenderParam.carrierId === '10000051' && RenderParam.lmp === '266',

    _itemRow: function (tempDocObj, index) {
        var defaultImg = g_appRootPath + "Public/img/hd/DoctorP2P/V10/init_doc.png";
        var tempHtml = "";
        var tempImgUrl = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl, tempDocObj.doc_id, tempDocObj.avatar_url, RenderParam.carrierId);
        console.log("tempImgUrl::" + tempImgUrl);
        LMEPG.Log.info("医生头像地址---> url:" + tempImgUrl);
        tempHtml += '<div id="recommended-' + index + '" class="recommended">';
        var imgIndex = LMEPG.Inquiry.p2pApi.switchDocOnlineState(tempDocObj.online_state, tempDocObj.is_fake_busy);
        var isEnableWeXinTeletext = imgIndex == 3 && tempDocObj.is_im_inquiry == 1;
        if ((RenderParam.carrierId !== '10220094' && !P2PManagerUI.isMFSmallPackage) && isEnableWeXinTeletext) {
            imgIndex = 1;
        }

        tempHtml += '<img class="recommended-bg" src="' + g_appRootPath + '/Public/img/hd/Home/V10/status_' + imgIndex + '.png"/>';
        // tempHtml += "<img class='recommended-photo' src='" + tempImgUrl + " onerror=this.src='" + defaultImg + "'>";
        tempHtml += "<img class='recommended-photo' src='" + tempImgUrl + "'>";

        tempHtml += '<div id="inquiry-number" class="inquiry-number">已问诊<span>' + LMEPG.Inquiry.p2pApi.switchInquiryNumStr(tempDocObj.inquiry_num) + '</span></div>';
        tempHtml += '<div class="introduce">';
        tempHtml += '<div class="introduce-word big-size">' + tempDocObj.doc_name + '</div>';
        tempHtml += '<div class="introduce-word middle-size">' + tempDocObj.hospital + '</div>';
        tempHtml += '<div class="introduce-word">科室：<span>' + tempDocObj.department + '</span></div>';
        tempHtml += '<div class="introduce-word">职称：<span>' + tempDocObj.job_title + '</span></div>';
        tempHtml += '</div></div>';
        return tempHtml;
    },
    init: function () {
        G("depart-name").innerHTML = RenderParam.departmentName;
        LMEPG.UI.showWaitingDialog();
        Home.initButtons();
        P2PManagerUI.createHtml();
    },

    createHtml: function () {
        if (P2PManagerUI.isMFSmallPackage) {
            // 启生魔方小包不支持微信视频和微信图文问诊
            var requestData = {
                "deptId": RenderParam.departmentId,
                "deptIndex": RenderParam.departmentIndex,
                "page": P2PManagerUI.hospitalPage,
                "pageSize": P2PManagerUI.hospitalCut,
                "inquiryType": 1,
            }
            LMEPG.Inquiry.p2pApi.getDoctorListWithoutWeXin(requestData, P2PManagerUI.handleDoctorList);
        } else {
            LMEPG.Inquiry.p2pApi.getDoctorList(RenderParam.departmentId, RenderParam.departmentIndex, P2PManagerUI.hospitalPage, P2PManagerUI.hospitalCut, P2PManagerUI.handleDoctorList);
        }
    },

    handleDoctorList: function (data) {
        console.log("data::" + JSON.stringify(data));
        P2PManagerUI.totalPage = data.result.total;
        if (data.result.code !== "0") {
            console.log("getDoctorList::" + data.result.code);
            return null;
        }
        var tempList = data.result.list;
        P2PManagerUI.docArr = tempList;
        var sHtml = "";
        for (var i = 0; i < tempList.length; i++) {
            var tempDocObj = tempList[i];
            sHtml += P2PManagerUI._itemRow(tempDocObj, i);
        }
        G("table-list").innerHTML = sHtml;
        LMEPG.UI.dismissWaitingDialog();
        G("pages").innerHTML = "" + P2PManagerUI.hospitalPage + "/ " + Math.ceil(P2PManagerUI.totalPage / 4);
        if (P2PManagerUI.hospitalPage >= Math.ceil(P2PManagerUI.totalPage / 4)) {
            Hide("m-next");
        } else {
            Show("m-next");
        }
        if (!Home.isFirstLoad) {
            Home.isFirstLoad = true;
            LMEPG.BM.requestFocus(RenderParam.focusIndex);
        } else {
            LMEPG.BM.requestFocus("recommended-0");
        }
        P2PManagerUI._addButton();  //创建完html后，增加按钮
    },

    _addButton: function () {
        for (var i = 0; i < 4; i++) {
            LMEPG.BM.addButtons(
                {
                    id: 'recommended-' + i,
                    name: '推荐位',
                    type: 'div',
                    nextFocusLeft: 'recommended-' + (i - 1),
                    nextFocusRight: 'recommended-' + (i + 1),
                    nextFocusUp: 'recommended-' + (i - 2),
                    nextFocusDown: P2PManagerUI.hospitalPage == Math.ceil(P2PManagerUI.totalPage / 4)
                    && P2PManagerUI.totalPage % P2PManagerUI.hospitalCut == 3 && i == 1 ?
                        'recommended-' + (i + 1) : 'recommended-' + (i + 2),
                    backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_card.png",
                    focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_card.png",
                    click: P2PManagerUI.onClickDoc,
                    focusChange: Home.recommendedFocus,
                    beforeMoveChange: P2PManagerUI.onRecommendBeforeMoveChange,
                    cIndex: i,
                    cDocObj: ""
                }
            );
        }
        LMEPG.BM.requestFocus(Home.defaultFocusId);
    },
    onClickDoc: function (btn) {
        var tempDocObj = P2PManagerUI.docArr[btn.cIndex];
        Page.jumpP2PDetail(tempDocObj.doc_id);
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                switch (current.id) {
                    case 'recommended-0':
                        P2PManagerUI.prevRecommendedPage();
                        Home.defaultFocusId = "recommended-2";
                        return false;
                        break;
                    case 'recommended-1':
                        P2PManagerUI.prevRecommendedPage();
                        Home.defaultFocusId = "recommended-3";
                        return false;
                }
                // if (current.cType == "region") {
                //     G("region-content").style.display = "none";
                // }
                // LMEPG.UI.scrollVertically(current.id, scroll, "up", 17);
                break;
            case'down':
                switch (current.id) {
                    case 'recommended-2':
                        P2PManagerUI.nextRecommendedPage();
                        Home.defaultFocusId = "recommended-0";
                        return false;
                    case 'recommended-3':
                        P2PManagerUI.nextRecommendedPage();
                        Home.defaultFocusId = "recommended-1";
                        return false;
                }

                break;
            case 'left':
                switch (current.id) {
                    case 'recommended-0':
                    case 'recommended-2':
                        return false;
                }
                break;
            case 'right':
                switch (current.id) {
                    case 'recommended-1':
                    case 'recommended-3':
                        return false;
                }
                break;
        }
    },

    upDateRecommendedArrow: function () {
        G("m-pre").style.display = "none";
        G("m-next").style.display = "none";
        if (P2PManagerUI.hospitalPage > 1) {
            // G("m-pre").style.display = "block";
        } else {
            G("m-pre").style.display = "none";
        }
        if (Math.ceil(Math.ceil(parseInt(P2PManagerUI.totalPage)) / P2PManagerUI.hospitalCut) > P2PManagerUI.hospitalPage) {
            G("m-next").style.display = "block";
        } else {
            G("m-next").style.display = "none";
        }
    },


    prevRecommendedPage: function () {
        if (P2PManagerUI.hospitalPage > 1) {
            P2PManagerUI.hospitalPage--;
            P2PManagerUI.createHtml()//渲染医院列表
        } else {
            // LMEPG.BM.requestFocus("btn-region");
            LMEPG.BM.requestFocus("depart");
        }
    },

    nextRecommendedPage: function () {
        if (Math.ceil(parseInt(P2PManagerUI.totalPage) / P2PManagerUI.hospitalCut) > P2PManagerUI.hospitalPage) {
            P2PManagerUI.hospitalPage++;
            P2PManagerUI.createHtml()//渲染医院列表
        } else {

        }
    },

};