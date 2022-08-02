var DoctDetail = {
    buttons: [],
    doctorData: {},

    /**
     * 初始化页面
     */
    init: function () {
        this.renderHtml();
        this.createButtons();
        LMEPG.BM.init('scroll-bar', this.buttons, '', true);
    },

    /**
     * 根据地区ID初始化医生数据
     */
    initDoctorData: function (carrierId) {
        if (carrierId == "640092" || carrierId == "320005") {
            DoctDetail.doctorData = this.buildDoctorInfo()
        } else {
            DoctDetail.doctorData = this.readLocalInfo()
        }
    },


    /**
     * 构建医生数据
     * @returns {{}}
     */
    buildDoctorInfo: function () {
        var info = {}
        info.dataId = LMEPG.Func.getLocationString('dataId');
        info.depmart = LMEPG.Func.getLocationString('depmart');
        info.goods = LMEPG.Func.getLocationString('goods');
        info.id = LMEPG.Func.getLocationString('id');
        info.intro = LMEPG.Func.getLocationString('intro');
        info.name = LMEPG.Func.getLocationString('name');
        info.position = LMEPG.Func.getLocationString('position');
        info.title = LMEPG.Func.getLocationString('title');
        return info;
    },

    /**
     * 读取本地文件的医生信息
     * @returns {*}
     */
    readLocalInfo: function () {
        var dataId = LMEPG.Func.getLocationString('dataId');
        var doctorIndex = RenderParam.doctorIndex;
        var info;
        if (RenderParam.carrierId === '430002') {
            var data = DoctDetail.getHospDataById(dataId);
            info = data.hospDoctors[doctorIndex];
        } else {
            info = hospData[dataId].hospDoctors[doctorIndex];
        }
        info.title = hospData[dataId].title
        return info
    },

    /**
     * 根据医院的id获取医院的具体信息
     * @param hospId 医院Id
     * @returns 具体的医院信息
     */
    getHospDataById: function (hospId) {
        for (var index = 0; index < hospData.length; index++) {
            var hospInfo = hospData[index];
            if (hospInfo.id == hospId) {
                return hospInfo;
            }
        }
    },

    /**
     * 渲染页面
     */
    renderHtml: function () {
        this.renderDoctorInfo()
        this.renderContentIntro()
        //  我也不晓得这个方法为什么会被注销掉
        // this.renderDoctorPic()
    },

    /**
     * 渲染医生头像
     */
    renderDoctorPic: function () {
        G('doctor-pic').src = '/Public/img/hd/AppointmentRegister/V13/default_doctor.png'; // 医生头像
    },

    /**
     *  渲染了个啥呀，不晓得
     */
    renderContentIntro: function () {
        G('content-intro').innerHTML = '<span id="call-intro">个人简介</span><br/><br/>' + DoctDetail.doctorData.intro;
    },

    /**
     * 渲染医生信息
     */
    renderDoctorInfo: function () {
        var words2Len = RenderParam.platformType == 'sd' ? 20 : 40;
        G('doctor-info').innerHTML = (function () {
            return '<li id="doctor-name"><span>' + DoctDetail.doctorData.name + '</span> ' + DoctDetail.doctorData.position + '</li>' +
                '<li><span class="call-title">医院 : </span>' + DoctDetail.doctorData.title + '</li>' +
                '<li><span class="call-title">科室 : </span>' + DoctDetail.doctorData.depmart + '</li>' +
                '<li><span class="call-title">擅长 : </span>' + LMEPG.Func.substrByOmit(DoctDetail.doctorData.goods, words2Len) + '</li>';
        }());
    },

    /**
     * 创建按钮
     */
    createButtons: function () {
        this.buttons.push({
            id: 'scroll-bar',
            type: 'others',
            name: '滚动条',
            beforeMoveChange: this.scrollContentDistance,
            focusChange: this.onFocusChangeColor
        });
    },
    dis: 0,
    scrollContentDistance: function (key, btn) {
        var scrollBarEl = G('scroll-bar');
        var detailsEl = G('content-intro');
        var wordsCount = detailsEl.innerText.length;
        var backReturnLen = 266;
        console.log(wordsCount);
        if (/*key == 'left' || key == 'right' || */wordsCount < backReturnLen) {
            Hide('scroll-wrap');
            return;
        }
        DoctDetail.dis = parseInt(scrollBarEl.style.top) || 0;
        if (key == 'up' && DoctDetail.dis > 0) {
            DoctDetail.dis -= 1;
            uadateDis();
            return false;
        }
        if (key == 'down' && DoctDetail.dis <= 237) {
            DoctDetail.dis += 1;
            uadateDis();
            return false;
        }

        function uadateDis() {
            scrollBarEl.style.top = DoctDetail.dis + 'px';
            detailsEl.style.top = -(DoctDetail.dis * 15) + 'px';
        }
    },

    /**
     *
     * @param btn
     * @param hasFocus
     */
    onFocusChangeColor: function (btn, hasFocus) {
        if (hasFocus) {
            DoctDetail.scrollContentDistance();
            G(btn.id).className = 'focus';
        } else {
            G(btn.id).className = '';
        }
    }
};

/**
 * 页面返回
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 文档加载时
 */
window.onload = function () {
    var bgImg = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/bg.png';
    if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
        bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
    }
    document.body.style.backgroundImage = 'url(' + bgImg + ')';

    DoctDetail.initDoctorData(RenderParam.carrierId)
    DoctDetail.init();
};
