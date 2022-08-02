var CommunityHosp = {
    init: function () {
        this.getHospData();
    },
    goBack: function () {
        LMEPG.Intent.back();
    },
    getHospData: function () {
        var EPG = LMEPG;
        var _this = CommunityHosp;
        EPG.UI.showWaitingDialog();
        if (RenderParam.channel == "2" || RenderParam.channel == "3") {
            var ajxUrl = "/Public/js/MockData/FifHospitalData630092";
        } else {
            var ajxUrl = "/Public/js/MockData/CommunityHospitalData630092";
        }
        EPG.ajax.post({
            url: g_appRootPath + ajxUrl,
            requestType: 'GET',
            success: function (xmlRequest, data) {
                EPG.UI.dismissWaitingDialog();
                _this.data = data;
                if (RenderParam.channel == "3") {
                    _this.renderHospital();
                } else {
                    _this.render();
                }
                _this.createBtns();
            },
            error: function (rsp, data) {
                EPG.UI.showMessage('医院请求失败！', 2);
                EPG.BM.init('', [], '', true); // 保证返回
            }
        });
    },
    render: function () {
        var departmentData = CommunityHosp.data.hospital[0].departments; // 得到专家数据
        this.maxPage = departmentData.length - 1;
        this.currentData = departmentData[this.page];
        var department = this.currentData;
        var imgPrefix = g_appRootPath + '/Public/img/hd/CommunityHospital/Department/V2/';
        var defaultPng = g_appRootPath + '/Public/img/hd/CommunityHospital/Expert/default.png';
        G('container').innerHTML = ''
            + '<img class="dep-pic" src="' + imgPrefix + 'default.png"/>'
            + '<div class="intro-wrap" id="department">'
            + '<p class="dep-title">' + CommunityHosp.data.hospital[0].name + department.name + '</p>'
            + '<p class="dep-intro">'
            + '<marquee id="hos-details"  direction="up" scrollamount="3" style="width: 650px;height: 290px;position: absolute;left: 340px;top: 160px;font-size: 24px">' + department.introduce + '</marquee></p>'
            + '</div>';
        this.toggleArrow();
    },
    renderHospital: function () {
        var imgPrefix = g_appRootPath + '/Public/img/hd/CommunityHospital/Department/V2/';
        G('container').innerHTML = ''
            + '<img class="dep-pic" src="' + imgPrefix + 'fif_hospital.jpg" />'
            + '<div class="intro-wrap" id="department">'
            + '<p class="dep-title">' + CommunityHosp.data.hospital[0].name + '</p>'
            + '<p class="dep-intro">'
            + '<marquee id="hos-details"  direction="up" scrollamount="3" style="width: 650px;height: 290px;position: absolute;left: 340px;top: 150px;font-size: 24px">' + CommunityHosp.data.hospital[0].introduce + '</marquee>' +
            '</p>'
            + '</div>';
        H('prev-arrow');
        H('next-arrow');
        G("title").innerHTML = "医院简介";
    },
    page: LMUtils.getLocationString('idx') || 0,
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
        if (this.page != this.maxPage) {
            this.page++;
            this.render();
        }
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
            id: 'department',
            type: 'others',
            beforeMoveChange: this.turnList
        }];
        LMEPG.BM.init('department', buttons);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    }
};