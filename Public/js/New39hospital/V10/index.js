function inquiryAssistantDoctor() {
    LMEPG.Inquiry.p2p.inquiryAssistantDoctor(function (jsonFromAndroid) {
        console.log('inquiryAssistantDoctor::' + jsonFromAndroid);
    }, function () {
        LMEPG.UI.showToastV1('助理医生不在线哦！');
    });
}

var activeBtnId = 'tab-home';
var domTabBtn = G('nav').children;
var domContentBtn = G('container-right').children;
var fileIndex = g_appRootPath + '/Public/img/hd/New39hospital/V10/';
var expertPage = 0;
var guidePage = 0;
var casePage = 0;
var currentTab = 'home';                  //当前选中的导航栏（不一定当前获得焦点）
var currentVideoInde = 0;                 //当前播放视频的index
var playPosition;                         //当前播放视频的位置，从videoPosition获取
var domBodyImg = G('bodyImg');                           //有镂空的背景
var domBodyDefaultImg = G('bodyDefaultImg');                   //无镂空的背景

//焦点移动、视频播放处理
var buttons = [
    {
        id: 'tab-home',
        name: '首页',
        type: 'div',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: 'tab-experts',
        backgroundImage: fileIndex + 'home.png',
        focusImage: fileIndex + 'home_hover.png',
        selectedImage: fileIndex + 'home_active.png',
        bigImg: '',
        focusChange: onFocus,
        click: enterFocusKey,
        beforeMoveChange: onBeforeMoveChange,
        groupId: 'department',
        moveChange: ''
    }, {
        id: 'tab-experts',
        name: '顶级专家',
        type: 'div',
        nextFocusUp: 'tab-home',
        nextFocusDown: 'tab-guide',
        backgroundImage: fileIndex + 'experts.png',
        focusImage: fileIndex + 'experts_hover.png',
        selectedImage: fileIndex + 'experts_active.png',
        active: false,
        focusChange: onFocus,
        click: enterFocusKey,
        beforeMoveChange: onBeforeMoveChange,
        groupId: 'department'
    }, {
        id: 'tab-guide',
        name: '就诊指南',
        type: 'div',
        nextFocusUp: 'tab-experts',
        nextFocusDown: 'tab-case',
        backgroundImage: fileIndex + 'guide.png',
        focusImage: fileIndex + 'guide_hover.png',
        selectedImage: fileIndex + 'guide_active.png',
        active: false,
        focusChange: onFocus,
        click: enterFocusKey,
        beforeMoveChange: onBeforeMoveChange,
        groupId: 'department'
    }, {
        id: 'tab-case',
        name: '患者案例',
        type: 'div',
        nextFocusUp: 'tab-guide',
        nextFocusDown: 'tab-order',
        backgroundImage: fileIndex + 'case.png',
        focusImage: fileIndex + 'case_hover.png',
        selectedImage: fileIndex + 'case_active.png',
        active: false,
        focusChange: onFocus,
        click: enterFocusKey,
        beforeMoveChange: onBeforeMoveChange,
        groupId: 'department'
    }, {
        id: 'tab-order',
        name: '立即咨询按钮',
        type: 'div',
        nextFocusUp: 'tab-case',
        backgroundImage: fileIndex + 'order.png',
        focusImage: fileIndex + 'order_hover.png',
        selectedImage: fileIndex + 'order_active.png',
        focusChange: onFocus,
        click: inquiryAssistantDoctor,
        beforeMoveChange: onBeforeMoveChange,
        groupId: 'department'
    }, {
        id: 'container-right',
        name: '右边内容视图',
        type: 'img',
        focusChange: onFocus,
        click: rightClick,
        beforeMoveChange: onBeforeMoveChange
    }, {
        id: 'case_detail',
        name: '患者案例详情',
        type: 'img',
        focusChange: '',
        click: '',
        beforeMoveChange: onBeforeMoveChange
    }];

/**
 * 处理首页轮播
 * @type {{}}
 */
