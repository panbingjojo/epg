//定义全局参数
var UN_COLLECT_CODE = 1;     //取消收藏操作
var COLLECT_CODE = 0;        //收藏操作
var buttons = [];             //焦点对象数组
var defaultFocusId = "item_container_1"; //默认焦点
var itemBtnStatus = 0;        // 当前列表项上悬浮按钮，谁处于焦点状态：0-查看详情，1-收藏/取消收藏

// 返回按键
function onBack() {
    Page.onBack();
}

/**
 * 页面跳转
 * @type {{getCurrentPage: Page.getCurrentPage, jumpHomeTab: Page.jumpHomeTab, onBack: Page.onBack}}
 */
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("collect");
        currentPage.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        currentPage.setParam('pageCurrent', List.pageCurrent);
        return currentPage;
    },

    /**
     * 跳转 - 搜索页
     * */
    jumpSearchPage: function () {
        var objCurrent = Page.getCurrentPage();

        var objSearch = LMEPG.Intent.createIntent("search");
        objSearch.setParam("userId", RenderParam.userId);
        objSearch.setParam("position", "tab1");

        LMEPG.Intent.jump(objSearch, objCurrent);
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
     * 跳转到专辑视频页
     * @param subject_id
     */
    jumpChannelVideoSet: function (subject_id) {
        var objcurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("healthVideoSet");
        objDst.setParam("subject_id", subject_id);
        LMEPG.Intent.jump(objDst, objcurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
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
    },

    /**
     * 显示错误信息并返回
     */
    showError: function (msg) {
        LMEPG.UI.showToast(msg, 10);
        setTimeout(function () {
            Page.onBack();
        }, 3000);
    }
};

/**
 * 收藏初始化
 */
var Collection = {

    /**
     * 主页初始化
     */
    init: function () {
        if (RenderParam.carrierId == '520092'
            || RenderParam.carrierId == '09000051'
            || RenderParam.carrierId == '11000051'
            || RenderParam.carrierId == '10000051') {
            Collection.initData();
            return;
        }
        if (RenderParam.carrierId == '440004'){
            RenderParam.isVip = 1;
        }

        if (RenderParam.isVip == 1 || RenderParam.isVip == '1') {
            Collection.initData();                   //初始化收藏数据，之后才初始化收藏内容
        } else {
            LMEPG.BM.init('',[],'',true);
            LMEPG.UI.commonDialog.show("本功能仅限VIP使用！", ['成为VIP', '取消'], function (index) {
                if (index == 0) {
                    Page.jumpBuyVip("收藏", null);
                } else {
                    Page.onBack();
                }
                return true;
            });
        }
    },

    /**
     *  初始化用户的收藏视频
     */
    initData: function () {
        //先获取收藏的视频，然后获取收藏的专辑
        List.videoList = [];
        Collection.getCollectVideo();
    },

    /**
     * 获取收藏视频
     */
    getCollectVideo: function () {
        var postVideoData = {
            "item_type": 1,
        };
        if(RenderParam.carrierId != "07430093"){
            LMEPG.UI.showWaitingDialog("");
        }
        LMEPG.ajax.postAPI("Collect/getCollectListNew", postVideoData, function (rsp) {
            try {
                var collectData;
                if (rsp instanceof Object) {
                    collectData = rsp;
                } else {
                    collectData = JSON.parse(rsp);
                }
                result = collectData.result;
                if (result == 0) {
                    if (LMEPG.Func.isExist(collectData.list) && collectData.list.length > 0) {
                        for (var i = 0; i < collectData.list.length; i++) {
                            var itemData = collectData.list[i];
                            itemData.item_type = 1;
                            List.videoList.push(itemData);
                        }
                    }
                } else {
                    Page.showError("获取收藏视频失败[code=" + result + "]");
                }
            } catch (e) {
                Page.showError("获取收藏视频异常");
            } finally {
                Collection.getCollectAlbum();                      // 获取收藏专辑
            }
        });
    },

    /**
     * 获取收藏专辑
     */
    getCollectAlbum: function () {
        var postVideoData = {
            "item_type": 2,
        };
        LMEPG.ajax.postAPI("Collect/getCollectListNew", postVideoData, function (rsp) {
            try {
                var collectData;
                if (rsp instanceof Object) {
                    collectData = rsp;
                } else {
                    collectData = JSON.parse(rsp);
                }
                result = collectData.result;
                if (result == 0) {
                    if (LMEPG.Func.isExist(collectData.list) && collectData.list.length > 0) {
                        for (var i = 0; i < collectData.list.length; i++) {
                            var itemData = collectData.list[i];
                            itemData.item_type = 2;
                            List.videoList.push(itemData);
                        }
                    }
                } else {
                    Page.showError("获取收藏专辑失败[code=" + result + "]");
                }
            } catch (e) {
                Page.showError("获取收藏专辑异常");
            } finally {
                Collection.initBtn();                      // 初始化按钮
                Collection.initRecommend();                //渲染页面
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },

    /**
     * 初始化按钮
     */
    initBtn: function () {
        buttons.push({
            id: 'item_container_1',
            name: '推荐1',
            type: 'div',
            focusable: true,
            nextFocusDown: 'item_container_4',
            click: Collection.onClickRecommendPosition,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
            cIndex: 1, // 序号
        });
        buttons.push({
            id: 'item_container_2',
            name: '推荐2',
            type: 'div',
            focusable: true,
            nextFocusDown: 'item_container_5',
            click: Collection.onClickRecommendPosition,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
            cIndex: 2, // 序号
        });
        buttons.push({
            id: 'item_container_3',
            name: '推荐3',
            type: 'div',
            focusable: true,
            nextFocusDown: 'item_container_6',
            click: Collection.onClickRecommendPosition,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
            cIndex: 3, // 序号
        });
        buttons.push({
            id: 'item_container_4',
            name: '推荐4',
            type: 'div',
            focusable: true,
            nextFocusUp: 'item_container_1',
            click: Collection.onClickRecommendPosition,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
            cIndex: 4, // 序号
        });
        buttons.push({
            id: 'item_container_5',
            name: '推荐5',
            type: 'div',
            focusable: true,
            nextFocusUp: 'item_container_2',
            click: Collection.onClickRecommendPosition,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
            cIndex: 5, // 序号
        });
        buttons.push({
            id: 'item_container_6',
            name: '推荐6',
            type: 'div',
            focusable: true,
            nextFocusUp: 'item_container_3',
            click: Collection.onClickRecommendPosition,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
            cIndex: 6, // 序号
        });

        buttons.push({
            id: 'btn-search',
            name: '搜索',
            type: 'img',
            focusable: true,
            nextFocusDown: 'item_container_1',
            click: Page.jumpSearchPage,
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/bg_search.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/f_search.png",
            beforeMoveChange: "",
        });
    },

    /**
     * 初始化收藏视频和按钮
     */
    initRecommend: function () {
        if (LMEPG.Func.isExist(List.videoList) && List.videoList.length > 0) {
            //获取到收藏视频
            List.pageNum = Math.ceil(List.videoList.length / List.cutNum);       //计算出总页数
            if (LMEPG.Func.isEmpty(RenderParam.pageCurrent) || RenderParam.pageCurrent < 1) {
                RenderParam.pageCurrent = 1;
            } else if (RenderParam.pageCurrent > List.pageNum) {
                RenderParam.pageCurrent = List.pageNum;
            }
            List.pageCurrent = RenderParam.pageCurrent;                          //设置当前页
            List.createList();                                                       //初始化视频列表
            var lastFocusId = LMEPG.Func.isExist(G(RenderParam.focusIndex)) ? RenderParam.focusIndex : defaultFocusId; //判断初始化焦点位置
            LMEPG.BM.init(lastFocusId, buttons, "", true);
        } else {
            //没有获取到收藏视频
            if(RenderParam.carrierId == "07430093"){
                List.backCollection();
            }else {
                Page.showError("还没有收藏任何视频");
            }
        }
    },

    /**
     * 收藏内容焦点效果
     * @param btn
     * @param hasFocus
     */
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            if (btn.id == "noCollection") {
                //没有任何收藏提示
                G("noCollection").style.color = "#1aa3c3";
            } else if (btn.id.indexOf("btn") != -1) {
                //收藏/取消按钮
                var index = List.getIndexCollection(btn);
                if (LMEPG.Func.isEmpty(List.videoList[index].is_collect) || List.videoList[index].is_collect == COLLECT_CODE) {
                    G(btn.id).src = g_appRootPath + "/Public/img/hd/Home/V10/f_un_collect.png";
                } else {
                    G(btn.id).src = g_appRootPath + "/Public/img/hd/Home/V10/f_collect.png";
                }
            } else {
                //视频框
                $("#" + btn.id).addClass("recommended_hover");
                LMEPG.UI.Marquee.start(btn.id + "_title", 13, 5, 50, "left", "scroll");
            }
        } else {
            if (btn.id == "noCollection") {
                G("noCollection").style.color = "white";
            } else if (btn.id.indexOf("btn") != -1) {
                //收藏|取消按钮
                var index = List.getIndexCollection(btn);
                if (LMEPG.Func.isEmpty(List.videoList[index].is_collect) || List.videoList[index].is_collect == COLLECT_CODE) {
                    G(btn.id).src = g_appRootPath + "/Public/img/hd/Home/V10/bg_un_collect.png";
                } else {
                    G(btn.id).src = g_appRootPath + "/Public/img/hd/Home/V10/bg_collect.png";
                }
            } else {
                LMEPG.UI.Marquee.stop();
                $("#" + btn.id).removeClass("recommended_hover");
            }
        }
    },

    /**
     * 推荐位按键移动
     * @param dir
     * @param current
     * @returns {boolean}
     */
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                switch (current.id) {
                    case 'recommended_1':
                    case 'recommended_1_btn':
                    case 'noCollection':
                        if (List.isFirstCollection()) {
                            Page.jumpHomeTab('homeTab4', "recommended_6");
                        } else {
                            List.preMenu();
                        }
                        return false;
                }
                break;
            case 'right':
                if (List.isLastCollection()) {
                    Page.jumpHomeTab('Collection', "rank_btn_1");
                    return false;
                } else {
                    switch (current.id) {
                        case 'recommended_3_btn':
                        case 'recommended_3':
                            List.nextMenu();
                            return false;
                    }
                }
                break;
        }
        return true;
    },

    /**
     * 收藏内容点击
     * @param btn
     */
    onClickRecommendPosition: function (btn) {
        var index = List.getIndexCollection(btn);
        if (LMEPG.Func.isExist(List.videoList) && index < List.videoList.length) {
            var videoData = List.videoList[index];
            if (itemBtnStatus == 0) {
                //表示点击的是播放按钮
                if (videoData.item_type == 1) {
                    //播放视频
                    var videoObj = videoData.ftp_url instanceof Object ? videoData.ftp_url : JSON.parse(videoData.ftp_url);
                    var videoUrl = RenderParam.platformType == "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

                    // 创建视频信息
                    var videoInfo = {
                        "sourceId": videoData.source_id,
                        "videoUrl": encodeURIComponent(videoUrl),
                        "title": videoData.title,
                        "type": videoData.model_type,
                        "userType": videoData.user_type,
                        "freeSeconds": videoData.free_seconds,
                        "entryType": 5,
                        "entryTypeName": "收藏",
                        "unionCode": videoData.union_code,
                        'show_status' : videoData.show_status,
                    };
                    //视频专辑下线处理
                    if(videoInfo.show_status == "3") {
                        LMEPG.UI.showToast('该节目已下线');
                        return;
                    }
                    if (isAllowPlay(videoInfo)) {
                        Page.jumpPlayVideo(videoInfo);
                    } else {
                        Page.jumpBuyVip(videoInfo.title, videoInfo);
                    }
                } else {
                    //跳转到专辑详情界面
                    Page.jumpChannelVideoSet(videoData.subject_id);
                }

            } else {
                //表示点击的是收藏按钮
                var collectType = COLLECT_CODE;
                if (!LMEPG.Func.isEmpty(videoData.is_collect)) {
                    collectType = videoData.is_collect;
                }
                Collection.doCollectItem(videoData, collectType);
            }
        }
    },

    /**
     * 获取当前界面最右边的收藏按钮id
     */
    getLastCollectIdOnThisPage: function () {
        if (LMEPG.Func.isExist(G("item_container_1"))) {
            return "item_container_1";
        } else if (LMEPG.Func.isExist(G("item_container_2"))) {
            return "item_container_2";
        } else if (LMEPG.Func.isExist(G("item_container_3"))) {
            return "item_container_3";
        } else if (LMEPG.Func.isExist(G("item_container_4"))) {
            return "item_container_4";
        } else if (LMEPG.Func.isExist(G("item_container_5"))) {
            return "item_container_5";
        } else if (LMEPG.Func.isExist(G("item_container_6"))) {
            return "item_container_6";
        } else {
            return "";
        }
    },

    /**
     * 收藏/取消收藏操作
     * @param status   收藏状态：0、 收藏 1、取消收藏
     */
    doCollectItem: function (data, status) {
        //如果当前状态是收藏，就去取消收藏，反之亦然
        var type = status == COLLECT_CODE ? UN_COLLECT_CODE : COLLECT_CODE;
        var item_id = data.item_type == 1 ? data.source_id : data.subject_id;
        var postData = {
            "type": type,
            "item_type": data.item_type,
            "item_id": item_id,
        };
        LMEPG.ajax.postAPI("Collect/setCollectStatusNew", postData, function (rsp) {
            try {
                var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (collectItem.result == 0) {
                    if (type == COLLECT_CODE) {
                        //收藏成功
                        LMEPG.UI.showToast("收藏成功");
                    } else {
                        //取消收藏成功
                        LMEPG.UI.showToast("取消收藏成功");
                    }
                    Collection.updateCollectItem(type);
                } else {
                    LMEPG.UI.showToast("操作失败");
                }
            } catch (e) {
                LMEPG.UI.showToast("操作异常");
            }
        });
    },

    /**
     * 更新收藏/取消收藏操作
     * @param collectType 操作方式
     */
    updateCollectItem: function (collectType) {
        var currentBtn = LMEPG.BM.getCurrentButton();
        var index = List.getIndexCollection(currentBtn);
        List.videoList[index].is_collect = collectType;
        var domBtnTitles = document.getElementsByClassName("btn_title");
        if (LMEPG.Func.isExist(domBtnTitles) && domBtnTitles.length > 1) {
            if (collectType == COLLECT_CODE) {
                //收藏操作成功
                domBtnTitles[1].innerHTML = "取消收藏";
            } else {
                //取消收藏操作成功
                domBtnTitles[1].innerHTML = "收藏";
            }
        }

    }
};

