var buttons = [];
var _album = ['album230', "GraphicAlbum_2",
    'fy10', 'fy22', 'fy62', 'fy63', 'fy65', 'fy103',
    'GraphicAlbum_7', 'GraphicAlbum_8', 'GraphicAlbum_9', 'GraphicAlbum_11', 'GraphicAlbum_12',
    'fy126', 'fy124', 'fy123',
    'GraphicAlbum_4', 'GraphicAlbum_5', 'GraphicAlbum_15', 'GraphicAlbum_24',
    'fy221', 'fy219', 'fy218', 'fy220'];
var _album1 = ['fy417','GraphicAlbum_31', "fy403",
    'fy404', 'fy405', 'fy406', 'fy407', 'fy408'];
var _album2 = ['GraphicAlbum_3','fy19','fy20','fy21','fy66','fy67','fy99','fy100',
    'fy74','fy103','GraphicAlbum_10','GraphicAlbum_13','fy128','fy127','fy125',
    'GraphicAlbum_6','GraphicAlbum_14','GraphicAlbum_16','GraphicAlbum_17','GraphicAlbum_18','GraphicAlbum_19',
    'GraphicAlbum_20','GraphicAlbum_21','GraphicAlbum_22','GraphicAlbum_23','GraphicAlbum_25','GraphicAlbum_26',
    'fy222','fy217','fy237','fy238','fy239','fy240','fy241'];
_album=_album.concat(_album2);

