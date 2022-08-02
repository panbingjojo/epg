var fileIndex = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/IntroVideo/';
var key = 'introTxt';
delete RenderParam.smallVideoInfo[key];
var allVideoInfo = [RenderParam.smallVideoInfo];

var buttons = [
    {
        id: 'home',
        name: '首页',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'main',
        nextFocusUp: '',
        nextFocusDown: 'focus-2',
        backgroundImage: fileIndex + 'bg_home_btn.png',
        focusImage: fileIndex + 'f_home_btn.png',
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
        nextFocusDown: 'home',
        backgroundImage: fileIndex + 'single_playbtn.png',
        focusImage: fileIndex + 'single_playbtn_f.png',
        focusChange: onFocus,
        click: keyDownEnter
    }, {
        id: 'buy-img',
        name: '购买',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusDown: 'home',
        backgroundImage: fileIndex + 'pay_btn.png',
        focusImage: fileIndex + 'pay_btn_f.png',
        focusChange: onFocus,
        click: keyDownEnter
    }];


//Enter键入
function keyDownEnter(btn) {

    var videoInfo = RenderParam.videoInfo;
    switch (btn.id) {
        case  'play-img': // 播放
            if (videoInfo.userType === '3') {
                //付费视频
                try {
                    if (RenderParam.isAllow === 0) {
                        //已支付
                        var paramJson = {
                            'sourceId': videoInfo.sourceId,
                            'videoUrl': videoInfo.videoUrl,
                            'title': videoInfo.title,
                            'type': '',
                            'entryType': 7,
                            'entryTypeName': '',
                            'userType': videoInfo.userType,
                            'freeSeconds': videoInfo.freeSeconds,
                            'focusIdx': btn.id
                        };
                        jumpVideoPlay(paramJson);
                    } else {
                        LMEPG.UI.showToast('视频未支付！');
                    }
                } catch (e) {
                    LMEPG.UI.showToast('系统报错！' + e.toString());
                }
            } else {
                try {
                    onClickVideoItem(btn.id, videoInfo);
                } catch (e) {
                    LMEPG.UI.showToast('系统报错！' + e.toString());
                }
            }
            break;
        case  'buy-img': // 购买
            // 调局方计费
            var video = {
                videoId: videoInfo.videoUrl,
                videoName: videoInfo.title,
                videoAmount: videoInfo.price,
                validDuration: videoInfo.validDuration,
                returnPageName: 'introVideo-single'
            };
            var postData = {'videoInfo': JSON.stringify(video)};
            LMEPG.ajax.postAPI('Pay/getSinglePayUrl', postData, function (data) {
                if (data.result == 0) {
                    //LMEPG.UI.showToast(data.payUrl, 3);
                    window.location.href = data.payUrl;
                } else {
                    LMEPG.UI.showToast('系统报错', 3);
                }
            });
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
function getCurrentPage(_thisfocus) {
    var objCurrent = LMEPG.Intent.createIntent('introVideo-detail');
    objCurrent.setParam('userId', RenderParam.userId);
    objCurrent.setParam('videoInfo', JSON.stringify(RenderParam.videoInfo));
    objCurrent.setParam('inner', RenderParam.inner);
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
    objOrderHome.setParam('returnPageName', 'introVideo-single');

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
    var userType = videoInfo.userType;//播放视频是否需要vip权限
    var paramJson = {
        'sourceId': videoInfo.sourceId,
        'videoUrl': videoInfo.videoUrl,
        'title': videoInfo.title,
        'type': '',
        'entryType': 7,
        'entryTypeName': '',
        'userType': videoInfo.userType,
        'freeSeconds': videoInfo.freeSeconds,
        'focusIdx': focusIdName
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

    var videoInfo = RenderParam.videoInfo;
    G("title").innerHTML = videoInfo.title;
    G("introduce").innerHTML = videoInfo.introTxt.replace("\n","<br/>");
    G("case-img").setAttribute("src", RenderParam.fsUrl + videoInfo.introImageUrl);
    var id = "";
    if(videoInfo.userType === "3" && RenderParam.isAllow !== 0){
        //付费视频未支付
        id = "buy-img";
    }else{
        Hide("how-much");
        id = "play-img";
    }
    Show(id);
    LMEPG.ButtonManager.init(id, buttons, '', true);
    LMEPG.ButtonManager.getButtonById("home").nextFocusUp = id;
    LMEPG.ButtonManager.getButtonById("main").nextFocusUp = id;
    LMEPG.ButtonManager.getButtonById("back").nextFocusUp = id;
};
