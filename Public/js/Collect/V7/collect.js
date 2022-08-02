<!--页面跳转-->
function getCurrentPage(fromId) {
    var objCurrent = LMEPG.Intent.createIntent("collect");
    objCurrent.setParam("userId", RenderParam.userId);
    objCurrent.setParam("fromId", fromId);
    objCurrent.setParam("focusId", LMEPG.BM.getCurrentButton().id);
    objCurrent.setParam("page", pageCurrent);
    return objCurrent;
}

/**
 * 跳转 - 收藏页
 */
function jumpCollectPage() {
    var objCurrent = getCurrentPage("1");
    objCurrent.setParam("userId", userId);

    var objCollect = LMEPG.Intent.createIntent("collect");
    objCollect.setParam("userId", userId);

    LMEPG.Intent.jump(objCollect, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
}

/**
 * @func 进行购买操作
 * @param id 当前页的焦点位置
 * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
 * @returns {boolean}
 */
function jumpBuyVip(id, remark) {
    var objCurrent = getCurrentPage("1");

    var objOrderHome = LMEPG.Intent.createIntent("orderHome");
    objOrderHome.setParam("userId", RenderParam.userId);
    objOrderHome.setParam("isPlaying", "1");
    objOrderHome.setParam("remark", remark);

    LMEPG.Intent.jump(objOrderHome, objCurrent);
}

//播放视频
function jumpPlayVideo(focusIdName, videoInfo) {

    var objCurrent = getCurrentPage("2");

    var objPlayer = LMEPG.Intent.createIntent("player");
    objPlayer.setParam("userId", RenderParam.userId);
    objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

    LMEPG.Intent.jump(objPlayer, objCurrent);
}

function onBack() {
    LMEPG.Intent.back();
}

var collectData;                              //data解压未json对象
var collectList;                              //视频列表对象
var count;                                    //视频列表中返回的总条数
var pageCurrent = RenderParam.page;                    //当前页面
var pageTotal = 0;                      //总页码

var loadFlagInit = 0;                         //初始化页面加载数据
var loadFlagLeft = 1;                         //左翻页加载数据
var loadFlagRight = 2;                        //右翻页加载数据

var platformType = RenderParam.platformType;//hd高清，sd标清
var isVip = RenderParam.isVip; // 用户是不是vip，1--是vip
var userId = RenderParam.userId;
var uiPageFlag = document.getElementById("page-num");         //分页标记
var eleNoData = document.getElementById("empty-data");
var focusId = RenderParam.focusIndex;
focusId = focusId ? focusId : 'focus-1-1-border';


/**
 *
 * @param data
 * @param flag 0:首次加载数据，1:左移动加载数据，2:右移动加载数据
 */
function updateUI(flag) {
    var localData;
    if (collectData == undefined || collectData == null || collectData.list == '') {
        Show(eleNoData);
        return 1;
    }
    stopMarqueeUI();

    collectList = collectData.list;

    switch (flag) {
        case loadFlagRight:
            if (pageCurrent <= pageTotal) {
                if (pageCurrent < pageTotal) {
                    //取消收藏倒数第二页的1个视频，最后一页只有1条视频时，总页数变少了，无法翻页，此时可以刷新最后一页
                    //页数等于最后一页不累加，但是要往下执行
                    pageCurrent++;
                }

                var startIndex = (pageCurrent - 1) * 4;
                var endIndex = startIndex + 4;
                localData = collectList.slice(startIndex, endIndex);
            }
            break;
        case loadFlagLeft:
            if (pageCurrent > 1) {
                pageCurrent--;
                var localCollectList = collectData.list;
                var startIndex = (pageCurrent - 1) * 4;
                var endIndex = startIndex + 4;
                localData = localCollectList.slice(startIndex, endIndex);
            }
            break;
        case loadFlagInit:
            var localCollectList = collectData.list;
            var startIndex = (pageCurrent - 1) * 4;
            var endIndex = startIndex + 4;
            localData = localCollectList.slice(startIndex, endIndex);

            break;
        default:
            return;
    }

    if (pageCurrent > 1) {
        Show("arrow-left");
    } else {
        Hide("arrow-left");
    }

    if (pageTotal > 1 && pageTotal != pageCurrent) {
        Show("arrow-right");
    } else {
        Hide("arrow-right");
    }

    createHtml();

    //生成html文件
    function createHtml() {
        var content = document.getElementById("content");
        content.innerHTML = "";
        var html = '';
        for (var dataIndex = 0; dataIndex < localData.length; dataIndex++) {
            var listItem = localData[dataIndex];
            var duration = listItem.duration;//视频观看时长
            var freeSeconds = listItem.free_seconds;//免费观看时长
            var ftpUrl = listItem.ftp_url;//视频下载地址
            var imageUrl = RenderParam.fsUrl + listItem.image_url;//图片地址
            var insertDt = listItem.insert_dt;//视频添加时间
            var modelType = listItem.model_type;//
            var sourceId = listItem.source_id;//视频源id
            var title = listItem.title;//标题
            var userType = listItem.user_type;//用户类型
            var unionCode = listItem.union_code;//统一编码

            html += '<div id="focus-1-' + (dataIndex + 1) + '" sid="' + sourceId + '" usertype="' + userType + '" ftp=\'' + ftpUrl + '\' title="' + title +
                '" modelType="' + modelType + '" freeSeconds="' + freeSeconds +
                '" duration="' + duration + '" unionCode="' + unionCode + '">';
            html += '<img id="focus-1-' + (dataIndex + 1) + '-border" src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Collect/V1/transparent.png"/>';
            html += '<img id="focus-1-' + (dataIndex + 1) + '-src" src="' + imageUrl + '" />';
            html += '<div id="focus-2-' + (dataIndex + 1) + '-btn" status="1" sid="' + sourceId + '" style="background: url(__ROOT__/Public/img/hd/Menu/QHotherPages/btn_uncollect.png) no-repeat;"></div>';
            html += '<div id="focus-1-' + (dataIndex + 1) + '-title">' + title + '</div>';
            html += '</div>';
        }
        content.innerHTML = html;
    }

    if (pageTotal > 0) {
        uiPageFlag.innerHTML = pageCurrent + "/" + pageTotal;
    } else {
        Show(eleNoData);
    }
}

function onFocusChangeBtn(btn, hasFocus) {
    var storeID = btn.id;
    var status = G(storeID).getAttribute("status");
    if (hasFocus) {
        if (status == '0' && storeID.substring(0, 7) == "focus-2") {
            G(storeID).style.background = "url(" + btn.cFocusImage + ") no-repeat";
        } else {
            G(storeID).style.background = "url(" + btn.focusImage + ") no-repeat";
        }
    } else {
        if (status == '0' && storeID.substring(0, 7) == "focus-2") {
            G(storeID).style.background = "url(" + btn.cBackgroundImage + ") no-repeat";
        } else {
            G(storeID).style.background = "url(" + btn.backgroundImage + ") no-repeat";
        }
    }
}

//        获得焦点事件
function onFocusChange(btn, hasFocus) {
    if (hasFocus) {
        if (btn.title.length > 8) {
            marqueeUI(btn.title);  //开始滚动标题
        }
    } else {
        stopMarqueeUI();
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
    if (pageCurrent <= pageTotal) {
        updateUI(loadFlagRight);
        LMEPG.BM.requestFocus("focus-1-1-border");
    }
}

/**
 * 焦点移动前事件回调
 * @param prev
 * @param btn
 * @param hasFocus
 */
function onBeforeMoveChange(dir, current) {
    //翻页
    switch (current.id) {
        case 'focus-1-1-border':
            if (dir == "left") {
                pressPreviousPage();
                return false;
            }
            break;
        case 'focus-1-2-border':
            break;
        case 'focus-1-3-border':
            break;
        case 'focus-1-4-border':
            if (dir == "right") {
                pressNextPage();
                return false;
            }
            break;
        case 'focus-2-1-btn':
            if (dir == "left") {
                pressPreviousPage();
                return false;
            }
            break;
        case 'focus-2-4-btn':
            if (dir == "right") {
                pressNextPage();
                return false;
            }
            break;
    }
}

function onKeyEnter(btn) {
    var focusIdName = btn.id;
    if (focusIdName.substring(0, 7) == "focus-2") {
        var focusElement = document.getElementById(focusIdName);
        var sid = focusElement.getAttribute("sid");
        var status = focusElement.getAttribute("status");
        var modelType = focusElement.getAttribute("modelType");
        collectItem(sid, status, focusIdName, btn);
    } else if (focusIdName == "focus-3-1") {
        clearCollectRecord();
    } else if (focusIdName.substring(0, 7) == "focus-1") {
        var focusElement = document.getElementById(focusIdName.substring(0, 9));
        var sid = focusElement.getAttribute("sid");
        var userType = focusElement.getAttribute("usertype");
        var videoUrl = "";
        var ftp = focusElement.getAttribute("ftp");
        var title = focusElement.getAttribute("title");
        var modelType = focusElement.getAttribute("modelType");
        var freeSeconds = focusElement.getAttribute("freeSeconds");
        var duration = focusElement.getAttribute("duration");
        var unionCode = focusElement.getAttribute("unionCode");

        try {
            if (ftp instanceof Object) {
                var ftpJson = ftp;
            } else {
                var ftpJson = JSON.parse(ftp);
            }

            if (platformType == "hd") {
                videoUrl = ftpJson.gq_ftp_url;
            } else {
                videoUrl = ftpJson.bq_ftp_url;
            }

            var videoInfo = {
                "sourceId": sid,
                "videoUrl": videoUrl,
                "title": title,
                "type": modelType,
                "freeSeconds": freeSeconds,
                "userType": userType,
                "entryType": 5,
                "entryTypeName": "collect",
                "unionCode": unionCode,
                "focusIdx": focusIdName,
                "durationTime": duration
            };

            // 先判断userType：2需要会员才能观看，其他可以直接观看
            if (LMEPG.Func.isAllowAccess(isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                jumpPlayVideo(focusIdName, videoInfo);
            } else {
                var postData = {"videoInfo": JSON.stringify(videoInfo)};
                LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
                    if (data.result == 0) {
                        jumpBuyVip(videoInfo.focusIdx, videoInfo.title);
                    } else {
                        LMEPG.UI.showToast("系统报错", 3);
                    }
                });
            }

        } catch (e) {

        }

    }
}

/**
 *
 * @param status   收藏状态：0、 收藏 1、取消收藏
 */
function collectItem(sourceID, status, focusID, btn) {
    var postData = {
        "source_id": sourceID,
        "status": status,
    };
    LMEPG.ajax.postAPI("Collect/setCollectStatus", postData, function (rsp) {
        try {
            var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (collectItem.result == 0) {
                var type = status == 1 ? 0 : 1;
                var focusElement = document.getElementById(focusID);
                focusElement.setAttribute("status", type);

                if (status == 1) {
                    focusElement.style.background = "url(" + btn.cFocusImage + ") no-repeat";
                } else {
                    focusElement.style.background = "url(" + btn.focusImage + ") no-repeat";
                }
                getCollectData(1);
            } else {
                LMEPG.UI.showToast("收藏视频失败", 3);
            }
        } catch (e) {

        }
    });
}

/**
 *清空收藏
 */
function clearCollectRecord() {
    LMEPG.ajax.postAPI("Collect/clearCollectRecord", null, function (rsp) {
        try {
            var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (collectItem.result == 0) {
                var content = document.getElementById("content");
                content.innerHTML = "";
                uiPageFlag.innerHTML = "";
                Hide("arrow-left");
                Hide("arrow-right");
                Show(eleNoData);
            } else {
                LMEPG.UI.showToast("清空失败:" + collectItem.result, 3);
            }
        } catch (e) {
            LMEPG.UI.showToast("清空异常", 3);
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
            count = collectData.count;
            collectList = collectData.list;
            pageTotal = Math.ceil(count / 4);
            if (result == 0) {
                if (type == 0) {
                    var ret = updateUI(loadFlagInit);
                    LMEPG.BM.init(focusId, buttons, '', true);
                    if (ret == 1) {
                        LMEPG.BM.requestFocus("focus-3-1");
                    } else {
                        var focus_obj = G(focusId);
                        if (focus_obj == undefined || focus_obj == null || focus_obj == '') {
                            LMEPG.BM.requestFocus("focus-3-1");
                            jumpCollectPage();
                        }
                    }
                }

            } else {
                LMEPG.BM.init("focus-3-1", buttons, '', true);//出错！确保能按键返回上一页
                LMEPG.UI.showToast("视频加载失败[code=" + result + "]", 3);
                eleNoData.style.display = "block";
            }
        } catch (e) {
        }
    });
}

function stopMarqueeUI() {
    LMEPG.UI.Marquee.stop();
}

function marqueeUI(nextID) {
    LMEPG.UI.Marquee.stop();
    var scrollFocus = nextID + "-title";
    LMEPG.UI.Marquee.start(nextID, 10, 2, 50, "left", "scroll");
}

//        注册翻页按钮
LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_PAGE_LEFT: 'pressPreviousPage()',	        //上一页事件
        KEY_PAGE_RIGHT: 'pressNextPage()',           //下一页事件
    });
