var areaName = RenderParam.areaName;
var hospitalId = RenderParam.hospitalId;
var doctors;
var doctorCount = 0;
var CommunityHosp = {
    marquee: marquee(),
    page: LMEPG.Func.getLocationString('page') || 1,
    maxPage: 0,
    init: function () {
        this.getHospData();
    },
    goBack: function () {
        LMEPG.Intent.back();
    },
    getDoctorListByHospitalId: function (hospitalId, deptId, page, pageSize, callback) {
        var postData = {};
        postData.deptId = ((deptId === '全部科室') ? '' : deptId);
        postData.page = page;
        postData.pageSize = pageSize;
        postData.hospId = hospitalId;
        LMEPG.ajax.postAPI('Doctor/getDoctorListByHospId', postData, function (data) {
            LMEPG.call(callback, [deptId, page, pageSize, data]);
        }, function () {
            LMEPG.UI.showToast('获取医生列表失败！');
        });
    },
    buildDoctorAvatarUrl: function (urlPrefix, doctorId, avatarUrl, carrierID) {
        var head = {
            func: 'getDoctorHeadImage',
            carrierId: carrierID,
            areaCode: RenderParam.areaCode
        };
        var json = {
            doctorId: doctorId,
            avatarUrl: avatarUrl
        };
        return urlPrefix + '?head=' + JSON.stringify(head) + '&json=' + JSON.stringify(json);
    },
    getHospData: function () {
        var _this = CommunityHosp;
        LMEPG.UI.showWaitingDialog();
        //社区医院新模板，专家介绍从服务器拉取
        if (areaName == "kaziwang" || areaName == "midongr" || areaName == "midongz" || areaName == "wanaxiangfuwuzhan") {
            this.getDoctorListByHospitalId(hospitalId, '', 1, 100, function (deptId, page, pageSize, data) {
                LMEPG.UI.dismissWaitingDialog();
                if (data.result.code == 0) {
                    doctorCount = data.result.total;
                    doctors = data.result.list;
                    _this.renderNewModel(doctors, doctorCount);
                    _this.createBtns();
                } else {
                    LMEPG.UI.showMessage('医院请求失败！', 2);
                    LMEPG.BM.init('', [], '', true); // 保证返回
                }
            });
        } else { //社区医院旧模板，专家介绍从配置文件读取
            LMEPG.ajax.post({
                url: g_appRootPath + '/Public/js/CommunityHospital/V650092/CommunityHospitalData650092',
                requestType: 'GET',
                success: function (xmlRequest, data) {
                    LMEPG.UI.dismissWaitingDialog();
                    _this.data = data[areaName];
                    _this.render(data);
                    _this.createBtns();
                },
                error: function (rsp, data) {
                    LMEPG.UI.showMessage('医院请求失败！', 2);
                    LMEPG.BM.init('', [], '', true); // 保证返回
                }
            });
        }
    },
    render: function () {
        var expertData = CommunityHosp.data.experts; // 得到专家数据
        var reCount = (this.page - 1) * 3;
        var htm = '';
        var imgPrefix = g_appRootPath + '/Public/img/hd/CommunityHospital/Expert/' + areaName + '/';
        var expert;

        this.maxPage = Math.ceil(expertData.length / 3);
        this.currentData = expertData.slice(reCount, reCount + 3);
        for (var i = 0, len = this.currentData.length; i < len; i++) {
            expert = this.currentData[i];
            htm += '<ul class="expert-wrapper" id="expert-' + i + '">'
                + '<li class="expert-pic">'
                + '<img src="' + imgPrefix + expert.unique + '.png"'
                + ' onerror="this.src=' + g_appRootPath + ' \'/Public/img/hd/CommunityHospital/Expert/default.png\'" />'
                // + '<li class="expert-name">' + LMEPG.Func.substrByOmit(expert.name, 11)
                + '<li id="marquee-name-' + i + '" class="expert-name" title="' + expert.name + '">' + LMEPG.Func.substrByOmit(expert.name, 8)
                + '<li class="expert-department">' + expert.department
                + '<li id="marquee-position-' + i + '" class="expert-position" title="' + expert.department + '">'
                + LMEPG.Func.substrByOmit(expert.position, 11)
                + '<li id="marquee-title-' + i + '" class="expert-position" title="' + expert.skillful + '">'
                + LMEPG.Func.substrByOmit(expert.skillful, 11)
                + '</ul>';
        }
        G('container').innerHTML = htm;
        this.toggleArrow();
    },
    //社区医院新模板，专家介绍渲染
    renderNewModel: function (doctors, doctorCount) {
        var expertData = doctors;
        var reCount = (this.page - 1) * 3;
        var htm = '';
        var imgPrefix = g_appRootPath + '/Public/img/hd/CommunityHospital/Expert/' + areaName + '/';
        var expert;

        this.maxPage = Math.ceil(doctorCount / 3);
        this.currentData = expertData.slice(reCount, reCount + 3);
        for (var i = 0, len = this.currentData.length; i < len; i++) {
            expert = this.currentData[i];
            //获取医生头像
            var DoctorAvatarUrl = this.buildDoctorAvatarUrl(RenderParam.CWS_HLWYY_URL, expert.doc_id, expert.avatar_url, RenderParam.carrierId);
            htm += '<ul class="expert-wrapper" id="expert-' + i + '">'
                + '<li class="expert-pic">'
                + '<img src=' + DoctorAvatarUrl
                + ' onerror="this.src=' + g_appRootPath + ' \'_/Public/img/hd/CommunityHospital/Expert/default.png\'" />'
                + '<li class="expert-name">' + LMEPG.Func.substrByOmit(expert.doc_name, 11)
                + '<li class="expert-department">' + expert.department
                + '<li id="marquee-position-' + i + '" class="expert-position">' + expert.job_title
                + '<li id="marquee-title-' + i + '" class="expert-position">' + LMEPG.Func.substrByOmit(expert.good_disease, 11)
                + '</ul>';
        }
        G('container').innerHTML = htm;
        this.toggleArrow();
    },

    turnList: function (key, btn) {
        var _this = CommunityHosp;
        if (key === 'left' && btn.id === 'expert-0' && _this.page != 1) {
            _this.prevList();
            return false;
        }
        if (key === 'right' && btn.id === 'expert-2' && _this.page != _this.maxPage) {
            _this.nextList();
            return false;
        }
    },
    prevList: function () {
        if (this.page != 1) {
            this.page--;
            if (areaName == "kaziwang" || areaName == "midongr" || areaName == "midongz") {

                this.renderNewModel(doctors, doctorCount);
            } else {
                this.render();
            }
            LMEPG.BM.requestFocus('expert-2');
        }
    },
    nextList: function () {
        if (this.page != this.maxPage) {
            this.page++;
            if (areaName == "kaziwang" || areaName == "midongr" || areaName == "midongz") {
                this.renderNewModel(doctors, doctorCount);
            } else {
                this.render();
            }
            LMEPG.BM.requestFocus('expert-0');
        }
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
        obj.setParam('areaName', areaName);
        //obj.setParam('btnIndex', ((CommunityHosp.page-1)*3 + btn.idx));
        obj.setParam('hospitalId', hospitalId);

        return obj;
    },
    jumpPage: function (btn) {
        var currObj = CommunityHosp.currentPage();
        var addrObj = LMEPG.Intent.createIntent('experts-details');
        var idx = CommunityHosp.currentData[btn.idx].id;
        if (areaName === 'fuyun') {
            idx -= 2; // 富蕴人民医院隐藏了前两个医生，暂时先做兼容
        }
        addrObj.setParam('areaName', areaName);
        addrObj.setParam('page', CommunityHosp.page);
        addrObj.setParam('idx', idx);
        addrObj.setParam('btnIndex', ((CommunityHosp.page - 1) * 3 + btn.idx));
        addrObj.setParam('hospitalId', hospitalId);
        LMEPG.Intent.jump(addrObj, currObj);
    },
    onFocusChange: function (btn, hasFocus) {
        var marqueeEl1 = G('marquee-title-' + btn.idx);
        var marqueeEl2 = G('marquee-position-' + btn.idx);
        var marqueeEl3 = G('marquee-name-' + btn.idx);
        if (hasFocus) {
            CommunityHosp.marquee.start({el: marqueeEl1, len: 11, txt: marqueeEl1.title}, true);
            CommunityHosp.marquee.start({el: marqueeEl3, len: 8, txt: marqueeEl3.title}, true);
        } else {
            CommunityHosp.marquee.stop();
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
        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'expert-0', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    }
};
CommunityHosp.init();

function marquee() {
    var _options = [];
    var _option = {};
    return {
        start: function (obj, bol) {
            _option = obj;
            _option.bol = bol;
            // 得到焦点或失去焦点没有达到限制长度直接返回
            if (obj.txt.length <= obj.len) return obj.txt;
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
            _options.push(_option);
            if (bol) {
                obj.el.innerHTML = htm;
            } else {
                // 返回没有事件驱动文本滚动
                return htm;
            }
        },
        stop: function (fn) {
            for (var index = 0; index < _options.length; index++) {
                var option = _options[index];
                if (!option.el) return;
                option.el.innerHTML = option.bol ? LMEPG.Func.substrByOmit(option.txt, option.len) : option.txt;
                fn && fn.apply(null, arguments);
            }
        }
    };
}