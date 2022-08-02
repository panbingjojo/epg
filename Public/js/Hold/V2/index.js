var buttons = [
    {
        id: 'continue',
        name: '局方活动',
        type: 'img',
        nextFocusLeft: 'back',
        nextFocusUp: 'back',
        nextFocusDown: 'back',
        backgroundImage: '',
        focusImage: g_appRootPath + '/Public/' + platformType + '/img/Hold/V2/sure_focus.png',
        click: goEPGActivity,
        focusChange: showBtn,
        beforeMoveChange: '',
        moveChange: ''
    },
    {
        id: 'back',
        name: '返回',
        type: 'img',
        nextFocusLeft: 'continue',
        nextFocusRight: 'continue',
        nextFocusUp: 'continue',
        nextFocusDown: 'continue',
        backgroundImage: '',
        focusImage: g_appRootPath + '/Public/' + platformType + '/img/Hold/V2/back_focus.png',
        click: onBack,
        focusChange: showBtn,
        beforeMoveChange: '',
        moveChange: ''
    }
];

function showBtn(btn, hasFocus) {
    if (hasFocus) {
        G(btn.id).style.display = 'block';
    } else {
        G(btn.id).style.display = 'none';
    }
}


function goEPGActivity() {
    var info = RenderParam.epgInfo;
    var param = RenderParam.tipsData[1];
    var type = RenderParam.platformType == 'hd' ? 'HD' : 'SD';
    var goUrl = param.source_id + 'channel=' + type + '&INFO=' + info;
    window.location = goUrl;
}

function onBack() {
    LMEPG.Intent.back('IPTVPortal');
}

// 直接返回
onBack();