var Play = {

    // 启动小窗播放
    startPollPlay: function () {
        // var videoUrl = Play.getCurrentPollVideoUrl(); //播放地址
        playPosition = Play.getVideoPosition();     //获取视频播放位置
    },

    stopPlay: function () {
    },

    pausePlay: function () {
    },

    /**
     * 播放结束回调
     * @param param
     * @param notifyAndroidCallback
     * @constructor
     */
    onSmallPlayerCompleteCallback: function (param, notifyAndroidCallback) {
        console.log('onSmallPlayerCompleteCallback,param:' + param);
        var paramJson = JSON.parse(param);
        if (LMEPG.Func.isExist(paramJson) && !LMEPG.Func.isEmpty(paramJson.resean)) {
            var reason = paramJson.resean;
            console.log('网页接收到视频播放完成消息');
            Play.startPollPlay();
        } else {
            LMEPG.UI.showToast('resean为空');
        }
    },

    /**
     * 得到当前轮播地址
     */
    getCurrentPollVideoUrl: function () {
        var videoUrl;
        if (currentTab == 'home') {
            if (hospitalData.home.video.length > currentVideoInde + 1) {
                currentVideoInde = 0;
            }
            videoUrl = hospitalData.home.video[currentVideoInde];
        } else {
            if (hospitalData.guide[0].video.length > currentVideoInde + 1) {
                currentVideoInde = 0;
            }
            videoUrl = hospitalData.guide[0].video[currentVideoInde];
        }
        return videoUrl;
    },

    getVideoPosition: function () {
        if (currentTab == 'home') {
            return hospitalData.home.videoPosition;
        } else {
            return hospitalData.guide[0].videoPosition;
        }
    },

    /**
     * 得到当前轮播数据对象
     * @returns {*}
     */
    getCurrentPollVideoData: function () {
        return RenderParam.homePollVideoList.list[Play.currPollVideoId];
    }

};


/** 结束页面 */
window.onunload = function () {
};

/**
 * 初始化数据
 */
function initData() {
    if (LMEPG.Func.isExist(RenderParam.homeVideoInfo)) {
        var jsonHomeVideoInfo = JSON.parse(RenderParam.homeVideoInfo);
        if (!LMEPG.Func.isEmpty(jsonHomeVideoInfo.url)) {
            hospitalData.home.video.push(RenderParam.fsUrl + jsonHomeVideoInfo.url);
        } else {
            LMEPG.UI.showToast('获取首页视频获取失败！', 3);
        }
    }
    if (LMEPG.Func.isExist(RenderParam.topExpertInfo)) {
        var topExpertInfo = JSON.parse(RenderParam.topExpertInfo);
        if (topExpertInfo.result == 0) {
            if (LMEPG.Func.isExist(topExpertInfo.list) && topExpertInfo.list.length > 0) {
                hospitalData.experts = topExpertInfo.list;
                for (var i = 0; i < topExpertInfo.list.length; i++) {
                    hospitalData.guide[0].video.push(RenderParam.fsUrl + topExpertInfo.list[i].video_url);
                }
            }
        } else {
            LMEPG.UI.showToast('顶级专家信息获取失败！', 3);
        }
    }
    if (LMEPG.Func.isExist(RenderParam.caseInfo)) {
        if (RenderParam.caseInfo.result == 0) {
            hospitalData.case = RenderParam.caseInfo.list;
        } else {
            LMEPG.UI.showToast('患者案例信息获取失败！', 3);
        }
    }
    Play.startPollPlay();
}

/**
 *
 */
