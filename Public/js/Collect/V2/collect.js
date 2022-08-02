
/**
 * 返回按键事件回调
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 页面跳转控制
 */
var Page = {
    getCurrentPage: function (fromId) {
        var objCurrent = LMEPG.Intent.createIntent("collect");
        objCurrent.setParam("userId", RenderParam.userId);
        objCurrent.setParam("fromId", fromId);
        return objCurrent;
    },

    /**
     * 跳转 - 挽留页
     */
    jumpHoldPage: function () {
        var objHome = getCurrentPage();
        var objHold = LMEPG.Intent.createIntent('hold');
        objHold.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objHold, objHome);
    },

    /**
     * @func 进行购买操作
     * @param id 当前页的焦点位置
     * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
     * @returns {boolean}
     */
    jumpBuyVip: function (id, remark) {
        var objCurrent = Page.getCurrentPage("1");

        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("userId", RenderParam.userId);
        objOrderHome.setParam("isPlaying", "1");
        objOrderHome.setParam("remark", remark);

        LMEPG.Intent.jump(objOrderHome, objCurrent);
    },

    /**
     * 播放视频
     */
    jumpPlayVideo: function (focusIdName, videoInfo) {
        var objCurrent = Page.getCurrentPage("2");

        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("userId", RenderParam.userId);
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    /**
     * 跳转 - 视频详情页
     */
    jumpIntroVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast("视频信息为空！");
            return;
        }

        var objHome = Page.getCurrentPage();

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent("introVideo-single");
        objPlayer.setParam("userId", RenderParam.userId);
        objPlayer.setParam("inner", 1);
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
    },
};

var collectData;            //data解压未json对象
var collectList;            //视频列表对象
var collectDataCount = 0;   //视频列表中返回的总条数
var pageCurrent = 1;        //当前页面
var pageCount = 0;          //总页码

var focusId = RenderParam.focusIndex;
focusId = focusId ? focusId : 'focus-1-1-border';

var loadFlagInit = 0;       //初始化页面加载数据
var loadFlagLeft = 1;       //左翻页加载数据
var loadFlagRight = 2;      //右翻页加载数据

