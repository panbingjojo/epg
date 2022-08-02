/**
 * 翻页功能
 * @param pageSize
 * @param prevId
 * @param nextId
 * @param data
 * @constructor
 */
function TurnPage(pageSize, prevId, nextId, data) {
    this.page = 1;
    this.pageSize = pageSize || 1;
    this.maxPage = data && Math.ceil(data.length / pageSize);
    this.prevId = prevId;
    this.nextId = nextId;
    this.data = data;
    this.beClickId = '';
    if (!(this instanceof TurnPage)) {
        return new TurnPage();
    }
}

TurnPage.prototype = {
    buttons: [],
    uniqueId: [],// 共享Id
    eventClick: function (btn) {
        var _this = btn.self;
        _this.beClickId = btn.id;

        _this.click && _this.click(btn);
    },
    eventOnFocus: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            LMEPG.CssManager.addClass(btnElement, 'active');
            LMEPG.call(btn.onFocusOtherCallBack, [btn, true]);
        } else {
            LMEPG.CssManager.removeClass(btnElement, 'active');
            LMEPG.call(btn.onFocusOtherCallBack, [btn, false]);
        }
    },
    eventBeforeMove: function (key, btn) {
        var btnId = btn.id;
        var _this = btn.self;
        if (key == btn.turnPrevKey && _this.prevId.indexOf(btnId) != -1 && _this.page != 1) {
            _this.prevPage();
            return false;
        }
        if (key == btn.turnNextKey && _this.nextId.indexOf(btnId) != -1 && _this.page != _this.maxPage) {
            _this.nextPage();
            return false;
        }
        // 如果移动方向没有焦点，执行该回调
        LMEPG.call(btn.afterMoveNotFocus, [key, btn]);
    },
    prevPage: function () {
        this.page--;
        this.renderPage();
        var nextId = this.nextId;
        var Id = typeof nextId == 'string' ? nextId : nextId[0];
        LMEPG.BM.requestFocus(Id);
    },
    nextPage: function () {
        this.page++;
        this.renderPage();
        var prevId = this.prevId;
        var Id = typeof prevId == 'string' ? prevId : prevId[0];
        LMEPG.BM.requestFocus(Id);
    },
    /**
     * 初始化执行方案
     * @param btnId：页面当前获得焦点ID
     * @param level：多实例唯一共享标识
     */
    initProcess: function (btnId, level) {
        // 初始化页数
        this.page = 1;
        // 标记当前实例层级
        this.uniqueId[0] = level;
        // 重置寄生翻页按钮执行对象
        LMEPG.BM.requestFocus(btnId);
        var btnObj = LMEPG.BM.getButtonById(btnId);
        btnObj.beforeMoveChange = this.eventBeforeMove;
        btnObj.focusChange = this.eventOnFocus;
        btnObj.click = this.eventClick;
        btnObj.self = this;
    },
    toggleArrow: function (prev, next) {
        var prevEl = G(prev);
        var nextEl = G(next);
        LMEPG.CssManager.addClass(prevEl, 'hide');
        LMEPG.CssManager.addClass(nextEl, 'hide');
        this.page != 1 && LMEPG.CssManager.removeClass(prevEl, 'hide');
        this.page != this.maxPage && this.maxPage != 0 && LMEPG.CssManager.removeClass(nextEl, 'hide');
    }
};

var level_0 = new TurnPage(6, ['focus-0', 'focus-3'], ['focus-5', 'focus-2'], RenderParam.hospData.list);
level_0.init = function () {
    this.renderPage();
    this.addButtons();
    this.uniqueId[0] = 'level_0';
};

level_0.click = function (btn) {
    level_1.init(btn.idx);
};

