// var areaName = LMEPG.Func.getLocationString('areaName') || 'midong';
var areaName = RenderParam.areaName;

var CommunityHosp = {
    marquee: marquee(),
    page: LMEPG.Func.getLocationString('page') || 1,
    maxPage: 1,
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
        EPG.ajax.post({
            url: g_appRootPath + '/Public/js/CommunityHospital/V650092/CommunityHospitalData650092',
            requestType: 'GET',
            success: function (xmlRequest, data) {
                LMEPG.UI.dismissWaitingDialog();
                console.log(data);
                _this.data = data[areaName].departments;
                _this.render();
                _this.createBtns();
                _this.maxPage = Math.ceil(_this.data.length / 9);
            },
            error: function (rsp, data) {
                LMEPG.UI.showToast('医院请求失败！', 2);
                EPG.BM.init('', [], '', true); // 保证返回
            }
        });
    },
    render: function () {
        var listData = CommunityHosp.data;
        var reCount = (this.page - 1) * 9;
        var currentData = listData.slice(reCount, reCount + 9);
        var htm = '';

        for (var i = 0, len = currentData.length; i < len; i++) {
            var item = currentData[i];
            var cls = (i + 1) % 3 === 0 ? 'last-dep' : '';
            htm += '<div id="dep-' + i + '" class="' + cls + '" title="' + item.name + '">' + LMEPG.Func.substrByOmit(item.name, 6) + '</div>';
        }

        CommunityHosp.currentData = currentData;
        G('container').innerHTML = htm;
        this.toggleArrow();

    },

    turnList: function (key, btn) {
        var _this = CommunityHosp;
        var btnEl;
        var pageLastBtn;

        if (key === 'left' && (btn.id === 'dep-0' || btn.id === 'dep-3' || btn.id === 'dep-6') && _this.page != 1) {
            _this.prevList();
            return false;
        }
        if (key === 'right' && (btn.id === 'dep-2' || btn.id === 'dep-5' || btn.id === 'dep-8') && _this.page != _this.maxPage) {
            _this.nextList();
            return false;
        }

        if (key === 'down') {
            btnEl = G(btn.nextFocusDown);
            if (!btnEl) {
                pageLastBtn = btn.id.slice(0, -1) + (_this.currentData.length - 1);
                LMEPG.BM.requestFocus(pageLastBtn);
            }
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
        obj.setParam('areaName', areaName);
        return obj;
    },
    jumpPage: function (btn) {
        var _this = CommunityHosp;
        var currObj = _this.currentPage();
        // 跳转到播放器
        var addrObj = LMEPG.Intent.createIntent('department-introduce');
        addrObj.setParam('areaName', areaName);
        addrObj.setParam('page', _this.page);
        addrObj.setParam('idx', _this.currentData[btn.idx].id);
        LMEPG.Intent.jump(addrObj, currObj);
    },
    onFocusChange: function (btn, hasFocus) {
        var marqueeEl = G(btn.id);
        if (hasFocus) {
            CommunityHosp.marquee.start({el: marqueeEl, len: 6, txt: marqueeEl.title}, true);
        } else {
            CommunityHosp.marquee.stop();
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
        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'dep-0', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    },

};

CommunityHosp.init();

function marquee() {
    var _option = {};
    return {
        start: function (obj, bol) {
            _option = obj;
            _option.bol = bol;
            // 得到焦点或失去焦点没有达到限制长度直接返回
            if (obj.txt.length < obj.len) return obj.txt;
            var htm = '<marquee ' +
                'style="float:left;width:100%;height:100%" ' +
                // 滚动速度
                'scrollamount="' + obj.vel + '" ' +
                // 滚动方式（如来回滚动、从左至右滚动）
                'behavior="' + obj.way + '" ' +
                // 滚动方向
                'direction="' + obj.dir + '">' +
                obj.txt +
                '</marquee>';
            if (bol) {
                obj.el.innerHTML = htm;
            } else {
                // 返回没有事件驱动文本滚动
                return htm;
            }
        },
        stop: function (fn) {
            if (!_option.el) return;
            _option.el.innerHTML = _option.bol ? LMEPG.Func.substrByOmit(_option.txt, _option.len) : _option.txt;
            fn && fn.apply(null, arguments);
        }
    };
}