var buttons = [
    {
        id: "focus-3-1",
        name: "清空",
        type: 'img',
        nextFocusDown: 'focus-1-1-border',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/clear_out.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/clear_in.png",
        bigImg: "",
        click: clearCollectRecord,
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange
    },
    {
        id: "focus-1-1-border",
        name: "视频1号位",
        type: 'img',
        indexId: 'focus-1-1',
        title: 'focus-1-1-title',
        nextFocusLeft: '',
        nextFocusRight: 'focus-1-2-border',
        nextFocusUp: 'focus-3-1',
        nextFocusDown: 'focus-2-1-btn',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/imgbox.png",
        click: onPlayVideo,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    },
    {
        id: "focus-1-2-border",
        name: "视频2号位",
        type: 'img',
        indexId: 'focus-1-2',
        title: 'focus-1-2-title',
        nextFocusLeft: 'focus-1-1-border',
        nextFocusRight: 'focus-1-3-border',
        nextFocusUp: 'focus-3-1',
        nextFocusDown: 'focus-2-2-btn',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/imgbox.png",
        click: onPlayVideo,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-1-3-border",
        name: "视频3号位",
        type: 'img',
        indexId: 'focus-1-3',
        title: 'focus-1-3-title',
        nextFocusLeft: 'focus-1-2-border',
        nextFocusRight: 'focus-1-4-border',
        nextFocusUp: 'focus-3-1',
        nextFocusDown: 'focus-2-3-btn',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/imgbox.png",
        click: onPlayVideo,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-1-4-border",
        name: "视频4号位",
        type: 'img',
        indexId: 'focus-1-4',
        title: 'focus-1-4-title',
        nextFocusLeft: 'focus-1-3-border',
        nextFocusRight: '',
        nextFocusUp: 'focus-3-1',
        nextFocusDown: 'focus-2-4-btn',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/transparent.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/imgbox.png",
        click: onPlayVideo,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: "focus-2-1-btn",
        name: "按钮1号位",
        type: 'img',
        indexId: 'focus-1-1',
        title: 'focus-1-1-title',
        nextFocusLeft: '',
        nextFocusRight: 'focus-2-2-btn',
        nextFocusUp: 'focus-1-1-border',
        nextFocusDown: 'focus-5-1',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/cancel-unselect.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/cancel.png",
        click: collectItem,
        focusChange: onFocusChangeBtn,
        beforeMoveChange: onBeforeMoveChange,
        cBackgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/confirm-unselect.png",
        cFocusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/confirm.png",
    },
    {
        id: "focus-2-2-btn",
        name: "按钮2号位",
        type: 'img',
        indexId: 'focus-1-2',
        title: 'focus-1-2-title',
        nextFocusLeft: 'focus-2-1-btn',
        nextFocusRight: 'focus-2-3-btn',
        nextFocusUp: 'focus-1-2-border',
        nextFocusDown: 'focus-5-1',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/cancel-unselect.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/cancel.png",
        click: collectItem,
        focusChange: onFocusChangeBtn,
        beforeMoveChange: onBeforeMoveChange,
        cBackgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/confirm-unselect.png",
        cFocusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/confirm.png",
    },
    {
        id: "focus-2-3-btn",
        name: "按钮3号位",
        type: 'img',
        indexId: 'focus-1-3',
        title: 'focus-1-3-title',
        nextFocusLeft: 'focus-2-2-btn',
        nextFocusRight: 'focus-2-4-btn',
        nextFocusUp: 'focus-1-3-border',
        nextFocusDown: 'focus-5-1',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/cancel-unselect.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/cancel.png",
        click: collectItem,
        focusChange: onFocusChangeBtn,
        beforeMoveChange: onBeforeMoveChange,
        cBackgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/confirm-unselect.png",
        cFocusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/confirm.png",
    },
    {
        id: "focus-2-4-btn",
        name: "按钮3号位",
        type: 'img',
        indexId: 'focus-1-4',
        title: 'focus-1-4-title',
        nextFocusLeft: 'focus-2-3-btn',
        nextFocusRight: '',
        nextFocusUp: 'focus-1-4-border',
        nextFocusDown: 'focus-5-1',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/cancel-unselect.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/cancel.png",
        click: collectItem,
        focusChange: onFocusChangeBtn,
        beforeMoveChange: onBeforeMoveChange,
        cBackgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/confirm-unselect.png",
        cFocusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Collect/V1/confirm.png",
    },
    {
        id: 'focus-5-1',
        name: '首页',
        type: 'img',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/bg_home_btn.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/f_home_btn.png",
        nextFocusLeft: '',
        nextFocusRight: 'focus-5-2',
        nextFocusUp: 'focus-2-1-btn',
        nextFocusDown: '',
        click: onKeyEnter,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: 'focus-5-2',
        name: '主页',
        type: 'img',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/bg_main_btn.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/f_main_btn.png",
        nextFocusLeft: 'focus-5-1',
        nextFocusRight: 'focus-5-3',
        nextFocusUp: 'focus-2-1-btn',
        nextFocusDown: '',
        click: onKeyEnter,
        beforeMoveChange: onBeforeMoveChange,
    },
    {
        id: 'focus-5-3',
        name: '返回',
        type: 'img',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/bg_back_btn.png",
        focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V4/f_back_btn.png",
        nextFocusLeft: 'focus-5-2',
        nextFocusRight: '',
        nextFocusUp: 'focus-2-1-btn',
        nextFocusDown: '',
        click: onKeyEnter,
        beforeMoveChange: onBeforeMoveChange,
    }
];


/**
 * @param flag 0:首次加载数据，1:左移动加载数据，2:右移动加载数据
 */