level_0.renderPage = function () {
    var reCount = (this.page - 1) * this.pageSize;
    this.currentData = this.data.slice(reCount, reCount + this.pageSize);
    var htm = '';
    for (var i = 0; i < this.currentData.length; i++) {
        var hosp = this.currentData[i];
        var cls = (i + 1) % 3 === 0 ? 'last-item' : '';
        htm += '<div id="focus-' + i + '" class="hosp-wrapper ' + cls + '">'
            + '<img class="img-item" src="' + RenderParam.fsUrl + hosp.img_url + '"' // todo test
            + ' onerror="this.src=\'__ROOT__/Public/img/Common/default.png\'" />'
            + '<p id="title-' + i + '" class="title-item" title="'
            // + hosp.hospital_name + '">' + LMEPG.Func.substrByOmit(hosp.hospital_name, 11)
            + hosp.hospital_name + '">' + hosp.hospital_name
            + '</p>'
            + '</div>';
    }
    htm += '<p class="hosp-page-index">' + this.page + '/' + this.maxPage + '</p>';
    G('container').innerHTML = htm;
    this.toggleArrow('prev-arrow', 'next-arrow');
};

level_0.onFocusOtherCallBack = function (btn, hasFocus) {
    if (hasFocus) {
        LMEPG.UI.Marquee.start('title-' + btn.idx, 11);
    } else {
        LMEPG.UI.Marquee.stop();
    }
};

level_0.addButtons = function () {
    var len = 6; // 焦点个数
    while (len--) {
        this.buttons.push({
            id: 'focus-' + len,
            type: 'div',
            nextFocusUp: 'focus-' + (len - 3),
            nextFocusDown: 'focus-' + (len + 3),
            nextFocusLeft: 'focus-' + (len - 1),
            nextFocusRight: 'focus-' + (len + 1),
            beforeMoveChange: this.eventBeforeMove,
            focusChange: this.eventOnFocus,
            turnPrevKey: 'left',
            turnNextKey: 'right',
            self: this,
            click: this.eventClick,
            onFocusOtherCallBack: this.onFocusOtherCallBack,
            afterMoveNotFocus: this.afterMoveNotFocus,
            idx: len
        });
    }
    LMEPG.BM.init('focus-0', this.buttons, '', true);
};

level_0.afterMoveNotFocus = function (key, btn) {
    if (key === 'down') {
        var el = G(btn.nextFocusDown);
        var len = btn.self.currentData.length - 1;
        var lastFocusId = 'focus-' + len;
        if (!el) {
            // 向下移动没有焦点对象则移动到最后那个焦点对象上
            LMEPG.BM.requestFocus(lastFocusId);
        }
    }
};

/**
 * 单页框架集
 * @type {TurnPage}
 */
var level_1 = new TurnPage();
level_1.init = function (idx) {
    Show('iframe');
    this.data = level_0.currentData[idx];
    this.renderPage();
    this.initProcess('intro-detail', 'level_1');
};

level_1.renderPage = function () {
    var data = this.data;
    G('iframe').innerHTML = ''
        + '<div id="iframe-inner">'
        + '<p class="hosp-title">' + data.hospital_name + '</p>'
        + '<img class="hosp-pic" src="' + RenderParam.fsUrl + data.detail_img_url + '">'
        + '<div id="inner-content">'
        + '<p class="hosp-info hosp-addr">' + (is_empty(data.location) ? '无' : LMUtils.marquee.start({
            txt: data.location,
            len: 20
        })) + '</p>'
        + '<p class="hosp-info hosp-tel">' + (is_empty(data.tel) ? '无' : LMUtils.marquee.start({
            txt: data.tel,
            len: 30
        })) + '</p>'
        + '<img class="hosp-code" src="' + RenderParam.fsUrl + data.qrcode_img_url + '">'
        + '<div class="content-btn">'
        + '<img id="intro-detail" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V220094/intro-detail.png">'
        + '<img id="intro-department" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V220094/intro-department.png">'
        // 吉林那边局方担心医生会有版权问题，要隐藏推荐医生这块
        // + '<img id="intro-expert" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V220094/intro-expert.png">'
        + '</div>'
        + '</div>';
};

