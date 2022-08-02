var buttons = [];
var page = 1;
var maxPage = Math.ceil(hospitalList.length / 6);
var ftp = '/Public/img/hd/AppointmentRegister/V2/';
var mFtp = '/Public/img/hd/Menu/QHotherPages/';
var currentData = null;

/**
 * 打印医院列表
 */
function renderHospitalList() {
    var htm = '';
    buttons = [];
    var reCount = (page - 1) * 6;
    currentData = hospitalList.slice(reCount, reCount + 6);
    currentData.forEach(function (item, index) {
        htm += '<img id=focus-' + (index + 1) + ' cIdx=' + item.hosl_name + ' src =' + ftp + item.hosl_pic + '.png>';
        buttons.push({
            id: 'focus-' + (index + 1),
            name: 'focus-' + (index + 1),
            type: 'others',
            nextFocusUp: 'focus-' + (index - 2),
            nextFocusDown: 'focus-' + (index + 4),
            nextFocusLeft: 'focus-' + (index),
            nextFocusRight: 'focus-' + (index + 2),
            click: enterKey,
            focusChange: onFocusChangeBg,
            beforeMoveChange: turnPage,
            focusable: true
        });
    });
    htm += '<p id="hosp-page-index">' + page + '/' + maxPage;
    leve1Arrow(page, currentData[currentData.length - 1] == hospitalList[hospitalList.length - 1]);
    G('hospital-wrapper').innerHTML = htm;
}

/**
 * 获得、失去焦点操作
 * @param btn
 * @param Focus
 */
function onFocusChangeBg(btn, Focus) {
    var isDownFocusExist = G(btn.nextFocusDown);
    var currentDom = G(btn.id);
    if (Focus) {
        currentDom.className = 'focus';
        if (!isDownFocusExist) btn.nextFocusDown = 'focus-' + (currentData.length);
    } else {
        currentDom.className = '';
    }
}

/**
 * 翻页
 * @param key
 * @param btn
 */
function turnPage(key, btn) {
    if (key == 'left' && page != 1 && (btn.id == 'focus-1' || btn.id == 'focus-4')) {
        prevPage(btn);
        return false;
    }
    if (key == 'right' && page != maxPage && (btn.id == 'focus-3' || btn.id == 'focus-6')) {
        nextPage();
        return false;
    }
}

/**
 * 上一页
 */
function prevPage(btn) {
    page--;
    renderHospitalList();
    LMEPG.ButtonManager.requestFocus('focus-6');
}

/**
 * 下一页
 */
function nextPage() {
    page++;
    renderHospitalList();
    LMEPG.ButtonManager.requestFocus('focus-1');
}

/**
 * 图片当前个数
 * @param imgCount
 * @param lastImgIndex
 */
function leve1Arrow() {
    Show('prev-arrow');
    Show('next-arrow');

    page === 1 && Hide('prev-arrow');
    page === maxPage && Hide('next-arrow');
}

/**
 * enter键入操作
 */
var saveCurrentId;
var level2Buttons = [];

function enterKey(btn) {
    saveCurrentId = btn.id;
    var cIdx = G(btn.id).getAttribute('cIdx');
    level2Buttons = [
        {
            id: 'intro-detail',
            type: 'img',
            name: '医院详情',
            nextFocusUp: '',
            nextFocusDown: 'intro-item',
            focusImage: mFtp + 'intro_detail_f.png',
            backgroundImage: mFtp + 'intro_detail.png',
            backgroundIndex: 'intro_detail',
            click: goLevel3Page,
            beforeMoveChange: '',
            cIdx: cIdx
        },
        {
            id: 'intro-item',
            type: 'img',
            name: '推荐科室',
            nextFocusUp: 'intro-detail',
            nextFocusDown: 'intro-experts',
            backgroundIndex: 'intro_item',
            focusImage: mFtp + 'intro_item_f.png',
            backgroundImage: mFtp + 'intro_item.png',
            click: goLevel3Page,
            beforeMoveChange: '',
            cIdx: cIdx
        },
        {
            id: 'intro-experts',
            type: 'img',
            name: '推荐专家',
            nextFocusUp: 'intro-item',
            nextFocusDown: '',
            backgroundIndex: 'intro_experts',
            focusImage: mFtp + 'intro_experts_f.png',
            backgroundImage: mFtp + 'intro_experts.png',
            click: goLevel3Page,
            beforeMoveChange: '',
            cIdx: cIdx
        }];
    buttons.splice(6);
    buttons.push.apply(buttons, level2Buttons);
    renderLevel2(level2Buttons);
}

