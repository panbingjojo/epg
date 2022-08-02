navigateModelInfo.splice(0, 0, {'model_type': '', 'model_name': '热门推荐'});


for (var i = 0; i < navigateModelInfo.length; i++) {
    if (navigateModelInfo[i].model_type == modelType && i >= pageCount) {
        navPage = i + 1;
    }
}
var videoList;
var videoPage;
var themePictureUrl = '';
var buttons = [
    {
        id: 'focus-1-1',
        name: '搜索',
        type: 'img',
        backgroundImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/bg_search.png',
        focusImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/f_search.png',
        click: 'jumpSearchPage()',
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-1-2',
        name: '收藏',
        type: 'img',
        backgroundImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/bg_collect.png',
        focusImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/f_collect.png',
        click: 'jumpCollectPage()',
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-2-1',
        name: '热门推荐',
        type: 'img',
        backgroundImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_out.png',
        focusImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_onfocus.png',
        click: jumpNavTab,
        focusChange: onFocusBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-2-2',
        name: '选择区域',
        type: 'img',
        backgroundImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_out.png',
        focusImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_onfocus.png',
        click: jumpNavTab,
        focusChange: onFocusBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-2-3',
        name: '选择区域',
        type: 'img',
        backgroundImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_out.png',
        focusImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_onfocus.png',
        click: jumpNavTab,
        focusChange: onFocusBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-2-4',
        name: '选择区域',
        type: 'img',
        backgroundImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_out.png',
        focusImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_onfocus.png',
        click: jumpNavTab,
        focusChange: onFocusBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-2-5',
        name: '选择区域',
        type: 'img',
        backgroundImage: g_appRootPath + '/Public/img/' + platformFlag + '/V3/tab_nav_out.png',
        focusImage: g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_onfocus.png',
        click: jumpNavTab,
        focusChange: onFocusBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-3-1',
        name: '医院1',
        type: 'img',
        titleId: 'focus-title-1',
        click: 'onKeyEnter(\'focus-3-1\')',
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-3-2',
        name: '选择区域',
        type: 'img',
        titleId: 'focus-title-2',
        click: 'onKeyEnter(\'focus-3-2\')',
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-3-3',
        name: '选择区域',
        type: 'img',
        titleId: 'focus-title-3',
        click: 'onKeyEnter(\'focus-3-3\')',
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-3-4',
        name: '选择区域',
        type: 'img',
        titleId: 'focus-title-4',
        click: 'onKeyEnter(\'focus-3-4\')',
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-4-1',
        name: '选择区域',
        type: 'img',
        titleId: 'focus-title-5',
        click: 'onKeyEnter(\'focus-4-1\')',
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-4-2',
        name: '选择区域',
        type: 'img',
        titleId: 'focus-title-6',
        click: 'onKeyEnter(\'focus-4-2\')',
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    }
    ,
    {
        id: 'focus-4-3',
        name: '选择区域',
        type: 'img',
        titleId: 'focus-title-7',
        click: 'onKeyEnter(\'focus-4-3\')',
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    },
    {
        id: 'focus-4-4',
        name: '选择区域',
        type: 'img',
        titleId: 'focus-title-8',
        click: 'onKeyEnter(\'focus-4-4\')',
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    }
];

/**
 * 跳转 - 收藏页
 */
function jumpCollectPage() {
    var objDst = LMEPG.Intent.createIntent('collect');
    objDst.setParam('position', 'tabMore');

    var objHome = LMEPG.Intent.createIntent();
    objHome.setPageName('tabMore');
    objHome.setParam('classifyId', classifyId);
    objHome.setParam('modelType', modelType);

    LMEPG.Intent.jump(objDst, objHome);
}

/**
 * 跳转 - 搜索页
 * */
function jumpSearchPage() {
    var objDst = LMEPG.Intent.createIntent('search');
    objDst.setParam('position', 'tabMore');

    var objHome = LMEPG.Intent.createIntent();
    objHome.setPageName('tabMore');
    objHome.setParam('classifyId', classifyId);
    objHome.setParam('modelType', modelType);

    LMEPG.Intent.jump(objDst, objHome);
}

