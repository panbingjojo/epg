var mockVideoIndex = RenderParam.videoInfoList.list;
var allVideoInfo = [];
mockVideoIndex.sort(asc);
for (var i = 0; i < mockVideoIndex.length; i++) {
    var key = 'index';
    var value = i;
    mockVideoIndex[i][key] = value;
    var videoObj = mockVideoIndex[i]['ftp_url'] instanceof Object ? mockVideoIndex[i]['ftp_url'] : JSON.parse(mockVideoIndex[i]['ftp_url']);
    var videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
    var paramJson = {
        'sourceId': mockVideoIndex[i]['source_id'],
        'videoUrl': videoUrl,
        'title': mockVideoIndex[i]['title'],
        'type': mockVideoIndex[i]['model_type'],
        'userType': mockVideoIndex[i]['user_type'],
        'freeSeconds': mockVideoIndex[i]['freeSeconds'],
        'entryType': 7,
        'entryTypeName': '',
        'focusIdx': '',
        'introImageUrl': mockVideoIndex[i]['intro_image_url'],
        'price': mockVideoIndex[i]['price'],
        'validDuration': mockVideoIndex[i]['valid_duration']
    };
    allVideoInfo.push(paramJson);
}
var buttons = [
    {
        id: 'home',
        name: '首页',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'main',
        nextFocusUp: '',
        nextFocusDown: 'play-img',
        backgroundImage: RenderParam.fileIndex + 'bg_home_btn.png',
        focusImage: RenderParam.fileIndex + 'f_home_btn.png',
        focusChange: onFocus,
        click: keyDownEnter,
        moveChange: ''
    }, {
        id: 'main',
        name: '主页',
        type: 'img',
        nextFocusLeft: 'home',
        nextFocusRight: 'back',
        nextFocusUp: '',
        nextFocusDown: 'play-img',
        backgroundImage: RenderParam.fileIndex + 'bg_main_btn.png',
        focusImage: RenderParam.fileIndex + 'f_main_btn.png',
        focusChange: onFocus,
        click: keyDownEnter
    }, {
        id: 'back',
        name: '返回',
        type: 'img',
        nextFocusLeft: 'main',
        nextFocusRight: '',
        nextFocusDown: 'play-img',
        nextFocusUp: '',
        backgroundImage: RenderParam.fileIndex + 'bg_back_btn.png',
        focusImage: RenderParam.fileIndex + 'f_back_btn.png',
        focusChange: onFocus,
        click: keyDownEnter
    }, {
        id: 'play-img',
        name: '播放',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: 'home',
        nextFocusDown: 'list-1',
        backgroundImage: RenderParam.fileIndex + 'single_playbtn.png',
        focusImage: RenderParam.fileIndex + 'single_playbtn_f.png',
        focusChange: onFocus,
        click: keyDownEnter
    }];


/** 结束页面 */
window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};

// 文本介绍--
function intoduceHtml() {
    var introduce = RenderParam.mockModeInfo.introduce.replace(new RegExp('\n', 'g'), '<br />');
    G('title').innerHTML = RenderParam.mockModeInfo.title;
    G('introduce').innerHTML = introduce;
    G('case-img').setAttribute('src', RenderParam.fsUrl + RenderParam.mockModeInfo.introImageUrl);
}

// 系列视频tab--
var tabhtml = function () {
    var insertDom = '';
    var totalList = Math.ceil(mockVideoIndex.length / 10);
    for (var i = 0; i < totalList; i++) {
        var end = (i * 10 + 10);
        if (i === totalList - 1) {
            //最后一页
            end = mockVideoIndex.length;
        }
        insertDom += '<div id="list-' + (i + 1) + '"  class="list-container">' + (i * 10 + 1) + '-' + end + '</div>';
        buttons.push(
            {
                id: 'list-' + (i + 1),
                name: 'list',
                type: 'bg',
                nextFocusLeft: 'list-' + i,
                nextFocusRight: 'list-' + (i + 2),
                nextFocusUp: 'play-img',
                nextFocusDown: 'item-1',
                backgroundImage: RenderParam.fileIndex + 'video_label.png',
                focusImage: RenderParam.fileIndex + 'video_label_f.png',
                focusChange: onFocus
            }
        );
    }
    G('tab').innerHTML = insertDom;
};

