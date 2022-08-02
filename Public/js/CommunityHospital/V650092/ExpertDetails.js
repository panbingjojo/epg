var areaName = RenderParam.areaName;
var hospitalId = RenderParam.hospitalId;
var doctors;
var doctorCount = 0;
var doctorIndex = 0;
var CommunityHosp = {
    marquee: marquee(),
    page: LMEPG.Func.getLocationString('idx') || 0,
    maxPage: 0,
    init: function () {
        this.getHospData();
        doctorIndex = parseInt(LMEPG.Func.getLocationString('btnIndex'));
    },
    goBack: function () {
        LMEPG.Intent.back();
    },
    getDoctorListByHospitalId: function(hospitalId, deptId, page, pageSize, callback) {
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
    buildDoctorAvatarUrl: function(urlPrefix, doctorId, avatarUrl, carrierID) {
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
        var EPG = LMEPG;
        var _this = CommunityHosp;
        LMEPG.UI.showWaitingDialog();
        //if(0){
        //社区医院新模板，专家介绍从服务器拉取
        if(areaName=="kaziwang" || areaName=="midongr" || areaName=="midongz"|| areaName=="wanaxiangfuwuzhan"){
            this.getDoctorListByHospitalId(hospitalId, '', 1, 100, function (deptId, page, pageSize, data) {
                LMEPG.UI.dismissWaitingDialog();
                if (data.result.code == 0) {
                    doctorCount = data.result.total;
                    doctors = data.result.list;
                    _this.renderNewModel(doctors, doctorIndex);
                    _this.createBtns();
                } else {
                    LMEPG.UI.showMessage('医院请求失败！', 2);
                    LMEPG.BM.init('', [], '', true); // 保证返回
                }
            });
        } else {
            EPG.ajax.post({
                url: g_appRootPath + '/Public/js/CommunityHospital/V650092/CommunityHospitalData650092',
                requestType: 'GET',
                success: function (xmlRequest, data) {
                    LMEPG.UI.dismissWaitingDialog();
                    _this.data = data[areaName].experts;
                    _this.render(data);
                    _this.createBtns();
                },
                error: function (rsp, data) {
                    LMEPG.Func.dialog.showToast('医院请求失败！', 2);
                    EPG.BM.init('', [], '', true); // 保证返回
                }
            });
        }
    },
    render: function (data) {
        var expertData = CommunityHosp.data; // 得到专家数据
        var imgPrefix = '/Public/img/hd/CommunityHospital/Expert/' + areaName + '/';
        this.currentData = expertData[this.page];
        var expert = this.currentData;
        console.log(expert);
        G('container').innerHTML = ''
            + '<img class="expert-pic" src="' + imgPrefix + expert.unique + '.png"'
            + ' onerror="this.src=\'__ROOT__/Public/img/hd/CommunityHospital/Expert/default.png\'" />'
            + '<ul class="expert-wrapper" id="expert">'
            + '<li class="expert-name">' + expert.name
            + '<li class="dep-and-pos">'
            + '<span class="expert-department">' + expert.department + '</span>'
            + '<span class="expert-department"> | </span>'
            + '<span class="expert-position">' + expert.position + '</span>'
            + '<li class="expert-skillful"><span class="skillful">擅长：</span>' + expert.skillful
            + '<li class="expert-intro"><span class="intro">简介：</span>' +
            CommunityHosp.marquee.start({txt: expert.introduce, len: 100, dir: 'up', vel: 2})
            + '</ul>';

        this.maxPage = expertData.length - 1;
        this.toggleArrow();
    },

    renderNewModel: function (doctors, doctorIndex) {
        var expertData = doctors; // 得到专家数据
        // if(doctorIndex > doctorCount){
        //     doctorIndex = doctorCount;
        // }else if(doctorIndex < 0){
        //     doctorIndex= 0;
        // }
        this.currentData = expertData[doctorIndex];
        var expert = this.currentData;
        var DoctorAvatarUrl = this.buildDoctorAvatarUrl(RenderParam.CWS_HLWYY_URL, expert.doc_id, expert.avatar_url, RenderParam.carrierId);


        console.log(expert,expert.good_disease.length);
        var text = '擅长：</br>'+expert.good_disease+'</br></br> 简介：</br>'+expert.intro_desc
        G('container').innerHTML = ''
            + '<img class="expert-pic" src=' + DoctorAvatarUrl + ' />'
           // + ' onerror="this.src=\'/Public/img/hd/CommunityHospital/Expert/default.png\'" />'
            + '<ul class="expert-wrapper" id="expert">'
            + '<li class="expert-name">' + expert.doc_name
            + '<li class="dep-and-pos">'
            + '<span class="expert-department">' + expert.department + '</span>'
            + '<span class="expert-department"> | </span>'
            + '<span class="expert-position">' + expert.job_title + '</span>'
            + '<li class="expert-intro">' +
            CommunityHosp.marquee.start({txt: text, len: 100, dir: 'up', vel: 2})
            + '</li></ul>';

        this.maxPage = expertData.length - 1;
        this.toggleArrow();
    },
    turnList: function (key, btn) {
        var _this = CommunityHosp;
        if(areaName=="kaziwang" || areaName=="midongr" || areaName=="midongz"){
            if (key === 'left' && _this.btnIndex !== 0) {
                _this.prevList();
                return false;
            }
            if (key === 'right' && _this.btnIndex !== _this.maxPage) {
                _this.nextList();
                return false;
            }
        }else {
            if (key === 'left' && _this.page !== 0) {
                _this.prevList();
                return false;
            }
            if (key === 'right' && _this.page !== _this.maxPage) {
                _this.nextList();
                return false;
            }
        }
    },
    prevList: function () {
        if(areaName=="kaziwang" || areaName=="midongr" || areaName=="midongz"){
            doctorIndex--;
            if( doctorIndex >= 0){
                this.renderNewModel(doctors, doctorIndex);
            }else{
                doctorIndex = 0;
            }

        }else {
            this.page--;
            this.render();
        }
    },
    nextList: function () {
        if(areaName=="kaziwang" || areaName=="midongr" || areaName=="midongz"){
            doctorIndex++;
            if( doctorIndex < doctorCount){
                this.renderNewModel(doctors, doctorIndex);
            }else{
                doctorIndex = doctorCount - 1;
            }
        }else {
            this.page++;
            this.render();
        }
    },
    toggleArrow: function () {
        if(areaName=="kaziwang" || areaName=="midongr" || areaName=="midongz"){
            if(doctorIndex <= 0){
                H('prev-arrow');
                //doctorIndex = 0;
                if(doctorCount > 0){
                    S('next-arrow');
                }
            }else if((doctorIndex > 0) && (doctorIndex < doctorCount-1)){
                S('prev-arrow');
                S('next-arrow');
            }else if(doctorIndex >= doctorCount-1){
                S('prev-arrow');
                H('next-arrow');
                //doctorIndex = doctorCount;
            }
        }else {
            H('prev-arrow');
            H('next-arrow');
            this.page != 0 && S('prev-arrow');
            this.page != this.maxPage && S('next-arrow');
        }
    },
    currentPage: function () {
        var obj = LMEPG.Intent.createIntent('experts-introduce');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        obj.setParam('page', CommunityHosp.page);
        obj.setParam('areaName', areaName);
        obj.setParam('hospitalId', hospitalId)
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
            id: 'expert',
            type: 'others',
            beforeMoveChange: this.turnList
        }];
        LMEPG.BM.init('expert', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    }
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