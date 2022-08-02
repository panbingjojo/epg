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
        if(RenderParam.channel=="2"){
            var ajxUrl="/Public/js/MockData/FifHospitalData630092";
        }else {
            G("title").innerHTML = "医院概况";
            var ajxUrl="/Public/js/MockData/CommunityHospitalData630092";
        }
        EPG.ajax.post({
            url: g_appRootPath + ajxUrl,
            requestType: 'GET',
            success: function (xmlRequest, data) {
                 EPG.UI.dismissWaitingDialog();
                _this.data = data.hospital[0].departments;
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
        var listData = CommunityHosp.data;
        var reCount = (this.page - 1) * 9;
        this.maxPage = Math.ceil(listData.length / 9);
        this.currentData = listData.slice(reCount, reCount + 9);
        var htm = '';
        for (var i = 0, len = this.currentData.length; i < len; i++) {
            var item = this.currentData[i];
            var cls = (i + 1) % 3 === 0 ? 'last-dep' : '';
            htm += '<div id="dep-' + i + '" class="' + cls + '" title="' + item.name + '">' + LMUtils.substrByOmit(item.name, 6) + '</div>';
        }
        G('container').innerHTML = htm;
        this.toggleArrow();
    },
    page: LMUtils.getLocationString('page') || 1,
    maxPage: 1,
    turnList: function (key, btn) {
        var _this = CommunityHosp;
        if (key === 'left' && (btn.id === 'dep-0' || btn.id === 'dep-3' || btn.id === 'dep-6') && _this.page != 1) {
            _this.prevList();
            return false;
        }
        if (key === 'right' && (btn.id === 'dep-2' || btn.id === 'dep-5' || btn.id === 'dep-8') && _this.page != _this.maxPage) {
            _this.nextList();
            return false;
        }
    },
    prevList: function () {
        this.page--;
        this.render();
        LMEPG.BM.requestFocus('dep-8');
    },
    nextList: function () {
        this.page++;
        this.render();
        LMEPG.BM.requestFocus('dep-0');
    },
    toggleArrow: function () {
        H('prev-arrow');
        H('next-arrow');
        this.page != 1 && S('prev-arrow');
        this.page != this.maxPage && S('next-arrow');
    },
    currentPage: function () {
        var obj = LMEPG.Intent.createIntent('especially-department');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        obj.setParam('page', CommunityHosp.page);
        obj.setParam("channel", RenderParam.channel);
        return obj;
    },
    jumpPage: function (btn) {
        var _this = CommunityHosp;
        var currObj = _this.currentPage();
        // 跳转到播放器
        var addrObj = LMEPG.Intent.createIntent('department-introduce');
        addrObj.setParam('page', _this.page);
        addrObj.setParam('idx', _this.currentData[btn.idx].id);
        addrObj.setParam("channel", RenderParam.channel);
        LMEPG.Intent.jump(addrObj, currObj);
    },
    onFocusChange: function (btn, hasFocus) {
        var marqueeEl = G(btn.id);
        if (hasFocus) {
            LMUtils.marquee.start({el: marqueeEl, len: 6, txt: marqueeEl.title}, true);
        } else {
            LMUtils.marquee.stop();
        }
    },
    createBtns: function () {
        var buttons = [];
        var len = 9; // 焦点个数
        while (len--) {
            buttons.push({
                id: 'dep-' + len,
                type: 'div',
                nextFocusUp: 'dep-' + (len - 3),
                nextFocusDown: 'dep-' + (len + 3),
                nextFocusLeft: 'dep-' + (len - 1),
                nextFocusRight: 'dep-' + (len + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/dep.png',
                focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/dep-f.png',
                beforeMoveChange: this.turnList,
                focusChange: this.onFocusChange,
                click: this.jumpPage,
                idx: len
            });
        }
        LMEPG.BM.init(LMUtils.getLocationString('focusId') || 'dep-0', buttons, '', true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    }
};

