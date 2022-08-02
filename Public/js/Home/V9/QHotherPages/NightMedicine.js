var imgPrefix = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Menu/QHotherPages/V640092/";

var buttons = [{
    id: 'btn-go-inquiry-page',
    type: 'img',
    nextFocusDown: 'btn-area-1',
    click: jumpInquiryPage,
    focusImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/go_inquiry_f.png',
    backgroundImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/go_inquiry.png'
}];
function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent("nightMedicine");
    objCurrent.setParam("userId", RenderParam.userId);
    objCurrent.setParam("inner", RenderParam.inner);
    objCurrent.setParam("focusIndex", 'btn-go-inquiry-page'); // 当前模块只有这个地方涉及到跳转界面
    return objCurrent;
}
function jumpInquiryPage() {
    var objCurrent = getCurrentPage();

    var objDoctorP2P = LMEPG.Intent.createIntent("doctorIndex");
    objDoctorP2P.setParam("userId", RenderParam.userId);
    LMEPG.Intent.jump(objDoctorP2P, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
}
var hdPotion = [1, 70, 150, 200, 200];
var sdPotion = [1, 70, 50, 150, 150];
var MenuList = {
    INDEX: 1,
    MAX_SIZE: 5,
    CURRENT_PAGE: 1,
    CURRENT_DATA: "",
    AREA_CODE: 1,
    SELECT_PAGE: 1,
    STATUS: true,
    initButton: function () {
        for (var i = 1; i < MenuList.MAX_SIZE + 1; i++) {
            buttons.push(
                {
                    id: "btn-area-" + i,
                    name: '区域焦点',
                    type: 'div',
                    nextFocusUp: 'btn-area-' + (i - 1),
                    nextFocusDown: 'btn-area-' + (i + 1),
                    nextFocusRight: 'area-list-1',
                    backgroundImage: imgPrefix + 'area_btn.png',
                    focusImage: imgPrefix + 'area_btn_f.png',
                    selectedImage: imgPrefix + 'area_btn_select.png',
                    focusChange: MenuList.cityFocus,
                    click: MenuList.cityClick,
                    beforeMoveChange: MenuList.switchPage,
                    cIdx: "",
                    groupId: "department",
                }
            )
        }

        for (var i = 1; i < MenuList.MAX_SIZE + 1; i++) {
            buttons.push(
                {
                    id: "area-list-" + i,
                    name: '区域焦点',
                    type: 'div',
                    nextFocusUp: 'area-list-' + (i - 1),
                    nextFocusDown: 'area-list-' + (i + 1),
                    backgroundImage: imgPrefix + 'city.png',
                    focusImage: imgPrefix + 'city_f.png',
                    focusChange: MenuList.areaFocus,
                    click: Shop.enterShop,
                    beforeMoveChange: MenuList.switchPage,
                    cIdx: "",
                }
            )
        }

        buttons.push(
            {
                id: "pharmacy",
                name: '药店',
                type: 'div',
                nextFocusUp: "",
                nextFocusDown: "",
                backgroundImage: imgPrefix + 'main.png',
                focusImage: imgPrefix + 'main_f.png',
                focusChange: "",
                click: MenuList.onClickOrder,
                beforeMoveChange: MenuList.switchPage,
                cIdx: "",
            }
        )
    },


    cityClick: function (btn) {
        var index = G(btn.id).getAttribute("data-link");
        MenuList.INDEX = index;
        var areaFlag = MenuList.createArea(index);
        if (RenderParam.platformType == "hd") {
            G("area-list").style.top = hdPotion[parseInt(btn.id.substring(9, 11)) - 1] + "px";
        } else {
            G("area-list").style.top = sdPotion[parseInt(btn.id.substring(9, 11)) - 1] + "px";
        }
        var currentId = LMEPG.BM.getSelectedButton("department").id;
        MenuList.SELECT_PAGE = MenuList.CURRENT_PAGE;
        try {
            G(currentId).style.color = "#fff";
        } catch (e) {

        }


        LMEPG.ButtonManager.setSelected(btn.id, true);
        if (areaFlag) {
            G(btn.id).style.color = "#1093ff";
            LMEPG.BM.requestFocus("area-list-1");
        }
        G(btn.id).style.color = "#fff";
        G(btn.id).style.backgroundImage = 'url(' + imgPrefix + 'area_btn_f.png)';

    },
    cityFocus: function (btn, has) {
        if (has) {
            if (LMEPG.BM.getSelectedButton("department").id == btn.id) {
                if (MenuList.SELECT_PAGE == MenuList.CURRENT_PAGE) {
                    G(btn.id).style.color = "#fff";
                } else {
                    // G(btn.id).style.backgroundImage='url('+imgPrefix + 'area_btn.png)';
                }
            }
            G("area-list").innerHTML = "";
        } else {
            if (LMEPG.BM.getSelectedButton("department").id == btn.id) {
                if (MenuList.SELECT_PAGE == MenuList.CURRENT_PAGE) {
                    G(btn.id).style.color = "#1093ff";
                    G(btn.id).style.backgroundImage = 'url(' + imgPrefix + 'area_btn_select.png)';
                } else {
                    G(btn.id).style.backgroundImage = 'url(' + imgPrefix + 'area_btn.png)';
                }
            } else {
                G(btn.id).style.color = "#fff";
            }
        }
    },

    onClickOrder: function () {
    },
    createCity: function () {
        var dom = G("city-list");
        dom.innerHTML = "";
        var currentData = MenuList.cut(MenuList.CURRENT_DATA, MenuList.CURRENT_PAGE, MenuList.MAX_SIZE);
        var strHtml = "";
        for (var i = 0; i < currentData.length; i++) {
            strHtml += '<div id="btn-area-' + (i + 1) + '" class="btn-area" style="position: relative"  data-link="' + currentData[i].city_code + '">' + currentData[i].city_name + '<img class="more" src="' + imgPrefix + 'more.png"/></div>'
        }
        dom.innerHTML = strHtml;
        MenuList.upDateArrow();
    },

    areaFocus: function (btn, has) {
        if (has) {
            G(btn.id).style.color = "#1093ff";
            G(btn.id).style.fontWeight = "bold";
        } else {
            G(btn.id).style.color = "#fff";
            G(btn.id).style.fontWeight = "normal";
        }
    },

    createArea: function (index) {
        var dom = G("area-list");
        dom.innerHTML = "";
        for (var j = 0; j < MenuList.CURRENT_DATA.length; j++) {
            if (parseInt(MenuList.CURRENT_DATA[j].city_code) == index) {
                var areaList = MenuList.CURRENT_DATA[j];
            }
        }
        // alert(areaList);
        // var areaList = MenuList.CURRENT_DATA.find(function (item) {
        //     return parseInt(item.city_code) == index;
        // })
        var currentData = MenuList.cut(areaList.list, 1, 5);
        var strHtml = "";
        for (var i = 0; i < currentData.length; i++) {
            strHtml += '<div id="area-list-' + (i + 1) + '" class="area" data-link="' + currentData[i].area_code + '">' + currentData[i].area_name + '</div>'
        }
        dom.innerHTML = strHtml;
        if (areaList.list == "") {
            Shop.getShop(MenuList.INDEX, "")
            return false;
        } else {
            return true;
        }
    },
    init: function (data) {
        MenuList.CURRENT_DATA = data;
        MenuList.initButton();
        MenuList.createCity();
        Shop.getShop(G("btn-area-1").getAttribute("data-link"), "");
    },

    cut: function (data, page, max) {
        return data.slice((page - 1) * max, max * page);
    },

    prevPge: function () {
        if (MenuList.CURRENT_PAGE > 1) {
            MenuList.CURRENT_PAGE--;
            MenuList.createCity();
            var currentId = LMEPG.BM.getSelectedButton("department").id;
            if (MenuList.SELECT_PAGE == MenuList.CURRENT_PAGE) {
                G(currentId).style.color = "#1093ff";
                G(currentId).style.backgroundImage = 'url(' + imgPrefix + 'area_btn_select.png)';
            }
            LMEPG.BM.requestFocus("btn-area-5");
        } else {
            LMEPG.BM.requestFocus("btn-go-inquiry-page");
        }
    },
    nextPge: function () {
        if (MenuList.CURRENT_PAGE < Math.ceil(MenuList.CURRENT_DATA.length / MenuList.MAX_SIZE)) {
            MenuList.CURRENT_PAGE++;
            MenuList.createCity();
            var currentId = LMEPG.BM.getSelectedButton("department").id;
            if (MenuList.SELECT_PAGE == MenuList.CURRENT_PAGE) {
                G(currentId).style.color = "#1093ff";
                G(currentId).style.backgroundImage = 'url(' + imgPrefix + 'area_btn_select.png)';
            }
        }
    },
    /**
     * 跳转 -- 订购页
     * @param remark        订购来源（标示）
     * @param videoInfo     如果视频正在播放，播放视频的信息。
     * @param singlePayItem 是否是单订购
     */
    jumpBuyVip: function () {
        var objHome = getCurrentPage();
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objOrderHome, objHome, LMEPG.Intent.INTENT_FLAG_DEFAULT);
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
            case "up":
                if (current.id == "btn-area-1") {
                    MenuList.prevPge();
                    return false;
                } else if (current.id == "pharmacy") {
                    Shop.prevPge();
                }
                break;
            case "down":
                if (current.id == "btn-area-5") {
                    MenuList.nextPge();
                    LMEPG.BM.requestFocus("btn-area-1");
                } else if (current.id == "pharmacy") {
                    Shop.nextPge();
                }
                break;
            case "left":
                if (current.id.substring(0, 9) == "area-list" || current.id == "pharmacy") {
                    var currentId = LMEPG.BM.getSelectedButton("department").id;
                    LMEPG.BM.requestFocus(currentId);

                }
                break;
            case "right":
                if (current.id.substring(0, 8) == "btn-area") {
                    if (G("area-list").innerHTML == "") {
                        var index = G(current.id).getAttribute("data-link");
                        MenuList.INDEX = index;
                        var areaFlag = MenuList.createArea(index);
                        if (RenderParam.platformType == "hd") {
                            G("area-list").style.top = hdPotion[parseInt(current.id.substring(9, 11)) - 1] + "px";
                        } else {
                            G("area-list").style.top = sdPotion[parseInt(current.id.substring(9, 11)) - 1] + "px";
                        }
                        var currentId = LMEPG.BM.getSelectedButton("department").id;
                        MenuList.SELECT_PAGE = MenuList.CURRENT_PAGE;
                        try {
                            G(currentId).style.color = "#fff";
                        } catch (e) {

                        }

                        LMEPG.ButtonManager.setSelected(current.id, true);
                        if (areaFlag) {
                            G(current.id).style.color = "#1093ff";
                            LMEPG.BM.requestFocus("area-list-1");
                        }
                        G(current.id).style.color = "#fff";
                        G(current.id).style.backgroundImage = 'url(' + imgPrefix + 'area_btn_f.png)';
                    }
                }
                // LMEPG.BM.requestFocus("pharmacy");
                break;
        }
    },
}