var buttons = [
    {
        id: "focus-3-1",
        name: "清空",
        type: 'img',
        nextFocusDown: 'focus-1-1-border',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/clearCollect.png",
        focusImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/clearCollect_f.png",
        bigImg: "",
        click: onKeyEnter,
        focusChange: onFocus
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
        backgroundImage: g_appRootPath + "/Public/img/Common/spacer.gif",
        focusImage: g_appRootPath + "/Public/img/hd/Menu/Tab5/levelThree_f.png",
        click: onKeyEnter,
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
        backgroundImage: g_appRootPath + "/Public/img/Common/spacer.gif",
        focusImage: g_appRootPath + "/Public/img/hd/Menu/Tab5/levelThree_f.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
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
        backgroundImage: g_appRootPath + "/Public/img/Common/spacer.gif",
        focusImage: g_appRootPath + "/Public/img/hd/Menu/Tab5/levelThree_f.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
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
        backgroundImage: g_appRootPath + "/Public/img/Common/spacer.gif",
        focusImage: g_appRootPath + "/Public/img/hd/Menu/Tab5/levelThree_f.png",
        click: onKeyEnter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
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
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_uncollect.png",
        focusImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_uncollect_f.png",
        click: onKeyEnter,
        focusChange: onFocusChangeBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
        cBackgroundImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_collect.png",
        cFocusImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_collect_f.png",
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
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_uncollect.png",
        focusImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_uncollect_f.png",
        click: onKeyEnter,
        focusChange: onFocusChangeBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
        cBackgroundImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_collect.png",
        cFocusImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_collect_f.png",
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
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_uncollect.png",
        focusImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_uncollect_f.png",
        click: onKeyEnter,
        focusChange: onFocusChangeBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
        cBackgroundImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_collect.png",
        cFocusImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_collect_f.png",
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
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_uncollect.png",
        focusImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_uncollect_f.png",
        click: onKeyEnter,
        focusChange: onFocusChangeBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
        cBackgroundImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_collect_f.png",
        cFocusImage: g_appRootPath + "/Public/img/hd/Menu/QHotherPages/btn_collect_f.png",
    },
];