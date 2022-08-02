// /** 按返回键 */
// function onBack() {
//     LMEPG.Intent.back();
// }
// 返回键
function onBack() {
    LMEPG.Intent.back('IPTVPortal');
}


var unionHospitalRes = {
    "v1": {
        "content1": {
            normalImage: "/Public/img/hd/Hospital/BeiCaoYuanHospital/Hospital_baijin_no.png",
            focusImage: "/Public/img/hd/Hospital/BeiCaoYuanHospital/Hospital_beijin_on.png",
            hospitalName: 'beijingbaicao',
            intentName: 'common-doc',
        },
        "content2": {
            normalImage: "/Public/img/hd/Hospital/BeiCaoYuanHospital/Hospital_akeshu_no.png",
            focusImage: "/Public/img/hd/Hospital/BeiCaoYuanHospital/Hospital_akeshu_on.png",
            hospitalName: 'akeshunancheng',
            intentName: 'common-doc',
        },
    },
    "v2": {
        "content1": {
            normalImage: "/Public/img/hd/Hospital/KuErLeHospital/content1_n.png",
            focusImage: "/Public/img/hd/Hospital/KuErLeHospital/content1_f.png",
            hospitalName: 'kuerleshizhongyiyiyuan',
            hospitalId: "TN9632",
            functions: "jkzx",
            version: "1.0",
            intentName: 'hospital-index-version',
        },
        "content2": {
            normalImage: "/Public/img/hd/Hospital/KuErLeHospital/content2_n.png",
            focusImage: "/Public/img/hd/Hospital/KuErLeHospital/content2_f.png",
            hospitalName: 'awatiyiyuan',
            hospitalId: "TN9608",
            functions: "jkzx",
            version: "1.0",
            intentName: 'hospital-index-version',
        },
    },
    "v3": {
        "content1": {
            normalImage: "/Public/img/hd/Hospital/HuanWeiLuHospital/content1_n.png",
            focusImage: "/Public/img/hd/Hospital/HuanWeiLuHospital/content1_f.png",
            hospitalName: 'huanweilupianquguanweihui',
            hospitalId: "TN9868",
            functions: "jkzx",
            version: "1.0",
            intentName: 'hospital-index-version',
        },
        "content2": {
            normalImage: "/Public/img/hd/Hospital/HuanWeiLuHospital/content2_n.png",
            focusImage: "/Public/img/hd/Hospital/HuanWeiLuHospital/content2_f.png",
            hospitalName: 'tianshanquheijiashanguanweihui',
            hospitalId: "TN9867",
            functions: "jkzx",
            version: "1.0",
            intentName: 'hospital-index-version',
        },
    },
    "v4": {
        "content1": {
            normalImage: "/Public/img/hd/Hospital/ShuFuXianHospital/content1_n.png",
            focusImage: "/Public/img/hd/Hospital/ShuFuXianHospital/content1_f.png",
            hospitalName: 'shufuxianwukusakezhenweishengyuan',
            hospitalId: "TN9938",
            functions: "jkzx",
            version: "1.0",
            intentName: 'hospital-index-version',
        },
        "content2": {
            normalImage: "/Public/img/hd/Hospital/ShuFuXianHospital/content2_n.png",
            focusImage: "/Public/img/hd/Hospital/ShuFuXianHospital/content2_f.png",
            hospitalName: 'kashidiquyingjishaxianchengzhenweishengyuan',
            hospitalId: "458084445",
            functions: "jkzx",
            version: "1.0",
            intentName: 'hospital-index-version',
        },
    },
    "v5": {
        "content1": {
            normalImage: "/Public/img/hd/Hospital/HuLianWangHospital/content1_n.png",
            focusImage: "/Public/img/hd/Hospital/HuLianWangHospital/content1_f.png",
            hospitalName: 'hulianwangyiliaofuwu',
        },
        "content2": {
            normalImage: "/Public/img/hd/Hospital/HuLianWangHospital/content2_n.png",
            focusImage: "/Public/img/hd/Hospital/HuLianWangHospital/content2_f.png",
            hospitalName: 'fuyun',
            hospitalId: "100000022",
            functions: "zxzx,zjjs,jkjy,yygh",
            version: "2.0",
            intentName: 'hospital-index-version',
        },
    },
    "v6": {
        "content1": {
            normalImage: "/Public/img/hd/Hospital/AltayMaternalAndChildHealthHospital/content1_n.png",
            focusImage: "/Public/img/hd/Hospital/AltayMaternalAndChildHealthHospital/content1_f.png",
            hospitalName: 'hulianwangyiliaofuwu',
        },
        "content2": {
            normalImage: "/Public/img/hd/Hospital/AltayMaternalAndChildHealthHospital/content2_n.png",
            focusImage: "/Public/img/hd/Hospital/AltayMaternalAndChildHealthHospital/content2_f.png",
            hospitalName: 'aletaidiqufuyoubaojianyuan',
            hospitalId: "TN9902",
            functions: "jkzx",
            version: "1.0",
            intentName: 'hospital-index-version',
        },
    },
    "v7": {
        "content1": {
            normalImage: "/Public/img/hd/Hospital/HeBaXiangYuSheng/content1_n.png",
            focusImage: "/Public/img/hd/Hospital/HeBaXiangYuSheng/content1_f.png",
            hospitalName: 'hebaxiangshequ',
            hospitalId: "TN10034",
            functions: "jkzx",
            version: "1.0",
            intentName: 'hospital-index-version',
        },
        "content2": {
            normalImage: "/Public/img/hd/Hospital/HeBaXiangYuSheng/content2_n.png",
            focusImage: "/Public/img/hd/Hospital/HeBaXiangYuSheng/content2_f.png",
            hospitalName: 'shenglilushequ',
            hospitalId: "TN10035",
            functions: "jkzx",
            version: "1.0",
            intentName: 'hospital-index-version',
        },
    },
}

