/**
 * 返回确认
 */
function onBack() {
    if (isShow('informationPage')){
        closePage()
    }else {
        LMEPG.Intent.back();
    }
}
/**
 * 获取当前页对象
 */
function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent("customizeModule");
    objCurrent.setParam("focusIndex", LMEPG.BM.getCurrentButton().id)
    objCurrent.setParam('moduleId','plate1')
    return objCurrent;
}

function closePage () {
    Hide('informationPage');
    LMEPG.ButtonManager.requestFocus('recommended-1');
}

/**
 * 跳转到弹框页
 */
function jumpRout(text) {
    var objCurrent = getCurrentPage();
    var objDialog = LMEPG.Intent.createIntent(text);
    LMEPG.Intent.jump(objDialog, objCurrent);
}

/**
 * 跳转到弹框页
 */
function jumpEye() {
    var objCurrent = getCurrentPage();
    var objDialog = LMEPG.Intent.createIntent("experts-introduce");
    LMEPG.Intent.jump(objDialog, objCurrent);
}
var Data = {
    // 通过接口拉取数据，进行数据填充并渲染
    imgInfo: RenderParam.moduleConfig.bg_img,
    dataInfo: RenderParam.moduleConfig.entry_list,
    videoList: RenderParam.moduleConfig.entry_list.P6.item_data,
};
var videoParameters = [];
var videoImg = [];
var paramInfo = [];
var recommended2 =  JSON.parse(Data.dataInfo.P2.item_data[0].parameters)[0].param
var recommended3 = Data.dataInfo.P3.item_data
var recommended4 =  JSON.parse(Data.dataInfo.P4.item_data[0].parameters)[0].param

var buttons = [];