/**
 * 渲染框架集数据
 */
var cutData = null;
var keepLevel = 1;

function renderLevel2(level2Buttons) {

    var htm = '';
    var htms = '<div class="btn-wrap-intro">';
    var level2Wrapper = document.createElement('div');
    level2Wrapper.id = 'level2Wrapper';
    level2Buttons.forEach(function (item) {
        cutData = currentData.filter(function (pItem) {
            return item.cIdx == pItem.hosl_name;
        });
        if (item.cIdx !== '更多医院') {
            htms += '<img id=' + item.id + ' src=' + mFtp + item.backgroundIndex + '.png>';
        }
    });
    if (cutData[0].hosl_name === '更多医院') {
        htm += '<div id="qr-code"><img src="__ROOT__/Public/img/hd/AppointmentRegister/V2/list_hospital_code_more.png" alt=""><p>更多省内医院请扫描二维码<br>在39就医助手微信端完成预约</p></div><div id="more-39-intro">39就医助手，是由中国第一健康门户网站--39健康网精心研发的一款医疗健康应用。收录了全国22083家医院、361044位医生的详实医疗信息，重点覆盖全国99%的三甲医院，汇聚近万名专家医生优质号源。用户通过“39就医助手”预约挂号，还可享受路线导航、电话咨询、绿色通道等服务。</div>';
    } else {
        var hospNameLen = platformType == 'hd' ? 15 : 12;
        htm += '</div><img class="hos-pic"  src=' + ftp + cutData[0].detail_img + '.png>';
        htm += '<div id="detail-wrapper">';
        htm += '<img class="code"  src=' + ftp + cutData[0].code + '.png>';
        htm += '<img class="code-text"  src="__ROOT__/Public/img/'+platformType+'/Menu/QHotherPages/code_text.png">';
        htm += '<img src="__ROOT__/Public/img/'+platformType+'/Menu/QHotherPages/addr.png" class="icon-address">';
        htm += '<img src="__ROOT__/Public/img/'+platformType+'/Menu/QHotherPages/tel.png" class="icon-tel">';
        htm += '<p class="iframe-title">' + LMEPG.Func.marquee('', cutData[0].hosl_name, hospNameLen);
        htm += '<p class="iframe-address">' + cutData[0].address;
        htm += '<p class="iframe-tel">' + cutData[0].telepone;
    }
    htm += htms;
    level2Wrapper.innerHTML = htm;
    document.body.appendChild(level2Wrapper);
    LMEPG.ButtonManager.init('intro-detail', buttons, '', true);
    keepLevel = 2;
}

/**
 * 跳转转三级页面
 */
var currentBtn;

function goLevel3Page(btn) {
    keepLevel = 3;
    currentBtn = btn.id;
    var turnPageIndex = btn.id == 'intro-detail' ? turnPageHospitalDetail : btn.id == 'intro-experts' && turnHospitalDoctorsPage;
    var hasPlaceholder = buttons.filter(function (item, index) {
        return item.id == 'detail-wrapper';
    });
    !!hasPlaceholder && buttons.push({
        id: 'detail-wrapper',
        name: '翻页',
        type: 'div',
        beforeMoveChange: turnPageIndex,
        focusable: true
    });
    switch (btn.id) {
        case 'intro-detail':
            hospitalDetailPage = 0;
            goIntroDetail(btn, 0);
            break;
        case 'intro-item':
            goIntroItem(btn, 0);
            break;
        case 'intro-experts':
            hospitalDoctorsPage = 0;
            goIntroExperts(btn, 0);
            break;
    }
}

/**
 * 跳转医院详情
 */
