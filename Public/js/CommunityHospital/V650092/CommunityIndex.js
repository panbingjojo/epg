var areaName = LMEPG.Func.getLocationString('areaName');
if (areaName) {
    LMEPG.Cookie.setCookie('areaName', areaName);
} else {
    areaName = LMEPG.Cookie.getCookie('areaName') || 'midong';
}


var CommunityHosp = {
    marquee: marquee(),
    pageName: 'communityIndex',
    hospitalId: '',
    hospitalImg: '',
    init: function () {
        this.getHospData();
        this.createBtns();
    },
    goBack: function () {
        // inner = 0 表示从EPG外面进来，直接返回EPG，不然返回到39健康应用
        if (G("show-code").style.display == "block") {
            G("show-code").style.display = "none";
            LMEPG.ButtonManager.setKeyEventPause(false);
        }else  if (G("show-intro").style.display == "block") {
            G("show-intro").style.display = "none";
            LMEPG.BM.requestFocus("experts-introduce");
        }else {
            if (RenderParam.inner == '0') {
                LMEPG.Intent.back('IPTVPortal');
            } else {
                LMEPG.Intent.back();
            }
        }

    },

    areaMap: function () {
        var areaId = "";
        switch (areaName) {
            case "mingde":
                areaId = "MDYY00001";
                break;
            case "fuyun":
                areaId = "100000022";
                break;
            case "hongxing":
                areaId = "100000023";
                break;
            case "tongren":
                areaId = "TRYY00001";
                break;
            case "midong":
                areaId = "123321123";
                break;
            case "kaziwang":
                areaId = "KZWSQ0001";
                break;
            case "midongr":
                areaId = "RMYY00001";
                break;
            case "midongz":
                areaId = "ZYYY00002";
                break;
            case "wulumuqierdaoqiaoyiyuan":
                areaId = "100000023";
                break;
            default:
                areaId = "MDYY00001";
                break;
        }
        return areaId;
    },

    swichAjaxData: function () {
            var postData = {
                'hospId': CommunityHosp.areaMap()
            };
            LMEPG.ajax.postAPI('Doctor/getHospitalList', postData,
                function (data) {
                    try {
                        var result = data.code;
                        if (result == 0) {
                            var hospData = data.hospitalInfo[0];
                            LMEPG.UI.dismissWaitingDialog();
                            CommunityHosp.renderCws(hospData);
                            CommunityHosp.hospitalId = hospData.hosl_id;
                            // CommunityHosp.hospitalImg = hospData.hosp_image_url;
                        } else { // 设置号码失败
                            LMEPG.UI.showToast("没有拿到数据！" + data.result);
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("获取模板处理异常！");
                        LMEPG.Log.error(e.toString());
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("获取模板发生错误！");
                }
            );

    },
    getHospData: function () {

        LMEPG.UI.showWaitingDialog();
        CommunityHosp.swichAjaxData();

    },
    renderCws: function (data) {
        // diff
        CommunityHosp.hospitalId = data.hosl_id;
        G('hosp-name').innerText = data.hosl_name;
        G('hosp-intro-title').innerText = data.hosl_name + '简介';
        G('marquee-wrap').innerHTML = CommunityHosp.marquee.start({
            txt: data.hosp_introduce,
            len: 200,
            dir: 'up',
            vel: 2
        });
        var hospitalUrl = resolveImgToLocal("http://120.70.237.86:10000/cws/39hospital/index.php",data.hosp_image_url,CommunityHosp.hospitalId);
        G("hosp-pic_1").src = hospitalUrl;
    },
    currentPage: function () {
        var obj = LMEPG.Intent.createIntent('community-index');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        return obj;
    },

    jumpPage: function (btn) {
        var currObj = CommunityHosp.currentPage();
        if (btn.id === 'online-case') {
            if((areaName == "kaziwang") || (areaName == "midongr") || (areaName == "midongz")){
                LMEPG.UI.showToast('功能暂未开放，敬请期待！', 2);
                return;
            }
            CommunityHosp.goInquiry();
        } else {
            var addrObj = LMEPG.Intent.createIntent(btn.id);
            if (areaName == "mingde" && btn.id == "experts-introduce") {
                var addrObj = LMEPG.Intent.createIntent("health-education");
            }else if(areaName == "tongren"&& btn.id == "experts-introduce"){
                G("show-intro").style.display = "block";
                LMEPG.BM.requestFocus("show-intro");
                return;
            } else if (btn.id == "especially-department"&&areaName=="hongxing") {
                CommunityHosp.jumpActivityPage("ActivityCommunityHospital20191224");
                return;
            }
            addrObj.setParam('areaName', areaName);
            addrObj.setParam('hospitalId', CommunityHosp.hospitalId);
            LMEPG.Intent.jump(addrObj, currObj);
        }
    },
    /**
     * 跳转 -- 活动页面
     * @param activityName
     */
    jumpActivityPage: function (activityName) {
        var objHome = CommunityHosp.currentPage();
        objHome.setParam("userId", RenderParam.userId);
        // objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objActivity = LMEPG.Intent.createIntent("activity");
        objActivity.setParam("activityName", activityName);
        objActivity.setParam("inner", 1);
        LMEPG.Intent.jump(objActivity, objHome);
    },
    /**跳转视频问诊界面*/
    goInquiry: function () {
        // 允许进入问诊用户
        var accessAccount = [
            '18167854853HD', // todo 测试账户
            'lsxHD',
            'alytest03',
            'yxjtest6'
        ];

        var currObj = CommunityHosp.currentPage();
        var addrObj = LMEPG.Intent.createIntent('doctorList');
        addrObj.setParam('userId', RenderParam.userId);
        addrObj.setParam('hospitalId', CommunityHosp.hospitalId);
        var hospitalName = G('hosp-name').innerText;
        addrObj.setParam('hospitalName', hospitalName);
        addrObj.setParam('s_demo_id', 'superDemo');

        LMEPG.Intent.jump(addrObj, currObj);
    },
    closeLayer:function () {
        G("show-intro").style.display = "none";
        LMEPG.BM.requestFocus("experts-introduce");
    },
    createBtns: function () {
        var buttons = [{
            id: 'online-case',
            type: 'img',
            name: '预约挂号',
            nextFocusUp: 'especially-department',
            nextFocusLeft: 'community-doctor',
            nextFocusRight: 'experts-introduce',
            backgroundImage: g_appRootPath+ '/Public/img/hd/CommunityHospital/online-case.png',
            focusImage: g_appRootPath+ '/Public/img/hd/CommunityHospital/online-case-f.png',
            focusChange: '',
            click: this.jumpPage
        }, {
            id: 'experts-introduce',
            type: 'img',
            name: '专家介绍',
            nextFocusUp: 'especially-department',
            nextFocusDown: '',
            nextFocusLeft: 'online-case',
            nextFocusRight: 'health-education',
            backgroundImage:areaName == "tongren" ?g_appRootPath+ '/Public/img/hd/CommunityHospital/tongren/server.png': g_appRootPath+ '/Public/img/hd/CommunityHospital/experts-introduce.png',
            focusImage: areaName == "tongren" ?g_appRootPath+ '/Public/img/hd/CommunityHospital/tongren/server_f.png':g_appRootPath+ '/Public/img/hd/CommunityHospital/experts-introduce-f.png',
            focusChange: '',
            click: this.jumpPage
        }, {
            id: 'health-education',
            type: 'img',
            name: '健康教育',
            nextFocusUp: 'especially-department',
            nextFocusDown: '',
            nextFocusLeft: 'experts-introduce',
            nextFocusRight: 'community-doctor',
            backgroundImage: areaName == "tongren" ?g_appRootPath+ '/Public/img/hd/CommunityHospital/tongren/baojian.png':g_appRootPath+ '/Public/img/hd/CommunityHospital/health-education.png',
            focusImage:areaName == "tongren" ?g_appRootPath+ '/Public/img/hd/CommunityHospital/tongren/baojian_f.png': g_appRootPath+ '/Public/img/hd/CommunityHospital/health-education-f.png',
            focusChange: '',
            click: this.jumpPage
        }, {
            id: 'community-doctor',
            type: 'img',
            name: '社区医院',
            nextFocusUp: 'especially-department',
            nextFocusDown: '',
            nextFocusLeft: 'health-education',
            nextFocusRight: 'online-case',
            backgroundImage: g_appRootPath+ '/Public/img/hd/CommunityHospital/community-doctor.png',
            focusImage: g_appRootPath+ '/Public/img/hd/CommunityHospital/community-doctor-f.png',
            focusChange: '',
            click: this.jumpPage
        }, {
            id: 'especially-department',
            type: 'img',
            name: '特色科室',
            nextFocusDown: 'community-doctor',
            nextFocusLeft: '',
            nextFocusRight: '',
            backgroundImage: areaName == "hongxing" ? g_appRootPath+ '/Public/img/hd/CommunityHospital/community-doctor.png' :g_appRootPath+  '/Public/img/hd/CommunityHospital/especially-department.png',
            focusImage: areaName == "hongxing" ? g_appRootPath+ '/Public/img/hd/CommunityHospital/community-doctor-f.png' :g_appRootPath+  '/Public/img/hd/CommunityHospital/especially-department-f.png',
            focusChange: '',
            click: this.jumpPage
        }, {
            id: 'show-intro',
            type: '',
            name: '',
            nextFocusDown: '',
            nextFocusLeft: '',
            nextFocusRight: '',
            focusChange: '',
            click:CommunityHosp.closeLayer
        }];
        CommunityHosp.diffButton();
        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'online-case', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    },

    diffButton:function () {
        if (areaName == "hongxing") {
            G('especially-department').src =g_appRootPath+"/Public/img/hd/CommunityHospital/community-doctor.png";
        }else if(areaName == "tongren"){
            G('experts-introduce').src =g_appRootPath+ "/Public/img/hd/CommunityHospital/tongren/server.png";
            G('health-education').src = g_appRootPath+"/Public/img/hd/CommunityHospital/tongren/baojian.png";
        }
        else if((areaName == "kaziwang") || (areaName == "midongr") || (areaName == "midongz")){
            G('community-doctor').src = g_appRootPath+'/Public/img/hd/CommunityHospital/order-register.png';
        }
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
            _option.el.innerHTML = _option.bol ? substrByOmit(_option.txt, _option.len) : _option.txt;
            fn && fn.apply(null, arguments);
        }
    };
}

// 解析医生头像工具
function resolveImgToLocal(urlPrefix,avatarUrl,doctorId) {
    var head = {
        func: 'getDoctorHeadImage',
        carrierId: "630092",
        areaCode: ''
    };
    var json = {
        doctorId: doctorId,
        avatarUrl: avatarUrl
    };
    return urlPrefix + '?head=' + JSON.stringify(head) + '&json=' + JSON.stringify(json);
}

