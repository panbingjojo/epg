var members;
var memberCount = 0;

var BloodManage = {
    page: LMEPG.Func.getLocationString('page') || 1,
    maxPage: 0,
    
    init: function () {
        this.swichAjaxData();

    },
    goBack: function () {
        LMEPG.Intent.back();
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

    // 拉取用户列表
    swichAjaxData: function () {
        LMEPG.UI.showWaitingDialog('',1);
        LMEPG.ajax.postAPI('CommunityHospital/queryUserList', '',
            function (data) {
                try {
                    // data.result = -1;
                    if (data.result == 0) {
                        console.log(data);
                        memberCount = data.list.length;
                        members = data.list;
                        BloodManage.renderNewModel(members, memberCount);
                        BloodManage.createBtns();
                    } else { // 暂无数据
                        G('prev-arrow').style.visibility='hidden';
                        G('next-arrow').style.visibility='hidden';
                        // 显示暂无数据
                        var htm ='<img id="bg-content" src="__ROOT__/Public/img/hd/CommunityHospital/BloodManage/bg_content.png" alt=""> <p id="tip-text">暂无数据，请上传血压测量数据以便进行血压管理</p>'
                        G('container').innerHTML = htm;
                        BloodManage.createBtns();
                        LMEPG.BM.requestFocus('blood-data-up');
                    }
                } catch (e) {
                    LMEPG.UI.showToast("成员列表模板异常！",2);
                    LMEPG.Log.error(e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("拉取成员列表失败！",2);
            }
        );
    },


    //血压管理 家庭成员列表
    renderNewModel: function (members, memberCount) {
        var expertData = members;
        var reCount = (this.page - 1) * 3;
        var htm = '';
        // var imgPrefix = '/Public/img/hd/CommunityHospital/Expert/' + areaName + '/';
        var expert;


        this.maxPage = Math.ceil(memberCount / 3);
        this.currentData = expertData.slice(reCount, reCount + 3);
        for (var i = 0, len = this.currentData.length; i < len; i++) {
            expert = this.currentData[i];
            expert.text = '最近一次血压数据';
            // 如无血压数据，显示暂无
            if(expert.high_pressure == '' || expert.low_pressure == ''){
                expert.pressure = '暂无数据';
            }else{
                expert.pressure = expert.high_pressure+'/'+expert.low_pressure+'mmHg';
            }

            //获取医生头像
            // var DoctorAvatarUrl = this.buildDoctorAvatarUrl(RenderParam.CWS_HLWYY_URL, expert.doc_id, expert.avatar_url, RenderParam.carrierId);
            var DoctorAvatarUrl = '/Public/img/hd/CommunityHospital/BloodManage/pic_default.png';
            // htm += '<ul class="expert-wrapper" id="expert-' + i + '">'
            htm += '<ul class="expert-wrapper" id="expert-' + i +'" data-member-id ="'+expert.member_id+'" data-sex ="'+expert.member_gender+'" data-age ="'+expert.member_age+'">'
                + '<li class="expert-pic">'
                + '<img src=' + DoctorAvatarUrl
                + ' onerror="this.src=\'/Public/img/hd/CommunityHospital/BloodManage/pic_default.png\'" />'
                + '<li class="expert-name">' + LMEPG.Func.substrByOmit(expert.member_name, 11)
                + '<li class="expert-text">' + expert.text
                + '<li id="marquee-position-' + i + '" class="expert-position">' + expert.pressure
                + '</ul>';
        }
        G('container').innerHTML = htm;
        this.toggleArrow();
    },

    turnList: function (key, btn) {
        var _this = BloodManage;
        if (key === 'left' && btn.id === 'expert-0' && _this.page != 1) {
            console.log(_this.page, _this.maxPage);
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
            this.renderNewModel(members, memberCount);
            LMEPG.BM.requestFocus('expert-2');
        }
    },
    nextList: function () {
        if (this.page != this.maxPage) {
            this.page++;
            this.renderNewModel(members, memberCount);
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
        var obj = LMEPG.Intent.createIntent('members-list');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        obj.setParam('page', BloodManage.page);
        return obj;
    },
    jumpPage: function (btn) {
        if(btn.id != 'blood-data-up'){
            var dom = G(LMEPG.BM.getCurrentButton().id);
            // 获取当前点击的member_id
            var member_id = (dom.getAttribute('data-member-id'));
            var name = dom.children[1].innerHTML;
            var sex = dom.getAttribute('data-sex') == 1 ? '男性':'女性';
            var age = (dom.getAttribute('data-age')+'岁');

            var currObj = BloodManage.currentPage();
            var addrObj = LMEPG.Intent.createIntent('blood-manage-index');
            addrObj.setParam('member_id', member_id);
            addrObj.setParam('name', name);
            addrObj.setParam('sex', sex);
            addrObj.setParam('age', age);
            addrObj.setParam('page', BloodManage.page);
            addrObj.setParam('idx', BloodManage.currentData[btn.idx].id);
            addrObj.setParam('btnIndex', ((BloodManage.page-1)*3 + btn.idx));
            LMEPG.Intent.jump(addrObj, currObj);
        }else{
            // 跳转血压数据上传页面
            var currObj = BloodManage.currentPage();
            var addrObj = LMEPG.Intent.createIntent('blood-data-up');
            LMEPG.Intent.jump(addrObj, currObj);
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
                nextFocusUp: 'blood-data-up',
                backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/expert.png',
                focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/expert-f.png',
                beforeMoveChange: this.turnList,
                click: this.jumpPage,
                idx: len
            });
        };

        buttons.push({
            id: 'blood-data-up' ,
            type: 'img',
            nextFocusDown: 'expert-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_blood_data_up.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_blood_data_up_f.png',
            beforeMoveChange: '',
            click: this.jumpPage,
            idx: 4
        });



        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'expert-0', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: BloodManage.goBack});
    }
};

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