// var RenderParam.hospitalName = LMEPG.Func.getLocationString('RenderParam.hospitalName');
var HospitalArea = {
    init: function () {
        CommunityHosp.getHospData();
        this.createBtns();
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    },

    closeLayer:function () {
        G("show-intro").style.display = "none";
        LMEPG.BM.requestFocus("experts-introduce");
    },
    areaMap: function () {
        var areaId = "";
        switch (RenderParam.hospitalName) {
            case "jinghe":
                areaId = "457613392";
                break;
            case "wujiadongqu":
                areaId = "697841749";
                break;
            case "hejingmengyi":
                areaId = "076057636";
                break;
            case "jinghexiantuolizhen":
                areaId = "457855850";
                break;
            //服务热线
            case "wushixianahexiang":
                areaId = "TN5281";
                break;
            default:
                areaId = "123321123";
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
            nextFocusRight: 'health-education',
            backgroundImage: g_appRootPath+ '/Public/img/hd/CommunityHospital/online-case.png',
            focusImage:g_appRootPath+  '/Public/img/hd/CommunityHospital/online-case-f.png',
            focusChange: '',
            click: CommunityHosp.jumpPage
        },{
            id: 'health-education',
            type: 'img',
            name: '健康教育',
            nextFocusUp: 'especially-department',
            nextFocusDown: '',
            nextFocusLeft: 'online-case',
            nextFocusRight: 'blood-manage',
            backgroundImage: g_appRootPath+ '/Public/img/hd/CommunityHospital/health-education.png',
            focusImage:g_appRootPath+ '/Public/img/hd/CommunityHospital/health-education-f.png',
            focusChange: '',
            click: CommunityHosp.jumpPage
        }, {
            id: 'blood-manage',
            type: 'img',
            name: '血压管理',
            nextFocusUp: 'especially-department',
            nextFocusDown: '',
            nextFocusLeft: 'health-education',
            nextFocusRight: 'community-doctor',
            backgroundImage: g_appRootPath+ '/Public/img/hd/CommunityHospital/blood-manage.png',
            focusImage: g_appRootPath+ '/Public/img/hd/CommunityHospital/blood-manage-f.png',
            beforeMoveChange: this.turnList,
            click: CommunityHosp.jumpPage
        },{
            id: 'community-doctor',
            type: 'img',
            name: '社区医院',
            nextFocusUp: 'especially-department',
            nextFocusDown: '',
            nextFocusLeft: 'health-education',
            nextFocusRight: 'online-case',
            backgroundImage: g_appRootPath+ '/Public/img/hd/CommunityHospital/community-doctor.png',
            focusImage:g_appRootPath+  '/Public/img/hd/CommunityHospital/community-doctor-f.png',
            focusChange: '',
            click: CommunityHosp.jumpPage
        }, {
            id: 'especially-department',
            type: 'img',
            name: '特色科室',
            nextFocusDown: 'community-doctor',
            nextFocusLeft: '',
            nextFocusRight: '',
            backgroundImage: g_appRootPath+ '/Public/img/hd/CommunityHospital/especially-department.png',
            focusImage:g_appRootPath+  '/Public/img/hd/CommunityHospital/especially-department-f.png',
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
            click:CommunityHosp.closeLayer
        }];
        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'online-case', buttons, true);
    },
};