level_1.click = function (btn) {
    switch (btn.id) {
        case 'intro-detail':
            level_1_detail.init();
            break;
        case 'intro-department':
            level_1_department.init();
            break;
        case 'intro-expert':
            level_1_expert.getExpertData();
            break;
    }
};

/**
 * 医院详情
 * @type {TurnPage}
 */
var level_1_detail = new TurnPage(250, 'inner-content', 'inner-content');
level_1_detail.init = function () {
    this.data = level_1.data.brief_intro;
    this.maxPage = Math.ceil(this.data.length / this.pageSize);
    this.initProcess('inner-content', 'level_1_detail');
    this.renderPage();
};

level_1_detail.renderPage = function () {
    // var reCount = (this.page - 1) * this.pageSize;
    // var currentData = this.data.slice(reCount, reCount + this.pageSize);
    var htm = '<div class="hosp-detail">' + LMUtils.marquee.start({
        txt: this.data,
        len: 250,
        dir: 'up',
        vel: 3
    }) + '</div>';
    // + '<img id="detail-prev-arrow" class="detail-arrow" src="' + g_appRootPath + '/Public/img/hd/Common/arrow_up.png">'
    // + '<img id="detail-next-arrow" class="detail-arrow" src="' + g_appRootPath + '/Public/img/hd/Common/arrow_down.png">';
    var isNull = nullDta(this.data);
    /*  if (!isNull) {
          htm += '<p class="iframe-page-index">' + this.page + '/' + this.maxPage + '</p>';
      } else {
          htm += isNull;
      }*/
    G('inner-content').innerHTML = htm + isNull;
    // this.toggleArrow('detail-prev-arrow', 'detail-next-arrow');
};

/**
 * 推荐科室
 * @type {TurnPage}
 */
var level_1_department = new TurnPage(8, 'inner-content', 'inner-content');
level_1_department.init = function () {
    this.data = level_1.data.recommend_dept.split(',');
    this.maxPage = Math.ceil(this.data.length / this.pageSize);
    this.initProcess('inner-content', 'level_1_department');
    this.renderPage();
};

level_1_department.renderPage = function () {
    var htm = '';
    var data = this.data;
    var reCount = (this.page - 1) * this.pageSize;
    var currentData = data.slice(reCount, reCount + this.pageSize);
    for (var i = 0; i < currentData.length; i++) {
        var cls = (i + 1) % 2 === 0 ? 'last-item' : '';
        htm += '<p class="department ' + cls + '">' + LMUtils.marquee.start({txt: currentData[i], len: 6});
    }
    var isNull = nullDta(this.data);
    if (!isNull) {
        htm += '<p class="iframe-page-index">' + this.page + '/' + this.maxPage + '</p>';
    } else {
        htm += isNull;
    }
    htm += '<img id="department-prev-arrow" class="department-arrow" src="' + g_appRootPath + '/Public/img/hd/Common/arrow_up.png">';
    htm += '<img id="department-next-arrow" class="department-arrow" src="' + g_appRootPath + '/Public/img/hd/Common/arrow_down.png">';
    G('inner-content').innerHTML = htm;
    this.toggleArrow('department-prev-arrow', 'department-next-arrow');
};

/**
 * 推荐专家
 * @type {TurnPage}
 */
var level_1_expert = new TurnPage(3, 'inner-content', 'inner-content');
level_1_expert.init = function (data) {
    var _this = level_1_expert;
    LMEPG.UI.dismissWaitingDialog();
    _this.data = data.list;
    _this.maxPage = Math.ceil(_this.data.length / _this.pageSize);
    _this.initProcess('inner-content', 'level_1_department');
    _this.renderPage();
};