var Shop = {
    SHOP_PAGE: 1,
    SHOP_DATA: "",
    createShop: function () {
        var dom = G("intro-info");
        dom.innerHTML = "";
        var currentData = Shop.SHOP_DATA[Shop.SHOP_PAGE - 1];
        var strHtml = "";
        strHtml += '<div id="name">' + currentData.phar_name + '</div> <hr/>';
        strHtml += ' <div class="row"><img class="icon" src="' + imgPrefix + 'icon_address.png"/>&nbsp;&nbsp;';
        strHtml += '<span id="address">' + currentData.phar_addr + '</span></div>';
        strHtml += ' <div class="row"><img class="icon" src="' + imgPrefix + 'icon_tel.png"/>&nbsp;&nbsp;';
        strHtml += ' <span id="tel">' + currentData.phar_tel + '</span> </div>';
        strHtml += '<div class="row"><img class="icon" src="' + imgPrefix + 'icon_time.png"/>&nbsp;&nbsp;';
        strHtml += ' <span id="time">' + currentData.bus_time + '</span> </div> ';
        dom.innerHTML = strHtml;
        var QR_Url = RenderParam.fsUrl + currentData.phar_qrcode_addr;
        LMEPG.Log.debug("create Shop QR url >>> " + QR_Url);
        if (RenderParam.carrierId == '640094') { //宁夏广电屏蔽二维码
            G("code").src = RenderParam.imgPath + 'img_drugstore.jpg';
        } else {
            G("code").src = RenderParam.fsUrl + currentData.phar_qrcode_addr;
        }
        G("page-index").innerHTML = Shop.SHOP_PAGE + "/" + Shop.SHOP_DATA.length;
        Shop.upDateArrow()
    },


    enterShop: function (btn) {
        var areaCode = G(btn.id).getAttribute("data-link");
        Shop.SHOP_PAGE = 1;
        MenuList.AREA_CODE = areaCode;
        var currentId = LMEPG.BM.getSelectedButton("department").id;
        G(currentId).style.color = "#1093ff";
        G(currentId).style.backgroundImage = 'url(' + imgPrefix + 'area_btn_select.png)';

        Shop.getShop(MenuList.INDEX, MenuList.AREA_CODE)
        var dom = G("area-list");
        dom.innerHTML = "";
        MenuList.STATUS = false;

        LMEPG.BM.requestFocus("pharmacy");
    },


    //    拉取商店
    getShop: function (city, area) {
        LMEPG.UI.showWaitingDialog();
        var reqData = {
            "cityCode": city,
            "areaCode": area,
            "curPage": Shop.SHOP_PAGE
        };
        LMEPG.ajax.postAPI('NewActivity/getCityOfArea', reqData,
            function (rsp) {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                try {
                    if (data.result == 0) {
                        Shop.SHOP_DATA = data.list
                        Shop.createShop();
                        LMEPG.UI.dismissWaitingDialog();
                    } else {
                        LMEPG.UI.showToast('药店信息为空！');
                        LMEPG.UI.dismissWaitingDialog();
                    }
                } catch (e) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("拉取解析异常!" + e);
                }
            },
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("拉取请求失败!");
            }
        );
    },


    prevPge: function () {
        if (Shop.SHOP_PAGE > 1) {
            Shop.SHOP_PAGE--;
            Shop.createShop();
        }
    },
    nextPge: function () {
        if (Shop.SHOP_PAGE < Shop.SHOP_DATA.length) {
            Shop.SHOP_PAGE++;
            if (Shop.SHOP_PAGE > 5 && RenderParam.isVip == "0") {
                LMEPG.UI.commonDialog.show("订购成为VIP即可查看全部药房信息", ["确定", "取消"], function (index) {
                    if (index === 0) {
                        MenuList.jumpBuyVip();
                    }
                });
                return;
            }
            Shop.createShop();
        }
    },

    upDateArrow: function () {
        if (Shop.SHOP_DATA.length - Shop.SHOP_PAGE >= 1) {
            G("next-arrow").style.display = "block";
        } else {
            G("next-arrow").style.display = "none";
        }

        if (Shop.SHOP_PAGE > 1) {
            G("prev-arrow").style.display = "block";
        } else {
            G("prev-arrow").style.display = "none";
        }
    },

}

/**
 * 返回事件
 */
function onBack() {
    if (G("area-list").innerHTML == "") {
        LMEPG.Intent.back();
    } else {
        G("area-list").innerHTML = "";
        var currentId = LMEPG.BM.getSelectedButton("department").id;
        LMEPG.BM.requestFocus(currentId);
    }
}