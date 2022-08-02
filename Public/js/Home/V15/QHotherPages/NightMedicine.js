var buttons = [{
    id: 'focus-1',
    name: '',
    type: 'img',
    nextFocusLeft: '',
    nextFocusRight: 'focus-2',
    nextFocusUp: '',
    nextFocusDown: '',
    click: "",
    focusChange: onFocusChangeBg,
    beforeMoveChange: turnPage,
    moveChange: "",
    cIdx: ""
}, {
    id: 'focus-2',
    name: '',
    type: 'img',
    nextFocusLeft: 'focus-1',
    nextFocusRight: '',
    nextFocusUp: '',
    nextFocusDown: '',
    click: "",
    focusChange: onFocusChangeBg,
    beforeMoveChange: turnPage,
    moveChange: "",
    cIdx: ""
}];


var data = [{
    name: "西宁城西区佰世堂大药房",
    addr: "城西区金羚大街26号7号楼26—54号",
    tell: "0971-5316799"
}, {
    name: "西宁城西区百瑞堂大药房",
    addr: "城西区文成路B16—104号（海湖星城东门）",
    tell: "0971-8185833"
}, {
    name: " 西宁城西区祥达大药房",
    addr: "城西区胜利路西交通巷2号",
    tell: "0971-5316799"
}, {
    name: " 青海省新绿洲医药连锁有限公司新绿洲医药广场",
    addr: "城西区同仁路46号1号楼1单元46-2号",
    tell: "0971-8125743"
}, {
    name: "青海省富康医药连锁有限公司源丰医药超市",
    addr: "城西区胜利路30号",
    tell: "0971-6266659"
}, {
    name: "青海金珠药业连锁有限公司珍草堂大药房",
    addr: "城东区林安小区",
    tell: "0971-7614572"
}, {
    name: "西宁锦瑞堂医药商店",
    addr: "城东区七一东路18号7号楼18-58室",
    tell: "暂无"
}, {
    name: "青海富康医药连锁有限公司康仁堂大药房",
    addr: "城东区昆仑东路299号",
    tell: "暂无"
}, {
    name: "青海春天医药连锁有限公司春天医药广场",
    addr: "城中区西大街6-4号",
    tell: "0971-8213303"
}, {
    name: "西宁市城中区仁和大药房",
    addr: "城中区南山路8-10号",
    tell: "暂无"
}, {
    name: "青海省新绿洲医药连锁有限公司山川大药房",
    addr: "城北区朝阳西路59号山川住宅区",
    tell: "暂无"
}, {
    name: "  青海省佳农医药连锁有限公司中心店",
    addr: "城北区小桥大街46号",
    tell: "暂无"
}, {
    name: "  西宁城北康弘医药超市",
    addr: "城北区小桥大街30-8号",
    tell: "暂无"
}, {
    name: " 青海天奕医药连锁有限公司晨翔药房",
    addr: "大通县园林路付8号花儿步行街13-93号",
    tell: "暂无"
}, {
    name: "  青海省康宁医药连锁有限公司湟源店",
    addr: "湟源县建设东路",
    tell: "暂无"
}];

var page = 0;
var maxPage = Math.ceil(data.length / 2);

