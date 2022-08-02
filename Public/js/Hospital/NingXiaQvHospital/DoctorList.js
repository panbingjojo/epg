var buttons = [];
var data = ["1", "2", "3", "4", "5", "6","7","8"];
var MenuList = {
    INDEX: 1,
    MAX_SIZE: 4,
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
                    nextFocusUp: 'list-box-' + (i - 2),
                    nextFocusDown: 'list-box-' + (i + 2),
                    nextFocusLeft: 'list-box-' + (i - 1),
                    nextFocusRight: 'list-box-' + (i + 1),
                    focusChange: MenuList.areaFocus,
                    click: MenuList.onClick,
                    beforeMoveChange: MenuList.switchPage,
                    cIdx: data[MenuList.MAX_SIZE * (MenuList.CURRENT_PAGE - 1) + i - 1],
                }
            )
        }

        for (var i = 1; i < 8; i++) {
            buttons.push(
                {
                    id: "btn-" + i,
                    name: '区域焦点',
                    type: 'img',
                    nextFocusUp: 'btn-' + (i - 1),
                    nextFocusDown: 'btn-' + (i + 1),
                    nextFocusLeft: "",
                    nextFocusRight: "list-box-1",
                    backgroundImage: RenderParam.imagePath + "doctor_btn_"+i+".png",
                    focusImage: RenderParam.imagePath + "doctor_btn_"+i+"_f.png",
                    selectedImage: RenderParam.imagePath + "doctor_btn_"+i+"_select.png",
                    focusChange: MenuList.menuFocus,
                    click: "",
                    groupId: "department",
                    beforeMoveChange: MenuList.switchPage,
                }
            )
        }
        buttons.push(
            {
                id: "back",
                name: '返回',
                type: 'img',
                nextFocusUp: '',
                nextFocusDown: 'btn-1',
                nextFocusLeft: "",
                nextFocusRight: "list-box-1",
                backgroundImage: RenderParam.imagePath + "btn_back.png",
                focusImage: RenderParam.imagePath + "btn_back_f.png",
                focusChange: "",
                click: onBack,
                beforeMoveChange: "",
            })
    },


    onClick: function (btn) {
        G("detail").style.display="block";
    },

    menuFocus: function (btn,has) {
        if (has) {
            if(btn.id=="btn-1"){
                MenuList.CURRENT_PAGE=1;
            } else if(btn.id=="btn-2"){
                MenuList.CURRENT_PAGE=2;
            }
            LMEPG.ButtonManager.setSelected(btn.id, true);
            MenuList.createList();
        } else {

        }
    },

    createList: function () {
        var dom = G("list");
        dom.innerHTML = "";
        var currentData = MenuList.cut(MenuList.CURRENT_DATA, MenuList.CURRENT_PAGE, MenuList.MAX_SIZE);
        var strHtml = "";
        var imgIndex = 0;
        for (var i = 0; i < currentData.length; i++) {
            imgIndex = MenuList.MAX_SIZE * (MenuList.CURRENT_PAGE - 1) + i;
            strHtml += '<div id="list-' + (i + 1) + '">';
            strHtml += '<img class="list-img" src=' + Root + '"/Public/img/hd/Hospital/V1/doctor_' +
                (MenuList.MAX_SIZE * (MenuList.CURRENT_PAGE - 1) + i + 1) + '.png"   />';
            strHtml += '<img data-link="" id="list-box-' + (i + 1) + '" class="list-box" src='+ Root + '"/Public/img/hd/Hospital/V1/doctor_box.png">';
            strHtml += '</div>';
        }
        dom.innerHTML = strHtml;
        //MenuList.upDateArrow();
       // G("page").innerHTML = MenuList.CURRENT_PAGE + "/" + Math.ceil(MenuList.CURRENT_DATA.length / MenuList.MAX_SIZE);
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
        var currentPage = LMEPG.Intent.createIntent("knowledge");
        currentPage.setParam("focusIndex2", LMEPG.BM.getCurrentButton().id);
        currentPage.setParam("pages", MenuList.CURRENT_PAGE);
        return currentPage;
    },

    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName, id) {
        var objCurrent = MenuList.getCurrentPage();
        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('graphicId', id);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objCurrent);
    },

    prevPge: function () {
        if (MenuList.CURRENT_PAGE > 1) {
            MenuList.CURRENT_PAGE--;
            RenderParam.focusIndex =  "list-box-3";
            MenuList.initButton();
            LMEPG.BM.init(MenuList.defaultFocusId, buttons, "", true);
            MenuList.createList();
        }
    },
    nextPge: function () {
        if (MenuList.CURRENT_PAGE < Math.ceil(MenuList.CURRENT_DATA.length / MenuList.MAX_SIZE)) {
            MenuList.CURRENT_PAGE++;
            RenderParam.focusIndex =  "list-box-1";
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
                if ((current.id == "list-box-1" || current.id == "list-box-3")) {
                    //MenuList.prevPge();
                    //LMEPG.BM.requestFocus("list-box-3");
                    LMEPG.BM.requestFocus(LMEPG.BM.getSelectedButton("department").id);
                    return false;
                }
                //else if(current.id == "list-box-1" || current.id == "list-box-3"){
                   // LMEPG.BM.requestFocus(LMEPG.BM.getSelectedButton("department").id);
               // }
                break;
            case "right":
                if(current.id.substring(0,3)=="btn"){
                    LMEPG.ButtonManager.setSelected(current.id, true);
                }
                if (current.id == "list-box-2" || current.id == "list-box-4") {
                    //MenuList.nextPge();
                    LMEPG.BM.requestFocus("list-box-1");
                    return false;
                }
                break;
            case "down":
                if(current.id=="btn-2"){
                    LMEPG.UI.showToast('暂无医生排班！');
                    LMEPG.BM.requestFocus("btn-2");
                    return false;
                }
                return;
            case "up":
                if(current.id=="btn-1"){
                    LMEPG.BM.requestFocus("back");
                    return false;
                }
                return;
            break;
        }
    },
}

function onBack() {
    if(G("detail").style.display=="block"){
        G("detail").style.display="none"
    }else {
        //回到活动界面
        LMEPG.Intent.back();
    }
}