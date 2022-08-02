var fileIndex = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/IntroVideo/';

var buttons = [
    {
        id: 'main',
        name: '主页',
        type: 'img',
        nextFocusLeft: 'home',
        nextFocusRight: 'back',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: fileIndex + 'bg_main_btn.png',
        focusImage: fileIndex + 'f_main_btn.png',
        focusChange: onFocus,
        click: keyDownEnter
    }, {
        id: 'back',
        name: '返回',
        type: 'img',
        nextFocusLeft: 'main',
        nextFocusRight: '',
        nextFocusDown: '',
        nextFocusUp: '',
        backgroundImage: fileIndex + 'bg_back_btn.png',
        focusImage: fileIndex + 'f_back_btn.png',
        focusChange: onFocus,
        click: keyDownEnter
    }, {
        id: 'play-img',
        name: '播放',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusDown: 'collect-img',
        backgroundImage: fileIndex + 'single_playbtn.png',
        focusImage: fileIndex + 'single_playbtn_f.png',
        focusChange: onFocus,
        click: keyDownEnter
    }, {
        id: 'collect-img',
        name: '收藏',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: 'play-img',
        nextFocusDown: 'main',
        backgroundImage: '',
        focusImage: '',
        focusChange: onFocus,
        click: keyDownEnter
    }];


//Enter键入
function keyDownEnter(btn) {

    var videoInfo = RenderParam.videoInfo;
    switch (btn.id) {
        case  'play-img': // 播放
            try {
                onClickVideoItem(btn.id, videoInfo);
            } catch (e) {
                LMEPG.UI.showToast('系统报错！' + e.toString());
            }
            break;
        case  'main': // 主页
            jumpHomeTab('home');
            break;
        case  'back': // 返回
            onBack();
            break;
        case 'collect-img':
            doCollect();
            break;
    }
}

//获取焦点后添加焦点样式
function onFocus(btn, hasFocus) {
    if (hasFocus) {
        G(btn.id).src = btn.focusImage;//获取焦点时的背景图片
    } else {
        G(btn.id).src = btn.backgroundImage;//获取焦点时的背景图片
    }
}

<!-- 播放、跳转页面 -->
/**
 * 得到当前页面对象
 */
function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent('introVideo-detail');
    objCurrent.setParam('userId', RenderParam.userId);
    objCurrent.setParam('videoInfo', JSON.stringify(RenderParam.videoInfo));
    objCurrent.setParam('inner', RenderParam.inner);
    objCurrent.setParam('unionCode', RenderParam.unionCode);
    return objCurrent;
}

function jumpHomeTab(tabName, focusIndex) {
    var objCurrent = getCurrentPage();

    var objHomeTab = LMEPG.Intent.createIntent(tabName);
    objHomeTab.setParam('userId', RenderParam.userId);
    objHomeTab.setParam('classifyId', '');
    objHomeTab.setParam('focusIndex', focusIndex);

    LMEPG.Intent.jump(objHomeTab, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
}

function jumpVideoPlay(paramJson) {
    var objCurrent = getCurrentPage();
    objCurrent.setParam('focus_index', paramJson.focusIdx);

    var objPlayer = LMEPG.Intent.createIntent('player');
    objPlayer.setParam('userId', RenderParam.userId);
    objPlayer.setParam('videoInfo', JSON.stringify(paramJson));

    LMEPG.Intent.jump(objPlayer, objCurrent);
}

/**
 * @func 进行购买操作
 * @param focusIdx 当前页的焦点位置
 * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
 * @returns {boolean}
 */
function jumpBuyVip(focusIdx, remark) {
    var objCurrent = getCurrentPage();
    objCurrent.setParam('focus_index', focusIdx);

    var objOrderHome = LMEPG.Intent.createIntent('orderHome');
    objOrderHome.setParam('userId', RenderParam.userId);
    objOrderHome.setParam('isPlaying', '1');

    LMEPG.Intent.jump(objOrderHome, objCurrent);
}

/**
 * 监听返回事件--> 返回局方的Home页面
 */
function onBack() {
    var inner = inner;
    if (inner == '1') {
        LMEPG.Intent.back();
    } else {
        exitApp();
    }
}

/**
 * 退出应用
 */
function exitApp() {
    LMEPG.Intent.back('IPTVPortal');
}


// 处理点击视频列表事件
function onClickVideoItem(focusIdName, videoInfo) {
    // user_type字段:观看用户类型，0 -- 游客  1--会员  2-- vip
    var userType = videoInfo.userType;//播放视频是否需要vip权限
    var paramJson = {
        'sourceId': videoInfo.sourceId,
        'videoUrl': encodeURIComponent(videoInfo.videoUrl),
        'title': videoInfo.title,
        'type': videoInfo.type,
        'entryType': videoInfo.entryType,
        'entryTypeName': '',
        'userType': videoInfo.userType,
        'freeSeconds': videoInfo.freeSeconds,
        'focusIdx': focusIdName,
        "unionCode": RenderParam.unionCode,
    };
    if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, paramJson)) {
        jumpVideoPlay(paramJson);
    } else {
        var postData = {'videoInfo': JSON.stringify(videoInfo)};
        LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
            if (data.result == 0) {
                jumpBuyVip(paramJson.focusIdx, paramJson.title);
            } else {
                LMEPG.UI.showToast('系统报错', 3);
            }
        });
    }
}