function jumpNavTab(btn) {
    var model_type = G(btn.id).getAttribute('model_type');
    if (model_type == '') {
        jumpHomeTab();
    } else {
        jumpTabMore(model_type);
    }
}

/**
 * 跳转 - 切换导航页
 */
function jumpHomeTab() {
    var objCurrent = LMEPG.Intent.createIntent();

    var objHomeTab = LMEPG.Intent.createIntent('homeTab' + classifyId);
    objHomeTab.setParam('classifyId', classifyId);

    LMEPG.Intent.jump(objHomeTab, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
}

/**
 * 跳转 - 切换视频栏目页
 */
function jumpTabMore(model_type) {
    var objCurrent = LMEPG.Intent.createIntent();

    var objHomeTab = LMEPG.Intent.createIntent('tabMore');
    objHomeTab.setParam('classifyId', classifyId);
    objHomeTab.setParam('modelType', model_type);

    LMEPG.Intent.jump(objHomeTab, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
}

function navShow(current) {
    var pageIndex = current - pageCount;
    var navContent = navigateModelInfo.slice(pageIndex, current);
    var htmlText = '';
    Hide('nav_left');
    Hide('nav_right');
    if (current > pageCount) {
        Show('nav_left');
    }
    if (current < navigateModelInfo.length) {
        Show('nav_right');
    }
    var btnHover;
    for (var i = 0; i < navContent.length; i++) {
        if (navContent[i]['model_type'] == modelType) {
            btnHover = 'focus-2-' + (i + 1);
            htmlText += '<span id="focus-2-' + (i + 1) + '" class="navimg" model_type="' + navContent[i]['model_type'] + '" hover="1">' + navContent[i]['model_name'] + '</span>';
        } else {
            htmlText += '<span id="focus-2-' + (i + 1) + '" class="navimg" model_type="' + navContent[i]['model_type'] + '">' + navContent[i]['model_name'] + '</span>';
        }
    }
    if (htmlText != '') {
        G('nav').innerHTML = htmlText;
        if (G(btnHover)) {
            G(btnHover).style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_onblur.png)';
        }
    }
}

function onBeforeMoveChange(dir, current) {
    LMEPG.Func.gridBtnUtil.onCommonMoveChange(dir, current, "focus", "-");
}

function onCommonMoveChangeCallback(dir, current) {
    if (dir == 'right') {
        var id = 'focus-2-5';
        if (platformFlag == 'sd') {
            id = 'focus-2-4';
        }
        if (current.id == id && navPage < navigateModelInfo.length) {
            navPage = navPage + 1;
            navShow(navPage);
            LMEPG.ButtonManager.requestFocus(id);
        }
        if ((current.id == 'focus-3-4' || current.id == 'focus-4-4') && pageCurrent < videoPage) {
            pageCurrent = pageCurrent + 1;
            getData('focus-3-1');
        }
    }
    if (dir == 'left') {
        if (current.id == 'focus-2-1' && navPage > pageCount) {
            navPage = navPage - 1;
            navShow(navPage);
            LMEPG.ButtonManager.requestFocus('focus-2-1');
        }
        if ((current.id == 'focus-3-1' || current.id == 'focus-4-1') && pageCurrent > 1) {
            pageCurrent = pageCurrent - 1;
            getData('focus-3-4');
        }
    }
}

function onFocusBtn(btn, hasFocus) {
    if (hasFocus == true) {
        G(btn.id).style.backgroundImage = 'url(' + btn.focusImage + ')';
    } else {
        if (G(btn.id).getAttribute('hover')) {
            G(btn.id).style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/tab_nav_onblur.png)';
        } else {
            G(btn.id).style.backgroundImage = 'url(' + btn.backgroundImage + ')';
        }
    }
}

function onFocus(btn, hasFocus) {
    if (hasFocus == true) {
        G(btn.id).style.visibility = 'visible';
    } else {
        G(btn.id).style.visibility = 'hidden';
    }
    LMEPG.UI.Marquee.stop();
    LMEPG.UI.Marquee.start(btn.titleId, 5, 2, 50, 'left', 'scroll');
}