var unionHospitalVersion = RenderParam.unionHospitalVersion;
var contentId1 = "content1";
var contentId2 = "content2";

var Page = {
    /**
     *跳转
    * */
    routeHospital: function (hospitalInfo) {
        if (hospitalInfo.hospitalName === 'hulianwangyiliaofuwu') {
            LMEPG.ajax.postAPI("Common/clearLocalInquiry",{},function (resultDate) {
                var homeIntent = LMEPG.Intent.createIntent("home");
                LMEPG.Intent.jump(homeIntent);
            },function (errorData) {
                LMEPG.UI.showToast("跳转失败，请稍后再试！");
            })
        } else {
            var hospitalIntent = LMEPG.Intent.createIntent("hospital-index");
            hospitalIntent.setParam("hospitalName", RenderParam.hospitalName);
            hospitalIntent.setParam("focusIndex",LMEPG.BM.getCurrentButton().id)
            var obj = LMEPG.Intent.createIntent(hospitalInfo.intentName);
            obj.setParam("hospitalName", hospitalInfo.hospitalName);
            if(unionHospitalVersion === 'v2' || unionHospitalVersion === 'v3'
                || unionHospitalVersion === 'v4' || unionHospitalVersion === 'v5'
                || unionHospitalVersion === 'v6' || unionHospitalVersion === 'v7') {
                obj.setParam("hospitalId", hospitalInfo.hospitalId);
                obj.setParam("version", hospitalInfo.version);
                obj.setParam("function", hospitalInfo.functions);
            }
            LMEPG.Intent.jump(obj, hospitalIntent,LMEPG.Intent.INTENT_FLAG_DEFAULT);
        }
    },

};

/**
 * 焦点控制
 */
var Action = {
    onClick: function (btn) {
        Page.routeHospital(unionHospitalRes[unionHospitalVersion][btn.id]);
    },

};

// 当前页面的所有按钮
var buttons = [
    {
        id: contentId1,
        name: unionHospitalRes[unionHospitalVersion][contentId1].hospitalName,
        type: 'img',
        focusable: true,
        nextFocusLeft: '',
        nextFocusUp: '',
        nextFocusRight: contentId2,
        nextFocusDown: '',
        backgroundImage: g_appRootPath + unionHospitalRes[unionHospitalVersion][contentId1].normalImage,
        focusImage: g_appRootPath + unionHospitalRes[unionHospitalVersion][contentId1].focusImage,
        click: Action.onClick
    },
    {
        id: contentId2,
        name: g_appRootPath + unionHospitalRes[unionHospitalVersion][contentId2].hospitalName,
        type: 'img',
        focusable: true,
        nextFocusLeft: contentId1,
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + unionHospitalRes[unionHospitalVersion][contentId2].normalImage,
        focusImage: g_appRootPath + unionHospitalRes[unionHospitalVersion][contentId2].focusImage,
        click: Action.onClick
    }
];

/**
 * 我的家 - 初始化唯一入口类
 */
var MyHome = {
    init: function () {
        var initFocusId = LMEPG.Func.isEmpty(RenderParam.currentFocusId) ? contentId1 : RenderParam.currentFocusId;
        LMEPG.BM.init(initFocusId, buttons, '', true);
    }
};