function updateUI(flag) {
    LMEPG.UI.Marquee.stop();

    var localData;
    if (collectData == undefined || collectData == null || collectData.list == '') {
        return 1;
    }

    collectList = collectData.list;

    switch (flag) {
        case loadFlagRight:
            if (pageCurrent <= pageCount) {
                if (pageCurrent < pageCount) {
                    //取消收藏倒数第二页的1个视频，最后一页只有1条视频时，总页数变少了，无法翻页，此时可以刷新最后一页
                    //页数等于最后一页不累加，但是要往下执行
                    pageCurrent++;
                }
                var startIndex = (pageCurrent - 1) * 4;
                var endIndex = startIndex + 4;
                localData = collectList.slice(startIndex, endIndex);
                updatePageArrows();
            } else {
                updatePageArrows();
                return;
            }
            break;
        case loadFlagLeft:
            if (pageCurrent > 1) {
                pageCurrent--;
                var localCollectList = collectData.list;
                var startIndex = (pageCurrent - 1) * 4;
                var endIndex = startIndex + 4;
                localData = localCollectList.slice(startIndex, endIndex);
                updatePageArrows();
            } else {
                return;
            }
            break;
        case loadFlagInit:
            var localCollectList = collectData.list;
            var startIndex = (pageCurrent - 1) * 4;
            var endIndex = startIndex + 4;
            localData = localCollectList.slice(startIndex, endIndex);
            updatePageArrows();
            break;
        default:
            return;
    }

    createHtml();

    //生成html文件
    function createHtml() {
        var content = G("content");
        content.innerHTML = "";
        var html = '';
        for (var i = 0; i < localData.length; i++) {
            var listItem = localData[i];
            var imageUrl = RenderParam.fsUrl + listItem.image_url;//图片地址
            var sourceId = listItem.source_id;//视频源id
            var title = listItem.title;//标题

            html += '<div id="focus-1-' + (i + 1) + '" cData="' + encodeURIComponent(JSON.stringify(listItem)) + '">';
            html += '<img id="focus-1-' + (i + 1) + '-border" src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Collect/V1/transparent.png"/>';
            html += '<img id="focus-1-' + (i + 1) + '-src" src="' + imageUrl + '" />';
            html += '<div id="focus-2-' + (i + 1) + '-btn" status="1" sid="' + sourceId + '" style="background: url(' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Collect/V1/cancel-unselect.png) no-repeat;"></div>';
            html += '<div id="focus-1-' + (i + 1) + '-title">' + title + '</div>';
            html += '</div>';
        }
        content.innerHTML = html;
    }

    if (pageCount > 0) {
        G("pageFlag").innerHTML = pageCurrent + "/" + pageCount;
    } else {
        Show("no_data");
    }
}

/**
 * 更新显示 <- -> 翻页箭头
 */
function updatePageArrows() {
    if (pageCount <= 1) {
        H("leftArrow");
        H("rightArrow");
    } else {
        if (pageCurrent == 1) {
            H("leftArrow");
        } else {
            S("leftArrow");
        }
        if (pageCurrent == pageCount) {
            H("rightArrow");
        } else {
            S("rightArrow");
        }
    }
}

function onKeyEnter(btn) {
    switch (btn.id) {
        case 'focus-5-1':
            UtilsWithGXGD.exitApp();
            break;
        case 'focus-5-2':
            UtilsWithGXGD.jumpAppIndex();
            break;
        case 'focus-5-3':
            UtilsWithGXGD.jumpBack();
            break;
    }
}

