var buttons = [];

var _album = ['GraphicAlbum_3','fy19','fy20','fy21','fy66','fy67','fy99','fy100',
    'fy74','fy103','GraphicAlbum_10','GraphicAlbum_13','fy128','fy127','fy125',
    'GraphicAlbum_6','GraphicAlbum_14','GraphicAlbum_16','GraphicAlbum_17','GraphicAlbum_18','GraphicAlbum_19',
    'GraphicAlbum_20','GraphicAlbum_21','GraphicAlbum_22','GraphicAlbum_23','GraphicAlbum_25','GraphicAlbum_26',
    'fy222','fy217','fy237','fy238','fy239','fy240','fy241'];


var MenuList = {
    INDEX: 1,
    MAX_SIZE: 6,
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
                    cIdx: _album[MenuList.MAX_SIZE * (MenuList.CURRENT_PAGE - 1) + i - 1]
                }
            )
        }
    },

/*
    onClick: function (btn) {

        var id = G(btn.id).getAttribute("data-link");
        MenuList.jumpAlbumPage(btn.cIdx, id);
    },*/

    createList: function () {
        var dom = G("list");
        dom.innerHTML = "";
        var currentData = MenuList.cut(MenuList.CURRENT_DATA, MenuList.CURRENT_PAGE, MenuList.MAX_SIZE);
        var strHtml = "";
        var imgIndex = 0;
        for (var i = 0; i < currentData.length; i++) {
            imgIndex = MenuList.MAX_SIZE * (MenuList.CURRENT_PAGE - 1) + i;
            strHtml += '<div id="list-' + (i + 1) + '">';
            strHtml += '<img class="list-img" src=' + Root + '"/Public/img/hd/OutbreakReport/List2/img_' +
                (MenuList.MAX_SIZE * (MenuList.CURRENT_PAGE - 1) + (i + 1)) + '.png"   />';
            strHtml += '<img id="list-box-' + (i + 1) + '" class="list-box" src=' + Root + '"/Public/img/hd/OutbreakReport/V1/box.png"  />';
            strHtml += '</div>';
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

    init: function (data) {
        MenuList.CURRENT_DATA = data;
        MenuList.initButton();
        LMEPG.BM.init(MenuList.defaultFocusId, buttons, "", true);
        MenuList.createList();
    },

    cut: function (data, page, max) {
        return data.slice((page - 1) * max, max * page);
    },

    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("treatment");
        currentPage.setParam("focusIndex2", LMEPG.BM.getCurrentButton().id);
        currentPage.setParam("pages", MenuList.CURRENT_PAGE);
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
        if (btn.cIdx.indexOf('GraphicAlbum') > -1 || btn.cIdx.indexOf('album') > -1) {
            albumString = btn.cIdx;
        }

        objAlbum.setParam('albumName', albumString);
        objAlbum.setParam('graphicCode', albumString === 'TemplateAlbum' ? btn.cIdx : 0);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objCurrent);
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