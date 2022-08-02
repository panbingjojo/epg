var imgPrefix = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Menu/QHotherPages/V640092/";
var imgbg = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Menu/QHotherPages/";

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

var controlFocus;
var hdPotion = [1, 70, 150, 200, 200];
var sdPotion = [1, 70, 50, 150, 150];
var MenuList = {
    INDEX: 1,
    ISONEPAGE:1 ,
    MAX_SIZE: 5,
    CURRENT_PAGE: 1,
    CURRENT_DATA: "",
    AREA_CODE: 1,
    SELECT_PAGE: 1,
    SELECT_FOCUS: "btn-area-1",
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
                    nextFocusRight: 'pharmacy-0',
                    backgroundImage: imgPrefix + 'area_btn.png',
                    focusImage: imgPrefix + 'area_btn_f.png',
                    //selectedImage: imgPrefix + 'area_btn_f.png',
                    focusChange: MenuList.cityFocus,
                    click: MenuList.oneCityClick,
                    beforeMoveChange: MenuList.switchPage,
                    cIdx: "",
                    groupId: "department",
                    cPosition: i, //位置编号
                }
            )
        }

        for (var i = 0; i < 4 ; i++) {
            buttons.push(
                {
                    id: "pharmacy-"+i,
                    name: '药店',
                    type: 'div',
                    nextFocusLeft: (i%2==1) ? 'pharmacy-' + (i-1) : "",
                    nextFocusRight: (i%2==0) ? 'pharmacy-' + (i+1) : "",
                    nextFocusUp: i >= 2 ?  'pharmacy-' + (i-2) : "",
                    nextFocusDown: i < 2 ? 'pharmacy-' + (i+2) : "",
                    focusChange: MenuList.oneCityFocus,
                    click: MenuList.onClickOrder,
                    beforeMoveChange: MenuList.switchPage,
                    cIdx: "",
                    cPosition: i,
                }
            )
        }
    },


    oneCityClick: function (btn) {
        LMEPG.BM.requestFocus("pharmacy-0");
    },

    oneCityFocus: function (btn, has) {
        if (has) {
            LMEPG.CssManager.addClass(btn.id, "pharmacy-frame");
            clearTimeout(controlFocus);
            controlFocus = setTimeout(function(){MenuList.replaceElement(btn.id, "span", "marquee");}, 3000);
            if(btn.id == "pharmacy-0"){
                G(MenuList.SELECT_FOCUS).style.color = "#1093ff";
                G(MenuList.SELECT_FOCUS).style.backgroundImage = 'url(' + imgPrefix + 'area_btn_select.png)';
            }
        } else {
            LMEPG.CssManager.removeClass(btn.id, "pharmacy-frame");
            MenuList.replaceElement(btn.id, "marquee", "span");
        }
    },

    cityFocus: function (btn, has) {
        if (has) {
            if (LMEPG.BM.getSelectedButton("department").id == btn.id) {
                if (MenuList.SELECT_PAGE == MenuList.CURRENT_PAGE) {
                    G(btn.id).style.color = "#fff";
                }
            }
            MenuList.SELECT_FOCUS = btn.id;
        } else {
            if (LMEPG.BM.getSelectedButton("department").id == btn.id) {
                if (MenuList.SELECT_PAGE == MenuList.CURRENT_PAGE) {

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
            }
            LMEPG.BM.requestFocus("btn-area-5");
        } else {
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

    /**
     * 跑马灯切换
     * @param currentDom
     * @param oldE
     * @param newE
     */
    replaceElement:function(currentDom, oldE, newE) {
        var current = currentDom.split("-")
        var focusDom = document.getElementById('row-1-'+current[1]);
        try {
                var oldElement = focusDom.getElementsByTagName(oldE)[0];
                var newElement = document.createElement(newE);
                newElement.innerText = oldElement.innerText;
                oldElement.innerText.length > 15 && (focusDom.replaceChild(newElement, oldElement));
                newElement.style.setProperty('position','absolute');
                newElement.style.setProperty('margin-top','4px');
                newElement.style.setProperty('width','250px');
                if (newE == "span"){
                    newElement.style.setProperty('white-space','nowrap');
                    newElement.style.setProperty('text-overflow','ellipsis');
                    newElement.style.setProperty('overflow','hidden');
                }
        } catch (e) {
            // nothing
        }
    },


        switchPage: function (dir, current) {
        switch (dir) {
            case "up":
                if (current.id == "btn-area-1") {
                    MenuList.prevPge();
                    if(MenuList.ISONEPAGE > 1){
                        Shop.getShop(G("btn-area-5").getAttribute("data-link"), "");
                        MenuList.ISONEPAGE--;
                    }
                    return false;
                }
                if(current.id != "pharmacy-0" && current.id != "pharmacy-1" && current.id != "pharmacy-2" && current.id != "pharmacy-3"){
                    Shop.getShop(G(current.nextFocusUp).getAttribute("data-link"), "");
                }

                break;
            case "down":
                if (current.id == "btn-area-5") {
                    MenuList.nextPge();
                    LMEPG.BM.requestFocus("btn-area-1");
                    Shop.getShop(G("btn-area-1").getAttribute("data-link"), "");
                    MenuList.ISONEPAGE++;
                }else{
                    if(current.id != "pharmacy-0" && current.id != "pharmacy-1" && current.id != "pharmacy-2" && current.id != "pharmacy-3") {
                        Shop.getShop(G(current.nextFocusDown).getAttribute("data-link"), "");
                    }
                }
                if ((Shop.SHOP_PAGE == Math.ceil(Shop.SHOP_DATA.length/4))&& (current.id == "pharmacy-1" ))  {
                    var currentId = current.id.split("-")
                    if(G(currentId[0]+"-"+(parseInt(currentId[1])+2)).style.display == "none"){
                        if(G(currentId[0]+"-"+(parseInt(currentId[1])+1)).style.display == "none"){
                            return  false;
                        }else{
                            LMEPG.BM.requestFocus(currentId[0]+"-"+(parseInt(currentId[1])+1));
                        }
                    }
                }
                if ((Shop.SHOP_PAGE == Math.ceil(Shop.SHOP_DATA.length/4))&& (current.id == "pharmacy-0" ))  {
                    var currentId = current.id.split("-");
                    if(G(currentId[0]+"-"+(parseInt(currentId[1])+2)).style.display == "none"){
                        return  false;
                    }
                }
                if (current.id == "pharmacy-0"||current.id == "pharmacy-1" ||current.id == "pharmacy-2")  {
                    var currentId = current.id.split("-")
                    if(G(currentId[0]+"-"+(parseInt(currentId[1])+1)).style.display == "none"){
                        return  false;
                    }
                }
                break;
            case "left":
                if ((current.id == "pharmacy-0" || current.id == "pharmacy-2") && (Shop.SHOP_PAGE == 1)) {
                    LMEPG.BM.requestFocus(MenuList.SELECT_FOCUS);
                    G(MenuList.SELECT_FOCUS).style.color = "#fff";
                }else if (current.id == "pharmacy-0" || current.id == "pharmacy-2") {
                    Shop.prevPge();
                }
                break;
            case "right":
                if(current.id.substring(0, 8) == "btn-area" && G("pharmacy-none").style.display != "none"){
                    return  false;
                }
                if ((Shop.SHOP_PAGE == Math.ceil(Shop.SHOP_DATA.length/4))&& current.id == "pharmacy-3")  {
                    return  false;
                }
                if ((Shop.SHOP_PAGE == Math.ceil(Shop.SHOP_DATA.length/4))&& current.id == "pharmacy-1")  {
                    var currentId = current.id.split("-");
                    if(G(currentId[0]+"-"+(parseInt(currentId[1])+1)).style.display == "none"){
                        return  false;
                    }
                }
                if (current.id == "pharmacy-1"||current.id == "pharmacy-3" ) {
                    Shop.nextPge();
                    if(Shop.SHOP_PAGE == Math.ceil(Shop.SHOP_DATA.length/4)){
                        if (current.id == "pharmacy-1" || current.id == "pharmacy-3"){
                            if(G("pharmacy-3").style.display == "none"){
                                LMEPG.BM.requestFocus("pharmacy-0");
                            }
                        }
                    }
                }

                if (current.id == "pharmacy-0"||current.id == "pharmacy-1" ||current.id == "pharmacy-2")  {
                    var currentId = current.id.split("-")
                    if(G(currentId[0]+"-"+(parseInt(currentId[1])+1)).style.display == "none"){
                        return  false;
                    }
                }
                if ((Shop.SHOP_PAGE == Math.ceil(Shop.SHOP_DATA.length/4))&& G(current.id).style.display == "none")  {
                    return  false;
                }
                break;
        }
    },
}

var Shop = {
    SHOP_PAGE: 1,
    PAGE: 4,
    SHOP_DATA: "",
    createShop: function () {
        if(Shop.SHOP_DATA.length<4){
            Shop.PAGE = Shop.SHOP_DATA.length - (Shop.SHOP_PAGE-1)*4;
        }

        for (i = 0; i < Shop.PAGE; i++) {
            G("pharmacy-"+i).style.display="none";
            var iState = Shop.introInfoOne(i);
            if(iState == 0){
                G("pharmacy-"+i).style.display="inline-block";
            }
        }

        G("page-index").innerHTML = Shop.SHOP_PAGE + "/" + Math.ceil(Shop.SHOP_DATA.length/4);
    },

    introInfoOne: function (id){
        var dom = G("intro-info-"+id);
        dom.innerHTML = "";
        var currentData = Shop.SHOP_DATA[id+((Shop.SHOP_PAGE-1)*4)];
        if(Shop.isEmpty(currentData)){
           return -1;
        }
        var strHtml = "";
        strHtml += '<div id="name">' + currentData.phar_name + '</div> <hr/>';
        strHtml += ' <div id="row-1-'+id+'" class="row-1"><img class="icon" src="' + imgPrefix + 'icon_address.png"/>&nbsp;&nbsp;';
        strHtml += '<span id="address"  style="position: absolute;margin-top: 4px;width: 250px;white-space: nowrap;text-overflow: ellipsis;overflow:hidden;">' + currentData.phar_addr + '</span></div>';
        //strHtml += '<span id="address"  style="position: absolute;margin-top: 4px;width: 250px;">' + subString(currentData.phar_addr,27,true) + '</span></div>';
        strHtml += ' <div id="row-2-'+id+'" class="row-2"><img class="icon" src="' + imgPrefix + 'icon_tel.png"/>&nbsp;&nbsp;';
        strHtml += ' <span id="tel">' + currentData.phar_tel + '</span> </div>';
        if(!Shop.isEmpty(currentData.marker)){
            var marker = JSON.parse(currentData.marker);
            if(marker.length == 2){
                if(marker[0]=="1"&&marker[1]=="2"){
                    strHtml += '<img src="__ROOT__/Public/img/hd/Menu/QHotherPages/24H_busine.png" alt="" style="position: relative;left: 271px;top: -110px;width: 15%;">';
                    strHtml += '<img  src="__ROOT__/Public/img/hd/Menu/QHotherPages/delivery.png" alt="" style="position: relative;left: 227px;top: -82px;width: 15%;">'
                }
                if(marker[0]==""&&marker[1]=="2"){
                    strHtml += '<img src="__ROOT__/Public/img/hd/Menu/QHotherPages/delivery.png" alt="" style="position: relative;left: 271px;top: -110px;width: 15%;">';
                }
                if(marker[0]=="1"&&marker[1]==""){
                    strHtml += '<img src="__ROOT__/Public/img/hd/Menu/QHotherPages/24H_busine.png" alt="" style="position: relative;left: 271px;top: -110px;width: 15%;">';
                }
           }else if(marker.length == 1){
                if (marker[0] == 1){
                    strHtml += '<img src="__ROOT__/Public/img/hd/Menu/QHotherPages/24H_busine.png" alt="" style="position: relative;left: 271px;top: -110px;width: 15%;">';
                }else{
                    strHtml += '<img src="__ROOT__/Public/img/hd/Menu/QHotherPages/delivery.png" alt="" style="position: relative;left: 271px;top: -110px;width: 15%;">';
                }
            }
        }
        dom.innerHTML = strHtml;
        return 0;
    },

    //    判断字符串是否为空
    isEmpty: function (value){
        if(typeof value == "undefined" || value == null || value == ""){
            return true;
        }else{
            return false;
        }
    },


    //    拉取商店
    getShop: function (city, area) {
        LMEPG.UI.showWaitingDialog();
        var reqData = {
            "cityCode": city,
            "areaCode": area,
            "curPage": 1//Shop.SHOP_PAGE
        };
        LMEPG.ajax.postAPI('NewActivity/getCityOfArea', reqData,
            function (rsp) {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                try {
                    if (data.result == 0) {
                        Shop.SHOP_DATA = data.list;
                        Shop.SHOP_PAGE = 1;
                        G("pharmacy-none").style.display="none";
                        Shop.createShop();
                        LMEPG.UI.dismissWaitingDialog();
                    } else {
                        for (i = 0; i < Shop.PAGE; i++) {
                            G("pharmacy-"+i).style.display="none";
                        }
                        G("page-index").innerHTML = "0/0";
                        //LMEPG.UI.showToast('药店信息为空！');
                        G("pharmacy-none").style.display="inline-block";
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
        if (Shop.SHOP_PAGE < Math.ceil(Shop.SHOP_DATA.length/4)) {
            Shop.SHOP_PAGE++;
            /*
            if (Shop.SHOP_PAGE > 5 && RenderParam.isVip == "0") {
                LMEPG.UI.commonDialog.show("订购成为VIP即可查看全部药房信息", ["确定", "取消"], function (index) {
                    if (index === 0) {
                        MenuList.jumpBuyVip();
                    }
                });
                return;
            }
            */
            Shop.createShop();
        }
    },
}

/**
 * 返回事件
 */
function onBack() {
    if (LMEPG.BM.getCurrentButton().id.substring(0, 8) == "btn-area") {
        LMEPG.Intent.back();
    } else {
        G(MenuList.SELECT_FOCUS).style.color = "#fff";
        LMEPG.BM.requestFocus(MenuList.SELECT_FOCUS);
    }
}

/**
 * 获得字符串长度
 */
function getLength(val) {
    var str = new String(val);
    var bytesCount = 0;
    for (var i = 0 ,n = str.length; i < n; i++) {
        var c = str.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            bytesCount += 1;
        } else {
            bytesCount += 2;
        }
    }
    return bytesCount;
}

/**
 * 字符串截取
 */
function subString(str, len, hasDot)  //js截取中英文字符串无乱码
{
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex,"**").length;
    for(var i = 0;i < strLength;i++){
        singleChar = str.charAt(i).toString();
        if(singleChar.match(chineseRegex) != null){
            newLength += 2;
        }else{
            newLength++;
        }
        if(newLength > len){
            break;
        }
        newStr += singleChar;
    }

    if(hasDot && strLength > len){
        newStr += "...";
    }
    return newStr;
}