function onPlayVideo(btnObj) {
    var focusElement = G(btnObj.id.substr(0, btnObj.id.indexOf('-border')));
    var cDataStr = focusElement.getAttribute("cData");

    try {
        var videoItemObj = JSON.parse(decodeURIComponent(cDataStr));
        var ftpJson = videoItemObj.ftp_url instanceof Object ? videoItemObj.ftp_url : JSON.parse(videoItemObj.ftp_url);
        var videoUrl = RenderParam.platformType === "hd" ? ftpJson.gq_ftp_url : ftpJson.bq_ftp_url;

        var videoInfo = {
            "focusIdx": btnObj.id,
            "sourceId": videoItemObj.sourceId,
            "videoUrl": videoUrl,
            "title": videoItemObj.title,
            "type": videoItemObj.model_type,
            "freeSeconds": videoItemObj.free_seconds,
            "userType": videoItemObj.user_type,
            "entryType": 5,
            "entryTypeName": "collect",
            "unionCode": videoItemObj.union_code,
            "introImageUrl": videoItemObj.intro_image_url,
            "introTxt": videoItemObj.intro_txt,
            "price": videoItemObj.price,
            "validDuration": videoItemObj.valid_duration,
        };

        if (RenderParam.carrierId == "450094") {
            Page.jumpIntroVideo(videoInfo);
        } else {
            // 先判断userType：2需要会员才能观看，其他可以直接观看
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                Page.jumpPlayVideo(btnObj.id, videoInfo);
            } else {
                var postData = {"videoInfo": JSON.stringify(videoInfo)};
                LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
                    if (data.result == 0) {
                        Page.jumpBuyVip(videoInfo.focusIdx, videoInfo.title);
                    } else {
                        LMEPG.UI.showToast("系统报错", 3);
                    }
                });
            }
        }
    } catch (e) {
        LMEPG.UI.showToast("错误：" + e.toString())
    }
}

function onFocusChange(btn, hasFocus) {
    if (hasFocus) {
        LMEPG.UI.Marquee.stop();
        LMEPG.UI.Marquee.start(btn.title, 4, 2, 50, "left", "scroll");
    } else {
        LMEPG.UI.Marquee.stop();
    }
}

function onFocus(btn, hasFocus) {
    var storeID = btn.id;
    if (hasFocus) {
        G(storeID).style.background = "url(" + btn.focusImage + ") no-repeat";
    } else {
        G(storeID).style.background = "url(" + btn.backgroundImage + ") no-repeat";
    }
}

/**
 * 监听上页按键
 */
function pressPreviousPage() {
    if (pageCurrent > 1) {
        updateUI(loadFlagLeft);
        LMEPG.BM.requestFocus("focus-1-4-border");
    }
}

/**
 * 监听下页按键
 */
function pressNextPage() {
    if (pageCurrent <= pageCount) {
        updateUI(loadFlagRight);
        LMEPG.BM.requestFocus("focus-1-1-border");
    }
}

function collectItem(btnObj) {
    var dom = G(btnObj.id);
    var sid = dom.getAttribute("sid");
    var status = dom.getAttribute("status"); //收藏状态：0、 收藏 1、取消收藏

    var postData = {
        "source_id": sid,
        "status": status
    };
    LMEPG.ajax.postAPI("Collect/setCollectStatus", postData, function (rsp) {
        try {
            var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (collectItem.result == 0) {
                var type = status == 1 ? 0 : 1;
                dom.setAttribute("status", type);
                if (status == 1) {
                    dom.style.background = "url(" + btnObj.cFocusImage + ") no-repeat";
                } else {
                    dom.style.background = "url(" + btnObj.focusImage + ") no-repeat";
                }
                getCollectData(1);
            } else {
                LMEPG.UI.showToast("收藏视频失败", 3);
            }
        } catch (e) {
            console.warn("异常：" + e.toString());
        }
    });

}

/**
 * 清空收藏
 */
function clearCollectRecord() {
    LMEPG.ajax.postAPI("Collect/clearCollectRecord", null, function (rsp) {
        try {
            var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (collectItem.result == 0) {
                var content = G("content");
                content.innerHTML = "";
                G("pageFlag").innerHTML = "";
                H("leftArrow");
                H("rightArrow");
                Show("no_data");
            } else {
                LMEPG.UI.showToast("清空失败:" + collectItem.result);
            }
        } catch (e) {
            LMEPG.UI.showToast("清空异常");
        }
    });

}