/**
 * 收藏/取消收藏操作
 */
function doCollect() {
    var contentCode = RenderParam.videoInfo.videoUrl;
    // 去收藏
    if (RenderParam.isCollected == 0) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI("UnifiedPlayer/addCollection", {contentCode: contentCode}, function (rsp) {
            LMEPG.UI.dismissWaitingDialog();
            try {
                var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(collectItem);
                if (collectItem.code == 200) {
                    LMEPG.UI.showToast("收藏成功");
                    RenderParam.isCollected = 1;
                    updateCollectBtn();
                } else {
                    LMEPG.UI.showToast(collectItem.message);
                }
            } catch (e) {
                LMEPG.UI.showToast("操作异常");
            }
        });
    }
    // 取消收藏
    else {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI("UnifiedPlayer/deleteCollections", {contentCodes: contentCode}, function (rsp) {
            LMEPG.UI.dismissWaitingDialog();
            try {
                var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(collectItem);
                if (collectItem.code == 200) {
                    LMEPG.UI.showToast("取消收藏成功");
                    RenderParam.isCollected = 0;
                    updateCollectBtn();
                } else {
                    LMEPG.UI.showToast(collectItem.message);
                }
            } catch (e) {
                LMEPG.UI.showToast("操作异常");
            }
        });
    }
}

/**
 * 更新收藏按钮
 */
function updateCollectBtn() {
    // 未收藏
    if (RenderParam.isCollected == 0) {
        LMEPG.BM.getButtonById('collect-img').backgroundImage = fileIndex + 'video_collect.png';
        LMEPG.BM.getButtonById('collect-img').focusImage =  fileIndex + 'video_collect_f.png';
        if (LMEPG.BM.getCurrentButton().id == 'collect-img') {
            G('collect-img').src = fileIndex + 'video_collect_f.png';
        } else {
            G('collect-img').src = fileIndex + 'video_collect.png';
        }
    }
    // 已收藏
    else {
        LMEPG.BM.getButtonById('collect-img').backgroundImage = fileIndex + 'video_collected.png';
        LMEPG.BM.getButtonById('collect-img').focusImage =  fileIndex + 'video_collected_f.png';
        if (LMEPG.BM.getCurrentButton().id == 'collect-img') {
            G('collect-img').src = fileIndex + 'video_collected_f.png';
        } else {
            G('collect-img').src = fileIndex + 'video_collected.png';
        }
    }
}

window.onload = function () {

    var videoInfo = RenderParam.videoInfo;
    G("title").innerHTML = videoInfo.title;
    G("introduce").innerHTML = videoInfo.introTxt.replace("\n","<br/>");
    G("case-img").setAttribute("src", RenderParam.fsUrl + videoInfo.introImageUrl);
    var id = "play-img";
    Show(id);
    LMEPG.ButtonManager.init(id, buttons, '', true);
    LMEPG.ButtonManager.getButtonById("main").nextFocusUp = id;
    LMEPG.ButtonManager.getButtonById("back").nextFocusUp = id;
    updateCollectBtn();
};
