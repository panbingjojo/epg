var CommunityHosp = {
    init: function () {
        this.getHospData();
    },
    goBack: function () {
        if (G("layer-code").style.display == "block") {
            G("layer-code").style.display = "none";
        } else {
            LMEPG.Intent.back();
        }
    },
    getHospData: function () {
        var EPG = LMEPG;
        var _this = CommunityHosp;
        EPG.UI.showWaitingDialog();
        if (RenderParam.channel == "2") {
            var ajxUrl = "/Public/js/MockData/FifHospitalData630092";
        } else if (RenderParam.channel == "4") {
            var ajxUrl = "/Public/js/MockData/AppointmentExpertData630092";
        } else {
            var ajxUrl = "/Public/js/MockData/CommunityHospitalData630092";
        }
        EPG.ajax.post({
            url: g_appRootPath + ajxUrl,
            requestType: 'GET',
            success: function (xmlRequest, data) {
                EPG.UI.dismissWaitingDialog();
                _this.data = data;
                _this.render();
                _this.createBtns();
            },
            error: function (rsp, data) {
                EPG.UI.showMessage('医院请求失败！', 2);
                EPG.BM.init('', [], '', true); // 保证返回
            }
        });
    },
    render: function () {
        var expertData = CommunityHosp.data.hospital[0].experts; // 得到专家数据
        this.maxPage = expertData.length - 1;
        this.currentData = expertData[this.page];
        var expert = this.currentData;
        if (!expert || !expert.unique) {
            return;
        } else if (RenderParam.channel == "4") {
            var imgPrefix = g_appRootPath+'/Public/img/hd/CommunityHospital/FifHospital/Expert/V1/' + expert.unique + '.jpg"';
        } else if (RenderParam.channel == "2") {
            var imgPrefix = g_appRootPath+'/Public/img/hd/CommunityHospital/FifHospital/Expert/V2/' + expert.unique + '.png"';
        } else {
            var imgPrefix =g_appRootPath+ '/Public/img/hd/CommunityHospital/Expert/V2/' + expert.unique + '.png"';
        }
        G('container').innerHTML = ''
            + '<img class="expert-pic" src="' + imgPrefix + '"'
            + ' onerror="this.src=\'__ROOT__/Public/img/hd/CommunityHospital/Expert/V2/default.png\'" />'
            + '<ul class="expert-wrapper" id="expert">'
            + '<li class="expert-name">' + expert.name
            + '<li class="dep-and-pos">'
            + '<span class="expert-department">' + expert.department + '</span>'
            + '<span class="expert-department"> | </span>'
            + '<span class="expert-position">' + expert.position + '</span>'
            + '<li class="expert-skillful"><span class="skillful">擅长：</span>' + LMUtils.substrByOmit(expert.skillful, 20)
            + '<li class="expert-intro"><span class="intro">简介：</span>'
            + '<marquee id="hos-details"  direction="up" scrollamount="3" style="width: 520px;height: 190px;position: absolute;left: 70px;top: 140px;font-size: 24px">' + expert.introduce + '</marquee>'
            + '</ul>';
        // if (RenderParam.channel == "4") {
        //     G("appoint-btn").style.display = "block";
        // }
        this.toggleArrow();
    },
    page: LMUtils.getLocationString('idx') || 1,
    maxPage: 0,
    turnList: function (key, btn) {
        var _this = CommunityHosp;
        if (key === 'left' && _this.page !== 0) {
            _this.prevList();
            return false;
        }
        if (key === 'right' && _this.page !== _this.maxPage) {
            _this.nextList();
            return false;
        }
    },
    prevList: function () {
        if (this.page != 0) {
            this.page--;
            this.render();
        }
    },
    nextList: function () {
        this.page++;
        this.render();
    },
    toggleArrow: function () {
        H('prev-arrow');
        H('next-arrow');
        this.page != 0 && S('prev-arrow');
        this.page != this.maxPage && S('next-arrow');
    },
    currentPage: function () {
        var obj = LMEPG.Intent.createIntent('experts-introduce');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        obj.setParam('page', CommunityHosp.page);
        return obj;
    },
    jumpPage: function (btn) {
        var currObj = CommunityHosp.currentPage();
        var addrObj = LMEPG.Intent.createIntent('experts-details');
        LMEPG.Intent.jump(addrObj, currObj);
    },
    onFocusChange: function (btn, hasFocus) {
        var marqueeEl = G('marquee-title-' + btn.idx);
        if (hasFocus) {
            LMUtils.marquee.start({el: marqueeEl, len: 11, txt: marqueeEl.title}, true);
        } else {
            LMUtils.marquee.stop();
        }
    },
    createBtns: function () {
        var buttons = [{
            id: 'expert',
            type: 'others',
            beforeMoveChange: this.turnList,
            // click: RenderParam.channel == "4" ? this.showCode : "",
            click: ""
        }];
        LMEPG.BM.init('expert', buttons, '', true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    },
    showCode: function () {
        G("layer-code").style.display = "block";
    }
};