/**
 * 视频列表管理
 */
var List = {
    videoList: [],                //视频数据列表
    pageCurrent: 1,              //当前页码
    pageNum: 0,                  //总页数
    cutNum: 6,                  //每页显示多少个
    itemBtnBgNormal: g_appRootPath + '/Public/img/hd/Home/V10/bg_key.png',
    itemBtnBgFocused: g_appRootPath + '/Public/img/hd/Home/V10/f_key.png',

    /**
     * 创建视频列表
     */
    createList: function () {
        LMEPG.UI.Marquee.stop();
        var tab_list = document.getElementById("collection_list");//数据块
        var strTable = '';
        var start = (List.pageCurrent - 1) * List.cutNum;//数组截取起始位置
        var end = List.pageCurrent * List.cutNum;//数组截取终止位置
        var newArr = List.videoList.slice(start, end);
        tab_list.innerHTML = "";
        var defVipImgUrl = g_appRootPath + "/Public/img/hd/Home/V10/icon_vip.png";
        var defImgUrl = g_appRootPath + "/Public/img/hd/Home/V10/default.png";
        // var bgImgUrl = newArr[i].item_type == 1? ;
        for (var i = 0; i < newArr.length; i++) {
            strTable += '<div id="item_container_' + (i + 1) + '" >';
            strTable += ' <img id="item_img_' + i + '" class="' + "item_img" + '" src="' + addFsUrl(newArr[i].image_url) + '" onerror="this.src=\'' + defImgUrl + '\'"/>';

            // 视频vip角标，专辑不显示
            if (newArr[i].subject_id == undefined || newArr[i].subject_id == null) {
                if (newArr[i].item_type == 1 && isShowVip(newArr[i])) {
                    //strTable += ' <img id="item_vip_corner_' + i + '" class="vip_corner"  src="' + defVipImgUrl + '"/>';
                }
            }
            // 专辑显示集数
            else {
                var content_cnt = newArr[i].content_cnt;
                content_cnt = parseInt(content_cnt);
                if (content_cnt >= 0 && content_cnt <= 9) {
                    content_cnt = "0" + content_cnt;
                }
                strTable += '<div id="recommended_' + (i + 1) + '_title" class="recommended_title">' + content_cnt + '全集</div> ';
            }
            strTable += ' <div id="item_container_' + (i + 1) + '_filter" class="filter"></div>';
            strTable += '</div>';
        }
        tab_list.innerHTML = strTable;
        G("page_num").innerHTML = List.pageCurrent + '/' + List.pageNum;
        List.updateMenuArrows();
    },

    // 当列表项有焦点时，浮动“查看详情”和“收藏/取消收藏”按钮
    createBtn: function (id, collected) {
        itemBtnStatus = 0; //默认焦点在“查看详情”
        var html = '';
        html += '<div class="detail_btn"><img id="detail_btn" class="btn_bg" src="' + List.itemBtnBgFocused + '"/>'; //默认焦点图片
        html += '<div class="btn_title">播放视频</div></div>';
        html += '<div class="cancel_btn"><img id="cancel_btn" class="btn_bg" src="' + List.itemBtnBgNormal + '"/>';
        html += '<div class="btn_title">' + (collected == 1 ? '取消收藏' : '收藏') + '</div></div>';
        G(id).innerHTML = html;
    },

    // 推荐位焦点效果
    onFocusChange: function (btn, hasFocus) {
        // 列表项焦点效果
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "collection_zoom_out");
            G(btn.id + "_filter").style.display = "block";
            var index = List.getIndexCollection(btn);
            var collected = 0;
            if (LMEPG.Func.isEmpty(List.videoList[index].is_collect) || List.videoList[index].is_collect == COLLECT_CODE) {
                collected = 1;
            }
            List.createBtn(btn.id + "_filter", collected);//0-未收藏 1-收藏
        } else {
            LMEPG.CssManager.removeClass(btn.id, "collection_zoom_out");
            G(btn.id + "_filter").style.display = "none";
            G(btn.id + "_filter").innerHTML = "";
        }
    },

    // 列表焦点移动操作
    onBeforeMoveChange: function (dir, current) {
        var cIndex = parseInt(current.cIndex); //当前按钮id编号：1~6
        switch (dir) {
            case 'left':
                if (cIndex === 1) {
                    List.preMenu("item_container_3");
                } else if (cIndex === 4) {
                    List.preMenu("item_container_6");
                } else {
                    LMEPG.BM.requestFocus('item_container_' + (cIndex - 1)); // 左移一个
                }
                return false;
            case 'right':
                if (cIndex === 3) {
                    List.nextMenu("item_container_1");
                } else if (cIndex === 6) {
                    List.nextMenu("item_container_4");
                } else {
                    LMEPG.BM.requestFocus('item_container_' + (cIndex + 1)); // 右移一个
                }
                return false;
            case 'up':
                if (itemBtnStatus == 1) {
                    G('cancel_btn').src = List.itemBtnBgNormal;
                    G('detail_btn').src = List.itemBtnBgFocused;
                    itemBtnStatus = 0; //默认焦点在“查看详情”
                } else {
                    if (cIndex >= 1 && cIndex <= 3) {
                        LMEPG.BM.requestFocus("btn-search");
                    } else {
                        LMEPG.BM.requestFocus('item_container_' + (cIndex - 3)); // 上移一个
                    }
                }
                return false;
            case 'down':
                if (itemBtnStatus == 0) {
                    G('detail_btn').src = List.itemBtnBgNormal;
                    G('cancel_btn').src = List.itemBtnBgFocused;
                    itemBtnStatus = 1;  //默认焦点在“收藏/取消收藏”
                } else {
                    if (cIndex >= 1 && cIndex <= 3) {
                        for (var i = cIndex + 3; i >= 4; i--) {
                            if (G('item_container_' + i)) {
                                LMEPG.BM.requestFocus('item_container_' + i); // 下移一个
                                break;
                            }
                        }
                    }
                }
                return false;
        }
    },

    //上一页
    preMenu: function (nextFocusId) {
        if (List.pageCurrent > 1) {
            RenderParam.pageCurrent--;
            RenderParam.focusIndex = nextFocusId;
            Collection.initData();
        }
    },


    //下一页
    nextMenu: function (nextFocusId) {
        if (List.pageCurrent < List.pageNum) {
            RenderParam.pageCurrent++;
            RenderParam.focusIndex = nextFocusId;
            Collection.initData();
        }
    },

    /**
     * 更新箭头
     */
    updateMenuArrows: function () {
        var page_right = document.getElementById("arrow_left");
        var page_left = document.getElementById("arrow_right");
        page_right.style.display = "none";
        page_left.style.display = "none";
        if (List.pageCurrent > 1) {
            page_right.style.display = "block";
        }
        if (List.pageCurrent < List.pageNum) {
            page_left.style.display = "block";
        }
    },

    /**
     * 是否是第一个收藏
     */
    isFirstCollection: function () {
        var index = List.getIndexCollection(null);
        if (index == 0 || index == -2) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 是否是最后一个收藏
     */
    isLastCollection: function () {
        var index = List.getIndexCollection(null);
        if (index == (List.videoList.length - 1) || index == -2) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 获取当前收藏的下标
     *  return -1:没有获取成功；-2：没有收藏视频；其他为成功
     */
    getIndexCollection: function (btn) {
        var position = -1;
        var currentBtn;
        //获取当前焦点btn
        if (LMEPG.Func.isExist(btn)) {
            currentBtn = btn
        } else {
            currentBtn = LMEPG.BM.getCurrentButton();
        }
        //判断是否有收藏视频
        if (currentBtn.id == "noCollection") {
            return -2;
        } else {
            position = currentBtn.cIndex - 1;
            return (List.pageCurrent - 1) * List.cutNum + position;
        }
    },

    /**
     * 无收藏数据初始化返回按键
     */
    backCollection: function () {
        var htm='<div id="id_toast" class=" g_toast" style="visibility: visible;">暂无收藏记录哦！</div>';
        //htm += '<div class="g_common_button_container"><div class="g_common_button_border"><div id="gid_common_button_back" class="g_common_button_text" style="background-image: url(&quot;/Public/img/hd/Dialog/btn_select.png&quot;);">返回</div></div></div>';
        G("addback_key").innerHTML = htm;
        LMEPG.BM.init('',[],'',true);
        LMEPG.UI.commonDialog.show("", ['返回'], function (index) {
            Page.onBack();
            return true;
        });
        document.querySelector('#id_toast').style.setProperty('color','#fff');
        document.querySelector('#id_toast').style.setProperty('left','384px');
        document.querySelector('#id_toast').style.setProperty('background','url("")');
        document.querySelector('.g_common_dialog_img_bg').style.setProperty('background-image','url("")');
        document.querySelector('.g_common_button_text').style.setProperty('font-size','24px');
        document.querySelector('.g_common_button_text').style.setProperty('line-height','73px');
    }
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Collection.init();

    if(RenderParam.carrierId == "07430093" && (RenderParam.isVip != 1 && RenderParam.isVip != '1')){
        document.querySelector('.g_common_dialog_message_text').style.setProperty('color','#fff');
        document.querySelector('#gid_common_button_0').style.setProperty('font-size','24px');
        document.querySelector('#gid_common_button_0').style.setProperty('line-height','73px');
        document.querySelector('#gid_common_button_1').style.setProperty('font-size','24px');
        document.querySelector('#gid_common_button_1').style.setProperty('line-height','73px');
    }
}
