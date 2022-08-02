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
         LMEPG.UI.showWaitingDialog();
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
        var reCount = (this.page - 1) * 3;
        this.maxPage = Math.ceil(expertData.length / 3);
        this.currentData = expertData.slice(reCount, reCount + 3);
        var htm = '';

        for (var i = 0, len = this.currentData.length; i < len; i++) {
            var expert = this.currentData[i];
            if (RenderParam.channel == "4") {
                var imgPrefix = '/Public/img/hd/CommunityHospital/FifHospital/Expert/V1/' + expert.unique + '.jpg"';
            } else if (RenderParam.channel == "2") {
                var imgPrefix = '/Public/img/hd/CommunityHospital/FifHospital/Expert/V2/' + expert.unique + '.png"';
            } else {
                var imgPrefix = '/Public/img/hd/CommunityHospital/Expert/V2/' + expert.unique + '.png"';
            }
            htm += '<ul class="expert-wrapper" id="expert-' + i + '">'
                + '<li class="expert-pic">'
                + '<img src="' + imgPrefix + '"'
                + ' onerror="this.src=\'__ROOT__/Public/img/hd/CommunityHospital/Expert/V2/default.png\'" />'
                + '<li class="expert-name">' + expert.name
                + '<li class="expert-department">' + expert.department
                + '<li class="expert-position">' + expert.position
                + '<li id="marquee-title-' + i + '" class="expert-position" title="' + expert.skillful + '">'
                + LMUtils.substrByOmit(expert.skillful, 11)
                + '</ul>';
        }
        G('container').innerHTML = htm;
        G("pages").innerHTML = this.page + "/" + this.maxPage;
        this.toggleArrow();
    },
    page: LMUtils.getLocationString('page') || 1,
    maxPage: 0,
    turnList: function (key, btn) {
        var _this = CommunityHosp;
        if (key === 'left' && btn.id === 'expert-0' && _this.page !== 1) {
            _this.prevList();
            return false;
        }
        if (key === 'right' && btn.id === 'expert-2' && _this.page !== _this.maxPage) {
            _this.nextList();
            return false;
        }
    },
    prevList: function () {
        if(this.page!=1){
            this.page--;
        }
        this.render();
        LMEPG.BM.requestFocus('expert-2');
    },
    nextList: function () {
        this.page++;
        this.render();
        LMEPG.BM.requestFocus('expert-0');
    },
    toggleArrow: function () {
        H('prev-arrow');
        H('next-arrow');
        this.page != 1 && S('prev-arrow');
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
        currObj.setParam("channel", RenderParam.channel);
        var addrObj = LMEPG.Intent.createIntent('experts-details');
        addrObj.setParam('page', CommunityHosp.page);
        addrObj.setParam('idx', CommunityHosp.currentData[btn.idx].id);
        addrObj.setParam("channel", RenderParam.channel);
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
        var buttons = [];
        var len = 3; // 焦点个数
        while (len--) {
            buttons.push({
                id: 'expert-' + len,
                type: 'div',
                nextFocusLeft: 'expert-' + (len - 1),
                nextFocusRight: 'expert-' + (len + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/expert.png',
                focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/expert-f.png',
                beforeMoveChange: this.turnList,
                focusChange: this.onFocusChange,
                click: this.jumpPage,
                idx: len
            });
        }
        LMEPG.BM.init(LMUtils.getLocationString('focusId') || 'expert-0', buttons, '', true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    }
};
