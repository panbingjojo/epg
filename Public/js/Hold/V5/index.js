var buttons = [
    {
        id: 'know',
        name: '知道了退出',
        type: 'img',
        nextFocusLeft: 'back',//jump
        nextFocusRight: 'back',
        backgroundImage: '',
        focusImage: g_appRootPath + '/Public/img/' + platformType + '/Hold/V5/short_f.png',
        click: onExit,
        focusChange: showBtn,
        beforeMoveChange: '',
        moveChange: ''
    },
    {
        id: 'back',
        name: '返回',
        type: 'img',
        nextFocusLeft: 'know',
        nextFocusRight: 'know',//jump
        backgroundImage: '',
        focusImage: g_appRootPath + '/Public/img/' + platformType + '/Hold/V5/short_f.png',
        click: jumpAppHome,
        focusChange: showBtn,
        beforeMoveChange: '',
        moveChange: ''
    },
    {
        id: 'jump',
        name: '访问电视营业厅',
        type: 'img',
        nextFocusLeft: 'back',
        nextFocusRight: 'know',
        backgroundImage: '',
        focusImage: g_appRootPath + '/Public/img/' + platformType + '/Hold/V5/long_f.png',
        click: goServerHall,
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

function goServerHall() {
    // var url = 'http://112.74.48.137:37212/stb/halls/2?carrierId=201&UserID=' + RenderParam.accountId + '&ReturnUrl=' + encodeURIComponent(RenderParam.returnEpgUrl);
    //var url = 'http://202.99.114.27:35811/epg_uc/views/login/login.html?carrierId=201&tag=event&UserID=' + RenderParam.accountId + '&ReturnUrl=' + encodeURIComponent(RenderParam.returnEpgUrl) + '&stbid=&platformFlag=hw';
    var url = 'http://10.3.9.42:16874/mall/page/popup.html?&flag=sp&UserID=' + RenderParam.accountId + '&ReturnUrl=' + encodeURIComponent(RenderParam.returnEpgUrl) + '&stbid=&platformFlag=hw&code=HP2021040816581734160';
    window.location = url;
}

function jumpAppHome() {
    var objHold = LMEPG.Intent.createIntent('hold');

    var objHome = LMEPG.Intent.createIntent('home');
    objHome.setParam('userId', RenderParam.userId);
    objHome.setParam('classifyId', '0');

    LMEPG.Intent.jump(objHome, objHold, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
};

function secondJump() {
    var objHold = LMEPG.Intent.createIntent('hold');

    var objHome = LMEPG.Intent.createIntent('healthLive');
    objHome.setParam('userId', RenderParam.userId);

    LMEPG.Intent.jump(objHome, objHold, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
};


function onExit() {
    //天津魔方取消二级挽留页
    //if (RenderParam.areaCode === '201' && RenderParam.carrierId == "10000051") {
    //    secondJump();
    //} else {
        LMEPG.Intent.back('IPTVPortal');
    //}
}