function renderPage() {
    var htm = '';
    var startIndex = page * 2;
    if(RenderParam.carrierId == "07430093"){
        maxPage = Math.ceil(dataList.length / 2);
        var renderData = dataList.slice(startIndex, startIndex + 2);
    }else{
        var renderData = data.slice(startIndex, startIndex + 2);
    }

    renderData.forEach(function (item, index) {
        htm += '<div id=focus-' + (index + 1) + '>';
        htm += '<div class="medicine-house-wrapper">';
        htm += '<img class="house-bg" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/medicineHouse.png" alt="">';
        //联通芒果TV添加24小时显示和配送
        if(RenderParam.carrierId == "07430093"){
            if (item.is_24open == 1){
                    htm += '<img class="busine-24h-true" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/24H_busine.png" alt="">';
                if(item.is_give == 1){
                    htm += '<img class="delivery-24h-true" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/delivery.png" alt="">';
                }else{
                    htm += '<img class="delivery-24h-false" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/delivery.png" alt="">';
                }
            }else{
                htm += '<img class="busine-24h-false" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/24H_busine.png" alt="">';
                if(item.is_give == 1){
                    htm += '<img class="delivery-24h-true-false" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/delivery.png" alt="">';
                }else{
                    htm += '<img class="delivery-24h-false" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/delivery.png" alt="">';
                }
            }
        }
        htm += '<ul class="medicine-house-desc">';
        htm += '<li class="house-name">';
        htm += '<span>' + item.name + '</span>';
        htm += '<li class="house-addr">';
        htm += '<span>' + item.addr + '</span>';
        htm += '<li class="house-tel">';
        htm += '<span>' + item.tell + '</span>';
        htm += '</ul></div></div>';
    });

    G("container").innerHTML = htm;
    G("page-index").innerText = page + 1 + "/" + maxPage;
    toggleArrow();

}

/**
 * 翻页
 */
function turnPage(direction, btn) {
    if (page !== 0 && direction === "left" && btn.id === "focus-1") {
        page--;
        renderPage();
        LMEPG.BM.requestFocus('focus-2');
        return false;
    }

    if (page + 1 !== maxPage && direction === "right" && btn.id === "focus-2") {
        page++;
        renderPage();
        LMEPG.BM.requestFocus('focus-1');
        return false;
    }
}

/**
 * 切换指示箭头
 */
function toggleArrow() {
    Show("prev-arrow");
    Show("next-arrow");
    if (page === 0) {
        Hide("prev-arrow");
    }
    if (page + 1 === maxPage) {
        Hide("next-arrow");
    }
}

/**
 * 获得焦点添加样式
 * @param btn
 * @param hasFocus
 */
var textOblur = null;
var controlFocus;
function onFocusChangeBg(btn, hasFocus) {
    var currentDom = G(btn.id);
    var focusDomLiName = currentDom.getElementsByClassName('house-name')[0];
    var focusDomLiAddr = currentDom.getElementsByClassName('house-addr')[0];
    var focusDomMarqueeName = focusDomLiName.getElementsByTagName('marquee')[0];
    var focusDomMarqueeAddr = focusDomLiAddr.getElementsByTagName('marquee')[0];
    if (hasFocus) {
        currentDom.className = "active";
        if(RenderParam.carrierId == '07430093'){
            clearTimeout(controlFocus);
            controlFocus = setTimeout(function(){replaceElement(currentDom, "span", "marquee");}, 3000);
        }else{
            replaceElement(currentDom, "span", "marquee");
        }
    } else {
        currentDom.className = "";
        if (focusDomMarqueeName) {
            focusDomLiName.innerHTML = '<span>' + focusDomMarqueeName.innerText + '</span>';
        }
        if (focusDomMarqueeAddr) {
            focusDomLiAddr.innerHTML = '<span>' + focusDomMarqueeAddr.innerText + '</span>';
        }

        // replaceElement(currentDom, "marquee", "span");
    }
}

/**
 * 跑马灯切换
 * @param currentDom
 * @param oldE
 * @param newE
 */
function replaceElement(currentDom, oldE, newE) {
    var focusDom = currentDom.getElementsByTagName('li');
    try {
        for (var i = 0; i < 2; i++) {
            var oldElement = focusDom[i].getElementsByTagName(oldE)[0];
            var newElement = document.createElement(newE);
            newElement.innerText = oldElement.innerText;
            oldElement.innerText.length > 11 && (focusDom[i].replaceChild(newElement, oldElement));
        }
    } catch (e) {
        // nothing
    }
}

function onBack() {
    LMEPG.Intent.back();
}