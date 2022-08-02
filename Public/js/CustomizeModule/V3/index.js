var Page = {
    slideList: ['page1.png',
        'page2.png',
        'page3.png',
        'page4.png',
        'page5.png'],

    informationList: [
        'businessPage.jpg',
        'ecologicalPage.jpg',
        'packagePage.jpg',
        'packInformationPage.jpg',
    ],

    buttonOutId: '',
    buttonInnerId: '',

    init: function () {
        Page.initButton();
        LMEPG.ButtonManager.init('tongji_medicine', [], '', true);
        if (LMEPG.Func.getLocationString('isYKT') == 1) {
            //叶开泰图文页面跳转回来需要维持页面状态
            Page.changePage1();
        } else {
            Show('area_local_health');
        }
    },

    changeFunc: function (btn) {
        Page.buttonInnerId = LMEPG.BM.getCurrentButton().id;
        var url = g_appRootPath + '/Public/img/hd/CustomizeModule/V3/';
        switch (btn.id) {
            case 'business':
            case 'ecological':
            case 'package':
            case 'packInformation':
                G('informationPage').style.display = 'block';
                G('informationPage').style.backgroundImage = "url(" + (url + Page.informationList[btn.pageNum]) + ")";
                LMEPG.ButtonManager.requestFocus('informationPage');
                break;
            case 'wenhuayuan':
                Page.jumpTuWen('hb0004');
                break;
            case 'guoyitang':
                Page.jumpTuWen('hb001');
                break;
            case 'wenhua':
                Page.jumpTuWen('hb002');
                break;
            case 'jiaoyu':
                Page.jumpTuWen('hb003');
                break;
        }
    },

    initButton: function () {
        LMEPG.BM.addButtons([{
            id: 'tongji_medicine',
            name: '同济医药',
            type: 'img',
            nextFocusRight:'yekaitai',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/tongji_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/tongji.png',
            click: Page.changePage,
            focusChange: '',
            beforeMoveChange: ''
        },{
            id: 'yekaitai',
            name: '叶开泰',
            type: 'img',
            nextFocusLeft: 'tongji_medicine',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/yekaitai_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/yekaitai.png',
            click: Page.changePage1,
            focusChange: '',
            beforeMoveChange: ''
        },{
            id: 'business',
            name: '业务介绍',
            type: 'div',
            nextFocusRight: 'ecological',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/function_f.png',
            backgroundImage: ' ',
            click: Page.changeFunc,
            pageNum: 0
        }, {
            id: 'ecological',
            name: '生态产业链接',
            type: 'div',
            nextFocusLeft: 'business',
            nextFocusRight: 'package',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/function_f.png',
            backgroundImage: ' ',
            click: Page.changeFunc,
            pageNum: 1
        }, {
            id: 'package',
            name: '套餐类型',
            type: 'div',
            nextFocusLeft: 'ecological',
            nextFocusRight: 'packInformation',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/function_f.png',
            backgroundImage: ' ',
            click: Page.changeFunc,
            pageNum: 2
        }, {
            id: 'packInformation',
            name: '园区介绍',
            type: 'div',
            nextFocusLeft: 'package',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/function_f.png',
            backgroundImage: ' ',
            click: Page.changeFunc,
            pageNum: 3
        }, {
            id: 'wenhuayuan',
            name: '文化园简介',
            type: 'div',
            nextFocusRight: 'guoyitang',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/function_f.png',
            backgroundImage: ' ',
            click: Page.changeFunc,
            pageNum: 4
        },{
            id: 'guoyitang',
            name: '叶开泰国医堂',
            type: 'div',
            nextFocusLeft: 'wenhuayuan',
            nextFocusRight: 'wenhua',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/function_f.png',
            backgroundImage: ' ',
            click: Page.changeFunc,
            pageNum: 5
        },{
            id: 'wenhua',
            name: '文化景观',
            type: 'div',
            nextFocusLeft: 'guoyitang',
            nextFocusRight: 'jiaoyu',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/function_f.png',
            backgroundImage: ' ',
            click: Page.changeFunc,
            pageNum: 6
        },{
            id: 'jiaoyu',
            name: '教育科普',
            type: 'div',
            nextFocusLeft: 'wenhua',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V3/function_f.png',
            backgroundImage: ' ',
            click: Page.changeFunc,
            pageNum: 7
        }])
    },

    changePage:function () {
        Show('tongji_medical');
        Hide('area_local_health');
        LMEPG.ButtonManager.requestFocus('business');
    },

    changePage1:function () {
        Hide('area_local_health');
        Show('yekaitai_page');
        LMEPG.ButtonManager.requestFocus('wenhuayuan');
    },

    closePage: function () {
        Hide('tongji_medical');
        Hide('yekaitai_page');
        Show('area_local_health');
        // LMEPG.ButtonManager.requestFocus(Page.buttonOutId);
        LMEPG.ButtonManager.requestFocus('tongji_medicine');
    },

    closePage1: function () {
        Hide('informationPage');
        // LMEPG.ButtonManager.requestFocus(Page.buttonInnerId);
        LMEPG.ButtonManager.requestFocus('business');
    },

    jumpTuWen: function (teletextCode) {
        var albumIntent = LMEPG.Intent.createIntent("album");
        albumIntent.setParam("albumName", "TemplateAlbum");
        albumIntent.setParam('graphicCode', teletextCode);
        albumIntent.setParam("inner", 0);
        LMEPG.Intent.jump(albumIntent, LMSplashRouter.splashIntent(), RenderParam.intentType,
            LMEPG.Intent.createIntent("customizeModule",{moduleId:'plate2',isYKT:1}));
    }
};

function onBack() {
    if (isShow('informationPage')) {
        Page.closePage1();
    } else if (isShow('tongji_medical') || isShow('yekaitai_page')) {
        Page.closePage();
    } else {
        LMEPG.Intent.back()
    }
}