function rightClick() {
    if (activeBtnId === 'tab-case') {
        //点击的是患者案例
        Show('case_detail_whole');
        G('case_detail_title').innerHTML = hospitalData.case[casePage].two_level_title;
        var content = hospitalData.case[casePage].content.replace(/src="/g, 'src="' + RenderParam.fsUrl);
        G('case_detail').innerHTML = content;
        LMEPG.BM.requestFocus('case_detail');
    }
}

/**
 * 焦点移动后的操作
 */
function onBeforeMoveChange(direction, current) {
    var nextBtn = LMEPG.BM.getNearbyFocusButton(direction, current.id);
    switch (direction) {
        case 'up':
            if (current.id == 'tab-home'
                || current.id == 'tab-experts'
                || current.id == 'tab-guide'
                || current.id == 'tab-case'
                || current.id == 'tab-order') {
                enterFocusKey(nextBtn);
                return false;
            }
            if (current.id == 'container-right') {
                moveUp(current);
            }
//                if(current.id != "tab-home"){
//                    setActiveStyle();
//                }
            break;
        case 'down':
            if (current.id == 'tab-home'
                || current.id == 'tab-experts'
                || current.id == 'tab-guide'
                || current.id == 'tab-case'
                || current.id == 'tab-order') {
                enterFocusKey(nextBtn);
                return false;
            }
            if (current.id == 'container-right') {
                moveDown(current);
            }
//                if(current.id != "tab-case"){
//                    setActiveStyle();
//                }
            break;
        case 'left':
            moveLeft(current);
            break;
        case 'right':
            moveRight(current);
            break;
    }
}


//焦点左移
function moveLeft(current) {
    if (current.id === 'container-right') {
        LMEPG.ButtonManager.getButtonById(current.id).nextFocusLeft = activeBtnId;
        var _rightViewId = 'content-' + activeBtnId.slice(4);
        setStyle(G(_rightViewId), '');
    }
}

//焦点右移
function moveRight(current) {
    var activeBg = current.activeImage;
    if (current.id == activeBtnId && current.id != 'tab-home' && current.id != 'tab-order') {
        LMEPG.ButtonManager.requestFocus('container-right');
        var left_focus = 'content-' + activeBtnId.slice(4);
        var left_focus_bg = fileIndex + activeBtnId.slice(4) + '_selected.png';
        setStyle(G(left_focus), left_focus_bg);
//            setStyle(G(current.id), activeBg, "#000");
    }
    if (guidePage == 1) {
        setStyle(G('content-guide'), '');

    }
}

//焦点上移
function moveUp(current) {
    var Condition = {
        C1: activeBtnId === 'tab-guide',
        C2: expertPage >= 1,
        C3: current.id === 'container-right',
        C4: current.id !== 'container-right',
        C5: current.id !== 'tab-home',
        C6: activeBtnId === 'tab-experts',
        C7: activeBtnId === 'tab-case'
    };
    if (Condition.C4 && Condition.C5) {
//            moveFocus()
    } else if (Condition.C2 && Condition.C5 && Condition.C6) {
        expertPage -= 1;
        expertsTopView(expertPage);
        setStyle(G('experts-img'), addFsUrl(hospitalData.experts[expertPage].image_url));
        arrow();
    } else if (Condition.C1 && guidePage === 1 && Condition.C3) {
        guidePage -= 1;
        if (guidePage === 0) {
            showDefaultBg(false);
        } else {
            showDefaultBg(true);
        }
        guideSickView(guidePage);
        arrow();
        guidePage === 0 ? setStyle(G('content-guide'), fileIndex + 'guide_selected.png', '#000') : setStyle(G('content-guide'), '');
    } else if (Condition.C7 && casePage > 0 && Condition.C3) {
        casePage -= 1;
        caseSickView(casePage);
        arrow();
    }
}

//焦点下移
function moveDown(current) {

    var Condition = {
        C1: activeBtnId === 'tab-experts',
        C2: expertPage <= hospitalData.experts.length - 2,
        C3: current.id === 'container-right',
        C4: current.id !== 'container-right',
        C5: current.id !== 'tab-case',
        C6: expertPage === hospitalData.experts.length - 2,
        C7: activeBtnId === 'tab-case',
        C8: activeBtnId === 'tab-guide'
    };

    if (Condition.C4 && Condition.C5) {
        //判断在最下面，不做任何操作
//            moveFocus();
    } else if (Condition.C1 && Condition.C2 && Condition.C3) {
        expertPage += 1;
        expertsTopView(expertPage);
        arrow();
    } else if (activeBtnId === 'tab-guide' && guidePage === 0 && Condition.C3) {
        guidePage += 1;
        if (guidePage === 0) {
            showDefaultBg(false);
        } else {
            showDefaultBg(true);
            setStyle(G('content-guide'), '');
        }
        guideSickView(guidePage);
        arrow();
    } else if (activeBtnId === 'tab-case' && casePage < hospitalData.case.length - 1 && Condition.C3) {
        casePage += 1;
        caseSickView(casePage);
        arrow();
    }
}

//箭头指示
function arrow() {
    setdDisplay(G('pre-arrow'), 'block');
    setdDisplay(G('next-arrow'), 'block');
    var config = {
        A1: activeBtnId === 'tab-experts',
        A2: expertPage === 0,
        A3: expertPage === hospitalData.experts.length - 1,
        A4: activeBtnId === 'tab-guide',
        A5: guidePage === 0,
        A6: guidePage === hospitalData.guide.length - 1,
        A7: activeBtnId === 'tab-case',
        A8: casePage === 0,
        A9: casePage === hospitalData.case.length - 1
    };

    switch (true) {
        case config.A1 && config.A2:
            setdDisplay(G('pre-arrow'), 'none');
            break;
        case config.A1 && config.A3:
            setdDisplay(G('next-arrow'), 'none');
            break;
        case config.A4 && config.A5:
            setdDisplay(G('pre-arrow'), 'none');
            break;
        case config.A4 && config.A6:
            setdDisplay(G('next-arrow'), 'none');
            break;
        case config.A7 && config.A8:
            setdDisplay(G('pre-arrow'), 'none');
            break;
        case config.A7 && config.A9:
            setdDisplay(G('next-arrow'), 'none');
            break;
        default:
            setdDisplay(G('pre-arrow'), 'block');
            setdDisplay(G('next-arrow'), 'block');
            break;

    }
}

/**
 *  是否显示默认背景
 */
function showDefaultBg(isShowDefaultBg) {
    if (isShowDefaultBg) {
        domBodyImg.style.display = 'none';
        domBodyDefaultImg.style.display = 'block';
    } else {
        domBodyImg.style.display = 'block';
        domBodyDefaultImg.style.display = 'none';
    }
}

/**
 * 样式切换
 * */
function setStyle(el, bgVal, colorVal) {
    if (!LMEPG.Func.isEmpty(el)) {
        el.style.backgroundImage = 'url(' + bgVal + ')';
        el.style.color = colorVal;
    }
}


/**
 * 获取焦点后操作
 * */
function onFocus(btn, hasFocus) {

    var pdname = btn.id.slice(0, 3);
    if (hasFocus) {
        G(btn.id).style.color = '#ffffff';
    } else {
        var currentId = LMEPG.ButtonManager.getSelectedButton('department').id;
        G(currentId).style.color = '#000';
    }
}

/**
 * 键入焦点操作
 * */

function enterFocusKey(btn) {
    if (!LMEPG.Func.isExist(btn)) {
        return;
    }

    activeBtnId = btn.id; //初始化保持焦点
    var _tabBtn = domTabBtn;
    var _contentBtn = domContentBtn;
    var _activeBg = btn.activeImage;
    var _selectedExpertBg = fileIndex + 'experts_selected.png';
    var _selectedGuideBg = fileIndex + 'guide_selected.png';
    var _selectedCaseBg = fileIndex + 'case_selected.png';
    if (btn.id === 'tab-home' || btn.id === 'tab-guide') {
        showDefaultBg(false);
    } else {
        showDefaultBg(true);

    }

    //tab样式初始化
    var initContentShow = function () {
        for (var i = 0; i < _tabBtn.length; i++) {
            var siblingDom = _tabBtn[i].id.slice(4);
            var bgDefaultVal = fileIndex + siblingDom + '.png';

            setStyle(_tabBtn[i], bgDefaultVal, '#fff');

            var _thisContent = _tabBtn[i].index = i;
            //设置对应按钮的view显示
            if (_tabBtn[i].id === btn.id) {
                for (var k = 0; k < _contentBtn.length; k++) {

                    setdDisplay(_contentBtn[k], 'none');
                }
                setdDisplay(_contentBtn[_thisContent], 'block');
            }
        }
//            setStyle(G(btn.id), _activeBg, "#000");
    }();

    LMEPG.ButtonManager.setSelected(btn.id, true);
    //焦点右移到view
    switch (btn.id) {
        case 'tab-home':
            setdDisplay(G('pre-arrow'), 'none');
            setdDisplay(G('next-arrow'), 'none');
            homeView();
            currentTab = 'home';
            currentVideoInde = 0;
            Play.startPollPlay();
            LMEPG.ButtonManager.requestFocus('tab-home');
            break;
        case 'tab-experts':
            Play.pausePlay();
            expertsTopView(expertPage);
//                setStyle(G("content-experts"), _selectedExpertBg, "#000");
            arrow();
            currentTab = 'experts';
            LMEPG.ButtonManager.requestFocus('tab-experts');
            break;
        case 'tab-guide':
            guideSickView(guidePage);
            if (guidePage === 1) {
                showDefaultBg(true);
            }
            arrow();
            currentTab = 'guide';
            currentVideoInde = 0;
            LMEPG.ButtonManager.requestFocus('tab-guide');
            break;
        case 'tab-case':
            Play.pausePlay();
            caseSickView(casePage);
//                setStyle(G("content-case"), _selectedCaseBg, "#000");
            arrow();
            currentTab = 'case';
            LMEPG.ButtonManager.requestFocus('tab-case');
            break;
        case 'tab-order':
//                currentTab = "order";
            Play.pausePlay();
            setdDisplay(G('pre-arrow'), 'none');
            setdDisplay(G('next-arrow'), 'none');
//                G("container-right").innerHTML="";
            orderAskView();
            LMEPG.ButtonManager.requestFocus('tab-order');
//                showDefaultBg(false);
            break;
    }
}

function setdDisplay(el, val) {
    return el.style.display = val;
}

/* ====================视图层======================*/

/**
 * 首页视图
 * */
function homeView() {

    var homeData = hospitalData.home;
    var homeViewHtml =
        '<div id="content-home-title">' + homeData.title.firstTitle
        + '<span id="content-home-title-desc">' + homeData.title.secondTitle + '</span>' +
        '</div>' +
        '<div id="content-home-video">' +
        '   <if condition="hd">' +
        '<div id="smallvod" style="left:1px; top:1px; width:200px; height:200px; position:absolute;">' +
        '<iframe id="smallscreen" frameborder="0" scrolling="no" style="width: 500px;height: 500px"></iframe>' +
        '</div>' +
        '<else/>' +
        '</if>' +
        // '<video src="' + RenderParam.platformType + '/Application/Home/View/New39hospital/V1/movie.ogg" autoplay="autoplay" controls="controls" width="100%" height="100%">1</video>'+
        '</div>';
    G('content-home').innerHTML = homeViewHtml;

    showDefaultBg(false);
}

/**
 * 顶级专家视图
 * */
function expertsTopView(expertPage) {
    var data = hospitalData.experts;
    var content = data[expertPage].content.replace(/&quot;/g, '"');
    var jsonContent = JSON.parse(content);
    var expertsTopViewHtml =
        '<div id="experts-bg">' +
        '<div id="experts-img" style="background-image: url(' + addFsUrl(data[expertPage].image_url) + ')"></div>' +
        '</div>' +
        '<ul id="experts-introduce">' +
        '<li>' +
        '<span id="expert-name">' + data[expertPage].doctor_name + '</span>' +
        '<span id="expert-title">' + data[expertPage].class + '</span>' +
        '</li>' +
        '<li id="expert-hospital" class="expert-info">' + data[expertPage].hospital + '</li>' +
        '<li id="expert-job" class="expert-info">' + data[expertPage].doctor_job + '</li>' +
        '<li id="expert-Specialty" class="expert-info">' + data[expertPage].disease_good + '</li>' +
        '<li id="expert-detail" class="expert-info">' + jsonContent.introduce + '</li>' +
        '</ul>' +
        '<div id="expert-num">' + (expertPage + 1) + '/' + data.length + '</div>';
    G('content-experts').innerHTML = expertsTopViewHtml;
}

/**
 * 就诊指南视图
 * */
function guideSickView() {
    var dataGuide = hospitalData.guide;
    var guideText = hospitalData.guide[1].introduce;
    var guideViewHtml;
//        guidePage === 0 ? setStyle(G("content-guide"), fileIndex + "guide_selected.png", "#000") : setStyle(G("content-guide"), '');
    if (guidePage === 0) {
        guideViewHtml = '';
        Play.startPollPlay();
    } else if (guidePage === 1) {
        Play.pausePlay();
        guideViewHtml = '<div class="guide-title">' + guideText.topTitle +
            '    <span class="guide-title-right">' + guideText.introDesc + '</span></div>' +
            '    <img id="guide-img" src= "' + guideText.imgUrl + '" alt="就诊指南介绍背景"/>' +
            '    <div id="answer-guide-q">' +
            '    <p style="font-size: 18px;padding-bottom: 10px">' + guideText.text.title + '</p>';
        var afterText = [];
        for (var i = 0; i < guideText.text.content.length; i++) {
            if (i < 3) {
                guideViewHtml += '<p class="guide-desc">' + guideText.text.content[i] + '</p>';
            } else {

                afterText.push(guideText.text.content[i]);
            }

        }
        guideViewHtml += '<div class="afterThreeText">';
        for (var j = 0; j < afterText.length; j++) {
            guideViewHtml += '<p class="guide-desc">' + afterText[j] + '</p>';
        }
        guideViewHtml += '</div>' + '</div>';
        G('content-guide-video').innerHTML = guideViewHtml;
        G('answer-guide-q').style.backgroundImage = 'url("' + g_appRootPath + '/Public/img/hd/New39hospital/guide_text_bg.png")';
        return;
    }
    guideViewHtml += '</div>' + '</div>';
    G('content-guide-video').innerHTML = guideViewHtml;
}

/**
 * 患者案例视图
 * */
function caseSickView(casePage) {
    var dataCase = hospitalData.case;
    var caseViewHtml = '<p class="static-title">把健康还给你 - 身边人，身边事 <span class="static-title-child">患者案例介绍</span></p>' +
        '                   <div id="case-img" style="background-image: url(' + addFsUrl(dataCase[casePage].title_image_url) + ')">' +
        '                   <div id="case-picture-title">' + dataCase[casePage].two_level_title + '</div>    ' +
        '                   </div>' +
        '                   <div id="case-num">' + (casePage + 1) + '/' + dataCase.length + '</div>';
    G('content-case-video').innerHTML = caseViewHtml;
    G('case-picture-title').style.backgroundImage = 'url("' + g_appRootPath + '/Public/img/hd/New39hospital/word_title.png")';
}

/**
 * 立即咨询视图
 * */
function orderAskView() {
    var dataOrder = hospitalData.order.images;
//        G("container-right").innerHTML='<div id="content-order"> <div id="content-order-img"></div> </div>';
    var orderViewHtml = '<img id="order-img" src= "' + dataOrder[0] + '" alt="就诊指南介绍背景"/>';
    G('content-order').innerHTML = orderViewHtml;
}

/**
 * 添加fs地址
 * @param path
 * @returns {string}
 */
function addFsUrl(path) {
    return RenderParam.fsUrl + path;
}

//虚拟按键触发，轮询播放
LMEPG.ButtonManager.init('', buttons, '', true);


/**
 * 返回事件
 */
function onBack() {
    if (LMEPG.BM.getCurrentButton().id == 'case_detail') {
        Hide('case_detail_whole');
        LMEPG.BM.requestFocus('container-right');
    } else {
        LMEPG.Intent.back();
    }
}