// 渲染页面
function renderUI() {
    // 渲染主题背景图片
    renderThemeUI();
}

// 渲染主题背景图片
function renderThemeUI() {
    var bodyDiv = G('home_container');
    if (themePictureUrl == null || themePictureUrl == '') {
        bodyDiv.style.backgroundImage = "url('" + g_appRootPath + "/Public/img/" + platformFlag + "/Common/V1/bg_home.png')";
    } else {
        bodyDiv.style.backgroundImage = 'url(' + RenderParam.fsUrl + themePictureUrl + ')';
    }
}

function onBack() {
    jumpHomeTab();
}

/**
 * 得到当前页对象
 */
function getCurrentPage(focusId, fromId) {
    var objCurrent = LMEPG.Intent.createIntent('tabMore');
    objCurrent.setParam('userId', userId);
    objCurrent.setParam('fromId', fromId);
    objCurrent.setParam('focusIndex', focusId);
    objCurrent.setParam('classifyId', classifyId);
    objCurrent.setParam('modelType', modelType);
    objCurrent.setParam('pageCurrent', pageCurrent);
    return objCurrent;
}

//播放视频
function jumpPlayVideo(videoInfo) {

    var objCurrent = getCurrentPage(videoInfo.focusIdx, '2');

    var objPlayer = LMEPG.Intent.createIntent('player');
    objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

    LMEPG.Intent.jump(objPlayer, objCurrent);
}

/**
 * @func 进行购买操作
 * @param id 当前页的焦点位置
 * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
 * @returns {boolean}
 */
function jumpBuyVip(id, remark) {
    var objCurrent = getCurrentPage(id, '1');

    var objOrderHome = LMEPG.Intent.createIntent('orderHome');
    objOrderHome.setParam('isPlaying', '1');
    objOrderHome.setParam('remark', remark);

    LMEPG.Intent.jump(objOrderHome, objCurrent);
}

function onKeyEnter(focusIDName) {
    var focusElement = G(focusIDName);
    var index = focusElement.getAttribute('index');
    var list = videoList;
    if (list != undefined && list != null) {
        if (index >= 0 && index < list.length) {
            var item = list[index];
            var videoItem = item;
            try {
                var videoUrlObj = (videoItem.ftp_url instanceof Object ? videoItem.ftp_url : JSON.parse(videoItem.ftp_url));
                var videoUrl = (platformFlag == 'hd' ? videoUrlObj.gq_ftp_url : videoUrlObj.bq_ftp_url);
                var videoInfo = {
                    'sourceId': videoItem.source_id,
                    'videoUrl': videoUrl,
                    'title': videoItem.title,
                    'type': videoItem.model_type,
                    'freeSeconds': videoItem.free_seconds,
                    'userType': videoItem.user_type,
                    'entryType': 3,
                    'entryTypeName': RenderParam.modeTitle,
                    'focusIdx': focusIDName,
                    'show_status': videoItem.show_status
                };

                //视频专辑下线处理
                if(videoInfo.show_status == "3") {
                    LMEPG.UI.showToast('该节目已下线');
                    return;
                }

                // 先判断userType：2需要会员才能观看，其他可以直接观看
                if (LMEPG.Func.isAllowAccess(isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                    jumpPlayVideo(videoInfo);
                } else {
                    var postData = {'videoInfo': JSON.stringify(videoInfo)};
                    LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
                        if (data.result == 0) {
                            jumpBuyVip(videoInfo.focusIdx, videoInfo.title);
                        } else {
                            LMEPG.UI.showToast('系统报错', 3);
                        }
                    });
                }
            } catch (e) {
            }
        }
    }
}

/**
 * 加载界面数据
 */