level_1_expert.renderPage = function () {
    var htm = '';
    var reCount = (this.page - 1) * this.pageSize;
    var currentData = this.data.slice(reCount, reCount + this.pageSize);
    for (var i = 0; i < currentData.length; i++) {
        var expert = currentData[i];
        // var classNmae = 'doctors doctor-' + index + ' doctor-' + item.sex;
        htm += '<div  class="item-doctor">'
            + '<div class="doctor-name">'
            + '<span>' + expert.doctor_name + '</span>'
            + '<span class="doctor-position">' + expert.doctor_level + '</span>'
            + '</div>'
            + '<div class="inline-inner">'
            + '<p class="doctor-department">' + LMUtils.marquee.start({txt: expert.dept_name, len: 5}) + '</p>'
            + '<p class="doctor-skillful">擅长：' + LMUtils.marquee.start({txt: expert.doctor_intro, len: 15}) + '</p>'
            + '</div>'
            + '</div>';
    }
    var isNull = nullDta(this.data);
    if (!isNull) {
        htm += '<p class="iframe-page-index">' + this.page + '/' + this.maxPage + '</p>';
    } else {
        htm += isNull;
    }
    htm += '<img id="expert-prev-arrow" class="expert-arrow" src="' + g_appRootPath + '/Public/img/hd/Common/arrow_up.png">';
    htm += '<img id="expert-next-arrow" class="expert-arrow" src="' + g_appRootPath + '/Public/img/hd/Common/arrow_down.png">';
    G('inner-content').innerHTML = htm;
    this.toggleArrow('expert-prev-arrow', 'expert-next-arrow');
};
level_1_expert.getExpertData = function () {
    LMEPG.UI.dismissWaitingDialog();
    LMEPG.ajax.postAPI(
        'AppointmentRegister/getHospitalExpertInfo',
        {'hospital_id': level_1.data.hospital_id},
        level_1_expert.init,
        function () {
            LMEPG.UI.showToast('拉取医生列表失败', 2);
        }
    );
};

LMEPG.BM.addButtons([{
    id: 'intro-detail',
    type: 'img',
    name: '医院详情',
    nextFocusUp: '',
    nextFocusDown: 'intro-department',
    backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V220094/intro-detail.png',
    focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V220094/intro-detail-f.png',
    backgroundIndex: 'intro_detail',
    click: level_1.eventClick,
    self: level_1
}, {
    id: 'intro-department',
    type: 'img',
    name: '推荐科室',
    nextFocusUp: 'intro-detail',
    nextFocusDown: 'intro-expert',
    backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V220094/intro-department.png',
    focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V220094/intro-department-f.png',
    click: level_1.eventClick,
    self: level_1
}, {
    id: 'intro-expert',
    type: 'img',
    name: '推荐专家',
    nextFocusUp: 'intro-department',
    backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V220094/intro-expert.png',
    focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V220094/intro-expert-f.png',
    click: level_1.eventClick,
    self: level_1
}, {
    id: 'inner-content',
    type: 'others',
    name: '医院详情&推荐科室&推荐专家',
    beforeMoveChange: '',
    turnPrevKey: 'up',
    turnNextKey: 'down',
    click: null,
    self: ''
}]);

function nullDta(data) {
    if (is_empty(data.length)) {
        return '<div id="null-data">没有内容！</div>';
    }
    return '';
}

function onBack() {
    var _this = LMEPG.BM.getCurrentButton().self;
    switch (_this.uniqueId[0]) {
        case 'level_0':
            LMEPG.Intent.back();
            break;
        case 'level_1':
            Hide('iframe');
            LMEPG.BM.requestFocus(level_0.beClickId);
            _this.uniqueId[0] = 'level_0';
            break;
        case 'level_1_detail':
        case 'level_1_expert':
        case 'level_1_department':
            level_1.renderPage();
            LMEPG.BM.requestFocus(level_1.beClickId);
            _this.uniqueId[0] = 'level_1';
            break;
    }
}