function goIntroDetail(btn, index) {

    var htm = '<img id="hos-details" src=' + ftp + cutData[0].introduce_img[index] + '.png>';
    htm += '<img id="hos-details-prevPage" src="__ROOT__/Public/img/hd/Menu/QHotherPages/up.png">';
    htm += '<img id="hos-details-nextPage" src="__ROOT__/Public/img/hd/Menu/QHotherPages/down.png">';
    G('detail-wrapper').innerHTML = htm;
    LMEPG.ButtonManager.init('detail-wrapper', buttons, '', true);
    level3Arrow(index, ['hos-details-prevPage', 'hos-details-nextPage'], 'details');
}

/**
 * 医院详情翻页
 */
var hospitalDetailPage = 0;

function turnPageHospitalDetail(key, btn) {

    key == 'up' && (hospitalDetailPage = Math.max(0, hospitalDetailPage -= 1));
    key == 'down' && (hospitalDetailPage = Math.min(cutData[0].introduce_img.length - 1, hospitalDetailPage += 1));
    goIntroDetail(btn, hospitalDetailPage);
}

/**
 * 跳转推荐科室
 */
function goIntroItem(btn, index) {
    var htm = '<p class="departments-hospital-title">' + cutData[0].hosl_name;
    var departments = cutData[0].subject;
    departments.forEach(function (item) {
        htm += '<p class="departments">' + item.subject_name;
    });
    G('detail-wrapper').innerHTML = htm;
    LMEPG.ButtonManager.init('detail-wrapper', buttons, '', true);
}

/*
 * 跳转推荐专家
 */
function goIntroExperts(btn, index) {

    var departments = cutData[0].doctor.slice(index * 3, index * 3 + 3);
    var htm = '<p class="departments-hospital-title">' + cutData[0].hosl_name;
    htm += '<p id="doc-page-index">' + '0/0';

    departments.forEach(function (item, index) {
        var classNmae = 'doctors doctor-' + index + ' doctor-' + item.sex;
        htm += '<div  class="' + classNmae + '">';
        htm += '<p class="doctor-name">' + item.doctor_name;
        htm += '<span class="doctor-position">' + item.position;
        htm += '<p class="doctor-subject-name">' + item.subject_name;
        htm += '<span class="doctor-good-at">擅长：' + item.good_at;
        htm += '</div>';
    });
    htm += '<img id="doctor-page-up" src="__ROOT__/Public/img/hd/Menu/QHotherPages/up.png">';
    htm += '<img id="doctor-page-down" src="__ROOT__/Public/img/hd/Menu/QHotherPages/down.png">';
    G('detail-wrapper').innerHTML = LMEPG.Func.isEmpty(departments) ? '<b>暂无数据！</b>' : htm;
    G('doc-page-index').innerHTML = (hospitalDoctorsPage + 1) + '/' + cutData[0].doctor.length / 3;
    LMEPG.ButtonManager.init('detail-wrapper', buttons, '', true);
    level3Arrow(index, ['doctor-page-up', 'doctor-page-down'], 'experts');
}

/**
 * 医院详情翻页
 */
var hospitalDoctorsPage = 0;

function turnHospitalDoctorsPage(key, btn) {

    key == 'up' && (hospitalDoctorsPage = Math.max(0, hospitalDoctorsPage -= 1));
    key == 'down' && (hospitalDoctorsPage = Math.min(Math.ceil(cutData[0].doctor.length / 3) - 1, hospitalDoctorsPage += 1));
    goIntroExperts(btn, hospitalDoctorsPage);
}

function level3Arrow(page, arrowObj, isWho) {
    Show(arrowObj[0]);
    Show(arrowObj[1]);
    page == 0 && Hide(arrowObj[0]);
    if (isWho == 'details') {
        page == Math.ceil(cutData[0].introduce_img.length - 1) && Hide(arrowObj[1]);
    } else {
        page == Math.ceil(cutData[0].doctor.length / 3) - 1 && Hide(arrowObj[1]);
    }
}

/**
 * 返回确认
 */
function onBack() {
    var level2Obj = G('level2Wrapper');
    switch (keepLevel) {
        case 1:
            LMEPG.Intent.back();
            break;
        case 2:
            keepLevel = 1;
            document.body.removeChild(level2Obj);
            LMEPG.ButtonManager.requestFocus(saveCurrentId);
            break;
        case 3:
            keepLevel = 2;
            document.body.removeChild(level2Obj);
            renderLevel2(level2Buttons);
            LMEPG.ButtonManager.requestFocus(currentBtn);
            break;
    }
}