function getData(focusId) {
    var reqData = {
        'page': pageCurrent,
        'userId': userId,
        'modeType': modelType,
        'pageNum': 8
    };
    LMEPG.ajax.postAPI('Channel/moreAjaxList', reqData, function (rsp) {
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data.result == 0) {
                videoList = data.list;
                videoPage = Math.ceil(data.count / 8);
                showVideoList();
                if (focusId) {
                    LMEPG.ButtonManager.requestFocus(focusId);
                }
            } else {
                LMEPG.UI.showToast('视频加载失败[code=' + data.result + ']');
            }
        } catch (e) {
            LMEPG.UI.showToast('视频加载解析异常' + e.toString());
        }
    }, function (rsp) {
        LMEPG.UI.showToast('视频加载请求失败');
    });
}

function showVideoList() {
    if (videoList.length > 0) {
        var htmlText = '';
        G('pages').innerHTML = pageCurrent + '/' + videoPage;
        for (var i = 0; i < videoList.length; i++) {
            if (i < 4) {
                if (showCornerFree == '1' && videoList[i]['user_type'] == '0' && !LMEPG.Func.isAllowAccess(isVip, ACCESS_NO_TYPE)) {
                    htmlText += '<div class="focus' + (i + 1) + '">' +
                        '<img id="focus-3-' + (i + 1) + '" class="video-border" src="' + g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/video_border.png" index="' + i + '"/>' +
                        '<img  class="video-img" src="' + RenderParam.fsUrl + videoList[i]['image_url'] + '"/>' +
                        '<div class="focus-title" id="focus-title-' + (i + 1) + '">' + videoList[i]['title'] + '</div><img class="corner_free" id="corner_free_1" src="__ROOT__/Public/img/Common/corner_free.png">' +
                        '</div>';
                } else {
                    htmlText += '<div class="focus' + (i + 1) + '">' +
                        '<img id="focus-3-' + (i + 1) + '" class="video-border" src="' + g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/video_border.png" index="' + i + '"/>' +
                        '<img  class="video-img" src="' + RenderParam.fsUrl + videoList[i]['image_url'] + '"/>' +
                        '<div class="focus-title" id="focus-title-' + (i + 1) + '">' + videoList[i]['title'] + '</div>' +
                        '</div>';
                }
            } else {
                if (showCornerFree == '1' && videoList[i]['user_type'] == '0' && !LMEPG.Func.isAllowAccess(isVip, ACCESS_NO_TYPE)) {
                    htmlText += '<div class="focus' + (i + 1) + '">' +
                        '<img id="focus-4-' + (i + 1 - 4) + '" class="video-border" src="' + g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/video_border.png" index="' + i + '"/>' +
                        '<img  class="video-img" src="' + RenderParam.fsUrl + videoList[i]['image_url'] + '"/>' +
                        '<div class="focus-title" id="focus-title-' + (i + 1) + '">' + videoList[i]['title'] + '</div><img class="corner_free" id="corner_free_1" src="__ROOT__/Public/img/Common/corner_free.png">' +
                        '</div>';
                } else {
                    htmlText += '<div class="focus' + (i + 1) + '">' +
                        '<img id="focus-4-' + (i + 1 - 4) + '" class="video-border" src="' + g_appRootPath + '/Public/img/' + platformFlag + '/Home/V3/video_border.png" index="' + i + '"/>' +
                        '<img  class="video-img" src="' + RenderParam.fsUrl + videoList[i]['image_url'] + '"/>' +
                        '<div class="focus-title" id="focus-title-' + (i + 1) + '">' + videoList[i]['title'] + '</div>' +
                        '</div>';
                }
            }
        }
        Hide('video_left_page');
        Hide('video_right_page');
        if (pageCurrent > 1) {
            Show('video_left_page');
        }
        if (pageCurrent < videoPage && videoPage > 0) {
            Show('video_right_page');
        }
        G('videoList').innerHTML = htmlText;
    }
}

// 渲染页面的图片
renderUI();

window.onload = function () {
    navShow(navPage);
    getData('');
    var nav = G("nav");
    var navHover;
    for (var i = 0; i < nav.childNodes.length; i++) {
        var navId = nav.childNodes[i].id;
        if (navId != undefined) {
            var obj = G(navId);
            if (obj.getAttribute("model_type") == modelType) {
                navHover = navId;
                break;
            }
        }
    }
    LMEPG.ButtonManager.init(navHover, buttons, '', true);
};