//对json进行升序排序函数
function asc(x, y) {
    return (x['source_id'] > y['source_id']) ? 1 : -1;
}

// 系列视频content--
function tabContentHtml(focusId) {
    var start, end, insertDom, newArr;

    if (focusId) {
        start = (focusId.slice(5) - 1) * 10;
        end = focusId.slice(5) * 10;
    } else {
        start = 0;
        end = 10;
    }
    newArr = mockVideoIndex.slice(start, end);
    var videoHtml = function () {
        buttons.splice(4 + Math.ceil(mockVideoIndex.length / 10)); // 初始化焦点个数
        insertDom = '';
        for (var i = 0; i < newArr.length; i++) {
            // 是否免费
            var bg = newArr[i].user_type == 0 ? RenderParam.fileIndex + 'video_label.png' : RenderParam.fileIndex + 'video_vip_btn.png';
            var free = newArr[i].user_type == 0 ? 1 : 0;

            insertDom += '<div id="item-' + (i + 1) + '" free="' + free + '" videoDataIndex = "' + newArr[i].index + '" style="background-image: url(' + bg + ')" class="item-container" >' + (newArr[i].index + 1) + '</div>';
            buttons.push({
                id: 'item-' + (i + 1),
                name: '',
                type: 'bg',
                nextFocusLeft: 'item-' + i,
                nextFocusRight: 'item-' + (i + 2),
                nextFocusUp: i < 5 ? 'list-1' : 'item-' + (i - 4),
                nextFocusDown: 'item-' + (i + 6),
                backgroundImage: RenderParam.fileIndex + 'video_vip_btn.png',
                focusImage: RenderParam.fileIndex + 'video_vip_btn_f.png',
                focusChange: onFocus,
                click: keyDownEnter
            });
        }
        G('tab-content').innerHTML = insertDom;
    };
    videoHtml(); // 视频Dom
}

//获取焦点后添加焦点样式
function onFocus(btn, hasFocus) {

    switch (btn.type) {
        case 'img':
            if (hasFocus) {
                G(btn.id).src = btn.focusImage;//获取焦点时的背景图片
            } else {
                G(btn.id).src = btn.backgroundImage;//失去焦点时的背景图片
            }
            break;
        case 'bg':
            if (hasFocus) { // 得到焦点
                if (btn.id.slice(0, 1) == 'l') {
                    tabContentHtml(btn.id);
                }
                var focusBg = btn.focusImage;
                if (btn.name !== 'list' && G(btn.id).getAttribute('free') == 1) {
                    focusBg = RenderParam.fileIndex + 'video_label_f.png';
                }
                G(btn.id).style.backgroundImage = 'url(' + focusBg + ')';
                G(btn.id).style.color = '#000';
            } else {       // 失去焦点
                var blurBg = btn.backgroundImage;
                if (btn.name !== 'list' && G(btn.id).getAttribute('free') == 1) {
                    blurBg = RenderParam.fileIndex + 'video_label.png';
                }
                G(btn.id).style.backgroundImage = 'url(' + blurBg + ')';
                G(btn.id).style.color = '#fff';
            }
            break;
    }
}

//Enter键入
function keyDownEnter(btn) {
    switch (btn.id) {
        case  'play-img': // 播放按钮
            var videoDataIndex = G(btn.id).getAttribute('videoDataIndex');
            try {
                var videoInfo = mockVideoIndex[videoDataIndex];
                onClickVideoItem(btn.id, videoInfo);
            } catch (e) {
                LMEPG.UI.showToast('系统报错！' + e.toString());
            }
            break;
        case  'home': // 首页
            exitApp();
            break;
        case  'main': // 主页
            jumpHomeTab('home');
            break;
        case  'back': // 返回
            onBack();
            break;
        default: // 视频播放
            var videoDataIndex = G(btn.id).getAttribute('videoDataIndex');
            try {
                var videoInfo = mockVideoIndex[videoDataIndex];
                onClickVideoItem(btn.id, videoInfo);
            } catch (e) {
                LMEPG.UI.showToast('系统报错！' + e.toString());
            }
            break;
    }
}

/**
 * 跳转函数
 */

