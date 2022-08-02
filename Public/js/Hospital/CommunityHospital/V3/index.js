// var RenderParam.hospitalName = LMEPG.Func.getLocationString('RenderParam.hospitalName');
var HospitalArea = {
    init: function () {
        CommunityHosp.getHospData();
        this.createBtns();
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    },

    closeLayer: function () {
        G("show-intro").style.display = "none";
        LMEPG.BM.requestFocus("experts-introduce");
    },
    areaMap: function () {
        var areaId = "";
        switch (RenderParam.hospitalName) {
            case "wanaxiangfuwuzhan":
                areaId = "TN9110";
                break;
            case "wulumuqierdaoqiaoyiyuan":
                areaId = "TN9454";
                break;
            case "akeshunanchengrexian":
                areaId = "TN9117";
                break;
            default:
                areaId = "wanaxiangfuwuzhan";
                break;
        }
        return areaId;
    },
    createBtns: function () {
        var buttons = [{
            id: 'online-case',
            type: 'img',
            name: '预约挂号',
            nextFocusUp: 'especially-department',
            nextFocusLeft: 'community-doctor',
            nextFocusRight: 'experts-introduce',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/online-case.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/online-case-f.png',
            focusChange: '',
            click: CommunityHosp.jumpPage
        }, {
            id: 'experts-introduce',
            type: 'img',
            name: '专家介绍',
            nextFocusUp: 'especially-department',
            nextFocusDown: '',
            nextFocusLeft: 'online-case',
            nextFocusRight: 'health-education',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/experts-introduce.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/experts-introduce-f.png',
            focusChange: '',
            click: CommunityHosp.jumpPage
        }, {
            id: 'health-education',
            type: 'img',
            name: '健康教育',
            nextFocusUp: 'especially-department',
            nextFocusDown: '',
            nextFocusLeft: 'experts-introduce',
            nextFocusRight: 'community-doctor',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/health-education.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/health-education-f.png',
            focusChange: '',
            click: CommunityHosp.jumpPage
        }, {
            id: 'community-doctor',
            type: 'img',
            name: '社区医院',
            nextFocusUp: 'especially-department',
            nextFocusDown: '',
            nextFocusLeft: 'health-education',
            nextFocusRight: 'online-case',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/order-register.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/order-register-f.png',
            focusChange: '',
            click: CommunityHosp.jumpPage
        }, {
            id: 'show-intro',
            type: '',
            name: '',
            nextFocusDown: '',
            nextFocusLeft: '',
            nextFocusRight: '',
            focusChange: '',
            click: CommunityHosp.closeLayer
        }];
        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'online-case', buttons, true);
    },
};
