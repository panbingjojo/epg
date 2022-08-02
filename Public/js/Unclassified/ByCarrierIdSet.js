/**
 * 释放iframe资源
 */
function releaseFrame() {
    LMEPG.Log.info("releaseFrame!!!!!!!!!!!!!");
    LMEPG.PayFrame.releaseFrame();
}

/**
 * 通过区域ID 解决界面显示不同
 */
function byModuleSetRemoveId(callBack) {
    var win = window;
    // 首页Tab3 删掉家庭档案、专家约诊、查询及退订
    var removeHtmlDomArray = [];
    if (win.Tab0) {
        removeHtmlDomArray.push('tab3-link-5', 'tab3-link-6', 'tab3-link-4', 'tab3-link-3', 'tab3-help2', 'tab3-help3', 'tab3-help4');
    }
    // 搜索删掉医生、专家模块
    if (win.Search) {
        removeHtmlDomArray.push('doctor', 'expert');
        if (RenderParam.carrierId == '620092') {
            removeHtmlDomArray.push('gather-video', 'album');
        }
    }
    // 删掉收藏医生、专家模块
    if (win.Collect) {
        removeHtmlDomArray.push('nav-0', 'nav-2', 'nav-3');
        if (RenderParam.carrierId == '620092') {
            // 甘肃电信 保留视频选项
            removeHtmlDomArray.splice(removeHtmlDomArray.indexOf('nav-0'), 1);
        }
    }
    // 删掉多余帮助gif
    if (win.HelpModule) {
        removeHtmlDomArray.push('demo-4', 'demo-5');
    }
    callBack(removeHtmlDomArray);
}

function removeDomById(arr) {
    arr.forEach(function (t) {
        var item = G(t);
        if (item) {
            item.parentNode.removeChild(item);
        }
    });
}

/*改变帮助图文引用地址*/
function byModuleSetImageIndex(callBack) {
    var TP = RenderParam;
    var changeImgArray = [];
    if (window.Tab0) {
        changeImgArray.push({
            id: 'tab0-help3',
            src: g_appRootPath + '/Public/img/' + TP.platformType + '/Unclassified/V13/tab0_help3.png'
        });
    }

    if (window.HelpModule) {

        if (TP.carrierId == '320092' || TP.carrierId == '620092') HelpModule.maxCount = 4;
        if (TP.carrierId != '620092') {
            changeImgArray.push({id: 'demo-0', src: g_appRootPath + '/Public/img/' + TP.platformType + '/Unclassified/V13/demo0.gif'});
        }
        changeImgArray.push({id: 'demo-3', src: g_appRootPath + '/Public/img/' + TP.platformType + '/Unclassified/V13/demo3.gif'});

        if (TP.carrierId == '640094') {
            HelpModule.maxCount = 4;
            changeImgArray.push({
                id: 'demo-0',
                src: g_appRootPath + '/Public/img/' + TP.platformType + '/Unclassified/V13/640094/demo0.gif'
            });
            changeImgArray.push({
                id: 'demo-1',
                src: g_appRootPath + '/Public/img/' + TP.platformType + '/Unclassified/V13/640094/demo1.png'
            });
            changeImgArray.push({
                id: 'demo-2',
                src: g_appRootPath + '/Public/img/' + TP.platformType + '/Unclassified/V13/640094/demo2.png'
            });
            changeImgArray.push({
                id: 'demo-3',
                src: g_appRootPath + '/Public/img/' + TP.platformType + '/Unclassified/V13/640094/demo3.gif'
            });
        }
    }
    callBack(changeImgArray);
}

function changeImgById(arr) {
    arr.forEach(function (t) {
        var item = t;
        G(item.id).src = item.src;
    });
}

/*设置客服电话*/
function byCarrierIdSeServiceTel() {
    if (window.Tab0) {
        G('service-tel').innerHTML = '客服电话：025-86596073';
    }
}

if (RenderParam.carrierId == '640094' || RenderParam.carrierId == '620092') {
    byCarrierIdSeServiceTel();
    byModuleSetRemoveId(removeDomById);
    byModuleSetImageIndex(changeImgById);
}

// 去掉查询和退订入口
{
    var removeHtmlDomArray = [];
    if (window.Tab3) {
        removeHtmlDomArray.push('tab3-link-6');
        removeHtmlDomArray.push('tab3-link-5');
    }
    removeDomById(removeHtmlDomArray);
}

