// 与米东版本不同的区域
var areaNames = ['fuyun', 'hongxing', 'mingde', 'tongren'];
var areaName = window.areaName ? window.areaName : getLocationString('areaName');

/**
 * 获取浏览器跳转设置的参数
 * @param name
 * @returns {*}
 */
function getLocationString(name) {

    var searchString = window.location.search.replace('?', '');
    var stageArray = searchString.split('&');
    var objData = {};
    var len = stageArray.length;
    while (len--) {
        var item = stageArray[len];
        var eqIndex = item.indexOf('=');
        var key = item.slice(0, eqIndex);
        objData[key] = item.slice(eqIndex + 1);
    }
    return objData[name];
}

// 不同UI效果、
function diff_UI() {
    if (areaName != "hongxing") {
        G('especially-department').parentNode.removeChild(G('especially-department'));
    }
    G('community-doctor').src = g_appRootPath + '/Public/img/hd/CommunityHospital/order-register.png';
}

// 不同按钮功能
function diff_button() {
    var btn_1, btn_2;
    // 1.社区医院按钮改为预约挂号，点击提示暂未开放
    btn_1 = LMEPG.BM.getButtonById('community-doctor');
    if(btn_1) {
        btn_1.focusImage = '/Public/img/hd/CommunityHospital/order-register-f.png';
        btn_1.backgroundImage = '/Public/img/hd/CommunityHospital/order-register.png';
        btn_1.click = function () {
            if (areaName == "mingde") {
                G("show-code").style.display = "block";
                LMEPG.ButtonManager.setKeyEventPause(true);
            } else {
                LMEPG.UI.showToast('功能暂未开放，敬请期待！', 2);
                return;
            }
        };
    }

    btn_2 = LMEPG.BM.getButtonById('health-education');
    btn_2.click = function () {
        var curr = CommunityHosp.currentPage();
        var addr = LMEPG.Intent.createIntent('album');
        addr.setParam('albumName', '39Featured');
        addr.setParam('areaName', areaName);
        LMEPG.Intent.jump(addr, curr);
    };
}

// 39精选、健康图文列表背景不同
function diff_39Featured() {
    if (areaNames.indexOf(areaName) > -1) {
        G('container').style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/hd/CommunityHospital/39Featured_bg.png)';
    }
}

if (location.search.indexOf('39Featured') !== -1) {
    diff_39Featured();
}
var temp = {
    marquee: marquee(),
}