/**
 *获取用户的收藏
 * @param type 0初始化,1普通获取
 */
function getCollectData(type) {
    LMEPG.ajax.postAPI("Collect/getCollectList", null, function (rsp) {
        try {
            collectData = rsp instanceof Object ? rsp : JSON.parse(rsp);
            var result = collectData.result;
            collectDataCount = collectData.count;
            collectList = collectData.list;
            pageCount = Math.ceil(collectDataCount / 4);

            if (result == 0) {
                if (type == 0) {
                    var ret = updateUI(loadFlagInit);
                    LMEPG.BM.init(focusId, buttons, '', true);
                    if (ret == 1) {
                        LMEPG.BM.requestFocus("focus-3-1");
                    } else {
                        var focus_obj = G(focusId);
                        if (!focus_obj) {
                            LMEPG.BM.requestFocus("focus-3-1");
                        }
                    }

                    if (collectDataCount > 0) {
                        Hide("no_data");
                    } else {
                        Show("no_data");
                    }
                }
            } else {
                LMEPG.UI.showToast("加载收藏视频加载失败[code=" + result + "]", 3);
                Show("no_data");
                LMEPG.BM.init('focus-3-1', [], '', true); // 确保可以按键返回
            }
        } catch (e) {
            LMEPG.UI.showToast("加载收藏视频解析错误！");
            Show("no_data");
            LMEPG.BM.init('focus-3-1', [], '', true); // 确保可以按键返回
        }
    }, function (rsp) {
        LMEPG.UI.showToast("加载收藏列表失败！请稍后重试~");
        Show("no_data");
        LMEPG.BM.init('focus-3-1', [], '', true); // 确保可以按键返回
    });
}

/**
 * 焦点移动前事件回调
 */
function onBeforeMoveChange(dir, current) {
    switch (current.id) {
        // 上一页
        case 'focus-1-1-border':
        case 'focus-2-1-btn':
            if (dir == "left") {
                pressPreviousPage();
                return false;
            }
            break;

        // 下一页
        case 'focus-1-4-border':
        case 'focus-2-4-btn':
            if (dir == "right") {
                pressNextPage();
                return false;
            }
            break;

        // 清空
        case 'focus-3-1':
            if (dir == "down") { // 向下移，无收藏数据，则默认移动到底部“首页”按钮
                var nextDownFocusId = is_element_exist(current.nextFocusDown) ? current.nextFocusDown : "focus-5-1";
                LMEPG.BM.requestFocus(nextDownFocusId);
                return false;
            }
            break;

        // 底部：首页/主页/返回 3个按钮
        case 'focus-5-1':
        case 'focus-5-2':
        case 'focus-5-3':
            if (dir == "up") { // 向上移，无收藏数据，则默认移动到“清空”按钮
                var nextUpFocusId = is_element_exist(current.nextFocusUp) ? current.nextFocusUp : "focus-3-1";
                LMEPG.BM.requestFocus(nextUpFocusId);
                return false;
            }
            break;
    }
}

function onFocusChangeBtn(btn, hasFocus) {
    var dom = G(btn.id);
    var status = dom.getAttribute("status");
    if (hasFocus) {
        if (status == '0' && btn.id.substring(0, 7) == "focus-2") {
            dom.style.background = "url(" + btn.cFocusImage + ") no-repeat";
        } else {
            dom.style.background = "url(" + btn.focusImage + ") no-repeat";
        }
    } else {
        if (status == '0' && btn.id.substring(0, 7) == "focus-2") {
            dom.style.background = "url(" + btn.cBackgroundImage + ") no-repeat";
        } else {
            dom.style.background = "url(" + btn.backgroundImage + ") no-repeat";
        }
    }
}

window.onload = function () {
    getCollectData(0);
};