var Pages = {
    imgUrl:  RenderParam.fsUrl,
    classType: ["focus", "carousel", "album2"],
    init: function () {
        Pages.initRecommendedBtn();
        Pages.initAlbum();
        LMEPG.ButtonManager.init(RenderParam.focusIndex, buttons, "", true);
        Animal.getSlideshowList();
        Pages.getAlbum(Data.videoList);
        Pages.renderAlbumList(videoImg);
        Pages.renderRecommend();
        Animal.initBottom();
        Animal.timeOut();
    },
    initRecommendedBtn: function () {
        buttons.push({
            id: 'recommended-1',
            name: '',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommended-3',
            nextFocusUp: '',
            nextFocusDown: 'recommended-4',
            click: Pages.btnClick,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: "",
            cType: 0,
        })
        buttons.push({
            id: 'recommended-3',
            name: '',
            type: 'img',
            nextFocusLeft: 'recommended-1',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommended-5',
            click: Pages.jumpGraphicAlbum,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: "",
            cType: 0,
            recommended: '4',
        })
        buttons.push({
            id: 'recommended-4',
            name: '',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'recommended-5',
            nextFocusUp: 'recommended-1',
            nextFocusDown: 'album-1',
            click: Pages.jumpGraphicAlbum,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: "",
            cType: 0,
            recommended: '2',
        })
        buttons.push({
            id: 'recommended-5',
            name: '',
            type: 'img',
            nextFocusLeft: 'recommended-4',
            nextFocusRight: '',
            nextFocusUp: 'recommended-3',
            nextFocusDown: 'album-1',
            click: Pages.jumpHealthVideoHome,
            focusChange: Pages.btnFocus,
            moveChange: "",
            cIdx: "",
            cType: 0,
        })
        buttons.push({
            id: 'contentBox',
            name: '介绍文本框',
            type: 'div',
        })
    },
    initAlbum: function () {
        for (var i = 1; i < 5; i++) {
            buttons.push({
                id: 'album-' + i,
                name: '',
                type: 'img',
                nextFocusLeft: 'album-' + (i - 1),
                nextFocusRight: 'album-' + (i + 1),
                nextFocusUp: 'recommended-4',
                nextFocusDown: '',
                click: Pages.judgeJumpType,
                focusChange: Pages.btnFocus,
                moveChange: "",
                cIdx: i,
                cType: 2,
            })
        }
    },

    renderRecommend: function () {
        G('recommended-4').src = Pages.imgUrl + JSON.parse(Data.dataInfo.P2.item_data[0].img_url).normal
    },


    getAlbum: function (ele){
        for (var item in ele){
            paramInfo.push(JSON.parse(ele[item].parameters)[0].param)
            videoParameters.push(JSON.parse(ele[item].inner_parameters))
            videoImg.push(JSON.parse(ele[item].img_url).normal)
        }
    },

    /**
     * 渲染下面四个视频
     * */
    renderAlbumList: function (lens){
        for (var i =0;i<lens.length;i++) {
            G('album-'+(i+1)).src = Pages.imgUrl + videoImg[i]
        }
    },

    btnFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, Pages.classType[btn.cType]);
        } else {
            LMEPG.CssManager.removeClass(btn.id, Pages.classType[btn.cType]);
        }
    },
    btnClick: function (btn) {
        if (btn.id == "recommended-1") {
            G('informationPage').style.display = 'block';
            LMEPG.BM.requestFocus('contentBox');
            return;
        }else if (btn.id == 'recommended-3') {
            Pages.jumpGraphicColumn()
        }
    },

    /**P2，P4图文专辑*/
    jumpGraphicAlbum: function (btn) {
        var albumName = (btn.recommended == '2')?recommended2:recommended4;
        var objHome = getCurrentPage();

        var objHealthSubmit = LMEPG.Intent.createIntent('album');
        objHome.setParam('albumName', albumName);
        objHealthSubmit.setParam('userId', "{$userId}");
        objHealthSubmit.setParam('albumName', albumName);
        objHealthSubmit.setParam('inner', 1);

        LMEPG.Intent.jump(objHealthSubmit, objHome);
    },

    /**P6推荐位图文专辑、UI专辑*/
    jumpAlbum: function (btn) {
        var albumName = JSON.parse(Data.videoList[btn.cIdx-1].parameters)[0].param;
        var objHome = getCurrentPage();

        var objHealthSubmit = LMEPG.Intent.createIntent('album');
        objHome.setParam('albumName', albumName);
        objHealthSubmit.setParam('userId', "{$userId}");
        objHealthSubmit.setParam('albumName', albumName);
        objHealthSubmit.setParam('inner', 1);

        LMEPG.Intent.jump(objHealthSubmit, objHome);
    },

    /**
     * 跳转 -- 图文详情
     * @param graphicId 图文ID
     */
    jumpGraphicDetail: function (btn) {
        var albumName = JSON.parse(Data.videoList[btn.cIdx-1].parameters)[0].param;
        var objHome = getCurrentPage();

        var objGraphic = LMEPG.Intent.createIntent("album");
        objGraphic.setParam('albumName', 'TemplateAlbum');
        objGraphic.setParam('graphicId', albumName);

        LMEPG.Intent.jump(objGraphic, objHome);
    },

    /**判断跳转类型*/
    judgeJumpType: function (btn) {
        debugger
        var type = Data.videoList[(btn.cIdx-1)].entry_type
        switch (type){
            case '5':
                //跳转单个视频
                Pages.parseVideoInfo(btn);
                break;
            case '34':
                //跳转视频集
                Pages.jumpVideoListPage(btn)
                break;
            case '33':
            case '39':
                //跳转图文专辑/UI专辑
                Pages.jumpAlbum(btn)
                break;
            case '43':
                //跳转单集图文
                Pages.jumpGraphicDetail(btn)
                break;
        }
    },

    /**跳转到视频集*/
    jumpVideoListPage: function (btn) {
        var objHome = getCurrentPage();
        var albumName = JSON.parse(Data.videoList[btn.cIdx-1].parameters)[0].param;

        var objDst = LMEPG.Intent.createIntent('channelList');
        objDst.setParam('subject_id', albumName);
        LMEPG.Intent.jump(objDst, objHome);
    },

    /**跳转到视频*/
    parseVideoInfo: function (btn) {
        var videoInfo = videoParameters[(btn.cIdx) - 1];
        var param = paramInfo[(btn.cIdx) - 1];
        var videoParams = {
            'sourceId': param,
            'videoUrl': videoInfo.ftp_url.gq_ftp_url,
            'title': videoInfo.title,
            'type':videoInfo.model_type,
            'entryType': 4,
            'entryTypeName': 'experts-introduce',
            'userType': videoInfo.user_type,
            'freeSeconds': videoInfo.free_seconds,
            'focusIdx': LMEPG.BM.getCurrentButton().id,
            'unionCode': videoInfo.union_code,
            'duration': videoInfo.duration,
            'show_status': videoInfo.show_status,
        };
        Pages.playVideo(videoParams);
    },

    playVideo: function (videoParams) {
        var objCurrent = getCurrentPage();
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('videoInfo', JSON.stringify(videoParams));
        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    /**
     * 跳转 -- 更多视频页
     */
    jumpHealthVideoHome: function () {
        var objHome = getCurrentPage();
        objHome.setParam("fromId", "2");

        var objChannel = LMEPG.Intent.createIntent("healthVideoList");
        objHome.setParam("userId", "{$userId}");
        objChannel.setParam("page", typeof (page) === "undefined" ? "1" : page);
        objChannel.setParam("modeTitle", "科普馆游记");
        objChannel.setParam("modelType", 26);
        LMEPG.Intent.jump(objChannel, objHome);

    },

}

var Animal = {
    slideshow: Data.dataInfo.P3.item_data,
    index: 0,
    timer: null,
    temp: [],
    lens: recommended3.length,
    getSlideshowList: function (){
        for (var item in Animal.slideshow){
            var ele = Animal.slideshow[item]
            var imgs = JSON.parse(ele.img_url).normal
            Animal.temp.push(imgs)
        }
    },

    timeOut: function () {
        Pages.timer = setInterval(function () {
            Animal.nextBlock()
        }, 3000)
    },
    initBottom: function () {
        for (var i = 1; i < (Animal.lens)+1; i++) {
            G('bottom').innerHTML += '<div id="' + 'carousel-focus-radius-' + i + '"></div>';
            G("carousel-focus-radius-" + i).className = "radius withe"
        }
        G('carousel-focus-radius-1').className = "radius blue";
    },
    nextBlock: function () {

        if (Animal.index < Animal.lens) {
            Animal.index++;
        } else {
            Animal.index = 1;
        }
        for (var i = 1; i < (Animal.lens)+1; i++) {
            G("carousel-focus-radius-" + i).className = "radius withe";
        }
        G("carousel-focus-radius-" + Animal.index).className = "radius blue";
        G("recommended-2").src = Pages.imgUrl + Animal.temp[(Animal.index-1)];
    }
}