var MenuList = {
    INDEX: 1,
    MAX_SIZE: 6,
    //当前焦点ID-RenderParam.pages
    CURRENT_PAGE: parseInt(RenderParam.pages),
    CURRENT_DATA: "",
    defaultFocusId: RenderParam.focusIndex,
    initButton: function () {
        buttons.length = 0;
        for (var i = 1; i < MenuList.MAX_SIZE + 1; i++) {
            buttons.push(
                {
                    id: "list-box-" + i,
                    name: '区域焦点',
                    type: 'div',
                    nextFocusUp: 'list-box-' + (i - 3),
                    nextFocusDown: 'list-box-' + (i + 3),
                    nextFocusLeft: 'list-box-' + (i - 1),
                    nextFocusRight: 'list-box-' + (i + 1),
                    focusChange: MenuList.areaFocus,
                    click: MenuList.jumpAlbumPage,
                    beforeMoveChange: MenuList.switchPage,
                    cIdx: RenderParam.type == 0 ? _album[MenuList.MAX_SIZE * (MenuList.CURRENT_PAGE - 1) + i - 1] : _album1[MenuList.MAX_SIZE * (MenuList.CURRENT_PAGE - 1) + i - 1]
                }
            )
        }
    },
    createList: function () {
        var dom = G("list");
        dom.innerHTML = "";
        var currentData = MenuList.cut(MenuList.CURRENT_DATA, MenuList.CURRENT_PAGE, MenuList.MAX_SIZE);
        var strHtml = "";
        var imgIndex = 0;

        if (RenderParam.carrierId=='220094' || RenderParam.carrierId == '220095') {
            for (var i = 0; i < currentData.length; i++) {
                imgIndex = MenuList.MAX_SIZE * (MenuList.CURRENT_PAGE - 1) + i;

                var imageName = 'img_'+imgIndex;
                var imagesSrc;
                var imagesSrc1= "/Public/img/hd/OutbreakReport/List1/";
                var imagesSrc2= "/Public/img/hd/OutbreakReport/List2/";
                if (imgIndex<=24){
                    imagesSrc= imagesSrc1;
                }else {
                    imagesSrc= imagesSrc2;
                    imageName='img_'+(imgIndex-24);
                }
                if(RenderParam.type == 1){
                    imageName = MenuList.CURRENT_DATA[imgIndex];
                }
                if (RenderParam.carrierId === '620007' && imgIndex === 0) {
                    imageName = 'img_video_'+(imgIndex + 1);
                }
                if ((RenderParam.carrierId === '370002' || RenderParam.carrierId === '370092' || RenderParam.carrierId === '450001')
                    && imageName.slice(0, 3) === 'img') {
                    if (imgIndex === 23) {
                        imageName = imageName.slice(0, imageName.search(/\d/)) + 1;
                        imagesSrc= imagesSrc2;
                    } else {
                        imageName = imageName.slice(0, imageName.search(/\d/)) + (parseInt(imageName.slice(imageName.search(/\d/), imageName.length)) + 1);
                    }
                }
                strHtml += '<div id="list-' + (i + 1) + '">';
                // strHtml += '<img class="list-img" src=' + Root + '"/Public/img/hd/OutbreakReport/List1/' +
                //     imageName + '.png"   />';
                strHtml += '<img class="list-img" src="' + Root + imagesSrc +
                    imageName + '.png"   />';
                strHtml += '<img id="list-box-' + (i + 1) + '" class="list-box" src=' + Root + '/Public/img/hd/OutbreakReport/V1/box.png  />';
                strHtml += '</div>';
            }
        }
        else {
            for (var i = 0; i < currentData.length; i++) {
                imgIndex = MenuList.MAX_SIZE * (MenuList.CURRENT_PAGE - 1) + i;

                var imageName = 'img_'+(imgIndex+1);
                var imagesSrc;
                var imagesSrc1= "/Public/img/hd/OutbreakReport/List1/";
                var imagesSrc2= "/Public/img/hd/OutbreakReport/List2/";
                if (imgIndex<=23){
                    imagesSrc= imagesSrc1;
                }else {
                    imagesSrc= imagesSrc2;
                    imageName='img_'+(imgIndex-23);
                }
                if(RenderParam.type == 1){
                    imageName = MenuList.CURRENT_DATA[imgIndex];
                }
                if (RenderParam.carrierId === '620007' && imgIndex === 0) {
                    imageName = 'img_video_'+(imgIndex + 1);
                }
                if ((RenderParam.carrierId === '370002' || RenderParam.carrierId === '370092' || RenderParam.carrierId === '450001')
                    && imageName.slice(0, 3) === 'img') {
                    if (imgIndex === 23) {
                        imageName = imageName.slice(0, imageName.search(/\d/)) + 1;
                        imagesSrc= imagesSrc2;
                    } else {
                        imageName = imageName.slice(0, imageName.search(/\d/)) + (parseInt(imageName.slice(imageName.search(/\d/), imageName.length)) + 1);
                    }
                }
                strHtml += '<div id="list-' + (i + 1) + '">';
                // strHtml += '<img class="list-img" src=' + Root + '"/Public/img/hd/OutbreakReport/List1/' +
                //     imageName + '.png"   />';
                strHtml += '<img class="list-img" src="' + Root + imagesSrc +
                    imageName + '.png"   />';
                strHtml += '<img id="list-box-' + (i + 1) + '" class="list-box" src=' + Root + '/Public/img/hd/OutbreakReport/V1/box.png  />';
                strHtml += '</div>';
            }
        }
        dom.innerHTML = strHtml;
        G(RenderParam.focusIndex).style.display = "block";
        MenuList.upDateArrow();
        G("page").innerHTML = MenuList.CURRENT_PAGE + "/" + Math.ceil(MenuList.CURRENT_DATA.length / MenuList.MAX_SIZE);
    },

    areaFocus: function (btn, has) {
        if (has) {
            G(btn.id).style.display = "block";
        } else {
            G(btn.id).style.display = "none";
        }
    },

    init: function () {
        if (RenderParam.carrierId === '370002' || RenderParam.carrierId === '370092' || RenderParam.carrierId === '450001') {
            _album.shift();
        }
        if(RenderParam.type == 0){
            MenuList.CURRENT_DATA = _album;
        }else{
            G('title-name').innerHTML = '新冠疫苗接种常识';
            MenuList.CURRENT_DATA = _album1;
        }
        if (RenderParam.carrierId === '620007') {
            _album[0] = 'video_10841';
        }
        if (RenderParam.carrierId=='220094' || RenderParam.carrierId == '220095') {
            _album.unshift('GraphicAlbum_35')
        }
        MenuList.initButton();
        LMEPG.BM.init(MenuList.defaultFocusId, buttons, "", true);
        MenuList.createList();
    },

    //截取要显示的六个窗口的数据
    cut: function (data, page, max) {
        return data.slice((page - 1) * max, max * page);
    },

    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("knowledge");
        currentPage.setParam("focusIndex2", LMEPG.BM.getCurrentButton().id);
        currentPage.setParam("pages", MenuList.CURRENT_PAGE);
        currentPage.setParam("type", RenderParam.type);
        return currentPage;
    },

    /**
     * 跳转 -- 专辑页面
     * @param btn
     */
    jumpAlbumPage: function (btn) {
        var objCurrent = MenuList.getCurrentPage();
        var objAlbum = LMEPG.Intent.createIntent('album');
        var albumString = 'TemplateAlbum';

        if (btn.cIdx.indexOf('video') > -1) {
            MenuList.jumpPlayVideo();
            return;
        }

        if (btn.cIdx.indexOf('GraphicAlbum') > -1 || btn.cIdx.indexOf('album') > -1) {
            albumString = btn.cIdx;
        }

        objAlbum.setParam('albumName', albumString);
        objAlbum.setParam('graphicCode', albumString === 'TemplateAlbum' ? btn.cIdx : 0);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objCurrent);
    },

    /**
     * 跳转到视频播放页，播放结束时返回到首页
     * @param data 视频信息
     */
    jumpPlayVideo: function () {
        // 创建视频信息
        var videoInfo = {
            'videoUrl': RenderParam.platformType == 'hd' ? '4005509037' : '4005509037',
            'sourceId': '10841',
            'title': '对抗来势汹汹的流感',
            'type': 4,
            'userType': '2',
            'freeSeconds': '0',
            'entryType': 2,
            'entryTypeName': '疫情专区',
            'unionCode': '2909384'
        };
        LMEPG.ajax.postAPI("Player/storeVideoInfo", {"videoInfo": JSON.stringify(videoInfo)}, function () {
            var objCurrent = MenuList.getCurrentPage(); //得到当前页
            var objPlayer = LMEPG.Intent.createIntent('player');
            objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));
            LMEPG.Intent.jump(objPlayer, objCurrent);
        }, function () {
            LMEPG.UI.showToast("视频参数错误");
        });
    },

    prevPge: function () {
        if (MenuList.CURRENT_PAGE > 1) {
            MenuList.CURRENT_PAGE--;
            RenderParam.focusIndex = "list-box-3";
            MenuList.initButton();
            LMEPG.BM.init(MenuList.defaultFocusId, buttons, "", true);
            MenuList.createList();
        }
    },
    nextPge: function () {
        if (MenuList.CURRENT_PAGE < Math.ceil(MenuList.CURRENT_DATA.length / MenuList.MAX_SIZE)) {
            MenuList.CURRENT_PAGE++;
            RenderParam.focusIndex = "list-box-1";
            MenuList.initButton();
            LMEPG.BM.init(MenuList.defaultFocusId, buttons, "", true);
            MenuList.createList();
        }
    },

    upDateArrow: function () {
        if (Math.ceil(MenuList.CURRENT_DATA.length / MenuList.MAX_SIZE) - MenuList.CURRENT_PAGE >= 1) {
            G("area-next-arrow").style.display = "block";
        } else {
            G("area-next-arrow").style.display = "none";
        }

        if (MenuList.CURRENT_PAGE > 1) {
            G("area-prev-arrow").style.display = "block";
        } else {
            G("area-prev-arrow").style.display = "none";
        }
    },


    switchPage: function (dir, current) {
        switch (dir) {

            case "left":
                if (current.id == "list-box-1" || current.id == "list-box-4") {
                    MenuList.prevPge();
                    LMEPG.BM.requestFocus("list-box-3");
                    return false;
                }
                break;
            case "right":
                if (current.id == "list-box-3" || current.id == "list-box-6") {
                    MenuList.nextPge();
                    LMEPG.BM.requestFocus("list-box-1");
                    return false;
                }
                break;
        }
    }
}

function onBack() {
    LMEPG.Intent.back()
}