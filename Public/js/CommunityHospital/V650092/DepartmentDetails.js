var areaName = LMEPG.Func.getLocationString('areaName') || 'midong';
var departmentIndex = parseInt(LMEPG.Func.getLocationString('idx'));
var maxPage1 = 0;

var CommunityHosp = {
    marquee: marquee(),
    page: LMEPG.Func.getLocationString('idx') || 0,
    maxPage: 0,
    init: function () {
        this.getHospData();
        this.page = departmentIndex;
    },
    goBack: function () {
        LMEPG.Intent.back();
    },
    getHospData: function () {
        var EPG = LMEPG;
        var _this = CommunityHosp;
        LMEPG.UI.showWaitingDialog();
        EPG.ajax.post({
            url: LMEPG.App.getAppRootPath() + '/Public/js/CommunityHospital/V650092/CommunityHospitalData650092',
            requestType: 'GET',
            success: function (xmlRequest, data) {
                LMEPG.UI.dismissWaitingDialog();
                _this.data = data;
                maxPage1 = _this.data[areaName].departments.length - 1;
                _this.render(data);
                _this.createBtns();
            },
            error: function (rsp, data) {
                 LMEPG.UI.showToast('医院请求失败！', 2);
                LMUtils.forceEventBack(); // 保证（若支持）可以返回
            }
        });
    },
    render: function (data) {
        var departmentData = data[areaName].departments; // 得到专家数据
        this.currentData = departmentData[this.page];
        var department = this.currentData;
        if(areaName=="kaziwang" || areaName=="midongr" || areaName=="midongz"){
            var imgPrefix = '/Public/img/hd/CommunityHospital/Department/' + areaName + '/';
        }else {
            var imgPrefix = '/Public/img/hd/CommunityHospital/Department/';
        }
        G('container').innerHTML = ''
            + '<img class="dep-pic" src="' + imgPrefix + department.unique + '.jpg"'
            + '  onerror="this.src=' + g_appRootPath +'\'/Public/img/hd/CommunityHospital/Expert/default.png\'" />'
            + '<div class="intro-wrap" id="department">'
            + '<p class="dep-title">' + data[areaName].name + department.name + '</p>'
            + '<p class="dep-intro">' + CommunityHosp.marquee.start({
                txt: department.introduce,
                len: 100,
                dir: 'up',
                vel: 2
            }) + '</p>'
            + '</div>';
        this.toggleArrow();
    },
    turnList: function (key, btn) {
        var _this = CommunityHosp;
        if (key === 'left' && _this.page !== 0) {
            _this.prevList();
            return false;
        }
        if (key === 'right' && _this.page !== maxPage1) {
            _this.nextList();
            return false;
        }
    },
    prevList: function () {
        this.page--;
        this.render(this.data);
    },
    nextList: function () {
        this.page++;
        this.render(this.data);
    },
    toggleArrow: function () {
        if(this.page <= 0){
            H('prev-arrow');
            this.page = 0;
            if(maxPage1 > 0){
                S('next-arrow');
            }
        }else if((this.page > 0) && (this.page < maxPage1)){
            S('prev-arrow');
            S('next-arrow');
        }else if(this.page >= maxPage1){
            S('prev-arrow');
            H('next-arrow');
            this.page = maxPage1;
        }
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
            CommunityHosp.marquee.start({el: marqueeEl, len: 11, txt: marqueeEl.title}, true);
        } else {
            CommunityHosp.marquee.stop();
        }
    },
    createBtns: function () {
        var buttons = [{
            id: 'department',
            type: 'others',
            beforeMoveChange: this.turnList
        }];
        LMEPG.BM.init('department', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    }
};
//CommunityHosp.init();

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
            _option.el.innerHTML = _option.bol ?  LMEPG.Func.substrByOmit(_option.txt, _option.len) : _option.txt;
            fn && fn.apply(null, arguments);
        }
    };
}