// 辽宁电信右上角只保留“搜索”按钮
if (RenderParam.carrierId == '210092') {
    var removeHtmlDomArray = [];
    removeHtmlDomArray.push('mark', 'vip', 'set', 'help');
    // 搜索删掉医生、专家模块
    if (window.Search) {
        removeHtmlDomArray.push('doctor', 'expert');
    }
    removeDomById(removeHtmlDomArray);
    var item = G('top-action-content-icons');
    if (item) {
        item.style.marginTop = RenderParam.platformType == 'hd' ? '20px' : '10px';
    }
}

if (RenderParam.carrierId == '610092') {
    var removeHtmlDomArray = [];
    removeHtmlDomArray.push('vip', 'help', 'join-vip');
    // 搜索删掉医生、专家模块
    if (window.Search) {
        removeHtmlDomArray.push('doctor', 'expert');
    }
    removeDomById(removeHtmlDomArray);
    // LMEPG.BM.getButtonById("mark").nextFocusRight="set";
    // var item = G('top-action-content-icons');
    // if (item) {
    //     item.style.marginTop = RenderParam.platformType == 'hd' ? '20px' : '10px';
    // }
}

// 海南，湖北，广西，陕西共同删除多余的帮助图文
function removeCommonDom() {
    var cid = ['410092', '420092', '450092', '610092'];
    var helpWrap = G('tab3-help');
    if (helpWrap && cid.indexOf(RenderParam.carrierId) > -1) {
        helpWrap.removeChild(G('tab3-help3'));
    }
}

// 陕西电信EPG
function by610092() {
    if (RenderParam.carrierId !== '610092') return;
    delNode('nav-2');
    delNode('nav-3');
}

// 广西电信EPG
function by450092() {
    if (RenderParam.carrierId !== '450092') return;
    if (document.title === '帮助carrierIdSet-v13') {
        delNode('item-1');
        LMEPG.BM._buttons['focus-0'].nextFocusRight = 'focus-2';
        LMEPG.BM._buttons['focus-2'].nextFocusLeft = 'focus-0';
    }

    if (document.title === '收藏carrierIdSet-V13') {
        delNode('nav-2');
        delNode('nav-3');
    }

    if (document.title === '搜索V13carrierIdSet') {
        delNode('doctor');
        delNode('expert');
    }
}

/**
 * 宁夏电信，不需要医生和专家导航标题
 */
function by640092() {
    if (RenderParam.carrierId == "640092") {
        delNode("doctor")
        delNode("expert")
    }
}

/**
 * 新疆电信EPG
 */
function by650092(){
    if (RenderParam.carrierId == '650092') {
        delNode('nav-3');
        delNode("expert")
    }
}
/**
 * 综合各个平台需要页面加载完成后执行的操作
 */
function loadByCarrierId() {
    by610092();
    by450092();
    by640092();
    by650092();
    removeCommonDom();
}

(function () {
    var carrierid = {
        "000051": {title: '中国联通EPG'},
        "320092": {title: '江苏电信EPG'},
        "210092": {title: '辽宁电信EPG'},
        "640092": {title: '宁夏电信EPG'},
        "640094": {title: '宁夏广电EPG'},
        "450092": {title: '广西电信EPG'},
        "420092": {title: '湖北电信EPG'},
        "410092": {title: '河南电信EPG'},
        "620092": {title: '甘肃电信EPG'},
        "610092": {title: '陕西电信EPG'},
        "440004": {title: '广东广电EPG'},
        "450094": {title: '广西广电EPG'},
        "370092": {title: '山东电信EPG'},
        "371092": {title: '山东电信EPG--海看'},
        "500092": {title: '重庆电信EPG'},
        "650092": {title: '新疆电信EPG'},
        "10220094": {title: '新疆电信EPG健康魔方'},

        "000709": {title: '展厅演示版本7'},
        "001006": {title: '中国联通OTT-apk'},
        "440001": {title: '广东移动APK'},
        "450001": {title: '广西移动APK'},
        "430002": {title: '湖南电信APK'},
        "371002": {title: '山东电信APK--海看'},
        "220001": {title: '吉林移动'},
        "000005": {title: '江苏电信apk--悦me'},
        "640001": {title: '宁夏移动apk'},
        "320013": {title: '浙江华数apk'},
        "150002": {title: '内蒙电信apk'},
        "450004": {title: '广西广电apk'},
        "01230001": {title: '黑龙江移动apk'},
        "320005": {title: '江苏电信OTT-apk'},
    };

    /*设置标题(避免歧义)*/
    document.title = carrierid[RenderParam.carrierId].title;
}());