// 得到当前页面对象
function getCurrentPage(_thisfocus) {
    var objCurrent = LMEPG.Intent.createIntent('introVideo-list');
    objCurrent.setParam('userId', RenderParam.userId);
    objCurrent.setParam('inner', RenderParam.inner);
    objCurrent.setParam('page', RenderParam.page);
    objCurrent.setParam('modeType', RenderParam.modeType);
    objCurrent.setParam('introVideo', JSON.stringify(RenderParam.mockModeInfo));
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
    objCurrent.setParam('fromId', 2);
    objCurrent.setParam('focus_index', paramJson.focusIdx);

    var objPlayer = LMEPG.Intent.createIntent('player');
    objPlayer.setParam('userId', RenderParam.userId);
    objPlayer.setParam('videoInfo', JSON.stringify(paramJson));
    objPlayer.setParam('allVideoInfo', JSON.stringify(allVideoInfo));

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
    objCurrent.setParam('fromId', 1);
    objCurrent.setParam('focus_index', focusIdx);

    var objOrderHome = LMEPG.Intent.createIntent('orderHome');
    objOrderHome.setParam('userId', RenderParam.userId);
    objOrderHome.setParam('isPlaying', '1');
    objOrderHome.setParam('returnPageName', 'introVideo-list');

    LMEPG.Intent.jump(objOrderHome, objCurrent);
}

/**
 * 跳转 - 挽留页
 */
function jumpHoldPage() {
    var objHome = getCurrentPage();

    var objHold = LMEPG.Intent.createIntent('hold');
    objHold.setParam('userId', RenderParam.userId);

    LMEPG.Intent.jump(objHold, objHome);
}

// 监听返回事件--> 返回局方的Home页面
function onBack() {
    if (RenderParam.inner == '1') {
        LMEPG.Intent.back();
    } else {
        exitApp();
    }
}

// 退出应用
function exitApp() {
    if (RenderParam.carrierId == '340092') {
        // 安徽电信EPG，要使用下面的方法来退回到EPG大厅
        Utility.setValueByName('exitIptvApp');
    } else if (RenderParam.carrierId == '520094') {
        starcorCom.exit();
    } else {
        LMEPG.Intent.back('IPTVPortal');
    }
}

// 处理点击视频列表事件
function onClickVideoItem(focusIdName, videoInfo) {
    // user_type字段:观看用户类型，0 -- 游客  1--会员  2-- vip
    var userType = videoInfo.user_type;//播放视频是否需要vip权限
    var ftp_url_json, play_id;
    if (videoInfo.ftp_url instanceof Object) {
        ftp_url_json = videoInfo.ftp_url;
    } else {
        ftp_url_json = JSON.parse(videoInfo.ftp_url);
    }

    // 视频ID
    if (RenderParam.platformType == 'hd') {
        play_id = ftp_url_json.gq_ftp_url;
    } else {
        play_id = ftp_url_json.bq_ftp_url;
    }

    var paramJson = {
        'sourceId': videoInfo.source_id,
        'videoUrl': play_id,
        'title': videoInfo.title,
        'type': '',
        'entryType': 7,
        'entryTypeName': '',
        'userType': videoInfo.user_type,
        'freeSeconds': videoInfo.free_seconds,
        'focusIdx': focusIdName
    };

    if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, paramJson)) {
        jumpVideoPlay(paramJson);
    } else {
        var info = {'modeType': RenderParam.modeType, 'introVideo': JSON.stringify(RenderParam.mockModeInfo)};
        var postData = {'videoInfo': JSON.stringify(info)};
        LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
            if (data.result == 0) {
                jumpBuyVip(paramJson.focusIdx, paramJson.title);
            } else {
                LMEPG.UI.showToast('系统报错', 3);
            }
        });
    }
}

LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_399: function () { //广西广电返回键
            LMEPG.Intent.back();
        },
        KEY_514: function () {  //广西广电退出键
            jumpHoldPage();
        }
    }
);

window.onload = function () {
    if (typeof iPanel == "object") {  //广西广电需要师父返回键、退出键有页面来控制
        iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE", 1);
        iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE", 1);
    }
    intoduceHtml();
    tabhtml();
    tabContentHtml();
    LMEPG.ButtonManager.init("play-img", buttons, "", true);
};
